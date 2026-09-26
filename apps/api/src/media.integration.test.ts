import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import pino from "pino";
import sharp from "sharp";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";

import {
  errorEnvelopeSchema,
  mediaAssetListResponseSchema,
  mediaAssetResponseSchema,
  mediaReferenceResponseSchema,
} from "@fury/contracts";
import { createDatabaseClient } from "@fury/database";

import { createApp } from "./app.js";
import { createMediaConfig } from "./core/config/media.config.js";
import { createLogger } from "./infrastructure/logger/logger.js";
import { generateTokenPair } from "./infrastructure/security/jwt.service.js";

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl === undefined)
  throw new Error("Testcontainers DATABASE_URL is required.");
const database = createDatabaseClient(databaseUrl);
const fixtureRoot = mkdtempSync(join(tmpdir(), "fury-media-http-"));
const mediaRoot = join(fixtureRoot, "persistent");
mkdirSync(mediaRoot);
const app = createApp({
  database,
  logger: pino({ level: "silent" }),
  mediaConfig: createMediaConfig(mediaRoot),
  emailDelivery: {
    provider: "console",
    send: () => Promise.resolve({ providerMessageId: "test" }),
  },
});
const ownedUsers: string[] = [];
const ownedWorks: string[] = [];
const csrfToken = "media-http-csrf";

const createSession = async (
  role: "ADMIN" | "USER",
  status: "ACTIVE" | "SUSPENDED" = "ACTIVE",
) => {
  const id = randomUUID();
  ownedUsers.push(id);
  const user = await database.user.create({
    data: {
      id,
      email: `media-http-${id}@example.test`,
      fullName: "Media HTTP Test",
      passwordHash: "test-hash",
      role,
      status,
      emailVerifiedAt: new Date(),
    },
  });
  const token = generateTokenPair({
    userId: user.id,
    tokenId: randomUUID(),
    role: user.role,
    email: user.email,
    rememberMe: false,
    absoluteExpiresAt: new Date(Date.now() + 60_000),
  }).accessToken;
  return token;
};

afterAll(async () => {
  await database.mediaReferenceEvent.deleteMany({
    where: { actorUserId: { in: ownedUsers } },
  });
  await database.mediaReference.deleteMany({
    where: { workId: { in: ownedWorks } },
  });
  for (const id of ownedUsers) {
    await database.uploadAttempt.deleteMany({ where: { actorUserId: id } });
    await database.mediaAsset.deleteMany({ where: { uploadedByUserId: id } });
    await database.user.delete({ where: { id } });
  }
  await database.work.deleteMany({ where: { id: { in: ownedWorks } } });
  await database.$disconnect();
  rmSync(fixtureRoot, { recursive: true, force: true });
});

describe("private media HTTP boundary", () => {
  it("lets an active owner manage only their unbound avatar candidate", async () => {
    const ownerToken = await createSession("USER");
    const otherToken = await createSession("USER");
    const adminToken = await createSession("ADMIN");
    const inactiveToken = await createSession("USER", "SUSPENDED");
    const source = await sharp({
      create: { width: 256, height: 256, channels: 3, background: "blue" },
    })
      .png()
      .toBuffer();
    const uploadAvatar = (token: string, attemptId = randomUUID()) =>
      request(app)
        .post("/api/v1/media/assets")
        .set("Authorization", `Bearer ${token}`)
        .set("Cookie", `csrfToken=${csrfToken}`)
        .set("x-csrf-token", csrfToken)
        .set("Idempotency-Key", attemptId)
        .field("mediaClass", "user_avatar")
        .attach("file", source, {
          filename: "avatar.png",
          contentType: "image/png",
        });

    expect((await uploadAvatar(inactiveToken)).status).toBe(401);
    const uploaded = await uploadAvatar(ownerToken);
    expect(uploaded.status).toBe(201);
    const avatar = mediaAssetResponseSchema.parse(uploaded.body).data;
    expect(avatar.mediaClass).toBe("user_avatar");
    expect(JSON.stringify(uploaded.body)).not.toContain("ownerUserId");

    const listed = await request(app)
      .get("/api/v1/media/assets?scope=mine&mediaClass=user_avatar")
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(listed.status).toBe(200);
    expect(mediaAssetListResponseSchema.parse(listed.body).data.items).toEqual([
      avatar,
    ]);
    for (const token of [otherToken, adminToken]) {
      const metadata = await request(app)
        .get(`/api/v1/media/assets/${avatar.id}`)
        .set("Authorization", `Bearer ${token}`);
      const binary = await request(app)
        .get(avatar.contentPath)
        .set("Authorization", `Bearer ${token}`);
      const removal = await request(app)
        .delete(`/api/v1/media/assets/${avatar.id}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Cookie", `csrfToken=${csrfToken}`)
        .set("x-csrf-token", csrfToken);
      expect([metadata.status, binary.status, removal.status]).toEqual([
        404, 404, 404,
      ]);
    }
    expect(
      (
        await request(app)
          .delete(`/api/v1/media/assets/${avatar.id}`)
          .set("Authorization", `Bearer ${ownerToken}`)
      ).status,
    ).toBe(403);
    const removed = await request(app)
      .delete(`/api/v1/media/assets/${avatar.id}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .set("Cookie", `csrfToken=${csrfToken}`)
      .set("x-csrf-token", csrfToken);
    expect(removed.status).toBe(200);
    expect(removed.body).toMatchObject({
      data: { id: avatar.id, status: "removed" },
    });
    const repeated = await request(app)
      .delete(`/api/v1/media/assets/${avatar.id}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .set("Cookie", `csrfToken=${csrfToken}`)
      .set("x-csrf-token", csrfToken);
    expect(repeated.status).toBe(200);
    expect(
      (
        await request(app)
          .get(avatar.contentPath)
          .set("Authorization", `Bearer ${ownerToken}`)
      ).status,
    ).toBe(404);
  });

  it("uploads and delivers an administrator cover with private headers", async () => {
    const token = await createSession("ADMIN");
    const attemptId = randomUUID();
    const source = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "red" },
    })
      .jpeg()
      .toBuffer();
    const uploaded = await request(app)
      .post("/api/v1/media/assets")
      .set("Authorization", `Bearer ${token}`)
      .set("Cookie", `csrfToken=${csrfToken}`)
      .set("x-csrf-token", csrfToken)
      .set("Idempotency-Key", attemptId)
      .field("mediaClass", "work_cover")
      .attach("file", source, {
        filename: "cover.jpg",
        contentType: "image/jpeg",
      });
    expect(uploaded.status).toBe(201);
    const parsed = mediaAssetResponseSchema.parse(uploaded.body);
    const delivered = await request(app)
      .get(parsed.data.contentPath)
      .set("Authorization", `Bearer ${token}`);
    expect(delivered.status).toBe(200);
    expect(delivered.headers["cache-control"]).toBe("private, no-store");
    expect(delivered.headers["x-content-type-options"]).toBe("nosniff");
    expect(delivered.headers["content-type"]).toMatch(/^image\/jpeg/u);
    expect((await request(app).get(parsed.data.contentPath)).status).toBe(401);

    const restartedApp = createApp({
      database,
      logger: pino({ level: "silent" }),
      mediaConfig: createMediaConfig(mediaRoot),
      emailDelivery: {
        provider: "console",
        send: () => Promise.resolve({ providerMessageId: "test" }),
      },
    });
    const deliveredAfterRestart = await request(restartedApp)
      .get(parsed.data.contentPath)
      .set("Authorization", `Bearer ${token}`);
    expect(deliveredAfterRestart.status).toBe(200);
    expect(deliveredAfterRestart.body).toEqual(delivered.body);

    const attempted = await request(app)
      .get(`/api/v1/media/uploads/${attemptId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(attempted.status).toBe(200);
    expect(attempted.body).toMatchObject({
      data: { state: "accepted", assetId: parsed.data.id },
    });
    const repeated = await request(app)
      .post("/api/v1/media/assets")
      .set("Authorization", `Bearer ${token}`)
      .set("Cookie", `csrfToken=${csrfToken}`)
      .set("x-csrf-token", csrfToken)
      .set("Idempotency-Key", attemptId)
      .field("mediaClass", "work_cover")
      .attach("file", source, {
        filename: "cover.jpg",
        contentType: "image/jpeg",
      });
    expect(repeated.status).toBe(200);
    expect(mediaAssetResponseSchema.parse(repeated.body).data.id).toBe(
      parsed.data.id,
    );
    const listed = await request(app)
      .get("/api/v1/media/assets?scope=admin&mediaClass=work_cover")
      .set("Authorization", `Bearer ${token}`);
    expect(listed.status).toBe(200);
    expect(
      mediaAssetListResponseSchema.parse(listed.body).data.items,
    ).toContainEqual(parsed.data);
  });

  it.each([
    ["work_background", 1600, 900, 1],
    ["chapter_page", 600, 900, 1],
    ["avatar_frame", 256, 256, 0.5],
    ["comment_decoration", 128, 128, 0.5],
  ] as const)(
    "accepts a valid private %s image",
    async (mediaClass, width, height, alpha) => {
      const token = await createSession("ADMIN");
      const source = await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: { r: 200, g: 30, b: 40, alpha },
        },
      })
        .png()
        .toBuffer();
      const response = await request(app)
        .post("/api/v1/media/assets")
        .set("Authorization", `Bearer ${token}`)
        .set("Cookie", `csrfToken=${csrfToken}`)
        .set("x-csrf-token", csrfToken)
        .set("Idempotency-Key", randomUUID())
        .field("mediaClass", mediaClass)
        .attach("file", source, {
          filename: "media.png",
          contentType: "image/png",
        });
      expect(response.status).toBe(201);
      expect(
        mediaAssetResponseSchema.parse(response.body).data.mediaClass,
      ).toBe(mediaClass);
    },
  );

  it("denies ordinary users and missing CSRF before file parsing", async () => {
    const token = await createSession("USER");
    const denied = await request(app)
      .post("/api/v1/media/assets")
      .set("Authorization", `Bearer ${token}`)
      .set("Idempotency-Key", randomUUID())
      .field("mediaClass", "work_cover")
      .attach("file", Buffer.from("not-an-image"), "malicious.jpg");
    expect(denied.status).toBe(403);
    const admin = await createSession("ADMIN");
    const noCsrf = await request(app)
      .post("/api/v1/media/assets")
      .set("Authorization", `Bearer ${admin}`)
      .set("Idempotency-Key", randomUUID())
      .field("mediaClass", "work_cover")
      .attach("file", Buffer.from("not-an-image"), "malicious.jpg");
    expect(noCsrf.status).toBe(403);
    const adminId = ownedUsers.at(-1);
    if (adminId === undefined)
      throw new Error("Expected a test administrator.");
    expect(
      await database.mediaAsset.count({ where: { uploadedByUserId: adminId } }),
    ).toBe(0);
  });

  it("isolates attempt keys by administrator and keeps rejected keys terminal", async () => {
    const firstToken = await createSession("ADMIN");
    const secondToken = await createSession("ADMIN");
    const sharedAttemptId = randomUUID();
    const source = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "blue" },
    })
      .jpeg()
      .toBuffer();
    const upload = (
      token: string,
      attemptId: string,
      bytes: Buffer,
      filename = "cover.jpg",
    ) =>
      request(app)
        .post("/api/v1/media/assets")
        .set("Authorization", `Bearer ${token}`)
        .set("Cookie", `csrfToken=${csrfToken}`)
        .set("x-csrf-token", csrfToken)
        .set("Idempotency-Key", attemptId)
        .field("mediaClass", "work_cover")
        .attach("file", bytes, { filename, contentType: "image/jpeg" });

    const [first, second] = await Promise.all([
      upload(firstToken, sharedAttemptId, source),
      upload(secondToken, sharedAttemptId, source),
    ]);
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(mediaAssetResponseSchema.parse(first.body).data.id).not.toBe(
      mediaAssetResponseSchema.parse(second.body).data.id,
    );

    const rejectedKey = randomUUID();
    const rejected = await upload(
      firstToken,
      rejectedKey,
      Buffer.from("not-an-image"),
    );
    expect(rejected.status).toBe(400);
    const rejectedBody = errorEnvelopeSchema.parse(rejected.body);
    expect(rejectedBody.code).toBe("MEDIA_INVALID_FILE");
    expect(rejectedBody.requestId.length).toBeGreaterThan(0);
    expect(JSON.stringify(rejected.body)).not.toMatch(
      /relativeKey|sourceSha256|persistent/iu,
    );
    const conflicted = await upload(firstToken, rejectedKey, source);
    expect(conflicted.status).toBe(409);
    expect(conflicted.body).toMatchObject({ code: "UPLOAD_ATTEMPT_CONFLICT" });

    const empty = await request(app)
      .get(
        "/api/v1/media/assets?scope=admin&mediaClass=work_cover&page=999&limit=25",
      )
      .set("Authorization", `Bearer ${firstToken}`);
    expect(empty.status).toBe(200);
    expect(mediaAssetListResponseSchema.parse(empty.body).data.items).toEqual(
      [],
    );
  });

  it("converges simultaneous identical uploads for one actor on one accepted asset", async () => {
    const token = await createSession("ADMIN");
    const actorUserId = ownedUsers.at(-1);
    if (actorUserId === undefined) throw new Error("Expected media actor.");
    const attemptId = randomUUID();
    const source = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "navy" },
    })
      .jpeg()
      .toBuffer();
    const upload = () =>
      request(app)
        .post("/api/v1/media/assets")
        .set("Authorization", `Bearer ${token}`)
        .set("Cookie", `csrfToken=${csrfToken}`)
        .set("x-csrf-token", csrfToken)
        .set("Idempotency-Key", attemptId)
        .field("mediaClass", "work_cover")
        .attach("file", source, {
          filename: "cover.jpg",
          contentType: "image/jpeg",
        });

    const responses = await Promise.all([upload(), upload()]);
    expect(responses.some((response) => response.status === 201)).toBe(true);
    for (const response of responses) {
      expect([200, 201, 409]).toContain(response.status);
      if (response.status === 409) {
        expect(response.body).toMatchObject({ code: "UPLOAD_IN_PROGRESS" });
      }
    }
    const attempt = await database.uploadAttempt.findUniqueOrThrow({
      where: { actorUserId_id: { actorUserId, id: attemptId } },
    });
    expect(attempt.state).toBe("ACCEPTED");
    expect(
      await database.mediaAsset.count({
        where: { uploadedByUserId: actorUserId, status: "AVAILABLE" },
      }),
    ).toBe(1);
  });

  it("rejects an unsafe representative for every media class without available bytes", async () => {
    const cover = await sharp({
      create: { width: 800, height: 600, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    const background = await sharp({
      create: { width: 600, height: 900, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    const oversizedAvatar = await sharp({
      create: { width: 4097, height: 128, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    const opaque = await sharp({
      create: { width: 256, height: 256, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    const cases = [
      ["work_cover", "ADMIN", cover, "MEDIA_INVALID_FILE"],
      ["work_background", "ADMIN", background, "MEDIA_LIMIT_EXCEEDED"],
      [
        "chapter_page",
        "ADMIN",
        Buffer.from("MZ executable"),
        "MEDIA_INVALID_FILE",
      ],
      ["user_avatar", "USER", oversizedAvatar, "MEDIA_LIMIT_EXCEEDED"],
      ["avatar_frame", "ADMIN", opaque, "MEDIA_INVALID_FILE"],
      ["comment_decoration", "ADMIN", opaque, "MEDIA_INVALID_FILE"],
    ] as const;

    for (const [mediaClass, role, source, expectedCode] of cases) {
      const token = await createSession(role);
      const actorUserId = ownedUsers.at(-1);
      if (actorUserId === undefined) throw new Error("Expected media actor.");
      const attemptId = randomUUID();
      const response = await request(app)
        .post("/api/v1/media/assets")
        .set("Authorization", `Bearer ${token}`)
        .set("Cookie", `csrfToken=${csrfToken}`)
        .set("x-csrf-token", csrfToken)
        .set("Idempotency-Key", attemptId)
        .field("mediaClass", mediaClass)
        .attach("file", source, {
          filename: "candidate.png",
          contentType: "image/png",
        });
      expect(errorEnvelopeSchema.parse(response.body).code, mediaClass).toBe(
        expectedCode,
      );
      const attempt = await database.uploadAttempt.findUniqueOrThrow({
        where: { actorUserId_id: { actorUserId, id: attemptId } },
      });
      expect(attempt.state, mediaClass).toBe("REJECTED");
      expect(attempt.assetId).not.toBeNull();
      if (attempt.assetId === null) throw new Error("Expected reserved asset.");
      const asset = await database.mediaAsset.findUniqueOrThrow({
        where: { id: attempt.assetId },
      });
      expect(asset.status, mediaClass).toBe("REMOVED");
      expect(existsSync(join(mediaRoot, `${asset.id}.bin`)), mediaClass).toBe(
        false,
      );
      const unavailable = await request(app)
        .get(`/api/v1/media/assets/${asset.id}/content`)
        .set("Authorization", `Bearer ${token}`);
      expect(unavailable.status, mediaClass).toBe(404);
      expect(JSON.stringify(response.body)).not.toMatch(
        /MZ executable|relativeKey|sourceSha256|persistent|candidate\.png/iu,
      );
    }
  });

  it("rejects missing, duplicate, out-of-order, and path-bearing multipart parts", async () => {
    const token = await createSession("USER");
    const valid = await sharp({
      create: { width: 256, height: 256, channels: 3, background: "blue" },
    })
      .png()
      .toBuffer();
    const base = (attemptId: string) =>
      request(app)
        .post("/api/v1/media/assets")
        .set("Authorization", `Bearer ${token}`)
        .set("Cookie", `csrfToken=${csrfToken}`)
        .set("x-csrf-token", csrfToken)
        .set("Idempotency-Key", attemptId);

    const missingClass = await base(randomUUID()).attach("file", valid, {
      filename: "avatar.png",
      contentType: "image/png",
    });
    const missingFile = await base(randomUUID()).field(
      "mediaClass",
      "user_avatar",
    );
    const duplicateClass = await base(randomUUID())
      .field("mediaClass", "user_avatar")
      .field("mediaClass", "user_avatar")
      .attach("file", valid, {
        filename: "avatar.png",
        contentType: "image/png",
      });
    const outOfOrder = await base(randomUUID())
      .attach("file", valid, {
        filename: "avatar.png",
        contentType: "image/png",
      })
      .field("mediaClass", "user_avatar");
    const pathName = await base(randomUUID())
      .field("mediaClass", "user_avatar")
      .attach("file", valid, {
        filename: "%2e%2e%2favatar.png",
        contentType: "image/png",
      });

    for (const response of [missingClass, duplicateClass, outOfOrder]) {
      expect(response.status).toBe(400);
      const parsedError = errorEnvelopeSchema.parse(response.body);
      expect(parsedError.code).toBe("VALIDATION_ERROR");
      expect(parsedError.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "body.mediaClass" }),
        ]),
      );
    }
    expect(missingFile.status).toBe(400);
    expect(errorEnvelopeSchema.parse(missingFile.body).errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "body.file" })]),
    );
    expect(pathName.status).toBe(400);
    expect(pathName.body).toMatchObject({ code: "MEDIA_INVALID_FILE" });
    expect(JSON.stringify(pathName.body)).not.toContain("%2e%2e%2f");
  });

  it("applies the actor upload rate bound before multipart parsing", async () => {
    const token = await createSession("USER");
    for (let index = 0; index < 20; index += 1) {
      const response = await request(app)
        .post("/api/v1/media/assets")
        .set("Authorization", `Bearer ${token}`)
        .set("Cookie", `csrfToken=${csrfToken}`)
        .set("x-csrf-token", csrfToken)
        .set("Idempotency-Key", randomUUID())
        .send({ mediaClass: "user_avatar" });
      expect(response.status).toBe(400);
    }
    const limited = await request(app)
      .post("/api/v1/media/assets")
      .set("Authorization", `Bearer ${token}`)
      .set("Cookie", `csrfToken=${csrfToken}`)
      .set("x-csrf-token", csrfToken)
      .set("Idempotency-Key", randomUUID())
      .send({ mediaClass: "user_avatar" });
    expect(limited.status).toBe(429);
    expect(limited.body).toMatchObject({ code: "RATE_LIMIT_EXCEEDED" });
  });

  it("omits token, CSRF, file, parser, and storage details from responses and logs", async () => {
    const lines: string[] = [];
    const loggedApp = createApp({
      database,
      logger: createLogger({
        level: "info",
        destination: { write: (line: string) => lines.push(line) },
      }),
      mediaConfig: createMediaConfig(mediaRoot),
      emailDelivery: {
        provider: "console",
        send: () => Promise.resolve({ providerMessageId: "test" }),
      },
    });
    const token = await createSession("USER");
    const privateCsrf = "private-csrf-sentinel";
    const privateFile = Buffer.from("private-file-content-sentinel");
    const response = await request(loggedApp)
      .post("/api/v1/media/assets")
      .set("Authorization", `Bearer ${token}`)
      .set("Cookie", `csrfToken=${privateCsrf}`)
      .set("x-csrf-token", privateCsrf)
      .set("Idempotency-Key", randomUUID())
      .field("mediaClass", "user_avatar")
      .attach("file", privateFile, {
        filename: "%2e%2e%2fprivate.png",
        contentType: "image/png",
      });
    expect(response.status).toBe(400);
    const combined = `${JSON.stringify(response.body)}\n${lines.join("\n")}`;
    expect(combined).not.toContain(token);
    expect(combined).not.toContain(privateCsrf);
    expect(combined).not.toContain("private-file-content-sentinel");
    expect(combined).not.toContain("%2e%2e%2fprivate.png");
    expect(combined).not.toContain(mediaRoot);
    expect(combined).not.toMatch(/Busboy|relativeKey|sourceSha256/iu);
  });

  it("binds, replaces, protects, and retires an administrator reference through HTTP", async () => {
    const token = await createSession("ADMIN");
    const userToken = await createSession("USER");
    const work = await database.work.create({
      data: {
        title: "HTTP reference",
        slug: `http-reference-${randomUUID()}`,
        type: "MANGA",
        storyStatus: "ONGOING",
      },
    });
    ownedWorks.push(work.id);
    const upload = async (color: string) => {
      const source = await sharp({
        create: { width: 600, height: 800, channels: 3, background: color },
      })
        .jpeg()
        .toBuffer();
      const response = await request(app)
        .post("/api/v1/media/assets")
        .set("Authorization", `Bearer ${token}`)
        .set("Cookie", `csrfToken=${csrfToken}`)
        .set("x-csrf-token", csrfToken)
        .set("Idempotency-Key", randomUUID())
        .field("mediaClass", "work_cover")
        .attach("file", source, {
          filename: "cover.jpg",
          contentType: "image/jpeg",
        });
      expect(response.status).toBe(201);
      return mediaAssetResponseSchema.parse(response.body).data;
    };
    const first = await upload("red");
    const second = await upload("blue");
    const bindBody = {
      targetKind: "work_cover",
      targetId: work.id,
      assetId: first.id,
    };
    expect(
      (
        await request(app)
          .post("/api/v1/media/references")
          .set("Authorization", `Bearer ${token}`)
          .send(bindBody)
      ).status,
    ).toBe(403);
    expect(
      (
        await request(app)
          .get(
            `/api/v1/media/references?targetKind=work_cover&targetId=${work.id}`,
          )
          .set("Authorization", `Bearer ${userToken}`)
      ).status,
    ).toBe(403);
    const bind = () =>
      request(app)
        .post("/api/v1/media/references")
        .set("Authorization", `Bearer ${token}`)
        .set("Cookie", `csrfToken=${csrfToken}`)
        .set("x-csrf-token", csrfToken)
        .send(bindBody);
    const duplicateBinds = await Promise.all([bind(), bind()]);
    expect(duplicateBinds.map((response) => response.status).sort()).toEqual([
      200, 201,
    ]);
    const boundResponse = duplicateBinds.find(
      (response) => response.status === 201,
    );
    if (boundResponse === undefined) throw new Error("Expected created bind.");
    const bound = mediaReferenceResponseSchema.parse(boundResponse.body).data;
    const inUse = await request(app)
      .delete(`/api/v1/media/assets/${first.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Cookie", `csrfToken=${csrfToken}`)
      .set("x-csrf-token", csrfToken);
    expect(inUse.status).toBe(409);
    expect(inUse.body).toMatchObject({ code: "MEDIA_IN_USE" });
    const restartedApp = createApp({
      database,
      logger: pino({ level: "silent" }),
      mediaConfig: createMediaConfig(mediaRoot),
      emailDelivery: {
        provider: "console",
        send: () => Promise.resolve({ providerMessageId: "test" }),
      },
    });
    expect((await request(restartedApp).get(first.contentPath)).status).toBe(
      401,
    );
    const readAfterRestart = await request(restartedApp)
      .get(first.contentPath)
      .set("Authorization", `Bearer ${token}`);
    expect(readAfterRestart.status).toBe(200);
    const referenceAfterRestart = await request(restartedApp)
      .get(`/api/v1/media/references?targetKind=work_cover&targetId=${work.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(referenceAfterRestart.body).toMatchObject({
      data: { reference: { id: bound.id, assetId: first.id, version: 0 } },
    });

    const replaced = await request(app)
      .put(`/api/v1/media/references/${bound.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Cookie", `csrfToken=${csrfToken}`)
      .set("x-csrf-token", csrfToken)
      .send({
        assetId: second.id,
        expectedAssetId: first.id,
        expectedVersion: 0,
      });
    expect(replaced.status).toBe(200);
    expect(replaced.body).toMatchObject({
      data: { assetId: second.id, version: 1 },
    });
    const stale = await request(app)
      .put(`/api/v1/media/references/${bound.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Cookie", `csrfToken=${csrfToken}`)
      .set("x-csrf-token", csrfToken)
      .send({
        assetId: first.id,
        expectedAssetId: first.id,
        expectedVersion: 0,
      });
    expect(stale.status).toBe(409);
    expect(stale.body).toMatchObject({ code: "VERSION_CONFLICT" });
    const retired = await request(app)
      .delete(`/api/v1/media/references/${bound.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Cookie", `csrfToken=${csrfToken}`)
      .set("x-csrf-token", csrfToken)
      .send({ expectedAssetId: second.id, expectedVersion: 1 });
    expect(retired.status).toBe(200);
    expect(retired.body).toMatchObject({
      data: { status: "retired", version: 2 },
    });
    expect(
      (
        await request(app)
          .delete(`/api/v1/media/assets/${second.id}`)
          .set("Authorization", `Bearer ${token}`)
          .set("Cookie", `csrfToken=${csrfToken}`)
          .set("x-csrf-token", csrfToken)
      ).status,
    ).toBe(200);
  });
});

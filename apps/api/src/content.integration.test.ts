import { randomUUID } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import pino from "pino";
import request, { type Response as SupertestResponse } from "supertest";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { z } from "zod";

import {
  accountResponseSchemas,
  adminCategoryDataSchema as categoryDataSchema,
  adminChapterDataSchema as chapterDataSchema,
  adminWorkDataSchema as workDataSchema,
  contentOperationErrorCodeSchema,
  errorEnvelopeSchema,
  publicationTransitionDataSchema as transitionDataSchema,
  publicChapterDataSchema,
  publicChapterListDataSchema,
  publicWorkDataSchema,
  publicWorkListDataSchema,
  successEnvelopeSchema,
} from "@fury/contracts";
import { createDatabaseClient, UserRole, UserStatus } from "@fury/database";

import { createApp } from "./app.js";
import { createMediaConfig } from "./core/config/media.config.js";
import { rateLimitConfig } from "./core/config/rate-limit.config.js";
import type { EmailDelivery } from "./infrastructure/email/email-delivery.js";
import type { EmailSendRequest } from "./infrastructure/email/email-delivery.js";
import { createLogger } from "./infrastructure/logger/logger.js";
import { generateTokenPair } from "./infrastructure/security/jwt.service.js";

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl === undefined) {
  throw new Error("The Testcontainers DATABASE_URL was not provided.");
}

const database = createDatabaseClient(databaseUrl);
const mediaFixtureRoot = mkdtempSync(join(tmpdir(), "fury-content-media-"));
const mediaRoot = join(mediaFixtureRoot, "persistent");
mkdirSync(mediaRoot);
const mediaConfig = createMediaConfig(mediaRoot);
const delivered: EmailSendRequest[] = [];
const emailDelivery: EmailDelivery = {
  provider: "console",
  send: (message) => {
    delivered.push(message);
    return Promise.resolve({ providerMessageId: "content-test" });
  },
};
const app = createApp({
  database,
  logger: pino({ level: "silent" }),
  emailDelivery,
  mediaConfig,
});

const csrfToken = "content-integration-csrf";

const tokenFromLastEmail = (): string => {
  const html = delivered.at(-1)?.html;
  const match = html?.match(/token=([^"&<]+)/u);
  if (match?.[1] === undefined) {
    throw new Error("Expected a token in the captured email.");
  }
  return decodeURIComponent(match[1]);
};

const setCookies = (response: SupertestResponse): string[] => {
  const value: unknown = response.headers["set-cookie"];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : typeof value === "string"
      ? [value]
      : [];
};

const cookieValue = (response: SupertestResponse, name: string): string => {
  const pair = setCookies(response)
    .map((cookie) => cookie.split(";")[0] ?? "")
    .find((cookie) => cookie.startsWith(name + "="));
  if (pair === undefined) throw new Error("Missing " + name + " cookie.");
  return decodeURIComponent(pair.slice(pair.indexOf("=") + 1));
};

const parseErrorBody = (response: { readonly body: unknown }) => {
  const envelope = errorEnvelopeSchema.parse(response.body);
  contentOperationErrorCodeSchema.parse(envelope.code);
  return envelope;
};

const parseSuccessData = <T>(
  response: { readonly body: unknown },
  schema: z.ZodType<T>,
): T => {
  const envelope = successEnvelopeSchema.parse(response.body);
  return schema.parse(envelope.data);
};

const createIdentity = async (
  role: UserRole,
  status: UserStatus = UserStatus.ACTIVE,
  verified = true,
  claimedRole: UserRole = role,
) => {
  const suffix =
    role.toLowerCase() + "-" + status.toLowerCase() + "-" + randomUUID();
  const user = await database.user.create({
    data: {
      email: suffix + "@content.example",
      passwordHash: "test-only-hash",
      fullName: suffix + " content user",
      role,
      status,
      emailVerifiedAt: verified ? new Date() : null,
    },
  });
  const token = generateTokenPair({
    userId: user.id,
    tokenId: randomUUID(),
    role: claimedRole,
    email: user.email,
    rememberMe: false,
    absoluteExpiresAt: new Date(Date.now() + 60_000),
  }).accessToken;
  return { user, token };
};

const authorize = (test: request.Test, token: string): request.Test =>
  test
    .set("Authorization", "Bearer " + token)
    .set("Cookie", "csrfToken=" + csrfToken)
    .set("x-csrf-token", csrfToken);

const createIllustratedAggregate = async (token: string) => {
  const categoryResponse = await authorize(
    request(app).post("/api/v1/content/admin/categories"),
    token,
  ).send({ displayName: "Action", slug: "action" });
  expect(categoryResponse.status).toBe(201);
  const categoryId = parseSuccessData(categoryResponse, categoryDataSchema)
    .category.id;

  const workResponse = await authorize(
    request(app).post("/api/v1/content/admin/works"),
    token,
  ).send({
    title: "HTTP Work",
    slug: "http-work",
    type: "manga",
    storyStatus: "ongoing",
  });
  expect(workResponse.status).toBe(201);
  const workId = parseSuccessData(workResponse, workDataSchema).work.id;

  const assigned = await authorize(
    request(app).put("/api/v1/content/admin/works/" + workId + "/categories"),
    token,
  ).send({ expectedVersion: 0, categoryIds: [categoryId] });
  expect(assigned.status).toBe(200);
  const assignedWork = parseSuccessData(assigned, workDataSchema).work;

  const chapterResponse = await authorize(
    request(app).post("/api/v1/content/admin/works/" + workId + "/chapters"),
    token,
  ).send({ number: 1, pages: [{ position: 2 }, { position: 1 }] });
  expect(chapterResponse.status).toBe(201);
  const chapter = parseSuccessData(chapterResponse, chapterDataSchema).chapter;

  return {
    categoryId,
    workId,
    workVersion: assignedWork.version,
    chapterId: chapter.id,
    chapterVersion: chapter.version,
  };
};

describe("real HTTP content boundary", () => {
  beforeEach(async () => {
    delivered.length = 0;
    await database.$executeRawUnsafe(
      "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_categories, categories, works, refresh_tokens, users",
    );
  });

  afterAll(async () => {
    await database.$disconnect();
    rmSync(mediaFixtureRoot, { recursive: true, force: true });
  });

  it("applies authentication and ADMIN denial before target lookup", async () => {
    const missingId = "11111111-1111-4111-8111-111111111111";
    const anonymous = await request(app).get(
      "/api/v1/content/admin/works/" + missingId,
    );
    expect(anonymous.status).toBe(401);
    expect(parseErrorBody(anonymous).code).toBe("UNAUTHORIZED");

    const identity = await createIdentity(UserRole.USER);
    const denied = await request(app)
      .get("/api/v1/content/admin/works/" + missingId)
      .set("Authorization", "Bearer " + identity.token);
    expect(denied.status).toBe(403);
    const deniedBody = parseErrorBody(denied);
    expect(deniedBody.code).toBe("FORBIDDEN");
    expect(deniedBody.requestId).toBe(denied.headers["x-request-id"]);
  });

  it("requires matching CSRF for unsafe ADMIN requests", async () => {
    const identity = await createIdentity(UserRole.ADMIN);
    const denied = await request(app)
      .post("/api/v1/content/admin/categories")
      .set("Authorization", "Bearer " + identity.token)
      .send({ displayName: "Action", slug: "action" });
    expect(denied.status).toBe(403);
    expect(parseErrorBody(denied).code).toBe("FORBIDDEN");
    const mismatched = await request(app)
      .post("/api/v1/content/admin/categories")
      .set("Authorization", "Bearer " + identity.token)
      .set("Cookie", "csrfToken=" + csrfToken)
      .set("x-csrf-token", "different-token")
      .send({ displayName: "Action", slug: "action" });
    expect(mismatched.status).toBe(403);
    expect(parseErrorBody(mismatched).code).toBe("FORBIDDEN");
    await expect(database.category.count()).resolves.toBe(0);
  });

  it("keeps every management family server-authoritative before lookup", async () => {
    const admin = await createIdentity(UserRole.ADMIN);
    const aggregate = await createIllustratedAggregate(admin.token);
    const pending = await createIdentity(
      UserRole.ADMIN,
      UserStatus.PENDING_VERIFICATION,
      false,
    );
    const suspended = await createIdentity(
      UserRole.ADMIN,
      UserStatus.SUSPENDED,
    );
    const user = await createIdentity(UserRole.USER);
    const forged = await createIdentity(
      UserRole.USER,
      UserStatus.ACTIVE,
      true,
      UserRole.ADMIN,
    );
    const stale = await createIdentity(UserRole.ADMIN);
    await database.user.delete({ where: { id: stale.user.id } });
    const missingId = "11111111-1111-4111-8111-111111111111";
    const protectedTargets = [
      "/api/v1/content/admin/categories",
      "/api/v1/content/admin/categories/" + aggregate.categoryId,
      "/api/v1/content/admin/categories/" + missingId,
      "/api/v1/content/admin/works",
      "/api/v1/content/admin/works/" + aggregate.workId,
      "/api/v1/content/admin/works/" + missingId,
      "/api/v1/content/admin/works/" + aggregate.workId + "/chapters",
      "/api/v1/content/admin/works/" +
        aggregate.workId +
        "/chapters/" +
        aggregate.chapterId,
      "/api/v1/content/admin/works/" +
        aggregate.workId +
        "/chapters/" +
        missingId,
    ];
    const unsafeTargets = [
      {
        path: "/api/v1/content/admin/categories/" + aggregate.categoryId,
        body: { expectedVersion: 0, displayName: "Action" },
      },
      {
        path: "/api/v1/content/admin/categories/" + missingId,
        body: { expectedVersion: 0, displayName: "Missing" },
      },
      {
        path: "/api/v1/content/admin/works/" + aggregate.workId,
        body: { expectedVersion: aggregate.workVersion, title: "HTTP Work" },
      },
      {
        path: "/api/v1/content/admin/works/" + missingId,
        body: { expectedVersion: 0, title: "Missing" },
      },
      {
        path:
          "/api/v1/content/admin/works/" +
          aggregate.workId +
          "/chapters/" +
          aggregate.chapterId,
        body: { expectedVersion: aggregate.chapterVersion, number: 1 },
      },
      {
        path:
          "/api/v1/content/admin/works/" +
          aggregate.workId +
          "/chapters/" +
          missingId,
        body: { expectedVersion: 0, number: 1 },
      },
    ];
    const createAndRelationTargets = [
      {
        method: "post",
        path: "/api/v1/content/admin/categories",
        body: { displayName: "Extra Category", slug: "extra-category" },
        successStatus: 201,
        missing: false,
      },
      {
        method: "post",
        path: "/api/v1/content/admin/works",
        body: {
          title: "Extra Work",
          slug: "extra-work",
          type: "manga",
          storyStatus: "ongoing",
        },
        successStatus: 201,
        missing: false,
      },
      {
        method: "put",
        path: "/api/v1/content/admin/works/" + aggregate.workId + "/categories",
        body: {
          expectedVersion: aggregate.workVersion,
          categoryIds: [aggregate.categoryId],
        },
        successStatus: 200,
        missing: false,
      },
      {
        method: "put",
        path: "/api/v1/content/admin/works/" + missingId + "/categories",
        body: { expectedVersion: 0, categoryIds: [] },
        successStatus: 404,
        missing: true,
      },
      {
        method: "post",
        path: "/api/v1/content/admin/works/" + aggregate.workId + "/chapters",
        body: { number: 2, pages: [{ position: 1 }] },
        successStatus: 201,
        missing: false,
      },
      {
        method: "post",
        path: "/api/v1/content/admin/works/" + missingId + "/chapters",
        body: { number: 1, pages: [{ position: 1 }] },
        successStatus: 404,
        missing: true,
      },
    ] as const;
    const publicationTargets = [
      {
        path:
          "/api/v1/content/admin/works/" + aggregate.workId + "/publication",
        body: {
          expectedVersion: aggregate.workVersion,
          targetState: "draft",
        },
      },
      {
        path: "/api/v1/content/admin/works/" + missingId + "/publication",
        body: { expectedVersion: 0, targetState: "draft" },
      },
      {
        path:
          "/api/v1/content/admin/works/" +
          aggregate.workId +
          "/chapters/" +
          aggregate.chapterId +
          "/publication",
        body: {
          expectedVersion: aggregate.chapterVersion,
          targetState: "draft",
        },
      },
      {
        path:
          "/api/v1/content/admin/works/" +
          aggregate.workId +
          "/chapters/" +
          missingId +
          "/publication",
        body: { expectedVersion: 0, targetState: "draft" },
      },
    ];
    const deniedActors = [
      { token: undefined, status: 401, code: "UNAUTHORIZED" },
      { token: "invalid-token", status: 401, code: "UNAUTHORIZED" },
      { token: stale.token, status: 401, code: "UNAUTHORIZED" },
      { token: pending.token, status: 401, code: "UNAUTHORIZED" },
      { token: suspended.token, status: 401, code: "UNAUTHORIZED" },
      { token: user.token, status: 403, code: "FORBIDDEN" },
      { token: forged.token, status: 403, code: "FORBIDDEN" },
    ] as const;

    for (const actor of deniedActors) {
      const actorApp = createApp({
        database,
        logger: pino({ level: "silent" }),
        emailDelivery,
        mediaConfig,
      });
      for (const path of protectedTargets) {
        const pendingRequest = request(actorApp).get(path);
        if (actor.token !== undefined) {
          pendingRequest.set("Authorization", "Bearer " + actor.token);
        }
        const denied = await pendingRequest;
        expect(denied.status, path).toBe(actor.status);
        expect(parseErrorBody(denied).code, path).toBe(actor.code);
        expect(parseErrorBody(denied).requestId).toBe(
          denied.headers["x-request-id"],
        );
      }
      for (const target of unsafeTargets) {
        const pendingRequest = request(actorApp)
          .patch(target.path)
          .set("Cookie", "csrfToken=" + csrfToken)
          .set("x-csrf-token", csrfToken)
          .send(target.body);
        if (actor.token !== undefined) {
          pendingRequest.set("Authorization", "Bearer " + actor.token);
        }
        const denied = await pendingRequest;
        expect(denied.status, target.path).toBe(actor.status);
        expect(parseErrorBody(denied).code, target.path).toBe(actor.code);
      }
      for (const target of publicationTargets) {
        const pendingRequest = request(actorApp)
          .put(target.path)
          .set("Cookie", "csrfToken=" + csrfToken)
          .set("x-csrf-token", csrfToken)
          .send(target.body);
        if (actor.token !== undefined) {
          pendingRequest.set("Authorization", "Bearer " + actor.token);
        }
        const denied = await pendingRequest;
        expect(denied.status, target.path).toBe(actor.status);
        expect(parseErrorBody(denied).code, target.path).toBe(actor.code);
      }
      for (const target of createAndRelationTargets) {
        const pendingRequest =
          target.method === "post"
            ? request(actorApp).post(target.path)
            : request(actorApp).put(target.path);
        pendingRequest
          .set("Cookie", "csrfToken=" + csrfToken)
          .set("x-csrf-token", csrfToken)
          .send(target.body);
        if (actor.token !== undefined) {
          pendingRequest.set("Authorization", "Bearer " + actor.token);
        }
        const denied = await pendingRequest;
        expect(denied.status, target.path).toBe(actor.status);
        expect(parseErrorBody(denied).code, target.path).toBe(actor.code);
      }
    }

    await expect(database.category.count()).resolves.toBe(1);
    await expect(database.work.count()).resolves.toBe(1);
    await expect(database.chapter.count()).resolves.toBe(1);
    await expect(database.publicationEvent.count()).resolves.toBe(0);

    const adminApp = createApp({
      database,
      logger: pino({ level: "silent" }),
      emailDelivery,
      mediaConfig,
    });
    for (const path of protectedTargets) {
      const response = await request(adminApp)
        .get(path)
        .set("Authorization", "Bearer " + admin.token);
      const missingTarget = path.endsWith(missingId);
      expect(response.status, path).toBe(missingTarget ? 404 : 200);
    }
    for (const target of unsafeTargets) {
      const response = await authorize(
        request(adminApp).patch(target.path),
        admin.token,
      ).send(target.body);
      expect(response.status, target.path).toBe(
        target.path.endsWith(missingId) ? 404 : 200,
      );
    }
    for (const target of publicationTargets) {
      const response = await authorize(
        request(adminApp).put(target.path),
        admin.token,
      ).send(target.body);
      const missingTarget = target.path.includes(missingId);
      expect(response.status, target.path).toBe(missingTarget ? 404 : 200);
    }
    for (const target of createAndRelationTargets) {
      const pendingRequest =
        target.method === "post"
          ? request(adminApp).post(target.path)
          : request(adminApp).put(target.path);
      const response = await authorize(pendingRequest, admin.token).send(
        target.body,
      );
      expect(response.status, target.path).toBe(target.successStatus);
      if (target.missing) {
        expect(parseErrorBody(response).code).toBe("NOT_FOUND");
      }
    }
    await expect(database.publicationEvent.count()).resolves.toBe(0);
  });

  it("returns the central rate-limit envelope with request identity", async () => {
    const isolatedApp = createApp({
      database,
      logger: pino({ level: "silent" }),
      emailDelivery,
      mediaConfig,
    });
    for (let attempt = 0; attempt < rateLimitConfig.maxRequests; attempt += 1) {
      const allowed = await request(isolatedApp).get("/api/v1/content/works");
      expect(allowed.status).toBe(200);
    }
    const limited = await request(isolatedApp).get("/api/v1/content/works");
    expect(limited.status).toBe(429);
    expect(parseErrorBody(limited)).toMatchObject({
      code: "RATE_LIMIT_EXCEEDED",
      requestId: limited.headers["x-request-id"],
      path: "/api/v1/content/works",
    });
  });

  it("redacts credential sentinels from serialized logs and safe errors", async () => {
    const serializedLogs: string[] = [];
    const observedApp = createApp({
      database,
      logger: createLogger({
        level: "info",
        pretty: false,
        destination: {
          write(message: string) {
            serializedLogs.push(message);
          },
        },
      }),
      emailDelivery,
      mediaConfig,
    });
    const sentinel = "P01-SECRET-SENTINEL";
    const rejected = await request(observedApp)
      .get("/api/v1/content/works")
      .query({ token: sentinel });
    expect(rejected.status).toBe(400);
    expect(parseErrorBody(rejected).code).toBe("VALIDATION_ERROR");
    expect(JSON.stringify(rejected.body)).not.toContain(sentinel);

    const nestedFailure = Object.assign(new Error("Failure " + sentinel), {
      config: {
        headers: { authorization: sentinel },
        url: "/callback?token=" + sentinel,
        data: { password: sentinel },
      },
    });
    const transaction = vi
      .spyOn(database, "$transaction")
      .mockRejectedValueOnce(nestedFailure);
    const failed = await request(observedApp).get("/api/v1/content/works");
    transaction.mockRestore();

    expect(failed.status).toBe(500);
    expect(parseErrorBody(failed)).toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      requestId: failed.headers["x-request-id"],
    });
    expect(JSON.stringify(failed.body)).not.toContain(sentinel);
    expect(serializedLogs.join("")).not.toContain(sentinel);
  });

  it("creates and reconnects the foundational aggregate through ADMIN routes", async () => {
    const identity = await createIdentity(UserRole.ADMIN);
    const aggregate = await createIllustratedAggregate(identity.token);

    const read = await request(app)
      .get("/api/v1/content/admin/works/" + aggregate.workId)
      .set("Authorization", "Bearer " + identity.token);
    expect(read.status).toBe(200);
    expect(parseSuccessData(read, workDataSchema).work).toMatchObject({
      id: aggregate.workId,
      categories: [{ id: aggregate.categoryId }],
    });
    const chapter = await request(app)
      .get(
        "/api/v1/content/admin/works/" +
          aggregate.workId +
          "/chapters/" +
          aggregate.chapterId,
      )
      .set("Authorization", "Bearer " + identity.token);
    expect(chapter.status).toBe(200);
    expect(parseSuccessData(chapter, chapterDataSchema).chapter.pages).toEqual([
      expect.objectContaining({ position: 1 }),
      expect.objectContaining({ position: 2 }),
    ]);

    await database.$disconnect();
    await database.$connect();
    await expect(
      database.work.findUniqueOrThrow({
        where: { id: aggregate.workId },
        include: { categories: true, chapters: { include: { pages: true } } },
      }),
    ).resolves.toMatchObject({
      categories: [{ categoryId: aggregate.categoryId }],
      chapters: [{ id: aggregate.chapterId }],
    });
  });

  it("returns stable immutable, validation, and authorized not-found outcomes", async () => {
    const identity = await createIdentity(UserRole.ADMIN);
    const aggregate = await createIllustratedAggregate(identity.token);

    const duplicateCategory = await authorize(
      request(app).post("/api/v1/content/admin/categories"),
      identity.token,
    ).send({ displayName: "Duplicate Action", slug: "action" });
    expect(duplicateCategory.status).toBe(409);
    expect(parseErrorBody(duplicateCategory).code).toBe("CONTENT_CONFLICT");
    const duplicateWork = await authorize(
      request(app).post("/api/v1/content/admin/works"),
      identity.token,
    ).send({
      title: "Duplicate Work",
      slug: "http-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    expect(duplicateWork.status).toBe(409);
    expect(parseErrorBody(duplicateWork).code).toBe("CONTENT_CONFLICT");

    const immutable = await authorize(
      request(app).patch("/api/v1/content/admin/works/" + aggregate.workId),
      identity.token,
    ).send({ expectedVersion: aggregate.workVersion, type: "novel" });
    expect(immutable.status).toBe(409);
    expect(parseErrorBody(immutable).code).toBe("CONTENT_IMMUTABLE");

    const duplicateIds = await authorize(
      request(app).put(
        "/api/v1/content/admin/works/" + aggregate.workId + "/categories",
      ),
      identity.token,
    ).send({
      expectedVersion: aggregate.workVersion,
      categoryIds: [aggregate.categoryId, aggregate.categoryId],
    });
    expect(duplicateIds.status).toBe(400);
    expect(parseErrorBody(duplicateIds)).toMatchObject({
      code: "VALIDATION_ERROR",
      errors: [expect.objectContaining({ field: "body.categoryIds.1" })],
    });

    const missing = await request(app)
      .get("/api/v1/content/admin/works/11111111-1111-4111-8111-111111111111")
      .set("Authorization", "Bearer " + identity.token);
    expect(missing.status).toBe(404);
    expect(parseErrorBody(missing).code).toBe("NOT_FOUND");
  });

  it("returns the same success for simultaneous identical category replacements", async () => {
    const identity = await createIdentity(UserRole.ADMIN);
    const categoryResponse = await authorize(
      request(app).post("/api/v1/content/admin/categories"),
      identity.token,
    ).send({ displayName: "Concurrent", slug: "concurrent" });
    const category = parseSuccessData(
      categoryResponse,
      categoryDataSchema,
    ).category;
    const workResponse = await authorize(
      request(app).post("/api/v1/content/admin/works"),
      identity.token,
    ).send({
      title: "Concurrent Work",
      slug: "concurrent-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const work = parseSuccessData(workResponse, workDataSchema).work;
    const replacement = () =>
      authorize(
        request(app).put(
          "/api/v1/content/admin/works/" + work.id + "/categories",
        ),
        identity.token,
      ).send({ expectedVersion: 0, categoryIds: [category.id] });

    const responses = await Promise.all([replacement(), replacement()]);

    expect(responses.map(({ status }) => status)).toEqual([200, 200]);
    for (const response of responses) {
      expect(parseSuccessData(response, workDataSchema).work).toMatchObject({
        id: work.id,
        version: 1,
        categories: [{ id: category.id }],
      });
    }
    await expect(
      database.work.findUniqueOrThrow({
        where: { id: work.id },
        include: { categories: true },
      }),
    ).resolves.toMatchObject({
      version: 1,
      categories: [{ categoryId: category.id }],
    });
  });

  it("publishes allowlisted metadata credential-free and hides it identically", async () => {
    const identity = await createIdentity(UserRole.ADMIN);
    const aggregate = await createIllustratedAggregate(identity.token);

    const hidden = await request(app).get("/api/v1/content/works/http-work");
    expect(hidden.status).toBe(404);
    expect(parseErrorBody(hidden).code).toBe("NOT_FOUND");

    const workPublication = await authorize(
      request(app).put(
        "/api/v1/content/admin/works/" + aggregate.workId + "/publication",
      ),
      identity.token,
    ).send({
      expectedVersion: aggregate.workVersion,
      targetState: "published",
    });
    expect(workPublication.status).toBe(200);
    const chapterPublication = await authorize(
      request(app).put(
        "/api/v1/content/admin/works/" +
          aggregate.workId +
          "/chapters/" +
          aggregate.chapterId +
          "/publication",
      ),
      identity.token,
    ).send({
      expectedVersion: aggregate.chapterVersion,
      targetState: "published",
    });
    expect(chapterPublication.status).toBe(200);

    const anonymousWork = await request(app).get(
      "/api/v1/content/works/http-work",
    );
    const publicWork = await request(app)
      .get("/api/v1/content/works/http-work")
      .set("Authorization", "Bearer invalid-ignored-public-token");
    const ambientAdminWork = await request(app)
      .get("/api/v1/content/works/http-work")
      .set("Authorization", "Bearer " + identity.token)
      .set("Cookie", "csrfToken=" + csrfToken);
    expect(publicWork.status).toBe(200);
    expect(ambientAdminWork.status).toBe(200);
    const publicWorkBody = parseSuccessData(publicWork, publicWorkDataSchema);
    expect(parseSuccessData(anonymousWork, publicWorkDataSchema)).toEqual(
      publicWorkBody,
    );
    expect(parseSuccessData(ambientAdminWork, publicWorkDataSchema)).toEqual(
      publicWorkBody,
    );
    expect(publicWorkBody.work).not.toHaveProperty("version");
    expect(publicWorkBody.work).not.toHaveProperty("publicationStatus");
    const publicChapter = await request(app).get(
      "/api/v1/content/works/http-work/chapters/1",
    );
    expect(publicChapter.status).toBe(200);
    const publicChapterBody = parseSuccessData(
      publicChapter,
      publicChapterDataSchema,
    );
    expect(publicChapterBody.chapter).not.toHaveProperty("pages");
    expect(publicChapterBody.chapter).not.toHaveProperty("textContent");
    const publicWorks = await request(app).get("/api/v1/content/works");
    expect(
      parseSuccessData(publicWorks, publicWorkListDataSchema),
    ).toMatchObject({
      items: [{ id: aggregate.workId }],
      pagination: { total: 1 },
    });
    const publicChapters = await request(app).get(
      "/api/v1/content/works/http-work/chapters",
    );
    expect(
      parseSuccessData(publicChapters, publicChapterListDataSchema),
    ).toMatchObject({
      items: [{ id: aggregate.chapterId, workId: aggregate.workId }],
      pagination: { total: 1 },
    });

    const repeated = await authorize(
      request(app).put(
        "/api/v1/content/admin/works/" +
          aggregate.workId +
          "/chapters/" +
          aggregate.chapterId +
          "/publication",
      ),
      identity.token,
    ).send({
      expectedVersion: aggregate.chapterVersion,
      targetState: "published",
    });
    expect(
      parseSuccessData(repeated, transitionDataSchema).transition.transitioned,
    ).toBe(false);

    const unpublished = await authorize(
      request(app).put(
        "/api/v1/content/admin/works/" + aggregate.workId + "/publication",
      ),
      identity.token,
    ).send({
      expectedVersion: parseSuccessData(workPublication, transitionDataSchema)
        .transition.version,
      targetState: "draft",
    });
    expect(unpublished.status).toBe(200);
    const nowHidden = await request(app).get("/api/v1/content/works/http-work");
    const unknown = await request(app).get(
      "/api/v1/content/works/unknown-work",
    );
    expect({
      status: nowHidden.status,
      code: parseErrorBody(nowHidden).code,
    }).toEqual({ status: unknown.status, code: parseErrorBody(unknown).code });
  });

  it("rejects publishing an empty illustrated draft without an event", async () => {
    const identity = await createIdentity(UserRole.ADMIN);
    const work = await authorize(
      request(app).post("/api/v1/content/admin/works"),
      identity.token,
    ).send({
      title: "Empty Work",
      slug: "empty-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const workId = parseSuccessData(work, workDataSchema).work.id;
    const chapter = await authorize(
      request(app).post("/api/v1/content/admin/works/" + workId + "/chapters"),
      identity.token,
    ).send({ number: 1 });
    const chapterId = parseSuccessData(chapter, chapterDataSchema).chapter.id;

    const rejected = await authorize(
      request(app).put(
        "/api/v1/content/admin/works/" +
          workId +
          "/chapters/" +
          chapterId +
          "/publication",
      ),
      identity.token,
    ).send({ expectedVersion: 0, targetState: "published" });
    expect(rejected.status).toBe(409);
    expect(parseErrorBody(rejected).code).toBe("CONTENT_TRANSITION_CONFLICT");
    await expect(database.publicationEvent.count()).resolves.toBe(0);
    await expect(
      database.chapter.findUniqueOrThrow({ where: { id: chapterId } }),
    ).resolves.toMatchObject({
      publicationStatus: "DRAFT",
      version: 0,
    });
  });

  it("recovers archived Works only through draft and records real republishes", async () => {
    const identity = await createIdentity(UserRole.ADMIN);
    const aggregate = await createIllustratedAggregate(identity.token);
    const publicationPath =
      "/api/v1/content/admin/works/" + aggregate.workId + "/publication";
    const publishedResponse = await authorize(
      request(app).put(publicationPath),
      identity.token,
    ).send({
      expectedVersion: aggregate.workVersion,
      targetState: "published",
    });
    const published = parseSuccessData(
      publishedResponse,
      transitionDataSchema,
    ).transition;
    const archivedResponse = await authorize(
      request(app).put(publicationPath),
      identity.token,
    ).send({ expectedVersion: published.version, targetState: "archived" });
    const archived = parseSuccessData(
      archivedResponse,
      transitionDataSchema,
    ).transition;
    const repeatedArchive = await authorize(
      request(app).put(publicationPath),
      identity.token,
    ).send({ expectedVersion: published.version, targetState: "archived" });
    expect(
      parseSuccessData(repeatedArchive, transitionDataSchema).transition,
    ).toMatchObject({ transitioned: false, version: archived.version });

    const forbiddenRepublish = await authorize(
      request(app).put(publicationPath),
      identity.token,
    ).send({ expectedVersion: archived.version, targetState: "published" });
    expect(forbiddenRepublish.status).toBe(409);
    expect(parseErrorBody(forbiddenRepublish).code).toBe(
      "CONTENT_TRANSITION_CONFLICT",
    );
    const restoredResponse = await authorize(
      request(app).put(publicationPath),
      identity.token,
    ).send({ expectedVersion: archived.version, targetState: "draft" });
    const restored = parseSuccessData(
      restoredResponse,
      transitionDataSchema,
    ).transition;
    const republishedResponse = await authorize(
      request(app).put(publicationPath),
      identity.token,
    ).send({ expectedVersion: restored.version, targetState: "published" });
    const republished = parseSuccessData(
      republishedResponse,
      transitionDataSchema,
    ).transition;
    expect(republished.publicationEventId).not.toBe(
      published.publicationEventId,
    );
    await expect(
      database.publicationEvent.count({
        where: { workId: aggregate.workId },
      }),
    ).resolves.toBe(2);
  });

  it("enforces text Chapter structure and preserves content after stale or invalid updates", async () => {
    const identity = await createIdentity(UserRole.ADMIN);
    const workResponse = await authorize(
      request(app).post("/api/v1/content/admin/works"),
      identity.token,
    ).send({
      title: "Structured Work",
      slug: "structured-work",
      type: "text-story",
      storyStatus: "ongoing",
    });
    const workId = parseSuccessData(workResponse, workDataSchema).work.id;
    const firstDocument = {
      version: 1,
      blocks: [{ type: "paragraph", content: [{ text: "النص الأول" }] }],
    };
    const chapterResponse = await authorize(
      request(app).post("/api/v1/content/admin/works/" + workId + "/chapters"),
      identity.token,
    ).send({ number: 1, textContent: firstDocument });
    expect(chapterResponse.status).toBe(201);
    const chapter = parseSuccessData(
      chapterResponse,
      chapterDataSchema,
    ).chapter;

    const secondDocument = {
      version: 1,
      blocks: [{ type: "heading", level: 3, text: "النص المعدل" }],
    };
    const chapterPath =
      "/api/v1/content/admin/works/" + workId + "/chapters/" + chapter.id;
    const updatedResponse = await authorize(
      request(app).patch(chapterPath),
      identity.token,
    ).send({ expectedVersion: 0, textContent: secondDocument });
    expect(updatedResponse.status).toBe(200);
    expect(
      parseSuccessData(updatedResponse, chapterDataSchema).chapter,
    ).toMatchObject({ textContent: secondDocument, version: 1 });

    const stale = await authorize(
      request(app).patch(chapterPath),
      identity.token,
    ).send({ expectedVersion: 0, number: 2 });
    expect(stale.status).toBe(409);
    expect(parseErrorBody(stale).code).toBe("CONTENT_STALE_WRITE");

    const unsafeLink = await authorize(
      request(app).patch(chapterPath),
      identity.token,
    ).send({
      expectedVersion: 1,
      textContent: {
        version: 1,
        blocks: [
          {
            type: "paragraph",
            content: [{ text: "unsafe", href: "https://example.com" }],
          },
        ],
      },
    });
    expect(unsafeLink.status).toBe(400);
    expect(parseErrorBody(unsafeLink)).toMatchObject({
      code: "VALIDATION_ERROR",
      errors: [
        expect.objectContaining({
          field: "body.textContent.blocks.0.content.0.href",
        }),
      ],
    });
    await expect(
      database.chapter.findUniqueOrThrow({ where: { id: chapter.id } }),
    ).resolves.toMatchObject({ textContent: secondDocument, version: 1 });
  });

  it("distinguishes omitted illustrated pages from invalid submitted representations", async () => {
    const identity = await createIdentity(UserRole.ADMIN);
    const workResponse = await authorize(
      request(app).post("/api/v1/content/admin/works"),
      identity.token,
    ).send({
      title: "Illustrated Boundary Work",
      slug: "illustrated-boundary-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const workId = parseSuccessData(workResponse, workDataSchema).work.id;

    const omitted = await authorize(
      request(app).post("/api/v1/content/admin/works/" + workId + "/chapters"),
      identity.token,
    ).send({ number: 1 });
    expect(omitted.status).toBe(201);
    expect(parseSuccessData(omitted, chapterDataSchema).chapter.pages).toEqual(
      [],
    );

    for (const body of [
      { number: 2, pages: [] },
      { number: 0 },
      { number: 1.5 },
      { number: 2_147_483_648 },
      { number: 2, contentType: "illustrated" },
      { number: 2, pages: null },
    ]) {
      const rejected = await authorize(
        request(app).post(
          "/api/v1/content/admin/works/" + workId + "/chapters",
        ),
        identity.token,
      ).send(body);
      expect(rejected.status).toBe(400);
      expect(parseErrorBody(rejected).code).toBe("VALIDATION_ERROR");
    }

    const mismatched = await authorize(
      request(app).post("/api/v1/content/admin/works/" + workId + "/chapters"),
      identity.token,
    ).send({
      number: 2,
      textContent: {
        version: 1,
        blocks: [{ type: "paragraph", content: [{ text: "text" }] }],
      },
    });
    expect(mismatched.status).toBe(409);
    expect(parseErrorBody(mismatched).code).toBe("CONTENT_TYPE_CONFLICT");
    await expect(
      database.chapter.findMany({
        where: { workId },
        orderBy: { number: "asc" },
      }),
    ).resolves.toMatchObject([{ number: 1, version: 0 }]);
  });

  it("completes the real ADMIN to public text-story acceptance journey", async () => {
    const agent = request.agent(app);
    const registration = {
      fullName: "P01 Acceptance Admin",
      email: "p01.acceptance@example.com",
      password: "p01-acceptance-password",
    };
    const registered = await agent
      .post("/api/v1/auth/register")
      .send(registration);
    expect(registered.status).toBe(201);
    const verified = await agent
      .post("/api/v1/auth/verify-email")
      .query({ token: tokenFromLastEmail() })
      .send({});
    expect(verified.status).toBe(200);
    await database.user.update({
      where: { email: registration.email },
      data: { role: UserRole.ADMIN },
    });

    const login = await agent.post("/api/v1/auth/login").send({
      email: registration.email,
      password: registration.password,
      rememberMe: false,
    });
    expect(login.status).toBe(200);
    const loginData = parseSuccessData(
      login,
      accountResponseSchemas.authSessionData,
    );
    const sessionCsrf = cookieValue(login, "csrfToken");
    const authorizeAgent = (test: request.Test): request.Test =>
      test
        .set("Authorization", "Bearer " + loginData.tokens.accessToken)
        .set("x-csrf-token", sessionCsrf);

    const categoryResponse = await authorizeAgent(
      agent.post("/api/v1/content/admin/categories"),
    ).send({ displayName: "قصص نصية", slug: "text-stories" });
    expect(categoryResponse.status).toBe(201);
    const category = parseSuccessData(
      categoryResponse,
      categoryDataSchema,
    ).category;

    const workResponse = await authorizeAgent(
      agent.post("/api/v1/content/admin/works"),
    ).send({
      title: "رحلة القبول",
      slug: "acceptance-story",
      type: "text-story",
      storyStatus: "ongoing",
    });
    expect(workResponse.status).toBe(201);
    const work = parseSuccessData(workResponse, workDataSchema).work;

    const assignedResponse = await authorizeAgent(
      agent.put("/api/v1/content/admin/works/" + work.id + "/categories"),
    ).send({ expectedVersion: work.version, categoryIds: [category.id] });
    expect(assignedResponse.status).toBe(200);
    const assignedWork = parseSuccessData(
      assignedResponse,
      workDataSchema,
    ).work;

    const document = {
      version: 1,
      blocks: [
        { type: "heading", level: 2, text: "الفصل الأول" },
        {
          type: "paragraph",
          content: [{ text: "هذه حقيقة محفوظة وليست بيانات تجريبية." }],
        },
      ],
    };
    const chapterResponse = await authorizeAgent(
      agent.post("/api/v1/content/admin/works/" + work.id + "/chapters"),
    ).send({ number: 1, textContent: document });
    expect(chapterResponse.status).toBe(201);
    const chapter = parseSuccessData(
      chapterResponse,
      chapterDataSchema,
    ).chapter;

    const hidden = await request(app).get(
      "/api/v1/content/works/acceptance-story",
    );
    expect(hidden.status).toBe(404);
    expect(parseErrorBody(hidden).code).toBe("NOT_FOUND");

    const publishedWorkResponse = await authorizeAgent(
      agent.put("/api/v1/content/admin/works/" + work.id + "/publication"),
    ).send({
      expectedVersion: assignedWork.version,
      targetState: "published",
    });
    const publishedWork = parseSuccessData(
      publishedWorkResponse,
      transitionDataSchema,
    ).transition;
    expect(publishedWork.transitioned).toBe(true);

    const publishedChapterResponse = await authorizeAgent(
      agent.put(
        "/api/v1/content/admin/works/" +
          work.id +
          "/chapters/" +
          chapter.id +
          "/publication",
      ),
    ).send({ expectedVersion: chapter.version, targetState: "published" });
    const publishedChapter = parseSuccessData(
      publishedChapterResponse,
      transitionDataSchema,
    ).transition;
    expect(publishedChapter.transitioned).toBe(true);

    const publicWork = await request(app).get(
      "/api/v1/content/works/acceptance-story",
    );
    expect(publicWork.status).toBe(200);
    expect(parseSuccessData(publicWork, publicWorkDataSchema).work).toEqual(
      expect.objectContaining({
        id: work.id,
        slug: "acceptance-story",
        categories: [expect.objectContaining({ id: category.id })],
      }),
    );
    const publicChapter = await request(app).get(
      "/api/v1/content/works/acceptance-story/chapters/1",
    );
    expect(publicChapter.status).toBe(200);
    const publicChapterBody = parseSuccessData(
      publicChapter,
      publicChapterDataSchema,
    ).chapter;
    expect(publicChapterBody).not.toHaveProperty("textContent");
    expect(publicChapterBody).not.toHaveProperty("version");

    const repeatedChapterResponse = await authorizeAgent(
      agent.put(
        "/api/v1/content/admin/works/" +
          work.id +
          "/chapters/" +
          chapter.id +
          "/publication",
      ),
    ).send({ expectedVersion: chapter.version, targetState: "published" });
    const repeatedChapter = parseSuccessData(
      repeatedChapterResponse,
      transitionDataSchema,
    ).transition;
    expect(repeatedChapter).toMatchObject({
      transitioned: false,
      publicationEventId: publishedChapter.publicationEventId,
    });

    const unpublishedWorkResponse = await authorizeAgent(
      agent.put("/api/v1/content/admin/works/" + work.id + "/publication"),
    ).send({ expectedVersion: publishedWork.version, targetState: "draft" });
    expect(unpublishedWorkResponse.status).toBe(200);
    const nowHidden = await request(app).get(
      "/api/v1/content/works/acceptance-story",
    );
    const unknown = await request(app).get(
      "/api/v1/content/works/unknown-acceptance-story",
    );
    expect({
      status: nowHidden.status,
      code: parseErrorBody(nowHidden).code,
    }).toEqual({ status: unknown.status, code: parseErrorBody(unknown).code });

    await database.$disconnect();
    await database.$connect();
    await expect(
      database.work.findUniqueOrThrow({
        where: { id: work.id },
        include: {
          categories: true,
          chapters: true,
          publicationEvents: true,
        },
      }),
    ).resolves.toMatchObject({
      publicationStatus: "DRAFT",
      publishedAt: null,
      currentPublicationEventId: null,
      categories: [{ categoryId: category.id }],
      chapters: [
        expect.objectContaining({
          id: chapter.id,
          publicationStatus: "PUBLISHED",
          textContent: document,
        }),
      ],
      publicationEvents: [
        expect.objectContaining({ id: publishedWork.publicationEventId }),
      ],
    });
    await expect(
      database.publicationEvent.count({
        where: { OR: [{ workId: work.id }, { chapterId: chapter.id }] },
      }),
    ).resolves.toBe(2);
  });
});

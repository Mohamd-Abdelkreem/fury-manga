import { randomUUID } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import sharp from "sharp";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

import { createDatabaseClient } from "@fury/database";

import { createMediaConfig } from "../../core/config/media.config.js";
import { AppError } from "../../core/errors/app.error.js";
import { MediaStorage } from "../../infrastructure/media/media-storage.js";
import { MediaService } from "./media.service.js";
import { CategoryManagementService } from "../content/category-management.service.js";
import { WorkManagementService } from "../content/work-management.service.js";

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl === undefined)
  throw new Error("Testcontainers DATABASE_URL is required.");

const database = createDatabaseClient(databaseUrl);
const fixtureRoot = mkdtempSync(join(tmpdir(), "fury-media-service-"));
const mediaRoot = join(fixtureRoot, "persistent");
mkdirSync(mediaRoot);
const storage = new MediaStorage(createMediaConfig(mediaRoot));
const service = new MediaService(database, storage);
const works = new WorkManagementService(database, service);
const categories = new CategoryManagementService(database);
const userIds: string[] = [];

const createActor = async (
  role: "ADMIN" | "USER" = "ADMIN",
  status: "ACTIVE" | "SUSPENDED" = "ACTIVE",
): Promise<string> => {
  const id = randomUUID();
  userIds.push(id);
  await database.user.create({
    data: {
      id,
      email: `media-${id}@example.test`,
      fullName: "Media Admin",
      passwordHash: "test-hash",
      role,
      status,
      emailVerifiedAt: new Date(),
    },
  });
  return id;
};

afterAll(async () => {
  await database.$executeRawUnsafe(
    "TRUNCATE media_reference_events, media_references, publication_events, work_categories, categories, works CASCADE",
  );
  for (const id of userIds) {
    await database.uploadAttempt.deleteMany({ where: { actorUserId: id } });
    await database.mediaAsset.deleteMany({ where: { uploadedByUserId: id } });
    await database.user.delete({ where: { id } });
  }
  await database.$disconnect();
  rmSync(fixtureRoot, { recursive: true, force: true });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("administrator media service", () => {
  it("keeps avatar upload, lookup, listing, and removal within its active owner", async () => {
    const ownerId = await createActor("USER");
    const otherUserId = await createActor("USER");
    const adminId = await createActor("ADMIN");
    const inactiveId = await createActor("USER", "SUSPENDED");
    const source = await sharp({
      create: { width: 256, height: 256, channels: 3, background: "blue" },
    })
      .png()
      .toBuffer();
    const command = {
      actorUserId: ownerId,
      attemptId: randomUUID(),
      mediaClass: "user_avatar" as const,
      source,
      declaredType: "image/png",
      sourceName: "avatar.png",
    };

    const created = await service.upload(command);
    expect(created.asset.mediaClass).toBe("user_avatar");
    expect(await service.getAsset(ownerId, created.asset.id)).toEqual(
      created.asset,
    );
    expect(await service.listMine(ownerId, 1, 25)).toMatchObject({
      pagination: { total: 1 },
      items: [{ id: created.asset.id }],
    });
    for (const actorUserId of [otherUserId, adminId]) {
      await expect(
        service.getAsset(actorUserId, created.asset.id),
      ).rejects.toMatchObject({ statusCode: 404, code: "NOT_FOUND" });
      await expect(
        service.removeOwnAvatar(actorUserId, created.asset.id),
      ).rejects.toMatchObject({ statusCode: 404, code: "NOT_FOUND" });
    }
    await expect(
      service.upload({ ...command, actorUserId: inactiveId }),
    ).rejects.toMatchObject({ statusCode: 401, code: "UNAUTHORIZED" });

    const replacement = await service.upload({
      ...command,
      attemptId: randomUUID(),
    });
    expect(replacement.asset.id).not.toBe(created.asset.id);
    await expect(
      service.removeOwnAvatar(ownerId, created.asset.id),
    ).resolves.toEqual({
      id: created.asset.id,
      status: "removed",
    });
    await expect(
      service.removeOwnAvatar(ownerId, created.asset.id),
    ).resolves.toEqual({
      id: created.asset.id,
      status: "removed",
    });
    await expect(
      service.getAsset(ownerId, created.asset.id),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "NOT_FOUND",
    });
    await expect(
      service.read(ownerId, replacement.asset.id),
    ).resolves.toBeInstanceOf(Buffer);
  });

  it("persists one private asset per actor-scoped attempt and replays exactly", async () => {
    const firstAdmin = await createActor();
    const secondAdmin = await createActor();
    const attemptId = randomUUID();
    const source = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "red" },
    })
      .jpeg()
      .toBuffer();
    const command = {
      actorUserId: firstAdmin,
      attemptId,
      mediaClass: "work_cover" as const,
      source,
      declaredType: "image/jpeg",
      sourceName: "cover.jpg",
    };

    const created = await service.uploadAdmin(command);
    expect(created.replayed).toBe(false);
    expect(created.asset.mediaClass).toBe("work_cover");
    expect(
      await database.mediaAsset.count({
        where: { uploadedByUserId: firstAdmin, status: "AVAILABLE" },
      }),
    ).toBe(1);
    const repeated = await service.uploadAdmin(command);
    expect(repeated).toMatchObject({
      replayed: true,
      asset: { id: created.asset.id },
    });
    expect(
      await database.mediaAsset.count({
        where: { uploadedByUserId: firstAdmin },
      }),
    ).toBe(1);
    expect(
      (await service.readAdmin(firstAdmin, created.asset.id)).length,
    ).toBeGreaterThan(0);
    expect(await service.getAdminAttempt(firstAdmin, attemptId)).toMatchObject({
      state: "accepted",
      assetId: created.asset.id,
    });
    expect(
      await service.listAdmin(firstAdmin, 1, 25, "work_cover"),
    ).toMatchObject({
      pagination: { total: 1 },
      items: [{ id: created.asset.id }],
    });

    const independent = await service.uploadAdmin({
      ...command,
      actorUserId: secondAdmin,
    });
    expect(independent.asset.id).not.toBe(created.asset.id);
    expect(
      (await service.readAdmin(secondAdmin, created.asset.id)).length,
    ).toBeGreaterThan(0);
    expect(
      await database.uploadAttempt.count({ where: { id: attemptId } }),
    ).toBe(2);
  });

  it("rejects invalid images and user-role uploads without a usable identity", async () => {
    const adminId = await createActor();
    const userId = await createActor("USER");
    const attemptId = randomUUID();
    const wrongRatio = await sharp({
      create: { width: 800, height: 600, channels: 3, background: "red" },
    })
      .jpeg()
      .toBuffer();
    const command = {
      actorUserId: adminId,
      attemptId,
      mediaClass: "work_cover" as const,
      source: wrongRatio,
      declaredType: "image/jpeg",
      sourceName: "wide.jpg",
    };
    await expect(
      service.uploadAdmin({ ...command, actorUserId: userId }),
    ).rejects.toMatchObject({ statusCode: 403 });
    await expect(service.uploadAdmin(command)).rejects.toMatchObject({
      statusCode: 400,
      code: "MEDIA_INVALID_FILE",
    });
    expect(await service.getAdminAttempt(adminId, attemptId)).toMatchObject({
      state: "rejected",
      assetId: null,
      safeFailureCode: "MEDIA_INVALID_FILE",
    });
    await expect(service.uploadAdmin(command)).rejects.toMatchObject({
      statusCode: 409,
      code: "UPLOAD_ATTEMPT_CONFLICT",
    });
    expect(
      await database.mediaAsset.count({
        where: { uploadedByUserId: adminId, status: "AVAILABLE" },
      }),
    ).toBe(0);
  });

  it("does not acknowledge an accepted replay after its stored bytes disappear", async () => {
    const adminId = await createActor();
    const source = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "red" },
    })
      .jpeg()
      .toBuffer();
    const command = {
      actorUserId: adminId,
      attemptId: randomUUID(),
      mediaClass: "work_cover" as const,
      source,
      declaredType: "image/jpeg",
      sourceName: "cover.jpg",
    };
    const created = await service.uploadAdmin(command);
    await storage.remove(created.asset.id);
    await expect(service.uploadAdmin(command)).rejects.toMatchObject({
      statusCode: 503,
      code: "MEDIA_UNAVAILABLE",
    });
  });

  it("binds, replaces, retires, and removes references with retry and stale-write safety", async () => {
    const adminId = await createActor();
    const work = await database.work.create({
      data: {
        title: "Reference target",
        slug: `reference-${randomUUID()}`,
        type: "MANGA",
        storyStatus: "ONGOING",
      },
    });
    const source = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "green" },
    })
      .jpeg()
      .toBuffer();
    const first = await service.uploadAdmin({
      actorUserId: adminId,
      attemptId: randomUUID(),
      mediaClass: "work_cover",
      source,
      declaredType: "image/jpeg",
      sourceName: "first.jpg",
    });
    const second = await service.uploadAdmin({
      actorUserId: adminId,
      attemptId: randomUUID(),
      mediaClass: "work_cover",
      source: await sharp(source).tint("#7f7fff").jpeg().toBuffer(),
      declaredType: "image/jpeg",
      sourceName: "second.jpg",
    });
    const wrongClass = await service.uploadAdmin({
      actorUserId: adminId,
      attemptId: randomUUID(),
      mediaClass: "work_background",
      source: await sharp({
        create: { width: 1600, height: 900, channels: 3, background: "blue" },
      })
        .jpeg()
        .toBuffer(),
      declaredType: "image/jpeg",
      sourceName: "background.jpg",
    });
    const command = {
      targetKind: "work_cover" as const,
      targetId: work.id,
      assetId: first.asset.id,
    };

    const bound = await service.bindReference(adminId, command);
    expect(bound).toMatchObject({ created: true, reference: { version: 0 } });
    await expect(
      service.bindReference(adminId, command),
    ).resolves.toMatchObject({
      created: false,
      reference: { id: bound.reference.id },
    });
    await expect(
      service.bindReference(adminId, { ...command, assetId: second.asset.id }),
    ).rejects.toMatchObject({ code: "MEDIA_TARGET_CONFLICT" });
    const mismatchWork = await database.work.create({
      data: {
        title: "Class mismatch target",
        slug: `class-mismatch-${randomUUID()}`,
        type: "MANGA",
        storyStatus: "ONGOING",
      },
    });
    await expect(
      service.bindReference(adminId, {
        targetKind: "work_cover",
        targetId: mismatchWork.id,
        assetId: wrongClass.asset.id,
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      service.bindReference(adminId, {
        ...command,
        targetId: randomUUID(),
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      service.removeAdminAsset(adminId, first.asset.id),
    ).rejects.toMatchObject({ code: "MEDIA_IN_USE" });

    const replaced = await service.replaceReference(
      adminId,
      bound.reference.id,
      {
        assetId: second.asset.id,
        expectedAssetId: first.asset.id,
        expectedVersion: 0,
      },
    );
    expect(replaced).toMatchObject({ assetId: second.asset.id, version: 1 });
    await expect(
      service.replaceReference(adminId, bound.reference.id, {
        assetId: first.asset.id,
        expectedAssetId: first.asset.id,
        expectedVersion: 0,
      }),
    ).rejects.toMatchObject({ code: "VERSION_CONFLICT" });
    await expect(
      service.removeAdminAsset(adminId, first.asset.id),
    ).resolves.toMatchObject({
      status: "removed",
    });
    await expect(
      service.removeAdminAsset(adminId, second.asset.id),
    ).rejects.toMatchObject({ code: "MEDIA_IN_USE" });

    const retire = {
      expectedAssetId: second.asset.id,
      expectedVersion: 1,
    };
    await expect(
      service.retireReference(adminId, bound.reference.id, retire),
    ).resolves.toMatchObject({ status: "retired", version: 2 });
    await expect(
      service.retireReference(adminId, bound.reference.id, retire),
    ).resolves.toMatchObject({ status: "retired", version: 2 });
    await expect(
      service.removeAdminAsset(adminId, second.asset.id),
    ).resolves.toMatchObject({
      status: "removed",
    });
    expect(
      await database.mediaReferenceEvent.count({
        where: { referenceId: bound.reference.id },
      }),
    ).toBe(3);
  });

  it("allows one concurrent replacement and reports the stale loser safely", async () => {
    const adminId = await createActor();
    const work = await database.work.create({
      data: {
        title: "Concurrent reference target",
        slug: `concurrent-reference-${randomUUID()}`,
        type: "MANGA",
        storyStatus: "ONGOING",
      },
    });
    const upload = async (background: string) =>
      service.uploadAdmin({
        actorUserId: adminId,
        attemptId: randomUUID(),
        mediaClass: "work_cover",
        source: await sharp({
          create: { width: 600, height: 800, channels: 3, background },
        })
          .jpeg()
          .toBuffer(),
        declaredType: "image/jpeg",
        sourceName: "cover.jpg",
      });
    const initial = await upload("black");
    const firstCandidate = await upload("yellow");
    const secondCandidate = await upload("white");
    const bound = await service.bindReference(adminId, {
      targetKind: "work_cover",
      targetId: work.id,
      assetId: initial.asset.id,
    });

    const outcomes = await Promise.allSettled([
      service.replaceReference(adminId, bound.reference.id, {
        assetId: firstCandidate.asset.id,
        expectedAssetId: initial.asset.id,
        expectedVersion: 0,
      }),
      service.replaceReference(adminId, bound.reference.id, {
        assetId: secondCandidate.asset.id,
        expectedAssetId: initial.asset.id,
        expectedVersion: 0,
      }),
    ]);
    expect(
      outcomes.filter((outcome) => outcome.status === "fulfilled"),
    ).toHaveLength(1);
    const rejected = outcomes.find((outcome) => outcome.status === "rejected");
    expect(rejected).toMatchObject({
      reason: { statusCode: 409, code: "VERSION_CONFLICT" },
    });
    const active = await service.getReferenceForTarget(
      adminId,
      "work_cover",
      work.id,
    );
    expect(active).toMatchObject({ version: 1 });
    expect([firstCandidate.asset.id, secondCandidate.asset.id]).toContain(
      active?.assetId,
    );
  });

  it("keeps a concurrent bind and removal in one valid final state", async () => {
    const adminId = await createActor();
    const work = await database.work.create({
      data: {
        title: "Bind removal race",
        slug: `bind-removal-${randomUUID()}`,
        type: "MANGA",
        storyStatus: "ONGOING",
      },
    });
    const uploaded = await service.uploadAdmin({
      actorUserId: adminId,
      attemptId: randomUUID(),
      mediaClass: "work_cover",
      source: await sharp({
        create: { width: 600, height: 800, channels: 3, background: "cyan" },
      })
        .jpeg()
        .toBuffer(),
      declaredType: "image/jpeg",
      sourceName: "cover.jpg",
    });

    const outcomes = await Promise.allSettled([
      service.bindReference(adminId, {
        targetKind: "work_cover",
        targetId: work.id,
        assetId: uploaded.asset.id,
      }),
      service.removeAdminAsset(adminId, uploaded.asset.id),
    ]);
    const reference = await database.mediaReference.findFirst({
      where: { workId: work.id, retiredAt: null },
    });
    const asset = await database.mediaAsset.findUniqueOrThrow({
      where: { id: uploaded.asset.id },
    });
    const rejectionCodes = outcomes.flatMap((outcome) => {
      if (outcome.status !== "rejected") return [];
      const reason: unknown = outcome.reason;
      return reason instanceof AppError ? [reason.code] : [];
    });
    if (reference === null) {
      expect(asset.status).toBe("REMOVED");
      expect(rejectionCodes).toContain("NOT_FOUND");
    } else {
      expect(asset.status).toBe("AVAILABLE");
      expect(reference.assetId).toBe(asset.id);
      expect(rejectionCodes).toContain("MEDIA_IN_USE");
    }
  });

  it("binds, replaces, and retires Work media in the caller-owned transaction", async () => {
    const adminId = await createActor();
    const work = await database.work.create({
      data: {
        title: "Media editorial work",
        slug: `media-editorial-${randomUUID()}`,
        type: "MANGA",
        storyStatus: "ONGOING",
      },
      select: { id: true },
    });

    const upload = async (mediaClass: "work_cover" | "work_background") =>
      service.uploadAdmin({
        actorUserId: adminId,
        attemptId: randomUUID(),
        mediaClass,
        source: await sharp({
          create: {
            width: mediaClass === "work_cover" ? 600 : 1_200,
            height: mediaClass === "work_cover" ? 800 : 675,
            channels: 3,
            background: mediaClass === "work_cover" ? "purple" : "teal",
          },
        })
          .jpeg()
          .toBuffer(),
        declaredType: "image/jpeg",
        sourceName: `${mediaClass}.jpg`,
      });
    const initialCover = await upload("work_cover");
    const replacementCover = await upload("work_cover");
    const initialBackground = await upload("work_background");
    const mismatchedClass = await upload("work_background");

    await expect(
      database.$transaction((transaction) =>
        service.saveWorkReferences(transaction, adminId, work.id, {
          coverAssetId: initialCover.asset.id,
          backgroundAssetId: initialBackground.asset.id,
        }),
      ),
    ).resolves.toEqual({
      coverAssetId: initialCover.asset.id,
      backgroundAssetId: initialBackground.asset.id,
      changed: true,
    });

    await expect(
      database.$transaction(async (transaction) => {
        await service.saveWorkReferences(transaction, adminId, work.id, {
          coverAssetId: replacementCover.asset.id,
        });
        throw new Error("injected parent edit failure");
      }),
    ).rejects.toThrow("injected parent edit failure");
    await expect(
      database.mediaReference.findFirstOrThrow({
        where: { workId: work.id, slot: "WORK_COVER", retiredAt: null },
      }),
    ).resolves.toMatchObject({ assetId: initialCover.asset.id, version: 0 });
    await expect(
      database.mediaReferenceEvent.count({
        where: { reference: { workId: work.id } },
      }),
    ).resolves.toBe(2);

    await expect(
      database.$transaction((transaction) =>
        service.saveWorkReferences(transaction, adminId, work.id, {
          coverAssetId: replacementCover.asset.id,
          backgroundAssetId: null,
        }),
      ),
    ).resolves.toEqual({
      coverAssetId: replacementCover.asset.id,
      backgroundAssetId: null,
      changed: true,
    });

    await expect(
      database.$transaction((transaction) =>
        service.saveWorkReferences(transaction, adminId, work.id, {
          coverAssetId: mismatchedClass.asset.id,
        }),
      ),
    ).rejects.toMatchObject({ statusCode: 404, code: "NOT_FOUND" });

    const references = await database.mediaReference.findMany({
      where: { workId: work.id },
      orderBy: { slot: "asc" },
    });
    const coverReference = references.find(
      ({ slot, assetId, retiredAt }) =>
        slot === "WORK_COVER" &&
        assetId === replacementCover.asset.id &&
        retiredAt === null,
    );
    const retiredBackground = references.find(
      ({ slot, assetId }) =>
        slot === "WORK_BACKGROUND" && assetId === initialBackground.asset.id,
    );
    expect(coverReference).toMatchObject({
      assetId: replacementCover.asset.id,
      retiredAt: null,
      version: 1,
    });
    expect(retiredBackground).toMatchObject({
      assetId: initialBackground.asset.id,
      version: 1,
    });
    expect(retiredBackground?.retiredAt).toBeInstanceOf(Date);
    const events = await database.mediaReferenceEvent.findMany({
      where: { reference: { workId: work.id } },
      orderBy: [{ referenceId: "asc" }, { resultVersion: "asc" }],
    });
    expect(events.map(({ action }) => action).sort()).toEqual(
      ["BOUND", "BOUND", "REPLACED", "RETIRED"].sort(),
    );
  });

  it("leaves a failed unlink resumable and completes it during reconciliation", async () => {
    const adminId = await createActor();
    const uploaded = await service.uploadAdmin({
      actorUserId: adminId,
      attemptId: randomUUID(),
      mediaClass: "work_cover",
      source: await sharp({
        create: { width: 600, height: 800, channels: 3, background: "magenta" },
      })
        .jpeg()
        .toBuffer(),
      declaredType: "image/jpeg",
      sourceName: "cover.jpg",
    });
    vi.spyOn(storage, "remove").mockRejectedValueOnce(
      new Error("simulated unlink failure"),
    );

    await expect(
      service.removeAdminAsset(adminId, uploaded.asset.id),
    ).rejects.toMatchObject({ code: "MEDIA_UNAVAILABLE" });
    expect(
      await database.mediaAsset.findUniqueOrThrow({
        where: { id: uploaded.asset.id },
      }),
    ).toMatchObject({ status: "REMOVING", removedAt: null });
    await expect(service.reconcile(100)).resolves.toMatchObject({
      completedRemovals: 1,
    });
  });
  it("keeps a published cover on retire/removal failure and advances the Work on replacement", async () => {
    const actorUserId = await createActor();
    const category = await categories.createCategory({
      displayName: "Protected",
      slug: `protected-${randomUUID()}`,
    });
    const source = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "green" },
    })
      .jpeg()
      .toBuffer();
    const upload = async () =>
      service.uploadAdmin({
        actorUserId,
        attemptId: randomUUID(),
        mediaClass: "work_cover",
        source,
        declaredType: "image/jpeg",
        sourceName: "cover.jpg",
      });
    const first = await upload();
    const second = await upload();
    const work = await works.createWork(
      {
        title: "Protected cover",
        slug: `protected-${randomUUID()}`,
        type: "manga",
        storyStatus: "ongoing",
        synopsis: "A complete synopsis for direct media safeguards.",
        author: "Author",
        categoryIds: [category.id],
        coverAssetId: first.asset.id,
        targetState: "published",
      },
      actorUserId,
    );
    const reference = await database.mediaReference.findFirstOrThrow({
      where: { workId: work.id, slot: "WORK_COVER", retiredAt: null },
    });
    const before = await database.mediaReferenceEvent.count({
      where: { referenceId: reference.id },
    });
    await expect(
      service.retireReference(actorUserId, reference.id, {
        expectedAssetId: first.asset.id,
        expectedVersion: reference.version,
      }),
    ).rejects.toMatchObject({ code: "CONTENT_NOT_READY" });
    await expect(
      service.removeAdminAsset(actorUserId, first.asset.id),
    ).rejects.toMatchObject({ code: "MEDIA_IN_USE" });
    expect(
      await database.mediaReferenceEvent.count({
        where: { referenceId: reference.id },
      }),
    ).toBe(before);
    expect(await works.getWork(work.id)).toMatchObject({
      coverAssetId: first.asset.id,
      version: work.version,
    });
    await service.replaceReference(actorUserId, reference.id, {
      assetId: second.asset.id,
      expectedAssetId: first.asset.id,
      expectedVersion: reference.version,
    });
    expect(await works.getWork(work.id)).toMatchObject({
      coverAssetId: second.asset.id,
      version: work.version + 1,
    });
    expect(
      await database.publicationEvent.count({ where: { workId: work.id } }),
    ).toBe(1);
  });
});

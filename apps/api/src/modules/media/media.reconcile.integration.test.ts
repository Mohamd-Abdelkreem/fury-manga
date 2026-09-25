import { createHash, randomUUID } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import sharp from "sharp";
import { afterAll, describe, expect, it } from "vitest";

import { createDatabaseClient } from "@fury/database";

import { createMediaConfig } from "../../core/config/media.config.js";
import { MediaStorage } from "../../infrastructure/media/media-storage.js";
import { MediaService } from "./media.service.js";

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl === undefined)
  throw new Error("Testcontainers DATABASE_URL is required.");

const database = createDatabaseClient(databaseUrl);
const fixtureRoot = mkdtempSync(join(tmpdir(), "fury-media-reconcile-"));
const mediaRoot = join(fixtureRoot, "persistent");
mkdirSync(mediaRoot);
const storage = new MediaStorage(createMediaConfig(mediaRoot));
const service = new MediaService(database, storage);
const actorIds: string[] = [];

const createAdmin = async (): Promise<string> => {
  const id = randomUUID();
  actorIds.push(id);
  await database.user.create({
    data: {
      id,
      email: `reconcile-${id}@example.test`,
      fullName: "Media Reconcile",
      passwordHash: "test-hash",
      role: "ADMIN",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });
  return id;
};

afterAll(async () => {
  await database.uploadAttempt.deleteMany({
    where: { actorUserId: { in: actorIds } },
  });
  await database.mediaAsset.deleteMany({
    where: { uploadedByUserId: { in: actorIds } },
  });
  await database.user.deleteMany({ where: { id: { in: actorIds } } });
  await database.$disconnect();
  rmSync(fixtureRoot, { recursive: true, force: true });
});

describe("operator media reconciliation", () => {
  it("accepts provable staged bytes and terminally rejects incomplete uploads", async () => {
    const actorUserId = await createAdmin();
    const acceptedKey = randomUUID();
    const reservation = await service.reserveAdminUpload(
      actorUserId,
      acceptedKey,
      "work_cover",
    );
    if (reservation.assetId === null)
      throw new Error("Expected asset identity.");
    const bytes = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "purple" },
    })
      .webp()
      .toBuffer();
    await storage.stage(reservation.assetId, bytes);
    await database.mediaAsset.update({
      where: { id: reservation.assetId },
      data: {
        contentType: "image/webp",
        byteLength: bytes.length,
        width: 600,
        height: 800,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      },
    });
    await database.uploadAttempt.update({
      where: {
        actorUserId_id: { actorUserId, id: acceptedKey },
      },
      data: {
        sourceSha256: createHash("sha256").update(bytes).digest("hex"),
      },
    });
    const incompleteKey = randomUUID();
    const incomplete = await service.reserveAdminUpload(
      actorUserId,
      incompleteKey,
      "work_cover",
    );

    const report = await service.reconcile(100);
    expect(report).toMatchObject({
      acceptedUploads: 1,
      rejectedUploads: 1,
    });
    expect(
      await service.getAdminAttempt(actorUserId, acceptedKey),
    ).toMatchObject({
      state: "accepted",
      assetId: reservation.assetId,
    });
    expect(
      await service.getAdminAttempt(actorUserId, incompleteKey),
    ).toMatchObject({
      state: "rejected",
      assetId: null,
      safeFailureCode: "UPLOAD_INCOMPLETE",
    });
    expect(
      await database.mediaAsset.findUniqueOrThrow({
        where: { id: incomplete.assetId ?? "" },
      }),
    ).toMatchObject({ status: "REMOVED" });
    await expect(
      service.uploadAdmin({
        actorUserId,
        attemptId: incompleteKey,
        mediaClass: "work_cover",
        source: bytes,
        declaredType: "image/webp",
        sourceName: "cover.webp",
      }),
    ).rejects.toMatchObject({ code: "UPLOAD_ATTEMPT_CONFLICT" });
    await expect(
      service.uploadAdmin({
        actorUserId,
        attemptId: randomUUID(),
        mediaClass: "work_cover",
        source: bytes,
        declaredType: "image/webp",
        sourceName: "cover.webp",
      }),
    ).resolves.toMatchObject({ asset: { status: "available" } });
  });

  it("marks damaged bytes unavailable, restores verified bytes, and completes removal", async () => {
    const actorUserId = await createAdmin();
    const source = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "orange" },
    })
      .jpeg()
      .toBuffer();
    const uploaded = await service.uploadAdmin({
      actorUserId,
      attemptId: randomUUID(),
      mediaClass: "work_cover",
      source,
      declaredType: "image/jpeg",
      sourceName: "cover.jpg",
    });
    const stored = await storage.read(uploaded.asset.id);
    await storage.remove(uploaded.asset.id);
    await expect(
      service.readAdmin(actorUserId, uploaded.asset.id),
    ).rejects.toMatchObject({
      code: "MEDIA_UNAVAILABLE",
    });
    expect(
      await database.mediaAsset.findUniqueOrThrow({
        where: { id: uploaded.asset.id },
      }),
    ).toMatchObject({ status: "AVAILABLE" });
    await storage.stage(
      uploaded.asset.id,
      Buffer.from("corrupt-restored-bytes"),
    );
    await storage.publish(uploaded.asset.id);
    expect(await service.reconcile(100)).toMatchObject({
      markedUnavailable: 1,
    });
    await storage.remove(uploaded.asset.id);
    await storage.stage(uploaded.asset.id, stored);
    await storage.publish(uploaded.asset.id);
    expect(await service.reconcile(100)).toMatchObject({
      restoredAvailable: 1,
    });
    await database.mediaAsset.update({
      where: { id: uploaded.asset.id },
      data: { status: "REMOVING" },
    });
    expect(await service.reconcile(100)).toMatchObject({
      completedRemovals: 1,
    });
    const removed = await database.mediaAsset.findUniqueOrThrow({
      where: { id: uploaded.asset.id },
    });
    expect(removed.status).toBe("REMOVED");
    expect(removed.removedAt).toBeInstanceOf(Date);
  });

  it("removes bounded orphan staging files", async () => {
    const orphanId = randomUUID();
    await storage.stage(orphanId, Buffer.from("orphan"));
    expect(await service.reconcile(1)).toMatchObject({
      removedOrphanStages: 1,
    });
    expect(await storage.readStaged(orphanId)).toBeNull();
  });
});

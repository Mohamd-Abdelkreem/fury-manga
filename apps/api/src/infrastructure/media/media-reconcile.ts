import { createHash } from "node:crypto";

import {
  MediaAssetStatus,
  UploadAttemptState,
  type DatabaseClient,
  type MediaAsset,
} from "@fury/database";

import type { MediaStorage } from "./media-storage.js";

export type MediaReconcileReport = Readonly<{
  inspected: number;
  acceptedUploads: number;
  rejectedUploads: number;
  completedRemovals: number;
  markedUnavailable: number;
  restoredAvailable: number;
  removedOrphanStages: number;
}>;

const digest = (bytes: Buffer): string =>
  createHash("sha256").update(bytes).digest("hex");

const bytesMatch = (asset: MediaAsset, bytes: Buffer): boolean =>
  asset.byteLength !== null &&
  asset.sha256 !== null &&
  bytes.length === asset.byteLength &&
  digest(bytes) === asset.sha256;

export class MediaReconciler {
  constructor(
    private readonly database: DatabaseClient,
    private readonly storage: MediaStorage,
  ) {}

  async run(limit = 100): Promise<MediaReconcileReport> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 1_000) {
      throw new Error(
        "Reconciliation limit must be an integer from 1 to 1000.",
      );
    }
    this.storage.checkHealth();
    const report = {
      inspected: 0,
      acceptedUploads: 0,
      rejectedUploads: 0,
      completedRemovals: 0,
      markedUnavailable: 0,
      restoredAvailable: 0,
      removedOrphanStages: 0,
    };

    const attempts = await this.database.uploadAttempt.findMany({
      where: { state: UploadAttemptState.PENDING },
      include: { asset: true },
      orderBy: [{ createdAt: "asc" }, { actorUserId: "asc" }, { id: "asc" }],
      take: limit,
    });
    for (const attempt of attempts) {
      report.inspected += 1;
      const asset = attempt.asset;
      let published =
        asset === null
          ? null
          : await this.storage.readPublishedIfPresent(asset.id);
      if (asset !== null && published === null) {
        const staged = await this.storage.readStaged(asset.id);
        if (staged !== null && bytesMatch(asset, staged)) {
          await this.storage.publish(asset.id);
          published = staged;
        }
      }
      if (
        asset !== null &&
        asset.status === MediaAssetStatus.PENDING &&
        attempt.sourceSha256 !== null &&
        published !== null &&
        bytesMatch(asset, published)
      ) {
        await this.database.$transaction(async (transaction) => {
          await transaction.mediaAsset.update({
            where: { id: asset.id },
            data: {
              status: MediaAssetStatus.AVAILABLE,
              availableAt: asset.availableAt ?? new Date(),
            },
          });
          await transaction.uploadAttempt.update({
            where: {
              actorUserId_id: {
                actorUserId: attempt.actorUserId,
                id: attempt.id,
              },
            },
            data: {
              state: UploadAttemptState.ACCEPTED,
              completedAt: new Date(),
            },
          });
        });
        report.acceptedUploads += 1;
        continue;
      }
      if (asset !== null) {
        await this.storage.removeStagedIfPresent(asset.id);
        await this.storage.removePublishedIfPresent(asset.id);
      }
      await this.database.$transaction(async (transaction) => {
        if (asset !== null) {
          await transaction.mediaAsset.update({
            where: { id: asset.id },
            data: { status: MediaAssetStatus.REMOVED, removedAt: new Date() },
          });
        }
        await transaction.uploadAttempt.update({
          where: {
            actorUserId_id: {
              actorUserId: attempt.actorUserId,
              id: attempt.id,
            },
          },
          data: {
            state: UploadAttemptState.REJECTED,
            safeFailureCode: "UPLOAD_INCOMPLETE",
            completedAt: new Date(),
          },
        });
      });
      report.rejectedUploads += 1;
    }

    const remaining = Math.max(0, limit - report.inspected);
    const assets = await this.database.mediaAsset.findMany({
      where: {
        status: {
          in: [
            MediaAssetStatus.REMOVING,
            MediaAssetStatus.AVAILABLE,
            MediaAssetStatus.UNAVAILABLE,
          ],
        },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      take: remaining,
    });
    for (const asset of assets) {
      report.inspected += 1;
      if (asset.status === MediaAssetStatus.REMOVING) {
        await this.storage.removePublishedIfPresent(asset.id);
        await this.storage.removeStagedIfPresent(asset.id);
        await this.database.mediaAsset.update({
          where: { id: asset.id },
          data: { status: MediaAssetStatus.REMOVED, removedAt: new Date() },
        });
        report.completedRemovals += 1;
        continue;
      }
      const bytes = await this.storage.readPublishedIfPresent(asset.id);
      const valid = bytes !== null && bytesMatch(asset, bytes);
      if (valid && asset.status === MediaAssetStatus.UNAVAILABLE) {
        await this.database.mediaAsset.update({
          where: { id: asset.id },
          data: { status: MediaAssetStatus.AVAILABLE },
        });
        report.restoredAvailable += 1;
      } else if (!valid && asset.status === MediaAssetStatus.AVAILABLE) {
        await this.database.mediaAsset.update({
          where: { id: asset.id },
          data: { status: MediaAssetStatus.UNAVAILABLE },
        });
        report.markedUnavailable += 1;
      }
    }

    const stagedIds = await this.storage.listStagedAssetIds(limit);
    for (const assetId of stagedIds) {
      const asset = await this.database.mediaAsset.findUnique({
        where: { id: assetId },
        select: { status: true },
      });
      if (asset?.status !== MediaAssetStatus.PENDING) {
        await this.storage.removeStagedIfPresent(assetId);
        report.removedOrphanStages += 1;
      }
    }
    return report;
  }
}

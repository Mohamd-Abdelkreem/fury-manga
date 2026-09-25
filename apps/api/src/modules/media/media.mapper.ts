import {
  mediaAssetSchema,
  mediaAttemptSchema,
  type MediaAssetDto,
  type MediaAttemptDto,
  mediaReferenceSchema,
  type MediaReferenceDto,
} from "@fury/contracts";
import type {
  MediaAssetStatus,
  MediaClass,
  UploadAttemptState,
} from "@fury/database";

type AssetRow = Readonly<{
  id: string;
  mediaClass: MediaClass;
  status: MediaAssetStatus;
  contentType: string | null;
  byteLength: number | null;
  width: number | null;
  height: number | null;
  createdAt: Date;
}>;

export const mapMediaAsset = (asset: AssetRow): MediaAssetDto =>
  mediaAssetSchema.parse({
    id: asset.id,
    mediaClass: asset.mediaClass.toLowerCase(),
    status: asset.status.toLowerCase(),
    contentType: asset.contentType,
    byteLength: asset.byteLength,
    width: asset.width,
    height: asset.height,
    createdAt: asset.createdAt.toISOString(),
    contentPath: `/api/v1/media/assets/${asset.id}/content`,
  });

type AttemptRow = Readonly<{
  id: string;
  mediaClass: MediaClass;
  state: UploadAttemptState;
  assetId: string | null;
  safeFailureCode: string | null;
  createdAt: Date;
  completedAt: Date | null;
}>;

export const mapMediaAttempt = (attempt: AttemptRow): MediaAttemptDto =>
  mediaAttemptSchema.parse({
    id: attempt.id,
    mediaClass: attempt.mediaClass.toLowerCase(),
    state: attempt.state.toLowerCase(),
    assetId: attempt.state === "ACCEPTED" ? attempt.assetId : null,
    safeFailureCode:
      attempt.state === "REJECTED" ? attempt.safeFailureCode : null,
    createdAt: attempt.createdAt.toISOString(),
    completedAt: attempt.completedAt?.toISOString() ?? null,
  });

type ReferenceRow = Readonly<{
  id: string;
  assetId: string;
  workId: string | null;
  chapterPageId: string | null;
  slot: "WORK_COVER" | "WORK_BACKGROUND" | "CHAPTER_PAGE";
  version: number;
  createdAt: Date;
  updatedAt: Date;
}>;

export const mapMediaReference = (reference: ReferenceRow): MediaReferenceDto =>
  mediaReferenceSchema.parse({
    id: reference.id,
    targetKind: reference.slot.toLowerCase(),
    targetId: reference.workId ?? reference.chapterPageId,
    assetId: reference.assetId,
    version: reference.version,
    createdAt: reference.createdAt.toISOString(),
    updatedAt: reference.updatedAt.toISOString(),
  });

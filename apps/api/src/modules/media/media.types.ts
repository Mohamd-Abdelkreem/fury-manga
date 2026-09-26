import type { MediaClass as ContractMediaClass } from "@fury/contracts";
import type { UploadAttempt } from "@fury/database";

export type UploadMediaCommand = Readonly<{
  actorUserId: string;
  attemptId: string;
  mediaClass: ContractMediaClass;
  source: Buffer;
  declaredType: string;
  sourceName: string;
}>;

export type UploadAdminCommand = UploadMediaCommand &
  Readonly<{
    mediaClass: Exclude<ContractMediaClass, "user_avatar">;
  }>;

export type MediaUploadReservation = Readonly<{
  assetId: string | null;
  attempt: UploadAttempt;
  created: boolean;
}>;

export type WorkMediaField = "coverAssetId" | "backgroundAssetId";

export type WorkMediaSelection = Readonly<
  Partial<Record<WorkMediaField, string | null>>
>;

export type SavedWorkMedia = Readonly<{
  coverAssetId: string | null;
  backgroundAssetId: string | null;
  changed: boolean;
}>;

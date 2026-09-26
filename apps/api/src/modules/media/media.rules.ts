import { MediaClass, MediaReferenceSlot } from "@fury/database";

import type {
  MediaClass as ContractMediaClass,
  MediaReferenceTargetKind,
} from "@fury/contracts";
import type { UploadAdminCommand, WorkMediaField } from "./media.types.js";

const adminClassMap: Record<UploadAdminCommand["mediaClass"], MediaClass> = {
  work_cover: MediaClass.WORK_COVER,
  work_background: MediaClass.WORK_BACKGROUND,
  chapter_page: MediaClass.CHAPTER_PAGE,
  avatar_frame: MediaClass.AVATAR_FRAME,
  comment_decoration: MediaClass.COMMENT_DECORATION,
};

export const toDatabaseAdminClass = (
  mediaClass: UploadAdminCommand["mediaClass"],
): MediaClass => adminClassMap[mediaClass];

const mediaClassMap: Record<ContractMediaClass, MediaClass> = {
  ...adminClassMap,
  user_avatar: MediaClass.USER_AVATAR,
};

export const toDatabaseMediaClass = (
  mediaClass: ContractMediaClass,
): MediaClass => mediaClassMap[mediaClass];

const referenceRules: Record<
  MediaReferenceTargetKind,
  Readonly<{ slot: MediaReferenceSlot; mediaClass: MediaClass }>
> = {
  work_cover: {
    slot: MediaReferenceSlot.WORK_COVER,
    mediaClass: MediaClass.WORK_COVER,
  },
  work_background: {
    slot: MediaReferenceSlot.WORK_BACKGROUND,
    mediaClass: MediaClass.WORK_BACKGROUND,
  },
  chapter_page: {
    slot: MediaReferenceSlot.CHAPTER_PAGE,
    mediaClass: MediaClass.CHAPTER_PAGE,
  },
};

export const mediaReferenceRule = (targetKind: MediaReferenceTargetKind) =>
  referenceRules[targetKind];

export const workMediaReferenceRule = (field: WorkMediaField) =>
  referenceRules[field === "coverAssetId" ? "work_cover" : "work_background"];

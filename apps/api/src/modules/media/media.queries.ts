import {
  MediaClass,
  MediaScope,
  type DatabaseClient,
  type MediaReferenceSlot,
} from "@fury/database";

export const findActorUploadAttempt = (
  database: DatabaseClient,
  actorUserId: string,
  attemptId: string,
) =>
  database.uploadAttempt.findUnique({
    where: { actorUserId_id: { actorUserId, id: attemptId } },
  });

export const findMediaAsset = (database: DatabaseClient, assetId: string) =>
  database.mediaAsset.findUnique({ where: { id: assetId } });

export const findOwnedAvatarAsset = (
  database: DatabaseClient,
  ownerUserId: string,
  assetId: string,
) =>
  database.mediaAsset.findFirst({
    where: {
      id: assetId,
      scope: MediaScope.USER,
      mediaClass: MediaClass.USER_AVATAR,
      ownerUserId,
    },
  });

export const findActiveMediaReference = (
  database: Pick<DatabaseClient, "mediaReference">,
  slot: MediaReferenceSlot,
  targetId: string,
) =>
  database.mediaReference.findFirst({
    where: {
      slot,
      retiredAt: null,
      ...(slot === "CHAPTER_PAGE"
        ? { chapterPageId: targetId }
        : { workId: targetId }),
    },
  });

export const mediaReferenceTargetExists = async (
  database: DatabaseClient,
  slot: MediaReferenceSlot,
  targetId: string,
): Promise<boolean> => {
  if (slot === "CHAPTER_PAGE") {
    return (
      (await database.chapterPage.count({
        where: { id: targetId, chapter: { contentType: "ILLUSTRATED" } },
      })) === 1
    );
  }
  return (await database.work.count({ where: { id: targetId } })) === 1;
};

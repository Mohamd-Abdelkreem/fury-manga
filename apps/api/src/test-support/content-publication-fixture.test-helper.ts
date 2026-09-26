import { randomUUID } from "node:crypto";

import {
  MediaAssetStatus,
  MediaClass,
  MediaScope,
  UserRole,
  UserStatus,
  type DatabaseClient,
} from "@fury/database";

export const prepareWorkForPublication = async (
  database: DatabaseClient,
  workId: string,
  categoryId?: string,
): Promise<string> => {
  const selectedCategoryId = categoryId ?? randomUUID();
  if (categoryId === undefined) {
    await database.category.create({
      data: {
        id: selectedCategoryId,
        displayName: "Ready Category",
        slug: `ready-${selectedCategoryId}`,
      },
    });
  }
  const attached = await database.workCategory.count({
    where: { workId, categoryId: selectedCategoryId },
  });
  if (attached === 0) {
    await database.workCategory.create({
      data: { workId, categoryId: selectedCategoryId },
    });
  }
  await database.work.update({
    where: { id: workId },
    data: {
      synopsis: "A complete synopsis for publication fixture tests.",
      author: "Fixture Author",
    },
  });
  const actorId = randomUUID();
  await database.user.create({
    data: {
      id: actorId,
      email: `ready-${actorId}@example.test`,
      fullName: "Fixture Admin",
      passwordHash: "test-hash",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });
  const assetId = randomUUID();
  await database.mediaAsset.create({
    data: {
      id: assetId,
      mediaClass: MediaClass.WORK_COVER,
      scope: MediaScope.ADMIN,
      uploadedByUserId: actorId,
      relativeKey: `ready-${assetId}`,
      contentType: "image/webp",
      byteLength: 100,
      width: 10,
      height: 10,
      sha256: "a".repeat(64),
      status: MediaAssetStatus.AVAILABLE,
      availableAt: new Date(),
    },
  });
  await database.mediaReference.create({
    data: { assetId, workId, slot: "WORK_COVER" },
  });
  return actorId;
};

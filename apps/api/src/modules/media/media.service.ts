import { createHash, randomUUID } from "node:crypto";

import {
  paginationMetaSchema,
  type MediaClass as ContractMediaClass,
  type MediaAssetDto,
  type MediaAttemptDto,
  type MediaReferenceCreate,
  type MediaReferenceDto,
  type MediaReferenceReplace,
  type MediaReferenceRetire,
  type MediaReferenceTargetKind,
  type PaginationMeta,
} from "@fury/contracts";
import {
  MediaAssetStatus,
  MediaReferenceAction,
  MediaScope,
  Prisma,
  UploadAttemptState,
  UserRole,
  UserStatus,
  type DatabaseClient,
  type MediaAsset,
  type UploadAttempt,
} from "@fury/database";

import { AppError } from "../../core/errors/app.error.js";
import { validateImage } from "../../infrastructure/media/image-validation.js";
import {
  MediaReconciler,
  type MediaReconcileReport,
} from "../../infrastructure/media/media-reconcile.js";
import type { MediaStorage } from "../../infrastructure/media/media-storage.js";
import {
  mapMediaAsset,
  mapMediaAttempt,
  mapMediaReference,
} from "./media.mapper.js";
import {
  findActorUploadAttempt,
  findMediaAsset,
  findActiveMediaReference,
  findOwnedAvatarAsset,
  mediaReferenceTargetExists,
} from "./media.queries.js";
import {
  mediaReferenceRule,
  toDatabaseAdminClass,
  toDatabaseMediaClass,
} from "./media.rules.js";

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

const sha256 = (bytes: Buffer): string =>
  createHash("sha256").update(bytes).digest("hex");

const unavailable = (): AppError =>
  new AppError("Media storage is unavailable.", 503, "MEDIA_UNAVAILABLE");

const isTransactionWriteConflict = (error: unknown): boolean => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code === "P2034") return true;
  if (error.code !== "P2010") return false;
  const detail = `${error.message} ${JSON.stringify(error.meta)}`;
  return (
    detail.includes("40001") ||
    detail.includes("40P01") ||
    detail.includes("TransactionWriteConflict") ||
    detail.includes("could not serialize access") ||
    detail.includes("deadlock detected")
  );
};

const versionConflict = (): AppError =>
  new AppError("Media reference is stale.", 409, "VERSION_CONFLICT");

export class MediaService {
  constructor(
    private readonly database: DatabaseClient,
    private readonly storage: MediaStorage,
  ) {}

  reconcile(limit?: number): Promise<MediaReconcileReport> {
    return new MediaReconciler(this.database, this.storage).run(limit);
  }

  async uploadAdmin(
    command: UploadAdminCommand,
  ): Promise<{ asset: MediaAssetDto; replayed: boolean }> {
    return this.upload(command);
  }

  async upload(
    command: UploadMediaCommand,
  ): Promise<{ asset: MediaAssetDto; replayed: boolean }> {
    const reservation = await this.reserveUpload(
      command.actorUserId,
      command.attemptId,
      command.mediaClass,
    );
    return this.completeUpload(command, reservation);
  }

  async reserveAdminUpload(
    actorUserId: string,
    attemptId: string,
    mediaClass: UploadAdminCommand["mediaClass"],
  ): Promise<MediaUploadReservation> {
    return this.reserveUpload(actorUserId, attemptId, mediaClass);
  }

  async reserveUpload(
    actorUserId: string,
    attemptId: string,
    mediaClass: ContractMediaClass,
  ): Promise<MediaUploadReservation> {
    const actor = await this.assertActiveActor(actorUserId);
    if (mediaClass !== "user_avatar" && actor.role !== UserRole.ADMIN) {
      throw new AppError("Administrator access required.", 403, "FORBIDDEN");
    }
    const expectedClass = toDatabaseMediaClass(mediaClass);
    const existing = await findActorUploadAttempt(
      this.database,
      actorUserId,
      attemptId,
    );
    if (existing !== null) {
      if (existing.mediaClass !== expectedClass) {
        throw new AppError(
          "Upload attempt key conflicts with its prior result.",
          409,
          "UPLOAD_ATTEMPT_CONFLICT",
        );
      }
      return { assetId: existing.assetId, attempt: existing, created: false };
    }

    const assetId = randomUUID();
    try {
      const attempt = await this.database.$transaction(async (transaction) => {
        await transaction.mediaAsset.create({
          data: {
            id: assetId,
            mediaClass: expectedClass,
            scope:
              mediaClass === "user_avatar" ? MediaScope.USER : MediaScope.ADMIN,
            ownerUserId: mediaClass === "user_avatar" ? actorUserId : null,
            uploadedByUserId: actorUserId,
            relativeKey: `${assetId}.bin`,
          },
        });
        return transaction.uploadAttempt.create({
          data: {
            id: attemptId,
            actorUserId,
            mediaClass: expectedClass,
            assetId,
          },
        });
      });
      return { assetId, attempt, created: true };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const winner = await findActorUploadAttempt(
          this.database,
          actorUserId,
          attemptId,
        );
        if (winner !== null) {
          if (winner.mediaClass !== expectedClass) {
            throw new AppError(
              "Upload attempt key conflicts with its prior result.",
              409,
              "UPLOAD_ATTEMPT_CONFLICT",
            );
          }
          return { assetId: winner.assetId, attempt: winner, created: false };
        }
      }
      throw error;
    }
  }

  async completeAdminUpload(
    command: UploadAdminCommand,
    reservation: MediaUploadReservation,
  ): Promise<{ asset: MediaAssetDto; replayed: boolean }> {
    return this.completeUpload(command, reservation);
  }

  async completeUpload(
    command: UploadMediaCommand,
    reservation: MediaUploadReservation,
  ): Promise<{ asset: MediaAssetDto; replayed: boolean }> {
    const sourceSha256 = sha256(command.source);
    if (!reservation.created) {
      return this.resolveAttempt(reservation.attempt, command, sourceSha256);
    }
    const assetId = reservation.assetId;
    if (assetId === null) throw unavailable();
    await this.database.uploadAttempt.update({
      where: {
        actorUserId_id: {
          actorUserId: command.actorUserId,
          id: command.attemptId,
        },
      },
      data: { sourceSha256 },
    });

    let validated: Awaited<ReturnType<typeof validateImage>>;
    try {
      validated = await validateImage(
        command.source,
        command.mediaClass,
        command.declaredType,
        command.sourceName,
      );
    } catch (error) {
      if (error instanceof AppError) {
        await this.rejectAttempt(
          command.actorUserId,
          command.attemptId,
          assetId,
          error.code,
        );
      }
      throw error;
    }

    try {
      await this.storage.stage(assetId, validated.bytes);
      await this.database.mediaAsset.update({
        where: { id: assetId },
        data: {
          contentType: validated.contentType,
          byteLength: validated.bytes.length,
          width: validated.width,
          height: validated.height,
          sha256: validated.sha256,
        },
      });
      await this.storage.publish(assetId);
    } catch {
      throw unavailable();
    }

    const saved = await this.database.$transaction(async (transaction) => {
      const asset = await transaction.mediaAsset.update({
        where: { id: assetId },
        data: { status: MediaAssetStatus.AVAILABLE, availableAt: new Date() },
      });
      await transaction.uploadAttempt.update({
        where: {
          actorUserId_id: {
            actorUserId: command.actorUserId,
            id: command.attemptId,
          },
        },
        data: { state: UploadAttemptState.ACCEPTED, completedAt: new Date() },
      });
      return asset;
    });
    return { asset: mapMediaAsset(saved), replayed: false };
  }

  async readAdmin(actorUserId: string, assetId: string): Promise<Buffer> {
    const asset = await this.lookupAdminAsset(actorUserId, assetId);
    return this.readStoredAsset(asset);
  }

  async read(actorUserId: string, assetId: string): Promise<Buffer> {
    const asset = await this.lookupAsset(actorUserId, assetId);
    return this.readStoredAsset(asset);
  }

  private async readStoredAsset(asset: MediaAsset): Promise<Buffer> {
    let bytes: Buffer;
    try {
      bytes = await this.storage.read(asset.id);
    } catch {
      throw unavailable();
    }
    if (bytes.length !== asset.byteLength || sha256(bytes) !== asset.sha256) {
      throw unavailable();
    }
    return bytes;
  }

  async getAdminAsset(
    actorUserId: string,
    assetId: string,
  ): Promise<MediaAssetDto> {
    return mapMediaAsset(await this.lookupAdminAsset(actorUserId, assetId));
  }

  async getAsset(actorUserId: string, assetId: string): Promise<MediaAssetDto> {
    return mapMediaAsset(await this.lookupAsset(actorUserId, assetId));
  }

  async getAdminAttempt(
    actorUserId: string,
    attemptId: string,
  ): Promise<MediaAttemptDto> {
    await this.assertActiveActor(actorUserId);
    const attempt = await findActorUploadAttempt(
      this.database,
      actorUserId,
      attemptId,
    );
    if (attempt === null)
      throw new AppError("Upload attempt not found.", 404, "NOT_FOUND");
    return mapMediaAttempt(attempt);
  }

  async listAdmin(
    actorUserId: string,
    page: number,
    limit: number,
    mediaClass?: UploadAdminCommand["mediaClass"],
  ): Promise<{ items: MediaAssetDto[]; pagination: PaginationMeta }> {
    await this.assertAdmin(actorUserId);
    const where = {
      scope: MediaScope.ADMIN,
      status: MediaAssetStatus.AVAILABLE,
      ...(mediaClass === undefined
        ? {}
        : { mediaClass: toDatabaseAdminClass(mediaClass) }),
    };
    const [assets, total] = await this.database.$transaction(
      [
        this.database.mediaAsset.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.database.mediaAsset.count({ where }),
      ],
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    return this.toMediaPage(assets, page, limit, total);
  }

  async listMine(
    actorUserId: string,
    page: number,
    limit: number,
  ): Promise<{ items: MediaAssetDto[]; pagination: PaginationMeta }> {
    await this.assertActiveActor(actorUserId);
    const where = {
      scope: MediaScope.USER,
      ownerUserId: actorUserId,
      mediaClass: toDatabaseMediaClass("user_avatar"),
      status: MediaAssetStatus.AVAILABLE,
    };
    const [assets, total] = await this.database.$transaction(
      [
        this.database.mediaAsset.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.database.mediaAsset.count({ where }),
      ],
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    return this.toMediaPage(assets, page, limit, total);
  }

  async removeOwnAvatar(
    actorUserId: string,
    assetId: string,
  ): Promise<{ id: string; status: "removed" }> {
    await this.assertActiveActor(actorUserId);
    const asset = await findOwnedAvatarAsset(
      this.database,
      actorUserId,
      assetId,
    );
    if (asset === null) {
      throw new AppError("Media asset not found.", 404, "NOT_FOUND");
    }
    if (asset.status === MediaAssetStatus.REMOVED) {
      return { id: asset.id, status: "removed" };
    }
    if (asset.status === MediaAssetStatus.REMOVING) throw unavailable();
    if (
      asset.status !== MediaAssetStatus.AVAILABLE &&
      asset.status !== MediaAssetStatus.UNAVAILABLE
    ) {
      throw new AppError("Media asset not found.", 404, "NOT_FOUND");
    }
    const claimed = await this.database.mediaAsset.updateMany({
      where: {
        id: asset.id,
        ownerUserId: actorUserId,
        status: asset.status,
      },
      data: { status: MediaAssetStatus.REMOVING },
    });
    if (claimed.count !== 1) throw unavailable();
    try {
      await this.storage.remove(asset.id);
    } catch {
      throw unavailable();
    }
    await this.database.mediaAsset.update({
      where: { id: asset.id },
      data: { status: MediaAssetStatus.REMOVED, removedAt: new Date() },
    });
    return { id: asset.id, status: "removed" };
  }

  async removeAsset(
    actorUserId: string,
    assetId: string,
  ): Promise<{ id: string; status: "removed" }> {
    const actor = await this.assertActiveActor(actorUserId);
    const ownedAvatar = await findOwnedAvatarAsset(
      this.database,
      actorUserId,
      assetId,
    );
    if (ownedAvatar !== null) return this.removeOwnAvatar(actorUserId, assetId);
    if (actor.role === UserRole.ADMIN) {
      return this.removeAdminAsset(actorUserId, assetId);
    }
    throw new AppError("Media asset not found.", 404, "NOT_FOUND");
  }

  async getReferenceForTarget(
    actorUserId: string,
    targetKind: MediaReferenceTargetKind,
    targetId: string,
  ): Promise<MediaReferenceDto | null> {
    await this.assertAdmin(actorUserId);
    const rule = mediaReferenceRule(targetKind);
    if (
      !(await mediaReferenceTargetExists(this.database, rule.slot, targetId))
    ) {
      throw new AppError("Media target not found.", 404, "NOT_FOUND");
    }
    const reference = await findActiveMediaReference(
      this.database,
      rule.slot,
      targetId,
    );
    return reference === null ? null : mapMediaReference(reference);
  }

  async getReference(
    actorUserId: string,
    referenceId: string,
  ): Promise<MediaReferenceDto> {
    await this.assertAdmin(actorUserId);
    const reference = await this.database.mediaReference.findFirst({
      where: { id: referenceId, retiredAt: null },
    });
    if (reference === null)
      throw new AppError("Media reference not found.", 404, "NOT_FOUND");
    return mapMediaReference(reference);
  }

  async bindReference(
    actorUserId: string,
    command: MediaReferenceCreate,
  ): Promise<{ reference: MediaReferenceDto; created: boolean }> {
    await this.assertAdmin(actorUserId);
    const rule = mediaReferenceRule(command.targetKind);
    if (
      !(await mediaReferenceTargetExists(
        this.database,
        rule.slot,
        command.targetId,
      ))
    ) {
      throw new AppError("Media target not found.", 404, "NOT_FOUND");
    }
    try {
      return await this.database.$transaction(
        async (transaction) => {
          await transaction.$queryRaw`SELECT id FROM media_assets WHERE id = ${command.assetId}::uuid FOR UPDATE`;
          const asset = await transaction.mediaAsset.findUnique({
            where: { id: command.assetId },
          });
          if (
            asset === null ||
            asset.scope !== MediaScope.ADMIN ||
            asset.mediaClass !== rule.mediaClass ||
            asset.status !== MediaAssetStatus.AVAILABLE
          ) {
            throw new AppError("Media asset not found.", 404, "NOT_FOUND");
          }
          const existing = await findActiveMediaReference(
            transaction,
            rule.slot,
            command.targetId,
          );
          if (existing !== null) {
            if (existing.assetId === command.assetId) {
              return { reference: mapMediaReference(existing), created: false };
            }
            throw new AppError(
              "Media target already has a reference.",
              409,
              "MEDIA_TARGET_CONFLICT",
            );
          }
          const reference = await transaction.mediaReference.create({
            data: {
              assetId: command.assetId,
              slot: rule.slot,
              ...(rule.slot === "CHAPTER_PAGE"
                ? { chapterPageId: command.targetId }
                : { workId: command.targetId }),
            },
          });
          await transaction.mediaReferenceEvent.create({
            data: {
              referenceId: reference.id,
              actorUserId,
              action: MediaReferenceAction.BOUND,
              toAssetId: command.assetId,
              resultVersion: 0,
            },
          });
          return { reference: mapMediaReference(reference), created: true };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      const targetRace =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002";
      if (targetRace || isTransactionWriteConflict(error)) {
        const winner = await findActiveMediaReference(
          this.database,
          rule.slot,
          command.targetId,
        );
        if (winner?.assetId === command.assetId) {
          return { reference: mapMediaReference(winner), created: false };
        }
        if (winner === null && isTransactionWriteConflict(error)) {
          const asset = await findMediaAsset(this.database, command.assetId);
          if (
            asset === null ||
            asset.status !== MediaAssetStatus.AVAILABLE ||
            asset.scope !== MediaScope.ADMIN ||
            asset.mediaClass !== rule.mediaClass
          ) {
            throw new AppError("Media asset not found.", 404, "NOT_FOUND");
          }
        }
        throw new AppError(
          "Media target already has a reference.",
          409,
          "MEDIA_TARGET_CONFLICT",
        );
      }
      throw error;
    }
  }

  async replaceReference(
    actorUserId: string,
    referenceId: string,
    command: MediaReferenceReplace,
  ): Promise<MediaReferenceDto> {
    await this.assertAdmin(actorUserId);
    try {
      return await this.database.$transaction(
        async (transaction) => {
          const ids = [command.assetId, command.expectedAssetId].sort();
          for (const id of ids) {
            await transaction.$queryRaw`SELECT id FROM media_assets WHERE id = ${id}::uuid FOR UPDATE`;
          }
          await transaction.$queryRaw`SELECT id FROM media_references WHERE id = ${referenceId}::uuid FOR UPDATE`;
          const reference = await transaction.mediaReference.findUnique({
            where: { id: referenceId },
          });
          if (reference === null || reference.retiredAt !== null) {
            throw new AppError("Media reference not found.", 404, "NOT_FOUND");
          }
          if (
            reference.assetId === command.assetId &&
            reference.version === command.expectedVersion + 1
          ) {
            const repeated = await transaction.mediaReferenceEvent.findUnique({
              where: {
                referenceId_resultVersion: {
                  referenceId,
                  resultVersion: reference.version,
                },
              },
            });
            if (
              repeated?.action === MediaReferenceAction.REPLACED &&
              repeated.actorUserId === actorUserId &&
              repeated.fromAssetId === command.expectedAssetId &&
              repeated.toAssetId === command.assetId
            ) {
              return mapMediaReference(reference);
            }
            throw versionConflict();
          }
          if (
            reference.assetId !== command.expectedAssetId ||
            reference.version !== command.expectedVersion
          ) {
            throw versionConflict();
          }
          const asset = await transaction.mediaAsset.findUnique({
            where: { id: command.assetId },
          });
          const expectedClass =
            reference.slot === "WORK_COVER"
              ? "WORK_COVER"
              : reference.slot === "WORK_BACKGROUND"
                ? "WORK_BACKGROUND"
                : "CHAPTER_PAGE";
          if (
            asset === null ||
            asset.scope !== MediaScope.ADMIN ||
            asset.mediaClass !== expectedClass ||
            asset.status !== MediaAssetStatus.AVAILABLE
          ) {
            throw new AppError("Media asset not found.", 404, "NOT_FOUND");
          }
          const resultVersion = reference.version + 1;
          const updated = await transaction.mediaReference.update({
            where: { id: reference.id },
            data: { assetId: command.assetId, version: resultVersion },
          });
          await transaction.mediaReferenceEvent.create({
            data: {
              referenceId: reference.id,
              actorUserId,
              action: MediaReferenceAction.REPLACED,
              fromAssetId: reference.assetId,
              toAssetId: command.assetId,
              resultVersion,
            },
          });
          return mapMediaReference(updated);
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (!isTransactionWriteConflict(error)) throw error;
      const reference = await this.database.mediaReference.findUnique({
        where: { id: referenceId },
      });
      if (
        reference !== null &&
        reference.retiredAt === null &&
        reference.assetId === command.assetId &&
        reference.version === command.expectedVersion + 1
      ) {
        const event = await this.database.mediaReferenceEvent.findUnique({
          where: {
            referenceId_resultVersion: {
              referenceId,
              resultVersion: reference.version,
            },
          },
        });
        if (
          event?.action === MediaReferenceAction.REPLACED &&
          event.actorUserId === actorUserId &&
          event.fromAssetId === command.expectedAssetId &&
          event.toAssetId === command.assetId
        ) {
          return mapMediaReference(reference);
        }
      }
      throw versionConflict();
    }
  }

  async retireReference(
    actorUserId: string,
    referenceId: string,
    command: MediaReferenceRetire,
  ): Promise<{ id: string; status: "retired"; version: number }> {
    await this.assertAdmin(actorUserId);
    try {
      return await this.database.$transaction(
        async (transaction) => {
          await transaction.$queryRaw`SELECT id FROM media_references WHERE id = ${referenceId}::uuid FOR UPDATE`;
          const reference = await transaction.mediaReference.findUnique({
            where: { id: referenceId },
          });
          if (reference === null)
            throw new AppError("Media reference not found.", 404, "NOT_FOUND");
          if (reference.retiredAt !== null) {
            const repeated = await transaction.mediaReferenceEvent.findUnique({
              where: {
                referenceId_resultVersion: {
                  referenceId,
                  resultVersion: reference.version,
                },
              },
            });
            if (
              repeated?.action === MediaReferenceAction.RETIRED &&
              repeated.actorUserId === actorUserId &&
              repeated.fromAssetId === command.expectedAssetId &&
              reference.version === command.expectedVersion + 1
            ) {
              return {
                id: reference.id,
                status: "retired",
                version: reference.version,
              };
            }
            throw new AppError("Media reference not found.", 404, "NOT_FOUND");
          }
          if (
            reference.assetId !== command.expectedAssetId ||
            reference.version !== command.expectedVersion
          ) {
            throw versionConflict();
          }
          const resultVersion = reference.version + 1;
          await transaction.mediaReference.update({
            where: { id: reference.id },
            data: { retiredAt: new Date(), version: resultVersion },
          });
          await transaction.mediaReferenceEvent.create({
            data: {
              referenceId: reference.id,
              actorUserId,
              action: MediaReferenceAction.RETIRED,
              fromAssetId: reference.assetId,
              resultVersion,
            },
          });
          return {
            id: reference.id,
            status: "retired",
            version: resultVersion,
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (!isTransactionWriteConflict(error)) throw error;
      const reference = await this.database.mediaReference.findUnique({
        where: { id: referenceId },
      });
      if (
        reference !== null &&
        reference.retiredAt !== null &&
        reference.assetId === command.expectedAssetId &&
        reference.version === command.expectedVersion + 1
      ) {
        const event = await this.database.mediaReferenceEvent.findUnique({
          where: {
            referenceId_resultVersion: {
              referenceId,
              resultVersion: reference.version,
            },
          },
        });
        if (
          event?.action === MediaReferenceAction.RETIRED &&
          event.actorUserId === actorUserId &&
          event.fromAssetId === command.expectedAssetId
        ) {
          return {
            id: reference.id,
            status: "retired",
            version: reference.version,
          };
        }
      }
      throw versionConflict();
    }
  }

  async removeAdminAsset(
    actorUserId: string,
    assetId: string,
  ): Promise<{ id: string; status: "removed" }> {
    await this.assertAdmin(actorUserId);
    let asset: MediaAsset;
    try {
      asset = await this.database.$transaction(
        async (transaction) => {
          await transaction.$queryRaw`SELECT id FROM media_assets WHERE id = ${assetId}::uuid FOR UPDATE`;
          const current = await transaction.mediaAsset.findUnique({
            where: { id: assetId },
          });
          if (current === null || current.scope !== MediaScope.ADMIN) {
            throw new AppError("Media asset not found.", 404, "NOT_FOUND");
          }
          if (current.status === MediaAssetStatus.REMOVED) return current;
          if (current.status === MediaAssetStatus.REMOVING) throw unavailable();
          if (
            current.status !== MediaAssetStatus.AVAILABLE &&
            current.status !== MediaAssetStatus.UNAVAILABLE
          ) {
            throw new AppError("Media asset not found.", 404, "NOT_FOUND");
          }
          const activeUses = await transaction.mediaReference.count({
            where: { assetId, retiredAt: null },
          });
          if (activeUses > 0) {
            throw new AppError("Media asset is in use.", 409, "MEDIA_IN_USE");
          }
          return transaction.mediaAsset.update({
            where: { id: assetId },
            data: { status: MediaAssetStatus.REMOVING },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (!isTransactionWriteConflict(error)) throw error;
      const activeUses = await this.database.mediaReference.count({
        where: { assetId, retiredAt: null },
      });
      if (activeUses > 0) {
        throw new AppError("Media asset is in use.", 409, "MEDIA_IN_USE");
      }
      const current = await findMediaAsset(this.database, assetId);
      if (current?.status === MediaAssetStatus.REMOVED) {
        return { id: assetId, status: "removed" };
      }
      throw unavailable();
    }
    if (asset.status === MediaAssetStatus.REMOVED) {
      return { id: asset.id, status: "removed" };
    }
    try {
      await this.storage.remove(asset.id);
    } catch {
      throw unavailable();
    }
    await this.database.mediaAsset.update({
      where: { id: asset.id },
      data: { status: MediaAssetStatus.REMOVED, removedAt: new Date() },
    });
    return { id: asset.id, status: "removed" };
  }

  private toMediaPage(
    assets: MediaAsset[],
    page: number,
    limit: number,
    total: number,
  ): { items: MediaAssetDto[]; pagination: PaginationMeta } {
    const totalPages = Math.ceil(total / limit);
    return {
      items: assets.map(mapMediaAsset),
      pagination: paginationMetaSchema.parse({
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }),
    };
  }

  private async lookupAdminAsset(actorUserId: string, assetId: string) {
    await this.assertAdmin(actorUserId);
    const asset = await findMediaAsset(this.database, assetId);
    if (asset === null || asset.scope !== MediaScope.ADMIN) {
      throw new AppError("Media asset not found.", 404, "NOT_FOUND");
    }
    if (asset.status === MediaAssetStatus.REMOVED) {
      throw new AppError("Media asset not found.", 404, "NOT_FOUND");
    }
    if (asset.status !== MediaAssetStatus.AVAILABLE) throw unavailable();
    return asset;
  }

  private async lookupAsset(actorUserId: string, assetId: string) {
    const actor = await this.assertActiveActor(actorUserId);
    const ownedAvatar = await findOwnedAvatarAsset(
      this.database,
      actorUserId,
      assetId,
    );
    if (ownedAvatar !== null) {
      if (ownedAvatar.status === MediaAssetStatus.REMOVED) {
        throw new AppError("Media asset not found.", 404, "NOT_FOUND");
      }
      if (ownedAvatar.status !== MediaAssetStatus.AVAILABLE)
        throw unavailable();
      return ownedAvatar;
    }
    const asset = await findMediaAsset(this.database, assetId);
    if (
      asset === null ||
      asset.scope !== MediaScope.ADMIN ||
      actor.role !== UserRole.ADMIN
    ) {
      throw new AppError("Media asset not found.", 404, "NOT_FOUND");
    }
    if (asset.status === MediaAssetStatus.REMOVED) {
      throw new AppError("Media asset not found.", 404, "NOT_FOUND");
    }
    if (asset.status !== MediaAssetStatus.AVAILABLE) throw unavailable();
    return asset;
  }

  private async assertAdmin(actorUserId: string): Promise<void> {
    const actor = await this.assertActiveActor(actorUserId);
    if (actor.role !== UserRole.ADMIN) {
      throw new AppError("Administrator access required.", 403, "FORBIDDEN");
    }
  }

  private async assertActiveActor(actorUserId: string) {
    const actor = await this.database.user.findUnique({
      where: { id: actorUserId },
      select: { role: true, status: true, emailVerifiedAt: true },
    });
    if (
      actor === null ||
      actor.status !== UserStatus.ACTIVE ||
      actor.emailVerifiedAt === null
    ) {
      throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
    }
    return actor;
  }

  private async resolveAttempt(
    attempt: UploadAttempt,
    command: UploadMediaCommand,
    sourceSha256: string,
  ): Promise<{ asset: MediaAssetDto; replayed: boolean }> {
    if (
      attempt.mediaClass !== toDatabaseMediaClass(command.mediaClass) ||
      attempt.state === UploadAttemptState.REJECTED ||
      (attempt.sourceSha256 !== null && attempt.sourceSha256 !== sourceSha256)
    ) {
      throw new AppError(
        "Upload attempt key conflicts with its prior result.",
        409,
        "UPLOAD_ATTEMPT_CONFLICT",
      );
    }
    if (attempt.state === UploadAttemptState.PENDING) {
      throw new AppError(
        "Upload attempt is still pending.",
        409,
        "UPLOAD_IN_PROGRESS",
      );
    }
    if (attempt.sourceSha256 !== sourceSha256) {
      throw new AppError(
        "Upload attempt key conflicts with its prior result.",
        409,
        "UPLOAD_ATTEMPT_CONFLICT",
      );
    }
    if (attempt.assetId === null) throw unavailable();
    const asset = await findMediaAsset(this.database, attempt.assetId);
    if (asset === null || asset.status !== MediaAssetStatus.AVAILABLE)
      throw unavailable();
    await this.read(command.actorUserId, asset.id);
    return { asset: mapMediaAsset(asset), replayed: true };
  }

  private async rejectAttempt(
    actorUserId: string,
    attemptId: string,
    assetId: string,
    failureCode: string,
  ): Promise<void> {
    await this.database.$transaction(async (transaction) => {
      await transaction.mediaAsset.update({
        where: { id: assetId },
        data: { status: MediaAssetStatus.REMOVED, removedAt: new Date() },
      });
      await transaction.uploadAttempt.update({
        where: { actorUserId_id: { actorUserId, id: attemptId } },
        data: {
          state: UploadAttemptState.REJECTED,
          safeFailureCode: failureCode,
          completedAt: new Date(),
        },
      });
    });
  }
}

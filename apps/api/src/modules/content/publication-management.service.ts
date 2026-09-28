import type { PublicationTransition } from "@fury/contracts";
import { Prisma, PublicationStatus, type DatabaseClient } from "@fury/database";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import {
  isFeaturedPositionConflict,
  isTransactionConflict,
} from "./content-write-conflict.js";
import {
  ContentFeaturedConflictException,
  ContentStaleWriteException,
  ContentTransitionConflictException,
} from "./content.errors.js";
import { mapPublicationStatus } from "./content.mapper.js";
import {
  findAdminWork,
  findAdminChapter,
  findPublishedFeaturedWork,
  lockCategoryEligibilityState,
  readWorkReadiness,
} from "./content.queries.js";
import {
  assertPublicationTransition,
  assertFeaturedPositionAvailable,
  assertWorkReady,
  assertChapterReady,
  toDatabasePublicationStatus,
} from "./content.rules.js";
import type {
  PublicationDependencies,
  PublicationRecord,
  PublicationResourceType,
  PublicationWrite,
} from "./content.types.js";
import type { PublicationCommandBodyDto } from "./dto/content.dto.js";

export class PublicationManagementService {
  constructor(
    private readonly database: DatabaseClient,
    private readonly dependencies: PublicationDependencies,
  ) {}

  async publishWork(
    workId: string,
    command: PublicationCommandBodyDto,
  ): Promise<PublicationTransition> {
    const transition = await this.transitionWork(workId, command);
    return transition;
  }

  async publishChapter(
    workId: string,
    chapterId: string,
    command: PublicationCommandBodyDto,
  ): Promise<PublicationTransition> {
    const transition = await this.transitionChapter(workId, chapterId, command);
    return transition;
  }

  // Helper methods

  private async transitionWork(
    workId: string,
    command: PublicationCommandBodyDto,
  ): Promise<PublicationTransition> {
    const target = toDatabasePublicationStatus(command.targetState);
    try {
      const transition = await this.database.$transaction(
        async (transaction) => {
          if (target === PublicationStatus.PUBLISHED) {
            await lockCategoryEligibilityState(transaction);
          }
          await transaction.$queryRaw`
            SELECT "id"
            FROM "works"
            WHERE "id" = ${workId}::uuid
            FOR UPDATE
          `;
          const current = await transaction.work.findUnique({
            where: { id: workId },
          });
          if (current === null) throw new NotFoundException();
          if (current.publicationStatus === target) {
            const unchangedTransition = this.transitionResult(
              "work",
              current,
              false,
            );
            return unchangedTransition;
          }
          assertPublicationTransition(current.publicationStatus, target);
          if (current.version !== command.expectedVersion) {
            throw new ContentStaleWriteException();
          }
          if (target === PublicationStatus.PUBLISHED) {
            const record = await findAdminWork(transaction, workId);
            if (record === null) throw new NotFoundException();
            assertWorkReady(await readWorkReadiness(transaction, record));
            const featuredOrder = record.featuredHome
              ? record.featuredOrder
              : null;
            const occupied =
              featuredOrder !== null &&
              (await findPublishedFeaturedWork(
                transaction,
                featuredOrder,
                workId,
              )) !== null;
            assertFeaturedPositionAvailable(
              record.featuredHome,
              featuredOrder,
              occupied,
            );
          }
          const publication = await this.buildPublicationWrite(
            transaction,
            "work",
            workId,
            target,
          );
          const updated = await transaction.work.updateMany({
            where: { id: workId, version: command.expectedVersion },
            data: {
              publicationStatus: target,
              publishedAt: publication.publishedAt,
              currentPublicationEventId: publication.eventId,
              version: { increment: 1 },
            },
          });
          if (updated.count !== 1) throw new ContentStaleWriteException();
          const updatedWork = await transaction.work.findUniqueOrThrow({
            where: { id: workId },
          });
          const completedTransition = this.transitionResult(
            "work",
            updatedWork,
            true,
          );
          return completedTransition;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return transition;
    } catch (error: unknown) {
      const recoveredTransition = await this.classifyTransitionFailure(
        "work",
        workId,
        target,
        error,
      );
      return recoveredTransition;
    }
  }

  private async transitionChapter(
    workId: string,
    chapterId: string,
    command: PublicationCommandBodyDto,
  ): Promise<PublicationTransition> {
    const target = toDatabasePublicationStatus(command.targetState);
    try {
      const transition = await this.database.$transaction(
        async (transaction) => {
          await transaction.$queryRaw`
            SELECT "id"
            FROM "chapters"
            WHERE "id" = ${chapterId}::uuid
              AND "work_id" = ${workId}::uuid
            FOR UPDATE
          `;
          const current = await transaction.chapter.findFirst({
            where: { id: chapterId, workId },
          });
          if (current === null) throw new NotFoundException();
          if (current.publicationStatus === target) {
            const unchangedTransition = this.transitionResult(
              "chapter",
              current,
              false,
            );
            return unchangedTransition;
          }
          assertPublicationTransition(current.publicationStatus, target);
          if (current.version !== command.expectedVersion) {
            throw new ContentStaleWriteException();
          }
          if (target === PublicationStatus.PUBLISHED) {
            const chapter = await findAdminChapter(
              transaction,
              workId,
              chapterId,
            );
            if (chapter === null) throw new NotFoundException();
            assertChapterReady(chapter);
          }
          const publication = await this.buildPublicationWrite(
            transaction,
            "chapter",
            chapterId,
            target,
          );
          const updated = await transaction.chapter.updateMany({
            where: {
              id: chapterId,
              workId,
              version: command.expectedVersion,
            },
            data: {
              publicationStatus: target,
              publishedAt: publication.publishedAt,
              currentPublicationEventId: publication.eventId,
              version: { increment: 1 },
            },
          });
          if (updated.count !== 1) throw new ContentStaleWriteException();
          const updatedChapter = await transaction.chapter.findUniqueOrThrow({
            where: { id: chapterId },
          });
          const completedTransition = this.transitionResult(
            "chapter",
            updatedChapter,
            true,
          );
          return completedTransition;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return transition;
    } catch (error: unknown) {
      const recoveredTransition = await this.classifyTransitionFailure(
        "chapter",
        chapterId,
        target,
        error,
        workId,
      );
      return recoveredTransition;
    }
  }

  private async buildPublicationWrite(
    transaction: Prisma.TransactionClient,
    resourceType: PublicationResourceType,
    resourceId: string,
    target: PublicationStatus,
  ): Promise<PublicationWrite> {
    if (target !== PublicationStatus.PUBLISHED) {
      return { eventId: null, publishedAt: null };
    }
    const eventId = this.dependencies.createIdentifier();
    const publishedAt = this.dependencies.currentTime();
    await transaction.publicationEvent.create({
      data: {
        id: eventId,
        occurredAt: publishedAt,
        ...(resourceType === "work"
          ? { workId: resourceId }
          : { chapterId: resourceId }),
      },
    });
    return { eventId, publishedAt };
  }

  private transitionResult(
    resourceType: PublicationResourceType,
    record: PublicationRecord,
    transitioned: boolean,
  ): PublicationTransition {
    return {
      resourceType,
      resourceId: record.id,
      publicationStatus: mapPublicationStatus(record.publicationStatus),
      publishedAt: record.publishedAt?.toISOString() ?? null,
      publicationEventId: record.currentPublicationEventId,
      version: record.version,
      transitioned,
    };
  }

  private async classifyTransitionFailure(
    resourceType: PublicationResourceType,
    resourceId: string,
    target: PublicationStatus,
    error: unknown,
    workId?: string,
  ): Promise<PublicationTransition> {
    if (isFeaturedPositionConflict(error))
      throw new ContentFeaturedConflictException();
    if (
      error instanceof NotFoundException ||
      error instanceof ContentTransitionConflictException
    ) {
      throw error;
    }
    if (
      error instanceof ContentStaleWriteException ||
      isTransactionConflict(error)
    ) {
      const record =
        resourceType === "work"
          ? await this.database.work.findUnique({ where: { id: resourceId } })
          : workId === undefined
            ? null
            : await this.database.chapter.findFirst({
                where: { id: resourceId, workId },
              });
      if (record === null) throw new NotFoundException();
      if (record.publicationStatus === target) {
        const unchangedTransition = this.transitionResult(
          resourceType,
          record,
          false,
        );
        return unchangedTransition;
      }
      throw new ContentStaleWriteException();
    }
    throw error;
  }
}

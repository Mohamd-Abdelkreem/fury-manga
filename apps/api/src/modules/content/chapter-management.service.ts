import type {
  AdminChapter,
  AdminChapterListQuery,
  AdminChapterSummary,
} from "@fury/contracts";
import {
  ChapterContentType,
  MediaAssetStatus,
  MediaClass,
  MediaReferenceAction,
  MediaReferenceSlot,
  MediaScope,
  Prisma,
  PublicationStatus,
  UserRole,
  UserStatus,
  type DatabaseClient,
} from "@fury/database";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import { AppError } from "../../core/errors/app.error.js";
import type { PaginationQuery } from "../../core/pagination/pagination.js";
import { buildPaginationMeta } from "../../core/pagination/pagination.js";
import { rethrowWriteConflict } from "./content-write-conflict.js";
import {
  ContentNotReadyException,
  ContentStaleWriteException,
  ContentTypeConflictException,
} from "./content.errors.js";
import { mapAdminChapter, mapAdminChapterSummary } from "./content.mapper.js";
import {
  buildAdminChapterWhere,
  findAdminChapter,
  listAdminChapterSummaries,
  readChapterSummaryReadiness,
} from "./content.queries.js";
import {
  assertChapterPageSequence,
  assertChapterReady,
  assertPositiveChapterNumber,
  assertStructuredTextDocument,
  deriveChapterContentType,
  normalizeChapterTitle,
} from "./content.rules.js";
import type { ContentList } from "./content.types.js";
import type {
  CreateChapterBodyDto,
  UpdateChapterBodyDto,
} from "./dto/content.dto.js";

export class ChapterManagementService {
  constructor(private readonly database: DatabaseClient) {}

  async listChapters(
    workId: string,
    pagination: PaginationQuery,
    query: AdminChapterListQuery,
  ): Promise<ContentList<AdminChapterSummary>> {
    const { records, total, readiness } = await this.database.$transaction(
      async (transaction) => {
        const work = await transaction.work.findUnique({
          where: { id: workId },
          select: { id: true },
        });
        if (work === null) throw new NotFoundException();
        const where = buildAdminChapterWhere(workId, query);
        const records = await listAdminChapterSummaries(
          transaction,
          workId,
          pagination,
          query,
        );
        const total = await transaction.chapter.count({ where });
        const readiness = await readChapterSummaryReadiness(
          transaction,
          records.map(({ id }) => id),
        );
        return { records, total, readiness };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    return {
      items: records.map((record) => {
        const ready = readiness.get(record.id);
        if (ready === undefined)
          throw new Error("Chapter summary readiness is missing.");
        return mapAdminChapterSummary(record, ready);
      }),
      pagination: buildPaginationMeta({ ...pagination, total }),
    };
  }

  async createChapter(
    workId: string,
    data: CreateChapterBodyDto,
    actorUserId: string,
  ): Promise<AdminChapter> {
    assertPositiveChapterNumber(data.number);
    const title = normalizeChapterTitle(data.title);
    await this.assertAdmin(actorUserId);
    const work = await this.database.work.findUnique({
      where: { id: workId },
      select: { id: true, type: true },
    });
    if (work === null) throw new NotFoundException();
    const contentType = deriveChapterContentType(work.type);
    this.assertChapterRepresentation(contentType, data);
    try {
      const created = await this.database.$transaction(
        async (transaction) => {
          if (data.pages !== undefined) {
            await this.assertAvailableAssets(transaction, data.pages);
          }
          const chapter = await transaction.chapter.create({
            data: {
              workId,
              number: data.number,
              title,
              contentType,
              ...(data.textContent === undefined
                ? {}
                : {
                    textContent:
                      data.textContent === null
                        ? Prisma.DbNull
                        : data.textContent,
                  }),
            },
            select: { id: true },
          });
          if (data.pages !== undefined) {
            await this.createPages(
              transaction,
              chapter.id,
              data.pages,
              actorUserId,
            );
          }
          const saved = await findAdminChapter(transaction, workId, chapter.id);
          if (saved === null) throw new NotFoundException();
          return mapAdminChapter(saved);
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return created;
    } catch (error: unknown) {
      const writeConflict = rethrowWriteConflict(error);
      return writeConflict;
    }
  }

  async getChapter(workId: string, chapterId: string): Promise<AdminChapter> {
    const chapter = await findAdminChapter(this.database, workId, chapterId);
    if (chapter === null) throw new NotFoundException();
    return mapAdminChapter(chapter);
  }

  async updateChapter(
    workId: string,
    chapterId: string,
    data: UpdateChapterBodyDto,
    actorUserId: string,
  ): Promise<AdminChapter> {
    if (data.number !== undefined) assertPositiveChapterNumber(data.number);
    const title =
      data.title === undefined ? undefined : normalizeChapterTitle(data.title);
    await this.assertAdmin(actorUserId);
    try {
      const updated = await this.database.$transaction(
        async (transaction) => {
          await transaction.$queryRaw`
            SELECT id FROM chapters WHERE id = ${chapterId}::uuid
              AND work_id = ${workId}::uuid FOR UPDATE
          `;
          const current = await findAdminChapter(
            transaction,
            workId,
            chapterId,
          );
          if (current === null) throw new NotFoundException();
          this.assertChapterRepresentation(current.contentType, data);
          if (current.version !== data.expectedVersion) {
            throw new ContentStaleWriteException();
          }
          if (
            current.contentType === ChapterContentType.TEXT &&
            current.publicationStatus === PublicationStatus.PUBLISHED &&
            data.textContent === null
          ) {
            throw new ContentNotReadyException(["textContent"], "Chapter");
          }
          if (data.pages !== undefined) {
            if (
              current.publicationStatus === PublicationStatus.PUBLISHED &&
              data.pages.length === 0
            ) {
              throw new ContentNotReadyException(["pages"], "Chapter");
            }
            await this.assertAvailableAssets(transaction, data.pages);
            await this.replacePages(
              transaction,
              current,
              data.pages,
              actorUserId,
            );
          }
          await transaction.chapter.update({
            where: { id: chapterId },
            data: {
              ...(data.number === undefined ? {} : { number: data.number }),
              ...(title === undefined ? {} : { title }),
              ...(data.textContent === undefined
                ? {}
                : {
                    textContent:
                      data.textContent === null
                        ? Prisma.DbNull
                        : data.textContent,
                  }),
              version: { increment: 1 },
            },
          });
          const saved = await findAdminChapter(transaction, workId, chapterId);
          if (saved === null) throw new NotFoundException();
          if (saved.publicationStatus === PublicationStatus.PUBLISHED) {
            assertChapterReady(saved);
          }
          return mapAdminChapter(saved);
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return updated;
    } catch (error: unknown) {
      const writeConflict = rethrowWriteConflict(error);
      return writeConflict;
    }
  }

  // Helper methods
  private async assertAdmin(actorUserId: string): Promise<void> {
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
    if (actor.role !== UserRole.ADMIN) {
      throw new AppError("Administrator access required.", 403, "FORBIDDEN");
    }
  }

  private assertChapterRepresentation(
    contentType: ChapterContentType,
    data: CreateChapterBodyDto | UpdateChapterBodyDto,
  ): void {
    if (contentType === ChapterContentType.TEXT) {
      if (data.pages !== undefined) {
        throw new ContentTypeConflictException("Text Chapters reject pages.");
      }
      if (data.textContent !== undefined && data.textContent !== null) {
        assertStructuredTextDocument(data.textContent);
      }
      return;
    }
    if (data.textContent !== undefined) {
      throw new ContentTypeConflictException(
        "Illustrated Chapters reject text.",
      );
    }
    if (data.pages !== undefined) assertChapterPageSequence(data.pages);
  }

  private async assertAvailableAssets(
    transaction: Prisma.TransactionClient,
    pages: readonly Readonly<{ assetId: string }>[],
  ): Promise<void> {
    for (const assetId of [
      ...new Set(pages.map(({ assetId }) => assetId)),
    ].sort()) {
      await transaction.$queryRaw`
        SELECT id FROM media_assets WHERE id = ${assetId}::uuid FOR UPDATE
      `;
      const asset = await transaction.mediaAsset.findUnique({
        where: { id: assetId },
        select: { mediaClass: true, scope: true, status: true },
      });
      if (
        asset?.mediaClass !== MediaClass.CHAPTER_PAGE ||
        asset.scope !== MediaScope.ADMIN ||
        asset.status !== MediaAssetStatus.AVAILABLE
      ) {
        throw new NotFoundException();
      }
    }
  }

  private async createPages(
    transaction: Prisma.TransactionClient,
    chapterId: string,
    pages: readonly Readonly<{ assetId: string }>[],
    actorUserId: string,
  ): Promise<void> {
    for (const [index, { assetId }] of pages.entries()) {
      await this.createPageAtPosition(
        transaction,
        chapterId,
        assetId,
        index + 1,
        actorUserId,
      );
    }
  }

  private async replacePages(
    transaction: Prisma.TransactionClient,
    current: NonNullable<Awaited<ReturnType<typeof findAdminChapter>>>,
    pages: readonly Readonly<{ id?: string | undefined; assetId: string }>[],
    actorUserId: string,
  ): Promise<void> {
    const existing = new Map(current.pages.map((page) => [page.id, page]));
    for (const { id } of pages) {
      if (id !== undefined && !existing.has(id)) throw new NotFoundException();
    }
    for (const page of [...current.pages].sort((left, right) =>
      left.id.localeCompare(right.id),
    )) {
      await transaction.$queryRaw`
        SELECT id FROM chapter_pages WHERE id = ${page.id}::uuid FOR UPDATE
      `;
      for (const reference of [...page.mediaReferences].sort((left, right) =>
        left.id.localeCompare(right.id),
      )) {
        await transaction.$queryRaw`
          SELECT id FROM media_references WHERE id = ${reference.id}::uuid FOR UPDATE
        `;
      }
    }
    const retainedIds = new Set(
      pages.flatMap(({ id }) => (id === undefined ? [] : [id])),
    );
    for (const page of current.pages) {
      if (retainedIds.has(page.id)) continue;
      const reference = page.mediaReferences[0];
      if (reference !== undefined) {
        await transaction.mediaReference.update({
          where: { id: reference.id },
          data: { retiredAt: new Date(), version: { increment: 1 } },
        });
        await transaction.mediaReferenceEvent.create({
          data: {
            referenceId: reference.id,
            actorUserId,
            action: MediaReferenceAction.RETIRED,
            fromAssetId: reference.assetId,
            resultVersion: reference.version + 1,
          },
        });
      }
      await transaction.chapterPage.update({
        where: { id: page.id },
        data: { retiredAt: new Date() },
      });
    }
    const maximum = Math.max(
      0,
      ...current.pages.map(({ position }) => position),
    );
    if (maximum > 2_147_483_647 - 501 - pages.length) {
      throw new ContentTypeConflictException(
        "Legacy page positions require remediation.",
      );
    }
    for (const [index, { id }] of pages.entries()) {
      if (id === undefined) continue;
      await transaction.chapterPage.update({
        where: { id },
        data: { position: maximum + 501 + index },
      });
    }
    for (const [index, page] of pages.entries()) {
      if (page.id === undefined) {
        await this.createPageAtPosition(
          transaction,
          current.id,
          page.assetId,
          index + 1,
          actorUserId,
        );
        continue;
      }
      const persisted = existing.get(page.id);
      if (persisted === undefined) throw new NotFoundException();
      await transaction.chapterPage.update({
        where: { id: page.id },
        data: { position: index + 1 },
      });
      const reference = persisted.mediaReferences[0];
      if (reference === undefined) throw new NotFoundException();
      if (reference.assetId !== page.assetId) {
        await transaction.mediaReference.update({
          where: { id: reference.id },
          data: { assetId: page.assetId, version: { increment: 1 } },
        });
        await transaction.mediaReferenceEvent.create({
          data: {
            referenceId: reference.id,
            actorUserId,
            action: MediaReferenceAction.REPLACED,
            fromAssetId: reference.assetId,
            toAssetId: page.assetId,
            resultVersion: reference.version + 1,
          },
        });
      }
    }
  }

  private async createPageAtPosition(
    transaction: Prisma.TransactionClient,
    chapterId: string,
    assetId: string,
    position: number,
    actorUserId: string,
  ): Promise<void> {
    const page = await transaction.chapterPage.create({
      data: { chapterId, position },
      select: { id: true },
    });
    const reference = await transaction.mediaReference.create({
      data: {
        assetId,
        chapterPageId: page.id,
        slot: MediaReferenceSlot.CHAPTER_PAGE,
      },
      select: { id: true },
    });
    await transaction.mediaReferenceEvent.create({
      data: {
        referenceId: reference.id,
        actorUserId,
        action: MediaReferenceAction.BOUND,
        toAssetId: assetId,
        resultVersion: 0,
      },
    });
  }
}

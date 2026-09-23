import type { AdminChapter, StructuredTextDocument } from "@fury/contracts";
import {
  ChapterContentType,
  Prisma,
  type DatabaseClient,
} from "@fury/database";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import type { PaginationQuery } from "../../core/pagination/pagination.js";
import { buildPaginationMeta } from "../../core/pagination/pagination.js";
import { rethrowWriteConflict } from "./content-write-conflict.js";
import {
  ContentStaleWriteException,
  ContentTypeConflictException,
} from "./content.errors.js";
import { CHAPTER_SELECT, mapAdminChapter } from "./content.mapper.js";
import { findAdminChapter, listAdminChapters } from "./content.queries.js";
import {
  assertChapterPageSequence,
  assertPositiveChapterNumber,
  assertStructuredTextDocument,
  deriveChapterContentType,
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
  ): Promise<ContentList<AdminChapter>> {
    const work = await this.database.work.findUnique({
      where: { id: workId },
      select: { id: true },
    });
    if (work === null) throw new NotFoundException();
    const [records, total] = await this.database.$transaction(
      async (transaction) =>
        Promise.all([
          listAdminChapters(transaction, workId, pagination),
          transaction.chapter.count({ where: { workId } }),
        ]),
    );
    return {
      items: records.map(mapAdminChapter),
      pagination: buildPaginationMeta({ ...pagination, total }),
    };
  }

  async createChapter(
    workId: string,
    data: CreateChapterBodyDto,
  ): Promise<AdminChapter> {
    assertPositiveChapterNumber(data.number);
    const work = await this.database.work.findUnique({
      where: { id: workId },
      select: { id: true, type: true },
    });
    if (work === null) throw new NotFoundException();
    const contentType = deriveChapterContentType(work.type);
    this.assertChapterRepresentation(contentType, data);
    try {
      const chapter = await this.database.chapter.create({
        data: {
          work: { connect: { id: workId } },
          number: data.number,
          contentType,
          ...(data.textContent === undefined
            ? {}
            : { textContent: data.textContent }),
          ...(data.pages === undefined
            ? {}
            : {
                pages: {
                  create: data.pages.map(({ position }) => ({ position })),
                },
              }),
        },
        select: CHAPTER_SELECT,
      });
      return mapAdminChapter(chapter);
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
  ): Promise<AdminChapter> {
    if (data.number !== undefined) assertPositiveChapterNumber(data.number);
    try {
      const updatedChapter = await this.database.$transaction(
        async (transaction) => {
          const current = await findAdminChapter(
            transaction,
            workId,
            chapterId,
          );
          if (current === null) throw new NotFoundException();
          this.assertChapterRepresentation(current.contentType, data);
          const requestedPositions = data.pages
            ?.map(({ position }) => position)
            .toSorted((left, right) => left - right);
          const currentPositions = current.pages
            .map(({ position }) => position)
            .toSorted((left, right) => left - right);
          const unchanged =
            (data.number === undefined || data.number === current.number) &&
            this.hasSameText(
              current.textContent as StructuredTextDocument | null,
              data.textContent,
            ) &&
            (requestedPositions === undefined ||
              this.haveSamePositions(requestedPositions, currentPositions));
          if (unchanged) return mapAdminChapter(current);
          if (current.version !== data.expectedVersion) {
            throw new ContentStaleWriteException();
          }
          const updated = await transaction.chapter.updateMany({
            where: {
              id: chapterId,
              workId,
              version: data.expectedVersion,
            },
            data: {
              ...(data.number === undefined ? {} : { number: data.number }),
              ...(data.textContent === undefined
                ? {}
                : { textContent: data.textContent }),
              version: { increment: 1 },
            },
          });
          if (updated.count !== 1) throw new ContentStaleWriteException();
          if (data.pages !== undefined) {
            await transaction.chapterPage.deleteMany({
              where: { chapterId },
            });
            await transaction.chapterPage.createMany({
              data: data.pages.map(({ position }) => ({
                chapterId,
                position,
              })),
            });
          }
          const persistedChapter = await findAdminChapter(
            transaction,
            workId,
            chapterId,
          );
          if (persistedChapter === null) throw new NotFoundException();
          return mapAdminChapter(persistedChapter);
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return updatedChapter;
    } catch (error: unknown) {
      const writeConflict = rethrowWriteConflict(error);
      return writeConflict;
    }
  }

  // Helper methods

  private haveSamePositions(
    left: readonly number[],
    right: readonly number[],
  ): boolean {
    return (
      left.length === right.length &&
      left.every((value, index) => value === right[index])
    );
  }

  private hasSameText(
    left: StructuredTextDocument | null,
    right: StructuredTextDocument | undefined,
  ): boolean {
    return (
      right === undefined || JSON.stringify(left) === JSON.stringify(right)
    );
  }

  private assertChapterRepresentation(
    contentType: ChapterContentType,
    data: CreateChapterBodyDto | UpdateChapterBodyDto,
  ): void {
    if (contentType === ChapterContentType.TEXT) {
      if (
        data.pages !== undefined ||
        ("number" in data &&
          !("expectedVersion" in data) &&
          data.textContent === undefined)
      ) {
        throw new ContentTypeConflictException(
          "Text Chapters require structured text and reject pages.",
        );
      }
      if (data.textContent !== undefined) {
        assertStructuredTextDocument(data.textContent);
      }
      return;
    }
    if (data.textContent !== undefined) {
      throw new ContentTypeConflictException(
        "Illustrated Chapters reject structured text.",
      );
    }
    if (data.pages !== undefined) assertChapterPageSequence(data.pages);
  }
}

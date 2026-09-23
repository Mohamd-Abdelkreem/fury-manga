import type { AdminWork } from "@fury/contracts";
import { Prisma, type DatabaseClient } from "@fury/database";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import type { PaginationQuery } from "../../core/pagination/pagination.js";
import { buildPaginationMeta } from "../../core/pagination/pagination.js";
import {
  isTransactionConflict,
  rethrowWriteConflict,
} from "./content-write-conflict.js";
import { ContentStaleWriteException } from "./content.errors.js";
import { mapAdminWork, WORK_SELECT } from "./content.mapper.js";
import { findAdminWork, listAdminWorks } from "./content.queries.js";
import {
  assertImmutableValue,
  toDatabaseStoryStatus,
  toDatabaseWorkType,
} from "./content.rules.js";
import type { ContentList } from "./content.types.js";
import type {
  CreateWorkBodyDto,
  ReplaceWorkCategoriesBodyDto,
  UpdateWorkBodyDto,
} from "./dto/content.dto.js";

export class WorkManagementService {
  constructor(private readonly database: DatabaseClient) {}

  async listWorks(
    pagination: PaginationQuery,
  ): Promise<ContentList<AdminWork>> {
    const [records, total] = await this.database.$transaction(
      async (transaction) =>
        Promise.all([
          listAdminWorks(transaction, pagination),
          transaction.work.count(),
        ]),
    );
    return {
      items: records.map(mapAdminWork),
      pagination: buildPaginationMeta({ ...pagination, total }),
    };
  }

  async createWork(data: CreateWorkBodyDto): Promise<AdminWork> {
    try {
      const record = await this.database.work.create({
        data: {
          title: data.title,
          slug: data.slug,
          type: toDatabaseWorkType(data.type),
          storyStatus: toDatabaseStoryStatus(data.storyStatus),
        },
        select: WORK_SELECT,
      });
      return mapAdminWork(record);
    } catch (error: unknown) {
      const writeConflict = rethrowWriteConflict(error);
      return writeConflict;
    }
  }

  async getWork(workId: string): Promise<AdminWork> {
    const record = await findAdminWork(this.database, workId);
    if (record === null) throw new NotFoundException();
    return mapAdminWork(record);
  }

  async updateWork(
    workId: string,
    data: UpdateWorkBodyDto,
  ): Promise<AdminWork> {
    const current = await findAdminWork(this.database, workId);
    if (current === null) throw new NotFoundException();
    const mapped = mapAdminWork(current);
    assertImmutableValue("Work slug", mapped.slug, data.slug);
    assertImmutableValue("Work type", mapped.type, data.type);
    const title = data.title ?? mapped.title;
    const storyStatus = data.storyStatus ?? mapped.storyStatus;
    if (title === mapped.title && storyStatus === mapped.storyStatus) {
      return mapped;
    }
    if (current.version !== data.expectedVersion) {
      throw new ContentStaleWriteException();
    }
    const updated = await this.database.work.updateMany({
      where: { id: workId, version: data.expectedVersion },
      data: {
        title,
        storyStatus: toDatabaseStoryStatus(storyStatus),
        version: { increment: 1 },
      },
    });
    if (updated.count !== 1) throw new ContentStaleWriteException();
    const updatedWork = await this.getWork(workId);
    return updatedWork;
  }

  async replaceWorkCategories(
    workId: string,
    data: ReplaceWorkCategoriesBodyDto,
  ): Promise<AdminWork> {
    const requestedIds = data.categoryIds.toSorted();
    try {
      const replacedWork = await this.database.$transaction(
        async (transaction) => {
          const work = await findAdminWork(transaction, workId);
          if (work === null) throw new NotFoundException();
          const categories = await transaction.category.findMany({
            where: { id: { in: data.categoryIds } },
            select: { id: true },
          });
          if (categories.length !== data.categoryIds.length) {
            throw new NotFoundException(
              "One or more Categories were not found.",
            );
          }
          const currentIds = work.categories
            .map(({ category }) => category.id)
            .toSorted();
          if (this.haveSameValues(requestedIds, currentIds)) {
            return mapAdminWork(work);
          }
          if (work.version !== data.expectedVersion) {
            throw new ContentStaleWriteException();
          }
          const claimed = await transaction.work.updateMany({
            where: { id: workId, version: data.expectedVersion },
            data: { version: { increment: 1 } },
          });
          if (claimed.count !== 1) throw new ContentStaleWriteException();
          await transaction.workCategory.deleteMany({
            where: {
              workId,
              ...(requestedIds.length === 0
                ? {}
                : { categoryId: { notIn: requestedIds } }),
            },
          });
          const missingIds = requestedIds.filter(
            (id) => !currentIds.includes(id),
          );
          if (missingIds.length > 0) {
            await transaction.workCategory.createMany({
              data: missingIds.map((categoryId) => ({ workId, categoryId })),
            });
          }
          const updatedWork = await findAdminWork(transaction, workId);
          if (updatedWork === null) throw new NotFoundException();
          return mapAdminWork(updatedWork);
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return replacedWork;
    } catch (error: unknown) {
      if (
        error instanceof ContentStaleWriteException ||
        isTransactionConflict(error)
      ) {
        const authoritative = await findAdminWork(this.database, workId);
        if (authoritative === null) throw new NotFoundException();
        const authoritativeIds = authoritative.categories
          .map(({ category }) => category.id)
          .toSorted();
        if (this.haveSameValues(requestedIds, authoritativeIds)) {
          return mapAdminWork(authoritative);
        }
        throw new ContentStaleWriteException();
      }
      const writeConflict = rethrowWriteConflict(error);
      return writeConflict;
    }
  }

  // Helper methods

  private haveSameValues(
    left: readonly string[],
    right: readonly string[],
  ): boolean {
    return (
      left.length === right.length &&
      left.every((value, index) => value === right[index])
    );
  }
}

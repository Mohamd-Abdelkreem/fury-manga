import type { AdminCategory, AdminCategoryMove } from "@fury/contracts";
import { Prisma, PublicationStatus, type DatabaseClient } from "@fury/database";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import type { PaginationQuery } from "../../core/pagination/pagination.js";
import { buildPaginationMeta } from "../../core/pagination/pagination.js";
import { rethrowWriteConflict } from "./content-write-conflict.js";
import {
  ContentCategoryInUseException,
  ContentInvalidCategoryPositionException,
  ContentStaleWriteException,
} from "./content.errors.js";
import { CATEGORY_SELECT, mapAdminCategory } from "./content.mapper.js";
import {
  buildCategoryWhere,
  findAdminCategory,
  listAdminCategories,
  lockCategoryEligibilityState,
  lockCategoryOrder,
} from "./content.queries.js";
import { assertImmutableValue } from "./content.rules.js";
import type { ContentList } from "./content.types.js";
import type {
  CategoryListQueryDto,
  CategoryPositionBodyDto,
  CreateCategoryBodyDto,
  UpdateCategoryBodyDto,
} from "./dto/content.dto.js";

export class CategoryManagementService {
  constructor(private readonly database: DatabaseClient) {}

  async listCategories(
    pagination: PaginationQuery,
    filters: Pick<CategoryListQueryDto, "search" | "enabled"> = {},
  ): Promise<ContentList<AdminCategory>> {
    const where = buildCategoryWhere(filters);
    const [records, total] = await this.database.$transaction(
      async (transaction) =>
        Promise.all([
          listAdminCategories(transaction, pagination, filters),
          transaction.category.count({ where }),
        ]),
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    return {
      items: records.map(mapAdminCategory),
      pagination: buildPaginationMeta({ ...pagination, total }),
    };
  }

  async createCategory(data: CreateCategoryBodyDto): Promise<AdminCategory> {
    try {
      const created = await this.database.category.create({
        data: {
          ...(data.id === undefined ? {} : { id: data.id }),
          displayName: data.displayName,
          slug: data.slug,
        },
        select: { id: true },
      });
      const record = await findAdminCategory(this.database, created.id);
      if (record === null) throw new NotFoundException();
      const category = mapAdminCategory(record);
      return category;
    } catch (error: unknown) {
      return rethrowWriteConflict(error);
    }
  }

  async getCategory(categoryId: string): Promise<AdminCategory> {
    const record = await findAdminCategory(this.database, categoryId);
    if (record === null) throw new NotFoundException();
    return mapAdminCategory(record);
  }

  async updateCategory(
    categoryId: string,
    data: UpdateCategoryBodyDto,
  ): Promise<AdminCategory> {
    try {
      const updatedCategory = await this.database.$transaction(
        async (transaction) => {
          await lockCategoryEligibilityState(transaction);
          await transaction.$queryRaw`
            SELECT "id"
            FROM "categories"
            WHERE "id" = ${categoryId}::uuid
            FOR UPDATE
          `;
          const current = await findAdminCategory(transaction, categoryId);
          if (current === null) throw new NotFoundException();
          assertImmutableValue("Category slug", current.slug, data.slug);

          const displayName = data.displayName ?? current.displayName;
          const enabled = data.enabled ?? current.enabled;
          if (
            displayName === current.displayName &&
            enabled === current.enabled
          ) {
            return mapAdminCategory(current);
          }
          if (current.version !== data.expectedVersion) {
            throw new ContentStaleWriteException();
          }
          if (current.enabled && !enabled) {
            await this.assertDisablementSafe(transaction, categoryId);
          }

          const updated = await transaction.category.updateMany({
            where: { id: categoryId, version: data.expectedVersion },
            data: {
              displayName,
              enabled,
              version: { increment: 1 },
            },
          });
          if (updated.count !== 1) throw new ContentStaleWriteException();
          const fresh = await findAdminCategory(transaction, categoryId);
          if (fresh === null) throw new NotFoundException();
          return mapAdminCategory(fresh);
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return updatedCategory;
    } catch (error: unknown) {
      return rethrowWriteConflict(error);
    }
  }

  async moveCategory(
    categoryId: string,
    data: CategoryPositionBodyDto,
  ): Promise<AdminCategoryMove> {
    try {
      const moved = await this.database.$transaction(
        async (transaction) => {
          // The migration's append/move triggers use this same transaction lock.
          await lockCategoryOrder(transaction);
          await transaction.$queryRaw`
            SELECT "id"
            FROM "categories"
            WHERE "id" = ${categoryId}::uuid
            FOR UPDATE
          `;
          const current = await findAdminCategory(transaction, categoryId);
          if (current === null) throw new NotFoundException();
          const categoryCount = await transaction.category.count();

          if (data.targetPosition === current.displayPosition) {
            const unchangedMove: AdminCategoryMove = {
              category: mapAdminCategory(current),
              displacedCategory: null,
            };
            return unchangedMove;
          }
          if (
            current.displayPosition === categoryCount &&
            data.targetPosition === current.displayPosition + 1
          ) {
            const boundaryMove: AdminCategoryMove = {
              category: mapAdminCategory(current),
              displacedCategory: null,
            };
            return boundaryMove;
          }
          if (Math.abs(data.targetPosition - current.displayPosition) !== 1) {
            throw new ContentInvalidCategoryPositionException();
          }

          const adjacent = await transaction.category.findUnique({
            where: { displayPosition: data.targetPosition },
            select: CATEGORY_SELECT,
          });
          if (adjacent === null)
            throw new ContentInvalidCategoryPositionException();
          if (current.version !== data.expectedVersion) {
            throw new ContentStaleWriteException();
          }

          await transaction.$executeRaw`
            SET CONSTRAINTS "categories_display_position_key" DEFERRED
          `;
          const movedCount = await transaction.category.updateMany({
            where: { id: categoryId, version: data.expectedVersion },
            data: {
              displayPosition: data.targetPosition,
              version: { increment: 1 },
            },
          });
          if (movedCount.count !== 1) throw new ContentStaleWriteException();
          const displacedCount = await transaction.category.updateMany({
            where: { id: adjacent.id, version: adjacent.version },
            data: {
              displayPosition: current.displayPosition,
              version: { increment: 1 },
            },
          });
          if (displacedCount.count !== 1)
            throw new ContentStaleWriteException();

          const [updatedCategory, updatedDisplaced] = await Promise.all([
            findAdminCategory(transaction, categoryId),
            findAdminCategory(transaction, adjacent.id),
          ]);
          if (updatedCategory === null || updatedDisplaced === null) {
            throw new NotFoundException();
          }
          const result: AdminCategoryMove = {
            category: mapAdminCategory(updatedCategory),
            displacedCategory: mapAdminCategory(updatedDisplaced),
          };
          return result;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return moved;
    } catch (error: unknown) {
      return rethrowWriteConflict(error);
    }
  }

  // Helper methods
  private async assertDisablementSafe(
    transaction: Prisma.TransactionClient,
    categoryId: string,
  ): Promise<void> {
    const associatedWorks = await transaction.$queryRaw<Array<{ id: string }>>`
      SELECT "work"."id"::text AS "id"
      FROM "works" AS "work"
      INNER JOIN "work_categories" AS "membership"
        ON "membership"."work_id" = "work"."id"
      WHERE "work"."publication_status" = 'published'
        AND "membership"."category_id" = ${categoryId}::uuid
      ORDER BY "work"."id"
      FOR UPDATE OF "work"
    `;
    if (associatedWorks.length === 0) return;

    const records = await transaction.work.findMany({
      where: {
        id: { in: associatedWorks.map(({ id }) => id) },
        publicationStatus: PublicationStatus.PUBLISHED,
      },
      select: {
        id: true,
        categories: {
          select: { category: { select: { id: true, enabled: true } } },
        },
      },
      orderBy: { id: "asc" },
    });
    const leavesPublishedWorkWithoutEnabledCategory = records.some((work) =>
      work.categories.every(
        ({ category }) => category.id === categoryId || !category.enabled,
      ),
    );
    if (leavesPublishedWorkWithoutEnabledCategory) {
      throw new ContentCategoryInUseException();
    }
  }
}

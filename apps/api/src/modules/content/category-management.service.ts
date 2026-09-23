import type { AdminCategory } from "@fury/contracts";
import type { DatabaseClient } from "@fury/database";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import type { PaginationQuery } from "../../core/pagination/pagination.js";
import { buildPaginationMeta } from "../../core/pagination/pagination.js";
import { rethrowWriteConflict } from "./content-write-conflict.js";
import { ContentStaleWriteException } from "./content.errors.js";
import { CATEGORY_SELECT, mapAdminCategory } from "./content.mapper.js";
import { findAdminCategory, listAdminCategories } from "./content.queries.js";
import { assertImmutableValue } from "./content.rules.js";
import type { ContentList } from "./content.types.js";
import type {
  CreateCategoryBodyDto,
  UpdateCategoryBodyDto,
} from "./dto/content.dto.js";

export class CategoryManagementService {
  constructor(private readonly database: DatabaseClient) {}

  async listCategories(
    pagination: PaginationQuery,
  ): Promise<ContentList<AdminCategory>> {
    const [records, total] = await this.database.$transaction(
      async (transaction) =>
        Promise.all([
          listAdminCategories(transaction, pagination),
          transaction.category.count(),
        ]),
    );
    return {
      items: records.map(mapAdminCategory),
      pagination: buildPaginationMeta({ ...pagination, total }),
    };
  }

  async createCategory(data: CreateCategoryBodyDto): Promise<AdminCategory> {
    try {
      const record = await this.database.category.create({
        data,
        select: CATEGORY_SELECT,
      });
      return mapAdminCategory(record);
    } catch (error: unknown) {
      const writeConflict = rethrowWriteConflict(error);
      return writeConflict;
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
    const current = await findAdminCategory(this.database, categoryId);
    if (current === null) throw new NotFoundException();
    assertImmutableValue("Category slug", current.slug, data.slug);
    if (
      data.displayName === undefined ||
      data.displayName === current.displayName
    ) {
      return mapAdminCategory(current);
    }
    if (current.version !== data.expectedVersion) {
      throw new ContentStaleWriteException();
    }
    const updated = await this.database.category.updateMany({
      where: { id: categoryId, version: data.expectedVersion },
      data: { displayName: data.displayName, version: { increment: 1 } },
    });
    if (updated.count !== 1) throw new ContentStaleWriteException();
    const updatedCategory = await this.getCategory(categoryId);
    return updatedCategory;
  }
}

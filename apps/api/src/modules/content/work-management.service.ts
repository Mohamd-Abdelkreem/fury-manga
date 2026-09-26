import type { AdminWork } from "@fury/contracts";
import {
  MediaAssetStatus,
  Prisma,
  PublicationStatus,
  type DatabaseClient,
} from "@fury/database";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import type { PaginationQuery } from "../../core/pagination/pagination.js";
import { buildPaginationMeta } from "../../core/pagination/pagination.js";
import {
  isTransactionConflict,
  rethrowWriteConflict,
} from "./content-write-conflict.js";
import {
  ContentConflictException,
  ContentStaleWriteException,
} from "./content.errors.js";
import { mapAdminWork } from "./content.mapper.js";
import {
  findAdminWork,
  listAdminWorks,
  lockCategoryEligibilityState,
} from "./content.queries.js";
import {
  assertImmutableValue,
  normalizeWorkTags,
  toDatabaseStoryStatus,
  toDatabaseWorkType,
} from "./content.rules.js";
import type { ContentList } from "./content.types.js";
import type { MediaService } from "../media/media.service.js";
import type { WorkMediaSelection } from "../media/media.types.js";
import type {
  CreateWorkBodyDto,
  ReplaceWorkCategoriesBodyDto,
  UpdateWorkBodyDto,
} from "./dto/content.dto.js";

export class WorkManagementService {
  constructor(
    private readonly database: DatabaseClient,
    private readonly mediaReferences?: Pick<MediaService, "saveWorkReferences">,
  ) {}

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

  async createWork(
    data: CreateWorkBodyDto,
    actorUserId?: string,
  ): Promise<AdminWork> {
    const categoryIds = data.categoryIds ?? [];
    this.assertDistinctCategoryIds(categoryIds);
    const tags = normalizeWorkTags(data.tags ?? []);
    try {
      const created = await this.database.$transaction(
        async (transaction) => {
          const categories =
            categoryIds.length === 0
              ? []
              : await this.findAssignableCategories(
                  transaction,
                  categoryIds,
                  [],
                );
          const work = await transaction.work.create({
            data: {
              ...(data.id === undefined ? {} : { id: data.id }),
              title: data.title,
              slug: data.slug,
              type: toDatabaseWorkType(data.type),
              storyStatus: toDatabaseStoryStatus(data.storyStatus),
              alternativeTitle: data.alternativeTitle ?? null,
              synopsis: data.synopsis ?? null,
              author: data.author ?? null,
              artist: data.artist ?? null,
              featuredHome: data.featuredHome ?? false,
              featuredOrder: data.featuredOrder ?? null,
            },
            select: { id: true },
          });
          if (tags.length > 0) {
            await transaction.workTag.createMany({
              data: tags.map((normalizedTag, index) => ({
                workId: work.id,
                normalizedTag,
                position: index + 1,
              })),
            });
          }
          if (categories.length > 0) {
            await transaction.workCategory.createMany({
              data: categories.map(({ id: categoryId }) => ({
                workId: work.id,
                categoryId,
              })),
            });
          }
          const mediaSelection = this.toMediaSelection(data);
          if (
            mediaSelection.coverAssetId != null ||
            mediaSelection.backgroundAssetId != null
          ) {
            await this.saveMediaReferences(
              transaction,
              actorUserId,
              work.id,
              mediaSelection,
            );
          }
          const record = await findAdminWork(transaction, work.id);
          if (record === null) throw new NotFoundException();
          return record;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return mapAdminWork(created);
    } catch (error: unknown) {
      return rethrowWriteConflict(error);
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
    actorUserId?: string,
  ): Promise<AdminWork> {
    this.assertDistinctCategoryIds(data.categoryIds ?? []);
    try {
      const updatedRecord = await this.database.$transaction(
        async (transaction) => {
          await lockCategoryEligibilityState(transaction);
          await transaction.$queryRaw`
            SELECT "id" FROM "works" WHERE "id" = ${workId}::uuid FOR UPDATE
          `;
          const current = await findAdminWork(transaction, workId);
          if (current === null) throw new NotFoundException();
          const mapped = mapAdminWork(current);
          assertImmutableValue("Work slug", mapped.slug, data.slug);
          assertImmutableValue("Work type", mapped.type, data.type);
          if (current.version !== data.expectedVersion) {
            throw new ContentStaleWriteException();
          }

          const title = data.title ?? current.title;
          const storyStatus = data.storyStatus ?? mapped.storyStatus;
          const alternativeTitle =
            data.alternativeTitle === undefined
              ? current.alternativeTitle
              : data.alternativeTitle;
          const synopsis =
            data.synopsis === undefined ? current.synopsis : data.synopsis;
          const author =
            data.author === undefined ? current.author : data.author;
          const artist =
            data.artist === undefined ? current.artist : data.artist;
          const featuredHome = data.featuredHome ?? current.featuredHome;
          const featuredOrder =
            data.featuredOrder === undefined
              ? current.featuredOrder
              : data.featuredOrder;
          const currentCategoryIds = current.categories
            .map(({ category }) => category.id)
            .toSorted();
          const requestedCategoryIds =
            data.categoryIds === undefined
              ? currentCategoryIds
              : data.categoryIds.toSorted();
          const currentTags = current.tags.map(
            ({ normalizedTag }) => normalizedTag,
          );
          const tags =
            data.tags === undefined
              ? currentTags
              : normalizeWorkTags(data.tags);
          const tagsChanged = !this.haveSameValues(tags, currentTags);
          const categoriesChanged = !this.haveSameValues(
            requestedCategoryIds,
            currentCategoryIds,
          );
          const mediaSelection = this.toMediaSelection(data);
          const coverChanged =
            mediaSelection.coverAssetId !== undefined &&
            mediaSelection.coverAssetId !== mapped.coverAssetId;
          const backgroundChanged =
            mediaSelection.backgroundAssetId !== undefined &&
            mediaSelection.backgroundAssetId !== mapped.backgroundAssetId;
          const metadataChanged =
            title !== current.title ||
            storyStatus !== mapped.storyStatus ||
            alternativeTitle !== current.alternativeTitle ||
            synopsis !== current.synopsis ||
            author !== current.author ||
            artist !== current.artist ||
            featuredHome !== current.featuredHome ||
            featuredOrder !== current.featuredOrder;
          if (
            !metadataChanged &&
            !categoriesChanged &&
            !tagsChanged &&
            !coverChanged &&
            !backgroundChanged
          ) {
            return current;
          }

          if (data.categoryIds !== undefined && categoriesChanged) {
            await this.findAssignableCategories(
              transaction,
              requestedCategoryIds,
              currentCategoryIds,
            );
          }

          const claimed = await transaction.work.updateMany({
            where: { id: workId, version: data.expectedVersion },
            data: {
              title,
              storyStatus: toDatabaseStoryStatus(storyStatus),
              alternativeTitle,
              synopsis,
              author,
              artist,
              featuredHome,
              featuredOrder,
              version: { increment: 1 },
            },
          });
          if (claimed.count !== 1) throw new ContentStaleWriteException();

          if (tagsChanged) {
            await transaction.workTag.deleteMany({ where: { workId } });
            if (tags.length > 0) {
              await transaction.workTag.createMany({
                data: tags.map((normalizedTag, index) => ({
                  workId,
                  normalizedTag,
                  position: index + 1,
                })),
              });
            }
          }
          if (categoriesChanged) {
            await transaction.workCategory.deleteMany({
              where: {
                workId,
                ...(requestedCategoryIds.length === 0
                  ? {}
                  : { categoryId: { notIn: requestedCategoryIds } }),
              },
            });
            const existingIds = new Set(currentCategoryIds);
            const newIds = requestedCategoryIds.filter(
              (categoryId) => !existingIds.has(categoryId),
            );
            if (newIds.length > 0) {
              await transaction.workCategory.createMany({
                data: newIds.map((categoryId) => ({ workId, categoryId })),
              });
            }
          }
          if (coverChanged || backgroundChanged) {
            await this.saveMediaReferences(
              transaction,
              actorUserId,
              workId,
              mediaSelection,
            );
          }
          const record = await findAdminWork(transaction, workId);
          if (record === null) throw new NotFoundException();
          if (current.publicationStatus === PublicationStatus.PUBLISHED) {
            const coverId = record.mediaReferences.find(
              ({ slot }) => slot === "WORK_COVER",
            )?.assetId;
            const availableCover =
              coverId === undefined
                ? null
                : await transaction.mediaAsset.findFirst({
                    where: { id: coverId, status: MediaAssetStatus.AVAILABLE },
                    select: { id: true },
                  });
            if (
              record.synopsis === null ||
              record.synopsis.trim().length < 20 ||
              record.author === null ||
              record.author.trim().length === 0 ||
              !record.categories.some(({ category }) => category.enabled) ||
              availableCover === null
            ) {
              throw new ContentConflictException(
                "A published Work must retain its required metadata, enabled Category, and available cover.",
              );
            }
          }
          return record;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return mapAdminWork(updatedRecord);
    } catch (error: unknown) {
      if (
        error instanceof ContentStaleWriteException ||
        isTransactionConflict(error)
      ) {
        throw new ContentStaleWriteException();
      }
      return rethrowWriteConflict(error);
    }
  }

  async replaceWorkCategories(
    workId: string,
    data: ReplaceWorkCategoriesBodyDto,
  ): Promise<AdminWork> {
    const requestedIds = data.categoryIds.toSorted();
    try {
      const replacedWork = await this.database.$transaction(
        async (transaction) => {
          await lockCategoryEligibilityState(transaction);
          const work = await findAdminWork(transaction, workId);
          if (work === null) throw new NotFoundException();
          const categories = await transaction.category.findMany({
            where: { id: { in: data.categoryIds } },
            select: { id: true, enabled: true },
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
          if (
            work.publicationStatus === PublicationStatus.PUBLISHED &&
            !categories.some(({ enabled }) => enabled)
          ) {
            throw new ContentConflictException(
              "A published Work must retain at least one enabled Category.",
            );
          }
          const newlyDisabledCategory = categories.some(
            (category) =>
              !category.enabled && !currentIds.includes(category.id),
          );
          if (newlyDisabledCategory) {
            throw new ContentConflictException(
              "A disabled Category cannot be newly assigned.",
            );
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

  private assertDistinctCategoryIds(categoryIds: readonly string[]): void {
    if (
      categoryIds.length > 100 ||
      new Set(categoryIds.map((categoryId) => categoryId.toLowerCase()))
        .size !== categoryIds.length
    ) {
      throw new ContentConflictException("Work categories are invalid.");
    }
  }

  private async findAssignableCategories(
    transaction: Prisma.TransactionClient,
    categoryIds: readonly string[],
    currentCategoryIds: readonly string[],
  ): Promise<{ id: string; enabled: boolean }[]> {
    this.assertDistinctCategoryIds(categoryIds);
    await lockCategoryEligibilityState(transaction);
    const categories = await transaction.category.findMany({
      where: { id: { in: [...categoryIds] } },
      select: { id: true, enabled: true },
    });
    if (categories.length !== categoryIds.length) {
      throw new NotFoundException("One or more Categories were not found.");
    }
    if (
      categories.some(
        (category) =>
          !category.enabled && !currentCategoryIds.includes(category.id),
      )
    ) {
      throw new ContentConflictException(
        "A disabled Category cannot be newly assigned.",
      );
    }
    return categories;
  }

  private toMediaSelection(
    data:
      | Pick<CreateWorkBodyDto, "coverAssetId" | "backgroundAssetId">
      | Pick<UpdateWorkBodyDto, "coverAssetId" | "backgroundAssetId">,
  ): WorkMediaSelection {
    return {
      ...(data.coverAssetId === undefined
        ? {}
        : { coverAssetId: data.coverAssetId }),
      ...(data.backgroundAssetId === undefined
        ? {}
        : { backgroundAssetId: data.backgroundAssetId }),
    };
  }

  private async saveMediaReferences(
    transaction: Prisma.TransactionClient,
    actorUserId: string | undefined,
    workId: string,
    selection: WorkMediaSelection,
  ): Promise<void> {
    if (actorUserId === undefined || this.mediaReferences === undefined) {
      throw new Error("Work media updates require the composed P02 service.");
    }
    await this.mediaReferences.saveWorkReferences(
      transaction,
      actorUserId,
      workId,
      selection,
    );
  }

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

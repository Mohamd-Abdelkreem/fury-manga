import type { PaginationQuery } from "../../core/pagination/pagination.js";
import type { Prisma } from "@fury/database";
import { MediaAssetStatus, PublicationStatus } from "@fury/database";

import {
  CATEGORY_SELECT,
  CHAPTER_SELECT,
  PUBLIC_CHAPTER_SELECT,
  PUBLIC_WORK_SELECT,
  WORK_SELECT,
  type CategoryRecord,
  type ChapterRecord,
  type PublicChapterRecord,
  type PublicWorkRecord,
  type WorkRecord,
} from "./content.mapper.js";
import type { WorkReadinessInput } from "./content.rules.js";

export type ContentReadClient = Pick<
  Prisma.TransactionClient,
  "category" | "chapter" | "work"
>;

export type CategoryListFilters = Readonly<{
  search?: string | undefined;
  enabled?: boolean | undefined;
}>;

export const buildCategoryWhere = (
  filters: CategoryListFilters,
): Prisma.CategoryWhereInput => ({
  ...(filters.enabled === undefined ? {} : { enabled: filters.enabled }),
  ...(filters.search === undefined || filters.search.length === 0
    ? {}
    : {
        OR: [
          { displayName: { contains: filters.search, mode: "insensitive" } },
          { slug: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
});

export const lockCategoryEligibilityState = async (
  transaction: Prisma.TransactionClient,
): Promise<void> => {
  await transaction.$queryRaw`
    SELECT pg_advisory_xact_lock(5380033990110::BIGINT) IS NULL AS "locked"
  `;
};

export const lockCategoryOrder = async (
  transaction: Prisma.TransactionClient,
): Promise<void> => {
  await transaction.$queryRaw`
    SELECT pg_advisory_xact_lock(5380033990109::BIGINT) IS NULL AS "locked"
  `;
};

export const findAdminCategory = (
  database: ContentReadClient,
  categoryId: string,
): Promise<CategoryRecord | null> =>
  database.category.findUnique({
    where: { id: categoryId },
    select: CATEGORY_SELECT,
  });

export const findAdminWork = (
  database: ContentReadClient,
  workId: string,
): Promise<WorkRecord | null> =>
  database.work.findUnique({
    where: { id: workId },
    select: WORK_SELECT,
  });

export const readWorkReadiness = async (
  transaction: Prisma.TransactionClient,
  record: WorkRecord,
): Promise<WorkReadinessInput> => {
  const coverAssetId = record.mediaReferences.find(
    ({ slot }) => slot === "WORK_COVER",
  )?.assetId;
  const availableCover =
    coverAssetId === undefined
      ? null
      : await transaction.mediaAsset.findFirst({
          where: {
            id: coverAssetId,
            status: MediaAssetStatus.AVAILABLE,
            mediaClass: "WORK_COVER",
            scope: "ADMIN",
          },
          select: { id: true },
        });
  return {
    title: record.title,
    synopsis: record.synopsis,
    author: record.author,
    enabledCategoryCount: record.categories.filter(
      ({ category }) => category.enabled,
    ).length,
    hasAvailableCover: availableCover !== null,
  };
};

export const findPublishedFeaturedWork = (
  transaction: Prisma.TransactionClient,
  featuredOrder: number,
  excludingWorkId?: string,
): Promise<{ id: string } | null> =>
  transaction.work.findFirst({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      featuredHome: true,
      featuredOrder,
      ...(excludingWorkId === undefined
        ? {}
        : { id: { not: excludingWorkId } }),
    },
    select: { id: true },
  });

export const findAdminChapter = (
  database: ContentReadClient,
  workId: string,
  chapterId: string,
): Promise<ChapterRecord | null> =>
  database.chapter.findFirst({
    where: { id: chapterId, workId },
    select: CHAPTER_SELECT,
  });

export const listAdminCategories = (
  database: ContentReadClient,
  pagination: PaginationQuery,
  filters: CategoryListFilters = {},
): Promise<CategoryRecord[]> =>
  database.category.findMany({
    where: buildCategoryWhere(filters),
    orderBy: [{ displayPosition: "asc" }, { id: "asc" }],
    skip: pagination.skip,
    take: pagination.take,
    select: CATEGORY_SELECT,
  });

export const listAdminWorks = (
  database: ContentReadClient,
  pagination: PaginationQuery,
): Promise<WorkRecord[]> =>
  database.work.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    skip: pagination.skip,
    take: pagination.take,
    select: WORK_SELECT,
  });

export const listAdminChapters = (
  database: ContentReadClient,
  workId: string,
  pagination: PaginationQuery,
): Promise<ChapterRecord[]> =>
  database.chapter.findMany({
    where: { workId },
    orderBy: [{ number: "asc" }, { id: "asc" }],
    skip: pagination.skip,
    take: pagination.take,
    select: CHAPTER_SELECT,
  });

export const PUBLIC_READY_WORK_WHERE = {
  publicationStatus: PublicationStatus.PUBLISHED,
  synopsis: { not: null },
  author: { not: null },
  categories: { some: { category: { enabled: true } } },
  mediaReferences: {
    some: {
      slot: "WORK_COVER",
      retiredAt: null,
      asset: {
        mediaClass: "WORK_COVER",
        scope: "ADMIN",
        status: MediaAssetStatus.AVAILABLE,
      },
    },
  },
} satisfies Prisma.WorkWhereInput;

export const listPublicWorks = (
  database: ContentReadClient,
  pagination: PaginationQuery,
): Promise<PublicWorkRecord[]> =>
  database.work.findMany({
    where: PUBLIC_READY_WORK_WHERE,
    orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
    skip: pagination.skip,
    take: pagination.take,
    select: PUBLIC_WORK_SELECT,
  });

export const findPublicWork = (
  database: ContentReadClient,
  slug: string,
): Promise<PublicWorkRecord | null> =>
  database.work.findFirst({
    where: { AND: [PUBLIC_READY_WORK_WHERE, { slug }] },
    select: PUBLIC_WORK_SELECT,
  });

export const listPublicChapters = (
  database: ContentReadClient,
  workId: string,
  pagination: PaginationQuery,
): Promise<PublicChapterRecord[]> =>
  database.chapter.findMany({
    where: {
      workId,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    orderBy: [{ number: "asc" }, { id: "asc" }],
    skip: pagination.skip,
    take: pagination.take,
    select: PUBLIC_CHAPTER_SELECT,
  });

export const findPublicChapter = (
  database: ContentReadClient,
  workId: string,
  number: number,
): Promise<PublicChapterRecord | null> =>
  database.chapter.findFirst({
    where: {
      workId,
      number,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    select: PUBLIC_CHAPTER_SELECT,
  });

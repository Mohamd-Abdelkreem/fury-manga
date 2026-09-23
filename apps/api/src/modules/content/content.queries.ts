import type { PaginationQuery } from "../../core/pagination/pagination.js";
import type { Prisma } from "@fury/database";
import { PublicationStatus } from "@fury/database";

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

export type ContentReadClient = Pick<
  Prisma.TransactionClient,
  "category" | "chapter" | "work"
>;

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
): Promise<CategoryRecord[]> =>
  database.category.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
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

export const listPublicWorks = (
  database: ContentReadClient,
  pagination: PaginationQuery,
): Promise<PublicWorkRecord[]> =>
  database.work.findMany({
    where: { publicationStatus: PublicationStatus.PUBLISHED },
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
    where: { slug, publicationStatus: PublicationStatus.PUBLISHED },
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

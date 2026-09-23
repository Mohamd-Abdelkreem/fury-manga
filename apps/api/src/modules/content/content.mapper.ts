import type {
  AdminCategory,
  AdminChapter,
  AdminWork,
  ChapterContentType as ContractChapterContentType,
  PublicationStatus as ContractPublicationStatus,
  PublicCategory,
  PublicChapter,
  PublicWork,
  StoryStatus as ContractStoryStatus,
  WorkType as ContractWorkType,
} from "@fury/contracts";
import { structuredTextDocumentSchema } from "@fury/contracts";
import {
  ChapterContentType,
  PublicationStatus,
  StoryStatus,
  WorkType,
} from "@fury/database";
import type { Prisma } from "@fury/database";

export const CATEGORY_SELECT = {
  id: true,
  displayName: true,
  slug: true,
  version: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.CategorySelect;

export const WORK_SELECT = {
  id: true,
  title: true,
  slug: true,
  type: true,
  storyStatus: true,
  publicationStatus: true,
  publishedAt: true,
  currentPublicationEventId: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  categories: {
    select: { category: { select: CATEGORY_SELECT } },
  },
} as const satisfies Prisma.WorkSelect;

export const PUBLIC_CATEGORY_SELECT = {
  id: true,
  displayName: true,
  slug: true,
} as const satisfies Prisma.CategorySelect;

export const PUBLIC_WORK_SELECT = {
  id: true,
  title: true,
  slug: true,
  type: true,
  storyStatus: true,
  publishedAt: true,
  categories: {
    select: { category: { select: PUBLIC_CATEGORY_SELECT } },
  },
} as const satisfies Prisma.WorkSelect;

export const CHAPTER_SELECT = {
  id: true,
  workId: true,
  number: true,
  contentType: true,
  publicationStatus: true,
  publishedAt: true,
  currentPublicationEventId: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  textContent: true,
  pages: { select: { id: true, position: true } },
} as const satisfies Prisma.ChapterSelect;

export const PUBLIC_CHAPTER_SELECT = {
  id: true,
  workId: true,
  number: true,
  contentType: true,
  publishedAt: true,
} as const satisfies Prisma.ChapterSelect;

export type CategoryRecord = Prisma.CategoryGetPayload<{
  select: typeof CATEGORY_SELECT;
}>;
export type WorkRecord = Prisma.WorkGetPayload<{
  select: typeof WORK_SELECT;
}>;
export type PublicCategoryRecord = Prisma.CategoryGetPayload<{
  select: typeof PUBLIC_CATEGORY_SELECT;
}>;
export type PublicWorkRecord = Prisma.WorkGetPayload<{
  select: typeof PUBLIC_WORK_SELECT;
}>;
export type ChapterRecord = Prisma.ChapterGetPayload<{
  select: typeof CHAPTER_SELECT;
}>;
export type PublicChapterRecord = Prisma.ChapterGetPayload<{
  select: typeof PUBLIC_CHAPTER_SELECT;
}>;

const workTypeMap = {
  [WorkType.MANGA]: "manga",
  [WorkType.MANHWA]: "manhwa",
  [WorkType.MANHUA]: "manhua",
  [WorkType.COMICS]: "comics",
  [WorkType.NOVEL]: "novel",
  [WorkType.TEXT_STORY]: "text-story",
} as const satisfies Record<WorkType, ContractWorkType>;

const storyStatusMap = {
  [StoryStatus.ONGOING]: "ongoing",
  [StoryStatus.COMPLETED]: "completed",
  [StoryStatus.HIATUS]: "hiatus",
  [StoryStatus.CANCELLED]: "cancelled",
} as const satisfies Record<StoryStatus, ContractStoryStatus>;

const publicationStatusMap = {
  [PublicationStatus.DRAFT]: "draft",
  [PublicationStatus.PUBLISHED]: "published",
  [PublicationStatus.ARCHIVED]: "archived",
} as const satisfies Record<PublicationStatus, ContractPublicationStatus>;

const chapterContentTypeMap = {
  [ChapterContentType.ILLUSTRATED]: "illustrated",
  [ChapterContentType.TEXT]: "text",
} as const satisfies Record<ChapterContentType, ContractChapterContentType>;

export const mapAdminCategory = (record: CategoryRecord): AdminCategory => ({
  id: record.id,
  displayName: record.displayName,
  slug: record.slug,
  version: record.version,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

export const mapPublicCategory = (
  record: PublicCategoryRecord,
): PublicCategory => ({
  id: record.id,
  displayName: record.displayName,
  slug: record.slug,
});

const orderedCategories = <
  T extends { id: string; displayName: string },
>(record: {
  categories: { category: T }[];
}): T[] =>
  record.categories
    .map(({ category }) => category)
    .toSorted(
      (left, right) =>
        left.displayName.localeCompare(right.displayName) ||
        left.id.localeCompare(right.id),
    );

export const mapAdminWork = (record: WorkRecord): AdminWork => ({
  id: record.id,
  title: record.title,
  slug: record.slug,
  type: workTypeMap[record.type],
  storyStatus: storyStatusMap[record.storyStatus],
  publicationStatus: publicationStatusMap[record.publicationStatus],
  publishedAt: record.publishedAt?.toISOString() ?? null,
  version: record.version,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  categories: orderedCategories(record).map(mapAdminCategory),
});

export const mapPublicWork = (record: PublicWorkRecord): PublicWork => {
  if (record.publishedAt === null) {
    throw new Error("Published Work projection requires publishedAt.");
  }
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    type: workTypeMap[record.type],
    storyStatus: storyStatusMap[record.storyStatus],
    publishedAt: record.publishedAt.toISOString(),
    categories: orderedCategories(record).map(mapPublicCategory),
  };
};

export const mapAdminChapter = (record: ChapterRecord): AdminChapter => ({
  id: record.id,
  workId: record.workId,
  number: record.number,
  contentType: chapterContentTypeMap[record.contentType],
  publicationStatus: publicationStatusMap[record.publicationStatus],
  publishedAt: record.publishedAt?.toISOString() ?? null,
  version: record.version,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  textContent:
    record.textContent === null
      ? null
      : structuredTextDocumentSchema.parse(record.textContent),
  pages: record.pages
    .map(({ id, position }) => ({ id, position }))
    .toSorted(
      (left, right) =>
        left.position - right.position || left.id.localeCompare(right.id),
    ),
});

export const mapPublicChapter = (
  record: PublicChapterRecord,
): PublicChapter => {
  if (record.publishedAt === null) {
    throw new Error("Published Chapter projection requires publishedAt.");
  }
  return {
    id: record.id,
    workId: record.workId,
    number: record.number,
    contentType: chapterContentTypeMap[record.contentType],
    publishedAt: record.publishedAt.toISOString(),
  };
};

export const mapPublicationStatus = (
  value: PublicationStatus,
): ContractPublicationStatus => publicationStatusMap[value];

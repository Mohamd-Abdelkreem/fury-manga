import { describe, expect, it } from "vitest";

import { adminCategorySchema, adminWorkSchema } from "@fury/contracts";
import {
  ChapterContentType,
  MediaAssetStatus,
  MediaReferenceSlot,
  PublicationStatus,
  StoryStatus,
  WorkType,
} from "@fury/database";

import {
  CATEGORY_SELECT,
  PUBLIC_CHAPTER_SELECT,
  PUBLIC_WORK_SELECT,
  WORK_SELECT,
  mapAdminCategory,
  mapAdminChapter,
  mapAdminWork,
  mapPublicChapter,
  mapPublicWork,
  type CategoryRecord,
  type ChapterRecord,
  type WorkRecord,
} from "./content.mapper.js";

const now = new Date("2026-09-22T00:00:00.000Z");

const category: CategoryRecord = {
  id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  displayName: "Action",
  slug: "action",
  enabled: false,
  displayPosition: 3,
  version: 2,
  createdAt: now,
  updatedAt: now,
  _count: { works: 4 },
};

const work: WorkRecord = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Work",
  slug: "work",
  type: WorkType.MANGA,
  storyStatus: StoryStatus.ONGOING,
  publicationStatus: PublicationStatus.PUBLISHED,
  publishedAt: now,
  currentPublicationEventId: "22222222-2222-4222-8222-222222222222",
  alternativeTitle: null,
  synopsis: null,
  author: null,
  artist: null,
  featuredHome: false,
  featuredOrder: null,
  version: 1,
  createdAt: now,
  updatedAt: now,
  categories: [],
  tags: [],
  mediaReferences: [],
};

const chapter: ChapterRecord = {
  id: "33333333-3333-4333-8333-333333333333",
  workId: work.id,
  number: 1,
  title: "Chapter",
  contentType: ChapterContentType.ILLUSTRATED,
  publicationStatus: PublicationStatus.PUBLISHED,
  publishedAt: now,
  currentPublicationEventId: "44444444-4444-4444-8444-444444444444",
  version: 1,
  createdAt: now,
  updatedAt: now,
  textContent: null,
  pages: [
    {
      id: "55555555-5555-4555-8555-555555555555",
      position: 1,
      mediaReferences: [
        {
          id: "66666666-6666-4666-8666-666666666666",
          version: 0,
          slot: MediaReferenceSlot.CHAPTER_PAGE,
          assetId: "77777777-7777-4777-8777-777777777777",
          asset: {
            status: MediaAssetStatus.AVAILABLE,
            mediaClass: "CHAPTER_PAGE",
            scope: "ADMIN",
          },
        },
      ],
    },
  ],
};

describe("content allowlist mappers", () => {
  it("keeps public persistence selections narrower than admin records", () => {
    expect(PUBLIC_WORK_SELECT).not.toHaveProperty("currentPublicationEventId");
    expect(PUBLIC_WORK_SELECT).not.toHaveProperty("createdAt");
    expect(PUBLIC_WORK_SELECT).not.toHaveProperty("updatedAt");
    expect(PUBLIC_CHAPTER_SELECT).not.toHaveProperty("textContent");
    expect(PUBLIC_CHAPTER_SELECT).not.toHaveProperty("pages");
    expect(PUBLIC_CHAPTER_SELECT).not.toHaveProperty(
      "currentPublicationEventId",
    );
  });

  it("maps exact public keys without state, body, pages, history, or internal IDs", () => {
    expect(Object.keys(mapPublicWork(work)).sort()).toEqual(
      [
        "categories",
        "id",
        "publishedAt",
        "slug",
        "storyStatus",
        "title",
        "type",
      ].sort(),
    );
    expect(Object.keys(mapPublicChapter(chapter)).sort()).toEqual(
      ["contentType", "id", "number", "publishedAt", "title", "workId"].sort(),
    );
  });

  it("maps exact admin keys without current-event or raw relation bookkeeping", () => {
    expect(mapAdminWork(work)).not.toHaveProperty("currentPublicationEventId");
    expect(mapAdminChapter(chapter)).toMatchObject({
      textContent: null,
      pages: [{ position: 1 }],
    });
    expect(mapAdminChapter(chapter)).not.toHaveProperty(
      "currentPublicationEventId",
    );
  });

  it("maps category state, position, and live usage without database metadata", () => {
    expect(CATEGORY_SELECT).toHaveProperty("enabled", true);
    expect(CATEGORY_SELECT).toHaveProperty("displayPosition", true);
    expect(CATEGORY_SELECT).toHaveProperty("_count.select.works", true);
    const mapped = mapAdminCategory(category);
    expect(adminCategorySchema.parse(mapped)).toEqual({
      id: category.id,
      displayName: category.displayName,
      slug: category.slug,
      enabled: false,
      displayPosition: 3,
      worksCount: 4,
      version: 2,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
    expect(mapped).not.toHaveProperty("_count");
    expect(mapped).not.toHaveProperty("works");
  });

  it("selects rich admin editorial fields but keeps public metadata narrow", () => {
    expect(WORK_SELECT).toMatchObject({
      alternativeTitle: true,
      synopsis: true,
      author: true,
      artist: true,
      featuredHome: true,
      featuredOrder: true,
      tags: { orderBy: [{ position: "asc" }, { normalizedTag: "asc" }] },
    });
    expect(WORK_SELECT).toHaveProperty("mediaReferences");
    expect(PUBLIC_WORK_SELECT).not.toHaveProperty("synopsis");
    expect(PUBLIC_WORK_SELECT).not.toHaveProperty("author");
    expect(PUBLIC_WORK_SELECT).not.toHaveProperty("tags");
    expect(PUBLIC_WORK_SELECT).not.toHaveProperty("mediaReferences");

    const mapped = mapAdminWork(work);
    expect(mapped).toMatchObject({
      alternativeTitle: null,
      synopsis: null,
      author: null,
      artist: null,
      featuredHome: false,
      featuredOrder: null,
      coverAssetId: null,
      backgroundAssetId: null,
      tags: [],
    });
    expect(adminWorkSchema.parse(mapped)).toEqual(mapped);
    expect(mapped).not.toHaveProperty("relativeKey");
    expect(mapped).not.toHaveProperty("currentPublicationEventId");
  });

  it("orders disabled retained Work categories by persisted display position", () => {
    const later = {
      ...category,
      id: "77777777-7777-4777-8777-777777777777",
      displayName: "A category",
      displayPosition: 2,
      enabled: false,
    };
    const earlier = {
      ...category,
      id: "88888888-8888-4888-8888-888888888888",
      displayName: "Z category",
      displayPosition: 1,
      enabled: true,
    };
    const mapped = mapAdminWork({
      ...work,
      categories: [{ category: later }, { category: earlier }],
    });
    expect(mapped.categories.map(({ id }) => id)).toEqual([
      earlier.id,
      later.id,
    ]);
    expect(mapped.categories[1]?.enabled).toBe(false);
  });

  it("selects only enabled category associations for public projection", () => {
    expect(PUBLIC_WORK_SELECT.categories).toMatchObject({
      where: { category: { enabled: true } },
    });
  });
});

import { describe, expect, it } from "vitest";

import {
  ChapterContentType,
  PublicationStatus,
  StoryStatus,
  WorkType,
} from "@fury/database";

import {
  PUBLIC_CHAPTER_SELECT,
  PUBLIC_WORK_SELECT,
  mapAdminChapter,
  mapAdminWork,
  mapPublicChapter,
  mapPublicWork,
  type ChapterRecord,
  type WorkRecord,
} from "./content.mapper.js";

const now = new Date("2026-09-22T00:00:00.000Z");

const work: WorkRecord = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Work",
  slug: "work",
  type: WorkType.MANGA,
  storyStatus: StoryStatus.ONGOING,
  publicationStatus: PublicationStatus.PUBLISHED,
  publishedAt: now,
  currentPublicationEventId: "22222222-2222-4222-8222-222222222222",
  version: 1,
  createdAt: now,
  updatedAt: now,
  categories: [],
};

const chapter: ChapterRecord = {
  id: "33333333-3333-4333-8333-333333333333",
  workId: work.id,
  number: 1,
  contentType: ChapterContentType.ILLUSTRATED,
  publicationStatus: PublicationStatus.PUBLISHED,
  publishedAt: now,
  currentPublicationEventId: "44444444-4444-4444-8444-444444444444",
  version: 1,
  createdAt: now,
  updatedAt: now,
  textContent: null,
  pages: [{ id: "55555555-5555-4555-8555-555555555555", position: 1 }],
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
      ["contentType", "id", "number", "publishedAt", "workId"].sort(),
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
});

import { describe, expect, it } from "vitest";

import {
  ChapterContentType,
  PublicationStatus,
  WorkType,
} from "@fury/database";

import {
  ContentImmutableException,
  ContentNotReadyException,
  ContentFeaturedConflictException,
  ContentTypeConflictException,
} from "./content.errors.js";
import {
  assertChapterPageSequence,
  assertImmutableValue,
  assertPositiveChapterNumber,
  assertWorkReady,
  assertFeaturedPositionAvailable,
  assertPublicationTransition,
  assertStructuredTextDocument,
  deriveChapterContentType,
  findWorkReadinessIssues,
  normalizeWorkTags,
} from "./content.rules.js";

describe("content rules", () => {
  it.each([
    [WorkType.MANGA, ChapterContentType.ILLUSTRATED],
    [WorkType.MANHWA, ChapterContentType.ILLUSTRATED],
    [WorkType.MANHUA, ChapterContentType.ILLUSTRATED],
    [WorkType.COMICS, ChapterContentType.ILLUSTRATED],
    [WorkType.NOVEL, ChapterContentType.TEXT],
    [WorkType.TEXT_STORY, ChapterContentType.TEXT],
  ])("derives %s chapters as %s", (workType, expected) => {
    expect(deriveChapterContentType(workType)).toBe(expected);
  });

  it("accepts repeated immutable values and rejects changed values", () => {
    expect(() => {
      assertImmutableValue("Work type", "manga", "manga");
    }).not.toThrow();
    expect(() => {
      assertImmutableValue("Work type", "manga", "novel");
    }).toThrow(ContentImmutableException);
  });

  it("requires positive integer chapter numbers", () => {
    expect(() => {
      assertPositiveChapterNumber(1);
    }).not.toThrow();
    expect(() => {
      assertPositiveChapterNumber(0);
    }).toThrow();
    expect(() => {
      assertPositiveChapterNumber(1.5);
    }).toThrow();
    expect(() => {
      assertPositiveChapterNumber(2_147_483_648);
    }).toThrow();
  });

  it("validates complete chapter representations at the service boundary", () => {
    expect(() => {
      assertStructuredTextDocument({
        version: 1,
        blocks: [{ type: "paragraph", content: [{ text: "valid" }] }],
      });
    }).not.toThrow();
    expect(() => {
      assertStructuredTextDocument({
        version: 1,
        blocks: [{ type: "script", code: "invalid" }],
      });
    }).toThrow();
    expect(() => {
      assertChapterPageSequence([{ position: 2 }, { position: 1 }]);
    }).not.toThrow();
    expect(() => {
      assertChapterPageSequence([]);
    }).toThrow();
    expect(() => {
      assertChapterPageSequence([{ position: 1 }, { position: 1 }]);
    }).toThrow();
  });

  it("enforces the publication transition matrix", () => {
    expect(() => {
      assertPublicationTransition(
        PublicationStatus.PUBLISHED,
        PublicationStatus.PUBLISHED,
      );
    }).not.toThrow();
    expect(() => {
      assertPublicationTransition(
        PublicationStatus.DRAFT,
        PublicationStatus.PUBLISHED,
      );
    }).not.toThrow();
    expect(() => {
      assertPublicationTransition(
        PublicationStatus.ARCHIVED,
        PublicationStatus.PUBLISHED,
      );
    }).toThrow();
  });

  it("permits a ready Work without chapters and rejects only occupied featured placement", () => {
    expect(() => {
      assertWorkReady({
        title: "Work",
        synopsis: "A sufficiently long synopsis.",
        author: "Author",
        enabledCategoryCount: 1,
        hasAvailableCover: true,
      });
      assertFeaturedPositionAvailable(false, 3, true);
      assertFeaturedPositionAvailable(true, null, true);
    }).not.toThrow();
    expect(() => {
      assertFeaturedPositionAvailable(true, 3, true);
    }).toThrow(ContentFeaturedConflictException);
  });

  it("normalizes ordered work tags and rejects duplicates after NFC and trim", () => {
    expect(normalizeWorkTags([" Café ", "Adventure"])).toEqual([
      "Café",
      "Adventure",
    ]);
    expect(() => {
      normalizeWorkTags(["Café", "Cafe\u0301"]);
    }).toThrow(ContentTypeConflictException);
    expect(() => {
      normalizeWorkTags(["Adventure", " Adventure "]);
    }).toThrow(ContentTypeConflictException);
  });

  it("reports only missing publication-readiness inputs", () => {
    expect(
      findWorkReadinessIssues({
        title: "Work",
        synopsis: "s".repeat(20),
        author: "Author",
        enabledCategoryCount: 1,
        hasAvailableCover: true,
      }),
    ).toEqual([]);
    expect(
      findWorkReadinessIssues({
        title: " ",
        synopsis: "too short",
        author: null,
        enabledCategoryCount: 0,
        hasAvailableCover: false,
      }),
    ).toEqual(["title", "synopsis", "author", "categoryIds", "coverAssetId"]);
  });

  it("returns bounded field paths when publication is not ready", () => {
    expect(() => {
      assertWorkReady({
        title: "Ready title",
        synopsis: null,
        author: null,
        enabledCategoryCount: 0,
        hasAvailableCover: false,
      });
    }).toThrow(ContentNotReadyException);
    try {
      assertWorkReady({
        title: "Ready title",
        synopsis: null,
        author: null,
        enabledCategoryCount: 0,
        hasAvailableCover: false,
      });
    } catch (error: unknown) {
      expect(error).toMatchObject({
        code: "CONTENT_NOT_READY",
        statusCode: 409,
        errors: [
          { field: "body.synopsis" },
          { field: "body.author" },
          { field: "body.categoryIds" },
          { field: "body.coverAssetId" },
        ],
      });
    }
  });
});

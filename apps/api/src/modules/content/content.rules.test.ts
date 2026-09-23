import { describe, expect, it } from "vitest";

import {
  ChapterContentType,
  PublicationStatus,
  WorkType,
} from "@fury/database";

import { ContentImmutableException } from "./content.errors.js";
import {
  assertChapterPageSequence,
  assertImmutableValue,
  assertPositiveChapterNumber,
  assertPublicationTransition,
  assertStructuredTextDocument,
  deriveChapterContentType,
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
});

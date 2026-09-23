import { describe, expect, it } from "vitest";

import {
  adminChapterSchema,
  contentErrorCodeSchema,
  contentOperationErrorCodeSchema,
  createCategoryBodySchema,
  createChapterBodySchema,
  createWorkBodySchema,
  publicChapterSchema,
  replaceWorkCategoriesBodySchema,
  structuredTextDocumentSchema,
  updateChapterBodySchema,
  updateWorkBodySchema,
  workTypeSchema,
} from "./content.schema.ts";

const firstId = "11111111-1111-4111-8111-111111111111";
const secondId = "22222222-2222-4222-8222-222222222222";

const validStructuredText = {
  version: 1,
  blocks: [
    { type: "heading", level: 2, text: "عنوان" },
    {
      type: "paragraph",
      content: [
        { text: "نص", bold: true },
        { text: "رابط", italic: true, href: "/works/example" },
      ],
    },
    { type: "list", ordered: false, items: ["الأول", "الثاني"] },
  ],
} as const;

describe("content request contracts", () => {
  it("owns the complete browser-safe P01 conflict-code vocabulary", () => {
    expect(contentErrorCodeSchema.options).toEqual([
      "CONTENT_CONFLICT",
      "CONTENT_IMMUTABLE",
      "CONTENT_TYPE_CONFLICT",
      "CONTENT_TRANSITION_CONFLICT",
      "CONTENT_STALE_WRITE",
    ]);
    expect(contentErrorCodeSchema.safeParse("P2002").success).toBe(false);
    expect(contentOperationErrorCodeSchema.safeParse("NOT_FOUND").success).toBe(
      true,
    );
    expect(
      contentOperationErrorCodeSchema.safeParse("CONTENT_STALE_WRITE").success,
    ).toBe(true);
    expect(contentOperationErrorCodeSchema.safeParse("P2002").success).toBe(
      false,
    );
  });

  it("accepts canonical work values and rejects legacy fixture values", () => {
    expect(workTypeSchema.options).toEqual([
      "manga",
      "manhwa",
      "manhua",
      "comics",
      "novel",
      "text-story",
    ]);
    expect(workTypeSchema.safeParse("comic").success).toBe(false);
    expect(workTypeSchema.safeParse("short-story").success).toBe(false);
  });

  it("normalizes bounded Category and Work values and rejects authority fields", () => {
    expect(
      createCategoryBodySchema.parse({
        displayName: "  أكشن  ",
        slug: "  Action ",
      }),
    ).toEqual({ displayName: "أكشن", slug: "action" });
    expect(
      createWorkBodySchema.safeParse({
        title: "عمل",
        slug: "work",
        type: "manga",
        storyStatus: "ongoing",
        publicationStatus: "published",
      }).success,
    ).toBe(false);
  });

  it("accepts optional Work type for immutable-field handling", () => {
    expect(
      updateWorkBodySchema.parse({
        expectedVersion: 2,
        type: "text-story",
      }),
    ).toEqual({ expectedVersion: 2, type: "text-story" });
  });

  it("rejects duplicate Category IDs but permits an empty authoritative set", () => {
    expect(
      replaceWorkCategoriesBodySchema.safeParse({
        expectedVersion: 0,
        categoryIds: [firstId, firstId],
      }).success,
    ).toBe(false);
    expect(
      replaceWorkCategoriesBodySchema.parse({
        expectedVersion: 0,
        categoryIds: [],
      }),
    ).toEqual({ expectedVersion: 0, categoryIds: [] });
  });

  it("distinguishes omitted illustrated pages from an explicit empty set", () => {
    expect(createChapterBodySchema.safeParse({ number: 1 }).success).toBe(true);
    expect(
      createChapterBodySchema.safeParse({ number: 1, pages: [] }).success,
    ).toBe(false);
    expect(
      createChapterBodySchema.safeParse({
        number: 1,
        pages: [{ position: 2 }, { position: 1 }],
      }).success,
    ).toBe(true);
  });

  it("accepts only the supported versioned structured-text vocabulary", () => {
    expect(structuredTextDocumentSchema.parse(validStructuredText)).toEqual(
      validStructuredText,
    );

    for (const block of [
      { type: "raw", html: "<script>alert(1)</script>" },
      { type: "quote", text: "fixture-only quote" },
      { type: "image", src: "/private/path" },
      { type: "embed", url: "https://example.com" },
      { type: "script", code: "alert(1)" },
    ]) {
      expect(
        structuredTextDocumentSchema.safeParse({
          version: 1,
          blocks: [block],
        }).success,
      ).toBe(false);
    }

    expect(
      structuredTextDocumentSchema.safeParse({ version: 2, blocks: [] })
        .success,
    ).toBe(false);
    expect(
      structuredTextDocumentSchema.safeParse({ version: 1, blocks: [] })
        .success,
    ).toBe(false);
  });

  it("enforces structural, leaf, link, and aggregate bounds", () => {
    expect(
      structuredTextDocumentSchema.safeParse({
        version: 1,
        blocks: Array.from({ length: 501 }, () => ({
          type: "heading",
          level: 2,
          text: "x",
        })),
      }).success,
    ).toBe(false);
    expect(
      structuredTextDocumentSchema.safeParse({
        version: 1,
        blocks: [
          {
            type: "paragraph",
            content: Array.from({ length: 201 }, () => ({ text: "x" })),
          },
        ],
      }).success,
    ).toBe(false);
    expect(
      structuredTextDocumentSchema.safeParse({
        version: 1,
        blocks: [
          {
            type: "list",
            ordered: true,
            items: Array.from({ length: 201 }, () => "x"),
          },
        ],
      }).success,
    ).toBe(false);
    expect(
      structuredTextDocumentSchema.safeParse({
        version: 1,
        blocks: [{ type: "heading", level: 2, text: "x".repeat(4_001) }],
      }).success,
    ).toBe(false);
    expect(
      structuredTextDocumentSchema.safeParse({
        version: 1,
        blocks: [
          {
            type: "paragraph",
            content: [{ text: "x", href: "/" + "a".repeat(2_048) }],
          },
        ],
      }).success,
    ).toBe(false);
    expect(
      structuredTextDocumentSchema.safeParse({
        version: 1,
        blocks: Array.from({ length: 132 }, () => ({
          type: "heading",
          level: 2,
          text: "x".repeat(4_000),
        })),
      }).success,
    ).toBe(false);
  });

  it("rejects controls, unsafe links, malformed nesting, and unknown fields", () => {
    for (const href of [
      "https://example.com",
      "//example.com/path",
      "/path\\segment",
      "/path\u0000segment",
    ]) {
      expect(
        structuredTextDocumentSchema.safeParse({
          version: 1,
          blocks: [{ type: "paragraph", content: [{ text: "x", href }] }],
        }).success,
      ).toBe(false);
    }
    expect(
      structuredTextDocumentSchema.safeParse({
        version: 1,
        blocks: [{ type: "heading", level: 2, text: "bad\u0001text" }],
      }).success,
    ).toBe(false);
    expect(
      structuredTextDocumentSchema.safeParse({
        version: 1,
        blocks: [
          { type: "paragraph", content: [{ text: "x", html: "<b>x</b>" }] },
        ],
      }).success,
    ).toBe(false);
    expect(
      structuredTextDocumentSchema.safeParse({
        version: 1,
        blocks: [{ type: "paragraph", content: [{ value: "x" }] }],
      }).success,
    ).toBe(false);
  });

  it("enforces representation exclusivity, page bounds, and precise duplicate paths", () => {
    expect(
      createChapterBodySchema.safeParse({
        number: 1,
        textContent: validStructuredText,
        pages: [{ position: 1 }],
      }).success,
    ).toBe(false);
    expect(
      updateChapterBodySchema.safeParse({ expectedVersion: 0, pages: [] })
        .success,
    ).toBe(false);
    expect(
      createChapterBodySchema.safeParse({ number: 2_147_483_648 }).success,
    ).toBe(false);
    expect(
      createChapterBodySchema.safeParse({
        number: 1,
        pages: Array.from({ length: 501 }, (_, index) => ({
          position: index + 1,
        })),
      }).success,
    ).toBe(false);

    const duplicate = createChapterBodySchema.safeParse({
      number: 1,
      pages: [{ position: 1 }, { position: 1 }],
    });
    expect(duplicate.success).toBe(false);
    if (!duplicate.success) {
      expect(duplicate.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ["pages", 1, "position"] }),
        ]),
      );
    }
  });
});

describe("content response allowlists", () => {
  it("rejects body and page metadata from public Chapter projections", () => {
    const chapter = {
      id: firstId,
      workId: secondId,
      number: 1,
      contentType: "illustrated",
      publishedAt: "2026-09-22T00:00:00.000Z",
    };
    expect(publicChapterSchema.safeParse(chapter).success).toBe(true);
    expect(
      publicChapterSchema.safeParse({ ...chapter, pages: [] }).success,
    ).toBe(false);
  });

  it("requires the documented nullable content representation for admin Chapters", () => {
    expect(
      adminChapterSchema.safeParse({
        id: firstId,
        workId: secondId,
        number: 1,
        contentType: "illustrated",
        publicationStatus: "draft",
        publishedAt: null,
        version: 0,
        createdAt: "2026-09-22T00:00:00.000Z",
        updatedAt: "2026-09-22T00:00:00.000Z",
        textContent: null,
        pages: [],
      }).success,
    ).toBe(true);
  });
});

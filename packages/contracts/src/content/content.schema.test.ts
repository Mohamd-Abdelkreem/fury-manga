import { describe, expect, it } from "vitest";

import {
  adminCategoryListDataSchema,
  adminCategoryMoveDataSchema,
  adminCategorySchema,
  adminChapterSchema,
  adminWorkDataSchema,
  adminWorkSchema,
  categoryListQuerySchema,
  categoryPositionBodySchema,
  contentErrorCodeSchema,
  contentOperationErrorCodeSchema,
  createCategoryBodySchema,
  createChapterBodySchema,
  createWorkBodySchema,
  publicChapterSchema,
  replaceWorkCategoriesBodySchema,
  structuredTextDocumentSchema,
  updateCategoryBodySchema,
  updateChapterBodySchema,
  updateWorkBodySchema,
  workTagSchema,
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
      "CONTENT_CATEGORY_IN_USE",
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

describe("category management contracts", () => {
  const category = {
    id: firstId,
    displayName: "أكشن",
    slug: "action",
    enabled: true,
    displayPosition: 1,
    worksCount: 2,
    version: 0,
    createdAt: "2026-09-22T00:00:00.000Z",
    updatedAt: "2026-09-22T00:00:00.000Z",
  };

  it("accepts optional recovery UUIDs and rejects unsupported create fields", () => {
    expect(
      createCategoryBodySchema.parse({
        id: firstId,
        displayName: " أكشن ",
        slug: " Action ",
      }),
    ).toEqual({ id: firstId, displayName: "أكشن", slug: "action" });
    expect(
      createCategoryBodySchema.parse({ displayName: "أكشن", slug: "action" }),
    ).toEqual({ displayName: "أكشن", slug: "action" });
    expect(
      createCategoryBodySchema.safeParse({
        id: "not-a-uuid",
        displayName: "أكشن",
        slug: "action",
      }).success,
    ).toBe(false);
    expect(
      createCategoryBodySchema.safeParse({
        displayName: "أكشن",
        slug: "action",
        enabled: false,
        displayPosition: 3,
      }).success,
    ).toBe(false);
  });

  it("accepts mutable category fields but rejects null, empty, and unknown input", () => {
    expect(
      updateCategoryBodySchema.parse({ expectedVersion: 2, enabled: false }),
    ).toEqual({ expectedVersion: 2, enabled: false });
    expect(
      updateCategoryBodySchema.parse({
        expectedVersion: 2,
        displayName: " الاسم ",
        slug: "ACTION",
      }),
    ).toEqual({ expectedVersion: 2, displayName: "الاسم", slug: "action" });
    expect(
      updateCategoryBodySchema.safeParse({
        expectedVersion: 2,
        enabled: null,
      }).success,
    ).toBe(false);
    expect(
      updateCategoryBodySchema.safeParse({ expectedVersion: 2 }).success,
    ).toBe(false);
    expect(
      updateCategoryBodySchema.safeParse({
        expectedVersion: 2,
        enabled: true,
        ownerId: firstId,
      }).success,
    ).toBe(false);
  });

  it("bounds and normalizes database-side category list filters", () => {
    expect(categoryListQuerySchema.parse({})).toEqual({ page: 1, limit: 25 });
    expect(
      categoryListQuerySchema.parse({
        page: "100000",
        limit: "100",
        search: "  خيال ",
        enabled: "false",
      }),
    ).toEqual({ page: 100_000, limit: 100, search: "خيال", enabled: false });
    for (const query of [
      { page: "100001" },
      { limit: "101" },
      { search: "x".repeat(101) },
      { enabled: "maybe" },
      { sort: "displayName" },
    ]) {
      expect(categoryListQuerySchema.safeParse(query).success).toBe(false);
    }
  });

  it("validates adjacent position requests and strict move outputs", () => {
    expect(
      categoryPositionBodySchema.parse({
        expectedVersion: 3,
        targetPosition: 2,
      }),
    ).toEqual({ expectedVersion: 3, targetPosition: 2 });
    expect(
      categoryPositionBodySchema.safeParse({
        expectedVersion: 3,
        targetPosition: 0,
      }).success,
    ).toBe(false);
    expect(
      categoryPositionBodySchema.safeParse({
        expectedVersion: 3,
        targetPosition: 2,
        displayName: "unsupported",
      }).success,
    ).toBe(false);
    expect(
      adminCategoryMoveDataSchema.parse({
        category,
        displacedCategory: { ...category, id: secondId, displayPosition: 2 },
      }),
    ).toEqual({
      category,
      displacedCategory: { ...category, id: secondId, displayPosition: 2 },
    });
    expect(
      adminCategoryMoveDataSchema.safeParse({
        category,
        displacedCategory: null,
        rawRecord: {},
      }).success,
    ).toBe(false);
    expect(
      adminCategoryListDataSchema.safeParse({
        items: [{ ...category, ownerId: secondId }],
        pagination: {
          page: 1,
          limit: 25,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }).success,
    ).toBe(false);
  });

  it("publishes safe category management error codes only", () => {
    expect(contentErrorCodeSchema.options).toContain("CONTENT_CATEGORY_IN_USE");
    expect(
      contentOperationErrorCodeSchema.safeParse("CONTENT_CATEGORY_IN_USE")
        .success,
    ).toBe(true);
    expect(
      adminCategorySchema.safeParse({ ...category, privateNote: "secret" })
        .success,
    ).toBe(false);
  });
});

describe("Phase 4 work editorial contracts", () => {
  const minimumSynopsis = "s".repeat(20);

  it("preserves minimal P01 create and update bodies while accepting optional recovery identity", () => {
    expect(
      createWorkBodySchema.parse({
        title: "Legacy Work",
        slug: "legacy-work",
        type: "manga",
        storyStatus: "ongoing",
      }),
    ).toEqual({
      title: "Legacy Work",
      slug: "legacy-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    expect(
      createWorkBodySchema.parse({
        id: firstId,
        title: "  Legacy Work  ",
        slug: " Legacy-Work ",
        type: "text-story",
        storyStatus: "completed",
      }),
    ).toEqual({
      id: firstId,
      title: "Legacy Work",
      slug: "legacy-work",
      type: "text-story",
      storyStatus: "completed",
    });
    expect(
      createWorkBodySchema.safeParse({
        id: "not-a-uuid",
        title: "Legacy Work",
        slug: "legacy-work",
        type: "manga",
        storyStatus: "ongoing",
      }).success,
    ).toBe(false);
    expect(
      updateWorkBodySchema.parse({
        expectedVersion: 4,
        title: "Existing P01 edit",
        slug: "legacy-work",
        type: "manga",
      }),
    ).toEqual({
      expectedVersion: 4,
      title: "Existing P01 edit",
      slug: "legacy-work",
      type: "manga",
    });
  });

  it("normalizes rich create metadata, ordered tags, category IDs, media IDs and featured pair", () => {
    const work = createWorkBodySchema.parse({
      id: firstId,
      title: "  عمل  ",
      slug: "work",
      type: "manga",
      storyStatus: "ongoing",
      alternativeTitle: "  Alternative  ",
      synopsis: `  ${minimumSynopsis}  `,
      author: "  Author  ",
      artist: " Artist ",
      categoryIds: [secondId],
      tags: [" Café ", "Adventure"],
      coverAssetId: firstId,
      backgroundAssetId: null,
      featuredHome: true,
      featuredOrder: 2,
    });
    expect(work).toMatchObject({
      id: firstId,
      title: "عمل",
      alternativeTitle: "Alternative",
      synopsis: minimumSynopsis,
      author: "Author",
      artist: "Artist",
      categoryIds: [secondId],
      tags: ["Café", "Adventure"],
      coverAssetId: firstId,
      backgroundAssetId: null,
      featuredHome: true,
      featuredOrder: 2,
    });
    expect(workTagSchema.parse("  Café  ")).toBe("Café");
    expect(workTagSchema.parse("Cafe\u0301")).toBe("Café");
    expect(
      createWorkBodySchema.parse({
        title: "Work",
        slug: "work",
        type: "manga",
        storyStatus: "ongoing",
        categoryIds: [secondId.toUpperCase()],
        coverAssetId: firstId.toUpperCase(),
      }),
    ).toMatchObject({
      categoryIds: [secondId],
      coverAssetId: firstId,
    });
  });

  it("preserves PATCH omission, nullable clears, explicit empty sets, and immutable identity echoes", () => {
    expect(
      updateWorkBodySchema.parse({
        expectedVersion: 3,
        title: "Updated",
        slug: "saved-slug",
        type: "manga",
      }),
    ).toEqual({
      expectedVersion: 3,
      title: "Updated",
      slug: "saved-slug",
      type: "manga",
    });
    expect(
      updateWorkBodySchema.parse({
        expectedVersion: 3,
        alternativeTitle: null,
        synopsis: null,
        author: null,
        artist: null,
        coverAssetId: null,
        backgroundAssetId: null,
        categoryIds: [],
        tags: [],
        featuredHome: false,
        featuredOrder: null,
      }),
    ).toEqual({
      expectedVersion: 3,
      alternativeTitle: null,
      synopsis: null,
      author: null,
      artist: null,
      coverAssetId: null,
      backgroundAssetId: null,
      categoryIds: [],
      tags: [],
      featuredHome: false,
      featuredOrder: null,
    });
    const omitted = updateWorkBodySchema.parse({
      expectedVersion: 3,
      title: "Only title changes",
    });
    expect(omitted).not.toHaveProperty("categoryIds");
    expect(omitted).not.toHaveProperty("tags");
    expect(omitted).not.toHaveProperty("coverAssetId");
    expect(
      updateWorkBodySchema.safeParse({
        expectedVersion: 3,
        categoryIds: null,
      }).success,
    ).toBe(false);
    expect(
      updateWorkBodySchema.safeParse({ expectedVersion: 3, tags: null })
        .success,
    ).toBe(false);
  });

  it("enforces editorial bounds, distinct normalized sets, and the category ceiling", () => {
    const base = {
      title: "Work",
      slug: "work",
      type: "manga",
      storyStatus: "ongoing",
    } as const;
    expect(
      createWorkBodySchema.safeParse({ ...base, title: "x".repeat(201) })
        .success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({
        ...base,
        alternativeTitle: "x".repeat(201),
      }).success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({ ...base, synopsis: "s".repeat(19) })
        .success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({ ...base, synopsis: "s".repeat(5_001) })
        .success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({ ...base, author: "x".repeat(151) })
        .success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({ ...base, artist: "x".repeat(151) })
        .success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({ ...base, tags: ["x".repeat(41)] })
        .success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({
        ...base,
        tags: Array.from({ length: 21 }, (_, index) => `tag-${String(index)}`),
      }).success,
    ).toBe(false);
    const oneHundredCategoryIds = Array.from(
      { length: 100 },
      (_, index) =>
        `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    );
    expect(
      createWorkBodySchema.parse({
        ...base,
        categoryIds: oneHundredCategoryIds,
      }).categoryIds,
    ).toEqual(oneHundredCategoryIds);
    expect(
      createWorkBodySchema.safeParse({
        ...base,
        categoryIds: [
          ...oneHundredCategoryIds,
          "99999999-9999-4999-8999-999999999999",
        ],
      }).success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({
        ...base,
        categoryIds: [firstId, firstId],
      }).success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({
        ...base,
        categoryIds: [firstId, firstId.toUpperCase()],
      }).success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({
        ...base,
        tags: ["Adventure", " Adventure "],
      }).success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({
        ...base,
        tags: ["Café", "Cafe\u0301"],
      }).success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({ ...base, coverAssetId: "not-a-uuid" })
        .success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({ ...base, author: "bad\u0001text" })
        .success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({
        ...base,
        publicationStatus: "published",
      }).success,
    ).toBe(false);
  });

  it("requires an internally consistent featured preference and order pair", () => {
    const base = {
      title: "Work",
      slug: "work",
      type: "manga",
      storyStatus: "ongoing",
    } as const;
    expect(createWorkBodySchema.safeParse(base).success).toBe(true);
    expect(
      createWorkBodySchema.safeParse({ ...base, featuredHome: true }).success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({ ...base, featuredOrder: 1 }).success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({
        ...base,
        featuredHome: false,
        featuredOrder: 1,
      }).success,
    ).toBe(false);
    expect(
      createWorkBodySchema.safeParse({
        ...base,
        featuredHome: true,
        featuredOrder: null,
      }).success,
    ).toBe(false);
    expect(
      updateWorkBodySchema.safeParse({
        expectedVersion: 0,
        featuredHome: true,
      }).success,
    ).toBe(false);
  });

  it("requires a rich strict admin DTO while keeping the public projection private", () => {
    const category = {
      id: firstId,
      displayName: "Action",
      slug: "action",
      enabled: false,
      displayPosition: 1,
      worksCount: 1,
      version: 0,
      createdAt: "2026-09-22T00:00:00.000Z",
      updatedAt: "2026-09-22T00:00:00.000Z",
    };
    const work = {
      id: secondId,
      title: "Work",
      alternativeTitle: null,
      synopsis: null,
      author: null,
      artist: null,
      slug: "work",
      type: "manga",
      storyStatus: "ongoing",
      publicationStatus: "draft",
      publishedAt: null,
      featuredHome: false,
      featuredOrder: null,
      coverAssetId: null,
      backgroundAssetId: null,
      tags: [],
      version: 0,
      createdAt: "2026-09-22T00:00:00.000Z",
      updatedAt: "2026-09-22T00:00:00.000Z",
      categories: [category],
    };
    expect(adminWorkSchema.parse(work)).toEqual(work);
    expect(adminWorkDataSchema.parse({ work })).toEqual({ work });
    expect(
      adminWorkSchema.safeParse({ ...work, relativeKey: "private/path" })
        .success,
    ).toBe(false);
    expect(
      adminWorkSchema.safeParse({ ...work, rawStoragePath: "private/path" })
        .success,
    ).toBe(false);
  });
});

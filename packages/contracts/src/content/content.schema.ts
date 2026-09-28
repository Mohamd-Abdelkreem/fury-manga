import { z } from "zod";

import {
  commonHttpErrorCodeSchema,
  paginationMetaSchema,
  paginationQuerySchema,
} from "../http/http.schema.ts";

const MAX_STRUCTURED_TEXT_BYTES = 512 * 1024;

const normalizeText = (value: string): string => value.trim().normalize("NFC");

const hasUnsupportedTextControl = (value: string): boolean => {
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0;
    if (code !== 9 && code !== 10 && code !== 13 && code < 32) return true;
  }
  return false;
};

const hasControlCharacter = (value: string): boolean => {
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0;
    if (code < 32 || code === 127) return true;
  }
  return false;
};

const boundedNormalizedText = (maximum: number) =>
  z
    .string()
    .overwrite(normalizeText)
    .min(1)
    .max(maximum)
    .refine((value) => !value.includes("\u0000"), {
      message: "must not contain null characters",
    });

const safeTextLeafSchema = z
  .string()
  .max(4_000)
  .refine((value) => value.length > 0, { message: "must not be empty" })
  .refine((value) => !hasUnsupportedTextControl(value), {
    message: "must not contain unsupported control characters",
  });

const safeApplicationPathSchema = z
  .string()
  .min(1)
  .max(2_048)
  .refine(
    (value) =>
      value.startsWith("/") &&
      !value.startsWith("//") &&
      !value.includes(String.fromCharCode(92)) &&
      !hasControlCharacter(value),
    { message: "must be a safe root-relative application path" },
  );

export const workTypeSchema = z.enum([
  "manga",
  "manhwa",
  "manhua",
  "comics",
  "novel",
  "text-story",
]);
export const storyStatusSchema = z.enum([
  "ongoing",
  "completed",
  "hiatus",
  "cancelled",
]);
export const publicationStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
]);
export const chapterContentTypeSchema = z.enum(["illustrated", "text"]);
export const contentErrorCodeSchema = z
  .enum([
    "CONTENT_CONFLICT",
    "CONTENT_IMMUTABLE",
    "CONTENT_TYPE_CONFLICT",
    "CONTENT_TRANSITION_CONFLICT",
    "CONTENT_STALE_WRITE",
    "CONTENT_CATEGORY_IN_USE",
    "CONTENT_NOT_READY",
    "CONTENT_FEATURED_CONFLICT",
  ])
  .meta({ id: "ContentErrorCode" });
export const contentOperationErrorCodeSchema = z
  .enum([
    ...commonHttpErrorCodeSchema.options,
    ...contentErrorCodeSchema.options,
  ])
  .meta({ id: "ContentOperationErrorCode" });

export const contentIdSchema = z.uuid();
const canonicalContentIdSchema = contentIdSchema.overwrite((id) =>
  id.toLowerCase(),
);
export const contentTimestampSchema = z.iso.datetime({ offset: true });
export const contentVersionSchema = z.number().int().min(0);
export const expectedVersionSchema = contentVersionSchema;
export const positiveIntegerSchema = z.number().int().min(1).max(2_147_483_647);
export const contentSlugSchema = z
  .string()
  .overwrite((value) => value.trim().normalize("NFC").toLowerCase())
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);

const editorialText = (minimum: number, maximum: number) =>
  z
    .string()
    .overwrite(normalizeText)
    .min(minimum)
    .max(maximum)
    .refine((value) => !hasUnsupportedTextControl(value), {
      message: "must not contain unsupported control characters",
    });

export const workTagSchema = editorialText(1, 40);
const workTagsSchema = z
  .array(workTagSchema)
  .max(20)
  .superRefine((tags, context) => {
    const seen = new Set<string>();
    tags.forEach((tag, index) => {
      if (seen.has(tag)) {
        context.addIssue({
          code: "custom",
          message: "tags must be unique after normalization",
          path: [index],
        });
      }
      seen.add(tag);
    });
  });

const workCategoryIdsSchema = z
  .array(canonicalContentIdSchema)
  .max(100)
  .superRefine((categoryIds, context) => {
    const seen = new Set<string>();
    categoryIds.forEach((categoryId, index) => {
      if (seen.has(categoryId)) {
        context.addIssue({
          code: "custom",
          message: "category IDs must be unique",
          path: [index],
        });
      }
      seen.add(categoryId);
    });
  });

const featuredPairSchema = {
  featuredHome: z.boolean().optional(),
  featuredOrder: positiveIntegerSchema.nullable().optional(),
};

const addFeaturedPairIssues = (
  value: Readonly<{
    featuredHome?: boolean | undefined;
    featuredOrder?: number | null | undefined;
  }>,
  context: z.RefinementCtx,
): void => {
  const hasHome = value.featuredHome !== undefined;
  const hasOrder = value.featuredOrder !== undefined;
  if (hasHome !== hasOrder) {
    context.addIssue({
      code: "custom",
      message: "featuredHome and featuredOrder must be submitted together",
      path: [hasHome ? "featuredOrder" : "featuredHome"],
    });
    return;
  }
  if (
    hasHome &&
    hasOrder &&
    value.featuredHome !== (value.featuredOrder !== null)
  ) {
    context.addIssue({
      code: "custom",
      message: "featured order must match the featured preference",
      path: ["featuredOrder"],
    });
  }
};

export const structuredTextInlineSchema = z
  .object({
    text: safeTextLeafSchema,
    bold: z.boolean().optional(),
    italic: z.boolean().optional(),
    href: safeApplicationPathSchema.optional(),
  })
  .strict();

const structuredTextHeadingSchema = z
  .object({
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text: safeTextLeafSchema,
  })
  .strict();

const structuredTextParagraphSchema = z
  .object({
    type: z.literal("paragraph"),
    content: z.array(structuredTextInlineSchema).min(1).max(200),
  })
  .strict();

const structuredTextListSchema = z
  .object({
    type: z.literal("list"),
    ordered: z.boolean(),
    items: z.array(safeTextLeafSchema).min(1).max(200),
  })
  .strict();

export const structuredTextBlockSchema = z.discriminatedUnion("type", [
  structuredTextHeadingSchema,
  structuredTextParagraphSchema,
  structuredTextListSchema,
]);

export const structuredTextDocumentSchema = z
  .object({
    version: z.literal(1),
    blocks: z.array(structuredTextBlockSchema).min(1).max(500),
  })
  .strict()
  .refine(
    (value) =>
      new TextEncoder().encode(JSON.stringify(value)).byteLength <=
      MAX_STRUCTURED_TEXT_BYTES,
    { message: "structured text must not exceed 512 KiB" },
  );

export const categoryListQuerySchema = z
  .object({
    ...paginationQuerySchema.shape,
    page: paginationQuerySchema.shape.page.pipe(
      z.number().int().min(1).max(100_000),
    ),
    search: z
      .string()
      .transform(normalizeText)
      .pipe(
        z
          .string()
          .max(100)
          .refine((value) => !hasUnsupportedTextControl(value)),
      )
      .optional(),
    enabled: z
      .preprocess(
        (value) =>
          value === "true" ? true : value === "false" ? false : value,
        z.boolean(),
      )
      .optional(),
  })
  .strict();

export const adminWorkListQuerySchema = z
  .object({
    ...paginationQuerySchema.shape,
    page: paginationQuerySchema.shape.page.pipe(
      z.number().int().min(1).max(100_000),
    ),
    search: z
      .string()
      .transform(normalizeText)
      .pipe(
        z
          .string()
          .max(200)
          .refine((value) => !hasUnsupportedTextControl(value)),
      )
      .optional(),
    type: workTypeSchema.optional(),
    storyStatus: storyStatusSchema.optional(),
    publicationStatus: publicationStatusSchema.optional(),
    sort: z.enum(["updated", "oldest", "title", "chapters"]).default("updated"),
  })
  .strict();

export const adminChapterListQuerySchema = z
  .object({
    ...paginationQuerySchema.shape,
    page: paginationQuerySchema.shape.page.pipe(
      z.number().int().min(1).max(100_000),
    ),
    search: z
      .string()
      .transform(normalizeText)
      .pipe(
        z
          .string()
          .max(200)
          .refine((value) => !hasUnsupportedTextControl(value)),
      )
      .optional(),
    publicationStatus: publicationStatusSchema.optional(),
    sort: z
      .enum(["number_asc", "number_desc", "published_desc", "updated_desc"])
      .default("number_asc"),
  })
  .strict();

export const createCategoryBodySchema = z
  .object({
    id: contentIdSchema.optional(),
    displayName: boundedNormalizedText(100),
    slug: contentSlugSchema,
  })
  .strict();

export const updateCategoryBodySchema = z
  .object({
    expectedVersion: expectedVersionSchema,
    displayName: boundedNormalizedText(100).optional(),
    enabled: z.boolean().optional(),
    slug: contentSlugSchema.optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.displayName !== undefined ||
      value.enabled !== undefined ||
      value.slug !== undefined,
    { message: "at least one mutable or immutable field is required" },
  );

export const categoryPositionBodySchema = z
  .object({
    expectedVersion: expectedVersionSchema,
    targetPosition: positiveIntegerSchema,
  })
  .strict();

export const createWorkBodySchema = z
  .object({
    id: canonicalContentIdSchema.optional(),
    title: boundedNormalizedText(200),
    slug: contentSlugSchema,
    type: workTypeSchema,
    storyStatus: storyStatusSchema,
    alternativeTitle: editorialText(1, 200).nullable().optional(),
    synopsis: editorialText(20, 5_000).nullable().optional(),
    author: editorialText(1, 150).nullable().optional(),
    artist: editorialText(1, 150).nullable().optional(),
    categoryIds: workCategoryIdsSchema.optional(),
    tags: workTagsSchema.optional(),
    coverAssetId: canonicalContentIdSchema.nullable().optional(),
    backgroundAssetId: canonicalContentIdSchema.nullable().optional(),
    targetState: z.enum(["draft", "published"]).optional(),
    ...featuredPairSchema,
  })
  .strict()
  .superRefine(addFeaturedPairIssues);

export const updateWorkBodySchema = z
  .object({
    expectedVersion: expectedVersionSchema,
    title: boundedNormalizedText(200).optional(),
    storyStatus: storyStatusSchema.optional(),
    slug: contentSlugSchema.optional(),
    type: workTypeSchema.optional(),
    alternativeTitle: editorialText(1, 200).nullable().optional(),
    synopsis: editorialText(20, 5_000).nullable().optional(),
    author: editorialText(1, 150).nullable().optional(),
    artist: editorialText(1, 150).nullable().optional(),
    categoryIds: workCategoryIdsSchema.optional(),
    tags: workTagsSchema.optional(),
    coverAssetId: canonicalContentIdSchema.nullable().optional(),
    backgroundAssetId: canonicalContentIdSchema.nullable().optional(),
    targetState: z.literal("published").optional(),
    ...featuredPairSchema,
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.title === undefined &&
      value.storyStatus === undefined &&
      value.slug === undefined &&
      value.type === undefined &&
      value.alternativeTitle === undefined &&
      value.synopsis === undefined &&
      value.author === undefined &&
      value.artist === undefined &&
      value.categoryIds === undefined &&
      value.tags === undefined &&
      value.coverAssetId === undefined &&
      value.backgroundAssetId === undefined &&
      value.targetState === undefined &&
      value.featuredHome === undefined &&
      value.featuredOrder === undefined
    ) {
      context.addIssue({
        code: "custom",
        message: "at least one mutable or immutable field is required",
      });
    }
    addFeaturedPairIssues(value, context);
  });

export const replaceWorkCategoriesBodySchema = z
  .object({
    expectedVersion: expectedVersionSchema,
    categoryIds: z.array(contentIdSchema).max(100),
  })
  .strict()
  .superRefine((value, context) => {
    const seen = new Set<string>();
    value.categoryIds.forEach((categoryId, index) => {
      if (seen.has(categoryId)) {
        context.addIssue({
          code: "custom",
          message: "category IDs must be unique",
          path: ["categoryIds", index],
        });
      }
      seen.add(categoryId);
    });
  });

export const chapterPageInputSchema = z
  .object({
    id: canonicalContentIdSchema.optional(),
    assetId: canonicalContentIdSchema,
  })
  .strict();

const chapterCreatePagesSchema = z
  .array(chapterPageInputSchema.omit({ id: true }))
  .max(500);

const chapterPagesSchema = z
  .array(chapterPageInputSchema)
  .max(500)
  .superRefine((pages, context) => {
    const seen = new Set<string>();
    pages.forEach(({ id }, index) => {
      if (id !== undefined && seen.has(id)) {
        context.addIssue({
          code: "custom",
          message: "page IDs must be unique",
          path: [index, "id"],
        });
      }
      if (id !== undefined) seen.add(id);
    });
  });

export const createChapterBodySchema = z
  .object({
    number: positiveIntegerSchema,
    title: editorialText(1, 200),
    textContent: structuredTextDocumentSchema.nullable().optional(),
    pages: chapterCreatePagesSchema.optional(),
  })
  .strict()
  .refine(
    (value) => !(value.textContent !== undefined && value.pages !== undefined),
    { message: "text content and pages cannot be submitted together" },
  );

export const updateChapterBodySchema = z
  .object({
    expectedVersion: expectedVersionSchema,
    number: positiveIntegerSchema.optional(),
    title: editorialText(1, 200).optional(),
    textContent: structuredTextDocumentSchema.nullable().optional(),
    pages: chapterPagesSchema.optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.number !== undefined ||
      value.title !== undefined ||
      value.textContent !== undefined ||
      value.pages !== undefined,
    { message: "at least one mutable field is required" },
  )
  .refine(
    (value) => !(value.textContent !== undefined && value.pages !== undefined),
    { message: "text content and pages cannot be submitted together" },
  );

export const publicationCommandBodySchema = z
  .object({
    expectedVersion: expectedVersionSchema,
    targetState: publicationStatusSchema,
  })
  .strict();

export const categoryIdParamsSchema = z
  .object({ categoryId: contentIdSchema })
  .strict();
export const workIdParamsSchema = z
  .object({ workId: contentIdSchema })
  .strict();
export const workSlugParamsSchema = z
  .object({ workSlug: contentSlugSchema })
  .strict();
export const workChapterParamsSchema = z
  .object({ workId: contentIdSchema, chapterId: contentIdSchema })
  .strict();
export const publicChapterParamsSchema = z
  .object({
    workSlug: contentSlugSchema,
    chapterNumber: z.preprocess(
      (value) =>
        typeof value === "string" && /^\d+$/u.test(value)
          ? Number(value)
          : value,
      positiveIntegerSchema,
    ),
  })
  .strict();

export const publicCategorySchema = z
  .object({
    id: contentIdSchema,
    displayName: z.string().min(1).max(100),
    slug: contentSlugSchema,
  })
  .strict();

export const publicWorkSchema = z
  .object({
    id: contentIdSchema,
    title: z.string().min(1).max(200),
    slug: contentSlugSchema,
    type: workTypeSchema,
    storyStatus: storyStatusSchema,
    publishedAt: contentTimestampSchema,
    categories: z.array(publicCategorySchema),
  })
  .strict();

export const publicChapterSchema = z
  .object({
    id: contentIdSchema,
    workId: contentIdSchema,
    number: positiveIntegerSchema,
    title: z.string().min(1).max(200),
    contentType: chapterContentTypeSchema,
    publishedAt: contentTimestampSchema,
  })
  .strict();

export const adminCategorySchema = z
  .object({
    id: contentIdSchema,
    displayName: z.string().min(1).max(100),
    slug: contentSlugSchema,
    enabled: z.boolean(),
    displayPosition: positiveIntegerSchema,
    worksCount: z.number().int().min(0),
    version: contentVersionSchema,
    createdAt: contentTimestampSchema,
    updatedAt: contentTimestampSchema,
  })
  .strict();

export const adminWorkSchema = z
  .object({
    id: contentIdSchema,
    title: z.string().min(1).max(200),
    alternativeTitle: z.string().max(200).nullable(),
    synopsis: z.string().max(5_000).nullable(),
    author: z.string().min(1).max(150).nullable(),
    artist: z.string().min(1).max(150).nullable(),
    slug: contentSlugSchema,
    type: workTypeSchema,
    storyStatus: storyStatusSchema,
    publicationStatus: publicationStatusSchema,
    publishedAt: contentTimestampSchema.nullable(),
    featuredHome: z.boolean(),
    featuredOrder: positiveIntegerSchema.nullable(),
    coverAssetId: contentIdSchema.nullable(),
    backgroundAssetId: contentIdSchema.nullable(),
    tags: z.array(z.string().min(1).max(40)).max(20),
    version: contentVersionSchema,
    createdAt: contentTimestampSchema,
    updatedAt: contentTimestampSchema,
    categories: z.array(adminCategorySchema).max(100),
  })
  .strict()
  .superRefine(addFeaturedPairIssues);

export const adminWorkListItemSchema = z
  .object({
    id: contentIdSchema,
    title: z.string().min(1).max(200),
    alternativeTitle: z.string().max(200).nullable(),
    slug: contentSlugSchema,
    type: workTypeSchema,
    storyStatus: storyStatusSchema,
    publicationStatus: publicationStatusSchema,
    publishedAt: contentTimestampSchema.nullable(),
    featuredHome: z.boolean(),
    featuredOrder: positiveIntegerSchema.nullable(),
    coverAssetId: contentIdSchema.nullable(),
    chapterCount: z.number().int().min(0),
    version: contentVersionSchema,
    createdAt: contentTimestampSchema,
    updatedAt: contentTimestampSchema,
  })
  .strict();

export const adminChapterPageSchema = z
  .object({
    id: contentIdSchema,
    position: positiveIntegerSchema,
    assetId: contentIdSchema,
    assetStatus: z.enum(["available", "unavailable"]),
  })
  .strict();

export const adminChapterSchema = z
  .object({
    id: contentIdSchema,
    workId: contentIdSchema,
    number: positiveIntegerSchema,
    title: z.string().min(1).max(200),
    contentType: chapterContentTypeSchema,
    publicationStatus: publicationStatusSchema,
    publishedAt: contentTimestampSchema.nullable(),
    version: contentVersionSchema,
    createdAt: contentTimestampSchema,
    updatedAt: contentTimestampSchema,
    textContent: structuredTextDocumentSchema.nullable(),
    pages: z.array(adminChapterPageSchema),
    readyForPublication: z.boolean(),
  })
  .strict();

export const adminChapterSummarySchema = adminChapterSchema.omit({
  textContent: true,
  pages: true,
});

export const publicWorkDataSchema = z
  .object({ work: publicWorkSchema })
  .strict();
export const publicChapterDataSchema = z
  .object({ chapter: publicChapterSchema })
  .strict();
export const adminCategoryDataSchema = z
  .object({ category: adminCategorySchema })
  .strict();
export const adminCategoryMoveDataSchema = z
  .object({
    category: adminCategorySchema,
    displacedCategory: adminCategorySchema.nullable(),
  })
  .strict();
export const adminWorkDataSchema = z.object({ work: adminWorkSchema }).strict();
export const adminChapterDataSchema = z
  .object({ chapter: adminChapterSchema })
  .strict();

export const publicationTransitionSchema = z
  .object({
    resourceType: z.enum(["work", "chapter"]),
    resourceId: contentIdSchema,
    publicationStatus: publicationStatusSchema,
    publishedAt: contentTimestampSchema.nullable(),
    publicationEventId: contentIdSchema.nullable(),
    version: contentVersionSchema,
    transitioned: z.boolean(),
  })
  .strict();

export const publicationTransitionDataSchema = z
  .object({ transition: publicationTransitionSchema })
  .strict();

const listDataSchema = <T extends z.ZodType>(itemSchema: T) =>
  z
    .object({
      items: z.array(itemSchema),
      pagination: paginationMetaSchema,
    })
    .strict();

export const publicWorkListDataSchema = listDataSchema(publicWorkSchema);
export const publicChapterListDataSchema = listDataSchema(publicChapterSchema);
export const adminCategoryListDataSchema = listDataSchema(adminCategorySchema);
export const adminWorkListDataSchema = listDataSchema(adminWorkListItemSchema);
export const adminChapterListDataSchema = listDataSchema(
  adminChapterSummarySchema,
);

export type WorkType = z.infer<typeof workTypeSchema>;
export type StoryStatus = z.infer<typeof storyStatusSchema>;
export type PublicationStatus = z.infer<typeof publicationStatusSchema>;
export type ChapterContentType = z.infer<typeof chapterContentTypeSchema>;
export type ContentErrorCode = z.infer<typeof contentErrorCodeSchema>;
export type ContentOperationErrorCode = z.infer<
  typeof contentOperationErrorCodeSchema
>;
export type StructuredTextDocument = z.infer<
  typeof structuredTextDocumentSchema
>;
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
export type AdminWorkListQuery = z.infer<typeof adminWorkListQuerySchema>;
export type AdminChapterListQuery = z.infer<typeof adminChapterListQuerySchema>;
export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;
export type UpdateCategoryBody = z.infer<typeof updateCategoryBodySchema>;
export type CategoryPositionBody = z.infer<typeof categoryPositionBodySchema>;
export type CreateWorkBody = z.infer<typeof createWorkBodySchema>;
export type UpdateWorkBody = z.infer<typeof updateWorkBodySchema>;
export type WorkTag = z.infer<typeof workTagSchema>;
export type ReplaceWorkCategoriesBody = z.infer<
  typeof replaceWorkCategoriesBodySchema
>;
export type CreateChapterBody = z.infer<typeof createChapterBodySchema>;
export type UpdateChapterBody = z.infer<typeof updateChapterBodySchema>;
export type PublicationCommandBody = z.infer<
  typeof publicationCommandBodySchema
>;
export type PublicCategory = z.infer<typeof publicCategorySchema>;
export type PublicWork = z.infer<typeof publicWorkSchema>;
export type PublicChapter = z.infer<typeof publicChapterSchema>;
export type AdminCategory = z.infer<typeof adminCategorySchema>;
export type AdminCategoryMove = z.infer<typeof adminCategoryMoveDataSchema>;
export type AdminWork = z.infer<typeof adminWorkSchema>;
export type AdminWorkListItem = z.infer<typeof adminWorkListItemSchema>;
export type AdminChapter = z.infer<typeof adminChapterSchema>;
export type AdminChapterSummary = z.infer<typeof adminChapterSummarySchema>;
export type PublicationTransition = z.infer<typeof publicationTransitionSchema>;

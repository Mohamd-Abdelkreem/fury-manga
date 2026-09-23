import { z } from "zod";

import {
  commonHttpErrorCodeSchema,
  paginationMetaSchema,
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
    .transform(normalizeText)
    .pipe(
      z
        .string()
        .min(1)
        .max(maximum)
        .refine((value) => !value.includes("\u0000"), {
          message: "must not contain null characters",
        }),
    );

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
  ])
  .meta({ id: "ContentErrorCode" });
export const contentOperationErrorCodeSchema = z
  .enum([
    ...commonHttpErrorCodeSchema.options,
    ...contentErrorCodeSchema.options,
  ])
  .meta({ id: "ContentOperationErrorCode" });

export const contentIdSchema = z.uuid();
export const contentTimestampSchema = z.iso.datetime({ offset: true });
export const contentVersionSchema = z.number().int().min(0);
export const expectedVersionSchema = contentVersionSchema;
export const positiveIntegerSchema = z.number().int().min(1).max(2_147_483_647);
export const contentSlugSchema = z
  .string()
  .transform((value) => value.trim().normalize("NFC").toLowerCase())
  .pipe(
    z
      .string()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  );

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

export const createCategoryBodySchema = z
  .object({
    displayName: boundedNormalizedText(100),
    slug: contentSlugSchema,
  })
  .strict();

export const updateCategoryBodySchema = z
  .object({
    expectedVersion: expectedVersionSchema,
    displayName: boundedNormalizedText(100).optional(),
    slug: contentSlugSchema.optional(),
  })
  .strict()
  .refine(
    (value) => value.displayName !== undefined || value.slug !== undefined,
    { message: "at least one mutable or immutable field is required" },
  );

export const createWorkBodySchema = z
  .object({
    title: boundedNormalizedText(200),
    slug: contentSlugSchema,
    type: workTypeSchema,
    storyStatus: storyStatusSchema,
  })
  .strict();

export const updateWorkBodySchema = z
  .object({
    expectedVersion: expectedVersionSchema,
    title: boundedNormalizedText(200).optional(),
    storyStatus: storyStatusSchema.optional(),
    slug: contentSlugSchema.optional(),
    type: workTypeSchema.optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.title !== undefined ||
      value.storyStatus !== undefined ||
      value.slug !== undefined ||
      value.type !== undefined,
    { message: "at least one mutable or immutable field is required" },
  );

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
  .object({ position: positiveIntegerSchema })
  .strict();

const chapterPagesSchema = z
  .array(chapterPageInputSchema)
  .min(1)
  .max(500)
  .superRefine((pages, context) => {
    const seen = new Set<number>();
    pages.forEach(({ position }, index) => {
      if (seen.has(position)) {
        context.addIssue({
          code: "custom",
          message: "page positions must be unique",
          path: [index, "position"],
        });
      }
      seen.add(position);
    });
  });

export const createChapterBodySchema = z
  .object({
    number: positiveIntegerSchema,
    textContent: structuredTextDocumentSchema.optional(),
    pages: chapterPagesSchema.optional(),
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
    textContent: structuredTextDocumentSchema.optional(),
    pages: chapterPagesSchema.optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.number !== undefined ||
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
    contentType: chapterContentTypeSchema,
    publishedAt: contentTimestampSchema,
  })
  .strict();

export const adminCategorySchema = z
  .object({
    id: contentIdSchema,
    displayName: z.string().min(1).max(100),
    slug: contentSlugSchema,
    version: contentVersionSchema,
    createdAt: contentTimestampSchema,
    updatedAt: contentTimestampSchema,
  })
  .strict();

export const adminWorkSchema = z
  .object({
    id: contentIdSchema,
    title: z.string().min(1).max(200),
    slug: contentSlugSchema,
    type: workTypeSchema,
    storyStatus: storyStatusSchema,
    publicationStatus: publicationStatusSchema,
    publishedAt: contentTimestampSchema.nullable(),
    version: contentVersionSchema,
    createdAt: contentTimestampSchema,
    updatedAt: contentTimestampSchema,
    categories: z.array(adminCategorySchema),
  })
  .strict();

export const adminChapterPageSchema = z
  .object({
    id: contentIdSchema,
    position: positiveIntegerSchema,
  })
  .strict();

export const adminChapterSchema = z
  .object({
    id: contentIdSchema,
    workId: contentIdSchema,
    number: positiveIntegerSchema,
    contentType: chapterContentTypeSchema,
    publicationStatus: publicationStatusSchema,
    publishedAt: contentTimestampSchema.nullable(),
    version: contentVersionSchema,
    createdAt: contentTimestampSchema,
    updatedAt: contentTimestampSchema,
    textContent: structuredTextDocumentSchema.nullable(),
    pages: z.array(adminChapterPageSchema),
  })
  .strict();

export const publicWorkDataSchema = z
  .object({ work: publicWorkSchema })
  .strict();
export const publicChapterDataSchema = z
  .object({ chapter: publicChapterSchema })
  .strict();
export const adminCategoryDataSchema = z
  .object({ category: adminCategorySchema })
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
export const adminWorkListDataSchema = listDataSchema(adminWorkSchema);
export const adminChapterListDataSchema = listDataSchema(adminChapterSchema);

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
export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;
export type UpdateCategoryBody = z.infer<typeof updateCategoryBodySchema>;
export type CreateWorkBody = z.infer<typeof createWorkBodySchema>;
export type UpdateWorkBody = z.infer<typeof updateWorkBodySchema>;
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
export type AdminWork = z.infer<typeof adminWorkSchema>;
export type AdminChapter = z.infer<typeof adminChapterSchema>;
export type PublicationTransition = z.infer<typeof publicationTransitionSchema>;

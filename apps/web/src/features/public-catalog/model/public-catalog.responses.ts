import { SafePublicCatalogError } from "./public-catalog.errors";
import { z } from "zod";
import {
  catalogDetailDataSchema,
  catalogChapterSchema,
  publicChapterListDataSchema,
  publicChapterDataSchema,
  paginationMetaSchema,
  type PublicChapter,
  type CatalogChapter,
  type CatalogDetailData,
  catalogHomeDataSchema,
  catalogSitemapDataSchema,
  successEnvelopeSchema,
  catalogWorkListResponseSchema,
  catalogCategoryListResponseSchema,
} from "@fury/contracts";

const singleEnvelope = successEnvelopeSchema.safeExtend({
  statusCode: z.literal(200),
  paginationMeta: z.never().optional(),
});

const projectChapter = (chapter: PublicChapter): CatalogChapter => ({
  number: chapter.number,
  title: chapter.title,
  contentType: chapter.contentType,
  publishedAt: chapter.publishedAt,
});

export const chapterPageSchema = z.strictObject({
  items: z.array(catalogChapterSchema).max(25),
  pagination: paginationMetaSchema.safeExtend({ limit: z.literal(25) }),
});

export const publicCatalogResponses = {
  sitemap: singleEnvelope
    .safeExtend({ data: catalogSitemapDataSchema })
    .transform((response) => response.data),
  detail: singleEnvelope
    .safeExtend({ data: catalogDetailDataSchema })
    .transform((response) => response.data),
  chapter: singleEnvelope
    .safeExtend({ data: publicChapterDataSchema })
    .transform((response) => projectChapter(response.data.chapter)),
  chapters: successEnvelopeSchema
    .safeExtend({
      statusCode: z.literal(200),
      data: publicChapterListDataSchema,
    })
    .refine(
      (response) =>
        response.paginationMeta === undefined ||
        paginationMetaSchema
          .keyof()
          .options.every(
            (key) =>
              response.paginationMeta?.[key] === response.data.pagination[key],
          ),
      { message: "Chapter pagination must match." },
    )
    .transform((response) => ({
      items: response.data.items.map(projectChapter),
      pagination: response.data.pagination,
    }))
    .pipe(chapterPageSchema),
  home: singleEnvelope
    .safeExtend({ data: catalogHomeDataSchema })
    .transform((response) => response.data),
  works: catalogWorkListResponseSchema.transform((response) => response.data),
  categories: catalogCategoryListResponseSchema.transform(
    (response) => response.data,
  ),
};

export const readPublicResult = <T>(
  schema: z.ZodType<T>,
  envelope: unknown,
  expectedPage: string | number | undefined,
): T => {
  const data = schema.parse(envelope);
  if (expectedPage !== undefined) {
    const pagination = paginationMetaSchema.safeParse(
      typeof data === "object" && data !== null && "pagination" in data
        ? data.pagination
        : undefined,
    );
    if (!pagination.success || pagination.data.page !== Number(expectedPage))
      throw new SafePublicCatalogError("INVALID_RESPONSE", 0);
  }
  return data;
};

export const publicDetailFor = (
  data: CatalogDetailData,
  workSlug: string,
): CatalogDetailData => {
  if (data.work.slug !== workSlug)
    throw new SafePublicCatalogError("INVALID_RESPONSE", 0);
  return data;
};
export const publicChapterFor = (
  data: CatalogChapter,
  number: number,
): CatalogChapter => {
  if (data.number !== number)
    throw new SafePublicCatalogError("INVALID_RESPONSE", 0);
  return data;
};

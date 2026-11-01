import {
  workSlugParamsSchema,
  catalogWorkListQuerySchema,
  catalogCategoryListQuerySchema,
  type CatalogWorkListQueryInput,
  type CatalogCategoryListQueryInput,
} from "@fury/contracts";

const canonicalSlug = (workSlug: string): string =>
  workSlugParamsSchema.parse({ workSlug }).workSlug;
const workKey = (workSlug: string) =>
  ["public-catalog", "work", canonicalSlug(workSlug)] as const;

export const publicCatalogKeys = {
  work: workKey,
  detail: (slug: string) => [...workKey(slug), "detail"] as const,
  chapters: (slug: string, page: number) =>
    [
      ...workKey(slug),
      "chapters",
      catalogWorkListQuerySchema.parse({ page }).page,
    ] as const,
  chapter: (slug: string, number: number) =>
    [...workKey(slug), "chapter", number] as const,
  image: (slug: string, kind: "cover" | "background") =>
    [...workKey(slug), "image", kind] as const,
  root: ["public-catalog"] as const,
  home: ["public-catalog", "home"] as const,
  works: (query: CatalogWorkListQueryInput) =>
    [
      "public-catalog",
      "works",
      catalogWorkListQuerySchema.parse(query),
    ] as const,
  categories: (query: CatalogCategoryListQueryInput) =>
    [
      "public-catalog",
      "categories",
      catalogCategoryListQuerySchema.parse(query),
    ] as const,
};

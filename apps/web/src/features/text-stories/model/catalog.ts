import type {
  TextContentType,
  TextWork,
  TextWorkStatus,
} from "../data/textStories";

export type TextCatalogSort =
  "default" | "title-asc" | "title-desc" | "updated" | "added";

export type TextCatalogQuery = Readonly<{
  q: string;
  category: string;
  status: "" | TextWorkStatus;
  type: "" | TextContentType;
  sort: TextCatalogSort;
  page: number;
}>;

export const TEXT_STORIES_PAGE_SIZE = 6;

const firstValue = (value: string | readonly string[] | undefined): string =>
  typeof value === "string" ? value : (value?.[0] ?? "");

export const parseCatalogQuery = (
  params: Record<string, string | string[] | undefined>,
): TextCatalogQuery => {
  const status = firstValue(params["status"]);
  const type = firstValue(params["type"]);
  const sort = firstValue(params["sort"]);
  const parsedPage = Number.parseInt(firstValue(params["page"]), 10);
  return {
    q: firstValue(params["q"]).trim(),
    category: firstValue(params["category"]),
    status:
      status === "ongoing" ||
      status === "completed" ||
      status === "hiatus" ||
      status === "archived"
        ? status
        : "",
    type: type === "novel" || type === "short-story" ? type : "",
    sort:
      sort === "title-asc" ||
      sort === "title-desc" ||
      sort === "updated" ||
      sort === "added"
        ? sort
        : "default",
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  };
};

const byArabicTitle = new Intl.Collator("ar", { sensitivity: "base" });

export const filterAndSortTextWorks = (
  works: readonly TextWork[],
  query: TextCatalogQuery,
): readonly TextWork[] => {
  const normalizedQuery = query.q.toLocaleLowerCase("ar");
  const filtered = works.filter((work) => {
    const matchesTitle =
      normalizedQuery.length === 0 ||
      work.title.toLocaleLowerCase("ar").includes(normalizedQuery) ||
      (work.englishTitle?.toLocaleLowerCase("en").includes(normalizedQuery) ??
        false);
    const matchesCategory =
      query.category.length === 0 ||
      work.categorySlugs.includes(query.category);
    const matchesStatus =
      query.status.length === 0 || work.status === query.status;
    const matchesType = query.type.length === 0 || work.type === query.type;
    return matchesTitle && matchesCategory && matchesStatus && matchesType;
  });

  return filtered.toSorted((left, right) => {
    if (query.sort === "title-asc")
      return byArabicTitle.compare(left.title, right.title);
    if (query.sort === "title-desc")
      return byArabicTitle.compare(right.title, left.title);
    if (query.sort === "updated")
      return right.updatedAt.localeCompare(left.updatedAt);
    if (query.sort === "added")
      return right.addedAt.localeCompare(left.addedAt);
    return right.rating === undefined
      ? 1
      : left.rating === undefined
        ? -1
        : right.rating - left.rating;
  });
};

export const catalogHref = (
  query: TextCatalogQuery,
  overrides: Partial<TextCatalogQuery>,
): string => {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  if (merged.category) params.set("category", merged.category);
  if (merged.status) params.set("status", merged.status);
  if (merged.type) params.set("type", merged.type);
  if (merged.sort !== "default") params.set("sort", merged.sort);
  if (merged.page > 1) params.set("page", String(merged.page));
  const search = params.toString();
  return search.length === 0 ? "/stories" : `/stories?${search}`;
};

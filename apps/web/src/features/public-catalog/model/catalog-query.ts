import {
  catalogCategoryListQuerySchema,
  positiveIntegerSchema,
  catalogWorkListQuerySchema,
  type CatalogCategoryListQuery,
  type CatalogWorkListQuery,
} from "@fury/contracts";

const workFields = ["q", "category", "type", "status", "sort", "page"] as const;
const categoryFields = ["q", "page"] as const;

const uniqueSelections = (search: string): Map<string, string> => {
  const values = new Map<string, string>();
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const part of search.replace(/^\?/u, "").split("&")) {
    const separator = part.indexOf("=");
    let key: string;
    try {
      key = decodeURIComponent(
        (separator === -1 ? part : part.slice(0, separator)).replace(
          /\+/gu,
          " ",
        ),
      );
    } catch {
      continue;
    }
    if (seen.has(key)) repeated.add(key);
    seen.add(key);
    try {
      const value = decodeURIComponent(
        (separator === -1 ? "" : part.slice(separator + 1)).replace(
          /\+/gu,
          " ",
        ),
      );
      values.set(key, value);
    } catch {
      /* Drop only the malformed selection. */
    }
  }
  for (const key of repeated) values.delete(key);
  return values;
};

export const publicQueryParameters = (
  query: Readonly<Record<string, string | number | undefined>>,
): URLSearchParams =>
  new URLSearchParams(
    Object.entries(query).flatMap(([key, value]) =>
      value === undefined ? [] : [[key, String(value)]],
    ),
  );

const catalogSearch = (query: CatalogWorkListQuery): string => {
  const params = publicQueryParameters(query);
  params.delete("view");
  if (query.sort === "newest") params.delete("sort");
  if (query.page === 1) params.delete("page");
  return new URLSearchParams(
    workFields.flatMap((key) =>
      params.has(key) ? [[key, params.get(key) ?? ""]] : [],
    ),
  ).toString();
};

export const normalizeCatalogSearch = (
  search: string,
  view: CatalogWorkListQuery["view"] = "all",
) => {
  const input: Record<string, string> = { view };
  for (const [key, value] of uniqueSelections(search))
    if (
      workFields.some((field) => field === key) &&
      catalogWorkListQuerySchema.safeParse({ view, [key]: value }).success
    )
      input[key] = value;
  const query = catalogWorkListQuerySchema.parse(input);
  return { query, search: catalogSearch(query) };
};

export const normalizeCategorySearch = (search: string) => {
  const input: Record<string, string> = {};
  for (const [key, value] of uniqueSelections(search))
    if (
      categoryFields.some((field) => field === key) &&
      catalogCategoryListQuerySchema.safeParse({ [key]: value }).success
    )
      input[key] = value;
  const query: CatalogCategoryListQuery =
    catalogCategoryListQuerySchema.parse(input);
  const params = publicQueryParameters(query);
  if (query.page === 1) params.delete("page");
  return {
    query,
    search: new URLSearchParams(
      categoryFields.flatMap((key) =>
        params.has(key) ? [[key, params.get(key) ?? ""]] : [],
      ),
    ).toString(),
  };
};

export const updateCatalogSelection = (
  query: CatalogWorkListQuery,
  changes: Partial<Omit<CatalogWorkListQuery, "view">>,
) => {
  const input = {
    ...query,
    ...changes,
    ...(Object.keys(changes).some((key) => key !== "page") ? { page: 1 } : {}),
  };
  return normalizeCatalogSearch(
    publicQueryParameters(input).toString(),
    query.view,
  );
};

export const parsePublicChapterSearch = (value: string): number | undefined => {
  const normalized = value.trim();
  if (!/^[0-9]{1,10}$/u.test(normalized)) return undefined;
  const parsed = positiveIntegerSchema.safeParse(Number(normalized));
  return parsed.success ? parsed.data : undefined;
};

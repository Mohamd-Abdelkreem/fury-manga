import type { CatalogWork, CatalogWorkListQuery } from "@fury/contracts";
import { publicQueryParameters, updateCatalogSelection } from "./catalog-query";

export const workTypeLabels: Record<CatalogWork["type"], string> = {
  manga: "مانجا",
  manhwa: "مانهوا",
  manhua: "مانها",
  comics: "كوميكس",
  novel: "رواية",
  "text-story": "قصة نصية",
};
export const storyStatusLabels: Record<CatalogWork["storyStatus"], string> = {
  ongoing: "مستمرة",
  completed: "مكتملة",
  hiatus: "متوقفة مؤقتًا",
  cancelled: "ملغاة",
};
export const catalogHref = (
  query: CatalogWorkListQuery,
  page = query.page,
): string => {
  const { search } = updateCatalogSelection(query, { page });
  const base = query.view === "stories" ? "/stories" : "/discover";
  return search === "" ? base : `${base}?${search}`;
};
export const routeSearch = (
  params: Record<string, string | string[] | undefined>,
): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") search.append(key, value);
    else if (value !== undefined)
      for (const entry of value) search.append(key, entry);
  }
  return search.toString();
};
export const categoryHref = (q: string | undefined, page: number): string => {
  const search = publicQueryParameters({
    q,
    page: page === 1 ? undefined : page,
  }).toString();
  return search === "" ? "/categories" : `/categories?${search}`;
};

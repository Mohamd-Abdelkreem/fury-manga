import type { DiscoverWork } from "../data/discoverData";

export type DiscoverSort = "default" | "title-asc" | "title-desc" | "latest";

export type DiscoverCatalogQuery = Readonly<{
  q: string;
  category: string;
  status: string;
  type: string;
  sort: DiscoverSort;
}>;

const firstValue = (value: string | readonly string[] | undefined): string =>
  typeof value === "string" ? value : (value?.[0] ?? "");

export function parseDiscoverQuery(
  params: Record<string, string | string[] | undefined>,
): DiscoverCatalogQuery {
  const sort = firstValue(params["sort"]);
  return {
    q: firstValue(params["q"]).trim(),
    category: firstValue(params["category"]),
    status: firstValue(params["status"]),
    type: firstValue(params["type"]),
    sort:
      sort === "title-asc" || sort === "title-desc" || sort === "latest"
        ? sort
        : "default",
  };
}

const titleCollator = new Intl.Collator(["ar", "en"], {
  sensitivity: "base",
});

export function filterDiscoverWorks(
  works: readonly DiscoverWork[],
  query: DiscoverCatalogQuery,
): readonly DiscoverWork[] {
  const search = query.q.toLocaleLowerCase();
  const filtered = works.filter((work) => {
    const matchesSearch =
      search.length === 0 || work.title.toLocaleLowerCase().includes(search);
    const matchesCategory =
      query.category.length === 0 || work.categories.includes(query.category);
    const matchesStatus =
      query.status.length === 0 || work.status === query.status;
    const matchesType = query.type.length === 0 || work.workType === query.type;
    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  return filtered.toSorted((left, right) => {
    if (query.sort === "title-asc")
      return titleCollator.compare(left.title, right.title);
    if (query.sort === "title-desc")
      return titleCollator.compare(right.title, left.title);
    if (query.sort === "latest")
      return right.updatedAt.localeCompare(left.updatedAt);
    return right.rating - left.rating;
  });
}

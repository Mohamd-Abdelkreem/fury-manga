import type { CategoryListQuery } from "@fury/contracts";

const actorKey = (actorId: string) => ["admin-content", actorId] as const;
const categoriesKey = (actorId: string) =>
  [...actorKey(actorId), "categories"] as const;
const categoryListScopeKey = (actorId: string) =>
  [...categoriesKey(actorId), "list"] as const;
const worksKey = (actorId: string) => [...actorKey(actorId), "works"] as const;
const workDetailScopeKey = (actorId: string) =>
  [...worksKey(actorId), "detail"] as const;

export const adminContentKeys = {
  actor: actorKey,
  categories: categoriesKey,
  categoryListScope: categoryListScopeKey,
  works: worksKey,
  workDetailScope: workDetailScopeKey,
  workDetail: (actorId: string, workId: string) =>
    [...workDetailScopeKey(actorId), workId] as const,
  categoryList: (actorId: string, query: CategoryListQuery) =>
    [...categoryListScopeKey(actorId), query] as const,
  categoryDetail: (actorId: string, categoryId: string) =>
    [...categoriesKey(actorId), "detail", categoryId] as const,
  categoryPicker: (actorId: string) =>
    [...categoriesKey(actorId), "picker"] as const,
};

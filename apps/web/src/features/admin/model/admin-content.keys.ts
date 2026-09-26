import type { AdminWorkListQuery, CategoryListQuery } from "@fury/contracts";

const actorKey = (actorId: string) => ["admin-content", actorId] as const;
const categoriesKey = (actorId: string) =>
  [...actorKey(actorId), "categories"] as const;
const categoryListScopeKey = (actorId: string) =>
  [...categoriesKey(actorId), "list"] as const;
const worksKey = (actorId: string) => [...actorKey(actorId), "works"] as const;
const workDetailScopeKey = (actorId: string) =>
  [...worksKey(actorId), "detail"] as const;
const workListScopeKey = (actorId: string) =>
  [...worksKey(actorId), "list"] as const;

export const adminContentKeys = {
  actor: actorKey,
  categories: categoriesKey,
  categoryListScope: categoryListScopeKey,
  works: worksKey,
  workDetailScope: workDetailScopeKey,
  workListScope: workListScopeKey,
  workList: (actorId: string, query: AdminWorkListQuery) =>
    [...workListScopeKey(actorId), query] as const,
  workDetail: (actorId: string, workId: string) =>
    [...workDetailScopeKey(actorId), workId] as const,
  categoryList: (actorId: string, query: CategoryListQuery) =>
    [...categoryListScopeKey(actorId), query] as const,
  categoryDetail: (actorId: string, categoryId: string) =>
    [...categoriesKey(actorId), "detail", categoryId] as const,
  categoryPicker: (actorId: string, page = 1, search = "") =>
    [...categoriesKey(actorId), "picker", { page, search }] as const,
};

import type { AdminCategory, CreateCategoryBody } from "@fury/contracts";

export const categoryMatchesCreateCommand = (
  category: AdminCategory,
  command: CreateCategoryBody,
): boolean =>
  category.id === command.id &&
  category.displayName === command.displayName &&
  category.slug === command.slug;

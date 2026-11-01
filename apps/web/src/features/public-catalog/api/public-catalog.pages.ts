import "server-only";
import type {
  CatalogCategoryListData,
  CatalogWorkListQuery,
  CatalogWorkListData,
} from "@fury/contracts";
import { publicCatalogServer } from "./public-catalog.server";
import { SafePublicCatalogError } from "../model/public-catalog.errors";

export const readCatalogPage = async (
  query: CatalogWorkListQuery,
): Promise<{
  seed?: CatalogWorkListData;
  categories?: CatalogCategoryListData;
  initialUnavailable: boolean;
}> => {
  try {
    const [seed, categories] = await Promise.all([
      publicCatalogServer.listWorks(query),
      publicCatalogServer.listCategories({ page: 1 }),
    ]);
    return { seed, categories, initialUnavailable: false };
  } catch (error) {
    if (!(error instanceof SafePublicCatalogError)) throw error;
    return { initialUnavailable: true };
  }
};

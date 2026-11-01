import { describe, expect, it } from "vitest";
import {
  normalizeCatalogSearch,
  updateCatalogSelection,
} from "@/features/public-catalog/model/catalog-query";
import {
  catalogHref,
  routeSearch,
} from "@/features/public-catalog/model/public-catalog.presentation";

describe("discovery URL authority", () => {
  it("preserves unknown category selection, resets page on filter change, and shares the next page", () => {
    const { query } = normalizeCatalogSearch(
      "category=disabled-saved&page=3&sort=title-asc",
    );
    expect(query.category).toBe("disabled-saved");
    expect(updateCatalogSelection(query, { q: "عمل" }).query.page).toBe(1);
    expect(catalogHref(query, 4)).toBe(
      "/discover?category=disabled-saved&sort=title-asc&page=4",
    );
  });
  it("retains repeated values until normalization rejects ambiguity", () => {
    const raw = routeSearch({
      q: ["first", "second"],
      page: "bad",
      category: "saved",
    });
    const { query } = normalizeCatalogSearch(raw);
    expect(query.q).toBeUndefined();
    expect(query.page).toBe(1);
    expect(query.category).toBe("saved");
  });
});

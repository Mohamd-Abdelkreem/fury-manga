import { parsePublicChapterSearch } from "./catalog-query";
import { describe, expect, it } from "vitest";

import {
  normalizeCatalogSearch,
  normalizeCategorySearch,
  updateCatalogSelection,
} from "./catalog-query";

describe("public URL selection", () => {
  it("normalizes saved query identity and survives URL reload", () => {
    const selection = normalizeCatalogSearch(
      "?q=+Cafe%CC%81+&category=Unknown-Category&page=002&sort=newest&extra=discard",
    );
    expect(selection.query).toEqual({
      view: "all",
      q: "Café",
      category: "unknown-category",
      sort: "newest",
      page: 2,
    });
    expect(selection.search).toBe(
      "q=Caf%C3%A9&category=unknown-category&page=2",
    );
    expect(normalizeCatalogSearch(selection.search)).toEqual(selection);
  });
  it("drops malformed/repeated/unsupported selections without broadening stories", () => {
    expect(
      normalizeCatalogSearch(
        "q=first&q=second&page=1001&type=manga&status=wrong&sort=rating&category=disabled",
        "stories",
      ),
    ).toEqual({
      query: { view: "stories", sort: "newest", page: 1, category: "disabled" },
      search: "category=disabled",
    });
    expect(normalizeCatalogSearch("q=%ZZ&page=2").query).toEqual({
      view: "all",
      sort: "newest",
      page: 2,
    });
    expect(normalizeCatalogSearch("q=valid&q=%ZZ").query).toEqual({
      view: "all",
      sort: "newest",
      page: 1,
    });
    expect(normalizeCatalogSearch("q=%00private&page=1.5").query).toEqual({
      view: "all",
      sort: "newest",
      page: 1,
    });
  });
  it("resets pages on changed filters and preserves explicit pagination", () => {
    const selection = normalizeCatalogSearch("category=unknown&page=9").query;
    expect(
      updateCatalogSelection(selection, { q: "Saved" }).query,
    ).toMatchObject({ q: "Saved", category: "unknown", page: 1 });
    expect(updateCatalogSelection(selection, { page: 3 }).search).toBe(
      "category=unknown&page=3",
    );
  });
  it("normalizes directory q/page independently", () => {
    expect(
      normalizeCategorySearch("q=+Action+&page=02&category=ignored"),
    ).toEqual({ query: { q: "Action", page: 2 }, search: "q=Action&page=2" });
    expect(normalizeCategorySearch("page=1&page=2&q=%ZZ")).toEqual({
      query: { page: 1 },
      search: "",
    });
  });
});

it.each([
  [" 01 ", 1],
  ["2147483647", 2147483647],
  ["0", undefined],
  ["2147483648", undefined],
  ["1e2", undefined],
  ["invalid", undefined],
] as const)("bounds exact chapter search %s", (input, expected) => {
  expect(parsePublicChapterSearch(input)).toBe(expected);
});

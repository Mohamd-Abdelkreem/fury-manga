import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TextStoriesListing } from "../components/TextStoriesListing/TextStoriesListing";
import { TEXT_WORKS } from "../data/textStories";
import {
  catalogHref,
  filterAndSortTextWorks,
  parseCatalogQuery,
  type TextCatalogQuery,
} from "./catalog";

const defaultQuery: TextCatalogQuery = {
  q: "",
  category: "",
  status: "",
  type: "",
  sort: "default",
  page: 1,
};

describe("text story catalog", () => {
  it.each([
    [{ q: "City of Amber" }, ["city-of-amber"]],
    [{ q: "قمر" }, ["paper-moon"]],
    [{ category: "mystery", status: "archived" }, ["archive-of-ash"]],
    [{ type: "short-story" }, ["paper-moon", "seventh-window"]],
  ] as const)("filters fixtures for %o", (overrides, expectedIds) => {
    const result = filterAndSortTextWorks(TEXT_WORKS, {
      ...defaultQuery,
      ...overrides,
    });
    expect(result.map((work) => work.id)).toEqual(
      expect.arrayContaining([...expectedIds]),
    );
    expect(result).toHaveLength(expectedIds.length);
  });

  it.each([
    ["updated", "clockmakers-daughter"],
    ["added", "silent-orchard"],
    ["title-asc", "ابنة صانع الساعات"],
    ["title-desc", "منارة عند آخر البحر"],
  ] as const)("sorts %s with the expected first work", (sort, expected) => {
    const result = filterAndSortTextWorks(TEXT_WORKS, {
      ...defaultQuery,
      sort,
    });
    expect(sort.startsWith("title") ? result[0]?.title : result[0]?.id).toBe(
      expected,
    );
  });

  it("preserves search and filters while changing pagination in the URL", () => {
    const query = parseCatalogQuery({
      q: "قمر",
      category: "fantasy",
      status: "completed",
      type: "short-story",
      sort: "updated",
      page: "2",
    });
    expect(catalogHref(query, { page: 3 })).toBe(
      "/stories?q=%D9%82%D9%85%D8%B1&category=fantasy&status=completed&type=short-story&sort=updated&page=3",
    );
  });

  it("renders real previous and next links for a paginated result", () => {
    render(<TextStoriesListing query={{ ...defaultQuery, page: 1 }} />);
    expect(
      screen.getByRole("heading", { name: "الروايات والقصص النصية" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("التصنيفات")).toHaveValue("");
    expect(screen.getByLabelText("الحالة")).toHaveValue("");
    expect(screen.getByLabelText("النوع")).toHaveValue("");
    expect(screen.getByLabelText("بحسب")).toHaveValue("default");
    expect(screen.getByRole("link", { name: "التالي" })).toHaveAttribute(
      "href",
      "/stories?page=2",
    );
    expect(
      screen.queryByRole("link", { name: "السابق" }),
    ).not.toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeCatalogSearch } from "@/features/public-catalog/model/catalog-query";
import { TextStoriesListing } from "../components/TextStoriesListing/TextStoriesListing";

const client = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
afterEach(() => {
  client.clear();
  vi.unstubAllGlobals();
});
describe("live stories selection", () => {
  it("restricts type choices to text and preserves saved/unknown category and search", () => {
    const { query } = normalizeCatalogSearch(
      "category=unknown&q=Mixed&sort=chapter-latest",
      "stories",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => new Promise(() => {})),
    );
    render(
      <QueryClientProvider client={client}>
        <TextStoriesListing
          query={query}
          categories={{
            items: [{ slug: "saved", displayName: "تصنيف محفوظ" }],
            pagination: {
              page: 1,
              limit: 24,
              total: 1,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          }}
        >
          <p>Server results</p>
        </TextStoriesListing>
      </QueryClientProvider>,
    );
    expect(screen.getByRole("combobox", { name: "التصنيفات" })).toHaveValue(
      "unknown",
    );
    expect(screen.getByRole("option", { name: "تصنيف محفوظ" })).toHaveValue(
      "saved",
    );
    expect(
      screen.queryByRole("option", { name: "مانجا" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "قصة نصية" })).toHaveValue(
      "text-story",
    );
    expect(screen.getByRole("combobox", { name: "بحسب" })).toHaveValue(
      "chapter-latest",
    );
    expect(
      screen.getByRole("button", { name: "البحث" }).closest("form"),
    ).toHaveAttribute("action", "/stories");
    expect(screen.getByDisplayValue("Mixed")).toHaveAttribute("name", "q");
  });
  it("resets unsubmitted controls when pagination navigates to a new URL identity", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => new Promise(() => {})),
    );
    const { query } = normalizeCatalogSearch("sort=chapter-latest", "stories");
    const view = (page: number) => (
      <QueryClientProvider client={client}>
        <TextStoriesListing query={{ ...query, page }}>
          <p>Results</p>
        </TextStoriesListing>
      </QueryClientProvider>
    );
    const { rerender } = render(view(1));
    fireEvent.change(screen.getByRole("combobox", { name: "بحسب" }), {
      target: { value: "title-desc" },
    });
    expect(screen.getByRole("combobox", { name: "بحسب" })).toHaveValue(
      "title-desc",
    );
    rerender(view(2));
    expect(screen.getByRole("combobox", { name: "بحسب" })).toHaveValue(
      "chapter-latest",
    );
  });
});

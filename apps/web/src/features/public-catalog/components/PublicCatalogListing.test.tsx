import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeCatalogSearch } from "../model/catalog-query";
import {
  publicDetailFixture,
  publicSuccessFixture,
} from "../api/public-catalog.test-helper";
import { imageBoundary } from "./public-image.test-helper";
import { PublicCatalogListing } from "./PublicCatalogListing";

beforeEach(() => {
  imageBoundary();
});
const clients: QueryClient[] = [];
afterEach(() => {
  vi.unstubAllGlobals();
  for (const client of clients.splice(0)) client.clear();
});
const renderListing = (search = "") => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(client);
  return render(
    <QueryClientProvider client={client}>
      <PublicCatalogListing query={normalizeCatalogSearch(search).query} />
    </QueryClientProvider>,
  );
};
const pagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};
const respond = (data: unknown) =>
  new Response(JSON.stringify(publicSuccessFixture(data)));
const stubCatalog = (works: () => Promise<Response> | Response) =>
  vi.stubGlobal("fetch", (input: RequestInfo | URL) => {
    const url = input instanceof Request ? input.url : String(input);
    return url.includes("/catalog/categories")
      ? Promise.resolve(
          respond({ items: [], pagination: { ...pagination, limit: 24 } }),
        )
      : works();
  });
describe("server authoritative catalog presentation", () => {
  it("distinguishes pending, failure and retry from an empty catalog", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 503 }))
      .mockImplementation(() =>
        Promise.resolve(
          new Response(
            JSON.stringify(publicSuccessFixture({ items: [], pagination })),
          ),
        ),
      );
    stubCatalog(fetchMock);
    renderListing();
    expect(
      screen.getByRole("heading", { name: "جارٍ تحميل المحتوى" }),
    ).toBeInTheDocument();
    fireEvent.click(
      await screen.findByRole("button", { name: "إعادة المحاولة" }),
    );
    expect(
      await screen.findByRole("heading", { name: "لا يوجد محتوى منشور الآن" }),
    ).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("0 نتيجة")).toHaveFocus());
  });
  it("returns keyboard focus to the error feedback when an explicit retry also fails", async () => {
    stubCatalog(() => Promise.resolve(new Response("{}", { status: 503 })));
    renderListing();
    const retry = await screen.findByRole("button", { name: "إعادة المحاولة" });
    retry.focus();
    fireEvent.click(retry);
    await waitFor(() =>
      expect(
        screen
          .getByRole("button", { name: "إعادة المحاولة" })
          .closest("[data-public-catalog-focus]"),
      ).toHaveFocus(),
    );
    expect(
      screen.queryByText("لا يوجد محتوى منشور الآن"),
    ).not.toBeInTheDocument();
  });
  it("uses server totals/page boundaries without local slicing or fabricated chapters", async () => {
    const {
      slug,
      title,
      alternativeTitle,
      type,
      storyStatus,
      publishedAt,
      categories,
      coverPath,
    } = publicDetailFixture().work;
    stubCatalog(() =>
      respond({
        items: [
          {
            slug,
            title,
            alternativeTitle,
            type,
            storyStatus,
            publishedAt,
            categories,
            coverPath,
          },
        ],
        pagination: {
          ...pagination,
          page: 2,
          total: 25,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      }),
    );
    renderListing("page=2&category=saved");
    await screen.findByRole("heading", { name: "Saved Work" });
    expect(screen.getByText("25 نتيجة")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "التالي" })).toHaveAttribute(
      "href",
      "/discover?category=saved&page=3",
    );
    expect(screen.getByRole("link", { name: "السابق" })).toHaveAttribute(
      "href",
      "/discover?category=saved",
    );
  });
  it.each([
    ["category=unknown", "لا توجد نتائج مطابقة"],
    ["page=9&category=saved", "لا توجد نتائج في هذه الصفحة"],
  ])("distinguishes %s", async (search, title) => {
    stubCatalog(() =>
      respond({
        items: [],
        pagination: {
          ...pagination,
          page: search.includes("9") ? 9 : 1,
          total: search.includes("9") ? 25 : 0,
          totalPages: search.includes("9") ? 3 : 0,
          hasPreviousPage: search.includes("9"),
        },
      }),
    );
    renderListing(search);
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument(),
    );
    if (search.includes("9")) {
      expect(
        screen.queryByRole("link", { name: "السابق" }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "العودة للقائمة" }),
      ).toHaveAttribute("href", "/discover?category=saved");
    }
  });
});

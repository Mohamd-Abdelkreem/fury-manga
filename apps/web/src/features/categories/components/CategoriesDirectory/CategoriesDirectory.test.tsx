import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { publicSuccessFixture } from "@/features/public-catalog/api/public-catalog.test-helper";
import { CategoriesDirectory } from "./CategoriesDirectory";

const clients: QueryClient[] = [];
afterEach(() => {
  vi.unstubAllGlobals();
  for (const client of clients.splice(0)) client.clear();
});
const pagination = {
  page: 1,
  limit: 24 as const,
  total: 2,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};
const renderDirectory = (q?: string) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(client);
  return render(
    <QueryClientProvider client={client}>
      <CategoriesDirectory
        query={{ page: 1, ...(q === undefined ? {} : { q }) }}
      />
    </QueryClientProvider>,
  );
};
describe("persisted category directory", () => {
  it("keeps server order and immutable discovery links without invented descriptions", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(
            JSON.stringify(
              publicSuccessFixture({
                items: [
                  { slug: "second", displayName: "ثانٍ" },
                  { slug: "first", displayName: "أول" },
                ],
                pagination,
              }),
            ),
          ),
        ),
      ),
    );
    renderDirectory();
    const links = await screen.findAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/discover?category=second",
      "/discover?category=first",
    ]);
    const search = screen.getByRole("searchbox", {
      name: "ابحث في أسماء التصنيفات",
    });
    search.focus();
    expect(search).toHaveFocus();
    expect(search).toHaveAttribute("name", "q");
    expect(search.closest("form")).toHaveAttribute("method", "get");
    expect(
      screen.getAllByText("استكشف الأعمال المنشورة في هذا التصنيف"),
    ).toHaveLength(2);
  });
  it("keeps URL search selected and distinguishes failed reads from filtered empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response("{}", { status: 503 }))
        .mockImplementation(() =>
          Promise.resolve(
            new Response(
              JSON.stringify(
                publicSuccessFixture({
                  items: [],
                  pagination: { ...pagination, total: 0, totalPages: 0 },
                }),
              ),
            ),
          ),
        ),
    );
    renderDirectory("غموض");
    expect(screen.getByRole("searchbox")).toHaveValue("غموض");
    const retry = await screen.findByRole("button", { name: "إعادة المحاولة" });
    retry.focus();
    fireEvent.click(retry);
    await screen.findByRole("heading", { name: "لا توجد نتائج مطابقة" });
    expect(screen.getByRole("searchbox")).toHaveValue("غموض");
    await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
    expect(
      screen.queryByText("لا يوجد محتوى منشور الآن"),
    ).not.toBeInTheDocument();
  });
});

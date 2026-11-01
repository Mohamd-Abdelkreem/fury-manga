import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { catalogDetailDataSchema } from "@fury/contracts";
import {
  publicDetailFixture,
  publicSuccessFixture,
} from "@/features/public-catalog/api/public-catalog.test-helper";
import {
  imageBoundary,
  imageResponse,
} from "@/features/public-catalog/components/public-image.test-helper";
import { TextWorkDetails } from "./TextWorkDetails";

beforeEach(() => {
  imageBoundary();
  vi.stubGlobal("fetch", () => Promise.resolve(imageResponse()));
});
const clients: QueryClient[] = [];
afterEach(() => {
  for (const client of clients.splice(0)) client.clear();
  vi.unstubAllGlobals();
});
const renderDetail = (detail = publicDetailFixture()) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(client);
  return render(
    <QueryClientProvider client={client}>
      <TextWorkDetails detail={detail} />
    </QueryClientProvider>,
  );
};
describe("persisted work detail", () => {
  it.each(["manga", "novel"] as const)(
    "shows saved %s fields without invented optional values, engagement or reader links",
    (type) => {
      const detail = publicDetailFixture();
      detail.work.type = type;
      detail.work.alternativeTitle = "عنوان بديل";
      detail.work.tags = ["saved", "عربي"];
      const { container } = renderDetail(detail);
      expect(
        screen.getByRole("heading", { level: 1, name: "Saved Work" }),
      ).toHaveAttribute("dir", "auto");
      expect(screen.getByText("Saved Author")).toBeInTheDocument();
      expect(screen.getByText("عنوان بديل")).toBeInTheDocument();
      expect(screen.getByText("saved، عربي")).toBeInTheDocument();
      expect(screen.queryByText("الرسام")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "الحفظ لاحقًا" }),
      ).toBeDisabled();
      expect(container.querySelector('a[href*="/chapter/"]')).toBeNull();
      expect(container.querySelector('[class*="ratingBox"]')).toBeNull();
      expect(
        screen.queryByRole("textbox", { name: /تعليق/ }),
      ).not.toBeInTheDocument();
    },
  );
  it("does not invent first/latest for a work with zero eligible chapters", () => {
    const detail = publicDetailFixture();
    detail.chapters = {
      items: [],
      pagination: { ...detail.chapters.pagination, total: 0, totalPages: 0 },
    };
    detail.firstChapter = null;
    detail.latestChapter = null;
    renderDetail(detail);
    expect(screen.getByText("لا توجد فصول منشورة")).toBeInTheDocument();
    expect(screen.queryByText("الفصل الأول")).not.toBeInTheDocument();
  });
  it("uses full-set latest beyond the first bounded page and recovers image failure", async () => {
    const original = publicDetailFixture();
    const chapters = Array.from({ length: 27 }, (_, index) => ({
      ...original.chapters.items[0],
      number: index + 1,
      title: `Chapter ${String(index + 1)}`,
    }));
    const detail = catalogDetailDataSchema.parse({
      ...original,
      chapters: {
        items: chapters.slice(0, 25),
        pagination: {
          ...original.chapters.pagination,
          total: 27,
          totalPages: 2,
          hasNextPage: true,
        },
      },
      latestChapter: chapters.at(-1),
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((request: Request) =>
        request.url.endsWith("/cover")
          ? Promise.resolve(imageResponse())
          : Promise.resolve(
              new Response(
                JSON.stringify(
                  publicSuccessFixture({
                    items: chapters.slice(25).map((chapter) => ({
                      ...chapter,
                      id: crypto.randomUUID(),
                      workId: crypto.randomUUID(),
                    })),
                    pagination: {
                      page: 2,
                      limit: 25,
                      total: 27,
                      totalPages: 2,
                      hasNextPage: false,
                      hasPreviousPage: true,
                    },
                  }),
                ),
              ),
            ),
      ),
    );
    renderDetail(detail);
    expect(screen.getByText("الفصل الجديد").parentElement).toHaveTextContent(
      "فصل 27",
    );
    fireEvent.click(screen.getByRole("button", { name: "الفصول التالية" }));
    await screen.findByText("Chapter 27");
    expect(
      within(screen.getByRole("list")).getAllByRole("listitem"),
    ).toHaveLength(2);
    fireEvent.error(screen.getByRole("img", { name: "Saved Work" }));
    fireEvent.click(screen.getByRole("button", { name: "إعادة تحميل الصورة" }));
    expect(
      await screen.findByRole("img", { name: "Saved Work" }),
    ).toBeInTheDocument();
  });
  it("normalizes chapter whitespace and never reuses chapter one for invalid search", async () => {
    const chapter = {
      ...publicDetailFixture().chapters.items[0],
      id: crypto.randomUUID(),
      workId: crypto.randomUUID(),
      title: "Exact numbered chapter",
    };
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockImplementation((request: Request) =>
          Promise.resolve(
            request.url.endsWith("/cover")
              ? imageResponse()
              : new Response(JSON.stringify(publicSuccessFixture({ chapter }))),
          ),
        ),
    );
    renderDetail();
    const search = screen.getByRole("searchbox", { name: "بحث عن فصل برقمه" });
    fireEvent.change(search, { target: { value: " 01 " } });
    await screen.findByText("Exact numbered chapter");
    expect(
      screen.queryByRole("heading", { name: "جارٍ تحميل المحتوى" }),
    ).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: "invalid" } });
    await screen.findByText("أدخل رقم فصل صحيحًا");
    expect(
      screen.queryByText("Exact numbered chapter"),
    ).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: " " } });
    await screen.findByText("Saved Chapter");
    expect(
      screen.queryByRole("heading", { name: "جارٍ تحميل المحتوى" }),
    ).not.toBeInTheDocument();
  });
});

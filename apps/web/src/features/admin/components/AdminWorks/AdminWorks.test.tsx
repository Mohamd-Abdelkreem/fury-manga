import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminWorkListItem, AdminWorkListQuery } from "@fury/contracts";

import { AdminWorks } from "./AdminWorks";
import { adminContentKeys } from "../../model/admin-content.keys";

const apiMock = vi.hoisted(() => ({
  listWorks: vi.fn(),
  transitionWork: vi.fn(),
}));
const sessionMock = vi.hoisted(() => ({
  role: "ADMIN",
  id: "11111111-1111-4111-8111-111111111111",
}));

vi.mock("../../api/admin-content.api", () => ({
  SafeAdminContentError: class extends Error {},
  adminContentApi: apiMock,
}));
vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({
    data: {
      user: {
        id: sessionMock.id,
        role: sessionMock.role,
        status: "ACTIVE",
        emailVerifiedAt: "2026-09-25T10:00:00.000Z",
      },
    },
    status: "success",
    error: null,
  }),
}));
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const savedWork: AdminWorkListItem = {
  id: "22222222-2222-4222-8222-222222222222",
  title: "عمل محفوظ",
  alternativeTitle: "Saved Work",
  slug: "saved-work",
  type: "manga",
  storyStatus: "ongoing",
  publicationStatus: "draft",
  publishedAt: null,
  featuredHome: false,
  featuredOrder: null,
  coverAssetId: null,
  chapterCount: 0,
  version: 2,
  createdAt: "2026-09-25T10:00:00.000Z",
  updatedAt: "2026-09-25T10:00:00.000Z",
};
let queryClient: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  vi.resetAllMocks();
  sessionMock.role = "ADMIN";
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  apiMock.listWorks.mockImplementation((query: AdminWorkListQuery) => {
    const matches =
      query.search || query.publicationStatus === "archived" ? [] : [savedWork];
    return Promise.resolve({
      items: matches,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: matches.length,
        totalPages: matches.length ? 1 : 0,
        hasNextPage: false,
        hasPreviousPage: query.page > 1,
      },
    });
  });
});

describe("saved administrative works", () => {
  it("shows the collection empty message before any filters", async () => {
    apiMock.listWorks.mockResolvedValue({
      items: [],
      pagination: {
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
    render(<AdminWorks />, { wrapper });
    expect(await screen.findByText("لا توجد أعمال محفوظة")).toBeInTheDocument();
    expect(screen.queryByText("لا توجد أعمال مطابقة")).not.toBeInTheDocument();
  });
  it("shows saved IDs and an honest filtered empty state", async () => {
    render(<AdminWorks />, { wrapper });
    expect(screen.getByRole("status")).toHaveTextContent("تحميل الأعمال");
    expect(
      await screen.findByRole("link", { name: "فتح بيانات عمل محفوظ" }),
    ).toHaveAttribute("href", `/admin/works/${savedWork.id}/edit`);
    expect(screen.getByText("٠")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "البحث عن عمل" }), {
      target: { value: "مفقود" },
    });
    expect(await screen.findByText("لا توجد أعمال مطابقة")).toBeInTheDocument();
    expect(screen.queryByText("عمل محفوظ")).not.toBeInTheDocument();
  });

  it("sends combined filters and a server sort with page reset", async () => {
    render(<AdminWorks />, { wrapper });
    await screen.findByText("عمل محفوظ");
    fireEvent.change(screen.getByLabelText("نوع العمل:"), {
      target: { value: "manga" },
    });
    fireEvent.change(screen.getByLabelText("حالة النشر:"), {
      target: { value: "draft" },
    });
    fireEvent.change(screen.getByLabelText("الترتيب:"), {
      target: { value: "chapters" },
    });
    await waitFor(() => {
      expect(apiMock.listWorks).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 1,
          type: "manga",
          publicationStatus: "draft",
          sort: "chapters",
        }),
        expect.any(AbortSignal),
      );
    });
  });

  it("does not replace unavailable data with fixtures and allows retry", async () => {
    apiMock.listWorks.mockRejectedValueOnce(new Error("unavailable"));
    render(<AdminWorks />, { wrapper });
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("عمل محفوظ")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "إعادة المحاولة" }));
    expect(await screen.findByText("عمل محفوظ")).toBeInTheDocument();
  });

  it("moves between server pages without reusing the previous page's rows", async () => {
    apiMock.listWorks.mockImplementation((query: AdminWorkListQuery) =>
      Promise.resolve({
        items: [
          {
            ...savedWork,
            id:
              query.page === 1
                ? savedWork.id
                : "33333333-3333-4333-8333-333333333333",
            title: query.page === 1 ? "الصفحة الأولى" : "الصفحة الثانية",
          },
        ],
        pagination: {
          page: query.page,
          limit: query.limit,
          total: 26,
          totalPages: 2,
          hasNextPage: query.page === 1,
          hasPreviousPage: query.page === 2,
        },
      }),
    );
    render(<AdminWorks />, { wrapper });
    await screen.findByText("الصفحة الأولى");
    fireEvent.click(screen.getByRole("button", { name: "الصفحة التالية" }));
    expect(await screen.findByText("الصفحة الثانية")).toBeInTheDocument();
    expect(screen.queryByText("الصفحة الأولى")).not.toBeInTheDocument();
    expect(apiMock.listWorks).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2, limit: 25 }),
      expect.any(AbortSignal),
    );
  });

  it("hides private list data when the current actor loses ADMIN access", async () => {
    const view = render(<AdminWorks />, { wrapper });
    await screen.findByText("عمل محفوظ");
    sessionMock.role = "USER";
    view.rerender(<AdminWorks />);
    expect(
      screen.getByText("يلزم حساب مدير نشط وموثق لعرض الأعمال."),
    ).toBeInTheDocument();
    expect(screen.queryByText("عمل محفوظ")).not.toBeInTheDocument();
  });

  it("keeps keyboard focus in the status confirmation and returns it on Escape", async () => {
    render(<AdminWorks />, { wrapper });
    await screen.findByText("عمل محفوظ");
    const publish = screen.getByRole("button", { name: "نشر عمل محفوظ" });
    publish.focus();
    fireEvent.click(publish);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "تأكيد" })).toHaveFocus();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(publish).toHaveFocus();
  });

  it("labels a background refresh while retaining the confirmed Work row", async () => {
    const refresh = Promise.withResolvers<unknown>();
    apiMock.listWorks
      .mockResolvedValueOnce({
        items: [savedWork],
        pagination: {
          page: 1,
          limit: 25,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      })
      .mockReturnValueOnce(refresh.promise);
    render(<AdminWorks />, { wrapper });
    await screen.findByText("عمل محفوظ");
    void queryClient.invalidateQueries({
      queryKey: adminContentKeys.works(sessionMock.id),
    });
    expect(
      await screen.findByText("جارٍ تحديث النتائج المحفوظة…"),
    ).toBeInTheDocument();
    expect(screen.getByText("عمل محفوظ")).toBeInTheDocument();
    refresh.resolve({
      items: [savedWork],
      pagination: {
        page: 1,
        limit: 25,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });
});

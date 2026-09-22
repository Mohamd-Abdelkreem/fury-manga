import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminChapters } from "./AdminChapters";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/works/trait-hoarder/chapters",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminChapters Component", () => {
  it("renders parent work summary and chapter list", () => {
    render(
      <AdminDataProvider>
        <AdminChapters workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    // Parent work title
    expect(screen.getAllByText("سمة المكتنز").length).toBeGreaterThan(0);
    // Breadcrumbs
    expect(screen.getByText("إدارة الفصول")).toBeInTheDocument();
    // Chapters in table
    expect(screen.getByText("المعركة الحاسمة في القبو المظلم")).toBeInTheDocument();
    expect(screen.getByText("#43")).toBeInTheDocument();
  });

  it("supports searching chapters by number or title", () => {
    render(
      <AdminDataProvider>
        <AdminChapters workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    const searchInput = screen.getByRole("searchbox", {
      name: "البحث عن فصل",
    });

    // Search for chapter title "استيقاظ"
    fireEvent.change(searchInput, { target: { value: "استيقاظ" } });

    expect(screen.getByText("استيقاظ السمة النادرة")).toBeInTheDocument();
    expect(
      screen.queryByText("المعركة الحاسمة في القبو المظلم"),
    ).not.toBeInTheDocument();
  });

  it("filters chapters by publication status", () => {
    render(
      <AdminDataProvider>
        <AdminChapters workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    const filterSelect = screen.getByRole("combobox", {
      name: "تصفية الفصول حسب الحالة",
    });
    fireEvent.change(filterSelect, { target: { value: "draft" } });

    // Chapter 44 is draft in trait-hoarder fixtures
    expect(screen.getByText("ما بعد الانهيار الكبير")).toBeInTheDocument();
    expect(screen.getByText("#44")).toBeInTheDocument();
    // Chapter 43 is published, should not be visible
    expect(
      screen.queryByText("المعركة الحاسمة في القبو المظلم"),
    ).not.toBeInTheDocument();
  });

  it("opens confirmation dialog when clicking unpublish on a published chapter", () => {
    render(
      <AdminDataProvider>
        <AdminChapters workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    const unpublishBtn = screen.getByRole("button", {
      name: "إلغاء نشر الفصل 43",
    });
    fireEvent.click(unpublishBtn);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("تأكيد إلغاء نشر الفصل")).toBeInTheDocument();

    // Confirm unpublish
    const confirmBtn = screen.getByRole("button", { name: "إلغاء النشر" });
    fireEvent.click(confirmBtn);

    // Dialog closes
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("handles non-existent workId gracefully with an error state", () => {
    render(
      <AdminDataProvider>
        <AdminChapters workId="non-existent-work-id" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("العمل المطلوب غير موجود")).toBeInTheDocument();
    expect(screen.getByText("العودة لقائمة الأعمال")).toBeInTheDocument();
  });
});

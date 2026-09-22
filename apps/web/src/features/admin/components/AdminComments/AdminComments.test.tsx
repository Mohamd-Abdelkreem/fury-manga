import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminComments } from "./AdminComments";

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
  usePathname: () => "/admin/comments",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminComments Component", () => {
  it("renders comments metrics, filter controls, and comment rows", () => {
    render(
      <AdminDataProvider>
        <AdminComments />
      </AdminDataProvider>,
    );

    // Metrics cards
    expect(screen.getByText("إجمالي التعليقات")).toBeInTheDocument();
    expect(screen.getByText("تعليقات نشطة")).toBeInTheDocument();
    expect(screen.getByText("تعليقات محجوبة")).toBeInTheDocument();
    expect(screen.getByText("تعليقات تم الإبلاغ عنها")).toBeInTheDocument();

    // Filters
    expect(screen.getByLabelText("بحث في التعليقات")).toBeInTheDocument();
    expect(screen.getByLabelText("تصفية حسب الحالة")).toBeInTheDocument();
    expect(screen.getByLabelText("تصفية حسب البلاغات")).toBeInTheDocument();
    expect(screen.getByLabelText("تصفية حسب العمل")).toBeInTheDocument();

    // Fixture comments content
    expect(screen.getByText(/فصل استثنائي بكل المقاييس/)).toBeInTheDocument();
  });

  it("filters comments by search query matching content or author", () => {
    render(
      <AdminDataProvider>
        <AdminComments />
      </AdminDataProvider>,
    );

    const searchInput = screen.getByLabelText("بحث في التعليقات");
    fireEvent.change(searchInput, { target: { value: "حرق الأحداث" } });

    expect(
      screen.getByText(/حرق الأحداث: في نهاية الرواية البطل سيموت/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/فصل استثنائي بكل المقاييس/),
    ).not.toBeInTheDocument();
  });

  it("filters comments by visibility status", () => {
    render(
      <AdminDataProvider>
        <AdminComments />
      </AdminDataProvider>,
    );

    const statusFilter = screen.getByLabelText("تصفية حسب الحالة");
    fireEvent.change(statusFilter, { target: { value: "hidden" } });

    // Should display the hidden fixture comment
    expect(
      screen.getByText(
        /هذا الموقع مليء بالإعلانات المزعجة والمترجمين يسرقون الأعمال/,
      ),
    ).toBeInTheDocument();
    // Visible comment should be filtered out
    expect(
      screen.queryByText(/فصل استثنائي بكل المقاييس/),
    ).not.toBeInTheDocument();
  });

  it("filters comments by reported status", () => {
    render(
      <AdminDataProvider>
        <AdminComments />
      </AdminDataProvider>,
    );

    const reportedFilter = screen.getByLabelText("تصفية حسب البلاغات");
    fireEvent.change(reportedFilter, { target: { value: "reported_only" } });

    // Comments with reportCount > 0
    expect(
      screen.getByText(/حرق الأحداث: في نهاية الرواية البطل سيموت/),
    ).toBeInTheDocument();
    // Comment with 0 reports should be excluded
    expect(
      screen.queryByText(/فصل استثنائي بكل المقاييس/),
    ).not.toBeInTheDocument();
  });

  it("opens quick hide modal, provides reason, and confirms hiding", () => {
    render(
      <AdminDataProvider>
        <AdminComments />
      </AdminDataProvider>,
    );

    // Find the quick hide buttons
    const hideButtons = screen.getAllByTitle("إخفاء التعليق عن القراء");
    const firstHideBtn = hideButtons[0];
    expect(firstHideBtn).toBeDefined();
    if (firstHideBtn) {
      fireEvent.click(firstHideBtn);
    }

    // Modal opens
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("تأكيد إخفاء التعليق")).toBeInTheDocument();

    const reasonInput = screen.getByPlaceholderText(
      "سبب الإخفاء (اختياري: سب، حرق، إعلان...)",
    );
    fireEvent.change(reasonInput, {
      target: { value: "مخالف لسياسة المجتمع والنشر" },
    });

    const confirmBtn = within(dialog).getByRole("button", {
      name: "إخفاء التعليق",
    });
    fireEvent.click(confirmBtn);

    // Dialog closes
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens comment details modal and allows viewing and closing", () => {
    render(
      <AdminDataProvider>
        <AdminComments />
      </AdminDataProvider>,
    );

    const detailsButtons = screen.getAllByTitle("عرض التفاصيل");
    const firstDetailsBtn = detailsButtons[0];
    expect(firstDetailsBtn).toBeDefined();
    if (firstDetailsBtn) {
      fireEvent.click(firstDetailsBtn);
    }

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("تفاصيل التعليق")).toBeInTheDocument();

    // Close button
    const closeButtons = screen.getAllByRole("button", { name: "إغلاق" });
    const firstCloseBtn = closeButtons[0];
    expect(firstCloseBtn).toBeDefined();
    if (firstCloseBtn) {
      fireEvent.click(firstCloseBtn);
    }

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

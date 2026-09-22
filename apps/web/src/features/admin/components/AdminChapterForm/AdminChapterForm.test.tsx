import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminChapterForm } from "./AdminChapterForm";

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

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/works/trait-hoarder/chapters/new",
  useRouter: () => ({ push: mockPush }),
}));

describe("AdminChapterForm Component", () => {
  it("renders create chapter form with breadcrumbs and work title", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("إضافة فصل جديد")).toBeInTheDocument();
    expect(screen.getAllByText("سمة المكتنز").length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/رقم الفصل/)).toBeInTheDocument();
    expect(screen.getByLabelText(/عنوان الفصل/)).toBeInTheDocument();
  });

  it("handles publication status change", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    const statusSelect = screen.getByLabelText(/حالة النشر/);
    fireEvent.change(statusSelect, { target: { value: "published" } });

    expect(statusSelect).toHaveValue("published");
  });

  it("renders illustrated manga pages editor for manga works", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("صفحات الفصل المصور")).toBeInTheDocument();
    expect(screen.getByText("إضافة صفحة تجريبية")).toBeInTheDocument();
    expect(screen.getByText("حذف الكل")).toBeInTheDocument();
  });

  it("adds, reorders, and deletes pages in illustrated mode", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    const addPageBtn = screen.getByText("إضافة صفحة تجريبية");
    fireEvent.click(addPageBtn);

    // Initial dummy pages were 2, now should be 3
    expect(screen.getByText("3 صفحات")).toBeInTheDocument();

    // Delete a page
    const deleteButtons = screen.getAllByTitle("حذف الصفحة");
    expect(deleteButtons.length).toBe(3);
    const firstDeleteBtn = deleteButtons[0];
    expect(firstDeleteBtn).toBeDefined();
    if (firstDeleteBtn) {
      fireEvent.click(firstDeleteBtn);
    }

    expect(screen.getByText("2 صفحات")).toBeInTheDocument();
  });

  it("renders text novel editor when work is a novel", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="city-of-amber" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("محتوى الفصل النصي")).toBeInTheDocument();
    expect(screen.getByLabelText("نص الفصل")).toBeInTheDocument();
    expect(screen.getByText(/إحصائيات النص:/)).toBeInTheDocument();
  });

  it("opens and closes chapter preview modal", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    const previewBtn = screen.getByRole("button", { name: /معاينة القارئ/ });
    fireEvent.click(previewBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/نمط القارئ المباشر/)).toBeInTheDocument();

    const closeButtons = screen.getAllByRole("button", { name: "إغلاق المعاينة" });
    const firstCloseBtn = closeButtons[0];
    expect(firstCloseBtn).toBeDefined();
    if (firstCloseBtn) {
      fireEvent.click(firstCloseBtn);
    }

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("populates existing chapter data in edit mode", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="trait-hoarder" chapterId="th-43" />
      </AdminDataProvider>,
    );

    expect(screen.getByDisplayValue("المعركة الحاسمة في القبو المظلم")).toBeInTheDocument();
    expect(screen.getByDisplayValue("43")).toBeInTheDocument();
  });

  it("submits the form successfully and renders success message", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    const titleInput = screen.getByLabelText(/عنوان الفصل/);
    fireEvent.change(titleInput, { target: { value: "فصل اختباري جديد" } });

    const submitBtn = screen.getByRole("button", { name: /حفظ ونشر/ });
    fireEvent.click(submitBtn);

    expect(screen.getByText("تم إنشاء الفصل بنجاح وإضافته لقائمة الفصول.")).toBeInTheDocument();
  });

  it("renders not found state when workId does not exist", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="invalid-work-id" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("العمل غير موجود")).toBeInTheDocument();
  });
});

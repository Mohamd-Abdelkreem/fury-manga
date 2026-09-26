import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider, useAdminData } from "../../context/admin-context";
import { AdminChapterForm } from "./AdminChapterForm";

function ChapterCountProbe() {
  const { getChapters } = useAdminData();
  return (
    <output data-testid="chapter-count">
      {getChapters("trait-hoarder").length}
    </output>
  );
}

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

vi.mock("@/features/media/components/AdminMediaCandidatePicker", () => ({
  AdminMediaCandidatePicker: ({ label }: { label: string }) => (
    <input aria-label={label} type="file" />
  ),
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
    expect(screen.getByLabelText("رفع صفحة مصورة مرشحة")).toBeInTheDocument();
    screen.getByLabelText("رفع صفحة مصورة مرشحة").focus();
    expect(screen.getByLabelText("رفع صفحة مصورة مرشحة")).toHaveFocus();
    expect(screen.getByText("حذف الكل")).toBeInTheDocument();
  });

  it("reorders and deletes fixture pages without claiming the uploaded candidate is saved", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="trait-hoarder" />
      </AdminDataProvider>,
    );

    const deleteButtons = screen.getAllByTitle("حذف الصفحة");
    expect(deleteButtons.length).toBe(2);
    const firstDeleteBtn = deleteButtons[0];
    expect(firstDeleteBtn).toBeDefined();
    if (firstDeleteBtn) {
      fireEvent.click(firstDeleteBtn);
    }

    expect(screen.getByText("1 صفحة")).toBeInTheDocument();
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

    const closeButtons = screen.getAllByRole("button", {
      name: "إغلاق المعاينة",
    });
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

    expect(
      screen.getByDisplayValue("المعركة الحاسمة في القبو المظلم"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("43")).toBeInTheDocument();
  });

  it("submits the form successfully and renders success message", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="trait-hoarder" />
        <ChapterCountProbe />
      </AdminDataProvider>,
    );

    const initialCount = Number(
      screen.getByTestId("chapter-count").textContent,
    );

    const titleInput = screen.getByLabelText(/عنوان الفصل/);
    fireEvent.change(titleInput, { target: { value: "فصل اختباري جديد" } });

    const submitBtn = screen.getByRole("button", { name: /حفظ ونشر/ });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/المعاينة المحلية فقط/)).toBeInTheDocument();
    expect(screen.getByTestId("chapter-count")).toHaveTextContent(
      String(initialCount + 1),
    );
  });

  it.each(["", "0", "-1", "44.5"])(
    "rejects chapter number %s without losing the title draft",
    (invalidNumber) => {
      render(
        <AdminDataProvider>
          <AdminChapterForm workId="trait-hoarder" />
        </AdminDataProvider>,
      );
      const numberInput = screen.getByLabelText(/رقم الفصل/);
      const titleInput = screen.getByLabelText(/عنوان الفصل/);
      fireEvent.change(numberInput, { target: { value: invalidNumber } });
      fireEvent.change(titleInput, { target: { value: "مسودة لم تحفظ" } });
      fireEvent.click(screen.getByRole("button", { name: /حفظ ونشر/ }));

      expect(
        screen.getByText("يجب إدخال رقم فصل صحيح أكبر من صفر."),
      ).toBeInTheDocument();
      expect(titleInput).toHaveValue("مسودة لم تحفظ");
      expect(mockPush).not.toHaveBeenCalled();
    },
  );

  it("renders not found state when workId does not exist", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="invalid-work-id" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("العمل غير موجود")).toBeInTheDocument();
  });

  it("does not offer persistent page binding for fixture chapter identities", () => {
    render(
      <AdminDataProvider>
        <AdminChapterForm workId="trait-hoarder" chapterId="th-43" />
      </AdminDataProvider>,
    );
    expect(
      screen.queryByRole("button", { name: /bind page|ربط الصفحة/iu }),
    ).not.toBeInTheDocument();
  });
});

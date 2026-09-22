import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminContact } from "./AdminContact";

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
  usePathname: () => "/admin/contact",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminContact Component", () => {
  it("renders contact inbox metrics, filter controls, and messages table", () => {
    render(
      <AdminDataProvider>
        <AdminContact />
      </AdminDataProvider>,
    );

    // Metrics
    expect(screen.getByText("رسائل جديدة غير مقروءة")).toBeInTheDocument();
    expect(screen.getAllByText("قيد المتابعة").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText("تمت معالجتها")).toBeInTheDocument();
    expect(screen.getByText("رسائل مؤرشفة")).toBeInTheDocument();

    // Controls
    expect(screen.getByLabelText("بحث في رسائل التواصل")).toBeInTheDocument();
    expect(screen.getByLabelText("تصفية حسب الحالة")).toBeInTheDocument();
    expect(screen.getByLabelText("تصفية حسب نوع المرسل")).toBeInTheDocument();
    expect(screen.getByLabelText("تصفية حسب التصنيف")).toBeInTheDocument();

    // Fixture messages
    expect(screen.getByText("عمر الفاروق")).toBeInTheDocument();
    expect(
      screen.getByText("طلب انضمام لفريق الترجمة والتبييض"),
    ).toBeInTheDocument();
  });

  it("filters messages by search query matching sender or subject", () => {
    render(
      <AdminDataProvider>
        <AdminContact />
      </AdminDataProvider>,
    );

    const searchInput = screen.getByLabelText("بحث في رسائل التواصل");
    fireEvent.change(searchInput, { target: { value: "وسم تصنيف" } });

    expect(
      screen.getByText("اقتراح إضافة وسم تصنيف جديد للروايات"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("طلب انضمام لفريق الترجمة والتبييض"),
    ).not.toBeInTheDocument();
  });

  it("filters messages by status", () => {
    render(
      <AdminDataProvider>
        <AdminContact />
      </AdminDataProvider>,
    );

    const statusFilter = screen.getByLabelText("تصفية حسب الحالة");
    fireEvent.change(statusFilter, { target: { value: "unread" } });

    expect(
      screen.getByText("طلب انضمام لفريق الترجمة والتبييض"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("اقتراح إضافة وسم تصنيف جديد للروايات"),
    ).not.toBeInTheDocument();
  });

  it("filters messages by sender type", () => {
    render(
      <AdminDataProvider>
        <AdminContact />
      </AdminDataProvider>,
    );

    const senderFilter = screen.getByLabelText("تصفية حسب نوع المرسل");
    fireEvent.change(senderFilter, { target: { value: "registered" } });

    expect(
      screen.getByText("اقتراح إضافة وسم تصنيف جديد للروايات"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("طلب انضمام لفريق الترجمة والتبييض"),
    ).not.toBeInTheDocument();
  });

  it("toggles read status of an unread message", () => {
    render(
      <AdminDataProvider>
        <AdminContact />
      </AdminDataProvider>,
    );

    const markReadButtons = screen.getAllByTitle("تعيين كمقروءة");
    const firstBtn = markReadButtons[0];
    expect(firstBtn).toBeDefined();
    if (firstBtn) {
      fireEvent.click(firstBtn);
    }

    // Unread count decreases or toggles to "تعيين كغير مقروءة"
    expect(
      screen.getAllByTitle("تعيين كغير مقروءة").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("archives a contact message", () => {
    render(
      <AdminDataProvider>
        <AdminContact />
      </AdminDataProvider>,
    );

    const archiveButtons = screen.getAllByTitle("أرشفة الرسالة");
    const initialArchiveBtnCount = archiveButtons.length;
    const firstArchiveBtn = archiveButtons[0];
    expect(firstArchiveBtn).toBeDefined();
    if (firstArchiveBtn) {
      fireEvent.click(firstArchiveBtn);
    }

    // Now one less message eligible for archiving (since it's already archived)
    const remainingArchiveButtons = screen.getAllByTitle("أرشفة الرسالة");
    expect(remainingArchiveButtons.length).toBe(initialArchiveBtnCount - 1);
  });
});

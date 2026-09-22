import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminReports } from "./AdminReports";

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
  usePathname: () => "/admin/reports",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminReports Component", () => {
  it("renders reports metrics, controls, and report rows", () => {
    render(
      <AdminDataProvider>
        <AdminReports />
      </AdminDataProvider>,
    );

    // Metrics cards
    expect(
      screen.getAllByText("قيد الانتظار (مفتوح)").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("قيد المراجعة").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByText("تمت المعالجة").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByText("تم الرفض").length).toBeGreaterThanOrEqual(1);

    // Search and filter controls
    expect(screen.getByLabelText("بحث في البلاغات")).toBeInTheDocument();
    expect(screen.getByLabelText("تصفية حسب الحالة")).toBeInTheDocument();
    expect(screen.getByLabelText("تصفية حسب السبب")).toBeInTheDocument();

    // Fixture reports
    expect(screen.getByText(/قام بحرق نهاية القصة عمداً/)).toBeInTheDocument();
  });

  it("filters reports by search query matching reporter or description", () => {
    render(
      <AdminDataProvider>
        <AdminReports />
      </AdminDataProvider>,
    );

    const searchInput = screen.getByLabelText("بحث في البلاغات");
    fireEvent.change(searchInput, { target: { value: "تعليق مستفز" } });

    expect(
      screen.getByText(/تعليق مستفز يقلل من مجهود الفريق/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/قام بحرق نهاية القصة عمداً/),
    ).not.toBeInTheDocument();
  });

  it("filters reports by status", () => {
    render(
      <AdminDataProvider>
        <AdminReports />
      </AdminDataProvider>,
    );

    const statusFilter = screen.getByLabelText("تصفية حسب الحالة");
    fireEvent.change(statusFilter, { target: { value: "under_review" } });

    // Under review report
    expect(
      screen.getByText(/إفساد المحتوى للجميع ودعوة لمقاطعة العمل/),
    ).toBeInTheDocument();
    // Open reports filtered out
    expect(
      screen.queryByText(/قام بحرق نهاية القصة عمداً/),
    ).not.toBeInTheDocument();
  });

  it("filters reports by reason", () => {
    render(
      <AdminDataProvider>
        <AdminReports />
      </AdminDataProvider>,
    );

    const reasonFilter = screen.getByLabelText("تصفية حسب السبب");
    fireEvent.change(reasonFilter, { target: { value: "spoiler" } });

    expect(screen.getByText(/قام بحرق نهاية القصة عمداً/)).toBeInTheDocument();
    expect(
      screen.queryByText(/تعليق مستفز يقلل من مجهود الفريق/),
    ).not.toBeInTheDocument();
  });

  it("opens details modal, allows starting review, and closing", () => {
    render(
      <AdminDataProvider>
        <AdminReports />
      </AdminDataProvider>,
    );

    const inspectButtons = screen.getAllByTitle("فحص المحتوى وتفاصيل البلاغ");
    const firstInspectBtn = inspectButtons[0];
    expect(firstInspectBtn).toBeDefined();
    if (firstInspectBtn) {
      fireEvent.click(firstInspectBtn);
    }

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/تفاصيل البلاغ/)).toBeInTheDocument();

    // Start review action
    const startReviewBtn = within(dialog).getByRole("button", {
      name: "نقل إلى قيد المراجعة",
    });
    fireEvent.click(startReviewBtn);

    // Close button
    const closeButtons = within(dialog).getAllByRole("button", {
      name: "إغلاق",
    });
    const firstCloseBtn = closeButtons[0];
    expect(firstCloseBtn).toBeDefined();
    if (firstCloseBtn) {
      fireEvent.click(firstCloseBtn);
    }

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("allows quick resolve from table to hide comment", () => {
    render(
      <AdminDataProvider>
        <AdminReports />
      </AdminDataProvider>,
    );

    const quickDeleteButtons = screen.getAllByTitle(
      "حذف التعليق المخالف فوراً",
    );
    expect(quickDeleteButtons.length).toBe(2);
    const firstDeleteBtn = quickDeleteButtons[0];
    expect(firstDeleteBtn).toBeDefined();
    if (firstDeleteBtn) {
      fireEvent.click(firstDeleteBtn);
    }

    const remainingButtons = screen.getAllByTitle("حذف التعليق المخالف فوراً");
    expect(remainingButtons.length).toBe(1);
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminWorks } from "./AdminWorks";

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
  usePathname: () => "/admin/works",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminWorks Component", () => {
  it("renders works table with fixture items and supports search", () => {
    render(
      <AdminDataProvider>
        <AdminWorks />
      </AdminDataProvider>,
    );

    // Verify fixture works rendered
    expect(screen.getByText("سمة المكتنز")).toBeInTheDocument();
    expect(screen.getByText("مدينة الكهرمان")).toBeInTheDocument();

    // Search for a specific work
    const searchInput = screen.getByRole("searchbox", {
      name: "البحث عن عمل",
    });
    fireEvent.change(searchInput, { target: { value: "الكهرمان" } });

    expect(screen.getByText("مدينة الكهرمان")).toBeInTheDocument();
    expect(screen.queryByText("سمة المكتنز")).not.toBeInTheDocument();
  });

  it("filters works by publication status", () => {
    render(
      <AdminDataProvider>
        <AdminWorks />
      </AdminDataProvider>,
    );

    const publishSelect = screen.getByLabelText("حالة النشر:");
    fireEvent.change(publishSelect, { target: { value: "draft" } });

    // In initial fixtures, "شفرة الشفق" is draft
    expect(screen.getByText("شفرة الشفق")).toBeInTheDocument();
    // "سمة المكتنز" is published, should not be shown
    expect(screen.queryByText("سمة المكتنز")).not.toBeInTheDocument();
  });

  it("opens confirmation dialog when unpublishing a published work", () => {
    render(
      <AdminDataProvider>
        <AdminWorks />
      </AdminDataProvider>,
    );

    // Find the unpublish button for "سمة المكتنز"
    const unpublishBtn = screen.getByRole("button", {
      name: "إلغاء نشر سمة المكتنز",
    });
    fireEvent.click(unpublishBtn);

    // Dialog should be open
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("تأكيد إلغاء نشر العمل")).toBeInTheDocument();

    // Click confirm in dialog
    const confirmBtn = screen.getByRole("button", { name: "إلغاء النشر" });
    fireEvent.click(confirmBtn);

    // Dialog should close
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

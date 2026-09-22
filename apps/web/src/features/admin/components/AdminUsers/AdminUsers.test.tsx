import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminUsers } from "./AdminUsers";

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

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    ...props
  }: {
    alt: string;
    src: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} {...props} />
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/users",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminUsers Component", () => {
  it("renders users list header, stat cards, and table", () => {
    render(
      <AdminDataProvider>
        <AdminUsers />
      </AdminDataProvider>,
    );

    expect(screen.getByText("إجمالي المستخدمين")).toBeInTheDocument();
    expect(screen.getByText("المستخدمين النشطين")).toBeInTheDocument();
    expect(screen.getByText("الحسابات الموقوفة")).toBeInTheDocument();

    // Verify initial users rendered from fixtures
    expect(screen.getByText("أحمد المنصور")).toBeInTheDocument();
    expect(screen.getByText("سارة العتيبي")).toBeInTheDocument();
    expect(screen.getByText("طارق النجار")).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "مشرف" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/نقاط/)).not.toBeInTheDocument();
  });

  it("filters users by text search", () => {
    render(
      <AdminDataProvider>
        <AdminUsers />
      </AdminDataProvider>,
    );

    const searchInput = screen.getByLabelText("البحث عن مستخدم");

    fireEvent.change(searchInput, { target: { value: "سارة" } });

    expect(screen.getByText("سارة العتيبي")).toBeInTheDocument();
    expect(screen.queryByText("أحمد المنصور")).not.toBeInTheDocument();
  });

  it("filters users by status", () => {
    render(
      <AdminDataProvider>
        <AdminUsers />
      </AdminDataProvider>,
    );

    const statusSelect = screen.getByRole("combobox", {
      name: "تصفية حسب الحالة",
    });

    // "طارق النجار" is suspended in fixtures
    fireEvent.change(statusSelect, { target: { value: "suspended" } });

    expect(screen.getByText("طارق النجار")).toBeInTheDocument();
    expect(screen.queryByText("سارة العتيبي")).not.toBeInTheDocument();
  });

  it("filters users by role", () => {
    render(
      <AdminDataProvider>
        <AdminUsers />
      </AdminDataProvider>,
    );

    const roleSelect = screen.getByRole("combobox", {
      name: "تصفية حسب الدور",
    });

    fireEvent.change(roleSelect, { target: { value: "admin" } });

    expect(screen.getByText("أحمد المنصور")).toBeInTheDocument();
    expect(screen.queryByText("سارة العتيبي")).not.toBeInTheDocument();
  });

  it("prevents suspending admin accounts", () => {
    render(
      <AdminDataProvider>
        <AdminUsers />
      </AdminDataProvider>,
    );

    // "أحمد المنصور" is admin
    const adminSuspendBtn = screen.getByRole("button", {
      name: "تعليق حساب أحمد المنصور",
    });

    expect(adminSuspendBtn).toBeDisabled();
    expect(adminSuspendBtn).toHaveAttribute(
      "title",
      "لا يمكن تعليق حسابات الإدارة",
    );
  });

  it("opens suspend dialog for regular user, confirms suspension and updates status", () => {
    render(
      <AdminDataProvider>
        <AdminUsers />
      </AdminDataProvider>,
    );

    // "كريم ممدوح" is regular active user
    const suspendBtn = screen.getByRole("button", {
      name: "تعليق حساب كريم ممدوح",
    });
    fireEvent.click(suspendBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("تأكيد تعليق حساب المستخدم")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "تأكيد التعليق" });
    fireEvent.click(confirmBtn);

    // Dialog closes
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Status banner appears
    expect(screen.getByText("تم تعليق الحساب")).toBeInTheDocument();
  });

  it("reactivates a suspended user directly", () => {
    render(
      <AdminDataProvider>
        <AdminUsers />
      </AdminDataProvider>,
    );

    // "طارق النجار" is initially suspended
    const reactivateBtn = screen.getByRole("button", {
      name: "إلغاء تعليق طارق النجار",
    });
    fireEvent.click(reactivateBtn);

    expect(screen.getByText("استعادة النشاط")).toBeInTheDocument();
  });
});

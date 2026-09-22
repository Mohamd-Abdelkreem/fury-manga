import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminUserDetail } from "./AdminUserDetail";

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
  usePathname: () => "/admin/users/user-2",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminUserDetail Component", () => {
  it("renders user information, join date, and points balance", () => {
    render(
      <AdminDataProvider>
        <AdminUserDetail userId="user-2" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("سارة العتيبي")).toBeInTheDocument();
    expect(screen.getByText("sara.otaibi@example.com")).toBeInTheDocument();
    expect(screen.getByText("320")).toBeInTheDocument();
    expect(screen.getByText("نقاط المشاهدة المكتسبة")).toBeInTheDocument();
  });

  it("displays points read-only policy disclaimer", () => {
    render(
      <AdminDataProvider>
        <AdminUserDetail userId="user-2" />
      </AdminDataProvider>,
    );

    expect(
      screen.getByText(/لا يمثل رصيداً مالياً قابلاً للتعديل اليدوي/),
    ).toBeInTheDocument();
  });

  it("renders owned gifts and allows revoking an owned gift", () => {
    render(
      <AdminDataProvider>
        <AdminUserDetail userId="user-2" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("الهدايا التقديرية المملوكة")).toBeInTheDocument();

    // user-2 owns "حلقة اللهب"
    const revokeBtn = screen.getByRole("button", {
      name: "سحب هدية حلقة اللهب",
    });
    fireEvent.click(revokeBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("تأكيد سحب الهدية")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "تأكيد السحب" });
    fireEvent.click(confirmBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("تم سحب الهدية")).toBeInTheDocument();
  });

  it("allows suspending an active regular user", () => {
    render(
      <AdminDataProvider>
        <AdminUserDetail userId="user-2" />
      </AdminDataProvider>,
    );

    const suspendBtn = screen.getByRole("button", {
      name: "تعليق الحساب",
    });
    fireEvent.click(suspendBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const confirmBtn = screen.getByRole("button", { name: "تأكيد التعليق" });
    fireEvent.click(confirmBtn);

    expect(screen.getByText("تم تعليق الحساب")).toBeInTheDocument();
  });

  it("handles non-existent user with not found state", () => {
    render(
      <AdminDataProvider>
        <AdminUserDetail userId="non-existent-user" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("المستخدم غير موجود")).toBeInTheDocument();
    expect(screen.getByText("العودة لقائمة المستخدمين")).toBeInTheDocument();
  });
});

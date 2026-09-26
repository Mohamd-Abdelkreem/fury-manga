import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminDashboard } from "./AdminDashboard";

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
  usePathname: () => "/admin/dashboard",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminDashboard Component", () => {
  it("labels the four remaining summary cards as demo data", () => {
    render(
      <AdminDataProvider>
        <AdminDashboard />
      </AdminDataProvider>,
    );

    expect(screen.getByText("الفصول المنشورة (تجريبي)")).toBeInTheDocument();
    expect(screen.getByText("المستخدمون النشطون (تجريبي)")).toBeInTheDocument();
    expect(screen.getByText("البلاغات المفتوحة (تجريبي)")).toBeInTheDocument();
    expect(screen.getByText("رسائل التواصل (تجريبي)")).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link")
        .some((link) => link.getAttribute("href") === "/admin/contact"),
    ).toBe(true);
  });

  it("shows moderation notice when open reports exist and allows dismissal", () => {
    render(
      <AdminDataProvider>
        <AdminDashboard />
      </AdminDataProvider>,
    );

    const banner = screen.getByRole("alert");
    expect(banner).toBeInTheDocument();
    expect(
      screen.getByText("تنبيه تجريبي: بلاغات مفتوحة تحتاج للمراجعة"),
    ).toBeInTheDocument();

    // Dismiss banner
    const dismissBtn = screen.getByRole("button", { name: "إغلاق التنبيه" });
    fireEvent.click(dismissBtn);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not present fixture works, counts, or activity as saved content", () => {
    render(
      <AdminDataProvider>
        <AdminDashboard />
      </AdminDataProvider>,
    );

    expect(screen.queryByText("أحدث الأعمال")).not.toBeInTheDocument();
    expect(screen.queryByText("الأكثر قراءة")).not.toBeInTheDocument();
    expect(screen.queryByText("الأعمال المنشورة")).not.toBeInTheDocument();
    expect(screen.queryByText("الأعمال المسودة")).not.toBeInTheDocument();
    expect(screen.queryByText("إضافة عمل كمسودة")).not.toBeInTheDocument();
  });
});

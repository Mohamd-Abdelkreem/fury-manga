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
  it("renders all 6 metric summary cards with Arabic labels", () => {
    render(
      <AdminDataProvider>
        <AdminDashboard />
      </AdminDataProvider>,
    );

    expect(screen.getByText("الأعمال المنشورة")).toBeInTheDocument();
    expect(screen.getByText("الأعمال المسودة")).toBeInTheDocument();
    expect(screen.getByText("الفصول المنشورة")).toBeInTheDocument();
    expect(screen.getByText("المستخدمون النشطون")).toBeInTheDocument();
    expect(screen.getByText("البلاغات المفتوحة")).toBeInTheDocument();
    expect(screen.getByText("رسائل التواصل")).toBeInTheDocument();
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
      screen.getByText("تنبيه إشرافي: بلاغات مفتوحة تحتاج للمراجعة"),
    ).toBeInTheDocument();

    // Dismiss banner
    const dismissBtn = screen.getByRole("button", { name: "إغلاق التنبيه" });
    fireEvent.click(dismissBtn);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders recent works and trending works sections", () => {
    render(
      <AdminDataProvider>
        <AdminDashboard />
      </AdminDataProvider>,
    );

    // Recent works header and titles
    expect(screen.getByText("أحدث الأعمال")).toBeInTheDocument();
    expect(screen.getAllByText("سمة المكتنز").length).toBeGreaterThan(0);
    expect(screen.getAllByText("مدينة الكهرمان").length).toBeGreaterThan(0);

    // Most read / trending section
    expect(screen.getByText("الأكثر قراءة")).toBeInTheDocument();
    expect(screen.getAllByText("سيد الظلال الصاعد").length).toBeGreaterThan(0);

    // Primary action link
    expect(
      screen.getByRole("link", { name: "إنشاء عمل جديد" }),
    ).toHaveAttribute("href", "/admin/works/new");
  });
});

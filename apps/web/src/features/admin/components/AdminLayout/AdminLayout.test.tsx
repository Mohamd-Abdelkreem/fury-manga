import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminLayout } from "./AdminLayout";

let currentPath = "/admin/dashboard";

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
  usePathname: () => currentPath,
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminLayout Component", () => {
  beforeEach(() => {
    currentPath = "/admin/dashboard";
  });

  it("renders the FURY brand and navigation groups with correct active state", () => {
    render(
      <AdminDataProvider>
        <AdminLayout>
          <div>محتوى تجريبي</div>
        </AdminLayout>
      </AdminDataProvider>,
    );

    // Verify Brand
    expect(screen.getByText("URY")).toBeInTheDocument();
    expect(screen.getByText("لوحة الإدارة")).toBeInTheDocument();

    // Verify Main nav items
    const dashboardLink = screen.getByRole("link", { name: /لوحة التحكم/ });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("aria-current", "page");

    // Verify other nav items exist
    expect(screen.getByRole("link", { name: /الأعمال/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /المستخدمون/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /البلاغات/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /رسائل التواصل/ })).toBeInTheDocument();

    // Verify public site link
    expect(
      screen.getByRole("link", { name: /زيارة الموقع العام/ }),
    ).toHaveAttribute("href", "/");

    // Verify content rendered
    expect(screen.getByText("محتوى تجريبي")).toBeInTheDocument();
  });

  it("toggles the mobile sidebar menu and closes on Escape", () => {
    render(
      <AdminDataProvider>
        <AdminLayout>
          <div>محتوى</div>
        </AdminLayout>
      </AdminDataProvider>,
    );

    const toggleBtn = screen.getByRole("button", { name: "فتح القائمة" });
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

    // Open sidebar
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

    // Close on Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and closes notifications popover on toggle and Escape", () => {
    render(
      <AdminDataProvider>
        <AdminLayout>
          <div>محتوى</div>
        </AdminLayout>
      </AdminDataProvider>,
    );

    const notifBtn = screen.getByRole("button", { name: "الإشعارات الإدارية" });
    expect(notifBtn).toHaveAttribute("aria-expanded", "false");

    // Click to open popover
    fireEvent.click(notifBtn);
    expect(notifBtn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("التنبيهات الإدارية")).toBeInTheDocument();

    // Escape closes popover
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText("التنبيهات الإدارية")).not.toBeInTheDocument();
  });
});

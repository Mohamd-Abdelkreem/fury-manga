import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { WorkspaceShell } from "./workspace-shell";

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
  usePathname: () => "/dashboard",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/auth/session-loader", () => ({
  SessionLoader: () => <div>Loading session</div>,
}));

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useLogout: () => ({
    isPending: false,
    mutate: vi.fn(),
  }),
  useSession: () => ({
    data: {
      user: {
        fullName: "أحمد المنصور",
        email: "reader@fury.local",
        role: "USER",
      },
    },
  }),
}));

vi.mock("@/features/auth/utils/session-navigation", () => ({
  replaceWithLogin: vi.fn(),
}));

vi.mock("@/services/api/api-client", () => ({
  getApiError: vi.fn(),
}));

describe("WorkspaceShell Navigation & Shell UI", () => {
  it("renders sidebar navigation, brand logo, and user identity", () => {
    render(
      <WorkspaceShell>
        <div>Dashboard Content</div>
      </WorkspaceShell>,
    );

    expect(screen.getAllByText("لوحة الحساب").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("المكتبة والمحفوظات")).toBeInTheDocument();
    expect(screen.getByText("إعدادات الحساب")).toBeInTheDocument();
    expect(screen.getByText("العودة للموقع الرئيسي")).toBeInTheDocument();

    expect(screen.getAllByText("أحمد المنصور").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText("reader@fury.local")).toBeInTheDocument();
  });

  it("opens notification dropdown, displays notifications, and allows marking all read", () => {
    render(
      <WorkspaceShell>
        <div>Content</div>
      </WorkspaceShell>,
    );

    const bellBtn = screen.getByRole("button", { name: /الإشعارات/ });
    fireEvent.click(bellBtn);

    expect(screen.getByText("هدية جديدة")).toBeInTheDocument();
    expect(screen.getByText("فصل جديد")).toBeInTheDocument();

    const markAllBtn = screen.getByRole("button", {
      name: "تحديد الكل كمقروء",
    });
    fireEvent.click(markAllBtn);

    // After marking all read, the mark-all button disappears
    expect(
      screen.queryByRole("button", { name: "تحديد الكل كمقروء" }),
    ).not.toBeInTheDocument();
  });

  it("closes notifications on Escape and returns focus to the trigger", () => {
    render(
      <WorkspaceShell>
        <div>Content</div>
      </WorkspaceShell>,
    );

    const trigger = screen.getByRole("button", { expanded: false });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("opens mobile drawer and closes on escape key", () => {
    render(
      <WorkspaceShell>
        <div>Content</div>
      </WorkspaceShell>,
    );

    const menuBtn = screen.getByRole("button", {
      name: "فتح القائمة الجانبية",
    });
    fireEvent.click(menuBtn);

    // Sidebar should have sidebarOpen class or be visible
    const aside = screen.getByLabelText("شريط التنقل الجانبي");
    expect(aside.className).toContain("sidebarOpen");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(aside.className).not.toContain("sidebarOpen");
  });
});

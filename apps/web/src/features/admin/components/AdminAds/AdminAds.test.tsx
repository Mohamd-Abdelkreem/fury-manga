import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminAds } from "./AdminAds";

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

describe("AdminAds Component", () => {
  it("renders global switch, platform invariant points rules, and placements table", () => {
    render(
      <AdminDataProvider>
        <AdminAds />
      </AdminDataProvider>,
    );

    // Global switch card
    expect(
      screen.getByText("حالة الإعلانات العامة على مستوى المنصة"),
    ).toBeInTheDocument();
    expect(screen.getByText("مفعلة وتعمل للزوار")).toBeInTheDocument();

    // Invariant points rules
    expect(
      screen.getByText("قواعد نظام النقاط وبوابات الإعلانات"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ثوابت برمجية في بنية المنصة (للقراءة فقط)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("معدل اكتساب النقاط (لكل فصل)"),
    ).toBeInTheDocument();
    expect(screen.getByText("+3 نقاط")).toBeInTheDocument();
    expect(screen.getByText("عتبة طلب الإعلان الإلزامي")).toBeInTheDocument();
    expect(screen.getByText("9 نقاط")).toBeInTheDocument();
    expect(screen.getByText("استمرارية احتساب النقاط")).toBeInTheDocument();
    expect(screen.getByText("Adsterra Network")).toBeInTheDocument();

    // Table placements
    expect(
      screen.getByText("بانر الصفحة الرئيسية — الموضع العلوي"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("بوب أندر عتبة قراءة الفصول (9 نقاط)"),
    ).toBeInTheDocument();
  });

  it("opens confirmation dialog and toggles global ads switch", () => {
    render(
      <AdminDataProvider>
        <AdminAds />
      </AdminDataProvider>,
    );

    // Click global kill switch
    const toggleBtn = screen.getByRole("button", {
      name: /تعطيل الإعلانات العامة/,
    });
    fireEvent.click(toggleBtn);

    // Confirm dialog opens
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText("تأكيد تعطيل الإعلانات العامة"),
    ).toBeInTheDocument();

    // Confirm action
    const confirmBtn = within(dialog).getByRole("button", {
      name: "تعطيل فوراً",
    });
    fireEvent.click(confirmBtn);

    // Now global ads are disabled
    expect(screen.getByText("معطلة مؤقتاً")).toBeInTheDocument();
  });

  it("toggles individual placement enabled state", () => {
    render(
      <AdminDataProvider>
        <AdminAds />
      </AdminDataProvider>,
    );

    const toggleButtons = screen.getAllByTitle("تعطيل المساحة");
    const firstToggle = toggleButtons[0];
    expect(firstToggle).toBeDefined();
    if (firstToggle) {
      fireEvent.click(firstToggle);
    }

    // Now should show activate button for that disabled placement
    expect(screen.getAllByTitle("تفعيل المساحة").length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("opens placement edit dialog and saves modified snippet", () => {
    render(
      <AdminDataProvider>
        <AdminAds />
      </AdminDataProvider>,
    );

    const editButtons = screen.getAllByTitle("تعديل الشفرة والإعدادات");
    const firstEditBtn = editButtons[0];
    expect(firstEditBtn).toBeDefined();
    if (firstEditBtn) {
      fireEvent.click(firstEditBtn);
    }

    // Modal opens
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText("تعديل المساحة الإعلانية"),
    ).toBeInTheDocument();

    // Change snippet
    const snippetInput =
      within(dialog).getByPlaceholderText(/<script async src/);
    fireEvent.change(snippetInput, {
      target: {
        value:
          '<script type="text/javascript" src="//adsterra.example/banner-updated.js"></script>',
      },
    });

    const saveBtn = within(dialog).getByRole("button", {
      name: "حفظ التعديلات",
    });
    fireEvent.click(saveBtn);

    // Dialog closes
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens and closes AdBlock preview modal", () => {
    render(
      <AdminDataProvider>
        <AdminAds />
      </AdminDataProvider>,
    );

    const previewBtn = screen.getByRole("button", {
      name: /معاينة تنبيه مانع الإعلانات/,
    });
    fireEvent.click(previewBtn);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText(/معاينة رسالة تنبيه مانع الإعلانات/),
    ).toBeInTheDocument();

    // Close preview
    const closeBtn = within(dialog).getByRole("button", {
      name: "إغلاق المعاينة",
    });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

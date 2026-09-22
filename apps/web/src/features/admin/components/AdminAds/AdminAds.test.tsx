import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdminDataProvider } from "../../context/admin-context";
import { AdminAds } from "./AdminAds";

describe("AdminAds", () => {
  it("shows only the two approved banner placements and no obsolete rules", () => {
    render(
      <AdminDataProvider>
        <AdminAds />
      </AdminDataProvider>,
    );

    expect(screen.getByText("بانر الصفحة الرئيسية")).toBeInTheDocument();
    expect(screen.getByText("بانر صفحات التصفح")).toBeInTheDocument();
    expect(screen.getAllByText("Adsterra").length).toBeGreaterThan(0);
    expect(screen.queryByText(/نقاط|بوب|عتبة|script/i)).not.toBeInTheDocument();
    expect(screen.getAllByText("728 × 90")).toHaveLength(2);
  });

  it("confirms the global advertisement toggle", () => {
    render(
      <AdminDataProvider>
        <AdminAds />
      </AdminDataProvider>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "تعطيل الإعلانات العامة" }),
    );
    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "تعطيل الآن" }));
    expect(
      screen.getByText("معطلة مؤقتًا في جميع الصفحات المؤهلة."),
    ).toBeInTheDocument();
  });

  it("previews the shared non-blocking ad-block message", () => {
    render(
      <AdminDataProvider>
        <AdminAds />
      </AdminDataProvider>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /معاينة تنبيه مانع الإعلانات/ }),
    );
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("ساعد في دعم Fury")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "إعادة الفحص" }),
    ).toBeInTheDocument();
    const closeButton = within(dialog).getAllByRole("button", {
      name: "إغلاق المعاينة",
    })[0];
    expect(closeButton).toBeDefined();
    if (closeButton !== undefined) fireEvent.click(closeButton);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

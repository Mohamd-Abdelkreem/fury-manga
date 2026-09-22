import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdminCategories } from "./AdminCategories";

describe("AdminCategories", () => {
  it("filters categories and shows an empty state for unmatched searches", () => {
    render(<AdminCategories />);
    const search = screen.getByPlaceholderText("ابحث بالاسم أو الرابط…");

    fireEvent.change(search, { target: { value: "خيال" } });
    expect(screen.getByText("خيال")).toBeInTheDocument();
    expect(screen.queryByText("رومانسي")).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: "لا-يوجد" } });
    expect(
      screen.getByRole("heading", { name: "لا توجد تصنيفات مطابقة" }),
    ).toBeInTheDocument();
  });

  it("creates a category from the accessible dialog", () => {
    render(<AdminCategories />);
    fireEvent.click(screen.getByRole("button", { name: "إنشاء تصنيف" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("اسم التصنيف"), {
      target: { value: "غموض" },
    });
    fireEvent.change(within(dialog).getByLabelText("الرابط المختصر"), {
      target: { value: "mystery" },
    });
    fireEvent.click(
      within(dialog).getByRole("button", { name: "حفظ التصنيف" }),
    );

    expect(screen.getByText("غموض")).toBeInTheDocument();
  });

  it("edits an existing category", () => {
    render(<AdminCategories />);
    const categoryRow = screen.getByText("رومانسي").closest("tr");
    expect(categoryRow).not.toBeNull();
    if (categoryRow === null) return;

    fireEvent.click(within(categoryRow).getByRole("button", { name: "تعديل" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("اسم التصنيف"), {
      target: { value: "رومانسية" },
    });
    fireEvent.click(
      within(dialog).getByRole("button", { name: "حفظ التصنيف" }),
    );

    expect(screen.getByText("رومانسية")).toBeInTheDocument();
  });

  it("reorders categories with explicit controls", () => {
    render(<AdminCategories />);
    fireEvent.click(screen.getByRole("button", { name: "رفع ترتيب خيال" }));

    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows[1]).toHaveTextContent("خيال");
    expect(rows[2]).toHaveTextContent("أكشن");
  });

  it("requires confirmation before disabling a category with works", () => {
    render(<AdminCategories />);
    const categoryRow = screen.getByText("خيال").closest("tr");
    expect(categoryRow).not.toBeNull();
    if (categoryRow === null) return;

    fireEvent.click(within(categoryRow).getByRole("button", { name: "تعطيل" }));
    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByText(/سيظل الارتباط محفوظًا/),
    ).toBeInTheDocument();
    fireEvent.click(
      within(dialog).getByRole("button", { name: "تعطيل التصنيف" }),
    );

    expect(within(categoryRow).getByText("معطّل")).toBeInTheDocument();
  });
});

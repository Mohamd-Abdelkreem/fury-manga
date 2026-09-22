import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LibraryScreen } from "./LibraryScreen";

describe("LibraryScreen", () => {
  it("filters saved works by type and title without losing the library", () => {
    render(<LibraryScreen />);
    fireEvent.click(screen.getByRole("button", { name: /نصي/ }));
    expect(
      screen.getByRole("heading", { name: "مدينة الكهرمان" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Trait Hoarder" }),
    ).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "ابحث داخل المكتبة" }),
      {
        target: { value: "لا يطابق" },
      },
    );
    expect(screen.getByText("لا توجد أعمال مطابقة")).toBeInTheDocument();
  });

  it("marks archived work unavailable and disables its reading action", () => {
    render(<LibraryScreen />);
    const archivedCard = screen
      .getByRole("heading", { name: "أرشيف الرماد" })
      .closest("article");
    expect(archivedCard).not.toBeNull();
    expect(archivedCard?.querySelector("button[disabled]")).toHaveTextContent(
      "القراءة غير متاحة",
    );
    expect(archivedCard).toHaveTextContent("غير متاح حاليًا");
  });

  it("removes a bookmark locally and restores it through undo", () => {
    render(<LibraryScreen />);
    const card = screen
      .getByRole("heading", { name: "قمر من ورق" })
      .closest("article");
    const remove = card?.querySelector("button:not([disabled])");
    if (!(remove instanceof HTMLButtonElement))
      throw new Error("Remove action missing");
    fireEvent.click(remove);
    expect(
      screen.queryByRole("heading", { name: "قمر من ورق" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "تراجع" }));
    expect(
      screen.getByRole("heading", { name: "قمر من ورق" }),
    ).toBeInTheDocument();
  });

  it("shows a working explore destination when no bookmarks exist", () => {
    render(<LibraryScreen initialWorks={[]} />);
    expect(
      screen.getByRole("link", { name: "استكشاف المحتوى" }),
    ).toHaveAttribute("href", "/discover");
  });

  it("filters by status and clears search input via clear button", () => {
    render(<LibraryScreen />);

    // Filter by status "completed"
    fireEvent.change(screen.getByLabelText("تصفية بحسب حالة العمل"), {
      target: { value: "completed" },
    });
    expect(
      screen.getByRole("heading", { name: "قمر من ورق" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Trait Hoarder" }),
    ).not.toBeInTheDocument();

    // Reset status filter
    fireEvent.change(screen.getByLabelText("تصفية بحسب حالة العمل"), {
      target: { value: "all" },
    });

    // Type in search box and clear
    const searchInput = screen.getByRole("searchbox", {
      name: "ابحث داخل المكتبة",
    });
    fireEvent.change(searchInput, { target: { value: "الكهرمان" } });
    expect(searchInput).toHaveValue("الكهرمان");

    const clearBtn = screen.getByRole("button", { name: "مسح حقل البحث" });
    fireEvent.click(clearBtn);
    expect(searchInput).toHaveValue("");
  });

  it("toggles view mode between grid and list", () => {
    render(<LibraryScreen />);

    const listBtn = screen.getByRole("button", { name: "عرض قائمة" });
    fireEvent.click(listBtn);
    expect(listBtn).toHaveAttribute("aria-pressed", "true");

    const gridBtn = screen.getByRole("button", { name: "عرض شبكي" });
    fireEvent.click(gridBtn);
    expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    expect(listBtn).toHaveAttribute("aria-pressed", "false");
  });
});

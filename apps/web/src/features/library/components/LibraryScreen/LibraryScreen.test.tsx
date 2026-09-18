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
});

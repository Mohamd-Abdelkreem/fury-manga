import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PublicCatalogState } from "./PublicCatalogState";

describe("public recovery feedback", () => {
  it("announces pending without calling it empty", () => {
    render(<PublicCatalogState kind="loading" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(
      screen.queryByText("لا يوجد محتوى منشور الآن"),
    ).not.toBeInTheDocument();
  });
  it("offers a keyboard-focusable explicit retry after failure", () => {
    const retry = vi.fn();
    render(<PublicCatalogState kind="unavailable" onRetry={retry} />);
    const button = screen.getByRole("button", { name: "إعادة المحاولة" });
    button.focus();
    expect(button).toHaveFocus();
    fireEvent.click(button);
    expect(retry).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText("لا يوجد محتوى منشور الآن"),
    ).not.toBeInTheDocument();
  });
  it.each([
    ["empty", "لا يوجد محتوى منشور الآن"],
    ["filtered-empty", "لا توجد نتائج مطابقة"],
    ["out-of-range", "لا توجد نتائج في هذه الصفحة"],
    ["not-found", "العمل غير موجود"],
  ] as const)("distinguishes %s", (kind, title) => {
    render(<PublicCatalogState kind={kind} resetHref="/discover" />);
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/discover");
  });
});

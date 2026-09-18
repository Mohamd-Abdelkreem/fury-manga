import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoriesDirectory } from "./CategoriesDirectory";

describe("CategoriesDirectory", () => {
  it("filters Arabic category names and explains a filtered-empty result", () => {
    render(<CategoriesDirectory />);

    const search = screen.getByRole("searchbox", {
      name: "ابحث في أسماء التصنيفات",
    });
    fireEvent.change(search, { target: { value: "غموض" } });
    expect(screen.getByRole("link", { name: /غموض/ })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /أكشن/ }),
    ).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: "غير موجود" } });
    expect(screen.getByText("لا يوجد تصنيف مطابق")).toBeInTheDocument();
  });

  it("routes each category to the illustrated listing with its stable genre slug", () => {
    render(<CategoriesDirectory />);
    expect(screen.getByRole("link", { name: /أكشن/ })).toHaveAttribute(
      "href",
      "/discover?genre=action",
    );
  });
});

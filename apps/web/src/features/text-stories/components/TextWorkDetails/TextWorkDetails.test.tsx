import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getTextWorkById } from "../../data/textStories";
import { TextWorkDetails } from "./TextWorkDetails";

describe("text work details", () => {
  it.each([
    ["city-of-amber", "مدينة الكهرمان"],
    ["clockmakers-daughter", "ابنة صانع الساعات"],
    ["archive-of-ash", "أرشيف الرماد"],
  ])("resolves %s to its matching fixture", (id, expectedTitle) => {
    expect(getTextWorkById(id)?.title).toBe(expectedTitle);
  });

  it("returns no fixture for an unknown dynamic identifier", () => {
    expect(getTextWorkById("missing-work")).toBeUndefined();
  });

  it("uses the illustrated-work template with text-specific routes and labels", () => {
    const work = getTextWorkById("clockmakers-daughter");
    if (work === undefined) throw new Error("Fixture missing");
    render(<TextWorkDetails work={work} />);

    expect(
      screen.getByRole("heading", { name: "ابنة صانع الساعات", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("عمل نصي")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "خيال" })).toHaveAttribute(
      "href",
      "/stories?category=fantasy",
    );
    expect(screen.getByRole("link", { name: /الفصل الأول/ })).toHaveAttribute(
      "href",
      "/story/clockmakers-daughter/chapter/1",
    );

    fireEvent.change(
      screen.getByRole("textbox", { name: "بحث عن الفصول بالأرقام" }),
      { target: { value: "4" } },
    );
    const filteredChapterList = within(screen.getByRole("list"));
    expect(
      filteredChapterList.getByRole("link", { name: /فصل 04/ }),
    ).toBeInTheDocument();
    expect(
      filteredChapterList.queryByRole("link", { name: /فصل 01/ }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "حفظ في المكتبة" }));
    expect(
      screen.getByRole("button", { name: "مضاف للمفضلة" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps archived text chapters unavailable", () => {
    const work = getTextWorkById("archive-of-ash");
    if (work === undefined) throw new Error("Fixture missing");
    render(<TextWorkDetails work={work} />);
    expect(screen.getByText("لم يتم العثور على فصول")).toBeInTheDocument();
  });
});

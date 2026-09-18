import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { getTextWorkById } from "../../data/textStories";
import {
  DEFAULT_READER_PREFERENCES,
  READER_PREFERENCES_KEY,
  TextChapterReader,
  hasReachedCompletionThreshold,
} from "./TextChapterReader";

describe("TextChapterReader", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("navigates to the previous and next fixture chapters in reading order", () => {
    const work = getTextWorkById("city-of-amber");
    const chapter = work?.chapters[1];
    if (work === undefined || chapter === undefined)
      throw new Error("Fixture missing");
    render(<TextChapterReader work={work} chapter={chapter} />);
    expect(screen.getByRole("link", { name: /السابق: 1/ })).toHaveAttribute(
      "href",
      "/story/city-of-amber/chapter/1",
    );
    expect(screen.getByRole("link", { name: /التالي: 3/ })).toHaveAttribute(
      "href",
      "/story/city-of-amber/chapter/3",
    );
  });

  it("restores, changes, persists, and resets reader preferences", async () => {
    window.localStorage.setItem(
      READER_PREFERENCES_KEY,
      JSON.stringify({ fontSize: 22, lineHeight: 2.3 }),
    );
    const work = getTextWorkById("city-of-amber");
    const chapter = work?.chapters[0];
    if (work === undefined || chapter === undefined)
      throw new Error("Fixture missing");
    render(<TextChapterReader work={work} chapter={chapter} />);

    await screen.findByText("22px");
    fireEvent.click(screen.getByRole("button", { name: "تكبير حجم الخط" }));
    await waitFor(() => {
      expect(
        JSON.parse(window.localStorage.getItem(READER_PREFERENCES_KEY) ?? "{}"),
      ).toMatchObject({ fontSize: 23, lineHeight: 2.3 });
    });
    fireEvent.click(
      screen.getByRole("button", { name: "الإعدادات الافتراضية" }),
    );
    await waitFor(() => {
      expect(
        JSON.parse(window.localStorage.getItem(READER_PREFERENCES_KEY) ?? "{}"),
      ).toEqual(DEFAULT_READER_PREFERENCES);
    });
  });

  it("renders the supported rich-text fixture without injecting HTML", () => {
    const work = getTextWorkById("city-of-amber");
    const chapter = work?.chapters[0];
    if (work === undefined || chapter === undefined)
      throw new Error("Fixture missing");
    const { container } = render(
      <TextChapterReader work={work} chapter={chapter} />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: /الفصل 1:/ }),
    ).toBeInTheDocument();
    expect(container.querySelector("strong")).not.toBeNull();
    expect(container.querySelector("em")).not.toBeNull();
    expect(container.querySelector("blockquote")).not.toBeNull();
    expect(container.querySelector("ul")).not.toBeNull();
    expect(screen.getByRole("link", { name: "تفاصيل العمل" })).toHaveAttribute(
      "href",
      "/story/city-of-amber",
    );
  });

  it.each([
    [74, false],
    [75, true],
    [100, true],
  ])("treats %s percent completion as %s", (progress, expected) => {
    expect(hasReachedCompletionThreshold(progress)).toBe(expected);
  });
});

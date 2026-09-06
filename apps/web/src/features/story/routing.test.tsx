import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ChapterReadingPage from "@/app/story/[id]/chapter/[chapterId]/page";
import { ChapterList } from "./components/ChapterList/ChapterList";
import { STORY_DETAIL } from "./data/storyData";

const navigation = vi.hoisted(() => ({
  params: { id: "1", chapterId: "1" },
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => navigation.params,
  useRouter: () => ({ push: navigation.push }),
}));
vi.mock("@/features/home/components/Navbar/Navbar", () => ({
  Navbar: () => null,
}));
vi.mock("@/features/home/components/Footer/Footer", () => ({
  Footer: () => null,
}));
vi.mock("./components/CommentsSection/CommentsSection", () => ({
  CommentsSection: () => null,
}));

describe("story navigation", () => {
  beforeEach(() => {
    navigation.params = { id: "1", chapterId: "1" };
    navigation.push.mockClear();
  });

  it.each(["1", "trait-hoarder"])(
    "keeps chapter links under the current story %s",
    (storyId) => {
      render(<ChapterList {...STORY_DETAIL} storyId={storyId} />);
      const chapterLinks = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href")?.includes("/chapter/"));
      expect(chapterLinks).toHaveLength(STORY_DETAIL.chapters.length + 2);
      for (const link of chapterLinks) {
        expect(link.getAttribute("href")).toMatch(
          new RegExp(`^/story/${storyId}/chapter/\\d+$`),
        );
      }
      expect(screen.getByRole("link", { name: /الفصل الأول/ })).toHaveAttribute(
        "href",
        `/story/${storyId}/chapter/01`,
      );
      expect(
        screen.getByRole("link", { name: /الفصل الجديد/ }),
      ).toHaveAttribute("href", `/story/${storyId}/chapter/43`);
    },
  );

  it.each(["1", "01"])(
    "recognizes first chapter %s and navigates forward",
    (chapterId) => {
      navigation.params.chapterId = chapterId;
      render(<ChapterReadingPage />);
      expect(screen.getByTitle("الفصل السابق")).toBeDisabled();
      fireEvent.click(screen.getByTitle("الفصل التالي"));
      expect(navigation.push).toHaveBeenCalledWith("/story/1/chapter/02");
      for (const link of screen.getAllByRole("link", {
        name: "تفاصيل العمل",
      })) {
        expect(link).toHaveAttribute("href", "/story/1");
      }
    },
  );

  it("navigates in both directions while retaining the story slug", () => {
    navigation.params = { id: "trait-hoarder", chapterId: "2" };
    render(<ChapterReadingPage />);
    fireEvent.click(screen.getByTitle("الفصل السابق"));
    fireEvent.click(screen.getByTitle("الفصل التالي"));
    expect(navigation.push.mock.calls).toEqual([
      ["/story/trait-hoarder/chapter/01"],
      ["/story/trait-hoarder/chapter/3"],
    ]);
  });

  it("does not invent a previous chapter when the chapter is absent from the mock data", () => {
    navigation.params.chapterId = "120";
    render(<ChapterReadingPage />);
    expect(screen.getByTitle("الفصل السابق")).toBeDisabled();
    expect(screen.getByTitle("الفصل التالي")).toBeDisabled();
  });
});

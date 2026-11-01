import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ChapterReadingPage from "@/app/story/[id]/chapter/[chapterId]/page";
import { ChapterList } from "./components/ChapterList/ChapterList";
import { publicDetailFixture } from "@/features/public-catalog/api/public-catalog.test-helper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const navigation = vi.hoisted(() => ({
  params: { id: "1", chapterId: "1" },
  push: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => navigation.params,
  usePathname: () =>
    `/story/${navigation.params.id}/chapter/${navigation.params.chapterId}`,
  useRouter: () => ({ push: navigation.push, replace: navigation.replace }),
}));
vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({
    data: {
      user: {
        id: "1b3d904e-a46c-4dd8-9cb7-d0767546ea95",
        fullName: "Reader",
        email: "reader@example.com",
        role: "USER",
        status: "ACTIVE",
        emailVerifiedAt: "2026-08-18T00:00:00.000Z",
      },
    },
    error: null,
    isPending: false,
    isFetched: true,
    isError: false,
  }),
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

  it("keeps persisted work chapters informational and category links canonical", () => {
    const client = new QueryClient();
    const detail = publicDetailFixture("persisted-slug");
    const { container } = render(
      <QueryClientProvider client={client}>
        <ChapterList detail={detail} />
      </QueryClientProvider>,
    );
    expect(
      screen.getByRole("heading", { name: detail.work.title, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Action" })).toHaveAttribute(
      "href",
      "/discover?category=action",
    );
    expect(container.querySelector('a[href*="/chapter/"]')).toBeNull();
    expect(
      screen.getByText("القراءة غير متاحة بعد؛ هذه معلومات الفصول المنشورة."),
    ).toBeInTheDocument();
    client.clear();
  });

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

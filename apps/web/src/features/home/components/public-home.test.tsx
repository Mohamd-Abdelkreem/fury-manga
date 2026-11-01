import {
  render as baseRender,
  act,
  screen,
  fireEvent,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";
import { QueryClient } from "@tanstack/react-query";
import {
  imageBoundary,
  imageResponse,
  queryWrapper,
} from "@/features/public-catalog/components/public-image.test-helper";
import { HeroSection } from "./HeroSection/HeroSection";
import { LatestReleases } from "./LatestReleases/LatestReleases";
import { SuggestionsSection } from "./SuggestionsSection/SuggestionsSection";
import { DiscordBanner } from "./DiscordBanner/DiscordBanner";
import { publicDetailFixture } from "@/features/public-catalog/api/public-catalog.test-helper";

const clients: QueryClient[] = [];
const render = (element: ReactElement) => {
  const client = new QueryClient();
  clients.push(client);
  return baseRender(element, { wrapper: queryWrapper(client) });
};
const work = publicDetailFixture().work;
const chapter = publicDetailFixture().firstChapter!;
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  for (const client of clients.splice(0)) client.clear();
});
const motion = () =>
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
beforeEach(() => {
  motion();
  imageBoundary();
  vi.stubGlobal("fetch", () => Promise.resolve(imageResponse()));
});
describe("authoritative public home sections", () => {
  it("uses saved featured order and category shortcuts without an active reader or scores", () => {
    motion();
    const { container } = render(
      <HeroSection
        featured={[
          { ...work, slug: "first", title: "أول" },
          { ...work, slug: "second", title: "ثانٍ" },
        ]}
        categories={[{ slug: "saved", displayName: "محفوظ" }]}
      />,
    );
    expect(screen.getByRole("heading", { name: "أول" })).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "العمل المميز التالي" }),
    );
    expect(screen.getByRole("heading", { name: "ثانٍ" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "محفوظ" })).toHaveAttribute(
      "href",
      "/discover?category=saved",
    );
    expect(container.querySelector('a[href*="/chapter/"]')).toBeNull();
    expect(container.querySelector('[class*="ratingRow"]')).toBeNull();
  });
  it("identifies actual released chapters while keeping navigation informational", () => {
    const { container } = render(
      <LatestReleases releases={[{ work, chapter }]} />,
    );
    expect(
      screen.getByText(`فصل ${chapter.number} — ${chapter.title}`),
    ).toBeInTheDocument();
    expect(container.querySelector('a[href*="/chapter/"]')).toBeNull();
  });
  it("hides empty sections and optional community actions/counts", () => {
    render(
      <>
        <HeroSection featured={[]} categories={[]} />
        <LatestReleases releases={[]} />
        <SuggestionsSection suggestions={[]} />
        <DiscordBanner />
      </>,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(
      screen.getByText("رابط المجتمع غير متاح حاليًا."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/5000|382|متصل الآن/)).not.toBeInTheDocument();
  });
  it("opens a configured owner link without membership success", () => {
    render(
      <DiscordBanner communityUrl="https://community.example.test/fury" />,
    );
    expect(screen.getByRole("link", { name: /انضم الآن/ })).toHaveAttribute(
      "href",
      "https://community.example.test/fury",
    );
    expect(screen.queryByText(/تم الانضمام/)).not.toBeInTheDocument();
  });
  it("does not resume automatic featured rotation on mouse leave while a link retains focus", () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
    vi.stubGlobal("fetch", () => new Promise(() => {}));
    render(
      <HeroSection
        featured={[
          { ...work, slug: "first", title: "أول" },
          { ...work, slug: "second", title: "ثانٍ" },
        ]}
        categories={[]}
      />,
    );
    const link = screen.getByRole("link", { name: /تفاصيل العمل/ });
    act(() => {
      link.focus();
    });
    const section = link.closest("section");
    if (section === null) throw new Error("Featured section missing");
    fireEvent.mouseEnter(section);
    fireEvent.mouseLeave(section);
    act(() => {
      vi.advanceTimersByTime(14000);
    });
    expect(screen.getByRole("heading", { name: "أول" })).toBeInTheDocument();
    act(() => {
      link.blur();
    });
    act(() => {
      vi.advanceTimersByTime(7100);
    });
    expect(screen.getByRole("heading", { name: "ثانٍ" })).toBeInTheDocument();
  });
  it("retains real category shortcuts without inventing a featured work", () => {
    render(
      <HeroSection
        featured={[]}
        categories={[{ slug: "saved-category", displayName: "تصنيف محفوظ" }]}
      />,
    );
    expect(
      screen.getByRole("region", { name: "تصنيفات الأعمال" }),
    ).toContainElement(screen.getByRole("link", { name: "تصنيف محفوظ" }));
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

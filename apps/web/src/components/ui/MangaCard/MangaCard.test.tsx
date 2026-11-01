import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { publicDetailFixture } from "@/features/public-catalog/api/public-catalog.test-helper";
import { QueryClient } from "@tanstack/react-query";
import {
  imageBoundary,
  imageResponse,
  queryWrapper,
} from "@/features/public-catalog/components/public-image.test-helper";
import { MangaCard } from "./MangaCard";

const client = new QueryClient();
afterEach(() => {
  client.clear();
  vi.unstubAllGlobals();
});
describe("persisted public card", () => {
  it("uses the immutable slug, actual title/cover/type and no engagement or fixture reader", async () => {
    imageBoundary();
    const requests: Request[] = [];
    vi.stubGlobal("fetch", (request: Request) => {
      requests.push(request);
      return Promise.resolve(imageResponse());
    });
    const work = publicDetailFixture("immutable-title").work;
    const { container } = render(
      <MangaCard work={{ ...work, title: "عمل Mixed Title" }} />,
      { wrapper: queryWrapper(client) },
    );
    expect(
      screen.getByRole("heading", { name: "عمل Mixed Title" }),
    ).toHaveAttribute("dir", "auto");
    await waitFor(() =>
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "blob:synthetic-public-image",
      ),
    );
    expect(requests[0]?.url).toContain("/content/works/immutable-title/cover");
    expect(requests[0]?.credentials).toBe("omit");
    for (const link of screen.getAllByRole("link"))
      expect(link).toHaveAttribute("href", "/story/immutable-title");
    expect(screen.getAllByText("رواية")).toHaveLength(2);
    expect(container.querySelector('[class*="metaRating"]')).toBeNull();
    expect(container.querySelector('[class*="hotBadge"]')).toBeNull();
    expect(screen.queryByText("اقرأ الآن")).not.toBeInTheDocument();
  });
});

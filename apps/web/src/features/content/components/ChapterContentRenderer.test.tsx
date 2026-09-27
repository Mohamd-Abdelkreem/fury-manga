import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChapterContentRenderer } from "./ChapterContentRenderer";

const mocks = vi.hoisted(() => ({ load: vi.fn() }));
vi.mock("@/features/media/hooks/media.hooks", () => ({
  useAdminMediaCandidate: () => ({
    state: {
      phase: "accepted",
      assetId: "11111111-1111-4111-8111-111111111111",
      previewUrl: "blob:private-page",
    },
    load: mocks.load,
  }),
}));
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <span role="img" aria-label={alt} data-src={src} />
  ),
}));

describe("illustrated Chapter renderer", () => {
  it("loads each private asset and renders pages in command order", () => {
    render(
      <ChapterContentRenderer
        pages={[
          { assetId: "11111111-1111-4111-8111-111111111111" },
          { assetId: "22222222-2222-4222-8222-222222222222" },
        ]}
      />,
    );
    expect(mocks.load).toHaveBeenCalledWith(
      "11111111-1111-4111-8111-111111111111",
    );
    expect(mocks.load).toHaveBeenCalledWith(
      "22222222-2222-4222-8222-222222222222",
    );
    expect(screen.getByRole("img", { name: "صفحة 1" })).toHaveAttribute(
      "data-src",
      "blob:private-page",
    );
    expect(screen.getByRole("status")).toHaveTextContent("جارٍ تحميل الصفحة");
  });

  it("does not invent a sample page for an empty draft", () => {
    render(<ChapterContentRenderer pages={[]} />);
    expect(screen.getByText("لا توجد صفحات للمعاينة.")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("structured text Chapter renderer", () => {
  it("renders allowed blocks in order with emphasis and a same-site link", () => {
    render(
      <ChapterContentRenderer
        document={{
          version: 1,
          blocks: [
            { type: "heading", level: 2, text: "Opening" },
            { type: "heading", level: 3, text: "Details" },
            {
              type: "paragraph",
              content: [
                { text: "Bold", bold: true },
                { text: "Italic", italic: true },
                { text: "Read", href: "/stories/example" },
              ],
            },
            { type: "list", ordered: true, items: ["First", "Second"] },
            { type: "list", ordered: false, items: ["One", "Two"] },
          ],
        }}
      />,
    );
    const region = screen.getByLabelText("نص الفصل");
    expect(region.querySelectorAll("h2, h3, p, ol, ul")).toHaveLength(5);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Opening",
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Details",
    );
    expect(screen.getByText("Bold").closest("strong")).toBeInTheDocument();
    expect(screen.getByText("Italic").closest("em")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read" })).toHaveAttribute(
      "href",
      "/stories/example",
    );
    expect(region.querySelector("ol")).toHaveTextContent("FirstSecond");
    expect(region.querySelector("ul")).toHaveTextContent("OneTwo");
  });

  it("renders draft markup as text and does not activate an unsafe link", () => {
    render(
      <ChapterContentRenderer
        document={{
          version: 1,
          blocks: [
            {
              type: "paragraph",
              content: [
                {
                  text: "<script>alert(1)</script>",
                  href: "https://example.com",
                },
              ],
            },
          ],
        }}
      />,
    );
    expect(screen.getByText("<script>alert(1)</script>")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import type { AdminChapter } from "@fury/contracts";
import {
  createTextChapterCommand,
  savedTextBlocks,
  updateTextChapterCommand,
} from "./admin-chapter-text";

const chapter = {
  id: "33333333-3333-4333-8333-333333333333",
  workId: "44444444-4444-4444-8444-444444444444",
  number: 1,
  title: "Chapter",
  contentType: "text",
  publicationStatus: "draft",
  publishedAt: null,
  version: 3,
  createdAt: "2026-09-26T00:00:00.000Z",
  updatedAt: "2026-09-26T00:00:00.000Z",
  textContent: {
    version: 1,
    blocks: [{ type: "paragraph", content: [{ text: "Saved" }] }],
  },
  pages: [],
  readyForPublication: true,
} satisfies AdminChapter;

describe("text Chapter command model", () => {
  it("uses null for an empty private draft and preserves the saved comparison", () => {
    expect(createTextChapterCommand(1, " Chapter ", [])).toEqual({
      number: 1,
      title: "Chapter",
      textContent: null,
    });
    const draft = savedTextBlocks(chapter);
    draft[0] = { type: "heading", level: 2, text: "Unsaved" };
    expect(chapter.textContent.blocks[0]).toEqual({
      type: "paragraph",
      content: [{ text: "Saved" }],
    });
    expect(updateTextChapterCommand(chapter, 1, "Chapter", draft)).toEqual({
      expectedVersion: 3,
      number: 1,
      title: "Chapter",
      textContent: { version: 1, blocks: draft },
    });
  });

  it("rejects unsafe links and unsupported document shapes before a save command", () => {
    expect(() =>
      createTextChapterCommand(1, "Chapter", [
        {
          type: "paragraph",
          content: [{ text: "External", href: "https://example.com" }],
        },
      ]),
    ).toThrow();
    expect(() =>
      createTextChapterCommand(1, "Chapter", [
        { type: "heading", level: 2, text: "" },
      ]),
    ).toThrow();
    expect(() =>
      createTextChapterCommand(
        1,
        "Chapter",
        Array.from({ length: 501 }, () => ({
          type: "heading" as const,
          level: 2 as const,
          text: "x",
        })),
      ),
    ).toThrow();
  });
});

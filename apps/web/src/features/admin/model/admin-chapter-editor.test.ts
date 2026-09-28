import { describe, expect, it } from "vitest";
import {
  appendChapterPage,
  createIllustratedChapterCommand,
  moveChapterPage,
  updateIllustratedChapterCommand,
} from "./admin-chapter-editor";
import type { AdminChapter } from "@fury/contracts";

const firstAsset = "11111111-1111-4111-8111-111111111111";
const secondAsset = "22222222-2222-4222-8222-222222222222";
const firstPage = "33333333-3333-4333-8333-333333333333";

describe("illustrated Chapter command shaping", () => {
  it("keeps saved page identity on reorder and omits it for new candidates", () => {
    const chapter = { version: 4 } as AdminChapter;
    const pages = [{ id: firstPage, assetId: firstAsset }];
    const extended = appendChapterPage(pages, secondAsset);
    const moved = moveChapterPage(extended, 1, -1);
    expect(moved).toEqual([
      { assetId: secondAsset },
      { id: firstPage, assetId: firstAsset },
    ]);
    expect(pages).toEqual([{ id: firstPage, assetId: firstAsset }]);
    expect(
      updateIllustratedChapterCommand(chapter, 2, " الفصل الثاني ", moved),
    ).toEqual({
      expectedVersion: 4,
      number: 2,
      title: "الفصل الثاني",
      pages: [{ assetId: secondAsset }, { id: firstPage, assetId: firstAsset }],
    });
  });

  it("creates an empty private draft and rejects invalid number/title", () => {
    expect(createIllustratedChapterCommand(1, " البداية ", [])).toEqual({
      number: 1,
      title: "البداية",
      pages: [],
    });
    expect(() => createIllustratedChapterCommand(0, "البداية", [])).toThrow();
    expect(() => createIllustratedChapterCommand(1, " ", [])).toThrow();
  });
});

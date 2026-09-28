import {
  createChapterBodySchema,
  updateChapterBodySchema,
  type AdminChapter,
  type CreateChapterBody,
  type StructuredTextDocument,
  type UpdateChapterBody,
} from "@fury/contracts";

export type EditableTextBlock = StructuredTextDocument["blocks"][number];

export const savedTextBlocks = (chapter: AdminChapter): EditableTextBlock[] =>
  chapter.textContent?.blocks.map((block) => structuredClone(block)) ?? [];

export const textDraftDocument = (
  blocks: readonly EditableTextBlock[],
): StructuredTextDocument | null => {
  if (blocks.length === 0) return null;
  return { version: 1, blocks: [...blocks] };
};

export const createTextChapterCommand = (
  number: number,
  title: string,
  blocks: readonly EditableTextBlock[],
): CreateChapterBody =>
  createChapterBodySchema.parse({
    number,
    title,
    textContent: textDraftDocument(blocks),
  });

export const updateTextChapterCommand = (
  chapter: AdminChapter,
  number: number,
  title: string,
  blocks: readonly EditableTextBlock[],
): UpdateChapterBody =>
  updateChapterBodySchema.parse({
    expectedVersion: chapter.version,
    number,
    title,
    textContent: textDraftDocument(blocks),
  });

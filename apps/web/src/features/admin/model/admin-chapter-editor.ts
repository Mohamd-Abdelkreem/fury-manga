import {
  createChapterBodySchema,
  updateChapterBodySchema,
  type AdminChapter,
  type CreateChapterBody,
  type UpdateChapterBody,
} from "@fury/contracts";

export type EditableChapterPage = Readonly<{
  id?: string;
  assetId: string;
  assetStatus?: "available" | "unavailable";
}>;

export const savedChapterPages = (
  chapter: AdminChapter,
): EditableChapterPage[] =>
  chapter.pages.map(({ id, assetId, assetStatus }) => ({
    id,
    assetId,
    assetStatus,
  }));

export const appendChapterPage = (
  pages: readonly EditableChapterPage[],
  assetId: string,
): EditableChapterPage[] => [...pages, { assetId }];

export const moveChapterPage = (
  pages: readonly EditableChapterPage[],
  index: number,
  direction: -1 | 1,
): EditableChapterPage[] => {
  const destination = index + direction;
  if (index < 0 || destination < 0 || destination >= pages.length)
    return [...pages];
  const next = [...pages];
  const sourcePage = next[index];
  const destinationPage = next[destination];
  if (sourcePage === undefined || destinationPage === undefined) return next;
  next[index] = destinationPage;
  next[destination] = sourcePage;
  return next;
};

export const createIllustratedChapterCommand = (
  number: number,
  title: string,
  pages: readonly EditableChapterPage[],
): CreateChapterBody =>
  createChapterBodySchema.parse({
    number,
    title,
    pages: pages.map(({ assetId }) => ({ assetId })),
  });

export const updateIllustratedChapterCommand = (
  chapter: AdminChapter,
  number: number,
  title: string,
  pages: readonly EditableChapterPage[],
): UpdateChapterBody =>
  updateChapterBodySchema.parse({
    expectedVersion: chapter.version,
    number,
    title,
    pages: pages.map(({ id, assetId }) => ({
      ...(id === undefined ? {} : { id }),
      assetId,
    })),
  });

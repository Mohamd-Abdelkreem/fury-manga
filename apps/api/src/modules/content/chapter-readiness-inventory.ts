import { structuredTextDocumentSchema } from "@fury/contracts";
import {
  ChapterContentType,
  PublicationStatus,
  type DatabaseClient,
} from "@fury/database";

export type PublishedTextInventory = Readonly<{
  checked: number;
  invalidIds: string[];
}>;

type PublishedTextRow = Readonly<{ id: string; textContent: unknown }>;

export const inventoryPublishedText = async (
  database: Pick<DatabaseClient, "chapter">,
): Promise<PublishedTextInventory> => {
  const invalidIds: string[] = [];
  let checked = 0;
  let afterId: string | null = null;
  for (;;) {
    const chapters: PublishedTextRow[] = await database.chapter.findMany({
      where: {
        contentType: ChapterContentType.TEXT,
        publicationStatus: PublicationStatus.PUBLISHED,
        ...(afterId === null ? {} : { id: { gt: afterId } }),
      },
      orderBy: { id: "asc" },
      take: 100,
      select: { id: true, textContent: true },
    });
    if (chapters.length === 0) break;
    for (const chapter of chapters) {
      checked += 1;
      afterId = chapter.id;
      if (
        !structuredTextDocumentSchema.safeParse(chapter.textContent).success
      ) {
        invalidIds.push(chapter.id);
      }
    }
    if (chapters.length < 100) break;
  }
  return { checked, invalidIds };
};

import { MangaCard } from "@/components/ui/MangaCard/MangaCard";

import {
  TEXT_STATUS_LABELS,
  TEXT_TYPE_LABELS,
  type TextWork,
} from "../../data/textStories";

type TextStoryCardProps = Readonly<{
  work: TextWork;
}>;

export function TextStoryCard({ work }: TextStoryCardProps) {
  const latestChapter = work.chapters.at(-1);
  const chapterLabel =
    work.status === "archived"
      ? TEXT_STATUS_LABELS.archived
      : latestChapter === undefined
        ? "لا توجد فصول"
        : String(latestChapter.number);

  return (
    <MangaCard
      id={work.id}
      title={work.title}
      chapter={chapterLabel}
      rating={work.rating ?? 0}
      flag="AR"
      image={work.cover}
      badge={TEXT_TYPE_LABELS[work.type]}
      badgeIcon="book"
      isNew={work.addedAt >= "2026-08-01"}
      stretch
    />
  );
}

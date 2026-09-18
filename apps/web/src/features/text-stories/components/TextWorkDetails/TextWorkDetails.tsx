import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import { ChapterList } from "@/features/story/components/ChapterList/ChapterList";
import {
  CommentsSection,
  type StoryComment,
} from "@/features/story/components/CommentsSection/CommentsSection";
import { SimilarStories } from "@/features/story/components/SimilarStories/SimilarStories";
import { StorySidebar } from "@/features/story/components/StorySidebar/StorySidebar";
import type { Chapter, SimilarWork } from "@/features/story/data/storyData";

import {
  TEXT_STATUS_LABELS,
  TEXT_TYPE_LABELS,
  TEXT_WORKS,
  type TextWork,
} from "../../data/textStories";
import styles from "./TextWorkDetails.module.css";

type TextWorkDetailsProps = Readonly<{
  work: TextWork;
  viewState?: "loading" | "populated" | "error";
}>;

const textChapters = (work: TextWork): Chapter[] =>
  work.status === "archived"
    ? []
    : work.chapters.toReversed().map((chapter) => ({
        number: String(chapter.number),
        date: chapter.publishedAt,
        url: `/story/${work.id}/chapter/${chapter.id}`,
      }));

const similarTextWorks = (work: TextWork): SimilarWork[] =>
  work.similarWorkIds.flatMap((id) => {
    const similar = TEXT_WORKS.find((candidate) => candidate.id === id);
    if (similar === undefined) return [];
    return [
      {
        id: similar.id,
        title: similar.title,
        chapter: String(similar.chapters.at(-1)?.number ?? "—"),
        rating: similar.rating ?? 0,
        image: similar.cover,
        flag: "AR",
        type: TEXT_TYPE_LABELS[similar.type],
        badge: TEXT_TYPE_LABELS[similar.type],
        badgeIcon: "book" as const,
      },
    ];
  });

const textComments = (work: TextWork): StoryComment[] =>
  work.comments.map((comment) => ({
    id: comment.id,
    user: comment.author,
    date: comment.date,
    content: comment.body,
  }));

export function TextWorkDetails({
  work,
  viewState = "populated",
}: TextWorkDetailsProps) {
  if (viewState === "loading") {
    return (
      <main className={styles["stateMain"]}>
        <FeatureState
          kind="loading"
          title="جارٍ تحميل العمل"
          message="نجهز تفاصيل العمل وفصوله."
        />
      </main>
    );
  }

  if (viewState === "error") {
    return (
      <main className={styles["stateMain"]}>
        <FeatureState
          kind="error"
          title="تعذّر عرض العمل"
          message="حدث خطأ أثناء تجهيز تفاصيل الرواية."
          actionHref={`/story/${work.id}`}
          actionLabel="إعادة المحاولة"
        />
      </main>
    );
  }

  const alternativeTitles = [
    work.englishTitle,
    ...(work.alternativeTitles ?? []),
  ]
    .filter((title): title is string => title !== undefined)
    .join("، ");

  return (
    <>
      <div className={styles["sidebarCol"]}>
        <StorySidebar
          coverImage={work.cover}
          title={work.title}
          rating={work.rating ?? 0}
          bookmarkedBy={work.ratingCount ?? 0}
          status={TEXT_STATUS_LABELS[work.status]}
          type={TEXT_TYPE_LABELS[work.type]}
          publishedDate={work.publishedAt}
          author={work.author}
          artist="لا ينطبق"
          publisher="Fury"
          translator="النص الأصلي"
          lastUpdated={work.updatedAt}
          views="—"
          contentKind="text"
        />
      </div>

      <main className={styles["mainCol"]} id="main-content">
        <ChapterList
          storyId={work.id}
          title={work.title}
          alternativeTitles={alternativeTitles || work.title}
          description={work.description}
          genres={[...work.categories]}
          genreSlugs={work.categorySlugs}
          genreRoute="stories"
          chapters={textChapters(work)}
        />
        <SimilarStories similarWorks={similarTextWorks(work)} />
        <CommentsSection initialComments={textComments(work)} />
      </main>
    </>
  );
}

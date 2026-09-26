"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { TextBlock } from "../../text-stories/data/textStories";
import { CHAPTER_PRESENTATION_WORKS } from "../data/adminFixtures";
import type {
  AdminActivityEvent,
  AdminChapter,
  AdminPublishStatus,
} from "../types/admin.types";

interface AdminWorkActionState {
  chapters: Record<string, AdminChapter[]>;
  setChapters: Dispatch<SetStateAction<Record<string, AdminChapter[]>>>;
  setActivities: Dispatch<SetStateAction<AdminActivityEvent[]>>;
  actorName: string;
}

export function useAdminWorkActions({
  chapters,
  setChapters,
  setActivities,
  actorName,
}: AdminWorkActionState) {
  const getWork = useCallback(
    (id: string) =>
      CHAPTER_PRESENTATION_WORKS.find(
        (work) => work.id.toLowerCase() === id.toLowerCase(),
      ),
    [],
  );

  const getChapters = useCallback(
    (workId: string): AdminChapter[] => chapters[workId] ?? [],
    [chapters],
  );

  const getChapter = useCallback(
    (workId: string, chapterId: string): AdminChapter | undefined => {
      const list = chapters[workId] ?? [];
      return list.find((c) => c.id === chapterId);
    },
    [chapters],
  );

  const createChapter = useCallback(
    (
      workId: string,
      chapterData: Omit<
        AdminChapter,
        "id" | "workId" | "views" | "publishedAt" | "updatedAt"
      > & {
        pages?: string[] | undefined;
        textContent?: string | undefined;
        textBlocks?: TextBlock[] | undefined;
      },
    ): AdminChapter => {
      const today = new Date().toISOString().slice(0, 10);
      const chapterId = `ch-${workId}-${String(chapterData.number)}-${String(Date.now())}`;

      const newChapter: AdminChapter = {
        ...chapterData,
        id: chapterId,
        workId,
        views: 0,
        publishedAt: today,
        updatedAt: today,
      };

      setChapters((prev) => {
        const existing = prev[workId] ?? [];
        return {
          ...prev,
          [workId]: [newChapter, ...existing],
        };
      });

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "chapter_published",
          title: "إضافة فصل جديد",
          description: `ظهر الفصل ${String(newChapter.number)}: '${newChapter.title}' في المعاينة المحلية فقط؛ لم يُحفظ.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);

      return newChapter;
    },
    [actorName, setActivities, setChapters],
  );

  const updateChapter = useCallback(
    (
      workId: string,
      chapterId: string,
      updates: Partial<AdminChapter>,
    ): AdminChapter | undefined => {
      const current = chapters[workId]?.find(
        (chapter) => chapter.id === chapterId,
      );
      if (current === undefined) return undefined;

      const today = new Date().toISOString().slice(0, 10);
      const updated: AdminChapter = {
        ...current,
        ...updates,
        updatedAt: today,
      };
      setChapters((previous) => ({
        ...previous,
        [workId]: (previous[workId] ?? []).map((chapter) =>
          chapter.id === chapterId
            ? { ...chapter, ...updates, updatedAt: today }
            : chapter,
        ),
      }));

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "chapter_published",
          title: "تحديث فصل",
          description: `تغير الفصل ${String(updated.number)}: '${updated.title}' في المعاينة المحلية فقط؛ لم يُحفظ.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);

      return updated;
    },
    [chapters, actorName, setActivities, setChapters],
  );

  const toggleChapterPublish = useCallback(
    (workId: string, chapterId: string): void => {
      setChapters((prev) => {
        const workChapters = prev[workId] ?? [];
        const nextChapters = workChapters.map((ch) => {
          if (ch.id === chapterId) {
            const nextStatus: AdminPublishStatus =
              ch.status === "published" ? "draft" : "published";
            return {
              ...ch,
              status: nextStatus,
              updatedAt: new Date().toISOString().slice(0, 10),
            };
          }
          return ch;
        });
        return { ...prev, [workId]: nextChapters };
      });
    },
    [setChapters],
  );

  const archiveChapter = useCallback(
    (workId: string, chapterId: string): void => {
      setChapters((prev) => {
        const workChapters = prev[workId] ?? [];
        const nextChapters = workChapters.map((ch) => {
          if (ch.id === chapterId) {
            return {
              ...ch,
              status: "archived" as const,
              updatedAt: new Date().toISOString().slice(0, 10),
            };
          }
          return ch;
        });
        return { ...prev, [workId]: nextChapters };
      });
    },
    [setChapters],
  );

  const restoreChapter = useCallback(
    (workId: string, chapterId: string): void => {
      setChapters((prev) => {
        const workChapters = prev[workId] ?? [];
        const nextChapters = workChapters.map((ch) => {
          if (ch.id === chapterId) {
            return {
              ...ch,
              status: "draft" as const,
              updatedAt: new Date().toISOString().slice(0, 10),
            };
          }
          return ch;
        });
        return { ...prev, [workId]: nextChapters };
      });
    },
    [setChapters],
  );

  return {
    getWork,
    getChapters,
    getChapter,
    createChapter,
    updateChapter,
    toggleChapterPublish,
    archiveChapter,
    restoreChapter,
  };
}

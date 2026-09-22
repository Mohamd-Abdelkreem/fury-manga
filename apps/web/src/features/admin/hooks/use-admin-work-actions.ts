"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { TextBlock } from "../../text-stories/data/textStories";
import type {
  AdminActivityEvent,
  AdminChapter,
  AdminPublishStatus,
  AdminWork,
} from "../types/admin.types";

interface AdminWorkActionState {
  works: AdminWork[];
  setWorks: Dispatch<SetStateAction<AdminWork[]>>;
  chapters: Record<string, AdminChapter[]>;
  setChapters: Dispatch<SetStateAction<Record<string, AdminChapter[]>>>;
  setActivities: Dispatch<SetStateAction<AdminActivityEvent[]>>;
  actorName: string;
}

export function useAdminWorkActions({
  works,
  setWorks,
  chapters,
  setChapters,
  setActivities,
  actorName,
}: AdminWorkActionState) {
  const getWork = useCallback(
    (id: string): AdminWork | undefined =>
      works.find((w) => w.id.toLowerCase() === id.toLowerCase()),
    [works],
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

  const createWork = useCallback(
    (
      workData: Omit<
        AdminWork,
        "id" | "createdAt" | "updatedAt" | "chapterCount" | "views"
      >,
    ): AdminWork => {
      const slug =
        workData.title
          .trim()
          .toLowerCase()
          .replace(/[^\u0621-\u064A\w\s-]/gu, "")
          .replace(/\s+/g, "-") || `work-${String(Date.now())}`;
      const uniqueId = `${slug}-${String(Math.floor(Math.random() * 1000))}`;
      const today = new Date().toISOString().slice(0, 10);

      const newWork: AdminWork = {
        ...workData,
        id: uniqueId,
        chapterCount: 0,
        views: 0,
        createdAt: today,
        updatedAt: today,
      };

      setWorks((prev) => [newWork, ...prev]);
      setChapters((prev) => ({ ...prev, [uniqueId]: [] }));

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "work_created",
          title: "إضافة عمل جديد",
          description: `تم إنشاء العمل '${newWork.title}' بنجاح.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);

      return newWork;
    },
    [actorName, setActivities, setChapters, setWorks],
  );

  const updateWork = useCallback(
    (
      id: string,
      updates: Partial<Omit<AdminWork, "id" | "createdAt">>,
    ): AdminWork | undefined => {
      const current = works.find(
        (work) => work.id.toLowerCase() === id.toLowerCase(),
      );
      if (current === undefined) return undefined;

      const today = new Date().toISOString().slice(0, 10);
      const updated: AdminWork = { ...current, ...updates, updatedAt: today };
      setWorks((previous) =>
        previous.map((work) =>
          work.id.toLowerCase() === id.toLowerCase()
            ? { ...work, ...updates, updatedAt: today }
            : work,
        ),
      );

      const title = updated.title;
      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "work_updated",
          title: "تعديل بيانات عمل",
          description: `تم تحديث بيانات العمل '${title}'.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);

      return updated;
    },
    [actorName, works, setActivities, setWorks],
  );

  const toggleWorkPublish = useCallback(
    (id: string): void => {
      setWorks((prev) =>
        prev.map((work) => {
          if (work.id.toLowerCase() === id.toLowerCase()) {
            const nextStatus =
              work.publishStatus === "published" ? "draft" : "published";
            return {
              ...work,
              publishStatus: nextStatus,
              updatedAt: new Date().toISOString().slice(0, 10),
            };
          }
          return work;
        }),
      );
    },
    [setWorks],
  );

  const archiveWork = useCallback(
    (id: string): void => {
      setWorks((prev) =>
        prev.map((work) => {
          if (work.id.toLowerCase() === id.toLowerCase()) {
            return {
              ...work,
              publishStatus: "archived",
              updatedAt: new Date().toISOString().slice(0, 10),
            };
          }
          return work;
        }),
      );
    },
    [setWorks],
  );

  const restoreWork = useCallback(
    (id: string): void => {
      setWorks((prev) =>
        prev.map((work) => {
          if (work.id.toLowerCase() === id.toLowerCase()) {
            return {
              ...work,
              publishStatus: "draft",
              updatedAt: new Date().toISOString().slice(0, 10),
            };
          }
          return work;
        }),
      );
    },
    [setWorks],
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

      setWorks((prev) =>
        prev.map((w) =>
          w.id.toLowerCase() === workId.toLowerCase()
            ? { ...w, chapterCount: w.chapterCount + 1, updatedAt: today }
            : w,
        ),
      );

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "chapter_published",
          title: "إضافة فصل جديد",
          description: `تمت إضافة الفصل ${String(newChapter.number)}: '${newChapter.title}'.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);

      return newChapter;
    },
    [actorName, setActivities, setChapters, setWorks],
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
          description: `تم تحديث الفصل ${String(updated.number)}: '${updated.title}'.`,
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
    createWork,
    updateWork,
    toggleWorkPublish,
    archiveWork,
    restoreWork,
    createChapter,
    updateChapter,
    toggleChapterPublish,
    archiveChapter,
    restoreChapter,
  };
}

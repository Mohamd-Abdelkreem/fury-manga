import {
  adminChapterDataSchema,
  adminChapterListDataSchema,
  adminChapterListQuerySchema,
  contentIdSchema,
  createChapterBodySchema,
  publicationCommandBodySchema,
  publicationTransitionDataSchema,
  updateChapterBodySchema,
  type AdminChapter,
  type AdminChapterListQuery,
  type AdminChapterSummary,
  type CreateChapterBody,
  type PublicationCommandBody,
  type PublicationTransition,
  type PaginationMeta,
  type UpdateChapterBody,
} from "@fury/contracts";

import { apiClient } from "@/services/api/api-client";
import {
  readContentSuccessData,
  safeContentRequest,
  SafeAdminContentError,
} from "./admin-content.api";

const chapterPath = (workId: string, chapterId?: string): string => {
  const work = contentIdSchema.parse(workId);
  const base = `/content/admin/works/${work}/chapters`;
  return chapterId === undefined
    ? base
    : `${base}/${contentIdSchema.parse(chapterId)}`;
};
const requireChapterIdentity = (
  chapter: AdminChapter,
  workId: string,
  chapterId?: string,
): AdminChapter => {
  if (
    chapter.workId !== workId ||
    (chapterId !== undefined && chapter.id !== chapterId)
  )
    throw new SafeAdminContentError("HTTP_ERROR", 0, "");
  return chapter;
};

export const adminChapterApi = {
  list(
    workId: string,
    query: AdminChapterListQuery,
    signal?: AbortSignal,
  ): Promise<{ items: AdminChapterSummary[]; pagination: PaginationMeta }> {
    return safeContentRequest(async () => {
      const response = await apiClient.get(chapterPath(workId), {
        params: adminChapterListQuerySchema.parse(query),
        ...(signal === undefined ? {} : { signal }),
      });
      const list = adminChapterListDataSchema.parse(
        readContentSuccessData(response.data),
      );
      if (list.items.some((chapter) => chapter.workId !== workId))
        throw new SafeAdminContentError("HTTP_ERROR", 0, "");
      return list;
    });
  },

  get(
    workId: string,
    chapterId: string,
    signal?: AbortSignal,
  ): Promise<AdminChapter> {
    return safeContentRequest(async () => {
      const response = await apiClient.get(chapterPath(workId, chapterId), {
        ...(signal === undefined ? {} : { signal }),
      });
      return requireChapterIdentity(
        adminChapterDataSchema.parse(readContentSuccessData(response.data))
          .chapter,
        workId,
        chapterId,
      );
    });
  },

  create(workId: string, body: CreateChapterBody): Promise<AdminChapter> {
    return safeContentRequest(async () => {
      const response = await apiClient.post(
        chapterPath(workId),
        createChapterBodySchema.parse(body),
      );
      return requireChapterIdentity(
        adminChapterDataSchema.parse(readContentSuccessData(response.data))
          .chapter,
        workId,
      );
    });
  },

  update(
    workId: string,
    chapterId: string,
    body: UpdateChapterBody,
  ): Promise<AdminChapter> {
    return safeContentRequest(async () => {
      const response = await apiClient.patch(
        chapterPath(workId, chapterId),
        updateChapterBodySchema.parse(body),
      );
      return requireChapterIdentity(
        adminChapterDataSchema.parse(readContentSuccessData(response.data))
          .chapter,
        workId,
        chapterId,
      );
    });
  },

  publish(
    workId: string,
    chapterId: string,
    body: PublicationCommandBody,
  ): Promise<PublicationTransition> {
    return safeContentRequest(async () => {
      const response = await apiClient.put(
        `${chapterPath(workId, chapterId)}/publication`,
        publicationCommandBodySchema.parse(body),
      );
      const transition = publicationTransitionDataSchema.parse(
        readContentSuccessData(response.data),
      ).transition;
      if (
        transition.resourceId !== chapterId ||
        transition.resourceType !== "chapter"
      )
        throw new SafeAdminContentError("HTTP_ERROR", 0, "");
      return transition;
    });
  },
};

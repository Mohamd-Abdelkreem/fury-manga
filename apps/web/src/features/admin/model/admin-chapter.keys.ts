import { adminContentKeys } from "./admin-content.keys";
import type { AdminChapterListQuery } from "@fury/contracts";

export const adminChapterKeys = {
  actor: (actorId: string) =>
    [...adminContentKeys.actor(actorId), "chapters"] as const,
  work: (actorId: string, workId: string) =>
    [...adminChapterKeys.actor(actorId), workId] as const,
  listScope: (actorId: string, workId: string) =>
    [...adminChapterKeys.work(actorId, workId), "list"] as const,
  list: (actorId: string, workId: string, query: AdminChapterListQuery) =>
    [...adminChapterKeys.listScope(actorId, workId), query] as const,
  detail: (actorId: string, workId: string, chapterId: string) =>
    [...adminChapterKeys.work(actorId, workId), "detail", chapterId] as const,
};

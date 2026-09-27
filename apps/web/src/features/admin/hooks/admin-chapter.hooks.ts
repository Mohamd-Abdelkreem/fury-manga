"use client";

import {
  onlineManager,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import type {
  AdminChapter,
  AdminChapterListQuery,
  CreateChapterBody,
  PublicationCommandBody,
  PublicationTransition,
  UpdateChapterBody,
} from "@fury/contracts";

import { adminChapterApi } from "../api/admin-chapter.api";
import { SafeAdminContentError } from "../api/admin-content.api";
import { adminContentKeys } from "../model/admin-content.keys";
import { adminChapterKeys } from "../model/admin-chapter.keys";
import {
  denialError,
  isActorDenied,
  runActorRequest,
  runRecoveryRead,
  useActorDenial,
  useAdminActor,
} from "./admin-content.hooks";

type ChapterDenial = {
  issued: number;
  deniedThrough: number;
  denied: boolean;
  listeners: Set<() => void>;
};
const chapterDenials = new WeakMap<QueryClient, Map<string, ChapterDenial>>();
const denialFor = (client: QueryClient, scope: string): ChapterDenial => {
  let scopes = chapterDenials.get(client);
  if (scopes === undefined) {
    scopes = new Map();
    chapterDenials.set(client, scopes);
  }
  let state = scopes.get(scope);
  if (state === undefined) {
    state = {
      issued: 0,
      deniedThrough: 0,
      denied: false,
      listeners: new Set(),
    };
    scopes.set(scope, state);
  }
  return state;
};
const isChapterDenied = (client: QueryClient, scope: string): boolean =>
  denialFor(client, scope).denied;
const useChapterDenial = (client: QueryClient, scope: string): boolean =>
  useSyncExternalStore(
    (listener) => {
      const state = denialFor(client, scope);
      state.listeners.add(listener);
      return () => {
        state.listeners.delete(listener);
      };
    },
    () => isChapterDenied(client, scope),
    () => false,
  );
const notifyChapterDenial = (state: ChapterDenial): void => {
  for (const listener of state.listeners) listener();
};
const denyChapterScope = (
  client: QueryClient,
  scope: string,
  key: QueryKey,
): void => {
  const state = denialFor(client, scope);
  state.deniedThrough = state.issued;
  state.denied = true;
  notifyChapterDenial(state);
  void client.cancelQueries({ queryKey: key });
  client.removeQueries({ queryKey: key });
};
const runChapterRead = async <T>(
  client: QueryClient,
  scope: string,
  key: QueryKey,
  request: () => Promise<T>,
  recovery = false,
): Promise<T> => {
  const state = denialFor(client, scope);
  if (state.denied && !recovery) throw denialError();
  const issued = ++state.issued;
  try {
    const saved = await request();
    if (issued <= state.deniedThrough) throw denialError();
    if (state.denied) {
      state.denied = false;
      state.deniedThrough = issued;
      notifyChapterDenial(state);
    }
    return saved;
  } catch (error: unknown) {
    if (
      error instanceof SafeAdminContentError &&
      error.code === "NOT_FOUND" &&
      issued > state.deniedThrough
    )
      denyChapterScope(client, scope, key);
    throw error;
  }
};

const useChapterActorCleanup = (
  client: QueryClient,
  actorId: string | null,
): void => {
  const previousActor = useRef(actorId);
  useEffect(() => {
    const previous = previousActor.current;
    previousActor.current = actorId;
    if (previous === null || previous === actorId) return;
    const key = adminChapterKeys.actor(previous);
    void client.cancelQueries({ queryKey: key });
    client.removeQueries({ queryKey: key });
  }, [actorId, client]);
};

export const useAdminChapterList = (
  workId: string,
  query: AdminChapterListQuery,
) => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const actorId = session.actorId;
  useChapterActorCleanup(queryClient, actorId);
  const actorDenied = useActorDenial(queryClient, actorId);
  const scope = JSON.stringify([actorId, workId, "list"]);
  const resourceDenied = useChapterDenial(queryClient, scope);
  const denied = actorDenied || resourceDenied;
  const scopeKey = adminChapterKeys.listScope(actorId ?? "anonymous", workId);
  const queryKey = adminChapterKeys.list(actorId ?? "anonymous", workId, query);
  const retryAccess = useCallback(async () => {
    if (actorId === null) throw denialError();
    return queryClient.fetchQuery({
      queryKey,
      queryFn: ({ signal }) =>
        runChapterRead(
          queryClient,
          scope,
          scopeKey,
          () =>
            runRecoveryRead(
              queryClient,
              actorId,
              () => adminChapterApi.list(workId, query, signal),
              workId,
            ),
          true,
        ),
      staleTime: 0,
      retry: false,
      networkMode: "always",
    });
  }, [actorId, query, queryClient, queryKey, scope, scopeKey, workId]);
  const list = useQuery({
    queryKey,
    queryFn: ({ signal }) => {
      if (actorId === null) throw denialError();
      return runChapterRead(queryClient, scope, scopeKey, () =>
        runActorRequest(
          queryClient,
          actorId,
          () => adminChapterApi.list(workId, query, signal),
          { workId, kind: "read" },
        ),
      );
    },
    enabled: actorId !== null && !denied,
    retry: false,
  });
  return {
    ...list,
    actorId,
    denied,
    sessionReady: session.sessionReady,
    retryAccess,
  };
};

export const useAdminChapterDetail = (workId: string, chapterId?: string) => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const actorId = session.actorId;
  useChapterActorCleanup(queryClient, actorId);
  const actorDenied = useActorDenial(queryClient, actorId);
  const scope = JSON.stringify([actorId, workId, chapterId]);
  const resourceDenied = useChapterDenial(queryClient, scope);
  const denied = actorDenied || resourceDenied;
  const scopeKey = adminChapterKeys.detail(
    actorId ?? "anonymous",
    workId,
    chapterId ?? "none",
  );
  const retryAccess = useCallback(async () => {
    if (actorId === null || chapterId === undefined) throw denialError();
    return queryClient.fetchQuery({
      queryKey: scopeKey,
      queryFn: ({ signal }) =>
        runChapterRead(
          queryClient,
          scope,
          scopeKey,
          () =>
            runRecoveryRead(
              queryClient,
              actorId,
              () => adminChapterApi.get(workId, chapterId, signal),
              workId,
            ),
          true,
        ),
      staleTime: 0,
      retry: false,
      networkMode: "always",
    });
  }, [actorId, chapterId, queryClient, scope, scopeKey, workId]);
  const query = useQuery({
    queryKey: scopeKey,
    queryFn: ({ signal }) => {
      if (actorId === null || chapterId === undefined) throw denialError();
      return runChapterRead(queryClient, scope, scopeKey, () =>
        runActorRequest(
          queryClient,
          actorId,
          () => adminChapterApi.get(workId, chapterId, signal),
          { workId, kind: "read" },
        ),
      );
    },
    enabled: actorId !== null && chapterId !== undefined && !denied,
    retry: false,
  });
  return {
    ...query,
    actorId,
    denied,
    sessionReady: session.sessionReady,
    retryAccess,
  };
};

type SaveCommand =
  | Readonly<{ operation: "create"; workId: string; body: CreateChapterBody }>
  | Readonly<{
      operation: "update";
      workId: string;
      chapterId: string;
      body: UpdateChapterBody;
    }>;

export const useSaveAdminChapter = () => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  useChapterActorCleanup(queryClient, session.actorId);
  const commandRef = useRef<SaveCommand | null>(null);
  const saveActorRef = useRef<string | null>(null);
  const savedRef = useRef<AdminChapter | null>(null);
  const savingRef = useRef(false);
  const confirmedSave = (): AdminChapter => {
    const saved = savedRef.current;
    if (saved === null) throw denialError();
    return saved;
  };
  const currentActor = useRef(session.actorId);
  useEffect(() => {
    currentActor.current = session.actorId;
  }, [session.actorId]);
  const mutation = useMutation({
    mutationFn: async () => {
      const command = commandRef.current;
      if (command === null) throw denialError();
      const actorId = saveActorRef.current;
      if (actorId === null || isActorDenied(queryClient, actorId)) {
        throw denialError();
      }
      const chapter = await runActorRequest(
        queryClient,
        actorId,
        () =>
          command.operation === "create"
            ? adminChapterApi.create(command.workId, command.body)
            : adminChapterApi.update(
                command.workId,
                command.chapterId,
                command.body,
              ),
        { workId: command.workId, kind: "write" },
      );
      savedRef.current = chapter;
      return { workId: chapter.workId, chapterId: chapter.id };
    },
    onMutate: () => ({
      actorId: saveActorRef.current,
      workId: commandRef.current?.workId,
      chapterId:
        commandRef.current?.operation === "update"
          ? commandRef.current.chapterId
          : undefined,
    }),
    onSuccess: async (_data, _variables, context) => {
      const chapter = savedRef.current;
      if (chapter === null) return;
      const actorId = context.actorId;
      if (
        actorId === null ||
        actorId !== currentActor.current ||
        isActorDenied(queryClient, actorId) ||
        isChapterDenied(
          queryClient,
          JSON.stringify([actorId, chapter.workId, chapter.id]),
        )
      )
        return;
      const key = adminChapterKeys.detail(actorId, chapter.workId, chapter.id);
      const cached = queryClient.getQueryData<AdminChapter>(key);
      if (cached === undefined || cached.version <= chapter.version) {
        queryClient.setQueryData(key, chapter);
      }
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminChapterKeys.work(actorId, chapter.workId),
        }),
        queryClient.invalidateQueries({
          queryKey: adminContentKeys.workDetail(actorId, chapter.workId),
        }),
      ]);
    },
    onError: async (error, _variables, context) => {
      const actorId = context?.actorId;
      if (
        context === undefined ||
        actorId === null ||
        actorId === undefined ||
        actorId !== currentActor.current ||
        context.chapterId === undefined ||
        context.workId === undefined
      )
        return;
      const key = adminChapterKeys.detail(
        actorId,
        context.workId,
        context.chapterId,
      );
      if (
        error instanceof SafeAdminContentError &&
        error.code === "NOT_FOUND"
      ) {
        denyChapterScope(
          queryClient,
          JSON.stringify([actorId, context.workId, context.chapterId]),
          key,
        );
      } else if (!isActorDenied(queryClient, actorId)) {
        await queryClient.invalidateQueries({
          queryKey: key,
          refetchType: onlineManager.isOnline() ? "active" : "none",
        });
      }
    },
    retry: false,
    networkMode: "always",
  });
  return {
    isPending: mutation.isPending,
    mutateAsync: async (command: SaveCommand): Promise<AdminChapter> => {
      if (savingRef.current) throw denialError();
      savingRef.current = true;
      commandRef.current = command;
      saveActorRef.current = session.actorId;
      savedRef.current = null;
      try {
        await mutation.mutateAsync();
        return confirmedSave();
      } finally {
        commandRef.current = null;
        saveActorRef.current = null;
        savedRef.current = null;
        savingRef.current = false;
      }
    },
  };
};

type PublicationCommand = Readonly<{
  workId: string;
  chapterId: string;
  body: PublicationCommandBody;
}>;
type ActorPublicationCommand = PublicationCommand &
  Readonly<{ actorId: string | null }>;

export const usePublishAdminChapter = () => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  useChapterActorCleanup(queryClient, session.actorId);
  const pending = useRef<{
    scope: string;
    request: Promise<{
      chapter: AdminChapter;
      transition: PublicationTransition;
    }>;
  } | null>(null);
  const currentActor = useRef(session.actorId);
  useEffect(() => {
    currentActor.current = session.actorId;
  }, [session.actorId]);
  const cacheConfirmed = (
    actorId: string,
    command: PublicationCommand,
    chapter: AdminChapter,
  ): void => {
    if (
      currentActor.current !== actorId ||
      isActorDenied(queryClient, actorId) ||
      isChapterDenied(
        queryClient,
        JSON.stringify([actorId, command.workId, command.chapterId]),
      )
    )
      return;
    queryClient.setQueryData(
      adminChapterKeys.detail(actorId, command.workId, command.chapterId),
      chapter,
    );
  };
  const mutation = useMutation({
    mutationFn: async (command: ActorPublicationCommand) => {
      const actorId = command.actorId;
      if (
        actorId === null ||
        isActorDenied(queryClient, actorId) ||
        isChapterDenied(
          queryClient,
          JSON.stringify([actorId, command.workId, command.chapterId]),
        )
      )
        return Promise.reject(denialError());
      const scope = JSON.stringify([
        actorId,
        command.workId,
        command.chapterId,
        command.body.expectedVersion,
        command.body.targetState,
      ]);
      if (pending.current !== null) {
        if (pending.current.scope !== scope) throw denialError();
        const confirmed = await pending.current.request;
        cacheConfirmed(actorId, command, confirmed.chapter);
        return { transition: confirmed.transition };
      }
      const request = runActorRequest(
        queryClient,
        actorId,
        async () => {
          const transition = await adminChapterApi.publish(
            command.workId,
            command.chapterId,
            command.body,
          );
          if (currentActor.current !== actorId) throw denialError();
          const chapter = await adminChapterApi.get(
            command.workId,
            command.chapterId,
          );
          if (
            chapter.workId !== command.workId ||
            chapter.id !== command.chapterId ||
            chapter.publicationStatus !== transition.publicationStatus ||
            chapter.version < transition.version
          )
            throw new SafeAdminContentError("HTTP_ERROR", 0, "");
          return { chapter, transition };
        },
        { workId: command.workId, kind: "write" },
      );
      pending.current = { scope, request };
      const clearPending = () => {
        if (pending.current?.request === request) pending.current = null;
      };
      void request.then(clearPending, clearPending);
      const confirmed = await request;
      cacheConfirmed(actorId, command, confirmed.chapter);
      return { transition: confirmed.transition };
    },
    onMutate: (command) => command,
    onSuccess: async (_data, _command, context) => {
      if (
        context.actorId === null ||
        context.actorId !== currentActor.current ||
        isActorDenied(queryClient, context.actorId) ||
        isChapterDenied(
          queryClient,
          JSON.stringify([context.actorId, context.workId, context.chapterId]),
        )
      )
        return;
      await queryClient.invalidateQueries({
        queryKey: adminChapterKeys.work(context.actorId, context.workId),
      });
    },
    onError: async (error, _command, context) => {
      if (
        context?.actorId === null ||
        context?.actorId === undefined ||
        context.actorId !== currentActor.current
      )
        return;
      const key = adminChapterKeys.detail(
        context.actorId,
        context.workId,
        context.chapterId,
      );
      if (
        error instanceof SafeAdminContentError &&
        error.code === "NOT_FOUND"
      ) {
        denyChapterScope(
          queryClient,
          JSON.stringify([context.actorId, context.workId, context.chapterId]),
          key,
        );
      } else if (!isActorDenied(queryClient, context.actorId)) {
        await queryClient.invalidateQueries({
          queryKey: key,
          refetchType: onlineManager.isOnline() ? "active" : "none",
        });
      }
    },
    retry: false,
    networkMode: "always",
  });
  return {
    isPending: mutation.isPending,
    mutateAsync: (command: PublicationCommand) =>
      mutation.mutateAsync({ ...command, actorId: session.actorId }),
  };
};

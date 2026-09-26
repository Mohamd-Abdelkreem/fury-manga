"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { createWorkBodySchema } from "@fury/contracts";
import type {
  AdminWork,
  CategoryListQuery,
  CategoryPositionBody,
  CreateCategoryBody,
  CreateWorkBody,
  UpdateCategoryBody,
  UpdateWorkBody,
} from "@fury/contracts";
import { useSession } from "@/features/auth/hooks/auth.hooks";

import {
  adminContentApi,
  SafeAdminContentError,
} from "../api/admin-content.api";
import { isTerminalAdminContentError } from "../model/admin-content.errors";
import { adminContentKeys } from "../model/admin-content.keys";
import { workMatchesCreateCommand } from "../model/admin-work-editor";
import { mediaKeys } from "@/features/media/model/media.keys";

type ActorDenialState = {
  denied: boolean;
  deniedThrough: number;
  issuedThrough: number;
  listeners: Set<() => void>;
};

const denialStates = new WeakMap<QueryClient, Map<string, ActorDenialState>>();

const getDenialState = (
  queryClient: QueryClient,
  actorId: string,
): ActorDenialState | undefined => denialStates.get(queryClient)?.get(actorId);

const ensureDenialState = (
  queryClient: QueryClient,
  actorId: string,
): ActorDenialState => {
  let actors = denialStates.get(queryClient);
  if (actors === undefined) {
    actors = new Map();
    denialStates.set(queryClient, actors);
  }
  let state = actors.get(actorId);
  if (state === undefined) {
    state = {
      denied: false,
      deniedThrough: 0,
      issuedThrough: 0,
      listeners: new Set(),
    };
    actors.set(actorId, state);
  }
  return state;
};

const subscribeToDenial = (
  queryClient: QueryClient,
  actorId: string,
  listener: () => void,
): (() => void) => {
  const state = ensureDenialState(queryClient, actorId);
  state.listeners.add(listener);
  return () => {
    state.listeners.delete(listener);
  };
};

const isActorDenied = (queryClient: QueryClient, actorId: string): boolean =>
  getDenialState(queryClient, actorId)?.denied ?? false;

const denialError = () => new SafeAdminContentError("ACCESS_FENCED", 0, "");

const issueActorRequest = (
  queryClient: QueryClient,
  actorId: string,
): number => {
  const state = ensureDenialState(queryClient, actorId);
  state.issuedThrough += 1;
  return state.issuedThrough;
};

const notifyDenialListeners = (state: ActorDenialState): void => {
  for (const listener of state.listeners) listener();
};

const denyActor = (queryClient: QueryClient, actorId: string): void => {
  const state = ensureDenialState(queryClient, actorId);
  state.deniedThrough = Math.max(state.deniedThrough, state.issuedThrough);
  if (!state.denied) {
    state.denied = true;
    notifyDenialListeners(state);
  }
  const queryKey = adminContentKeys.actor(actorId);
  void queryClient.cancelQueries({ queryKey });
  queryClient.removeQueries({ queryKey });
};

const recoverActor = (
  queryClient: QueryClient,
  actorId: string,
  requestId: number,
): void => {
  const state = getDenialState(queryClient, actorId);
  if (
    state === undefined ||
    !state.denied ||
    requestId <= state.deniedThrough
  ) {
    throw denialError();
  }
  state.denied = false;
  state.deniedThrough = requestId;
  notifyDenialListeners(state);
};

const useActorDenial = (queryClient: QueryClient, actorId: string | null) =>
  useSyncExternalStore(
    (listener) =>
      actorId === null
        ? () => undefined
        : subscribeToDenial(queryClient, actorId, listener),
    () => (actorId === null ? false : isActorDenied(queryClient, actorId)),
    () => false,
  );

const runActorRequest = async <T>(
  queryClient: QueryClient,
  actorId: string,
  request: () => Promise<T>,
): Promise<T> => {
  if (isActorDenied(queryClient, actorId)) throw denialError();
  const requestId = issueActorRequest(queryClient, actorId);
  try {
    const result = await request();
    const state = getDenialState(queryClient, actorId);
    if (state !== undefined && requestId <= state.deniedThrough) {
      throw denialError();
    }
    return result;
  } catch (error: unknown) {
    const state = getDenialState(queryClient, actorId);
    if (
      isTerminalAdminContentError(error) &&
      requestId > (state?.deniedThrough ?? 0)
    ) {
      denyActor(queryClient, actorId);
    }
    throw error;
  }
};

const runRecoveryRead = async <T>(
  queryClient: QueryClient,
  actorId: string,
  request: () => Promise<T>,
): Promise<T> => {
  const requestId = issueActorRequest(queryClient, actorId);
  try {
    const result = await request();
    if (isActorDenied(queryClient, actorId)) {
      recoverActor(queryClient, actorId, requestId);
    }
    return result;
  } catch (error: unknown) {
    const state = getDenialState(queryClient, actorId);
    if (
      isTerminalAdminContentError(error) &&
      requestId > (state?.deniedThrough ?? 0)
    ) {
      denyActor(queryClient, actorId);
    }
    throw error;
  }
};

const useAdminActor = () => {
  const session = useSession();
  const user = session.data?.user;
  const actorId =
    user?.role === "ADMIN" &&
    user.status === "ACTIVE" &&
    user.emailVerifiedAt !== null
      ? user.id
      : null;
  return {
    actorId,
    sessionReady: session.status !== "pending",
    sessionError: session.error,
  };
};

const invalidateActorCategories = async (
  queryClient: QueryClient,
  actorId: string,
): Promise<void> => {
  await queryClient.invalidateQueries({
    queryKey: adminContentKeys.categories(actorId),
  });
};

const invalidateWorkDependencies = async (
  queryClient: QueryClient,
  actorId: string,
  workId: string,
): Promise<void> => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: adminContentKeys.works(actorId),
    }),
    queryClient.invalidateQueries({
      queryKey: adminContentKeys.categories(actorId),
    }),
    queryClient.invalidateQueries({
      queryKey: mediaKeys.reference(actorId, "work_cover", workId),
    }),
    queryClient.invalidateQueries({
      queryKey: mediaKeys.reference(actorId, "work_background", workId),
    }),
  ]);
};

export const useAdminCategoryList = (
  query: CategoryListQuery,
  options: Readonly<{ enabled?: boolean }> = {},
) => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const actorId = session.actorId;
  const denied = useActorDenial(queryClient, actorId);
  const queryKey = useMemo(
    () => adminContentKeys.categoryList(actorId ?? "anonymous", query),
    [actorId, query],
  );
  const retryAccess = useCallback(async () => {
    if (actorId === null) throw denialError();
    return queryClient.fetchQuery({
      queryKey,
      queryFn: ({ signal }) =>
        runRecoveryRead(queryClient, actorId, () =>
          adminContentApi.listCategories(query, signal),
        ),
      retry: false,
      staleTime: 0,
    });
  }, [actorId, query, queryClient, queryKey]);
  const queryResult = useQuery({
    queryKey,
    queryFn: ({ signal }) => {
      if (actorId === null) throw denialError();
      return runActorRequest(queryClient, actorId, () =>
        adminContentApi.listCategories(query, signal),
      );
    },
    enabled: options.enabled !== false && actorId !== null && !denied,
    retry: false,
  });
  return {
    ...queryResult,
    actorId,
    available: actorId !== null,
    sessionReady: session.sessionReady,
    sessionError: session.sessionError,
    denied,
    retryAccess,
  };
};

export const useAdminCategoryDetail = (categoryId: string | null) => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const denied = useActorDenial(queryClient, session.actorId);
  const queryResult = useQuery({
    queryKey: adminContentKeys.categoryDetail(
      session.actorId ?? "anonymous",
      categoryId ?? "none",
    ),
    queryFn: ({ signal }) => {
      if (session.actorId === null || categoryId === null) {
        throw denialError();
      }
      return runActorRequest(queryClient, session.actorId, () =>
        adminContentApi.getCategory(categoryId, signal),
      );
    },
    enabled: session.actorId !== null && categoryId !== null && !denied,
    retry: false,
  });
  return {
    ...queryResult,
    actorId: session.actorId,
    available: session.actorId !== null,
    sessionReady: session.sessionReady,
    sessionError: session.sessionError,
    denied,
  };
};

export const useAdminCategoryPicker = () => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const denied = useActorDenial(queryClient, session.actorId);
  const queryResult = useQuery({
    queryKey: adminContentKeys.categoryPicker(session.actorId ?? "anonymous"),
    queryFn: ({ signal }) => {
      if (session.actorId === null) throw denialError();
      const query: CategoryListQuery = { page: 1, limit: 100, enabled: true };
      return runActorRequest(queryClient, session.actorId, () =>
        adminContentApi.listCategories(query, signal),
      ).then(({ items }) => items);
    },
    enabled: session.actorId !== null && !denied,
    retry: false,
  });
  return {
    ...queryResult,
    actorId: session.actorId,
    available: session.actorId !== null,
    sessionReady: session.sessionReady,
    denied,
  };
};

export const useCreateAdminCategory = () => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategoryBody) => {
      if (session.actorId === null) return Promise.reject(denialError());
      return runActorRequest(queryClient, session.actorId, async () => {
        try {
          return await adminContentApi.createCategory(body);
        } catch (error: unknown) {
          if (
            body.id === undefined ||
            !(error instanceof SafeAdminContentError) ||
            (error.statusCode !== 0 && error.statusCode < 500)
          ) {
            throw error;
          }
          try {
            const recovered = await adminContentApi.getCategory(body.id);
            if (
              recovered.displayName === body.displayName &&
              recovered.slug === body.slug
            ) {
              return recovered;
            }
          } catch (readbackError: unknown) {
            if (isTerminalAdminContentError(readbackError)) throw readbackError;
          }
          throw error;
        }
      });
    },
    onSuccess: async (category) => {
      if (session.actorId === null) return;
      queryClient.setQueryData(
        adminContentKeys.categoryDetail(session.actorId, category.id),
        category,
      );
      await invalidateActorCategories(queryClient, session.actorId);
    },
    retry: false,
  });
};

export const useUpdateAdminCategory = () => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      body,
    }: {
      categoryId: string;
      body: UpdateCategoryBody;
    }) => {
      if (session.actorId === null) return Promise.reject(denialError());
      return runActorRequest(queryClient, session.actorId, () =>
        adminContentApi.updateCategory(categoryId, body),
      );
    },
    onSuccess: async (category) => {
      if (session.actorId === null) return;
      queryClient.setQueryData(
        adminContentKeys.categoryDetail(session.actorId, category.id),
        category,
      );
      await invalidateActorCategories(queryClient, session.actorId);
    },
    onError: async (error, variables) => {
      if (
        session.actorId !== null &&
        error instanceof SafeAdminContentError &&
        error.code === "CONTENT_STALE_WRITE"
      ) {
        await queryClient.invalidateQueries({
          queryKey: adminContentKeys.categoryDetail(
            session.actorId,
            variables.categoryId,
          ),
        });
      }
    },
    retry: false,
  });
};

export const useMoveAdminCategory = () => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      body,
    }: {
      categoryId: string;
      body: CategoryPositionBody;
    }) => {
      if (session.actorId === null) return Promise.reject(denialError());
      return runActorRequest(queryClient, session.actorId, () =>
        adminContentApi.moveCategory(categoryId, body),
      );
    },
    onSuccess: async (result) => {
      if (session.actorId === null) return;
      queryClient.setQueryData(
        adminContentKeys.categoryDetail(session.actorId, result.category.id),
        result.category,
      );
      if (result.displacedCategory !== null) {
        queryClient.setQueryData(
          adminContentKeys.categoryDetail(
            session.actorId,
            result.displacedCategory.id,
          ),
          result.displacedCategory,
        );
      }
      await invalidateActorCategories(queryClient, session.actorId);
    },
    retry: false,
  });
};

export const useAdminWorkDetail = (workId: string | null) => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const actorId = session.actorId;
  const denied = useActorDenial(queryClient, actorId);
  const queryKey = adminContentKeys.workDetail(
    actorId ?? "anonymous",
    workId ?? "none",
  );
  const retryAccess = useCallback(async () => {
    if (actorId === null || workId === null) throw denialError();
    return queryClient.fetchQuery({
      queryKey,
      queryFn: ({ signal }) =>
        runRecoveryRead(queryClient, actorId, () =>
          adminContentApi.getWork(workId, signal),
        ),
      retry: false,
      staleTime: 0,
    });
  }, [actorId, queryClient, queryKey, workId]);
  const queryResult = useQuery({
    queryKey,
    queryFn: ({ signal }) => {
      if (actorId === null || workId === null) throw denialError();
      return runActorRequest(queryClient, actorId, () =>
        adminContentApi.getWork(workId, signal),
      );
    },
    enabled: actorId !== null && workId !== null && !denied,
    retry: false,
  });
  return {
    ...queryResult,
    actorId,
    available: actorId !== null,
    sessionReady: session.sessionReady,
    sessionError: session.sessionError,
    denied,
    retryAccess,
  };
};

const isAmbiguousWriteError = (error: unknown): boolean =>
  error instanceof SafeAdminContentError &&
  error.code !== "CANCELLED" &&
  error.code !== "ACCESS_FENCED" &&
  (error.statusCode === 0 || error.statusCode >= 500);

export const useCreateAdminWork = () => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (body: CreateWorkBody) => {
      if (session.actorId === null) return Promise.reject(denialError());
      const parsed = createWorkBodySchema.parse(body);
      const command =
        parsed.id === undefined
          ? { ...parsed, id: globalThis.crypto.randomUUID() }
          : parsed;
      return runActorRequest(queryClient, session.actorId, async () => {
        try {
          return await adminContentApi.createWork(command);
        } catch (error: unknown) {
          if (command.id === undefined || !isAmbiguousWriteError(error)) {
            throw error;
          }
          try {
            const existing = await adminContentApi.getWork(command.id);
            if (workMatchesCreateCommand(existing, command)) return existing;
          } catch (readbackError: unknown) {
            if (isTerminalAdminContentError(readbackError)) throw readbackError;
          }
          throw error;
        }
      });
    },
    onSuccess: async (work) => {
      if (session.actorId === null) return;
      queryClient.setQueryData(
        adminContentKeys.workDetail(session.actorId, work.id),
        work,
      );
      await invalidateWorkDependencies(queryClient, session.actorId, work.id);
    },
    retry: false,
  });
  const readback = useCallback(
    async (workId: string): Promise<AdminWork> => {
      const actorId = session.actorId;
      if (actorId === null) throw denialError();
      return runActorRequest(queryClient, actorId, async () => {
        const work = await adminContentApi.getWork(workId);
        queryClient.setQueryData(
          adminContentKeys.workDetail(actorId, work.id),
          work,
        );
        return work;
      });
    },
    [queryClient, session.actorId],
  );
  return { ...mutation, readback };
};

export const useUpdateAdminWork = () => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workId,
      body,
    }: {
      workId: string;
      body: UpdateWorkBody;
    }) => {
      if (session.actorId === null) return Promise.reject(denialError());
      return runActorRequest(queryClient, session.actorId, () =>
        adminContentApi.updateWork(workId, body),
      );
    },
    onSuccess: async (work) => {
      if (session.actorId === null) return;
      queryClient.setQueryData(
        adminContentKeys.workDetail(session.actorId, work.id),
        work,
      );
      await invalidateWorkDependencies(queryClient, session.actorId, work.id);
    },
    onError: async (error, variables) => {
      if (
        session.actorId !== null &&
        error instanceof SafeAdminContentError &&
        error.code === "CONTENT_STALE_WRITE"
      ) {
        await queryClient.invalidateQueries({
          queryKey: adminContentKeys.workDetail(
            session.actorId,
            variables.workId,
          ),
        });
      }
    },
    retry: false,
  });
};

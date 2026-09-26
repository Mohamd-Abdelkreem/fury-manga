"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import { createWorkBodySchema } from "@fury/contracts";
import type {
  AdminWork,
  CategoryListQuery,
  CategoryPositionBody,
  CreateCategoryBody,
  CreateWorkBody,
  PublicationCommandBody,
  UpdateCategoryBody,
  UpdateWorkBody,
} from "@fury/contracts";
import { useSession } from "@/features/auth/hooks/auth.hooks";

import {
  adminContentApi,
  SafeAdminContentError,
} from "../api/admin-content.api";
import {
  isTerminalAdminContentError,
  isWriteSideAdminForbidden,
} from "../model/admin-content.errors";
import { adminContentKeys } from "../model/admin-content.keys";
import { workMatchesCreateCommand } from "../model/admin-work-editor";
import { mediaKeys } from "@/features/media/model/media.keys";

type ActorDenialState = {
  denied: boolean;
  deniedThrough: number;
  issuedThrough: number;
  writeBlockedThrough: Map<string, number>;
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
      writeBlockedThrough: new Map(),
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

const isWorkWriteBlocked = (
  queryClient: QueryClient,
  actorId: string,
  workId: string,
): boolean =>
  getDenialState(queryClient, actorId)?.writeBlockedThrough.has(workId) ??
  false;

const blockWorkWrite = (
  queryClient: QueryClient,
  actorId: string,
  workId: string,
): void => {
  const state = ensureDenialState(queryClient, actorId);
  state.writeBlockedThrough.set(workId, state.issuedThrough);
  notifyDenialListeners(state);
};

const recoverWorkWrite = (
  queryClient: QueryClient,
  actorId: string,
  workId: string,
  requestId: number,
): void => {
  const state = getDenialState(queryClient, actorId);
  const blockedThrough = state?.writeBlockedThrough.get(workId);
  if (blockedThrough !== undefined && requestId > blockedThrough) {
    state?.writeBlockedThrough.delete(workId);
    if (state !== undefined) notifyDenialListeners(state);
  }
};

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
  workOperation?: Readonly<{ workId: string; kind: "read" | "write" }>,
): Promise<T> => {
  if (isActorDenied(queryClient, actorId)) throw denialError();
  if (
    workOperation?.kind === "write" &&
    isWorkWriteBlocked(queryClient, actorId, workOperation.workId)
  ) {
    throw denialError();
  }
  const requestId = issueActorRequest(queryClient, actorId);
  try {
    const result = await request();
    const state = getDenialState(queryClient, actorId);
    if (state !== undefined && requestId <= state.deniedThrough) {
      throw denialError();
    }
    if (workOperation?.kind === "read") {
      recoverWorkWrite(queryClient, actorId, workOperation.workId, requestId);
    }
    return result;
  } catch (error: unknown) {
    const state = getDenialState(queryClient, actorId);
    if (workOperation?.kind === "write" && isWriteSideAdminForbidden(error)) {
      blockWorkWrite(queryClient, actorId, workOperation.workId);
    } else if (
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
  workId?: string,
): Promise<T> => {
  const requestId = issueActorRequest(queryClient, actorId);
  try {
    const result = await request();
    if (isActorDenied(queryClient, actorId)) {
      recoverActor(queryClient, actorId, requestId);
    }
    if (workId !== undefined)
      recoverWorkWrite(queryClient, actorId, workId, requestId);
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

export const useAdminCategoryPicker = (page = 1, search = "") => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const denied = useActorDenial(queryClient, session.actorId);
  const queryResult = useQuery({
    queryKey: adminContentKeys.categoryPicker(
      session.actorId ?? "anonymous",
      page,
      search,
    ),
    queryFn: ({ signal }) => {
      if (session.actorId === null) throw denialError();
      const query: CategoryListQuery = {
        page,
        limit: 100,
        enabled: true,
        ...(search ? { search } : {}),
      };
      return runActorRequest(queryClient, session.actorId, () =>
        adminContentApi.listCategories(query, signal),
      );
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
      await Promise.all([
        invalidateActorCategories(queryClient, session.actorId),
        queryClient.invalidateQueries({
          queryKey: adminContentKeys.workDetailScope(session.actorId),
        }),
      ]);
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
      await Promise.all([
        invalidateActorCategories(queryClient, session.actorId),
        queryClient.invalidateQueries({
          queryKey: adminContentKeys.workDetailScope(session.actorId),
        }),
      ]);
    },
    retry: false,
  });
};

type WorkFreshness = { issued: number; accepted: number };
const workFreshness = new WeakMap<QueryClient, Map<string, WorkFreshness>>();

const freshnessFor = (
  queryClient: QueryClient,
  actorId: string,
  workId: string,
): WorkFreshness => {
  let resources = workFreshness.get(queryClient);
  if (resources === undefined) {
    resources = new Map();
    workFreshness.set(queryClient, resources);
  }
  const key = JSON.stringify([actorId, workId]);
  let state = resources.get(key);
  if (state === undefined) {
    state = { issued: 0, accepted: 0 };
    resources.set(key, state);
  }
  return state;
};

const issueWorkRead = (
  queryClient: QueryClient,
  actorId: string,
  workId: string,
): number => ++freshnessFor(queryClient, actorId, workId).issued;

const keepNewestWork = (
  queryClient: QueryClient,
  actorId: string,
  incoming: AdminWork,
  readOrder = issueWorkRead(queryClient, actorId, incoming.id),
): AdminWork => {
  if (isActorDenied(queryClient, actorId)) throw denialError();
  const key = adminContentKeys.workDetail(actorId, incoming.id);
  const cached = queryClient.getQueryData<AdminWork>(key);
  const freshness = freshnessFor(queryClient, actorId, incoming.id);
  if (cached !== undefined && cached.version > incoming.version) return cached;
  if (readOrder < freshness.accepted) {
    // An evicted detail cannot supply a safe result for a superseded read.
    if (cached === undefined)
      throw new SafeAdminContentError("CONTENT_STALE_WRITE", 409, "");
    if (cached.version === incoming.version) return cached;
  }
  freshness.accepted = Math.max(freshness.accepted, readOrder);
  queryClient.setQueryData(key, incoming);
  return incoming;
};

export const useAdminWorkDetail = (workId: string | null) => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const actorId = session.actorId;
  const denied = useActorDenial(queryClient, actorId);
  const writeBlocked = useSyncExternalStore(
    (listener) =>
      actorId === null
        ? () => undefined
        : subscribeToDenial(queryClient, actorId, listener),
    () =>
      actorId !== null &&
      workId !== null &&
      isWorkWriteBlocked(queryClient, actorId, workId),
    () => false,
  );
  const queryKey = adminContentKeys.workDetail(
    actorId ?? "anonymous",
    workId ?? "none",
  );
  const retryAccess = useCallback(async () => {
    if (actorId === null || workId === null) throw denialError();
    return queryClient.fetchQuery({
      queryKey,
      queryFn: ({ signal }) => {
        const readOrder = issueWorkRead(queryClient, actorId, workId);
        return runRecoveryRead(
          queryClient,
          actorId,
          () => adminContentApi.getWork(workId, signal),
          workId,
        ).then((work) => keepNewestWork(queryClient, actorId, work, readOrder));
      },
      retry: false,
      staleTime: 0,
    });
  }, [actorId, queryClient, queryKey, workId]);
  const queryResult = useQuery({
    queryKey,
    queryFn: ({ signal }) => {
      if (actorId === null || workId === null) throw denialError();
      const readOrder = issueWorkRead(queryClient, actorId, workId);
      return runActorRequest(
        queryClient,
        actorId,
        () => adminContentApi.getWork(workId, signal),
        { workId, kind: "read" },
      ).then((work) => keepNewestWork(queryClient, actorId, work, readOrder));
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
    writeBlocked,
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
  const missingAfterAmbiguous = useRef<{
    actorId: string;
    command: CreateWorkBody;
    conflicted: boolean;
  } | null>(null);
  const mutation = useMutation({
    mutationFn: (body: CreateWorkBody) => {
      if (session.actorId === null) return Promise.reject(denialError());
      const parsed = createWorkBodySchema.parse(body);
      const command = {
        ...parsed,
        id: parsed.id ?? globalThis.crypto.randomUUID(),
      };
      const actorId = session.actorId;
      if (
        missingAfterAmbiguous.current?.actorId === actorId &&
        missingAfterAmbiguous.current.command.id === command.id &&
        missingAfterAmbiguous.current.conflicted
      ) {
        return Promise.reject(
          new SafeAdminContentError("CONTENT_CONFLICT", 409, ""),
        );
      }
      return runActorRequest(queryClient, actorId, async () => {
        try {
          const saved = await adminContentApi.createWork(command);
          missingAfterAmbiguous.current = null;
          return saved;
        } catch (error: unknown) {
          if (
            error instanceof SafeAdminContentError &&
            error.statusCode === 409 &&
            missingAfterAmbiguous.current?.actorId === actorId &&
            JSON.stringify(missingAfterAmbiguous.current.command) ===
              JSON.stringify(command)
          ) {
            // A 404 may have raced the first POST; the conflict itself proves nothing.
            try {
              const existing = await adminContentApi.getWork(command.id);
              if (workMatchesCreateCommand(existing, command)) {
                missingAfterAmbiguous.current = null;
                return existing;
              }
            } catch (readbackError: unknown) {
              if (isTerminalAdminContentError(readbackError))
                throw readbackError;
            }
            missingAfterAmbiguous.current = {
              actorId,
              command,
              conflicted: true,
            };
            throw error;
          }
          if (!isAmbiguousWriteError(error)) throw error;
          try {
            const existing = await adminContentApi.getWork(command.id);
            if (workMatchesCreateCommand(existing, command)) return existing;
          } catch (readbackError: unknown) {
            if (isTerminalAdminContentError(readbackError)) throw readbackError;
            if (
              readbackError instanceof SafeAdminContentError &&
              readbackError.statusCode === 404
            ) {
              missingAfterAmbiguous.current = {
                actorId,
                command,
                conflicted: false,
              };
            }
          }
          throw error;
        }
      });
    },
    onMutate: () => ({ actorId: session.actorId }),
    onSuccess: async (work, _variables, context) => {
      const actorId = context.actorId;
      if (
        actorId === null ||
        session.actorId !== actorId ||
        isActorDenied(queryClient, actorId)
      )
        return;
      keepNewestWork(queryClient, actorId, work);
      await invalidateWorkDependencies(queryClient, actorId, work.id);
    },
    retry: false,
  });
  const readback = useCallback(
    async (workId: string): Promise<AdminWork> => {
      const actorId = session.actorId;
      if (actorId === null) throw denialError();
      const readOrder = issueWorkRead(queryClient, actorId, workId);
      return runActorRequest(queryClient, actorId, async () => {
        const work = await adminContentApi.getWork(workId);
        const pending = missingAfterAmbiguous.current;
        if (
          pending?.actorId === actorId &&
          pending.command.id === workId &&
          workMatchesCreateCommand(work, pending.command)
        ) {
          missingAfterAmbiguous.current = null;
        }
        return keepNewestWork(queryClient, actorId, work, readOrder);
      });
    },
    [queryClient, session.actorId],
  );
  return { ...mutation, readback };
};

export const useUpdateAdminWork = () => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      workId,
      body,
    }: {
      workId: string;
      body: UpdateWorkBody;
    }) => {
      if (session.actorId === null) return Promise.reject(denialError());
      return runActorRequest(
        queryClient,
        session.actorId,
        () => adminContentApi.updateWork(workId, body),
        { workId, kind: "write" },
      );
    },
    onMutate: () => ({ actorId: session.actorId }),
    onSuccess: async (work, _variables, context) => {
      const actorId = context.actorId;
      if (
        actorId === null ||
        session.actorId !== actorId ||
        isActorDenied(queryClient, actorId)
      )
        return;
      keepNewestWork(queryClient, actorId, work);
      await invalidateWorkDependencies(queryClient, actorId, work.id);
    },
    onError: async (error, variables, context) => {
      const actorId = context?.actorId;
      if (
        actorId !== null &&
        actorId !== undefined &&
        session.actorId === actorId &&
        !isActorDenied(queryClient, actorId) &&
        error instanceof SafeAdminContentError &&
        error.code === "CONTENT_STALE_WRITE"
      ) {
        await queryClient.invalidateQueries({
          queryKey: adminContentKeys.workDetail(actorId, variables.workId),
        });
      }
    },
    retry: false,
  });
  const readback = useCallback(
    async (workId: string): Promise<AdminWork> => {
      const actorId = session.actorId;
      if (actorId === null) throw denialError();
      const readOrder = issueWorkRead(queryClient, actorId, workId);
      return runActorRequest(queryClient, actorId, async () => {
        const work = await adminContentApi.getWork(workId);
        return keepNewestWork(queryClient, actorId, work, readOrder);
      });
    },
    [queryClient, session.actorId],
  );
  return { ...mutation, readback };
};

export const useTransitionAdminWork = () => {
  const session = useAdminActor();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      workId,
      body,
    }: {
      workId: string;
      body: PublicationCommandBody;
    }) => {
      if (session.actorId === null) return Promise.reject(denialError());
      return runActorRequest(
        queryClient,
        session.actorId,
        () => adminContentApi.transitionWork(workId, body),
        { workId, kind: "write" },
      );
    },
    onMutate: () => ({ actorId: session.actorId }),
    onSuccess: async (_transition, variables, context) => {
      const actorId = context.actorId;
      if (
        actorId === null ||
        actorId !== session.actorId ||
        isActorDenied(queryClient, actorId)
      )
        return;
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminContentKeys.workDetail(actorId, variables.workId),
        }),
        invalidateWorkDependencies(queryClient, actorId, variables.workId),
      ]);
    },
    retry: false,
  });
  const readback = useCallback(
    async (workId: string): Promise<AdminWork> => {
      const actorId = session.actorId;
      if (actorId === null) throw denialError();
      const readOrder = issueWorkRead(queryClient, actorId, workId);
      return runActorRequest(queryClient, actorId, async () => {
        const work = await adminContentApi.getWork(workId);
        return keepNewestWork(queryClient, actorId, work, readOrder);
      });
    },
    [queryClient, session.actorId],
  );
  return { ...mutation, readback };
};

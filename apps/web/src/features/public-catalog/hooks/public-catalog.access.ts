import type { Query, QueryClient, QueryState } from "@tanstack/react-query";
import {
  catalogDetailDataSchema,
  catalogWorkListDataSchema,
  catalogHomeDataSchema,
  catalogChapterSchema,
  type CatalogDetailData,
} from "@fury/contracts";

import {
  SafePublicCatalogError,
  isPublicNotFound,
} from "../model/public-catalog.errors";
import { chapterPageSchema } from "../model/public-catalog.responses";

type CachedPublicQuery = Readonly<{
  queryKey: readonly unknown[];
  state: Pick<QueryState, "data" | "status" | "error">;
  setState: (state: Partial<QueryState>) => void;
}>;
type ReadKind = "work" | "chapter" | "image";
type ReadStamp = Readonly<{ order: number; epoch: number; kind: ReadKind }>;
export type PublicAccessSnapshot = Readonly<{
  revision: number;
  denied: boolean;
  browserDenied: boolean;
  canSeed: boolean;
}>;
export const initialPublicAccessSnapshot: PublicAccessSnapshot = Object.freeze({
  revision: 0,
  denied: false,
  browserDenied: false,
  canSeed: true,
});
type WorkAccess = {
  issued: number;
  accepted: number;
  deniedThrough: number;
  browserDeniedThrough: number;
  epoch: number;
  denied: boolean;
  revision: number;
  snapshot: PublicAccessSnapshot;
  stamps: WeakMap<object, ReadStamp>;
  listeners: Set<() => void>;
  serverDenials: Set<string>;
  focusAfterRecovery: string | undefined;
  metadataRefreshTarget: "eligible" | "denied" | undefined;
};
const clients = new WeakMap<QueryClient, Map<string, WorkAccess>>();

const stateFor = (client: QueryClient, slug: string): WorkAccess => {
  let states = clients.get(client);
  if (states === undefined) {
    states = new Map();
    clients.set(client, states);
    client.getQueryCache().subscribe((event) => {
      if (event.type === "added" || event.type === "updated")
        clearUnsafeQuery(client, event.query);
    });
  }
  let state = states.get(slug);
  if (state === undefined) {
    state = {
      issued: 0,
      accepted: 0,
      deniedThrough: 0,
      browserDeniedThrough: 0,
      epoch: 0,
      denied: false,
      revision: 0,
      snapshot: initialPublicAccessSnapshot,
      stamps: new WeakMap(),
      listeners: new Set(),
      serverDenials: new Set(),
      focusAfterRecovery: undefined,
      metadataRefreshTarget: undefined,
    };
    states.set(slug, state);
  }
  return state;
};
const notify = (state: WorkAccess): void => {
  state.revision++;
  state.snapshot = {
    revision: state.revision,
    denied: state.denied,
    browserDenied:
      state.denied && state.browserDeniedThrough === state.deniedThrough,
    canSeed: !state.denied && state.deniedThrough === 0 && state.epoch === 0,
  };
  for (const listener of state.listeners) listener();
};
const fenced = () => new SafePublicCatalogError("ACCESS_FENCED", 0);
export const isPublicWorkDenied = (
  client: QueryClient,
  slug: string,
): boolean => stateFor(client, slug).denied;
export const hasPublicBrowserDenial = (
  client: QueryClient,
  slug: string,
): boolean => {
  const state = stateFor(client, slug);
  return state.denied && state.browserDeniedThrough === state.deniedThrough;
};
export const publicAccessSnapshot = (
  client: QueryClient,
  slug: string,
): PublicAccessSnapshot => stateFor(client, slug).snapshot;
export const subscribePublicAccess = (
  client: QueryClient,
  slug: string,
  listener: () => void,
): (() => void) => {
  const state = stateFor(client, slug);
  state.listeners.add(listener);
  return () => {
    state.listeners.delete(listener);
  };
};
const isCurrent = (
  state: WorkAccess,
  value: unknown,
  kind: ReadKind,
): boolean => {
  if (state.denied) return false;
  if (state.deniedThrough === 0 && (kind === "image" || state.epoch === 0))
    return true;
  if (value === null || typeof value !== "object") return false;
  const stamp = state.stamps.get(value);
  return (
    stamp !== undefined &&
    stamp.kind === kind &&
    stamp.order > state.deniedThrough &&
    (kind === "image" || stamp.epoch === state.epoch) &&
    (kind !== "work" || stamp.order >= state.accepted)
  );
};
export const isPublicSecondaryCurrent = (
  client: QueryClient,
  slug: string,
  value: unknown,
  kind: "chapter" | "image",
  snapshot?: PublicAccessSnapshot,
): boolean => {
  const state = stateFor(client, slug);
  return (
    (snapshot === undefined || snapshot.revision === state.revision) &&
    isCurrent(state, value, kind)
  );
};

const hasDeniedSlug = (
  client: QueryClient,
  slugs: readonly string[],
): boolean =>
  slugs.some((slug) => clients.get(client)?.get(slug)?.denied === true);

export const isPublicDetailCurrent = (
  client: QueryClient,
  slug: string,
  value: unknown,
  snapshot?: PublicAccessSnapshot,
): boolean => {
  const state = stateFor(client, slug);
  const parsed = catalogDetailDataSchema.safeParse(value);
  return (
    parsed.success &&
    (snapshot === undefined || snapshot.revision === state.revision) &&
    parsed.data.work.slug === slug &&
    isCurrent(state, value, "work") &&
    !hasDeniedSlug(
      client,
      parsed.data.similar.map((work) => work.slug),
    )
  );
};

const clearUnsafeQuery = (
  client: QueryClient,
  query: CachedPublicQuery,
): boolean => {
  const key = query.queryKey;
  const data = query.state.data;
  if (key[0] !== "public-catalog" || data === undefined) return false;
  let unsafe = false;
  let denied = false;
  if (key[1] === "work" && typeof key[2] === "string") {
    const state = stateFor(client, key[2]);
    denied = state.denied;
    if (key[3] === "detail")
      unsafe = !isPublicDetailCurrent(client, key[2], data);
    else if (key[3] === "chapter") {
      const parsed = catalogChapterSchema.safeParse(data);
      unsafe =
        !parsed.success ||
        parsed.data.number !== key[4] ||
        !isCurrent(state, data, "chapter");
    } else if (key[3] === "chapters") {
      const parsed = chapterPageSchema.safeParse(data);
      unsafe =
        !parsed.success ||
        parsed.data.pagination.page !== key[4] ||
        !isCurrent(state, data, "chapter");
    } else if (key[3] === "image") unsafe = !isCurrent(state, data, "image");
  } else if (key[1] === "works") {
    const parsed = catalogWorkListDataSchema.safeParse(data);
    unsafe =
      !parsed.success ||
      hasDeniedSlug(
        client,
        parsed.data.items.map((work) => work.slug),
      );
  } else if (key[1] === "home") {
    const parsed = catalogHomeDataSchema.safeParse(data);
    unsafe =
      !parsed.success ||
      hasDeniedSlug(
        client,
        [
          ...parsed.data.featured,
          ...parsed.data.latestReleases.map((release) => release.work),
          ...parsed.data.suggestions.flatMap((tab) => tab.works),
        ].map((work) => work.slug),
      );
  }
  if (!unsafe) return false;
  // Clearing data keeps active observers attached; removing the Query can leave an old observer behind.
  query.setState({
    data: undefined,
    dataUpdatedAt: 0,
    status: "error",
    error: denied
      ? new SafePublicCatalogError("NOT_FOUND", 404)
      : (query.state.error ?? fenced()),
  });
  return true;
};
const fenceCachedData = (client: QueryClient): Query[] =>
  client
    .getQueryCache()
    .getAll()
    .filter((query) => clearUnsafeQuery(client, query));

// A server boundary is an observed authority result, ordered against this client's issued reads.
export const observePublicServerDenial = async (
  client: QueryClient,
  slug: string,
  boundaryId: string,
): Promise<void> => {
  const state = stateFor(client, slug);
  if (state.serverDenials.has(boundaryId)) return;
  state.serverDenials.add(boundaryId);
  state.denied = true;
  state.deniedThrough = ++state.issued;
  notify(state);
  const affected = fenceCachedData(client);
  await Promise.all(
    affected
      .filter(
        (query) =>
          !(query.queryKey[1] === "work" && query.queryKey[2] === slug),
      )
      .map((query) =>
        client.invalidateQueries({ queryKey: query.queryKey, exact: true }),
      ),
  );
};

export const requestPublicRecoveryFocus = (
  client: QueryClient,
  slug: string,
  afterServerRender: string,
): void => {
  stateFor(client, slug).focusAfterRecovery = afterServerRender;
};
export const consumePublicRecoveryFocus = (
  client: QueryClient,
  slug: string,
  serverRender: string,
): boolean => {
  const state = stateFor(client, slug);
  if (
    state.focusAfterRecovery === undefined ||
    state.focusAfterRecovery === serverRender
  )
    return false;
  state.focusAfterRecovery = undefined;
  return true;
};
export const claimPublicMetadataRefresh = (
  client: QueryClient,
  slug: string,
  target: "eligible" | "denied",
): boolean => {
  const state = stateFor(client, slug);
  if (state.metadataRefreshTarget === target) return false;
  state.metadataRefreshTarget = target;
  return true;
};
export const clearPublicMetadataRefresh = (
  client: QueryClient,
  slug: string,
): void => {
  stateFor(client, slug).metadataRefreshTarget = undefined;
};

export const readPublicWork = async (
  client: QueryClient,
  slug: string,
  read: () => Promise<CatalogDetailData>,
  recover = false,
): Promise<CatalogDetailData> => {
  const state = stateFor(client, slug);
  if (state.denied && !recover) throw fenced();
  const order = ++state.issued;
  const epoch = state.epoch;
  try {
    const data = await read();
    if (
      order <= state.deniedThrough ||
      order < state.accepted ||
      epoch !== state.epoch ||
      data.work.slug !== slug
    )
      throw fenced();
    state.stamps.set(data, { order, epoch, kind: "work" });
    state.accepted = order;
    state.denied = false;
    notify(state);
    return data;
  } catch (error: unknown) {
    if (
      isPublicNotFound(error) &&
      order > state.deniedThrough &&
      order >= state.accepted
    ) {
      state.denied = true;
      state.deniedThrough = state.issued;
      state.browserDeniedThrough = state.deniedThrough;
      notify(state);
      const affected = fenceCachedData(client);
      for (const query of affected)
        if (!(query.queryKey[1] === "work" && query.queryKey[2] === slug))
          await client.invalidateQueries({
            queryKey: query.queryKey,
            exact: true,
          });
    }
    throw error;
  }
};

export const readPublicSecondary = async <T extends object>(
  client: QueryClient,
  slug: string,
  kind: "chapter" | "image",
  read: () => Promise<T>,
): Promise<T> => {
  const state = stateFor(client, slug);
  if (state.denied) throw fenced();
  const order = ++state.issued;
  const epoch = state.epoch;
  try {
    const data = await read();
    const current = stateFor(client, slug);
    if (
      current.denied ||
      order <= current.deniedThrough ||
      (kind === "chapter" && epoch !== current.epoch)
    )
      throw fenced();
    state.stamps.set(data, { order, epoch, kind });
    return data;
  } catch (error: unknown) {
    const current = stateFor(client, slug);
    if (
      kind === "chapter" &&
      isPublicNotFound(error) &&
      epoch === current.epoch &&
      !current.denied
    ) {
      state.stamps.set(error, { order, epoch, kind });
    }
    throw error;
  }
};

/** Reconcile only after the child Query has committed its 404, so unmount cannot erase it. */
export const reconcilePublicChapterAbsence = async (
  client: QueryClient,
  slug: string,
  error: unknown,
  refreshParent: () => Promise<unknown>,
): Promise<void> => {
  if (!isPublicNotFound(error)) return;
  const state = stateFor(client, slug);
  const stamp = state.stamps.get(error);
  if (state.denied || stamp?.kind !== "chapter" || stamp.epoch !== state.epoch)
    return;
  state.epoch++;
  notify(state);
  fenceCachedData(client);
  try {
    await refreshParent();
  } catch {
    /* The parent Query exposes its own failure; preserve the child's confirmed 404. */
  }
};

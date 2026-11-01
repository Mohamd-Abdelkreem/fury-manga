"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { hashKey, useQueryClient, useQuery } from "@tanstack/react-query";
import type {
  CatalogDetailData,
  CatalogHomeData,
  CatalogWorkListQueryInput,
  CatalogWorkListData,
  CatalogCategoryListQueryInput,
  CatalogCategoryListData,
} from "@fury/contracts";

import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { SafePublicCatalogError } from "../model/public-catalog.errors";
import {
  readPublicWork,
  readPublicSecondary,
  reconcilePublicChapterAbsence,
  isPublicWorkDenied,
  publicAccessSnapshot,
  initialPublicAccessSnapshot,
  type PublicAccessSnapshot,
  subscribePublicAccess,
  isPublicDetailCurrent,
  isPublicSecondaryCurrent,
} from "./public-catalog.access";
import { publicCatalogApi } from "../api/public-catalog.api";
import type { PublicListOptions } from "../model/public-catalog.types";
import { publicCatalogKeys } from "./public-catalog.keys";

const recoverDeniedReferences = async (
  client: QueryClient,
  slugs: readonly string[],
  signal: AbortSignal,
): Promise<void> => {
  const denied = [...new Set(slugs)].filter((slug) =>
    isPublicWorkDenied(client, slug),
  );
  await Promise.all(
    denied.map((slug) =>
      readPublicWork(
        client,
        slug,
        () => publicCatalogApi.getDetail(slug, signal),
        true,
      ),
    ),
  );
};

export const usePublicCatalogWorks = (
  query: CatalogWorkListQueryInput,
  options: PublicListOptions<
    CatalogWorkListQueryInput,
    CatalogWorkListData
  > = {},
) => {
  const client = useQueryClient();
  const key = publicCatalogKeys.works(query);
  const seed = options.seed;
  return useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      const data = await publicCatalogApi.listWorks(query, signal);
      await recoverDeniedReferences(
        client,
        data.items.map((work) => work.slug),
        signal,
      );
      return data;
    },
    enabled: options.enabled ?? true,
    retry: false,
    staleTime: 0,
    initialData:
      seed !== undefined &&
      hashKey(publicCatalogKeys.works(seed.query)) === hashKey(key)
        ? seed.data
        : undefined,
  });
};

export const usePublicCatalogCategories = (
  query: CatalogCategoryListQueryInput,
  options: PublicListOptions<
    CatalogCategoryListQueryInput,
    CatalogCategoryListData
  > = {},
) => {
  const key = publicCatalogKeys.categories(query);
  const seed = options.seed;
  return useQuery({
    queryKey: key,
    queryFn: ({ signal }) => publicCatalogApi.listCategories(query, signal),
    enabled: options.enabled ?? true,
    retry: false,
    staleTime: 0,
    initialData:
      seed !== undefined &&
      hashKey(publicCatalogKeys.categories(seed.query)) === hashKey(key)
        ? seed.data
        : undefined,
  });
};

export const usePublicCatalogHome = (
  options: Readonly<{ enabled?: boolean; seed?: CatalogHomeData }> = {},
) => {
  const client = useQueryClient();
  return useQuery({
    queryKey: publicCatalogKeys.home,
    queryFn: async ({ signal }) => {
      const data = await publicCatalogApi.getHome(signal);
      await recoverDeniedReferences(
        client,
        [
          ...data.featured,
          ...data.latestReleases.map((release) => release.work),
          ...data.suggestions.flatMap((tab) => tab.works),
        ].map((work) => work.slug),
        signal,
      );
      return data;
    },
    enabled: options.enabled ?? true,
    retry: false,
    staleTime: 0,
    ...(options.seed === undefined ? {} : { initialData: options.seed }),
  });
};

const serverAccessSnapshot = () => initialPublicAccessSnapshot;
const usePublicAccess = (
  client: QueryClient,
  slug: string,
): PublicAccessSnapshot => {
  const subscribe = useCallback(
    (listener: () => void) => subscribePublicAccess(client, slug, listener),
    [client, slug],
  );
  return useSyncExternalStore(
    subscribe,
    () => publicAccessSnapshot(client, slug),
    serverAccessSnapshot,
  );
};

const refreshPublicDetail = async (
  client: QueryClient,
  slug: string,
): Promise<CatalogDetailData> => {
  const queryKey = publicCatalogKeys.detail(slug);
  await client.cancelQueries({ queryKey, exact: true });
  return client.fetchQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const data = await readPublicWork(
        client,
        slug,
        () => publicCatalogApi.getDetail(slug, signal),
        true,
      );
      await recoverDeniedReferences(
        client,
        data.similar.map((work) => work.slug),
        signal,
      );
      return data;
    },
    staleTime: 0,
    retry: false,
    structuralSharing: false,
  });
};

export const usePublicCatalogDetail = (
  workSlug: string,
  options: Readonly<{
    enabled?: boolean;
    seed?: Readonly<{ workSlug: string; data: CatalogDetailData }>;
  }> = {},
) => {
  const client = useQueryClient();
  const key = publicCatalogKeys.detail(workSlug);
  const slug = key[2];
  const access = usePublicAccess(client, slug);
  const { denied } = access;
  const retryAccess = useCallback(
    () => refreshPublicDetail(client, slug),
    [client, slug],
  );
  const seed = options.seed;
  const initialData =
    seed !== undefined &&
    publicCatalogKeys.detail(seed.workSlug)[2] === slug &&
    access.canSeed
      ? seed.data
      : undefined;
  const query = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      const data = await readPublicWork(client, slug, () =>
        publicCatalogApi.getDetail(slug, signal),
      );
      await recoverDeniedReferences(
        client,
        data.similar.map((work) => work.slug),
        signal,
      );
      return data;
    },
    enabled: (options.enabled ?? true) && !denied,
    retry: false,
    staleTime: 0,
    structuralSharing: false,
    ...(initialData === undefined ? {} : { initialData }),
  });
  if (denied)
    return {
      ...query,
      denied,
      browserDenied: access.browserDenied,
      retryAccess,
      data: undefined,
      error: new SafePublicCatalogError("NOT_FOUND", 404),
      status: "error" as const,
      isError: true,
      isSuccess: false,
      isPending: false,
    };
  if (
    query.data !== undefined &&
    !isPublicDetailCurrent(client, slug, query.data, access)
  )
    return {
      ...query,
      denied,
      browserDenied: access.browserDenied,
      retryAccess,
      data: undefined,
      isSuccess: false,
      isPending: !query.isError,
      status: query.isError ? ("error" as const) : ("pending" as const),
    };
  return { ...query, denied, browserDenied: access.browserDenied, retryAccess };
};

const usePublicSecondary = <T extends object>(
  workSlug: string,
  key: QueryKey,
  kind: "chapter" | "image",
  request: (signal: AbortSignal) => Promise<T>,
  enabled = true,
) => {
  const client = useQueryClient();
  const slug = publicCatalogKeys.work(workSlug)[2];
  const access = usePublicAccess(client, slug);
  const { denied } = access;
  const query = useQuery({
    queryKey: key,
    queryFn: ({ signal }) =>
      readPublicSecondary(client, slug, kind, () => request(signal)),
    enabled: enabled && !denied,
    retry: false,
    // A parent eligibility refresh remounts consumers of an already failed child.
    retryOnMount: false,
    staleTime: 0,
    structuralSharing: false,
  });
  useEffect(() => {
    if (kind !== "chapter" || !query.isError) return;
    void reconcilePublicChapterAbsence(client, slug, query.error, () =>
      refreshPublicDetail(client, slug),
    );
  }, [client, slug, kind, query.isError, query.error]);
  if (denied)
    return {
      ...query,
      denied,
      data: undefined,
      error: new SafePublicCatalogError("NOT_FOUND", 404),
      status: "error" as const,
      isError: true,
      isSuccess: false,
      isPending: false,
    };
  if (
    query.data !== undefined &&
    !isPublicSecondaryCurrent(client, slug, query.data, kind, access)
  )
    return {
      ...query,
      denied,
      data: undefined,
      isSuccess: false,
      isPending: !query.isError,
      status: query.isError ? ("error" as const) : ("pending" as const),
    };
  return { ...query, denied };
};

export const usePublicCatalogChapters = (
  slug: string,
  page = 1,
  enabled = true,
) =>
  usePublicSecondary(
    slug,
    publicCatalogKeys.chapters(slug, page),
    "chapter",
    (signal) => publicCatalogApi.listChapters(slug, page, signal),
    enabled,
  );
export const usePublicCatalogChapter = (
  slug: string,
  number: number,
  enabled = true,
) =>
  usePublicSecondary(
    slug,
    publicCatalogKeys.chapter(slug, number),
    "chapter",
    (signal) => publicCatalogApi.getChapter(slug, number, signal),
    enabled,
  );
export const usePublicCatalogImage = (
  slug: string,
  kind: "cover" | "background",
  enabled = true,
) =>
  usePublicSecondary(
    slug,
    publicCatalogKeys.image(slug, kind),
    "image",
    (signal) => publicCatalogApi.getImage(slug, kind, signal),
    enabled,
  );

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CategoryListQuery, CreateWorkBody } from "@fury/contracts";

import { SafeAdminContentError } from "../api/admin-content.api";
import { adminContentKeys } from "../model/admin-content.keys";
import { mediaKeys } from "@/features/media/model/media.keys";
import {
  useAdminCategoryDetail,
  useAdminCategoryList,
  useCreateAdminCategory,
  useCreateAdminWork,
  useAdminWorkDetail,
  useUpdateAdminCategory,
  useUpdateAdminWork,
} from "./admin-content.hooks";

const apiMock = vi.hoisted(() => ({
  listCategories: vi.fn(),
  getCategory: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  moveCategory: vi.fn(),
  getWork: vi.fn(),
  createWork: vi.fn(),
  updateWork: vi.fn(),
}));
const sessionMock = vi.hoisted(() => ({
  id: "11111111-1111-4111-8111-111111111111",
  role: "ADMIN",
}));

vi.mock("../api/admin-content.api", () => ({
  SafeAdminContentError: class extends Error {
    constructor(
      readonly code: string,
      readonly statusCode: number,
      readonly requestId: string,
      readonly fieldPaths: readonly string[] = [],
    ) {
      super("safe category failure");
    }
  },
  adminContentApi: apiMock,
}));

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({
    data: {
      user: {
        id: sessionMock.id,
        role: sessionMock.role,
        status: "ACTIVE",
        emailVerifiedAt: "2026-09-25T10:00:00.000Z",
      },
    },
    status: "success",
    error: null,
  }),
}));

const category = {
  id: "22222222-2222-4222-8222-222222222222",
  displayName: "خيال",
  slug: "fantasy",
  enabled: true,
  displayPosition: 1,
  worksCount: 2,
  version: 4,
  createdAt: "2026-09-25T10:00:00.000Z",
  updatedAt: "2026-09-25T10:00:00.000Z",
} as const;
const work = {
  id: "33333333-3333-4333-8333-333333333333",
  title: "Saved Work",
  alternativeTitle: null,
  synopsis: null,
  author: null,
  artist: null,
  slug: "saved-work",
  type: "manga",
  storyStatus: "ongoing",
  publicationStatus: "draft",
  publishedAt: null,
  featuredHome: false,
  featuredOrder: null,
  coverAssetId: null,
  backgroundAssetId: null,
  tags: [],
  version: 2,
  createdAt: "2026-09-25T10:00:00.000Z",
  updatedAt: "2026-09-25T10:00:00.000Z",
  categories: [category],
} as const;
const listData = {
  items: [category],
  pagination: {
    page: 1,
    limit: 25,
    total: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
} as const;
const staleListData = {
  ...listData,
  items: [{ ...category, displayName: "Late old response" }],
};

let queryClient: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  vi.resetAllMocks();
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  sessionMock.id = "11111111-1111-4111-8111-111111111111";
  sessionMock.role = "ADMIN";
});

describe("administrator category query identity and state", () => {
  it("separates actors, search/filter values, and pages in the cache key", () => {
    const first: CategoryListQuery = {
      page: 1,
      limit: 25,
      search: "fantasy",
      enabled: true,
    };
    expect(adminContentKeys.categoryList("actor-one", first)).not.toEqual(
      adminContentKeys.categoryList("actor-two", first),
    );
    expect(adminContentKeys.categoryList("actor-one", first)).not.toEqual(
      adminContentKeys.categoryList("actor-one", { ...first, page: 2 }),
    );
    expect(adminContentKeys.categoryList("actor-one", first)).not.toEqual(
      adminContentKeys.categoryList("actor-one", { ...first, enabled: false }),
    );
    expect(adminContentKeys.categoryList("actor-one", first)).not.toEqual(
      adminContentKeys.categoryList("actor-one", {
        ...first,
        search: "action",
      }),
    );
    expect(
      adminContentKeys.categoryDetail("actor-one", category.id),
    ).not.toEqual(adminContentKeys.categoryDetail("actor-two", category.id));
    expect(adminContentKeys.categoryPicker("actor-one")).not.toEqual(
      adminContentKeys.categoryPicker("actor-two"),
    );
  });

  it("uses abortable server queries and changes cache keys when page changes", async () => {
    apiMock.listCategories.mockResolvedValue(listData);
    const initialQuery: CategoryListQuery = { page: 1, limit: 25 };
    const { result, rerender } = renderHook(
      ({ page }: { page: number }) =>
        useAdminCategoryList({ ...initialQuery, page }),
      { wrapper, initialProps: { page: 1 } },
    );

    await waitFor(() => {
      expect(result.current.data?.items).toEqual([category]);
    });
    expect(apiMock.listCategories).toHaveBeenCalledWith(
      initialQuery,
      expect.any(AbortSignal),
    );
    expect(
      queryClient.getQueryData(
        adminContentKeys.categoryList(sessionMock.id, initialQuery),
      ),
    ).toEqual(listData);

    rerender({ page: 2 });
    await waitFor(() => {
      expect(apiMock.listCategories).toHaveBeenCalledTimes(2);
    });
    expect(
      queryClient.getQueryData(
        adminContentKeys.categoryList(sessionMock.id, {
          ...initialQuery,
          page: 2,
        }),
      ),
    ).toEqual(listData);
  });

  it("invalidates only the acting administrator's category cache after update", async () => {
    apiMock.updateCategory.mockResolvedValue({ ...category, version: 5 });
    const actorListKey = adminContentKeys.categoryList(sessionMock.id, {
      page: 1,
      limit: 25,
    });
    const otherListKey = adminContentKeys.categoryList("other-admin", {
      page: 1,
      limit: 25,
    });
    queryClient.setQueryData(actorListKey, listData);
    queryClient.setQueryData(otherListKey, listData);

    const { result } = renderHook(() => useUpdateAdminCategory(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({
        categoryId: category.id,
        body: { expectedVersion: 4, displayName: "خيال جديد" },
      });
    });

    expect(queryClient.getQueryState(actorListKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(otherListKey)?.isInvalidated).toBe(false);
    expect(
      queryClient.getQueryData(
        adminContentKeys.categoryDetail(sessionMock.id, category.id),
      ),
    ).toMatchObject({ displayName: "خيال", version: 5 });
  });

  it("reconciles an ambiguous create by its submitted UUID without a retry", async () => {
    apiMock.createCategory.mockRejectedValueOnce(
      new SafeAdminContentError("NETWORK_ERROR", 0, ""),
    );
    apiMock.getCategory.mockResolvedValue({
      ...category,
      displayName: "New category",
      slug: "new-category",
    });
    const { result } = renderHook(() => useCreateAdminCategory(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id: "33333333-3333-4333-8333-333333333333",
        displayName: "New category",
        slug: "new-category",
      });
    });

    expect(apiMock.createCategory).toHaveBeenCalledTimes(1);
    expect(apiMock.getCategory).toHaveBeenCalledWith(
      "33333333-3333-4333-8333-333333333333",
    );
  });

  it("makes denial terminal and prevents late reads from restoring cached data", async () => {
    let resolveList: ((value: typeof listData) => void) | undefined;
    apiMock.listCategories.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveList = resolve;
        }),
    );
    apiMock.getCategory.mockRejectedValue(
      new SafeAdminContentError("FORBIDDEN", 403, "request-denied"),
    );
    const filters: CategoryListQuery = { page: 1, limit: 25 };
    const listKey = adminContentKeys.categoryList(sessionMock.id, filters);
    queryClient.setQueryData(listKey, listData);
    const { result, rerender } = renderHook(
      () => ({
        list: useAdminCategoryList(filters),
        detail: useAdminCategoryDetail(category.id),
      }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.list.denied).toBe(true);
    });
    expect(queryClient.getQueryData(listKey)).toBeUndefined();
    act(() => {
      resolveList?.(listData);
    });
    await waitFor(() => {
      expect(queryClient.getQueryData(listKey)).toBeUndefined();
    });

    rerender();
    expect(result.current.list.denied).toBe(true);
    expect(apiMock.listCategories).toHaveBeenCalledTimes(1);
  });

  it("recovers denial only from a newer successful actor-scoped list read", async () => {
    let resolveList: ((value: typeof staleListData) => void) | undefined;
    apiMock.listCategories.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveList = resolve;
        }),
    );
    apiMock.getCategory.mockRejectedValue(
      new SafeAdminContentError("FORBIDDEN", 403, "request-denied"),
    );
    const filters: CategoryListQuery = { page: 1, limit: 25 };
    const { result } = renderHook(
      () => ({
        list: useAdminCategoryList(filters),
        detail: useAdminCategoryDetail(category.id),
      }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.list.denied).toBe(true);
    });
    apiMock.listCategories.mockResolvedValue(listData);
    apiMock.getCategory.mockResolvedValue(category);
    await act(async () => {
      await result.current.list.retryAccess();
    });
    await waitFor(() => {
      expect(result.current.list.denied).toBe(false);
    });
    await waitFor(() => {
      expect(result.current.list.data).toEqual(listData);
    });

    act(() => {
      resolveList?.(staleListData);
    });
    await waitFor(() => {
      expect(result.current.list.data).toEqual(listData);
    });
  });
});

describe("administrator Work draft queries and mutations", () => {
  it("uses actor-and-resource detail keys and an abortable read", async () => {
    expect(adminContentKeys.workDetail("actor-one", work.id)).not.toEqual(
      adminContentKeys.workDetail("actor-two", work.id),
    );
    expect(adminContentKeys.workDetail(sessionMock.id, work.id)).not.toEqual(
      adminContentKeys.workDetail(
        sessionMock.id,
        "44444444-4444-4444-8444-444444444444",
      ),
    );
    let signal: AbortSignal | undefined;
    let resolveWork: ((saved: typeof work) => void) | undefined;
    apiMock.getWork.mockImplementation(
      (_id: string, receivedSignal: AbortSignal) => {
        signal = receivedSignal;
        return new Promise<typeof work>((resolve) => {
          resolveWork = resolve;
        });
      },
    );
    const { unmount } = renderHook(() => useAdminWorkDetail(work.id), {
      wrapper,
    });
    await waitFor(() => {
      expect(signal).toBeInstanceOf(AbortSignal);
    });
    expect(apiMock.getWork).toHaveBeenCalledWith(
      work.id,
      expect.any(AbortSignal),
    );
    unmount();
    expect(signal?.aborted).toBe(true);
    resolveWork?.(work);
  });

  it("reconciles an unknown create by its submitted UUID and invalidates only scoped caches", async () => {
    const body: CreateWorkBody = {
      id: work.id,
      title: work.title,
      slug: work.slug,
      type: work.type,
      storyStatus: work.storyStatus,
      categoryIds: [category.id],
    };
    apiMock.createWork.mockRejectedValueOnce(
      new SafeAdminContentError("NETWORK_ERROR", 0, ""),
    );
    apiMock.getWork.mockResolvedValue(work);
    const actorWorkKey = adminContentKeys.workDetail(sessionMock.id, work.id);
    const actorCategoriesKey = adminContentKeys.categoryPicker(sessionMock.id);
    const otherWorkKey = adminContentKeys.workDetail("other-admin", work.id);
    const coverReferenceKey = mediaKeys.reference(
      sessionMock.id,
      "work_cover",
      work.id,
    );
    queryClient.setQueryData(actorWorkKey, { ...work, title: "Stale cache" });
    queryClient.setQueryData(actorCategoriesKey, [category]);
    queryClient.setQueryData(otherWorkKey, work);
    queryClient.setQueryData(coverReferenceKey, null);

    const { result } = renderHook(() => useCreateAdminWork(), { wrapper });
    await act(async () => {
      await expect(result.current.mutateAsync(body)).resolves.toEqual(work);
    });

    expect(apiMock.createWork).toHaveBeenCalledTimes(1);
    expect(apiMock.getWork).toHaveBeenCalledWith(work.id);
    expect(queryClient.getQueryData(actorWorkKey)).toEqual(work);
    expect(queryClient.getQueryState(actorCategoriesKey)?.isInvalidated).toBe(
      true,
    );
    expect(queryClient.getQueryState(coverReferenceKey)?.isInvalidated).toBe(
      true,
    );
    expect(queryClient.getQueryState(otherWorkKey)?.isInvalidated).toBe(false);
  });

  it("does not treat an occupied UUID with different content as the created Work", async () => {
    const failure = new SafeAdminContentError("NETWORK_ERROR", 0, "");
    apiMock.createWork.mockRejectedValueOnce(failure);
    apiMock.getWork.mockResolvedValue({
      ...work,
      title: "Different saved work",
    });
    const { result } = renderHook(() => useCreateAdminWork(), { wrapper });

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          id: work.id,
          title: work.title,
          slug: work.slug,
          type: work.type,
          storyStatus: work.storyStatus,
        }),
      ).rejects.toBeInstanceOf(SafeAdminContentError);
    });
    expect(apiMock.createWork).toHaveBeenCalledTimes(1);
    expect(apiMock.getWork).toHaveBeenCalledWith(work.id);
  });

  it("invalidates stale detail after an update conflict and fences denied reads", async () => {
    const detailKey = adminContentKeys.workDetail(sessionMock.id, work.id);
    queryClient.setQueryData(detailKey, work);
    apiMock.updateWork.mockRejectedValue(
      new SafeAdminContentError("CONTENT_STALE_WRITE", 409, "stale-work"),
    );
    const { result } = renderHook(() => useUpdateAdminWork(), { wrapper });
    await act(async () => {
      await expect(
        result.current.mutateAsync({
          workId: work.id,
          body: { expectedVersion: work.version, title: "Local title" },
        }),
      ).rejects.toBeInstanceOf(SafeAdminContentError);
    });
    expect(queryClient.getQueryState(detailKey)?.isInvalidated).toBe(true);

    apiMock.getWork.mockRejectedValue(
      new SafeAdminContentError("FORBIDDEN", 403, "denied-work"),
    );
    const { result: detail } = renderHook(() => useAdminWorkDetail(work.id), {
      wrapper,
    });
    await waitFor(() => {
      expect(detail.current.denied).toBe(true);
    });
    expect(queryClient.getQueryData(detailKey)).toBeUndefined();
  });
});

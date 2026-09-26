import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  AdminWork,
  CategoryListQuery,
  CreateWorkBody,
} from "@fury/contracts";

import { SafeAdminContentError } from "../api/admin-content.api";
import { adminContentKeys } from "../model/admin-content.keys";
import { mediaKeys } from "@/features/media/model/media.keys";
import {
  useAdminCategoryDetail,
  useAdminCategoryList,
  useAdminCategoryPicker,
  useCreateAdminCategory,
  useCreateAdminWork,
  useAdminWorkDetail,
  useUpdateAdminCategory,
  useUpdateAdminWork,
  useTransitionAdminWork,
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
  transitionWork: vi.fn(),
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

  it("requests only one bounded enabled picker page per search and page key", async () => {
    apiMock.listCategories.mockResolvedValue(listData);
    const { result, rerender } = renderHook(
      ({ page, search }: { page: number; search: string }) =>
        useAdminCategoryPicker(page, search),
      { wrapper, initialProps: { page: 1, search: "" } },
    );
    await waitFor(() => {
      expect(result.current.data?.items).toEqual([category]);
    });
    expect(apiMock.listCategories).toHaveBeenCalledWith(
      { page: 1, limit: 100, enabled: true },
      expect.any(AbortSignal),
    );
    rerender({ page: 2, search: "" });
    await waitFor(() => {
      expect(apiMock.listCategories).toHaveBeenCalledTimes(2);
    });
    expect(apiMock.listCategories).toHaveBeenLastCalledWith(
      { page: 2, limit: 100, enabled: true },
      expect.any(AbortSignal),
    );
    rerender({ page: 1, search: "خيال" });
    await waitFor(() => {
      expect(apiMock.listCategories).toHaveBeenCalledTimes(3);
    });
    expect(apiMock.listCategories).toHaveBeenLastCalledWith(
      { page: 1, limit: 100, enabled: true, search: "خيال" },
      expect.any(AbortSignal),
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
    const actorWorkKey = adminContentKeys.workDetail(sessionMock.id, work.id);
    const otherWorkKey = adminContentKeys.workDetail("other-admin", work.id);
    queryClient.setQueryData(actorWorkKey, work);
    queryClient.setQueryData(otherWorkKey, work);

    const { result } = renderHook(() => useUpdateAdminCategory(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({
        categoryId: category.id,
        body: { expectedVersion: 4, displayName: "خيال جديد" },
      });
    });

    expect(queryClient.getQueryState(actorListKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(otherListKey)?.isInvalidated).toBe(false);
    expect(queryClient.getQueryState(actorWorkKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(otherWorkKey)?.isInvalidated).toBe(false);
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
  it("confirms a work transition before invalidating the current actor's detail and lists", async () => {
    const transition = {
      resourceType: "work",
      resourceId: work.id,
      publicationStatus: "published",
      publishedAt: "2026-09-26T10:00:00.000Z",
      publicationEventId: category.id,
      version: work.version + 1,
      transitioned: true,
    };
    apiMock.transitionWork.mockResolvedValue(transition);
    const detailKey = adminContentKeys.workDetail(sessionMock.id, work.id);
    const otherKey = adminContentKeys.workDetail("other-admin", work.id);
    queryClient.setQueryData(detailKey, work);
    queryClient.setQueryData(otherKey, work);
    const { result } = renderHook(() => useTransitionAdminWork(), { wrapper });
    await act(async () => {
      await expect(
        result.current.mutateAsync({
          workId: work.id,
          body: { expectedVersion: work.version, targetState: "published" },
        }),
      ).resolves.toEqual(transition);
    });
    expect(apiMock.transitionWork).toHaveBeenCalledWith(work.id, {
      expectedVersion: work.version,
      targetState: "published",
    });
    expect(queryClient.getQueryState(detailKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(otherKey)?.isInvalidated).toBe(false);
  });
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

  it("keeps an ambiguous create unresolved after UUID 404 until deliberate same-ID retry", async () => {
    const body: CreateWorkBody = {
      id: work.id,
      title: work.title,
      slug: work.slug,
      type: work.type,
      storyStatus: work.storyStatus,
      categoryIds: [category.id],
    };
    apiMock.createWork
      .mockRejectedValueOnce(new SafeAdminContentError("NETWORK_ERROR", 0, ""))
      .mockResolvedValueOnce(work);
    apiMock.getWork.mockRejectedValueOnce(
      new SafeAdminContentError("NOT_FOUND", 404, "readback-404"),
    );
    const { result } = renderHook(() => useCreateAdminWork(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(body)).rejects.toMatchObject({
        code: "NETWORK_ERROR",
      });
    });
    expect(apiMock.createWork).toHaveBeenCalledTimes(1);
    expect(apiMock.getWork).toHaveBeenCalledWith(work.id);
    await act(async () => {
      await expect(result.current.mutateAsync(body)).resolves.toEqual(work);
    });
    expect(apiMock.createWork).toHaveBeenCalledTimes(2);
    expect(apiMock.createWork).toHaveBeenNthCalledWith(2, body);
  });

  it("reconciles an explicit same-ID POST conflict after an ambiguous 404 only after a matching second GET", async () => {
    const body: CreateWorkBody = {
      id: work.id,
      title: work.title,
      slug: work.slug,
      type: work.type,
      storyStatus: work.storyStatus,
      categoryIds: [category.id],
    };
    apiMock.createWork
      .mockRejectedValueOnce(new SafeAdminContentError("NETWORK_ERROR", 0, ""))
      .mockRejectedValueOnce(
        new SafeAdminContentError("CONTENT_CONFLICT", 409, ""),
      );
    apiMock.getWork
      .mockRejectedValueOnce(new SafeAdminContentError("NOT_FOUND", 404, ""))
      .mockResolvedValueOnce(work);
    const { result } = renderHook(() => useCreateAdminWork(), { wrapper });
    await act(async () => {
      await expect(result.current.mutateAsync(body)).rejects.toMatchObject({
        code: "NETWORK_ERROR",
      });
    });
    await act(async () => {
      await expect(result.current.mutateAsync(body)).resolves.toEqual(work);
    });
    expect(apiMock.createWork).toHaveBeenCalledTimes(2);
    expect(apiMock.getWork).toHaveBeenCalledTimes(2);
  });

  it("refuses an occupied ID with mismatched intent after the ambiguous 404 and explicit 409", async () => {
    const body: CreateWorkBody = {
      id: work.id,
      title: work.title,
      slug: work.slug,
      type: work.type,
      storyStatus: work.storyStatus,
      categoryIds: [category.id],
    };
    apiMock.createWork
      .mockRejectedValueOnce(new SafeAdminContentError("NETWORK_ERROR", 0, ""))
      .mockRejectedValueOnce(
        new SafeAdminContentError("CONTENT_CONFLICT", 409, ""),
      );
    apiMock.getWork
      .mockRejectedValueOnce(new SafeAdminContentError("NOT_FOUND", 404, ""))
      .mockResolvedValueOnce({ ...work, title: "Another editor's record" });
    const { result } = renderHook(() => useCreateAdminWork(), { wrapper });
    await act(async () => {
      await expect(result.current.mutateAsync(body)).rejects.toMatchObject({
        code: "NETWORK_ERROR",
      });
      await expect(result.current.mutateAsync(body)).rejects.toMatchObject({
        code: "CONTENT_CONFLICT",
      });
    });
    expect(apiMock.createWork).toHaveBeenCalledTimes(2);
    expect(apiMock.getWork).toHaveBeenCalledTimes(2);
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

  it("does not cache a late Work save for a different signed-in administrator", async () => {
    const actorA = sessionMock.id;
    const actorB = "77777777-7777-4777-8777-777777777777";
    let resolveUpdate: ((saved: AdminWork) => void) | undefined;
    apiMock.updateWork.mockImplementation(
      () =>
        new Promise<AdminWork>((resolve) => {
          resolveUpdate = resolve;
        }),
    );
    const { result, rerender } = renderHook(() => useUpdateAdminWork(), {
      wrapper,
    });
    let pending: Promise<unknown> | undefined;
    act(() => {
      pending = result.current.mutateAsync({
        workId: work.id,
        body: { expectedVersion: work.version, title: "Updated title" },
      });
    });
    await waitFor(() => {
      expect(resolveUpdate).toBeDefined();
    });
    sessionMock.id = actorB;
    rerender();
    await act(async () => {
      resolveUpdate?.({
        ...work,
        title: "Updated title",
        version: 3,
        tags: [],
        categories: [{ ...category }],
      });
      await pending;
    });
    expect(
      queryClient.getQueryData(adminContentKeys.workDetail(actorB, work.id)),
    ).toBeUndefined();
    expect(
      queryClient.getQueryData(adminContentKeys.workDetail(actorA, work.id)),
    ).toBeUndefined();
  });

  it("keeps a newer cached detail when an older authorized GET completes late", async () => {
    let finish: ((saved: AdminWork) => void) | undefined;
    apiMock.getWork.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const { result } = renderHook(() => useAdminWorkDetail(work.id), {
      wrapper,
    });
    await waitFor(() => {
      expect(apiMock.getWork).toHaveBeenCalledOnce();
    });
    const newer = { ...work, version: 12, title: "Newest Work" };
    const key = adminContentKeys.workDetail(sessionMock.id, work.id);
    act(() => {
      queryClient.setQueryData(key, newer);
    });
    act(() => {
      finish?.({
        ...work,
        tags: [...work.tags],
        categories: [...work.categories],
      });
    });
    expect(queryClient.getQueryData(key)).toEqual(newer);
    await waitFor(() => {
      expect(result.current.data).toEqual(newer);
    });
  });

  it("fences an older equal-version GET after a fresher category projection, then accepts a later equal-version read", async () => {
    let finishOld: ((saved: AdminWork) => void) | undefined;
    const refreshed = {
      ...work,
      categories: [
        {
          ...category,
          displayName: "خيال جديد",
          enabled: false,
          displayPosition: 4,
        },
      ],
    };
    const latest = {
      ...work,
      categories: [
        {
          ...category,
          displayName: "خيال أحدث",
          enabled: true,
          displayPosition: 2,
        },
      ],
    };
    apiMock.getWork
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finishOld = resolve;
          }),
      )
      .mockResolvedValueOnce(refreshed)
      .mockResolvedValueOnce(latest);
    const { result } = renderHook(
      () => ({
        detail: useAdminWorkDetail(work.id),
        create: useCreateAdminWork(),
      }),
      { wrapper },
    );
    await waitFor(() => {
      expect(apiMock.getWork).toHaveBeenCalledOnce();
    });
    const key = adminContentKeys.workDetail(sessionMock.id, work.id);
    await act(async () => {
      await result.current.create.readback(work.id);
    });
    expect(queryClient.getQueryData(key)).toEqual(refreshed);
    act(() => {
      finishOld?.({
        ...work,
        tags: [...work.tags],
        categories: [{ ...category }],
      });
    });
    expect(queryClient.getQueryData(key)).toEqual(refreshed);
    await waitFor(() => {
      expect(result.current.detail.data).toEqual(refreshed);
    });
    await act(async () => {
      await result.current.detail.refetch();
    });
    expect(queryClient.getQueryData(key)).toEqual(latest);
    await waitFor(() => {
      expect(result.current.detail.data).toEqual(latest);
    });
  });

  it("does not resurrect an older equal-version category projection after detail GC", async () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 20 },
        mutations: { retry: false },
      },
    });
    const refreshed: AdminWork = {
      ...work,
      tags: [...work.tags],
      categories: [{ ...category, displayName: "Updated", enabled: false }],
    };
    const latest: AdminWork = {
      ...work,
      tags: [...work.tags],
      categories: [
        { ...category, displayName: "Updated again", enabled: true },
      ],
    };
    let finishOld: ((saved: AdminWork) => void) | undefined;
    apiMock.getWork
      .mockImplementationOnce(
        () =>
          new Promise<AdminWork>((resolve) => {
            finishOld = resolve;
          }),
      )
      .mockResolvedValueOnce(refreshed)
      .mockResolvedValueOnce(latest);
    const { result } = renderHook(() => useCreateAdminWork(), { wrapper });
    const key = adminContentKeys.workDetail(sessionMock.id, work.id);
    let pendingOld: Promise<AdminWork> | undefined;
    act(() => {
      pendingOld = result.current.readback(work.id);
    });
    await waitFor(() => {
      expect(finishOld).toBeDefined();
    });
    vi.useFakeTimers();
    try {
      await act(async () => {
        await expect(result.current.readback(work.id)).resolves.toEqual(
          refreshed,
        );
      });
      expect(queryClient.getQueryData(key)).toEqual(refreshed);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(21);
      });
      expect(queryClient.getQueryState(key)).toBeUndefined();
      await act(async () => {
        finishOld?.({
          ...work,
          tags: [...work.tags],
          categories: [{ ...category }],
        });
        await expect(pendingOld).rejects.toMatchObject({
          code: "CONTENT_STALE_WRITE",
        });
      });
      expect(queryClient.getQueryData(key)).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }

    await act(async () => {
      await expect(result.current.readback(work.id)).resolves.toEqual(latest);
    });
    expect(queryClient.getQueryData(key)).toEqual(latest);
    expect(apiMock.getWork).toHaveBeenCalledTimes(3);
  });

  it("does not replace a newer actor-scoped Work with an older create, edit, or manual readback", async () => {
    const body: CreateWorkBody = {
      id: work.id,
      title: work.title,
      slug: work.slug,
      type: work.type,
      storyStatus: work.storyStatus,
      categoryIds: [category.id],
    };
    const key = adminContentKeys.workDetail(sessionMock.id, work.id);
    const newer = { ...work, version: 9, title: "Newer authoritative detail" };
    queryClient.setQueryData(key, newer);
    apiMock.createWork.mockResolvedValue(work);
    apiMock.updateWork.mockResolvedValue({ ...work, version: 3 });
    apiMock.getWork.mockResolvedValue({ ...work, version: 4 });
    const { result } = renderHook(
      () => ({
        create: useCreateAdminWork(),
        update: useUpdateAdminWork(),
      }),
      { wrapper },
    );
    await act(async () => {
      await result.current.create.mutateAsync(body);
      await result.current.update.mutateAsync({
        workId: work.id,
        body: { expectedVersion: 2, title: "Older" },
      });
      await result.current.create.readback(work.id);
    });
    expect(queryClient.getQueryData(key)).toEqual(newer);
    const other = adminContentKeys.workDetail("another-actor", work.id);
    expect(queryClient.getQueryData(other)).toBeUndefined();
  });

  it("does not repeat a same-ID POST after an ambiguous 404, conflict, and second 404", async () => {
    const body: CreateWorkBody = {
      id: work.id,
      title: work.title,
      slug: work.slug,
      type: work.type,
      storyStatus: work.storyStatus,
    };
    apiMock.createWork
      .mockRejectedValueOnce(new SafeAdminContentError("NETWORK_ERROR", 0, ""))
      .mockRejectedValueOnce(
        new SafeAdminContentError("CONTENT_CONFLICT", 409, ""),
      );
    apiMock.getWork.mockRejectedValue(
      new SafeAdminContentError("NOT_FOUND", 404, ""),
    );
    const { result } = renderHook(() => useCreateAdminWork(), { wrapper });
    await act(async () => {
      await expect(result.current.mutateAsync(body)).rejects.toMatchObject({
        code: "NETWORK_ERROR",
      });
      await expect(result.current.mutateAsync(body)).rejects.toMatchObject({
        code: "CONTENT_CONFLICT",
      });
      await expect(result.current.mutateAsync(body)).rejects.toMatchObject({
        code: "CONTENT_CONFLICT",
      });
      await expect(
        result.current.mutateAsync({ ...body, title: "Changed local input" }),
      ).rejects.toMatchObject({
        code: "CONTENT_CONFLICT",
      });
    });
    expect(apiMock.createWork).toHaveBeenCalledTimes(2);
    expect(apiMock.getWork).toHaveBeenCalledTimes(2);
  });

  it("retains Work detail after a CSRF write rejection until a newer authorized GET, but masks reader denial", async () => {
    apiMock.getWork
      .mockResolvedValueOnce(work)
      .mockResolvedValueOnce(work)
      .mockRejectedValueOnce(
        new SafeAdminContentError("FORBIDDEN", 403, "reader-denied"),
      );
    apiMock.updateWork.mockRejectedValue(
      new SafeAdminContentError("FORBIDDEN", 403, "csrf-write"),
    );
    const key = adminContentKeys.workDetail(sessionMock.id, work.id);
    const { result } = renderHook(
      () => ({
        detail: useAdminWorkDetail(work.id),
        update: useUpdateAdminWork(),
      }),
      { wrapper },
    );
    await waitFor(() => {
      expect(result.current.detail.data).toEqual(work);
    });
    await act(async () => {
      await expect(
        result.current.update.mutateAsync({
          workId: work.id,
          body: { expectedVersion: work.version, title: "Draft" },
        }),
      ).rejects.toMatchObject({ code: "FORBIDDEN" });
    });
    expect(result.current.detail.denied).toBe(false);
    expect(result.current.detail.writeBlocked).toBe(true);
    expect(queryClient.getQueryData(key)).toEqual(work);
    await act(async () => {
      await result.current.detail.retryAccess();
    });
    await waitFor(() => {
      expect(result.current.detail.writeBlocked).toBe(false);
    });
    await act(async () => {
      await result.current.detail.refetch();
    });
    await waitFor(() => {
      expect(result.current.detail.denied).toBe(true);
    });
    expect(queryClient.getQueryData(key)).toBeUndefined();
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

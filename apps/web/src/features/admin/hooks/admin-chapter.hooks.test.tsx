import { act, renderHook, waitFor } from "@testing-library/react";
import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import type * as AdminContentHooks from "./admin-content.hooks";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useAdminChapterDetail,
  useAdminChapterList,
  useSaveAdminChapter,
  usePublishAdminChapter,
} from "./admin-chapter.hooks";
import { adminChapterKeys } from "../model/admin-chapter.keys";
import { SafeAdminContentError } from "../api/admin-content.api";

const mocks = vi.hoisted(() => ({
  actorId: null as string | null,
  get: vi.fn(),
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  publish: vi.fn(),
}));
vi.mock("../api/admin-chapter.api", () => ({
  adminChapterApi: {
    get: mocks.get,
    list: mocks.list,
    create: mocks.create,
    update: mocks.update,
    publish: mocks.publish,
  },
}));
vi.mock("./admin-content.hooks", async (loadActual) => ({
  ...(await loadActual<typeof AdminContentHooks>()),
  useAdminActor: () => ({ actorId: mocks.actorId, sessionReady: true }),
}));

const workId = "11111111-1111-4111-8111-111111111111";
const chapterId = "22222222-2222-4222-8222-222222222222";
const chapter = { id: chapterId, workId, version: 2, pages: [] };

const makeClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
const wrapperFor = (client: QueryClient) => {
  function ChapterQueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  }
  return ChapterQueryWrapper;
};

beforeEach(() => {
  vi.clearAllMocks();
  onlineManager.setOnline(true);
  mocks.actorId = "actor-one";
  mocks.get.mockResolvedValue(chapter);
  mocks.list.mockResolvedValue({
    items: [],
    pagination: {
      page: 1,
      limit: 8,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });
  mocks.create.mockResolvedValue(chapter);
  mocks.update.mockResolvedValue({ ...chapter, version: 3 });
  mocks.publish.mockResolvedValue({
    resourceType: "chapter",
    resourceId: chapterId,
    publicationStatus: "published",
    publishedAt: "2026-09-26T00:00:00.000Z",
    publicationEventId: "55555555-5555-4555-8555-555555555555",
    version: 3,
    transitioned: true,
  });
});

describe("Chapter query ownership", () => {
  it("keeps Chapter text out of the mutation cache after save", async () => {
    const client = makeClient();
    const privateTitle = "private Chapter title sentinel";
    mocks.update.mockResolvedValueOnce({ ...chapter, title: privateTitle });
    const { result } = renderHook(() => useSaveAdminChapter(), {
      wrapper: wrapperFor(client),
    });

    await act(async () => {
      await result.current.mutateAsync({
        operation: "update",
        workId,
        chapterId,
        body: { expectedVersion: 2, title: privateTitle, pages: [] },
      });
    });

    expect(
      JSON.stringify(
        client
          .getMutationCache()
          .getAll()
          .map((item) => item.state),
      ),
    ).not.toContain(privateTitle);
  });

  it("settles an offline save without replaying it on reconnect", async () => {
    const client = makeClient();
    const { result } = renderHook(() => useSaveAdminChapter(), {
      wrapper: wrapperFor(client),
    });
    mocks.update.mockRejectedValueOnce(
      new SafeAdminContentError("NETWORK_ERROR", 0, ""),
    );
    onlineManager.setOnline(false);
    try {
      await act(async () => {
        await expect(
          result.current.mutateAsync({
            operation: "update",
            workId,
            chapterId,
            body: { expectedVersion: 2, pages: [] },
          }),
        ).rejects.toMatchObject({ code: "NETWORK_ERROR" });
      });
      onlineManager.setOnline(true);
      expect(mocks.update).toHaveBeenCalledTimes(1);
    } finally {
      onlineManager.setOnline(true);
    }
  });

  it("fences an actor denial across remount and rejects a pre-denial list reply", async () => {
    const client = makeClient();
    const filters = { page: 1, limit: 8, sort: "number_asc" as const };
    const listKey = adminChapterKeys.list("actor-one", workId, filters);
    let releaseList: ((value: unknown) => void) | undefined;
    mocks.list.mockReturnValue(
      new Promise((resolve) => {
        releaseList = resolve;
      }),
    );
    mocks.get.mockRejectedValueOnce(
      new SafeAdminContentError("FORBIDDEN", 403, "req-denied"),
    );
    const { result, unmount } = renderHook(
      () => ({
        list: useAdminChapterList(workId, filters),
        detail: useAdminChapterDetail(workId, chapterId),
      }),
      { wrapper: wrapperFor(client) },
    );
    await waitFor(() => {
      expect(result.current.detail.denied).toBe(true);
    });
    expect(client.getQueryData(listKey)).toBeUndefined();
    act(() => {
      releaseList?.({
        items: [chapter],
        pagination: {
          page: 1,
          limit: 8,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });
    expect(client.getQueryData(listKey)).toBeUndefined();
    unmount();
    mocks.get.mockResolvedValue(chapter);
    const remounted = renderHook(
      () => useAdminChapterDetail(workId, chapterId),
      { wrapper: wrapperFor(client) },
    );
    expect(remounted.result.current.denied).toBe(true);
    await act(async () => {
      await remounted.result.current.retryAccess();
    });
    await waitFor(() => {
      expect(remounted.result.current.denied).toBe(false);
    });
    expect(remounted.result.current.data).toEqual(chapter);
    remounted.unmount();
  });

  it("keeps a wrong Chapter pairing denied through a late read and recovers by matching GET", async () => {
    const client = makeClient();
    const key = adminChapterKeys.detail("actor-one", workId, chapterId);
    let releaseRead: ((value: typeof chapter) => void) | undefined;
    mocks.get.mockReturnValueOnce(
      new Promise((resolve) => {
        releaseRead = resolve;
      }),
    );
    mocks.publish.mockRejectedValueOnce(
      new SafeAdminContentError("NOT_FOUND", 404, "req-missing"),
    );
    const { result, unmount } = renderHook(
      () => ({
        detail: useAdminChapterDetail(workId, chapterId),
        publication: usePublishAdminChapter(),
      }),
      { wrapper: wrapperFor(client) },
    );
    await act(async () => {
      await expect(
        result.current.publication.mutateAsync({
          workId,
          chapterId,
          body: { expectedVersion: 2, targetState: "published" },
        }),
      ).rejects.toMatchObject({ code: "NOT_FOUND" });
    });
    await waitFor(() => {
      expect(result.current.detail.denied).toBe(true);
    });
    act(() => {
      releaseRead?.(chapter);
    });
    expect(client.getQueryData(key)).toBeUndefined();
    unmount();
    mocks.get.mockResolvedValue(chapter);
    const remounted = renderHook(
      () => useAdminChapterDetail(workId, chapterId),
      { wrapper: wrapperFor(client) },
    );
    expect(remounted.result.current.denied).toBe(true);
    await act(async () => {
      await remounted.result.current.retryAccess();
    });
    await waitFor(() => {
      expect(remounted.result.current.data).toEqual(chapter);
    });
    remounted.unmount();
  });

  it("removes the prior actor's Chapter cache on logout", async () => {
    const client = makeClient();
    const key = adminChapterKeys.detail("actor-one", workId, chapterId);
    const { result, rerender } = renderHook(
      () => useAdminChapterDetail(workId, chapterId),
      { wrapper: wrapperFor(client) },
    );
    await waitFor(() => {
      expect(result.current.data).toEqual(chapter);
    });
    expect(client.getQueryData(key)).toEqual(chapter);
    mocks.actorId = null;
    rerender();
    await waitFor(() => {
      expect(client.getQueryData(key)).toBeUndefined();
    });
    expect(result.current.data).toBeUndefined();
  });
  it("scopes list filters, pages and old responses to the actor and Work", async () => {
    const client = makeClient();
    const firstQuery = { page: 1, limit: 8, sort: "number_asc" as const };
    const secondQuery = {
      page: 2,
      limit: 8,
      sort: "number_desc" as const,
      search: "Chapter",
    };
    const { result, rerender } = renderHook(
      ({ query }) => useAdminChapterList(workId, query),
      {
        initialProps: {
          query: firstQuery as typeof firstQuery | typeof secondQuery,
        },
        wrapper: wrapperFor(client),
      },
    );
    await waitFor(() => {
      expect(result.current.data?.pagination.total).toBe(0);
    });
    mocks.list.mockResolvedValueOnce({
      items: [],
      pagination: {
        page: 2,
        limit: 8,
        total: 11,
        totalPages: 2,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });
    rerender({ query: secondQuery });
    await waitFor(() => {
      expect(result.current.data?.pagination.total).toBe(11);
    });
    expect(mocks.list).toHaveBeenCalledWith(
      workId,
      secondQuery,
      expect.any(AbortSignal),
    );
    expect(adminChapterKeys.list("actor-one", workId, firstQuery)).not.toEqual(
      adminChapterKeys.list("actor-one", workId, secondQuery),
    );
    mocks.actorId = "actor-two";
    rerender({ query: firstQuery });
    await waitFor(() => {
      expect(mocks.list).toHaveBeenCalledTimes(3);
    });
    expect(adminChapterKeys.list("actor-one", workId, firstQuery)).not.toEqual(
      adminChapterKeys.list("actor-two", workId, firstQuery),
    );
  });
  it("deduplicates an in-flight publication and reconciles the authoritative detail", async () => {
    const client = makeClient();
    const privateTitle = "publication private title sentinel";
    mocks.get.mockResolvedValue({
      ...chapter,
      title: privateTitle,
      version: 3,
      publicationStatus: "published",
    });
    const { result } = renderHook(() => usePublishAdminChapter(), {
      wrapper: wrapperFor(client),
    });
    const command = {
      workId,
      chapterId,
      body: { expectedVersion: 2, targetState: "published" as const },
    };
    await act(async () => {
      const [first, second] = await Promise.all([
        result.current.mutateAsync(command),
        result.current.mutateAsync(command),
      ]);
      expect(first.transition.publicationEventId).toBe(
        second.transition.publicationEventId,
      );
    });
    expect(mocks.publish).toHaveBeenCalledTimes(1);
    expect(mocks.get).toHaveBeenCalled();
    expect(
      JSON.stringify(
        client
          .getMutationCache()
          .getAll()
          .map((item) => item.state),
      ),
    ).not.toContain(privateTitle);
    expect(
      client.getQueryData(
        adminChapterKeys.detail("actor-one", workId, chapterId),
      ),
    ).toMatchObject({ version: 3, publicationStatus: "published" });
  });

  it("never reuses one Chapter's pending publication for another Chapter", async () => {
    const client = makeClient();
    let release: ((value: unknown) => void) | undefined;
    mocks.publish.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      }),
    );
    mocks.get.mockResolvedValue({
      ...chapter,
      version: 3,
      publicationStatus: "published",
    });
    const { result } = renderHook(() => usePublishAdminChapter(), {
      wrapper: wrapperFor(client),
    });
    let first: Promise<unknown> | undefined;
    act(() => {
      first = result.current.mutateAsync({
        workId,
        chapterId,
        body: { expectedVersion: 2, targetState: "published" },
      });
    });
    await act(async () => {
      await expect(
        result.current.mutateAsync({
          workId,
          chapterId: "33333333-3333-4333-8333-333333333333",
          body: { expectedVersion: 2, targetState: "published" },
        }),
      ).rejects.toMatchObject({ code: "ACCESS_FENCED" });
    });
    expect(mocks.publish).toHaveBeenCalledTimes(1);
    await act(async () => {
      release?.({
        resourceType: "chapter",
        resourceId: chapterId,
        publicationStatus: "published",
        version: 3,
        publicationEventId: "55555555-5555-4555-8555-555555555555",
        publishedAt: "2026-09-26T00:00:00.000Z",
        transitioned: true,
      });
      await first;
    });
  });

  it("keeps an uncertain publication unconfirmed and refreshes the saved detail", async () => {
    const client = makeClient();
    mocks.publish.mockRejectedValue(new Error("connection lost"));
    const { result } = renderHook(
      () => ({
        detail: useAdminChapterDetail(workId, chapterId),
        publication: usePublishAdminChapter(),
      }),
      { wrapper: wrapperFor(client) },
    );
    await waitFor(() => {
      expect(result.current.detail.data).toEqual(chapter);
    });
    await act(async () => {
      await expect(
        result.current.publication.mutateAsync({
          workId,
          chapterId,
          body: { expectedVersion: 2, targetState: "published" },
        }),
      ).rejects.toThrow("connection lost");
    });
    await waitFor(() => {
      expect(mocks.get).toHaveBeenCalledTimes(2);
    });
    expect(mocks.publish).toHaveBeenCalledTimes(1);
    expect(
      client.getQueryData(
        adminChapterKeys.detail("actor-one", workId, chapterId),
      ),
    ).toEqual(chapter);
  });

  it("does not cache a late publication reply under another actor", async () => {
    const client = makeClient();
    let resolvePublication: ((transition: unknown) => void) | undefined;
    mocks.publish.mockReturnValue(
      new Promise((resolve) => {
        resolvePublication = resolve;
      }),
    );
    mocks.get.mockResolvedValue({
      ...chapter,
      version: 3,
      publicationStatus: "published",
    });
    const { result, rerender } = renderHook(() => usePublishAdminChapter(), {
      wrapper: wrapperFor(client),
    });
    let pending: Promise<unknown> | undefined;
    act(() => {
      pending = result.current.mutateAsync({
        workId,
        chapterId,
        body: { expectedVersion: 2, targetState: "published" },
      });
    });
    mocks.actorId = "actor-two";
    rerender();
    await act(async () => {
      resolvePublication?.({
        resourceType: "chapter",
        resourceId: chapterId,
        publicationStatus: "published",
        version: 3,
        publicationEventId: "55555555-5555-4555-8555-555555555555",
        publishedAt: "2026-09-26T00:00:00.000Z",
        transitioned: true,
      });
      await expect(pending).rejects.toMatchObject({ code: "ACCESS_FENCED" });
    });
    expect(
      client.getQueryData(
        adminChapterKeys.detail("actor-two", workId, chapterId),
      ),
    ).toBeUndefined();
    expect(
      client.getQueryData(
        adminChapterKeys.detail("actor-one", workId, chapterId),
      ),
    ).toBeUndefined();
  });
  it("scopes private detail keys to actor, Work and Chapter", async () => {
    const client = makeClient();
    const { result, rerender } = renderHook(
      () => useAdminChapterDetail(workId, chapterId),
      { wrapper: wrapperFor(client) },
    );
    await waitFor(() => {
      expect(result.current.data).toEqual(chapter);
    });
    expect(
      client.getQueryData(
        adminChapterKeys.detail("actor-one", workId, chapterId),
      ),
    ).toEqual(chapter);
    mocks.actorId = "actor-two";
    rerender();
    await waitFor(() => {
      expect(
        client.getQueryData(
          adminChapterKeys.detail("actor-two", workId, chapterId),
        ),
      ).toEqual(chapter);
    });
    expect(adminChapterKeys.detail("actor-one", workId, chapterId)).not.toEqual(
      adminChapterKeys.detail("actor-two", workId, chapterId),
    );
  });

  it("reconciles the saved version and does not overwrite a newer cached detail", async () => {
    const client = makeClient();
    const { result } = renderHook(() => useSaveAdminChapter(), {
      wrapper: wrapperFor(client),
    });
    await act(async () => {
      await result.current.mutateAsync({
        operation: "update",
        workId,
        chapterId,
        body: { expectedVersion: 2, pages: [] },
      });
    });
    expect(
      client.getQueryData(
        adminChapterKeys.detail("actor-one", workId, chapterId),
      ),
    ).toMatchObject({ version: 3 });
    client.setQueryData(
      adminChapterKeys.detail("actor-one", workId, chapterId),
      { ...chapter, version: 5 },
    );
    await act(async () => {
      await result.current.mutateAsync({
        operation: "update",
        workId,
        chapterId,
        body: { expectedVersion: 2, pages: [] },
      });
    });
    expect(
      client.getQueryData(
        adminChapterKeys.detail("actor-one", workId, chapterId),
      ),
    ).toMatchObject({ version: 5 });
  });

  it("drops a late save completion after the actor changes", async () => {
    const client = makeClient();
    let finish: ((value: typeof chapter) => void) | undefined;
    mocks.update.mockReturnValue(
      new Promise<typeof chapter>((resolve) => {
        finish = resolve;
      }),
    );
    const { result, rerender } = renderHook(() => useSaveAdminChapter(), {
      wrapper: wrapperFor(client),
    });
    let pending: Promise<unknown> | undefined;
    act(() => {
      pending = result.current.mutateAsync({
        operation: "update",
        workId,
        chapterId,
        body: { expectedVersion: 2, pages: [] },
      });
    });
    mocks.actorId = "actor-two";
    rerender();
    await act(async () => {
      finish?.({ ...chapter, version: 3 });
      await pending;
    });
    expect(
      client.getQueryData(
        adminChapterKeys.detail("actor-one", workId, chapterId),
      ),
    ).toBeUndefined();
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import {
  usePublicCatalogDetail,
  usePublicCatalogChapter,
  usePublicCatalogImage,
  usePublicCatalogHome,
  usePublicCatalogWorks,
  usePublicCatalogCategories,
} from "./public-catalog.hooks";
import { publicCatalogKeys } from "./public-catalog.keys";

import {
  publicDetailFixture,
  publicSuccessFixture,
  publicNotFoundFixture,
} from "../api/public-catalog.test-helper";
import { SafePublicCatalogError } from "../model/public-catalog.errors";
import {
  readPublicWork,
  isPublicWorkDenied,
  observePublicServerDenial,
} from "./public-catalog.access";

const clients: QueryClient[] = [];
const createClient = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  clients.push(client);
  return client;
};
const wrapperFor = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
const empty = {
  items: [],
  pagination: {
    page: 1,
    limit: 12 as const,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};
const response = (slug?: string) =>
  new Response(
    JSON.stringify({
      success: true,
      statusCode: 200,
      message: "Loaded",
      data:
        slug === undefined
          ? empty
          : {
              items: [
                {
                  slug,
                  title: slug,
                  alternativeTitle: null,
                  type: "manga",
                  storyStatus: "ongoing",
                  publishedAt: "2026-10-31T12:00:00.000Z",
                  categories: [{ slug: "action", displayName: "Action" }],
                  coverPath: `/api/v1/content/works/${slug}/cover`,
                },
              ],
              pagination: { ...empty.pagination, total: 1, totalPages: 1 },
            },
      requestId: "request-id",
      timestamp: "2026-10-31T12:00:00.000Z",
      path: "/content/catalog/works",
    }),
    { status: 200 },
  );
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
};
afterEach(() => {
  vi.unstubAllGlobals();
  for (const client of clients.splice(0)) client.clear();
});

describe("public catalog query ownership", () => {
  it("fences earlier reads and cached composites on a server denial, without replaying it after recovery", async () => {
    const client = createClient();
    const old = deferred<ReturnType<typeof publicDetailFixture>>();
    const olderRead = readPublicWork(client, "saved-work", () => old.promise);
    const rejected = expect(olderRead).rejects.toMatchObject({
      code: "ACCESS_FENCED",
    });
    const data = publicDetailFixture("saved-work");
    client.setQueryData(publicCatalogKeys.detail("saved-work"), data);
    await observePublicServerDenial(client, "saved-work", "server-render-1");
    expect(
      client.getQueryData(publicCatalogKeys.detail("saved-work")),
    ).toBeUndefined();
    old.resolve(data);
    await rejected;
    expect(isPublicWorkDenied(client, "saved-work")).toBe(true);
    await readPublicWork(
      client,
      "saved-work",
      () => Promise.resolve(publicDetailFixture("saved-work")),
      true,
    );
    await observePublicServerDenial(client, "saved-work", "server-render-1");
    expect(isPublicWorkDenied(client, "saved-work")).toBe(false);
    await observePublicServerDenial(client, "saved-work", "server-render-2");
    expect(isPublicWorkDenied(client, "saved-work")).toBe(true);
    client.clear();
    await observePublicServerDenial(client, "saved-work", "server-render-1");
    expect(isPublicWorkDenied(client, "saved-work")).toBe(true);
  });
  it("uses normalized public keys and seeds only a matching filter selection", () => {
    const client = createClient();
    const seed = { query: { category: "unknown" }, data: empty };
    const matching = renderHook(
      () =>
        usePublicCatalogWorks(
          { category: "unknown" },
          { enabled: false, seed },
        ),
      { wrapper: wrapperFor(client) },
    );
    expect(matching.result.current.data).toEqual(empty);
    const other = renderHook(
      () =>
        usePublicCatalogWorks({ category: "other" }, { enabled: false, seed }),
      { wrapper: wrapperFor(client) },
    );
    expect(other.result.current.data).toBeUndefined();
    expect(publicCatalogKeys.works({ q: " Saved " })).toEqual(
      publicCatalogKeys.works({ q: "Saved", page: 1, sort: "newest" }),
    );
    expect(
      JSON.stringify(publicCatalogKeys.works({ view: "stories" })),
    ).not.toContain("token");
  });
  it("cancels an old URL read and cannot present its late response as the new selection", async () => {
    const old = deferred<Response>();
    const current = deferred<Response>();
    const requests: Request[] = [];
    vi.stubGlobal("fetch", (request: Request) => {
      requests.push(request);
      return request.url.includes("q=old") ? old.promise : current.promise;
    });
    const hook = renderHook(({ q }) => usePublicCatalogWorks({ q }), {
      initialProps: { q: "old" },
      wrapper: wrapperFor(createClient()),
    });
    await waitFor(() => {
      expect(requests).toHaveLength(1);
    });
    hook.rerender({ q: "current" });
    await waitFor(() => {
      expect(requests).toHaveLength(2);
      expect(requests[0]?.signal.aborted).toBe(true);
    });
    await act(async () => {
      current.resolve(response("current-work"));
      await current.promise;
    });
    await waitFor(() => {
      expect(hook.result.current.data?.items[0]?.slug).toBe("current-work");
    });
    await act(async () => {
      old.resolve(response("old-work"));
      await old.promise;
    });
    expect(hook.result.current.data?.items[0]?.slug).toBe("current-work");
  });
  it.each([429, 503])(
    "keeps %s failure distinct from confirmed empty and permits explicit retry",
    async (status) => {
      let calls = 0;
      vi.stubGlobal("fetch", () =>
        Promise.resolve(
          ++calls === 1 ? new Response("unavailable", { status }) : response(),
        ),
      );
      const hook = renderHook(() => usePublicCatalogWorks({}), {
        wrapper: wrapperFor(createClient()),
      });
      await waitFor(() => {
        expect(hook.result.current.isError).toBe(true);
      });
      expect(hook.result.current.data).toBeUndefined();
      expect(hook.result.current.error).toMatchObject({ statusCode: status });
      expect(calls).toBe(1);
      await act(async () => {
        await hook.result.current.refetch();
      });
      await waitFor(() => {
        expect(hook.result.current.isSuccess).toBe(true);
      });
      expect(hook.result.current.data).toEqual(empty);
    },
  );
  it("isolates independent QueryClients and directory scope", () => {
    const first = createClient();
    const second = createClient();
    first.setQueryData(publicCatalogKeys.works({}), empty);
    const hook = renderHook(
      () => usePublicCatalogWorks({}, { enabled: false }),
      { wrapper: wrapperFor(second) },
    );
    expect(hook.result.current.data).toBeUndefined();
    const categories = renderHook(
      () => usePublicCatalogCategories({ q: "Action" }, { enabled: false }),
      { wrapper: wrapperFor(first) },
    );
    expect(categories.result.current.data).toBeUndefined();
    expect(publicCatalogKeys.categories({ q: "Action" })).not.toEqual(
      publicCatalogKeys.works({ q: "Action" }),
    );
  });
  it("keeps home failure unavailable until explicit recovery and directory URL identity separate", async () => {
    let calls = 0;
    const home = {
      featured: [],
      categoryShortcuts: [],
      latestReleases: [],
      suggestions: [],
    };
    vi.stubGlobal("fetch", () =>
      Promise.resolve(
        ++calls === 1
          ? new Response("unavailable", { status: 503 })
          : new Response(
              JSON.stringify({
                success: true,
                statusCode: 200,
                message: "Loaded",
                data: home,
                requestId: "request-id",
                timestamp: "2026-10-31T12:00:00.000Z",
                path: "/content/catalog/home",
              }),
              { status: 200 },
            ),
      ),
    );
    const hook = renderHook(() => usePublicCatalogHome(), {
      wrapper: wrapperFor(createClient()),
    });
    await waitFor(() => {
      expect(hook.result.current.isError).toBe(true);
    });
    expect(hook.result.current.data).toBeUndefined();
    await act(async () => {
      await hook.result.current.refetch();
    });
    await waitFor(() => {
      expect(hook.result.current.isSuccess).toBe(true);
    });
    expect(hook.result.current.data).toEqual(home);
    expect(publicCatalogKeys.categories({ q: "Action", page: 2 })).not.toEqual(
      publicCatalogKeys.categories({ q: "Drama", page: 2 }),
    );
  });
  it("aborts a stale directory search while preserving the current URL selection", async () => {
    const old = deferred<Response>();
    const current = deferred<Response>();
    const requests: Request[] = [];
    const directoryResponse = (slug: string) =>
      new Response(
        JSON.stringify({
          success: true,
          statusCode: 200,
          message: "Loaded",
          data: {
            items: [{ slug, displayName: slug }],
            pagination: {
              ...empty.pagination,
              limit: 24,
              total: 1,
              totalPages: 1,
            },
          },
          requestId: "request-id",
          timestamp: "2026-10-31T12:00:00.000Z",
          path: "/content/catalog/categories",
        }),
        { status: 200 },
      );
    vi.stubGlobal("fetch", (request: Request) => {
      requests.push(request);
      return request.url.includes("q=Action") ? old.promise : current.promise;
    });
    const hook = renderHook(({ q }) => usePublicCatalogCategories({ q }), {
      initialProps: { q: "Action" },
      wrapper: wrapperFor(createClient()),
    });
    await waitFor(() => {
      expect(requests).toHaveLength(1);
    });
    hook.rerender({ q: "Drama" });
    await waitFor(() => {
      expect(requests).toHaveLength(2);
      expect(requests[0]?.signal.aborted).toBe(true);
    });
    await act(async () => {
      current.resolve(directoryResponse("drama"));
      await current.promise;
    });
    await waitFor(() => {
      expect(hook.result.current.data?.items[0]?.slug).toBe("drama");
    });
    await act(async () => {
      old.resolve(directoryResponse("action"));
      await old.promise;
    });
    expect(hook.result.current.data?.items[0]?.slug).toBe("drama");
  });
  it("keeps confirmed Work denial across cache writes/reset/remount until a later matching Work GET succeeds", async () => {
    const client = createClient();
    const detail = publicDetailFixture();
    let denied = false;
    const pendingRecovery = deferred<Response>();
    let recovering = false;
    vi.stubGlobal("fetch", () =>
      recovering
        ? pendingRecovery.promise
        : Promise.resolve(
            denied
              ? new Response(JSON.stringify(publicNotFoundFixture()), {
                  status: 404,
                })
              : new Response(JSON.stringify(publicSuccessFixture(detail)), {
                  status: 200,
                }),
          ),
    );
    const wrapper = wrapperFor(client);
    const options = { seed: { workSlug: "saved-work", data: detail } };
    const hook = renderHook(
      () => usePublicCatalogDetail("saved-work", options),
      { wrapper },
    );
    await waitFor(() => {
      expect(hook.result.current.isSuccess).toBe(true);
    });
    denied = true;
    await act(async () => {
      await hook.result.current.refetch();
    });
    await waitFor(() => {
      expect(hook.result.current.denied).toBe(true);
    });
    expect(hook.result.current.data).toBeUndefined();
    act(() => {
      client.setQueryData(publicCatalogKeys.detail("saved-work"), detail);
    });
    expect(
      client.getQueryData(publicCatalogKeys.detail("saved-work")),
    ).toBeUndefined();
    expect(hook.result.current.data).toBeUndefined();
    await act(async () => {
      await client.resetQueries({
        queryKey: publicCatalogKeys.detail("saved-work"),
        exact: true,
      });
    });
    expect(hook.result.current.denied).toBe(true);
    hook.unmount();
    const remount = renderHook(
      () => usePublicCatalogDetail("saved-work", options),
      { wrapper },
    );
    expect(remount.result.current.denied).toBe(true);
    expect(remount.result.current.data).toBeUndefined();
    recovering = true;
    let retry!: Promise<unknown>;
    act(() => {
      retry = remount.result.current.retryAccess();
    });
    await waitFor(() => {
      expect(remount.result.current.isFetching).toBe(true);
    });
    expect(remount.result.current.data).toBeUndefined();
    await act(async () => {
      pendingRecovery.resolve(
        new Response(JSON.stringify(publicSuccessFixture(detail)), {
          status: 200,
        }),
      );
      await retry;
    });
    await waitFor(() => {
      expect(remount.result.current.denied).toBe(false);
      expect(remount.result.current.data?.work.slug).toBe("saved-work");
    });
  });

  it("rejects an already in-flight older success after a newer Work 404 and isolates clients", async () => {
    const first = createClient();
    const second = createClient();
    const late = deferred<ReturnType<typeof publicDetailFixture>>();
    const oldRead = readPublicWork(first, "saved-work", () => late.promise);
    await expect(
      readPublicWork(first, "saved-work", () =>
        Promise.reject(new SafePublicCatalogError("NOT_FOUND", 404)),
      ),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(isPublicWorkDenied(first, "saved-work")).toBe(true);
    expect(isPublicWorkDenied(second, "saved-work")).toBe(false);
    late.resolve(publicDetailFixture());
    await expect(oldRead).rejects.toMatchObject({ code: "ACCESS_FENCED" });
    await expect(
      readPublicWork(second, "saved-work", () =>
        Promise.resolve(publicDetailFixture()),
      ),
    ).resolves.toMatchObject({ work: { slug: "saved-work" } });
    expect(isPublicWorkDenied(first, "saved-work")).toBe(true);
  });

  it("invalidates Chapter-derived detail after Chapter 404 and permits fresh eligible parent detail", async () => {
    let chapterVisible = true;
    const detail = publicDetailFixture();
    vi.stubGlobal("fetch", (request: Request) => {
      if (request.url.includes("/chapters/1"))
        return Promise.resolve(
          chapterVisible
            ? new Response(
                JSON.stringify(
                  publicSuccessFixture({
                    chapter: {
                      ...detail.firstChapter,
                      id: "00000000-0000-4000-8000-000000000001",
                      workId: "00000000-0000-4000-8000-000000000002",
                    },
                  }),
                ),
                { status: 200 },
              )
            : new Response(JSON.stringify(publicNotFoundFixture()), {
                status: 404,
              }),
        );
      const current = chapterVisible
        ? detail
        : {
            ...detail,
            chapters: {
              items: [],
              pagination: {
                ...detail.chapters.pagination,
                total: 0,
                totalPages: 0,
              },
            },
            firstChapter: null,
            latestChapter: null,
          };
      return Promise.resolve(
        new Response(JSON.stringify(publicSuccessFixture(current)), {
          status: 200,
        }),
      );
    });
    const client = createClient();
    const hook = renderHook(
      () => ({
        detail: usePublicCatalogDetail("saved-work"),
        chapter: usePublicCatalogChapter("saved-work", 1),
      }),
      { wrapper: wrapperFor(client) },
    );
    await waitFor(() => {
      expect(hook.result.current.detail.data?.firstChapter?.number).toBe(1);
      expect(hook.result.current.chapter.data?.number).toBe(1);
    });
    chapterVisible = false;
    await act(async () => {
      await hook.result.current.chapter.refetch();
    });
    await waitFor(() => {
      expect(hook.result.current.detail.data?.firstChapter).toBeNull();
    });
    expect(hook.result.current.detail.denied).toBe(false);
    expect(hook.result.current.detail.data?.work.slug).toBe("saved-work");
    expect(hook.result.current.chapter.data).toBeUndefined();
    expect(hook.result.current.chapter.error).toMatchObject({
      code: "NOT_FOUND",
    });
  });

  it("keeps eligible parent detail visible through image 503 and recovers only the image on retry", async () => {
    let available = false;
    const detail = publicDetailFixture();
    vi.stubGlobal("fetch", (request: Request) =>
      Promise.resolve(
        request.url.endsWith("/cover")
          ? available
            ? new Response(new Uint8Array([1, 2, 3]), {
                status: 200,
                headers: { "content-type": "image/jpeg" },
              })
            : new Response(
                JSON.stringify({
                  ...publicNotFoundFixture(),
                  statusCode: 503,
                  code: "MEDIA_UNAVAILABLE",
                }),
                {
                  status: 503,
                  headers: { "content-type": "application/json" },
                },
              )
          : new Response(JSON.stringify(publicSuccessFixture(detail)), {
              status: 200,
            }),
      ),
    );
    const hook = renderHook(
      () => ({
        detail: usePublicCatalogDetail("saved-work"),
        image: usePublicCatalogImage("saved-work", "cover"),
      }),
      { wrapper: wrapperFor(createClient()) },
    );
    await waitFor(() => {
      expect(hook.result.current.detail.data?.work.slug).toBe("saved-work");
      expect(hook.result.current.image.isError).toBe(true);
    });
    expect(hook.result.current.detail.denied).toBe(false);
    expect(hook.result.current.image.data).toBeUndefined();
    available = true;
    await act(async () => {
      await hook.result.current.image.refetch();
    });
    await waitFor(() => {
      expect(hook.result.current.image.data?.size).toBe(3);
    });
  });
  it("fences related detail, catalog/home and image cache writes after a confirmed Work denial", async () => {
    const client = createClient();
    const detail = publicDetailFixture();
    const other = publicDetailFixture("other-work");
    const card = {
      slug: detail.work.slug,
      title: detail.work.title,
      alternativeTitle: null,
      type: "novel",
      storyStatus: "ongoing",
      publishedAt: detail.work.publishedAt,
      categories: detail.work.categories,
      coverPath: detail.work.coverPath,
    };
    const related = { ...other, similar: [card] };
    await readPublicWork(client, "saved-work", () => Promise.resolve(detail));
    client.setQueryData(publicCatalogKeys.detail("other-work"), related);
    client.setQueryData(
      publicCatalogKeys.image("saved-work", "cover"),
      new Blob(["saved"], { type: "image/jpeg" }),
    );
    client.setQueryData(publicCatalogKeys.works({}), {
      items: [card],
      pagination: { ...empty.pagination, total: 1, totalPages: 1 },
    });
    client.setQueryData(publicCatalogKeys.home, {
      featured: [card],
      categoryShortcuts: [],
      latestReleases: [],
      suggestions: [],
    });
    await expect(
      readPublicWork(client, "saved-work", () =>
        Promise.reject(new SafePublicCatalogError("NOT_FOUND", 404)),
      ),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    for (const key of [
      publicCatalogKeys.detail("other-work"),
      publicCatalogKeys.image("saved-work", "cover"),
      publicCatalogKeys.works({}),
      publicCatalogKeys.home,
    ])
      expect(client.getQueryData(key)).toBeUndefined();
    client.setQueryData(publicCatalogKeys.detail("other-work"), related);
    expect(
      client.getQueryData(publicCatalogKeys.detail("other-work")),
    ).toBeUndefined();
    expect(
      client.getQueryState(publicCatalogKeys.detail("other-work")),
    ).toMatchObject({ status: "error", error: { code: "ACCESS_FENCED" } });
  });

  it("exposes parent refresh failure after Chapter 404 and recovers through a later Work read", async () => {
    const detail = publicDetailFixture();
    let chapterVisible = true;
    let parentAvailable = true;
    vi.stubGlobal("fetch", (request: Request) => {
      if (request.url.includes("/chapters/1"))
        return Promise.resolve(
          chapterVisible
            ? new Response(
                JSON.stringify(
                  publicSuccessFixture({
                    chapter: {
                      ...detail.firstChapter,
                      id: "00000000-0000-4000-8000-000000000001",
                      workId: "00000000-0000-4000-8000-000000000002",
                    },
                  }),
                ),
                { status: 200 },
              )
            : new Response(JSON.stringify(publicNotFoundFixture()), {
                status: 404,
              }),
        );
      return Promise.resolve(
        parentAvailable
          ? new Response(JSON.stringify(publicSuccessFixture(detail)), {
              status: 200,
            })
          : new Response("unavailable", { status: 503 }),
      );
    });
    const hook = renderHook(
      () => ({
        detail: usePublicCatalogDetail("saved-work"),
        chapter: usePublicCatalogChapter("saved-work", 1),
      }),
      { wrapper: wrapperFor(createClient()) },
    );
    await waitFor(() => {
      expect(hook.result.current.chapter.data?.number).toBe(1);
      expect(hook.result.current.detail.data?.work.slug).toBe("saved-work");
    });
    chapterVisible = false;
    parentAvailable = false;
    await act(async () => {
      await hook.result.current.chapter.refetch();
    });
    await waitFor(() => {
      expect(hook.result.current.detail.isError).toBe(true);
    });
    expect(hook.result.current.detail.denied).toBe(false);
    expect(hook.result.current.detail.data).toBeUndefined();
    expect(hook.result.current.detail.error).toMatchObject({ statusCode: 503 });
    parentAvailable = true;
    await act(async () => {
      await hook.result.current.detail.retryAccess();
    });
    await waitFor(() => {
      expect(hook.result.current.detail.data?.work.slug).toBe("saved-work");
    });
  });

  it("does not treat an unvalidated HTML 404 as confirmed Work absence", async () => {
    let visible = true;
    const detail = publicDetailFixture();
    vi.stubGlobal("fetch", () =>
      Promise.resolve(
        visible
          ? new Response(JSON.stringify(publicSuccessFixture(detail)), {
              status: 200,
            })
          : new Response("upstream HTML", { status: 404 }),
      ),
    );
    const hook = renderHook(() => usePublicCatalogDetail("saved-work"), {
      wrapper: wrapperFor(createClient()),
    });
    await waitFor(() => {
      expect(hook.result.current.data?.work.slug).toBe("saved-work");
    });
    visible = false;
    await act(async () => {
      await hook.result.current.refetch();
    });
    expect(hook.result.current.denied).toBe(false);
    await waitFor(() => {
      expect(hook.result.current.error).toMatchObject({
        code: "HTTP_ERROR",
        statusCode: 404,
      });
    });
  });
});

describe("republished composite recovery", () => {
  it("requires a later matching Work GET and recovers a list without manual detail navigation", async () => {
    const client = createClient();
    const slug = "republished-work";
    let published = false;
    const recovery = deferred<Response>();
    const requests: string[] = [];
    vi.stubGlobal("fetch", (request: Request) => {
      requests.push(request.url);
      if (request.url.includes("/catalog/works/"))
        return published
          ? recovery.promise
          : Promise.resolve(
              new Response(JSON.stringify(publicNotFoundFixture()), {
                status: 404,
              }),
            );
      return Promise.resolve(response(slug));
    });
    const detail = renderHook(() => usePublicCatalogDetail(slug), {
      wrapper: wrapperFor(client),
    });
    await waitFor(() => {
      expect(detail.result.current.denied).toBe(true);
    });
    detail.unmount();
    published = true;
    const list = renderHook(() => usePublicCatalogWorks({}), {
      wrapper: wrapperFor(client),
    });
    await waitFor(() => {
      expect(
        requests.filter((url) => url.endsWith(`/catalog/works/${slug}`)),
      ).toHaveLength(2);
    });
    expect(isPublicWorkDenied(client, slug)).toBe(true);
    expect(list.result.current.data).toBeUndefined();
    recovery.resolve(
      new Response(
        JSON.stringify(publicSuccessFixture(publicDetailFixture(slug))),
      ),
    );
    await waitFor(() => {
      expect(list.result.current.data?.items[0]?.slug).toBe(slug);
    });
    expect(
      requests.filter((url) => url.endsWith(`/catalog/works/${slug}`)),
    ).toHaveLength(2);
    expect(isPublicWorkDenied(client, slug)).toBe(false);
  });
});

it("does not turn a similar Work's recovery 404 into parent Work denial", async () => {
  const client = createClient();
  const parent = publicDetailFixture("eligible-parent");
  const other = publicDetailFixture("denied-similar").work;
  const {
    slug,
    title,
    alternativeTitle,
    type,
    storyStatus,
    publishedAt,
    categories,
    coverPath,
  } = other;
  parent.similar = [
    {
      slug,
      title,
      alternativeTitle,
      type,
      storyStatus,
      publishedAt,
      categories,
      coverPath,
    },
  ];
  vi.stubGlobal("fetch", (request: Request) =>
    Promise.resolve(
      request.url.endsWith("/denied-similar")
        ? new Response(JSON.stringify(publicNotFoundFixture()), { status: 404 })
        : new Response(JSON.stringify(publicSuccessFixture(parent))),
    ),
  );
  const denied = renderHook(() => usePublicCatalogDetail("denied-similar"), {
    wrapper: wrapperFor(client),
  });
  await waitFor(() => {
    expect(denied.result.current.denied).toBe(true);
  });
  denied.unmount();
  const eligible = renderHook(() => usePublicCatalogDetail("eligible-parent"), {
    wrapper: wrapperFor(client),
  });
  await waitFor(() => {
    expect(eligible.result.current.isError).toBe(true);
  });
  expect(isPublicWorkDenied(client, "eligible-parent")).toBe(false);
  expect(isPublicWorkDenied(client, "denied-similar")).toBe(true);
  parent.similar = [];
  await act(async () => {
    await eligible.result.current.refetch();
  });
  await waitFor(() => {
    expect(eligible.result.current.data?.work.slug).toBe("eligible-parent");
  });
});

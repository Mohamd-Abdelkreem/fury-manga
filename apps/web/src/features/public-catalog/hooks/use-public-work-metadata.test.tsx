import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  usePublicCatalogDetail,
  usePublicCatalogWorks,
} from "./public-catalog.hooks";
import { usePublicWorkMetadata } from "./use-public-work-metadata";
import {
  consumePublicRecoveryFocus,
  observePublicServerDenial,
} from "./public-catalog.access";
import {
  publicDetailFixture,
  publicNotFoundFixture,
  publicSuccessFixture,
} from "../api/public-catalog.test-helper";

const router = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));
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
const useSubject = (
  slug: string,
  serverRenderId: string,
  serverEligible = false,
) => {
  const query = usePublicCatalogDetail(
    slug,
    serverEligible
      ? { seed: { workSlug: slug, data: publicDetailFixture(slug) } }
      : {},
  );
  const retry = usePublicWorkMetadata({
    slug,
    serverRenderId,
    serverEligible,
    initialUnavailable: !serverEligible,
    result: query,
  });
  return { query, retry };
};
const available = () =>
  vi.stubGlobal(
    "fetch",
    vi.fn((input: Request) =>
      Promise.resolve(
        new Response(
          JSON.stringify(
            publicSuccessFixture(
              publicDetailFixture(
                new URL(input.url).pathname.split("/").at(-1),
              ),
            ),
          ),
        ),
      ),
    ),
  );
beforeEach(() => {
  router.refresh.mockClear();
});
afterEach(() => {
  vi.unstubAllGlobals();
  for (const client of clients.splice(0)) client.clear();
});

it("refreshes unavailable server metadata once after a genuine browser success, across failed server remounts", async () => {
  available();
  const client = createClient();
  const wrapper = wrapperFor(client);
  const first = renderHook(() => useSubject("saved-work", "server-503-1"), {
    wrapper,
  });
  await waitFor(() => {
    expect(first.result.current.query.isSuccess).toBe(true);
  });
  await waitFor(() => {
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });
  first.unmount();
  const second = renderHook(() => useSubject("saved-work", "server-503-2"), {
    wrapper,
  });
  await waitFor(() => {
    expect(second.result.current.query.isFetching).toBe(false);
  });
  expect(second.result.current.query.isSuccess).toBe(true);
  expect(router.refresh).toHaveBeenCalledTimes(1);
});

it("withdraws a successful server seed after an actual own Work404, without reseeding or looping on remount", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(publicNotFoundFixture()), { status: 404 }),
      ),
    ),
  );
  const client = createClient();
  const wrapper = wrapperFor(client);
  const first = renderHook(
    () => useSubject("saved-work", "server-200-1", true),
    { wrapper },
  );
  await waitFor(() => {
    expect(first.result.current.query.denied).toBe(true);
  });
  await waitFor(() => {
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });
  first.unmount();
  const second = renderHook(
    () => useSubject("saved-work", "stale-server-200-2", true),
    { wrapper },
  );
  expect(second.result.current.query.data).toBeUndefined();
  expect(second.result.current.query.denied).toBe(true);
  expect(router.refresh).toHaveBeenCalledTimes(1);
});

it("allows a new mismatch after a genuinely matching eligible server result", async () => {
  available();
  const client = createClient();
  const view = renderHook(
    ({ serverEligible, id }) => useSubject("saved-work", id, serverEligible),
    {
      initialProps: { serverEligible: false, id: "failed" },
      wrapper: wrapperFor(client),
    },
  );
  await waitFor(() => {
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });
  view.rerender({ serverEligible: true, id: "confirmed" });
  view.rerender({ serverEligible: false, id: "later-unavailable" });
  await waitFor(() => {
    expect(router.refresh).toHaveBeenCalledTimes(2);
  });
});

it("lets explicit retry refresh again and transfers focus only to a later server render", async () => {
  available();
  const client = createClient();
  const view = renderHook(
    () => useSubject("saved-work", "unavailable-render"),
    { wrapper: wrapperFor(client) },
  );
  await waitFor(() => {
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });
  await act(async () => {
    await view.result.current.retry();
  });
  expect(router.refresh).toHaveBeenCalledTimes(2);
  expect(
    consumePublicRecoveryFocus(client, "saved-work", "unavailable-render"),
  ).toBe(false);
  expect(
    consumePublicRecoveryFocus(client, "saved-work", "next-server-render"),
  ).toBe(true);
  expect(
    consumePublicRecoveryFocus(client, "saved-work", "another-render"),
  ).toBe(false);
});

it("keeps independent refresh episodes for different QueryClients and Work slugs", async () => {
  available();
  const firstClient = createClient();
  const secondClient = createClient();
  renderHook(() => useSubject("saved-work", "one"), {
    wrapper: wrapperFor(firstClient),
  });
  renderHook(() => useSubject("saved-work", "two"), {
    wrapper: wrapperFor(secondClient),
  });
  renderHook(() => useSubject("other-work", "three"), {
    wrapper: wrapperFor(firstClient),
  });
  await waitFor(() => {
    expect(router.refresh).toHaveBeenCalledTimes(3);
  });
});

it("does not refresh metadata for a related Work404 while the parent remains eligible", async () => {
  const parent = publicDetailFixture("saved-work");
  const similar = publicDetailFixture("similar-work").work;
  const {
    slug,
    title,
    alternativeTitle,
    type,
    storyStatus,
    publishedAt,
    categories,
    coverPath,
  } = similar;
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
  // Establish an actual prior denial of the related Work through its own hook.
  vi.stubGlobal(
    "fetch",
    vi.fn((input: Request) =>
      Promise.resolve(
        new Response(
          JSON.stringify(
            new URL(input.url).pathname.endsWith("similar-work")
              ? publicNotFoundFixture()
              : publicSuccessFixture(parent),
          ),
          {
            status: new URL(input.url).pathname.endsWith("similar-work")
              ? 404
              : 200,
          },
        ),
      ),
    ),
  );
  const client = createClient();
  const wrapper = wrapperFor(client);
  const related = renderHook(() => usePublicCatalogDetail("similar-work"), {
    wrapper,
  });
  await waitFor(() => {
    expect(related.result.current.denied).toBe(true);
  });
  related.unmount();
  const view = renderHook(
    () => useSubject("saved-work", "parent-server", true),
    { wrapper },
  );
  await waitFor(() => {
    expect(view.result.current.query.isFetching).toBe(false);
  });
  expect(view.result.current.query.isError).toBe(true);
  expect(view.result.current.query.denied).toBe(false);
  expect(router.refresh).not.toHaveBeenCalled();
});

it("does not mistake a server-observed denial or a failed browser read for fresh browser404 authority", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve(new Response("{}", { status: 503 }))),
  );
  const client = createClient();
  await observePublicServerDenial(client, "saved-work", "server-only-denial");
  const view = renderHook(
    () => useSubject("saved-work", "unavailable-after-denial"),
    { wrapper: wrapperFor(client) },
  );
  expect(view.result.current.query.denied).toBe(true);
  await act(async () => {
    await expect(view.result.current.retry()).rejects.toBeDefined();
  });
  expect(router.refresh).not.toHaveBeenCalled();
});

it("retries metadata withdrawal explicitly after a held automatic denial claim", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(publicNotFoundFixture()), { status: 404 }),
      ),
    ),
  );
  const client = createClient();
  const view = renderHook(
    () => useSubject("saved-work", "old-published-render", true),
    { wrapper: wrapperFor(client) },
  );
  await waitFor(() => {
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });
  await act(async () => {
    await expect(view.result.current.retry()).rejects.toMatchObject({
      statusCode: 404,
    });
  });
  expect(router.refresh).toHaveBeenCalledTimes(2);
  expect(
    consumePublicRecoveryFocus(client, "saved-work", "old-published-render"),
  ).toBe(false);
  expect(
    consumePublicRecoveryFocus(
      client,
      "saved-work",
      "confirmed-not-found-render",
    ),
  ).toBe(true);
});

it("observes a genuine browser denial discovered by composite recovery even while the detail query stays disabled", async () => {
  const {
    slug,
    title,
    alternativeTitle,
    type,
    storyStatus,
    publishedAt,
    categories,
    coverPath,
  } = publicDetailFixture().work;
  vi.stubGlobal(
    "fetch",
    vi.fn((input: Request) => {
      const list = new URL(input.url).pathname.endsWith("/catalog/works");
      return Promise.resolve(
        new Response(
          JSON.stringify(
            list
              ? publicSuccessFixture({
                  items: [
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
                  ],
                  pagination: {
                    page: 1,
                    limit: 12,
                    total: 1,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPreviousPage: false,
                  },
                })
              : publicNotFoundFixture(),
          ),
          { status: list ? 200 : 404 },
        ),
      );
    }),
  );
  const client = createClient();
  const wrapper = wrapperFor(client);
  await observePublicServerDenial(client, "saved-work", "server-denial");
  const detail = renderHook(
    () => useSubject("saved-work", "older-server-seed", true),
    { wrapper },
  );
  expect(detail.result.current.query.isFetching).toBe(false);
  expect(router.refresh).not.toHaveBeenCalled();
  const list = renderHook(() => usePublicCatalogWorks({}), { wrapper });
  await waitFor(() => {
    expect(list.result.current.isError).toBe(true);
  });
  await waitFor(() => {
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });
  expect(detail.result.current.query.isFetching).toBe(false);
});

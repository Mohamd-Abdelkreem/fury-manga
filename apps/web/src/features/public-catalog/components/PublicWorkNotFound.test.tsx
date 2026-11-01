import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PublicWorkNotFound } from "./PublicWorkNotFound";
import {
  publicNotFoundFixture,
  publicDetailFixture,
  publicSuccessFixture,
} from "../api/public-catalog.test-helper";
import { usePublicCatalogWorks } from "../hooks/public-catalog.hooks";
import { isPublicWorkDenied } from "../hooks/public-catalog.access";

const route = vi.hoisted(() => ({
  pathname: "/story/saved-work/chapter/1",
  refresh: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
  useParams: () => ({
    id: decodeURIComponent(route.pathname.split("/")[2] ?? ""),
  }),
  useRouter: () => route,
}));
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));
beforeEach(() => {
  route.pathname = "/story/saved-work/chapter/1";
});
afterEach(() => {
  vi.unstubAllGlobals();
  route.refresh.mockClear();
});

it("does not infer Work denial from a nested reader or malformed route", () => {
  const client = new QueryClient();
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  const view = render(
    <QueryClientProvider client={client}>
      <PublicWorkNotFound boundaryId="nested" />
    </QueryClientProvider>,
  );
  expect(screen.getByText("الصفحة غير موجودة")).toBeInTheDocument();
  expect(isPublicWorkDenied(client, "saved-work")).toBe(false);
  route.pathname = "/story/INVALID";
  view.rerender(
    <QueryClientProvider client={client}>
      <PublicWorkNotFound boundaryId="malformed" />
    </QueryClientProvider>,
  );
  expect(fetcher).not.toHaveBeenCalled();
  client.clear();
});

it("records direct server denial and makes a credential-free matching recovery GET", async () => {
  route.pathname = "/story/saved%2Dwork";
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const requests: Request[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((input: Request) => {
      requests.push(input);
      return Promise.resolve(
        new Response(JSON.stringify(publicNotFoundFixture()), {
          status: 404,
        }),
      );
    }),
  );
  const view = render(
    <QueryClientProvider client={client}>
      <PublicWorkNotFound boundaryId="direct" />
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(screen.getByText("العمل غير موجود")).toBeInTheDocument(),
  );
  await waitFor(() => {
    expect(requests.length).toBeGreaterThan(0);
  });
  expect(isPublicWorkDenied(client, "saved-work")).toBe(true);
  expect(requests[0]?.url).toContain("/content/catalog/works/saved-work");
  expect(requests[0]?.credentials).toBe("omit");
  expect(route.refresh).not.toHaveBeenCalled();
  view.unmount();
  client.clear();
});

it("does not let an abandoned delayed boundary effect cancel StrictMode's newer recovery", async () => {
  route.pathname = "/story/saved-work";
  let release!: (response: Response) => void;
  const delayedList = new Promise<Response>((resolve) => {
    release = resolve;
  });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const detail = publicDetailFixture();
  const {
    slug,
    title,
    alternativeTitle,
    type,
    storyStatus,
    publishedAt,
    categories,
    coverPath,
  } = detail.work;
  const pagination = {
    page: 1,
    limit: 12,
    total: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  let listReads = 0;
  const workReads: Request[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: Request) => {
      if (new URL(input.url).pathname.endsWith("/catalog/works")) {
        if (++listReads > 1) return delayedList;
        return new Response(
          JSON.stringify(
            publicSuccessFixture({
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
              pagination,
            }),
          ),
        );
      }
      workReads.push(input);
      return new Response(JSON.stringify(publicSuccessFixture(detail)));
    }),
  );
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const list = renderHook(() => usePublicCatalogWorks({}), { wrapper });
  await waitFor(() => {
    expect(list.result.current.data?.items).toHaveLength(1);
  });
  const view = render(
    <StrictMode>
      <QueryClientProvider client={client}>
        <PublicWorkNotFound boundaryId="strict-render" />
      </QueryClientProvider>
    </StrictMode>,
  );
  await waitFor(() => {
    expect(route.refresh).toHaveBeenCalledTimes(1);
  });
  expect(listReads).toBe(2);
  act(() => {
    release(
      new Response(
        JSON.stringify(
          publicSuccessFixture({
            items: [],
            pagination: { ...pagination, total: 0, totalPages: 0 },
          }),
        ),
      ),
    );
  });
  expect(workReads).toHaveLength(1);
  expect(isPublicWorkDenied(client, "saved-work")).toBe(false);
  view.unmount();
  list.unmount();
  client.clear();
});

it("cancels a pending automatic recovery safely when navigation unmounts the boundary", async () => {
  route.pathname = "/story/saved-work";
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  let signal: AbortSignal | undefined;
  vi.stubGlobal(
    "fetch",
    vi.fn((input: Request) => {
      signal = input.signal;
      return new Promise((_resolve, reject) => {
        input.signal.addEventListener(
          "abort",
          () => {
            reject(new DOMException("Cancelled", "AbortError"));
          },
          { once: true },
        );
      });
    }),
  );
  const view = render(
    <QueryClientProvider client={client}>
      <PublicWorkNotFound boundaryId="cancel-render" />
    </QueryClientProvider>,
  );
  await waitFor(() => {
    expect(signal).toBeDefined();
  });
  view.unmount();
  await waitFor(() => {
    expect(signal?.aborted).toBe(true);
  });
  expect(route.refresh).not.toHaveBeenCalled();
  client.clear();
});

it("bounds repeated server404/browser200 refreshes while allowing an explicit retry", async () => {
  route.pathname = "/story/saved-work";
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify(publicSuccessFixture(publicDetailFixture())),
        ),
      ),
    ),
  );
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const view = render(<PublicWorkNotFound boundaryId="mismatch-one" />, {
    wrapper,
  });
  await waitFor(() => {
    expect(route.refresh).toHaveBeenCalledTimes(1);
  });
  view.rerender(<PublicWorkNotFound boundaryId="mismatch-two" />);
  await waitFor(() => {
    expect(isPublicWorkDenied(client, "saved-work")).toBe(false);
    expect(client.isFetching()).toBe(0);
  });
  expect(route.refresh).toHaveBeenCalledTimes(1);
  act(() => {
    screen.getByRole("button", { name: "إعادة المحاولة" }).click();
  });
  await waitFor(() => {
    expect(route.refresh).toHaveBeenCalledTimes(2);
  });
  view.unmount();
  client.clear();
});

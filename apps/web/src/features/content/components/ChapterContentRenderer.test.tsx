import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_SESSION_QUERY_KEY } from "@/features/auth/hooks/auth.hooks";
import {
  apiClient,
  clearAccessToken,
  setAccessToken,
} from "@/services/api/api-client";
import { mediaKeys } from "@/features/media/model/media.keys";
import { useProgressiveChapterImages } from "../hooks/use-progressive-chapter-images";
import { ChapterContentRenderer } from "./ChapterContentRenderer";

const pages = Array.from({ length: 30 }, (_, index) => ({
  assetId: `asset-${String(index)}`,
  width: 600,
  height: 800,
  byteLength: 4,
}));
const account = (id = "admin-one") => ({
  user: {
    id,
    fullName: "Media Administrator",
    email: "admin@example.test",
    role: "ADMIN",
    status: "ACTIVE",
    emailVerifiedAt: "2026-11-01T00:00:00.000Z",
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
  },
});
let client: QueryClient;
let live: Set<string>;
const defaultAdapter = apiClient.defaults.adapter;
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

const flushNetwork = async (complete: () => void) => {
  await act(async () => {
    complete();
    await Promise.resolve(); // Flush the resolved Fetch/effect microtasks, without timers.
  });
};

beforeEach(() => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  client.setQueryData(AUTH_SESSION_QUERY_KEY, account());
  setAccessToken("synthetic-test-token");
  apiClient.defaults.adapter = "fetch";
  live = new Set();
  let sequence = 0;
  vi.spyOn(URL, "createObjectURL").mockImplementation(() => {
    const url = `blob:private-${String(sequence++)}`;
    live.add(url);
    return url;
  });
  vi.spyOn(URL, "revokeObjectURL").mockImplementation((url) => {
    live.delete(url);
  });
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  client.clear();
  clearAccessToken();
  if (defaultAdapter !== undefined) apiClient.defaults.adapter = defaultAdapter;
  vi.unstubAllGlobals();
});

describe("illustrated Chapter renderer with authenticated media transport", () => {
  it("renders ordered private images as each arrives, reserves geometry, and retains retry focus after a decode failure", async () => {
    const requests: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const request = input instanceof Request ? input : new Request(input);
        requests.push(request.url);
        expect(request.headers.get("authorization")).toBe(
          "Bearer synthetic-test-token",
        );
        return Promise.resolve(
          new Response("page", {
            headers: { "Content-Type": "image/png" },
          }),
        );
      }),
    );
    const view = render(<ChapterContentRenderer pages={pages} />, { wrapper });
    const first = await screen.findByRole("img", { name: "صفحة 1" });
    await waitFor(() => {
      expect(requests).toHaveLength(10);
    });
    expect(
      screen.queryByRole("img", { name: "صفحة 11" }),
    ).not.toBeInTheDocument();
    expect(first.closest("li")).toHaveStyle({ aspectRatio: "600 / 800" });
    fireEvent.error(first);
    fireEvent.click(
      screen.getByRole("button", { name: "إعادة تحميل الصفحة 1" }),
    );
    const retried = await screen.findByRole("img", { name: "صفحة 1" });
    fireEvent.load(retried);
    await waitFor(() => {
      expect(retried.closest("li")).toHaveFocus();
    });
    expect(requests.filter((url) => url.includes("asset-0/"))).toHaveLength(2);
    view.unmount();
    expect(live.size).toBe(0);
  });

  it("isolates Chapter/account changes from late network responses and clears owned bytes on logout", async () => {
    const pending: { request: Request; finish: () => void }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const request = input instanceof Request ? input : new Request(input);
        return new Promise<Response>((resolve) => {
          pending.push({
            request,
            finish: () => {
              resolve(
                new Response("page", {
                  headers: { "Content-Type": "image/png" },
                }),
              );
            },
          });
        });
      }),
    );
    const { result, rerender, unmount } = renderHook(
      ({ scope }) => useProgressiveChapterImages(pages, scope, 0),
      { wrapper, initialProps: { scope: "chapter-a" } },
    );
    await waitFor(() => {
      expect(pending).toHaveLength(1);
    });
    rerender({ scope: "chapter-b" });
    await waitFor(() => {
      expect(pending).toHaveLength(2);
    });
    expect(pending[0]?.request.signal.aborted).toBe(true);
    await flushNetwork(() => {
      pending[0]?.finish();
    });
    expect(result.current.resources.get("asset-0")?.url).toBeUndefined();
    act(() => {
      client.setQueryData(AUTH_SESSION_QUERY_KEY, account("admin-two"));
    });
    await waitFor(() => {
      expect(pending).toHaveLength(3);
    });
    await flushNetwork(() => {
      pending[2]?.finish();
    });
    await waitFor(() => {
      expect(result.current.resources.get("asset-0")?.phase).toBe("ready");
    });
    act(() => {
      client.setQueryData(AUTH_SESSION_QUERY_KEY, null);
    });
    await waitFor(() => {
      expect(result.current.available).toBe(false);
    });
    expect(result.current.resources.size).toBe(0);
    expect(live.size).toBe(0);
    unmount();
  });

  it("does not let late metadata repopulate an old actor cache", async () => {
    const id = "43afae94-0e94-45e9-ab76-100f889d0777";
    const unknownPages = [{ assetId: id }];
    let finishMetadata: ((response: Response) => void) | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            finishMetadata = resolve;
          }),
      ),
    );
    const { result, unmount } = renderHook(
      () => useProgressiveChapterImages(unknownPages, "unsaved", 0),
      { wrapper },
    );
    await waitFor(() => {
      expect(finishMetadata).toBeDefined();
    });
    act(() => {
      client.setQueryData(AUTH_SESSION_QUERY_KEY, null);
    });
    await waitFor(() => {
      expect(result.current.available).toBe(false);
    });
    await flushNetwork(() => {
      finishMetadata?.(
        Response.json({
          success: true,
          statusCode: 200,
          message: "Asset",
          requestId: "metadata",
          timestamp: "2026-11-01T00:00:00.000Z",
          path: "/api/v1/media/assets/" + id,
          data: {
            id,
            mediaClass: "chapter_page",
            status: "available",
            contentType: "image/png",
            byteLength: 4,
            width: 600,
            height: 800,
            contentPath: "/api/v1/media/assets/" + id + "/content",
            createdAt: "2026-11-01T00:00:00.000Z",
          },
        }),
      );
    });
    expect(
      client.getQueryData(mediaKeys.asset("admin-one", id)),
    ).toBeUndefined();
    expect(result.current.resources.size).toBe(0);
    expect(live.size).toBe(0);
    unmount();
  });

  it("does not invent a sample page for an empty draft", () => {
    render(<ChapterContentRenderer pages={[]} />);
    expect(screen.getByText("لا توجد صفحات للمعاينة.")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("structured text Chapter renderer", () => {
  it("renders allowed blocks in order with emphasis and a same-site link", () => {
    render(
      <ChapterContentRenderer
        document={{
          version: 1,
          blocks: [
            { type: "heading", level: 2, text: "Opening" },
            { type: "heading", level: 3, text: "Details" },
            {
              type: "paragraph",
              content: [
                { text: "Bold", bold: true },
                { text: "Italic", italic: true },
                { text: "Read", href: "/stories/example" },
              ],
            },
            { type: "list", ordered: true, items: ["First", "Second"] },
            { type: "list", ordered: false, items: ["One", "Two"] },
          ],
        }}
      />,
    );
    const region = screen.getByLabelText("نص الفصل");
    expect(region.querySelectorAll("h2, h3, p, ol, ul")).toHaveLength(5);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Opening",
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Details",
    );
    expect(screen.getByText("Bold").closest("strong")).toBeInTheDocument();
    expect(screen.getByText("Italic").closest("em")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read" })).toHaveAttribute(
      "href",
      "/stories/example",
    );
    expect(region.querySelector("ol")).toHaveTextContent("FirstSecond");
    expect(region.querySelector("ul")).toHaveTextContent("OneTwo");
  });

  it("renders draft markup as text and does not activate an unsafe link", () => {
    render(
      <ChapterContentRenderer
        document={{
          version: 1,
          blocks: [
            {
              type: "paragraph",
              content: [
                {
                  text: "<script>alert(1)</script>",
                  href: "https://example.com",
                },
              ],
            },
          ],
        }}
      />,
    );
    expect(screen.getByText("<script>alert(1)</script>")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  apiClient,
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/services/api/api-client";
import { publicCatalogApi } from "./public-catalog.api";
import { SafePublicCatalogError } from "../model/public-catalog.errors";

import {
  publicDetailFixture,
  publicSuccessFixture,
  publicNotFoundFixture,
} from "./public-catalog.test-helper";

const pagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};
const envelope = (data: unknown, extra = {}) => ({
  success: true,
  statusCode: 200,
  message: "Loaded",
  data,
  requestId: "public-request",
  timestamp: "2026-10-31T12:00:00.000Z",
  path: "/content/catalog/works",
  ...extra,
});
afterEach(() => {
  vi.unstubAllGlobals();
  clearAccessToken();
});
describe("public catalog browser boundary", () => {
  it("uses the central client's final credential-free adapter and parses optional list pagination", async () => {
    setAccessToken("private-session");
    const requests: Request[] = [];
    vi.stubGlobal("fetch", (request: Request) => {
      requests.push(request);
      return Promise.resolve(
        new Response(
          JSON.stringify(
            envelope({ items: [], pagination }, { paginationMeta: pagination }),
          ),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
      );
    });
    expect(await publicCatalogApi.listWorks({ category: "unknown" })).toEqual({
      items: [],
      pagination,
    });
    const request = requests[0];
    expect(request?.credentials).toBe("omit");
    expect(request?.cache).toBe("no-store");
    expect(request?.headers.has("authorization")).toBe(false);
    expect(request?.headers.has("cookie")).toBe(false);
    expect(request?.url).toContain("category=unknown");
    expect(getAccessToken()).toEqual({
      kind: "value",
      value: "private-session",
    });
  });
  it("rejects malformed envelopes and mismatched top-level pagination", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve(
        new Response(
          JSON.stringify(
            envelope(
              { items: [], pagination },
              { paginationMeta: { ...pagination, total: 1, totalPages: 1 } },
            ),
          ),
          { status: 200 },
        ),
      ),
    );
    await expect(publicCatalogApi.listWorks({})).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
      statusCode: 0,
    });
  });
  it("maps validated failure fields safely and never refreshes a public 401", async () => {
    setAccessToken("private-session");
    const requests: Request[] = [];
    vi.stubGlobal("fetch", (request: Request) => {
      requests.push(request);
      return Promise.resolve(
        new Response(
          JSON.stringify({
            success: false,
            statusCode: 401,
            code: "UNAUTHORIZED",
            message: "private-error-sentinel",
            requestId: "safe-request",
            timestamp: "2026-10-31T12:00:00.000Z",
            path: "/private-path",
          }),
          { status: 401 },
        ),
      );
    });
    const error = await publicCatalogApi
      .listWorks({})
      .catch((error: unknown) => error);
    expect(error).toBeInstanceOf(SafePublicCatalogError);
    expect(error).toMatchObject({
      code: "UNAUTHORIZED",
      statusCode: 401,
      requestId: "safe-request",
    });
    expect(JSON.stringify(error)).not.toContain("private-error-sentinel");
    expect(requests).toHaveLength(1);
    expect(getAccessToken()).toEqual({
      kind: "value",
      value: "private-session",
    });
  });
  it("keeps only known validation field paths and fixed error text", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            success: false,
            statusCode: 400,
            code: "VALIDATION_ERROR",
            message: "private-provider-sentinel",
            errors: [
              { field: "query.q", message: "private-query-sentinel" },
              { field: "query.private-sentinel", message: "private" },
            ],
            requestId: "safe-request",
            timestamp: "2026-10-31T12:00:00.000Z",
            path: "/private-sentinel",
          }),
          { status: 400 },
        ),
      ),
    );
    const error = await publicCatalogApi
      .listWorks({})
      .catch((error: unknown) => error);
    expect(error).toMatchObject({
      code: "VALIDATION_ERROR",
      statusCode: 400,
      fieldPaths: ["query.q"],
    });
    expect(JSON.stringify(error)).not.toContain("sentinel");
  });
  it("parses anonymous home and directory data without invented counts or pagination on home", async () => {
    const home = {
      featured: [],
      categoryShortcuts: [],
      latestReleases: [],
      suggestions: [],
    };
    const directory = {
      items: [{ slug: "action", displayName: "Action" }],
      pagination: { ...pagination, limit: 24, total: 1, totalPages: 1 },
    };
    vi.stubGlobal("fetch", (request: Request) =>
      Promise.resolve(
        new Response(
          JSON.stringify(
            envelope(request.url.includes("/home") ? home : directory),
          ),
          { status: 200 },
        ),
      ),
    );
    expect(await publicCatalogApi.getHome()).toEqual(home);
    expect(await publicCatalogApi.listCategories({ q: "Action" })).toEqual(
      directory,
    );
    vi.stubGlobal("fetch", () =>
      Promise.resolve(
        new Response(
          JSON.stringify(envelope(home, { paginationMeta: pagination })),
          { status: 200 },
        ),
      ),
    );
    await expect(publicCatalogApi.getHome()).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
    vi.stubGlobal("fetch", () =>
      Promise.resolve(
        new Response(JSON.stringify(envelope({ ...home, trending: [] })), {
          status: 200,
        }),
      ),
    );
    await expect(publicCatalogApi.getHome()).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });
  it("parses detail and strips older Chapter IDs from subsequent metadata pages", async () => {
    const detail = publicDetailFixture();
    const chapter = {
      ...detail.chapters.items[0],
      id: "00000000-0000-4000-8000-000000000001",
      workId: "00000000-0000-4000-8000-000000000002",
    };
    vi.stubGlobal("fetch", (request: Request) =>
      Promise.resolve(
        new Response(
          JSON.stringify(
            publicSuccessFixture(
              /\/chapters\/\d+$/u.test(request.url)
                ? { chapter }
                : request.url.includes("/chapters?")
                  ? { items: [chapter], pagination: detail.chapters.pagination }
                  : detail,
            ),
          ),
          { status: 200 },
        ),
      ),
    );
    expect(await publicCatalogApi.getDetail("saved-work")).toEqual(detail);
    await expect(
      publicCatalogApi.getDetail("other-work"),
    ).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
    await expect(
      publicCatalogApi.listChapters("saved-work", 2),
    ).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
    await expect(
      publicCatalogApi.getChapter("saved-work", 2),
    ).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
    expect(await publicCatalogApi.listChapters("saved-work", 1)).toEqual(
      detail.chapters,
    );
    expect(await publicCatalogApi.getChapter("saved-work", 1)).toEqual(
      detail.firstChapter,
    );
    vi.stubGlobal("fetch", () =>
      Promise.resolve(
        new Response(JSON.stringify(publicNotFoundFixture()), { status: 404 }),
      ),
    );
    await expect(
      publicCatalogApi.getDetail("saved-work"),
    ).rejects.toMatchObject({ code: "NOT_FOUND", statusCode: 404 });
  });
  it("reads work-scoped approved image bytes and validates binary error envelopes", async () => {
    const requests: Request[] = [];
    vi.stubGlobal("fetch", (request: Request) => {
      requests.push(request);
      return Promise.resolve(
        new Response(new Uint8Array([1, 2, 3]), {
          status: 200,
          headers: { "content-type": "image/jpeg" },
        }),
      );
    });
    const image = await publicCatalogApi.getImage("saved-work", "cover");
    expect(image.size).toBe(3);
    expect(image.type).toBe("image/jpeg");
    expect(requests[0]?.url).toContain("/content/works/saved-work/cover");
    expect(requests[0]?.credentials).toBe("omit");
    vi.stubGlobal("fetch", () =>
      Promise.resolve(
        new Response(JSON.stringify(publicNotFoundFixture()), {
          status: 404,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    await expect(
      publicCatalogApi.getImage("saved-work", "cover"),
    ).rejects.toMatchObject({ code: "NOT_FOUND", statusCode: 404 });
  });
  it("forwards cancellation and rejects invalid input before networking", async () => {
    const get = vi.spyOn(apiClient, "get");
    await expect(
      publicCatalogApi.listWorks({ view: "stories", type: "manga" }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    expect(get).not.toHaveBeenCalled();
    const abort = new AbortController();
    abort.abort();
    await expect(
      publicCatalogApi.listWorks({}, abort.signal),
    ).rejects.toMatchObject({ code: "CANCELLED" });
  });
});

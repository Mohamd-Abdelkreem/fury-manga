// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { publicCatalogServer } from "./public-catalog.server";

import {
  publicDetailFixture,
  publicSuccessFixture,
} from "./public-catalog.test-helper";

vi.mock("server-only", () => ({}));
vi.mock("@/services/api/api-client", () => {
  throw new Error("Browser session module imported on server.");
});

const pagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("request-isolated public server boundary", () => {
  it("uses validated private origin with credential omission, no-store, signal and no forwarded authority", async () => {
    vi.stubEnv("SERVER_API_URL", "http://127.0.0.1:4000/api/v1");
    vi.stubEnv("SITE_ORIGIN", "https://fury.example");
    const requests: Request[] = [];
    const abort = new AbortController();
    vi.stubGlobal("fetch", (request: Request) => {
      requests.push(request);
      return Promise.resolve(
        new Response(
          JSON.stringify({
            success: true,
            statusCode: 200,
            message: "Loaded",
            data: { items: [], pagination },
            requestId: "public-request",
            timestamp: "2026-10-31T12:00:00.000Z",
            path: "/content/catalog/works",
          }),
          { status: 200 },
        ),
      );
    });
    expect(
      await publicCatalogServer.listWorks({ q: "Saved" }, abort.signal),
    ).toEqual({ items: [], pagination });
    expect(requests[0]?.url).toBe(
      "http://127.0.0.1:4000/api/v1/content/catalog/works?view=all&sort=newest&page=1&q=Saved",
    );
    expect(requests[0]?.cache).toBe("no-store");
    expect(requests[0]?.credentials).toBe("omit");
    expect(requests[0]?.headers.has("cookie")).toBe(false);
    expect(requests[0]?.headers.has("authorization")).toBe(false);
    expect(requests[0]?.signal.aborted).toBe(false);
    abort.abort();
    expect(requests[0]?.signal.aborted).toBe(true);
  });
  it("reads home and directory through the same isolated credential-free boundary", async () => {
    vi.stubEnv("SERVER_API_URL", "http://127.0.0.1:4000/api/v1");
    vi.stubEnv("SITE_ORIGIN", "https://fury.example");
    const requests: Request[] = [];
    vi.stubGlobal("fetch", (request: Request) => {
      requests.push(request);
      return Promise.resolve(
        new Response(
          JSON.stringify({
            success: true,
            statusCode: 200,
            message: "Loaded",
            data: request.url.includes("/home")
              ? {
                  featured: [],
                  categoryShortcuts: [],
                  latestReleases: [],
                  suggestions: [],
                }
              : { items: [], pagination: { ...pagination, limit: 24 } },
            requestId: "request-id",
            timestamp: "2026-10-31T12:00:00.000Z",
            path: "/content/catalog",
          }),
          { status: 200 },
        ),
      );
    });
    expect(await publicCatalogServer.getHome()).toEqual({
      featured: [],
      categoryShortcuts: [],
      latestReleases: [],
      suggestions: [],
    });
    expect(
      await publicCatalogServer.listCategories({ q: "Action" }),
    ).toMatchObject({ items: [], pagination: { limit: 24 } });
    expect(requests.map((request) => request.url)).toEqual([
      "http://127.0.0.1:4000/api/v1/content/catalog/home",
      "http://127.0.0.1:4000/api/v1/content/catalog/categories?page=1&q=Action",
    ]);
    for (const request of requests) {
      expect(request.credentials).toBe("omit");
      expect(request.cache).toBe("no-store");
    }
  });
  it("parses request-time detail without browser authority", async () => {
    vi.stubEnv("SERVER_API_URL", "http://127.0.0.1:4000/api/v1");
    vi.stubEnv("SITE_ORIGIN", "https://fury.example");
    const detail = publicDetailFixture();
    vi.stubGlobal("fetch", (_request: Request) =>
      Promise.resolve(
        new Response(JSON.stringify(publicSuccessFixture(detail)), {
          status: 200,
        }),
      ),
    );
    expect(await publicCatalogServer.getDetail("saved-work")).toEqual(detail);
    await expect(
      publicCatalogServer.getDetail("other-work"),
    ).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });
  it("does not reuse another request's configuration or a failed response as empty data", async () => {
    vi.stubEnv("SERVER_API_URL", "http://127.0.0.1:4001/api/v1");
    vi.stubEnv("SITE_ORIGIN", "https://fury.example");
    vi.stubGlobal("fetch", () =>
      Promise.resolve(new Response("private-upstream-body", { status: 503 })),
    );
    await expect(publicCatalogServer.listWorks({})).rejects.toMatchObject({
      statusCode: 503,
    });
    vi.stubEnv("SERVER_API_URL", "http://127.0.0.1:4002/api/v1");
    const fetch = vi.fn((_request: Request) =>
      Promise.resolve(new Response("broken", { status: 200 })),
    );
    vi.stubGlobal("fetch", fetch);
    await expect(publicCatalogServer.listWorks({})).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
    expect(fetch.mock.calls[0]?.[0].url).toContain(":4002/api/v1/");
  });
});

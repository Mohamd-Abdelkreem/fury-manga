import {
  AxiosError,
  AxiosHeaders,
  CanceledError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it } from "vitest";
import {
  apiClient,
  clearAccessToken,
  setAccessToken,
} from "@/services/api/api-client";
import { adminChapterApi } from "./admin-chapter.api";
import { SafeAdminContentError } from "./admin-content.api";

const workId = "11111111-1111-4111-8111-111111111111";
const chapterId = "22222222-2222-4222-8222-222222222222";
const assetId = "33333333-3333-4333-8333-333333333333";
const pageId = "44444444-4444-4444-8444-444444444444";
const chapter = {
  id: chapterId,
  workId,
  number: 1,
  title: "الفصل الأول",
  contentType: "illustrated",
  publicationStatus: "draft",
  publishedAt: null,
  version: 0,
  createdAt: "2026-09-26T00:00:00.000Z",
  updatedAt: "2026-09-26T00:00:00.000Z",
  textContent: null,
  pages: [{ id: pageId, position: 1, assetId, assetStatus: "available" }],
  readyForPublication: true,
};
const envelope = (data: unknown, path: string) => ({
  success: true,
  statusCode: 200,
  message: "Saved",
  data,
  requestId: "req-1",
  timestamp: "2026-09-26T00:00:00.000Z",
  path: `/api/v1${path}`,
});
const defaultAdapter = apiClient.defaults.adapter;

afterEach(() => {
  clearAccessToken();
  if (defaultAdapter !== undefined) apiClient.defaults.adapter = defaultAdapter;
  document.cookie = "csrfToken=; Max-Age=0; path=/";
});

describe("Chapter API adapter", () => {
  it("parses bounded list summaries and sends exact Work filters", async () => {
    const summary = {
      id: chapterId,
      workId,
      number: 1,
      title: "Chapter",
      contentType: "illustrated",
      publicationStatus: "draft",
      publishedAt: null,
      version: 0,
      createdAt: "2026-09-26T00:00:00.000Z",
      updatedAt: "2026-09-26T00:00:00.000Z",
      readyForPublication: true,
    };
    const pagination = {
      page: 2,
      limit: 8,
      total: 10,
      totalPages: 2,
      hasNextPage: false,
      hasPreviousPage: true,
    };
    const requests: InternalAxiosRequestConfig[] = [];
    apiClient.defaults.adapter = (config): Promise<AxiosResponse> => {
      requests.push(config);
      return Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: envelope({ items: [summary], pagination }, config.url ?? ""),
      });
    };
    const signal = new AbortController().signal;
    await expect(
      adminChapterApi.list(
        workId,
        {
          page: 2,
          limit: 8,
          search: " Chapter ",
          publicationStatus: "draft",
          sort: "number_desc",
        },
        signal,
      ),
    ).resolves.toEqual({ items: [summary], pagination });
    expect(requests[0]?.url).toBe(`/content/admin/works/${workId}/chapters`);
    expect(requests[0]?.params).toEqual({
      page: 2,
      limit: 8,
      search: "Chapter",
      publicationStatus: "draft",
      sort: "number_desc",
    });
    expect(requests[0]?.signal).toBe(signal);
    apiClient.defaults.adapter = (config): Promise<AxiosResponse> =>
      Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: envelope(
          { items: [{ ...summary, textContent: null }], pagination },
          config.url ?? "",
        ),
      });
    await expect(
      adminChapterApi.list(workId, { page: 2, limit: 8, sort: "number_desc" }),
    ).rejects.toMatchObject({ code: "HTTP_ERROR" });
  });
  it("sends a publication command and parses authoritative transition identity", async () => {
    setAccessToken("admin-token");
    document.cookie = "csrfToken=test-token";
    const requests: InternalAxiosRequestConfig[] = [];
    const transition = {
      resourceType: "chapter",
      resourceId: chapterId,
      publicationStatus: "published",
      publishedAt: "2026-09-26T00:00:00.000Z",
      publicationEventId: "55555555-5555-4555-8555-555555555555",
      version: 1,
      transitioned: true,
    };
    apiClient.defaults.adapter = (config): Promise<AxiosResponse> => {
      requests.push(config);
      return Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: envelope({ transition }, config.url ?? ""),
      });
    };
    await expect(
      adminChapterApi.publish(workId, chapterId, {
        expectedVersion: 0,
        targetState: "published",
      }),
    ).resolves.toEqual(transition);
    expect(requests).toHaveLength(1);
    expect(requests[0]?.url).toBe(
      `/content/admin/works/${workId}/chapters/${chapterId}/publication`,
    );
    expect(requests[0]?.method).toBe("put");
    expect(JSON.parse(String(requests[0]?.data))).toEqual({
      expectedVersion: 0,
      targetState: "published",
    });
    expect(requests[0]?.headers.get("X-CSRF-Token")).toBe("test-token");
  });
  it("parses private read and ordered update through the central client", async () => {
    setAccessToken("admin-token");
    document.cookie = "csrfToken=test-token";
    const requests: InternalAxiosRequestConfig[] = [];
    apiClient.defaults.adapter = (config): Promise<AxiosResponse> => {
      requests.push(config);
      return Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: envelope({ chapter }, config.url ?? ""),
      });
    };
    const abort = new AbortController();
    await expect(
      adminChapterApi.get(workId, chapterId, abort.signal),
    ).resolves.toEqual(chapter);
    await expect(
      adminChapterApi.update(workId, chapterId, {
        expectedVersion: 0,
        pages: [{ id: pageId, assetId }],
      }),
    ).resolves.toEqual(chapter);
    expect(requests.map(({ method, url }) => [method, url])).toEqual([
      ["get", `/content/admin/works/${workId}/chapters/${chapterId}`],
      ["patch", `/content/admin/works/${workId}/chapters/${chapterId}`],
    ]);
    expect(requests[0]?.signal).toBe(abort.signal);
    expect(requests[0]?.headers.get("Authorization")).toBe(
      "Bearer admin-token",
    );
    expect(JSON.parse(String(requests[1]?.data))).toEqual({
      expectedVersion: 0,
      pages: [{ id: pageId, assetId }],
    });
  });

  it("rejects malformed private envelopes without exposing response fields", async () => {
    apiClient.defaults.adapter = (config): Promise<AxiosResponse> =>
      Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: envelope(
          { chapter: { ...chapter, internalPath: "private/media/path" } },
          config.url ?? "",
        ),
      });
    await expect(adminChapterApi.get(workId, chapterId)).rejects.toMatchObject({
      code: "HTTP_ERROR",
      statusCode: 0,
    });
    await expect(adminChapterApi.get(workId, chapterId)).rejects.toBeInstanceOf(
      SafeAdminContentError,
    );
  });

  it("projects cancellation and field errors without private paths", async () => {
    apiClient.defaults.adapter = (config): Promise<AxiosResponse> =>
      Promise.reject(new CanceledError("cancelled", config));
    await expect(adminChapterApi.get(workId, chapterId)).rejects.toMatchObject({
      code: "CANCELLED",
    });

    apiClient.defaults.adapter = (config): Promise<AxiosResponse> => {
      const response: AxiosResponse = {
        config,
        headers: new AxiosHeaders(),
        status: 400,
        statusText: "Bad Request",
        data: {
          success: false,
          statusCode: 400,
          code: "VALIDATION_ERROR",
          message: "Invalid",
          requestId: "req-2",
          timestamp: "2026-09-26T00:00:00.000Z",
          path: `/api/v1${config.url ?? ""}`,
          errors: [
            { field: "body.pages.0.assetId", message: "invalid" },
            { field: "private/media/key", message: "secret" },
          ],
        },
      };
      return Promise.reject(
        new AxiosError(
          "Bad Request",
          "ERR_BAD_REQUEST",
          config,
          undefined,
          response,
        ),
      );
    };
    await expect(
      adminChapterApi.create(workId, { number: 1, title: "فصل", pages: [] }),
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      fieldPaths: ["body.pages.0.assetId"],
      requestId: "req-2",
    });
  });

  it("projects Chapter status errors to safe codes and bounded fields", async () => {
    const sentinel = "private/media/key?token=secret";
    for (const [status, code] of [
      [401, "UNAUTHORIZED"],
      [403, "FORBIDDEN"],
      [404, "NOT_FOUND"],
      [409, "CONTENT_STALE_WRITE"],
      [503, "SERVICE_UNAVAILABLE"],
    ] as const) {
      apiClient.defaults.adapter = (config): Promise<AxiosResponse> => {
        const response: AxiosResponse = {
          config,
          headers: new AxiosHeaders(),
          status,
          statusText: "Failure",
          data: {
            success: false,
            statusCode: status,
            code,
            message: sentinel,
            requestId: "safe-request-id",
            timestamp: "2026-09-26T00:00:00.000Z",
            path: `/api/v1${config.url ?? ""}`,
            errors: [
              { field: "body.textContent.blocks.0.href", message: sentinel },
              { field: "body.pages.0.assetId", message: sentinel },
              { field: sentinel, message: sentinel },
            ],
          },
        };
        return Promise.reject(
          new AxiosError(
            sentinel,
            "ERR_BAD_RESPONSE",
            config,
            undefined,
            response,
          ),
        );
      };
      let projected: unknown;
      try {
        await adminChapterApi.get(workId, chapterId);
      } catch (error) {
        projected = error;
      }
      expect(projected).toBeInstanceOf(SafeAdminContentError);
      expect(projected).toMatchObject({
        code,
        statusCode: status,
        requestId: "safe-request-id",
        fieldPaths: ["body.textContent.blocks.0.href", "body.pages.0.assetId"],
      });
      expect(JSON.stringify(projected)).not.toContain(sentinel);
    }
  });

  it("does not preserve a raw network error or a mismatched private Chapter", async () => {
    const sentinel = "Bearer private-token /private/media/key";
    apiClient.defaults.adapter = (config): Promise<AxiosResponse> =>
      Promise.reject(new AxiosError(sentinel, "ERR_NETWORK", config));
    await expect(adminChapterApi.get(workId, chapterId)).rejects.toMatchObject({
      code: "NETWORK_ERROR",
      statusCode: 0,
    });
    apiClient.defaults.adapter = (config): Promise<AxiosResponse> =>
      Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: envelope(
          { chapter: { ...chapter, workId: assetId } },
          config.url ?? "",
        ),
      });
    await expect(adminChapterApi.get(workId, chapterId)).rejects.toMatchObject({
      code: "HTTP_ERROR",
      statusCode: 0,
    });
  });
});

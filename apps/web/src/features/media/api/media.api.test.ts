import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it } from "vitest";

import {
  apiClient,
  clearAccessToken,
  setAccessToken,
} from "@/services/api/api-client";

import { mediaApi, SafeMediaError } from "./media.api";

const defaultAdapter = apiClient.defaults.adapter;
afterEach(() => {
  clearAccessToken();
  if (defaultAdapter !== undefined) apiClient.defaults.adapter = defaultAdapter;
});

describe("private media API adapter", () => {
  it("uses the central session transport and sends class before file", async () => {
    setAccessToken("test-access-token");
    document.cookie = "csrfToken=test-csrf-token";
    const requestHeaders: string[] = [];
    const parts: string[] = [];
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> => {
      requestHeaders.push(
        config.headers.get("Authorization")?.toString() ?? "",
      );
      requestHeaders.push(config.headers.get("x-csrf-token")?.toString() ?? "");
      requestHeaders.push(
        config.headers.get("Idempotency-Key")?.toString() ?? "",
      );
      if (config.data instanceof FormData) {
        for (const [name] of config.data.entries()) parts.push(name);
      }
      return Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 201,
        statusText: "Created",
        data: {
          success: true,
          statusCode: 201,
          message: "Uploaded",
          data: {
            id: "43afae94-0e94-45e9-ab76-100f889d0777",
            mediaClass: "work_cover",
            status: "available",
            contentType: "image/png",
            byteLength: 500,
            width: 600,
            height: 800,
            contentPath:
              "/api/v1/media/assets/43afae94-0e94-45e9-ab76-100f889d0777/content",
            createdAt: "2026-09-23T10:00:00.000Z",
          },
          requestId: "req-1",
          timestamp: "2026-09-23T10:00:00.000Z",
          path: "/api/v1/media/assets",
        },
      });
    };
    const uploaded = await mediaApi.upload(
      "work_cover",
      new File(["image"], "cover.png", { type: "image/png" }),
      "11111111-1111-4111-8111-111111111111",
    );
    expect(uploaded.id).toBe("43afae94-0e94-45e9-ab76-100f889d0777");
    expect(parts).toEqual(["mediaClass", "file"]);
    expect(requestHeaders).toEqual([
      "Bearer test-access-token",
      "test-csrf-token",
      "11111111-1111-4111-8111-111111111111",
    ]);
  });

  it("keeps private binary bytes outside JSON cache data", async () => {
    const bytes = new Blob(["private-image"], { type: "image/webp" });
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> =>
      Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: bytes,
      });

    await expect(
      mediaApi.readContent("43afae94-0e94-45e9-ab76-100f889d0777"),
    ).resolves.toBe(bytes);
  });

  it("uses owner scope for avatar lists and CSRF transport for removal", async () => {
    setAccessToken("owner-access-token");
    document.cookie = "csrfToken=owner-csrf-token";
    const requests: InternalAxiosRequestConfig[] = [];
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> => {
      requests.push(config);
      const removing = config.method === "delete";
      return Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: removing
          ? {
              success: true,
              statusCode: 200,
              message: "Removed",
              data: {
                id: "43afae94-0e94-45e9-ab76-100f889d0777",
                status: "removed",
              },
              requestId: "req-remove",
              timestamp: "2026-09-23T10:00:00.000Z",
              path: "/api/v1/media/assets/43afae94-0e94-45e9-ab76-100f889d0777",
            }
          : {
              success: true,
              statusCode: 200,
              message: "Listed",
              data: {
                items: [],
                pagination: {
                  page: 1,
                  limit: 25,
                  total: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
              requestId: "req-list",
              timestamp: "2026-09-23T10:00:00.000Z",
              path: "/api/v1/media/assets",
            },
      });
    };

    await mediaApi.listMine();
    await mediaApi.removeAvatar("43afae94-0e94-45e9-ab76-100f889d0777");
    expect(requests[0]?.params).toEqual({
      scope: "mine",
      mediaClass: "user_avatar",
      page: 1,
    });
    expect(requests[1]?.headers.get("Authorization")).toBe(
      "Bearer owner-access-token",
    );
    expect(requests[1]?.headers.get("x-csrf-token")).toBe("owner-csrf-token");
  });

  it("projects denied and unavailable responses to an allowlisted error", async () => {
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> => {
      const response = {
        config,
        headers: new AxiosHeaders(),
        status: 503,
        statusText: "Unavailable",
        data: new Blob(
          [
            JSON.stringify({
              success: false,
              statusCode: 503,
              message: "C:\\private\\media\\secret.webp",
              code: "MEDIA_UNAVAILABLE",
              requestId: "req-safe",
              timestamp: "2026-09-23T10:00:00.000Z",
              path: "/api/v1/media/assets/id/content",
            }),
          ],
          { type: "application/json" },
        ),
      };
      return Promise.reject(
        new AxiosError(
          "private decoder failure",
          undefined,
          config,
          undefined,
          response,
        ),
      );
    };

    const error = await mediaApi
      .readContent("43afae94-0e94-45e9-ab76-100f889d0777")
      .catch((received: unknown) => received);
    expect(error).toBeInstanceOf(SafeMediaError);
    expect(error).toMatchObject({
      code: "MEDIA_UNAVAILABLE",
      statusCode: 503,
      requestId: "req-safe",
    });
    expect(String(error)).not.toContain("private\\media");
  });

  it("parses reference envelopes and sends compare-and-set commands through the central transport", async () => {
    setAccessToken("admin-access-token");
    document.cookie = "csrfToken=admin-csrf-token";
    const requests: InternalAxiosRequestConfig[] = [];
    const reference = {
      id: "55aec196-95e6-4763-a5a7-d43fb6cc9553",
      targetKind: "work_cover",
      targetId: "ff4f24b3-b11d-429a-9e4f-a94f8ce02436",
      assetId: "43afae94-0e94-45e9-ab76-100f889d0777",
      version: 0,
      createdAt: "2026-09-23T10:00:00.000Z",
      updatedAt: "2026-09-23T10:00:00.000Z",
    } as const;
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> => {
      requests.push(config);
      const retired = config.method === "delete";
      return Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: retired ? 200 : 201,
        statusText: "OK",
        data: {
          success: true,
          statusCode: retired ? 200 : 201,
          message: retired ? "Retired" : "Bound",
          data: retired
            ? { id: reference.id, status: "retired", version: 1 }
            : reference,
          requestId: "req-reference",
          timestamp: reference.createdAt,
          path: retired
            ? `/api/v1/media/references/${reference.id}`
            : "/api/v1/media/references",
        },
      });
    };

    await expect(
      mediaApi.bindReference({
        targetKind: reference.targetKind,
        targetId: reference.targetId,
        assetId: reference.assetId,
      }),
    ).resolves.toEqual(reference);
    await expect(
      mediaApi.retireReference(reference.id, {
        expectedAssetId: reference.assetId,
        expectedVersion: 0,
      }),
    ).resolves.toMatchObject({ status: "retired", version: 1 });
    expect(requests.map((item) => item.method)).toEqual(["post", "delete"]);
    expect(requests[1]?.headers.get("x-csrf-token")).toBe("admin-csrf-token");
    expect(JSON.parse(String(requests[1]?.data)) as unknown).toEqual({
      expectedAssetId: reference.assetId,
      expectedVersion: 0,
    });
  });
});

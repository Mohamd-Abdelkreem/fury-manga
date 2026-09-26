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

import { adminContentApi, SafeAdminContentError } from "./admin-content.api";

const defaultAdapter = apiClient.defaults.adapter;
const category = {
  id: "11111111-1111-4111-8111-111111111111",
  displayName: "خيال",
  slug: "fantasy",
  enabled: true,
  displayPosition: 1,
  worksCount: 3,
  version: 2,
  createdAt: "2026-09-25T10:00:00.000Z",
  updatedAt: "2026-09-25T10:00:00.000Z",
} as const;
const displaced = {
  ...category,
  id: "22222222-2222-4222-8222-222222222222",
  displayName: "أكشن",
  slug: "action",
  displayPosition: 2,
  version: 4,
} as const;
const work = {
  id: "33333333-3333-4333-8333-333333333333",
  title: "عمل محفوظ",
  alternativeTitle: "Saved Work",
  synopsis: "A saved synopsis long enough to satisfy the contract.",
  author: "Author",
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
  tags: ["Adventure"],
  version: 3,
  createdAt: "2026-09-25T10:00:00.000Z",
  updatedAt: "2026-09-25T10:00:00.000Z",
  categories: [category],
} as const;

const successEnvelope = (data: unknown, statusCode: number, path: string) => ({
  success: true,
  statusCode,
  message: "Saved",
  data,
  requestId: "request-category-1",
  timestamp: "2026-09-25T10:00:00.000Z",
  path: `/api/v1${path}`,
});

afterEach(() => {
  clearAccessToken();
  if (defaultAdapter !== undefined) apiClient.defaults.adapter = defaultAdapter;
  document.cookie = "csrfToken=; Max-Age=0; path=/";
});

describe("administrator category API", () => {
  it("sends a CSRF-protected publication command and parses only its strict transition", async () => {
    setAccessToken("publication-admin-token");
    document.cookie = "csrfToken=publication-csrf; path=/";
    const requests: InternalAxiosRequestConfig[] = [];
    const transition = {
      resourceType: "work",
      resourceId: work.id,
      publicationStatus: "draft",
      publishedAt: null,
      publicationEventId: null,
      version: work.version + 1,
      transitioned: true,
    };
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> => {
      requests.push(config);
      return Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: successEnvelope({ transition }, 200, config.url ?? ""),
      });
    };
    await expect(
      adminContentApi.transitionWork(work.id, {
        expectedVersion: work.version,
        targetState: "draft",
      }),
    ).resolves.toEqual(transition);
    expect(requests[0]?.url).toBe(
      `/content/admin/works/${work.id}/publication`,
    );
    expect(requests[0]?.headers.get("Authorization")).toBe(
      "Bearer publication-admin-token",
    );
    expect(requests[0]?.headers.get("x-csrf-token")).toBe("publication-csrf");
  });
  it("uses the central bearer/CSRF client and parses strict category envelopes", async () => {
    setAccessToken("category-admin-token");
    document.cookie = "csrfToken=category-csrf-token; path=/";
    const requests: InternalAxiosRequestConfig[] = [];
    const abort = new AbortController();
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> => {
      requests.push(config);
      const method = config.method?.toLowerCase();
      const path = config.url ?? "";
      let data: unknown;
      let statusCode = 200;
      if (method === "get" && path.endsWith("/categories")) {
        data = successEnvelope(
          {
            items: [category],
            pagination: {
              page: 2,
              limit: 10,
              total: 11,
              totalPages: 2,
              hasNextPage: false,
              hasPreviousPage: true,
            },
          },
          200,
          path,
        );
      } else if (method === "get") {
        data = successEnvelope({ category }, 200, path);
      } else if (method === "post") {
        statusCode = 201;
        data = successEnvelope({ category }, statusCode, path);
      } else if (method === "patch") {
        data = successEnvelope(
          { category: { ...category, displayName: "خيال جديد", version: 3 } },
          200,
          path,
        );
      } else {
        data = successEnvelope(
          { category: displaced, displacedCategory: category },
          200,
          path,
        );
      }
      return Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: statusCode,
        statusText: statusCode === 201 ? "Created" : "OK",
        data,
      });
    };

    const list = await adminContentApi.listCategories(
      { page: 2, limit: 10, search: "  FILTER ", enabled: false },
      abort.signal,
    );
    const detail = await adminContentApi.getCategory(category.id, abort.signal);
    const created = await adminContentApi.createCategory({
      id: category.id,
      displayName: "خيال",
      slug: "FANTASY",
    });
    const updated = await adminContentApi.updateCategory(category.id, {
      expectedVersion: 2,
      displayName: "خيال جديد",
    });
    const moved = await adminContentApi.moveCategory(displaced.id, {
      expectedVersion: 4,
      targetPosition: 1,
    });

    expect(list.items).toEqual([category]);
    expect(list.pagination).toMatchObject({ page: 2, total: 11 });
    expect(detail).toEqual(category);
    expect(created).toEqual(category);
    expect(updated.displayName).toBe("خيال جديد");
    expect(moved).toEqual({ category: displaced, displacedCategory: category });
    expect(requests.map(({ url, method }) => [method, url])).toEqual([
      ["get", "/content/admin/categories"],
      ["get", `/content/admin/categories/${category.id}`],
      ["post", "/content/admin/categories"],
      ["patch", `/content/admin/categories/${category.id}`],
      ["put", `/content/admin/categories/${displaced.id}/position`],
    ]);
    expect(requests[0]?.params).toEqual({
      page: 2,
      limit: 10,
      search: "FILTER",
      enabled: false,
    });
    expect(requests[0]?.signal).toBe(abort.signal);
    expect(requests[1]?.signal).toBe(abort.signal);
    for (const config of requests) {
      expect(config.headers.get("Authorization")).toBe(
        "Bearer category-admin-token",
      );
      if (config.method !== "get") {
        expect(config.headers.get("x-csrf-token")).toBe("category-csrf-token");
      }
    }
    expect(JSON.parse(String(requests[2]?.data)) as unknown).toMatchObject({
      id: category.id,
      displayName: "خيال",
      slug: "fantasy",
    });
    expect(JSON.parse(String(requests[3]?.data)) as unknown).toEqual({
      expectedVersion: 2,
      displayName: "خيال جديد",
    });
    expect(JSON.parse(String(requests[4]?.data)) as unknown).toEqual({
      expectedVersion: 4,
      targetPosition: 1,
    });
  });

  it("uses the final API client for strict Work create/detail/edit envelopes", async () => {
    setAccessToken("work-admin-token");
    document.cookie = "csrfToken=work-csrf-token; path=/";
    const requests: InternalAxiosRequestConfig[] = [];
    const abort = new AbortController();
    const updatedWork = {
      ...work,
      title: "Edited Work",
      alternativeTitle: null,
      version: work.version + 1,
    };
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> => {
      requests.push(config);
      const path = config.url ?? "";
      const method = config.method?.toLowerCase();
      const statusCode = method === "post" ? 201 : 200;
      const data = method === "patch" ? { work: updatedWork } : { work };
      return Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: statusCode,
        statusText: statusCode === 201 ? "Created" : "OK",
        data: successEnvelope(data, statusCode, path),
      });
    };

    const createBody = {
      id: work.id,
      title: work.title,
      slug: work.slug,
      type: work.type,
      storyStatus: work.storyStatus,
      synopsis: work.synopsis,
      categoryIds: [category.id],
      tags: [" Adventure "],
    };
    const created = await adminContentApi.createWork(createBody);
    const detail = await adminContentApi.getWork(work.id, abort.signal);
    const updated = await adminContentApi.updateWork(work.id, {
      expectedVersion: work.version,
      title: "Edited Work",
      alternativeTitle: null,
      categoryIds: [],
      tags: [],
    });

    expect(created).toEqual(work);
    expect(detail).toEqual(work);
    expect(updated).toEqual(updatedWork);
    expect(requests.map(({ url, method }) => [method, url])).toEqual([
      ["post", "/content/admin/works"],
      ["get", `/content/admin/works/${work.id}`],
      ["patch", `/content/admin/works/${work.id}`],
    ]);
    expect(requests[1]?.signal).toBe(abort.signal);
    for (const config of requests) {
      expect(config.headers.get("Authorization")).toBe(
        "Bearer work-admin-token",
      );
      if (config.method !== "get") {
        expect(config.headers.get("x-csrf-token")).toBe("work-csrf-token");
      }
    }
    expect(JSON.parse(String(requests[0]?.data)) as unknown).toMatchObject({
      id: work.id,
      tags: ["Adventure"],
    });
    expect(JSON.parse(String(requests[2]?.data)) as unknown).toEqual({
      expectedVersion: work.version,
      title: "Edited Work",
      alternativeTitle: null,
      categoryIds: [],
      tags: [],
    });
  });

  it("reconciles ambiguous Work creation only through the submitted UUID detail route", async () => {
    setAccessToken("work-admin-token");
    const requests: InternalAxiosRequestConfig[] = [];
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> => {
      requests.push(config);
      if (config.method === "post") {
        return Promise.reject(
          new AxiosError("private network detail", "ECONNRESET", config),
        );
      }
      const path = config.url ?? "";
      return Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: successEnvelope({ work }, 200, path),
      });
    };

    const submittedId = work.id;
    const failure = await adminContentApi
      .createWork({
        id: submittedId,
        title: work.title,
        slug: work.slug,
        type: work.type,
        storyStatus: work.storyStatus,
      })
      .catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(SafeAdminContentError);
    const readback = await adminContentApi.getWork(submittedId);

    expect(readback).toEqual(work);
    expect(requests.map(({ method, url }) => [method, url])).toEqual([
      ["post", "/content/admin/works"],
      ["get", `/content/admin/works/${submittedId}`],
    ]);
    expect(requests).toHaveLength(2);
  });

  it("rejects unknown private fields in a successful Work detail", async () => {
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> =>
      Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: successEnvelope(
          { work: { ...work, storageKey: "C:\\private\\work" } },
          200,
          `/content/admin/works/${work.id}`,
        ),
      });

    const error = await adminContentApi
      .getWork(work.id)
      .catch((received: unknown) => received);
    expect(error).toBeInstanceOf(SafeAdminContentError);
    expect(error).toMatchObject({ code: "HTTP_ERROR", statusCode: 0 });
    expect(String(error)).not.toContain("private");
  });

  it("maps Work edit errors to safe field paths without leaking server details", async () => {
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> =>
      Promise.reject(
        new AxiosError(
          "private transport detail",
          undefined,
          config,
          undefined,
          {
            config,
            headers: new AxiosHeaders(),
            status: 400,
            statusText: "Bad Request",
            data: {
              success: false,
              statusCode: 400,
              code: "VALIDATION_ERROR",
              message: "private validation detail",
              errors: [
                { field: "body.tags.1", message: "private duplicate" },
                { field: "body.coverAssetId", message: "private asset" },
                { field: "body.internalNote", message: "private internal" },
              ],
              requestId: "request-work-edit",
              timestamp: "2026-09-25T10:00:00.000Z",
              path: `/api/v1/content/admin/works/${work.id}`,
            },
          },
        ),
      );

    const error = await adminContentApi
      .updateWork(work.id, {
        expectedVersion: work.version,
        tags: ["Duplicate"],
      })
      .catch((received: unknown) => received);
    expect(error).toBeInstanceOf(SafeAdminContentError);
    expect(error).toMatchObject({
      code: "VALIDATION_ERROR",
      statusCode: 400,
      fieldPaths: ["body.tags.1", "body.coverAssetId"],
    });
    expect(String(error)).not.toContain("private");
  });

  it("maps strict error envelopes to safe codes and field paths only", async () => {
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> => {
      const response = {
        config,
        headers: new AxiosHeaders(),
        status: 409,
        statusText: "Conflict",
        data: {
          success: false,
          statusCode: 409,
          code: "CONTENT_STALE_WRITE",
          message: "C:\\private\\writer-note.txt",
          errors: [
            {
              field: "body.displayName",
              message: "private server validation detail",
            },
            {
              field: "body.tags.1",
              message: "private tag validation detail",
            },
            {
              field: "body.privateStorageKey",
              message: "private storage detail",
            },
          ],
          requestId: "request-conflict",
          timestamp: "2026-09-25T10:00:00.000Z",
          path: "/api/v1/content/admin/categories/11111111-1111-4111-8111-111111111111",
        },
      };
      return Promise.reject(
        new AxiosError(
          "private axios text",
          undefined,
          config,
          undefined,
          response,
        ),
      );
    };

    const error = await adminContentApi
      .updateCategory(category.id, { expectedVersion: 0, enabled: false })
      .catch((received: unknown) => received);

    expect(error).toBeInstanceOf(SafeAdminContentError);
    expect(error).toMatchObject({
      code: "CONTENT_STALE_WRITE",
      statusCode: 409,
      requestId: "request-conflict",
      fieldPaths: ["body.displayName", "body.tags.1"],
    });
    expect(String(error)).not.toContain("private");
  });

  it("rejects unknown success data without exposing response text", async () => {
    apiClient.defaults.adapter = (
      config: InternalAxiosRequestConfig,
    ): Promise<AxiosResponse> =>
      Promise.resolve({
        config,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
        data: successEnvelope(
          { category: { ...category, storageKey: "C:\\private\\asset" } },
          200,
          "/content/admin/categories",
        ),
      });

    const error = await adminContentApi
      .getCategory(category.id)
      .catch((received: unknown) => received);

    expect(error).toBeInstanceOf(SafeAdminContentError);
    expect(error).toMatchObject({ code: "HTTP_ERROR", statusCode: 0 });
    expect(String(error)).not.toContain("private");
  });
});

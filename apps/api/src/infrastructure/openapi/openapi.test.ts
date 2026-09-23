import { describe, expect, it } from "vitest";

import { buildOpenApiDocument } from "./openapi.js";

const expectedPaths = [
  "/auth/register",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/login",
  "/auth/refresh",
  "/auth/logout",
  "/auth/logout-all",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/validate-reset-token",
  "/auth/change-password",
  "/users/me",
  "/health/live",
  "/health/ready",
  "/openapi.json",
  "/content/works",
  "/content/works/{workSlug}",
  "/content/works/{workSlug}/chapters",
  "/content/works/{workSlug}/chapters/{chapterNumber}",
  "/content/admin/categories",
  "/content/admin/categories/{categoryId}",
  "/content/admin/works",
  "/content/admin/works/{workId}",
  "/content/admin/works/{workId}/categories",
  "/content/admin/works/{workId}/chapters",
  "/content/admin/works/{workId}/chapters/{chapterId}",
  "/content/admin/works/{workId}/publication",
  "/content/admin/works/{workId}/chapters/{chapterId}/publication",
] as const;

const contentOperations = [
  ["/content/works", "get", "200"],
  ["/content/works/{workSlug}", "get", "200"],
  ["/content/works/{workSlug}/chapters", "get", "200"],
  ["/content/works/{workSlug}/chapters/{chapterNumber}", "get", "200"],
  ["/content/admin/categories", "get", "200"],
  ["/content/admin/categories", "post", "201"],
  ["/content/admin/categories/{categoryId}", "get", "200"],
  ["/content/admin/categories/{categoryId}", "patch", "200"],
  ["/content/admin/works", "get", "200"],
  ["/content/admin/works", "post", "201"],
  ["/content/admin/works/{workId}", "get", "200"],
  ["/content/admin/works/{workId}", "patch", "200"],
  ["/content/admin/works/{workId}/categories", "put", "200"],
  ["/content/admin/works/{workId}/chapters", "get", "200"],
  ["/content/admin/works/{workId}/chapters", "post", "201"],
  ["/content/admin/works/{workId}/chapters/{chapterId}", "get", "200"],
  ["/content/admin/works/{workId}/chapters/{chapterId}", "patch", "200"],
  ["/content/admin/works/{workId}/publication", "put", "200"],
  [
    "/content/admin/works/{workId}/chapters/{chapterId}/publication",
    "put",
    "200",
  ],
] as const;

const conflictCodesByOperation = [
  ["/content/admin/categories", "post", ["CONTENT_CONFLICT"]],
  [
    "/content/admin/categories/{categoryId}",
    "patch",
    ["CONTENT_IMMUTABLE", "CONTENT_STALE_WRITE"],
  ],
  ["/content/admin/works", "post", ["CONTENT_CONFLICT"]],
  [
    "/content/admin/works/{workId}",
    "patch",
    ["CONTENT_IMMUTABLE", "CONTENT_STALE_WRITE"],
  ],
  ["/content/admin/works/{workId}/categories", "put", ["CONTENT_STALE_WRITE"]],
  [
    "/content/admin/works/{workId}/chapters",
    "post",
    ["CONTENT_CONFLICT", "CONTENT_TYPE_CONFLICT"],
  ],
  [
    "/content/admin/works/{workId}/chapters/{chapterId}",
    "patch",
    ["CONTENT_CONFLICT", "CONTENT_TYPE_CONFLICT", "CONTENT_STALE_WRITE"],
  ],
  [
    "/content/admin/works/{workId}/publication",
    "put",
    ["CONTENT_TRANSITION_CONFLICT", "CONTENT_STALE_WRITE"],
  ],
  [
    "/content/admin/works/{workId}/chapters/{chapterId}/publication",
    "put",
    ["CONTENT_TRANSITION_CONFLICT", "CONTENT_STALE_WRITE"],
  ],
] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const responseHasJsonSchema = (
  paths: unknown,
  path: string,
  method: string,
  status: string,
): boolean => {
  if (!isRecord(paths)) return false;
  const pathItem = paths[path];
  if (!isRecord(pathItem)) return false;
  const operation = pathItem[method];
  if (!isRecord(operation)) return false;
  const responses = operation["responses"];
  if (!isRecord(responses)) return false;
  const response = responses[status];
  if (!isRecord(response)) return false;
  const content = response["content"];
  if (!isRecord(content)) return false;
  const json = content["application/json"];
  return isRecord(json) && Object.hasOwn(json, "schema");
};

const responseCodeEnum = (
  paths: unknown,
  path: string,
  method: string,
  status: string,
): unknown => {
  if (!isRecord(paths)) return undefined;
  const pathItem = paths[path];
  if (!isRecord(pathItem)) return undefined;
  const operation = pathItem[method];
  if (!isRecord(operation)) return undefined;
  const responses = operation["responses"];
  if (!isRecord(responses)) return undefined;
  const response = responses[status];
  if (!isRecord(response)) return undefined;
  const content = response["content"];
  if (!isRecord(content)) return undefined;
  const json = content["application/json"];
  if (!isRecord(json)) return undefined;
  const schema = json["schema"];
  if (!isRecord(schema)) return undefined;
  const properties = schema["properties"];
  if (!isRecord(properties)) return undefined;
  const code = properties["code"];
  return isRecord(code) ? code["enum"] : undefined;
};

describe("OpenAPI document", () => {
  it("documents every public route and authentication scheme", () => {
    const document = buildOpenApiDocument();
    expect(Object.keys(document.paths ?? {}).sort()).toEqual(
      [...expectedPaths].sort(),
    );
    expect(document.components?.securitySchemes).toMatchObject({
      BearerAuth: { type: "http", scheme: "bearer" },
      RefreshCookie: { type: "apiKey", in: "cookie" },
      CsrfHeader: { type: "apiKey", in: "header" },
    });
  });

  it("documents the exact P01 operation set with its authority and statuses", () => {
    const document = buildOpenApiDocument();
    const actualOperations = Object.entries(document.paths ?? {})
      .filter(([path]) => path.startsWith("/content"))
      .flatMap(([path, item]) =>
        ["get", "post", "patch", "put", "delete"].flatMap((method) =>
          Object.hasOwn(item, method) ? [[path, method]] : [],
        ),
      );
    expect(actualOperations.sort()).toEqual(
      contentOperations.map(([path, method]) => [path, method]).sort(),
    );

    for (const [path, method, successStatus] of contentOperations) {
      const operation = document.paths?.[path]?.[method];
      expect(operation, method.toUpperCase() + " " + path).toBeDefined();
      expect(operation?.responses).toHaveProperty(successStatus);
      expect(
        responseHasJsonSchema(document.paths, path, method, successStatus),
      ).toBe(true);
      expect(operation?.responses).toHaveProperty("429");
      expect(operation?.responses).toHaveProperty("500");
      expect(operation?.responses).toHaveProperty("503");
      if (path.startsWith("/content/admin")) {
        expect(operation?.responses).toHaveProperty("401");
        expect(operation?.responses).toHaveProperty("403");
        expect(operation?.security).toEqual(
          method === "get"
            ? [{ BearerAuth: [] }]
            : [{ BearerAuth: [], CsrfHeader: [] }],
        );
      } else {
        expect(operation?.security).toBeUndefined();
      }
      if (method === "get") {
        expect(operation?.requestBody).toBeUndefined();
      } else {
        expect(operation?.requestBody).toBeDefined();
      }
    }
  });

  it("registers shared P01 schemas and exact operation conflict codes", () => {
    const document = buildOpenApiDocument();
    const schemas = document.components?.schemas;
    expect(schemas?.["WorkType"]).toMatchObject({
      type: "string",
      enum: ["manga", "manhwa", "manhua", "comics", "novel", "text-story"],
    });
    expect(schemas?.["StructuredTextDocument"]).toMatchObject({
      type: "object",
      additionalProperties: false,
    });
    expect(schemas?.["AdminChapter"]).toMatchObject({
      type: "object",
      additionalProperties: false,
    });
    expect(schemas?.["PublicWork"]).toMatchObject({
      type: "object",
      additionalProperties: false,
    });
    expect(schemas?.["PublicationTransition"]).toMatchObject({
      type: "object",
      additionalProperties: false,
    });
    expect(schemas?.["ContentErrorCode"]).toMatchObject({
      type: "string",
      enum: [
        "CONTENT_CONFLICT",
        "CONTENT_IMMUTABLE",
        "CONTENT_TYPE_CONFLICT",
        "CONTENT_TRANSITION_CONFLICT",
        "CONTENT_STALE_WRITE",
      ],
    });
    for (const [path, method, expectedCodes] of conflictCodesByOperation) {
      expect(
        responseCodeEnum(document.paths, path, method, "409"),
        method.toUpperCase() + " " + path,
      ).toEqual(expectedCodes);
    }
    expect(
      document.paths?.["/content/works/{workSlug}"]?.get?.responses,
    ).toHaveProperty("404");
  });

  it("documents exact shared codes for every common P01 failure", () => {
    const document = buildOpenApiDocument();
    const commonCodes = {
      "400": ["VALIDATION_ERROR", "BAD_REQUEST"],
      "429": ["RATE_LIMIT_EXCEEDED"],
      "500": ["INTERNAL_SERVER_ERROR"],
      "503": ["SERVICE_UNAVAILABLE"],
    } as const;

    for (const [path, method] of contentOperations) {
      for (const [status, codes] of Object.entries(commonCodes)) {
        expect(
          responseCodeEnum(document.paths, path, method, status),
          method.toUpperCase() + " " + path + " " + status,
        ).toEqual(codes);
      }
      const operation = document.paths?.[path]?.[method];
      if (operation?.responses?.["404"] !== undefined) {
        expect(responseCodeEnum(document.paths, path, method, "404")).toEqual([
          "NOT_FOUND",
        ]);
      }
      if (path.startsWith("/content/admin")) {
        expect(responseCodeEnum(document.paths, path, method, "401")).toEqual([
          "UNAUTHORIZED",
        ]);
        expect(responseCodeEnum(document.paths, path, method, "403")).toEqual([
          "FORBIDDEN",
        ]);
      }
    }
  });
});

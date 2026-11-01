import { describe, expect, it } from "vitest";

import {
  sanitizeRequestForLog,
  sanitizeRequestQuery,
  sanitizeRequestUrl,
} from "./request-sanitizer.js";

describe("request log sanitization", () => {
  it.each([
    "token",
    "access_token",
    "refresh_token",
    "id_token",
    "code",
    "secret",
    "password",
  ])("redacts the %s URL query value", (key) => {
    const result = sanitizeRequestUrl(
      `/auth/reset-password?${key}=secret-value&locale=en`,
    );
    expect(result).toBe(`/auth/reset-password?${key}=[REDACTED]&locale=en`);
    expect(result).not.toContain("secret-value");
  });

  it("preserves non-sensitive parameters and fragments", () => {
    expect(sanitizeRequestUrl("/items?page=2&limit=25#section")).toBe(
      "/items?page=2&limit=25#section",
    );
  });

  it("redacts credential keys case-insensitively in query objects", () => {
    expect(
      sanitizeRequestQuery({ Token: "secret", page: "2", tags: ["a"] }),
    ).toEqual({ Token: "[REDACTED]", page: "2", tags: ["a"] });
  });

  it("sanitizes url, originalUrl, and query without retaining raw request", () => {
    const result = sanitizeRequestForLog({
      url: "/verify?token=one",
      originalUrl: "/api/v1/verify?token=two",
      query: { token: "three", keep: "yes" },
      raw: { url: "/verify?token=four" },
    });
    expect(JSON.stringify(result)).not.toMatch(/one|two|three|four/u);
    expect(result["query"]).toEqual({ token: "[REDACTED]", keep: "yes" });
  });
  it.each([
    [
      "/api/v1/content/catalog/works?q=P05-SEARCH-SENTINEL",
      "/api/v1/content/catalog/works",
    ],
    [
      "/api/v1/content/works/private-sentinel/cover?q=secret",
      "/api/v1/content/works/:workSlug/cover",
    ],
    [
      "/api/v1/content/catalog/%zz-malformed-sentinel",
      "/api/v1/content/[unknown]",
    ],
    ["/api/v1/content/unknown-path-sentinel", "/api/v1/content/[unknown]"],
  ])(
    "projects public content URL %s to a safe route identity",
    (url, expected) => {
      expect(sanitizeRequestUrl(url)).toBe(expected);
      const result = sanitizeRequestForLog({
        method: "GET",
        url,
        originalUrl: url,
        query: { q: "P05-SEARCH-SENTINEL" },
        params: { workSlug: "private-sentinel" },
        raw: { url },
        headers: {
          referer: "/discover?q=P05-SEARCH-SENTINEL",
          "x-original-url": "/unknown-path-sentinel",
        },
        id: "safe-request-id",
      });
      expect(result["id"]).toBe("safe-request-id");
      expect(result["headers"]).toBeUndefined();
      expect(JSON.stringify(result)).not.toMatch(
        /P05-SEARCH-SENTINEL|private-sentinel|malformed-sentinel|unknown-path-sentinel/u,
      );
    },
  );
  it.each(["GET", "HEAD", "POST", "OPTIONS"])(
    "keeps unknown public values private for %s",
    (method) => {
      const url = "/api/v1/content?secret=PRIVATE-SENTINEL";
      expect(
        sanitizeRequestForLog({
          method,
          url,
          path: url,
          query: { secret: "PRIVATE-SENTINEL" },
        }),
      ).toMatchObject({
        method,
        url: "/api/v1/content/[unknown]",
        path: "/api/v1/content/[unknown]",
        query: undefined,
      });
      expect(sanitizeRequestUrl("/api/v1/contentious?view=all")).toBe(
        "/api/v1/contentious?view=all",
      );
    },
  );
  it("preserves existing ADMIN logging scope", () => {
    expect(
      sanitizeRequestForLog({
        url: "/api/v1/content/admin/works",
        headers: { referer: "http://localhost:3000/admin/works" },
      })["headers"],
    ).toEqual({ referer: "http://localhost:3000/admin/works" });
    expect(
      sanitizeRequestUrl("/api/v1/content/admin/works?search=saved-title"),
    ).toBe("/api/v1/content/admin/works?search=saved-title");
  });
});

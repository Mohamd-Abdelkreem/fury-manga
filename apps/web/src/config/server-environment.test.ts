// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getServerEnvironment } from "./server-environment";

vi.mock("server-only", () => ({}));

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("SERVER_API_URL", "http://localhost:4000/api/v1/");
  vi.stubEnv("SITE_ORIGIN", "http://localhost:3000/");
  vi.stubEnv("COMMUNITY_URL", undefined);
});

afterEach(() => vi.unstubAllEnvs());

describe("server catalog configuration", () => {
  it("normalizes explicitly configured origins and keeps community optional", () => {
    expect(getServerEnvironment()).toEqual({
      SERVER_API_URL: "http://localhost:4000/api/v1",
      SITE_ORIGIN: "http://localhost:3000",
    });
    vi.stubEnv("COMMUNITY_URL", "https://community.example.test/invite");
    expect(getServerEnvironment().COMMUNITY_URL).toBe(
      "https://community.example.test/invite",
    );
  });

  it.each(["SERVER_API_URL", "SITE_ORIGIN"] as const)(
    "refuses missing %s instead of deriving a request origin",
    (key) => {
      vi.stubEnv(key, undefined);
      expect(getServerEnvironment).toThrow(
        `Invalid server environment: ${key}`,
      );
    },
  );

  it.each([
    ["SERVER_API_URL", "javascript:private-sentinel"],
    [
      "SERVER_API_URL",
      "https://private-user:private-password@example.test/api",
    ],
    ["SERVER_API_URL", "https://api.example.test/api?token=private-sentinel"],
    ["SERVER_API_URL", "https://api.example.test/api#private-sentinel"],
    ["SITE_ORIGIN", "https://example.test/private-path"],
    ["SITE_ORIGIN", "https://private-user:private-password@example.test"],
    ["SITE_ORIGIN", "https://example.test?secret=private-sentinel"],
    ["SITE_ORIGIN", "//example.test"],
    ["COMMUNITY_URL", "http://community.example.test"],
    ["COMMUNITY_URL", "https://private-user:private-password@example.test"],
    ["COMMUNITY_URL", "https://example.test\\private-sentinel"],
  ] as const)("rejects unsafe %s without disclosing its value", (key, url) => {
    vi.stubEnv(key, url);
    let message = "";
    try {
      getServerEnvironment();
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      message = error.message;
    }
    expect(message).toContain(`Invalid server environment: ${key}`);
    expect(message).not.toContain("private-");
    expect(message).not.toContain(url);
  });

  it("requires a production HTTPS site origin while permitting a private HTTP API", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(getServerEnvironment).toThrow(
      "Invalid server environment: SITE_ORIGIN",
    );
    vi.stubEnv("SITE_ORIGIN", "https://fury.example.test");
    vi.stubEnv("SERVER_API_URL", "http://api:4000/api/v1");
    expect(getServerEnvironment()).toMatchObject({
      SITE_ORIGIN: "https://fury.example.test",
      SERVER_API_URL: "http://api:4000/api/v1",
    });
  });
});

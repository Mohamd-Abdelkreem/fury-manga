import { describe, expect, it } from "vitest";

import {
  commonHttpErrorCodeSchema,
  errorEnvelopeSchema,
  paginationMetaSchema,
  paginationQuerySchema,
  successEnvelopeSchema,
} from "./http.schema.ts";

const base = {
  requestId: "request-1",
  timestamp: "2026-08-18T00:00:00.000Z",
  path: "/api/v1/test",
};

describe("HTTP envelope contracts", () => {
  it("owns the stable common HTTP error-code vocabulary", () => {
    expect(commonHttpErrorCodeSchema.options).toEqual([
      "VALIDATION_ERROR",
      "BAD_REQUEST",
      "UNAUTHORIZED",
      "FORBIDDEN",
      "NOT_FOUND",
      "CONFLICT",
      "RATE_LIMIT_EXCEEDED",
      "INTERNAL_SERVER_ERROR",
      "SERVICE_UNAVAILABLE",
    ]);
    expect(commonHttpErrorCodeSchema.safeParse("INTERNAL_ERROR").success).toBe(
      false,
    );
  });

  it("keeps success and error payloads discriminated", () => {
    expect(
      successEnvelopeSchema.parse({
        ...base,
        success: true,
        statusCode: 200,
        message: "Okay.",
        data: { value: true },
      }).success,
    ).toBe(true);
    expect(
      errorEnvelopeSchema.parse({
        ...base,
        success: false,
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: "Invalid input.",
        errors: [{ field: "email", message: "Invalid email." }],
      }).success,
    ).toBe(false);
  });

  it("requires success data and rejects legacy error data", () => {
    expect(
      successEnvelopeSchema.safeParse({
        ...base,
        success: true,
        statusCode: 204,
        message: "Done.",
      }).success,
    ).toBe(false);
    expect(
      errorEnvelopeSchema.safeParse({
        ...base,
        success: false,
        statusCode: 400,
        code: "BAD_REQUEST",
        message: "Invalid input.",
        data: null,
      }).success,
    ).toBe(false);
  });

  it("rejects server diagnostics from public error envelopes", () => {
    expect(
      errorEnvelopeSchema.safeParse({
        ...base,
        success: false,
        statusCode: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
        stack: "private server stack",
      }).success,
    ).toBe(false);
  });

  it("validates promoted pagination metadata", () => {
    const valid = {
      page: 2,
      limit: 25,
      total: 63,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    };
    expect(paginationMetaSchema.safeParse(valid).success).toBe(true);
    expect(
      paginationMetaSchema.safeParse({ ...valid, totalPages: 4 }).success,
    ).toBe(false);
    expect(
      successEnvelopeSchema.safeParse({
        ...base,
        success: true,
        statusCode: 200,
        message: "Okay.",
        data: [],
        paginationMeta: valid,
      }).success,
    ).toBe(true);
  });
});

describe("pagination query contract", () => {
  it("uses the shared defaults and parses decimal-only query values", () => {
    expect(paginationQuerySchema.parse({})).toEqual({ page: 1, limit: 25 });
    expect(paginationQuerySchema.parse({ page: "2", limit: "100" })).toEqual({
      page: 2,
      limit: 100,
    });
  });

  it.each(["1e2", "0x10", "1.5", "-1", "", " "])(
    "rejects alternate page syntax %s",
    (page) => {
      expect(paginationQuerySchema.safeParse({ page }).success).toBe(false);
    },
  );

  it("rejects zero, excessive, unsafe, fractional, and unknown values", () => {
    expect(paginationQuerySchema.safeParse({ page: 0 }).success).toBe(false);
    expect(paginationQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
    expect(
      paginationQuerySchema.safeParse({ page: Number.MAX_SAFE_INTEGER + 1 })
        .success,
    ).toBe(false);
    expect(paginationQuerySchema.safeParse({ page: 1.5 }).success).toBe(false);
    expect(
      paginationQuerySchema.safeParse({ page: "1", sort: "title" }).success,
    ).toBe(false);
  });
});

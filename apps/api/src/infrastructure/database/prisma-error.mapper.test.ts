import { describe, expect, it } from "vitest";

import { AppError } from "../../core/errors/app.error.js";
import {
  isAllowlistedPrismaCode,
  mapPrismaError,
} from "./prisma-error.mapper.js";

const prismaError = (values: Record<string, unknown>): unknown => ({
  name: "PrismaClientKnownRequestError",
  ...values,
});

describe("mapPrismaError", () => {
  it("passes AppError through", () => {
    const error = new AppError("custom", 418, "CUSTOM", true);
    expect(mapPrismaError(error)).toBe(error);
  });

  it.each([
    ["P2002", 409],
    ["P2003", 409],
    ["P2014", 409],
    ["P2025", 404],
    ["P2034", 409],
    ["P1001", 503],
    ["P1017", 503],
  ])("maps %s to %s", (code, statusCode) => {
    expect(mapPrismaError(prismaError({ code })).statusCode).toBe(statusCode);
  });

  it.each([
    "ck_users_email_normalized",
    "ck_users_status_timestamps_consistent",
  ])("maps approved check %s to 400", (constraint) => {
    expect(
      mapPrismaError(
        prismaError({ code: "P2004", meta: { database_error: constraint } }),
      ).statusCode,
    ).toBe(400);
  });

  it.each([
    ["ck_works_identity_immutable", "CONTENT_IMMUTABLE"],
    ["ck_chapters_parent_content_type", "CONTENT_TYPE_CONFLICT"],
    [
      "ck_chapters_illustrated_publication_ready",
      "CONTENT_TRANSITION_CONFLICT",
    ],
    ["ck_chapters_number_positive", "CONTENT_CONFLICT"],
    ["ck_work_categories_max_100", "CONTENT_CONFLICT"],
    ["ck_work_categories_enabled_assignment", "CONTENT_CONFLICT"],
  ])("maps allowlisted content check %s to %s", (constraint, code) => {
    expect(
      mapPrismaError(
        prismaError({ code: "P2004", meta: { database_error: constraint } }),
      ).code,
    ).toBe(code);
  });

  it.each(["PZ100", "PZ101"])(
    "maps the %s PostgreSQL guard code from Prisma's driver adapter",
    (originalCode) => {
      expect(
        mapPrismaError(
          prismaError({
            code: "P2039",
            meta: { driverAdapterError: { cause: { originalCode } } },
          }),
        ),
      ).toMatchObject({ statusCode: 409, code: "CONTENT_CONFLICT" });
    },
  );

  it("keeps unknown driver adapter errors private", () => {
    expect(
      mapPrismaError(
        prismaError({
          code: "P2039",
          meta: { driverAdapterError: { cause: { originalCode: "PZ999" } } },
        }),
      ).statusCode,
    ).toBe(500);
  });

  it("maps only allowlisted content uniqueness to the stable content code", () => {
    expect(
      mapPrismaError(
        prismaError({
          code: "P2002",
          meta: { constraint: "works_slug_key" },
        }),
      ).code,
    ).toBe("CONTENT_CONFLICT");
    expect(mapPrismaError(prismaError({ code: "P2002" })).code).toBe(
      "CONFLICT",
    );
  });

  it("rejects unapproved check names and never leaks provider details", () => {
    const mapped = mapPrismaError(
      prismaError({
        code: "P2004",
        message: "postgresql://secret@database/internal",
        meta: {
          constraint: "ck_business_specific",
          sql: "SELECT provider_secret",
        },
      }),
    );
    expect(mapped.statusCode).toBe(500);
    expect(mapped.message).not.toMatch(/secret|SELECT|postgresql/iu);
  });

  it("maps unknown and non-object failures to a safe 500", () => {
    expect(mapPrismaError(prismaError({ code: "P9999" })).statusCode).toBe(500);
    expect(mapPrismaError("raw database error").statusCode).toBe(500);
  });
});

describe("isAllowlistedPrismaCode", () => {
  it("accepts mapped codes and rejects unknown values", () => {
    expect(isAllowlistedPrismaCode("P2002")).toBe(true);
    expect(isAllowlistedPrismaCode("P2004")).toBe(true);
    expect(isAllowlistedPrismaCode("P2039")).toBe(true);
    expect(isAllowlistedPrismaCode("P9999")).toBe(false);
    expect(isAllowlistedPrismaCode({ code: "P2002" })).toBe(false);
  });
});

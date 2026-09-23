import { describe, expect, it } from "vitest";

import {
  changePasswordBodySchema,
  loginBodySchema,
  registerBodySchema,
  resetPasswordBodySchema,
  updateProfileBodySchema,
} from "./auth.schema.ts";

describe("authentication request contracts", () => {
  it("normalizes supported registration fields and rejects obsolete phone input", () => {
    const result = registerBodySchema.parse({
      fullName: "Fury Test User",
      email: "  USER@Example.COM ",
      password: "a-secure-password",
    });
    expect(result.email).toBe("user@example.com");
    expect(result).not.toHaveProperty("phone");
    expect(
      registerBodySchema.safeParse({ ...result, phone: "+201000000000" })
        .success,
    ).toBe(false);
    expect(
      updateProfileBodySchema.safeParse({ phone: "+201000000000" }).success,
    ).toBe(false);
  });

  it("requires explicit remember-me and rejects unknown login fields", () => {
    expect(
      loginBodySchema.safeParse({
        email: "user@example.com",
        password: "password",
      }).success,
    ).toBe(false);
    expect(
      loginBodySchema.safeParse({
        email: "user@example.com",
        password: "password",
        rememberMe: false,
        organizationId: "not-supported",
      }).success,
    ).toBe(false);
  });

  it("enforces password confirmation and credential rotation", () => {
    expect(
      resetPasswordBodySchema.safeParse({
        newPassword: "a-new-secure-password",
        passwordConfirmation: "different-password",
      }).success,
    ).toBe(false);
    expect(
      changePasswordBodySchema.safeParse({
        currentPassword: "same-secure-password",
        newPassword: "same-secure-password",
        passwordConfirmation: "same-secure-password",
      }).success,
    ).toBe(false);
  });
});

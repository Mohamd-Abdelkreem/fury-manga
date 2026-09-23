import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { errorHandlerMiddleware } from "./error-handler.middleware.js";

describe("errorHandlerMiddleware", () => {
  it("classifies Zod errors outside request validation as internal bugs", () => {
    const parsed = z.object({ count: z.number() }).safeParse({ count: "bug" });
    if (parsed.success) throw new Error("Expected the fixture to fail.");
    const requestLog = { error: vi.fn(), warn: vi.fn() };
    const request = {
      log: requestLog,
      path: "/internal-schema-bug",
      requestId: "request-id",
    } as unknown as Request;
    const json = vi.fn();
    const status = vi.fn();
    const response = {
      status,
      json,
    } as unknown as Response;
    status.mockReturnValue(response);

    errorHandlerMiddleware(parsed.error, request, response, vi.fn());

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 500,
        code: "INTERNAL_SERVER_ERROR",
      }),
    );
    expect(JSON.stringify(json.mock.calls)).not.toContain('"stack"');
    expect(requestLog.error).toHaveBeenCalledOnce();
    expect(requestLog.warn).not.toHaveBeenCalled();
  });

  it("logs only allowlisted diagnostics for unknown errors", () => {
    const sentinel = "nested-private-sentinel";
    const unknownError = Object.assign(new Error("Failure " + sentinel), {
      config: {
        headers: { authorization: sentinel },
        url: "/callback?token=" + sentinel,
        data: { password: sentinel },
      },
    });
    const requestLog = { error: vi.fn(), warn: vi.fn() };
    const request = {
      log: requestLog,
      path: "/internal-error",
      requestId: "request-id",
    } as unknown as Request;
    const json = vi.fn();
    const status = vi.fn();
    const response = { status, json } as unknown as Response;
    status.mockReturnValue(response);

    errorHandlerMiddleware(unknownError, request, response, vi.fn());

    expect(JSON.stringify(requestLog.error.mock.calls)).not.toContain(sentinel);
    expect(JSON.stringify(json.mock.calls)).not.toContain(sentinel);
    expect(requestLog.error).toHaveBeenCalledWith(
      expect.objectContaining({
        error: { kind: "Error", name: "Error" },
        requestId: "request-id",
      }),
      "An unexpected error occurred.",
    );
  });
});

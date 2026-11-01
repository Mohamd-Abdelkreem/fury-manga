import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { errorEnvelopeSchema } from "@fury/contracts";

import { createLogger } from "../infrastructure/logger/logger.js";
import {
  listenOnTestLoopback,
  closeTestServers,
} from "../test-support/http-server.test-helper.js";
import { errorHandlerMiddleware } from "./error-handler.middleware.js";
import { createRequestLoggerMiddleware } from "./request-logger.middleware.js";
import { requestId } from "./request-id.middleware.js";

const requestFailure = async (failure: unknown) => {
  const messages: string[] = [];
  const app = express();
  app.use(requestId);
  app.use(
    createRequestLoggerMiddleware(
      createLogger({
        level: "info",
        pretty: false,
        destination: {
          write(message: string) {
            messages.push(message);
          },
        },
      }),
    ),
  );
  app.get("/internal-error", () => {
    throw failure;
  });
  app.use(errorHandlerMiddleware);
  const server = await listenOnTestLoopback(app);
  try {
    const response = await request(server).get("/internal-error");
    return {
      status: response.status,
      body: errorEnvelopeSchema.parse(response.body),
      messages,
    };
  } finally {
    await closeTestServers([server]);
  }
};

describe("errorHandlerMiddleware", () => {
  it("classifies Zod errors outside request validation as internal bugs", async () => {
    const parsed = z.object({ count: z.number() }).safeParse({ count: "bug" });
    if (parsed.success) throw new Error("Expected the fixture to fail.");
    const response = await requestFailure(parsed.error);
    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      success: false,
      statusCode: 500,
      code: "INTERNAL_SERVER_ERROR",
    });
    expect(JSON.stringify(response.body)).not.toContain('"stack"');
    const errors = response.messages.filter((line) =>
      line.includes('"level":50'),
    );
    expect(errors).toHaveLength(1);
    expect(response.messages.join("")).not.toContain('"level":40');
  });

  it("logs only allowlisted diagnostics for unknown errors", async () => {
    const sentinel = "nested-private-sentinel";
    const unknownError = Object.assign(new Error("Failure " + sentinel), {
      config: {
        headers: { authorization: sentinel },
        url: "/callback?token=" + sentinel,
        data: { password: sentinel },
      },
    });
    const response = await requestFailure(unknownError);
    expect(response.messages.join("")).not.toContain(sentinel);
    expect(JSON.stringify(response.body)).not.toContain(sentinel);
    const diagnostic = response.messages
      .map((line): unknown => JSON.parse(line))
      .find(
        (line) => typeof line === "object" && line !== null && "code" in line,
      );
    expect(diagnostic).toMatchObject({
      error: { kind: "Error", name: "Error" },
      requestId: response.body.requestId,
      msg: "An unexpected error occurred.",
    });
  });
});

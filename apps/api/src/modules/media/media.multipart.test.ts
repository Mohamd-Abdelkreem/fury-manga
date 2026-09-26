import { PassThrough } from "node:stream";

import type { Request } from "express";
import { describe, expect, it } from "vitest";

import { parseMediaUpload } from "./media.multipart.js";

describe("parseMediaUpload", () => {
  it("rejects an interrupted file without emitting an unhandled stream error", async () => {
    const boundary = "----fury-interrupted-upload";
    const stream = new PassThrough();
    const request = Object.assign(stream, {
      headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
      get(name: string) {
        return name.toLowerCase() === "content-type"
          ? `multipart/form-data; boundary=${boundary}`
          : name.toLowerCase() === "idempotency-key"
            ? "11111111-1111-4111-8111-111111111111"
            : undefined;
      },
    }) as unknown as Request;
    const parsed = parseMediaUpload(request, () =>
      Promise.resolve("reservation"),
    );

    stream.write(
      Buffer.from(
        `--${boundary}\r\n` +
          'Content-Disposition: form-data; name="mediaClass"\r\n\r\n' +
          `work_cover\r\n--${boundary}\r\n` +
          'Content-Disposition: form-data; name="file"; filename="cover.png"\r\n' +
          "Content-Type: image/png\r\n\r\npartial-image",
      ),
    );
    await new Promise<void>((resolve) => setImmediate(resolve));
    request.emit("aborted");

    await expect(parsed).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      errors: [
        expect.objectContaining({
          field: "body.file",
          message: "Upload was interrupted.",
        }),
      ],
    });
  });
});

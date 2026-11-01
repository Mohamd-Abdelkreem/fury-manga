import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

import {
  animatedImageFixture,
  compositedAnimationPixels,
} from "../../test-support/animated-image.test-helper.js";
import { validateImage } from "./image-validation.js";
import { ImageProcessor } from "./image-processor.js";

describe("bounded Work-media animation", () => {
  it.each([
    ["work_cover", 600, 800],
    ["work_background", 900, 500],
    ["chapter_page", 600, 800],
  ] as const)(
    "preserves GIF/WebP animation for %s",
    async (mediaClass, width, height) => {
      for (const format of ["gif", "webp"] as const) {
        const input = await animatedImageFixture(format, width, height);
        const saved = await validateImage(
          input,
          mediaClass,
          `image/${format}`,
          `art.${format}`,
        );
        expect(saved).toMatchObject({
          width,
          height,
          contentType: "image/webp",
        });
        const before = await sharp(input, { animated: true }).metadata();
        const after = await sharp(saved.bytes, { animated: true }).metadata();
        expect(after).toMatchObject({
          format: "webp",
          pages: 3,
          width,
          pageHeight: height,
          height: height * 3,
          loop: before.loop,
          delay: before.delay,
          hasAlpha: true,
        });
        const outputPixels = await compositedAnimationPixels(saved.bytes);
        expect(
          outputPixels.equals(await compositedAnimationPixels(input)),
        ).toBe(true);
        const frameBytes = width * height * 4;
        expect(
          outputPixels
            .subarray(0, frameBytes)
            .equals(outputPixels.subarray(frameBytes, frameBytes * 2)),
        ).toBe(false);
        expect(after.exif).toBeUndefined();
      }
    },
  );

  it.each(["user_avatar", "avatar_frame", "comment_decoration"] as const)(
    "keeps %s static",
    async (mediaClass) => {
      for (const format of ["gif", "webp"] as const) {
        await expect(
          validateImage(
            await animatedImageFixture(format, 256, 256),
            mediaClass,
            `image/${format}`,
            `art.${format}`,
          ),
        ).rejects.toMatchObject({
          statusCode: 415,
          code: "MEDIA_UNSUPPORTED_TYPE",
        });
      }
    },
  );

  it("preserves continuous looping and rejects mismatched, truncated and appended animation", async () => {
    const input = await animatedImageFixture("gif", 600, 800, 3, 0);
    const control = input.indexOf(Buffer.from([0x21, 0xf9, 4]));
    expect(control).toBeGreaterThanOrEqual(0);
    input.writeUInt16LE(10_000, control + 4); // A valid long frame hold is not server decode time.
    const saved = await validateImage(
      input,
      "work_cover",
      "image/gif",
      "cover.gif",
    );
    expect((await sharp(saved.bytes, { animated: true }).metadata()).loop).toBe(
      0,
    );
    expect(
      (await sharp(saved.bytes, { animated: true }).metadata()).delay,
    ).toEqual([100_000, 140, 200]);
    await expect(
      validateImage(input, "work_cover", "image/webp", "cover.webp"),
    ).rejects.toMatchObject({ code: "MEDIA_UNSUPPORTED_TYPE" });
    for (const invalid of [
      input.subarray(0, input.length - 2),
      Buffer.concat([input, Buffer.from("<script>evil</script>;")]),
    ]) {
      await expect(
        validateImage(invalid, "work_cover", "image/gif", "cover.gif"),
      ).rejects.toMatchObject({ code: "MEDIA_INVALID_FILE" });
    }
  });

  it("rejects detected APNG rather than accepting its first PNG frame", async () => {
    const source = await readFile(
      new URL("./test-fixtures/unsupported-apng.png", import.meta.url),
    );
    await expect(
      validateImage(source, "chapter_page", "image/png", "page.png"),
    ).rejects.toMatchObject({
      statusCode: 415,
      code: "MEDIA_UNSUPPORTED_TYPE",
    });
  });

  it("bounds native processing capacity and releases it after settlement", async () => {
    const source = await animatedImageFixture("webp");
    const processor = new ImageProcessor();
    const outcomes = await Promise.allSettled(
      Array.from({ length: 3 }, () =>
        processor.process(source, "work_cover", "image/webp", "cover.webp"),
      ),
    );
    expect(
      outcomes.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(2);
    expect(
      outcomes.filter((result) => result.status === "rejected"),
    ).toHaveLength(1);
    for (const result of outcomes) {
      if (result.status === "rejected")
        expect(result.reason).toMatchObject({
          statusCode: 503,
          code: "MEDIA_PROCESSING_BUSY",
        });
    }
    expect(
      (
        await processor.process(
          source,
          "work_cover",
          "image/webp",
          "cover.webp",
        )
      ).contentType,
    ).toBe("image/webp");
  });

  it("rejects excess frames and aggregate decoded work before canonical output", async () => {
    const frames = await animatedImageFixture("webp", 300, 400, 101);
    await expect(
      validateImage(frames, "work_cover", "image/webp", "cover.webp"),
    ).rejects.toMatchObject({ code: "MEDIA_LIMIT_EXCEEDED" });
    const aggregate = await animatedImageFixture("webp", 600, 800, 67);
    await expect(
      validateImage(aggregate, "chapter_page", "image/webp", "page.webp"),
    ).rejects.toMatchObject({ code: "MEDIA_LIMIT_EXCEEDED" });
  });
});

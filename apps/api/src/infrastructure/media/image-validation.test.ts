import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { MEDIA_SOURCE_BYTE_LIMITS } from "@fury/contracts";

import { validateImage } from "./image-validation.js";

const image = (width: number, height: number, alpha = 1) =>
  sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 150, g: 30, b: 40, alpha },
    },
  })
    .png()
    .toBuffer();

describe("media image validation", () => {
  it("re-encodes a valid cover without source metadata", async () => {
    const source = await image(600, 800);
    const validated = await validateImage(
      source,
      "work_cover",
      "image/png",
      "cover.png",
    );
    expect(validated).toMatchObject({
      contentType: "image/png",
      width: 600,
      height: 800,
    });
    expect(validated.bytes.length).toBeGreaterThan(0);
    expect(validated.sha256).toMatch(/^[0-9a-f]{64}$/u);
  });

  it.each([
    ["jpeg", "image/jpeg", "cover.jpg"],
    ["png", "image/png", "cover.png"],
    ["webp", "image/webp", "cover.webp"],
  ] as const)(
    "accepts and canonically re-encodes %s",
    async (format, contentType, filename) => {
      const pipeline = sharp({
        create: { width: 600, height: 800, channels: 3, background: "red" },
      });
      const source = await pipeline[format]().toBuffer();
      const validated = await validateImage(
        source,
        "work_cover",
        contentType,
        filename,
      );
      expect(validated).toMatchObject({ contentType, width: 600, height: 800 });
      const output = await sharp(validated.bytes).metadata();
      expect(output.format).toBe(format);
      expect(output.exif).toBeUndefined();
    },
  );

  it("rejects a cover ratio outside its class and a misleading MIME type", async () => {
    const source = await image(800, 600);
    await expect(
      validateImage(source, "work_cover", "image/png", "wide.png"),
    ).rejects.toThrow();
    await expect(
      validateImage(source, "work_background", "image/jpeg", "wide.jpg"),
    ).rejects.toThrow();
  });

  it("requires genuine transparency for frame media", async () => {
    await expect(
      validateImage(
        await image(256, 256),
        "avatar_frame",
        "image/png",
        "frame.png",
      ),
    ).rejects.toThrow();
    const accepted = await validateImage(
      await image(256, 256, 0.5),
      "avatar_frame",
      "image/png",
      "frame.png",
    );
    expect(accepted.contentType).toBe("image/png");
  });

  it("rejects a supported animated format before creating an asset", async () => {
    const firstFrame = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    const secondFrame = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "blue" },
    })
      .png()
      .toBuffer();
    const animated = await sharp([firstFrame, secondFrame], {
      join: { animated: true },
    })
      .webp({ loop: 0, delay: [100, 100] })
      .toBuffer();
    expect((await sharp(animated).metadata()).pages).toBe(2);
    await expect(
      validateImage(animated, "work_cover", "image/webp", "cover.webp"),
    ).rejects.toMatchObject({ code: "MEDIA_INVALID_FILE" });
  });

  it("rejects MIME, extension, content, corrupt, executable, and polyglot mismatches", async () => {
    const png = await image(256, 256);
    await expect(
      validateImage(png, "user_avatar", "image/jpeg", "avatar.png"),
    ).rejects.toMatchObject({ code: "MEDIA_UNSUPPORTED_TYPE" });
    await expect(
      validateImage(png, "user_avatar", "image/png", "avatar.jpg"),
    ).rejects.toMatchObject({ code: "MEDIA_UNSUPPORTED_TYPE" });
    await expect(
      validateImage(
        Buffer.from("MZ executable"),
        "user_avatar",
        "image/png",
        "avatar.png",
      ),
    ).rejects.toMatchObject({ code: "MEDIA_INVALID_FILE" });
    await expect(
      validateImage(
        png.subarray(0, 40),
        "user_avatar",
        "image/png",
        "avatar.png",
      ),
    ).rejects.toMatchObject({ code: "MEDIA_INVALID_FILE" });
    await expect(
      validateImage(
        Buffer.concat([png, Buffer.from("<script>alert(1)</script>")]),
        "user_avatar",
        "image/png",
        "avatar.png",
      ),
    ).rejects.toMatchObject({ code: "MEDIA_INVALID_FILE" });
  });

  it("enforces source, dimension, decoded-pixel, and zero-dimension resource bounds", async () => {
    await expect(
      validateImage(
        Buffer.alloc(MEDIA_SOURCE_BYTE_LIMITS.user_avatar + 1),
        "user_avatar",
        "image/png",
        "avatar.png",
      ),
    ).rejects.toMatchObject({ code: "MEDIA_LIMIT_EXCEEDED" });
    const tooWide = await image(4097, 128);
    await expect(
      validateImage(tooWide, "user_avatar", "image/png", "avatar.png"),
    ).rejects.toMatchObject({ code: "MEDIA_LIMIT_EXCEEDED" });
    const tooManyPixels = await image(5000, 5000);
    await expect(
      validateImage(tooManyPixels, "chapter_page", "image/png", "page.png"),
    ).rejects.toMatchObject({ code: "MEDIA_LIMIT_EXCEEDED" });
    const zeroDimensionPng = Buffer.from(
      "89504e470d0a1a0a0000000d49484452000000000000000008060000003b8b7c120000000049454e44ae426082",
      "hex",
    );
    await expect(
      validateImage(zeroDimensionPng, "user_avatar", "image/png", "avatar.png"),
    ).rejects.toMatchObject({ code: "MEDIA_INVALID_FILE" });
  });

  it("rejects opaque transparent classes and strips source metadata from output", async () => {
    const source = await sharp({
      create: {
        width: 256,
        height: 256,
        channels: 4,
        background: { r: 20, g: 30, b: 40, alpha: 0.5 },
      },
    })
      .withMetadata({ exif: { IFD0: { Artist: "private-source-metadata" } } })
      .png()
      .toBuffer();
    const validated = await validateImage(
      source,
      "avatar_frame",
      "image/png",
      "frame.png",
    );
    const metadata = await sharp(validated.bytes).metadata();
    expect(metadata.exif).toBeUndefined();
    expect(validated).not.toHaveProperty("sourceName");
    await expect(
      validateImage(
        await sharp({
          create: { width: 256, height: 256, channels: 3, background: "red" },
        })
          .webp()
          .toBuffer(),
        "avatar_frame",
        "image/webp",
        "frame.webp",
      ),
    ).rejects.toMatchObject({ code: "MEDIA_INVALID_FILE" });
  });
});

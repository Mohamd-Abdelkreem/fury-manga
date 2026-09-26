import { extname } from "node:path";

import sharp from "sharp";

import { MEDIA_SOURCE_BYTE_LIMITS, type MediaClass } from "@fury/contracts";

import { AppError } from "../../core/errors/app.error.js";
import { mediaSha256 } from "./media-digest.js";

type ImageFormat = "jpeg" | "png" | "webp";
type MediaBounds = Readonly<{
  maxBytes: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  minRatio?: number;
  maxRatio?: number;
  transparent?: boolean;
}>;

const BOUNDS: Record<MediaClass, MediaBounds> = {
  work_cover: {
    maxBytes: MEDIA_SOURCE_BYTE_LIMITS.work_cover,
    minWidth: 300,
    maxWidth: 4000,
    minHeight: 400,
    maxHeight: 6000,
    minRatio: 0.65,
    maxRatio: 0.85,
  },
  work_background: {
    maxBytes: MEDIA_SOURCE_BYTE_LIMITS.work_background,
    minWidth: 800,
    maxWidth: 6000,
    minHeight: 450,
    maxHeight: 4000,
    minRatio: 1.5,
    maxRatio: 2,
  },
  chapter_page: {
    maxBytes: MEDIA_SOURCE_BYTE_LIMITS.chapter_page,
    minWidth: 300,
    maxWidth: 6000,
    minHeight: 300,
    maxHeight: 12000,
  },
  user_avatar: {
    maxBytes: MEDIA_SOURCE_BYTE_LIMITS.user_avatar,
    minWidth: 128,
    maxWidth: 4096,
    minHeight: 128,
    maxHeight: 4096,
  },
  avatar_frame: {
    maxBytes: MEDIA_SOURCE_BYTE_LIMITS.avatar_frame,
    minWidth: 128,
    maxWidth: 4096,
    minHeight: 128,
    maxHeight: 4096,
    transparent: true,
  },
  comment_decoration: {
    maxBytes: MEDIA_SOURCE_BYTE_LIMITS.comment_decoration,
    minWidth: 64,
    maxWidth: 4096,
    minHeight: 64,
    maxHeight: 4096,
    transparent: true,
  },
};

export const maxSourceBytesForClass = (mediaClass: MediaClass): number =>
  BOUNDS[mediaClass].maxBytes;

const FORMAT_INFO: Record<
  ImageFormat,
  Readonly<{ contentType: ValidatedImage["contentType"]; extension: string }>
> = {
  jpeg: { contentType: "image/jpeg", extension: ".jpg" },
  png: { contentType: "image/png", extension: ".png" },
  webp: { contentType: "image/webp", extension: ".webp" },
};

const hasExactContainerLength = (
  source: Buffer,
  format: ImageFormat,
): boolean => {
  if (format === "jpeg") {
    return (
      source.length >= 4 &&
      source[0] === 0xff &&
      source[1] === 0xd8 &&
      source[source.length - 2] === 0xff &&
      source[source.length - 1] === 0xd9
    );
  }
  if (format === "png") {
    const pngSignature = Buffer.from("89504e470d0a1a0a", "hex");
    const iend = Buffer.from("0000000049454e44ae426082", "hex");
    return (
      source.length >= pngSignature.length + iend.length &&
      source.subarray(0, pngSignature.length).equals(pngSignature) &&
      source.subarray(source.length - iend.length).equals(iend)
    );
  }
  return (
    source.length >= 12 &&
    source.subarray(0, 4).toString("ascii") === "RIFF" &&
    source.subarray(8, 12).toString("ascii") === "WEBP" &&
    source.readUInt32LE(4) + 8 === source.length
  );
};

const invalidImage = () =>
  new AppError(
    "The image is invalid for this media class.",
    400,
    "MEDIA_INVALID_FILE",
  );
const unsupportedImage = () =>
  new AppError(
    "Unsupported or mismatched image type.",
    415,
    "MEDIA_UNSUPPORTED_TYPE",
  );
const limitExceeded = () =>
  new AppError(
    "Image size or dimensions exceed the limit.",
    413,
    "MEDIA_LIMIT_EXCEEDED",
  );

export type ValidatedImage = Readonly<{
  bytes: Buffer;
  contentType: "image/jpeg" | "image/png" | "image/webp";
  width: number;
  height: number;
  sha256: string;
}>;

export const validateImage = async (
  source: Buffer,
  mediaClass: MediaClass,
  declaredType: string,
  sourceName: string,
): Promise<ValidatedImage> => {
  const bounds = BOUNDS[mediaClass];
  if (source.length === 0) throw invalidImage();
  if (source.length > bounds.maxBytes) throw limitExceeded();
  if (
    sourceName.includes("/") ||
    sourceName.includes("\\") ||
    sourceName.includes("\u0000") ||
    /%(?:2e|2f|5c)/iu.test(sourceName)
  ) {
    throw invalidImage();
  }

  let metadata: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
  try {
    metadata = await sharp(source, {
      // Metadata is read before decoding so oversized dimensions can receive
      // the stable resource-limit outcome; every decoding pass stays bounded.
      limitInputPixels: false,
      failOn: "error",
    })
      .timeout({ seconds: 30 })
      .metadata();
  } catch {
    throw invalidImage();
  }
  const format = metadata.format;
  if (format !== "jpeg" && format !== "png" && format !== "webp")
    throw unsupportedImage();
  if (!hasExactContainerLength(source, format)) throw invalidImage();
  const expected = FORMAT_INFO[format];
  const extension = extname(sourceName).toLowerCase();
  if (
    declaredType !== expected.contentType ||
    (extension !== expected.extension &&
      !(format === "jpeg" && extension === ".jpeg")) ||
    (bounds.transparent === true && format === "jpeg")
  ) {
    throw unsupportedImage();
  }

  const { width, height } = metadata;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0 ||
    (metadata.pages ?? 1) !== 1
  ) {
    throw invalidImage();
  }
  if (
    width < bounds.minWidth ||
    width > bounds.maxWidth ||
    height < bounds.minHeight ||
    height > bounds.maxHeight ||
    width * height > 24_000_000
  ) {
    throw limitExceeded();
  }
  const ratio = width / height;
  if (
    (bounds.minRatio !== undefined && ratio < bounds.minRatio) ||
    (bounds.maxRatio !== undefined && ratio > bounds.maxRatio)
  ) {
    throw invalidImage();
  }
  if (bounds.transparent === true) {
    if (!metadata.hasAlpha) throw invalidImage();
    try {
      const statistics = await sharp(source, { limitInputPixels: 24_000_000 })
        .timeout({ seconds: 30 })
        .stats();
      if ((statistics.channels[3]?.min ?? 255) === 255) throw invalidImage();
    } catch {
      throw invalidImage();
    }
  }

  let bytes: Buffer;
  try {
    const decoder = sharp(source, {
      limitInputPixels: 24_000_000,
      failOn: "error",
    }).timeout({ seconds: 30 });
    bytes =
      format === "jpeg"
        ? await decoder.jpeg({ quality: 90 }).toBuffer()
        : format === "png"
          ? await decoder.png({ compressionLevel: 9 }).toBuffer()
          : await decoder.webp({ quality: 90 }).toBuffer();
  } catch {
    throw invalidImage();
  }
  if (bytes.length > bounds.maxBytes) throw limitExceeded();
  return {
    bytes,
    contentType: expected.contentType,
    width,
    height,
    sha256: mediaSha256(bytes),
  };
};

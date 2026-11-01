import { extname } from "node:path";

import sharp from "sharp";

import {
  MEDIA_SOURCE_BYTE_LIMITS,
  MEDIA_SOURCE_TYPES,
  type MediaClass,
} from "@fury/contracts";

import {
  ANIMATED_IMAGE_LIMITS,
  inspectImageContainer,
} from "./image-container.js";
import {
  MediaInvalidImageException,
  MediaUnsupportedImageException,
  MediaImageLimitException,
} from "./media.errors.js";
import { mediaSha256 } from "./media-digest.js";

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

const FORMAT_INFO = {
  jpeg: { contentType: "image/jpeg", extension: ".jpg" },
  png: { contentType: "image/png", extension: ".png" },
  webp: { contentType: "image/webp", extension: ".webp" },
  gif: { contentType: "image/gif", extension: ".gif" },
} as const;

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
  if (source.length === 0) throw new MediaInvalidImageException();
  if (source.length > bounds.maxBytes) throw new MediaImageLimitException();
  if (
    sourceName.includes("/") ||
    sourceName.includes("\\") ||
    sourceName.includes("\u0000") ||
    /%(?:2e|2f|5c)/iu.test(sourceName)
  ) {
    throw new MediaInvalidImageException();
  }

  if (!new Set<string>(MEDIA_SOURCE_TYPES[mediaClass]).has(declaredType))
    throw new MediaUnsupportedImageException();
  const container = inspectImageContainer(source);

  let metadata: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
  try {
    metadata = await sharp(source, {
      // Metadata is read before decoding so oversized dimensions can receive
      // the stable resource-limit outcome; every decoding pass stays bounded.
      limitInputPixels: false,
      animated: true,
      failOn: "error",
    })
      .timeout({
        seconds: container.frames > 1 ? ANIMATED_IMAGE_LIMITS.seconds : 30,
      })
      .metadata();
  } catch (error) {
    if (error instanceof Error && /timeout/iu.test(error.message))
      throw new MediaImageLimitException();
    throw new MediaInvalidImageException();
  }
  const format = container.format;
  if (metadata.format !== format) throw new MediaUnsupportedImageException();
  const expected = FORMAT_INFO[format];
  const extension = extname(sourceName).toLowerCase();
  if (
    declaredType !== expected.contentType ||
    (extension !== expected.extension &&
      !(format === "jpeg" && extension === ".jpeg")) ||
    (bounds.transparent === true && format === "jpeg")
  ) {
    throw new MediaUnsupportedImageException();
  }

  const frames = metadata.pages ?? 1;
  const width = metadata.width;
  const height = frames > 1 ? metadata.pageHeight : metadata.height;
  const animated = frames > 1;
  if (
    animated &&
    !MEDIA_SOURCE_TYPES[mediaClass].some((type) => type === "image/gif")
  )
    throw new MediaUnsupportedImageException();
  if (
    height === undefined ||
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0 ||
    frames !== container.frames
  ) {
    throw new MediaInvalidImageException();
  }
  if (
    width < bounds.minWidth ||
    width > bounds.maxWidth ||
    height < bounds.minHeight ||
    height > bounds.maxHeight ||
    width * height > ANIMATED_IMAGE_LIMITS.canvasPixels ||
    (animated && width * height * frames > ANIMATED_IMAGE_LIMITS.decodedPixels)
  ) {
    throw new MediaImageLimitException();
  }
  const ratio = width / height;
  if (
    (bounds.minRatio !== undefined && ratio < bounds.minRatio) ||
    (bounds.maxRatio !== undefined && ratio > bounds.maxRatio)
  ) {
    throw new MediaInvalidImageException();
  }
  if (bounds.transparent === true) {
    if (!metadata.hasAlpha) throw new MediaInvalidImageException();
    try {
      const statistics = await sharp(source, { limitInputPixels: 24_000_000 })
        .timeout({ seconds: 30 })
        .stats();
      if ((statistics.channels[3]?.min ?? 255) === 255)
        throw new MediaInvalidImageException();
    } catch {
      throw new MediaInvalidImageException();
    }
  }

  let bytes: Buffer;
  try {
    const decoder = sharp(source, {
      limitInputPixels: animated
        ? ANIMATED_IMAGE_LIMITS.decodedPixels
        : 24_000_000,
      animated: true,
      failOn: "error",
    }).timeout({ seconds: animated ? ANIMATED_IMAGE_LIMITS.seconds : 30 });
    bytes =
      animated || format === "gif"
        ? await decoder.webp({ lossless: true, effort: 1 }).toBuffer()
        : format === "jpeg"
          ? await decoder.jpeg({ quality: 90 }).toBuffer()
          : format === "png"
            ? await decoder.png({ compressionLevel: 9 }).toBuffer()
            : await decoder.webp({ quality: 90 }).toBuffer();
  } catch (error) {
    if (error instanceof Error && /timeout/iu.test(error.message))
      throw new MediaImageLimitException();
    throw new MediaInvalidImageException();
  }
  if (bytes.length > bounds.maxBytes) throw new MediaImageLimitException();
  return {
    bytes,
    contentType:
      animated || format === "gif"
        ? "image/webp"
        : FORMAT_INFO[format].contentType,
    width,
    height,
    sha256: mediaSha256(bytes),
  };
};

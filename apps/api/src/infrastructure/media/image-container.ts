import {
  MediaInvalidImageException,
  MediaImageLimitException,
  MediaUnsupportedImageException,
} from "./media.errors.js";

export type ImageFormat = "jpeg" | "png" | "webp" | "gif";
export const ANIMATED_IMAGE_LIMITS = {
  frames: 100,
  canvasPixels: 24_000_000,
  decodedPixels: 32_000_000,
  seconds: 10,
  concurrent: 2,
} as const;

const gifFrames = (source: Buffer): number => {
  if (source.length < 14) throw new MediaInvalidImageException();
  const table = source[10] ?? 0;
  let offset = 13 + ((table & 0x80) === 0 ? 0 : 3 * 2 ** ((table & 7) + 1));
  let frames = 0;
  const skipBlocks = () => {
    for (;;) {
      const length = source[offset++];
      if (length === undefined || offset + length > source.length)
        throw new MediaInvalidImageException();
      if (length === 0) return;
      offset += length;
    }
  };
  while (offset < source.length) {
    const marker = source[offset++];
    if (marker === 0x3b) {
      if (offset !== source.length || frames === 0)
        throw new MediaInvalidImageException();
      return frames;
    }
    if (marker === 0x21) {
      offset++; // Extension label; its body is a bounded sub-block sequence.
      skipBlocks();
    } else if (marker === 0x2c) {
      if (offset + 9 >= source.length) throw new MediaInvalidImageException();
      const packed = source[offset + 8] ?? 0;
      offset += 9 + ((packed & 0x80) === 0 ? 0 : 3 * 2 ** ((packed & 7) + 1));
      const codeSize = source[offset++];
      if (codeSize === undefined || codeSize < 2 || codeSize > 8)
        throw new MediaInvalidImageException();
      skipBlocks();
      if (++frames > ANIMATED_IMAGE_LIMITS.frames)
        throw new MediaImageLimitException();
    } else throw new MediaInvalidImageException();
  }
  throw new MediaInvalidImageException();
};

/** Validate complete container boundaries before asking the native decoder to work. */
export const inspectImageContainer = (
  source: Buffer,
): Readonly<{ format: ImageFormat; frames: number }> => {
  const signature = source.subarray(0, 6).toString("ascii");
  if (signature === "GIF87a" || signature === "GIF89a")
    return { format: "gif", frames: gifFrames(source) };
  if (source[0] === 0xff && source[1] === 0xd8) {
    if (
      source.length < 4 ||
      source[source.length - 2] !== 0xff ||
      source[source.length - 1] !== 0xd9
    )
      throw new MediaInvalidImageException();
    return { format: "jpeg", frames: 1 };
  }
  if (source.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) {
    let offset = 8;
    while (offset + 12 <= source.length) {
      const length = source.readUInt32BE(offset);
      const kind = source.subarray(offset + 4, offset + 8).toString("ascii");
      if (offset + 12 + length > source.length)
        throw new MediaInvalidImageException();
      if (kind === "acTL") throw new MediaUnsupportedImageException();
      offset += 12 + length;
      if (kind === "IEND") {
        if (length !== 0 || offset !== source.length)
          throw new MediaInvalidImageException();
        return { format: "png", frames: 1 };
      }
    }
    throw new MediaInvalidImageException();
  }
  if (
    source.length >= 12 &&
    source.toString("ascii", 0, 4) === "RIFF" &&
    source.toString("ascii", 8, 12) === "WEBP"
  ) {
    if (source.readUInt32LE(4) + 8 !== source.length)
      throw new MediaInvalidImageException();
    let frames = 0;
    let offset = 12;
    while (offset + 8 <= source.length) {
      const kind = source.toString("ascii", offset, offset + 4);
      const length = source.readUInt32LE(offset + 4);
      offset += 8 + length + (length % 2);
      if (offset > source.length) throw new MediaInvalidImageException();
      if (kind === "ANMF" && ++frames > ANIMATED_IMAGE_LIMITS.frames)
        throw new MediaImageLimitException();
    }
    if (offset !== source.length) throw new MediaInvalidImageException();
    return { format: "webp", frames: Math.max(1, frames) };
  }
  throw new MediaInvalidImageException();
};

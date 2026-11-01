import sharp from "sharp";

/** Moving opaque artwork over transparency exercises composited animation frames. */
export const animatedImageFixture = async (
  format: "gif" | "webp",
  width = 600,
  height = 800,
  frameCount = 3,
  loop = 2,
) => {
  const frames: Buffer[] = [];
  for (let frame = 0; frame < frameCount; frame++) {
    const pixels = Buffer.alloc(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if ((x + frame * 40) % width >= width / 2 || y >= height * 0.75)
          continue;
        const offset = (y * width + x) * 4;
        pixels[offset] = (frame * 37 + 60) % 256;
        pixels[offset + 1] = (frame * 71 + 30) % 256;
        pixels[offset + 2] = (frame * 19 + 200) % 256;
        pixels[offset + 3] = 255;
      }
    }
    frames.push(
      await sharp(pixels, { raw: { width, height, channels: 4 } })
        .png()
        .toBuffer(),
    );
  }
  const delay = frames.map((_, index) => 80 + (index % 4) * 60);
  const encoder = sharp(frames, { join: { animated: true } });
  return format === "gif"
    ? encoder.gif({ loop, delay, effort: 1 }).toBuffer()
    : encoder.webp({ loop, delay, lossless: true, effort: 1 }).toBuffer();
};

export const compositedAnimationPixels = async (bytes: Buffer) => {
  const pixels = await sharp(bytes, { animated: true })
    .ensureAlpha()
    .raw()
    .toBuffer();
  // Invisible RGB values may be canonicalized; visible color and alpha must agree.
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) pixels.fill(0, index, index + 3);
  }
  return pixels;
};

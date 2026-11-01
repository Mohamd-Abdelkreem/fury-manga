export type IllustratedPage = Readonly<{
  id?: string;
  assetId: string;
  width?: number;
  height?: number;
  byteLength?: number;
}>;

export type ImageReadingMode = "continuous" | "single";

export const PROGRESSIVE_IMAGE_BUDGET = {
  encodedBytes: 24 * 1024 * 1024,
  reducedMotionBytes: 96 * 1024 * 1024,
  decodedPixels: 32_000_000,
  maximumSourceBytes: 12 * 1024 * 1024,
  retainedImages: 20,
} as const;

/** Geometry and window decisions are independent of transport, DOM and account state. */
export const progressiveImagePlan = (
  count: number,
  requested: number,
  mode: ImageReadingMode,
  constrained: boolean,
) => {
  const current = Math.min(Math.max(0, requested), Math.max(0, count - 1));
  const step = constrained ? 5 : 10;
  const trigger = constrained ? 2 : 4;
  const from = Math.max(0, current - (mode === "single" ? 1 : 2));
  const group = Math.floor((current + step - trigger) / step);
  const to = Math.min(
    count,
    current + 20,
    mode === "single" ? current + (constrained ? 2 : 4) : (group + 1) * step,
  );
  const priority = Array.from(
    { length: Math.max(0, to - from) },
    (_, index) => from + index,
  ).toSorted((left, right) => {
    const rank = (index: number) =>
      Math.abs(index - current) * 2 + (index < current ? 1 : 0);
    return rank(left) - rank(right);
  });
  return { current, from, to, priority, concurrency: constrained ? 1 : 2 };
};

/** Count canonical WebP frames without asking the browser to retain decoded frames. */
export const webpFrameCount = (bytes: Uint8Array): number => {
  if (
    bytes.length < 12 ||
    bytes[0] !== 82 ||
    bytes[1] !== 73 ||
    bytes[2] !== 70 ||
    bytes[3] !== 70 ||
    bytes[8] !== 87 ||
    bytes[9] !== 69 ||
    bytes[10] !== 66 ||
    bytes[11] !== 80
  )
    throw new Error("Invalid image resource");
  if (
    bytes[12] === 86 &&
    bytes[13] === 80 &&
    bytes[14] === 56 &&
    bytes[15] === 88 &&
    ((bytes[20] ?? 0) & 2) !== 0
  ) {
    const data = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let offset = 12;
    let frames = 0;
    while (offset + 8 <= bytes.length) {
      const length = data.getUint32(offset + 4, true);
      if (
        bytes[offset] === 65 &&
        bytes[offset + 1] === 78 &&
        bytes[offset + 2] === 77 &&
        bytes[offset + 3] === 70
      )
        frames++;
      offset += 8 + length + (length % 2);
      if (frames > 100 || offset > bytes.length)
        throw new Error("Invalid image resource");
    }
    if (offset !== bytes.length || frames === 0)
      throw new Error("Invalid image resource");
    return frames;
  }
  return 1;
};

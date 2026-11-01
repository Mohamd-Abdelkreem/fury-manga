/** Create a temporary still presentation; the authoritative stored animation is untouched. */
export const createStillImageUrl = (
  source: string,
  signal: AbortSignal,
): Promise<Readonly<{ url: string; byteLength: number }>> =>
  new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const image = new Image();
    const release = () => {
      image.onload = null;
      image.onerror = null;
      image.src = "";
      signal.removeEventListener("abort", abort);
    };
    const abort = () => {
      release();
      reject(new DOMException("Image display aborted", "AbortError"));
    };
    signal.addEventListener("abort", abort, { once: true });
    image.onerror = () => {
      release();
      reject(new Error("Image display unavailable"));
    };
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (context === null) {
          release();
          reject(new Error("Image display unavailable"));
          return;
        }
        context.drawImage(image, 0, 0);
        release();
        canvas.toBlob((blob) => {
          canvas.width = 0;
          canvas.height = 0;
          if (signal.aborted) {
            reject(new DOMException("Image display aborted", "AbortError"));
            return;
          }
          if (blob === null) {
            reject(new Error("Image display unavailable"));
            return;
          }
          resolve({ url: URL.createObjectURL(blob), byteLength: blob.size });
        }, "image/png");
      } catch (error) {
        release();
        reject(
          error instanceof Error
            ? error
            : new Error("Image display unavailable"),
        );
      }
    };
    image.src = source;
  });

export const isAnimatedImageBlob = async (blob: Blob): Promise<boolean> => {
  if (blob.type === "image/gif") return true;
  if (blob.type !== "image/webp") return false;
  const header = new Uint8Array(await blob.slice(0, 21).arrayBuffer());
  return (
    header[12] === 86 &&
    header[13] === 80 &&
    header[14] === 56 &&
    header[15] === 88 &&
    ((header[20] ?? 0) & 2) !== 0
  );
};

export const createMediaImageUrl = async (
  blob: Blob,
  reducedMotion: boolean,
  signal: AbortSignal,
): Promise<Readonly<{ url: string; byteLength: number }>> => {
  const still = reducedMotion && (await isAnimatedImageBlob(blob));
  signal.throwIfAborted();
  const url = URL.createObjectURL(blob);
  if (!still) return { url, byteLength: blob.size };
  try {
    return await createStillImageUrl(url, signal);
  } finally {
    URL.revokeObjectURL(url);
  }
};

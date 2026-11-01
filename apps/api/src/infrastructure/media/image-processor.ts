import type { MediaClass } from "@fury/contracts";

import { ANIMATED_IMAGE_LIMITS } from "./image-container.js";
import { MediaImageProcessingBusyException } from "./media.errors.js";
import { validateImage, type ValidatedImage } from "./image-validation.js";

/** Composition-owned capacity; no unbounded queue of encoded buffers/native jobs. */
export class ImageProcessor {
  private active = 0;

  async process(
    source: Buffer,
    mediaClass: MediaClass,
    declaredType: string,
    sourceName: string,
  ): Promise<ValidatedImage> {
    if (this.active >= ANIMATED_IMAGE_LIMITS.concurrent)
      throw new MediaImageProcessingBusyException();
    this.active++;
    try {
      const image = await validateImage(
        source,
        mediaClass,
        declaredType,
        sourceName,
      );
      return image;
    } finally {
      this.active--;
    }
  }
}

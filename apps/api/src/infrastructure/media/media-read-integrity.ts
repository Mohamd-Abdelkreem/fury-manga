import type { MediaAsset } from "@fury/database";

import { MediaUnavailableException } from "./media.errors.js";
import { mediaSha256 } from "./media-digest.js";
import type { MediaStorage } from "./media-storage.js";

export const readVerifiedMedia = async (
  storage: Pick<MediaStorage, "read">,
  asset: Pick<MediaAsset, "id" | "byteLength" | "sha256">,
): Promise<Buffer> => {
  let bytes: Buffer;
  try {
    bytes = await storage.read(asset.id);
  } catch {
    throw new MediaUnavailableException();
  }
  if (
    bytes.length !== asset.byteLength ||
    mediaSha256(bytes) !== asset.sha256
  ) {
    throw new MediaUnavailableException();
  }
  return bytes;
};

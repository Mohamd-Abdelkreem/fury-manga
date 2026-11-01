import { randomUUID } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { createMediaConfig } from "../../core/config/media.config.js";
import { mediaSha256 } from "./media-digest.js";
import { readVerifiedMedia } from "./media-read-integrity.js";
import { MediaStorage } from "./media-storage.js";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true });
});
const fixture = async () => {
  const root = mkdtempSync(join(tmpdir(), "fury-integrity-"));
  roots.push(root);
  const mediaRoot = join(root, "persistent");
  mkdirSync(mediaRoot);
  const storage = new MediaStorage(createMediaConfig(mediaRoot));
  const bytes = Buffer.from("saved image bytes");
  const asset = {
    id: randomUUID(),
    byteLength: bytes.length,
    sha256: mediaSha256(bytes),
  };
  await storage.stage(asset.id, bytes);
  await storage.publish(asset.id);
  return { storage, bytes, asset, mediaRoot };
};
describe("saved media read integrity", () => {
  it("returns the exact saved bytes", async () => {
    const { storage, asset, bytes } = await fixture();
    expect(await readVerifiedMedia(storage, asset)).toEqual(bytes);
  });
  it.each(["missing", "length", "digest", "root"])(
    "safely rejects %s storage failure",
    async (failure) => {
      const { storage, asset, bytes, mediaRoot } = await fixture();
      if (failure === "missing") await storage.remove(asset.id);
      if (failure === "length")
        await writeFile(
          join(mediaRoot, `${asset.id}.bin`),
          Buffer.concat([bytes, Buffer.from("x")]),
        );
      if (failure === "digest")
        await writeFile(
          join(mediaRoot, `${asset.id}.bin`),
          Buffer.alloc(bytes.length, 1),
        );
      if (failure === "root") rmSync(mediaRoot, { recursive: true });
      await expect(readVerifiedMedia(storage, asset)).rejects.toMatchObject({
        statusCode: 503,
        code: "MEDIA_UNAVAILABLE",
        message: "Media storage is unavailable.",
      });
    },
  );
});

import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createMediaConfig } from "../../core/config/media.config.js";
import { MediaStorage } from "./media-storage.js";

const roots: string[] = [];
const assetId = "43afae94-0e94-45e9-ab76-100f889d0777";

const storageFixture = () => {
  const parent = mkdtempSync(join(tmpdir(), "fury-media-storage-"));
  roots.push(parent);
  const release = join(parent, "release");
  const media = join(parent, "media");
  mkdirSync(release);
  mkdirSync(media);
  return {
    media,
    storage: new MediaStorage(createMediaConfig(media, release)),
  };
};

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("private media storage", () => {
  it("keeps staged bytes private until atomic publication", async () => {
    const { media, storage } = storageFixture();
    await storage.stage(assetId, Buffer.from("validated-image"));
    await expect(storage.read(assetId)).rejects.toThrow();
    await storage.publish(assetId);
    expect(await storage.read(assetId)).toEqual(Buffer.from("validated-image"));
    expect(readFileSync(join(media, `${assetId}.bin`))).toEqual(
      Buffer.from("validated-image"),
    );
    await storage.remove(assetId);
    await expect(storage.read(assetId)).rejects.toThrow();
  });

  it("rejects traversal and a root swapped after initialization", async () => {
    const { media, storage } = storageFixture();
    await expect(
      storage.stage("../outside", Buffer.from("x")),
    ).rejects.toThrow();
    const former = `${media}-former`;
    renameSync(media, former);
    mkdirSync(media);
    await expect(storage.stage(assetId, Buffer.from("x"))).rejects.toThrow();
  });

  it("does not overwrite a staged identity and reports missing reads and removals", async () => {
    const { storage } = storageFixture();
    await storage.stage(assetId, Buffer.from("first"));
    await expect(
      storage.stage(assetId, Buffer.from("second")),
    ).rejects.toThrow();
    await storage.publish(assetId);
    expect(await storage.read(assetId)).toEqual(Buffer.from("first"));
    await storage.remove(assetId);
    await expect(storage.read(assetId)).rejects.toThrow();
    await expect(storage.remove(assetId)).rejects.toThrow();
  });

  it("does not stage empty or out-of-bound bytes", async () => {
    const { storage } = storageFixture();
    await expect(storage.stage(assetId, Buffer.alloc(0))).rejects.toThrow();
    await expect(storage.read(assetId)).rejects.toThrow();
    await expect(
      storage.stage(assetId, Buffer.alloc(12 * 1024 * 1024 + 1)),
    ).rejects.toThrow();
    await expect(storage.read(assetId)).rejects.toThrow();
  });
});

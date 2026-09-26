import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createMediaConfig } from "./media.config.js";

const temporaryRoots: string[] = [];

const fixture = () => {
  const parent = mkdtempSync(join(tmpdir(), "fury-media-config-"));
  temporaryRoots.push(parent);
  const release = join(parent, "release");
  const storage = join(parent, "persistent");
  mkdirSync(release);
  mkdirSync(storage);
  return { parent, release, storage };
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("media storage configuration", () => {
  it("requires an existing absolute root outside the release tree", () => {
    const { release, storage } = fixture();
    expect(() => createMediaConfig(undefined, release)).toThrow();
    expect(() => createMediaConfig("relative", release)).toThrow();
    expect(() => createMediaConfig(join(release, "media"), release)).toThrow();
    expect(() =>
      createMediaConfig(join(storage, "missing"), release),
    ).toThrow();
    expect(createMediaConfig(storage, release).root).toBe(storage);
    expect(createMediaConfig(storage, release)).toMatchObject({
      maxInputBytes: 12 * 1024 * 1024,
      maxDecodedPixels: 24_000_000,
    });
  });

  it("rejects symlinked and unwritable roots", () => {
    const { parent, release, storage } = fixture();
    const alias = join(parent, "alias");
    symlinkSync(
      storage,
      alias,
      process.platform === "win32" ? "junction" : "dir",
    );
    expect(() => createMediaConfig(alias, release)).toThrow();
    chmodSync(storage, 0o500);
    expect(() => createMediaConfig(storage, release)).toThrow();
  });
});

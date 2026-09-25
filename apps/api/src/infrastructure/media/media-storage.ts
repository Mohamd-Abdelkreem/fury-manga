import { accessSync, constants, lstatSync, mkdirSync, statSync } from "node:fs";
import { open, readdir, rename, unlink } from "node:fs/promises";
import { join } from "node:path";

import type { MediaConfig } from "../../core/config/media.config.js";
import { createMediaConfig } from "../../core/config/media.config.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;

export class MediaStorage {
  private readonly rootIdentity: Readonly<{ dev: number; ino: number }>;
  private readonly stagingIdentity: Readonly<{ dev: number; ino: number }>;
  private readonly stagingRoot: string;

  constructor(private readonly config: MediaConfig) {
    const checked = createMediaConfig(config.root);
    this.rootIdentity = statSync(checked.root);
    this.stagingRoot = join(checked.root, ".staging");
    mkdirSync(this.stagingRoot, { recursive: true, mode: 0o700 });
    if (lstatSync(this.stagingRoot).isSymbolicLink()) {
      throw new Error("Media staging directory cannot be a symbolic link.");
    }
    this.stagingIdentity = statSync(this.stagingRoot);
  }

  checkHealth(): void {
    createMediaConfig(this.config.root);
    const currentRoot = statSync(this.config.root);
    const currentStaging = lstatSync(this.stagingRoot);
    if (
      currentRoot.dev !== this.rootIdentity.dev ||
      currentRoot.ino !== this.rootIdentity.ino ||
      currentStaging.isSymbolicLink() ||
      currentStaging.dev !== this.stagingIdentity.dev ||
      currentStaging.ino !== this.stagingIdentity.ino
    ) {
      throw new Error("Media storage identity changed.");
    }
    accessSync(this.stagingRoot, constants.R_OK | constants.W_OK);
  }

  private assertAssetId(assetId: string): void {
    if (!UUID_PATTERN.test(assetId)) {
      throw new Error("Invalid server media identifier.");
    }
  }

  private stagedPath(assetId: string): string {
    this.assertAssetId(assetId);
    return join(this.stagingRoot, `${assetId}.bin`);
  }

  private finalPath(assetId: string): string {
    this.assertAssetId(assetId);
    return join(this.config.root, `${assetId}.bin`);
  }

  async stage(assetId: string, bytes: Buffer): Promise<void> {
    this.checkHealth();
    if (bytes.length === 0 || bytes.length > this.config.maxInputBytes) {
      throw new Error("Validated media bytes are outside storage bounds.");
    }
    const handle = await open(
      this.stagedPath(assetId),
      constants.O_CREAT |
        constants.O_EXCL |
        constants.O_WRONLY |
        constants.O_NOFOLLOW,
      0o600,
    );
    try {
      await handle.writeFile(bytes);
      await handle.sync();
    } finally {
      await handle.close();
    }
  }

  async publish(assetId: string): Promise<void> {
    this.checkHealth();
    const destination = this.finalPath(assetId);
    try {
      lstatSync(destination);
      throw new Error("Media identity already exists.");
    } catch (error) {
      if (!isMissingFile(error)) throw error;
    }
    await rename(this.stagedPath(assetId), destination);
    await this.syncDirectory();
  }

  async read(assetId: string): Promise<Buffer> {
    this.checkHealth();
    const handle = await open(
      this.finalPath(assetId),
      constants.O_RDONLY | constants.O_NOFOLLOW,
    );
    try {
      const fileStat = await handle.stat();
      if (!fileStat.isFile()) throw new Error("Media asset is not a file.");
      return await handle.readFile();
    } finally {
      await handle.close();
    }
  }

  async remove(assetId: string): Promise<void> {
    this.checkHealth();
    await unlink(this.finalPath(assetId));
    await this.syncDirectory();
  }

  async readPublishedIfPresent(assetId: string): Promise<Buffer | null> {
    try {
      return await this.read(assetId);
    } catch (error) {
      if (isMissingFile(error)) return null;
      throw error;
    }
  }

  async readStaged(assetId: string): Promise<Buffer | null> {
    this.checkHealth();
    try {
      const handle = await open(
        this.stagedPath(assetId),
        constants.O_RDONLY | constants.O_NOFOLLOW,
      );
      try {
        return await handle.readFile();
      } finally {
        await handle.close();
      }
    } catch (error) {
      if (isMissingFile(error)) return null;
      throw error;
    }
  }

  async removePublishedIfPresent(assetId: string): Promise<void> {
    try {
      await this.remove(assetId);
    } catch (error) {
      if (!isMissingFile(error)) throw error;
    }
  }

  async removeStagedIfPresent(assetId: string): Promise<void> {
    this.checkHealth();
    try {
      await unlink(this.stagedPath(assetId));
    } catch (error) {
      if (!isMissingFile(error)) throw error;
    }
  }

  async listStagedAssetIds(limit: number): Promise<string[]> {
    this.checkHealth();
    const names = await readdir(this.stagingRoot);
    return names
      .map((name) => name.match(/^([0-9a-f-]{36})\.bin$/u)?.[1])
      .filter((id): id is string => id !== undefined && UUID_PATTERN.test(id))
      .sort()
      .slice(0, limit);
  }

  private async syncDirectory(): Promise<void> {
    if (process.platform === "win32") return;
    const directory = await open(this.config.root, constants.O_RDONLY);
    try {
      await directory.sync();
    } finally {
      await directory.close();
    }
  }
}

const isMissingFile = (error: unknown): boolean =>
  error instanceof Error && "code" in error && error.code === "ENOENT";

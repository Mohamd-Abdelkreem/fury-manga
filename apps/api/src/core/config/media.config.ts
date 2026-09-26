import { accessSync, constants, lstatSync, statSync } from "node:fs";
import { isAbsolute, join, parse, relative, resolve, sep } from "node:path";

import { getEnvVariable } from "./env.js";

export type MediaConfig = Readonly<{
  root: string;
  maxInputBytes: number;
  maxDecodedPixels: number;
}>;

export const createMediaConfig = (
  root: string | undefined,
  releaseRoot = process.cwd(),
): MediaConfig => {
  if (root === undefined || !isAbsolute(root)) {
    throw new Error("MEDIA_STORAGE_ROOT must be an absolute directory.");
  }

  const resolvedRoot = resolve(root);
  let ancestor = parse(resolvedRoot).root;
  for (const segment of relative(ancestor, resolvedRoot).split(sep)) {
    ancestor = join(ancestor, segment);
    if (lstatSync(ancestor).isSymbolicLink()) {
      throw new Error("MEDIA_STORAGE_ROOT cannot contain symbolic links.");
    }
  }
  const releaseRelative = relative(resolve(releaseRoot), resolvedRoot);
  if (
    releaseRelative === "" ||
    (releaseRelative !== ".." &&
      !releaseRelative.startsWith(`..${sep}`) &&
      !isAbsolute(releaseRelative))
  ) {
    throw new Error(
      "MEDIA_STORAGE_ROOT must be outside the application release.",
    );
  }

  const rootStat = statSync(resolvedRoot);
  if (!rootStat.isDirectory()) {
    throw new Error("MEDIA_STORAGE_ROOT must be a directory.");
  }
  if ((rootStat.mode & 0o222) === 0) {
    throw new Error("MEDIA_STORAGE_ROOT must be writable.");
  }
  accessSync(resolvedRoot, constants.R_OK | constants.W_OK);

  return {
    root: resolvedRoot,
    maxInputBytes: 12 * 1024 * 1024,
    maxDecodedPixels: 24_000_000,
  };
};

export const getMediaConfig = (): MediaConfig =>
  createMediaConfig(getEnvVariable("MEDIA_STORAGE_ROOT"));

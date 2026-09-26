import { createHash } from "node:crypto";

export const mediaSha256 = (bytes: Buffer): string =>
  createHash("sha256").update(bytes).digest("hex");

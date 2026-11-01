import type { z } from "zod";
import type { CommonHttpErrorCode } from "@fury/contracts";

export type PublicCatalogErrorCode =
  | CommonHttpErrorCode
  | "MEDIA_UNAVAILABLE"
  | "INVALID_RESPONSE"
  | "NETWORK_ERROR"
  | "HTTP_ERROR"
  | "CANCELLED"
  | "ACCESS_FENCED";
export class SafePublicCatalogError extends Error {
  constructor(
    readonly code: PublicCatalogErrorCode,
    readonly statusCode: number,
    readonly requestId = "",
    readonly fieldPaths: readonly string[] = [],
  ) {
    super("Public content is unavailable. Try again.");
    this.name = "SafePublicCatalogError";
    delete this.stack;
  }
}

export const isPublicNotFound = (
  error: unknown,
): error is SafePublicCatalogError =>
  error instanceof SafePublicCatalogError &&
  error.statusCode === 404 &&
  error.code === "NOT_FOUND";

export const validatePublicInput = <T>(
  schema: z.ZodType<T>,
  value: unknown,
): T => {
  const parsed = schema.safeParse(value);
  if (!parsed.success)
    throw new SafePublicCatalogError("VALIDATION_ERROR", 400);
  return parsed.data;
};

export const validatePublicImage = (image: Blob): Blob => {
  if (
    image.size < 1 ||
    !["image/jpeg", "image/png", "image/webp"].includes(image.type)
  )
    throw new SafePublicCatalogError("INVALID_RESPONSE", 0);
  return image;
};

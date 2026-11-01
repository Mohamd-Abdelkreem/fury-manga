import axios from "axios";
import { ZodError } from "zod";
import {
  commonHttpErrorCodeSchema,
  errorEnvelopeSchema,
} from "@fury/contracts";

import { SafePublicCatalogError } from "../model/public-catalog.errors";

const safeFields = new Set([
  "query",
  "query.q",
  "query.category",
  "query.type",
  "query.status",
  "query.sort",
  "query.page",
  "params.workSlug",
  "params.chapterNumber",
]);

export const publicHttpError = (
  status: number,
  value: unknown,
): SafePublicCatalogError => {
  const parsed = errorEnvelopeSchema.safeParse(value);
  if (!parsed.success || parsed.data.statusCode !== status)
    return new SafePublicCatalogError("HTTP_ERROR", status);
  const error = parsed.data;
  const parsedCode = commonHttpErrorCodeSchema.safeParse(error.code);
  const code = parsedCode.success
    ? parsedCode.data
    : error.code === "MEDIA_UNAVAILABLE"
      ? error.code
      : "HTTP_ERROR";
  const requestId = /^[A-Za-z0-9_-]{1,128}$/u.test(error.requestId)
    ? error.requestId
    : "";
  return new SafePublicCatalogError(code, status, requestId, [
    ...new Set(
      error.errors
        ?.map((error) => error.field)
        .filter((field) => safeFields.has(field)) ?? [],
    ),
  ]);
};

const isErrorBlob = (value: unknown): value is Blob =>
  Object.prototype.toString.call(value) === "[object Blob]";
const binaryErrorBody = async (value: unknown): Promise<unknown> => {
  if (!isErrorBlob(value)) return value;
  try {
    return JSON.parse(await value.text()) as unknown;
  } catch {
    return undefined;
  }
};

export const safePublicRequest = async <T>(
  request: () => Promise<T>,
): Promise<T> => {
  try {
    return await request();
  } catch (error: unknown) {
    if (error instanceof SafePublicCatalogError) throw error;
    if (
      axios.isCancel(error) ||
      (error instanceof Error && error.name === "AbortError")
    )
      throw new SafePublicCatalogError("CANCELLED", 0);
    if (error instanceof ZodError || error instanceof SyntaxError)
      throw new SafePublicCatalogError("INVALID_RESPONSE", 0);
    if (axios.isAxiosError(error) && error.response !== undefined)
      throw publicHttpError(
        error.response.status,
        await binaryErrorBody(error.response.data),
      );
    throw new SafePublicCatalogError("NETWORK_ERROR", 0);
  }
};

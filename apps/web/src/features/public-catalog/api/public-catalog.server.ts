import "server-only";

import {
  workSlugParamsSchema,
  publicChapterParamsSchema,
  catalogWorkListQuerySchema,
  catalogCategoryListQuerySchema,
  type CatalogWorkListQueryInput,
  type CatalogCategoryListQueryInput,
} from "@fury/contracts";
import type { z } from "zod";

import { getServerEnvironment } from "@/config/server-environment";
import {
  publicCatalogResponses,
  readPublicResult,
  publicDetailFor,
  publicChapterFor,
} from "../model/public-catalog.responses";
import { publicQueryParameters } from "../model/catalog-query";
import {
  validatePublicInput,
  validatePublicImage,
  SafePublicCatalogError,
} from "../model/public-catalog.errors";

import { safePublicRequest, publicHttpError } from "./public-catalog.transport";

const request = async (
  path: string,
  query: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<Response> => {
  const { SERVER_API_URL } = getServerEnvironment();
  const url = new URL(`${SERVER_API_URL}${path}`);
  url.search = publicQueryParameters(query).toString();
  const response = await fetch(
    new Request(url, {
      method: "GET",
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
      ...(signal === undefined ? {} : { signal }),
    }),
  );
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => undefined);
    throw publicHttpError(response.status, body);
  }
  return response;
};
const read = async <T>(
  path: string,
  query: Record<string, string | number | undefined>,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> => {
  const response = await request(path, query, signal);
  const body: unknown = await response.json();
  return readPublicResult(schema, body, query["page"]);
};

export const publicCatalogServer = {
  getSitemap(signal?: AbortSignal) {
    return safePublicRequest(() =>
      read(
        "/content/catalog/sitemap-works",
        {},
        publicCatalogResponses.sitemap,
        signal,
      ),
    );
  },
  getDetail(workSlug: string, signal?: AbortSignal) {
    return safePublicRequest(() => {
      const params = validatePublicInput(workSlugParamsSchema, { workSlug });
      return read(
        `/content/catalog/works/${params.workSlug}`,
        {},
        publicCatalogResponses.detail,
        signal,
      ).then((data) => publicDetailFor(data, params.workSlug));
    });
  },
  listChapters(workSlug: string, page: number, signal?: AbortSignal) {
    return safePublicRequest(() => {
      const params = validatePublicInput(workSlugParamsSchema, { workSlug });
      const query = validatePublicInput(catalogWorkListQuerySchema, { page });
      return read(
        `/content/works/${params.workSlug}/chapters`,
        { page: query.page, limit: 25 },
        publicCatalogResponses.chapters,
        signal,
      );
    });
  },
  getChapter(workSlug: string, chapterNumber: number, signal?: AbortSignal) {
    return safePublicRequest(() => {
      const params = validatePublicInput(publicChapterParamsSchema, {
        workSlug,
        chapterNumber,
      });
      return read(
        `/content/works/${params.workSlug}/chapters/${String(params.chapterNumber)}`,
        {},
        publicCatalogResponses.chapter,
        signal,
      ).then((data) => publicChapterFor(data, params.chapterNumber));
    });
  },
  getImage(
    workSlug: string,
    kind: "cover" | "background",
    signal?: AbortSignal,
  ) {
    return safePublicRequest(async () => {
      const params = validatePublicInput(workSlugParamsSchema, { workSlug });
      const response = await request(
        `/content/works/${params.workSlug}/${kind}`,
        {},
        signal,
      );
      return validatePublicImage(await response.blob());
    });
  },
  getHome(signal?: AbortSignal) {
    return safePublicRequest(() =>
      read("/content/catalog/home", {}, publicCatalogResponses.home, signal),
    );
  },
  listWorks(query: CatalogWorkListQueryInput, signal?: AbortSignal) {
    return safePublicRequest(async () => {
      const parsed = catalogWorkListQuerySchema.safeParse(query);
      if (!parsed.success)
        throw new SafePublicCatalogError("VALIDATION_ERROR", 400);
      return read(
        "/content/catalog/works",
        parsed.data,
        publicCatalogResponses.works,
        signal,
      );
    });
  },
  listCategories(query: CatalogCategoryListQueryInput, signal?: AbortSignal) {
    return safePublicRequest(async () => {
      const parsed = catalogCategoryListQuerySchema.safeParse(query);
      if (!parsed.success)
        throw new SafePublicCatalogError("VALIDATION_ERROR", 400);
      return read(
        "/content/catalog/categories",
        parsed.data,
        publicCatalogResponses.categories,
        signal,
      );
    });
  },
};

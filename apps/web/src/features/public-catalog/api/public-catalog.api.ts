import {
  workSlugParamsSchema,
  publicChapterParamsSchema,
  catalogWorkListQuerySchema,
  catalogCategoryListQuerySchema,
  type CatalogWorkListQueryInput,
  type CatalogCategoryListQueryInput,
} from "@fury/contracts";
import type { z } from "zod";

import { apiClient } from "@/services/api/api-client";
import {
  publicCatalogResponses,
  readPublicResult,
  publicDetailFor,
  publicChapterFor,
} from "../model/public-catalog.responses";
import {
  validatePublicInput,
  validatePublicImage,
  SafePublicCatalogError,
} from "../model/public-catalog.errors";

import { safePublicRequest } from "./public-catalog.transport";

const read = async <T>(
  path: string,
  params: Record<string, string | number | undefined>,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> => {
  const response = await apiClient.get<unknown>(path, {
    params,
    furyPublicRead: true,
    ...(signal === undefined ? {} : { signal }),
  });
  return readPublicResult(schema, response.data, params["page"]);
};

export const publicCatalogApi = {
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
      const response = await apiClient.get<Blob>(
        `/content/works/${params.workSlug}/${kind}`,
        {
          furyPublicRead: true,
          responseType: "blob",
          ...(signal === undefined ? {} : { signal }),
        },
      );
      return validatePublicImage(response.data);
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

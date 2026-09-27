import axios from "axios";
import { ZodError } from "zod";

import {
  adminCategoryDataSchema,
  adminCategoryListDataSchema,
  adminCategoryMoveDataSchema,
  categoryIdParamsSchema,
  categoryListQuerySchema,
  categoryPositionBodySchema,
  contentOperationErrorCodeSchema,
  publicationCommandBodySchema,
  publicationTransitionDataSchema,
  createCategoryBodySchema,
  createWorkBodySchema,
  errorEnvelopeSchema,
  successEnvelopeSchema,
  updateCategoryBodySchema,
  updateWorkBodySchema,
  workIdParamsSchema,
  adminWorkDataSchema,
  adminWorkListDataSchema,
  adminWorkListQuerySchema,
  type AdminCategory,
  type AdminCategoryMove,
  type AdminWork,
  type AdminWorkListQuery,
  type CategoryListQuery,
  type CategoryPositionBody,
  type ContentOperationErrorCode,
  type PublicationCommandBody,
  type PublicationTransition,
  type CreateCategoryBody,
  type CreateWorkBody,
  type UpdateCategoryBody,
  type UpdateWorkBody,
} from "@fury/contracts";
import type { z } from "zod";

import { apiClient, getApiError } from "@/services/api/api-client";

const SAFE_ERROR_MESSAGE = "تعذر إكمال طلب المحتوى. حاول مرة أخرى.";

type SafeContentErrorCode =
  | ContentOperationErrorCode
  | "HTTP_ERROR"
  | "NETWORK_ERROR"
  | "CANCELLED"
  | "ACCESS_FENCED";

const SAFE_FIELD_PATHS = new Set([
  "body.id",
  "body.displayName",
  "body.slug",
  "body.enabled",
  "body.expectedVersion",
  "body.targetPosition",
  "body.title",
  "body.storyStatus",
  "body.type",
  "body.alternativeTitle",
  "body.synopsis",
  "body.author",
  "body.artist",
  "body.categoryIds",
  "body.tags",
  "body.coverAssetId",
  "body.backgroundAssetId",
  "body.featuredHome",
  "body.featuredOrder",
  "body.targetState",
  "body.number",
  "body.pages",
  "body.textContent",
  "body.textContent.blocks",
  "params.categoryId",
  "params.workId",
  "params.chapterId",
  "query.page",
  "query.limit",
  "query.search",
  "query.publicationStatus",
  "query.sort",
  "query.enabled",
]);

const isSafeFieldPath = (field: string): boolean => {
  if (SAFE_FIELD_PATHS.has(field)) return true;
  const indexed =
    /^body\.(pages|textContent\.blocks)\.(\d{1,3})(?:\.(id|assetId|content|text|href))?$/u.exec(
      field,
    );
  if (indexed !== null)
    return (
      Number(indexed[2]) < 500 &&
      (indexed[1] === "pages"
        ? indexed[3] === undefined ||
          indexed[3] === "id" ||
          indexed[3] === "assetId"
        : indexed[3] !== "id" && indexed[3] !== "assetId")
    );
  return /^body\.(?:tags|categoryIds)\.\d{1,3}$/u.test(field);
};

export class SafeAdminContentError extends Error {
  readonly code: SafeContentErrorCode;
  readonly statusCode: number;
  readonly requestId: string;
  readonly fieldPaths: readonly string[];

  constructor(
    code: SafeContentErrorCode,
    statusCode: number,
    requestId: string,
    fieldPaths: readonly string[] = [],
  ) {
    super(SAFE_ERROR_MESSAGE);
    this.name = "SafeAdminContentError";
    this.code = code;
    this.statusCode = statusCode;
    this.requestId = requestId;
    this.fieldPaths = fieldPaths;
    delete this.stack;
  }
}

const projectError = (error: unknown): SafeAdminContentError => {
  if (error instanceof SafeAdminContentError) return error;
  if (axios.isCancel(error)) {
    return new SafeAdminContentError("CANCELLED", 0, "");
  }
  if (error instanceof ZodError) {
    return new SafeAdminContentError("HTTP_ERROR", 0, "");
  }
  const fallback = getApiError(error);
  if (axios.isAxiosError(error)) {
    const envelope = errorEnvelopeSchema.safeParse(error.response?.data);
    if (envelope.success) {
      const code = contentOperationErrorCodeSchema.safeParse(
        envelope.data.code,
      );
      return new SafeAdminContentError(
        code.success ? code.data : "HTTP_ERROR",
        envelope.data.statusCode,
        envelope.data.requestId,
        Array.from(
          new Set(
            envelope.data.errors
              ?.map(({ field }) => field)
              .filter(isSafeFieldPath) ?? [],
          ),
        ).slice(0, 20),
      );
    }
  }
  const code = contentOperationErrorCodeSchema.safeParse(fallback.code);
  return new SafeAdminContentError(
    code.success
      ? code.data
      : fallback.code === "NETWORK_ERROR"
        ? "NETWORK_ERROR"
        : "HTTP_ERROR",
    fallback.statusCode,
    fallback.requestId,
  );
};

export const safeContentRequest = async <T>(
  request: () => Promise<T>,
): Promise<T> => {
  try {
    return await request();
  } catch (error: unknown) {
    throw projectError(error);
  }
};

export const readContentSuccessData = (value: unknown): unknown =>
  successEnvelopeSchema.parse(value).data;

const safeRequest = safeContentRequest;
const readSuccessData = readContentSuccessData;

export const adminContentApi = {
  listWorks(
    query: AdminWorkListQuery,
    signal?: AbortSignal,
  ): Promise<z.infer<typeof adminWorkListDataSchema>> {
    return safeRequest(async () => {
      const params = adminWorkListQuerySchema.parse(query);
      const response = await apiClient.get("/content/admin/works", {
        params,
        ...(signal === undefined ? {} : { signal }),
      });
      return adminWorkListDataSchema.parse(readSuccessData(response.data));
    });
  },

  listCategories(
    query: CategoryListQuery,
    signal?: AbortSignal,
  ): Promise<z.infer<typeof adminCategoryListDataSchema>> {
    return safeRequest(async () => {
      const params = categoryListQuerySchema.parse(query);
      const response = await apiClient.get("/content/admin/categories", {
        params,
        ...(signal === undefined ? {} : { signal }),
      });
      return adminCategoryListDataSchema.parse(readSuccessData(response.data));
    });
  },

  getCategory(
    categoryId: string,
    signal?: AbortSignal,
  ): Promise<AdminCategory> {
    return safeRequest(async () => {
      const { categoryId: id } = categoryIdParamsSchema.parse({ categoryId });
      const response = await apiClient.get(`/content/admin/categories/${id}`, {
        ...(signal === undefined ? {} : { signal }),
      });
      return adminCategoryDataSchema.parse(readSuccessData(response.data))
        .category;
    });
  },

  createCategory(body: CreateCategoryBody): Promise<AdminCategory> {
    return safeRequest(async () => {
      const command = createCategoryBodySchema.parse(body);
      const response = await apiClient.post(
        "/content/admin/categories",
        command,
      );
      return adminCategoryDataSchema.parse(readSuccessData(response.data))
        .category;
    });
  },

  updateCategory(
    categoryId: string,
    body: UpdateCategoryBody,
  ): Promise<AdminCategory> {
    return safeRequest(async () => {
      const { categoryId: id } = categoryIdParamsSchema.parse({ categoryId });
      const command = updateCategoryBodySchema.parse(body);
      const response = await apiClient.patch(
        `/content/admin/categories/${id}`,
        command,
      );
      return adminCategoryDataSchema.parse(readSuccessData(response.data))
        .category;
    });
  },

  moveCategory(
    categoryId: string,
    body: CategoryPositionBody,
  ): Promise<AdminCategoryMove> {
    return safeRequest(async () => {
      const { categoryId: id } = categoryIdParamsSchema.parse({ categoryId });
      const command = categoryPositionBodySchema.parse(body);
      const response = await apiClient.put(
        `/content/admin/categories/${id}/position`,
        command,
      );
      return adminCategoryMoveDataSchema.parse(readSuccessData(response.data));
    });
  },

  getWork(workId: string, signal?: AbortSignal): Promise<AdminWork> {
    return safeRequest(async () => {
      const { workId: id } = workIdParamsSchema.parse({ workId });
      const response = await apiClient.get(`/content/admin/works/${id}`, {
        ...(signal === undefined ? {} : { signal }),
      });
      return adminWorkDataSchema.parse(readSuccessData(response.data)).work;
    });
  },

  createWork(body: CreateWorkBody): Promise<AdminWork> {
    return safeRequest(async () => {
      const command = createWorkBodySchema.parse(body);
      const response = await apiClient.post("/content/admin/works", command);
      return adminWorkDataSchema.parse(readSuccessData(response.data)).work;
    });
  },

  updateWork(workId: string, body: UpdateWorkBody): Promise<AdminWork> {
    return safeRequest(async () => {
      const { workId: id } = workIdParamsSchema.parse({ workId });
      const command = updateWorkBodySchema.parse(body);
      const response = await apiClient.patch(
        `/content/admin/works/${id}`,
        command,
      );
      return adminWorkDataSchema.parse(readSuccessData(response.data)).work;
    });
  },

  transitionWork(
    workId: string,
    body: PublicationCommandBody,
  ): Promise<PublicationTransition> {
    return safeRequest(async () => {
      const { workId: id } = workIdParamsSchema.parse({ workId });
      const command = publicationCommandBodySchema.parse(body);
      const response = await apiClient.put(
        `/content/admin/works/${id}/publication`,
        command,
      );
      return publicationTransitionDataSchema.parse(
        readSuccessData(response.data),
      ).transition;
    });
  },
};

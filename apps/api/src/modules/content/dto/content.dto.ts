import {
  categoryIdParamsSchema,
  categoryListQuerySchema,
  categoryPositionBodySchema,
  createCategoryBodySchema,
  createChapterBodySchema,
  createWorkBodySchema,
  paginationQuerySchema,
  publicationCommandBodySchema,
  publicChapterParamsSchema,
  replaceWorkCategoriesBodySchema,
  updateCategoryBodySchema,
  updateChapterBodySchema,
  updateWorkBodySchema,
  workChapterParamsSchema,
  workIdParamsSchema,
  workSlugParamsSchema,
} from "@fury/contracts";
import type {
  CategoryListQuery,
  CategoryPositionBody,
  CreateCategoryBody,
  CreateChapterBody,
  CreateWorkBody,
  PublicationCommandBody,
  ReplaceWorkCategoriesBody,
  UpdateCategoryBody,
  UpdateChapterBody,
  UpdateWorkBody,
} from "@fury/contracts";

export {
  categoryIdParamsSchema,
  categoryListQuerySchema,
  categoryPositionBodySchema,
  createCategoryBodySchema,
  createChapterBodySchema,
  createWorkBodySchema,
  paginationQuerySchema,
  publicationCommandBodySchema,
  publicChapterParamsSchema,
  replaceWorkCategoriesBodySchema,
  updateCategoryBodySchema,
  updateChapterBodySchema,
  updateWorkBodySchema,
  workChapterParamsSchema,
  workIdParamsSchema,
  workSlugParamsSchema,
};

export type CategoryListQueryDto = CategoryListQuery;
export type CategoryPositionBodyDto = CategoryPositionBody;
export type CreateCategoryBodyDto = CreateCategoryBody;
export type UpdateCategoryBodyDto = UpdateCategoryBody;
export type CreateWorkBodyDto = CreateWorkBody;
export type UpdateWorkBodyDto = UpdateWorkBody;
export type ReplaceWorkCategoriesBodyDto = ReplaceWorkCategoriesBody;
export type CreateChapterBodyDto = CreateChapterBody;
export type UpdateChapterBodyDto = UpdateChapterBody;
export type PublicationCommandBodyDto = PublicationCommandBody;

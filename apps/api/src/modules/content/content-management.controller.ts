import type { Request, Response } from "express";

import { parsePagination } from "../../core/pagination/pagination.js";
import { ResponseHelper } from "../../core/responses/api-response.js";
import type { CategoryManagementService } from "./category-management.service.js";
import type { ChapterManagementService } from "./chapter-management.service.js";
import {
  categoryIdParamsSchema,
  categoryListQuerySchema,
  categoryPositionBodySchema,
  createCategoryBodySchema,
  createChapterBodySchema,
  createWorkBodySchema,
  adminWorkListQuerySchema,
  paginationQuerySchema,
  publicationCommandBodySchema,
  replaceWorkCategoriesBodySchema,
  updateCategoryBodySchema,
  updateChapterBodySchema,
  updateWorkBodySchema,
  workChapterParamsSchema,
  workIdParamsSchema,
} from "./dto/content.dto.js";
import type { PublicationManagementService } from "./publication-management.service.js";
import type { WorkManagementService } from "./work-management.service.js";

export class ContentManagementController {
  constructor(
    private readonly categories: CategoryManagementService,
    private readonly works: WorkManagementService,
    private readonly chapters: ChapterManagementService,
    private readonly publications: PublicationManagementService,
  ) {}

  listCategories = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const query = categoryListQuerySchema.parse(request.validated?.query);
    const pagination = parsePagination(query);
    const responseData = await this.categories.listCategories(
      pagination,
      query,
    );
    const message = "Categories loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  createCategory = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const body = createCategoryBodySchema.parse(request.validated?.body);
    const category = await this.categories.createCategory(body);
    const responseData = { category };
    const message = "Category created.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.created(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  getCategory = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { categoryId } = categoryIdParamsSchema.parse(
      request.validated?.params,
    );
    const category = await this.categories.getCategory(categoryId);
    const responseData = { category };
    const message = "Category loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  updateCategory = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { categoryId } = categoryIdParamsSchema.parse(
      request.validated?.params,
    );
    const body = updateCategoryBodySchema.parse(request.validated?.body);
    const category = await this.categories.updateCategory(categoryId, body);
    const responseData = { category };
    const message = "Category updated.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  moveCategory = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { categoryId } = categoryIdParamsSchema.parse(
      request.validated?.params,
    );
    const body = categoryPositionBodySchema.parse(request.validated?.body);
    const responseData = await this.categories.moveCategory(categoryId, body);
    const message = "Category position updated.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  listWorks = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const query = adminWorkListQuerySchema.parse(request.validated?.query);
    const pagination = parsePagination(query);
    const responseData = await this.works.listWorks(pagination, query);
    const message = "Works loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  createWork = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const body = createWorkBodySchema.parse(request.validated?.body);
    const actorUserId = request.user?.id ?? "";
    const work = await this.works.createWork(body, actorUserId);
    const responseData = { work };
    const message = "Work created.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.created(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  getWork = async (request: Request, response: Response): Promise<Response> => {
    const { workId } = workIdParamsSchema.parse(request.validated?.params);
    const work = await this.works.getWork(workId);
    const responseData = { work };
    const message = "Work loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  updateWork = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workId } = workIdParamsSchema.parse(request.validated?.params);
    const body = updateWorkBodySchema.parse(request.validated?.body);
    const actorUserId = request.user?.id ?? "";
    const work = await this.works.updateWork(workId, body, actorUserId);
    const responseData = { work };
    const message = "Work updated.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  replaceWorkCategories = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workId } = workIdParamsSchema.parse(request.validated?.params);
    const body = replaceWorkCategoriesBodySchema.parse(request.validated?.body);
    const work = await this.works.replaceWorkCategories(workId, body);
    const responseData = { work };
    const message = "Work Categories replaced.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  listChapters = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workId } = workIdParamsSchema.parse(request.validated?.params);
    const pagination = this.paginationFrom(request);
    const responseData = await this.chapters.listChapters(workId, pagination);
    const message = "Chapters loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  createChapter = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workId } = workIdParamsSchema.parse(request.validated?.params);
    const body = createChapterBodySchema.parse(request.validated?.body);
    const chapter = await this.chapters.createChapter(workId, body);
    const responseData = { chapter };
    const message = "Chapter created.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.created(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  getChapter = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workId, chapterId } = workChapterParamsSchema.parse(
      request.validated?.params,
    );
    const chapter = await this.chapters.getChapter(workId, chapterId);
    const responseData = { chapter };
    const message = "Chapter loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  updateChapter = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workId, chapterId } = workChapterParamsSchema.parse(
      request.validated?.params,
    );
    const body = updateChapterBodySchema.parse(request.validated?.body);
    const chapter = await this.chapters.updateChapter(workId, chapterId, body);
    const responseData = { chapter };
    const message = "Chapter updated.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  publishWork = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workId } = workIdParamsSchema.parse(request.validated?.params);
    const body = publicationCommandBodySchema.parse(request.validated?.body);
    const transition = await this.publications.publishWork(workId, body);
    const responseData = { transition };
    const message = "Work publication state resolved.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  publishChapter = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workId, chapterId } = workChapterParamsSchema.parse(
      request.validated?.params,
    );
    const body = publicationCommandBodySchema.parse(request.validated?.body);
    const transition = await this.publications.publishChapter(
      workId,
      chapterId,
      body,
    );
    const responseData = { transition };
    const message = "Chapter publication state resolved.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(
      response,
      responseData,
      message,
      requestPath,
      requestId,
    );
  };

  // Helper methods

  private paginationFrom(request: Request) {
    const query = paginationQuerySchema.parse(request.validated?.query);
    const pagination = parsePagination(query);
    return pagination;
  }
}

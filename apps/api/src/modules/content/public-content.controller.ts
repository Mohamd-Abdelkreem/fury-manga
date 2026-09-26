import type { Request, Response } from "express";

import { parsePagination } from "../../core/pagination/pagination.js";
import { ResponseHelper } from "../../core/responses/api-response.js";
import {
  paginationQuerySchema,
  publicChapterParamsSchema,
  workSlugParamsSchema,
} from "./dto/content.dto.js";
import type { PublicContentService } from "./public-content.service.js";

export class PublicContentController {
  constructor(private readonly content: PublicContentService) {}

  listWorks = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const pagination = this.paginationFrom(request);
    const responseData = await this.content.listWorks(pagination);
    const message = "Published Works loaded.";
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

  getWork = async (request: Request, response: Response): Promise<Response> => {
    const { workSlug } = workSlugParamsSchema.parse(request.validated?.params);
    const work = await this.content.getWork(workSlug);
    const responseData = { work };
    const message = "Published Work loaded.";
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
    const { workSlug } = workSlugParamsSchema.parse(request.validated?.params);
    const pagination = this.paginationFrom(request);
    const responseData = await this.content.listChapters(workSlug, pagination);
    const message = "Published Chapters loaded.";
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

  getChapter = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workSlug, chapterNumber } = publicChapterParamsSchema.parse(
      request.validated?.params,
    );
    const chapter = await this.content.getChapter(workSlug, chapterNumber);
    const responseData = { chapter };
    const message = "Published Chapter loaded.";
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

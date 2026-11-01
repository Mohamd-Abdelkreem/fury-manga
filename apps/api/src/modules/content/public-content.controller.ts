import type { Request, Response } from "express";

import { parsePagination } from "../../core/pagination/pagination.js";
import { ResponseHelper } from "../../core/responses/api-response.js";
import {
  catalogWorkListQuerySchema,
  catalogCategoryListQuerySchema,
  paginationQuerySchema,
  publicChapterParamsSchema,
  workSlugParamsSchema,
} from "./dto/content.dto.js";
import type { PublicContentService } from "./public-content.service.js";

export class PublicContentController {
  constructor(private readonly content: PublicContentService) {}

  listCatalogWorks = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const query = catalogWorkListQuerySchema.parse(request.validated?.query);
    const data = await this.content.listCatalogWorks(query);
    const message = "Public catalog loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(response, data, message, requestPath, requestId);
  };

  listCatalogCategories = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const query = catalogCategoryListQuerySchema.parse(
      request.validated?.query,
    );
    const data = await this.content.listCatalogCategories(query);
    const message = "Public categories loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(response, data, message, requestPath, requestId);
  };

  getCatalogHome = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const data = await this.content.getCatalogHome();
    const message = "Public home loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(response, data, message, requestPath, requestId);
  };

  getCatalogSitemap = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const data = await this.content.getCatalogSitemap();
    const message = "Public sitemap Works loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(response, data, message, requestPath, requestId);
  };

  getCatalogDetail = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workSlug } = workSlugParamsSchema.parse(request.validated?.params);
    const data = await this.content.getCatalogDetail(workSlug);
    const message = "Public Work detail loaded.";
    const requestPath = request.path;
    const requestId = request.requestId;
    return ResponseHelper.ok(response, data, message, requestPath, requestId);
  };

  getCover = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workSlug } = workSlugParamsSchema.parse(request.validated?.params);
    const image = await this.content.getCover(workSlug);
    return this.sendWorkImage(response, image);
  };

  getBackground = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { workSlug } = workSlugParamsSchema.parse(request.validated?.params);
    const image = await this.content.getBackground(workSlug);
    return this.sendWorkImage(response, image);
  };

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
  private sendWorkImage(
    response: Response,
    image: { bytes: Buffer; contentType: string },
  ): Response {
    response.set({
      "Content-Type": image.contentType,
      "Content-Length": String(image.bytes.length),
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    });
    return response.status(200).end(image.bytes);
  }
}

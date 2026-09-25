import type { Request, Response } from "express";

import {
  mediaAssetParamsSchema,
  mediaAttemptParamsSchema,
  mediaListQuerySchema,
  mediaReferenceCreateSchema,
  mediaReferenceParamsSchema,
  mediaReferenceQuerySchema,
  mediaReferenceReplaceSchema,
  mediaReferenceRetireSchema,
} from "@fury/contracts";

import { AppError } from "../../core/errors/app.error.js";
import { ResponseHelper } from "../../core/responses/api-response.js";
import { parseMediaUpload } from "./media.multipart.js";
import type { MediaService } from "./media.service.js";

export class MediaController {
  constructor(private readonly service: MediaService) {}

  upload = async (request: Request, response: Response): Promise<Response> => {
    const actorUserId = this.actorId(request);
    const parsed = await parseMediaUpload(request, (attemptId, mediaClass) =>
      this.service.reserveUpload(actorUserId, attemptId, mediaClass),
    );
    const { reservation, ...upload } = parsed;
    const outcome = await this.service.completeUpload(
      { actorUserId, ...upload },
      reservation,
    );
    return ResponseHelper.success(
      response,
      outcome.asset,
      outcome.replayed ? "Media already uploaded." : "Media uploaded.",
      outcome.replayed ? 200 : 201,
      request.path,
      request.requestId,
    );
  };

  list = async (request: Request, response: Response): Promise<Response> => {
    const actorUserId = this.actorId(request);
    const query = mediaListQuerySchema.parse(request.query);
    let listed;
    if (query.scope === "mine") {
      listed = await this.service.listMine(
        actorUserId,
        query.page,
        query.limit,
      );
    } else {
      if (query.mediaClass === "user_avatar") {
        throw new AppError("Media scope is unavailable.", 403, "FORBIDDEN");
      }
      listed = await this.service.listAdmin(
        actorUserId,
        query.page,
        query.limit,
        query.mediaClass,
      );
    }
    return ResponseHelper.ok(
      response,
      listed,
      "Media listed.",
      request.path,
      request.requestId,
    );
  };

  getAttempt = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { attemptId } = mediaAttemptParamsSchema.parse(request.params);
    const attempt = await this.service.getAdminAttempt(
      this.actorId(request),
      attemptId,
    );
    return ResponseHelper.ok(
      response,
      attempt,
      "Upload attempt found.",
      request.path,
      request.requestId,
    );
  };

  getAsset = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { assetId } = mediaAssetParamsSchema.parse(request.params);
    const actor = this.actorId(request);
    const asset = await this.service.getAsset(actor, assetId);
    return ResponseHelper.ok(
      response,
      asset,
      "Media asset found.",
      request.path,
      request.requestId,
    );
  };

  getContent = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { assetId } = mediaAssetParamsSchema.parse(request.params);
    const actor = this.actorId(request);
    const asset = await this.service.getAsset(actor, assetId);
    const bytes = await this.service.read(actor, assetId);
    const extension =
      asset.contentType === "image/jpeg"
        ? "jpg"
        : asset.contentType === "image/png"
          ? "png"
          : "webp";
    return response
      .status(200)
      .set({
        "Content-Type": asset.contentType,
        "Content-Length": String(bytes.length),
        "Content-Disposition": `inline; filename="${assetId}.${extension}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      })
      .send(bytes);
  };

  removeAsset = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { assetId } = mediaAssetParamsSchema.parse(request.params);
    const removed = await this.service.removeAsset(
      this.actorId(request),
      assetId,
    );
    return ResponseHelper.ok(
      response,
      removed,
      "Media asset removed.",
      request.path,
      request.requestId,
    );
  };

  getReferenceForTarget = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const query = mediaReferenceQuerySchema.parse(request.query);
    const reference = await this.service.getReferenceForTarget(
      this.actorId(request),
      query.targetKind,
      query.targetId,
    );
    return ResponseHelper.ok(
      response,
      { reference },
      "Media reference lookup completed.",
      request.path,
      request.requestId,
    );
  };

  getReference = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { referenceId } = mediaReferenceParamsSchema.parse(request.params);
    const reference = await this.service.getReference(
      this.actorId(request),
      referenceId,
    );
    return ResponseHelper.ok(
      response,
      reference,
      "Media reference found.",
      request.path,
      request.requestId,
    );
  };

  bindReference = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const command = mediaReferenceCreateSchema.parse(request.body);
    const result = await this.service.bindReference(
      this.actorId(request),
      command,
    );
    return ResponseHelper.success(
      response,
      result.reference,
      result.created
        ? "Media reference created."
        : "Media reference already exists.",
      result.created ? 201 : 200,
      request.path,
      request.requestId,
    );
  };

  replaceReference = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { referenceId } = mediaReferenceParamsSchema.parse(request.params);
    const command = mediaReferenceReplaceSchema.parse(request.body);
    const reference = await this.service.replaceReference(
      this.actorId(request),
      referenceId,
      command,
    );
    return ResponseHelper.ok(
      response,
      reference,
      "Media reference replaced.",
      request.path,
      request.requestId,
    );
  };

  retireReference = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { referenceId } = mediaReferenceParamsSchema.parse(request.params);
    const command = mediaReferenceRetireSchema.parse(request.body);
    const retired = await this.service.retireReference(
      this.actorId(request),
      referenceId,
      command,
    );
    return ResponseHelper.ok(
      response,
      retired,
      "Media reference retired.",
      request.path,
      request.requestId,
    );
  };

  // Helper Methods
  private readonly actorId = (request: Request): string => {
    if (request.user === undefined)
      throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
    return request.user.id;
  };
}

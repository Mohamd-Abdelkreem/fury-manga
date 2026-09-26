import { Router, type RequestHandler } from "express";

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
import {
  csrfMiddleware,
  validationMiddleware,
} from "../../middlewares/index.js";
import { createMediaUploadRateLimiter } from "../../middlewares/rate-limit.middleware.js";
import type { MediaController } from "./media.controller.js";

export const mediaRoutes = (
  controller: MediaController,
  authenticationMiddleware: RequestHandler,
): Router => {
  const router = Router();
  router.use((_request, response, next) => {
    response.setHeader("Cache-Control", "no-store");
    next();
  });
  router.use(authenticationMiddleware);
  router.post(
    "/assets",
    csrfMiddleware,
    createMediaUploadRateLimiter(),
    controller.upload,
  );
  router.get(
    "/uploads/:attemptId",
    validationMiddleware({ params: mediaAttemptParamsSchema }),
    controller.getAttempt,
  );
  router.get(
    "/assets",
    validationMiddleware({ query: mediaListQuerySchema }),
    controller.list,
  );
  router.get(
    "/assets/:assetId",
    validationMiddleware({ params: mediaAssetParamsSchema }),
    controller.getAsset,
  );
  router.delete(
    "/assets/:assetId",
    csrfMiddleware,
    validationMiddleware({ params: mediaAssetParamsSchema }),
    controller.removeAsset,
  );
  router.get(
    "/assets/:assetId/content",
    validationMiddleware({ params: mediaAssetParamsSchema }),
    controller.getContent,
  );
  router.get(
    "/references",
    validationMiddleware({ query: mediaReferenceQuerySchema }),
    controller.getReferenceForTarget,
  );
  router.post(
    "/references",
    csrfMiddleware,
    validationMiddleware({ body: mediaReferenceCreateSchema }),
    controller.bindReference,
  );
  router.get(
    "/references/:referenceId",
    validationMiddleware({ params: mediaReferenceParamsSchema }),
    controller.getReference,
  );
  router.put(
    "/references/:referenceId",
    csrfMiddleware,
    validationMiddleware({
      params: mediaReferenceParamsSchema,
      body: mediaReferenceReplaceSchema,
    }),
    controller.replaceReference,
  );
  router.delete(
    "/references/:referenceId",
    csrfMiddleware,
    validationMiddleware({
      params: mediaReferenceParamsSchema,
      body: mediaReferenceRetireSchema,
    }),
    controller.retireReference,
  );
  return router;
};

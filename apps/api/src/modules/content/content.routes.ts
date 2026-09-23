import { Router, type RequestHandler } from "express";

import { UserRole } from "@fury/database";

import {
  authorizeRoles,
  csrfMiddleware,
  validationMiddleware,
} from "../../middlewares/index.js";
import type { ContentManagementController } from "./content-management.controller.js";
import {
  categoryIdParamsSchema,
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
} from "./dto/content.dto.js";
import type { PublicContentController } from "./public-content.controller.js";

export const contentRoutes = (
  publicController: PublicContentController,
  managementController: ContentManagementController,
  authenticationMiddleware: RequestHandler,
): Router => {
  const router = Router();
  const admin = Router();
  const authorizeAdmin = authorizeRoles(UserRole.ADMIN);

  router.get(
    "/works",
    validationMiddleware({ query: paginationQuerySchema }),
    publicController.listWorks,
  );
  router.get(
    "/works/:workSlug",
    validationMiddleware({ params: workSlugParamsSchema }),
    publicController.getWork,
  );
  router.get(
    "/works/:workSlug/chapters",
    validationMiddleware({
      params: workSlugParamsSchema,
      query: paginationQuerySchema,
    }),
    publicController.listChapters,
  );
  router.get(
    "/works/:workSlug/chapters/:chapterNumber",
    validationMiddleware({ params: publicChapterParamsSchema }),
    publicController.getChapter,
  );

  admin.use(authenticationMiddleware, authorizeAdmin);
  admin.get(
    "/categories",
    validationMiddleware({ query: paginationQuerySchema }),
    managementController.listCategories,
  );
  admin.post(
    "/categories",
    csrfMiddleware,
    validationMiddleware({ body: createCategoryBodySchema }),
    managementController.createCategory,
  );
  admin.get(
    "/categories/:categoryId",
    validationMiddleware({ params: categoryIdParamsSchema }),
    managementController.getCategory,
  );
  admin.patch(
    "/categories/:categoryId",
    csrfMiddleware,
    validationMiddleware({
      params: categoryIdParamsSchema,
      body: updateCategoryBodySchema,
    }),
    managementController.updateCategory,
  );
  admin.get(
    "/works",
    validationMiddleware({ query: paginationQuerySchema }),
    managementController.listWorks,
  );
  admin.post(
    "/works",
    csrfMiddleware,
    validationMiddleware({ body: createWorkBodySchema }),
    managementController.createWork,
  );
  admin.get(
    "/works/:workId",
    validationMiddleware({ params: workIdParamsSchema }),
    managementController.getWork,
  );
  admin.patch(
    "/works/:workId",
    csrfMiddleware,
    validationMiddleware({
      params: workIdParamsSchema,
      body: updateWorkBodySchema,
    }),
    managementController.updateWork,
  );
  admin.put(
    "/works/:workId/categories",
    csrfMiddleware,
    validationMiddleware({
      params: workIdParamsSchema,
      body: replaceWorkCategoriesBodySchema,
    }),
    managementController.replaceWorkCategories,
  );
  admin.get(
    "/works/:workId/chapters",
    validationMiddleware({
      params: workIdParamsSchema,
      query: paginationQuerySchema,
    }),
    managementController.listChapters,
  );
  admin.post(
    "/works/:workId/chapters",
    csrfMiddleware,
    validationMiddleware({
      params: workIdParamsSchema,
      body: createChapterBodySchema,
    }),
    managementController.createChapter,
  );
  admin.get(
    "/works/:workId/chapters/:chapterId",
    validationMiddleware({ params: workChapterParamsSchema }),
    managementController.getChapter,
  );
  admin.patch(
    "/works/:workId/chapters/:chapterId",
    csrfMiddleware,
    validationMiddleware({
      params: workChapterParamsSchema,
      body: updateChapterBodySchema,
    }),
    managementController.updateChapter,
  );
  admin.put(
    "/works/:workId/publication",
    csrfMiddleware,
    validationMiddleware({
      params: workIdParamsSchema,
      body: publicationCommandBodySchema,
    }),
    managementController.publishWork,
  );
  admin.put(
    "/works/:workId/chapters/:chapterId/publication",
    csrfMiddleware,
    validationMiddleware({
      params: workChapterParamsSchema,
      body: publicationCommandBodySchema,
    }),
    managementController.publishChapter,
  );

  router.use("/admin", admin);
  return router;
};

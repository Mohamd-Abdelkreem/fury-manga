import { Router } from "express";
import { randomUUID } from "node:crypto";

import type { DatabaseClient } from "@fury/database";

import { openApiRoutes } from "./infrastructure/openapi/openapi.routes.js";
import type { EmailService } from "./infrastructure/email/email.service.js";
import { createAuthenticationMiddleware } from "./middlewares/auth.middleware.js";
import {
  AuthController,
  authRoutes,
  AuthService,
  CategoryManagementService,
  ChapterManagementService,
  ContentManagementController,
  contentRoutes,
  HealthController,
  healthRoutes,
  HealthService,
  UsersController,
  usersRoutes,
  UsersService,
  PublicContentService,
  PublicationManagementService,
  PublicContentController,
  WorkManagementService,
} from "./modules/index.js";

export const createApiRouter = (
  database: DatabaseClient,
  emailService: EmailService,
): Router => {
  const router = Router();

  const healthService = new HealthService(database);
  const healthController = new HealthController(healthService);
  const authenticationMiddleware = createAuthenticationMiddleware(database);
  const authController = new AuthController(
    new AuthService(database, emailService),
  );
  const usersController = new UsersController(new UsersService(database));
  const publicationDependencies = {
    currentTime: () => new Date(),
    createIdentifier: randomUUID,
  };
  const publicContentController = new PublicContentController(
    new PublicContentService(database),
  );
  const contentManagementController = new ContentManagementController(
    new CategoryManagementService(database),
    new WorkManagementService(database),
    new ChapterManagementService(database),
    new PublicationManagementService(database, publicationDependencies),
  );

  router.use(openApiRoutes());
  router.use("/auth", authRoutes(authController, authenticationMiddleware));
  router.use("/users", usersRoutes(usersController, authenticationMiddleware));
  router.use(
    "/content",
    contentRoutes(
      publicContentController,
      contentManagementController,
      authenticationMiddleware,
    ),
  );
  router.use("/health", healthRoutes(healthController));

  return router;
};

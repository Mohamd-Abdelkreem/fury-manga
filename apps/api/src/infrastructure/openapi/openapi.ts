import { z } from "zod";
import { createDocument } from "zod-openapi";

import {
  accountResponseSchemas,
  adminCategoryDataSchema,
  adminCategoryListDataSchema,
  adminCategoryMoveDataSchema,
  adminCategorySchema,
  adminChapterDataSchema,
  adminChapterListDataSchema,
  adminChapterSchema,
  adminWorkDataSchema,
  adminWorkListDataSchema,
  adminWorkSchema,
  categoryIdParamsSchema,
  categoryListQuerySchema,
  categoryPositionBodySchema,
  chapterContentTypeSchema,
  contentErrorCodeSchema,
  contentOperationErrorCodeSchema,
  type ContentErrorCode,
  type ContentOperationErrorCode,
  commonHttpErrorCodeSchema,
  createCategoryBodySchema,
  createChapterBodySchema,
  createWorkBodySchema,
  errorEnvelopeSchema,
  mediaAssetListDataSchema,
  mediaAssetParamsSchema,
  mediaAssetSchema,
  mediaAttemptParamsSchema,
  mediaAttemptSchema,
  mediaClassSchema,
  mediaListQuerySchema,
  mediaRemovalSchema,
  mediaReferenceCreateSchema,
  mediaReferenceLookupDataSchema,
  mediaReferenceParamsSchema,
  mediaReferenceQuerySchema,
  mediaReferenceReplaceSchema,
  mediaReferenceRetireSchema,
  mediaReferenceRetirementSchema,
  mediaReferenceSchema,
  paginationQuerySchema,
  publicationCommandBodySchema,
  publicationStatusSchema,
  publicationTransitionDataSchema,
  publicationTransitionSchema,
  publicCategorySchema,
  publicChapterDataSchema,
  publicChapterListDataSchema,
  publicChapterParamsSchema,
  publicChapterSchema,
  publicWorkDataSchema,
  publicWorkListDataSchema,
  publicWorkSchema,
  replaceWorkCategoriesBodySchema,
  storyStatusSchema,
  structuredTextDocumentSchema,
  successEnvelopeSchema,
  updateCategoryBodySchema,
  updateChapterBodySchema,
  updateWorkBodySchema,
  workChapterParamsSchema,
  workIdParamsSchema,
  workSlugParamsSchema,
  workTagSchema,
  workTypeSchema,
} from "@fury/contracts";

import { appConfig } from "../../core/config/app.config.js";
import {
  changePasswordBodyDtoSchema,
  emailRequestBodyDtoSchema,
  loginBodyDtoSchema,
  registerBodyDtoSchema,
  resetPasswordBodyDtoSchema,
} from "../../modules/auth/dto/index.js";
import { updateProfileBodyDtoSchema } from "../../modules/users/dto/update-profile.dto.js";

const tokenParameter = z
  .string()
  .min(1)
  .meta({
    param: {
      name: "token",
      in: "query",
    },
  });

const jsonBody = (schema: z.ZodType) => ({
  required: true,
  content: { "application/json": { schema } },
});

const mediaMultipartBody = {
  required: true,
  content: {
    "multipart/form-data": {
      schema: z
        .object({
          mediaClass: mediaClassSchema,
          file: z.string().meta({ format: "binary" }),
        })
        .strict(),
    },
  },
};

const mediaAttemptHeader = z.uuid();

const successEnvelope = (data: z.ZodType): z.ZodType =>
  successEnvelopeSchema.safeExtend({ data });

const successResponse = (description: string, data: z.ZodType) => ({
  description,
  content: { "application/json": { schema: successEnvelope(data) } },
});

const errorResponse = (description: string) => ({
  description,
  content: { "application/json": { schema: errorEnvelopeSchema } },
});

const mediaErrorResponse = (
  description: string,
  codes: readonly [string, ...string[]],
) => ({
  description,
  content: {
    "application/json": {
      schema: errorEnvelopeSchema.safeExtend({ code: z.enum(codes) }),
    },
  },
});

const mediaReadErrors = {
  "400": mediaErrorResponse("Invalid media request", [
    "VALIDATION_ERROR",
    "BAD_REQUEST",
  ]),
  "401": mediaErrorResponse("Authentication required", ["UNAUTHORIZED"]),
  "403": mediaErrorResponse("Media scope is forbidden", ["FORBIDDEN"]),
  "429": mediaErrorResponse("Rate limit exceeded", ["RATE_LIMIT_EXCEEDED"]),
  "503": mediaErrorResponse("Media storage unavailable", [
    "MEDIA_UNAVAILABLE",
    "SERVICE_UNAVAILABLE",
  ]),
};

const mediaIdentityErrors = {
  ...mediaReadErrors,
  "404": mediaErrorResponse("Media identity not found", ["NOT_FOUND"]),
};

const mediaUploadErrors = {
  ...mediaReadErrors,
  "400": mediaErrorResponse("Invalid media request or image", [
    "VALIDATION_ERROR",
    "BAD_REQUEST",
    "MEDIA_INVALID_FILE",
  ]),
  "409": mediaErrorResponse("Upload attempt conflicts", [
    "UPLOAD_IN_PROGRESS",
    "UPLOAD_ATTEMPT_CONFLICT",
  ]),
  "413": mediaErrorResponse("Media size limit exceeded", [
    "MEDIA_LIMIT_EXCEEDED",
  ]),
  "415": mediaErrorResponse("Unsupported media type", [
    "MEDIA_UNSUPPORTED_TYPE",
  ]),
};

const mediaReferenceErrors = {
  ...mediaIdentityErrors,
  "409": mediaErrorResponse("Media reference conflicts", [
    "MEDIA_TARGET_CONFLICT",
    "VERSION_CONFLICT",
  ]),
};

const contentErrorResponse = (
  codes: readonly [ContentOperationErrorCode, ...ContentOperationErrorCode[]],
) => ({
  description: codes.join(", "),
  content: {
    "application/json": {
      schema: errorEnvelopeSchema.safeExtend({ code: z.enum(codes) }),
    },
  },
});

const commonErrors = {
  "400": errorResponse("Invalid request"),
  "401": errorResponse("Authentication failed"),
  "403": errorResponse("Request forbidden"),
  "429": errorResponse("Rate limit exceeded"),
  "500": errorResponse("Unexpected server error"),
};

const contentCommonErrors = {
  "400": contentErrorResponse(["VALIDATION_ERROR", "BAD_REQUEST"]),
  "429": contentErrorResponse(["RATE_LIMIT_EXCEEDED"]),
  "500": contentErrorResponse(["INTERNAL_SERVER_ERROR"]),
  "503": contentErrorResponse(["SERVICE_UNAVAILABLE"]),
};

const adminContentErrors = {
  ...contentCommonErrors,
  "401": contentErrorResponse(["UNAUTHORIZED"]),
  "403": contentErrorResponse(["FORBIDDEN"]),
};

const contentNotFound = contentErrorResponse(["NOT_FOUND"]);
const contentConflict = (
  codes: readonly [ContentErrorCode, ...ContentErrorCode[]],
) => contentErrorResponse(codes);

const adminReadSecurity = [{ BearerAuth: [] }];
const adminWriteSecurity = [{ BearerAuth: [], CsrfHeader: [] }];

const emptyObjectSchema = z.object({}).strict();
const messageSchema = z.object({ message: z.string() }).strict();
const validResetTokenSchema = z.object({ valid: z.literal(true) }).strict();
const healthSchema = z
  .object({
    status: z.enum(["ok", "degraded"]),
    database: z.enum(["ok", "error", "not_checked"]),
    uptime: z.string(),
    timestamp: z.iso.datetime({ offset: true }),
  })
  .strict();

export const buildOpenApiDocument = () =>
  createDocument({
    openapi: "3.1.0",
    info: {
      title: `${appConfig.name} OpenAPI`,
      version: "1.0.0",
      description:
        "Authentication and content-domain REST API with rotating refresh cookies, CSRF-protected ADMIN commands, and credential-free published metadata.",
    },
    servers: [{ url: appConfig.apiPrefix, description: "Configured API" }],
    components: {
      securitySchemes: {
        BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        RefreshCookie: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
        },
        CsrfHeader: {
          type: "apiKey",
          in: "header",
          name: "x-csrf-token",
        },
      },
      schemas: {
        SafeUser: accountResponseSchemas.safeUser,
        AuthUserData: accountResponseSchemas.authUserData,
        AuthSessionData: accountResponseSchemas.authSessionData,
        ErrorEnvelope: errorEnvelopeSchema,
        CommonHttpErrorCode: commonHttpErrorCodeSchema,
        WorkType: workTypeSchema,
        WorkTag: workTagSchema,
        StoryStatus: storyStatusSchema,
        PublicationStatus: publicationStatusSchema,
        ChapterContentType: chapterContentTypeSchema,
        ContentErrorCode: contentErrorCodeSchema,
        ContentOperationErrorCode: contentOperationErrorCodeSchema,
        CreateWorkBody: createWorkBodySchema,
        UpdateWorkBody: updateWorkBodySchema,
        StructuredTextDocument: structuredTextDocumentSchema,
        PublicCategory: publicCategorySchema,
        PublicWork: publicWorkSchema,
        PublicChapter: publicChapterSchema,
        AdminCategory: adminCategorySchema,
        AdminWork: adminWorkSchema,
        AdminWorkData: adminWorkDataSchema,
        AdminWorkListData: adminWorkListDataSchema,
        AdminChapter: adminChapterSchema,
        PublicationTransition: publicationTransitionSchema,
      },
    },
    paths: {
      "/auth/register": {
        post: {
          summary: "Register with email and password",
          requestBody: jsonBody(registerBodyDtoSchema),
          responses: {
            "201": successResponse(
              "Account created; verification email queued for delivery",
              accountResponseSchemas.authUserData,
            ),
            "409": errorResponse("Email already registered"),
            ...commonErrors,
          },
        },
      },
      "/auth/verify-email": {
        post: {
          summary: "Verify an email address",
          parameters: [tokenParameter],
          responses: {
            "200": successResponse(
              "Email verified",
              accountResponseSchemas.authUserData,
            ),
            ...commonErrors,
          },
        },
      },
      "/auth/resend-verification": {
        post: {
          summary: "Request another verification link",
          description:
            "Always returns a neutral response to prevent account enumeration.",
          requestBody: jsonBody(emailRequestBodyDtoSchema),
          responses: {
            "200": successResponse("Request processed", messageSchema),
            ...commonErrors,
          },
        },
      },
      "/auth/login": {
        post: {
          summary: "Create an authenticated session",
          requestBody: jsonBody(loginBodyDtoSchema),
          responses: {
            "200": successResponse(
              "Signed in; refresh and CSRF cookies set",
              accountResponseSchemas.authSessionData,
            ),
            ...commonErrors,
          },
        },
      },
      "/auth/refresh": {
        post: {
          summary: "Rotate the refresh token and issue a new access token",
          security: [{ RefreshCookie: [], CsrfHeader: [] }],
          responses: {
            "200": successResponse(
              "Session refreshed",
              accountResponseSchemas.authSessionData,
            ),
            ...commonErrors,
          },
        },
      },
      "/auth/logout": {
        post: {
          summary: "Revoke the current refresh token",
          security: [{ BearerAuth: [], RefreshCookie: [], CsrfHeader: [] }],
          responses: {
            "200": successResponse("Signed out", emptyObjectSchema),
            ...commonErrors,
          },
        },
      },
      "/auth/logout-all": {
        post: {
          summary: "Revoke every refresh token for the current user",
          security: [{ BearerAuth: [], RefreshCookie: [], CsrfHeader: [] }],
          responses: {
            "200": successResponse(
              "Signed out from all devices",
              emptyObjectSchema,
            ),
            ...commonErrors,
          },
        },
      },
      "/auth/forgot-password": {
        post: {
          summary: "Request a password reset",
          description:
            "Always returns a neutral response to prevent account enumeration.",
          requestBody: jsonBody(emailRequestBodyDtoSchema),
          responses: {
            "200": successResponse("Request processed", messageSchema),
            ...commonErrors,
          },
        },
      },
      "/auth/reset-password": {
        post: {
          summary: "Reset a password with a one-time token",
          parameters: [tokenParameter],
          requestBody: jsonBody(resetPasswordBodyDtoSchema),
          responses: {
            "200": successResponse(
              "Password reset and existing sessions revoked",
              accountResponseSchemas.authUserData,
            ),
            ...commonErrors,
          },
        },
      },
      "/auth/validate-reset-token": {
        get: {
          summary: "Validate a password-reset link",
          parameters: [tokenParameter],
          responses: {
            "200": successResponse("Reset link valid", validResetTokenSchema),
            ...commonErrors,
          },
        },
      },
      "/auth/change-password": {
        patch: {
          summary: "Change the authenticated user's password",
          security: [{ BearerAuth: [], CsrfHeader: [] }],
          requestBody: jsonBody(changePasswordBodyDtoSchema),
          responses: {
            "200": successResponse(
              "Password changed and existing sessions revoked",
              accountResponseSchemas.authUserData,
            ),
            ...commonErrors,
          },
        },
      },
      "/users/me": {
        get: {
          summary: "Read the current user",
          security: [{ BearerAuth: [] }],
          responses: {
            "200": successResponse(
              "Current user",
              accountResponseSchemas.authUserData,
            ),
            ...commonErrors,
          },
        },
        patch: {
          summary: "Update the current user's profile",
          security: [{ BearerAuth: [], CsrfHeader: [] }],
          requestBody: jsonBody(updateProfileBodyDtoSchema),
          responses: {
            "200": successResponse(
              "Profile updated",
              accountResponseSchemas.authUserData,
            ),
            ...commonErrors,
          },
        },
      },
      "/content/works": {
        get: {
          summary: "List published Works",
          description:
            "Credential-free metadata only; ambient credentials do not widen visibility.",
          requestParams: { query: paginationQuerySchema },
          responses: {
            "200": successResponse(
              "Published Work metadata",
              publicWorkListDataSchema,
            ),
            ...contentCommonErrors,
          },
        },
      },
      "/content/works/{workSlug}": {
        get: {
          summary: "Read one published Work",
          description:
            "Missing, draft, and archived Works share the same NOT_FOUND outcome.",
          requestParams: { path: workSlugParamsSchema },
          responses: {
            "200": successResponse("Published Work", publicWorkDataSchema),
            "404": contentNotFound,
            ...contentCommonErrors,
          },
        },
      },
      "/content/works/{workSlug}/chapters": {
        get: {
          summary: "List published Chapters for a published Work",
          description:
            "Chapter bodies and illustrated page metadata are excluded.",
          requestParams: {
            path: workSlugParamsSchema,
            query: paginationQuerySchema,
          },
          responses: {
            "200": successResponse(
              "Published Chapter metadata",
              publicChapterListDataSchema,
            ),
            "404": contentNotFound,
            ...contentCommonErrors,
          },
        },
      },
      "/content/works/{workSlug}/chapters/{chapterNumber}": {
        get: {
          summary: "Read one published Chapter",
          description:
            "Both the parent Work and Chapter must be published; no body or page metadata is returned.",
          requestParams: { path: publicChapterParamsSchema },
          responses: {
            "200": successResponse(
              "Published Chapter metadata",
              publicChapterDataSchema,
            ),
            "404": contentNotFound,
            ...contentCommonErrors,
          },
        },
      },
      "/content/admin/categories": {
        get: {
          summary: "List Categories for content management",
          security: adminReadSecurity,
          requestParams: { query: categoryListQuerySchema },
          responses: {
            "200": successResponse(
              "Administrative Category list",
              adminCategoryListDataSchema,
            ),
            ...adminContentErrors,
          },
        },
        post: {
          summary: "Create a Category",
          security: adminWriteSecurity,
          requestBody: jsonBody(createCategoryBodySchema),
          responses: {
            "201": successResponse("Category created", adminCategoryDataSchema),
            "409": contentConflict(["CONTENT_CONFLICT"]),
            ...adminContentErrors,
          },
        },
      },
      "/content/admin/categories/{categoryId}": {
        get: {
          summary: "Read one Category for content management",
          security: adminReadSecurity,
          requestParams: { path: categoryIdParamsSchema },
          responses: {
            "200": successResponse(
              "Administrative Category",
              adminCategoryDataSchema,
            ),
            "404": contentNotFound,
            ...adminContentErrors,
          },
        },
        patch: {
          summary: "Update a Category",
          description:
            "Uses expectedVersion; slug is immutable and conflicts if changed.",
          security: adminWriteSecurity,
          requestParams: { path: categoryIdParamsSchema },
          requestBody: jsonBody(updateCategoryBodySchema),
          responses: {
            "200": successResponse("Category updated", adminCategoryDataSchema),
            "404": contentNotFound,
            "409": contentConflict([
              "CONTENT_IMMUTABLE",
              "CONTENT_STALE_WRITE",
              "CONTENT_CATEGORY_IN_USE",
            ]),
            ...adminContentErrors,
          },
        },
      },
      "/content/admin/categories/{categoryId}/position": {
        put: {
          summary: "Move a Category one adjacent position",
          description:
            "Swaps only the requested adjacent display position using expectedVersion.",
          security: adminWriteSecurity,
          requestParams: { path: categoryIdParamsSchema },
          requestBody: jsonBody(categoryPositionBodySchema),
          responses: {
            "200": successResponse(
              "Category position updated",
              adminCategoryMoveDataSchema,
            ),
            "404": contentNotFound,
            "409": contentConflict(["CONTENT_CONFLICT", "CONTENT_STALE_WRITE"]),
            ...adminContentErrors,
          },
        },
      },
      "/content/admin/works": {
        get: {
          summary: "List Works for content management",
          security: adminReadSecurity,
          requestParams: { query: paginationQuerySchema },
          responses: {
            "200": successResponse(
              "Administrative Work list",
              adminWorkListDataSchema,
            ),
            ...adminContentErrors,
          },
        },
        post: {
          summary: "Create a Work draft or publish it atomically",
          description:
            "Accepts the minimal P01 body and optional editorial fields. An optional UUID permits authorized identity reconciliation after an unknown acknowledgement.",
          security: adminWriteSecurity,
          requestBody: jsonBody(createWorkBodySchema),
          responses: {
            "201": successResponse("Work created", adminWorkDataSchema),
            "404": contentNotFound,
            "409": contentConflict([
              "CONTENT_CONFLICT",
              "CONTENT_NOT_READY",
              "CONTENT_FEATURED_CONFLICT",
            ]),
            ...adminContentErrors,
          },
        },
      },
      "/content/admin/works/{workId}": {
        get: {
          summary: "Read one Work for content management",
          security: adminReadSecurity,
          requestParams: { path: workIdParamsSchema },
          responses: {
            "200": successResponse("Administrative Work", adminWorkDataSchema),
            "404": contentNotFound,
            ...adminContentErrors,
          },
        },
        patch: {
          summary: "Update a Work",
          description:
            "Uses expectedVersion; omitted metadata is unchanged, nullable fields clear explicitly, and slug and canonical Work type are immutable.",
          security: adminWriteSecurity,
          requestParams: { path: workIdParamsSchema },
          requestBody: jsonBody(updateWorkBodySchema),
          responses: {
            "200": successResponse("Work updated", adminWorkDataSchema),
            "404": contentNotFound,
            "409": contentConflict([
              "CONTENT_CONFLICT",
              "CONTENT_IMMUTABLE",
              "CONTENT_STALE_WRITE",
              "CONTENT_NOT_READY",
              "CONTENT_FEATURED_CONFLICT",
            ]),
            ...adminContentErrors,
          },
        },
      },
      "/content/admin/works/{workId}/categories": {
        put: {
          summary: "Replace a Work's authoritative Category set",
          description:
            "An identical set is an unchanged idempotent success; duplicate IDs fail validation.",
          security: adminWriteSecurity,
          requestParams: { path: workIdParamsSchema },
          requestBody: jsonBody(replaceWorkCategoriesBodySchema),
          responses: {
            "200": successResponse(
              "Authoritative Category set",
              adminWorkDataSchema,
            ),
            "404": contentNotFound,
            "409": contentConflict(["CONTENT_STALE_WRITE"]),
            ...adminContentErrors,
          },
        },
      },
      "/content/admin/works/{workId}/chapters": {
        get: {
          summary: "List Chapters for content management",
          security: adminReadSecurity,
          requestParams: {
            path: workIdParamsSchema,
            query: paginationQuerySchema,
          },
          responses: {
            "200": successResponse(
              "Administrative Chapter list",
              adminChapterListDataSchema,
            ),
            "404": contentNotFound,
            ...adminContentErrors,
          },
        },
        post: {
          summary: "Create a Chapter",
          description:
            "Content type is derived from the immutable parent Work type.",
          security: adminWriteSecurity,
          requestParams: { path: workIdParamsSchema },
          requestBody: jsonBody(createChapterBodySchema),
          responses: {
            "201": successResponse("Chapter created", adminChapterDataSchema),
            "404": contentNotFound,
            "409": contentConflict([
              "CONTENT_CONFLICT",
              "CONTENT_TYPE_CONFLICT",
            ]),
            ...adminContentErrors,
          },
        },
      },
      "/content/admin/works/{workId}/chapters/{chapterId}": {
        get: {
          summary: "Read one Chapter for content management",
          security: adminReadSecurity,
          requestParams: { path: workChapterParamsSchema },
          responses: {
            "200": successResponse(
              "Administrative Chapter",
              adminChapterDataSchema,
            ),
            "404": contentNotFound,
            ...adminContentErrors,
          },
        },
        patch: {
          summary: "Update Chapter content or numbering",
          description:
            "Uses expectedVersion and atomically replaces any submitted non-empty illustrated page sequence.",
          security: adminWriteSecurity,
          requestParams: { path: workChapterParamsSchema },
          requestBody: jsonBody(updateChapterBodySchema),
          responses: {
            "200": successResponse("Chapter updated", adminChapterDataSchema),
            "404": contentNotFound,
            "409": contentConflict([
              "CONTENT_CONFLICT",
              "CONTENT_TYPE_CONFLICT",
              "CONTENT_STALE_WRITE",
            ]),
            ...adminContentErrors,
          },
        },
      },
      "/content/admin/works/{workId}/publication": {
        put: {
          summary: "Set a Work publication state",
          description:
            "Same-state retries are idempotent; stale or disallowed transitions conflict.",
          security: adminWriteSecurity,
          requestParams: { path: workIdParamsSchema },
          requestBody: jsonBody(publicationCommandBodySchema),
          responses: {
            "200": successResponse(
              "Work publication result",
              publicationTransitionDataSchema,
            ),
            "404": contentNotFound,
            "409": contentConflict([
              "CONTENT_TRANSITION_CONFLICT",
              "CONTENT_STALE_WRITE",
              "CONTENT_NOT_READY",
              "CONTENT_FEATURED_CONFLICT",
            ]),
            ...adminContentErrors,
          },
        },
      },
      "/content/admin/works/{workId}/chapters/{chapterId}/publication": {
        put: {
          summary: "Set a Chapter publication state",
          description:
            "Illustrated Chapters require at least one committed page before publishing; same-state retries are idempotent.",
          security: adminWriteSecurity,
          requestParams: { path: workChapterParamsSchema },
          requestBody: jsonBody(publicationCommandBodySchema),
          responses: {
            "200": successResponse(
              "Chapter publication result",
              publicationTransitionDataSchema,
            ),
            "404": contentNotFound,
            "409": contentConflict([
              "CONTENT_TRANSITION_CONFLICT",
              "CONTENT_STALE_WRITE",
            ]),
            ...adminContentErrors,
          },
        },
      },
      "/media/assets": {
        get: {
          summary: "List the actor's private managed media assets",
          security: [{ BearerAuth: [] }],
          requestParams: { query: mediaListQuerySchema },
          responses: {
            "200": successResponse(
              "Available media assets",
              mediaAssetListDataSchema,
            ),
            ...mediaReadErrors,
          },
        },
        post: {
          summary: "Upload an authorized private media asset",
          security: [{ BearerAuth: [], CsrfHeader: [] }],
          requestParams: {
            header: z.object({ "Idempotency-Key": mediaAttemptHeader }),
          },
          requestBody: mediaMultipartBody,
          responses: {
            "200": successResponse("Exact accepted replay", mediaAssetSchema),
            "201": successResponse("Media asset uploaded", mediaAssetSchema),
            ...mediaUploadErrors,
          },
        },
      },
      "/media/uploads/{attemptId}": {
        get: {
          summary: "Read the actor's upload attempt",
          security: [{ BearerAuth: [] }],
          requestParams: { path: mediaAttemptParamsSchema },
          responses: {
            "200": successResponse("Upload attempt", mediaAttemptSchema),
            ...mediaIdentityErrors,
          },
        },
      },
      "/media/assets/{assetId}": {
        get: {
          summary: "Read private media metadata",
          security: [{ BearerAuth: [] }],
          requestParams: { path: mediaAssetParamsSchema },
          responses: {
            "200": successResponse("Media asset", mediaAssetSchema),
            ...mediaIdentityErrors,
          },
        },
        delete: {
          summary: "Remove an authorized unreferenced private media asset",
          security: [{ BearerAuth: [], CsrfHeader: [] }],
          requestParams: { path: mediaAssetParamsSchema },
          responses: {
            "200": successResponse("Media asset removed", mediaRemovalSchema),
            ...mediaIdentityErrors,
            "409": mediaErrorResponse("Media asset is in use", [
              "MEDIA_IN_USE",
            ]),
          },
        },
      },
      "/media/assets/{assetId}/content": {
        get: {
          summary: "Read authenticated private image bytes",
          security: [{ BearerAuth: [] }],
          requestParams: { path: mediaAssetParamsSchema },
          responses: {
            "200": {
              description: "Private validated image bytes; no-store",
              content: {
                "image/jpeg": { schema: z.string().meta({ format: "binary" }) },
                "image/png": { schema: z.string().meta({ format: "binary" }) },
                "image/webp": { schema: z.string().meta({ format: "binary" }) },
              },
            },
            ...mediaIdentityErrors,
          },
        },
      },
      "/media/references": {
        get: {
          summary: "Read the active reference for an authorized P01 target",
          security: [{ BearerAuth: [] }],
          requestParams: { query: mediaReferenceQuerySchema },
          responses: {
            "200": successResponse(
              "Active reference or null",
              mediaReferenceLookupDataSchema,
            ),
            ...mediaIdentityErrors,
          },
        },
        post: {
          summary: "Bind an available private asset to a P01 target",
          security: [{ BearerAuth: [], CsrfHeader: [] }],
          requestBody: jsonBody(mediaReferenceCreateSchema),
          responses: {
            "200": successResponse(
              "Equivalent active bind",
              mediaReferenceSchema,
            ),
            "201": successResponse(
              "Media reference created",
              mediaReferenceSchema,
            ),
            ...mediaReferenceErrors,
          },
        },
      },
      "/media/references/{referenceId}": {
        get: {
          summary: "Read an active private media reference",
          security: [{ BearerAuth: [] }],
          requestParams: { path: mediaReferenceParamsSchema },
          responses: {
            "200": successResponse("Media reference", mediaReferenceSchema),
            ...mediaIdentityErrors,
          },
        },
        put: {
          summary: "Replace an active media reference using compare-and-set",
          security: [{ BearerAuth: [], CsrfHeader: [] }],
          requestParams: { path: mediaReferenceParamsSchema },
          requestBody: jsonBody(mediaReferenceReplaceSchema),
          responses: {
            "200": successResponse(
              "Media reference replaced",
              mediaReferenceSchema,
            ),
            ...mediaReferenceErrors,
          },
        },
        delete: {
          summary: "Retire an active media reference using compare-and-set",
          security: [{ BearerAuth: [], CsrfHeader: [] }],
          requestParams: { path: mediaReferenceParamsSchema },
          requestBody: jsonBody(mediaReferenceRetireSchema),
          responses: {
            "200": successResponse(
              "Media reference retired",
              mediaReferenceRetirementSchema,
            ),
            ...mediaReferenceErrors,
            "409": mediaErrorResponse(
              "Media reference conflicts or published cover is required",
              [
                "MEDIA_TARGET_CONFLICT",
                "VERSION_CONFLICT",
                "CONTENT_NOT_READY",
              ],
            ),
          },
        },
      },
      "/health/live": {
        get: {
          summary: "Liveness check",
          responses: { "200": successResponse("Service alive", healthSchema) },
        },
      },
      "/health/ready": {
        get: {
          summary: "Readiness check",
          responses: {
            "200": successResponse("Service ready", healthSchema),
            "503": successResponse(
              "Database or media storage degraded",
              healthSchema,
            ),
          },
        },
      },
      "/openapi.json": {
        get: {
          summary: "OpenAPI 3.1 document",
          responses: { "200": { description: "OpenAPI document" } },
        },
      },
    },
  });

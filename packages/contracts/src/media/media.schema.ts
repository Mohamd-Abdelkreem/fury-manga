import { z } from "zod";

import {
  commonHttpErrorCodeSchema,
  paginationMetaSchema,
  paginationQuerySchema,
  successEnvelopeSchema,
} from "../http/http.schema.ts";

const identifier = z.uuid().regex(/^[0-9a-f-]+$/u);
const timestamp = z.iso.datetime({ offset: true });

export const mediaClassSchema = z.enum([
  "work_cover",
  "work_background",
  "chapter_page",
  "user_avatar",
  "avatar_frame",
  "comment_decoration",
]);

const MIB = 1024 * 1024;
export const MEDIA_SOURCE_BYTE_LIMITS = {
  work_cover: 8 * MIB,
  work_background: 8 * MIB,
  chapter_page: 12 * MIB,
  user_avatar: 4 * MIB,
  avatar_frame: 4 * MIB,
  comment_decoration: 4 * MIB,
} as const satisfies Record<z.infer<typeof mediaClassSchema>, number>;

export const adminMediaClassSchema = mediaClassSchema.exclude(["user_avatar"]);
export const mediaUploadFieldSchema = z
  .object({ mediaClass: mediaClassSchema })
  .strict();
export const mediaUploadHeaderSchema = z
  .object({ "idempotency-key": identifier })
  .strict();
export const mediaAssetParamsSchema = z
  .object({ assetId: identifier })
  .strict();
export const mediaAttemptParamsSchema = z
  .object({ attemptId: identifier })
  .strict();

export const mediaListQuerySchema = paginationQuerySchema
  .safeExtend({
    scope: z.enum(["mine", "admin"]),
    mediaClass: mediaClassSchema.optional(),
  })
  .strict()
  .refine(
    (query) =>
      query.mediaClass === undefined ||
      (query.scope === "mine") === (query.mediaClass === "user_avatar"),
    { path: ["mediaClass"] },
  )
  .refine((query) => query.page <= 100_000, {
    path: ["page"],
    message: "Page is out of range",
  });

export const mediaAssetSchema = z
  .object({
    id: identifier,
    mediaClass: mediaClassSchema,
    status: z.literal("available"),
    contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
    byteLength: z.number().int().positive(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    contentPath: z
      .string()
      .regex(/^\/api\/v1\/media\/assets\/[0-9a-f-]+\/content$/u),
    createdAt: timestamp,
  })
  .strict()
  .refine(
    (asset) => asset.contentPath === `/api/v1/media/assets/${asset.id}/content`,
    { path: ["contentPath"] },
  );

export const mediaAttemptSchema = z
  .object({
    id: identifier,
    mediaClass: mediaClassSchema,
    state: z.enum(["pending", "accepted", "rejected"]),
    assetId: identifier.nullable(),
    safeFailureCode: z
      .enum([
        "UPLOAD_INCOMPLETE",
        "MEDIA_INVALID_FILE",
        "MEDIA_UNSUPPORTED_TYPE",
        "MEDIA_LIMIT_EXCEEDED",
      ])
      .nullable(),
    createdAt: timestamp,
    completedAt: timestamp.nullable(),
  })
  .strict()
  .superRefine((attempt, context) => {
    const valid =
      attempt.state === "pending"
        ? attempt.assetId === null &&
          attempt.safeFailureCode === null &&
          attempt.completedAt === null
        : attempt.state === "accepted"
          ? attempt.assetId !== null &&
            attempt.safeFailureCode === null &&
            attempt.completedAt !== null
          : attempt.assetId === null &&
            attempt.safeFailureCode !== null &&
            attempt.completedAt !== null;
    if (!valid)
      context.addIssue({ code: "custom", message: "Invalid attempt state" });
  });

export const mediaAssetResponseSchema = successEnvelopeSchema.safeExtend({
  data: mediaAssetSchema,
});
export const mediaAttemptResponseSchema = successEnvelopeSchema.safeExtend({
  data: mediaAttemptSchema,
});
export const mediaAssetListDataSchema = z
  .object({
    items: z.array(mediaAssetSchema),
    pagination: paginationMetaSchema,
  })
  .strict();
export const mediaAssetListResponseSchema = successEnvelopeSchema.safeExtend({
  data: mediaAssetListDataSchema,
});
export const mediaRemovalSchema = z
  .object({ id: identifier, status: z.literal("removed") })
  .strict();
export const mediaRemovalResponseSchema = successEnvelopeSchema.safeExtend({
  data: mediaRemovalSchema,
});

export const mediaReferenceTargetKindSchema = z.enum([
  "work_cover",
  "work_background",
  "chapter_page",
]);
export const mediaReferenceParamsSchema = z
  .object({ referenceId: identifier })
  .strict();
export const mediaReferenceQuerySchema = z
  .object({
    targetKind: mediaReferenceTargetKindSchema,
    targetId: identifier,
  })
  .strict();
export const mediaReferenceCreateSchema = mediaReferenceQuerySchema
  .safeExtend({ assetId: identifier })
  .strict();
export const mediaReferenceReplaceSchema = z
  .object({
    assetId: identifier,
    expectedAssetId: identifier,
    expectedVersion: z.number().int().nonnegative(),
  })
  .strict();
export const mediaReferenceRetireSchema = z
  .object({
    expectedAssetId: identifier,
    expectedVersion: z.number().int().nonnegative(),
  })
  .strict();
export const mediaReferenceSchema = z
  .object({
    id: identifier,
    targetKind: mediaReferenceTargetKindSchema,
    targetId: identifier,
    assetId: identifier,
    version: z.number().int().nonnegative(),
    createdAt: timestamp,
    updatedAt: timestamp,
  })
  .strict();
export const mediaReferenceResponseSchema = successEnvelopeSchema.safeExtend({
  data: mediaReferenceSchema,
});
export const mediaReferenceLookupDataSchema = z
  .object({ reference: mediaReferenceSchema.nullable() })
  .strict();
export const mediaReferenceLookupResponseSchema =
  successEnvelopeSchema.safeExtend({ data: mediaReferenceLookupDataSchema });
export const mediaReferenceRetirementSchema = z
  .object({
    id: identifier,
    status: z.literal("retired"),
    version: z.number().int().positive(),
  })
  .strict();
export const mediaReferenceRetirementResponseSchema =
  successEnvelopeSchema.safeExtend({ data: mediaReferenceRetirementSchema });

export const mediaOperationErrorCodeSchema = z.enum([
  ...commonHttpErrorCodeSchema.options,
  "MEDIA_INVALID_FILE",
  "MEDIA_UNSUPPORTED_TYPE",
  "MEDIA_LIMIT_EXCEEDED",
  "UPLOAD_IN_PROGRESS",
  "UPLOAD_ATTEMPT_CONFLICT",
  "UPLOAD_INCOMPLETE",
  "MEDIA_IN_USE",
  "MEDIA_TARGET_CONFLICT",
  "VERSION_CONFLICT",
  "MEDIA_UNAVAILABLE",
]);

export type MediaClass = z.infer<typeof mediaClassSchema>;
export type MediaAssetDto = z.infer<typeof mediaAssetSchema>;
export type MediaAttemptDto = z.infer<typeof mediaAttemptSchema>;
export type MediaListQuery = z.infer<typeof mediaListQuerySchema>;
export type MediaRemovalDto = z.infer<typeof mediaRemovalSchema>;
export type MediaReferenceTargetKind = z.infer<
  typeof mediaReferenceTargetKindSchema
>;
export type MediaReferenceCreate = z.infer<typeof mediaReferenceCreateSchema>;
export type MediaReferenceReplace = z.infer<typeof mediaReferenceReplaceSchema>;
export type MediaReferenceRetire = z.infer<typeof mediaReferenceRetireSchema>;
export type MediaReferenceDto = z.infer<typeof mediaReferenceSchema>;

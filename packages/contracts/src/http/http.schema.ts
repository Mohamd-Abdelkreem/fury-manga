import { z } from "zod";

export const PAGINATION_DEFAULT_PAGE = 1;
export const PAGINATION_DEFAULT_LIMIT = 25;
export const PAGINATION_MAX_LIMIT = 100;

const decimalQueryInteger = (minimum: number, maximum?: number) =>
  z.preprocess(
    (value) => {
      if (value === undefined) return value;
      if (typeof value === "number") return value;
      if (typeof value !== "string") return value;

      const normalized = value.trim();
      if (!/^\d+$/u.test(normalized)) return value;
      return Number(normalized);
    },
    z
      .number()
      .int()
      .min(minimum)
      .pipe(maximum === undefined ? z.number() : z.number().max(maximum)),
  );

export const paginationQuerySchema = z
  .object({
    page: decimalQueryInteger(1).default(PAGINATION_DEFAULT_PAGE),
    limit: decimalQueryInteger(1, PAGINATION_MAX_LIMIT).default(
      PAGINATION_DEFAULT_LIMIT,
    ),
  })
  .strict();

export const nonEmptyBoundedString = (maximum: number) =>
  z
    .string()
    .min(1)
    .max(maximum)
    .refine((value) => value.trim().length > 0, {
      message: "must not contain only whitespace",
    })
    .refine((value) => !value.includes("\u0000"), {
      message: "must not contain null characters",
    });

export const fieldErrorSchema = z
  .object({
    field: nonEmptyBoundedString(200),
    message: nonEmptyBoundedString(500),
  })
  .strict();

export const paginationMetaSchema = z
  .object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  })
  .strict()
  .refine(
    (meta) =>
      meta.total === 0
        ? meta.totalPages === 0
        : meta.totalPages === Math.ceil(meta.total / meta.limit),
    {
      message: "totalPages must equal ceil(total / limit)",
      path: ["totalPages"],
    },
  )
  .refine((meta) => meta.hasPreviousPage === meta.page > 1, {
    message: "hasPreviousPage must agree with page",
    path: ["hasPreviousPage"],
  })
  .refine((meta) => meta.hasNextPage === meta.page < meta.totalPages, {
    message: "hasNextPage must agree with totalPages",
    path: ["hasNextPage"],
  });

export const successEnvelopeSchema = z
  .object({
    success: z.literal(true),
    statusCode: z.number().int().min(100).max(599),
    message: nonEmptyBoundedString(500),
    data: z.unknown(),
    paginationMeta: paginationMetaSchema.optional(),
    requestId: z.string().min(1).max(128),
    timestamp: z.iso.datetime({ offset: true }),
    path: z.string().min(1).max(2_000),
  })
  .strict()
  .refine((envelope) => Object.hasOwn(envelope, "data"), {
    message: "data is required",
    path: ["data"],
  });

export const errorEnvelopeSchema = z
  .object({
    success: z.literal(false),
    statusCode: z.number().int().min(100).max(599),
    code: nonEmptyBoundedString(80),
    message: nonEmptyBoundedString(500),
    errors: z.array(fieldErrorSchema).optional(),
    requestId: z.string().min(1).max(128),
    timestamp: z.iso.datetime({ offset: true }),
    path: z.string().min(1).max(2_000),
  })
  .strict();

export const commonHttpErrorCodeSchema = z
  .enum([
    "VALIDATION_ERROR",
    "BAD_REQUEST",
    "UNAUTHORIZED",
    "FORBIDDEN",
    "NOT_FOUND",
    "CONFLICT",
    "RATE_LIMIT_EXCEEDED",
    "INTERNAL_SERVER_ERROR",
    "SERVICE_UNAVAILABLE",
  ])
  .meta({ id: "CommonHttpErrorCode" });

export type FieldError = z.infer<typeof fieldErrorSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type ErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;
export type CommonHttpErrorCode = z.infer<typeof commonHttpErrorCodeSchema>;
export type SuccessEnvelope<T = unknown> = Omit<
  z.infer<typeof successEnvelopeSchema>,
  "data"
> & { readonly data: T };

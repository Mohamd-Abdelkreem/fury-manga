import type { ErrorRequestHandler } from "express";

import type { ErrorEnvelope } from "@fury/contracts";

import { AppError } from "../core/errors/app.error.js";
import { mapPrismaError } from "../infrastructure/database/prisma-error.mapper.js";

type SafeErrorDiagnostic = Readonly<
  { kind: "Error"; name: string } | { kind: "Unknown" }
>;

const SAFE_ERROR_NAME = /^[A-Za-z][A-Za-z0-9_.-]{0,63}$/u;

const safeErrorDiagnostic = (error: unknown): SafeErrorDiagnostic => {
  if (!(error instanceof Error)) return { kind: "Unknown" };
  const name = SAFE_ERROR_NAME.test(error.name) ? error.name : "Error";
  return { kind: "Error", name };
};

const createErrorResponse = (
  error: AppError,
  path: string,
  requestId: string,
): ErrorEnvelope => ({
  success: false,
  statusCode: error.statusCode,
  code: error.code,
  message: error.message,
  errors: error.errors?.length === 0 ? undefined : error.errors,
  requestId,
  timestamp: error.timestamp,
  path,
});

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error: unknown,
  request,
  response,
  _next,
) => {
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else {
    appError = mapPrismaError(error);
  }

  const logContext = {
    code: appError.code,
    requestId: request.requestId,
    statusCode: appError.statusCode,
    ...(appError.isOperational ? {} : { error: safeErrorDiagnostic(error) }),
  };

  if (appError.isOperational) {
    request.log.warn(logContext, appError.message);
  } else {
    request.log.error(logContext, appError.message);
  }

  return response
    .status(appError.statusCode)
    .json(createErrorResponse(appError, request.path, request.requestId));
};

export const errorHandler = errorHandlerMiddleware;

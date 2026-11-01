import type { RequestHandler } from "express";

import { publicContentRouteIdentity } from "../infrastructure/logger/request-sanitizer.js";
import { NotFoundException } from "../core/errors/not-found.error.js";

export const notFoundMiddleware: RequestHandler = (
  request,
  _response,
  next,
) => {
  next(
    new NotFoundException(
      publicContentRouteIdentity(request.originalUrl) !== undefined
        ? "Resource not found."
        : `Route ${request.method} ${request.path} not found.`,
    ),
  );
};

export const notFound = notFoundMiddleware;

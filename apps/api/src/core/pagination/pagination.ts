import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_MAX_LIMIT,
  type PaginationMeta,
  type PaginationQuery as SharedPaginationQuery,
} from "@fury/contracts";

import { BadRequestException } from "../errors/bad-request.error.js";

export const DEFAULT_PAGE = PAGINATION_DEFAULT_PAGE;
export const DEFAULT_LIMIT = PAGINATION_DEFAULT_LIMIT;
export const MAX_LIMIT = PAGINATION_MAX_LIMIT;

export interface PaginationQuery {
  readonly page: number;
  readonly limit: number;
  readonly skip: number;
  readonly take: number;
}

export class PaginationValidationError extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = "PaginationValidationError";
  }
}

export const parsePagination = (
  input: SharedPaginationQuery,
): PaginationQuery => {
  const { page, limit } = input;
  const skip = (page - 1) * limit;
  if (!Number.isSafeInteger(skip)) {
    throw new PaginationValidationError(
      "page * limit must fit in a safe integer range",
    );
  }
  return { page, limit, skip, take: limit };
};

export const buildPaginationMeta = ({
  page,
  limit,
  total: rawTotal,
}: Readonly<{
  page: number;
  limit: number;
  total: number;
}>): PaginationMeta => {
  const total = Math.max(0, Math.floor(rawTotal));
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

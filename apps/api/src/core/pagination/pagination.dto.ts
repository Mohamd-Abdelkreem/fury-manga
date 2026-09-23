import {
  paginationQuerySchema,
  type PaginationQuery as SharedPaginationQuery,
} from "@fury/contracts";

import { parsePagination, type PaginationQuery } from "./pagination.js";

export const paginationQueryFields = {
  page: paginationQuerySchema.shape.page,
  limit: paginationQuerySchema.shape.limit,
} as const;

export type PaginationQueryFields = SharedPaginationQuery;

export const parsePaginationQuery = (input: unknown): PaginationQuery =>
  parsePagination(paginationQuerySchema.parse(input));

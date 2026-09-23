import { Prisma } from "@fury/database";

import {
  ContentConflictException,
  ContentStaleWriteException,
} from "./content.errors.js";

export const isTransactionConflict = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  (error.code === "P2034" ||
    error.message.includes("40P01") ||
    error.message.includes("40001"));

export const rethrowWriteConflict = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") throw new ContentConflictException();
    if (isTransactionConflict(error)) {
      throw new ContentStaleWriteException();
    }
  }
  throw error;
};

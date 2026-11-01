import { Prisma } from "@fury/database";

import {
  ContentConflictException,
  ContentFeaturedConflictException,
  ContentStaleWriteException,
} from "./content.errors.js";

export const isTransactionConflict = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  (error.code === "P2034" ||
    error.message.includes("40P01") ||
    error.message.includes("40001"));

const uniqueConflictFields = (error: unknown): readonly unknown[] => {
  if (
    !(error instanceof Prisma.PrismaClientKnownRequestError) ||
    error.code !== "P2002"
  )
    return [];
  const adapter = error.meta?.["driverAdapterError"];
  const cause =
    typeof adapter === "object" && adapter !== null && "cause" in adapter
      ? adapter.cause
      : null;
  const constraint =
    typeof cause === "object" && cause !== null && "constraint" in cause
      ? cause.constraint
      : null;
  const fields =
    typeof constraint === "object" &&
    constraint !== null &&
    "fields" in constraint
      ? constraint.fields
      : null;
  return Array.isArray(fields) ? fields : [];
};

export const isFeaturedPositionConflict = (error: unknown): boolean => {
  const fields = uniqueConflictFields(error);
  return fields.length === 1 && fields[0] === "featured_order";
};

export const isWorkSlugConflict = (error: unknown): boolean => {
  const fields = uniqueConflictFields(error);
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.meta?.["modelName"] === "Work" &&
    fields.length === 1 &&
    fields[0] === "slug"
  );
};

export const rethrowWriteConflict = (error: unknown): never => {
  if (isFeaturedPositionConflict(error))
    throw new ContentFeaturedConflictException();
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") throw new ContentConflictException();
    if (isTransactionConflict(error)) {
      throw new ContentStaleWriteException();
    }
  }
  throw error;
};

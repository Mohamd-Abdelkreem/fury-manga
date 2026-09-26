import { AppError } from "../../core/errors/app.error.js";
import { BadRequestException } from "../../core/errors/bad-request.error.js";
import { ConflictException } from "../../core/errors/conflict.error.js";
import { InternalServerError } from "../../core/errors/internal-server.error.js";
import { NotFoundException } from "../../core/errors/not-found.error.js";
import { ServiceUnavailableException } from "../../core/errors/service-unavailable.error.js";
import {
  ContentConflictException,
  ContentImmutableException,
  ContentTransitionConflictException,
  ContentTypeConflictException,
} from "../../modules/content/content.errors.js";

const connectivityCodes = new Set([
  "P1000",
  "P1001",
  "P1002",
  "P1003",
  "P1008",
  "P1009",
  "P1010",
  "P1011",
  "P1012",
  "P1013",
  "P1014",
  "P1015",
  "P1016",
  "P1017",
]);

const approvedCheckConstraints = new Set([
  "ck_users_email_normalized",
  "ck_users_status_timestamps_consistent",
]);

const immutableContentConstraints = new Set([
  "ck_categories_identity_immutable",
  "ck_chapters_identity_immutable",
  "ck_works_identity_immutable",
]);

const typeContentConstraints = new Set([
  "ck_chapter_pages_illustrated_parent",
  "ck_chapters_parent_content_type",
]);

const transitionContentConstraints = new Set([
  "ck_chapters_current_publication_event",
  "ck_chapters_illustrated_publication_ready",
  "ck_works_current_publication_event",
]);

const contentConflictConstraints = new Set([
  "ck_work_categories_max_100",
  "ck_work_categories_enabled_assignment",
  "ck_categories_display_name_nonblank",
  "ck_categories_slug_normalized",
  "ck_categories_version_nonnegative",
  "ck_chapter_pages_position_positive",
  "ck_chapters_content_consistent",
  "ck_chapters_number_positive",
  "ck_chapters_publication_consistent",
  "ck_chapters_version_nonnegative",
  "ck_publication_events_immutable",
  "ck_publication_events_one_target",
  "ck_works_publication_consistent",
  "ck_works_slug_normalized",
  "ck_works_title_nonblank",
  "ck_works_version_nonnegative",
]);

const contentUniqueConstraints = new Set([
  "categories_slug_key",
  "chapter_pages_chapter_id_position_key",
  "chapters_work_id_number_key",
  "work_categories_pkey",
  "works_slug_key",
]);

const mappedCodes = new Set([
  "P2002",
  "P2003",
  "P2004",
  "P2009",
  "P2014",
  "P2025",
  "P2034",
  "P2039",
  ...connectivityCodes,
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const isAllowlistedPrismaCode = (value: unknown): value is string =>
  typeof value === "string" && mappedCodes.has(value);

const containsApprovedConstraint = (value: unknown): boolean => {
  if (typeof value === "string") {
    return [...approvedCheckConstraints].some((name) => value.includes(name));
  }
  if (Array.isArray(value)) return value.some(containsApprovedConstraint);
  if (!isRecord(value)) return false;
  return Object.values(value).some(containsApprovedConstraint);
};

const containsConstraint = (
  value: unknown,
  constraints: ReadonlySet<string>,
): boolean => {
  if (typeof value === "string") {
    return [...constraints].some((name) => value.includes(name));
  }
  if (Array.isArray(value)) {
    return value.some((item) => containsConstraint(item, constraints));
  }
  if (!isRecord(value)) return false;
  return Object.values(value).some((item) =>
    containsConstraint(item, constraints),
  );
};

export const mapPrismaError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  if (!isRecord(error)) return new InternalServerError();

  const code = error["code"];
  if (code === "P2002") {
    if (containsConstraint(error["meta"], contentUniqueConstraints)) {
      return new ContentConflictException();
    }
    return new ConflictException(
      "A unique constraint prevents this operation.",
    );
  }
  if (code === "P2003" || code === "P2014") {
    return new ConflictException("A related record prevents this operation.");
  }
  if (code === "P2025") {
    return new NotFoundException("The requested record was not found.");
  }
  if (code === "P2034") {
    return new ConflictException(
      "A conflicting transaction is in progress. Retry the request.",
    );
  }
  if (code === "P2039" && isRecord(error["meta"])) {
    const adapterError = error["meta"]["driverAdapterError"];
    const cause = isRecord(adapterError) ? adapterError["cause"] : null;
    if (
      isRecord(cause) &&
      (cause["originalCode"] === "PZ100" || cause["originalCode"] === "PZ101")
    ) {
      return new ContentConflictException();
    }
  }
  if (
    (code === "P2004" || code === "P2009") &&
    containsConstraint(error["meta"], immutableContentConstraints)
  ) {
    return new ContentImmutableException();
  }
  if (
    (code === "P2004" || code === "P2009") &&
    containsConstraint(error["meta"], typeContentConstraints)
  ) {
    return new ContentTypeConflictException();
  }
  if (
    (code === "P2004" || code === "P2009") &&
    containsConstraint(error["meta"], transitionContentConstraints)
  ) {
    return new ContentTransitionConflictException();
  }
  if (
    (code === "P2004" || code === "P2009") &&
    containsConstraint(error["meta"], contentConflictConstraints)
  ) {
    return new ContentConflictException();
  }
  if (
    (code === "P2004" || code === "P2009") &&
    containsApprovedConstraint(error["meta"])
  ) {
    return new BadRequestException(
      "A database constraint rejected the submitted value.",
    );
  }
  if (typeof code === "string" && connectivityCodes.has(code)) {
    return new ServiceUnavailableException(
      "The database is not currently available.",
    );
  }

  const message = error["message"];
  if (
    typeof message === "string" &&
    ["Can't reach database server", "ECONNREFUSED", "ENOTFOUND"].some(
      (fragment) => message.includes(fragment),
    )
  ) {
    return new ServiceUnavailableException(
      "The database is not currently available.",
    );
  }

  return new InternalServerError();
};

import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { AppError } from "../../core/errors/app.error.js";
import type { ContentErrorCode } from "@fury/contracts";

class ContentException extends AppError {
  constructor(code: ContentErrorCode, message: string) {
    super(message, HTTP_STATUS.CONFLICT, code);
    this.name = "ContentException";
  }
}

export class ContentConflictException extends ContentException {
  constructor(message = "The content conflicts with an existing record.") {
    super("CONTENT_CONFLICT", message);
    this.name = "ContentConflictException";
  }
}

export class ContentImmutableException extends ContentException {
  constructor(message = "An immutable content field cannot be changed.") {
    super("CONTENT_IMMUTABLE", message);
    this.name = "ContentImmutableException";
  }
}

export class ContentTypeConflictException extends ContentException {
  constructor(message = "The chapter content does not match its Work type.") {
    super("CONTENT_TYPE_CONFLICT", message);
    this.name = "ContentTypeConflictException";
  }
}

export class ContentTransitionConflictException extends ContentException {
  constructor(
    message = "The requested publication transition is not allowed.",
  ) {
    super("CONTENT_TRANSITION_CONFLICT", message);
    this.name = "ContentTransitionConflictException";
  }
}

export class ContentStaleWriteException extends ContentException {
  constructor(message = "The content changed before this request completed.") {
    super("CONTENT_STALE_WRITE", message);
    this.name = "ContentStaleWriteException";
  }
}

export class ContentCategoryInUseException extends ContentException {
  constructor(
    message = "The Category cannot be disabled while it is required by a published Work.",
  ) {
    super("CONTENT_CATEGORY_IN_USE", message);
    this.name = "ContentCategoryInUseException";
  }
}

export class ContentNotReadyException extends AppError {
  constructor(
    fields: readonly string[],
    resource: "Work" | "Chapter" = "Work",
  ) {
    super(
      `The ${resource} is not ready for publication.`,
      HTTP_STATUS.CONFLICT,
      "CONTENT_NOT_READY",
      true,
      fields.map((field) => ({
        field: `body.${field}`,
        message: "Required for publication.",
      })),
    );
    this.name = "ContentNotReadyException";
  }
}

export class ContentFeaturedConflictException extends ContentException {
  constructor() {
    super(
      "CONTENT_FEATURED_CONFLICT",
      "The featured position is already occupied.",
    );
    this.name = "ContentFeaturedConflictException";
  }
}

export class ContentInvalidCategoryPositionException extends AppError {
  constructor() {
    super(
      "Choose the current or an adjacent Category position.",
      HTTP_STATUS.BAD_REQUEST,
      "VALIDATION_ERROR",
      true,
      [
        {
          field: "body.targetPosition",
          message: "Choose the current or an adjacent Category position.",
        },
      ],
    );
    this.name = "ContentInvalidCategoryPositionException";
  }
}

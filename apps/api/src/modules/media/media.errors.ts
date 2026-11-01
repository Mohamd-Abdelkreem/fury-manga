import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { AppError } from "../../core/errors/app.error.js";

export { MediaUnavailableException } from "../../infrastructure/media/media.errors.js";

export class MediaVersionConflictException extends AppError {
  constructor() {
    super(
      "Media reference is stale.",
      HTTP_STATUS.CONFLICT,
      "VERSION_CONFLICT",
    );
    this.name = "MediaVersionConflictException";
  }
}
export class MediaAssetNotFoundException extends AppError {
  constructor() {
    super("Media asset not found.", HTTP_STATUS.NOT_FOUND, "NOT_FOUND");
    this.name = "MediaAssetNotFoundException";
  }
}

export class MediaTargetNotFoundException extends AppError {
  constructor() {
    super("Media target not found.", HTTP_STATUS.NOT_FOUND, "NOT_FOUND");
    this.name = "MediaTargetNotFoundException";
  }
}

export class MediaReferenceNotFoundException extends AppError {
  constructor() {
    super("Media reference not found.", HTTP_STATUS.NOT_FOUND, "NOT_FOUND");
    this.name = "MediaReferenceNotFoundException";
  }
}

export class UploadAttemptNotFoundException extends AppError {
  constructor() {
    super("Upload attempt not found.", HTTP_STATUS.NOT_FOUND, "NOT_FOUND");
    this.name = "UploadAttemptNotFoundException";
  }
}

export class MediaTargetConflictException extends AppError {
  constructor() {
    super(
      "Media target already has a reference.",
      HTTP_STATUS.CONFLICT,
      "MEDIA_TARGET_CONFLICT",
    );
    this.name = "MediaTargetConflictException";
  }
}

export class ChapterPageReferenceWriteException extends AppError {
  constructor() {
    super(
      "Edit the parent Chapter to change its pages.",
      HTTP_STATUS.CONFLICT,
      "MEDIA_TARGET_CONFLICT",
    );
    this.name = "ChapterPageReferenceWriteException";
  }
}

export class MediaInUseException extends AppError {
  constructor() {
    super("Media asset is in use.", HTTP_STATUS.CONFLICT, "MEDIA_IN_USE");
    this.name = "MediaInUseException";
  }
}

export class UploadAttemptConflictException extends AppError {
  constructor() {
    super(
      "Upload attempt key conflicts with its prior result.",
      HTTP_STATUS.CONFLICT,
      "UPLOAD_ATTEMPT_CONFLICT",
    );
    this.name = "UploadAttemptConflictException";
  }
}

export class UploadInProgressException extends AppError {
  constructor() {
    super(
      "Upload attempt is still pending.",
      HTTP_STATUS.CONFLICT,
      "UPLOAD_IN_PROGRESS",
    );
    this.name = "UploadInProgressException";
  }
}

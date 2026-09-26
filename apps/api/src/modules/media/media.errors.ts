import { AppError } from "../../core/errors/app.error.js";

export class MediaUnavailableException extends AppError {
  constructor() {
    super("Media storage is unavailable.", 503, "MEDIA_UNAVAILABLE");
    this.name = "MediaUnavailableException";
  }
}

export class MediaVersionConflictException extends AppError {
  constructor() {
    super("Media reference is stale.", 409, "VERSION_CONFLICT");
    this.name = "MediaVersionConflictException";
  }
}

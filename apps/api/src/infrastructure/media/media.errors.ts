import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { AppError } from "../../core/errors/app.error.js";

export class MediaUnavailableException extends AppError {
  constructor() {
    super(
      "Media storage is unavailable.",
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      "MEDIA_UNAVAILABLE",
    );
    this.name = "MediaUnavailableException";
  }
}

export class MediaInvalidImageException extends AppError {
  constructor() {
    super(
      "The image is invalid for this media class.",
      400,
      "MEDIA_INVALID_FILE",
    );
  }
}

export class MediaUnsupportedImageException extends AppError {
  constructor() {
    super(
      "Unsupported or mismatched image type.",
      415,
      "MEDIA_UNSUPPORTED_TYPE",
    );
  }
}

export class MediaImageLimitException extends AppError {
  constructor() {
    super(
      "Image size or dimensions exceed the limit.",
      413,
      "MEDIA_LIMIT_EXCEEDED",
    );
  }
}

export class MediaImageProcessingBusyException extends AppError {
  constructor() {
    super(
      "Image processing capacity is busy.",
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      "MEDIA_PROCESSING_BUSY",
    );
  }
}

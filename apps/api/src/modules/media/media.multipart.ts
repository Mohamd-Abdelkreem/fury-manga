import type { Request } from "express";

import busboy from "busboy";

import {
  mediaClassSchema,
  mediaUploadHeaderSchema,
  type MediaClass,
} from "@fury/contracts";

import { AppError } from "../../core/errors/app.error.js";
import { ValidationException } from "../../core/errors/validation.error.js";
import { maxSourceBytesForClass } from "../../infrastructure/media/image-validation.js";

export type ParsedMediaUpload = Readonly<{
  attemptId: string;
  mediaClass: MediaClass;
  source: Buffer;
  sourceName: string;
  declaredType: string;
}>;

const MIB = 1024 * 1024;
const MAX_FILE_BYTES = 12 * MIB;

const invalid = (field: string, message: string): ValidationException =>
  new ValidationException([{ field, message }]);

export const parseMediaUpload = async <TReservation>(
  request: Request,
  reserve: (attemptId: string, mediaClass: MediaClass) => Promise<TReservation>,
): Promise<ParsedMediaUpload & { reservation: TReservation }> => {
  const header = mediaUploadHeaderSchema.safeParse({
    "idempotency-key": request.get("Idempotency-Key"),
  });
  if (!header.success)
    throw invalid("headers.idempotency-key", "A canonical UUID is required.");
  const contentType = request.get("Content-Type") ?? "";
  if (!/^multipart\/form-data(?:;|$)/iu.test(contentType)) {
    throw invalid("body.file", "Multipart form data is required.");
  }

  return await new Promise<ParsedMediaUpload & { reservation: TReservation }>(
    (resolve, reject) => {
      let parser: ReturnType<typeof busboy>;
      try {
        parser = busboy({
          headers: request.headers,
          preservePath: true,
          limits: {
            fields: 1,
            files: 1,
            // Busboy emits partsLimit when the configured count is reached, so
            // the parser limit includes one sentinel part; partCount enforces two.
            parts: 3,
            fieldNameSize: 50,
            fieldSize: 64,
            headerPairs: 20,
            fileSize: MAX_FILE_BYTES,
          },
        });
      } catch {
        reject(invalid("body.file", "Invalid multipart request."));
        return;
      }

      let mediaClass: MediaClass | undefined;
      let sourceName: string | undefined;
      let declaredType: string | undefined;
      let fileSeen = false;
      let partCount = 0;
      let byteLength = 0;
      let failure: AppError | undefined;
      let reservation: Promise<TReservation> | undefined;
      const chunks: Buffer[] = [];

      parser.on("field", (name, field, info) => {
        partCount += 1;
        if (partCount > 2)
          failure ??= invalid(
            "body.file",
            "Unexpected multipart field or file.",
          );
        const parsed = mediaClassSchema.safeParse(field);
        if (
          name !== "mediaClass" ||
          mediaClass !== undefined ||
          fileSeen ||
          info.nameTruncated ||
          info.valueTruncated ||
          !parsed.success
        ) {
          failure ??= invalid(
            "body.mediaClass",
            "A supported media class must precede the file.",
          );
          return;
        }
        mediaClass = parsed.data;
        reservation = reserve(header.data["idempotency-key"], mediaClass).catch(
          (error: unknown) => {
            failure ??=
              error instanceof AppError
                ? error
                : new AppError(
                    "Media storage is unavailable.",
                    503,
                    "SERVICE_UNAVAILABLE",
                  );
            throw failure;
          },
        );
      });
      parser.on("file", (name, stream, info) => {
        stream.on("error", () => {
          failure ??= invalid("body.file", "Invalid multipart request.");
        });
        partCount += 1;
        if (partCount > 2)
          failure ??= invalid(
            "body.file",
            "Unexpected multipart field or file.",
          );
        fileSeen = true;
        if (
          name !== "file" ||
          mediaClass === undefined ||
          sourceName !== undefined
        ) {
          failure ??= invalid(
            mediaClass === undefined ? "body.mediaClass" : "body.file",
            mediaClass === undefined
              ? "A supported media class must precede the file."
              : "Exactly one file must follow the media class.",
          );
        }
        sourceName = info.filename;
        declaredType = info.mimeType;
        stream.pause();
        void (
          reservation ??
          Promise.reject(
            invalid(
              "body.mediaClass",
              "A supported media class must precede the file.",
            ),
          )
        )
          .then(() => {
            stream.on("data", (chunk: Buffer) => {
              byteLength += chunk.length;
              if (
                byteLength >
                (mediaClass === undefined
                  ? MAX_FILE_BYTES
                  : maxSourceBytesForClass(mediaClass))
              ) {
                failure ??= new AppError(
                  "Image exceeds the upload limit.",
                  413,
                  "MEDIA_LIMIT_EXCEEDED",
                );
              }
              if (failure === undefined) chunks.push(chunk);
            });
            stream.on("limit", () => {
              failure ??= new AppError(
                "Image exceeds the upload limit.",
                413,
                "MEDIA_LIMIT_EXCEEDED",
              );
            });
            stream.resume();
          })
          .catch(() => {
            stream.resume();
          });
      });
      const tooManyParts = () => {
        failure ??= invalid("body.file", "Unexpected multipart field or file.");
      };
      parser.on("fieldsLimit", () => {
        failure ??= invalid(
          "body.mediaClass",
          "Exactly one media class field is required.",
        );
      });
      parser.on("filesLimit", tooManyParts);
      parser.on("partsLimit", tooManyParts);
      parser.on("error", () => {
        failure ??= invalid("body.file", "Invalid multipart request.");
      });
      const finalize = async () => {
        if (failure !== undefined) {
          reject(failure);
        } else if (mediaClass === undefined) {
          reject(
            invalid(
              "body.mediaClass",
              "A supported media class must precede the file.",
            ),
          );
        } else if (
          !fileSeen ||
          sourceName === undefined ||
          declaredType === undefined ||
          byteLength === 0
        ) {
          reject(
            invalid(
              "body.file",
              "A media class and nonempty file are required.",
            ),
          );
        } else if (reservation === undefined) {
          reject(
            invalid(
              "body.mediaClass",
              "A supported media class must precede the file.",
            ),
          );
        } else {
          let reserved: TReservation;
          try {
            reserved = await reservation;
          } catch (error) {
            reject(
              error instanceof AppError
                ? error
                : new AppError(
                    "Media storage is unavailable.",
                    503,
                    "SERVICE_UNAVAILABLE",
                  ),
            );
            return;
          }
          resolve({
            attemptId: header.data["idempotency-key"],
            mediaClass,
            source: Buffer.concat(chunks),
            sourceName,
            declaredType,
            reservation: reserved,
          });
        }
      };
      parser.on("close", () => {
        void finalize();
      });
      request.once("aborted", () => {
        failure ??= invalid("body.file", "Upload was interrupted.");
        request.unpipe(parser);
        parser.destroy();
      });
      request.pipe(parser);
    },
  );
};

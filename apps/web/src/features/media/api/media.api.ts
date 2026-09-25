import {
  errorEnvelopeSchema,
  mediaAssetListResponseSchema,
  mediaAssetResponseSchema,
  mediaAttemptResponseSchema,
  mediaOperationErrorCodeSchema,
  mediaRemovalResponseSchema,
  mediaReferenceLookupResponseSchema,
  mediaReferenceResponseSchema,
  mediaReferenceRetirementResponseSchema,
  type MediaAssetDto,
  type MediaClass,
  type MediaReferenceCreate,
  type MediaReferenceReplace,
  type MediaReferenceRetire,
  type MediaReferenceTargetKind,
} from "@fury/contracts";
import axios from "axios";

import { apiClient, getApiError } from "@/services/api/api-client";

export class SafeMediaError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly requestId: string;

  constructor(code: string, statusCode: number, requestId: string) {
    super("تعذر إكمال طلب الوسائط. حاول مرة أخرى.");
    this.name = "SafeMediaError";
    this.code = code;
    this.statusCode = statusCode;
    this.requestId = requestId;
  }
}

const safeMediaError = (error: unknown): SafeMediaError => {
  const received = getApiError(error);
  const parsedCode = mediaOperationErrorCodeSchema.safeParse(received.code);
  return new SafeMediaError(
    parsedCode.success ? parsedCode.data : "HTTP_ERROR",
    received.statusCode,
    received.requestId,
  );
};

const safeRequest = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    throw safeMediaError(error);
  }
};

const safeBinaryRequest = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
      try {
        const parsed = errorEnvelopeSchema.safeParse(
          JSON.parse(await error.response.data.text()) as unknown,
        );
        if (parsed.success) {
          const code = mediaOperationErrorCodeSchema.safeParse(
            parsed.data.code,
          );
          throw new SafeMediaError(
            code.success ? code.data : "HTTP_ERROR",
            parsed.data.statusCode,
            parsed.data.requestId,
          );
        }
      } catch (blobError) {
        if (blobError instanceof SafeMediaError) throw blobError;
      }
    }
    throw safeMediaError(error);
  }
};

type UploadOptions = Readonly<{
  signal?: AbortSignal;
  onProgress?: (percent: number) => void;
}>;

export const mediaApi = {
  upload(
    mediaClass: MediaClass,
    file: File,
    attemptId: string,
    options: UploadOptions = {},
  ): Promise<MediaAssetDto> {
    return safeRequest(async () => {
      const form = new FormData();
      form.append("mediaClass", mediaClass);
      form.append("file", file);
      const response = await apiClient.post("/media/assets", form, {
        headers: { "Idempotency-Key": attemptId },
        ...(options.signal ? { signal: options.signal } : {}),
        onUploadProgress: (event) => {
          if (event.total !== undefined && event.total > 0) {
            options.onProgress?.(
              Math.min(100, Math.round((event.loaded / event.total) * 100)),
            );
          }
        },
      });
      return mediaAssetResponseSchema.parse(response.data).data;
    });
  },

  getAttempt(attemptId: string, signal?: AbortSignal) {
    return safeRequest(async () => {
      const response = await apiClient.get(`/media/uploads/${attemptId}`, {
        ...(signal ? { signal } : {}),
      });
      return mediaAttemptResponseSchema.parse(response.data).data;
    });
  },

  getAsset(assetId: string, signal?: AbortSignal) {
    return safeRequest(async () => {
      const response = await apiClient.get(`/media/assets/${assetId}`, {
        ...(signal ? { signal } : {}),
      });
      return mediaAssetResponseSchema.parse(response.data).data;
    });
  },

  listAdmin(mediaClass: Exclude<MediaClass, "user_avatar">, page = 1) {
    return safeRequest(async () => {
      const response = await apiClient.get("/media/assets", {
        params: { scope: "admin", mediaClass, page },
      });
      return mediaAssetListResponseSchema.parse(response.data).data;
    });
  },

  listMine(page = 1) {
    return safeRequest(async () => {
      const response = await apiClient.get("/media/assets", {
        params: { scope: "mine", mediaClass: "user_avatar", page },
      });
      return mediaAssetListResponseSchema.parse(response.data).data;
    });
  },

  removeAvatar(assetId: string) {
    return safeRequest(async () => {
      const response = await apiClient.delete(`/media/assets/${assetId}`);
      return mediaRemovalResponseSchema.parse(response.data).data;
    });
  },

  getReference(targetKind: MediaReferenceTargetKind, targetId: string) {
    return safeRequest(async () => {
      const response = await apiClient.get("/media/references", {
        params: { targetKind, targetId },
      });
      return mediaReferenceLookupResponseSchema.parse(response.data).data;
    });
  },

  bindReference(command: MediaReferenceCreate) {
    return safeRequest(async () => {
      const response = await apiClient.post("/media/references", command);
      return mediaReferenceResponseSchema.parse(response.data).data;
    });
  },

  replaceReference(referenceId: string, command: MediaReferenceReplace) {
    return safeRequest(async () => {
      const response = await apiClient.put(
        `/media/references/${referenceId}`,
        command,
      );
      return mediaReferenceResponseSchema.parse(response.data).data;
    });
  },

  retireReference(referenceId: string, command: MediaReferenceRetire) {
    return safeRequest(async () => {
      const response = await apiClient.delete(
        `/media/references/${referenceId}`,
        { data: command },
      );
      return mediaReferenceRetirementResponseSchema.parse(response.data).data;
    });
  },

  readContent(assetId: string, signal?: AbortSignal): Promise<Blob> {
    return safeBinaryRequest(async () => {
      const response = await apiClient.get<Blob>(
        `/media/assets/${assetId}/content`,
        {
          responseType: "blob",
          ...(signal ? { signal } : {}),
        },
      );
      return response.data;
    });
  },
};

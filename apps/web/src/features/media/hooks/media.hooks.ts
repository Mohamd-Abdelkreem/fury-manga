"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  MediaAssetDto,
  MediaClass,
  MediaReferenceCreate,
  MediaReferenceReplace,
  MediaReferenceRetire,
  MediaReferenceTargetKind,
} from "@fury/contracts";

import { useSession } from "@/features/auth/hooks/auth.hooks";

import { mediaApi, SafeMediaError } from "../api/media.api";
import { mediaKeys } from "../model/media.keys";

type AdminClass = Exclude<MediaClass, "user_avatar">;

const useAdminActor = () => {
  const session = useSession();
  const user = session.data?.user;
  return user?.role === "ADMIN" &&
    user.status === "ACTIVE" &&
    user.emailVerifiedAt !== null
    ? user.id
    : null;
};

const useOwnerActor = () => {
  const user = useSession().data?.user;
  return user?.status === "ACTIVE" && user.emailVerifiedAt !== null
    ? user.id
    : null;
};

export const useAdminMediaList = (mediaClass: AdminClass, page = 1) => {
  const actorId = useAdminActor();
  return useQuery({
    queryKey: mediaKeys.list(actorId ?? "anonymous", mediaClass, page),
    queryFn: () => mediaApi.listAdmin(mediaClass, page),
    enabled: actorId !== null,
    retry: false,
  });
};

export const useOwnAvatarMediaList = (page = 1) => {
  const actorId = useOwnerActor();
  return useQuery({
    queryKey: mediaKeys.list(actorId ?? "anonymous", "user_avatar", page),
    queryFn: () => mediaApi.listMine(page),
    enabled: actorId !== null,
    retry: false,
  });
};

export const useAdminMediaAttempt = (attemptId: string | null) => {
  const actorId = useAdminActor();
  return useQuery({
    queryKey: mediaKeys.attempt(actorId ?? "anonymous", attemptId ?? "none"),
    queryFn: () => mediaApi.getAttempt(attemptId ?? ""),
    enabled: actorId !== null && attemptId !== null,
    retry: false,
  });
};

export const useAdminMediaReference = (
  targetKind: MediaReferenceTargetKind,
  targetId: string | null,
) => {
  const actorId = useAdminActor();
  const queryClient = useQueryClient();
  const key = mediaKeys.reference(
    actorId ?? "anonymous",
    targetKind,
    targetId ?? "none",
  );
  const query = useQuery({
    queryKey: key,
    queryFn: () => mediaApi.getReference(targetKind, targetId ?? ""),
    enabled: actorId !== null && targetId !== null,
    retry: false,
  });
  const invalidate = async () => {
    if (actorId !== null) {
      await queryClient.invalidateQueries({ queryKey: key });
    }
  };
  const invalidateAssets = async (...assetIds: string[]) => {
    if (actorId === null) return;
    await Promise.all(
      assetIds.map((assetId) =>
        queryClient.invalidateQueries({
          queryKey: mediaKeys.asset(actorId, assetId),
        }),
      ),
    );
  };
  const bind = useMutation({
    mutationFn: (command: MediaReferenceCreate) =>
      mediaApi.bindReference(command),
    onSuccess: async (reference) => {
      await Promise.all([invalidate(), invalidateAssets(reference.assetId)]);
    },
    retry: false,
  });
  const replace = useMutation({
    mutationFn: ({
      referenceId,
      command,
    }: {
      referenceId: string;
      command: MediaReferenceReplace;
    }) => mediaApi.replaceReference(referenceId, command),
    onSuccess: async (reference, variables) => {
      await Promise.all([
        invalidate(),
        invalidateAssets(variables.command.expectedAssetId, reference.assetId),
      ]);
    },
    retry: false,
  });
  const retire = useMutation({
    mutationFn: ({
      referenceId,
      command,
    }: {
      referenceId: string;
      command: MediaReferenceRetire;
    }) => mediaApi.retireReference(referenceId, command),
    onSuccess: async (_retired, variables) => {
      await Promise.all([
        invalidate(),
        invalidateAssets(variables.command.expectedAssetId),
      ]);
    },
    retry: false,
  });
  return { query, bind, replace, retire, available: actorId !== null };
};

const useMediaUpload = (mediaClass: MediaClass, actorId: string | null) => {
  const queryClient = useQueryClient();
  const requests = useRef(
    new Map<
      string,
      Readonly<{
        file: File;
        signal: AbortSignal;
        onProgress: (percent: number) => void;
      }>
    >(),
  );
  const mutation = useMutation({
    mutationFn: ({ attemptId }: { attemptId: string }) => {
      if (actorId === null) throw new Error("Active session required.");
      const request = requests.current.get(attemptId);
      if (request === undefined)
        throw new Error("Transient upload request is unavailable.");
      return mediaApi.upload(mediaClass, request.file, attemptId, {
        signal: request.signal,
        onProgress: request.onProgress,
      });
    },
    onSuccess: async (asset, _variables) => {
      if (actorId !== null) {
        queryClient.setQueryData(mediaKeys.asset(actorId, asset.id), asset);
        await queryClient.invalidateQueries({
          queryKey: mediaKeys.listScope(actorId, mediaClass),
        });
      }
    },
    retry: false,
    gcTime: 0,
  });
  const execute = async (
    attemptId: string,
    request: Readonly<{
      file: File;
      signal: AbortSignal;
      onProgress: (percent: number) => void;
    }>,
  ) => {
    requests.current.set(attemptId, request);
    try {
      return await mutation.mutateAsync({ attemptId });
    } finally {
      requests.current.delete(attemptId);
    }
  };
  return { execute, actorId };
};

export const useAdminMediaUpload = (mediaClass: AdminClass) =>
  useMediaUpload(mediaClass, useAdminActor());

type CandidateState = Readonly<{
  phase: "idle" | "uploading" | "processing" | "pending" | "accepted" | "error";
  progress: number;
  assetId: string | null;
  previewUrl: string | null;
  previewKind: "temporary" | "accepted" | null;
  errorCode: string | null;
  retryMode: "check_attempt" | "new_attempt" | null;
}>;

const initialCandidate: CandidateState = {
  phase: "idle",
  progress: 0,
  assetId: null,
  previewUrl: null,
  previewKind: null,
  errorCode: null,
  retryMode: null,
};

const useMediaCandidate = (
  mediaClass: MediaClass,
  actorId: string | null,
  candidateScope: "admin" | "owner",
) => {
  const upload = useMediaUpload(mediaClass, actorId);
  const queryClient = useQueryClient();
  const [state, setState] = useState<CandidateState>(initialCandidate);
  const current = useRef<{
    actorId: string | null;
    attemptId: string | null;
    controller: AbortController | null;
    readController: AbortController | null;
    selectedFile: File | null;
    previewUrl: string | null;
    generation: number;
  }>({
    actorId: upload.actorId,
    attemptId: null,
    controller: null,
    readController: null,
    selectedFile: null,
    previewUrl: null,
    generation: 0,
  });

  const clear = () => {
    current.current.generation += 1;
    current.current.controller?.abort();
    current.current.controller = null;
    current.current.readController?.abort();
    current.current.readController = null;
    if (current.current.previewUrl !== null)
      URL.revokeObjectURL(current.current.previewUrl);
    current.current.selectedFile = null;
    current.current.previewUrl = null;
    current.current.attemptId = null;
    setState(initialCandidate);
  };

  const cancel = () => {
    if (
      current.current.controller === null ||
      (state.phase !== "uploading" && state.phase !== "processing")
    ) {
      return;
    }
    current.current.generation += 1;
    current.current.controller.abort();
    current.current.controller = null;
    setState((previous) => ({
      ...previous,
      phase: "pending",
      progress: 0,
      assetId: null,
      errorCode: null,
      retryMode: "check_attempt",
    }));
  };

  useEffect(() => {
    const active = current.current;
    if (current.current.actorId !== upload.actorId) {
      const previousActorId = current.current.actorId;
      current.current.actorId = upload.actorId;
      clear();
      if (previousActorId !== null) {
        queryClient.removeQueries({
          queryKey: mediaKeys.actor(previousActorId),
        });
      }
    }
    return () => {
      active.generation += 1;
      active.controller?.abort();
      active.readController?.abort();
      if (active.previewUrl !== null) URL.revokeObjectURL(active.previewUrl);
      active.selectedFile = null;
      active.previewUrl = null;
    };
  }, [queryClient, upload.actorId]);

  const createReadController = () => {
    current.current.readController?.abort();
    const controller = new AbortController();
    current.current.readController = controller;
    return controller;
  };

  const accept = async (
    assetId: string,
    generation: number,
    controller = createReadController(),
  ) => {
    try {
      const blob = await mediaApi.readContent(assetId, controller.signal);
      if (generation !== current.current.generation) return;
      const previewUrl = URL.createObjectURL(blob);
      if (current.current.previewUrl !== null)
        URL.revokeObjectURL(current.current.previewUrl);
      current.current.selectedFile = null;
      current.current.previewUrl = previewUrl;
      setState({
        phase: "accepted",
        progress: 100,
        assetId,
        previewUrl,
        previewKind: "accepted",
        errorCode: null,
        retryMode: null,
      });
    } finally {
      if (current.current.readController === controller)
        current.current.readController = null;
    }
  };

  const load = async (assetId: string) => {
    if (upload.actorId === null) return;
    clear();
    const generation = current.current.generation;
    const controller = createReadController();
    try {
      const asset = await queryClient.fetchQuery<MediaAssetDto>({
        queryKey: mediaKeys.asset(upload.actorId, assetId),
        queryFn: () => mediaApi.getAsset(assetId, controller.signal),
        staleTime: 30_000,
      });
      if (generation !== current.current.generation) return;
      await accept(asset.id, generation, controller);
    } catch (error) {
      if (generation !== current.current.generation) return;
      setState({
        ...initialCandidate,
        phase: "error",
        errorCode:
          error instanceof SafeMediaError ? error.code : "MEDIA_UNAVAILABLE",
        retryMode: null,
      });
    } finally {
      if (current.current.readController === controller)
        current.current.readController = null;
    }
  };

  const reconcile = async (attemptId: string, generation: number) => {
    const controller = createReadController();
    try {
      const attempt = await mediaApi.getAttempt(attemptId, controller.signal);
      if (generation !== current.current.generation) return;
      if (attempt.state === "accepted" && attempt.assetId !== null) {
        await accept(attempt.assetId, generation, controller);
      } else if (attempt.state === "pending") {
        setState((previous) => ({
          ...previous,
          phase: "pending",
          progress: 0,
          assetId: null,
          errorCode: null,
          retryMode: "check_attempt",
        }));
      } else {
        setState((previous) => ({
          ...previous,
          phase: "error",
          progress: 0,
          assetId: null,
          errorCode: attempt.safeFailureCode ?? "UPLOAD_INCOMPLETE",
          retryMode: "new_attempt",
        }));
      }
    } catch (error) {
      if (generation !== current.current.generation) return;
      const code =
        error instanceof SafeMediaError ? error.code : "MEDIA_UNAVAILABLE";
      setState((previous) => ({
        ...previous,
        phase: "error",
        progress: 0,
        assetId: null,
        errorCode: code,
        retryMode: code === "NOT_FOUND" ? "new_attempt" : "check_attempt",
      }));
    } finally {
      if (current.current.readController === controller)
        current.current.readController = null;
    }
  };

  const uploadSelectedFile = async (file: File) => {
    const generation = current.current.generation;
    const attemptId = crypto.randomUUID();
    const controller = new AbortController();
    current.current.attemptId = attemptId;
    current.current.controller = controller;
    setState({
      ...initialCandidate,
      phase: "uploading",
      previewUrl: current.current.previewUrl,
      previewKind: "temporary",
    });
    try {
      const asset = await upload.execute(attemptId, {
        file,
        signal: controller.signal,
        onProgress: (progress) => {
          if (generation === current.current.generation) {
            setState((previous) => ({
              ...previous,
              phase: progress >= 100 ? "processing" : "uploading",
              progress,
            }));
          }
        },
      });
      if (generation !== current.current.generation) return;
      current.current.controller = null;
      await accept(asset.id, generation);
    } catch (error) {
      if (generation !== current.current.generation) return;
      current.current.controller = null;
      const code =
        error instanceof SafeMediaError ? error.code : "MEDIA_UNAVAILABLE";
      if (
        code === "MEDIA_INVALID_FILE" ||
        code === "MEDIA_LIMIT_EXCEEDED" ||
        code === "MEDIA_UNSUPPORTED_TYPE" ||
        code === "UPLOAD_ATTEMPT_CONFLICT" ||
        code === "FORBIDDEN" ||
        code === "UNAUTHORIZED" ||
        code === "RATE_LIMIT_EXCEEDED"
      ) {
        const discardPrivateSelection =
          code === "FORBIDDEN" || code === "UNAUTHORIZED";
        if (discardPrivateSelection) {
          if (current.current.previewUrl !== null)
            URL.revokeObjectURL(current.current.previewUrl);
          current.current.previewUrl = null;
          current.current.selectedFile = null;
        }
        setState((previous) => ({
          ...previous,
          phase: "error",
          progress: 0,
          assetId: null,
          previewUrl: discardPrivateSelection ? null : previous.previewUrl,
          previewKind: discardPrivateSelection ? null : previous.previewKind,
          errorCode: code,
          retryMode: null,
        }));
      } else {
        await reconcile(attemptId, generation);
      }
    }
  };

  const select = async (file: File) => {
    if (upload.actorId === null) {
      setState({ ...initialCandidate, phase: "error", errorCode: "FORBIDDEN" });
      return;
    }
    clear();
    current.current.selectedFile = file;
    current.current.previewUrl = URL.createObjectURL(file);
    await uploadSelectedFile(file);
  };

  const checkAttempt = async () => {
    const attemptId = current.current.attemptId;
    if (attemptId !== null)
      await reconcile(attemptId, current.current.generation);
  };

  const retry = async () => {
    if (state.retryMode === "check_attempt") {
      await checkAttempt();
      return;
    }
    if (
      state.retryMode === "new_attempt" &&
      current.current.selectedFile !== null
    ) {
      current.current.generation += 1;
      current.current.controller?.abort();
      current.current.readController?.abort();
      current.current.readController = null;
      await uploadSelectedFile(current.current.selectedFile);
    }
  };

  const remove = async () => {
    if (candidateScope === "admin" || state.assetId === null) {
      clear();
      return;
    }
    const assetId = state.assetId;
    try {
      await mediaApi.removeAvatar(assetId);
      clear();
      if (upload.actorId !== null) {
        await queryClient.invalidateQueries({
          queryKey: mediaKeys.actor(upload.actorId),
        });
      }
    } catch (error) {
      setState((previous) => ({
        ...previous,
        phase: "error",
        errorCode:
          error instanceof SafeMediaError ? error.code : "MEDIA_UNAVAILABLE",
      }));
    }
  };

  return {
    state,
    attemptId: current.current.attemptId,
    select,
    cancel,
    clear,
    load,
    remove,
    checkAttempt,
    retry,
    available: upload.actorId !== null,
  };
};

export const useAdminMediaCandidate = (mediaClass: AdminClass) =>
  useMediaCandidate(mediaClass, useAdminActor(), "admin");

export const useAvatarMediaCandidate = () =>
  useMediaCandidate("user_avatar", useOwnerActor(), "owner");

import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SafeMediaError } from "../api/media.api";
import { mediaKeys } from "../model/media.keys";
import {
  useAdminMediaCandidate,
  useAdminMediaReference,
  useAvatarMediaCandidate,
} from "./media.hooks";

const mediaApiMock = vi.hoisted(() => ({
  upload: vi.fn(),
  getAttempt: vi.fn(),
  getAsset: vi.fn(),
  readContent: vi.fn(),
  listAdmin: vi.fn(),
  removeAvatar: vi.fn(),
  getReference: vi.fn(),
  bindReference: vi.fn(),
  replaceReference: vi.fn(),
  retireReference: vi.fn(),
}));

const sessionMock = vi.hoisted(() => ({
  id: "11111111-1111-4111-8111-111111111111",
  role: "ADMIN",
}));

vi.mock("../api/media.api", () => ({
  SafeMediaError: class extends Error {
    constructor(
      readonly code: string,
      readonly statusCode: number,
      readonly requestId: string,
    ) {
      super("safe media error");
    }
  },
  mediaApi: mediaApiMock,
}));

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({
    data: {
      user: {
        id: sessionMock.id,
        role: sessionMock.role,
        status: "ACTIVE",
        emailVerifiedAt: "2026-09-23T10:00:00.000Z",
      },
    },
  }),
}));

let queryClient: QueryClient;

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("administrator media query identity", () => {
  const revokeObjectUrl = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    URL.createObjectURL = vi.fn(() => "blob:private-preview");
    URL.revokeObjectURL = revokeObjectUrl;
    sessionMock.id = "11111111-1111-4111-8111-111111111111";
    sessionMock.role = "ADMIN";
  });

  it("scopes lists and attempts by actor, class, and page", () => {
    expect(mediaKeys.list("admin-one", "work_cover", 1)).not.toEqual(
      mediaKeys.list("admin-two", "work_cover", 1),
    );
    expect(mediaKeys.list("admin-one", "work_cover", 1)).not.toEqual(
      mediaKeys.list("admin-one", "work_background", 1),
    );
    expect(mediaKeys.list("admin-one", "work_cover", 1)).not.toEqual(
      mediaKeys.list("admin-one", "work_cover", 2),
    );
    expect(mediaKeys.attempt("admin-one", "key")).not.toEqual(
      mediaKeys.attempt("admin-two", "key"),
    );
    expect(mediaKeys.asset("admin-one", "asset-one")).not.toEqual(
      mediaKeys.asset("admin-two", "asset-one"),
    );
  });

  it("distinguishes completed transfer from server processing", async () => {
    let reportProgress: ((percent: number) => void) | undefined;
    let finish: ((asset: { id: string }) => void) | undefined;
    mediaApiMock.upload.mockImplementation(
      (
        _mediaClass: unknown,
        _file: unknown,
        _attemptId: unknown,
        options: { onProgress: (percent: number) => void },
      ) => {
        reportProgress = options.onProgress;
        return new Promise((resolve) => {
          finish = resolve;
        });
      },
    );
    mediaApiMock.readContent.mockResolvedValue(new Blob(["private"]));
    const { result } = renderHook(() => useAdminMediaCandidate("work_cover"), {
      wrapper,
    });

    let selection: Promise<void> | undefined;
    act(() => {
      selection = result.current.select(new File(["image"], "cover.jpg"));
    });
    await waitFor(() => {
      expect(reportProgress).toBeTypeOf("function");
    });
    act(() => {
      reportProgress?.(100);
    });
    expect(result.current.state.phase).toBe("processing");
    expect(result.current.state.previewKind).toBe("temporary");
    await act(async () => {
      finish?.({ id: "asset-one" });
      await selection;
    });
    expect(result.current.state.phase).toBe("accepted");
  });

  it("keeps private upload payloads outside React Query mutation variables", async () => {
    let finish: ((asset: { id: string }) => void) | undefined;
    mediaApiMock.upload.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    mediaApiMock.readContent.mockResolvedValue(new Blob(["private"]));
    const { result } = renderHook(() => useAdminMediaCandidate("work_cover"), {
      wrapper,
    });
    const file = new File(["image"], "cover.jpg");

    let selection: Promise<void> | undefined;
    act(() => {
      selection = result.current.select(file);
    });
    await waitFor(() => {
      expect(finish).toBeTypeOf("function");
    });
    const variables: unknown = queryClient.getMutationCache().getAll()[0]
      ?.state.variables;
    if (
      variables === null ||
      typeof variables !== "object" ||
      !("attemptId" in variables)
    ) {
      throw new Error("Expected safe media mutation variables.");
    }
    expect(typeof variables.attemptId).toBe("string");
    expect(Object.keys(variables)).toEqual(["attemptId"]);

    await act(async () => {
      finish?.({ id: "asset-one" });
      await selection;
    });
  });

  it("preserves an aborted attempt until its authoritative outcome is checked", async () => {
    let uploadSignal: AbortSignal | undefined;
    mediaApiMock.upload.mockImplementation(
      (
        _mediaClass: unknown,
        _file: unknown,
        _attemptId: unknown,
        options: { signal: AbortSignal },
      ) => {
        uploadSignal = options.signal;
        return new Promise((_resolve, reject) => {
          options.signal.addEventListener("abort", () => {
            reject(new SafeMediaError("NETWORK_ERROR", 0, ""));
          });
        });
      },
    );
    mediaApiMock.getAttempt.mockResolvedValue({
      state: "pending",
      assetId: null,
      safeFailureCode: null,
    });
    const { result } = renderHook(() => useAdminMediaCandidate("work_cover"), {
      wrapper,
    });

    act(() => {
      void result.current.select(new File(["image"], "cover.jpg"));
    });
    await waitFor(() => {
      expect(uploadSignal).toBeDefined();
    });
    act(() => {
      result.current.cancel();
    });
    expect(uploadSignal?.aborted).toBe(true);
    await waitFor(() => {
      expect(result.current.state.phase).toBe("pending");
    });
    expect(result.current.attemptId).not.toBeNull();
    const temporaryPreview = result.current.state.previewUrl;
    await act(() => result.current.checkAttempt());
    expect(mediaApiMock.getAttempt).toHaveBeenCalledWith(
      result.current.attemptId,
      expect.any(AbortSignal),
    );
    expect(result.current.state).toMatchObject({
      phase: "pending",
      previewUrl: temporaryPreview,
      previewKind: "temporary",
    });
  });

  it("starts a new attempt when a cancelled upload was never reserved", async () => {
    mediaApiMock.upload.mockImplementationOnce(
      (
        _mediaClass: unknown,
        _file: unknown,
        _attemptId: unknown,
        options: { signal: AbortSignal },
      ) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener("abort", () => {
            reject(new SafeMediaError("NETWORK_ERROR", 0, ""));
          });
        }),
    );
    mediaApiMock.getAttempt.mockRejectedValueOnce(
      new SafeMediaError("NOT_FOUND", 404, "request-one"),
    );
    const { result } = renderHook(() => useAdminMediaCandidate("work_cover"), {
      wrapper,
    });
    const file = new File(["image"], "cover.jpg");

    act(() => {
      void result.current.select(file);
    });
    await waitFor(() => {
      expect(result.current.state.phase).toBe("uploading");
    });
    const firstAttemptId: unknown = mediaApiMock.upload.mock.calls[0]?.[2];
    act(() => {
      result.current.cancel();
    });
    await waitFor(() => {
      expect(result.current.state.phase).toBe("pending");
    });

    await act(() => result.current.checkAttempt());
    expect(result.current.state).toMatchObject({
      phase: "error",
      errorCode: "NOT_FOUND",
      retryMode: "new_attempt",
      previewKind: "temporary",
    });

    mediaApiMock.upload.mockResolvedValueOnce({ id: "asset-two" });
    mediaApiMock.readContent.mockResolvedValueOnce(new Blob(["accepted"]));
    await act(() => result.current.retry());
    expect(mediaApiMock.upload.mock.calls[1]?.[1]).toBe(file);
    expect(mediaApiMock.upload.mock.calls[1]?.[2]).not.toBe(firstAttemptId);
    expect(result.current.state.phase).toBe("accepted");
  });

  it("loads an existing durable asset through actor-scoped metadata and private bytes", async () => {
    const assetId = "43afae94-0e94-45e9-ab76-100f889d0777";
    mediaApiMock.getAsset.mockResolvedValue({ id: assetId });
    mediaApiMock.readContent.mockResolvedValue(new Blob(["private"]));
    const { result } = renderHook(() => useAdminMediaCandidate("work_cover"), {
      wrapper,
    });

    await act(() => result.current.load(assetId));
    expect(mediaApiMock.getAsset).toHaveBeenCalledWith(
      assetId,
      expect.any(AbortSignal),
    );
    expect(mediaApiMock.readContent).toHaveBeenCalledWith(
      assetId,
      expect.any(AbortSignal),
    );
    expect(
      queryClient.getQueryData(mediaKeys.asset(sessionMock.id, assetId)),
    ).toEqual({ id: assetId });
    expect(result.current.state).toMatchObject({
      phase: "accepted",
      assetId,
      previewKind: "accepted",
    });
  });

  it("owns the authenticated binary preview and revokes it on clear", async () => {
    const listKey = mediaKeys.list(
      "11111111-1111-4111-8111-111111111111",
      "work_cover",
      1,
    );
    queryClient.setQueryData(listKey, { items: [] });
    mediaApiMock.upload.mockResolvedValue({ id: "asset-one" });
    mediaApiMock.readContent.mockResolvedValue(new Blob(["private"]));
    const { result } = renderHook(() => useAdminMediaCandidate("work_cover"), {
      wrapper,
    });

    await act(() => result.current.select(new File(["image"], "cover.jpg")));
    await waitFor(() => {
      expect(result.current.state.phase).toBe("accepted");
    });
    expect(result.current.state.previewUrl).toBe("blob:private-preview");
    expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
    act(() => {
      result.current.clear();
    });
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:private-preview");
    expect(result.current.state.phase).toBe("idle");
  });

  it("reconciles a lost response to terminal UPLOAD_INCOMPLETE", async () => {
    mediaApiMock.upload.mockRejectedValue(
      new SafeMediaError("NETWORK_ERROR", 0, ""),
    );
    mediaApiMock.getAttempt.mockResolvedValue({
      state: "rejected",
      assetId: null,
      safeFailureCode: "UPLOAD_INCOMPLETE",
    });
    const { result } = renderHook(() => useAdminMediaCandidate("work_cover"), {
      wrapper,
    });

    await act(() => result.current.select(new File(["image"], "cover.jpg")));
    await waitFor(() => {
      expect(result.current.state).toMatchObject({
        phase: "error",
        previewKind: "temporary",
        previewUrl: "blob:private-preview",
        errorCode: "UPLOAD_INCOMPLETE",
      });
    });
    expect("retry" in result.current).toBe(true);
    if (
      !("retry" in result.current) ||
      typeof result.current.retry !== "function"
    )
      return;

    mediaApiMock.upload.mockResolvedValueOnce({ id: "asset-two" });
    mediaApiMock.readContent.mockResolvedValueOnce(new Blob(["accepted"]));
    const firstAttemptId: unknown = mediaApiMock.upload.mock.calls[0]?.[2];
    await act(() => result.current.retry());
    expect(mediaApiMock.upload.mock.calls[1]?.[1]).toBe(
      mediaApiMock.upload.mock.calls[0]?.[1],
    );
    expect(mediaApiMock.upload.mock.calls[1]?.[2]).not.toBe(firstAttemptId);
    expect(result.current.state.phase).toBe("accepted");
  });

  it("aborts private metadata and binary reads when the candidate is cleared", async () => {
    const assetId = "43afae94-0e94-45e9-ab76-100f889d0777";
    let metadataSignal: AbortSignal | undefined;
    let binarySignal: AbortSignal | undefined;
    mediaApiMock.getAsset.mockImplementation(
      (_assetId: string, signal: AbortSignal) => {
        metadataSignal = signal;
        return Promise.resolve({ id: assetId });
      },
    );
    mediaApiMock.readContent.mockImplementation(
      (_assetId: string, signal: AbortSignal) => {
        binarySignal = signal;
        return new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => {
            reject(new SafeMediaError("HTTP_ERROR", 0, ""));
          });
        });
      },
    );
    const { result } = renderHook(() => useAdminMediaCandidate("work_cover"), {
      wrapper,
    });

    act(() => {
      void result.current.load(assetId);
    });
    await waitFor(() => {
      expect(binarySignal).toBeDefined();
    });
    act(() => {
      result.current.clear();
    });
    expect(metadataSignal?.aborted).toBe(true);
    expect(binarySignal?.aborted).toBe(true);
    expect(result.current.state.phase).toBe("idle");
  });

  it("rejects stale completion after the candidate is cleared", async () => {
    let finish: ((asset: { id: string }) => void) | undefined;
    let uploadSignal: AbortSignal | undefined;
    mediaApiMock.upload.mockImplementation(
      (
        _mediaClass: unknown,
        _file: unknown,
        _attemptId: unknown,
        options: { signal: AbortSignal },
      ) => {
        uploadSignal = options.signal;
        return new Promise((resolve) => {
          finish = resolve;
        });
      },
    );
    mediaApiMock.readContent.mockResolvedValue(new Blob(["private"]));
    const { result } = renderHook(() => useAdminMediaCandidate("work_cover"), {
      wrapper,
    });

    let pending: Promise<void> | undefined;
    act(() => {
      pending = result.current.select(new File(["image"], "cover.jpg"));
    });
    await waitFor(() => {
      expect(finish).toBeTypeOf("function");
    });
    act(() => {
      result.current.clear();
    });
    expect(uploadSignal?.aborted).toBe(true);
    await act(async () => {
      finish?.({ id: "stale-asset" });
      await pending;
    });
    expect(result.current.state.phase).toBe("idle");
    expect(mediaApiMock.readContent).not.toHaveBeenCalled();
  });

  it("scopes an avatar candidate to its owner and clears private state on session change", async () => {
    sessionMock.role = "USER";
    const firstActor = sessionMock.id;
    const oldKey = mediaKeys.list(firstActor, "user_avatar", 1);
    queryClient.setQueryData(oldKey, { items: [{ id: "private-avatar" }] });
    URL.createObjectURL = vi
      .fn()
      .mockReturnValueOnce("blob:temporary-avatar")
      .mockReturnValueOnce("blob:accepted-avatar");
    mediaApiMock.upload.mockResolvedValue({ id: "avatar-asset" });
    mediaApiMock.readContent.mockResolvedValue(new Blob(["private-avatar"]));
    mediaApiMock.removeAvatar.mockResolvedValue({
      id: "avatar-asset",
      status: "removed",
    });
    const { result, rerender } = renderHook(() => useAvatarMediaCandidate(), {
      wrapper,
    });

    let selection: Promise<void> | undefined;
    act(() => {
      selection = result.current.select(
        new File(["image"], "avatar.png", { type: "image/png" }),
      );
    });
    expect(result.current.state).toMatchObject({
      phase: "uploading",
      previewKind: "temporary",
      previewUrl: "blob:temporary-avatar",
    });
    await act(async () => {
      await selection;
    });
    expect(mediaApiMock.upload).toHaveBeenCalledWith(
      "user_avatar",
      expect.any(File),
      expect.any(String),
      expect.any(Object),
    );
    expect(result.current.state).toMatchObject({
      phase: "accepted",
      previewKind: "accepted",
      previewUrl: "blob:accepted-avatar",
    });
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:temporary-avatar");

    sessionMock.id = "22222222-2222-4222-8222-222222222222";
    rerender();
    await waitFor(() => {
      expect(result.current.state.phase).toBe("idle");
    });
    expect(queryClient.getQueryState(oldKey)).toBeUndefined();
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:accepted-avatar");
  });

  it("scopes reference state to the actor and invalidates it after a bind", async () => {
    const targetId = "ff4f24b3-b11d-429a-9e4f-a94f8ce02436";
    const assetId = "43afae94-0e94-45e9-ab76-100f889d0777";
    mediaApiMock.getReference.mockResolvedValue({ reference: null });
    mediaApiMock.bindReference.mockResolvedValue({
      id: "55aec196-95e6-4763-a5a7-d43fb6cc9553",
      targetKind: "work_cover",
      targetId,
      assetId,
      version: 0,
    });
    const { result } = renderHook(
      () => useAdminMediaReference("work_cover", targetId),
      { wrapper },
    );
    await waitFor(() => {
      expect(result.current.query.isSuccess).toBe(true);
    });
    await act(() => {
      return result.current.bind.mutateAsync({
        targetKind: "work_cover",
        targetId,
        assetId,
      });
    });
    expect(mediaApiMock.bindReference).toHaveBeenCalledWith({
      targetKind: "work_cover",
      targetId,
      assetId,
    });
    await waitFor(() => {
      expect(mediaApiMock.getReference).toHaveBeenCalledTimes(2);
    });
  });

  it("invalidates target and asset scopes after replace and preserves conflicts", async () => {
    const targetId = "ff4f24b3-b11d-429a-9e4f-a94f8ce02436";
    const referenceId = "55aec196-95e6-4763-a5a7-d43fb6cc9553";
    const oldAssetId = "43afae94-0e94-45e9-ab76-100f889d0777";
    const newAssetId = "b27be8b6-09a7-4933-8634-52397ef17f26";
    mediaApiMock.getReference.mockResolvedValue({ reference: null });
    mediaApiMock.replaceReference.mockResolvedValue({
      id: referenceId,
      targetKind: "work_cover",
      targetId,
      assetId: newAssetId,
      version: 1,
    });
    const oldAssetKey = mediaKeys.asset(sessionMock.id, oldAssetId);
    const newAssetKey = mediaKeys.asset(sessionMock.id, newAssetId);
    queryClient.setQueryData(oldAssetKey, { id: oldAssetId });
    queryClient.setQueryData(newAssetKey, { id: newAssetId });
    const { result } = renderHook(
      () => useAdminMediaReference("work_cover", targetId),
      { wrapper },
    );
    await waitFor(() => {
      expect(result.current.query.isSuccess).toBe(true);
    });

    await act(() =>
      result.current.replace.mutateAsync({
        referenceId,
        command: {
          assetId: newAssetId,
          expectedAssetId: oldAssetId,
          expectedVersion: 0,
        },
      }),
    );
    expect(queryClient.getQueryState(oldAssetKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(newAssetKey)?.isInvalidated).toBe(true);

    mediaApiMock.retireReference.mockRejectedValueOnce(
      new SafeMediaError("VERSION_CONFLICT", 409, "request-one"),
    );
    const conflict = await result.current.retire
      .mutateAsync({
        referenceId,
        command: { expectedAssetId: newAssetId, expectedVersion: 0 },
      })
      .catch((error: unknown) => error);
    expect(conflict).toMatchObject({ code: "VERSION_CONFLICT" });
    await waitFor(() => {
      expect(result.current.retire.isError).toBe(true);
    });
  });

  it("handles an exact bind replay and invalidates the retired asset scope", async () => {
    const targetId = "ff4f24b3-b11d-429a-9e4f-a94f8ce02436";
    const referenceId = "55aec196-95e6-4763-a5a7-d43fb6cc9553";
    const assetId = "43afae94-0e94-45e9-ab76-100f889d0777";
    const reference = {
      id: referenceId,
      targetKind: "work_cover" as const,
      targetId,
      assetId,
      version: 0,
    };
    mediaApiMock.getReference.mockResolvedValue({ reference: null });
    mediaApiMock.bindReference.mockResolvedValue(reference);
    mediaApiMock.retireReference.mockResolvedValue({
      ...reference,
      retiredAt: "2026-09-24T12:00:00.000Z",
      version: 1,
    });
    const assetKey = mediaKeys.asset(sessionMock.id, assetId);
    queryClient.setQueryData(assetKey, { id: assetId });
    const { result } = renderHook(
      () => useAdminMediaReference("work_cover", targetId),
      { wrapper },
    );
    await waitFor(() => {
      expect(result.current.query.isSuccess).toBe(true);
    });

    const command = { targetKind: "work_cover" as const, targetId, assetId };
    await act(() => result.current.bind.mutateAsync(command));
    await act(() => result.current.bind.mutateAsync(command));
    expect(mediaApiMock.bindReference).toHaveBeenNthCalledWith(1, command);
    expect(mediaApiMock.bindReference).toHaveBeenNthCalledWith(2, command);

    await act(() =>
      result.current.retire.mutateAsync({
        referenceId,
        command: { expectedAssetId: assetId, expectedVersion: 0 },
      }),
    );
    expect(queryClient.getQueryState(assetKey)?.isInvalidated).toBe(true);
    expect(mediaApiMock.retireReference).toHaveBeenCalledWith(referenceId, {
      expectedAssetId: assetId,
      expectedVersion: 0,
    });
  });
});

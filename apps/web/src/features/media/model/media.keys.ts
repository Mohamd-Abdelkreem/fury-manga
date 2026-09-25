import type { MediaClass, MediaReferenceTargetKind } from "@fury/contracts";

export const mediaKeys = {
  actor: (actorId: string) => ["media", actorId] as const,
  listScope: (actorId: string, mediaClass: MediaClass) =>
    ["media", actorId, "list", mediaClass] as const,
  list: (actorId: string, mediaClass: MediaClass, page: number) =>
    ["media", actorId, "list", mediaClass, page] as const,
  asset: (actorId: string, assetId: string) =>
    ["media", actorId, "asset", assetId] as const,
  attempt: (actorId: string, attemptId: string) =>
    ["media", actorId, "attempt", attemptId] as const,
  reference: (
    actorId: string,
    targetKind: MediaReferenceTargetKind,
    targetId: string,
  ) => ["media", actorId, "reference", targetKind, targetId] as const,
};

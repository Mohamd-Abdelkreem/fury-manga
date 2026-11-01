"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/features/auth/hooks/auth.hooks";
import { mediaApi, SafeMediaError } from "@/features/media/api/media.api";
import { mediaKeys } from "@/features/media/model/media.keys";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import type { MediaAssetDto } from "@fury/contracts";
import type {
  IllustratedPage,
  ImageReadingMode,
} from "../model/progressive-images";
import {
  createProgressiveImageResources,
  type PageImageResource,
} from "./progressive-image-resources";

const noImages: ReadonlyMap<string, PageImageResource> = new Map();
const connectionInfo = () =>
  "connection" in navigator &&
  typeof navigator.connection === "object" &&
  navigator.connection !== null
    ? navigator.connection
    : undefined;
const constrainedConnection = () => {
  const connection = connectionInfo();
  return (
    connection !== undefined &&
    (("saveData" in connection && connection.saveData === true) ||
      ("effectiveType" in connection &&
        ["slow-2g", "2g", "3g"].includes(String(connection.effectiveType))))
  );
};
const subscribeConnection = (listener: () => void) => {
  const connection = connectionInfo();
  if (!(connection instanceof EventTarget)) return () => {};
  connection.addEventListener("change", listener);
  return () => {
    connection.removeEventListener("change", listener);
  };
};

export const useProgressiveChapterImages = (
  pages: readonly IllustratedPage[],
  scopeKey: string,
  position: number,
  mode: ImageReadingMode = "continuous",
) => {
  const client = useQueryClient();
  const user = useSession().data?.user;
  const actor =
    user?.role === "ADMIN" &&
    user.status === "ACTIVE" &&
    user.emailVerifiedAt !== null
      ? user.id
      : null;
  const previousActor = useRef(actor);
  useEffect(() => {
    const previous = previousActor.current;
    previousActor.current = actor;
    if (previous !== null && previous !== actor)
      client.removeQueries({ queryKey: mediaKeys.actor(previous) });
  }, [actor, client]);
  const reduced = useReducedMotion();
  const constrained = useSyncExternalStore(
    subscribeConnection,
    constrainedConnection,
    () => true,
  );
  const descriptors = useMemo(
    () =>
      pages.map((page) => {
        const cached =
          actor === null
            ? undefined
            : client.getQueryData<MediaAssetDto>(
                mediaKeys.asset(actor, page.assetId),
              );
        return cached === undefined
          ? page
          : {
              ...page,
              width: page.width ?? cached.width,
              height: page.height ?? cached.height,
              byteLength: page.byteLength ?? cached.byteLength,
            };
      }),
    [pages, client, actor],
  );
  const owner = useMemo(
    () => ({
      scopeKey,
      ...createProgressiveImageResources(
        descriptors,
        async (page, signal) => {
          if (actor === null) throw new SafeMediaError("FORBIDDEN", 403, "");
          const known =
            page.width !== undefined &&
            page.height !== undefined &&
            page.byteLength !== undefined;
          const asset = known
            ? undefined
            : await client.fetchQuery<MediaAssetDto>({
                queryKey: mediaKeys.asset(actor, page.assetId),
                queryFn: async () => {
                  const asset = await mediaApi.getAsset(page.assetId, signal);
                  signal.throwIfAborted();
                  return asset;
                },
                retry: false,
                staleTime: 0,
              });
          if (asset !== undefined && asset.mediaClass !== "chapter_page")
            throw new SafeMediaError("NOT_FOUND", 404, "");
          const blob = await mediaApi.readContent(page.assetId, signal);
          signal.throwIfAborted();
          if (
            !["image/jpeg", "image/png", "image/webp"].includes(blob.type) ||
            blob.size !== (page.byteLength ?? asset?.byteLength)
          )
            throw new SafeMediaError("MEDIA_UNAVAILABLE", 503, "");
          const width = page.width ?? asset?.width;
          const height = page.height ?? asset?.height;
          if (width === undefined || height === undefined)
            throw new SafeMediaError("MEDIA_UNAVAILABLE", 503, "");
          return { blob, width, height };
        },
        reduced,
        true,
      ),
    }),
    [client, actor, scopeKey, descriptors, reduced],
  );
  const resources = useSyncExternalStore(
    owner.subscribe,
    owner.getSnapshot,
    () => noImages,
  );
  useEffect(() => {
    owner.setPosition(position, mode);
  }, [owner, position, mode]);
  useEffect(() => {
    owner.setConstrained(constrained);
  }, [owner, constrained]);
  useEffect(() => {
    if (actor !== null) owner.activate();
    return owner.dispose;
  }, [owner, actor]);
  return {
    resources,
    retry: owner.retry,
    failedDisplay: owner.failedDisplay,
    available: actor !== null,
  };
};

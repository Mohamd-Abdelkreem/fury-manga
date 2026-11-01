"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import {
  createStillImageUrl,
  isAnimatedImageBlob,
} from "./media-image-display";

export const useMediaPreviewSource = (
  source: string | null,
  animatedClass: boolean,
) => {
  const reduced = useReducedMotion() && animatedClass;
  const owner = useMemo(() => ({ source, reduced }), [source, reduced]);
  const [prepared, setPrepared] =
    useState<
      Readonly<{ owner: typeof owner; url: string | null; error: boolean }>
    >();
  useEffect(() => {
    if (!reduced || source === null) return;
    const controller = new AbortController();
    let url: string | undefined;
    const prepare = async () => {
      // Candidate sources are local object URLs, never another authenticated HTTP stack.
      const blob = await (
        await fetch(source, { signal: controller.signal })
      ).blob();
      const animated = await isAnimatedImageBlob(blob);
      controller.signal.throwIfAborted();
      if (!animated) {
        setPrepared({ owner, url: source, error: false });
        return;
      }
      const still = await createStillImageUrl(source, controller.signal);
      if (controller.signal.aborted) {
        URL.revokeObjectURL(still.url);
        return;
      }
      url = still.url;
      setPrepared({ owner, url, error: false });
    };
    void prepare().catch(() => {
      if (!controller.signal.aborted)
        setPrepared({ owner, url: null, error: true });
    });
    return () => {
      controller.abort();
      if (url !== undefined) URL.revokeObjectURL(url);
    };
  }, [owner, source, reduced]);
  const current = prepared?.owner === owner ? prepared : undefined;
  return {
    url: reduced ? (current?.url ?? null) : source,
    error: reduced && current?.error === true,
    pending: reduced && source !== null && current === undefined,
  };
};

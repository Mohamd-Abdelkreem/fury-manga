"use client";

import { isPublicNotFound } from "../model/public-catalog.errors";
import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  claimPublicMetadataRefresh,
  hasPublicBrowserDenial,
  clearPublicMetadataRefresh,
  requestPublicRecoveryFocus,
} from "./public-catalog.access";

type MetadataOptions = Readonly<{
  slug: string;
  serverRenderId: string;
  serverEligible: boolean;
  initialUnavailable: boolean;
  result: Readonly<{
    denied: boolean;
    browserDenied: boolean;
    isSuccess: boolean;
    isFetching: boolean;
    retryAccess: () => Promise<unknown>;
  }>;
}>;

/** Reconcile visibility with server SEO once per mismatch, including across remounts. */
export const usePublicWorkMetadata = ({
  slug,
  serverRenderId,
  serverEligible,
  initialUnavailable,
  result,
}: MetadataOptions) => {
  const client = useQueryClient();
  const router = useRouter();
  const { denied, browserDenied, isSuccess, isFetching, retryAccess } = result;
  useEffect(() => {
    if (isFetching) return;
    if (denied) {
      if (!browserDenied) return;
      if (
        (serverEligible || initialUnavailable) &&
        claimPublicMetadataRefresh(client, slug, "denied")
      )
        router.refresh();
    } else if (isSuccess) {
      if (serverEligible) clearPublicMetadataRefresh(client, slug);
      else if (
        initialUnavailable &&
        claimPublicMetadataRefresh(client, slug, "eligible")
      )
        router.refresh();
    }
  }, [
    client,
    router,
    slug,
    serverEligible,
    initialUnavailable,
    denied,
    browserDenied,
    isSuccess,
    isFetching,
  ]);

  return useCallback(async () => {
    try {
      await retryAccess();
    } catch (error) {
      if (isPublicNotFound(error) && hasPublicBrowserDenial(client, slug)) {
        requestPublicRecoveryFocus(client, slug, serverRenderId);
        claimPublicMetadataRefresh(client, slug, "denied");
        router.refresh();
      }
      throw error;
    }
    requestPublicRecoveryFocus(client, slug, serverRenderId);
    // A user retry may try server SEO again after an exhausted automatic attempt.
    claimPublicMetadataRefresh(client, slug, "eligible");
    router.refresh();
  }, [client, router, slug, serverRenderId, retryAccess]);
};

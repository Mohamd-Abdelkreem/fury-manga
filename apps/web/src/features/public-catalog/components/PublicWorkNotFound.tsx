"use client";

import { useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useQueryClient, CancelledError } from "@tanstack/react-query";
import { workSlugParamsSchema } from "@fury/contracts";
import NotFound from "@/app/not-found";
import {
  SafePublicCatalogError,
  isPublicNotFound,
} from "../model/public-catalog.errors";
import {
  observePublicServerDenial,
  claimPublicMetadataRefresh,
  clearPublicMetadataRefresh,
  hasPublicBrowserDenial,
  requestPublicRecoveryFocus,
  consumePublicRecoveryFocus,
} from "../hooks/public-catalog.access";
import { usePublicCatalogDetail } from "../hooks/public-catalog.hooks";
import { PublicCatalogState } from "./PublicCatalogState";
import { usePublicRetryFocus } from "../hooks/use-public-retry-focus";

export function PublicWorkNotFound({
  boundaryId,
}: Readonly<{ boundaryId: string }>) {
  const pathname = usePathname();
  const params = useParams();
  const direct = /^\/story\/[^/]+$/.test(pathname);
  const parsed = workSlugParamsSchema.safeParse({
    workSlug: direct ? params["id"] : undefined,
  });
  return parsed.success ? (
    <WorkDenial slug={parsed.data.workSlug} boundaryId={boundaryId} />
  ) : (
    <NotFound />
  );
}

function WorkDenial({
  slug,
  boundaryId,
}: Readonly<{ slug: string; boundaryId: string }>) {
  const client = useQueryClient();
  const router = useRouter();
  const result = usePublicCatalogDetail(slug, { enabled: false });
  const { target: retryTarget, requestFocus } = usePublicRetryFocus(
    slug,
    result,
  );
  const feedback = useRef<HTMLElement>(null);
  const target = useCallback(
    (node: HTMLElement | null) => {
      retryTarget(node);
      feedback.current = node;
    },
    [retryTarget],
  );
  const { retryAccess } = result;
  const recover = async () => {
    try {
      await retryAccess();
      requestPublicRecoveryFocus(client, slug, boundaryId);
      claimPublicMetadataRefresh(client, slug, "eligible");
      router.refresh();
    } catch (error) {
      if (isPublicNotFound(error) && hasPublicBrowserDenial(client, slug))
        clearPublicMetadataRefresh(client, slug);
      if (
        !(error instanceof SafePublicCatalogError) &&
        !(error instanceof CancelledError)
      )
        throw error;
    }
  };
  useEffect(() => {
    const lifetime = new AbortController();
    const isCurrent = () => !lifetime.signal.aborted;
    void (async () => {
      await observePublicServerDenial(client, slug, boundaryId);
      if (!isCurrent()) return;
      try {
        await retryAccess();
        if (isCurrent() && claimPublicMetadataRefresh(client, slug, "eligible"))
          router.refresh();
      } catch (error) {
        if (isPublicNotFound(error) && hasPublicBrowserDenial(client, slug)) {
          clearPublicMetadataRefresh(client, slug);
          const node = feedback.current;
          if (
            isCurrent() &&
            node !== null &&
            node.isConnected &&
            node.getClientRects().length > 0 &&
            consumePublicRecoveryFocus(client, slug, boundaryId)
          )
            node.focus();
        }
        if (
          !(error instanceof SafePublicCatalogError) &&
          !(error instanceof CancelledError)
        )
          throw error;
      }
    })();
    return () => {
      lifetime.abort();
    };
  }, [client, slug, boundaryId, retryAccess, router]);
  return (
    <main className="state-page" dir="rtl">
      <PublicCatalogState
        kind={
          result.error instanceof SafePublicCatalogError &&
          result.error.statusCode !== 404
            ? "unavailable"
            : "not-found"
        }
        retrying={result.isFetching}
        focusTarget={target}
        onRetry={() => {
          requestFocus();
          void recover();
        }}
      />
    </main>
  );
}

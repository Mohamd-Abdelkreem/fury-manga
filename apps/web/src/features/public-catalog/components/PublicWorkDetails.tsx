"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { consumePublicRecoveryFocus } from "../hooks/public-catalog.access";
import { CancelledError, useQueryClient } from "@tanstack/react-query";
import type { CatalogDetailData } from "@fury/contracts";
import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { Footer } from "@/features/home/components/Footer/Footer";
import { StoryBanner } from "@/features/story/components/StoryBanner/StoryBanner";
import { StorySidebar } from "@/features/story/components/StorySidebar/StorySidebar";
import { ChapterList } from "@/features/story/components/ChapterList/ChapterList";
import { SimilarStories } from "@/features/story/components/SimilarStories/SimilarStories";
import { TextWorkDetails } from "@/features/text-stories/components/TextWorkDetails/TextWorkDetails";
import { SafePublicCatalogError } from "../model/public-catalog.errors";
import { usePublicCatalogDetail } from "../hooks/public-catalog.hooks";
import { PublicCatalogState } from "./PublicCatalogState";
import { usePublicWorkMetadata } from "../hooks/use-public-work-metadata";
import { usePublicRetryFocus } from "../hooks/use-public-retry-focus";
import styles from "@/app/story/[id]/page.module.css";

export function PublicWorkDetails({
  slug,
  seed,
  initialUnavailable = false,
  serverRenderId,
}: Readonly<{
  slug: string;
  seed?: CatalogDetailData;
  initialUnavailable?: boolean;
  serverRenderId: string;
}>) {
  // Parent eligibility checks may temporarily unmount the chapter list.
  const [chapterSelection, setChapterSelection] = useState({
    slug,
    page: 1,
    search: "",
  });
  const page = chapterSelection.slug === slug ? chapterSelection.page : 1;
  const search = chapterSelection.slug === slug ? chapterSelection.search : "";
  const selection = {
    page,
    search,
    onPageChange: (nextPage: number) => {
      setChapterSelection({ slug, page: nextPage, search });
    },
    onSearchChange: (nextSearch: string) => {
      setChapterSelection({ slug, page, search: nextSearch });
    },
  };
  const result = usePublicCatalogDetail(
    slug,
    seed === undefined ? {} : { seed: { workSlug: slug, data: seed } },
  );
  const client = useQueryClient();
  const retryWithMetadata = usePublicWorkMetadata({
    slug,
    serverRenderId,
    serverEligible: seed?.work.slug === slug,
    initialUnavailable,
    result,
  });
  const data = result.data;
  const { target, requestFocus } = usePublicRetryFocus(slug, result);
  const recoveryNode = useRef<HTMLElement>(null);
  const recoveryTarget = useCallback(
    (node: HTMLElement | null) => {
      target(node);
      recoveryNode.current = node;
    },
    [target],
  );
  useEffect(() => {
    const node = recoveryNode.current;
    if (
      node !== null &&
      (data !== undefined || result.isError) &&
      !result.isFetching &&
      node.isConnected &&
      node.getClientRects().length > 0 &&
      consumePublicRecoveryFocus(client, slug, serverRenderId)
    )
      node.focus();
  }, [client, slug, serverRenderId, data, result.isFetching, result.isError]);
  useEffect(() => {
    if (seed?.work.slug !== slug || data === undefined) return;
    // Next streams this bare marker outside its managed metadata tree on a 404.
    // Remove only the obsolete body marker after this route receives eligible server data.
    for (const marker of document.body.querySelectorAll(
      'meta[name="robots"][content="noindex"]',
    ))
      marker.remove();
  }, [seed, slug, data]);
  const retry = () => {
    requestFocus();
    void retryWithMetadata().catch((error: unknown) => {
      if (
        !(error instanceof SafePublicCatalogError) &&
        !(error instanceof CancelledError)
      )
        throw error;
    });
  };
  const failed = result.isError || (data === undefined && initialUnavailable);
  const text = data?.work.type === "novel" || data?.work.type === "text-story";
  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />
        {failed || data === undefined ? (
          <main className="state-page">
            <PublicCatalogState
              focusTarget={recoveryTarget}
              retrying={result.isFetching}
              kind={
                result.denied ? "not-found" : failed ? "unavailable" : "loading"
              }
              onRetry={retry}
            />
          </main>
        ) : (
          <>
            <StoryBanner
              slug={data.work.slug}
              kind={data.work.backgroundPath === null ? "cover" : "background"}
            />
            <div
              data-public-catalog-focus=""
              ref={recoveryTarget}
              tabIndex={-1}
              role="region"
              aria-label="تفاصيل العمل"
              className={styles["contentContainer"]}
            >
              {initialUnavailable ? (
                <FeatureState
                  kind={result.isFetching ? "loading" : "unavailable"}
                  title={
                    result.isFetching
                      ? "جارٍ استكمال تحميل الصفحة"
                      : "تعذّر استكمال تحميل الصفحة"
                  }
                  message="يمكنك عرض البيانات المتاحة وإعادة المحاولة لإكمال تحميل الصفحة."
                  {...(result.isFetching
                    ? {}
                    : { onRetry: retry, actionLabel: "إعادة المحاولة" })}
                />
              ) : null}
              {result.isFetching ? (
                <p role="status">جارٍ تحديث تفاصيل العمل…</p>
              ) : null}
              <div className={styles["layoutGrid"]}>
                {text ? (
                  <TextWorkDetails
                    key={slug}
                    detail={data}
                    selection={selection}
                  />
                ) : (
                  <>
                    <div className={styles["sidebarCol"]}>
                      <StorySidebar work={data.work} />
                    </div>
                    <main className={styles["mainCol"]} id="main-content">
                      <ChapterList
                        key={slug}
                        detail={data}
                        selection={selection}
                      />
                      <SimilarStories similarWorks={data.similar} />
                    </main>
                  </>
                )}
              </div>
            </div>
          </>
        )}
        <Footer categories={data?.work.categories ?? []} />
      </div>
    </div>
  );
}

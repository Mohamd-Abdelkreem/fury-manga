"use client";
import type { CatalogHomeData } from "@fury/contracts";
import { Navbar } from "./Navbar/Navbar";
import { HeroSection } from "./HeroSection/HeroSection";
import { DiscordBanner } from "./DiscordBanner/DiscordBanner";
import { LatestReleases } from "./LatestReleases/LatestReleases";
import { SuggestionsSection } from "./SuggestionsSection/SuggestionsSection";
import { Footer } from "./Footer/Footer";
import { AdvertisementSlot } from "@/features/advertising/components/AdvertisementSlot/AdvertisementSlot";
import { PublicCatalogState } from "@/features/public-catalog/components/PublicCatalogState";
import { usePublicCatalogHome } from "@/features/public-catalog/hooks/public-catalog.hooks";
import { usePublicRetryFocus } from "@/features/public-catalog/hooks/use-public-retry-focus";
import styles from "@/app/page.module.css";

export function PublicHome({
  seed,
  initialUnavailable = false,
  communityUrl,
}: Readonly<{
  seed?: CatalogHomeData;
  initialUnavailable?: boolean;
  communityUrl?: string | undefined;
}>) {
  const result = usePublicCatalogHome(seed === undefined ? {} : { seed });
  const data = result.data;
  const { target, requestFocus } = usePublicRetryFocus("home", result);
  const empty =
    data !== undefined &&
    data.featured.length +
      data.latestReleases.length +
      data.suggestions.length ===
      0;
  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />
        {!result.isError && data !== undefined ? (
          <HeroSection
            featured={data.featured}
            categories={data.categoryShortcuts}
          />
        ) : null}
        <div className={styles["contentContainer"]}>
          <DiscordBanner communityUrl={communityUrl} />
          <div className={styles["layoutGrid"]}>
            <main
              data-public-catalog-focus=""
              ref={target}
              tabIndex={-1}
              className={styles["mainCol"]}
              id="latest-releases"
            >
              {result.isError || (data === undefined && initialUnavailable) ? (
                <PublicCatalogState
                  kind="unavailable"
                  retrying={result.isFetching}
                  onRetry={() => {
                    requestFocus();
                    void result.refetch();
                  }}
                />
              ) : data === undefined ? (
                <PublicCatalogState kind="loading" />
              ) : (
                <>
                  {result.isFetching ? (
                    <p role="status">جارٍ تحديث المحتوى…</p>
                  ) : null}
                  {empty ? <PublicCatalogState kind="empty" /> : null}
                  <LatestReleases releases={data.latestReleases} />
                </>
              )}
            </main>
            <aside className={styles["adCol"]}>
              <AdvertisementSlot placement="home-banner" />
            </aside>
          </div>
        </div>
        {!result.isError && data !== undefined ? (
          <div style={{ background: "var(--background)" }}>
            <SuggestionsSection suggestions={data.suggestions} />
          </div>
        ) : null}
        <Footer categories={data?.categoryShortcuts ?? []} />
      </div>
    </div>
  );
}

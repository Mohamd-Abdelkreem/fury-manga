import { publicPageMetadata } from "@/features/public-catalog/api/public-catalog.seo";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { Footer } from "@/features/home/components/Footer/Footer";
import { DiscoverHero } from "@/features/discover/components/DiscoverHero/DiscoverHero";
import { normalizeCatalogSearch } from "@/features/public-catalog/model/catalog-query";
import { routeSearch } from "@/features/public-catalog/model/public-catalog.presentation";
import { PublicCatalogListing } from "@/features/public-catalog/components/PublicCatalogListing";
import { readCatalogPage } from "@/features/public-catalog/api/public-catalog.pages";
import { redirect } from "next/navigation";
import type { Route } from "next";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  return publicPageMetadata(
    "/discover",
    "اكتشف الأعمال",
    "ابحث في المانجا والمانهوا والمانها والكوميكس والروايات والقصص المنشورة.",
    Object.keys(await searchParams).length > 0,
  );
}

type DiscoverPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const raw = routeSearch(await searchParams);
  const { query, search } = normalizeCatalogSearch(raw);
  if (raw !== search)
    redirect((search === "" ? "/discover" : `/discover?${search}`) as Route);
  const data = await readCatalogPage(query);
  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Navigation */}
        <Navbar />

        {/* Main Content Container */}
        <div className={styles["contentContainer"]}>
          <main style={{ width: "100%", minWidth: 0 }}>
            {/* Discover Header */}
            <DiscoverHero />

            <PublicCatalogListing query={query} {...data} />
          </main>
        </div>

        {/* Footer */}
        <Footer categories={data.categories?.items ?? []} />
      </div>
    </div>
  );
}

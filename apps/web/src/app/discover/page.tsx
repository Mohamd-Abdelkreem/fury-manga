import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { Footer } from "@/features/home/components/Footer/Footer";
import { DiscoverHero } from "@/features/discover/components/DiscoverHero/DiscoverHero";
import { DiscoverFilters } from "@/features/discover/components/DiscoverFilters/DiscoverFilters";
import { DiscoverGrid } from "@/features/discover/components/DiscoverGrid/DiscoverGrid";
import { AdvertisementSlot } from "@/features/advertising/components/AdvertisementSlot/AdvertisementSlot";
import { DISCOVER_WORK_FIXTURES } from "@/features/discover/data/discoverData";
import {
  filterDiscoverWorks,
  parseDiscoverQuery,
} from "@/features/discover/model/catalog";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Fury - قائمة المانجا",
  description: "تصفح واكتشف المانجا والمانهوا المترجمة على منصة Fury.",
};

type DiscoverPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const query = parseDiscoverQuery(await searchParams);
  const works = filterDiscoverWorks(DISCOVER_WORK_FIXTURES, query);
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

            {/* Filters */}
            <DiscoverFilters query={query} />

            <AdvertisementSlot placement="catalog-banner" />

            {/* Manga Grid */}
            <DiscoverGrid works={works} />
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

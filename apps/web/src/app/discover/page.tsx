import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { Footer } from "@/features/home/components/Footer/Footer";
import { DiscoverHero } from "@/features/discover/components/DiscoverHero/DiscoverHero";
import { DiscoverFilters } from "@/features/discover/components/DiscoverFilters/DiscoverFilters";
import { DiscoverGrid } from "@/features/discover/components/DiscoverGrid/DiscoverGrid";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Fury - قائمة المانجا",
  description: "تصفح واكتشف المانجا والمانهوا المترجمة على منصة Fury.",
};

export default function DiscoverPage() {
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
            <DiscoverFilters />

            {/* Manga Grid */}
            <DiscoverGrid />
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

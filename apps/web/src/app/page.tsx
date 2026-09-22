import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { HeroSection } from "@/features/home/components/HeroSection/HeroSection";
import { TrendingSection } from "@/features/home/components/TrendingSection/TrendingSection";
import { DiscordBanner } from "@/features/home/components/DiscordBanner/DiscordBanner";
import { LatestReleases } from "@/features/home/components/LatestReleases/LatestReleases";
import { SuggestionsSection } from "@/features/home/components/SuggestionsSection/SuggestionsSection";
import { Footer } from "@/features/home/components/Footer/Footer";
import { AdvertisementSlot } from "@/features/advertising/components/AdvertisementSlot/AdvertisementSlot";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />

        <HeroSection />

        <div style={{ background: "var(--background)" }}>
          <TrendingSection />
        </div>

        <div className={styles["contentContainer"]}>
          <DiscordBanner />

          <div className={styles["layoutGrid"]}>
            <main className={styles["mainCol"]}>
              <LatestReleases />
            </main>

            <aside className={styles["adCol"]}>
              <AdvertisementSlot placement="home-banner" />
            </aside>
          </div>
        </div>

        <div style={{ background: "var(--background)" }}>
          <SuggestionsSection />
        </div>

        <Footer />
      </div>
    </div>
  );
}

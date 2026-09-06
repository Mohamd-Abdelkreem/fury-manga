import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { HeroSection } from "@/features/home/components/HeroSection/HeroSection";
import { TrendingSection } from "@/features/home/components/TrendingSection/TrendingSection";
import { DiscordBanner } from "@/features/home/components/DiscordBanner/DiscordBanner";
import { LatestReleases } from "@/features/home/components/LatestReleases/LatestReleases";
import { SuggestionsSection } from "@/features/home/components/SuggestionsSection/SuggestionsSection";
import { Footer } from "@/features/home/components/Footer/Footer";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* 1 ── Navigation */}
        <Navbar />

        {/* 2 ── Hero + Genre Bar (Full-Width) */}
        <HeroSection />

        {/* 3 ── Trending Works (Full-Width) */}
        <div style={{ background: "var(--background)" }}>
          <TrendingSection />
        </div>

        {/* 4 ── Main Content Layout (Widened Grid with Video on Left) */}
        <div className={styles["contentContainer"]}>
          {/* Discord banner (Full-Width) */}
          <DiscordBanner />

          <div className={styles["layoutGrid"]}>
            {/* Main Content Column (Right on desktop in RTL) */}
            <main className={styles["mainCol"]}>
              {/* Latest Releases */}
              <LatestReleases />
            </main>

            {/* Sticky Video Column (Left on desktop in RTL) */}
            <aside className={styles["videoCol"]}>
              <video
                src="/vertical-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                className={styles["videoElement"]}
              />
              <video
                src="/vertical-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                className={styles["videoElement"]}
              />
            </aside>
          </div>
        </div>

        {/* 5 ── Suggestions (Full-Width) */}
        <div style={{ background: "var(--background)" }}>
          <SuggestionsSection />
        </div>

        {/* 6 ── Footer (Full-Width) */}
        <Footer />
      </div>
    </div>
  );
}

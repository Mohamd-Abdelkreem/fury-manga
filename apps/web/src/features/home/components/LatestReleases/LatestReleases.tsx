"use client";

import Link from "next/link";
import React from "react";
import { Clock, ChevronLeft } from "lucide-react";
import { MangaCard } from "@/components/ui/MangaCard/MangaCard";
import type { CatalogHomeData } from "@fury/contracts";
import styles from "./LatestReleases.module.css";

export function LatestReleases({
  releases,
}: Readonly<{ releases: CatalogHomeData["latestReleases"] }>) {
  if (releases.length === 0) return null;
  return (
    <div dir="rtl">
      {/* Header */}
      <div className={styles["header"]}>
        <div className={styles["headerLeft"]}>
          <div
            className={styles["accentBar"]}
            style={{ background: "#ffffff" }}
          />
          <Clock style={{ width: 16, height: 16, color: "#ffffff" }} />
          <h2
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#ffffff",
            }}
          >
            أحدث الإصدارات
          </h2>
        </div>
        <Link
          href="/discover?sort=chapter-latest"
          className={styles["viewAll"]}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color =
              "var(--primary)";
          }}
        >
          عرض الكل
          <ChevronLeft style={{ width: 14, height: 14 }} />
        </Link>
      </div>

      {/* Grid */}
      <div className={styles["grid"]}>
        {releases.map(({ work, chapter }) => (
          <MangaCard
            key={`${work.slug}:${chapter.number}`}
            work={work}
            chapterLabel={`فصل ${chapter.number} — ${chapter.title}`}
            stretch
          />
        ))}
      </div>

      {/* Load more */}
      <div className={styles["loadMoreWrapper"]}>
        <Link
          href="/discover?sort=chapter-latest"
          className={styles["loadMoreBtn"]}
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--border)",
            color: "var(--muted-foreground)",
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 700,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "rgba(255, 71, 71, 0.12)";
            el.style.borderColor = "var(--primary)";
            el.style.color = "var(--foreground)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "rgba(255, 255, 255, 0.04)";
            el.style.borderColor = "var(--border)";
            el.style.color = "var(--muted-foreground)";
          }}
        >
          تحميل المزيد
        </Link>
      </div>
    </div>
  );
}

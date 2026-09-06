"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { MangaCard } from "@/components/ui/MangaCard/MangaCard";
import { MOCK_DISCOVER_MANGA } from "../../data/discoverData";
import styles from "./DiscoverGrid.module.css";

export function DiscoverGrid() {
  return (
    <div className={styles["container"]} dir="rtl">
      {/* Cards Grid */}
      <div className={styles["grid"]}>
        {MOCK_DISCOVER_MANGA.map((manga) => (
          <MangaCard key={manga.id} {...manga} stretch />
        ))}
      </div>

      {/* Pagination */}
      <div className={styles["paginationWrapper"]}>
        <button type="button" className={styles["nextPageBtn"]}>
          <ChevronRight className={styles["btnIcon"]} />
          <span>التالي</span>
        </button>
      </div>
    </div>
  );
}

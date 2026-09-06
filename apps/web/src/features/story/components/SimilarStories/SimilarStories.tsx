"use client";

import React from "react";
import { MangaCard } from "@/components/ui/MangaCard/MangaCard";
import type { SimilarWork } from "../../data/storyData";
import styles from "./SimilarStories.module.css";

interface SimilarStoriesProps {
  similarWorks: SimilarWork[];
}

export function SimilarStories({ similarWorks }: SimilarStoriesProps) {
  return (
    <section className={styles["section"]}>
      <div className={styles["header"]}>
        <div className={styles["accentBar"]} />
        <h2 className={styles["title"]}>أعمال مشابهة</h2>
      </div>

      <div className={styles["grid"]}>
        {similarWorks.slice(0, 4).map((work) => (
          <MangaCard key={work.id} {...work} stretch size="sm" />
        ))}
      </div>
    </section>
  );
}

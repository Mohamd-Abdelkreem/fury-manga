"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import styles from "./MangaCard.module.css";

interface CardMetaProps {
  id: number;
  title: string;
  chapter: string;
  rating: number;
  isSmall: boolean;
}

export function CardMeta({
  id,
  title,
  chapter,
  rating,
  isSmall,
}: CardMetaProps) {
  const displayRating =
    rating > 5 ? (rating / 2).toFixed(1) : rating.toFixed(1);

  const numMatch = chapter.match(/\d+/);
  const latestNum = numMatch ? parseInt(numMatch[0], 10) : null;

  // Render 2 chapters if it's a number, otherwise just render the raw string
  const chapters = latestNum
    ? [latestNum, latestNum - 1].filter((n) => n > 0).slice(0, 2)
    : [];

  return (
    <div className={styles["meta"]}>
      {/* Title */}
      <Link href={`/story/${id}`} className={styles["metaTitleLink"]}>
        <h3
          dir="auto"
          className={styles["metaTitle"]}
          style={{
            fontSize: isSmall ? "0.92rem" : "1.02rem",
          }}
          title={title}
        >
          {title}
        </h3>
      </Link>

      {/* Chapter + Rating Row */}
      <div className={styles["metaInfoRow"]}>
        <div className={styles["chapterList"]}>
          {chapters.length > 0 ? (
            chapters.map((chNum) => (
              <Link
                key={chNum}
                href={`/story/${id}/chapter/${chNum}`}
                className={styles["metaChapter"]}
              >
                {`فصل ${chNum}`}
              </Link>
            ))
          ) : (
            <span className={styles["metaChapter"]}>{chapter}</span>
          )}
        </div>

        <div className={styles["metaRating"]}>
          <Star
            className={styles["starIcon"]}
            style={{
              width: isSmall ? 12 : 14,
              height: isSmall ? 12 : 14,
              fill: "var(--accent)",
              color: "var(--accent)",
            }}
          />
          <span className={styles["ratingValue"]}>{displayRating}</span>
        </div>
      </div>
    </div>
  );
}

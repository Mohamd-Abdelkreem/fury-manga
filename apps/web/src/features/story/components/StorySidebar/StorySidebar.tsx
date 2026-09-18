"use client";

import { BookOpenText, Bookmark, Palette, Star } from "lucide-react";
import { useState } from "react";

import styles from "./StorySidebar.module.css";

interface StorySidebarProps {
  coverImage: string;
  title: string;
  rating: number;
  bookmarkedBy: number;
  status: string;
  type: string;
  publishedDate: string;
  author: string;
  artist: string;
  publisher: string;
  translator: string;
  lastUpdated: string;
  views: string;
  contentKind?: "illustrated" | "text";
}

export function StorySidebar({
  coverImage,
  title,
  rating,
  bookmarkedBy,
  status,
  type,
  publishedDate,
  author,
  artist,
  publisher,
  translator,
  lastUpdated,
  views,
  contentKind = "illustrated",
}: StorySidebarProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isText = contentKind === "text";
  const normalizedRating = rating > 5 ? rating / 2 : rating;

  return (
    <aside className={styles["sidebar"]}>
      <div className={styles["coverWrapper"]}>
        <img src={coverImage} alt={title} className={styles["coverImg"]} />
        <span className={styles["coloredBadge"]}>
          {isText ? (
            <BookOpenText
              aria-hidden="true"
              style={{ width: 13, height: 13 }}
            />
          ) : (
            <Palette aria-hidden="true" style={{ width: 13, height: 13 }} />
          )}
          {isText ? "عمل نصي" : "ملـــــون"}
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          setIsBookmarked((current) => !current);
        }}
        className={`${styles["bookmarkBtn"]} ${isBookmarked ? styles["active"] : ""}`}
        aria-pressed={isBookmarked}
      >
        <Bookmark
          aria-hidden="true"
          style={{
            width: 16,
            height: 16,
            fill: isBookmarked ? "#ffffff" : "none",
          }}
        />
        <span>
          {isBookmarked
            ? "مضاف للمفضلة"
            : isText
              ? "حفظ في المكتبة"
              : "Bookmark"}
        </span>
      </button>

      <div className={styles["followers"]}>
        {isText
          ? `محفوظ لدى ${String(bookmarkedBy)} قارئ`
          : `Followed by ${String(bookmarkedBy)} people`}
      </div>

      <div className={styles["ratingBox"]}>
        <svg
          aria-hidden="true"
          style={{ width: 0, height: 0, position: "absolute" }}
        >
          <defs>
            <linearGradient
              id="sidebarHalfStar"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="50%" stopColor="var(--accent)" />
              <stop offset="50%" stopColor="transparent" stopOpacity={1} />
            </linearGradient>
          </defs>
        </svg>

        <div className={styles["ratingStars"]} aria-hidden="true">
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const isFilled = normalizedRating >= starIndex;
            const isHalf = !isFilled && normalizedRating >= starIndex - 0.5;
            return (
              <Star
                key={starIndex}
                style={{
                  width: 15,
                  height: 15,
                  fill: isFilled
                    ? "var(--accent)"
                    : isHalf
                      ? "url(#sidebarHalfStar)"
                      : "transparent",
                  color:
                    isFilled || isHalf
                      ? "var(--accent)"
                      : "rgba(255, 255, 255, 0.15)",
                }}
              />
            );
          })}
        </div>
        <div
          className={styles["ratingValue"]}
          aria-label={`التقييم ${normalizedRating.toFixed(1)} من 5`}
        >
          {normalizedRating.toFixed(1)}
        </div>
      </div>

      <div className={styles["infoList"]}>
        {[
          ["الحالة", status],
          ["النوع", type],
          ["تاريخ النشر", publishedDate],
          ["المؤلف", author],
          ["الرسام", artist],
          ["الناشر", publisher],
          ["المترجم", translator],
          ["آخر تحديث", lastUpdated],
          ["الزيارات", views],
        ].map(([label, value]) => (
          <div className={styles["infoItem"]} key={label}>
            <span className={styles["label"]}>{label}</span>
            <span className={styles["value"]}>{value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

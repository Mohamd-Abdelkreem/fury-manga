"use client";

import React, { useState } from "react";
import { Bookmark, Star, Palette } from "lucide-react";
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
}: StorySidebarProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <aside className={styles["sidebar"]}>
      {/* 1 ── Thumbnail Cover */}
      <div className={styles["coverWrapper"]}>
        <img src={coverImage} alt={title} className={styles["coverImg"]} />
        <span className={styles["coloredBadge"]}>
          <Palette style={{ width: 13, height: 13 }} />
          ملــــون
        </span>
      </div>

      {/* 2 ── Bookmark Action */}
      <button
        onClick={() => setIsBookmarked(!isBookmarked)}
        className={`${styles["bookmarkBtn"]} ${isBookmarked ? styles["active"] : ""}`}
      >
        <Bookmark
          style={{
            width: 16,
            height: 16,
            fill: isBookmarked ? "#ffffff" : "none",
          }}
        />
        <span>{isBookmarked ? "مضاف للمفضلة" : "Bookmark"}</span>
      </button>

      {/* Followers text */}
      <div className={styles["followers"]}>
        Followed by {bookmarkedBy} people
      </div>

      {/* 3 ── Rating Section */}
      <div className={styles["ratingBox"]}>
        {/* SVG half-star gradient definition */}
        <svg style={{ width: 0, height: 0, position: "absolute" }}>
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

        <div className={styles["ratingStars"]}>
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const normalized = rating > 5 ? rating / 2 : rating;
            const isFilled = normalized >= starIndex;
            const isHalf = !isFilled && normalized >= starIndex - 0.5;
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
        <div className={styles["ratingValue"]}>
          {(rating > 5 ? rating / 2 : rating).toFixed(1)}
        </div>
      </div>

      {/* 4 ── Info Attributes List */}
      <div className={styles["infoList"]}>
        <div className={styles["infoItem"]}>
          <span className={styles["label"]}>الحالة</span>
          <span className={styles["value"]}>{status}</span>
        </div>
        <div className={styles["infoItem"]}>
          <span className={styles["label"]}>النوع</span>
          <span className={`${styles["value"]} ${styles["typeLink"]}`}>
            {type}
          </span>
        </div>
        <div className={styles["infoItem"]}>
          <span className={styles["label"]}>تاريخ النشر</span>
          <span className={styles["value"]}>{publishedDate}</span>
        </div>
        <div className={styles["infoItem"]}>
          <span className={styles["label"]}>المؤلف</span>
          <span className={styles["value"]}>{author}</span>
        </div>
        <div className={styles["infoItem"]}>
          <span className={styles["label"]}>الرسام</span>
          <span className={styles["value"]}>{artist}</span>
        </div>
        <div className={styles["infoItem"]}>
          <span className={styles["label"]}>الناشر</span>
          <span className={styles["value"]}>{publisher}</span>
        </div>
        <div className={styles["infoItem"]}>
          <span className={styles["label"]}>المترجم</span>
          <span className={styles["value"]}>{translator}</span>
        </div>
        <div className={styles["infoItem"]}>
          <span className={styles["label"]}>أخر تحديث</span>
          <span className={styles["value"]}>{lastUpdated}</span>
        </div>
        <div className={styles["infoItem"]}>
          <span className={styles["label"]}>الزيارات</span>
          <span className={styles["value"]}>{views}</span>
        </div>
      </div>
    </aside>
  );
}

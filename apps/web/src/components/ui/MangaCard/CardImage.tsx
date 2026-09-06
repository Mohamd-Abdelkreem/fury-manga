"use client";

import React from "react";
import { Flame, Palette } from "lucide-react";
import styles from "./MangaCard.module.css";

interface CardImageProps {
  src: string;
  title: string;
  flag: string;
  isNew?: boolean | undefined;
  isHot?: boolean | undefined;
  badge?: string | undefined;
  rating: number;
}

function renderFlagImage(flag: string): React.ReactNode {
  const isJapan =
    flag.includes("🇯🇵") ||
    flag.toLowerCase().includes("jp") ||
    flag.includes("اليابان");
  const isKorea =
    flag.includes("🇰🇷") ||
    flag.toLowerCase().includes("kr") ||
    flag.includes("كوريا");

  if (isJapan) {
    return (
      <img
        src="https://flagcdn.com/w40/jp.png"
        alt="اليابان"
        style={{
          width: "32px",
          height: "21px",
          objectFit: "cover",
          borderRadius: "3px",
          border: "1.5px solid var(--primary)",
          boxShadow: "0 3px 8px rgba(0, 0, 0, 0.45)",
          display: "block",
        }}
      />
    );
  }
  if (isKorea) {
    return (
      <img
        src="https://flagcdn.com/w40/kr.png"
        alt="كوريا الجنوبية"
        style={{
          width: "32px",
          height: "21px",
          objectFit: "cover",
          borderRadius: "3px",
          border: "1.5px solid var(--primary)",
          boxShadow: "0 3px 8px rgba(0, 0, 0, 0.45)",
          display: "block",
        }}
      />
    );
  }
  return <div className={styles["flagFallback"]}>{flag}</div>;
}

export function CardImage({
  src,
  title,
  flag,
  isNew,
  isHot,
  badge,
  rating,
}: CardImageProps) {
  const showAccentBadge = isNew || badge || !isHot;
  const showHotBadge = isHot || rating >= 4.7;

  return (
    <>
      <img
        src={src}
        alt={title}
        loading="lazy"
        className={styles["coverImage"]}
      />

      {/* Origin Flag */}
      {flag && (
        <div className={styles["flagBadge"]}>{renderFlagImage(flag)}</div>
      )}

      {/* Colored / New Badge */}
      {showAccentBadge && (
        <div className={styles["accentBadge"]}>
          <Palette style={{ width: 11, height: 11, strokeWidth: 3 }} />
          <span
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 900,
              fontSize: "10.5px",
              lineHeight: 1,
            }}
          >
            {badge || (isNew ? "جديد" : "ملون")}
          </span>
        </div>
      )}

      {/* Hot Badge */}
      {showHotBadge && (
        <div className={styles["hotBadge"]}>
          <Flame
            style={{ width: 14, height: 14, color: "#ffffff", fill: "#ffffff" }}
          />
        </div>
      )}
    </>
  );
}

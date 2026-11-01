"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import styles from "./MangaCard.module.css";

interface CardOverlayProps {
  isSmall: boolean;
  publicCatalog?: boolean;
}

export function CardOverlay({
  isSmall,
  publicCatalog = false,
}: CardOverlayProps) {
  return (
    <div className={styles["overlay"]}>
      <div
        className={styles["readNowBtn"]}
        style={{
          padding: isSmall ? "6px 12px" : "8px 16px",
          fontSize: isSmall ? "0.78rem" : "0.88rem",
        }}
      >
        <BookOpen
          style={{ width: isSmall ? 12 : 14, height: isSmall ? 12 : 14 }}
        />
        <span>{publicCatalog ? "تفاصيل العمل" : "اقرأ الآن"}</span>
      </div>
    </div>
  );
}

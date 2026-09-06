"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MangaCardData } from "@/types";
import { CardImage } from "./CardImage";
import { CardMeta } from "./CardMeta";
import { CardOverlay } from "./CardOverlay";
import styles from "./MangaCard.module.css";

interface MangaCardProps extends MangaCardData {
  size?: "sm" | "md";
  stretch?: boolean;
}

export function MangaCard({
  id,
  title,
  chapter,
  rating,
  flag,
  image,
  isNew,
  isHot,
  badge,
  size = "md",
  stretch = false,
}: MangaCardProps) {
  const isSmall = size === "sm";

  return (
    <div
      dir="rtl"
      className={cn(styles["card"], stretch && styles["stretch"])}
      style={{
        width: stretch ? "100%" : isSmall ? "150px" : "185px",
      }}
    >
      {/* Cover Image + Badges Container */}
      <Link href={`/story/${id}`} className="w-full">
        <div className={styles["imageWrapper"]}>
          <CardImage
            src={image}
            title={title}
            flag={flag}
            isNew={isNew}
            isHot={isHot}
            badge={badge}
            rating={rating}
          />
          <CardOverlay isSmall={isSmall} />
        </div>
      </Link>

      {/* Info below card */}
      <CardMeta
        id={id}
        title={title}
        chapter={chapter}
        rating={rating}
        isSmall={isSmall}
      />
    </div>
  );
}

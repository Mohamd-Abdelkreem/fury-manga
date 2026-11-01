"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CatalogWork } from "@fury/contracts";
import { workTypeLabels } from "@/features/public-catalog/model/public-catalog.presentation";
import type { MangaCardData } from "@/types";
import { CardImage } from "./CardImage";
import { CardMeta } from "./CardMeta";
import { CardOverlay } from "./CardOverlay";
import styles from "./MangaCard.module.css";

type MangaCardProps = (
  MangaCardData | { work: CatalogWork; chapterLabel?: string }
) & {
  size?: "sm" | "md";
  stretch?: boolean;
};

export function MangaCard(props: MangaCardProps) {
  const { size = "md", stretch = false } = props;
  const isPublic = "work" in props;
  const card = isPublic
    ? {
        id: props.work.slug,
        title: props.work.title,
        chapter: props.chapterLabel ?? workTypeLabels[props.work.type],
        image: props.work.coverPath,
        flag: "",
        badge: workTypeLabels[props.work.type],
        badgeIcon:
          props.work.type === "novel" || props.work.type === "text-story"
            ? ("book" as const)
            : ("palette" as const),
        rating: undefined,
        isHot: undefined,
        isNew: undefined,
      }
    : props;
  const {
    id,
    title,
    chapter,
    image,
    flag,
    badge,
    badgeIcon,
    rating,
    isHot,
    isNew,
  } = card;
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
            badgeIcon={badgeIcon}
            rating={rating}
            publicSlug={isPublic ? props.work.slug : undefined}
          />
          <CardOverlay isSmall={isSmall} publicCatalog={isPublic} />
        </div>
      </Link>

      {/* Info below card */}
      <CardMeta
        id={id}
        title={title}
        chapter={chapter}
        rating={rating}
        isSmall={isSmall}
        publicCatalog={isPublic}
      />
    </div>
  );
}

"use client";

import React from "react";
import { PublicWorkImage } from "@/features/public-catalog/components/PublicWorkImage";
import styles from "./StoryBanner.module.css";

interface StoryBannerProps {
  slug: string;
  kind?: "cover" | "background";
}

export function StoryBanner({ slug, kind = "background" }: StoryBannerProps) {
  return (
    <div className={styles["bannerContainer"]}>
      <PublicWorkImage
        loading="eager"
        slug={slug}
        kind={kind}
        alt=""
        className={styles["bannerBg"]}
        style={{
          objectFit: "cover",
          objectPosition: "center 20%",
          width: "100%",
          height: "100%",
        }}
      />
      <div
        className={styles["bannerOverlay"]}
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}

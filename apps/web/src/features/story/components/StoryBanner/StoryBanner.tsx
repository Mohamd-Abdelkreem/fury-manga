"use client";

import React from "react";
import styles from "./StoryBanner.module.css";

interface StoryBannerProps {
  bannerImage: string;
}

export function StoryBanner({ bannerImage }: StoryBannerProps) {
  return (
    <div className={styles["bannerContainer"]}>
      <div
        className={styles["bannerBg"]}
        style={{ backgroundImage: `url(${bannerImage})` }}
      />
      <div className={styles["bannerOverlay"]} />
    </div>
  );
}

"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import styles from "./DiscoverHero.module.css";

export function DiscoverHero() {
  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <div className={styles["accentBar"]} />
        <BookOpen className={styles["icon"]} />
        <h1 className={styles["title"]}>قائمة المانجا</h1>
      </div>
    </div>
  );
}

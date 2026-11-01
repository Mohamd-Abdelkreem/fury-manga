"use client";
import { BookOpenText, Bookmark, Palette } from "lucide-react";
import type { CatalogWorkDetail } from "@fury/contracts";
import { PublicWorkImage } from "@/features/public-catalog/components/PublicWorkImage";
import {
  storyStatusLabels,
  workTypeLabels,
} from "@/features/public-catalog/model/public-catalog.presentation";
import styles from "./StorySidebar.module.css";

export function StorySidebar({ work }: Readonly<{ work: CatalogWorkDetail }>) {
  const isText = work.type === "novel" || work.type === "text-story";
  const fields = [
    ["الحالة", storyStatusLabels[work.storyStatus]],
    ["النوع", workTypeLabels[work.type]],
    [
      "تاريخ النشر",
      new Intl.DateTimeFormat("ar", {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(new Date(work.publishedAt)),
    ],
    ["المؤلف", work.author],
    ...(work.artist === null ? [] : [["الرسام", work.artist]]),
  ];
  return (
    <aside className={styles["sidebar"]}>
      <div className={styles["coverWrapper"]}>
        <PublicWorkImage
          loading="eager"
          slug={work.slug}
          alt={work.title}
          className={styles["coverImg"]}
        />
        <span className={styles["coloredBadge"]}>
          {isText ? (
            <BookOpenText
              aria-hidden="true"
              style={{ width: 13, height: 13 }}
            />
          ) : (
            <Palette aria-hidden="true" style={{ width: 13, height: 13 }} />
          )}
          {workTypeLabels[work.type]}
        </span>
      </div>
      <button
        type="button"
        className={styles["bookmarkBtn"]}
        disabled
        aria-describedby="bookmark-deferred"
      >
        <Bookmark aria-hidden="true" style={{ width: 16, height: 16 }} />
        <span>الحفظ لاحقًا</span>
      </button>
      <p className={styles["followers"]} id="bookmark-deferred">
        الحفظ والتقييم والتعليقات غير متاحة بعد.
      </p>
      <div className={styles["infoList"]}>
        {fields.map(([label, value]) => (
          <div className={styles["infoItem"]} key={label}>
            <span className={styles["label"]}>{label}</span>
            <span className={styles["value"]} dir="auto">
              {value}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

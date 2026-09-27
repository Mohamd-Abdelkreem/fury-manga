"use client";

import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { AdminMediaCandidatePicker } from "@/features/media/components/AdminMediaCandidatePicker";
import {
  appendChapterPage,
  moveChapterPage,
  type EditableChapterPage,
} from "../../model/admin-chapter-editor";
import styles from "./AdminChapterForm.module.css";

export function IllustratedChapterEditor({
  pages,
  onChange,
}: Readonly<{
  pages: readonly EditableChapterPage[];
  onChange: (pages: EditableChapterPage[]) => void;
}>) {
  return (
    <section className={styles["card"]} aria-label="صفحات الفصل المصور">
      <div className={styles["cardHeader"]}>
        <h2 className={styles["cardTitle"]}>
          <ImageIcon className={styles["cardIcon"]} /> صفحات الفصل المصور (
          {pages.length})
        </h2>
      </div>
      <AdminMediaCandidatePicker
        mediaClass="chapter_page"
        label="ارفع صورة صفحة أو اختر صورة مقبولة"
        onAssetSelected={(assetId) => {
          if (assetId !== null && pages.length < 500) {
            onChange(appendChapterPage(pages, assetId));
          }
        }}
      />
      <p className={styles["subtitle"]}>
        تُحفظ الصورة أولاً في الوسائط. احفظ الفصل لربط الصفحات بالترتيب المعروض.
      </p>
      {pages.length === 0 ? (
        <p className={styles["emptyStateText"]}>
          لا توجد صفحات مرتبطة بهذه المسودة.
        </p>
      ) : (
        <ol className={styles["pagesGrid"]}>
          {pages.map((page, index) => (
            <li
              key={page.id ?? `${page.assetId}-${String(index)}`}
              className={styles["pageCard"]}
            >
              <div className={styles["pageHeader"]}>
                <span>صفحة {String(index + 1)}</span>
                <span>
                  {page.assetStatus === "unavailable"
                    ? "الصورة غير متاحة"
                    : page.id === undefined
                      ? "مرشحة للفصل"
                      : "محفوظة في الفصل"}
                </span>
              </div>
              <div className={styles["pageActions"]}>
                <button
                  type="button"
                  className={styles["pageBtn"]}
                  disabled={index === 0}
                  aria-label={`تحريك الصفحة ${String(index + 1)} للأعلى`}
                  onClick={() => {
                    onChange(moveChapterPage(pages, index, -1));
                  }}
                >
                  <ChevronUp aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles["pageBtn"]}
                  disabled={index === pages.length - 1}
                  aria-label={`تحريك الصفحة ${String(index + 1)} للأسفل`}
                  onClick={() => {
                    onChange(moveChapterPage(pages, index, 1));
                  }}
                >
                  <ChevronDown aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles["deletePageBtn"]}
                  aria-label={`إزالة الصفحة ${String(index + 1)}`}
                  onClick={() => {
                    onChange(
                      pages.filter((_, pageIndex) => pageIndex !== index),
                    );
                  }}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { AdminMediaCandidatePicker } from "@/features/media/components/AdminMediaCandidatePicker";
import styles from "./AdminChapterForm.module.css";

interface IllustratedChapterEditorProps {
  pages: string[];
  onChange: (pages: string[]) => void;
}

export function IllustratedChapterEditor({
  pages,
  onChange,
}: IllustratedChapterEditorProps) {
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...pages];
    const item = next[index];
    const prevItem = next[index - 1];
    if (item !== undefined && prevItem !== undefined) {
      next[index - 1] = item;
      next[index] = prevItem;
      onChange(next);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index === pages.length - 1) return;
    const next = [...pages];
    const item = next[index];
    const nextItem = next[index + 1];
    if (item !== undefined && nextItem !== undefined) {
      next[index + 1] = item;
      next[index] = nextItem;
      onChange(next);
    }
  };

  const handleDelete = (index: number) => {
    const next = pages.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className={styles["card"]}>
      <div className={styles["cardHeader"]}>
        <div className={styles["pagesCounter"]}>
          <ImageIcon className={styles["cardIcon"]} />
          <span>صفحات الفصل المصور</span>
          <span className={styles["counterBadge"]}>
            {String(pages.length)} {pages.length === 1 ? "صفحة" : "صفحات"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {pages.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className={styles["btnSecondary"]}
              style={{
                fontSize: "0.8125rem",
                padding: "0.35rem 0.75rem",
                color: "#ef4444",
              }}
            >
              حذف الكل
            </button>
          )}
        </div>
      </div>

      <AdminMediaCandidatePicker
        mediaClass="chapter_page"
        label="رفع صفحة مصورة مرشحة"
      />

      <div className={styles["illustratedToolbar"]}>
        <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.6)" }}>
          قم بترتيب الصفحات باستخدام أزرار الأسهم لضمان التسلسل الصحيح للقراءة.
        </span>
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
          الصيغ المدعومة: JPG, PNG, WebP
        </span>
      </div>

      {pages.length === 0 ? (
        <div className={styles["emptyState"]}>
          <ImageIcon className={styles["emptyStateIcon"]} />
          <p className={styles["emptyStateTitle"]}>لا توجد صفحات مرفوعة بعد</p>
          <p className={styles["emptyStateText"]}>
            ارفع صفحة مرشحة أعلاه. ستبقى في الوسائط منفصلة عن الفصل حتى تُربط به
            في مرحلة لاحقة.
          </p>
        </div>
      ) : (
        <div className={styles["pagesGrid"]}>
          {pages.map((url, idx) => (
            <div key={`${url}-${String(idx)}`} className={styles["pageCard"]}>
              <div className={styles["pageHeader"]}>
                <span>صفحة {String(idx + 1)}</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  #{String(idx + 1)}
                </span>
              </div>
              <div className={styles["pageThumbContainer"]}>
                <Image
                  src={url}
                  alt={`صفحة ${String(idx + 1)}`}
                  fill
                  sizes="200px"
                  className={styles["pageImage"]}
                  unoptimized
                />
              </div>
              <div className={styles["pageActions"]}>
                <div className={styles["pageReorderButtons"]}>
                  <button
                    type="button"
                    onClick={() => {
                      handleMoveUp(idx);
                    }}
                    disabled={idx === 0}
                    className={styles["pageBtn"]}
                    aria-label={`تحريك الصفحة ${String(idx + 1)} لأعلى`}
                    title="تحريك لأعلى"
                  >
                    <ChevronUp
                      style={{ width: "0.875rem", height: "0.875rem" }}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleMoveDown(idx);
                    }}
                    disabled={idx === pages.length - 1}
                    className={styles["pageBtn"]}
                    aria-label={`تحريك الصفحة ${String(idx + 1)} لأسفل`}
                    title="تحريك لأسفل"
                  >
                    <ChevronDown
                      style={{ width: "0.875rem", height: "0.875rem" }}
                    />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(idx);
                  }}
                  className={styles["deletePageBtn"]}
                  aria-label={`حذف الصفحة ${String(idx + 1)}`}
                  title="حذف الصفحة"
                >
                  <Trash2 style={{ width: "0.875rem", height: "0.875rem" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

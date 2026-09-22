"use client";

import React from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import styles from "./AdminChapterForm.module.css";

interface IllustratedChapterEditorProps {
  pages: string[];
  onChange: (pages: string[]) => void;
}

const SAMPLE_PAGES = [
  "/anime/341452.jpg",
  "/anime/603242.jpg",
  "/anime/384226.jpg",
  "/anime/411246.jpg",
  "/anime/463379.jpg",
  "/anime/463592.jpg",
  "/anime/472451.jpg",
  "/anime/473048.jpg",
];

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

  const handleAddSample = () => {
    const randomImg =
      SAMPLE_PAGES[Math.floor(Math.random() * SAMPLE_PAGES.length)] ??
      "/anime/341452.jpg";
    onChange([...pages, randomImg]);
  };

  const handleReplace = (index: number) => {
    const randomImg =
      SAMPLE_PAGES[Math.floor(Math.random() * SAMPLE_PAGES.length)] ??
      "/anime/341452.jpg";
    const next = [...pages];
    next[index] = randomImg;
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
          <button
            type="button"
            onClick={handleAddSample}
            className={styles["btnSecondary"]}
            style={{ fontSize: "0.8125rem", padding: "0.35rem 0.75rem" }}
          >
            <Plus style={{ width: "0.875rem", height: "0.875rem" }} />
            إضافة صفحة تجريبية
          </button>
        </div>
      </div>

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
            أضف صفحات تجريبية لتجهيز الفصل المصور ومعاينته كما سيظهر للقراء.
          </p>
          <button
            type="button"
            onClick={handleAddSample}
            className={styles["btnPrimary"]}
            style={{ marginTop: "0.5rem" }}
          >
            <Plus style={{ width: "1rem", height: "1rem" }} />
            إضافة أول صفحة
          </button>
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
                  <button
                    type="button"
                    onClick={() => {
                      handleReplace(idx);
                    }}
                    className={styles["pageBtn"]}
                    aria-label={`استبدال صورة الصفحة ${String(idx + 1)}`}
                    title="استبدال الصورة"
                  >
                    <RefreshCw
                      style={{ width: "0.75rem", height: "0.75rem" }}
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

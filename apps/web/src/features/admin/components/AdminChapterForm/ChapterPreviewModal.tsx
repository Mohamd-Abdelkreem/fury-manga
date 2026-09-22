"use client";

import React from "react";
import Image from "next/image";
import { BookOpen, X } from "lucide-react";
import type { AdminContentType } from "../../types/admin.types";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminChapterForm.module.css";

interface ChapterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  workTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  contentType: AdminContentType;
  pages: string[];
  textContent: string;
}

export function ChapterPreviewModal({
  isOpen,
  onClose,
  workTitle,
  chapterNumber,
  chapterTitle,
  contentType,
  pages,
  textContent,
}: ChapterPreviewModalProps) {
  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div
      className={styles["modalBackdrop"]}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div
        ref={dialogRef}
        className={styles["modalContent"]}
        onKeyDown={onDialogKeyDown}
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles["modalHeader"]}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen
              style={{
                width: "1.25rem",
                height: "1.25rem",
                color: "var(--primary)",
              }}
            />
            <div>
              <h3 id="preview-modal-title" className={styles["modalTitle"]}>
                معاينة الفصل {String(chapterNumber)}:{" "}
                {chapterTitle || "بدون عنوان"}
              </h3>
              <span
                style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}
              >
                {workTitle} • نمط القارئ المباشر
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles["pageBtn"]}
            aria-label="إغلاق المعاينة"
          >
            <X style={{ width: "1rem", height: "1rem" }} />
          </button>
        </div>

        <div className={styles["modalBody"]}>
          {contentType === "illustrated" ? (
            pages.length > 0 ? (
              <div className={styles["previewIllustratedList"]}>
                {pages.map((url, idx) => (
                  <div
                    key={`${url}-${String(idx)}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.25rem",
                      maxWidth: "540px",
                      width: "100%",
                    }}
                  >
                    <Image
                      src={url}
                      alt={`صفحة ${String(idx + 1)}`}
                      width={540}
                      height={760}
                      className={styles["previewPageImage"]}
                      unoptimized
                    />
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      صفحة {String(idx + 1)} من {String(pages.length)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles["emptyState"]}>
                <p className={styles["emptyStateTitle"]}>
                  لا توجد صفحات لمعاينتها
                </p>
                <p className={styles["emptyStateText"]}>
                  أضف صفحات للفصل في المحرر لتتمكن من معاينتها هنا.
                </p>
              </div>
            )
          ) : (
            <div
              style={{
                maxWidth: "680px",
                margin: "0 auto",
                width: "100%",
                lineHeight: "2",
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "1rem",
              }}
            >
              <div
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingBottom: "1rem",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--primary)",
                    fontWeight: 700,
                  }}
                >
                  الفصل {String(chapterNumber)}
                </span>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    margin: "0.25rem 0 0",
                    color: "#ffffff",
                  }}
                >
                  {chapterTitle || "بدون عنوان"}
                </h2>
              </div>

              {textContent.trim() ? (
                <div>
                  {textContent.split("\n\n").map((block, i) => {
                    const trimmed = block.trim();
                    if (trimmed.startsWith("### ")) {
                      return (
                        <h3
                          key={String(i)}
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: 700,
                            color: "var(--primary)",
                            margin: "1.5rem 0 0.75rem",
                          }}
                        >
                          {trimmed.replace(/^###\s+/, "")}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith("## ")) {
                      return (
                        <h2
                          key={String(i)}
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: 800,
                            color: "#ffffff",
                            margin: "2rem 0 0.75rem",
                          }}
                        >
                          {trimmed.replace(/^##\s+/, "")}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith("> ")) {
                      return (
                        <blockquote
                          key={String(i)}
                          style={{
                            borderRight: "4px solid var(--primary)",
                            background: "rgba(255, 71, 71, 0.05)",
                            padding: "0.875rem 1.25rem",
                            margin: "1.5rem 0",
                            borderRadius: "0.375rem",
                            fontStyle: "italic",
                          }}
                        >
                          {trimmed.replace(/^>\s+/, "")}
                        </blockquote>
                      );
                    }
                    return (
                      <p
                        key={String(i)}
                        style={{
                          marginBottom: "1.25rem",
                          textIndent: "1.5rem",
                        }}
                      >
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  لا يوجد نص مكتوب لهذا الفصل.
                </p>
              )}
            </div>
          )}
        </div>

        <div className={styles["modalFooter"]}>
          <button
            type="button"
            onClick={onClose}
            className={styles["btnSecondary"]}
          >
            إغلاق المعاينة
          </button>
        </div>
      </div>
    </div>
  );
}

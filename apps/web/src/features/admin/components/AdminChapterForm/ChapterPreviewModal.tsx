"use client";

import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { ChapterContentRenderer } from "@/features/content/components/ChapterContentRenderer";
import { cn } from "@/lib/utils";
import type { EditableChapterPage } from "../../model/admin-chapter-editor";
import type { EditableTextBlock } from "../../model/admin-chapter-text";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminChapterForm.module.css";

export function ChapterPreviewModal({
  isOpen,
  onClose,
  chapterNumber,
  chapterTitle,
  pages,
  savedNumber,
  savedTitle,
  savedPages,
  textBlocks,
  savedTextBlocks,
  contentType,
  hasSavedChapter,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  chapterNumber: number;
  chapterTitle: string;
  pages: readonly EditableChapterPage[];
  savedNumber: number;
  savedTitle: string;
  savedPages: readonly EditableChapterPage[];
  textBlocks: readonly EditableTextBlock[];
  savedTextBlocks: readonly EditableTextBlock[];
  contentType: "illustrated" | "text";
  hasSavedChapter: boolean;
}>) {
  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen,
    onClose,
  });
  const [view, setView] = useState<"draft" | "saved">("draft");
  if (!isOpen) return null;
  const unsaved =
    !hasSavedChapter ||
    chapterNumber !== savedNumber ||
    chapterTitle !== savedTitle ||
    (contentType === "illustrated"
      ? JSON.stringify(pages) !== JSON.stringify(savedPages)
      : JSON.stringify(textBlocks) !== JSON.stringify(savedTextBlocks));
  const showingSaved = view === "saved" && hasSavedChapter;

  return (
    <div
      className={styles["modalBackdrop"]}
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={styles["modalContent"]}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-modal-title"
        onKeyDown={onDialogKeyDown}
        tabIndex={-1}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className={styles["modalHeader"]}>
          <h2 id="preview-modal-title" className={styles["modalTitle"]}>
            <BookOpen aria-hidden="true" /> معاينة الفصل{" "}
            {showingSaved ? savedNumber : chapterNumber}:{" "}
            {showingSaved ? savedTitle : chapterTitle}
          </h2>
          <button
            type="button"
            className={styles["pageBtn"]}
            onClick={onClose}
            aria-label="إغلاق"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className={styles["modalBody"]}>
          {unsaved ? (
            <p role="status">
              توجد تغييرات غير محفوظة. هذه معاينة الترتيب الحالي.
            </p>
          ) : null}
          {hasSavedChapter ? (
            <div
              className={styles["actionsArea"]}
              role="group"
              aria-label="نسخة المعاينة"
            >
              <button
                type="button"
                className={cn(styles["btn"], styles["btnSecondary"])}
                aria-pressed={!showingSaved}
                onClick={() => {
                  setView("draft");
                }}
              >
                التعديلات الحالية
              </button>
              <button
                type="button"
                className={cn(styles["btn"], styles["btnSecondary"])}
                aria-pressed={showingSaved}
                onClick={() => {
                  setView("saved");
                }}
              >
                النسخة المحفوظة
              </button>
            </div>
          ) : null}
          {contentType === "text" ? (
            <ChapterContentRenderer
              document={
                (showingSaved ? savedTextBlocks : textBlocks).length === 0
                  ? null
                  : {
                      version: 1,
                      blocks: [
                        ...(showingSaved ? savedTextBlocks : textBlocks),
                      ],
                    }
              }
            />
          ) : (
            <ChapterContentRenderer pages={showingSaved ? savedPages : pages} />
          )}
        </div>
        <div className={styles["modalFooter"]}>
          <button
            type="button"
            className={cn(styles["btn"], styles["btnSecondary"])}
            onClick={onClose}
          >
            إغلاق المعاينة
          </button>
        </div>
      </div>
    </div>
  );
}

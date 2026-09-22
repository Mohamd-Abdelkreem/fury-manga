"use client";

import { X } from "lucide-react";

import { AdBlockNotice } from "@/features/advertising/components/AdBlockNotice/AdBlockNotice";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminAds.module.css";

export function AdminAdBlockPreviewModal({
  isOpen,
  onClose,
}: Readonly<{ isOpen: boolean; onClose: () => void }>) {
  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen,
    onClose,
  });
  if (!isOpen) return null;

  return (
    <div
      className={styles["modalBackdrop"]}
      role="dialog"
      aria-modal="true"
      aria-labelledby="adblock-preview-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={styles["modal"]}
        onKeyDown={onDialogKeyDown}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className={styles["previewHeading"]}>
          <h2 id="adblock-preview-title">معاينة رسالة تنبيه مانع الإعلانات</h2>
          <button type="button" onClick={onClose} aria-label="إغلاق المعاينة">
            <X aria-hidden="true" />
          </button>
        </div>
        <p>
          تظهر هذه الرسالة فقط في الصفحات التي تحتوي موضعًا إعلانيًا مفعّلًا.
        </p>
        <AdBlockNotice onRetry={() => undefined} onDismiss={() => undefined} />
        <button
          type="button"
          className={styles["primaryAction"]}
          onClick={onClose}
        >
          إغلاق المعاينة
        </button>
      </div>
    </div>
  );
}

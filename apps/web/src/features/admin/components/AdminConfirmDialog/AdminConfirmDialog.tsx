import React, { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import styles from "./AdminConfirmDialog.module.css";

interface AdminConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement;
    confirmBtnRef.current?.focus();

    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus();
      }
    };
  }, [isOpen]);

  const onDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
      return;
    }
    if (event.key !== "Tab") return;

    const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>(
      "button:not([disabled])",
    );
    if (!buttons || buttons.length === 0) return;

    const first = buttons.item(0);
    const last = buttons.item(buttons.length - 1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles["backdrop"]}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        ref={dialogRef}
        className={styles["dialog"]}
        onKeyDown={onDialogKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        tabIndex={-1}
      >
        <div className={styles["header"]}>
          <div className={styles["iconWrapper"]} aria-hidden="true">
            <AlertCircle className={styles["icon"]} />
          </div>
          <div className={styles["textGroup"]}>
            <h3 id="confirm-dialog-title" className={styles["title"]}>
              {title}
            </h3>
            <p id="confirm-dialog-desc" className={styles["description"]}>
              {description}
            </p>
          </div>
        </div>

        <div className={styles["footer"]}>
          <button
            type="button"
            onClick={onCancel}
            className={styles["cancelBtn"]}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className={styles["confirmBtn"]}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

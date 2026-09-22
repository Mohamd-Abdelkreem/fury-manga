"use client";

import React, { useState } from "react";
import { Megaphone, ShieldCheck, X } from "lucide-react";
import type {
  AdminAdPlacement,
  AdminAdPlacementType,
} from "../../types/admin.types";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminAds.module.css";

interface AdminAdPlacementDialogProps {
  placement: AdminAdPlacement | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<AdminAdPlacement>) => void;
}

export function AdminAdPlacementDialog({
  placement,
  isOpen,
  onClose,
  onSave,
}: AdminAdPlacementDialogProps) {
  const [name, setName] = useState(placement?.name ?? "");
  const [placementType, setPlacementType] = useState<AdminAdPlacementType>(
    placement?.type ?? "home_banner_primary",
  );
  const [dimensions, setDimensions] = useState(placement?.dimensions ?? "");
  const [enabled, setEnabled] = useState(placement?.enabled ?? true);
  const [codeSnippet, setCodeSnippet] = useState(placement?.codeSnippet ?? "");

  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen,
    onClose,
  });

  if (!isOpen || !placement) return null;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSave(placement.id, {
      name: name.trim() || placement.name,
      type: placementType,
      dimensions: dimensions.trim() || undefined,
      enabled,
      codeSnippet: codeSnippet.trim(),
    });
    onClose();
  };

  return (
    <div
      className={styles["modalBackdrop"]}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="placement-modal-title"
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
          <div className={styles["modalTitle"]} id="placement-modal-title">
            <Megaphone size={18} className="text-primary" />
            <span>تعديل المساحة الإعلانية</span>
          </div>
          <button
            type="button"
            className={styles["modalCloseBtn"]}
            onClick={onClose}
            aria-label="إغلاق النافذة"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles["modalBody"]}>
            <div className={styles["fieldGroup"]}>
              <label className={styles["fieldLabel"]}>
                اسم المساحة الإعلانية:
              </label>
              <input
                type="text"
                className={styles["fieldInput"]}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className={styles["fieldGroup"]}>
                <label className={styles["fieldLabel"]}>نوع الموضع:</label>
                <select
                  className={styles["fieldInput"]}
                  value={placementType}
                  onChange={(e) => {
                    setPlacementType(e.target.value as AdminAdPlacementType);
                  }}
                >
                  <option value="home_banner_primary">
                    إعلان البانر الرئيسي — أعلى الصفحة
                  </option>
                  <option value="home_banner_secondary">
                    إعلان البانر الثانوي — منتصف الصفحة
                  </option>
                  <option value="chapter_threshold_popunder">
                    إعلان البوب أندر لنقاط الفصول
                  </option>
                </select>
              </div>

              <div className={styles["fieldGroup"]}>
                <label className={styles["fieldLabel"]}>الأبعاد المحددة:</label>
                <input
                  type="text"
                  className={styles["fieldInput"]}
                  placeholder="مثال: 728x90 أو تلقائي"
                  value={dimensions}
                  onChange={(e) => {
                    setDimensions(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className={styles["fieldGroup"]}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => {
                    setEnabled(e.target.checked);
                  }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  تفعيل هذه المساحة الإعلانية
                </span>
              </label>
            </div>

            <div className={styles["fieldGroup"]}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <label className={styles["fieldLabel"]}>
                  كود الإعلان (Ad Script / Tag):
                </label>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#4ade80",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <ShieldCheck size={13} />
                  <span>محمي ومُعقّم برمجياً</span>
                </span>
              </div>

              <textarea
                className={styles["textareaCode"]}
                placeholder="<script async src='https://ad-network.com/tag.js'></script>..."
                value={codeSnippet}
                onChange={(e) => {
                  setCodeSnippet(e.target.value);
                }}
                rows={4}
              />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.45)",
                }}
              >
                ملاحظة أمنية: يتم التعامل مع هذا النص كنص مجرد خالص دون أي تنفيذ
                لشيفرات JavaScript في صفحة الإدارة.
              </span>
            </div>
          </div>

          <div className={styles["modalFooter"]}>
            <button
              type="button"
              className={styles["cancelBtn"]}
              onClick={onClose}
            >
              إلغاء
            </button>
            <button type="submit" className={styles["confirmBtn"]}>
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

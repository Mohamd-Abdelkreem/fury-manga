"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminAds.module.css";

interface AdminAdBlockPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminAdBlockPreviewModal({
  isOpen,
  onClose,
}: AdminAdBlockPreviewModalProps) {
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
      aria-labelledby="adblock-modal-title"
    >
      <div
        ref={dialogRef}
        className={styles["modalContent"]}
        onKeyDown={onDialogKeyDown}
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ maxWidth: "520px" }}
      >
        <div className={styles["modalHeader"]}>
          <div className={styles["modalTitle"]} id="adblock-modal-title">
            <ShieldAlert size={18} className="text-primary" />
            <span>معاينة رسالة تنبيه مانع الإعلانات (AdBlock)</span>
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

        <div className={styles["modalBody"]}>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
            }}
          >
            هذه الرسالة تظهر للقارئ عند بلوغ عتبة 9 نقاط قراءة إذا تم اكتشاف
            مانع إعلانات نشط يحجب الإعلان الإلزامي:
          </p>

          {/* User-facing Mockup */}
          <div
            style={{
              background: "#141414",
              border: "1px solid rgba(255, 71, 71, 0.3)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "1rem",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "9999px",
                background: "rgba(255, 71, 71, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
              }}
            >
              <AlertTriangle size={24} />
            </div>

            <div
              style={{
                fontWeight: 800,
                fontSize: "1.125rem",
                color: "#ffffff",
              }}
            >
              يرجى دعم منصة Fury بتعطيل مانع الإعلانات
            </div>

            <div
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.75)",
              }}
            >
              نحن نقدم جميع فصول المانجا والروايات مجاناً لجميع القراء. يساعدنا
              ظهور إعلان بسيط كل 3 فصول في تغطية تكاليف الخوادم ودعم المترجمين
              وصناع المحتوى.
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                width: "100%",
                marginTop: "0.5rem",
              }}
            >
              <button
                type="button"
                className={styles["confirmBtn"]}
                style={{ width: "100%" }}
                onClick={onClose}
              >
                لقد قمت بتعطيل مانع الإعلانات (إعادة الفحص)
              </button>
            </div>
          </div>

          <div
            style={{
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.45)",
              lineHeight: 1.5,
              background: "rgba(255, 255, 255, 0.02)",
              padding: "0.75rem",
              borderRadius: "0.5rem",
            }}
          >
            ملاحظة نظام النقاط: تستمر نقاط القراءة في التراكم (3 نقاط عند 75% من
            الفصل) حتى في حال تفعيل مانع الإعلانات أو تعطيل الإعلانات العامة.
          </div>
        </div>

        <div className={styles["modalFooter"]}>
          <button
            type="button"
            className={styles["cancelBtn"]}
            onClick={onClose}
          >
            إغلاق المعاينة
          </button>
        </div>
      </div>
    </div>
  );
}

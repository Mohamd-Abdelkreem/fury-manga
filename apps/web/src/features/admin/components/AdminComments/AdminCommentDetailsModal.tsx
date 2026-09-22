"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  MessageSquare,
  ShieldAlert,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminComment, AdminReport } from "../../types/admin.types";
import {
  ADMIN_COMMENT_STATUS_LABELS,
  ADMIN_REPORT_REASON_LABELS,
} from "../../types/admin.types";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminComments.module.css";

interface AdminCommentDetailsModalProps {
  comment: AdminComment | null;
  reports: AdminReport[];
  isOpen: boolean;
  onClose: () => void;
  onHide: (commentId: string, reason: string) => void;
  onRestore: (commentId: string) => void;
}

export function AdminCommentDetailsModal({
  comment,
  reports,
  isOpen,
  onClose,
  onHide,
  onRestore,
}: AdminCommentDetailsModalProps) {
  const [hideReason, setHideReason] = useState("");
  const [isHiding, setIsHiding] = useState(false);

  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen,
    onClose,
  });

  if (!isOpen || !comment) return null;

  const handleConfirmHide = () => {
    onHide(comment.id, hideReason.trim() || "مخالف لسياسة التعليقات");
    setIsHiding(false);
    onClose();
  };

  const handleConfirmRestore = () => {
    onRestore(comment.id);
    onClose();
  };

  return (
    <div
      className={styles["modalBackdrop"]}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comment-modal-title"
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
          <div className={styles["modalTitle"]} id="comment-modal-title">
            <MessageSquare size={18} className="text-primary" />
            <span>تفاصيل التعليق</span>
            <span
              className={cn(
                styles["statusBadge"],
                comment.status === "visible"
                  ? styles["statusActive"]
                  : styles["statusHidden"],
              )}
            >
              {ADMIN_COMMENT_STATUS_LABELS[comment.status]}
            </span>
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
          {/* Author & Target Details */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              background: "rgba(255, 255, 255, 0.02)",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.5)",
                  marginBottom: "0.25rem",
                }}
              >
                صاحب التعليق:
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div className={styles["avatar"]}>
                  <User size={14} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    {comment.userName}
                  </div>
                  <div className={styles["userHandle"]}>@{comment.userId}</div>
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.5)",
                  marginBottom: "0.25rem",
                }}
              >
                العمل والفصل:
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {comment.workTitle}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--primary)" }}>
                الفصل {comment.chapterNumber}
              </div>
            </div>
          </div>

          {/* Full Comment Text */}
          <div>
            <div
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "0.5rem",
              }}
            >
              نص التعليق الكامل:
            </div>
            <div className={styles["commentFullCard"]}>{comment.content}</div>
          </div>

          {/* Hidden Info if any */}
          {comment.status === "hidden" && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "0.875rem 1rem",
                borderRadius: "0.625rem",
                fontSize: "0.8125rem",
                color: "#ff6b6b",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>
                التعليق محجوب حالياً
              </div>
              {comment.hiddenReason && (
                <div>سبب الحجب: {comment.hiddenReason}</div>
              )}
            </div>
          )}

          {/* Related Reports */}
          {reports.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "#fbbf24",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  marginBottom: "0.5rem",
                }}
              >
                <ShieldAlert size={15} />
                <span>البلاغات المقدمة ضد هذا التعليق ({reports.length}):</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    style={{
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.15)",
                      padding: "0.625rem 0.875rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        {ADMIN_REPORT_REASON_LABELS[rep.reason]}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        بواسطة {rep.reporterName} • {rep.createdAt}
                      </span>
                    </div>
                    {rep.description && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(255, 255, 255, 0.7)",
                          marginTop: "0.25rem",
                        }}
                      >
                        تفاصيل البلاغ: {rep.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In-modal Hide Action Form */}
          {isHiding && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                padding: "1rem",
                borderRadius: "0.625rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#ff6b6b",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <AlertTriangle size={16} />
                <span>تأكيد إخفاء التعليق عن الجمهور</span>
              </div>
              <textarea
                className={styles["reasonInput"]}
                placeholder="اكتب سبب إخفاء هذا التعليق (مخالف، سب، حرق أحداث...)..."
                value={hideReason}
                onChange={(e) => {
                  setHideReason(e.target.value);
                }}
                autoFocus
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  className={styles["cancelBtn"]}
                  onClick={() => {
                    setIsHiding(false);
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className={cn(styles["confirmBtn"], styles["actionBtnHide"])}
                  onClick={handleConfirmHide}
                >
                  تأكيد الإخفاء
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles["modalFooter"]}>
          {!isHiding && (
            <>
              {comment.status === "visible" ? (
                <button
                  type="button"
                  className={cn(styles["actionBtn"], styles["actionBtnHide"])}
                  onClick={() => {
                    setIsHiding(true);
                  }}
                >
                  <EyeOff size={14} />
                  <span>إخفاء التعليق</span>
                </button>
              ) : (
                <button
                  type="button"
                  className={cn(
                    styles["actionBtn"],
                    styles["actionBtnRestore"],
                  )}
                  onClick={handleConfirmRestore}
                >
                  <Eye size={14} />
                  <span>استعادة التعليق</span>
                </button>
              )}
            </>
          )}
          <button
            type="button"
            className={styles["cancelBtn"]}
            onClick={onClose}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

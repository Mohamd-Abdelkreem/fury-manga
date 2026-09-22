"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AdminComment,
  AdminReport,
  AdminReportResolution,
  AdminReportStatus,
} from "../../types/admin.types";
import {
  ADMIN_REPORT_REASON_LABELS,
  ADMIN_REPORT_RESOLUTION_LABELS,
  ADMIN_REPORT_STATUS_LABELS,
} from "../../types/admin.types";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminReports.module.css";

interface AdminReportDetailsModalProps {
  report: AdminReport | null;
  relatedReports: AdminReport[];
  targetComment?: AdminComment | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    reportId: string,
    status: AdminReportStatus,
    resolutionOutcome?: AdminReportResolution,
    resolutionNote?: string,
  ) => void;
  onResolveRelated: (
    commentId: string,
    resolutionOutcome: AdminReportResolution,
    resolutionNote?: string,
  ) => void;
  onDismiss: (reportId: string, notes?: string) => void;
  onHideComment?: (commentId: string, reason: string) => void;
}

export function AdminReportDetailsModal({
  report,
  relatedReports,
  targetComment,
  isOpen,
  onClose,
  onUpdateStatus,
  onResolveRelated,
  onDismiss,
  onHideComment,
}: AdminReportDetailsModalProps) {
  const [resolution, setResolution] =
    useState<AdminReportResolution>("comment_hidden");
  const [notes, setNotes] = useState("");
  const [applyToAll, setApplyToAll] = useState(true);

  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen,
    onClose,
  });

  if (!isOpen || !report) return null;

  const isResolvedOrDismissed =
    report.status === "resolved" || report.status === "dismissed";

  const handleStartReview = () => {
    onUpdateStatus(report.id, "under_review");
  };

  const handleExecuteResolution = () => {
    if (applyToAll && relatedReports.length > 1) {
      onResolveRelated(report.commentId, resolution, notes.trim() || undefined);
    } else {
      onUpdateStatus(
        report.id,
        "resolved",
        resolution,
        notes.trim() || undefined,
      );
      if (resolution === "comment_hidden" && onHideComment) {
        onHideComment(
          report.commentId,
          notes.trim() || "تم الحجب بناءً على تقرير المشرف",
        );
      }
    }
    onClose();
  };

  const handleExecuteDismiss = () => {
    onDismiss(report.id, notes.trim() || undefined);
    onClose();
  };

  return (
    <div
      className={styles["modalBackdrop"]}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
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
          <div className={styles["modalTitle"]} id="report-modal-title">
            <ShieldAlert size={18} className="text-primary" />
            <span>تفاصيل البلاغ #{report.id}</span>
            <span
              className={cn(
                styles["statusBadge"],
                report.status === "open" && styles["statusPending"],
                report.status === "under_review" && styles["statusInReview"],
                report.status === "resolved" && styles["statusResolved"],
                report.status === "dismissed" && styles["statusDismissed"],
              )}
            >
              {ADMIN_REPORT_STATUS_LABELS[report.status]}
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
          {/* Metadata Grid */}
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
                مقدم البلاغ:
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                {report.reporterName}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.45)",
                }}
              >
                {report.reporterId.startsWith("user-")
                  ? "عضو مسجل"
                  : "زائر للموقع"}{" "}
                • {report.createdAt}
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
                الهدف المبلغ عنه:
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {report.workTitle}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--primary)" }}>
                الفصل {report.chapterNumber} • الكاتب: {report.reportedUserName}
              </div>
            </div>
          </div>

          {/* Reason & Reporter Details */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.35rem",
              }}
            >
              <span className={styles["fieldLabel"]}>سبب البلاغ:</span>
              <span
                className={cn(
                  styles["reasonBadge"],
                  report.reason === "spoiler" && styles["reasonSpoiler"],
                  report.reason === "abuse" && styles["reasonAbuse"],
                  report.reason === "spam" && styles["reasonSpam"],
                  report.reason === "inappropriate" &&
                    styles["reasonInappropriate"],
                  report.reason === "other" && styles["reasonOther"],
                )}
              >
                {ADMIN_REPORT_REASON_LABELS[report.reason]}
              </span>
            </div>
            {report.description && (
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                {report.description}
              </div>
            )}
          </div>

          {/* Target Content Preview */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.35rem",
              }}
            >
              <span className={styles["fieldLabel"]}>
                معاينة التعليق المبلغ عنه:
              </span>
              {targetComment && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color:
                      targetComment.status === "visible"
                        ? "#4ade80"
                        : "#ff6b6b",
                  }}
                >
                  حالة التعليق الآن:{" "}
                  {targetComment.status === "visible" ? "ظاهر" : "محجوب"}
                </span>
              )}
            </div>

            <div className={styles["previewCard"]}>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {targetComment ? targetComment.content : report.commentSnippet}
              </div>
            </div>
          </div>

          {/* Related Reports Alert */}
          {relatedReports.length > 1 && (
            <div
              style={{
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.8125rem",
                color: "#fbbf24",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <AlertTriangle size={15} />
                <span>
                  تنبيه: يوجد {relatedReports.length} بلاغات مقدمة ضد هذا
                  المحتوى نفسه
                </span>
              </div>
              <div style={{ marginTop: "0.25rem", opacity: 0.9 }}>
                الأسباب المقدمة تشمل:{" "}
                {Array.from(
                  new Set(
                    relatedReports.map(
                      (r) => ADMIN_REPORT_REASON_LABELS[r.reason],
                    ),
                  ),
                ).join("، ")}
              </div>
            </div>
          )}

          {/* Already Resolved / Dismissed Box */}
          {isResolvedOrDismissed ? (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "1rem",
                borderRadius: "0.625rem",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#ffffff",
                  marginBottom: "0.35rem",
                }}
              >
                نتيجة المعالجة:
              </div>
              {report.resolutionOutcome && (
                <div style={{ fontSize: "0.8125rem", color: "var(--primary)" }}>
                  الإجراء المتخذ:{" "}
                  {ADMIN_REPORT_RESOLUTION_LABELS[report.resolutionOutcome]}
                </div>
              )}
              {report.resolutionNote && (
                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: "rgba(255, 255, 255, 0.7)",
                    marginTop: "0.25rem",
                  }}
                >
                  ملاحظات الإشراف: {report.resolutionNote}
                </div>
              )}
              {report.resolvedAt && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.4)",
                    marginTop: "0.35rem",
                  }}
                >
                  تاريخ الإجراء: {report.resolvedAt}
                </div>
              )}
            </div>
          ) : (
            /* Action / Resolution Form */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
                background: "rgba(255, 255, 255, 0.02)",
                padding: "1rem",
                borderRadius: "0.625rem",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#ffffff",
                }}
              >
                اتخاذ إجراء إشرافي:
              </div>

              <div>
                <label className={styles["fieldLabel"]}>نوع الإجراء:</label>
                <select
                  className={styles["fieldInput"]}
                  value={resolution}
                  onChange={(e) => {
                    setResolution(e.target.value as AdminReportResolution);
                  }}
                  style={{ marginTop: "0.25rem" }}
                >
                  <option value="comment_hidden">
                    إخفاء التعليق المخالف (حجب)
                  </option>
                  <option value="no_violation">
                    لا توجد مخالفة لمعايير النشر
                  </option>
                  <option value="duplicate">بلاغ مكرر وتم دمجه</option>
                  <option value="user_reviewed">مراجعة حساب المستخدم</option>
                </select>
              </div>

              <div>
                <label className={styles["fieldLabel"]}>
                  ملاحظات المشرف (سجل داخلي):
                </label>
                <textarea
                  className={styles["textareaInput"]}
                  placeholder="سبب اتخاذ هذا الإجراء..."
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                  }}
                  style={{ marginTop: "0.25rem" }}
                />
              </div>

              {relatedReports.length > 1 && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8125rem",
                    color: "rgba(255, 255, 255, 0.85)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={applyToAll}
                    onChange={(e) => {
                      setApplyToAll(e.target.checked);
                    }}
                  />
                  <span>
                    تطبيق هذا الإجراء وحل جميع البلاغات ({relatedReports.length}
                    ) المرتبطة بهذا المحتوى دفعة واحدة
                  </span>
                </label>
              )}
            </div>
          )}
        </div>

        <div className={styles["modalFooter"]}>
          {!isResolvedOrDismissed && (
            <>
              {report.status === "open" && (
                <button
                  type="button"
                  className={styles["cancelBtn"]}
                  onClick={handleStartReview}
                >
                  نقل إلى قيد المراجعة
                </button>
              )}
              <button
                type="button"
                className={cn(styles["actionBtn"], styles["actionBtnDismiss"])}
                onClick={handleExecuteDismiss}
              >
                رفض البلاغ
              </button>
              <button
                type="button"
                className={styles["confirmBtn"]}
                onClick={handleExecuteResolution}
              >
                تنفيذ المعالجة
              </button>
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

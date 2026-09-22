"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import type {
  AdminActivityEvent,
  AdminComment,
  AdminReport,
  AdminReportResolution,
  AdminReportStatus,
} from "../types/admin.types";

interface AdminModerationActionState {
  comments: AdminComment[];
  setComments: Dispatch<SetStateAction<AdminComment[]>>;
  reports: AdminReport[];
  setReports: Dispatch<SetStateAction<AdminReport[]>>;
  setActivities: Dispatch<SetStateAction<AdminActivityEvent[]>>;
  actorName: string;
}

export function useAdminModerationActions({
  comments,
  setComments,
  reports,
  setReports,
  setActivities,
  actorName,
}: AdminModerationActionState) {
  const getComment = useCallback(
    (commentId: string): AdminComment | undefined =>
      comments.find((c) => c.id.toLowerCase() === commentId.toLowerCase()),
    [comments],
  );

  const hideComment = useCallback(
    (commentId: string, reason?: string): void => {
      setComments((prev) =>
        prev.map((c) =>
          c.id.toLowerCase() === commentId.toLowerCase()
            ? {
                ...c,
                status: "hidden",
                hiddenReason:
                  reason ?? c.hiddenReason ?? "مخالف لسياسة المحتوى",
                hiddenAt: "الآن",
              }
            : c,
        ),
      );
      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "report_opened",
          title: "إخفاء تعليق مخالف",
          description: `تم إخفاء التعليق '${commentId}' ${reason ? `لسبب: ${reason}` : ""}.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);
    },
    [actorName, setActivities, setComments],
  );

  const restoreComment = useCallback(
    (commentId: string): void => {
      setComments((prev) =>
        prev.map((c) =>
          c.id.toLowerCase() === commentId.toLowerCase()
            ? {
                ...c,
                status: "visible",
                hiddenReason: undefined,
              }
            : c,
        ),
      );
      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "report_opened",
          title: "استعادة تعليق",
          description: `تمت استعادة تفعيل التعليق '${commentId}'.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);
    },
    [actorName, setActivities, setComments],
  );

  const getReport = useCallback(
    (reportId: string): AdminReport | undefined =>
      reports.find((r) => r.id.toLowerCase() === reportId.toLowerCase()),
    [reports],
  );

  const getReportsForComment = useCallback(
    (commentId: string): AdminReport[] =>
      reports.filter(
        (r) => r.commentId.toLowerCase() === commentId.toLowerCase(),
      ),
    [reports],
  );

  const updateReportStatus = useCallback(
    (
      reportId: string,
      status: AdminReportStatus,
      resolutionOutcome?: AdminReportResolution,
      resolutionNote?: string,
    ): void => {
      setReports((prev) =>
        prev.map((r) =>
          r.id.toLowerCase() === reportId.toLowerCase()
            ? {
                ...r,
                status,
                resolutionOutcome: resolutionOutcome ?? r.resolutionOutcome,
                resolutionNote:
                  resolutionNote !== undefined
                    ? resolutionNote
                    : r.resolutionNote,
                resolvedAt:
                  status === "resolved" || status === "dismissed"
                    ? "الآن"
                    : r.resolvedAt,
              }
            : r,
        ),
      );
    },
    [setReports],
  );

  const resolveRelatedReports = useCallback(
    (
      commentId: string,
      resolutionOutcome: AdminReportResolution,
      resolutionNote?: string,
    ): void => {
      setReports((prev) =>
        prev.map((r) =>
          r.commentId.toLowerCase() === commentId.toLowerCase()
            ? {
                ...r,
                status: "resolved",
                resolutionOutcome,
                resolutionNote:
                  resolutionNote !== undefined
                    ? resolutionNote
                    : r.resolutionNote,
                resolvedAt: "الآن",
              }
            : r,
        ),
      );
      if (resolutionOutcome === "comment_hidden") {
        hideComment(
          commentId,
          resolutionNote ?? "تم حذف/إخفاء التعليق بناءً على البلاغات",
        );
      }
    },
    [hideComment, setReports],
  );

  const dismissReport = useCallback(
    (reportId: string, notes?: string): void => {
      setReports((prev) =>
        prev.map((r) =>
          r.id.toLowerCase() === reportId.toLowerCase()
            ? {
                ...r,
                status: "dismissed",
                resolutionOutcome: "no_violation",
                resolutionNote: notes !== undefined ? notes : r.resolutionNote,
                resolvedAt: "الآن",
              }
            : r,
        ),
      );
    },
    [setReports],
  );

  return {
    getComment,
    hideComment,
    restoreComment,
    getReport,
    getReportsForComment,
    updateReportStatus,
    resolveRelatedReports,
    dismissReport,
  };
}

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  EyeOff,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminData } from "../../context/admin-context";
import { useAdminPagination } from "../../hooks/use-admin-pagination";
import type { AdminReport } from "../../types/admin.types";
import {
  ADMIN_REPORT_REASON_LABELS,
  ADMIN_REPORT_STATUS_LABELS,
} from "../../types/admin.types";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminPagination } from "../AdminPagination/AdminPagination";
import { AdminReportDetailsModal } from "./AdminReportDetailsModal";
import styles from "./AdminReports.module.css";

const ITEMS_PER_PAGE = 8;

export function AdminReports() {
  const searchParams = useSearchParams();
  const paramCommentId = searchParams.get("commentId");

  const {
    reports,
    getComment,
    hideComment,
    updateReportStatus,
    resolveRelatedReports,
    dismissReport,
  } = useAdminData();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reasonFilter, setReasonFilter] = useState<string>("all");

  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Group report counts by commentId
  const targetReportCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of reports) {
      counts.set(r.commentId, (counts.get(r.commentId) ?? 0) + 1);
    }
    return counts;
  }, [reports]);

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Query param commentId filter
      if (
        paramCommentId &&
        r.commentId.toLowerCase() !== paramCommentId.toLowerCase()
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesReporter = r.reporterName.toLowerCase().includes(q);
        const matchesTargetUser = r.reportedUserName.toLowerCase().includes(q);
        const matchesWork = r.workTitle.toLowerCase().includes(q);
        const matchesDetails = (r.description ?? "").toLowerCase().includes(q);
        const matchesId = r.id.toLowerCase().includes(q);
        if (
          !matchesReporter &&
          !matchesTargetUser &&
          !matchesWork &&
          !matchesDetails &&
          !matchesId
        ) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "all" && r.status !== statusFilter) {
        return false;
      }

      // Reason
      if (reasonFilter !== "all" && r.reason !== reasonFilter) {
        return false;
      }

      return true;
    });
  }, [reports, paramCommentId, searchQuery, statusFilter, reasonFilter]);

  // Metrics
  const {
    currentPage,
    totalPages,
    pageItems: paginatedReports,
    setCurrentPage,
  } = useAdminPagination(filteredReports, ITEMS_PER_PAGE);

  const metrics = useMemo(() => {
    const pending = reports.filter((r) => r.status === "open").length;
    const inReview = reports.filter((r) => r.status === "under_review").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const dismissed = reports.filter((r) => r.status === "dismissed").length;
    return { pending, inReview, resolved, dismissed };
  }, [reports]);

  const handleOpenDetails = (report: AdminReport) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedReport(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setReasonFilter("all");
  };

  const hasActiveFilters =
    Boolean(paramCommentId) ||
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    reasonFilter !== "all";

  return (
    <div className={styles["container"]}>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "البلاغات" },
        ]}
        title="إدارة البلاغات والمخالفات"
        description="استعراض بلاغات القراء حول المحتوى المخالف أو حرق الأحداث، وفحص التعليقات واتخاذ الإجراءات الإشرافية المناسبة."
      />

      {/* Metrics Grid */}
      <div className={styles["metricsGrid"]}>
        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapPending"],
            )}
          >
            <ShieldAlert size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>قيد الانتظار (مفتوح)</span>
            <span className={styles["metricValue"]}>
              {metrics.pending.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapReview"],
            )}
          >
            <Clock size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>قيد المراجعة</span>
            <span className={styles["metricValue"]}>
              {metrics.inReview.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapResolved"],
            )}
          >
            <CheckCircle2 size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>تمت المعالجة</span>
            <span className={styles["metricValue"]}>
              {metrics.resolved.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapDismissed"],
            )}
          >
            <XCircle size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>تم الرفض</span>
            <span className={styles["metricValue"]}>
              {metrics.dismissed.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>
      </div>

      {/* Filter by Target Notice (if coming from Comments page) */}
      {paramCommentId && (
        <div
          style={{
            background: "rgba(255, 71, 71, 0.1)",
            border: "1px solid rgba(255, 71, 71, 0.3)",
            padding: "0.875rem 1.25rem",
            borderRadius: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={16} color="var(--primary)" />
            <span style={{ fontSize: "0.875rem", color: "#ffffff" }}>
              يتم الآن عرض البلاغات الخاصة بالتعليق:{" "}
              <strong>#{paramCommentId}</strong>
            </span>
          </div>
          <Link
            href="/admin/reports"
            style={{
              fontSize: "0.8125rem",
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            عرض جميع البلاغات
          </Link>
        </div>
      )}

      {/* Controls Card */}
      <div className={styles["controlsCard"]}>
        <div className={styles["searchField"]}>
          <Search className={styles["searchIcon"]} />
          <input
            type="text"
            className={styles["searchInput"]}
            placeholder="بحث بالمبلغ، الكاتب، العمل، أو تفاصيل البلاغ..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            aria-label="بحث في البلاغات"
          />
        </div>

        <div className={styles["filtersRow"]}>
          <select
            className={styles["filterSelect"]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
            aria-label="تصفية حسب الحالة"
          >
            <option value="all">جميع الحالات</option>
            <option value="open">قيد الانتظار (مفتوح)</option>
            <option value="under_review">قيد المراجعة</option>
            <option value="resolved">تمت المعالجة</option>
            <option value="dismissed">تم الرفض</option>
          </select>

          <select
            className={styles["filterSelect"]}
            value={reasonFilter}
            onChange={(e) => {
              setReasonFilter(e.target.value);
            }}
            aria-label="تصفية حسب السبب"
          >
            <option value="all">جميع الأسباب</option>
            <option value="spoiler">حرق أحداث</option>
            <option value="abuse">إساءة أو تنمر</option>
            <option value="spam">إعلانات مضللة أو سبام</option>
            <option value="inappropriate">محتوى غير لائق</option>
            <option value="other">أسباب أخرى</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              className={styles["resetBtn"]}
              onClick={handleResetFilters}
            >
              إعادة الضبط
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className={styles["tableCard"]}>
        {filteredReports.length === 0 ? (
          <div className={styles["emptyState"]}>
            <ShieldAlert className={styles["emptyIcon"]} />
            <div className={styles["emptyTitle"]}>
              لا توجد بلاغات تطابق البحث
            </div>
            <div className={styles["emptySubtitle"]}>
              لم نتمكن من إيجاد بلاغات تطابق المعايير المحددة.
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                className={styles["actionBtn"]}
                onClick={handleResetFilters}
              >
                مسح التصفية
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={styles["tableWrapper"]}>
              <table className={styles["table"]}>
                <thead className={styles["thead"]}>
                  <tr>
                    <th className={styles["th"]}>مقدم البلاغ</th>
                    <th className={styles["th"]}>الهدف المبلغ عنه</th>
                    <th className={styles["th"]}>سبب البلاغ</th>
                    <th className={styles["th"]}>تفاصيل الشكوى</th>
                    <th className={styles["th"]}>الحالة</th>
                    <th className={styles["th"]}>التاريخ</th>
                    <th className={styles["th"]}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.map((report) => {
                    const targetCount =
                      targetReportCounts.get(report.commentId) ?? 1;
                    const isOpen = report.status === "open";

                    return (
                      <tr key={report.id} className={styles["tr"]}>
                        {/* Reporter */}
                        <td className={styles["td"]}>
                          <div className={styles["reporterCell"]}>
                            <span className={styles["reporterName"]}>
                              {report.reporterName}
                            </span>
                            <span className={styles["reporterType"]}>
                              {report.reporterId.startsWith("user-")
                                ? "عضو مسجل"
                                : "زائر"}
                            </span>
                          </div>
                        </td>

                        {/* Target */}
                        <td className={styles["td"]}>
                          <div className={styles["targetCell"]}>
                            <span className={styles["targetTitle"]}>
                              {report.workTitle}
                            </span>
                            <div className={styles["targetMeta"]}>
                              <span>الفصل {report.chapterNumber}</span>
                              <span>•</span>
                              <span>الكاتب: {report.reportedUserName}</span>
                            </div>
                            {targetCount > 1 && (
                              <span
                                className={styles["clusterBadge"]}
                                title="توجد بلاغات أخرى متعددة لنفس هذا المحتوى"
                              >
                                <AlertTriangle size={11} />
                                <span>{targetCount} بلاغات لنفس المحتوى</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Reason */}
                        <td className={styles["td"]}>
                          <span
                            className={cn(
                              styles["reasonBadge"],
                              report.reason === "spoiler" &&
                                styles["reasonSpoiler"],
                              report.reason === "abuse" &&
                                styles["reasonAbuse"],
                              report.reason === "spam" && styles["reasonSpam"],
                              report.reason === "inappropriate" &&
                                styles["reasonInappropriate"],
                              report.reason === "other" &&
                                styles["reasonOther"],
                            )}
                          >
                            {ADMIN_REPORT_REASON_LABELS[report.reason]}
                          </span>
                        </td>

                        {/* Details */}
                        <td className={styles["td"]}>
                          <div className={styles["detailsCell"]}>
                            {report.description || report.commentSnippet || "—"}
                          </div>
                        </td>

                        {/* Status */}
                        <td className={styles["td"]}>
                          <span
                            className={cn(
                              styles["statusBadge"],
                              report.status === "open" &&
                                styles["statusPending"],
                              report.status === "under_review" &&
                                styles["statusInReview"],
                              report.status === "resolved" &&
                                styles["statusResolved"],
                              report.status === "dismissed" &&
                                styles["statusDismissed"],
                            )}
                          >
                            {ADMIN_REPORT_STATUS_LABELS[report.status]}
                          </span>
                        </td>

                        {/* Date */}
                        <td className={styles["td"]}>
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              color: "rgba(255, 255, 255, 0.5)",
                            }}
                          >
                            {report.createdAt}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className={styles["td"]}>
                          <div className={styles["actionsCell"]}>
                            <button
                              type="button"
                              className={styles["actionBtn"]}
                              onClick={() => {
                                handleOpenDetails(report);
                              }}
                              title="فحص المحتوى وتفاصيل البلاغ"
                            >
                              <span>فحص</span>
                            </button>

                            {isOpen && (
                              <button
                                type="button"
                                className={cn(
                                  styles["actionBtn"],
                                  styles["actionBtnResolve"],
                                )}
                                onClick={() => {
                                  updateReportStatus(
                                    report.id,
                                    "resolved",
                                    "comment_hidden",
                                    "تم الإخفاء السريع من جدول البلاغات",
                                  );
                                  hideComment(
                                    report.commentId,
                                    "مخالف لسياسة التعليقات (معالجة سريعة)",
                                  );
                                }}
                                title="حذف التعليق المخالف فوراً"
                              >
                                <EyeOff size={13} />
                                <span>حذف</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 ? (
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredReports.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                itemName={"بلاغ"}
              />
            ) : null}
          </>
        )}
      </div>

      {/* Details Modal */}
      <AdminReportDetailsModal
        key={selectedReport?.id ?? "none"}
        report={selectedReport}
        relatedReports={
          selectedReport
            ? reports.filter(
                (r) =>
                  r.commentId.toLowerCase() ===
                  selectedReport.commentId.toLowerCase(),
              )
            : []
        }
        targetComment={
          selectedReport ? getComment(selectedReport.commentId) : undefined
        }
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onUpdateStatus={updateReportStatus}
        onResolveRelated={resolveRelatedReports}
        onDismiss={dismissReport}
        onHideComment={hideComment}
      />
    </div>
  );
}

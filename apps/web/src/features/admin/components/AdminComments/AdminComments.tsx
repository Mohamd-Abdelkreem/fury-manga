"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  MessageSquare,
  Search,
  ShieldAlert,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminData } from "../../context/admin-context";
import { useAdminPagination } from "../../hooks/use-admin-pagination";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import type { AdminComment } from "../../types/admin.types";
import { ADMIN_COMMENT_STATUS_LABELS } from "../../types/admin.types";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminPagination } from "../AdminPagination/AdminPagination";
import { AdminCommentDetailsModal } from "./AdminCommentDetailsModal";
import styles from "./AdminComments.module.css";

const ITEMS_PER_PAGE = 8;

export function AdminComments() {
  const searchParams = useSearchParams();
  const paramCommentId = searchParams.get("commentId");

  const { comments, reports, hideComment, restoreComment } = useAdminData();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reportedFilter, setReportedFilter] = useState<string>("all");
  const [workFilter, setWorkFilter] = useState<string>("all");

  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    () => paramCommentId,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(() =>
    Boolean(paramCommentId),
  );
  const [quickHideComment, setQuickHideComment] = useState<AdminComment | null>(
    null,
  );
  const [quickHideReason, setQuickHideReason] = useState("");

  const {
    dialogRef: quickHideDialogRef,
    onDialogKeyDown: onQuickHideDialogKeyDown,
  } = useAdminDialogFocus({
    isOpen: Boolean(quickHideComment),
    onClose: () => {
      setQuickHideComment(null);
    },
  });

  const selectedComment = useMemo(() => {
    if (!selectedCommentId) return null;
    return (
      comments.find(
        (c) => c.id.toLowerCase() === selectedCommentId.toLowerCase(),
      ) ?? null
    );
  }, [comments, selectedCommentId]);

  // Extract unique works from comments
  const uniqueWorks = useMemo(() => {
    const worksMap = new Map<string, string>();
    for (const c of comments) {
      worksMap.set(c.workId, c.workTitle);
    }
    return Array.from(worksMap.entries()).map(([id, title]) => ({
      id,
      title,
    }));
  }, [comments]);

  // Filtered comments
  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesContent = c.content.toLowerCase().includes(q);
        const matchesUser =
          c.userName.toLowerCase().includes(q) ||
          c.userId.toLowerCase().includes(q);
        const matchesWork = c.workTitle.toLowerCase().includes(q);
        const matchesChapter =
          c.chapterNumber !== undefined &&
          c.chapterNumber.toString().includes(q);
        if (
          !matchesContent &&
          !matchesUser &&
          !matchesWork &&
          !matchesChapter
        ) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "all" && c.status !== statusFilter) {
        return false;
      }

      // Reported filter
      if (reportedFilter === "reported_only" && c.reportCount === 0) {
        return false;
      }

      // Work filter
      if (workFilter !== "all" && c.workId !== workFilter) {
        return false;
      }

      return true;
    });
  }, [comments, searchQuery, statusFilter, reportedFilter, workFilter]);

  // Metrics
  const {
    currentPage,
    totalPages,
    pageItems: paginatedComments,
    setCurrentPage,
  } = useAdminPagination(filteredComments, ITEMS_PER_PAGE);

  const metrics = useMemo(() => {
    const total = comments.length;
    const active = comments.filter((c) => c.status === "visible").length;
    const hidden = comments.filter((c) => c.status === "hidden").length;
    const reported = comments.filter((c) => c.reportCount > 0).length;
    return { total, active, hidden, reported };
  }, [comments]);

  const handleOpenDetails = (comment: AdminComment) => {
    setSelectedCommentId(comment.id);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedCommentId(null);
  };

  const handleQuickHide = (comment: AdminComment) => {
    setQuickHideComment(comment);
    setQuickHideReason("");
  };

  const handleConfirmQuickHide = () => {
    if (quickHideComment) {
      hideComment(
        quickHideComment.id,
        quickHideReason.trim() || "مخالف لسياسة المجتمع",
      );
      setQuickHideComment(null);
      setQuickHideReason("");
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setReportedFilter("all");
    setWorkFilter("all");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    reportedFilter !== "all" ||
    workFilter !== "all";

  return (
    <div className={styles["container"]}>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "التعليقات" },
        ]}
        title="إدارة ومراقبة التعليقات"
        description="متابعة تعليقات القراء عبر جميع الأعمال والفصول، والتعامل الفوري مع البلاغات وإخفاء التعليقات المسيئة."
      />

      {/* Metrics Grid */}
      <div className={styles["metricsGrid"]}>
        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapPrimary"],
            )}
          >
            <MessageSquare size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>إجمالي التعليقات</span>
            <span className={styles["metricValue"]}>
              {metrics.total.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapSuccess"],
            )}
          >
            <CheckCircle2 size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>تعليقات نشطة</span>
            <span className={styles["metricValue"]}>
              {metrics.active.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapWarning"],
            )}
          >
            <ShieldAlert size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>
              تعليقات تم الإبلاغ عنها
            </span>
            <span className={styles["metricValue"]}>
              {metrics.reported.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapMuted"],
            )}
          >
            <EyeOff size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>تعليقات محجوبة</span>
            <span className={styles["metricValue"]}>
              {metrics.hidden.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className={styles["controlsCard"]}>
        <div className={styles["searchField"]}>
          <Search className={styles["searchIcon"]} />
          <input
            type="text"
            className={styles["searchInput"]}
            placeholder="بحث في محتوى التعليق، المستخدم، العمل..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            aria-label="بحث في التعليقات"
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
            <option value="visible">ظاهر للقراء فقط</option>
            <option value="hidden">محجوب فقط</option>
          </select>

          <select
            className={styles["filterSelect"]}
            value={reportedFilter}
            onChange={(e) => {
              setReportedFilter(e.target.value);
            }}
            aria-label="تصفية حسب البلاغات"
          >
            <option value="all">جميع التعليقات</option>
            <option value="reported_only">المبلغ عنها فقط</option>
          </select>

          <select
            className={styles["filterSelect"]}
            value={workFilter}
            onChange={(e) => {
              setWorkFilter(e.target.value);
            }}
            aria-label="تصفية حسب العمل"
          >
            <option value="all">جميع الأعمال</option>
            {uniqueWorks.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
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
        {filteredComments.length === 0 ? (
          <div className={styles["emptyState"]}>
            <MessageSquare className={styles["emptyIcon"]} />
            <div className={styles["emptyTitle"]}>لا توجد تعليقات مطابقة</div>
            <div className={styles["emptySubtitle"]}>
              لم نجد أي تعليقات تطابق معايير البحث أو التصفية الحالية. جرب تعديل
              مصطلحات البحث.
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
                    <th className={styles["th"]}>المستخدم</th>
                    <th className={styles["th"]}>العمل والفصل</th>
                    <th className={styles["th"]}>نص التعليق</th>
                    <th className={styles["th"]}>البلاغات</th>
                    <th className={styles["th"]}>الحالة</th>
                    <th className={styles["th"]}>التاريخ</th>
                    <th className={styles["th"]}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedComments.map((comment) => {
                    const isHidden = comment.status === "hidden";

                    return (
                      <tr key={comment.id} className={styles["tr"]}>
                        {/* User */}
                        <td className={styles["td"]}>
                          <div className={styles["userCell"]}>
                            <div className={styles["avatar"]}>
                              <User size={14} />
                            </div>
                            <div className={styles["userMeta"]}>
                              <span className={styles["userName"]}>
                                {comment.userName}
                              </span>
                              <span className={styles["userHandle"]}>
                                @{comment.userId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Target Work & Chapter */}
                        <td className={styles["td"]}>
                          <div className={styles["targetCell"]}>
                            <span className={styles["workTitle"]}>
                              {comment.workTitle}
                            </span>
                            <span className={styles["chapterBadge"]}>
                              الفصل {comment.chapterNumber}
                            </span>
                          </div>
                        </td>

                        {/* Comment Snippet */}
                        <td className={styles["td"]}>
                          <div className={styles["commentContentCell"]}>
                            <div className={styles["commentText"]}>
                              {comment.content}
                            </div>
                            {comment.content.length > 70 && (
                              <button
                                type="button"
                                className={styles["moreBtn"]}
                                onClick={() => {
                                  handleOpenDetails(comment);
                                }}
                              >
                                عرض المزيد
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Reports */}
                        <td className={styles["td"]}>
                          {comment.reportCount > 0 ? (
                            <Link
                              href={
                                `/admin/reports?commentId=${comment.id}` as Route
                              }
                              className={styles["reportsBadge"]}
                              title="عرض تفاصيل البلاغات"
                            >
                              <ShieldAlert size={12} />
                              <span>
                                {comment.reportCount.toLocaleString("ar-EG")}{" "}
                                بلاغ
                              </span>
                            </Link>
                          ) : (
                            <span className={styles["noReports"]}>
                              لا توجد بلاغات
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className={styles["td"]}>
                          <span
                            className={cn(
                              styles["statusBadge"],
                              isHidden
                                ? styles["statusHidden"]
                                : styles["statusActive"],
                            )}
                          >
                            {ADMIN_COMMENT_STATUS_LABELS[comment.status]}
                          </span>
                        </td>

                        {/* Date */}
                        <td className={styles["td"]}>
                          <span className={styles["dateCell"]}>
                            {comment.createdAt}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className={styles["td"]}>
                          <div className={styles["actionsCell"]}>
                            <button
                              type="button"
                              className={styles["actionBtn"]}
                              onClick={() => {
                                handleOpenDetails(comment);
                              }}
                              title="عرض التفاصيل"
                            >
                              <span>تفاصيل</span>
                            </button>

                            {isHidden ? (
                              <button
                                type="button"
                                className={cn(
                                  styles["actionBtn"],
                                  styles["actionBtnRestore"],
                                )}
                                onClick={() => {
                                  restoreComment(comment.id);
                                }}
                                title="استعادة ظهور التعليق"
                              >
                                <Eye size={13} />
                                <span>استعادة</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className={cn(
                                  styles["actionBtn"],
                                  styles["actionBtnHide"],
                                )}
                                onClick={() => {
                                  handleQuickHide(comment);
                                }}
                                title="إخفاء التعليق عن القراء"
                              >
                                <EyeOff size={13} />
                                <span>إخفاء</span>
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
                totalItems={filteredComments.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                itemName={"تعليق"}
              />
            ) : null}
          </>
        )}
      </div>

      {/* Details Modal */}
      <AdminCommentDetailsModal
        key={selectedComment?.id ?? "none"}
        comment={selectedComment}
        reports={
          selectedComment
            ? reports.filter(
                (r) =>
                  r.commentId.toLowerCase() ===
                  selectedComment.id.toLowerCase(),
              )
            : []
        }
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onHide={hideComment}
        onRestore={restoreComment}
      />

      {/* Quick Hide Confirmation Modal */}
      {quickHideComment && (
        <div
          className={styles["modalBackdrop"]}
          onClick={() => {
            setQuickHideComment(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-hide-title"
        >
          <div
            ref={quickHideDialogRef}
            className={styles["modalContent"]}
            onKeyDown={onQuickHideDialogKeyDown}
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{ maxWidth: "480px" }}
          >
            <div className={styles["modalHeader"]}>
              <div className={styles["modalTitle"]} id="quick-hide-title">
                <AlertTriangle size={18} className="text-destructive" />
                <span>تأكيد إخفاء التعليق</span>
              </div>
            </div>
            <div className={styles["modalBody"]}>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  margin: 0,
                }}
              >
                هل أنت متأكد من رغبتك في إخفاء تعليق المستخدم{" "}
                <strong>{quickHideComment.userName}</strong>؟ لن يظهر هذا
                التعليق لعموم القراء في صفحة الفصل.
              </p>
              <textarea
                className={styles["reasonInput"]}
                placeholder="سبب الإخفاء (اختياري: سب، حرق، إعلان...)"
                value={quickHideReason}
                onChange={(e) => {
                  setQuickHideReason(e.target.value);
                }}
                autoFocus
              />
            </div>
            <div className={styles["modalFooter"]}>
              <button
                type="button"
                className={styles["cancelBtn"]}
                onClick={() => {
                  setQuickHideComment(null);
                }}
              >
                إلغاء
              </button>
              <button
                type="button"
                className={cn(styles["confirmBtn"], styles["actionBtnHide"])}
                onClick={handleConfirmQuickHide}
              >
                إخفاء التعليق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

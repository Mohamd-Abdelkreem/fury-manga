"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Archive,
  CheckCircle2,
  Clock,
  Inbox,
  Mail,
  MailCheck,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminData } from "../../context/admin-context";
import { useAdminPagination } from "../../hooks/use-admin-pagination";
import type { AdminContactMessage } from "../../types/admin.types";
import { ADMIN_CONTACT_STATUS_LABELS } from "../../types/admin.types";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminPagination } from "../AdminPagination/AdminPagination";
import styles from "./AdminContact.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  translation_team: "طلب انضمام لفريق الترجمة",
  inquiry: "استفسار عام",
  complaint: "شكوى أو بلاغ",
  partnership: "شراكة أو إعلان",
  other: "أخرى",
};

const ITEMS_PER_PAGE = 8;

export function AdminContact() {
  const { contactMessages, updateContactStatus } = useAdminData();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [senderFilter, setSenderFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Dynamic categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const m of contactMessages) {
      if (m.category) set.add(m.category);
    }
    return Array.from(set);
  }, [contactMessages]);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return contactMessages.filter((m) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSender = m.name.toLowerCase().includes(q);
        const matchesEmail = m.email.toLowerCase().includes(q);
        const matchesSubject = m.subject.toLowerCase().includes(q);
        const matchesMessage = m.message.toLowerCase().includes(q);
        if (
          !matchesSender &&
          !matchesEmail &&
          !matchesSubject &&
          !matchesMessage
        ) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "all" && m.status !== statusFilter) {
        return false;
      }

      // Sender type
      if (senderFilter !== "all" && m.senderType !== senderFilter) {
        return false;
      }

      // Category
      if (categoryFilter !== "all" && m.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [
    contactMessages,
    searchQuery,
    statusFilter,
    senderFilter,
    categoryFilter,
  ]);

  // Metrics
  const {
    currentPage,
    totalPages,
    pageItems: paginatedMessages,
    setCurrentPage,
  } = useAdminPagination(filteredMessages, ITEMS_PER_PAGE);

  const metrics = useMemo(() => {
    const unread = contactMessages.filter((m) => m.status === "unread").length;
    const open = contactMessages.filter((m) => m.status === "open").length;
    const resolved = contactMessages.filter(
      (m) => m.status === "resolved",
    ).length;
    const archived = contactMessages.filter(
      (m) => m.status === "archived",
    ).length;
    return { unread, open, resolved, archived };
  }, [contactMessages]);

  const handleToggleRead = (message: AdminContactMessage) => {
    if (message.status === "unread") {
      updateContactStatus(message.id, "open");
    } else {
      updateContactStatus(message.id, "unread");
    }
  };

  const handleArchive = (messageId: string) => {
    updateContactStatus(messageId, "archived");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSenderFilter("all");
    setCategoryFilter("all");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    senderFilter !== "all" ||
    categoryFilter !== "all";

  return (
    <div className={styles["container"]}>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "رسائل التواصل" },
        ]}
        title="صندوق رسائل التواصل"
        description="إدارة استفسارات الزوار وطلبات الانضمام لفرق العمل والشكاوى الفنية، ومتابعة الردود المباشرة."
      />

      {/* Metrics Grid */}
      <div className={styles["metricsGrid"]}>
        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapUnread"],
            )}
          >
            <Mail size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>
              رسائل جديدة غير مقروءة
            </span>
            <span className={styles["metricValue"]}>
              {metrics.unread.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapOpen"],
            )}
          >
            <Clock size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>قيد المتابعة</span>
            <span className={styles["metricValue"]}>
              {metrics.open.toLocaleString("ar-EG")}
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
            <span className={styles["metricLabel"]}>تمت معالجتها</span>
            <span className={styles["metricValue"]}>
              {metrics.resolved.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className={styles["metricCard"]}>
          <div
            className={cn(
              styles["metricIconWrap"],
              styles["metricIconWrapArchived"],
            )}
          >
            <Archive size={20} />
          </div>
          <div className={styles["metricInfo"]}>
            <span className={styles["metricLabel"]}>رسائل مؤرشفة</span>
            <span className={styles["metricValue"]}>
              {metrics.archived.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>
      </div>

      {/* Controls Card */}
      <div className={styles["controlsCard"]}>
        <div className={styles["searchField"]}>
          <Search className={styles["searchIcon"]} />
          <input
            type="text"
            className={styles["searchInput"]}
            placeholder="بحث بالمرسل، البريد، العنوان أو المحتوى..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            aria-label="بحث في رسائل التواصل"
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
            <option value="unread">غير مقروءة فقط</option>
            <option value="open">قيد المتابعة</option>
            <option value="resolved">تمت المعالجة</option>
            <option value="archived">مؤرشفة</option>
          </select>

          <select
            className={styles["filterSelect"]}
            value={senderFilter}
            onChange={(e) => {
              setSenderFilter(e.target.value);
            }}
            aria-label="تصفية حسب نوع المرسل"
          >
            <option value="all">جميع المرسلين</option>
            <option value="visitor">زوار فقط</option>
            <option value="registered">أعضاء مسجلين فقط</option>
          </select>

          <select
            className={styles["filterSelect"]}
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
            }}
            aria-label="تصفية حسب التصنيف"
          >
            <option value="all">جميع التصنيفات</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat] ?? cat}
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
        {filteredMessages.length === 0 ? (
          <div className={styles["emptyState"]}>
            <Inbox className={styles["emptyIcon"]} />
            <div className={styles["emptyTitle"]}>صندوق الرسائل فارغ</div>
            <div className={styles["emptySubtitle"]}>
              لم نتمكن من العثور على أي رسائل تطابق معايير البحث والتصفية.
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
                    <th className={styles["th"]}>المرسل</th>
                    <th className={styles["th"]}>التصنيف</th>
                    <th className={styles["th"]}>الموضوع والمعاينة</th>
                    <th className={styles["th"]}>الحالة</th>
                    <th className={styles["th"]}>التاريخ</th>
                    <th className={styles["th"]}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMessages.map((msg) => {
                    const isUnread = msg.status === "unread";

                    return (
                      <tr
                        key={msg.id}
                        className={cn(
                          styles["tr"],
                          isUnread && styles["trUnread"],
                        )}
                      >
                        {/* Sender */}
                        <td className={styles["td"]}>
                          <div className={styles["senderCell"]}>
                            <div className={styles["senderNameRow"]}>
                              {isUnread && (
                                <span
                                  className={styles["unreadDot"]}
                                  title="رسالة جديدة"
                                />
                              )}
                              <span className={styles["senderName"]}>
                                {msg.name}
                              </span>
                            </div>
                            <span className={styles["senderEmail"]}>
                              {msg.email}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className={styles["td"]}>
                          <span className={styles["categoryBadge"]}>
                            {CATEGORY_LABELS[msg.category ?? "other"] ??
                              msg.category ??
                              "أخرى"}
                          </span>
                        </td>

                        {/* Subject & Preview */}
                        <td className={styles["td"]}>
                          <div className={styles["messageSubjectCell"]}>
                            <Link
                              href={`/admin/contact/${msg.id}` as Route}
                              className={cn(
                                styles["subjectLink"],
                                isUnread && styles["subjectUnread"],
                              )}
                            >
                              {msg.subject}
                            </Link>
                            <span className={styles["messageSnippet"]}>
                              {msg.message}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className={styles["td"]}>
                          <span
                            className={cn(
                              styles["statusBadge"],
                              msg.status === "unread" && styles["statusUnread"],
                              msg.status === "open" && styles["statusOpen"],
                              msg.status === "resolved" &&
                                styles["statusResolved"],
                              msg.status === "archived" &&
                                styles["statusArchived"],
                            )}
                          >
                            {ADMIN_CONTACT_STATUS_LABELS[msg.status]}
                          </span>
                        </td>

                        {/* Date */}
                        <td className={styles["td"]}>
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              color: "rgba(255, 255, 255, 0.5)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {msg.createdAt}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className={styles["td"]}>
                          <div className={styles["actionsCell"]}>
                            <Link
                              href={`/admin/contact/${msg.id}` as Route}
                              className={styles["actionBtn"]}
                              title="عرض تفاصيل الرسالة والرد"
                            >
                              <span>عرض</span>
                            </Link>

                            <button
                              type="button"
                              className={styles["actionBtn"]}
                              onClick={() => {
                                handleToggleRead(msg);
                              }}
                              title={
                                isUnread ? "تعيين كمقروءة" : "تعيين كغير مقروءة"
                              }
                            >
                              {isUnread ? (
                                <MailCheck size={13} />
                              ) : (
                                <Mail size={13} />
                              )}
                            </button>

                            {msg.status !== "archived" && (
                              <button
                                type="button"
                                className={styles["actionBtn"]}
                                onClick={() => {
                                  handleArchive(msg.id);
                                }}
                                title="أرشفة الرسالة"
                              >
                                <Archive size={13} />
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
                totalItems={filteredMessages.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                itemName={"رسالة"}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

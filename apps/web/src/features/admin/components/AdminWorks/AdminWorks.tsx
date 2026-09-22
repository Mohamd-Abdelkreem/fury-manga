"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import {
  Archive,
  BookOpen,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminData } from "../../context/admin-context";
import { useAdminPagination } from "../../hooks/use-admin-pagination";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminPagination } from "../AdminPagination/AdminPagination";
import { AdminStatusBadge } from "../AdminStatusBadge/AdminStatusBadge";
import styles from "./AdminWorks.module.css";

const ITEMS_PER_PAGE = 6;

type SortOption = "updated" | "oldest" | "title" | "chapters";

interface ConfirmState {
  isOpen: boolean;
  workId: string;
  workTitle: string;
  action: "unpublish" | "archive" | "restore";
}

export function AdminWorks() {
  const { works, toggleWorkPublish, archiveWork, restoreWork } = useAdminData();

  // Filters state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [storyStatusFilter, setStoryStatusFilter] = useState<string>("all");
  const [publishStatusFilter, setPublishStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState>({
    isOpen: false,
    workId: "",
    workTitle: "",
    action: "unpublish",
  });

  // Filter and sort works
  const filteredWorks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return works
      .filter((work) => {
        // Search filter
        if (query.length > 0) {
          const matchTitle = work.title.toLowerCase().includes(query);
          const matchAlt =
            work.alternativeTitle?.toLowerCase().includes(query) ?? false;
          if (!matchTitle && !matchAlt) return false;
        }

        // Type filter
        if (typeFilter !== "all" && work.type !== typeFilter) return false;

        // Story status filter
        if (
          storyStatusFilter !== "all" &&
          work.storyStatus !== storyStatusFilter
        )
          return false;

        // Publication status filter
        if (
          publishStatusFilter !== "all" &&
          work.publishStatus !== publishStatusFilter
        )
          return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "updated") {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
        if (sortBy === "oldest") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title, "ar");
        }
        return b.chapterCount - a.chapterCount;
      });
  }, [
    works,
    search,
    typeFilter,
    storyStatusFilter,
    publishStatusFilter,
    sortBy,
  ]);

  const {
    currentPage,
    totalPages,
    pageItems: currentWorks,
    setCurrentPage,
  } = useAdminPagination(filteredWorks, ITEMS_PER_PAGE);

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStoryStatusFilter("all");
    setPublishStatusFilter("all");
    setSortBy("updated");
    setCurrentPage(1);
  };

  const handleExecuteAction = () => {
    const { action, workId } = confirmDialog;
    if (action === "unpublish") {
      toggleWorkPublish(workId);
    } else if (action === "archive") {
      archiveWork(workId);
    } else {
      restoreWork(workId);
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "إدارة الأعمال" },
        ]}
        title="إدارة الأعمال"
        description="استعراض وتصفية وتعديل المانجا والروايات والقصص المصورة، وإدارة الفصول وحالات النشر والأرشفة."
        primaryAction={{
          label: "إنشاء عمل جديد",
          href: "/admin/works/new",
          icon: Plus,
        }}
      />

      {/* Toolbar: Search, Filters & Sorting */}
      <section aria-label="أدوات تصفية الأعمال" className={styles["toolbar"]}>
        <div className={styles["searchAndSortRow"]}>
          <div className={styles["searchBox"]}>
            <Search className={styles["searchIcon"]} aria-hidden="true" />
            <input
              type="search"
              className={styles["searchInput"]}
              placeholder="ابحث بالعنوان العربي أو الإنجليزي..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="البحث عن عمل"
            />
          </div>

          <div className={styles["filterGroup"]}>
            <label htmlFor="sort-select" className={styles["filterLabel"]}>
              الترتيب:
            </label>
            <select
              id="sort-select"
              className={styles["filterSelect"]}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
              }}
            >
              <option value="updated">الأحدث تحديثًا</option>
              <option value="oldest">الأقدم تاريخًا</option>
              <option value="title">أبجديًا بالعنوان</option>
              <option value="chapters">الأكثر فصولاً</option>
            </select>
          </div>
        </div>

        <div className={styles["filtersRow"]}>
          {/* Work Type Filter */}
          <div className={styles["filterGroup"]}>
            <label htmlFor="type-filter" className={styles["filterLabel"]}>
              نوع العمل:
            </label>
            <select
              id="type-filter"
              className={styles["filterSelect"]}
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">كل الأنواع</option>
              <option value="manga">مانغا</option>
              <option value="manhwa">مانهوا</option>
              <option value="manhua">مانهوا صينية</option>
              <option value="comics">كوميكس</option>
              <option value="novel">رواية</option>
              <option value="text-story">قصة نصية</option>
            </select>
          </div>

          {/* Story Status Filter */}
          <div className={styles["filterGroup"]}>
            <label
              htmlFor="story-status-filter"
              className={styles["filterLabel"]}
            >
              حالة القصة:
            </label>
            <select
              id="story-status-filter"
              className={styles["filterSelect"]}
              value={storyStatusFilter}
              onChange={(e) => {
                setStoryStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">كل الحالات</option>
              <option value="ongoing">مستمرة</option>
              <option value="completed">مكتملة</option>
              <option value="hiatus">متوقفة مؤقتًا</option>
              <option value="cancelled">ملغاة</option>
            </select>
          </div>

          {/* Publication Status Filter */}
          <div className={styles["filterGroup"]}>
            <label
              htmlFor="publish-status-filter"
              className={styles["filterLabel"]}
            >
              حالة النشر:
            </label>
            <select
              id="publish-status-filter"
              className={styles["filterSelect"]}
              value={publishStatusFilter}
              onChange={(e) => {
                setPublishStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">الكل</option>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
              <option value="archived">مؤرشف</option>
            </select>
          </div>

          {(search.length > 0 ||
            typeFilter !== "all" ||
            storyStatusFilter !== "all" ||
            publishStatusFilter !== "all") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className={styles["resetBtn"]}
            >
              إعادة ضبط التصفية
            </button>
          )}
        </div>
      </section>

      {/* Works Table */}
      <div className={styles["tableCard"]}>
        {currentWorks.length === 0 ? (
          <div className={styles["emptyBox"]}>
            <BookOpen size={48} color="var(--primary)" aria-hidden="true" />
            <h3 className={styles["emptyTitle"]}>لا توجد أعمال مطابقة</h3>
            <p className={styles["emptyText"]}>
              لم نتمكن من العثور على أي عمل يطابق معايير البحث والتصفية المحددة.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="button button--small"
            >
              إعادة تعيين البحث والتصفية
            </button>
          </div>
        ) : (
          <div className={styles["tableWrapper"]}>
            <table className={styles["table"]}>
              <thead className={styles["thead"]}>
                <tr>
                  <th className={styles["th"]}>العمل</th>
                  <th className={styles["th"]}>النوع</th>
                  <th className={styles["th"]}>حالة القصة</th>
                  <th className={styles["th"]}>حالة النشر</th>
                  <th className={styles["th"]}>الفصول</th>
                  <th className={styles["th"]}>آخر تحديث</th>
                  <th className={styles["th"]}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {currentWorks.map((work) => (
                  <tr key={work.id} className={styles["tr"]}>
                    <td className={styles["td"]}>
                      <div className={styles["workCell"]}>
                        <Image
                          src={work.coverImage}
                          alt=""
                          width={40}
                          height={56}
                          className={styles["coverThumb"]}
                          unoptimized
                        />
                        <div className={styles["titleGroup"]}>
                          <span className={styles["workName"]}>
                            {work.title}
                          </span>
                          {work.alternativeTitle ? (
                            <span className={styles["altTitle"]}>
                              {work.alternativeTitle}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className={styles["td"]}>
                      <AdminStatusBadge kind="workType" status={work.type} />
                    </td>

                    <td className={styles["td"]}>
                      <AdminStatusBadge
                        kind="story"
                        status={work.storyStatus}
                      />
                    </td>

                    <td className={styles["td"]}>
                      <AdminStatusBadge
                        kind="publish"
                        status={work.publishStatus}
                      />
                    </td>

                    <td className={styles["td"]}>
                      <span className={styles["countCell"]}>
                        {work.chapterCount.toLocaleString("ar-EG")}
                      </span>
                    </td>

                    <td className={styles["td"]}>
                      <span className={styles["dateCell"]}>
                        {work.updatedAt}
                      </span>
                    </td>

                    <td className={styles["td"]}>
                      <div className={styles["rowActions"]}>
                        {/* Manage Chapters */}
                        <Link
                          href={`/admin/works/${work.id}/chapters` as Route}
                          className={styles["manageBtn"]}
                          title="إدارة فصول هذا العمل"
                        >
                          <BookOpen size={13} aria-hidden="true" />
                          <span>الفصول</span>
                        </Link>

                        {/* Edit Work */}
                        <Link
                          href={`/admin/works/${work.id}/edit` as Route}
                          className={styles["iconActionBtn"]}
                          aria-label={`تعديل بيانات ${work.title}`}
                          title="تعديل العمل"
                        >
                          <Edit size={14} aria-hidden="true" />
                        </Link>

                        {/* View Public Page */}
                        <Link
                          href={`/story/${work.id}` as Route}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles["iconActionBtn"]}
                          aria-label={`عرض ${work.title} في الموقع العام`}
                          title="عرض في الموقع العام"
                        >
                          <ExternalLink size={14} aria-hidden="true" />
                        </Link>

                        {/* Publish / Unpublish Toggle */}
                        {work.publishStatus === "published" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                workId: work.id,
                                workTitle: work.title,
                                action: "unpublish",
                              });
                            }}
                            className={styles["iconActionBtn"]}
                            aria-label={`إلغاء نشر ${work.title}`}
                            title="إلغاء النشر وتحويله لمسودة"
                          >
                            <EyeOff size={14} aria-hidden="true" />
                          </button>
                        ) : work.publishStatus === "draft" ? (
                          <button
                            type="button"
                            onClick={() => {
                              toggleWorkPublish(work.id);
                            }}
                            className={styles["iconActionBtn"]}
                            aria-label={`نشر ${work.title}`}
                            title="نشر العمل للجمهور"
                          >
                            <Eye size={14} aria-hidden="true" />
                          </button>
                        ) : null}

                        {/* Archive / Restore */}
                        {work.publishStatus !== "archived" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                workId: work.id,
                                workTitle: work.title,
                                action: "archive",
                              });
                            }}
                            className={cn(
                              styles["iconActionBtn"],
                              styles["archiveBtn"],
                            )}
                            aria-label={`أرشفة ${work.title}`}
                            title="أرشفة العمل"
                          >
                            <Archive size={14} aria-hidden="true" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                workId: work.id,
                                workTitle: work.title,
                                action: "restore",
                              });
                            }}
                            className={cn(
                              styles["iconActionBtn"],
                              styles["restoreBtn"],
                            )}
                            aria-label={`استعادة ${work.title} من الأرشيف`}
                            title="استعادة العمل"
                          >
                            <RotateCcw size={14} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredWorks.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemName="عمل"
        />
      </div>

      {/* Confirmation Dialog for local mutations */}
      <AdminConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.action === "unpublish"
            ? "تأكيد إلغاء نشر العمل"
            : confirmDialog.action === "archive"
              ? "تأكيد أرشفة العمل"
              : "استعادة العمل من الأرشيف"
        }
        description={
          confirmDialog.action === "unpublish"
            ? `هل أنت متأكد من إلغاء نشر '${confirmDialog.workTitle}'؟ سيتحول إلى مسودة ولن يظهر للزوار في واجهة الموقع العام.`
            : confirmDialog.action === "archive"
              ? `هل تريد نقل '${confirmDialog.workTitle}' إلى الأرشيف؟ سيتم إيقاف ظهوره للجمهور مع الاحتفاظ ببياناته.`
              : `هل تريد استعادة '${confirmDialog.workTitle}' من الأرشيف وتحويله إلى مسودة قابلة للنشر؟`
        }
        confirmLabel={
          confirmDialog.action === "unpublish"
            ? "إلغاء النشر"
            : confirmDialog.action === "archive"
              ? "أرشفة العمل"
              : "استعادة"
        }
        onConfirm={handleExecuteAction}
        onCancel={() => {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { useAdminData } from "../../context/admin-context";
import { useAdminPagination } from "../../hooks/use-admin-pagination";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminPagination } from "../AdminPagination/AdminPagination";
import { AdminStatusBadge } from "../AdminStatusBadge/AdminStatusBadge";
import styles from "./AdminChapters.module.css";

const CHAPTERS_PER_PAGE = 8;

type SortOption = "number-desc" | "number-asc" | "newest" | "oldest";

interface ConfirmState {
  isOpen: boolean;
  chapterId: string;
  chapterNumber: number;
  action: "unpublish" | "archive" | "restore";
}

interface AdminChaptersProps {
  workId: string;
}

export function AdminChapters({ workId }: AdminChaptersProps) {
  const {
    getWork,
    getChapters,
    toggleChapterPublish,
    archiveChapter,
    restoreChapter,
  } = useAdminData();

  const work = getWork(workId);
  const chapters = getChapters(workId);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("number-desc");

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState>({
    isOpen: false,
    chapterId: "",
    chapterNumber: 1,
    action: "unpublish",
  });

  // Filter and sort chapters
  const filteredChapters = useMemo(() => {
    const query = search.trim().toLowerCase();

    return chapters
      .filter((chapter) => {
        // Search query by title or number
        if (query.length > 0) {
          const matchTitle = chapter.title.toLowerCase().includes(query);
          const matchNum = String(chapter.number).includes(query);
          if (!matchTitle && !matchNum) return false;
        }

        // Status filter
        if (statusFilter !== "all" && chapter.status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "number-desc") return b.number - a.number;
        if (sortBy === "number-asc") return a.number - b.number;
        if (sortBy === "newest") {
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        }
        return (
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        );
      });
  }, [chapters, search, statusFilter, sortBy]);

  const {
    currentPage,
    totalPages,
    pageItems: currentChapters,
    setCurrentPage,
  } = useAdminPagination(filteredChapters, CHAPTERS_PER_PAGE);

  const handleExecuteAction = () => {
    const { action, chapterId } = confirmDialog;
    if (action === "unpublish") {
      toggleChapterPublish(workId, chapterId);
    } else if (action === "archive") {
      archiveChapter(workId, chapterId);
    } else {
      restoreChapter(workId, chapterId);
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // Unknown work state
  if (!work) {
    return (
      <div>
        <AdminPageHeader
          breadcrumbs={[
            { label: "لوحة الإدارة", href: "/admin/dashboard" },
            { label: "الأعمال", href: "/admin/works" },
            { label: "عمل غير موجود" },
          ]}
          title="العمل المطلوب غير موجود"
        />

        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "0.875rem",
            padding: "3.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            textAlign: "center",
          }}
          role="alert"
        >
          <AlertCircle size={48} color="var(--primary)" aria-hidden="true" />
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
            }}
          >
            تعذّر العثور على العمل المطلوب
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--muted-foreground)",
              maxWidth: "28rem",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            لم نتمكن من العثور على عمل بالمعرّف &ldquo;{workId}&rdquo;. يرجى
            التحقق من الرابط أو العودة لقائمة الأعمال.
          </p>
          <Link
            href={"/admin/works"}
            className="button button--small"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>العودة لقائمة الأعمال</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "الأعمال", href: "/admin/works" },
          { label: work.title },
          { label: "إدارة الفصول" },
        ]}
        title={`إدارة فصول: ${work.title}`}
        description="استعراض فصول العمل، إضافة فصول جديدة، ومتابعة تواريخ النشر وإحصائيات القراءة."
        primaryAction={{
          label: "إضافة فصل جديد",
          href: `/admin/works/${work.id}/chapters/new`,
          icon: Plus,
        }}
        secondaryAction={{
          label: "تعديل بيانات العمل",
          href: `/admin/works/${work.id}/edit`,
          icon: Edit,
        }}
      />

      {/* Parent Work Summary Card */}
      <section
        aria-label="ملخص العمل الأساسي"
        className={styles["workSummaryCard"]}
      >
        <div className={styles["workSummaryMain"]}>
          <Image
            src={work.coverImage}
            alt=""
            width={60}
            height={85}
            className={styles["workCover"]}
            unoptimized
          />
          <div className={styles["workInfo"]}>
            <h2 className={styles["workTitle"]}>{work.title}</h2>
            <div className={styles["workMetaBadges"]}>
              <AdminStatusBadge kind="workType" status={work.type} />
              <AdminStatusBadge kind="story" status={work.storyStatus} />
              <AdminStatusBadge kind="publish" status={work.publishStatus} />
            </div>
            <p className={styles["workMetrics"]}>
              إجمالي الفصول: {chapters.length.toLocaleString("ar-EG")} • إجمالي
              المشاهدات: {work.views.toLocaleString("ar-EG")} قراءة
            </p>
          </div>
        </div>

        <div className={styles["workActions"]}>
          <Link
            href={"/admin/works"}
            className="button button--small button--ghost"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <ArrowRight size={14} aria-hidden="true" />
            <span>العودة للأعمال</span>
          </Link>
          <Link
            href={`/admin/works/${work.id}/edit` as Route}
            className="button button--small"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Edit size={14} aria-hidden="true" />
            <span>تعديل العمل</span>
          </Link>
        </div>
      </section>

      {/* Toolbar: Search, Status Filter & Sorting */}
      <section aria-label="تصفية الفصول" className={styles["toolbar"]}>
        <div className={styles["searchAndFilters"]}>
          <div className={styles["searchBox"]}>
            <Search className={styles["searchIcon"]} aria-hidden="true" />
            <input
              type="search"
              className={styles["searchInput"]}
              placeholder="ابحث برقم الفصل أو العنوان..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="البحث عن فصل"
            />
          </div>

          <select
            className={styles["select"]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="تصفية الفصول حسب الحالة"
          >
            <option value="all">كل حالات النشر</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>

          <select
            className={styles["select"]}
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
            }}
            aria-label="ترتيب الفصول"
          >
            <option value="number-desc">رقم الفصل (تنازلي)</option>
            <option value="number-asc">رقم الفصل (تصاعدي)</option>
            <option value="newest">الأحدث نشرًا</option>
            <option value="oldest">الأقدم نشرًا</option>
          </select>
        </div>

        <Link
          href={`/admin/works/${work.id}/chapters/new` as Route}
          className={styles["addChapterBtn"]}
        >
          <Plus size={16} aria-hidden="true" />
          <span>إضافة فصل جديد</span>
        </Link>
      </section>

      {/* Chapters Table */}
      <div className={styles["tableCard"]}>
        {chapters.length === 0 ? (
          <div className={styles["emptyState"]}>
            <BookOpen size={48} color="var(--primary)" aria-hidden="true" />
            <h3 className={styles["emptyTitle"]}>لا توجد فصول مضافة بعد</h3>
            <p className={styles["emptyDesc"]}>
              هذا العمل لا يحتوي على أي فصول حتى الآن. يمكنك البدء بإضافة الفصل
              الأول.
            </p>
            <Link
              href={`/admin/works/${work.id}/chapters/new` as Route}
              className="button button--small"
            >
              إضافة الفصل الأول
            </Link>
          </div>
        ) : currentChapters.length === 0 ? (
          <div className={styles["emptyState"]}>
            <Search
              size={44}
              color="var(--muted-foreground)"
              aria-hidden="true"
            />
            <h3 className={styles["emptyTitle"]}>لا توجد فصول مطابقة</h3>
            <p className={styles["emptyDesc"]}>
              لم نتمكن من العثور على أي فصل يطابق معايير البحث والتصفية.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="button button--small button--ghost"
            >
              إعادة ضبط التصفية
            </button>
          </div>
        ) : (
          <div className={styles["tableWrapper"]}>
            <table className={styles["table"]}>
              <thead className={styles["thead"]}>
                <tr>
                  <th className={styles["th"]}>الفصل</th>
                  <th className={styles["th"]}>عنوان الفصل</th>
                  <th className={styles["th"]}>نوع المحتوى</th>
                  <th className={styles["th"]}>حالة النشر</th>
                  <th className={styles["th"]}>تاريخ النشر</th>
                  <th className={styles["th"]}>آخر تحديث</th>
                  <th className={styles["th"]}>المشاهدات</th>
                  <th className={styles["th"]}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {currentChapters.map((chapter) => (
                  <tr key={chapter.id} className={styles["tr"]}>
                    <td className={styles["td"]}>
                      <span className={styles["chapterNumber"]}>
                        #{chapter.number}
                      </span>
                    </td>

                    <td className={styles["td"]}>
                      <span className={styles["chapterTitle"]}>
                        {chapter.title}
                      </span>
                    </td>

                    <td className={styles["td"]}>
                      <AdminStatusBadge
                        kind="content"
                        status={chapter.contentType}
                      />
                    </td>

                    <td className={styles["td"]}>
                      <AdminStatusBadge
                        kind="publish"
                        status={chapter.status}
                      />
                    </td>

                    <td className={styles["td"]}>
                      <span className={styles["dateText"]}>
                        {chapter.publishedAt}
                      </span>
                    </td>

                    <td className={styles["td"]}>
                      <span className={styles["dateText"]}>
                        {chapter.updatedAt}
                      </span>
                    </td>

                    <td className={styles["td"]}>
                      <span className={styles["viewsCount"]}>
                        {chapter.views.toLocaleString("ar-EG")}
                      </span>
                    </td>

                    <td className={styles["td"]}>
                      <div className={styles["rowActions"]}>
                        {/* Preview chapter */}
                        <Link
                          href={
                            `/story/${work.id}/chapter/${chapter.id}` as Route
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles["iconBtn"]}
                          aria-label={`معاينة الفصل ${String(chapter.number)}`}
                          title="معاينة الفصل في القارئ"
                        >
                          <ExternalLink size={14} aria-hidden="true" />
                        </Link>

                        {/* Edit chapter (planned route) */}
                        <Link
                          href={
                            `/admin/works/${work.id}/chapters/${chapter.id}/edit` as Route
                          }
                          className={styles["iconBtn"]}
                          aria-label={`تعديل الفصل ${String(chapter.number)}`}
                          title="تعديل الفصل"
                        >
                          <Edit size={14} aria-hidden="true" />
                        </Link>

                        {/* Publish / Unpublish Toggle */}
                        {chapter.status === "published" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                chapterId: chapter.id,
                                chapterNumber: chapter.number,
                                action: "unpublish",
                              });
                            }}
                            className={styles["iconBtn"]}
                            aria-label={`إلغاء نشر الفصل ${String(chapter.number)}`}
                            title="إلغاء النشر"
                          >
                            <EyeOff size={14} aria-hidden="true" />
                          </button>
                        ) : chapter.status === "draft" ? (
                          <button
                            type="button"
                            onClick={() => {
                              toggleChapterPublish(work.id, chapter.id);
                            }}
                            className={styles["iconBtn"]}
                            aria-label={`نشر الفصل ${String(chapter.number)}`}
                            title="نشر الفصل"
                          >
                            <Eye size={14} aria-hidden="true" />
                          </button>
                        ) : null}

                        {/* Archive / Restore Toggle */}
                        {chapter.status !== "archived" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                chapterId: chapter.id,
                                chapterNumber: chapter.number,
                                action: "archive",
                              });
                            }}
                            className={styles["iconBtn"]}
                            aria-label={`أرشفة الفصل ${String(chapter.number)}`}
                            title="أرشفة الفصل"
                          >
                            <Archive size={14} aria-hidden="true" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                chapterId: chapter.id,
                                chapterNumber: chapter.number,
                                action: "restore",
                              });
                            }}
                            className={styles["iconBtn"]}
                            aria-label={`استعادة الفصل ${String(chapter.number)}`}
                            title="استعادة من الأرشيف"
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
          totalItems={filteredChapters.length}
          itemsPerPage={CHAPTERS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemName="فصل"
        />
      </div>

      {/* Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.action === "unpublish"
            ? "تأكيد إلغاء نشر الفصل"
            : confirmDialog.action === "archive"
              ? "تأكيد أرشفة الفصل"
              : "استعادة الفصل"
        }
        description={
          confirmDialog.action === "unpublish"
            ? `هل أنت متأكد من إلغاء نشر الفصل رقم ${String(confirmDialog.chapterNumber)}؟ سيتحول إلى مسودة ولن يتمكن القراء من قراءته.`
            : confirmDialog.action === "archive"
              ? `هل تريد أرشفة الفصل رقم ${String(confirmDialog.chapterNumber)}؟`
              : `هل تريد استعادة الفصل رقم ${String(confirmDialog.chapterNumber)} من الأرشيف؟`
        }
        confirmLabel={
          confirmDialog.action === "unpublish"
            ? "إلغاء النشر"
            : confirmDialog.action === "archive"
              ? "أرشفة"
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

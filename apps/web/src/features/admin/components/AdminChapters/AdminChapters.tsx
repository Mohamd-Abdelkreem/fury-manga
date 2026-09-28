"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Archive, Edit, Eye, EyeOff, Plus, RotateCcw } from "lucide-react";
import type {
  AdminChapterListQuery,
  AdminChapterSummary,
  PublicationStatus,
} from "@fury/contracts";
import { useAdminWorkDetail } from "../../hooks/admin-content.hooks";
import {
  useAdminChapterList,
  usePublishAdminChapter,
} from "../../hooks/admin-chapter.hooks";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminPagination } from "../AdminPagination/AdminPagination";
import { AdminStatusBadge } from "../AdminStatusBadge/AdminStatusBadge";
import styles from "./AdminChapters.module.css";
import { adminChapterErrorMessage } from "../../model/admin-content.errors";

const PAGE_SIZE = 8;
type Selection = Pick<
  AdminChapterSummary,
  "id" | "workId" | "number" | "version" | "publicationStatus"
> & { targetState: PublicationStatus };
const actions: Record<PublicationStatus, string> = {
  draft: "إلغاء نشر الفصل",
  published: "نشر الفصل",
  archived: "أرشفة الفصل",
};
function dateLabel(value: string | null) {
  return value === null
    ? "—"
    : new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(
        new Date(value),
      );
}

export function AdminChapters({ workId }: { workId: string }) {
  const work = useAdminWorkDetail(workId);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PublicationStatus | "all">("all");
  const [sort, setSort] =
    useState<NonNullable<AdminChapterListQuery["sort"]>>("number_asc");
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [message, setMessage] = useState("");
  const query: AdminChapterListQuery = {
    page,
    limit: PAGE_SIZE,
    sort,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(status !== "all" ? { publicationStatus: status } : {}),
  };
  const list = useAdminChapterList(workId, query);
  const publication = usePublishAdminChapter();
  const activeActor = useRef(work.actorId);
  useEffect(() => {
    activeActor.current = work.actorId;
    return () => {
      activeActor.current = null;
    };
  }, [work.actorId]);
  const [scope, setScope] = useState({ actorId: work.actorId, workId });
  if (scope.actorId !== work.actorId || scope.workId !== workId) {
    setScope({ actorId: work.actorId, workId });
    setSelection(null);
    setMessage("");
  }

  const choose = (
    chapter: AdminChapterSummary,
    targetState: PublicationStatus,
  ) => {
    setMessage("");
    setSelection({
      id: chapter.id,
      workId: chapter.workId,
      number: chapter.number,
      version: chapter.version,
      publicationStatus: chapter.publicationStatus,
      targetState,
    });
  };
  const confirm = async () => {
    if (
      selection === null ||
      publication.isPending ||
      work.denied ||
      list.denied ||
      work.actorId === null ||
      activeActor.current !== work.actorId
    )
      return;
    const actorAtSubmit = work.actorId;
    const current = list.data?.items.find(
      (chapter) => chapter.id === selection.id,
    );
    if (
      !current ||
      current.workId !== selection.workId ||
      current.version !== selection.version ||
      current.publicationStatus !== selection.publicationStatus
    ) {
      setSelection(null);
      setMessage(
        "تغيّر الفصل منذ فتح التأكيد. أعد تحميل القائمة ثم راجع حالته.",
      );
      await list.refetch();
      return;
    }
    try {
      await publication.mutateAsync({
        workId,
        chapterId: current.id,
        body: {
          expectedVersion: current.version,
          targetState: selection.targetState,
        },
      });
      if (activeActor.current !== actorAtSubmit) return;
      setMessage(
        `تم تأكيد ${actions[selection.targetState]} ${String(current.number)}.`,
      );
    } catch (error: unknown) {
      if (activeActor.current !== actorAtSubmit) return;
      setMessage(adminChapterErrorMessage(error));
      await list.refetch();
    } finally {
      if (activeActor.current === actorAtSubmit) setSelection(null);
    }
  };
  const retryList = async () => {
    try {
      await list.retryAccess();
    } catch (error: unknown) {
      setMessage(adminChapterErrorMessage(error));
    }
  };
  const retryWork = async () => {
    try {
      await work.retryAccess();
    } catch (error: unknown) {
      setMessage(adminChapterErrorMessage(error));
    }
  };
  const workLoading = !work.sessionReady || work.isPending;
  const filtered = search.trim() !== "" || status !== "all";
  const pagination =
    !list.denied && !list.isError ? list.data?.pagination : undefined;
  const visibleWork = !work.denied && !work.isError ? work.data : undefined;
  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "الأعمال", href: "/admin/works" },
          { label: visibleWork?.title ?? "الفصول" },
        ]}
        title={
          visibleWork ? `إدارة فصول: ${visibleWork.title}` : "إدارة الفصول"
        }
        description="استعراض فصول العمل وإدارة حالة نشرها."
        {...(visibleWork
          ? {
              primaryAction: {
                label: "إضافة فصل جديد",
                href: `/admin/works/${workId}/chapters/new`,
                icon: Plus,
              },
            }
          : {})}
      />
      {work.denied || work.isError ? (
        <div role="alert" className={styles["emptyState"]}>
          <p>تعذّر تحميل العمل المطلوب.</p>
          <button
            type="button"
            className="button button--small"
            onClick={() => {
              void retryWork();
            }}
          >
            إعادة المحاولة
          </button>
          {message && <p role="status">{message}</p>}
        </div>
      ) : workLoading ? (
        <p role="status">جارٍ تحميل العمل</p>
      ) : (
        <>
          <section
            aria-label="ملخص العمل الأساسي"
            className={styles["workSummaryCard"]}
          >
            <div className={styles["workInfo"]}>
              <h2 className={styles["workTitle"]}>{work.data.title}</h2>
              <div className={styles["workMetaBadges"]}>
                <AdminStatusBadge kind="workType" status={work.data.type} />
                <AdminStatusBadge kind="story" status={work.data.storyStatus} />
                <AdminStatusBadge
                  kind="publish"
                  status={work.data.publicationStatus}
                />
              </div>
            </div>
            <Link
              href={`/admin/works/${workId}/edit` as Route}
              className="button button--small button--ghost"
            >
              تعديل العمل
            </Link>
          </section>
          <section aria-label="تصفية الفصول" className={styles["toolbar"]}>
            <div className={styles["searchAndFilters"]}>
              <input
                type="search"
                className={styles["searchInput"]}
                aria-label="البحث عن فصل"
                placeholder="ابحث بالعنوان أو رقم الفصل"
                maxLength={200}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
              <select
                className={styles["select"]}
                aria-label="تصفية الفصول حسب الحالة"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as PublicationStatus | "all");
                  setPage(1);
                }}
              >
                <option value="all">كل حالات النشر</option>
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
                <option value="archived">مؤرشف</option>
              </select>
              <select
                className={styles["select"]}
                aria-label="ترتيب الفصول"
                value={sort}
                onChange={(event) => {
                  setSort(
                    event.target.value as NonNullable<
                      AdminChapterListQuery["sort"]
                    >,
                  );
                  setPage(1);
                }}
              >
                <option value="number_asc">رقم الفصل (تصاعدي)</option>
                <option value="number_desc">رقم الفصل (تنازلي)</option>
                <option value="published_desc">الأحدث نشرًا</option>
                <option value="updated_desc">الأحدث تحديثًا</option>
              </select>
            </div>
            <Link
              href={`/admin/works/${workId}/chapters/new` as Route}
              className={styles["addChapterBtn"]}
            >
              <Plus size={16} aria-hidden="true" />
              إضافة فصل جديد
            </Link>
          </section>
          {message && <p role="status">{message}</p>}
          {list.isFetching && list.data && (
            <p role="status">جارٍ تحديث الفصول</p>
          )}
          <div className={styles["tableCard"]}>
            {list.denied || list.isError ? (
              <div className={styles["emptyState"]} role="alert">
                <p>تعذّر تحميل الفصول.</p>
                <button
                  type="button"
                  className="button button--small"
                  onClick={() => {
                    void retryList();
                  }}
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : !list.sessionReady || list.isPending ? (
              <div className={styles["emptyState"]} role="status">
                جارٍ تحميل الفصول
              </div>
            ) : list.data.items.length === 0 ? (
              <div className={styles["emptyState"]}>
                <h2 className={styles["emptyTitle"]}>
                  {filtered || page > 1
                    ? "لا توجد فصول مطابقة"
                    : "لا توجد فصول مضافة بعد"}
                </h2>
                {filtered || page > 1 ? (
                  <button
                    type="button"
                    className="button button--small button--ghost"
                    onClick={() => {
                      setSearch("");
                      setStatus("all");
                      setPage(1);
                    }}
                  >
                    إعادة ضبط التصفية
                  </button>
                ) : (
                  <Link
                    href={`/admin/works/${workId}/chapters/new` as Route}
                    className="button button--small"
                  >
                    إضافة الفصل الأول
                  </Link>
                )}
              </div>
            ) : (
              <div className={styles["tableWrapper"]}>
                <table className={styles["table"]}>
                  <thead className={styles["thead"]}>
                    <tr>
                      <th className={styles["th"]}>الفصل</th>
                      <th className={styles["th"]}>العنوان</th>
                      <th className={styles["th"]}>نوع المحتوى</th>
                      <th className={styles["th"]}>حالة النشر</th>
                      <th className={styles["th"]}>تاريخ النشر</th>
                      <th className={styles["th"]}>آخر تحديث</th>
                      <th className={styles["th"]}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.data.items.map((chapter) => (
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
                            status={chapter.publicationStatus}
                          />
                        </td>
                        <td className={styles["td"]}>
                          <span className={styles["dateText"]}>
                            {dateLabel(chapter.publishedAt)}
                          </span>
                        </td>
                        <td className={styles["td"]}>
                          <span className={styles["dateText"]}>
                            {dateLabel(chapter.updatedAt)}
                          </span>
                        </td>
                        <td className={styles["td"]}>
                          <div className={styles["rowActions"]}>
                            <Link
                              href={
                                `/admin/works/${workId}/chapters/${chapter.id}/edit` as Route
                              }
                              className={styles["iconBtn"]}
                              aria-label={`تعديل الفصل ${String(chapter.number)}`}
                              title="تعديل الفصل"
                            >
                              <Edit size={16} aria-hidden="true" />
                            </Link>
                            {chapter.publicationStatus === "draft" && (
                              <button
                                type="button"
                                className={styles["iconBtn"]}
                                disabled={
                                  !chapter.readyForPublication ||
                                  publication.isPending
                                }
                                title={
                                  chapter.readyForPublication
                                    ? "نشر الفصل"
                                    : "أكمل الفصل قبل نشره"
                                }
                                aria-label={`نشر الفصل ${String(chapter.number)}`}
                                onClick={() => {
                                  choose(chapter, "published");
                                }}
                              >
                                <Eye size={16} aria-hidden="true" />
                              </button>
                            )}
                            {chapter.publicationStatus === "published" && (
                              <button
                                type="button"
                                className={styles["iconBtn"]}
                                disabled={publication.isPending}
                                aria-label={`إلغاء نشر الفصل ${String(chapter.number)}`}
                                title="إلغاء النشر"
                                onClick={() => {
                                  choose(chapter, "draft");
                                }}
                              >
                                <EyeOff size={16} aria-hidden="true" />
                              </button>
                            )}
                            <button
                              type="button"
                              className={styles["iconBtn"]}
                              disabled={publication.isPending}
                              aria-label={`${chapter.publicationStatus === "archived" ? "استعادة" : "أرشفة"} الفصل ${String(chapter.number)}`}
                              title={
                                chapter.publicationStatus === "archived"
                                  ? "استعادة الفصل"
                                  : "أرشفة الفصل"
                              }
                              onClick={() => {
                                choose(
                                  chapter,
                                  chapter.publicationStatus === "archived"
                                    ? "draft"
                                    : "archived",
                                );
                              }}
                            >
                              {chapter.publicationStatus === "archived" ? (
                                <RotateCcw size={16} aria-hidden="true" />
                              ) : (
                                <Archive size={16} aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {pagination && (
              <AdminPagination
                currentPage={page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={PAGE_SIZE}
                onPageChange={setPage}
                itemName="فصل"
              />
            )}
          </div>
        </>
      )}
      <AdminConfirmDialog
        isOpen={selection !== null}
        busy={publication.isPending}
        title={selection ? `تأكيد ${actions[selection.targetState]}` : ""}
        description={
          selection
            ? `هل تريد ${actions[selection.targetState]} ${String(selection.number)}؟`
            : ""
        }
        onConfirm={() => void confirm()}
        onCancel={() => {
          if (!publication.isPending) setSelection(null);
        }}
      />
    </div>
  );
}

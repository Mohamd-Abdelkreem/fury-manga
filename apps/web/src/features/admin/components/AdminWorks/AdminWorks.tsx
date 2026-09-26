"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  Archive,
  BookOpen,
  Edit,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import type {
  AdminWorkListItem,
  AdminWorkListQuery,
  PublicationStatus,
  StoryStatus,
  WorkType,
} from "@fury/contracts";

import {
  useAdminWorkList,
  useTransitionAdminWork,
} from "../../hooks/admin-content.hooks";
import { adminWorkErrorMessage } from "../../model/admin-content.errors";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminPagination } from "../AdminPagination/AdminPagination";
import { AdminStatusBadge } from "../AdminStatusBadge/AdminStatusBadge";
import styles from "./AdminWorks.module.css";

const PAGE_SIZE = 25;
type Filter<T extends string> = T | "all";
type PendingAction = Readonly<{
  work: AdminWorkListItem;
  targetState: PublicationStatus;
}>;

export function AdminWorks() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<Filter<WorkType>>("all");
  const [storyStatus, setStoryStatus] = useState<Filter<StoryStatus>>("all");
  const [publicationStatus, setPublicationStatus] =
    useState<Filter<PublicationStatus>>("all");
  const [sort, setSort] = useState<AdminWorkListQuery["sort"]>("updated");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<PendingAction | null>(null);
  const [actionError, setActionError] = useState<unknown>(null);
  const query = useMemo<AdminWorkListQuery>(
    () => ({
      page,
      limit: PAGE_SIZE,
      sort,
      ...(search.trim() ? { search: search.trim().normalize("NFC") } : {}),
      ...(type === "all" ? {} : { type }),
      ...(storyStatus === "all" ? {} : { storyStatus }),
      ...(publicationStatus === "all" ? {} : { publicationStatus }),
    }),
    [page, publicationStatus, search, sort, storyStatus, type],
  );
  const works = useAdminWorkList(query);
  const transition = useTransitionAdminWork();
  const pagination = works.data?.pagination;
  const hasFilters =
    search.trim().length > 0 ||
    type !== "all" ||
    storyStatus !== "all" ||
    publicationStatus !== "all";

  const resetFilters = () => {
    setSearch("");
    setType("all");
    setStoryStatus("all");
    setPublicationStatus("all");
    setSort("updated");
    setPage(1);
  };
  const confirmTransition = async () => {
    if (action === null || transition.isPending) return;
    setActionError(null);
    try {
      await transition.mutateAsync({
        workId: action.work.id,
        body: {
          expectedVersion: action.work.version,
          targetState: action.targetState,
        },
      });
      setAction(null);
    } catch (error: unknown) {
      setActionError(error);
      setAction(null);
    }
  };

  return (
    <div dir="rtl">
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "إدارة الأعمال" },
        ]}
        title="إدارة الأعمال"
        description="استعرض الأعمال المحفوظة وابحث فيها حسب النوع والحالة."
        primaryAction={{
          label: "إنشاء عمل جديد",
          href: "/admin/works/new",
          icon: Plus,
        }}
      />
      <section aria-label="أدوات تصفية الأعمال" className={styles["toolbar"]}>
        <div className={styles["searchAndSortRow"]}>
          <div className={styles["searchBox"]}>
            <Search className={styles["searchIcon"]} aria-hidden="true" />
            <input
              type="search"
              className={styles["searchInput"]}
              value={search}
              maxLength={200}
              placeholder="ابحث بالعنوان أو العنوان البديل"
              aria-label="البحث عن عمل"
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className={styles["filterGroup"]}>
            <label htmlFor="work-sort" className={styles["filterLabel"]}>
              الترتيب:
            </label>
            <select
              id="work-sort"
              className={styles["filterSelect"]}
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as AdminWorkListQuery["sort"]);
                setPage(1);
              }}
            >
              <option value="updated">الأحدث تحديثًا</option>
              <option value="oldest">الأقدم تاريخًا</option>
              <option value="title">أبجديًا بالعنوان</option>
              <option value="chapters">الأكثر فصولًا</option>
            </select>
          </div>
        </div>
        <div className={styles["filtersRow"]}>
          <div className={styles["filterGroup"]}>
            <label htmlFor="work-type" className={styles["filterLabel"]}>
              نوع العمل:
            </label>
            <select
              id="work-type"
              className={styles["filterSelect"]}
              value={type}
              onChange={(event) => {
                setType(event.target.value as Filter<WorkType>);
                setPage(1);
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
          <div className={styles["filterGroup"]}>
            <label htmlFor="story-status" className={styles["filterLabel"]}>
              حالة القصة:
            </label>
            <select
              id="story-status"
              className={styles["filterSelect"]}
              value={storyStatus}
              onChange={(event) => {
                setStoryStatus(event.target.value as Filter<StoryStatus>);
                setPage(1);
              }}
            >
              <option value="all">كل الحالات</option>
              <option value="ongoing">مستمرة</option>
              <option value="completed">مكتملة</option>
              <option value="hiatus">متوقفة مؤقتًا</option>
              <option value="cancelled">ملغاة</option>
            </select>
          </div>
          <div className={styles["filterGroup"]}>
            <label
              htmlFor="publication-status"
              className={styles["filterLabel"]}
            >
              حالة النشر:
            </label>
            <select
              id="publication-status"
              className={styles["filterSelect"]}
              value={publicationStatus}
              onChange={(event) => {
                setPublicationStatus(
                  event.target.value as Filter<PublicationStatus>,
                );
                setPage(1);
              }}
            >
              <option value="all">الكل</option>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
              <option value="archived">مؤرشف</option>
            </select>
          </div>
          {hasFilters && (
            <button
              type="button"
              className={styles["resetBtn"]}
              onClick={resetFilters}
            >
              إعادة ضبط التصفية
            </button>
          )}
        </div>
      </section>
      {!works.sessionReady ? (
        <p role="status">جارٍ تحميل الأعمال المحفوظة…</p>
      ) : !works.available ? (
        <p role="alert">يلزم حساب مدير نشط وموثق لعرض الأعمال.</p>
      ) : works.denied ? (
        <section role="alert">
          <p>تعذّر التحقق من صلاحية الإدارة.</p>
          <button type="button" onClick={() => void works.retryAccess()}>
            إعادة التحقق
          </button>
        </section>
      ) : works.isPending ? (
        <p role="status">جارٍ تحميل الأعمال المحفوظة…</p>
      ) : works.isError && works.data === undefined ? (
        <section role="alert">
          <p>{adminWorkErrorMessage(works.error)}</p>
          <button type="button" onClick={() => void works.refetch()}>
            إعادة المحاولة
          </button>
        </section>
      ) : (
        <div className={styles["tableCard"]}>
          {works.isFetching && (
            <p role="status">جارٍ تحديث النتائج المحفوظة…</p>
          )}
          {works.isError && (
            <div role="alert">
              <p>تعذّر تحديث النتائج. المعروض آخر بيانات مؤكدة.</p>
              <button type="button" onClick={() => void works.refetch()}>
                إعادة المحاولة
              </button>
            </div>
          )}
          {works.data.items.length === 0 ? (
            <div className={styles["emptyBox"]}>
              <BookOpen size={48} aria-hidden="true" />
              <h2 className={styles["emptyTitle"]}>
                {hasFilters ? "لا توجد أعمال مطابقة" : "لا توجد أعمال محفوظة"}
              </h2>
              <p className={styles["emptyText"]}>
                {hasFilters
                  ? "غيّر البحث أو التصفية لعرض أعمال أخرى."
                  : "أنشئ أول عمل لتظهر بياناته المحفوظة هنا."}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  className="button button--small"
                  onClick={resetFilters}
                >
                  إعادة تعيين البحث والتصفية
                </button>
              )}
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
                  {works.data.items.map((work) => (
                    <tr key={work.id} className={styles["tr"]}>
                      <td className={styles["td"]}>
                        <div className={styles["workCell"]}>
                          <div className={styles["titleGroup"]}>
                            <span className={styles["workName"]} dir="auto">
                              {work.title}
                            </span>
                            {work.alternativeTitle && (
                              <span className={styles["altTitle"]} dir="auto">
                                {work.alternativeTitle}
                              </span>
                            )}
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
                          status={work.publicationStatus}
                        />
                      </td>
                      <td className={styles["td"]}>
                        <span className={styles["countCell"]}>
                          {work.chapterCount.toLocaleString("ar-EG")}
                        </span>
                      </td>
                      <td className={styles["td"]}>
                        <time
                          className={styles["dateCell"]}
                          dateTime={work.updatedAt}
                        >
                          {new Date(work.updatedAt).toLocaleDateString("ar-EG")}
                        </time>
                      </td>
                      <td className={styles["td"]}>
                        <div className={styles["rowActions"]}>
                          <Link
                            href={`/admin/works/${work.id}/edit` as Route}
                            className={styles["iconActionBtn"]}
                            aria-label={`فتح بيانات ${work.title}`}
                            title="فتح العمل المحفوظ"
                          >
                            <Edit size={16} aria-hidden="true" />
                          </Link>
                          {work.publicationStatus === "published" && (
                            <button
                              type="button"
                              className={styles["iconActionBtn"]}
                              aria-label={`إلغاء نشر ${work.title}`}
                              onClick={() => {
                                setAction({ work, targetState: "draft" });
                              }}
                            >
                              <EyeOff size={16} aria-hidden="true" />
                            </button>
                          )}
                          {work.publicationStatus === "draft" && (
                            <button
                              type="button"
                              className={styles["iconActionBtn"]}
                              aria-label={`نشر ${work.title}`}
                              onClick={() => {
                                setAction({ work, targetState: "published" });
                              }}
                            >
                              <Eye size={16} aria-hidden="true" />
                            </button>
                          )}
                          {work.publicationStatus !== "archived" ? (
                            <button
                              type="button"
                              className={styles["iconActionBtn"]}
                              aria-label={`أرشفة ${work.title}`}
                              onClick={() => {
                                setAction({ work, targetState: "archived" });
                              }}
                            >
                              <Archive size={16} aria-hidden="true" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={styles["iconActionBtn"]}
                              aria-label={`استعادة ${work.title}`}
                              onClick={() => {
                                setAction({ work, targetState: "draft" });
                              }}
                            >
                              <RotateCcw size={16} aria-hidden="true" />
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
          {pagination && (
            <AdminPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={setPage}
              itemName="عمل"
            />
          )}
        </div>
      )}
      {actionError !== null && (
        <div role="alert">
          <p>{adminWorkErrorMessage(actionError)}</p>
          <button
            type="button"
            onClick={() => {
              setActionError(null);
              void works.refetch();
            }}
          >
            تحديث القائمة
          </button>
        </div>
      )}
      <AdminConfirmDialog
        isOpen={action !== null}
        title="تأكيد تغيير حالة العمل"
        description={
          action === null ? "" : `هل تريد تغيير حالة ${action.work.title}؟`
        }
        confirmLabel="تأكيد"
        cancelLabel="إلغاء"
        onConfirm={() => void confirmTransition()}
        onCancel={() => {
          if (!transition.isPending) setAction(null);
        }}
      />
    </div>
  );
}

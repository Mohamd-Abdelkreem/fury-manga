"use client";

import {
  ArrowDown,
  ArrowUp,
  FolderTree,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { AdminCategory, CategoryListQuery } from "@fury/contracts";

import {
  adminContentErrorMessage,
  categoryFieldErrors,
} from "../../model/admin-content.errors";
import {
  useAdminCategoryDetail,
  useAdminCategoryList,
  useCreateAdminCategory,
  useMoveAdminCategory,
  useUpdateAdminCategory,
} from "../../hooks/admin-content.hooks";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminPagination } from "../AdminPagination/AdminPagination";
import { AdminCategoryDialog, type CategoryDraft } from "./AdminCategoryDialog";
import styles from "./AdminCategories.module.css";

const PAGE_SIZE = 25;

type CategoryDialogState =
  | Readonly<{ mode: "create"; requestId: string }>
  | Readonly<{ mode: "edit"; categoryId: string }>;

export function AdminCategories() {
  const [search, setSearch] = useState("");
  const [enabledFilter, setEnabledFilter] = useState<"all" | "true" | "false">(
    "all",
  );
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<CategoryDialogState | null>(null);
  const [draft, setDraft] = useState<CategoryDraft>({ name: "", slug: "" });
  const [pendingDisable, setPendingDisable] = useState<AdminCategory | null>(
    null,
  );
  const [writeError, setWriteError] = useState<unknown>(null);
  const [accessRetryError, setAccessRetryError] = useState<unknown>(null);
  const [isRetryingAccess, setIsRetryingAccess] = useState(false);
  const hasFilters = search.trim().length > 0 || enabledFilter !== "all";

  const query = useMemo<CategoryListQuery>(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(search.trim().length === 0
        ? {}
        : { search: search.trim().normalize("NFC") }),
      ...(enabledFilter === "all" ? {} : { enabled: enabledFilter === "true" }),
    }),
    [enabledFilter, page, search],
  );
  const categories = useAdminCategoryList(query);
  const globalCategoryCount = useAdminCategoryList(
    { page: 1, limit: 1 },
    { enabled: hasFilters },
  );
  const categoryTotal = hasFilters
    ? globalCategoryCount.data?.pagination.total
    : categories.data?.pagination.total;
  const detail = useAdminCategoryDetail(
    dialog?.mode === "edit" ? dialog.categoryId : null,
  );
  const createCategory = useCreateAdminCategory();
  const updateCategory = useUpdateAdminCategory();
  const moveCategory = useMoveAdminCategory();
  const isMutationPending =
    createCategory.isPending ||
    updateCategory.isPending ||
    moveCategory.isPending;
  const fieldErrors = categoryFieldErrors(writeError);
  const mutationErrorMessage =
    writeError === null ? null : adminContentErrorMessage(writeError);
  const queryErrorMessage = categories.isError
    ? adminContentErrorMessage(categories.error)
    : null;
  const categoryCountErrorMessage =
    hasFilters && globalCategoryCount.isError
      ? adminContentErrorMessage(globalCategoryCount.error)
      : null;
  const items = categories.data?.items ?? [];
  const detailError = detail.isError
    ? adminContentErrorMessage(detail.error)
    : null;

  const closeDialog = () => {
    if (isMutationPending) return;
    setDialog(null);
    setDraft({ name: "", slug: "" });
    setWriteError(null);
  };

  const openCreate = () => {
    setWriteError(null);
    setDraft({ name: "", slug: "" });
    setDialog({ mode: "create", requestId: globalThis.crypto.randomUUID() });
  };

  const openEdit = (category: AdminCategory) => {
    setWriteError(null);
    setDraft({ name: category.displayName, slug: category.slug });
    setDialog({ mode: "edit", categoryId: category.id });
  };

  const saveCategory = async () => {
    if (dialog === null) return;
    setWriteError(null);
    const displayName = draft.name.trim().normalize("NFC");
    const slug = draft.slug.trim().normalize("NFC").toLowerCase();
    try {
      if (dialog.mode === "create") {
        await createCategory.mutateAsync({
          id: dialog.requestId,
          displayName,
          slug,
        });
      } else {
        const category = detail.data;
        if (category === undefined) return;
        await updateCategory.mutateAsync({
          categoryId: category.id,
          body: { expectedVersion: category.version, displayName },
        });
      }
      setDialog(null);
      setDraft({ name: "", slug: "" });
    } catch (error: unknown) {
      setWriteError(error);
    }
  };

  const setCategoryEnabled = async (
    category: AdminCategory,
    enabled: boolean,
  ) => {
    setWriteError(null);
    try {
      await updateCategory.mutateAsync({
        categoryId: category.id,
        body: { expectedVersion: category.version, enabled },
      });
    } catch (error: unknown) {
      setWriteError(error);
    }
  };

  const requestToggle = (category: AdminCategory) => {
    if (category.enabled && category.worksCount > 0) {
      setPendingDisable(category);
      return;
    }
    void setCategoryEnabled(category, !category.enabled);
  };

  const confirmDisable = () => {
    if (pendingDisable === null) return;
    const category = pendingDisable;
    setPendingDisable(null);
    void setCategoryEnabled(category, false);
  };

  const move = async (category: AdminCategory, direction: -1 | 1) => {
    setWriteError(null);
    try {
      await moveCategory.mutateAsync({
        categoryId: category.id,
        body: {
          expectedVersion: category.version,
          targetPosition: category.displayPosition + direction,
        },
      });
    } catch (error: unknown) {
      setWriteError(error);
    }
  };

  const retryCategoryAccess = async () => {
    setIsRetryingAccess(true);
    setAccessRetryError(null);
    try {
      await categories.retryAccess();
    } catch (error: unknown) {
      setAccessRetryError(error);
    } finally {
      setIsRetryingAccess(false);
    }
  };

  if (!categories.sessionReady) {
    return (
      <p className={styles["status"]} role="status" aria-live="polite">
        جارٍ التحقق من الجلسة…
      </p>
    );
  }
  if (!categories.available) {
    return (
      <p className={styles["status"]} role="alert">
        ليس لديك صلاحية للوصول إلى إدارة التصنيفات.
      </p>
    );
  }
  if (categories.denied) {
    return (
      <div className={styles["statusPanel"]}>
        <p role="alert">
          {accessRetryError === null
            ? "تعذر التحقق من صلاحية إدارة التصنيفات. أعد المحاولة للتحقق من الوصول."
            : adminContentErrorMessage(accessRetryError)}
        </p>
        <button
          type="button"
          onClick={() => void retryCategoryAccess()}
          disabled={isRetryingAccess}
        >
          {isRetryingAccess ? "جارٍ إعادة التحقق…" : "إعادة التحقق"}
        </button>
      </div>
    );
  }
  const hasData = categories.data !== undefined;
  const emptyHeading = hasFilters
    ? "لا توجد تصنيفات مطابقة"
    : "لا توجد تصنيفات محفوظة";

  return (
    <div className={styles["container"]}>
      <div className={styles["toolbar"]}>
        <label className={styles["search"]}>
          <Search aria-hidden="true" />
          <span className="sr-only">البحث في التصنيفات</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="ابحث بالاسم أو الرابط…"
          />
        </label>
        <label className={styles["filter"]}>
          <span>الحالة</span>
          <select
            aria-label="تصفية التصنيفات حسب الحالة"
            value={enabledFilter}
            onChange={(event) => {
              setEnabledFilter(event.target.value as typeof enabledFilter);
              setPage(1);
            }}
          >
            <option value="all">كل الحالات</option>
            <option value="true">مفعّل</option>
            <option value="false">معطّل</option>
          </select>
        </label>
        <button
          type="button"
          className={styles["primary"]}
          onClick={openCreate}
        >
          <Plus aria-hidden="true" /> إنشاء تصنيف
        </button>
      </div>

      {categories.isFetching && hasData ? (
        <p
          className={styles["backgroundStatus"]}
          role="status"
          aria-live="polite"
        >
          جارٍ تحديث النتائج…
        </p>
      ) : null}
      {queryErrorMessage === null || categories.data === undefined ? null : (
        <p className={styles["error"]} role="alert">
          {queryErrorMessage}
        </p>
      )}
      {categoryCountErrorMessage === null ? null : (
        <div className={styles["statusPanel"]} role="alert">
          <p>تعذر التحقق من حد ترتيب التصنيفات. {categoryCountErrorMessage}</p>
          <button
            type="button"
            onClick={() => {
              void globalCategoryCount.refetch();
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      )}
      {mutationErrorMessage === null ? null : (
        <p className={styles["error"]} role="alert" aria-live="assertive">
          {mutationErrorMessage}
        </p>
      )}

      {!hasData ? (
        categories.isError ? (
          <div className={styles["statusPanel"]}>
            <p role="alert">{queryErrorMessage}</p>
            <button type="button" onClick={() => void categories.refetch()}>
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <p className={styles["status"]} role="status" aria-live="polite">
            جارٍ تحميل التصنيفات المحفوظة…
          </p>
        )
      ) : items.length === 0 ? (
        <div className={styles["empty"]}>
          <FolderTree aria-hidden="true" />
          <h2>{emptyHeading}</h2>
          <p>
            {hasFilters
              ? "عدّل البحث أو الحالة لعرض التصنيفات المحفوظة."
              : "أنشئ أول تصنيف ليظهر هنا."}
          </p>
          {!hasFilters ? (
            <button
              type="button"
              className={styles["primary"]}
              onClick={openCreate}
            >
              <Plus aria-hidden="true" /> إنشاء تصنيف
            </button>
          ) : null}
        </div>
      ) : (
        <div className={styles["tableWrap"]}>
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الرابط</th>
                <th>الحالة</th>
                <th>الترتيب العام</th>
                <th>الأعمال المرتبطة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((category) => (
                <tr key={category.id}>
                  <td>
                    <strong>{category.displayName}</strong>
                  </td>
                  <td>
                    <code dir="ltr">{category.slug}</code>
                  </td>
                  <td>
                    <span
                      className={
                        category.enabled
                          ? styles["enabled"]
                          : styles["disabled"]
                      }
                    >
                      {category.enabled ? "مفعّل" : "معطّل"}
                    </span>
                  </td>
                  <td>
                    <div className={styles["order"]}>
                      <span>
                        {category.displayPosition.toLocaleString("ar-EG")}
                      </span>
                      <button
                        type="button"
                        disabled={
                          category.displayPosition <= 1 || isMutationPending
                        }
                        onClick={() => {
                          void move(category, -1);
                        }}
                        aria-label={`رفع ترتيب ${category.displayName}`}
                      >
                        <ArrowUp aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        disabled={
                          isMutationPending ||
                          categoryTotal === undefined ||
                          category.displayPosition >= categoryTotal ||
                          (hasFilters && globalCategoryCount.isFetching)
                        }
                        onClick={() => {
                          void move(category, 1);
                        }}
                        aria-label={`خفض ترتيب ${category.displayName}`}
                      >
                        <ArrowDown aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                  <td>{category.worksCount.toLocaleString("ar-EG")}</td>
                  <td>
                    <div className={styles["actions"]}>
                      <button
                        type="button"
                        disabled={isMutationPending}
                        onClick={() => {
                          openEdit(category);
                        }}
                      >
                        <Pencil aria-hidden="true" /> تعديل
                      </button>
                      <button
                        type="button"
                        disabled={isMutationPending}
                        onClick={() => {
                          requestToggle(category);
                        }}
                      >
                        {category.enabled ? "تعطيل" : "تفعيل"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {categories.data === undefined ? null : (
        <AdminPagination
          currentPage={categories.data.pagination.page}
          totalPages={categories.data.pagination.totalPages}
          totalItems={categories.data.pagination.total}
          itemsPerPage={categories.data.pagination.limit}
          onPageChange={setPage}
          itemName="تصنيف"
        />
      )}

      {dialog === null ? null : (
        <AdminCategoryDialog
          mode={dialog.mode}
          draft={draft}
          fieldErrors={fieldErrors}
          errorMessage={detailError ?? mutationErrorMessage}
          isPending={
            isMutationPending ||
            (dialog.mode === "edit" && (detail.isLoading || detail.isFetching))
          }
          canSave={
            dialog.mode === "create" ||
            (detail.data !== undefined && !detail.isError)
          }
          retryDetail={
            dialog.mode === "edit" && detailError !== null
              ? () => {
                  void detail.refetch();
                }
              : null
          }
          onDraftChange={(nextDraft) => {
            setDraft(nextDraft);
            setWriteError(null);
          }}
          onClose={closeDialog}
          onSave={() => {
            void saveCategory();
          }}
        />
      )}

      <AdminConfirmDialog
        isOpen={pendingDisable !== null}
        title="تعطيل التصنيف"
        description={
          pendingDisable === null
            ? ""
            : `يرتبط تصنيف ${pendingDisable.displayName} بعدد ${String(pendingDisable.worksCount)} من الأعمال. سيظل الارتباط محفوظًا، لكن التصنيف سيختفي من التصفح العام. سيُرفض التعطيل إذا أصبح التصنيف مطلوبًا لعمل منشور.`
        }
        confirmLabel="تعطيل التصنيف"
        cancelLabel="إلغاء"
        onCancel={() => {
          setPendingDisable(null);
        }}
        onConfirm={confirmDisable}
      />
    </div>
  );
}

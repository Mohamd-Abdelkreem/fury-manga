"use client";

import { useEffect, useRef } from "react";

import type { CategoryFieldErrors } from "../../model/admin-content.errors";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminCategories.module.css";

export type CategoryDraft = Readonly<{ name: string; slug: string }>;

type AdminCategoryDialogProps = Readonly<{
  mode: "create" | "edit";
  draft: CategoryDraft;
  fieldErrors: CategoryFieldErrors;
  errorMessage: string | null;
  isPending: boolean;
  canSave: boolean;
  lockDraft: boolean;
  retryDetail: (() => void) | null;
  checkCreate: (() => void) | null;
  onDraftChange: (draft: CategoryDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>;

export function AdminCategoryDialog({
  mode,
  draft,
  fieldErrors,
  errorMessage,
  isPending,
  canSave,
  lockDraft,
  retryDetail,
  checkCreate,
  onDraftChange,
  onClose,
  onSave,
}: AdminCategoryDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const slugInputRef = useRef<HTMLInputElement>(null);
  const closeWhenIdle = () => {
    if (!isPending) onClose();
  };
  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen: true,
    onClose: closeWhenIdle,
  });

  useEffect(() => {
    if (fieldErrors.name !== undefined) nameInputRef.current?.focus();
    else if (fieldErrors.slug !== undefined) slugInputRef.current?.focus();
  }, [fieldErrors]);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className={styles["backdrop"]}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-dialog-title"
      onKeyDown={onDialogKeyDown}
      onClick={closeWhenIdle}
    >
      <form
        className={styles["dialog"]}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onSubmit={(event) => {
          event.preventDefault();
          if (!isPending && canSave) onSave();
        }}
      >
        <h2 id="category-dialog-title">
          {mode === "create" ? "إنشاء تصنيف" : "تعديل التصنيف"}
        </h2>
        <label>
          اسم التصنيف
          <input
            ref={nameInputRef}
            value={draft.name}
            onChange={(event) => {
              onDraftChange({ ...draft, name: event.target.value });
            }}
            aria-invalid={fieldErrors.name === undefined ? undefined : true}
            aria-describedby={
              fieldErrors.name === undefined ? undefined : "category-name-error"
            }
            maxLength={100}
            readOnly={lockDraft}
            required
          />
          {fieldErrors.name === undefined ? null : (
            <span id="category-name-error" role="alert">
              {fieldErrors.name}
            </span>
          )}
        </label>
        <label>
          الرابط المختصر
          <input
            ref={slugInputRef}
            dir="ltr"
            value={draft.slug}
            onChange={(event) => {
              onDraftChange({ ...draft, slug: event.target.value });
            }}
            readOnly={mode === "edit" || lockDraft}
            maxLength={120}
            pattern="[A-Za-z0-9-]+"
            aria-invalid={fieldErrors.slug === undefined ? undefined : true}
            aria-describedby={
              fieldErrors.slug === undefined ? undefined : "category-slug-error"
            }
            required
          />
          {fieldErrors.slug === undefined ? null : (
            <span id="category-slug-error" role="alert">
              {fieldErrors.slug}
            </span>
          )}
        </label>
        {mode === "edit" ? (
          <p>لا يمكن تغيير الرابط المختصر بعد إنشاء التصنيف.</p>
        ) : (
          <p>راجع الاسم والرابط المختصر قبل حفظ التصنيف.</p>
        )}
        {errorMessage === null ? null : (
          <p role="alert" aria-live="assertive">
            {errorMessage}
          </p>
        )}
        {retryDetail === null ? null : (
          <button type="button" onClick={retryDetail} disabled={isPending}>
            إعادة تحميل التصنيف
          </button>
        )}
        {checkCreate === null ? null : (
          <button type="button" onClick={checkCreate} disabled={isPending}>
            التحقق من نتيجة الحفظ
          </button>
        )}
        <div>
          <button type="button" onClick={closeWhenIdle} disabled={isPending}>
            إلغاء
          </button>
          <button
            type="submit"
            className={styles["primary"]}
            disabled={isPending || !canSave}
          >
            {isPending ? "جارٍ الحفظ…" : "حفظ التصنيف"}
          </button>
        </div>
      </form>
    </div>
  );
}

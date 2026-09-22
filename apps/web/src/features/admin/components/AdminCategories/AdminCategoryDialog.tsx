"use client";

import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminCategories.module.css";

export type CategoryDraft = Readonly<{ name: string; slug: string }>;

type AdminCategoryDialogProps = Readonly<{
  mode: "create" | "edit";
  draft: CategoryDraft;
  onDraftChange: (draft: CategoryDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>;

export function AdminCategoryDialog({
  mode,
  draft,
  onDraftChange,
  onClose,
  onSave,
}: AdminCategoryDialogProps) {
  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen: true,
    onClose,
  });

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className={styles["backdrop"]}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-dialog-title"
      onKeyDown={onDialogKeyDown}
      onClick={onClose}
    >
      <form
        className={styles["dialog"]}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <h2 id="category-dialog-title">
          {mode === "create" ? "إنشاء تصنيف" : "تعديل التصنيف"}
        </h2>
        <label>
          اسم التصنيف
          <input
            value={draft.name}
            onChange={(event) => {
              onDraftChange({ ...draft, name: event.target.value });
            }}
            required
          />
        </label>
        <label>
          الرابط المختصر
          <input
            dir="ltr"
            value={draft.slug}
            onChange={(event) => {
              onDraftChange({ ...draft, slug: event.target.value });
            }}
            pattern="[a-z0-9-]+"
            required
          />
        </label>
        <p>راجع الاسم والرابط المختصر قبل حفظ التصنيف.</p>
        <div>
          <button type="button" onClick={onClose}>
            إلغاء
          </button>
          <button type="submit" className={styles["primary"]}>
            حفظ التصنيف
          </button>
        </div>
      </form>
    </div>
  );
}

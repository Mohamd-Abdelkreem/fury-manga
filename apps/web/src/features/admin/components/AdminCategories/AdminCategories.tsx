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

import {
  ADMIN_CATEGORY_FIXTURES,
  type AdminCategory,
} from "../../data/adminCategories";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminCategoryDialog, type CategoryDraft } from "./AdminCategoryDialog";
import styles from "./AdminCategories.module.css";

export function AdminCategories() {
  const [categories, setCategories] = useState<readonly AdminCategory[]>(
    ADMIN_CATEGORY_FIXTURES,
  );
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<{
    mode: "create" | "edit";
    categoryId?: string;
  } | null>(null);
  const [draft, setDraft] = useState<CategoryDraft>({ name: "", slug: "" });
  const [pendingDisable, setPendingDisable] = useState<AdminCategory | null>(
    null,
  );
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ar");
    return categories.filter(
      (category) =>
        query.length === 0 ||
        category.name.toLocaleLowerCase("ar").includes(query) ||
        category.slug.includes(query),
    );
  }, [categories, search]);

  const closeDialog = () => {
    setDialog(null);
    setDraft({ name: "", slug: "" });
  };
  const saveCategory = () => {
    const name = draft.name.trim();
    const slug = draft.slug.trim().toLocaleLowerCase("en");
    if (name.length === 0 || slug.length === 0 || dialog === null) return;
    if (dialog.mode === "create") {
      setCategories((current) => [
        ...current,
        {
          id: `local-${String(Date.now())}`,
          name,
          slug,
          enabled: true,
          displayOrder: current.length + 1,
          worksCount: 0,
        },
      ]);
    } else if (dialog.categoryId !== undefined) {
      setCategories((current) =>
        current.map((category) =>
          category.id === dialog.categoryId
            ? { ...category, name, slug }
            : category,
        ),
      );
    }
    closeDialog();
  };
  const toggleCategory = (category: AdminCategory) => {
    if (category.enabled && category.worksCount > 0) {
      setPendingDisable(category);
      return;
    }
    setCategories((current) =>
      current.map((item) =>
        item.id === category.id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };
  const moveCategory = (id: string, direction: -1 | 1) => {
    setCategories((current) => {
      const index = current.findIndex((category) => category.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      const moving = next[index];
      const displaced = next[target];
      if (moving === undefined || displaced === undefined) return current;
      next[index] = { ...displaced, displayOrder: index + 1 };
      next[target] = { ...moving, displayOrder: target + 1 };
      return next;
    });
  };

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
            }}
            placeholder="ابحث بالاسم أو الرابط…"
          />
        </label>
        <button
          type="button"
          className={styles["primary"]}
          onClick={() => {
            setDraft({ name: "", slug: "" });
            setDialog({ mode: "create" });
          }}
        >
          <Plus aria-hidden="true" /> إنشاء تصنيف
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={styles["empty"]}>
          <FolderTree aria-hidden="true" />
          <h2>لا توجد تصنيفات مطابقة</h2>
          <p>عدّل البحث أو أنشئ تصنيفًا جديدًا.</p>
        </div>
      ) : (
        <div className={styles["tableWrap"]}>
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الرابط</th>
                <th>الحالة</th>
                <th>الترتيب</th>
                <th>الأعمال المرتبطة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((category) => (
                <tr key={category.id}>
                  <td>
                    <strong>{category.name}</strong>
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
                      <span>{category.displayOrder}</span>
                      <button
                        type="button"
                        disabled={categories[0]?.id === category.id}
                        onClick={() => {
                          moveCategory(category.id, -1);
                        }}
                        aria-label={`رفع ترتيب ${category.name}`}
                      >
                        <ArrowUp aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        disabled={categories.at(-1)?.id === category.id}
                        onClick={() => {
                          moveCategory(category.id, 1);
                        }}
                        aria-label={`خفض ترتيب ${category.name}`}
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
                        onClick={() => {
                          setDraft({
                            name: category.name,
                            slug: category.slug,
                          });
                          setDialog({ mode: "edit", categoryId: category.id });
                        }}
                      >
                        <Pencil aria-hidden="true" /> تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toggleCategory(category);
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

      {dialog === null ? null : (
        <AdminCategoryDialog
          mode={dialog.mode}
          draft={draft}
          onDraftChange={setDraft}
          onClose={closeDialog}
          onSave={saveCategory}
        />
      )}

      <AdminConfirmDialog
        isOpen={pendingDisable !== null}
        title="تعطيل التصنيف"
        description={
          pendingDisable === null
            ? ""
            : `يرتبط تصنيف ${pendingDisable.name} بعدد ${String(pendingDisable.worksCount)} من الأعمال. سيظل الارتباط محفوظًا، لكن التصنيف سيختفي من التصفح العام.`
        }
        confirmLabel="تعطيل التصنيف"
        cancelLabel="إلغاء"
        onCancel={() => {
          setPendingDisable(null);
        }}
        onConfirm={() => {
          if (pendingDisable !== null)
            setCategories((current) =>
              current.map((item) =>
                item.id === pendingDisable.id
                  ? { ...item, enabled: false }
                  : item,
              ),
            );
          setPendingDisable(null);
        }}
      />
    </div>
  );
}

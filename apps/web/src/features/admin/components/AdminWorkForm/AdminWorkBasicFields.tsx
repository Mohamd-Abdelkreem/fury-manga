import { useState } from "react";
import { useFormContext } from "react-hook-form";

import type { AdminCategory } from "@fury/contracts";

import { useAdminCategoryPicker } from "../../hooks/admin-content.hooks";
import { adminContentErrorMessage } from "../../model/admin-content.errors";
import { cn } from "@/lib/utils";
import type { FormValues } from "../../model/admin-work-form";
import styles from "./AdminWorkForm.module.css";

type Props = Readonly<{
  isEdit: boolean;
  retainedCategories: readonly AdminCategory[];
}>;

export function AdminWorkBasicFields({ isEdit, retainedCategories }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [chosenCategories, setChosenCategories] = useState<
    ReadonlyMap<string, AdminCategory>
  >(() => new Map());
  const picker = useAdminCategoryPicker(page, search);
  const values = watch();
  const selected = new Set(values.categoryIds);
  const categoriesById = new Map<string, AdminCategory>();
  for (const category of chosenCategories.values()) {
    if (selected.has(category.id)) categoriesById.set(category.id, category);
  }
  for (const category of retainedCategories) {
    if (selected.has(category.id)) categoriesById.set(category.id, category);
  }
  for (const category of picker.data?.items ?? []) {
    categoriesById.set(category.id, category);
  }
  const pickerCategories = [...categoriesById.values()].toSorted(
    (left, right) => left.displayPosition - right.displayPosition,
  );
  const toggleCategory = (categoryId: string, checked: boolean) => {
    const next = new Set(values.categoryIds);
    if (checked) next.add(categoryId);
    else next.delete(categoryId);
    setChosenCategories((current) => {
      const updated = new Map(current);
      if (checked) {
        const category = categoriesById.get(categoryId);
        if (category !== undefined) updated.set(categoryId, category);
      } else updated.delete(categoryId);
      return updated;
    });
    setValue("categoryIds", [...next], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <section className={styles["formCard"]}>
      <div className={styles["sectionHeader"]}>
        <h2 className={styles["sectionTitle"]}>بيانات المسودة</h2>
      </div>

      <div className={styles["fieldsGrid2"]}>
        <div className={styles["field"]}>
          <label htmlFor="work-title" className={styles["label"]}>
            عنوان العمل
            <span className={styles["requiredMark"]}>*</span>
          </label>
          <input
            id="work-title"
            className={cn(
              styles["input"],
              errors.title && styles["inputError"],
            )}
            autoComplete="off"
            {...register("title")}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? "work-title-error" : undefined}
          />
          {errors.title?.message ? (
            <p
              id="work-title-error"
              className={styles["errorMessage"]}
              role="alert"
            >
              {errors.title.message}
            </p>
          ) : null}
        </div>

        <div className={styles["field"]}>
          <label htmlFor="work-alt-title" className={styles["label"]}>
            العنوان البديل
          </label>
          <input
            id="work-alt-title"
            className={cn(
              styles["input"],
              errors.alternativeTitle && styles["inputError"],
            )}
            {...register("alternativeTitle")}
            aria-invalid={errors.alternativeTitle ? true : undefined}
            aria-describedby={
              errors.alternativeTitle ? "work-alt-title-error" : undefined
            }
          />
          {errors.alternativeTitle?.message ? (
            <p
              id="work-alt-title-error"
              className={styles["errorMessage"]}
              role="alert"
            >
              {errors.alternativeTitle.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className={styles["fieldsGrid3"]}>
        <div className={styles["field"]}>
          <label htmlFor="work-slug" className={styles["label"]}>
            الرابط المختصر
          </label>
          {isEdit ? <input type="hidden" {...register("slug")} /> : null}
          <input
            id="work-slug"
            className={cn(styles["input"], errors.slug && styles["inputError"])}
            autoComplete="off"
            dir="ltr"
            disabled={isEdit}
            {...(isEdit ? {} : register("slug"))}
            value={isEdit ? values.slug : undefined}
            aria-invalid={errors.slug ? true : undefined}
            aria-describedby={errors.slug ? "work-slug-error" : undefined}
          />
          {errors.slug?.message ? (
            <p
              id="work-slug-error"
              className={styles["errorMessage"]}
              role="alert"
            >
              {errors.slug.message}
            </p>
          ) : null}
        </div>

        <div className={styles["field"]}>
          <label htmlFor="work-type" className={styles["label"]}>
            نوع العمل
          </label>
          {isEdit ? <input type="hidden" {...register("type")} /> : null}
          <select
            id="work-type"
            className={styles["select"]}
            disabled={isEdit}
            {...(isEdit ? {} : register("type"))}
            value={values.type}
          >
            <option value="manga">مانغا</option>
            <option value="manhwa">مانهوا</option>
            <option value="manhua">مانهوا صينية</option>
            <option value="comics">كوميكس</option>
            <option value="novel">رواية</option>
            <option value="text-story">قصة نصية</option>
          </select>
        </div>

        <div className={styles["field"]}>
          <label htmlFor="work-story-status" className={styles["label"]}>
            حالة القصة
          </label>
          <select
            id="work-story-status"
            className={styles["select"]}
            {...register("storyStatus")}
          >
            <option value="ongoing">مستمرة</option>
            <option value="completed">مكتملة</option>
            <option value="hiatus">متوقفة مؤقتًا</option>
            <option value="cancelled">ملغاة</option>
          </select>
        </div>
      </div>

      <div className={styles["fieldsGrid2"]}>
        <div className={styles["field"]}>
          <label htmlFor="work-author" className={styles["label"]}>
            المؤلف
          </label>
          <input
            id="work-author"
            className={cn(
              styles["input"],
              errors.author && styles["inputError"],
            )}
            {...register("author")}
            aria-invalid={errors.author ? true : undefined}
          />
          {errors.author?.message ? (
            <p className={styles["errorMessage"]} role="alert">
              {errors.author.message}
            </p>
          ) : null}
        </div>
        <div className={styles["field"]}>
          <label htmlFor="work-artist" className={styles["label"]}>
            الرسام
          </label>
          <input
            id="work-artist"
            className={cn(
              styles["input"],
              errors.artist && styles["inputError"],
            )}
            {...register("artist")}
            aria-invalid={errors.artist ? true : undefined}
          />
          {errors.artist?.message ? (
            <p className={styles["errorMessage"]} role="alert">
              {errors.artist.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className={styles["field"]}>
        <label htmlFor="work-synopsis" className={styles["label"]}>
          نبذة العمل
        </label>
        <textarea
          id="work-synopsis"
          className={cn(
            styles["textarea"],
            errors.synopsis && styles["inputError"],
          )}
          {...register("synopsis")}
          aria-invalid={errors.synopsis ? true : undefined}
          aria-describedby={errors.synopsis ? "work-synopsis-error" : undefined}
        />
        {errors.synopsis?.message ? (
          <p
            id="work-synopsis-error"
            className={styles["errorMessage"]}
            role="alert"
          >
            {errors.synopsis.message}
          </p>
        ) : (
          <p className={styles["hint"]}>يمكن حفظ المسودة دون نبذة مكتملة.</p>
        )}
      </div>

      <fieldset className={styles["field"]}>
        <legend className={styles["label"]}>التصنيفات المحفوظة</legend>
        <label htmlFor="work-category-search" className={styles["label"]}>
          ابحث عن تصنيف مفعّل
        </label>
        <input
          id="work-category-search"
          className={styles["input"]}
          value={search}
          maxLength={100}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPage(1);
          }}
        />
        {picker.isPending ? (
          <p role="status">جارٍ تحميل التصنيفات المفعّلة…</p>
        ) : null}
        {picker.isError ? (
          <div role="alert">
            <p>{adminContentErrorMessage(picker.error)}</p>
            <button
              type="button"
              onClick={() => {
                void picker.refetch();
              }}
            >
              إعادة محاولة تحميل التصنيفات
            </button>
          </div>
        ) : null}
        {picker.denied ? (
          <p role="alert">
            انتهت صلاحية الوصول إلى التصنيفات. سجّل الدخول مجددًا.
          </p>
        ) : null}
        {!picker.available ? (
          <p role="status">يلزم حساب مدير نشط وموثق لاختيار التصنيفات.</p>
        ) : null}
        {pickerCategories.length === 0 &&
        !picker.isPending &&
        !picker.isError ? (
          <p className={styles["hint"]}>لا توجد تصنيفات محفوظة للاختيار.</p>
        ) : null}
        <div className={styles["genresWrapper"]}>
          {pickerCategories.map((category) => {
            const checked = selected.has(category.id);
            const label = category.enabled
              ? category.displayName
              : `${category.displayName} (معطل)`;
            return (
              <label key={category.id} className={styles["genreChip"]}>
                <input
                  type="checkbox"
                  aria-label={label}
                  checked={checked}
                  disabled={!checked && values.categoryIds.length >= 100}
                  onChange={(event) => {
                    toggleCategory(category.id, event.currentTarget.checked);
                  }}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
        {picker.data !== undefined && picker.data.pagination.totalPages > 1 ? (
          <div className={styles["actionButtonsGroup"]}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              التصنيفات السابقة
            </button>
            <span role="status">
              صفحة {page} من {picker.data.pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={!picker.data.pagination.hasNextPage}
              onClick={() => {
                setPage(page + 1);
              }}
            >
              التصنيفات التالية
            </button>
          </div>
        ) : null}
        {errors.categoryIds?.message ? (
          <p className={styles["errorMessage"]} role="alert">
            {errors.categoryIds.message}
          </p>
        ) : null}
        {pickerCategories.some(
          (category) => !category.enabled && selected.has(category.id),
        ) ? (
          <p className={styles["hint"]}>
            التصنيفات المعطلة المرتبطة مسبقًا محفوظة؛ يمكن إزالتها ولا يمكن
            إسنادها من جديد.
          </p>
        ) : null}
      </fieldset>

      <div className={styles["field"]}>
        <label htmlFor="work-tags" className={styles["label"]}>
          الوسوم (افصل بينها بفاصلة)
        </label>
        <input
          id="work-tags"
          className={cn(
            styles["input"],
            errors.tagsText && styles["inputError"],
          )}
          {...register("tagsText")}
          aria-invalid={errors.tagsText ? true : undefined}
          aria-describedby={errors.tagsText ? "work-tags-error" : undefined}
        />
        {errors.tagsText?.message ? (
          <p
            id="work-tags-error"
            className={styles["errorMessage"]}
            role="alert"
          >
            {errors.tagsText.message}
          </p>
        ) : null}
      </div>

      <fieldset className={styles["field"]}>
        <legend className={styles["label"]}>تفضيل العرض المميز</legend>
        <label>
          <input type="checkbox" {...register("featuredHome")} />
          إضافة إلى العرض المميز (تفضيل غير منشور)
        </label>
        {values.featuredHome ? (
          <label htmlFor="work-featured-order" className={styles["label"]}>
            موضع العرض المميز
            <input
              id="work-featured-order"
              inputMode="numeric"
              className={cn(
                styles["input"],
                errors.featuredOrderText && styles["inputError"],
              )}
              {...register("featuredOrderText")}
              aria-invalid={errors.featuredOrderText ? true : undefined}
            />
          </label>
        ) : null}
        {errors.featuredOrderText?.message ? (
          <p className={styles["errorMessage"]} role="alert">
            {errors.featuredOrderText.message}
          </p>
        ) : null}
      </fieldset>
    </section>
  );
}

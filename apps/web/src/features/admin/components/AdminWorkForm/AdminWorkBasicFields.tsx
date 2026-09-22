import type { RefObject } from "react";
import { Check, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AVAILABLE_GENRES,
  type AdminPublishStatus,
  type AdminStoryStatus,
  type AdminWorkType,
} from "../../types/admin.types";
import type { FormErrors, FormValues, WorkFieldChange } from "./form.types";
import styles from "./AdminWorkForm.module.css";

type Props = Readonly<{
  values: FormValues;
  errors: FormErrors;
  isEdit: boolean;
  titleRef: RefObject<HTMLInputElement | null>;
  descRef: RefObject<HTMLTextAreaElement | null>;
  authorRef: RefObject<HTMLInputElement | null>;
  onChange: WorkFieldChange;
  onToggleGenre: (genre: string) => void;
}>;

export function AdminWorkBasicFields({
  values,
  errors,
  isEdit,
  titleRef,
  descRef,
  authorRef,
  onChange,
  onToggleGenre,
}: Props) {
  return (
    <>
      {/* Section 1: Basic Info */}
      <section className={styles["formCard"]}>
        <div className={styles["sectionHeader"]}>
          <h2 className={styles["sectionTitle"]}>
            <Info className={styles["sectionIcon"]} aria-hidden="true" />
            <span>المعلومات الأساسية</span>
          </h2>
        </div>

        <div className={styles["fieldsGrid2"]}>
          {/* Arabic Title */}
          <div className={styles["field"]}>
            <label htmlFor="work-title" className={styles["label"]}>
              <span>عنوان العمل بالعربية</span>
              <span className={styles["requiredMark"]}>*</span>
            </label>
            <input
              ref={titleRef}
              id="work-title"
              type="text"
              className={cn(
                styles["input"],
                errors.title && styles["inputError"],
              )}
              placeholder="مثال: سمة المكتنز"
              value={values.title}
              onChange={(e) => {
                onChange("title", e.target.value);
              }}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title ? (
              <p
                id="title-error"
                className={styles["errorMessage"]}
                role="alert"
              >
                {errors.title}
              </p>
            ) : null}
          </div>

          {/* Alternative Title */}
          <div className={styles["field"]}>
            <label htmlFor="work-alt-title" className={styles["label"]}>
              <span>العنوان البديل أو الإنجليزي</span>
            </label>
            <input
              id="work-alt-title"
              type="text"
              className={styles["input"]}
              placeholder="مثال: Trait Hoarder"
              value={values.alternativeTitle}
              onChange={(e) => {
                onChange("alternativeTitle", e.target.value);
              }}
            />
          </div>
        </div>

        <div className={styles["fieldsGrid3"]}>
          {/* Work Type */}
          <div className={styles["field"]}>
            <label htmlFor="work-type" className={styles["label"]}>
              <span>نوع العمل</span>
              <span className={styles["requiredMark"]}>*</span>
            </label>
            <select
              id="work-type"
              className={styles["select"]}
              value={values.type}
              onChange={(e) => {
                onChange("type", e.target.value as AdminWorkType);
              }}
            >
              <option value="manga">مانغا (Manga)</option>
              <option value="manhwa">مانهوا (Manhwa)</option>
              <option value="manhua">مانهوا صينية (Manhua)</option>
              <option value="comics">كوميكس (Comics)</option>
              <option value="novel">رواية (Novel)</option>
              <option value="text-story">قصة نصية (Text Story)</option>
            </select>
          </div>

          {/* Story Status */}
          <div className={styles["field"]}>
            <label htmlFor="work-story-status" className={styles["label"]}>
              <span>حالة القصة</span>
              <span className={styles["requiredMark"]}>*</span>
            </label>
            <select
              id="work-story-status"
              className={styles["select"]}
              value={values.storyStatus}
              onChange={(e) => {
                onChange("storyStatus", e.target.value as AdminStoryStatus);
              }}
            >
              <option value="ongoing">مستمرة</option>
              <option value="completed">مكتملة</option>
              <option value="hiatus">متوقفة مؤقتًا</option>
              <option value="cancelled">ملغاة</option>
            </select>
          </div>

          {/* Publication Status */}
          <div className={styles["field"]}>
            <label htmlFor="work-publish-status" className={styles["label"]}>
              <span>حالة النشر</span>
            </label>
            <select
              id="work-publish-status"
              className={styles["select"]}
              value={values.publishStatus}
              onChange={(e) => {
                onChange("publishStatus", e.target.value as AdminPublishStatus);
              }}
            >
              <option value="draft">مسودة (Draft)</option>
              <option value="published">منشور (Published)</option>
              {isEdit ? (
                <option value="archived">مؤرشف (Archived)</option>
              ) : null}
            </select>
          </div>
        </div>

        <div className={styles["fieldsGrid2"]}>
          {/* Author */}
          <div className={styles["field"]}>
            <label htmlFor="work-author" className={styles["label"]}>
              <span>المؤلف</span>
              <span className={styles["requiredMark"]}>*</span>
            </label>
            <input
              ref={authorRef}
              id="work-author"
              type="text"
              className={cn(
                styles["input"],
                errors.author && styles["inputError"],
              )}
              placeholder="اسم المؤلف أو الكاتب"
              value={values.author}
              onChange={(e) => {
                onChange("author", e.target.value);
              }}
              aria-invalid={errors.author ? true : undefined}
              aria-describedby={errors.author ? "author-error" : undefined}
            />
            {errors.author ? (
              <p
                id="author-error"
                className={styles["errorMessage"]}
                role="alert"
              >
                {errors.author}
              </p>
            ) : null}
          </div>

          {/* Artist */}
          <div className={styles["field"]}>
            <label htmlFor="work-artist" className={styles["label"]}>
              <span>الرسام (إن وجد)</span>
            </label>
            <input
              id="work-artist"
              type="text"
              className={styles["input"]}
              placeholder="اسم الرسام أو استوديو الرسم"
              value={values.artist}
              onChange={(e) => {
                onChange("artist", e.target.value);
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className={styles["field"]}>
          <label htmlFor="work-desc" className={styles["label"]}>
            <span>نبذة / قصة العمل</span>
            <span className={styles["requiredMark"]}>*</span>
          </label>
          <textarea
            ref={descRef}
            id="work-desc"
            className={cn(
              styles["textarea"],
              errors.description && styles["inputError"],
            )}
            placeholder="اكتب نبذة مشوقة ومختصرة عن حبكة العمل والشخصيات الرئيسية..."
            value={values.description}
            onChange={(e) => {
              onChange("description", e.target.value);
            }}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? "desc-error" : undefined}
          />
          {errors.description ? (
            <p id="desc-error" className={styles["errorMessage"]} role="alert">
              {errors.description}
            </p>
          ) : (
            <p className={styles["hint"]}>
              {values.description.length.toLocaleString("ar-EG")} حرفًا (الموصى
              به 50 حرفًا على الأقل).
            </p>
          )}
        </div>

        {/* Genres Multi-select */}
        <div className={styles["field"]}>
          <span className={styles["label"]}>
            <span>التصنيفات والأنواع</span>
            <span className={styles["requiredMark"]}>*</span>
          </span>
          <div className={styles["genresWrapper"]}>
            {AVAILABLE_GENRES.map((genre) => {
              const isSelected = values.genres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => {
                    onToggleGenre(genre);
                  }}
                  className={cn(
                    styles["genreChip"],
                    isSelected && styles["genreChipSelected"],
                  )}
                  aria-pressed={isSelected}
                >
                  {isSelected ? (
                    <Check size={13} aria-hidden="true" />
                  ) : (
                    <Sparkles size={13} aria-hidden="true" />
                  )}
                  <span>{genre}</span>
                </button>
              );
            })}
          </div>
          {errors.genres ? (
            <p className={styles["errorMessage"]} role="alert">
              {errors.genres}
            </p>
          ) : null}
        </div>

        {/* Tags */}
        <div className={styles["field"]}>
          <label htmlFor="work-tags" className={styles["label"]}>
            <span>الوسوم الإضافية (مفصولة بفواصل)</span>
          </label>
          <input
            id="work-tags"
            type="text"
            className={styles["input"]}
            placeholder="مثال: نظام، تطور سريع، ذكاء، قتال سيوف"
            value={values.tags}
            onChange={(e) => {
              onChange("tags", e.target.value);
            }}
          />
        </div>
      </section>
    </>
  );
}

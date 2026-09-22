import Image from "next/image";
import { ImageIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormValues, WorkFieldChange } from "./form.types";
import styles from "./AdminWorkForm.module.css";

type Props = Readonly<{
  values: FormValues;
  onChange: WorkFieldChange;
  onCycleCover: () => void;
  onCycleBanner: () => void;
}>;

export function AdminWorkMediaFields({
  values,
  onChange,
  onCycleCover,
  onCycleBanner,
}: Props) {
  return (
    <>
      {/* Section 2: Media */}
      <section className={styles["formCard"]}>
        <div className={styles["sectionHeader"]}>
          <h2 className={styles["sectionTitle"]}>
            <ImageIcon className={styles["sectionIcon"]} aria-hidden="true" />
            <span>الوسائط والأغلفة</span>
          </h2>
        </div>

        <div className={styles["mediaRow"]}>
          {/* Cover Picker */}
          <div className={styles["mediaCard"]}>
            <span className={styles["label"]}>صورة الغلاف (3:4)</span>
            <div className={styles["coverPreviewBox"]}>
              {values.coverImage ? (
                <Image
                  src={values.coverImage}
                  alt="معاينة الغلاف"
                  width={140}
                  height={190}
                  className={styles["coverImage"]}
                  unoptimized
                />
              ) : (
                <ImageIcon size={32} color="var(--muted-foreground)" />
              )}
            </div>
            <div className={styles["mediaControls"]}>
              <button
                type="button"
                onClick={onCycleCover}
                className={styles["mediaBtn"]}
              >
                تبديل الغلاف
              </button>
              {values.coverImage ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange("coverImage", "");
                  }}
                  className={cn(styles["mediaBtn"], styles["removeBtn"])}
                  aria-label="حذف الغلاف"
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <p className={styles["hint"]}>
              الصيغ المقبولة: JPG, PNG, WebP بنسبة 3:4.
            </p>
          </div>

          {/* Banner Picker */}
          <div className={styles["mediaCard"]}>
            <span className={styles["label"]}>صورة البانر العريض (16:9)</span>
            <div className={styles["bannerPreviewBox"]}>
              {values.bannerImage ? (
                <Image
                  src={values.bannerImage}
                  alt="معاينة البانر"
                  width={280}
                  height={140}
                  className={styles["coverImage"]}
                  unoptimized
                />
              ) : (
                <ImageIcon size={32} color="var(--muted-foreground)" />
              )}
            </div>
            <div className={styles["mediaControls"]}>
              <button
                type="button"
                onClick={onCycleBanner}
                className={styles["mediaBtn"]}
              >
                تبديل البانر
              </button>
              {values.bannerImage ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange("bannerImage", "");
                  }}
                  className={cn(styles["mediaBtn"], styles["removeBtn"])}
                  aria-label="حذف البانر"
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <p className={styles["hint"]}>
              صورة بانر خلفية اختيارية تعرض في صفحة تفاصيل العمل.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { AdminMediaCandidatePicker } from "@/features/media/components/AdminMediaCandidatePicker";
import type { FormValues } from "./form.types";
import styles from "./AdminWorkForm.module.css";

type Props = Readonly<{
  values: FormValues;
}>;

export function AdminWorkMediaFields({ values }: Props) {
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
            <AdminMediaCandidatePicker
              mediaClass="work_cover"
              label="رفع غلاف جديد"
            />
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
            <AdminMediaCandidatePicker
              mediaClass="work_background"
              label="رفع خلفية جديدة"
            />
            <p className={styles["hint"]}>
              صورة بانر خلفية اختيارية تعرض في صفحة تفاصيل العمل.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import { Globe } from "lucide-react";
import type { FormValues } from "./form.types";
import styles from "./AdminWorkForm.module.css";

type Props = Readonly<{ values: FormValues; slug: string }>;

export function AdminWorkSeoPreview({ values, slug }: Props) {
  return (
    <>
      {/* Section 3: SEO Preview */}
      <section className={styles["formCard"]}>
        <div className={styles["sectionHeader"]}>
          <h2 className={styles["sectionTitle"]}>
            <Globe className={styles["sectionIcon"]} aria-hidden="true" />
            <span>معاينة محرك البحث وشبكات التواصل (SEO Preview)</span>
          </h2>
        </div>

        <div className={styles["seoPreviewCard"]}>
          <span className={styles["seoUrl"]}>
            https://fury.local › story › {slug}
          </span>
          <h3 className={styles["seoTitle"]}>
            {values.title
              ? `${values.title} | منصة Fury`
              : "عنوان العمل | منصة Fury"}
          </h3>
          <p className={styles["seoDescription"]}>
            {values.description
              ? values.description.slice(0, 160) +
                (values.description.length > 160 ? "..." : "")
              : "وصف العمل وموجز القصة كما سيظهر في نتائج محركات البحث مثل Google وشبكات التواصل..."}
          </p>
        </div>
      </section>
    </>
  );
}

import { Globe } from "lucide-react";

import type { FormValues } from "../../model/admin-work-form";
import styles from "./AdminWorkForm.module.css";

type Props = Readonly<{
  values: FormValues;
  persistedSlug: string | null;
}>;

export function AdminWorkSeoPreview({ values, persistedSlug }: Props) {
  return (
    <section className={styles["formCard"]}>
      <div className={styles["sectionHeader"]}>
        <h2 className={styles["sectionTitle"]}>
          <Globe className={styles["sectionIcon"]} aria-hidden="true" />
          معاينة البيانات المحفوظة
        </h2>
      </div>
      <div className={styles["seoPreviewCard"]}>
        {persistedSlug === null ? (
          <p className={styles["hint"]} role="status">
            لا يوجد رابط محفوظ بعد؛ سيظهر بعد حفظ المسودة. لا تُشتق الهوية من
            العنوان.
          </p>
        ) : (
          <span className={styles["seoUrl"]} dir="ltr">
            {persistedSlug}
          </span>
        )}
        <h3 className={styles["seoTitle"]}>{values.title || "عنوان العمل"}</h3>
        <p className={styles["seoDescription"]}>
          {values.synopsis || "لا توجد نبذة محفوظة في هذه المسودة."}
        </p>
      </div>
    </section>
  );
}

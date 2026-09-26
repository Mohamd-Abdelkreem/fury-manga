import { Globe } from "lucide-react";

import type { AdminWork } from "@fury/contracts";

import type { FormValues } from "../../model/admin-work-form";
import styles from "./AdminWorkForm.module.css";

type Props = Readonly<{
  values: FormValues;
  savedWork: AdminWork | null;
  dirty: boolean;
}>;

export function AdminWorkSeoPreview({ values, savedWork, dirty }: Props) {
  return (
    <section
      className={styles["formCard"]}
      aria-label="معاينة البيانات المحفوظة"
    >
      <div className={styles["sectionHeader"]}>
        <h2 className={styles["sectionTitle"]}>
          <Globe className={styles["sectionIcon"]} aria-hidden="true" />
          معاينة البيانات المحفوظة
        </h2>
      </div>
      <div className={styles["seoPreviewCard"]}>
        {savedWork === null ? (
          <p className={styles["hint"]} role="status">
            لا يوجد رابط محفوظ بعد؛ سيظهر بعد حفظ المسودة. لا تُشتق الهوية من
            العنوان. هذه معاينة غير محفوظة ولا توجد صفحة عامة بعد.
          </p>
        ) : (
          <span className={styles["seoUrl"]} dir="ltr">
            {savedWork.slug}
          </span>
        )}
        {dirty && savedWork !== null ? (
          <p className={styles["hint"]}>
            تغييرات غير محفوظة؛ المعاينة تعرض نسخة الخادم.
          </p>
        ) : null}
        <h3 className={styles["seoTitle"]}>
          {savedWork === null ? values.title || "عنوان العمل" : savedWork.title}
        </h3>
        <p className={styles["seoDescription"]}>
          {(savedWork === null ? values.synopsis : savedWork.synopsis) ||
            "لا توجد نبذة محفوظة في هذه المسودة."}
        </p>
      </div>
    </section>
  );
}

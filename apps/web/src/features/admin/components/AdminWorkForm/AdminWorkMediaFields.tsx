import { ImageIcon } from "lucide-react";
import { AdminMediaCandidatePicker } from "@/features/media/components/AdminMediaCandidatePicker";
import type { MediaDraftSelection } from "../../model/admin-work-editor";
import type { FormValues } from "../../model/admin-work-form";
import styles from "./AdminWorkForm.module.css";

type Props = Readonly<{
  values: FormValues;
  coverSelection: MediaDraftSelection;
  backgroundSelection: MediaDraftSelection;
  onCoverSelected: (assetId: string | null) => void;
  onBackgroundSelected: (assetId: string | null) => void;
  onClearCover: () => void;
  onClearBackground: () => void;
  onKeepCover: () => void;
  onKeepBackground: () => void;
}>;

export function AdminWorkMediaFields({
  values,
  coverSelection,
  backgroundSelection,
  onCoverSelected,
  onBackgroundSelected,
  onClearCover,
  onClearBackground,
  onKeepCover,
  onKeepBackground,
}: Props) {
  return (
    <section className={styles["formCard"]}>
      <div className={styles["sectionHeader"]}>
        <h2 className={styles["sectionTitle"]}>
          <ImageIcon className={styles["sectionIcon"]} aria-hidden="true" />
          الوسائط الخاصة بالمسودة
        </h2>
      </div>

      <div className={styles["mediaRow"]}>
        <div className={styles["mediaCard"]}>
          <span className={styles["label"]}>غلاف العمل (3:4)</span>
          <AdminMediaCandidatePicker
            key={`cover-${values.coverAssetId ?? "none"}`}
            mediaClass="work_cover"
            label="رفع غلاف جديد"
            initialAssetId={values.coverAssetId}
            onAssetSelected={onCoverSelected}
          />
          {coverSelection.candidateAssetId !== null ? (
            <p className={styles["hint"]} role="status">
              سيُربط الوسيط المختار بالمسودة عند الحفظ.
            </p>
          ) : values.coverAssetId !== null && coverSelection.clearAttached ? (
            <p className={styles["hint"]} role="status">
              سيُزال الغلاف المرتبط عند حفظ المسودة.
            </p>
          ) : values.coverAssetId !== null ? (
            <p className={styles["hint"]}>
              الغلاف مرتبط بالعمل المحفوظ؛ لم يتغير الربط بعد.
            </p>
          ) : (
            <p className={styles["hint"]}>لم يُربط غلاف بالمسودة بعد.</p>
          )}
          {values.coverAssetId !== null && coverSelection.clearAttached ? (
            <button
              type="button"
              className={styles["mediaBtn"]}
              onClick={onKeepCover}
            >
              إبقاء الغلاف الحالي
            </button>
          ) : values.coverAssetId !== null ||
            coverSelection.candidateAssetId !== null ? (
            <button
              type="button"
              className={styles["mediaBtn"]}
              onClick={onClearCover}
            >
              إزالة الغلاف عند الحفظ
            </button>
          ) : null}
        </div>

        <div className={styles["mediaCard"]}>
          <span className={styles["label"]}>خلفية العمل (16:9)</span>
          <AdminMediaCandidatePicker
            key={`background-${values.backgroundAssetId ?? "none"}`}
            mediaClass="work_background"
            label="رفع خلفية جديدة"
            initialAssetId={values.backgroundAssetId}
            onAssetSelected={onBackgroundSelected}
          />
          {backgroundSelection.candidateAssetId !== null ? (
            <p className={styles["hint"]} role="status">
              ستُربط الخلفية المختارة بالمسودة عند الحفظ.
            </p>
          ) : values.backgroundAssetId !== null &&
            backgroundSelection.clearAttached ? (
            <p className={styles["hint"]} role="status">
              ستُزال الخلفية المرتبطة عند حفظ المسودة.
            </p>
          ) : values.backgroundAssetId !== null ? (
            <p className={styles["hint"]}>
              الخلفية مرتبطة بالعمل المحفوظ؛ لم يتغير الربط بعد.
            </p>
          ) : (
            <p className={styles["hint"]}>لا توجد خلفية مرتبطة بالمسودة.</p>
          )}
          {values.backgroundAssetId !== null &&
          backgroundSelection.clearAttached ? (
            <button
              type="button"
              className={styles["mediaBtn"]}
              onClick={onKeepBackground}
            >
              إبقاء الخلفية الحالية
            </button>
          ) : values.backgroundAssetId !== null ||
            backgroundSelection.candidateAssetId !== null ? (
            <button
              type="button"
              className={styles["mediaBtn"]}
              onClick={onClearBackground}
            >
              إزالة الخلفية عند الحفظ
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

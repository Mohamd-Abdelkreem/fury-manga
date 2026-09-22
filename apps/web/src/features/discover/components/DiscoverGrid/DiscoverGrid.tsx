import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import { MangaCard } from "@/components/ui/MangaCard/MangaCard";

import type { DiscoverWork } from "../../data/discoverData";
import styles from "./DiscoverGrid.module.css";

export function DiscoverGrid({
  works,
}: Readonly<{ works: readonly DiscoverWork[] }>) {
  if (works.length === 0) {
    return (
      <FeatureState
        kind="filtered-empty"
        title="لا توجد أعمال مطابقة"
        message="جرّب تعديل عبارة البحث أو إزالة أحد المرشحات."
        actionHref="/discover"
        actionLabel="مسح المرشحات"
      />
    );
  }

  return (
    <section className={styles["container"]} aria-label="نتائج اكتشاف الأعمال">
      <div className={styles["grid"]}>
        {works.map((work) => (
          <MangaCard key={work.id} {...work} stretch />
        ))}
      </div>
    </section>
  );
}

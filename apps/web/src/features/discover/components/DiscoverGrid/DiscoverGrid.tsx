import type { CatalogWork } from "@fury/contracts";
import { MangaCard } from "@/components/ui/MangaCard/MangaCard";
import styles from "./DiscoverGrid.module.css";

export function DiscoverGrid({
  works,
}: Readonly<{ works: readonly CatalogWork[] }>) {
  return (
    <section className={styles["container"]} aria-label="نتائج اكتشاف الأعمال">
      <div className={styles["grid"]}>
        {works.map((work) => (
          <MangaCard key={work.slug} work={work} stretch />
        ))}
      </div>
    </section>
  );
}

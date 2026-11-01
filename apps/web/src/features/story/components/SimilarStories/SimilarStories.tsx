import { MangaCard } from "@/components/ui/MangaCard/MangaCard";
import type { CatalogWork } from "@fury/contracts";
import styles from "./SimilarStories.module.css";

export function SimilarStories({
  similarWorks,
}: Readonly<{ similarWorks: readonly CatalogWork[] }>) {
  if (similarWorks.length === 0) return null;
  return (
    <section className={styles["section"]}>
      <div className={styles["header"]}>
        <div className={styles["accentBar"]} />
        <h2 className={styles["title"]}>أعمال مشابهة</h2>
      </div>
      <div className={styles["grid"]}>
        {similarWorks.slice(0, 4).map((work) => (
          <MangaCard key={work.slug} work={work} stretch size="sm" />
        ))}
      </div>
    </section>
  );
}

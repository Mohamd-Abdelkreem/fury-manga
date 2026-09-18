import { BookOpen } from "lucide-react";
import styles from "./DiscoverHero.module.css";

type DiscoverHeroProps = Readonly<{
  title?: string;
}>;

export function DiscoverHero({ title = "قائمة المانجا" }: DiscoverHeroProps) {
  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <div className={styles["accentBar"]} />
        <BookOpen className={styles["icon"]} />
        <h1 className={styles["title"]}>{title}</h1>
      </div>
    </div>
  );
}

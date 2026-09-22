import { BookOpenText, Compass, LibraryBig } from "lucide-react";
import Link from "next/link";

import type { LibraryWork } from "../../data/libraryData";
import styles from "./LibraryScreen.module.css";

export function LibraryHeader({
  works,
}: Readonly<{ works: readonly LibraryWork[] }>) {
  const illustratedCount = works.filter(
    (work) => work.contentType === "illustrated",
  ).length;
  const textCount = works.length - illustratedCount;
  const inProgressCount = works.filter(
    (work) => work.continueHref !== undefined && work.status !== "archived",
  ).length;

  return (
    <section className={styles["hero"]} aria-labelledby="library-title">
      <div className={styles["heroCopy"]}>
        <span className={styles["eyebrow"]}>
          <LibraryBig aria-hidden="true" />
          مساحتك القرائية
        </span>
        <h1 id="library-title">المكتبة والمحفوظات</h1>
        <p>
          جميع أعمالك المصوّرة والروايات المحفوظة في مكان واحد، مرتبة ومحدثة مع
          إمكانية استئناف القراءة فورًا مع الحفاظ على تقدمك.
        </p>
        <div className={styles["discoverLinks"]}>
          <Link href="/discover">
            <Compass aria-hidden="true" />
            استكشف المانجا
          </Link>
          <Link href="/stories">
            <BookOpenText aria-hidden="true" />
            استكشف الروايات
          </Link>
        </div>
      </div>
      <div className={styles["stats"]} aria-label="ملخص المكتبة">
        <div>
          <strong>{works.length}</strong>
          <span>إجمالي المحفوظات</span>
        </div>
        <div>
          <strong>{illustratedCount}</strong>
          <span>أعمال مصوّرة</span>
        </div>
        <div>
          <strong>{textCount}</strong>
          <span>أعمال نصية</span>
        </div>
        <div>
          <strong>{inProgressCount}</strong>
          <span>قيد المتابعة</span>
        </div>
      </div>
    </section>
  );
}

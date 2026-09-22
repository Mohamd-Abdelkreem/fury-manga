import {
  ArrowUpLeft,
  BookOpen,
  BookOpenText,
  BookmarkMinus,
  Clock,
  ImageIcon,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { LibraryWork } from "../../data/libraryData";
import type { ViewMode } from "./library.types";
import styles from "./LibraryScreen.module.css";

const STATUS_LABELS: Record<LibraryWork["status"], string> = {
  ongoing: "مستمر",
  completed: "مكتمل",
  archived: "غير متاح حاليًا",
};

type LibraryCardProps = Readonly<{
  work: LibraryWork;
  viewMode: ViewMode;
  onRemove: (work: LibraryWork) => void;
}>;

export function LibraryCard({ work, viewMode, onRemove }: LibraryCardProps) {
  const archived = work.status === "archived";
  const TypeIcon =
    work.contentType === "illustrated" ? ImageIcon : BookOpenText;
  const typeLabel =
    work.contentType === "illustrated" ? "عمل مصوّر" : "عمل نصي";

  return (
    <article
      className={cn(styles["card"], viewMode === "list" && styles["cardList"])}
    >
      <Link
        href={work.detailsHref as Route}
        className={styles["cover"]}
        aria-label={`فتح تفاصيل ${work.title}`}
      >
        <Image
          src={work.cover}
          alt=""
          fill
          sizes="(max-width: 639px) 96px, (max-width: 1099px) 128px, 148px"
        />
        <span className={styles["typeBadge"]}>
          <TypeIcon aria-hidden="true" />
          {typeLabel}
        </span>
      </Link>
      <div className={styles["cardBody"]}>
        <div className={styles["cardHeading"]}>
          <div className={styles["cardMetaRow"]}>
            <span className={styles["status"]} data-status={work.status}>
              {STATUS_LABELS[work.status]}
            </span>
            {work.continueHref !== undefined && !archived && (
              <span className={styles["progressTag"]}>
                <Clock aria-hidden="true" />
                قيد القراءة
              </span>
            )}
          </div>
          <h3>
            <Link href={work.detailsHref as Route}>{work.title}</Link>
          </h3>
          <p className={styles["chapterInfo"]}>
            <BookOpen aria-hidden="true" />
            {work.latestChapter}
          </p>
        </div>

        <div className={styles["actions"]}>
          {work.continueHref === undefined || archived ? (
            <button type="button" disabled className={styles["primaryAction"]}>
              <BookOpen aria-hidden="true" />
              {archived ? "القراءة غير متاحة" : "لا يوجد تقدم محفوظ"}
            </button>
          ) : (
            <Link
              className={styles["primaryAction"]}
              href={work.continueHref as Route}
            >
              <BookOpen aria-hidden="true" />
              متابعة القراءة
            </Link>
          )}
          <Link
            className={styles["secondaryAction"]}
            href={work.detailsHref as Route}
          >
            <ArrowUpLeft aria-hidden="true" />
            التفاصيل
          </Link>
          <button
            type="button"
            className={styles["removeAction"]}
            aria-label={`إزالة ${work.title} من المكتبة`}
            onClick={() => {
              onRemove(work);
            }}
          >
            <BookmarkMinus aria-hidden="true" />
            إزالة
          </button>
        </div>
      </div>
    </article>
  );
}

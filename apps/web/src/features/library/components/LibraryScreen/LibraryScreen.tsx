"use client";

import {
  ArrowUpLeft,
  BookOpen,
  BookOpenText,
  BookmarkMinus,
  Compass,
  ImageIcon,
  LibraryBig,
  Search,
  Undo2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import { LIBRARY_WORKS, type LibraryWork } from "../../data/libraryData";
import styles from "./LibraryScreen.module.css";

type LibraryFilter = "all" | LibraryWork["contentType"];

type LibraryScreenProps = Readonly<{
  initialWorks?: readonly LibraryWork[];
  viewState?: "loading" | "populated" | "error";
}>;

type RemovedWork = Readonly<{
  work: LibraryWork;
  index: number;
}>;

const STATUS_LABELS: Record<LibraryWork["status"], string> = {
  ongoing: "مستمر",
  completed: "مكتمل",
  archived: "غير متاح حاليًا",
};

type FilterOption = Readonly<{
  value: LibraryFilter;
  label: string;
  icon?: LucideIcon;
}>;

const FILTER_OPTIONS: readonly FilterOption[] = [
  { value: "all", label: "الكل" },
  { value: "illustrated", label: "مصوّر", icon: ImageIcon },
  { value: "text", label: "نصي", icon: BookOpenText },
] as const;

function LibraryHeader({ works }: Readonly<{ works: readonly LibraryWork[] }>) {
  const illustratedCount = works.filter(
    (work) => work.contentType === "illustrated",
  ).length;
  const textCount = works.length - illustratedCount;

  return (
    <section className={styles["hero"]} aria-labelledby="library-title">
      <div className={styles["heroCopy"]}>
        <span className={styles["eyebrow"]}>
          <LibraryBig aria-hidden="true" />
          مساحتك الشخصية
        </span>
        <h1 id="library-title">المكتبة والمحفوظات</h1>
        <p>
          كل ما حفظته من أعمال مصوّرة وروايات نصية، مرتب وجاهز لتكمل القراءة من
          حيث توقفت.
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
      </div>
    </section>
  );
}

type LibraryToolbarProps = Readonly<{
  filter: LibraryFilter;
  query: string;
  resultCount: number;
  onFilterChange: (filter: LibraryFilter) => void;
  onQueryChange: (query: string) => void;
}>;

function LibraryToolbar({
  filter,
  query,
  resultCount,
  onFilterChange,
  onQueryChange,
}: LibraryToolbarProps) {
  return (
    <section
      className={styles["toolbar"]}
      aria-labelledby="library-content-title"
    >
      <div className={styles["toolbarHeading"]}>
        <div>
          <span className={styles["sectionMark"]} aria-hidden="true" />
          <h2 id="library-content-title">محتوى مكتبتك</h2>
        </div>
        <p role="status">{resultCount} أعمال ظاهرة</p>
      </div>
      <div className={styles["toolbarControls"]}>
        <label className={styles["searchField"]}>
          <span>ابحث داخل المكتبة</span>
          <span className={styles["searchWrap"]}>
            <Search aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                onQueryChange(event.target.value);
              }}
              placeholder="اكتب عنوان العمل"
            />
          </span>
        </label>
        <div
          className={styles["filters"]}
          role="group"
          aria-label="نوع المحتوى"
        >
          {FILTER_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={filter === option.value}
                onClick={() => {
                  onFilterChange(option.value);
                }}
              >
                {Icon === undefined ? null : <Icon aria-hidden="true" />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type LibraryCardProps = Readonly<{
  work: LibraryWork;
  onRemove: (work: LibraryWork) => void;
}>;

function LibraryCard({ work, onRemove }: LibraryCardProps) {
  const archived = work.status === "archived";
  const TypeIcon =
    work.contentType === "illustrated" ? ImageIcon : BookOpenText;
  const typeLabel =
    work.contentType === "illustrated" ? "عمل مصوّر" : "عمل نصي";

  return (
    <article className={styles["card"]}>
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
          <span className={styles["status"]} data-status={work.status}>
            {STATUS_LABELS[work.status]}
          </span>
          <h3>
            <Link href={work.detailsHref as Route}>{work.title}</Link>
          </h3>
          <p>{work.latestChapter}</p>
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

export function LibraryScreen({
  initialWorks = LIBRARY_WORKS,
  viewState = "populated",
}: LibraryScreenProps) {
  const [renderState, setRenderState] = useState(viewState);
  const [works, setWorks] = useState<readonly LibraryWork[]>(initialWorks);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [removed, setRemoved] = useState<RemovedWork | null>(null);

  const normalizedQuery = query.trim().toLocaleLowerCase("ar");
  const filteredWorks = works.filter(
    (work) =>
      (filter === "all" || work.contentType === filter) &&
      (normalizedQuery.length === 0 ||
        work.title.toLocaleLowerCase("ar").includes(normalizedQuery)),
  );

  const removeWork = (work: LibraryWork): void => {
    const index = works.findIndex((candidate) => candidate.id === work.id);
    if (index < 0) return;
    setRemoved({ work, index });
    setWorks((current) =>
      current.filter((candidate) => candidate.id !== work.id),
    );
  };

  const restoreRemovedWork = (): void => {
    if (removed === null) return;
    setWorks((current) => {
      const restored = [...current];
      restored.splice(
        Math.min(removed.index, restored.length),
        0,
        removed.work,
      );
      return restored;
    });
    setRemoved(null);
  };

  if (renderState === "loading") {
    return (
      <main className="workspace-main">
        <FeatureState
          kind="loading"
          title="جارٍ تحميل مكتبتك"
          message="نرتب الأعمال المحفوظة في قائمة واحدة."
        />
      </main>
    );
  }

  if (renderState === "error") {
    return (
      <main className="workspace-main">
        <FeatureState
          kind="error"
          title="تعذّر عرض المكتبة"
          message="لم يكتمل تحميل مكتبتك. يمكنك إعادة المحاولة."
          onRetry={() => {
            setRenderState("populated");
          }}
          actionLabel="إعادة المحاولة"
        />
      </main>
    );
  }

  return (
    <main
      className={`workspace-main ${styles["main"] ?? ""}`}
      id="main-content"
    >
      <LibraryHeader works={works} />
      <LibraryToolbar
        filter={filter}
        query={query}
        resultCount={filteredWorks.length}
        onFilterChange={setFilter}
        onQueryChange={setQuery}
      />
      {removed === null ? null : (
        <div className={styles["undo"]} role="status" aria-live="polite">
          <span>أُزيل «{removed.work.title}» من هذه الجلسة.</span>
          <button type="button" onClick={restoreRemovedWork}>
            <Undo2 aria-hidden="true" />
            تراجع
          </button>
        </div>
      )}
      {works.length === 0 ? (
        <FeatureState
          kind="empty"
          title="مكتبتك فارغة"
          message="استكشف الأعمال ثم استخدم زر الحفظ لتعود إليها من هنا."
          actionHref="/discover"
          actionLabel="استكشاف المحتوى"
        />
      ) : filteredWorks.length === 0 ? (
        <FeatureState
          kind="filtered-empty"
          title="لا توجد أعمال مطابقة"
          message="غيّر نوع المحتوى أو ابحث بعنوان آخر؛ محفوظاتك لم تُحذف."
          onRetry={() => {
            setQuery("");
            setFilter("all");
          }}
          actionLabel="مسح البحث والفلاتر"
        />
      ) : (
        <section className={styles["grid"]} aria-label="الأعمال المحفوظة">
          {filteredWorks.map((work) => (
            <LibraryCard key={work.id} work={work} onRemove={removeWork} />
          ))}
        </section>
      )}
      <p className={styles["localNotice"]}>
        تغييرات المكتبة في هذه المرحلة محلية لهذه الجلسة، ولا تُحفظ على الخادم.
      </p>
    </main>
  );
}

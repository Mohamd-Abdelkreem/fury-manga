"use client";

import { CheckCircle2, Undo2 } from "lucide-react";
import { useMemo, useState } from "react";

import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import { cn } from "@/lib/utils";
import { LIBRARY_WORKS, type LibraryWork } from "../../data/libraryData";
import { LibraryCard } from "./LibraryCard";
import { LibraryHeader } from "./LibraryHeader";
import { LibraryToolbar } from "./LibraryToolbar";
import type {
  ContentTypeFilter,
  ProgressFilter,
  SortOption,
  StatusFilter,
  ViewMode,
} from "./library.types";
import styles from "./LibraryScreen.module.css";

type LibraryScreenProps = Readonly<{
  initialWorks?: readonly LibraryWork[];
  viewState?: "loading" | "populated" | "error";
}>;

type RemovedWork = Readonly<{
  work: LibraryWork;
  index: number;
}>;

export function LibraryScreen({
  initialWorks = LIBRARY_WORKS,
  viewState = "populated",
}: LibraryScreenProps) {
  const [renderState, setRenderState] = useState(viewState);
  const [works, setWorks] = useState<readonly LibraryWork[]>(initialWorks);
  const [query, setQuery] = useState("");
  const [contentType, setContentType] = useState<ContentTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [removed, setRemoved] = useState<RemovedWork | null>(null);

  const resetAllFilters = () => {
    setQuery("");
    setContentType("all");
    setStatusFilter("all");
    setProgressFilter("all");
    setSortOption("default");
  };

  const filteredWorks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ar");
    let result = works.filter((work) => {
      // Content type filter
      if (contentType !== "all" && work.contentType !== contentType) {
        return false;
      }
      // Status filter
      if (statusFilter !== "all" && work.status !== statusFilter) {
        return false;
      }
      // Progress filter
      if (progressFilter === "in_progress") {
        if (!work.continueHref || work.status === "archived") return false;
      } else if (progressFilter === "not_started") {
        if (work.continueHref !== undefined && work.status !== "archived")
          return false;
      }
      // Query search
      if (
        normalizedQuery.length > 0 &&
        !work.title.toLocaleLowerCase("ar").includes(normalizedQuery)
      ) {
        return false;
      }
      return true;
    });

    // Sort
    if (sortOption === "title-asc") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, "ar"));
    } else if (sortOption === "title-desc") {
      result = [...result].sort((a, b) => b.title.localeCompare(a.title, "ar"));
    } else if (sortOption === "status") {
      result = [...result].sort((a, b) => a.status.localeCompare(b.status));
    }

    return result;
  }, [works, query, contentType, statusFilter, progressFilter, sortOption]);

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
      <main className="workspace-main" id="main-content">
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
      <main className="workspace-main" id="main-content">
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
    <main className={cn("workspace-main", styles["main"])} id="main-content">
      <LibraryHeader works={works} />
      <LibraryToolbar
        contentType={contentType}
        statusFilter={statusFilter}
        progressFilter={progressFilter}
        sortOption={sortOption}
        viewMode={viewMode}
        query={query}
        resultCount={filteredWorks.length}
        onContentTypeChange={setContentType}
        onStatusFilterChange={setStatusFilter}
        onProgressFilterChange={setProgressFilter}
        onSortChange={setSortOption}
        onViewModeChange={setViewMode}
        onQueryChange={setQuery}
        onResetFilters={resetAllFilters}
      />
      {removed === null ? null : (
        <div className={styles["undo"]} role="status" aria-live="polite">
          <div className={styles["undoText"]}>
            <CheckCircle2 aria-hidden="true" />
            <span>
              أُزيل «{removed.work.title}» من المحفوظات لهذه الجلسة (سجل القراءة
              محفوظ).
            </span>
          </div>
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
          onRetry={resetAllFilters}
          actionLabel="مسح البحث والفلاتر"
        />
      ) : (
        <section
          className={
            viewMode === "list" ? styles["listContainer"] : styles["grid"]
          }
          aria-label="الأعمال المحفوظة"
        >
          {filteredWorks.map((work) => (
            <LibraryCard
              key={work.id}
              work={work}
              viewMode={viewMode}
              onRemove={removeWork}
            />
          ))}
        </section>
      )}
    </main>
  );
}

import {
  BookOpenText,
  Clock,
  ImageIcon,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  ContentTypeFilter,
  ProgressFilter,
  SortOption,
  StatusFilter,
  ViewMode,
} from "./library.types";
import styles from "./LibraryScreen.module.css";

type FilterOption = Readonly<{
  value: ContentTypeFilter;
  label: string;
  icon?: LucideIcon;
}>;

const CONTENT_TYPE_OPTIONS: readonly FilterOption[] = [
  { value: "all", label: "الكل" },
  { value: "illustrated", label: "مصوّر", icon: ImageIcon },
  { value: "text", label: "نصي", icon: BookOpenText },
] as const;

type LibraryToolbarProps = Readonly<{
  contentType: ContentTypeFilter;
  statusFilter: StatusFilter;
  progressFilter: ProgressFilter;
  sortOption: SortOption;
  viewMode: ViewMode;
  query: string;
  resultCount: number;
  onContentTypeChange: (filter: ContentTypeFilter) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  onProgressFilterChange: (progress: ProgressFilter) => void;
  onSortChange: (sort: SortOption) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onQueryChange: (query: string) => void;
  onResetFilters: () => void;
}>;

export function LibraryToolbar({
  contentType,
  statusFilter,
  progressFilter,
  sortOption,
  viewMode,
  query,
  resultCount,
  onContentTypeChange,
  onStatusFilterChange,
  onProgressFilterChange,
  onSortChange,
  onViewModeChange,
  onQueryChange,
  onResetFilters,
}: LibraryToolbarProps) {
  const hasActiveFilters =
    query.trim().length > 0 ||
    contentType !== "all" ||
    statusFilter !== "all" ||
    progressFilter !== "all" ||
    sortOption !== "default";

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
        <div className={styles["toolbarMeta"]}>
          <p role="status">{resultCount} أعمال ظاهرة</p>
          {hasActiveFilters && (
            <button
              type="button"
              className={styles["resetQuickBtn"]}
              onClick={onResetFilters}
            >
              <X aria-hidden="true" />
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>
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
            {query.length > 0 && (
              <button
                type="button"
                className={styles["clearSearchBtn"]}
                aria-label="مسح حقل البحث"
                onClick={() => {
                  onQueryChange("");
                }}
              >
                <X aria-hidden="true" />
              </button>
            )}
          </span>
        </label>

        <div
          className={styles["filters"]}
          role="group"
          aria-label="نوع المحتوى"
        >
          {CONTENT_TYPE_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={contentType === option.value}
                onClick={() => {
                  onContentTypeChange(option.value);
                }}
              >
                {Icon === undefined ? null : <Icon aria-hidden="true" />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles["secondaryControls"]}>
        <div className={styles["selectorsGroup"]}>
          <label className={styles["selectField"]}>
            <span>
              <SlidersHorizontal aria-hidden="true" /> حالة العمل:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                onStatusFilterChange(e.target.value as StatusFilter);
              }}
              aria-label="تصفية بحسب حالة العمل"
            >
              <option value="all">جميع الحالات</option>
              <option value="ongoing">مستمر</option>
              <option value="completed">مكتمل</option>
              <option value="archived">غير متاح حاليًا</option>
            </select>
          </label>

          <label className={styles["selectField"]}>
            <span>
              <Clock aria-hidden="true" /> حالة القراءة:
            </span>
            <select
              value={progressFilter}
              onChange={(e) => {
                onProgressFilterChange(e.target.value as ProgressFilter);
              }}
              aria-label="تصفية بحسب حالة القراءة"
            >
              <option value="all">الكل</option>
              <option value="in_progress">قيد المتابعة</option>
              <option value="not_started">لم يبدأ</option>
            </select>
          </label>

          <label className={styles["selectField"]}>
            <span>الترتيب:</span>
            <select
              value={sortOption}
              onChange={(e) => {
                onSortChange(e.target.value as SortOption);
              }}
              aria-label="ترتيب الأعمال"
            >
              <option value="default">الافتراضي</option>
              <option value="title-asc">العنوان (أ - ي)</option>
              <option value="title-desc">العنوان (ي - أ)</option>
              <option value="status">بحسب الحالة</option>
            </select>
          </label>
        </div>

        <div
          className={styles["viewModeToggle"]}
          role="group"
          aria-label="طريقة العرض"
        >
          <button
            type="button"
            aria-pressed={viewMode === "grid"}
            aria-label="عرض شبكي"
            onClick={() => {
              onViewModeChange("grid");
            }}
            className={cn(viewMode === "grid" && styles["activeMode"])}
          >
            <LayoutGrid aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-pressed={viewMode === "list"}
            aria-label="عرض قائمة"
            onClick={() => {
              onViewModeChange("list");
            }}
            className={cn(viewMode === "list" && styles["activeMode"])}
          >
            <List aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

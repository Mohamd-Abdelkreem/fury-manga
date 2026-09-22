import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import { CATEGORIES } from "@/features/categories/data/categories";
import { DiscoverHero } from "@/features/discover/components/DiscoverHero/DiscoverHero";
import { AdvertisementSlot } from "@/features/advertising/components/AdvertisementSlot/AdvertisementSlot";

import { TEXT_WORKS, type TextWork } from "../../data/textStories";
import {
  TEXT_STORIES_PAGE_SIZE,
  catalogHref,
  filterAndSortTextWorks,
  type TextCatalogQuery,
} from "../../model/catalog";
import { TextStoryCard } from "../TextStoryCard/TextStoryCard";
import styles from "./TextStoriesListing.module.css";

export type TextListingState = "loading" | "populated" | "error";

type TextStoriesListingProps = Readonly<{
  query: TextCatalogQuery;
  works?: readonly TextWork[];
  viewState?: TextListingState;
}>;

type FilterOption = Readonly<{ value: string; label: string }>;

const STATUS_OPTIONS: readonly FilterOption[] = [
  { value: "", label: "الجميع" },
  { value: "ongoing", label: "مستمرة" },
  { value: "completed", label: "مكتملة" },
  { value: "hiatus", label: "متوقفة مؤقتًا" },
  { value: "archived", label: "غير متاحة" },
];

const TYPE_OPTIONS: readonly FilterOption[] = [
  { value: "", label: "الجميع" },
  { value: "novel", label: "رواية" },
  { value: "short-story", label: "قصة نصية" },
];

const SORT_OPTIONS: readonly FilterOption[] = [
  { value: "default", label: "الافتراضي" },
  { value: "title-asc", label: "أ - ي" },
  { value: "title-desc", label: "ي - أ" },
  { value: "updated", label: "تحديث" },
  { value: "added", label: "إضافة" },
];

type CatalogSelectProps = Readonly<{
  id: string;
  label: string;
  name: string;
  defaultValue: string;
  options: readonly FilterOption[];
}>;

function CatalogSelect({
  id,
  label,
  name,
  defaultValue,
  options,
}: CatalogSelectProps) {
  return (
    <div className={styles["dropdownWrapper"]}>
      <div className={styles["dropdownControl"]}>
        <label htmlFor={id}>{label}</label>
        <select id={id} name={name} defaultValue={defaultValue}>
          {options.map((option) => (
            <option value={option.value} key={option.value || "all"}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" />
      </div>
    </div>
  );
}

export function TextStoriesListing({
  query,
  works = TEXT_WORKS,
  viewState = "populated",
}: TextStoriesListingProps) {
  const filtered = filterAndSortTextWorks(works, query);
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / TEXT_STORIES_PAGE_SIZE),
  );
  const currentPage = Math.min(query.page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * TEXT_STORIES_PAGE_SIZE,
    currentPage * TEXT_STORIES_PAGE_SIZE,
  );
  const categoryOptions = CATEGORIES.map((category) => ({
    value: category.slug,
    label: category.name,
  }));

  return (
    <main className={styles["main"]} id="main-content">
      <DiscoverHero title="الروايات والقصص النصية" />

      <form action="/stories" method="get" className={styles["filterForm"]}>
        {query.q.length > 0 ? (
          <input type="hidden" name="q" value={query.q} />
        ) : null}
        <CatalogSelect
          id="stories-category"
          label="التصنيفات"
          name="category"
          defaultValue={query.category}
          options={[{ value: "", label: "الكل" }, ...categoryOptions]}
        />
        <CatalogSelect
          id="stories-status"
          label="الحالة"
          name="status"
          defaultValue={query.status}
          options={STATUS_OPTIONS}
        />
        <CatalogSelect
          id="stories-type"
          label="النوع"
          name="type"
          defaultValue={query.type}
          options={TYPE_OPTIONS}
        />
        <CatalogSelect
          id="stories-sort"
          label="بحسب"
          name="sort"
          defaultValue={query.sort}
          options={SORT_OPTIONS}
        />
        <button type="submit" className={styles["searchBtn"]}>
          <Search aria-hidden="true" />
          <span>البحث</span>
        </button>
      </form>

      <AdvertisementSlot placement="catalog-banner" />

      {viewState === "loading" ? (
        <FeatureState
          kind="loading"
          title="جارٍ تجهيز القائمة"
          message="نرتب الأعمال النصية وفق اختياراتك."
        />
      ) : viewState === "error" ? (
        <FeatureState
          kind="error"
          title="تعذّر عرض الأعمال"
          message="لم يكتمل تحميل القائمة. يمكنك المحاولة من جديد."
          actionHref={catalogHref(query, {})}
          actionLabel="إعادة المحاولة"
        />
      ) : works.length === 0 ? (
        <FeatureState
          kind="empty"
          title="لا توجد أعمال نصية بعد"
          message="ستظهر الروايات والقصص هنا عند توفر أعمال منشورة."
        />
      ) : filtered.length === 0 ? (
        <FeatureState
          kind="filtered-empty"
          title="لا توجد نتائج مطابقة"
          message="جرّب إزالة أحد المرشحات أو البحث بعنوان آخر."
          actionHref="/stories"
          actionLabel="مسح المرشحات"
        />
      ) : (
        <>
          <section
            aria-label="نتائج الروايات والقصص النصية"
            className={styles["grid"]}
          >
            {pageItems.map((work) => (
              <TextStoryCard key={work.id} work={work} />
            ))}
          </section>

          <nav
            aria-label="صفحات الروايات والقصص النصية"
            className={styles["paginationWrapper"]}
          >
            {currentPage > 1 ? (
              <Link
                className={styles["pageBtn"]}
                href={catalogHref(query, { page: currentPage - 1 }) as Route}
              >
                <ChevronLeft aria-hidden="true" />
                السابق
              </Link>
            ) : null}
            {currentPage < totalPages ? (
              <Link
                className={styles["pageBtn"]}
                href={catalogHref(query, { page: currentPage + 1 }) as Route}
              >
                <ChevronRight aria-hidden="true" />
                التالي
              </Link>
            ) : null}
          </nav>
        </>
      )}
    </main>
  );
}

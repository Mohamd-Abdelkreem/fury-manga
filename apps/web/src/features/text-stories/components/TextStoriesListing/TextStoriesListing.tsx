import { publicQueryParameters } from "@/features/public-catalog/model/catalog-query";
import { ChevronDown, Search } from "lucide-react";

import { DiscoverHero } from "@/features/discover/components/DiscoverHero/DiscoverHero";

import type { ReactNode } from "react";
import type {
  CatalogWorkListQuery,
  CatalogCategoryListData,
} from "@fury/contracts";
import { storyStatusLabels } from "@/features/public-catalog/model/public-catalog.presentation";
import { CatalogCategorySelect } from "@/features/public-catalog/components/CatalogCategorySelect";
import styles from "./TextStoriesListing.module.css";

type FilterOption = Readonly<{ value: string; label: string }>;

const STATUS_OPTIONS = [
  { value: "", label: "الجميع" },
  ...Object.entries(storyStatusLabels).map(([value, label]) => ({
    value,
    label,
  })),
];

const TYPE_OPTIONS: readonly FilterOption[] = [
  { value: "", label: "الجميع" },
  { value: "novel", label: "رواية" },
  { value: "text-story", label: "قصة نصية" },
];

const SORT_OPTIONS: readonly FilterOption[] = [
  { value: "newest", label: "الافتراضي" },
  { value: "title-asc", label: "أ - ي" },
  { value: "title-desc", label: "ي - أ" },
  { value: "chapter-latest", label: "تحديث" },
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
  categories,
  children,
}: Readonly<{
  query: CatalogWorkListQuery;
  categories?: CatalogCategoryListData | undefined;
  children: ReactNode;
}>) {
  return (
    <main className={styles["main"]} id="main-content">
      <DiscoverHero title="الروايات والقصص النصية" />

      <form
        key={publicQueryParameters(query).toString()}
        action="/stories"
        method="get"
        className={styles["filterForm"]}
      >
        {query.q !== undefined ? (
          <input type="hidden" name="q" value={query.q} />
        ) : null}
        <div className={styles["dropdownWrapper"]}>
          <div className={styles["dropdownControl"]}>
            <label htmlFor="stories-category">التصنيفات</label>
            <CatalogCategorySelect
              key={query.category ?? ""}
              id="stories-category"
              value={query.category ?? ""}
              seed={categories}
            />
            <ChevronDown aria-hidden="true" />
          </div>
        </div>
        <CatalogSelect
          id="stories-status"
          label="الحالة"
          name="status"
          defaultValue={query.status ?? ""}
          options={STATUS_OPTIONS}
        />
        <CatalogSelect
          id="stories-type"
          label="النوع"
          name="type"
          defaultValue={query.type ?? ""}
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

      {children}
    </main>
  );
}

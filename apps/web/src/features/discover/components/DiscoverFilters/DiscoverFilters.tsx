import { publicQueryParameters } from "@/features/public-catalog/model/catalog-query";
import { ChevronDown, Search } from "lucide-react";
import type {
  CatalogWorkListQuery,
  CatalogCategoryListData,
} from "@fury/contracts";
import {
  workTypeLabels,
  storyStatusLabels,
} from "@/features/public-catalog/model/public-catalog.presentation";
import { CatalogCategorySelect } from "@/features/public-catalog/components/CatalogCategorySelect";
import styles from "./DiscoverFilters.module.css";

type FilterOption = Readonly<{ value: string; label: string }>;
function FilterSelect({
  id,
  label,
  name,
  value,
  options,
}: Readonly<{
  id: string;
  label: string;
  name: string;
  value: string;
  options: readonly FilterOption[];
}>) {
  return (
    <div className={styles["selectControl"]}>
      <label htmlFor={id}>{label}</label>
      <select key={value} id={id} name={name} defaultValue={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" />
    </div>
  );
}
export function DiscoverFilters({
  query,
  categories,
}: Readonly<{
  query: CatalogWorkListQuery;
  categories?: CatalogCategoryListData | undefined;
}>) {
  const base = query.view === "stories" ? "/stories" : "/discover";
  const options = (labels: Record<string, string>) => [
    { value: "", label: "الكل" },
    ...Object.entries(labels).map(([value, label]) => ({ value, label })),
  ];
  return (
    <div className={styles["filterContainer"]} dir="rtl">
      <form
        key={publicQueryParameters(query).toString()}
        action={base}
        method="get"
        className={styles["filterForm"]}
      >
        <div className={styles["queryControl"]}>
          <label htmlFor="discover-query">
            البحث في{" "}
            {query.view === "stories" ? "الأعمال النصية" : "كل الأعمال"}
          </label>
          <input
            key={query.q ?? ""}
            id="discover-query"
            type="search"
            name="q"
            defaultValue={query.q ?? ""}
            maxLength={100}
            placeholder="ابحث بالعنوان…"
          />
        </div>
        <div className={styles["selectControl"]}>
          <label htmlFor="discover-category">التصنيف</label>
          <CatalogCategorySelect
            key={query.category ?? ""}
            id="discover-category"
            value={query.category ?? ""}
            seed={categories}
          />
          <ChevronDown aria-hidden="true" />
        </div>
        <FilterSelect
          id="discover-status"
          label="الحالة"
          name="status"
          value={query.status ?? ""}
          options={options(storyStatusLabels)}
        />
        <FilterSelect
          id="discover-type"
          label="النوع"
          name="type"
          value={query.type ?? ""}
          options={options(
            query.view === "stories"
              ? {
                  novel: workTypeLabels.novel,
                  "text-story": workTypeLabels["text-story"],
                }
              : workTypeLabels,
          )}
        />
        <FilterSelect
          id="discover-sort"
          label="الترتيب"
          name="sort"
          value={query.sort}
          options={[
            { value: "newest", label: "الأحدث إضافة" },
            { value: "chapter-latest", label: "آخر فصل منشور" },
            { value: "title-asc", label: "أ - ي" },
            { value: "title-desc", label: "ي - أ" },
          ]}
        />
        <button type="submit" className={styles["searchBtn"]}>
          <Search aria-hidden="true" />
          البحث
        </button>
      </form>
    </div>
  );
}

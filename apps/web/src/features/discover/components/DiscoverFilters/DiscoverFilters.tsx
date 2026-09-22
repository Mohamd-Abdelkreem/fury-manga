import { ChevronDown, Search } from "lucide-react";

import {
  DISCOVER_GENRES,
  DISCOVER_ORDERS,
  DISCOVER_STATUSES,
  DISCOVER_TYPES,
  type FilterOption,
} from "../../data/discoverData";
import type { DiscoverCatalogQuery } from "../../model/catalog";
import styles from "./DiscoverFilters.module.css";

type DiscoverFiltersProps = Readonly<{ query: DiscoverCatalogQuery }>;

type FilterSelectProps = Readonly<{
  id: string;
  label: string;
  name: string;
  value: string;
  options: readonly FilterOption[];
}>;

function FilterSelect({ id, label, name, value, options }: FilterSelectProps) {
  return (
    <div className={styles["selectControl"]}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} defaultValue={value}>
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" />
    </div>
  );
}

export function DiscoverFilters({ query }: DiscoverFiltersProps) {
  const sortOptions = DISCOVER_ORDERS.map((option) => ({
    ...option,
    value:
      option.value === "title"
        ? "title-asc"
        : option.value === "titlereverse"
          ? "title-desc"
          : option.value === "update"
            ? "latest"
            : option.value === ""
              ? "default"
              : option.value,
  })).filter((option) =>
    ["default", "title-asc", "title-desc", "latest"].includes(option.value),
  );

  return (
    <div className={styles["filterContainer"]} dir="rtl">
      <form action="/discover" method="get" className={styles["filterForm"]}>
        <div className={styles["queryControl"]}>
          <label htmlFor="discover-query">البحث في كل الأعمال</label>
          <input
            id="discover-query"
            type="search"
            name="q"
            defaultValue={query.q}
            placeholder="ابحث بالعنوان…"
          />
        </div>
        <FilterSelect
          id="discover-category"
          label="التصنيف"
          name="category"
          value={query.category}
          options={[{ value: "", label: "الكل" }, ...DISCOVER_GENRES]}
        />
        <FilterSelect
          id="discover-status"
          label="الحالة"
          name="status"
          value={query.status}
          options={DISCOVER_STATUSES}
        />
        <FilterSelect
          id="discover-type"
          label="النوع"
          name="type"
          value={query.type}
          options={DISCOVER_TYPES}
        />
        <FilterSelect
          id="discover-sort"
          label="الترتيب"
          name="sort"
          value={query.sort}
          options={sortOptions}
        />
        <button type="submit" className={styles["searchBtn"]}>
          <Search aria-hidden="true" />
          البحث
        </button>
      </form>
    </div>
  );
}

"use client";
import { useState } from "react";
import type { CatalogCategoryListData } from "@fury/contracts";
import { usePublicCatalogCategories } from "../hooks/public-catalog.hooks";

/** Pages the existing native choice control without fetching the entire directory. */
export function CatalogCategorySelect({
  id,
  value,
  seed,
}: Readonly<{
  id: string;
  value: string;
  seed?: CatalogCategoryListData | undefined;
}>) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(value);
  const result = usePublicCatalogCategories(
    { page },
    seed === undefined ? {} : { seed: { query: { page: 1 }, data: seed } },
  );
  const data = result.isError ? undefined : result.data;
  const categories = data?.items ?? [];
  return (
    <>
      <select
        id={id}
        name="category"
        value={selected}
        onChange={(event) => {
          const next = event.target.value;
          if (next === "__next") setPage((previous) => previous + 1);
          else if (next === "__previous")
            setPage((previous) => Math.max(1, previous - 1));
          else setSelected(next);
        }}
        aria-busy={result.isFetching || undefined}
      >
        <option value="">الكل</option>
        {selected !== "" &&
        !categories.some((category) => category.slug === selected) ? (
          <option value={selected}>{selected}</option>
        ) : null}
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.displayName}
          </option>
        ))}
        {data?.pagination.hasPreviousPage ? (
          <option value="__previous">التصنيفات السابقة</option>
        ) : null}
        {data?.pagination.hasNextPage ? (
          <option value="__next">المزيد من التصنيفات</option>
        ) : null}
      </select>
      {result.isError ? (
        <button
          type="button"
          onClick={() => {
            void result.refetch();
          }}
          aria-label="إعادة تحميل التصنيفات"
        >
          إعادة المحاولة
        </button>
      ) : null}
    </>
  );
}

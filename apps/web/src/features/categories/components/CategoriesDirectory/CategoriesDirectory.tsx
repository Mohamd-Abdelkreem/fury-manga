"use client";
import { Search, BookOpen } from "lucide-react";
import Link from "next/link";
import type {
  CatalogCategoryListData,
  CatalogCategoryListQuery,
} from "@fury/contracts";
import { usePublicCatalogCategories } from "@/features/public-catalog/hooks/public-catalog.hooks";
import { PublicCatalogState } from "@/features/public-catalog/components/PublicCatalogState";
import { CatalogPagination } from "@/features/public-catalog/components/CatalogPagination";
import { categoryHref } from "@/features/public-catalog/model/public-catalog.presentation";
import { usePublicRetryFocus } from "@/features/public-catalog/hooks/use-public-retry-focus";
import styles from "./CategoriesDirectory.module.css";

export function CategoriesDirectory({
  query,
  seed,
  initialUnavailable = false,
}: Readonly<{
  query: CatalogCategoryListQuery;
  seed?: CatalogCategoryListData;
  initialUnavailable?: boolean;
}>) {
  const result = usePublicCatalogCategories(
    query,
    seed === undefined ? {} : { seed: { query, data: seed } },
  );
  const data = result.data;
  const { target, requestFocus } = usePublicRetryFocus(
    JSON.stringify(query),
    result,
  );
  return (
    <main
      data-public-catalog-focus=""
      ref={target}
      tabIndex={-1}
      className={styles["main"]}
      id="main-content"
      dir="rtl"
    >
      <header className={styles["hero"]}>
        <p className="eyebrow">دليل Fury</p>
        <h1>التصنيفات</h1>
        <p>ابدأ من النوع الذي تحبه، ثم استكشف الأعمال المطابقة له.</p>
      </header>
      <form
        key={categoryHref(query.q, query.page)}
        action="/categories"
        method="get"
        className={styles["searchField"]}
      >
        <label htmlFor="category-search">ابحث في أسماء التصنيفات</label>
        <div className={styles["searchControl"]}>
          <Search aria-hidden="true" />
          <input
            key={query.q ?? ""}
            id="category-search"
            type="search"
            enterKeyHint="search"
            name="q"
            maxLength={100}
            defaultValue={query.q ?? ""}
            placeholder="مثال: أكشن أو خيال"
          />
        </div>
      </form>
      {result.isError || (data === undefined && initialUnavailable) ? (
        <PublicCatalogState
          kind="unavailable"
          retrying={result.isFetching}
          onRetry={() => {
            requestFocus();
            void result.refetch();
          }}
        />
      ) : data === undefined ? (
        <PublicCatalogState kind="loading" />
      ) : (
        <>
          {result.isFetching ? (
            <p role="status">جارٍ تحديث التصنيفات…</p>
          ) : null}
          {data.items.length === 0 ? (
            <PublicCatalogState
              kind={
                query.page > 1
                  ? "out-of-range"
                  : query.q
                    ? "filtered-empty"
                    : "empty"
              }
              resetHref={categoryHref(query.page > 1 ? query.q : undefined, 1)}
            />
          ) : (
            <section aria-label="قائمة التصنيفات" className={styles["grid"]}>
              {data.items.map((category) => (
                <Link
                  key={category.slug}
                  href={`/discover?category=${category.slug}`}
                  className={styles["card"]}
                >
                  <span className={styles["iconWrap"]}>
                    <BookOpen aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{category.displayName}</strong>
                    <small>استكشف الأعمال المنشورة في هذا التصنيف</small>
                  </span>
                </Link>
              ))}
            </section>
          )}
          <CatalogPagination
            page={query.page}
            totalPages={data.pagination.totalPages}
            href={(page) => categoryHref(query.q, page)}
          />
        </>
      )}
    </main>
  );
}

"use client";
import type {
  CatalogWorkListQuery,
  CatalogWorkListData,
  CatalogCategoryListData,
} from "@fury/contracts";
import { TextStoriesListing } from "@/features/text-stories/components/TextStoriesListing/TextStoriesListing";
import { DiscoverFilters } from "@/features/discover/components/DiscoverFilters/DiscoverFilters";
import { DiscoverGrid } from "@/features/discover/components/DiscoverGrid/DiscoverGrid";
import { AdvertisementSlot } from "@/features/advertising/components/AdvertisementSlot/AdvertisementSlot";
import { usePublicCatalogWorks } from "../hooks/public-catalog.hooks";
import { catalogHref } from "../model/public-catalog.presentation";
import { CatalogPagination } from "./CatalogPagination";
import { usePublicRetryFocus } from "../hooks/use-public-retry-focus";
import { PublicCatalogState } from "./PublicCatalogState";

export function PublicCatalogListing({
  query,
  seed,
  categories,
  initialUnavailable = false,
}: Readonly<{
  query: CatalogWorkListQuery;
  seed?: CatalogWorkListData;
  categories?: CatalogCategoryListData | undefined;
  initialUnavailable?: boolean;
}>) {
  const result = usePublicCatalogWorks(
    query,
    seed === undefined ? {} : { seed: { query, data: seed } },
  );
  const data = result.data;
  const { target, requestFocus } = usePublicRetryFocus(
    JSON.stringify(query),
    result,
  );
  const base = query.view === "stories" ? "/stories" : "/discover";
  const filtered = Boolean(
    query.q || query.category || query.type || query.status,
  );
  const results = (
    <>
      <AdvertisementSlot placement="catalog-banner" />
      {result.isError || (data === undefined && initialUnavailable) ? (
        <PublicCatalogState
          focusTarget={target}
          kind="unavailable"
          retrying={result.isFetching}
          onRetry={() => {
            requestFocus();
            void result.refetch();
          }}
        />
      ) : data === undefined ? (
        <PublicCatalogState focusTarget={target} kind="loading" />
      ) : (
        <>
          {result.isFetching ? <p role="status">جارٍ تحديث النتائج…</p> : null}
          <p
            data-public-catalog-focus=""
            ref={target}
            tabIndex={-1}
            role="status"
          >
            {data.pagination.total} نتيجة
          </p>
          {data.items.length === 0 ? (
            <PublicCatalogState
              kind={
                query.page > 1
                  ? "out-of-range"
                  : filtered
                    ? "filtered-empty"
                    : "empty"
              }
              resetHref={query.page > 1 ? catalogHref(query, 1) : base}
            />
          ) : (
            <DiscoverGrid works={data.items} />
          )}
          <CatalogPagination
            page={query.page}
            totalPages={data.pagination.totalPages}
            href={(page) => catalogHref(query, page)}
          />
        </>
      )}
    </>
  );
  return query.view === "stories" ? (
    <TextStoriesListing query={query} categories={categories}>
      {results}
    </TextStoriesListing>
  ) : (
    <>
      <DiscoverFilters query={query} categories={categories} />
      {results}
    </>
  );
}

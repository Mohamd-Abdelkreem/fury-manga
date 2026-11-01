"use client";
import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { usePublicRetryFocus } from "@/features/public-catalog/hooks/use-public-retry-focus";
import { Search } from "lucide-react";
import type { CatalogDetailData } from "@fury/contracts";
import { parsePublicChapterSearch } from "@/features/public-catalog/model/catalog-query";
import { SafePublicCatalogError } from "@/features/public-catalog/model/public-catalog.errors";
import { PublicCatalogState } from "@/features/public-catalog/components/PublicCatalogState";
import {
  usePublicCatalogChapters,
  usePublicCatalogChapter,
} from "@/features/public-catalog/hooks/public-catalog.hooks";
import paginationStyles from "@/features/text-stories/components/TextStoriesListing/TextStoriesListing.module.css";
import styles from "./ChapterList.module.css";

export type ChapterListSelection = Readonly<{
  page: number;
  search: string;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
}>;

export function ChapterList({
  detail,
  selection,
}: Readonly<{
  detail: CatalogDetailData;
  selection?: ChapterListSelection | undefined;
}>) {
  const { work, firstChapter, latestChapter } = detail;
  const [localPage, setLocalPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");
  const page = selection?.page ?? localPage;
  const search = selection?.search ?? localSearch;
  const setPage = selection?.onPageChange ?? setLocalPage;
  const setSearch = selection?.onSearchChange ?? setLocalSearch;
  const deferred = useDeferredValue(search.trim());
  const number = parsePublicChapterSearch(deferred);
  const pages = usePublicCatalogChapters(
    work.slug,
    page,
    page > 1 && deferred === "",
  );
  const selected = usePublicCatalogChapter(
    work.slug,
    number ?? 1,
    number !== undefined,
  );
  const searching = deferred !== "";
  const list = searching
    ? number === undefined || selected.data === undefined
      ? []
      : [selected.data]
    : page === 1
      ? detail.chapters.items
      : (pages.data?.items ?? []);
  const current = searching ? selected : pages;
  const { target, requestFocus } = usePublicRetryFocus(
    `${work.slug}:${String(page)}:${deferred}`,
    current,
  );
  const pending =
    search.trim() !== deferred ||
    (searching
      ? number !== undefined && selected.isPending
      : page > 1 && pages.isPending);
  const error =
    (searching ? number !== undefined : page > 1) && current.isError;
  const missing =
    error &&
    selected.error instanceof SafePublicCatalogError &&
    selected.error.statusCode === 404 &&
    searching;
  const totalPages = detail.chapters.pagination.totalPages;
  return (
    <div className={styles["container"]}>
      <div className={styles["titleBlock"]}>
        <h1 dir="auto" className={styles["mainTitle"]}>
          {work.title}
        </h1>
        {work.alternativeTitle === null ? null : (
          <p dir="auto" className={styles["altTitles"]}>
            {work.alternativeTitle}
          </p>
        )}
      </div>
      <div className={styles["genresWrapper"]}>
        {work.categories.map((category) => (
          <Link
            key={category.slug}
            href={`/discover?category=${category.slug}`}
            className={styles["genreBadge"]}
          >
            {category.displayName}
          </Link>
        ))}
      </div>
      {work.tags.length === 0 ? null : (
        <p dir="auto" className={styles["altTitles"]}>
          {work.tags.join("، ")}
        </p>
      )}
      <div className={styles["descriptionSection"]}>
        <h3 className={styles["sectionHeader"]}>قصة العمل {work.title}</h3>
        <p dir="auto" className={styles["descriptionText"]}>
          {work.synopsis}
        </p>
      </div>
      <div className={styles["quickLinks"]}>
        {(
          [
            ["الفصل الأول", firstChapter],
            ["الفصل الجديد", latestChapter],
          ] as const
        ).map(([label, chapter]) =>
          chapter !== null ? (
            <div key={label} className={styles["quickLinkItem"]}>
              <span className={styles["quickLinkLabel"]}>{label}</span>
              <span className={styles["quickLinkVal"]}>
                فصل {chapter.number}
              </span>
            </div>
          ) : null,
        )}
      </div>
      <p role="note">القراءة غير متاحة بعد؛ هذه معلومات الفصول المنشورة.</p>
      <div className={styles["chaptersSection"]}>
        <div className={styles["chaptersHeader"]}>
          <h3>الفصول {work.title}</h3>
        </div>
        <div className={styles["searchWrapper"]}>
          <Search aria-hidden="true" className={styles["searchIcon"]} />
          <input
            type="search"
            inputMode="numeric"
            aria-label="بحث عن فصل برقمه"
            value={search}
            maxLength={10}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث عن فصل برقمه"
            className={styles["searchInput"]}
          />
        </div>
        <div
          data-public-catalog-focus=""
          ref={target}
          tabIndex={0}
          role="region"
          aria-label="قائمة الفصول"
          className={styles["chaptersListWrapper"]}
        >
          {pending ? (
            <PublicCatalogState kind="loading" />
          ) : error && !missing ? (
            <PublicCatalogState
              kind="unavailable"
              onRetry={() => {
                requestFocus();
                void current.refetch();
              }}
            />
          ) : list.length === 0 ? (
            <div role="status" className={styles["noChapters"]}>
              {searching
                ? number === undefined
                  ? "أدخل رقم فصل صحيحًا"
                  : "لم يتم العثور على فصل بهذا الرقم"
                : "لا توجد فصول منشورة"}
            </div>
          ) : (
            <ul className={styles["chaptersList"]}>
              {list.map((chapter) => (
                <li key={chapter.number} className={styles["chapterItem"]}>
                  <div className={styles["chapterLink"]}>
                    <span className={styles["chapterNum"]}>
                      فصل {chapter.number} — <bdi>{chapter.title}</bdi>
                    </span>
                    <time
                      className={styles["chapterDate"]}
                      dateTime={chapter.publishedAt}
                    >
                      {new Intl.DateTimeFormat("ar", {
                        dateStyle: "medium",
                        timeZone: "UTC",
                      }).format(new Date(chapter.publishedAt))}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {!searching && totalPages > 1 ? (
          <nav
            aria-label="صفحات الفصول"
            className={paginationStyles["paginationWrapper"]}
            style={{ flexWrap: "wrap", alignItems: "center" }}
          >
            <button
              type="button"
              className="button button--small"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              الفصول السابقة
            </button>
            <span role="status">
              الصفحة {page} من {totalPages}
            </span>
            <button
              type="button"
              className="button button--small"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              الفصول التالية
            </button>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

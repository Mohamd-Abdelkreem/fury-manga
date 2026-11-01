import Link from "next/link";
import type { Route } from "next";
import styles from "@/features/text-stories/components/TextStoriesListing/TextStoriesListing.module.css";

export function CatalogPagination({
  page,
  totalPages,
  href,
}: Readonly<{
  page: number;
  totalPages: number;
  href: (page: number) => string;
}>) {
  if (totalPages < 2 || page > totalPages) return null;
  return (
    <nav className={styles["paginationWrapper"]} aria-label="صفحات النتائج">
      {page > 1 ? (
        <Link className={styles["pageBtn"]} href={href(page - 1) as Route}>
          السابق
        </Link>
      ) : null}
      <span role="status">
        الصفحة {page} من {totalPages}
      </span>
      {page < totalPages ? (
        <Link className={styles["pageBtn"]} href={href(page + 1) as Route}>
          التالي
        </Link>
      ) : null}
    </nav>
  );
}

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./AdminPagination.module.css";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = "عنصر",
}: AdminPaginationProps) {
  if (totalPages <= 1 && totalItems <= itemsPerPage) {
    return (
      <div className={styles["container"]}>
        <p className={styles["countText"]}>
          إجمالي النتائج: {totalItems.toLocaleString("ar-EG")} {itemName}
        </p>
      </div>
    );
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // In RTL, the "Next" page in sequence is pointing to the Left visually, or Next is logically forward!
  // ChevronRight is toward the previous (right side in RTL) and ChevronLeft is forward (left side in RTL).
  return (
    <nav className={styles["container"]} aria-label="ترقيم الصفحات">
      <p className={styles["countText"]}>
        عرض {startItem.toLocaleString("ar-EG")} -{" "}
        {endItem.toLocaleString("ar-EG")} من أصل{" "}
        {totalItems.toLocaleString("ar-EG")} {itemName}
      </p>

      <div className={styles["controls"]}>
        <button
          type="button"
          onClick={() => {
            onPageChange(currentPage - 1);
          }}
          disabled={currentPage <= 1}
          className={styles["pageBtn"]}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className={styles["arrowIcon"]} aria-hidden="true" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => {
                onPageChange(page);
              }}
              className={cn(
                styles["pageBtn"],
                isActive && styles["activePage"],
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={`الصفحة ${String(page)}`}
            >
              {page.toLocaleString("ar-EG")}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => {
            onPageChange(currentPage + 1);
          }}
          disabled={currentPage >= totalPages}
          className={styles["pageBtn"]}
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className={styles["arrowIcon"]} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

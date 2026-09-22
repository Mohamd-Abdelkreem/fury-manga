"use client";

import { useState } from "react";

export function useAdminPagination<T>(
  items: readonly T[],
  itemsPerPage: number,
) {
  const [requestedPage, setRequestedPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * itemsPerPage;

  const setCurrentPage = (page: number) => {
    setRequestedPage(
      Number.isSafeInteger(page) ? Math.max(1, Math.min(page, totalPages)) : 1,
    );
  };

  return {
    currentPage,
    totalPages,
    pageItems: items.slice(start, start + itemsPerPage),
    setCurrentPage,
  };
}

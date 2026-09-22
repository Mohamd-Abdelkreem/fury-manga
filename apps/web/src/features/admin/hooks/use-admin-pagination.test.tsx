import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAdminPagination } from "./use-admin-pagination";

describe("admin pagination", () => {
  it("clamps the selected page when the visible list shrinks", () => {
    const { result, rerender } = renderHook(
      ({ items }) => useAdminPagination(items, 2),
      { initialProps: { items: [1, 2, 3, 4, 5] } },
    );

    act(() => {
      result.current.setCurrentPage(3);
    });
    expect(result.current.pageItems).toEqual([5]);

    rerender({ items: [1, 2] });
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageItems).toEqual([1, 2]);
  });

  it("handles invalid page requests safely", () => {
    const { result } = renderHook(() => useAdminPagination([1, 2, 3], 2));

    act(() => {
      result.current.setCurrentPage(Number.POSITIVE_INFINITY);
    });
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.setCurrentPage(-4);
    });
    expect(result.current.currentPage).toBe(1);
  });
});

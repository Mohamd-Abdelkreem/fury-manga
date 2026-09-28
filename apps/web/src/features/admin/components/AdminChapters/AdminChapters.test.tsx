import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminChapters } from "./AdminChapters";
import { SafeAdminContentError } from "../../api/admin-content.api";

const mocks = vi.hoisted(() => {
  const workId = "11111111-1111-4111-8111-111111111111";
  const chapterId = "22222222-2222-4222-8222-222222222222";
  const summary = {
    id: chapterId,
    workId,
    number: 1,
    title: "Saved Chapter",
    contentType: "illustrated",
    publicationStatus: "draft",
    publishedAt: null,
    version: 4,
    createdAt: "2026-09-26T00:00:00.000Z",
    updatedAt: "2026-09-26T00:00:00.000Z",
    readyForPublication: true,
  };
  const pagination = {
    page: 1,
    limit: 8,
    total: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  return {
    workId,
    chapterId,
    summary,
    pagination,
    list: vi.fn(),
    publish: vi.fn(),
    publishPending: false,
    refetch: vi.fn(),
    retryAccess: vi.fn(),
    work: {
      actorId: "actor-one",
      data: {
        id: workId,
        title: "Saved Work",
        type: "manga",
        storyStatus: "ongoing",
        publicationStatus: "draft",
      },
      sessionReady: true,
      available: true,
      denied: false,
      isPending: false,
      isError: false,
      retryAccess: vi.fn(),
    },
    listState: {
      data: { items: [summary], pagination },
      sessionReady: true,
      denied: false,
      isPending: false,
      isError: false,
      isFetching: false,
    },
  };
});
const { workId, chapterId, summary, pagination } = mocks;

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("../../hooks/admin-content.hooks", () => ({
  useAdminWorkDetail: () => mocks.work,
}));
vi.mock("../../hooks/admin-chapter.hooks", () => ({
  useAdminChapterList: (id: string, query: unknown) => {
    mocks.list(id, query);
    return {
      ...mocks.listState,
      refetch: mocks.refetch,
      retryAccess: mocks.retryAccess,
    };
  },
  usePublishAdminChapter: () => ({
    mutateAsync: mocks.publish,
    isPending: mocks.publishPending,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.work.isPending = false;
  mocks.work.isError = false;
  mocks.work.denied = false;
  mocks.listState.data = { items: [summary], pagination };
  mocks.listState.isPending = false;
  mocks.listState.isError = false;
  mocks.listState.denied = false;
  mocks.publishPending = false;
  mocks.publish.mockResolvedValue({
    chapter: { ...summary, publicationStatus: "published", version: 5 },
    transition: {
      publicationStatus: "published",
      version: 5,
      transitioned: true,
    },
  });
});

describe("persisted Chapter list", () => {
  it("shows loading without fixture rows or a false empty state", () => {
    mocks.listState.isPending = true;
    render(<AdminChapters workId={workId} />);
    expect(screen.getByRole("status")).toHaveTextContent("جارٍ تحميل الفصول");
    expect(screen.queryByText("Saved Chapter")).not.toBeInTheDocument();
    expect(screen.queryByText("سمة المكتنز")).not.toBeInTheDocument();
  });

  it("distinguishes an empty Work from no filter matches", () => {
    mocks.listState.data = {
      items: [],
      pagination: { ...pagination, total: 0, totalPages: 0 },
    };
    render(<AdminChapters workId={workId} />);
    expect(screen.getByText("لا توجد فصول مضافة بعد")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "البحث عن فصل" }), {
      target: { value: "absent" },
    });
    expect(screen.getByText("لا توجد فصول مطابقة")).toBeInTheDocument();
    expect(mocks.list).toHaveBeenLastCalledWith(
      workId,
      expect.objectContaining({ search: "absent" }),
    );
  });

  it("sends filters and pages to the server with the filtered total", () => {
    mocks.listState.data = {
      items: [summary],
      pagination: {
        ...pagination,
        total: 17,
        totalPages: 3,
        hasNextPage: true,
      },
    };
    render(<AdminChapters workId={workId} />);
    fireEvent.change(
      screen.getByRole("combobox", { name: "تصفية الفصول حسب الحالة" }),
      {
        target: { value: "draft" },
      },
    );
    fireEvent.change(screen.getByRole("combobox", { name: "ترتيب الفصول" }), {
      target: { value: "number_desc" },
    });
    fireEvent.click(screen.getByRole("button", { name: "الصفحة التالية" }));
    expect(mocks.list).toHaveBeenLastCalledWith(
      workId,
      expect.objectContaining({
        page: 2,
        limit: 8,
        publicationStatus: "draft",
        sort: "number_desc",
      }),
    );
    expect(screen.getByText("Saved Chapter")).toBeInTheDocument();
  });

  it("confirms a current saved version before dispatching publication", async () => {
    render(<AdminChapters workId={workId} />);
    fireEvent.click(screen.getByRole("button", { name: "نشر الفصل 1" }));
    expect(mocks.publish).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "تأكيد" }));
    await waitFor(() => {
      expect(mocks.publish).toHaveBeenCalledWith({
        workId,
        chapterId,
        body: { expectedVersion: 4, targetState: "published" },
      });
    });
  });

  it("keeps confirmation busy and prevents dismissal while publication is unresolved", () => {
    mocks.publish.mockImplementation(() => new Promise(() => {}));
    const view = render(<AdminChapters workId={workId} />);
    fireEvent.click(screen.getByRole("button", { name: "نشر الفصل 1" }));
    fireEvent.click(screen.getByRole("button", { name: "تأكيد" }));
    mocks.publishPending = true;
    view.rerender(<AdminChapters workId={workId} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("جارٍ تأكيد الطلب");
    expect(screen.getByRole("button", { name: "تأكيد" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "إلغاء" })).toBeDisabled();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(dialog).toBeInTheDocument();
    expect(mocks.publish).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/تم تأكيد نشر الفصل/u)).not.toBeInTheDocument();
  });

  it("refuses an action when the selected Chapter version has changed", async () => {
    const { rerender } = render(<AdminChapters workId={workId} />);
    fireEvent.click(screen.getByRole("button", { name: "نشر الفصل 1" }));
    mocks.listState.data = {
      items: [{ ...summary, version: 5 }],
      pagination,
    };
    rerender(<AdminChapters workId={workId} />);
    fireEvent.click(screen.getByRole("button", { name: "تأكيد" }));
    await waitFor(() => {
      expect(mocks.refetch).toHaveBeenCalled();
    });
    expect(mocks.publish).not.toHaveBeenCalled();
  });

  it("shows request failure with a retry action", () => {
    mocks.listState.isError = true;
    render(<AdminChapters workId={workId} />);
    expect(screen.getByRole("alert")).toHaveTextContent("تعذّر تحميل الفصول");
    fireEvent.click(screen.getByRole("button", { name: "إعادة المحاولة" }));
    expect(mocks.retryAccess).toHaveBeenCalled();
  });

  it("masks a cached row when access is denied during a pending refresh", () => {
    mocks.listState.denied = true;
    mocks.listState.isPending = true;
    render(<AdminChapters workId={workId} />);
    expect(screen.getByRole("alert")).toHaveTextContent("تعذّر تحميل الفصول");
    expect(screen.queryByText("Saved Chapter")).not.toBeInTheDocument();
  });

  it("does not report a failed publication as confirmed", async () => {
    mocks.publish.mockRejectedValue(
      new SafeAdminContentError("CONTENT_STALE_WRITE", 409, "req-stale"),
    );
    render(<AdminChapters workId={workId} />);
    fireEvent.click(screen.getByRole("button", { name: "نشر الفصل 1" }));
    fireEvent.click(screen.getByRole("button", { name: "تأكيد" }));
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("تغيّر الفصل");
    });
    expect(screen.queryByText(/تم تأكيد نشر الفصل/u)).not.toBeInTheDocument();
    expect(mocks.refetch).toHaveBeenCalled();
  });
});

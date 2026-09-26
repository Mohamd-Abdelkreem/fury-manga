import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AdminWork } from "@fury/contracts";

import { SafeAdminContentError } from "../../api/admin-content.api";
import { AdminWorkEdit } from "./AdminWorkEdit";

const mocks = vi.hoisted(() => ({
  detail: {
    data: undefined as AdminWork | undefined,
    isPending: true,
    isError: false,
    error: null as Error | null,
    available: true,
    sessionReady: true,
    denied: false,
    writeBlocked: false,
    retryAccess: vi.fn(),
    refetch: vi.fn(),
  },
}));

vi.mock("../../hooks/admin-content.hooks", () => ({
  useAdminWorkDetail: () => mocks.detail,
}));

vi.mock("../AdminWorkForm/AdminWorkForm", () => ({
  AdminWorkForm: ({
    initialWork,
    canSave,
  }: {
    initialWork: AdminWork;
    canSave: boolean;
  }) => (
    <div data-testid="authoritative-work-form">
      {initialWork.title}
      <input aria-label="مسودة محلية" defaultValue={initialWork.title} />
      <button type="button" disabled={!canSave}>
        حفظ التعديلات
      </button>
    </div>
  ),
}));

const work: AdminWork = {
  id: "33333333-3333-4333-8333-333333333333",
  title: "Saved manga draft",
  alternativeTitle: null,
  synopsis: null,
  author: null,
  artist: null,
  slug: "saved-manga-draft",
  type: "manga",
  storyStatus: "ongoing",
  publicationStatus: "draft",
  publishedAt: null,
  featuredHome: false,
  featuredOrder: null,
  coverAssetId: null,
  backgroundAssetId: null,
  tags: [],
  version: 1,
  createdAt: "2026-09-25T10:00:00.000Z",
  updatedAt: "2026-09-25T10:00:00.000Z",
  categories: [],
};

beforeEach(() => {
  vi.resetAllMocks();
  Object.assign(mocks.detail, {
    data: undefined,
    isPending: true,
    isError: false,
    error: null,
    available: true,
    sessionReady: true,
    denied: false,
    writeBlocked: false,
  });
});

describe("administrator Work detail route", () => {
  it("waits for authoritative detail and refuses a late result for another resource", () => {
    mocks.detail.isPending = false;
    mocks.detail.data = work;
    const { rerender } = render(<AdminWorkEdit workId={work.id} />);
    expect(screen.getByTestId("authoritative-work-form")).toHaveTextContent(
      "Saved manga draft",
    );

    rerender(<AdminWorkEdit workId="44444444-4444-4444-8444-444444444444" />);
    expect(
      screen.queryByTestId("authoritative-work-form"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      /مطابقة العمل المطلوب/u,
    );
  });

  it("renders explicit access-denial and retry state without fixture details", () => {
    mocks.detail.isPending = false;
    mocks.detail.denied = true;
    mocks.detail.data = work;
    render(<AdminWorkEdit workId={work.id} />);

    expect(screen.getByRole("alert")).toHaveTextContent(/تعذّر الوصول/u);
    expect(
      screen.queryByTestId("authoritative-work-form"),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /إعادة التحقق/u }));
    expect(mocks.detail.retryAccess).toHaveBeenCalledOnce();
  });

  it("retains dirty detail on transient refresh error, blocks save, and recovers after retry", () => {
    mocks.detail.isPending = false;
    mocks.detail.data = work;
    const { rerender } = render(<AdminWorkEdit workId={work.id} />);
    fireEvent.change(screen.getByLabelText("مسودة محلية"), {
      target: { value: "تعديل لم يُحفظ" },
    });
    mocks.detail.isError = true;
    mocks.detail.error = new SafeAdminContentError("NETWORK_ERROR", 0, "");
    rerender(<AdminWorkEdit workId={work.id} />);
    expect(screen.getByLabelText("مسودة محلية")).toHaveValue("تعديل لم يُحفظ");
    expect(
      screen.getByRole("button", { name: "حفظ التعديلات" }),
    ).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(/قديمة/u);
    fireEvent.click(
      screen.getByRole("button", { name: /إعادة تحميل المسودة/u }),
    );
    expect(mocks.detail.refetch).toHaveBeenCalledOnce();
    mocks.detail.isError = false;
    rerender(<AdminWorkEdit workId={work.id} />);
    expect(screen.getByLabelText("مسودة محلية")).toHaveValue("تعديل لم يُحفظ");
    expect(screen.getByRole("button", { name: "حفظ التعديلات" })).toBeEnabled();
    mocks.detail.denied = true;
    rerender(<AdminWorkEdit workId={work.id} />);
    expect(screen.queryByLabelText("مسودة محلية")).not.toBeInTheDocument();
  });

  it("retains a dirty editor while a rejected write awaits read authorization, then masks actual reader denial", () => {
    mocks.detail.isPending = false;
    mocks.detail.data = work;
    const { rerender } = render(<AdminWorkEdit workId={work.id} />);
    fireEvent.change(screen.getByLabelText("مسودة محلية"), {
      target: { value: "تعديل محلي" },
    });
    Object.assign(mocks.detail, { writeBlocked: true, isError: false });
    rerender(<AdminWorkEdit workId={work.id} />);
    expect(screen.getByLabelText("مسودة محلية")).toHaveValue("تعديل محلي");
    expect(
      screen.getByRole("button", { name: "حفظ التعديلات" }),
    ).toBeDisabled();
    fireEvent.click(
      screen.getByRole("button", { name: /إعادة تحميل المسودة/u }),
    );
    expect(mocks.detail.retryAccess).toHaveBeenCalledOnce();
    mocks.detail.denied = true;
    rerender(<AdminWorkEdit workId={work.id} />);
    expect(screen.queryByLabelText("مسودة محلية")).not.toBeInTheDocument();
  });

  it("shows a safe missing-work result and retries detail reads", () => {
    mocks.detail.isPending = false;
    mocks.detail.isError = true;
    mocks.detail.error = new SafeAdminContentError("NOT_FOUND", 404, "");
    render(<AdminWorkEdit workId={work.id} />);

    expect(screen.getByRole("alert")).toHaveTextContent(/لم يعد العمل/u);
    fireEvent.click(
      screen.getByRole("button", { name: /إعادة تحميل المسودة/u }),
    );
    expect(mocks.detail.refetch).toHaveBeenCalledOnce();
  });
});

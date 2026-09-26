import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { AdminCategory, AdminWork, UpdateWorkBody } from "@fury/contracts";

import { SafeAdminContentError } from "../../api/admin-content.api";
import { AdminWorkForm } from "./AdminWorkForm";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  update:
    vi.fn<
      (variables: {
        workId: string;
        body: UpdateWorkBody;
      }) => Promise<AdminWork>
    >(),
  readback: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  enabledCategory: {
    id: "11111111-1111-4111-8111-111111111111",
    displayName: "أكشن",
    slug: "action",
    enabled: true,
    displayPosition: 1,
    worksCount: 2,
    version: 0,
    createdAt: "2026-09-25T10:00:00.000Z",
    updatedAt: "2026-09-25T10:00:00.000Z",
  },
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
}));

vi.mock("../../hooks/admin-content.hooks", () => ({
  useAdminCategoryPicker: () => ({
    data: [mocks.enabledCategory],
    isPending: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    available: true,
    denied: false,
  }),
  useCreateAdminWork: () => ({
    mutateAsync: mocks.create,
    isPending: false,
    readback: mocks.readback,
  }),
  useUpdateAdminWork: () => ({
    mutateAsync: mocks.update,
    isPending: false,
  }),
}));

vi.mock("@/features/media/components/AdminMediaCandidatePicker", () => ({
  AdminMediaCandidatePicker: ({
    label,
    initialAssetId,
    onAssetSelected,
  }: {
    label: string;
    initialAssetId?: string | null;
    onAssetSelected?: (assetId: string | null) => void;
  }) => (
    <div>
      <span>{label}</span>
      <output aria-label={`${label} المرفق`}>
        {initialAssetId ?? "لا يوجد وسيط مرتبط"}
      </output>
      <button
        type="button"
        onClick={() => {
          onAssetSelected?.("66666666-6666-4666-8666-666666666666");
        }}
      >
        اختيار وسيط تجريبي لـ {label}
      </button>
      <button
        type="button"
        onClick={() => {
          onAssetSelected?.(null);
        }}
      >
        إزالة الوسيط المرشح لـ {label}
      </button>
    </div>
  ),
}));

const enabledCategory: AdminCategory = {
  id: "11111111-1111-4111-8111-111111111111",
  displayName: "أكشن",
  slug: "action",
  enabled: true,
  displayPosition: 1,
  worksCount: 2,
  version: 0,
  createdAt: "2026-09-25T10:00:00.000Z",
  updatedAt: "2026-09-25T10:00:00.000Z",
};
const disabledCategory: AdminCategory = {
  ...enabledCategory,
  id: "22222222-2222-4222-8222-222222222222",
  displayName: "تصنيف قديم",
  slug: "old-category",
  enabled: false,
  displayPosition: 2,
};
const work: AdminWork = {
  id: "33333333-3333-4333-8333-333333333333",
  title: "عمل محفوظ",
  alternativeTitle: "عنوان بديل",
  synopsis: "هذه نبذة محفوظة تتجاوز الحد الأدنى للطول المطلوب.",
  author: "مؤلف محفوظ",
  artist: "رسام محفوظ",
  slug: "saved-work",
  type: "manga",
  storyStatus: "completed",
  publicationStatus: "draft",
  publishedAt: null,
  featuredHome: false,
  featuredOrder: null,
  coverAssetId: "44444444-4444-4444-8444-444444444444",
  backgroundAssetId: null,
  tags: ["تحقيق", "غموض"],
  version: 4,
  createdAt: "2026-09-25T10:00:00.000Z",
  updatedAt: "2026-09-25T10:00:00.000Z",
  categories: [enabledCategory, disabledCategory],
};
const createdWork: AdminWork = {
  ...work,
  id: "55555555-5555-4555-8555-555555555555",
  publicationStatus: "draft",
  version: 0,
  categories: [],
  coverAssetId: null,
};

const renderForm = (mode: "create" | "edit", initialWork?: AdminWork) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const view = render(
    <QueryClientProvider client={queryClient}>
      <AdminWorkForm mode={mode} initialWork={initialWork} />
    </QueryClientProvider>,
  );
  return { ...view, queryClient };
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("crypto", {
    randomUUID: () => "55555555-5555-4555-8555-555555555555",
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("saved administrator Work editor", () => {
  it("creates either canonical type with saved categories and no title-derived slug", async () => {
    mocks.create.mockResolvedValue(createdWork);
    renderForm("create");

    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "قصة عربية" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "arabic-story" },
    });
    fireEvent.change(screen.getByLabelText("نوع العمل"), {
      target: { value: "text-story" },
    });
    fireEvent.click(screen.getByLabelText("أكشن"));
    fireEvent.change(screen.getByLabelText(/الوسوم/u), {
      target: { value: "دراما، غموض" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));

    await waitFor(() => {
      expect(mocks.create).toHaveBeenCalledTimes(1);
    });
    expect(mocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "55555555-5555-4555-8555-555555555555",
        title: "قصة عربية",
        slug: "arabic-story",
        type: "text-story",
        categoryIds: [enabledCategory.id],
        tags: ["دراما", "غموض"],
        featuredHome: false,
        featuredOrder: null,
      }),
    );
    expect(mocks.push).toHaveBeenCalledWith(
      "/admin/works/55555555-5555-4555-8555-555555555555/edit",
    );
  });

  it("loads saved fields, retains disabled categories and shows attached private asset identity", () => {
    renderForm("edit", work);

    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue("عمل محفوظ");
    expect(screen.getByLabelText("الرابط المختصر")).toHaveValue("saved-work");
    expect(screen.getByLabelText("نوع العمل")).toBeDisabled();
    expect(screen.getByLabelText("أكشن")).toBeChecked();
    expect(screen.getByLabelText("تصنيف قديم (معطل)")).toBeChecked();
    expect(screen.getByLabelText("رفع غلاف جديد المرفق")).toHaveTextContent(
      work.coverAssetId ?? "",
    );
    expect(
      screen.getByRole("button", { name: "حفظ التعديلات" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /معاينة في الموقع/u }),
    ).not.toBeInTheDocument();
  });

  it("preserves dirty fields on refresh and requires an explicit adopt or continue choice", async () => {
    const { queryClient, rerender } = renderForm("edit", work);
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "تعديل محلي غير محفوظ" },
    });
    const refreshed = { ...work, title: "تعديل محفوظ خارجيًا", version: 5 };
    rerender(
      <QueryClientProvider client={queryClient}>
        <AdminWorkForm mode="edit" initialWork={refreshed} />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /تغيّرت النسخة المحفوظة/u,
    );
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue(
      "تعديل محلي غير محفوظ",
    );
    fireEvent.click(screen.getByRole("button", { name: "اعتماد نسخة الخادم" }));
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue(
      "تعديل محفوظ خارجيًا",
    );
  });

  it("continues a dirty draft against the refreshed expected version", async () => {
    const { queryClient, rerender } = renderForm("edit", work);
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مسودتي المحلية" },
    });
    const refreshed = { ...work, title: "عنوان خادم أحدث", version: 5 };
    rerender(
      <QueryClientProvider client={queryClient}>
        <AdminWorkForm mode="edit" initialWork={refreshed} />
      </QueryClientProvider>,
    );
    await screen.findByRole("alert");
    fireEvent.click(
      screen.getByRole("button", {
        name: "متابعة مسودتي على النسخة الحالية",
      }),
    );
    mocks.update.mockResolvedValue({ ...refreshed, version: 6 });
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));

    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledTimes(1);
    });
    expect(mocks.update.mock.calls[0]?.[0].body).toMatchObject({
      expectedVersion: 5,
      title: "مسودتي المحلية",
    });
  });

  it("submits a staged candidate without confusing it with the attached reference", async () => {
    mocks.update.mockResolvedValue({ ...work, version: 5 });
    renderForm("edit", work);
    fireEvent.click(
      screen.getByRole("button", {
        name: /اختيار وسيط تجريبي لـ رفع غلاف جديد/u,
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledTimes(1);
    });
    expect(mocks.update.mock.calls[0]?.[0]).toMatchObject({
      workId: work.id,
      body: {
        expectedVersion: work.version,
        coverAssetId: "66666666-6666-4666-8666-666666666666",
      },
    });
  });

  it("omits an unchanged attached reference from PATCH", async () => {
    mocks.update.mockResolvedValue({ ...work, version: 5 });
    renderForm("edit", work);
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledTimes(1);
    });
    expect(mocks.update.mock.calls[0]?.[0].body).not.toHaveProperty(
      "coverAssetId",
    );
  });

  it("sends an explicit null only when removing an attached cover", async () => {
    mocks.update.mockResolvedValue({ ...work, coverAssetId: null, version: 5 });
    renderForm("edit", work);
    fireEvent.click(
      screen.getByRole("button", { name: "إزالة الغلاف عند الحفظ" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledTimes(1);
    });
    expect(mocks.update.mock.calls[0]?.[0].body.coverAssetId).toBeNull();
  });

  it("preserves dirty input after a create failure and focuses the first invalid field", async () => {
    renderForm("create");
    const title = screen.getByLabelText(/عنوان العمل/u);
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    await waitFor(() => expect(title).toHaveFocus());

    fireEvent.change(title, { target: { value: "محفوظة كمسودة" } });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "draft-kept" },
    });
    mocks.create.mockRejectedValueOnce(
      new SafeAdminContentError("NETWORK_ERROR", 0, ""),
    );
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /تعذر تأكيد نتيجة الحفظ/u,
    );
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue("محفوظة كمسودة");
    expect(screen.getByLabelText("الرابط المختصر")).toHaveValue("draft-kept");
    expect(
      screen.getByRole("button", { name: /تحقق من حالة الحفظ/u }),
    ).toBeInTheDocument();
  });
});

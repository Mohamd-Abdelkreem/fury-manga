import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type {
  AdminCategory,
  AdminWork,
  CreateWorkBody,
  UpdateWorkBody,
  PublicationCommandBody,
} from "@fury/contracts";

import { SafeAdminContentError } from "../../api/admin-content.api";
import { ProtectedRoute } from "@/components/auth/protected-route";
import CreateWorkPage from "@/app/admin/works/new/page";
import { AdminWorkEdit } from "../AdminWorkEdit/AdminWorkEdit";
import { AdminWorkForm } from "./AdminWorkForm";

const mocks = vi.hoisted(() => ({
  create: vi.fn<(body: CreateWorkBody) => Promise<AdminWork>>(),
  update:
    vi.fn<
      (variables: {
        workId: string;
        body: UpdateWorkBody;
      }) => Promise<AdminWork>
    >(),
  readback: vi.fn(),
  updateReadback: vi.fn(),
  transition:
    vi.fn<
      (variables: {
        workId: string;
        body: PublicationCommandBody;
      }) => Promise<unknown>
    >(),
  transitionReadback: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  actorId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  workDetail: null as AdminWork | null,
  pickerPage: 1,
  pickerSearch: "",
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
  usePathname: () => "/admin/works/new",
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
}));

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({
    data: {
      user: {
        id: mocks.actorId,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerifiedAt: "2026-09-25T10:00:00.000Z",
      },
    },
    status: "success",
    isPending: false,
    isFetched: true,
    isError: false,
    error: null,
  }),
}));

vi.mock("../../hooks/admin-content.hooks", () => ({
  useAdminWorkDetail: () => ({
    data: mocks.workDetail,
    actorId: mocks.actorId,
    sessionReady: true,
    available: true,
    denied: false,
    isPending: false,
    isError: false,
    isFetching: false,
    writeBlocked: false,
  }),
  useAdminCategoryPicker: (page: number, search: string) => {
    mocks.pickerPage = page;
    mocks.pickerSearch = search;
    return {
      data: {
        items:
          page === 1
            ? [mocks.enabledCategory]
            : [
                {
                  ...mocks.enabledCategory,
                  id: "77777777-7777-4777-8777-777777777777",
                  displayName: "تصنيف رقم 101",
                },
              ],
        pagination: {
          page,
          limit: 100,
          total: 101,
          totalPages: 2,
          hasNextPage: page === 1,
          hasPreviousPage: page > 1,
        },
      },
      isPending: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
      available: true,
      denied: false,
    };
  },
  useCreateAdminWork: () => ({
    mutateAsync: mocks.create,
    isPending: false,
    readback: mocks.readback,
  }),
  useUpdateAdminWork: () => ({
    mutateAsync: mocks.update,
    isPending: false,
    readback: mocks.updateReadback,
  }),
  useTransitionAdminWork: () => ({
    mutateAsync: mocks.transition,
    readback: mocks.transitionReadback,
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
  mocks.pickerPage = 1;
  mocks.pickerSearch = "";
  mocks.actorId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  mocks.workDetail = null;
  vi.stubGlobal("crypto", {
    randomUUID: () => "55555555-5555-4555-8555-555555555555",
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("publication controls", () => {
  it("checks an unknown edit acknowledgement before allowing another save", async () => {
    mocks.update.mockRejectedValueOnce(
      new SafeAdminContentError("NETWORK_ERROR", 0, ""),
    );
    mocks.updateReadback.mockResolvedValueOnce({
      ...work,
      title: "Updated remotely",
      version: work.version + 1,
    });
    renderForm("edit", work);
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "Updated remotely" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledOnce();
    });
    expect(
      screen.getByRole("button", { name: "حفظ التعديلات" }),
    ).toBeDisabled();
    fireEvent.click(
      await screen.findByRole("button", { name: "تحقق من حفظ التعديلات" }),
    );
    await waitFor(() => {
      expect(mocks.updateReadback).toHaveBeenCalledWith(work.id);
    });
    expect(
      await screen.findByText("تأكد حفظ التعديلات على الخادم."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "حفظ التعديلات" })).toBeEnabled();
  });
  it("keeps a failed combined create-and-publish draft and reports readiness", async () => {
    mocks.create.mockRejectedValueOnce(
      new SafeAdminContentError("CONTENT_NOT_READY", 409, "not-ready", [
        "body.author",
        "body.coverAssetId",
      ]),
    );
    renderForm("create");
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "عمل للنشر" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "publish-work" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ ونشر" }));
    await waitFor(() => {
      expect(mocks.create).toHaveBeenCalledOnce();
    });
    expect(mocks.create.mock.calls[0]?.[0]).toHaveProperty(
      "targetState",
      "published",
    );
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue("عمل للنشر");
    expect(screen.getByText(/لا يمكن نشر العمل/u)).toBeInTheDocument();
    expect(
      screen.getByText("اختر غلاف عمل متاحًا قبل النشر."),
    ).toBeInTheDocument();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("archives a clean published work with its current version", async () => {
    mocks.transition.mockResolvedValueOnce({
      resourceType: "work",
      resourceId: work.id,
      publicationStatus: "archived",
      publishedAt: null,
      publicationEventId: null,
      version: work.version + 1,
      transitioned: true,
    });
    mocks.transitionReadback.mockResolvedValueOnce({
      ...work,
      publicationStatus: "archived",
      version: work.version + 1,
    });
    renderForm("edit", { ...work, publicationStatus: "published" });
    fireEvent.click(screen.getByRole("button", { name: "أرشفة العمل" }));
    await waitFor(() => {
      expect(mocks.transition).toHaveBeenCalledWith({
        workId: work.id,
        body: { expectedVersion: work.version, targetState: "archived" },
      });
    });
    expect(
      await screen.findByText("أُرشف العمل على الخادم."),
    ).toBeInTheDocument();
  });

  it("reports the server state after an ambiguous unpublish instead of claiming success", async () => {
    mocks.transition.mockRejectedValueOnce(
      new SafeAdminContentError("NETWORK_ERROR", 0, ""),
    );
    mocks.transitionReadback.mockResolvedValueOnce({
      ...work,
      publicationStatus: "published",
    });
    renderForm("edit", { ...work, publicationStatus: "published" });
    fireEvent.click(screen.getByRole("button", { name: "إلغاء النشر" }));
    expect(
      await screen.findByRole("button", { name: "تحقق من حالة العمل" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("أُعيد العمل إلى المسودة."),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "تحقق من حالة العمل" }));
    expect(
      await screen.findByText("تأكدت حالة العمل على الخادم: منشور."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "إلغاء النشر" })).toBeEnabled();
  });

  it("reports same-state publication without claiming another event", async () => {
    mocks.transition.mockResolvedValueOnce({
      resourceType: "work",
      resourceId: work.id,
      publicationStatus: "draft",
      publishedAt: null,
      publicationEventId: null,
      version: work.version,
      transitioned: false,
    });
    renderForm("edit", { ...work, publicationStatus: "archived" });
    expect(
      screen.queryByRole("button", { name: "حفظ ونشر" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "استعادة ونشر" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "استعادة كمسودة" }));
    expect(
      await screen.findByText(
        "العمل في هذه الحالة بالفعل؛ لم يُنشأ حدث نشر جديد.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("الحالة المحفوظة: مسودة")).toBeInTheDocument();
  });

  it("archives a clean draft after unpublishing", async () => {
    mocks.transition.mockResolvedValueOnce({
      resourceType: "work",
      resourceId: work.id,
      publicationStatus: "archived",
      publishedAt: null,
      publicationEventId: null,
      version: work.version + 1,
      transitioned: true,
    });
    renderForm("edit", work);
    fireEvent.click(screen.getByRole("button", { name: "أرشفة العمل" }));
    await waitFor(() => {
      expect(mocks.transition).toHaveBeenCalledWith({
        workId: work.id,
        body: { expectedVersion: work.version, targetState: "archived" },
      });
    });
    expect(
      await screen.findByText("أُرشف العمل على الخادم."),
    ).toBeInTheDocument();
  });
});

describe("actor-scoped mounted Work routes", () => {
  it("remounts the protected create page for another ADMIN and ignores the first actor's late save", async () => {
    let finish: ((saved: AdminWork) => void) | undefined;
    mocks.create
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      )
      .mockResolvedValue(createdWork);
    vi.stubGlobal("crypto", {
      randomUUID: vi
        .fn()
        .mockReturnValueOnce("55555555-5555-4555-8555-555555555555")
        .mockReturnValueOnce("99999999-9999-4999-8999-999999999999"),
    });
    const page = (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <CreateWorkPage />
      </ProtectedRoute>
    );
    const { rerender } = render(page);
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مسودة المدير الأول" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "first-draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    await waitFor(() => {
      expect(mocks.create).toHaveBeenCalledOnce();
    });
    mocks.actorId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
    rerender(
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <CreateWorkPage />
      </ProtectedRoute>,
    );
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue("");
    expect(
      screen.queryByDisplayValue("مسودة المدير الأول"),
    ).not.toBeInTheDocument();
    await act(async () => {
      finish?.(createdWork);
      await Promise.resolve();
    });
    expect(mocks.push).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مسودة المدير الثاني" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "second-draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    await waitFor(() => {
      expect(mocks.create).toHaveBeenCalledTimes(2);
    });
    expect(mocks.create.mock.calls[1]?.[0]).toMatchObject({
      id: "99999999-9999-4999-8999-999999999999",
      title: "مسودة المدير الثاني",
    });
  });

  it("does not offer another actor an unknown create readback or retain its UUID", async () => {
    mocks.create.mockRejectedValueOnce(
      new SafeAdminContentError("NETWORK_ERROR", 0, ""),
    );
    const { rerender } = render(
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <CreateWorkPage />
      </ProtectedRoute>,
    );
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مسودة خاصة" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "private-draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    await screen.findByRole("button", { name: /تحقق من حالة الحفظ/u });
    mocks.actorId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
    rerender(
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <CreateWorkPage />
      </ProtectedRoute>,
    );
    expect(
      screen.queryByRole("button", { name: /تحقق من حالة الحفظ/u }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue("");
    expect(mocks.readback).not.toHaveBeenCalled();
  });

  it("ignores an in-flight create readback after the actor changes", async () => {
    let finish: ((saved: AdminWork) => void) | undefined;
    mocks.create.mockRejectedValueOnce(
      new SafeAdminContentError("NETWORK_ERROR", 0, ""),
    );
    mocks.readback.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const { rerender } = render(
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <CreateWorkPage />
      </ProtectedRoute>,
    );
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مسودة خاصة" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "private-draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    fireEvent.click(
      await screen.findByRole("button", { name: /تحقق من حالة الحفظ/u }),
    );
    await waitFor(() => {
      expect(mocks.readback).toHaveBeenCalledOnce();
    });
    mocks.actorId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
    rerender(
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <CreateWorkPage />
      </ProtectedRoute>,
    );
    await act(async () => {
      finish?.({ ...createdWork, title: "مسودة خاصة", slug: "private-draft" });
      await Promise.resolve();
    });
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue("");
    expect(
      screen.queryByRole("link", { name: /فتح النسخة المحفوظة/u }),
    ).not.toBeInTheDocument();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("remounts the same Work edit route for another ADMIN and ignores the old acknowledgement", async () => {
    let finish: ((saved: AdminWork) => void) | undefined;
    mocks.workDetail = work;
    mocks.update.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const { rerender } = render(
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminWorkEdit workId={work.id} />
      </ProtectedRoute>,
    );
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "تعديل المدير الأول" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledOnce();
    });
    mocks.actorId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
    rerender(
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminWorkEdit workId={work.id} />
      </ProtectedRoute>,
    );
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue(work.title);
    await act(async () => {
      finish?.({ ...work, version: 5, title: "تعديل المدير الأول" });
      await Promise.resolve();
    });
    expect(
      screen.queryByText("حُفظت التعديلات على المسودة."),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue(work.title);
    expect(mocks.push).not.toHaveBeenCalled();
  });
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

  it("creates a manga draft without silently changing its canonical type", async () => {
    mocks.create.mockResolvedValue({ ...createdWork, type: "manga" });
    renderForm("create");
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مانغا عربية" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "arabic-manga" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    await waitFor(() => {
      expect(mocks.create).toHaveBeenCalledTimes(1);
    });
    expect(mocks.create.mock.calls[0]?.[0]).toMatchObject({
      id: "55555555-5555-4555-8555-555555555555",
      title: "مانغا عربية",
      slug: "arabic-manga",
      type: "manga",
    });
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

  it("pages and searches enabled categories beyond 100 while keeping an attached disabled choice", () => {
    renderForm("edit", work);
    expect(screen.getByLabelText("تصنيف قديم (معطل)")).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "التصنيفات التالية" }));
    expect(mocks.pickerPage).toBe(2);
    fireEvent.click(screen.getByLabelText("تصنيف رقم 101"));
    expect(screen.getByLabelText("تصنيف قديم (معطل)")).toBeChecked();
    fireEvent.change(screen.getByLabelText("ابحث عن تصنيف مفعّل"), {
      target: { value: "خيال" },
    });
    expect(mocks.pickerPage).toBe(1);
    expect(mocks.pickerSearch).toBe("خيال");
    expect(screen.getByLabelText("تصنيف رقم 101")).toBeChecked();
    fireEvent.click(screen.getByLabelText("تصنيف قديم (معطل)"));
    expect(
      screen.queryByLabelText("تصنيف قديم (معطل)"),
    ).not.toBeInTheDocument();
  });

  it("keeps the private saved preview authoritative while editing and labels unsaved input", () => {
    renderForm("edit", work);
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "عنوان محلي لم يُحفظ" },
    });

    const preview = screen.getByRole("region", {
      name: "معاينة البيانات المحفوظة",
    });
    expect(preview).toHaveTextContent(work.title);
    expect(preview).toHaveTextContent(work.synopsis ?? "");
    expect(preview).not.toHaveTextContent("عنوان محلي لم يُحفظ");
    expect(screen.getByText(/تغييرات غير محفوظة/u)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /معاينة في الموقع/u }),
    ).not.toBeInTheDocument();
  });

  it("keeps a local title dirty through a same-version detail refresh", () => {
    const { queryClient, rerender } = renderForm("edit", work);
    const localTitle = "عنوان محلي لم يُحفظ";
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: localTitle },
    });
    rerender(
      <QueryClientProvider client={queryClient}>
        <AdminWorkForm mode="edit" initialWork={{ ...work }} />
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue(localTitle);
    fireEvent.click(screen.getByRole("button", { name: "إلغاء والعودة" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(mocks.push).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue(localTitle);
  });

  it("shows Arabic title feedback and retains input without sending an invalid edit", async () => {
    renderForm("edit", work);
    const title = screen.getByLabelText(/عنوان العمل/u);
    fireEvent.change(title, { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));

    await waitFor(() => expect(title).toHaveFocus());
    expect(
      screen.getByText("أدخل عنوانًا من 1 إلى 200 حرف."),
    ).toBeInTheDocument();
    expect(title).toHaveValue("   ");
    expect(mocks.update).not.toHaveBeenCalled();
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

  it("does not navigate on an ambiguous create whose UUID readback has only the same slug", async () => {
    mocks.create.mockRejectedValueOnce(
      new SafeAdminContentError("NETWORK_ERROR", 0, ""),
    );
    mocks.readback.mockResolvedValueOnce({
      ...createdWork,
      title: "عمل مختلف",
      slug: "draft-kept",
    });
    renderForm("create");
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مسودتي المحلية" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "draft-kept" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    await screen.findByRole("button", { name: /تحقق من حالة الحفظ/u });
    fireEvent.click(
      screen.getByRole("button", { name: /تحقق من حالة الحفظ/u }),
    );
    await waitFor(() => {
      expect(mocks.readback).toHaveBeenCalledWith(
        "55555555-5555-4555-8555-555555555555",
      );
    });
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue("مسودتي المحلية");
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });

  it("keeps local input after a 404 then explicit same-ID POST 409 without claiming success", async () => {
    mocks.create
      .mockRejectedValueOnce(new SafeAdminContentError("NETWORK_ERROR", 0, ""))
      .mockRejectedValueOnce(
        new SafeAdminContentError("CONTENT_CONFLICT", 409, ""),
      );
    mocks.readback.mockRejectedValueOnce(
      new SafeAdminContentError("NOT_FOUND", 404, ""),
    );
    renderForm("create");
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مسودتي" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "my-draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    fireEvent.click(
      await screen.findByRole("button", { name: /تحقق من حالة الحفظ/u }),
    );
    await screen.findByText(/لم يُعثر على مسودة/u);
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    await screen.findByText(/تعارضت بيانات العمل/u);
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue("مسودتي");
    expect(mocks.create).toHaveBeenCalledTimes(2);
    expect(mocks.push).not.toHaveBeenCalled();
    const form = screen
      .getByRole("button", { name: "حفظ كمسودة" })
      .closest("form");
    if (form !== null) fireEvent.submit(form);
    expect(mocks.create).toHaveBeenCalledTimes(2);
  });

  it("keeps the original UUID and blocks a third POST after 404, 409, and another 404", async () => {
    mocks.create
      .mockRejectedValueOnce(new SafeAdminContentError("NETWORK_ERROR", 0, ""))
      .mockRejectedValueOnce(
        new SafeAdminContentError("CONTENT_CONFLICT", 409, ""),
      );
    mocks.readback.mockRejectedValue(
      new SafeAdminContentError("NOT_FOUND", 404, ""),
    );
    renderForm("create");
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مسودتي" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "my-draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    fireEvent.click(
      await screen.findByRole("button", { name: /تحقق من حالة الحفظ/u }),
    );
    await screen.findByText(/لم يُعثر على مسودة/u);
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    await screen.findByText(/تعارضت بيانات العمل/u);
    fireEvent.click(
      screen.getByRole("button", { name: /تحقق من حالة الحفظ/u }),
    );
    await waitFor(() => {
      expect(mocks.readback).toHaveBeenCalledTimes(2);
    });
    const form = screen
      .getByRole("button", { name: "حفظ كمسودة" })
      .closest("form");
    if (form !== null) fireEvent.submit(form);
    expect(mocks.create).toHaveBeenCalledTimes(2);
    expect(mocks.create.mock.calls[0]?.[0].id).toBe(
      mocks.create.mock.calls[1]?.[0].id,
    );
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue("مسودتي");
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("preserves a post-submit edit until server adoption, then accepts a later refresh", async () => {
    let finish: ((saved: AdminWork) => void) | undefined;
    mocks.update.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const { rerender, queryClient } = renderForm("edit", work);
    const title = screen.getByLabelText(/عنوان العمل/u);
    fireEvent.change(title, { target: { value: "Submitted B" } });
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledOnce();
    });
    fireEvent.change(title, { target: { value: work.title } });
    const saved = { ...work, title: "Submitted B", version: 5 };
    // The mutation cache publishes the saved detail before mutateAsync resolves.
    rerender(
      <QueryClientProvider client={queryClient}>
        <AdminWorkForm mode="edit" initialWork={saved} />
      </QueryClientProvider>,
    );
    expect(title).toHaveValue(work.title);
    expect(
      screen.getByRole("button", { name: "جارٍ حفظ التعديلات…" }),
    ).toBeDisabled();
    finish?.(saved);
    await screen.findByText(
      /حُفظت النسخة المرسلة، لكن لديك تعديلات غير محفوظة/u,
    );
    expect(title).toHaveValue(work.title);
    rerender(
      <QueryClientProvider client={queryClient}>
        <AdminWorkForm
          mode="edit"
          initialWork={{ ...work, title: "Remote C", version: 6 }}
        />
      </QueryClientProvider>,
    );
    expect(title).toHaveValue(work.title);
    expect(
      screen.getByRole("button", { name: "حفظ التعديلات" }),
    ).toBeDisabled();
    const form = screen
      .getByRole("button", { name: "حفظ التعديلات" })
      .closest("form");
    if (form !== null) fireEvent.submit(form);
    expect(mocks.update).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole("button", { name: "اعتماد نسخة الخادم" }));
    expect(title).toHaveValue("Remote C");
    rerender(
      <QueryClientProvider client={queryClient}>
        <AdminWorkForm
          mode="edit"
          initialWork={{ ...work, title: "Remote D", version: 7 }}
        />
      </QueryClientProvider>,
    );
    await waitFor(() => expect(title).toHaveValue("Remote D"));
    fireEvent.click(screen.getByRole("button", { name: "إلغاء والعودة" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mocks.push).toHaveBeenCalledWith("/admin/works");
  });

  it("does not erase newer draft input when an ambiguous create readback matches the submitted version", async () => {
    mocks.create.mockRejectedValueOnce(
      new SafeAdminContentError("NETWORK_ERROR", 0, ""),
    );
    mocks.readback.mockResolvedValueOnce({
      ...createdWork,
      title: "مرسلة",
      slug: "my-sent-draft",
      storyStatus: "ongoing",
      alternativeTitle: null,
      synopsis: null,
      author: null,
      artist: null,
      tags: [],
      featuredHome: false,
      featuredOrder: null,
    });
    renderForm("create");
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مرسلة" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "my-sent-draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    const check = await screen.findByRole("button", {
      name: /تحقق من حالة الحفظ/u,
    });
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "تعديل أحدث محلي" },
    });
    fireEvent.click(check);
    await screen.findByRole("link", { name: /فتح النسخة المحفوظة/u });
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue(
      "تعديل أحدث محلي",
    );
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("retains an edited draft and attached cover after a rejected save", async () => {
    mocks.update.mockRejectedValueOnce(
      new SafeAdminContentError("CONTENT_STALE_WRITE", 409, "stale-edit"),
    );
    renderForm("edit", work);
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "تعديل لم يُحفظ" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue("تعديل لم يُحفظ");
    expect(screen.getByLabelText("رفع غلاف جديد المرفق")).toHaveTextContent(
      work.coverAssetId ?? "",
    );
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("keeps newer typing and media after a delayed edit acknowledgement", async () => {
    let finish: ((saved: AdminWork) => void) | undefined;
    mocks.update.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    renderForm("edit", work);
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "النسخة المرسلة" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledOnce();
    });
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "نسخة محلية أحدث" },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: /اختيار وسيط تجريبي لـ رفع غلاف جديد/u,
      }),
    );
    finish?.({ ...work, title: "النسخة المرسلة", version: work.version + 1 });
    expect(
      await screen.findByText(
        /حُفظت النسخة المرسلة، لكن لديك تعديلات غير محفوظة/u,
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue(
      "نسخة محلية أحدث",
    );
    expect(screen.getByText(/سيُربط الوسيط المختار/u)).toBeInTheDocument();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("does not navigate when a create acknowledgement arrives after additional typing", async () => {
    let finish: ((saved: AdminWork) => void) | undefined;
    mocks.create.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    renderForm("create");
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "المسودة المرسلة" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "submitted-draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كمسودة" }));
    await waitFor(() => {
      expect(mocks.create).toHaveBeenCalledOnce();
    });
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "تحرير جديد غير محفوظ" },
    });
    finish?.({
      ...createdWork,
      title: "المسودة المرسلة",
      slug: "submitted-draft",
    });
    expect(
      await screen.findByText(
        /حُفظت النسخة المرسلة، لكن لديك تعديلات غير محفوظة/u,
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/عنوان العمل/u)).toHaveValue(
      "تحرير جديد غير محفوظ",
    );
    expect(
      screen.getByRole("link", { name: /فتح النسخة المحفوظة/u }),
    ).toHaveAttribute("href", `/admin/works/${createdWork.id}/edit`);
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("ignores a delayed edit acknowledgement after route identity or access changes", async () => {
    let finish: ((saved: AdminWork) => void) | undefined;
    mocks.update.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const { rerender, queryClient } = renderForm("edit", work);
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "تعديل مرسل" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ التعديلات" }));
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledOnce();
    });
    const another = {
      ...work,
      id: "88888888-8888-4888-8888-888888888888",
      title: "عمل آخر",
    };
    rerender(
      <QueryClientProvider client={queryClient}>
        <AdminWorkForm mode="edit" initialWork={another} canSave={false} />
      </QueryClientProvider>,
    );
    finish?.({ ...work, version: work.version + 1, title: "تعديل مرسل" });
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledOnce();
    });
    expect(mocks.push).not.toHaveBeenCalled();
    expect(
      screen.queryByText("حُفظت التعديلات على المسودة."),
    ).not.toBeInTheDocument();
  });

  it("guards rapid duplicate submissions and validation races in the actual handler", async () => {
    let finish: ((saved: AdminWork) => void) | undefined;
    mocks.create.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    renderForm("create");
    fireEvent.change(screen.getByLabelText(/عنوان العمل/u), {
      target: { value: "مسودة" },
    });
    fireEvent.change(screen.getByLabelText("الرابط المختصر"), {
      target: { value: "draft" },
    });
    const save = screen.getByRole("button", { name: "حفظ كمسودة" });
    const form = save.closest("form");
    expect(form).not.toBeNull();
    if (form === null) return;
    fireEvent.submit(form);
    fireEvent.submit(form);
    await waitFor(() => {
      expect(mocks.create).toHaveBeenCalledOnce();
    });
    fireEvent.submit(form);
    expect(mocks.create).toHaveBeenCalledOnce();
    finish?.(createdWork);
    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledOnce();
    });
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

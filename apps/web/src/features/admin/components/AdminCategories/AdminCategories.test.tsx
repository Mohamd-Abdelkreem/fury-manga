import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  AdminCategory,
  CategoryListQuery,
  CategoryPositionBody,
  CreateCategoryBody,
  UpdateCategoryBody,
} from "@fury/contracts";

import { SafeAdminContentError } from "../../api/admin-content.api";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminCategories } from "./AdminCategories";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/categories",
  useRouter: () => ({ replace: vi.fn() }),
}));

const apiMock = vi.hoisted(() => ({
  listCategories: vi.fn(),
  getCategory: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  moveCategory: vi.fn(),
}));
const sessionMock = vi.hoisted(() => ({
  id: "11111111-1111-4111-8111-111111111111",
  role: "ADMIN",
}));

vi.mock("../../api/admin-content.api", () => ({
  SafeAdminContentError: class extends Error {
    constructor(
      readonly code: string,
      readonly statusCode: number,
      readonly requestId: string,
      readonly fieldPaths: readonly string[] = [],
    ) {
      super("safe category failure");
    }
  },
  adminContentApi: apiMock,
}));

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({
    data: {
      user: {
        id: sessionMock.id,
        role: sessionMock.role,
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

const makeCategory = (
  id: number,
  overrides: Partial<AdminCategory> = {},
): AdminCategory => ({
  id: `${String(id).padStart(8, "0")}-1111-4111-8111-111111111111`,
  displayName: ["أكشن", "خيال", "رومانسي"][id - 1] ?? `تصنيف ${String(id)}`,
  slug: ["action", "fantasy", "romance"][id - 1] ?? `category-${String(id)}`,
  enabled: id !== 3,
  displayPosition: id,
  worksCount: id === 2 ? 2 : 0,
  version: 0,
  createdAt: "2026-09-25T10:00:00.000Z",
  updatedAt: "2026-09-25T10:00:00.000Z",
  ...overrides,
});

let queryClient: QueryClient;
let records: AdminCategory[];
let submittedCreateIds: string[];
let nextId: number;

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const rowFor = (name: string): HTMLElement => {
  const row = screen.getByText(name).closest("tr");
  if (row === null) throw new Error(`Category row not found: ${name}`);
  return row;
};

beforeEach(() => {
  vi.resetAllMocks();
  sessionMock.id = "11111111-1111-4111-8111-111111111111";
  sessionMock.role = "ADMIN";
  records = [makeCategory(1), makeCategory(2), makeCategory(3)];
  submittedCreateIds = [];
  nextId = 4;
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  apiMock.listCategories.mockImplementation((query: CategoryListQuery) => {
    const matches = records
      .filter((category) =>
        query.search === undefined
          ? true
          : `${category.displayName} ${category.slug}`
              .toLocaleLowerCase("ar")
              .includes(query.search.toLocaleLowerCase("ar")),
      )
      .filter((category) =>
        query.enabled === undefined ? true : category.enabled === query.enabled,
      )
      .toSorted((left, right) => left.displayPosition - right.displayPosition);
    const start = (query.page - 1) * query.limit;
    const totalPages = Math.ceil(matches.length / query.limit);
    return Promise.resolve({
      items: matches.slice(start, start + query.limit),
      pagination: {
        page: query.page,
        limit: query.limit,
        total: matches.length,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    });
  });
  apiMock.getCategory.mockImplementation((categoryId: string) => {
    const category = records.find((item) => item.id === categoryId);
    if (category === undefined) {
      return Promise.reject(
        new SafeAdminContentError("NOT_FOUND", 404, "request-missing"),
      );
    }
    return Promise.resolve(category);
  });
  apiMock.createCategory.mockImplementation((body: CreateCategoryBody) => {
    if (body.id !== undefined) submittedCreateIds.push(body.id);
    const category = makeCategory(nextId, {
      id:
        body.id ??
        `00000000-0000-4000-8000-${String(nextId).padStart(12, "0")}`,
      displayName: body.displayName,
      slug: body.slug,
      enabled: true,
      displayPosition: records.length + 1,
      worksCount: 0,
    });
    nextId += 1;
    records = [...records, category];
    return Promise.resolve(category);
  });
  apiMock.updateCategory.mockImplementation(
    (categoryId: string, body: UpdateCategoryBody) => {
      const index = records.findIndex((item) => item.id === categoryId);
      const current = records[index];
      if (current === undefined) {
        return Promise.reject(
          new SafeAdminContentError("NOT_FOUND", 404, "request-missing"),
        );
      }
      if (current.version !== body.expectedVersion) {
        return Promise.reject(
          new SafeAdminContentError("CONTENT_STALE_WRITE", 409, "stale"),
        );
      }
      const updated = {
        ...current,
        ...(body.displayName === undefined
          ? {}
          : { displayName: body.displayName }),
        ...(body.enabled === undefined ? {} : { enabled: body.enabled }),
        version: current.version + 1,
      };
      records = records.map((item) =>
        item.id === categoryId ? updated : item,
      );
      return Promise.resolve(updated);
    },
  );
  apiMock.moveCategory.mockImplementation(
    (categoryId: string, body: CategoryPositionBody) => {
      const movingIndex = records.findIndex((item) => item.id === categoryId);
      const moving = records[movingIndex];
      if (moving === undefined) {
        return Promise.reject(
          new SafeAdminContentError("NOT_FOUND", 404, "request-missing"),
        );
      }
      if (moving.version !== body.expectedVersion) {
        return Promise.reject(
          new SafeAdminContentError("CONTENT_STALE_WRITE", 409, "stale"),
        );
      }
      const displacedIndex = records.findIndex(
        (item) => item.displayPosition === body.targetPosition,
      );
      const displaced = records[displacedIndex];
      if (displaced === undefined) {
        return Promise.resolve({ category: moving, displacedCategory: null });
      }
      const moved = {
        ...moving,
        displayPosition: displaced.displayPosition,
        version: moving.version + 1,
      };
      const shifted = {
        ...displaced,
        displayPosition: moving.displayPosition,
        version: displaced.version + 1,
      };
      records = records.map((item) =>
        item.id === moving.id
          ? moved
          : item.id === displaced.id
            ? shifted
            : item,
      );
      return Promise.resolve({ category: moved, displacedCategory: shifted });
    },
  );
});

describe("AdminCategories", () => {
  it("loads persisted categories, searches on the server, and shows filtered empty state", async () => {
    render(<AdminCategories />, { wrapper });
    await screen.findByText("خيال");
    const search = screen.getByPlaceholderText("ابحث بالاسم أو الرابط…");

    fireEvent.change(search, { target: { value: "romance" } });
    await screen.findByText("رومانسي");
    await waitFor(() => {
      expect(apiMock.listCategories).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, search: "romance" }),
        expect.any(AbortSignal),
      );
    });
    await waitFor(() => {
      expect(screen.queryByText("خيال")).not.toBeInTheDocument();
    });

    fireEvent.change(search, { target: { value: "لا-يوجد" } });
    await waitFor(() => {
      expect(apiMock.listCategories).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, search: "لا-يوجد" }),
        expect.any(AbortSignal),
      );
    });
    expect(
      await screen.findByRole("heading", { name: "لا توجد تصنيفات مطابقة" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "إنشاء تصنيف" }),
    ).toBeInTheDocument();
  });

  it("reloads categories from a fresh QueryClient and the current server state", async () => {
    const firstRender = render(<AdminCategories />, { wrapper });
    await screen.findByText("خيال");
    records = records.map((category) =>
      category.slug === "fantasy"
        ? { ...category, displayName: "محفوظ على الخادم", version: 1 }
        : category,
    );
    firstRender.unmount();
    queryClient.clear();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: Infinity },
        mutations: { retry: false },
      },
    });

    render(<AdminCategories />, { wrapper });
    expect(await screen.findByText("محفوظ على الخادم")).toBeInTheDocument();
    expect(screen.queryByText("خيال")).not.toBeInTheDocument();
    expect(apiMock.listCategories).toHaveBeenCalledTimes(2);
  });

  it("distinguishes an empty collection and retries a failed create without losing its draft", async () => {
    records = [];
    render(<AdminCategories />, { wrapper });
    expect(
      await screen.findByRole("heading", { name: "لا توجد تصنيفات محفوظة" }),
    ).toBeInTheDocument();

    const createButton = screen.getAllByRole("button", {
      name: "إنشاء تصنيف",
    })[0];
    if (createButton === undefined) throw new Error("Create button not found");
    fireEvent.click(createButton);
    const dialog = screen.getByRole("dialog", { name: "إنشاء تصنيف" });
    fireEvent.change(within(dialog).getByLabelText("اسم التصنيف"), {
      target: { value: "غموض" },
    });
    fireEvent.change(within(dialog).getByLabelText("الرابط المختصر"), {
      target: { value: "mystery" },
    });
    apiMock.createCategory.mockImplementationOnce(
      (body: CreateCategoryBody) => {
        if (body.id !== undefined) submittedCreateIds.push(body.id);
        return Promise.reject(
          new SafeAdminContentError("NETWORK_ERROR", 0, ""),
        );
      },
    );

    fireEvent.click(
      within(dialog).getByRole("button", { name: "حفظ التصنيف" }),
    );
    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "نتيجة حفظ التصنيف غير مؤكدة",
    );
    expect(within(dialog).getByLabelText("اسم التصنيف")).toHaveValue("غموض");
    expect(within(dialog).getByLabelText("الرابط المختصر")).toHaveValue(
      "mystery",
    );

    fireEvent.click(
      within(dialog).getByRole("button", { name: "حفظ التصنيف" }),
    );
    await waitFor(() => {
      expect(apiMock.createCategory).toHaveBeenCalledTimes(2);
    });
    expect(submittedCreateIds[0]).toBe(submittedCreateIds[1]);
    expect(await screen.findByText("غموض")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("drops an old ADMIN draft on an account switch within the mounted route", async () => {
    const renderRoute = () => (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminCategories />
      </ProtectedRoute>
    );
    const view = render(renderRoute(), { wrapper });
    await screen.findByText("رومانسي");
    fireEvent.click(screen.getByRole("button", { name: "إنشاء تصنيف" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("اسم التصنيف"), {
      target: { value: "Private A draft" },
    });
    sessionMock.id = "77777777-7777-4777-8777-777777777777";
    view.rerender(renderRoute());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByDisplayValue("Private A draft"),
    ).not.toBeInTheDocument();
  });

  it("keeps the next ADMIN dialog open after the previous actor's late save", async () => {
    const pending = Promise.withResolvers<AdminCategory>();
    apiMock.createCategory.mockReturnValueOnce(pending.promise);
    const renderRoute = () => (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminCategories />
      </ProtectedRoute>
    );
    const view = render(renderRoute(), { wrapper });
    await screen.findByText("رومانسي");
    fireEvent.click(screen.getByRole("button", { name: "إنشاء تصنيف" }));
    let dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("اسم التصنيف"), {
      target: { value: "Actor A category" },
    });
    fireEvent.change(within(dialog).getByLabelText("الرابط المختصر"), {
      target: { value: "actor-a-category" },
    });
    fireEvent.click(
      within(dialog).getByRole("button", { name: "حفظ التصنيف" }),
    );
    await waitFor(() => {
      expect(apiMock.createCategory).toHaveBeenCalledTimes(1);
    });
    const command = apiMock.createCategory.mock
      .calls[0]?.[0] as CreateCategoryBody;
    const commandId = command.id;
    if (commandId === undefined) throw new Error("Missing Category create ID");

    sessionMock.id = "77777777-7777-4777-8777-777777777777";
    view.rerender(renderRoute());
    fireEvent.click(screen.getByRole("button", { name: "إنشاء تصنيف" }));
    dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("اسم التصنيف"), {
      target: { value: "Actor B category" },
    });
    await act(async () => {
      pending.resolve(
        makeCategory(4, {
          id: commandId,
          displayName: command.displayName,
          slug: command.slug,
        }),
      );
      await pending.promise;
    });
    expect(within(dialog).getByLabelText("اسم التصنيف")).toHaveValue(
      "Actor B category",
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(apiMock.createCategory).toHaveBeenCalledTimes(1);
  });

  it("blocks a third Category POST after an uncertain 404, retry 409, and second 404", async () => {
    records = [];
    apiMock.createCategory
      .mockRejectedValueOnce(new SafeAdminContentError("NETWORK_ERROR", 0, ""))
      .mockRejectedValueOnce(
        new SafeAdminContentError("CONTENT_CONFLICT", 409, ""),
      );
    render(<AdminCategories />, { wrapper });
    const [createButton] = screen.getAllByRole("button", {
      name: "إنشاء تصنيف",
    });
    if (createButton === undefined)
      throw new Error("Category create action missing");
    fireEvent.click(createButton);
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("اسم التصنيف"), {
      target: { value: "Uncertain category" },
    });
    fireEvent.change(within(dialog).getByLabelText("الرابط المختصر"), {
      target: { value: "uncertain-category" },
    });
    fireEvent.click(
      within(dialog).getByRole("button", { name: "حفظ التصنيف" }),
    );
    await within(dialog).findByText(/نتيجة حفظ التصنيف غير مؤكدة/u);
    fireEvent.click(
      within(dialog).getByRole("button", { name: "حفظ التصنيف" }),
    );
    await waitFor(() => {
      expect(apiMock.createCategory).toHaveBeenCalledTimes(2);
    });
    expect(
      within(dialog).getByRole("button", { name: "حفظ التصنيف" }),
    ).toBeDisabled();
    fireEvent.click(
      within(dialog).getByRole("button", { name: "التحقق من نتيجة الحفظ" }),
    );
    await waitFor(() => {
      expect(apiMock.getCategory).toHaveBeenCalledTimes(3);
    });
    expect(apiMock.createCategory).toHaveBeenCalledTimes(2);
    expect(within(dialog).getByLabelText("اسم التصنيف")).toHaveValue(
      "Uncertain category",
    );
    const submitted = apiMock.createCategory.mock.calls.map(
      ([body]) => (body as CreateCategoryBody).id,
    );
    expect(submitted[0]).toBe(submitted[1]);
    fireEvent.click(within(dialog).getByRole("button", { name: "إلغاء" }));
    const [reopenButton] = screen.getAllByRole("button", {
      name: "إنشاء تصنيف",
    });
    if (reopenButton === undefined)
      throw new Error("Category create action missing");
    fireEvent.click(reopenButton);
    const reopened = screen.getByRole("dialog");
    expect(within(reopened).getByLabelText("اسم التصنيف")).toHaveValue(
      "Uncertain category",
    );
    expect(within(reopened).getByLabelText("اسم التصنيف")).toHaveAttribute(
      "readonly",
    );
    expect(
      within(reopened).getByRole("button", { name: "حفظ التصنيف" }),
    ).toBeDisabled();
    expect(apiMock.createCategory).toHaveBeenCalledTimes(2);
  });

  it("locks rapid Category submits before the pending indicator renders", async () => {
    const pending = Promise.withResolvers<AdminCategory>();
    apiMock.createCategory.mockReturnValueOnce(pending.promise);
    render(<AdminCategories />, { wrapper });
    await screen.findByText("رومانسي");
    fireEvent.click(screen.getByRole("button", { name: "إنشاء تصنيف" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("اسم التصنيف"), {
      target: { value: "Rapid category" },
    });
    fireEvent.change(within(dialog).getByLabelText("الرابط المختصر"), {
      target: { value: "rapid-category" },
    });
    const form = within(dialog)
      .getByRole("button", { name: "حفظ التصنيف" })
      .closest("form");
    if (form === null) throw new Error("Category form missing");
    fireEvent.submit(form);
    fireEvent.submit(form);
    await waitFor(() => {
      expect(apiMock.createCategory).toHaveBeenCalledTimes(1);
    });
    const command = apiMock.createCategory.mock
      .calls[0]?.[0] as CreateCategoryBody;
    const commandId = command.id;
    if (commandId === undefined) throw new Error("Missing Category create ID");
    await act(async () => {
      pending.resolve(
        makeCategory(4, {
          id: commandId,
          displayName: command.displayName,
          slug: command.slug,
        }),
      );
      await pending.promise;
    });
  });

  it("keeps slug immutable, focuses invalid fields, and retains draft on validation failure", async () => {
    render(<AdminCategories />, { wrapper });
    await screen.findByText("رومانسي");
    fireEvent.click(
      within(rowFor("رومانسي")).getByRole("button", { name: "تعديل" }),
    );
    const dialog = screen.getByRole("dialog", { name: "تعديل التصنيف" });
    const saveButton = within(dialog).getByRole("button", {
      name: /حفظ التصنيف|جارٍ الحفظ/,
    });
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
    const nameInput = within(dialog).getByLabelText("اسم التصنيف");
    expect(within(dialog).getByLabelText("الرابط المختصر")).toHaveAttribute(
      "readonly",
    );
    fireEvent.change(nameInput, { target: { value: "رومانسية" } });
    apiMock.updateCategory.mockRejectedValueOnce(
      new SafeAdminContentError("VALIDATION_ERROR", 400, "bad-input", [
        "body.displayName",
      ]),
    );

    fireEvent.click(
      within(dialog).getByRole("button", { name: "حفظ التصنيف" }),
    );
    expect(
      await within(dialog).findByText("راجع اسم التصنيف المدخل."),
    ).toBeInTheDocument();
    expect(nameInput).toHaveFocus();
    expect(nameInput).toHaveValue("رومانسية");

    fireEvent.click(
      within(dialog).getByRole("button", { name: "حفظ التصنيف" }),
    );
    await waitFor(() => {
      expect(apiMock.updateCategory).toHaveBeenCalledTimes(2);
    });
    expect(await screen.findByText("رومانسية")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("refreshes stale detail before retry while preserving the edited draft", async () => {
    render(<AdminCategories />, { wrapper });
    await screen.findByText("خيال");
    fireEvent.click(
      within(rowFor("خيال")).getByRole("button", { name: "تعديل" }),
    );
    const dialog = screen.getByRole("dialog", { name: "تعديل التصنيف" });
    const nameInput = within(dialog).getByLabelText("اسم التصنيف");
    const saveButton = within(dialog).getByRole("button", {
      name: /حفظ التصنيف|جارٍ الحفظ/,
    });
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
    fireEvent.change(nameInput, { target: { value: "مسودة محلية" } });
    const currentCategory = records[1];
    if (currentCategory === undefined)
      throw new Error("Category fixture missing");
    apiMock.updateCategory.mockImplementationOnce(() => {
      records = records.map((item) =>
        item.id === currentCategory.id
          ? { ...item, displayName: "تعديل خارجي", version: item.version + 1 }
          : item,
      );
      return Promise.reject(
        new SafeAdminContentError("CONTENT_STALE_WRITE", 409, "stale"),
      );
    });

    fireEvent.click(saveButton);
    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "تغيّرت بيانات التصنيف",
    );
    await waitFor(() => {
      expect(apiMock.getCategory).toHaveBeenCalledTimes(2);
    });
    expect(nameInput).toHaveValue("مسودة محلية");
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(apiMock.updateCategory).toHaveBeenCalledTimes(2);
    });
    expect(apiMock.updateCategory.mock.calls[1]?.[1]).toEqual({
      expectedVersion: 1,
      displayName: "مسودة محلية",
    });
    expect(await screen.findByText("مسودة محلية")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends global adjacent moves and renders persisted order after refetch", async () => {
    render(<AdminCategories />, { wrapper });
    await screen.findByText("خيال");
    fireEvent.click(screen.getByRole("button", { name: "رفع ترتيب خيال" }));

    await waitFor(() => {
      expect(apiMock.moveCategory).toHaveBeenCalledWith(records[1]?.id, {
        expectedVersion: 0,
        targetPosition: 1,
      });
    });
    const rows = within(screen.getByRole("table")).getAllByRole("row");
    await waitFor(() => {
      expect(rows[1]).toHaveTextContent("خيال");
    });
    expect(rows[2]).toHaveTextContent("أكشن");
  });

  it("requires confirmation for in-use disable and preserves server state on refusal", async () => {
    render(<AdminCategories />, { wrapper });
    await screen.findByText("خيال");
    const categoryRow = rowFor("خيال");
    fireEvent.click(within(categoryRow).getByRole("button", { name: "تعطيل" }));
    const dialog = screen.getByRole("dialog", { name: "تعطيل التصنيف" });
    expect(
      within(dialog).getByText(/سيظل الارتباط محفوظًا/u),
    ).toBeInTheDocument();
    apiMock.updateCategory.mockRejectedValueOnce(
      new SafeAdminContentError("CONTENT_CATEGORY_IN_USE", 409, "in-use"),
    );
    fireEvent.click(
      within(dialog).getByRole("button", { name: "تعطيل التصنيف" }),
    );

    expect(
      await screen.findByText(/لا يمكن تعطيل التصنيف/u),
    ).toBeInTheDocument();
    expect(within(categoryRow).getByText("مفعّل")).toBeInTheDocument();
    expect(apiMock.updateCategory).toHaveBeenCalledWith(records[1]?.id, {
      expectedVersion: 0,
      enabled: false,
    });
  });

  it("changes pages through the server query and supports Escape focus return", async () => {
    records = Array.from({ length: 26 }, (_, index) =>
      makeCategory(index + 1, {
        displayName: `تصنيف ${String(index + 1)}`,
        slug: `category-${String(index + 1)}`,
        enabled: true,
        worksCount: 0,
      }),
    );
    render(<AdminCategories />, { wrapper });
    await screen.findByText("تصنيف 1");
    fireEvent.click(screen.getByRole("button", { name: "الصفحة التالية" }));
    await screen.findByText("تصنيف 26");
    await waitFor(() => {
      expect(apiMock.listCategories).toHaveBeenLastCalledWith(
        { page: 2, limit: 25 },
        expect.any(AbortSignal),
      );
    });

    const opener = screen.getByRole("button", { name: "إنشاء تصنيف" });
    opener.focus();
    fireEvent.click(opener);
    const dialog = screen.getByRole("dialog", { name: "إنشاء تصنيف" });
    const nameInput = within(dialog).getByLabelText("اسم التصنيف");
    await waitFor(() => {
      expect(nameInput).toHaveFocus();
    });
    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(opener).toHaveFocus();
  });
});

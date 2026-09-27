import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { AdminChapterForm } from "./AdminChapterForm";
import { SafeAdminContentError } from "../../api/admin-content.api";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  save: vi.fn(),
  publish: vi.fn(),
  publishPending: false,
  work: {
    actorId: "actor-one",
    available: true,
    sessionReady: true,
    denied: false,
    data: undefined as { id: string; title: string; type: string } | undefined,
    isPending: false,
    isError: false,
    refetch: vi.fn(),
    retryAccess: vi.fn(),
  },
  detail: {
    actorId: "actor-one",
    denied: false,
    data: undefined as object | undefined,
    isPending: false,
    isError: false,
    refetch: vi.fn(),
    retryAccess: vi.fn(),
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));
vi.mock("../../hooks/admin-content.hooks", () => ({
  useAdminWorkDetail: () => mocks.work,
}));
vi.mock("../../hooks/admin-chapter.hooks", () => ({
  useAdminChapterDetail: () => mocks.detail,
  useSaveAdminChapter: () => ({ mutateAsync: mocks.save, isPending: false }),
  usePublishAdminChapter: () => ({
    mutateAsync: mocks.publish,
    isPending: mocks.publishPending,
  }),
}));
vi.mock("@/features/media/components/AdminMediaCandidatePicker", () => ({
  AdminMediaCandidatePicker: ({
    onAssetSelected,
  }: {
    onAssetSelected: (assetId: string) => void;
  }) => (
    <>
      <button
        type="button"
        onClick={() => {
          onAssetSelected("11111111-1111-4111-8111-111111111111");
        }}
      >
        أضف الأولى
      </button>
      <button
        type="button"
        onClick={() => {
          onAssetSelected("22222222-2222-4222-8222-222222222222");
        }}
      >
        أضف الثانية
      </button>
    </>
  ),
}));
vi.mock("@/features/content/components/ChapterContentRenderer", () => ({
  ChapterContentRenderer: ({
    pages,
    document,
  }: {
    pages?: { assetId: string }[];
    document?: { blocks: { type: string; text?: string }[] } | null;
  }) => (
    <output data-testid="preview-pages">
      {pages?.map((page) => page.assetId).join(",") ??
        document?.blocks
          .map((block) => `${block.type}:${block.text ?? ""}`)
          .join(",") ??
        "empty text"}
    </output>
  ),
}));

const savedChapter = {
  id: "33333333-3333-4333-8333-333333333333",
  workId: "work-one",
  number: 1,
  title: "الفصل الأول",
  contentType: "illustrated",
  publicationStatus: "draft",
  publishedAt: null,
  version: 0,
  createdAt: "2026-09-26T00:00:00.000Z",
  updatedAt: "2026-09-26T00:00:00.000Z",
  textContent: null,
  pages: [
    {
      id: "44444444-4444-4444-8444-444444444444",
      position: 1,
      assetId: "11111111-1111-4111-8111-111111111111",
      assetStatus: "available",
    },
    {
      id: "55555555-5555-4555-8555-555555555555",
      position: 2,
      assetId: "22222222-2222-4222-8222-222222222222",
      assetStatus: "available",
    },
  ],
  readyForPublication: true,
} as const;

const savedTextChapter = {
  ...savedChapter,
  contentType: "text",
  textContent: {
    version: 1,
    blocks: [{ type: "heading", level: 2, text: "Saved heading" }],
  },
  pages: [],
} as const;

beforeEach(() => {
  vi.resetAllMocks();
  mocks.work.actorId = "actor-one";
  mocks.work.available = true;
  mocks.work.sessionReady = true;
  mocks.work.denied = false;
  mocks.work.isError = false;
  mocks.detail.denied = false;
  mocks.detail.isError = false;
  mocks.detail.actorId = "actor-one";
  mocks.work.data = { id: "work-one", title: "عمل مصور", type: "manga" };
  mocks.detail.data = undefined;
  mocks.publishPending = false;
  mocks.work.retryAccess.mockResolvedValue(mocks.work.data);
  mocks.detail.retryAccess.mockResolvedValue(savedChapter);
  mocks.save.mockResolvedValue(savedChapter);
  mocks.publish.mockResolvedValue({
    chapter: { ...savedChapter, publicationStatus: "published", version: 1 },
    transition: {
      resourceType: "chapter",
      resourceId: savedChapter.id,
      publicationStatus: "published",
      version: 1,
      transitioned: true,
      publicationEventId: "66666666-6666-4666-8666-666666666666",
    },
  });
});

describe("illustrated Chapter form", () => {
  it("adopts a newer confirmed Chapter when the editor is pristine", async () => {
    mocks.detail.data = savedChapter;
    const view = render(
      <AdminChapterForm workId="work-one" chapterId={savedChapter.id} />,
    );
    const newer = { ...savedChapter, version: 1, title: "New server title" };
    mocks.detail.data = newer;
    view.rerender(
      <AdminChapterForm workId="work-one" chapterId={savedChapter.id} />,
    );
    await waitFor(() => {
      expect(screen.getByLabelText("عنوان الفصل")).toHaveValue(newer.title);
    });
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    expect(mocks.save.mock.calls[0]?.[0]).toMatchObject({
      operation: "update",
      body: { expectedVersion: 1 },
    });
  });

  it("holds a dirty draft for comparison when a newer server revision arrives", async () => {
    mocks.detail.data = savedChapter;
    const view = render(
      <AdminChapterForm workId="work-one" chapterId={savedChapter.id} />,
    );
    fireEvent.change(screen.getByLabelText("عنوان الفصل"), {
      target: { value: "My unsaved title" },
    });
    const newer = { ...savedChapter, version: 1, title: "New server title" };
    mocks.detail.data = newer;
    mocks.detail.retryAccess.mockResolvedValue(newer);
    view.rerender(
      <AdminChapterForm workId="work-one" chapterId={savedChapter.id} />,
    );
    expect(screen.getByLabelText("عنوان الفصل")).toHaveValue(
      "My unsaved title",
    );
    expect(screen.getByRole("button", { name: /حفظ المسودة/ })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(
      "تغيّرت النسخة المحفوظة",
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "تحميل النسخة المحفوظة للمقارنة",
      }),
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /حفظ المسودة/ })).toBeEnabled();
    });
    expect(screen.getByLabelText("عنوان الفصل")).toHaveValue(
      "My unsaved title",
    );
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    expect(mocks.save.mock.calls[0]?.[0]).toMatchObject({
      operation: "update",
      body: { expectedVersion: 1, title: "My unsaved title" },
    });
  });

  it("replaces transient draft state when the actor or Chapter changes", async () => {
    mocks.detail.data = savedChapter;
    const view = render(
      <AdminChapterForm workId="work-one" chapterId={savedChapter.id} />,
    );
    fireEvent.change(screen.getByLabelText("عنوان الفصل"), {
      target: { value: "Old actor draft" },
    });
    mocks.work.actorId = "actor-two";
    mocks.detail.actorId = "actor-two";
    mocks.detail.data = { ...savedChapter, title: "New actor revision" };
    view.rerender(
      <AdminChapterForm workId="work-one" chapterId={savedChapter.id} />,
    );
    await waitFor(() => {
      expect(screen.getByLabelText("عنوان الفصل")).toHaveValue(
        "New actor revision",
      );
    });
    const otherChapter = {
      ...savedChapter,
      id: "77777777-7777-4777-8777-777777777777",
      title: "Other actor chapter",
    };
    view.rerender(
      <AdminChapterForm workId="work-one" chapterId={otherChapter.id} />,
    );
    expect(
      screen.queryByDisplayValue("New actor revision"),
    ).not.toBeInTheDocument();
    mocks.detail.data = otherChapter;
    view.rerender(
      <AdminChapterForm workId="work-one" chapterId={otherChapter.id} />,
    );
    await waitFor(() => {
      expect(screen.getByLabelText("عنوان الفصل")).toHaveValue(
        otherChapter.title,
      );
    });
    expect(
      screen.queryByDisplayValue("Old actor draft"),
    ).not.toBeInTheDocument();
  });

  it("keeps a private draft hidden on denial and offers an authorized retry", () => {
    mocks.detail.data = savedChapter;
    mocks.detail.denied = true;
    render(<AdminChapterForm workId="work-one" chapterId={savedChapter.id} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "تعذر تحميل العمل أو الفصل",
    );
    expect(screen.queryByText(savedChapter.title)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "إعادة المحاولة" }));
    expect(mocks.detail.retryAccess).toHaveBeenCalled();
  });

  it("maps safe page validation without displaying private server text", async () => {
    mocks.detail.data = savedChapter;
    mocks.save.mockRejectedValue(
      new SafeAdminContentError("VALIDATION_ERROR", 400, "req-private", [
        "body.pages.0.assetId",
      ]),
    );
    render(<AdminChapterForm workId="work-one" chapterId={savedChapter.id} />);
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "راجع ترتيب الصفحات",
    );
    expect(screen.queryByText("req-private")).not.toBeInTheDocument();
    expect(screen.getByLabelText("عنوان الفصل")).toHaveValue(
      savedChapter.title,
    );
  });

  it("retains the edited draft and asks for readback after service uncertainty", async () => {
    mocks.detail.data = savedChapter;
    mocks.save.mockRejectedValue(
      new SafeAdminContentError("SERVICE_UNAVAILABLE", 503, "req-503"),
    );
    render(<AdminChapterForm workId="work-one" chapterId={savedChapter.id} />);
    fireEvent.change(screen.getByLabelText("عنوان الفصل"), {
      target: { value: "مسودة غير مؤكدة" },
    });
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "نتيجة الطلب غير مؤكدة",
    );
    expect(screen.getByLabelText("عنوان الفصل")).toHaveValue("مسودة غير مؤكدة");
    expect(
      screen.getByRole("button", { name: "تحميل النسخة المحفوظة للمقارنة" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("حُفظت مسودة الفصل على الخادم."),
    ).not.toBeInTheDocument();
  });

  it("returns focus to the private-preview trigger after Escape", async () => {
    mocks.detail.data = savedChapter;
    render(<AdminChapterForm workId="work-one" chapterId={savedChapter.id} />);
    const opener = screen.getByRole("button", { name: /معاينة خاصة/ });
    opener.focus();
    fireEvent.click(opener);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => {
      expect(opener).toHaveFocus();
    });
  });
  it("confirms publication of the saved revision and blocks an unsaved draft", async () => {
    mocks.detail.data = savedChapter;
    render(<AdminChapterForm workId="work-one" chapterId={savedChapter.id} />);
    const publishButton = screen.getByRole("button", { name: "نشر الفصل" });
    expect(publishButton).toBeEnabled();
    fireEvent.change(screen.getByLabelText("عنوان الفصل"), {
      target: { value: "مسودة معدلة" },
    });
    expect(publishButton).toBeDisabled();
    fireEvent.change(screen.getByLabelText("عنوان الفصل"), {
      target: { value: savedChapter.title },
    });
    fireEvent.click(publishButton);
    expect(mocks.publish).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "تأكيد" }));
    await waitFor(() => {
      expect(mocks.publish).toHaveBeenCalledWith({
        workId: "work-one",
        chapterId: savedChapter.id,
        body: { expectedVersion: 0, targetState: "published" },
      });
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "تم تأكيد تغيير حالة الفصل المحفوظة.",
    );
  });

  it("retains the publication dialog and draft state while confirmation is unresolved", () => {
    mocks.detail.data = savedChapter;
    mocks.publish.mockImplementation(() => new Promise(() => {}));
    const view = render(
      <AdminChapterForm workId="work-one" chapterId={savedChapter.id} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "نشر الفصل" }));
    fireEvent.click(screen.getByRole("button", { name: "تأكيد" }));
    mocks.publishPending = true;
    view.rerender(
      <AdminChapterForm workId="work-one" chapterId={savedChapter.id} />,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("جارٍ تأكيد الطلب");
    expect(screen.getByRole("button", { name: "تأكيد" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "إلغاء" })).toBeDisabled();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /حفظ المسودة/ })).toBeDisabled();
    expect(mocks.publish).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText("تم تأكيد تغيير حالة الفصل المحفوظة."),
    ).not.toBeInTheDocument();
  });

  it("reports a failed publication without claiming the Chapter changed", async () => {
    mocks.detail.data = savedChapter;
    mocks.publish.mockRejectedValue(
      new SafeAdminContentError("CONTENT_STALE_WRITE", 409, "req-stale"),
    );
    render(<AdminChapterForm workId="work-one" chapterId={savedChapter.id} />);
    fireEvent.click(screen.getByRole("button", { name: "نشر الفصل" }));
    fireEvent.click(screen.getByRole("button", { name: "تأكيد" }));
    expect(await screen.findByRole("status")).toHaveTextContent("تغيّر الفصل");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("عنوان الفصل")).toHaveValue(
      savedChapter.title,
    );
    expect(
      screen.queryByText("تم تأكيد تغيير حالة الفصل المحفوظة."),
    ).not.toBeInTheDocument();
  });
  it("starts empty and saves two accepted candidate assets in order", async () => {
    render(<AdminChapterForm workId="work-one" />);
    expect(screen.queryByText("/anime/341452.jpg")).not.toBeInTheDocument();
    expect(
      screen.getByText("لا توجد صفحات مرتبطة بهذه المسودة."),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("عنوان الفصل"), {
      target: { value: "الفصل الأول" },
    });
    fireEvent.click(screen.getByRole("button", { name: "أضف الأولى" }));
    fireEvent.click(screen.getByRole("button", { name: "أضف الثانية" }));
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    await waitFor(() => {
      expect(mocks.save).toHaveBeenCalledWith({
        operation: "create",
        workId: "work-one",
        body: {
          number: 1,
          title: "الفصل الأول",
          pages: [
            { assetId: "11111111-1111-4111-8111-111111111111" },
            { assetId: "22222222-2222-4222-8222-222222222222" },
          ],
        },
      });
    });
    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalled();
    });
  });

  it("shows an access state once a visitor session is known", () => {
    mocks.work.available = false;
    mocks.work.data = undefined;
    render(<AdminChapterForm workId="work-one" />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "تعذر تحميل العمل أو الفصل",
    );
    expect(
      screen.queryByText("جارٍ تحميل بيانات الفصل…"),
    ).not.toBeInTheDocument();
  });

  it("submits a full reordered page set retaining saved IDs", async () => {
    mocks.detail.data = savedChapter;
    render(<AdminChapterForm workId="work-one" chapterId={savedChapter.id} />);
    fireEvent.click(
      screen.getByRole("button", { name: "تحريك الصفحة 2 للأعلى" }),
    );
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    await waitFor(() => {
      expect(mocks.save).toHaveBeenCalledWith({
        operation: "update",
        workId: "work-one",
        chapterId: savedChapter.id,
        body: {
          expectedVersion: 0,
          number: 1,
          title: "الفصل الأول",
          pages: [
            {
              id: savedChapter.pages[1].id,
              assetId: savedChapter.pages[1].assetId,
            },
            {
              id: savedChapter.pages[0].id,
              assetId: savedChapter.pages[0].assetId,
            },
          ],
        },
      });
    });
  });

  it("shows current unsaved order in private preview and preserves edits after failure", async () => {
    mocks.detail.data = savedChapter;
    mocks.save.mockRejectedValue(new Error("unavailable"));
    render(<AdminChapterForm workId="work-one" chapterId={savedChapter.id} />);
    fireEvent.click(
      screen.getByRole("button", { name: "تحريك الصفحة 2 للأعلى" }),
    );
    fireEvent.click(screen.getByRole("button", { name: /معاينة خاصة/ }));
    expect(screen.getByRole("dialog")).toHaveTextContent(
      "توجد تغييرات غير محفوظة",
    );
    expect(screen.getByTestId("preview-pages")).toHaveTextContent(
      `${savedChapter.pages[1].assetId},${savedChapter.pages[0].assetId}`,
    );
    fireEvent.click(screen.getByRole("button", { name: "النسخة المحفوظة" }));
    expect(screen.getByTestId("preview-pages")).toHaveTextContent(
      `${savedChapter.pages[0].assetId},${savedChapter.pages[1].assetId}`,
    );
    fireEvent.click(screen.getByRole("button", { name: "إغلاق المعاينة" }));
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    await screen.findByText("تعذر تأكيد حفظ الفصل. بقيت تعديلاتك في النموذج.");
    expect(
      screen.getByRole("button", { name: "تحريك الصفحة 1 للأسفل" }),
    ).toBeInTheDocument();
  });

  it("reloads a stale saved revision for comparison without discarding the draft", async () => {
    mocks.detail.data = savedChapter;
    mocks.detail.retryAccess.mockResolvedValue({
      ...savedChapter,
      version: 1,
      pages: [savedChapter.pages[0]],
    });
    mocks.save.mockRejectedValue(
      new SafeAdminContentError("CONTENT_STALE_WRITE", 409, "req-3"),
    );
    render(<AdminChapterForm workId="work-one" chapterId={savedChapter.id} />);
    fireEvent.click(
      screen.getByRole("button", { name: "تحريك الصفحة 2 للأعلى" }),
    );
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    const reload = await screen.findByRole("button", {
      name: "تحميل النسخة المحفوظة للمقارنة",
    });
    fireEvent.click(reload);
    await screen.findByText(
      "حُمّلت النسخة المحفوظة للمقارنة. بقيت تعديلاتك الحالية كما هي.",
    );
    fireEvent.click(screen.getByRole("button", { name: /معاينة خاصة/ }));
    expect(screen.getByTestId("preview-pages")).toHaveTextContent(
      `${savedChapter.pages[1].assetId},${savedChapter.pages[0].assetId}`,
    );
    fireEvent.click(screen.getByRole("button", { name: "النسخة المحفوظة" }));
    expect(screen.getByTestId("preview-pages")).toHaveTextContent(
      savedChapter.pages[0].assetId,
    );
    expect(screen.getByTestId("preview-pages")).not.toHaveTextContent(
      savedChapter.pages[1].assetId,
    );
  });
});

describe("text Chapter form", () => {
  beforeEach(() => {
    mocks.work.data = { id: "work-one", title: "عمل نصي", type: "novel" };
    mocks.save.mockResolvedValue(savedTextChapter);
  });

  it("saves an empty private draft without a sample or manual type switch", async () => {
    render(<AdminChapterForm workId="work-one" />);
    expect(screen.getByText("لا يوجد نص في هذه المسودة.")).toBeInTheDocument();
    expect(screen.queryByText("اقتباس")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("عنوان الفصل"), {
      target: { value: "Text chapter" },
    });
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    await waitFor(() => {
      expect(mocks.save).toHaveBeenCalledWith({
        operation: "create",
        workId: "work-one",
        body: { number: 1, title: "Text chapter", textContent: null },
      });
    });
  });

  it("builds the complete supported document through the text controls", async () => {
    render(<AdminChapterForm workId="work-one" />);
    fireEvent.change(screen.getByLabelText("عنوان الفصل"), {
      target: { value: "Complete text" },
    });
    fireEvent.click(screen.getByRole("button", { name: "عنوان H2" }));
    fireEvent.change(screen.getByLabelText("عنوان H2"), {
      target: { value: "Opening" },
    });
    fireEvent.click(screen.getByRole("button", { name: "عنوان H3" }));
    fireEvent.change(screen.getByLabelText("عنوان H3"), {
      target: { value: "Details" },
    });
    fireEvent.click(screen.getByRole("button", { name: "فقرة" }));
    fireEvent.change(screen.getByLabelText("نص الفقرة 3، جزء 1"), {
      target: { value: "Read more" },
    });
    fireEvent.click(screen.getByLabelText("عريض"));
    fireEvent.click(screen.getByLabelText("مائل"));
    fireEvent.change(screen.getByLabelText("رابط داخلي اختياري"), {
      target: { value: "/stories/example" },
    });
    fireEvent.click(screen.getByRole("button", { name: "قائمة مرقمة" }));
    fireEvent.change(screen.getByLabelText("عنصر 1 في القائمة 4"), {
      target: { value: "First" },
    });
    fireEvent.click(screen.getByRole("button", { name: "قائمة نقطية" }));
    fireEvent.change(screen.getByLabelText("عنصر 1 في القائمة 5"), {
      target: { value: "One" },
    });
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    await waitFor(() => {
      expect(mocks.save).toHaveBeenCalledWith({
        operation: "create",
        workId: "work-one",
        body: {
          number: 1,
          title: "Complete text",
          textContent: {
            version: 1,
            blocks: [
              { type: "heading", level: 2, text: "Opening" },
              { type: "heading", level: 3, text: "Details" },
              {
                type: "paragraph",
                content: [
                  {
                    text: "Read more",
                    bold: true,
                    italic: true,
                    href: "/stories/example",
                  },
                ],
              },
              { type: "list", ordered: true, items: ["First"] },
              { type: "list", ordered: false, items: ["One"] },
            ],
          },
        },
      });
    });
  });

  it("keeps an edited structured draft beside the saved preview after failed save", async () => {
    mocks.detail.data = savedTextChapter;
    mocks.save.mockRejectedValue(new Error("unavailable"));
    render(
      <AdminChapterForm workId="work-one" chapterId={savedTextChapter.id} />,
    );
    fireEvent.change(screen.getByLabelText("عنوان H2"), {
      target: { value: "Changed heading" },
    });
    fireEvent.click(screen.getByRole("button", { name: "فقرة" }));
    fireEvent.change(screen.getByLabelText("نص الفقرة 2، جزء 1"), {
      target: { value: "Linked" },
    });
    fireEvent.change(screen.getByLabelText("رابط داخلي اختياري"), {
      target: { value: "/stories/example" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "تحريك المقطع 2 للأعلى" }),
    );
    fireEvent.click(screen.getByRole("button", { name: /معاينة خاصة/ }));
    expect(screen.getByTestId("preview-pages")).toHaveTextContent(
      "paragraph:,heading:Changed heading",
    );
    fireEvent.click(screen.getByRole("button", { name: "النسخة المحفوظة" }));
    expect(screen.getByTestId("preview-pages")).toHaveTextContent(
      "heading:Saved heading",
    );
    fireEvent.click(screen.getByRole("button", { name: "إغلاق المعاينة" }));
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    await waitFor(() => {
      expect(mocks.save).toHaveBeenCalledWith({
        operation: "update",
        workId: "work-one",
        chapterId: savedTextChapter.id,
        body: {
          expectedVersion: 0,
          number: 1,
          title: savedTextChapter.title,
          textContent: {
            version: 1,
            blocks: [
              {
                type: "paragraph",
                content: [{ text: "Linked", href: "/stories/example" }],
              },
              { type: "heading", level: 2, text: "Changed heading" },
            ],
          },
        },
      });
    });
    expect(screen.getByLabelText("عنوان H2")).toHaveValue("Changed heading");
  });

  it("keeps an unsafe link in the draft for correction without sending it", async () => {
    mocks.detail.data = savedTextChapter;
    render(
      <AdminChapterForm workId="work-one" chapterId={savedTextChapter.id} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "فقرة" }));
    fireEvent.change(screen.getByLabelText("نص الفقرة 2، جزء 1"), {
      target: { value: "External" },
    });
    fireEvent.change(screen.getByLabelText("رابط داخلي اختياري"), {
      target: { value: "https://example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /حفظ المسودة/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "راجع المقاطع والروابط",
    );
    expect(mocks.save).not.toHaveBeenCalled();
    expect(screen.getByLabelText("رابط داخلي اختياري")).toHaveValue(
      "https://example.com",
    );
  });
});

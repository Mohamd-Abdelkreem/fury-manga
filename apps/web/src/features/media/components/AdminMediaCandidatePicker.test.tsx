import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminMediaCandidatePicker } from "./AdminMediaCandidatePicker";

const mediaApiMock = vi.hoisted(() => ({
  upload: vi.fn(),
  getAttempt: vi.fn(),
  getAsset: vi.fn(),
  readContent: vi.fn(),
  listAdmin: vi.fn(),
}));

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({
    data: {
      user: {
        id: "11111111-1111-4111-8111-111111111111",
        role: "ADMIN",
        status: "ACTIVE",
        emailVerifiedAt: "2026-09-23T10:00:00.000Z",
      },
    },
  }),
}));
vi.mock("../api/media.api", () => ({
  SafeMediaError: class extends Error {
    constructor(
      readonly code: string,
      readonly statusCode: number,
      readonly requestId: string,
    ) {
      super("safe media error");
    }
  },
  mediaApi: mediaApiMock,
}));

let queryClient: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
const renderPicker = () =>
  render(
    <AdminMediaCandidatePicker mediaClass="work_cover" label="رفع غلاف جديد" />,
    { wrapper },
  );

describe("administrator media candidate picker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    mediaApiMock.listAdmin.mockResolvedValue({ items: [] });
    mediaApiMock.readContent.mockResolvedValue(new Blob(["private-cover"]));
    URL.createObjectURL = vi
      .fn()
      .mockReturnValueOnce("blob:temporary-preview")
      .mockReturnValue("blob:private-preview");
    URL.revokeObjectURL = vi.fn();
  });

  it("announces an accepted RTL candidate without claiming parent persistence", async () => {
    mediaApiMock.upload.mockResolvedValue({ id: "asset-one" });
    renderPicker();
    const input = screen.getByLabelText("رفع غلاف جديد");
    input.focus();
    expect(input).toHaveFocus();
    expect(input.closest("div")).toHaveAttribute("dir", "rtl");

    fireEvent.change(input, {
      target: {
        files: [new File(["cover"], "cover.jpg", { type: "image/jpeg" })],
      },
    });

    const status = await screen.findByText(/حُفظت الصورة في الوسائط فقط/u);
    expect(status).toHaveFocus();
    expect(
      screen.getByRole("img", { name: "معاينة رفع غلاف جديد" }),
    ).toHaveAttribute("src", "blob:private-preview");
    fireEvent.click(
      screen.getByRole("button", { name: /إزالة المعاينة المحلية/u }),
    );
    expect(input).toHaveFocus();
  });

  it("keeps the temporary preview visible during processing and aborts", async () => {
    let reportProgress: ((percent: number) => void) | undefined;
    mediaApiMock.upload.mockImplementation(
      (
        _class: unknown,
        _file: unknown,
        _attempt: unknown,
        options: {
          signal: AbortSignal;
          onProgress: (percent: number) => void;
        },
      ) => {
        reportProgress = options.onProgress;
        return new Promise((_resolve, reject) => {
          options.signal.addEventListener("abort", () => {
            reject(new Error("aborted"));
          });
        });
      },
    );
    renderPicker();
    fireEvent.change(screen.getByLabelText("رفع غلاف جديد"), {
      target: {
        files: [new File(["cover"], "cover.jpg", { type: "image/jpeg" })],
      },
    });
    await waitFor(() => {
      expect(reportProgress).toBeTypeOf("function");
    });
    reportProgress?.(100);
    await waitFor(() => {
      expect(screen.getByText(/اكتمل نقل الملف/u)).toBeVisible();
    });
    expect(screen.getByRole("img", { name: /معاينة مؤقتة/u })).toHaveAttribute(
      "src",
      "blob:temporary-preview",
    );
    expect(screen.getByLabelText("رفع غلاف جديد")).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /إلغاء الرفع/u }));
    await waitFor(() => {
      expect(screen.getByText(/نتيجة الرفع غير مؤكدة/u)).toBeVisible();
    });
  });

  it("loads a durable candidate through the real list and candidate hooks", async () => {
    const assetId = "43afae94-0e94-45e9-ab76-100f889d0777";
    mediaApiMock.listAdmin.mockResolvedValue({
      items: [
        {
          id: assetId,
          width: 600,
          height: 800,
          createdAt: "2026-09-24T08:00:00.000Z",
        },
      ],
    });
    mediaApiMock.getAsset.mockResolvedValue({ id: assetId });
    renderPicker();

    fireEvent.click(
      await screen.findByRole("button", { name: /معاينة الوسيط/u }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("img", { name: "معاينة رفع غلاف جديد" }),
      ).toHaveAttribute("src", "blob:temporary-preview");
    });
    expect(mediaApiMock.getAsset).toHaveBeenCalledWith(
      assetId,
      expect.any(AbortSignal),
    );
  });

  it("loads attached private media without staging it and stages a saved candidate explicitly", async () => {
    const assetId = "43afae94-0e94-45e9-ab76-100f889d0777";
    const onAssetSelected = vi.fn();
    mediaApiMock.listAdmin.mockResolvedValue({
      items: [
        {
          id: assetId,
          width: 600,
          height: 800,
          createdAt: "2026-09-24T08:00:00.000Z",
        },
      ],
    });
    mediaApiMock.getAsset.mockResolvedValue({ id: assetId });
    const { container } = render(
      <AdminMediaCandidatePicker
        mediaClass="work_cover"
        label="رفع غلاف جديد"
        initialAssetId={assetId}
        onAssetSelected={onAssetSelected}
      />,
      { wrapper },
    );

    expect(
      await screen.findByRole("img", { name: "معاينة رفع غلاف جديد" }),
    ).toBeVisible();
    expect(mediaApiMock.readContent).toHaveBeenCalledWith(
      assetId,
      expect.any(AbortSignal),
    );
    expect(onAssetSelected).not.toHaveBeenCalled();

    fireEvent.click(
      await screen.findByRole("button", { name: "اختيار هذا الوسيط" }),
    );
    await waitFor(() => {
      expect(onAssetSelected).toHaveBeenCalledWith(assetId);
    });
    expect(container.querySelector('[dir="rtl"]')).toBeInTheDocument();
  });

  it("reports an uploaded candidate separately from its later parent binding", async () => {
    const onAssetSelected = vi.fn();
    mediaApiMock.upload.mockResolvedValue({ id: "asset-uploaded" });
    render(
      <AdminMediaCandidatePicker
        mediaClass="work_cover"
        label="رفع غلاف جديد"
        onAssetSelected={onAssetSelected}
      />,
      { wrapper },
    );
    fireEvent.change(screen.getByLabelText("رفع غلاف جديد"), {
      target: {
        files: [new File(["cover"], "cover.jpg", { type: "image/jpeg" })],
      },
    });
    await screen.findByText(/حُفظت الصورة في الوسائط فقط/u);
    await waitFor(() => {
      expect(onAssetSelected).toHaveBeenCalledWith("asset-uploaded");
    });
    fireEvent.click(
      screen.getByRole("button", { name: /إزالة المعاينة المحلية/u }),
    );
    expect(onAssetSelected).toHaveBeenLastCalledWith(null);
  });

  it("keeps a rejected candidate visible and starts a new attempt for the same file", async () => {
    mediaApiMock.upload
      .mockRejectedValueOnce(new Error("uncertain"))
      .mockResolvedValueOnce({ id: "asset-two" });
    mediaApiMock.getAttempt.mockResolvedValue({
      state: "rejected",
      assetId: null,
      safeFailureCode: "UPLOAD_INCOMPLETE",
    });
    renderPicker();
    const file = new File(["cover"], "cover.jpg", { type: "image/jpeg" });
    fireEvent.change(screen.getByLabelText("رفع غلاف جديد"), {
      target: { files: [file] },
    });

    fireEvent.click(
      await screen.findByRole("button", { name: "إعادة رفع الصورة المختارة" }),
    );

    expect(screen.getByRole("img", { name: /معاينة مؤقتة/u })).toBeVisible();
    await waitFor(() => {
      expect(mediaApiMock.upload).toHaveBeenCalledTimes(2);
    });
    expect(mediaApiMock.upload.mock.calls[1]?.[1]).toBe(file);
    expect(mediaApiMock.upload.mock.calls[1]?.[2]).not.toBe(
      mediaApiMock.upload.mock.calls[0]?.[2],
    );
  });
});

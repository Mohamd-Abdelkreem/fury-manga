import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AvatarPicker } from "./AvatarPicker";

const mediaApiMock = vi.hoisted(() => ({
  upload: vi.fn(),
  getAttempt: vi.fn(),
  getAsset: vi.fn(),
  readContent: vi.fn(),
  listMine: vi.fn(),
  removeAvatar: vi.fn(),
}));
const sessionMock = vi.hoisted(() => ({ status: "ACTIVE" }));

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({
    data: {
      user: {
        id: "11111111-1111-4111-8111-111111111111",
        fullName: "سلمى القارئة",
        role: "USER",
        status: sessionMock.status,
        emailVerifiedAt: "2026-09-23T10:00:00.000Z",
      },
    },
  }),
}));
vi.mock("@/features/media/api/media.api", () => ({
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
const renderPicker = () => render(<AvatarPicker />, { wrapper });

describe("AvatarPicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    sessionMock.status = "ACTIVE";
    mediaApiMock.listMine.mockResolvedValue({ items: [] });
    mediaApiMock.readContent.mockResolvedValue(new Blob(["private-avatar"]));
    mediaApiMock.removeAvatar.mockResolvedValue({
      id: "asset-one",
      status: "removed",
    });
    URL.createObjectURL = vi
      .fn()
      .mockReturnValueOnce("blob:temporary-avatar")
      .mockReturnValue("blob:accepted-avatar");
    URL.revokeObjectURL = vi.fn();
  });

  it("uploads a supported image and labels the result as a private candidate", async () => {
    mediaApiMock.upload.mockResolvedValue({ id: "asset-one" });
    renderPicker();
    const input = screen.getByLabelText("اختيار صورة", { selector: "input" });
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      await screen.findByText(
        "تم حفظ الصورة كمرشح خاص. لم تُحدد بعد كصورة الحساب.",
      ),
    ).toBeInTheDocument();
    expect(mediaApiMock.upload).toHaveBeenCalledWith(
      "user_avatar",
      file,
      expect.any(String),
      expect.any(Object),
    );
    expect(
      screen.getByAltText("معاينة مرشح صورة الحساب المحفوظ"),
    ).toHaveAttribute("src", "blob:accepted-avatar");
    fireEvent.click(
      screen.getByRole("button", { name: "إزالة الصورة المختارة" }),
    );
    await waitFor(() => {
      expect(mediaApiMock.removeAvatar).toHaveBeenCalled();
    });
    expect(input).toHaveFocus();
  });

  it("validates files and enforces an active verified session before upload", () => {
    const { unmount } = renderPicker();
    const input = screen.getByLabelText("اختيار صورة", { selector: "input" });
    fireEvent.change(input, {
      target: {
        files: [new File(["gif"], "avatar.gif", { type: "image/gif" })],
      },
    });
    expect(screen.getByRole("alert")).toHaveTextContent("JPG أو PNG أو WebP");
    const oversized = new File(
      [new Uint8Array(4 * 1024 * 1024 + 1)],
      "avatar.png",
      { type: "image/png" },
    );
    fireEvent.change(input, { target: { files: [oversized] } });
    expect(screen.getByRole("alert")).toHaveTextContent("4 ميجابايت");
    expect(mediaApiMock.upload).not.toHaveBeenCalled();
    unmount();

    mediaApiMock.listMine.mockClear();
    sessionMock.status = "SUSPENDED";
    renderPicker();
    expect(screen.getByRole("alert")).toHaveTextContent("يلزم حساب نشط وموثق");
    expect(
      screen.getByLabelText("اختيار صورة", { selector: "input" }),
    ).toBeDisabled();
    expect(mediaApiMock.listMine).not.toHaveBeenCalled();
  });

  it("shows server processing with the temporary preview and aborts the upload", async () => {
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
    fireEvent.change(
      screen.getByLabelText("اختيار صورة", { selector: "input" }),
      {
        target: {
          files: [new File(["avatar"], "avatar.png", { type: "image/png" })],
        },
      },
    );
    await waitFor(() => {
      expect(reportProgress).toBeTypeOf("function");
    });
    reportProgress?.(100);
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("اكتمل نقل الملف");
    });
    expect(screen.getByAltText(/معاينة مؤقتة/u)).toHaveAttribute(
      "src",
      "blob:temporary-avatar",
    );
    fireEvent.click(screen.getByRole("button", { name: /إلغاء الرفع/u }));
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "لم تصل نتيجة نهائية",
      );
    });
  });

  it("loads a durable candidate through the real query and candidate hooks", async () => {
    const assetId = "43afae94-0e94-45e9-ab76-100f889d0777";
    mediaApiMock.listMine.mockResolvedValue({
      items: [{ id: assetId, width: 256, height: 256 }],
    });
    mediaApiMock.getAsset.mockResolvedValue({ id: assetId });
    renderPicker();

    fireEvent.click(
      await screen.findByRole("button", { name: /معاينة المرشح/u }),
    );

    await waitFor(() => {
      expect(screen.getByAltText(/معاينة مرشح/u)).toHaveAttribute(
        "src",
        "blob:temporary-avatar",
      );
    });
    expect(mediaApiMock.getAsset).toHaveBeenCalledWith(
      assetId,
      expect.any(AbortSignal),
    );
  });

  it("keeps a rejected candidate visible and retries the same file with a new attempt", async () => {
    mediaApiMock.upload
      .mockRejectedValueOnce(new Error("uncertain"))
      .mockResolvedValueOnce({ id: "asset-two" });
    mediaApiMock.getAttempt.mockResolvedValue({
      state: "rejected",
      assetId: null,
      safeFailureCode: "UPLOAD_INCOMPLETE",
    });
    renderPicker();
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    fireEvent.change(
      screen.getByLabelText("اختيار صورة", { selector: "input" }),
      {
        target: { files: [file] },
      },
    );

    fireEvent.click(
      await screen.findByRole("button", { name: "إعادة رفع الصورة المختارة" }),
    );

    expect(screen.getByAltText(/معاينة مؤقتة/u)).toBeVisible();
    await waitFor(() => {
      expect(mediaApiMock.upload).toHaveBeenCalledTimes(2);
    });
    expect(mediaApiMock.upload.mock.calls[1]?.[1]).toBe(file);
    expect(mediaApiMock.upload.mock.calls[1]?.[2]).not.toBe(
      mediaApiMock.upload.mock.calls[0]?.[2],
    );
  });
});

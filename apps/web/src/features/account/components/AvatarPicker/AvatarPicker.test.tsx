import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AvatarPicker } from "./AvatarPicker";

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({ data: { user: { fullName: "سلمى القارئة" } } }),
}));

describe("AvatarPicker", () => {
  beforeEach(() => {
    Object.defineProperties(URL, {
      createObjectURL: {
        configurable: true,
        value: vi.fn(() => "blob:avatar-preview"),
      },
      revokeObjectURL: {
        configurable: true,
        value: vi.fn(),
      },
    });
  });

  it("previews a supported local image and resets it without claiming persistence", () => {
    render(<AvatarPicker />);
    const input = screen.getByLabelText("اختيار صورة", { selector: "input" });
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });
    expect(
      screen.getByAltText("معاينة صورة الحساب المختارة"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/تُعرض معاينة محلية للملف: avatar.png/),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "إزالة المعاينة" }));
    expect(
      screen.queryByAltText("معاينة صورة الحساب المختارة"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("لا توجد صورة محلية مختارة.")).toBeInTheDocument();
  });

  it("rejects unsupported image types", () => {
    render(<AvatarPicker />);
    const input = screen.getByLabelText("اختيار صورة", { selector: "input" });
    fireEvent.change(input, {
      target: {
        files: [new File(["gif"], "avatar.gif", { type: "image/gif" })],
      },
    });
    expect(screen.getByRole("alert")).toHaveTextContent("JPG أو PNG أو WebP");
  });
});

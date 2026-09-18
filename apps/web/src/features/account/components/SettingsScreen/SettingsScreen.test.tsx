import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SettingsScreen } from "./SettingsScreen";

vi.mock("@/features/users/components/profile-form", () => ({
  ProfileForm: () => <div>نموذج اسم العرض</div>,
}));
vi.mock("@/features/account/components/AvatarPicker/AvatarPicker", () => ({
  AvatarPicker: () => <div>معاينة الصورة المحلية</div>,
}));
vi.mock(
  "@/features/account/components/AppearanceSettings/AppearanceSettings",
  () => ({
    AppearanceSettings: () => (
      <>
        <section id="avatar-frame">اختيار إطار الصورة</section>
        <section id="comment-decoration">اختيار زخرفة التعليق</section>
      </>
    ),
  }),
);
vi.mock("../password-form", () => ({
  PasswordForm: () => <div>نموذج تغيير كلمة المرور</div>,
}));
vi.mock("../session-controls", () => ({
  SessionControls: () => <div>تسجيل خروج هذه الجلسة وكل الجلسات</div>,
}));

describe("SettingsScreen", () => {
  it("exposes keyboard-native deep links and keeps account security controls mounted", () => {
    render(<SettingsScreen />);

    expect(screen.getByRole("link", { name: /الحساب/ })).toHaveAttribute(
      "href",
      "#account",
    );
    expect(screen.getByRole("link", { name: /الأمان/ })).toHaveAttribute(
      "href",
      "#security",
    );
    expect(screen.getByRole("link", { name: /إطار الصورة/ })).toHaveAttribute(
      "href",
      "#avatar-frame",
    );
    expect(screen.getByRole("link", { name: /زخرفة التعليق/ })).toHaveAttribute(
      "href",
      "#comment-decoration",
    );
    expect(screen.getByText("نموذج تغيير كلمة المرور")).toBeInTheDocument();
    expect(
      screen.getByText("تسجيل خروج هذه الجلسة وكل الجلسات"),
    ).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppearanceSettings } from "./AppearanceSettings";

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({ data: { user: { fullName: "سلمى القارئة" } } }),
}));

describe("AppearanceSettings", () => {
  it("selects one avatar frame or no frame and keeps revoked gifts unavailable", () => {
    render(<AppearanceSettings />);

    const noFrame = screen.getByRole("radio", { name: /بلا إطار/ });
    const nightFrame = screen.getByRole("radio", { name: /قارئ الليل/ });
    const revokedFrame = screen.getByRole("radio", { name: /شارة المؤسس/ });
    expect(revokedFrame).toBeDisabled();

    fireEvent.click(noFrame);
    expect(noFrame).toBeChecked();
    expect(
      screen.getByText(/الإطار المختار حاليًا: بلا إطار/),
    ).toBeInTheDocument();

    fireEvent.click(nightFrame);
    expect(nightFrame).toBeChecked();
    expect(noFrame).not.toBeChecked();
  });

  it("selects a comment decoration, supports the default, and disables stopped gifts", () => {
    render(<AppearanceSettings />);

    const defaultDesign = screen.getByRole("radio", {
      name: /التصميم الافتراضي/,
    });
    const golden = screen.getByRole("radio", { name: /الفصل الذهبي/ });
    const stopped = screen.getByRole("radio", { name: /حبر الأرشيف/ });
    expect(stopped).toBeDisabled();

    fireEvent.click(defaultDesign);
    expect(defaultDesign).toBeChecked();
    fireEvent.click(golden);
    expect(golden).toBeChecked();
    expect(defaultDesign).not.toBeChecked();
    expect(
      screen.getByLabelText(/معاينة تعليق، الفصل الذهبي/),
    ).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PrivacyPolicyPage } from "./PrivacyPolicyPage";

vi.mock("@/features/home/components/Navbar/Navbar", () => ({
  Navbar: () => <nav>Fury</nav>,
}));
vi.mock("@/features/home/components/Footer/Footer", () => ({
  Footer: () => <footer>Fury footer</footer>,
}));

describe("PrivacyPolicyPage", () => {
  it("renders a complete heading structure, approval boundary, and internal section links", () => {
    render(<PrivacyPolicyPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "سياسة الخصوصية" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "اعتماد قانوني مطلوب" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "العلاقة مع مزود الإعلانات" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "الاحتفاظ والقيود على الحذف" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /معلومات الحساب/ }),
    ).toHaveAttribute("href", "#account-information");
    expect(screen.getByRole("link", { name: "اتصل بنا" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(
      screen.getByRole("link", { name: "الإبلاغ عن مشكلة" }),
    ).toHaveAttribute("href", "/report-issue");
  });
});

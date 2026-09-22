import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TermsPage } from "./TermsPage";

vi.mock("@/features/home/components/Navbar/Navbar", () => ({
  Navbar: () => <nav>Fury</nav>,
}));
vi.mock("@/features/home/components/Footer/Footer", () => ({
  Footer: () => <footer>Fury footer</footer>,
}));

describe("TermsPage", () => {
  it("renders heading structure, legal draft approval note, and sections", () => {
    render(<TermsPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "الشروط والأحكام" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "اعتماد قانوني مطلوب" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "قبول الشروط والأحكام" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/نقاط/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /مسؤوليات الحساب/ }),
    ).toHaveAttribute("href", "#account-responsibilities");
    expect(
      screen.getByRole("link", { name: "سياسة حقوق النشر" }),
    ).toHaveAttribute("href", "/copyright");
    expect(screen.getByRole("link", { name: "اتصل بنا" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});

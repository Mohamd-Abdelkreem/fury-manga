import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CopyrightPage } from "./CopyrightPage";

vi.mock("@/features/home/components/Navbar/Navbar", () => ({
  Navbar: () => <nav>Fury</nav>,
}));
vi.mock("@/features/home/components/Footer/Footer", () => ({
  Footer: () => <footer>Fury footer</footer>,
}));

describe("CopyrightPage", () => {
  it("renders heading structure, approval notice, takedown checklist, and submission link", () => {
    render(<CopyrightPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "سياسة حقوق الملكية والنشر",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "اعتماد قانوني مطلوب" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "احترام حقوق الملكية الفكرية" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "البيانات الإلزامية لتقديم بلاغ انتهاك الحقوق",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("قائمة التحقق السريعة لتقديم بلاغ معتمد"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /شروط وضوابط طلبات إزالة المحتوى/ }),
    ).toHaveAttribute("href", "#takedown-conditions");
    expect(
      screen.getByRole("link", { name: /تقديم إخطار عبر صفحة التواصل/ }),
    ).toHaveAttribute("href", "/contact");
    expect(
      screen.getByRole("link", { name: "شروط الاستخدام" }),
    ).toHaveAttribute("href", "/terms");
  });
});

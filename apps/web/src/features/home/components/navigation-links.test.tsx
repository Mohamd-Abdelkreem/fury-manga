import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "./Footer/Footer";
import { Navbar } from "./Navbar/Navbar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/stories",
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({ data: null }),
}));

describe("shared navigation destinations", () => {
  it("exposes equivalent real category and text-story destinations without placeholder links", () => {
    const { container } = render(
      <>
        <Navbar />
        <Footer />
      </>,
    );
    expect(
      screen.getAllByRole("link", { name: "التصنيفات" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "الروايات والقصص النصية" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "اتصل بنا" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(
      screen.getByRole("link", { name: "الإبلاغ عن مشكلة" }),
    ).toHaveAttribute("href", "/report-issue");
    expect(
      screen.getByRole("link", { name: "سياسة الخصوصية" }),
    ).toHaveAttribute("href", "/privacy");
    expect(container.querySelector('a[href="#"]')).toBeNull();
  });

  it("closes the mobile disclosure with Escape and restores its expanded state", () => {
    render(<Navbar />);
    const trigger = screen.getByRole("button", { name: "فتح قائمة التنقل" });
    fireEvent.click(trigger);
    expect(
      screen.getByRole("button", { name: "إغلاق قائمة التنقل" }),
    ).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.getByRole("button", { name: "فتح قائمة التنقل" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});

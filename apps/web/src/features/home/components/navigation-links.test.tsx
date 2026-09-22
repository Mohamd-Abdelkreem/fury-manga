import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "./Footer/Footer";
import { Navbar } from "./Navbar/Navbar";

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: () => "/stories",
  useRouter: () => ({ push: pushMock }),
}));
vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({ data: null }),
}));

describe("shared navigation destinations", () => {
  it("searches all works through discover and hides notifications from visitors", () => {
    render(<Navbar />);
    const search = screen.getByLabelText("البحث في جميع الأعمال");
    fireEvent.change(search, { target: { value: "Trait Hoarder" } });
    const form = search.closest("form");
    expect(form).not.toBeNull();
    if (form !== null) fireEvent.submit(form);
    expect(pushMock).toHaveBeenCalledWith("/discover?q=Trait%20Hoarder");
    expect(
      screen.queryByRole("button", { name: /الإشعارات/ }),
    ).not.toBeInTheDocument();
  });

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

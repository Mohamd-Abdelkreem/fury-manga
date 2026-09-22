import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminGifts } from "./AdminGifts";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    ...props
  }: {
    alt: string;
    src: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} {...props} />
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/gifts",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminGifts Component", () => {
  it("renders gifts catalog header, stat cards, and gift cards", () => {
    render(
      <AdminDataProvider>
        <AdminGifts />
      </AdminDataProvider>,
    );

    expect(screen.getByText("إجمالي التصاميم")).toBeInTheDocument();
    expect(screen.getByText("إطارات الصور الشخصية")).toBeInTheDocument();
    expect(screen.getByText("زخارف التعليقات")).toBeInTheDocument();
    expect(screen.getByText("إجمالي المستلمين")).toBeInTheDocument();

    // Gift cards rendered from fixtures
    expect(screen.getByText("حلقة اللهب")).toBeInTheDocument();
    expect(screen.getByText("الفصل الذهبي")).toBeInTheDocument();
  });

  it("filters gifts by search query", () => {
    render(
      <AdminDataProvider>
        <AdminGifts />
      </AdminDataProvider>,
    );

    const searchInput = screen.getByLabelText("البحث عن هدية");

    fireEvent.change(searchInput, { target: { value: "الذهبي" } });

    expect(screen.getByText("الفصل الذهبي")).toBeInTheDocument();
    expect(screen.queryByText("حلقة اللهب")).not.toBeInTheDocument();
  });

  it("filters gifts by type", () => {
    render(
      <AdminDataProvider>
        <AdminGifts />
      </AdminDataProvider>,
    );

    const typeSelect = screen.getByLabelText("تصفية حسب نوع الهدية");

    fireEvent.change(typeSelect, { target: { value: "comment_decoration" } });

    expect(screen.getByText("الفصل الذهبي")).toBeInTheDocument();
    expect(screen.queryByText("حلقة اللهب")).not.toBeInTheDocument();
  });

  it("opens create gift dialog and creates a new gift design", () => {
    render(
      <AdminDataProvider>
        <AdminGifts />
      </AdminDataProvider>,
    );

    const createBtn = screen.getByRole("button", { name: "إضافة تصميم جديد" });
    fireEvent.click(createBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("إضافة تصميم هدية جديد")).toBeInTheDocument();

    // Fill form
    const nameInput = screen.getByLabelText("اسم الهدية");
    fireEvent.change(nameInput, { target: { value: "تاج التنين الأسود" } });

    const descInput = screen.getByLabelText("وصف الهدية");
    fireEvent.change(descInput, {
      target: { value: "إطار ملكي مرصع بالياقوت" },
    });

    const submitBtn = screen.getByRole("button", { name: "إنشاء التصميم" });
    fireEvent.click(submitBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("تصميم جديد")).toBeInTheDocument();
    expect(screen.getByText("تاج التنين الأسود")).toBeInTheDocument();
  });

  it("toggles active status of a gift", () => {
    render(
      <AdminDataProvider>
        <AdminGifts />
      </AdminDataProvider>,
    );

    const toggleBtn = screen.getByRole("button", {
      name: "تغيير حالة حلقة اللهب",
    });
    fireEvent.click(toggleBtn);

    expect(screen.getByText("تغيير حالة الهدية")).toBeInTheDocument();
  });

  it("opens gift preview modal", () => {
    render(
      <AdminDataProvider>
        <AdminGifts />
      </AdminDataProvider>,
    );

    const previewBtn = screen.getByRole("button", {
      name: "معاينة حلقة اللهب",
    });
    fireEvent.click(previewBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/محاكاة الواجهة الحقيقية/)).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "إغلاق" });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

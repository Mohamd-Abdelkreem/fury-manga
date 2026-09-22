import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminContactDetail } from "./AdminContactDetail";

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

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/contact/msg-1",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AdminContactDetail Component", () => {
  it("renders message details, sender info, and action panels", () => {
    render(
      <AdminDataProvider>
        <AdminContactDetail messageId="msg-1" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("عمر الفاروق")).toBeInTheDocument();
    expect(screen.getByText("omar.farouk@example.com")).toBeInTheDocument();
    expect(
      screen.getByText("طلب انضمام لفريق الترجمة والتبييض"),
    ).toBeInTheDocument();
    expect(screen.getByText(/أنا مترجم ذو خبرة 3 سنوات/)).toBeInTheDocument();

    // Mailto reply button
    const replyLink = screen.getByRole("link", {
      name: /الرد عبر البريد الإلكتروني/,
    });
    expect(replyLink).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:omar.farouk@example.com"),
    );

    // Flip nav buttons
    expect(screen.getByText("السابقة")).toBeInTheDocument();
    expect(screen.getByText("التالية")).toBeInTheDocument();
  });

  it("changes status using the select dropdown", () => {
    render(
      <AdminDataProvider>
        <AdminContactDetail messageId="msg-1" />
      </AdminDataProvider>,
    );

    const statusSelect = screen.getByLabelText("تغيير حالة الرسالة");
    fireEvent.change(statusSelect, { target: { value: "resolved" } });

    expect(statusSelect).toHaveValue("resolved");
  });

  it("updates and saves internal supervisor notes", () => {
    render(
      <AdminDataProvider>
        <AdminContactDetail messageId="msg-2" />
      </AdminDataProvider>,
    );

    const noteTextarea = screen.getByLabelText("ملاحظات المشرف الداخلية");
    expect(noteTextarea).toHaveValue(
      "فكرة ممتازة، سيتم إدراجها ضمن تحديث شجرة التصنيفات القادم.",
    );

    fireEvent.change(noteTextarea, {
      target: {
        value: "تم الاتفاق مع المطور على إضافة التصنيف في الإصدار القادم.",
      },
    });

    const saveBtn = screen.getByRole("button", { name: "حفظ الملاحظة" });
    fireEvent.click(saveBtn);

    expect(screen.getByText("تم الحفظ بنجاح ✓")).toBeInTheDocument();
  });

  it("renders not found state for invalid messageId", () => {
    render(
      <AdminDataProvider>
        <AdminContactDetail messageId="non-existent-msg-id" />
      </AdminDataProvider>,
    );

    expect(screen.getByText("الرسالة غير موجودة")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /العودة لصندوق الرسائل/ }),
    ).toHaveAttribute("href", "/admin/contact");
  });
});

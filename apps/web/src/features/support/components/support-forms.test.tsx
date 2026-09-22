import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ContactForm } from "./ContactForm/ContactForm";
import { IssueReportForm } from "./IssueReportForm/IssueReportForm";

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({ data: null }),
}));

describe("public support forms", () => {
  it("shows field-level contact validation then reaches a safe success state", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "تسجيل الطلب" }));
    expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(4);

    fireEvent.change(screen.getByLabelText("الاسم"), {
      target: { value: "سلمى" },
    });
    fireEvent.change(screen.getByLabelText("البريد الإلكتروني"), {
      target: { value: "salma@example.com" },
    });
    fireEvent.change(screen.getByLabelText("الموضوع"), {
      target: { value: "استفسار عن الحساب" },
    });
    fireEvent.change(screen.getByLabelText("الرسالة"), {
      target: { value: "هذه رسالة واضحة تتجاوز الحد الأدنى المطلوب للاختبار." },
    });
    fireEvent.click(screen.getByRole("button", { name: "تسجيل الطلب" }));

    expect(
      await screen.findByRole("heading", { name: "تم تسجيل طلبك" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/تم تسجيل طلبك بنجاح/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "كتابة رسالة أخرى" }));
    expect(
      screen.getByRole("button", { name: "تسجيل الطلب" }),
    ).toBeInTheDocument();
  });

  it("prefills the report URL, validates the form, and never invents a ticket", async () => {
    render(<IssueReportForm initialUrl="/story/trait-hoarder/chapter/43" />);
    expect(
      screen.getByLabelText("رابط الصفحة أو العمل أو الفصل أو التعليق"),
    ).toHaveValue("/story/trait-hoarder/chapter/43");

    fireEvent.click(screen.getByRole("button", { name: "تسجيل البلاغ" }));
    expect(screen.getByText("اختر نوع المشكلة.")).toBeInTheDocument();
    expect(screen.getByText(/اكتب وصفًا من 30 حرفًا/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("نوع المشكلة"), {
      target: { value: "broken-image" },
    });
    fireEvent.change(screen.getByLabelText("وصف المشكلة"), {
      target: {
        value:
          "الصورة الثالثة في الفصل لا تظهر بينما بقية الصور تعمل بصورة طبيعية.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "تسجيل البلاغ" }));

    expect(
      await screen.findByRole("heading", { name: "تم تسجيل البلاغ" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/تم تسجيل بلاغك بنجاح/)).toBeInTheDocument();
    expect(screen.queryByText(/رقم تذكرة:/)).not.toBeInTheDocument();
  });
});

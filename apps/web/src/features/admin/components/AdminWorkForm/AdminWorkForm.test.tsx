import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import type { AdminWork } from "../../types/admin.types";
import { AdminWorkForm } from "./AdminWorkForm";

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

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/works/new",
  useRouter: () => ({ push: mockPush }),
}));

describe("AdminWorkForm Component", () => {
  it("renders in create mode with empty fields and default genres", () => {
    render(
      <AdminDataProvider>
        <AdminWorkForm mode="create" />
      </AdminDataProvider>,
    );

    expect(screen.getByLabelText(/عنوان العمل بالعربية/)).toHaveValue("");
    expect(screen.getByLabelText(/نبذة \/ قصة العمل/)).toHaveValue("");
    expect(
      screen.getByRole("button", { name: "حفظ كمسودة" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "نشر العمل الآن" }),
    ).toBeInTheDocument();
  });

  it("validates required fields on submission", async () => {
    render(
      <AdminDataProvider>
        <AdminWorkForm mode="create" />
      </AdminDataProvider>,
    );

    const publishBtn = screen.getByRole("button", { name: "نشر العمل الآن" });
    fireEvent.click(publishBtn);

    expect(
      await screen.findByText("يرجى إدخال عنوان العمل بالعربية."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("يرجى كتابة نبذة توضيحية عن العمل."),
    ).toBeInTheDocument();
    expect(screen.getByText("يرجى إدخال اسم المؤلف.")).toBeInTheDocument();
  });

  it("updates live SEO preview when title and description are typed", () => {
    render(
      <AdminDataProvider>
        <AdminWorkForm mode="create" />
      </AdminDataProvider>,
    );

    const titleInput = screen.getByLabelText(/عنوان العمل بالعربية/);
    fireEvent.change(titleInput, { target: { value: "عمل تجريبي جديد" } });

    const descInput = screen.getByLabelText(/نبذة \/ قصة العمل/);
    fireEvent.change(descInput, {
      target: { value: "هذه قصة تجريبية ممتعة ومشوقة للغاية لاختبار المعاينة" },
    });

    expect(screen.getByText("عمل تجريبي جديد | منصة Fury")).toBeInTheDocument();
    expect(
      screen.getByText("https://fury.local › story › عمل-تجريبي-جديد"),
    ).toBeInTheDocument();
  });

  it("populates initial values in edit mode and displays identity banner", () => {
    const mockWork: AdminWork = {
      id: "work-test-edit",
      title: "عمل التحرير التجريبي",
      alternativeTitle: "Test Edit Work",
      type: "manga",
      storyStatus: "completed",
      publishStatus: "published",
      description: "وصف طويل وكافٍ لاختبار شاشة تعديل العمل الفني.",
      author: "مؤلف تجريبي",
      artist: "رسام تجريبي",
      genres: ["غموض", "دراما"],
      tags: ["تحقيق", "تشويق"],
      coverImage: "/anime/01.jpg",
      bannerImage: "/anime/02.jpg",
      chapterCount: 42,
      views: 12000,
      createdAt: "2026-01-01",
      updatedAt: "2026-02-01",
    };

    render(
      <AdminDataProvider>
        <AdminWorkForm mode="edit" initialWork={mockWork} />
      </AdminDataProvider>,
    );

    expect(screen.getByText("المعرّف: work-test-edit")).toBeInTheDocument();
    expect(screen.getByLabelText(/عنوان العمل بالعربية/)).toHaveValue(
      "عمل التحرير التجريبي",
    );
    expect(
      screen.getByRole("button", { name: "حفظ التعديلات" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "إلغاء النشر" }),
    ).toBeInTheDocument();
  });
});

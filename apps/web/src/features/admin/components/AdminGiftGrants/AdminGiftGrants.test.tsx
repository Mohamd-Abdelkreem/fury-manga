import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataProvider } from "../../context/admin-context";
import { AdminGiftGrants } from "./AdminGiftGrants";

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
  usePathname: () => "/admin/gifts/grants",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "gift") return "ember-ring";
      if (key === "user") return "user-2";
      return null;
    },
  }),
}));

describe("AdminGiftGrants Component", () => {
  it("renders page tabs, grant forms, and grant history table", () => {
    render(
      <AdminDataProvider>
        <AdminGiftGrants />
      </AdminDataProvider>,
    );

    expect(screen.getByText("منح فردي لمستخدم محدد")).toBeInTheDocument();
    expect(screen.getByText("منح جماعي عام")).toBeInTheDocument();
    expect(screen.getByText("سجل منح الهدايا التقديرية")).toBeInTheDocument();
  });

  it("detects duplicate ownership and shows warning with disabled submit button", () => {
    // user-2 (سارة العتيبي) already owns "ember-ring" (حلقة اللهب)
    render(
      <AdminDataProvider>
        <AdminGiftGrants />
      </AdminDataProvider>,
    );

    expect(
      screen.getByText(/يمتلك هدية «حلقة اللهب» مسبقاً/),
    ).toBeInTheDocument();
    const submitBtn = screen.getByRole("button", { name: "تأكيد ومنح الهدية" });
    expect(submitBtn).toBeDisabled();
  });

  it("allows granting a gift when the user does not already own it", () => {
    render(
      <AdminDataProvider>
        <AdminGiftGrants />
      </AdminDataProvider>,
    );

    // Change user to user-3 (كريم ممدوح) who does not own ember-ring
    const userSelect = screen.getByLabelText(/المستخدم المستلم/);
    fireEvent.change(userSelect, { target: { value: "user-3" } });

    expect(
      screen.queryByText(/يمتلك هدية «حلقة اللهب» مسبقاً/),
    ).not.toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: "تأكيد ومنح الهدية" });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    expect(screen.getByText("تم منح الهدية بنجاح")).toBeInTheDocument();
  });

  it("switches to bulk grant tab, renders live breakdown, and opens confirmation dialog", () => {
    render(
      <AdminDataProvider>
        <AdminGiftGrants />
      </AdminDataProvider>,
    );

    const bulkTab = screen.getByText("منح جماعي عام");
    fireEvent.click(bulkTab);

    expect(screen.getByText("حسابات المستلمين المؤهلين")).toBeInTheDocument();
    expect(screen.getByText("إجمالي المسجلين")).toBeInTheDocument();
    expect(screen.getByText("العدد النهائي للمستلمين")).toBeInTheDocument();

    const bulkGrantBtn = screen.getByRole("button", {
      name: /بدء المنح الجماعي/,
    });
    fireEvent.click(bulkGrantBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("تأكيد المنح الجماعي للهدايا")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: "تأكيد المنح للجميع",
    });
    fireEvent.click(confirmBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("تم المنح الجماعي بنجاح")).toBeInTheDocument();
  });
});

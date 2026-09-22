import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DASHBOARD_FIXTURE } from "@/features/workspace/data/dashboardData";

import { DashboardOverview } from "./DashboardOverview";

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({
    data: {
      user: {
        fullName: "سلمى القارئة",
        email: "salma@example.com",
        status: "ACTIVE",
      },
    },
  }),
}));

describe("DashboardOverview", () => {
  it("renders the real session identity with fixture product summaries and valid links", () => {
    render(<DashboardOverview />);

    expect(
      screen.getByRole("heading", { name: "مرحبًا، سلمى" }),
    ).toBeInTheDocument();
    expect(screen.getByText("salma@example.com")).toBeInTheDocument();
    expect(screen.getByText("الحساب نشط")).toBeInTheDocument();
    expect(screen.getByText("إشعارات غير مقروءة")).toBeInTheDocument();
    expect(screen.queryByText(/نقاط/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /أكمل القراءة/ })).toHaveAttribute(
      "href",
      "/story/trait-hoarder/chapter/43",
    );
    expect(
      screen.getByRole("link", { name: /عرض المكتبة كاملة/ }),
    ).toHaveAttribute("href", "/library");
    expect(screen.getByRole("link", { name: /إدارة الهدايا/ })).toHaveAttribute(
      "href",
      "/settings#avatar-frame",
    );
  });

  it("renders focused empty variants without removing recovery destinations", () => {
    render(
      <DashboardOverview
        summary={{
          ...DASHBOARD_FIXTURE,
          continueReading: [],
          savedWorks: [],
          bookmarkCount: 0,
          activeFrameId: null,
          activeDecorationId: null,
        }}
      />,
    );

    expect(
      screen.getByText("لا يوجد تقدم قراءة محفوظ في هذه الواجهة بعد."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("مكتبتك فارغة. احفظ عملًا لتراه هنا."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("لا توجد هدايا مملوكة أو اختيارات نشطة بعد."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "استكشف الأعمال المصوّرة" }),
    ).toHaveAttribute("href", "/discover");
  });
});

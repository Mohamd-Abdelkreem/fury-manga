import type { Metadata } from "next";

import { DashboardOverview } from "@/features/workspace/components/dashboard-overview";

export const metadata: Metadata = {
  title: "لوحة الحساب",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}

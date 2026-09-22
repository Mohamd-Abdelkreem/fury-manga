import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard/AdminDashboard";

export const metadata: Metadata = {
  title: "لوحة التحكم الرئيسية",
  description: "ملخص وإحصائيات المحتوى والأعمال في منصة Fury",
};

export default function DashboardPage() {
  return <AdminDashboard />;
}

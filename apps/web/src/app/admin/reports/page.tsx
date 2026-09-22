import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminReports } from "@/features/admin/components/AdminReports/AdminReports";

export const metadata: Metadata = {
  title: "إدارة البلاغات والمخالفات",
  description: "متابعة وفحص بلاغات القراء حول المحتوى المخالف في منصة Fury",
};

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "rgba(255,255,255,0.6)" }}>جاري تحميل البلاغات...</div>}>
      <AdminReports />
    </Suspense>
  );
}

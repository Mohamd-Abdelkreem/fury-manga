import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminComments } from "@/features/admin/components/AdminComments/AdminComments";

export const metadata: Metadata = {
  title: "إدارة التعليقات",
  description:
    "إدارة ومراقبة تعليقات القراء عبر جميع الفصول والأعمال في منصة Fury",
};

export default function AdminCommentsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", color: "rgba(255,255,255,0.6)" }}>
          جاري تحميل التعليقات...
        </div>
      }
    >
      <AdminComments />
    </Suspense>
  );
}

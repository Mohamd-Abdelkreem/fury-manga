import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader/AdminPageHeader";
import { AdminGiftGrants } from "@/features/admin/components/AdminGiftGrants/AdminGiftGrants";

export const metadata: Metadata = {
  title: "منح وسجل الهدايا",
  description: "إدارة عمليات منح الهدايا التقديرية الفردية والجماعية في منصة Fury",
};

export default function GiftGrantsPage() {
  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "تصاميم الهدايا", href: "/admin/gifts" },
          { label: "منح وسجل الهدايا" },
        ]}
        title="منح وسجل الهدايا التقديرية"
        description="تخصيص ومنح إطارات الصور والزخارف للأعضاء المتميزين بصورة فردية أو جماعية مع إرسال إشعارات مخصصة."
      />

      <Suspense fallback={<div style={{ padding: "2rem", color: "rgba(255,255,255,0.5)" }}>جاري تحميل نموذج المنح...</div>}>
        <AdminGiftGrants />
      </Suspense>
    </div>
  );
}

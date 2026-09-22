import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader/AdminPageHeader";
import { AdminGifts } from "@/features/admin/components/AdminGifts/AdminGifts";

export const metadata: Metadata = {
  title: "تصاميم الهدايا",
  description:
    "إدارة وتصميم إطارات الصور الشخصية وزخارف التعليقات في منصة Fury",
};

export default function GiftsManagementPage() {
  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "تصاميم الهدايا" },
        ]}
        title="إدارة تصاميم الهدايا"
        description="تخصيص وتصميم إطارات الصور الشخصية وزخارف التعليقات المتاحة لمنحها للمستخدمين والقراء المتميزين."
      />

      <AdminGifts />
    </div>
  );
}

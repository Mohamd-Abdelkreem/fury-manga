import type { Metadata } from "next";

import { AdminCategories } from "@/features/admin/components/AdminCategories/AdminCategories";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader/AdminPageHeader";

export const metadata: Metadata = { title: "إدارة التصنيفات" };

export default function AdminCategoriesPage() {
  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "التصنيفات" },
        ]}
        title="إدارة التصنيفات"
        description="تنظيم تصنيفات الأعمال وترتيب ظهورها وحالتها في صفحات التصفح."
      />
      <AdminCategories />
    </div>
  );
}

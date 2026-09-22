import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader/AdminPageHeader";
import { AdminWorkForm } from "@/features/admin/components/AdminWorkForm/AdminWorkForm";

export const metadata: Metadata = {
  title: "إضافة عمل جديد",
  description: "نموذج إضافة مانجا أو رواية جديدة في منصة Fury",
};

export default function CreateWorkPage() {
  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "الأعمال", href: "/admin/works" },
          { label: "إضافة عمل جديد" },
        ]}
        title="إضافة عمل جديد"
        description="أدخل بيانات العمل الجديد وحدد نوعه وتصنيفاته ووسائط الغلاف والبانر للنشر أو الحفظ كمسودة."
      />

      <AdminWorkForm mode="create" />
    </div>
  );
}

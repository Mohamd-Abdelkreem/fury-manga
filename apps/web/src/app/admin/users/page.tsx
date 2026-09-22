import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader/AdminPageHeader";
import { AdminUsers } from "@/features/admin/components/AdminUsers/AdminUsers";

export const metadata: Metadata = {
  title: "إدارة المستخدمين",
  description: "إدارة وتتبع حسابات المستخدمين والهدايا في منصة Fury",
};

export default function UsersManagementPage() {
  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "المستخدمين" },
        ]}
        title="إدارة المستخدمين"
        description="استعراض حسابات الأعضاء والتحكم في حالات النشاط، ومتابعة سجلات المشاهدة والهدايا التقديرية الممنوحة."
      />

      <AdminUsers />
    </div>
  );
}

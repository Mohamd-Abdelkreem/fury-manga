import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminDataProvider } from "@/features/admin/context/admin-context";
import { AdminLayout } from "@/features/admin/components/AdminLayout/AdminLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | لوحة إدارة Fury",
    default: "لوحة التحكم الإدارية | Fury Manga",
  },
  description: "لوحة تحكم المشرفين لإدارة المانجا والروايات والمستخدمين في منصة Fury",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AdminDataProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminDataProvider>
  );
}

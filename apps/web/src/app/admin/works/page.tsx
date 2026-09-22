import type { Metadata } from "next";
import { AdminWorks } from "@/features/admin/components/AdminWorks/AdminWorks";

export const metadata: Metadata = {
  title: "إدارة الأعمال والقصص",
  description: "استعراض وتصفية وتعديل المانجا والروايات والقصص المصورة",
};

export default function WorksManagementPage() {
  return <AdminWorks />;
}

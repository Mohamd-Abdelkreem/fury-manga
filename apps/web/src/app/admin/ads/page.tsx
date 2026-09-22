import type { Metadata } from "next";
import { AdminAds } from "@/features/admin/components/AdminAds/AdminAds";

export const metadata: Metadata = {
  title: "إعدادات الإعلانات",
  description:
    "إدارة موضعي البانر المعتمدين وحالة ربط مزود الإعلانات في منصة Fury",
};

export default function AdminAdsPage() {
  return <AdminAds />;
}

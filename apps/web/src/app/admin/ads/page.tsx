import type { Metadata } from "next";
import { AdminAds } from "@/features/admin/components/AdminAds/AdminAds";

export const metadata: Metadata = {
  title: "إعدادات الإعلانات",
  description: "إدارة المساحات الإعلانية ومفتاح الإعلانات العام وثوابت نظام النقاط في منصة Fury",
};

export default function AdminAdsPage() {
  return <AdminAds />;
}

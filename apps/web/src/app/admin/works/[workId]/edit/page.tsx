import type { Metadata } from "next";
import { AdminWorkEdit } from "@/features/admin/components/AdminWorkEdit/AdminWorkEdit";

interface PageProps {
  params: Promise<{ workId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { workId } = await params;
  return {
    title: `تعديل العمل (${workId})`,
    description: "تعديل تفاصيل وحالة العمل في لوحة إدارة Fury",
  };
}

export default async function WorkEditPage({ params }: PageProps) {
  const { workId } = await params;
  return <AdminWorkEdit workId={workId} />;
}

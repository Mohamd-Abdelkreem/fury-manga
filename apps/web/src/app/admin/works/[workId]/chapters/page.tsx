import type { Metadata } from "next";
import { AdminChapters } from "@/features/admin/components/AdminChapters/AdminChapters";

interface PageProps {
  params: Promise<{ workId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { workId } = await params;
  return {
    title: `إدارة الفصول (${workId})`,
    description: "إدارة واستعراض فصول العمل في لوحة إدارة Fury",
  };
}

export default async function ChaptersManagementPage({ params }: PageProps) {
  const { workId } = await params;
  return <AdminChapters workId={workId} />;
}

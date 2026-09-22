import type { Metadata } from "next";
import { AdminChapterForm } from "@/features/admin/components/AdminChapterForm/AdminChapterForm";

interface PageProps {
  params: Promise<{ workId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { workId } = await params;
  return {
    title: `إضافة فصل جديد (${workId})`,
    description: "نموذج إضافة فصل جديد لعمل في منصة Fury",
  };
}

export default async function NewChapterPage({ params }: PageProps) {
  const { workId } = await params;
  return <AdminChapterForm workId={workId} />;
}

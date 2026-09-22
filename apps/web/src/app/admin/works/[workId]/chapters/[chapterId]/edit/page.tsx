import type { Metadata } from "next";
import { AdminChapterForm } from "@/features/admin/components/AdminChapterForm/AdminChapterForm";

interface PageProps {
  params: Promise<{ workId: string; chapterId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { workId, chapterId } = await params;
  return {
    title: `تعديل الفصل (${chapterId}) - ${workId}`,
    description: "نموذج تعديل بيانات وصفحات الفصل في منصة Fury",
  };
}

export default async function EditChapterPage({ params }: PageProps) {
  const { workId, chapterId } = await params;
  return <AdminChapterForm workId={workId} chapterId={chapterId} />;
}

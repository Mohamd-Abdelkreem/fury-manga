import type { Metadata } from "next";
import { AdminContactDetail } from "@/features/admin/components/AdminContactDetail/AdminContactDetail";

interface PageProps {
  params: Promise<{ messageId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { messageId } = await params;
  return {
    title: `تفاصيل الرسالة (${messageId})`,
    description: "استعراض تفاصيل رسالة التواصل في لوحة إدارة Fury",
  };
}

export default async function ContactMessageDetailPage({ params }: PageProps) {
  const { messageId } = await params;
  return <AdminContactDetail messageId={messageId} />;
}

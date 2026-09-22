import type { Metadata } from "next";

import { IssueReportForm } from "@/features/support/components/IssueReportForm/IssueReportForm";
import { SupportPageLayout } from "@/features/support/components/SupportForm/SupportForm";

export const metadata: Metadata = {
  title: "الإبلاغ عن مشكلة",
  description: "الإبلاغ عن مشكلة في Fury.",
};

export default async function ReportIssuePage({
  searchParams,
}: PageProps<"/report-issue">) {
  const query = await searchParams;
  const queryUrl = query["url"];
  const url = Array.isArray(queryUrl) ? queryUrl[0] : queryUrl;

  return (
    <SupportPageLayout
      eyebrow="مساعدة Fury"
      title="الإبلاغ عن مشكلة"
      description="حدّد موضع المشكلة وأضف وصفًا واضحًا يساعد على إعادة حدوثها وفهم أثرها."
      asideTitle="هل تريد إرسال رسالة عامة؟"
      asideMessage="استخدم صفحة التواصل للأسئلة والرسائل التي لا ترتبط بعطل محدد."
      asideHref="/contact"
      asideLabel="الانتقال إلى اتصل بنا"
    >
      <IssueReportForm initialUrl={url ?? ""} />
    </SupportPageLayout>
  );
}

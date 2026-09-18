import type { Metadata } from "next";

import { ContactForm } from "@/features/support/components/ContactForm/ContactForm";
import { SupportPageLayout } from "@/features/support/components/SupportForm/SupportForm";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "نموذج تواصل محلي مع فريق Fury.",
};

export default function ContactPage() {
  return (
    <SupportPageLayout
      eyebrow="التواصل"
      title="اتصل بنا"
      description="اكتب رسالتك بوضوح. هذه المرحلة تنفّذ تجربة النموذج في الواجهة فقط ولا ترسل بريدًا أو طلبًا إلى الخادم."
      asideTitle="هل تواجه مشكلة محددة؟"
      asideMessage="استخدم نموذج الإبلاغ لإضافة نوع المشكلة والرابط المرتبط بها."
      asideHref="/report-issue"
      asideLabel="الإبلاغ عن مشكلة"
    >
      <ContactForm />
    </SupportPageLayout>
  );
}

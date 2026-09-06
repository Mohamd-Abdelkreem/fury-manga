import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { SessionLoader } from "@/components/auth/session-loader";
import { VerifyEmailPanel } from "@/features/auth/components/verify-email-panel";

export const metadata = { title: "تأكيد البريد الإلكتروني" };

export default function VerifyEmailPage() {
  return (
    <AuthShell
      eyebrow="تأكيد البريد الإلكتروني"
      title="أكّد بريدك الإلكتروني"
      summary="أكّد بريدك الإلكتروني باستخدام الرابط المرسل إليك لتفعيل حسابك على فيوري."
    >
      <Suspense fallback={<SessionLoader />}>
        <VerifyEmailPanel />
      </Suspense>
    </AuthShell>
  );
}

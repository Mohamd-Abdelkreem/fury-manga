import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { SessionLoader } from "@/components/auth/session-loader";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata = { title: "إعادة تعيين كلمة المرور" };

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="استعادة الحساب"
      title="اختر كلمة مرور جديدة"
      summary="استخدم رابط الاستعادة لتعيين كلمة مرور جديدة لحسابك على فيوري."
    >
      <Suspense fallback={<SessionLoader />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}

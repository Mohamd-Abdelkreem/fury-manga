import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata = { title: "نسيت كلمة المرور" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="استعادة الحساب"
      title="استعد حسابك"
      summary="أدخل بريدك الإلكتروني وسنرسل رابط الاستعادة إذا كان الحساب مؤهلاً للاستعادة."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}

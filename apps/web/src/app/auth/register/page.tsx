import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata = { title: "إنشاء حساب" };

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="انضم إلى فيوري"
      title="أنشئ حسابك"
      summary="انضم إلى مجتمع فيوري وتابع أعمالك المفضلة واحتفظ بتقدمك في القراءة."
    >
      <RegisterForm />
    </AuthShell>
  );
}

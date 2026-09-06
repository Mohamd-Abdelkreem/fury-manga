import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { SessionLoader } from "@/components/auth/session-loader";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = { title: "تسجيل الدخول" };

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="فيوري"
      title="مرحبًا بعودتك"
      summary="سجّل دخولك لمتابعة القراءة وإدارة مكتبتك على فيوري."
    >
      <Suspense fallback={<SessionLoader />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

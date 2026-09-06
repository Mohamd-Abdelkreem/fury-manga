import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { SessionLoader } from "@/components/auth/session-loader";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Fury Turbo"
      title="Welcome back"
      summary="Sign in to continue reading and manage your Fury library."
    >
      <Suspense fallback={<SessionLoader />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

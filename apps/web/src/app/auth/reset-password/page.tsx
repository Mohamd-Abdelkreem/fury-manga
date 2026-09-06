import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { SessionLoader } from "@/components/auth/session-loader";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password"
      summary="Use the one-time recovery link to secure your Fury account."
    >
      <Suspense fallback={<SessionLoader />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}

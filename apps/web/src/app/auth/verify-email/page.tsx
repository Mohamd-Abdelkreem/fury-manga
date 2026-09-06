import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { SessionLoader } from "@/components/auth/session-loader";
import { VerifyEmailPanel } from "@/features/auth/components/verify-email-panel";

export const metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <AuthShell
      eyebrow="Email verification"
      title="Verify your email"
      summary="Confirm your one-time link to activate your Fury account."
    >
      <Suspense fallback={<SessionLoader />}>
        <VerifyEmailPanel />
      </Suspense>
    </AuthShell>
  );
}

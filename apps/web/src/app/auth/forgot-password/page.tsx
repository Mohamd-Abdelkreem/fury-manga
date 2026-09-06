import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Recover your account"
      summary="Enter your email and we will send recovery instructions if an account is eligible."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}

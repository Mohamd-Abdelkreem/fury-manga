import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join Fury"
      title="Create your account"
      summary="Join the Fury community and keep your reading experience connected."
    >
      <RegisterForm />
    </AuthShell>
  );
}

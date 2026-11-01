import { Suspense, type ReactNode } from "react";

import { GuestOnlyRoute } from "@/components/auth/guest-only-route";
import { SessionLoader } from "@/components/auth/session-loader";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<SessionLoader />}>
      <GuestOnlyRoute>{children}</GuestOnlyRoute>
    </Suspense>
  );
}

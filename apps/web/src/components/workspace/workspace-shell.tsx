"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { SessionLoader } from "@/components/auth/session-loader";
import { useLogout, useSession } from "@/features/auth/hooks/auth.hooks";
import { replaceWithLogin } from "@/features/auth/utils/session-navigation";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { getApiError } from "@/services/api/api-client";

const navItems = [
  ["/dashboard", "My library"],
  ["/settings", "Account"],
] as const;

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const session = useSession();
  const logout = useLogout();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const user = session.data?.user ?? null;

  if (user === null) return <SessionLoader />;

  const signOut = (): void => {
    setLogoutError(null);
    logout.mutate(undefined, {
      onSuccess: () => {
        replaceWithLogin();
      },
      onError: (error: unknown) => {
        const apiError = getApiError(error);
        setLogoutError(
          apiError.message +
            " Server sign-out could not be confirmed. Your session may still be active.",
        );
      },
    });
  };

  return (
    <div className="workspace">
      <Navbar />
      <div className="workspace__accountbar">
        <div className="workspace__identity">
          <span className="workspace__avatar">
            {user.fullName.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>{user.fullName}</strong>
            <small>{user.email}</small>
          </div>
        </div>
        <nav className="workspace__actions" aria-label="Account navigation">
          {navItems.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <button type="button" onClick={signOut} disabled={logout.isPending}>
            {logout.isPending ? <>Ending{"\u2026"}</> : "Sign out"}
          </button>
        </nav>
      </div>
      {logoutError === null ? null : (
        <p role="alert" className="form-notice form-notice--error">
          {logoutError}
        </p>
      )}
      {children}
    </div>
  );
}

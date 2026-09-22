"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { SessionLoader } from "@/components/auth/session-loader";
import { useLogout, useSession } from "@/features/auth/hooks/auth.hooks";
import { replaceWithLogin } from "@/features/auth/utils/session-navigation";
import { getApiError } from "@/services/api/api-client";
import { cn } from "@/lib/utils";

import { WORKSPACE_NAV_ITEMS } from "./workspace-navigation";
import { WorkspaceNotifications } from "./workspace-notifications";
import { WorkspaceSidebar } from "./workspace-sidebar";

import styles from "./workspace-shell.module.css";

export function WorkspaceShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = useSession().data?.user ?? null;
  const logout = useLogout();
  const pathname = usePathname();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  useEffect(() => {
    const closeDrawer = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        mobileDrawerOpen &&
        !event.defaultPrevented
      ) {
        setMobileDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", closeDrawer);
    return () => {
      document.removeEventListener("keydown", closeDrawer);
    };
  }, [mobileDrawerOpen]);

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
          `${apiError.message} لم نتمكن من تأكيد تسجيل الخروج من الخادم؛ قد تظل جلستك نشطة.`,
        );
      },
    });
  };

  // Determine current page title
  const currentNav = WORKSPACE_NAV_ITEMS.find((item) => item.href === pathname);
  const pageTitle = currentNav?.label ?? "مساحة المستخدم";

  return (
    <div className={cn("workspace", styles["workspace"])}>
      {/* Skip to Content */}
      <a href="#main-content" className={styles["skipLink"]}>
        الانتقال إلى المحتوى الرئيسي
      </a>

      <WorkspaceSidebar
        pathname={pathname}
        fullName={user.fullName}
        email={user.email}
        isOpen={mobileDrawerOpen}
        isSigningOut={logout.isPending}
        onClose={() => {
          setMobileDrawerOpen(false);
        }}
        onSignOut={signOut}
      />

      {/* Main Content Area */}
      <div className={styles["mainWrapper"]}>
        {/* Top Bar */}
        <header className={styles["topBar"]}>
          <div className={styles["topBarRight"]}>
            <button
              type="button"
              className={styles["menuTrigger"]}
              onClick={() => {
                setMobileDrawerOpen(true);
              }}
              aria-label="فتح القائمة الجانبية"
            >
              <Menu size={20} />
            </button>
            <h1 className={styles["topBarTitle"]}>{pageTitle}</h1>
          </div>

          <div className={styles["topBarLeft"]}>
            <WorkspaceNotifications />

            {/* User Pill */}
            <div className={styles["userTopPill"]}>
              <span className={styles["pillDot"]} aria-hidden="true" />
              <span className={styles["pillName"]}>{user.fullName}</span>
            </div>
          </div>
        </header>

        {/* Error Alert */}
        {logoutError !== null && (
          <p
            role="alert"
            className={cn(
              "form-notice",
              "form-notice--error",
              styles["logoutErrorBanner"],
            )}
          >
            {logoutError}
          </p>
        )}

        {/* Content Body */}
        <div className={styles["contentArea"]}>{children}</div>
      </div>
    </div>
  );
}

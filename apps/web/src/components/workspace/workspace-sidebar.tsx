import { Compass, LogOut, X } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import styles from "./workspace-shell.module.css";

import { WORKSPACE_NAV_ITEMS } from "./workspace-navigation";

type Props = Readonly<{
  pathname: string;
  fullName: string;
  email: string;
  isOpen: boolean;
  isSigningOut: boolean;
  onClose: () => void;
  onSignOut: () => void;
}>;

export function WorkspaceSidebar({
  pathname,
  fullName,
  email,
  isOpen,
  isSigningOut,
  onClose,
  onSignOut,
}: Props) {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className={styles["backdrop"]}
          onClick={() => {
            onClose();
          }}
          aria-hidden="true"
        />
      )}

      {/* Right Sidebar (RTL) */}
      <aside
        className={cn(styles["sidebar"], isOpen && styles["sidebarOpen"])}
        aria-label="شريط التنقل الجانبي"
      >
        {/* Sidebar Header */}
        <div className={styles["sidebarHeader"]}>
          <Link
            href="/"
            className={styles["brandLogo"]}
            aria-label="Fury — الرئيسية"
          >
            <span className={styles["brandAccent"]}>F</span>
            <span>URY</span>
          </Link>
          <span className={styles["userBadge"]}>مساحة القارئ</span>
          <button
            type="button"
            className={styles["closeDrawerBtn"]}
            onClick={() => {
              onClose();
            }}
            aria-label="إغلاق القائمة"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Identity Card */}
        <div className={styles["identityCard"]}>
          <div className={styles["avatarCircle"]} aria-hidden="true">
            {fullName.slice(0, 1).toLocaleUpperCase("ar")}
          </div>
          <div className={styles["identityInfo"]}>
            <div className={styles["userName"]}>{fullName}</div>
            <div className={styles["userEmail"]}>{email}</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className={styles["navSection"]} aria-label="التنقل في الحساب">
          <span className={styles["navLabel"]}>لوحة التحكم</span>
          {WORKSPACE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  styles["navLink"],
                  isActive && styles["navLinkActive"],
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={onClose}
              >
                <Icon className={styles["navIcon"]} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className={styles["navDivider"]} />

          <span className={styles["navLabel"]}>الاستكشاف</span>
          <Link href="/" className={styles["navLink"]} onClick={onClose}>
            <Compass className={styles["navIcon"]} aria-hidden="true" />
            <span>العودة للموقع الرئيسي</span>
          </Link>
        </nav>

        {/* Sidebar Footer with Sign out */}
        <div className={styles["sidebarFooter"]}>
          <button
            type="button"
            className={styles["logoutBtn"]}
            onClick={onSignOut}
            disabled={isSigningOut}
          >
            <LogOut size={16} aria-hidden="true" />
            <span>{isSigningOut ? "جارٍ تسجيل الخروج…" : "تسجيل الخروج"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

"use client";

import React, { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Award,
  Bell,
  BookOpen,
  ExternalLink,
  Gift,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  MessageSquare,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminData } from "../../context/admin-context";
import styles from "./AdminLayout.module.css";

interface NavGroupItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string | undefined }>;
  count?: number | undefined;
}

interface NavGroup {
  title: string;
  items: NavGroupItem[];
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, metrics, activities, contactMessages, reports } = useAdminData();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const closeNav = () => {
    setSidebarOpen(false);
    setNotifOpen(false);
  };

  // Handle Escape key to close mobile drawer or notifications
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (notifOpen) {
          setNotifOpen(false);
        } else if (sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen, notifOpen]);

  const unreadContactCount = contactMessages.filter((m) => m.status === "unread").length;
  const activeReportsCount = reports.filter((r) => r.status === "open" || r.status === "under_review").length;

  const navGroups: NavGroup[] = [
    {
      title: "الرئيسية",
      items: [
        {
          label: "لوحة التحكم",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "إدارة المحتوى",
      items: [
        {
          label: "الأعمال",
          href: "/admin/works",
          icon: BookOpen,
          count: metrics.publishedWorks + metrics.draftWorks,
        },
      ],
    },
    {
      title: "المجتمع والإشراف",
      items: [
        {
          label: "المستخدمون",
          href: "/admin/users",
          icon: Users,
        },
        {
          label: "التعليقات",
          href: "/admin/comments",
          icon: MessageSquare,
        },
        {
          label: "البلاغات",
          href: "/admin/reports",
          icon: ShieldAlert,
          count: activeReportsCount > 0 ? activeReportsCount : undefined,
        },
      ],
    },
    {
      title: "التواصل والإعلانات",
      items: [
        {
          label: "تصاميم الهدايا",
          href: "/admin/gifts",
          icon: Gift,
        },
        {
          label: "منح وسجل الهدايا",
          href: "/admin/gifts/grants",
          icon: Award,
        },
        {
          label: "رسائل التواصل",
          href: "/admin/contact",
          icon: Mail,
          count: unreadContactCount > 0 ? unreadContactCount : undefined,
        },
        {
          label: "إعدادات الإعلانات",
          href: "/admin/ads",
          icon: Megaphone,
        },
      ],
    },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className={styles["shell"]}>
      {/* Mobile backdrop */}
      <div
        className={cn(styles["backdrop"], sidebarOpen && styles["backdropOpen"])}
        onClick={closeNav}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={cn(styles["sidebar"], sidebarOpen && styles["sidebarOpen"])}
        aria-label="القائمة الجانبية للإدارة"
      >
        <div className={styles["sidebarHeader"]}>
          <div className={styles["brandArea"]}>
            <Link
              href={"/admin/dashboard"}
              className={styles["brandWordmark"]}
            >
              <span className={styles["brandF"]}>F</span>
              <span className={styles["brandUry"]}>URY</span>
            </Link>
            <span className={styles["adminBadge"]}>لوحة الإدارة</span>
          </div>
        </div>

        <nav className={styles["navContainer"]} aria-label="تنقل لوحة الإدارة">
          {navGroups.map((group) => (
            <div key={group.title} className={styles["navGroup"]}>
              <h2 className={styles["groupTitle"]}>{group.title}</h2>
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin/dashboard" || item.href === "/admin/gifts"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    onClick={closeNav}
                    className={cn(
                      styles["navLink"],
                      isActive && styles["activeNavLink"],
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={styles["navLinkMain"]}>
                      <IconComponent className={styles["navIcon"]} />
                      <span>{item.label}</span>
                    </span>
                    {item.count !== undefined ? (
                      <span className={styles["navCount"]}>
                        {item.count.toLocaleString("ar-EG")}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles["sidebarFooter"]}>
          <Link
            href="/"
            className={styles["publicLink"]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>زيارة الموقع العام</span>
            <ExternalLink size={14} aria-hidden="true" />
          </Link>

          <div className={styles["adminProfile"]}>
            <div className={styles["adminDetails"]}>
              <div className={styles["adminAvatar"]} aria-hidden="true">
                {user.name.slice(0, 1)}
              </div>
              <div className={styles["adminInfo"]}>
                <span className={styles["adminName"]}>{user.name}</span>
                <span className={styles["adminRole"]}>{user.role}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className={styles["logoutBtn"]}
              aria-label="تسجيل الخروج من لوحة الإدارة"
              title="تسجيل الخروج"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className={styles["mainWrapper"]}>
        {/* Top Header */}
        <header className={styles["topHeader"]}>
          <div className={styles["headerRight"]}>
            <button
              type="button"
              className={styles["menuToggle"]}
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
              }}
              aria-label={sidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className={styles["headerTitle"]}>منصة Fury — إدارة المحتوى</span>
          </div>

          <div className={styles["headerLeft"]}>
            <button
              type="button"
              className={styles["notificationBtn"]}
              onClick={() => {
                setNotifOpen(!notifOpen);
              }}
              aria-label="الإشعارات الإدارية"
              aria-expanded={notifOpen}
              aria-haspopup="true"
            >
              <Bell size={18} aria-hidden="true" />
              {metrics.openReports > 0 ? (
                <span
                  className={styles["unreadDot"]}
                  aria-label={`${String(metrics.openReports)} بلاغات جديدة`}
                />
              ) : null}
            </button>

            {notifOpen ? (
              <div
                className={styles["notificationsPopover"]}
                role="region"
                aria-label="قائمة الإشعارات"
              >
                <div className={styles["popoverHeader"]}>
                  <h4>التنبيهات الإدارية</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                    }}
                    className={styles["logoutBtn"]}
                    aria-label="إغلاق التنبيهات"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className={styles["notificationList"]}>
                  {activities.slice(0, 4).map((act) => (
                    <div key={act.id} className={styles["notificationItem"]}>
                      <span className={styles["notifTitle"]}>{act.title}</span>
                      <span className={styles["notifTime"]}>
                        {act.timestamp} — {act.actor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </header>

        {/* Content Area */}
        <main className={styles["contentArea"]} id="main-admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { Bell, Bookmark, Menu, Search, User, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { useSession } from "@/features/auth/hooks/auth.hooks";
import { NAV_LINKS } from "@/features/home/data/heroData";
import styles from "./Navbar.module.css";

type NotificationItem = Readonly<{
  id: number;
  text: string;
  time: string;
  unread: boolean;
  href: string;
}>;

const NOTIFICATIONS: readonly NotificationItem[] = [
  {
    id: 1,
    text: "صدر فصل جديد من عمل محفوظ لديك.",
    time: "قبل 3 دقائق",
    unread: true,
    href: "/story/trait-hoarder/chapter/43",
  },
  {
    id: 2,
    text: "لديك إطارات وزخارف جاهزة للمعاينة.",
    time: "قبل ساعتين",
    unread: true,
    href: "/settings#avatar-frame",
  },
] as const;

export function NavLogo() {
  return (
    <Link href="/" className={styles["logoLink"]} aria-label="Fury — الرئيسية">
      <span dir="ltr" className={styles["logoText"]}>
        <span className={styles["logoAccent"]}>F</span>
        <span>URY</span>
      </span>
    </Link>
  );
}

function PublicLinks({
  mobile = false,
  onNavigate,
}: Readonly<{ mobile?: boolean; onNavigate?: () => void }>) {
  const pathname = usePathname();
  return (
    <nav
      className={mobile ? styles["mobileLinks"] : styles["navLinks"]}
      aria-label={mobile ? "التنقل الرئيسي للهاتف" : "التنقل الرئيسي"}
    >
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={mobile ? styles["mobileNavLink"] : styles["navLink"]}
            {...(onNavigate === undefined ? {} : { onClick: onNavigate })}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Navbar({ minimal = false }: Readonly<{ minimal?: boolean }>) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSession().data?.user ?? null;
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<readonly NotificationItem[]>(NOTIFICATIONS);
  const bellRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const submitSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const value = query.trim();
    if (value.length === 0) return;
    setMobileOpen(false);
    router.push(`/stories?q=${encodeURIComponent(value)}` as Route);
  };

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent): void => {
      if (
        bellRef.current !== null &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      if (notificationsOpen) {
        setNotificationsOpen(false);
        bellButtonRef.current?.focus();
      }
      if (mobileOpen) {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen, notificationsOpen]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <header className={styles["header"]}>
      <div className={styles["inner"]}>
        <NavLogo />
        {minimal ? (
          <Link href="/" className={styles["backHome"]}>
            العودة إلى الرئيسية
          </Link>
        ) : (
          <>
            <PublicLinks />
            <div className={styles["actions"]}>
              <form
                className={styles["searchWrapper"]}
                role="search"
                onSubmit={submitSearch}
              >
                <label className="sr-only" htmlFor="global-search">
                  البحث في الأعمال النصية
                </label>
                <span className={styles["searchInner"]}>
                  <Search className={styles["searchIcon"]} aria-hidden="true" />
                  <input
                    id="global-search"
                    className={styles["searchInput"]}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="ابحث في الروايات…"
                  />
                </span>
              </form>

              <div className={styles["bellWrapper"]} ref={bellRef}>
                <button
                  ref={bellButtonRef}
                  type="button"
                  className={styles["iconBtn"]}
                  aria-label={`الإشعارات${unreadCount > 0 ? `، ${unreadCount} غير مقروءة` : ""}`}
                  aria-expanded={notificationsOpen}
                  aria-controls="navbar-notifications"
                  onClick={() => setNotificationsOpen((current) => !current)}
                >
                  <Bell aria-hidden="true" />
                  {unreadCount > 0 ? (
                    <span className={styles["pulseDot"]} />
                  ) : null}
                </button>
                {notificationsOpen ? (
                  <div
                    id="navbar-notifications"
                    className={styles["notificationsDropdown"]}
                  >
                    <div className={styles["notificationsHeader"]}>
                      <strong className={styles["notificationsTitle"]}>
                        الإشعارات ({unreadCount})
                      </strong>
                      {unreadCount > 0 ? (
                        <button
                          type="button"
                          className={styles["markAllReadBtn"]}
                          onClick={() =>
                            setNotifications((current) =>
                              current.map((item) => ({
                                ...item,
                                unread: false,
                              })),
                            )
                          }
                        >
                          تحديد الكل كمقروء
                        </button>
                      ) : null}
                    </div>
                    <div className={styles["notificationsList"]}>
                      {notifications.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href as Route}
                          className={`${styles["notificationItem"]} ${item.unread ? styles["unreadItem"] : ""}`}
                          onClick={() => {
                            setNotifications((current) =>
                              current.map((candidate) =>
                                candidate.id === item.id
                                  ? { ...candidate, unread: false }
                                  : candidate,
                              ),
                            );
                            setNotificationsOpen(false);
                          }}
                        >
                          {item.unread ? (
                            <span
                              className={styles["unreadDot"]}
                              aria-hidden="true"
                            />
                          ) : null}
                          <span className={styles["notificationContent"]}>
                            <span className={styles["notificationText"]}>
                              {item.text}
                            </span>
                            <span className={styles["notificationTime"]}>
                              {item.time}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {user === null ? null : (
                <Link
                  href="/library"
                  className={styles["iconBtn"]}
                  aria-label="المكتبة والمحفوظات"
                >
                  <Bookmark aria-hidden="true" />
                </Link>
              )}
              <Link
                href={user === null ? "/auth/login" : "/dashboard"}
                className={styles["profileBtn"]}
                aria-label={
                  user === null ? "تسجيل الدخول" : `حساب ${user.fullName}`
                }
              >
                <User aria-hidden="true" />
                <span className={styles["profileLabel"]}>
                  {user === null ? "دخول" : user.fullName.split(" ")[0]}
                </span>
              </Link>
              <button
                ref={menuButtonRef}
                type="button"
                className={`${styles["iconBtn"]} ${styles["hamburger"]}`}
                aria-label={
                  mobileOpen ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل"
                }
                aria-expanded={mobileOpen}
                aria-controls="navbar-mobile-menu"
                onClick={() => setMobileOpen((current) => !current)}
              >
                {mobileOpen ? (
                  <X aria-hidden="true" />
                ) : (
                  <Menu aria-hidden="true" />
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {!minimal && mobileOpen ? (
        <div id="navbar-mobile-menu" className={styles["mobileMenu"]}>
          <PublicLinks mobile onNavigate={() => setMobileOpen(false)} />
          {user === null ? null : (
            <Link
              href="/library"
              aria-current={pathname === "/library" ? "page" : undefined}
              className={styles["mobileNavLink"]}
              onClick={() => setMobileOpen(false)}
            >
              المكتبة والمحفوظات
            </Link>
          )}
          <form
            className={styles["mobileSearch"]}
            role="search"
            onSubmit={submitSearch}
          >
            <label className="sr-only" htmlFor="mobile-global-search">
              البحث في الأعمال النصية
            </label>
            <Search aria-hidden="true" />
            <input
              id="mobile-global-search"
              className={styles["mobileSearchInput"]}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث في الروايات…"
            />
          </form>
        </div>
      ) : null}
    </header>
  );
}

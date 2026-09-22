"use client";

import { Bell } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import styles from "./workspace-shell.module.css";

type UserNotification = Readonly<{
  id: string;
  typeLabel: string;
  text: string;
  time: string;
  href: string;
  unread: boolean;
}>;

const INITIAL_NOTIFICATIONS: readonly UserNotification[] = [
  {
    id: "notif-1",
    typeLabel: "\u0647\u062f\u064a\u0629 \u062c\u062f\u064a\u062f\u0629",
    text: "\u062a\u0645 \u0645\u0646\u062d\u0643 \u062a\u0635\u0645\u064a\u0645 \u0645\u0638\u0647\u0631 \u062c\u062f\u064a\u062f: \u0625\u0637\u0627\u0631 \u0627\u0644\u062e\u0627\u062a\u0645 \u0627\u0644\u0646\u0627\u0631\u064a \u0628\u0648\u0627\u0633\u0637\u0629 \u0627\u0644\u0625\u062f\u0627\u0631\u0629.",
    time: "\u0645\u0646\u0630 \u0633\u0627\u0639\u062a\u064a\u0646",
    href: "/settings?section=avatar-frames",
    unread: true,
  },
  {
    id: "notif-2",
    typeLabel: "\u0641\u0635\u0644 \u062c\u062f\u064a\u062f",
    text: "\u0635\u062f\u0631 \u0641\u0635\u0644 \u062c\u062f\u064a\u062f \u0645\u0646 \u0639\u0645\u0644 \u0645\u062d\u0641\u0648\u0638 \u0644\u062f\u064a\u0643: Trait Hoarder \u2014 \u0627\u0644\u0641\u0635\u0644 43.",
    time: "\u0645\u0646\u0630 4 \u0633\u0627\u0639\u0627\u062a",
    href: "/story/trait-hoarder/chapter/43",
    unread: true,
  },
];

export function WorkspaceNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    readonly UserNotification[]
  >(INITIAL_NOTIFICATIONS);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, unread: false })),
    );
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
    setIsOpen(false);
  };

  return (
    <div className={styles["bellWrapper"]} ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        className={cn(styles["bellBtn"], isOpen && styles["bellBtnActive"])}
        aria-label={`الإشعارات${
          unreadCount > 0 ? `، ${String(unreadCount)} غير مقروءة` : ""
        }`}
        aria-expanded={isOpen}
        aria-controls="workspace-notifications"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && <span className={styles["pulseDot"]} />}
      </button>

      {isOpen && (
        <div
          id="workspace-notifications"
          className={styles["notificationsDropdown"]}
          role="region"
          aria-label="قائمة الإشعارات"
        >
          <div className={styles["notificationsHeader"]}>
            <span className={styles["notificationsTitle"]}>
              الإشعارات ({unreadCount})
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                className={styles["markAllBtn"]}
                onClick={handleMarkAllRead}
              >
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          <div className={styles["notificationsList"]}>
            {notifications.length === 0 ? (
              <div className={styles["noNotifications"]}>
                لا توجد إشعارات جديدة حالياً
              </div>
            ) : (
              notifications.map((item) => (
                <Link
                  key={item.id}
                  href={item.href as Route}
                  className={cn(
                    styles["notificationItem"],
                    item.unread && styles["notificationItemUnread"],
                  )}
                  onClick={() => {
                    handleNotificationClick(item.id);
                  }}
                >
                  <div className={styles["notificationHeaderRow"]}>
                    <span className={styles["notificationTypeBadge"]}>
                      {item.typeLabel}
                    </span>
                    <span className={styles["notificationTime"]}>
                      {item.time}
                    </span>
                  </div>
                  <p className={styles["notificationText"]}>{item.text}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

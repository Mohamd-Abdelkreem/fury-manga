import React from "react";
import Link from "next/link";
import type { Route } from "next";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./AdminNoticeBanner.module.css";

interface AdminNoticeBannerProps {
  title: string;
  description: string;
  variant?: "warning" | "info" | "success";
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export function AdminNoticeBanner({
  title,
  description,
  variant = "warning",
  actionLabel,
  actionHref,
  onAction,
  onDismiss,
}: AdminNoticeBannerProps) {
  const Icon =
    variant === "warning"
      ? AlertTriangle
      : variant === "success"
        ? CheckCircle
        : Info;

  const role = variant === "warning" ? "alert" : "status";

  return (
    <div
      className={cn(styles["banner"], styles[variant])}
      role={role}
      aria-live="polite"
    >
      <div className={styles["content"]}>
        <div className={styles["iconWrapper"]} aria-hidden="true">
          <Icon className={styles["icon"]} />
        </div>
        <div className={styles["textGroup"]}>
          <h4 className={styles["title"]}>{title}</h4>
          <p className={styles["description"]}>{description}</p>
        </div>
      </div>

      <div className={styles["actions"]}>
        {actionLabel !== undefined && actionHref !== undefined ? (
          <Link href={actionHref as Route} className={styles["actionBtn"]}>
            {actionLabel}
          </Link>
        ) : null}

        {actionLabel !== undefined &&
        actionHref === undefined &&
        onAction !== undefined ? (
          <button
            type="button"
            onClick={onAction}
            className={styles["actionBtn"]}
          >
            {actionLabel}
          </button>
        ) : null}

        {onDismiss !== undefined ? (
          <button
            type="button"
            onClick={onDismiss}
            className={styles["dismissBtn"]}
            aria-label="إغلاق التنبيه"
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

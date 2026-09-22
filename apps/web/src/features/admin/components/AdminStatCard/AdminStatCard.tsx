import React from "react";
import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./AdminStatCard.module.css";

interface AdminStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    text: string;
    isPositive?: boolean;
  };
  action?: {
    label: string;
    href: string;
  };
}

export function AdminStatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  action,
}: AdminStatCardProps) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString("ar-EG") : value;

  return (
    <article className={styles["card"]}>
      <div className={styles["cardHeader"]}>
        <h3 className={styles["title"]}>{title}</h3>
        <div className={styles["iconWrapper"]} aria-hidden="true">
          <Icon className={styles["icon"]} />
        </div>
      </div>

      <div className={styles["cardBody"]}>
        <div className={styles["value"]}>{formattedValue}</div>
        {description !== undefined ? (
          <p className={styles["footer"]}>{description}</p>
        ) : null}
      </div>

      {trend !== undefined || action !== undefined ? (
        <div className={styles["footer"]}>
          {trend !== undefined ? (
            <span
              className={cn(
                styles["trend"],
                trend.isPositive ? styles["trendPositive"] : styles["trendNeutral"],
              )}
            >
              {trend.text}
            </span>
          ) : (
            <span />
          )}

          {action !== undefined ? (
            <Link
              href={action.href as Route}
              className={styles["actionLink"]}
            >
              {action.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

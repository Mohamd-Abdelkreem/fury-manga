import React from "react";
import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import styles from "./AdminPageHeader.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeaderAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
}

interface AdminPageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
  primaryAction?: HeaderAction;
  secondaryAction?: HeaderAction;
}

export function AdminPageHeader({
  breadcrumbs,
  title,
  description,
  primaryAction,
  secondaryAction,
}: AdminPageHeaderProps) {
  return (
    <header className={styles["headerCard"]}>
      <div className={styles["textSide"]}>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="مسار التنقل" className={styles["breadcrumbs"]}>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.label}>
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href as Route}
                      className={styles["breadcrumbLink"]}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={
                        isLast
                          ? styles["breadcrumbCurrent"]
                          : styles["breadcrumbLink"]
                      }
                      aria-current={isLast ? "page" : undefined}
                    >
                      {crumb.label}
                    </span>
                  )}
                  {!isLast ? (
                    <span className={styles["separator"]} aria-hidden="true">
                      /
                    </span>
                  ) : null}
                </React.Fragment>
              );
            })}
          </nav>
        ) : null}

        <h1 className={styles["title"]}>{title}</h1>

        {description ? (
          <p className={styles["description"]}>{description}</p>
        ) : null}
      </div>

      {primaryAction || secondaryAction ? (
        <div className={styles["actionsSide"]}>
          {secondaryAction ? (
            secondaryAction.href ? (
              <Link
                href={secondaryAction.href as Route}
                className={styles["secondaryBtn"]}
              >
                {secondaryAction.icon ? (
                  <secondaryAction.icon
                    className={styles["btnIcon"]}
                    aria-hidden="true"
                  />
                ) : null}
                <span>{secondaryAction.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className={styles["secondaryBtn"]}
              >
                {secondaryAction.icon ? (
                  <secondaryAction.icon
                    className={styles["btnIcon"]}
                    aria-hidden="true"
                  />
                ) : null}
                <span>{secondaryAction.label}</span>
              </button>
            )
          ) : null}

          {primaryAction ? (
            primaryAction.href ? (
              <Link
                href={primaryAction.href as Route}
                className={styles["primaryBtn"]}
              >
                {primaryAction.icon ? (
                  <primaryAction.icon
                    className={styles["btnIcon"]}
                    aria-hidden="true"
                  />
                ) : null}
                <span>{primaryAction.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className={styles["primaryBtn"]}
              >
                {primaryAction.icon ? (
                  <primaryAction.icon
                    className={styles["btnIcon"]}
                    aria-hidden="true"
                  />
                ) : null}
                <span>{primaryAction.label}</span>
              </button>
            )
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

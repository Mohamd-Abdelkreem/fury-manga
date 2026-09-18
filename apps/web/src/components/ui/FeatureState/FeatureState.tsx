import type { Route } from "next";
import Link from "next/link";
import { AlertCircle, BookOpen, LoaderCircle, SearchX } from "lucide-react";

import styles from "./FeatureState.module.css";

type FeatureStateKind =
  "loading" | "empty" | "filtered-empty" | "error" | "unavailable";

type FeatureStateProps = Readonly<{
  kind: FeatureStateKind;
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  onRetry?: () => void;
}>;

const icons = {
  loading: LoaderCircle,
  empty: BookOpen,
  "filtered-empty": SearchX,
  error: AlertCircle,
  unavailable: AlertCircle,
} as const;

export function FeatureState({
  kind,
  title,
  message,
  actionHref,
  actionLabel,
  onRetry,
}: FeatureStateProps) {
  const Icon = icons[kind];
  const isLoading = kind === "loading";
  const isError = kind === "error";

  return (
    <section
      className={styles["state"]}
      aria-busy={isLoading || undefined}
      role={isError ? "alert" : "status"}
    >
      <Icon
        aria-hidden="true"
        className={`${styles["icon"]} ${isLoading ? styles["spinning"] : ""}`}
      />
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry === undefined || actionLabel === undefined ? null : (
        <button
          className="button button--small"
          type="button"
          onClick={onRetry}
        >
          {actionLabel}
        </button>
      )}
      {actionHref === undefined || actionLabel === undefined ? null : (
        <Link className="button button--small" href={actionHref as Route}>
          {actionLabel}
        </Link>
      )}
    </section>
  );
}

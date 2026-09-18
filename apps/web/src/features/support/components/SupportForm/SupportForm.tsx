import { CheckCircle2, Send } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/features/home/components/Footer/Footer";
import { Navbar } from "@/features/home/components/Navbar/Navbar";

import styles from "./SupportForm.module.css";

type SupportPageLayoutProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  asideTitle: string;
  asideMessage: string;
  asideHref: string;
  asideLabel: string;
  children: ReactNode;
}>;

export function SupportPageLayout({
  eyebrow,
  title,
  description,
  asideTitle,
  asideMessage,
  asideHref,
  asideLabel,
  children,
}: SupportPageLayoutProps) {
  return (
    <div className={styles["page"]}>
      <Navbar />
      <main className={styles["main"]} id="main-content">
        <header className={styles["hero"]}>
          <span className={styles["heroIcon"]} aria-hidden="true">
            <Send />
          </span>
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </header>
        <div className={styles["layout"]}>
          <div>{children}</div>
          <aside className={styles["aside"]}>
            <p className="eyebrow">مسار آخر</p>
            <h2>{asideTitle}</h2>
            <p>{asideMessage}</p>
            <Link href={asideHref as Route}>{asideLabel}</Link>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

type SupportFieldProps = Readonly<{
  id: string;
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  count?: string | undefined;
  children: ReactNode;
}>;

export function SupportField({
  id,
  label,
  hint,
  error,
  count,
  children,
}: SupportFieldProps) {
  return (
    <div className={styles["field"]}>
      <div className={styles["labelRow"]}>
        <label htmlFor={id}>{label}</label>
        {count === undefined ? null : <span>{count}</span>}
      </div>
      {children}
      {hint === undefined ? null : <small id={`${id}-hint`}>{hint}</small>}
      {error === undefined ? null : (
        <small className={styles["fieldError"]} id={`${id}-error`} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}

export function SupportSuccess({
  title,
  message,
  actionLabel,
  onReset,
}: Readonly<{
  title: string;
  message: string;
  actionLabel: string;
  onReset: () => void;
}>) {
  return (
    <section className={styles["success"]} aria-live="polite" role="status">
      <span aria-hidden="true">
        <CheckCircle2 />
      </span>
      <h2>{title}</h2>
      <p>{message}</p>
      <button className="button" type="button" onClick={onReset}>
        {actionLabel}
      </button>
    </section>
  );
}

export { styles as supportFormStyles };

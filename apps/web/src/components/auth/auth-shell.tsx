import type { ReactNode } from "react";

import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { Footer } from "@/features/home/components/Footer/Footer";
import formStyles from "@/features/auth/components/auth-form.module.css";

import styles from "./auth-shell.module.css";

export function AuthShell({
  eyebrow,
  title,
  summary,
  children,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar minimal />
        <main className={styles["contentContainer"]}>
          <div className={formStyles["container"]}>
            <section className={formStyles["card"]}>
              <header className={formStyles["header"]}>
                <p className="auth-eyebrow">{eyebrow}</p>
                <h1 className={formStyles["title"]}>{title}</h1>
                <p className={formStyles["subtitle"]}>{summary}</p>
              </header>
              {children}
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Route } from "next";

import styles from "./Footer.module.css";

const quickLinks = [
  ["الرئيسية", "/"],
  ["التصنيفات", "/categories"],
  ["قائمة المانجا", "/discover"],
  ["الروايات والقصص النصية", "/stories"],
  ["الأعمال الرائجة", "/#trending"],
  ["الإصدارات الجديدة", "/#latest-releases"],
] as const;

const categoryLinks = [
  ["أكشن", "action"],
  ["خيال", "fantasy"],
  ["غموض", "mystery"],
  ["رومانسي", "romance"],
  ["رعب", "horror"],
] as const;

const supportLinks = [
  ["اتصل بنا", "/contact"],
  ["الإبلاغ عن مشكلة", "/report-issue"],
  ["سياسة الخصوصية", "/privacy"],
] as const;
const communities = ["ديسكورد", "تيك توك", "إنستغرام", "يوتيوب", "تويتر"];

export function Footer() {
  return (
    <footer className={styles["footer"]}>
      <div className={styles["upper"]}>
        <div className={styles["grid"]}>
          <div className={styles["brandCol"]}>
            <Link
              href="/"
              className={styles["brandLogo"]}
              aria-label="Fury — الرئيسية"
            >
              <span className={styles["brandAccent"]}>F</span>
              <span>URY</span>
            </Link>
            <p className={styles["brandCopy"]}>
              منصتك العربية لقراءة الأعمال المصوّرة والروايات والقصص النصية ضمن
              تجربة داكنة ومريحة.
            </p>
            <div className={styles["tags"]} aria-label="تصنيفات سريعة">
              {categoryLinks.map(([label, slug]) => (
                <Link
                  key={slug}
                  className={styles["tag"]}
                  href={`/discover?genre=${slug}`}
                >
                  #{label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles["linkCol"]}>
            <h2 className={styles["linkColHeader"]}>روابط سريعة</h2>
            <div className={styles["linkList"]}>
              {quickLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href as Route}
                  className={styles["footerLink"]}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles["linkCol"]}>
            <h2 className={styles["linkColHeader"]}>الدعم</h2>
            <div className={styles["linkList"]}>
              {supportLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href as Route}
                  className={styles["footerLink"]}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles["linkCol"]}>
            <h2 className={styles["linkColHeader"]}>المجتمع</h2>
            <ul className={styles["plainList"]}>
              {communities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className={styles["divider"]} />
      <div className={styles["bottom"]}>
        <p className={styles["copyright"]}>© 2026 Fury. جميع الحقوق محفوظة.</p>
        <p className={styles["footerNote"]}>
          روابط المجتمع ستُفعّل عند اعتماد وجهاتها الرسمية.
        </p>
      </div>
    </footer>
  );
}

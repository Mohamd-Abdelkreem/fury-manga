"use client";

import React from "react";
import Link from "next/link";
import type { Route } from "next";
import styles from "./Footer.module.css";

const FOOTER_ROUTES: Partial<Record<string, Route>> = {
  الرئيسية: "/",
  "قائمة المانجا": "/discover",
  "الأعمال الرائجة": "/#trending",
  "الإصدارات الجديدة": "/#latest-releases",
};

const FOOTER_SECTIONS = [
  {
    title: "روابط سريعة",
    items: [
      "الرئيسية",
      "قائمة المانجا",
      "الأنمي",
      "الأعمال الرائجة",
      "الإصدارات الجديدة",
    ],
  },
  {
    title: "الدعم",
    items: [
      "اتصل بنا",
      "سياسة الخصوصية",
      "حقوق النشر",
      "شروط الاستخدام",
      "الإبلاغ عن خطأ",
    ],
  },
  {
    title: "المجتمع",
    items: ["ديسكورد", "تيك توك", "انستغرام", "يوتيوب", "تويتر"],
  },
];

const TAGS = [
  "مانهوا",
  "أنمي",
  "أكشن",
  "خيال",
  "إثارة",
  "رومانسي",
  "رعب",
  "مغامرة",
  "سحر",
  "رياضة",
];

const BOTTOM_LINKS = ["اتصل بنا", "سياسة الخصوصية", "حقوق النشر"];

export function Footer() {
  return (
    <footer
      dir="rtl"
      className={styles["footer"]}
      style={{
        background: "var(--footer-bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Upper footer */}
      <div className={styles["upper"]}>
        <div className={styles["grid"]}>
          {/* Brand */}
          <div className={styles["brandCol"]}>
            <div className={styles["brandLogo"]}>
              <span
                style={{
                  fontFamily: "'Cairo Play', 'Cairo', sans-serif",
                  fontWeight: 900,
                  fontSize: "24px",
                  color: "var(--primary)",
                  textShadow: "0 0 18px rgba(255, 71, 71, 0.4)",
                }}
              >
                F
              </span>
              <span
                style={{
                  fontFamily: "'Cairo Play', 'Cairo', sans-serif",
                  fontWeight: 900,
                  fontSize: "24px",
                  color: "var(--foreground)",
                }}
              >
                URY
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "0.83rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.9,
                maxWidth: "260px",
              }}
            >
              منصتك الأولى لقراءة المانجا والمانهوا والأنمي بالعربية. نقدم أحدث
              الإصدارات يومياً مع ترجمات احترافية.
            </p>
            {/* Tags */}
            <div className={styles["tags"]}>
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className={styles["tag"]}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--border)",
                    color: "var(--muted-foreground)",
                    fontFamily: "'Cairo', sans-serif",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLSpanElement;
                    el.style.background = "rgba(255, 71, 71, 0.12)";
                    el.style.borderColor = "var(--primary)";
                    el.style.color = "var(--foreground)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLSpanElement;
                    el.style.background = "rgba(255, 255, 255, 0.04)";
                    el.style.borderColor = "var(--border)";
                    el.style.color = "var(--muted-foreground)";
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className={styles["linkCol"]}>
              <h4
                className={styles["linkColHeader"]}
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  color: "var(--foreground)",
                }}
              >
                {section.title}
              </h4>
              <div className={styles["linkList"]}>
                {section.items.map((item) => (
                  <Link
                    key={item}
                    href={FOOTER_ROUTES[item] ?? "#"}
                    className={styles["footerLink"]}
                    style={{
                      fontFamily: "'Cairo', sans-serif",
                      color: "var(--foreground)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--muted-foreground)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--foreground)";
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        className={styles["divider"]}
        style={{ background: "var(--border)" }}
      />

      {/* Bottom bar */}
      <div className={styles["bottom"]}>
        <p
          className={styles["copyright"]}
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: "0.78rem",
            color: "var(--muted-foreground)",
          }}
        >
          © 2026 Fury. جميع الحقوق محفوظة. المحتوى للأغراض التعليمية فقط.
        </p>
        <div className={styles["bottomLinks"]}>
          {BOTTOM_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className={styles["bottomLink"]}
              style={{
                fontFamily: "'Cairo', sans-serif",
                color: "var(--muted-foreground)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--muted-foreground)";
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

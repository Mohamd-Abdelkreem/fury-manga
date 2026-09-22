import { AlertTriangle, ArrowUpLeft, FileText } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/features/home/components/Footer/Footer";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { TERMS_SECTIONS } from "@/features/legal/data/termsSections";

import { LegalSectionsLayout } from "../LegalSectionsLayout";

import styles from "./TermsPage.module.css";

export function TermsPage() {
  return (
    <div className={styles["page"]}>
      <Navbar />
      <main className={styles["main"]} id="main-content">
        <header className={styles["hero"]}>
          <span aria-hidden="true">
            <FileText />
          </span>
          <div>
            <p className="eyebrow">اتفاقية الاستخدام في Fury</p>
            <h1>الشروط والأحكام</h1>
            <p>
              مسودة عربية تفصيلية تحدد القواعد والالتزامات المنظمة لاستخدام
              الموقع الإلكتروني، وحسابات القراء، وبوابات متابعة القراءة،
              ومشاركات المجتمع.
            </p>
            <dl>
              <div>
                <dt>آخر تحديث للمسودة</dt>
                <dd>18 سبتمبر 2026</dd>
              </div>
              <div>
                <dt>الحالة</dt>
                <dd>مسودة ما قبل الإطلاق</dd>
              </div>
            </dl>
          </div>
        </header>

        <aside className={styles["approval"]} role="note">
          <AlertTriangle aria-hidden="true" />
          <div>
            <h2>اعتماد قانوني مطلوب</h2>
            <p>
              يجب أن يراجع مالك المنتج أو مستشاره القانوني هذا النص ويعتمده قبل
              الإطلاق. المحتوى أدناه مسودة للواجهة وليس رأيًا قانونيًا أو وثيقة
              نهائية ملزمة قانونًا.
            </p>
          </div>
        </aside>

        <LegalSectionsLayout
          sections={TERMS_SECTIONS}
          tocLabel="محتويات الشروط والأحكام"
          styles={styles}
          renderExtra={(sectionId) => (
            <>
              {sectionId === "copyright-notices" ? (
                <div className={styles["actions"]}>
                  <Link href="/copyright">
                    سياسة حقوق النشر
                    <ArrowUpLeft aria-hidden="true" />
                  </Link>
                </div>
              ) : null}

              {sectionId === "contact-support" ? (
                <div className={styles["actions"]}>
                  <Link href="/contact">
                    اتصل بنا
                    <ArrowUpLeft aria-hidden="true" />
                  </Link>
                  <Link href="/report-issue">
                    الإبلاغ عن مشكلة
                    <ArrowUpLeft aria-hidden="true" />
                  </Link>
                  <Link href="/privacy">
                    سياسة الخصوصية
                    <ArrowUpLeft aria-hidden="true" />
                  </Link>
                </div>
              ) : null}
            </>
          )}
        />
      </main>
      <Footer />
    </div>
  );
}

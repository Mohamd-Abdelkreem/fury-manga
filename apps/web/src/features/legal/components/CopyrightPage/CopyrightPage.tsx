import { AlertTriangle, ArrowUpLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/features/home/components/Footer/Footer";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { COPYRIGHT_SECTIONS } from "@/features/legal/data/copyrightSections";

import { LegalSectionsLayout } from "../LegalSectionsLayout";

import styles from "./CopyrightPage.module.css";

export function CopyrightPage() {
  return (
    <div className={styles["page"]}>
      <Navbar />
      <main className={styles["main"]} id="main-content">
        <header className={styles["hero"]}>
          <span aria-hidden="true">
            <ShieldAlert />
          </span>
          <div>
            <p className="eyebrow">الملكية الفكرية في Fury</p>
            <h1>سياسة حقوق الملكية والنشر</h1>
            <p>
              بيان التزام منصة Fury باحترام حقوق المؤلفين والناشرين، وتوضيح
              ضوابط وشروط تقديم إخطارات إزالة المحتوى المخالف وآليات المعالجة.
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
              الإطلاق. المحتوى أدناه مسودة للواجهة وليس رأيًا قانونيًا أو ضمانة
              قضائية معتمدة.
            </p>
          </div>
        </aside>

        <LegalSectionsLayout
          sections={COPYRIGHT_SECTIONS}
          tocLabel="محتويات سياسة حقوق الملكية"
          styles={styles}
          renderExtra={(sectionId) => (
            <>
              {sectionId === "required-info" ? (
                <div className={styles["checklistCard"]}>
                  <div className={styles["checklistTitle"]}>
                    قائمة التحقق السريعة لتقديم بلاغ معتمد
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: "1.7",
                    }}
                  >
                    يرجى التأكد من إرفاق رابط العمل على Fury، وإثبات صفتك
                    التمثيلية، وتحديد تفاصيل العمل الأصلي، والإقرار بحسن النية
                    عبر نموذج التواصل.
                  </p>
                </div>
              ) : null}

              {sectionId === "submission-channel" ? (
                <div className={styles["actions"]}>
                  <Link href="/contact">
                    تقديم إخطار عبر صفحة التواصل
                    <ArrowUpLeft aria-hidden="true" />
                  </Link>
                  <Link href="/terms">
                    شروط الاستخدام
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

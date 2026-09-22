import { AlertTriangle, ArrowUpLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/features/home/components/Footer/Footer";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { PRIVACY_SECTIONS } from "@/features/legal/data/privacySections";

import { LegalSectionsLayout } from "../LegalSectionsLayout";

import styles from "./PrivacyPolicyPage.module.css";

export function PrivacyPolicyPage() {
  return (
    <div className={styles["page"]}>
      <Navbar />
      <main className={styles["main"]} id="main-content">
        <header className={styles["hero"]}>
          <span aria-hidden="true">
            <ShieldCheck />
          </span>
          <div>
            <p className="eyebrow">الخصوصية في Fury</p>
            <h1>سياسة الخصوصية</h1>
            <p>
              مسودة عربية واضحة تشرح المعلومات المرتبطة بالحساب والقراءة
              والمجتمع والتشغيل، مع حدود صريحة لما لم يُعتمد بعد.
            </p>
            <dl>
              <div>
                <dt>آخر تحديث للمسودة</dt>
                <dd>17 سبتمبر 2026</dd>
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
              الإطلاق. المحتوى أدناه مسودة للواجهة وليس رأيًا قانونيًا.
            </p>
          </div>
        </aside>

        <LegalSectionsLayout
          sections={PRIVACY_SECTIONS}
          tocLabel="محتويات سياسة الخصوصية"
          styles={styles}
          renderExtra={(sectionId) => (
            <>
              {sectionId === "choices" ? (
                <div className={styles["actions"]}>
                  <Link href="/contact">
                    اتصل بنا
                    <ArrowUpLeft aria-hidden="true" />
                  </Link>
                  <Link href="/report-issue">
                    الإبلاغ عن مشكلة
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

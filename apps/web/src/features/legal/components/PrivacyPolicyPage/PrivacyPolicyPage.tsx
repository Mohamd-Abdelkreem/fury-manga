import { AlertTriangle, ArrowUpLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/features/home/components/Footer/Footer";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { PRIVACY_SECTIONS } from "@/features/legal/data/privacySections";

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

        <div className={styles["contentLayout"]}>
          <nav className={styles["toc"]} aria-label="محتويات سياسة الخصوصية">
            <h2>في هذه الصفحة</h2>
            <ol>
              {PRIVACY_SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <span>{(index + 1).toLocaleString("ar-EG")}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className={styles["article"]}>
            {PRIVACY_SECTIONS.map((section, index) => (
              <section
                id={section.id}
                key={section.id}
                aria-labelledby={`${section.id}-title`}
              >
                <p className={styles["sectionNumber"]}>
                  {(index + 1).toLocaleString("ar-EG")} /{" "}
                  {PRIVACY_SECTIONS.length.toLocaleString("ar-EG")}
                </p>
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.id === "choices" ? (
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
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

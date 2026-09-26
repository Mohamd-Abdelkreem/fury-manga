"use client";

import { useState } from "react";
import {
  Activity,
  BookOpen,
  Mail,
  Plus,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useAdminData } from "../../context/admin-context";
import { AdminNoticeBanner } from "../AdminNoticeBanner/AdminNoticeBanner";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminStatCard } from "../AdminStatCard/AdminStatCard";
import styles from "./AdminDashboard.module.css";

export function AdminDashboard() {
  const { metrics, activities } = useAdminData();
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "نظرة عامة" },
        ]}
        title="لوحة التحكم الإدارية"
        description="الأعمال والتصنيفات المحفوظة متاحة في صفحاتها. الإحصاءات والنشاط أدناه بيانات معاينة للأقسام التي لم تُربط بعد."
        primaryAction={{
          label: "إنشاء عمل جديد",
          href: "/admin/works/new",
          icon: Plus,
        }}
        secondaryAction={{
          label: "إدارة الأعمال",
          href: "/admin/works",
          icon: BookOpen,
        }}
      />

      {metrics.openReports > 0 && !noticeDismissed ? (
        <AdminNoticeBanner
          variant="warning"
          title="تنبيه تجريبي: بلاغات مفتوحة تحتاج للمراجعة"
          description={`تعرض هذه اللوحة ${metrics.openReports.toLocaleString("ar-EG")} بلاغات من بيانات المعاينة المحلية.`}
          actionLabel="مراجعة البلاغات التجريبية"
          actionHref="/admin/reports"
          onDismiss={() => {
            setNoticeDismissed(true);
          }}
        />
      ) : null}

      <section
        aria-label="إحصاءات تجريبية للأقسام غير المتصلة"
        className={styles["statsGrid"]}
      >
        <AdminStatCard
          title="الفصول المنشورة (تجريبي)"
          value={metrics.publishedChapters}
          icon={BookOpen}
        />
        <AdminStatCard
          title="المستخدمون النشطون (تجريبي)"
          value={metrics.activeUsers}
          icon={Users}
        />
        <AdminStatCard
          title="البلاغات المفتوحة (تجريبي)"
          value={metrics.openReports}
          icon={ShieldAlert}
          action={{ label: "فحص البلاغات التجريبية", href: "/admin/reports" }}
        />
        <AdminStatCard
          title="رسائل التواصل (تجريبي)"
          value={metrics.unreadMessages}
          icon={Mail}
          action={{ label: "قراءة الرسائل التجريبية", href: "/admin/contact" }}
        />
      </section>

      <section aria-label="سجل نشاط تجريبي" className={styles["panel"]}>
        <div className={styles["panelHeader"]}>
          <h2 className={styles["panelTitle"]}>
            <Activity className={styles["panelTitleIcon"]} aria-hidden="true" />
            <span>سجل نشاط تجريبي</span>
          </h2>
        </div>
        <div className={styles["activityList"]}>
          {activities.slice(0, 5).map((event) => (
            <div key={event.id} className={styles["activityItem"]}>
              <div className={styles["activityDot"]} aria-hidden="true" />
              <div className={styles["activityContent"]}>
                <h3 className={styles["activityTitle"]}>{event.title}</h3>
                <p className={styles["activityDesc"]}>{event.description}</p>
                <span className={styles["activityMeta"]}>
                  {event.timestamp} • بواسطة {event.actor}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

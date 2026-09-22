"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import {
  Activity,
  ArrowLeft,
  BookOpen,
  Edit3,
  ExternalLink,
  FileCheck,
  FileText,
  Layers,
  Mail,
  Plus,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminData } from "../../context/admin-context";
import { AdminNoticeBanner } from "../AdminNoticeBanner/AdminNoticeBanner";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminStatCard } from "../AdminStatCard/AdminStatCard";
import { AdminStatusBadge } from "../AdminStatusBadge/AdminStatusBadge";
import styles from "./AdminDashboard.module.css";

export function AdminDashboard() {
  const { works, metrics, activities } = useAdminData();
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  // Top recent works
  const recentWorks = works.slice(0, 5);

  // Trending works sorted by views
  const trendingWorks = [...works]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "نظرة عامة" },
        ]}
        title="لوحة التحكم الإدارية"
        description="ملخص شامل للمحتوى والأعمال النشطة، ومتابعة إحصائيات الفصول والبلاغات الإشرافية المعلقة."
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

      {/* Moderation Notice Banner if open reports exist */}
      {metrics.openReports > 0 && !noticeDismissed ? (
        <AdminNoticeBanner
          variant="warning"
          title="تنبيه إشرافي: بلاغات مفتوحة تحتاج للمراجعة"
          description={`يوجد حاليًا ${metrics.openReports.toLocaleString(
            "ar-EG",
          )} بلاغات بانتظار مراجعة الإدارة والتحقق من سلامة التعليقات والمحتوى.`}
          actionLabel="مراجعة البلاغات"
          actionHref="/admin/reports"
          onDismiss={() => {
            setNoticeDismissed(true);
          }}
        />
      ) : null}

      {/* 6 Metric Cards */}
      <section aria-label="إحصائيات المنصة" className={styles["statsGrid"]}>
        <AdminStatCard
          title="الأعمال المنشورة"
          value={metrics.publishedWorks}
          icon={FileCheck}
          trend={{ text: "متاحة للجمهور", isPositive: true }}
          action={{ label: "عرض الأعمال", href: "/admin/works" }}
        />
        <AdminStatCard
          title="الأعمال المسودة"
          value={metrics.draftWorks}
          icon={FileText}
          trend={{ text: "قيد التجهيز" }}
          action={{ label: "استعراض", href: "/admin/works" }}
        />
        <AdminStatCard
          title="الفصول المنشورة"
          value={metrics.publishedChapters}
          icon={BookOpen}
          trend={{ text: "فصول مصورة ونصية", isPositive: true }}
        />
        <AdminStatCard
          title="المستخدمون النشطون"
          value={metrics.activeUsers}
          icon={Users}
          trend={{ text: "+12% هذا الشهر", isPositive: true }}
        />
        <AdminStatCard
          title="البلاغات المفتوحة"
          value={metrics.openReports}
          icon={ShieldAlert}
          description="تحتاج معالجة إشرافية"
          action={{ label: "فحص البلاغات", href: "/admin/reports" }}
        />
        <AdminStatCard
          title="رسائل التواصل"
          value={metrics.unreadMessages}
          icon={Mail}
          description="رسائل دعم غير مقروءة"
          action={{ label: "قراءة الرسائل", href: "/admin/contact" }}
        />
      </section>

      {/* Main Content Grid: Recent Works (2 cols) & Activity + Trending (1 col) */}
      <div className={styles["mainGrid"]}>
        {/* Left/Main Column: Recent Works */}
        <section aria-label="أحدث الأعمال المحدثة" className={styles["panel"]}>
          <div className={styles["panelHeader"]}>
            <h2 className={styles["panelTitle"]}>
              <Layers className={styles["panelTitleIcon"]} aria-hidden="true" />
              <span>أحدث الأعمال</span>
            </h2>
            <Link href={"/admin/works"} className={styles["viewAllLink"]}>
              <span>
                عرض كل الأعمال ({works.length.toLocaleString("ar-EG")})
              </span>
              <ArrowLeft size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles["worksList"]}>
            {recentWorks.map((work) => (
              <div key={work.id} className={styles["workRow"]}>
                <div className={styles["workInfo"]}>
                  <Image
                    src={work.coverImage}
                    alt={`غلاف ${work.title}`}
                    width={48}
                    height={68}
                    className={styles["workCover"]}
                    unoptimized
                  />
                  <div className={styles["workMeta"]}>
                    <h3 className={styles["workTitle"]}>{work.title}</h3>
                    <div className={styles["workBadges"]}>
                      <AdminStatusBadge kind="workType" status={work.type} />
                      <AdminStatusBadge
                        kind="publish"
                        status={work.publishStatus}
                      />
                      <span className={styles["workStats"]}>
                        {work.chapterCount.toLocaleString("ar-EG")} فصول • آخر
                        تحديث: {work.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles["workActions"]}>
                  <Link
                    href={`/admin/works/${work.id}/chapters` as Route}
                    className={styles["actionBtn"]}
                  >
                    الفصول
                  </Link>
                  <Link
                    href={`/admin/works/${work.id}/edit` as Route}
                    className={cn(styles["actionBtn"], styles["editBtn"])}
                  >
                    <Edit3 size={13} aria-hidden="true" />
                    <span>تعديل</span>
                  </Link>
                  <Link
                    href={`/story/${work.id}` as Route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles["actionBtn"]}
                    aria-label={`معاينة ${work.title} في الموقع العام`}
                    title="معاينة في الموقع العام"
                  >
                    <ExternalLink size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Recent Activity & Most Read */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Most Read Works Panel */}
          <section
            aria-label="الأعمال الأكثر قراءة"
            className={styles["panel"]}
          >
            <div className={styles["panelHeader"]}>
              <h2 className={styles["panelTitle"]}>
                <TrendingUp
                  className={styles["panelTitleIcon"]}
                  aria-hidden="true"
                />
                <span>الأكثر قراءة</span>
              </h2>
            </div>

            <div className={styles["trendingList"]}>
              {trendingWorks.map((work, index) => (
                <div key={work.id} className={styles["trendingItem"]}>
                  <span
                    className={cn(
                      styles["trendingRank"],
                      index === 0 && styles["trendingRank1"],
                    )}
                  >
                    {index + 1}
                  </span>
                  <Link
                    href={`/admin/works/${work.id}/edit` as Route}
                    className={styles["trendingTitle"]}
                  >
                    {work.title}
                  </Link>
                  <span className={styles["trendingViews"]}>
                    {work.views.toLocaleString("ar-EG")} قراءة
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Panel */}
          <section aria-label="سجل النشاط الأخير" className={styles["panel"]}>
            <div className={styles["panelHeader"]}>
              <h2 className={styles["panelTitle"]}>
                <Activity
                  className={styles["panelTitleIcon"]}
                  aria-hidden="true"
                />
                <span>سجل النشاط الإداري</span>
              </h2>
            </div>

            <div className={styles["activityList"]}>
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className={styles["activityItem"]}>
                  <div className={styles["activityDot"]} aria-hidden="true" />
                  <div className={styles["activityContent"]}>
                    <h3 className={styles["activityTitle"]}>{act.title}</h3>
                    <p className={styles["activityDesc"]}>{act.description}</p>
                    <span className={styles["activityMeta"]}>
                      {act.timestamp} • بواسطة {act.actor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

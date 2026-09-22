"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, BookOpen } from "lucide-react";
import { useAdminData } from "../../context/admin-context";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminWorkForm } from "../AdminWorkForm/AdminWorkForm";

interface AdminWorkEditProps {
  workId: string;
}

export function AdminWorkEdit({ workId }: AdminWorkEditProps) {
  const { getWork } = useAdminData();
  const work = getWork(workId);

  if (!work) {
    return (
      <div>
        <AdminPageHeader
          breadcrumbs={[
            { label: "لوحة الإدارة", href: "/admin/dashboard" },
            { label: "الأعمال", href: "/admin/works" },
            { label: "عمل غير موجود" },
          ]}
          title="العمل المطلوب غير موجود"
        />

        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "0.875rem",
            padding: "3.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            textAlign: "center",
          }}
          role="alert"
        >
          <AlertCircle size={48} color="var(--primary)" aria-hidden="true" />
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
            }}
          >
            تعذّر العثور على العمل المطلوب
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--muted-foreground)",
              maxWidth: "28rem",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            لم نتمكن من العثور على عمل بالمعرّف &ldquo;{workId}&rdquo;. قد يكون
            تم حذفه أو أن المعرّف في الرابط غير صحيح.
          </p>
          <Link
            href={"/admin/works"}
            className="button button--small"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>العودة لقائمة الأعمال</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "الأعمال", href: "/admin/works" },
          { label: work.title, href: `/admin/works/${work.id}/chapters` },
          { label: "تعديل البيانات" },
        ]}
        title={`تعديل: ${work.title}`}
        description="تعديل البيانات الأساسية للعمل، التصنيفات، وسائط الغلاف، وإدارة خيارات النشر والأرشفة."
        secondaryAction={{
          label: "إدارة الفصول",
          href: `/admin/works/${work.id}/chapters`,
          icon: BookOpen,
        }}
      />

      <AdminWorkForm mode="edit" initialWork={work} />
    </div>
  );
}

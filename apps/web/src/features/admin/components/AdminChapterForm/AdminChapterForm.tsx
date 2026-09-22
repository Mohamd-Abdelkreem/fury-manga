"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  ArrowRight,
  BookOpen,
  Eye,
  FileText,
  Image as ImageIcon,
  Info,
  Save,
  Send,
} from "lucide-react";
import { useAdminData } from "../../context/admin-context";
import type {
  AdminContentType,
  AdminPublishStatus,
} from "../../types/admin.types";
import { AdminNoticeBanner } from "../AdminNoticeBanner/AdminNoticeBanner";
import { AdminStatusBadge } from "../AdminStatusBadge/AdminStatusBadge";
import { IllustratedChapterEditor } from "./IllustratedChapterEditor";
import { TextChapterEditor } from "./TextChapterEditor";
import { ChapterPreviewModal } from "./ChapterPreviewModal";
import { cn } from "@/lib/utils";
import styles from "./AdminChapterForm.module.css";

interface AdminChapterFormProps {
  workId: string;
  chapterId?: string | undefined;
}

export function AdminChapterForm({ workId, chapterId }: AdminChapterFormProps) {
  const router = useRouter();
  const { getWork, getChapter, getChapters, createChapter, updateChapter } =
    useAdminData();

  const work = getWork(workId);
  const existingChapter =
    chapterId !== undefined ? getChapter(workId, chapterId) : undefined;
  const isEdit = existingChapter !== undefined;

  const chaptersList = getChapters(workId);
  const nextChapterNumber =
    chaptersList.length > 0
      ? Math.max(...chaptersList.map((c) => c.number)) + 1
      : 1;

  // Form State
  const [number, setNumber] = useState<number>(() =>
    isEdit ? existingChapter.number : nextChapterNumber,
  );
  const [title, setTitle] = useState<string>(() =>
    isEdit ? existingChapter.title : "",
  );
  const [contentType, setContentType] = useState<AdminContentType>(() => {
    if (isEdit) return existingChapter.contentType;
    if (work?.type === "novel" || work?.type === "text-story") return "text";
    return "illustrated";
  });
  const [status, setStatus] = useState<AdminPublishStatus>(() =>
    isEdit ? existingChapter.status : "draft",
  );
  const [pages, setPages] = useState<string[]>(() => {
    if (isEdit && existingChapter.pages) return existingChapter.pages;
    if (contentType === "illustrated") {
      return ["/anime/341452.jpg", "/anime/603242.jpg"];
    }
    return [];
  });
  const [textContent, setTextContent] = useState<string>(() => {
    if (isEdit && existingChapter.textContent)
      return existingChapter.textContent;
    return "";
  });

  const [errors, setErrors] = useState<{
    number?: string | undefined;
    title?: string | undefined;
  }>({});
  const [notice, setNotice] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!work) {
    return (
      <div className={styles["container"]}>
        <div className={styles["card"]}>
          <div className={styles["emptyState"]}>
            <p className={styles["emptyStateTitle"]}>العمل غير موجود</p>
            <p className={styles["emptyStateText"]}>
              تعذر العثور على العمل المطلوب بالمعرّف المذكور.
            </p>
            <Link href="/admin/works" className={styles["btnPrimary"]}>
              العودة لقائمة الأعمال
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const nextErrors: {
      number?: string | undefined;
      title?: string | undefined;
    } = {};
    if (isNaN(number) || number < 0) {
      nextErrors.number = "يجب تحديد رقم فصل صحيح (0 أو أكبر).";
    }
    if (!title.trim()) {
      nextErrors.title = "يرجى كتابة عنوان للفصل.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (publishNow = false) => {
    if (!validate()) {
      setNotice({
        type: "error",
        message: "يرجى تصحيح الأخطاء في النموذج قبل الحفظ.",
      });
      return;
    }

    setIsSubmitting(true);
    const effectiveStatus: AdminPublishStatus = publishNow
      ? "published"
      : status;

    if (isEdit && chapterId !== undefined) {
      updateChapter(workId, chapterId, {
        number,
        title: title.trim(),
        contentType,
        status: effectiveStatus,
        pages: contentType === "illustrated" ? pages : undefined,
        textContent: contentType === "text" ? textContent : undefined,
      });
      setNotice({
        type: "success",
        message: "تم تحديث بيانات الفصل بنجاح.",
      });
    } else {
      createChapter(workId, {
        number,
        title: title.trim(),
        contentType,
        status: effectiveStatus,
        pages: contentType === "illustrated" ? pages : undefined,
        textContent: contentType === "text" ? textContent : undefined,
      });
      setNotice({
        type: "success",
        message: "تم إنشاء الفصل بنجاح وإضافته لقائمة الفصول.",
      });
    }

    setIsSubmitting(false);

    setTimeout(() => {
      router.push(`/admin/works/${workId}/chapters` as Route);
    }, 900);
  };

  return (
    <div className={styles["container"]}>
      {/* Header & Breadcrumbs */}
      <div className={styles["header"]}>
        <nav className={styles["breadcrumbs"]} aria-label="مسار التنقل">
          <Link href="/admin/dashboard" className={styles["breadcrumbLink"]}>
            لوحة الإدارة
          </Link>
          <span className={styles["breadcrumbSeparator"]}>/</span>
          <Link href="/admin/works" className={styles["breadcrumbLink"]}>
            إدارة الأعمال
          </Link>
          <span className={styles["breadcrumbSeparator"]}>/</span>
          <Link
            href={`/admin/works/${work.id}/chapters` as Route}
            className={styles["breadcrumbLink"]}
          >
            {work.title}
          </Link>
          <span className={styles["breadcrumbSeparator"]}>/</span>
          <span className={styles["breadcrumbCurrent"]}>
            {isEdit ? `تعديل الفصل ${String(number)}` : "إضافة فصل جديد"}
          </span>
        </nav>

        <div className={styles["headerMain"]}>
          <div className={styles["titleArea"]}>
            <div className={styles["titleRow"]}>
              <h1 className={styles["title"]}>
                {isEdit
                  ? `تعديل الفصل ${String(number)}: ${existingChapter.title}`
                  : `إضافة فصل جديد إلى "${work.title}"`}
              </h1>
              {isEdit && <AdminStatusBadge kind="publish" status={status} />}
            </div>
            <p className={styles["subtitle"]}>
              {isEdit
                ? "تحديث صفحات الفصل، النصوص، وإدارة حالة النشر."
                : "أدخل بيانات الفصل ورقم التسلسل وجهّز المحتوى المصور أو النصي."}
            </p>
          </div>

          <div className={styles["actionsArea"]}>
            <button
              type="button"
              onClick={() => {
                setIsPreviewOpen(true);
              }}
              className={styles["btnSecondary"]}
            >
              <Eye style={{ width: "1rem", height: "1rem" }} />
              معاينة القارئ
            </button>
            <button
              type="button"
              onClick={() => {
                handleSave(false);
              }}
              disabled={isSubmitting}
              className={styles["btnSecondary"]}
            >
              <Save style={{ width: "1rem", height: "1rem" }} />
              حفظ كمسودة
            </button>
            <button
              type="button"
              onClick={() => {
                handleSave(true);
              }}
              disabled={isSubmitting}
              className={styles["btnPrimary"]}
            >
              <Send style={{ width: "1rem", height: "1rem" }} />
              حفظ ونشر
            </button>
          </div>
        </div>
      </div>

      {notice && (
        <AdminNoticeBanner
          title={notice.type === "error" ? "تنبيه" : "تم بنجاح"}
          description={notice.message}
          variant={notice.type === "error" ? "warning" : "success"}
          onDismiss={() => {
            setNotice(null);
          }}
        />
      )}

      {/* Main Form Layout */}
      <div className={styles["layoutGrid"]}>
        <div className={styles["mainColumn"]}>
          {/* Section 1: Basic Info */}
          <div className={styles["card"]}>
            <div className={styles["cardHeader"]}>
              <h2 className={styles["cardTitle"]}>
                <BookOpen className={styles["cardIcon"]} />
                البيانات الأساسية للفصل
              </h2>
            </div>

            <div className={styles["fieldsGrid2"]}>
              <div className={styles["field"]}>
                <label htmlFor="chapter-number" className={styles["label"]}>
                  رقم الفصل
                  <span className={styles["requiredMark"]}>*</span>
                </label>
                <input
                  id="chapter-number"
                  type="number"
                  step="0.1"
                  min="0"
                  className={cn(
                    styles["input"],
                    errors.number && styles["inputError"],
                  )}
                  value={isNaN(number) ? "" : number}
                  onChange={(e) => {
                    setNumber(parseFloat(e.target.value));
                  }}
                  placeholder="مثال: 44 أو 44.5"
                />
                {errors.number && (
                  <span className={styles["errorText"]}>{errors.number}</span>
                )}
              </div>

              <div className={styles["field"]}>
                <label htmlFor="chapter-title" className={styles["label"]}>
                  عنوان الفصل
                  <span className={styles["requiredMark"]}>*</span>
                </label>
                <input
                  id="chapter-title"
                  type="text"
                  className={cn(
                    styles["input"],
                    errors.title && styles["inputError"],
                  )}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  placeholder="مثال: استيقاظ السمة النادرة"
                />
                {errors.title && (
                  <span className={styles["errorText"]}>{errors.title}</span>
                )}
              </div>
            </div>

            <div className={styles["field"]}>
              <label className={styles["label"]}>
                نوع محتوى الفصل
                <span className={styles["requiredMark"]}>*</span>
              </label>
              <div className={styles["contentTypeSelector"]}>
                <div
                  className={cn(
                    styles["typeOption"],
                    contentType === "illustrated" && styles["typeOptionActive"],
                  )}
                  onClick={() => {
                    setContentType("illustrated");
                  }}
                  role="radio"
                  aria-checked={contentType === "illustrated"}
                  tabIndex={0}
                >
                  <ImageIcon
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      color:
                        contentType === "illustrated"
                          ? "var(--primary)"
                          : "rgba(255,255,255,0.5)",
                    }}
                  />
                  <div className={styles["typeOptionText"]}>
                    <span className={styles["typeOptionTitle"]}>فصل مصور</span>
                    <span className={styles["typeOptionDesc"]}>
                      مانغا، مانهوا، كوميكس (رفع وترتيب صفحات صور)
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    styles["typeOption"],
                    contentType === "text" && styles["typeOptionActive"],
                  )}
                  onClick={() => {
                    setContentType("text");
                  }}
                  role="radio"
                  aria-checked={contentType === "text"}
                  tabIndex={0}
                >
                  <FileText
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      color:
                        contentType === "text"
                          ? "var(--primary)"
                          : "rgba(255,255,255,0.5)",
                    }}
                  />
                  <div className={styles["typeOptionText"]}>
                    <span className={styles["typeOptionTitle"]}>فصل نصي</span>
                    <span className={styles["typeOptionDesc"]}>
                      روايات وقصص نصية (محرر غني بالعناوين والفقرات)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Editor (Illustrated or Text) */}
          {contentType === "illustrated" ? (
            <IllustratedChapterEditor pages={pages} onChange={setPages} />
          ) : (
            <TextChapterEditor
              content={textContent}
              onChange={setTextContent}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className={styles["sidebarColumn"]}>
          {/* Work Summary Card */}
          <div className={styles["card"]}>
            <div className={styles["cardHeader"]}>
              <h3
                className={styles["cardTitle"]}
                style={{ fontSize: "0.9375rem" }}
              >
                العمل التابع له
              </h3>
            </div>
            <div className={styles["workSummaryCard"]}>
              <div className={styles["workCoverThumb"]}>
                <Image
                  src={work.coverImage}
                  alt={work.title}
                  fill
                  sizes="60px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <div className={styles["workSummaryInfo"]}>
                <h4 className={styles["workSummaryTitle"]}>{work.title}</h4>
                <p className={styles["workSummaryMeta"]}>
                  المؤلف: {work.author}
                </p>
                <p className={styles["workSummaryMeta"]}>
                  عدد الفصول الحالي: {String(work.chapterCount)}
                </p>
              </div>
            </div>
            <Link
              href={`/admin/works/${work.id}/chapters` as Route}
              className={styles["btnSecondary"]}
              style={{ fontSize: "0.8125rem", justifyContent: "center" }}
            >
              عرض كل فصول العمل
              <ArrowRight style={{ width: "0.875rem", height: "0.875rem" }} />
            </Link>
          </div>

          {/* Status & Publication Card */}
          <div className={styles["card"]}>
            <div className={styles["cardHeader"]}>
              <h3
                className={styles["cardTitle"]}
                style={{ fontSize: "0.9375rem" }}
              >
                حالة الفصل
              </h3>
            </div>

            <div className={styles["field"]}>
              <label htmlFor="chapter-status" className={styles["label"]}>
                حالة النشر
              </label>
              <select
                id="chapter-status"
                className={styles["select"]}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as AdminPublishStatus);
                }}
              >
                <option value="draft">مسودة (غير ظاهر للقراء)</option>
                <option value="published">منشور (متاح للقراءة)</option>
                <option value="archived">مؤرشف (محفوظ في الأرشيف)</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.02)",
                padding: "0.75rem",
                borderRadius: "0.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>تاريخ الإنشاء:</span>
                <span style={{ color: "#fff" }}>
                  {isEdit ? existingChapter.publishedAt : "اليوم"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>عدد المشاهدات:</span>
                <span style={{ color: "#fff" }}>
                  {isEdit ? String(existingChapter.views) : "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Guidelines / Tips Card */}
          <div className={styles["card"]}>
            <div className={styles["cardHeader"]}>
              <h3
                className={styles["cardTitle"]}
                style={{ fontSize: "0.9375rem" }}
              >
                <Info className={styles["cardIcon"]} />
                إرشادات المحتوى
              </h3>
            </div>
            <div className={styles["sidebarList"]}>
              <div className={styles["sidebarListItem"]}>
                <span className={styles["sidebarListDot"]}>•</span>
                <span>
                  تأكد من تسلسل ترقيم الصفحات بحيث تعكس اتجاه القراءة المعتمد
                  (من اليمين لليسار أو العكس).
                </span>
              </div>
              <div className={styles["sidebarListItem"]}>
                <span className={styles["sidebarListDot"]}>•</span>
                <span>
                  في الفصول النصية، احرص على استخدام عناوين فرعية (عنوان 2
                  وعنوان 3) لتقسيم المشاهد الطويلة.
                </span>
              </div>
              <div className={styles["sidebarListItem"]}>
                <span className={styles["sidebarListDot"]}>•</span>
                <span>
                  يمكنك حفظ الفصل كمسودة لتجربة التنسيق في المعاينة قبل إطلاقه
                  رسمياً للقراء.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <ChapterPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
        }}
        workTitle={work.title}
        chapterNumber={number}
        chapterTitle={title}
        contentType={contentType}
        pages={pages}
        textContent={textContent}
      />
    </div>
  );
}

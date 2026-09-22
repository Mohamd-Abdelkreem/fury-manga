"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Archive,
  BookOpen,
  CheckCircle,
  ExternalLink,
  EyeOff,
  RotateCcw,
  Save,
  Send,
} from "lucide-react";
import { useAdminData } from "../../context/admin-context";
import type { AdminPublishStatus, AdminWork } from "../../types/admin.types";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminNoticeBanner } from "../AdminNoticeBanner/AdminNoticeBanner";
import { AdminStatusBadge } from "../AdminStatusBadge/AdminStatusBadge";
import { AdminWorkBasicFields } from "./AdminWorkBasicFields";
import { AdminWorkMediaFields } from "./AdminWorkMediaFields";
import { AdminWorkSeoPreview } from "./AdminWorkSeoPreview";
import type { FormErrors, FormValues } from "./form.types";
import styles from "./AdminWorkForm.module.css";

const DEFAULT_COVER = "/anime/01.jpg";
const DEFAULT_BANNER = "/anime/02.jpg";

const SAMPLE_COVERS = [
  "/anime/341452.jpg",
  "/anime/366722.jpg",
  "/anime/384226.jpg",
  "/anime/411246.jpg",
  "/anime/463379.jpg",
  "/anime/463592.jpg",
  "/anime/472451.jpg",
  "/anime/473048.jpg",
];

const SAMPLE_BANNERS = [
  "/anime/603242.jpg",
  "/anime/604271.jpg",
  "/anime/484571.jpg",
];

interface AdminWorkFormProps {
  mode: "create" | "edit";
  initialWork?: AdminWork | undefined;
}

export function AdminWorkForm({ mode, initialWork }: AdminWorkFormProps) {
  const router = useRouter();
  const {
    createWork,
    updateWork,
    toggleWorkPublish,
    archiveWork,
    restoreWork,
  } = useAdminData();

  const isEdit = mode === "edit" && initialWork !== undefined;

  // Form State
  const [values, setValues] = useState<FormValues>(() => {
    if (isEdit) {
      return {
        title: initialWork.title,
        alternativeTitle: initialWork.alternativeTitle ?? "",
        type: initialWork.type,
        storyStatus: initialWork.storyStatus,
        publishStatus: initialWork.publishStatus,
        description: initialWork.description,
        author: initialWork.author,
        artist: initialWork.artist ?? "",
        genres: [...initialWork.genres],
        tags: initialWork.tags.join("، "),
        coverImage: initialWork.coverImage,
        bannerImage: initialWork.bannerImage ?? "",
      };
    }
    return {
      title: "",
      alternativeTitle: "",
      type: "manhwa",
      storyStatus: "ongoing",
      publishStatus: "draft",
      description: "",
      author: "",
      artist: "",
      genres: ["أكشن", "فنتازيا"],
      tags: "",
      coverImage: DEFAULT_COVER,
      bannerImage: DEFAULT_BANNER,
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Field refs for auto-focusing on validation failure
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);

  // Dialog State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    action: "unpublish" | "archive" | "restore" | "discard";
  }>({
    isOpen: false,
    action: "discard",
  });

  // Handle field change
  const handleChange = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Toggle Genre
  const handleToggleGenre = (genre: string) => {
    setValues((prev) => {
      const exists = prev.genres.includes(genre);
      const nextGenres = exists
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres: nextGenres };
    });
    setIsDirty(true);
  };

  // Cycle cover image from sample set
  const handleCycleCover = () => {
    const currentIndex = SAMPLE_COVERS.indexOf(values.coverImage);
    const nextIndex = (currentIndex + 1) % SAMPLE_COVERS.length;
    handleChange("coverImage", SAMPLE_COVERS[nextIndex] ?? DEFAULT_COVER);
  };

  // Cycle banner image
  const handleCycleBanner = () => {
    const currentIndex = SAMPLE_BANNERS.indexOf(values.bannerImage);
    const nextIndex = (currentIndex + 1) % SAMPLE_BANNERS.length;
    handleChange("bannerImage", SAMPLE_BANNERS[nextIndex] ?? DEFAULT_BANNER);
  };

  // Validate form
  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = "يرجى إدخال عنوان العمل بالعربية.";
    }

    if (!values.description.trim()) {
      nextErrors.description = "يرجى كتابة نبذة توضيحية عن العمل.";
    } else if (values.description.trim().length < 20) {
      nextErrors.description = "يجب أن تكون النبذة من 20 حرفًا على الأقل.";
    }

    if (!values.author.trim()) {
      nextErrors.author = "يرجى إدخال اسم المؤلف.";
    }

    if (values.genres.length === 0) {
      nextErrors.genres = "يرجى اختيار تصنيف واحد على الأقل للعمل.";
    }

    setErrors(nextErrors);

    // Auto-focus first invalid field
    if (nextErrors.title) {
      titleRef.current?.focus();
    } else if (nextErrors.description) {
      descRef.current?.focus();
    } else if (nextErrors.author) {
      authorRef.current?.focus();
    }

    return Object.keys(nextErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (submitStatus: AdminPublishStatus) => {
    if (!validate()) return;

    setIsSubmitting(true);

    const parsedTags = values.tags
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean);

    await new Promise((r) => setTimeout(r, 200));

    if (isEdit) {
      updateWork(initialWork.id, {
        title: values.title.trim(),
        alternativeTitle: values.alternativeTitle.trim() || undefined,
        type: values.type,
        storyStatus: values.storyStatus,
        publishStatus: submitStatus,
        description: values.description.trim(),
        author: values.author.trim(),
        artist: values.artist.trim() || undefined,
        genres: values.genres,
        tags: parsedTags,
        coverImage: values.coverImage,
        bannerImage: values.bannerImage || undefined,
      });

      setIsSubmitting(false);
      setIsDirty(false);
      setSuccessMessage("تم حفظ التعديلات بنجاح.");
    } else {
      const created = createWork({
        title: values.title.trim(),
        alternativeTitle: values.alternativeTitle.trim() || undefined,
        type: values.type,
        storyStatus: values.storyStatus,
        publishStatus: submitStatus,
        description: values.description.trim(),
        author: values.author.trim(),
        artist: values.artist.trim() || undefined,
        genres: values.genres,
        tags: parsedTags,
        coverImage: values.coverImage,
        bannerImage: values.bannerImage || undefined,
      });

      setIsSubmitting(false);
      setIsDirty(false);
      setSuccessMessage(`تم إنشاء العمل '${created.title}' بنجاح.`);

      // Navigate to works after brief delay or stay
      setTimeout(() => {
        router.push("/admin/works");
      }, 1000);
    }
  };

  // Execute confirm dialog actions
  const handleDialogConfirm = () => {
    if (!initialWork) return;

    if (dialogState.action === "unpublish") {
      toggleWorkPublish(initialWork.id);
      handleChange("publishStatus", "draft");
    } else if (dialogState.action === "archive") {
      archiveWork(initialWork.id);
      handleChange("publishStatus", "archived");
    } else if (dialogState.action === "restore") {
      restoreWork(initialWork.id);
      handleChange("publishStatus", "draft");
    } else {
      router.push("/admin/works");
    }

    setDialogState({ isOpen: false, action: "discard" });
  };

  // Handle Cancel navigation
  const handleCancelClick = () => {
    if (isDirty) {
      setDialogState({ isOpen: true, action: "discard" });
    } else {
      router.push("/admin/works");
    }
  };

  const slug =
    values.title
      .trim()
      .toLowerCase()
      .replace(/[^\u0621-\u064A\w\s-]/gu, "")
      .replace(/\s+/g, "-") || "new-story";

  return (
    <div className={styles["formLayout"]}>
      {/* Edit mode Work Identity Banner */}
      {isEdit ? (
        <div className={styles["identityBanner"]}>
          <div className={styles["identityMeta"]}>
            <span className={styles["identityId"]}>
              المعرّف: {initialWork.id}
            </span>
            <AdminStatusBadge kind="workType" status={values.type} />
            <AdminStatusBadge kind="story" status={values.storyStatus} />
            <AdminStatusBadge kind="publish" status={values.publishStatus} />
            <span className={styles["identityId"]}>
              الفصول: {initialWork.chapterCount}
            </span>
          </div>

          <div className={styles["quickNavGroup"]}>
            <Link
              href={`/admin/works/${initialWork.id}/chapters` as Route}
              className={styles["quickNavLink"]}
            >
              <BookOpen size={14} aria-hidden="true" />
              <span>إدارة الفصول</span>
            </Link>
            <Link
              href={`/story/${initialWork.id}` as Route}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["quickNavLink"]}
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span>معاينة في الموقع</span>
            </Link>
          </div>
        </div>
      ) : null}

      {/* Success banner */}
      {successMessage ? (
        <AdminNoticeBanner
          variant="success"
          title="تم الحفظ بنجاح"
          description={successMessage}
          actionLabel="العودة لقائمة الأعمال"
          actionHref="/admin/works"
          onDismiss={() => {
            setSuccessMessage(null);
          }}
        />
      ) : null}

      <AdminWorkBasicFields
        values={values}
        errors={errors}
        isEdit={isEdit}
        titleRef={titleRef}
        descRef={descRef}
        authorRef={authorRef}
        onChange={handleChange}
        onToggleGenre={handleToggleGenre}
      />
      <AdminWorkMediaFields
        values={values}
        onChange={handleChange}
        onCycleCover={handleCycleCover}
        onCycleBanner={handleCycleBanner}
      />
      <AdminWorkSeoPreview values={values} slug={slug} />

      {/* Actions Bar */}
      <div className={styles["actionsBar"]}>
        <button
          type="button"
          onClick={handleCancelClick}
          className={styles["cancelBtn"]}
        >
          إلغاء والعودة
        </button>

        <div className={styles["actionButtonsGroup"]}>
          {isEdit ? (
            <>
              {/* Publish / Unpublish Toggle */}
              {values.publishStatus === "published" ? (
                <button
                  type="button"
                  onClick={() => {
                    setDialogState({ isOpen: true, action: "unpublish" });
                  }}
                  className={styles["saveDraftBtn"]}
                >
                  <EyeOff size={16} aria-hidden="true" />
                  <span>إلغاء النشر</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    void handleSubmit("published");
                  }}
                  className={styles["saveDraftBtn"]}
                >
                  <Send size={16} aria-hidden="true" />
                  <span>نشر العمل</span>
                </button>
              )}

              {/* Archive / Restore Toggle */}
              {values.publishStatus !== "archived" ? (
                <button
                  type="button"
                  onClick={() => {
                    setDialogState({ isOpen: true, action: "archive" });
                  }}
                  className={styles["saveDraftBtn"]}
                >
                  <Archive size={16} aria-hidden="true" />
                  <span>أرشفة</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setDialogState({ isOpen: true, action: "restore" });
                  }}
                  className={styles["saveDraftBtn"]}
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  <span>استعادة</span>
                </button>
              )}

              {/* Save changes */}
              <button
                type="button"
                onClick={() => {
                  void handleSubmit(values.publishStatus);
                }}
                disabled={isSubmitting}
                className={styles["publishBtn"]}
              >
                <Save size={16} aria-hidden="true" />
                <span>{isSubmitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}</span>
              </button>
            </>
          ) : (
            <>
              {/* Create Mode: Save as Draft */}
              <button
                type="button"
                onClick={() => {
                  void handleSubmit("draft");
                }}
                disabled={isSubmitting}
                className={styles["saveDraftBtn"]}
              >
                <Save size={16} aria-hidden="true" />
                <span>حفظ كمسودة</span>
              </button>

              {/* Create Mode: Publish */}
              <button
                type="button"
                onClick={() => {
                  void handleSubmit("published");
                }}
                disabled={isSubmitting}
                className={styles["publishBtn"]}
              >
                <CheckCircle size={16} aria-hidden="true" />
                <span>نشر العمل الآن</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={dialogState.isOpen}
        title={
          dialogState.action === "unpublish"
            ? "تأكيد إلغاء النشر"
            : dialogState.action === "archive"
              ? "تأكيد أرشفة العمل"
              : dialogState.action === "restore"
                ? "استعادة العمل"
                : "مغادرة الصفحة وتجاهل التعديلات؟"
        }
        description={
          dialogState.action === "unpublish"
            ? "هل أنت متأكد من إلغاء نشر هذا العمل وتحويله لمسودة؟"
            : dialogState.action === "archive"
              ? "هل تريد نقل هذا العمل للأرشيف؟ لن يظهر للزوار في الموقع."
              : dialogState.action === "restore"
                ? "استعادة هذا العمل من الأرشيف كمسودة؟"
                : "لديك تعديلات غير محفوظة، هل أنت متأكد من رغبتك في المغادرة وإلغاء هذه التغييرات؟"
        }
        confirmLabel={
          dialogState.action === "discard" ? "مغادرة وتجاهل" : "تأكيد"
        }
        onConfirm={handleDialogConfirm}
        onCancel={() => {
          setDialogState({ isOpen: false, action: "discard" });
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Eye, Save } from "lucide-react";
import { ZodError } from "zod";
import type { PublicationStatus } from "@fury/contracts";
import { cn } from "@/lib/utils";

import { SafeAdminContentError } from "../../api/admin-content.api";
import {
  adminChapterErrorMessage,
  chapterFieldErrors,
} from "../../model/admin-content.errors";
import { useAdminWorkDetail } from "../../hooks/admin-content.hooks";
import {
  useAdminChapterDetail,
  useSaveAdminChapter,
  usePublishAdminChapter,
} from "../../hooks/admin-chapter.hooks";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import {
  createIllustratedChapterCommand,
  savedChapterPages,
  updateIllustratedChapterCommand,
  type EditableChapterPage,
} from "../../model/admin-chapter-editor";
import {
  createTextChapterCommand,
  savedTextBlocks as readSavedTextBlocks,
  updateTextChapterCommand,
  type EditableTextBlock,
} from "../../model/admin-chapter-text";
import { IllustratedChapterEditor } from "./IllustratedChapterEditor";
import { TextChapterEditor } from "./TextChapterEditor";
import { ChapterPreviewModal } from "./ChapterPreviewModal";
import styles from "./AdminChapterForm.module.css";

interface AdminChapterFormProps {
  workId: string;
  chapterId?: string | undefined;
}

export function AdminChapterForm({ workId, chapterId }: AdminChapterFormProps) {
  const router = useRouter();
  const work = useAdminWorkDetail(workId);
  const detail = useAdminChapterDetail(workId, chapterId);
  const save = useSaveAdminChapter();
  const publication = usePublishAdminChapter();
  const [publicationTarget, setPublicationTarget] =
    useState<PublicationStatus | null>(null);
  const [number, setNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState<EditableChapterPage[]>([]);
  const [savedPages, setSavedPages] = useState<EditableChapterPage[]>([]);
  const [textBlocks, setTextBlocks] = useState<EditableTextBlock[]>([]);
  const [savedTextBlocks, setSavedTextBlocks] = useState<EditableTextBlock[]>(
    [],
  );
  const [savedNumber, setSavedNumber] = useState(1);
  const [savedTitle, setSavedTitle] = useState("");
  const [message, setMessage] = useState("");
  const [needsReconcile, setNeedsReconcile] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    number?: string;
    title?: string;
    textContent?: string;
    pages?: string;
  }>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loadedRevision, setLoadedRevision] = useState<{
    chapterId: string;
    version: number;
    actorId: string | null;
  } | null>(null);
  const editRevision = useRef(0);
  const activeActor = useRef(work.actorId);
  const hasUnsavedChanges =
    number !== savedNumber ||
    title !== savedTitle ||
    JSON.stringify(pages) !== JSON.stringify(savedPages) ||
    JSON.stringify(textBlocks) !== JSON.stringify(savedTextBlocks);
  const previousRevision = loadedRevision;
  const serverRevisionChanged =
    detail.data !== undefined &&
    detail.data.id === chapterId &&
    detail.data.workId === workId &&
    previousRevision?.chapterId === detail.data.id &&
    previousRevision.actorId === work.actorId &&
    detail.data.version > previousRevision.version &&
    (hasUnsavedChanges || save.isPending);
  const requiresComparison = needsReconcile || serverRevisionChanged;

  useEffect(() => {
    activeActor.current = work.actorId;
    return () => {
      activeActor.current = null;
    };
  }, [work.actorId]);

  const incoming = detail.data;
  if (
    incoming !== undefined &&
    incoming.id === chapterId &&
    incoming.workId === workId &&
    work.actorId !== null &&
    work.actorId === detail.actorId &&
    (loadedRevision?.chapterId !== incoming.id ||
      loadedRevision.actorId !== work.actorId ||
      (incoming.version > loadedRevision.version &&
        !hasUnsavedChanges &&
        !save.isPending))
  ) {
    setLoadedRevision({
      chapterId: incoming.id,
      version: incoming.version,
      actorId: work.actorId,
    });
    setNumber(incoming.number);
    setTitle(incoming.title);
    setPages(savedChapterPages(incoming));
    setSavedPages(savedChapterPages(incoming));
    setTextBlocks(readSavedTextBlocks(incoming));
    setSavedTextBlocks(readSavedTextBlocks(incoming));
    setSavedNumber(incoming.number);
    setSavedTitle(incoming.title);
    setNeedsReconcile(false);
  }

  const changePages = (next: EditableChapterPage[]) => {
    editRevision.current += 1;
    setPages(next);
  };

  const changeTextBlocks = (next: EditableTextBlock[]) => {
    editRevision.current += 1;
    setTextBlocks(next);
  };

  const handleSave = async () => {
    if (
      save.isPending ||
      publication.isPending ||
      work.data === undefined ||
      work.denied ||
      detail.denied ||
      work.isError ||
      detail.isError ||
      requiresComparison ||
      work.actorId === null ||
      activeActor.current !== work.actorId
    )
      return;
    setMessage("");
    setFieldErrors({});
    setNeedsReconcile(false);
    const editing = chapterId !== undefined;
    const chapter = detail.data;
    if (editing && chapter === undefined) return;
    const actorAtSubmit = work.actorId;
    const revisionAtSubmit = editRevision.current;
    try {
      const textWork =
        work.data.type === "novel" || work.data.type === "text-story";
      const saved =
        editing && chapter !== undefined
          ? await save.mutateAsync({
              operation: "update",
              workId,
              chapterId: chapter.id,
              body: textWork
                ? updateTextChapterCommand(chapter, number, title, textBlocks)
                : updateIllustratedChapterCommand(
                    chapter,
                    number,
                    title,
                    pages,
                  ),
            })
          : await save.mutateAsync({
              operation: "create",
              workId,
              body: textWork
                ? createTextChapterCommand(number, title, textBlocks)
                : createIllustratedChapterCommand(number, title, pages),
            });
      if (activeActor.current !== actorAtSubmit) return;
      setSavedPages(savedChapterPages(saved));
      setSavedTextBlocks(readSavedTextBlocks(saved));
      setSavedNumber(saved.number);
      setSavedTitle(saved.title);
      if (editRevision.current === revisionAtSubmit) {
        setNumber(saved.number);
        setTitle(saved.title);
        setPages(savedChapterPages(saved));
        setTextBlocks(readSavedTextBlocks(saved));
      }
      setLoadedRevision({
        chapterId: saved.id,
        version: saved.version,
        actorId: actorAtSubmit,
      });
      setMessage("حُفظت مسودة الفصل على الخادم.");
      if (!editing) {
        router.replace(
          `/admin/works/${workId}/chapters/${saved.id}/edit` as Route,
        );
      }
    } catch (error: unknown) {
      if (activeActor.current !== actorAtSubmit) return;
      if (error instanceof ZodError) {
        const fields = new Set(error.issues.map(({ path }) => path[0]));
        setFieldErrors({
          ...(fields.has("number")
            ? { number: "أدخل رقم فصل صحيحاً أكبر من صفر." }
            : {}),
          ...(fields.has("title")
            ? { title: "أدخل عنواناً صالحاً للفصل." }
            : {}),
          ...(fields.has("textContent")
            ? {
                textContent: "راجع المقاطع والروابط؛ لا يمكن حفظ نص غير مكتمل.",
              }
            : {}),
        });
        setMessage("راجع بيانات الفصل قبل الحفظ.");
        return;
      }
      if (error instanceof SafeAdminContentError) {
        setFieldErrors(chapterFieldErrors(error));
        setNeedsReconcile(
          error.code === "CONTENT_STALE_WRITE" ||
            error.code === "NETWORK_ERROR" ||
            error.code === "SERVICE_UNAVAILABLE" ||
            error.code === "INTERNAL_SERVER_ERROR" ||
            error.code === "HTTP_ERROR",
        );
        setMessage(adminChapterErrorMessage(error));
        return;
      }
      setMessage("تعذر تأكيد حفظ الفصل. بقيت تعديلاتك في النموذج.");
    }
  };

  const reconcileSavedChapter = async () => {
    const actorAtRead = work.actorId;
    let latest;
    try {
      latest = await detail.retryAccess();
    } catch {
      setMessage(
        "تعذر قراءة النسخة المحفوظة. احتفظ بتعديلاتك وأعد المحاولة لاحقًا.",
      );
      return;
    }
    if (actorAtRead === null || activeActor.current !== actorAtRead) return;
    setLoadedRevision({
      chapterId: latest.id,
      version: latest.version,
      actorId: actorAtRead,
    });
    setSavedNumber(latest.number);
    setSavedTitle(latest.title);
    setSavedPages(savedChapterPages(latest));
    setSavedTextBlocks(readSavedTextBlocks(latest));
    setNeedsReconcile(false);
    setMessage(
      "حُمّلت النسخة المحفوظة للمقارنة. بقيت تعديلاتك الحالية كما هي.",
    );
  };

  const confirmPublication = async () => {
    const chapter = detail.data;
    const targetState = publicationTarget;
    if (
      chapter === undefined ||
      targetState === null ||
      work.denied ||
      detail.denied ||
      work.isError ||
      detail.isError ||
      publication.isPending ||
      save.isPending ||
      hasUnsavedChanges ||
      requiresComparison
    )
      return;
    setMessage("");
    const actorAtSubmit = work.actorId;
    try {
      const confirmed = await publication.mutateAsync({
        workId,
        chapterId: chapter.id,
        body: { expectedVersion: chapter.version, targetState },
      });
      if (actorAtSubmit === null || activeActor.current !== actorAtSubmit)
        return;
      setMessage(
        confirmed.transition.transitioned
          ? "تم تأكيد تغيير حالة الفصل المحفوظة."
          : "حالة الفصل محفوظة بالفعل.",
      );
    } catch (error: unknown) {
      if (actorAtSubmit === null || activeActor.current !== actorAtSubmit)
        return;
      setNeedsReconcile(true);
      setMessage(adminChapterErrorMessage(error));
    } finally {
      if (actorAtSubmit !== null && activeActor.current === actorAtSubmit)
        setPublicationTarget(null);
    }
  };

  if (
    !work.sessionReady ||
    (work.available && work.isPending && !work.denied) ||
    (chapterId !== undefined &&
      detail.actorId !== null &&
      detail.isPending &&
      !detail.denied)
  ) {
    return <p role="status">جارٍ تحميل بيانات الفصل…</p>;
  }
  if (
    !work.available ||
    work.denied ||
    detail.denied ||
    work.isError ||
    detail.isError ||
    work.data === undefined ||
    (chapterId !== undefined &&
      (detail.data === undefined ||
        detail.data.id !== chapterId ||
        detail.data.workId !== workId ||
        detail.actorId !== work.actorId))
  ) {
    return (
      <section className={styles["card"]} role="alert">
        <p>تعذر تحميل العمل أو الفصل. تحقق من الصلاحية وأعد المحاولة.</p>
        <button
          type="button"
          className={cn(styles["btn"], styles["btnSecondary"])}
          onClick={() => {
            void work.retryAccess().catch((error: unknown) => {
              setMessage(adminChapterErrorMessage(error));
            });
            if (chapterId !== undefined) {
              void detail.retryAccess().catch((error: unknown) => {
                setMessage(adminChapterErrorMessage(error));
              });
            }
          }}
        >
          إعادة المحاولة
        </button>
        {message && <p role="status">{message}</p>}
      </section>
    );
  }

  const illustrated =
    work.data.type !== "novel" && work.data.type !== "text-story";
  const chapterState = detail.data?.publicationStatus;
  return (
    <main className={styles["container"]} dir="rtl">
      <div className={styles["header"]}>
        <nav className={styles["breadcrumbs"]} aria-label="مسار التنقل">
          <Link href="/admin/works" className={styles["breadcrumbLink"]}>
            الأعمال
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/admin/works/${workId}/chapters` as Route}
            className={styles["breadcrumbLink"]}
          >
            {work.data.title}
          </Link>
        </nav>
        <div className={styles["headerMain"]}>
          <div className={styles["titleArea"]}>
            <h1 className={styles["title"]}>
              {chapterId === undefined
                ? illustrated
                  ? "إضافة فصل مصور"
                  : "إضافة فصل نصي"
                : illustrated
                  ? "تحرير فصل مصور"
                  : "تحرير فصل نصي"}
            </h1>
            <p className={styles["subtitle"]}>
              {illustrated
                ? "نوع الفصل مستمد من نوع العمل. تُحفظ الصفحات بالترتيب المعروض."
                : "نوع الفصل مستمد من نوع العمل. تُحفظ المقاطع النصية بالترتيب المعروض."}
            </p>
          </div>
          <div className={styles["actionsArea"]}>
            {chapterId !== undefined && chapterState !== undefined ? (
              <>
                {chapterState === "draft" ? (
                  <button
                    type="button"
                    className={cn(styles["btn"], styles["btnSecondary"])}
                    disabled={
                      publication.isPending ||
                      save.isPending ||
                      hasUnsavedChanges ||
                      requiresComparison ||
                      !detail.data?.readyForPublication
                    }
                    onClick={() => {
                      setPublicationTarget("published");
                    }}
                  >
                    نشر الفصل
                  </button>
                ) : chapterState === "published" ? (
                  <button
                    type="button"
                    className={cn(styles["btn"], styles["btnSecondary"])}
                    disabled={
                      publication.isPending ||
                      save.isPending ||
                      hasUnsavedChanges ||
                      requiresComparison
                    }
                    onClick={() => {
                      setPublicationTarget("draft");
                    }}
                  >
                    إلغاء النشر
                  </button>
                ) : (
                  <button
                    type="button"
                    className={cn(styles["btn"], styles["btnSecondary"])}
                    disabled={
                      publication.isPending ||
                      save.isPending ||
                      hasUnsavedChanges ||
                      requiresComparison
                    }
                    onClick={() => {
                      setPublicationTarget("draft");
                    }}
                  >
                    استعادة الفصل
                  </button>
                )}
                {chapterState !== "archived" ? (
                  <button
                    type="button"
                    className={cn(styles["btn"], styles["btnSecondary"])}
                    disabled={
                      publication.isPending ||
                      save.isPending ||
                      hasUnsavedChanges ||
                      requiresComparison
                    }
                    onClick={() => {
                      setPublicationTarget("archived");
                    }}
                  >
                    أرشفة الفصل
                  </button>
                ) : null}
              </>
            ) : null}
            <button
              type="button"
              className={cn(styles["btn"], styles["btnSecondary"])}
              onClick={() => {
                setPreviewOpen(true);
              }}
            >
              <Eye aria-hidden="true" /> معاينة خاصة
            </button>
            <button
              type="button"
              className={cn(styles["btn"], styles["btnPrimary"])}
              disabled={
                save.isPending || publication.isPending || requiresComparison
              }
              onClick={() => {
                void handleSave();
              }}
            >
              <Save aria-hidden="true" />{" "}
              {save.isPending ? "جارٍ الحفظ…" : "حفظ المسودة"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles["layoutGrid"]}>
        <div className={styles["mainColumn"]}>
          <section className={styles["card"]}>
            <div className={styles["cardHeader"]}>
              <h2 className={styles["cardTitle"]}>بيانات الفصل</h2>
            </div>
            <div className={styles["fieldsGrid2"]}>
              <div className={styles["field"]}>
                <label className={styles["label"]} htmlFor="chapter-number">
                  رقم الفصل
                </label>
                <input
                  id="chapter-number"
                  className={styles["input"]}
                  type="number"
                  min={1}
                  max={2147483647}
                  step={1}
                  aria-invalid={fieldErrors.number !== undefined}
                  aria-describedby={
                    fieldErrors.number === undefined
                      ? undefined
                      : "chapter-number-error"
                  }
                  value={Number.isNaN(number) ? "" : number}
                  onChange={(event) => {
                    editRevision.current += 1;
                    setNumber(Number(event.target.value));
                  }}
                />
                {fieldErrors.number ? (
                  <p id="chapter-number-error" className={styles["errorText"]}>
                    {fieldErrors.number}
                  </p>
                ) : null}
              </div>
              <div className={styles["field"]}>
                <label className={styles["label"]} htmlFor="chapter-title">
                  عنوان الفصل
                </label>
                <input
                  id="chapter-title"
                  className={styles["input"]}
                  type="text"
                  maxLength={200}
                  aria-invalid={fieldErrors.title !== undefined}
                  aria-describedby={
                    fieldErrors.title === undefined
                      ? undefined
                      : "chapter-title-error"
                  }
                  value={title}
                  onChange={(event) => {
                    editRevision.current += 1;
                    setTitle(event.target.value);
                  }}
                />
                {fieldErrors.title ? (
                  <p id="chapter-title-error" className={styles["errorText"]}>
                    {fieldErrors.title}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
          {illustrated ? (
            <>
              <IllustratedChapterEditor pages={pages} onChange={changePages} />
              {fieldErrors.pages ? (
                <p className={styles["errorText"]} role="alert">
                  {fieldErrors.pages}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <TextChapterEditor
                blocks={textBlocks}
                onChange={changeTextBlocks}
              />
              {fieldErrors.textContent ? (
                <p className={styles["errorText"]} role="alert">
                  {fieldErrors.textContent}
                </p>
              ) : null}
            </>
          )}
        </div>
        <aside className={styles["sidebarColumn"]}>
          <div className={styles["card"]}>
            <h2 className={styles["cardTitle"]}>{work.data.title}</h2>
            <p className={styles["subtitle"]}>
              الحالة: {detail.data?.publicationStatus ?? "draft"}
            </p>
            <p className={styles["subtitle"]}>
              {illustrated
                ? `الصفحات المحفوظة: ${String(savedPages.length)}`
                : `المقاطع المحفوظة: ${String(savedTextBlocks.length)}`}
            </p>
          </div>
        </aside>
      </div>
      {serverRevisionChanged || message ? (
        <p role="status" aria-live="polite">
          {serverRevisionChanged
            ? "تغيّرت النسخة المحفوظة على الخادم. بقيت تعديلاتك؛ حمّل النسخة للمقارنة قبل الحفظ."
            : message}
        </p>
      ) : null}
      {requiresComparison && chapterId !== undefined ? (
        <button
          type="button"
          className={cn(styles["btn"], styles["btnSecondary"])}
          onClick={() => {
            void reconcileSavedChapter();
          }}
        >
          تحميل النسخة المحفوظة للمقارنة
        </button>
      ) : null}
      <ChapterPreviewModal
        isOpen={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
        }}
        chapterNumber={number}
        chapterTitle={title}
        pages={pages}
        savedNumber={savedNumber}
        savedTitle={savedTitle}
        savedPages={savedPages}
        textBlocks={textBlocks}
        savedTextBlocks={savedTextBlocks}
        contentType={illustrated ? "illustrated" : "text"}
        hasSavedChapter={chapterId !== undefined}
      />
      <AdminConfirmDialog
        isOpen={publicationTarget !== null}
        busy={publication.isPending}
        title="تأكيد تغيير حالة الفصل"
        description={
          publicationTarget === "published"
            ? "هل تريد نشر النسخة المحفوظة من الفصل؟"
            : publicationTarget === "archived"
              ? "هل تريد أرشفة الفصل؟"
              : chapterState === "published"
                ? "هل أنت متأكد من إلغاء نشر الفصل؟ سيتحول إلى مسودة ولن يتمكن القراء من قراءته."
                : "هل تريد استعادة الفصل من الأرشيف؟"
        }
        confirmLabel="تأكيد"
        onConfirm={() => {
          void confirmPublication();
        }}
        onCancel={() => {
          setPublicationTarget(null);
        }}
      />
    </main>
  );
}

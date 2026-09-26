"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import {
  type SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import type {
  AdminWork,
  CreateWorkBody,
  UpdateWorkBody,
} from "@fury/contracts";

import {
  useCreateAdminWork,
  useUpdateAdminWork,
} from "../../hooks/admin-content.hooks";
import {
  adminWorkErrorMessage,
  isAmbiguousAdminCreateResult,
  isMissingAdminCreateReadback,
  workFieldErrors,
} from "../../model/admin-content.errors";
import {
  adoptServerWork,
  continueDraftAgainstServer,
  mediaAssetForSave,
  receiveWorkRefresh,
  workCommonFieldsFromForm,
  workFormValuesFromServer,
  workMatchesCreateCommand,
  type MediaDraftSelection,
  type WorkEditorState,
} from "../../model/admin-work-editor";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminWorkBasicFields } from "./AdminWorkBasicFields";
import { AdminWorkMediaFields } from "./AdminWorkMediaFields";
import { AdminWorkSeoPreview } from "./AdminWorkSeoPreview";
import {
  adminWorkFormSchema,
  emptyWorkFormValues,
  type FormValues,
} from "../../model/admin-work-form";
import styles from "./AdminWorkForm.module.css";

interface AdminWorkFormProps {
  mode: "create" | "edit";
  initialWork?: AdminWork | undefined;
}

export function AdminWorkForm({ mode, initialWork }: AdminWorkFormProps) {
  const router = useRouter();
  const createWork = useCreateAdminWork();
  const updateWork = useUpdateAdminWork();
  const isEdit = mode === "edit" && initialWork !== undefined;
  const form = useForm<FormValues>({
    resolver: zodResolver(adminWorkFormSchema),
    defaultValues: initialWork
      ? workFormValuesFromServer(initialWork)
      : emptyWorkFormValues(),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { getValues, reset, setError, setFocus } = form;
  const formDirty = form.formState.isDirty;
  const [resolvedConflictVersion, setResolvedConflictVersion] = useState<
    number | null
  >(null);
  const [coverCandidateAssetId, setCoverCandidateAssetId] = useState<
    string | null
  >(null);
  const [backgroundCandidateAssetId, setBackgroundCandidateAssetId] = useState<
    string | null
  >(null);
  const [clearCover, setClearCover] = useState(false);
  const [clearBackground, setClearBackground] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [createOutcomeUnknown, setCreateOutcomeUnknown] = useState(false);
  const [isCheckingCreate, setIsCheckingCreate] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const createId = useRef<string | null>(null);
  const lastCreateCommand = useRef<CreateWorkBody | null>(null);
  const [baseline, setBaseline] = useState({
    workId: initialWork?.id ?? null,
    version: initialWork?.version ?? null,
  });
  useWatch({ control: form.control });
  const values = getValues();
  const attachedCoverId = values.coverAssetId;
  const attachedBackgroundId = values.backgroundAssetId;
  const mediaDirty =
    coverCandidateAssetId !== null ||
    backgroundCandidateAssetId !== null ||
    clearCover ||
    clearBackground;
  const editorDirty = formDirty || mediaDirty;
  if (
    initialWork !== undefined &&
    !editorDirty &&
    baseline.workId === initialWork.id &&
    baseline.version !== initialWork.version
  ) {
    setBaseline({ workId: initialWork.id, version: initialWork.version });
  }
  const serverConflict =
    initialWork !== undefined &&
    editorDirty &&
    baseline.workId === initialWork.id &&
    baseline.version !== null &&
    initialWork.version > baseline.version &&
    resolvedConflictVersion !== initialWork.version
      ? initialWork
      : null;

  useEffect(() => {
    if (initialWork === undefined) return;
    if (baseline.workId !== initialWork.id) return;
    if (editorDirty) return;
    const previous: WorkEditorState = {
      workId: baseline.workId,
      baseVersion: baseline.version,
      dirty: editorDirty,
      values: getValues(),
      conflictWork: null,
    };
    const refreshed = receiveWorkRefresh(previous, initialWork.id, initialWork);
    reset(refreshed.values);
  }, [baseline, editorDirty, getValues, initialWork, reset]);

  const onCoverSelected = useCallback((assetId: string | null) => {
    setCoverCandidateAssetId(assetId);
    setClearCover(false);
  }, []);
  const onBackgroundSelected = useCallback((assetId: string | null) => {
    setBackgroundCandidateAssetId(assetId);
    setClearBackground(false);
  }, []);
  const onClearCover = useCallback(() => {
    setCoverCandidateAssetId(null);
    setClearCover(attachedCoverId !== null);
  }, [attachedCoverId]);
  const onClearBackground = useCallback(() => {
    setBackgroundCandidateAssetId(null);
    setClearBackground(attachedBackgroundId !== null);
  }, [attachedBackgroundId]);
  const onKeepCover = useCallback(() => {
    setCoverCandidateAssetId(null);
    setClearCover(false);
  }, []);
  const onKeepBackground = useCallback(() => {
    setBackgroundCandidateAssetId(null);
    setClearBackground(false);
  }, []);

  const applySafeFieldErrors = (error: unknown) => {
    const fields = workFieldErrors(error);
    if (fields.title)
      setError("title", { type: "server", message: fields.title });
    if (fields.slug) setError("slug", { type: "server", message: fields.slug });
    if (fields.alternativeTitle) {
      setError("alternativeTitle", {
        type: "server",
        message: fields.alternativeTitle,
      });
    }
    if (fields.synopsis) {
      setError("synopsis", { type: "server", message: fields.synopsis });
    }
    if (fields.author)
      setError("author", { type: "server", message: fields.author });
    if (fields.artist)
      setError("artist", { type: "server", message: fields.artist });
    if (fields.categoryIds) {
      setError("categoryIds", {
        type: "server",
        message: fields.categoryIds,
      });
    }
    if (fields.tagsText) {
      setError("tagsText", { type: "server", message: fields.tagsText });
    }
    if (fields.featuredOrderText) {
      setError("featuredOrderText", {
        type: "server",
        message: fields.featuredOrderText,
      });
    }
  };

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void form.handleSubmit(
      async (values) => {
        setFormMessage(null);
        setCreateOutcomeUnknown(false);
        const coverSelection: MediaDraftSelection = {
          attachedAssetId: values.coverAssetId,
          candidateAssetId: coverCandidateAssetId,
          clearAttached: clearCover,
        };
        const backgroundSelection: MediaDraftSelection = {
          attachedAssetId: values.backgroundAssetId,
          candidateAssetId: backgroundCandidateAssetId,
          clearAttached: clearBackground,
        };
        const coverAssetId = mediaAssetForSave(coverSelection);
        const backgroundAssetId = mediaAssetForSave(backgroundSelection);
        const commonFields = workCommonFieldsFromForm(values);

        try {
          if (mode === "create") {
            createId.current ??= globalThis.crypto.randomUUID();
            const body: CreateWorkBody = {
              id: createId.current,
              ...commonFields,
              slug: values.slug,
              type: values.type,
              storyStatus: values.storyStatus,
              ...(coverAssetId === undefined ? {} : { coverAssetId }),
              ...(backgroundAssetId === undefined ? {} : { backgroundAssetId }),
            };
            lastCreateCommand.current = body;
            const saved = await createWork.mutateAsync(body);
            setFormMessage("حُفظت المسودة على الخادم.");
            router.push(`/admin/works/${saved.id}/edit` as Route);
            return;
          }

          if (initialWork === undefined) {
            setFormMessage(
              "تعذر تحديد العمل المطلوب للتعديل. أعد تحميل التفاصيل.",
            );
            return;
          }
          const expectedVersion = baseline.version;
          if (expectedVersion === null) {
            setFormMessage(
              "تعذر تحديد نسخة العمل الحالية. أعد تحميل التفاصيل.",
            );
            return;
          }
          const body: UpdateWorkBody = {
            expectedVersion,
            title: values.title,
            storyStatus: values.storyStatus,
            alternativeTitle: commonFields.alternativeTitle,
            synopsis: commonFields.synopsis,
            author: commonFields.author,
            artist: commonFields.artist,
            categoryIds: commonFields.categoryIds,
            tags: commonFields.tags,
            featuredHome: commonFields.featuredHome,
            featuredOrder: commonFields.featuredOrder,
            ...(coverAssetId === undefined ? {} : { coverAssetId }),
            ...(backgroundAssetId === undefined ? {} : { backgroundAssetId }),
          };
          const saved = await updateWork.mutateAsync({
            workId: initialWork.id,
            body,
          });
          setBaseline({ workId: saved.id, version: saved.version });
          reset(workFormValuesFromServer(saved));
          setCoverCandidateAssetId(null);
          setBackgroundCandidateAssetId(null);
          setClearCover(false);
          setClearBackground(false);
          setFormMessage("حُفظت التعديلات على المسودة.");
        } catch (error: unknown) {
          setFormMessage(adminWorkErrorMessage(error));
          applySafeFieldErrors(error);
          if (!isEdit && isAmbiguousAdminCreateResult(error)) {
            setCreateOutcomeUnknown(true);
          }
        }
      },
      (errors) => {
        const firstInvalid = [
          "title",
          "slug",
          "alternativeTitle",
          "synopsis",
          "author",
          "artist",
          "categoryIds",
          "tagsText",
          "featuredOrderText",
        ].find((field) => field in errors) as keyof FormValues | undefined;
        if (firstInvalid !== undefined) setFocus(firstInvalid);
      },
    )(event);
  };

  const checkUnknownCreate = async () => {
    const id = createId.current;
    const submitted = lastCreateCommand.current;
    if (id === null || submitted === null) return;
    setIsCheckingCreate(true);
    setFormMessage(null);
    try {
      const saved = await createWork.readback(id);
      if (!workMatchesCreateCommand(saved, submitted)) {
        setCreateOutcomeUnknown(false);
        setFormMessage(
          "يوجد تعارض في هوية العمل؛ لم نعتبر نتيجة القراءة نجاحًا ولم نغيّر مسودتك.",
        );
        return;
      }
      reset(workFormValuesFromServer(saved));
      setCreateOutcomeUnknown(false);
      setFormMessage("تم العثور على المسودة المحفوظة بالمعرّف نفسه.");
      router.push(`/admin/works/${saved.id}/edit` as Route);
    } catch (error: unknown) {
      if (isMissingAdminCreateReadback(error)) {
        setCreateOutcomeUnknown(false);
        setFormMessage(
          "لم يُعثر على مسودة بهذا المعرّف. احتفظ بالحقول ثم أرسلها صراحةً باستخدام المعرّف نفسه.",
        );
      } else {
        setFormMessage(adminWorkErrorMessage(error));
      }
    } finally {
      setIsCheckingCreate(false);
    }
  };

  const adoptServer = () => {
    if (initialWork === undefined || serverConflict === null) return;
    const state: WorkEditorState = {
      workId: initialWork.id,
      baseVersion: baseline.version,
      dirty: true,
      values: getValues(),
      conflictWork: serverConflict,
    };
    const adopted = adoptServerWork(state);
    setBaseline({
      workId: serverConflict.id,
      version: serverConflict.version,
    });
    reset(adopted.values);
    setResolvedConflictVersion(serverConflict.version);
    setCoverCandidateAssetId(null);
    setBackgroundCandidateAssetId(null);
    setClearCover(false);
    setClearBackground(false);
  };

  const continueDraft = () => {
    if (initialWork === undefined || serverConflict === null) return;
    const state: WorkEditorState = {
      workId: initialWork.id,
      baseVersion: baseline.version,
      dirty: true,
      values: getValues(),
      conflictWork: serverConflict,
    };
    const continued = continueDraftAgainstServer(state);
    setBaseline({
      workId: initialWork.id,
      version: continued.baseVersion,
    });
    setResolvedConflictVersion(serverConflict.version);
  };

  const discard = () => {
    router.push("/admin/works");
    setIsDiscardOpen(false);
  };
  const isSaving =
    form.formState.isSubmitting ||
    createWork.isPending ||
    updateWork.isPending ||
    isCheckingCreate;

  if (mode === "edit" && initialWork === undefined) {
    return (
      <div role="alert" dir="rtl">
        تعذر تحميل العمل المطلوب.
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className={styles["formLayout"]} dir="rtl">
        {mode === "edit" && initialWork !== undefined ? (
          <div className={styles["identityBanner"]}>
            <div className={styles["identityMeta"]}>
              <span className={styles["identityId"]}>
                المعرّف: {initialWork.id}
              </span>
              <span className={styles["identityId"]} dir="ltr">
                الرابط الثابت: {initialWork.slug}
              </span>
              <span className={styles["identityId"]}>
                النسخة: {initialWork.version}
              </span>
            </div>
            <Link
              href={`/admin/works/${initialWork.id}/chapters` as Route}
              className={styles["quickNavLink"]}
            >
              إدارة الفصول
            </Link>
          </div>
        ) : null}

        {serverConflict !== null ? (
          <section className={styles["conflictBanner"]} role="alert">
            <h2>تغيّرت النسخة المحفوظة</h2>
            <p>
              ما زالت تعديلاتك المحلية محفوظة. نسخة الخادم الحالية رقم{" "}
              {serverConflict.version}.
            </p>
            <div className={styles["actionButtonsGroup"]}>
              <button type="button" onClick={adoptServer}>
                اعتماد نسخة الخادم
              </button>
              <button type="button" onClick={continueDraft}>
                متابعة مسودتي على النسخة الحالية
              </button>
            </div>
          </section>
        ) : null}

        {formMessage !== null ? (
          <p
            role={
              formMessage.startsWith("حُفظت") ||
              formMessage.startsWith("تم العثور")
                ? "status"
                : "alert"
            }
            aria-live="polite"
            className={
              formMessage.startsWith("حُفظت")
                ? styles["successMessage"]
                : styles["errorMessage"]
            }
          >
            {formMessage}
          </p>
        ) : null}
        {createOutcomeUnknown ? (
          <div role="status" aria-live="polite">
            <p>نتيجة الإنشاء غير مؤكدة. لم نعد إرسال الطلب تلقائيًا.</p>
            <button
              type="button"
              onClick={() => void checkUnknownCreate()}
              disabled={isCheckingCreate}
            >
              تحقق من حالة الحفظ بالمعرّف نفسه
            </button>
          </div>
        ) : null}

        <form noValidate onSubmit={onSubmit}>
          <AdminWorkBasicFields
            isEdit={isEdit}
            retainedCategories={initialWork?.categories ?? []}
          />
          <AdminWorkMediaFields
            values={values}
            coverSelection={{
              attachedAssetId: attachedCoverId,
              candidateAssetId: coverCandidateAssetId,
              clearAttached: clearCover,
            }}
            backgroundSelection={{
              attachedAssetId: attachedBackgroundId,
              candidateAssetId: backgroundCandidateAssetId,
              clearAttached: clearBackground,
            }}
            onCoverSelected={onCoverSelected}
            onBackgroundSelected={onBackgroundSelected}
            onClearCover={onClearCover}
            onClearBackground={onClearBackground}
            onKeepCover={onKeepCover}
            onKeepBackground={onKeepBackground}
          />
          <AdminWorkSeoPreview
            values={values}
            persistedSlug={initialWork?.slug ?? null}
          />

          <div className={styles["actionsBar"]}>
            <button
              type="button"
              className={styles["cancelBtn"]}
              onClick={() => {
                if (editorDirty) setIsDiscardOpen(true);
                else discard();
              }}
            >
              إلغاء والعودة
            </button>
            <div className={styles["actionButtonsGroup"]}>
              <button
                type="submit"
                className={styles["saveDraftBtn"]}
                disabled={isSaving}
              >
                {isSaving
                  ? "جارٍ حفظ المسودة…"
                  : isEdit
                    ? "حفظ التعديلات"
                    : "حفظ كمسودة"}
              </button>
            </div>
          </div>
          {isSaving ? (
            <p role="status" aria-live="polite">
              جارٍ حفظ المسودة؛ لا تبدأ طلب حفظ آخر.
            </p>
          ) : null}
        </form>
        <AdminConfirmDialog
          isOpen={isDiscardOpen}
          title="تجاهل تعديلات المسودة؟"
          description="لديك تغييرات غير محفوظة. ستبقى المسودة المحفوظة كما هي إذا غادرت الآن."
          confirmLabel="مغادرة الصفحة"
          onConfirm={discard}
          onCancel={() => {
            setIsDiscardOpen(false);
          }}
        />
      </div>
    </FormProvider>
  );
}

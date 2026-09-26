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

import type { AdminWork, CreateWorkBody } from "@fury/contracts";
import { useSession } from "@/features/auth/hooks/auth.hooks";

import { SafeAdminContentError } from "../../api/admin-content.api";
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
  createWorkCommand,
  receiveWorkRefresh,
  updateWorkCommand,
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
  adminWorkFormErrorMap,
  adminWorkFormSchema,
  emptyWorkFormValues,
  type FormValues,
} from "../../model/admin-work-form";
import styles from "./AdminWorkForm.module.css";

interface AdminWorkFormProps {
  mode: "create" | "edit";
  initialWork?: AdminWork | undefined;
  canSave?: boolean;
}

export function AdminWorkForm(props: AdminWorkFormProps) {
  const session = useSession();
  const user = session.data?.user;
  const actorId =
    user?.role === "ADMIN" &&
    user.status === "ACTIVE" &&
    user.emailVerifiedAt !== null
      ? user.id
      : null;
  if (actorId === null) {
    return <p role="status">جارٍ التحقق من صلاحية الإدارة…</p>;
  }
  return (
    <ActorWorkForm
      key={`${actorId}:${props.mode}:${props.initialWork?.id ?? "new"}`}
      {...props}
    />
  );
}

function ActorWorkForm({
  mode,
  initialWork,
  canSave = true,
}: AdminWorkFormProps) {
  const router = useRouter();
  const createWork = useCreateAdminWork();
  const updateWork = useUpdateAdminWork();
  const isEdit = mode === "edit" && initialWork !== undefined;
  const form = useForm<FormValues>({
    resolver: zodResolver(adminWorkFormSchema, {
      error: adminWorkFormErrorMap,
    }),
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
  const lastCreateDraft = useRef<string | null>(null);
  const createConflictSeen = useRef(false);
  const [confirmedCreateId, setConfirmedCreateId] = useState<string | null>(
    null,
  );
  const submitLocked = useRef(false);
  const readbackLocked = useRef(false);
  const mounted = useRef(true);
  const currentIdentity = useRef("");
  const currentDraft = useRef("");
  const draftRevision = useRef(0);
  const [pendingEdit, setPendingEdit] = useState<{
    identity: string;
    draft: string;
  } | null>(null);
  const [preserveAfterSave, setPreserveAfterSave] = useState(false);
  const currentCanSave = useRef(true);
  const currentUnknown = useRef(false);
  const currentConflict = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const [baseline, setBaseline] = useState({
    workId: initialWork?.id ?? null,
    version: initialWork?.version ?? null,
  });
  const syncedWorkVersion = useRef(initialWork?.version ?? null);
  const watchedValues = useWatch({ control: form.control });
  const values: FormValues = { ...getValues(), ...watchedValues };
  const attachedCoverId = values.coverAssetId;
  const attachedBackgroundId = values.backgroundAssetId;
  const mediaDirty =
    coverCandidateAssetId !== null ||
    backgroundCandidateAssetId !== null ||
    clearCover ||
    clearBackground;
  const draft = JSON.stringify({
    values,
    coverCandidateAssetId,
    backgroundCandidateAssetId,
    clearCover,
    clearBackground,
  });
  const editorDirty =
    formDirty ||
    mediaDirty ||
    preserveAfterSave ||
    (pendingEdit?.identity === `${mode}:${initialWork?.id ?? "new"}` &&
      pendingEdit.draft !== draft);
  useEffect(() => {
    currentIdentity.current = `${mode}:${initialWork?.id ?? "new"}`;
    if (currentDraft.current !== draft) draftRevision.current += 1;
    currentDraft.current = draft;
    currentCanSave.current = canSave;
    currentUnknown.current = createOutcomeUnknown;
  });
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
    if (
      syncedWorkVersion.current !== null &&
      initialWork.version <= syncedWorkVersion.current
    )
      return;
    const previous: WorkEditorState = {
      workId: baseline.workId,
      baseVersion: baseline.version,
      dirty: editorDirty,
      values: getValues(),
      conflictWork: null,
    };
    const refreshed = receiveWorkRefresh(previous, initialWork.id, initialWork);
    reset(refreshed.values);
    syncedWorkVersion.current = initialWork.version;
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

  useEffect(() => {
    currentConflict.current = serverConflict !== null;
  });
  const canFinishSave = (identity: string) =>
    mounted.current &&
    currentCanSave.current &&
    currentIdentity.current === identity;

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      submitLocked.current ||
      readbackLocked.current ||
      !currentCanSave.current ||
      currentUnknown.current ||
      currentConflict.current
    )
      return;
    submitLocked.current = true;
    void form
      .handleSubmit(
        async (values) => {
          if (
            !canFinishSave(`${mode}:${initialWork?.id ?? "new"}`) ||
            currentUnknown.current ||
            currentConflict.current
          )
            return;
          const submittedIdentity = currentIdentity.current;
          const submittedDraft = currentDraft.current;
          const submittedRevision = draftRevision.current;
          setFormMessage(null);
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
          try {
            if (mode === "create") {
              createId.current ??= globalThis.crypto.randomUUID();
              const body = createWorkCommand(
                values,
                createId.current,
                coverSelection,
                backgroundSelection,
              );
              lastCreateCommand.current = body;
              lastCreateDraft.current = submittedDraft;
              const saved = await createWork.mutateAsync(body);
              if (!canFinishSave(submittedIdentity)) return;
              if (
                draftRevision.current !== submittedRevision ||
                currentDraft.current !== submittedDraft
              ) {
                setConfirmedCreateId(saved.id);
                currentUnknown.current = true;
                setCreateOutcomeUnknown(true);
                setFormMessage(
                  "حُفظت النسخة المرسلة، لكن لديك تعديلات غير محفوظة. راجع المسودة المحفوظة قبل إرسال تعديل آخر.",
                );
                return;
              }
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
            const body = updateWorkCommand(
              values,
              expectedVersion,
              coverSelection,
              backgroundSelection,
            );
            setPendingEdit({
              identity: submittedIdentity,
              draft: submittedDraft,
            });
            const saved = await updateWork.mutateAsync({
              workId: initialWork.id,
              body,
            });
            if (
              !canFinishSave(submittedIdentity) ||
              saved.id !== initialWork.id
            )
              return;
            setBaseline({ workId: saved.id, version: saved.version });
            syncedWorkVersion.current = saved.version;
            if (
              draftRevision.current !== submittedRevision ||
              currentDraft.current !== submittedDraft
            ) {
              setPreserveAfterSave(true);
              setFormMessage(
                "حُفظت النسخة المرسلة، لكن لديك تعديلات غير محفوظة في المحرر.",
              );
              return;
            }
            setPreserveAfterSave(false);
            reset(workFormValuesFromServer(saved));
            setCoverCandidateAssetId(null);
            setBackgroundCandidateAssetId(null);
            setClearCover(false);
            setClearBackground(false);
            setFormMessage("حُفظت التعديلات على المسودة.");
          } catch (error: unknown) {
            if (!canFinishSave(submittedIdentity)) return;
            setFormMessage(adminWorkErrorMessage(error));
            applySafeFieldErrors(error);
            if (
              !isEdit &&
              (isAmbiguousAdminCreateResult(error) ||
                (error instanceof SafeAdminContentError &&
                  error.statusCode === 409))
            ) {
              if (
                error instanceof SafeAdminContentError &&
                error.statusCode === 409
              ) {
                createConflictSeen.current = true;
              }
              currentUnknown.current = true;
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
      )(event)
      .finally(() => {
        if (mounted.current) setPendingEdit(null);
        submitLocked.current = false;
      });
  };

  const checkUnknownCreate = async () => {
    const id = createId.current;
    const submitted = lastCreateCommand.current;
    if (
      id === null ||
      submitted === null ||
      readbackLocked.current ||
      submitLocked.current ||
      !currentCanSave.current
    )
      return;
    readbackLocked.current = true;
    const identity = currentIdentity.current;
    const draft = currentDraft.current;
    setIsCheckingCreate(true);
    setFormMessage(null);
    try {
      const saved = await createWork.readback(id);
      if (!canFinishSave(identity)) return;
      if (!workMatchesCreateCommand(saved, submitted)) {
        currentUnknown.current = true;
        setCreateOutcomeUnknown(true);
        setFormMessage(
          "يوجد تعارض في هوية العمل؛ لم نعتبر نتيجة القراءة نجاحًا ولم نغيّر مسودتك.",
        );
        return;
      }
      setConfirmedCreateId(saved.id);
      if (
        currentDraft.current !== draft ||
        currentDraft.current !== lastCreateDraft.current
      ) {
        setFormMessage(
          "تأكد حفظ النسخة المرسلة، لكن لديك تعديلات غير محفوظة. افتح النسخة المحفوظة للمراجعة.",
        );
        return;
      }
      reset(workFormValuesFromServer(saved));
      currentUnknown.current = false;
      setCreateOutcomeUnknown(false);
      setFormMessage("تم العثور على المسودة المحفوظة بالمعرّف نفسه.");
      router.push(`/admin/works/${saved.id}/edit` as Route);
    } catch (error: unknown) {
      if (!canFinishSave(identity)) return;
      if (isMissingAdminCreateReadback(error)) {
        if (!createConflictSeen.current) {
          currentUnknown.current = false;
          setCreateOutcomeUnknown(false);
          setFormMessage(
            "لم يُعثر على مسودة بهذا المعرّف. احتفظ بالحقول ثم أرسلها صراحةً باستخدام المعرّف نفسه.",
          );
        } else {
          setFormMessage(
            "لم تحسم القراءة تعارض الحفظ. احتفظ بمسودتك وأعد التحقق من المعرّف قبل أي إرسال آخر.",
          );
        }
      } else {
        setFormMessage(adminWorkErrorMessage(error));
      }
    } finally {
      readbackLocked.current = false;
      if (mounted.current && currentIdentity.current === identity)
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
    syncedWorkVersion.current = serverConflict.version;
    setPreserveAfterSave(false);
    setFormMessage(null);
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
            <p>
              {confirmedCreateId === null
                ? "نتيجة الإنشاء غير مؤكدة. لم نعد إرسال الطلب تلقائيًا."
                : "تأكد حفظ النسخة المرسلة؛ تعديلاتك الأحدث لا تزال محلية."}
            </p>
            {confirmedCreateId !== null ? (
              <Link href={`/admin/works/${confirmedCreateId}/edit` as Route}>
                فتح النسخة المحفوظة للمراجعة
              </Link>
            ) : null}
            {confirmedCreateId === null ? (
              <button
                type="button"
                onClick={() => void checkUnknownCreate()}
                disabled={isCheckingCreate}
              >
                تحقق من حالة الحفظ بالمعرّف نفسه
              </button>
            ) : null}
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
            savedWork={initialWork ?? null}
            dirty={editorDirty}
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
                disabled={
                  isSaving ||
                  !canSave ||
                  createOutcomeUnknown ||
                  serverConflict !== null
                }
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

"use client";

import { MEDIA_SOURCE_BYTE_LIMITS } from "@fury/contracts";
import { ImagePlus, RotateCcw, UserRound } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { useSession } from "@/features/auth/hooks/auth.hooks";
import {
  useAvatarMediaCandidate,
  useOwnAvatarMediaList,
} from "@/features/media/hooks/media.hooks";

import styles from "./AvatarPicker.module.css";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_AVATAR_BYTES = MEDIA_SOURCE_BYTE_LIMITS.user_avatar;

const mediaErrorMessage = (code: string | null): string | null => {
  switch (code) {
    case "MEDIA_UNSUPPORTED_TYPE":
      return "اختر صورة بصيغة JPG أو PNG أو WebP متوافقة مع محتواها.";
    case "MEDIA_LIMIT_EXCEEDED":
      return "تجاوزت الصورة حد الحجم أو الأبعاد المسموح به.";
    case "MEDIA_INVALID_FILE":
      return "تعذر قبول الصورة. تحقق من سلامتها وأبعادها ثم حاول مجددًا.";
    case "FORBIDDEN":
    case "UNAUTHORIZED":
      return "انتهت صلاحية الوصول. سجّل الدخول مجددًا قبل رفع الصورة.";
    case "UPLOAD_ATTEMPT_CONFLICT":
      return "تعارضت محاولة الرفع. اختر الملف مجددًا لبدء محاولة جديدة.";
    case "NOT_FOUND":
      return "لم تصل محاولة الرفع إلى الخادم. أعد رفع الصورة المختارة.";
    case "UPLOAD_INCOMPLETE":
    case "MEDIA_UNAVAILABLE":
      return "تعذر تأكيد نتيجة الرفع. أعد التحقق أو حاول مرة أخرى.";
    default:
      return code === null ? null : "تعذر إكمال طلب الصورة. حاول مرة أخرى.";
  }
};

export function AvatarPicker() {
  const user = useSession().data?.user ?? null;
  const candidate = useAvatarMediaCandidate();
  const list = useOwnAvatarMediaList();
  const [fileName, setFileName] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const busy =
    candidate.state.phase === "uploading" ||
    candidate.state.phase === "processing" ||
    candidate.state.phase === "pending";
  const savedCandidates = list.data?.items ?? [];
  const previewUrl = candidate.state.previewUrl;
  const error = !candidate.available
    ? "يلزم حساب نشط وموثق لرفع صورة الحساب."
    : (localError ?? mediaErrorMessage(candidate.state.errorCode));

  useEffect(() => {
    if (error !== null) {
      errorRef.current?.focus();
    } else if (
      candidate.state.phase === "accepted" ||
      candidate.state.phase === "pending"
    ) {
      statusRef.current?.focus();
    }
  }, [candidate.state.phase, error]);

  const chooseAvatar = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    setLocalError(null);
    if (file === undefined) return;
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setLocalError("اختر صورة بصيغة JPG أو PNG أو WebP.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setLocalError("يجب ألا يتجاوز حجم الصورة 4 ميجابايت.");
      event.target.value = "";
      return;
    }
    setFileName(file.name);
    void candidate.select(file);
  };

  const resetAvatar = (): void => {
    setFileName(null);
    setLocalError(null);
    if (inputRef.current !== null) inputRef.current.value = "";
    void candidate.remove();
    inputRef.current?.focus();
  };

  const status = (() => {
    switch (candidate.state.phase) {
      case "uploading":
        return `جارٍ رفع ${fileName ?? "الصورة"} (${String(candidate.state.progress)}٪). المعاينة مؤقتة.`;
      case "processing":
        return "اكتمل نقل الملف. يعالج الخادم الصورة الآن، ولم تُحفظ بعد.";
      case "pending":
        return "لم تصل نتيجة نهائية بعد. الصورة غير محفوظة حاليًا.";
      case "accepted":
        return "تم حفظ الصورة كمرشح خاص. لم تُحدد بعد كصورة الحساب.";
      case "error":
        return "لم تُحفظ الصورة الجديدة.";
      default:
        return candidate.available
          ? "لم تختر صورة جديدة."
          : "رفع صورة الحساب غير متاح لهذه الجلسة.";
    }
  })();

  return (
    <section className={styles["picker"]} aria-labelledby="avatar-picker-title">
      <div className={styles["preview"]}>
        {previewUrl === null ? (
          <span aria-hidden="true">
            {user?.fullName.slice(0, 1).toLocaleUpperCase("ar") ?? (
              <UserRound />
            )}
          </span>
        ) : (
          <Image
            src={previewUrl}
            alt={
              candidate.state.previewKind === "temporary"
                ? "معاينة مؤقتة لصورة الحساب"
                : "معاينة مرشح صورة الحساب المحفوظ"
            }
            fill
            unoptimized
            sizes="112px"
          />
        )}
      </div>
      <div className={styles["content"]}>
        <div>
          <p className="eyebrow">صورة الحساب</p>
          <h3 id="avatar-picker-title">صورة الحساب</h3>
          <p>ارفع صورة خاصة لمعاينتها قبل اختيارها ضمن إعدادات المظهر.</p>
        </div>
        <div className={styles["actions"]}>
          <label
            className="button button--small"
            htmlFor="avatar-upload"
            aria-disabled={!candidate.available || busy}
          >
            <ImagePlus aria-hidden="true" />
            اختيار صورة
          </label>
          <input
            ref={inputRef}
            className="sr-only"
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-describedby="avatar-upload-hint avatar-upload-status"
            disabled={!candidate.available || busy}
            onChange={chooseAvatar}
          />
          <button
            className="button button--small button--ghost"
            type="button"
            onClick={resetAvatar}
            disabled={previewUrl === null || busy}
          >
            <RotateCcw aria-hidden="true" />
            إزالة الصورة المختارة
          </button>
          {candidate.state.phase === "pending" ? (
            <button
              className="button button--small button--ghost"
              type="button"
              onClick={() => void candidate.checkAttempt()}
            >
              التحقق من نتيجة الرفع
            </button>
          ) : null}
          {candidate.state.phase === "error" &&
          candidate.state.retryMode !== null ? (
            <button
              className="button button--small button--ghost"
              type="button"
              onClick={() => void candidate.retry()}
            >
              {candidate.state.retryMode === "check_attempt"
                ? "التحقق من المحاولة مجددًا"
                : "إعادة رفع الصورة المختارة"}
            </button>
          ) : null}
          {candidate.state.phase === "uploading" ||
          candidate.state.phase === "processing" ? (
            <button
              className="button button--small button--ghost"
              type="button"
              onClick={candidate.cancel}
            >
              إلغاء الرفع
            </button>
          ) : null}
        </div>
        <small id="avatar-upload-hint">
          JPG أو PNG أو WebP، بحد أقصى 4 ميجابايت.
        </small>
        <p
          ref={statusRef}
          id="avatar-upload-status"
          className={styles["status"]}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          tabIndex={-1}
        >
          {status}
        </p>
        {error === null ? null : (
          <p
            ref={errorRef}
            className="form-notice form-notice--error"
            role="alert"
            tabIndex={-1}
          >
            {error}
          </p>
        )}
        <section aria-label="مرشحات صورة الحساب المحفوظة">
          <h4>مرشحات محفوظة</h4>
          {list.isPending ? <p role="status">جارٍ تحميل المرشحات…</p> : null}
          {list.isError ? (
            <div role="alert">
              <p>تعذر تحميل مرشحات صورة الحساب.</p>
              <button type="button" onClick={() => void list.refetch()}>
                إعادة المحاولة
              </button>
            </div>
          ) : null}
          {!list.isPending && !list.isError && savedCandidates.length === 0 ? (
            <p>لا توجد مرشحات محفوظة.</p>
          ) : null}
          {savedCandidates.length > 0 ? (
            <ul>
              {savedCandidates.map((asset) => (
                <li key={asset.id}>
                  <span dir="ltr">
                    {asset.width} × {asset.height}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={() => void candidate.load(asset.id)}
                  >
                    معاينة المرشح
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {list.isFetching && !list.isPending ? (
            <p role="status">جارٍ تحديث المرشحات…</p>
          ) : null}
        </section>
      </div>
    </section>
  );
}

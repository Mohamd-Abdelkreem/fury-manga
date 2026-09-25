"use client";

import type { MediaClass } from "@fury/contracts";
import Image from "next/image";
import { useEffect, useRef } from "react";

import {
  useAdminMediaCandidate,
  useAdminMediaList,
} from "../hooks/media.hooks";

type AdminClass = Exclude<MediaClass, "user_avatar">;

const errorMessages: Record<string, string> = {
  MEDIA_INVALID_FILE: "ملف الصورة غير صالح لهذا النوع.",
  MEDIA_LIMIT_EXCEEDED: "تجاوزت الصورة الحد المسموح.",
  MEDIA_UNSUPPORTED_TYPE: "صيغة الصورة غير مدعومة.",
  UPLOAD_ATTEMPT_CONFLICT: "تعارضت محاولة الرفع. اختر الملف مرة أخرى.",
  UPLOAD_INCOMPLETE: "لم يكتمل الرفع. اختر الملف مرة أخرى.",
  NOT_FOUND: "لم تصل محاولة الرفع إلى الخادم. أعد رفع الصورة المختارة.",
  FORBIDDEN: "لا تملك صلاحية رفع هذه الصورة.",
  UNAUTHORIZED: "انتهت صلاحية الجلسة. سجّل الدخول مجددًا.",
  RATE_LIMIT_EXCEEDED: "تم تجاوز حد محاولات الرفع. حاول لاحقًا.",
  MEDIA_UNAVAILABLE:
    "تعذر التحقق من الصورة. تحقق من المحاولة أو اختر الملف مجددًا.",
  VERSION_CONFLICT:
    "تغيرت الوسائط منذ آخر عرض. حدّث القائمة قبل إعادة المحاولة.",
  MEDIA_IN_USE: "الصورة مستخدمة حاليًا ولا يمكن حذفها.",
};

const messageForError = (code: string | null): string =>
  errorMessages[code ?? ""] ?? "تعذر إكمال طلب الوسائط. اختر الملف مرة أخرى.";

export function AdminMediaCandidatePicker({
  mediaClass,
  label,
}: Readonly<{
  mediaClass: AdminClass;
  label: string;
}>) {
  const { state, select, cancel, clear, load, checkAttempt, retry, available } =
    useAdminMediaCandidate(mediaClass);
  const list = useAdminMediaList(mediaClass);
  const inputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const busy =
    state.phase === "uploading" ||
    state.phase === "processing" ||
    state.phase === "pending";
  const savedAssets = list.data?.items ?? [];

  useEffect(() => {
    if (
      state.phase === "error" ||
      state.phase === "accepted" ||
      state.phase === "pending"
    ) {
      (messageRef.current ?? statusRef.current)?.focus();
    }
  }, [state.phase]);

  return (
    <div dir="rtl">
      <label>
        <span>{label}</span>
        <input
          ref={inputRef}
          type="file"
          accept={
            mediaClass === "avatar_frame" || mediaClass === "comment_decoration"
              ? "image/png,image/webp"
              : "image/jpeg,image/png,image/webp"
          }
          disabled={!available || busy}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file !== undefined) void select(file);
            event.currentTarget.value = "";
          }}
        />
      </label>

      {state.previewUrl !== null ? (
        <Image
          src={state.previewUrl}
          alt={
            state.previewKind === "temporary"
              ? `معاينة مؤقتة ${label}`
              : `معاينة ${label}`
          }
          width={160}
          height={180}
          unoptimized
          style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
        />
      ) : null}

      {state.phase === "uploading" ? (
        <div>
          <p role="status" aria-live="polite">
            جارٍ نقل الصورة… {state.progress}%
          </p>
          <button type="button" onClick={cancel}>
            إلغاء الرفع
          </button>
        </div>
      ) : null}

      {state.phase === "processing" ? (
        <div>
          <p role="status" aria-live="polite">
            اكتمل نقل الملف. يعالج الخادم الصورة الآن، ولم تُحفظ بعد.
          </p>
          <button type="button" onClick={cancel}>
            إلغاء الرفع
          </button>
        </div>
      ) : null}

      {state.phase === "pending" ? (
        <div ref={statusRef} role="status" aria-live="polite" tabIndex={-1}>
          <p>نتيجة الرفع غير مؤكدة بعد. لا تبدأ محاولة أخرى قبل التحقق.</p>
          <button
            type="button"
            onClick={() => {
              void checkAttempt();
            }}
          >
            تحقق من المحاولة
          </button>
        </div>
      ) : null}

      {state.phase === "error" ? (
        <div>
          <p ref={messageRef} role="alert" tabIndex={-1}>
            {messageForError(state.errorCode)}
          </p>
          {state.retryMode !== null ? (
            <button
              type="button"
              onClick={() => {
                void retry();
              }}
            >
              {state.retryMode === "check_attempt"
                ? "تحقق من المحاولة مجددًا"
                : "إعادة رفع الصورة المختارة"}
            </button>
          ) : null}
        </div>
      ) : null}

      {state.phase === "accepted" ? (
        <div role="status" aria-live="polite">
          <p ref={messageRef} tabIndex={-1}>
            حُفظت الصورة في الوسائط فقط. لم تُحفظ بيانات العمل أو الفصل أو
            الهدية.
          </p>
          <button
            type="button"
            onClick={() => {
              clear();
              inputRef.current?.focus();
            }}
          >
            إزالة المعاينة المحلية
          </button>
        </div>
      ) : null}

      {available ? (
        <section aria-label={`الوسائط المحفوظة: ${label}`}>
          <h4>وسائط محفوظة لهذا النوع</h4>
          {list.isPending ? (
            <p role="status" aria-live="polite">
              جارٍ تحميل الوسائط المحفوظة…
            </p>
          ) : null}
          {list.isError ? (
            <div role="alert">
              <p>تعذر تحميل الوسائط المحفوظة بأمان.</p>
              <button
                type="button"
                onClick={() => {
                  void list.refetch();
                }}
              >
                إعادة المحاولة
              </button>
            </div>
          ) : null}
          {!list.isPending && !list.isError && savedAssets.length === 0 ? (
            <p>لا توجد وسائط محفوظة لهذا النوع.</p>
          ) : null}
          {savedAssets.length > 0 ? (
            <ul>
              {savedAssets.map((asset) => (
                <li key={asset.id}>
                  <span dir="ltr">
                    {asset.width} × {asset.height}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={() => {
                      void load(asset.id);
                    }}
                  >
                    معاينة الوسيط
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {list.isFetching && !list.isPending ? (
            <p role="status" aria-live="polite">
              جارٍ تحديث القائمة…
            </p>
          ) : null}
        </section>
      ) : (
        <p role="status">يلزم حساب مدير نشط وموثق لرفع الصورة.</p>
      )}
    </div>
  );
}

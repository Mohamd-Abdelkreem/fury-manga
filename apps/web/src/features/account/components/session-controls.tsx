"use client";

import { useState } from "react";

import { useLogout, useLogoutAll } from "@/features/auth/hooks/auth.hooks";
import { replaceWithLogin } from "@/features/auth/utils/session-navigation";
import { getApiError } from "@/services/api/api-client";

export function SessionControls() {
  const logout = useLogout();
  const logoutAll = useLogoutAll();
  const [sessionError, setSessionError] = useState<string | null>(null);

  const endCurrentSession = (): void => {
    setSessionError(null);
    logout.mutate(undefined, {
      onSuccess: replaceWithLogin,
      onError: (error: unknown) => {
        const apiError = getApiError(error);
        setSessionError(
          `${apiError.message} لم نتمكن من تأكيد تسجيل خروج هذه الجلسة من الخادم.`,
        );
      },
    });
  };

  const endEverySession = (): void => {
    setSessionError(null);

    logoutAll.mutate(undefined, {
      onSuccess: () => {
        replaceWithLogin();
      },
      onError: (error: unknown) => {
        const apiError = getApiError(error);

        setSessionError(
          `${apiError.message} لم نتمكن من تأكيد إنهاء الجلسات على أجهزتك الأخرى.`,
        );
      },
    });
  };

  return (
    <section className="danger-panel" aria-labelledby="session-controls-title">
      <div>
        <p className="eyebrow">الجلسات</p>
        <h3 id="session-controls-title">تسجيل الخروج</h3>
        <p>اختر إنهاء الجلسة الحالية أو كل الجلسات المرتبطة بالحساب.</p>
      </div>
      <div className="session-actions">
        <button
          className="button button--ghost"
          type="button"
          onClick={endCurrentSession}
          disabled={logout.isPending || logoutAll.isPending}
        >
          {logout.isPending ? "جارٍ تسجيل الخروج…" : "تسجيل خروج هذه الجلسة"}
        </button>
        <button
          className="button button--danger"
          type="button"
          onClick={endEverySession}
          disabled={logout.isPending || logoutAll.isPending}
        >
          {logoutAll.isPending
            ? "جارٍ إنهاء الجلسات…"
            : "تسجيل الخروج من كل الأجهزة"}
        </button>
      </div>
      {sessionError === null ? null : (
        <p role="alert" className="form-error">
          {sessionError}
        </p>
      )}
    </section>
  );
}

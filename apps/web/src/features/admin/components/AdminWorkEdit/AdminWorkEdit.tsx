"use client";

import Link from "next/link";

import { useAdminWorkDetail } from "../../hooks/admin-content.hooks";
import {
  adminWorkErrorMessage,
  isTerminalAdminContentError,
  isMissingAdminCreateReadback,
} from "../../model/admin-content.errors";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminWorkForm } from "../AdminWorkForm/AdminWorkForm";

interface AdminWorkEditProps {
  workId: string;
}

export function AdminWorkEdit({ workId }: AdminWorkEditProps) {
  const detail = useAdminWorkDetail(workId);
  const work = detail.data;

  if (!detail.sessionReady) {
    return <p role="status">جارٍ التحقق من صلاحية الإدارة…</p>;
  }
  if (!detail.available) {
    return <p role="alert">يلزم حساب مدير نشط وموثق لإدارة مسودات الأعمال.</p>;
  }
  if (detail.denied) {
    return (
      <section role="alert" dir="rtl">
        <p>تعذّر الوصول إلى مسودات الأعمال بهذه الجلسة.</p>
        <button type="button" onClick={() => void detail.retryAccess()}>
          إعادة التحقق من صلاحية الإدارة
        </button>
      </section>
    );
  }
  const terminalFailure =
    detail.isError &&
    (isTerminalAdminContentError(detail.error) ||
      isMissingAdminCreateReadback(detail.error));
  if (detail.isPending && work === undefined) {
    return <p role="status">جارٍ تحميل بيانات العمل المحفوظة…</p>;
  }
  if (
    detail.isError &&
    (work === undefined || terminalFailure || work.id !== workId)
  ) {
    return (
      <section role="alert" dir="rtl">
        <p>{adminWorkErrorMessage(detail.error)}</p>
        <button type="button" onClick={() => void detail.refetch()}>
          إعادة تحميل المسودة
        </button>
        <Link href="/admin/works">العودة إلى الأعمال</Link>
      </section>
    );
  }
  if (work === undefined || work.id !== workId) {
    return <p role="status">جارٍ مطابقة العمل المطلوب…</p>;
  }

  return (
    <div>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "الأعمال", href: "/admin/works" },
          { label: work.title },
        ]}
        title={`تعديل مسودة: ${work.title}`}
        description="تُحمّل البيانات المحفوظة من الخادم، وتبقى تعديلاتك المحلية محفوظة عند تعذّر الحفظ."
      />
      {detail.isError || detail.writeBlocked ? (
        <section role="alert" dir="rtl">
          <p>
            البيانات المعروضة قديمة؛ تعذّر التحقق من أحدث نسخة. احتفظ بتعديلاتك
            وأعد تحميل المسودة قبل الحفظ.
          </p>
          <button
            type="button"
            onClick={() =>
              void (detail.writeBlocked
                ? detail.retryAccess()
                : detail.refetch())
            }
          >
            إعادة تحميل المسودة
          </button>
        </section>
      ) : null}
      <AdminWorkForm
        key={`${detail.actorId ?? "anonymous"}:${work.id}`}
        mode="edit"
        initialWork={work}
        canSave={
          !detail.writeBlocked &&
          !detail.isError &&
          !detail.isFetching &&
          !detail.isPending
        }
      />
    </div>
  );
}

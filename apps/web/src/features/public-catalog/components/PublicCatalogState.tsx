"use client";

import { FeatureState } from "@/components/ui/FeatureState/FeatureState";

export type PublicCatalogStateKind =
  | "loading"
  | "empty"
  | "filtered-empty"
  | "out-of-range"
  | "unavailable"
  | "not-found";

const messages = {
  loading: ["جارٍ تحميل المحتوى", "ننتظر البيانات المنشورة، يرجى الانتظار."],
  empty: ["لا يوجد محتوى منشور الآن", "سيظهر المحتوى هنا عند توفره."],
  "filtered-empty": [
    "لا توجد نتائج مطابقة",
    "جرّب تعديل البحث أو إزالة أحد المرشحات.",
  ],
  "out-of-range": [
    "لا توجد نتائج في هذه الصفحة",
    "ارجع إلى الصفحة الأولى لعرض النتائج المتاحة.",
  ],
  unavailable: [
    "تعذّر تحميل المحتوى",
    "المحتوى غير متاح مؤقتًا. يمكنك إعادة المحاولة.",
  ],
  "not-found": ["العمل غير موجود", "هذا العمل غير متاح للعرض."],
} as const;

export function PublicCatalogState({
  kind,
  onRetry,
  resetHref,
  retrying = false,
  focusTarget,
}: Readonly<{
  kind: PublicCatalogStateKind;
  onRetry?: () => void;
  resetHref?: string;
  retrying?: boolean;
  focusTarget?: ((node: HTMLElement | null) => void) | undefined;
}>) {
  const state = retrying ? "loading" : kind;
  const retry = retrying ? undefined : onRetry;
  const [title, message] = messages[state];
  return (
    <div
      dir="rtl"
      ref={focusTarget}
      tabIndex={focusTarget === undefined ? undefined : -1}
      data-public-catalog-focus={focusTarget === undefined ? undefined : ""}
    >
      <FeatureState
        kind={
          state === "not-found"
            ? "unavailable"
            : state === "out-of-range"
              ? "filtered-empty"
              : state
        }
        title={title}
        message={message}
        {...(retry === undefined
          ? {}
          : { onRetry: retry, actionLabel: "إعادة المحاولة" })}
        {...(resetHref === undefined
          ? {}
          : { actionHref: resetHref, actionLabel: "العودة للقائمة" })}
      />
    </div>
  );
}

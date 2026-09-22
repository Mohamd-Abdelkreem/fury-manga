"use client";

import { useState, type SyntheticEvent } from "react";

import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import { useSession } from "@/features/auth/hooks/auth.hooks";
import {
  SupportField,
  SupportSuccess,
  supportFormStyles as styles,
} from "@/features/support/components/SupportForm/SupportForm";
import {
  ISSUE_TYPES,
  type IssueType,
} from "@/features/support/data/issueTypes";

type IssueValues = Readonly<{
  type: IssueType | "";
  url: string;
  description: string;
  email: string;
}>;

type IssueField = keyof IssueValues;
type IssueErrors = Partial<Record<IssueField, string | undefined>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

const isValidRelatedUrl = (candidateUrl: string): boolean => {
  if (candidateUrl.startsWith("/") && !candidateUrl.startsWith("//"))
    return true;
  try {
    const parsed = new URL(candidateUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const validateIssue = (values: IssueValues): IssueErrors => {
  const errors: IssueErrors = {};
  const url = values.url.trim();
  const description = values.description.trim();
  const email = values.email.trim();

  if (values.type.length === 0) errors.type = "اختر نوع المشكلة.";
  if (url.length === 0)
    errors.url = "أضف رابط الصفحة أو العمل المرتبط بالمشكلة.";
  else if (url.length > 2048 || !isValidRelatedUrl(url))
    errors.url = "أدخل مسارًا يبدأ بـ / أو رابط HTTP/HTTPS صالحًا.";
  if (description.length < 30)
    errors.description =
      "اكتب وصفًا من 30 حرفًا على الأقل يساعد على فهم المشكلة.";
  else if (description.length > 3000)
    errors.description = "يجب ألا يتجاوز الوصف 3000 حرف.";
  if (email.length > 0 && (!EMAIL_PATTERN.test(email) || email.length > 320))
    errors.email = "أدخل بريدًا إلكترونيًا صالحًا أو اترك الحقل فارغًا.";

  return errors;
};

const describedBy = (id: string, error: string | undefined): string =>
  error === undefined ? `${id}-hint` : `${id}-hint ${id}-error`;

export function IssueReportForm({
  initialUrl = "",
  viewState = "ready",
}: Readonly<{
  initialUrl?: string;
  viewState?: "loading" | "ready" | "error";
}>) {
  const user = useSession().data?.user ?? null;
  const [values, setValues] = useState<IssueValues>(() => ({
    type: "",
    url: initialUrl.slice(0, 2048),
    description: "",
    email: user?.email ?? "",
  }));
  const [errors, setErrors] = useState<IssueErrors>({});
  const [state, setState] = useState(viewState);
  const [pending, setPending] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const updateIssueField = (field: IssueField, fieldValue: string): void => {
    setValues((current) => ({ ...current, [field]: fieldValue }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateField = (field: IssueField): void => {
    const nextError = validateIssue(values)[field];
    setErrors((current) => ({ ...current, [field]: nextError }));
  };

  const submit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ): Promise<void> => {
    event.preventDefault();
    const nextErrors = validateIssue(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    setPending(false);
    setSucceeded(true);
  };

  if (state === "loading") {
    return (
      <FeatureState
        kind="loading"
        title="جارٍ تجهيز نموذج الإبلاغ"
        message="نجهز نموذج البلاغ."
      />
    );
  }

  if (state === "error") {
    return (
      <FeatureState
        kind="error"
        title="تعذّر تجهيز نموذج الإبلاغ"
        message="أعد المحاولة لعرض حقول البلاغ."
        actionLabel="إعادة المحاولة"
        onRetry={() => {
          setState("ready");
        }}
      />
    );
  }

  if (succeeded) {
    return (
      <SupportSuccess
        title="تم تسجيل البلاغ"
        message="تم تسجيل بلاغك بنجاح. يمكنك العودة إلى التصفح أو إضافة بلاغ آخر."
        actionLabel="كتابة بلاغ آخر"
        onReset={() => {
          setValues({ type: "", url: initialUrl, description: "", email: "" });
          setErrors({});
          setSucceeded(false);
        }}
      />
    );
  }

  return (
    <form
      className={styles["form"]}
      noValidate
      onSubmit={(event) => {
        void submit(event);
      }}
    >
      <div className={styles["formGrid"]}>
        <SupportField
          id="issue-type"
          label="نوع المشكلة"
          hint="اختر الوصف الأقرب للمشكلة."
          error={errors.type}
        >
          <select
            id="issue-type"
            name="type"
            value={values.type}
            aria-invalid={errors.type === undefined ? undefined : true}
            aria-describedby={describedBy("issue-type", errors.type)}
            onChange={(event) => {
              updateIssueField("type", event.target.value);
            }}
            onBlur={() => {
              validateField("type");
            }}
          >
            <option value="">اختر نوع المشكلة</option>
            {ISSUE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </SupportField>
        <SupportField
          id="issue-email"
          label="بريد المتابعة (اختياري)"
          hint="اتركه فارغًا إن لم ترغب في إضافة بريد للمتابعة."
          error={errors.email}
        >
          <input
            id="issue-email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            maxLength={320}
            value={values.email}
            aria-invalid={errors.email === undefined ? undefined : true}
            aria-describedby={describedBy("issue-email", errors.email)}
            onChange={(event) => {
              updateIssueField("email", event.target.value);
            }}
            onBlur={() => {
              validateField("email");
            }}
          />
        </SupportField>
        <div className={styles["fieldWide"]}>
          <SupportField
            id="issue-url"
            label="رابط الصفحة أو العمل أو الفصل أو التعليق"
            hint="يمكن استخدام مسار مثل /story/... أو رابط HTTP/HTTPS كامل."
            error={errors.url}
          >
            <input
              id="issue-url"
              name="url"
              type="url"
              dir="ltr"
              maxLength={2048}
              value={values.url}
              aria-invalid={errors.url === undefined ? undefined : true}
              aria-describedby={describedBy("issue-url", errors.url)}
              onChange={(event) => {
                updateIssueField("url", event.target.value);
              }}
              onBlur={() => {
                validateField("url");
              }}
            />
          </SupportField>
        </div>
        <div className={styles["fieldWide"]}>
          <SupportField
            id="issue-description"
            label="وصف المشكلة"
            hint="من 30 إلى 3000 حرف. اذكر ما توقعته وما ظهر بدلًا منه."
            error={errors.description}
            count={`${values.description.length.toLocaleString("ar-EG")} / ٣٬٠٠٠`}
          >
            <textarea
              id="issue-description"
              name="description"
              maxLength={3000}
              value={values.description}
              aria-invalid={errors.description === undefined ? undefined : true}
              aria-describedby={describedBy(
                "issue-description",
                errors.description,
              )}
              onChange={(event) => {
                updateIssueField("description", event.target.value);
              }}
              onBlur={() => {
                validateField("description");
              }}
            />
          </SupportField>
        </div>
      </div>
      <div className={styles["formActions"]}>
        <button className="button" type="submit" disabled={pending}>
          {pending ? "جارٍ تسجيل البلاغ…" : "تسجيل البلاغ"}
        </button>
      </div>
    </form>
  );
}

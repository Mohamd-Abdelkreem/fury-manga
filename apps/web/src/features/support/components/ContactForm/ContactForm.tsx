"use client";

import { useState, type SyntheticEvent } from "react";

import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import { useSession } from "@/features/auth/hooks/auth.hooks";
import {
  SupportField,
  SupportSuccess,
  supportFormStyles as styles,
} from "@/features/support/components/SupportForm/SupportForm";

type ContactValues = Readonly<{
  name: string;
  email: string;
  subject: string;
  message: string;
}>;

type ContactField = keyof ContactValues;
type ContactErrors = Partial<Record<ContactField, string | undefined>>;

const EMPTY_VALUES: ContactValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = "اكتب اسمًا من حرفين على الأقل.";
  else if (name.length > 100) errors.name = "يجب ألا يتجاوز الاسم 100 حرف.";

  if (!EMAIL_PATTERN.test(email))
    errors.email = "أدخل بريدًا إلكترونيًا صالحًا.";
  else if (email.length > 320)
    errors.email = "يجب ألا يتجاوز البريد الإلكتروني 320 حرفًا.";

  if (subject.length < 3)
    errors.subject = "اكتب موضوعًا واضحًا من 3 أحرف على الأقل.";
  else if (subject.length > 160)
    errors.subject = "يجب ألا يتجاوز الموضوع 160 حرفًا.";

  if (message.length < 20)
    errors.message = "اكتب رسالة من 20 حرفًا على الأقل لتوضيح طلبك.";
  else if (message.length > 3000)
    errors.message = "يجب ألا تتجاوز الرسالة 3000 حرف.";

  return errors;
};

const describedBy = (id: string, error: string | undefined): string =>
  error === undefined ? `${id}-hint` : `${id}-hint ${id}-error`;

export function ContactForm({
  viewState = "ready",
}: Readonly<{ viewState?: "loading" | "ready" | "error" }>) {
  const user = useSession().data?.user ?? null;
  const [values, setValues] = useState<ContactValues>(() => ({
    ...EMPTY_VALUES,
    name: user?.fullName ?? "",
    email: user?.email ?? "",
  }));
  const [errors, setErrors] = useState<ContactErrors>({});
  const [state, setState] = useState(viewState);
  const [pending, setPending] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const updateContactField = (
    field: ContactField,
    fieldValue: string,
  ): void => {
    setValues((current) => ({ ...current, [field]: fieldValue }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateField = (field: ContactField): void => {
    const nextError = validateContact(values)[field];
    setErrors((current) => ({ ...current, [field]: nextError }));
  };

  const submit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ): Promise<void> => {
    event.preventDefault();
    const nextErrors = validateContact(values);
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
        title="جارٍ تجهيز نموذج التواصل"
        message="نجهز الحقول المحلية للكتابة."
      />
    );
  }

  if (state === "error") {
    return (
      <FeatureState
        kind="error"
        title="تعذّر تجهيز النموذج"
        message="أعد المحاولة لعرض نموذج التواصل. لم تُرسل أي بيانات."
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
        title="اكتملت معاينة الإرسال"
        message="اكتملت حالة الواجهة الأمامية فقط. لم تُرسل الرسالة إلى خادم أو بريد، ولم يتلقها مسؤول."
        actionLabel="كتابة رسالة أخرى"
        onReset={() => {
          setValues(EMPTY_VALUES);
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
          id="contact-name"
          label="الاسم"
          hint="الاسم الذي تفضّل أن نخاطبك به."
          error={errors.name}
        >
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            maxLength={100}
            value={values.name}
            aria-invalid={errors.name === undefined ? undefined : true}
            aria-describedby={describedBy("contact-name", errors.name)}
            onChange={(event) => {
              updateContactField("name", event.target.value);
            }}
            onBlur={() => {
              validateField("name");
            }}
          />
        </SupportField>
        <SupportField
          id="contact-email"
          label="البريد الإلكتروني"
          hint="يُستخدم في هذه المعاينة لإكمال الحقل فقط."
          error={errors.email}
        >
          <input
            id="contact-email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            maxLength={320}
            value={values.email}
            aria-invalid={errors.email === undefined ? undefined : true}
            aria-describedby={describedBy("contact-email", errors.email)}
            onChange={(event) => {
              updateContactField("email", event.target.value);
            }}
            onBlur={() => {
              validateField("email");
            }}
          />
        </SupportField>
        <div className={styles["fieldWide"]}>
          <SupportField
            id="contact-subject"
            label="الموضوع"
            hint="اكتب عنوانًا مختصرًا يصف سبب التواصل."
            error={errors.subject}
          >
            <input
              id="contact-subject"
              name="subject"
              maxLength={160}
              value={values.subject}
              aria-invalid={errors.subject === undefined ? undefined : true}
              aria-describedby={describedBy("contact-subject", errors.subject)}
              onChange={(event) => {
                updateContactField("subject", event.target.value);
              }}
              onBlur={() => {
                validateField("subject");
              }}
            />
          </SupportField>
        </div>
        <div className={styles["fieldWide"]}>
          <SupportField
            id="contact-message"
            label="الرسالة"
            hint="من 20 إلى 3000 حرف."
            error={errors.message}
            count={`${values.message.length.toLocaleString("ar-EG")} / ٣٬٠٠٠`}
          >
            <textarea
              id="contact-message"
              name="message"
              maxLength={3000}
              value={values.message}
              aria-invalid={errors.message === undefined ? undefined : true}
              aria-describedby={describedBy("contact-message", errors.message)}
              onChange={(event) => {
                updateContactField("message", event.target.value);
              }}
              onBlur={() => {
                validateField("message");
              }}
            />
          </SupportField>
        </div>
      </div>
      <div className={styles["formActions"]}>
        <p>هذا نموذج واجهة فقط؛ لا ينشئ رسالة بريد ولا يرسل طلبًا شبكيًا.</p>
        <button className="button" type="submit" disabled={pending}>
          {pending ? "جارٍ إكمال المعاينة…" : "إكمال معاينة الإرسال"}
        </button>
      </div>
    </form>
  );
}

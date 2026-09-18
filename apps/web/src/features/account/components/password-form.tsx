"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordBodySchema,
  PASSWORD_MIN_LENGTH,
  type ChangePasswordBody,
} from "@fury/contracts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { FormField } from "@/components/forms/form-field";
import { useChangePassword } from "@/features/auth/hooks/auth.hooks";
import { localizeAuthMessage } from "@/features/auth/utils/auth-messages";
import { applyApiFormError } from "@/shared/forms/form";

type PasswordInput = z.input<typeof changePasswordBodySchema>;

export function PasswordForm() {
  const changePassword = useChangePassword();
  const [message, setMessage] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    getValues,
    register,
    setError,
  } = useForm<PasswordInput, unknown, ChangePasswordBody>({
    resolver: zodResolver(changePasswordBodySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    try {
      await changePassword.mutateAsync(values);
    } catch (error) {
      setMessage(applyApiFormError(error, { getValues, setError }));
    }
  });

  return (
    <form
      className="settings-form"
      onSubmit={(event) => {
        void onSubmit(event);
      }}
      noValidate
    >
      <div className="settings-form__heading">
        <div>
          <p className="eyebrow">كلمة المرور</p>
          <h3>تغيير كلمة المرور</h3>
        </div>
        <p>يؤدي التغيير الناجح إلى إنهاء كل الجلسات النشطة.</p>
      </div>
      <div className="settings-form__fields">
        <FormField
          id="currentPassword"
          label="كلمة المرور الحالية"
          type="password"
          autoComplete="current-password"
          error={localizeAuthMessage(errors.currentPassword?.message)}
          {...register("currentPassword")}
        />
        <FormField
          id="newPassword"
          label="كلمة المرور الجديدة"
          type="password"
          autoComplete="new-password"
          hint={`يجب ألا تقل عن ${String(PASSWORD_MIN_LENGTH)} أحرف.`}
          error={localizeAuthMessage(errors.newPassword?.message)}
          {...register("newPassword")}
        />
        <FormField
          id="passwordConfirmation"
          label="تأكيد كلمة المرور الجديدة"
          type="password"
          autoComplete="new-password"
          error={localizeAuthMessage(errors.passwordConfirmation?.message)}
          {...register("passwordConfirmation")}
        />
      </div>
      {message === null ? null : (
        <p className="form-notice form-notice--error" role="alert">
          {message}
        </p>
      )}
      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "جارٍ تغيير كلمة المرور…" : "تغيير كلمة المرور"}
      </button>
    </form>
  );
}

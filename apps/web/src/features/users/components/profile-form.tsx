"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileBodySchema,
  type UpdateProfileBody,
} from "@fury/contracts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { FormField } from "@/components/forms/form-field";
import { useSession } from "@/features/auth/hooks/auth.hooks";
import { useUpdateProfile } from "@/features/users/hooks/users.hooks";
import { applyApiFormError } from "@/shared/forms/form";

type ProfileInput = z.input<typeof updateProfileBodySchema>;

export function ProfileForm() {
  const user = useSession().data?.user ?? null;
  const updateProfile = useUpdateProfile();
  const [message, setMessage] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    getValues,
    register,
    setError,
  } = useForm<ProfileInput, unknown, UpdateProfileBody>({
    resolver: zodResolver(updateProfileBodySchema),
    values: {
      fullName: user?.fullName ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    try {
      await updateProfile.mutateAsync(values);
      setMessage("تم حفظ اسم العرض في حسابك.");
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
          <p className="eyebrow">الهوية</p>
          <h3>اسم العرض والبريد</h3>
        </div>
        <p>يمكن تعديل اسم العرض فقط. لا يتوفر تغيير البريد أو الهاتف هنا.</p>
      </div>
      <div className="settings-form__fields">
        <FormField
          id="fullName"
          label="اسم العرض"
          autoComplete="name"
          error={
            errors.fullName === undefined
              ? undefined
              : "أدخل اسمًا صالحًا لا يتجاوز 150 حرفًا."
          }
          {...register("fullName")}
        />
        <FormField
          id="profileEmail"
          label="البريد الإلكتروني"
          type="email"
          value={user?.email ?? ""}
          dir="ltr"
          disabled
          readOnly
        />
      </div>
      {message === null ? null : (
        <p className="form-notice" role="status">
          {message}
        </p>
      )}
      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "جارٍ حفظ الاسم…" : "حفظ اسم العرض"}
      </button>
    </form>
  );
}

"use client";

import { ImagePlus, RotateCcw, UserRound } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { useSession } from "@/features/auth/hooks/auth.hooks";

import styles from "./AvatarPicker.module.css";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_AVATAR_BYTES = 4 * 1024 * 1024;

export function AvatarPicker() {
  const user = useSession().data?.user ?? null;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (previewUrl !== null) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const chooseAvatar = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    setError(null);
    if (file === undefined) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError("اختر صورة بصيغة JPG أو PNG أو WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setError("يجب ألا يتجاوز حجم الصورة 4 ميجابايت.");
      event.target.value = "";
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
  };

  const resetAvatar = (): void => {
    setPreviewUrl(null);
    setFileName(null);
    setError(null);
    if (inputRef.current !== null) inputRef.current.value = "";
  };

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
            alt="معاينة صورة الحساب المختارة"
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
          <p>اختر صورة واضحة لتجربة مظهرها في حسابك قبل الحفظ.</p>
        </div>
        <div className={styles["actions"]}>
          <label className="button button--small" htmlFor="avatar-upload">
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
            onChange={chooseAvatar}
          />
          <button
            className="button button--small button--ghost"
            type="button"
            onClick={resetAvatar}
            disabled={previewUrl === null}
          >
            <RotateCcw aria-hidden="true" />
            إزالة الصورة المختارة
          </button>
        </div>
        <small id="avatar-upload-hint">
          JPG أو PNG أو WebP، بحد أقصى 4 ميجابايت.
        </small>
        <p id="avatar-upload-status" className={styles["status"]} role="status">
          {fileName === null
            ? "لم تختر صورة جديدة."
            : `الصورة المختارة: ${fileName}`}
        </p>
        {error === null ? null : (
          <p className="form-notice form-notice--error" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

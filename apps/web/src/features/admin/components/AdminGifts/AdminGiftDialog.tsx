"use client";

import React, { useState, type SyntheticEvent } from "react";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AdminGiftDesign,
  AdminGiftStatus,
  AdminGiftType,
} from "../../types/admin.types";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminGifts.module.css";

interface AdminGiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gift?: AdminGiftDesign | undefined;
  onSave: (
    data: Omit<AdminGiftDesign, "id" | "createdAt" | "recipientCount">,
  ) => void;
}

const PRESET_COLORS = [
  { label: "مرجاني (Fury)", hex: "#ff4747", ring: "rgba(255, 71, 71, 0.24)" },
  { label: "ذهبي ملكي", hex: "#ffb300", ring: "rgba(255, 179, 0, 0.24)" },
  { label: "فضي ناصع", hex: "#d8d8d8", ring: "rgba(255, 255, 255, 0.2)" },
  { label: "أزرق سماوي", hex: "#38bdf8", ring: "rgba(56, 189, 248, 0.24)" },
  { label: "بنفسجي غامض", hex: "#c084fc", ring: "rgba(192, 132, 252, 0.24)" },
];

interface InnerFormProps {
  gift?: AdminGiftDesign | undefined;
  onClose: () => void;
  onSave: (
    data: Omit<AdminGiftDesign, "id" | "createdAt" | "recipientCount">,
  ) => void;
}

function GiftFormInner({ gift, onClose, onSave }: InnerFormProps) {
  const isEdit = gift !== undefined;

  const [name, setName] = useState(() => gift?.name ?? "");
  const [description, setDescription] = useState(() => gift?.description ?? "");
  const [type, setType] = useState<AdminGiftType>(
    () => gift?.type ?? "avatar_frame",
  );
  const [status, setStatus] = useState<AdminGiftStatus>(
    () => gift?.status ?? "active",
  );
  const [accentColor, setAccentColor] = useState(
    () => gift?.accentColor ?? "#ff4747",
  );
  const [ringColor, setRingColor] = useState(
    () => gift?.ringColor ?? "rgba(255, 71, 71, 0.24)",
  );
  const [tone, setTone] = useState<"ember" | "gold" | "midnight">(
    () => gift?.tone ?? "ember",
  );

  const [errors, setErrors] = useState<{
    name?: string | undefined;
    description?: string | undefined;
  }>({});

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const nextErrors: {
      name?: string | undefined;
      description?: string | undefined;
    } = {};
    if (!name.trim()) nextErrors.name = "يرجى كتابة اسم الهدية.";
    if (!description.trim()) nextErrors.description = "يرجى كتابة وصف للهدية.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      type,
      status,
      accentColor,
      ringColor: type === "avatar_frame" ? ringColor : undefined,
      tone: type === "comment_decoration" ? tone : undefined,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles["modalHeader"]}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles
            style={{
              width: "1.25rem",
              height: "1.25rem",
              color: "var(--primary)",
            }}
          />
          <h3 id="gift-dialog-title" className={styles["modalTitle"]}>
            {isEdit ? `تعديل تصميم: ${gift.name}` : "إضافة تصميم هدية جديد"}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            onClose();
          }}
          className={styles["iconBtn"]}
          aria-label="إغلاق"
        >
          <X style={{ width: "1rem", height: "1rem" }} />
        </button>
      </div>

      <div className={styles["modalBody"]}>
        <div className={styles["field"]}>
          <label htmlFor="gift-name" className={styles["label"]}>
            اسم الهدية
          </label>
          <input
            id="gift-name"
            type="text"
            className={styles["input"]}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="مثال: حلقة اللهب أو تاج الكهرمان"
          />
          {errors.name && (
            <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>
              {errors.name}
            </span>
          )}
        </div>

        <div className={styles["field"]}>
          <label htmlFor="gift-desc" className={styles["label"]}>
            وصف الهدية
          </label>
          <textarea
            id="gift-desc"
            className={styles["textarea"]}
            style={{ minHeight: "75px" }}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="وصف مختصر لمظهر الهدية وأثرها الجمالي..."
          />
          {errors.description && (
            <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>
              {errors.description}
            </span>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div className={styles["field"]}>
            <label htmlFor="gift-type" className={styles["label"]}>
              نوع الهدية
            </label>
            <select
              id="gift-type"
              className={styles["select"]}
              value={type}
              onChange={(e) => {
                setType(e.target.value as AdminGiftType);
              }}
              disabled={isEdit}
            >
              <option value="avatar_frame">إطار صورة شخصية</option>
              <option value="comment_decoration">زخرفة تعليق</option>
            </select>
          </div>

          <div className={styles["field"]}>
            <label htmlFor="gift-status" className={styles["label"]}>
              حالة الهدية
            </label>
            <select
              id="gift-status"
              className={styles["select"]}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as AdminGiftStatus);
              }}
            >
              <option value="active">نشطة (متاحة للمنح)</option>
              <option value="disabled">معطلة مؤقتاً</option>
              <option value="archived">مؤرشفة</option>
            </select>
          </div>
        </div>

        {/* Accent Color Preset Selector */}
        <div className={styles["field"]}>
          <label className={styles["label"]}>اللون المميز (Accent Color)</label>
          <div className={styles["colorPresetsRow"]}>
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                onClick={() => {
                  setAccentColor(preset.hex);
                  setRingColor(preset.ring);
                }}
                className={cn(
                  styles["colorBtn"],
                  accentColor === preset.hex && styles["colorBtnSelected"],
                )}
                style={{ backgroundColor: preset.hex }}
                title={preset.label}
                aria-label={preset.label}
              />
            ))}
            <input
              type="text"
              className={styles["input"]}
              style={{
                width: "100px",
                minHeight: "2rem",
                padding: "0.25rem 0.5rem",
              }}
              value={accentColor}
              onChange={(e) => {
                setAccentColor(e.target.value);
              }}
              placeholder="#hex"
            />
          </div>
        </div>

        {type === "comment_decoration" && (
          <div className={styles["field"]}>
            <label htmlFor="comment-tone" className={styles["label"]}>
              نبرة الزخرفة (Tone)
            </label>
            <select
              id="comment-tone"
              className={styles["select"]}
              value={tone}
              onChange={(e) => {
                setTone(e.target.value as "ember" | "gold" | "midnight");
              }}
            >
              <option value="ember">جمر (Ember - أحمر دافئ)</option>
              <option value="gold">ذهب (Gold - ذهبي فاخر)</option>
              <option value="midnight">
                منتصف الليل (Midnight - فضي داكن)
              </option>
            </select>
          </div>
        )}
      </div>

      <div className={styles["modalFooter"]}>
        <button
          type="button"
          onClick={() => {
            onClose();
          }}
          className={styles["btnSecondary"]}
        >
          إلغاء
        </button>
        <button type="submit" className={styles["btnPrimary"]}>
          {isEdit ? "حفظ التعديلات" : "إنشاء التصميم"}
        </button>
      </div>
    </form>
  );
}

export function AdminGiftDialog({
  isOpen,
  onClose,
  gift,
  onSave,
}: AdminGiftDialogProps) {
  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div
      className={styles["modalBackdrop"]}
      onClick={() => {
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-dialog-title"
    >
      <div
        ref={dialogRef}
        className={styles["modalContent"]}
        onKeyDown={onDialogKeyDown}
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <GiftFormInner
          key={gift?.id ?? "new-gift"}
          gift={gift}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}

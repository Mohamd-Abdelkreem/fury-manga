"use client";

import { Check, Gift, MessageCircle, UserRound } from "lucide-react";
import { useState, type CSSProperties } from "react";

import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import {
  AVATAR_FRAMES,
  COMMENT_DECORATIONS,
  DEFAULT_AVATAR_FRAME_ID,
  DEFAULT_COMMENT_DECORATION_ID,
  type AvatarFrameGift,
  type CommentDecorationGift,
} from "@/features/account/data/gifts";
import { useSession } from "@/features/auth/hooks/auth.hooks";

import styles from "./AppearanceSettings.module.css";

type AppearanceSettingsProps = Readonly<{
  frames?: readonly AvatarFrameGift[];
  decorations?: readonly CommentDecorationGift[];
}>;

const availabilityLabels = {
  granted: "متاح",
  revoked: "مسحوب",
  disabled: "موقوف",
} as const;

export function AppearanceSettings({
  frames = AVATAR_FRAMES,
  decorations = COMMENT_DECORATIONS,
}: AppearanceSettingsProps) {
  const user = useSession().data?.user ?? null;
  const [frameId, setFrameId] = useState<string | null>(
    frames.some(
      (frame) =>
        frame.id === DEFAULT_AVATAR_FRAME_ID &&
        frame.availability === "granted",
    )
      ? DEFAULT_AVATAR_FRAME_ID
      : null,
  );
  const [decorationId, setDecorationId] = useState<string | null>(
    decorations.some(
      (decoration) =>
        decoration.id === DEFAULT_COMMENT_DECORATION_ID &&
        decoration.availability === "granted",
    )
      ? DEFAULT_COMMENT_DECORATION_ID
      : null,
  );

  const selectedFrame = frames.find((frame) => frame.id === frameId);
  const selectedDecoration = decorations.find(
    (decoration) => decoration.id === decorationId,
  );
  const selectedFrameName = selectedFrame?.name ?? "بلا إطار";
  const selectedDecorationName =
    selectedDecoration?.name ?? "التصميم الافتراضي";
  const frameStyle =
    selectedFrame === undefined
      ? undefined
      : ({
          "--frame-accent": selectedFrame.accent,
          "--frame-ring": selectedFrame.ring,
        } as CSSProperties);

  return (
    <>
      <section
        className={styles["section"]}
        id="avatar-frame"
        aria-labelledby="avatar-frame-title"
      >
        <div className={styles["heading"]}>
          <div>
            <p className="eyebrow">هدية المظهر</p>
            <h2 id="avatar-frame-title">إطار صورة الحساب</h2>
            <p>
              اختر إطارًا واحدًا أو اترك الصورة بلا إطار. الاختيار محلي لهذه
              المعاينة ولا يُحفظ على الخادم.
            </p>
          </div>
          <Gift aria-hidden="true" />
        </div>
        <div className={styles["frameLayout"]}>
          <div
            className={`${styles["avatarPreview"] ?? ""} ${frameId === null ? (styles["noFrame"] ?? "") : ""}`}
            style={frameStyle}
            aria-label={`معاينة الصورة، ${selectedFrameName}`}
          >
            <span aria-hidden="true">
              {user?.fullName.slice(0, 1).toLocaleUpperCase("ar") ?? (
                <UserRound />
              )}
            </span>
          </div>
          {frames.length === 0 ? (
            <FeatureState
              kind="empty"
              title="لا توجد إطارات مملوكة"
              message="ستظهر إطارات صورة الحساب هنا عند منحها للحساب."
            />
          ) : (
            <fieldset className={styles["choices"]}>
              <legend>الإطار النشط</legend>
              <label className={styles["choice"]}>
                <input
                  type="radio"
                  name="avatar-frame"
                  checked={frameId === null}
                  onChange={() => {
                    setFrameId(null);
                  }}
                />
                <span className={styles["thumbnail"]} aria-hidden="true">
                  <UserRound />
                </span>
                <span>
                  <strong>بلا إطار</strong>
                  <small>الصورة الافتراضية من دون زخرفة.</small>
                </span>
                {frameId === null ? <Check aria-hidden="true" /> : null}
              </label>
              {frames.map((frame) => {
                const disabled = frame.availability !== "granted";
                return (
                  <label
                    className={styles["choice"]}
                    data-unavailable={disabled || undefined}
                    key={frame.id}
                  >
                    <input
                      type="radio"
                      name="avatar-frame"
                      value={frame.id}
                      checked={frameId === frame.id}
                      disabled={disabled}
                      onChange={() => {
                        setFrameId(frame.id);
                      }}
                    />
                    <span
                      className={styles["thumbnail"]}
                      aria-hidden="true"
                      style={{
                        borderColor: frame.accent,
                        boxShadow: `0 0 0 3px ${frame.ring}`,
                      }}
                    >
                      {user?.fullName.slice(0, 1).toLocaleUpperCase("ar") ??
                        "F"}
                    </span>
                    <span>
                      <strong>{frame.name}</strong>
                      <small>{frame.description}</small>
                      <em>{availabilityLabels[frame.availability]}</em>
                    </span>
                    {frameId === frame.id ? <Check aria-hidden="true" /> : null}
                  </label>
                );
              })}
            </fieldset>
          )}
        </div>
        <p className={styles["localNotice"]} role="status" aria-live="polite">
          الاختيار الحالي في المعاينة: {selectedFrameName}. لا توجد مزامنة مع
          الخادم.
        </p>
      </section>

      <section
        className={styles["section"]}
        id="comment-decoration"
        aria-labelledby="comment-decoration-title"
      >
        <div className={styles["heading"]}>
          <div>
            <p className="eyebrow">هوية التعليق</p>
            <h2 id="comment-decoration-title">زخرفة التعليقات</h2>
            <p>
              عاين الزخرفة على تعليق عربي طويل قبل اختيارها. النص والأزرار تبقى
              مقروءة على الشاشات الضيقة.
            </p>
          </div>
          <MessageCircle aria-hidden="true" />
        </div>
        <article
          className={styles["commentPreview"]}
          data-tone={selectedDecoration?.tone ?? "default"}
          aria-label={`معاينة تعليق، ${selectedDecorationName}`}
        >
          <div className={styles["commentMeta"]}>
            <span className={styles["commentAvatar"]}>?</span>
            <div>
              <strong>سلمى القارئة</strong>
              <small>قبل 12 دقيقة · الفصل 43</small>
            </div>
          </div>
          <p>
            أعجبني كيف حافظ الفصل على التوتر من دون أن يسرع الأحداث. تفاصيل
            المكان واضحة، والحوار الطويل بقي سهل المتابعة حتى على شاشة صغيرة؛
            أتمنى فقط أن نعرف سبب الرسالة الغامضة في الفصل القادم.
          </p>
          <div className={styles["commentActions"]}>
            <button type="button" disabled>
              إعجاب · 24
            </button>
            <button type="button" disabled>
              رد
            </button>
          </div>
        </article>
        {decorations.length === 0 ? (
          <FeatureState
            kind="empty"
            title="لا توجد زخارف مملوكة"
            message="سيبقى تصميم التعليق الافتراضي نشطًا حتى تُمنح زخرفة للحساب."
          />
        ) : (
          <fieldset className={styles["decorationChoices"]}>
            <legend>تصميم التعليق النشط</legend>
            <label className={styles["decorationChoice"]}>
              <input
                type="radio"
                name="comment-decoration"
                checked={decorationId === null}
                onChange={() => {
                  setDecorationId(null);
                }}
              />
              <span>
                <strong>التصميم الافتراضي</strong>
                <small>بطاقة Fury الأساسية من دون زخرفة.</small>
              </span>
              {decorationId === null ? <Check aria-hidden="true" /> : null}
            </label>
            {decorations.map((decoration) => {
              const disabled = decoration.availability !== "granted";
              return (
                <label
                  className={styles["decorationChoice"]}
                  data-tone={decoration.tone}
                  data-unavailable={disabled || undefined}
                  key={decoration.id}
                >
                  <input
                    type="radio"
                    name="comment-decoration"
                    value={decoration.id}
                    checked={decorationId === decoration.id}
                    disabled={disabled}
                    onChange={() => {
                      setDecorationId(decoration.id);
                    }}
                  />
                  <span>
                    <strong>{decoration.name}</strong>
                    <small>{decoration.description}</small>
                    <em>{availabilityLabels[decoration.availability]}</em>
                  </span>
                  {decorationId === decoration.id ? (
                    <Check aria-hidden="true" />
                  ) : null}
                </label>
              );
            })}
          </fieldset>
        )}
        <p className={styles["localNotice"]} role="status" aria-live="polite">
          الاختيار الحالي في المعاينة: {selectedDecorationName}. لا توجد مزامنة
          مع الخادم.
        </p>
      </section>
    </>
  );
}

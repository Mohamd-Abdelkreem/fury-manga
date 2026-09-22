"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";
import type { AdminGiftDesign } from "../../types/admin.types";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import styles from "./AdminGifts.module.css";

interface AdminGiftPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gift?: AdminGiftDesign | undefined;
}

const SAMPLE_AVATARS = [
  "/anime/341452.jpg",
  "/anime/366722.jpg",
  "/anime/384226.jpg",
  "/anime/463592.jpg",
];

export function AdminGiftPreviewModal({
  isOpen,
  onClose,
  gift,
}: AdminGiftPreviewModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(
    SAMPLE_AVATARS[0] ?? "/anime/341452.jpg",
  );

  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen,
    onClose,
  });

  if (!isOpen || !gift) return null;

  return (
    <div
      className={styles["modalBackdrop"]}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-preview-title"
    >
      <div
        ref={dialogRef}
        className={styles["modalContent"]}
        onKeyDown={onDialogKeyDown}
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ maxWidth: "600px" }}
      >
        <div className={styles["modalHeader"]}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles
              style={{
                width: "1.25rem",
                height: "1.25rem",
                color: "var(--primary)",
              }}
            />
            <div>
              <h3 id="gift-preview-title" className={styles["modalTitle"]}>
                معاينة حية: {gift.name}
              </h3>
              <span
                style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}
              >
                {gift.type === "avatar_frame"
                  ? "إطار صورة شخصية"
                  : "زخرفة تعليق"}{" "}
                • محاكاة الواجهة الحقيقية
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles["iconBtn"]}
            aria-label="إغلاق"
          >
            <X style={{ width: "1rem", height: "1rem" }} />
          </button>
        </div>

        <div className={styles["modalBody"]}>
          {gift.type === "avatar_frame" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                alignItems: "center",
              }}
            >
              {/* Live Framed Avatar Demonstration */}
              <div
                style={{
                  background: "#0d0d0d",
                  padding: "2.5rem",
                  borderRadius: "1rem",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "9999px",
                    position: "relative",
                    padding: "6px",
                    border: `3px solid ${gift.accentColor}`,
                    boxShadow: `0 0 24px ${gift.ringColor || "rgba(255,71,71,0.3)"}`,
                    background: "#161616",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "9999px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={selectedAvatar}
                      alt="معاينة الصورة الشخصية"
                      fill
                      sizes="100px"
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <h4
                    style={{
                      margin: "0 0 0.25rem",
                      color: "#ffffff",
                      fontSize: "1rem",
                      fontWeight: 700,
                    }}
                  >
                    سارة العتيبي
                  </h4>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: gift.accentColor,
                      fontWeight: 700,
                    }}
                  >
                    إطار مفعل: {gift.name}
                  </span>
                </div>
              </div>

              {/* Avatar Selector */}
              <div style={{ width: "100%", textAlign: "center" }}>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  جرّب الإطار على صور شخصية مختلفة:
                </span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.75rem",
                  }}
                >
                  {SAMPLE_AVATARS.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(url);
                      }}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "9999px",
                        overflow: "hidden",
                        position: "relative",
                        border:
                          selectedAvatar === url
                            ? `2px solid ${gift.accentColor}`
                            : "2px solid rgba(255,255,255,0.1)",
                        cursor: "pointer",
                        padding: 0,
                        background: "none",
                        transition: "transform 150ms ease",
                      }}
                      aria-label="اختيار صورة شخصية للمعاينة"
                    >
                      <Image
                        src={url}
                        alt="نموذج صورة"
                        fill
                        sizes="44px"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                معاينة مظهر تعليقات القارئ عند تفعيل زخرفة ({gift.name}):
              </span>

              {/* Realistic Comment Box Mockup */}
              <div
                style={{
                  background: "#161616",
                  borderRight: `4px solid ${gift.accentColor}`,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: "1px solid rgba(255,255,255,0.06)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "0.625rem",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  boxShadow: `0 4px 16px rgba(0,0,0,0.4), inset 0 0 12px ${gift.accentColor}10`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "9999px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Image
                        src="/anime/366722.jpg"
                        alt="المعلق"
                        fill
                        sizes="36px"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          display: "block",
                        }}
                      >
                        سارة العتيبي
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        قارئة مميزة • منذ ساعتين
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.25rem",
                      background: `${gift.accentColor}20`,
                      color: gift.accentColor,
                      fontWeight: 750,
                      border: `1px solid ${gift.accentColor}40`,
                    }}
                  >
                    {gift.name}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: "1.7",
                    margin: 0,
                  }}
                >
                  هذا الفصل كان استثنائياً بكل المقاييس! الترجمة متقنة للغاية
                  واختيار الخطوط في المشاهد القتالية يضفي حماساً كبيراً. بانتظار
                  الفصل القادم بشوق!
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={styles["modalFooter"]}>
          <button
            type="button"
            onClick={onClose}
            className={styles["btnSecondary"]}
          >
            إغلاق المعاينة
          </button>
        </div>
      </div>
    </div>
  );
}

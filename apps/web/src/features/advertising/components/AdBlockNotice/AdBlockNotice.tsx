"use client";

import { RotateCw, X } from "lucide-react";

import styles from "./AdBlockNotice.module.css";

type AdBlockNoticeProps = Readonly<{
  onRetry: () => void;
  onDismiss?: () => void;
  checking?: boolean;
}>;

export function AdBlockNotice({
  onRetry,
  onDismiss,
  checking = false,
}: AdBlockNoticeProps) {
  return (
    <aside className={styles["notice"]} aria-labelledby="adblock-title">
      <div>
        <h2 id="adblock-title">ساعد في دعم Fury</h2>
        <p>
          يبدو أن مانع الإعلانات أخفى المساحة الإعلانية. يمكنك تعطيله لهذا
          الموقع ثم إعادة الفحص، مع بقاء محتوى الصفحة متاحًا دائمًا.
        </p>
      </div>
      <div className={styles["actions"]}>
        <button type="button" onClick={onRetry} disabled={checking}>
          <RotateCw aria-hidden="true" />
          {checking ? "جارٍ الفحص…" : "إعادة الفحص"}
        </button>
        {onDismiss === undefined ? null : (
          <button
            type="button"
            onClick={onDismiss}
            className={styles["dismiss"]}
          >
            <X aria-hidden="true" />
            إخفاء الرسالة
          </button>
        )}
      </div>
    </aside>
  );
}

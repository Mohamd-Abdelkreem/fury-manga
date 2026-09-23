"use client";

import { useCallback, useEffect, useState } from "react";

import { AdBlockNotice } from "../AdBlockNotice/AdBlockNotice";
import {
  ADVERTISEMENT_PLACEMENTS,
  checkForAdBlock,
  isAdvertisementPlacementEnabled,
  type AdBlockCheckResult,
  type AdvertisementPlacement,
} from "../../model/advertising";
import styles from "./AdvertisementSlot.module.css";

const DISMISSAL_KEY = "fury:adblock-notice-dismissed";

type AdvertisementSlotProps = Readonly<{
  placement: AdvertisementPlacement;
  detector?: () => Promise<AdBlockCheckResult>;
  preview?: boolean;
}>;

export function AdvertisementSlot({
  placement,
  detector = checkForAdBlock,
  preview = false,
}: AdvertisementSlotProps) {
  const config = ADVERTISEMENT_PLACEMENTS[placement];
  const enabled = preview || isAdvertisementPlacementEnabled(placement);
  const [result, setResult] = useState<AdBlockCheckResult>("unknown");
  const [checking, setChecking] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(DISMISSAL_KEY) === "true";
    } catch {
      return false;
    }
  });

  const runCheck = useCallback(async () => {
    setChecking(true);
    try {
      setResult(await detector());
    } catch {
      setResult("unknown");
    } finally {
      setChecking(false);
    }
  }, [detector]);

  useEffect(() => {
    if (!enabled || preview || dismissed) return;
    const timeoutId = window.setTimeout(() => {
      void runCheck();
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dismissed, enabled, preview, runCheck]);

  if (!enabled) return null;

  return (
    <section className={styles["region"]} aria-label={config.label}>
      <div className={styles["slot"]} data-ad-placement={placement}>
        <span>{preview ? "معاينة غير منشورة" : "إعلان"}</span>
        <strong>{config.label}</strong>
        <small>{config.dimensions}</small>
      </div>
      {!preview && result === "blocked" && !dismissed ? (
        <AdBlockNotice
          checking={checking}
          onRetry={() => void runCheck()}
          onDismiss={() => {
            setDismissed(true);
            try {
              window.sessionStorage.setItem(DISMISSAL_KEY, "true");
            } catch {
              // Storage is optional; the notice remains safely dismissible in memory.
            }
          }}
        />
      ) : null}
    </section>
  );
}

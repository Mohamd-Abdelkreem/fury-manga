"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import type {
  AdminActivityEvent,
  AdminAdPlacement,
} from "../types/admin.types";

interface AdminAdActionState {
  globalAdsEnabled: boolean;
  setGlobalAdsEnabled: Dispatch<SetStateAction<boolean>>;
  adPlacements: AdminAdPlacement[];
  setAdPlacements: Dispatch<SetStateAction<AdminAdPlacement[]>>;
  setActivities: Dispatch<SetStateAction<AdminActivityEvent[]>>;
  actorName: string;
}

export function useAdminAdActions({
  globalAdsEnabled,
  setGlobalAdsEnabled,
  adPlacements,
  setAdPlacements,
  setActivities,
  actorName,
}: AdminAdActionState) {
  const toggleGlobalAds = useCallback((): void => {
    const next = !globalAdsEnabled;
    setGlobalAdsEnabled(next);
    setActivities((actPrev) => [
      {
        id: `act-${String(Date.now())}`,
        type: "chapter_published",
        title: next ? "تفعيل الإعلانات العامة" : "تعطيل الإعلانات العامة",
        description: next
          ? "تم تفعيل الإعلانات العامة على مستوى المنصة."
          : "تم تعطيل الإعلانات العامة مؤقتاً عبر مفتاح الطوارئ.",
        timestamp: "الآن",
        actor: actorName,
      },
      ...actPrev,
    ]);
  }, [globalAdsEnabled, actorName, setActivities, setGlobalAdsEnabled]);

  const updateAdPlacement = useCallback(
    (
      id: string,
      updates: Partial<AdminAdPlacement>,
    ): AdminAdPlacement | undefined => {
      const current = adPlacements.find(
        (placement) => placement.id.toLowerCase() === id.toLowerCase(),
      );
      if (current === undefined) return undefined;

      const updatedPlacement: AdminAdPlacement = {
        ...current,
        ...updates,
        updatedAt: "الآن",
      };
      setAdPlacements((previous) =>
        previous.map((placement) =>
          placement.id.toLowerCase() === id.toLowerCase()
            ? { ...placement, ...updates, updatedAt: "الآن" }
            : placement,
        ),
      );
      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "work_created",
          title: "تحديث مساحة إعلانية",
          description: `تم تحديث المساحة الإعلانية '${updatedPlacement.name}'.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);
      return updatedPlacement;
    },
    [adPlacements, actorName, setActivities, setAdPlacements],
  );

  return {
    toggleGlobalAds,
    updateAdPlacement,
  };
}

export type AdvertisementPlacement = "home-banner" | "catalog-banner";

export type AdBlockCheckResult = "allowed" | "blocked" | "unknown";

export interface AdvertisementPlacementConfig {
  key: AdvertisementPlacement;
  label: string;
  dimensions: string;
  enabled: boolean;
}

export const ADVERTISEMENT_PROVIDER = "Adsterra" as const;

export const ADVERTISEMENT_PLACEMENTS: Record<
  AdvertisementPlacement,
  AdvertisementPlacementConfig
> = {
  "home-banner": {
    key: "home-banner",
    label: "مساحة إعلانية للصفحة الرئيسية",
    dimensions: "728 × 90",
    enabled: true,
  },
  "catalog-banner": {
    key: "catalog-banner",
    label: "مساحة إعلانية لصفحات التصفح",
    dimensions: "728 × 90",
    enabled: true,
  },
};

export const GLOBAL_ADVERTISEMENTS_ENABLED: boolean = true;

export function isAdvertisementPlacementEnabled(
  placement: AdvertisementPlacement,
): boolean {
  return (
    GLOBAL_ADVERTISEMENTS_ENABLED && ADVERTISEMENT_PLACEMENTS[placement].enabled
  );
}

export async function checkForAdBlock(): Promise<AdBlockCheckResult> {
  if (typeof document === "undefined") return "unknown";

  let bait: HTMLDivElement | undefined;
  try {
    bait = document.createElement("div");
    bait.className = "adsbox ad-banner advertisement";
    bait.setAttribute("aria-hidden", "true");
    bait.style.cssText =
      "position:absolute;inset:auto auto -9999px -9999px;width:1px;height:1px;";
    document.body.append(bait);

    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => {
        resolve();
      });
    });

    const style = window.getComputedStyle(bait);
    const blocked =
      !bait.isConnected ||
      style.display === "none" ||
      style.visibility === "hidden";
    return blocked ? "blocked" : "allowed";
  } catch {
    return "unknown";
  } finally {
    bait?.remove();
  }
}

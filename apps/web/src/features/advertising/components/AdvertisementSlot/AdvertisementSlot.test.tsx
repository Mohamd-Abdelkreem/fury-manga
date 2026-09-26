import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdvertisementSlot } from "./AdvertisementSlot";

describe("AdvertisementSlot", () => {
  it.each(["home-banner", "catalog-banner"] as const)(
    "keeps %s and ad-block detection disabled until provider integration",
    (placement) => {
      const detector = vi.fn().mockResolvedValue("blocked");
      const { container } = render(
        <AdvertisementSlot placement={placement} detector={detector} />,
      );

      expect(container.querySelector("[data-ad-placement]")).toBeNull();
      expect(screen.queryByText("ساعد في دعم Fury")).not.toBeInTheDocument();
      expect(detector).not.toHaveBeenCalled();
    },
  );

  it("renders a labeled admin preview without starting ad-block detection", () => {
    const detector = vi.fn().mockResolvedValue("blocked");
    const { container } = render(
      <AdvertisementSlot placement="home-banner" preview detector={detector} />,
    );

    expect(
      container.querySelector('[data-ad-placement="home-banner"]'),
    ).not.toBeNull();
    expect(screen.getByText("معاينة غير منشورة")).toBeInTheDocument();
    expect(detector).not.toHaveBeenCalled();
  });
});

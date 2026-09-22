import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdvertisementSlot } from "./AdvertisementSlot";

describe("AdvertisementSlot", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("shows a non-modal notice, retries, and remembers dismissal for the session", async () => {
    const detector = vi.fn().mockResolvedValue("blocked");
    render(
      <AdvertisementSlot placement="catalog-banner" detector={detector} />,
    );

    expect(screen.getByText("مساحة إعلانية لصفحات التصفح")).toBeInTheDocument();
    await screen.findByText("ساعد في دعم Fury");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "إعادة الفحص" }));
    await waitFor(() => {
      expect(detector).toHaveBeenCalledTimes(2);
    });

    fireEvent.click(screen.getByRole("button", { name: "إخفاء الرسالة" }));
    expect(screen.queryByText("ساعد في دعم Fury")).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem("fury:adblock-notice-dismissed")).toBe(
      "true",
    );
  });

  it("keeps the advertisement region available when detection fails", async () => {
    const detector = vi.fn().mockRejectedValue(new Error("Detection failed"));
    render(<AdvertisementSlot placement="home-banner" detector={detector} />);

    expect(
      screen.getByText("مساحة إعلانية للصفحة الرئيسية"),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(detector).toHaveBeenCalledOnce();
    });
    expect(screen.queryByText("ساعد في دعم Fury")).not.toBeInTheDocument();
  });
});

"use client";

import { useSyncExternalStore } from "react";

const subscribe = (listener: () => void) => {
  if (typeof window.matchMedia !== "function") return () => {};
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => {
    media.removeEventListener("change", listener);
  };
};

export const useReducedMotion = () =>
  useSyncExternalStore(
    subscribe,
    () =>
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );

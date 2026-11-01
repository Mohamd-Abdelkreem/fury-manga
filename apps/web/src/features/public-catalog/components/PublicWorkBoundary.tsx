"use client";

import { Fragment, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Fresh server output resets a latched Work 404 without resetting the root query owner. */
export function PublicWorkBoundary({
  children,
  renderId,
}: Readonly<{ children: ReactNode; renderId: string }>) {
  const directWork = /^\/story\/[^/]+$/.test(usePathname());
  return directWork ? <Fragment key={renderId}>{children}</Fragment> : children;
}

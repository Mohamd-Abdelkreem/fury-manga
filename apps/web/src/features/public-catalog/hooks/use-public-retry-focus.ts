"use client";

import { useCallback, useEffect, useRef } from "react";

type RetryState = Readonly<{
  isFetching: boolean;
  isPending: boolean;
  dataUpdatedAt: number;
  errorUpdatedAt: number;
}>;

/** A completed explicit retry focuses its current result or error, never another identity. */
export const usePublicRetryFocus = (identity: string, state: RetryState) => {
  const targetRef = useRef<HTMLElement>(null);
  const requestedRef = useRef<string | undefined>(undefined);
  const target = useCallback((node: HTMLElement | null) => {
    targetRef.current = node;
  }, []);
  const requestFocus = useCallback(() => {
    requestedRef.current = identity;
  }, [identity]);
  const settled = !state.isFetching && !state.isPending;
  useEffect(() => {
    if (requestedRef.current !== identity) {
      requestedRef.current = undefined;
      return;
    }
    if (settled && targetRef.current !== null) {
      targetRef.current.focus();
      requestedRef.current = undefined;
    }
  }, [identity, settled, state.dataUpdatedAt, state.errorUpdatedAt]);
  return { target, requestFocus };
};

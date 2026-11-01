"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useProgressiveChapterImages } from "../hooks/use-progressive-chapter-images";
import type { IllustratedPage } from "../model/progressive-images";

export function IllustratedChapterPages({
  pages,
  scopeKey,
}: Readonly<{ pages: readonly IllustratedPage[]; scopeKey: string }>) {
  const [position, setPosition] = useState(0);
  const images = useProgressiveChapterImages(pages, scopeKey, position);
  const items = useRef(new Map<number, HTMLLIElement>());
  const focusAfterRetry = useRef<number | undefined>(undefined);
  const focusRetryResult = useCallback((index: number) => {
    const item = items.current.get(index);
    if (focusAfterRetry.current === index && item?.isConnected) {
      item.focus();
      focusAfterRetry.current = undefined;
    }
  }, []);
  useEffect(() => {
    const index = focusAfterRetry.current;
    const page = index === undefined ? undefined : pages[index];
    if (
      page !== undefined &&
      images.resources.get(page.assetId)?.phase === "error" &&
      index !== undefined
    )
      focusRetryResult(index);
  }, [images.resources, pages, focusRetryResult]);

  const observePages = useCallback((list: HTMLOListElement | null) => {
    if (list === null) return;
    let root: HTMLElement | null = list.parentElement;
    while (
      root !== null &&
      !["auto", "scroll"].includes(getComputedStyle(root).overflowY)
    )
      root = root.parentElement;
    const visible = new Set<number>();
    let active = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!active || !list.isConnected) return;
        const children = [...list.children];
        for (const entry of entries) {
          const index = children.indexOf(entry.target);
          if (entry.isIntersecting) visible.add(index);
          else visible.delete(index);
        }
        const bounds = root?.getBoundingClientRect() ?? {
          top: 0,
          bottom: innerHeight,
        };
        let best: number | undefined;
        let area = 0;
        for (const index of visible) {
          const box = children[index]?.getBoundingClientRect();
          if (box === undefined) continue;
          const height = Math.max(
            0,
            Math.min(box.bottom, bounds.bottom) - Math.max(box.top, bounds.top),
          );
          if (height > area) {
            best = index;
            area = height;
          }
        }
        if (best !== undefined) setPosition(best);
      },
      { root, threshold: Array.from({ length: 21 }, (_, index) => index / 20) },
    );
    for (const item of list.children) observer.observe(item);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  if (!images.available)
    return <p role="status">جارٍ التحقق من صلاحية الإدارة…</p>;
  return (
    <ol
      ref={observePages}
      aria-label="صفحات الفصل المصور"
      style={{ listStyle: "none", padding: 0, margin: 0 }}
    >
      {pages.map((page, index) => {
        const resource = images.resources.get(page.assetId);
        const width = resource?.width ?? page.width ?? 720;
        const height = resource?.height ?? page.height ?? 1024;
        const url = resource?.url;
        return (
          <li
            key={page.id ?? `${page.assetId}-${String(index)}`}
            ref={(node) => {
              if (node === null) items.current.delete(index);
              else items.current.set(index, node);
            }}
            tabIndex={-1}
            data-media-page-focus=""
            style={{
              aspectRatio: `${String(width)} / ${String(height)}`,
              position: "relative",
            }}
          >
            {url === undefined ? (
              <div style={{ position: "absolute", inset: 0 }}>
                <p
                  role={
                    resource?.phase === "error"
                      ? "alert"
                      : resource?.phase === "loading"
                        ? "status"
                        : undefined
                  }
                >
                  {resource?.phase === "error"
                    ? "تعذر عرض الصورة الخاصة."
                    : resource?.phase === "loading"
                      ? "جارٍ تحميل الصفحة…"
                      : "ستُحمّل الصفحة عند الاقتراب منها."}
                </p>
                {resource?.phase === "error" ? (
                  <button
                    type="button"
                    className="button button--small"
                    onClick={() => {
                      focusAfterRetry.current = index;
                      images.retry(page.assetId);
                    }}
                  >
                    إعادة تحميل الصفحة {index + 1}
                  </button>
                ) : null}
              </div>
            ) : (
              <Image
                src={url}
                alt={`صفحة ${String(index + 1)}`}
                width={width}
                height={height}
                unoptimized
                loading={index === position ? "eager" : "lazy"}
                onLoad={() => {
                  focusRetryResult(index);
                }}
                onError={() => {
                  images.failedDisplay(page.assetId, url);
                }}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

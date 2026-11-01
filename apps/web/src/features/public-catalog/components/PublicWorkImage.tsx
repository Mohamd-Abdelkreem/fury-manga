"use client";

import { useCallback, useState, type CSSProperties } from "react";
import { usePublicRetryFocus } from "../hooks/use-public-retry-focus";
import { usePublicCatalogImage } from "../hooks/public-catalog.hooks";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { createMediaImageUrl } from "@/features/media/hooks/media-image-display";

/** Blob transport omits same-origin cookies and avoids a shared image optimizer. */
export function PublicWorkImage({
  slug,
  kind = "cover",
  alt,
  className,
  style,
  retryable = true,
  loading = "lazy",
}: Readonly<{
  slug: string;
  kind?: "cover" | "background";
  alt: string;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  retryable?: boolean;
  loading?: "lazy" | "eager";
}>) {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const image = usePublicCatalogImage(
    slug,
    kind,
    loading === "eager" || visible,
  );
  const { target: targetRef, requestFocus } = usePublicRetryFocus(
    `${slug}:${kind}`,
    image,
  );
  const [failed, setFailed] = useState<Blob>();
  const blob = image.data;
  const attach = useCallback(
    (node: HTMLImageElement | HTMLDivElement | null) => {
      if (node === null) return;
      targetRef(node);
      const controller = new AbortController();
      let url: string | undefined;
      node.removeAttribute("src");
      if (node instanceof HTMLImageElement && blob !== undefined) {
        void createMediaImageUrl(blob, reducedMotion, controller.signal)
          .then((result) => {
            if (controller.signal.aborted) {
              URL.revokeObjectURL(result.url);
              return;
            }
            url = result.url;
            node.src = result.url;
          })
          .catch(() => {
            if (!controller.signal.aborted) setFailed(blob);
          });
      }
      const observer =
        loading === "lazy" && !visible
          ? new IntersectionObserver(
              (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                  setVisible(true);
                }
              },
              { rootMargin: "200px" },
            )
          : undefined;
      observer?.observe(node);
      return () => {
        controller.abort();
        observer?.disconnect();
        node.removeAttribute("src");
        targetRef(null);
        if (url !== undefined) URL.revokeObjectURL(url);
      };
    },
    [blob, loading, visible, targetRef, reducedMotion],
  );
  if (image.isError || (blob !== undefined && failed === blob))
    return (
      <div
        tabIndex={-1}
        data-public-catalog-focus=""
        ref={attach}
        className={className}
        style={style}
        role="status"
        dir="rtl"
      >
        <span>تعذّر تحميل الصورة</span>{" "}
        {retryable ? (
          <button
            type="button"
            className="button button--small"
            onClick={() => {
              requestFocus();
              void image.refetch();
            }}
          >
            إعادة تحميل الصورة
          </button>
        ) : null}
      </div>
    );
  return (
    <img
      data-public-catalog-focus=""
      tabIndex={-1}
      key={`${slug}:${kind}`}
      ref={attach}
      alt={alt}
      loading={loading}
      className={className}
      style={style}
      aria-busy={image.isFetching || undefined}
      onError={() => {
        if (blob !== undefined) setFailed(blob);
      }}
    />
  );
}

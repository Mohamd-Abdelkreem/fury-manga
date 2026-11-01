import "server-only";
import { cache } from "react";
import type { Metadata } from "next";
import type { CatalogDetailData } from "@fury/contracts";
import { getServerEnvironment } from "@/config/server-environment";
import { publicImageUrl } from "@/config/public-media";
import { SafePublicCatalogError } from "../model/public-catalog.errors";
import { publicCatalogServer } from "./public-catalog.server";

export const getPublicWork = cache((slug: string) =>
  publicCatalogServer.getDetail(slug),
);
export const publicPageMetadata = (
  path: string,
  title: string,
  description: string,
  query = false,
): Metadata => {
  const canonical = new URL(path, getServerEnvironment().SITE_ORIGIN).href;
  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: !query, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: "ar_AR",
      type: "website",
    },
  };
};
export const publicWorkMetadata = (detail: CatalogDetailData): Metadata => {
  const { work } = detail;
  const description = work.synopsis.slice(0, 200);
  const base = publicPageMetadata(
    `/story/${work.slug}`,
    work.title,
    description,
  );
  const images = [{ url: publicImageUrl(work.coverPath), alt: work.title }];
  return {
    ...base,
    openGraph: { ...base.openGraph, images },
    twitter: {
      card: "summary_large_image",
      title: work.title,
      description,
      images,
    },
  };
};
export const unavailableWorkMetadata = (error: unknown): Metadata => {
  if (!(error instanceof SafePublicCatalogError)) throw error;
  return {
    title:
      error.statusCode === 404 ? "العمل غير موجود" : "المحتوى غير متاح مؤقتًا",
    robots: { index: false, follow: false },
    openGraph: { images: [] },
    twitter: { images: [] },
  };
};

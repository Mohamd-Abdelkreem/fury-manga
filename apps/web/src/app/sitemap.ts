import type { MetadataRoute } from "next";
import { getServerEnvironment } from "@/config/server-environment";
import { publicCatalogServer } from "@/features/public-catalog/api/public-catalog.server";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { SITE_ORIGIN } = getServerEnvironment();
  const data = await publicCatalogServer.getSitemap();
  return [
    "/",
    "/discover",
    "/stories",
    "/categories",
    ...data.items.map((work) => `/story/${work.slug}`),
  ].map((path) => ({ url: new URL(path, SITE_ORIGIN).href }));
}

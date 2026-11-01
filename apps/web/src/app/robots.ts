import type { MetadataRoute } from "next";
import { getServerEnvironment } from "@/config/server-environment";

export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
  const { SITE_ORIGIN } = getServerEnvironment();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/auth",
        "/auth/",
        "/admin",
        "/admin/",
        "/dashboard",
        "/library",
        "/settings",
        "/story/*/chapter/",
      ],
    },
    sitemap: new URL("/sitemap.xml", SITE_ORIGIN).href,
  };
}

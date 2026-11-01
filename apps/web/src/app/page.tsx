import { PublicHome } from "@/features/home/components/PublicHome";
import { publicCatalogServer } from "@/features/public-catalog/api/public-catalog.server";
import { SafePublicCatalogError } from "@/features/public-catalog/model/public-catalog.errors";
import { getServerEnvironment } from "@/config/server-environment";
import { publicPageMetadata } from "@/features/public-catalog/api/public-catalog.seo";

export const generateMetadata = () =>
  publicPageMetadata(
    "/",
    "Fury — اكتشف الأعمال المنشورة",
    "اكتشف الأعمال المميزة وأحدث الفصول والتصنيفات المنشورة على Fury.",
  );
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const { COMMUNITY_URL: communityUrl } = getServerEnvironment();
  let seed;
  try {
    seed = await publicCatalogServer.getHome();
  } catch (error) {
    if (!(error instanceof SafePublicCatalogError)) throw error;
  }
  return (
    <PublicHome
      {...(seed === undefined ? { initialUnavailable: true } : { seed })}
      communityUrl={communityUrl}
    />
  );
}

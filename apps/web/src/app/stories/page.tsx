import { publicPageMetadata } from "@/features/public-catalog/api/public-catalog.seo";

import { Footer } from "@/features/home/components/Footer/Footer";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { PublicCatalogListing } from "@/features/public-catalog/components/PublicCatalogListing";
import { normalizeCatalogSearch } from "@/features/public-catalog/model/catalog-query";
import { routeSearch } from "@/features/public-catalog/model/public-catalog.presentation";
import { readCatalogPage } from "@/features/public-catalog/api/public-catalog.pages";
import { redirect } from "next/navigation";
import type { Route } from "next";
import styles from "../discover/page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  return publicPageMetadata(
    "/stories",
    "الروايات والقصص النصية",
    "اكتشف الروايات والقصص النصية المنشورة واختر النوع والتصنيف المناسبين.",
    Object.keys(await searchParams).length > 0,
  );
}

type StoriesPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const raw = routeSearch(await searchParams);
  const { query, search } = normalizeCatalogSearch(raw, "stories");
  if (raw !== search)
    redirect((search === "" ? "/stories" : `/stories?${search}`) as Route);
  const data = await readCatalogPage(query);
  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />
        <div className={styles["contentContainer"]}>
          <PublicCatalogListing query={query} {...data} />
        </div>
        <Footer categories={data.categories?.items ?? []} />
      </div>
    </div>
  );
}

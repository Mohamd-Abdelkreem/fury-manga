import { publicPageMetadata } from "@/features/public-catalog/api/public-catalog.seo";
import { normalizeCategorySearch } from "@/features/public-catalog/model/catalog-query";
import {
  routeSearch,
  categoryHref,
} from "@/features/public-catalog/model/public-catalog.presentation";
import { publicCatalogServer } from "@/features/public-catalog/api/public-catalog.server";
import { SafePublicCatalogError } from "@/features/public-catalog/model/public-catalog.errors";
import { redirect } from "next/navigation";
import type { Route } from "next";

import { CategoriesDirectory } from "@/features/categories/components/CategoriesDirectory/CategoriesDirectory";
import { Footer } from "@/features/home/components/Footer/Footer";
import { Navbar } from "@/features/home/components/Navbar/Navbar";

export const dynamic = "force-dynamic";
export async function generateMetadata({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  return publicPageMetadata(
    "/categories",
    "التصنيفات",
    "استكشف التصنيفات المتاحة والأعمال المنشورة المرتبطة بها على Fury.",
    Object.keys(await searchParams).length > 0,
  );
}

export default async function CategoriesPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const raw = routeSearch(await searchParams);
  const { query, search } = normalizeCategorySearch(raw);
  if (raw !== search) redirect(categoryHref(query.q, query.page) as Route);
  let props;
  try {
    props = { seed: await publicCatalogServer.listCategories(query) };
  } catch (error) {
    if (!(error instanceof SafePublicCatalogError)) throw error;
    props = { initialUnavailable: true };
  }
  return (
    <>
      <Navbar />
      <CategoriesDirectory query={query} {...props} />
      <Footer categories={props.seed?.items ?? []} />
    </>
  );
}

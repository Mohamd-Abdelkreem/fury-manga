import type { Metadata } from "next";

import { Footer } from "@/features/home/components/Footer/Footer";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { TextStoriesListing } from "@/features/text-stories/components/TextStoriesListing/TextStoriesListing";
import { parseCatalogQuery } from "@/features/text-stories/model/catalog";
import styles from "../discover/page.module.css";

export const metadata: Metadata = {
  title: "الروايات والقصص النصية",
  description: "تصفح الروايات والقصص النصية العربية على Fury.",
};

type StoriesPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const query = parseCatalogQuery(await searchParams);
  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />
        <div className={styles["contentContainer"]}>
          <TextStoriesListing query={query} />
        </div>
        <Footer />
      </div>
    </div>
  );
}

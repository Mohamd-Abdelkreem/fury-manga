import type { CatalogDetailData } from "@fury/contracts";
import {
  ChapterList,
  type ChapterListSelection,
} from "@/features/story/components/ChapterList/ChapterList";
import { SimilarStories } from "@/features/story/components/SimilarStories/SimilarStories";
import { StorySidebar } from "@/features/story/components/StorySidebar/StorySidebar";
import styles from "./TextWorkDetails.module.css";

export function TextWorkDetails({
  detail,
  selection,
}: Readonly<{
  detail: CatalogDetailData;
  selection?: ChapterListSelection | undefined;
}>) {
  return (
    <>
      <div className={styles["sidebarCol"]}>
        <StorySidebar work={detail.work} />
      </div>
      <main className={styles["mainCol"]} id="main-content">
        <ChapterList detail={detail} selection={selection} />
        <SimilarStories similarWorks={detail.similar} />
      </main>
    </>
  );
}

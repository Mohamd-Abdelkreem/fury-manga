import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { Footer } from "@/features/home/components/Footer/Footer";
import { StoryBanner } from "@/features/story/components/StoryBanner/StoryBanner";
import { StorySidebar } from "@/features/story/components/StorySidebar/StorySidebar";
import { ChapterList } from "@/features/story/components/ChapterList/ChapterList";
import { SimilarStories } from "@/features/story/components/SimilarStories/SimilarStories";
import { CommentsSection } from "@/features/story/components/CommentsSection/CommentsSection";
import { STORY_DETAIL } from "@/features/story/data/storyData";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const capitalizedTitle = id
    ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ")
    : "Trait Hoarder";

  return {
    title: `Fury - عمل ${capitalizedTitle} مترجم`,
    description: `شاهد صفحة تفاصيل عمل ${capitalizedTitle} وقراءة جميع الفصول مترجمة مجاناً على منصة Fury.`,
  };
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Navigation */}
        <Navbar />

        {/* Story Wide Banner */}
        <StoryBanner bannerImage={STORY_DETAIL.bannerImage} />

        {/* Content Container */}
        <div className={styles["contentContainer"]}>
          <div className={styles["layoutGrid"]}>
            {/* Sidebar Column */}
            <div className={styles["sidebarCol"]}>
              <StorySidebar
                coverImage={STORY_DETAIL.coverImage}
                title={STORY_DETAIL.title}
                rating={STORY_DETAIL.rating}
                bookmarkedBy={STORY_DETAIL.bookmarkedBy}
                status={STORY_DETAIL.status}
                type={STORY_DETAIL.type}
                publishedDate={STORY_DETAIL.publishedDate}
                author={STORY_DETAIL.author}
                artist={STORY_DETAIL.artist}
                publisher={STORY_DETAIL.publisher}
                translator={STORY_DETAIL.translator}
                lastUpdated={STORY_DETAIL.lastUpdated}
                views={STORY_DETAIL.views}
              />
            </div>

            {/* Main Details Column (Title, Genres, Description, Chapters) */}
            <main className={styles["mainCol"]}>
              {/* Info Details, Description & Chapters List */}
              <ChapterList
                storyId={id}
                title={STORY_DETAIL.title}
                alternativeTitles={STORY_DETAIL.alternativeTitles}
                description={STORY_DETAIL.description}
                genres={STORY_DETAIL.genres}
                chapters={STORY_DETAIL.chapters}
              />

              {/* Similar Works Grid */}
              <SimilarStories similarWorks={STORY_DETAIL.similarWorks} />

              {/* Discussion / Comments Area */}
              <CommentsSection />
            </main>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

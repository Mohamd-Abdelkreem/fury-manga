import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { Footer } from "@/features/home/components/Footer/Footer";
import { StoryBanner } from "@/features/story/components/StoryBanner/StoryBanner";
import { StorySidebar } from "@/features/story/components/StorySidebar/StorySidebar";
import { ChapterList } from "@/features/story/components/ChapterList/ChapterList";
import { SimilarStories } from "@/features/story/components/SimilarStories/SimilarStories";
import { CommentsSection } from "@/features/story/components/CommentsSection/CommentsSection";
import { getIllustratedStoryById } from "@/features/story/data/storyData";
import { TextWorkDetails } from "@/features/text-stories/components/TextWorkDetails/TextWorkDetails";
import { getTextWorkById } from "@/features/text-stories/data/textStories";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const work = getTextWorkById(id) ?? getIllustratedStoryById(id);
  if (work === undefined) return { title: "العمل غير موجود" };

  return {
    title: work.title,
    description: work.description,
  };
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const textWork = getTextWorkById(id);

  if (textWork !== undefined) {
    return (
      <div className={styles["pageWrapper"]} dir="rtl">
        <div style={{ position: "relative", zIndex: 10 }}>
          <Navbar />
          <StoryBanner bannerImage={textWork.banner ?? textWork.cover} />
          <div className={styles["contentContainer"]}>
            <div className={styles["layoutGrid"]}>
              <TextWorkDetails work={textWork} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  const story = getIllustratedStoryById(id);
  if (story === undefined) notFound();

  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Navigation */}
        <Navbar />

        {/* Story Wide Banner */}
        <StoryBanner bannerImage={story.bannerImage} />

        {/* Content Container */}
        <div className={styles["contentContainer"]}>
          <div className={styles["layoutGrid"]}>
            {/* Sidebar Column */}
            <div className={styles["sidebarCol"]}>
              <StorySidebar
                coverImage={story.coverImage}
                title={story.title}
                rating={story.rating}
                bookmarkedBy={story.bookmarkedBy}
                status={story.status}
                type={story.type}
                publishedDate={story.publishedDate}
                author={story.author}
                artist={story.artist}
                publisher={story.publisher}
                translator={story.translator}
                lastUpdated={story.lastUpdated}
                views={story.views}
              />
            </div>

            {/* Main Details Column (Title, Genres, Description, Chapters) */}
            <main className={styles["mainCol"]}>
              {/* Info Details, Description & Chapters List */}
              <ChapterList
                storyId={id}
                title={story.title}
                alternativeTitles={story.alternativeTitles}
                description={story.description}
                genres={story.genres}
                chapters={story.chapters}
              />

              {/* Similar Works Grid */}
              <SimilarStories similarWorks={story.similarWorks} />

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

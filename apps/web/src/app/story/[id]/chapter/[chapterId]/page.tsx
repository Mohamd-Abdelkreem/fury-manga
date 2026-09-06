"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Check,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/features/home/components/Navbar/Navbar";
import { Footer } from "@/features/home/components/Footer/Footer";
import { CommentsSection } from "@/features/story/components/CommentsSection/CommentsSection";
import { STORY_DETAIL } from "@/features/story/data/storyData";
import styles from "./page.module.css";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
}

function CustomSelect({ label, value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={styles["customSelectWrapper"]} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles["selectTrigger"]} ${isOpen ? styles["triggerOpen"] : ""}`}
      >
        <div className={styles["triggerText"]}>
          <span className={styles["selectLabel"]}>{label}</span>
          <span className={styles["selectValue"]}>{activeOption?.label}</span>
        </div>
        <ChevronDown size={14} className={styles["triggerArrow"]} />
      </button>

      {isOpen && (
        <ul className={styles["optionsList"]}>
          {options.map((opt) => {
            const isActive = opt.value === value;
            return (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`${styles["optionItem"]} ${isActive ? styles["activeOption"] : ""}`}
              >
                <span className={styles["optionLabel"]}>{opt.label}</span>
                {isActive && (
                  <Check size={14} className={styles["checkIcon"]} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Mock high-quality webtoon pages for reading representation
const MOCK_PAGES = [
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1614583225146-5177e6fbbe7a?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
];

export default function ChapterReadingPage() {
  const params = useParams<{ id: string; chapterId: string }>();
  const router = useRouter();

  const id = encodeURIComponent(params.id);
  const chapterId = params.chapterId.padStart(2, "0");

  const [readingMode, setReadingMode] = useState<"full" | "single">("full");
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [loadedPages, setLoadedPages] = useState<Record<number, boolean>>({});

  // Reset page state on chapter or mode change
  useEffect(() => {
    setLoadedPages({});
    setActivePageIndex(0);
  }, [chapterId, readingMode]);

  // Load active story data
  const story = STORY_DETAIL;

  // Find index of current chapter in descending list
  const chaptersList = story.chapters;
  const currentIdx = chaptersList.findIndex(
    (c) => c.number.padStart(2, "0") === chapterId,
  );

  // Chronological navigation:
  // Since list is descending (e.g. index 0 is ch 43, index 42 is ch 01):
  // - Previous Chapter (chronologically older) is at index + 1
  // - Next Chapter (chronologically newer) is at index - 1
  const nextChapter = currentIdx > 0 ? chaptersList[currentIdx - 1] : null;
  const prevChapter =
    currentIdx >= 0 && currentIdx < chaptersList.length - 1
      ? chaptersList[currentIdx + 1]
      : null;

  const navigateToChapter = (num: string) => {
    router.push(`/story/${id}/chapter/${num}`);
  };

  const handleImageLoad = (index: number) => {
    setLoadedPages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className={styles["pageWrapper"]} dir="rtl">
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Navigation */}
        <Navbar />

        {/* Reader Layout Container */}
        <div className={styles["readerContainer"]}>
          {/* Breadcrumbs */}
          <div className={styles["breadcrumb"]}>
            <Link href="/" className={styles["breadcrumbLink"]}>
              الرئيسية
            </Link>
            <ChevronLeft size={14} className={styles["breadcrumbSeparator"]} />
            <Link href={`/story/${id}`} className={styles["breadcrumbLink"]}>
              {story.title}
            </Link>
            <ChevronLeft size={14} className={styles["breadcrumbSeparator"]} />
            <span className={styles["activeBreadcrumb"]}>
              الفصل {chapterId.padStart(2, "0")}
            </span>
          </div>

          {/* Heading */}
          <div className={styles["chapterHeader"]}>
            <h1 className={styles["chapterTitle"]}>
              {story.title} - الفصل {chapterId.padStart(2, "0")}
            </h1>
            <p className={styles["chapterSubtitle"]}>
              جميع فصول عمل <Link href={`/story/${id}`}>{story.title}</Link>{" "}
              مترجمة احترافياً على Fury
            </p>
          </div>

          {/* Top Control Bar */}
          <div className={styles["controlBar"]}>
            <div className={styles["controlGroup"]}>
              {/* Back to story */}
              <Link href={`/story/${id}`} className={styles["backButton"]}>
                <ArrowLeft size={16} />
                <span>تفاصيل العمل</span>
              </Link>

              {/* Chapter Dropdown */}
              <CustomSelect
                label="الفصل:"
                value={chapterId}
                options={chaptersList.map((ch) => ({
                  label: ch.number.padStart(2, "0"),
                  value: ch.number.padStart(2, "0"),
                }))}
                onChange={(val) => {
                  if (val) {
                    router.push(`/story/${id}/chapter/${val}`);
                  }
                }}
              />

              {/* Reading Mode Selector */}
              <CustomSelect
                label="الوضع:"
                value={readingMode}
                options={[
                  { label: "الفصل بالكامل", value: "full" },
                  { label: "صورة واحدة", value: "single" },
                ]}
                onChange={(val) => setReadingMode(val as "full" | "single")}
              />
            </div>

            {/* Prev/Next Chapter Buttons */}
            <div className={styles["chapterNav"]}>
              <button
                onClick={() =>
                  prevChapter && navigateToChapter(prevChapter.number)
                }
                disabled={!prevChapter}
                className={styles["navBtn"]}
                title="الفصل السابق"
              >
                <ChevronRight size={18} />
                <span>السابق</span>
              </button>
              <button
                onClick={() =>
                  nextChapter && navigateToChapter(nextChapter.number)
                }
                disabled={!nextChapter}
                className={styles["navBtn"]}
                title="الفصل التالي"
              >
                <span>التالي</span>
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>

          {/* Reader Core Area */}
          <div className={styles["readerArea"]} id="readerarea">
            {readingMode === "full" ? (
              // Full Chapter Scroll mode
              <div className={styles["fullScrollContainer"]}>
                {MOCK_PAGES.map((src, index) => (
                  <div key={index} className={styles["pageImageWrapper"]}>
                    {/* Skeleton Loader overlay */}
                    {!loadedPages[index] && (
                      <div className={styles["skeletonLoader"]}>
                        <div className={styles["spinner"]} />
                        <span className={styles["loaderText"]}>
                          جاري تحميل الصفحة {index + 1}...
                        </span>
                      </div>
                    )}
                    <img
                      src={src}
                      alt={`صفحة ${index + 1}`}
                      className={`${styles["mangaPage"]} ${loadedPages[index] ? styles["visible"] : ""}`}
                      onLoad={() => handleImageLoad(index)}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Single page mode
              <div className={styles["singlePageContainer"]}>
                <div className={styles["pageImageWrapper"]}>
                  {!loadedPages[activePageIndex] && (
                    <div className={styles["skeletonLoader"]}>
                      <div className={styles["spinner"]} />
                      <span className={styles["loaderText"]}>
                        جاري تحميل الصفحة {activePageIndex + 1}...
                      </span>
                    </div>
                  )}
                  <img
                    src={MOCK_PAGES[activePageIndex]}
                    alt={`صفحة ${activePageIndex + 1}`}
                    className={`${styles["mangaPage"]} ${loadedPages[activePageIndex] ? styles["visible"] : ""}`}
                    onLoad={() => handleImageLoad(activePageIndex)}
                  />

                  {/* Sidebar Hotspots for next/prev page */}
                  <div
                    className={styles["leftHotspot"]}
                    onClick={() =>
                      activePageIndex < MOCK_PAGES.length - 1 &&
                      setActivePageIndex(activePageIndex + 1)
                    }
                    title="الصفحة التالية"
                  />
                  <div
                    className={styles["rightHotspot"]}
                    onClick={() =>
                      activePageIndex > 0 &&
                      setActivePageIndex(activePageIndex - 1)
                    }
                    title="الصفحة السابقة"
                  />
                </div>

                {/* Page Pagination Controller */}
                <div className={styles["paginationControls"]}>
                  <button
                    onClick={() =>
                      setActivePageIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={activePageIndex === 0}
                    className={styles["pageArrowBtn"]}
                  >
                    السابق
                  </button>
                  <span className={styles["paginationText"]}>
                    الصفحة {activePageIndex + 1} من {MOCK_PAGES.length}
                  </span>
                  <button
                    onClick={() =>
                      setActivePageIndex((prev) =>
                        Math.min(MOCK_PAGES.length - 1, prev + 1),
                      )
                    }
                    disabled={activePageIndex === MOCK_PAGES.length - 1}
                    className={styles["pageArrowBtn"]}
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Control Bar */}
          <div className={styles["controlBar"]} style={{ marginTop: "2rem" }}>
            <div className={styles["controlGroup"]}>
              <Link href={`/story/${id}`} className={styles["backButton"]}>
                <ArrowLeft size={16} />
                <span>تفاصيل العمل</span>
              </Link>

              {/* Chapter Dropdown (bottom) */}
              <CustomSelect
                label="الفصل:"
                value={chapterId}
                options={chaptersList.map((ch) => ({
                  label: ch.number.padStart(2, "0"),
                  value: ch.number.padStart(2, "0"),
                }))}
                onChange={(val) => {
                  if (val) {
                    router.push(`/story/${id}/chapter/${val}`);
                  }
                }}
              />

              {/* Reading Mode Selector (bottom) */}
              <CustomSelect
                label="الوضع:"
                value={readingMode}
                options={[
                  { label: "الفصل بالكامل", value: "full" },
                  { label: "صورة واحدة", value: "single" },
                ]}
                onChange={(val) => setReadingMode(val as "full" | "single")}
              />
            </div>

            <div className={styles["chapterNav"]}>
              <button
                onClick={() =>
                  prevChapter && navigateToChapter(prevChapter.number)
                }
                disabled={!prevChapter}
                className={styles["navBtn"]}
              >
                <ChevronRight size={18} />
                <span>السابق</span>
              </button>
              <button
                onClick={() =>
                  nextChapter && navigateToChapter(nextChapter.number)
                }
                disabled={!nextChapter}
                className={styles["navBtn"]}
              >
                <span>التالي</span>
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className={styles["commentsWrapper"]}>
            <CommentsSection />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

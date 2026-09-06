"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Star,
  Play,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { HERO_ITEMS, GENRES } from "@/features/home/data/heroData";
import type { HeroItem } from "@/types";
import styles from "./HeroSection.module.css";

// ── HeroBackground ────────────────────────────────────────────────────────
interface HeroBackgroundProps {
  activeIndex: number;
  items: HeroItem[];
}

function HeroBackground({ activeIndex, items }: HeroBackgroundProps) {
  return (
    <div className={styles["bgLayer"]}>
      {items.map((item, idx) => (
        <img
          key={`bg-${item.id}`}
          src={item.image}
          alt="hero background"
          className={styles["bgImage"]}
          style={{
            filter: "brightness(0.48) saturate(0.85)",
            opacity: activeIndex === idx ? 1 : 0,
          }}
        />
      ))}

      {/* Layered gradients */}
      <div
        className={styles["gradientLeft"]}
        style={{
          background:
            "linear-gradient(to left, transparent 5%, rgba(31,31,31,0.5) 45%, rgba(31,31,31,0.85) 90%)",
        }}
      />
      <div
        className={styles["gradientBottom"]}
        style={{
          background:
            "linear-gradient(to top, rgba(31,31,31,1) 0%, rgba(31,31,31,0.05) 55%, transparent 100%)",
        }}
      />

      {/* Red atmospheric glow */}
      <div
        className={`${styles["atmosphericGlow"]} animate-pulse`}
        style={{
          background:
            "radial-gradient(circle, rgba(255,71,71,0.15) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}

// ── HeroCharacter ─────────────────────────────────────────────────────────
interface HeroCharacterProps {
  activeIndex: number;
  items: HeroItem[];
}

function HeroCharacter({ activeIndex, items }: HeroCharacterProps) {
  return (
    <div className={styles["characterPane"]}>
      {items.map((item, idx) => (
        <img
          key={`char-${item.id}`}
          src={item.characterImage}
          alt="character"
          className={styles["characterImage"]}
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 100%)",
            filter: "brightness(0.7) saturate(0.95)",
            opacity: activeIndex === idx ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}

// ── HeroContent ───────────────────────────────────────────────────────────
interface HeroContentProps {
  item: HeroItem;
}

function HeroContent({ item }: HeroContentProps) {
  return (
    <div className={styles["contentMain"]}>
      <div key={item.id} className="animate-fade-in">
        {/* Tags */}
        <div className={styles["tags"]}>
          <span
            className={styles["badgeTag"]}
            style={{
              background: "rgba(255, 71, 71, 0.12)",
              border: "1px solid rgba(255, 71, 71, 0.4)",
              color: "var(--primary)",
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
            }}
          >
            <TrendingUp style={{ width: 10, height: 10 }} />
            {item.badge}
          </span>
          <span
            className={styles["genreTag"]}
            style={{
              background: "rgba(255, 179, 0, 0.12)",
              border: "1px solid rgba(255, 179, 0, 0.35)",
              color: "var(--accent)",
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
            }}
          >
            {item.flag} {item.genre}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cairo Play', 'Cairo', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
            color: "var(--foreground)",
            lineHeight: 1.2,
            textShadow: "0 2px 24px rgba(0,0,0,0.5)",
            letterSpacing: "-0.01em",
            textAlign: "left",
            direction: "ltr",
            marginBottom: "0.75rem",
          }}
        >
          {item.title}
          <br />
          <span style={{ color: "var(--primary)" }}>{item.titleAccent}</span>
        </h1>

        {/* Rating */}
        <div className={styles["ratingRow"]}>
          <div className={styles["starGroup"]}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                style={{
                  width: 13,
                  height: 13,
                  fill: "var(--accent)",
                  color: "var(--accent)",
                }}
              />
            ))}
            <span
              style={{
                fontSize: "0.875rem",
                marginRight: "0.375rem",
                color: "var(--accent)",
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 700,
              }}
            >
              {item.rating}
            </span>
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            <BookOpen style={{ display: "inline", width: 12, height: 12 }} />{" "}
            {item.chapters}
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            {item.reads}
          </span>
        </div>

        {/* Description */}
        <p
          className={styles["descParagraph"]}
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "'Cairo', sans-serif",
            fontSize: "0.9rem",
            lineHeight: 1.85,
            maxWidth: "460px",
          }}
        >
          {item.description}
        </p>

        {/* Buttons */}
        <HeroActions storyId={item.id} />
      </div>
    </div>
  );
}

// ── HeroActions ───────────────────────────────────────────────────────────
function HeroActions({ storyId }: { storyId: number }) {
  return (
    <div className={styles["buttonsRow"]}>
      <Link
        href={`/story/${storyId}/chapter/01`}
        className={styles["btnPrimary"]}
        style={{
          background: "var(--primary)",
          color: "#ffffff",
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 800,
          fontSize: "0.95rem",
          boxShadow: "0 4px 24px rgba(255, 71, 71, 0.3)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.background = "var(--primary-hover)";
          el.style.transform = "translateY(-2px)";
          el.style.boxShadow = "0 8px 32px rgba(255, 71, 71, 0.45)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.background = "var(--primary)";
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "0 4px 24px rgba(255, 71, 71, 0.3)";
        }}
      >
        <BookOpen style={{ width: 17, height: 17 }} />
        اقرأ الآن
      </Link>
      <Link
        href={`/story/${storyId}`}
        className={styles["btnSecondary"]}
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--border)",
          color: "var(--muted-foreground)",
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 700,
          fontSize: "0.9rem",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.background = "rgba(255, 71, 71, 0.12)";
          el.style.borderColor = "var(--primary)";
          el.style.color = "var(--foreground)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.background = "rgba(255, 255, 255, 0.04)";
          el.style.borderColor = "var(--border)";
          el.style.color = "var(--muted-foreground)";
        }}
      >
        <Play style={{ width: 14, height: 14 }} />
        المزيد
      </Link>
    </div>
  );
}

// ── HeroNavigation ────────────────────────────────────────────────────────
interface HeroNavigationProps {
  total: number;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (idx: number) => void;
}

function HeroNavigation({
  total,
  activeIndex,
  onPrev,
  onNext,
  onDotClick,
}: HeroNavigationProps) {
  return (
    <>
      {/* Arrows */}
      <div className={styles["arrowsOverlay"]}>
        <button onClick={onPrev} className={styles["navArrow"]}>
          <ChevronRight style={{ width: 22, height: 22 }} />
        </button>
        <button onClick={onNext} className={styles["navArrow"]}>
          <ChevronLeft style={{ width: 22, height: 22 }} />
        </button>
      </div>

      {/* Dots */}
      <div
        className={styles["dotsRow"]}
        style={{ bottom: 72, left: "50%", transform: "translateX(-50%)" }}
      >
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onDotClick(idx)}
            className={styles["dot"]}
            style={{
              width: activeIndex === idx ? "24px" : "8px",
              background:
                activeIndex === idx
                  ? "var(--primary)"
                  : "rgba(255,255,255,0.3)",
              boxShadow:
                activeIndex === idx
                  ? "0 0 10px rgba(255, 71, 71, 0.5)"
                  : "none",
            }}
          />
        ))}
      </div>
    </>
  );
}

// ── GenreBar ──────────────────────────────────────────────────────────────
interface GenreBarProps {
  activeGenre: string | null;
  onGenreChange: (id: string | null) => void;
}

function GenreBar({ activeGenre, onGenreChange }: GenreBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollGenres = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div
      className={styles["genreBar"]}
      style={{
        background: "rgba(10,10,12,0.72)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className={styles["genreInner"]}>
        {/* Scroll right */}
        <button
          onClick={() => scrollGenres("right")}
          aria-label="السابق"
          className={`${styles["genreScrollBtn"]} ${styles["genreScrollBtnLeft"]}`}
        >
          <ChevronRight size={16} />
        </button>

        {/* Genre tabs */}
        <div
          ref={scrollRef}
          className={`${styles["genreScroll"]} no-scrollbar`}
        >
          {GENRES.map((g) => {
            const isActive = activeGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => onGenreChange(isActive ? null : g.id)}
                className={styles["genreBtn"]}
                style={{
                  background: isActive ? "rgba(255,71,71,0.08)" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  if (isActive) return;
                  const el = e.currentTarget;
                  el.style.color = "#ffffff";
                  el.style.background = "rgba(255,255,255,0.04)";
                  const line = el.querySelector(
                    `.${styles["genreLine"]}`,
                  ) as HTMLElement;
                  if (line) {
                    line.style.opacity = "1";
                    line.style.transform = "scaleX(1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isActive) return;
                  const el = e.currentTarget;
                  el.style.color = "rgba(255,255,255,0.5)";
                  el.style.background = "transparent";
                  const line = el.querySelector(
                    `.${styles["genreLine"]}`,
                  ) as HTMLElement;
                  if (line) {
                    line.style.opacity = "0";
                    line.style.transform = "scaleX(0)";
                  }
                }}
              >
                {g.label}
                <span
                  className={styles["genreLine"]}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Scroll left */}
        <button
          onClick={() => scrollGenres("left")}
          aria-label="التالي"
          className={`${styles["genreScrollBtn"]} ${styles["genreScrollBtnRight"]}`}
        >
          <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  );
}

// ── HeroSection Orchestrator ──────────────────────────────────────────────
export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_ITEMS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + HERO_ITEMS.length) % HERO_ITEMS.length,
    );
  }, []);

  // Auto-rotate every 7 seconds, restarts whenever activeIndex changes (e.g. manual navigation)
  useEffect(() => {
    const timer = setInterval(handleNext, 7000);
    return () => clearInterval(timer);
  }, [activeIndex, handleNext]);

  const activeItem = HERO_ITEMS[activeIndex]!;

  return (
    <section dir="rtl" className={styles["section"]}>
      <HeroBackground activeIndex={activeIndex} items={HERO_ITEMS} />
      <HeroCharacter activeIndex={activeIndex} items={HERO_ITEMS} />

      <div className={styles["contentContainer"]}>
        <HeroContent item={activeItem} />
      </div>

      <HeroNavigation
        total={HERO_ITEMS.length}
        activeIndex={activeIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onDotClick={setActiveIndex}
      />

      <GenreBar activeGenre={activeGenre} onGenreChange={setActiveGenre} />
    </section>
  );
}

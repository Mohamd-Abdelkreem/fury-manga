"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Play,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { CatalogHomeData, CatalogCategory } from "@fury/contracts";
import {
  publicHeroItem,
  type PublicHeroItem as HeroItem,
} from "../../model/public-home";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { PublicWorkImage } from "@/features/public-catalog/components/PublicWorkImage";
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
        <PublicWorkImage
          loading="eager"
          retryable={false}
          key={`bg-${item.id}`}
          slug={item.id}
          alt=""
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
        <PublicWorkImage
          loading="eager"
          retryable={false}
          key={`char-${item.id}`}
          slug={item.id}
          alt=""
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
          dir="auto"
          style={{
            fontFamily: "'Cairo Play', 'Cairo', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
            color: "var(--foreground)",
            lineHeight: 1.2,
            textShadow: "0 2px 24px rgba(0,0,0,0.5)",
            letterSpacing: "-0.01em",
            textAlign: "left",
            unicodeBidi: "plaintext",
            marginBottom: "0.75rem",
          }}
        >
          {item.title}
          <br />
          <span style={{ color: "var(--primary)" }}>{item.titleAccent}</span>
        </h1>

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
function HeroActions({ storyId }: { storyId: string }) {
  return (
    <div className={styles["buttonsRow"]}>
      <Link
        href={`/story/${storyId}`}
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
        تفاصيل العمل
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
        <button
          aria-label="العمل المميز السابق"
          onClick={onPrev}
          className={styles["navArrow"]}
        >
          <ChevronRight style={{ width: 22, height: 22 }} />
        </button>
        <button
          aria-label="العمل المميز التالي"
          onClick={onNext}
          className={styles["navArrow"]}
        >
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
            aria-label={`عرض العمل المميز ${idx + 1}`}
            aria-pressed={activeIndex === idx}
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
function GenreBar({ categories }: { categories: readonly CatalogCategory[] }) {
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollGenres = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: reducedMotion ? "instant" : "smooth",
    });
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
          {categories.map((g) => (
            <Link
              key={g.slug}
              href={`/discover?category=${g.slug}`}
              className={styles["genreBtn"]}
              onMouseEnter={(event) => {
                const element = event.currentTarget;
                element.style.color = "#ffffff";
                element.style.background = "rgba(255,255,255,0.04)";
                const line = element.querySelector<HTMLElement>(
                  `.${styles["genreLine"]}`,
                );
                if (line !== null) {
                  line.style.opacity = "1";
                  line.style.transform = "scaleX(1)";
                }
              }}
              onMouseLeave={(event) => {
                const element = event.currentTarget;
                element.style.color = "rgba(255,255,255,0.5)";
                element.style.background = "transparent";
                const line = element.querySelector<HTMLElement>(
                  `.${styles["genreLine"]}`,
                );
                if (line !== null) {
                  line.style.opacity = "0";
                  line.style.transform = "scaleX(0)";
                }
              }}
              style={{
                background: "transparent",
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {g.displayName}
              <span
                className={styles["genreLine"]}
                style={{ opacity: 0, transform: "scaleX(0)" }}
              />
            </Link>
          ))}
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
export function HeroSection({
  featured,
  categories,
}: Readonly<{
  featured: CatalogHomeData["featured"];
  categories: CatalogHomeData["categoryShortcuts"];
}>) {
  const HERO_ITEMS = featured.map(publicHeroItem);
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_ITEMS.length);
  }, [HERO_ITEMS.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + HERO_ITEMS.length) % HERO_ITEMS.length,
    );
  }, [HERO_ITEMS.length]);

  // Auto-rotate every 7 seconds, restarts whenever activeIndex changes (e.g. manual navigation)
  useEffect(() => {
    if (reducedMotion || paused || HERO_ITEMS.length < 2) return;
    const timer = setInterval(handleNext, 7000);
    return () => clearInterval(timer);
  }, [activeIndex, handleNext, reducedMotion, paused, HERO_ITEMS.length]);

  const safeIndex = activeIndex % Math.max(1, HERO_ITEMS.length);
  const activeItem = HERO_ITEMS[safeIndex];
  if (activeItem === undefined)
    return categories.length === 0 ? null : (
      <section
        aria-label="تصنيفات الأعمال"
        style={{ position: "relative", height: 52 }}
      >
        <GenreBar categories={categories} />
      </section>
    );

  return (
    <section
      dir="rtl"
      className={styles["section"]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <HeroBackground activeIndex={safeIndex} items={HERO_ITEMS} />
      <HeroCharacter activeIndex={safeIndex} items={HERO_ITEMS} />

      <div className={styles["contentContainer"]}>
        <HeroContent item={activeItem} />
      </div>

      <HeroNavigation
        total={HERO_ITEMS.length}
        activeIndex={safeIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onDotClick={setActiveIndex}
      />

      <GenreBar categories={categories} />
    </section>
  );
}

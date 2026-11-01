"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Sparkles, ChevronLeft } from "lucide-react";
import { MangaCard } from "@/components/ui/MangaCard/MangaCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel/Carousel";
import type { CatalogHomeData } from "@fury/contracts";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import styles from "./SuggestionsSection.module.css";

export function SuggestionsSection({
  suggestions,
}: Readonly<{ suggestions: CatalogHomeData["suggestions"] }>) {
  const [selected, setActive] = useState(suggestions[0]?.category.slug ?? "");
  const reducedMotion = useReducedMotion();
  const tab =
    suggestions.find((item) => item.category.slug === selected) ??
    suggestions[0];
  if (tab === undefined) return null;
  const active = tab.category.slug;

  return (
    <section dir="rtl" className={styles["section"]}>
      <div className={styles["container"]}>
        {/* Header */}
        <div className={styles["header"]}>
          <div className={styles["headerLeft"]}>
            <div
              className={styles["accentBar"]}
              style={{ background: "#ffffff" }}
            />
            <Sparkles style={{ width: 16, height: 16, color: "#ffffff" }} />
            <h2
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "#ffffff",
              }}
            >
              المقترحات
            </h2>

            {/* Category tabs */}
            <div
              className={styles["tabs"]}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              {suggestions.map(({ category }) => (
                <button
                  key={category.slug}
                  onClick={() => setActive(category.slug)}
                  aria-pressed={active === category.slug}
                  className={styles["tabBtn"]}
                  style={{
                    background:
                      active === category.slug
                        ? "linear-gradient(135deg, var(--primary), var(--primary-hover))"
                        : "transparent",
                    color:
                      active === category.slug
                        ? "var(--foreground)"
                        : "var(--muted-foreground)",
                    boxShadow:
                      active === category.slug
                        ? "0 2px 10px rgba(255, 71, 71, 0.2)"
                        : "none",
                  }}
                >
                  {category.displayName}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Link
              href="/discover"
              className={styles["viewAll"]}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--primary)";
              }}
            >
              عرض الكل
              <ChevronLeft style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className={styles["carouselWrapper"]}>
          <Carousel
            key={active}
            opts={{
              align: "start",
              loop: true,
              direction: "rtl",
              duration: reducedMotion ? 0 : 60,
            }}
          >
            <CarouselContent style={{ marginLeft: "-1rem" }}>
              {tab.works.map((work) => (
                <CarouselItem
                  key={work.slug}
                  className={styles["carouselItem"]}
                  style={{ paddingLeft: "1rem" }}
                >
                  <MangaCard work={work} stretch />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className={styles["arrowsWrapper"]}>
              <CarouselPrevious
                aria-label="المقترحات السابقة"
                className={`${styles["arrowBtn"]} ${styles["arrowLeft"]}`}
              />
              <CarouselNext
                aria-label="المقترحات التالية"
                className={`${styles["arrowBtn"]} ${styles["arrowRight"]}`}
              />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

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
import {
  SUGGESTIONS_DATA,
  SUGGESTION_CATEGORIES,
  type SuggestionCategory,
} from "@/features/home/data/suggestionsData";
import styles from "./SuggestionsSection.module.css";

export function SuggestionsSection() {
  const [active, setActive] = useState<SuggestionCategory>("أكشن");

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
              {SUGGESTION_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={styles["tabBtn"]}
                  style={{
                    background:
                      active === cat
                        ? "linear-gradient(135deg, var(--primary), var(--primary-hover))"
                        : "transparent",
                    color:
                      active === cat
                        ? "var(--foreground)"
                        : "var(--muted-foreground)",
                    boxShadow:
                      active === cat
                        ? "0 2px 10px rgba(255, 71, 71, 0.2)"
                        : "none",
                  }}
                >
                  {cat}
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
              duration: 60,
            }}
          >
            <CarouselContent style={{ marginLeft: "-1rem" }}>
              {SUGGESTIONS_DATA[active].map((manga) => (
                <CarouselItem
                  key={manga.id}
                  className={styles["carouselItem"]}
                  style={{ paddingLeft: "1rem" }}
                >
                  <MangaCard {...manga} stretch />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className={styles["arrowsWrapper"]}>
              <CarouselPrevious
                className={`${styles["arrowBtn"]} ${styles["arrowLeft"]}`}
              />
              <CarouselNext
                className={`${styles["arrowBtn"]} ${styles["arrowRight"]}`}
              />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

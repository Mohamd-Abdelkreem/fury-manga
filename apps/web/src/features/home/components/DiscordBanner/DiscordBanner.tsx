"use client";

import React from "react";
import { Users, ArrowLeft } from "lucide-react";
import styles from "./DiscordBanner.module.css";

export function DiscordBanner() {
  return (
    <div dir="rtl" className={styles["banner"]}>
      {/* Background gradient */}
      <div
        className={styles["bgGradient"]}
        style={{
          background:
            "linear-gradient(135deg, #141736 0%, #202b6d 35%, #5865F2 75%, #404eed 100%)",
        }}
      />
      {/* Pattern overlay */}
      <div
        className={styles["patternOverlay"]}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 35%)",
        }}
      />
      {/* Decorative circles */}
      <div
        className={styles["circleTopLeft"]}
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "2px solid rgba(255,255,255,0.2)",
        }}
      />
      <div
        className={styles["circleBottomRight"]}
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "2px solid rgba(255,255,255,0.2)",
        }}
      />

      {/* Content */}
      <div className={styles["content"]}>
        <div className={styles["leftGroup"]}>
          {/* Discord icon */}
          <div
            className={styles["iconBox"]}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
            }}
          >
            <svg
              viewBox="0 0 127.14 96.36"
              style={{ width: "30px", height: "30px", fill: "#ffffff" }}
            >
              <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77,77,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.8,6.83,77,77,0,0,0,49.5,0,105.15,105.15,0,0,0,19.06,8.07C-3.41,41.44-.88,74,10.26,88.29a108.2,108.2,0,0,0,32.5,16.48,82.46,82.46,0,0,0,6.83-11.11,68.43,68.43,0,0,1-10.75-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,71.24,0c.86.69,1.75,1.37,2.66,2a68.43,68.43,0,0,1-10.75,5.18,82.46,82.46,0,0,0,6.83,11.11,108.2,108.2,0,0,0,32.5-16.48C128.52,74,126,41.44,107.7,8.07ZM42.45,71.69c-6.43,0-11.75-5.91-11.75-13.14S36,45.41,42.45,45.41s11.75,5.91,11.75,13.14S48.88,71.69,42.45,71.69Zm42.24,0c-6.43,0-11.75-5.91-11.75-13.14S78.22,45.41,84.69,45.41,96.44,51.32,96.44,58.55,91.12,71.69,84.69,71.69Z" />
            </svg>
          </div>
          <div>
            <h3
              style={{
                fontFamily: "'Cairo Play', 'Cairo', sans-serif",
                fontWeight: 900,
                fontSize: "1.25rem",
                color: "#ffffff",
                lineHeight: 1.3,
                letterSpacing: "-0.3px",
              }}
            >
              انضم إلى مجتمعنا على ديسكورد
            </h3>
            <p
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.6,
                marginTop: "3px",
              }}
            >
              +5000 عضو نشط · ناقش المانجا والأنمي مع أصدقائك
            </p>
          </div>
        </div>

        <div className={styles["rightGroup"]}>
          {/* Online status */}
          <div className={styles["onlineStatus"]}>
            <div
              className={`${styles["onlineDot"]} animate-pulse`}
              style={{ background: "#22c55e" }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "#e2e8f0",
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 600,
              }}
            >
              382 متصل الآن
            </span>
          </div>

          {/* Join button */}
          <button
            className={styles["joinBtn"]}
            style={{
              background: "#ffffff",
              color: "#5865F2",
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 800,
              fontSize: "0.9rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "#5865F2";
              el.style.color = "#ffffff";
              el.style.borderColor = "#5865F2";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 8px 24px rgba(88, 101, 242, 0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "#ffffff";
              el.style.color = "#5865F2";
              el.style.borderColor = "rgba(255, 255, 255, 0.5)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
            }}
          >
            <Users style={{ width: 15, height: 15 }} />
            انضم الآن
            <ArrowLeft style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

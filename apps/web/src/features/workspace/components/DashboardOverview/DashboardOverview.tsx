"use client";

import {
  ArrowUpLeft,
  BookOpen,
  Bookmark,
  Gift,
  Settings,
  Sparkles,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import {
  AVATAR_FRAMES,
  COMMENT_DECORATIONS,
} from "@/features/account/data/gifts";
import { useSession } from "@/features/auth/hooks/auth.hooks";
import {
  DASHBOARD_FIXTURE,
  type DashboardFixture,
} from "@/features/workspace/data/dashboardData";

import styles from "./DashboardOverview.module.css";

type DashboardOverviewProps = Readonly<{
  summary?: DashboardFixture;
  viewState?: "loading" | "populated" | "error";
}>;

const kindLabels = {
  illustrated: "عمل مصوّر",
  text: "عمل نصي",
} as const;

export function DashboardOverview({
  summary = DASHBOARD_FIXTURE,
  viewState = "populated",
}: DashboardOverviewProps) {
  const user = useSession().data?.user ?? null;
  const [renderState, setRenderState] = useState(viewState);

  if (user === null) return null;

  if (renderState === "loading") {
    return (
      <main className="workspace-main" id="main-content">
        <FeatureState
          kind="loading"
          title="جارٍ تجهيز لوحة حسابك"
          message="نرتب ملخص القراءة والمكتبة والهدايا في مساحة واحدة."
        />
      </main>
    );
  }

  if (renderState === "error") {
    return (
      <main className="workspace-main" id="main-content">
        <FeatureState
          kind="error"
          title="تعذّر عرض ملخص الحساب"
          message="بيانات جلستك ما زالت آمنة. أعد المحاولة لعرض ملخصات الواجهة."
          actionLabel="إعادة المحاولة"
          onRetry={() => {
            setRenderState("populated");
          }}
        />
      </main>
    );
  }

  const firstName = user.fullName.trim().split(/\s+/u)[0] ?? user.fullName;
  const activeFrame = AVATAR_FRAMES.find(
    (frame) => frame.id === summary.activeFrameId,
  );
  const activeDecoration = COMMENT_DECORATIONS.find(
    (decoration) => decoration.id === summary.activeDecorationId,
  );

  return (
    <main
      className={`workspace-main ${styles["main"] ?? ""}`}
      id="main-content"
    >
      <header className={styles["hero"]}>
        <div className={styles["identity"]}>
          <span className={styles["avatar"]} aria-hidden="true">
            {user.fullName.slice(0, 1).toLocaleUpperCase("ar")}
          </span>
          <div>
            <p className="eyebrow">لوحة حساب Fury</p>
            <h1>مرحبًا، {firstName}</h1>
            <p className={styles["email"]} dir="ltr">
              {user.email}
            </p>
          </div>
        </div>
        <span className="status-badge">
          <i aria-hidden="true" />
          {user.status === "ACTIVE" ? "الحساب نشط" : "الحساب غير متاح"}
        </span>
      </header>

      <section className={styles["points"]} aria-labelledby="points-title">
        <div>
          <span className={styles["sectionIcon"]} aria-hidden="true">
            <Sparkles />
          </span>
          <div>
            <p className="eyebrow">عداد الإعلانات</p>
            <h2 id="points-title">
              {summary.points.toLocaleString("ar-EG")} نقطة
            </h2>
          </div>
        </div>
        <p>
          قيمة تجريبية لهذه الواجهة لعدّ الإعلانات التي شاهدتها فقط؛ ليست مالًا
          ولا مكافآت، ولم تُحمّل من الخادم.
        </p>
      </section>

      <div className={styles["grid"]}>
        <section className={styles["panel"]} aria-labelledby="continue-title">
          <div className={styles["panelHeading"]}>
            <div>
              <span className={styles["marker"]} aria-hidden="true" />
              <h2 id="continue-title">متابعة القراءة</h2>
            </div>
            <BookOpen aria-hidden="true" />
          </div>
          {summary.continueReading.length === 0 ? (
            <div className={styles["empty"]}>
              <p>لا يوجد تقدم قراءة محفوظ في هذه الواجهة بعد.</p>
              <Link href="/discover">استكشف الأعمال المصوّرة</Link>
            </div>
          ) : (
            summary.continueReading.map((readingEntry) => (
              <article className={styles["continueCard"]} key={readingEntry.id}>
                <div className={styles["cover"]}>
                  <Image
                    src={readingEntry.cover}
                    alt={`غلاف ${readingEntry.title}`}
                    fill
                    sizes="96px"
                  />
                </div>
                <div className={styles["continueBody"]}>
                  <div>
                    <h3 dir="auto">{readingEntry.title}</h3>
                    <p>{readingEntry.chapter}</p>
                  </div>
                  <div
                    className={styles["progress"]}
                    role="progressbar"
                    aria-label={`تقدم قراءة ${readingEntry.title}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={readingEntry.progress}
                  >
                    <span
                      style={{ width: `${String(readingEntry.progress)}%` }}
                    />
                  </div>
                  <small>
                    تقدم تقريبي {readingEntry.progress.toLocaleString("ar-EG")}٪
                  </small>
                  <Link
                    className="button button--small"
                    href={readingEntry.href as Route}
                  >
                    أكمل القراءة
                    <ArrowUpLeft aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>

        <section className={styles["panel"]} aria-labelledby="library-title">
          <div className={styles["panelHeading"]}>
            <div>
              <span className={styles["marker"]} aria-hidden="true" />
              <h2 id="library-title">ملخص المكتبة</h2>
            </div>
            <span className={styles["count"]}>
              <Bookmark aria-hidden="true" />
              {summary.bookmarkCount.toLocaleString("ar-EG")}
            </span>
          </div>
          {summary.savedWorks.length === 0 ? (
            <div className={styles["empty"]}>
              <p>مكتبتك فارغة. احفظ عملًا لتراه هنا.</p>
              <Link href="/discover">العثور على عمل</Link>
            </div>
          ) : (
            <div className={styles["savedWorks"]}>
              {summary.savedWorks.map((work) => (
                <article key={work.id}>
                  <div className={styles["miniCover"]}>
                    <Image
                      src={work.cover}
                      alt={`غلاف ${work.title}`}
                      fill
                      sizes="54px"
                    />
                  </div>
                  <div>
                    <h3 dir="auto">{work.title}</h3>
                    <p>{kindLabels[work.kind]}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
          <Link className={styles["textAction"]} href="/library">
            عرض المكتبة كاملة
            <ArrowUpLeft aria-hidden="true" />
          </Link>
        </section>

        <section className={styles["panel"]} aria-labelledby="gifts-title">
          <div className={styles["panelHeading"]}>
            <div>
              <span className={styles["marker"]} aria-hidden="true" />
              <h2 id="gifts-title">الهدايا والمظهر</h2>
            </div>
            <Gift aria-hidden="true" />
          </div>
          {activeFrame === undefined && activeDecoration === undefined ? (
            <div className={styles["empty"]}>
              <p>لا توجد هدايا مملوكة أو اختيارات نشطة بعد.</p>
            </div>
          ) : (
            <dl className={styles["giftList"]}>
              <div>
                <dt>إطارات الصورة المملوكة</dt>
                <dd>
                  {AVATAR_FRAMES.filter(
                    (frame) => frame.availability === "granted",
                  ).length.toLocaleString("ar-EG")}
                </dd>
              </div>
              <div>
                <dt>زخارف التعليقات المملوكة</dt>
                <dd>
                  {COMMENT_DECORATIONS.filter(
                    (decoration) => decoration.availability === "granted",
                  ).length.toLocaleString("ar-EG")}
                </dd>
              </div>
              <div>
                <dt>الإطار النشط</dt>
                <dd>{activeFrame?.name ?? "بلا إطار"}</dd>
              </div>
              <div>
                <dt>زخرفة التعليق النشطة</dt>
                <dd>{activeDecoration?.name ?? "التصميم الافتراضي"}</dd>
              </div>
            </dl>
          )}
          <Link className={styles["textAction"]} href="/settings#avatar-frame">
            إدارة الهدايا
            <ArrowUpLeft aria-hidden="true" />
          </Link>
        </section>
      </div>

      <nav
        className={styles["quickActions"]}
        aria-label="إجراءات الحساب السريعة"
      >
        <Link href="/settings">
          <Settings aria-hidden="true" />
          فتح الإعدادات
        </Link>
        <Link href="/library">
          <Bookmark aria-hidden="true" />
          فتح المكتبة
        </Link>
        <Link href="/story/trait-hoarder/chapter/43">
          <BookOpen aria-hidden="true" />
          متابعة القراءة
        </Link>
      </nav>
    </main>
  );
}

"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { FeatureState } from "@/components/ui/FeatureState/FeatureState";
import type {
  InlineText,
  TextBlock,
  TextChapter,
  TextWork,
} from "../../data/textStories";
import { TextDiscussion } from "../TextDiscussion/TextDiscussion";
import styles from "./TextChapterReader.module.css";

export const READER_PREFERENCES_KEY = "fury:text-reader:v1";
export const DEFAULT_READER_PREFERENCES = {
  fontSize: 19,
  lineHeight: 2,
} as const;

type ReaderPreferences = Readonly<{
  fontSize: number;
  lineHeight: number;
}>;

export const readReaderPreferences = (
  value: string | null,
): ReaderPreferences => {
  if (value === null) return DEFAULT_READER_PREFERENCES;
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "fontSize" in parsed &&
      "lineHeight" in parsed &&
      typeof parsed.fontSize === "number" &&
      typeof parsed.lineHeight === "number" &&
      parsed.fontSize >= 16 &&
      parsed.fontSize <= 26 &&
      parsed.lineHeight >= 1.6 &&
      parsed.lineHeight <= 2.4
    ) {
      return { fontSize: parsed.fontSize, lineHeight: parsed.lineHeight };
    }
  } catch {
    return DEFAULT_READER_PREFERENCES;
  }
  return DEFAULT_READER_PREFERENCES;
};

export const hasReachedCompletionThreshold = (progress: number): boolean =>
  progress >= 75;

const renderInline = (item: InlineText, index: number): ReactNode => {
  let content: ReactNode = item.text;
  if (item.bold === true) content = <strong>{content}</strong>;
  if (item.italic === true) content = <em>{content}</em>;
  if (item.href !== undefined) {
    content = <Link href={item.href as Route}>{content}</Link>;
  }
  return (
    <span key={`${String(index)}-${item.text.slice(0, 8)}`}>{content}</span>
  );
};

function RichTextBlock({ block }: Readonly<{ block: TextBlock }>) {
  if (block.type === "heading") {
    return block.level === 2 ? <h2>{block.text}</h2> : <h3>{block.text}</h3>;
  }
  if (block.type === "quote") return <blockquote>{block.text}</blockquote>;
  if (block.type === "list") {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{block.content.map(renderInline)}</p>;
}

type TextChapterReaderProps = Readonly<{
  work: TextWork;
  chapter: TextChapter;
  viewState?: "loading" | "populated" | "error" | "unavailable";
}>;

export function TextChapterReader({
  work,
  chapter,
  viewState = "populated",
}: TextChapterReaderProps) {
  const [renderState, setRenderState] = useState(viewState);
  const [preferences, setPreferences] = useState<ReaderPreferences>(
    DEFAULT_READER_PREFERENCES,
  );
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const chapterIndex = work.chapters.findIndex(
    (item) => item.id === chapter.id,
  );
  const previousChapter =
    chapterIndex > 0 ? work.chapters[chapterIndex - 1] : undefined;
  const nextChapter =
    chapterIndex >= 0 && chapterIndex < work.chapters.length - 1
      ? work.chapters[chapterIndex + 1]
      : undefined;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPreferences(
        readReaderPreferences(
          window.localStorage.getItem(READER_PREFERENCES_KEY),
        ),
      );
      setPreferencesReady(true);
    }, 0);
    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    window.localStorage.setItem(
      READER_PREFERENCES_KEY,
      JSON.stringify(preferences),
    );
  }, [preferences, preferencesReady]);

  useEffect(() => {
    const updateProgress = (): void => {
      const root = document.documentElement;
      const scrollable = Math.max(root.scrollHeight - window.innerHeight, 1);
      setProgress(
        Math.min(
          100,
          Math.max(0, Math.round((window.scrollY / scrollable) * 100)),
        ),
      );
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  if (renderState === "loading") {
    return (
      <main className={styles["stateMain"]}>
        <FeatureState
          kind="loading"
          title="جارٍ تجهيز الفصل"
          message="ننسق النص بإعدادات القراءة المحفوظة لديك."
        />
      </main>
    );
  }

  if (renderState === "error") {
    return (
      <main className={styles["stateMain"]}>
        <FeatureState
          kind="error"
          title="تعذّر عرض الفصل"
          message="لم يكتمل عرض هذه الحالة. أعد المحاولة لعرض محتوى fixture المحلي."
          onRetry={() => {
            setRenderState("populated");
          }}
          actionLabel="إعادة المحاولة"
        />
      </main>
    );
  }

  if (renderState === "unavailable" || work.status === "archived") {
    return (
      <main className={styles["stateMain"]}>
        <FeatureState
          kind="unavailable"
          title="الفصل غير متاح حاليًا"
          message="يمكنك العودة إلى تفاصيل العمل ومراجعة حالته."
          actionHref={`/story/${work.id}`}
          actionLabel="العودة إلى العمل"
        />
      </main>
    );
  }

  return (
    <main className={styles["main"]} id="main-content">
      <nav className={styles["breadcrumb"]} aria-label="مسار القراءة">
        <Link href="/">الرئيسية</Link>
        <span aria-hidden="true">/</span>
        <Link href="/stories">الأعمال النصية</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/story/${work.id}`}>{work.title}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">الفصل {chapter.number}</span>
      </nav>

      <header className={styles["header"]}>
        <p className="eyebrow">{work.title}</p>
        <h1>
          الفصل {chapter.number}: {chapter.title}
        </h1>
        <p>بقلم {work.author}</p>
      </header>

      <div className={styles["progressWrap"]}>
        <label htmlFor="chapter-progress">تقدم القراءة: {progress}%</label>
        <progress id="chapter-progress" max="100" value={progress}>
          {progress}%
        </progress>
        <small>
          عند بلوغ 75% يظهر إكمال محلي لهذه الجلسة، دون حفظ أو نقاط على الخادم.
        </small>
      </div>

      <section className={styles["controls"]} aria-label="إعدادات قارئ النص">
        <div className={styles["settingGroup"]}>
          <span>حجم الخط</span>
          <button
            type="button"
            aria-label="تصغير حجم الخط"
            disabled={preferences.fontSize <= 16}
            onClick={() => {
              setPreferences((current) => ({
                ...current,
                fontSize: Math.max(16, current.fontSize - 1),
              }));
            }}
          >
            <Minus aria-hidden="true" />
          </button>
          <bdi>{preferences.fontSize}px</bdi>
          <button
            type="button"
            aria-label="تكبير حجم الخط"
            disabled={preferences.fontSize >= 26}
            onClick={() => {
              setPreferences((current) => ({
                ...current,
                fontSize: Math.min(26, current.fontSize + 1),
              }));
            }}
          >
            <Plus aria-hidden="true" />
          </button>
        </div>
        <label className={styles["lineHeight"]}>
          تباعد السطور
          <select
            value={preferences.lineHeight}
            onChange={(event) => {
              setPreferences((current) => ({
                ...current,
                lineHeight: Number(event.target.value),
              }));
            }}
          >
            <option value="1.7">مريح</option>
            <option value="2">واسع</option>
            <option value="2.3">أوسع</option>
          </select>
        </label>
        <button
          type="button"
          className={styles["reset"]}
          onClick={() => {
            setPreferences(DEFAULT_READER_PREFERENCES);
          }}
        >
          <RotateCcw aria-hidden="true" />
          الإعدادات الافتراضية
        </button>
      </section>

      <section className={styles["chapterNav"]} aria-label="التنقل بين الفصول">
        {previousChapter === undefined ? (
          <span aria-disabled="true">
            <ArrowRight aria-hidden="true" /> السابق
          </span>
        ) : (
          <Link href={`/story/${work.id}/chapter/${previousChapter.id}`}>
            <ArrowRight aria-hidden="true" /> السابق: {previousChapter.number}
          </Link>
        )}
        <label>
          اختر الفصل
          <select
            value={chapter.id}
            onChange={(event) => {
              window.location.assign(
                `/story/${work.id}/chapter/${event.target.value}`,
              );
            }}
          >
            {work.chapters.map((item) => (
              <option value={item.id} key={item.id}>
                الفصل {item.number}: {item.title}
              </option>
            ))}
          </select>
        </label>
        {nextChapter === undefined ? (
          <span aria-disabled="true">
            التالي <ArrowLeft aria-hidden="true" />
          </span>
        ) : (
          <Link href={`/story/${work.id}/chapter/${nextChapter.id}`}>
            التالي: {nextChapter.number} <ArrowLeft aria-hidden="true" />
          </Link>
        )}
      </section>

      {chapter.content.length === 0 ? (
        <FeatureState
          kind="empty"
          title="هذا الفصل بلا محتوى"
          message="لا يوجد نص منشور داخل هذا الفصل في fixture الحالي."
          actionHref={`/story/${work.id}`}
          actionLabel="العودة إلى العمل"
        />
      ) : (
        <article
          className={styles["article"]}
          style={{
            fontSize: `${String(preferences.fontSize)}px`,
            lineHeight: preferences.lineHeight,
          }}
        >
          {chapter.content.map((block, index) => (
            <RichTextBlock
              key={`${block.type}-${String(index)}`}
              block={block}
            />
          ))}
          <div className={styles["endMarker"]}>
            <BookOpen aria-hidden="true" />
            نهاية الفصل
          </div>
        </article>
      )}

      <p className={styles["completion"]} role="status">
        {hasReachedCompletionThreshold(progress)
          ? "بلغت 75% — اكتمل هذا الفصل محليًا في الجلسة الحالية فقط."
          : "سيظهر تنبيه الإكمال المحلي بعد بلوغ 75% من الصفحة."}
      </p>

      <div className={styles["backLink"]}>
        <Link className="button button--ghost" href={`/story/${work.id}`}>
          العودة إلى تفاصيل العمل
        </Link>
      </div>

      <TextDiscussion comments={work.comments} heading="تعليقات الفصل" />
    </main>
  );
}

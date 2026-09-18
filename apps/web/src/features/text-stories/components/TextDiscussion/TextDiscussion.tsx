"use client";

import { Send } from "lucide-react";
import { useId, useState } from "react";

import type { FixtureComment } from "../../data/textStories";
import styles from "./TextDiscussion.module.css";

type TextDiscussionProps = Readonly<{
  comments: readonly FixtureComment[];
  heading?: string;
}>;

export function TextDiscussion({
  comments,
  heading = "التعليقات",
}: TextDiscussionProps) {
  const fieldId = useId();
  const [draft, setDraft] = useState("");
  const [items, setItems] = useState<readonly FixtureComment[]>(comments);
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <section className={styles["section"]} aria-labelledby={`${fieldId}-title`}>
      <header>
        <span aria-hidden="true" />
        <h2 id={`${fieldId}-title`}>{heading}</h2>
      </header>
      <form
        className={styles["form"]}
        onSubmit={(event) => {
          event.preventDefault();
          const body = draft.trim();
          if (body.length === 0) {
            setFeedback("اكتب تعليقًا قبل الإرسال.");
            return;
          }
          setItems((current) => [
            {
              id: `local-${String(current.length + 1)}`,
              author: "قارئ Fury",
              date: "الآن — محلي",
              body,
            },
            ...current,
          ]);
          setDraft("");
          setFeedback("أُضيف تعليقك إلى هذه الجلسة فقط.");
        }}
      >
        <label htmlFor={fieldId}>أضف تعليقًا</label>
        <textarea
          id={fieldId}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
          rows={3}
          placeholder="شارك انطباعك عن العمل"
        />
        <div className={styles["formFooter"]}>
          <small>التعليقات المضافة هنا لا تُحفظ على الخادم.</small>
          <button className="button button--small" type="submit">
            <Send aria-hidden="true" />
            إضافة محلية
          </button>
        </div>
      </form>
      {feedback === null ? null : (
        <p className={styles["feedback"]} role="status">
          {feedback}
        </p>
      )}
      {items.length === 0 ? (
        <p className={styles["empty"]}>لا توجد تعليقات على هذا المحتوى بعد.</p>
      ) : (
        <ol className={styles["comments"]}>
          {items.map((comment) => (
            <li key={comment.id}>
              <div className={styles["avatar"]} aria-hidden="true">
                {comment.author.slice(0, 1)}
              </div>
              <div>
                <p className={styles["meta"]}>
                  <strong>{comment.author}</strong>
                  <span>{comment.date}</span>
                </p>
                <p className={styles["body"]}>{comment.body}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

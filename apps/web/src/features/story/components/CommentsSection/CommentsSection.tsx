"use client";

import { MessageSquare, Send, ThumbsUp } from "lucide-react";
import { useState } from "react";

import styles from "./CommentsSection.module.css";

export type StoryComment = Readonly<{
  id: number | string;
  user: string;
  date: string;
  content: string;
  avatar?: string;
  likes?: number;
  repliesCount?: number;
}>;

type RenderedComment = Required<StoryComment>;

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format";

const DEFAULT_COMMENTS: readonly StoryComment[] = [
  {
    id: 1,
    user: "محمد أحمد",
    date: "منذ ساعتين",
    content:
      "القصة أسطورية والترجمة رائعة كالعادة. شكرًا لكم على المجهود، وبانتظار الفصول القادمة.",
    likes: 12,
    repliesCount: 3,
  },
  {
    id: 2,
    user: "خالد الحربي",
    date: "منذ 5 ساعات",
    content:
      "تطور الأحداث غير متوقع، وأعجبني الإيقاع وطريقة بناء العالم داخل العمل.",
    likes: 8,
    repliesCount: 0,
  },
  {
    id: 3,
    user: "سارة العتيبي",
    date: "أمس",
    content: "من أفضل الأعمال التي أتابعها حاليًا، وبانتظار الفصل الجديد.",
    likes: 15,
    repliesCount: 1,
  },
];

const normalizeComment = (comment: StoryComment): RenderedComment => ({
  ...comment,
  avatar: comment.avatar ?? DEFAULT_AVATAR,
  likes: comment.likes ?? 0,
  repliesCount: comment.repliesCount ?? 0,
});

type CommentsSectionProps = Readonly<{
  initialComments?: readonly StoryComment[];
}>;

export function CommentsSection({
  initialComments = DEFAULT_COMMENTS,
}: CommentsSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<readonly RenderedComment[]>(() =>
    initialComments.map(normalizeComment),
  );

  const submitComment = (event: React.FormEvent): void => {
    event.preventDefault();
    const content = commentText.trim();
    if (content.length === 0) return;

    const newComment = normalizeComment({
      id: Date.now(),
      user: "زائر من Fury",
      date: "الآن",
      content,
    });
    setComments((current) => [newComment, ...current]);
    setCommentText("");
  };

  return (
    <section className={styles["section"]}>
      <div className={styles["header"]}>
        <div className={styles["accentBar"]} />
        <h2 className={styles["title"]}>التعليقات</h2>
      </div>

      <form onSubmit={submitComment} className={styles["commentForm"]}>
        <textarea
          value={commentText}
          onChange={(event) => {
            setCommentText(event.target.value);
          }}
          aria-label="اكتب تعليقًا"
          placeholder="اكتب تعليقًا... شاركنا رأيك حول العمل!"
          rows={3}
          className={styles["textarea"]}
        />
        <div className={styles["formFooter"]}>
          <button type="submit" className={styles["submitBtn"]}>
            <Send aria-hidden="true" style={{ width: 14, height: 14 }} />
            <span>إرسال تعليق</span>
          </button>
        </div>
      </form>

      <div className={styles["commentsList"]}>
        {comments.map((comment) => (
          <article key={comment.id} className={styles["commentCard"]}>
            <img src={comment.avatar} alt="" className={styles["avatar"]} />
            <div className={styles["commentContent"]}>
              <div className={styles["commentMeta"]}>
                <span className={styles["userName"]}>{comment.user}</span>
                <span className={styles["commentDate"]}>{comment.date}</span>
              </div>
              <p className={styles["text"]}>{comment.content}</p>
              <div className={styles["actions"]}>
                <button type="button" className={styles["actionBtn"]}>
                  <ThumbsUp
                    aria-hidden="true"
                    style={{ width: 12, height: 12 }}
                  />
                  <span>{comment.likes} إعجاب</span>
                </button>
                <button type="button" className={styles["actionBtn"]}>
                  <MessageSquare
                    aria-hidden="true"
                    style={{ width: 12, height: 12 }}
                  />
                  <span>
                    {comment.repliesCount > 0
                      ? `${String(comment.repliesCount)} ردود`
                      : "رد"}
                  </span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

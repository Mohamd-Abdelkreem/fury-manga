"use client";

import { Flag, Pencil, Send, ThumbsUp, Trash2 } from "lucide-react";
import { useState } from "react";

import { STORY_COMMENTS, type StoryComment } from "../../data/comments";
import styles from "./CommentsSection.module.css";

export type { StoryComment } from "../../data/comments";

type RenderedComment = Required<StoryComment>;

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format";

const normalizeComment = (comment: StoryComment): RenderedComment => ({
  ...comment,
  avatar: comment.avatar ?? DEFAULT_AVATAR,
  likes: comment.likes ?? 0,
  likedByViewer: comment.likedByViewer ?? false,
  isOwn: comment.isOwn ?? false,
  deleted: comment.deleted ?? false,
  reported: comment.reported ?? false,
});

type CommentsSectionProps = Readonly<{
  initialComments?: readonly StoryComment[];
  contextLabel?: string;
}>;

export function CommentsSection({
  initialComments = STORY_COMMENTS,
  contextLabel = "العمل",
}: CommentsSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<readonly RenderedComment[]>(() =>
    initialComments.map(normalizeComment),
  );
  const [editingId, setEditingId] = useState<RenderedComment["id"] | null>(
    null,
  );
  const [editDraft, setEditDraft] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const updateComment = (
    id: RenderedComment["id"],
    update: (comment: RenderedComment) => RenderedComment,
  ) => {
    setComments((current) =>
      current.map((comment) => (comment.id === id ? update(comment) : comment)),
    );
  };

  const submitComment = (event: React.FormEvent): void => {
    event.preventDefault();
    const content = commentText.trim();
    if (content.length === 0) return;
    setComments((current) => [
      normalizeComment({
        id: Date.now(),
        user: "قارئ Fury",
        date: "الآن",
        content,
        isOwn: true,
      }),
      ...current,
    ]);
    setCommentText("");
    setFeedback("تم نشر تعليقك.");
  };

  return (
    <section className={styles["section"]}>
      <div className={styles["header"]}>
        <div className={styles["accentBar"]} />
        <h2 className={styles["title"]}>تعليقات {contextLabel}</h2>
      </div>

      <form onSubmit={submitComment} className={styles["commentForm"]}>
        <textarea
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          aria-label={`اكتب تعليقًا على ${contextLabel}`}
          placeholder={`شاركنا رأيك حول ${contextLabel}…`}
          maxLength={1000}
          rows={3}
          className={styles["textarea"]}
        />
        <div className={styles["formFooter"]}>
          <button type="submit" className={styles["submitBtn"]}>
            <Send aria-hidden="true" />
            إرسال تعليق
          </button>
        </div>
      </form>

      {feedback === null ? null : <p role="status">{feedback}</p>}

      <div className={styles["commentsList"]}>
        {comments.map((comment) => (
          <article key={comment.id} className={styles["commentCard"]}>
            <img src={comment.avatar} alt="" className={styles["avatar"]} />
            <div className={styles["commentContent"]}>
              <div className={styles["commentMeta"]}>
                <span className={styles["userName"]}>{comment.user}</span>
                <span className={styles["commentDate"]}>{comment.date}</span>
              </div>
              {editingId === comment.id ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const content = editDraft.trim();
                    if (content.length === 0) return;
                    updateComment(comment.id, (current) => ({
                      ...current,
                      content,
                    }));
                    setEditingId(null);
                    setFeedback("تم تعديل التعليق.");
                  }}
                >
                  <textarea
                    className={styles["inlineEditor"]}
                    aria-label="تعديل التعليق"
                    value={editDraft}
                    onChange={(event) => setEditDraft(event.target.value)}
                    maxLength={1000}
                  />
                  <button type="submit" className={styles["actionBtn"]}>
                    حفظ التعديل
                  </button>
                </form>
              ) : (
                <p className={styles["text"]}>
                  {comment.deleted
                    ? "تم حذف هذا التعليق بواسطة صاحبه."
                    : comment.content}
                </p>
              )}
              {comment.deleted ? null : (
                <div className={styles["actions"]}>
                  <button
                    type="button"
                    className={styles["actionBtn"]}
                    aria-pressed={comment.likedByViewer}
                    onClick={() =>
                      updateComment(comment.id, (current) => ({
                        ...current,
                        likedByViewer: !current.likedByViewer,
                        likes: current.likes + (current.likedByViewer ? -1 : 1),
                      }))
                    }
                  >
                    <ThumbsUp aria-hidden="true" />
                    {comment.likedByViewer ? "إلغاء الإعجاب" : "إعجاب"} (
                    {comment.likes})
                  </button>
                  {comment.isOwn ? (
                    <>
                      <button
                        type="button"
                        className={styles["actionBtn"]}
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditDraft(comment.content);
                        }}
                      >
                        <Pencil aria-hidden="true" /> تعديل
                      </button>
                      <button
                        type="button"
                        className={styles["actionBtn"]}
                        onClick={() =>
                          updateComment(comment.id, (current) => ({
                            ...current,
                            deleted: true,
                          }))
                        }
                      >
                        <Trash2 aria-hidden="true" /> حذف
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={styles["actionBtn"]}
                      disabled={comment.reported}
                      onClick={() => {
                        updateComment(comment.id, (current) => ({
                          ...current,
                          reported: true,
                        }));
                        setFeedback("تم تسجيل البلاغ للمراجعة.");
                      }}
                    >
                      <Flag aria-hidden="true" />
                      {comment.reported ? "تم الإبلاغ" : "إبلاغ"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

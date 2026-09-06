"use client";

import React, { useState } from "react";
import { Send, ThumbsUp, MessageSquare } from "lucide-react";
import styles from "./CommentsSection.module.css";

interface Comment {
  id: number;
  user: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
  repliesCount: number;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    user: "محمد أحمد",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format",
    date: "منذ ساعتين",
    content:
      "القصة أسطورية والترجمة رهيبة كالعادة! شكراً لكم على المجهود وبانتظار الفصول القادمة بفارغ الصبر.",
    likes: 12,
    repliesCount: 3,
  },
  {
    id: 2,
    user: "خالد الحربي",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&auto=format",
    date: "منذ 5 ساعات",
    content:
      "البطل ذكي وتصرفاته غير متوقعة بالمرة، أعجبتني قدرة تبديل السمات وتنوع العوالم بالعمل.",
    likes: 8,
    repliesCount: 0,
  },
  {
    id: 3,
    user: "سارة العتيبي",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format",
    date: "أمس",
    content:
      "من أفضل المانهوا التي أتابعها حالياً. الرسم 10/10 والإنتاج فخم جداً.",
    likes: 15,
    repliesCount: 1,
  },
];

export function CommentsSection() {
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<Comment[]>(MOCK_COMMENTS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      user: "زائر من Fury",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format",
      date: "الآن",
      content: commentText,
      likes: 0,
      repliesCount: 0,
    };

    setCommentsList([newComment, ...commentsList]);
    setCommentText("");
  };

  return (
    <section className={styles["section"]}>
      <div className={styles["header"]}>
        <div className={styles["accentBar"]} />
        <h2 className={styles["title"]}>التعليقات</h2>
      </div>

      {/* Write Comment Form */}
      <form onSubmit={handleSubmit} className={styles["commentForm"]}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="اكتب تعليقاً... شاركنا رأيك حول العمل!"
          rows={3}
          className={styles["textarea"]}
        />
        <div className={styles["formFooter"]}>
          <button type="submit" className={styles["submitBtn"]}>
            <Send style={{ width: 14, height: 14 }} />
            <span>إرسال تعليق</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className={styles["commentsList"]}>
        {commentsList.map((comment) => (
          <div key={comment.id} className={styles["commentCard"]}>
            <img
              src={comment.avatar}
              alt={comment.user}
              className={styles["avatar"]}
            />
            <div className={styles["commentContent"]}>
              <div className={styles["commentMeta"]}>
                <span className={styles["userName"]}>{comment.user}</span>
                <span className={styles["commentDate"]}>{comment.date}</span>
              </div>
              <p className={styles["text"]}>{comment.content}</p>
              <div className={styles["actions"]}>
                <button className={styles["actionBtn"]}>
                  <ThumbsUp style={{ width: 12, height: 12 }} />
                  <span>{comment.likes} إعجاب</span>
                </button>
                <button className={styles["actionBtn"]}>
                  <MessageSquare style={{ width: 12, height: 12 }} />
                  <span>
                    {comment.repliesCount > 0
                      ? `${comment.repliesCount} ردود`
                      : "رد"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

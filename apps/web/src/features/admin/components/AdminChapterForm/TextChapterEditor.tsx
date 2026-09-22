"use client";

import React, { useRef, useState } from "react";
import {
  Bold,
  Eye,
  FileText,
  Heading2,
  Heading3,
  Italic,
  List,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./AdminChapterForm.module.css";

interface TextChapterEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TextChapterEditor({
  content,
  onChange,
}: TextChapterEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const insertMarkup = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousContent = textarea.value;
    const selectedText = previousContent.substring(start, end);
    const replacement = `${before}${selectedText || "نص"}${after}`;

    const newContent =
      previousContent.substring(0, start) +
      replacement +
      previousContent.substring(end);

    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + replacement.length - after.length,
      );
    }, 0);
  };

  return (
    <div className={styles["card"]}>
      <div className={styles["cardHeader"]}>
        <div className={styles["pagesCounter"]}>
          <FileText className={styles["cardIcon"]} />
          <span>محتوى الفصل النصي</span>
        </div>
        <div className={styles["tabsRow"]} style={{ borderBottom: "none", paddingBottom: 0 }}>
          <button
            type="button"
            onClick={() => { setActiveTab("edit"); }}
            className={cn(styles["tabBtn"], activeTab === "edit" && styles["tabBtnActive"])}
          >
            المحرر
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("preview"); }}
            className={cn(styles["tabBtn"], activeTab === "preview" && styles["tabBtnActive"])}
          >
            <Eye style={{ width: "0.875rem", height: "0.875rem", display: "inline-block", verticalAlign: "middle", marginLeft: "0.25rem" }} />
            المعاينة الحية
          </button>
        </div>
      </div>

      {activeTab === "edit" ? (
        <>
          <div className={styles["textToolbar"]}>
            <button
              type="button"
              onClick={() => { insertMarkup("## ", "\n"); }}
              className={styles["toolbarBtn"]}
              title="عنوان 2"
            >
              <Heading2 style={{ width: "1rem", height: "1rem" }} />
              عنوان 2
            </button>
            <button
              type="button"
              onClick={() => { insertMarkup("### ", "\n"); }}
              className={styles["toolbarBtn"]}
              title="عنوان 3"
            >
              <Heading3 style={{ width: "1rem", height: "1rem" }} />
              عنوان 3
            </button>
            <button
              type="button"
              onClick={() => { insertMarkup("**", "**"); }}
              className={styles["toolbarBtn"]}
              title="عريض"
            >
              <Bold style={{ width: "1rem", height: "1rem" }} />
              عريض
            </button>
            <button
              type="button"
              onClick={() => { insertMarkup("*", "*"); }}
              className={styles["toolbarBtn"]}
              title="مائل"
            >
              <Italic style={{ width: "1rem", height: "1rem" }} />
              مائل
            </button>
            <button
              type="button"
              onClick={() => { insertMarkup("- ", "\n"); }}
              className={styles["toolbarBtn"]}
              title="قائمة نقطية"
            >
              <List style={{ width: "1rem", height: "1rem" }} />
              قائمة
            </button>
            <button
              type="button"
              onClick={() => { insertMarkup("> ", "\n"); }}
              className={styles["toolbarBtn"]}
              title="اقتباس"
            >
              <Quote style={{ width: "1rem", height: "1rem" }} />
              اقتباس
            </button>
          </div>

          <div className={styles["field"]}>
            <textarea
              ref={textareaRef}
              className={styles["textarea"]}
              style={{
                minHeight: "350px",
                lineHeight: "1.8",
                fontSize: "0.9375rem",
                fontFamily: "inherit",
              }}
              value={content}
              onChange={(e) => { onChange(e.target.value); }}
              placeholder="اكتب أو الصق نص الفصل هنا... يمكنك استخدام أزرار التنسيق أعلاه لإضافة عناوين وفقرات واقتباسات."
              aria-label="نص الفصل"
            />
          </div>
        </>
      ) : (
        <div className={styles["textPreviewArea"]}>
          {content.trim() ? (
            <div>
              {content.split("\n\n").map((block, i) => {
                const trimmed = block.trim();
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3
                      key={String(i)}
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "var(--primary)",
                        margin: "1rem 0 0.5rem",
                      }}
                    >
                      {trimmed.replace(/^###\s+/, "")}
                    </h3>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return (
                    <h2
                      key={String(i)}
                      style={{
                        fontSize: "1.35rem",
                        fontWeight: 800,
                        color: "#ffffff",
                        margin: "1.25rem 0 0.5rem",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        paddingBottom: "0.25rem",
                      }}
                    >
                      {trimmed.replace(/^##\s+/, "")}
                    </h2>
                  );
                }
                if (trimmed.startsWith("> ")) {
                  return (
                    <blockquote
                      key={String(i)}
                      style={{
                        borderRight: "4px solid var(--primary)",
                        background: "rgba(255, 71, 71, 0.05)",
                        padding: "0.75rem 1rem",
                        margin: "1rem 0",
                        borderRadius: "0.25rem",
                        color: "rgba(255, 255, 255, 0.9)",
                        fontStyle: "italic",
                      }}
                    >
                      {trimmed.replace(/^>\s+/, "")}
                    </blockquote>
                  );
                }
                if (trimmed.startsWith("- ")) {
                  const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
                  return (
                    <ul key={String(i)} style={{ paddingRight: "1.5rem", margin: "0.75rem 0" }}>
                      {items.map((item, itemIdx) => (
                        <li key={String(itemIdx)} style={{ marginBottom: "0.25rem" }}>
                          {item.replace(/^- /, "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p
                    key={String(i)}
                    style={{
                      marginBottom: "1rem",
                      lineHeight: "1.9",
                      fontSize: "0.9375rem",
                      color: "rgba(255, 255, 255, 0.85)",
                    }}
                  >
                    {trimmed}
                  </p>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "2rem" }}>
              لا يوجد نص لمعاينته بعد. قم بكتابة نص في تبويب المحرر.
            </p>
          )}
        </div>
      )}

      <div className={styles["textStatsRow"]}>
        <span>إحصائيات النص:</span>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span>{String(wordCount)} كلمة</span>
          <span>•</span>
          <span>{String(charCount)} حرف</span>
          <span>•</span>
          <span>وقت القراءة التقديري: {String(readTimeMin)} دقيقة</span>
        </div>
      </div>
    </div>
  );
}

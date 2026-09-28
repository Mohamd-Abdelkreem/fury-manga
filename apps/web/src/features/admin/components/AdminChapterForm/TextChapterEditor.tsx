"use client";

import type { EditableTextBlock } from "../../model/admin-chapter-text";
import { cn } from "@/lib/utils";
import styles from "./AdminChapterForm.module.css";

type TextInline = Extract<
  EditableTextBlock,
  { type: "paragraph" }
>["content"][number];

export function TextChapterEditor({
  blocks,
  onChange,
}: Readonly<{
  blocks: readonly EditableTextBlock[];
  onChange: (blocks: EditableTextBlock[]) => void;
}>) {
  const replaceBlock = (index: number, block: EditableTextBlock) => {
    onChange(
      blocks.map((current, position) => (position === index ? block : current)),
    );
  };
  const moveBlock = (index: number, direction: -1 | 1) => {
    const destination = index + direction;
    if (destination < 0 || destination >= blocks.length) return;
    const next = [...blocks];
    const source = next[index];
    const target = next[destination];
    if (source === undefined || target === undefined) return;
    next[index] = target;
    next[destination] = source;
    onChange(next);
  };
  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, position) => position !== index));
  };
  const replaceInline = (
    block: Extract<EditableTextBlock, { type: "paragraph" }>,
    blockIndex: number,
    inlineIndex: number,
    inline: TextInline,
  ) => {
    replaceBlock(blockIndex, {
      ...block,
      content: block.content.map((current, position) =>
        position === inlineIndex ? inline : current,
      ),
    });
  };

  return (
    <section className={styles["card"]} aria-label="محرر النص المنظم">
      <div className={styles["cardHeader"]}>
        <h2 className={styles["cardTitle"]}>محتوى الفصل النصي</h2>
        <span className={styles["subtitle"]}>{blocks.length} / 500 مقطع</span>
      </div>
      <p className={styles["subtitle"]}>
        أضف المقاطع بالترتيب المطلوب. يمكن حفظ مسودة فارغة، وتتحقق الخدمة من
        النص والروابط عند الحفظ.
      </p>
      <div
        className={styles["actionsArea"]}
        role="group"
        aria-label="إضافة مقطع"
      >
        <button
          type="button"
          className={cn(styles["btn"], styles["btnSecondary"])}
          disabled={blocks.length >= 500}
          onClick={() => {
            onChange([
              ...blocks,
              { type: "paragraph", content: [{ text: "" }] },
            ]);
          }}
        >
          فقرة
        </button>
        <button
          type="button"
          className={cn(styles["btn"], styles["btnSecondary"])}
          disabled={blocks.length >= 500}
          onClick={() => {
            onChange([...blocks, { type: "heading", level: 2, text: "" }]);
          }}
        >
          عنوان H2
        </button>
        <button
          type="button"
          className={cn(styles["btn"], styles["btnSecondary"])}
          disabled={blocks.length >= 500}
          onClick={() => {
            onChange([...blocks, { type: "heading", level: 3, text: "" }]);
          }}
        >
          عنوان H3
        </button>
        <button
          type="button"
          className={cn(styles["btn"], styles["btnSecondary"])}
          disabled={blocks.length >= 500}
          onClick={() => {
            onChange([
              ...blocks,
              { type: "list", ordered: false, items: [""] },
            ]);
          }}
        >
          قائمة نقطية
        </button>
        <button
          type="button"
          className={cn(styles["btn"], styles["btnSecondary"])}
          disabled={blocks.length >= 500}
          onClick={() => {
            onChange([...blocks, { type: "list", ordered: true, items: [""] }]);
          }}
        >
          قائمة مرقمة
        </button>
      </div>
      {blocks.length === 0 ? (
        <p className={styles["emptyStateText"]}>لا يوجد نص في هذه المسودة.</p>
      ) : null}
      <ol className={styles["textBlockList"]} aria-label="مقاطع الفصل">
        {blocks.map((block, blockIndex) => (
          <li className={styles["textBlockItem"]} key={blockIndex}>
            <div className={styles["actionsArea"]}>
              <strong>المقطع {blockIndex + 1}</strong>
              <button
                type="button"
                className={styles["pageBtn"]}
                aria-label={`تحريك المقطع ${String(blockIndex + 1)} للأعلى`}
                disabled={blockIndex === 0}
                onClick={() => {
                  moveBlock(blockIndex, -1);
                }}
              >
                ↑
              </button>
              <button
                type="button"
                className={styles["pageBtn"]}
                aria-label={`تحريك المقطع ${String(blockIndex + 1)} للأسفل`}
                disabled={blockIndex === blocks.length - 1}
                onClick={() => {
                  moveBlock(blockIndex, 1);
                }}
              >
                ↓
              </button>
              <button
                type="button"
                className={styles["deletePageBtn"]}
                aria-label={`حذف المقطع ${String(blockIndex + 1)}`}
                onClick={() => {
                  removeBlock(blockIndex);
                }}
              >
                ×
              </button>
            </div>
            {block.type === "heading" ? (
              <div className={styles["field"]}>
                <label
                  className={styles["label"]}
                  htmlFor={`text-heading-${String(blockIndex)}`}
                >
                  عنوان {block.level === 2 ? "H2" : "H3"}
                </label>
                <input
                  id={`text-heading-${String(blockIndex)}`}
                  className={styles["input"]}
                  value={block.text}
                  maxLength={4000}
                  onChange={(event) => {
                    replaceBlock(blockIndex, {
                      ...block,
                      text: event.target.value,
                    });
                  }}
                />
              </div>
            ) : null}
            {block.type === "paragraph" ? (
              <div className={styles["textBlockList"]}>
                {block.content.map((inline, inlineIndex) => (
                  <div className={styles["textInlineRow"]} key={inlineIndex}>
                    <div className={styles["field"]}>
                      <label
                        className={styles["label"]}
                        htmlFor={`text-inline-${String(blockIndex)}-${String(inlineIndex)}`}
                      >
                        نص الفقرة {blockIndex + 1}، جزء {inlineIndex + 1}
                      </label>
                      <textarea
                        id={`text-inline-${String(blockIndex)}-${String(inlineIndex)}`}
                        className={styles["textarea"]}
                        value={inline.text}
                        maxLength={4000}
                        onChange={(event) => {
                          replaceInline(block, blockIndex, inlineIndex, {
                            ...inline,
                            text: event.target.value,
                          });
                        }}
                      />
                    </div>
                    <label className={styles["label"]}>
                      <input
                        type="checkbox"
                        checked={inline.bold ?? false}
                        onChange={(event) => {
                          replaceInline(block, blockIndex, inlineIndex, {
                            ...inline,
                            bold: event.target.checked,
                          });
                        }}
                      />{" "}
                      عريض
                    </label>
                    <label className={styles["label"]}>
                      <input
                        type="checkbox"
                        checked={inline.italic ?? false}
                        onChange={(event) => {
                          replaceInline(block, blockIndex, inlineIndex, {
                            ...inline,
                            italic: event.target.checked,
                          });
                        }}
                      />{" "}
                      مائل
                    </label>
                    <div className={styles["field"]}>
                      <label
                        className={styles["label"]}
                        htmlFor={`text-link-${String(blockIndex)}-${String(inlineIndex)}`}
                      >
                        رابط داخلي اختياري
                      </label>
                      <input
                        id={`text-link-${String(blockIndex)}-${String(inlineIndex)}`}
                        className={styles["input"]}
                        value={inline.href ?? ""}
                        placeholder="/stories/example"
                        onChange={(event) => {
                          const { href: _previous, ...withoutLink } = inline;
                          replaceInline(
                            block,
                            blockIndex,
                            inlineIndex,
                            event.target.value === ""
                              ? withoutLink
                              : { ...withoutLink, href: event.target.value },
                          );
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles["deletePageBtn"]}
                      aria-label={`حذف جزء ${String(inlineIndex + 1)} من الفقرة ${String(blockIndex + 1)}`}
                      disabled={block.content.length === 1}
                      onClick={() => {
                        replaceBlock(blockIndex, {
                          ...block,
                          content: block.content.filter(
                            (_, position) => position !== inlineIndex,
                          ),
                        });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={cn(styles["btn"], styles["btnSecondary"])}
                  disabled={block.content.length >= 200}
                  onClick={() => {
                    replaceBlock(blockIndex, {
                      ...block,
                      content: [...block.content, { text: "" }],
                    });
                  }}
                >
                  إضافة جزء نصي
                </button>
              </div>
            ) : null}
            {block.type === "list" ? (
              <div className={styles["textBlockList"]}>
                {block.items.map((item, itemIndex) => (
                  <div className={styles["textInlineRow"]} key={itemIndex}>
                    <div className={styles["field"]}>
                      <label
                        className={styles["label"]}
                        htmlFor={`text-item-${String(blockIndex)}-${String(itemIndex)}`}
                      >
                        عنصر {itemIndex + 1} في القائمة {blockIndex + 1}
                      </label>
                      <input
                        id={`text-item-${String(blockIndex)}-${String(itemIndex)}`}
                        className={styles["input"]}
                        value={item}
                        maxLength={4000}
                        onChange={(event) => {
                          replaceBlock(blockIndex, {
                            ...block,
                            items: block.items.map((current, position) =>
                              position === itemIndex
                                ? event.target.value
                                : current,
                            ),
                          });
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles["deletePageBtn"]}
                      aria-label={`حذف عنصر ${String(itemIndex + 1)} من القائمة ${String(blockIndex + 1)}`}
                      disabled={block.items.length === 1}
                      onClick={() => {
                        replaceBlock(blockIndex, {
                          ...block,
                          items: block.items.filter(
                            (_, position) => position !== itemIndex,
                          ),
                        });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={cn(styles["btn"], styles["btnSecondary"])}
                  disabled={block.items.length >= 200}
                  onClick={() => {
                    replaceBlock(blockIndex, {
                      ...block,
                      items: [...block.items, ""],
                    });
                  }}
                >
                  إضافة عنصر
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

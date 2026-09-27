"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  structuredTextInlineSchema,
  type StructuredTextDocument,
} from "@fury/contracts";
import { useAdminMediaCandidate } from "@/features/media/hooks/media.hooks";

type IllustratedPage = Readonly<{ id?: string; assetId: string }>;

function PrivateChapterPage({
  assetId,
  position,
}: Readonly<{ assetId: string; position: number }>) {
  const { state, load } = useAdminMediaCandidate("chapter_page");
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    void loadRef.current(assetId);
  }, [assetId]);

  return (
    <li>
      {state.previewUrl === null || state.assetId !== assetId ? (
        <p role="status">
          {state.phase === "error"
            ? "تعذر عرض الصورة الخاصة."
            : "جارٍ تحميل الصفحة…"}
        </p>
      ) : (
        <Image
          src={state.previewUrl}
          alt={`صفحة ${String(position)}`}
          width={720}
          height={1024}
          unoptimized
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      )}
    </li>
  );
}

function StructuredText({
  document,
}: Readonly<{ document: StructuredTextDocument | null }>) {
  if (document === null) return <p>لا يوجد نص في هذه المسودة.</p>;
  return (
    <div aria-label="نص الفصل" dir="rtl" style={{ whiteSpace: "pre-wrap" }}>
      {document.blocks.map((block, blockIndex) => {
        if (block.type === "heading") {
          return block.level === 2 ? (
            <h2 key={blockIndex}>{block.text}</h2>
          ) : (
            <h3 key={blockIndex}>{block.text}</h3>
          );
        }
        if (block.type === "list") {
          const items = block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ));
          return block.ordered ? (
            <ol key={blockIndex}>{items}</ol>
          ) : (
            <ul key={blockIndex}>{items}</ul>
          );
        }
        return (
          <p key={blockIndex}>
            {block.content.map((inline, inlineIndex) => {
              const emphasized = inline.italic ? (
                <em>{inline.text}</em>
              ) : (
                inline.text
              );
              const styled = inline.bold ? (
                <strong>{emphasized}</strong>
              ) : (
                emphasized
              );
              const safeLink =
                inline.href !== undefined &&
                structuredTextInlineSchema.safeParse(inline).success;
              return safeLink ? (
                <a key={inlineIndex} href={inline.href}>
                  {styled}
                </a>
              ) : (
                <span key={inlineIndex}>{styled}</span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

export function ChapterContentRenderer({
  pages,
  document,
}: Readonly<
  | { pages: readonly IllustratedPage[]; document?: never }
  | { pages?: never; document: StructuredTextDocument | null }
>) {
  if (document !== undefined) return <StructuredText document={document} />;
  if (pages.length === 0) return <p>لا توجد صفحات للمعاينة.</p>;
  return (
    <ol
      aria-label="صفحات الفصل المصور"
      style={{ listStyle: "none", padding: 0, margin: 0 }}
    >
      {pages.map((page, index) => (
        <PrivateChapterPage
          key={page.id ?? `${page.assetId}-${String(index)}`}
          assetId={page.assetId}
          position={index + 1}
        />
      ))}
    </ol>
  );
}

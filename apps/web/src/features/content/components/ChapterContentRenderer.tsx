"use client";

import {
  structuredTextInlineSchema,
  type StructuredTextDocument,
} from "@fury/contracts";
import type { IllustratedPage } from "../model/progressive-images";
import { IllustratedChapterPages } from "./IllustratedChapterPages";

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
  scopeKey = "preview",
}: Readonly<
  | { pages: readonly IllustratedPage[]; document?: never; scopeKey?: string }
  | {
      pages?: never;
      document: StructuredTextDocument | null;
      scopeKey?: string;
    }
>) {
  if (document !== undefined) return <StructuredText document={document} />;
  if (pages.length === 0) return <p>لا توجد صفحات للمعاينة.</p>;
  return (
    <IllustratedChapterPages
      key={`${scopeKey}:${pages.map((page) => page.id ?? page.assetId).join(":")}`}
      pages={pages}
      scopeKey={scopeKey}
    />
  );
}

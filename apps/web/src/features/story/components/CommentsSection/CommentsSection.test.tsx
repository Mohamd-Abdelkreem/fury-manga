import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CommentsSection } from "./CommentsSection";

const comments = [
  {
    id: "other",
    user: "قارئ آخر",
    date: "الآن",
    content: "تعليق عام",
    likes: 2,
  },
  {
    id: "mine",
    user: "أنا",
    date: "الآن",
    content: "تعليقي",
    isOwn: true,
  },
] as const;

function commentCardFor(content: string): HTMLElement {
  const card = screen.getByText(content).closest("article");
  if (card === null) throw new Error(`Comment card missing for: ${content}`);
  return card;
}

describe("CommentsSection", () => {
  it("offers flat comment actions without reply controls", () => {
    render(<CommentsSection initialComments={comments} contextLabel="الفصل" />);

    expect(screen.queryByText(/رد|ردود/)).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /إعجاب/ })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "إبلاغ" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "تعديل" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "حذف" })).toBeInTheDocument();
  });

  it("adds a comment from the work-level form", () => {
    render(<CommentsSection initialComments={comments} />);
    fireEvent.change(screen.getByLabelText("اكتب تعليقًا على العمل"), {
      target: { value: "تعليق جديد" },
    });
    fireEvent.click(screen.getByRole("button", { name: "إرسال تعليق" }));

    expect(screen.getByText("تعليق جديد")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("تم نشر تعليقك");
  });

  it("toggles a comment like", () => {
    render(<CommentsSection initialComments={comments} />);
    const comment = within(commentCardFor("تعليق عام"));

    fireEvent.click(comment.getByRole("button", { name: /إعجاب/ }));
    expect(
      comment.getByRole("button", { name: /إلغاء الإعجاب/ }),
    ).toHaveTextContent("(3)");
  });

  it("reports another user's comment once", () => {
    render(<CommentsSection initialComments={comments} />);
    const comment = within(commentCardFor("تعليق عام"));

    fireEvent.click(comment.getByRole("button", { name: "إبلاغ" }));
    expect(comment.getByRole("button", { name: "تم الإبلاغ" })).toBeDisabled();
  });

  it("edits an owned comment inline", () => {
    render(<CommentsSection initialComments={comments} />);
    const comment = within(commentCardFor("تعليقي"));

    fireEvent.click(comment.getByRole("button", { name: "تعديل" }));
    fireEvent.change(comment.getByLabelText("تعديل التعليق"), {
      target: { value: "تعليق معدل" },
    });
    fireEvent.click(comment.getByRole("button", { name: "حفظ التعديل" }));
    expect(screen.getByText("تعليق معدل")).toBeInTheDocument();
  });

  it("soft-deletes an owned comment", () => {
    render(<CommentsSection initialComments={comments} />);
    const comment = within(commentCardFor("تعليقي"));

    fireEvent.click(comment.getByRole("button", { name: "حذف" }));
    expect(
      screen.getByText("تم حذف هذا التعليق بواسطة صاحبه."),
    ).toBeInTheDocument();
  });
});

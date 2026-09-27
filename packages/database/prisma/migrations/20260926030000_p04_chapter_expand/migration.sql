BEGIN;

ALTER TABLE "chapters"
  ADD COLUMN "title" VARCHAR(200);

ALTER TABLE "chapters"
  ADD CONSTRAINT "ck_chapters_title_nonblank_when_present"
  CHECK ("title" IS NULL OR length(btrim("title")) BETWEEN 1 AND 200);

ALTER TABLE "chapters"
  DROP CONSTRAINT "ck_chapters_content_consistent",
  ADD CONSTRAINT "ck_chapters_content_consistent" CHECK (
    (
      "content_type" = 'text'
      AND (
        (
          "text_content" IS NULL
          AND "publication_status" <> 'published'
        )
        OR (
          "text_content" IS NOT NULL
          AND jsonb_typeof("text_content") = 'object'
          AND octet_length("text_content"::text) <= 524288
        )
      )
    )
    OR (
      "content_type" = 'illustrated'
      AND "text_content" IS NULL
    )
  );

ALTER TABLE "chapter_pages"
  ADD COLUMN "retired_at" TIMESTAMPTZ(6);

DROP INDEX "chapter_pages_chapter_id_position_key";

CREATE UNIQUE INDEX "chapter_pages_active_position_key"
  ON "chapter_pages"("chapter_id", "position")
  WHERE "retired_at" IS NULL;

CREATE INDEX "chapter_pages_active_order_idx"
  ON "chapter_pages"("chapter_id", "retired_at", "position", "id");

COMMIT;

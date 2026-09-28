BEGIN;

-- Applied only after the expanded database has passed the Chapter inventory.
ALTER TABLE "chapters"
  ALTER COLUMN "title" SET NOT NULL;

CREATE FUNCTION "enforce_chapter_page_link_identity"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."chapter_id" <> OLD."chapter_id" THEN
    RAISE EXCEPTION 'chapter page parent is immutable'
      USING ERRCODE = '23514', CONSTRAINT = 'ck_chapter_pages_parent_immutable';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_chapter_pages_parent_immutable"
BEFORE UPDATE ON "chapter_pages"
FOR EACH ROW EXECUTE FUNCTION "enforce_chapter_page_link_identity"();

CREATE FUNCTION "enforce_page_reference_link_identity"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."chapter_page_id" IS DISTINCT FROM OLD."chapter_page_id" THEN
    RAISE EXCEPTION 'page reference target is immutable'
      USING ERRCODE = '23514', CONSTRAINT = 'ck_page_reference_target_immutable';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_page_reference_target_immutable"
BEFORE UPDATE ON "media_references"
FOR EACH ROW EXECUTE FUNCTION "enforce_page_reference_link_identity"();

CREATE FUNCTION "enforce_referenced_page_media_class"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (NEW."media_class" <> OLD."media_class" OR NEW."scope" <> OLD."scope")
     AND EXISTS (
       SELECT 1 FROM "media_references" r
       JOIN "chapter_pages" p ON p."id" = r."chapter_page_id"
       WHERE r."asset_id" = NEW."id" AND r."retired_at" IS NULL
         AND p."retired_at" IS NULL
     ) THEN
    RAISE EXCEPTION 'referenced chapter page media class is immutable'
      USING ERRCODE = '23514', CONSTRAINT = 'ck_chapter_page_media_class_immutable';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_referenced_page_media_class"
BEFORE UPDATE ON "media_assets"
FOR EACH ROW EXECUTE FUNCTION "enforce_referenced_page_media_class"();

CREATE OR REPLACE FUNCTION "check_chapter_publication_ready"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  target_chapter_id UUID;
  target_chapter "chapters"%ROWTYPE;
  active_count INTEGER;
  last_position INTEGER;
BEGIN
  IF TG_TABLE_NAME = 'chapter_pages' THEN
    target_chapter_id := CASE WHEN TG_OP = 'DELETE' THEN OLD."chapter_id" ELSE NEW."chapter_id" END;
  ELSIF TG_TABLE_NAME = 'media_references' THEN
    SELECT "chapter_id" INTO target_chapter_id
    FROM "chapter_pages"
    WHERE "id" = CASE WHEN TG_OP = 'DELETE' THEN OLD."chapter_page_id" ELSE NEW."chapter_page_id" END;
  ELSE
    target_chapter_id := NEW."id";
  END IF;

  IF target_chapter_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Serializes child changes with Chapter publication and final-state checks.
  SELECT * INTO target_chapter FROM "chapters" WHERE "id" = target_chapter_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF target_chapter."content_type" = 'text' THEN
    IF target_chapter."publication_status" = 'published' AND (
      target_chapter."text_content" IS NULL
      OR target_chapter."text_content"->>'version' IS DISTINCT FROM '1'
      OR jsonb_typeof(target_chapter."text_content"->'blocks') IS DISTINCT FROM 'array'
      OR jsonb_array_length(CASE
          WHEN jsonb_typeof(target_chapter."text_content"->'blocks') = 'array'
          THEN target_chapter."text_content"->'blocks' ELSE '[]'::jsonb END) = 0
    ) THEN
      RAISE EXCEPTION 'published text chapter requires version-1 content'
        USING ERRCODE = '23514', CONSTRAINT = 'ck_chapters_text_publication_ready';
    END IF;
    RETURN NULL;
  END IF;

  SELECT count(*)::integer, max("position") INTO active_count, last_position
  FROM "chapter_pages"
  WHERE "chapter_id" = target_chapter_id AND "retired_at" IS NULL;

  IF active_count > 0 AND last_position <> active_count THEN
    RAISE EXCEPTION 'active chapter page positions must be consecutive'
      USING ERRCODE = '23514', CONSTRAINT = 'ck_chapter_pages_active_order';
  END IF;

  IF EXISTS (
    SELECT 1 FROM "chapter_pages" p
    LEFT JOIN "media_references" r
      ON r."chapter_page_id" = p."id" AND r."retired_at" IS NULL
    LEFT JOIN "media_assets" a ON a."id" = r."asset_id"
    WHERE p."chapter_id" = target_chapter_id AND p."retired_at" IS NULL
    GROUP BY p."id"
    HAVING count(r."id") <> 1
      OR count(r."id") FILTER (WHERE r."slot" = 'chapter_page'
        AND a."media_class" = 'chapter_page' AND a."scope" = 'admin') <> 1
  ) THEN
    RAISE EXCEPTION 'active chapter pages require one admin page reference'
      USING ERRCODE = '23514', CONSTRAINT = 'ck_chapter_pages_active_reference';
  END IF;

  IF target_chapter."publication_status" = 'published' AND active_count = 0 THEN
    RAISE EXCEPTION 'published illustrated chapters require at least one active page'
      USING ERRCODE = '23514', CONSTRAINT = 'ck_chapters_illustrated_publication_ready';
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER "trg_media_references_chapter_ready"
AFTER INSERT OR UPDATE OR DELETE ON "media_references"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "check_chapter_publication_ready"();

-- CREATE OR REPLACE does not visit preexisting rows; validate the final state here.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "chapters" c
    WHERE c."content_type" = 'text' AND c."publication_status" = 'published'
      AND (c."text_content" IS NULL
        OR c."text_content"->>'version' IS DISTINCT FROM '1'
        OR jsonb_typeof(c."text_content"->'blocks') IS DISTINCT FROM 'array'
        OR jsonb_array_length(CASE
            WHEN jsonb_typeof(c."text_content"->'blocks') = 'array'
            THEN c."text_content"->'blocks' ELSE '[]'::jsonb END) = 0)
  ) THEN
    RAISE EXCEPTION 'published text chapter inventory is not clean';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "chapters" c
    WHERE c."content_type" = 'illustrated' AND c."publication_status" = 'published'
      AND NOT EXISTS (SELECT 1 FROM "chapter_pages" p
        WHERE p."chapter_id" = c."id" AND p."retired_at" IS NULL)
  ) THEN
    RAISE EXCEPTION 'published illustrated chapter inventory is not clean';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "chapter_pages" p
    WHERE p."retired_at" IS NULL
    GROUP BY p."chapter_id"
    HAVING max(p."position") <> count(*)
  ) THEN
    RAISE EXCEPTION 'active chapter page order inventory is not clean';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "chapter_pages" p
    LEFT JOIN "media_references" r
      ON r."chapter_page_id" = p."id" AND r."retired_at" IS NULL
    LEFT JOIN "media_assets" a ON a."id" = r."asset_id"
    WHERE p."retired_at" IS NULL
    GROUP BY p."id"
    HAVING count(r."id") <> 1
      OR count(r."id") FILTER (WHERE r."slot" = 'chapter_page'
        AND a."media_class" = 'chapter_page' AND a."scope" = 'admin') <> 1
  ) THEN
    RAISE EXCEPTION 'active chapter page reference inventory is not clean';
  END IF;
END;
$$;

COMMIT;

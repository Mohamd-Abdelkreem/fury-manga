BEGIN;

ALTER TABLE "categories"
  ADD COLUMN "enabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "display_position" INTEGER;

WITH "ranked_categories" AS (
  SELECT
    "id",
    row_number() OVER (ORDER BY "created_at", "id")::INTEGER AS "position"
  FROM "categories"
)
UPDATE "categories" AS "category"
SET "display_position" = "ranked_categories"."position"
FROM "ranked_categories"
WHERE "category"."id" = "ranked_categories"."id";

ALTER TABLE "categories"
  ALTER COLUMN "display_position" SET NOT NULL,
  ADD CONSTRAINT "ck_categories_display_position_positive"
    CHECK ("display_position" > 0),
  ADD CONSTRAINT "categories_display_position_key"
    UNIQUE ("display_position") DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "categories_enabled_position_idx"
  ON "categories"("enabled", "display_position", "id");

ALTER TABLE "works"
  ADD COLUMN "alternative_title" VARCHAR(200),
  ADD COLUMN "synopsis" VARCHAR(5000),
  ADD COLUMN "author" VARCHAR(150),
  ADD COLUMN "artist" VARCHAR(150),
  ADD COLUMN "featured_home" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "featured_order" INTEGER,
  ADD CONSTRAINT "ck_works_alternative_title_nonblank"
    CHECK ("alternative_title" IS NULL OR btrim("alternative_title") <> ''),
  ADD CONSTRAINT "ck_works_synopsis_bounded"
    CHECK (
      "synopsis" IS NULL
      OR (btrim("synopsis") <> '' AND char_length("synopsis") BETWEEN 20 AND 5000)
    ),
  ADD CONSTRAINT "ck_works_author_nonblank"
    CHECK ("author" IS NULL OR btrim("author") <> ''),
  ADD CONSTRAINT "ck_works_artist_nonblank"
    CHECK ("artist" IS NULL OR btrim("artist") <> ''),
  ADD CONSTRAINT "ck_works_featured_pair"
    CHECK (
      ("featured_home" AND "featured_order" IS NOT NULL AND "featured_order" > 0)
      OR (NOT "featured_home" AND "featured_order" IS NULL)
    );

CREATE UNIQUE INDEX "works_published_featured_order_key"
  ON "works"("featured_order")
  WHERE "publication_status" = 'published' AND "featured_home";

CREATE TABLE "work_tags" (
  "work_id" UUID NOT NULL,
  "normalized_tag" VARCHAR(40) NOT NULL,
  "position" INTEGER NOT NULL,
  CONSTRAINT "work_tags_pkey" PRIMARY KEY ("work_id", "normalized_tag"),
  CONSTRAINT "ck_work_tags_normalized_tag" CHECK (
    "normalized_tag" = normalize(btrim("normalized_tag"), NFC)
    AND btrim("normalized_tag") <> ''
  ),
  CONSTRAINT "ck_work_tags_position_positive" CHECK ("position" > 0),
  -- Together with per-work position uniqueness, bounded slots cap each work at 20 tags.
  CONSTRAINT "ck_work_tags_position_within_work_limit" CHECK ("position" <= 20),
  CONSTRAINT "work_tags_work_id_position_key" UNIQUE ("work_id", "position"),
  CONSTRAINT "work_tags_work_id_fkey"
    FOREIGN KEY ("work_id") REFERENCES "works"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE FUNCTION "next_category_display_position"()
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  next_position INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(5380033990109::BIGINT);
  SELECT COALESCE(MAX("display_position"), 0) + 1
    INTO next_position
    FROM "categories";
  RETURN next_position;
END;
$$;

ALTER TABLE "categories"
  ALTER COLUMN "display_position" SET DEFAULT "next_category_display_position"();

CREATE FUNCTION "lock_category_order_mutations"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(5380033990109::BIGINT);
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_categories_order_lock"
BEFORE INSERT OR UPDATE OF "display_position" OR DELETE
ON "categories"
FOR EACH ROW EXECUTE FUNCTION "lock_category_order_mutations"();

CREATE FUNCTION "check_category_positions_gapless"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  category_count BIGINT;
  first_position INTEGER;
  last_position INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(5380033990109::BIGINT);
  SELECT count(*), min("display_position"), max("display_position")
    INTO category_count, first_position, last_position
    FROM "categories";
  IF category_count > 0
    AND (first_position <> 1 OR last_position <> category_count)
  THEN
    RAISE EXCEPTION 'category display positions must be gapless'
      USING ERRCODE = '23514',
            CONSTRAINT = 'ck_categories_display_positions_gapless';
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER "trg_categories_positions_gapless"
AFTER INSERT OR UPDATE OR DELETE ON "categories"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "check_category_positions_gapless"();

CREATE FUNCTION "prevent_category_deletion"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'categories cannot be deleted'
    USING ERRCODE = '23514',
          CONSTRAINT = 'ck_categories_no_delete';
END;
$$;

CREATE TRIGGER "trg_categories_no_delete"
BEFORE DELETE ON "categories"
FOR EACH ROW EXECUTE FUNCTION "prevent_category_deletion"();

COMMIT;

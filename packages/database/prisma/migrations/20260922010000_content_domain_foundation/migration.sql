CREATE TYPE "work_type" AS ENUM (
  'manga',
  'manhwa',
  'manhua',
  'comics',
  'novel',
  'text-story'
);

CREATE TYPE "story_status" AS ENUM (
  'ongoing',
  'completed',
  'hiatus',
  'cancelled'
);

CREATE TYPE "publication_status" AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE "chapter_content_type" AS ENUM ('illustrated', 'text');

CREATE TABLE "works" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" VARCHAR(200) NOT NULL,
  "slug" VARCHAR(120) NOT NULL,
  "type" "work_type" NOT NULL,
  "story_status" "story_status" NOT NULL,
  "publication_status" "publication_status" NOT NULL DEFAULT 'draft',
  "published_at" TIMESTAMPTZ(6),
  "current_publication_event_id" UUID,
  "version" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "works_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ck_works_title_nonblank" CHECK (btrim("title") <> ''),
  CONSTRAINT "ck_works_slug_normalized" CHECK (
    "slug" = lower(btrim("slug"))
    AND "slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  CONSTRAINT "ck_works_version_nonnegative" CHECK ("version" >= 0),
  CONSTRAINT "ck_works_publication_consistent" CHECK (
    (
      "publication_status" = 'published'
      AND "published_at" IS NOT NULL
      AND "current_publication_event_id" IS NOT NULL
    )
    OR (
      "publication_status" <> 'published'
      AND "published_at" IS NULL
      AND "current_publication_event_id" IS NULL
    )
  )
);

CREATE TABLE "categories" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "display_name" VARCHAR(100) NOT NULL,
  "slug" VARCHAR(120) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "categories_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ck_categories_display_name_nonblank" CHECK (
    btrim("display_name") <> ''
  ),
  CONSTRAINT "ck_categories_slug_normalized" CHECK (
    "slug" = lower(btrim("slug"))
    AND "slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  CONSTRAINT "ck_categories_version_nonnegative" CHECK ("version" >= 0)
);

CREATE TABLE "work_categories" (
  "work_id" UUID NOT NULL,
  "category_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "work_categories_pkey" PRIMARY KEY ("work_id", "category_id")
);

CREATE TABLE "chapters" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "work_id" UUID NOT NULL,
  "number" INTEGER NOT NULL,
  "content_type" "chapter_content_type" NOT NULL,
  "text_content" JSONB,
  "publication_status" "publication_status" NOT NULL DEFAULT 'draft',
  "published_at" TIMESTAMPTZ(6),
  "current_publication_event_id" UUID,
  "version" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "chapters_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ck_chapters_number_positive" CHECK ("number" > 0),
  CONSTRAINT "ck_chapters_version_nonnegative" CHECK ("version" >= 0),
  CONSTRAINT "ck_chapters_content_consistent" CHECK (
    (
      "content_type" = 'text'
      AND "text_content" IS NOT NULL
      AND jsonb_typeof("text_content") = 'object'
      AND octet_length("text_content"::text) <= 524288
    )
    OR (
      "content_type" = 'illustrated'
      AND "text_content" IS NULL
    )
  ),
  CONSTRAINT "ck_chapters_publication_consistent" CHECK (
    (
      "publication_status" = 'published'
      AND "published_at" IS NOT NULL
      AND "current_publication_event_id" IS NOT NULL
    )
    OR (
      "publication_status" <> 'published'
      AND "published_at" IS NULL
      AND "current_publication_event_id" IS NULL
    )
  )
);

CREATE TABLE "chapter_pages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "chapter_id" UUID NOT NULL,
  "position" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "chapter_pages_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ck_chapter_pages_position_positive" CHECK ("position" > 0)
);

CREATE TABLE "publication_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "work_id" UUID,
  "chapter_id" UUID,
  "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "publication_events_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ck_publication_events_one_target" CHECK (
    ("work_id" IS NOT NULL)::integer + ("chapter_id" IS NOT NULL)::integer = 1
  )
);

CREATE UNIQUE INDEX "works_slug_key" ON "works"("slug");
CREATE UNIQUE INDEX "works_current_publication_event_id_key"
  ON "works"("current_publication_event_id");
CREATE INDEX "works_publication_idx"
  ON "works"("publication_status", "published_at" DESC, "id");
CREATE INDEX "works_created_idx" ON "works"("created_at" DESC, "id");

CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE INDEX "categories_created_idx"
  ON "categories"("created_at" DESC, "id");

CREATE INDEX "work_categories_category_work_idx"
  ON "work_categories"("category_id", "work_id");

CREATE UNIQUE INDEX "chapters_work_id_number_key"
  ON "chapters"("work_id", "number");
CREATE UNIQUE INDEX "chapters_current_publication_event_id_key"
  ON "chapters"("current_publication_event_id");
CREATE INDEX "chapters_work_publication_number_idx"
  ON "chapters"("work_id", "publication_status", "number", "id");

CREATE UNIQUE INDEX "chapter_pages_chapter_id_position_key"
  ON "chapter_pages"("chapter_id", "position");
CREATE INDEX "chapter_pages_order_idx"
  ON "chapter_pages"("chapter_id", "position", "id");

CREATE INDEX "publication_events_work_idx"
  ON "publication_events"("work_id", "occurred_at" DESC, "id");
CREATE INDEX "publication_events_chapter_idx"
  ON "publication_events"("chapter_id", "occurred_at" DESC, "id");

ALTER TABLE "work_categories"
  ADD CONSTRAINT "work_categories_work_id_fkey"
  FOREIGN KEY ("work_id") REFERENCES "works"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "work_categories"
  ADD CONSTRAINT "work_categories_category_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "categories"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "chapters"
  ADD CONSTRAINT "chapters_work_id_fkey"
  FOREIGN KEY ("work_id") REFERENCES "works"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "chapter_pages"
  ADD CONSTRAINT "chapter_pages_chapter_id_fkey"
  FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "publication_events"
  ADD CONSTRAINT "publication_events_work_id_fkey"
  FOREIGN KEY ("work_id") REFERENCES "works"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "publication_events"
  ADD CONSTRAINT "publication_events_chapter_id_fkey"
  FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "works"
  ADD CONSTRAINT "works_current_publication_event_id_fkey"
  FOREIGN KEY ("current_publication_event_id")
  REFERENCES "publication_events"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE
  DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "chapters"
  ADD CONSTRAINT "chapters_current_publication_event_id_fkey"
  FOREIGN KEY ("current_publication_event_id")
  REFERENCES "publication_events"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE
  DEFERRABLE INITIALLY DEFERRED;

CREATE FUNCTION "enforce_work_identity_immutable"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."id" <> OLD."id"
    OR NEW."slug" <> OLD."slug"
    OR NEW."type" <> OLD."type"
  THEN
    RAISE EXCEPTION 'work identity is immutable'
      USING ERRCODE = '23514',
            CONSTRAINT = 'ck_works_identity_immutable';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_works_identity_immutable"
BEFORE UPDATE ON "works"
FOR EACH ROW EXECUTE FUNCTION "enforce_work_identity_immutable"();

CREATE FUNCTION "enforce_category_identity_immutable"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."id" <> OLD."id" OR NEW."slug" <> OLD."slug" THEN
    RAISE EXCEPTION 'category identity is immutable'
      USING ERRCODE = '23514',
            CONSTRAINT = 'ck_categories_identity_immutable';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_categories_identity_immutable"
BEFORE UPDATE ON "categories"
FOR EACH ROW EXECUTE FUNCTION "enforce_category_identity_immutable"();

CREATE FUNCTION "enforce_chapter_identity_and_type"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  parent_type "work_type";
  required_type "chapter_content_type";
BEGIN
  IF TG_OP = 'UPDATE' AND (
    NEW."id" <> OLD."id"
    OR NEW."work_id" <> OLD."work_id"
    OR NEW."content_type" <> OLD."content_type"
  ) THEN
    RAISE EXCEPTION 'chapter identity and content type are immutable'
      USING ERRCODE = '23514',
            CONSTRAINT = 'ck_chapters_identity_immutable';
  END IF;

  SELECT "type" INTO parent_type FROM "works" WHERE "id" = NEW."work_id";
  required_type := CASE
    WHEN parent_type IN ('manga', 'manhwa', 'manhua', 'comics')
      THEN 'illustrated'::"chapter_content_type"
    ELSE 'text'::"chapter_content_type"
  END;
  IF parent_type IS NULL OR NEW."content_type" <> required_type THEN
    RAISE EXCEPTION 'chapter content type does not match its work'
      USING ERRCODE = '23514',
            CONSTRAINT = 'ck_chapters_parent_content_type';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_chapters_identity_and_type"
BEFORE INSERT OR UPDATE ON "chapters"
FOR EACH ROW EXECUTE FUNCTION "enforce_chapter_identity_and_type"();

CREATE FUNCTION "enforce_page_parent_type"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  parent_type "chapter_content_type";
BEGIN
  SELECT "content_type" INTO parent_type
  FROM "chapters"
  WHERE "id" = NEW."chapter_id";
  IF parent_type IS DISTINCT FROM 'illustrated'::"chapter_content_type" THEN
    RAISE EXCEPTION 'pages require an illustrated chapter'
      USING ERRCODE = '23514',
            CONSTRAINT = 'ck_chapter_pages_illustrated_parent';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "trg_chapter_pages_parent_type"
BEFORE INSERT OR UPDATE ON "chapter_pages"
FOR EACH ROW EXECUTE FUNCTION "enforce_page_parent_type"();

CREATE FUNCTION "prevent_publication_event_mutation"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'publication events are immutable'
    USING ERRCODE = '23514',
          CONSTRAINT = 'ck_publication_events_immutable';
END;
$$;

CREATE TRIGGER "trg_publication_events_immutable"
BEFORE UPDATE OR DELETE ON "publication_events"
FOR EACH ROW EXECUTE FUNCTION "prevent_publication_event_mutation"();

CREATE FUNCTION "check_work_current_publication_event"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."publication_status" = 'published' AND NOT EXISTS (
    SELECT 1
    FROM "publication_events"
    WHERE "id" = NEW."current_publication_event_id"
      AND "work_id" = NEW."id"
      AND "chapter_id" IS NULL
      AND "occurred_at" = NEW."published_at"
  ) THEN
    RAISE EXCEPTION 'work current publication event is inconsistent'
      USING ERRCODE = '23514',
            CONSTRAINT = 'ck_works_current_publication_event';
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER "trg_works_current_publication_event"
AFTER INSERT OR UPDATE ON "works"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "check_work_current_publication_event"();

CREATE FUNCTION "check_chapter_publication_ready"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  target_chapter_id UUID;
BEGIN
  IF TG_TABLE_NAME = 'chapter_pages' THEN
    target_chapter_id := CASE
      WHEN TG_OP = 'DELETE' THEN OLD."chapter_id"
      ELSE NEW."chapter_id"
    END;
  ELSE
    target_chapter_id := NEW."id";
  END IF;
  IF EXISTS (
    SELECT 1
    FROM "chapters"
    WHERE "id" = target_chapter_id
      AND "content_type" = 'illustrated'
      AND "publication_status" = 'published'
      AND NOT EXISTS (
        SELECT 1
        FROM "chapter_pages"
        WHERE "chapter_id" = target_chapter_id
      )
  ) THEN
    RAISE EXCEPTION 'published illustrated chapters require at least one page'
      USING ERRCODE = '23514',
            CONSTRAINT = 'ck_chapters_illustrated_publication_ready';
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER "trg_chapters_publication_ready"
AFTER INSERT OR UPDATE ON "chapters"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "check_chapter_publication_ready"();

CREATE CONSTRAINT TRIGGER "trg_chapter_pages_publication_ready"
AFTER INSERT OR UPDATE OR DELETE ON "chapter_pages"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "check_chapter_publication_ready"();

CREATE FUNCTION "check_chapter_current_publication_event"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."publication_status" = 'published' AND NOT EXISTS (
    SELECT 1
    FROM "publication_events"
    WHERE "id" = NEW."current_publication_event_id"
      AND "chapter_id" = NEW."id"
      AND "work_id" IS NULL
      AND "occurred_at" = NEW."published_at"
  ) THEN
    RAISE EXCEPTION 'chapter current publication event is inconsistent'
      USING ERRCODE = '23514',
            CONSTRAINT = 'ck_chapters_current_publication_event';
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER "trg_chapters_current_publication_event"
AFTER INSERT OR UPDATE ON "chapters"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "check_chapter_current_publication_event"();

CREATE TYPE "media_class" AS ENUM (
  'work_cover', 'work_background', 'chapter_page', 'user_avatar',
  'avatar_frame', 'comment_decoration'
);
CREATE TYPE "media_scope" AS ENUM ('admin', 'user');
CREATE TYPE "media_asset_status" AS ENUM (
  'pending', 'available', 'removing', 'unavailable', 'removed'
);
CREATE TYPE "upload_attempt_state" AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE "media_reference_slot" AS ENUM (
  'work_cover', 'work_background', 'chapter_page'
);
CREATE TYPE "media_reference_action" AS ENUM ('bound', 'replaced', 'retired');

CREATE TABLE "media_assets" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "media_class" "media_class" NOT NULL,
  "scope" "media_scope" NOT NULL,
  "owner_user_id" UUID,
  "uploaded_by_user_id" UUID NOT NULL,
  "relative_key" VARCHAR(100) NOT NULL,
  "content_type" VARCHAR(32),
  "byte_length" INTEGER,
  "width" INTEGER,
  "height" INTEGER,
  "sha256" CHAR(64),
  "status" "media_asset_status" NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "available_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ck_media_assets_scope_owner" CHECK (
    ("media_class" = 'user_avatar' AND "scope" = 'user' AND "owner_user_id" IS NOT NULL)
    OR ("media_class" <> 'user_avatar' AND "scope" = 'admin' AND "owner_user_id" IS NULL)
  ),
  CONSTRAINT "ck_media_assets_dimensions" CHECK (
    ("byte_length" IS NULL OR "byte_length" > 0)
    AND ("width" IS NULL OR "width" > 0)
    AND ("height" IS NULL OR "height" > 0)
  ),
  CONSTRAINT "ck_media_assets_available" CHECK (
    "status" NOT IN ('available', 'unavailable')
    OR (
      "content_type" IS NOT NULL
      AND "content_type" IN ('image/jpeg', 'image/png', 'image/webp')
      AND "byte_length" IS NOT NULL AND "width" IS NOT NULL
      AND "height" IS NOT NULL AND "sha256" IS NOT NULL
      AND "available_at" IS NOT NULL AND "removed_at" IS NULL
    )
  ),
  CONSTRAINT "ck_media_assets_removed" CHECK (
    ("status" = 'removed') = ("removed_at" IS NOT NULL)
  )
);

CREATE TABLE "upload_attempts" (
  "id" UUID NOT NULL,
  "actor_user_id" UUID NOT NULL,
  "media_class" "media_class" NOT NULL,
  "source_sha256" CHAR(64),
  "state" "upload_attempt_state" NOT NULL DEFAULT 'pending',
  "asset_id" UUID,
  "safe_failure_code" VARCHAR(80),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMPTZ(6),
  CONSTRAINT "upload_attempts_pkey" PRIMARY KEY ("actor_user_id", "id"),
  CONSTRAINT "ck_upload_attempts_state" CHECK (
    ("state" = 'pending' AND "completed_at" IS NULL AND "safe_failure_code" IS NULL)
    OR ("state" = 'accepted' AND "completed_at" IS NOT NULL
      AND "asset_id" IS NOT NULL AND "safe_failure_code" IS NULL)
    OR ("state" = 'rejected' AND "completed_at" IS NOT NULL
      AND "safe_failure_code" IS NOT NULL
      AND "safe_failure_code" IN (
        'UPLOAD_INCOMPLETE', 'MEDIA_INVALID_FILE',
        'MEDIA_UNSUPPORTED_TYPE', 'MEDIA_LIMIT_EXCEEDED'
      ))
  )
);

CREATE TABLE "media_references" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "asset_id" UUID NOT NULL,
  "work_id" UUID,
  "chapter_page_id" UUID,
  "slot" "media_reference_slot" NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  "retired_at" TIMESTAMPTZ(6),
  CONSTRAINT "media_references_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ck_media_references_target" CHECK (
    ("work_id" IS NOT NULL AND "chapter_page_id" IS NULL
      AND "slot" IN ('work_cover', 'work_background'))
    OR ("work_id" IS NULL AND "chapter_page_id" IS NOT NULL
      AND "slot" = 'chapter_page')
  ),
  CONSTRAINT "ck_media_references_version" CHECK ("version" >= 0)
);

CREATE TABLE "media_reference_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reference_id" UUID NOT NULL,
  "actor_user_id" UUID NOT NULL,
  "action" "media_reference_action" NOT NULL,
  "from_asset_id" UUID,
  "to_asset_id" UUID,
  "result_version" INTEGER NOT NULL,
  "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "media_reference_events_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ck_media_reference_events_action" CHECK (
    ("action" = 'bound' AND "from_asset_id" IS NULL AND "to_asset_id" IS NOT NULL)
    OR ("action" = 'replaced' AND "from_asset_id" IS NOT NULL AND "to_asset_id" IS NOT NULL
      AND "from_asset_id" <> "to_asset_id")
    OR ("action" = 'retired' AND "from_asset_id" IS NOT NULL AND "to_asset_id" IS NULL)
  ),
  CONSTRAINT "ck_media_reference_events_version" CHECK ("result_version" >= 0)
);

CREATE UNIQUE INDEX "media_assets_relative_key_key" ON "media_assets"("relative_key");
CREATE INDEX "media_assets_scope_owner_order_idx"
  ON "media_assets"("scope", "owner_user_id", "created_at" DESC, "id" DESC);
CREATE INDEX "media_assets_class_order_idx"
  ON "media_assets"("media_class", "created_at" DESC, "id" DESC);
CREATE UNIQUE INDEX "upload_attempts_asset_id_key" ON "upload_attempts"("asset_id");
CREATE INDEX "upload_attempts_state_order_idx"
  ON "upload_attempts"("state", "created_at", "actor_user_id", "id");
CREATE INDEX "media_references_asset_active_idx" ON "media_references"("asset_id", "retired_at");
CREATE UNIQUE INDEX "media_references_active_work_slot_key"
  ON "media_references"("work_id", "slot") WHERE "retired_at" IS NULL AND "work_id" IS NOT NULL;
CREATE UNIQUE INDEX "media_references_active_page_key"
  ON "media_references"("chapter_page_id") WHERE "retired_at" IS NULL AND "chapter_page_id" IS NOT NULL;
CREATE UNIQUE INDEX "media_reference_events_reference_id_result_version_key"
  ON "media_reference_events"("reference_id", "result_version");

ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_user_id_fkey"
  FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_user_id_fkey"
  FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "upload_attempts" ADD CONSTRAINT "upload_attempts_actor_user_id_fkey"
  FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "upload_attempts" ADD CONSTRAINT "upload_attempts_asset_id_fkey"
  FOREIGN KEY ("asset_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "media_references" ADD CONSTRAINT "media_references_asset_id_fkey"
  FOREIGN KEY ("asset_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "media_references" ADD CONSTRAINT "media_references_work_id_fkey"
  FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "media_references" ADD CONSTRAINT "media_references_chapter_page_id_fkey"
  FOREIGN KEY ("chapter_page_id") REFERENCES "chapter_pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "media_reference_events" ADD CONSTRAINT "media_reference_events_reference_id_fkey"
  FOREIGN KEY ("reference_id") REFERENCES "media_references"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "media_reference_events" ADD CONSTRAINT "media_reference_events_actor_user_id_fkey"
  FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "media_reference_events" ADD CONSTRAINT "media_reference_events_from_asset_id_fkey"
  FOREIGN KEY ("from_asset_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "media_reference_events" ADD CONSTRAINT "media_reference_events_to_asset_id_fkey"
  FOREIGN KEY ("to_asset_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

BEGIN;

-- Existing publications need an explicit editorial repair or return to draft.
-- A failed check rolls this migration back without changing their history.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM works w
    WHERE w.publication_status = 'published'
      AND (
        btrim(w.title) = ''
        OR w.synopsis IS NULL OR char_length(btrim(w.synopsis)) < 20
        OR w.author IS NULL OR btrim(w.author) = ''
        OR NOT EXISTS (
          SELECT 1 FROM work_categories wc
          JOIN categories c ON c.id = wc.category_id
          WHERE wc.work_id = w.id AND c.enabled
        )
        OR NOT EXISTS (
          SELECT 1 FROM media_references r
          JOIN media_assets a ON a.id = r.asset_id
          WHERE r.work_id = w.id AND r.slot = 'work_cover'
            AND r.retired_at IS NULL AND a.media_class = 'work_cover'
            AND a.scope = 'admin' AND a.status = 'available'
        )
      )
  ) THEN
    RAISE EXCEPTION 'published work inventory requires remediation'
      USING ERRCODE = '23514', CONSTRAINT = 'ck_works_published_ready';
  END IF;
END;
$$;

CREATE FUNCTION assert_published_work_ready(p_work_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  current_work works%ROWTYPE;
BEGIN
  SELECT * INTO current_work FROM works WHERE id = p_work_id FOR UPDATE;
  IF NOT FOUND OR current_work.publication_status <> 'published' THEN
    RETURN;
  END IF;
  IF btrim(current_work.title) = ''
    OR current_work.synopsis IS NULL
    OR char_length(btrim(current_work.synopsis)) < 20
    OR current_work.author IS NULL
    OR btrim(current_work.author) = ''
    OR NOT EXISTS (
      SELECT 1 FROM work_categories wc
      JOIN categories c ON c.id = wc.category_id
      WHERE wc.work_id = p_work_id AND c.enabled
    )
    OR NOT EXISTS (
      SELECT 1 FROM media_references r
      JOIN media_assets a ON a.id = r.asset_id
      WHERE r.work_id = p_work_id AND r.slot = 'work_cover'
        AND r.retired_at IS NULL AND a.media_class = 'work_cover'
        AND a.scope = 'admin' AND a.status = 'available'
    )
  THEN
    RAISE EXCEPTION 'published work is not ready'
      USING ERRCODE = '23514', CONSTRAINT = 'ck_works_published_ready';
  END IF;
END;
$$;

CREATE FUNCTION check_work_published_ready()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM assert_published_work_ready(NEW.id);
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER trg_works_published_ready
AFTER INSERT OR UPDATE OF title, synopsis, author, publication_status ON works
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_work_published_ready();

CREATE FUNCTION check_work_category_published_ready()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP <> 'INSERT' THEN
    PERFORM assert_published_work_ready(OLD.work_id);
  END IF;
  IF TG_OP <> 'DELETE' THEN
    PERFORM assert_published_work_ready(NEW.work_id);
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER trg_work_categories_published_ready
AFTER INSERT OR UPDATE OR DELETE ON work_categories
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_work_category_published_ready();

CREATE FUNCTION check_category_published_ready()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  affected_work_id UUID;
BEGIN
  IF OLD.enabled IS DISTINCT FROM NEW.enabled THEN
    FOR affected_work_id IN
      SELECT work_id FROM work_categories WHERE category_id = NEW.id ORDER BY work_id
    LOOP
      PERFORM assert_published_work_ready(affected_work_id);
    END LOOP;
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER trg_categories_published_ready
AFTER UPDATE OF enabled ON categories
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_category_published_ready();

CREATE FUNCTION check_cover_reference_published_ready()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP <> 'INSERT' AND OLD.slot = 'work_cover' AND OLD.work_id IS NOT NULL THEN
    PERFORM assert_published_work_ready(OLD.work_id);
  END IF;
  IF TG_OP <> 'DELETE' AND NEW.slot = 'work_cover' AND NEW.work_id IS NOT NULL THEN
    PERFORM assert_published_work_ready(NEW.work_id);
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER trg_cover_references_published_ready
AFTER INSERT OR UPDATE OR DELETE ON media_references
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_cover_reference_published_ready();

CREATE FUNCTION check_cover_asset_published_ready()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  affected_work_id UUID;
BEGIN
  -- Reconciliation may record verified missing bytes. Public reads must then fail closed.
  IF TG_OP = 'UPDATE' AND OLD.status = 'available' AND NEW.status = 'unavailable'
    AND (to_jsonb(NEW) - 'status') = (to_jsonb(OLD) - 'status')
  THEN
    RETURN NULL;
  END IF;
  FOR affected_work_id IN
    SELECT DISTINCT work_id FROM media_references
    WHERE asset_id = OLD.id AND slot = 'work_cover'
      AND retired_at IS NULL AND work_id IS NOT NULL
    ORDER BY work_id
  LOOP
    PERFORM assert_published_work_ready(affected_work_id);
  END LOOP;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER trg_cover_assets_published_ready
AFTER UPDATE OR DELETE ON media_assets
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_cover_asset_published_ready();

COMMIT;

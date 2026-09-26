BEGIN;

CREATE FUNCTION enforce_work_category_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Match content commands' eligibility lock before the parent Work lock.
  PERFORM pg_advisory_xact_lock(5380033990110::BIGINT);
  -- Serialize membership additions for one Work before counting committed links.
  PERFORM 1 FROM works WHERE id = NEW.work_id FOR UPDATE;
  IF EXISTS (
    SELECT 1 FROM work_categories
    WHERE work_id = NEW.work_id AND category_id = NEW.category_id
  ) THEN
    RETURN NEW;
  END IF;
  IF (
    SELECT count(*) FROM work_categories WHERE work_id = NEW.work_id
  ) >= 100 THEN
    RAISE EXCEPTION 'work category limit exceeded'
      USING ERRCODE = 'PZ100', CONSTRAINT = 'ck_work_categories_max_100';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_work_categories_max_100
BEFORE INSERT OR UPDATE OF work_id ON work_categories
FOR EACH ROW EXECUTE FUNCTION enforce_work_category_limit();

COMMIT;

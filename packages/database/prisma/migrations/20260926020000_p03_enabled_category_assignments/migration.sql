BEGIN;

CREATE FUNCTION lock_category_assignment_eligibility()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(5380033990110::BIGINT);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_categories_assignment_eligibility_lock
BEFORE UPDATE OF enabled ON categories
FOR EACH ROW EXECUTE FUNCTION lock_category_assignment_eligibility();

CREATE FUNCTION enforce_enabled_category_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  category_enabled BOOLEAN;
BEGIN
  IF TG_OP = 'UPDATE'
    AND OLD.work_id = NEW.work_id
    AND OLD.category_id = NEW.category_id
  THEN
    RETURN NEW;
  END IF;
  PERFORM pg_advisory_xact_lock(5380033990110::BIGINT);
  SELECT enabled INTO category_enabled
  FROM categories WHERE id = NEW.category_id FOR SHARE;
  IF category_enabled = false THEN
    RAISE EXCEPTION 'disabled category cannot be newly assigned'
      USING ERRCODE = 'PZ101',
            CONSTRAINT = 'ck_work_categories_enabled_assignment';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_work_categories_enabled_assignment
BEFORE INSERT OR UPDATE OF work_id, category_id ON work_categories
FOR EACH ROW EXECUTE FUNCTION enforce_enabled_category_assignment();

COMMIT;

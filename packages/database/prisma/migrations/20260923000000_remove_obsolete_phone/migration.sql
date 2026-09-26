-- P00 retires the obsolete optional phone value after the existing P01 migration.
-- Deploy an application version that no longer reads or writes phone before this migration.
ALTER TABLE "users" DROP COLUMN "phone";

import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { promisify } from "node:util";

import { Pool } from "pg";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const initialMigration = "20260818000000_init_authentication";
const contentMigration = "20260922010000_content_domain_foundation";
const phoneRemovalMigration = "20260923000000_remove_obsolete_phone";
const mediaMigration = "20260923010000_persistent_vps_media";
const p03Migration = "20260925010000_p03_editorial_foundation";

const databaseUrl = (): string => {
  const value = process.env["DATABASE_URL"];
  if (value === undefined || value.length === 0) {
    throw new Error("The Testcontainers DATABASE_URL was not provided.");
  }
  return value;
};

const deployFrom = async (
  connectionString: string,
  configPath: string,
): Promise<string> => {
  const pnpmScript = process.env["npm_execpath"];
  if (pnpmScript === undefined) throw new Error("npm_execpath is required.");
  try {
    const execution = await execFileAsync(
      process.execPath,
      [
        pnpmScript,
        "exec",
        "prisma",
        "migrate",
        "deploy",
        "--config",
        configPath,
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, DATABASE_URL: connectionString },
        timeout: 120_000,
        windowsHide: true,
      },
    );
    return execution.stdout + execution.stderr;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "stderr" in error &&
      typeof error.stderr === "string"
    ) {
      throw new Error(error.stderr);
    }
    throw error;
  }
};

const resolveRolledBackFrom = async (
  connectionString: string,
  configPath: string,
  migration: string,
): Promise<string> => {
  const pnpmScript = process.env["npm_execpath"];
  if (pnpmScript === undefined) throw new Error("npm_execpath is required.");
  const execution = await execFileAsync(
    process.execPath,
    [
      pnpmScript,
      "exec",
      "prisma",
      "migrate",
      "resolve",
      "--rolled-back",
      migration,
      "--config",
      configPath,
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env, DATABASE_URL: connectionString },
      timeout: 120_000,
      windowsHide: true,
    },
  );
  return execution.stdout + execution.stderr;
};

describe("fresh post-P01 migration chain", () => {
  it("creates exactly the required application tables, columns, and indexes", async () => {
    const pool = new Pool({ connectionString: databaseUrl() });
    try {
      const tables = await pool.query<{ table_name: string }>(
        `SELECT table_name
           FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            AND table_name <> '_prisma_migrations'
          ORDER BY table_name`,
      );
      expect(tables.rows.map(({ table_name }) => table_name)).toEqual([
        "categories",
        "chapter_pages",
        "chapters",
        "media_assets",
        "media_reference_events",
        "media_references",
        "publication_events",
        "refresh_tokens",
        "upload_attempts",
        "users",
        "work_categories",
        "work_tags",
        "works",
      ]);

      const editorialColumns = await pool.query<{
        table_name: string;
        column_name: string;
        is_nullable: string;
        column_default: string | null;
      }>(
        `SELECT table_name, column_name, is_nullable, column_default
           FROM information_schema.columns
          WHERE table_schema = 'public'
            AND (
              (table_name = 'categories' AND column_name IN ('enabled', 'display_position'))
              OR (table_name = 'works' AND column_name IN (
                'alternative_title', 'synopsis', 'author', 'artist',
                'featured_home', 'featured_order'
              ))
              OR table_name = 'work_tags'
            )
          ORDER BY table_name, ordinal_position`,
      );
      expect(editorialColumns.rows).toEqual([
        {
          table_name: "categories",
          column_name: "enabled",
          is_nullable: "NO",
          column_default: "true",
        },
        {
          table_name: "categories",
          column_name: "display_position",
          is_nullable: "NO",
          column_default: "next_category_display_position()",
        },
        {
          table_name: "work_tags",
          column_name: "work_id",
          is_nullable: "NO",
          column_default: null,
        },
        {
          table_name: "work_tags",
          column_name: "normalized_tag",
          is_nullable: "NO",
          column_default: null,
        },
        {
          table_name: "work_tags",
          column_name: "position",
          is_nullable: "NO",
          column_default: null,
        },
        {
          table_name: "works",
          column_name: "alternative_title",
          is_nullable: "YES",
          column_default: null,
        },
        {
          table_name: "works",
          column_name: "synopsis",
          is_nullable: "YES",
          column_default: null,
        },
        {
          table_name: "works",
          column_name: "author",
          is_nullable: "YES",
          column_default: null,
        },
        {
          table_name: "works",
          column_name: "artist",
          is_nullable: "YES",
          column_default: null,
        },
        {
          table_name: "works",
          column_name: "featured_home",
          is_nullable: "NO",
          column_default: "false",
        },
        {
          table_name: "works",
          column_name: "featured_order",
          is_nullable: "YES",
          column_default: null,
        },
      ]);

      const columns = await pool.query<{
        table_name: string;
        column_name: string;
      }>(
        `SELECT table_name, column_name
           FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name IN ('users', 'refresh_tokens')
          ORDER BY table_name, ordinal_position`,
      );
      const userColumns = columns.rows
        .filter(({ table_name }) => table_name === "users")
        .map(({ column_name }) => column_name);
      const refreshTokenColumns = columns.rows
        .filter(({ table_name }) => table_name === "refresh_tokens")
        .map(({ column_name }) => column_name);
      expect(userColumns).toEqual([
        "id",
        "email",
        "password_hash",
        "full_name",
        "role",
        "status",
        "email_verified_at",
        "verification_token_hash",
        "verification_token_expires_at",
        "reset_token_hash",
        "reset_token_expires_at",
        "created_at",
        "updated_at",
      ]);
      expect(refreshTokenColumns).toEqual([
        "id",
        "user_id",
        "token_hash",
        "expires_at",
        "created_at",
      ]);

      const indexes = await pool.query<{ indexname: string }>(
        `SELECT indexname
           FROM pg_indexes
          WHERE schemaname = 'public'
            AND indexname IN (
              'users_status_role_idx',
              'refresh_tokens_user_idx',
              'refresh_tokens_expiry_idx'
            )
          ORDER BY indexname`,
      );
      expect(indexes.rows.map(({ indexname }) => indexname)).toEqual([
        "refresh_tokens_expiry_idx",
        "refresh_tokens_user_idx",
        "users_status_role_idx",
      ]);
    } finally {
      await pool.end();
    }
  });

  it("cascades refresh records and deploys idempotently", async () => {
    const pool = new Pool({ connectionString: databaseUrl() });
    try {
      const deleteRule = await pool.query<{ delete_rule: string }>(
        `SELECT delete_rule
           FROM information_schema.referential_constraints
          WHERE constraint_schema = 'public'
            AND constraint_name = 'refresh_tokens_user_id_fkey'`,
      );
      expect(deleteRule.rows[0]?.delete_rule).toBe("CASCADE");
    } finally {
      await pool.end();
    }

    const pnpmScript = process.env["npm_execpath"];
    if (pnpmScript === undefined) throw new Error("npm_execpath is required.");
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [pnpmScript, "exec", "prisma", "migrate", "deploy"],
      {
        cwd: process.cwd(),
        env: { ...process.env, DATABASE_URL: databaseUrl() },
        timeout: 120_000,
        windowsHide: true,
      },
    );
    expect(`${stdout}${stderr}`).toMatch(
      /No pending migrations|already in sync/iu,
    );
  });

  it("preserves representative account and refresh-token state", async () => {
    const pool = new Pool({ connectionString: databaseUrl() });
    const userId = "11111111-1111-4111-8111-111111111111";
    const tokenId = "22222222-2222-4222-8222-222222222222";
    try {
      await pool.query(
        "INSERT INTO users (id, email, password_hash, full_name, status, email_verified_at, updated_at) VALUES ($1, $2, $3, $4, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        [userId, "migration-preserved@example.com", "hash", "Preserved User"],
      );
      await pool.query(
        "INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP + INTERVAL '1 day')",
        [tokenId, userId, "a".repeat(64)],
      );

      const account = await pool.query<{
        email: string;
        full_name: string;
        token_hash: string;
      }>(
        "SELECT u.email, u.full_name, r.token_hash FROM users u JOIN refresh_tokens r ON r.user_id = u.id WHERE u.id = $1",
        [userId],
      );
      expect(account.rows).toEqual([
        {
          email: "migration-preserved@example.com",
          full_name: "Preserved User",
          token_hash: "a".repeat(64),
        },
      ]);
    } finally {
      await pool.query("DELETE FROM refresh_tokens WHERE id = $1", [tokenId]);
      await pool.query("DELETE FROM users WHERE id = $1", [userId]);
      await pool.end();
    }
  });

  it("retires legacy phone after a populated P01 upgrade without losing account or session data", async () => {
    const sourcePrisma = resolve(process.cwd(), "prisma");
    const cacheRoot = resolve(process.cwd(), "node_modules", ".cache");
    await mkdir(cacheRoot, { recursive: true });
    const temporaryRoot = await mkdtemp(join(cacheRoot, "p01-upgrade-"));
    const temporaryMigrations = join(temporaryRoot, "migrations");
    const databaseName =
      "p01_upgrade_" + String(process.pid) + "_" + String(Date.now());
    const adminPool = new Pool({ connectionString: databaseUrl() });
    const stagedUrl = new URL(databaseUrl());
    stagedUrl.pathname = "/" + databaseName;
    let stagedPool: Pool | undefined;
    if (!temporaryRoot.startsWith(cacheRoot + sep)) {
      throw new Error("Temporary migration path escaped the package cache.");
    }

    try {
      await adminPool.query(`CREATE DATABASE "${databaseName}"`);
      await mkdir(temporaryMigrations, { recursive: true });
      await cp(
        join(sourcePrisma, "migrations", initialMigration),
        join(temporaryMigrations, initialMigration),
        { recursive: true },
      );
      await writeFile(
        join(temporaryRoot, "prisma.config.ts"),
        `import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "schema.prisma",
  migrations: { path: "migrations" },
  datasource: { url: env("DATABASE_URL") },
});
`,
      );
      await writeFile(
        join(temporaryRoot, "schema.prisma"),
        await readFile(join(sourcePrisma, "schema.prisma"), "utf8"),
      );

      await deployFrom(
        stagedUrl.toString(),
        join(temporaryRoot, "prisma.config.ts"),
      );
      stagedPool = new Pool({ connectionString: stagedUrl.toString() });
      const userId = "99999999-9999-4999-8999-999999999999";
      const tokenId = "88888888-8888-4888-8888-888888888888";
      await stagedPool.query(
        "INSERT INTO users (id, email, password_hash, full_name, phone, status, email_verified_at, updated_at) VALUES ($1, $2, $3, $4, $5, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        [
          userId,
          "staged-upgrade@example.com",
          "hash",
          "Staged User",
          "+201000000000",
        ],
      );
      await stagedPool.query(
        "INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP + INTERVAL '1 day')",
        [tokenId, userId, "b".repeat(64)],
      );

      await cp(
        join(sourcePrisma, "migrations", contentMigration),
        join(temporaryMigrations, contentMigration),
        { recursive: true },
      );
      await deployFrom(
        stagedUrl.toString(),
        join(temporaryRoot, "prisma.config.ts"),
      );
      const categoryIds = [
        "33333333-3333-4333-8333-333333333333",
        "11111111-1111-4111-8111-111111111111",
        "22222222-2222-4222-8222-222222222222",
      ] as const;
      await stagedPool.query(
        `INSERT INTO categories
           (id, display_name, slug, created_at, updated_at)
         VALUES
           ($1, 'Third Inserted', 'legacy-third', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
           ($2, 'First Inserted', 'legacy-first', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
           ($3, 'Second Inserted', 'legacy-second', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z')`,
        categoryIds,
      );
      const draftWorkId = "44444444-4444-4444-8444-444444444444";
      const publishedWorkId = "55555555-5555-4555-8555-555555555555";
      const publicationEventId = "66666666-6666-4666-8666-666666666666";
      await stagedPool.query(
        `INSERT INTO works
           (id, title, slug, type, story_status, created_at, updated_at)
         VALUES
           ($1, 'Legacy Draft', 'legacy-draft', 'manga', 'ongoing', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
           ($2, 'Legacy Published', 'legacy-published', 'novel', 'completed', '2026-01-02T00:00:00Z', '2026-01-02T00:00:00Z')`,
        [draftWorkId, publishedWorkId],
      );
      await stagedPool.query(
        `INSERT INTO work_categories (work_id, category_id)
         VALUES ($1, $2), ($3, $4)`,
        [draftWorkId, categoryIds[1], publishedWorkId, categoryIds[2]],
      );
      const chapterId = "77777777-7777-4777-8777-777777777777";
      await stagedPool.query(
        `INSERT INTO chapters
           (id, work_id, number, content_type, text_content, created_at, updated_at)
         VALUES ($1, $2, 1, 'text', $3::jsonb, '2026-01-03T00:00:00Z', '2026-01-03T00:00:00Z')`,
        [
          chapterId,
          publishedWorkId,
          JSON.stringify({ version: 1, blocks: [] }),
        ],
      );
      const publishedAt = new Date("2026-01-04T00:00:00.000Z");
      await stagedPool.query(
        `INSERT INTO publication_events (id, work_id, occurred_at)
         VALUES ($1, $2, $3)`,
        [publicationEventId, publishedWorkId, publishedAt],
      );
      await stagedPool.query(
        `UPDATE works
            SET publication_status = 'published', published_at = $2,
                current_publication_event_id = $3
          WHERE id = $1`,
        [publishedWorkId, publishedAt, publicationEventId],
      );

      const preserved = await stagedPool.query<{
        email: string;
        full_name: string;
        token_hash: string;
      }>(
        "SELECT u.email, u.full_name, r.token_hash FROM users u JOIN refresh_tokens r ON r.user_id = u.id WHERE u.id = $1",
        [userId],
      );
      expect(preserved.rows).toEqual([
        {
          email: "staged-upgrade@example.com",
          full_name: "Staged User",
          token_hash: "b".repeat(64),
        },
      ]);
      await cp(
        join(sourcePrisma, "migrations", phoneRemovalMigration),
        join(temporaryMigrations, phoneRemovalMigration),
        { recursive: true },
      );
      await deployFrom(
        stagedUrl.toString(),
        join(temporaryRoot, "prisma.config.ts"),
      );
      const retiredPhone = await stagedPool.query<{ column_name: string }>(
        `SELECT column_name
           FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'phone'`,
      );
      expect(retiredPhone.rows).toEqual([]);
      const retainedAccount = await stagedPool.query<{
        email: string;
        full_name: string;
        token_hash: string;
      }>(
        "SELECT u.email, u.full_name, r.token_hash FROM users u JOIN refresh_tokens r ON r.user_id = u.id WHERE u.id = $1",
        [userId],
      );
      expect(retainedAccount.rows).toEqual(preserved.rows);
      await cp(
        join(sourcePrisma, "migrations", mediaMigration),
        join(temporaryMigrations, mediaMigration),
        { recursive: true },
      );
      await deployFrom(
        stagedUrl.toString(),
        join(temporaryRoot, "prisma.config.ts"),
      );
      const mediaTables = await stagedPool.query<{ table_name: string }>(
        `SELECT table_name FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name IN ('media_assets', 'upload_attempts', 'media_references', 'media_reference_events')
          ORDER BY table_name`,
      );
      expect(mediaTables.rows.map(({ table_name }) => table_name)).toEqual([
        "media_assets",
        "media_reference_events",
        "media_references",
        "upload_attempts",
      ]);
      const assetId = "88888888-8888-4888-8888-888888888888";
      const referenceId = "99999999-9999-4999-8999-999999999999";
      await stagedPool.query(
        `INSERT INTO media_assets
           (id, media_class, scope, uploaded_by_user_id, relative_key)
         VALUES ($1, 'work_cover', 'admin', $2, 'legacy-cover.bin')`,
        [assetId, userId],
      );
      await stagedPool.query(
        `INSERT INTO media_references
           (id, asset_id, work_id, slot, updated_at)
         VALUES ($1, $2, $3, 'work_cover', CURRENT_TIMESTAMP)`,
        [referenceId, assetId, draftWorkId],
      );

      const p03Source = join(sourcePrisma, "migrations", p03Migration);
      const p03Target = join(temporaryMigrations, p03Migration);
      await cp(p03Source, p03Target, { recursive: true });
      const p03File = join(p03Target, "migration.sql");
      const originalP03Sql = await readFile(p03File, "utf8");
      const faultedP03Sql = originalP03Sql.replace(
        /\nCOMMIT;\s*$/u,
        "\nSELECT 1 / 0;\nCOMMIT;\n",
      );
      if (faultedP03Sql === originalP03Sql) {
        throw new Error("The P03 migration fault point was not found.");
      }
      await writeFile(p03File, faultedP03Sql);
      await expect(
        deployFrom(
          stagedUrl.toString(),
          join(temporaryRoot, "prisma.config.ts"),
        ),
      ).rejects.toThrow();

      const failedColumns = await stagedPool.query<{
        table_name: string;
        column_name: string;
      }>(
        `SELECT table_name, column_name
           FROM information_schema.columns
          WHERE table_schema = 'public'
            AND (
              (table_name = 'categories' AND column_name = 'display_position')
              OR (table_name = 'works' AND column_name = 'alternative_title')
            )
          ORDER BY table_name, column_name`,
      );
      const failedTagTable = await stagedPool.query<{ table_name: string }>(
        `SELECT table_name FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'work_tags'`,
      );
      expect(failedColumns.rows).toEqual([]);
      expect(failedTagTable.rows).toEqual([]);

      await resolveRolledBackFrom(
        stagedUrl.toString(),
        join(temporaryRoot, "prisma.config.ts"),
        p03Migration,
      );
      await writeFile(p03File, originalP03Sql);
      await deployFrom(
        stagedUrl.toString(),
        join(temporaryRoot, "prisma.config.ts"),
      );

      const backfilledCategories = await stagedPool.query<{
        id: string;
        display_position: number;
        enabled: boolean;
      }>(
        `SELECT id, display_position, enabled FROM categories
          ORDER BY display_position, id`,
      );
      expect(backfilledCategories.rows).toEqual([
        {
          id: "11111111-1111-4111-8111-111111111111",
          display_position: 1,
          enabled: true,
        },
        {
          id: "22222222-2222-4222-8222-222222222222",
          display_position: 2,
          enabled: true,
        },
        {
          id: "33333333-3333-4333-8333-333333333333",
          display_position: 3,
          enabled: true,
        },
      ]);
      const preservedWorks = await stagedPool.query<{
        id: string;
        slug: string;
        publication_status: string;
        published_at: Date | null;
        current_publication_event_id: string | null;
        alternative_title: string | null;
        synopsis: string | null;
        author: string | null;
        artist: string | null;
        featured_home: boolean;
        featured_order: number | null;
      }>(
        `SELECT id, slug, publication_status, published_at,
                current_publication_event_id, alternative_title, synopsis,
                author, artist, featured_home, featured_order
           FROM works ORDER BY id`,
      );
      expect(preservedWorks.rows).toEqual([
        {
          id: draftWorkId,
          slug: "legacy-draft",
          publication_status: "draft",
          published_at: null,
          current_publication_event_id: null,
          alternative_title: null,
          synopsis: null,
          author: null,
          artist: null,
          featured_home: false,
          featured_order: null,
        },
        {
          id: publishedWorkId,
          slug: "legacy-published",
          publication_status: "published",
          published_at: publishedAt,
          current_publication_event_id: publicationEventId,
          alternative_title: null,
          synopsis: null,
          author: null,
          artist: null,
          featured_home: false,
          featured_order: null,
        },
      ]);
      const retainedRelations = await stagedPool.query<{
        chapter_count: number;
        category_count: number;
        publication_event_count: number;
        tag_count: number;
      }>(
        `SELECT
           (SELECT count(*)::int FROM chapters WHERE id = $1) AS chapter_count,
           (SELECT count(*)::int FROM work_categories WHERE work_id IN ($2, $3)) AS category_count,
           (SELECT count(*)::int FROM publication_events WHERE id = $4) AS publication_event_count,
           (SELECT count(*)::int FROM work_tags WHERE work_id IN ($2, $3)) AS tag_count`,
        [chapterId, draftWorkId, publishedWorkId, publicationEventId],
      );
      expect(retainedRelations.rows[0]).toEqual({
        chapter_count: 1,
        category_count: 2,
        publication_event_count: 1,
        tag_count: 0,
      });
      const retainedMedia = await stagedPool.query<{
        asset_id: string;
        reference_id: string;
        work_id: string;
      }>(
        `SELECT a.id AS asset_id, r.id AS reference_id, r.work_id
           FROM media_assets a
           JOIN media_references r ON r.asset_id = a.id
          WHERE a.id = $1 AND r.id = $2`,
        [assetId, referenceId],
      );
      expect(retainedMedia.rows).toEqual([
        { asset_id: assetId, reference_id: referenceId, work_id: draftWorkId },
      ]);
      const legacyInsert = await stagedPool.query<{
        display_position: number;
      }>(
        `INSERT INTO categories (display_name, slug, updated_at)
         VALUES ('Legacy Compatible', 'legacy-compatible', CURRENT_TIMESTAMP)
         RETURNING display_position`,
      );
      expect(legacyInsert.rows[0]?.display_position).toBe(4);

      const afterMediaAccount = await stagedPool.query<{
        email: string;
        full_name: string;
        token_hash: string;
      }>(
        "SELECT u.email, u.full_name, r.token_hash FROM users u JOIN refresh_tokens r ON r.user_id = u.id WHERE u.id = $1",
        [userId],
      );
      expect(afterMediaAccount.rows).toEqual(preserved.rows);
      const redeployOutput = await deployFrom(
        stagedUrl.toString(),
        join(temporaryRoot, "prisma.config.ts"),
      );
      expect(redeployOutput).toMatch(/No pending migrations|already in sync/iu);
    } finally {
      await stagedPool?.end();
      await adminPool.query(
        `DROP DATABASE IF EXISTS "${databaseName}" WITH (FORCE)`,
      );
      await adminPool.end();
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  }, 180_000);

  it("installs exactly the approved user checks and enforces their data rules", async () => {
    const pool = new Pool({ connectionString: databaseUrl() });
    try {
      const constraints = await pool.query<{ conname: string }>(
        `SELECT conname
           FROM pg_constraint
          WHERE conrelid = 'public.users'::regclass
            AND contype = 'c'
          ORDER BY conname`,
      );
      expect(constraints.rows.map(({ conname }) => conname)).toEqual([
        "ck_users_email_normalized",
        "ck_users_status_timestamps_consistent",
      ]);

      const insert = async (
        email: string,
        status: "ACTIVE" | "PENDING_VERIFICATION",
        verifiedAt: Date | null,
      ) =>
        pool.query(
          `INSERT INTO users
             (email, password_hash, full_name, status, email_verified_at, updated_at)
           VALUES ($1, $2, $3, $4::user_status, $5, CURRENT_TIMESTAMP)
           RETURNING id`,
          [email, "argon2-test-hash", "Migration User", status, verifiedAt],
        );

      await expect(
        insert(" Uppercase@example.com ", "PENDING_VERIFICATION", null),
      ).rejects.toMatchObject({ code: "23514" });
      await expect(
        insert("active@example.com", "ACTIVE", null),
      ).rejects.toMatchObject({ code: "23514" });
      const pending = await insert(
        "pending@example.com",
        "PENDING_VERIFICATION",
        null,
      );
      const active = await insert("verified@example.com", "ACTIVE", new Date());
      expect(pending.rowCount).toBe(1);
      expect(active.rowCount).toBe(1);
      await pool.query(
        `DELETE FROM users
          WHERE email IN ('pending@example.com', 'verified@example.com')`,
      );
    } finally {
      await pool.end();
    }
  });
});

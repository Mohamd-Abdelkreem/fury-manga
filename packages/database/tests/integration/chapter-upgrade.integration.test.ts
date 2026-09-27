import { execFile } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { promisify } from "node:util";

import { Pool } from "pg";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const expandMigration = "20260926030000_p04_chapter_expand";
const enforceMigration = "20260926040000_p04_chapter_enforce";

const databaseUrl = (): string => {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString)
    throw new Error("Testcontainers DATABASE_URL is required.");
  return connectionString;
};

const deployFrom = async (connectionString: string, configPath: string) => {
  const pnpmScript = process.env["npm_execpath"];
  if (!pnpmScript) throw new Error("npm_execpath is required.");
  return execFileAsync(
    process.execPath,
    [pnpmScript, "exec", "prisma", "migrate", "deploy", "--config", configPath],
    {
      cwd: process.cwd(),
      env: { ...process.env, DATABASE_URL: connectionString },
      timeout: 120_000,
      windowsHide: true,
    },
  );
};

const resolveFailedMigration = async (
  connectionString: string,
  configPath: string,
  migrationName: string,
) => {
  const pnpmScript = process.env["npm_execpath"];
  if (!pnpmScript) throw new Error("npm_execpath is required.");
  await execFileAsync(
    process.execPath,
    [
      pnpmScript,
      "exec",
      "prisma",
      "migrate",
      "resolve",
      "--rolled-back",
      migrationName,
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
};

describe("P04 staged Chapter upgrade", () => {
  it("installs required title and active page identity on a fresh database", async () => {
    const pool = new Pool({ connectionString: databaseUrl() });
    try {
      const columns = await pool.query<{
        table_name: string;
        column_name: string;
        is_nullable: string;
      }>(
        `SELECT table_name, column_name, is_nullable
           FROM information_schema.columns
          WHERE table_schema = 'public'
            AND ((table_name = 'chapters' AND column_name = 'title')
              OR (table_name = 'chapter_pages' AND column_name = 'retired_at'))
          ORDER BY table_name`,
      );
      expect(columns.rows).toEqual([
        {
          table_name: "chapter_pages",
          column_name: "retired_at",
          is_nullable: "YES",
        },
        { table_name: "chapters", column_name: "title", is_nullable: "NO" },
      ]);
      const indexes = await pool.query<{ indexname: string }>(
        `SELECT indexname FROM pg_indexes
          WHERE tablename = 'chapter_pages' AND indexname IN
            ('chapter_pages_chapter_id_position_key', 'chapter_pages_active_position_key')
          ORDER BY indexname`,
      );
      expect(indexes.rows.map(({ indexname }) => indexname)).toEqual([
        "chapter_pages_active_position_key",
      ]);
    } finally {
      await pool.end();
    }
  });

  it("preserves populated P01–P03 rows through failed, recovered, and repeated expand deploys", async () => {
    const sourcePrisma = resolve(process.cwd(), "prisma");
    const cacheRoot = resolve(process.cwd(), "node_modules", ".cache");
    await mkdir(cacheRoot, { recursive: true });
    const temporaryRoot = await mkdtemp(join(cacheRoot, "p04-expand-"));
    if (!temporaryRoot.startsWith(cacheRoot + sep)) {
      throw new Error("Temporary migration path escaped the package cache.");
    }
    const migrationsPath = join(temporaryRoot, "migrations");
    const configPath = join(temporaryRoot, "prisma.config.ts");
    const databaseName = `p04_expand_${randomUUID().replaceAll("-", "")}`;
    const snapshotPath = `/tmp/${databaseName}.dump`;
    const stagedUrl = new URL(databaseUrl());
    stagedUrl.pathname = `/${databaseName}`;
    const adminPool = new Pool({ connectionString: databaseUrl() });
    let stagedPool: Pool | undefined;
    const containerId = process.env["TEST_DATABASE_CONTAINER_ID"];
    if (!containerId)
      throw new Error("Test database container ID is required.");

    try {
      await adminPool.query(`CREATE DATABASE "${databaseName}"`);
      await mkdir(migrationsPath);
      const migrationNames = (await readdir(join(sourcePrisma, "migrations")))
        .filter(
          (name) =>
            /^\d+_/.test(name) &&
            name !== expandMigration &&
            name !== enforceMigration,
        )
        .sort();
      for (const migrationName of migrationNames) {
        await cp(
          join(sourcePrisma, "migrations", migrationName),
          join(migrationsPath, migrationName),
          { recursive: true },
        );
      }
      await writeFile(
        configPath,
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
      await deployFrom(stagedUrl.toString(), configPath);
      stagedPool = new Pool({ connectionString: stagedUrl.toString() });

      const actorId = randomUUID();
      const workId = randomUUID();
      const textWorkId = randomUUID();
      const chapterId = randomUUID();
      const textChapterId = randomUUID();
      const boundPageId = randomUUID();
      const unboundPageId = randomUUID();
      const assetId = randomUUID();
      const referenceId = randomUUID();
      const eventId = randomUUID();
      const mediaBytes = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==",
        "base64",
      );
      const mediaHash = createHash("sha256").update(mediaBytes).digest("hex");
      const mediaSource = join(temporaryRoot, "private-media-source");
      const mediaRestore = join(temporaryRoot, "private-media-restore");
      await mkdir(mediaSource);
      await writeFile(join(mediaSource, `p04-${assetId}`), mediaBytes);
      await stagedPool.query(
        `INSERT INTO users (id, email, password_hash, full_name, status, email_verified_at, updated_at)
         VALUES ($1, $2, 'hash', 'P04 migration actor', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [actorId, `p04-${actorId}@example.com`],
      );
      await stagedPool.query(
        `INSERT INTO works (id, title, slug, type, story_status, updated_at)
         VALUES ($1, 'Legacy illustrated work', $2, 'manga', 'ongoing', CURRENT_TIMESTAMP),
                ($3, 'Legacy text work', $4, 'novel', 'ongoing', CURRENT_TIMESTAMP)`,
        [workId, `p04-${workId}`, textWorkId, `p04-${textWorkId}`],
      );
      await stagedPool.query(
        `INSERT INTO chapters (id, work_id, number, content_type, updated_at)
         VALUES ($1, $2, 1, 'illustrated', CURRENT_TIMESTAMP)`,
        [chapterId, workId],
      );
      await stagedPool.query(
        `INSERT INTO chapters (id, work_id, number, content_type, text_content, updated_at)
         VALUES ($1, $2, 1, 'text', $3::jsonb, CURRENT_TIMESTAMP)`,
        [
          textChapterId,
          textWorkId,
          JSON.stringify({
            version: 1,
            blocks: [{ type: "paragraph", children: [{ text: "Legacy" }] }],
          }),
        ],
      );
      await stagedPool.query(
        `INSERT INTO chapter_pages (id, chapter_id, position) VALUES ($1, $3, 1), ($2, $3, 2)`,
        [boundPageId, unboundPageId, chapterId],
      );
      await stagedPool.query(
        `INSERT INTO media_assets
           (id, media_class, scope, uploaded_by_user_id, relative_key, content_type,
            byte_length, width, height, sha256, status, available_at)
         VALUES ($1, 'chapter_page', 'admin', $2, $3, 'image/png', $4, 1, 1,
                 $5, 'available', CURRENT_TIMESTAMP)`,
        [assetId, actorId, `p04-${assetId}`, mediaBytes.length, mediaHash],
      );
      await stagedPool.query(
        `INSERT INTO media_references (id, asset_id, chapter_page_id, slot, updated_at)
         VALUES ($1, $2, $3, 'chapter_page', CURRENT_TIMESTAMP)`,
        [referenceId, assetId, boundPageId],
      );
      await stagedPool.query(
        `INSERT INTO media_reference_events
           (reference_id, actor_user_id, action, to_asset_id, result_version)
         VALUES ($1, $2, 'bound', $3, 0)`,
        [referenceId, actorId, assetId],
      );
      await stagedPool.query(
        `INSERT INTO publication_events (id, chapter_id) VALUES ($1, $2)`,
        [eventId, textChapterId],
      );
      await execFileAsync("docker", [
        "exec",
        containerId,
        "pg_dump",
        "-U",
        "fury_test",
        "-d",
        databaseName,
        "-Fc",
        "-f",
        snapshotPath,
      ]);
      const backupHash = await execFileAsync("docker", [
        "exec",
        containerId,
        "sha256sum",
        snapshotPath,
      ]);
      expect(backupHash.stdout).toMatch(/^[a-f0-9]{64}\s/iu);
      await cp(mediaSource, mediaRestore, { recursive: true });
      expect(
        createHash("sha256")
          .update(await readFile(join(mediaRestore, `p04-${assetId}`)))
          .digest("hex"),
      ).toBe(mediaHash);
      await stagedPool.end();
      stagedPool = undefined;
      await adminPool.query(`DROP DATABASE "${databaseName}" WITH (FORCE)`);
      await adminPool.query(`CREATE DATABASE "${databaseName}"`);
      await execFileAsync("docker", [
        "exec",
        containerId,
        "pg_restore",
        "-U",
        "fury_test",
        "-d",
        databaseName,
        "--no-owner",
        "--no-privileges",
        snapshotPath,
      ]);
      stagedPool = new Pool({ connectionString: stagedUrl.toString() });
      const restoredIdentity = await stagedPool.query<{
        chapter_id: string;
        page_id: string;
        reference_id: string;
        event_id: string;
      }>(
        `SELECT c.id AS chapter_id, p.id AS page_id, r.id AS reference_id,
                (SELECT id FROM publication_events WHERE chapter_id = $2) AS event_id
           FROM chapters c JOIN chapter_pages p ON p.chapter_id = c.id
           JOIN media_references r ON r.chapter_page_id = p.id
          WHERE c.id = $1 AND p.id = $3`,
        [chapterId, textChapterId, boundPageId],
      );
      expect(restoredIdentity.rows).toEqual([
        {
          chapter_id: chapterId,
          page_id: boundPageId,
          reference_id: referenceId,
          event_id: eventId,
        },
      ]);
      const before = await stagedPool.query<{
        missing_titles: number;
        unbound_pages: number;
      }>(
        `SELECT (SELECT count(*)::int FROM chapters) AS missing_titles,
                (SELECT count(*)::int FROM chapter_pages p
                  WHERE NOT EXISTS (SELECT 1 FROM media_references r
                    WHERE r.chapter_page_id = p.id AND r.retired_at IS NULL)) AS unbound_pages`,
      );
      expect(before.rows).toEqual([{ missing_titles: 2, unbound_pages: 1 }]);
      await expect(
        stagedPool.query(
          `UPDATE chapters SET text_content = NULL WHERE id = $1`,
          [textChapterId],
        ),
      ).rejects.toMatchObject({ code: "23514" });

      const failedPath = join(migrationsPath, expandMigration);
      await mkdir(failedPath);
      await writeFile(
        join(failedPath, "migration.sql"),
        `BEGIN; ALTER TABLE chapters ADD COLUMN title VARCHAR(200); SELECT 1 / 0; COMMIT;`,
      );
      await expect(
        deployFrom(stagedUrl.toString(), configPath),
      ).rejects.toThrow();
      const absentColumn = await stagedPool.query<{ count: number }>(
        `SELECT count(*)::int AS count FROM information_schema.columns
          WHERE table_name = 'chapters' AND column_name = 'title'`,
      );
      expect(absentColumn.rows[0]?.count).toBe(0);
      await resolveFailedMigration(
        stagedUrl.toString(),
        configPath,
        expandMigration,
      );
      await writeFile(
        join(failedPath, "migration.sql"),
        await readFile(
          join(sourcePrisma, "migrations", expandMigration, "migration.sql"),
          "utf8",
        ),
      );
      const deployed = await deployFrom(stagedUrl.toString(), configPath);
      expect(deployed.stdout + deployed.stderr).toContain(expandMigration);
      const applied = await stagedPool.query<{ migration_name: string }>(
        `SELECT migration_name FROM _prisma_migrations
          WHERE finished_at IS NOT NULL AND migration_name LIKE '%p04%'
          ORDER BY migration_name`,
      );
      expect(applied.rows).toEqual([{ migration_name: expandMigration }]);
      const mediaEvents = await stagedPool.query<{ count: number }>(
        `SELECT count(*)::int AS count FROM media_reference_events
          WHERE reference_id = $1`,
        [referenceId],
      );
      expect(mediaEvents.rows).toEqual([{ count: 1 }]);
      const retained = await stagedPool.query<{
        id: string;
        title: string | null;
        page_id: string;
        reference_id: string;
        event_id: string;
      }>(
        `SELECT c.id, c.title, p.id AS page_id, r.id AS reference_id,
                (SELECT id FROM publication_events WHERE chapter_id = $2) AS event_id
           FROM chapters c JOIN chapter_pages p ON p.chapter_id = c.id
           JOIN media_references r ON r.chapter_page_id = p.id
          WHERE c.id = $1`,
        [chapterId, textChapterId],
      );
      expect(retained.rows).toEqual([
        {
          id: chapterId,
          title: null,
          page_id: boundPageId,
          reference_id: referenceId,
          event_id: eventId,
        },
      ]);
      const after = await stagedPool.query<{
        missing_titles: number;
        unbound_pages: number;
      }>(
        `SELECT (SELECT count(*)::int FROM chapters WHERE title IS NULL) AS missing_titles,
                (SELECT count(*)::int FROM chapter_pages p
                  WHERE NOT EXISTS (SELECT 1 FROM media_references r
                    WHERE r.chapter_page_id = p.id AND r.retired_at IS NULL)) AS unbound_pages`,
      );
      expect(after.rows).toEqual(before.rows);
      await stagedPool.query(
        `UPDATE chapters SET text_content = NULL WHERE id = $1`,
        [textChapterId],
      );
      await expect(
        stagedPool.query(
          `UPDATE chapters SET publication_status = 'published',
                  published_at = CURRENT_TIMESTAMP,
                  current_publication_event_id = $2 WHERE id = $1`,
          [textChapterId, eventId],
        ),
      ).rejects.toMatchObject({ code: "23514" });
      await stagedPool.query(
        `UPDATE chapter_pages SET retired_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [boundPageId],
      );
      await stagedPool.query(
        `INSERT INTO chapter_pages (chapter_id, position) VALUES ($1, 1)`,
        [chapterId],
      );
      await expect(
        stagedPool.query(
          `INSERT INTO chapter_pages (chapter_id, position) VALUES ($1, 1)`,
          [chapterId],
        ),
      ).rejects.toMatchObject({ code: "23505" });
      const repeated = await deployFrom(stagedUrl.toString(), configPath);
      expect(repeated.stdout + repeated.stderr).toMatch(
        /No pending migrations|already in sync/iu,
      );

      await cp(
        join(sourcePrisma, "migrations", enforceMigration),
        join(migrationsPath, enforceMigration),
        { recursive: true },
      );
      await expect(
        deployFrom(stagedUrl.toString(), configPath),
      ).rejects.toThrow();
      const stillNullable = await stagedPool.query<{ is_nullable: string }>(
        `SELECT is_nullable FROM information_schema.columns
          WHERE table_name = 'chapters' AND column_name = 'title'`,
      );
      expect(stillNullable.rows[0]?.is_nullable).toBe("YES");
      await resolveFailedMigration(
        stagedUrl.toString(),
        configPath,
        enforceMigration,
      );

      // Fixture decisions: supply authored sample titles/content, retire the
      // unbound pages, and reactivate the original referenced page.
      await stagedPool.query(
        `UPDATE chapters SET title = CASE id
          WHEN $1 THEN 'Synthetic illustrated chapter'
          ELSE 'Synthetic text chapter' END
          WHERE id IN ($1, $2)`,
        [chapterId, textChapterId],
      );
      await stagedPool.query(
        `UPDATE chapters SET text_content = $2::jsonb WHERE id = $1`,
        [
          textChapterId,
          JSON.stringify({
            version: 1,
            blocks: [{ type: "paragraph", content: [{ text: "Synthetic" }] }],
          }),
        ],
      );
      await stagedPool.query(
        `UPDATE chapter_pages SET retired_at = CURRENT_TIMESTAMP
          WHERE chapter_id = $1 AND id <> $2 AND retired_at IS NULL`,
        [chapterId, boundPageId],
      );
      await stagedPool.query(
        `UPDATE chapter_pages SET retired_at = NULL WHERE id = $1`,
        [boundPageId],
      );
      await stagedPool.query(
        `UPDATE chapters SET publication_status = 'published',
                published_at = e.occurred_at,
                current_publication_event_id = e.id
           FROM publication_events e WHERE chapters.id = $1 AND e.id = $2`,
        [textChapterId, eventId],
      );
      const illustratedEventId = randomUUID();
      await stagedPool.query(
        `INSERT INTO publication_events (id, chapter_id) VALUES ($1, $2)`,
        [illustratedEventId, chapterId],
      );
      await stagedPool.query(
        `UPDATE chapters SET publication_status = 'published',
                published_at = e.occurred_at,
                current_publication_event_id = e.id
           FROM publication_events e WHERE chapters.id = $1 AND e.id = $2`,
        [chapterId, illustratedEventId],
      );
      const unresolved = await stagedPool.query<{ count: number }>(
        `SELECT count(*)::int AS count FROM chapters WHERE title IS NULL
         UNION ALL
         SELECT count(*)::int FROM chapter_pages p
          WHERE p.retired_at IS NULL AND NOT EXISTS (
            SELECT 1 FROM media_references r
             WHERE r.chapter_page_id = p.id AND r.retired_at IS NULL)`,
      );
      expect(unresolved.rows.map(({ count }) => count)).toEqual([0, 0]);
      const pnpmScript = process.env["npm_execpath"];
      if (!pnpmScript) throw new Error("npm_execpath is required.");
      const inventory = await execFileAsync(
        process.execPath,
        [pnpmScript, "--filter", "@fury/api", "chapter:inventory"],
        {
          cwd: resolve(process.cwd(), "../.."),
          env: { ...process.env, DATABASE_URL: stagedUrl.toString() },
          timeout: 120_000,
          windowsHide: true,
        },
      );
      expect(inventory.stdout).toContain('"checked":1');
      expect(inventory.stdout).toContain('"invalidIds":[]');
      const enforced = await deployFrom(stagedUrl.toString(), configPath);
      expect(enforced.stdout + enforced.stderr).toContain(enforceMigration);
      const finalColumn = await stagedPool.query<{ is_nullable: string }>(
        `SELECT is_nullable FROM information_schema.columns
          WHERE table_name = 'chapters' AND column_name = 'title'`,
      );
      expect(finalColumn.rows[0]?.is_nullable).toBe("NO");
      await expect(
        stagedPool.query(
          `UPDATE chapter_pages SET position = 4 WHERE id = $1`,
          [boundPageId],
        ),
      ).rejects.toMatchObject({ code: "23514" });
      await expect(
        stagedPool.query(
          `UPDATE media_references SET retired_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [referenceId],
        ),
      ).rejects.toMatchObject({ code: "23514" });
      await expect(
        stagedPool.query(
          `UPDATE media_references SET chapter_page_id = $2 WHERE id = $1`,
          [referenceId, unboundPageId],
        ),
      ).rejects.toMatchObject({ code: "23514" });
      await expect(
        stagedPool.query(
          `UPDATE media_assets SET media_class = 'work_cover' WHERE id = $1`,
          [assetId],
        ),
      ).rejects.toMatchObject({ code: "23514" });
      const finalState = await stagedPool.query<{
        page_id: string;
        reference_id: string;
        event_id: string;
      }>(
        `SELECT p.id AS page_id, r.id AS reference_id,
                (SELECT id FROM publication_events WHERE chapter_id = $2) AS event_id
           FROM chapter_pages p JOIN media_references r ON r.chapter_page_id = p.id
          WHERE p.chapter_id = $1 AND p.retired_at IS NULL AND r.retired_at IS NULL`,
        [chapterId, textChapterId],
      );
      expect(finalState.rows).toEqual([
        { page_id: boundPageId, reference_id: referenceId, event_id: eventId },
      ]);
      const violations = await stagedPool.query<{ count: number }>(
        `SELECT (
          (SELECT count(*) FROM chapters c WHERE c.title IS NULL OR btrim(c.title) = '')
          + (SELECT count(*) FROM chapters c JOIN works w ON w.id = c.work_id
             WHERE (w.type IN ('manga','manhwa','manhua','comics') AND c.content_type <> 'illustrated')
                OR (w.type IN ('novel','text-story') AND c.content_type <> 'text'))
          + (SELECT count(*) FROM chapters c
             WHERE c.publication_status = 'published' AND c.content_type = 'text'
               AND (c.text_content IS NULL OR c.text_content->>'version' IS DISTINCT FROM '1'))
          + (SELECT count(*) FROM chapter_pages p WHERE p.retired_at IS NULL
             AND (SELECT max(q.position) FROM chapter_pages q
                   WHERE q.chapter_id = p.chapter_id AND q.retired_at IS NULL)
                  <> (SELECT count(*) FROM chapter_pages q
                       WHERE q.chapter_id = p.chapter_id AND q.retired_at IS NULL))
          + (SELECT count(*) FROM chapter_pages p WHERE p.retired_at IS NULL
             AND (SELECT count(*) FROM media_references r JOIN media_assets a ON a.id = r.asset_id
                   WHERE r.chapter_page_id = p.id AND r.retired_at IS NULL
                     AND r.slot = 'chapter_page' AND a.media_class = 'chapter_page'
                     AND a.scope = 'admin') <> 1)
          + (SELECT count(*) FROM chapters c WHERE c.publication_status = 'published'
             AND NOT EXISTS (SELECT 1 FROM publication_events e
               WHERE e.id = c.current_publication_event_id AND e.chapter_id = c.id
                 AND e.occurred_at = c.published_at))
        )::int AS count`,
      );
      expect(violations.rows).toEqual([{ count: 0 }]);
      const finalRepeat = await deployFrom(stagedUrl.toString(), configPath);
      expect(finalRepeat.stdout + finalRepeat.stderr).toMatch(
        /No pending migrations|already in sync/iu,
      );
      await writeFile(
        join(cacheRoot, "p04-last-rehearsal.json"),
        JSON.stringify({
          databaseName,
          backupSha256: backupHash.stdout.split(/\s/u)[0],
          mediaSha256: mediaHash,
          chapterIds: [chapterId, textChapterId],
          pageIds: [boundPageId, unboundPageId],
          referenceId,
          publicationEventIds: [eventId, illustratedEventId],
          appliedMigrations: [expandMigration, enforceMigration],
          inventory: { checked: 1, invalidIds: [] },
          finalViolations: violations.rows[0]?.count,
        }),
        "utf8",
      );
    } finally {
      await stagedPool?.end();
      await adminPool.query(
        `DROP DATABASE IF EXISTS "${databaseName}" WITH (FORCE)`,
      );
      await adminPool.end();
      await execFileAsync("docker", [
        "exec",
        containerId,
        "rm",
        "-f",
        snapshotPath,
      ]);
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  }, 180_000);
});

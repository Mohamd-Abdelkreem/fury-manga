import { Pool } from "pg";
import { randomUUID } from "node:crypto";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl === undefined) {
  throw new Error("The Testcontainers DATABASE_URL was not provided.");
}

const pool = new Pool({ connectionString: databaseUrl });
const fixtureUserIds: string[] = [];

const preparePublishedWork = async (
  workId: string,
  categoryId?: string,
): Promise<void> => {
  const selectedCategoryId = categoryId ?? randomUUID();
  if (categoryId === undefined) {
    await pool.query(
      "INSERT INTO categories (id, display_name, slug, updated_at) VALUES ($1, 'Ready', $2, CURRENT_TIMESTAMP)",
      [selectedCategoryId, `ready-${selectedCategoryId}`],
    );
  }
  await pool.query(
    `INSERT INTO work_categories (work_id, category_id)
     VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [workId, selectedCategoryId],
  );
  await pool.query(
    `UPDATE works SET synopsis = 'A complete synopsis for publication constraints.',
       author = 'Fixture Author' WHERE id = $1`,
    [workId],
  );
  const userId = randomUUID();
  fixtureUserIds.push(userId);
  await pool.query(
    `INSERT INTO users (id, email, password_hash, full_name, status, email_verified_at, updated_at)
     VALUES ($1, $2, 'hash', 'Fixture Admin', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [userId, `ready-${userId}@example.test`],
  );
  const assetId = randomUUID();
  await pool.query(
    `INSERT INTO media_assets (id, media_class, scope, uploaded_by_user_id, relative_key,
       content_type, byte_length, width, height, sha256, status, available_at)
     VALUES ($1, 'work_cover', 'admin', $2, $3, 'image/webp', 100, 10, 10,
       $4, 'available', CURRENT_TIMESTAMP)`,
    [assetId, userId, `ready-${assetId}`, "a".repeat(64)],
  );
  await pool.query(
    `INSERT INTO media_references (asset_id, work_id, slot, updated_at)
     VALUES ($1, $2, 'work_cover', CURRENT_TIMESTAMP)`,
    [assetId, workId],
  );
};

const insertWork = async (
  slug = "durable-work",
  type: "manga" | "text-story" = "manga",
): Promise<string> => {
  const result = await pool.query<{ id: string }>(
    "INSERT INTO works (title, slug, type, story_status, updated_at) VALUES ('Durable Work', $1, $2::work_type, 'ongoing', CURRENT_TIMESTAMP) RETURNING id",
    [slug, type],
  );
  return result.rows[0]?.id ?? "";
};

describe("content-domain PostgreSQL invariants", () => {
  it("retains true zero chapter counts and stable ID ties for saved Works", async () => {
    const firstId = await insertWork(`list-first-${randomUUID()}`);
    const secondId = await insertWork(`list-second-${randomUUID()}`);
    await pool.query(
      "UPDATE works SET updated_at = $1, created_at = $1 WHERE id = ANY($2::uuid[])",
      ["2026-01-01T00:00:00.000Z", [firstId, secondId]],
    );
    await pool.query(
      "INSERT INTO chapters (work_id, number, content_type, updated_at) VALUES ($1, 1, 'illustrated', CURRENT_TIMESTAMP)",
      [secondId],
    );
    const rows = await pool.query<{ id: string; chapter_count: string }>(
      `SELECT w.id, COUNT(c.id)::text AS chapter_count FROM works w
       LEFT JOIN chapters c ON c.work_id = w.id
       WHERE w.id = ANY($1::uuid[]) GROUP BY w.id
       ORDER BY COUNT(c.id) DESC, w.id ASC`,
      [[firstId, secondId]],
    );
    expect(rows.rows).toEqual([
      { id: secondId, chapter_count: "1" },
      { id: firstId, chapter_count: "0" },
    ]);
    const tied = await pool.query<{ id: string }>(
      "SELECT id FROM works WHERE id = ANY($1::uuid[]) ORDER BY updated_at DESC, id ASC",
      [[firstId, secondId]],
    );
    expect(tied.rows.map(({ id }) => id)).toEqual(
      [firstId, secondId].toSorted(),
    );
  });

  it("keeps rows and total on one snapshot while another Work is saved", async () => {
    await insertWork(`snapshot-first-${randomUUID()}`);
    const reader = await pool.connect();
    try {
      await reader.query("BEGIN ISOLATION LEVEL REPEATABLE READ");
      const rows = await reader.query(
        "SELECT id FROM works ORDER BY id LIMIT 25",
      );
      await insertWork(`snapshot-later-${randomUUID()}`);
      const total = await reader.query<{ count: string }>(
        "SELECT COUNT(*)::text AS count FROM works",
      );
      expect(Number(total.rows[0]?.count)).toBe(rows.rowCount);
      await reader.query("COMMIT");
      const afterCommit = await pool.query<{ count: string }>(
        "SELECT COUNT(*)::text AS count FROM works",
      );
      expect(Number(afterCommit.rows[0]?.count)).toBe((rows.rowCount ?? 0) + 1);
    } catch (error: unknown) {
      await reader.query("ROLLBACK");
      throw error;
    } finally {
      reader.release();
    }
  });
  beforeEach(async () => {
    await pool.query(
      "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_tags, work_categories, categories, works",
    );
  });

  afterAll(async () => {
    await pool.query(
      "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_tags, work_categories, categories, works",
    );
    await pool.query("DELETE FROM users WHERE id = ANY($1::uuid[])", [
      fixtureUserIds,
    ]);
    await pool.end();
  });

  it("enforces normalized unique identities and relation pairs", async () => {
    const workId = await insertWork();
    const category = await pool.query<{ id: string }>(
      "INSERT INTO categories (display_name, slug, updated_at) VALUES ('Action', 'action', CURRENT_TIMESTAMP) RETURNING id",
    );
    const categoryId = category.rows[0]?.id ?? "";
    await pool.query(
      "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
      [workId, categoryId],
    );

    await expect(insertWork()).rejects.toMatchObject({ code: "23505" });
    await expect(insertWork("Not-Normalized")).rejects.toMatchObject({
      code: "23514",
    });
    await expect(
      pool.query(
        "INSERT INTO categories (display_name, slug, updated_at) VALUES ('Duplicate', 'action', CURRENT_TIMESTAMP)",
      ),
    ).rejects.toMatchObject({ code: "23505" });
    await expect(
      pool.query(
        "INSERT INTO categories (display_name, slug, updated_at) VALUES ('Bad', 'Not-Normalized', CURRENT_TIMESTAMP)",
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query(
        "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
        [workId, categoryId],
      ),
    ).rejects.toMatchObject({ code: "23505" });
    await expect(
      pool.query(
        "INSERT INTO work_categories (work_id, category_id) VALUES (gen_random_uuid(), $1)",
        [categoryId],
      ),
    ).rejects.toMatchObject({ code: "23503" });
  });

  it("caps direct and concurrent Work category assignments at 100", async () => {
    const categoryRows = await pool.query<{
      id: string;
      display_position: number;
    }>(
      `INSERT INTO categories (display_name, slug, display_position, updated_at)
       SELECT 'Category ' || n, 'limit-category-' || n, n, CURRENT_TIMESTAMP
       FROM generate_series(1, 101) AS n
       RETURNING id, display_position`,
    );
    const categoryIds = categoryRows.rows
      .toSorted((left, right) => left.display_position - right.display_position)
      .map(({ id }) => id);
    const workId = await insertWork("category-limit");
    await pool.query(
      `INSERT INTO work_categories (work_id, category_id)
       SELECT $1, id FROM categories ORDER BY display_position LIMIT 100`,
      [workId],
    );
    await expect(
      pool.query(
        "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
        [workId, categoryIds[100]],
      ),
    ).rejects.toMatchObject({
      code: "PZ100",
      constraint: "ck_work_categories_max_100",
    });
    const unchanged = await pool.query<{ count: number }>(
      "SELECT count(*)::int AS count FROM work_categories WHERE work_id = $1",
      [workId],
    );
    expect(unchanged.rows[0]?.count).toBe(100);

    const concurrentWorkId = await insertWork("concurrent-category-limit");
    await pool.query(
      `INSERT INTO work_categories (work_id, category_id)
       SELECT $1, id FROM categories ORDER BY display_position LIMIT 99`,
      [concurrentWorkId],
    );
    const first = await pool.connect();
    const second = await pool.connect();
    try {
      await first.query("BEGIN");
      await second.query("BEGIN");
      await first.query(
        "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
        [concurrentWorkId, categoryIds[99]],
      );
      const competingInsert = second.query(
        "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
        [concurrentWorkId, categoryIds[100]],
      );
      await first.query("COMMIT");
      await expect(competingInsert).rejects.toMatchObject({
        code: "PZ100",
        constraint: "ck_work_categories_max_100",
      });
      await second.query("ROLLBACK");
    } finally {
      await first.query("ROLLBACK").catch(() => undefined);
      await second.query("ROLLBACK").catch(() => undefined);
      first.release();
      second.release();
    }
    const finalCount = await pool.query<{ count: number }>(
      "SELECT count(*)::int AS count FROM work_categories WHERE work_id = $1",
      [concurrentWorkId],
    );
    expect(finalCount.rows[0]?.count).toBe(100);
  });

  it("rejects new disabled Category assignments while preserving old draft links", async () => {
    const workId = await insertWork("disabled-category-draft");
    const otherWorkId = await insertWork("disabled-category-other-draft");
    const categories = await pool.query<{ id: string }>(
      `INSERT INTO categories (display_name, slug, updated_at)
       VALUES ('Retained', 'retained-category', CURRENT_TIMESTAMP)
       RETURNING id`,
    );
    const categoryId = categories.rows[0]?.id;
    await pool.query(
      "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
      [workId, categoryId],
    );
    await pool.query("UPDATE categories SET enabled = false WHERE id = $1", [
      categoryId,
    ]);
    await pool.query(
      "UPDATE work_categories SET category_id = category_id WHERE work_id = $1",
      [workId],
    );
    await expect(
      pool.query(
        "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
        [otherWorkId, categoryId],
      ),
    ).rejects.toMatchObject({
      code: "PZ101",
      constraint: "ck_work_categories_enabled_assignment",
    });
    const links = await pool.query<{ work_id: string }>(
      "SELECT work_id FROM work_categories WHERE category_id = $1",
      [categoryId],
    );
    expect(links.rows).toEqual([{ work_id: workId }]);
    await pool.query(
      "DELETE FROM work_categories WHERE work_id = $1 AND category_id = $2",
      [workId, categoryId],
    );
    expect(
      (
        await pool.query(
          "SELECT 1 FROM work_categories WHERE category_id = $1",
          [categoryId],
        )
      ).rowCount,
    ).toBe(0);
  });

  it("serializes a direct Category disable against a draft assignment", async () => {
    const workId = await insertWork("concurrent-disabled-assignment");
    const category = await pool.query<{ id: string }>(
      `INSERT INTO categories (display_name, slug, updated_at)
       VALUES ('Concurrent', 'concurrent-assignment', CURRENT_TIMESTAMP)
       RETURNING id`,
    );
    const categoryId = category.rows[0]?.id;
    const disabler = await pool.connect();
    const assigner = await pool.connect();
    let disableCommitted = false;
    let assignmentCommitted = false;
    try {
      await disabler.query("BEGIN");
      await assigner.query("BEGIN");
      const outcomes = await Promise.allSettled([
        disabler
          .query("UPDATE categories SET enabled = false WHERE id = $1", [
            categoryId,
          ])
          .then(() => disabler.query("COMMIT")),
        assigner
          .query(
            "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
            [workId, categoryId],
          )
          .then(() => assigner.query("COMMIT")),
      ]);
      disableCommitted = outcomes[0].status === "fulfilled";
      assignmentCommitted = outcomes[1].status === "fulfilled";
      expect(disableCommitted || assignmentCommitted).toBe(true);
    } finally {
      await disabler.query("ROLLBACK").catch(() => undefined);
      await assigner.query("ROLLBACK").catch(() => undefined);
      disabler.release();
      assigner.release();
    }
    const saved = await pool.query<{ enabled: boolean; associated: boolean }>(
      `SELECT c.enabled, EXISTS (
         SELECT 1 FROM work_categories wc
         WHERE wc.work_id = $1 AND wc.category_id = c.id
       ) AS associated
       FROM categories c WHERE c.id = $2`,
      [workId, categoryId],
    );
    expect(saved.rows).toHaveLength(1);
    expect(saved.rows[0]).toEqual({
      enabled: !disableCommitted,
      associated: assignmentCommitted,
    });
    if (disableCommitted && !assignmentCommitted) {
      await expect(
        pool.query(
          "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
          [workId, categoryId],
        ),
      ).rejects.toMatchObject({
        code: "PZ101",
        constraint: "ck_work_categories_enabled_assignment",
      });
    }
  });

  it("allows an empty illustrated draft and enforces chapter/page ordering facts", async () => {
    const workId = await insertWork();
    const chapter = await pool.query<{ id: string }>(
      "INSERT INTO chapters (work_id, number, content_type, updated_at) VALUES ($1, 1, 'illustrated', CURRENT_TIMESTAMP) RETURNING id",
      [workId],
    );
    const chapterId = chapter.rows[0]?.id ?? "";
    await pool.query(
      "INSERT INTO chapter_pages (chapter_id, position) VALUES ($1, 2), ($1, 1)",
      [chapterId],
    );

    const pages = await pool.query<{ position: number }>(
      "SELECT position FROM chapter_pages WHERE chapter_id = $1 ORDER BY position ASC, id ASC",
      [chapterId],
    );
    expect(pages.rows.map(({ position }) => position)).toEqual([1, 2]);
    await expect(
      pool.query(
        "INSERT INTO chapter_pages (chapter_id, position) VALUES ($1, 1)",
        [chapterId],
      ),
    ).rejects.toMatchObject({ code: "23505" });
    await expect(
      pool.query(
        "INSERT INTO chapters (work_id, number, content_type, updated_at) VALUES ($1, 0, 'illustrated', CURRENT_TIMESTAMP)",
        [workId],
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query(
        "INSERT INTO chapters (work_id, number, content_type, updated_at) VALUES ($1, 1, 'illustrated', CURRENT_TIMESTAMP)",
        [workId],
      ),
    ).rejects.toMatchObject({ code: "23505" });
    await expect(
      pool.query(
        "INSERT INTO chapter_pages (chapter_id, position) VALUES ($1, 0)",
        [chapterId],
      ),
    ).rejects.toMatchObject({ code: "23514" });
  });

  it("rejects parent/content mismatch and immutable identity changes", async () => {
    const illustratedWorkId = await insertWork("illustrated", "manga");
    const textWorkId = await insertWork("text", "text-story");
    await expect(
      pool.query(
        "INSERT INTO chapters (work_id, number, content_type, text_content, updated_at) VALUES ($1, 1, 'text', $2::jsonb, CURRENT_TIMESTAMP)",
        [illustratedWorkId, JSON.stringify({ version: 1, blocks: [] })],
      ),
    ).rejects.toMatchObject({ code: "23514" });

    await expect(
      pool.query("UPDATE works SET type = 'novel' WHERE id = $1", [
        illustratedWorkId,
      ]),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("UPDATE works SET slug = 'changed' WHERE id = $1", [
        textWorkId,
      ]),
    ).rejects.toMatchObject({ code: "23514" });

    const category = await pool.query<{ id: string }>(
      "INSERT INTO categories (display_name, slug, updated_at) VALUES ('Identity', 'identity', CURRENT_TIMESTAMP) RETURNING id",
    );
    const categoryId = category.rows[0]?.id ?? "";
    await expect(
      pool.query("UPDATE categories SET slug = 'changed' WHERE id = $1", [
        categoryId,
      ]),
    ).rejects.toMatchObject({ code: "23514" });

    const textChapter = await pool.query<{ id: string }>(
      "INSERT INTO chapters (work_id, number, content_type, text_content, updated_at) VALUES ($1, 1, 'text', $2::jsonb, CURRENT_TIMESTAMP) RETURNING id",
      [textWorkId, JSON.stringify({ version: 1, blocks: [] })],
    );
    const textChapterId = textChapter.rows[0]?.id ?? "";
    await expect(
      pool.query("UPDATE chapters SET work_id = $1 WHERE id = $2", [
        illustratedWorkId,
        textChapterId,
      ]),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query(
        "INSERT INTO chapter_pages (chapter_id, position) VALUES ($1, 1)",
        [textChapterId],
      ),
    ).rejects.toMatchObject({ code: "23514" });
  });

  it("couples publication state to immutable one-target history and readiness", async () => {
    const workId = await insertWork("publication-invariants");
    const chapter = await pool.query<{ id: string }>(
      "INSERT INTO chapters (work_id, number, content_type, updated_at) VALUES ($1, 1, 'illustrated', CURRENT_TIMESTAMP) RETURNING id",
      [workId],
    );
    const chapterId = chapter.rows[0]?.id ?? "";
    await expect(
      pool.query(
        "UPDATE works SET publication_status = 'published', published_at = CURRENT_TIMESTAMP, current_publication_event_id = gen_random_uuid() WHERE id = $1",
        [workId],
      ),
    ).rejects.toMatchObject({ code: "23503" });
    await expect(
      pool.query(
        "INSERT INTO publication_events (work_id, chapter_id) VALUES ($1, $2)",
        [workId, chapterId],
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("INSERT INTO publication_events DEFAULT VALUES"),
    ).rejects.toMatchObject({ code: "23514" });

    await preparePublishedWork(workId);

    const client = await pool.connect();
    let eventId = "";
    try {
      await client.query("BEGIN");
      const publication = await client.query<{ id: string }>(
        "INSERT INTO publication_events (work_id, occurred_at) VALUES ($1, CURRENT_TIMESTAMP) RETURNING id",
        [workId],
      );
      eventId = publication.rows[0]?.id ?? "";
      await client.query(
        "UPDATE works SET publication_status = 'published', published_at = (SELECT occurred_at FROM publication_events WHERE id = $2), current_publication_event_id = $2 WHERE id = $1",
        [workId, eventId],
      );
      await client.query("COMMIT");
    } finally {
      client.release();
    }

    await expect(
      pool.query(
        "UPDATE publication_events SET occurred_at = occurred_at + INTERVAL '1 second' WHERE id = $1",
        [eventId],
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("DELETE FROM publication_events WHERE id = $1", [eventId]),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("DELETE FROM works WHERE id = $1", [workId]),
    ).rejects.toMatchObject({ code: "23001" });

    const unreadyClient = await pool.connect();
    try {
      await unreadyClient.query("BEGIN");
      const event = await unreadyClient.query<{ id: string }>(
        "INSERT INTO publication_events (chapter_id, occurred_at) VALUES ($1, CURRENT_TIMESTAMP) RETURNING id",
        [chapterId],
      );
      const chapterEventId = event.rows[0]?.id ?? "";
      await unreadyClient.query(
        "UPDATE chapters SET publication_status = 'published', published_at = (SELECT occurred_at FROM publication_events WHERE id = $2), current_publication_event_id = $2 WHERE id = $1",
        [chapterId, chapterEventId],
      );
      await expect(unreadyClient.query("COMMIT")).rejects.toMatchObject({
        code: "23514",
      });
    } finally {
      await unreadyClient.query("ROLLBACK");
      unreadyClient.release();
    }
    await expect(
      pool.query(
        "SELECT count(*)::int AS count FROM publication_events WHERE chapter_id = $1",
        [chapterId],
      ),
    ).resolves.toMatchObject({ rows: [{ count: 0 }] });
  });

  it("appends legacy category inserts and enforces positive gapless positions", async () => {
    const insertCategory = (slug: string) =>
      pool.query<{ display_position: number; enabled: boolean }>(
        `INSERT INTO categories (display_name, slug, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         RETURNING display_position, enabled`,
        [slug, slug],
      );

    const first = await insertCategory("legacy-first");
    const second = await insertCategory("legacy-second");
    const third = await insertCategory("legacy-third");
    expect([
      first.rows[0]?.display_position,
      second.rows[0]?.display_position,
      third.rows[0]?.display_position,
    ]).toEqual([1, 2, 3]);
    expect([
      first.rows[0]?.enabled,
      second.rows[0]?.enabled,
      third.rows[0]?.enabled,
    ]).toEqual([true, true, true]);

    await expect(
      pool.query(
        `INSERT INTO categories (display_name, slug, display_position, updated_at)
         VALUES ('Invalid Position', 'invalid-position', 0, CURRENT_TIMESTAMP)`,
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query(
        `INSERT INTO categories (display_name, slug, display_position, updated_at)
         VALUES ('Position Gap', 'position-gap', 5, CURRENT_TIMESTAMP)`,
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("DELETE FROM categories WHERE slug = 'legacy-third'"),
    ).rejects.toMatchObject({ code: "23514" });

    const categories = await pool.query<{
      id: string;
      display_position: number;
    }>("SELECT id, display_position FROM categories ORDER BY display_position");
    const firstId = categories.rows[0]?.id;
    const secondId = categories.rows[1]?.id;
    if (firstId === undefined || secondId === undefined) {
      throw new Error("Expected category fixtures to exist.");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        'SET CONSTRAINTS "categories_display_position_key" DEFERRED',
      );
      await client.query(
        "UPDATE categories SET display_position = 2 WHERE id = $1",
        [firstId],
      );
      await client.query(
        "UPDATE categories SET display_position = 1 WHERE id = $1",
        [secondId],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    const reordered = await pool.query<{ display_position: number }>(
      "SELECT display_position FROM categories ORDER BY display_position",
    );
    expect(
      reordered.rows.map(({ display_position }) => display_position),
    ).toEqual([1, 2, 3]);
  });

  it("stores nullable editorial fields and ordered unique normalized tags", async () => {
    const workId = await insertWork("editorial-fields");
    const emptyDraft = await pool.query<{
      alternative_title: string | null;
      synopsis: string | null;
      author: string | null;
      artist: string | null;
      featured_home: boolean;
      featured_order: number | null;
    }>(
      `SELECT alternative_title, synopsis, author, artist,
              featured_home, featured_order
         FROM works WHERE id = $1`,
      [workId],
    );
    expect(emptyDraft.rows[0]).toEqual({
      alternative_title: null,
      synopsis: null,
      author: null,
      artist: null,
      featured_home: false,
      featured_order: null,
    });

    await expect(
      pool.query("UPDATE works SET synopsis = 'too short' WHERE id = $1", [
        workId,
      ]),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("UPDATE works SET author = '' WHERE id = $1", [workId]),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("UPDATE works SET alternative_title = '  ' WHERE id = $1", [
        workId,
      ]),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("UPDATE works SET artist = '' WHERE id = $1", [workId]),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("UPDATE works SET featured_home = true WHERE id = $1", [
        workId,
      ]),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("UPDATE works SET featured_order = 1 WHERE id = $1", [workId]),
    ).rejects.toMatchObject({ code: "23514" });

    await pool.query(
      `INSERT INTO work_tags (work_id, normalized_tag, position)
       VALUES ($1, 'Adventure', 1), ($1, 'Drama', 2)`,
      [workId],
    );
    const tags = await pool.query<{
      normalized_tag: string;
      position: number;
    }>(
      `SELECT normalized_tag, position FROM work_tags
        WHERE work_id = $1 ORDER BY position, normalized_tag`,
      [workId],
    );
    expect(tags.rows).toEqual([
      { normalized_tag: "Adventure", position: 1 },
      { normalized_tag: "Drama", position: 2 },
    ]);

    await expect(
      pool.query(
        "INSERT INTO work_tags (work_id, normalized_tag, position) VALUES ($1, 'Adventure', 3)",
        [workId],
      ),
    ).rejects.toMatchObject({ code: "23505" });
    await expect(
      pool.query(
        "INSERT INTO work_tags (work_id, normalized_tag, position) VALUES ($1, 'Mystery', 2)",
        [workId],
      ),
    ).rejects.toMatchObject({ code: "23505" });
    await expect(
      pool.query(
        "INSERT INTO work_tags (work_id, normalized_tag, position) VALUES ($1, '  Mystery', 3)",
        [workId],
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query(
        "INSERT INTO work_tags (work_id, normalized_tag, position) VALUES ($1, 'Cafe\u0301', 3)",
        [workId],
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query(
        "INSERT INTO work_tags (work_id, normalized_tag, position) VALUES ($1, 'Mystery', 0)",
        [workId],
      ),
    ).rejects.toMatchObject({ code: "23514" });
  });

  it("enforces the per-work tag limit for direct and concurrent writes", async () => {
    const workId = await insertWork("editorial-tag-limit");
    await pool.query(
      `INSERT INTO work_tags (work_id, normalized_tag, position)
       SELECT $1, 'tag-' || position, position
         FROM generate_series(1, 20) AS positions(position)`,
      [workId],
    );

    const savedTags = await pool.query<{
      normalized_tag: string;
      position: number;
    }>(
      `SELECT normalized_tag, position FROM work_tags
        WHERE work_id = $1 ORDER BY position`,
      [workId],
    );
    expect(savedTags.rows).toHaveLength(20);
    expect(savedTags.rows.map(({ position }) => position)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 1),
    );

    await expect(
      pool.query(
        `INSERT INTO work_tags (work_id, normalized_tag, position)
         VALUES ($1, 'tag-21', 21)`,
        [workId],
      ),
    ).rejects.toMatchObject({
      code: "23514",
      constraint: "ck_work_tags_position_within_work_limit",
    });

    const unchangedTags = await pool.query<{
      normalized_tag: string;
      position: number;
    }>(
      `SELECT normalized_tag, position FROM work_tags
        WHERE work_id = $1 ORDER BY position`,
      [workId],
    );
    expect(unchangedTags.rows).toEqual(savedTags.rows);

    const concurrentWorkId = await insertWork("editorial-tag-limit-race");
    await pool.query(
      `INSERT INTO work_tags (work_id, normalized_tag, position)
       SELECT $1, 'race-' || position, position
         FROM generate_series(1, 19) AS positions(position)`,
      [concurrentWorkId],
    );
    const competingWrites = await Promise.allSettled(
      ["race-first", "race-second"].map((tag) =>
        pool.query(
          `INSERT INTO work_tags (work_id, normalized_tag, position)
           VALUES ($1, $2, 20)`,
          [concurrentWorkId, tag],
        ),
      ),
    );
    const winners = competingWrites.filter(
      (result) => result.status === "fulfilled",
    );
    const losers = competingWrites.filter(
      (result) => result.status === "rejected",
    );
    expect(winners).toHaveLength(1);
    expect(losers).toHaveLength(1);
    const loser = losers[0];
    if (loser?.status !== "rejected") {
      throw new Error("Expected one concurrent tag position claim to lose.");
    }
    expect(loser.reason).toMatchObject({
      code: "23505",
      constraint: "work_tags_work_id_position_key",
    });

    const finalCount = await pool.query<{ count: number }>(
      "SELECT count(*)::int AS count FROM work_tags WHERE work_id = $1",
      [concurrentWorkId],
    );
    expect(finalCount.rows[0]?.count).toBe(20);
  });

  it("uniquely places published featured works while retaining inactive preferences", async () => {
    const publishFeaturedWork = async (slug: string): Promise<string> => {
      const workId = await insertWork(slug);
      await pool.query(
        "UPDATE works SET featured_home = true, featured_order = 1 WHERE id = $1",
        [workId],
      );
      await preparePublishedWork(workId);
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const event = await client.query<{ id: string }>(
          `INSERT INTO publication_events (work_id)
           VALUES ($1) RETURNING id`,
          [workId],
        );
        const publication = event.rows[0];
        if (publication === undefined) {
          throw new Error("Expected publication event to be created.");
        }
        await client.query(
          `UPDATE works
              SET publication_status = 'published',
                  published_at = (
                    SELECT occurred_at FROM publication_events WHERE id = $2
                  ),
                  current_publication_event_id = $2
            WHERE id = $1`,
          [workId, publication.id],
        );
        await client.query("COMMIT");
        return workId;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    };

    await publishFeaturedWork("featured-winner");
    const competingDraft = await insertWork("featured-draft");
    await pool.query(
      "UPDATE works SET featured_home = true, featured_order = 1 WHERE id = $1",
      [competingDraft],
    );
    await expect(publishFeaturedWork("featured-loser")).rejects.toMatchObject({
      code: "23505",
    });

    const archived = await insertWork("featured-archived");
    await pool.query(
      `UPDATE works SET publication_status = 'archived',
                        featured_home = true, featured_order = 1
        WHERE id = $1`,
      [archived],
    );
    const retained = await pool.query<{
      publication_status: string;
      featured_home: boolean;
      featured_order: number | null;
    }>(
      `SELECT publication_status, featured_home, featured_order
         FROM works WHERE id IN ($1, $2) ORDER BY slug`,
      [competingDraft, archived],
    );
    expect(retained.rows).toEqual([
      {
        publication_status: "archived",
        featured_home: true,
        featured_order: 1,
      },
      {
        publication_status: "draft",
        featured_home: true,
        featured_order: 1,
      },
    ]);
  });

  it("persists all six foundational records across a new connection", async () => {
    const workId = await insertWork();
    const category = await pool.query<{ id: string }>(
      "INSERT INTO categories (display_name, slug, updated_at) VALUES ('Drama', 'drama', CURRENT_TIMESTAMP) RETURNING id",
    );
    const categoryId = category.rows[0]?.id ?? "";
    await pool.query(
      "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
      [workId, categoryId],
    );
    const chapter = await pool.query<{ id: string }>(
      "INSERT INTO chapters (work_id, number, content_type, updated_at) VALUES ($1, 1, 'illustrated', CURRENT_TIMESTAMP) RETURNING id",
      [workId],
    );
    const chapterId = chapter.rows[0]?.id ?? "";
    await pool.query(
      "INSERT INTO chapter_pages (chapter_id, position) VALUES ($1, 1)",
      [chapterId],
    );
    const publication = await pool.query<{ id: string }>(
      "INSERT INTO publication_events (work_id) VALUES ($1) RETURNING id",
      [workId],
    );
    const publicationId = publication.rows[0]?.id ?? "";

    const reconnected = new Pool({ connectionString: databaseUrl });
    try {
      const facts = await reconnected.query<{ count: string }>(
        "SELECT count(*)::text AS count FROM works w JOIN work_categories wc ON wc.work_id = w.id JOIN categories c ON c.id = wc.category_id JOIN chapters ch ON ch.work_id = w.id JOIN chapter_pages p ON p.chapter_id = ch.id JOIN publication_events pe ON pe.work_id = w.id WHERE w.id = $1 AND pe.id = $2",
        [workId, publicationId],
      );
      expect(facts.rows[0]?.count).toBe("1");
    } finally {
      await reconnected.end();
    }
  });

  it("appends concurrent categories and preserves distinct usage across states", async () => {
    const created = await Promise.all(
      ["category-a", "category-b", "category-c"].map((slug) =>
        pool.query<{ id: string; enabled: boolean; display_position: number }>(
          "INSERT INTO categories (display_name, slug, updated_at) VALUES ($1, $1, CURRENT_TIMESTAMP) RETURNING id, enabled, display_position",
          [slug],
        ),
      ),
    );
    const categoryIds = created.map((result) => result.rows[0]?.id ?? "");
    expect(
      created.flatMap((result) => result.rows).map(({ enabled }) => enabled),
    ).toEqual([true, true, true]);
    const positions = await pool.query<{ display_position: number }>(
      "SELECT display_position FROM categories ORDER BY display_position",
    );
    expect(
      positions.rows.map(({ display_position }) => display_position),
    ).toEqual([1, 2, 3]);

    const draft = await insertWork("category-usage-draft");
    const published = await insertWork("category-usage-published");
    const archived = await insertWork("category-usage-archived");
    await preparePublishedWork(published, categoryIds[0]);
    const publication = await pool.query<{ id: string }>(
      "INSERT INTO publication_events (work_id) VALUES ($1) RETURNING id",
      [published],
    );
    const publicationId = publication.rows[0]?.id ?? "";
    await pool.query(
      "UPDATE works SET publication_status = 'published', published_at = (SELECT occurred_at FROM publication_events WHERE id = $2), current_publication_event_id = $2 WHERE id = $1",
      [published, publicationId],
    );
    await pool.query(
      "UPDATE works SET publication_status = 'archived', published_at = NULL, current_publication_event_id = NULL WHERE id = $1",
      [archived],
    );
    await pool.query(
      "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2), ($3, $2), ($1, $4)",
      [draft, categoryIds[0], archived, categoryIds[1]],
    );
    const usage = await pool.query<{ count: string }>(
      "SELECT count(DISTINCT work_id)::text AS count FROM work_categories WHERE category_id = $1",
      [categoryIds[0]],
    );
    expect(usage.rows[0]?.count).toBe("3");
  });

  it("serializes concurrent order swaps and admits one duplicate-slug creator", async () => {
    await pool.query(
      "INSERT INTO categories (display_name, slug, updated_at) VALUES ('First', 'concurrent-first', CURRENT_TIMESTAMP), ('Second', 'concurrent-second', CURRENT_TIMESTAMP)",
    );
    const ids = await pool.query<{ id: string }>(
      "SELECT id FROM categories ORDER BY display_position",
    );
    const firstId = ids.rows[0]?.id ?? "";
    const secondId = ids.rows[1]?.id ?? "";

    const swap = async (): Promise<void> => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          "SELECT pg_advisory_xact_lock(5380033990109::BIGINT)",
        );
        await client.query(
          'SET CONSTRAINTS "categories_display_position_key" DEFERRED',
        );
        await client.query(
          "UPDATE categories SET display_position = CASE WHEN id = $1 THEN 2 ELSE 1 END WHERE id IN ($1, $2)",
          [firstId, secondId],
        );
        await client.query("COMMIT");
      } catch (error: unknown) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    };
    const duplicateSlug = () =>
      pool.query(
        "INSERT INTO categories (display_name, slug, updated_at) VALUES ('Duplicate', 'concurrent-slug', CURRENT_TIMESTAMP)",
      );
    const [firstCreate, secondCreate] = await Promise.allSettled([
      duplicateSlug(),
      duplicateSlug(),
    ]);
    await Promise.all([swap(), swap()]);

    expect([firstCreate.status, secondCreate.status].sort()).toEqual([
      "fulfilled",
      "rejected",
    ]);
    const ordered = await pool.query<{ id: string; display_position: number }>(
      "SELECT id, display_position FROM categories ORDER BY display_position",
    );
    expect(ordered.rows).toEqual([
      { id: secondId, display_position: 1 },
      { id: firstId, display_position: 2 },
      expect.objectContaining({ display_position: 3 }),
    ]);
  });

  it("serializes competing draft replacements and rolls back a mid-write relation failure", async () => {
    const workId = await insertWork("atomic-editorial", "text-story");
    const categories = await Promise.all(
      ["original", "replacement"].map((slug) =>
        pool.query<{ id: string }>(
          "INSERT INTO categories (display_name, slug, updated_at) VALUES ($1, $1, CURRENT_TIMESTAMP) RETURNING id",
          [slug],
        ),
      ),
    );
    const originalCategoryId = categories[0]?.rows[0]?.id;
    const replacementCategoryId = categories[1]?.rows[0]?.id;
    if (
      originalCategoryId === undefined ||
      replacementCategoryId === undefined
    ) {
      throw new Error("Expected two isolated categories.");
    }
    await pool.query(
      "INSERT INTO work_tags (work_id, normalized_tag, position) VALUES ($1, 'Original', 1)",
      [workId],
    );
    await pool.query(
      "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
      [workId, originalCategoryId],
    );

    const replace = async (title: string): Promise<boolean> => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const updated = await client.query(
          "UPDATE works SET title = $2, version = version + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND version = 0 RETURNING id",
          [workId, title],
        );
        if (updated.rowCount !== 1) {
          await client.query("ROLLBACK");
          return false;
        }
        await client.query("DELETE FROM work_tags WHERE work_id = $1", [
          workId,
        ]);
        await client.query(
          "INSERT INTO work_tags (work_id, normalized_tag, position) VALUES ($1, $2, 1)",
          [workId, title],
        );
        await client.query("DELETE FROM work_categories WHERE work_id = $1", [
          workId,
        ]);
        await client.query(
          "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
          [workId, replacementCategoryId],
        );
        await client.query("COMMIT");
        return true;
      } catch (error: unknown) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    };
    expect(
      (await Promise.all([replace("First"), replace("Second")])).filter(
        Boolean,
      ),
    ).toHaveLength(1);

    const committed = await pool.query<{ title: string; version: number }>(
      "SELECT title, version FROM works WHERE id = $1",
      [workId],
    );
    const winner = committed.rows[0];
    expect(["First", "Second"]).toContain(winner?.title);
    expect(winner?.version).toBe(1);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "UPDATE works SET title = 'Failed replacement', version = version + 1 WHERE id = $1",
        [workId],
      );
      await client.query("DELETE FROM work_tags WHERE work_id = $1", [workId]);
      await client.query(
        "INSERT INTO work_tags (work_id, normalized_tag, position) VALUES ($1, 'Temporary', 1)",
        [workId],
      );
      await client.query("DELETE FROM work_categories WHERE work_id = $1", [
        workId,
      ]);
      await expect(
        client.query(
          "INSERT INTO work_tags (work_id, normalized_tag, position) VALUES ($1, 'Duplicate position', 1)",
          [workId],
        ),
      ).rejects.toMatchObject({ code: "23505" });
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
    expect(
      (
        await pool.query<{ title: string; version: number }>(
          "SELECT title, version FROM works WHERE id = $1",
          [workId],
        )
      ).rows[0],
    ).toEqual(winner);
    expect(
      (
        await pool.query<{ normalized_tag: string; position: number }>(
          "SELECT normalized_tag, position FROM work_tags WHERE work_id = $1",
          [workId],
        )
      ).rows,
    ).toEqual([{ normalized_tag: winner?.title, position: 1 }]);
    expect(
      (
        await pool.query(
          "SELECT category_id FROM work_categories WHERE work_id = $1",
          [workId],
        )
      ).rows,
    ).toEqual([{ category_id: replacementCategoryId }]);
  });

  it("persists rich draft metadata, ordered tags, and up to 100 distinct categories", async () => {
    const workId = await insertWork("rich-draft", "text-story");
    const categories = await Promise.all(
      ["first", "second"].map((slug) =>
        pool.query<{ id: string }>(
          "INSERT INTO categories (display_name, slug, updated_at) VALUES ($1, $1, CURRENT_TIMESTAMP) RETURNING id",
          [slug],
        ),
      ),
    );
    const categoryIds = categories.map((result) => result.rows[0]?.id ?? "");
    await pool.query(
      `UPDATE works
          SET alternative_title = 'عنوان بديل', synopsis = $2,
              author = 'Author', artist = 'Artist',
              featured_home = true, featured_order = 3, version = 2
        WHERE id = $1`,
      [workId, "A complete persisted synopsis longer than twenty characters."],
    );
    await pool.query(
      `INSERT INTO work_tags (work_id, normalized_tag, position)
       VALUES ($1, 'First tag', 1), ($1, 'Second tag', 2)`,
      [workId],
    );
    await pool.query(
      "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2), ($1, $3)",
      [workId, categoryIds[0], categoryIds[1]],
    );

    const saved = await pool.query<{
      alternative_title: string | null;
      synopsis: string | null;
      author: string | null;
      artist: string | null;
      featured_home: boolean;
      featured_order: number | null;
      version: number;
    }>(
      `SELECT alternative_title, synopsis, author, artist,
              featured_home, featured_order, version
         FROM works WHERE id = $1`,
      [workId],
    );
    expect(saved.rows[0]).toEqual({
      alternative_title: "عنوان بديل",
      synopsis: "A complete persisted synopsis longer than twenty characters.",
      author: "Author",
      artist: "Artist",
      featured_home: true,
      featured_order: 3,
      version: 2,
    });
    const tags = await pool.query<{
      normalized_tag: string;
      position: number;
    }>(
      "SELECT normalized_tag, position FROM work_tags WHERE work_id = $1 ORDER BY position",
      [workId],
    );
    expect(tags.rows).toEqual([
      { normalized_tag: "First tag", position: 1 },
      { normalized_tag: "Second tag", position: 2 },
    ]);
    const workCategories = await pool.query<{ category_id: string }>(
      "SELECT category_id FROM work_categories WHERE work_id = $1 ORDER BY category_id",
      [workId],
    );
    expect(
      workCategories.rows.map(({ category_id }) => category_id).sort(),
    ).toEqual([...categoryIds].sort());

    await expect(
      pool.query(
        "INSERT INTO work_categories (work_id, category_id) VALUES ($1, $2)",
        [workId, categoryIds[0]],
      ),
    ).rejects.toMatchObject({ code: "23505" });
    await expect(
      pool.query(
        "INSERT INTO work_tags (work_id, normalized_tag, position) VALUES ($1, 'Third tag', 2)",
        [workId],
      ),
    ).rejects.toMatchObject({ code: "23505" });
  });
});

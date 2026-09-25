import { Pool } from "pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl === undefined) {
  throw new Error("The Testcontainers DATABASE_URL was not provided.");
}

const pool = new Pool({ connectionString: databaseUrl });

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
  beforeEach(async () => {
    await pool.query(
      "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_categories, categories, works",
    );
  });

  afterAll(async () => {
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
});

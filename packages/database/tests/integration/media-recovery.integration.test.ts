import { randomUUID } from "node:crypto";

import { Pool } from "pg";
import { afterAll, describe, expect, it } from "vitest";

const connectionString = process.env["DATABASE_URL"];
if (connectionString === undefined)
  throw new Error("The Testcontainers DATABASE_URL was not provided.");
const pool = new Pool({ connectionString });

afterAll(async () => pool.end());

describe("coordinated media record recovery", () => {
  it("restores stable asset, attempt, target, reference, and event identities", async () => {
    const userId = randomUUID();
    const workId = randomUUID();
    const assetId = randomUUID();
    const attemptId = randomUUID();
    const referenceId = randomUUID();
    const eventId = randomUUID();
    await pool.query("BEGIN");
    try {
      await pool.query(
        `INSERT INTO users
          (id, email, password_hash, full_name, role, status, email_verified_at, updated_at)
         VALUES ($1, $2, 'test-hash', 'Recovery Admin', 'ADMIN', 'ACTIVE',
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [userId, `recovery-${userId}@example.test`],
      );
      await pool.query(
        `INSERT INTO works
          (id, title, slug, type, story_status, updated_at)
         VALUES ($1, 'Recovery Work', $2, 'manga', 'ongoing', CURRENT_TIMESTAMP)`,
        [workId, `recovery-${workId}`],
      );
      await pool.query(
        `INSERT INTO media_assets
          (id, media_class, scope, uploaded_by_user_id, relative_key,
           content_type, byte_length, width, height, sha256, status, available_at)
         VALUES ($1, 'work_cover', 'admin', $2, $3, 'image/webp', 128,
          600, 800, repeat('b', 64), 'available', CURRENT_TIMESTAMP)`,
        [assetId, userId, `${assetId}.bin`],
      );
      await pool.query(
        `INSERT INTO upload_attempts
          (id, actor_user_id, media_class, source_sha256, state, asset_id, completed_at)
         VALUES ($1, $2, 'work_cover', repeat('c', 64), 'accepted', $3,
          CURRENT_TIMESTAMP)`,
        [attemptId, userId, assetId],
      );
      await pool.query(
        `INSERT INTO media_references
          (id, asset_id, work_id, slot, updated_at)
         VALUES ($1, $2, $3, 'work_cover', CURRENT_TIMESTAMP)`,
        [referenceId, assetId, workId],
      );
      await pool.query(
        `INSERT INTO media_reference_events
          (id, reference_id, actor_user_id, action, to_asset_id, result_version)
         VALUES ($1, $2, $3, 'bound', $4, 0)`,
        [eventId, referenceId, userId, assetId],
      );

      const snapshot = await pool.query<{
        asset_id: string;
        attempt_id: string;
        reference_id: string;
        event_id: string;
        work_id: string;
        sha256: string;
      }>(
        `SELECT a.id AS asset_id, u.id AS attempt_id, r.id AS reference_id,
          e.id AS event_id, r.work_id, a.sha256
         FROM media_assets a
         JOIN upload_attempts u ON u.asset_id = a.id
         JOIN media_references r ON r.asset_id = a.id AND r.retired_at IS NULL
         JOIN media_reference_events e ON e.reference_id = r.id
         WHERE a.id = $1`,
        [assetId],
      );
      expect(snapshot.rows).toEqual([
        expect.objectContaining({
          asset_id: assetId,
          attempt_id: attemptId,
          reference_id: referenceId,
          event_id: eventId,
          work_id: workId,
          sha256: "b".repeat(64),
        }),
      ]);

      await pool.query("DELETE FROM media_reference_events WHERE id = $1", [
        eventId,
      ]);
      await pool.query("DELETE FROM media_references WHERE id = $1", [
        referenceId,
      ]);
      await pool.query(
        "DELETE FROM upload_attempts WHERE actor_user_id = $1 AND id = $2",
        [userId, attemptId],
      );
      await pool.query("DELETE FROM media_assets WHERE id = $1", [assetId]);

      await pool.query(
        `INSERT INTO media_assets
          (id, media_class, scope, uploaded_by_user_id, relative_key,
           content_type, byte_length, width, height, sha256, status, available_at)
         VALUES ($1, 'work_cover', 'admin', $2, $3, 'image/webp', 128,
          600, 800, repeat('b', 64), 'available', CURRENT_TIMESTAMP)`,
        [assetId, userId, `${assetId}.bin`],
      );
      await pool.query(
        `INSERT INTO upload_attempts
          (id, actor_user_id, media_class, source_sha256, state, asset_id, completed_at)
         VALUES ($1, $2, 'work_cover', repeat('c', 64), 'accepted', $3,
          CURRENT_TIMESTAMP)`,
        [attemptId, userId, assetId],
      );
      await pool.query(
        `INSERT INTO media_references
          (id, asset_id, work_id, slot, updated_at)
         VALUES ($1, $2, $3, 'work_cover', CURRENT_TIMESTAMP)`,
        [referenceId, assetId, workId],
      );
      await pool.query(
        `INSERT INTO media_reference_events
          (id, reference_id, actor_user_id, action, to_asset_id, result_version)
         VALUES ($1, $2, $3, 'bound', $4, 0)`,
        [eventId, referenceId, userId, assetId],
      );
      const restored = await pool.query<{ count: string }>(
        `SELECT count(*) FROM media_references r
         JOIN media_assets a ON a.id = r.asset_id
         JOIN upload_attempts u ON u.asset_id = a.id
         JOIN media_reference_events e ON e.reference_id = r.id
         WHERE r.id = $1 AND r.retired_at IS NULL AND a.status = 'available'`,
        [referenceId],
      );
      expect(restored.rows[0]?.count).toBe("1");
    } finally {
      await pool.query("ROLLBACK");
    }
  });
});

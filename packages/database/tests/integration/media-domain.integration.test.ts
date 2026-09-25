import { randomUUID } from "node:crypto";

import { Pool } from "pg";
import { afterAll, afterEach, describe, expect, it } from "vitest";

const connectionString = process.env["DATABASE_URL"];
if (connectionString === undefined) {
  throw new Error("The Testcontainers DATABASE_URL was not provided.");
}
const pool = new Pool({ connectionString });
const ownedUsers: string[] = [];
const ownedWorks: string[] = [];

const createUser = async (): Promise<string> => {
  const id = randomUUID();
  ownedUsers.push(id);
  await pool.query(
    `INSERT INTO users
       (id, email, password_hash, full_name, status, email_verified_at, updated_at)
     VALUES ($1, $2, 'test-hash', 'Media Test', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [id, `media-${id}@example.test`],
  );
  return id;
};

const createPendingAsset = async (actorUserId: string): Promise<string> => {
  const id = randomUUID();
  await pool.query(
    `INSERT INTO media_assets
       (id, media_class, scope, uploaded_by_user_id, relative_key)
     VALUES ($1, 'work_cover', 'admin', $2, $3)`,
    [id, actorUserId, `${id}.bin`],
  );
  return id;
};

afterEach(async () => {
  await pool.query(
    "DELETE FROM media_reference_events WHERE actor_user_id = ANY($1::uuid[])",
    [ownedUsers],
  );
  await pool.query(
    "DELETE FROM media_references WHERE work_id = ANY($1::uuid[])",
    [ownedWorks],
  );
  for (const userId of ownedUsers.splice(0)) {
    await pool.query("DELETE FROM upload_attempts WHERE actor_user_id = $1", [
      userId,
    ]);
    await pool.query(
      "DELETE FROM media_assets WHERE uploaded_by_user_id = $1",
      [userId],
    );
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  }
  await pool.query("DELETE FROM works WHERE id = ANY($1::uuid[])", [
    ownedWorks.splice(0),
  ]);
});

afterAll(async () => {
  await pool.end();
});

describe("P02 media persistence invariants", () => {
  it("enforces avatar owner scope and actor-scoped attempt isolation", async () => {
    const firstOwner = await createUser();
    const secondOwner = await createUser();
    const attemptId = randomUUID();
    const firstAsset = randomUUID();
    const secondAsset = randomUUID();

    for (const [ownerId, assetId] of [
      [firstOwner, firstAsset],
      [secondOwner, secondAsset],
    ] as const) {
      await pool.query(
        `INSERT INTO media_assets
          (id, media_class, scope, owner_user_id, uploaded_by_user_id, relative_key)
         VALUES ($1, 'user_avatar', 'user', $2, $2, $3)`,
        [assetId, ownerId, `${assetId}.bin`],
      );
      await pool.query(
        `INSERT INTO upload_attempts (id, actor_user_id, media_class, asset_id)
         VALUES ($1, $2, 'user_avatar', $3)`,
        [attemptId, ownerId, assetId],
      );
    }

    const attempts = await pool.query<{ actor_user_id: string }>(
      "SELECT actor_user_id FROM upload_attempts WHERE id = $1",
      [attemptId],
    );
    expect(attempts.rows.map((row) => row.actor_user_id).sort()).toEqual(
      [firstOwner, secondOwner].sort(),
    );
    await expect(
      pool.query(
        `INSERT INTO media_assets
          (id, media_class, scope, uploaded_by_user_id, relative_key)
         VALUES ($1, 'user_avatar', 'user', $2, $3)`,
        [randomUUID(), firstOwner, `${randomUUID()}.bin`],
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query(
        `INSERT INTO media_assets
          (id, media_class, scope, owner_user_id, uploaded_by_user_id, relative_key)
         VALUES ($1, 'work_cover', 'admin', $2, $2, $3)`,
        [randomUUID(), firstOwner, `${randomUUID()}.bin`],
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query(
        `INSERT INTO media_assets
          (id, media_class, scope, owner_user_id, uploaded_by_user_id, relative_key)
         VALUES ($1, 'user_avatar', 'user', $2, $2, $3)`,
        [randomUUID(), randomUUID(), `${randomUUID()}.bin`],
      ),
    ).rejects.toMatchObject({ code: "23503" });
  });

  it("reserves independent actor-scoped attempts with a pending asset", async () => {
    const firstActor = await createUser();
    const secondActor = await createUser();
    const key = randomUUID();
    const firstAsset = await createPendingAsset(firstActor);
    const secondAsset = await createPendingAsset(secondActor);

    for (const [actorId, assetId] of [
      [firstActor, firstAsset],
      [secondActor, secondAsset],
    ]) {
      await pool.query(
        `INSERT INTO upload_attempts (id, actor_user_id, media_class, asset_id)
         VALUES ($1, $2, 'work_cover', $3)`,
        [key, actorId, assetId],
      );
    }
    const attempts = await pool.query<{
      actor_user_id: string;
      asset_id: string;
    }>(
      "SELECT actor_user_id, asset_id FROM upload_attempts WHERE id = $1 ORDER BY actor_user_id",
      [key],
    );
    expect(attempts.rows).toHaveLength(2);
    expect(attempts.rows.map((row) => row.asset_id).sort()).toEqual(
      [firstAsset, secondAsset].sort(),
    );
    await expect(
      pool.query(
        `INSERT INTO upload_attempts (id, actor_user_id, media_class, asset_id)
         VALUES ($1, $2, 'work_cover', $3)`,
        [key, firstActor, secondAsset],
      ),
    ).rejects.toMatchObject({ code: "23505" });
  });

  it("rejects incomplete terminal states and unavailable asset metadata", async () => {
    const actorId = await createUser();
    const assetId = await createPendingAsset(actorId);
    const key = randomUUID();
    await pool.query(
      `INSERT INTO upload_attempts (id, actor_user_id, media_class, asset_id)
       VALUES ($1, $2, 'work_cover', $3)`,
      [key, actorId, assetId],
    );
    await expect(
      pool.query(
        `UPDATE upload_attempts SET state = 'rejected', completed_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND actor_user_id = $2`,
        [key, actorId],
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query(
        `INSERT INTO upload_attempts
          (id, actor_user_id, media_class, state, completed_at)
         VALUES ($1, $2, 'work_cover', 'accepted', CURRENT_TIMESTAMP)`,
        [randomUUID(), actorId],
      ),
    ).rejects.toMatchObject({ code: "23514" });
    await expect(
      pool.query("UPDATE media_assets SET status = 'available' WHERE id = $1", [
        assetId,
      ]),
    ).rejects.toMatchObject({ code: "23514" });
    const asset = await pool.query<{ status: string }>(
      "SELECT status FROM media_assets WHERE id = $1",
      [assetId],
    );
    expect(asset.rows[0]?.status).toBe("pending");
  });

  it("enforces one active target slot and immutable versioned reference history", async () => {
    const actorId = await createUser();
    const workId = randomUUID();
    ownedWorks.push(workId);
    await pool.query(
      `INSERT INTO works
        (id, title, slug, type, story_status, updated_at)
       VALUES ($1, 'Reference work', $2, 'manga', 'ongoing', CURRENT_TIMESTAMP)`,
      [workId, `reference-${workId}`],
    );
    const firstAsset = await createPendingAsset(actorId);
    const secondAsset = await createPendingAsset(actorId);
    for (const assetId of [firstAsset, secondAsset]) {
      await pool.query(
        `UPDATE media_assets SET
          content_type = 'image/jpeg', byte_length = 10, width = 600,
          height = 800, sha256 = repeat('a', 64), status = 'available',
          available_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [assetId],
      );
    }
    const referenceId = randomUUID();
    await pool.query(
      `INSERT INTO media_references (id, asset_id, work_id, slot, updated_at)
       VALUES ($1, $2, $3, 'work_cover', CURRENT_TIMESTAMP)`,
      [referenceId, firstAsset, workId],
    );
    await pool.query(
      `INSERT INTO media_reference_events
        (reference_id, actor_user_id, action, to_asset_id, result_version)
       VALUES ($1, $2, 'bound', $3, 0)`,
      [referenceId, actorId, firstAsset],
    );

    await expect(
      pool.query(
        `INSERT INTO media_references (asset_id, work_id, slot, updated_at)
         VALUES ($1, $2, 'work_cover', CURRENT_TIMESTAMP)`,
        [secondAsset, workId],
      ),
    ).rejects.toMatchObject({ code: "23505" });
    await expect(
      pool.query(
        `INSERT INTO media_reference_events
          (reference_id, actor_user_id, action, from_asset_id, to_asset_id, result_version)
         VALUES ($1, $2, 'replaced', $3, $4, 0)`,
        [referenceId, actorId, firstAsset, secondAsset],
      ),
    ).rejects.toMatchObject({ code: "23505" });
    await expect(
      pool.query(
        `INSERT INTO media_references (asset_id, work_id, slot, updated_at)
         VALUES ($1, $2, 'work_background', CURRENT_TIMESTAMP)`,
        [randomUUID(), workId],
      ),
    ).rejects.toMatchObject({ code: "23503" });
  });
});

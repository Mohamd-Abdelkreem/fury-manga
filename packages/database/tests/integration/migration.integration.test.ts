import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { promisify } from "node:util";

import { Pool } from "pg";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const initialMigration = "20260818000000_init_authentication";
const contentMigration = "20260922010000_content_domain_foundation";

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
  const execution = await execFileAsync(
    process.execPath,
    [pnpmScript, "exec", "prisma", "migrate", "deploy", "--config", configPath],
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
        "publication_events",
        "refresh_tokens",
        "users",
        "work_categories",
        "works",
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
        "phone",
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

  it("upgrades populated P00 state to P01 and leaves no pending migration", async () => {
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
        "INSERT INTO users (id, email, password_hash, full_name, status, email_verified_at, updated_at) VALUES ($1, $2, $3, $4, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        [userId, "staged-upgrade@example.com", "hash", "Staged User"],
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

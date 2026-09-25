# P03 Smallest Real Acceptance Journey

Run this **after P03 implementation and its forward migrations**, not against the current fixture UI. It is a local/staging validation guide, not deployment authorization or implementation code. [The contract](contracts/content-admin.md) defines statuses and [the data model](data-model.md) defines durable invariants.

## Prerequisites and startup

- Node.js 24, pnpm 11, Docker with PostgreSQL 18/Testcontainers available; a writable private `MEDIA_STORAGE_ROOT` outside the checkout. Confirm P01/P02 exit-gate evidence, including media persistence/backup-recovery. Use an isolated database and real image files valid for `work_cover`; do not run against production/user data.
- From the repository root, after reviewing `.env.example` and `apps/web/.env.example`, create `.env` and `apps/web/.env.local` if absent. Set distinct ≥32-character `AUTH_*_SECRET` values, matching `DATABASE_URL`/`POSTGRES_PORT`, `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`, and the private media directory. Never commit environment secrets. For a local admin, set all three `SEED_ADMIN_*` values in `.env`; inspect the seed behavior before running it on an existing database.

```powershell
pnpm install --frozen-lockfile
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate:deploy
pnpm db:seed
pnpm dev
```

`pnpm db:seed` is needed only if the isolated database has no active verified ADMIN and the local seed variables are deliberately configured. The actual web/API URLs are `http://localhost:3000` and `http://localhost:4000/api/v1`. Verify `/api/v1/health/ready` reports ready before the browser journey. Do not use `db:migrate:reset`, `db:push`, or destructive cleanup on an existing database.

## Browser journey

1. Sign in as the active, verified administrator. Open `/admin/categories`. Create one category with a unique slug. Reload, confirm the same UUID/name/slug/enabled position, move it relative to another saved category if available, disable/re-enable only when safe, and confirm usage begins at zero. Check collection-empty versus filtered-empty and list failure/retry if the isolated database supports fault injection.
2. Open `/admin/works/new`. Create an illustrated (`manga`) draft with a unique slug, title, synopsis and author, select the saved enabled category, upload a real cover through P02 and select its accepted candidate. Before Save, the image is labelled candidate only. Save draft and reload `/admin/works/{workId}/edit`; verify stable ID/slug/type, all fields, category, and saved cover association. The editor's preview remains private and does not claim a public `/story` page.
3. Repeat for a text work (`text-story`) with its own slug/cover. Publish both with the current form's combined save-and-publish action. Reload detail/list: both are published, have one current publication event/time, and the existing public metadata GET `/api/v1/content/works/{workSlug}` finds each approved projection without private fields. P03 does **not** require chapters or public image delivery.
4. For each of the illustrated and text works, unpublish, archive and restore in order, checking admin state after reload each time. Public metadata direct read returns the same 404 for draft/archive as for unknown slug, and list omits it. Restore yields draft, not automatic republish; a separate publish succeeds after fresh readiness check. Record all five SC-004 actions and resulting states for both types.
5. Cause one controlled validation failure (e.g. remove the only enabled category before publishing) and one stale edit in two admin sessions. Confirm Arabic field/conflict feedback, unchanged authoritative state and preserved unsaved draft. If a combined save-and-publish failure is injected after an early dependent write, inspect final Work, membership, active media references and publication events: all submitted effects rolled back, no new Work or false success. After an ambiguous network result, refresh authoritative detail before retry.
6. Repeat the primary tasks keyboard-only at 320px/390px and desktop: visible focus, Arabic RTL and LTR slug isolation, dialog Escape/focus return, labelled controls, validation focus and live status/error announcements, no horizontal overflow or reduced-motion violation. For each of the four affected admin screens, inject one recoverable error at narrow and desktop widths and record successful keyboard-only recovery without losing a draft or showing fixture data. An ordinary user, pending/suspended account and visitor cannot use management routes; a visitor sees only published metadata. Preserve unrelated fixture domains without presenting their numbers as P03 live truth.

## Focused automated gates

```powershell
pnpm --filter @fury/contracts test
pnpm --filter @fury/database test
pnpm --filter @fury/database test:integration
pnpm --filter @fury/api test
pnpm --filter @fury/api test:integration
pnpm --filter @fury/web test
pnpm --filter @fury/contracts lint
pnpm --filter @fury/database lint
pnpm --filter @fury/api lint
pnpm --filter @fury/web lint
pnpm --filter @fury/contracts check-types
pnpm --filter @fury/database check-types
pnpm --filter @fury/api check-types
pnpm --filter @fury/web check-types
pnpm verify
```

Run focused test files for changed modules before the aggregate gate when iterating. `pnpm verify` is the final coherent implementation gate with Docker available; it includes formatting, lint, types, all unit/integration tests, build and diff check. Failure checks must inspect persisted rows and public/admin responses, not response status alone. Log actual command outcomes, warnings, browser widths, migration upgrade/redeploy result, and unverified staging/production/device boundaries. This guide makes no claim that the current checkout has passed these P03 checks.

# P02 Real Acceptance Quickstart

This is the smallest runnable validation journey **after P02 implementation**. It is not a claim that the current checkout already has media endpoints. The expected request/response shapes are in [contracts/media-http.md](contracts/media-http.md), and persisted/reference state is in [data-model.md](data-model.md).

## Prerequisites

- Confirm formal P00/P01 exit gates and accepted disposition of the P02 Draft spec and reviewer-owned readiness checklist. Current P01 implementation notes and the P02 checklist do not yet provide that acceptance. Use Node.js 24, pnpm 11, Docker with PostgreSQL 18, and the existing Fury checkout; the following commands are existing package scripts/Compose commands, not new implementation commands.
- Keep existing user `.env` and `apps/web/.env.local` edits. For a fresh local setup in PowerShell only, run `Copy-Item .env.example .env` and `Copy-Item apps/web/.env.example apps/web/.env.local`; replace four `AUTH_*_SECRET` placeholders with separate random values. `NEXT_PUBLIC_API_URL` must point to `http://localhost:4000/api/v1` for this local journey.
- Configure the planned `MEDIA_STORAGE_ROOT` in `.env` to an absolute, private, writable directory outside the repo and replaceable release trees. The implementation must reject missing, relative, symlinked, or public/release-local roots. Ensure enough disk space for the representative image and restore copy. Do not put a production path or secret in `.env.example`.
- Set all three optional local `SEED_ADMIN_EMAIL`, `SEED_ADMIN_NAME`, and `SEED_ADMIN_PASSWORD` values in `.env` for a local active/verified ADMIN account, or use an already active/verified ADMIN. Never run the optional seed against production. Use one valid JPEG cover around 3:4 within the [published P02 limits](contracts/media-http.md#upload), and keep a copy/hash for comparison. Have a second non-admin account for denial checks.

## Start and focused checks

From repository root in PowerShell:

```powershell
pnpm install --frozen-lockfile
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate:deploy
pnpm db:seed
pnpm dev
```

The existing web and API development servers should be reachable at `http://localhost:3000` and `http://localhost:4000/api/v1`. Do not use `db:push`, `db:migrate:reset`, or an existing developer database to simulate the migration gate. In another terminal, run the focused evidence commands after implementation:

```powershell
pnpm --filter @fury/contracts test
pnpm --filter @fury/database test:integration
pnpm --filter @fury/api test:integration
pnpm --filter @fury/web test
pnpm test:web-routes
```

Testcontainers needs a working Docker engine. At phase acceptance, run `pnpm verify` after all touched packages and documentation are integrated; report every actual result/warning. A green local suite does not certify a deployed VPS.

## One end-to-end media journey

1. Sign in as the active/verified ADMIN in the browser. Use the existing P01 admin content API to create a draft Work identity if none is available (`POST /api/v1/content/admin/works`; strict fields `title`, `slug`, `type`, `storyStatus`, with current bearer and CSRF). Record its returned Work UUID. The fixture-backed `/admin/works` form is not proof that a P01 Work row was created.
2. In the affected admin work media control, choose the valid cover. Confirm a local preview appears, transfer progress and server-processing state are distinct, and the control does not announce saved media at 100% transfer. Submit the upload as class `work_cover`. Record the attempt UUID and accepted asset UUID returned by `POST /api/v1/media/assets`. Refresh the browser; `GET /api/v1/media/uploads/:attemptId` must report accepted with the same asset ID, and an authorized metadata/binary read must return the validated cover. The parent Work is still a draft and must not be described as saved or published by this upload.
3. With the same ADMIN session, create the narrow P02 active cover reference using `POST /api/v1/media/references` with `{targetKind:"work_cover", targetId:<Work UUID>, assetId:<asset UUID>}`. Fetch it by target and verify one active reference and a stable version. `DELETE /api/v1/media/assets/:assetId` must return `409 MEDIA_IN_USE`, queue no deletion, and leave the image readable.
4. Restart the API process (`pnpm dev` after stopping the current development process) and repeat the authenticated metadata/binary read. The asset UUID, byte content/hash, type, and active reference must agree with the earlier result. A simulated release replacement must leave the configured media root intact; verify the same read again.
5. As an unauthenticated visitor and then as the second non-admin account, request that exact asset metadata/content and try removal. Visitor gets the current 401 session failure; the other user's protected-resource lookup gets non-disclosing 404, and removal does not change reference/file state. A USER may upload an own avatar but cannot upload `work_cover`; an ADMIN cannot read another user's private avatar merely by role.
6. Abort an upload or interrupt after transfer and query its attempt before retrying. It must show pending/rejected/accepted truth without duplicate accepted assets or a false success. In an isolated fault exercise, run reconciliation: an incomplete/unprovable file settles the attempt to rejected `UPLOAD_INCOMPLETE`; the same key cannot create an asset, while a new key can. Fully validated final bytes may settle the original attempt to accepted only after matching the reserved identity/hash. Have two authorized accounts use the same UUID attempt key and confirm independent outcomes without cross-account disclosure. Try a mismatched extension/MIME/decoded image and a file beyond the class bound; confirm safe 415/400/413 results and no retrievable partial file. If storage is deliberately unavailable in an isolated test environment, the API must fail closed rather than fall back to a release directory. When storage becomes unavailable after startup, `/health/ready` must return its existing degraded 503 envelope without changing `/health/live` or revealing the root path.

## Recovery and UI failure checks

Use the implementation runbook to make a coordinated database/media backup of the sample Work, asset, attempt and live reference. Restore into a clean isolated instance, verify stored hash and authorized image delivery, then verify the same unauthorized denial. In a second isolated exercise, remove/corrupt one file and confirm a known authorized read yields a safe unavailable result, redacted operational evidence and no substituted image. Do not damage the working local dataset to run this check.

At 320px and a larger viewport in a real browser, verify Arabic RTL labels, keyboard file selection/retry, focus after error/conflict, live progress/error/success announcements, narrow layout and reduced-motion presentation. Cancel, retry, rapid reselection and stale response must preserve the current selected file and unrelated parent draft. A saved asset must never be announced as a published Work or selected account avatar. Record any physical-device, production VPS permission, proxy/cache, and backup-destination checks not performed as unverified.

# P04 Quickstart and Acceptance Journey

Use this guide **after P04 implementation and accepted dependency gates** to record fresh evidence. The current checkout still has fixture-backed Chapter forms; these steps are the required validation, not a claim that they already pass. The P04 spec is Draft and its reviewer readiness checklist remains open. Expected API shapes are in [Chapter HTTP contract](contracts/chapter-http.md); invariants and migration gates are in [data model](data-model.md).

## Local prerequisites and start

Use Node.js 24, pnpm 11 and Docker/PostgreSQL 18 as in the repository [README](../../README.md). Provide a writable private `MEDIA_STORAGE_ROOT` outside the checkout and independent non-placeholder `AUTH_*_SECRET` values in `.env`. Configure `NEXT_PUBLIC_API_URL` through `apps/web/.env.local` (the example points to `http://localhost:4000/api/v1`). Do not commit credentials or private media. The following PowerShell startup is for a fresh empty local database, or one already expanded, remediated, and approved for enforcement:

```powershell
pnpm install --frozen-lockfile
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
if (-not (Test-Path apps/web/.env.local)) { Copy-Item apps/web/.env.example apps/web/.env.local }
# Edit the copied environment files and create the private media directory.
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate:deploy
pnpm dev
```

If the files already exist, preserve their values rather than overwriting them. Set all three optional `SEED_ADMIN_*` values in `.env` and run `pnpm db:seed` for a local administrator, or use an existing active verified ADMIN. Do not run `db:migrate:reset` or `db:push` against real data. Confirm the API and web app start with no migration/media-root error before proceeding.

### Populated-data upgrade gate

Do **not** run the combined P04 migration directory through one `pnpm db:migrate:deploy` on an unremediated P01–P03 database. On a restored populated copy, record the P02/P03 gate disposition, baseline migration versions, Chapter/media inventory, and database-plus-media recovery point. Stage a first deployable revision containing only the expand migration; apply it while the last compatible public title-free API remains in use and independent old editorial-client writes are blocked. Record the applied expand version. An authorized operator then records real title/media decisions and performs bounded, audited remediation through a controlled path; preserve IDs and events and use a supported publication transition for any explicit state change. Repeat the inventory until final title, page order/reference, and published-readiness violations are zero. Missing editorial decisions stop the upgrade.

Only after that result, stage the separate enforcement migration and coordinated shared-contract/API/web cutover. Apply enforcement, verify both migration versions and final constraints/rows/events, inspect OpenAPI and public/private projections, then reopen editorial writes. A failed expand, remediation, or enforce stage stops cutover and follows the forward recovery decision in [data-model.md](data-model.md); do not edit applied migrations or assume that restoring a database alone restores its media. Rehearse this sequence and failure/recovery on a disposable populated copy. Production execution, backup restore, and rollback evidence remain separate authorization and release gates.

## Smallest real browser journey

1. Sign in as the active verified ADMIN at `http://localhost:3000`. Create or select one saved illustrated Work and one saved text Work using the existing P03 admin Work workflow. Make each Work eligible and published using its real persisted cover/category/synopsis/author. Record both Work IDs and slugs.
2. Open `/admin/works/{illustratedWorkId}/chapters/new`. Enter a title and whole Chapter number. Upload two real `chapter_page` images through the private picker, wait for each accepted attempt, reverse their order, and save. Confirm the server response, reload the page, and verify the title, stable page identities, exact order, and full admin preview. Replace one image, remove/re-add as needed, save and reload again; inspect that retained media-reference events exist and the final active order is consecutive. The preview must show saved content distinctly from unsaved changes.
3. Open `/admin/works/{textWorkId}/chapters/new`. Create a title/number and a version-1 document with a paragraph, H2, H3, bold, italic, ordered/unordered list and safe same-site link. Save, reload and compare editor/preview order and formatting. Confirm no quote/image/raw-markup tool or manual content-type switch exists. An empty private draft may save but cannot publish.
4. Publish each ready Chapter through the confirmation control. Wait for the authoritative result, reload both routes, and inspect public metadata through `GET /api/v1/content/works/{workSlug}/chapters` and `/chapters/{chapterNumber}`. Only identity, number, title, type, Work ID and published time appear. No body, page/media URL, version or event history appears. Repeat each publish: `transitioned:false` and the same current event ID, with no new event row. Compare admin preview with the shared core renderer; do not treat the fixture reader as evidence.
5. Unpublish one Chapter. Its public metadata must disappear with the same 404 shape as an absent/private number, while the admin Chapter, body/pages and publication history remain. Restore or republish via the allowed lifecycle and verify a later real republish creates a distinct event. Set one illustrated image unavailable through the tested P02 reconciliation/recovery path: public list **and total** and direct detail hide that Chapter, admin still reports published with unchanged event history. After verified repair, the same metadata returns without a new event.

## Failure, access and state checks

- Test visitor, ordinary active user, non-admin Work owner, moderator without ADMIN, inactive/unverified user, expired session, and missing CSRF on unsafe methods. Private admin reads/writes must deny before exposing Chapter or media identity. Wrong Work/Chapter pairing is 404. Public draft/archived/hidden and nonexistent records give indistinguishable unavailable results.
- Try duplicate and fractional/zero/negative/out-of-range numbers, title-only whitespace, foreign or unavailable asset, pending/rejected upload, unsafe/external link, raw markup and unsupported text node. Check safe field errors and **unchanged final database state**. Retry an uncertain upload through its attempt lookup before reusing its asset; do not assume a spinner or HTTP status proves association.
- With two admins, send concurrent duplicate creates, stale edits, page reorder/replacement, and publication retries. Inspect Chapter version, active ordered pages, active references, retained events and public result after each race. Exactly one winner; no duplicate number, mixed page sequence or duplicate publication event. Inject a mid-save failure in the integration test and verify full rollback.
- Exercise an empty Work, no-match search, every state filter, number/date sort, later/out-of-range page and background refresh. Rows and filtered total must agree; no fixture result appears after an error. On 409, keep the unsaved draft and offer authoritative reload. On uncertain network outcome, do not display confirmed success before checking the server.
- At 320px, 390px, 768px, and a meaningful desktop width, keyboard-operate the Arabic RTL list, form, page order/removal, dialogs and preview with long Arabic labels. Check labels, live errors/progress, focus entry/return, Escape dismissal, and no ordinary horizontal overflow. Measure changed target sizes against `DESIGN-SYSTEM.md`'s 24×24 CSS px minimum or documented exception, with mobile primary controls near its 44px target. Measure contrast against [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/): at least 4.5:1 for normal text, 3:1 for large text and essential non-text control boundaries; inspect reduced-motion behavior in a real browser. Record the inspected controls, measurements, browser/device names, sizes, and outcomes; jsdom tests alone do not satisfy this check.

## Focused automated and release checks

Run new P04 contract, content/media service, real HTTP/PostgreSQL, web adapter/hook/component and migration tests through the existing package scripts. The broad commands are:

```powershell
pnpm --filter @fury/contracts test
pnpm --filter @fury/database test:integration
pnpm --filter @fury/api test
pnpm --filter @fury/api test:integration
pnpm --filter @fury/web test
pnpm verify
```

`pnpm verify` is the final integrated repository gate; it also runs schema validation/generation, formatting, lint, types, builds, output checks and `git diff --check`. Record command exit codes and inspect final rows/events/visibility, not just test counts or HTTP 200. Before any production-ready claim, separately record a populated migration, coordinated API/web cutover, browser/device checks, deployment smoke test, database plus media backup/restore, and rollback or roll-forward rehearsal. This planning artifact records none of those as completed.

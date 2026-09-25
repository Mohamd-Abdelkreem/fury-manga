# Implementation Plan: Persistent Admin Categories and Works

**Branch**: `004-admin-categories-works` (feature identifier; no Git branch created) | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**PLAN.md Phase**: P03 — Persistent Admin Categories and Works | **Dependencies Accepted**: P01 and P02 implemented in this checkout; formal exit gates remain to be confirmed before P03 acceptance.

**Input**: P03 specification pending reviewer acceptance; its 2026-09-25 all-or-nothing save-and-publish clarification is recorded. Do not treat the draft label or unchecked reviewer checklist as an accepted implementation gate.

## Summary

Connect the four existing Arabic RTL admin routes to authoritative category/work data. Extend P01 content contracts, services, queries, schema, and publication rules and compose P02 media references into the same editorial transaction. Keep published metadata behind the existing public read boundary; P03 does not connect the public catalog UI or public image delivery. Retire only category/work fixture and local-write paths while preserving unrelated admin fixtures for their later phases.

## Technical Context

**Language/Version**: Node.js 24, TypeScript 5.9 strict ESM.

**Primary Dependencies**: Installed pnpm 11.17/Turborepo 2.10; Next.js 16.2/React 19.2, React Query 5.101, React Hook Form 7.84, Zod 4.4, Axios 1.19; Express 5.2, Prisma 7.9/PostgreSQL 18. No added package or parallel HTTP/auth/store layer.

**Storage**: Existing `@fury/database` PostgreSQL models and P02 persistent private media assets/references; forward-only migrations.

**Testing**: Vitest, Supertest actual Express stack, PostgreSQL Testcontainers, Testing Library/jsdom, and a real-browser keyboard/RTL/narrow-screen journey.

**Target Platform**: Next.js web client and Linux-hosted Express API.

**Project Type**: pnpm/Turborepo monorepo.

**Performance Goals**: Bounded database-side queries and stable paginated results; no unsupported latency, throughput, or availability target.

**Constraints**: Existing maximum page limit 100; P03 field limits in the spec; no hard deletion, public image delivery, or new role. Preserve current auth/CSRF/rate-limit protocol and approved RTL design.

**Scale/Scope**: Four existing admin routes, existing content/public metadata and private-media APIs, affected contracts/schema. No evidence supports a traffic or catalog-size forecast.

## Constitution Check — before research

1. **PASS — Scope and reality**: P03 depends on P01/P02; P01 basic CRUD/publication and P02 private media persist. `AdminCategories` uses fixtures/local state; `AdminDataProvider` resets work/chapter fixtures; work form has a mock delay, sample images, title-derived slug and unbound media picker. Preserve visual shell/auth; exclude P04 chapter, P05 catalog, hard delete/merge, metrics/activity implementation. Exit gate is the spec's durable two-type journey.
2. **PASS — Authority and privacy**: Existing bearer auth checks current active/verified user, then ADMIN role, then CSRF on unsafe routes. Service rules/allowlisted mappers remain authoritative. Ordinary users receive 403; unauthenticated/pending/suspended receive 401; unknown admin identity and private public work return 404. Existing global limiter remains; no new public write surface.
3. **PASS — Contract agreement**: Extend `@fury/contracts` Zod schemas and API DTO aliases, runtime routes, OpenAPI, web adapters and tests together. Exact changes are in [contracts/content-admin.md](contracts/content-admin.md).
4. **PASS — Architecture**: Reuse content controller/services/queries/mappers/composition and thin App Router pages; add feature-local web API/hooks/keys/models. One transaction-aware media seam is needed for the accepted atomic save, not a repository or extra client.
5. **PASS — Data and races**: [data-model.md](data-model.md) defines constraints, ordering, transactions, retries, legacy published data and forward migration. Existing work version/history remain; no applied SQL or generated client edited.
6. **PASS — Frontend truth and access**: Query owns server state, form owns drafts, P02 picker supplies candidates. Denial, stale completion, dirty conflict, Arabic feedback, focus, 320px/desktop and reduced motion are planned. Installed Next 16 App Router `page.md`, `05-server-and-client-components.md`, and `use-router.md` were read; dynamic params stay promises and navigation remains client-side.
7. **PASS — Evidence**: The matrix below selects contract, service, PostgreSQL, actual HTTP, web hook/component, browser, migration and documentation evidence rather than status-only assertions.
8. **PASS — Change safety**: Before setup, `git status --short` showed only modified `.specify/feature.json` and untracked `specs/004-admin-categories-works/`; preserve them. This workflow edits feature design only, stops after Phase 1, and does not authorize app edits, PLAN changes, commit, deployment or destructive database operations.

## Repository Touchpoints and Ownership

| Owner                | Reuse/change/add/retire during implementation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared wire contract | Extend `packages/contracts/src/content/content.schema.ts`, `packages/contracts/src/media/media.schema.ts` (only the new published-cover conflict code), `packages/contracts/src/index.ts` and affected schema tests. Keep `packages/contracts/src/http/http.schema.ts` envelope/pagination ownership.                                                                                                                                                                                                                                                                                                                                                |
| Database             | Extend `packages/database/prisma/schema.prisma`; add forward migrations after `20260923010000_persistent_vps_media`; expand schema and `tests/integration/{content-domain,migration,media-domain}.integration.test.ts`. Never edit existing migrations or `src/generated/prisma`.                                                                                                                                                                                                                                                                                                                                                                    |
| API                  | Extend `apps/api/src/modules/content/{category-management,work-management,publication-management,public-content}.service.ts`, `content.{routes,queries,mapper,rules,errors}.ts`, `dto/content.dto.ts`, `content-management.controller.ts`, and `apps/api/src/infrastructure/openapi/openapi.ts`. Keep `apps/api/src/router.ts` as composition root; wire a shared transaction-aware media collaborator there. Change only affected P02 `apps/api/src/modules/media/{media.service,media.queries,media.rules}.ts` and `apps/api/src/infrastructure/media/media-reconcile.ts` seams to protect published cover eligibility; no general media refactor. |
| API evidence         | Extend content rule/mapper/service and real-stack tests in `apps/api/src/modules/content/`, `apps/api/src/content.integration.test.ts`, P02 media integration and OpenAPI tests. Preserve chapter/auth behavior.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Web route/feature    | Keep `apps/web/src/app/admin/{categories,works,works/new,works/[workId]/edit}` thin. Change `AdminCategories`, `AdminCategoryDialog`, `AdminWorks`, `AdminWorkEdit`, `AdminWorkForm` and its basic/media/SEO fields, relevant CSS/tests. Add `apps/web/src/features/admin/{api,hooks,model}` for content requests, query keys, draft/conflict rules and safe Arabic errors. Reuse central `api-client.ts`, P02 media feature, admin dialogs/notices/pagination/badges/focus helper.                                                                                                                                                                  |
| Fixture boundary     | Remove `ADMIN_CATEGORY_FIXTURES` as category source and `INITIAL_ADMIN_WORKS`/work mutation methods from `admin-context.tsx` and `use-admin-work-actions.ts` only after replacing P03 consumers. Preserve chapter fixture methods for P04 and unrelated admin fixtures. `AdminDashboard`/`AdminLayout` must not show fixture work counts/cards as live P03 truth; use scoped live summaries where needed or label unrelated dashboard/activity as demo. Retire work-specific reset-to-fixtures; preserve unrelated truthful demo reset if used.                                                                                                      |
| Documentation        | Update `README.md`/`PROJECT_REFERENCE.md` only where P03 API/schema/current-state claims change, OpenAPI for each changed route, and relevant media/recovery operational guidance. Confirm claims against source.                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### End-to-end request ownership

`App Router page → AdminCategories/AdminWorks/AdminWorkForm → admin-content React Query hook → feature API adapter → existing apiClient (bearer + refresh + CSRF) → /api/v1/content/admin route (global limit → live auth → ADMIN → CSRF on writes → strict validation) → thin ContentManagementController → category/work/publication service → content queries/explicit mapper → Prisma transaction → PostgreSQL`. The upload candidate path remains `AdminMediaCandidatePicker → media hooks/API → apiClient → P02 media route/service/storage`; only successful editorial save binds its asset ID. Public metadata stays in the existing Express `/content/works` read and explicit public mapper; P03 adds no browser public adapter.

`apps/api/src/router.ts` supplies dependencies and clock/ID seams. A focused media-reference helper accepts the same Prisma transaction for work editorial writes and P02 direct reference routes; it enforces class/status, active-slot uniqueness, history events and published-work eligibility without nested transactions. Controllers remain HTTP-only; selectors/mappers stay feature-local (B01–B08, B34–B36; F01/F24). Browser imports contracts, never API/database modules.

## Design Decisions and Invariants

1. **Atomic editorial command**: Extend existing POST/PATCH work endpoints with P03 fields, category IDs, tags, cover/background asset IDs and optional publish target. Create-publish or edit/save-and-publish is one serializable transaction: work metadata, category/tag replacement, media reference changes/events, readiness check, publication state/event commit together. On any failure, rollback every submitted effect; uploaded asset remains only a candidate. Pure transitions keep P01 PUT but use the same readiness rule. Archived cannot publish directly. Current event pointer/time change only for actual publish; same-state retry adds no event. Never save an intermediate draft after failed publish.
2. **Create recovery without new ledger**: P03 UI supplies a stable random UUID `id` in the create body, retained for the attempt. Legacy P01 callers may omit it and keep server-generated IDs. After timeout/ambiguous acknowledgement, UI first GETs that ID and compares authoritative identity/state before success or retrying the same ID. Occupied ID/slug with different intent conflicts. A GET 404 can race the first request; a subsequent retry conflict prompts another GET. No automatic POST retry. Category create uses the same optional UUID.
3. **Category order/protection**: Add global positive unique `displayPosition` and `enabled`. Backfill legacy order by `(createdAt,id)`. Create appends in serializable transaction; unique constraint arbitrates races. Move PUT supplies expected category version and adjacent target position; boundary/already-achieved request returns unchanged, otherwise swap under ordered locks and advance both revisions. Disabling locks affected published works/associations, checks each retains another enabled category and preserves all associations. Usage is computed from current distinct memberships, not stored. Work-category replacement/publication take compatible locks and recheck (B06–B10/B27/B41).
4. **Readiness/featured/media**: Drafts may be incomplete. Before any publication or intentional edit of a published work, require bounded complete metadata, enabled category and available associated cover. Direct administrative P02 cover retirement/replacement cannot invalidate a published work; replace atomically or refuse retirement, and advance the parent Work version. The database guard rejects intentional editorial, category, reference, or asset-removal changes that would create an ineligible published work. It permits system reconciliation to mark an asset `UNAVAILABLE` when stored bytes fail verification; this is an observed storage failure, not a successful editorial change. Public metadata immediately excludes the affected work and flags operator remediation. Restoration to `AVAILABLE` requires verified bytes and a fresh readiness check before public re-exposure. Never disclose broken cover or claim public image delivery. Draft/archive retain featured preference, while only published featured order is unique.
5. **Lists**: Database-side bounded search/filter/order/count; identical predicate and consistent snapshot for rows+total; `id` tie-breakers. Default page 1/limit 25, maximum 100, safe offset. Work sorts: updated desc, created asc, title asc with deterministic database collation, chapter count desc including true zero. Stable order applies to unchanged result state, not a moving snapshot. Categories position asc/ID with name/slug search. Enabled category picker pages/searches without unbounded fetch. No fabricated views/activity/SEO metrics.
6. **Compatibility**: Existing P01 minimal create/update bodies stay accepted and default to draft/empty optional P03 fields; chapter routes stay unchanged. Expanded strict output DTOs may break independently deployed strict older clients, so coordinate API/contracts/web deployment and test old minimal requests plus new projections. No public image URL in P03.

See [research.md](research.md), [data-model.md](data-model.md), and [contracts/content-admin.md](contracts/content-admin.md) for rationale, schema and exact routes.

## Security and Failure Analysis

| Threat/failure                                           | Control and observable result                                                                                                                                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claimed ADMIN, pending/suspended account, missing bearer | Current auth reads live user/status/verification then role; no write/private projection. 401/403 per contract; tests include role-claim forgery.                                                  |
| Cross-site unsafe request                                | Existing double-submit CSRF after auth and before body validation; no GET mutation. Keep CORS/client.                                                                                             |
| Draft/archive probing                                    | Management requires ADMIN; public slug lookup returns 404 for private or absent. No raw media paths, actor IDs, history or internals in public DTO.                                               |
| Forged category/media/featured fields                    | Strict bounded Zod; service verifies enabled category and P02 asset class/scope/status; FK/unique/check/trigger backs races. Wrong-class/missing private media fails non-revealingly.             |
| Concurrent moves/disable/edit/publish/media              | Ordered locks, version CAS, serializable transaction and constraints; one winner, loser stable stale/conflict. No blind destructive replay.                                                       |
| Timeout or failure after first dependent write           | Client checks authoritative ID/version/state; API success follows commit; PostgreSQL rollback proves no partial associations/media/publication events.                                            |
| Editorial/storage data in logs/errors                    | Existing AppError, request ID and redacted logger; no bodies, cookies, raw paths/Prisma/provider objects in response/cache/logs. Arabic UI maps codes, not raw message.                           |
| Abuse                                                    | Existing environment-configurable global limiter (default 100/window), auth/CSRF, bounded queries/bodies. Verify limiter's per-process scope; no distributed claim or new public-write subsystem. |

## Frontend State, Cache and Access

- Query keys include current actor/session and resource: category list `(search,page,limit)`, category detail, work list `(search,type,story,publication,sort,page,limit)`, work detail `(id)`, separate media keys. Query functions accept `AbortSignal`; obsolete actor/work/filter completions are ignored. No broad `QueryClient.clear` for writes. Category changes invalidate category lists/details/picker, usage and affected work/public metadata; work changes invalidate detail/lists, category usage, media references and existing public metadata consumers. Ambiguous outcome is refetched before a success claim.
- Form state (installed React Hook Form/Zod integration, adapting current fields) is transient draft, initialized after first detail GET. Later data syncs only when pristine. Dirty remote editable change offers adopt-server/continue-draft; continuing uses fresh expected version. Transient refresh error retains clearly stale known draft; terminal denial masks private data and blocks actual handlers. Parent failure does not destroy editor. Route/session changes cancel/fence late work. `ProtectedRoute` remains presentation only; denial/recovery follows F07/F08/F27.
- List/form distinguish initial loading, background refresh/stale-known, collection empty, filtered empty, unavailable/retry, denied, pending, field validation, duplicate/stale/conflict, save success, publish success, idempotent unchanged and ambiguous check/retry. Category movement always uses global positions, even under a search filter; existing disabled associations stay visible/removable, while new selection shows only enabled categories. Remove delay/sample images/fake counts/reset/invented `/story/${id}` links. Saved preview is admin-only metadata using persisted slug and an unsaved marker; do not promise P05 page.
- Reuse Arabic RTL layout, badges, dialogs, headers, tables and media preview. Put slug/UUID in `dir="ltr"`/`bdi`; test keyboard, dialog trap/Escape/focus return, first-invalid focus, label/error associations, `alert`/`status`, visible focus, 320px/390px/desktop, long text, target size, contrast and reduced motion (F02/F06/F28/F29). No new visual theme.

## Verification Matrix

| Requirement/risk                                     | Implementation evidence                                                                                                                                                                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001/019 authority/privacy/CSRF/output             | Shared contract/mapper absence; actual-stack Supertest visitor, USER, forged ADMIN, pending, suspended, ADMIN; public private-slug 404; safe error/log sentinels/final transport headers.                                     |
| FR-002–005 category identity/order/usage/disable     | Contract bounds/duplicates; pure move; service; migrated PostgreSQL constraints and concurrent create/move/disable-vs-publish; HTTP final state/count after reload.                                                           |
| FR-006–010 identity/metadata/tags/categories/media   | Contract input/output; service transaction; PostgreSQL uniqueness/FK/reference history/rollback; real HTTP class/status; component draft/candidate tests.                                                                     |
| FR-011–014 readiness/transitions/visibility/featured | Pure transition/readiness; PostgreSQL partial uniqueness/cross-row guard/upgrade; HTTP publish/unpublish/archive/restore/public projection for both types; assert event pointer and no partial commit under injected failure. |
| FR-015/017 lists/fixture retirement                  | Query filter/sort/pagination/count ties/bounds; Query hook/rendered empty/filtered-empty/retry/stale; source/test inventory finds no P03 fixture path or fake metric.                                                         |
| FR-016/018/020 retry/RTL/access                      | Concurrent stale/duplicate final-state HTTP; create timeout reconcile; QueryClient cache/denial/draft/old response; keyboard/dialog/focus and real-browser 320px/desktop RTL journey in [quickstart.md](quickstart.md).       |
| Regression/release                                   | P01 chapter/public metadata and P02 media tests; OpenAPI route tests; fresh/populated migration, repeated deploy/rollback rehearsal, staged operations.                                                                       |

Actual focused scripts: `pnpm --filter @fury/contracts test`, `pnpm --filter @fury/database test`, `pnpm --filter @fury/database test:integration`, `pnpm --filter @fury/api test`, `pnpm --filter @fury/api test:integration`, `pnpm --filter @fury/web test`, package `lint`/`check-types`, `pnpm db:validate`, `pnpm build`, and `pnpm exec prettier --check` on docs. Run `pnpm verify` after a coherent cross-package implementation with Docker/Testcontainers available and again for release acceptance; it includes formatting, lint, types, unit/integration, build and diff check. No app suite is claimed run for this documentation-only plan.

## Rollout, Recovery and Stop Gates

1. Confirm P01/P02 acceptance evidence. Inventory published works, media references/status, categories and duplicates; snapshot database and P02 media together. No production content, deployment or destructive data operation is authorized here.
2. Stage additive schema/code: nullable metadata, category order backfill, tags/indexes. Keep old minimal admin requests functional. P03 server enforces readiness on writes and suppresses legacy incomplete published works from public metadata pending remediation; produce an operator-only inventory from the existing database, not a new public/admin UI report.
3. Before strict migration B, document and rehearse a non-destructive inventory against isolated populated data. Explicitly repair each legacy published record (complete metadata/cover/category or authorized return to draft, retaining identity/history); record zero invalid published rows and consistent media references as a blocking gate. Production inventory, repair, and migration require separate authorization. Apply later forward constraint/trigger validation and connect UI. Failed validation aborts rollout without dropping data; restore compatible app version, repair and retry. Database rollback is restore-based with P02 media only when necessary; never rewrite applied migrations.
4. Verify staged migration/redeploy, admin CRUD/transitions, public 404/visibility, media restart/reference recovery, browser RTL/keyboard/narrow flow, logs/header privacy and health readiness. Production/staging/device evidence remains unverified until authorized and performed. Stop now after Phase 1 design.

## Constitution Check — after Phase 1 design

1. **PASS**: Scope/exclusions/baseline above; no P04/P05 pull-forward.
2. **PASS**: Actor matrix, auth/CSRF/rate/privacy/safe failure in security and contract artifact.
3. **PASS**: Contract artifact names shared schemas, paths, statuses, OpenAPI/adapter compatibility.
4. **PASS**: Existing-stack request chain and focused media transaction seam; no new package/store/repository/client.
5. **PASS**: Data model, race/rollback, additive backfill, legacy remediation and recovery explicit.
6. **PASS**: UI states/access/RTL/browser and installed Next 16 docs explicit.
7. **PASS**: FR-to-layer evidence and commands explicit; no fresh app evidence claimed.
8. **PASS**: User edits preserved, docs-only checks/stop point and unauthorized actions explicit.

## Project Structure

```text
specs/004-admin-categories-works/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/content-admin.md
└── quickstart.md
```

**Structure Decision**: Reuse the real modules and files in Repository Touchpoints. `tasks.md` belongs to later `$speckit-tasks` and is not created here.

## Complexity Tracking

No constitutional violation or new dependency is proposed. The transaction-aware media seam and staged cross-row constraints are scoped necessities for accepted all-or-nothing publication and data integrity, not waivers.

# Implementation Plan: Content Domain Foundation

**Branch**: Not created (no branch hook configured) | **Date**: 2026-09-22 | **Spec**: [spec.md](./spec.md)

**PLAN.md Phase**: P01 — Content Domain and Contract Foundation | **Dependencies Accepted**: P00 is the sole dependency and is not proven accepted by the current checkout

**Input**: Feature specification from `/specs/001-content-domain-foundation/spec.md`

## Summary

P01 adds the first authoritative content domain without connecting the existing
fixture-backed screens. It extends `@fury/contracts` with strict, bounded content and
pagination schemas; adds an Express content module with credential-free public metadata
queries and active/verified-ADMIN management operations; and adds an additive Prisma/
PostgreSQL model for works, categories, assignments, chapters, ordered page metadata,
and immutable publication events. Conditional versioned writes and transactions make
publication, relationship replacement, and chapter-content replacement race-safe.

The owner accepted the written P01 requirements and reviewer-owned readiness checklist
on 2026-09-27. The original design-time `User.phone` baseline no longer describes
the current checkout. P00's formal phase exit and P01's final evidence gate remain
separate; later implementation against this plan was performed under recorded
execution overrides and must not be treated as proof that those gates passed.

## Technical Context

**Language/Version**: TypeScript 5.9, strict ESM, on Node.js 24

**Primary Dependencies**: Express 5.2, Zod 4.4, zod-openapi 6, Prisma 7.9 with
`@prisma/adapter-pg`, PostgreSQL 18, the existing Next.js 16.2/React 19.2 package as a
compile-time shared-type consumer only, Vitest 4.1, Supertest 7.1, Testcontainers 12.1

**Storage**: PostgreSQL via `@fury/database`; JSONB for the validated structured-text
document; no media, object storage, provider, or external side effect

**Testing**: Vitest contract/unit tests; Supertest against the real Express middleware
stack; PostgreSQL 18 Testcontainers for migration, constraint, transaction, persistence,
and concurrency evidence; web typecheck plus unchanged existing regression tests for
the single type-only boundary touch

**Target Platform**: Linux-hosted Express API and PostgreSQL; browser-safe shared
contracts consumed by the existing Next.js application

**Project Type**: pnpm 11/Turborepo monorepo

**Performance Goals**: No unsupported throughput or latency target is introduced.
All list reads remain bounded by the existing 25-default/100-maximum pagination policy,
structured text remains below the existing 1 MB HTTP body limit, relation reads use
explicit projections, and tests guard deterministic bounded queries rather than claim
an unevidenced service-level objective.

**Constraints**: P00 must be accepted first; prior migration history is immutable;
no new dependency, repository layer, global store, HTTP client, auth/error protocol,
screen, or external system; public P01 reads ignore ambient credentials; management
mutations preserve bearer authentication, active/verified checks, ADMIN authorization,
CSRF, global rate limiting, safe errors, request IDs, and redacted logs.

**Scale/Scope**: Six P01 entity types, 19 HTTP operations, four canonical content
lists, two publication state machines, and type-only web boundary alignment. Product
scale is not established, so capacity claims beyond enforced request/query bounds are
out of scope.

## Constitution Check

_GATE: Passed for planning; implementation remains blocked on P00 acceptance and
formal P01 specification/readiness acceptance. Rechecked after Phase 1 design below._

- **PASS — Scope and reality**: P01 and P00 are traced to `PLAN.md`; current persistent
  behavior is accounts/sessions/health only. `AdminDataProvider`, admin work actions,
  text-story data, discovery data, and public story data are fixture/local sources, not
  migration inputs or evidence. P02 media, P03/P04 screens, P05 public integration, and
  all later domains remain excluded.
- **PASS — Authority and privacy**: Public routes have no auth or CSRF middleware and
  return allowlisted metadata only. Management middleware is ordered global limit →
  authentication → ADMIN authorization → CSRF for unsafe methods → validation →
  controller. Invalid/suspended/unverified sessions fail before lookup; non-admin
  denial is lookup-independent; authorized missing resources and public hidden
  resources use safe `NOT_FOUND` outcomes.
- **PASS — Contract agreement**: `@fury/contracts` owns body, params, query, response,
  enum, pagination, and content error-code schemas. API DTOs alias those schemas.
  Runtime parsing, OpenAPI, producer tests, web type consumers, and HTTP tests share
  the operation inventory in [contracts/content-api.md](./contracts/content-api.md).
- **PASS — Architecture**: `apps/api/src/modules/content` owns thin controllers,
  use-case services, feature-local queries, pure lifecycle rules, and allowlist mappers.
  `apps/api/src/router.ts` remains the composition root. No generic repository or new
  provider abstraction is introduced.
- **PASS — Data and races**: Unique/check/FK constraints, immutable-identity/history
  triggers, explicit transactions, versioned compare-and-set writes, idempotent
  target-state handling, rollback tests, and a new forward migration are specified in
  [data-model.md](./data-model.md). No hard-delete operation or external effect exists.
- **PASS — Frontend truth and access**: No page, query hook, feature API, optimistic
  state, success UI, fixture value, rendered content, control, route, or mock behavior
  is changed. Existing Arabic RTL routes remain fixture-backed and are explicitly not
  P01 proof. The only web production touch is compile-time type derivation and selects
  no Next.js API; the nested Next.js instruction becomes applicable only if
  implementation expands into framework behavior.
- **PASS — Evidence**: Contract, pure-rule, mapper, service, real PostgreSQL, complete
  Express-stack, concurrency, rollback, web type-boundary, OpenAPI, documentation, and
  smallest real journey evidence are mapped below. A response status or mock call is
  never the sole persistence/security proof.
- **PASS — Change safety**: Dirty status was inspected before planning. Existing
  changes to `PLAN.md`, constitution/templates, docs, and the active feature are
  user-owned. Implementation stops at P01 review and does not commit, push, deploy,
  reset a database, or contact an external system without separate authorization.

## Project Structure

### Documentation (this feature)

```text
specs/001-content-domain-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── content-api.md
├── checklists/
│   └── requirements.md
└── spec.md
```

`tasks.md` is Phase 2 output and is not created by this command.

### Source Code (repository root)

```text
packages/contracts/src/
├── content/
│   ├── content.schema.ts                 # add: enums, structured text, DTOs/projections
│   └── content.schema.test.ts            # add: bounds, strictness, normalization, outputs
├── http/http.schema.ts                   # change: shared bounded pagination query primitive
├── http/http.schema.test.ts              # change: pagination query contract evidence
└── index.ts                              # change: public content exports

packages/database/
├── prisma/schema.prisma                  # change: P01 enums/models/relations
├── prisma/migrations/
│   └── new P01 forward migration/
│       └── migration.sql                 # add after the accepted P00 migration
├── src/index.ts                          # change: server-only generated exports
├── tests/schema-contract.test.ts         # change: exact post-P01 inventory
└── tests/integration/
    ├── migration.integration.test.ts     # change: preserve auth + upgrade inventory
    └── content-domain.integration.test.ts# add: constraints/triggers/persistence/redeploy

apps/api/src/
├── core/pagination/
│   ├── pagination.dto.ts                 # change: alias shared query schema
│   ├── pagination.ts                     # change: server-only skip/take from parsed query
│   └── pagination.test.ts                # change: shared-boundary agreement
├── infrastructure/
│   ├── database/prisma-error.mapper.ts   # change: allowlist new named constraints only
│   └── openapi/
│       ├── openapi.ts                    # change: all P01 operations/schemas/security
│       └── openapi.test.ts               # change: operation agreement assertions
├── modules/
│   ├── content/
│   │   ├── dto/content.dto.ts            # add: shared-schema aliases only
│   │   ├── content.rules.ts              # add: derivation and transition table
│   │   ├── content.mapper.ts             # add: explicit public/admin projections
│   │   ├── content.queries.ts            # add: bounded feature-local reads
│   │   ├── content-management.service.ts # add: invariants, transactions, CAS
│   │   ├── public-content.service.ts      # add: publication-eligible metadata reads
│   │   ├── content.controller.ts          # add: HTTP adaptation only
│   │   ├── content.routes.ts              # add: exact middleware order
│   │   ├── index.ts                       # add: module exports
│   │   ├── content.rules.test.ts          # add: pure lifecycle/content rules
│   │   ├── content.mapper.test.ts         # add: output allowlists
│   │   ├── content-management.integration.test.ts
│   │   └── public-content.integration.test.ts
│   └── index.ts                           # change: module exports
├── router.ts                              # change: construct/wire content dependencies
└── content.integration.test.ts            # add: real HTTP/security/e2e journey

apps/web/src/
└── features/admin/types/admin.types.ts    # change: derive matching types from contracts

README.md                                   # change: implemented content/API/data claims
PROJECT_REFERENCE.md                       # change: module, contract, migration/test truth
```

The web list is deliberately limited to the existing type-only integration boundary.
`AdminWorkType` aliases the shared Work type, while the existing lowercase
`AdminUserRole` is derived from shared `UserRole` without changing fixture values.
`adminFixtures.ts`, discovery/text-story fixtures and filters, quote blocks,
components, labels, controls, routes, `AdminDataProvider`, and
`use-admin-work-actions.ts` remain unchanged and non-authoritative until their owning
later phases. Contract tests/builders use canonical P01 values without becoming
production fixture data.

**Structure Decision**: Reuse the four existing workspaces and their established
boundaries. The API content module talks directly to the injected Prisma client through
feature-local queries; contracts remain browser-safe; Prisma records/generated code
remain server-only; the web imports only `@fury/contracts`. Generated Prisma output is
regenerated, never hand-edited or planned as an authored file.

## Complexity Tracking

No constitutional violation or additional project/dependency is required.

## Current-State Evidence and Phase Boundaries

### Verified implementation reality

- `packages/database/prisma/schema.prisma` currently has only `User` and
  `RefreshToken`; its single migration and exact-inventory tests explicitly describe an
  authentication-only database. There is no content table or durable content query.
- `apps/api/src/router.ts` mounts only OpenAPI, auth, users, and health. The established
  global order in `createApp` is request ID, request logger, Helmet, CORS, cookies,
  compression, bounded body parsing, global API rate limiting, routes, not-found, and
  error handling.
- `createAuthenticationMiddleware` verifies the bearer token, re-reads the account,
  and requires `ACTIVE` plus `emailVerifiedAt`. `authorizeRoles` is the existing server
  role boundary. Unsafe existing authenticated routes run CSRF before validation.
- `@fury/contracts` currently owns account/auth/envelope schemas but no content schema.
  The API's pagination parser defaults to page 1/limit 25 and caps limit at 100.
- `AdminDataProvider` seeds `INITIAL_ADMIN_WORKS` and `INITIAL_ADMIN_CHAPTERS` into
  React state. `use-admin-work-actions.ts` synthesizes IDs, dates, publication changes,
  page/text changes, and activity records locally. `AdminWorkForm` and chapter forms use
  mock delays. None is persistent or an API consumer.
- `textStories.ts`, `discoverData.ts`, category data, story data, and the public routes
  are static fixtures. Existing `short-story`/`comic` terms, quote blocks, lowercase
  fixture roles, ID-as-slug lookups, counts, and media URLs are presentation data, not
  accepted P01 records.
- The central browser transport is `apps/web/src/services/api/api-client.ts` and React
  Query is already provided by `apps/web/src/app/providers.tsx`. P01 does not add a
  content feature API or query hook because no screen is connected in this phase.

### Preserve, align, and defer

| Treatment | P01 decision                                                                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preserve  | Auth/session behavior, middleware architecture, API envelope, global limit, safe errors/logs, Arabic RTL routes and presentation, fixture-backed screens, user edits                     |
| Replace   | No production fixture data path is replaced; P01 replaces only duplicate enum/structured-text names at compile-time integration boundaries and adds authoritative server contracts       |
| Retire    | Legacy wire vocabulary `comic` and `short-story` at authoritative contract boundaries and contract test builders only; no application route, fixture value, or fixture system is retired |
| Defer     | Media (P02/P04), admin category/work screens (P03), chapter authoring screens (P04), public catalog/details (P05), readers/personal/community/operations (later phases)                  |

## End-to-End Architecture and Ownership

### P01 active execution paths

```text
Public contract/HTTP client or Supertest
  -> GET /api/v1/content/*
  -> global middleware (request ID/log/security/CORS/body/global limit)
  -> public content route validation
  -> thin ContentController
  -> PublicContentService
  -> ContentQueries with publication eligibility in SQL predicates
  -> explicit public mapper
  -> Prisma -> PostgreSQL

ADMIN contract/HTTP client or Supertest
  -> /api/v1/content/admin/*
  -> global middleware
  -> authenticate active+verified account
  -> authorize ADMIN
  -> CSRF (unsafe only)
  -> shared-contract validation
  -> thin ContentController
  -> ContentManagementService / pure content rules
  -> feature-local ContentQueries + transaction/CAS
  -> explicit admin mapper
  -> Prisma -> PostgreSQL
```

There is intentionally no P01 page → hook → feature API → `apiClient` runtime path.
Existing pages stop at fixture/local state. P03/P04/P05 own replacing those adapters
with React Query hooks and the central `apiClient`; P01 must not prebuild unused hooks,
query keys, cache invalidation, or optimistic UI.

Applicable engineering rules are B01–B05 (layers/contracts), B06–B10
(constraints/transactions/concurrency/duplicates/transitions), B12–B16
(errors/privacy/auth/CSRF/authority), B20/B22/B23 (redaction, projections, read
purity), B25–B29 (history/deletion/pagination/bounds/rate limits), B31
(OpenAPI), B34–B36 (injection/composition), B40/B41 (shared access policy/CAS),
B43–B49 (migration and database/HTTP evidence), and B51–B54 (definition and
regression evidence). Web boundary alignment applies F01/F02 (ownership/truth),
F04 (public transport), F28/F29 (accessibility/Arabic RTL), and F31 (real-browser
claims). Conditional examples in those guides do not create P01 features.

### Layer responsibilities

- **Routes** declare method/path and the exact middleware sequence. They never perform
  lookups or derive roles from input.
- **Controller** reads `request.validated` and `request.user.id`, calls one use case, and
  writes the established success envelope. It does not access Prisma or implement
  transitions.
- **Management service** owns derived content type, mutable/immutable fields,
  transition validity, category/page replacement, transactions, CAS, idempotent retry
  semantics, and feature error selection.
- **Public service/queries** own publication eligibility. Every item and count predicate
  requires the Work to be published; chapter queries additionally require the Chapter
  to be published.
- **Queries** keep compound selects/counts/order clauses in the content feature and
  return narrow selected records. They do not become a generic repository.
- **Mappers** accept selected record types and construct public/admin DTOs field by
  field; response schemas parse mapper output in tests so raw records cannot escape.
- **Composition** remains `createApiRouter(database, emailService)`. It constructs
  content queries/services/controller and injects a module-local clock function used
  only for publication timestamps. There is no provider or process-wide singleton.

## Shared Contracts and HTTP Behavior

The normative operation inventory and shapes are in
[contracts/content-api.md](./contracts/content-api.md). Runtime and OpenAPI must use
those same Zod schema objects.

### Canonical values and normalization

- Work type: `manga | manhwa | manhua | comics | novel | text-story`.
- Story status: `ongoing | completed | hiatus | cancelled`.
- Publication state: `draft | published | archived`.
- Chapter content type: `illustrated | text`, derived server-side; never accepted as
  authority from a client.
- Work title: trim, NFC-normalize, reject blank/NUL, maximum 200 characters.
- Category display name: trim, NFC-normalize, reject blank/NUL, maximum 100 characters.
- Slug: trim and lowercase, 1–120 ASCII characters matching
  `[a-z0-9]+(?:-[a-z0-9]+)*`; database checks repeat the normalized/shape invariant.
- Chapter number and page position: decimal positive integer through
  PostgreSQL `INTEGER` maximum 2,147,483,647; alternate syntax, fractions, zero, and
  negatives fail validation.
- IDs: UUID. Timestamps: offset ISO date-times. Version: non-negative integer.
- Pagination: shared query schema accepts only decimal digit strings/numbers, defaults
  1/25, caps limit at 100, rejects unsafe skip arithmetic, and returns the existing
  complete pagination metadata. Page-overrun is a successful empty result.

All request objects are strict. Omitted optional update fields mean “leave unchanged”;
`null` is rejected except the documented nullable output fields. Empty strings do not
mean null. Create operations assign draft state and version zero; clients cannot submit
publication timestamps, current event IDs, role, owner, internal IDs, or timestamps.
The strict Work update body accepts an optional Work type only to make immutability
observable: the same value is unchanged, while a different value returns
`409 CONTENT_IMMUTABLE` without mutating the Work or its Chapters.

### Structured-text representation

The shared `structuredTextDocumentSchema` is a strict versioned JSON document:

```text
{
  version: 1,
  blocks: [
    { type: "heading", level: 2 | 3, text: string },
    {
      type: "paragraph",
      content: [
        { text: string, bold?: boolean, italic?: boolean, href?: string }
      ]
    },
    { type: "list", ordered: boolean, items: string[] }
  ]
}
```

Unknown block/node fields, raw HTML, quote/image/embed/script nodes, empty documents,
NUL/control content, unsafe links, and malformed nesting are rejected. Links are
bounded root-relative application paths beginning with one `/`; protocol-relative
paths, backslashes, credentials, and control characters are rejected. Bounds are:
500 blocks/document, 200 inline nodes/paragraph, 200 list items/block, 4,000 characters
per text leaf/item, 2,048 characters per link, and at most 512 KiB after UTF-8 JSON
serialization. This remains below the configured 1 MB request-body ceiling with
envelope overhead. It establishes storage/wire safety only; P04 owns editor/rendering.

### Stable errors

| Status/code                                      | Meaning                                                                                 |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `400 VALIDATION_ERROR`                           | malformed, extra, unsupported, unbounded, or invalid field; target-prefixed field paths |
| `401 UNAUTHORIZED`                               | absent/invalid/stale/suspended/unverified authentication before lookup                  |
| `403 FORBIDDEN`                                  | active verified non-admin or CSRF failure; message does not reveal target existence     |
| `404 NOT_FOUND`                                  | authorized management target missing, or public work/chapter missing or ineligible      |
| `409 CONTENT_CONFLICT`                           | duplicate normalized slug, chapter number, or incompatible relation identity            |
| `409 CONTENT_IMMUTABLE`                          | attempted Work/Category slug or Work type change                                        |
| `409 CONTENT_TYPE_CONFLICT`                      | submitted chapter representation contradicts derived parent type                        |
| `409 CONTENT_TRANSITION_CONFLICT`                | disallowed lifecycle transition or empty illustrated-Chapter publication                |
| `409 CONTENT_STALE_WRITE`                        | expected version lost to a different authoritative state                                |
| `429 TOO_MANY_REQUESTS`                          | existing global API rate limit                                                          |
| `500 INTERNAL_ERROR` / `503 SERVICE_UNAVAILABLE` | safe unexpected/connectivity failure with request ID                                    |

Generic envelopes remain unchanged. Feature exceptions extend the existing `AppError`
model with fixed codes and safe messages; no SQL, constraint metadata, raw Prisma
message, private record, text body, page path, credential, or stack in production is
returned.

## Security, Privacy, and Abuse Analysis

### Endpoint authority matrix

| Endpoint family                   |           Visitor |                      Active verified USER |     Active verified ADMIN | Invalid/pending/suspended | CSRF                     |
| --------------------------------- | ----------------: | ----------------------------------------: | ------------------------: | ------------------------: | ------------------------ |
| `GET /content/works*`             | Public projection | Same public projection; bearer is ignored |    Same public projection |    Same public projection | N/A                      |
| `GET /content/admin/*`            |               401 |                         403 before lookup |                   Allowed |         401 before lookup | N/A                      |
| `POST/PATCH/PUT /content/admin/*` |               401 |                         403 before lookup | Allowed after valid token |         401 before lookup | Required after auth/role |

No P01 owner or moderator authority exists. Forged role, user ID, publication time,
event ID, content type, or ownership fields are rejected by strict request schemas.
Public routes neither invoke auth middleware nor change behavior when Authorization or
cookies are present. This preserves identical visibility for visitors and signed-in
users and prevents ambient session authority from widening a public response.

### Threat and failure controls

- **Private existence probing**: public list/count/direct queries include eligibility in
  the database predicate; missing/draft/archived all become the same `NOT_FOUND`.
  Management role denial happens before params validation/service lookup where possible,
  and active verified USER receives the same `FORBIDDEN` for existing and missing IDs.
- **CSRF/session regression**: unsafe management routes reuse `csrfMiddleware` after
  authentication/authorization. No refresh-cookie or token handling changes. Existing
  auth integration tests run unchanged after P00 reconciliation.
- **Mass assignment/injection**: strict shared schemas and explicit mappers/selects
  exclude authority/internal fields. Prisma parameterization is retained; no raw
  client-provided SQL/order fragment is accepted.
- **Unbounded payload/query**: HTTP remains 1 MB; structured content is 512 KiB;
  blocks/nodes/category IDs/pages and pagination are independently bounded. Ordering is
  fixed server-side and no arbitrary include/filter expression crosses HTTP.
- **Log/secret leakage**: content bodies are not added to log context. Existing request
  sanitization remains authoritative. Tests inject sentinel secrets/internal fields
  and assert absence from responses and serialized logs. No new environment variable or
  credential is required.
- **Abuse limits**: the configured global limit already covers every P01 route.
  Management is authenticated ADMIN-only and has no external side effect; a new
  per-route limiter would add unproven policy and is not justified. P05 must reassess
  public traffic when screens expose these reads.
- **Race and replay**: expected versions and conditional writes prevent lost updates.
  A repeated target-state command returns the authoritative resource with
  `transitioned: false`; it does not create a second event. A stale command targeting a
  different state returns `CONTENT_STALE_WRITE`.
- **Unknown/database failures**: the transaction rolls back; the established safe error
  handler supplies request ID and does not claim absence or success. Clients may retry
  safe reads and idempotent target-state commands; mutations are not automatically
  retried at the web layer in P01.

## Data, Transactions, Concurrency, and Migration

The exact fields, constraints, indexes, relations, and lifecycle table are in
[data-model.md](./data-model.md).

### Core invariants

- Work and Category UUIDs and normalized slugs never change. Work type is also
  immutable after creation so an existing chapter cannot become incompatible through
  a parent-type edit; changing type requires a future explicitly specified migration.
- WorkCategory uses the Work/Category pair as its identity. Replacement deletes only
  obsolete join rows and inserts only missing rows; it never deletes either parent.
- Chapter belongs permanently to one Work, persists the content type derived at
  creation, and may update its positive integer number under uniqueness and CAS.
  Text content is non-null only for text chapters; illustrated chapters have null text
  content and page rows only. An illustrated draft may have zero pages only when no
  page sequence has yet been submitted; every submitted sequence is non-empty, and a
  published illustrated Chapter always has at least one page.
- ChapterPage has only UUID, chapter FK, positive position, and timestamps. No URL,
  key, storage path, media provider field, or placeholder media identity is stored.
- Publication state and current publication time are coupled: published has a
  timestamp/current event; draft/archived has neither. Historical events are append-only
  and cannot be updated or deleted.
- Public ordering is fixed: works by `publishedAt DESC, id ASC`; chapter lists by
  `number ASC, id ASC`; categories in projections by `displayName ASC, id ASC`; pages
  by `position ASC, id ASC`. Admin Work/Category lists use
  `createdAt DESC, id ASC`. The items and count queries share the same predicate.

### Transaction and CAS design

- Mutable Work, Category, and Chapter records carry `version INTEGER NOT NULL DEFAULT
0`. Every PATCH/replacement/publication body supplies `expectedVersion`.
- A standard update executes a conditional write on `id + expectedVersion` and
  increments version. If zero rows change, the service re-reads once: an absent record
  is `NOT_FOUND`; otherwise it is `CONTENT_STALE_WRITE`. No sleep or blind retry occurs.
- Category-set replacement validates every requested Category, then conditionally
  increments the Work version and applies join-row differences in one transaction.
  Duplicate IDs fail contract validation. An identical retry that already matches the
  authoritative set returns it unchanged; a different stale replacement conflicts.
- Chapter create/update and page-sequence replacement are one transaction. The service
  validates derived type and the entire new representation before any write. An
  illustrated create may omit pages and remain draft; a submitted sequence is always
  non-empty. Page replacement conditionally increments Chapter version, removes only
  its previous page metadata, and inserts the new set. Any insert/constraint failure
  rolls back all steps, and a deferred database guard prevents a published illustrated
  Chapter from committing without at least one page.
- Publication validates the transition table:
  `draft → published|archived`, `published → draft|archived`,
  `archived → draft`; same-state targets are idempotent. For publish, the service
  first verifies content readiness inside the transaction; an illustrated Chapter with
  no pages returns `CONTENT_TRANSITION_CONFLICT` before event creation. An eligible
  publish pre-generates an event UUID/time, inserts the event, then performs a
  version/state conditional update linking that event, all in one transaction. A lost
  CAS throws so the losing event rolls back. After a lost race, one authoritative
  re-read returns idempotent success only when the requested target already won;
  otherwise it returns `CONTENT_STALE_WRITE`.
- No P01 transaction invokes email, media, notification, queue, filesystem, or network
  work. There is therefore no external compensation or outbox in scope.

### Forward migration and compatibility

1. Confirm P00 evidence and inspect its newly added migration(s); do not assume the
   current authentication-only tree is the implementation baseline.
2. Update `schema.prisma` additively and generate one new migration after every P00
   migration. Never edit `20260818000000_init_authentication` or generated Prisma files.
3. Create new enums/tables/indexes/FKs/checks first, then immutable-identity/history,
   derived-content/page-kind, and illustrated-publication-readiness triggers. There is
   no content backfill because existing content is fixture-only and MUST NOT be
   imported.
4. Deploy the migration before the new API. The old API ignores additive objects; the
   new API requires them. The type-only web boundary alignment can deploy independently
   because it does not call the new routes or change fixture/runtime behavior.
5. Validate both a fresh empty database and an upgrade database populated with
   post-P00 users/refresh sessions. Preserve the same account/session rows and verify a
   second deploy is idempotent.
6. Application rollback leaves additive content objects/data intact and rolls the API
   back to a version that ignores them. Schema rollback is forward recovery only:
   correct with another migration or restore a verified backup for a catastrophic
   deployment. Never drop populated P01 tables or rewrite history as an ad hoc rollback.

Production deployment, backup execution, and restore drills are not authorized by this
planning command. Their evidence remains an implementation/release prerequisite if P01
is deployed beyond disposable test environments.

## Frontend Boundary Alignment

P01 makes no server-backed visual surface and does not rewrite production fixture or
query values. The only production web change is compile-time derivation in
`apps/web/src/features/admin/types/admin.types.ts`:

- `AdminWorkType` aliases the shared contract Work type because its existing values
  already agree;
- `AdminUserRole` remains lowercase for unchanged fixture/rendering behavior but is
  derived as the lowercase form of shared `UserRole`, eliminating a competing
  manually maintained union;
- canonical `comics`/`text-story` and supported structured-text examples appear in
  shared contract tests/builders, not as rewrites of existing screen fixtures.

`adminFixtures.ts`, `discoverData.ts`, `textStories.ts`, both catalog modules,
quote blocks, components, Arabic labels, controls, routes, and mock interactions are
preserved byte-for-byte by P01. Their `comic`/`short-story` values remain explicitly
fixture-local and non-authoritative until their owning integration phases.

No content feature API, query key, cache, invalidation, cancellation, stale completion,
draft reconciliation, mutation toast, or optimistic update is introduced. Existing
local admin work/chapter mutations and mock delays stay non-authoritative and are not
P01 acceptance evidence. P03/P04/P05 own their replacement.

Web typecheck proves the contract derivation compiles, and the existing focused web
suite remains a regression guard. No rendered component or Next.js behavior is planned,
so real-browser/device evidence is N/A. If implementation requires touching any
rendered fixture, filter, block, control, route, or framework boundary, stop and return
to the accepted specification/plan instead of silently expanding P01.

## Requirement-to-Test Matrix

| Requirements/evidence                      | Test layer and required proof                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-002–014, FR-028; AE-001                 | `content.schema.test.ts` parses every enum, valid structured block, and optional Work-update type for service-level immutability handling; rejects legacy terms, duplicate Category IDs, explicit empty page arrays, extra/nullable fields, bad normalization, every bound edge, unsafe link, content mismatch shapes, invalid number/query forms, and over-limit payloads; response allowlists and pagination facts parse |
| FR-001, FR-006–012, FR-022–027; AE-002/003 | Database schema/integration tests inspect exact models/enums/columns/indexes/FKs/checks/triggers; direct SQL rejects duplicate normalized slugs/pairs/numbers/positions, fractional/non-positive values, broken FKs, invalid state/timestamp/current-event facts, slug/type mutation, published illustrated Chapters without pages, event mutation/deletion, and text/page-kind mismatch; valid records survive reconnect  |
| FR-003/004/012/016/022–025                 | Pure `content.rules.test.ts` covers derived type and every allowed, denied, and idempotent transition without a database mock                                                                                                                                                                                                                                                                                              |
| FR-002/006                                 | Management service and complete HTTP-stack tests prove resubmitting the persisted Work type does not alter it, while a different valid type returns `409 CONTENT_IMMUTABLE` and leaves the Work, Chapters, version, and relationships unchanged                                                                                                                                                                            |
| FR-021                                     | Mapper tests use records containing sentinel internal fields and prove exact public/admin keys; public chapter output contains no text/page body; contract output schemas reject leakage                                                                                                                                                                                                                                   |
| FR-007/010–012/026/027; AE-007             | Contract and real PostgreSQL service tests prove duplicate Category IDs fail validation, an identical authoritative Category set is an unchanged 200 no-op, a stale different set conflicts, and forced failures after CAS/earlier dependent writes during category/page/publication operations roll back data, version, current time, pages, and events                                                                   |
| FR-015–017/030; AE-005                     | Public service and real HTTP tests cover empty/overrun lists, totals, direct reads, relationship expansion, and all Work×Chapter publication combinations; missing/draft/archived are indistinguishable and no body/page data leaks                                                                                                                                                                                        |
| FR-018–020/030/033; AE-004                 | Supertest through `createApp` covers anonymous, invalid/stale token, pending, suspended, USER, ADMIN, forged fields, existing/missing targets, missing/mismatch/valid CSRF, global limit envelope, request ID, and unchanged database state after every denial                                                                                                                                                             |
| FR-009/022–026/033; AE-006                 | Real PostgreSQL service and HTTP tests allow an empty illustrated draft, reject explicit empty page replacement, reject its publish with CONTENT_TRANSITION_CONFLICT and no event, then issue identical/incompatible lifecycle commands with the same expected version; inspect one winner, exact final version/state, page readiness, current event, full immutable history, loser code, and zero orphan/duplicate events |
| FR-028/029; AE-009                         | OpenAPI test enumerates all 19 method/path pairs, security declarations, statuses, and representative runtime payloads with shared schemas; DTO alias/type tests prevent competing wire definitions                                                                                                                                                                                                                        |
| FR-031/032; AE-010                         | Web typecheck proves the admin type boundary derives from shared contracts; existing web tests remain green; diff review proves fixture/query data, quote blocks, rendered Arabic labels/content, controls, routes, and mock behavior are untouched; no content API/hook or API/database implementation import is added                                                                                                    |
| FR-020/033/034; AE-010                     | Existing auth, CSRF, authorization, logger redaction, API-client refresh/retry, request-ID, safe-error, and build-output suites remain green after P00 reconciliation                                                                                                                                                                                                                                                      |
| AE-003/008; SC-001–008                     | User Story 1 persistence evidence covers Work, Category, WorkCategory, Chapter, and ChapterPage across reconnect; User Story 2 creates PublicationEvent only through a real publish. `apps/api/src/content.integration.test.ts` performs the aggregate ADMIN → Category → text-story Work → Chapter → publish → public metadata → unpublish/archive → hidden journey and inspects PostgreSQL after each material step      |

Tests must assert persisted state and history, not just status codes. Concurrency uses
coordinated promises/conditional writes rather than sleeps. No warning suppression,
test skip, weakened assertion, fixture fallback, or arbitrary retry is acceptable.

## Verification Commands

Run focused checks while implementing, from the repository root:

```powershell
pnpm --filter @fury/contracts test
pnpm --filter @fury/contracts check-types
pnpm --filter @fury/database test
pnpm --filter @fury/database test:integration
pnpm --filter @fury/api test
pnpm --filter @fury/api test:integration
pnpm --filter @fury/web test
pnpm --filter @fury/web check-types
pnpm db:format
pnpm db:validate
pnpm db:generate
pnpm format:check
pnpm lint
pnpm check-types
```

After focused failures are resolved and Docker/PostgreSQL 18 is available, run the
repository gate once against the final diff:

```powershell
pnpm verify
```

`pnpm verify` is required before P01 acceptance because this phase changes shared
contracts, generated database types, API runtime/OpenAPI, and a web compile-time type
consumer. If Docker, deployment, or device evidence is unavailable, report that
boundary; browser evidence is N/A only while the accepted no-rendered-change boundary
is preserved.

## Documentation, Rollout, and Stop Gate

- Update `README.md` so it no longer claims there is no product domain or only one
  auth migration; list public/admin content boundaries and retain accurate setup/
  security language.
- Update `PROJECT_REFERENCE.md` with content module ownership, exact public eligibility,
  management middleware order, structured-text contract, CAS/publication event model,
  additive migration, and test evidence.
- Update `apps/api/src/infrastructure/openapi/openapi.ts` and its tests from the same
  shared schemas; no hand-copied competing schema is allowed.
- Do not edit `PLAN.md`, the constitution, design system, application deployment
  configuration, or environment examples unless implementation discovers a factual
  contradiction requiring separate approval. P01 needs no new environment key.
- Roll out migration first, then API, then the independent type-only web boundary
  change. Smoke test public empty results, one authorized management read, safe
  unauthorized/forbidden results, OpenAPI, and health. Do not seed or rewrite fixture
  content as production data.
- Stop after P01 evidence and review. Do not start P02/P03, connect screens, upload
  media, deploy, commit, push, create issues, or mutate a non-disposable database
  without explicit authorization.

### Remaining risks and implementation prerequisites

1. **Blocking at original planning; current disposition**: P00 acceptance was not
   present when this plan was drafted. The owner accepted P01 written requirements on
   2026-09-27, but the formal P00 phase exit and P01 final evidence gate remain open.
   Historical implementation proceeded under recorded overrides, not because these
   gates were silently satisfied.
2. **Migration name**: the timestamped `content_domain_foundation` directory is assigned
   only after the accepted P00 migration order is known; hard-coding it now could sort
   before a prerequisite migration.
3. **Operational evidence**: This plan has not run migrations, Docker suites, a
   production backup/restore, or deployment smoke tests. Those are future execution
   evidence, not planning claims.
4. **Rendered web evidence**: No P01 rendered file or full screen is planned.
   Browser/device checks are N/A only if implementation preserves fixture values,
   quote blocks, Arabic labels/content, controls, routes, and mock interactions
   unchanged; touching them requires returning to specification/plan review.

## Post-Design Constitution Recheck

- **PASS — Scope**: Every artifact remains inside P01; no media, full UI, reader, or
  later entity exists. Fixtures are not imported or represented as persisted truth.
- **PASS — Server authority**: Exact public/admin routes, middleware order, CSRF,
  role/status behavior, privacy equivalence, bounds, safe outputs/errors, and abuse
  decision are testable.
- **PASS — Shared contract**: All wire values and operation shapes originate in
  `@fury/contracts`; API DTOs alias; Prisma types remain server-only.
- **PASS — Architecture**: Controllers are thin, services own invariants, queries and
  mappers are feature-local, and construction stays in `router.ts`.
- **PASS — Data/races**: Forward-only additive migration, existing-data strategy,
  constraints, immutability, CAS, transactions, rollback, duplicate/retry/stale
  outcomes, deterministic ordering, and recovery are explicit.
- **PASS — Frontend truth**: No screen connection, fixture rewrite, rendered change,
  or false success is added. Arabic RTL routes and behavior are preserved; the sole web
  touch is compile-time type derivation and selects no Next.js runtime API.
- **PASS — Evidence**: Each FR/AE group has an appropriate contract, real PostgreSQL,
  real Express-stack, web, regression, or documentation check; unverified production/
  device boundaries are named.
- **PASS — Change safety**: P00 remains a hard stop, user changes are preserved, and
  the phase ends at review without unauthorized external/destructive actions.

Phase 0 and Phase 1 design are complete. Technical choices are resolved in
[research.md](./research.md); implementation remains not ready until P00 and the
clarified P01 specification/readiness gate are accepted.

# Tasks: Content Domain Foundation

**Input**: Design documents in `specs/001-content-domain-foundation/`  
**Roadmap phase**: `P01 — Content Domain and Contract Foundation`  
**Hard dependency**: Accepted P00 evidence, formally accepted P01 spec/readiness
evidence, and a reconciled post-P00 checkout  
**Tests**: Required by the constitution and the P01 specification

## Format: `[ID] [P?] [Story] Description`

- **[P]**: May run in parallel only when the stated prerequisite is complete; the tasks touch different files and do not race on a shared schema, migration, contract, or index.
- **[US1]–[US4]**: Trace to the prioritized user story in `spec.md`.
- Every task names its project-relative ownership path and its requirement/evidence trace.

## Phase 1: Setup — Scope, Review, and Baseline Gates

**Purpose**: Prove that the active feature and prerequisite baseline are safe before any P01 implementation file is changed.

- [ ] T001 Verify `.specify/feature.json` still resolves to `specs/001-content-domain-foundation`, confirm `spec.md` and `plan.md` both identify PLAN.md P01, inspect `git status --short`, and record the user-owned dirty paths that implementation must preserve; stop without editing if the phase or feature differs. (Constitution I/VIII; Spec `Scope and Current Reality`)
- [ ] T002 Obtain human review and a checked disposition for every item in `specs/001-content-domain-foundation/checklists/readiness.md`; confirm the clarified CHK026/CHK031/CHK036 outcomes match `spec.md` and resolve the remaining CHK033 recovery-evidence and CHK040 Draft/acceptance gates explicitly. If any disposition changes product requirements or design, stop and rerun clarification/planning before T003 rather than resolving it in code. (FR-002/007/009/012/027/031–033; phase readiness gate)
- [ ] T003 Prove the P00 exit gate from `PLAN.md` P00 against the post-P00 `packages/database/prisma/schema.prisma`, `packages/database/prisma/migrations/`, `packages/contracts/src/`, `apps/api/src/modules/auth/`, `apps/web/src/features/auth/`, and their fresh evidence; stop while the current authentication-only/User.phone baseline remains or any P00 acceptance evidence is missing. (P01 dependency; Plan `Remaining risks and implementation prerequisites`)
- [ ] T004 After T003 passes, re-inspect `packages/database/prisma/migrations/`, `packages/database/tests/schema-contract.test.ts`, `packages/database/tests/integration/migration.integration.test.ts`, `apps/api/src/router.ts`, and overlapping auth/contracts tests; record in `specs/001-content-domain-foundation/tasks.md` Execution Notes the exact next lexically ordered `<post-P00-timestamp>_content_domain_foundation` migration directory before T021. Do not hard-code a name that could sort before P00. (AE-002/003; migration safety)
- [ ] T005 Read `docs/engineering/code-style.md`, `docs/engineering/api-contracts.md`, `docs/engineering/backend-standard.md`, `docs/engineering/data-patterns.md`, `docs/engineering/frontend-standard.md`, `docs/engineering/security.md`, `docs/engineering/testing.md`, `docs/workflow/operating-policy.md`, and `apps/web/AGENTS.md`; confirm `apps/web/src/features/admin/types/admin.types.ts` is the only planned web production touch. If implementation requires any rendered or Next.js framework file, stop and read the relevant installed `apps/web/node_modules/next/dist/docs/` guidance before returning to specification/plan review. (FR-031/032; Plan `Frontend Boundary Alignment`)

**Checkpoint**: Active feature is P01, the full reviewer-owned readiness gate and Draft-status acceptance are complete, P00 is evidenced in the checkout, the final migration path is known, and the preserved dirty-file inventory is recorded. No later task may start otherwise.

---

## Phase 2: Foundational — Shared Pagination Boundary

**Purpose**: Establish the one browser-safe pagination contract reused by all P01 list operations before story-specific content schemas are added.

- [ ] T006 Add failing contract cases in `packages/contracts/src/http/http.schema.test.ts` for decimal-only page/limit input, defaults 1/25, maximum 100, invalid zero/fraction/unsafe arithmetic, strict extra-field rejection, and complete pagination metadata. (FR-013/014/028; AE-001)
- [ ] T007 Implement and export the bounded pagination query primitive in `packages/contracts/src/http/http.schema.ts` and `packages/contracts/src/index.ts` without changing the established envelope schemas. (FR-013/014/028; Constitution III)
- [ ] T008 Add failing producer-agreement cases in `apps/api/src/core/pagination/pagination.test.ts` proving the API accepts the shared parsed query, computes safe `skip`/`take`, preserves defaults/bounds, and rejects overrun arithmetic without a competing wire schema. (FR-013/014/029; AE-009)
- [ ] T009 Replace the local wire definition with shared-schema aliases while retaining server-only `skip`/`take` calculation in `apps/api/src/core/pagination/pagination.dto.ts` and `apps/api/src/core/pagination/pagination.ts`. (FR-013/014/029; B01–B05)
- [ ] T010 Run `pnpm --filter @fury/contracts test -- src/http/http.schema.test.ts`, `pnpm --filter @fury/contracts lint`, `pnpm --filter @fury/contracts check-types`, `pnpm --filter @fury/api test -- src/core/pagination/pagination.test.ts`, `pnpm --filter @fury/api lint`, and `pnpm --filter @fury/api check-types`; resolve failures in `packages/contracts/src/http/` and `apps/api/src/core/pagination/` without weakening assertions. (AE-001/009; Constitution VII)

**Checkpoint**: Contracts and API share one strict pagination input, while server-only pagination calculation remains in the API.

---

## Phase 3: User Story 1 — Establish Authoritative Content Records (Priority: P1) 🎯 MVP

**Goal**: An active verified ADMIN can create and read durable Category, Work, WorkCategory, Chapter, and ChapterPage records with stable identity, uniqueness, relationships, ordering, and safe administrative projections.

**Independent acceptance**: Through the real management HTTP boundary, create a Category, an illustrated Work, assign the Category, create a positive-numbered illustrated Chapter with ordered page metadata, restart/reconnect, and read the same allowlisted records and relationships; duplicate/invalid writes fail without partial state.

### Tests for User Story 1

- [ ] T011 [P] [US1] Create `packages/contracts/src/content/content.schema.test.ts` with failing cases for canonical enums, UUID/date/version primitives, strict Category/Work and illustrated-Chapter/Page requests, optional Work-update type input, duplicate Category-ID rejection, omitted-versus-explicit-empty page semantics, core admin/public projections, normalization, omission/null/empty semantics, unsupported authority fields, legacy enum rejection, list envelopes, bounds, and output allowlists; defer structured-text-specific cases to T037. (FR-002–009/011–014/017/021/028; AE-001)
- [ ] T012 [P] [US1] Update `packages/database/tests/schema-contract.test.ts` with the failing exact post-P01 model/enum inventory and assertions that the accepted post-P00 account/session inventory remains present. (FR-001/006–012/022–024; AE-002)
- [ ] T013 [P] [US1] Extend `packages/database/tests/integration/migration.integration.test.ts` with failing fresh-install, populated post-P00 upgrade, account/session preservation, and second-deploy-idempotency evidence for the additive P01 migration. (AE-002/003; Constitution V)
- [ ] T014 [P] [US1] Create `packages/database/tests/integration/content-domain.integration.test.ts` with failing direct-PostgreSQL cases for normalized unique slugs, WorkCategory pairs, positive unique Chapter numbers/page positions, FKs, derived content/page-kind consistency, immutable Work/Category/Chapter identity including Work type, deterministic indexes, empty illustrated-draft allowance, reconnect persistence for Work/Category/WorkCategory/Chapter/ChapterPage, and rejection without orphan rows; publication-event creation/history evidence belongs to US2. (FR-001/006–012/027; AE-002/003)
- [ ] T015 [P] [US1] Create `apps/api/src/modules/content/content.rules.test.ts` with failing pure cases for Work-to-Chapter content-type derivation, immutable Category/Work identity including Work type, valid positive numbering, and unchanged results for resubmitted identical immutable values. (FR-002/004/008/012; AE-001)
- [ ] T016 [P] [US1] Create `apps/api/src/modules/content/content.mapper.test.ts` with sentinel-filled selected records and failing exact-key assertions for admin/public Category, Work, Chapter, and Page projections; prove public Chapter metadata excludes bodies/pages and all projections exclude raw/internal/provider/account fields. (FR-017/021; Constitution II/III)
- [ ] T017 [P] [US1] Create `apps/api/src/modules/content/content-management.integration.test.ts` with failing real-PostgreSQL CRUD, duplicate slug/number, immutable slug/type, same-type no-op, duplicate-Category-ID validation, identical authoritative category-set no-op without version change, stale different-set conflict, missing related Category, restart/reconnect, and forced dependent-write rollback cases. (FR-002/005–007/026/027/033; AE-003/007)
- [ ] T018 [P] [US1] Add failing ADMIN management cases to `apps/api/src/content.integration.test.ts` for Category/Work/Chapter CRUD and category replacement through `createApp`, including Work-type `CONTENT_IMMUTABLE`, duplicate Category-ID field errors, identical-set success, strict validation paths, 401/403-before-lookup privacy, 404 for an authorized missing target, CSRF denial on unsafe methods, request IDs, safe errors, and unchanged database state after denial. (FR-002/007/018–021/029/030/033; AE-004)

### Implementation for User Story 1

- [ ] T019 [US1] Add the shared browser-safe canonical enums, identity primitives, Category/Work and illustrated-Chapter/Page request schemas, core projections, list data, and inferred types in `packages/contracts/src/content/content.schema.ts`; export them from `packages/contracts/src/index.ts` and keep them strict, normalized, bounded, and free of Prisma/generated imports. (FR-002–009/011–014/017/021/028; Constitution III)
- [ ] T020 [US1] Add the six P01 entities, canonical enums, fields, nullability, relationships, uniqueness, checks, indexes, versions, empty illustrated-draft allowance, and deletion/history policies to `packages/database/prisma/schema.prisma`; include no media URL/key/provider fields, expose no direct PublicationEvent creation operation, and do not edit generated Prisma output. (FR-001/006–012/022–027; `data-model.md`)
- [ ] T021 [US1] Create the single forward migration at the exact post-P00 directory recorded by T004 under `packages/database/prisma/migrations/<post-P00-timestamp>_content_domain_foundation/migration.sql`, adding tables/enums/FKs/checks/indexes before immutability/history, content-kind, and illustrated-publication-readiness triggers; never edit an applied migration or import fixture content. (AE-002/003; Constitution V)
- [ ] T022 [US1] Regenerate rather than hand-edit Prisma output, then export only server-owned P01 generated enums/types required by the API from `packages/database/src/index.ts`; run `pnpm db:format`, `pnpm db:validate`, and `pnpm db:generate`. (FR-001/028; migration safety)
- [ ] T023 [US1] Add the fixed safe feature exceptions in `apps/api/src/modules/content/content.errors.ts`, export them through `apps/api/src/modules/content/index.ts`, and allowlist only named P01 uniqueness/check failures in `apps/api/src/infrastructure/database/prisma-error.mapper.ts`; reuse the existing `AppError`/handler protocol and never return SQL, constraint names, raw Prisma messages, private existence, or bodies. (FR-006/029/030/033; Constitution II)
- [ ] T024 [US1] Implement derived-type/immutability rules in `apps/api/src/modules/content/content.rules.ts`, bounded feature-local reads in `apps/api/src/modules/content/content.queries.ts`, and field-by-field allowlist projections in `apps/api/src/modules/content/content.mapper.ts`. (FR-002/004/013–017/021; B02/B20/B22/B23)
- [ ] T025 [US1] Implement ADMIN Category/Work/Chapter CRUD, immutable Work-type conflict/same-value behavior, CAS updates, transactional category-set replacement, full-related-ID validation, duplicate-ID validation, identical-set idempotency without a version bump, stale different-set conflict, and rollback ownership in `apps/api/src/modules/content/content-management.service.ts`; use no generic repository, sleep, blind retry, or external side effect. (FR-002/005–012/018/025–027/033; B06–B10/B34–B41)
- [ ] T026 [US1] Create shared-schema aliases only in `apps/api/src/modules/content/dto/content.dto.ts` and thin HTTP adaptation in `apps/api/src/modules/content/content.controller.ts`; parse validated input, call one use case, and return the established success envelope/pagination metadata without raw records. (FR-021/028/029; Constitution III/IV)
- [ ] T027 [US1] Create the core ADMIN routes in `apps/api/src/modules/content/content.routes.ts`, export them through `apps/api/src/modules/content/index.ts` and `apps/api/src/modules/index.ts`, and wire injected queries/services/controller in `apps/api/src/router.ts` with authentication → ADMIN authorization → CSRF for unsafe methods → shared validation → controller. (FR-018–020/029/030; AE-004)
- [ ] T028 [US1] Make T011–T018 pass; run `pnpm --filter @fury/contracts test -- src/content/content.schema.test.ts`, `pnpm --filter @fury/database test:integration`, and `pnpm --filter @fury/api test:integration -- src/modules/content/content-management.integration.test.ts src/content.integration.test.ts`; then inspect PostgreSQL after reconnect to prove the same Work, Category, WorkCategory, Chapter, and ChapterPage identities, relations, order, versions, accepted duplicate outcomes, and rollback—not merely successful HTTP statuses. PublicationEvent acceptance remains deferred to US2. (SC-002/004; AE-001–004/007)

**Checkpoint — stop for US1 review**: US1 is independently demonstrable without any public catalog, editor, media, React Query hook, or fixture-to-server connection. This is the P01 MVP slice.

---

## Phase 4: User Story 2 — Control Publication Without Leakage (Priority: P1)

**Goal**: ADMIN publication commands are race-safe and auditable, while credential-free public reads reveal only eligible allowlisted metadata and hide missing/draft/archived resources identically.

**Independent acceptance**: Publish a valid Work and Chapter so PublicationEvent records arise only from those real transitions, read only public metadata without credentials, repeat the target state idempotently, reject publication of an empty illustrated draft without an event, exercise competing commands, then unpublish/archive and prove the same public path becomes indistinguishable from unknown content while immutable history remains across reconnect.

### Tests for User Story 2

- [ ] T029 [P] [US2] Extend `apps/api/src/modules/content/content.rules.test.ts` with every Work/Chapter transition (`draft → published|archived`, `published → draft|archived`, `archived → draft`), denied `archived → published`, illustrated-page readiness, same-state idempotency, timestamp/current-event coupling, and parent/child independence. (FR-009/016/022–025; AE-006)
- [ ] T030 [P] [US2] Extend `apps/api/src/modules/content/content-management.integration.test.ts` and `packages/database/tests/integration/content-domain.integration.test.ts` with real-PostgreSQL publication tests proving an empty illustrated draft persists but cannot publish or create an event, a valid sequence enables publication, first publish is the only product path that creates PublicationEvent, same-state retry reuses the event, unpublish/archive/restore/republish retain history across reconnect, stale and simultaneous commands converge safely, and a forced failure after event insertion/CAS rolls back the event and state. (FR-009/016/022–027/033; AE-003/006/007)
- [ ] T031 [P] [US2] Create `apps/api/src/modules/content/public-content.integration.test.ts` with empty and page-overrun lists, deterministic order/totals, direct reads, relationship expansion, every Work×Chapter visibility combination, credential neutrality, and identical missing/draft/archived outcomes without text/page/history leakage. (FR-013–017/021/030; AE-005)
- [ ] T032 [US2] Extend `apps/api/src/content.integration.test.ts` with failing real-stack cases for all four public reads and both publication commands, including empty illustrated-draft publication returning `409 CONTENT_TRANSITION_CONFLICT` with no event, anonymous/invalid/pending/suspended/USER/ADMIN precedence, valid/missing/mismatched CSRF, forged authority fields, global rate-limit envelope, sentinel redaction, request IDs, and persisted unchanged state after every rejection. (FR-009/015–020/029/030/033/034; AE-004–006)

### Implementation for User Story 2

- [ ] T033 [US2] Complete publication transition/readiness/idempotency/CAS result rules in `apps/api/src/modules/content/content.rules.ts`, including empty illustrated-Chapter denial, one authoritative reread after a lost CAS, and no blind retry. (FR-009/016/022–026; B09/B10/B41)
- [ ] T034 [US2] Add transactional Work/Chapter publication commands to `apps/api/src/modules/content/content-management.service.ts` and eligibility-in-predicate reads to `apps/api/src/modules/content/public-content.service.ts` plus `apps/api/src/modules/content/content.queries.ts`; check illustrated readiness inside the publish transaction before event creation and preserve event immutability, exact ordering/count predicates, rollback, and safe recovery. (FR-009/015–017/022–027/033; AE-005–007)
- [ ] T035 [US2] Add the four credential-free public GETs and two ADMIN publication PUTs to `apps/api/src/modules/content/content.routes.ts` and `content.controller.ts`; public routes must omit auth/CSRF and ignore ambient credentials, while unsafe ADMIN routes retain the established middleware order. (FR-015–020/029/030; Contract `Operation Inventory`)
- [ ] T036 [US2] Make T029–T032 pass; run `pnpm --filter @fury/database test:integration -- tests/integration/content-domain.integration.test.ts` and `pnpm --filter @fury/api test:integration -- src/modules/content/content-management.integration.test.ts src/modules/content/public-content.integration.test.ts src/content.integration.test.ts`; execute the independent publication/visibility journey with direct PostgreSQL inspection of empty-draft denial, final version/state, current event, complete immutable history across reconnect, zero orphan/duplicate events, and zero leaked fields. (SC-001/003/005/006/008; AE-003–007)

**Checkpoint — stop for US2 review**: Publication truth, privacy, retries, conflicts, concurrency, and recovery are proven through the actual database and Express middleware stack.

---

## Phase 5: User Story 3 — Preserve Chapter Content Integrity (Priority: P2)

**Goal**: Text Works accept only bounded versioned structured text; illustrated drafts may initially omit pages, every submitted illustrated sequence is non-empty ordered metadata, and invalid/mixed replacements cannot partially persist.

**Independent acceptance**: Create one empty illustrated draft by omitting pages, reject an explicit empty sequence, add and update a valid ordered sequence, create/update one text Chapter, then submit malformed, mismatched, duplicate, over-limit, stale, and forced-failure replacements and prove the prior authoritative content remains intact.

### Tests for User Story 3

- [ ] T037 [P] [US3] Extend `packages/contracts/src/content/content.schema.test.ts` with failing structured-text cases for every supported block/inline shape, version 1, 500/200/200/4,000/2,048/512-KiB boundaries, NFC/control handling, empty documents, raw/unknown/quote/image/embed/script nodes, malformed nesting, unsafe links, illustrated/text mismatch, illustrated-create page omission, explicit empty page-array rejection, page count/position uniqueness, and exact target-prefixed errors. (FR-008–012/028/033; AE-001)
- [ ] T038 [P] [US3] Extend `apps/api/src/modules/content/content-management.integration.test.ts` with valid text create-update, illustrated empty-draft create, non-empty whole-sequence establishment/replacement, parent-derived type enforcement, stale version handling, explicit empty/duplicate positions, and forced failure after page deletion/CAS proving content/version/page rollback. (FR-007–012/025–027/033; AE-003/007)
- [ ] T039 [US3] Extend `apps/api/src/content.integration.test.ts` with real-stack boundary cases for text/page omission, allowed illustrated omission on create, rejected explicit empty sequence, null/extra fields, fractional/zero/over-limit inputs, unsafe structured links, type conflicts, immutable content type, stale writes, safe errors, and unchanged persisted content after rejection. (FR-008–012/028–030/033; AE-001/004/007)

### Implementation for User Story 3

- [ ] T040 [US3] Complete the versioned structured-text, inline safe-link, aggregate-size, and Chapter create/update schemas in `packages/contracts/src/content/content.schema.ts`; allow illustrated create to omit `pages`, reject every submitted empty sequence, expose only inferred browser-safe types, and reject unsupported nodes/fields rather than preserving them. (FR-008–012/028; Contract `Structured text`)
- [ ] T041 [US3] Complete full-representation validation and transactional Chapter/page replacement in `apps/api/src/modules/content/content.rules.ts` and `apps/api/src/modules/content/content-management.service.ts`, deriving content type from immutable Work type, permitting only omitted pages on initial illustrated draft creation, requiring non-empty submitted sequences, and rolling back every dependent change on failure. (FR-007–012/025–027/033; B06–B10)
- [ ] T042 [US3] Make T037–T039 pass with `pnpm --filter @fury/contracts test -- src/content/content.schema.test.ts` and `pnpm --filter @fury/api test:integration -- src/modules/content/content-management.integration.test.ts src/content.integration.test.ts`; inspect persisted content after empty-draft creation, valid replacement, empty/stale/mismatch/duplicate rejection, and forced rollback, and confirm no raw content or page details entered logs or public projections. (SC-001/002/004/008; AE-001/003/004/007)

**Checkpoint — stop for US3 review**: Both Chapter representations are independently durable and bounded, and every invalid/stale/failed replacement preserves the previous authoritative state.

---

## Phase 6: User Story 4 — Share One Canonical Content Language (Priority: P3)

**Goal**: Contracts, API runtime/OpenAPI, and the existing admin compile-time type boundary share canonical P01 definitions while all fixture/query values and rendered Arabic behavior remain unchanged and non-authoritative.

**Independent acceptance**: Producer/runtime/OpenAPI agreement covers all 19 operations, a focused web type test proves the admin types derive from shared contracts, the existing web suite remains green, and the diff contains no change to admin/discovery/text-story fixtures, filters, quote blocks, components, Arabic labels, controls, routes, or mock interactions.

### Tests for User Story 4

- [ ] T043 [P] [US4] Extend `apps/api/src/infrastructure/openapi/openapi.test.ts` with failing exact agreement for all 19 method/path pairs, shared component schemas, success/error statuses and codes, public no-security declarations, ADMIN Bearer security, unsafe Bearer+CSRF security, projections, pagination, immutable Work type, duplicate/identical Category-set outcomes, illustrated-publication readiness, expected-version conflicts, and representative runtime envelopes. (FR-028/029; AE-009)
- [ ] T044 [P] [US4] Create `apps/web/src/features/admin/types/admin.types.test.ts` with failing `expectTypeOf` agreement that `AdminWorkType` equals shared `WorkType` and the unchanged lowercase `AdminUserRole` equals `Lowercase<UserRole>`, without importing API/database implementation or changing runtime fixtures. (FR-031/032; AE-009/010)

### Implementation for User Story 4

- [ ] T045 [P] [US4] Register the shared content schemas and document the exact 19-operation contract in `apps/api/src/infrastructure/openapi/openapi.ts`, consuming `@fury/contracts` rather than creating OpenAPI-only DTOs and preserving existing auth/error/envelope components. (FR-028/029; B31)
- [ ] T046 [P] [US4] Import shared `WorkType` and `UserRole` type-only in `apps/web/src/features/admin/types/admin.types.ts`; alias `AdminWorkType` to `WorkType` and derive `AdminUserRole` as `Lowercase<UserRole>` without modifying its lowercase runtime values or any fixture/component file. (FR-031/032; AE-010)
- [ ] T047 [US4] Extend `apps/api/src/content.integration.test.ts` with representative producer/runtime envelope parsing for each operation family and stable immutable/category/readiness errors so runtime responses, shared output/error schemas, and `apps/api/src/infrastructure/openapi/openapi.ts` cannot drift. (FR-028/029/033; AE-009)
- [ ] T048 [US4] Inspect the final diff for `apps/web/src/features/admin/data/adminFixtures.ts`, `apps/web/src/features/discover/data/discoverData.ts`, `apps/web/src/features/discover/model/catalog.ts`, `apps/web/src/features/text-stories/data/textStories.ts`, `apps/web/src/features/text-stories/model/catalog.ts`, `apps/web/src/features/admin/components/`, `apps/web/src/features/text-stories/components/`, `apps/web/src/app/`, and `apps/web/src/features/admin/hooks/use-admin-work-actions.ts`; if any file other than `apps/web/src/features/admin/types/admin.types.ts` and `apps/web/src/features/admin/types/admin.types.test.ts` changed for P01, stop and return to specification/plan review instead of rewriting fixtures or adding browser scope. (FR-031/032; AE-010)
- [ ] T049 [US4] Make T043–T047 pass with `pnpm --filter @fury/api test -- src/infrastructure/openapi/openapi.test.ts`, `pnpm --filter @fury/api test:integration -- src/content.integration.test.ts`, `pnpm --filter @fury/web test -- src/features/admin/types/admin.types.test.ts`, `pnpm --filter @fury/web lint`, and `pnpm --filter @fury/web check-types`; prove `apps/web/src/` imports neither API/database implementation nor a new content API/hook/query-key/cache path, and record browser/device evidence as N/A because no rendered file changed. (SC-006–008; AE-009/010)

**Checkpoint — stop for US4 review**: Runtime validation, OpenAPI, and the admin compile-time type consumer agree; existing Arabic RTL fixtures/screens are unchanged, remain local, and make no new success or persistence claim.

---

## Phase 7: Bounded Cross-Cutting Completion

**Purpose**: Assemble the smallest real journey, update behavior-owned documentation, run fresh focused/full evidence, and stop at P01 review.

- [ ] T050 Complete the smallest real P01 acceptance journey in `apps/api/src/content.integration.test.ts` exactly as `specs/001-content-domain-foundation/quickstart.md` requires: real registration/verification, test-only ADMIN promotion, Category → text-story Work → Category assignment → structured-text Chapter, hidden-before-publish, publish, allowlisted credential-free reads, idempotent republish, hide again, and direct PostgreSQL state/history/orphan inspection. (AE-008; SC-001–008)
- [ ] T051 [P] Update `README.md` to describe only the implemented P01 contract/API/data capabilities, the migration-first prerequisite, disposable PostgreSQL evidence, and the fact that existing content screens remain fixture-backed; preserve post-P00 setup/auth truth. (FR-031–034; documentation obligation)
- [ ] T052 [P] Update `PROJECT_REFERENCE.md` with the content module ownership, 19-operation contract, middleware/authority boundary, structured-text limits, CAS/publication-event model, additive migration, exact verification commands, and later-phase exclusions. (FR-015–034; documentation obligation)
- [ ] T053 Run `pnpm --filter @fury/contracts lint`, `pnpm --filter @fury/contracts check-types`, and `pnpm --filter @fury/contracts test`; retain exact output and resolve every contract warning/failure. (AE-001/009; Constitution VII)
- [ ] T054 Run `pnpm db:format`, `pnpm db:validate`, `pnpm db:generate`, `pnpm --filter @fury/database lint`, `pnpm --filter @fury/database check-types`, and `pnpm --filter @fury/database test`; confirm generated output is unedited and the exact schema inventory is green. (AE-002/003)
- [ ] T055 Run `pnpm --filter @fury/database test:integration` against disposable PostgreSQL 18 and retain fresh/upgrade/redeploy, constraint, trigger, reconnect, concurrency, rollback, and account/session-preservation evidence; do not use `db push`, `migrate reset`, or any shared/production database. (AE-002/003/006/007)
- [ ] T056 Run `pnpm --filter @fury/api lint`, `pnpm --filter @fury/api check-types`, `pnpm --filter @fury/api test`, and `pnpm --filter @fury/api test:integration`; confirm existing auth/CSRF/authorization/request-ID/safe-error/log-redaction/rate-limit suites remain green with all P01 journeys. (AE-004–009; FR-020/033/034)
- [ ] T057 Run `pnpm --filter @fury/web lint`, `pnpm --filter @fury/web check-types`, `pnpm --filter @fury/web test`, and `pnpm --filter @fury/web build`; confirm the P01 diff under `apps/web/src/` is limited to `features/admin/types/admin.types.ts` and `features/admin/types/admin.types.test.ts`, record browser/device evidence as N/A, and treat any rendered fixture/component/route/mock change as a scope failure requiring specification/plan review. (FR-031/032; AE-010)
- [ ] T058 Execute every command and failure check in `specs/001-content-domain-foundation/quickstart.md`, then run final `pnpm verify` and `git diff --check`; record exact commands, results, Docker/PostgreSQL versions, warnings, unresolved production backup/restore/device evidence, and every unverified boundary in `specs/001-content-domain-foundation/tasks.md` Execution Notes without claiming unrun checks. (SC-001–008; Constitution VII/VIII)
- [ ] T059 Re-run the pass/fail Constitution Check against the final diff, confirm every item in `specs/001-content-domain-foundation/checklists/readiness.md` has an accepted reviewer disposition, verify no P02+ scope, application secret, generated-file edit, applied-migration rewrite, rendered fixture change, or `PLAN.md` change entered the diff, and stop at the P01 review gate without commit, push, issue creation, deployment, production migration execution, destructive reset, seeding fixture content, or contacting external systems. (Constitution I–VIII; PLAN.md §§10–13)

**Final checkpoint**: P01 may be presented for independent acceptance only with fresh evidence for all four story checkpoints and T058. Later roadmap phases remain untouched.

---

## Dependencies and Execution Order

### Phase Dependencies

```text
Phase 1 Setup gates
  └─> Phase 2 shared pagination
       └─> US1 authoritative records (MVP)
            ├─> US2 publication/privacy ─┐
            └─> US3 chapter integrity ──┴─> US4 canonical language
                                             └─> Phase 7 completion

US2 and US3 both require the US1 database/contracts/module skeleton.
US4 may start only after US1 exports the canonical content types; its OpenAPI work also
waits for US2/US3 to finalize the operation behavior and Chapter schemas.
Phase 7 waits for all four story checkpoints.
```

### Within Each User Story

1. Write the contract/database/service/HTTP/frontend evidence named for that story.
2. Make shared contracts authoritative before API aliases or web consumers.
3. Add or extend the one forward migration before relying on generated server types.
4. Implement pure rules, queries, allowlist mappers, and service invariants before controllers/routes.
5. Wire only the accepted endpoints and compile-time web boundaries.
6. Run the independent journey and inspect authoritative state before the story checkpoint.

### Real Parallel Opportunities

- After T010, T011–T018 may be authored in parallel because they touch separate test files; their implementations remain sequenced by the shared contract/schema/migration.
- After T022, mapper/rules/query work in T024 can be split by file, but `apps/api/src/modules/content/content-management.service.ts`, `apps/api/src/modules/content/content.routes.ts`, `apps/api/src/modules/content/content.controller.ts`, and `apps/api/src/router.ts` each have a single sequential owner.
- T029–T031 may be authored in parallel after US1; T032 follows because it extends the shared HTTP integration file.
- T043 and T044 may run in parallel; after those tests exist, T045 and T046 may run in parallel because API OpenAPI and web type ownership are disjoint. T047 follows the completed operation schemas, and T048 is the final US4 scope audit.
- T051 and T052 may run in parallel only after behavior and commands are final. Database integration commands remain serial because both configured suites use single-worker disposable infrastructure.

No `[P]` task may start while its prerequisite decision is unresolved or if another worker is editing the same contract, schema, migration, shared index, or integration file.

## MVP Slice

The smallest independently valuable slice is **Setup + Foundational + US1**:

1. Clear the P00 and readiness gates.
2. Establish the shared pagination/content contract and forward PostgreSQL model.
3. Deliver ADMIN-only durable record management with strict validation, privacy-safe denial, CAS, rollback, and reconnect evidence.
4. Stop at the US1 checkpoint. Do not pull publication UI, media, public screens, or reader behavior forward.

US2–US4 complete P01 acceptance but do not enlarge the MVP into later roadmap phases.

## Exact Stopping Checkpoints

- **After Setup**: stop if active feature, P00 acceptance, reviewer dispositions, or migration ordering is unresolved.
- **After US1**: demonstrate authoritative records and reconnect persistence; await review before publication work.
- **After US2**: demonstrate visibility/privacy/history/concurrency; await review before Chapter-integrity completion.
- **After US3**: demonstrate text/illustrated integrity and rollback; await review before web-boundary alignment.
- **After US4**: demonstrate contract/OpenAPI/admin-type agreement and an unchanged rendered fixture boundary; await review before repository-wide verification.
- **After Phase 7**: stop at P01 acceptance. No commit, push, issue, deploy, production migration, secret creation, destructive reset, external delivery, or later-phase implementation is authorized.

## Out of Scope for Every Task

- Media/object storage/upload processing (P02/P04).
- Server-backed admin Category/Work/Chapter pages, feature APIs, React Query hooks, query keys, cache invalidation, optimistic state, or editor drafts (P03/P04).
- Public catalog/details, reader delivery, or chapter-body public output (P05+).
- Importing fixtures as database truth, replacing all local admin state, or treating mock delays/opened links as success.
- New dependencies, generic repositories, global stores, HTTP clients, auth/error protocols, environments, queues, notifications, providers, or operational subsystems.

## Execution Notes

- Fill this section only with the accepted P00 evidence reference, the exact migration directory selected by T004, fresh command results, and unresolved warnings. Never record secrets or environment values.
- Existing user-owned changes, especially `PLAN.md`, must remain untouched.

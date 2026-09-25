# Tasks: P02 Persistent VPS Media Platform

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [media-http.md](contracts/media-http.md), and [quickstart.md](quickstart.md). Paths below are project relative.
**Evidence rule**: Write meaningful failing tests before each behavior where practical. Run them again after implementation. Record results and unverified environment boundaries in `specs/002-persistent-vps-media/implementation-evidence.md`.
**Scope rule**: Implement only private P02 media assets and narrow references to existing P01 Work/ChapterPage identities. Preserve P01 auth, public DTOs, approved Arabic RTL visuals, and fixture-backed parent record behavior. Do not implement P03/P04/P05/P07/P10 parent persistence, publication, reader access, gifts/grants, or avatar binding.
**Next.js rule**: Before changing browser components, reread the relevant installed guidance at `apps/web/node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `apps/web/node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`, per `apps/web/AGENTS.md`.

## Phase 1: Setup and accepted gates

**Purpose**: Establish prerequisites before code changes; do not infer prior-phase acceptance from source files.

- [ ] T001 Confirm formal P00/P01 exit evidence against `PLAN.md` §§P00–P01 **and** obtain accepted reviewer disposition for the Draft P02 `specs/002-persistent-vps-media/spec.md` and every item in `specs/002-persistent-vps-media/checklists/readiness.md`; record links/results in `specs/002-persistent-vps-media/implementation-evidence.md` and stop before code changes while any gate is unaccepted (Spec §Scope; FR-024; Constitution I/VIII).
- [ ] T002 Review representative approved images for all six classes against `specs/002-persistent-vps-media/contracts/media-http.md` bounds and record acceptance or the blocking decision in `specs/002-persistent-vps-media/implementation-evidence.md` before enforcing the proposed limits (FR-005–FR-006; SC-001).
- [x] T003 Add only the justified direct API multipart/decoder packages and Busboy types to `apps/api/package.json` and `pnpm-lock.yaml`; preserve the existing transport and package graph (Plan §Complexity Tracking; FR-004–FR-005).

**Checkpoint**: P00/P01 gates, P02 reviewer disposition, and artwork limits are accepted; dependency diff contains only P02 needs. Stop here if any gate or artwork decision remains open.

---

## Phase 2: Foundational configuration and private storage boundary

**Purpose**: Establish a safe persistent root before any asset may be acknowledged.

- [x] T004 [P] Add config boundary tests in `apps/api/src/core/config/media.config.test.ts` for missing, relative, release-local, symlinked, unwritable, and valid private roots, plus finite upload/decoder settings (FR-003, FR-005, FR-022).
- [x] T005 [P] Add filesystem containment and atomic stage/read/unlink fault tests in `apps/api/src/infrastructure/media/media-storage.test.ts`, including traversal, root swap, and no file exposure before commit (FR-002–FR-003, FR-007, FR-022).
- [x] T006 Implement validated root/bounds configuration in `apps/api/src/core/config/media.config.ts`, `apps/api/src/core/config/index.ts`, and `apps/api/src/core/config/env.ts`; add non-secret `MEDIA_STORAGE_ROOT` guidance to `.env.example` (FR-003, FR-005, FR-022).
- [x] T007 Implement the injected private filesystem adapter in `apps/api/src/infrastructure/media/media-storage.ts`; use server keys, same-root staging/flush/atomic rename, contained no-follow reads, and exact-key unlink, satisfying T005 before any route uses it (FR-002–FR-003, FR-007, FR-022).
- [x] T008 First add `apps/api/src/app.integration.test.ts` cases for invalid root startup and runtime storage loss: `/health/ready` uses the existing degraded **success-envelope** 503 with truthful database state, `/health/live` remains liveness, and no path leaks. Then wire that behavior through `apps/api/src/app.ts` and `apps/api/src/modules/health/health.service.ts`; give existing `apps/api/src/content.integration.test.ts` app instances isolated test media roots so fail-closed startup does not break unrelated auth/content checks. Correct the current 503 error-envelope description in `apps/api/src/infrastructure/openapi/openapi.ts` with assertions in `apps/api/src/infrastructure/openapi/openapi.test.ts`, without changing the health DTO or request-ID, logging, auth, and error protocols (FR-021–FR-022; Constitution III).

**Checkpoint**: A missing or unsafe persistent root cannot silently fall back to a release directory; no P02 asset route exists yet.

---

## Phase 3: User Story 1 — Save and retrieve administrator media (Priority: P1, MVP)

**Goal**: One durable, private identity and honest preview for each of the five ADMIN-managed classes, without a saved parent claim.
**Independent acceptance**: An active verified ADMIN uploads a valid cover, background, page, frame, and decoration; metadata/bytes remain identical after restart and release replacement. A visitor and ordinary user cannot obtain them. An upload alone does not save a Work, Chapter, or gift.

### Contract and persistence

- [x] T009 [P] [US1] Write shared schema tests in `packages/contracts/src/media/media.schema.test.ts` for the five ADMIN classes, strict multipart scalar/header/params/query inputs, output allowlists, envelopes, omission/null/empty rules, and list pagination (FR-001–FR-002, FR-017, FR-021).
- [x] T010 [P] [US1] Write forward-schema tests in `packages/database/tests/schema-contract.test.ts` and `packages/database/tests/integration/migration.integration.test.ts` for empty and populated P01 databases, additive media tables, actor/key attempt identity, pending asset association, FKs/checks/unique indexes, and repeated deploy (FR-002–FR-003, FR-016–FR-018).
- [x] T011 [US1] Define and export browser-safe media schemas/types in `packages/contracts/src/media/media.schema.ts` and `packages/contracts/src/index.ts`, reusing `packages/contracts/src/http/http.schema.ts` rather than adding another envelope or pagination protocol (FR-001–FR-002, FR-017, FR-021).
- [x] T012 [US1] Extend `packages/database/prisma/schema.prisma` and add `packages/database/prisma/migrations/20260923010000_persistent_vps_media/migration.sql` for MediaAsset, actor-scoped UploadAttempt with a reserved pending-asset association, MediaReference, and MediaReferenceEvent constraints/indexes; leave existing P01 rows unbound. Never edit possibly applied migrations or generated Prisma code (FR-002–FR-003, FR-013–FR-018, FR-024).
- [x] T013 [US1] Add real PostgreSQL identity, per-actor attempt uniqueness with the same UUID independently usable by two actors, pending asset association, terminal state-constraint, ordering, and rollback tests in `packages/database/tests/integration/media-domain.integration.test.ts` using the existing Testcontainers setup (FR-002–FR-003, FR-016–FR-018).

### API and delivery

- [x] T014 [P] [US1] Write decoder tests in `apps/api/src/infrastructure/media/image-validation.test.ts` for valid JPEG/PNG/WebP output, safe re-encoding, type/extension agreement, one-frame behavior, and class-appropriate dimensions/alpha (FR-004–FR-006).
- [x] T015 [P] [US1] Write service/mapper tests in `apps/api/src/modules/media/media.service.integration.test.ts` and `apps/api/src/modules/media/media.mapper.test.ts` for one accepted asset per actor/key attempt, pending/available truth, rejected-key conflict, actor-scoped list/order, redacted DTOs, and file/DB failure recovery (FR-002–FR-003, FR-016–FR-018, FR-021).
- [x] T016 [US1] Implement decoded-image inspection/re-encoding in `apps/api/src/infrastructure/media/image-validation.ts` with accepted per-class bounds from T002 and finite byte/pixel/frame/resource limits (FR-004–FR-006).
- [x] T017 [US1] Implement ADMIN asset/attempt queries and allowlisted mapping in `apps/api/src/modules/media/media.queries.ts` and `apps/api/src/modules/media/media.mapper.ts`; never return a raw database row or filesystem key (FR-008, FR-016–FR-018, FR-021).
- [x] T018 [US1] Implement actor-scoped upload attempt/pending-asset reservation, canonical hash/final-file/DB acknowledgement, exact accepted replay, rejected-key conflict, authorized list/detail/binary reads, and interrupted-attempt truth in `apps/api/src/modules/media/media.service.ts` and `apps/api/src/modules/media/media.rules.ts` (FR-002–FR-003, FR-008, FR-011–FR-012, FR-016–FR-018).
- [x] T019 [US1] Write real-stack HTTP tests in `apps/api/src/media.integration.test.ts` for valid ADMIN multipart upload, exact retry/attempt lookup, rejected-key conflict, two ADMIN accounts independently using the same key without outcome disclosure, private binary headers/no-store, list pagination/empty state, restart-equivalent persistence, visitor/USER denial, request IDs, and no private output (FR-008, FR-010–FR-012, FR-017–FR-018, FR-021).
- [x] T020 [US1] Add bounded multipart parsing and schema/role/CSRF/rate middleware order in `apps/api/src/modules/media/media.multipart.ts`, `apps/api/src/modules/media/media.routes.ts`, and `apps/api/src/middlewares/rate-limit.middleware.ts`; preserve existing auth, safe errors, request IDs, and redacted logging (FR-001, FR-007–FR-010, FR-021).
- [x] T021 [US1] Add thin media DTO aliases/controller and composition wiring in `apps/api/src/modules/media/dto/media.dto.ts`, `apps/api/src/modules/media/media.controller.ts`, `apps/api/src/modules/media/index.ts`, `apps/api/src/modules/index.ts`, and `apps/api/src/router.ts`, injecting the filesystem/image adapters (FR-008, FR-011–FR-012, FR-021).
- [x] T022 [US1] Document actual asset, upload-attempt, list, and private-content routes with multipart/binary/auth/CSRF/status/schema truth in `apps/api/src/infrastructure/openapi/openapi.ts` and its route assertions in `apps/api/src/infrastructure/openapi/openapi.test.ts` (FR-010–FR-012, FR-017–FR-018).

### Web controls

- [x] T023 [P] [US1] Write feature API parsing and private binary/error tests in `apps/web/src/features/media/api/media.api.test.ts`; cover class-before-file multipart order, the central bearer/CSRF transport, no secret/blob in JSON cache data, and denied/unavailable results (FR-011–FR-012, FR-019, FR-021).
- [x] T024 [P] [US1] Write scoped query/mutation tests in `apps/web/src/features/media/hooks/media.hooks.test.tsx` for actor/class/page keys, attempt lookup, abort/lost response, pending-to-rejected `UPLOAD_INCOMPLETE` with new-key retry, stale completion, invalidation, and blob URL cleanup (FR-017–FR-019, FR-021).
- [x] T025 [US1] Implement schema-parsed metadata/attempt/list/upload/binary calls through `apps/web/src/features/media/api/media.api.ts` and the existing `apps/web/src/services/api/api-client.ts`; append the validated class before the file in multipart, and adapt central blob error normalization only if T023 proves a gap (FR-011–FR-012, FR-017–FR-019, FR-021).
- [x] T026 [US1] Implement actor-scoped keys, React Query ownership, mutation reconciliation, cancellation, and transient file/preview state in `apps/web/src/features/media/model/media.keys.ts` and `apps/web/src/features/media/hooks/media.hooks.ts` (FR-017–FR-019, FR-021).
- [x] T027 [US1] Write Arabic RTL upload-state and keyboard/focus tests in `apps/web/src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx`, `apps/web/src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx`, and `apps/web/src/features/admin/components/AdminGifts/AdminGifts.test.tsx`; distinguish uploaded media from fixture-backed parent save (FR-019–FR-020, FR-024).
- [x] T028 [US1] Replace sample cover/background cycling with validated upload/preview state in `apps/web/src/features/admin/components/AdminWorkForm/AdminWorkMediaFields.tsx`, `apps/web/src/features/admin/components/AdminWorkForm/AdminWorkForm.tsx`, `apps/web/src/features/admin/components/AdminWorkForm/form.types.ts`, and `apps/web/src/features/admin/components/AdminWorkForm/AdminWorkForm.module.css`; retain the existing parent form/draft behavior (FR-019–FR-020, FR-024).
- [x] T029 [US1] Replace random page image insertion/replacement with P02 asset candidates in `apps/web/src/features/admin/components/AdminChapterForm/IllustratedChapterEditor.tsx`, `apps/web/src/features/admin/components/AdminChapterForm/AdminChapterForm.tsx`, and `apps/web/src/features/admin/components/AdminChapterForm/ChapterPreviewModal.tsx`; preserve local page order/preview and avoid P04 chapter persistence claims (FR-019–FR-020, FR-024).
- [x] T030 [US1] Add frame/decoration candidate upload and truthful preview feedback in `apps/web/src/features/admin/components/AdminGifts/AdminGiftDialog.tsx`, `apps/web/src/features/admin/components/AdminGifts/AdminGiftPreviewModal.tsx`, and `apps/web/src/features/admin/components/AdminGifts/AdminGifts.module.css`; leave fixture gift/grant records local for P10 (FR-001, FR-019–FR-020, FR-024).

**Checkpoint US1 — stop and accept independently**: Run focused contracts/database/API/web tests. Complete the five ADMIN-class upload-to-private-retrieval journeys with a restart and one unauthorized read; record identity/bytes and honest unsaved-parent UI in `specs/002-persistent-vps-media/implementation-evidence.md`. This is the MVP slice (SC-001–SC-003, SC-006).

---

## Phase 4: User Story 2 — Upload an own avatar safely (Priority: P1)

**Goal**: An active verified user can retain a private avatar candidate across sessions; another user and ADMIN role alone gain no ownership.
**Independent acceptance**: An owner uploads and retrieves the same candidate after reconnecting, can remove an unbound candidate and upload a replacement, and sees no profile-selection claim. Visitor, inactive user, another user, and ADMIN acting only by role cannot read/change it.

- [x] T031 [US2] Extend `packages/contracts/src/media/media.schema.test.ts` with owner-avatar class and 4 MiB boundary, strict scope/filter, and private DTO cases before changing shared schemas (FR-001, FR-005, FR-009, FR-017).
- [x] T032 [US2] Complete own-avatar contract projections in `packages/contracts/src/media/media.schema.ts` without introducing owner-ID claims or a public URL (FR-009, FR-011, FR-021).
- [x] T033 [US2] Add real PostgreSQL owner FK/scope/attempt-isolation cases to `packages/database/tests/integration/media-domain.integration.test.ts`; reuse T012's forward migration and do not alter applied SQL (FR-009, FR-016–FR-018).
- [x] T034 [US2] Add owner/other-user/ADMIN/inactive avatar service cases in `apps/api/src/modules/media/media.service.integration.test.ts`, then enforce actor-derived ownership and safe unbound-avatar removal/replacement in `apps/api/src/modules/media/media.service.ts` and `apps/api/src/modules/media/media.queries.ts` (FR-009, FR-011, FR-015–FR-016, FR-021).
- [x] T035 [US2] Extend `apps/api/src/media.integration.test.ts` with real auth/CSRF/multipart/metadata/binary, owner unbound removal/replacement, foreign-actor denial, and non-disclosing 404 avatar cases; expose only that authorized deletion case in `apps/api/src/modules/media/media.controller.ts` and `apps/api/src/modules/media/media.routes.ts` (FR-009–FR-012, FR-015, FR-021).
- [x] T036 [US2] Add owner-scope and session-change tests in `apps/web/src/features/account/components/AvatarPicker/AvatarPicker.test.tsx` and `apps/web/src/features/media/hooks/media.hooks.test.tsx` for temporary versus accepted preview, retry, and private cache cleanup (FR-009, FR-018–FR-020).
- [x] T037 [US2] Connect the existing picker to the media hook in `apps/web/src/features/account/components/AvatarPicker/AvatarPicker.tsx` and `apps/web/src/features/account/components/AvatarPicker/AvatarPicker.module.css`; preserve 4 MiB guidance and clearly label an uploaded candidate as unselected (FR-005, FR-019–FR-020, FR-024).

**Checkpoint US2 — stop and accept independently**: As one owner, upload/reconnect/retrieve/remove an unbound avatar candidate and upload a replacement; exercise second-user, visitor, inactive, and ADMIN-only denial through actual HTTP, then inspect the picker message and cache after account switch (SC-002–SC-003, SC-006–SC-007).

---

## Phase 5: User Story 3 — Reject unsafe or misclassified media (Priority: P1)

**Goal**: Invalid or hostile media fails before a usable asset exists, with safe class-specific feedback.
**Independent acceptance**: For each class, valid examples remain accepted while mismatched, corrupt, animated, executable, oversized, dimension-invalid, transparent-class-opaque, path, and excess-field cases fail without a retrievable file or private diagnostic.

- [x] T038 [US3] Add boundary and unknown/extra-field schema cases to `packages/contracts/src/media/media.schema.test.ts`, then tighten `packages/contracts/src/media/media.schema.ts` only where accepted strictness is missing (FR-001, FR-004–FR-007).
- [x] T039 [US3] Add adversarial decoded-file cases to `apps/api/src/infrastructure/media/image-validation.test.ts` for MIME/extension/content mismatch, corrupt/polyglot/executable input, animation, alpha, pixel/size ceilings, zero dimensions, and parser resource faults (FR-004–FR-006; SC-001).
- [x] T040 [US3] Harden `apps/api/src/infrastructure/media/image-validation.ts` and `apps/api/src/infrastructure/media/media-storage.ts` so all T039 failures leave no available bytes and no source metadata in output (FR-003–FR-007, FR-021).
- [x] T041 [US3] Add a real-stack positive/negative upload matrix for **each of the six classes** to `apps/api/src/media.integration.test.ts`: applicable mismatched, corrupt/executable, oversize/dimension, alpha, and path cases must prove no available row or retrievable final file. Include missing/duplicate/out-of-order multipart parts, malicious multipart/CSRF/rate attempts, private-existence parity, and absence of raw parser, file, token, and path text in response/logs (FR-001, FR-004–FR-010, FR-021; AE-001).
- [x] T042 [US3] Enforce one class field before one file part, reject missing/duplicate/out-of-order parts with stable field paths, and apply finite headers/parts/bytes, truncation handling, safe statuses, and upload rate bounds in `apps/api/src/modules/media/media.multipart.ts`, `apps/api/src/modules/media/media.routes.ts`, and `apps/api/src/middlewares/rate-limit.middleware.ts` without bypassing auth/CSRF (FR-004–FR-010, FR-021).
- [x] T043 [US3] Add validation/denial accessibility cases in `apps/web/src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx` and `apps/web/src/features/account/components/AvatarPicker/AvatarPicker.test.tsx`, then map safe codes to Arabic field/status messages in `apps/web/src/features/media/hooks/media.hooks.ts`, `apps/web/src/features/admin/components/AdminWorkForm/AdminWorkMediaFields.tsx`, and `apps/web/src/features/account/components/AvatarPicker/AvatarPicker.tsx` (FR-019–FR-021).

**Checkpoint US3 — stop and accept independently**: Run each class's positive/negative corpus through real HTTP and stored-file inspection; assert no rejected attempt becomes an available asset and no private diagnostic escapes (SC-001, SC-003).

---

## Phase 6: User Story 4 — Replace and remove without breaking references (Priority: P2)

**Goal**: Narrow P02 Work cover/background and illustrated ChapterPage references survive retries, concurrent changes, and refused removal.
**Independent acceptance**: Create an existing P01 target and active P02 reference, replace it safely, refuse removal of a referenced asset with `MEDIA_IN_USE` and no queued delete, retire the reference, then remove; stale/duplicate/concurrent commands leave valid bytes and one final reference state.

- [x] T044 [US4] Write reference body/params/output/version/conflict contract tests in `packages/contracts/src/media/media.schema.test.ts`, then extend `packages/contracts/src/media/media.schema.ts` for the accepted `GET/POST/PUT/DELETE /references` interface (FR-013–FR-018, FR-024).
- [x] T045 [US4] Add real PostgreSQL FK, target-slot partial uniqueness, reference-event history, stale CAS, simultaneous bind/replace/remove, and referenced-removal rollback cases in `packages/database/tests/integration/media-domain.integration.test.ts`; satisfy them against T012's forward schema, and stop for a separate forward migration if an already-applied schema needs correction (FR-013–FR-018).
- [x] T046 [US4] Write service/query tests in `apps/api/src/modules/media/media.service.integration.test.ts` for class/target checks, active-use conflict with no deletion queued, exact retry versus stale conflict, other-live-use retention, and partial unlink failure (FR-013–FR-018, FR-021, FR-024).
- [x] T047 [US4] Implement reference lookup/bind/replace/retire, immutable transition history, deterministic locking/conditional writes, and resumable removal in `apps/api/src/modules/media/media.queries.ts`, `apps/api/src/modules/media/media.service.ts`, and `apps/api/src/modules/media/media.rules.ts`; never modify parent Work/Chapter publication or return an unavailable target (FR-013–FR-018, FR-024).
- [x] T048 [US4] Add real-stack reference/removal status, authority, CSRF, hidden/missing 404, duplicate, stale, and concurrent-request tests in `apps/api/src/media.integration.test.ts` (FR-008, FR-010–FR-018, FR-021).
- [x] T049 [US4] Add thin reference/removal handlers to `apps/api/src/modules/media/media.controller.ts` and `apps/api/src/modules/media/media.routes.ts`, preserving the existing response/error/request-ID pipeline and server role checks (FR-008, FR-010, FR-013–FR-018, FR-021).
- [x] T050 [US4] Add exact reference/removal methods, envelopes, error codes, and authority to `apps/api/src/infrastructure/openapi/openapi.ts` and `apps/api/src/infrastructure/openapi/openapi.test.ts` (FR-010, FR-013–FR-018, FR-021).
- [x] T051 [US4] Add parsed reference/removal calls and scoped key/invalidation/conflict tests in `apps/web/src/features/media/api/media.api.test.ts` and `apps/web/src/features/media/hooks/media.hooks.test.tsx`, then implement them in `apps/web/src/features/media/api/media.api.ts`, `apps/web/src/features/media/model/media.keys.ts`, and `apps/web/src/features/media/hooks/media.hooks.ts` (FR-013–FR-019, FR-021).
- [x] T052 [US4] Add conflict/draft/order/focus regression tests in `apps/web/src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx` and `apps/web/src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx`, then expose authorized reference bind/replace/retire only where an existing P01 target ID is real in `apps/web/src/features/admin/components/AdminWorkForm/AdminWorkMediaFields.tsx` and `apps/web/src/features/admin/components/AdminChapterForm/IllustratedChapterEditor.tsx` (FR-013–FR-020, FR-024).

**Checkpoint US4 — stop and accept independently**: Follow the Work-cover reference journey with real P01 identity, retry, replacement, concurrent removal, `409 MEDIA_IN_USE`, safe retirement, and final bytes/rows after restart. No fixture parent record or page-order save is counted as persistent (SC-004; AE-006).

---

## Phase 7: User Story 5 — Recover media with its records (Priority: P2)

**Goal**: Restore asset records, identities, active references, and bytes coherently; report missing/corrupt media without false success.
**Independent acceptance**: Restore one coherent sample set into an isolated environment, verify authorized/denied reads, and reconcile interrupted upload/removal plus one damaged file without substituting content.

- [x] T053 [P] [US5] Add isolated file/DB fault and reconciliation tests in `apps/api/src/modules/media/media.reconcile.integration.test.ts` for pending final files that can be verified and accepted, incomplete/unprovable bytes that settle the attempt to rejected `UPLOAD_INCOMPLETE`, rejected-key conflict/new-key retry, orphan stage files, interrupted `REMOVING`, missing/corrupt bytes, hash-verified repair, and GETs that report unavailability without changing persistent state (FR-003, FR-016, FR-018, FR-021–FR-023).
- [x] T054 [P] [US5] Add clean restore/restart/release-replacement integration coverage in `packages/database/tests/integration/media-recovery.integration.test.ts` using a coordinated sample snapshot with P01 target, attempt, asset, reference, and event rows (FR-003, FR-013, FR-022–FR-023; SC-005).
- [x] T055 [US5] Implement bounded, operator-invoked reconciliation in `apps/api/src/infrastructure/media/media-reconcile.ts` and `apps/api/src/modules/media/media.service.ts`; settle incomplete attempts terminally, use only server-owned keys, retain tombstones/history, make `UNAVAILABLE` explicit only through reconciliation, and never auto-delete accepted unbound assets (FR-003, FR-016, FR-018, FR-021–FR-023).
- [x] T056 [US5] Add a narrow local operator entry point in `apps/api/src/media-reconcile.ts` and its script in `apps/api/package.json`; require validated media config and redacted request-independent operational output, with no unattended production operation (FR-021–FR-023).
- [x] T057 [US5] Write the coordinated backup, isolated restore, hash/reference/permission validation, release replacement, and rollback/retry runbook in `docs/operations/media-backup-restore.md` without production paths or secrets (FR-003, FR-022–FR-023; SC-005).
- [x] T058 [US5] Perform the `specs/002-persistent-vps-media/quickstart.md` isolated restore and damaged-file journey; record actual commands, recovered IDs/hashes, denied reads, and unverified VPS/backup conditions in `specs/002-persistent-vps-media/implementation-evidence.md` (FR-023; SC-005).

**Checkpoint US5 — stop and accept independently**: A clean restore preserves every sample active reference and private read policy; damaged bytes yield only a safe unavailable state and a repair path. No production restore or migration execution is implied.

---

## Phase 8: Bounded cross-cutting completion

**Purpose**: Close the P02 acceptance gate without importing later-phase work.

- [x] T059 [P] Update local setup, current media architecture, and explicit P03/P04/P05/P07/P10 limitations in `README.md` and `PROJECT_REFERENCE.md`, checking every behavior claim against the finished code (FR-019, FR-022–FR-024).
- [x] T060 [P] Add targeted auth/public-content regression assertions in `apps/api/src/app.integration.test.ts` and `apps/api/src/modules/content/public-content.integration.test.ts` for unchanged session/CSRF/role behavior and no new public media exposure (FR-008–FR-012, FR-024).
- [x] T061 Run focused `pnpm --filter @fury/contracts lint`, `check-types`, `test`; `pnpm --filter @fury/database db:validate`, `test`, `test:integration`; and `pnpm --filter @fury/api lint`, `check-types`, `test`, `test:integration`; record command/result in `specs/002-persistent-vps-media/implementation-evidence.md` (AE-001–AE-003, AE-005).
- [x] T062 Run focused `pnpm --filter @fury/web lint`, `check-types`, `test`, `build`, plus root `pnpm test:web-routes`; record command/result and any pre-existing failures in `specs/002-persistent-vps-media/implementation-evidence.md` (AE-004, SC-006–SC-007).
- [x] T063 Execute the smallest real administrator upload→bind→private read→restart→unauthorized read→referenced-removal conflict journey from `specs/002-persistent-vps-media/quickstart.md`; record DB/file and HTTP outcomes in `specs/002-persistent-vps-media/implementation-evidence.md` (AE-006; SC-002–SC-004).
- [x] T064 Inspect actual browser file input/progress/abort, 320px and larger Arabic RTL layout, keyboard/dialog focus, live regions, contrast, reduced motion, and stale account-switch behavior; record evidence and physical-device/deployed-cache limits in `specs/002-persistent-vps-media/implementation-evidence.md` (FR-019–FR-021; SC-006–SC-007).
- [ ] T065 After the focused suites, migration/restart/restore, docs formatting/link checks, and browser journey are stable, run root `pnpm verify` and `git diff --check`; compare actual evidence with every P02 exit item in `PLAN.md` and the accepted P00/P01/P02 review gates, and record pass/fail/unverified boundaries in `specs/002-persistent-vps-media/implementation-evidence.md` (AE-001–AE-006; SC-001–SC-007).

**Final checkpoint — stop at P02 review**: Report changed files, focused and full check results, migration/rollback/restart/restore/browser evidence, unresolved warnings, and environment-specific VPS/backup/proxy/device gaps. Do not mark production readiness from local checks alone.

---

## Dependencies and execution order

```text
Setup T001–T003 → Foundation T004–T008 → US1 T009–T030 (MVP)
                                              ├→ US2 T031–T037
                                              ├→ US3 T038–T043 (after US2 for all-six-class evidence)
                                              └→ US4 T044–T052 → US5 T053–T058
US1 + US2 + US3 + US4 + US5 → completion T059–T065
```

T001/T002 are blocking decisions. T011 precedes all API/web contract consumers. T012 precedes real PostgreSQL service work. T018 precedes HTTP producer wiring; T021 precedes web integration. US2 reuses US1's owner-capable schema; US3 closes all-six-class negative cases after US2. US4 uses US1's forward schema and media service, but its reference journey is independent of any fixture parent save. US5 requires live assets/references from US1/US4. Only run T065 after all P02 story checkpoints and focused checks.

## Real parallel opportunities

- After T003, T004 and T005 touch separate config and storage test files and can be authored together.
- After foundation, T009, T010, and T014 are independent first-pass tests in separate contract, database, and adapter files. After T012, T015 can proceed in its separate service/mapper test files while decoder work continues. Implementations still follow contract → schema → service → HTTP → web order.
- In US1, T023 and T024 are separate API and hook test files; both depend on the shared wire decisions, not on each other's edits.
- In US5, T053 and T054 cover different API reconciliation and database restore test files.
- After all story checkpoints, T059 documentation and T060 regression tests touch different files. No other task is marked `[P]`: shared schema, migration, route, OpenAPI, and control files are serialized across stories.

## Implementation strategy and stops

1. **MVP**: Complete Setup, Foundation, and US1; stop at its independent acceptance checkpoint. This proves five ADMIN-managed classes and persistent private delivery without implying P03/P04/P10 parent workflows.
2. **Incremental**: Complete US2, US3, US4, and US5 in order, stopping at each story checkpoint for its evidence. Reuse existing auth, `apiClient`, React Query, errors, response envelopes, P01 targets, and Arabic RTL components.
3. **P02 gate**: Complete bounded cross-cutting work and stop after the final review report. No task authorizes commit, push, issue creation, deployment, production migration execution, secret creation, destructive reset, public catalog/reader integration, or later-phase parent editing.

## Phase 9: Convergence

- [ ] T066 **CRITICAL** Obtain formal P00/P01 exit dispositions and accepted reviewer disposition for the Draft P02 specification and every item in `specs/002-persistent-vps-media/checklists/readiness.md`; reconcile any required P02 changes and record the accepted evidence before claiming phase completion per Constitution I/VIII and Plan § Constitution Check (contradicts).
- [ ] T067 Review approved representative artwork for all six media classes against the enforced bounds, record the decision, and update `packages/contracts`, API validation, browser hints, OpenAPI, and affected tests together if any bound changes per FR-005 and SC-001 (contradicts).
- [x] T068 Complete the administrator candidate flow so the selected temporary preview remains visible during transfer, 100% transfer changes to a distinct server-processing state, an explicit abort/retry path preserves the uncertain attempt identity, and attempt lookup resolves any possibly committed result without replacing a newer selection per FR-018–FR-020 and SC-006 (partial).
- [x] T069 Connect actor-scoped managed-asset queries to the affected media controls so durable candidates survive reload and present truthful first-loading, empty, filtered-empty, background-refresh, unavailable, denied, and saved-asset states without claiming parent persistence per FR-017, FR-019, and SC-006 (partial).
- [x] T070 Implement and test focus movement/restoration for media validation, denial, stale/conflict, retry, and accepted outcomes, retaining keyboard operation, live announcements, and non-color-only status cues across the shared picker and affected dialogs per FR-020 and SC-007 (partial).
- [x] T071 Run the authenticated real-browser media matrix at 320px and a larger viewport, covering file selection, visible temporary preview, progress, server processing, abort, retry, rapid reselection, stale account switching, keyboard/dialog focus, live regions, contrast, and reduced motion; record physical-device and deployed-cache boundaries per AE-004 and SC-006–SC-007 (missing).
- [x] T072 Perform an isolated operating-system API restart and simulated release-directory replacement while retaining the configured private media root, then verify stable asset/reference identities, exact byte hash/type, authorized delivery, and unauthorized denial per FR-002–FR-003, SC-002, and AE-005 (partial).
- [x] T073 Perform a coordinated clean PostgreSQL plus media-directory backup/restore with a real Work, attempt, asset, active reference, event history, and bytes; verify hashes, authorized delivery, unrelated-user denial, missing/corrupt-file unavailability, and reconciliation, recording actual commands and recovered identifiers per FR-023, SC-005, and AE-005 (partial).
- [x] T074 Add a deterministic same-actor simultaneous duplicate-upload regression through the real HTTP/PostgreSQL/filesystem boundary, then make pending identical retries resolve to the documented `UPLOAD_IN_PROGRESS` or exact terminal replay without staging races, false conflict/success, or more than one accepted asset per FR-018 and SC-004 (partial).
- [x] T075 Add focused React Query tests for reference replace, retire, exact retry, stale/version conflict propagation, target-scoped invalidation, and relevant asset/use cache effects; correct any behavior that disagrees with the plan while preserving actor/resource scoping per FR-013–FR-019 and Plan § Frontend Behavior and Visual Preservation (partial).
- [x] T076 Resolve or formally disposition the repository-wide formatting gate without overwriting unrelated user work, then rerun root `pnpm verify` and `git diff --check` through every remaining gate and record actual outcomes, warnings, and unverified boundaries per Constitution VII/VIII and Plan § Requirement-to-Test Matrix and Checks (partial).

## Phase 10: Convergence

- [x] T077 Refactor the media candidate upload lifecycle so the selected `File`, temporary preview, and abort state remain transient outside React Query mutation variables/cache; retain the truthful temporary candidate across cancellation, pending lookup, and recoverable failure; offer same-candidate retry with the existing attempt while its outcome is uncertain and a new attempt key only after terminal rejection; and add real QueryClient/component assertions for cache absence, preview retention, retry semantics, and exact object-URL cleanup per US2/AC2, FR-019–FR-021, and Plan § Frontend Behavior and Visual Preservation (contradicts).
- [x] T078 Make existing-asset metadata and private binary preview loads abortable across reselection, clear, account change, and unmount; prevent any late prior-actor result from entering state or cache; and add focused hook tests that prove request cancellation, actor-scoped cleanup, and stale-completion rejection per FR-021 and Plan § Frontend Behavior and Visual Preservation (partial).

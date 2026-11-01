# P02 implementation evidence

## Pre-implementation gate audit — 2026-09-23

| Gate                             | Current evidence                                                                                                                                                                                                                                                                        | Disposition                                                                                                  |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| P00 independent feature and exit | A retrospective Draft P00 record now exists at `specs/003-repository-product-alignment/spec.md`. Current source still retains account phone, permits fractional chapter numbers, exposes the fixture reader before a protected-route decision, and enables placeholder advertising.     | Open; no P00 implementation or independent acceptance claimed.                                               |
| P01 independent exit             | `specs/001-content-domain-foundation/tasks.md` leaves T002–T004 and T058–T059 unchecked. Its execution notes explicitly call the prior owner instruction an execution override, not prerequisite acceptance.                                                                            | Open; no reviewer-owned checklist items checked here.                                                        |
| P02 requirements review          | `spec.md` remains Draft; `checklists/readiness.md` has 34 unchecked reviewer items. The author-owned `checklists/requirements.md` has 16 completed quality items.                                                                                                                       | Open until reviewer disposition; quality checks do not constitute acceptance.                                |
| P02 image bounds                 | Current public assets include a sample cover/background but do not provide approved representative artwork for all six classes, especially transparent frame and decoration. Proposed bounds remain in `contracts/media-http.md`.                                                       | Open; no upload limits enforced or accepted.                                                                 |
| Repository verification          | `pnpm format:check` was run on 2026-09-23 and failed with 67 formatting issues across tracked tool/Spec Kit metadata and generated or auxiliary worktree/screenshot paths. `pnpm exec prettier --check 'specs/002-persistent-vps-media/**/*.{md,json}' '.specify/feature.json'` passed. | Full `pnpm verify` cannot be reported as passing. No repository-wide formatting or gate weakening performed. |

No P02 application implementation, database migration, production operation, or reviewer acceptance has been performed as part of this audit.

## Scoped implementation continuation — 2026-09-23

The user explicitly instructed implementation to proceed despite the open gates. This is an execution override, not evidence that P00/P01 were accepted, the Draft P02 review passed, or representative artwork was approved. T001 and T002 remain open. The published per-class limits in the proposed HTTP contract remain provisional until real artwork review; phase acceptance cannot be claimed from this continuation.

Phase 1 T003 added exact `busboy@1.6.0`, `sharp@0.35.4`, and `@types/busboy@1.5.4` dependencies to the API package. Phase 2 T004–T008 added private-root validation and a same-root staged filesystem adapter, then made app construction fail for an unsafe root. Runtime root loss degrades the existing readiness success envelope to 503 while liveness remains 200. Test app instances use isolated temporary roots; no production path or secret was inspected.

Phase 3 T009–T030 adds the five ADMIN-managed media classes. The shared package owns strict browser-safe schemas. The forward Prisma migration adds pending asset, actor-scoped upload-attempt, reference, and reference-event identities without binding existing P01 rows. The API reserves a pending identity after the validated class field and before consuming file bytes, decodes and canonically re-encodes supported still images, publishes private bytes atomically, acknowledges only matching database/file state, and rechecks stored bytes on exact replay. ADMIN list, metadata, attempt, and binary reads retain server-side role/status/verification enforcement, CSRF on upload, process-local upload rate limiting, no-store delivery, safe errors, request IDs, and explicit projections.

The browser adapter uses the central `apiClient`; React Query keys include the actual actor, class, and page. Candidate state supports cancellation, lost-response attempt lookup, stale-completion rejection, list invalidation, and object-URL cleanup. Work cover/background sample cycling and random chapter-page insertion/replacement were removed. Work, chapter, frame, and decoration controls present uploaded assets as media candidates and explicitly state that fixture-backed parent Work, Chapter, and Gift records are not saved by an upload.

Fresh checks for this continuation:

| Command                                                                                                                                         | Outcome                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @fury/api exec vitest run --config vitest.config.ts src/core/config/media.config.test.ts`                                        | Initially failed on a symlink acceptance assertion after a Windows junction fixture correction; passed after implementation. |
| `pnpm --filter @fury/api exec vitest run --config vitest.config.ts src/infrastructure/media/media-storage.test.ts`                              | Initially failed on premature staged-file exposure and traversal; passed after implementation.                               |
| `pnpm --filter @fury/api exec vitest run --config vitest.integration.config.ts src/app.integration.test.ts -t 'media root\|media storage loss'` | Initially failed on unsafe startup and runtime readiness; passed after composition change.                                   |
| Focused config/storage/OpenAPI unit suite                                                                                                       | 11 tests passed.                                                                                                             |
| Focused app/content integration suite                                                                                                           | 27 tests passed with Testcontainers.                                                                                         |
| `pnpm --filter @fury/contracts lint && check-types && test`                                                                                     | Passed; 5 files and 34 tests passed.                                                                                         |
| `pnpm --filter @fury/database db:format && db:validate && lint && check-types && test`                                                          | Passed; Prisma schema valid, generated client succeeded, 2 files and 9 tests passed.                                         |
| `pnpm --filter @fury/database test:integration`                                                                                                 | Passed with Testcontainers; 3 files and 12 tests passed, including staged forward deploy and repeated deploy.                |
| `pnpm --filter @fury/api lint && check-types && test`                                                                                           | Passed; 24 files and 111 tests passed, including the final animated-image regression.                                        |
| `pnpm --filter @fury/api test:integration`                                                                                                      | Passed with Testcontainers; 7 files and 59 tests passed.                                                                     |
| `pnpm --filter @fury/web lint && check-types && test`                                                                                           | Passed; 57 files and 266 tests passed.                                                                                       |
| Focused web media adapter/hook suite                                                                                                            | Passed; 2 files and 7 tests passed.                                                                                          |
| `git diff --check`                                                                                                                              | Passed at the final phase 3 checkpoint.                                                                                      |

The HTTP integration suite recreates the Express application with the same database and private root and verifies identical authenticated bytes plus unauthenticated denial. It does not constitute an operating-system process restart or release-directory replacement. No production migration, production VPS path, proxy/cache behavior, coordinated backup/restore, physical device, real browser upload interaction, or representative-artwork review was executed. The per-class limits remain provisional because T002 is open. T001 and T002 remain unchecked, and no P02 reviewer acceptance or production readiness is claimed.

## Phase 4–5 implementation continuation — 2026-09-23

The same execution override was used to complete only T031–T043. It remains an implementation authorization rather than formal P00/P01 acceptance, P02 Draft approval, representative-artwork approval, or production readiness evidence.

Phase 4 adds owner-scoped `user_avatar` upload, attempt lookup, list, metadata, private binary delivery, and explicit unbound-candidate removal. The API derives ownership from the authenticated active, verified actor; a different user and an ADMIN receive the same non-disclosing 404 for another owner's avatar. ADMIN class authority remains server-enforced. Avatar output contains no owner claim or public URL. Exact repeated removal returns the removed tombstone result, while storage failure leaves `REMOVING` truth for later reconciliation. The browser uses the central media adapter and React Query owner keys, distinguishes temporary and authenticated accepted previews, removes private cache/object URLs when the session actor changes, preserves the 4 MiB hint, and states that an accepted upload is still an unselected private candidate.

Phase 5 makes list queries strict, centralizes published source-byte limits, rejects appended polyglot data by verifying exact JPEG/PNG/WebP container termination, classifies decoded pixel excess before bounded decode, and keeps canonical output free of source metadata. Storage rejects empty or globally out-of-bound staged bytes. The real Express matrix covers valid and invalid representatives for all six classes, rejected-row/final-file absence, missing/duplicate/out-of-order multipart parts, encoded path input, CSRF, per-actor upload rate limiting, private-existence parity, and production logger redaction. Arabic RTL controls announce validation, denial, transfer, pending, accepted, and removal states without claiming profile or parent-record persistence.

Fresh checks for phases 4–5:

| Command                                                                                | Outcome                                                                                                                          |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Focused contract regression before implementation                                      | Failed on the missing 4 MiB constant, strict unknown-filter rejection, and removal projection as intended.                       |
| Focused avatar service regression before implementation                                | Failed because the owner-scoped upload operation did not exist, then passed after implementation.                                |
| Focused adversarial decoder regression before hardening                                | Failed because a PNG with executable bytes appended was accepted, then passed after exact-container validation; 10 tests passed. |
| `pnpm --filter @fury/contracts lint`, `check-types`, `test`                            | Passed; 5 files and 38 tests passed.                                                                                             |
| `pnpm --filter @fury/database db:format`, `db:validate`, `lint`, `check-types`, `test` | Passed; Prisma schema remained valid, generated client succeeded, 2 files and 9 tests passed.                                    |
| `pnpm --filter @fury/database test:integration`                                        | Passed with Testcontainers; 3 files and 13 tests passed. The existing forward migration was not edited.                          |
| `pnpm --filter @fury/api lint`, `check-types`, `test`                                  | Passed; 24 files and 115 tests passed.                                                                                           |
| `pnpm --filter @fury/api test:integration`                                             | Passed with Testcontainers; 7 files and 65 tests passed.                                                                         |
| `pnpm --filter @fury/web lint`, `check-types`, `test`                                  | Passed; 57 files and 271 tests passed.                                                                                           |
| Focused avatar hook/picker/admin-form suite                                            | Passed; 3 files and 14 tests passed before the final package gate.                                                               |

The implementation still has no real-browser upload/progress/abort evidence, 320px or physical-device rendering evidence, representative-artwork limit review, production multi-process/shared rate-limit topology evidence, production VPS filesystem/proxy/cache verification, production migration run, operating-system restart or release replacement exercise, or coordinated backup/restore exercise. No build or root `pnpm verify` was run for this phase-limited continuation. T001/T002 and T044 onward remain open; phase 6 was not started.

## Phase 6–8 implementation continuation — 2026-09-24

The user authorized completion of the remaining implementation phases. T001 and T002 remain open because local implementation cannot supply formal P00/P01/P02 reviewer acceptance or approved representative artwork. The same limits therefore remain provisional and production readiness is not claimed.

Phase 6 adds strict shared reference query/body/params/output schemas and ADMIN-only `GET/POST/PUT/DELETE /api/v1/media/references` operations. References bind only an available class-matching ADMIN asset to an existing P01 Work cover/background slot or illustrated ChapterPage. Target uniqueness remains protected by the original P02 forward migration. Bind is an exact retry or `MEDIA_TARGET_CONFLICT`; replacement and retirement lock the reference row and require expected asset identity plus version; each transition appends immutable history. Active use blocks physical removal with `MEDIA_IN_USE` before deletion is queued. Concurrent replacement evidence produces one version-1 winner and one safe `VERSION_CONFLICT`. Fixture-backed Work/Chapter forms still have non-UUID local identities, so their regression tests confirm that they do not expose persistent bind actions. The central web adapter and React Query hooks are ready for a later screen with a real P01 target identity.

Phase 7 adds bounded, manually invoked reconciliation through `pnpm --filter @fury/api media:reconcile --limit=100`. A pending attempt is accepted only when it has a recorded source hash and its reserved asset metadata exactly matches final or staged bytes. Otherwise it becomes terminal `UPLOAD_INCOMPLETE`, partial bytes are removed, and the old attempt key remains unusable. Reconciliation completes interrupted removals, removes orphan stage files, marks missing or hash-mismatched available assets `UNAVAILABLE`, and restores availability only when the original byte length and SHA-256 match. Normal GET failures remain read-only. The coordinated recovery test restores the same generated asset, attempt, Work, reference, and event UUIDs with the sample stored hash `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`. The operational procedure is documented in `docs/operations/media-backup-restore.md`; no production backup or restore was performed.

Phase 8 updates the README and architecture reference, adds auth/public-output regressions, and executes the real HTTP upload → bind → private read/removal conflict → replace → stale conflict → retire → remove journey. OpenAPI documents the exact reference methods, CSRF authority, statuses, and stable conflict codes. No public media route or public content field was added.

Fresh checks for phases 6–8:

| Command                                                                   | Outcome                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm --filter @fury/contracts lint`; `check-types`; `test`               | Passed; 5 files and 40 tests passed.                                                                                                                                                                                                                                                                                                                                                                         |
| `pnpm --filter @fury/database db:validate`; `lint`; `check-types`; `test` | Passed; Prisma schema valid, generated client succeeded, 2 files and 9 tests passed.                                                                                                                                                                                                                                                                                                                         |
| `pnpm --filter @fury/database test:integration`                           | Passed with disposable PostgreSQL; 4 files and 15 tests passed, including media invariants and coordinated record recovery.                                                                                                                                                                                                                                                                                  |
| `pnpm --filter @fury/api lint`; `check-types`; `test`                     | Passed; 24 files and 115 tests passed.                                                                                                                                                                                                                                                                                                                                                                       |
| `pnpm --filter @fury/api test:integration`                                | Passed with disposable PostgreSQL; 8 files and 74 tests passed, including concurrent reference/removal, restart, partial-unlink, and reconciliation journeys.                                                                                                                                                                                                                                                |
| `pnpm --filter @fury/web lint`; `check-types`; `test`                     | Passed; 57 files and 275 tests passed.                                                                                                                                                                                                                                                                                                                                                                       |
| `pnpm --filter @fury/contracts build`; `pnpm --filter @fury/web build`    | Passed. The final Next.js build compiled without the stale-contract warnings seen before rebuilding the shared package.                                                                                                                                                                                                                                                                                      |
| `pnpm test:web-routes` against the freshly built local server             | Passed all 40 routes and the 404 fallback.                                                                                                                                                                                                                                                                                                                                                                   |
| Playwright CLI, `/admin/works/new`, 320 Ã— 800                            | The real browser loaded the protected route title, then correctly rendered the retryable server-unreachable state because no authorized API session/server was supplied. Media input/progress/abort, authenticated Arabic RTL layout, focus, contrast, and reduced-motion checks remain unverified. Temporary Playwright artifacts were removed; two pre-existing tracked snapshots were restored unchanged. |
| `pnpm verify`                                                             | Executed and failed at repository-wide `prettier --check` on 65 pre-existing tool, auxiliary worktree, snapshot, and Spec Kit files. It stopped before root lint/type/test/integration/build. Those files were not reformatted. T065 remains open.                                                                                                                                                           |

The focused migration, restart-by-app-recreation, restore, build, and route evidence is local. An operating-system process restart with an authenticated media read, real release-directory replacement, production VPS filesystem permissions, reverse proxy/cache behavior, shared multi-process rate limiting, scheduled/encrypted backup destination, production restore, physical device, and authenticated browser upload/progress/abort remain unverified. T064 remains open for the authenticated browser/device inspection. No production migration, destructive reset, commit, push, deployment, provider call, issue, or external message occurred. `PLAN.md` was not changed.

## Phase 9 convergence implementation — 2026-09-24

T068–T070 and T074–T075 are complete. The administrator and avatar candidate controls now retain the temporary preview through transfer and server processing, expose abort and authoritative attempt reconciliation, reject stale completion, list durable actor-scoped candidates, and distinguish first load, empty, filtered empty, refresh, denial, error, pending, processing, and accepted states. Validation, denial, pending/conflict, accepted, and clear outcomes use live regions and deterministic focus; clearing an accepted candidate restores focus to its file input. React Query cache keys include the actor and resource, uploads invalidate only the matching actor/class list scope, reference bind/replace/retire invalidate the exact target and affected asset metadata, and exact bind replay plus version conflict propagation are covered.

The same-actor simultaneous duplicate-upload regression crosses real Express HTTP, PostgreSQL, and private filesystem storage. Before the service correction, the pending retry returned `UPLOAD_ATTEMPT_CONFLICT`. The accepted behavior now treats an attempt with an as-yet-unrecorded source hash as pending, returns only `UPLOAD_IN_PROGRESS` or an exact terminal replay for the matching key, and leaves one accepted asset.

T072–T073 are complete with a disposable local operational exercise. Two real API child processes ran from separate simulated release working directories while sharing a private media root outside both directories. The first release directory was deleted before the second process started. A coordinated `pg_dump` data backup and private-directory copy were restored into a clean migrated PostgreSQL container and clean media root. The restored API preserved the Work, accepted attempt, asset, active reference, reference event, canonical SHA-256, and `image/jpeg` type. Authorized delivery returned 200, unauthenticated delivery returned 401, and an unrelated active user received the non-disclosing 404. Reconciliation changed a missing object from `AVAILABLE` to `UNAVAILABLE`, restored it to `AVAILABLE` only after the exact bytes returned, detected same-length corrupt bytes as `UNAVAILABLE`, and returned to `AVAILABLE` after the exact object was restored again.

Recovered local identifiers from the successful disposable exercise:

- Asset: `022f2b7c-af40-4f75-8d47-769fb2665048`
- Attempt: `bd4f96ac-2ba9-4699-9c4b-6c85ab82e09d`
- Work: `c20e498c-a19d-45de-9b40-9baf2b1168c7`
- Reference: `47a5c487-942a-4d91-8526-c484160257ee`
- Canonical SHA-256: `0a10a2d6739c1055ae9de98ddf85040adf9829a62483dc3602e75b63bc9b2209`

Fresh checks for Phase 9:

| Command                                                                                                      | Outcome                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused real HTTP duplicate-upload regression                                                                | Failed first with `UPLOAD_ATTEMPT_CONFLICT`; passed after correcting pending-attempt resolution.                                                                                                                                                                                                                                                                                                                                                                |
| Focused media hook, administrator picker, avatar picker, and work-form suite                                 | Passed; 4 files and 26 tests passed after the final focus-restoration change.                                                                                                                                                                                                                                                                                                                                                                                   |
| `pnpm --filter @fury/web lint`; `check-types`; `test`; `build`                                               | Passed; 57 files and 284 tests passed, and the Next.js production build generated all routes. The final CSS-only keyboard fix was followed by a fresh lint and production build.                                                                                                                                                                                                                                                                                |
| `pnpm --filter @fury/api lint`; `check-types`; `test`; `test:integration`                                    | Passed; 24 unit-test files with 115 tests and 8 integration-test files with 75 tests passed.                                                                                                                                                                                                                                                                                                                                                                    |
| `pnpm --filter @fury/contracts build`; `pnpm --filter @fury/database build`; `pnpm --filter @fury/api build` | Passed before the child-process restart and restore exercise.                                                                                                                                                                                                                                                                                                                                                                                                   |
| Disposable `pnpm exec tsx .tmp-media-operational-exercise.ts` from `apps/api`                                | Passed on the final corrected run; used two PostgreSQL 18.4 Testcontainers, two source API processes, one restored API process, coordinated database/filesystem backup and restore, authorization checks, and three bounded reconciliation cycles. The temporary script, containers, directories, and credentials were removed.                                                                                                                                 |
| Playwright CLI at 320 × 800 and 1440 × 900                                                                   | A real Chromium browser with controlled local API responses confirmed RTL, no horizontal overflow at either viewport, keyboard-visible content focus, effective reduced-motion transition suppression, temporary preview, disabled reselection, abort, retained uncertain preview, reconciliation prompt, and accepted-status focus. A discovered off-canvas sidebar overflow and hidden-sidebar focusability were corrected before the final responsive check. |
| `pnpm verify`                                                                                                | Ran and stopped at repository-wide `prettier --check` on the same 65 unrelated tool, auxiliary worktree, snapshot, and Spec Kit files. Root lint, type checks, tests, integration tests, and build therefore did not run through this aggregate command. Those files were not reformatted.                                                                                                                                                                      |

T066 remains blocked on formal P00/P01 dispositions, P02 Draft reviewer acceptance, and the 34 unchecked readiness items. T067 remains blocked on approved representative artwork for all six classes, so enforced bounds remain provisional. T071 remains open: the browser used controlled local API responses rather than a real authenticated browser session, did not produce reliable Axios 100% upload-progress events, and did not cover rapid reselection, stale account switching, measured contrast, a physical device, or deployed proxy/cache behavior. T076 remains open because the root formatting gate still fails on unrelated files. Production VPS permissions, reverse proxy/cache behavior, shared multi-process rate limiting, scheduled/encrypted backup storage, production restore, and production deployment remain unverified. No production migration, destructive reset, commit, push, deployment, provider call, issue, or external message occurred. `PLAN.md` remains unchanged.

## Phase 10 convergence implementation — 2026-09-24

T077–T078 are complete. React Query upload mutations now retain only the attempt identifier in mutation variables and cache. The selected `File`, temporary object URL, progress callback, and abort controllers remain in the candidate hook's transient refs. Cancellation and uncertain completion retain the same private preview and attempt identity for authoritative lookup. A terminal rejected attempt retains the selected file but creates a fresh attempt identifier when the user explicitly retries. Accepted content replaces the temporary object URL and revokes it exactly once; clearing, actor changes, and unmount also revoke the owned URL and abort outstanding upload, metadata, and binary reads. Late completions are rejected by generation checks, and private actor-scoped queries are removed when the actor changes.

The repository formatting failure was dispositioned without rewriting the 65 tool-owned or generated files. `.prettierignore` now excludes the local agent metadata directories, browser artifacts, generated workflow templates/configuration, and screenshot manifest that caused the aggregate failure. Repository source, feature artifacts, application code, and operations documentation remain covered by Prettier. A fresh root verification then reached every configured gate.

The first complete root verification exposed a real PostgreSQL serialization race in simultaneous reference replacement: Prisma surfaced PostgreSQL SQLSTATE `40001` through `P2010`, outside the existing `P2034` mapping. The media service now recognizes only the documented transaction-conflict signatures, proves an exact replay from the persisted reference event when possible, and otherwise returns the existing safe `VERSION_CONFLICT`. The focused real PostgreSQL service suite passed with eight tests after the correction.

Fresh checks for Phase 10:

| Command                                                                                              | Outcome                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused media hook regression before implementation                                                  | Failed for the intended missing behavior: upload mutation cache contained the selected file and callbacks; private reads had no abort signal; uncertain/rejected reconciliation lost the preview; and terminal rejection had no same-file retry. Five tests failed while 281 existing web tests passed.                                                                      |
| Focused media hook and picker regressions after implementation                                       | Passed; four files and 29 tests passed.                                                                                                                                                                                                                                                                                                                                      |
| `pnpm --filter @fury/web lint`; `check-types`; `test` after the code and test guard refactors        | Passed; all 57 web test files and 286 tests passed. Picker tests use the real candidate/list hooks and real QueryClients, with only the HTTP adapter doubled at the boundary.                                                                                                                                                                                                |
| First complete `pnpm verify`                                                                         | Reached real integration tests and failed on the simultaneous replacement `P2010` serialization conflict, which was not yet mapped to `VERSION_CONFLICT`.                                                                                                                                                                                                                    |
| Focused `apps/api/src/modules/media/media.service.integration.test.ts` against disposable PostgreSQL | Passed; one file and eight tests passed after the transaction-conflict correction.                                                                                                                                                                                                                                                                                           |
| Final `pnpm verify`                                                                                  | Passed with exit code 0: Prisma format/validation/generation; repository formatting; all package lint and type checks; 40 contract tests, 9 database unit tests, 115 API unit tests, 286 web tests, 75 API integration tests, 15 database integration tests; all builds; six required build entry artifacts across 366 files with no test artifacts; and `git diff --check`. |

The web test run still emits existing React warnings from unrelated mocked image components passing boolean `fill` and `unoptimized` attributes to DOM elements. T064 and T071 remain open because no authenticated real-browser session or supplied credentials were available, and the task forbids reading environment secrets or fabricating credentials. Therefore real Axios upload progress, authenticated rapid reselection and actor switching, measured contrast, physical-device behavior, and deployed proxy/cache behavior remain unverified. T065 remains open because its accepted reviewer gates and browser prerequisite are incomplete even though the aggregate command now passes. T066 still requires formal P00/P01 dispositions, P02 Draft acceptance, and disposition of all 34 unchecked readiness items. T067 still requires approved representative artwork for all six media classes. Production VPS permissions, shared multi-process rate limiting, scheduled or encrypted backup storage, production restore, production migration, and deployment remain unverified. No production migration, destructive reset, commit, push, deployment, provider call, issue, or external message occurred. `PLAN.md` remains unchanged.

## Remaining-task execution attempt - 2026-09-24

The active feature path was reconfirmed as `specs/002-persistent-vps-media`. The local PostgreSQL service was healthy. The web and API were started with an isolated temporary media root outside the repository, and a real headed Chromium session opened the protected administrator Work route. The session had no authentication state and the route correctly redirected to `/auth/login`. No environment value was read and no credential was created or inferred. Consequently the authenticated upload, progress, abort, rapid reselection, account-switch, media focus, and measured-contrast parts of T064/T071 remain unverified; physical-device and deployed-cache checks also remain external boundaries.

The formal P00/P01 dispositions, Draft P02 reviewer acceptance, all 34 reviewer-owned readiness dispositions, and approved representative artwork for the six media classes are still absent. T001/T066 and T002/T067 therefore remain open. T065 remains open because those accepted gates and the authenticated browser prerequisite are incomplete.

`pnpm verify` was run again and exited 0. Prisma format/validation/generation and repository formatting ran successfully. Turbo replayed valid cache entries for package lint, type checks, unit tests, and builds; the cached results remain 40 contract, 9 database unit, 115 API unit, and 286 web tests. API and database integration suites ran uncached and passed 75 and 15 tests respectively. The build-output assertion found all six required entry artifacts across 366 emitted files with no test artifacts, and the command's final `git diff --check` passed. The existing React mock warnings for boolean `fill` and `unoptimized` attributes were emitted again. No task checkbox was changed because none of the remaining task acceptance conditions was completed. `PLAN.md` remains unchanged.

## Authenticated browser and representative-artwork closure attempt — 2026-09-24

The six-class technical artwork corpus is stored in `specs/002-persistent-vps-media/acceptance-artwork/`. The production decoder accepted every source through its real class-specific validation path without changing the published bounds:

| Class                | Source                   | Source dimensions | Canonical bytes | Canonical SHA-256 |
| -------------------- | ------------------------ | ----------------: | --------------: | ----------------- |
| `work_cover`         | `work-cover.png`         |       1024 × 1536 |       3,678,873 | `404c01d3…`       |
| `work_background`    | `work-background.png`    |       1536 × 1024 |       4,094,784 | `3907ce0f…`       |
| `chapter_page`       | `chapter-page.png`       |       1024 × 1536 |       3,298,097 | `951f8774…`       |
| `user_avatar`        | `user-avatar.png`        |       1254 × 1254 |       3,259,852 | `9032adab…`       |
| `avatar_frame`       | `avatar-frame.png`       |       1254 × 1254 |       1,899,729 | `fa94d3ee…`       |
| `comment_decoration` | `comment-decoration.png` |        2172 × 724 |       1,262,452 | `e156069b…`       |

These generated images are a representative technical acceptance corpus. They are not owner-approved launch artwork, so T002/T067 and readiness CHK016 remain open pending explicit artwork disposition.

A disposable PostgreSQL 18.4 container received the real migration chain. The seed boundary created one active verified ADMIN and one active verified USER only inside that disposable database. A headed Chromium session used the real web application, API, CSRF/authentication flow, multipart parser, database, private filesystem root, decoder, and authenticated binary response. No environment secret was read, no production/shared database was used, and the temporary accounts, services, database, media root, logs, browser session, and helper scripts were removed after the exercise.

The first real abort exposed two defects and supplied failing regressions before their fixes:

1. If cancellation occurred before the server reserved the attempt, `GET /api/v1/media/uploads/:attemptId` returned `404 NOT_FOUND` but the hook kept offering the same lookup forever. The hook now retains the private selection and offers a new attempt key only for this authoritative not-reserved result. The focused web regression failed with `retryMode: "check_attempt"` before the fix and passed with `retryMode: "new_attempt"` afterward.
2. Destroying Busboy with the validation exception propagated an unhandled file-stream error and shut down the API. The multipart boundary now records the interrupted-upload validation failure, unpipes the request, destroys the parser without propagating private parser diagnostics, and owns the file-stream error so finalization rejects safely. The focused API regression first failed with one uncaught exception and then passed with no unhandled error.

Fresh browser observations:

- At 320 × 800, the page was RTL with no horizontal overflow. Real file selection showed the temporary preview and `جارٍ نقل الصورة… 0%`; the input was disabled during transfer, which prevents rapid reselection from racing the current candidate.
- Abort moved focus to the live pending region, retained the temporary preview, and offered authoritative reconciliation. The API remained available after the interrupted request.
- The never-reserved lookup returned the truthful Arabic `NOT_FOUND` message. Retrying without another file selection created a new attempt; observed phases included `uploading`, `processing`, then `accepted`. The real POST returned 201 after canonicalization, and the authenticated private content GET returned 200.
- The accepted status received focus. At 320 × 800 and 1440 × 900 the accepted state remained visible, RTL, and free of horizontal overflow.
- Measured accepted-status colors were white over an effective `rgb(22.74, 22.74, 22.74)` background, a 17.97:1 contrast ratio.
- With `prefers-reduced-motion: reduce`, the maximum computed animation or transition duration under `main` was 0.01 ms and no duration exceeded 10 ms.
- After logging out the ADMIN and logging in as the disposable USER, `/admin/works/new` redirected to `/dashboard`; the USER settings page showed the new identity and contained no ADMIN cover candidate. This exercises actor switching without exposing the prior actor's private preview/cache.
- The ADMIN gift dialog opened from the keyboard, placed and retained focus inside the dialog after Tab, closed on Escape, and restored focus to the trigger.

Fresh focused/package checks after both fixes:

| Command                                                                                                        | Outcome                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `pnpm exec vitest run --config vitest.config.ts src/modules/media/media.multipart.test.ts` from `apps/api`     | Failed first with the intended uncaught interrupted-stream error; passed after the parser lifecycle fix. |
| `pnpm exec vitest run --config vitest.config.ts src/features/media/hooks/media.hooks.test.tsx` from `apps/web` | Failed first because a 404 retained `check_attempt`; passed 14 tests after the retry correction.         |
| `pnpm --filter @fury/api lint`; `check-types`; `test`                                                          | Passed; 25 files and 116 tests.                                                                          |
| `pnpm --filter @fury/web lint`; `check-types`; `test`                                                          | Passed; 57 files and 287 tests.                                                                          |

The real-browser parts of T064/T071 are complete. Physical-device behavior and deployed reverse-proxy/cache behavior were not exercised and remain explicit release-environment boundaries. Production VPS permissions, shared multi-process rate limiting, scheduled/encrypted production backup storage, production restore, production migration, and deployment also remain unverified. Formal P00/P01/P02 reviewer dispositions and owner approval of the representative artwork remain separate open gates. `PLAN.md` was not changed.

The first final `pnpm verify` stopped only because this newly added evidence section required Prettier formatting. After formatting this file, the command was rerun from the start and exited 0. It passed Prisma format/validation/generation, repository formatting, all package lint and type checks, 40 contract tests, 9 database unit tests, 116 API unit tests, 287 web tests, 75 API integration tests, 15 database integration tests, all builds, six required build entry artifacts across 366 emitted files with no test artifacts, and `git diff --check`. Docker Engine was 29.1.3 and PostgreSQL reported 18.4. The existing React mock warnings for boolean `fill` and `unoptimized` attributes were emitted. T065 remains open solely because it also requires accepted P00/P01/P02 review gates; the technical repository and browser prerequisites pass.

## Owner requirements-review disposition — 2026-09-27

The owner confirmed completed human review of the written requirements. All 34 reviewer-owned items in `checklists/readiness.md` are accepted. This does not supply the representative-artwork decision in T002/T067, formal P00/P01/P02 phase-exit evidence in T001/T065/T066, or a real deployment restore.

## Legacy closeout named-result review — 2026-10-31

PHASE_ID=P02 / TASK_SCOPE=T079. The accepted written-requirements checklist remains read-only. Existing technical-continuation authority and the owner's bounded closeout request permit this behavior-preserving maintenance; formal predecessor exits and representative-artwork acceptance remain open. `MediaService` now names awaited delegation/database results for reconciliation, upload reservation/completion/replay, protected bytes, metadata lookup, list projection and removal. Transactional upload-attempt creation and removal-state updates remain inside their original transaction callbacks. No reference, attempt, replay, state, limit, storage, provider or UI policy changed.

Clean-code-guard review checked the full production diff and immediate controller/reconciler callers against B02/B33: helpers remain inside the class, permitted one-argument mappers remain direct, and no class wrapper/cache/retry or extra abstraction was introduced. Existing real PostgreSQL, HTTP and storage tests retain all assertions; no new mirror tests were needed. API types and lint passed. API integration passed 11 files / 156 tests (`/tmp/fury-closeout-p02-owner-integration.log`, 21.76 seconds). The existing pg concurrent-query deprecation remains visible. T079 awaits the final shared gate before completion.

## Final local closeout disposition — 2026-10-31

PHASE_ID=P02 / TASK_SCOPE=T079. The final source aggregate passed (`/tmp/fury-closeout-verify-final-enums.log`), including 156 actual API integrations and 36 actual database integrations, plus package checks and build-output validation. T079 is complete. The final media-service diff was reviewed for unchanged transaction callbacks, upload-attempt identity/replay, protected authority, reference history and byte checks. P05's reused integrity helper preserves the private `MediaUnavailableException` boundary and exact length/SHA behavior. No limits, media-class policy, provider or presentation changed.

All 79 task identities and existing P02 artifacts were reconciled against actual media owners and current regression discovery. The class bounds/decoder, private storage/path protections, multipart limits, real upload/read/reference/remove/reconcile, duplicate/race/rollback and paired database/media recovery suites remain present and pass. Historical 2026-09-24 browser, process restart/release replacement and paired recovery records remain dated evidence, not newly performed manual operations. The current real filesystem/PostgreSQL suites corroborate integrity and recovery. The earlier Work form type-file reference in T028 moved into the later accepted P03 Work editor/model owners; it is not a missing P02 feature. P04 now owns Chapter-page association writes and explicitly rejects the former generic-media route, with preserved real HTTP tests; P05's anonymous Work-scoped cover/background reads do not make private `/media` public.

Read-only convergence found no new unowned technical task. **T001/T002/T065/T066/T067 remain uncompleted gate identities**: formal P00/P01 exits and phase disposition, plus owner-approved representative artwork/bounds acceptance. The 2026-09-27 written requirements acceptance remains accepted and read-only; it does not resolve those gates. Six generated technical images are not owner artwork approval. No deployment, physical-device, proxy/CDN or future dataset recovery acceptance was fabricated.

## T079 completion correction — 2026-11-01

The remediation request authorized current P00–P05 repairs and sequential stage continuation. After the P05 T071–T075 implementation/checks and read-only convergence, the feature was selected to P02 between stages. IMPLEMENT bound only T079; both written-quality checklists (16/16 and 34/34) were reviewed without changing approval markers. The recorded technical continuation permits this maintenance; P00/P01 independent exits and P02 representative-artwork/phase/release acceptance remain open.

A complete current-source review found that the earlier T079 pass had missed the outer transaction returns in `bindReference`, `replaceReference` and `retireReference`. Its completion claim was therefore incomplete. The same adequate task was reopened during IMPLEMENT, corrected and rechecked; no duplicate task was invented. Each method now awaits a named result inside its existing try/catch and returns it afterward. Every transaction operation, lock order, isolation level, exact-replay condition, conflict translation, immutable event and published-cover refusal remains unchanged. Related slot/class comparisons use existing `MediaReferenceSlot`/`MediaClass` constants with identical values. No migration, limit, presentation, role or storage policy changed.

The first correction omitted the `MediaClass` import: type checking reported TS2304 and four of 26 actual media service/HTTP cases failed with ReferenceError/500. This was an introduced import error, not reproduction of an existing behavior defect. The import was corrected; fresh types and the same **26/26** real PostgreSQL/HTTP/filesystem cases passed, including concurrent replacement, retry, stale loser, active-reference safety, private authority and publication history. No assertion/timeout/retry/suppression changed; no mirror test was added for named variables.

Clean-code-guard reviewed complete methods and immediate controller/Work-management callers, including await/catch and rollback behavior. AST inspection of all **16** service/controller owners found zero B33 top-level violations; MediaService has no non-mapper returned call expressions. A source search found no direct `return await` or `return this.*` in API service owners. The subsequent full root `pnpm verify` exited **0**: API unit **154**, API integration **158**, DB integration **36**, API lint/types/build and build-output validation passed freshly; unchanged web **474**, contracts **117**, DB unit **10** and other shared outputs were cached in this aggregate, with preceding fresh web execution and separate fresh contracts **117** / DB unit **10** recorded in the P05 evidence. The pg/jsdom notices remain visible. T079 is technically complete after this correction, with no human/phase/release acceptance implied.

## T080 error ownership — 2026-11-01

A separately selected read-only P02 CONVERGE recorded B12's remaining repeated inline error definitions as T080; IMPLEMENT bound only T080 after the unchanged 16/16 and 34/34 written-quality preflight and existing technical continuation. `media.errors.ts` now owns concrete resource/attempt/reference conflict and absence errors, while existing common Forbidden/Unauthorized exceptions own generic actor denials. The reusable unavailable-read error moved to `infrastructure/media/media.errors.ts` because actual private-media and public-content consumers share it; the old feature path re-exports the same class. The integrity helper and public service reuse this definition. No error framework, wrapper service, migration, authority, retry, publication or presentation behavior was added.

The complete MediaService throw sequence was checked through TypeScript AST against the beginning-of-request source: **60 throw sites** preserve their message/status/code outcomes or unchanged domain construction. All current catch/rollback/replay callers were reviewed; operational errors do not expose subclass names in the public envelope. The first type run found the base `AppError` import was still required for catch classification; it was restored before tests ran. The corrected types/lint and **154 API units / 158 actual API integrations** passed. The subsequent root `pnpm verify` exited **0**, freshly repeating API checks/integration/build and **36 DB integrations**, with **6 required entries / 386 emitted files** and no emitted tests. Unchanged web/contracts/database unit/build outputs are cached with their separately recorded current fresh evidence. Existing warnings remain unsuppressed. No constructor mirror test was added.

Clean-code-guard verified B12 error ownership/dependency direction, concrete reusable error responsibilities, exact safe wire compatibility, B33 class boundaries and preserved behavior. Test-guard checked the existing actual HTTP/PG/filesystem/error cases; docs-guard checked shared ownership and current verification numbers. P02 T080 is technically complete; representative artwork and formal predecessor/phase/release approvals remain open. A read-only P02 convergence follows; the original feature pointer will be restored only between stages.

## Representative artwork decision package — 2026-11-01

**Still unresolved: T002 and T067; FR-005–FR-006, SC-001.** An independent
closeout reviewer rechecked the actual media contracts, decoder/storage/HTTP
owners and existing technical acceptance evidence. The six generated PNG previews
in `acceptance-artwork/` demonstrate technical handling only. They have no recorded
owner approval as representative editorial artwork; no such approval is inferred.

The remaining owner action is to approve representative images for **all six
classes** against these enforced limits, or identify concrete bounds to change:

| Class                    | Encoded limit | Width × height       | Additional rule                |
| ------------------------ | ------------- | -------------------- | ------------------------------ |
| Work cover               | 8 MiB         | 300–4000 × 400–6000  | Ratio0.65–0.85                 |
| Work background          | 8 MiB         | 800–6000 × 450–4000  | Ratio1.5–2                     |
| Illustrated Chapter page | 12 MiB        | 300–6000 × 300–12000 | Ordered saved page identity    |
| Avatar                   | 4 MiB         | 128–4096 × 128–4096  | Owner-scoped media authority   |
| Frame                    | 4 MiB         | 128–4096 × 128–4096  | PNG/WebP with nonopaque pixels |
| Decoration               | 4 MiB         | 64–4096 × 64–4096    | PNG/WebP with nonopaque pixels |

All classes have a 24-million decoded-pixel ceiling, one frame and bounded decode.
The shared contracts, browser hints, OpenAPI and validation tests must change
together if the owner selects different bounds. The existing technical checks
remain useful evidence; they cannot supply the missing human editorial judgment.
This decision blocks formal P02 exit and inherited phase acceptance/admission.
It does not invalidate the explicitly authorized isolated synthetic P05 work.

## Independent legacy acceptance reconciliation — 2026-11-01

The separately authorized independent reviewer `/root/legacy_review` inspected
literal task/phase criteria, current owners, historical execution records and
accepted written requirements. The final post-T082 shared verification is linked
in [P05 evidence](../006-public-catalog-discovery-seo/evidence.md); it is a local
synthetic check, not production or human artwork approval. No written-review or
human acceptance marker was changed.

T001/T066 prerequisite and written-review obligations: **PASS** after
current P00/P01 dispositions; the owner's34 accepted P02 written items date to
2026-09-27. This retrospective closeout does not pretend the formal prerequisites
were accepted before the historical technical continuation.

T065 is complete as an evidence/comparison task: its wording requires actual
checks and pass/fail/unverified boundaries, not universal acceptance. Each P02 exit
item was compared: all-six-class positive/negative uploads PASS; MIME/decode/size/
executable/path rejection PASS; restart/release-replacement persistence PASS;
unauthorized upload/replacement/removal PASS; active-reference protection PASS;
paired database/media restore PASS, using the existing actual local evidence and
current full media/database/HTTP regressions. The additional spec gate FR-005–006/
SC-001 remains **UNACCEPTED**: no approved representative-artwork/bounds decision.
T002/T067 remain unchecked. Their reviewable six-class decision package is above.
**P02 formal phase exit remains blocked**, even though T065 records this comparison
and independent technical work is complete. Actual VPS/CDN/editorial release
acceptance is not inferred from synthetic fixtures.

The generated technical previews are directly reviewable:
[cover](acceptance-artwork/work-cover.png),
[background](acceptance-artwork/work-background.png),
[Chapter page](acceptance-artwork/chapter-page.png),
[avatar](acceptance-artwork/user-avatar.png),
[frame](acceptance-artwork/avatar-frame.png), and
[decoration](acceptance-artwork/comment-decoration.png).
They are explicitly not representative owner-approved artwork. The requested
acceptance is the six-class bounds decision against appropriate approved images,
not approval of a passing test run or these generated previews by implication.

## Current owner limits decision and extension intake — 2026-11-01

Numerical limits: OWNER APPROVAL RECORDED directly from the current request.
All six byte/dimension/ratio/transparency-policy entries match current source.
The dated spec/plan/contract overlay supersedes T002/T067's artwork prerequisite;
no generated-artwork or historical personal review is claimed. New animation and
progressive tasks T081–T085 remain unverified until executed. The prior P05 closure
and accepted predecessor technical dispositions remain dated, reusable evidence.
The original selection is P05; P02 was selected only between command stages.
Baseline HEAD remains868948bb9f51fe9fdf6f40d18e8d8b7d920a1f9f on main, with1292
versionable entries copied/hashed outside the checkout before this request's edits.
Governance2.1.0→2.2.0 changed only constitution/guidance/templates/adapters;1054
application/package/accepted-artifact/pointer entries remained byte-identical.

## Current media-foundation execution — 2026-11-01

The dated current owner decision approves all six existing numerical limits and
supersedes T002/T067's old artwork prerequisite; no generated-artwork review is
claimed. Constitution2.2.0 and the appended accepted requirements authorize the
scoped P02 extension, with original IDs/history preserved.

T081/T082 complete class-specific GIF/WebP production, bounded processing and
actual storage/HTTP/replay/rollback/concurrency/reconciliation/restart acceptance.
T083/T084 integrate existing private/public animated/motion consumers and consume
bounded progressive loading in the actual saved administrator Chapter preview.
The protected reader still uses `MOCK_PAGES`; exact future P07 obligations are in
the existing roadmap/frontend guide, without future-reader implementation.

[Current execution record](evidence/media-foundation/README.md) retains fresh
focused checks, five shuffled processes, actual persisted-browser measurements,
failed history/corrections, native animation proof and measurement limits. Final
aggregate, convergence, task counts, preservation and owned cleanup are separate
explicit records; prior human/independent approvals remain historical.

Final T085 closure: root `pnpm verify` exit0, fresh full tests/integration, final
production-browser static/animated/slow/recovery proof, unchanged prefetch business
fingerprints, all40 route probes plus404, clean separate1494-entry convergence,
exact P05 selection restoration and owned runtime cleanup are complete. The
[current final ledger](evidence/media-foundation/final-legacy-dispositions.json)
records458legacy identities:456verified and2superseded, with no active legacy work.
The existing fixture protected reader remains P07; local synthetic acceptance is
separate from later real deployment-data/recovery/rollout obligations. **LEGACY
CLOSEOUT: COMPLETE. NEXT SPEC: READY.** No new human/artwork/independent approval or
release is asserted.

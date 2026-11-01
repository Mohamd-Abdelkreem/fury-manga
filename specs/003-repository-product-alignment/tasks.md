# P00 Completion Tasks

**Scope**: `PLAN.md` P00 only. No P01/P02 feature implementation, production migration, reset, deployment, commit, push, or `PLAN.md` edit.

- [x] T001 Preserve current edits; confirm ratified constitution, root guidance links, active P02 pointer, and exact P00/P01 migration order (FR-001, FR-012).
- [x] T002 Add failing shared contract and real HTTP tests for rejected phone input, absent safe output, and preserved account/CSRF flows (FR-003–FR-004; AE-001).
- [x] T003 Add disposable PostgreSQL populated-upgrade tests for forward phone removal, preserved account/session data, and repeat deploy (FR-003–FR-004; AE-002).
- [x] T004 Remove phone from shared auth/account contracts, API account owners, web form values, fixtures and tests; add only a new forward migration after P01, leaving applied migrations/generated output untouched (FR-003–FR-004; AE-001–AE-002).
- [x] T005 Add focused web regressions for reader denial, chapter-number bounds, local completion truth, and disabled ad presentation/detection (FR-005–FR-008; AE-003–AE-005).
- [x] T006 Apply the current protected-route behavior to the sample chapter route and correct the reader's local completion copy (FR-005–FR-006; AE-003).
- [x] T007 Restrict the chapter form to positive integers, preserve drafts on denial, and replace false fixture-save feedback in touched local actions (FR-007, FR-011; AE-004).
- [x] T008 Disable public ad placeholders and detection until P13 while retaining the approved design and ADMIN guard (FR-008–FR-009; AE-005).
- [x] T009 Check in the fixture/local-status inventory; re-run and classify the historical design audit; confirm obsolete concepts remain absent and documentation matches source (FR-001–FR-002, FR-010–FR-011; AE-006).
- [x] T010 Run focused contract/database/API/web tests and real-browser reader/RTL checks; record actual results and limits (FR-012; AE-001–AE-006).
- [x] T011 Run relevant lint, type, build, format, `pnpm verify`, and `git diff --check` without weakening gates; record every failure or unverified boundary (FR-012; SC-006).
- [x] T012 Reconcile the final diff against every P00 exit criterion, obtain independent phase disposition, and mark P00 complete only if each applicable gate truly passes (FR-001–FR-012; SC-001–SC-006).

## Phase 2: Convergence

- [x] T013 Fix the reproduced disposable populated-upgrade cleanup race in `packages/database/tests/integration/migration.integration.test.ts`: await physical connection shutdown before dropping the owned database, retain every preservation/rollback/redeploy assertion, and rerun the real PostgreSQL suite plus the current repository gate. The 2026-10-31 baseline passed 36 assertions but exited 1 with unhandled `57P01` during the phone-removal upgrade. Trace: FR-004/FR-012, AE-002/AE-006, Constitution VII, B50/B51 (partial).

## Phase 3: Convergence

- [x] T014 Repair the macOS temporary-path fixtures that fail the required current repository gate in `apps/api/src/core/config/media.config.test.ts`, `apps/api/src/infrastructure/media/media-storage.test.ts`, and `apps/api/src/infrastructure/email/email-delivery.test.ts`. Use canonical owned temporary directories so Turbo's `/tmp` alias does not fail production symlink rejection or exact preview-path assertions. Retain all symlink, traversal, identity, failure, and secret-absence checks; change no production policy or UI. Reproduce with `TMPDIR=/tmp`, run the affected real-filesystem suites, then rerun root `pnpm verify`. Trace: FR-012, AE-006, Constitution VII, B50/B51 (partial).

## Phase 4: Convergence

- [x] T015 Isolate `apps/api/src/modules/media/media.reconcile.integration.test.ts` from prior suites' database-only media fixtures. The 2026-10-31 aggregate run reproduced `markedUnavailable:2` instead of the required 1 because another completed suite left an available asset with no bytes in this suite's private root. Establish clean content/media rows inside the global setup's disposable PostgreSQL before each scenario, retain exact reconciliation counts and state/history assertions, and verify real PostgreSQL in normal and shuffled file order plus the current aggregate gate. Trace: FR-012, AE-006, Constitution VII, B46/B50/B51; P02 FR-023 (partial).

## Phase 5: Convergence

- [x] T016 Diagnose and correct the `ECONNRESET` observed with seed 31031 in `apps/api/src/content.integration.test.ts`'s management-authority matrix. Preserve every actor/target/status/privacy/final-state assertion and real Express/PostgreSQL boundary. Give the matrix's many sequential requests an explicitly owned listening-server lifecycle rather than repeatedly opening/closing ephemeral servers; verify the failed seed and normal aggregate without retrying failed requests or relaxing assertions. Trace: FR-004/FR-012, AE-001/AE-006, Constitution VII, B46/B50/B51 (partial).

## Phase 6: Closeout convergence — authentication owner boundaries

- [x] T017 Reconcile the functional token utility `apps/api/src/infrastructure/security/jwt.service.ts` with current B33: preserve its purpose-bound token functions in a correctly named utility owner, update all actual exports/imports and its focused tests plus the current `PROJECT_REFERENCE.md` pointer, and verify actual token/auth/content/media callers. Do not manufacture a class wrapper, change claims/secrets/lifetimes, alter auth behavior or rewrite historical artifacts. Trace: FR-004/FR-012, AE-001/AE-006, Constitution IV/VII, B33. The current source has exported functions/constants at service-file top level, contradicting the adopted rule.
- [x] T018 Prepare named transaction/token-pair/URL results in `apps/api/src/modules/auth/auth.service.ts` and `apps/api/src/infrastructure/email/email.service.ts` before returning function/method results, retaining the same callbacks, session revocation, timestamps, token purposes and delivery behavior. Reuse current type owners and existing tests; run focused auth/token/email checks and real authentication/CSRF/session integration plus the aggregate. No production account/provider action or presentation change is authorized. Trace: FR-004/FR-012, AE-001/AE-006, Constitution IV/VII, B02.

# Code review: current Fury Git Changes — 2026-11-01

## Summary

PASS after the corrections below: no unresolved blocking finding was identified in
this review. The complete `pnpm verify` command exited 0 with forced fresh execution
and 1,020 passing tests. This is executing-agent review of the current local changes,
not a new independent/human approval or a deployment acceptance.

Counts: **1 critical, 0 important, 2 nits — all resolved**.

The starting inventory contained 772 changed/deleted/untracked paths, including
171 source/style/script/test paths (48 test/support paths). Review traced the public
catalog HTTP/contracts/queries, publication and private-media boundaries, browser/server
adapters, cache/error ownership, persisted admin form/preview consumers, animation
validation and progressive resource lifecycle. Governance, evidence and generated
captures were inventoried separately from production code. Existing accepted scope,
frontend exceptions and legacy task identities were preserved.

## Critical findings

- `packages/contracts/src/content/content.schema.ts:248` — correctness: compact
  `JSON.stringify` length did not include PostgreSQL JSONB separator spaces, although
  the existing database constraint measures `octet_length(text_content::text)`.
  A document whose persisted text was 524,289 bytes passed request validation and
  returned HTTP 500 on insert. **Fixed:** count structural separator spaces in the
  shared document schema before accepting the request. The exact 524,288-byte
  document returns 201 and reloads intact; one additional byte returns 400 with
  `VALIDATION_ERROR` at `body.textContent`, without creating another Chapter.
  The new real HTTP/PostgreSQL regression in `apps/api/src/content.integration.test.ts`
  measures the fixture with PostgreSQL itself, reproduced the failure before the
  change and passes afterward. No database constraint or migration was weakened.

## Nits

- Dead production files — DRY/KISS/YAGNI: the unused `TrendingSection` returned
  `null`, its CSS had no remaining production consumer, and the feature-level
  `use-reduced-motion.ts` only forwarded a shared hook. **Fixed:** remove these
  files, import the shared hook directly in Hero/Suggestions and remove the
  null-component-only test assertion. Existing meaningful empty-section/community
  assertions remain. No rendered component or CSS consumer was removed.
- `apps/api/src/infrastructure/media/image-processor.ts:21` — project B02:
  `return await validateImage(...)` bypassed the named-result convention.
  **Fixed:** await the named `image` result inside the same `try/finally` and return
  it there. Capacity is still released after settlement on success and failure.

## Coverage

- Section A (naming & functions): named-result convention repaired. Reviewed owners
  retain named responsibilities and explicit result/state types. Repository rules
  govern justified function size; no arbitrary line-count rewrites were introduced.
- Section B (comments & formatting): scoped source formatting and whole-repository
  format/lint checks pass. The JSONB comment records the storage constraint rather
  than narrating the implementation.
- Section C (SOLID): current media admission belongs to the composition-owned
  processor; storage integrity, authorization/public eligibility and browser resource
  ownership retain their separate boundaries. No unresolved scoped finding identified.
- Section D (DRY/KISS/YAGNI): removed the unused component/CSS and forwarding module;
  retained the existing shared motion owner and necessary lifecycle boundaries.
- Section E (AI failure modes): corrected the request-versus-storage byte mismatch;
  checked real saved data, error/retry propagation, stale identity/cache fencing,
  animation resource bounds and cleanup. No new synthetic production success, bypass
  or future protected-reader implementation was introduced.

`clean-code-guard` was applied to production changes. `test-guard` checked the new
regression's actual HTTP/database boundary, independent persisted-byte measurement,
unchanged success behavior, typed validation failure and absence of a failed write.
It adds one boundary scenario, with no retry, timeout increase or mocked persistence.
React/Next review covered the unchanged shared-hook behavior and resource/image
consumers. `docs-guard` checked these claims against source, execution output and
retained capture hashes; technical links are checked after consolidation.

## Fresh verification

| Check                                                           | Result                                                               |
| --------------------------------------------------------------- | -------------------------------------------------------------------- |
| Complete `pnpm verify`, `TURBO_FORCE=true`                      | exit 0; all Turbo stages reported 0 cached tasks                     |
| Contracts                                                       | 117 passed                                                           |
| API units                                                       | 164 passed                                                           |
| Web                                                             | 528 passed                                                           |
| Database units                                                  | 10 passed                                                            |
| API HTTP/PostgreSQL integration                                 | 165 passed                                                           |
| Database integration                                            | 36 passed                                                            |
| Prisma format/validation/generation, format, lint, types, build | passed                                                               |
| Build-output assertion                                          | 6 required entry artifacts; 390 emitted files without test artifacts |
| Final whitespace/reference/preservation checks                  | passed; capture indexes preserve 366 original hashes                 |

[Raw execution evidence](final-code-review-checks.json) retains the failing pre-fix
run, passing focused regression and complete fresh aggregate. The pre-fix command's
extra `--` caused the integration runner to execute all 165 tests: 164 passed and
the new regression failed with 500 instead of 400. The corrected focused command
then passed 1 test; its 37 unselected tests were filtering, not exclusions added to
source. The final full aggregate passes all 165 integration tests.

Verification used an unreachable loopback validation URL for schema/build commands;
the integration setup discards that URL and owns disposable PostgreSQL containers.
No real environment file, dataset or deployment was used. Existing React image-mock,
jsdom navigation and PostgreSQL-driver deprecation notices remain visible in the
raw output; no warnings were suppressed or treated as new product behavior.

## Artifact cleanup and preservation

The 366 separate historical terminal outputs (1,033,049 original bytes) now live in
two readable transcript bundles and two JSON indexes:

- [Media-foundation bundle](../../002-persistent-vps-media/evidence/media-foundation/verification-transcripts.md)
  and [exact-byte index](../../002-persistent-vps-media/evidence/media-foundation/verification-transcripts.index.json).
- [P05 bundle](verification-transcripts.md) and [exact-byte index](verification-transcripts.index.json).

Every original byte count/SHA-256 is verified against the pre-review inventory.
Where display formatting normalizes carriage returns, trailing spaces or terminal
blank lines, the index also retains exact original bytes as base64. Historical JSON
path strings remain dated execution identifiers resolved through those indexes;
actual Markdown links now point to the retained sections. Failed/interrupted runs
were retained alongside successes. Two unreferenced temporary browser YAML snapshots
were removed after backup. Before/after design screenshots, animation samples,
measurement JSON, test fixtures and acceptance history remain.

Git Changes decreased from **772 to 410 individual paths**, including the two new
review records. Existing code was backed up and hashed before modification; remaining
baseline differences are limited to the listed correction/cleanup and evidence-link
updates. HEAD, index and the original feature pointer remain unchanged. No commit,
push, PR, deployment, new feature, owner approval or historical checklist write occurred.

## Verification boundaries and readiness

No full browser journey, visual comparison, route-probe run or physical-device test
was repeated during this review. Existing dated rendered/animation/performance and
40-route/404 evidence remains in the
[media-foundation execution record](../../002-persistent-vps-media/evidence/media-foundation/README.md).
This review changes no rendered design. The exact byte-limit repair is verified
through actual HTTP and PostgreSQL rather than a browser-size simulation.

The [legacy closeout register](../../../docs/product/legacy-closeout.md) remains
COMPLETE / READY FOR NEXT SPEC after this correction and fresh aggregate. Real
protected-reader API/content/progress/resume/opens still belong to P07; its current
`MOCK_PAGES` prototype is not silently promoted to a completed feature. Separately
recorded deployment-data/recovery/rollout obligations remain release-only. Readiness
is bounded by the verified scope and does not claim a defect-free system.

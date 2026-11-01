# Cross-phase UI acceptance — 2026-11-01

**IMPLEMENTED P00–P05 LOCAL ACCEPTANCE: PASS. LEGACY CLOSEOUT: COMPLETE.
NEXT SPEC: READY.** This follow-up tests the current implementation and fixes four
reproduced defects. It does not grant deployment, production acceptance or a new
human approval. Original phase dispositions and future-feature boundaries remain.

## Environment and evidence

The run used an actual production Next 16.2.12 build, the actual Express application,
a fresh migrated PostgreSQL 18.4 database and private disk media outside the checkout.
Six separate Chrome contexts covered anonymous visitors, two ADMIN accounts, ordinary
users, pending verification, suspended accounts and a newly registered account.
Status changes were guarded fixture operations, not acceptance of future user
administration. Email delivery was captured locally; delivered verification/reset
URLs still exercised actual token validation and persistence.

The forms created two Works, two chapters and two categories interactively. Bulk
pagination fixtures and the thirty-page chapter were created through actual content/
media services; their UI consumption is verified, not claimed as manual UI authoring.
All fixtures lived only in the disposable database/media root.

[Results and retained diagnostics](ui-acceptance-results.json) contain the final
commands, classified browser attempts, before/after regressions, transport controls,
source preservation and cleanup. Only completed passing chunks contribute to the
browser assertion index; partial failures and harness diagnostics are retained.
Assertion labels are a mechanical inventory, not a coverage percentage.

The initial runtime retained the default 100 requests/minute general limit. Several
browsers and Next prefetch shared one loopback address and produced real 429s;
explicit recovery after the window was verified. Bulk workflow testing then used
an isolated runtime-only `API_RATE_LIMIT_MAX=10000` override. Repository defaults,
account-specific authentication limits and upload limits were unchanged. This is
functional acceptance, not a production traffic-capacity benchmark.

## Verified browser workflows

| Area                              | Fresh checks and persistence boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication and authority      | Required/invalid fields; wrong credentials; registration and duplicate rejection; pending/suspended login; resend and actual captured verification URL; consumed/invalid links; safe return destination; guest guards; USER cannot open administration or perform actual management GET/POST; newly suspended session blocked and explicitly recovered after restoration.                                                                                                               |
| Account and sessions              | Saved display name survives reload and a second browser; readonly email; failed profile save retains input and retries; wrong/same/new password; old password rejected; password change revokes other refresh sessions; logout, failed logout and logout-all; other browser reload requires login; neutral unknown-account reset request, actual captured reset, confirmation mismatch and consumed-token rejection.                                                                    |
| P02 media                         | Actual cover/background/page/avatar uploads and saved candidates; corrupt/unsupported/animated-forbidden input; uncertain transport recovery; candidate ownership; all six classes including transparent frame/decoration candidates. Gift and avatar entity activation remain future scope.                                                                                                                                                                                            |
| Categories                        | Empty/create/duplicate/edit; immutable slug; rename/order/enable state after reload; search and late pagination; last enabled classification for a published Work cannot be disabled; another enabled association permits disable without losing relationships.                                                                                                                                                                                                                         |
| Works                             | Draft validation/create/reload; publication readiness rejection; complete persisted publish with real cover/background; duplicate slug corrected in the same form and identity; search/pagination; unpublish/archive/restore/republish verified against public visibility; conflicting ADMIN edits reject stale data, retain local input and require explicit reconciliation.                                                                                                           |
| Illustrated chapters              | Number validation; actual sequential image uploads; reorder/remove/replace; saved page order after reload; authoritative preview; cancel publication; publish/unpublish/archive/restore/republish; wrong-Work chapter scope rejected; duplicate chapter number preserves draft; list pagination and number search.                                                                                                                                                                      |
| Structured chapters               | H2/H3, paragraph, bold/italic, safe internal link, unordered/ordered lists; add/remove/reorder; unsafe link rejected while input remains; canonical saved JSON and semantic preview after reload; actual publication.                                                                                                                                                                                                                                                                   |
| Public catalog and SEO            | Empty and persisted home; all six type filters; combined category/status/type/order; literal percent/underscore and alternative-title search; URL/reload/back restoration; filtered empty/out-of-range/invalid query recovery; bounded Work/category/chapter pagination; exact chapter lookup beyond page one; unpublished/archived/missing Works and draft chapters excluded; saved text Work visible; canonical/OpenGraph/sitemap/robots; private media identifiers absent from HTML. |
| Failure, privacy and presentation | Real API shutdown/restart and explicit retry/focus; controlled browser image-transfer failure and real-byte recovery; signed-in public reads omit cookies, authorization and CSRF; Arabic feedback; keyboard search; RTL/no horizontal overflow at 320/768/1280 for catalog/detail/login; native captures after visible covers decode.                                                                                                                                                  |

The thirty-page saved administrator preview fetched pages 1–10 initially, started
its next window at page 5, loaded a direct jump to 25, bounded transfers/retained
resources, and revoked object URLs on close. Its before/after business snapshot
hash was identical. An emulated Save-Data/3G capability used five initial pages,
started the next window at page 3 and one controlled full-body transfer at a time.
These are current preview checks, not P07 or physical-network speed guarantees.

Native screenshot samples showed three rendered animation frames normally and
one static presentation with reduced motion. The accepted stored WebP still
matched its original checksum, retained three frames and an infinite loop. Canvas
`drawImage` sampling was rejected as evidence after this Chrome build returned
only an initial animation frame; scaled transparent draws also distorted samples.
The corrected native measurement is retained separately.

## Reproduced defects and corrections

1. **Login return race:** the guest guard redirected valid accounts to the default
   dashboard before the login form could honor a safe `/settings` destination.
   Both now use the existing safe-path policy. The auth layout supplies the required
   Suspense fallback; the existing loader/design remains.
2. **Account feedback:** profile/password/session failures and the protected-route
   boundary could expose English errors or a misleading generic rate-limit message.
   Existing Arabic localization now handles actual server messages in the current
   feedback surfaces. Failed saves/logout do not become fabricated success.
3. **Work slug conflict:** generic 409 could permanently lock the create form's
   conservative uncertain-outcome recovery. The actual unique-slug failure now emits
   `CONTENT_SLUG_CONFLICT` only when the caller ID is unoccupied; correcting the slug
   permits deliberate same-ID submission. Occupied-ID/generic conflict safeguards
   remain. [Coordinated contract correction](../../004-admin-categories-works/contracts/content-admin.md#ui-acceptance-correction--2026-11-01).
4. **Missing chapter search:** a child 404 caused parent eligibility reconciliation
   to unmount the list, erase its search and sometimes cancel its own pending error.
   Search/page state now survives that temporary unmount. Reconciliation runs after
   the child Query commits its 404, with current-client/slug/epoch fencing and explicit
   retry policy. Both illustrated/text layouts have a failing-before/passing-after
   real-hook/HTTP-boundary regression; the final browser run retains the missing
   chapter result while the parent is revalidated.

## Final verification and preservation

Fresh forced `pnpm verify` passed **1,032 tests**: 117 contracts, 164 API unit,
539 web, 10 database unit,166 API integration and 36 database integration. Every
Turbo stage reported zero cached tasks. Formatting, lint, types, migrations and
real isolated integration checks, production build, build-output verification and
`git diff --check` passed. The existing intentional native-image lint warning
remains; no rule was disabled. The final route smoke passed 40 routes plus 404.
Earlier lint/format/exact-enum failures are retained and are not counted as passes.

The production/test/documentation changes received executing-agent guard review
using clean-code-guard, test-guard, docs-guard and the React/Next guidance. New
behavior tests use real hooks with HTTP-boundary responses or actual PostgreSQL;
return-path variants exercise the pure state resolver. The browser supplies the
actual form retry regression. No independent reviewer or human approval is invented.

At the end of this UI acceptance run, all 180 existing CSS/image/font design assets were byte-identical to the starting
snapshot; no original file was deleted. DOM structure/classes, routes and visual
treatment were preserved. Existing dirty work was retained. HEAD, the empty index,
the exact P05 feature-pointer bytes and task markers are unchanged. No commit,
push, new specification or deployment occurred. Owned browser contexts, listeners,
database/container/volume, credentials, captured mail and temporary media were
removed; pre-existing containers were preserved. Only this report, one consolidated
JSON evidence record and two representative viewport images are added as evidence.

## Boundaries that still need their own acceptance

- Production/VPS environment, external email-provider delivery, live data, backup/
  restore/cutover and release-only obligations were not exercised by this local run.
- Native mobile hardware, Safari/Firefox, assistive-technology traversal and sustained
  production-load benchmarks were not tested. Chrome viewport/capability emulation
  does not substitute for them.
- The real protected reader still uses `MOCK_PAGES`; API content, progress/resume/
  opens belong to P07. P06 and other future prototype features were not implemented
  or accepted. Those boundaries do not reopen an active P00–P05 implementation task.
- This matrix establishes the stated scenarios, not every possible input or failure.
  No known defect remains open in the tested implemented legacy scope.

## Subsequent commit preparation — 2026-11-01

The owner subsequently authorized a local commit of all current changes without a
push. Two obsolete tracked Playwright CLI page snapshots and ignored raw console
logs were removed from the checkout. `.playwright-cli/` is now ignored to prevent
machine-local browser output from entering later commits. The earlier preservation
and HEAD/index statements above describe the completed UI test run before this
separately authorized cleanup and commit preparation.

Curated comparison images, processing fixtures and consolidated verification
records remain because they support the recorded acceptance. The final representative
catalog viewport captures are [320px](../../../output/playwright/ui-acceptance-20261101/discover-320.png)
and [1280px](../../../output/playwright/ui-acceptance-20261101/discover-1280.png).

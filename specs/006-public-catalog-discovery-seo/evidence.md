# P05 implementation evidence

The latest follow-up is the [current code review and cleanup](evidence/final-code-review.md)
(2026-11-01), including a fresh complete aggregate with 1,020 passing tests.
The final T083/T106 section below retains the connected P05 integration evidence.
Earlier freeze-gated/fixture observations are dated history, superseded by the
authorized P05 functional exception and connected implementation. The subsequent
media extension and current admission verdict are in the
[legacy closeout register](../../docs/product/legacy-closeout.md).
Historical terminal captures now resolve through the [transcript bundle](evidence/verification-transcripts.md)
and [exact-byte index](evidence/verification-transcripts.index.json); failed and
interrupted outputs remain retained.

## Closeout setup — 2026-10-31

**PHASE_ID:** P05 — Public Catalog, Discovery, Work Details, and SEO. **Feature:** `specs/006-public-catalog-discovery-seo`. **Setup TASK_SCOPE:** T001, T002, T003. These records do not accept P00–P04 formal exits or P05 release.

T001: Original and restored selection is this feature. Git branch is `main`; starting revision is `868948bb9f51fe9fdf6f40d18e8d8b7d920a1f9f`. Initial worktree was clean. The prior P00 batch added test-harness repairs and evidence; preserve that work. P03/P04 formal dispositions remain open. The owner's 2026-09-27 P05 exception in PLAN.md section 10 permits only isolated synthetic-data implementation after this baseline gate; the current 2026-10-31 closeout request supplies batch continuation, not deployment or presentation authority.

T002: Owned public routes are `/`, `/discover`, `/stories`, `/categories`, `/story/[id]`; the reader, personal engagement, community, ads and later phases remain excluded. Public pages still import the discovery, hero/latest/trending/suggestions, category and illustrated/text detail fixtures. `DiscordBanner.tsx` has static membership/online claims; `StorySidebar.tsx` has local bookmark state and numeric fixture engagement. These conflict with historical P05 presentation instructions under constitution VI. Their integration remains gated; no control or copy is changed here.

Current backend owners are `modules/content/{content.routes,content.queries,content.mapper,public-content.service,public-content.controller,content.types}.ts`, its DTO aliases, `router.ts`, existing private media and OpenAPI; schemas remain in `@fury/contracts`. Browser authority stays in the central `services/api/api-client.ts`; future server configuration belongs in `config/server-environment.ts`. All eight engineering guides, constitution, roadmap and command contract were consulted. Applicable immediate rules are B05/B12/B20/B33/B46/B50/B51 and F01/F04/F25/F26. Installed Next environment-variable guidance and `next/types/global.d.ts` confirm private versus NEXT_PUBLIC variables and compiler-level `server-only` support without adding a dependency. React/Next guidance preserves existing token ownership and excludes request-shared browser token state from server reads. The broader six-feature task-by-task audit remains unfinished in the closeout register; this setup does not certify it.

T003 fresh baseline: contracts 5 files / 60 tests, API unit 25 / 135, web 67 / 423, real API/Express/PostgreSQL integration 11 / 134, database PostgreSQL integration 5 / 36. The final P00 aggregate `pnpm verify` exited 0 after actual harness corrections; it includes fresh API and database integration, while unchanged package tasks reused Turbo cache. The API integration suite also passed shuffled seed 31031. Fury's own Next server on port 3105 passed 40 URLs and the 404 fallback. Its initial missing-public-URL configuration and the discarded default-port smoke are documented in the P00 evidence owner. Existing `pg` deprecation and jsdom notices remain visible. This is local baseline evidence, not a P05 connected-browser journey.

A new owned container `fury-legacy-p05-20261031` (label `fury.task=legacy-closeout-20261031`) exposes PostgreSQL 18.4 only on loopback port 32769, database `fury_closeout_p05`. All ten existing migrations deployed freshly; no migration was edited. The separately created canonical private temporary media directory is outside the checkout. A temporary seeding script used the actual database client, decoder, storage, media services, category/work/chapter services and publication service to create one synthetic category, two available JPEG assets, published `closeout-manga` and `closeout-text-story` Works, and one published Chapter under each. The current public metadata service returned Chapter 1 with its exact saved title for both. No existing environment file or dataset was used or edited. The target is disposable, not a production or real-editorial-data acceptance. Cleanup and retained-evidence state must be recorded on workflow exit.

## Requirements preflight and current policy

The built-in 16-item quality checklist and the 33-item written-readiness checklist retain the owner's accepted 2026-09-27 markers. They were reviewed as written-requirements evidence; no marker was changed. Current constitution VI/IX governs conflicting older presentation and story-order instructions. The targeted addenda in spec/plan preserve original task identities and requirements while identifying the owner gates and backend-first ordering. Missing UI decisions do not authorize changes or block independent admitted backend/transport foundation work. No extension hooks are configured.

## Original foundation selection (historical within this execution)

At that stage, the selected independent foundation batch was **T004, T005, T006, T007, T008**. It adds explicit credential-free GET authority to the existing central client and validates server-only origins/configuration. It changes no component, page, route, CSS, control, static copy, or rendered interaction. This foundation is not a completed backend group or UI-integration acceptance.

## Foundation T004–T008 — 2026-10-31

The existing client now accepts explicit `furyPublicRead: true` for GET only. Its final Axios Fetch adapter uses `credentials: omit`, removes inherited bearer/cookie/CSRF/proxy/basic authority and caller fetch overrides, rejects malformed/non-HTTP or credential-bearing URLs with fixed messages, and bypasses refresh/redirect on a public 401 without clearing the private access token. Protected requests retain their existing path and regressions. XHR's `withCredentials:false` would not establish same-origin cookie omission; the installed Axios Fetch adapter was inspected, and the actual outgoing Request is asserted at the fetch boundary. This is automated adapter evidence; no real-browser cookie claim is made yet.

`config/server-environment.ts` uses Next's compiler-level `server-only` marker and validates explicit `SERVER_API_URL`, `SITE_ORIGIN`, optional HTTPS `COMMUNITY_URL`, no URL credentials, safe base/origin syntax, and HTTPS canonical origin in production. Private HTTP API routing remains permitted. Errors name invalid keys without values. The example file documents the three keys. No request Host or browser token state supplies server origins; no component imports this configuration in this batch.

TDD/results: four initial public-mode scenarios failed against the old client while its 33 existing tests passed. The new config test first failed because its module did not yet exist; that is setup evidence, not a reproduced behavior defect. The first implemented config exposed an invalid-URL refinement throwing outside the sanitized boundary; the strict negative case reproduced it and passed after guarded URL parsing. Review also added two malformed/non-HTTP public URL cases, which failed before safe URL translation and then passed. The focused final pair passed **54 tests** (39 transport, 15 config). The full web suite before the final two added URL cases passed **442 tests**; a final full-suite result will be recorded separately. Web `check-types` and lint passed after correcting one unnecessary async test stub. Five separate shuffled transport processes passed **39/39** each, seeds **4204–4208**. No timeout, retry, skip or warning suppression was added.

Guard review: clean-code-guard fixed the two URL failure-boundary issues above, retained the established single client and memory-token owner, and found no remaining actionable issue in the changed production files/immediate callers. `test-guard` confirmed actual Axios final-adapter behavior, a network-only fetch double, real schema/config values, independent session assertions and parameterized negative URL cases. The server-only compiler marker is mocked only for the Node test loader; the validation code is real. The React/Next review found no component, render, navigation, cache owner, or request-shared server token state added. `docs-guard` verified the example keys and Next marker against source, tests, and installed Next guidance. B33 is unaffected: no service/controller production file changed. The frozen presentation directories (routes/components/features/styles/assets) have no diff. **T004–T008 are complete; the required P05 backend group, rendered integration, SEO, browser journey and formal phase exit remain incomplete.**

## Catalog contracts T009–T010 — 2026-10-31

The new strict catalog work/category contracts implement normalized search, bounded decimal pages, intersecting filter selections, server-enforced stories/type compatibility, fixed 12/24 item page sizes, safe slug-derived cover paths and narrow public projections. Input and parsed output types are separate exports. Optional top-level pagination is accepted only when it equals the nested pagination; repeated scalar arrays, extra fields, duplicate work/category slugs, private card fields and invalid optional values are rejected. The four existing public metadata schemas are unchanged.

Fresh `pnpm --filter @fury/contracts test` passed **5 files / 90 tests**, including 30 new catalog cases and the 60 existing cases. `check-types`, lint and build passed. The first test invocation before implementation could not import the missing exports; this establishes absent implementation, not a previously running regression. Clean-code-guard reviewed narrow contracts and existing metadata compatibility; test-guard reviewed query/projection negative boundaries and meaningful pagination comparisons. No bypass, private field widening or new dependency was introduced. Backend consumers and HTTP/OpenAPI authority remain unimplemented, covered by T011–T017; these contract checks do not establish those boundaries.

## Catalog persistence and integrity T011–T015 — 2026-10-31

Catalog/category reads now use bounded selections, shared public Work/Chapter readiness, explicit card projections, saved enabled-category order, literal case-insensitive substring matching, intersecting filters and stable unique ties. Chapter-latest derives only from eligible published Chapters and places chapterless Works last. Items, projections and totals run in one real repeatable-read transaction. Older metadata reads use the same readiness predicate and retain their wire projections; the single-work read now also keeps its multi-statement selection within that snapshot. No migration, publication or engagement write is introduced. DTO aliases and feature-owned transaction/read types retain class-only service boundaries.

The reusable media helper verifies saved byte length and SHA-256 against actual private storage and maps storage failures to a fixed 503. Private MediaService retains its existing exception boundary and authorization. The public service reauthorizes an eligible slug-scoped cover from the same database rules; it cannot expose an arbitrary private asset identifier. Missing/corrupt bytes leave saved AVAILABLE state and Work visibility untouched. A committed UNAVAILABLE cover hides subsequent metadata/cover reads; reconciliation verifies restored bytes before eligibility returns.

Fresh focused real PostgreSQL/storage tests passed **27 tests across 2 files**. The full actual API/Express/PostgreSQL integration suite then passed **11 files / 142 tests**, and API units passed **26 files / 140 tests** (5 new physical-storage integrity cases). Contracts passed **5 / 90** again after tightening inferred optional-query output types. API type checking and lint passed. The existing pg concurrent-query deprecation remains visible.

Failures retained: the first new PostgreSQL run exposed missing methods plus a fixture using the publication-command result as a Work; the fixture was corrected. A later import cleanup accidentally removed enums still needed by existing readiness code and failed the old/new tests; restoring those imports fixed it. Directly changing publication timestamps violated the installed history guard; stable-tie fixtures now use the real publication service with a fixed clock. The old connectivity test injected failure into the formerly used single ORM lookup; it now injects the same P1001 failure at the actual transaction boundary, preserving all 503 and secret-nondisclosure assertions. No assertion was weakened or retry added.

Clean-code-guard reviewed the SQL predicates, fixed finite sort mapping, parameterized user values, shared readiness, bounded selects, allowlist mapping, safe byte failures, and immediate old metadata/private-media callers. A test observer delegates all operations to the actual PostgreSQL transaction and pauses after its first query, proving publication and category commits cannot split items from totals; no transaction/eligibility result is mocked. Its narrow typed interface avoids unsafe casts and production test hooks. Test-guard reviewed those barriers, physical storage corruption/deletion, six types, filter intersections, literal wildcard cases, page totals/ties/overruns, private authority and verified recovery. The new and changed service files contain only imports and their exported class at top level (B33). The frozen frontend presentation paths still have no diff. T016–T017 HTTP/log/OpenAPI wiring remains next; no connected UI acceptance is claimed.

## Public HTTP, logging and OpenAPI T016–T017 — 2026-10-31

The actual Express stack now exposes anonymous catalog Works/categories and slug-scoped cover bytes before the protected ADMIN router. DI reuses the private storage owner. Public GET responses receive no-store immediately after request ID, before the existing logger/helmet/CORS/body-parser/limiter order. Existing public metadata keeps its DTOs; private media remains authenticated. Cover responses use validated saved MIME, length, inline/nosniff and exact bytes without creating an ETag/conditional partial response.

Public content logs project raw URLs, search, params and unknown paths to safe route identities while keeping method/request identity; ADMIN/noncontent logging retains its previous scope. Malformed path decoding maps to fixed BAD_REQUEST without raw URL or fabricated field errors. Opt-in raw query validation precedes parsed public query validation. Parsed field paths remain intact, and opt-in unknown-field errors omit supplied key names. Unknown public routes have safe messages and paths. OpenAPI registers shared catalog schemas, query inputs, anonymous authority, media-specific failures, binary headers, and public no-store success/failure headers.

Fresh API unit checks passed **26 files / 146 tests**; type checking and lint passed. Full actual API/Express/PostgreSQL integration passed **11 files / 144 tests** in normal order and separately with shuffle seed **31032**. HTTP assertions prove ordinary/ADMIN/invalid ambient bearer/cookie parity, list pagination equality, unknown/disabled category filtered-empty, hidden/unknown 404 parity, actual corrupt and missing byte 503/recovery, request identity, safe final emitted pino logs/errors, no-store through CORS denial and pre-router limiter 429 for old/new JSON and images, preserved private-media 401, and unchanged Work/publication/reference-event history after repeated/retried GETs.

Failed evidence is retained: the initial new routes/logging tests failed before implementation. OpenAPI header values first used the wrong library input representation; types rejected them and they were corrected to documented raw header schemas. The media error test first used the narrower old JSON-only content-code parser; it now validates the common envelope and actual shared media-code schema plus exact MEDIA_UNAVAILABLE. A new sentinel query-key regression reproduced raw key disclosure, then passed after scoped fixed messages. An earlier integration run also had a content ADMIN 401 unrelated to the new sentinel assertion, and another had ECONNRESET in the still-ephemeral private media harness. Media HTTP fixtures now explicitly own and close real listeners, matching the content fixture. Later normal/shuffled passes establish those actual executions only, not proof that every intermittent environment/harness issue is eliminated. No retries, timeout increases, assertion weakening or warning suppression was added.

Clean-code-guard reviewed early middleware ordering, scope exclusions, fixed errors, parameterized reads, binary authority and immediate protected callers; test-guard reviewed real Express/PG/storage/log boundaries and the targeted test-harness lifecycle changes. Docs-guard compared OpenAPI fields/statuses/headers with controllers, middleware and runtime schemas; the old operation inventory remains exact for its legacy subset, with new routes independently asserted. B33 service/controller top-level boundaries pass source inspection. No frozen page/component/feature/style/asset path changed. This completes T016–T017 locally; home/detail/sitemap backend groups, web consumers, rendered journeys and phase acceptance remain open.

## T026 accepted home rule and next backend scope — 2026-10-31

PHASE_ID=P05; TASK_SCOPE=T026–T032. Spec FR-012, the targeted backend-first plan addendum and contracts/public-catalog.md agree: select the first three enabled populated categories in saved displayPosition/unique-ID order. Empty or disabled categories do not consume tabs. Works within each tab are distinct and newest-publication/unique-ID ordered, capped at six; cross-tab membership is allowed. No owner decision is outstanding for this rule. Before implementation, the deterministic test expectation is: Empty, Action, Drama, Disabled, Fantasy, Fourth saved category order; eligible tabs Action, Drama, Fantasy. A shared Action/Drama Work appears once in each of those two tabs. Fourth is excluded by the three-tab bound, and a draft-only category is unpopulated. Featured order follows saved featuredOrder, not creation/publication order; latest releases use eligible Chapter publication time then Chapter ID, without opening a Chapter or writing history. Section bounds remain 5 featured, 12 shortcuts, 12 releases, 3 tabs and 6 Works per tab.

## Home backend T027–T032 — 2026-10-31

Strict shared home and Chapter-summary contracts now reject private bodies, invented trending/rating fields, duplicate identities, invalid category membership and over-bound sections. The backend reads saved featured order, enabled shortcuts, eligible latest Chapters and the accepted populated suggestion tabs from one repeatable-read snapshot. Shared Work/Chapter readiness and explicit public mappers prevent a parallel publication or media lifecycle. The anonymous home route rejects query fields, keeps no-store on success/failure and omits top-level pagination. OpenAPI describes that authority and output. No home component is connected or changed.

Fresh contracts passed **5 files / 102 tests**. API units passed **26 / 147**, and the complete actual Express/PostgreSQL integration suite passed **11 / 149**. API and contracts lint/type checks passed after removing an unnecessary null check against the actual required Chapter title type. New database cases prove saved-order featured/suggestion selection, cross-tab shared membership, per-tab dedup/bounds, twelve newest eligible releases from thirteen saved Chapters, genuinely empty sections, permitted category disable versus last-category refusal, withdrawal and one-snapshot home assembly during a concurrent Work withdrawal. The existing physical-storage test also asserts home visibility survives byte failure while saved status remains AVAILABLE and disappears after committed UNAVAILABLE. Shared contracts are parsed on actual HTTP outputs; safe failure and no-query handling are verified.

Clean-code-guard reviewed bounded queries, saved sort sources, reused readiness, parameterized SQL and class-only service/controller ownership. Test-guard reviewed unique valid fixtures for each section-size bound, actual publication timestamps rather than direct history edits, the reusable typed real-transaction observer, and exact HTTP/event outcomes. Docs-guard checked the home OpenAPI route against the shared schema/controller and the previously recorded T026 rule. This is backend development evidence; T033–T039 frontend and complete browser/query-plan acceptance remain open under the backend-first/freeze gates.

## T070 shared HTTP listener repair — 2026-10-31

Read-only convergence of the failed detail regression found 404/426 in the older authentication HTTP suite, with no Fury source producing 426. Installed Supertest constructs `127.0.0.1` request URLs even for a default/IPv6 server. T070 was appended as one shared boundary remediation, distinct from P00 T016's earlier matrix lifecycle scope. Separately bound IMPLEMENT changed only test listeners/cleanup: the three HTTP suites now await actual `127.0.0.1` listeners and close every owned listener before database/media teardown. Synchronous unsafe-storage construction still calls the real Express factory and retains its throw assertion. No application auth behavior or assertion was changed.

Fresh normal and three separately shuffled complete API integration processes passed **11 files / 153 tests** each, seeds **31031, 31032, 31033**. API types and lint passed. Test-guard reviewed exact listener creation, awaited startup, all owned cleanup and preserved real HTTP authority assertions. The address-family explanation remains an evidence-based hypothesis; the new listener matches the tested destination explicitly, and green executions do not prove an unseen environment cause.

The first repository aggregate stopped at formatting in the new closeout register and catalog contract document; those two documents were formatted. The next full **`pnpm verify` exited 0**, including schema format/validate/generate, formatting, lint, types, unit/integration suites, builds, build-output validation and diff whitespace. Build validation found six required entry artifacts and **384** emitted files without test artifacts. This is the current local repository gate at T070; subsequent implementation still requires a final shared regression. No warning was suppressed.

## Detail/backend T040–T045 — 2026-10-31

Returning from T070 to the selected T040–T045 batch, the final actual shared verification above passes. Detail/background now use the same Work/Chapter readiness, repeatable-read projection and byte-integrity helper as list/home/cover. Detail includes saved synopsis/author, nullable alternative title/artist/background, tags in saved order, enabled ordered categories, at most 25 initial Chapter summaries, first/latest from the full eligible set and at most six distinct other Works sharing an enabled category. Six is the routine technical bound for the already required bounded similar selection, recorded in the existing interface contract. No reader body/page/private asset identifier, engagement field or mutation is added.

New PostgreSQL cases prove 27 eligible Chapters yield a 25-item initial page, first number 2 and latest 28; withdrawal changes the next fresh latest to 27. They cover two-category similar dedup/self exclusion, saved optional editorial fields/tags, category disable, and concurrent Work/Chapter unpublication within an in-flight detail snapshot. An initial test wrongly assumed lowercased tags; source confirms the accepted saved normalized spelling preserves case, and the assertion now checks exact saved `Second`, `First` order. No production tag policy changed.

Actual Express cases prove illustrated detail, optional background 404, saved background bytes and safe missing-byte 503 while detail stays eligible, committed unavailable cover hiding detail/background, verified reconciliation restoring them, strict no-query handling, no pagination on detail and hidden/unknown safe parity. Existing text-detail PostgreSQL and older public Chapter metadata regressions pass. OpenAPI has shared detail schemas and the same anonymous binary success/failure headers for cover/background.

Fresh root verification ran **111 contract, 148 API unit, 444 web and 10 database unit tests**, plus **153 API/Express/PostgreSQL and 36 database integration tests**. All passed. Lint/types and actual API/web builds ran freshly; contracts/database builds were reused within that same aggregate after their preceding fresh builds. Clean-code-guard reviewed shared image delivery, explicit detail/select/mapping ownership, bounded queries, snapshot boundaries and no fallback editorial values; test-guard reviewed the real full-set boundaries, transitions, byte failure/recovery and T070 harness repair. Docs-guard compared the updated similar bound and generated OpenAPI with actual query/controller/schema code. B33 imports-plus-class boundaries hold. Existing presentation/reader paths are unchanged; this is backend evidence, not the pending T046–T050 browser/detail integration acceptance.

## Sitemap backend T051–T054 — 2026-10-31

The shared strict sitemap contract exports only distinct canonical slugs and rejects private fields/cursors; the no-query schema is shared by existing/new public no-query DTO aliases. The service assembles all eligible slugs with immutable-ID keyset batches of 100 inside one repeatable-read transaction. It returns only after traversal finishes; any error rejects the response rather than returning accumulated partial success. The anonymous route/controller and OpenAPI preserve no-store, request identity, safe failure and no top-level pagination. No Next sitemap or robots route is added under this backend scope/frozen frontend.

Fresh contracts passed **5 files / 117 tests**; API units passed **26 / 149**, API/contract lint and types passed, and full actual integration passed **11 / 156**. The database test creates 103 saved Works, withdraws one, and verifies the exact complete 102-slug projection without event-history writes. It then pauses the real export after its first batch, withdraws an eligible second-batch Work through the publication service, and proves the in-flight snapshot still returns the exact original set with physical query sizes **[100, 2]**, while the next export returns 101 and omits it. HTTP tests prove anonymous parity, strict no-query, empty/hidden current sets, request ID, no pagination, safe 500 without private error text, and no-store.

An initial unconditional traversal loop violated the actual lint rule; it was replaced by explicit continuation based on returned batch size. No lint suppression, response-size truncation, speculative migration/index or task bypass was introduced. Clean-code-guard reviewed complete assembly, immutable unique ordering, safe cursor parameterization, shared visibility and class-only orchestration; test-guard reviewed the real multi-batch transition and exact output/query-size/history assertions. Docs-guard verified shared projection/no-query and OpenAPI against actual handlers and queries. T051–T054 are locally complete. The whole required backend group now has focused passing coverage; a current shared backend exit verification is next before independent invisible web consumers are admitted.

## Whole-backend admission gate — 2026-10-31

After T009–T017, T026–T032, T040–T045, T051–T054 and T070 settled, `pnpm verify` exited **0** again. It verified **117 contract, 149 API unit, 444 web and 10 database unit tests**, plus **156 real API/Express/PostgreSQL and 36 database integration tests**; actual schema/format/lint/types/API+web build/output checks passed. Contracts/database build cache was reused after preceding fresh builds within the aggregate; no integration test success is inferred from unit/cache output. Six required outputs and 384 emitted files were validated. The existing pg/jsdom notices remain. This admits independent invisible web consumers under constitution IX. It does not admit frozen presentation changes, accept P00–P04 phase exits or close P05 browser/reviewer gates.

## Invisible list consumers T018–T019 — 2026-10-31

After the whole-backend admission gate, independent browser/server adapters, pure URL model, public query keys and list/directory hooks were added. Browser JSON uses the existing central Axios client's explicit public mode; its actual Fetch Request now also fixes cache:no-store alongside credentials:omit. Private transport behavior remains covered by all 39 existing client cases. Server reads construct a fresh validated Request with cache:no-store, credentials:omit and redirect:error for each call, forward an optional abort signal, parse actual envelopes/projections, and import no browser session module. Installed Next fetch guidance and patch-fetch source confirm Request.cache is used by the server fetch extension. Invalid/broken responses and failures reject safely instead of becoming successful empty arrays. Fixed errors retain only validated codes, status, safe request identity and allowlisted field paths.

URL normalization keeps syntactically valid unknown/disabled category selections, trims/NFC search, bounds pages, drops malformed/unsupported/repeated values, enforces stories type restrictions and resets pagination on filter changes. Public keys include only normalized selection or directory scope. Initial data seeds only matching keys; each QueryClient retains its own server-state cache, and URL changes abort prior requests. No page/component/control/static copy or render is connected.

Fresh focused checks passed **55 tests** across the four new consumer files plus the existing transport suite. The entire web suite passed **72 files / 460 tests**; web lint and types passed. New cases exercise the real central final adapter at the network Request boundary, server-only isolation/config refresh/no-store/abort, optional pagination/equality, safe errors/field paths, invalid input before networking, URL reload/defaults/unknown category and malformed/repeated values, matching versus mismatching seeds, two independent QueryClients, cancellation/late results and explicit 429/503 recovery. Existing jsdom navigation notice remains. These are automated consumer boundaries, not real-browser presentation or connected-route acceptance.

Guard findings fixed: a mixed valid/malformed repeated search key initially retained its valid value; its regression failed, then passed after duplicate detection moved before value decoding. The new actual Request cache assertion failed before fixed no-store mode was added. Test typing/import/async-act lint findings were corrected without suppression; act now awaits the real deferred network response. Clean-code-guard reviewed strict parsed boundaries, fixed errors, no alternate browser session stack, request-isolated server config and keyed cache ownership. Test-guard reviewed actual Axios/fetch/React Query behavior with network-only doubles, cancellation, explicit retry and no private mocks. React/Next review confirmed no manual server-state copy, no component or route mutation, and no browser token state in server imports. Docs-guard checked the installed fetch evidence and environment keys. T018–T019 are locally complete; dependent rendered catalog work and owner decisions remain unfinished.

## Invisible home/directory consumers T033–T034 — 2026-10-31

The shared browser/server boundary now reads the home aggregate; the directory adapter/keys/hooks from T019 were extended and exercised for the home/category scope. Nonlist responses reject top-level pagination and invented trending/count fields; strict list schemas retain the accepted optional/equal pagination. Home cache ownership is a public singleton key, directory identity includes normalized search/page, and current directory searches abort stale requests. Failed home reads stay unavailable until an actual successful retry supplies the empty section arrays. No rendered home/category component changed.

The focused public consumer suite passed **4 files / 20 tests**; fresh web lint and types passed. Four additional cases cover actual browser/server home/directory Requests and strict outputs, home 503/recovery and stale directory-search cancellation/late results. The earlier full-web 460-test result belongs to T018–T019; no 464-test full-suite run is claimed for this batch. An initial generic single-response helper lost required output type information under Zod/strict optional types. It was replaced by concrete endpoint schemas derived from one strict single-envelope policy; optional seed properties are omitted when absent. No cast, relaxed compiler rule or empty fallback was used.

Clean-code-guard reviewed the concrete schemas, request/cache reuse, no token/server-state copies and immediate T019 callers. Test-guard reviewed native Request capture, real React Query cancellation/retry, exact directory selection and malformed-output rejection. React/Next review preserves request-time/no-store server reads and singleton versus query-specific cache scope. This completes T033–T034 locally; the frozen rendered home/directory journeys and T035–T039 remain unperformed/gated as recorded.

## Invisible detail/denial consumers T046–T047, T058, T060 — 2026-10-31

Browser/server adapters now parse detail, older public Chapter metadata pages/single summaries and approved Work-scoped image Blobs. Older metadata UUIDs are explicitly projected out of the new consumer summaries. Parsed Work slug, Chapter number and requested page must match the response identity before use. Binary error Blobs are decoded into the same validated safe envelope; broken/nonimage payloads never become success or false absence. Server Requests remain per-call, no-store and credential-free, with no browser session import.

The React Query hooks retain DTOs solely in each QueryClient. Separate WeakMap control metadata tracks issued/accepted reads, confirmed Work denials, derived-detail epochs and weak provenance stamps; it stores no second DTO payload/cache. Only a validated NOT_FOUND Work response establishes a Work denial. Old in-flight successes, cache writes, reset and remount cannot resurrect it; only a later matching Work GET can recover it. Related detail, home/list cards and image cache entries containing the denied Work are cleared safely, including entries seeded before their hook mounts. Active Query observers stay attached when payload is cleared. Rejected related data becomes unavailable rather than indefinitely pending.

A Chapter NOT_FOUND advances the Chapter-derived detail epoch, clears stale references and refreshes the parent through a new authoritative Work read. It does not itself hide the Work. Parent-refresh failure remains in the parent Query as a real error, while the Chapter retains its actual 404; later Work recovery remains possible. Image 503 affects only image availability while eligible parent detail remains visible. Unvalidated HTML 404 is unavailable, not confirmed Work absence. Matching public keys, cancellation, seeded data, retry and background error state retain the existing React Query owner. No rendered component/page/control/static copy changed.

Fresh focused consumer checks passed **4 files / 30 tests**; all web checks passed **72 files / 474 tests**. Web lint and type checking passed. The critical hook file passed **14/14** in five separate shuffled processes, seeds **4204–4208**. This supplies the automated process-isolation part of T062; its real keyboard/route journey remains incomplete. Existing jsdom navigation notice remains. These tests use actual Axios/Fetch/React Query with network doubles plus a real deferred-promise control-state race; no rendered-route or physical-browser acceptance is inferred.

Guard findings fixed: initial image errors remained unparsed Blob HTTP_ERROR; the regression now proves validated NOT_FOUND. Valid DTOs with the wrong Work slug/Chapter number/page initially passed adapters; source/identity regressions failed, then passed after request-response correlation checks. An unregistered related-detail cache escaped denial cleanup, and a later rejected related cache write became permanently pending; both were reproduced and corrected. Async state is reread after awaited network work, and the QueryCache notification boundary now accepts only the narrow typed state/setter surface it uses, avoiding library any propagation. Async observer assertions await actual state notification; no arbitrary sleeps, timeout increases, retries, suppressions or weakened outcomes were added.

Clean-code-guard reviewed identity, strict response/error ownership, scoped keys, observer-preserving cache fences, stale epochs, parent recovery and immediate callers. Test-guard reviewed late completion, write/reset/remount, independent clients, real pending retry, Chapter-parent error/recovery, related/image fences and unvalidated failure distinctions. React/Next review confirmed one QueryClient cache owner, signal forwarding, request-isolated no-store server reads and unchanged presentation. B33 is unaffected by these web-only owners. T046–T047/T058/T060 are locally complete; T048–T050/T059/T061/T062 and whole-phase rendered acceptance remain open.

## Final consumer aggregate and configuration-fixture correction — 2026-10-31

The first aggregate using the separate browser API origin stopped on the existing transport test's literal default-host assumption: it expected localhost:4000 despite the deliberately configured loopback:4315. Read-only convergence reused adequate T004/T008 scope instead of appending a duplicate task. T004 was temporarily reopened during its test-only repair. The unit test now supplies an explicit configuration-boundary fixture with trailing slashes; its exact normalized URL and protected-credential assertions are unchanged and stronger than a default-host assumption. Actual environment validation remains in the configuration tests/build. No application configuration behavior changed. The 39 transport tests passed under the nondefault external environment, and the corrected full **`pnpm verify` exited 0**. T004 is complete again.

This aggregate's actual current web suite passed **72 files / 474 tests**; API and database integrations passed with their real isolated PostgreSQL setups, and schema/format/lint/types/build/output/diff gates passed. Turbo reused unaffected package tasks and prior unchanged build dependencies; those cached logs are not new executions. Six required outputs and 384 emitted files passed output validation. The prior failed aggregate remains failed evidence.

## T066 deeper standards review — 2026-10-31

Review found a real B01/B02 finding missed in the earlier passes: several new public service methods returned transaction/delegation calls directly, and new controller methods did not prepare all response values or nested image awaits as named steps. The separate T066 corrective implementation now names transaction/use-case/image results, prepares message/path/request ID values, and sequences the two older public list reads explicitly within the same repeatable-read callback. MediaService's changed integrity helper names its awaited bytes. All callbacks remain inside the same atomicity boundaries; response fields, authority and frontend are unchanged.

Fresh API lint/types and **11 / 156** real integration tests passed, then the complete `pnpm verify` exited **0** on the corrected tree. Earlier functional gates remain actual executions but did not by themselves establish this later standards correction. A read-only AST/source review also identified inherited B02 delegation cases in P00/P01/P02 service owners and B33's functional `jwt.service.ts` filename conflict. Those require separately selected owning-feature remediation, not an invented P05 feature or reviewer waiver. T066 remains open until the final cross-feature review/documentation records are settled. No phase acceptance is fabricated.

## Final local implementation review and shared verification — 2026-10-31

PHASE_ID=P05 / TASK_SCOPE=T064,T065,T066,T067. README and PROJECT_REFERENCE now describe the seven new anonymous GET operations, strict contracts, validated environment keys, Work-scoped image integrity, safe failure/no-store behavior, current fixture boundary and API-before-web / web-first rollback ordering. No rollout was performed. Docs-guard checked route/config/symbol claims against actual source and relative targets on disk; the existing twenty metadata/ADMIN operations retain compatibility.

The deeper T066 review resolved B01/B02 named-response/result findings and B11 enum-owner findings in the affected query/mapper/service code. Runtime media class/scope/status/reference-slot values now use existing database enums; SQL semantics and wire contracts remain unchanged. B33 AST/source checks found imports plus exported class only in service/controller owners; private helpers remain below public handlers. Existing module ownership, explicit public projections, repeatable-read composites, bounded reads, real persistence tests, safe log/error envelopes and private media authority were reviewed under clean-code-guard. Frontend API/model/hooks retain one React Query DTO cache owner, request signals, safe errors and denial ordering under the React guidance. Test-guard reviewed the changed actual Express/PostgreSQL/filesystem/QueryClient boundaries and preserved exact authority, rollback, concurrency and state assertions. No retry/skip/timeout or warning suppression was introduced. The P01 candidate return statements were individually dismissed as permitted one-argument mappers or throwing `never` helpers; they did not require an invented P01 repair.

The last production-source aggregate, **`pnpm verify` exited 0** (`/tmp/fury-closeout-verify-final-enums.log`). Actual current counts: contracts **5 files / 117**, API unit **26 / 149**, web **72 / 474**, database unit **2 / 10**, API integration **11 / 156**, database integration **5 / 36**. The final aggregate freshly executed API unit/lint/types/build and both disposable PostgreSQL integration suites; unchanged contract/web tasks and builds reused Turbo outputs. The preceding pattern aggregate (`/tmp/fury-closeout-verify-final-pattern.log`, exit 0) freshly ran all 474 web tests and the production web build. The earlier shared aggregate (`/tmp/fury-closeout-verify-final-shared.log`) also exited 0. Cached logs are not fresh executions. The last build-output check found all six required entry artifacts and 384 emitted files with no test artifacts. The 40-route plus 404 smoke passed against the owned Next server at loopback:4316 (`/tmp/fury-closeout-routes-final-reviewed.log`); route HTML is not business/browser acceptance. Existing pg concurrent-query, jsdom/navigation and Next preload/image notices remain visible; earlier failed aggregates remain failed evidence.

### Partial independent T039 / browser evidence and remaining gates

The actual latest-release query was observed from `listLatestCatalogReleases`, executed inside a real repeatable-read transaction on the owned PostgreSQL 18.4 fixture and explained with `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)`. [SQL, parameters and complete plan](evidence/latest-releases-explain.json) retain the evidence. Two eligible synthetic releases returned under `LIMIT 12`; root node Limit, actual rows 2, planning 2.905 ms, execution 0.780 ms. The plan uses existing index/bitmap/index-only scans and validates structured readiness before selection. Two rows are not a production-scale performance experiment; this result does not justify a new index. No index/migration was invented. T039 remains unchecked because its rendered home/category/community journey is blocked.

The real isolated Express/Next browser used HeadlessChrome/156 on macOS, a synthetic ADMIN account and no mocked auth/service response. An anonymous fixture-reader visit redirected to login; real login then opened the existing fixture reader, with `lang=ar`, `dir=rtl` and document width 320 at a 320px viewport. This proves the existing P00 guard regression, not persisted P07 reader delivery. The P03 saved Category list loaded after full navigation; a Category created from the existing dialog by keyboard Tab/Enter survived full reload. Dialog entry focused its first input and Escape returned focus to its create trigger. The only existing component-source change is P03 T105's native regex escape; its real emitted pattern compiled under `v`, matched `Valid-123` and literal hyphen, rejected `invalid!`, and the actual input reported `patternMismatch:true` for punctuation. The unchanged dialog/list had no document overflow at 320 or 1280px. Initial measurements mistakenly queried native `dialog[open]`; the actual existing component uses `[role=dialog]`, and the corrected measurement confirmed it. No false native-dialog claim is retained. Console refresh 400 on anonymous bootstrap and preload notices were observed; the old invalid-pattern error was reproduced, repaired and absent on the rebuilt dialog.

P05 full rendered/SEO/a11y journeys were **not performed**: home/discover/stories/categories/detail still import fixtures; no public page, route, control, static copy, style, imagery or navigation was redesigned or removed. Category cards require descriptions/icons absent from persisted categories; existing rating/hot/member/engagement claims and absent loading/error/retry surfaces prevent truthful complete wiring within the freeze. T020–T025, T035–T039, T048–T050, T055–T057, T059, T061–T063, T068–T069 remain unchecked. T062's five separate shuffled hook processes passed as previously recorded, but its rendered journey is still open. T069's final shared regression was run; its prerequisite whole-phase acceptance condition remains unsatisfied, so its checkbox is not fabricated. Independent phase disposition, physical devices/other engines, real-data release, proxy/CDN/cache and production recovery/rollout are unperformed. **LEGACY CLOSEOUT INCOMPLETE / NOT READY FOR NEXT SPEC** remains the outcome.

**Final read-only CONVERGE:** The selected P05 pointer/spec mapping was confirmed with no extension hooks. All 70 task identities were compared with current source and recorded checks: 47 complete, the 23 unfinished IDs listed above retained. Existing tasks adequately own the rendered/SEO/acceptance gaps; no duplicate remediation task or empty convergence section was appended. This is not a whole-feature conformance pass. No tests, formatter, generator, pointer edit or non-task write ran inside that convergence review.

**Final restarted API observation:** The owned API was restarted from the last enum-reviewed source. [Saved local state and HTTP observations](evidence/final-local-state.json) show both synthetic published Work kinds, one Chapter each, the browser-created Category's persisted identity/order, four publication events, three media-reference events and two assets. Anonymous list/home/both details/sitemap/cover returned 200; absent background and unknown Work returned 404; unknown query returned 400. Every response carried no-store and a request ID. Event/asset counts were identical before and after those GETs. These are isolated local facts, not production or rendered catalog acceptance.

## Handoff source verification and cleanup - 2026-10-31

PHASE_ID=P05 / TASK_SCOPE=T021,T066,T067. The remaining independent T021 extraction moved the exact existing NAV_LINKS declaration to features/home/model/navigation.ts, removing only that declaration/type import from the hero fixture owner and changing only the Navbar import. Source comparison proves the four labels/destinations/order and normalized component are byte-identical to HEAD; this introduces no new static copy or visible navigation. Three existing navigation regressions passed. T021 remains unchecked for its card/live-integration clauses. Clean-code/React review found one existing constant owner, no new dependency/cache/fetch or presentation change; test-guard required no mirror test. Installed Next 16.2.12 Fetch/environment/forms guidance and the relevant UI form guidance were checked against actual usage. Docs-guard corrected the exclusion map against actual PLAN.md: P08 community/moderation, P09 notifications, P10 gifts, P11 support/legal, P12 admin users/metrics, P13 ads.

The **last production-source pnpm verify exited 0**, with [complete retained output](evidence/verification-transcripts.md#final-verification). It freshly ran web lint/types, all **72 / 474** web tests and the production web build; unchanged API/contracts/database unit/build tasks reused Turbo outputs from the preceding verified source. Both **11 / 156 API** and **5 / 36 database** integration suites executed freshly on isolated PostgreSQL. All six required entry artifacts and 384 emitted files passed output inspection. Current total unit counts remain contracts 117, API 149, web 474, database 10. The [final route output](evidence/verification-transcripts.md#final-routes) records all 40 existing routes plus the 404 fallback after this last source change.

Real Chromium loaded the rebuilt home at 1280px: primary navigation hrefs were exactly /, /categories, /discover, /stories in the original order; document direction remained RTL and width equaled viewport. This does not turn the unchanged fixture home into a live catalog. Final read-only convergence reused the 23 existing incomplete P05 tasks; no new unowned technical finding or duplicate task was added. There is no whole-feature conformance/phase approval claim.

All 16 API service/controller source files passed the AST imports-plus-exported-class top-level audit. Changed-document relative targets passed; original feature selection bytes match the intake backup. The named owned browser was closed. Owned API/Next PIDs and ports 4315/4316 were verified absent; the labeled fury-legacy-p05-20261031 disposable PostgreSQL container and its guarded temporary media root were removed. Existing user services/data were left intact. No migration/schema, constitution, approval marker, commit, push, deployment, issue or external message was produced. Final documentation formatting/reference/diff checks are recorded in the register.

**LEGACY CLOSEOUT INCOMPLETE / NOT READY FOR NEXT SPEC.** P00/P01/P02/P03/P04 formal dispositions, P02 representative artwork, and the 23 frozen-presentation-dependent P05 tasks remain as named in the closeout register. Review and decision owners must resolve those facts before complete legacy/P06 admission can be claimed. Actual deployment-data/recovery/cache/rollout evidence remains separately release-only under the recorded synthetic exceptions.

## Remediation IMPLEMENT — T071–T074, 2026-11-01

Scope: P05 / `specs/006-public-catalog-discovery-seo`, tasks T071–T074, on branch `main` at unchanged HEAD `868948bb9f51fe9fdf6f40d18e8d8b7d920a1f9f`. Intake found 81 versionable changed/deleted/untracked paths. Their bytes and the original feature pointer were backed up outside the repository before editing. The pointer already selected P05 and has not changed. Both requirements-quality checklists were reviewed against the current spec/plan: 16/16 and 33/33 supported, preserving the owner's dated approvals. All eight engineering guides, roadmap, constitution, command contract, operating policy and relevant legacy requirements/evidence owners informed this review. The synthetic-development exception admits independent repairs; predecessor dispositions, artwork, rendered acceptance and release gates remain open. No extension hooks are installed. The non-executable prerequisite script was invoked with `bash`; it resolved the expected P05 directory without mutation.

- **T071 / FR-027 / B20/B31 / EXPRESS-ERROR-001:** The early cache and final error/not-found boundaries incorrectly conditioned public policy on GET, while Express dispatches HEAD through GET. The shared route identity now applies independent of method, including the namespace root, unknown routes and unsupported methods. No-store precedes logging/CORS/parsers/limiter; ADMIN exclusion remains. Final not-found messages and serialized Pino requests use safe identities. Actual migrated-PostgreSQL Express requests cover HEAD metadata/image 200, validation/malformed URL 400, missing 404, CORS 403, exhausted limiter 429, internal 500 and corrupt-image 503. HEAD checks assert status/headers and absence of body. POST/PUT/DELETE unknown paths and rejected OPTIONS retain privacy/no-store; final Pino destination lines exclude sentinels from both request fields and messages. OpenAPI now documents all eleven implicit public HEAD operations with GET authority/parameters/status/headers and no response content, plus reachable CORS 403. Authenticated ADMIN/private-media regressions remain passing.
- **T072 / Constitution IV / F01/F24/F27:** The QueryClient subscription, weak scoped ordering/provenance, listeners, cache effects and asynchronous read owners moved unchanged from `model/public-catalog.states.ts` to `hooks/public-catalog.access.ts`; the obsolete model owner was removed. Axios cancellation, HTTP error projection and Blob decoding moved to `api/public-catalog.transport.ts`; model retains pure validation and safe error types. Immediate imports and `PROJECT_REFERENCE.md` now name actual owners. Existing real-QueryClient/network-boundary tests preserve independent clients, later denial precedence, reset/cache-write/remount barriers, matching recovery, Chapter-parent refresh and observable parent failure, plus independent image recovery. No DTO store or HTTP/session stack was added.
- **T073 / B11:** `mapCatalogChapter` now uses the existing exhaustive `chapterContentTypeMap`, matching the older public mapper. Home/detail call sites and existing illustrated/text contract/real-database/HTTP cases were reviewed; no mirror test was added.
- **T074 / Constitution VII / docs-guard:** Ignored historical `final-verification.log` and `final-routes.log` were copied to versionable `.txt` artifacts with only machine-home/repository paths sanitized. [Provenance and original/output SHA-256](evidence/historical-output-provenance.json) records the transformation. Both documentation owners now link the `.txt` files. `git check-ignore` confirms the logs remain ignored and the text artifacts are not ignored; `git ls-files --others --exclude-standard` includes them. No ignore rule was changed. These remain historical 2026-10-31 executions, not this remediation's results.

Failed-run history is retained: direct `pnpm exec vitest` omitted `npm_execpath`, so Testcontainers migration setup could not locate its fallback pnpm module; using the manifest `test:integration` script fixed invocation without code changes. The meaningful red run then failed HEAD success and 429 on missing no-store. After the policy correction focused HTTP passed 3 cases. Broader units exposed two old partial Request doubles missing `originalUrl`; these tests were replaced with real Express requests and owned-listener cleanup while retaining internal-Zod classification and log-redaction assertions. OpenAPI's external response index type initially propagated `any` into destructuring/`Object.fromEntries`; explicit library response types and a typed response record resolved lint without casts/suppression. No warning, assertion, timeout or production authority was weakened.

Fresh batch evidence: API units **26 files / 154 tests**; complete API integration **11 / 157**; web **72 / 474**; consumer subset **4 / 30**. Critical hook suite **14 tests** passed in five independent processes with shuffled seeds **5201–5205**. API/web types and lint passed; changed-file Prettier and `git diff --check` passed. The pg concurrent-query deprecation and jsdom navigation notice remain visible. This batch did not rerun the historical route/browser journey or represent it as fresh. The final root aggregate is still required after additional findings settle.

Guard review: clean-code-guard verified complete changed functions/callers, policy reuse, enum mapping, API/hooks/model ownership and failure/recovery behavior. User/project instructions override arbitrary function-length/complexity limits and speculative abstractions. The two concrete ownership issues and GET-only policy are corrected; no generic framework, dependency or wrapper class was introduced. Test-guard verified final emitted logger output, real Express/PostgreSQL/files/QueryClients, network-only consumer doubles, preserved authority and deterministic race assertions. React/Next review verified one subscription per client, no request-global DTO/session state in server adapters, explicit no-store/credentials and unchanged presentation; installed Next 16.2.12 fetch guidance was read. Docs-guard verified the new owners, eleven HEAD operations and versionable historical artifacts against source/output. Security review covered actual input, log/cache, publication, SQL parameterization, session/CSRF and private-file boundaries; deployment proxy/TLS/CDN behavior remains unperformed. No human approval is granted.

A source-established remaining privacy/validation gap was found in the older Chapter routes: their validator omits strict encoding/unknown-key protection used by other public routes. This is recorded for the next read-only CONVERGE, then a separately bound IMPLEMENT under this request's continuation authority. T071–T074 are complete in their recorded scopes; whole-phase acceptance remains incomplete.

## Follow-up IMPLEMENT — T075, 2026-11-01

The preceding read-only CONVERGE appended only T075. Requirements/checklist/predecessor conditions are unchanged from the prior preflight. T075's actual Express regression reproduced a `400 VALIDATION_ERROR` whose unknown-key message contained `LEGACY-QUERY-PRIVATE-SENTINEL`. The correction reuses strict query encoding and safe unknown-key projection on both legacy Chapter operations, and the existing shared no-query schema on single Work/Chapter reads. OpenAPI now declares those strict empty queries. The four metadata response DTOs, list pagination, public eligibility, authentication, CSRF, private media and presentation are preserved. README now scopes authenticated media claims to `/api/v1/media` and describes the separate public work-image and GET/HEAD boundary.

Focused real GET/HEAD checks passed for all three legacy paths and both unknown/malformed query cases, proving fixed field errors, safe envelope paths, no-store, no HEAD body, final emitted Pino sentinel absence and unchanged publication-event count. Existing successful metadata/illustrated/text/private-authority cases were retained. Clean-code/test/docs/security guards verified the actual route/schema/error/caller changes without duplicate schemas or suppressed failures.

The first full remediation `pnpm verify` exited **0** after T075. Fresh API units **154**, web **474**, API integration **158**, database integration **36**, schema format/validate/generate, changed-package lint/types and API/web builds passed. Unchanged contracts **117** and database units **10**, and their lint/types/build outputs, were cached in that aggregate; they are not fresh executions. Six required entry artifacts and 384 emitted files passed build-output checks. The pg/jsdom notices remain. This is a technical regression gate, not rendered/phase/release acceptance.

The complete media-service review additionally found three remaining direct `return await this.database.$transaction` statements in `bindReference`, `replaceReference` and `retireReference`, despite the earlier P02 T079 completion claim. This is an explicit B02 violation, not a newly invented function-length preference. Reuse the existing adequate P02 T079 scope in a separately selected IMPLEMENT stage; do not duplicate it as a P05 task or grant artwork/phase approval. The related raw slot/class comparisons in those same methods will use existing canonical enums, preserving values and branches. The P05 pointer remains unchanged during this stage.

## T076 implementation and shared-gate finding — 2026-11-01

T076's actual final Pino destination checks failed for both GET and HEAD: raw Referer and `x-original-url` retained synthetic search values despite a sanitized request URL. The public serializer now omits the raw request-header payload while retaining request identity, method, safe route identity and other established request diagnostics; ADMIN/private serialization and central credential redaction are unchanged. Existing sanitizer cases now cover header omission and preserved ADMIN scope. The same 19 sanitizer tests and three actual Express privacy cases passed. Documentation names this header boundary. No frontend or logging stack was added/disabled.

The next required root aggregate **failed**, so T076 is not yet marked complete. API units/lint/types passed, and 144/158 API integration cases passed, but all 14 auth HTTP cases failed in their shared beforeEach before endpoint dispatch: `database.user.deleteMany()` hit the real `media_assets_uploaded_by_user_id_fkey` RESTRICT constraint. The preceding content HTTP suite clears fixtures before each scenario but its afterAll only disconnects/removes files, leaving final media/user rows behind. A later auth suite's global user cleanup then depends on suite order. This is a source-established test-fixture isolation defect, not a privacy/auth behavior regression. Turbo cancelled the concurrent database integration process with exit 130; that interrupted run is not a database test failure or pass. The failed aggregate output is retained for follow-up convergence. No retry/skip/timeout/assertion weakening is used to turn it green.

## Final remediation verification and handoff — 2026-11-01

**TECHNICAL REMEDIATION: PASS**, limited to independently actionable current P00–P05 repairs in this request. **NEXT SPEC: NOT READY.** This does not accept rendered P05 functionality, independent predecessor exits, representative artwork or deployment. P05 T071–T077 and P02 T079/T080 are complete. The original 23 P05 tasks remain unchecked: T020–T025, T035–T039, T048–T050, T055–T057, T059, T061–T063, T068–T069. Their smallest presentation/acceptance decisions remain in the closeout register; no missing surface or future feature was implemented.

T077 reuses one local `resetContentFixture` in the content HTTP suite's beforeEach and afterAll, clearing only its shared disposable Testcontainers content/media/session fixture rows before disconnect/removal. All table names and real FK/history/HTTP assertions are retained. No constraint, expected status, timeout or retry changed. Content/auth passed **51 cases** in each process with file-shuffle seeds **6201, 6202, 6204**; verbose output proves content→auth for 6202 and auth→content for 6204. This corrects the actual order dependence, rather than relying on a green retry. T076's full shared gate now passes as well.

### Final executed checks and evidence boundaries

- [Final root `pnpm verify`, exit 0](evidence/verification-transcripts.md#remediation-final-verify): fresh API units **26 files / 154 tests**, complete API/PostgreSQL/Express integration **11 / 158**, database integration **5 / 36**, API lint/types/build, schema format/validate/generate, format and diff checks. Build-output inspection found **6 required entries / 386 emitted files**, with no tests emitted.
- Web **72 / 474**, contracts **5 / 117**, database unit **2 / 10** and unchanged web/shared lint/type/build tasks are explicitly cached in that final aggregate. Current unchanged web source passed freshly in [the first aggregate](evidence/verification-transcripts.md#remediation-first-verify) and its standalone suite; contracts [117](evidence/verification-transcripts.md#remediation-contracts-fresh) and DB unit [10](evidence/verification-transcripts.md#remediation-database-unit-fresh) were also run freshly and independently during this request. No cached output is relabeled fresh.
- [Five independent shuffled hook processes](evidence/verification-transcripts.md#remediation-hook-stress), seeds 5201–5205: **14 tests per process**. The access owner moved byte-identically except two model import paths; real QueryClients/network-boundary regressions preserve all denial/recovery behavior.
- [File-order 6201](evidence/verification-transcripts.md#remediation-fixture-order-6201), [6202](evidence/verification-transcripts.md#remediation-fixture-order-6202), [6204](evidence/verification-transcripts.md#remediation-fixture-order-6204): **51/51 each**. The [failed shared FK aggregate](evidence/verification-transcripts.md#remediation-shared-fixture-failure) and cancelled concurrent DB run remain documented separately.
- [Fresh route smoke](evidence/verification-transcripts.md#remediation-routes): all **40 existing routes plus 404 fallback** passed against the current production Next build on owned loopback port 4316.
- [Fresh browser observations](evidence/remediation-browser.json): existing home has Arabic/RTL, document widths exactly 320 and 1280px, identical four primary destinations, and a solid-outline first Tab focus on the home link. No presentation owner changed from the beginning-of-request bytes. The manual API was deliberately not started; the reader showed its existing connection-error/retry surface, so this run claims no new login redirect, authenticated browser journey or live catalog acceptance. Auth/private-reader regressions passed automatically; the older complete browser journeys remain explicitly historical.
- [Per-path review/change inventory](evidence/remediation-review-inventory.json) accounts for all 81 starting staged/unstaged/deleted/untracked paths and newly retained artifacts; task and pointer checks compare actual bytes. Historical output links now target versionable `.txt` files. All new retained evidence is English, synthetic and sanitized; versionability is checked against tracked/untracked nonignored Git paths, not existence alone.

### Finding disposition and guard review

| Task / classification                                        | Source and root cause                                                                                         | Correction and evidence                                                                                                                                   | Remaining boundary                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| P05 T071, reproduced behavior/security defect                | `app.ts`, final error/not-found owners: GET-only checks missed Express HEAD and unsupported-method privacy    | Shared method-independent route policy; safe final messages; actual GET/HEAD status/header/Pino tests and HEAD OpenAPI operations                         | Proxy/CDN headers require release-specific evidence       |
| P05 T072, explicit ownership violation                       | Live QueryClient effects/orchestration in model; raw transport translation in model                           | `hooks/public-catalog.access.ts` and `api/public-catalog.transport.ts`; unchanged pure model types/rules; 30 consumer cases and five hook processes       | Existing page consumers remain owner-gated                |
| P05 T073, explicit B11 violation                             | `content.mapper.ts` duplicated the raw TEXT conversion                                                        | Reuse exhaustive `chapterContentTypeMap`; existing illustrated/text projections and actual HTTP/DB coverage                                               | No public projection changed                              |
| P05 T074, missing portable verification                      | Ignored `.log` targets existed locally but were absent from versionable Git Changes                           | Sanitized `.txt` copies, [historical provenance](evidence/historical-output-provenance.json), versionable relative-link verification                      | Historical output remains historical                      |
| P05 T075, reproduced privacy/input defect                    | Chapter routes omitted strict encoding/unknown-key mode; single metadata reads omitted strict no-query schema | Actual red reflected sentinel; shared validation/no-query wiring and OpenAPI correction; safe GET/HEAD/Pino regression                                    | Existing four output DTOs preserved                       |
| P02 T079, explicit B02/B11 violation                         | Earlier audit missed three outer transaction returns and related raw enum comparisons                         | Named awaited bind/replace/retire outcomes, canonical constants; 26 real media regressions and full shared gate; B33 AST review                           | Artwork/phase/release acceptance stays open               |
| P05 T076, reproduced security defect (EXPRESS-ERROR-001/B20) | Public request serializer retained Referer/proxy URL headers containing search text                           | Omit public raw headers; preserve safe identity/route diagnostics and ADMIN/private redaction; actual emitted GET/HEAD Pino output and 19 sanitizer cases | Operational edge/access logs are outside this local proof |
| P05 T077, reproduced verification defect                     | Final content HTTP fixture rows survived into auth global user cleanup                                        | One local reset owner before/after scenarios; real FK-preserving two-order regressions and root gate                                                      | Disposable synthetic tests only                           |

The full current production diff and immediate callers were reviewed under clean-code-guard and B/F ownership: no generic framework, new HTTP/session stack, duplicate DTO store, speculative index, arbitrary length limit or unsafe cast was introduced. AST review of all 16 API service/controller files found no B33 top-level violation, and MediaService has no non-mapper returned calls. Existing short mapper and never-returning conflict helpers were not manufactured into findings. Test-guard reviewed actual Express/Pino/PG/files/QueryClient boundaries, safe failure injection, deterministic ordering and cleanup; no assertions/skips/retries/timeouts were weakened. React/Next review verified unchanged presentation, per-client lifecycle and request-isolated server transport using installed Next guidance. Docs-guard compared owners, schemas, methods/statuses, actual scripts/results, portable links, counts and stale-versus-current evidence. Security review traced public/ADMIN/private boundaries, CSRF/session/role authority, parameterized SQL, scoped data/media eligibility, safe errors/logs and client credential/cache isolation. Only the demonstrated findings above required corrections; optional speculative abstractions or future scalability features were excluded.

Failed attempts remain available: [HEAD missing cache policy](evidence/verification-transcripts.md#remediation-head-red), [incomplete unit Request fixture](evidence/verification-transcripts.md#remediation-api-unit-fixture-failure), [unknown query reflection](evidence/verification-transcripts.md#remediation-t075-red), [header leak](evidence/verification-transcripts.md#remediation-t076-red), [introduced missing enum import](evidence/verification-transcripts.md#remediation-media-import-failure), and the FK aggregate above. Their later green executions do not erase them. The pg concurrent-query deprecation, jsdom navigation/image-prop notices and browser CSS preloads remain visible; no warning was suppressed. Real deployment, proxy/CDN, representative owner artwork, complete P05 rendered/SEO/device acceptance and independent phase dispositions were not performed or granted.

Original selection is restored byte-for-byte to P05. All checklist approval markers, roadmap, constitution, schema/migrations and presentation bytes remain unchanged. The named browser and owned Next server were closed, port 4316 and browser PID were verified absent; test frameworks removed their owned disposable resources. No commit, push, PR, deployment, production migration, external message or change to another project occurred. The final read-only convergence follows this evidence reconciliation and may only reuse existing gates or append a proven new task.

## T080 follow-up and final evidence reconciliation — 2026-11-01

The final full-file B12 review found repeated inline domain error definitions beyond T079's named-return scope. A separately selected P02 CONVERGE appended only T080, then its authorized IMPLEMENT centralized concrete domain errors in the existing feature error owner and the shared unavailable-read class in infrastructure, preserving the old feature export. The public-content caller and integrity helper now reuse the same technical definition. [AST comparison of 60 throw sites](evidence/remediation-error-wire-audit.json) and actual HTTP/PG/unit regressions preserve all current wire messages/statuses/codes, catch/rollback/replay and authority. The first types run required restoring the base AppError import for existing catch classification; [that failure](evidence/verification-transcripts.md#remediation-error-types-failure) is retained, and no tests ran before the import was corrected. Types/lint, [154 units](evidence/verification-transcripts.md#remediation-error-units) and [158 real integrations](evidence/verification-transcripts.md#remediation-error-integration) passed. P02's existing evidence records the scope, guard pass and open artwork/phase gates; no constructor-only tests or generic error framework were added.

The final corrected-source root gate again exited **0** with **154 API units / 158 API integrations / 36 DB integrations**, current API lint/types/build and **6 required entries / 386 emitted files**. [The final output](evidence/verification-transcripts.md#remediation-final-verify) supersedes the prior 384-file successful gate as current source evidence; [that intermediate gate remains retained](evidence/verification-transcripts.md#remediation-before-error-ownership-verify). Web source/build/route/browser evidence is unchanged by this API-only correction and remains dated to its actual execution, with cache distinctions above. P02's follow-up read-only convergence added no further task; its existing formal/artwork/release gates remain open. The original P05 pointer was restored exactly between stages before this final documentation-only reconciliation under existing T072/T074 evidence obligations.

Docs-guard found and corrected the register's link to the moved access owner. The three links in unchanged P02 research to installed, pinned Next.js documentation are intentionally dependency-provided references, not repository-owned evidence artifacts; their files exist in the installed 16.2.12 package. Versionability checks apply strictly to retained repository evidence. No `node_modules` file is presented as checked-in proof. Final task identities total **446**: **411 VERIFIED COMPLETE (technical), 33 OWNER DECISION REQUIRED, 2 SUPERSEDED**; checkbox totals are **414 checked / 32 unchecked**, preserving original owner/superseded marker history. P05 still has the same 23 unfinished original tasks; P02 T079/T080 and P05 T071–T077 are technically complete. All actual failures, including the suite-order FK failure, remain visible. **NEXT SPEC: NOT READY.**

## P05 functional integration execution — 2026-11-01 (in progress)

The new owner request explicitly authorizes the 23 remaining original P05 tasks,
bounded functional exceptions, sequential continuation and independent reviewers.
Starting `main` HEAD remains `868948bb9f51fe9fdf6f40d18e8d8b7d920a1f9f`;
117 pre-existing changed/deleted/untracked paths were copied with hashes outside
the checkout before edits. A complete original web-source copy and 18 baseline
Chromium screenshots were captured before application changes, at 320/768/1280px.
Baseline routes: home, discovery, stories, categories, illustrated `trait-hoarder`
and text `city-of-amber`. The first text screenshot attempt used an unknown slug;
it was replaced by a fresh capture of the actual text fixture before implementation.
Screenshots are retained under `output/playwright/p05-before/` (local browser artifacts).

### Separate governance and artifact stages

The constitution stage amended only policy/guidance/templates/adapters to 2.1.0,
ratification 2026-09-22 preserved, amendment 2026-11-01. Its Sync Impact Report
records the exact P05 exception and synchronized owners. Prettier and relative
file-link checks passed; no unexplained constitution placeholders remained. Saved
application/package/feature-artifact bytes were compared and unchanged at that
checkpoint. No extension hooks existed. `docs-guard` checked policy claims against
the owner's actual request, existing paths, dates and version; no implementation
or human acceptance was claimed. A separate reconciliation then replaced only
the conflicting current-policy addenda at the ends of existing P05 spec/plan.
Accepted requirements, success criteria, task IDs and progress remained unchanged.

### Intake and backend gate

Pointer remains `specs/006-public-catalog-discovery-seo`; prerequisite script
confirmed the same feature. The accepted requirements/readiness checklists remain
checked under their existing 2026-09-27 written-quality acceptance; their markers
were not edited. Constitution VI/IX, engineering B/F owners, actual manifests and
installed Next fetch/metadata/loading/error/not-found/sitemap/robots/image guidance
were consulted. In particular Next 16.2.12 supplies `unstable_retry` to refetch
framework error boundaries; it is used instead of treating `reset` as a refetch.
The fresh backend prerequisite run passed all 158 real PostgreSQL/Express
integration cases (`evidence/integration-backend-baseline.txt`). Existing pg
concurrent-client-query deprecation warnings remain visible. Previous remediation
T071–T077 and P02 T079/T080 are preserved; final shared regressions remain pending.

### Selected implementation batches

1. Common recovery T059/T061, then discovery/cards T020–T025, dependent on the
   existing accepted complete backend, contracts and T018–T019/T058/T060 hooks.
   Initial focused tests passed 17 cases after correcting a test response whose
   out-of-range pagination contradicted the validated contract; type checks passed.
   No task is marked complete merely from these partial checks.
2. Home/categories T035–T039, reusing T033–T034 and live cards. Category selection
   pages the existing native control through bounded backend reads, rather than
   fetching all enabled categories or silently dropping later choices.
3. Details T048–T050, reusing T046–T047 denial fences. Tests now use saved DTOs;
   protected fixture-reader cases remain. A test initially omitted legacy `workId`
   from the existing chapter-list wire response and was corrected without weakening
   validation. Home/category/detail focused checks then passed 15 cases.
4. SEO T055–T057, dependent on live server detail/query boundaries. Four focused
   SEO output tests passed. Actual production HTML/browser/transition proof and
   full verification are still pending at this checkpoint.
5. T078 was recorded before editing the smoke script: fixture public detail IDs
   are no longer a valid successful catalog route. An explicit validated saved
   slug is now required, while protected reader probes and the unknown-route
   status assertion remain. T078 depends on T049/T056 and precedes T068/T069.

The owned runtime has 42 persisted Works (seven of each supported type), 30 enabled
categories plus one disabled, illustrated/text Works with 27 eligible Chapters,
zero-Chapter Works, ordered features, validated synthetic covers/background/pages.
All publication occurred through existing management services. It is a separate
new disposable database/container/media root, not an existing local dataset.
Real browser administrator login/mutations remain pending; seed success is not
reported as that journey. All original 23 completion markers remain pending until
every applicable clause has actual evidence.

## P05 connected implementation — 2026-11-01

The owner authorized this existing feature's 23 original remaining tasks and bounded remediation, with a separate constitution 2.1.0 P05 functional exception. Governance ran before application changes; only conflicting current-policy addenda were then reconciled. Written requirement approval markers were read, not changed. Branch remains `main`, starting HEAD `868948bb9f51fe9fdf6f40d18e8d8b7d920a1f9f`; the 117-path dirty starting tree was inventoried and copied before integration. Feature selection remains the original P05 pointer.

### Implementation and traceability

| Tasks / requirements                       | Current implementation and actual evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T020–T025; FR-003–008/017/030–033; US1     | Slug-based public cards, all six discovery types, server-restricted stories, normalized shared URL search/category/status/sort/page and server totals. Actual pagination/share/reload/history/type/malformed/unknown-category journeys: `integration-browser-public-part1.json`, `integration-browser-public-part2.json`, `integration-browser-all-types.json`. Existing nav constants were reused; no repeat extraction.                                                                                                                                                                                                             |
| T035–T039; FR-009–014/017/020–021; US2     | Persisted featured/latest/saved-order shortcuts and first-three populated suggestion tabs, real category directory, hidden unsupported trending/engagement, optional community action omitted when unset. Actual ADMIN partial disable and last-category409 with unchanged public result: `integration-browser-partial-category-disable.json`, `integration-browser-category-last-enabled.json`. Actual exported latest query and PostgreSQL plan: `integration-latest-explain.json`; 44 Works/60 Chapters is a representative local shape, not a production scale benchmark. No demonstrated index problem or speculative migration. |
| T048–T050; FR-015–019/030–033; US3         | Both detail compositions render editorial metadata, optional values, enabled categories/tags, bounded Chapter summaries, full-set first/latest and similar Works. Real ADMIN created/published both Work and Chapter kinds; `integration-browser-admin-illustrated.json`, `integration-browser-admin-text.json`, their `-chapter` artifacts and `integration-browser-chapter-transitions.json`. Zero-Chapter saved Works remain eligible; no persisted Work links into fixture readers.                                                                                                                                               |
| T055–T057; FR-018–019/022–024/027–028; US4 | Request-time Arabic metadata/canonical/social cover, query noindex/base canonical, complete dynamic sitemap and robots. `integration-rendered-seo.json` has ordinary/Twitterbot reads,48 unique URLs and private exclusions; `integration-hidden-seo.json` captures withdrawn/unknown parity and noindex. `integration-ssr-unavailable.json` distinguishes503 from absence and rejects partial sitemap. Streamed Next absence may returnHTTP200; Express metadata/cover denial is404.                                                                                                                                                 |
| T059/T061–T062; FR-028/030–032; US5        | Arabic states/live regions, explicit retry/focus, URL and Work identity cancellation, denial fences across cache writes/reset/remount and older successes, Chapter-parent invalidation, Blob URL revocation/lazy gating, reduced-motion hero/carousel. Six actual route retry/held-read/recovery flows: `integration-browser-all-route-recovery.json`; explicit real429 recovery: `integration-browser-real-rate-recovery.json`; five fresh shuffled processes6316–6320 each21 tests in `integration-hooks-current.json`.                                                                                                             |
| T063; FR-033                               | Production AST traversal of the five owned page roots through66 runtime owners reaches no catalog fixture collections (`integration-production-imports.json`). Nine obsolete unowned fixture/adapter files removed. Existing reader story/comments/text fixtures remain because P07 still owns them. No API failure falls back to fixture content.                                                                                                                                                                                                                                                                                    |
| T078–T080                                  | Route smoke requires a real persisted slug, composite recovery waits for matching detail authority, and Turbo hashes the browser API origin while passing runtime server origins. `integration-turbo-environment.json` records actual different build hashes with different public origins. Server/private origin was absent from regular/crawler HTML.                                                                                                                                                                                                                                                                               |
| T081–T082                                  | Confirmed server404 now fences the surviving client owner through a validated direct-Work boundary ID. Replayed old IDs cannot revoke later success; actual fresh matching GET governs recovery. Actual Next16 same-path404 latch was reproduced, then repaired with a scoped server-render template reset, preserved root QueryClient and nested-reader children. Only the obsolete bare BODY robots/noindex marker is removed after matching eligible server data; head metadata is untouched. Final browser recovery/focus and review are recorded below.                                                                          |

### Real media and authority boundaries

`integration-media-transitions.json` uses the actual PostgreSQL row state, MediaStorage and MediaReconciler. Missing/corrupt bytes whileAVAILABLE yielded image503 with Work metadata200. Committed unavailable cover yielded metadata/image404, empty home Work sections with enabled category shortcuts and a root-only four-URL sitemap. Verified-byte repair plus actual reconciliation restored availability. Optional background failure did not hide the Work. Publication-event count stayed104 across that entire read/integrity journey. The initial helper incorrectly removed an already missing file, and an incorrect home-field assertion failed; the helper was corrected to the existing remove-if-present storage API and actual categoryShortcuts contract before the successful run. These harness failures were not reported as product passes.

`integration-browser-signed-public-complete.json` captures real signed-in browser JSON and Blob reads with no Cookie, Authorization or CSRF header names while actual refresh/CSRF cookies exist, plus the protected fixture reader. `integration-browser-reader-anonymous.json` captures the anonymous login redirect. Earlier signed-browser harnesses incorrectly expected an immediate detail refetch and used the wrong accessible name for an existing reader button; their failed text output remains. The successful harness uses actual category pagination to guarantee a browser JSON read and the existing button title. Private media/account/admin authority and reader source were preserved.

### Verification provenance and failures

The owned manual environment used a separately labelled PostgreSQL18 container, a new database/media root, actual Express, production Next and synthetic accounts/media. A separate owned GET/HEAD forwarding proxy supplied controlled503/held server reads; browser routing supplied controlled client failures. Neither changed production API limits or visibility rules. API global100/min was exercised, not weakened; real429 interrupted several broad browser runs. Later successful bounded flows and their actual recovery are distinguished from those failures.

The aggregate `/tmp/fury-p05-integration-root-verify-final.log` exited0 before final T082 edits: fresh contracts117, API unit154, web503, database unit10, API integration158 and database integration36; lint/types/format passed. Build tasks4/4 succeeded with2 cached dependencies; API/database integration explicitly bypassed cache. Build output validated6 required entries/386 emitted files without tests. It is an intermediate source-boundary result; the final post-T082 aggregate and route smoke are recorded below. The preceding root run failed formatting on10 files, then passed after formatting; no check was weakened. Existing pg concurrent-query deprecation, jsdom navigation notice and intentional native Blob-image Next lint warning remain visible.

Critical hook runs6301–6315 belong to earlier stages. Current6316–6320 combined hook/boundary runs are separate processes and include current access-owner source hashes. An earlier new component test mocked an internal observer and missed shuffled pathname reset; review replaced it with a real active QueryClient composite deferred at Fetch and reset each test's route. The final test review reports no remaining blocking source finding.

### Design and scope preservation

Before integration,18 baseline captures covered six layouts at 320/768/1280. All auth/account/admin/media/workspace/advertising/protected-reader source owners remain byte-identical to the saved integration baseline. Of65 existing CSS files,62 are byte-identical; the other three only extend existing selector lists for visible keyboard focus and focus-within arrows. Existing declarations, typography, colors, dimensions, image treatment and breakpoints remain intact. Approved changes are real catalog content/links, truthful states and minimal Arabic functional text, deferred unsupported engagement/reader actions, neutral category icons/generic action copy and technical SEO. Final18 captures and independent design disposition are recorded below. This is headless Chromium evidence; physical devices, full assistive-technology certification, deployed proxy/CDN and real editorial data remain unperformed release boundaries.

### Final browser and independent review disposition

The T082 failures are preserved: a successful matching GET and refreshed title
initially left the framework's404 UI latched; after scoped template reset, an
obsolete streamed BODY noindex and lost focus were still reproduced. The final
correction waits for settled, connected visible detail, and removes only the
obsolete body marker after matching eligible server data. Actual repeat
unpublication/republication and keyboard retry now pass in
[integration-browser-t082-final-acceptance.json](evidence/integration-browser-t082-final-acceptance.json):
real Work heading/title, only index/follow, and focused details DIV with solid 3px
outline. This is actual browser verification, not merely a mocked router assertion.

All 18 final captures at 320/768/1280 have exact viewport/scroll widths and RTL.
The independent design reviewer inspected them against the saved before captures
and source and recorded qualified PASS, with no remaining blocking design finding.
The additional real committed-unavailable empty home preserves category shortcuts
y64–116 above a footer starting at y728, with zero Work links. Captures live in
`output/playwright/p05-after/`; geometry/evidence JSON is versionable here.

Real missing cover and background bytes were additionally exercised in the
browser after the API/reconciliation matrix. Both show the saved Work heading,
truthful image failure and explicit keyboard retry after byte repair. Both recover
the actual Blob image with a solid 3px focus outline; no Work denial is invented.
See `integration-browser-cover-bytes-failure.json`, its `-recovery` artifact,
background equivalents and `integration-browser-media-operations.json`.

Independent final production review by `/root/p05_code_review` is qualified PASS:
all actionable lifecycle/ownership/privacy/source findings were corrected; the
reviewer inspected final source and the actual retained browser artifact, but did
not execute those runs. `/root/p05_test_review` reports qualified PASS after the
real Fetch-boundary and shuffled isolation corrections. `/root/legacy_review`
reports qualified design PASS and literal predecessor task dispositions, while
explicitly withholding human P02 artwork acceptance. These are actual independent
agent reviews, not owner/editorial approval or deployment acceptance.

### Requirements, success criteria and constitution comparison

All 33 P05 FRs were compared with current source and evidence. FR-001–002 and
FR-025–029 retain the real backend eligibility, public projection, anonymous versus
ADMIN/private authority, privacy/no-store and backend-first boundaries established
by T001–T019/T026–T034/T040–T047/T051–T054/T058/T060/T070–T077; all 43 prior backend
and package changes remain byte-identical. The journey table above covers the
remaining FRs and identifies their actual owners and verification. Common listing
component/model tests replace obsolete fixture-only test owners rather than adding
mirror tests for deleted adapters.

| Criterion | Comparison                                                                                                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SC-001    | Real six-type browser filtering plus strict stories-only journey and actual PostgreSQL/HTTP visibility matrix; ineligible results excluded                                                      |
| SC-002    | Actual copied URL/reload/back/forward and distinct bounded pages; normalized query/model/HTTP deterministic ordering and overrun regressions                                                    |
| SC-003    | Actual ADMIN Work/Chapter publish/unpublish/recovery, permitted/refused category changes and committed media transitions; complete HTTP visibility/archival/similar/snapshot regressions        |
| SC-004    | Actual empty home/categories, no Work links when hidden, no active fake engagement/trending/community claims; production import traversal excludes fixtures                                     |
| SC-005    | Ordinary/crawler rendered canonical/OG/noindex,48 unique sitemap URLs, hidden/unknown and upstream-failure output; no private origin or optimized-image cache                                   |
| SC-006    | Both real Work/Chapter kinds, six-layout failure/held retry/focus, media retry, same-SPA server404 recovery, keyboard scroll, reduced motion, RTL and18 final narrow/intermediate/wide captures |

ConstitutionI keeps existing approved features/requirements; II–III retain API
security, anonymous projection and private authority; IV retains canonical
contracts, transport/API, pure models and hook lifecycle owners; V preserves
forward-only migrations/history; VI honors the bounded 2.1.0 functional exception
with independent design preservation; VII requires actual checks and honest cache
boundaries; VIII preserves the unresolved formal inherited P02 gate and forbids
P06 admission; IX keeps owner decisions and existing product scope. The technical
implementation is admitted by the existing synthetic exception. This comparison
cannot accept the remaining human artwork gate or a release deployment.

### Final post-T082 aggregate — 2026-11-01

**`pnpm verify` exited0** on the final application source after T082 and all actual
browser journeys. [Portable complete output](evidence/verification-transcripts.md#integration-final-verification)
retains the actual commands, warnings and cache boundaries. A preceding final run
failed only formatting of `public-catalog.seo.ts`; the corrected run follows
Prettier's whitespace-only change, without weakened assertions or checks.

Fresh final web tests: **503**. Fresh actual PostgreSQL/Express integration:
**158 API +36 database**. Contracts117, API unit154 and database unit10 are cached
from the earlier passing aggregate in this execution, not fresh reruns here.
Lint/types each succeeded4/4 tasks with3 cache hits (fresh web); unit test graph
succeeded6/6 with5 cache hits (fresh web). Integration bypassed cache for both
integration suites. Final build succeeded4/4 with3 cache hits (fresh web build).
Output validation found6 required entries and386 emitted files without tests.
Schema formatting/validation/generation, repository formatting and `git diff
--check` passed in the actual chain. The sentinel root validation URL was never
the manually owned acceptance database; integration setup used its own disposable
PostgreSQL containers.

The additional bounded browser checks now record all four status choices,
all four sort choices with exact reversed title order, saved category-name search
and native Enter to filtered-empty. Earlier broad runs exceeded the unchanged
100/min limiter, and earlier category harnesses assumed heading/card-only link
selectors despite existing strong/footer markup. Their failed text artifacts
remain; corrected bounded runs use the actual source surfaces and a fresh actual
limiter window. These are harness corrections, not product passes inferred from
failed runs. See `integration-browser-all-statuses.json`,
`integration-browser-sort-choices-final.json`, and
`integration-browser-directory-name-search-final.json`.

All23 original pending P05 tasks and T078–T082 now satisfy their applicable
technical clauses. Requirements/checklist owner approval markers remain unchanged.
P05 technical implementation is complete; formal inherited acceptance and next-spec
admission remain blocked only by the genuine P02 T002/T067 representative-artwork
input and the separately identified release obligations. No release is declared.

The final rebuilt server also passed all 40 existing route probes and the unknown
route404 fallback with the actual persisted `saved-manga-0` slug
([output](evidence/verification-transcripts.md#integration-final-routes)). Final post-T082 browser probes
confirmed anonymous reader redirect and real authenticated fixture-reader Chapter1
→02 navigation. The first positive probe encountered the existing login boundary,
then a real login restored access; a subsequent harness expected unpadded2 while
the preserved reader intentionally navigates to02. The corrected probe accepts
the existing positive-integer alias and verifies the exact Chapter02 heading.
No auth/reader implementation was changed to satisfy that harness.

Documentation guard checked1134 relative targets with zero missing files; the
retired discover fixture link was replaced with its current public-catalog owner.
Commands/config names were checked against manifests/source, API response/header
claims against current tests and real output, and media bounds against shared byte
limits and the actual decoder. All new evidence is English prose with actual
Arabic UI/editorial values retained as evidence. A secret-pattern scan found no
raw JWT, fixture password or credentialed database URL in retained text/JSON.

## Final T083 and prerequisite T106 verification — 2026-11-01

**P05 IMPLEMENTATION: COMPLETE. LEGACY CLOSEOUT: INCOMPLETE. NEXT SPEC: NOT READY.**
This later source boundary supersedes the post-T082 aggregate above. The original
23 P05 tasks and T078–T083 are complete. Independently actionable prerequisite
P03 T106 is also complete. The unresolved human gate remains P02 T002/T067,
FR-005–006/SC-001: representative-artwork and bounds acceptance for all six media
classes. The [concrete decision package](../002-persistent-vps-media/implementation-evidence.md)
contains current bounds and six explicitly unapproved technical previews. No
technical suite or agent disposition supplies that editorial acceptance.

### T083: browser visibility, server metadata and compiled rendering

The final read-only convergence first appended T083; only the selected task file
changed in that command ([before/after evidence](evidence/integration-convergence-round1.json)).
The subsequent IMPLEMENT binds the existing Work detail/access owner to a bounded
metadata refresh claim per QueryClient and slug. Genuine matching browser success
following unavailable SSR requests fresh server metadata; a later authoritative
browser Work404 withdraws stale published metadata. Related404, cancellation and
server-only denial do not fabricate browser visibility. The claim survives a
failed refresh/remount to prevent an automatic loop. An explicit positive or
negative retry may request one new server render and transfer focus to the new
visible feedback/details boundary. Existing FeatureState tokens provide a
reachable partial-page retry with minimal functional Arabic copy.

Actual production execution exposed a second cause missed by the ordinary unit
transform: React Compiler memoized mutable access lookups on stable client/slug
arguments when the useSyncExternalStore revision return value was discarded.
Read-only diagnostics showed a real browser404, denial owner true and revision1,
while compiled UI retained old eligibility. Inspection of compiled output
confirmed the cached lookup. The repair publishes an immutable cached snapshot
before notifying subscribers and consumes that snapshot in render predicates.
No compiler setting, timeout, assertion or authority boundary was weakened.
Vitest evidence alone is not proof of compiled Next behavior.

Actual final compiled browser evidence:

- [SSR503 → browser200 → one automatic successful server refresh](evidence/integration-browser-t083-final-auto.json).
- [Persistent SSR503 stays bounded with a reachable retry](evidence/integration-browser-t083-final-bounded.json), including320px RTL; [explicit recovery](evidence/integration-browser-t083-final-reachable-retry.json).
- [Real ADMIN unpublication → browser404 → withdrawn metadata → republication/recovery](evidence/integration-browser-t083-snapshot-verified-withdrawal.json).
- [Failed automatic withdrawal followed by explicit own404 retry](evidence/integration-browser-t083-snapshot-verified-negative.json): safe not-found metadata, no social image and visible3px negative-feedback focus, then eligible recovery.

The last two flows reloaded the ADMIN editor before republication because of the
separate P03 defect below. Those passes are not represented as proof that P03 was
already correct. Current critical hook source passed31 cases in five fresh
processes, seeds6331–6335 ([hashes/results](evidence/integration-hooks-current.json),
[output](evidence/verification-transcripts.md#integration-post-t083-shuffled-hooks)).

### P03 T106: versioned publication confirmation

A separate P03 CONVERGE appended T106 before implementation. An unversioned local
publication confirmation could override a newer authoritative Work after the
editor baseline advanced, leaving published controls after a committed unpublish.
The component now records only acknowledged Work id/version/status; the existing
pure model permits that acknowledgement to override only older matching server
props. Equal/newer server data wins independently of adopt/continue/baseline state.
Actor, canSave, unknown-outcome, dirty-input and version/CAS guards remain intact;
all existing administrator DOM, labels, controls and CSS are unchanged.

Three model regressions cover revision precedence, identity/create isolation and
dirty adopt/continue behavior. The existing no-op form fixture initially claimed
archived and draft at one revision. It now models a real intervening restore at
v+1; its no-op message, no-event and draft assertions are retained. The actual
publication service handles same-state before CAS and increments revision for an
actual change. [Initial failure](evidence/verification-transcripts.md#integration-p03-t106-first-focused)
and [corrected73/73 model/form/hook run](evidence/verification-transcripts.md#integration-p03-t106-focused)
are retained. The [actual compiled same-editor journey](evidence/integration-browser-p03-t106-no-reload.json)
primes an acknowledgement, unpublishes and republishes **without any administrator
reload**; saved draft controls appear, anonymous public404 withdraws metadata, and
republication restores title/indexability with3px detail focus.

### Shared checks, independent review and preservation

The [final root pnpm verify](evidence/verification-transcripts.md#integration-post-t083-t106-verification)
exited0. Fresh web516, real API/Express/PostgreSQL integration158 and database
integration36 passed. Contracts117, API unit154 and database unit10 were replayed
from earlier fresh same-execution cache; lint/types and build cache boundaries are
visible in the log. Schema format/validate/generate, formatting, configured
production build, build-output validation and diff checks passed. The original
post-T082 aggregate remains historical, not evidence for this later source.

The [first later aggregate](evidence/verification-transcripts.md#integration-post-t083-t106-first-timeout)
hit the unchanged5000ms deadline in the existing unknown-edit acknowledgement
form case, with515 other tests passing. The [isolated diagnostic](evidence/verification-transcripts.md#integration-p03-unknown-edit-diagnostic)
passed that case in238ms; it is a scoped diagnostic, not a complete-suite pass.
Source review established no new asynchronous defect. Host contention was plausible
but its cause was not proved. One unchanged full-gate repetition then passed all516
web cases. No case, assertion, retry policy, worker setting or timeout was changed
for that repetition; the original failure remains explicit. A prior formatting
check also reported15 new JSON evidence files; only formatting was corrected.

Independent code, test/evidence and legacy/design reviewers inspected actual final
source and execution artifacts ([dispositions](evidence/integration-independent-reviews.json)).
They report qualified technical PASS and no remaining independently actionable
finding, without claiming to have run root's checks or supplied human artwork
approval. T106 source review confirms presentation preservation; prior18 normal
route comparisons and partial-state320/1280 captures remain the design evidence.
The partial-state captures with unsettled lazy images do not certify image bytes.

The [preservation inventory](evidence/integration-preservation.json) verifies all 43
pre-existing backend/package changes,196/200 protected frontend files and exact
original P05 pointer bytes. The four protected differences are only the T106
component/model and their regressions. All65 existing CSS files retain their
original declarations and breakpoints; three selector lists extend keyboard focus.
The current [production import trace](evidence/integration-production-imports.json)
contains67 runtime owners and no forbidden catalog fixture import. The [final
owned dataset](evidence/integration-final-dataset.json) has44 Works,60 Chapters,
34 categories (33 enabled),32 available media assets and119 publication events.
A direct native-node invocation of the typed dataset helper could not resolve its
TypeScript .js import; rerunning through the repository's existing tsx/development
loader succeeded. This was a helper invocation error, not an application failure.

Synthetic credential expressions embedded in five retained browser code transcripts
were redacted after independent evidence review. Results and actual steps remain;
credentials, bearer tokens and credentialed database URLs are not portable evidence.
No P06/P07 implementation, commit, push, PR, deployment, production migration or
external message occurred. The next section records the separate final convergence
and owned-resource cleanup after verification.

## Final separate convergence — 2026-11-01

After T083/T106 implementation, actual browser acceptance, final shared checks
and task reconciliation, separate P03 and P05 CONVERGE stages inspected current
spec/plan/tasks/constitution/source/evidence and actual independent dispositions.
[P03 comparison](evidence/integration-p03-final-convergence.json) and
[P05 comparison](evidence/integration-final-convergence.json) found no additional
independently actionable gap and appended no tasks. Whole versionable-tree and
focused pointer/constitution/spec/plan/task hashes were identical before/after
each command. No test/build/formatter/generator, application change, old-task
change or pointer mutation occurred inside either convergence. The P03 selection
and exact P05 restoration occurred between commands. Existing P02 T002/T067 is
reused as the actual owner gate, rather than duplicated as future P05/P06 work.

The final rebuilt server passed [all 40 existing routes plus unknown 404](evidence/verification-transcripts.md#integration-post-t083-t106-routes)
with the actual persisted saved-manga-0 slug. Documentation-only handoff changes
after the application aggregate are checked through formatting, relative targets,
evidence sanitization and diff verification; application tests are not rerun
merely for report prose. Final cleanup below covers only named owned resources.

## Owned cleanup and final handoff

[Cleanup verification](evidence/integration-final-cleanup.json) confirms the named
browser context closed, the other owned session was already closed, ports 4315/4316/4317
are no longer listening, the label-verified disposable PostgreSQL container and
its anonymous volume were removed, and the guarded owned media root is absent.
The exact original P05 feature pointer and unchanged HEAD are preserved. Other
services/datasets were untouched. Source and portable evidence remain uncommitted.
The synthetic environment is intentionally not a persistent runtime dependency.

Final ledger: 453 unique identities,449 VERIFIED COMPLETE,2 OWNER DECISION REQUIRED,
2 SUPERSEDED;450 checked/3 unchecked. P01 T004 is the explicit superseded chronology
clause; P02 T002/T067 are the only actual owner inputs. P05 technical completion
does not waive the inherited phase-admission or separately scoped release gates.

Final [documentation/preservation checks](evidence/integration-final-documentation-checks.json)
verify relative file targets, sanitized evidence, current shuffled-hook hashes,
exact pointer bytes, unchanged HEAD, empty index, task identity/count consistency
and whitespace. No implementation source changed after the final aggregate.

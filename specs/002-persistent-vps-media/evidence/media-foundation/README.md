# Media-foundation execution record — 2026-11-01

This owner-authorized extension belongs to existing P02 tasks T081–T085 and current
P04 administrator preview/P05 Work-image consumers. It creates no new feature or
P07 implementation. Branch remains `main` at
`868948bb9f51fe9fdf6f40d18e8d8b7d920a1f9f`. Existing dirty work was copied and
hashed before this request; final preservation and command-stage records follow.

## Authority and numerical decision

The current owner explicitly approved all six existing byte/dimension/ratio limits.
The dated spec/plan/contract overlays reconcile T002/T067; generated test artwork
was not personally reviewed or approved. Existing numerical source values match
the owner's table exactly. The approved static decoded-pixel ceiling remains 24M.
Constitution 2.2.0 narrowly permits this media extension and necessary functional
feedback within the existing design. Governance reconciliation, accepted-artifact
amendment and implementation were separate stages. Historical requirement-quality
approval markers remain unchanged; no new independent/human approval is invented.

## Producer, storage and delivery

`MEDIA_SOURCE_TYPES` admits GIF/JPEG/PNG/WebP for Work cover/background/Chapter pages.
Avatar/frame/decoration retain their existing static formats and authority.
Complete GIF/PNG/WebP container inspection precedes native decode. APNG is detected
and rejected415; corrupt/truncated/appended/mismatched and resource-limit cases are
safe failures. JPEG retains its existing decoded validation/canonicalization.

GIF and animated WebP become lossless animated WebP. Static JPEG/PNG/WebP retains
its existing output/quality behavior. Stored MIME, canvas width/height, bytes,
SHA-256 and HTTP response agree. Logical `pageHeight` prevents stacked animation
height from becoming the product height. Decoded-output tests compare composited
visible RGBA and transparency, frame order, delay and loops. Implicit Sharp
metadata preservation also retains a 100000ms GIF hold that an explicit WebP delay
setter would cap; a regression covers it. No optimizer or static social derivative
replaces the actual animation.

Animated processing admits at most 100 frames, 24M pixels per canvas and 32M
aggregate decoded pixels. These finite work limits also bound unusually large
low-byte animations. One composition-owned `ImageProcessor` admits two jobs and
rejects excess work503 `MEDIA_PROCESSING_BUSY`, without an unbounded application
buffer queue. Every accepted/rejected native job releases its slot in `finally`.
A busy upload has an explicitly rejected attempt; deliberate retry uses a new key.
The ordinary API creates one application/composition per process; separate API
processes require their own capacity planning. No global multi-instance limit is
claimed.

Sharp's native 10s timeout applies per animated metadata/encoding operation,
excluding libuv queue wait. It is not a hard 10s HTTP wall-clock deadline or a
claimed tested timeout duration. Static decoding retains its existing 30s timeout.
Actual [processing samples](processing-measurements.json) measured 18ms for a
three-frame cover GIF, 16ms for a background WebP and 320ms for a two-frame
4000×4000 aggregate-budget boundary. These simple generated samples justify ample
headroom; they are not worst-case traffic/complex-artwork guarantees. Before/after
RSS includes native allocator/fixture history and is not a peak-memory ceiling.
The real capacity test admits exactly two concurrent calls, rejects the third and
proves capacity is usable again after settlement.

Existing real PostgreSQL/filesystem tests now exercise static and animated attempt
replay, interrupted reconciliation, public eligibility/unavailable bytes,
transaction rollback and competing reference replacements. Actual Express tests
exercise all six format/class combinations, stored/retrieved decoded fidelity,
GET/HEAD, no-store/nosniff/MIME/hash, wrong actor404 and anonymous401. A fresh app
instance is tested separately from the [actual OS process restart](restart-proof.json),
which preserves the exact three-frame public-cover bytes, delays, loop and canvas.
No migration or animation columns were added. Private administrator Chapter DTOs
optionally include existing asset dimensions/byte length; public Chapter output
still exposes no pages/text content.

## Current consumer and scheduling ownership

The real saved thirty-page administrator preview consumes `ChapterContentRenderer`
→ `IllustratedChapterPages` → scoped resource effects and the pure policy model.
It is not unused future infrastructure. The dataset was created through real media,
Work/Chapter/publication services in an isolated PostgreSQL18.4 container with a
private filesystem root; [dataset](foundation-dataset.json) records identities and
10,505,060 encoded page bytes. Pages2/6 are distinct GIF/WebP-source animations;
28 static pages preserve existing JPEG quality90.

Normal continuous policy prioritizes the visible image exclusively until ready,
then admits two transfers. Initial eligibility is pages1–10; at page5 it extends
toward11–20. There are two rear pages, at most20 retained images, 24MiB encoded
resources and32M decoded pixels, charging all canonical animation frames. Budgets
can reduce lookahead. Reduced motion uses temporary PNG display with96MiB retained
bytes and one canvas charge, leaving authoritative animated bytes untouched.
Constrained/save-data uses one transfer, initial5 and extension near page3.
Single-page policy retains one rear and up to3 ahead, or1 ahead when constrained.

Stable asset identity deduplicates jobs. Jump/reversal/mode changes recompute
priority and abort obsolete work; aborted jobs retain their application slot until
settlement. Old scope/actor epochs cannot install a URL. Late metadata cannot
repopulate the old actor query cache. A jump during a denied-read recovery cancels
that recovery and presents deliberate retry at the new visible position. Binary bytes are not in React Query,
localStorage, IndexedDB or a service worker. Confirmed401/403 clears owned URLs and
shows retry at the current position; background success cannot undo denial.
Individual failures remain retryable. Retry completion restores keyboard focus;
late decode errors cannot remove a replacement URL. Aspect reservations preserve
saved-page layout through loading/release. Unmount and scope changes release URLs.
These are bounded application-owned resources, not a native/GPU RSS guarantee;
short-lived read/array-buffer/canvas allocations and browser cancellation timing
remain separate. No prefetch writes progress, opens or publication events.

Five final independent shuffled **processes**, seeds110127/110129/110131/110137/
110139, pass28 scoped tests each. These are process-order checks, not independent
reviewer approvals. The tests use pure inputs, real QueryClient/session state,
Fetch/URL/observer boundaries and actual production adapters rather than mocking
the loader or auth hook under test. Real Chromium complements simulated DOM timing.

## Real browser observations

All measurements use the actual production Next build, Express, isolated database
and persisted media on loopback. Each benchmark case used a fresh browser context
and a fresh owned API process with unchanged rate limits and persisted data.
These are one controlled sample per case; host load, cache state and synthetic
artwork limit generalization. Warm means retained pages inside the same viewer.

| Equivalent profile                               | Eager baseline           | Bounded loader                               |
| ------------------------------------------------ | ------------------------ | -------------------------------------------- |
| 1280px,20ms latency,10MiB/s: first useful image  | 387ms                    | 121ms                                        |
| Bytes received before useful image               | 1,864,483                | 375,161                                      |
| Initial prepared requests                        | all30                    | pages1–10                                    |
| Initial preparation                              | 1222ms for30             | about418ms for10 in the first bounded sample |
| 320px,150ms latency,192KiB/s: first useful image | 12603ms                  | 2877ms                                       |
| Slow bytes before useful image                   | 2,212,207                | 375,161                                      |
| Slow initial sample                              | all30 already dispatched | only1–3 dispatched by first useful sample    |
| First-page height wide                           | 30→1000px                | 1000→1000px                                  |
| First-page height narrow                         | 30→317.33px              | 317.33→317.33px                              |

See [baseline wide](before-wide-cold-warm-corrected.json),
[baseline slow](before-narrow-slow.json), [bounded wide](after-wide-cold-warm-get.json)
and [bounded slow](after-narrow-slow.json) for full request sequence/start times,
boundary stalls, resource counts, layout shifts and JS heap snapshots. Wide page5
starts11/12 before page10. Deliberate jumps to5/10/15 took99/100/150ms in the
corrected bounded sample; the eager retained case was about66ms. This exposes the
tradeoff: lower initial transfer cost, with bounded on-demand misses. A genuinely
prepared warm reversal to13 took22ms and issued no new target request.

Initial content GET transfer concurrency is2; during rapid cancellation/jump,
Chromium briefly records3 GETs including requests awaiting cancellation. The
application admits at most2 unsettled jobs. Playwright event-delivery ordering can
also report3 outstanding requests; neither value is mislabeled as exactly two
wire transfers throughout navigation. Earlier CDP counts accidentally included
CORS OPTIONS and are retained, superseded by GET-only traces. The slow emulation
changes transport throughput; it does not claim a physical 3G device or automatically
change NetworkInformation. A separate controlled save-data preference exercises
the one-transfer/five-page policy in the actual hook.

Observed maximum owned URLs was10/~3.0MB in the bounded wide sample, versus
30/10.5MB eager. Every preview close returns to its initial zero owned URLs.
JS heap is measured separately and excludes native/GPU animation memory. No
horizontal overflow occurs at320/1280px. Layout-shift entries unrelated to page
reservation are retained; this is not a whole-site zero-CLS claim.

[Visible compositor samples](animated-existing-surfaces-visible-crops.json) prove
three changing states for both private animated pages and public cover/background,
and exactly one stable state under reduced motion. Canvas `drawImage` itself uses
the default frame, so its failed animation probe is not treated as display proof.
[GIF picker/parent save](gif-picker-parent-save-patch.json) uploads cover/background
through the existing controls, observes animated accepted WebP and still PNG on
motion change, and confirms actual parent PATCH200/public images. Stored files are
never flattened. Representative10×10 compositor crops are retained alongside the
sample timings; fingerprints compare observable pixels, not stored SHA-256.

[Real viewer recovery](progressive-real-viewer-authority.json) exercises transient
network503→explicit actual-read retry, five-page save-data window, direct jump25,
reversal, late cancellation, draft/saved scope change and URL cleanup. The wrong
USER's actual protected content read returns404. Its actual administrator Chapter
endpoint returns403; this real denial envelope is replayed at a controlled media
transport boundary to verify global cache fencing and explicit recovery. It is not
a claim that an administrator loses media authority merely when a Work is hidden.
Exact account/logout/metadata late races are separately covered through the real
QueryClient/Fetch adapters; no delivered byte-revocation promise is made.

## Failed-run history and corrections

The original `fury-*.txt` captures are retained in the
[transcript bundle](verification-transcripts.md) and
[exact-byte index](verification-transcripts.index.json), not as separate files.
They are execution logs, not success claims. Historical JSON path strings resolve
through that index. Display normalization never replaces the retained original bytes.
The original eight animation regressions failed before implementation. Later
failures include constructor/mapper fixture omissions, incorrect test expectations
for existing `private, no-store`, a GIF fixture still declared JPEG, and a new HTTP
scenario exhausting a shared test app's unchanged rate limiter. Corrections fixed
fixtures/assertions and isolated that scenario; they did not raise limits or skip
checks. Initial lint findings were fixed without suppressions.

Browser harness failures remain under their original names: the first baseline
response predicate matched Next HTML; a concurrency assertion counted delayed
Playwright finish events; the first CDP refinement included OPTIONS; the first
warm reversal had not waited for a prepared image. Canvas sampling cannot prove
animation, dynamic import is unavailable in the CLI VM, and full-element screenshots
inside the clipped modal captured other visible content. Corrected visible crops
prove actual animation. The first parent-save waiter expected PUT although the
existing API uses PATCH; the save itself was not an app failure. The first denial
probe wrongly expected403 from private wrong-owner delivery, whose correct
non-disclosing outcome is404. Corrected evidence states the exact injected boundary.
The first aggregate stopped at20 new frontend/test lint errors; these were fixed
without disabling rules. A final guard reproduced a denied-recovery jump that lost
its retry surface; the focused test failed before correction and passed after.
No failed run was deleted, relabeled successful or retried with arbitrary sleeps.
Timed screenshot spacing measures animation; it is not a readiness workaround.

## Handoff, review and verification

The protected route still uses `MOCK_PAGES` and session-local progress. P07 owns real
user-reader API authority, protected content, progress/resume/opens and full-reader
acceptance after its roadmap prerequisites. Exact policy/animation/cleanup/long-
Chapter acceptance is now in the existing PLAN.md P07 section and frontend guide.
That future work neither counts as completed nor blocks this legacy extension.

Executing-agent clean-code-guard fixed transient capacity classification, visible
background-denial feedback, separated display preparation from resource admission,
kept static candidate sources unchanged under reduced motion, fenced old-actor
metadata writes and repaired recovery across a direct jump after denial. Test-guard removed the old internal-hook mock in renderer tests,
retained structured-text regressions and checked each new boundary/race scenario.
Docs-guard checks source/contract/command links and separates measured facts from
historical, synthetic, cached and unperformed acceptance. React/Next review keeps
Blob images unoptimized, effects owner-scoped and immutable snapshots consumed by
the production compiler. No new package, generic image framework or parallel HTTP
session stack was introduced.

Fresh focused results: contracts117; API units164; focused backend27; actual
backend integration89, then36 affected media tests after busy503 refinement;
web526 before the final two added boundary cases; final scoped five shuffles28each.
Final full aggregate, route smoke, preservation, convergence, task reconciliation
and cleanup outcomes are recorded separately before final closure. No production,
physical device, Firefox/WebKit, CDN/proxy, live deployment-data restore, new
independent reviewer approval or actual future protected-reader acceptance is
claimed. Historical predecessor review dispositions remain historical.

Primary implementation references: installed Sharp0.35.4/libvips8.18.6
[constructor](https://sharp.pixelplumbing.com/api-constructor/),
[metadata](https://sharp.pixelplumbing.com/api-input/),
[output](https://sharp.pixelplumbing.com/api-output/), installed Next16.2.12 Image
documentation and the [HTML canvas animated-image rule](https://html.spec.whatwg.org/multipage/canvas.html).
The `.js.txt` harnesses are exact parameterized execution artifacts requiring the
owned disposable target/credential substitution, not standalone user setup samples.
Private credentials, storage keys and auth secrets are excluded from this evidence folder.

## Final source-boundary results and closure

`pnpm verify` completed with exit0 after the recovery/metadata/lint repairs. Fresh
counts: contracts117, database unit10, API unit164, web528, API integration164 and
database integration36. All tests/integration were fresh; root lint reused the
unchanged contracts/database/API outputs, while web lint and all type checks were
fresh. API/web builds were fresh, contracts/database builds cached. Six required
entries and390 emitted files passed the test-artifact exclusion check. The final
owned Next build passed all40 route probes plus404. [Verification manifest](verification.json)
and [full aggregate log](verification-transcripts.md#fury-media-final-verify) distinguish cached outputs.
The retained pg concurrency deprecation and intentional public Blob-img optimizer
advisory are warnings, not suppressed failures.

The final five shuffled processes are110183/110197/110201/110203/110207,28tests
each. Earlier seed110183 suffered four timeouts while the host was in a recorded
565-second maintenance sleep (17:54:00→18:03:25 local); the same seed passes awake
without changing assertions/timeouts. [Power evidence](verification-transcripts.md#fury-media-host-sleep-proof)
explains that interruption. The old browser also closed during the sleep period;
its failed final-open sample is retained. The npx wrapper's subsequent open stalled
and was stopped; the exact already-installed Playwright CLI0.1.23 reopened the named
browser and ran the final checks, without installing a dependency or changing app
behavior.

Latest production-build samples confirm earlier measurements:

| Final sample                                        | First useful image | Bytes before useful image | Initial dispatch/retention                                     |
| --------------------------------------------------- | ------------------ | ------------------------- | -------------------------------------------------------------- |
| [1280px cold/warm](final-wide-cold-warm-awake.json) | 111ms              | 375161                    | pages1–10; initial prepared410ms; maximum10 URLs/~3.0MB        |
| [320px slow](final-narrow-slow.json)                | 2854ms             | 375161                    | onlypages1–3 by first useful sample; no whole-Chapter dispatch |

Final wide page5 starts11/12, measured boundary transitions are100/100/150ms and
prepared warm reversal13 is33ms with no new target GET. Final GET-only CDP maximum
is2; the prior rapid-cancellation sample's brief3 remains documented above. Aspect
heights remain stable at1000px wide and317.33px narrow, with no horizontal overflow.
[Final compositor proof](final-animated-visible-surfaces.json) again observes3
changing states per private page/public Work image under normal motion and1 stable
PNG state per image under reduced motion. [Final recovery proof](final-progressive-recovery-jump.json)
adds immediate jump25 during denied retry11 under250ms latency; retry remains
visible at25 and recovers through the actual authenticated read.

[Business fingerprints](prefetch-business-invariance.json) match before/after
these final content reads for Work, Chapter, pages, assets, upload attempts,
references/reference events and publication events. Authentication sessions are
explicitly excluded. No prefetch progress/open/publication business mutation occurs.
[Frontend preservation](frontend-preservation.json) verifies all original route and
shared component entries byte-for-byte against this request's baseline and lists
only the authorized media/preview changes.

Guard-pass fixes, all actually applied:

- `image-processor.ts` / media schemas / OpenAPI / candidate feedback: classify
  temporary processing capacity as busy503 and document per-stage timeout semantics.
- `progressive-image-resources.ts`: show background denial at the visible page.
- `progressive-image-resources.ts`: separate display preparation, resource admission,
  completion/failure/settlement and scheduling effects for auditable ownership.
- `use-media-preview-source.ts`: retain static local sources under reduced motion.
- `use-progressive-chapter-images.ts`: fence late metadata and remove the old actor
  cache on actor transition.
- `progressive-image-resources.ts`: cancel a denied recovery that leaves the new
  window and retain explicit retry at the current page; reproduced red then green.
- Image/observer/motion callbacks and boundary tests: fix lint errors with actual
  Error rejection, explicit void callbacks/string conversions and React network
  microtask flushing, without rule suppression or increased timeouts.

**clean-code-guard: 7 fixed, 0 flagged for author.** Test-guard and docs-guard report
no unresolved scoped finding after source/contract/links and boundary assertions
were checked. React/Next review was exercised on the actual final compiled build.
This is executing-agent review, not new independent reviewer approval.

[Separate final convergence](final-convergence.json) is clean, with exactly the same
1494-entry aggregate hash before/after. No app/test/spec/plan/pointer/formatter write
occurred inside CONVERGE and no unnecessary task was appended. The existing
non-executable prerequisite script was invoked explicitly with bash after a126
file-mode failure; its paths-only resolution succeeds without chmod or mutation.
T085's final evidence/pointer disposition was reconciled in the subsequent closing
stage. [Final ledger](final-legacy-dispositions.json) has458identities:456verified,
2superseded;457checked and1unchecked superseded P01T004. No active legacy task
remains. The current owner numerical decision clears the inherited old gate while
prior qualifying reviews remain dated. P04's actual deployment-data/recovery/
cutover obligations remain release-only under its recorded exception.

[Cleanup](cleanup.json) confirms the owned named browser, API/Next listeners,
labeled disposable PostgreSQL container/anonymous volume request, media/uploads
root and private credential target were removed. All29 other preexisting container
identities remain. Original P05 pointer bytes are restored; baseline user edits and
historical acceptance markers remain preserved. No commit, push, PR, deploy,
production migration or other-project mutation occurred.

Final verdicts: **NUMERICAL LIMITS: OWNER APPROVAL RECORDED; LEGACY ANIMATED MEDIA:
COMPLETE; CURRENT PROGRESSIVE-LOADING FOUNDATION: VERIFIED; REAL PROTECTED READER:
MOCK_PAGES prototype, future P07; LEGACY CLOSEOUT: COMPLETE; NEXT SPEC: READY.**
This readiness does not authorize or create the next specification/implementation.

[Closing artifact checks](post-closeout-checks.json) confirm formatting, local links,
unchanged HEAD/index, exact original feature bytes and all11 original checklist files.

## Subsequent code review and artifact consolidation — 2026-11-01

The [current review](../../../006-public-catalog-discovery-seo/evidence/final-code-review.md)
corrects the existing structured-text request/storage byte boundary, removes unused
production files and consolidates historical command captures without discarding
failed-run history. Its fresh complete aggregate passes 1,020 tests. The browser,
performance and route observations above remain dated evidence from this extension;
they were not rerun by the subsequent code review. Media authority, stored animation,
progressive-loading behavior and the protected-reader/P07 boundary remain unchanged.

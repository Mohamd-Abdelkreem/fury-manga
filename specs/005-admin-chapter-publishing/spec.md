# Feature Specification: Persistent Chapter Authoring and Publishing

**Feature Branch**: Not created; the checkout remains on `004-admin-categories-works`.

**Created**: 2026-09-26

**Status**: Requirements accepted after owner-confirmed human review on 2026-09-27; isolated synthetic-data implementation completed, while inherited phase exits and deployment acceptance remain open.

**Implementation checkpoint (2026-09-27)**: The baseline below records the
pre-P04 state used for planning. Local admin authoring, management, publication,
and title-bearing public metadata are now implemented. The separate enforcement
migration passed an isolated synthetic populated database/media rehearsal; see
[evidence.md](evidence.md). The owner accepted this synthetic implementation gate
on 2026-09-27; deployment acceptance and real-data recovery remain separate.

**Input**: Roadmap phase P04 — Persistent Chapter Authoring and Publishing.

**PLAN.md Phase**: P04 — Persistent Chapter Authoring and Publishing

## Scope and Current Reality

- **Dependencies and accepted gates**: P04 depends on the P02 private media platform and P03 persistent Work administration, built on P01 content and existing authentication. These foundations exist in this checkout. The owner accepted the written requirements reviews on 2026-09-27; formal phase exits remain evidence-gated. The owner also authorized isolated synthetic-data P04 implementation on 2026-09-27 as a development-only override; real deployment acceptance still requires the independent phase dispositions and actual recovery evidence. Browser/device/deployment/backup/recovery evidence is not inferred from executable code.
- **Executable baseline**: The content service persists Chapter identity, number, Work-derived type, structured text, page positions, publication state, and publication identity. It can list/read administrative Chapters and serve published Chapter metadata beneath eligible published Works. The media platform accepts private Chapter-page image candidates and supports reference changes. Chapter records lack editorial titles, current page positions are not joined to accepted images through Chapter authoring, and public Chapter output does not deliver reader content.
- **Behavior and user changes to preserve**: Keep the approved Arabic-first RTL Chapter list/form layout, order controls, preview dialog shell, state actions, confirmation patterns, responsive behavior, and established authentication. Keep admin preview distinct from public reading.
- **Fixture, local-only, or placeholder sources affected**: The three admin Chapter screens use fixture Works/Chapters and local admin-context actions. Their save and state controls update local state only; the illustrated editor starts with sample paths, upload only creates independent candidates, and the text editor stores Markdown-like input with a separate approximation of preview. Preview links can lead to the fixture reader. P04 replaces only these Chapter-owned sources and actions with confirmed persistent Chapter and media state.
- **Explicit exclusions**: P05 public catalog and work-detail connection; P07 protected reader routes, navigation, progress, and resume; P09 notification delivery; P12 dashboard/activity completion; ZIP import, scraping, scheduled publication, fractional Chapter numbers, volume/season hierarchy, text quote/image blocks, and Chapter hard delete. P04 prepares shared content rendering for P07 without connecting the existing fixture reader.
- **Phase exit gate**: An authorized admin creates, publishes, reloads, and previews one illustrated and one text Chapter from saved data. Page order is stable and unique; text uses only the approved safe format; repeat publication adds no event; public Chapter metadata exposes only published Chapters under published eligible Works; excluded actions are absent.

## Clarifications

### Session 2026-09-27

- Q: No real deployment database or matching backup exists yet. What evidence can close P04 implementation tasks? → A: Use generated, representative P01–P03 Chapters and private media on an isolated PostgreSQL database; back up and restore the database and matching media, stage expand → explicit synthetic remediation → zero-violation inventory → separate enforce migration, then verify the public title cutover and browser journey. Mark implementation tasks only after their synthetic acceptance checks pass. These generated editorial values belong solely to the disposable test dataset; they are not decisions for any future real Chapters. Written requirements reviews were subsequently accepted by the owner on 2026-09-27; formal P00–P03 phase exits and real deployment, backup, rollback, physical-device, and production-data checks remain evidence-gated and must never be inferred from this prototype acceptance.

### Session 2026-09-26

- Q: If a published illustrated Chapter's saved image becomes unavailable, should P04 hide its public metadata until repair? → A: Hide it from public list and detail until repaired; retain its published admin state.

## User Scenarios & Testing

### User Story 1 - Author an illustrated Chapter (Priority: P1)

An active, verified admin creates and revises a Chapter for an illustrated Work, uploads several real pages, arranges them, and saves a draft that survives reload.

**Why this priority**: Page identity and reading order must be durable before illustrated publication can be honest.

**Independent Test**: Create a draft, upload two accepted pages, reverse their order, reload, replace one, remove one, and check saved order and full admin preview.

**Acceptance Scenarios**:

1. **Given** an authorized admin and illustrated Work, **When** the admin saves a valid Chapter number and title, **Then** a private draft with stable identity appears under that Work after reload.
2. **Given** an illustrated draft, **When** the admin uploads valid pages, reorders them, and confirms a save, **Then** each saved position has the chosen accepted image after reload.
3. **Given** saved pages, **When** the admin replaces or removes one and saves, **Then** the confirmed full preview reflects the new sequence and prior media history remains retained.
4. **Given** an uploading, failed, or uncertain page candidate, **When** the admin tries to save or publish it, **Then** the UI identifies the unresolved candidate and does not report Chapter success with that page.

---

### User Story 2 - Author a text Chapter (Priority: P1)

An active, verified admin writes one canonical structured text document for a text Work. The editor and preview agree on every permitted element.

**Why this priority**: The P04 exit gate treats text and illustrated Chapters equally; the current Markdown-like preview is not a reliable saved representation.

**Independent Test**: Save each permitted element, reload, revise one element, and compare the saved preview with the shared reading presentation.

**Acceptance Scenarios**:

1. **Given** an authorized admin and text Work, **When** the admin saves paragraphs, H2/H3 headings, bold, italic, ordered/unordered lists, and a safe link, **Then** all elements reload in their chosen order and form.
2. **Given** a draft with an empty body, **When** the admin saves it, **Then** it remains private and explicitly incomplete; publishing is unavailable until content is valid.
3. **Given** an unsupported quote/image, unsafe link, raw markup, or malformed document, **When** the admin submits it, **Then** validation rejects it without a partial or falsely successful save.
4. **Given** a text or illustrated Work, **When** the admin opens its Chapter form, **Then** content type follows the Work and cannot be switched manually.

---

### User Story 3 - Control publication and visibility (Priority: P2)

An active, verified admin publishes, unpublishes, archives, and restores Chapters. Public metadata follows Chapter and parent Work state, while each real publication has a durable identity for later use.

**Why this priority**: Publication is the boundary between private editorial material and public metadata; P09 will later consume the identity.

**Independent Test**: Publish and repeat publish, inspect public metadata, unpublish, archive, restore, and inspect saved state and event counts after every step.

**Acceptance Scenarios**:

1. **Given** a ready draft beneath a published eligible Work, **When** the admin publishes it, **Then** publication time/state persist and public metadata becomes available; retrying the same state reuses its identity without a second event.
2. **Given** a published Chapter, **When** the admin unpublishes or archives it, **Then** public metadata no longer exposes it while admin access and history remain.
3. **Given** an archived Chapter, **When** the admin restores it, **Then** it returns to private draft and requires a later separate publish action.
4. **Given** a published Chapter beneath a draft or archived Work, **When** a visitor requests it, **Then** neither Chapter nor private Work details are revealed.
5. **Given** incomplete or unavailable content, **When** an admin publishes or edits a published Chapter, **Then** the operation cannot leave an incomplete published revision.
6. **Given** an illustrated Chapter already published, **When** one of its saved images becomes unavailable, **Then** its public list and detail results hide it while its admin status and publication history remain unchanged; after repair, public metadata returns without a new publish event.

---

### User Story 4 - Manage Chapters within a Work (Priority: P2)

An admin finds Chapters in the right Work, sees accurate states and totals, and acts on current authoritative data.

**Why this priority**: The existing list offers search, status filters, ordering, pagination, and confirmations; these must remain useful with real records.

**Independent Test**: Create Chapters under two Works, search/filter a multipage list, and demonstrate that stale or cross-Work actions cannot alter the wrong Chapter.

**Acceptance Scenarios**:

1. **Given** a multipage Work, **When** the admin searches by title or number, filters by state, sorts, and pages, **Then** rows and total describe one consistent filtered set for that Work in stable order.
2. **Given** an empty Work or no filter matches, **When** the list loads, **Then** an appropriate empty state appears without fixture rows.
3. **Given** a stale edit or state action, **When** another admin has changed the Chapter, **Then** it cannot overwrite the newer state and offers an authoritative reload.
4. **Given** a state confirmation, **When** the admin confirms, **Then** the dialog remains truthful during the request and closes as success only after confirmed state.

---

### User Story 5 - Respect access and recover from failure (Priority: P2)

Visitors, ordinary users, non-admin Work owners, and inactive or unverified accounts cannot access private Chapter data. Admins receive useful feedback on network, validation, or session failure.

**Why this priority**: Browser controls alone cannot enforce editorial authority or protect drafts.

**Independent Test**: Exercise administrative reads/writes as each denied actor, probe absent and private identities, interrupt a save, and verify no private data or false success.

**Acceptance Scenarios**:

1. **Given** a caller without an active verified admin account, **When** the caller requests a Chapter management operation, **Then** access is denied before private lookup/mutation and no private content is returned.
2. **Given** a visitor or ordinary active verified user, **When** the caller requests public metadata, **Then** only the same eligible published metadata is available; body, page addresses, media, and history are not exposed in P04.
3. **Given** an expired session, validation error, unavailable service, or uncertain outcome, **When** an admin acts, **Then** the UI reports the failure or uncertainty, retains recoverable input, and offers safe retry or refresh without inventing success.

### Edge Cases

- Reject zero, negative, fractional, nonnumeric, out-of-range, and duplicate Chapter numbers within one Work. The same number may be used in a different Work.
- Two admins choosing the same next number or editing the same Chapter must have one authoritative outcome; losing writes must not replace the winner or leave partial page associations.
- Missing Work, wrong Work/Chapter pairing, unavailable media, and incompatible content types must fail safely. Wrong pairing must not reveal Chapter details.
- Empty illustrated or text drafts may exist but cannot publish. If a saved image becomes unavailable after publication, public list and detail hide the illustrated Chapter until repair without changing its admin publication state.
- Independently accepted private upload candidates may remain after a Chapter save failure; failed candidates cannot silently join the Chapter. An uncertain upload is checked before retry.
- Reorder, replace, and remove across a failure must either persist the full intended sequence or retain the prior saved sequence.
- Same-state publish retry retains the current publication identity. Unpublish/archive clears current public publication state but retains history; later republish gets a new identity.
- No-match, out-of-range pagination, and stale list results show the actual empty set and total without fixture fallback.

## Requirements

### Functional Requirements

- **FR-001**: Only active, verified admins MUST be able to list, read, create, edit, preview private Chapters, or change Chapter state. Unauthenticated, unverified, suspended, and non-admin actors MUST be denied before private existence or content disclosure; browser guards do not confer authority.
- **FR-002**: Each Chapter MUST resolve and remain attached to exactly one real parent Work. A Chapter identifier under another Work MUST not reveal or mutate it.
- **FR-003**: Each Chapter MUST have stable identity, a required title normalized and bounded to 200 characters, and a positive whole number unique within its Work. Fractions, zero, negatives, and numbers above the existing supported Chapter-number range MUST fail.
- **FR-004**: Chapter content type MUST derive from parent Work and remain compatible. Admins MUST NOT manually switch it or submit the other type's content.
- **FR-005**: Admins MUST be able to save and reload private drafts of either type, including incomplete bodies. A draft still requires a valid Work, number, and title and MUST indicate incompleteness.
- **FR-006**: Illustrated authoring MUST accept multiple real image candidates through the existing private media capability and distinguish uploaded candidates from saved pages. Sample, random, or arbitrary external images MUST NOT become saved Chapter pages.
- **FR-007**: Admins MUST be able to order, reorder, replace, and remove illustrated pages. Confirmed saves MUST preserve deterministic reading order with exactly one page at each consecutive position.
- **FR-008**: A saved illustrated page MUST resolve to an accepted, available image of the correct private media class. Invalid, processing, unavailable, or unrelated media MUST NOT become publishable. Unbound candidates remain private under existing media rules.
- **FR-009**: Page order and association changes MUST apply as one coherent revision. Failure or stale conflict MUST leave the previous revision authoritative and permit reload without a mixed sequence.
- **FR-010**: Text Chapters MUST use one versioned structured document containing only paragraphs, H2/H3 headings, bold/italic inline emphasis, ordered/unordered lists, and safe links. Saved order and formatting MUST survive reload.
- **FR-011**: Unsupported nodes/attributes, including quotes, images, embeds, raw markup, scripts, malformed nesting, and unsafe links MUST be rejected. Links MUST lead only to safe same-site destinations, and rendered text MUST not execute active content.
- **FR-012**: The editor MUST create/edit the canonical text document directly instead of saving the current Markdown-like input. The same core illustrated/text presentation MUST be used by admin preview and be suitable for P07 reader use.
- **FR-013**: Admin preview MUST show complete current content in reading order and distinguish unsaved editor changes from the confirmed revision. It MUST remain administrative and not present the fixture public reader as proof of availability.
- **FR-014**: Publishing MUST require valid title/number and complete content: at least one accepted, available associated illustrated page or a nonempty valid text document. Editing a published Chapter MUST preserve readiness or fail without altering its published revision.
- **FR-015**: Lifecycle MUST allow draft→published, draft→archived, published→draft, published→archived, and archived→draft. Direct archived→published and hard delete MUST be unavailable; restore means draft.
- **FR-016**: Each real transition to published MUST create one durable identity and time associated with the Chapter. A same-state or ambiguous retry MUST resolve to the authoritative identity without a duplicate; a later distinct republish is a new transition. P04 MUST send no notification.
- **FR-017**: Public Chapter metadata MUST include only published Chapters under a currently published eligible Work. For each eligible Chapter it MUST expose only identity, number, title, content type, and publication time. Private and absent identities MUST have indistinguishable public unavailable behavior. P04 public output MUST exclude body, page addresses, private media, admin fields, and publication history. If any saved image of a published illustrated Chapter becomes unavailable, public list and detail MUST hide that Chapter until repair, while its admin publication state and history remain unchanged. Repair MUST restore public metadata without a new publish transition.
- **FR-018**: The admin Chapter list MUST be scoped to one Work and support number/title search, publication-state filtering, stable number/date sorts, bounded pagination, and a total matching the filtered set. Empty Work, no-match, loading, and fetch-error states MUST be distinct.
- **FR-019**: Create, edit, upload, and state controls MUST use confirmed persistent results. While pending, conflicting actions MUST be prevented, input kept recoverable, and success shown only after authoritative state is confirmed.
- **FR-020**: Duplicate creates, competing numbers, stale edits/state actions, and concurrent page changes MUST yield no duplicate number, lost update, or partial association; losers MUST receive a conflict/reload path.
- **FR-021**: Unpublish and archive MUST preserve confirmation patterns and explain visibility changes. Failure or denial MUST leave visible state and feedback truthful.
- **FR-022**: Draft/archived records and publication history MUST remain available for editorial recovery. P04 MUST expose no Chapter hard delete; removed/replaced page associations MUST not erase existing media retention history or delete an image still referenced elsewhere.
- **FR-023**: New Chapter UI MUST be Arabic-first RTL, responsive, keyboard-operable, and accessible. Form fields, upload progress/errors, page order/removal, state, validation, pending actions, conflicts, and preview MUST have perceivable labels and feedback; preview MUST manage focus and permit keyboard dismissal. Changed controls MUST retain visible focus, meet the approved target-size criteria and WCAG 2.2 AA text/non-text contrast criteria, and respect reduced-motion preference.
- **FR-024**: Privileged Chapter writes MUST preserve session, role, active/verified, and request-forgery protections; inputs MUST be bounded and unknown privileged fields rejected. Errors and logs MUST not expose tokens, private media paths, secrets, stack traces, or private existence to denied callers.
- **FR-025**: Chapter contracts, documented operations, server behavior, admin client, and meaningful tests MUST agree on title, page associations, structured text, lifecycle, versions, conflicts, and public projections; affected technical guidance MUST be updated when behavior changes.
- **FR-026**: The connected workflow MUST contain no fractional number, ZIP, scraping, schedule, volume/season, quote/image text block, notification, fixture-only success, or hard-delete action.

### Key Entities

- **Work**: Existing parent identity and authoritative content type/publication state determining Chapter form, association, and visibility.
- **Chapter**: Stable Work-scoped identity, title, number, derived type, draft/published/archived state, revision, timestamps, and type-appropriate content.
- **Illustrated page**: One ordered Chapter position associated with one accepted image; active association may change while prior media history remains retained.
- **Structured text document**: One versioned ordered sequence of permitted blocks and safe inline elements.
- **Publication identity**: Durable record of a real transition to published; current identity is reused for same-state retries, and historical identities remain.

### Authority, Privacy, and State Truth

- **Actors and server authority**: An admin has an active, verified administrator account. Non-admin owners, moderators without that role, ordinary active verified users, suspended/unverified accounts, and visitors cannot manage Chapters. A system process may reconcile private media and retain publication history within its established narrow authority; it may not originate P04 user-facing publication or notification. Public visitors receive only published metadata for eligible published Works. Protected reader content remains P07.
- **Sensitive data and public projection**: Drafts, archives, bodies, page associations, candidate media, versions, and event history stay behind admin authority. Public responses use minimal allowlisted metadata and make private/absent records indistinguishable. Admin preview, candidate URL, cache, or fixture reader is not a public grant.
- **State semantics**: Loading, empty, incomplete draft, pending upload/save, uncertain outcome, confirmed success, validation failure, stale conflict, denial, unavailable record, and retry have distinct feedback. Server state controls success; file transfer or local form values alone do not prove persistence. Public visibility follows current Work and Chapter state plus availability of every saved illustrated image.

## Acceptance Evidence

Automated checks MUST exercise changed behavior through real persistence and request boundaries, plus a smallest real-browser admin journey. Mock-only UI tests and HTTP success status alone are insufficient evidence of saved content, final visibility, or event count.

- **AE-001**: FR-002–FR-005, FR-010–FR-011, FR-014, FR-020 — contract and real persistence checks create both types, reload exact title/content, reject wrong Work, invalid/duplicate/fractional numbers and unsupported text, and inspect final state after competing writes.
- **AE-002**: FR-006–FR-009, FR-014, FR-022 — real media/persistence checks upload multiple valid/invalid candidates, associate/reorder/replace/remove pages, simulate failed and concurrent saves, inspect final order/active associations, retained history, and absence of partial state.
- **AE-003**: FR-015–FR-017, FR-020 — real transition/public-read checks cover allowed and denied edges, same-state/concurrent retry, later republish, exactly one event per real publish, parent Work hiding, and equal unavailable behavior for absent/private public records. Mark one image of a published illustrated Chapter unavailable: public list count and detail hide it, admin status/history remain; repair restores public metadata without a new event.
- **AE-004**: FR-001, FR-017, FR-024 — full request-path checks cover every denied actor, wrong parent identity, unsafe requests, malformed fields, public allowlist, and valid admin access without relying on browser guards.
- **AE-005**: FR-012–FR-013, FR-018–FR-023, FR-026 — UI and real-browser checks cover Arabic RTL layout, responsive keyboard/focus behavior, measured target size and contrast, reduced motion, two forms, multi-file progress/retry, list search/filter/pagination, truthful pending/error/conflict feedback, preview parity, and absence of excluded actions.
- **AE-006**: Smallest real end-to-end journey: with one active verified admin and two saved Works, create an illustrated Chapter with two uploaded pages and a text Chapter with permitted elements; save, reload, preview, publish, reload again, compare rendered content/order, retry publish, and verify public metadata plus zero duplicate publication identities. Unpublish one and verify public disappearance without loss of admin recovery.
- **AE-007**: FR-025 — cross-check each changed Chapter operation and public projection against its shared contract, documented behavior, administrative client, and positive/negative request tests; technical guidance must describe the behavior actually delivered.
- **Unverified external/browser/device boundary**: The spec defines required evidence; it does not claim browser, device, deployment, backup, media restore, or rollback has been performed. Actual results belong to implementation and release gates.

## Success Criteria

### Measurable Outcomes

- **SC-001**: In the real acceptance journey, an authorized admin creates, saves, publishes, reloads, and previews exactly one illustrated and one text Chapter; both saved records match their confirmed titles and content.
- **SC-002**: Every saved illustrated Chapter in acceptance cases reloads with the same page order and one unique consecutive position per page; duplicate positions, unavailable media, and partial failed revisions commit zero times.
- **SC-003**: Every permitted text element in acceptance cases survives save/reload and renders equally in admin preview and shared reading presentation; unsafe links and unsupported blocks are accepted zero times.
- **SC-004**: Each actual publish transition in acceptance cases has exactly one durable identity; repeated same-state/concurrent publish adds zero extra identities, while a later separate republish has a distinct identity.
- **SC-005**: Public Chapter metadata yields zero draft/archived Chapters, zero Chapters under nonpublished/ineligible Works, and zero illustrated Chapters with an unavailable saved image; after repair the same published Chapter returns without a new publication identity. Denied actors obtain zero private bodies or page addresses.
- **SC-006**: Zero unconfirmed save/upload/state actions in the Chapter UI acceptance cases display confirmed success; every failed or stale action provides safe retry or authoritative reload.
- **SC-007**: The three Chapter admin screens retain Arabic RTL and keyboard access for form, ordering, confirmations, and preview at tested responsive sizes; changed controls meet the approved 24×24 CSS px target-size minimum or a documented exception, WCAG 2.2 AA text/non-text contrast thresholds, and reduced-motion behavior; zero fixture-only Chapter results or excluded controls remain in the connected flow.

## Assumptions

- The active, verified administrator role remains the only Chapter editorial authority; Work ownership alone does not grant access.
- Chapter titles use the existing Work-title bound and editorial normalization as a reasonable default; planning may settle compatible validation details without broadening P04.
- Drafts may be incomplete so an editor can save progress. A Chapter may be published while its parent Work is private, but public metadata remains hidden until the Work is eligible and published.
- Existing private media upload and retention rules apply to page candidates. P04 associates accepted images with saved pages; public reader media delivery and reader authorization belong to P07.
- Existing page/text size bounds are the baseline unless planning finds a documented conflict. No new traffic, latency, availability, or business KPI target is assumed.

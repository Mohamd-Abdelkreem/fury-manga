# Feature Specification: Persistent Admin Categories and Works

**Feature Branch**: Not created (no branch hook configured)

**Created**: 2026-09-25

**Status**: Draft

**Input**: Roadmap phase P03 — Persistent Admin Categories and Works, with the user’s specification constraints

**PLAN.md Phase**: P03 — Persistent Admin Categories and Works

## Scope and Current Reality _(mandatory)_

- **Dependencies and accepted gates**: P01 establishes durable content identities, immutable slugs and work type, category associations, publication states, and protected management operations. P02 establishes private, validated work-cover and work-background assets with reference-aware lifecycle. Both are implemented in this checkout; their formal acceptance gates must be confirmed before P03 implementation acceptance.
- **Executable baseline**: Basic category and work create/read/update, work-category replacement, and work publication operations already persist. Categories currently lack durable enablement, display order, and real usage counts. Works lack the richer editorial metadata, cover/background association in the editorial flow, and featured placement data required here. Existing public metadata reads expose only published works, but the full public catalog and public image delivery are not connected.
- **Behavior and user changes to preserve**: Preserve the approved Arabic RTL admin layout, headers, tables, filters, pagination, status badges, dialogs, form layout, preview patterns, mobile behavior, and valid interaction tests. Preserve authentication, account status checks, administrative authorization, session/CSRF behavior, safe errors, immutable category/work slugs and work type, publication history, and private media ownership. An uploaded media candidate remains distinct from a saved work image until it is associated with that work.
- **Fixture, local-only, or placeholder sources affected**: The category screen starts from fixed sample categories and changes only component state. Work list, edit, creation, status actions, and activity are drawn from a resettable admin context; changes disappear on reload. Work form submission waits artificially and explicitly reports local preview only. Genre choices are fixed constants rather than the category records. The SEO preview derives a slug from the current title. Work media controls can upload candidates but do not bind them to the work. P03 replaces these behaviors for categories and works with authoritative saved results; unrelated admin fixture modules remain for their owning phases.
- **Explicit exclusions**: No category merge or hard deletion, work hard deletion, chapter authoring or chapter publication, public catalog screen integration, public image delivery, personalized recommendations, advanced SEO editing, dashboard metrics, or activity-feed implementation. Existing chapter links may remain navigational, but P03 must not claim chapter management is connected. Owner-supplied production content is not a prerequisite for defining this specification.
- **Phase exit gate**: An administrator can create, reload, edit, publish, unpublish, archive, and restore both illustrated and text works from saved data. Category order and enablement survive reload; usage counts and in-use protections reflect real associations. Duplicate slugs, stale writes, and invalid transitions fail without partial success. Visitors, ordinary users, and suspended accounts cannot manage content. Connected workflows have no hard-delete control, sample-image cycling, or fixture reset path.

## Clarifications

### Session 2026-09-25

- Q: What persists if a combined save-and-publish action fails? → A: None of that submission; preserve prior confirmed state and the administrator's unsaved form input for retry.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Manage Real Categories (Priority: P1)

An active, verified administrator can create, rename, search, order, disable, and re-enable categories while seeing real work usage. This gives editors a stable vocabulary for assigning works.

**Why this priority**: Work classification and publication depend on trustworthy, manageable categories.

**Independent Test**: Create categories, change names/order/enablement, associate one with a work, reconnect, and verify the same identities, order, state, and usage counts without opening the work editor.

**Acceptance Scenarios**:

1. **Given** an authorized administrator and no categories, **When** they open category management and create a valid category, **Then** the saved category has a stable identity, immutable unique slug, enabled state, and position after existing categories; it remains after reload.
2. **Given** several categories, **When** the administrator searches by display name or slug and moves a category one place, **Then** the filtered result and authoritative order are accurate after reload, including ties or concurrent edits resolved as a conflict rather than a silently lost move.
3. **Given** a category assigned to works, **When** the administrator views its usage, **Then** the count equals the current number of distinct associated works, including draft and archived works, and changes when assignments change.
4. **Given** an in-use category whose disablement would leave a published work without an enabled category, **When** the administrator confirms disablement, **Then** the action is refused, the category and works remain unchanged, and the administrator is told to assign another enabled category first.
5. **Given** an in-use category whose associated published works retain another enabled category, **When** the administrator confirms disablement, **Then** associations remain, the category becomes disabled, and a later re-enable restores its eligibility without recreating it.
6. **Given** invalid, duplicate, missing, or stale category input, **When** a save is attempted, **Then** field feedback or a safe conflict is shown and no unintended category or order change is retained.

---

### User Story 2 - Save Complete Work Drafts (Priority: P1)

An active, verified administrator can create and edit illustrated or text work drafts with the approved editorial fields, selected categories, and real cover/background candidates. A saved work remains editable after reopening.

**Why this priority**: Durable drafts allow a team to prepare content without accidentally publishing it.

**Independent Test**: Create one illustrated and one text draft, edit metadata and media associations, reconnect as an administrator, and verify all saved fields, stable identity, and unchanged publication state without relying on the public catalog.

**Acceptance Scenarios**:

1. **Given** valid title, unique slug, canonical work type, and story status, **When** the administrator saves a new draft, **Then** one work with immutable identity/type/slug and persisted creation/update times is available after reload.
2. **Given** a saved draft, **When** the administrator edits its title, optional alternative title, synopsis, author, optional artist, tags, categories, cover, optional background, or featured preference, **Then** the confirmed values persist and the slug does not change with a later title edit.
3. **Given** enabled and disabled categories, **When** the administrator chooses categories, **Then** only enabled categories can be newly attached; an existing disabled association can be retained or removed during edit without silently disappearing.
4. **Given** an uploaded, available cover or background candidate, **When** the administrator selects it for the work and the work save succeeds, **Then** the selected image is associated with that work and remains previewable after reload; an upload alone is labelled only as an uploaded candidate.
5. **Given** a dirty editor or a recoverable save error, **When** fresh data arrives or the save fails, **Then** unsaved input is not silently overwritten, no saved-success message appears, and the administrator can review and retry.
6. **Given** a stale editor, duplicate slug, duplicate tag/category input, invalid text, invalid media class/state, or a changed work type/slug, **When** save is attempted, **Then** the request fails safely with no partial editorial change.

---

### User Story 3 - Publish and Recover Works Safely (Priority: P1)

An active, verified administrator can preview a draft, publish it only when its display metadata and media are ready, unpublish it, archive it, and restore it to draft. Public metadata visibility follows the confirmed state.

**Why this priority**: Publication is the boundary between private editorial work and visitor-visible metadata.

**Independent Test**: For an illustrated and a text work, attempt premature publication, complete the required fields, publish, unpublish, archive, restore, and inspect administrative and public metadata after each transition and reload.

**Acceptance Scenarios**:

1. **Given** a draft missing synopsis, author, an enabled category, or a saved available cover, **When** the administrator requests publication, **Then** publication is refused with actionable field feedback and the work remains a draft.
2. **Given** a complete draft with an available associated cover, **When** publication succeeds, **Then** exactly one transition is confirmed, its current publication time and retained history agree, and the existing public metadata boundary can find only the approved published projection.
3. **Given** a published work, **When** the administrator unpublishes or archives it, **Then** it is no longer returned by public metadata reads, while its identity, editorial fields, associations, media references, and publication history remain for administrators.
4. **Given** an archived work, **When** the administrator restores it, **Then** it returns to draft and requires a separate, freshly validated publish action before becoming public again.
5. **Given** an already completed target state, **When** the same transition is retried, **Then** the existing state is returned without another publication event or a false new-success claim.
6. **Given** stale or disallowed transition input, unavailable cover media, or a failure during a combined save-and-publish request, **When** the action resolves, **Then** none of that request's editorial changes, associations, media selection, publication state, or publication event persists; any previously confirmed work remains unchanged, no new work is created, and the unsaved form input remains available for review and retry.
7. **Given** a published work, **When** an edit would remove its last enabled category, required metadata, or available cover, **Then** the edit is refused until the administrator unpublishes or supplies a valid replacement; public state does not become incomplete.

---

### User Story 4 - Find and Review Saved Works (Priority: P2)

An active, verified administrator can browse all saved work states, search and filter them, open the intended record, and distinguish a genuine empty result from loading or failure.

**Why this priority**: Editorial operations become unreliable if the list still shows fixtures or hides drafts and archives.

**Independent Test**: Seed saved works with distinct titles, alternative titles, types, story/publication states, and dates; search, filter, sort, paginate, open one, and repeat after reload.

**Acceptance Scenarios**:

1. **Given** works in draft, published, and archived states, **When** the administrator opens the list, **Then** every authorized work is represented by saved values and the total reflects the same filtered result set as the pages.
2. **Given** a search and type, story-status, or publication-status filter, **When** the administrator changes any criterion, **Then** title/alternative-title matches and filters apply together, the first valid page is shown, and an unmatched result has a distinct filtered-empty message.
3. **Given** more works than one page, **When** the administrator changes page or supported sort, **Then** no work is duplicated or omitted within the same result state and ties have stable order.
4. **Given** an unavailable list or an unknown work identity, **When** a read fails, **Then** an Arabic recoverable-error/retry state or safe not-found state appears, without substituting sample records.
5. **Given** saved featured preferences on multiple works, **When** the administrator assigns an occupied active position or archives one work, **Then** a competing active position is rejected and the archived work is ineligible for featured placement while retaining its preference for review.

### Edge Cases

- A category with zero works may be disabled or re-enabled; neither operation deletes it. Boundary moves are no-ops. Repeated identical category state and ordering requests report the unchanged state without creating duplicate effects.
- An existing association to a disabled category remains countable and visible to administrators. Disabled categories are absent from public category projections and unavailable for new work assignments. A published work must retain at least one enabled category.
- A work draft may be incomplete, including no cover or category; publication cannot use that exception. Neither work type nor either slug can be changed after creation. Titles and display names may change without rewriting identity.
- Tags are distinct after normalization; a submitted duplicate is rejected. Category associations are unique. Simultaneous slug creation has one winner; the loser receives a safe conflict. Simultaneous edits/reorders/media replacements cannot silently overwrite each other.
- An uploaded image whose attachment fails remains an uploaded candidate, never a saved work cover. A removed/unavailable/wrong-class asset cannot become a work image. Replacing a work image leaves the old image valid while referenced elsewhere and does not expose a broken reference.
- A published work may have no chapters during P03. Existing public metadata eligibility remains defined by work state; chapter authoring and reader content are not inferred from that state.
- Any work already published before P03 must be inventoried against the new publication prerequisites. Before P03 acceptance, each such work either satisfies them or has been explicitly returned to draft for editorial remediation; identity, media, and publication history are retained.
- If authorization changes, a late successful response or retained admin data cannot restore management access. A failed, timed-out, or ambiguous mutation must be checked against authoritative state before retry or success is announced.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Only an authenticated, active, verified administrator may read or change category/work management data. A visitor, ordinary active/verified user, pending-verification user, suspended user, and a claimed role or owner supplied by the caller MUST gain no management authority; read and write checks MUST apply at the authoritative boundary.
- **FR-002**: A category MUST have stable identity, unique normalized immutable slug, bounded display name, enabled state, stable positive display position, creation/update times, and a concurrency revision. Category creation MUST append it after the current order and default to enabled.
- **FR-003**: Administrators MUST be able to list, search by display name or slug, rename, move within the category order, disable, and re-enable categories; all confirmed changes MUST survive reload. Search and order MUST use deterministic results, with distinct collection-empty and filtered-empty outcomes.
- **FR-004**: Category usage MUST count distinct currently associated works across publication states. A category MUST NOT be hard-deleted or merged in P03. Disabling it MUST preserve associations and MUST fail if it would leave any published associated work without an enabled category; in-use disablement requires an explicit confirmation.
- **FR-005**: Category slugs MUST remain immutable after creation; duplicate normalized slugs and stale or conflicting edits/moves MUST be rejected without partial changes. Repeating an already achieved state or order MUST leave the result unchanged.
- **FR-006**: A work MUST have stable identity, globally unique normalized immutable slug, immutable canonical type, title, story status, publication state, creation/update times, and a concurrency revision, retaining the P01 lifecycle and publication history.
- **FR-007**: P03 MUST persist optional alternative title, synopsis, author, optional artist, category assignments, distinct tags, saved cover, optional saved background, featured-home preference, and featured order. Title and alternative title MUST be at most 200 characters; author and artist at most 150; synopsis 20–5,000 characters when provided; at most 20 tags of at most 40 characters each. Drafts MAY lack publication-only fields. Input MUST reject unsupported fields and unsafe or excessive text.
- **FR-008**: A work MUST be assignable to at most 100 distinct categories. Only enabled categories may be newly assigned; previously assigned disabled categories MAY be retained or removed. Assignment and usage counts MUST agree after successful changes, including concurrent edits.
- **FR-009**: Work cover/background selections MUST refer to available, correctly classified administrator media. Upload, candidate selection, association with a work, and public delivery MUST be reported as distinct outcomes. Replacement or removal MUST not leave a saved work pointing at missing media or erase another active reference.
- **FR-010**: An administrator MUST be able to create, open, edit, and privately preview both illustrated and text work drafts. The preview MUST use saved identity and metadata for a saved work, label unsaved changes, and use the persisted slug rather than a title-derived or invented public address. It MUST not promise a live public page before the later catalog phase.
- **FR-011**: Publication MUST require a nonempty title, unique slug, valid type and story status, synopsis of at least 20 characters, nonempty author, at least one enabled category, and an associated available cover. Background, artist, alternative title, tags, featured preference, and chapters are optional. Validation MUST happen again at the authoritative boundary immediately before a transition. An edit or category change MUST not make a published work fail these prerequisites; existing published works MUST be inventoried and corrected or explicitly returned to draft before P03 acceptance.
- **FR-012**: Work transitions MUST follow draft → published, draft/published → archived, published → draft, and archived → draft; archived → published MUST be refused until restored. Repeating the current target MUST be idempotent. Each actual transition into published MUST retain one distinct publication event and current publication time; leaving published MUST clear the current time while retaining history.
- **FR-013**: Publishing MUST make only approved work metadata visible through the existing public metadata boundary. Draft/archived works and unpublished chapter data MUST remain undiscoverable there; direct reads MUST not disclose whether a private identity exists. Unpublishing and archiving MUST remove work metadata eligibility immediately after confirmed state change.
- **FR-014**: Featured-home preference and a positive order MUST be saved together when enabled. Active featured positions MUST be unique among currently published featured works; archived/draft works retain their editorial preference but are ineligible for public featured placement. Conflicting placement changes MUST fail safely. Rendering a home feature remains P05.
- **FR-015**: The administrative work list MUST support bounded search over title/alternative title, combined type/story/publication filters, stable sorting by updated time, oldest creation, title, and available chapter count, plus bounded pagination with accurate totals. List, detail, and usage summaries MUST reflect saved values rather than fixtures; unavailable metrics MUST not be invented.
- **FR-016**: Every changed command MUST validate bounded input, distinguish validation, duplicate, stale, forbidden, not-found, and unavailable outcomes, and preserve prior confirmed state on failure. A combined save-and-publish action MUST persist its submitted editorial changes, associations, media selection, publication state, and publication event together or none of them; on failure, no new work is created and unsaved form input remains available for review. Unknown or delayed outcomes MUST not be presented as saved or published; a safe refresh/check and retry MUST be available without creating duplicate records/events.
- **FR-017**: Connected category/work screens MUST replace their fixture and local mutation sources, including work/category reset-to-fixtures behavior, artificial save delay, and fabricated work activity, while leaving unrelated admin domains for later phases. No connected hard-delete control or sample-image cycling may remain.
- **FR-018**: User-visible management states MUST remain Arabic-first RTL and responsive, with semantic labels, keyboard-operable controls, visible focus, dialog focus management, understandable mixed-direction identifiers, accessible errors/status announcements, adequate contrast and targets, and reduced-motion behavior. Loading, empty, filtered-empty, pending, success, failure, retry, conflict, stale, denial, and recovery states MUST be distinct where relevant.
- **FR-019**: Administrative outputs MUST disclose only the fields needed for editorial work; public outputs MUST disclose only approved published metadata and eligible categories. Private drafts, archive metadata, internal identities beyond the approved projection, raw media locations, credentials, tokens, secrets, internal errors, and sensitive request data MUST be absent from visitor responses and user-visible failures. Management writes MUST retain existing session and request-forgery protections.
- **FR-020**: Changed behavior MUST have automated evidence for accepted/rejected input, persistence, uniqueness, authorization, privacy, transitions, order, pagination, stale/concurrent writes, rollback, media association, and frontend async/access states. The smallest real end-to-end acceptance journey MUST create a category, create one illustrated and one text draft, attach a real cover, publish, reload, unpublish, archive, and restore while verifying saved state and public metadata visibility.

### Key Entities _(include if feature involves data)_

- **Category**: Stable editorial classification with display name, immutable slug, enabled state, global order, usage count derived from distinct work associations, revision, and lifecycle timestamps. Disablement retains identity and assignments.
- **Work**: Stable illustrated or text title with immutable type/slug, editorial metadata, story and publication states, optional featured preference/order, revision, and lifecycle timestamps. Archive is retained state, not deletion.
- **Work–category association**: Unique membership connecting a work to a category; association survives category disablement and is counted once.
- **Tag**: Distinct bounded editorial label attached to one work. Tags do not create or replace categories.
- **Work media association**: Current cover and optional background selection tied to an available media asset of the correct class. A candidate upload without this association does not alter the work.
- **Publication event**: Retained identity and time for each real transition of a work into published state, separate from the work’s current publication time.

### Authority, Privacy, and State Truth _(mandatory when applicable)_

- **Actors and authority**: Visitors may read only the existing eligible public metadata; active, verified ordinary users have the same public content visibility and no editorial privilege. Active, verified administrators manage all categories and works; no per-work owner or moderator role is introduced. Pending, suspended, and unauthenticated accounts cannot cross the management boundary. The system process that persists/reconciles media or publication state has only its declared internal responsibility and cannot turn an unavailable asset into a public cover.
- **Sensitive and public data**: Administrative lists and previews are private to authorized administrators. Public projection excludes drafts/archives, disabled categories, unpublished chapter content, private media locations, account information, tokens, and internals. Public not-found behavior does not reveal private existence.
- **State and recovery**: Confirmed saves and transitions are durable; drafts and uploaded candidates are labelled according to their actual stage. Conflicts preserve the administrator’s unsaved input for review. Retries first reconcile ambiguous results, and duplicate actions converge to one state. A failed combined save-and-publish attempt leaves prior confirmed work unchanged, creates no new work, and retains the unsaved form input; it never produces a partial draft or falsely published work. Category and work hard deletion is unavailable; archived and disabled records remain recoverable.

## Acceptance Evidence _(mandatory)_

- **AE-001**: Contract and authoritative-boundary tests prove every accepted/rejected field, bounds, immutable identity, duplicate slug/tag/category handling, safe error, and exact public/admin projection for FR-001–FR-009 and FR-019.
- **AE-002**: Real persistent-data tests prove category order/usage, disable precondition, featured uniqueness, work metadata, media association, lifecycle/history, concurrent winners/losers, and all-or-nothing combined save-and-publish rollback after injected failure for FR-002–FR-014 and FR-016. Final stored state and retained references/events are asserted, not merely response status.
- **AE-003**: Real request-stack tests exercise visitor, ordinary user, pending, suspended, and administrator reads/writes, session/forgery checks, safe not-found, media class/state, duplicate/stale outcomes, and public privacy for FR-001, FR-009, FR-011–FR-013, FR-016, and FR-019.
- **AE-004**: Focused rendered-interaction tests cover category/work list, forms, dialogs, saved versus candidate media, loading/empty/filter/retry/conflict/denial states, dirty-draft preservation, and fixture-source removal for FR-003, FR-010, FR-015–FR-018.
- **AE-005**: A real-browser keyboard and narrow-screen pass verifies dialog focus return, labels/announcements, RTL mixed-direction text, responsive tables/forms, and the smallest end-to-end journey in FR-020. Browser/device behavior remains unverified until that pass is performed during implementation acceptance.
- **Unverified external/browser/device boundary**: This specification is based on source inspection; no P03 implementation or live browser/device acceptance is claimed here. Media backup/restore belongs to P02 and is a prerequisite, not repeated as a P03 feature.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In the acceptance journey, 2 of 2 work types and every created category retain the same identities, metadata, media associations, and intended state after a new session/reload.
- **SC-002**: Across the specified category changes, the displayed usage count and order match authoritative associations and positions in 100% of checked states, including disable/re-enable and concurrent-change cases.
- **SC-003**: In every tested invalid, duplicate, denied, stale, media-unavailable, or failed publication case, 0 unintended published works, category deletions, broken active media references, or duplicate publication events result; failed combined save-and-publish attempts retain 0 submitted editorial changes or newly created works.
- **SC-004**: For both illustrated and text works, all 5 requested states/actions—draft save, publish, unpublish, archive, and restore—produce the expected administrative state after reload, and public metadata contains the work only while published.
- **SC-005**: Every tested management route and operation denies all non-admin actor classes, and every checked public response contains 0 draft/archive records, disabled categories, private media locations, credentials, or internal error details.
- **SC-006**: The smallest real acceptance journey in FR-020 completes using saved category/work/media data and requires 0 fixture records, local-only work/category writes, sample-image cycles, or false saved-success messages.
- **SC-007**: For each affected screen, a keyboard-only administrator can complete its primary task and recover from one injected error at narrow and desktop widths, with visible focus and Arabic RTL feedback in every observed loading, empty, validation, conflict, success, and denial state.

## Assumptions

- The current P01 immutable slugs/type, publication-event history, and P02 media-class/reference rules remain binding. This phase extends the editorial fields and connections without changing those identities or introducing a new user role.
- Category disablement may preserve in-use associations. To keep the publication precondition true, disablement is refused only when it would leave a published work with no enabled category; the administrator can reassign first.
- Drafts may be incomplete so editorial work can be resumed. A work can be published without chapters because chapter authoring belongs to P04; current public metadata may reflect its published state before the P05 catalog UI exists.
- Category merge and all hard deletion are excluded from P03. Work featured placement is persisted for later use, but it does not activate the public home surface here.
- The synopsis minimum follows the current editor’s 20-character validation. Other stated editorial bounds and duplicate-tag behavior are safe P03 defaults and may be revised through an explicit product decision before plan acceptance.

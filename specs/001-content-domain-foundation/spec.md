# Feature Specification: Content Domain Foundation

**Feature Branch**: Not created (no branch hook configured)

**Created**: 2026-09-22

**Status**: Requirements accepted after owner-confirmed human review on 2026-09-27; P00/P01 phase-exit evidence remains separate.

**Input**: Roadmap phase P01 — Content Domain and Contract Foundation

**PLAN.md Phase**: P01 — Content Domain and Contract Foundation

## Scope and Current Reality _(mandatory)_

- **Dependencies and accepted gates**: P00 is the sole phase dependency and MUST be independently accepted before P01 implementation is accepted. The current checkout does not itself prove that gate complete.
- **Executable baseline**: Persistent behavior is limited to accounts, sessions, and health. No content-domain records, content operations, or authoritative public content queries exist. Existing shared contracts cover account and generic response concerns only.
- **Behavior and user changes to preserve**: The stable account lifecycle, active-and-verified account checks, role enforcement, session refresh, CSRF protection, safe return paths, request identifiers, rate limits, safe errors, and log redaction remain unchanged. Existing approved Arabic-first RTL presentation and route structure remain unchanged because P01 owns no full UI route.
- **Fixture, local-only, or placeholder sources affected**: Current work, category, chapter, page, and text-story displays and admin actions are fixture-backed or component-context state. They are not authoritative or persistent. P01 replaces duplicated domain vocabularies only in contract-bound values and test builders and establishes persistent slugs and identities; it does not connect those screens, change their rendered Arabic labels, fixture content, controls, routes, or mock interaction behavior, or convert their local actions into confirmed product behavior.
- **Explicit exclusions**: Alternative title, synopsis, author, artist, tags, cover/background media, featured placement, media upload or delivery, category/work/chapter admin screen integration, public catalog or detail screen integration, the reader, bookmarks, ratings, progress, comments, notifications, gifts, support, advertising, moderation features, and any later-phase data model or workflow are excluded.
- **Phase exit gate**: P01 is complete only when the exact approved content inventory, upgrade-safe persistence, enforced invariants, authority and public-visibility rules, shared contracts, documented operations, and meaningful automated evidence agree. Work stops at the P01 review gate.

## Clarifications

### Session 2026-09-22

- Q: How should chapter publication state behave when its parent work is not published? → A: Work and chapter lifecycle states remain independent; a published chapter under a draft or archived work remains publicly hidden until both are published.
- Q: What identity and uniqueness must a Category have in P01? → A: Each Category has an immutable system identity, unique normalized persistent slug, and bounded display name; enablement and display ordering remain P03.
- Q: Can persistent Work and Category slugs change after creation? → A: Work and Category slugs are immutable after creation; later title or display-name edits do not change them.
- Q: What does the current publication timestamp mean outside published state? → A: It exists only while currently published; unpublish or archive clears it, while immutable publication history retains every prior publication time.
- Q: What Work metadata is P01 responsible for persisting before P03? → A: P01 owns bounded title, immutable slug, work type, story status, publication state, relationships, and lifecycle timestamps; richer editorial and media fields remain later-phase scope.
- Q: What happens when an administrator repeats an existing Work–Category assignment? → A: An exact repeat returns idempotent success with the unchanged association; duplicate category identifiers within one submitted assignment set are rejected as validation errors.
- Q: May a Work's canonical type change after creation? → A: No. Work type is immutable after creation; an attempted change returns a stable conflict with no state change.
- Q: How should P01 treat an illustrated chapter with no page records? → A: A draft may initially have no pages, but every submitted page sequence and every transition to published must contain at least one page.
- Q: How should publication-event persistence be covered across the user stories? → A: User Story 1 proves Work, Category, WorkCategory, Chapter, and ChapterPage; User Story 2 proves Publication Event through actual publish transitions; aggregate phase evidence covers all six.
- Q: What may change in existing fixture-backed screens when P01 aligns frontend content type names? → A: Only internal contract-bound values and test builders; rendered Arabic labels, fixture content, controls, routes, and mock interaction behavior remain unchanged.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Establish Authoritative Content Records (Priority: P1)

An active, verified administrator can establish the canonical content foundation for works, categories, category assignments, chapters, and illustrated chapter-page order so later delivery phases build on durable facts rather than fixtures.

**Why this priority**: Every later content journey depends on stable identity and integrity. Without this foundation, UI actions can appear successful while losing data or creating contradictory records.

**Independent Test**: Create valid Work, Category, WorkCategory, Chapter, and ChapterPage records, restart the serving process, and verify the same identities, relationships, values, and ordering remain available through the authorized management boundary. Publication Event is exercised only by User Story 2.

**Acceptance Scenarios**:

1. **Given** an active, verified administrator and no matching work, **When** the administrator creates a work with a bounded title, canonical type, story status, unique slug, and draft publication state, **Then** one durable work with an immutable identity is available after restart.
2. **Given** no matching category, **When** the administrator creates one with a bounded display name and unique normalized slug and assigns it to an existing work, **Then** the category has an immutable identity, the relationship exists at most once, and a repeated identical assignment returns the unchanged relationship as an idempotent success.
3. **Given** an existing work, **When** the administrator creates chapters numbered `1` and `2`, **Then** both persist in ascending chapter-number order and the same number cannot be reused within that work.
4. **Given** an illustrated chapter, **When** ordered page records are established, **Then** each positive position is unique within that chapter and the sequence is returned in ascending position order.
5. **Given** malformed, unbounded, unsupported, fractional, zero, negative, or extra input, **When** it crosses a P01 boundary, **Then** it is rejected with safe field-level feedback and no partial record is retained.
6. **Given** an existing work, **When** an administrator attempts to change its canonical work type, **Then** the request returns a stable conflict and the work and its chapters remain unchanged.

---

### User Story 2 - Control Publication Without Leakage (Priority: P1)

An active, verified administrator can publish, unpublish, archive, and restore works and chapters while public visitors and signed-in users see only content that is currently eligible for public discovery.

**Why this priority**: Publication is the authority boundary between editorial data and public truth. Draft or archived leakage would expose unapproved content and make later screens unsafe to connect.

**Independent Test**: Move a work and chapter through every allowed publication transition, query as each actor class, retry transitions, restart or reconnect, and verify public visibility, current timestamps, retained history, and durable event identity after each step.

**Acceptance Scenarios**:

1. **Given** a draft work and draft chapter, **When** an active, verified administrator publishes them, **Then** each becomes published with a current publication time and each actual transition into published state has one durable event identity.
2. **Given** a published work and chapter, **When** a public visitor or authenticated user queries public content, **Then** only the approved public projection is returned.
3. **Given** draft or archived content, **When** any public actor queries by list or direct identifier, **Then** the content is absent without revealing whether a private record exists.
4. **Given** an already completed target transition, **When** the same command is retried, **Then** the result is idempotent, no duplicate record or publication event is created, and no false new transition is reported.
5. **Given** archived content, **When** an administrator restores it, **Then** it returns to draft and remains non-public until explicitly published again.
6. **Given** a published chapter under a published work, **When** the work is unpublished or archived, **Then** the chapter retains its own published state but becomes publicly hidden; republishing the work restores eligibility only for chapters still published.

---

### User Story 3 - Preserve Chapter Content Integrity (Priority: P2)

An active, verified administrator can establish either illustrated or structured-text chapter content whose form agrees with the content type derived from its parent work, without P01 pretending that media upload or a reader already exists.

**Why this priority**: Both approved content modes need a trustworthy foundation, but their editing, upload, and reading experiences belong to later phases.

**Independent Test**: Submit valid and invalid illustrated and text chapter representations and verify type compatibility, ordering, bounded validation, rollback, and safe projections without using any later-phase UI.

**Acceptance Scenarios**:

1. **Given** a `novel` or `text-story` work, **When** an administrator supplies a supported bounded structured representation for a chapter, **Then** it is retained as text content without accepting unknown or executable content.
2. **Given** a `manga`, `manhwa`, `manhua`, or `comics` work, **When** an administrator establishes a chapter page sequence, **Then** only ordered illustrated-page metadata is accepted; media upload and delivery are not claimed.
3. **Given** content or a submitted content-type override that contradicts the parent work type, **When** it is submitted, **Then** the request is rejected and the prior chapter remains unchanged.
4. **Given** a multi-part chapter change, **When** any required part fails validation or persistence, **Then** none of the change is reported or retained as successful.
5. **Given** an illustrated draft chapter with no pages, **When** an administrator submits an empty page sequence or attempts to publish it, **Then** the request is rejected and the chapter remains an unpublished draft; a submitted nonempty valid sequence can make it eligible for a later publish transition.

---

### User Story 4 - Share One Canonical Content Language (Priority: P3)

Product consumers can rely on one bounded content vocabulary and one description of every P01 operation, avoiding the current fixture-era naming and shape drift.

**Why this priority**: A single contract prevents the API, future screens, documentation, and tests from assigning different meanings to the same content.

**Independent Test**: Validate representative accepted and rejected requests and outputs through producer, consumer, documentation, and integration boundaries, including every enum value and stable error outcome.

**Acceptance Scenarios**:

1. **Given** current competing fixture terms, **When** P01 contracts are adopted at integration boundaries, **Then** `text-story` replaces `short-story` and `comics` replaces `comic` only in contract-bound values and test builders, without connecting full screens or changing rendered Arabic labels, fixture content, controls, routes, or mock interaction behavior.
2. **Given** any P01 operation, **When** its method, route, authority, input, output, success status, or stable error code changes, **Then** producer behavior, consumer validation, operation documentation, and contract evidence change together or the phase gate fails.
3. **Given** a valid persistent record containing internal fields, **When** it is returned through a content boundary, **Then** only the explicitly approved public or administrative projection is present.

### Edge Cases

- A slug that differs from an existing work or category slug of the same kind only by canonical normalization conflicts with that record; it does not create a second public identity. Once created, a work or category slug cannot be changed by update or inferred again from a changed title or display name.
- The same positive chapter number may exist in different works, but never twice within one work. Fractional, zero, negative, unsafe, or out-of-range values are rejected.
- The same positive page position may exist in different illustrated chapters, but never twice within one chapter. Gaps are allowed; returned order is always ascending.
- An illustrated draft may initially contain no page records, but an explicitly submitted page sequence cannot be empty and an illustrated chapter cannot transition to published until at least one valid page exists.
- A Work's canonical type cannot change after creation. An attempted change conflicts and leaves the Work and all related chapters unchanged.
- An empty valid query returns an empty collection with valid pagination facts, not an error, a fixture fallback, or a loading placeholder.
- Page and limit values outside the existing bounded pagination policy are rejected; a request beyond the last page returns an empty collection without changing the requested page.
- A chapter marked published beneath a non-published work remains absent from every public query. Unpublishing or archiving the parent does not rewrite child states; publishing the parent restores eligibility only for children already published and never publishes a draft child.
- Concurrent identical publish commands produce one actual state transition and one publication event. Concurrent incompatible transitions produce one authoritative winner; stale losers receive a conflict and do not overwrite newer state.
- A duplicate identity, slug, chapter number, or page position fails as a conflict with no partial write. Repeating an already-existing Work–Category assignment is an idempotent success that returns the unchanged relationship, while duplicate category identifiers within one submitted assignment set fail validation with no partial write. Retrying after the client learns the authoritative state is safe.
- Unknown failures return a stable safe error and request identifier, retain the last committed state, and can be retried; they never return a false success or internal details.
- Missing, pending-verification, suspended, non-admin, owner-only, and hypothetical moderator identities have no P01 management authority. Denial cannot be bypassed with submitted role or ownership fields.
- Missing, invalid, suspended, or unverified authentication receives a safe authentication failure before content lookup; an active verified non-admin receives the same forbidden result whether or not the target exists; an authorized ADMIN receives not-found for a missing target; and public missing, draft, or archived direct reads share the same not-found result.
- Archiving is retention, not deletion. Repeated archive, unpublish, or restore requests are idempotent; restored content is draft and is not made public automatically.
- Current publication time is present if and only if the record is published. Unpublish, archive, and restore leave prior times only in immutable publication history, never in the current-state field.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: P01 MUST establish durable identities and lifecycle data only for Work, Category, WorkCategory, Chapter, ChapterPage, and publication events required by this phase.
- **FR-002**: Every Work MUST have an immutable identity, bounded nonblank title, immutable unique canonical slug, one immutable canonical work type, one story status, one publication state, relationships, and lifecycle timestamps. Later title changes MUST NOT alter the slug. An attempted work-type change MUST return a stable conflict and leave the Work and related chapters unchanged.
- **FR-003**: Canonical work types MUST be `manga`, `manhwa`, `manhua`, `comics`, `novel`, and `text-story`. `comic` and `short-story` MUST be rejected at authoritative P01 boundaries rather than silently reinterpreted.
- **FR-004**: Story status MUST be one of ongoing, completed, hiatus, or cancelled; publication state MUST be one of draft, published, or archived; chapter content type MUST be illustrated or text.
- **FR-005**: Inputs MUST define required presence, omission, nullability, normalization, and bounded size, and MUST reject unsupported fields where they could alter authority or persisted meaning.
- **FR-006**: Work slugs and Category slugs MUST each be immutable after creation and unique within their own kind after canonical normalization. A duplicate or attempted slug change MUST return a stable conflict without revealing unrelated private content.
- **FR-007**: Each WorkCategory relationship MUST identify exactly one existing work and category and MUST be unique for that pair. Repeating an already-existing assignment MUST return idempotent success with the unchanged relationship; duplicate category identifiers within one submitted assignment set MUST be rejected as validation errors with no partial change.
- **FR-008**: Each Chapter MUST belong to exactly one work and have a positive integer number unique within that work.
- **FR-009**: Each ChapterPage MUST belong to exactly one illustrated chapter, have a positive integer position unique within that chapter, and be returned in ascending position order. An illustrated draft MAY initially have no pages, but every submitted page sequence MUST contain at least one page and an illustrated chapter MUST have at least one valid page before it can transition to published.
- **FR-010**: A text chapter MUST contain a bounded, structurally validated representation; unknown, malformed, mismatched, or executable content MUST be rejected. The representation format and accepted element vocabulary are a P01 planning decision, not a later editor implementation.
- **FR-011**: Illustrated chapter records in P01 MUST establish ordered page metadata only. They MUST NOT claim media upload, validation, storage, or delivery behavior owned by P02 and P04.
- **FR-012**: Chapter content type MUST be derived from its parent Work: `manga`, `manhwa`, `manhua`, and `comics` are illustrated, while `novel` and `text-story` are text. A submitted override or mismatched content MUST be rejected, and a failed create or update MUST leave all previously committed content and ordering unchanged.
- **FR-013**: P01 list operations MUST use the existing bounded page-and-limit policy, return complete pagination facts, apply identical eligibility filters to items and totals, and use deterministic ordering with a stable tie-breaker.
- **FR-014**: Chapter lists MUST default to ascending chapter number; illustrated pages MUST always use ascending page position. Any additional P01 list order MUST be explicitly stable in the shared contract.
- **FR-015**: Public content reads MUST be credential-free, MUST NOT consume ambient session authority or require CSRF, and MUST return only eligible published projections. Draft and archived works or chapters MUST be absent from lists, totals, direct reads, and relationship expansion.
- **FR-016**: Work and chapter publication states MUST remain independent. A chapter MUST be publicly eligible only when both it and its parent work are published; changing the parent state MUST NOT change any chapter state, and restoring parent eligibility MUST expose only chapters that are already published.
- **FR-017**: Public visitors and authenticated users MUST have the same metadata-only P01 public-content visibility. Public P01 projections MUST NOT expose chapter body or page content, and P01 MUST NOT introduce reader access, ownership access, or personalized content behavior.
- **FR-018**: Every P01 management read and mutation MUST require a currently active, email-verified ADMIN account. Browser guards, submitted roles, submitted owners, and fixture roles MUST NOT grant authority.
- **FR-019**: A USER, suspended or unverified account, resource owner without ADMIN role, hypothetical moderator, anonymous actor, or invalid session MUST be denied every management operation without state change. The current role vocabulary MUST remain USER and ADMIN; P01 MUST NOT invent a moderator role.
- **FR-020**: Unsafe authenticated requests MUST preserve the established CSRF protections and rate-limit behavior where those controls apply. Existing authentication, refresh rotation, cookie, in-memory token, safe return-path, request-ID, safe-error, and log-redaction behavior MUST NOT regress.
- **FR-021**: P01 outputs MUST use explicit public and administrative allowlists and MUST NOT expose credential data, account-private data, raw persistence records, storage paths, provider details, internal metadata, or publication bookkeeping not approved by the relevant projection.
- **FR-022**: Every actual transition into published state MUST set the current publication time and record that time in immutable publication history with a durable unique publication-event identity. A retry that observes the already-completed transition MUST reuse the authoritative result and MUST NOT create another event.
- **FR-023**: Current publication time MUST be present if and only if the record is published. Unpublishing MUST move published content to draft and clear that field; archiving MUST clear it and make content non-public without hard deletion; restoring MUST move archived content to draft with no current publication time and require a later explicit publish action.
- **FR-024**: Historical publication events MUST remain immutable when content is edited, unpublished, archived, restored, or republished. A later real transition into published state MUST receive a new event identity.
- **FR-025**: Publication commands MUST be race-safe. Concurrent identical commands MUST converge on one result; concurrent incompatible or stale commands MUST NOT silently overwrite a newer state and MUST return a stable conflict outcome to losers.
- **FR-026**: Each multi-record content operation MUST either commit all required state and history together or leave all of it unchanged. No external side effect is part of P01 success.
- **FR-027**: P01 MUST NOT provide hard-delete behavior for works, categories, chapters, or publication history. Association or page-sequence replacement MUST affect only the current relationship or ordering and MUST NOT delete a related work, category, or external media.
- **FR-028**: One shared browser-safe contract MUST own every P01 request, parameter, query, response, error, pagination, and enum representation consumed across product boundaries.
- **FR-029**: Each implemented P01 operation MUST have one agreed method, path, authority rule, input, output, success status, and stable error-code set across runtime behavior, operation documentation, producer tests, and consumer tests.
- **FR-030**: Missing, invalid, suspended, or unverified authentication MUST return the established authentication failure before content lookup. An active verified non-admin MUST receive the same forbidden outcome regardless of target existence. An authorized ADMIN MUST receive not-found for a missing target. A public direct read MUST return the same not-found outcome for missing, draft, and archived content so private existence is not disclosed.
- **FR-031**: The canonical contract-derived domain vocabulary MUST replace duplicated frontend-only content type names only in contract-bound values and test builders. Existing fixture-backed screens and local actions MUST remain explicitly non-authoritative until their owning later phases connect them, and their rendered Arabic labels, fixture content, controls, routes, and mock interaction behavior MUST NOT change in P01.
- **FR-032**: P01 MUST preserve the existing Arabic-first RTL layout, route structure, responsive behavior, keyboard operation, focus visibility, labels, error communication, reduced-motion behavior, and fixture-era interaction behavior for any user-visible surface touched by boundary alignment. It MUST NOT introduce a new full screen, alter rendered presentation, or claim fixture feedback as server confirmation.
- **FR-033**: Failures MUST be truthful and retryable where safe: no rejected, conflicted, rolled-back, queued, or merely acknowledged operation may be presented as committed success, and safe errors MUST include a request identifier without secrets or internal diagnostics.
- **FR-034**: P01 completion MUST include meaningful automated coverage for positive, negative, boundary, validation, authority, privacy, lifecycle, duplicate, stale, concurrent, rollback, upgrade, and regression behavior, plus the smallest real journey in AE-008.

### Key Entities _(include if feature involves data)_

- **Work**: A durable content record with a bounded nonblank title, immutable identity, slug, and canonical type, story status, publication lifecycle and timestamps, and category/chapter relationships. Alternative title, synopsis, creators, tags, media, and featured placement are not P01 attributes. Later title changes do not change its slug, and the canonical type cannot change after creation.
- **Category**: A durable classification with an immutable system identity and normalized slug plus a bounded display name used to group works. Later display-name changes do not change its slug. Enablement, display ordering, administration, and presentation behavior belong to P03.
- **WorkCategory**: The unique association between one work and one category; it cannot exist without both and carries no independent public truth beyond that relationship.
- **Chapter**: A numbered unit belonging to one work, with content type derived from the parent Work, publication lifecycle, and either validated structured text or an ordered illustrated-page sequence consistent with that derived type. An illustrated draft may initially be empty, but it is not publishable until it has at least one valid page.
- **ChapterPage**: One ordered position within an illustrated chapter. P01 owns identity and order integrity, while media ownership, upload, and delivery are deferred.
- **Publication Event**: Immutable evidence of one actual transition of one publishable entity into published state, with a durable identity and occurrence time that remains after current publication time is cleared. P01 does not dispatch notifications or external work.

### Authority, Privacy, and State Truth _(mandatory when applicable)_

- **Actors and server authority**: Public visitors and authenticated users receive only the same credential-free public projection; public reads do not consume session authority or require CSRF. Only an authenticated, active, verified ADMIN can use P01 management operations. An owner relationship conveys no P01 authority; no moderator role exists. A future system process may consume publication-event identities, but P01 neither starts that process nor grants it broader access.
- **Sensitive data and public projection**: Public and administrative outputs are separate explicit projections. Neither may expose credentials, account-private fields, raw records, storage details, provider data, internal diagnostics, or private publication bookkeeping. Public denial does not confirm private existence.
- **State semantics**: Empty is a successful zero-result collection, not loading. Pending work is not success. Validation and denial make no change. Conflicts preserve the authoritative newer state. Duplicate target-state commands are idempotent. Failed multi-record work rolls back. Unknown failures are safe and retryable without implying absence. History remains immutable, and public truth changes only after a committed eligible publication transition.

## Acceptance Evidence _(mandatory)_

- **AE-001**: Contract evidence MUST exercise every canonical enum, required/optional/null rule, bound, normalization rule, unsupported field, pagination boundary, accepted representation, rejected legacy term, safe output, and stable error outcome.
- **AE-002**: Fresh-start and populated-upgrade evidence MUST verify the exact P01 entity inventory and preserved account/session history without rewriting prior history. Direct constraint evidence MUST reject duplicate normalized work or category slugs, duplicate work-category pairs, duplicate chapter numbers per work, duplicate page positions per chapter, fractional/non-positive numbers, broken relationships, and inconsistent publication facts.
- **AE-003**: Persistence evidence MUST create valid work, category, association, chapter, page-order, and text-content records through User Story 1 and MUST produce publication-event records only through the actual publication transitions in User Story 2. After restart or reconnect, it MUST verify identities, relationships, values, history, and ordering remain intact across all six P01 entity types.
- **AE-004**: Authority evidence through the complete HTTP security boundary MUST cover anonymous, USER, ADMIN, suspended, unverified, stale-session, submitted-role, and missing-CSRF cases against both existing and missing targets. It MUST prove authentication failures occur before lookup, non-admin results do not vary with target existence, only the active verified ADMIN case may change management state, and every denied case leaves state unchanged.
- **AE-005**: Public-query evidence MUST exercise lists, counts, direct reads, relationship expansion, and parent/child publication combinations. Zero draft or archived records may appear, and direct reads of missing, draft, and archived content MUST produce the same safe not-found outcome.
- **AE-006**: Lifecycle and concurrency evidence MUST cover publish, rejection of an empty illustrated sequence and empty illustrated-chapter publication, repeated publish, unpublish, archive, repeated archive, restore, republish, stale commands, simultaneous identical commands, and simultaneous incompatible commands. It MUST inspect final state and immutable event history, proving one event per actual publish transition and no lost newer state.
- **AE-007**: Rollback evidence MUST force a real failure after an earlier dependent write in a multi-record operation and verify that no partial content, relationship, ordering, publication time, or event remains.
- **AE-008**: The smallest real end-to-end acceptance journey MUST authenticate an active verified ADMIN, create a category, a `text-story` work, and a positive-numbered structured-text chapter; publish the eligible content; verify a public visitor sees only the approved projection; then unpublish or archive it and verify the same public path no longer reveals it. The journey MUST use the real request, authority, persistence, and response boundaries rather than fixture data or mocked success.
- **AE-009**: Producer/consumer agreement evidence MUST prove that every implemented operation's method, path, authority, inputs, outputs, statuses, and stable error codes match the shared contract and published operation description.
- **AE-010**: Regression evidence MUST prove existing account/session security behavior remains stable and that any touched fixture-backed Arabic RTL surface retains its rendered labels and content, controls, routes, mock interaction behavior, approved semantics, keyboard access, focus behavior, responsive layout, and truthful non-authoritative status.
- **Unverified external/browser/device boundary**: No external provider, media flow, or full browser content journey is part of P01. Browser/device evidence is required only if boundary alignment changes rendered behavior; otherwise its omission is explicit and does not imply later-phase UI readiness.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of all six P01 entity types, including publication events, created in the acceptance matrix retain the same identities, relationships, values, and required order after reconnect or restart.
- **SC-002**: 100% of specified duplicate identities, slugs, within-request category identifiers, chapter numbers, page positions, invalid numbers, empty submitted illustrated sequences, attempts to publish an empty illustrated chapter, broken relationships, attempted work-type changes, malformed or mismatched content, and inconsistent-publication cases are rejected with zero partial state retained; 100% of repeated existing Work–Category assignments return the unchanged relationship without creating a duplicate.
- **SC-003**: Across every public list, count, direct-read, and relationship-expansion case in the visibility matrix, zero draft or archived works or chapters are returned.
- **SC-004**: Across every management operation, 100% of anonymous, non-admin, suspended, unverified, stale-session, and forged-authority attempts are denied with no persisted change; 100% of active verified ADMIN cases reach domain validation.
- **SC-005**: For every concurrent publication scenario in the acceptance matrix, exactly one authoritative final state remains, each actual publish transition has exactly one event identity, and zero stale losers overwrite newer state.
- **SC-006**: 100% of implemented P01 operations agree across shared contract, producer, consumer, operation documentation, and integration evidence on method, path, authority, input, output, success status, and stable error codes.
- **SC-007**: The smallest real end-to-end journey in AE-008 completes without fixture-backed data, false success, leaked internal fields, hard deletion, or behavior from a later roadmap phase.
- **SC-008**: P01 introduces zero new full UI routes and zero regressions in the approved Arabic-first RTL, authentication, session, CSRF, safe-error, request-ID, rate-limit, or redaction behaviors covered by the existing relevant regression suites.

## Assumptions

- P00 is a hard prerequisite. Acceptance of this specification's written requirements does not claim P00's phase exit has passed; P01 phase readiness remains evidence-gated.
- The canonical work vocabulary follows the approved admin-facing terms already closest to the roadmap: `comics` and `text-story` supersede `comic` and `short-story` in contract-bound values and test builders only; rendered fixture-backed presentation remains unchanged in P01.
- Restore is deliberately safe: archived works and chapters return to draft rather than automatically regaining public visibility.
- Page-position gaps are allowed because P01 requires unique positive ordering, not contiguous renumbering. Media binding is deferred to its owning phases.
- The exact bounded structured-text representation is selected during P01 planning, as the roadmap directs. This phase requires validation and safety but does not pull the later editor or reader vocabulary forward.
- Category enablement, display ordering, administration screens, and presentation behavior remain P03 scope. P01 establishes the immutable identity, bounded display name, unique normalized slug, and relationships required by the content foundation.
- No owner or moderator management authority is introduced. The existing active, verified ADMIN boundary is the only content-management authority for P01.
- Existing fixture data remains presentation/test material until its owning integration phase. It is never migration input or proof of P01 behavior.
- P03 owns richer Work editorial metadata and management integration; P02 and later media-using phases own media identity and presentation. P01 does not reserve empty fields for those later capabilities.

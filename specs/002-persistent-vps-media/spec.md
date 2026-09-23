# Feature Specification: Persistent VPS Media Platform

**Feature Branch**: Not created (no branch hook configured)

**Created**: 2026-09-23

**Status**: Draft

**Input**: Roadmap phase P02 — Persistent VPS Media Platform

**PLAN.md Phase**: P02 — Persistent VPS Media Platform

## Scope and Current Reality _(mandatory)_

- **Dependencies and accepted gates**: P01 is the declared dependency; P00 is inherited through P01. P01 content identities, publication rules, and ordered illustrated page positions exist in the checkout, but this inspection does not certify either prior phase's formal exit gate. P02 acceptance requires those gates to be confirmed.
- **Executable baseline**: The current server exposes authentication, account, health, and P01 content operations. Content records persist, but work covers/backgrounds and chapter pages have no stored media identity or file delivery. There is no media upload, lookup, replacement, or removal boundary. Existing authenticated session, active/verified status, administrative role, CSRF, safe errors, rate limits, and request logging form the authority baseline.
- **Behavior and user changes to preserve**: Preserve the approved Arabic-first RTL appearance and the current work cover/background preview, illustrated-page order and preview, avatar selection preview, and gift design preview patterns. Preserve stable authentication and account behavior, public publication privacy, and admin guard presentation. Existing preview and reordering interactions remain useful but do not by themselves prove a saved media asset or a saved parent record.
- **Fixture, local-only, or placeholder sources affected**: Work media controls currently cycle sample image URLs; illustrated-page controls insert and replace random sample images in local form state; the avatar picker validates a claimed file type and size in the browser and shows a temporary object URL; gift designs and previews use fixture color/tone data. P02 replaces these image-selection assumptions with genuine upload, validation, progress, retry, and durable media-identifier feedback in the affected media controls. The broader work, chapter, gift, and appearance records remain owned by their later phases; their fixture-backed create/edit, grant, publish, and selection actions do not become persistent merely because an asset uploads.
- **Explicit exclusions**: Category/work administration, chapter authoring and publishing, public catalog integration, reader access, gift design/grant workflows, avatar profile/appearance binding, and their local record stores remain P03, P04, P05/P07, and P10 scope. ZIP imports, scraping, external media libraries, GIF gifts, and images embedded in text chapters are excluded. No public or protected chapter content is exposed early through a media address.
- **Phase exit gate**: All six declared media classes have positive and negative upload evidence; invalid type/content, oversize/dimension, executable, and path attempts fail; authorized assets survive restart and release replacement; unauthorized operations fail; active references remain safe across replacement/removal; and a documented restore exercise recovers asset records and files together. Work stops at P02 review.

## Clarifications

### Session 2026-09-23

- Q: For a P02 media asset with an active reference, should an authorized removal request be refused until references end, or accepted as deferred deletion? → A: Refuse removal while referenced; the actor may retry after references end.
- Q: After an interrupted upload lacks a complete validated file, should recovery reject that attempt and require a new key for another upload? → A: Yes. Reconciliation makes that attempt rejected; the same key cannot start another upload. A complete validated file may be accepted under the original key only after its bytes and identity are verified.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Save and Retrieve a Valid Asset (Priority: P1)

An active, verified administrator uploads a work cover or background, illustrated chapter page, avatar frame, or comment decoration and receives a durable identity and a preview that can be retrieved after restart. This gives later editorial phases a real media source instead of a sample URL.

**Why this priority**: Durable, validated asset identity is the foundation for every other P02 behavior and every later media-backed workflow.

**Independent Test**: For each administrator-owned class, upload one valid image, retrieve it through its permitted media view, restart the application, and verify the same identity, decoded image, class, and access policy remain. This requires no later work, chapter, or gift screen to save its parent record.

**Acceptance Scenarios**:

1. **Given** an active, verified administrator selects a valid image for one of the five administrator-owned classes, **When** the upload completes, **Then** exactly one durable asset identity is returned and the image can be retrieved by that administrator after restart.
2. **Given** a selected image is still transferring or being validated, **When** the administrator views the media control, **Then** it reports pending progress and does not claim the asset is saved.
3. **Given** a successful upload without a saved parent record, **When** the control displays the result, **Then** it identifies the asset as uploaded but does not claim that a work, chapter, gift, or publication was saved.
4. **Given** an empty media collection or an unavailable media service, **When** the authorized administrator opens the affected media control, **Then** it shows a distinct empty or recoverable error state with an actionable retry and no fabricated image.
5. **Given** an upload attempt interrupted before a complete validated file exists, **When** reconciliation finishes, **Then** that actor can read its rejected outcome, the same key cannot create an asset, and a new key can begin a new upload.
6. **Given** two authorized accounts use the same attempt key, **When** each uploads an otherwise valid asset, **Then** each sees only its own independent outcome and neither learns whether the other account used that key.

---

### User Story 2 - Upload an Own Avatar Safely (Priority: P1)

An active, verified user can upload, preview, and later retrieve an avatar candidate belonging to that account. The existing local preview remains useful, but completed upload feedback reflects a durable asset rather than a temporary browser image.

**Why this priority**: Avatar media has a different owner and privacy boundary from editorial media and must be proven independently.

**Independent Test**: Upload an avatar as one active, verified user, reconnect, confirm its identity and permitted preview, then attempt to view or change it as a visitor and a second user. No appearance-selection or profile-binding feature is needed.

**Acceptance Scenarios**:

1. **Given** an active, verified user selects a valid avatar image, **When** upload succeeds, **Then** the user sees a saved asset identity and can retrieve that own asset in a new session.
2. **Given** only a temporary local preview, **When** upload fails or is cancelled, **Then** the preview is not presented as saved and the user can retry without losing the selected candidate unnecessarily.
3. **Given** a visitor, pending-verification or suspended account, or a different signed-in user, **When** they attempt avatar upload, lookup, replacement, or removal for the first user, **Then** no asset is changed or disclosed.

---

### User Story 3 - Reject Unsafe or Misclassified Media (Priority: P1)

An uploader receives clear, safe validation feedback when an image is unsupported, corrupt, deceptive, excessive, or unsuitable for its declared class. A malicious request cannot turn a media operation into a file read, executable delivery, or access bypass.

**Why this priority**: Every accepted upload creates a durable file that later screens may render, so validation and access must precede success.

**Independent Test**: Exercise each class with valid and invalid payloads through the real authority boundary, then verify rejected uploads create neither a usable identifier nor a retrievable file.

**Acceptance Scenarios**:

1. **Given** a file whose extension, declared type, and decoded content disagree, **When** it is uploaded, **Then** the request is rejected without creating a usable asset or exposing parser details.
2. **Given** a malformed, executable, unsupported, oversized, or dimension-invalid payload, **When** it is uploaded, **Then** the request fails safely and leaves no publicly retrievable partial file.
3. **Given** an avatar-frame or comment-decoration candidate without genuine transparency in a supported transparent format, **When** it is uploaded, **Then** it is rejected with class-specific feedback.
4. **Given** a supplied name, path, identifier, or alternate authority hint containing traversal or another user's target, **When** an upload or media lookup occurs, **Then** it cannot select a storage location or cross an ownership boundary.

---

### User Story 4 - Replace and Remove Without Breaking References (Priority: P2)

An authorized owner or administrator can replace or remove an asset when its current uses allow it. Active references continue to resolve to valid media, and concurrent or repeated requests cannot silently remove another actor's change.

**Why this priority**: Safe lifecycle management prevents later work, chapter, avatar, and gift records from pointing to missing files.

**Independent Test**: Establish an active authorized reference, attempt removal, replace it with a valid new asset, and verify both the surviving reference and final file/identity state after restart and concurrent retries.

**Acceptance Scenarios**:

1. **Given** an asset with an active reference, **When** an authorized actor requests physical removal, **Then** removal is refused with a truthful conflict result, no deletion is queued, and the active reference continues to render the original image; the actor may retry after all active references end.
2. **Given** an authorized replacement, **When** the new image validates and the reference changes successfully, **Then** the reference resolves to the new identity; the prior file remains available while any other active reference needs it.
3. **Given** failed validation, a failed write, or a stale/concurrent reference change, **When** replacement is attempted, **Then** the prior reference remains usable, the caller receives a conflict or recoverable failure, and no false success is reported.
4. **Given** a repeated removal or replacement request, **When** its prior result has already taken effect, **Then** the outcome is stable, creates no second active reference, and never removes a newly referenced asset.

---

### User Story 5 - Recover Media With Its Records (Priority: P2)

An operator can restore media and its recorded identities as one coherent set after application restart, release replacement, or a restore exercise.

**Why this priority**: A database-only or file-only recovery would make apparently valid content references unusable.

**Independent Test**: Save representative assets and at least one active reference, back up both identities and bytes, simulate release replacement, restore both, and verify authorized retrieval and denied retrieval still behave as before.

**Acceptance Scenarios**:

1. **Given** uploaded assets and an active reference, **When** the application restarts or a release directory is replaced, **Then** authorized reads still return the same content under the same stable identities.
2. **Given** a consistent backup of asset identities and files, **When** it is restored into a clean environment, **Then** every restored active reference resolves and unauthorized actors still cannot retrieve protected media.
3. **Given** a missing or corrupt file during retrieval or restore, **When** the mismatch is detected, **Then** the system reports an unavailable condition to authorized actors, does not substitute unrelated media, and records enough operational evidence to reconcile it without revealing private paths.

### Edge Cases

- An empty selection, cancelled upload, duplicate request, or incomplete interrupted transfer must not produce a saved identifier or a success announcement.
- After recovery examines an interrupted attempt, incomplete or unprovable bytes must leave it rejected, while fully validated final bytes may become accepted only after their identity is committed. The actor can inspect the terminal result; a rejected key cannot be reused for another upload.
- Unsupported format, mismatched extension/type/content, decompression or pixel excess, zero dimensions, truncated files, malicious metadata, and invalid transparency must fail before exposure.
- An unknown, malformed, deleted, private, draft-related, or otherwise inaccessible asset must not reveal the existence of a protected record to an unauthorized caller.
- Lists of a user's or administrator's managed assets need deterministic newest-first ordering with a stable tie break and bounded pagination; no later-phase catalog ordering is implied.
- If a response is lost after an upload commits, retry must let the same actor determine whether the asset was saved without creating an uncontrolled duplicate or falsely reporting failure as success.
- Reusing an upload-attempt key under a different account must neither expose the first account's attempt nor block an otherwise valid independent upload.
- A replacement that races with removal, another replacement, or new reference creation must leave every active reference pointing at available content.
- Cached public media may remain visible after a future publication change; P02 must not make unbound or protected media publicly cacheable, and later binding phases must define their public invalidation semantics.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The platform MUST accept exactly six media classes: work cover, work background, illustrated chapter page, user avatar, avatar frame, and comment decoration. A caller MUST declare one class per upload; unsupported or extra class/owner claims MUST be rejected.
- **FR-002**: Every accepted upload MUST receive an immutable, server-assigned identity and a stable relative media identifier independent of the original file name, request path, application restart, or release directory. Original names and caller-supplied paths MUST NOT determine storage or retrieval.
- **FR-003**: Accepted image bytes and their identities MUST remain durable across process restart and replacement of application release files. A failed or partial upload MUST NOT become retrievable or be reported as complete.
- **FR-004**: The platform MUST compare extension, declared media type, and decoded image content; only JPEG, PNG, and WebP are eligible for cover, background, page, and avatar classes, and only transparent PNG or WebP are eligible for frame and decoration classes. Malformed, executable, active-content, and mismatched files MUST fail.
- **FR-005**: Each class MUST enforce published positive byte, pixel-dimension, and decoded-resource bounds before acceptance. The avatar control's existing 4 MB maximum remains the user-visible bound unless a coordinated product decision changes it. Work-cover and background controls MUST validate their existing portrait-cover and wide-background intent without silently treating a visual hint as server authority.
- **FR-006**: Frame and decoration acceptance MUST verify decoded transparency rather than trusting extension, metadata, or an image preview.
- **FR-007**: The platform MUST reject path traversal, absolute paths, disguised separators, malformed identifiers, unsupported parameters, and attempts to retrieve or overwrite files outside the configured media domain.
- **FR-008**: Administrator-owned class upload, lookup, replacement, and removal MUST require an authenticated active, verified administrator. Ordinary users, visitors, pending-verification accounts, suspended accounts, and any unsupported moderator role MUST have no administrator media authority.
- **FR-009**: User-avatar upload, managed lookup, replacement, and removal MUST require an authenticated active, verified owner. Actor identity MUST come from established session authority; another user identifier in a request MUST not grant access. Administrator status alone MUST not silently transfer private avatar ownership.
- **FR-010**: Unsafe authenticated media commands MUST retain the existing cross-site request protection and bounded abuse controls. Denial MUST not mutate files, identities, or references.
- **FR-011**: Media reads MUST apply the same class, owner, and future publication eligibility as the record exposing the identifier. In P02, unbound editorial/gift assets remain administrator-only, unbound avatars remain owner-only, and illustrated chapter pages are not opened to public or reader traffic ahead of the reader phase.
- **FR-012**: Authorized delivery MUST return the actual validated media type, safe disposition and content headers, and a caching policy consistent with access. Protected or private media MUST not be stored in a public cache; inaccessible reads MUST not disclose private existence or internal storage paths.
- **FR-013**: Every active use of an asset MUST be traceable before an asset can be replaced or physically removed. An asset with any active reference MUST remain available until those references have safely moved or ended.
- **FR-014**: Replacement MUST create or validate a usable new asset before changing an active reference. On failure or conflict, the prior reference and original bytes MUST remain usable; successful replacement MUST not remove a prior asset still used elsewhere.
- **FR-015**: Removal of an actively referenced asset MUST be refused with a conflict result and MUST NOT queue later deletion. Authorized removal MAY proceed only after all active references end. Repeated requests MUST have stable outcomes and MUST NOT delete a newly referenced or concurrently replaced asset.
- **FR-016**: Asset ownership, class, status, current references, creation identity, and file availability MUST be distinguishable in persistent truth. An asset may be pending, available, or unavailable for recovery; it MUST be exposed for use only when available and authorized. Recovery of a pending upload MUST settle its attempt to accepted only after complete validated bytes and identity are verified, or to rejected when they cannot be proven. A removed asset identity MUST not be reassigned to different bytes.
- **FR-017**: Authorized asset listings MUST have bounded pagination, deterministic newest-first order with an identity tie break, a true empty state, and no items outside the actor's authority.
- **FR-018**: Upload retry after interruption or lost response MUST avoid uncontrolled duplicate assets for the same actor's attempt and allow that actor to learn the authoritative pending or terminal outcome. A rejected attempt key MUST NOT start another upload; the actor must use a new key. An attempt key used by another actor MUST have no effect on, or disclose, the first actor's attempt. Concurrent replacement/removal MUST resolve to one safe final reference state or a reported conflict.
- **FR-019**: Media controls touched by P02 MUST preserve existing preview and illustrated-page ordering interactions while replacing sample-selection and temporary-preview success with truthful pending, validation, retry, saved-asset, stale, conflict, and denied states. A successful asset upload MUST NOT be labeled as a saved parent record, published chapter, granted gift, or selected avatar.
- **FR-020**: Visible media interactions MUST use the approved Arabic-first RTL design, work at narrow and larger screen widths, provide usable labels, keyboard and focus behavior, announced progress/errors/success, non-color-only state cues, adequate contrast, and reduced-motion behavior.
- **FR-021**: Safe errors, responses, logs, and browser-visible state MUST omit credentials, original private paths, storage roots, internal failures, other actors' private identifiers, and sensitive file content. A missing protected asset and an inaccessible protected asset MUST have a consistent non-disclosing outward result.
- **FR-022**: Operational configuration MUST identify persistent media storage without embedding deployment secrets or machine-specific production paths in distributable examples. The service MUST fail closed when required storage is unavailable or unsafe.
- **FR-023**: Backup and restore instructions and a performed restore exercise MUST keep asset records, active references, and physical bytes consistent; recovery MUST identify missing or corrupt media instead of claiming success.
- **FR-024**: Asset creation and use MUST remain separate from later content/gift/avatar workflows. P02 MAY record an authorized reference needed to prove safe media lifecycle, but MUST NOT implement P03/P04/P10 parent editing, publication, grants, or appearance selection.

### Key Entities

- **Media asset**: Immutable identity and stable relative identifier for validated image bytes, declared class, authoritative owner/management scope, decoded format and dimensions, availability state, and creation history. An identifier is never recycled for different bytes.
- **Media reference**: A live use of an asset by an authorized existing or future record. Its identity and current target determine whether replacement or physical removal is safe. A retired reference does not make another live use disappear.
- **Upload attempt**: One actor-scoped submission whose pending, accepted, or rejected outcome can be distinguished on retry without multiplying assets accidentally. Interruption is resolved to a terminal state after reconciliation.
- **Media recovery set**: The mutually consistent asset identities, references, and bytes needed to restore authorized delivery.

### Authority, Privacy, and State Truth

- **Actors and server authority**: Public visitors may see only assets made explicitly public by later published-content workflows; P02 exposes no unbound public media. Active, verified users manage only their own avatar candidates. Administrators manage editorial and gift media classes while active and verified. A moderator-only role is not present and receives no P02 privilege. System backup/recovery processes act through restricted operational access, not a browser role.
- **Sensitive data and public projection**: Return only the media identity, class, usable presentation facts, and actor-permitted state needed for the operation. Do not return original path, storage root, private owner details, rejected payload bytes, or secret configuration. Direct asset delivery must honor the same privacy boundary as metadata.
- **State semantics**: Selection and preview are local until upload confirmation. An accepted asset is available only after validated bytes and its identity agree. Errors, lost responses, conflicts, stale UI, denial, removal, and recovery must communicate their actual state; no optimistic preview or acknowledged request is final server truth.

## Acceptance Evidence _(mandatory)_

- **AE-001**: For FR-001–FR-007, exercise positive and negative uploads for all six classes with real decoded images and malicious/mismatched/boundary payloads; verify final identities and file absence after rejection.
- **AE-002**: For FR-008–FR-012 and FR-021, exercise visitor, owner, other user, inactive, suspended, administrator, and unsupported-role requests through the actual authentication and request-security boundary. Assert no unauthorized mutation or private-existence, path, secret, or raw-error disclosure in outputs and logs.
- **AE-003**: For FR-013–FR-018, use the real persistent data boundary and files to verify active-reference safety, actor-scoped keys, terminal interrupted-attempt outcomes, retries, duplicate attempts, concurrent replacement/removal, rollback after partial failure, stable ordering, and bounded pagination from final state rather than status alone.
- **AE-004**: For FR-019–FR-020, use focused interaction evidence for preview, progress, empty, failure, retry, conflict, stale, denied, and saved-asset feedback, plus keyboard, focus, RTL, narrow-width, and reduced-motion checks. Real-browser evidence is required for file selection, progress/abort, and any behavior component tests cannot prove.
- **AE-005**: For FR-003 and FR-022–FR-023, perform restart, simulated release replacement, and clean restore exercises with matching records/files and at least one active reference; verify an intentionally missing/corrupt file produces an unavailable outcome.
- **AE-006**: The smallest real end-to-end journey is: an active, verified administrator uploads a valid work cover candidate, receives its stable identity, establishes an authorized active reference, retrieves it, restarts or reconnects, retrieves the same bytes, then attempts an unauthorized read and removal of the referenced asset. Each step must prove the observable result and final state without relying on a fixture or mocked success.
- **Unverified external/browser/device boundary**: Production VPS filesystem permissions, backup destination, deployed cache behavior, and physical device rendering require environment-specific evidence at implementation acceptance; a local exercise alone cannot certify them.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All six declared media classes accept at least one valid class-appropriate image and reject each applicable invalid type/content, size/dimension, transparency, executable, and path case without creating a usable asset.
- **SC-002**: Every accepted upload produces one stable identity and the same authorized image is retrievable after one application restart and one simulated release replacement.
- **SC-003**: In the acceptance actor matrix, zero unauthorized uploads, reads, replacements, or removals change or disclose a protected asset; a different user cannot manage an avatar candidate.
- **SC-004**: In the active-reference, duplicate, stale, and concurrent acceptance cases, zero surviving references point to removed or unavailable files and zero failed requests are reported as successful.
- **SC-005**: One clean restore exercise recovers all assets and active references in its sample set together, with each authorized image still retrievable and each protected image still denied to unauthorized actors.
- **SC-006**: The smallest administrator upload-to-retrieval journey completes without a sample image or local-only success, and every touched media control presents distinct pending, saved, validation-error, retry, conflict, and denied outcomes in Arabic RTL where applicable.
- **SC-007**: Each touched media control is operable by keyboard and at narrow and larger viewport sizes; progress and outcome changes are conveyed without relying only on color or motion.

## Assumptions

- Accepted P01 content foundation, with inherited P00 acceptance, is required before P02 implementation. This specification records the current checkout but does not claim those formal gates have passed.
- The existing 4 MB avatar hint is preserved as the default product limit. Other exact per-class byte, dimension, and decoded-resource thresholds are bounded operational choices to be fixed and published during planning before implementation and test acceptance; no unsupported traffic, latency, or availability target is inferred.
- Covers and backgrounds retain the current portrait and wide preview intent. Exact tolerance and image optimization variants depend on evidence in planning; a thumbnail is required only if that evidence establishes a catalog need.
- P02 may support safe media reference operations against existing content identities to prove lifecycle integrity, while user-facing parent-record save/publish/bind flows remain with their roadmap owners.
- An unbound media asset is private to its permitted manager or owner. Future public visibility is granted only by later phases' publication and binding rules; P02 does not infer it from a successful upload.
- No automatic expiry or silent garbage collection of unbound accepted assets is assumed for P02. Authorized explicit removal and reference-aware retention provide the initial lifecycle; any automated retention window requires a separately accepted policy.

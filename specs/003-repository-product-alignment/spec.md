# Feature Specification: Repository and Product Alignment

**Feature Branch**: Not created (retrospective P00 record)

**Created**: 2026-09-23

**Status**: Approved for implementation by the owner's 2026-09-23 instruction; exit acceptance remains evidence-gated

**Input**: Resolve the prerequisite blockers to roadmap phase P02 without treating the earlier P01 execution override as P00 acceptance. On 2026-09-23, the owner explicitly requested implementation of all missing P00 work that blocks later phases and completion marking only after it is finished.

**PLAN.md Phase**: P00 — Repository and Product Alignment

## Scope and Current Reality

- **Dependencies and accepted gates**: P00 has no earlier roadmap phase. This record was created after P01 and P02 feature directories because the required P00 record was missing; its later directory number does not imply P00 acceptance or change roadmap order.
- **Executable baseline**: Account registration, verification, login, refresh, profile updates, and protected workspace routes are real. The account contract and stored account still contain an obsolete optional phone field. The chapter form accepts zero and fractions; the fixture chapter route is outside the current protected workspace; local reading completion copy can imply persistence. Advertisement slots and detection are presentation placeholders with no provider delivery.
- **Behavior to preserve**: Existing authentication, transport and CSRF, safe errors, ADMIN client guard, Arabic RTL routes and approved visual design. The API remains the authority for protected operations.
- **Fixture and local status**: Work, chapter, reader, admin, engagement, and advertisement presentation remain fixture or local behavior pending their assigned later phases. P00 identifies them and corrects misleading claims; it does not connect them to persistent product records.
- **Exclusions**: New content or media domain records, provider delivery, reader API authorization, new admin operations, visual redesign, and later roadmap phases P01–P14.
- **Exit gate**: The exact P00 gate in PLAN.md must have fresh code, documentation, automated, and reviewer evidence before P00 or dependent P01/P02 can be accepted. A draft, task count, or prior execution override is insufficient.

## User Scenarios & Testing

### User Story 1 - Account without obsolete phone data (Priority: P1)

As a visitor or authenticated account owner, I can use the established account journey without a phone field being requested, saved, or disclosed. This removes a product contradiction and unnecessary personal data.

**Independent Test**: Register, verify, sign in, inspect the safe account response, and update the supported profile field using the established journey; phone input is rejected and phone is absent from all responses and stored account shape.

**Acceptance Scenarios**:

1. **Given** a new visitor, **When** they register with the supported fields, **Then** the account follows the existing verification flow and no phone value is required or returned.
2. **Given** a registration or profile request containing phone, **When** it is validated, **Then** the unsupported field is rejected without changing account data.
3. **Given** existing accounts with or without a legacy phone value, **When** the alignment is applied, **Then** account identity, credentials, sessions, and supported profile data remain usable while phone ceases to be retained or exposed.

### User Story 2 - Honest, protected fixture reading (Priority: P1)

As an active verified user, I can view the existing sample reader and understand that its completion feedback applies only to the current local session. Visitors cannot access chapter content through the sample route.

**Independent Test**: Open the fixture chapter as a visitor and as an active verified user, then reach its completion threshold. The visitor is redirected through the established sign-in flow; the user sees the same reader design with explicitly local completion wording.

**Acceptance Scenarios**:

1. **Given** a visitor, **When** they open a sample chapter route directly, **Then** chapter text and images do not render before the existing protected-route decision and the established safe login redirect is used.
2. **Given** an active verified user, **When** they open a sample chapter, **Then** the existing Arabic RTL reader remains available.
3. **Given** a user reaching the local completion threshold, **When** feedback appears, **Then** it states that completion is for the current session and does not claim a saved reading history.
4. **Given** a pending or suspended account or a failed session check, **When** the reader route opens, **Then** the established denial or retry state appears without rendering chapter content.

### User Story 3 - Aligned admin and advertising presentation (Priority: P2)

As an administrator, I can enter only positive whole chapter numbers in the existing sample editor; as a visitor, I am not shown a fake live advertisement or delivery claim.

**Independent Test**: Submit empty, zero, fractional, negative, and positive whole chapter numbers in the sample form; inspect ad placement and admin guard behavior without any provider setup.

**Acceptance Scenarios**:

1. **Given** the chapter form, **When** the number is zero, negative, fractional, empty, or not finite, **Then** the form rejects it with an Arabic field error and preserves the draft.
2. **Given** a positive whole number, **When** the sample form is submitted, **Then** the form may update its existing local state but does not claim server persistence.
3. **Given** no production ad integration, **When** a visitor browses, **Then** no enabled ad slot or ad-block appeal implies provider delivery; the approved ad design remains available for the later advertising phase.
4. **Given** an ordinary user, **When** they navigate to the admin workspace, **Then** the existing ADMIN presentation guard denies it; future admin mutations remain subject to API authority.

### User Story 4 - Reviewable baseline (Priority: P2)

As the phase reviewer, I can find one current inventory of fixture/local sources, their owning phases, and the disposition of historical design inconsistencies, so dependent phases are not mistaken for implemented behavior.

**Independent Test**: Compare the inventory and audit disposition to current source, the roadmap, and the applicable design reference; each source or finding has a truthful owner and status.

**Acceptance Scenarios**:

1. **Given** the current checkout, **When** the reviewer reads the inventory, **Then** every material fixture/local state source has an owning roadmap phase and no source is described as persisted without evidence.
2. **Given** the historical design audit, **When** each finding is checked against current UI, **Then** it is classified fixed, open, or superseded with current evidence.
3. **Given** the P00 completion record, **When** the reviewer inspects it, **Then** repository guidance links, obsolete concept absence, relevant checks, limitations, and independent acceptance are explicit.

### Edge Cases

- A client with an old phone field receives validation denial; a client without it continues through existing auth flows.
- An interrupted account upgrade must not result in a reported successful deployment; recovery and existing-account checks are required before acceptance.
- A protected reader session check may be pending or unavailable; content remains hidden and retry feedback stays truthful.
- Changing the chapter number after an error must preserve other unsaved sample-editor draft fields.
- Local completion reached twice in one session must not create or imply a durable duplicate record.
- An ad-block check must not run when advertising is disabled; no absence of an ad is reported as paid delivery or a user fault.

## Requirements

### Functional Requirements

- **FR-001**: Repository guidance and the ratified product constitution MUST agree with the current roadmap, and mandatory guidance links MUST resolve.
- **FR-002**: A checked-in status inventory MUST identify material fixture, local-only, mock-delay, placeholder, and persistent account surfaces and name each later roadmap owner.
- **FR-003**: Phone MUST be absent from accepted account inputs, account outputs, current account data, forms, examples, and new stored account state; unsupported phone input MUST be rejected.
- **FR-004**: Existing account identity, verification, credential, session, CSRF, and supported profile behavior MUST survive the phone removal for both new and existing accounts. Existing legacy phone values need not be retained after the approved removal.
- **FR-005**: Existing sample chapter content MUST remain hidden until the established active-and-verified protected-route decision succeeds; this client gate MUST NOT be represented as final API content authorization.
- **FR-006**: Fixture reading completion feedback MUST explicitly describe session-local calculation and MUST NOT claim a saved progress record.
- **FR-007**: The sample admin chapter form MUST accept finite positive integers only, show a specific Arabic error for invalid values, and preserve other draft inputs after rejection.
- **FR-008**: Existing ad slots and detection MUST be disabled from public production presentation until the later advertising phase connects approved provider configuration; retained design examples MUST be labeled non-production.
- **FR-009**: The existing ADMIN presentation guard MUST remain intact, and documentation MUST identify server authority as required for any real privileged mutation.
- **FR-010**: The status inventory and current design audit MUST classify each relevant historical inconsistency as fixed, open, or superseded with current evidence.
- **FR-011**: Product-facing documentation and tests MUST stop requiring obsolete phone, fractional chapter numbers, durable fixture reading completion, or live ad delivery; obsolete roadmap concepts MUST remain absent.
- **FR-012**: Every changed path MUST have meaningful automated regression evidence and the P00 exit checks MUST be rerun before independent reviewer acceptance; failures MUST be recorded, not waived.

### Key Entities

- **Account**: Persistent identity with supported profile, credential, role, status, verification, and session properties; legacy phone is retired.
- **Sample chapter and reading completion**: Fixture content and session-local completion indicator, with no durable chapter-progress identity in P00.
- **Advertisement placement**: Approved visual concept without active provider delivery in P00.
- **Status inventory**: Review record linking current presentation sources to their future owning phases.

### Authority, Privacy, and State Truth

- **Actors**: Visitors may register and browse public presentation; only active verified users may view the fixture reader; account owners may update their supported profile; ADMIN retains its existing client workspace guard; a system upgrade may remove obsolete phone data only through a reviewed deployment process. P00 grants no new moderator or administrator API capability.
- **Sensitive data**: Phone is no longer accepted or exposed. Existing credential, token, private account, safe-error, request-ID, CSRF, and logging boundaries remain enforced.
- **State semantics**: Session loading and retry hide reader content; invalid form input has no saved outcome; local completion and admin edits are labeled local; disabled advertising has no provider-success state. Interrupted upgrades and failed checks cannot be reported as success.

## Acceptance Evidence

- **AE-001**: Contract and full HTTP account tests reject phone input, omit it from safe responses, and preserve registration, verification, login, refresh, profile, and CSRF behavior (FR-003–FR-004).
- **AE-002**: A disposable database upgrade with representative existing accounts and sessions proves identity and supported data preservation, legacy-phone removal, repeatable deployment, and truthful failure/recovery (FR-003–FR-004).
- **AE-003**: Reader route and component tests cover visitor, pending, suspended, active verified, session failure, and session-local completion copy; real-browser navigation verifies content hiding and focus/RTL where component tests are insufficient (FR-005–FR-006).
- **AE-004**: Sample chapter form tests cover empty, zero, fractional, negative, non-finite, and positive integer input plus preserved draft and Arabic error (FR-007).
- **AE-005**: Advertising tests prove disabled public presentation/detection and preserved ADMIN guard; current-source review confirms no fake delivery and no obsolete concepts (FR-008–FR-011).
- **AE-006**: Inventory, audit, guidance-link, formatting, relevant package checks, and phase review evidence establish the exit gate without treating prior checks as fresh acceptance (FR-001–FR-002, FR-010–FR-012).
- **Unverified external/browser/device boundary**: Production data migration, backup/restore, provider delivery, and physical-device behavior require separate authorized or owner-provided evidence and are not claimed by local tests.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All supported account entry and response paths contain zero phone fields, and a migrated existing account retains its supported identity, access, and profile behavior.
- **SC-002**: Direct visitor and ineligible-account fixture reader attempts render zero chapter text/images before access succeeds; active verified users retain the current reader journey.
- **SC-003**: The sample chapter form accepts a positive integer and rejects each invalid number class in AE-004 without losing unrelated draft fields.
- **SC-004**: Public pages show zero active provider-style advertisement placements or ad-block appeals while integration is disabled.
- **SC-005**: Each material fixture/local source and each historical design audit finding has one current status and roadmap owner, with no false persistence claim.
- **SC-006**: Relevant contract, account HTTP, disposable database, web, type, lint, and build checks pass, and independent P00 review records all remaining limits before P01/P02 acceptance.

## Assumptions

- P00 retires legacy phone values rather than migrating them into another field, as PLAN.md explicitly requires their removal.
- Existing protected-route behavior is the immediate P00 reader presentation gate; P07 owns authoritative reader access and real chapter data.
- Existing chapter/admin actions remain sample or local behavior until their assigned phases.
- Advertising remains disabled until P13; P00 does not require provider credentials or a new configuration channel.
- This retrospective feature number records the missing phase without renumbering accepted or user-owned directories; roadmap order remains P00 before P01 before P02.

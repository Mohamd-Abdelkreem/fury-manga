# Feature Specification: [FEATURE NAME]

The media-foundation exception in constitution VI (owner decision 2026-11-01)
also applies to existing P02 media and its current P04 illustrated-preview/P05
Work-image consumers: approved numerical limits, class-specific GIF/WebP animation,
bounded progressive loading, necessary image hints/retry and reduced-motion display.
Preserve design, authority/publication and stored animation; do not implement P07,
progress/resume/opens or another feature. Apply both explicit exceptions to general
freeze wording below. Reconciliation, backend acceptance and real verification remain.

The P05 functional exception in constitution VI (owner decision 2026-11-01)
applies only to `specs/006-public-catalog-discovery-seo`: persisted public data,
truthful states/minimal functional copy, deferred unsupported controls, technical
SEO and necessary accessibility within the existing design. It does not authorize
redesign, unrelated phases, new product destinations/dialogs or changes to protected
surfaces. Apply that exact exception to general freeze wording below; all other
gates remain.

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

**PLAN.md Phase**: [exact selected phase ID and title]
**Feature Directory**: [exact generated/selected path; verify the existing pointer]

Apply the constitution and selected SPECIFY section of
`docs/workflow/speckit-prompts.txt`. Reuse accepted phase artifacts; generation is
not permission to execute tasks, change presentation or amend project policy.

## Scope and Current Reality _(mandatory)_

- **Dependencies and accepted gates**: [prior phases or N/A]
- **Executable baseline**: [what is implemented and verified now]
- **Behavior and user changes to preserve**: [specific current behavior/paths]
- **Fixture, local-only, or placeholder sources affected**: [paths and truthful status]
- **Explicit exclusions**: [requirements and later phases not included]
- **Phase exit gate**: [the applicable PLAN.md acceptance boundary]
- **Frozen frontend surfaces**: [existing routes/components/controls/feedback, or N/A]
- **Missing-surface/static-copy conflicts**: [required owner decision, or none]
- **Backend acceptance before UI integration**: [complete required group and observable gate]
- **Owner-recorded development exceptions**: [exact limits; not release/visual approval, or none]

The current frontend presentation is frozen, including pages/routes/layouts,
navigation/dialogs, controls/static copy and visual/interaction presentation.
Do not invent UI or drop a requirement to bypass a conflict. Future presentation
changes need a separate explicit owner decision and constitutional amendment.

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each journey must be testable within its declared prerequisites. Assign P1/P2/P3
  priorities by observable value, but do not claim all stories can deploy or execute
  independently. Preserve backend acceptance and phase gates. Deployment requires
  separate authorization. Replace sample stories with this phase's actual behavior.
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?
- What happens for duplicate, stale, concurrent, denied, partial-failure, and retry
  outcomes where those capabilities apply?

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

_Example of marking unclear requirements:_

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities _(include if feature involves data)_

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

### Authority, Privacy, and State Truth _(mandatory when applicable)_

- **Actors and server authority**: [public/user/owner/admin/narrow credential; active and
  verified status; ownership/publication rules]
- **Sensitive data and public projection**: [allowlisted fields and prohibited data]
- **State semantics**: [loading/empty/error/pending/success/conflict/denied/stale and
  duplicate/retry/rollback/history behavior]

## Acceptance Evidence _(mandatory)_

List meaningful automated evidence for every changed behavior. Cover positive,
negative, boundary, validation, authorization, privacy, state-transition, failure, and
regression behavior as applicable. Database/transaction claims require real PostgreSQL;
HTTP security requires the real Express middleware stack; browser-only claims require
real-browser evidence. Mark genuinely inapplicable evidence with a reason.

- **AE-001**: [requirement/risk -> evidence boundary and observable outcome]
- **AE-002**: [requirement/risk -> evidence boundary and observable outcome]
- **Unverified external/browser/device boundary**: [explicit limitation or N/A]

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [observable accepted user outcome]
- **SC-002**: [observable denied/failure/boundary outcome where applicable]
- **SC-003**: [unchanged frontend presentation with real authoritative behavior]
- **SC-004**: [phase exit outcome and required evidence]

Do not invent workload/capacity promises, arbitrary coverage percentages or perfect
security guarantees. Use approved measurable constraints only.

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
  Do not assume presentation approval, change settled product policy or bypass
  required backend/predecessor evidence. Material conflicts stay explicit gates.
-->

- [Assumption about target users, e.g., "Users have stable internet connectivity"]
- [Assumption about scope boundaries, e.g., "Mobile support is out of scope for v1"]
- [Assumption about data/environment, e.g., "Existing authentication system will be reused"]
- [Dependency on existing system/service, e.g., "Requires access to the existing user profile API"]

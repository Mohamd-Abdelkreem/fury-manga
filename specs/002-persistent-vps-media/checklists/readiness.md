# Reviewer Requirements Readiness Checklist: P02 Persistent VPS Media

**Purpose**: Review the quality of P02 requirements and their agreement with the phase boundary and design artifacts. This is a requirements review, not an implementation test plan.
**Created**: 2026-09-23
**Feature**: [spec.md](../spec.md)
**Review owner**: Human reviewer before task generation

## Scope, dependencies, and stories

- [ ] CHK001 Are the six media classes, permitted P02 reference operations, affected controls, and later-phase exclusions stated consistently, including the illustrated-editor handoff to P04? [Consistency, Spec §Scope and Current Reality, FR-001, FR-024; PLAN.md §P02]
- [ ] CHK002 Are formal P00/P01 exit-gate acceptance and reviewer disposition of this Draft P02 spec explicit prerequisites, without treating current P01 code, an execution override, or this plan as acceptance? [Dependency, Spec §Scope and Current Reality; Plan §Constitution Check]
- [ ] CHK003 Are public visitor, active verified avatar owner, ADMIN, unsupported moderator, inactive account, and system recovery authority each distinguished without granting browser guards authority? [Completeness, Spec §Authority, Privacy, and State Truth, FR-008–FR-011]
- [ ] CHK004 Do the prioritized stories each have a self-contained value and Given/When/Then path independent of P03/P04/P10 parent persistence? [Clarity, Spec §User Scenarios & Testing, FR-024]
- [ ] CHK005 Are primary, alternate, denial, validation, empty, interrupted, duplicate, conflict, stale, and recovery scenarios covered where they change an observable P02 outcome? [Coverage, Spec §User Scenarios & Testing, §Edge Cases]
- [ ] CHK006 Are assumptions about unbound media, no automatic expiry, future visibility, and catalog variants explicit and consistent with the P02 scope? [Assumption, Spec §Assumptions, FR-011, FR-024; PLAN.md §P02]

## Authority, privacy, and safe failure

- [ ] CHK007 Does each proposed media operation have one clear actor and server-enforced class, owner, or ADMIN rule, including attempts, binary reads, lists, references, and removal? [Completeness, Spec FR-008–FR-011; Plan §HTTP, Authority and Threat Boundaries]
- [ ] CHK008 Are authenticated transport and CSRF rules explicit for unsafe commands, while protected reads avoid an unintended ambient-cookie or public transport path? [Clarity, Spec FR-010–FR-012; Contract §Authority and route matrix]
- [ ] CHK009 Are role denial and protected-resource non-disclosing results distinguishable without revealing whether another actor's asset, attempt, or reference exists? [Consistency, Spec FR-021; Contract §Authority and route matrix]
- [ ] CHK010 Are permitted output fields, safe binary headers, private caching, redacted logs, and errors defined without leaking names, paths, hashes, credentials, file content, or internal failures? [Completeness, Spec FR-012, FR-021; Contract §Common wire rules]
- [ ] CHK011 Are upload abuse limits and the consequences of exceeding them bounded and measurable for the actual deployment topology, rather than relying on an unqualified process-local limit? [Ambiguity, Spec FR-010; Plan §HTTP, Authority and Threat Boundaries]
- [ ] CHK012 Is fail-closed behavior specified when the storage root, authorization source, file bytes, or recovery state is unavailable, with no false success or unrelated-image substitution? [Coverage, Spec FR-003, FR-016, FR-021–FR-023]

## Contract and validation quality

- [ ] CHK013 Are media class, asset, attempt, reference, list, and binary response fields and their authority-specific projections clear and mutually consistent? [Clarity, Spec FR-001–FR-002, FR-016–FR-018; Contract §Common wire rules]
- [ ] CHK014 Are strict input rules explicit for unsupported claims, paths, IDs, extra fields, multipart parts, and omission versus null versus empty values? [Completeness, Spec FR-001, FR-007; Contract §Common wire rules, §Upload]
- [ ] CHK015 Are format, decoded-content, transparency, size, dimension, and resource limits objectively decidable for every class, including boundary values and invalid/mismatched input? [Measurability, Spec FR-004–FR-006, SC-001; Contract §Upload]
- [ ] CHK016 Have the proposed non-avatar thresholds, aspect tolerances, and decoder resource budget been validated against representative artwork and published before acceptance criteria rely on them? [Assumption, Spec FR-005, §Assumptions; Contract §Upload]
- [ ] CHK017 Are method, authority, success/error status, stable code, field-error location, multipart field order, and safe retry meaning complete for every changed interface? [Completeness, Spec FR-010, FR-018, FR-021; Contract §Authority and route matrix, §Stable media error codes and safety]
- [ ] CHK018 Are missing, inaccessible, unavailable, removed, pending, rejected, and already-completed resources given distinct or intentionally identical outward results, with privacy rationale? [Clarity, Spec FR-016, FR-021; Contract §Lists and lookups, §Upload]
- [ ] CHK019 Are list filter combinations, bounds, default page size, deterministic tie break, beyond-end page, empty result, and actor-scoped count semantics unambiguous? [Clarity, Spec FR-017; Contract §Lists and lookups]
- [ ] CHK020 Are additive compatibility and future publication/consumer changes separated from P02 so existing public, content, account, and auth contracts retain their stated meaning? [Consistency, Spec FR-011, FR-024; Contract §Compatibility and OpenAPI]

## Identity, lifecycle, and recovery

- [ ] CHK021 Are asset, actor-scoped upload-attempt, reference, and target identities, uniqueness, owner scope, and non-recycled media identifiers defined without treating an original filename as authority or disclosing another actor's attempt-key use? [Completeness, Spec §Key Entities, FR-002, FR-016, FR-018; Data Model §MediaAsset, §UploadAttempt, §MediaReference]
- [ ] CHK022 Are accepted, rejected, pending, unavailable, removing, removed, active, and retired transitions defined with the exact point at which an asset may be used or announced as saved? [Clarity, Spec FR-003, FR-016, FR-019; Data Model §Asset lifecycle, §Reference transitions]
- [ ] CHK023 Are active-reference refusal, replacement, retirement, repeated command, and stale-version outcomes consistent with the accepted clarification that referenced removal queues no deletion? [Consistency, Spec §Clarifications, FR-013–FR-015, FR-018; Contract §References]
- [ ] CHK024 Are lost-response retry, terminal reconciliation of an incomplete attempt, rejected-key/new-key behavior, duplicate submission, concurrent bind/replace/remove, and newly created reference races assigned one authoritative outcome without silent overwrite or broken live use? [Coverage, Spec FR-013–FR-018, SC-004; Data Model §Concurrency and file side effects]
- [ ] CHK025 Are retention of unbound accepted assets, tombstones and reference history, owner deletion, and later-phase binding limits documented without implying automatic garbage collection? [Completeness, Spec §Assumptions, FR-015–FR-016, FR-024; Data Model §MediaAsset, §MediaReferenceEvent]
- [ ] CHK026 Are forward migration, existing-record treatment, rollback compatibility, partial file/database failure, reconciliation, and coordinated restore requirements explicit enough to preserve identity and active uses? [Coverage, Spec FR-003, FR-022–FR-023, SC-005; Data Model §Forward migration and existing rows, §Recovery set]
- [ ] CHK027 Are the storage permission, backup destination, process topology, and release-replacement assumptions identified as environment evidence still needed before a production readiness claim? [Assumption, Spec §Acceptance Evidence; Plan §Data, Transactions and Recovery]

## UI truth, accessibility, and acceptance

- [ ] CHK028 Are fixture/sample actions and local-only previews identified separately from durable upload success and unsaved parent records across every affected control? [Consistency, Spec §Scope and Current Reality, FR-019, FR-024]
- [ ] CHK029 Are first load, empty and filtered empty, transfer versus validation pending, background refresh, denial, unavailable, retry, success, conflict, and stale outcomes stated with truthful Arabic feedback? [Completeness, Spec FR-019–FR-020; Plan §Frontend Behavior and Visual Preservation]
- [ ] CHK030 Are draft/selection preservation, cancellation, rapid reselection, lost acknowledgement, and late response rules clear enough to prevent stale private media or a false saved state? [Coverage, Spec §Edge Cases, FR-018–FR-019; Plan §Frontend Behavior and Visual Preservation]
- [ ] CHK031 Are actor-scoped cache invalidation and private preview lifetime requirements consistent with protected-resource denial and account switching? [Consistency, Spec FR-011–FR-012, FR-019, FR-021; Plan §Frontend Behavior and Visual Preservation]
- [ ] CHK032 Are Arabic RTL, 320px and larger layouts, labels, keyboard/dialog focus, live announcements, non-color cues, contrast, and reduced-motion requirements specific enough for a reviewer to judge? [Measurability, Spec FR-020, SC-007; Plan §Frontend Behavior and Visual Preservation]
- [ ] CHK033 Does every SC have a measurable P02 result and a trace to stories/FRs without invented traffic, latency, availability, or later-phase business outcomes? [Traceability, Spec §Success Criteria, §User Scenarios & Testing; PLAN.md §P02]
- [ ] CHK034 Does the smallest real journey prove upload identity, active reference, protected retrieval after restart, unauthorized denial, and referenced-removal conflict without relying on a fixture or parent-save claim? [Completeness, Spec AE-006, SC-002–SC-006; Plan §Requirement-to-Test Matrix and Checks]

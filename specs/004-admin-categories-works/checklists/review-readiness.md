# Requirements Readiness Checklist: Persistent Admin Categories and Works

**Purpose**: Reviewer-owned quality gate for the written P03 requirements, not an implementation test plan.
**Created**: 2026-09-25
**Feature**: [spec.md](../spec.md) · [plan.md](../plan.md) · [roadmap](../../../PLAN.md)

## Scope, Dependencies, and Scenarios

- [ ] CHK001 Are the P01/P02 persistent baseline and the P03 fixture, local-state, mock-delay, and placeholder behaviors distinguished without treating visual affordances as saved behavior? [Completeness, Spec §Scope and Current Reality]
- [ ] CHK002 Are the P01/P02 acceptance dependencies, their unconfirmed formal gates, and the consequence for P03 acceptance explicit? [Dependency, Spec §Scope and Current Reality]
- [ ] CHK003 Are the P03 routes, intended category/work outcomes, and exclusions consistent with PLAN.md P03, including no merge, hard deletion, chapter authoring, public catalog integration, or public image delivery? [Consistency, Spec §Scope and Current Reality]
- [ ] CHK004 Are product assumptions identified separately from accepted requirements, especially incomplete drafts, chapter-free publication, category disablement, and editorial field limits? [Assumption, Spec §Assumptions]
- [ ] CHK005 Can each prioritized category, draft, publication, and work-list story be accepted independently without requiring a later-phase screen? [Independence, Spec §User Scenarios & Testing]
- [ ] CHK006 Do the Given/When/Then scenarios cover primary, alternate, denial, validation, empty, failure, conflict, retry, and recovery outcomes for the relevant story? [Coverage, Spec §User Scenarios & Testing]
- [ ] CHK007 Are the scenarios and edge cases consistent about preserving confirmed state and unsaved input after a failed combined save-and-publish action? [Consistency, Spec §Clarifications; Spec §FR-016]

## Authority, Privacy, and Contract Quality

- [ ] CHK008 Are visitor, ordinary active/verified user, pending/suspended user, ADMIN, and system-process privileges specified, with no implied moderator or per-work owner authority? [Completeness, Spec §Authority, Privacy, and State Truth; Spec §FR-001]
- [ ] CHK009 Is server-side authority required for every management read and mutation, independently of browser guards or caller-supplied role/owner claims? [Clarity, Spec §FR-001]
- [ ] CHK010 Are credential-free public reads distinguished from authenticated management transport and CSRF-protected unsafe requests without implying CSRF on public reads? [Consistency, Spec §FR-019; Plan §Security and Failure Analysis]
- [ ] CHK011 Are forbidden management access, unknown admin records, and private-versus-absent public records specified with consistent 401/403/404 privacy outcomes? [Clarity, Spec §FR-013; Contracts §Authority and middleware matrix]
- [ ] CHK012 Are public and administrative projections explicitly bounded, including exclusion of drafts, archives, disabled public categories, private media locations, credentials, internal details, and sensitive error/log data? [Completeness, Spec §FR-013; Spec §FR-019]
- [ ] CHK013 Are safe failure and existing abuse-limit expectations stated without adding an unsupported public-write surface or inventing a new rate target? [Scope, Spec §FR-016; Plan §Security and Failure Analysis]
- [ ] CHK014 Are identity and editorial fields, normalization, bounds, unsupported-field rejection, and immutable slug/type rules sufficiently precise to yield one accepted wire meaning? [Clarity, Spec §FR-002; Spec §FR-006–FR-008; Contracts §Shared field schemas]
- [ ] CHK015 Are omitted, null, empty string, and empty collection meanings defined consistently for optional metadata, categories, tags, media, and featured fields? [Clarity, Spec §FR-007–FR-009; Contracts §Shared field schemas]
- [ ] CHK016 For each changed interface, are its method, authority, input/output projection, success status, stable failure code, and field-error location traceable to the same requirement? [Traceability, Spec §FR-016; Contracts §Endpoint contract]
- [ ] CHK017 Are search/filter combinations, category order, work sort ties, page bounds, accurate totals, and collection-empty versus filtered-empty requirements unambiguous? [Clarity, Spec §FR-003; Spec §FR-015]
- [ ] CHK018 Are compatibility requirements for existing minimal P01 requests and independently deployed strict clients explicit, including coordinated contract changes? [Dependency, Plan §Design Decisions and Invariants; Contracts §Error, privacy and compatibility details]

## Identity, State, and Recovery

- [ ] CHK019 Are category/work identity, uniqueness, immutable attributes, timestamps, and revision semantics consistent across entity definitions, scenarios, and contracts? [Consistency, Spec §FR-002; Spec §FR-006; Spec §Key Entities]
- [ ] CHK020 Are category usage, global ordering, boundary/no-op moves, in-use disablement, retained associations, and re-enablement specified without implying deletion? [Coverage, Spec §FR-003–FR-005]
- [ ] CHK021 Are work publication transitions, invalid direct transitions, repeated-state outcomes, current publication time, and retained event history fully specified? [Completeness, Spec §FR-011–FR-012]
- [ ] CHK022 Are publication prerequisites applied to both new transitions and edits or category/media changes that could invalidate an already published work? [Consistency, Spec §FR-011; Spec §FR-009]
- [ ] CHK023 Are featured preference/order identity, active-position uniqueness, draft/archive retention, and conflict outcomes defined without claiming the P05 home display exists? [Clarity, Spec §FR-014]
- [ ] CHK024 Are upload candidate, saved association, replacement/removal, late asset unavailability, and public-delivery states distinct, including published-readiness and recovery consequences? [Coverage, Spec §FR-009; Spec §Edge Cases]
- [ ] CHK025 Are duplicate slugs, tags, categories, positions, stale revisions, simultaneous edits/reorders, and idempotent repeats assigned deterministic no-partial-change outcomes? [Coverage, Spec §FR-005; Spec §FR-008; Spec §FR-014; Spec §FR-016]
- [ ] CHK026 Is the all-or-nothing boundary for combined save-and-publish complete across editorial fields, memberships, media references, state, and publication event, including no new draft after failed create-publish? [Clarity, Spec §FR-016; Spec §Clarifications]
- [ ] CHK027 Does ambiguous create/update recovery specify when authoritative state is rechecked, how a duplicate retry is avoided, and when success may truthfully be announced? [Ambiguity, Spec §FR-016; Plan §Design Decisions and Invariants]
- [ ] CHK028 Are existing published-record inventory and explicit remediation, forward migration compatibility, failed-rollout stop, retained history, and rollback/recovery obligations traceable to the publication requirements? [Dependency, Spec §FR-011; Plan §Rollout, Recovery and Stop Gates]

## Frontend Truth and Acceptance Quality

- [ ] CHK029 Are the exact category/work fixture and local-write paths being replaced distinguished from unrelated demo content that remains out of scope, with no fake counts, activity, or reset path presented as live? [Completeness, Spec §FR-017; Spec §Scope and Current Reality]
- [ ] CHK030 Are loading, background-stale, collection-empty, filtered-empty, pending, validation, denial, unavailable/retry, conflict, unchanged, and confirmed-success states specified where relevant without false success? [Coverage, Spec §FR-018; Spec §FR-016]
- [ ] CHK031 Are draft preservation, remote-change conflict, cache isolation on actor/resource change, and late response handling specified so private or stale data cannot regain authority? [Coverage, Spec §FR-016; Spec §Edge Cases; Plan §Frontend State, Cache and Access]
- [ ] CHK032 Are Arabic-first RTL and responsive requirements tied to the preserved approved interface, including mixed-direction identifiers, narrow layouts, and reduced motion? [Completeness, Spec §FR-018]
- [ ] CHK033 Are keyboard access, dialog focus/return, labels, first-invalid focus, and errors/status announcements observable, and are "adequate" contrast and target sizes objectively defined? [Measurability, Spec §FR-018; Spec §SC-007]
- [ ] CHK034 Can every SC outcome be measured from the stated scenario and authoritative state without invented traffic, latency, availability, or business targets? [Measurability, Spec §Success Criteria]
- [ ] CHK035 Does the smallest real journey cover category creation, both work types, real cover association, publish, reload, unpublish, archive, restore, and public metadata privacy without depending on P04/P05 UI? [Coverage, Spec §FR-020; Spec §SC-001–SC-006]
- [ ] CHK036 Are automated, persistent-data, HTTP-stack, frontend, and browser evidence obligations traceable to material requirements, while unverified deployment/device boundaries remain explicitly unclaimed? [Traceability, Spec §Acceptance Evidence; Spec §FR-020]

## Notes

- Leave every item unchecked until a reviewer assesses the written requirements and records any finding beside the item.
- This checklist supplements, and does not replace, the built-in [requirements checklist](requirements.md).

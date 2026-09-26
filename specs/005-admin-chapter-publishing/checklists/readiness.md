# P04 Requirements Readiness Checklist: Persistent Chapter Authoring and Publishing

**Purpose**: Reviewer-owned checks of the written P04 requirements and design artifacts, not implementation behavior.
**Created**: 2026-09-26
**Feature**: [spec.md](../spec.md) · [plan.md](../plan.md) · [Chapter contract](../contracts/chapter-http.md)
**Review state**: All items are open for human review.

## Scope, actors, and scenarios

- [ ] CHK001 Are P01–P03 and authentication dependencies, their unaccepted evidence gates, and the point at which P04 may proceed stated without treating existing code as accepted release evidence? [Dependency; Spec §Scope and Current Reality; PLAN §10]
- [ ] CHK002 Is the boundary between preserved Chapter UI, Chapter-owned fixture/local actions to replace, and unrelated fixtures to retain explicit and consistent with P04 route ownership? [Completeness; Spec §Scope and Current Reality; PLAN §P04, §7–8]
- [ ] CHK003 Are visitor, ordinary user, Work owner, moderator, active verified ADMIN, and media-reconciliation process authorities distinguished without granting editorial rights through ownership or a browser guard? [Clarity; Spec §Authority, Privacy, and State Truth, FR-001]
- [ ] CHK004 Can each prioritized illustrated, text, publication, management, and denial/recovery story be accepted independently, with primary, alternate, negative, and recovery conditions stated in its scenarios or edge cases? [Coverage; Spec §User Scenarios & Testing]
- [ ] CHK005 Are title normalization, incomplete-draft allowance, existing media limits, and private-parent publication recorded as explicit assumptions or decisions, with no material product choice hidden as a technical default? [Assumption; Spec §Assumptions, FR-003–005]

## Authority, privacy, and failure boundaries

- [ ] CHK006 Is server-side ADMIN authorization required consistently for private Chapter reads, writes, preview data, and associated private media, including wrong-Work identity handling? [Completeness; Spec FR-001–002, FR-024]
- [ ] CHK007 Are active/verified session and CSRF requirements clear for every unsafe Chapter and media association operation, including denial before private lookup? [Clarity; Spec FR-001, FR-024; Contract §Endpoints and authority]
- [ ] CHK008 Does the public Chapter contract explicitly require credential-free transport without ambient bearer, cookies, CSRF, or refresh, rather than merely labeling the routes “Public”? [Gap; Constitution II; Contract §Endpoints and authority]
- [ ] CHK009 Are public 404/privacy outcomes and the allowlisted metadata fields consistent for absent, draft, archived, wrong-parent, ineligible-Work, and unavailable-image cases? [Consistency; Spec FR-017; Contract §State, visibility, and errors]
- [ ] CHK010 Are sensitive bodies, candidate/media paths, tokens, event history, internal errors, logs, and cached errors excluded at every stated public or denied boundary? [Completeness; Spec FR-017, FR-024; Constitution II]
- [ ] CHK011 Are bounded inputs, upload/media limits, pagination, rate-limit behavior, and safe error disclosure specified only to the extent P04 actually needs them? [Coverage; Spec FR-008, FR-024; Plan §Security and privacy review]

## Contract clarity and compatibility

- [ ] CHK012 Are identity, title, number, type, version, publication, text, page, and readiness fields specified with requiredness, normalization, bounds, and private/public output differences? [Completeness; Spec FR-003–005, FR-017, FR-025; Contract §Shared wire rules]
- [ ] CHK013 Are omission, null, and empty-body/page-set meanings unambiguous for create, partial edit, incomplete draft, and published edit? [Clarity; Spec FR-005, FR-014; Contract §Shared wire rules]
- [ ] CHK014 Is a complete page edit defined clearly enough to distinguish retained identity, new association, reorder, replacement, retirement, duplicate ID, and candidate upload from saved content? [Clarity; Spec FR-006–009, FR-022; Contract §Shared wire rules]
- [ ] CHK015 Are the structured document's allowed elements, safe-link boundary, size limits, unsupported content, and saved-preview parity consistent across spec and contract? [Consistency; Spec FR-010–013; Contract §Shared wire rules]
- [ ] CHK016 Are success/error statuses, stable codes, field-error paths, denial versus unavailable semantics, and uncertain network outcomes complete for the operations P04 changes? [Completeness; Spec FR-019–020, FR-024–025; Contract §State, visibility, and errors]
- [ ] CHK017 Is the publication command's target-state set legible and unambiguous in the contract table, including same-state response and prohibited transitions? [Ambiguity; Spec FR-015–016; Contract §Endpoints and authority]
- [ ] CHK018 Are search matching, state filters, stable number/date sorts, null-date ordering, page/limit bounds, out-of-range pages, and filtered totals defined consistently? [Clarity; Spec FR-018; Contract §Endpoints and authority]
- [ ] CHK019 Is the intentional P02 Chapter-page write-authority change, its safe rejection, retained media reads/uploads, and older editorial-client cutover traceable to one compatible contract decision? [Dependency; Spec FR-008–009, FR-025; Contract §P02 media interface evolution, §Compatibility]

## Identity, lifecycle, concurrency, and recovery

- [ ] CHK020 Are Chapter identity, Work-scoped number uniqueness, parent/type immutability, and invalid or competing number outcomes measurable without implying global number uniqueness? [Clarity; Spec FR-002–004, FR-020]
- [ ] CHK021 Are every allowed and denied lifecycle edge, archived restoration, private-parent visibility, and published-edit readiness specified without conflicting with incomplete drafts? [Consistency; Spec FR-005, FR-014–017]
- [ ] CHK022 Are publication identity, timestamp, same-state/stale retry, unpublish/archive history, and later republish outcomes precise enough to distinguish one real transition from an ambiguous acknowledgment? [Ambiguity; Spec FR-016, FR-020; Contract §State, visibility, and errors]
- [ ] CHK023 Is the unavailable-image rule complete for public list, detail, and total, while preserving admin state/history and restoring metadata after repair without a new event? [Coverage; Spec §Clarifications, FR-017, SC-005]
- [ ] CHK024 Are Chapter/page retention, replacement history, image reuse, no hard delete, and editorial recovery requirements consistent with one another? [Consistency; Spec FR-007–009, FR-022; Plan §Database and failure detail]
- [ ] CHK025 Are atomic page-set failure, concurrent reorder/edit/publication, version loss, duplicate create, and uncertain create retry outcomes stated with a single authoritative result and a recovery path? [Coverage; Spec FR-009, FR-016, FR-020; Plan §Database and failure detail]
- [ ] CHK026 Does the existing-data requirement say who supplies missing legacy titles/images and what happens to unrepaired published Chapters before stronger constraints or public title output take effect? [Gap; Spec FR-003, FR-014, FR-017; Data model §Forward migration, cutover, and recovery]
- [ ] CHK027 Are forward migration, coordinated old-client cutover, constraint enforcement, failed-upgrade response, media/database restore, and rollback or roll-forward decisions stated without claiming rehearsals already occurred? [Completeness; Constitution V; Data model §Forward migration, cutover, and recovery; PLAN §10–11]

## Frontend truth and accessibility

- [ ] CHK028 Are fixture replacement and preservation requirements clear for all three Chapter screens, including removal of sample pages, local success, manual type switching, and fixture reader claims? [Completeness; Spec §Scope and Current Reality, FR-004, FR-006, FR-026]
- [ ] CHK029 Are loading, empty, filtered-empty, background refresh, pending upload/save/state, denial, unavailable, validation error, retry, conflict, and confirmed success distinguishable in the written UI requirements? [Coverage; Spec FR-018–019, FR-021, §Authority, Privacy, and State Truth]
- [ ] CHK030 Are unsaved drafts, confirmed preview, uncertain upload/save, authoritative reload, and stale-conflict recovery specified so no action is described as successful before persistence is known? [Clarity; Spec FR-013, FR-019–021, SC-006]
- [ ] CHK031 Are actor/Work/Chapter cache scope, access denial, cancellation, and stale-completion requirements complete enough to prevent prior private data or older responses from reappearing? [Gap; Spec FR-001, FR-019, FR-024; Plan §Frontend query, access, and interaction detail]
- [ ] CHK032 Are Arabic-first RTL, preserved layout and confirmation patterns, narrow/wide responsive states, and reduced-motion obligations specified for the changed surfaces? [Completeness; Spec FR-023; PLAN §8, §11]
- [ ] CHK033 Are keyboard ordering/removal, labels, progress/errors, live feedback, preview focus entry/return and dismissal, target size, and contrast covered with objectively reviewable requirements? [Measurability; Spec FR-023, SC-007; Constitution VI]

## Acceptance and phase boundaries

- [ ] CHK034 Can each SC outcome be judged from persisted content, association order, event identity, public projection, truthful feedback, and accessibility evidence rather than status codes or fixture UI alone? [Measurability; Spec §Success Criteria, §Acceptance Evidence]
- [ ] CHK035 Is the smallest real journey sufficient and bounded: one illustrated and one text Chapter, saved reload/preview/publish, repeat publication, public metadata, and unpublish recovery? [Coverage; Spec AE-006; PLAN §P04 exit gate]
- [ ] CHK036 Are P05 catalog, P07 protected reader delivery/progress, P09 notifications, P12 dashboard, and the named ZIP/scraping/scheduling/fractional/hard-delete exclusions consistently kept outside P04? [Consistency; Spec §Explicit exclusions, FR-026; PLAN §P04–P05]
- [ ] CHK037 Are documentation agreement and remaining browser/device/deployment/backup/rollback evidence boundaries traceable without implying that planning or a checked spec checklist completes the phase? [Traceability; Spec FR-025, §Acceptance Evidence; PLAN §10–11]

## Reviewer notes

Record findings beside the relevant unchecked item. A source clarification belongs in the appropriate spec or design artifact during a separately authorized revision; this checklist does not change those artifacts.

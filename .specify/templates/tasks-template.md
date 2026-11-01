---
description: "Dependency-ordered tasks for one selected Fury phase"
---

# Tasks: [FEATURE NAME]

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

**Roadmap Phase**: [exact PHASE_ID and title from PLAN.md]
**Feature Directory**: [exact selected path; verify pointer/spec match]
**Input**: [accepted matching spec.md/plan.md and applicable design artifacts]
**Prerequisites**: [populated constitution, reviewed requirements, predecessor evidence]
**Implementation Scope**: [owner binds exact IDs/batch at IMPLEMENT time; generation does not authorize execution]

**Tests**: Every implementation phase creates/extends actual meaningful automated
files for changed behavior. State concrete paths, observable outcomes, services and
manifest-backed commands. No arbitrary coverage or one-test-per-method quotas.
Documentation-only work requires documentation checks, not application test changes.

**Engineering and skill gate**: Before generating tasks, read every
`docs/engineering/*.md` file and identify the applicable rule IDs. Tasks that change
`*.service.ts` or `*.controller.ts` MUST include a B33 file-boundary check: only
imports and the exported class at top level. Include a file-owner audit for touched
API and web files: errors in feature errors, types in their owner, pure rules/form
logic in feature model or rules, transport in api, query/cache lifecycle in hooks,
and UI interaction in components. Add a review task after affected work that
checks the `docs/engineering/code-style.md` review gate on the changed files:
names, coherent functions, justified abstractions, duplicated knowledge, dead
code, preserved behavior, boundary validation and error handling. The task MUST
record concrete file/rule findings and fixes or a clean pass, plus fresh package
type/lint/format outcomes and apply the matching installed skills
(`clean-code-guard` for nontrivial production
code, `test-guard` for test code, `docs-guard` for technical docs, and
`vercel-react-best-practices` for React/Next.js code). Apply other matching skills by
their stated scope; do not add irrelevant skill tasks.

**Frozen frontend**: Preserve existing pages/routes/layouts/navigation/dialogs,
controls/static copy and all visual/interaction presentation. Only authorized real
data/handler/access/query/feedback binding through existing surfaces is permitted.
A missing surface/copy conflict is an owner-decision gate, not a new UI task.

**Backend first**: Complete/review/test the entire required backend group before
its dependent frontend. Ordered internal groups share this one feature. They are
not new roadmap phases; a completed group/batch is not the whole phase exit.

Read the constitution, whole roadmap, `docs/workflow/speckit-prompts.txt` and every
engineering guide before generation. Use actual existing owners and preserve
completed IDs/progress. Do not repeat setup/foundations or overwrite a progressed
tasks.md. Replace every sample below with phase-specific tasks and exact paths.

## Format and ownership

- Use `- [ ] T001 [P?] [US?] Description with exact target path`.
- `[P]` requires different files/owners and satisfied dependencies; it is not agent
  delegation authorization. Shared schema/service/contract writers are sequential.
- Story labels trace actual requirements; do not invent independent stories or
  pretend dependent producer/consumer work can start together.
- API owners are under `apps/api/src/`; shared schemas under `packages/contracts/src/`;
  persistence under `packages/database/`; web api/hooks/model/components remain in
  their actual existing features. Do not create folders merely to mirror an example.
- Exact accepted task IDs or a resolved dependency-safe/all-active-phase scope are
  required at implementation. Other task lines and checklist approvals stay read-only.

## Phase 1: Selected-Phase Prerequisites and Baseline

These are internal groups, not Fury roadmap phase IDs. Include only work genuinely
required by the selected phase.

- [ ] T001 Record matching phase/spec/pointer, git status, preserved edits and accepted predecessor evidence in the selected feature
- [ ] T002 Identify actual backend owners, existing frozen UI surfaces, exclusions and unresolved owner decisions
- [ ] T003 Verify actual test/configuration/scripts and applicable B/F rules/skill gates from current source

**Checkpoint**: Required written-quality and predecessor gates are supported by
actual evidence. Unmet gates remain open; no duplicate setup or accepted-artifact rewrite.

## Phase 2: Required Backend Delivery

Select only applicable backend work. Include actual test-file authoring before or
alongside the producer change; bug fixes need a meaningful failing regression.

- [ ] T004 [US1] Extend accepted browser-safe schemas/DTO aliases in [exact contract and DTO paths]
- [ ] T005 [US1] Add safe forward migration/constraints and populated-upgrade evidence in [exact database paths]
- [ ] T006 [US1] Create/extend contract, authority, failure/race/rollback tests in [actual owning test files]
- [ ] T007 [US1] Implement bounded rules/query/mapper/error/type changes in [existing domain owners]
- [ ] T008 [US1] Implement service invariants/transactions and current authority in [existing service path]
- [ ] T009 [US1] Wire thin controller/routes/middleware/OpenAPI through [actual composition owners]
- [ ] T010 [US1] Complete applicable media/provider/lifecycle/failure behavior in [actual existing owners]
- [ ] T011 Review backend code against scoped B rules, B33 and matching skills; fix required in-scope findings and record concrete evidence
- [ ] T012 Run required real backend/contract/database and affected shared checks using [verified commands/services]; record outcomes in [existing evidence owner]

**Backend acceptance checkpoint**: Entire required group is implemented, reviewed
and tested, including realistic failures/current authority and actual persistence
where claimed. Missing infrastructure or execution evidence leaves it incomplete.
No dependent frontend tasks start before this passes. If no backend change is needed,
record existing complete backend evidence rather than inventing tasks or a mock gate.

## Phase 3: Bind Existing Frozen Frontend

Include only integration owned by this selected phase after backend acceptance.
Do not create a screen/control/dialog/static-copy change to complete these tasks.

- [ ] T013 [US1] Extend validated feature API/model adapters in [actual existing paths] against accepted backend responses
- [ ] T014 [US1] Connect scoped query/mutation/cache/access/draft behavior in [actual existing hooks/model paths]
- [ ] T015 [US1] Wire existing controls and feedback in [actual existing components] without presentation changes; remove replaced in-scope production fixture paths
- [ ] T016 [US1] Extend meaningful component/hook/adapter behavior tests in [actual files], including applicable pending/denied/conflict/stale cases
- [ ] T017 Review F rules, file ownership and matching skills; verify preserved rendering, static copy, navigation and interaction presentation using [relevant browser evidence]

**Checkpoint**: Real accepted behavior uses existing surfaces; unresolved missing UI
or presentation-changing corrections remain owner-decision gates, not checked tasks.

## Phase 4: Selected-Scope Review and Phase Exit

- [ ] T018 Update only affected technical/operation docs against final source and apply docs-guard
- [ ] T019 Re-run Constitution Check against actual changed files, file-owner/code-quality review, skill findings and fresh type/lint/format/behavior evidence
- [ ] T020 Run required affected regressions/full current phase-exit checks from [verified scripts]; record services, outcomes and any unverified boundary
- [ ] T021 Record exact completed IDs, batch/backend/whole-phase status, frozen-UI evidence, warnings and remaining owner/release gates in [existing feature/evidence owner]

Only use tasks needed by actual scope. No broad refactors, speculative optimization,
toolkit installation, future-phase requirements or arbitrary file splitting.
Do not mark required unavailable checks or a partial phase complete.

## Dependencies and Bounded Batches

Replace this sample graph with exact IDs and real ownership/dependencies:

1. Selected-phase prerequisites and written-quality gates precede implementation.
2. Contracts/schema/rules and realistic backend tests precede backend acceptance.
3. Each dependent frontend integration waits for its entire required backend group.
4. Review/verification precede task completion; full phase acceptance also requires
   all remaining selected-phase deliverables and exit gates.
5. Independent files/checks may be grouped only after their prerequisites hold.
   No parallel writers to a shared schema/contract/service/task state.

| Batch                | Exact IDs | Prerequisite evidence | File owners      | Actual verification   |
| -------------------- | --------- | --------------------- | ---------------- | --------------------- |
| [next bounded batch] | [IDs]     | [passed gates]        | [existing paths] | [commands/boundaries] |

The owner selects exact IDs, a bounded batch, NEXT_DEPENDENCY_SAFE_BATCH or
ALL_ACTIVE_PHASE_TASKS at IMPLEMENT time. Resolve/report next-batch IDs before edits.
All-active covers only remaining approved tasks in this feature, in small batches.
A list of tasks never authorizes another command or roadmap phase.

## Completion and Convergence

Requirements checklist approvals stay read-only during implementation. Mark permitted
tasks complete only after their implementation and required checks pass. Preserve
completed IDs/evidence and record failures, cached versus fresh and unperformed checks.
Convergence runs only when requested after implementation; it appends traceable new
remediation IDs without rewriting these tasks or fixing code. Clean convergence
leaves this file byte-for-byte unchanged. Repairs require separately selected IDs.
No unasked commit/push/issues/deployment/destructive DB actions or external messages.

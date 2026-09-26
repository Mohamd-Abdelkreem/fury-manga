---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Meaningful automated tests are REQUIRED for every changed behavior. Select
the evidence boundary required by the specification and constitution; capability-specific
tests MUST NOT create new product scope.

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

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **API**: `apps/api/src/` with integration setup under `apps/api/tests/`
- **Web**: `apps/web/src/app/`, `apps/web/src/features/`, and established shared components
- **Contracts**: `packages/contracts/src/`
- **Database**: `packages/database/prisma/`, `packages/database/src/`, and
  `packages/database/tests/`
- Use only exact paths selected by plan.md; do not create folders to mirror examples.

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Scope and Baseline

**Purpose**: Reconcile the accepted feature with the current checkout

- [ ] T001 Record git status, preserved user changes, and the accepted PLAN.md phase
- [ ] T002 Confirm exact existing owners, fixture/local sources, and exclusions
- [ ] T003 [P] Confirm applicable repository checks and current configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (include only when required by accepted scope):

- [ ] T004 Add or update shared Zod contracts in packages/contracts/src/[feature]/
- [ ] T005 Add a new forward migration in packages/database/prisma/migrations/
- [ ] T006 Extend existing API composition/middleware without creating a parallel stack
- [ ] T007 Add feature-local service/query/mapper owners in apps/api/src/modules/[feature]/
- [ ] T008 Add only required example configuration; never add secrets
- [ ] T009 Define migration, rollback/recovery, authority, and concurrency decisions

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Design these from accepted behavior, not implementation details. For a bug,
> first reproduce it with a meaningful failing regression.**

- [ ] T010 [P] [US1] Contract test in packages/contracts/src/[feature]/[name].test.ts
- [ ] T011 [P] [US1] HTTP integration test in apps/api/src/[name].integration.test.ts

### Implementation for User Story 1

- [ ] T012 [P] [US1] Add accepted persistence/schema change in packages/database/
- [ ] T013 [P] [US1] Add shared request/output contracts in packages/contracts/src/
- [ ] T014 [US1] Implement service/query/mapper behavior in apps/api/src/modules/[feature]/
- [ ] T015 [US1] Wire the endpoint and/or web feature through existing boundaries
- [ ] T016 [US1] Add validation and error handling
- [ ] T017 [US1] Add logging for user story 1 operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T018 [P] [US2] Contract/component test in the affected package
- [ ] T019 [P] [US2] Integration or browser test at the required evidence boundary

### Implementation for User Story 2

- [ ] T020 [P] [US2] Add the accepted model/contract change in its existing package
- [ ] T021 [US2] Implement use-case invariants in the feature service
- [ ] T022 [US2] Integrate through the existing API and/or web feature boundary
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T024 [P] [US3] Contract/component test in the affected package
- [ ] T025 [P] [US3] Integration or browser test at the required evidence boundary

### Implementation for User Story 3

- [ ] T026 [P] [US3] Add the accepted model/contract change in its existing package
- [ ] T027 [US3] Implement use-case invariants in the feature service
- [ ] T028 [US3] Integrate through the existing API and/or web feature boundary

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional risk-based tests in the affected package
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation
- [ ] TXXX Re-run the Constitution Check against the actual diff and fresh evidence
- [ ] TXXX Record warnings, missing browser/device/production evidence, and phase exit status

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Contract and evidence tasks before or alongside their producer/consumer changes
- New forward migration and real PostgreSQL evidence before accepting schema behavior
- Services/invariants before thin controller/route adaptation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch independent tests for User Story 1 together:
Task: "Contract test in packages/contracts/src/[feature]/[name].test.ts"
Task: "HTTP integration test in apps/api/src/[name].integration.test.ts"

# Launch independent producer/consumer work only when files and prerequisites permit:
Task: "Add shared schemas in packages/contracts/src/[feature]/"
Task: "Add focused frontend state tests in apps/web/src/features/[feature]/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Stop for the required review gate; deployment requires separate explicit authorization

### Incremental Delivery

1. Complete Scope/Baseline + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Review/accept
3. Add User Story 2 → Test independently → Review/accept
4. Add User Story 3 → Test independently → Review/accept
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- For bug fixes, verify the meaningful regression fails before implementing
- Do not commit, push, create issues, deploy, run destructive database operations, or
  contact external systems without explicit authorization
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

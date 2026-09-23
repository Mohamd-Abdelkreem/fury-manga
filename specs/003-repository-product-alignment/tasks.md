# P00 Completion Tasks

**Scope**: `PLAN.md` P00 only. No P01/P02 feature implementation, production migration, reset, deployment, commit, push, or `PLAN.md` edit.

- [x] T001 Preserve current edits; confirm ratified constitution, root guidance links, active P02 pointer, and exact P00/P01 migration order (FR-001, FR-012).
- [x] T002 Add failing shared contract and real HTTP tests for rejected phone input, absent safe output, and preserved account/CSRF flows (FR-003–FR-004; AE-001).
- [x] T003 Add disposable PostgreSQL populated-upgrade tests for forward phone removal, preserved account/session data, and repeat deploy (FR-003–FR-004; AE-002).
- [x] T004 Remove phone from shared auth/account contracts, API account owners, web form values, fixtures and tests; add only a new forward migration after P01, leaving applied migrations/generated output untouched (FR-003–FR-004; AE-001–AE-002).
- [x] T005 Add focused web regressions for reader denial, chapter-number bounds, local completion truth, and disabled ad presentation/detection (FR-005–FR-008; AE-003–AE-005).
- [x] T006 Apply the current protected-route behavior to the sample chapter route and correct the reader's local completion copy (FR-005–FR-006; AE-003).
- [x] T007 Restrict the chapter form to positive integers, preserve drafts on denial, and replace false fixture-save feedback in touched local actions (FR-007, FR-011; AE-004).
- [x] T008 Disable public ad placeholders and detection until P13 while retaining the approved design and ADMIN guard (FR-008–FR-009; AE-005).
- [x] T009 Check in the fixture/local-status inventory; re-run and classify the historical design audit; confirm obsolete concepts remain absent and documentation matches source (FR-001–FR-002, FR-010–FR-011; AE-006).
- [x] T010 Run focused contract/database/API/web tests and real-browser reader/RTL checks; record actual results and limits (FR-012; AE-001–AE-006).
- [ ] T011 Run relevant lint, type, build, format, `pnpm verify`, and `git diff --check` without weakening gates; record every failure or unverified boundary (FR-012; SC-006).
- [ ] T012 Reconcile the final diff against every P00 exit criterion, obtain independent phase disposition, and mark P00 complete only if each applicable gate truly passes (FR-001–FR-012; SC-001–SC-006).

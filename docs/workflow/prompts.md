# Fury phase launchers

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

Copy one prompt at a time. Replace `<PHASE_ID>` with the exact phase ID/title from
`PLAN.md`; do not infer it from the feature-directory or branch number. Reuse the
phase's existing accepted artifacts. The
[prompt pack](speckit-prompts.txt) supplies the operating contract; the
[operating policy](operating-policy.md) defines evidence and acceptance.

The usual sequence for one phase is Specify, Clarify, Plan, Checklist, Tasks,
Analyze, Implement, Converge. Each prompt authorizes only its own step. Repeat
scoped implementation batches until the selected phase's tasks are complete;
convergence findings return to separately requested implementation of those IDs.
Do not restart valid completed steps or advance to another phase automatically.

These are Codex skill invocations and natural-language bindings, not terminal
commands or CLI flags. The existing frontend remains frozen in every step.

## Specify

```text
$speckit-specify
PHASE_ID=<PHASE_ID>
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: SPECIFY only. Reuse an existing accepted feature for this phase.
Keep the current Fury frontend completely unchanged. All artifacts/reports in English.
```

## Clarify

```text
$speckit-clarify
PHASE_ID=<PHASE_ID>
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: CLARIFY only for the matching existing feature. Resolve repository facts
from source; ask only material unanswered product questions. Do not reopen settled
decisions or change frozen frontend presentation. All artifacts/reports in English.
```

## Plan

```text
$speckit-plan
PHASE_ID=<PHASE_ID>
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: PLAN only. Name actual code owners, applicable engineering rules, backend
acceptance before existing-UI integration, real tests and remaining decision gates.
Keep the current frontend completely unchanged. All artifacts/reports in English.
```

## Checklist

```text
$speckit-checklist
PHASE_ID=<PHASE_ID>
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: CHECKLIST only. Assess written requirements/design quality and the backend
gate/frontend freeze. Leave new custom checklist items unchecked; do not claim
implementation or test acceptance. All artifacts/reports in English.
```

## Tasks

```text
$speckit-tasks
PHASE_ID=<PHASE_ID>
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: TASKS only. Preserve existing IDs/progress. Use exact paths and dependency-safe
batches, actual automated test work and explicit backend acceptance before frozen-UI
integration. Do not execute any task. All artifacts/reports in English.
```

## Analyze

```text
$speckit-analyze
PHASE_ID=<PHASE_ID>
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: ANALYZE only, strictly read-only. Verify the existing pointer/spec match
this phase. Do not change files, markers or pointer, or run artifact-writing checks.
Report traceable findings and readiness gates in English.
```

## Implement the next bounded batch

This is the recommended implementation launcher. It explicitly authorizes the
pack's requirements-checklist review preflight before the implementation skill.
The agent must resolve/report the next exact IDs and execute only those IDs.

```text
PHASE_ID=<PHASE_ID>
TASK_SCOPE=NEXT_DEPENDENCY_SAFE_BATCH
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: IMPLEMENT only. First perform its evidence-based checklist review preflight;
only after all required gates pass invoke $speckit-implement with this phase and
resolved task scope. Preserve frozen frontend presentation and complete/test the
required backend group before connecting existing UI. Report batch and phase status
separately in English. Stop without running convergence or another batch automatically.
```

## Implement exact tasks

Replace `<TASK_IDS>` with actual IDs from this feature's tasks.md, including necessary
authorized prerequisites. This is also the launcher for convergence remediation.

```text
PHASE_ID=<PHASE_ID>
TASK_SCOPE=<TASK_IDS>
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: IMPLEMENT only. Perform the checklist review preflight, verify dependencies,
then invoke $speckit-implement only if gates pass and only for these exact IDs.
Other tasks/checklist approvals remain read-only during implementation. Preserve the
current frontend completely. Report real checks and remaining gates in English; stop.
```

## Implement all remaining tasks in one selected phase

Use this only when consciously authorizing the whole selected phase. Internal
dependency-safe batching and the backend/frontend gate still apply.

```text
PHASE_ID=<PHASE_ID>
TASK_SCOPE=ALL_ACTIVE_PHASE_TASKS
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: IMPLEMENT only. First perform its checklist review preflight; after gates
pass invoke $speckit-implement for remaining approved tasks in this feature only.
Use small internal batches, complete/test backend groups before dependent integration,
and preserve current frontend presentation. Do not repeat completed tasks, run
convergence automatically or start another phase. Report actual evidence in English.
```

## Converge

```text
$speckit-converge
PHASE_ID=<PHASE_ID>
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: CONVERGE only after this feature's implementation has run. Inspect actual
source and recorded evidence. Only append necessary traceable remediation tasks;
do not fix code, rewrite existing artifacts/markers, change the pointer or run
artifact-writing checks. Keep a clean tasks.md byte-for-byte unchanged. Report in English.
```

## Amend the constitution only when project policy changes

Replace `<OWNER_APPROVED_POLICY_CHANGE>` with the explicit accepted decision.
Do not run this per roadmap phase. A normal phase prompt cannot change the freeze.

```text
$speckit-constitution
OWNER_APPROVED_POLICY_CHANGE=<OWNER_APPROVED_POLICY_CHANGE>
Read docs/workflow/speckit-prompts.txt. Apply OPERATING CONTRACT and execute
PROMPT: CONSTITUTION only. Preserve useful Fury rules and unchanged application code.
Update version/date/synchronization report and only affected guidance/templates.
Keep original ratification date and distinguish policy from implementation evidence.
All artifacts/reports in English. Stop without executing the roadmap.
```

## Static application audit

For a separate report-only source audit, use
[application-audit-prompt.md](application-audit-prompt.md). It does not authorize
implementation, Spec Kit task creation or dynamic application checks.

## One-off legacy backlog closeout

Use [legacy-closeout-prompt.md](legacy-closeout-prompt.md) when explicitly authorizing
the existing legacy feature set to be finished before another specification. This
is a bounded master workflow with automatic continuation across its allowlisted
features; it does not change the ordinary one-command/one-phase launchers.
It preserves the frontend freeze and requires actual implementation and acceptance
evidence instead of automatically checking old tasks.

```text
Read docs/workflow/legacy-closeout-prompt.md and execute its Request in full.
I explicitly authorize its one-off dependency-ordered closeout across the six
allowlisted existing features, including scoped reconciliation, analysis,
implementation, verification and convergence loops. Continue through permitted
batches/phases without routine continuation questions. Preserve the current frontend
completely and honor all actual approval/acceptance gates. Finish the legacy work;
do not create a new spec or implement future-only roadmap phases. Report unsupported
closure as incomplete. Do not commit, push or deploy. All artifacts/reports in English.
```

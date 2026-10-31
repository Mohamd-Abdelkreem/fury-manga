# Fury work planning and acceptance

This policy implements the [constitution](../../.specify/memory/constitution.md).
Use the [prompt pack](speckit-prompts.txt) for the selected Spec Kit command and
[launchers](prompts.md) for copyable requests. Documentation does not install tools,
change model settings, enforce permissions or establish a verification result.

## Authority and scope

Explicit current owner decisions govern authorized work. The constitution governs
engineering and delivery; accepted `PLAN.md` and feature requirements govern product
intent; the [engineering map](../engineering/README.md) governs code placement.
Source, configuration and fresh checks establish implementation reality. Resolve
conflicts explicitly rather than copying fixtures or weakening accepted requirements.

Use the current session's model/settings. Codex may plan, implement, write tests and
review directly. No provider, effort level, profile, orchestrator installation or
separate implementer/tester is mandatory. Delegate only when the owner explicitly
requests it; provide any authorized worker the actual scoped instructions and owners.
Quota exhaustion preserves resumable evidence and stops; it does not authorize a
silent provider change or a claim that unfinished work passed.

Execute one selected roadmap phase and one selected command at a time. Stop after
the requested command/task scope and after each phase unless the owner explicitly
authorizes continuation. A roadmap list, generated next-step suggestion, internal
task-group number or copied prompt pack is not continuation authorization.

## Frozen frontend and backend gate

The current Fury frontend is frozen under constitution VI. Preserve public, reader,
account, workspace and admin pages, URLs, layouts, navigation, dialogs/popups, static
copy, typography, Arabic/RTL, styles, spacing, breakpoints, controls, imagery
treatment, motion and interaction presentation. Root `DESIGN-SYSTEM.md` is a visual
reference; historical audit recommendations do not authorize changing the current UI.

Authorized integration replaces fixture/local sources through validated API adapters
and hooks and connects existing controls/feedback to real behavior. Invisible
extraction is allowed only within the requested scope and with unchanged presentation.
Do not create missing surfaces, conceal an outcome, or drop a security/product
requirement. Record the exact conflict and the owner decision needed; a separate
explicit decision and constitutional amendment are necessary to change the freeze.

Before dependent frontend integration, complete and test the required backend group:
contracts, migrations/constraints, current authority, rules, queries/mappers,
services/endpoints, applicable media/provider work and failure handling. Record actual
acceptance evidence. Keep backend and frontend groups in one feature when the selected
phase owns both. Do not repeat completed setup or treat a partial group as a phase exit.
Recorded isolated-development exceptions retain only their original scope; they do
not waive the freeze, backend acceptance or real-data release gates.

## Intake and feature selection

1. Read applicable agent instructions, the constitution, the whole roadmap and the
   selected feature. At a phase start read every Markdown file directly under
   `docs/engineering/`; revisit relevant rules/source for each bounded batch.
2. Inspect git status and preserve existing edits/untracked work. Establish what is
   persistent, fixture-backed, missing, conflicting and actually verified.
3. Bind the owner's `PHASE_ID` to its exact title and feature spec. Check
   `.specify/feature.json` directly. Phase IDs, directory numbers and branch names
   are independent. Do not guess the phase from a numeric prefix.
4. Reuse accepted artifacts and completed task IDs. A mismatched pointer requires
   selection of the intended existing feature before downstream commands. Analysis
   and convergence never change it. Do not regenerate artifacts to obtain a clean gate.
5. Record deliverables, exclusions, predecessor/backend gates, existing frozen
   surfaces, applicable B/F rules, review skills and actual verification commands.

## Task brief and implementation scope

Use the active feature's plan/tasks rather than creating a document for every field.
A useful bounded brief states:

| Field         | Required content                                                         |
| ------------- | ------------------------------------------------------------------------ |
| Identity      | Phase, feature path, exact task IDs and observable outcome               |
| Prerequisites | Predecessor/backend evidence and remaining gates                         |
| Inputs        | Actual source/callers, contracts, frozen surfaces, edits to preserve     |
| Ownership     | Expected files and responsibility of each; relevant B/F IDs              |
| Behavior      | Actors, success/failure, bounds, duplicates, stale/concurrent outcomes   |
| Verification  | Actual test-file work, scripts, services, review and browser evidence    |
| Limits        | Exclusions, allowed operations and consequential decisions               |
| Return        | Changed paths, actual checks, findings, incomplete gates and next action |

`IMPLEMENT` requires `TASK_SCOPE`: exact IDs, an explicitly selected dependency-safe
batch, `NEXT_DEPENDENCY_SAFE_BATCH`, or `ALL_ACTIVE_PHASE_TASKS`. Resolve/report the
exact next-batch IDs before editing. All-active means remaining approved tasks in
this feature only, executed in small batches. Missing or ambiguous scope never means
all tasks. Preserve completed work; out-of-scope task lines remain read-only.

Parallel task markers describe dependency/file independence, not authorization to
spawn agents. Shared schema, contract, service and task-list writers need sequential
ownership. One completed batch or backend group does not establish the whole phase.

## Requirements review before implementation

The IMPLEMENT launcher authorizes evidence-based review of existing checklists first.
Review every file/item scanned by the installed skill. Mark only supported items;
preserve questions, IDs, accepted decisions and concise evidence references.

Requirements-quality approval means complete, consistent, clear and testable written
requirements. It does not mean code exists or tests passed. Other checklist kinds
keep their own criteria; do not reinterpret future execution checks as requirements
approval. New custom requirement-quality checklists stay unchecked until reviewed.
Put implementation acceptance work in tasks instead of a checklist that must falsely
pass before implementation can begin.

Unresolved checklist items, analysis blockers, predecessor/backend gates or UI
decisions stop dependent implementation. Do not bypass them through the generic
skill's proceed-anyway option. During implementation checklist approval markers are
read-only. Task checkboxes change only after actual in-scope work and required checks.

## Review and correction

For every bounded implementation batch:

1. Implement only the accepted behavior through its existing owners.
2. Review the actual diff and immediate callers using the same engineering rules.
   Check B33, error/type/query/mapper owners, dependency direction, meaningful reuse,
   names, failure paths, authority, contracts, data and preserved presentation.
3. Apply installed matching skills: `clean-code-guard` for nontrivial production,
   `test-guard` for changed tests, `docs-guard` for technical docs and
   `vercel-react-best-practices` for React/Next. Other skills apply by their scope.
   Review-only command boundaries override any generic fixing instruction.
4. Run focused behavior checks and affected shared regressions. Use real migrated
   PostgreSQL for persistence/concurrency/rollback claims and actual browser evidence
   for browser-only claims. Missing infrastructure leaves the relevant gate open.
5. Fix required in-scope findings; diagnose whether a failure belongs to code, tests,
   environment or an owner decision. Never weaken valid tests or change policy to pass.
6. Record actual results, warnings, unavailable checks and batch/phase status.

For documentation-only work, check formatting, links, commands, references and
examples. Do not run unrelated application suites or an aggregate that formats the
schema/generates artifacts. For implementation, use the checks required by the
accepted plan and run full current verification at phase exit/before release.

## Analysis and convergence boundaries

`ANALYZE` reads artifacts and reports traceable findings; it edits no files or markers.
`CONVERGE` inspects current in-scope implementation and recorded evidence. Its only
write is a new convergence section at the end of the selected tasks.md, using new
unique IDs. It never fixes code, changes old tasks/spec/plan, changes the pointer, or
runs artifact-writing tests/builds. Missing required evidence becomes a gap/task.
If no gaps remain, leave tasks.md byte-for-byte unchanged. Repairs require a separately
authorized IMPLEMENT request for the appended IDs, followed by requested convergence.

## Completion, resume and external authority

Reports identify phase/feature/task scope, changed paths, real test work, commands and
outcomes, applicable review findings/fixes, frozen-UI evidence, warnings and remaining
gates. Distinguish fresh execution, reused/cached evidence and unperformed checks;
distinguish batch, backend group, whole phase and release acceptance.

Preserve resumable status in the existing feature/evidence owner: reviewed revision,
completed IDs, pending work, results, decisions and next action. On resume reconcile
actual files and any unfinished external operation before retrying. No mandatory
machine-local orchestrator/checkpoint directory is introduced by this policy.

Specifications, plans, prompts, task briefs and reports are English. Product UI
retains its current copy/language under the freeze; chat follows the owner's language.
Commit/push, issue creation, deployment, destructive database operations and external
messages require their actual explicit authorization. A passing local suite is not
release approval. No command starts another phase or command automatically.

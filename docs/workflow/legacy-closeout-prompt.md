# Fury legacy backlog closeout prompt

Use this request once to finish the existing legacy feature backlog before creating
another feature specification. It is an explicit, bounded continuation request;
ordinary phase launchers remain unchanged. Saving this document does not execute it.
Copy the request below, or explicitly ask the agent to execute this file's request.

## Request

Complete Fury's existing legacy implementation and acceptance backlog. Inspect all
old artifacts, implement the missing approved behavior, resolve legitimate defects,
run the required verification, reconcile task status and prove the legacy admission
gates. Do not stop after an audit, plan or a list of recommendations when authorized
implementation can continue. The outcome is working, verified behavior and truthful
closure, not a collection of checked boxes.

The goal is zero **unmet** legacy prerequisites for the next specification, not
removing valid dependencies on completed foundations or promising defect-free code.
Do not create the next specification during this request.

### 1. Explicit scope and continuation authority

The legacy allowlist is the following existing feature set. Verify each mapping
against its current spec and `PLAN.md`; never equate feature numbers with phase IDs.

| Roadmap phase | Existing feature directory               |
| ------------- | ---------------------------------------- |
| P00           | `specs/003-repository-product-alignment` |
| P01           | `specs/001-content-domain-foundation`    |
| P02           | `specs/002-persistent-vps-media`         |
| P03           | `specs/004-admin-categories-works`       |
| P04           | `specs/005-admin-chapter-publishing`     |
| P05           | `specs/006-public-catalog-discovery-seo` |

I explicitly authorize a one-off cross-phase closeout of this allowlist, including
necessary artifact reconciliation, analysis, implementation, verification and
convergence loops. Continue automatically between dependency-safe batches and these
legacy phases while their required gates permit it. This request supplies the
continuation authority; no individual Spec Kit command authorizes its successor.
Use one feature and one explicit task scope at a time, in real dependency order.

For each implementation batch, resolve/report the exact actionable task IDs and
bind `PHASE_ID` and `TASK_SCOPE` before edits. Do not ask me to reauthorize ordinary
batches or repeat values already supplied. This is not permission for the full
future roadmap, another feature, new product decisions or presentation changes.
Do not create duplicate specs, regenerate accepted artifacts wholesale or rerun
SPECIFY merely because old artifact numbers differ from the roadmap.

Include unfinished approved tasks, required phase-exit evidence and actual gaps
against the allowlisted features' existing requirements, even when their task lists
are already checked. New remediation tasks must trace to those requirements or
applicable current engineering rules. Future-only roadmap work without an existing
allowlisted owning requirement is excluded. Audit recommendations alone do not
authorize implementing a later phase.

### 2. Establish the current authority and baseline

Read `AGENTS.md`, applicable nested instructions, the populated constitution,
the whole `PLAN.md`, all eight `docs/engineering/*.md` guides,
`docs/design/design-system.md`, `docs/workflow/operating-policy.md` and
`docs/workflow/speckit-prompts.txt`. Read the installed skills before using them.
Use current session settings; delegate only if I separately request delegation.

Inventory and read every allowlisted spec, plan, tasks file, checklist, contract,
research/design artifact, amendment and execution/acceptance record. Trace relevant
cross-feature references and inspect actual source, callers, migrations, test
discovery, manifests and configuration. Read historical status/audit documents as
dated evidence, not current authority or permission to expand scope.

Record the starting revision, branch, working-tree changes and feature pointer.
Preserve unrelated work and accepted behavior. Distinguish persistent functionality,
fixture/local-only behavior, planned work, missing implementation and absent proof.
Do not trust task markers or old test counts without checking what they establish.

### 3. Preserve the current frontend absolutely

The existing public, reader, account, workspace and admin presentation remains
frozen. Do not add, delete, move, rename, rebuild or redesign pages, routes, layouts,
navigation, dialogs/popups, controls or static copy. Preserve typography, Arabic/RTL,
colors, spacing, breakpoints, sizes, icons, imagery treatment, motion and interaction
presentation. Root `DESIGN-SYSTEM.md` is a reference, not permission to normalize UI.

Complete and verify the whole required backend group before connecting its frontend.
Wire real validated data, handlers, authorization and query/mutation state through
existing API/hooks, controls and feedback surfaces. Bounded invisible extraction may
preserve presentation; a new screen or changed text is not invisible integration.

An old task/spec/design recommendation cannot override the current freeze. Identify
obsolete presentation instructions and their current governing policy. Do not
implement them, silently delete them, hide failures/success or drop the underlying
business/security requirement. A genuinely missing surface or incompatible copy is
an explicit owner-decision gate. Continue independent permitted work; do not mark
the blocked integration complete. This closeout request does not amend the freeze.

### 4. Build one evidence-based closeout register

Create `docs/product/legacy-closeout.md` if absent; otherwise resume its existing
record after reconciling actual files. Keep detailed execution evidence in each
feature's established evidence owner and link it rather than duplicating reports.

Record every legacy task as `feature path + task ID`, its requirement, dependencies,
actual state, evidence, remaining action and final disposition. Include checked
tasks, unmet phase exits and any newly discovered in-scope gap. Identify shared
root causes and duplicate remediation without losing original task identities.

Use explicit dispositions:

- VERIFIED COMPLETE: actual required implementation and evidence support closure.
- ACTIONABLE GAP: approved work or required verification still needs execution.
- SUPERSEDED: a cited current policy/explicit owner decision replaced the old task;
  preserve the original identity, explain replacement coverage and record the
  disposition separately. Do not tick it as successfully implemented.
- OWNER DECISION REQUIRED: a real product, presentation, human approval or acceptance
  decision cannot be made by the agent.
- EXTERNAL EVIDENCE REQUIRED: required real-data, environment, device, reviewer or
  release proof cannot currently be established.

Future-only work stays outside the closeout allowlist; do not relabel legitimate
legacy gaps as future work. Existing independent-review or human-signoff requirements
need actual qualifying evidence; do not impersonate the reviewer or fabricate approval.

### 5. Execute the dependency-ordered closure loop

1. Start with the earliest unmet prerequisite in the actual phase dependency graph.
   Recheck existing implementation before rebuilding anything. Accepted local
   synthetic-data exceptions retain only their recorded development scope; they
   do not establish formal predecessor exits, real-data release or visual approval.
   Reconcile already applied setup/migrations using real recorded history; do not
   replay destructive setup or fabricate the original execution chronology.
2. Select the matching existing feature between commands. This request explicitly
   permits changing `.specify/feature.json` only to select an allowlisted feature
   between stages. Use the inspected supported mechanism or a narrowly scoped
   pointer edit; never invent CLI flags. Record selection and verify spec/phase
   agreement. Do not change selection during ANALYZE, CONVERGE or IMPLEMENT.
3. Perform evidence-based requirements-checklist review and honor prerequisite
   gates. A requirements-quality approval means clear, consistent, testable written
   requirements; it is not a code/test pass. Other checklist kinds retain their
   actual criteria. Approval markers stay read-only during implementation.
4. Analyze existing artifacts read-only where needed. Explicitly authorized targeted
   reconciliation may repair contradictions against current governing rules and
   clarify existing accepted intent in its owning artifact. Preserve IDs, history
   and unrelated decisions. Do not invent new product policy, weaken acceptance,
   rewrite applied migrations or regenerate a progressed task list.
5. Invoke the installed IMPLEMENT skill with exact selected task IDs. Follow the
   prompt pack's preflight and real backend-before-frontend gate. Create/extend
   meaningful automated tests, implement the missing behavior and fix required
   in-scope defects. Follow actual Fury owners, B33, shared contracts and existing
   auth/transport/media boundaries. Do not merely document the remaining code work.
6. Review actual changes and immediate callers against applicable B/F rules and
   matching installed skills: clean-code-guard, test-guard, docs-guard and
   vercel-react-best-practices according to their scopes. Read relevant installed
   Next.js guidance before framework-dependent changes. Resolve required findings.
7. Run focused checks and affected shared regressions. Use real isolated migrated
   PostgreSQL for database/race/rollback, the actual Express stack for HTTP authority,
   actual isolated storage for file claims and real browsers for browser-only
   claims and unchanged presentation. Record fresh commands/results and warnings.
8. Run CONVERGE after implementation, within its append-only boundary. It inspects
   source and recorded execution evidence, runs no artifact-writing checks and
   changes only a new convergence section in the active tasks.md. If necessary,
   append traceable in-scope remediation tasks with new IDs, then return to separately
   bound IMPLEMENT batches under this master request. Do not duplicate resolved gaps.
   Reuse adequate unfinished tasks for the same gap instead of appending duplicates.
9. Continue until the feature's actionable backlog and required acceptance gates
   are genuinely closed. Then continue to the next dependency-admitted allowlisted
   feature without another routine continuation question. Do not cross an unmet
   dependency unless an existing explicit scoped exception actually permits the
   particular development work; never claim that exception accepted the dependency.

Requirements/checklist and phase-exit gates are not satisfied by speculative claims.
If a decision or external prerequisite is unavailable, record its exact owner,
evidence and smallest needed action. Continue only independent authorized work.
When no meaningful independent progress remains, save a resumable checkpoint and
report the blocker; do not loop, silently waive it or describe closeout as complete.

### 6. Verification and operational boundaries

This request authorizes necessary local implementation verification: isolated
disposable databases/media, local test services, builds, generated artifacts and
relevant browser flows. Inspect actual scripts and their effects first; do not use
an existing developer/production dataset as a disposable fixture. Never reset or
delete unrelated data, replace keys, edit secrets or run production migrations.

Run full current repository verification at actual phase exit and a final shared
regression after the last implementation change, including required integration,
build/output and relevant browser/route checks from actual manifests. The root
`pnpm verify` writes formatted/generated/build artifacts; run it only in the proper
implementation-verification stage, not inside read-only analysis/convergence.

Prove cross-feature contracts and representative journeys introduced by the legacy
work, not only isolated modules. A green unit suite, route smoke, screenshot or
mocked transaction cannot substitute for its required real boundary. Preserve test
integrity: no weakened assertions, hidden skips, arbitrary retries/timeouts or
warning suppression. Fix valid in-scope isolation/harness/implementation failures;
identify an unavailable environment honestly. Preserve unrelated work and clean up
only resources created for this verification.

Do not deploy, push, commit, create issues, message external parties, access
production accounts or execute live provider/business operations under this request.
Authorization for the earlier documentation commit does not extend to future
application changes. Do not change Oscar or another project. Do not install a new
workflow/integration or rewrite the constitution to manufacture closure.

### 7. Completion and handoff to the next specification

Update the closeout register and each relevant existing evidence/status owner with
actual outcomes. Preserve historical reports as dated snapshots; do not rewrite old
results as fresh. Mark original tasks complete only after the necessary work and
checks pass. Keep superseded/blocked dispositions distinct from successful execution.

Declare LEGACY CLOSEOUT COMPLETE only when every applicable legacy task, discovered
in-scope gap and required legacy phase-exit obligation has a supported terminal
disposition and no actionable or required blocked work remains. Otherwise declare
LEGACY CLOSEOUT INCOMPLETE and list exact unresolved feature/task/gate identities.

Separately report READY FOR NEXT SPEC or NOT READY FOR NEXT SPEC, based on the actual
next roadmap phase's admission requirements. Identify its completed legacy inputs,
contracts and evidence links. Do not misclassify an admission gate as release-only
to obtain a pass. Distinguish documented release-only evidence from prerequisites
for the next specification, citing the owning requirements. A readiness result for
specification is not deployment/release approval or proof that future work has no risks.

Return an English summary with the allowlist, verified/reconciled/completed IDs,
remaining gates and owners, code/docs changed, tests actually added/executed,
fresh versus reused/unperformed evidence, preserved-frontend evidence and both final
statuses. List exact next actions and the resumable state if incomplete. Restore the
original feature selection after the workflow finishes; on interruption record the
active selection and next exact IDs so work can resume safely. Do not start the next
spec or hide unfinished legacy work in its future tasks.

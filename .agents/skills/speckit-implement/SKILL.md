---
name: speckit-implement
description: Execute the active Spec Kit feature through the configured orchestrator, with delegated implementation, independent tests, and lead review.
metadata:
  source: "Locally adapted from specify-cli 0.12.11.dev0 implementation stage"
---

# Delegated Spec Kit implementation

This project's implementation stage uses `$orchestrator`. Read that global skill,
the root AGENTS.md and `docs/workflow/operating-policy.md`. The current selected
provider is Codex: High lead, Medium implementation, separate Medium test author.
Do not execute the stock all-in-one implementation procedure or invoke the stock
`specify workflow run speckit` runner. If called directly outside the High profile,
report the required `codex --profile orchestrator` launch before executing tasks.

If already inside the orchestrator, continue its current implementation loop; do
not recursively invoke/reinitialize it or acquire the same lock again.

1. Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks
-IncludeTasks` from the project root using PowerShell. Read the resolved spec,
   plan, tasks, constitution and applicable contracts/design/research.
2. Reconcile requirement checklists. Resolve routine documentation omissions from
   evidence; pause only for consequential unknowns. Do not waive failed acceptance.
3. Select the next dependency-ready task in this feature. Name exact ownership and
   send the bounded handoff through the orchestrator to `orchestrator_implementer`
   or `orchestrator_tester` as appropriate. Neither worker advances the task list.
4. The High lead reviews the real diff and relevant checks, diagnoses failures and
   sends corrections to the owning Medium role. It alone marks accepted tasks `[X]`.
5. Repeat only within this feature. Record evidence and state at each handoff/review.
   At feature completion return to the orchestrator for convergence, final report
   and the mandatory phase-end stop. Pending decisions/quota/failures save and pause.

Do not infer publication or destructive-operation authority from extension hooks
or task text. No extension hooks are installed by this setup. If added later,
inspect their actual effects and use the user's authorized scope.

# Work planning, delegation and acceptance

This portable policy records the user's selected collaboration model. Documentation
alone does not install tools, enforce permissions or change model effort. Verify
actual providers, skills and entrypoints before claiming the workflow operates.

## Roles and scope

| Role                 | Owns                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| Codex High           | Intake, planning, relevant research, diagnosis, implementation/test review and acceptance        |
| Codex Medium tester  | Application test files/fixtures and justified test corrections                                   |
| Selected implementer | Application/prototype implementation and application corrections                                 |
| User                 | Consequential product/design decisions, phase continuation and separately authorized publication |

Current provider: **Codex trial**. Use `gpt-6-astra` High for the lead, Medium for
`orchestrator_implementer`, and a separate Medium `orchestrator_tester`. Kimi is a
future selectable provider, not configured or required for this trial. Start the
installed global workflow with `codex --profile orchestrator`, then `$orchestrator`.
Changing a provider later requires explicit selection and a verified adapter.

Codex may maintain documentation/configuration. The implementer may read/run tests
but must not weaken them. A configured test role must actually use the selected effort; text
claiming it is not proof. Missing/quota-limited implementers save/stop rather than
silently switching ownership.

Use the current plan's actual phase IDs and dependencies. A single feature can have
a scoped plan without a master roadmap. Stop after every phase unless the user
explicitly changes continuation policy. A list of phases does not silently override
the stop preference. Resolve important ambiguity but make routine technical choices
within scope autonomously.

## Intake for any project state

Inspect actual code/configuration and the supplied requirements. Identify working,
mock, missing and conflicting behavior. New projects establish necessary design/
architecture; partial projects preserve completed work and fill scoped gaps;
complete projects add only the requested feature and its dependencies.

Design approval covers the relevant scope before adopting new visuals into live
behavior. Do not invent global phase ranges or demand a full-site redesign for
an unrelated backend feature. The project's accepted plan owns sequencing.

## Task handoff contract

Use the active feature's existing plan/task artifact; no extra file per field is
required. A bounded handoff contains all of the following:

1. **Identity/scope:** phase/task, precise outcome, prerequisite status, exclusions.
2. **Inputs:** existing paths, current edits to preserve, contracts and approved design.
3. **Ownership:** expected changed files and the responsibility of each.
4. **Rules:** relevant B/F IDs, linked technical detail and exact code example sections.
5. **Behavior:** authority, happy path, errors, bounds, duplicate/stale/concurrent outcomes.
6. **Verification:** requirements-based tests, real checks and applicable browser gates.
7. **Constraints:** dependencies, package names, runtime versions and allowed operations.
8. **Return:** changed paths, actual check results, open issues and next action.

Do not send only "follow clean code" or load every installed skill/reference.
Skills provide relevant methods; these files own engineering requirements. Avoid
copying entire skills into standards or full manuals into every task.

Every worker handoff must include accessible relevant instructions/references; Codex's
loaded skills and private conversation do not automatically transfer. The final
adapter must prove what context and permissions the implementer actually receives.

## Example bounded handoff

```text
Task: Add the accepted title-edit operation for the selected resource.

Read: actual resource/auth/transport owners and the accepted request/output contract.
Apply: B01, B03-B08, B12-B16, B22, B31, B41, B45-B49;
        F01, F02, F06-F08, F24-F28 where the UI is affected.
Reference: backend layer example, shared contract, editor/conflict and access examples.
Adapt fictional names to the actual project. Do not introduce an example table blindly.

Implement: validated HTTP boundary, owned version-conditional write, safe mapping,
           and scoped UI integration required by the accepted task.
Preserve: existing auth/client/query/form owners and unrelated edits.
Tests: Codex Medium owns test changes. Run the agreed checks and report failures.
Return: diff summary, actual commands/results and unresolved decisions.
Stop: complete this bounded task; phase continuation follows the phase policy.
```

The real brief supplies precise paths and acceptance values. This template is not
authorization to invent the feature, schema or test expectations.

## Execution and correction loop

1. Read applicable instructions and actual state; establish scoped acceptance.
2. Run the installed Spec Kit or selected planning process using its verified
   entrypoints. Do not invent command names or pretend an integration is installed.
3. Arrange independent test work when interfaces/behavior are defined.
4. Delegate one bounded implementation task with the context above.
5. Review the actual diff, not only the implementer's report. Trace applicable
   layer/contract/data/security/UI behavior and run meaningful checks.
6. Diagnose each failure: implementation, test, environment or missing decision.
   Send code corrections to the selected implementer; justified test corrections to the test owner.
7. Recheck changed behavior and affected integration; record completed evidence.
8. At phase completion, report and pause under the user's continuation policy.

After three unsuccessful correction rounds, the lead diagnoses the root cause and
sends a materially improved brief to the same implementer. If the next attempt still
makes no measurable progress, save the blocker and ask for the needed intervention.
Do not loop indefinitely, reset a database or weaken requirements to claim success.

## Acceptance checklist in the phase report

- Requested behavior and applicable boundaries are implemented.
- Relevant B/F rules hold, with specific explained exceptions.
- Actual file responsibilities and architecture remain coherent.
- Public contract, authority, data constraints and error semantics agree.
- Applicable concurrency/rollback and private-data absence are demonstrated.
- UI states/drafts/cache/access and approved appearance meet the requested scope.
- Actual applicable checks passed; warnings and unverified browser/device gates
  are explicit. No historical/cached output represented as fresh.
- No unrelated change, hidden fallback or invented provider result.
- Reviewed source revision/worktree state and next action are recorded.

Tests/lint cannot guarantee flawless output. Independent review plus real verification
is required; a Markdown rule alone cannot guarantee that an implementer follows it.

## Resume and authorization

Persist phase/task status, exact reviewed work, check outcomes, unresolved decisions
and next action in the runtime's established checkpoint owner. On resume reconcile
the tree and unfinished external operations before retrying. Prevent overlapping
runs from mutating the same task state. Quota exhaustion saves and stops.

Questions, specs, task briefs and reports are English. Product UI follows the client's
approved language/direction. Chat language follows the user's preference.

Design approval identifies scope/revision. Do not infer commit/push/deployment or
external-message authorization from a plan entry. Follow actual user authorization
without adding unnecessary per-task confirmations.

## Setup boundary

The global `orchestrator` skill and profile configure the Codex trial. Project
Spec Kit skills and `.specify/memory/constitution.md` provide the planning integration;
the local `speckit-implement` adapter preserves separate implementation/test ownership.
Use the High-led skill route, not the stock `specify workflow run speckit` runner.

Local `.orchestrator/` checkpoints and the cooperative owner lock are maintained by
the skill's state helper. The lead checkpoints before delegation and after review,
then releases ownership only after workers stop. An abrupt interruption preserves
the last checkpoint; resumption reconciles actual files and worker activity. A stale
lock is never silently stolen. This does not stop unrelated tools from editing files.

Runtime installation and evidence are machine-specific. Copying this rule pack alone
does not install global skills/profiles, configure Kimi or prove model access. Verify
the integration in each environment before claiming the full cycle is operational.

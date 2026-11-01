# Code review procedure

Use this procedure for standalone code reviews, implementation self-review and
phase acceptance. It applies the [constitution](../../.specify/memory/constitution.md)
and [engineering ownership map](README.md); it does not define product features.
The operating policy owns authorization and command boundaries. This guide owns
review preparation, rule coverage, findings and engineering verdicts.

## Establish the scope and authority

1. Resolve the requested revision range, current Git Changes or complete selected
   feature implementation. Record commit IDs and whether staged, unstaged and
   untracked files are included where applicable. Review complete in-scope files
   and relevant callers, contracts, persistence and consumers; a diff fragment alone
   is insufficient. Name any unread or excluded paths.
2. Read applicable agent instructions, the constitution and this ownership map.
   Spec Kit work reads every engineering guide before review; other reviews read
   the guides applicable to their actual boundaries. Inspect current configuration
   and accepted requirements. For a selected phase, verify its roadmap/spec/pointer
   mapping; ordinary maintenance does not invent a phase or modify the pointer.
   Without a feature spec, use the owner request and existing behavior/contracts
   as the requirements baseline; do not invent product scope or acceptance.
3. Select the applicable guide sections and defined B/F rule IDs before judging the
   implementation. Include style, contracts, data, security, testing and design when
   their boundaries are affected. Shared changes include their producer/consumer
   impact. An unchanged caller may expose a defect in changed behavior.
4. A standalone review is read-only unless repairs or a report destination are
   explicitly authorized. During implementation, fix authorized in-scope findings
   before completion. ANALYZE remains read-only; CONVERGE only appends permitted
   remediation tasks. Neither this guide nor a review skill expands those commands.

## Review the same baseline used to write code

Review both dimensions separately:

| Dimension             | Required assessment                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirements          | Accepted behavior, exclusions, authority, contracts, persistence, success/failure and acceptance criteria agree with the implementation.                              |
| Engineering standards | The implementation follows the owning guides and current configuration, including module boundaries, naming, types, style, error handling, tests and maintainability. |

For engineering review, trace each relevant operation from its entry point to its
outcome and failure paths. Use the [module pattern](code-style.md#module-structure-and-pattern-selection)
and existing Fury owners to inspect placement and dependency direction. Review
service/controller class boundaries with B33, domain errors with B12, queries and
projections with B03/B04, composition with B34/B36, shared contracts with B05, and
web API/hooks/model/components with F01. An old neighboring violation is not a new
pattern to copy. Create only the owners justified by actual responsibilities.

Apply the [code-style review gate](code-style.md#review-gate-for-changed-production-code)
to names, cohesive functions, duplication, abstractions, dead code and failure
behavior. Check behavior and authority through applicable B/F rules and the linked
contract/data/security/testing guides. Preserve constitution VI and its exact
exceptions; review advice does not grant presentation changes.

Inspect the installed skill catalog and apply matching guards in the authorized
mode: clean-code-guard for production code, test-guard for test code, docs-guard for
technical docs and vercel-react-best-practices for React/Next.js. A generic skill's
preferences cannot override explicit Fury rules or introduce a role/provider split.
Record what was actually reviewed; listing skill names is not a guard pass.

## Record applicability and evidence

Use the existing feature evidence/report when one is authorized; otherwise report
in the response. Avoid creating a new report file for every batch. Account for each
applicable rule individually or in an explicitly listed group:

| Guide section / defined rule IDs  | Files or boundary reviewed | Status                              | Evidence or capability reason                        |
| --------------------------------- | -------------------------- | ----------------------------------- | ---------------------------------------------------- |
| [Actual owner and applicable IDs] | [Current files/callers]    | PASS / N/A / BLOCKED / NOT REVIEWED | [Concrete observation, check or missing requirement] |

PASS needs an observed implementation and the evidence required at that boundary.
N/A needs a capability reason; it cannot excuse a violated rule in a touched file.
NOT REVIEWED identifies incomplete coverage. BLOCKED identifies unresolved required
correction, missing acceptance evidence or a necessary owner decision. General style
guides without numbered rules are cited by file and heading. Preserve existing rule
IDs; unassigned IDs are not rules and must not be invented or renumbered.

Use actual configured checks appropriate to the change and command authority.
Formatting/lint/types establish their own properties; they cannot prove module
ownership or requirement satisfaction. Follow [testing](testing.md) for PostgreSQL,
HTTP, form/cache and browser boundaries. A read-only review must report required
checks it cannot execute, not run artifact-writing verification to manufacture a pass.
Separate fresh results, reused evidence matching the reviewed source, cached output
and unperformed checks. Preserve warning sources and uncertainty.

## Findings and disposition

Each actionable finding includes:

- Severity and dimension: correctness/requirements, engineering standards or both.
- Current file/line, owning guide section or B/F rule and requirement reference.
- Concrete evidence and the behavioral, authority or maintenance impact.
- The smallest adequate correction and how to verify it.
- In-scope resolution, an authorized follow-up or the exact unresolved blocker.

Avoid duplicate findings and subjective naming/style demands without an adopted
rule or concrete risk. Severity reflects impact, not the number of rules cited.
An applicable mandatory violation blocks engineering acceptance even when tests
pass. Classify existing out-of-scope deviations explicitly; do not silently waive
them, rewrite accepted requirements or start unrelated refactors.

Finish with separate **REQUIREMENTS** and **ENGINEERING STANDARDS** verdicts, each
PASS, BLOCKED or NOT REVIEWED, plus verification results and unverified boundaries.
Overall scope acceptance requires both dimensions and their required evidence to
pass. If no actionable findings remain, report that for the reviewed scope and
state its limits. A code review does not approve artwork, deployment, another phase,
commit/push or other consequential actions.

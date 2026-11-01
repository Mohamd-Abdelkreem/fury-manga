# Fury static application audit prompt

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

Copy the prompt below and replace its target/report placeholders. This is a
report-only source audit, independent of the phase implementation workflow.

| Target           | Suggested report                  |
| ---------------- | --------------------------------- |
| `apps/api`       | `docs/reviews/api-audit.md`       |
| `apps/web`       | `docs/reviews/web-audit.md`       |
| `packages`       | `docs/reviews/packages-audit.md`  |
| `apps, packages` | `docs/reviews/workspace-audit.md` |

These are proposed report destinations, not existing files or evidence of completed
reviews. The report and prompt are English. Product presentation stays frozen.

```text
TARGET_PATHS=<selected existing first-party targets>
REPORT_PATH=<dedicated Markdown report under docs/reviews/>
REPORT_LANGUAGE=English
EXECUTION_MODE=STATIC_ONLY

Inspect the entire selected Fury scope and produce an evidence-backed report of
correctness, authority/security, code structure, maintainability, naming, hardcoding,
duplication, test quality and documented behavior. Preserve all existing edits.

Only REPORT_PATH may be created/updated (including its parent directory). Resolve
it inside this repository's docs/reviews/ with no symlink escape. Do not modify
code, config, dependencies, schemas, migrations, tests, specs, tasks, checklist
markers, the feature pointer or constitution. Do not invoke CONVERGE or repairs.

Read applicable AGENTS.md, the constitution, PLAN.md, every Markdown guide directly
under docs/engineering/ (including code-review.md),
the operating policy and relevant accepted feature artifacts. Distinguish approved
intent, actual implementation, pending roadmap work and historical evidence. Use
the current source/configuration to verify every claimed file/API/script/version.
For Next-dependent analysis read apps/web/AGENTS.md and relevant installed guides.

Inventory every first-party in-scope file before concluding. Read complete text
files in manageable chunks: production, tests, helpers, authored migrations,
styles, config, manifests and docs. Follow relevant callers/contracts/data boundaries.
Exclude dependencies, generated clients, build/cache/coverage, runtime uploads,
backups and real secret files. Inventory binary assets without claiming visual review.
Do not follow external symlinks or expose credentials/personal data. Maintain a
per-file coverage register; if incomplete report PARTIAL AUDIT and unread paths.

Apply clean-code-guard, test-guard, docs-guard and vercel-react-best-practices in
review-only mode where relevant; use security-best-practices for this requested
security review. Missing skills remain explicit limitations. A fixing instruction
inside a skill does not override this report-only boundary.

Apply docs/engineering/code-review.md's coverage and findings procedure to the same
guide sections and defined B/F rules used for code authoring. Give separate
REQUIREMENTS and ENGINEERING STANDARDS verdicts in REPORT_PATH; retain this prompt's
STATIC_ONLY execution and report-only write boundary.

Trace actual responsibility and dependency direction: composition/routes/middleware,
thin controllers, invariant-owning services, query/mapper/error/type owners, shared
runtime contracts and database migrations. Check B33 service/controller boundaries.
On web check feature API/hooks/model/components, central transport/session ownership,
Query cache/draft/access lifecycle, request races and cleanup. Review real observed
deviations; do not demand speculative layers, arbitrary file splits or stylistic churn.

Assess naming by actual domain purpose, including filenames and test helpers. Trace
hardcoded values to their rightful contract/configuration/domain owner. Reuse shared
meaning, not unrelated lookalikes. Independent expected test values and legitimate
protocol/migration/framework names are not automatic defects.

Check current authorization, publication/read access and direct media policies;
bounded validation, safe projection/errors/logs/caches; CSRF/session behavior;
concurrent/stale/replayed operations; rollback, private/public storage, media cleanup
and safe migration/history behavior as applicable. Do not invent financial, OTP,
custody, calendar, payment or other Oscar requirements for Fury.

The current frontend is completely frozen, including routes/layout/navigation,
dialogs/static copy/styles/typography/RTL/responsiveness and interaction presentation.
Identify existing surfaces and real binding gaps. Report needed presentation changes
as owner-decision gates, not authorized fixes. Do not invent missing UI, conceal an
outcome or drop a required security/behavior rule. Backend acceptance is required
before dependent frontend integration. Historical design findings are not permission.

Read tests for observable requirements and realistic boundaries, not only presence
or test counts. Check whether a broken implementation could pass, whether mocks hide
the boundary and whether meaningful authority/failure/race/rollback cases are absent.
Do not rewrite tests or infer a pass from old logs or an earlier agent report.

STATIC_ONLY allows inventory/search/source/status reads. Do not run tests, builds,
formatters, type/client generation, database/Docker/service/browser checks, installs,
scanners or external account/provider calls. Dynamic verification needs a separate
owner request and an inspected isolated execution plan. Do not use pnpm verify.

Report format:
1. Prioritized findings with stable IDs, severity/confidence/category, exact file:line
   evidence, actual impact, smallest correction, responsible owner and relevant rule.
   Group one root cause while listing every confirmed occurrence. Identify whether
   it is a behavior-preserving refactor, bug/security fix, optional improvement or
   frozen-presentation decision. Name focused future verification, not invented passes.
2. Scope/architecture and complete per-file coverage register, exclusions, dependency
   reads, inspected revision/worktree and documentation/skills actually consulted.
3. Compact naming/hardcoding/duplication index referring to finding IDs without
   repeating findings. Do not manufacture entries or arbitrary quality scores.
4. What inspected tests establish, known evidence provenance/age, missing high-value
   cases and static-analysis limitations. State: No application verification commands
   were run; this was a static report-only audit.
5. Prioritized future remediation by finding ID, owner, dependency and acceptance gate.
   Do not create Spec Kit tasks or implement that roadmap during this audit.
6. Unread/unverified boundaries and exact decisions needed from the owner.

Review every report claim/reference against source, check final git status against
the starting state, and confirm the report is your only edit. Do not attribute other
actors' changes to this audit or revert them. Return the report path and short findings.
```

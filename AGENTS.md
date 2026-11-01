# Project engineering instructions

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

Use this Fury baseline for the existing TypeScript/Next.js/Express monorepo.
For Spec Kit work, read every Markdown file in `docs/engineering/`, starting with
[the reference map](docs/engineering/README.md), then apply the rules relevant to the
requested change. For other work, read the map and the relevant guides. General
standards do not define the project's features.

## Establish scope from this checkout

Read applicable nested AGENTS.md instructions, package manifests/configuration,
current source and the user's supplied plan/spec/design. Discover actual package
names, scripts, versions and paths; do not assume example aliases or phase numbers.
Preserve existing edits. When adopting this file in another repository, merge its
instructions with existing project guidance rather than overwrite it blindly.

Plans describe intent; code/check results establish current state. Ask about missing
product decisions when they block work; resolve routine implementation choices
within scope. An old source pattern does not override an explicit adopted standard.

Read the [constitution](.specify/memory/constitution.md) and apply the selected-command
contract in [the Spec Kit prompt pack](docs/workflow/speckit-prompts.txt).
Use [the English launchers](docs/workflow/prompts.md) for each phase/command.
Verify the selected roadmap phase against the feature spec and `.specify/feature.json`;
do not equate phase IDs, directory numbers, branches or internal task-group numbers.

## Frozen frontend and backend-first integration

The current Fury frontend is frozen: no additions, deletions, moves, renames or
redesigns of pages, routes, layouts, navigation, dialogs/popups, controls, static
copy, typography, Arabic/RTL, colors, spacing, breakpoints, sizes, icons, imagery
treatment, motion or interaction presentation. Integrate real backend behavior
through existing API/hooks, controls and feedback surfaces only. Invisible extraction
must preserve presentation. Missing UI or conflicting copy is an owner-decision
gate; do not invent a surface, hide an outcome or remove a requirement. Historical
roadmap/design/spec suggestions do not waive the freeze. Changing it requires a
separate explicit owner decision and constitutional amendment.

Complete, review and test the entire required backend group before dependent
frontend integration. Keep ordered backend/frontend groups in one selected feature
when appropriate; a partial group, fixture or mock success is not acceptance.

## Route the work

- All code: [style](docs/engineering/code-style.md) and the ownership map.
- Code review: [the review procedure](docs/engineering/code-review.md); apply the
  same guides used for authoring, record applicable rule/file evidence and report
  requirements and engineering-standards verdicts separately.
- Backend: [B01–B54](docs/engineering/backend-standard.md), relevant
  [contracts](docs/engineering/api-contracts.md), [data](docs/engineering/data-patterns.md)
  and [security](docs/engineering/security.md).
- Frontend: [F01–F31](docs/engineering/frontend-standard.md), relevant contracts,
  security and [design](docs/design/design-system.md).
- Verification: [testing](docs/engineering/testing.md).
- Scope, verification and decisions: [operating policy](docs/workflow/operating-policy.md).

The rule IDs are stable review references. Embedded code examples illustrate the
pattern; their fictional entity/package names are not dependencies to install.
Never add an example feature merely because it appears in documentation.

Inspect the available skill catalog for each task. Read and apply the matching skill
instructions, including `clean-code-guard` after nontrivial production code,
`test-guard` after test changes, `docs-guard` after technical documentation, and
`vercel-react-best-practices` for React/Next.js work. Apply other installed skills
when their stated scope matches. Do not claim a guard pass without performing it.
For `*.service.ts` and `*.controller.ts`, B33 allows only imports and the exported
class at top level; put class-only helpers inside the class after public methods.

## Ownership and completion

Codex may plan, implement application code, author tests and review changes directly
using the current session settings. There is no required role split, provider,
profile, delegation loop or mandatory Spec Kit pipeline. Use delegation only when
explicitly requested for the current task. Follow the actual scope and permissions.

Stop after each phase unless the user explicitly authorizes batch continuation.
Preserve scoped design approval and consequential decisions. Save resumable evidence
on quota exhaustion; do not infer commit/push/deployment or external-message authority.

IMPLEMENT requires an explicit `TASK_SCOPE` resolved to exact task IDs or the selected
dependency-safe/all-active-phase scope from the prompt pack. Requirements checklist
review precedes implementation; approval markers are read-only during code work.
ANALYZE is read-only. CONVERGE appends remediation tasks only; it does not fix code,
rewrite old tasks, change the feature pointer or run artifact-writing checks.

Use actual repository checks appropriate to the change; never weaken them.
Documentation changes need formatting/reference/example checks, not unrelated
application suites. Report actual results and unverified boundaries honestly.

# Project engineering instructions

Use this portable baseline for the existing TypeScript/Next.js/Express monorepo.
Read [the reference map](docs/engineering/README.md), then only the guides relevant
to the requested change. General standards do not define the project's features.

## Establish scope from this checkout

Read applicable nested AGENTS.md instructions, package manifests/configuration,
current source and the user's supplied plan/spec/design. Discover actual package
names, scripts, versions and paths; do not assume example aliases or phase numbers.
Preserve existing edits. When adopting this file in another repository, merge its
instructions with existing project guidance rather than overwrite it blindly.

Plans describe intent; code/check results establish current state. Ask about missing
product decisions when they block work; resolve routine implementation choices
within scope. An old source pattern does not override an explicit adopted standard.

## Route the work

- All code: [style](docs/engineering/code-style.md) and the ownership map.
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

## Ownership and completion

Codex may plan, implement application code, author tests and review changes directly
using the current session settings. There is no required role split, provider,
profile, delegation loop or mandatory Spec Kit pipeline. Use delegation only when
explicitly requested for the current task. Follow the actual scope and permissions.

Stop after each phase unless the user explicitly authorizes batch continuation.
Preserve scoped design approval and consequential decisions. Save resumable evidence
on quota exhaustion; do not infer commit/push/deployment or external-message authority.

Use actual repository checks appropriate to the change; never weaken them.
Documentation changes need formatting/reference/example checks, not unrelated
application suites. Report actual results and unverified boundaries honestly.

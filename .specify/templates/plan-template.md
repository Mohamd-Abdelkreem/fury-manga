# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**PLAN.md Phase**: [P00-P14 and title] | **Dependencies Accepted**: [list or N/A]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9 on Node.js 24

**Primary Dependencies**: [select the affected installed stack: Next.js 16/React 19,
Express 5, Zod 4, Prisma 7, PostgreSQL 18, React Query 5, or N/A]

**Storage**: [PostgreSQL via @fury/database, approved persistent media, or N/A]

**Testing**: Vitest; Supertest with the real Express stack; PostgreSQL 18
Testcontainers; Testing Library/jsdom; real browser/device evidence where required

**Target Platform**: Next.js web client and/or Linux-hosted Express API

**Project Type**: pnpm/Turborepo web monorepo

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Record `PASS`, `N/A` with a capability reason, or a blocking violation for each gate.

- **Engineering and skill intake**: read every `docs/engineering/*.md` file; list the
  applicable B/F rules, installed matching skills, and required review timing. For
  touched service/controller files, include B33's imports-plus-class boundary.

- **Scope and reality**: PLAN.md phase/dependencies, current executable baseline,
  preserved behavior/user edits, fixture or local sources to replace, exclusions, and
  exit gate are explicit.
- **Authority and privacy**: actors, server auth/status/role/ownership/publication,
  CSRF/rate limits, validation bounds, public projection, safe errors/logs, and secrets
  are defined where applicable.
- **Contract agreement**: shared `@fury/contracts` Zod schemas and exact HTTP/OpenAPI/
  adapter/test agreement are identified.
- **Architecture**: existing API and web owners are named; new abstractions and
  dependencies have a concrete scoped justification. Class-only helpers remain inside
  service/controller classes under `// Helper methods`. Audit touched files for
  misplaced domain errors, types, pure rules, form schemas, transport projection,
  query/cache logic and component behavior; name the responsible owner for each.
  Include `docs/engineering/code-style.md` review of names, function scope,
  dependency direction, duplicated knowledge, dead code and failure boundaries.
- **Data and races**: invariants, constraints/indexes, transactions, duplicate/stale/
  retry/history/deletion/side-effect semantics, forward migration, existing-data
  strategy, and recovery evidence are defined where applicable.
- **Frontend truth and access**: Arabic/RTL, async states, draft/cache/access behavior,
  accessibility/responsiveness/reduced motion, and installed Next.js documentation are
  addressed where applicable.
- **Evidence**: requirements map to meaningful unit, contract, real PostgreSQL,
  real-HTTP-stack, component/hook, browser/device, deployment, or documentation checks.
  Record applicable skill guard passes and actual type/lint/format outcomes.
- **Change safety**: git status, user-owned changes, review and stop gates,
  documentation, unauthorized external actions, and final reporting are explicit.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Keep only the real paths touched by this feature and expand
  them to the responsible modules. Do not create folders merely to match this map.
-->

```text
apps/api/src/                 # Express composition, modules, middleware, infrastructure
apps/api/tests/               # API integration setup when applicable
apps/web/src/app/             # Thin Next.js route composition
apps/web/src/features/        # Feature api/hooks/model/components
apps/web/src/components/      # Established shared UI only when justified
packages/contracts/src/       # Browser-safe shared Zod HTTP contracts
packages/database/prisma/     # Schema and new forward migrations
packages/database/src/        # Database client/server-owned exports
packages/database/tests/      # Schema and PostgreSQL integration evidence
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

Constitution violations cannot be waived here; they require resolution or an accepted
constitutional amendment.

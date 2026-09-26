<!--
Sync Impact Report (2026-09-26)
- Version change: 1.2.0 -> 1.3.0 (mandatory code-quality review at Spec Kit gates)
- Modified principles: IV. Clean Architecture and Maintainable Code;
  VII. Evidence-Driven Testing and Completion
- Added sections: none; expanded Architecture and Evidence constitution checks
- Removed sections: none
- Templates: updated plan-template.md and tasks-template.md; reviewed spec-template.md
  and checklist-template.md with no change; synchronized 004 plan.md and T084
- Runtime guidance updated: docs/engineering/code-style.md and Spec Kit analyze,
  converge, and implement skill instructions
- Follow-up TODOs: pre-existing functional jwt.service.ts naming/ownership remains
  outside the 004 feature scope
-->

<!--
Sync Impact Report (2026-09-26, historical)
- Version change: 1.1.0 -> 1.2.0 (mandatory file-owner review for Spec Kit)
- Modified principles: IV. Clean Architecture and Maintainable Code
- Added sections: none; expanded Architecture constitution check
- Removed sections: none
- Templates: updated plan-template.md and tasks-template.md; reviewed spec-template.md
  and checklist-template.md with no change
- Runtime guidance updated: docs/engineering/README.md, backend-standard.md,
  frontend-standard.md
- Follow-up TODOs: pre-existing functional jwt.service.ts naming/ownership remains
  outside the 004 feature scope
-->

<!--
Sync Impact Report (2026-09-26, historical)
- Version change: 1.0.0 -> 1.1.0 (expanded mandatory intake and review gates)
- Modified principles: IV. Clean Architecture and Maintainable Code;
  VII. Evidence-Driven Testing and Completion
- Added sections: none; expanded Applicability and Delivery Workflow
- Removed sections: none
- Templates: updated plan-template.md and tasks-template.md; reviewed spec-template.md
  and checklist-template.md with no change; commands/ is absent
- Runtime guidance updated: AGENTS.md and docs/engineering/README.md
- Follow-up TODOs: reconcile existing top-level declarations in
  apps/api/src/modules/media/media.service.ts and
  apps/api/src/infrastructure/security/jwt.service.ts during their scoped work
-->

<!--
Sync Impact Report (2026-09-22, historical)
- Version change: unratified placeholder template -> 1.0.0
- Modified principles:
  - Placeholder Principle 1 -> I. Source of Truth and Scope Discipline
  - Placeholder Principle 2 -> II. Secure-by-Default Server Authority
  - Placeholder Principle 3 -> III. One Shared HTTP Contract
  - Placeholder Principle 4 -> IV. Clean Architecture and Maintainable Code
  - Placeholder Principle 5 -> V. Data Integrity, Concurrency, and Migrations
- Added principles:
  - VI. Truthful Arabic-First Frontend
  - VII. Evidence-Driven Testing and Completion
  - VIII. Phase Governance and Change Safety
- Added sections: Applicability and Project Baseline; Delivery Workflow and Constitution Check
- Removed sections: none; template placeholders were replaced by ratified content.
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .specify/templates/checklist-template.md (reviewed; no change required)
  - ⚠ .specify/templates/commands/ (directory is absent; no command templates existed to sync)
- Follow-up TODOs: none. All mandatory paths referenced by root AGENTS.md exist in this checkout.
-->

# Fury Manga Constitution

## Core Principles

### I. Source of Truth and Scope Discipline

- An accepted feature specification MUST define product intent. Current executable
  code, schemas, forward migrations, and freshly run checks MUST define implementation
  reality. A conflict MUST be surfaced and resolved; neither stale prose nor an old
  implementation pattern silently wins.
- `PLAN.md` MUST define the approved roadmap, dependencies, phase boundaries, and exit
  gates. A phase MUST implement only its accepted scope and prerequisites and MUST NOT
  pretend that a later phase already exists.
- Fixture data, local-only state, mock delays, visual controls, browser guards, and
  documentation examples MUST NOT be cited as proof of persistent or authorized product
  behavior.
- Accepted behavior and user-owned changes MUST be preserved. Work MUST NOT include
  unrelated refactors, speculative subsystems, premature abstractions, or invented
  requirements.

This ordering keeps plans honest without confusing roadmap intent, current behavior,
and demonstration-only UI.

### II. Secure-by-Default Server Authority

- The API MUST enforce authentication, active and verified account status, roles,
  ownership, publication and access rules, and every privileged mutation. Browser
  guards MAY improve presentation but MUST NOT grant authority.
- Unsafe cookie-authenticated requests MUST preserve the established double-submit CSRF
  model. Inputs MUST be bounded and runtime-validated at intentional boundaries;
  unsupported or privileged fields MUST be rejected where the contract excludes them.
- Public outputs MUST be explicitly allowlisted. Raw Prisma/provider objects, password
  or token hashes, credentials, secrets, storage paths, provider details, and internal
  metadata MUST NOT cross the public boundary.
- Secrets and credentials MUST NOT enter source control, URLs, logs, client persistence,
  error messages, fixtures, or test output. Example environment files and validated
  configuration schemas MUST be used when documenting environment behavior.
- Existing authentication and privacy guarantees MUST NOT regress: one-time refresh
  rotation, an in-memory access token, an HttpOnly refresh cookie, a readable CSRF
  cookie, safe return paths, rate limits, safe errors, request IDs, and log redaction.

Security is an end-to-end server and data property, not a consequence of hidden UI.

### III. One Shared HTTP Contract

- `@fury/contracts` MUST own browser-safe Zod schemas and inferred types for request
  bodies, params, queries, responses, errors, pagination, and shared enum wire values
  used by the API and web app.
- API DTO modules MUST reuse, re-export, or alias the shared schemas. They MUST NOT
  define a competing wire shape. Database records and generated Prisma types MUST
  remain server-owned.
- Runtime HTTP behavior, OpenAPI, frontend adapters, and contract/integration tests MUST
  agree on method, path, authority, input, output, status, and stable error codes.
- Contract changes MUST update producers and consumers together and MUST include a
  compatibility decision where independently deployed clients may be affected.

One executable wire definition prevents silent drift between TypeScript types,
runtime validation, documentation, and consumers.

### IV. Clean Architecture and Maintainable Code

- Strict TypeScript, exact optional semantics, unknown-error narrowing, type-only
  imports, local package import conventions, ESLint, Prettier, and established public
  boundaries MUST remain enabled.
- Production code MUST NOT use `any`, `ts-ignore`, `ts-nocheck`, fake double casts,
  unjustified non-null assertions, broad lint disables, swallowed failures, false
  success, or hidden fire-and-forget work. A narrow framework assertion or lint
  exception MUST name its validated boundary and have relevant coverage.
- Express controllers MUST remain thin. Services MUST own use-case invariants and
  sequencing; complex queries MUST stay feature-local; composition MUST construct
  dependencies; external providers MUST sit behind injected adapters.
- In every `*.service.ts` and `*.controller.ts`, top-level code MUST contain only imports
  and the exported class. Constants, types, helper functions, and executable statements
  MUST NOT sit outside that class. Class-only helpers MUST be private methods after
  public methods under `// Helper methods`; independently owned types and pure rules
  MUST live in their responsible feature files, as required by B33.
- Before implementing or accepting a feature, agents MUST inspect each touched file
  for misplaced responsibilities and select the owner by behavior and dependency
  direction. Reusable domain errors MUST live in the feature's `*.errors.ts`, module
  types in `*.types.ts`, independent pure rules and transforms in their responsible
  feature or infrastructure modules, and API queries/mappers in their feature owners.
  A private class helper MUST NOT replace a dedicated error or rule owner. On the web,
  form schemas, normalization, command shaping, and error classification MUST live
  in feature `model`; transport projection MUST live in `api`, query/cache lifecycle
  in `hooks`, and rendering/transient interaction in `components`. A model MUST NOT
  import a component. Spec Kit converge and implementation reviews MUST record and
  task any violated owner before declaring completion.
- Next.js pages and client boundaries MUST remain thin. Components MUST NOT call Axios
  directly. React Query MUST own server state; component state and React Hook Form MUST
  own transient interaction and drafts.
- SOLID, DRY, KISS, and YAGNI MUST be applied through concrete responsibilities. Small,
  clear duplication MUST be preferred over premature cross-feature coupling.
- Every review of changed production code MUST apply the `docs/engineering/code-style.md`
  review gate to the files in scope: verify file ownership and dependency direction,
  intention-revealing names, coherent functions, justified abstractions, duplicated
  knowledge, dead code, boundary validation, error handling, and preserved behavior.
  Findings MUST cite a concrete file and rule with the required correction. Reviewers
  MUST NOT turn subjective style preferences into blocking tasks without a specific
  rule violation or maintainability/correctness risk.

Architecture exists to make authority, failure, and ownership visible to maintainers.

### V. Data Integrity, Concurrency, and Migrations

- PostgreSQL constraints, foreign keys, uniqueness, checks, indexes, transactions,
  conditional writes, and appropriate isolation MUST protect real invariants under
  races; application prechecks alone are insufficient.
- Duplicate, retry, stale-write, rollback, deletion, history, and external-side-effect
  semantics MUST be defined whenever the feature can encounter them.
- Migrations MUST be forward-only. Possibly applied migration history and generated
  Prisma code MUST NOT be rewritten or edited manually.
- Every schema change MUST include a safe existing-data strategy, rollback or recovery
  reasoning, and real PostgreSQL integration evidence proportional to its risk.

Database invariants are concurrency controls and historical commitments, not merely
ORM declarations.

### VI. Truthful Arabic-First Frontend

- Accepted Arabic-first RTL behavior, the current route and feature structure, and the
  visual language in root `DESIGN-SYSTEM.md` MUST be preserved unless the accepted
  feature explicitly changes them.
- Every affected asynchronous view or mutation MUST define truthful loading, empty,
  filtered-empty, error, retry, pending, success, conflict, denied, and stale states
  where applicable.
- Fixture data, optimistic state, opened links, queued work, and provider acknowledgement
  MUST NOT be presented as confirmed server truth.
- Accessibility MUST be part of completion: semantic HTML, keyboard operation, focus
  behavior, labels, descriptions, errors, live regions, contrast, responsive behavior,
  and reduced-motion handling MUST be verified where applicable.
- Work that touches Next.js behavior MUST first read the relevant installed guidance in
  `apps/web/node_modules/next/dist/docs`, as required by `apps/web/AGENTS.md`.

The interface must communicate what the system knows, in the approved language and
interaction model, without manufacturing certainty.

### VII. Evidence-Driven Testing and Completion

- Every feature specification MUST require meaningful automated tests appropriate to
  changed behavior. Applicable positive, negative, boundary, validation, authorization,
  privacy, state-transition, failure, and regression cases MUST be covered.
- Contract changes MUST prove producer/consumer agreement. Database and transactional
  claims MUST use real PostgreSQL/Testcontainers. HTTP security and journeys MUST use
  the actual Express middleware stack. Frontend behavior MUST use focused component or
  hook tests and real-browser evidence when jsdom cannot prove the claim.
- A response status or mocked call alone MUST NOT be accepted as evidence of persistence,
  rollback, concurrency safety, authorization, accessibility, or browser behavior.
- Assertions MUST NOT be weakened; tests MUST NOT be skipped; arbitrary sleeps, retries,
  warning suppression, and stale or cached results MUST NOT be used to claim success.
- Completion reports MUST name freshly executed commands, outcomes, warnings, and
  unverified production, browser, or device boundaries.
- Before completion, agents MUST apply available skills that match the changed artifact:
  `clean-code-guard` after nontrivial production code, `test-guard` after test code,
  `docs-guard` after technical documentation, and `vercel-react-best-practices` when
  writing or reviewing React/Next.js code. Other installed skills MUST be applied when
  their stated scope matches the work. Agents MUST read the skill instructions, perform
  their review, and fix applicable findings; listing a skill without using it is not
  compliance. If a named skill is unavailable, report that boundary and perform the
  corresponding repository review directly.
- Spec Kit artifact analysis MUST check that plan/tasks include the applicable code
  style, file-owner, skill and verification gates. Spec Kit converge MUST inspect
  in-scope code against those gates and append a traceable task for each actionable
  constitutional violation. Implementation reviews MUST record the guard-pass result
  and fresh package checks before marking review tasks complete.

Evidence must match the layer and strength of the claim being accepted.

### VIII. Phase Governance and Change Safety

- Each `PLAN.md` delivery phase MUST become one independently accepted Spec Kit feature
  with traceable requirements, decisions, tasks, tests, documentation, and an exit gate.
- Work MUST stop at review gates and after the explicitly requested phase or
  implementation scope. A roadmap entry MUST NOT authorize later phases.
- Agents MUST inspect git status before changes and MUST preserve unrelated or
  pre-existing edits, especially user-owned `PLAN.md` changes.
- Commit, push, issue creation, deployment, destructive database operations, and contact
  with external systems MUST NOT occur without explicit authorization.
- Assumptions, unresolved decisions, missing evidence, warnings, and unverified
  production or device checks MUST be reported honestly.

Independent acceptance limits blast radius and keeps user authority visible throughout
the roadmap.

## Applicability and Project Baseline

This constitution governs the Node.js 24, pnpm 11, TypeScript 5.9 monorepo: Next.js
16/React 19 in `@fury/web`, Express 5 in `@fury/api`, Zod contracts in
`@fury/contracts`, and Prisma 7/PostgreSQL in `@fury/database`. Repository manifests,
configuration, root `AGENTS.md`, applicable nested guidance, and the engineering
reference map MUST be re-read when relevant because versions and paths may change.

Before any Spec Kit specification, plan, task generation, implementation, or review,
agents MUST read every Markdown file in `docs/engineering/`, including the reference
map, not only the files selected by the current feature. They MUST then identify and
apply the rules relevant to the accepted scope; reading all files does not authorize
unrelated implementation. The agent MUST also inspect the current session's installed
skill catalog and read each applicable skill before using it. A plan or review MUST
record the applicable engineering rule IDs and skill gates; implementation MUST check
the resulting code against them before claiming completion.

Capability-specific rules apply only when a feature touches that capability. Media,
advertising, credential URLs, external providers, concurrency control, migrations,
browser/device checks, and other specialized guidance MUST NOT create new product scope
by themselves. An accepted feature MUST name applicable capabilities and mark the rest
not applicable.

The root `DESIGN-SYSTEM.md` is the verified Fury visual reference. The portable
engineering guides define implementation standards, not product features. If a
mandatory referenced guide is missing, the plan MUST record restoration or reference
repair as follow-up work and MUST NOT cite the missing file as authority.

Existing deviations are not precedents. When touched, they MUST be corrected within
the accepted scope or recorded as explicit unresolved work with impact and ownership.
Ratification does not certify that every pre-existing line already complies.

## Delivery Workflow and Constitution Check

Before research and again after design, every feature plan MUST record `PASS`, `N/A`
with a capability reason, or a blocking violation for each check below:

1. **Scope and reality**: identify the `PLAN.md` phase, accepted dependencies,
   executable baseline, preserved behavior and user edits, fixture/local sources to
   replace, explicit exclusions, and the phase exit gate.
2. **Authority and privacy**: identify every actor and server-side auth/status/role/
   ownership/publication rule; CSRF and rate limits where applicable; bounded validation;
   safe outputs/errors/logs; and secret-handling boundaries.
3. **Contract agreement**: identify shared Zod schemas and exact method/path/status/error
   behavior, plus coordinated API, OpenAPI, adapter, and contract-test changes.
4. **Architecture**: assign responsibilities to existing controller/service/query/
   mapper/composition and page/feature-api/hook/component owners; justify every new
   abstraction or dependency against a concrete need. Verify B33's class-only
   service/controller file boundary where those files are touched. Inspect touched
   files for misplaced errors, types, pure rules, form schemas, transport, query/cache
   logic, and component behavior; move each to its responsible owner or record a
   blocking task for Spec Kit converge.
   Apply the `code-style.md` review gate to the named files: names, function scope,
   dependency direction, justified abstractions, duplicated knowledge, dead code,
   boundary and error behavior must have concrete findings or a clean pass.
5. **Data and races**: identify invariants, constraints/indexes, transaction and
   concurrency strategy, duplicate/stale/retry/history/deletion/side-effect semantics,
   forward migration, existing-data handling, and recovery evidence where applicable.
6. **Frontend truth and access**: identify Arabic/RTL preservation, all applicable async
   states, draft/cache/access behavior, accessibility, responsive and reduced-motion
   checks, and installed Next.js documentation consulted when framework behavior changes.
7. **Evidence**: map every material requirement and risk to the correct automated,
   PostgreSQL, HTTP-stack, component/hook, browser, deployment, or documentation check;
   record matching skill guard passes and actual type/lint/format outcomes.
8. **Change safety**: record git status, review/stop gates, documentation updates,
   unauthorized external actions excluded, and the format of the final evidence report.
9. **Engineering and skill intake**: confirm every `docs/engineering/*.md` file was read,
   list applicable B/F rule IDs, identify matching installed skills and when their
   guard passes run, and record any unavailable skill without claiming it was applied.

A blocking violation MUST be resolved in the plan or the feature MUST return for an
accepted specification or constitutional amendment. Complexity Tracking MUST explain
only accepted, concrete exceptions; it MUST NOT waive a non-negotiable rule.

## Governance

This constitution is the highest repository engineering and delivery policy. It does
not invent product behavior: accepted specifications own intent, `PLAN.md` owns roadmap
scope, and current code plus fresh evidence own implementation reality. More specific
guidance MAY add constraints but MUST NOT weaken these principles.

An amendment requires explicit acceptance, a documented rationale and migration impact,
an updated Sync Impact Report, and synchronization of affected Spec Kit templates and
runtime guidance. Versions follow semantic versioning: MAJOR for incompatible governance
or principle removals/redefinitions, MINOR for new principles or materially expanded
obligations, and PATCH for non-semantic clarification.

Every specification, plan, task list, implementation review, and phase acceptance MUST
perform the Constitution Check. Unresolved non-compliance MUST block acceptance unless
the constitution itself is amended. Reviews MUST use the current worktree and fresh
checks rather than inherited claims.

**Version**: 1.3.0 | **Ratified**: 2026-09-22 | **Last Amended**: 2026-09-26

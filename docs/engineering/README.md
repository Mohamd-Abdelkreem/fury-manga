# Fury engineering standards

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

These guides define how to write and review Fury code. Accepted product requirements
in `PLAN.md` and the selected feature define what is built; the
[constitution](../../.specify/memory/constitution.md) defines mandatory scope,
frontend preservation and delivery gates. The current frontend is frozen. This
baseline does not authorize redesign or new product scope.

Read the [operating policy](../workflow/operating-policy.md),
[command contract](../workflow/speckit-prompts.txt) and
[English launchers](../workflow/prompts.md) for one selected phase/command. At phase
start read all eight Markdown files directly in this engineering directory, then
apply the relevant B/F rules and skill gates to each bounded batch and its review.

## One owner per topic

| File                                                   | Owns                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| [AGENTS.md](../../AGENTS.md)                           | Entry and relevant-reference routing                               |
| README.md                                              | This ownership/read/adoption map                                   |
| [code-style.md](code-style.md)                         | Naming, imports, types, functions/classes and shared-code criteria |
| [backend-standard.md](backend-standard.md)             | Backend rule IDs and complete layer-by-layer module example        |
| [frontend-standard.md](frontend-standard.md)           | Frontend rule IDs, feature/form/cache/async examples               |
| [api-contracts.md](api-contracts.md)                   | Shared request/output schemas, DTOs and HTTP boundaries            |
| [data-patterns.md](data-patterns.md)                   | Schema/constraints/query/transaction/migration details             |
| [testing.md](testing.md)                               | Evidence requirements, test examples, suite selection and cleanup  |
| [security.md](security.md)                             | Authority, credential/error/log/cache/media boundaries             |
| [design-system.md](../design/design-system.md)         | Preserving Fury's frozen visual and interaction system             |
| [operating-policy.md](../workflow/operating-policy.md) | Task brief, delegation/review, decisions, phase stops and resume   |

The table is a responsibility split, not a target number of files.
Keep each rule's full explanation in its owner. The backend/frontend ID lists may
point to a cross-cutting guide; examples and review questions implement those rules
rather than create competing versions. Add a file only for a new independent
responsibility that no current owner can reasonably hold.

## Dependency and folder ownership

| Area                   | Responsibility                                                                           | Does not own                                         |
| ---------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Web app/routes         | Route composition, metadata, framework boundaries                                        | Prisma or backend authorization                      |
| Web feature/api        | Contract-aware requests through the existing central transport                           | Rendering or a second HTTP/session stack             |
| Web feature/hooks      | Query/mutation lifecycle and scoped cache effects                                        | Component layout                                     |
| Web feature/model      | Feature types, form schemas, pure transforms, error classification and state transitions | Components or a duplicate server-state store         |
| Web feature/components | Accessible UI and transient interaction                                                  | Direct HTTP requests                                 |
| API composition        | Construct dependencies and mount modules                                                 | Business rules for each endpoint                     |
| API routes/middleware  | Protocol wiring, parsing and request authority                                           | Persistence/business orchestration                   |
| API controllers        | Translate validated HTTP context to use cases and envelopes                              | Queries/transactions                                 |
| API services           | Business rules, authority close to data, transaction and side-effect sequencing          | Provider SDK mechanics or reusable error definitions |
| API feature errors     | Stable domain error classes and safe status/code mapping                                 | Use-case sequencing or provider details              |
| API queries/mappers    | Deliberate DB selections and explicit output projections                                 | HTTP status selection in query helpers               |
| Shared contracts       | Browser-safe wire schemas/types                                                          | Prisma/Express/provider secrets                      |
| Database package       | Schema, migration, client and persistence types                                          | UI/HTTP objects                                      |
| Infrastructure         | Provider, logging and technical adapters                                                 | Product-specific permission decisions                |

Use these responsibilities within the existing tree. Do not relocate working code
just to create every pictured folder. No universal repository layer, base service,
event bus or DI framework is required. Pure rules remain feature-local until actual
independent consumers justify sharing.

## Read according to the task

For Spec Kit workflows, the project constitution requires reading every Markdown file
in this directory before planning, task generation, implementation, or review. Use the
table below to identify which rules apply to the accepted change after that intake.
For work outside Spec Kit, use the table to select the guides to read.

| Requested change          | Read deeply                                                             |
| ------------------------- | ----------------------------------------------------------------------- |
| Small UI/layout change    | Relevant F rules, design and applicable style/tests                     |
| Form/query mutation       | F01/F02/F05–F08/F20/F24/F26/F27 plus contracts/security/tests           |
| Backend command           | Applicable B rules plus its contract/data/security/test sections        |
| Schema/concurrency change | Data, relevant B invariants and real integration evidence               |
| Shared transport/auth     | Security, contracts, relevant B/F lifecycle rules and cross-layer tests |
| Documentation             | Referenced rule ownership, portable links, examples and scope           |

Do not send every document to every task. The brief names the applicable IDs,
specific code examples and existing project files. Follow linked details when the
task touches that boundary; a UI label does not excuse sensitive-data review.

## Example conventions

The worked example uses a fictional Item with title/version and an Account owner.
It demonstrates one authorized conditional update, not a product feature to add.
@workspace/contracts and @workspace/database mean the actual local workspace
packages. Resolve them from manifests; never rename packages to match an example.

Code blocks are labelled by intended responsibility/path. Existing application
seams (Express augmentation, AppError, ResponseHelper, authentication, rate limits,
CSRF, central client and FormField) are reused. Where a representative seam is
shown, adapt the existing owner instead of installing a second implementation.
The examples do not constitute a complete deployable application.

Backend business rules B01–B54 and frontend engineering sections F01–F31 retain
stable IDs for coverage/review. Domain-only source requirements were removed;
only their general engineering lessons remain when applicable. Neither the old
source project's successes nor its remaining blockers are inherited.

## Fury reference owners

The following paths were inspected for the 2026-10-30 governance adoption. They are
existing reference owners, not proof that every implementation complies or every
roadmap feature is complete. Inspect current source/callers before each phase.

| Responsibility               | Existing Fury reference                                                                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Composition                  | `apps/api/src/router.ts` constructs/mounts services, controllers and routes                                                                                |
| Management HTTP              | `apps/api/src/modules/content/content-management.controller.ts` and `content.routes.ts`                                                                    |
| Use cases                    | `category-management.service.ts`, `work-management.service.ts`, `chapter-management.service.ts`, `publication-management.service.ts` in the content module |
| Pure rules/types/errors      | `content.rules.ts`, `content.types.ts`, `content.errors.ts` in the content module                                                                          |
| Queries/projection           | `content.queries.ts` and `content.mapper.ts` in the content module                                                                                         |
| Wire contracts/DTO aliases   | `packages/contracts/src/content/content.schema.ts` and `apps/api/src/modules/content/dto/content.dto.ts`                                                   |
| Admin network/lifecycle      | `apps/web/src/features/admin/api/` and `apps/web/src/features/admin/hooks/`                                                                                |
| Admin pure form/editor rules | `apps/web/src/features/admin/model/`                                                                                                                       |
| Media                        | `apps/api/src/modules/media/`, `apps/api/src/infrastructure/media/` and `apps/web/src/features/media/`                                                     |
| Persistence                  | `packages/database/prisma/`, `packages/database/src/` and `packages/database/tests/`                                                                       |
| Shared HTTP/session          | `apps/web/src/services/api/` and `apps/web/src/features/auth/`                                                                                             |

Reference flow: existing admin component -> its hook -> admin API -> central
transport -> content route/controller -> owning service -> rules/queries/mapper ->
shared DTO. The composition root supplies dependencies. Read the real operation's
contract and authority before changing it; do not copy all responsibilities into
one file or add empty layers to match the diagram.

The work belongs to its domain: Category, Work, Chapter, publication and media
operations use their existing owners. Later reader/community/gift/support/ad work
is introduced only by its accepted phase. Do not import another project's financial
or OTP policies. Package names are `@fury/web`, `@fury/api`, `@fury/contracts` and
`@fury/database`; verify versions and scripts from their manifests.

## Backend gate and frozen-UI integration

Complete and test the whole required backend group before its dependent frontend:
contracts, safe migration/constraints, authority, services/rules, query/mapping,
endpoints, applicable media/provider boundaries, failure handling and acceptance.
Use one feature with ordered internal groups when the phase owns both. Phase IDs,
feature numbers and internal groups are different; completed foundations stay complete.

Frontend work replaces fixtures/local mutations through the existing API/hooks and
controls. Preserve current presentation and static copy under constitution VI.
A missing surface or a presentation-changing fix is an owner-decision gate, not
permission to redesign. Report the requirement and exact conflicting surface;
do not conceal failure or remove the underlying requirement.

## Review and adoption limits

Use the same owner/rule map during planning, implementation, post-edit review,
analysis and convergence. Preserve the existing B/F identifiers; another project's
similarly numbered rule may mean something different. No required model/provider,
profile or role split exists. Delegation needs explicit owner authorization.

The fictional Item/Account snippets remain labelled teaching fragments; they do
not exist as Fury features, and are not drop-in executable application code. Use
real Fury owners/contracts for implementation and do not install example packages.
Do not relocate working code solely to mirror a diagram or adopt an older source
pattern against an explicit standard. Existing deficiencies are scoped findings,
not authority to weaken the rule or expand a phase.

These documents guide behavior; their presence is not automatic enforcement, an
executed test, UI approval or production readiness. Report concrete findings,
real verification and unmet gates. For docs-only changes use formatting/link/
reference/example checks rather than unrelated application suites.

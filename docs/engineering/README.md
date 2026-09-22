# Portable engineering baseline

These 11 files define a reusable coding and review baseline. They intentionally
contain no client roadmap, brand palette, machine path, production record, source
audit report or project-specific business model. The current project's accepted
requirements remain separate and determine what gets built.

## One owner per topic

| File                                                   | Owns                                                                    |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| [AGENTS.md](../../AGENTS.md)                           | Entry and relevant-reference routing                                    |
| README.md                                              | This ownership/read/adoption map                                        |
| [code-style.md](code-style.md)                         | Naming, imports, types, functions/classes and shared-code criteria      |
| [backend-standard.md](backend-standard.md)             | Backend rule IDs and complete layer-by-layer module example             |
| [frontend-standard.md](frontend-standard.md)           | Frontend rule IDs, feature/form/cache/async examples                    |
| [api-contracts.md](api-contracts.md)                   | Shared request/output schemas, DTOs and HTTP boundaries                 |
| [data-patterns.md](data-patterns.md)                   | Schema/constraints/query/transaction/migration details                  |
| [testing.md](testing.md)                               | Evidence requirements, test examples, suite selection and cleanup       |
| [security.md](security.md)                             | Authority, credential/error/log/cache/media boundaries                  |
| [design-system.md](../design/design-system.md)         | Establishing/reusing a project's approved visual and interaction system |
| [operating-policy.md](../workflow/operating-policy.md) | Task brief, delegation/review, decisions, phase stops and resume        |

Eleven is the current responsibility split, not a target to preserve at all costs.
Keep each rule's full explanation in its owner. The backend/frontend ID lists may
point to a cross-cutting guide; examples and review questions implement those rules
rather than create competing versions. Add a file only for a new independent
responsibility that no current owner can reasonably hold.

## Dependency and folder ownership

| Area                   | Responsibility                                                                  | Does not own                             |
| ---------------------- | ------------------------------------------------------------------------------- | ---------------------------------------- |
| Web app/routes         | Route composition, metadata, framework boundaries                               | Prisma or backend authorization          |
| Web feature/api        | Contract-aware requests through the existing central transport                  | Rendering or a second HTTP/session stack |
| Web feature/hooks      | Query/mutation lifecycle and scoped cache effects                               | Component layout                         |
| Web feature/model      | Feature types, key factories, pure transforms and state transitions             | A duplicate server-state global store    |
| Web feature/components | Accessible UI and transient interaction                                         | Direct HTTP requests                     |
| API composition        | Construct dependencies and mount modules                                        | Business rules for each endpoint         |
| API routes/middleware  | Protocol wiring, parsing and request authority                                  | Persistence/business orchestration       |
| API controllers        | Translate validated HTTP context to use cases and envelopes                     | Queries/transactions                     |
| API services           | Business rules, authority close to data, transaction and side-effect sequencing | Provider SDK mechanics                   |
| API queries/mappers    | Deliberate DB selections and explicit output projections                        | HTTP status selection in query helpers   |
| Shared contracts       | Browser-safe wire schemas/types                                                 | Prisma/Express/provider secrets          |
| Database package       | Schema, migration, client and persistence types                                 | UI/HTTP objects                          |
| Infrastructure         | Provider, logging and technical adapters                                        | Product-specific permission decisions    |

Use these responsibilities within the existing tree. Do not relocate working code
just to create every pictured folder. No universal repository layer, base service,
event bus or DI framework is required. Pure rules remain feature-local until actual
independent consumers justify sharing.

## Read according to the task

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

## Adopting in an existing or new project

1. Merge AGENTS.md safely; copy the docs tree while preserving existing guidance.
2. Read actual code/configuration and record the project facts in its existing
   plan/reference: stack versions, commands, package names, auth, design and scope.
3. Use the user's supplied requirement/roadmap. If none exists, clarify the feature
   and produce only the planning needed; a full-project roadmap is not mandatory.
4. Reconcile explicit project constraints with the general standards and record
   concrete exceptions in the active task/plan, not another global rule document.
5. Link relevant skills/constitution to these owners; do not duplicate their contents.
6. Verify actual workflow/implementer availability before requesting delegated execution.

A new empty UI requires an approved design direction; partial UI supplies candidate
patterns to extract and review; a backend-only change needs no unrelated page design.
Preserve already-approved work in each case.

These are reusable rules, not a global machine installation. Skill instructions
describe procedures; these references define engineering requirements. Prompt
instructions require actual review, tests and runtime controls to be enforced.

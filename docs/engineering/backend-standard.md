# Backend coding standard

B01–B54 are general engineering rules for new/touched code. Conditional rules apply
when that feature exists; they do not require creating extra product subsystems.
Use [the ownership map](README.md), [style](code-style.md), and the linked technical
guides. A known old pattern is not an exception to an explicit standard.

## Responsibilities and invariants

**B01 — Thin controllers.** HTTP only: read validated params/query/body and
authenticated context, call the service, then return the established envelope with
path/request ID. No business decisions, Prisma or transactions. Assign awaited
results and response values to named constants before invoking response helpers.
Do not hide a service call in a nested await inside a response expression.

**B02 — Business services.** Services own invariants and sequence queries,
transactions, security, mapping and audit where required. A use case should explain
the business operation, not merely rename Prisma methods. Split growing services
by real responsibilities, not by an arbitrary size or a universal base class.

**B03 — Query ownership.** Move complex Prisma queries into feature-local
`*.queries.ts`; extract query builders when complex or reusable. Simple focused
queries may remain in a small service. A query helper selects data; the service
decides what eligibility means and what failure to return. Select only needed
fields; avoid N+1; paginate and filter/search/sort live lists in the database.
Pass the transaction client into helpers used inside a transaction.

**B04 — Output mappers.** Explicitly map selected database records to public
contract DTOs. Do not return raw records or spread them into responses. Exclude
unneeded internal IDs/timestamps, private owner data, hashes, ciphertext, storage
paths and audit metadata. Public projections are narrower than privileged ones.
Input parsing belongs to schemas or separately named input adapters.

**B05 — Shared contracts.** One shared Zod definition for each HTTP body, params,
query and output shape used by API/web; infer corresponding types. API DTO files
may re-export/alias schemas. Use strict object inputs where appropriate; explicitly
unsupported fields must be rejected. A TypeScript type is not runtime validation.

**B06 — Database invariants.** Back service checks with applicable PostgreSQL
uniqueness, foreign keys, enum/check constraints and partial uniqueness. Name
constraints deliberately. Application validation provides usable errors; database
constraints protect the invariant when requests race or another writer bypasses it.

**B07 — Atomic dependent writes.** Put dependent state changes in one transaction.
Required transactional audit belongs there too. Prove actual rollback in PostgreSQL;
a mock callback that executes all writes does not establish atomicity.

**B08 — Concurrency.** Analyze every repeatable state-changing operation. Use
uniqueness, conditional current-state writes/CAS, explicit transitions and appropriate
isolation. Use Serializable when the invariant needs it, with deliberate conflict
handling. A read-then-create check alone is insufficient under concurrent requests.

**B09 — Business-defined duplicates.** Specify whether a duplicate request returns
the existing result, creates a separate event or fails with conflict. Do not
deduplicate distinct intentional actions just because their visible values match.
Identify the operation, identity, retry window and server-side constraint explicitly.

**B10 — Explicit state transitions.** Use shared enums/constants and specify allowed
source and target states. Reject invalid transitions with a stable safe error.
Do not allow unrestricted status patching.

**B11 — No scattered enum literals.** In backend code use existing enum members
and named action/entity/reason constants. Define a single contract representation
when shared. Do not import the database package into the browser to obtain enums.

**B12 — Domain errors.** Use the existing AppError boundary with status, stable
code and safe message. Important domain distinctions need distinct documented codes;
frontend branching/localization uses codes. Never expose Prisma/provider details
or stack traces to clients. Preserve detailed diagnostics only in appropriately
redacted server logs.

**B13 — Existence privacy.** Define 404 versus 403 per resource authority policy;
use 404 for cross-owner resources when existence must remain private. Apply the
decision consistently to reads, writes and related media. Do not globally replace
all Forbidden responses without a resource policy.

**B14 — Server authorization.** Owner writes verify ownership. Admin operations
verify authentication, current active/verified account policy and server-authoritative
role. Client disabling is UX only. Separate credential types cannot inherit each
other's permissions.

**B15 — CSRF.** Protect unsafe cookie/auth writes according to the route's authority
and current session design. GET must not perform a business mutation. Public or
other credential protocols require their own explicit contract; do not add/remove
CSRF mechanically based only on the HTTP verb.

**B16 — Explicit request authority.** Record who may call each route: public,
authenticated user, owner, admin or another specifically implemented authority.
Never accept arbitrary available credentials as interchangeable authorization.
Mixed-authority endpoints need an explicit protocol and priority policy.

**B17 — Secret storage.** Passwords are hashed, never recoverably encrypted.
High-entropy verification credentials use hashes when verification is all that is
needed. Keep an encrypted recoverable copy only for an approved redisplay requirement;
never store raw credentials. Follow the existing session/token protocol rather
than inventing a parallel one.

**B18 — Scoped encryption, when needed.** Bind ciphertext to entity context with
authenticated associated data; mismatched context must fail. Define a versioned
format, correct random nonce and startup key validation. No homemade crypto and
no unnecessary encrypted copy when a hash suffices.

**B19 — Exact collision retries.** If generating unique tokens, retry only the
specific token-hash unique constraint. Other P2002 failures must propagate/map
normally. Bound retries; exhaustion returns a stable documented 503. Identify
the actual constraint target instead of treating every uniqueness error as collision.

**B20 — Redacted observability.** Never log credentials, cookies, CSRF, password
fields, sensitive bodies/private messages, ciphertext or raw secret-bearing URLs.
Sanitize success/error envelope paths as well as logs if a route path can hold a
credential. Test absence using sentinel secrets, including nested/provider errors.

**B21 — Sensitive audit, where required.** Record actor, action, entity/context,
request ID and safe metadata. Required audit commits atomically with the business
change; failed transactions leave no success audit. Do not add an audit subsystem
to a trivial feature that has no such requirement.

**B22 — Minimal public responses.** Public output contains only the authorized
projection; privileged fields are not made safe by hiding them in the UI. Test
forbidden-field absence, not just expected-field presence.

**B23 — Read semantics.** Public reads, previews, copying and sharing do not create
business submissions, attendance or state transitions. Explicit command endpoints
own such actions. Operational request logging is not a business mutation.

**B24 — Immutable event snapshots, where required.** Record the event independently
of the current object's status. Snapshot the fields needed to interpret the event
at its occurrence. Later edits must not silently rewrite historical meaning.
The product defines what is an event and which snapshots/retention are required.

**B25 — History versus current state.** Revoking, regenerating or changing a
current object must not erase required historical facts. Make retention and
relationships explicit.

**B26 — Deliberate deletion.** Use soft deletion when selected by the product;
operational queries exclude deleted rows and preserve required history/audit.
Specify repeated-delete behavior. Do not impose soft deletion on every table.

**B27 — Deterministic pagination.** Use an explicit unique tie-breaker, for example
createdAt descending then id descending. Define nullable ordering and stable
filter semantics. Ties cannot arbitrarily move items between pages.

**B28 — Bounded work.** Production lists, search text, input lengths, token sizes
and durations are bounded. No unbounded findMany in request flows. Background
maintenance must use bounded batches rather than loading an entire table.

**B29 — Rate limiting.** Assess public endpoints susceptible to abuse, auth and
critical privileged actions. Use deliberate keys and bounds; hash secret-derived
keys. Verify deployment topology and store scope before claiming limits coordinate
across processes or instances.

**B30 — Anti-abuse contracts.** Use honeypots only where the accepted public-form
contract calls for them. If neutral success is required for bots, prove no write
occurred and do not disclose detection. Do not add fictitious success to normal failures.

**B31 — Runtime/OpenAPI agreement.** Document exact methods, paths, inputs, statuses
and security; every runtime endpoint is covered and removed endpoints disappear.
Distinguish bodyless from an explicit empty object. Document 503 only when reachable.

**B32 — Route registration tests.** Test the original method when removing an
endpoint. A GET 404 does not prove a POST was removed. Satisfy preceding auth/CSRF
requirements so the response actually tests route resolution.

**B33 — Cohesive files.** Put constants, types, queries, mappers, services, controllers
and route composition in their responsible owners as complexity warrants. No God
files; no empty folder/class matrix for a five-line operation.

**B34 — Dependency injection.** Composition supplies database/providers and relevant
clock, identifier, audit or encryption dependencies. Avoid hidden mutable singletons.
A constructor parameter does not make imported global time/config/provider state injected.

**B35 — Deterministic time/IDs.** For time/ID-sensitive rules use the project's seam
or introduce a focused one when needed. Tests control time and generation; sleeps
must not stand in for deterministic business-boundary tests.

**B36 — Composition root.** Routes receive controller/middleware dependencies.
Controllers receive services and do not construct them. Controllers/routes perform
no Prisma work. The existing composition root mounts modules and owns dependency
instances.

**B37 — External adapters.** Network SDK/fetch/Axios details belong behind an
infrastructure boundary. A generated link or user handoff is not confirmed delivery
or business completion. Model provider acknowledgement and uncertain outcomes
explicitly.

**B38 — Side effects and transactions.** Define the authoritative state and provider
failure policy. Avoid holding a transaction open around external I/O. Required
delivery may need compensation or a durable job/outbox design; neither makes two
systems magically atomic. Retries must account for uncertain delivery and duplicates.

**B39 — Media security, when in scope.** Validate authority, MIME, size, decoding,
pixel/resource limits and path containment. Generate storage paths on the server;
define safe replacement/cleanup. Implement correct ranges for supported streaming
types. Apply the same access policy to direct media and API responses.

**B40 — Shared access policy.** Centralize genuinely shared availability decisions
so views, API and media agree on the same publication/access states. Include only
rules in the accepted product. A shared policy is not permission to bypass
object-level authorization.

**B41 — Optimistic concurrency.** When edits depend on a version, require the
version and return a stable VERSION_CONFLICT (or the agreed equivalent) for stale
writes. Do not automatically retry destructive edits against new state. Return or
refetch authoritative state for the user's next decision.

**B42 — Current-object CAS.** A command replacing/revoking a current child must
match its current ID where needed, so a stale action cannot affect the replacement.
Refresh the authoritative state after conflict; keep this distinct from intentional
idempotent retry.

**B43 — Forward migrations.** Never rewrite possibly applied history. Test fresh
and meaningful populated upgrade paths, failure behavior and repeated deploy.
Local tests do not establish staging/production migration status.

**B44 — Truthful legacy preservation.** If a migration cannot safely derive new
semantics, preserve/archive original data rather than fabricate meaning. Do not
drop archives automatically; destructive changes require explicit review.

**B45 — Invariant-driven tests.** Cover meaningful positive, negative, boundary,
authority/security, concurrency, rollback, integration and adjacent regression
cases as applicable. A service-called assertion alone does not prove the operation.

**B46 — Real integration boundary.** Backend integration uses real Express,
middleware, auth/CSRF, Prisma and PostgreSQL/Testcontainers. Fake external delivery,
not the database/transaction whose behavior the test claims to prove.

**B47 — Cross-feature journeys.** Test relevant completed producer/consumer
flows as features connect. Green isolated module tests do not prove contracts,
authorization and data remain correct across a user journey.

**B48 — State after HTTP.** For consequential commands inspect rows, relationships,
states, timestamps, unique winners and required audit/history after the response.
A 200 alone is insufficient.

**B49 — Actual concurrency tests.** Start competing requests concurrently and
assert final database invariants, returned outcomes and rollback. Sequential replay
tests remain useful but are not concurrency tests.

**B50 — Test integrity.** No .only/.skip/.todo in delivered tests, forced exit,
arbitrary sleeps, unexplained timeout increases or retries to hide flakiness.
Do not mock away the layer under examination or weaken assertions to get green.

**B51 — Async cleanup.** Close servers, disconnect database clients, stop containers,
clear owned timers/listeners and settle owned promises. The process must exit
naturally, including failure cleanup.

**B52 — Visible warnings.** Record warning sources and impact. Do not suppress them
or upgrade dependencies randomly. Distinguish a nonblocking warning from a failing
check using evidence.

**B53 — Project-first simplicity.** Follow established style and introduce a new
pattern only for an actual need. Avoid unrelated refactors, speculative abstractions
and needless architecture. Consistency includes readable responsibilities, not
identical line counts or folder counts.

**B54 — Definition of done.** Relevant domain/database invariants, HTTP/OpenAPI,
authority, safe output/errors, meaningful unit/integration/cross-layer tests and
lint/type/build checks must agree. Green units cannot excuse broken integration or
architecture. Record applicable concurrency/rollback evidence, unresolved warnings
and actual limitations using the [handoff/review policy](../workflow/operating-policy.md).

## Worked module: a conditional title update

This fictional Item example shows concrete code ownership. It does not prescribe
a product model. Use the actual package names and existing HTTP/auth infrastructure.

| Owner                     | Contract                                                                   |
| ------------------------- | -------------------------------------------------------------------------- |
| Shared schema / DTO alias | UUID params; bounded title and expected version                            |
| Middleware                | Authenticated account, applicable write limit/CSRF, parsed inputs          |
| Controller                | Explicit identity, validated values, named service result, envelope        |
| Queries                   | Owned safe selection and a version-conditional update                      |
| Service                   | Missing/private resource policy, transaction ownership, conflict semantics |
| Mapper                    | Safe wire fields and ISO date, no owner/internal fields                    |
| Composition               | Construct once with supplied dependencies and mount                        |
| Database                  | FK, bounds, version and useful ordered-list index                          |
| Tests                     | Wrong owner, unsupported fields, stale version and real concurrent outcome |

The matching contract lives in [API contracts](api-contracts.md), schema and
constraints in [data](data-patterns.md), and consumer code in
[frontend standard](frontend-standard.md).

### DTO: reuse the shared parser and inferred type

```ts
// apps/api/src/modules/items/dto/update-item.dto.ts
export {
  itemParamsSchema as itemParamsDto,
  updateItemBodySchema as updateItemBodyDto,
} from "@workspace/contracts";
export type {
  ItemParams as ItemParamsDto,
  UpdateItemBody as UpdateItemBodyDto,
} from "@workspace/contracts";
```

### Mapper: selected persistence shape to allowed output

```ts
// apps/api/src/modules/items/items.mapper.ts
import type { ItemDto } from "@workspace/contracts";
import type { Prisma } from "@workspace/database";

export const ITEM_SELECT = {
  id: true,
  title: true,
  version: true,
  updatedAt: true,
} as const satisfies Prisma.ItemSelect;

export type ItemRecord = Prisma.ItemGetPayload<{
  select: typeof ITEM_SELECT;
}>;

export const mapItem = (record: ItemRecord): ItemDto => ({
  id: record.id,
  title: record.title,
  version: record.version,
  updatedAt: record.updatedAt.toISOString(),
});
```

### Queries: explicit client, projection and concurrency predicate

```ts
// apps/api/src/modules/items/items.queries.ts
import type { UpdateItemBody } from "@workspace/contracts";
import type { Prisma } from "@workspace/database";

import { ITEM_SELECT } from "./items.mapper.js";

// Both a root client and transaction client can supply this capability.
// The caller must pass tx for queries inside a transaction.
type ItemClient = Pick<Prisma.TransactionClient, "item">;

export const findOwnedItem = (
  database: ItemClient,
  itemId: string,
  ownerId: string,
) =>
  database.item.findFirst({
    where: { id: itemId, ownerId },
    select: ITEM_SELECT,
  });

export const updateItemIfCurrent = (
  database: ItemClient,
  itemId: string,
  ownerId: string,
  input: UpdateItemBody,
) =>
  database.item.updateMany({
    where: { id: itemId, ownerId, version: input.version },
    data: { title: input.title, version: { increment: 1 } },
  });
```

### Service: business outcome and one transaction owner

```ts
// apps/api/src/modules/items/items.service.ts
import type { ItemDto, UpdateItemBody } from "@workspace/contracts";
import type { DatabaseClient } from "@workspace/database";

import { AppError } from "../../core/errors/app.error.js";
import { mapItem } from "./items.mapper.js";
import { findOwnedItem, updateItemIfCurrent } from "./items.queries.js";

type Actor = Readonly<{ id: string }>;

export class ItemsService {
  constructor(private readonly database: DatabaseClient) {}

  async update(
    actor: Actor,
    itemId: string,
    input: UpdateItemBody,
  ): Promise<ItemDto> {
    return this.database.$transaction(async (tx) => {
      const existing = await findOwnedItem(tx, itemId, actor.id);
      if (existing === null) {
        throw new AppError("Resource not found.", 404, "NOT_FOUND");
      }

      const result = await updateItemIfCurrent(tx, itemId, actor.id, input);
      if (result.count !== 1) {
        throw new AppError(
          "The resource changed. Reload before saving.",
          409,
          "VERSION_CONFLICT",
        );
      }

      const updated = await findOwnedItem(tx, itemId, actor.id);
      if (updated === null) {
        throw new AppError(
          "Could not read the saved resource.",
          500,
          "INTERNAL_ERROR",
          false,
        );
      }
      return mapItem(updated);
    });
  }
}
```

A pre-read is used here to return the privacy-preserving missing outcome for unknown
or other-owner records. The conditional write, not that pre-read, protects version
races. A lost conditional write returns a conflict; it does not blindly retry using
a newer version. The readback runs through the same tx and is mapped before return.
This one-write example does not claim to demonstrate a multi-write audit workflow;
see the data guide for that operation's atomicity requirements.

### Controller: thin HTTP adaptation

```ts
// apps/api/src/modules/items/items.controller.ts
import type { Request, Response } from "express";

import { ResponseHelper } from "../../core/responses/api-response.js";
import {
  requireActor,
  readValidated,
} from "../../core/http/request-context.js";
import type {
  ItemParamsDto,
  UpdateItemBodyDto,
} from "./dto/update-item.dto.js";
import type { ItemsService } from "./items.service.js";

export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  update = async (request: Request, response: Response): Promise<Response> => {
    const actor = requireActor(request);
    const { params, body } = readValidated<ItemParamsDto, UpdateItemBodyDto>(
      request,
    );
    const result = await this.service.update(actor, params.itemId, body);
    const message = "Resource updated.";

    return ResponseHelper.ok(
      response,
      result,
      message,
      request.path,
      request.requestId,
    );
  };
}
```

### Typed request access at the framework boundary

```ts
// apps/api/src/core/http/request-context.ts
import type { Request } from "express";
import { AppError } from "../errors/app.error.js";

// Uses the host project's Express augmentation: user, validated, requestId.
// Authentication establishes user; validation establishes parsed body/params.
export const requireActor = (request: Request): Readonly<{ id: string }> => {
  if (request.user === undefined) {
    throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
  }
  return { id: request.user.id };
};

export const readValidated = <TParams, TBody>(
  request: Request,
): Readonly<{ params: TParams; body: TBody }> => {
  const parsed = request.validated;
  if (parsed?.params === undefined || parsed.body === undefined) {
    throw new AppError(
      "Request pipeline is incomplete.",
      500,
      "INTERNAL_ERROR",
      false,
    );
  }
  // A single integration assertion, justified by route-owned schema parsing.
  // This helper does not perform validation; incorrect route wiring is a defect.
  return { params: parsed.params as TParams, body: parsed.body as TBody };
};
```

The existing Express augmentation must declare user, validated and requestId.
The generic assertion is local to framework plumbing after parsing; a missing
validation step is a server wiring defect. Endpoint tests prove the route uses
the matching body/params schema. Do not repeat casts throughout business code.

### Route factory: authority and order are explicit

```ts
// apps/api/src/modules/items/items.routes.ts
import { Router, type RequestHandler } from "express";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { itemParamsDto, updateItemBodyDto } from "./dto/update-item.dto.js";
import type { ItemsController } from "./items.controller.js";

type ItemRouteDependencies = Readonly<{
  controller: ItemsController;
  authenticate: RequestHandler;
  limitWrites: RequestHandler;
  csrf: RequestHandler;
}>;

export const itemsRoutes = ({
  controller,
  authenticate,
  limitWrites,
  csrf,
}: ItemRouteDependencies): Router => {
  const router = Router();
  router.patch(
    "/:itemId",
    authenticate,
    limitWrites,
    csrf,
    validateRequest({ params: itemParamsDto, body: updateItemBodyDto }),
    controller.update,
  );
  return router;
};
```

This route uses the host's authenticated-cookie/session policy. Public or another
credential protocol requires its own deliberate middleware/transport decisions;
do not copy this CSRF/auth sequence to every endpoint.

### Composition: the only constructor wiring location

```ts
// Add to the existing composition root; reuse its dependencies.
const itemsService = new ItemsService(database);
const itemsController = new ItemsController(itemsService);

router.use(
  "/items",
  itemsRoutes({
    controller: itemsController,
    authenticate: authenticationMiddleware,
    limitWrites: itemWriteLimiter,
    csrf: csrfMiddleware,
  }),
);

// modules/items/index.ts exposes the intended module boundary:
// export { ItemsService } from "./items.service.js";
// export { ItemsController } from "./items.controller.js";
// export { itemsRoutes } from "./items.routes.js";
```

The last block is an insertion into a host composition root; its existing database,
router, authentication, limiter and CSRF dependencies are prerequisites, not globals
that each module creates. Add the normal explicit imports from the module index.

### Middleware: shared parsing, no business writes

```ts
// apps/api/src/middlewares/validation.middleware.ts
import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../core/errors/app.error.js";

type Schemas = Readonly<{
  params?: z.ZodType;
  query?: z.ZodType;
  body?: z.ZodType;
}>;

export const validateRequest =
  (schemas: Schemas): RequestHandler =>
  async (request, _response, next) => {
    const targets = ["params", "query", "body"] as const;
    const results = await Promise.all(
      targets.map(async (target) => {
        const schema = schemas[target];
        if (schema === undefined) return { kind: "absent", target } as const;
        const parsed = await schema.safeParseAsync(request[target]);
        return { kind: "parsed", target, parsed } as const;
      }),
    );
    const issues = results.flatMap((result) =>
      result.kind === "parsed" && !result.parsed.success
        ? result.parsed.error.issues.map((issue) => {
            const parts = issue.path.map(String);
            const path = parts[0] === result.target ? parts.slice(1) : parts;
            return {
              field: [result.target, ...path].join("."),
              message: issue.message,
            };
          })
        : [],
    );
    if (issues.length > 0) {
      throw new AppError(
        "Invalid request.",
        400,
        "VALIDATION_ERROR",
        true,
        issues,
      );
    }
    const validated = { ...request.validated };
    for (const result of results) {
      if (result.kind === "parsed" && result.parsed.success) {
        validated[result.target] = result.parsed.data;
      }
    }
    request.validated = validated;
    next();
  };
```

Keep error paths consistently target-prefixed. Preserve async refinements and
aggregate failures before calling next. Do not overwrite read-only framework query
properties; consumers read parsed query from validated context. The error middleware
is last and emits safe envelopes with request ID; the actual error helper signature
and Express rejection behavior must match the installed stack.

## Growth, providers and completion

A service may start small; extract complex/reusable query logic rather than forcing
every operation through a generic repository. Use focused injected collaborators
when separate use cases/time/provider policies deserve their own owner. Keep external
I/O outside long transactions and define uncertain outcomes and cleanup.

Before accepting a module, review the actual diff against applicable B IDs, exact
authority/contract table, output absence checks, database invariants and relevant
test evidence. Follow [testing](testing.md) and
[handoff/review](../workflow/operating-policy.md); no documentation checklist
substitutes for executable verification.

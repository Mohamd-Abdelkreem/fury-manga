# Shared HTTP contracts

Own the wire shape once in the shared browser-safe contracts package. Schema-derived
types serve API and web; API DTO modules alias/export them instead of maintaining
another copy. Database records and server framework types never become browser DTOs.

## Field decisions

For every body/query/params/output field define type, required/optional presence,
nullability, normalization, bounds and allowed actor. Strict inputs reject unsupported
fields rather than silently accepting privileged data. Unknown external data is
validated at an intentional boundary; types alone do not execute validation.

Preserve omission versus null versus empty. A PATCH omission leaves a field alone;
null clears only if the contract allows it. Do not normalize passwords or significant
whitespace accidentally. Keep legacy credential-entry validation compatible with
existing accounts when new-password policy changes.

Lists define page/limit or cursor constraints, filters, stable sort and metadata.
Dates become ISO strings where appropriate; date-only and precision-sensitive money/
decimal values need explicit wire representations, not accidental Date/float coercion.

## Worked contract

The fictional Item example requires a bounded title and expected version. Its output
does not expose owner ID, internal notes or persistence-only fields.

```ts
// packages/contracts/src/items/item.schema.ts
import { z } from "zod";

export const itemParamsSchema = z
  .object({
    itemId: z.uuid(),
  })
  .strict();

export const updateItemBodySchema = z
  .object({
    title: z.string().trim().min(1).max(150),
    version: z.number().int().nonnegative(),
  })
  .strict();

export const itemSchema = z
  .object({
    id: z.uuid(),
    title: z.string().min(1).max(150),
    version: z.number().int().nonnegative(),
    updatedAt: z.iso.datetime(),
  })
  .strict();

export type ItemParams = z.infer<typeof itemParamsSchema>;
export type UpdateItemBody = z.infer<typeof updateItemBodySchema>;
export type UpdateItemInput = z.input<typeof updateItemBodySchema>;
export type ItemDto = z.infer<typeof itemSchema>;

// Reuse the real project's existing envelope factory if it already has one.
export const itemResponseSchema = z
  .object({
    success: z.literal(true),
    statusCode: z.literal(200),
    message: z.string(),
    data: itemSchema,
    requestId: z.string(),
    timestamp: z.iso.datetime(),
    path: z.string(),
  })
  .strict();
```

The backend DTO in [backend standard](backend-standard.md) reuses these exports.
Expose them through the shared package's explicit index. The title-only example
does not need an optional-null transform; add one only for a nullable field's contract.

The envelope is representative. Reuse the actual project's established response
factory; coordinate changes instead of creating a second success/error protocol.
Here itemResponseSchema protects the frontend API boundary as well as shared tests.

## Errors and response boundaries

Operational errors have a stable code, HTTP status and safe message. Field errors
use the same target prefix/path shape across backend validation and form mapping.
Frontend presentation uses approved codes; raw backend text is not a localization
or authorization protocol. Unknown server failures remain failures.

Success mapping explicitly allowlists output. Never spread a database user/resource.
Inspect optional fields, nullability and ISO conversion; absence tests protect
private fields as well as presence tests protecting usability. A generic response
helper or Axios type is not full runtime response-schema validation.

## OpenAPI and route agreement

Every implemented endpoint has matching method/path/body/query/params/status/
authority documentation. Bodyless and explicit empty object are distinct. Only
document errors that the runtime can produce. Remove obsolete endpoints from
both wiring and OpenAPI; test the original method while satisfying preceding
guards so a middleware rejection cannot masquerade as a missing route.

## Compatibility and mocks

Change a public contract together with producer/consumer tests and a compatibility
plan where deployed clients are affected. Do not force every future live schema
into a mock-design phase. Mock view models may be adapted to a later accepted
transport contract, but completed live features must use authoritative responses.

Relevant rules: B04/B05/B12/B22/B31/B32, F01/F04/F05/F25.

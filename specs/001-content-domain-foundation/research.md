# P01 Technical Research

**Feature**: P01 — Content Domain and Contract Foundation  
**Date**: 2026-09-22  
**Status**: Resolved; no technical clarification remains

This research resolves only choices the accepted specification intentionally left to
planning. Evidence came from the current shared contracts, Express middleware/module
patterns, Prisma/PostgreSQL migration tests, local fixture shapes, installed Next.js 16
documentation, and the applicable B/F engineering rules.

## Decision 1: Use a strict versioned JSON structured-text document

**Decision**: Persist and transmit a `version: 1` JSON object containing only H2/H3
headings, paragraphs with bounded inline text/bold/italic/internal links, and
ordered/unordered lists. Reject raw HTML, quote, image, embed, script, arbitrary
attributes, unknown fields, external/protocol-relative links, and malformed nodes.
Apply structural limits plus a 512 KiB serialized UTF-8 ceiling.

**Rationale**:

- P01 must choose a safe bounded representation but must not implement the P04 editor
  or P07 reader.
- The existing text fixture already uses headings, paragraphs, emphasis, links, lists,
  and an unsupported quote. The selected subset aligns the approved later chapter
  vocabulary while making the current quote visibly a fixture-only departure.
- A versioned root permits deliberate future evolution. Strict discriminated nodes are
  portable across browser/API tests and safe to store as JSONB without executable HTML.
- 512 KiB leaves envelope overhead beneath the configured 1 MB Express body limit.

**Alternatives rejected**:

- **Markdown string**: compact, but safe rendering semantics and link/HTML policy would
  be deferred ambiguously and parsing could drift between API and browser.
- **Sanitized HTML**: makes a sanitizer/runtime output part of P01 and stores executable
  markup despite no reader being in scope.
- **Existing fixture union unchanged**: accepts quote nodes and unversioned shapes that
  the approved roadmap explicitly does not establish.
- **Editor-specific AST/library**: would add a dependency and pull P04 implementation
  choices into the foundation.

## Decision 2: Expose a minimal but complete P01 HTTP surface

**Decision**: Provide four credential-free public metadata reads and fifteen
active/verified-ADMIN management operations. Management covers create/list/read/update
for Category, Work, and Chapter; whole-set WorkCategory replacement; and Work/Chapter
target-state publication commands. It provides no delete, media, reader, personalized,
or screen-specific endpoint.

**Rationale**:

- The accepted spec requires persistent creation/reads, bounded lists, relationship
  assignment/replacement, chapter-content integrity, and lifecycle commands through an
  authorized boundary.
- Whole-set `PUT` for categories is naturally idempotent, makes removal explicit, and
  lets one transaction protect the exact relationship set without individual-row
  partial success.
- One target-state publication command expresses retry/idempotency better than toggle
  endpoints and makes archive/restore/unpublish semantics explicit.
- Separate public routes keep credential-free projection/visibility policies obvious;
  they do not consume ambient auth.

**Alternatives rejected**:

- **CRUD endpoints for every table**: would expose ChapterPage and PublicationEvent as
  mutable resources, contradict immutability and transactional aggregate ownership.
- **Toggle publication**: a replay can invert the state and cannot safely express an
  idempotent desired outcome.
- **Only service APIs/no HTTP**: cannot satisfy shared contract, OpenAPI, authority, or
  real Express-stack acceptance evidence.
- **Screen-shaped endpoints**: would couple P01 to P03–P05 user interfaces.

## Decision 3: Use explicit version compare-and-set, not locks or blind retries

**Decision**: Add an integer `version` to mutable aggregates. Every update/replacement/
publication request carries `expectedVersion`. Services execute conditional writes and
re-read once after a lost race. Same target state/set returns idempotent success;
different authoritative state returns `CONTENT_STALE_WRITE`. No sleep or general retry
loop is used.

**Rationale**:

- The spec requires observable stale-write conflicts, one authoritative winner, and
  convergent identical publication requests.
- Conditional writes work under PostgreSQL's normal transaction isolation and are easy
  to prove with real concurrent tests.
- The version is useful at future UI integration boundaries without adding an
  application-wide locking subsystem.

**Alternatives rejected**:

- **Last write wins**: silently overwrites newer content and fails FR-025.
- **Pessimistic row locks for every mutation**: unnecessary for current aggregates,
  complicates idempotent retry behavior, and increases lock coupling.
- **Serializable transactions with arbitrary retries**: adds avoidable retry policy and
  can conceal conflicts the client must understand.
- **Timestamp-only concurrency**: precision/serialization differences make it a weaker
  compare token than an integer revision.

## Decision 4: Link the current publishable record to its event

**Decision**: A publish operation generates a PublicationEvent UUID and timestamp,
inserts the event, and conditionally updates the Work/Chapter with `publishedAt` and
`currentPublicationEventId` inside one transaction. Non-published states clear both
current fields but retain history. PublicationEvent rows are update/delete protected.

**Rationale**:

- A repeated publish can return the exact existing event identity rather than infer it
  from a possibly tied timestamp.
- The current record can enforce “published iff current timestamp/event exists” with
  named constraints and FKs.
- A losing conditional write rolls back its pre-inserted event, proving one event per
  actual transition without an external idempotency store.

**Alternatives rejected**:

- **Find latest event by timestamp**: ties and subsequent edits make authoritative
  current-event selection ambiguous.
- **Store only publishedAt**: fails the durable event identity required for P09 reuse.
- **Event after the record update in another transaction**: permits published state
  without history on failure.
- **Outbox/queue**: P01 has no external side effect or dispatcher.

## Decision 5: Make Work type immutable and enforce derived chapter kind at data boundaries

**Decision**: Work type is accepted on create and may be echoed in the strict Work
update contract only so the service can return the accepted immutable-field outcome:
the persisted value is a no-op, while a different value returns
`409 CONTENT_IMMUTABLE` with no change. Chapter content type is derived from Work
type and then immutable with its parent. Named database checks/triggers reinforce
text-vs-illustrated storage, page-kind, and illustrated-publication readiness rules,
while shared Zod/service rules validate the full JSON representation.

**Rationale**:

- Changing a Work from illustrated to text after chapters exist would invalidate an
  entire aggregate and require a content migration that P01 does not specify.
- Immutability keeps existing chapters and public metadata consistent under races.
- Cross-row derivation and page-kind invariants cannot be represented by a simple
  Prisma scalar check alone; narrowly scoped named triggers provide real PostgreSQL
  evidence without a generic data abstraction.

**Alternatives rejected**:

- **Allow type change only when no chapters exist**: adds a product workflow not in the
  spec and still creates race complexity.
- **Recompute chapter type on every read**: leaves stored text/page representation
  ambiguous and weakens direct database integrity.
- **Service-only enforcement**: direct concurrent/database writes could violate a core
  accepted invariant.

## Decision 6: Promote pagination input to the shared contract, keep skip/take server-only

**Decision**: `@fury/contracts` owns the normalized `page`/`limit` query schema and its
25/100 policy. The API pagination module computes `skip`/`take` and metadata from parsed
values. Content sort fields are fixed per endpoint; no client-provided SQL-like sort or
include vocabulary is introduced.

**Rationale**:

- The constitution requires browser/server agreement on query and pagination
  representation.
- Existing API behavior already provides the accepted decimal-only and safe-integer
  rules; promoting its wire schema avoids defining a competing parser.
- Prisma-specific pagination math stays server-owned.

**Alternatives rejected**:

- **Leave all parsing in API DTOs**: violates the one shared HTTP contract.
- **Cursor pagination**: no accepted need and would replace an established policy.
- **Generic filter/sort DSL**: speculative scope and an injection/compatibility burden.

## Decision 7: Do not build the web data path in P01

**Decision**: Web production changes are limited to compile-time contract derivation at
the existing admin type boundary: `AdminWorkType` aliases the shared Work type and the
existing lowercase fixture-role type is derived from shared `UserRole` without
changing its values. Canonical content values and structured-text examples live in
shared contract tests/builders only. Existing discovery/text-story/admin fixture
objects, filters, Arabic labels, quote blocks, controls, routes, and mock interactions
remain unchanged. No content `api` module, React Query key/hook, cache invalidation,
optimistic mutation, route loader, or page integration is added.

**Rationale**:

- PLAN.md assigns admin screens to P03/P04 and public screens to P05.
- Existing pages use local fixtures/context and mock delays; connecting only part of a
  route or rewriting fixture values would change presentation without making it
  authoritative.
- The central Axios client and QueryClient already exist and need no P01 abstraction.
- The accepted clarification preserves rendered Arabic content and fixture behavior.
  The single type-only web touch selects no Next.js API or runtime boundary.

**Alternatives rejected**:

- **Create unused hooks/adapters now**: YAGNI and likely to drift before owning phases.
- **Replace AdminDataProvider wholesale**: pulls P03/P04 and unrelated admin domains
  into P01.
- **Rewrite legacy discovery/text-story fixture values and quote nodes**: changes
  approved fixture-backed presentation and pulls later integration/rendering scope
  into P01.
- **Leave the actual admin type boundary duplicated**: misses the phase's compile-time
  frontend-preparation outcome even though its values already match the shared
  contract.

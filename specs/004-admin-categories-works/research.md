# P03 Technical Research and Resolved Choices

These are technical choices arising from the current P03 draft and resolved from this checkout. Reviewer acceptance of the specification remains outstanding; this artifact does not claim product approval.

## R-01 — Atomic save-and-publish across P01 content and P02 media

**Decision**: One content-owned serializable PostgreSQL transaction performs the entire editorial command. A focused P02 reference operation must accept that transaction and write its binding/replacement/retirement event within it. P01 publication-event creation is composed in the same transaction. Acquire work, category and asset/reference locks in a consistent order; classify serialization/unique/CAS losers as safe conflicts, not automatic editorial retries.

**Evidence/rationale**: `work-management.service.ts` currently writes base work metadata and category replacement separately; `publication-management.service.ts` owns an independent publication transaction; `media.service.ts` bind/replace methods start their own transactions. Calling these HTTP endpoints in sequence cannot meet the clarified all-or-nothing outcome. The existing media schema already has active-slot uniqueness and reference events; reuse those semantics rather than adding a second media model. B07/B08/B38 and the constitution require rollback of dependent changes.

**Alternatives rejected**: Browser-orchestrated calls create partial drafts; nested independent service transactions cannot roll back as one; a new generic repository/event bus is unnecessary.

## R-02 — Ambiguous create acknowledgement

**Decision**: Allow an optional caller-generated UUID `id` on category/work create. P03 UI generates it once per create attempt, retains it through timeout, and reads the authorized detail by that ID before deciding whether to retry with the same ID. Old P01 callers without `id` keep current server-generated behavior. A same-ID or same-slug competing create returns conflict; never treat a conflict alone as proof that one's request succeeded.

**Evidence/rationale**: P01 `createCategoryBodySchema`/`createWorkBodySchema` currently have no idempotency key, while Work/Category have UUID primary keys and immutable unique slugs. The P03 specification requires no duplicate record/false success after unknown outcome. Stable create identity permits authoritative reconciliation without a new operation ledger. The media upload already has a separate `Idempotency-Key`; that key is an upload attempt only, not an editorial-save receipt.

**Alternatives rejected**: Automatic POST retry can duplicate or produce misleading conflict; slug-only reconciliation could mistake another administrator's work; a new idempotency table is disproportionate while records cannot be hard-deleted in P03.

## R-03 — Category order and cross-row eligibility

**Decision**: Materialize unique positive global `displayPosition`; move one adjacent slot using expected revision, row locks, and serializable transaction. Backfill existing categories by `(createdAt,id)`. Compute `worksCount` as a distinct association count. Disabling a category and changing work associations/publishing share the same serialized eligibility policy; a database-side guard/constraint closes direct-write races after legacy remediation.

**Evidence/rationale**: P01 Category has only `createdAt`/version and lists newest first; the web route has local `displayOrder` and `worksCount`. `WorkCategory` already has composite membership identity and an index by category. Existing work-category replacement uses work version and serializable isolation but does not consider enablement or publication readiness. The spec allows in-use disablement only when published works retain another enabled category.

**Alternatives rejected**: Sorting only by date cannot persist administrator order; UI-only swap loses on reload; a stored counter drifts; refusing every in-use disable contradicts the P03 specification.

## R-04 — Tags, featured uniqueness and old published records

**Decision**: Use a work-owned tag relation with unique normalized tag per work and bounded order, and a partial unique PostgreSQL index for active published featured positions. Add editorial fields compatibly, inventory existing published works, explicitly repair or return each incomplete record to draft, then validate/add the strict cross-row publication guard in a later forward migration. That guard rejects intentional invalidating edits but permits P02 reconciliation to record an observed missing-byte `UNAVAILABLE` state; public metadata excludes affected works until verified recovery. Until legacy remediation completes, public metadata queries also fail closed for ineligible published rows.

**Evidence/rationale**: P01 Work has no synopsis/author/tags/featured columns; category and media references already persist separately. A plain JSON/string array would not give simple relational uniqueness or ordered tag constraints. Existing P01 publications can lack all new readiness fields, so an immediate NOT NULL or published-ready trigger would make the upgrade fail or fabricate data. B43/B44 prohibit rewriting migration history or silently inventing legacy values.

**Alternatives rejected**: Destructive reset/backfill with invented copy; immediate strict migration against potentially populated works; global uniqueness of draft/archived featured preferences (spec only requires published active uniqueness).

## R-05 — Browser state and Next.js boundary

**Decision**: Keep thin server App Router pages and existing protected layout; interactive P03 components use feature API through central `apiClient` and session-scoped React Query keys. React Hook Form owns editable drafts; media candidate hook remains P02. Use persisted slug only for admin metadata preview and remove invented public destination. Cancel/ignore obsolete reads and retain dirty drafts on refresh/conflict.

**Evidence/rationale**: The work/category pages already compose client components; `apps/web/src/app/admin/works/[workId]/edit/page.tsx` awaits promised `params`, consistent with installed Next 16 `page.md`. Installed `05-server-and-client-components.md` keeps interactivity in client boundaries, and App Router `use-router.md` says client navigation is separate from data-cache invalidation. `AdminCategories` and `AdminDataProvider` currently hold local fixtures, while media candidate picker returns an asset ID but does not bind it to work. F01/F06/F07/F24/F27 align with this ownership.

**Alternatives rejected**: Browser import of Prisma/API implementation; a second Axios client/global store; treating `router.refresh()` as React Query invalidation; deriving a slug or public route from title/ID.

# Persistence, queries and migrations

The database package owns schema, migrations, generated client and persistence
types. Services receive a client from composition; controllers and browser modules
do not construct or use it. Generated code is not manually edited.

## Schema example and its constraints

This is a fictional fragment supporting the worked update, not a command to add
these tables. Owner deletion uses Restrict in this example; another product must
make its own deliberate retention/deletion decision.

```prisma
// prisma/schema.prisma: example fragment, not an instruction to add these tables.
model Account {
  id    String @id @default(uuid()) @db.Uuid
  items Item[]

  @@map("accounts")
}

model Item {
  id           String   @id @default(uuid()) @db.Uuid
  ownerId      String   @map("owner_id") @db.Uuid
  owner        Account  @relation(fields: [ownerId], references: [id], onDelete: Restrict)
  title        String   @db.VarChar(150)
  internalNote String?  @map("internal_note")
  version      Int      @default(0)
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt    DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@index([ownerId, createdAt, id], map: "items_owner_created_id_idx")
  @@map("items")
}
```

```sql
-- A NEW forward migration; never edit possibly applied history.
-- For an existing populated table, inspect/backfill invalid data first.
ALTER TABLE "items"
  ADD CONSTRAINT "ck_items_title_nonblank"
  CHECK (length(btrim("title")) BETWEEN 1 AND 150),
  ADD CONSTRAINT "ck_items_version_nonnegative"
  CHECK ("version" >= 0);
```

Read migration SQL as well as ORM schema: explicit CHECK/partial unique constraints
may not be fully represented by ORM field declarations. Use database uniqueness,
FKs, enums/checks and necessary indexes alongside friendly application validation.
Constraint names also matter for exact error classification.

For an existing table, plan safe backfill/constraint validation and rollout before
deploying stricter constraints. Do not claim this example migration preserves
arbitrary legacy data or is a production-ready upgrade.

## Query design

Select only needed columns; related loading is deliberate. Complex/reusable
queries belong to feature query helpers. Do not hide N+1 behind Promise.all.
Filter/search/sort/paginate live datasets in the database with bounds.

Validate page/limit/search before this illustrative query fragment; bound offset
arithmetic, and use a cursor if the actual scale requires one.

```ts
const [rows, total] = await database.$transaction(
  [
    database.item.findMany({
      where: {
        ownerId: actor.id,
        title: { contains: search, mode: "insensitive" },
      },
      select: ITEM_SELECT,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    database.item.count({
      where: {
        ownerId: actor.id,
        title: { contains: search, mode: "insensitive" },
      },
    }),
  ],
  { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
);
```

The filter is identical for rows and count. RepeatableRead here requests a consistent
snapshot for that pair; it is not a blanket isolation requirement for every list.
A unique tie-breaker stabilizes a fixed dataset. It does not freeze pagination
while other writers modify records. Define cursor/snapshot behavior when required.
Specify null ordering for nullable relationships.

Use one named/shared filter builder if the real filter becomes complex. Maintain
indexes for actual predicates/order, not every possible column.

## Transactions and concurrency

Before implementing a command write down:

- Rows/read predicates that establish eligibility.
- Dependent writes and required audit/history.
- Database constraint/CAS/version enforcing the invariant at the write.
- Expected outcomes for duplicate/concurrent/stale requests.
- Transaction boundary, isolation and allowed retry policy.
- External effects, uncertain acknowledgement and compensation.
- What a failed command must leave unchanged.

The [module example](backend-standard.md) passes tx to queries and updates only
where owner/id/version still match. Two callers with the same version cannot both
advance it. A precheck alone is insufficient. Serializable is useful when a
cross-row invariant needs it, not a label that automatically solves every race.
Classify serialization conflicts deliberately; never silently retry destructive
edits against newer state.

Related business writes and required audit commit together. A callback mocked as
a transaction cannot prove rollback. Test real service/HTTP failures in isolated
PostgreSQL and inspect final state. A single-write example is not evidence of
multi-write atomicity.

## Side effects and recovery

Keep slow external I/O outside long transactions. Define success truth, uncertain
provider result, idempotency and bounded retries. Compensation can fail; it is not
a distributed transaction. Use an outbox/durable job only when delivery/lifecycle
requirements justify it. Do not describe detached promises as durable execution.

Token-collision retries match the exact token constraint, not any uniqueness error.
Background maintenance uses bounded batches and resumable progress. Cleanup targets
are explicitly scoped; no blanket reset or delete to make verification pass.

## History and migrations

Current pointers/status and immutable historical events are separate facts. Snapshot
required historical meaning; later edits do not rewrite it. Soft deletion applies
when chosen, with operational queries excluding deleted data and repeat-delete
semantics defined. Do not impose it on all tables.

Never rewrite possibly applied migrations. Use forward changes with fresh-schema,
meaningful populated-upgrade, failure and repeated-deploy checks. Preserve/archive
legacy data that cannot be faithfully interpreted; do not fabricate new semantics
or drop archives automatically. Local tests do not establish deployment migration
state. Destructive migration execution requires its actual review/authorization.

## Pure business rules

Feature-local functions own deterministic ordering, bounds and transitions when
separating them from I/O clarifies behavior. Inject clock/ID sources for time-sensitive
rules; tests control them instead of sleeping. Promote a helper to shared only for
a real stable cross-feature responsibility.

Relevant rules: B03/B06–B11/B19/B21/B24–B28/B34/B35/B38/B41–B44/B48/B49.

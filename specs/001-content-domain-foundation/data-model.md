# P01 Data Model

**Feature**: P01 — Content Domain and Contract Foundation  
**Database**: PostgreSQL 18 through Prisma 7  
**Migration policy**: Additive, forward-only, after accepted P00 history

This model contains only P01 entities. Existing fixture works, categories, chapters,
pages, text, counts, IDs, and URLs are not migrated or seeded.

## Enumerations

Prisma uses server-side enum members mapped to the lowercase wire values owned by
`@fury/contracts`.

| Enum               | Stored/wire values                                           |
| ------------------ | ------------------------------------------------------------ |
| WorkType           | `manga`, `manhwa`, `manhua`, `comics`, `novel`, `text-story` |
| StoryStatus        | `ongoing`, `completed`, `hiatus`, `cancelled`                |
| PublicationStatus  | `draft`, `published`, `archived`                             |
| ChapterContentType | `illustrated`, `text`                                        |

`comic` and `short-story` are never database enum values and are rejected by the
shared boundary rather than converted.

## Entity: Work

| Field                     | Type/nullability            | Rules                                                                  |
| ------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| id                        | UUID, required              | Primary key, generated once, immutable                                 |
| title                     | VARCHAR(200), required      | Trimmed/NFC, nonblank, no NUL                                          |
| slug                      | VARCHAR(120), required      | Lowercase normalized slug, immutable, unique                           |
| type                      | WorkType, required          | Immutable after creation                                               |
| storyStatus               | StoryStatus, required       | Mutable through versioned update                                       |
| publicationStatus         | PublicationStatus, required | Defaults to draft; changed only by lifecycle command                   |
| publishedAt               | TIMESTAMPTZ(6), nullable    | Present iff currently published                                        |
| currentPublicationEventId | UUID, nullable              | Present iff published; unique FK to PublicationEvent                   |
| version                   | INTEGER, required           | Default 0, non-negative, incremented by each material aggregate change |
| createdAt                 | TIMESTAMPTZ(6), required    | Database current time                                                  |
| updatedAt                 | TIMESTAMPTZ(6), required    | Updated on material change                                             |

Relationships: many Categories through WorkCategory; many Chapters; many historical
PublicationEvents; at most one current PublicationEvent.

Constraints/indexes:

- primary key `id`;
- unique `slug` plus named check for trim/lowercase/slug grammar;
- named check `version >= 0`;
- named check requiring `publishedAt` and `currentPublicationEventId` together iff
  publicationStatus is published;
- index `(publicationStatus, publishedAt DESC, id ASC)` for public list;
- index `(createdAt DESC, id ASC)` for admin list;
- immutable identity trigger rejects changes to `id`, `slug`, or `type`.

## Entity: Category

| Field       | Type/nullability         | Rules                                        |
| ----------- | ------------------------ | -------------------------------------------- |
| id          | UUID, required           | Primary key, generated once, immutable       |
| displayName | VARCHAR(100), required   | Trimmed/NFC, nonblank, no NUL                |
| slug        | VARCHAR(120), required   | Lowercase normalized slug, immutable, unique |
| version     | INTEGER, required        | Default 0, non-negative, CAS token           |
| createdAt   | TIMESTAMPTZ(6), required | Database current time                        |
| updatedAt   | TIMESTAMPTZ(6), required | Updated on material change                   |

No enabled/order/media field exists; P03 owns those decisions.

Constraints/indexes:

- primary key `id`;
- unique `slug` plus normalized slug check;
- named check `version >= 0`;
- index `(createdAt DESC, id ASC)` for bounded management list;
- immutable identity trigger rejects changes to `id` or `slug`.

## Entity: WorkCategory

| Field      | Type/nullability         | Rules                                |
| ---------- | ------------------------ | ------------------------------------ |
| workId     | UUID, required           | FK to Work, `ON DELETE RESTRICT`     |
| categoryId | UUID, required           | FK to Category, `ON DELETE RESTRICT` |
| createdAt  | TIMESTAMPTZ(6), required | Relationship creation time           |

The composite primary key `(workId, categoryId)` is the durable relationship identity
and prevents duplicate assignment. Add `(categoryId, workId)` for reverse membership
lookups. The relation carries no enablement, order, or presentation metadata.

Whole-set replacement may delete obsolete WorkCategory rows only; it never deletes a
Work or Category.

## Entity: Chapter

| Field                     | Type/nullability             | Rules                                                |
| ------------------------- | ---------------------------- | ---------------------------------------------------- |
| id                        | UUID, required               | Primary key, generated once, immutable               |
| workId                    | UUID, required               | Immutable FK to Work, `ON DELETE RESTRICT`           |
| number                    | INTEGER, required            | Positive; unique within Work                         |
| contentType               | ChapterContentType, required | Derived from immutable Work.type; immutable          |
| textContent               | JSONB, nullable              | Required only for text; null for illustrated         |
| publicationStatus         | PublicationStatus, required  | Defaults to draft                                    |
| publishedAt               | TIMESTAMPTZ(6), nullable     | Present iff currently published                      |
| currentPublicationEventId | UUID, nullable               | Present iff published; unique FK to PublicationEvent |
| version                   | INTEGER, required            | Default 0, non-negative, CAS token                   |
| createdAt                 | TIMESTAMPTZ(6), required     | Database current time                                |
| updatedAt                 | TIMESTAMPTZ(6), required     | Updated on material change                           |

Relationships: exactly one Work; ordered ChapterPages for illustrated content; many
historical PublicationEvents; at most one current PublicationEvent.

Constraints/indexes:

- primary key `id`;
- unique `(workId, number)`;
- named checks for `number > 0`, `version >= 0`, JSON object/512 KiB ceiling,
  contentType/textContent nullability, and publication/current fields;
- index `(workId, publicationStatus, number ASC, id ASC)` for eligible chapter list;
- immutable identity/derivation trigger rejects `id`, `workId`, or `contentType`
  changes and verifies contentType agrees with the parent Work;
- a deferred publication-readiness trigger rejects a published illustrated Chapter
  whose committed page set is empty and rejects removal of the final page from a
  published illustrated Chapter.

The shared schema provides full AST validation; PostgreSQL repeats root object, byte
size, kind/nullability, and parent derivation. No raw HTML or executable shape is
accepted through the supported API.

## Entity: ChapterPage

| Field     | Type/nullability         | Rules                               |
| --------- | ------------------------ | ----------------------------------- |
| id        | UUID, required           | Primary key, generated once         |
| chapterId | UUID, required           | FK to Chapter, `ON DELETE RESTRICT` |
| position  | INTEGER, required        | Positive, unique within Chapter     |
| createdAt | TIMESTAMPTZ(6), required | Metadata creation time              |

Constraints/indexes:

- primary key `id`;
- unique `(chapterId, position)` and named check `position > 0`;
- database trigger verifies the parent Chapter is illustrated;
- ordered query is always `position ASC, id ASC`.

There is deliberately no filename, URL, storage key, MIME type, byte count, checksum,
provider, upload state, or external media FK. Page-position gaps are valid. Sequence
replacement deletes/recreates only these metadata rows in the Chapter transaction.

## Entity: PublicationEvent

| Field      | Type/nullability         | Rules                                                     |
| ---------- | ------------------------ | --------------------------------------------------------- |
| id         | UUID, required           | Durable primary key generated per real publish transition |
| workId     | UUID, nullable           | FK to Work, `ON DELETE RESTRICT`                          |
| chapterId  | UUID, nullable           | FK to Chapter, `ON DELETE RESTRICT`                       |
| occurredAt | TIMESTAMPTZ(6), required | Same instant used for the winning current publication     |

Exactly one of `workId` or `chapterId` is present. Index
`(workId, occurredAt DESC, id ASC)` and the equivalent Chapter index support bounded
history/consumer scans without exposing history publicly.

PublicationEvent has no update/delete API. A database trigger rejects UPDATE and DELETE.
Deferred constraint triggers verify that a Work/Chapter's current event belongs to that
same record and has the same `occurredAt` as `publishedAt` at transaction commit. Old
events remain after unpublish/archive/restore/republish; only the current pointer clears
or changes.

## Derived Content Type

| Work type                     | Required Chapter content type |
| ----------------------------- | ----------------------------- |
| manga, manhwa, manhua, comics | illustrated                   |
| novel, text-story             | text                          |

Clients cannot select/override Chapter content type. Text chapter create/update requires
one valid structured document and no page positions. An illustrated Chapter may be
created as an empty draft by omitting `pages`; whenever `pages` is submitted it must
be a bounded, non-empty unique set of positive positions, and no text document is
accepted. An illustrated Chapter requires at least one committed page before it can
transition to published.

## Publication State Machine

| Current   | Target     | Outcome                                                            |
| --------- | ---------- | ------------------------------------------------------------------ |
| draft     | published  | Transition; set current time/event; append one event               |
| draft     | archived   | Transition; current fields remain null                             |
| published | draft      | Unpublish; clear current fields; retain history                    |
| published | archived   | Archive; clear current fields; retain history                      |
| archived  | draft      | Restore; current fields remain null                                |
| archived  | published  | `CONTENT_TRANSITION_CONFLICT`; restore then publish is required    |
| any       | same state | Idempotent success, `transitioned: false`, no version/event change |

Work and Chapter states are independent. Public Chapter eligibility is:

```text
work.publicationStatus = published
AND chapter.publicationStatus = published
```

Changing the Work never rewrites Chapter state. Republished Work visibility therefore
returns only for Chapters that independently remain published.

## Transactions and Concurrent Outcomes

### Versioned update

1. Validate strict request and immutable fields.
2. Conditionally update by `id + expectedVersion` and increment version.
3. If zero rows update, read once:
   - no record → `NOT_FOUND`;
   - requested target already authoritative → idempotent response where defined;
   - otherwise → `CONTENT_STALE_WRITE`.

### Category-set replacement

In one transaction: load all distinct Category IDs, fail missing references, compare
the current set, conditionally increment Work version, delete obsolete join rows, and
insert missing rows. An identical authoritative set is a no-op. Unique/FK failure rolls
back every change.

### Chapter content/page replacement

Validate the complete representation before the transaction. An illustrated create may
omit page metadata and remain an empty draft; an explicitly submitted replacement is
never empty. Then conditionally update the Chapter and replace only its page metadata
when illustrated. Any dependent write failure rolls back version, number/content, and
the previous page sequence. The deferred readiness trigger observes the final
transaction state, so a published illustrated Chapter can never commit with zero pages.

### Publication

Before publishing an illustrated Chapter, verify inside the transaction that at least
one page exists; otherwise return `CONTENT_TRANSITION_CONFLICT` without creating an
event. For a real eligible publish, pre-generate event ID/time, insert the event, and
conditionally update the aggregate to published with its current event/time. A failed
CAS aborts the transaction so the losing event does not survive. For non-published
targets, conditionally change state and clear current fields. After a race, re-read
once to classify identical winner versus incompatible stale loser.

No operation performs an external side effect, so committed database state is the full
P01 success boundary.

## Deletion and Retention

- No Work, Category, Chapter, or PublicationEvent hard-delete endpoint exists.
- Archive retains the aggregate and history.
- WorkCategory removal and ChapterPage replacement delete only current association/
  ordering rows within the owning transaction.
- Parent FKs use RESTRICT so accidental parent deletion cannot cascade away content or
  history.
- Future retention/deletion policy requires its own accepted feature and forward
  migration.

## Migration and Existing-Data Strategy

- Wait for accepted P00 and create a timestamped `content_domain_foundation` migration
  after its last migration. Never rename/edit an applied migration or generated Prisma
  output.
- The migration is additive: new enums, tables, indexes, constraints, functions, and
  triggers only. It does not change or backfill existing account/session rows.
- Do not import web fixtures. An empty content inventory after upgrade is correct.
- Fresh evidence deploys all migrations into empty PostgreSQL 18.
- Upgrade evidence first deploys the accepted P00 chain, inserts representative user/
  refresh state, then deploys P01 and verifies byte-for-byte relevant account/session
  facts remain.
- Deploying the migration twice must report no pending work.
- Application rollback leaves additive tables intact. Data/schema recovery uses a new
  corrective migration or verified backup restore; never reverse/edit migration
  history.

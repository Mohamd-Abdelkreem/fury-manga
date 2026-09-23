# P02 Data Model and Invariants

This design extends the P01 PostgreSQL schema with media identity and only the reference operations allowed by FR-024. File bytes remain on the configured persistent VPS filesystem. Names below are planning names, not generated code.

## MediaAsset

| Field                                                    | Type / rule                                                                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `id`                                                     | Immutable server UUID, primary key; never recycled.                                                                  |
| `mediaClass`                                             | One of `WORK_COVER`, `WORK_BACKGROUND`, `CHAPTER_PAGE`, `USER_AVATAR`, `AVATAR_FRAME`, `COMMENT_DECORATION`.         |
| `scope`                                                  | `ADMIN` for five editorial/gift classes; `USER` for avatar. Check against class.                                     |
| `ownerUserId`                                            | Required FK to User only for `USER_AVATAR`; null for `ADMIN` assets. Restrict user deletion while assets remain.     |
| `uploadedByUserId`                                       | Required FK to User for accountability; never returned in public/browser DTOs.                                       |
| `relativeKey`                                            | Unique, server-generated, immutable path segment under configured root; never client-derived.                        |
| `contentType`, `byteLength`, `width`, `height`, `sha256` | Null until validated bytes are staged; then immutable, bounded decoded truth. `sha256` is of canonical stored bytes. |
| `status`                                                 | `PENDING`, `AVAILABLE`, `REMOVING`, `UNAVAILABLE`, `REMOVED`. `REMOVED` is retained tombstone; no reassignment.      |
| `createdAt`, `availableAt`, `removedAt`                  | UTC timestamptz; state-consistent nullability/checks.                                                                |

Checks reject invalid class/scope/owner combinations, negative/zero dimensions/bytes, incomplete `AVAILABLE` metadata, and a `REMOVED` row without removal time. A unique key and the UUID prevent aliasing. Index `(scope, ownerUserId, createdAt DESC, id DESC)` supports the authorized list; admin rows use a matching class/created order index. List queries select only bounded rows and map to an allowlisted DTO.

### Asset lifecycle

`PENDING → AVAILABLE` only after validated, flushed, immutable bytes exist at the final key. A validation rejection leaves the attempt rejected and no usable asset. Crash/failure may leave `PENDING`; bounded reconciliation verifies the final bytes and identity before atomically making the asset `AVAILABLE` and its attempt `ACCEPTED`. If complete validated bytes cannot be proven, the attempt becomes `REJECTED` and its reserved asset moves `PENDING → REMOVING`; successful exact-key cleanup completes `REMOVING → REMOVED`, while failed cleanup leaves the inaccessible asset in `REMOVING` for a later reconciliation retry. A failed cleanup must not leave the attempt pending or expose the asset. `AVAILABLE → UNAVAILABLE` on missing/corrupt bytes through controlled reconciliation, not an authenticated GET; the GET returns a safe unavailable result and redacted operational evidence. `UNAVAILABLE → AVAILABLE` only after verified repair/restore of the same hash and identity. Explicit no-reference removal uses `AVAILABLE/UNAVAILABLE → REMOVING → REMOVED`. `REMOVING` is inaccessible to new references and can be resumed after a crash. A removed identity cannot return to available or be reused. No TTL or silent garbage collection of accepted unbound assets.

Original file names, raw upload bytes, parser details, storage root, and filesystem path are not stored as public metadata. No external URL is accepted as an asset identity.

## UploadAttempt

| Field                      | Type / rule                                                                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                       | Client-generated UUID sent as `Idempotency-Key`; composite primary key with `actorUserId`, not globally unique.                                            |
| `actorUserId`              | Required FK and part of attempt identity; outcome lookup requires this exact actor even for admin-class uploads.                                           |
| `mediaClass`               | Requested class; immutable for the attempt.                                                                                                                |
| `sourceSha256`             | Hash of received source bytes when complete; no raw bytes retained here.                                                                                   |
| `state`                    | `PENDING`, `ACCEPTED`, or `REJECTED`.                                                                                                                      |
| `assetId`                  | Unique nullable FK to a reserved MediaAsset; required for `ACCEPTED`, allowed internally for `PENDING` or `REJECTED`, but never exposed before acceptance. |
| `safeFailureCode`          | Nullable allowlisted reason for `REJECTED`; no parser text/private path.                                                                                   |
| `createdAt`, `completedAt` | UTC timestamps; `completedAt` present for terminal states.                                                                                                 |

One actor/key pair can accept at most one asset; another actor using the same key has an independent attempt and cannot infer the first actor's state. Reserve the pending asset and its attempt association together after the required class field so recovery can inspect the right server-owned key. State checks require `completedAt = null` for `PENDING`, non-null for `ACCEPTED`/`REJECTED`, non-null `assetId` for `ACCEPTED`, and an allowlisted non-null failure code only for `REJECTED`. An exact retry of an accepted attempt returns that identity; same-actor reuse with changed class/bytes or after rejection returns `UPLOAD_ATTEMPT_CONFLICT`. A pending lookup returns `PENDING`, while a new POST with that key returns `UPLOAD_IN_PROGRESS`. Reconciliation settles an incomplete or unprovable interrupted attempt to `REJECTED` with safe `UPLOAD_INCOMPLETE`; only fully validated final bytes and a committed asset identity can settle it to `ACCEPTED`. The actor may query the same key after losing the response, but a rejected attempt requires a new key for another upload. Retain attempt rows for P02 recovery and do not promise an unapproved expiration window. Indices support actor-scoped lookup and bounded operational reconciliation.

## MediaReference

| Field                                 | Type / rule                                                                                                                                                                                  |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                                  | Immutable server UUID, primary key.                                                                                                                                                          |
| `assetId`                             | Required FK to MediaAsset with deletion restricted.                                                                                                                                          |
| `workId`, `chapterPageId`             | Exactly one target FK is non-null. Work supports `WORK_COVER` or `WORK_BACKGROUND`; ChapterPage supports `CHAPTER_PAGE` and its illustrated Chapter parent. No generic unverified target ID. |
| `slot`                                | `WORK_COVER`, `WORK_BACKGROUND`, or `CHAPTER_PAGE`, consistent with target and asset class.                                                                                                  |
| `version`                             | Nonnegative integer; increments on replacement/retirement.                                                                                                                                   |
| `createdAt`, `updatedAt`, `retiredAt` | UTC timestamps; `retiredAt = null` means active.                                                                                                                                             |

Partial unique indexes allow at most one active reference for `(workId, slot)` and for `chapterPageId`. An index on `(assetId, retiredAt)` makes active-use checks bounded. PostgreSQL FKs protect target/asset existence; checks protect one target/slot shape. The service verifies class matching, target existence/illustrated parent, and current asset availability inside the write transaction. Retired rows preserve target use; the events below preserve prior asset identities across replacement. No active query counts a retired row. Future gift/avatar bindings require their own accepted migrations and cannot bypass this invariant by writing arbitrary identifiers.

## MediaReferenceEvent

Each successful bind, replacement, or retirement writes one immutable event in the same PostgreSQL transaction as the current reference change. Fields are `id` (UUID), `referenceId` (FK, restrict deletion), `actorUserId` (FK), `action` (`BOUND`, `REPLACED`, `RETIRED`), `fromAssetId` (nullable only for first bind), `toAssetId` (nullable only for retirement), `resultVersion` (nonnegative), and `occurredAt`. Unique `(referenceId, resultVersion)` prevents duplicate historical transitions; FKs retain former asset identities as tombstones rather than permitting physical row deletion. The event is server-owned history, not a P02 public feed. A duplicate exact command can compare its expected transition with the committed event before returning an idempotent result; a different or stale transition conflicts.

### Reference transitions

- Create: no active reference at that target → one active reference to a matching `AVAILABLE` asset, `version = 0`; duplicate same target/asset returns the existing result only when the same actor's attempted bind is proven equivalent; different asset conflicts.
- Replace: active reference at expected `version` and `assetId` → same reference identity, new asset ID, incremented version. A duplicate exact replay may return current state only if the expected old/new transition is provable; otherwise `VERSION_CONFLICT`.
- Retire: active reference at expected version/asset → set `retiredAt` and increment version. A repeated exact retirement is stable; stale requests cannot retire a newer replacement.
- Physical asset removal: if any active reference to the asset exists, return `MEDIA_IN_USE` (409), leave bytes and row available, and queue no deletion.

The prior asset remains physically available after replacement while any other reference remains. Parent Work/Chapter publication or editing does not occur in these P02 commands. P01 public DTOs remain without media fields; P03/P04/P07 own their subsequent exposure policy.

## Concurrency and file side effects

Every bind, replacement, retirement, and removal transaction locks relevant asset rows in deterministic UUID order before inspecting availability/reference state. Reference writes also match version and current asset ID, and commit their event atomically. Partial unique constraints arbitrate concurrent first binds. Use serializable isolation only for the cross-row active-use/removal predicate and classify serialization/unique failures into a safe conflict; retry at most a bounded internal attempt when no user decision can be overwritten. Never auto-retry a stale replacement or destructive removal against a newer target.

Filesystem operations occur outside long PostgreSQL transactions. Upload order is: reserve actor-scoped attempt and associated pending asset → stream privately with limits → decode/re-encode → stage and flush → record canonical metadata/hash on the pending asset → atomic rename under persistent root → transactionally mark asset/attempt available/accepted → respond. A DB failure after rename leaves an unreachable file for reconciliation, not a false saved result. Reconciliation compares the reserved asset's recorded identity/hash with complete final bytes before accepting; otherwise it rejects the attempt and retires the reserved asset without exposing partial bytes. Removal order is: transactionally lock and verify zero active references, mark `REMOVING` → unlink the exact server key → mark `REMOVED`; failed unlink leaves resumable `REMOVING` and a safe 503, never 200. New references cannot bind to `REMOVING`. Read opens the server-derived file beneath the configured root only after server authority check and confirms expected availability/hash. Missing/corrupt bytes return a safe 503 to an authorized actor and are marked `UNAVAILABLE` only by a controlled reconciliation operation; the GET itself does not change persisted business state.

## Forward migration and existing rows

Add one new forward migration after `20260922010000_content_domain_foundation`; do not edit prior SQL or generated Prisma output. Existing Work, ChapterPage, User, and publication rows receive **no fabricated media association**. New tables/constraints/indexes can be created empty; no lossy backfill is needed. If checks on existing tables are later needed, audit/backfill before enforcement in a subsequent reviewed migration. Update exact schema inventory and fresh/populated/repeated-deploy migration tests. Deploy additive schema first, then configured writable persistent directory and API/web behavior. An old API ignores new tables; new API must fail closed when the directory is missing/unsafe. Roll back the application binary if necessary while retaining the additive schema and media files; reconcile pending/removing rows before retrying the new release. Never drop records or bytes as an automatic rollback.

## Recovery set

A recoverable unit includes database snapshot (assets, attempts, references, reference events, P01 targets), final image files, relative keys, hashes, and a manifest/checkpoint proving the pair was captured consistently. Pause media writes or use an equivalent coordinated snapshot during backup. Restore into an isolated environment, verify file hashes, target FKs, every active reference, owner/class permissions, and authorized/denied reads before enabling serving. Missing or corrupt files become `UNAVAILABLE`, with redacted operational evidence and an explicit repair path; no unrelated image substitution. Simulated release replacement must leave this root untouched.

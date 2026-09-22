# P01 Real Acceptance Quickstart

This is the smallest runnable real journey for P01. It uses the actual shared schemas,
Express middleware stack, Prisma client, deployed migrations, and a disposable
PostgreSQL 18 Testcontainer. It does not use web fixtures, mocked content services,
production credentials, or an external provider.

## Prerequisites

- P00 has passed its exit gate and P01 implementation is present.
- Node.js 24 and pnpm 11 match the root engines/package manager.
- Dependencies are already installed with the repository lockfile.
- Docker is running and can start `postgres:18.4`.
- No local `DATABASE_URL` or secret value is required; the integration global setup
  deletes any inherited database URL, starts a disposable database, deploys the real
  migration chain, and uses test-only auth configuration.

Do not point this journey at a shared, staging, or production database.

## 1. Validate and generate the data boundary

From the repository root:

```powershell
pnpm db:format
pnpm db:validate
pnpm db:generate
```

Expected:

- Prisma accepts the post-P00 plus P01 schema.
- Generated client types include only the approved post-P01 inventory.
- No applied migration is edited and no database is reset.

## 2. Prove fresh/upgrade migration behavior

```powershell
pnpm --filter @fury/database test:integration
```

Expected:

- an empty PostgreSQL 18 container receives the full migration chain;
- the exact P01 tables/enums/indexes/FKs/checks/triggers exist;
- representative post-P00 account/session data survives the P01 upgrade;
- duplicate slugs, WorkCategory pairs, chapter numbers, and page positions fail;
- fractional/non-positive numbers, invalid publication facts, identity/history
  mutation, content-kind mismatch, and broken relationships fail;
- Work type changes fail, while an illustrated draft may contain zero pages and the
  database rejects any published illustrated Chapter whose committed page set is empty;
- valid content survives reconnect; migration deploy is idempotent.

Any failure is a P01 gate failure. Do not use `db push` or `migrate reset` to bypass it.

## 3. Run the smallest real HTTP journey

```powershell
pnpm --filter @fury/api exec vitest run --config vitest.integration.config.ts src/content.integration.test.ts
```

The test must perform this sequence through `createApp` and Supertest:

1. Register and verify an account through the existing real auth routes using the
   injected test email adapter, promote that test record to `ADMIN` in the disposable
   database, and log in to obtain the normal bearer token/CSRF cookie pair.
2. Create one Category.
3. Create one `text-story` Work in draft state and assign that Category.
4. Create positive-numbered Chapter 1 with a valid version-1 structured-text document.
5. Confirm a visitor receives `NOT_FOUND` while the Work/Chapter is not eligible.
6. Publish the Work and Chapter with expected versions and valid CSRF.
7. Confirm a credential-free visitor reads only the allowlisted Work and Chapter
   metadata: no text body, raw record, version, history, account, secret, page path, or
   internal field.
8. Repeat publish and confirm `transitioned: false` and the same current publication
   event identity.
9. Unpublish or archive the Work, then confirm the identical public path returns the
   same `404 NOT_FOUND` shape used for an unknown slug.
10. Inspect PostgreSQL and prove the retained Work/Chapter state, cleared current
    publication fields, immutable prior events, relations, and zero partial/orphan data.

Expected command result: the focused integration file exits 0 with every assertion
passing. The exact test count is not prescribed; behavior coverage is.

## 4. Required failure checks in the same real stack

The focused integration suite is incomplete unless it also proves:

- anonymous management request → `401 UNAUTHORIZED` and no lookup/state change;
- active verified USER against both existing and missing IDs → identical
  `403 FORBIDDEN`;
- suspended, unverified, invalid, and stale sessions → `401` before content lookup;
- missing/mismatched CSRF on an authorized unsafe request → `403` and unchanged state;
- legacy `short-story`/`comic`, extra authority fields, malformed blocks, unsafe links,
  zero/fractional chapter numbers, and over-limit input → `400 VALIDATION_ERROR` with
  target-prefixed field paths;
- duplicate normalized slug/number → `409 CONTENT_CONFLICT` and no partial write;
- duplicate Category IDs in one replacement → `400 VALIDATION_ERROR`; repeating the
  already-authoritative Category set → unchanged `200` with no duplicate/version bump;
- changed immutable slug or Work type → `409 CONTENT_IMMUTABLE` and unchanged Work/
  Chapter state;
- illustrated Chapter create with omitted `pages` → valid empty draft; explicit
  `pages: []` → `400 VALIDATION_ERROR`; publishing the empty draft →
  `409 CONTENT_TRANSITION_CONFLICT` with no event, after which a valid non-empty page
  sequence makes a later publish eligible;
- stale incompatible publication command → `409 CONTENT_STALE_WRITE`;
- simultaneous identical publication commands → one actual transition/event and a
  convergent authoritative result;
- simultaneous incompatible commands → one winner, one conflict, no lost newer state;
- a forced dependent-write failure → complete database rollback;
- every safe error includes the request ID and excludes sentinel secret/SQL/internal
  values.

## 5. Final repository gate

After focused failures are resolved:

```powershell
pnpm verify
```

Expected: Prisma format/validate/generate, formatting, lint, type checks, unit tests,
both disposable-database integration suites, builds, output verification, and
`git diff --check` all pass against the same final tree.

Record the exact command output, Docker/PostgreSQL version, relevant warnings, and any
unverified production backup/deployment/device boundary. Stop at P01 review; this
quickstart does not authorize deployment, seeding real content, a database reset,
commit/push, screen connection, media work, or a later roadmap phase.

The web portion of P01 is type-only. Confirm the final diff does not modify existing
admin/discovery/text-story fixture values, quote blocks, rendered components, controls,
routes, or mock interactions; any such change is a scope failure, not a browser-evidence
substitute.

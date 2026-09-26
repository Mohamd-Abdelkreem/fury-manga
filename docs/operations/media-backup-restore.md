# Media backup and restore

P02 media recovery treats PostgreSQL records and the private media directory as one coordinated recovery set. A database-only or file-only copy is incomplete.

## Before backup

1. Confirm the API readiness endpoint reports healthy database and media storage state.
2. Quiesce media writes for the backup window. Stop uploads, reference mutations, removals, and reconciliation while the snapshots are taken.
3. Record the application release identifier, database migration state, backup timestamp, and the configured media root mount identity. Do not record credentials or the absolute media path in shared logs.

## Coordinated backup

1. Create a PostgreSQL backup with the deployment's approved database tool.
2. Copy the private media root, including final `{asset UUID}.bin` objects and the `.staging` directory, into the approved encrypted backup destination.
3. Produce a manifest outside the application repository containing each final object UUID, byte length, and SHA-256. Protect the manifest as operational data.
4. Resume writes only after the database backup, file copy, and manifest share the same backup timestamp and have completed successfully.

## Isolated restore validation

1. Provision a clean PostgreSQL instance and a clean private media directory outside the application release.
2. Restore the database first, then restore the media directory with private file and directory permissions.
3. Configure the isolated API with the restored database and media root. Run database migrations normally; never edit an applied migration.
4. Run `pnpm --filter @fury/api media:reconcile --limit=100` manually. Repeat bounded runs only after reviewing each report.
5. Compare the restored manifest with `media_assets` identities, byte lengths, and hashes. Verify active `media_references`, their parent Work or ChapterPage targets, and `media_reference_events` history.
6. Authenticate as the owning user or an administrator as appropriate. Verify metadata and binary reads. Verify an unauthenticated visitor and an unrelated user receive the documented denial without learning whether a private object exists.
7. Restart the isolated API and replace the application release while retaining the mounted media directory. Repeat identity, hash, reference, and authorization checks.

## Damage and interruption handling

- A pending attempt is accepted only when its reserved asset metadata and final or staged bytes match. Otherwise reconciliation removes partial bytes and settles it as rejected with `UPLOAD_INCOMPLETE`; retry uses a new idempotency key.
- An asset left in `REMOVING` is completed by the operator command and retains its database tombstone and reference history.
- A missing or hash-mismatched available object becomes `UNAVAILABLE` only during reconciliation. Normal GET requests report `MEDIA_UNAVAILABLE` without changing database state.
- Restored bytes return an unavailable asset to `AVAILABLE` only when byte length and SHA-256 match the existing record. Never substitute different content under an existing asset UUID.
- Accepted unbound assets are retained. Reconciliation does not garbage collect them.

## Rollback and retry

If validation fails, keep the isolated environment unavailable, preserve its logs and reconciliation report, and restore again from the original coordinated snapshot. Do not copy repaired rows back to production individually. Production restore, backup scheduling, retention, encryption keys, storage permissions, proxy behavior, and multi-process coordination require deployment-specific approval and evidence.

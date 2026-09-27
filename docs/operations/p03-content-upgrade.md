# P03 published-content upgrade

This procedure is for an isolated copy of a populated P01/P02 database and its matching private media directory. It does not authorize a production inventory, repair, migration, or restore. Preserve a coordinated PostgreSQL and media backup using [the P02 procedure](media-backup-restore.md) before staging the upgrade.

Complete and record the P03 published-Work readiness gate before a populated
P04 Chapter upgrade. The later [P04 procedure](p04-chapter-upgrade.md) adds its
own Chapter title/page/media inventory and staged enforcement decision; a P03
zero-row result does not clear that separate gate.

Migration `20260925010000_p03_editorial_foundation` (A) adds nullable Work
editorial fields, Work tags and featured constraints, then backfills category
positions by `(created_at, id)` without creating missing synopsis, author or
cover values. Migration `20260925020000_p03_published_readiness` (B) adds
cross-row published-readiness guards. Migration
`20260926010000_p03_work_category_limit` (C) limits each Work to 100 Category
links. Migration `20260926020000_p03_enabled_category_assignments` (D) rejects
new links to disabled Categories while preserving existing links. Rehearse A and
the inventory below on an isolated populated copy before B; a fresh
installation applies A through D in order.

## Inventory before the strict guard

Run the following read-only query against the isolated database after migration A. Keep the returned IDs in an operator-only record. A zero-row result is required before migration B. The query deliberately counts only active, available administrative work-cover associations and enabled categories.

```sql
SELECT w.id, w.slug,
       (w.synopsis IS NULL OR char_length(btrim(w.synopsis)) < 20) AS missing_synopsis,
       (w.author IS NULL OR btrim(w.author) = '') AS missing_author,
       NOT EXISTS (
         SELECT 1 FROM work_categories wc
         JOIN categories c ON c.id = wc.category_id
         WHERE wc.work_id = w.id AND c.enabled
       ) AS missing_enabled_category,
       NOT EXISTS (
         SELECT 1 FROM media_references r
         JOIN media_assets a ON a.id = r.asset_id
         WHERE r.work_id = w.id AND r.slot = 'work_cover'
           AND r.retired_at IS NULL AND a.media_class = 'work_cover'
           AND a.scope = 'admin' AND a.status = 'available'
       ) AS missing_available_cover
FROM works w
WHERE w.publication_status = 'published'
  AND (
    w.title IS NULL OR btrim(w.title) = ''
    OR w.synopsis IS NULL OR char_length(btrim(w.synopsis)) < 20
    OR w.author IS NULL OR btrim(w.author) = ''
    OR NOT EXISTS (
      SELECT 1 FROM work_categories wc
      JOIN categories c ON c.id = wc.category_id
      WHERE wc.work_id = w.id AND c.enabled
    )
    OR NOT EXISTS (
      SELECT 1 FROM media_references r
      JOIN media_assets a ON a.id = r.asset_id
      WHERE r.work_id = w.id AND r.slot = 'work_cover'
        AND r.retired_at IS NULL AND a.media_class = 'work_cover'
        AND a.scope = 'admin' AND a.status = 'available'
    )
  )
ORDER BY w.id;
```

The database cannot prove that the stored bytes exist or match the asset record. Compare every active published-cover asset with the coordinated private media manifest (UUID, length, SHA-256), then run the bounded P02 reconciler in the isolated environment. Re-run the inventory afterward; `UNAVAILABLE` covers must appear as invalid. Check for orphaned or conflicting active references and retain the P02 reference-event history.

## Repair and gate

For each listed work, an authorized administrator either completes the missing metadata/category/verified cover through the existing management API or explicitly returns the work to draft for editorial repair. Do not invent synopsis, author, category, or cover values. Returning to draft clears the current publication pointer/time and advances the work version, while earlier `publication_events` and media-reference events remain. Reload each work and compare its saved state, association, and event count. Record the operator decision against its UUID.

Stop if any invalid published row, unmatched media bytes, or inconsistent active reference remains. Do not install migration B to bypass an invalid row. Its failed transaction rolls back the guard objects. In the isolated rehearsal, verify that rollback, record the failed attempt as rolled back with `prisma migrate resolve --rolled-back 20260925020000_p03_published_readiness`, repair the data, and retry the same forward migration. Never edit an applied migration or mark a failed migration successful. Restore PostgreSQL and media as one set only under the approved recovery procedure.

Coordinate the API, shared contracts and web client when enabling P03 editing.
The API still accepts minimal P01 Work create/update bodies as drafts, while
the expanded strict admin response can reject an independently deployed older
strict client. Keep chapter routes and P02 upload transport on their existing
contracts. If validation or migration B fails, leave the connected editor
unavailable until the rows and matching private bytes are repaired; do not
report an incomplete legacy published Work as publicly eligible. Public
metadata reads already fail closed for incomplete or unavailable-cover Works.

## Isolated rehearsal evidence

The migration integration test constructs a populated P01/P02 upgrade with an incomplete legacy published work, observes its inventory result, verifies that the strict guard refuses it, returns it to draft while retaining its publication event, and repeats the inventory before installing migration B. Its isolated populated-upgrade and installed-guard assertions are automated rehearsal evidence. A fresh test command and its outcome must be recorded at each review gate; this runbook does not certify a production inventory or backup.

After a successful isolated migration, repeat the read-only inventory and direct-write guard tests. Public metadata must fail closed for any later published work whose cover becomes unavailable during reconciliation; verified byte restoration and a fresh readiness check are required before it reappears.

Before applying C and D to a populated copy, check for Works with more than 100
Category links. These migrations retain existing links; an over-limit Work
remains over limit until an authorized editor removes links. New insertions are
rejected in that state. Use this read-only inventory:

```sql
SELECT work_id, count(*) AS category_count
FROM work_categories
GROUP BY work_id
HAVING count(*) > 100
ORDER BY work_id;
```

Rehearse concurrent inserts at the limit and an
assignment racing with Category disable against the isolated copy. If C or D
fails, inspect the migration failure, resolve the failed attempt as rolled back,
repair the cause, and retry the same unapplied migration. Keep the coordinated
PostgreSQL and media backup for restore under the linked recovery procedure.

# P04 Chapter storage upgrade

This procedure is for an operator-reviewed P01–P03 to P04 upgrade. The P04 reviewer and P02/P03 exit gates remain open in `specs/005-admin-chapter-publishing/evidence.md`; local migration tests do not authorize a populated deployment. Use the [data model](../../specs/005-admin-chapter-publishing/data-model.md) for invariants and the [Chapter contract](../../specs/005-admin-chapter-publishing/contracts/chapter-http.md) for the later API cutover.

For the owner-approved development-only P04 implementation gate, generate representative legacy Chapters and matching private media in an isolated database, back up and restore both, and rehearse the same staged procedure below. Record synthetic editorial choices as fixture decisions only. Passing this trial permits checked implementation tasks; it does not approve P00–P03 reviewer gates, establish the state of future deployment data, or authorize a deployed migration. On an actual deployment, repeat every inventory, real editorial decision and recovery step with separate authorization.

The checkout contains the expand migration
`20260926030000_p04_chapter_expand`, separate enforcement migration
`20260926040000_p04_chapter_enforce`, and title-bearing public contract.
The isolated synthetic restore, remediation, inventory and staged-deploy test
passes. An operator-reviewed real-data remediation record and deployment recovery
point do not exist. Apply the full migration directory only to a fresh empty
database; do not apply it as a populated P04 upgrade.

## Isolated synthetic rehearsal record (2026-09-27)

The real PostgreSQL integration test `chapter-upgrade.integration.test.ts` created
`p04_expand_5e402c94f62f46f7b2af986733652db6` with the P01–P03 migrations
and generated legacy rows, then made a custom-format `pg_dump` with SHA-256
`1b1d2ca9485133cbccac35c3a31d0e945894f8aa2d2d601e174fd6f09cc02b84`.
It dropped and recreated that disposable database and restored the dump. Its
matching private PNG copy had SHA-256
`d8aeb7b31114535bbf9035568464d5eb3dadfabaa70525a487d2c04571203426`.
The test verified the restored media hash and retained Chapter, page, reference
and publication-event IDs before applying expand. The dump and media copy were
removed after the trial; these hashes identify the exercised recovery point,
not an available production backup.

| Generated row                                              | Fixture decision on expanded restore                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Illustrated Chapter `696fe060-be21-41a5-9385-90a401088b2c` | Set title to `Synthetic illustrated chapter`; retain referenced page `73bfee19-dd62-405e-babe-7c0894ef8fa5` and reference `00163c22-8076-4735-ace7-5a7ba0c04a29`; retire unbound page `1c3770db-279d-4eeb-b9e4-2fe6dab83f55` and the unbound page added during failure testing; publish with new event `f10ff0a1-d601-4530-ab92-a5dbc660dfc4`. |
| Text Chapter `b92bdcf8-86d9-46a3-b27e-8b33ee722a63`        | Set title to `Synthetic text chapter`; replace the trial-cleared body with a valid version-1 paragraph; publish using its retained historical event `ee4e4ab5-8f60-4886-985d-152e018cbba4`.                                                                                                                                                    |

The test first proved that enforcement fails and rolls back while those rows
are unresolved, then resolved the failed migration record. After explicit
fixture decisions, `chapter:inventory` reported `checked:1, invalidIds:[]`;
the final title/type/text/page/reference/readiness/event SQL inventory returned
zero violations. It applied expand `20260926030000_p04_chapter_expand`, then
enforce `20260926040000_p04_chapter_enforce`, rejected post-enforcement page
gaps and reference/class corruption, preserved both event IDs, and repeated
deployment with no pending migration. A fresh empty install applied both in
order. This record permits the synthetic implementation gate only.

## Release 0: baseline and recovery point

1. Confirm recorded P02/P03 exit dispositions, P04 reviewer acceptance, approved maintenance window, and the current application/migration versions. Capture a coordinated PostgreSQL and private media snapshot. Verify a restore of both on an isolated copy and record its identity and recovery procedure. Do not use an untested database-only backup as a media recovery point.
2. On the restored copy, record Chapter IDs, Work IDs, types, states, current event IDs, and media reference/event counts. Run the baseline inventory below before the expand migration; `chapters.title` and `chapter_pages.retired_at` do not yet exist. Export the row IDs and totals to the restricted operator record. Investigate missing or inconsistent events and media bytes with the P02 recovery procedure.
3. Decide and announce the cutoff for independently deployed old Chapter writers and generic `chapter_page` reference writers. Stop those writes before remediation starts. Keep the last compatible, title-free public Chapter API projection available during the expand interval. Do not enable P04 title-required request/response contracts yet.

```sql
SELECT migration_name, finished_at, rolled_back_at
FROM _prisma_migrations
ORDER BY started_at;

SELECT id, work_id, number, content_type, publication_status,
       current_publication_event_id
FROM chapters
ORDER BY work_id, number, id;

SELECT p.chapter_id, p.id AS page_id, p.position,
       count(r.id) FILTER (WHERE r.retired_at IS NULL) AS active_references
FROM chapter_pages p
LEFT JOIN media_references r ON r.chapter_page_id = p.id
GROUP BY p.chapter_id, p.id, p.position
ORDER BY p.chapter_id, p.position, p.id;

SELECT c.id, c.content_type, c.publication_status,
       count(e.id) AS publication_events
FROM chapters c
LEFT JOIN publication_events e ON e.chapter_id = c.id
GROUP BY c.id, c.content_type, c.publication_status
ORDER BY c.id;
```

## Release 1: expand only

Package `20260926030000_p04_chapter_expand` as the **only pending P04 migration**. On the restored populated copy, run `pnpm --filter @fury/database db:migrate:deploy` and record the applied version and schema result. Rehearse the same package and preflight in the target environment under its approved deployment procedure. Do not ship a package containing the later enforcement migration to an unremediated populated database: `db:migrate:deploy` would apply every pending migration in order.

The expand adds nullable Chapter title, nullable page retirement time, active-position uniqueness, and null text for private draft/archived Chapters. It preserves IDs, existing media references/events and publication history. Old public metadata must remain title-free. Independently deployed old writers stay blocked even though the expand schema still accepts some old shapes.

## Controlled remediation on the expanded schema

Inventory violations by stable IDs in bounded batches. The SQL below finds missing titles, published text lacking a nonempty version-1 block array, and active illustrated pages without one available admin `chapter_page` image. It is only a prefilter for text: it does not validate nested blocks or links. With independent Chapter writes stopped, run `pnpm --filter @fury/api chapter:inventory` against the restored expanded database. This read-only command checks every published text document against the executable shared schema in ID-ordered batches of 100 and emits `{checked,invalidIds}`; it exits with code 2 when any invalid ID remains. Record the count and every invalid ID in the restricted operator record, then repeat after remediation until `invalidIds` is empty. Review active positions for gaps per Chapter as well. The database cannot verify file bytes; reconcile/verify media through the existing P02 procedure and inspect the private root on the restored copy.

```sql
SELECT id, work_id, number, publication_status
FROM chapters
WHERE title IS NULL OR btrim(title) = ''
ORDER BY id;

SELECT id, work_id, number
FROM chapters
WHERE publication_status = 'published' AND content_type = 'text'
  AND (text_content IS NULL
       OR text_content->>'version' IS DISTINCT FROM '1'
       OR jsonb_typeof(text_content->'blocks') IS DISTINCT FROM 'array'
       OR jsonb_array_length(
            CASE WHEN jsonb_typeof(text_content->'blocks') = 'array'
                 THEN text_content->'blocks' ELSE '[]'::jsonb END
          ) = 0)
ORDER BY id;

SELECT p.chapter_id, p.id AS page_id, p.position,
       count(r.id) FILTER (
         WHERE r.retired_at IS NULL AND r.slot = 'chapter_page'
           AND a.media_class = 'chapter_page' AND a.scope = 'admin'
           AND a.status = 'available'
       ) AS ready_references
FROM chapter_pages p
LEFT JOIN media_references r ON r.chapter_page_id = p.id
LEFT JOIN media_assets a ON a.id = r.asset_id
WHERE p.retired_at IS NULL
GROUP BY p.chapter_id, p.id, p.position
HAVING count(r.id) FILTER (
         WHERE r.retired_at IS NULL AND r.slot = 'chapter_page'
           AND a.media_class = 'chapter_page' AND a.scope = 'admin'
           AND a.status = 'available'
       ) <> 1
ORDER BY p.chapter_id, p.position, p.id;

SELECT chapter_id, count(*) AS active_pages,
       count(DISTINCT position) AS distinct_positions,
       min(position) AS first_position, max(position) AS last_position
FROM chapter_pages
WHERE retired_at IS NULL
GROUP BY chapter_id
HAVING min(position) <> 1 OR max(position) <> count(*)
    OR count(DISTINCT position) <> count(*)
ORDER BY chapter_id;

SELECT c.id, c.current_publication_event_id
FROM chapters c
LEFT JOIN publication_events e
  ON e.id = c.current_publication_event_id
 AND e.chapter_id = c.id
 AND e.occurred_at = c.published_at
WHERE c.publication_status = 'published'
  AND (c.current_publication_event_id IS NULL OR e.id IS NULL)
ORDER BY c.id;

SELECT c.id, c.work_id, c.number
FROM chapters c
WHERE c.publication_status = 'published'
  AND c.content_type = 'illustrated'
  AND NOT EXISTS (
    SELECT 1 FROM chapter_pages p
    WHERE p.chapter_id = c.id AND p.retired_at IS NULL
  )
ORDER BY c.id;
```

An authorized editor supplies each real missing title and accepted image association, or explicitly chooses a supported Chapter publication-state change when repair is unavailable. Do not derive a title from a number, silently unpublish, insert placeholder media, delete historical rows, or rewrite events. Record the actor, Chapter/page IDs, reason, previous and intended state, matching database/media snapshot, and result for every decision. Apply bounded, version-checked batches in transactions on the restored copy first; inspect affected row counts and Chapter/page/reference/event identities after each batch. A failed or ambiguous batch remains unresolved until checked against authoritative state. Use the same controlled procedure in the target environment only with separate production authorization.

Re-run the full inventory, including title, published content, active page order/reference/media availability, media bytes, and event links. Record **zero** final violations plus the reviewed decision log before preparing enforcement. Any unresolved row or missing editorial decision stops the cutover.

## Release 2: enforce and API/web cutover

Only after the zero-violation gate, package the separate forward enforcement migration and coordinated shared contracts, API and web versions. The checkout already contains both migrations and the title-bearing API; a deployment must stage its own artifacts so only expand is pending at Release 1. Rehearse expand → decisions/remediation → enforce on a disposable populated restore, and both migrations in order on a fresh empty database. Confirm the applied migration names, constraints, preserved IDs/events, OpenAPI, admin reads/writes and title-bearing public allowlist. Reopen editorial writes only after all producers and consumers agree and the smoke checks pass. P04 still does not serve protected reader bytes; that belongs to P07.

If expand fails, preserve the compatible service, inspect `_prisma_migrations` and the database/media recovery point, and correct forward. If remediation or enforcement fails, keep writers and cutover blocked, preserve the expanded rows, repair the cause, and repeat the inventory. A failed migration must be confirmed rolled back before `prisma migrate resolve --rolled-back <migration-name>` is used; never mark an incomplete migration successful or edit an applied migration. If the API/web cutover fails after new writes, retain the forward schema and prepare a corrective release. A restore after new writes requires a coordinated database/media restore, publication-event verification, and explicit acceptance of the data-loss window. Record each failed-stage rehearsal and the selected recovery action before any release claim.

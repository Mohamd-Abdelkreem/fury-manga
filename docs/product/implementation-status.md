# Fury implementation status (P03 checkout, 2026-09-26)

## Current media-foundation overlay — 2026-11-01

The historical P03 inventory below remains dated. The owner has now approved all
six existing numerical media limits, superseding the old P02 T002/T067 artwork
prerequisite through the dated accepted-artifact overlay. This does not assert
human review of generated artwork. The current P02 extension implements bounded
GIF/WebP animation for Work cover/background/Chapter pages and consumes bounded
progressive loading in the real persisted administrator Chapter preview. Existing
public Work images and private candidate previews preserve normal animation and
use temporary still presentation for reduced motion.

The protected chapter route still uses `MOCK_PAGES`; API-enforced user reading,
progress, resume and opens remain P07, with exact requirements in the existing
[roadmap](../../PLAN.md#p07--protected-readers-progress-completion-and-resume).
Legacy closeout is COMPLETE and NEXT SPEC is READY after the current actual full
verification and clean separate convergence. The dated numerical/artwork gate
mentioned in older sections is superseded; use
[the current legacy register](legacy-closeout.md) and [media evidence](../../specs/002-persistent-vps-media/evidence/media-foundation/README.md)
for current verification/readiness. No future phase or release is implemented.

This inventory describes the checked-out implementation, not the intended final product. A rendered sample or a local state change is not evidence of a saved record. `PLAN.md` owns the phase boundaries; the named source files establish current behavior.

| Surface and current source                                                                                                                                                           | Current behavior                                                                                                                                                                | Owning phase                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Account registration, verification, login, refresh, profile (`apps/api/src/modules/auth`, `apps/api/src/modules/users`, `apps/web/src/features/auth`, `apps/web/src/features/users`) | Persistent account and session API; supported profile edits reach the API. Phone has been retired in P00.                                                                       | Existing auth; P00 cleanup                  |
| Canonical work/category/chapter schema and contracts (`packages/database/prisma/schema.prisma`, `packages/contracts/src/content`)                                                    | P01 content persists; P03 adds ordered/enabled categories, work editorial metadata, tags, featured preference and publication-readiness guards.                                 | P01/P03; chapter authoring in P04           |
| Public category, discover, home, illustrated and text story data (`apps/web/src/features/categories/data`, `discover/data`, `home/data`, `story/data`, `text-stories/data`)          | Static catalog and story fixtures; the API publishes eligible work metadata, but these public screens do not read it.                                                           | P05 catalog                                 |
| Admin categories (`apps/web/src/features/admin/components/AdminCategories`, `features/admin/hooks/admin-content.hooks.ts`)                                                           | Saved category create/search/rename/order/enablement and usage counts use the ADMIN API.                                                                                        | P03                                         |
| Admin works (`apps/web/src/features/admin/components/AdminWorks`, `AdminWorkForm`, `features/admin/hooks/admin-content.hooks.ts`)                                                    | Saved work list/editor and publication transitions use the ADMIN API; confirmed cover/background selection binds P02 media.                                                     | P03                                         |
| Admin chapters (`apps/web/src/features/admin/data/adminFixtures.ts`, `hooks/use-admin-work-actions.ts`, `components/AdminChapterForm`)                                               | Chapter identities, parent presentation metadata and chapter actions remain local P04 previews, separate from saved P03 Works.                                                  | P04, using P02 media                        |
| Fixture chapter reader (`apps/web/src/app/story/[id]/chapter/[chapterId]/page.tsx`, `features/text-stories/components/TextChapterReader`)                                            | Existing client session gate hides the reader for visitors; chapter data/images and completion remain fixtures or session-local. API reader authority and progress are pending. | P07, using P02/P04 content                  |
| Dashboard, library, bookmarks, ratings and appearance (`apps/web/src/features/workspace/data`, `library/data`, `account`, `story/components/StorySidebar`)                           | Mixed fixture and component state; account profile is the separate real API exception.                                                                                          | P06, P07, P10 as assigned in `PLAN.md` §3.4 |
| Work/chapter discussion (`apps/web/src/features/story/data/comments.ts`, `components/CommentsSection`, `features/text-stories/components/TextDiscussion`)                            | Local comment, like and report previews; no publication, moderation or delivery.                                                                                                | P08                                         |
| Navbar and workspace notifications (`apps/web/src/features/notifications/data`, `components/workspace/workspace-notifications.tsx`)                                                  | Fixture notifications and local read state.                                                                                                                                     | P09                                         |
| Gift designs and grants (`apps/web/src/features/admin/hooks/use-admin-gift-actions.ts`, `features/account/data/gifts.ts`)                                                            | Fixture/context preview, including notification text; no actual grant or delivery.                                                                                              | P10, using P02 media                        |
| Contact and issue forms plus admin inbox (`apps/web/src/features/support/components`, `features/admin/hooks/use-admin-contact-actions.ts`)                                           | Validated page preview and fixture inbox; forms neither submit nor create a ticket.                                                                                             | P11                                         |
| Admin metrics (`apps/web/src/features/admin/components/AdminDashboard`)                                                                                                              | Work fixture totals, work cards and fabricated work activity are removed; remaining metric cards/activity are marked demo.                                                      | P12                                         |
| Public ad placements/detection and admin controls (`apps/web/src/features/advertising`, `features/admin/hooks/use-admin-ad-actions.ts`)                                              | Public rendering/detection disabled; admin controls are local preview only. No provider delivery.                                                                               | P13                                         |

The `/admin` layout uses an ADMIN client guard. P03 management routes also enforce live account status, role and CSRF at the API. Other preview domains need server authority in their owning phases. P07 owns API-enforced reader content authorization.

`README.md` and `PROJECT_REFERENCE.md` describe the current implemented boundaries. P03 browser and deployment acceptance remain separate from this source inventory.

## Current closeout addendum — 2026-10-31

The table above is the dated P03 snapshot. Current source now connects admin Chapter list, create/edit, publication and saved preview through `admin-chapter.api.ts`, `admin-chapter.hooks.ts` and the canonical content renderer. The API and database persist titles, structured text, stable ordered page/media associations and publication history. Public Chapter output is metadata only; the fixture reader remains protected and local pending P07.

The dated table above remains the original P03 snapshot. The 2026-11-01 P05
functional integration now connects public home, discovery, stories, categories
and both Work-detail compositions to real PostgreSQL-backed public APIs. It adds
request-time metadata, sitemap/robots, truthful recovery and credential-free Blob
images. URL filters/counts/pagination are server-authoritative; Chapters remain
informational until P07. Fabricated P05 engagement/trending and community counts
are removed or clearly deferred under the owner's constitution 2.1.0 exception.

The protected fixture reader, personal workspace and unrelated admin preview
features retain their existing ownership. No P06/P07 functionality, deployment,
production migration, commit or push is included. Current verification, independent
review, final task markers and the exact remaining P02 artwork gate belong in
[the legacy register](legacy-closeout.md) and [P05 evidence](../../specs/006-public-catalog-discovery-seo/evidence.md).
Completing P05 technical work does not imply formal inherited phase acceptance.

The final integration also corrected P03 T106's stale publication confirmation
without presentation changes: confirmations carry Work identity/revision and
equal/newer server data wins. Actual same-editor publish→unpublish→republish
passed without reload. P05 T083 now reconciles browser visibility with server
metadata through bounded refresh and consumed immutable access snapshots; actual
compiled Next acceptance and final checks are linked in the evidence owner above.

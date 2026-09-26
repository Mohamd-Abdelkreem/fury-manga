# Fury MVP — Codebase-Aligned Spec Kit Roadmap

- **Status:** Proposed execution roadmap derived from the approved product baseline and the current repository
- **Repository assessed:** `D:/MINE/Software Engineering/Projects/Mostaql/fury-manga`
- **Assessment date:** 2026-09-22
- **Product UI language:** Arabic
- **Layout direction:** Right-to-left (RTL)
- **Roadmap language:** English
- **Execution model:** One independently accepted Spec Kit feature per delivery phase

## 1. Purpose and authority

This document converts the approved `PLAN.md` product scope into an implementation sequence grounded in the code that exists now. It is intentionally more specific than the delivery section in `PLAN.md`: it identifies what must be preserved, what is only fixture-backed presentation, what conflicts with the approved product decisions, and which repository surfaces each phase must change.

Source priority remains:

1. Approved product decisions in `PLAN.md`.
2. Current executable behavior and database/API contracts.
3. Approved visual behavior in the current frontend and `DESIGN-SYSTEM.md`.
4. Historical audit findings in `DESIGN-SYSTEM-INCONSISTENCIES.md` after re-verifying them against current code.
5. Fixture content, placeholder copy, local-only actions, and obsolete controls.

The current UI is a design asset, not a source of product truth. Existing local actions must be replaced, not promoted into production behavior without contracts, authorization, persistence, and tests.

## 2. Assessment scope and evidence

The assessment covered:

- Root workspace configuration, package manifests, Turbo tasks, Caddy routing, and PostgreSQL Compose configuration.
- The complete frontend route inventory and feature/component/data organization under `apps/web/src`.
- Frontend transport, session restoration, route guards, forms, local fixture stores, readers, public discovery, workspace, admin, support, gifts, notifications, and advertising implementation.
- The Express application composition, middleware, security infrastructure, auth/users/health modules, OpenAPI document, configuration, and existing tests under `apps/api/src`.
- Shared schemas under `packages/contracts/src`.
- Prisma schema, initial migration, client, optional seed flow, and database tests under `packages/database`.
- Current Spec Kit templates and configuration under `.specify`.
- `README.md`, `PROJECT_REFERENCE.md`, `DESIGN-SYSTEM.md`, `DESIGN-SYSTEM-INCONSISTENCIES.md`, and the available engineering guides.
- The repository route smoke script. During this assessment, `pnpm test:web-routes` completed successfully against the already running local web server and verified 40 concrete URLs plus the 404 fallback. That script verifies HTTP status after redirects; it does not prove authentication, persistence, or domain integration.

The assessment did not treat `.env`, credentials, generated Prisma output, dependency source, screenshots, or generated aggregate code files as product implementation sources.

## 3. Verified current repository baseline

### 3.1 Architecture

The repository is a pnpm 11/Turborepo TypeScript monorepo requiring Node.js 24.

| Surface              | Verified current implementation                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Web                  | `@fury/web`: Next.js 16.2.12, React 19.2.8, React Query, React Hook Form, Zod, Axios, CSS Modules, Lucide, and Embla |
| API                  | `@fury/api`: Express 5.2.1, Zod/OpenAPI, Pino, JWT, Argon2id, CSRF, rate limiting, email adapters, and Prisma access |
| Contracts            | `@fury/contracts`: authentication, safe-account, HTTP envelope, field-error, and pagination schemas only             |
| Database             | `@fury/database`: Prisma 7.9.1 with PostgreSQL; current schema has exactly `User` and `RefreshToken`                 |
| Production topology  | Caddy routes `/api/*` to the API and other traffic to Next.js on one origin                                          |
| Local infrastructure | `compose.yaml` provisions PostgreSQL only; it is not a complete production stack                                     |

### 3.2 Implemented and API-connected behavior

The following behavior is real and persistent now:

- Registration with email/password and verification-email delivery.
- Verification-token consumption and verification resend.
- Login, rotating refresh sessions, logout, and logout-all.
- Forgot-password, reset-token validation, password reset, and password change.
- Current-user read and profile update.
- Active/verified-account checks on protected API requests.
- Suspended-account rejection during protected API authentication.
- In-memory browser access token, HttpOnly refresh cookie, readable CSRF cookie, single-flight refresh, request retry, and safe login return paths.
- Health liveness/readiness and generated OpenAPI JSON.
- Request IDs, safe error envelopes, input validation, logging redaction, CORS, CSRF, rate limiting, and email-provider abstraction.

The actual API module inventory is limited to `auth`, `users`, and `health`. No content, media, library, progress, rating, community, notification, gift, support, admin-domain, or advertising API module exists.

### 3.3 Frontend scale and implementation state

The current frontend contains:

- 37 physical App Router `page.tsx` files.
- 193 TSX files, 61 TS files, 65 CSS files, and 52 frontend test files under `apps/web/src`.
- Complete visual route families for public, authentication, workspace, and admin experiences.
- A client-side `ProtectedRoute` for workspace pages and an `ADMIN`-role client guard around the admin layout.
- A global search that correctly routes to `/discover?q=...`.
- The `/admin/categories` route and local UI already exist.

Except for auth/current-profile flows, product-domain screens use fixtures or local component/context state. The largest fixture sources are `features/admin/data/adminFixtures.ts`, text-story fixtures, illustrated-story fixtures, and discovery fixtures.

### 3.4 Important code/product mismatches

| Current code reality                                                                                        | Approved product requirement                                                  | Roadmap treatment                                                                                                        |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `User.phone`, phone contracts, mapping, service updates, and tests still exist                              | Phone is removed from the MVP                                                 | Remove through a forward migration and coordinated contract/API/test update in P00                                       |
| Reader route is not inside a protected layout and renders fixture content                                   | Active verified account is required before chapter content is returned        | Block fixture reader access in P00; implement API-enforced reader access in P07                                          |
| Admin pages use an `ADMIN` client guard, but no admin-domain APIs exist                                     | Every admin endpoint must authorize `ADMIN`                                   | Preserve client guard; add API authorization to every admin slice in its owning phase                                    |
| `/admin/categories` is already implemented with `ADMIN_CATEGORY_FIXTURES` and local state                   | Category management must be persistent                                        | Reuse its visual UI and connect it in P03; do not create another route shell                                             |
| Admin records and mutations live in `AdminDataProvider` and reset to fixtures                               | Admin behavior must survive sessions and be auditable                         | Replace each context capability with React Query and API mutations in the owning phase; delete the replaced fixture path |
| Illustrated chapter form accepts `step="0.1"`, `min="0"`, and example `44.5`                                | Chapter number is a positive integer                                          | Correct immediately in P00 and enforce in database/contracts in P01/P04                                                  |
| Illustrated editor inserts random sample image paths                                                        | Chapter pages must use validated VPS uploads                                  | Preserve reorder/preview UI; replace sample actions with P02 media uploads in P04                                        |
| Text editor uses a Markdown-like string and supports quotes; public fixture renderer uses structured blocks | Approved text blocks are paragraphs, headings, bold, italic, lists, and links | Define one structured format and one shared renderer in P04; remove unsupported quote behavior                           |
| Public home, discover, stories, categories, and work details read different fixture sources                 | One published catalog is the source of truth                                  | Create canonical read models and connect all public routes in P05                                                        |
| Dashboard, library, ratings/bookmarks, and appearance use fixtures/local state                              | Personal data must persist per user                                           | Replace by vertical slice in P06, P07, and P10                                                                           |
| Text reader calculates 75% locally and claims completion was recorded                                       | Progress/completion must persist                                              | Correct copy during P00 if necessary; persist progress in P07                                                            |
| Illustrated reader uses eight remote mock images                                                            | Reader pages must come from protected chapter data                            | Replace in P07 after P02/P04                                                                                             |
| `CommentsSection` and `TextDiscussion` maintain separate local comment state                                | Work/chapter comments share one persistent community model                    | Consolidate around one API feature in P08                                                                                |
| Navbar and workspace implement separate notification fixture stores                                         | One notification source and read state are required                           | Consolidate into one query/component model in P09                                                                        |
| Gifts are color/tone fixture records without uploaded asset identifiers                                     | Gifts are static transparent PNG/WebP designs granted by admins               | Replace with P02 media-backed entities in P10                                                                            |
| Contact/issue forms wait 250 ms and show success without sending data                                       | Submissions must reach a persistent admin inbox                               | Connect public and admin sides together in P11                                                                           |
| Admin dashboard adds local deltas to hard-coded baseline metrics                                            | Metrics must be derived from authoritative data                               | Replace in P12                                                                                                           |
| Public ad slots and ad-block detection use static constants with global enablement hard-coded `true`        | Operational enablement must control the two placements safely                 | Disable fake production assumptions in P00; connect safe settings/provider configuration in P13                          |
| Admin ad state is stored in `AdminDataProvider`, separate from public ad constants                          | Admin changes must control public behavior                                    | Replace both sources with one operational configuration in P13                                                           |
| Database tests assert that only two application models exist                                                | MVP needs domain records                                                      | Update the authentication-only schema inventory tests as each approved migration is added                                |
| `README.md` and `PROJECT_REFERENCE.md` describe a generic auth-only foundation                              | Repository will become the Fury product                                       | Update documentation alongside each implemented slice; perform final integrated rewrite in P14                           |
| Root `AGENTS.md` links to missing engineering index/testing/security/workflow files                         | Repository instructions contain broken references                             | Repair references or restore the intended files in P00                                                                   |
| `.specify/memory/constitution.md` is an untouched placeholder and no `specs/` directory exists              | The team intends to use Spec Kit for these phases                             | Ratify project rules and initialize the first feature in P00                                                             |

### 3.5 What should be preserved

The following existing foundations should be extended rather than replaced:

- Authentication/session/CSRF architecture and account lifecycle.
- `@fury/contracts` as the web/API contract owner.
- Express module/controller/service/DTO structure.
- Prisma forward migrations and database integration-test pattern.
- API response envelopes, request validation, request IDs, error handling, logging redaction, rate limiting, and OpenAPI generation.
- React Query for server state and the existing authenticated session query.
- Safe return-path handling and route-state tests.
- Current Arabic RTL visual design, route map, feature folder organization, error/empty state primitives, and tested interaction patterns.
- Existing admin confirmation, pagination, dialog-focus, and visual workflow components where their product behavior remains valid.

## 4. Spec Kit operating contract

Each delivery phase below becomes one Spec Kit feature. Let Spec Kit assign the actual sequential feature number; use the suggested slug for the feature name.

Before implementation, every feature must contain:

- `spec.md` with prioritized, independently testable user stories and explicit exclusions.
- `plan.md` with exact repository paths, data flow, authorization, migration, rollout, and rollback decisions.
- `research.md` only for unresolved technical choices that require evidence.
- `data-model.md` when the phase adds or changes persistence.
- `contracts/` describing request, response, error, state-transition, pagination, and authorization behavior.
- `quickstart.md` with the smallest real end-to-end verification journey.
- `tasks.md` grouped by user story and ordered contracts → migration → service → route → frontend → tests → documentation.

The repository constitution must not retain placeholders. P00 owns ratification before dependent feature planning.

## 5. Phase map

| Phase | Suggested feature slug         | Primary deliverable                                                           | Depends on       |
| ----- | ------------------------------ | ----------------------------------------------------------------------------- | ---------------- |
| P00   | `repository-product-alignment` | Trustworthy Spec Kit/repository baseline and removal of active contradictions | Current checkout |
| P01   | `content-domain-foundation`    | Canonical content schema, contracts, authorization, and state rules           | P00              |
| P02   | `persistent-vps-media`         | Secure persistent media storage and delivery                                  | P01              |
| P03   | `admin-categories-works`       | Persistent category and work administration                                   | P01, P02         |
| P04   | `admin-chapter-publishing`     | Persistent illustrated/text chapter authoring and publication                 | P02, P03         |
| P05   | `public-catalog-discovery-seo` | Live home, catalogs, categories, work details, and SEO                        | P03, P04         |
| P06   | `bookmarks-ratings-library`    | Persistent bookmarks, ratings, library, and dashboard basics                  | P05              |
| P07   | `protected-readers-progress`   | Secure readers, progress, completion, resume, and opens                       | P04, P06         |
| P08   | `community-moderation`         | Persistent comments, likes, reports, and moderation                           | P05, P07         |
| P09   | `in-site-notifications`        | One persistent notification system for new chapters and gifts                 | P04, P06         |
| P10   | `gifts-appearance-avatar`      | Media-backed gifts, grants, appearance selection, and avatar upload           | P02, P06, P09    |
| P11   | `support-inbox-legal`          | Persistent contact/issue flows, admin inbox, and final legal surfaces         | P01              |
| P12   | `admin-users-dashboard`        | User operations, suspension, notes, metrics, and activity                     | P06–P11          |
| P13   | `display-advertising`          | Safe operational advertising for only two approved placements                 | P05, P12         |
| P14   | `launch-readiness`             | Integrated release evidence, accessibility/security/operations hardening      | P00–P13          |

P11 may be developed in parallel with P03–P10 after its P01 prerequisites exist. P08 and P09 may run in parallel. All other dependencies are sequential gates, not suggestions.

## 6. Detailed phase definitions

## P00 — Repository and Product Alignment

**Suggested feature slug:** `repository-product-alignment`

**Objective:** Remove contradictions that would pollute later specs and establish an honest, testable baseline.

**Preserve:** Existing auth behavior, transport security, account screens, route designs, client admin/workspace guards, approved ad UI design, and existing tests that still describe approved behavior.

**Implement or correct:**

- Ratify `.specify/memory/constitution.md` for this monorepo. Include product-source precedence, Arabic/RTL rules, API authorization, forward-only migrations, contract ownership, testing expectations, fixture replacement, and phase stop gates.
- Create the first Spec Kit feature using the repository's sequential numbering; do not hand-create conflicting numbers.
- Repair the broken references in root `AGENTS.md` or restore the intended referenced documents. Do not leave nonexistent guidance as mandatory instructions.
- Add a checked-in implementation-status inventory that maps each fixture/local-state source to its owning roadmap phase.
- Remove `phone` from `User`, the safe-user schema, registration/update schemas, API DTO/service/mapper code, seed/test fixtures, and documentation through a new forward Prisma migration. Do not edit the applied initial migration.
- Keep registration UI phone-free and update contract tests that currently require optional phone normalization.
- Change chapter-number UI to positive integers only; remove the `44.5` example and fractional input step.
- Prevent anonymous access to the existing fixture reader immediately by applying the current protected-route behavior to the chapter route. P07 will replace this with real API content authorization.
- Ensure no fixture reader claims that completion was persisted when it was only calculated locally.
- Keep the admin layout's `ADMIN` client guard and document the API as the ultimate boundary for future admin mutations.
- Make current advertisement placeholders/detection explicitly non-production or disabled until P13 connects deployment configuration. Do not advertise fake provider delivery.
- Confirm obsolete product concepts remain absent: points, reward thresholds, intrusive ad types, Google sign-in, comment replies, role editing, and hard-delete content actions.
- Re-run the design inconsistency audit against current code and classify each historical item as fixed, still open, or superseded. Do not apply the September 11 report blindly because later commits already changed parts of the frontend.

**Out of scope:** New domain entities other than the phone-removal migration; real content APIs; visual redesign.

**Exit gate:**

- Spec Kit constitution contains no placeholders and its gates match the repository.
- Root instructions contain no broken mandatory documentation links.
- `phone` is absent from schema, contracts, API responses, UI form values, OpenAPI, tests, seed logic where applicable, and product documentation.
- Chapter fixture content is not available to an anonymous visitor.
- Chapter number controls accept only positive integers.
- No UI claims a local-only completion/submission/action was persisted.
- Current auth integration tests, contract tests, database tests, web tests, type checks, lint, and build pass after the cleanup.

## P01 — Content Domain and Contract Foundation

**Suggested feature slug:** `content-domain-foundation`

**Objective:** Add only the shared content foundation needed by the first real vertical slices, without creating empty speculative models for later features.

**Data ownership:**

- Add Work, Category, WorkCategory, Chapter, and ordered ChapterPage records.
- Define enums for work type, story status, publication status, and chapter content type.
- Store structured text chapter content in a validated representation chosen in the phase design.
- Enforce unique work slug, unique chapter number per work, unique work/category relation, and unique page position per illustrated chapter.
- Enforce positive integer chapter numbers and consistent publication timestamps/state.
- Define archive/unpublish/restore semantics without hard delete.

**API/contracts:**

- Extend `@fury/contracts` with bounded content schemas and shared query primitives.
- Add content modules following the existing controller/service/DTO pattern.
- Reuse existing pagination, response, validation, error, logging, and OpenAPI infrastructure.
- Define reusable query policies so public reads cannot return draft/archived content.
- Require authenticated `ADMIN` authorization for management operations.
- Define idempotent publication transitions and a durable publication-event identity that P09 can consume.

**Frontend preparation:**

- Replace duplicated frontend-only domain type names with contract-derived types at integration boundaries.
- Resolve current naming drift such as `short-story` versus approved `text-story`, lowercase fixture roles versus contract roles, and URL-derived slugs versus persistent slugs.
- Do not connect full screens yet; provide contract fixtures/test builders only where tests require them.

**Out of scope:** Media upload, bookmarks, ratings, progress, comments, notifications, gifts, support, ads, and full admin/public screen integration.

**Exit gate:**

- Fresh migration and upgrade migration tests pass without rewriting authentication history.
- Constraints reject duplicate slugs, duplicate chapter numbers, duplicate page positions, fractional/non-positive chapter numbers, and invalid publication state.
- Public query services never expose draft or archived content.
- Admin management service tests reject non-admin and suspended users.
- OpenAPI and shared schemas match implemented endpoints.
- Database inventory tests are updated from “auth only” to the exact approved P01 model inventory.

## P02 — Persistent VPS Media Platform

**Suggested feature slug:** `persistent-vps-media`

**Objective:** Replace URL/sample-image assumptions with one secure, persistent media pipeline.

**Media classes:** Work cover, work background, illustrated chapter page, user avatar, avatar frame, and comment decoration.

**Implementation scope:**

- Store files outside replaceable release directories on a configured persistent VPS path.
- Validate declared MIME type and decoded content, formats, dimensions, size limits, and transparency where required.
- Generate server-owned file names and stable relative identifiers; never trust original paths or names.
- Block path traversal and executable/malformed content.
- Serve correct content type, caching, content-disposition where applicable, and safe headers.
- Add optimized variants/thumbnails for catalog assets when the phase plan proves they are needed.
- Track media references before replacement or physical removal.
- Add upload authorization by media class and intended owner/admin workflow.
- Add media directory configuration to `.env.example` without exposing local or production secrets.
- Add database/media backup and restore steps that keep identifiers and files consistent.

**Frontend reuse:** Preserve current cover/banner preview, chapter page order, avatar preview, and gift preview interactions. Replace random sample selection and object-URL-only success with real upload state, progress, validation errors, retry, and persisted identifiers.

**Out of scope:** ZIP imports, scraping, external media libraries, GIF gifts, and text-chapter embedded images.

**Exit gate:**

- Positive and negative upload tests cover every media class.
- MIME/extension mismatch, invalid decoded content, oversize/dimension violations, executable content, and path manipulation are rejected.
- Authorized files survive application restart and simulated release replacement.
- Unauthorized upload/replacement/removal fails.
- Reference-aware replacement/removal cannot break an active record.
- A documented restore test recovers database references and physical media together.

## P03 — Persistent Admin Categories and Works

**Suggested feature slug:** `admin-categories-works`

**Routes:** `/admin/categories`, `/admin/works`, `/admin/works/new`, `/admin/works/[workId]/edit`.

**Objective:** Connect the existing admin visual workflows to real category/work APIs and remove their local sources of truth.

**Reuse:** Admin layout, headers, tables, filters, pagination, status badges, confirmation dialogs, form layout, media previews, and work/category tests where product behavior remains valid.

**Replace/build:**

- Replace `ADMIN_CATEGORY_FIXTURES` and relevant `AdminDataProvider` work state with React Query reads/mutations.
- Category create/edit/search/order/enable/disable and real usage counts.
- Prevent destructive deletion of an in-use category; support disable and an explicitly designed merge path only if included in the phase spec.
- Work list/search/filter/pagination and create/edit/preview/publish/unpublish/archive/restore.
- Persist title, optional alternative title, unique slug, work type, story status, publication state, synopsis, author, optional artist, categories, tags, cover, optional background, featured-home flag/order, and timestamps.
- Replace the current derived SEO-preview slug with the persisted slug.
- Replace fixed genre constants as the work-category source with real enabled categories.
- Validate required metadata and display media before publication.
- Remove replaced work/category fixture mutation paths and reset-to-fixtures behavior.

**Out of scope:** Chapter authoring, public catalog reads, personalized recommendations, and advanced SEO editing.

**Exit gate:**

- Admin creates, reloads, edits, publishes, unpublishes, archives, and restores illustrated and text works using persisted data.
- Category order/enablement persists and in-use protection is enforced server-side.
- Duplicate slugs and invalid transitions fail consistently in contract, service, and HTTP integration tests.
- Non-admin/suspended callers cannot use management APIs.
- No hard-delete control or sample-image cycling remains in the connected workflow.

## P04 — Persistent Chapter Authoring and Publishing

**Suggested feature slug:** `admin-chapter-publishing`

**Routes:** `/admin/works/[workId]/chapters`, `/admin/works/[workId]/chapters/new`, `/admin/works/[workId]/chapters/[chapterId]/edit`.

**Objective:** Connect existing chapter-management designs to persistent, validated illustrated/text content.

**Reuse:** Chapter list/form layout, order controls, preview modal shell, state actions, and confirmation patterns.

**Replace/build:**

- Replace chapter fixtures and `useAdminWorkActions` chapter state with API queries/mutations.
- Derive content type from the parent work; do not allow incompatible manual switching.
- Illustrated multi-file upload through P02, stable ordering, reorder, replacement, removal, retry, and full preview.
- Replace “add random sample page” with actual upload.
- Define one structured text format for paragraphs, H2/H3 headings, bold, italic, lists, and sanitized links.
- Remove quote/image formats that are outside MVP scope.
- Replace the Markdown-like editor/preview split with an editor that writes the canonical structured format.
- Use the same core illustrated/text renderer for admin preview and P07 public reading.
- Save draft, preview, publish, unpublish, archive, and restore.
- Produce an idempotent durable publication event/identity for P09 without sending notifications yet.

**Exit gate:**

- An admin creates and publishes one illustrated and one text chapter, reloads both, and previews exactly what the reader renderer will show.
- Page ordering is stable and duplicate positions cannot commit.
- Text links/content are sanitized and unsupported blocks are rejected.
- Repeating publication does not create duplicate publication events.
- Public query services expose only published chapters under a published work.
- No fractional number, ZIP import, scraping, schedule, volume/season, or hard-delete path exists.

## P05 — Public Catalog, Discovery, Work Details, and SEO

**Suggested feature slug:** `public-catalog-discovery-seo`

**Routes:** `/`, `/discover`, `/stories`, `/categories`, `/story/[id]`, public not-found/unavailable states.

**Objective:** Replace all public content fixtures with one published catalog and preserve the approved visual experience.

**Reuse:** Home sections, catalog filters/grids, category directory, work-detail layouts, cards, URL parsers where compatible, navbar search, public loading/error primitives, and current Arabic RTL design.

**Replace/build:**

- Remove `heroData`, `trendingData`, `latestData`, `suggestionsData`, `discoverData`, `categories`, `storyData`, and `textStories` as production data sources when their route is connected.
- One catalog query model for all work types; `/stories` applies only the text-work restriction.
- URL-backed query, category, work type, story status, sort, and stable pagination.
- Safe fallback for invalid query values, retry, empty, unavailable, and not-found states.
- Admin-featured home ordering, enabled-category shortcuts, latest published chapters, category-based suggestions, and seven-day trending based on real chapter opens when available.
- Work detail metadata, published chapters, first/latest actions, similar works, aggregate rating display, and deliberate unavailable behavior.
- Hide or clearly defer interactive bookmark/rating/comment controls until their owning phases; never leave a fake active action.
- Unique metadata, canonical work URL, Open Graph cover data, sitemap, robots exclusions, and controlled catalog query indexing.
- Community link comes from maintained configuration, not placeholder copy.
- Keep only structural reserved locations for P13 ads; no provider claim is made here.

**Exit gate:**

- All owned routes read the API and no connected route imports its former product fixture data.
- The same URL reproduces catalog query state after refresh.
- `/discover` searches all supported work types and `/stories` is only a restricted view.
- Draft/archived data and unpublished chapters do not leak through metadata, responses, sitemap, or similar results.
- Empty home sections are hidden or intentional.
- Public SEO outputs match the approved route inclusion/exclusion policy.

## P06 — Bookmarks, Ratings, Library, and Dashboard Basics

**Suggested feature slug:** `bookmarks-ratings-library`

**Routes/surfaces:** `/library`, personal sections on `/dashboard`, and bookmark/rating controls on `/story/[id]`.

**Objective:** Deliver the first persistent personal content slice.

**Data/contracts:** Add Bookmark and WorkRating through a forward migration. Enforce one bookmark and one rating per user/work. Ratings are integer 1–5. Bookmark removal must not remove ratings or later progress.

**Replace/build:**

- Replace `LIBRARY_WORKS` and local removal/undo behavior with server state and real confirmation/recovery behavior.
- Idempotent bookmark creation and removal.
- One editable five-star rating and transactionally correct aggregate/count reads.
- Library search/filter/sort, saved date, latest published chapter, and unavailable saved-work state.
- Preserve bookmarks for works later unpublished/archived without exposing their content.
- Replace dashboard bookmark/rating summary fixtures with real values; progress, gifts, and notifications remain honest empty states until their phases.
- Keep visitor/pending/suspended restrictions consistent in UI and API.

**Exit gate:**

- Bookmark create/remove survives a new session and repeated creation is idempotent.
- Rating create/update leaves one row and recalculates aggregate/count correctly under concurrency tests.
- An unavailable saved work remains listed but cannot leak protected content.
- Visitors and ineligible accounts cannot mutate bookmarks/ratings.
- Connected library/dashboard sections no longer import their old fixture records.

## P07 — Protected Readers, Progress, Completion, and Resume

**Suggested feature slug:** `protected-readers-progress`

**Route/surfaces:** `/story/[id]/chapter/[chapterId]`, resume links on work details, library, and dashboard.

**Objective:** Replace both fixture readers with authenticated chapter-content delivery and one canonical resume model.

**Data/contracts:** Add ReadingProgress and the minimal chapter-open/activity record needed for seven-day trending. Decide and document whether progress is canonical per user/chapter with derived work resume; do not store pixel-level session history.

**Replace/build:**

- API returns chapter content/page identifiers only to active verified users.
- Safe login return to the requested chapter.
- Split the current combined route implementation into a thin route and reusable illustrated/text reader feature components while preserving approved visuals.
- Replace `MOCK_PAGES` and text fixtures with protected API data.
- Illustrated continuous-scroll and single-page modes, stable page index, approximate percentage, debounced updates, and image retry.
- Text block/paragraph position, approximate percentage, and existing font-size/line-spacing preferences.
- Completion at 75% for progress only.
- Same canonical resume destination from work details, dashboard, and library.
- Chapter selection, previous/next navigation, and deliberate unavailable state after publication changes.
- Record real opens for trending without creating one event per scroll update.
- Guarantee no ad provider or ad-block code is imported/executed in reader bundles.

**Exit gate:**

- Anonymous callers cannot retrieve chapter text or page URLs through UI or API.
- A verified user leaves and resumes illustrated and text chapters near the saved useful position.
- Debouncing/idempotency prevents scroll-event write floods.
- 75% changes only completion state.
- Unpublished/archived transitions stop content access without leaking it from cached public responses.
- Network/bundle verification proves zero advertising/detection behavior on the reader.

## P08 — Community and Moderation

**Suggested feature slug:** `community-moderation`

**Routes/surfaces:** Work and chapter comment sections, `/admin/comments`, `/admin/reports`.

**Objective:** Replace duplicated local discussion behavior with one flat persistent community model and its moderation workflow.

**Data/contracts:** Add Comment, CommentLike, CommentReport, and moderation-history data needed for hide/restore/resolution audit. Enforce one like per user/comment and one open report per user/comment.

**Replace/build:**

- One comment component/query model for work and chapter targets.
- Visible public comment reads; active verified users create up to 1,000 characters.
- Owner edit and soft delete; like/unlike; bounded sanitized reports.
- Report reasons and statuses/outcomes exactly match `PLAN.md`.
- Replace `STORY_COMMENTS`, text fixture comments, local `Date.now()` IDs, local likes, and local report flags.
- Connect existing admin comment/report tables, filters, dialogs, hide/restore, status, and resolution UI to authorized APIs.
- Preserve hidden/deleted records for moderation and history.
- Leave decoration rendering contract ready for P10, with default appearance until then.

**Exit gate:**

- Ownership and admin authorization tests cover every mutation.
- Work comments and chapter comments remain distinct targets using one model.
- Duplicate likes/open reports fail safely under concurrency.
- Hidden/soft-deleted content is absent from normal reads and available to authorized moderation.
- No reply/thread/image/spoiler-mask path or dormant production fixture remains.
- Rendered content is sanitized against script injection.

## P09 — In-Site Notifications

**Suggested feature slug:** `in-site-notifications`

**Surfaces:** Navbar bell, workspace bell, chapter destinations, and settings appearance destinations.

**Objective:** Replace two independent fixture notification stores with one persistent service and one shared UI state owner.

**Data/contracts:** Add Notification with type, title, concise message, safe destination, creation time, and optional read time. Add idempotency identity for chapter publication and gift grant notifications.

**Replace/build:**

- Consolidate navbar and workspace notification implementations around shared queries/components without forcing identical layout.
- New-chapter notifications for users with a bookmark at eligible publication time.
- Consume P04 publication identity so repeated publish actions do not duplicate notifications.
- Gift-notification creation service for P10, including gift name/image and the relevant settings section.
- Mark one/read all, persistent unread count, refresh/navigation/menu-open loading.
- Preserve historical notification when a gift is revoked/disabled and show current unavailability at destination.
- No WebSocket, push, or background-polling architecture.

**Exit gate:**

- One eligible publication creates exactly one notification per eligible bookmark.
- Mark-one/mark-all persists across sessions and both navigation surfaces agree.
- Destinations are safe and resolve to the current chapter or settings state.
- Anonymous users show no fixture count.
- Old fixture notification files are removed from production imports.

## P10 — Gifts, Appearance, and Avatar Completion

**Suggested feature slug:** `gifts-appearance-avatar`

**Routes/surfaces:** `/admin/gifts`, `/admin/gifts/grants`, user-detail gift actions, avatar/appearance sections of `/settings`, avatar/comment presentation.

**Objective:** Replace color/tone demo gifts and local selection with media-backed, admin-granted, persistent appearance.

**Data/contracts:** Add GiftDesign, GiftGrant, and UserAppearanceSelection. Preserve grant/revocation history and enforce one active grant per user/gift and one selection per gift type.

**Replace/build:**

- Transparent PNG/WebP gift asset upload through P02.
- Gift create/edit/preview/enable/disable/reactivate/archive and recipient count.
- Individual grant with optional reason.
- Bulk eligibility snapshot/preview/confirmation for active non-admin accounts existing at confirmation.
- Exclude suspended users/admins; future registrations do not inherit prior bulk grants.
- Idempotent duplicate prevention and one P09 notification per new grant.
- Revoke a grant without deleting history.
- Select default or one owned active frame/decoration; disabled/revoked items cannot remain effective.
- Persist avatar upload through P02; decoded-content validation remains server-side even though current UI validates file type/size.
- Apply selected frame/decoration to approved avatar and comment surfaces.
- Remove fixture gift data and local-only selection once connected.

**Exit gate:**

- Individual/bulk grants are idempotent and auditable.
- Bulk execution affects the confirmed eligible snapshot only.
- Selection rejects unowned, disabled, revoked, and wrong-type gifts.
- Disable/revoke invalidates effective selection without erasing history/notification.
- Avatar/gift uploads pass P02 validation and persist across sessions/deployments.

## P11 — Support Inbox and Legal Pages

**Suggested feature slug:** `support-inbox-legal`

**Routes:** `/contact`, `/report-issue`, `/admin/contact`, `/admin/contact/[messageId]`, `/privacy`, `/terms`, `/copyright`.

**Objective:** Connect public forms to one persistent inbox and replace draft legal content before launch.

**Data/contracts:** Add SupportSubmission with contact/issue type, sender facts, optional user relation, issue type, affected URL, message fields, status, one internal note, and timestamps.

**Replace/build:**

- Replace 250 ms simulated form success with real submission mutations.
- Reuse current client validation ergonomics while moving authoritative limits/schemas into `@fury/contracts` and the API.
- Apply public-form rate limiting and safe non-enumerating responses.
- Combine contact and issue reports in the admin inbox with real search/filter/date/status behavior.
- Include issue affected URL and type in detail view; current generic `AdminContactMessage` does not represent them fully.
- Persist unread/open, resolved, archived, internal note, archive/restore, and safe `mailto:` behavior.
- Remove support fixtures and local admin mutations after connection.
- Replace legal drafts with owner-approved text; do not invent legal advice.

**Exit gate:**

- Visitor and signed-in submissions appear exactly once in the admin inbox.
- Signed-in association is private and public responses reveal no account data.
- Invalid/unsafe input and rate limits produce clear recoverable behavior.
- Admin status/note/archive changes persist and require `ADMIN`.
- Final legal text is owner-approved before P14 release approval.

## P12 — Admin Users, Suspension, Dashboard, and Activity

**Suggested feature slug:** `admin-users-dashboard`

**Routes:** `/admin`, `/admin/dashboard`, `/admin/users`, `/admin/users/[userId]`.

**Objective:** Replace cross-domain admin fixtures and synthetic metrics after their authoritative domains exist.

**Data/contracts:** Add AdminModerationNote and only the lightweight activity records that cannot be derived reliably. Do not build an analytics warehouse.

**Replace/build:**

- User search/filter by status and gift ownership; real registration/last-activity/gift counts.
- User detail with bookmarks, progress, gifts, notes, and appropriate moderation history.
- Suspend/reactivate with confirmation and immediate protected-API rejection. Preserve the existing middleware behavior that looks up current user state on every protected request.
- Reuse P10 gift services rather than duplicating grant/revoke logic.
- Dashboard authoritative counts for published/draft works, published chapters, active users, open reports, and unread support.
- Recent content changes, registrations, unresolved moderation items, and the same seven-day trending definition as public home.
- Remove `deriveAdminMetrics` hard-coded baseline deltas and relevant admin fixtures.
- Never expose password hashes, tokens, provider secrets, admin creation, role changes, impersonation, revenue forecasts, or point metrics.

**Exit gate:**

- Dashboard values reconcile with authoritative database queries.
- Suspension blocks login, refresh, and protected API use without deleting user content.
- Reactivation restores eligible access without rebuilding records.
- User/admin lists have real filtering, pagination, empty, and retry behavior.
- Consequential actions are confirmed and auditable.
- No synthetic metric baseline or secret/role-management UI remains.

## P13 — Approved Display Advertising

**Suggested feature slug:** `display-advertising`

**Routes/placements:** `home-banner` on `/`; `catalog-banner` on `/discover` and `/stories`; `/admin/ads`.

**Objective:** Convert the existing placeholder slot/detector design into safe operational configuration for exactly the approved placements.

**Reuse:** `AdvertisementSlot`, `AdBlockNotice`, approved placement positions, admin preview UI, session dismissal, retry, and non-modal behavior where tests confirm them.

**Replace/build:**

- One source of truth for global and per-placement enablement; eliminate the split between admin context state and public hard-coded constants.
- Deployment-configured Adsterra display-banner script/zone identifiers only; no stored arbitrary JavaScript.
- `home-banner` remains beside/near Latest Releases on desktop and inline between sections on smaller screens.
- `catalog-banner` remains after filters and before results on `/discover` and `/stories`.
- Read-only provider name, zone configuration health, dimensions, last configuration update, safe preview, and support-message preview.
- Load provider/detection only when global and current placement enablement both permit it.
- Keep detection failure/false positive non-blocking and browsing available.
- Do not claim impression/revenue events unless provider-reported.

**Exit gate:**

- Eligible pages render zero or one Fury placement.
- Global disable removes slots, provider loading, and detection.
- Per-placement disable affects only its approved routes.
- Network/bundle tests prove zero provider/detection code on work details, categories, readers, auth, workspace, support, legal, admin, error, and not-found routes.
- Admin cannot store/execute arbitrary scripts or view secrets.
- No points, thresholds, refresh, popup, popunder, interstitial, rewarded, reader, or forced-ad path exists.

## P14 — Launch Readiness and Release Approval

**Suggested feature slug:** `launch-readiness`

**Objective:** Prove all completed slices operate together on production-like infrastructure and remove development-only residue.

**Implementation scope:**

- Remove remaining production fixture imports, sample media, dead assets, zero-byte assets, fake counts, placeholder links, stale types, and superseded local mutation paths.
- Re-run `DESIGN-SYSTEM-INCONSISTENCIES.md` against current code and close verified blocking/material issues relevant to shipped flows.
- Verify Arabic/RTL copy, keyboard use, focus, touch targets, contrast, reduced motion, responsive boundaries, reader landmarks, error shells, and no ordinary horizontal overflow.
- Replace Google CSS font imports and unmanaged raw images where the current Next.js pipeline/design decision requires it.
- Validate current Next.js 16 behavior against installed framework documentation before framework-sensitive changes, as required by `apps/web/AGENTS.md`.
- Supply owner-approved legal text, community links, production domain/email configuration, ad zones, initial content, gift assets, VPS storage, database, backup destination, and restore access.
- Verify health, request IDs, actionable logs, rate limits, email provider, HTTPS/same-origin routing, media persistence, and no secret leakage.
- Demonstrate database and media backup/restore.
- Update `README.md` and `PROJECT_REFERENCE.md` from generic auth-template documentation to the implemented Fury product architecture and operations.
- Run repository formatting, Prisma format/validate/generate, lint, type check, unit tests, disposable-database integration tests, build, build-output verification, route smoke, browser journeys, security checks, and `git diff --check`.
- Document deployment, forward migration, rollback, backup, restore, and operational provisioning.

**Exit gate:**

- All cross-product journeys in Section 9 pass on production-like infrastructure.
- No fixture/local-only behavior can masquerade as persisted production behavior.
- Restore is demonstrated for database and media.
- No public response, rendered page, build output, or log leaks protected data or secrets.
- Release evidence records tested revision, environment, migration version, owner inputs, rollback point, and known non-blocking limitations.

## 7. Route ownership matrix

| Route/surface                                                    | Phase ownership                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| `/`                                                              | P05 live content; P13 approved banner                             |
| `/discover`                                                      | P05 canonical catalog; P13 approved banner                        |
| `/stories`                                                       | P05 text-only catalog view; P13 approved banner                   |
| `/categories`                                                    | P05 public enabled-category directory                             |
| `/story/[id]`                                                    | P05 data/details; P06 bookmarks/ratings; P08 comments             |
| `/story/[id]/chapter/[chapterId]`                                | P00 temporary protection; P07 real readers/progress; P08 comments |
| `/contact`, `/report-issue`                                      | P11                                                               |
| `/privacy`, `/terms`, `/copyright`                               | P11 content; P14 final owner approval                             |
| `/auth/*`                                                        | Preserve existing behavior; P00 phone cleanup/regression          |
| `/dashboard`                                                     | P06 base; enriched P07/P09/P10                                    |
| `/library`                                                       | P06; resume enrichment P07                                        |
| `/settings`                                                      | Existing security/profile preserved; P10 avatar/appearance        |
| `/admin`                                                         | Existing guard preserved; P12 redirect/operational completion     |
| `/admin/dashboard`                                               | P12                                                               |
| `/admin/categories`                                              | Existing local UI connected in P03                                |
| `/admin/works`, `/admin/works/new`, `/admin/works/[workId]/edit` | P03                                                               |
| `/admin/works/[workId]/chapters*`                                | P04                                                               |
| `/admin/comments`, `/admin/reports`                              | P08                                                               |
| `/admin/gifts`, `/admin/gifts/grants`                            | P10                                                               |
| `/admin/contact`, `/admin/contact/[messageId]`                   | P11                                                               |
| `/admin/users`, `/admin/users/[userId]`                          | P12; gift actions reuse P10                                       |
| `/admin/ads`                                                     | P13                                                               |
| Root loading/not-found/global-error                              | Maintained by each owner; integrated audit P14                    |

## 8. Cross-phase implementation rules

- Every schema change uses a new forward migration. Never rewrite `20260818000000_init_authentication`.
- A phase owns the database models it first needs; do not create the full future schema in P01 and leave unused tables.
- Every endpoint ships with shared schemas, OpenAPI documentation, service/controller tests, and HTTP integration coverage proportional to risk.
- Every admin mutation uses API `ADMIN` authorization. The existing client guard remains a user-experience layer only.
- Public APIs never return drafts/archives; reader APIs additionally require an active verified user.
- React Query replaces server-backed local state. Remove the old fixture path when the real query is connected.
- Do not keep `AdminDataProvider` as a second database. Shrink it phase by phase, then remove it when no connected admin feature depends on it.
- Preserve the existing API envelope, CSRF, cookie, access-token, refresh, logging, and error architecture unless a phase proves a required change.
- Keep route files thin and place query/mutation/mapping logic in feature modules.
- Public filter state remains in the URL. Personal transient UI preferences may remain local when the product plan does not require cross-device persistence.
- Use the approved Arabic UI and RTL design. Technical source identifiers remain English.
- Accessibility, responsive behavior, security, and operational needs are part of each phase, not deferred wholesale to P14.
- Update `README.md`, `PROJECT_REFERENCE.md`, OpenAPI, and applicable design/operation docs when their claims change.
- Stop after each phase acceptance gate unless the user explicitly authorizes batch continuation, matching root repository instructions.

## 9. Cross-product acceptance journeys

P14 executes these end to end; each owner phase adds its portion earlier.

1. A visitor browses home, searches all work types, filters, refreshes the URL, and opens the intended published work.
2. A visitor opening a chapter is sent to login and returns to it after a valid verified login; the visitor never receives chapter content beforehand.
3. Registration, verification/resend, login, password recovery/change, logout, and logout-all work without phone or Google sign-in.
4. A user bookmarks a work, sees it in a new session, removes it independently of rating/progress, and receives new-chapter notifications only while eligible.
5. A user leaves and resumes illustrated and text chapters near the saved position.
6. A user creates, edits, soft-deletes, likes, and reports permitted comments; no reply feature exists.
7. A user creates and updates one integer five-star rating and aggregates remain correct.
8. An admin creates/publishes illustrated and text works/chapters; public visibility follows state.
9. An admin unpublishes, archives, and restores content without hard deletion or public leakage.
10. An admin suspends a user and login, refresh, and protected API actions stop while user records remain.
11. An admin creates both gift types, grants individually/in bulk, prevents duplicates, revokes a grant, and disables a design.
12. A user receives a gift notification and can select only owned active appearance assets.
13. Visitor and signed-in contact/issue submissions reach the inbox and can be resolved/archived.
14. An eligible page shows at most one configured banner; every excluded route loads none.
15. Ad blocking shows a non-modal request while browsing, login, and reading remain available.
16. No admin can edit arbitrary provider scripts or configure points, intrusive ads, or reader ads.
17. Draft, archived, protected, private, token, hash, and secret data is absent from public responses and logs.
18. Loading, empty, recoverable error, unavailable, forbidden, and not-found states work in Arabic RTL on keyboard and mobile.

## 10. Definition of ready for each Spec Kit phase

- All dependency phases passed their exit gates.
- The feature spec lists current components to preserve and fixture/local paths to remove.
- Product choices affecting behavior are decided or marked as explicit clarifications.
- The implementation plan names exact existing repository paths after re-inspection at phase start.
- Migration, compatibility, rollback, authorization, and caching effects are understood.
- User stories are prioritized and independently demonstrable.
- Required owner inputs are available or safely represented by non-production configuration.
- No story depends on pretending that a later phase already exists.

## 11. Definition of done for each phase

- Approved behavior uses persistent real data where persistence is required.
- Browser behavior and API authorization agree.
- Contracts, OpenAPI, migrations, services, UI, and tests describe the same behavior.
- Relevant loading, empty, success, retry, forbidden, unavailable, and not-found states exist.
- Arabic, RTL, responsive, keyboard, focus, target-size, contrast, and reduced-motion behavior is verified for owned surfaces.
- Replaced fixtures/local mutation paths are no longer imported by production code.
- Security, logging, media, backup, or operational obligations introduced by the phase are verified.
- Relevant repository checks pass without weakening existing checks.
- Documentation claims are updated against implemented code.
- Acceptance evidence is saved in the feature record before the phase is declared complete.

## 12. Owner-provided launch inputs

These are not reasons to keep production placeholders. They must exist before P14 approval:

- Final privacy, terms, and copyright/takedown text.
- Production domain and email-provider credentials.
- Adsterra approval and zone identifiers for `home-banner` and `catalog-banner`.
- Final Discord/community links.
- Initial real categories, works, chapters, covers, and backgrounds.
- Transparent PNG/WebP avatar-frame and comment-decoration assets.
- VPS persistent media storage, PostgreSQL, backup destination, and restore access.

## 13. Recommended immediate next action

Start only P00 as the first Spec Kit feature. Its specification should be narrow: repository governance repair, phone removal, reader truth/protection, integer chapter alignment, fixture-status inventory, and current-check preservation. Do not begin the content schema or media implementation in the same feature. After P00 is accepted, create P01 from the verified clean baseline.

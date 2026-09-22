# Fury MVP — Product and Implementation Plan

- **Status:** Approved planning baseline for the MVP
- **Last updated:** 2026-09-22
- **Product language:** Arabic
- **Layout direction:** Right-to-left (RTL)
- **Primary visual references:** `DESIGN-SYSTEM.md`, `DESIGN-SYSTEM-INCONSISTENCIES.md`, and the implemented frontend screens

## 1. Purpose and decision authority

This file defines what Fury must deliver as a coherent MVP and how the current frontend designs map to production behavior. It is the working source of truth for product scope, implementation order, acceptance criteria, and the removal of superseded concepts.

When sources disagree, use this order:

1. The latest explicit product decisions recorded in this plan.
2. This plan's final requirements and acceptance criteria.
3. The current frontend design and interaction patterns.
4. Older plans, fixture data, placeholder copy, and unfinished controls.

An existing screen proves that a visual direction exists; it does not prove that its fixture data, actions, permissions, or old product rules are still valid.

## 2. Product summary

Fury is an Arabic platform for discovering and reading illustrated and text-based works. Supported work types are manga, manhwa, manhua, comics, novels, and text stories.

Visitors can browse the public catalog, categories, work details, ratings, and visible comments. A verified user account is required to read chapter content and use personal or interactive features. Administrators publish content, moderate the community, manage users, grant visual gifts, review support messages, and control the limited advertising placements.

The MVP favors direct, maintainable workflows over complex automation. There are no payments, subscriptions, point balances, paid chapters, social profiles, or advanced recommendation systems.

## 3. Final product decisions

### 3.1 Included

- Email/password registration, email verification, login, logout, password recovery, and password change.
- Public discovery, categories, filtering, search, work details, ratings, and visible comments.
- Protected illustrated and text chapter readers.
- A single personal library based on bookmarks.
- Simple reading progress and resume-reading behavior.
- Work-level and chapter-level comments, comment likes, editing, soft deletion, and reporting.
- Five-star work ratings, one editable rating per user per work.
- In-site notifications for gifts and new chapters of bookmarked works.
- Email only for required account workflows such as verification and password recovery.
- Permanent avatar frames and comment decorations granted by administrators.
- Public contact and issue-report forms with an admin inbox.
- Simple admin metrics and management screens.
- Basic SEO for public pages.
- A small number of non-intrusive display-banner advertisements.
- Ad-block detection on ad-supported pages with a clear request to disable the blocker.
- Media stored on the project's own VPS.

### 3.2 Explicitly removed or deferred

- The points system in all forms.
- Points earned from chapter completion.
- Advertising thresholds, point deduction, or point balances.
- Popunder, popup, interstitial, forced, rewarded, or reader advertisements.
- Advertising before a chapter, between chapter pages, or while reading.
- Google sign-in for the MVP.
- Phone number collection in registration or profile data.
- Nested comment replies, comment images, and spoiler-hiding controls.
- Public user profiles, direct messages, followers, or social feeds.
- Separate follow and bookmark concepts; a bookmark is the single saved-work relationship.
- Payments, subscriptions, purchases, premium chapters, and stores.
- Video or anime streaming.
- Fractional chapter numbers, volumes, seasons, ZIP imports, scraping, and scheduled publishing.
- A full site builder, theme editor, or advanced analytics platform.
- Hard deletion of works or chapters from the admin UI.

### 3.3 Advertising policy

The advertising experience must be deliberately quiet:

- Use display banners only.
- Show at most one Fury-managed ad slot on an eligible page.
- Do not automatically refresh, stack, or overlay advertisements.
- Do not place advertisements on work details, category directory, readers, authentication, user workspace, support, legal, admin, or error pages.
- Do not interrupt navigation or delay access to content.
- Do not claim an impression or revenue event unless the provider reports it.

Approved placements:

| Placement key    | Route                   | Position                                                                                                                              |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `home-banner`    | `/`                     | Beside or near Latest Releases on desktop and inline between sections on smaller screens; replaces the duplicated vertical video rail |
| `catalog-banner` | `/discover`, `/stories` | After search/filter controls and before the results grid                                                                              |

Ad-block behavior:

- Run detection only when advertising is globally enabled and the current page has an enabled placement.
- If blocking is detected, show an accessible, non-modal message asking the visitor to disable the blocker to support Fury.
- Include a **Retry check** action and allow the visitor to continue browsing.
- Dismissal may be remembered for the browser session so the message does not repeat on every route.
- Detection failure or a false positive must never block public content, login, or chapter reading.
- Chapter reader routes must not load the ad provider script or run the ad-block check.

The initial provider is Adsterra, using display-banner units only. Provider scripts and zone identifiers are deployment configuration, not arbitrary JavaScript edited through the browser admin panel.

## 4. Verified current repository baseline

### 4.1 Architecture

The current repository is a pnpm/Turborepo TypeScript monorepo:

- `apps/web`: Next.js 16.2.12, React 19.2.8, TypeScript, React Query, React Hook Form, Zod, Axios, CSS modules, Lucide, and Embla.
- `apps/api`: Express 5.2.1, Zod, OpenAPI, Pino, JWT authentication, Argon2id, email delivery, CSRF protection, and rate limiting.
- `packages/database`: Prisma with PostgreSQL.
- `packages/contracts`: shared request and response schemas.
- `packages/config-*`: shared linting, TypeScript, and formatting configuration.

The expected production topology is one public origin, with Caddy routing `/api/*` to Express and all other traffic to Next.js.

### 4.2 What is already functional

The backend currently implements:

- Health endpoints.
- Registration and email verification.
- Resending verification.
- Login and token refresh.
- Logout and logout-all.
- Forgot/reset password and reset-token validation.
- Password change.
- Read and update the current user's basic profile.

The database currently contains only `users` and `refresh_tokens`. The web authentication flow is connected to the API and includes protected workspace routing.

### 4.3 What is currently presentation-only

Most product-domain screens use local fixtures or component state. This includes works, chapters, catalog filters, bookmarks, progress, ratings, comments, notifications, gifts, support messages, advertising settings, and almost the entire admin area.

Therefore, the implementation must preserve the approved visual design while replacing fixtures with contracts, API calls, permissions, persistent database records, and real loading/error/empty states.

### 4.4 Frontend screen inventory

The frontend contains 36 route pages: 11 public, 5 authentication, 3 user workspace, and 17 admin routes. It also contains root loading, not-found, and global-error experiences.

## 5. Users and permissions

### 5.1 Visitor

A visitor can browse public pages, search/filter published works, and view public work metadata, published chapter metadata, aggregate ratings, and visible comments.

A visitor cannot receive chapter content, bookmark, rate, comment, like, report, save progress, or access workspace routes. Opening a protected chapter redirects to login with a safe return path. After successful login, a verified active user returns to the requested chapter.

### 5.2 Verified active user

An active user with a verified email can:

- Read published chapters.
- Bookmark works and manage the library.
- Resume from saved reading progress.
- Rate works.
- Create, edit, and delete their own comments.
- Like or unlike visible comments and report comments.
- Receive and manage in-site notifications.
- Select one owned avatar frame and one owned comment decoration, or use the default appearance.
- Update display name and avatar, and change password.

### 5.3 Pending-verification user

A pending user can access the verification flow and request a new verification email. Protected reading and interaction remain unavailable until verification succeeds.

### 5.4 Suspended user

A suspended user cannot log in or use protected actions. Protected API calls must also reject already-open sessions after suspension is detected. Suspension does not automatically delete the user's comments, bookmarks, gifts, or other records.

### 5.5 Administrator

An administrator can access all admin workflows in this plan. Multiple admin accounts are supported, but the MVP has no UI for creating admins or changing roles. Admin accounts are provisioned operationally. No independent moderator role is required.

Every `/admin` route and every admin API endpoint must verify the `ADMIN` role. Hiding a navigation item is not authorization.

## 6. Canonical frontend route map

### 6.1 Public routes

| Route                             | Existing design | Final responsibility                                                                                                         |
| --------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `/`                               | Yes             | Featured works, genre shortcuts, trending works, community banner, latest releases, suggestions, and the single home ad slot |
| `/discover`                       | Yes             | Searchable and filterable catalog for all work types; default emphasis may remain illustrated works                          |
| `/stories`                        | Yes             | Text-only catalog for novels and text stories, reusing the catalog query and pagination pattern                              |
| `/categories`                     | Yes             | Searchable category directory linking to filtered catalog results                                                            |
| `/story/[id]`                     | Yes             | Correct illustrated or text work details, published chapter list, bookmark, rating, similar works, and work comments         |
| `/story/[id]/chapter/[chapterId]` | Yes             | Protected illustrated or text reader with progress and chapter comments; never contains ads                                  |
| `/contact`                        | Yes             | Public contact form persisted to the admin inbox                                                                             |
| `/report-issue`                   | Yes             | Public issue form with issue type, page URL, details, and optional contact email                                             |
| `/privacy`                        | Yes             | Final static privacy policy                                                                                                  |
| `/terms`                          | Yes             | Final static terms of use                                                                                                    |
| `/copyright`                      | Yes             | Final static copyright and takedown policy                                                                                   |

The global navbar search must search all published work types and use `/discover?q=...`. `/stories` remains a convenient text-only view rather than a separate data source.

### 6.2 Authentication routes

| Route                   | Existing design       | Final responsibility                                                               |
| ----------------------- | --------------------- | ---------------------------------------------------------------------------------- |
| `/auth/login`           | Yes and API-connected | Email/password login, remember-me behavior, safe return path, account-state errors |
| `/auth/register`        | Yes and API-connected | Display name, email, password, terms acknowledgement; no phone or Google           |
| `/auth/verify-email`    | Yes and API-connected | Consume verification token and resend verification                                 |
| `/auth/forgot-password` | Yes and API-connected | Request password-reset email without account enumeration                           |
| `/auth/reset-password`  | Yes and API-connected | Validate token and set a new password                                              |

### 6.3 User workspace routes

| Route        | Existing design | Final responsibility                                                                                        |
| ------------ | --------------- | ----------------------------------------------------------------------------------------------------------- |
| `/dashboard` | Yes             | Account summary, continue reading, library preview, owned appearance gifts, and quick links; no points card |
| `/library`   | Yes             | Saved works, search/filter/sort, resume reading, removal confirmation, unavailable-content state            |
| `/settings`  | Yes             | Display name, avatar, password, sessions, avatar-frame selection, and comment-decoration selection          |

### 6.4 Admin routes

| Route                                             | Existing design        | Final responsibility                                                                                                    |
| ------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/admin`                                          | Yes                    | Redirect to `/admin/dashboard` after authorization                                                                      |
| `/admin/dashboard`                                | Yes                    | Simple platform metrics, recent works, trending works, recent activity, and moderation alerts                           |
| `/admin/works`                                    | Yes                    | Search, filters, pagination, preview, publish/unpublish, archive/restore, edit, and chapter navigation                  |
| `/admin/works/new`                                | Yes                    | Create an illustrated or text work as draft or published                                                                |
| `/admin/works/[workId]/edit`                      | Yes                    | Edit metadata, media, classification, visibility, and publication state                                                 |
| `/admin/works/[workId]/chapters`                  | Yes                    | Manage chapters for one work                                                                                            |
| `/admin/works/[workId]/chapters/new`              | Yes                    | Create an illustrated or text chapter                                                                                   |
| `/admin/works/[workId]/chapters/[chapterId]/edit` | Yes                    | Edit, preview, publish, unpublish, archive, or restore a chapter                                                        |
| `/admin/users`                                    | Yes                    | Search/filter users, view state and gift count, suspend/reactivate, and open details; no points column                  |
| `/admin/users/[userId]`                           | Yes                    | Account facts, reading progress, bookmarks, gifts, moderation notes, suspension, grant/revoke; no points panel          |
| `/admin/gifts`                                    | Yes                    | Create, edit, preview, disable, reactivate, or archive gift designs                                                     |
| `/admin/gifts/grants`                             | Yes                    | Individual and bulk grants, duplicate prevention, revocation, and grant history                                         |
| `/admin/comments`                                 | Yes                    | Search and review comments, open context, hide/restore, and inspect report count                                        |
| `/admin/reports`                                  | Yes                    | Review comment reports and resolve or dismiss them with an outcome                                                      |
| `/admin/contact`                                  | Yes                    | Combined support inbox for contact and issue-report submissions                                                         |
| `/admin/contact/[messageId]`                      | Yes                    | Full submission detail, status, internal note, linked URL, and archive/restore actions                                  |
| `/admin/ads`                                      | Yes but obsolete rules | Global advertising state, the two approved placements, configuration health, safe preview, and ad-block-message preview |

### 6.5 Required route addition

`/admin/categories` must be added because category management is a required admin capability but has no current route. It must support list, search, create, edit, order, enable/disable, and usage-count display. A category in use should be disabled or merged rather than hard-deleted silently.

## 7. Detailed functional requirements

### 7.1 Shared public layout

- Keep the existing Fury visual identity, Arabic copy, RTL direction, responsive navigation, and footer structure.
- Navbar destinations must point to working pages only.
- The search field must submit a real query and retain it in the URL.
- The notification bell and library shortcut are visible only to authenticated users.
- Footer community links come from deployment configuration or maintained constants and must not be placeholders at launch.
- Every interactive control must have keyboard behavior, focus visibility, an accessible name, and a real action.

### 7.2 Home page

- Featured hero items are selected and ordered by an administrator.
- Genre shortcuts come from enabled categories.
- Trending works are ordered by chapter opens during the previous seven days. The MVP may count opens rather than unique readers.
- Latest Releases is driven by recently published chapters.
- Suggestions use shared enabled categories; no personalized or AI recommendation engine is required.
- The current two duplicated autoplay videos are removed and replaced by the single `home-banner` placement.
- The community/Discord banner remains a static outbound link supplied by the owner.
- Empty sections are hidden or show a purposeful empty state; fixture numbers and fake engagement must not ship.

### 7.3 Catalogs, search, filters, and pagination

- `/discover` is the canonical searchable catalog.
- `/stories` applies the same query model while restricting results to `novel` and `text-story`.
- Supported filters: query, category, work type, story status, and sort order.
- Supported sort choices: newest update, oldest update, title, rating, and popularity where data exists.
- Search and filter state is represented in URL query parameters.
- Pagination supports previous/next and a stable page indicator.
- Invalid or unsupported query values fall back safely instead of causing an error.
- Results include only published works and published chapters appropriate to the viewer.
- Provide loading, error with retry, no-results, and normal states.
- Place the single `catalog-banner` between filters and results when enabled.

### 7.4 Work details

- Render the work resolved by the route slug or ID; never fall back to a fixed fixture.
- Show title, alternative title when present, cover, background, synopsis, type, story status, author, optional artist, categories, tags, update date, aggregate rating, and rating count.
- Show only published chapters to public users.
- Provide first chapter, latest chapter, and resume-reading actions when applicable.
- Bookmarking, rating, and commenting require an authenticated verified user.
- The user has one editable five-star rating per work.
- Similar works use shared categories and exclude the current work.
- Work comments are distinct from comments belonging to a chapter.
- Archived or unpublished content returns a deliberate unavailable state, not leaked draft data.

### 7.5 Illustrated reader

- Require an active verified user before returning page URLs.
- Preserve the designed continuous-scroll and single-image modes.
- Provide chapter selection, previous/next chapter, work-details navigation, page position, and responsive controls.
- Store the latest useful page index and percentage with a debounced update.
- Mark a chapter completed when the reader reaches at least 75%; this status is for reading progress only and has no reward or advertising effect.
- Avoid saving duplicate events on every scroll pixel.
- Display a useful failure state for an image and allow retry without breaking the remaining chapter.
- Render chapter comments after the reading content.
- Never load an ad placement, ad provider script, ad-block check, popup, or forced navigation.

### 7.6 Text reader

- Apply the same authentication, publication, navigation, progress, and comment rules as the illustrated reader.
- Render sanitized structured text supporting paragraphs, headings, bold, italic, lists, and links.
- Do not support images embedded in text chapters in the MVP.
- Preserve simple reader preferences such as font size and line spacing.
- Store a paragraph/block position and approximate percentage, not an exact cross-device pixel offset.
- Mark completion at 75% for progress only.
- Never contain advertising.

### 7.7 Library and reading progress

- One user/work bookmark record represents the user's saved library.
- Bookmark creation must be idempotent; removal must not affect progress or rating records.
- Library cards show cover, title, latest published chapter, saved date, and resume action when progress exists.
- Search, filter, and sort operate on the user's real bookmarks.
- If a work is archived or unpublished after being saved, retain the library entry and show it as unavailable.
- Store one current progress record per user/chapter or user/work as chosen during schema design; updating progress replaces the previous position rather than creating a detailed session history.
- The dashboard and work details must resolve the same canonical resume position.

### 7.8 Comments, likes, and reports

- Support comments on a work and separately on a chapter.
- A comment has a maximum of 1,000 characters.
- The author may edit or soft-delete their own visible comment.
- A soft-deleted or admin-hidden comment is not returned as normal visible content, but remains available to authorized moderation workflows.
- Users may like/unlike a visible comment, with one like per user/comment.
- Do not implement replies or display a reply button/count.
- Do not implement images or spoiler masking in comments.
- Report reasons are: abuse, inappropriate content, spoiler, spam, or other.
- The optional report description must be bounded and sanitized.
- Prevent accidental duplicate open reports by the same user for the same comment.
- Gift comment decorations are applied from the comment author's currently selected owned decoration.

### 7.9 Notifications

- In-site notification types in the MVP are a gift grant and a new chapter for a bookmarked work.
- Notification data includes title, concise message, created time, read time, and destination.
- Gift notifications include the gift name and image and link to the relevant settings section.
- New-chapter notifications link directly to the published chapter.
- Support marking one notification or all notifications as read.
- Load on page navigation/refresh and when the menu opens; WebSockets and background push are not required.
- Do not create duplicate new-chapter notifications for repeated publish events.
- Revoking or disabling a gift does not erase the historical notification; its destination must explain that the gift is no longer available.

### 7.10 Gifts and appearance

- Supported gift types are avatar frames and comment decorations.
- Designs are static PNG or WebP files with transparent backgrounds; no GIF or browser design editor.
- Gifts do not expire automatically.
- A user can select one owned active avatar frame and one owned active comment decoration, or return either to the default.
- Granting the same gift to the same user twice is idempotent and does not create a duplicate notification.
- An administrator can grant to one user or in bulk to all active non-admin accounts existing at the time of the grant.
- Suspended users and admin accounts are excluded from bulk grants.
- Future registrations do not inherit an earlier bulk grant.
- A grant can be revoked from a specific user.
- A design can be disabled globally; existing grants remain in history but cannot be selected while disabled.

### 7.11 Profile and account settings

- Display name does not have to be unique; email remains unique.
- Users can update display name and avatar.
- Users cannot change email in the MVP.
- Remove phone from contracts, forms, persistence, and profile copy.
- Retain the current password change and logout-all-sessions workflows.
- Avatar upload uses the same VPS media service and validated image rules.
- The settings route supports direct links to avatar-frame and comment-decoration sections from notifications.

### 7.12 Contact, issue reports, and legal pages

- Contact is available to visitors and users and records name, email, subject, and message.
- Issue reports record type, affected URL, description, and optional contact email.
- A signed-in submission may also reference the user account without exposing it publicly.
- Both flows create records in the admin support inbox and return a clear confirmation.
- No live chat, threaded ticket conversation, assignment system, or email notification to the admin is required.
- Privacy, terms, and copyright pages are static. Final legally reviewed text is an owner-provided launch dependency.

### 7.13 SEO

- Provide unique title and description metadata for public indexable routes.
- Work details include canonical URL and Open Graph title, description, and cover image.
- Catalog query variants should not create uncontrolled duplicate indexing.
- Generate a sitemap for the home page, catalogs, categories, legal pages, and published works.
- Exclude authentication, workspace, admin, and reader routes from indexing.
- Provide a suitable `robots.txt`.
- No advanced SEO editor is required in admin.

## 8. Admin requirements

### 8.1 Dashboard

- Show published works, draft works, published chapters, active users, open comment reports, and unread support messages.
- Show recent content changes, recent registrations, and unresolved moderation items.
- Show the last-seven-day trending list using the same rule as the public home page.
- Do not show revenue forecasts, point statistics, or unsupported vanity metrics.

### 8.2 Works

Work fields include display title, optional alternative title, unique slug, work type, story status, publication status, synopsis, author, optional artist, categories, tags, cover, optional background, and featured-home state/order.

Supported story statuses are ongoing, completed, hiatus, and cancelled. Publication statuses are draft, published, and archived.

Actions are create, edit, preview, publish, unpublish, archive, and restore. Do not expose hard delete. Publishing validates required metadata and display media. Draft and archived content is inaccessible from public APIs.

### 8.3 Chapters

Shared fields are parent work, positive integer chapter number unique within the work, optional title, content type derived from the work, publication state, and timestamps.

Illustrated chapters support multiple image upload, reorder, replacement/removal, full preview, and explicit stable page order. Text chapters use a limited structured editor for the approved formats and preview through the same renderer as the public reader.

Actions are save draft, preview, publish, unpublish, archive, and restore. Publishing a new chapter creates notifications for users who bookmarked the work.

### 8.4 Categories

- Create and edit name and unique slug.
- Enable/disable and control display order.
- Show the number of associated works.
- Prevent destructive deletion while associated with works.
- Disabled categories remain internally associated but disappear from public navigation and filters.

### 8.5 Users

- Search and filter by status and gift ownership.
- Show display name, email, account state, registration date, last activity, and gift count.
- Remove the current points column, points badges, points filters, and points detail card.
- View bookmarks, reading progress, owned gifts, and moderation notes.
- Suspend or reactivate a user with confirmation.
- Grant or revoke gifts from the detail workflow.
- Never display password hashes, tokens, or secrets.
- Do not provide admin creation or role-changing controls.

### 8.6 Comments and reports

- Search by author/content and filter by work, chapter, visibility, and report state.
- Open the full comment with work/chapter context.
- Hide with an internal reason and restore when appropriate.
- Reports move through open, under-review, resolved, or dismissed.
- Resolution outcomes include comment hidden, no violation, duplicate, or user reviewed.
- Keep moderation history and avoid permanent deletion from routine actions.

### 8.7 Gifts and grants

- Upload, name, describe, categorize, preview, enable/disable, and archive designs.
- Show recipient count and current state.
- Individual grant supports user selection and optional reason.
- Bulk grant shows the number of eligible recipients before confirmation.
- Grant history records gift, recipient, granting admin, time, reason, and revocation state.
- Every successful new grant creates one in-site notification.

### 8.8 Support inbox

- Combine contact messages and issue reports using a type/category indicator.
- Search and filter by sender type, message type, status, and date.
- Statuses are unread/open, resolved, and archived.
- Detail view includes the full message, sender facts, affected URL when present, and one internal note.
- Admin may open a `mailto:` action, but Fury does not implement a conversation thread.

### 8.9 Advertising settings

- Global advertising enable/disable.
- Per-placement enable/disable for `home-banner` and `catalog-banner`.
- Read-only provider name, configured zone identifier status, expected dimensions, last configuration update, and safe preview.
- Preview of the final ad-block support message.
- Never expose provider secrets or allow arbitrary script execution from stored admin input.
- Remove all point values, thresholds, popunder controls, chapter triggers, and duplicate homepage placement concepts.

## 9. Data and backend plan

### 9.1 Current models to retain and adjust

- Retain `User` and `RefreshToken` and the existing secure account lifecycle.
- Remove the optional phone field from the product contract and schema in a forward migration.
- Retain only `USER` and `ADMIN` roles.
- Retain pending, active, and suspended account states.

### 9.2 Required domain records

The final schema should cover these concepts without creating duplicate sources of truth:

- Work.
- Category and work/category relation.
- Chapter.
- Ordered illustrated chapter pages or media references.
- Structured text chapter content.
- Bookmark.
- Reading progress.
- Work rating.
- Comment and comment like.
- Comment report.
- Gift design and gift grant.
- User appearance selection.
- Notification.
- Support/contact submission.
- Admin moderation note.
- Lightweight admin/activity event where dashboard history cannot be derived safely.

Advertising provider code should remain deployment configuration. Only operational enablement and safe placement metadata need persistence if administrators must change them without a deployment.

### 9.3 Important database invariants

- Unique normalized user email.
- Unique work slug.
- Unique chapter number within a work.
- Unique bookmark per user/work.
- Unique rating per user/work.
- Unique comment like per user/comment.
- Unique active gift grant per user/gift with clear revocation history.
- One active appearance choice per user per gift type.
- Ordered illustrated pages cannot share the same position within one chapter.
- Publication state and timestamps remain consistent.
- Routine deletion uses soft-delete, archive, or disabled states where required by this plan.

### 9.4 API modules

Keep the existing module/controller/service/DTO pattern and add domain modules for:

- Catalog, works, categories, and chapters.
- Media upload and delivery metadata.
- Bookmarks and reading progress.
- Ratings.
- Comments, likes, and reports.
- Notifications.
- Gifts and appearance.
- Support submissions.
- Admin dashboard and protected admin operations.
- Advertising operational settings.

All request and response shapes shared with the web app belong in `@fury/contracts`. OpenAPI output must reflect the implemented routes.

### 9.5 Authorization rules

- Enforce permissions in API middleware/services, not only in React components.
- Public APIs never return draft or archived content.
- Reader content requires an active verified account.
- Users can modify only their own profile, bookmarks, progress, rating, comments, likes, notifications, and appearance selection.
- Admin endpoints require the admin role and validate the target record state.
- Suspended users are rejected on protected requests even if an access token has not yet expired.

## 10. VPS media plan

All uploaded media is stored on the same VPS, but outside replaceable application release directories and on a persistent mounted path.

Required media classes are work covers, work backgrounds, illustrated chapter pages, user avatars, avatar frames, and comment decorations.

Rules:

- Validate MIME type and decoded file content, not only the extension.
- Generate server-owned file names; never trust the uploaded path or original name.
- Enforce documented size and dimension limits per media class.
- Store only stable relative media identifiers/paths in PostgreSQL.
- Prevent path traversal and executable uploads.
- Serve media with correct content types, caching, and safe headers.
- Deleting/replacing media must account for references before removing the physical file.
- Include the persistent media directory in backup and restore procedures.
- Use thumbnails or optimized variants where large source images would harm catalog performance.

## 11. Frontend implementation rules

- Preserve the approved visual design and follow `DESIGN-SYSTEM.md`.
- Treat `DESIGN-SYSTEM-INCONSISTENCIES.md` as a remediation backlog, especially keyboard access, focus, reduced motion, responsive collisions, fake controls, images, and duplicated/dead styles.
- Keep route files thin. Feature UI, hooks, query definitions, validation, and mapping logic belong in the relevant feature folder.
- Reuse truly shared components; do not create a generic abstraction for a single use.
- Use React Query as the owner of server state and invalidate targeted query keys after mutations.
- Keep filter/search state in the URL where shareable.
- Replace local fixture state incrementally; do not maintain a second fake production path after a feature is connected.
- Use framework image optimization or an explicitly justified media path.
- Add loading, empty, recoverable error, forbidden, unavailable, and success states appropriate to every data-driven screen.
- Keep all user-facing copy Arabic and direction-aware. Technical identifiers and source code remain English.

## 12. Security, privacy, and operational requirements

- Preserve the existing access-token, rotating refresh-token, HttpOnly cookie, and double-submit CSRF architecture.
- Preserve rate limiting and non-enumerating authentication responses.
- Validate all inputs with shared schemas and repeat authorization checks server-side.
- Sanitize text chapter links/content and all user-generated content before rendering.
- Do not allow stored arbitrary JavaScript for advertisements.
- Do not log passwords, tokens, provider secrets, raw reset/verification URLs, or unnecessary user content.
- Restrict upload types and block executable content.
- Use HTTPS in production and the same-origin topology already documented by the repository.
- Create database and media backups and verify a restore procedure before launch.
- Provide request IDs and actionable server logs for failed domain operations.

## 13. Accessibility, responsive behavior, and quality

- Target keyboard-operable menus, filters, dialogs, carousels, readers, and admin tables.
- Provide visible focus and correct labels, landmarks, headings, dialog focus management, and error association.
- Respect reduced-motion preferences for carousel and animation behavior.
- Do not rely on color alone for states.
- Use accessible foreground/background combinations defined by the design system.
- Ensure mobile layouts do not introduce horizontal scrolling for ordinary content.
- Reserve banner-ad dimensions to reduce layout shift.
- Lazy-load non-critical media and chapter images responsibly without making reader navigation unreliable.
- Support modern desktop and mobile browsers at launch; exact support versions can follow the project's deployment policy.

## 14. Delivery phases

Each phase ends only when its data is persistent, permissions are enforced, the approved UI is connected, and relevant tests pass.

### Phase 0 — Product alignment and obsolete UI removal

Scope:

- Remove all points UI, fixtures, types, copy, tests, and ad-threshold behavior.
- Remove popunder and duplicate video/ad concepts.
- Remove phone from registration/profile contracts and UI.
- Remove Google placeholders and moderator/role-management UI if present.
- Remove comment reply controls/counts.
- Correct global search to target the canonical catalog.
- Add the missing `/admin/categories` route shell and navigation item.
- Protect the admin route tree visibly and server-side/API-side.

Exit criteria:

- No user-visible point, threshold, popunder, or chapter-ad language remains.
- The frontend route map and navigation agree with this plan.
- Existing static screens still build and preserve their approved design.

### Phase 1 — Domain foundation and VPS media

Scope:

- Add domain schema and migrations.
- Add shared contracts and base domain modules.
- Implement work/category/chapter persistence.
- Implement secure VPS upload and media delivery.
- Seed only deliberate local development content, never production demo records.

Exit criteria:

- An admin can create draft data through tested APIs.
- Uploaded media survives an application restart/deployment path.
- Database constraints protect the key invariants.

### Phase 2 — Live public catalog and work details

Scope:

- Connect home sections, `/discover`, `/stories`, `/categories`, and work details.
- Implement search, filters, pagination, featured ordering, latest releases, trending, and similar works.
- Add rating read/write behavior and bookmarks on details.
- Add public metadata, sitemap, robots, and unavailable states.

Exit criteria:

- All public work data comes from the API.
- Query parameters reproduce the same results on refresh.
- Draft and archived records never leak.

### Phase 3 — Protected readers, progress, dashboard, and library

Scope:

- Protect illustrated and text chapter content with safe login return paths.
- Connect both readers to live chapter content.
- Implement progress saving, 75% completion status, resume logic, and reader preferences.
- Connect dashboard and library to bookmarks, progress, and gifts summary.

Exit criteria:

- A verified user can leave and resume both reader types.
- A visitor cannot retrieve chapter content through the UI or API.
- No reader route loads advertising or ad-block detection.

### Phase 4 — Community and notifications

Scope:

- Implement work/chapter comments, editing, soft deletion, likes, and reports.
- Remove all reply behavior.
- Implement notification persistence and mark-read actions.
- Create new-chapter notifications for bookmarked works.

Exit criteria:

- Community actions persist and enforce ownership.
- Moderation can retrieve hidden content and reports.
- Notification links open the correct current destination.

### Phase 5 — Gifts and account appearance

Scope:

- Implement gift design media, grants, revocation, bulk eligibility, and selection.
- Apply selected frames/decorations to user and comment presentation.
- Create gift notifications.
- Complete avatar upload and account settings.

Exit criteria:

- Duplicate grants are prevented.
- Disabled/revoked gifts cannot remain selected.
- Bulk grants affect only the confirmed eligible snapshot.

### Phase 6 — Admin content operations

Scope:

- Connect dashboard metrics/activity.
- Connect works, chapters, and the new categories screen.
- Implement draft/publish/unpublish/archive/restore and previews.
- Implement illustrated upload ordering and the text editor/renderer contract.

Exit criteria:

- Publishing a work/chapter changes public visibility correctly.
- No hard-delete action is exposed.
- Admin previews use the same core renderers as public pages.

### Phase 7 — Admin users, moderation, gifts, and support

Scope:

- Connect users and user details without points or role editing.
- Connect comments, reports, gifts, grants, support inbox, and detail views.
- Add suspension/reactivation, internal notes, statuses, and moderation outcomes.

Exit criteria:

- Every mutation is authorized and confirmed when destructive or consequential.
- Lists have real filters, pagination, empty states, and error recovery.
- Historical records remain auditable after hide, revoke, disable, or archive operations.

### Phase 8 — Advertising and ad-block message

Scope:

- Integrate the two approved display-banner placements.
- Add global/per-placement enablement and configuration-health status.
- Replace the current admin ads page rules and previews.
- Add client-side ad-block detection and the non-blocking support message on eligible pages only.

Exit criteria:

- Exactly zero ad scripts/checks run on readers or excluded routes.
- A blocked ad shows the support message without blocking content.
- Disabling ads removes both slots and detection behavior.
- No point, popup, interstitial, or forced advertisement path exists.

### Phase 9 — Launch readiness

Scope:

- Replace legal drafts and external-link placeholders with owner-approved content.
- Remove production fixture data and dead assets.
- Complete accessibility and responsive remediation.
- Verify backups, restore, logging, health checks, rate limits, email provider, media persistence, and HTTPS topology.
- Run full repository verification and critical browser journeys.

Exit criteria:

- Launch acceptance scenarios pass on production-like infrastructure.
- Legal copy, ad zones, gift assets, domain/email configuration, and initial content are present.
- The team has documented deployment, rollback, backup, and restore procedures.

## 15. Acceptance scenarios

The MVP is not complete merely because every route renders. At minimum, verify these end-to-end outcomes:

1. A visitor browses, searches, filters, and opens the correct published work.
2. A visitor opening a chapter is redirected to login and returns to that chapter after a valid verified login.
3. Registration, email verification, password reset, password change, logout, and logout-all work without phone or Google.
4. A user bookmarks a work, sees it after a new session, removes it, and receives a new-chapter notification while it is bookmarked.
5. A user resumes an illustrated and a text chapter near the saved position.
6. A user creates, edits, deletes, likes, and reports allowed comments, with no reply feature present.
7. A user creates or updates one five-star rating and the aggregate changes correctly.
8. An admin creates and publishes both an illustrated and text work/chapter, and public visibility follows publication state.
9. An admin archives and restores content without hard deletion.
10. An admin suspends a user and protected API access stops.
11. An admin creates both gift types, grants individually and in bulk, prevents duplicates, revokes a grant, and disables a design.
12. A user receives a gift notification and selects an owned active appearance.
13. Contact and issue submissions appear in the support inbox and can be resolved/archived.
14. A normal eligible page shows at most one enabled banner; a reader shows none.
15. Blocking ads produces a non-modal disable-ad-block message, and continuing to browse or read remains possible.
16. An admin cannot access arbitrary-script editing or any point/popunder configuration.
17. Draft, archived, private, and secret data is not exposed through public responses.
18. Empty, loading, error, unavailable, forbidden, and not-found states are usable in Arabic RTL layouts.

## 16. Verification strategy

- Contract schema tests for every shared request/response and bounded enum.
- Service and controller tests for business rules and permissions.
- Disposable PostgreSQL integration tests for critical invariants and concurrent/idempotent operations.
- Component tests for forms, filters, dialogs, workspace states, admin actions, and ad-block messaging.
- Route-level tests for redirects, safe return paths, metadata, and protected areas.
- Browser smoke journeys for registration, discovery, both readers, bookmark/resume, community actions, gift selection, admin publishing, moderation, support, and advertising exclusions.
- Security checks for upload validation, authorization, XSS sanitization, CSRF, rate limits, and secret leakage.
- Run the repository's formatting, linting, type checking, unit/integration tests, build, build-output verification, and diff checks before release.

## 17. Owner-provided launch inputs

The product scope is defined, but launch still requires:

- Final legal text for privacy, terms, and copyright/takedown.
- Production domain and email-provider credentials.
- Adsterra approval and display-banner zone identifiers for the two placements.
- Final Discord/community links.
- Initial real works, chapters, covers, backgrounds, and categories.
- PNG/WebP avatar-frame and comment-decoration assets.
- VPS storage, database, backup destination, and restore access.

These are launch dependencies, not reasons to retain placeholder content as production data.

## 18. Definition of done

A feature is done only when:

- Its approved frontend design is connected to persistent real data.
- Browser and API authorization agree.
- Contracts, loading, empty, success, error, and recovery states exist.
- Mobile, RTL, keyboard, focus, and reduced-motion behavior is appropriate.
- Relevant tests pass and no obsolete fixture path can masquerade as production behavior.
- Product copy matches this plan, especially the removal of points and intrusive advertising.
- Operational requirements such as media persistence, logging, and backup are satisfied where applicable.

The Fury MVP is complete when all required routes and acceptance scenarios above work together as one product, not when individual screens merely look complete.

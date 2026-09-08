# Fury Anime — Feature Roadmap for Spec Kit

**Scope:** Agreed MVP only  
**Language:** English roadmap; Arabic-only RTL product  
**Repository:** D:\MINE\Software Engineering\Projects\Mostaql\fury-manga  
**Revision:** 2026-09-08 — replaces the previous 18-phase / 17-substep organization  
**Status:** Planned. This revision reorganizes delivery; it does not implement features.

## 1. How to use this file

This root **PLAN.md** is the project roadmap. Each numbered phase is one bounded feature or operational deliverable for its own Spec Kit cycle. Its detailed technical plan belongs in that feature's directory, alongside spec.md and tasks.md. Do not give the entire roadmap to Spec Kit as one feature to implement.

The structure follows Spec Kit's documented roadmap approach: concise feature boundaries, dependency order, stable IDs and links to the resulting specs. The choice of **24 phases** is specific to Fury, not a Spec Kit requirement. [Official roadmap guidance](https://github.github.com/spec-kit/concepts/spec-of-specs.html)

For each phase:

1. Select the next planned phase whose dependencies are complete. Use its outcome, included scope and acceptance scenarios as the specification input.
2. Run **/speckit.specify** for that phase only; clarify unresolved behavior with **/speckit.clarify** where needed.
3. Use **/speckit.plan** to design against current code, then **/speckit.tasks** to create the implementation task list. Check consistency with **/speckit.analyze**, then implement using **/speckit.implement**.
4. Review the actual result and relevant tests; update the status and actual feature-spec path in the table.

Use the equivalent command entry points supplied by the installed integration. Existing code is context to preserve, not a request to reconstruct or retrospectively specify the whole application. Reuse applicable existing project principles rather than inventing requirements to fill a template. [Official existing-project guidance](https://github.github.com/spec-kit/guides/existing-projects.html)

Suggested input, replacing the ID each time:

> Specify only phase P01 from the root PLAN.md. Use that phase's outcome, scope, acceptance scenarios and shared product rules. Preserve the current repository behavior outside this feature. Respect its dependencies and deferred scope. Do not implement sibling phases or add optional features. Link the resulting specification back to P01; put technical design and implementation tasks in this feature's own artifacts.

**Sizing rule:** Related screens that deliver one reviewable journey can share a phase. Database/contracts/API/UI connection for the same live feature stay together. File-level tasks, migrations, test cases and technical subtasks belong in tasks.md, not extra roadmap phases. Split further only if specification reveals a genuinely separate outcome; do not turn every component into a feature.

## 2. Delivery order and tracking

- **P01–P09:** Complete all required mock interfaces, including Admin. Existing working auth remains real; new domain behavior is simulated.
- **P10–P23:** Connect bounded live features to those approved interfaces.
- **P24:** Release readiness and VPS operations after feature-level verification.

**Mock-first gate:** Finish all nine mock phases before starting new production-domain integration. P09 includes the combined mock acceptance walkthrough; P06 must also be complete before P10. This replaces the old giant Phase 1 without abandoning frontend-first delivery.

Status values: Planned, In progress, Blocked, Done. All entries start Planned because the prior work only audited the project and wrote the roadmap. Keep Pxx IDs stable once linked to a spec. Slugs are suggestions; record the actual generated spec path rather than assuming its numeric folder name.

| ID  | Feature                                | Mode    | Depends on                        | Suggested slug              | Status  | Feature spec |
| --- | -------------------------------------- | ------- | --------------------------------- | --------------------------- | ------- | ------------ |
| P01 | Public discovery UI                    | Mock UI | Current repository                | mock-discovery              | Planned | —            |
| P02 | Illustrated reading UI                 | Mock UI | P01                               | mock-illustrated-reading    | Planned | —            |
| P03 | Text-story reading UI                  | Mock UI | P01, P02                          | mock-text-reading           | Planned | —            |
| P04 | Account and personal library UI        | Mock UI | P01, P02, P03                     | mock-account-library        | Planned | —            |
| P05 | Comments and notifications UI          | Mock UI | P02, P03, P04                     | mock-community              | Planned | —            |
| P06 | Legal and support UI                   | Mock UI | P01                               | mock-support                | Planned | —            |
| P07 | Illustrated publishing admin UI        | Mock UI | P01, P02                          | mock-admin-illustrated      | Planned | —            |
| P08 | Text publishing admin UI               | Mock UI | P03, P07                          | mock-admin-text             | Planned | —            |
| P09 | Administration controls UI             | Mock UI | P04, P05, P07, P08                | mock-admin-operations       | Planned | —            |
| P10 | Google sign-in and access completion   | Live    | P04, P06, P09                     | live-auth                   | Planned | —            |
| P11 | Local media upload service             | Live    | P10, P07, P08                     | live-media                  | Planned | —            |
| P12 | Illustrated catalog and publishing     | Live    | P07, P10, P11                     | live-illustrated-publishing | Planned | —            |
| P13 | Text catalog and publishing            | Live    | P08, P10, P11, P12                | live-text-publishing        | Planned | —            |
| P14 | Live discovery and details             | Live    | P01, P02, P03, P12, P13           | live-discovery              | Planned | —            |
| P15 | Protected readers and content delivery | Live    | P02, P03, P10, P11, P12, P13, P14 | live-readers                | Planned | —            |
| P16 | Reading completion and points          | Live    | P15                               | live-reading-state          | Planned | —            |
| P17 | Bookmarks and chapter notifications    | Live    | P04, P05, P10, P12, P13           | live-library-notifications  | Planned | —            |
| P18 | Comments and moderation                | Live    | P05, P09, P10, P12, P13           | live-comments-moderation    | Planned | —            |
| P19 | Frame gifts and appearance             | Live    | P04, P09, P11, P18                | live-frames                 | Planned | —            |
| P20 | Live profile and account settings      | Live    | P04, P10, P11, P16, P17, P18, P19 | live-account-profile        | Planned | —            |
| P21 | Support delivery and final policies    | Live    | P06, P10                          | live-support                | Planned | —            |
| P22 | Live admin overview and settings       | Live    | P09, P12, P13, P16, P18, P19      | live-admin-operations       | Planned | —            |
| P23 | Conditional Monetag integration        | Live    | P15, P16, P22                     | live-advertising            | Planned | —            |
| P24 | VPS release readiness                  | Release | P01–P23                           | vps-release                 | Planned | —            |

## 3. Shared scope and existing-code boundaries

The supplied English PRD remains the product scope authority. Current source determines implementation status; screenshots establish visual direction except where the PRD corrects behavior. This roadmap changes grouping, not the agreed MVP. Feature-specific artifacts must carry forward the relevant rules below.

### Current baseline

- Next.js/React/TypeScript frontend; Express API; PostgreSQL/Prisma; shared contracts/configuration packages; existing Axios/React Query/form helpers.
- Existing visual work primarily uses CSS Modules/global tokens with Tailwind installed. Preserve the dark Cairo-based RTL design; no unrelated styling migration or dependency upgrade.
- Working email/password registration/login/verification/recovery/reset, refresh, password change and logout/logout-all exist. Google OAuth does not.
- Database currently contains User and RefreshToken only. Add domain schema in its owning feature, preserving existing data/migrations.
- /dashboard is a basic personal account/library screen, not Admin Dashboard. /settings has name/phone and security/session forms; email is read-only and avatar/frames are missing.
- Home/Discover/details/readers are largely fixtures. Work IDs are inconsistent, all details reuse one story, chapters descend, and several filters/search/navigation links are decorative.
- Reader routes are outside the protected workspace layout; hiding the reader alone will not protect images/text.
- Compose provides PostgreSQL only; Caddy is a proxy template. The agreed Nginx/VPS deployment remains future work.
- The previous audit passed **185 unit/component tests in 35 files**. This is historical verification, not a new run or proof of product integration. Auth-only schema/OpenAPI/routing test expectations must evolve with their owning features.
- AI-specific files, generated dependencies/builds and private environment values were outside the authored-source review. Historical ALL_GIT_CHANGES.md versions do not override current source.

### Rules applied to every phase

1. **Arabic RTL:** Keep shared layout, colors/components, understandable errors and responsive behavior. English work titles/proper names remain data. Remove unfinished English/Fury Turbo product copy.
2. **Two roles:** User and Admin only. Public discovery is allowed; actual chapter content, bookmarks, comments/reports and personal actions require sign-in. Blocked users cannot use protected access; drafts are admin-only.
3. **Free chapters:** All published chapters are free after sign-in. Points are ad counters, never money, paid unlocks or frame currency.
4. **Auth preservation:** Keep Argon2id passwords, hashed stored tokens, refresh rotation, in-memory access tokens, secure cookies/CSRF, safe-user serialization, neutral recovery and rate limits. No production mock-auth bypass.
5. **No silent policy change:** Code currently requires verified active accounts; the PRD left mandatory verification conditional. Preserve behavior until explicitly resolved for P10.
6. **Incremental live work:** Each live phase owns its necessary contracts/migrations/API/UI integration/tests. Do not perform an all-domain schema/API rewrite first.
7. **Honest mocks:** Demonstrations may use development-only user/admin fixtures; simulated uploads, submissions, Google login and ads must not claim real delivery or provider confirmation.
8. **Standard states:** Every affected screen/action includes relevant loading, populated, empty, error/retry, validation, unavailable and access states. Per-feature review includes narrow mobile, RTL controls, keyboard/focus and long-content behavior.

## 4. Feature phases

Each card is a specification brief. Its acceptance scenarios become feature user stories/tests; its implementation surface is a navigation hint, not a mandatory file layout. Detailed task decomposition happens inside Spec Kit.

### P01 — Public discovery UI

**Outcome:** Visitors can discover a work through a coherent Arabic RTL public interface.

**Depends on:** Existing repository baseline.

**Included scope:**

- Unify work/chapter/genre fixtures and shared cards/header/footer; retain existing tokens, CSS Modules and Cairo design. Make internal links and global search functional.
- Correct Home: one-image, one-CTA work hero; genre links; Trending/Suggestions; Discord invitation without counts/activity; Latest Load More opens Most Recently Updated.
- Complete Discover filter application, URL state and pagination, plus new Search Results and Categories pages using the same fixture catalog.
- Include loading/empty/error/retry, correct missing IDs, mobile navigation, final Arabic 404/shared copy, and owner-link placeholders where URLs are unavailable.

**Acceptance scenarios:**

- [ ] A card's work/chapter identifiers stay consistent across Home, results and detail destinations.
- [ ] Applied filters/search/page survive URL reload and back/forward; genre and Latest links preselect correct results.
- [ ] Home corrections and all public navigation can be demonstrated on desktop and narrow mobile.

**Boundary:** Work-details/readers belong to P02/P03; account/community screens to P04/P05; live data to P14.

**Likely implementation surface:** Home and discovery components, shared cards, app routes, public styles.

### P02 — Illustrated reading UI

**Outcome:** Readers can inspect an illustrated work and demonstrate both chapter-reading modes.

**Depends on:** P01.

**Included scope:**

- Resolve fixture work details, optional-banner fallback, metadata/synopsis, Bookmark presentation, similar cards and ascending chapter search by number/title/date/read state.
- Replace the newest shortcut with First Chapter and conditional Next after the last completed chapter, including final/no-chapter/missing-work states.
- Complete full/single image modes, top/bottom selectors/navigation, distinct page/chapter controls, placeholders/lazy loading/independent image retries.
- Simulate the shared completion/read/points/ad-outcome contract. Represent guest login-return without exposing unauthorized chapter content; leave reusable slots for P05 comments.

**Acceptance scenarios:**

- [ ] Both modes navigate actual chapter/page references and handle unavailable directions and failed images independently.
- [ ] First/Next shortcuts and Read markers react correctly to simulated completion and genuine reread.
- [ ] Duplicate completion does not multiply mock points; ad failure continues reading and retains balance.

**Boundary:** Real content delivery is P15, persisted rewards P16, live ads P23, shared comments P05.

**Likely implementation surface:** Story details/reader routes, story components/data, image primitives.

### P03 — Text-story reading UI

**Outcome:** Readers can browse text stories and read formatted RTL chapters with basic reading settings.

**Depends on:** P01, P02.

**Included scope:**

- Add text-story list with title search, genre/status/sort filters, pagination and Story Cards; no Colored badge.
- Add details with cover/banner fallback, author/publication data, synopsis, Bookmark, related stories, ascending chapters and the same First/Next/read rules.
- Add safe formatted text reader, breadcrumb/author context, top/bottom chapter navigation, font-size and line-height controls with local preferences.
- Reuse mock access/completion/points/ad semantics and comment slots; include empty/error/missing/draft examples.

**Acceptance scenarios:**

- [ ] The text-list → details → chapter journey uses text content and correct routes.
- [ ] Bold/italic/headings/quotations render safely in RTL; font/line-height adjustments work.
- [ ] End-marker completion and navigation behave consistently with illustrated reading.

**Boundary:** Admin text UI is P08; text persistence P13; protected delivery P15; no video product or account-synced reading preferences.

**Likely implementation surface:** New text-story feature/routes; shared reader/navigation primitives.

### P04 — Account and personal library UI

**Outcome:** Signed-in users can review their profile, bookmarks and appearance settings through mock product data.

**Depends on:** P01, P02, P03.

**Included scope:**

- Expand existing /dashboard into profile: identity/avatar/frame, points, bookmark count/previews, recent-comment links and available gifts/active choices.
- Add Bookmarks for both work families with count/removal/pagination and empty Explore action.
- Complete Account/Security/Avatar Frame/Comment Frame tabs: email/name/optional phone/avatar preview, password-based controls, granted/global choices, previews and No Frame.
- Preserve functional existing auth; finish Arabic validation/blocked/verification/reset UX and safe reader-return destinations. Add Google UI states only; use CSS frame substitutes until PNGs arrive.

**Acceptance scenarios:**

- [ ] Profile/library/settings share coherent mock account state and appearance.
- [ ] Only available frames are selectable; existing login/password/logout flows still work.
- [ ] Required validation/loading/error/empty states and Google-only versus password-account examples are reviewable.

**Boundary:** Persistent Google auth P10, bookmarks P17, frames P19 and profile/email changes P20. No authentication bypass or real mock-message delivery.

**Likely implementation surface:** Workspace/dashboard/settings, account/users/auth features, safe-return helpers.

### P05 — Comments and notifications UI

**Outcome:** Signed-in users can comment, report a comment and inspect relevant chapter notifications.

**Depends on:** P02, P03, P04.

**Included scope:**

- Build one shared immediate comment composer/list for details and chapters, including avatar/name/time/text and active avatar/comment frames.
- Remove reply actions/counts/threads; add Report reason/note dialog with success/error states that leave the reported comment visible.
- Complete existing notification popover: unread count/indicator, Mark All as Read, relative time, destinations and empty/loading/error states.
- Use bookmarked-work new-chapter fixtures; remove translation-approval/reply notices and connect recent-comment destinations.

**Acceptance scenarios:**

- [ ] The same composer/list/report behavior works on illustrated and text details/chapters.
- [ ] A report does not hide content; guest actions use the sign-in flow.
- [ ] Popover read state and destination links work without a standalone notifications page.

**Boundary:** Live notifications P17 and comment/moderation persistence P18. Likes/general notices remain optional.

**Likely implementation surface:** CommentsSection, Navbar popover, profile comment previews.

### P06 — Legal and support UI

**Outcome:** Visitors can find platform policies and complete contact or issue-report forms.

**Depends on:** P01.

**Included scope:**

- Add shared-layout Privacy, Terms and Copyright pages using the required content outline; clearly mark missing owner-specific publication copy.
- Contact form: name, email, subject, message, Send; issue form: type, page/work/chapter link, description, optional follow-up email, Send.
- Add validation/loading/success/error mock states and connect footer support/community links where real destinations are supplied.

**Acceptance scenarios:**

- [ ] Every support/footer route resolves and required form states are demonstrable.
- [ ] Mock submissions do not send messages or claim actual delivery.
- [ ] Missing legal/contact details remain explicit; no invented legal entity, analytics service or support-ticket workflow.

**Boundary:** Real delivery/final copy P21; no new support dashboard or multi-stage tickets.

**Likely implementation surface:** Shared content-page layout, footer and new support routes.

### P07 — Illustrated publishing admin UI

**Outcome:** An admin can demonstrate creating a work and preparing an ordered illustrated chapter.

**Depends on:** P01, P02.

**Included scope:**

- Add reusable Arabic RTL admin shell/navigation and role/access states using development-only fixtures.
- Work list/editor covers identity/aliases, synopsis, cover/optional banner, classification/origin/status, credits/dates, featured/Home placement and availability.
- Chapter list/editor supports number/title/date, draft/publish/edit/delete, bulk drag-and-drop preview/removal/reordering and admin-only preview using the reader.
- Add genre/classification add/edit/delete and tag creation/association; reuse public fixtures.

**Acceptance scenarios:**

- [ ] An admin can create a mock work, order its images, preview a draft and publish it.
- [ ] Final preview order matches the editor; cover alone is sufficient.
- [ ] Validation/search/empty/error/delete/access states work without mutating real content.

**Boundary:** Actual media P11 and catalog publishing P12. Text editor P08; operations controls P09.

**Likely implementation surface:** New admin shell/catalog/chapter/classification screens; shared readers.

### P08 — Text publishing admin UI

**Outcome:** An admin can demonstrate publishing a formatted text story and chapter.

**Depends on:** P03, P07.

**Included scope:**

- Add story list/editor with title/description/cover/genres/status/author and required public details data.
- Add chapter list/editor with number/title/formatted content/draft/publish/preview/edit/delete.
- Provide bold/italic/headings/quotations and safe text-reader preview; reuse classifications/admin shell and standard form states.

**Acceptance scenarios:**

- [ ] Mock story → draft chapter → preview → publish is demonstrable.
- [ ] Text formatting matches the public text reader; no image-chapter upload step is required.
- [ ] Missing/validation/error/delete states behave consistently with the illustrated admin.

**Boundary:** Real story/editor persistence P13; no new contributor/translator roles.

**Likely implementation surface:** Admin text-story/chapter editors and shared admin components.

### P09 — Administration controls UI

**Outcome:** An admin can review the remaining management screens before backend integration begins.

**Depends on:** P04, P05, P07, P08.

**Included scope:**

- Overview and users: simple totals/recent records, user search/details/points/frames, block/unblock and gift actions.
- Moderation: comment search/location/delete/author block; report reason/reference and delete-comment or dismiss/close.
- Frames: name/type/asset preview, enabled/global state, individual/all-user grants and individual revocation.
- Ad/points settings: enabled state, default 3/10, provider identifiers; clearly distinguish attempts, confirmed displays and unavailable data.

**Acceptance scenarios:**

- [ ] Required admin actions have mock success/error/access states; no third account role or approval queue appears.
- [ ] Frame grant/selection and report/moderation examples can be demonstrated across existing mocks.
- [ ] All P01–P09 screens pass a complete responsive mock journey review; no required screen is deferred into a backend phase.

**Boundary:** Persistent operations connect in P18/P19/P22; live ads P23. This is UI simulation, not simultaneous implementation of those domains.

**Likely implementation surface:** Admin overview/users/moderation/frames/settings; existing mock account state.

### P10 — Google sign-in and access completion

**Outcome:** Users can sign in through Google or the existing password flow and return to their permitted destination.

**Depends on:** P04, P06, P09.

**Included scope:**

- Add Google initiation/callback/identity persistence and safe existing/new-account matching; handle cancellation/errors and Google-only accounts without dummy passwords.
- Resolve mandatory-verification policy and apply it consistently across session/API/frontend guards while retaining suspension restrictions.
- Connect safe post-login return for both readers/personal/admin routes and finish real Arabic auth email/feedback configuration.
- Preserve current password hashing, token rotation/cookies/CSRF, neutral recovery, rate limits and safe-user serialization.

**Acceptance scenarios:**

- [ ] Both login methods return users to the original permitted page and reject unsafe redirects.
- [ ] Account linking cannot attach an unverified identity to another account; Google-only Security states are correct.
- [ ] Existing password/refresh/recovery/logout tests remain valid and selected verification/block rules are enforced.

**Boundary:** Email-profile changes P20; actual reader content authorization P15; no wholesale auth rewrite.

**Likely implementation surface:** Auth API/contracts, user/identity schema, auth hooks/guards/emails.

### P11 — Local media upload service

**Outcome:** Authorized uploads can be validated, processed and stored safely on the project's VPS-compatible filesystem.

**Depends on:** P10, P07, P08.

**Included scope:**

- Provide organized local storage for covers/banners/chapters/avatars/frames, with database path/metadata references and backend-only write permissions.
- Validate actual file type/approved formats/selected limits, generate safe internal filenames and prevent traversal/executable uploads.
- Apply appropriate Sharp/WebP processing to covers/chapters, preserve transparent PNG frames, store dimensions and handle failed/replaced/removed uploads consistently.
- Separate public media from protected chapter files; provide a reusable authorized upload boundary for subsequent feature integration.

**Acceptance scenarios:**

- [ ] Valid media uploads produce correct metadata/files; invalid or unauthorized uploads fail safely.
- [ ] Ordering is explicit metadata, never inferred from user-controlled filenames.
- [ ] Chapter files are not exposed by a public upload-directory alias; replacement/failure does not break referenced content.

**Boundary:** Admin publishing connections P12/P13; actual chapter delivery P15; full VPS deployment P24.

**Likely implementation surface:** API media boundary, database media metadata, local filesystem configuration.

### P12 — Illustrated catalog and publishing

**Outcome:** Admins can manage real classifications, works and ordered illustrated chapters through the approved screens.

**Depends on:** P07, P10, P11.

**Included scope:**

- Add domain migrations/contracts for works, genres/tags, chapter metadata/publication/availability and ordered page records.
- Connect work/classification lists/editors with complete metadata, search/pagination/validation and safe deletion/unavailability.
- Connect chapter uploads/reorder/removal/preview/draft/publish/edit/delete using P11; keep publication and page order consistent.
- Enforce Admin mutations/previews; derive real latest chapter/count/update metadata and exclude drafts/unavailable records from public catalog reads.

**Acceptance scenarios:**

- [ ] A work and ordered chapter can be saved, previewed and published with real storage.
- [ ] Non-admin writes/previews fail; ordinary catalog responses exclude drafts.
- [ ] Counts/latest chapter links reflect actual published records and classification changes reach catalog queries.

**Boundary:** Public listing connection P14; protected chapter content P15; notification emission P17. No giant all-domain schema migration.

**Likely implementation surface:** Catalog/classification/chapter API/contracts/migrations and admin queries.

### P13 — Text catalog and publishing

**Outcome:** Admins can persist and publish formatted text stories through the approved editor.

**Depends on:** P08, P10, P11, P12.

**Included scope:**

- Add text-story/chapter persistence and contracts, reusing catalog/classification/media conventions.
- Connect story/chapter CRUD, publication and authorized previews with the required metadata.
- Sanitize supported rich text on the server and retain bold/italic/headings/quotations through save/preview.
- Keep text content private to authorized reader/admin paths while exposing only appropriate public catalog metadata.

**Acceptance scenarios:**

- [ ] Admin can save/reopen/preview/publish a formatted chapter without image-page uploads.
- [ ] Unsafe markup and unauthorized writes/previews are rejected or safely sanitized.
- [ ] Published metadata is available for discovery; drafts/actual text do not leak into public payloads.

**Boundary:** Public text listing/details P14; protected reader P15; completion P16.

**Likely implementation surface:** Text-story/chapter API/contracts/migrations and rich-text editor connection.

### P14 — Live discovery and details

**Outcome:** Visitors can browse and search actual published illustrated works and text stories.

**Depends on:** P01, P02, P03, P12, P13.

**Included scope:**

- Connect Home, both lists, Search, Categories, cards/details and related works to real published catalog data.
- Implement agreed filter/sort/pagination URL behavior and Arabic/available English title search.
- Resolve simple featured/rating/view definitions before displaying real values; use optional-banner fallback and correct IDs/slugs/page metadata.
- Preserve independent loading/empty/error/retry and missing/unavailable states; personal data stays behind the existing account boundary.

**Acceptance scenarios:**

- [ ] All public discovery routes resolve actual records rather than substituting generic fixtures.
- [ ] Filters/search/page URLs round-trip correctly and latest-two chapter links are real.
- [ ] Displayed metadata/counts/ratings follow the resolved data rules; private/draft content is absent.

**Boundary:** Reader content P15, bookmarks/read personalization P16/P17, no voting or recommendation engine beyond agreed selection.

**Likely implementation surface:** Public catalog/search API queries, Home/Discover/text/details components.

### P15 — Protected readers and content delivery

**Outcome:** Signed-in users can read published image and text chapters while guests and blocked users cannot obtain their content.

**Depends on:** P02, P03, P10, P11, P12, P13, P14.

**Included scope:**

- Connect image manifests/order/dimensions and sanitized text content to both approved readers.
- Authorize page/API/file delivery server-side, including suspension, draft/availability and separate admin-preview rules.
- Choose image delivery compatible with current bearer/refresh sessions and browser loading; prevent direct-URL/serialized-payload/public-cache leaks without long-lived tokens in image queries.
- Preserve image placeholders/lazy loading/retries, full/single controls, text formatting/local preferences and ascending chapter navigation.

**Acceptance scenarios:**

- [ ] Signed-in readers work in all modes, including long chapters and independent image failures.
- [ ] Guest, blocked, wrong-work/chapter and unauthorized draft/direct-file requests cannot retrieve chapter content.
- [ ] Login-return restores the requested reader; navigation uses actual available chapters.

**Boundary:** Real completion/read markers/points P16 and real comments P18. Access is not achieved by merely hiding the page.

**Likely implementation surface:** Reader APIs, media authorization/delivery, existing reader routes/components.

### P16 — Reading completion and points

**Outcome:** Completed readings persist a Read marker, update the next shortcut and earn the correct advertising-cycle points.

**Depends on:** P15.

**Included scope:**

- Persist per-user Read state and each work's last completed chapter using the shared completion conditions.
- Accept one idempotent completion receipt per reading; support genuine new rereads while rejecting duplicate callbacks/retries and refresh-only rewards.
- Atomically update completion/last completed/configured points/ad eligibility; server owns reward amounts and balance.
- Update First/Next shortcuts and profile/read caches; define cycle/receipt identity so later ad confirmation cannot reset an unrelated cycle.

**Acceptance scenarios:**

- [ ] Default completions produce 3→6→9→12 and ad-due at >=10.
- [ ] Permanent Read remains on reread; a genuine reread earns again, while duplicate/concurrent signals for one reading do not.
- [ ] Next points to the actual following published chapter after the last completed record and disappears at the final available chapter.

**Boundary:** Provider requests/confirmed resets P23; configurable admin controls P22. No detailed panel/progress tracking.

**Likely implementation surface:** Completion/points contracts and transactions, readers, details and account caches.

### P17 — Bookmarks and chapter notifications

**Outcome:** Saved works persist and new published chapters notify the users who bookmarked them.

**Depends on:** P04, P05, P10, P12, P13.

**Included scope:**

- Persist account-owned bookmarks for both families with add/remove/count/list/pagination and deleted/unavailable handling.
- Connect detail toggles, profile previews and Bookmarks without a second Follow relation.
- Generate notices from actual publication transitions; publishing retries or edits must not duplicate the same chapter event.
- Persist unread/read/Mark All as Read, counts/destinations and ownership checks; clear personal caches on account change/logout.

**Acceptance scenarios:**

- [ ] Saved library state survives refresh and stays isolated between users.
- [ ] A newly published bookmarked chapter creates the correct non-duplicated notice; a draft does not.
- [ ] Popover updates/read actions and removed-destination handling work with real records.

**Boundary:** Profile assembly P20; generic announcement campaigns and a standalone notification page excluded.

**Likely implementation surface:** Bookmark/notification modules and publication events; library/popover queries.

### P18 — Comments and moderation

**Outcome:** Users can post/report comments and admins can moderate the published discussion.

**Depends on:** P05, P09, P10, P12, P13.

**Included scope:**

- Persist comments on correct work/story/chapter with signed-in validation, escaping/sanitization, pagination and rate limits.
- Publish immediately and persist report reasons/references without auto-hiding content.
- Connect admin comment search/delete/author block and report review/delete-comment/dismiss/close with server-side authorization.
- Enforce ownership/suspension and connect recent-comment destinations/deleted-content behavior.

**Acceptance scenarios:**

- [ ] Comments appear immediately; reports leave them visible until an admin action.
- [ ] Non-admin moderation and cross-account/invalid-target actions fail.
- [ ] Admin deletion/report closing/user blocking are reflected consistently in public and account views.

**Boundary:** Frame persistence P19; likes optional; no reply/thread or publication approval system.

**Likely implementation surface:** Comment/report/user-status APIs, moderation screens, shared comments.

### P19 — Frame gifts and appearance

**Outcome:** Admins can grant frames and users can select their available avatar/comment appearance.

**Depends on:** P04, P09, P11, P18.

**Included scope:**

- Persist frame type/name/asset/enabled/global state, individual/all-user grants and active selections.
- Connect admin upload/preview/enable/global/grant/revoke actions using P11; distinguish global availability from grants to current users.
- Enforce effective availability server-side, including No Frame and safe fallback when an active choice becomes unavailable.
- Connect settings/profile/header/comments; verify transparent PNG centers and adaptive comment boundaries, retaining permitted CSS substitutes until assets arrive.

**Acceptance scenarios:**

- [ ] An individual gift is selectable by its recipient; global availability follows its defined rule.
- [ ] Revocation/disable cannot leave an unavailable selection active; independent global entitlement is respected.
- [ ] Frames update across product surfaces and never obscure avatar/comment text/actions.

**Boundary:** No purchases, store, badges, or frame-authoring product; final dimensions are an input, not invented.

**Likely implementation surface:** Frame/grant/selection contracts, admin forms and shared appearance components.

### P20 — Live profile and account settings

**Outcome:** Users can view their real personal information and safely update account details.

**Depends on:** P04, P10, P11, P16, P17, P18, P19.

**Included scope:**

- Connect profile identity/avatar/points/bookmark summaries/recent comments/gifts and active frames.
- Connect name/phone/avatar changes; extend read-only email through a safe ownership/change-verification flow.
- Handle Google-only versus password-based Security states and preserve password/logout-all behavior.
- Keep private data account-scoped and refresh authoritative session/query state after changes.

**Acceptance scenarios:**

- [ ] Profile summaries and links match actual records rather than fixtures.
- [ ] Email updates preserve uniqueness/verified ownership/account identity; other accounts remain inaccessible.
- [ ] Avatar/name/security changes appear consistently without breaking the current session contract.

**Boundary:** Do not rebuild the bookmark/comment/frame domains or add analytics/account-synced reading preferences.

**Likely implementation surface:** Current-user contracts/API, account forms/profile aggregation and query caches.

### P21 — Support delivery and final policies

**Outcome:** Contact and issue forms reach the owner and policy pages describe the actual service.

**Depends on:** P06, P10.

**Included scope:**

- Select one simple submission delivery/storage mechanism; reuse existing email infrastructure if suitable.
- Connect validation/abuse controls and truthful success/error feedback with the real configured recipient.
- Replace placeholders with owner-reviewed Privacy/Terms/Copyright covering actual account/email/cookie/ad handling and analytics only if used.
- Fill actual Discord/social/contact/removal links and resolve publication ownership information.

**Acceptance scenarios:**

- [ ] Valid submissions are really delivered or recorded; failed delivery is not reported as success.
- [ ] Forms handle invalid/abusive submissions and do not expose credentials.
- [ ] Policy/contact pages contain final project-specific information and working destinations.

**Boundary:** No multi-stage ticket management; final ad-policy copy must be reconciled with P23 before release.

**Likely implementation surface:** Support API/delivery and shared informational pages.

### P22 — Live admin overview and settings

**Outcome:** Admins can inspect real basic platform activity and control reading/advertising settings.

**Depends on:** P09, P12, P13, P16, P18, P19.

**Included scope:**

- Connect simple totals/recent users/comments/chapters and user search/details/current points; reuse existing block/gift/moderation actions.
- Connect enabled advertising, points-per-reading, threshold and provider identifiers through validated Admin-only settings.
- Apply setting changes consistently without silently rescaling historic balances or resetting points.
- Keep view/completion/attempt/confirmed-display metrics distinct; show provider data unavailable until supported.

**Acceptance scenarios:**

- [ ] Overview counts and user records match the source data with correct access controls.
- [ ] Points/threshold settings affect subsequent calculations as defined; non-admin changes fail.
- [ ] No attempted ad is labeled confirmed/paid and unsupported statistics are not fabricated.

**Boundary:** Live provider execution P23; no advanced BI or revenue guarantees; do not rebuild earlier admin domains.

**Likely implementation surface:** Settings/overview queries, user admin and validated configuration storage.

### P23 — Conditional Monetag integration

**Outcome:** Eligible chapter transitions can display a permitted ad without obstructing continued reading.

**Depends on:** P15, P16, P22.

**Included scope:**

- Confirm account/format exclusions for gambling/betting/casino/adult-sexual/alcohol, controlled transition triggering and usable successful-display confirmation.
- Implement a small documented provider adapter separate from completion/points, using supported browser/user-gesture behavior.
- Reset only the correct cycle once after accepted confirmed display; requests/script loads/tab attempts are not proof.
- Allow reading and retain balance/ad-due on no-fill/error/blocked popunder/unknown confirmation; honor enabled/disabled state and avoid every-click retries.

**Acceptance scenarios:**

- [ ] No-due, due-confirmed, no-fill, error, blocked/unconfirmed and disabled cases produce the agreed outcomes.
- [ ] Duplicate/stale confirmations cannot reset an unrelated cycle; advertisers need not be clicked or converted.
- [ ] Live activation has evidence for required exclusions and capabilities; unsupported requirements remain an explicit unresolved dependency.

**Boundary:** No invented Monetag callbacks, custom countdown/ad page, mid-chapter interruption, required extra placements or Direct Ads manager. If incompatible, keep disabled and obtain a product/provider decision.

**Likely implementation surface:** Provider adapter, verified confirmation handling and reading transition integration.

### P24 — VPS release readiness

**Outcome:** The agreed MVP can run on the VPS with protected media, reliable deployment and demonstrated restoration.

**Depends on:** P01–P23; all required release decisions resolved.

**Included scope:**

- Run integrated real-data journey/regression checks and resolve gaps; per-feature testing must already be complete.
- Deploy Next/Express/PostgreSQL/persistent uploads through the chosen process or Compose setup, with Nginx/HTTPS/correct cookies/proxy/health/media permissions.
- Configure production credentials/callbacks/sender/URLs and safe migrations/rollback; reconcile policies with actual enabled ads and remove required runtime fixtures.
- Back up PostgreSQL/uploads to separate space using selected schedule/retention; demonstrate restore and record startup/deploy/backup/restore/rollback procedures.

**Acceptance scenarios:**

- [ ] Build/type/lint/unit/integration checks and browser/API access journeys pass with recorded results.
- [ ] HTTPS sign-in/reader/image/text/admin/support flows work on the VPS, including unauthorized and failure cases.
- [ ] Database plus uploads restore successfully together; release gaps are explicit. Disabled ads are not declared completed live monetization.

**Boundary:** Release verification/operations only; missing product features return to their owning phase. No infrastructure expansion or invented SLA/capacity commitments.

**Likely implementation surface:** Deployment/Nginx/environment/runbooks, existing test and build scripts.

## 5. Product detail reference

Read only the relevant subsections with a phase brief. These retain cross-feature agreements without expanding every phase into a large task list.

### 5.1 Public layout, cards and discovery

- Header: FURY logo/Home, Home/Categories/Manga List/text-story navigation, global search, notification popover and guest sign-in or account menu. Auth pages use the simplified logo/Back to Home header and shared footer.
- Footer: brand/description, genre/classification links, Home/list/text/Trending/Latest links, Contact/Privacy/Copyright/Terms/Report Issue, and supplied Discord/TikTok/Instagram/YouTube/Twitter links. Trending/Latest can use appropriate existing sections/listing states; no extra ranking engine is implied.
- Illustrated Work Card: cover, origin/language flag, applicable Colored/New badges, title, numeric/star rating and actual latest two published chapter links. Cover/title go to details. Total chapters/status are not extra mandatory illustrated-card fields.
- Text Story Card: cover/title/latest part or chapter/status; optional rating; no Colored badge.
- Home order: Hero, quick genres, Trending, Discord, Latest, Suggestions, footer. Hero represents a work using one image/optional banner with CSS overlays, title/badges/rating/stars/chapter count/views/description/dots and **one Details CTA**. No direct chapter or additional More CTA.
- Hero/Suggestions may use admin selection, relevant genres or simple rated selection; discussed hero set is three/four works. Exact ranking/rating input remains unresolved.
- Discord has invitation text and Join action only; no member/online/activity indicator.
- Home Load More **navigates** to the listing with Most Recently Updated, not append.
- Illustrated filters: multi-select genres/count; All/Ongoing/Completed/Hiatus; All/Manga/Manhwa/Manhua/Comic; Default/A–Z/Z–A/Most Recently Updated/Most Recently Added. Apply action, URL state, Previous/Next/current page and roughly five desktop columns where space permits. No country filter requirement.
- Search: current query in URL/input, action/count/result grid, Arabic/available English title matching, pre-search/loading/empty/error/populated states. Categories reuse the shared filtered listing, not another result engine.

### 5.2 Details and reader behavior

- Illustrated details: title/alternative names/genres, cover/optional banner fallback, full synopsis, Bookmark only, numeric/five-star presentation, status/type/publication date/author/artist/publisher/translator/last update/visits, similar works/comments. No follower action/count.
- Text details: cover/banner fallback, title/genres/description/author/status/publication/update dates, Bookmark/related stories/comments.
- First Chapter is available when content exists. Next Chapter appears only after a completed chapter has an actual following published chapter. Use the **last completed** record, not a fixed newest shortcut or assumed number+1. With no completion or final available completion, show First only; handle no-chapter works cleanly.
- Main chapter lists/selectors ascend. Main lists search number/title and show publication dates/Read markers with pagination or Load More for long lists. Dropdown Read checks are optional.
- Image reader: breadcrumb, work/chapter context and translated description; repeated top/bottom Details/chapter/mode/Previous Chapter/Next Chapter controls. Disable missing directions.
- Full mode displays stored-order images, reserves space, loads lazily/preloads nearby images and gives each image independent loading/error/retry. Eight reference images do not imply a fixed batch size.
- Single mode has within-chapter Previous/Next Page and Page X of Y, separate from chapter controls.
- Text reader: chapter heading, comfortable RTL width/paragraphs, available author/translator, bold/italic/headings/quotations rendered safely; font-size/line-height preferences may persist locally. No mandatory account synchronization.
- Comments follow lower navigation and precede the footer. Actual chapter images/text must be protected server-side, including direct delivery, serialized data, caches and drafts.

### 5.3 Completion, points and advertisements

| Event/state                                   | Required behavior                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Full-image completion                         | Last image loaded successfully and following end marker visible about two seconds. |
| Single-image completion                       | Loaded final image briefly visible or user proceeds after reaching it.             |
| Text completion                               | Marker after text visible about two seconds.                                       |
| Chapter opened/refreshed only                 | No completion reward.                                                              |
| First accepted completed reading              | Permanent Read marker, last completed chapter update, configured reward.           |
| New genuine completed reread                  | Reward again; permanent Read marker remains.                                       |
| Duplicate/retried signal for the same reading | No extra reward.                                                                   |
| Default points                                | +3 per completion; balances 3, 6, 9, 12; ad due when >=10.                         |
| No ad due                                     | Continue normally.                                                                 |
| Due ad                                        | Attempt supported format at a natural transition, preferably Next Chapter.         |
| Accepted successful-display confirmation      | Reset the correct cycle to 0 once.                                                 |
| No fill/error/blocked or unconfirmed display  | Continue reading, retain balance/ad-due state for a later suitable transition.     |
| Request/script load/tab attempt               | Not sufficient evidence for reset or a paid impression.                            |

Completion is a practical end-of-content signal, not proof every panel was read. Do not add panel tracking or detailed timers. Server owns balances/eligibility and idempotent receipt/cycle handling.

Monetag OnClick/Popunder/new tab is the conditional initial direction. Required exclusions: gambling, betting, casino, adult/sexual content **and alcohol**. Verify account/format exclusions, chapter-trigger control and acceptable confirmation; do not invent a callback or reuse a Google event assumption. No custom five-second gate/ad page, mid-chapter interruption or required advertiser click/conversion. Revenue numbers are not commitments. Extra placements are optional; Direct Ads management is deferred.

Provider evidence may be gathered early as a dependency note while mock work continues. It is not an extra phase or permission to enable ads. If support contact is needed, prepare the precise question; sending requires owner authorization. An unsupported provider remains disabled until the missing decision is resolved.

### 5.4 Accounts, community and appearance

- Registration: full name/email required, optional phone, password minimum 15 characters; no username or confirmation field. Login uses email/password/Remember Me/recovery link; Google sign-in remains required despite the advertising change.
- Reset/change password include confirmation; change requires current password for password-based accounts. Recovery stays neutral about account existence. Include resend/rate-limit, missing/invalid/expired link and blocked-account feedback.
- Profile: avatar/active frame/name/email/Settings, current points/bookmark count, saved previews/View All, recent comments with location links, gifts/frames and active choices. Joining date is optional. Reuse /dashboard; no duplicate profile route is required.
- Bookmarks: both families, count/removal/pagination or Load More, empty Explore action, loading/error. No Follow relationship.
- Settings: Account(name/email/optional phone/avatar/Save), Security, Avatar Frame, Comment Frame/Theme. Granted/global available choices only, previews/active state/No Frame.
- Comments: authenticated, immediate, one level; avatar/name/time/text/report with active avatar/comment frames. No replies/counts/thread notifications. Report reason/note does not hide content.
- Notifications: existing popover with unread count/indicator, Mark All as Read, relative times and destination links; main event is a new published chapter of a bookmarked work. No translation approval or standalone notifications page.
- Frames: final transparent PNG with empty center; avatar border must not obscure the photo, comment border must adapt without covering text/actions. Temporary CSS representations use the same grant/selection workflow.
- Admin frame availability: name/preview/upload, enable/disable, global, individual/all-user gifts and individual revocation. One active frame of each type or none. Define global availability versus grants consistently; no store/badges are required.

### 5.5 Administration and support

- Work editor: Arabic and available English title, slug/alternative names, synopsis, cover/optional banner, genres/tags, type/origin/status, author/artist/publication year/date, publisher/translator, featured/Home inclusion and availability.
- Illustrated chapter: parent/number/title/publication date/draft-or-published, ordered bulk-uploaded images, preview/removal/reordering/edit/delete with controlled internal filenames.
- Text story: title/description/cover/genres/status/author and public details data. Text chapter: number/title/formatted text/publication state; rich-text editor rather than image-page uploads.
- Classifications: genres add/edit/delete; tags and work associations.
- Users: search/list/details/points/granted frames/block-unblock/gifts. Comments/reports: search/referenced location/delete/author block/reason review/dismiss-close. No extra roles or approval queue.
- Overview: simple users/works/chapters/text-stories/comments/chapter-views totals and recent users/comments/chapters. Confirmed ad displays only where available; no fabricated earnings.
- Settings: enabled ads, points reward/threshold and selected provider identifiers. Provider-side exclusions are configured through supported provider controls/support, not fabricated Fury filtering switches.
- Privacy: title/update date and actual accounts/email/cookies/ads/analytics-if-used handling. Terms: use/account/comment/misuse/moderation. Copyright: ownership/removal instructions/contact details.
- Contact fields: name/email/subject/message. Issue fields: type, relevant page/work/chapter link, description, optional follow-up email. No multi-stage support-ticket product.

### 5.6 Storage, technical integrity and verification

Primary services and uploads stay on the VPS; no Cloudinary/S3/Supabase primary-storage dependency. Covers/banners/chapters/avatars/frames use organized directories separate from source/public builds and path/metadata database references. Optimize appropriate images on upload with Sharp/WebP and retain transparent PNG frames. Validate actual MIME, safe names/paths, chosen caps and non-executable storage; handle failed/replaced/referenced assets safely.

Keep public media caching distinct from authenticated chapter delivery. Nginx internal file delivery after authorization is one possible design, not a pre-existing capability. The existing bearer/refresh model must be accounted for when serving browser images; no long-lived tokens in image query strings.

Each feature owns relevant tests and review. Extend schema/OpenAPI exact-set tests intentionally, preserve auth invariants, and use meaningful ownership/role/draft/XSS/path/reread/concurrency checks where applicable. Existing route status smoke checks supplement browser/API access tests.

Use established pnpm lint, check-types and test commands as appropriate; database/integration changes also require relevant validation/generation and PostgreSQL/Testcontainers checks. Release runs production build/build-output validation and integrated journeys. Do not rerun destructive development reset commands against real data.

Deployment includes Nginx/HTTPS/cookies/proxy/health configuration, persistent files, safe migrations, process restart and actual credentials. Back up PostgreSQL plus uploads to separate space and test restoration together. Upload caps/quality, backup schedule/retention and deployment method are decisions to document, not invented numeric commitments.

## 6. Open decisions and inputs

| Decision/input                               | Owner phase                           | Rule until resolved                                                                    |
| -------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------- |
| Mandatory verification                       | P10                                   | Preserve current enforced behavior; clarify before changing it.                        |
| Ratings/selection and view counting          | P14, P22                              | No invented voting UI, fabricated values or unspecified ranking engine.                |
| Frame assets/dimensions                      | P19                                   | Permitted CSS substitutes; final PNG acceptance tracked separately.                    |
| Text-story public label                      | P03                                   | Anime remains text stories, not video.                                                 |
| Upload caps/quality                          | P11                                   | Choose and record before real uploads; no PRD numeric promise.                         |
| Email-change mechanics                       | P20                                   | Preserve verified ownership and identity; no blind email overwrite.                    |
| Support recipient/legal/social/domain data   | P06, P21, P24                         | Explicit mock placeholders until owner-provided/finalized.                             |
| Monetag exclusions/timing/confirmation       | P23; evidence can be gathered earlier | Ads disabled until required capabilities are verified or the product decision changes. |
| Google/email/VPS/ad credentials              | Respective live phase                 | Not prerequisites for mock UI.                                                         |
| Backup schedule/retention/process deployment | P24                                   | Decide before operating; no invented SLA/capacity/income/deadline.                     |

A genuinely blocked feature remains Blocked, with the missing decision recorded. Completed independent phases stay complete. Do not mark unsupported live ads Done merely because the UI and adapter stub exist.

## 7. Coverage and scope exclusions

| Product area                                         | Mock phase(s)                       | Live phase(s)               |
| ---------------------------------------------------- | ----------------------------------- | --------------------------- |
| Header/footer/cards/Home/discovery/search/categories | P01                                 | P14                         |
| Illustrated details/readers                          | P02                                 | P12, P14–P16                |
| Text list/details/reader/editor                      | P03, P08                            | P13–P16                     |
| Auth/profile/settings/avatar/library                 | P04                                 | P10, P17, P19–P20           |
| Comments/reports/notifications                       | P05                                 | P17–P18                     |
| Legal/contact/issues                                 | P06                                 | P21                         |
| Admin illustrated catalog/classifications/uploads    | P07                                 | P11–P12                     |
| Admin text publishing                                | P08                                 | P13                         |
| Admin users/moderation/frames/settings/overview      | P09                                 | P18–P19, P22                |
| Completion/read/reread/points                        | P02–P04                             | P16                         |
| Ad outcomes and configuration                        | P02–P03, P09                        | P16, P22–P23                |
| Storage/security/verification/VPS/restore            | Relevant mock failure/access states | Each owning live phase, P24 |

**Optional, not launch blockers:** comment likes, profile join date, text-story-card ratings, search type tabs, genre counts, chapter-dropdown Read checks, wide text mode, general notices and extra ad placements. Alternative-title search and Direct Ads are later possibilities.

**Excluded:** Follow, paid chapters/subscriptions/points, frame store, replies/nested comments, detailed reading percentages/panel tracking, AI/personalized recommendations, translator/contributor/moderator roles or translation approval, anime-video streaming, mobile app, standalone notifications page, required Direct Ads manager, external primary media storage, advanced BI/custom financial reporting.

## 8. Completion discipline

Mark a phase Done only when its acceptance scenarios and relevant checks pass, its feature artifacts agree with the implementation, and its required boundaries hold. Link the real spec path and record outstanding optional inputs separately.

No separate phase is needed merely for generating schemas, endpoints, tasks, components, screenshots or unit tests; those belong to the feature they enable. P24 validates and deploys completed features rather than absorbing unfinished product work.

**Next feature to specify: P01 — Public discovery UI.**

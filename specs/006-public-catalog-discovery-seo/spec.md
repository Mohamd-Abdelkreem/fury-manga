# Feature Specification: Public Catalog, Discovery, Work Details, and SEO

**Feature Branch**: Existing checkout branch 005-admin-chapter-publishing; no branch created.

**Created**: 2026-09-27

**Status**: Written requirements accepted and isolated synthetic-data P05 implementation authorized by the owner on 2026-09-27; dependency phase exits and release acceptance remain open.

**Input**: Roadmap phase P05 — Public Catalog, Discovery, Work Details, and SEO. Create exactly one specification and its requirements-quality checklist.

**PLAN.md Phase**: P05 — Public Catalog, Discovery, Work Details, and SEO

## Scope and Current Reality

- **Dependencies and accepted gates**: P05 depends on P03 persistent categories and works and P04 chapter publishing, built on P01 content rules and P02 media. Their capabilities are present in this checkout, and the owner accepted this feature's written requirements after human review on 2026-09-27. The dependency phases' independent exits remain open. The owner separately authorized isolated synthetic-data P05 implementation as an explicit development-only exception to the PLAN.md §10 dependency sequence; it does not accept real-data release, deployment, or any earlier phase exit.
- **Owned routes**: Public home (/), discovery (/discover), text stories (/stories), categories (/categories), work detail (/story/{slug}), and their public not-found/unavailable and SEO presentations.
- **Executable baseline**: Public reads already return eligible published work summaries, one work by immutable slug, and published chapter summaries beneath an eligible work. Their current output lacks the editorial details, cover, home sections, filters, categories directory, similar works, rating aggregate, and SEO data required here. Existing public visibility has database-backed tests. The owned web routes still render product fixtures; route metadata is static or fixture-derived, and no live sitemap or robots policy exists.
- **Behavior and user changes to preserve**: Keep the approved Arabic-first RTL dark visual language, home sections, catalog cards/filters, category directory, illustrated and text detail layouts, navbar search destination, public state patterns, responsive behavior, and stable authentication/session behavior. Keep immutable work slugs, existing admin publication decisions, and the reader access boundary.
- **Fixture, local-only, or placeholder sources affected**: Separate hero, trending, latest, suggestion, discovery, category, illustrated-detail, and text-story fixtures feed the public pages. Discovery and stories use different local filtering/pagination models. Detail bookmark/comment actions are local; ratings and engagement counts are fixtures. The community banner has invented membership/online claims and no maintained join destination. Advertising locations are present but disabled. None proves persistent catalog or engagement behavior.
- **Explicit exclusions**: P06 bookmarks, ratings creation/aggregation, library; P07 protected chapter content, opens/progress/resume and its seven-day trending source; P08 comments/moderation; P09 notifications; P10 gifts/appearance; P11 support/legal; P12 admin metrics; P13 ad provider/activation. No personalized recommendations, advanced editorial SEO fields, new authoring, hard deletion, or chapter-body delivery. Existing reader-route protection remains until P07.
- **Phase exit gate**: Every P05 route and SEO output uses the authoritative published catalog. A catalog URL reproduces its state on refresh. Discovery includes all supported work types; stories is a text-only restriction. Draft/archived/unready works and unpublished/unready chapters do not leak through content, recommendations, metadata, or sitemap. Empty home sections and indexing signals are truthful.

## User Scenarios & Testing

### User Story 1 - Find a published work (Priority: P1)

A visitor searches one published catalog, filters and pages it, shares the result URL, and can use stories as its text-only view.

**Why this priority**: Discovery is the main entry to real content and replaces two incompatible fixture catalogs.

**Independent Test**: Publish representative illustrated and text works, search/filter/page both routes, reload the URL, and compare results and selected controls.

**Acceptance Scenarios**:

1. **Given** eligible works of every supported type, **When** a visitor searches from the navbar or discovery, **Then** discovery returns matching works across those types with canonical work links.
2. **Given** a valid URL query, enabled category, type, story status, sort, and page, **When** the URL opens or reloads, **Then** controls and ordered results reflect that URL.
3. **Given** the same catalog, **When** stories opens, **Then** only novel and text-story works appear under compatible search/filter/sort/page behavior.
4. **Given** an invalid or repeated filter, disabled category, or out-of-range page, **When** the URL opens, **Then** the visitor receives a defined safe fallback or truthful empty page with a way back, without hidden-content disclosure.
5. **Given** zero published works or zero matches, **When** the list settles, **Then** catalog-empty and filtered-empty are distinguishable.

---

### User Story 2 - Browse the live home and categories (Priority: P1)

A visitor sees real featured works, enabled-category shortcuts, latest published chapters, and category-based suggestions.

**Why this priority**: These screens currently suggest editorial activity using fixed sample records.

**Independent Test**: Change published feature order, safely disable a category while each published work retains another enabled category, attempt to disable a published work's last enabled category, and change chapter publication; then revisit home/categories and verify the saved order, denial, sections, and links.

**Acceptance Scenarios**:

1. **Given** eligible administrator-featured works, **When** home loads, **Then** the hero follows saved feature order and links to the correct work; a read action appears only when that chapter destination can truthfully serve the identified chapter.
2. **Given** enabled and disabled categories, **When** home or categories loads, **Then** only enabled categories are offered, in saved order, and shortcuts open matching discovery filters.
3. **Given** more than three enabled categories with eligible works, **When** home loads, **Then** suggestion tabs use the first three in saved order that each contain eligible works, and each tab shows only distinct eligible works associated with its category.
4. **Given** newly published eligible chapters, **When** home loads, **Then** latest releases identify those chapters and parent works in stable newest-first order.
5. **Given** no eligible items for a section, **When** home loads, **Then** it is hidden or intentionally empty without sample covers or invented counts.
6. **Given** no authoritative chapter opens or maintained community URL, **When** home loads, **Then** it makes no trending, membership, online-count, or working-join claim.
7. **Given** a published work with two enabled categories, **When** an administrator disables one, **Then** that category disappears from public choices while the work remains eligible through the other. An attempt to disable its last enabled category is refused by the existing management rule and leaves public visibility unchanged.

---

### User Story 3 - Inspect a work and choose a chapter (Priority: P1)

A visitor opens one canonical work page to read saved details and published chapter summaries, then chooses the first or latest available chapter.

**Why this priority**: Current detail pages mix two fixture models and local-only engagement state.

**Independent Test**: Open one illustrated and one text work, compare details and chapters with saved state, then unpublish a chapter/work and revisit.

**Acceptance Scenarios**:

1. **Given** an eligible work, **When** its canonical slug opens, **Then** the page shows only approved public editorial fields, available imagery, enabled categories, and eligible chapter summaries.
2. **Given** eligible chapters, **When** first/latest is shown, **Then** it identifies the correct published chapter numbers under the work; a reading link is offered only when that destination can truthfully serve the identified chapter, otherwise reading is clearly deferred.
3. **Given** similar eligible works sharing enabled categories, **When** detail loads, **Then** it shows other published works without duplicates or itself.
4. **Given** an unknown slug or a work now draft, archived, or unready, **When** its URL opens, **Then** the visitor receives the same safe not-found result without private metadata.
5. **Given** a temporary read or cover failure, **When** detail loads, **Then** it offers an unavailable/error and retry path rather than fixtures, fabricated zeros, or a false confirmed absence.

---

### User Story 4 - Share and index public content (Priority: P2)

A visitor can share a published work URL while crawlers see metadata and inclusion rules that match public availability.

**Why this priority**: Search previews must not advertise private or unavailable work.

**Independent Test**: Inspect metadata, canonical/social preview, sitemap, and indexing signals before and after publication transitions.

**Acceptance Scenarios**:

1. **Given** an eligible work, **When** its page or preview is requested, **Then** title, description, canonical URL, and public cover describe that work.
2. **Given** a sitemap request, **When** it is generated, **Then** indexable public routes and eligible canonical works appear once each, while private/protected/hidden URLs do not.
3. **Given** filtered or paginated catalog URLs, **When** requested, **Then** they remain shareable and follow the declared query-indexing policy.
4. **Given** a work becomes nonpublic, **When** a new page, metadata, cover, sitemap, or related-result request occurs, **Then** its restricted details are absent.

---

### User Story 5 - Recover and navigate accessibly (Priority: P2)

A visitor understands loading, empty, failure, and retry states in Arabic RTL without needing an account.

**Why this priority**: Live content changes and requests fail; accessible recovery is part of browsing.

**Independent Test**: Exercise each owned route through loading, empty, failure, and renewed success using keyboard, a narrow viewport, and mixed-direction titles.

**Acceptance Scenarios**:

1. **Given** a slow or failed read, **When** a page loads or fails, **Then** it announces the correct state in Arabic and offers retry when recoverable without presenting fixtures as confirmed content.
2. **Given** a category or work becomes unavailable, **When** an old link is followed or retried, **Then** current public eligibility controls the result and safe discovery navigation remains available.
3. **Given** keyboard or narrow-screen use, **When** search, filters, carousel, pagination, and chapter links are used, **Then** focus, labels, reading order, and RTL layout remain usable.

### Edge Cases

- A published work can have zero eligible chapters; its detail remains available but makes no false first/latest claim.
- A work or chapter can become draft, archived, or unready when the authoritative cover asset state becomes unavailable. An administrator may disable one of several enabled categories on a published work; the work remains eligible through another. The existing management rule refuses disabling its last enabled category. If legacy or operationally inconsistent stored data nevertheless has no enabled category, public reads fail closed without changing administrative history. A byte-read failure while the saved cover asset is still marked available is a temporary image failure: the work remains publicly eligible, its image request fails safely, and the UI offers recovery rather than declaring the work absent.
- An enabled category with no eligible works leads to filtered-empty. Disabled categories are not public filter choices.
- Search text, repeated keys, unsupported values, combinations, and page numbers are bounded. Malformed inputs never broaden visibility or expose internal errors.
- Equal sort keys have a stable tie-breaker. Results do not duplicate within or across unchanged pages.
- An out-of-range page stays visibly empty with a return path or clearly redirects to a reflected valid page; it never silently shows another page under the old URL.
- Retry, duplicate reads, refresh, and crawler visits are read-only; no chapter open, rating, bookmark, or progress event results.
- An old response for another query/work never overwrites a newer one. Known stale data never overrides a later authoritative denial.
- Cover failure does not disclose storage identity or replace an unavailable work with invented imagery.

## Requirements

### Functional Requirements

- **FR-001**: Every P05 public work list, detail, home section, related result, metadata output, and cover MUST use the same eligibility rule: only published, ready works with an active cover reference to an asset authoritatively marked available and at least one enabled category appear. A temporary byte-read failure alone MUST NOT silently change that saved eligibility state.
- **FR-002**: Detail chapter summaries, first/latest actions, and latest releases MUST use the same chapter rule: only published, ready chapters beneath an eligible published work appear.
- **FR-003**: A work's existing unique immutable slug MUST identify its one canonical public URL. Chapter numbers MUST remain unique within a work, and chapter links MUST resolve under that work.
- **FR-004**: Discovery MUST search eligible works of all six supported types by title and available alternative title. Stories MUST restrict the same catalog to novel and text-story types.
- **FR-005**: Discovery and stories MUST represent search query, enabled category, work type, story status, sort, and page in shareable URLs. Search/filter changes MUST reset to page one while retaining compatible selections.
- **FR-006**: Public query values MUST be bounded, validated, and normalized consistently. Malformed, repeated, unsupported, and unsafe inputs MUST have a defined safe fallback or validation response without broadening visibility. A syntactically valid unknown or disabled category filter MUST remain selected and return a completed filtered-empty result, without disclosing whether the category exists.
- **FR-007**: Filtering, sorting, totals, and pagination MUST apply to the full eligible result set, with a bounded fixed page size and deterministic tie-breakers. Sort choices MUST include newest publication by default, most recently published eligible chapter, and title ascending/descending; works without an eligible chapter follow those with one in the chapter sort. An unchanged URL/catalog MUST reproduce the same page after refresh.
- **FR-008**: Catalogs MUST distinguish catalog-empty, filtered-empty, out-of-range page, loading, recoverable failure, and success. A failed read MUST NOT be called empty.
- **FR-009**: The home hero MUST use eligible administrator-featured works in saved order. It MUST link to the correct work and MUST NOT offer a read-now action unless the existing reader destination can truthfully serve that work's eligible chapter.
- **FR-010**: Home and category shortcuts MUST use saved enabled-category order. The directory MUST show enabled categories, allow name search, and link to the corresponding discovery filter.
- **FR-011**: Latest releases MUST use actual eligible newly published chapters, ordered by publication time with stable ties, and identify parent works. Chapter-less works MUST NOT appear as releases.
- **FR-012**: Home suggestion tabs MUST use the first three enabled categories in saved order that each contain eligible works. Each tab MUST show only distinct eligible works associated with that category; a work associated with multiple selected categories MAY appear in each corresponding tab. Similar works MUST share an enabled category with the current work, exclude that work, and contain no duplicates. Both selections MUST have deterministic order and MUST NOT be called personalized.
- **FR-013**: Seven-day trending MUST use only authoritative chapter-open events in the trailing seven days once that source exists. Until then or when no qualifying opens exist, it MUST make no popularity claim or fixture-based ranking.
- **FR-014**: Empty home sections MUST be hidden or truthfully explained; sample covers, synthetic activity counts, and broken view-all links MUST NOT appear as live content.
- **FR-015**: Eligible work detail MUST show saved public title, available alternative title, synopsis, author, optional artist, type, story status, publication information, enabled categories, tags when present, and available work imagery. Missing optional values MUST not be invented.
- **FR-016**: Work detail MUST list only eligible chapter summaries in bounded, stable chapter-number order and derive first/latest from the full eligible chapter set. It MUST identify those chapters without linking to fixture or mismatched reader content. Reading actions MUST be clearly deferred until the reader destination can serve the selected chapter. P05 MUST NOT deliver chapter bodies/pages or progress and MUST preserve existing reader access.
- **FR-017**: Bookmark, rating-input, and comment controls MUST be absent or clearly deferred. Aggregate ratings and engagement counts MAY appear only from an authoritative source; P05 MUST NOT synthesize scores, zeros, followers, or comments.
- **FR-018**: Unknown, draft, archived, or authoritatively unready works MUST have the same safe not-found outcome for direct page, public data, metadata, and cover access. A missing or corrupt byte read for an otherwise eligible cover MUST produce an unavailable image outcome while the work remains eligible; it MUST be distinguished from confirmed absence and allow recovery. Once the cover asset is authoritatively marked unavailable, new work and image reads MUST follow the nonpublic outcome.
- **FR-019**: Public cover/social imagery MUST be accessible only for a currently eligible work and MUST NOT expose private storage locations, administrative media data, or protected chapter images.
- **FR-020**: Community promotion MUST use an owner-maintained destination if configured. Otherwise the join action and unsupported member/online counts MUST be omitted. Opening a link MUST not imply confirmed membership.
- **FR-021**: P05 MUST preserve only existing structural home/catalog ad locations, with no provider content, activation/ad-block claim, or new placement.
- **FR-022**: Indexable public routes MUST have distinct Arabic-first titles/descriptions. Eligible work pages MUST have one canonical slug URL and work-specific social-preview title, description, and public cover when available.
- **FR-023**: The sitemap MUST include home, unfiltered discovery, stories, categories, and every currently eligible canonical work URL once. It MUST exclude hidden works, chapters/readers, account, admin, and private routes; new reads after publication changes MUST reflect eligibility.
- **FR-024**: Robots and page indexing signals MUST exclude private/protected routes and nonpublic work states. Filtered, searched, sorted, and paginated catalog variants MUST remain shareable but MUST not be separately indexed; their canonical target is the corresponding unfiltered catalog route.
- **FR-025**: Public reads MUST require no account and MUST NOT expose more data when a user is signed in. Active verified users see the same public projection. Moderators/admins obtain privileged details only through existing management authority. Suspended/ineligible accounts gain no protected reader access from P05.
- **FR-026**: Only existing authorized administrators may change publication, category enablement, or feature order through dependency behavior. P05 visitor controls and query input have no mutation authority; the site owner supplies community configuration operationally.
- **FR-027**: Public outputs, pages, previews, media, sitemap, and failure messages MUST omit hidden works, unpublished chapters, chapter bodies/pages, private accounts, internal media paths, credentials, secrets, and internal errors. Public search terms and malformed or unknown P05 URL content MUST NOT be retained in request logs or exposed in safe errors; request identity and non-sensitive route information MAY remain. Public content responses, including failure and rate-limit outcomes, MUST prevent shared-cache reuse of content after a visibility change.
- **FR-028**: Public retries, refreshes, duplicate requests, and crawler visits MUST be read-only. Concurrent publication/category/media changes MUST yield one coherent visibility decision per authoritative response. A newer work denial MUST take precedence over older in-flight success and cached work detail across navigation or remount; only a later matching authoritative success may restore that work. A newer chapter denial MUST invalidate stale chapter references and chapter-derived detail until a fresh work-detail read, without implying that the parent work is hidden.
- **FR-029**: Existing publication identity/history MUST be retained when visibility changes. Duplicate or retried P05 reads MUST not add publication history or business events. P05 MUST add no destructive deletion, alternate work slug, or duplicate content lifecycle.
- **FR-030**: Owned views MUST use approved Arabic-first RTL copy/layout, preserve original-language content direction, work at narrow/wide viewports, and provide semantic controls, keyboard/focus behavior, accessible names, status/error announcements, contrast, and reduced-motion support.
- **FR-031**: Owned views MUST give truthful loading, empty, filtered-empty, unavailable, not-found, retry, and success feedback. A new query/work identity MUST not display an old result as new confirmed data.
- **FR-032**: P05 MUST preserve existing authentication/session and protected-reader behavior. Public browsing MUST not require login, record reading activity, or weaken reader access.
- **FR-033**: After an owned route is connected to the published catalog, it MUST no longer use its former hero, trending, latest, suggestion, discovery, category, illustrated-detail, or text-story fixture collection as production content.

### Key Entities

- **Published work**: Existing unique identity and immutable slug with editorial details, type, story status, publication state, feature position, categories, and imagery. Public only while published and ready.
- **Category**: Existing unique identity and slug with display name, enabled state, and display order. Only enabled categories are public choices; they may have zero visible works.
- **Published chapter summary**: Existing identity, unique positive number within one work, title, type, and publication time. P05 exposes metadata only.
- **Catalog view**: Read-only eligible-work selection from route restriction plus URL query/filter/sort/page; deterministic for unchanged published data.
- **Chapter-open activity**: Later-phase authoritative source for seven-day trending; absent from this P05 baseline and never created by a P05 read.
- **Community destination**: Owner-maintained public link without fabricated membership/online state.

### Authority, Privacy, and State Truth

- **Actors and server authority**: Anonymous visitors and authenticated active/verified users browse the same public projection. The site owner supplies a maintained community destination. Existing ADMIN authority controls editorial publication and feature order; moderators receive no new P05 authority. Metadata/sitemap/crawler system processes obey visitor visibility. Reader content remains outside P05 and under the existing access boundary.
- **Sensitive data and public projection**: Only approved editorial fields and safe public work imagery cross the public boundary. Administrative history, account data, chapter content/media, storage identity, and secrets do not. Unknown and hidden works use the same safe not-found outcome.
- **State semantics**: New authoritative reads reflect current eligibility. Loading is not empty; retry is not success; prior data is not current after a newer denial. Duplicate reads are read-only. P05 adds no deletion or engagement write; existing administrative history persists.

## Acceptance Evidence

- **AE-001**: Automated catalog and real-data read checks cover all supported types, text-only restriction, search/filters, invalid values, deterministic sorting, pagination boundaries, empty states, and duplicate-free traversal (FR-001–FR-008).
- **AE-002**: Persisted-content checks cover feature/category order, safe category disablement with another enabled category, refusal of last-category disablement, chapter publication/readiness, latest releases, the accepted suggestion-tab rule, similar works, and absence of invented trends/engagement. Tests distinguish a failed cover byte read from a committed unavailable-asset state and check coherent new reads after each transition (FR-001, FR-009–FR-019).
- **AE-003**: Public requests through the actual application authority boundary prove anonymous/signed-in projection parity, safe hidden/unknown outcomes, absent private fields and protected media, absent search/malformed/unknown P05 URL values in logs and errors, no shared-cache reuse on success/failure/rate-limit responses, read-only retries, unchanged publication history and business-event counts, and unchanged reader protection (FR-018–FR-019, FR-025–FR-029, FR-032).
- **AE-004**: Automated output checks inspect canonical/social metadata, sitemap, robots, and query-indexing signals before and after publication transitions. Public cover access is checked without private media disclosure (FR-019, FR-022–FR-024, FR-027).
- **AE-005**: Focused UI and production-reference checks cover URL refresh/share, retained unknown-category filtered-empty state, loading/empty/error/retry/not-found, work denial across cache writes/remount and older in-flight success, chapter-denial invalidation without falsely hiding the work, later authoritative recovery, removal of local engagement actions and fixture imports, maintained community destination, and no active ad claim (FR-005–FR-008, FR-017, FR-020–FR-021, FR-028, FR-030–FR-031, FR-033).
- **AE-006**: The smallest real end-to-end browser journey publishes an illustrated and a text work with eligible chapters; an anonymous visitor opens home, searches discovery across types, filters and pages, refreshes the URL, opens each detail, verifies first/latest chapters are identified without opening fixture reader content, then an admin unpublishes one work and the visitor confirms its public page and SEO outputs no longer reveal it. Check Arabic RTL, keyboard focus, and narrow layout.
- **Unverified external/browser/device boundary**: This spec and local automation cannot establish production crawler behavior, search-engine indexing, deployment cache freshness, or physical-device usability. Those require separate evidence.

## Success Criteria

### Measurable Outcomes

- **SC-001**: In a representative dataset with all six supported work types, discovery returns every eligible matching type; stories returns only the two text types; zero ineligible works appear.
- **SC-002**: Every tested catalog query/filter/sort/page URL reproduces its selected state and ordered results after reload when the dataset is unchanged; a fixed traversal duplicates zero eligible works across pages.
- **SC-003**: After every tested publish, unpublish, archive, permitted category-disable, and committed media-asset unavailability transition, the next authoritative home/list/detail/chapter/similar/metadata/sitemap read agrees on visibility; hidden content appears in zero outputs. A permitted category disable removes that category from choices while a published work with another enabled category remains eligible; a refused last-category disable changes zero public results. A separate test of byte-read failure while the asset is still marked available keeps the work eligible and returns an unavailable image outcome without false absence or private storage detail.
- **SC-004**: Every zero-item home section is hidden or explicitly empty; zero fixture records, fabricated rating/open/member counts, or local-only engagement actions remain active on P05 routes.
- **SC-005**: Every eligible work has one canonical URL and work-specific metadata; the sitemap includes each eligible URL once and zero private/protected URLs; query variants follow the non-indexed canonical policy.
- **SC-006**: The one real browser journey in AE-006 completes for both work kinds with URL refresh, keyboard, Arabic RTL, narrow layout, and safe post-unpublication recovery; relevant positive, negative, privacy, validation, transition, and regression checks pass without weakening existing checks.

## Assumptions

- P03/P04 functionality exists locally and P05's written requirements are accepted. The owner's isolated synthetic-data exception permits P05 implementation while P03/P04 formal exit gates remain open; deployment-specific media restore, proxy/cache, and editorial checks remain separate release gates. Existing immutable slugs, publication states, enabled categories, feature order, and chapter readiness are authoritative.
- Under the owner's instruction to resolve outstanding P05 decisions, home suggestion tabs select the first three enabled categories in saved order with eligible works. Empty enabled categories remain valid directory choices but do not consume suggestion tabs.
- The six current work types are manga, manhwa, manhua, comics, novel, and text story. Stories means the latter two, not a separate content store or new short-story type.
- Until P06 ratings, P07 chapter opens, and P08 comments exist, P05 hides corresponding scores, trending ranking, and interaction controls rather than showing zero or sample values.
- Public cover delivery is limited to eligible work imagery; chapter imagery and body remain protected and outside P05.
- First/latest chapter choices remain visibly informational or deferred until P07 can truthfully deliver the selected content. P05 does not use existing fixture reader pages to simulate that delivery.
- Missing owner-maintained community URL removes the join action and unsupported counts. Final domain and URL are owner release inputs, not placeholders to publish now.
- The P05 indexing policy is canonical unfiltered public catalog pages plus eligible work pages; query variants are non-indexed, and protected/private routes are excluded.

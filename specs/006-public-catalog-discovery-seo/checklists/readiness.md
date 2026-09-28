# Requirements Readiness Checklist: P05 Public Catalog

**Purpose**: Reviewer-owned quality gate for the written P05 spec and plan; this checks requirements, not implementation.
**Created**: 2026-09-27
**Feature**: [spec.md](../spec.md) · [plan.md](../plan.md)
**Review status**: Accepted by the owner after completed human review on 2026-09-27; all items below reflect that disposition. The owner separately authorized isolated P05 development. P03/P04 formal exits and P05 implementation/release evidence remain separate.

## Scope, actors, and stories

- [x] CHK001 Are the five owned routes, public error/SEO surfaces, preserved Arabic RTL presentation, and exact fixture/local behaviors to replace consistently identified? [Completeness, Spec §Scope and Current Reality; PLAN P05]
- [x] CHK002 Are P03/P04 capability assumptions distinguished from their open formal exits, with the owner-authorized isolated P05 implementation gate and separate deployment checks stated precisely? [Dependency, Spec §Scope and Current Reality; Plan §Release Safety]
- [x] CHK003 Are P06 ratings/bookmarks, P07 readers/opens/trending, P08 comments, and P13 ad activation explicitly excluded wherever a P05 story could imply them? [Consistency, Spec FR-013, FR-016–017, FR-021; PLAN P05]
- [x] CHK004 Is the resolved first-three-populated-categories rule, including saved order and per-tab work identity, independently assessable and consistent across spec, contract, plan and tasks? [Consistency, Spec FR-012; Plan §Release Safety]
- [x] CHK005 Does each prioritized user story have an independent Given/When/Then outcome covering its normal path and a relevant empty, denial, failure, or recovery path? [Coverage, Spec §User Scenarios & Testing]
- [x] CHK006 Are visitor, signed-in user, ADMIN, site-owner configuration, crawler/system process, and absence of a P05 moderator grant distinguished without implying a nonexistent role? [Clarity, Spec §Authority, Privacy, and State Truth; FR-025–026]

## Authority, privacy, and failure boundaries

- [x] CHK007 Are anonymous and signed-in public projections, credential/CSRF expectations for public reads, and preservation of existing protected ADMIN/reader authority stated consistently? [Consistency, Spec FR-025–027, FR-032; Plan §Security, Privacy, Failure and Recovery]
- [x] CHK008 Are category, publication, and feature-order changes reserved to existing ADMIN authority while P05 controls remain read-only? [Completeness, Spec FR-026, FR-028]
- [x] CHK009 Is one public eligibility rule traceable across list, home, detail, related works, chapters, covers, metadata, and sitemap, including identical hidden/unknown outcomes? [Traceability, Spec FR-001–002, FR-018–019, FR-023, FR-027]
- [x] CHK010 Are private field, storage identity, chapter-body/image, credential, public search-term and malformed/unknown-URL log, and error-message exclusions explicit enough to assess every public output and failure response? [Completeness, Spec FR-019, FR-027; Constitution II]
- [x] CHK011 Are temporary API or media failure, confirmed absence, rate limiting, retry, and safe external/community URL outcomes distinguished without false success or private existence disclosure? [Coverage, Spec FR-018–020, FR-031; Plan §Security, Privacy, Failure and Recovery]
- [x] CHK012 Are search, pagination, sitemap, and image abuse boundaries described with measurable input/work limits and a safe outcome when a complete sitemap cannot be produced? [Gap, Spec FR-006–008, FR-023, FR-027; Plan §Contracts and HTTP Behavior]

## Catalog and interface contract clarity

- [x] CHK013 Are the six eligible work types, the two stories types, search fields, category/status intersections, and server-side text-only restriction unambiguous? [Clarity, Spec FR-004–005, SC-001]
- [x] CHK014 Does the spec choose a single visitor-visible outcome for invalid, repeated, unknown, and normalized URL values, consistent with the plan's web fallback and direct-interface validation? [Ambiguity, Spec FR-006 and Story 1 scenario 4; Plan §Contracts and HTTP Behavior]
- [x] CHK015 Are default and maximum page size/page number, all sort keys and unique tie-breakers, chapter-less ordering, totals, and out-of-range behavior consistent between spec and interface contract? [Consistency, Spec FR-007–008; Plan §Contracts and HTTP Behavior]
- [x] CHK016 Are catalog-empty, filtered-empty, disabled-category, and out-of-range states defined so no result count or message implies hidden content? [Coverage, Spec FR-008, FR-010, FR-018]
- [x] CHK017 Are public detail fields, enabled categories, optional fields, tags, cover/background availability, omission/null/empty meanings, and no invented values specified as a closed projection? [Completeness, Spec FR-015, FR-019, FR-027; Plan §Contracts and HTTP Behavior]
- [x] CHK018 Are successful data, binary image, not-found, validation, rate-limit, unavailable, and internal-failure statuses/codes and field-error paths consistent across the plan's contract and the spec's safe-failure rules? [Traceability, Spec FR-018–019, FR-027, FR-031; Plan §Contracts and HTTP Behavior]
- [x] CHK019 Is compatibility of the existing public metadata interface with the new catalog interface explicit for independently deployed consumers? [Completeness, Constitution III; Plan §Contracts and HTTP Behavior]
- [x] CHK020 Are hero, latest releases, category shortcuts, suggestions, and similar-work selection/order/deduplication rules specific enough to assess without consulting fixtures? [Clarity, Spec FR-009–014; Plan §Data Queries and Invariants]
- [x] CHK021 Are first/latest chapter identities, zero-chapter behavior, publication/readiness restrictions, and deferred reader destinations consistent across stories, requirements, and plan? [Consistency, Spec FR-002, FR-016 and Story 3]

## Identity, lifecycle, and concurrent truth

- [x] CHK022 Are immutable canonical work slugs, per-work chapter-number uniqueness, enabled category identity, and the effect of publication/category/media transitions stated without adding a parallel content lifecycle? [Completeness, Spec FR-001–003, FR-029]
- [x] CHK023 Are no-hard-deletion, retained publication history, read-only retries/duplicates, permitted category-disable and refused last-category-disable outcomes, and absence of P05 migration/write rollback requirements explicit and consistent with dependencies? [Clarity, Spec FR-026, FR-028–029; Plan §Data Queries and Invariants]
- [x] CHK024 Is the required visibility outcome clear for a publication change during a composite response, sitemap assembly, browser refresh, or older in-flight result? [Coverage, Spec FR-023, FR-028, FR-031; Plan §Data Queries and Invariants]
- [x] CHK025 Does the no-schema-change assumption have a stated review trigger and forward-only recovery requirement if a later query index proves necessary? [Assumption, Constitution V; Plan §Release Safety]

## Truthful UI, accessibility, and SEO

- [x] CHK026 Are fixture retirement, local engagement controls, absent ratings/trending/community counts, and reserved ad locations described consistently as truthful P05 states? [Consistency, Spec FR-013–014, FR-017, FR-020–021, FR-033]
- [x] CHK027 Are loading, catalog-empty, filtered-empty, pending retry, recoverable failure, denied/not-found, background refresh, stale completion, and recovery requirements distinguishable for each owned view? [Coverage, Spec FR-008, FR-018, FR-030–031]
- [x] CHK028 Are URL identity, public cache scope, cancellation/stale-result precedence, and preservation of a newer denial specific enough to prevent old data being described as current? [Clarity, Spec FR-005, FR-028, FR-031; Plan §Frontend and SEO Behavior]
- [x] CHK029 Are Arabic-first RTL copy, mixed-direction titles, responsive states, keyboard/focus order, accessible names, status announcements, contrast, and reduced motion specified for the affected controls and errors? [Completeness, Spec FR-030–031]
- [x] CHK030 Are indexable routes, query-variant canonical/noindex behavior, work-specific previews, hidden-work not-found metadata, sitemap freshness, and protected-route robots exclusions mutually consistent? [Consistency, Spec FR-022–024; Plan §Frontend and SEO Behavior]

## Acceptance and phase readiness

- [x] CHK031 Can each SC-001–SC-006 outcome be assessed with stated observable evidence without inventing traffic, latency, availability, or business targets? [Measurability, Spec §Success Criteria]
- [x] CHK032 Does the smallest real journey cover both work kinds, persisted publication, anonymous discovery/URL refresh/detail, unpublication privacy, and Arabic RTL keyboard/narrow-screen recovery without relying on later-phase reader content? [Coverage, Spec AE-006; Plan §Verification Matrix]
- [x] CHK033 Are the resolved P05 product decisions, remaining deployment-only visibility/cache risks, owner-authorized isolated implementation exception, open P03/P04 formal exits, and P05 reviewer acceptance separately labeled without treating a design pass as release approval? [Dependency, Assumption, Spec §Assumptions; Plan §Release Safety]

## Reviewer notes

Record findings against the cited requirement or section. Items flagged Gap, Ambiguity, Assumption, or Dependency deserve resolution before accepting the P05 requirements.

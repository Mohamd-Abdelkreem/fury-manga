# P05 Real Acceptance Journey

This is the smallest runnable end-to-end validation for the owner's 2026-09-27 P05 isolated-development exception. It uses real isolated PostgreSQL, saved synthetic media, existing ADMIN publication controls, the running Express API and Next web app. The owner accepted P05's written requirements/reviewer checklist and separately authorized local implementation while P03/P04 formal exits remain open. T001–T003 must first establish the correct feature, passing focused baseline and isolated database/media target. The home-suggestion rule is fixed in the P05 spec. This journey does not close dependency exits or deployment-specific release checks.

## Prerequisites

- Node.js 24, pnpm 11, a working Docker/Compose runtime for local PostgreSQL and Testcontainers, and a private writable media directory outside the checkout.
- An **isolated fresh or P04-remediated** database whose configured `DATABASE_URL` has been checked against the intended disposable local target before any migration command. Do not deploy the combined migration chain to unremediated populated content; follow `docs/operations/p04-chapter-upgrade.md` first. No production migration is authorized by this journey.
- `.env` and `apps/web/.env.local` created from their examples. Set `DATABASE_URL`, independent `AUTH_*_SECRET` values (at least 32 characters), `MEDIA_STORAGE_ROOT`, and `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`. P05 implementation must document/set validated `SERVER_API_URL=http://localhost:4000/api/v1` and `SITE_ORIGIN=http://localhost:3000`; `COMMUNITY_URL` may be unset. Never put credentials or private media paths into a public URL.
- An active verified ADMIN account. Use the existing optional `SEED_ADMIN_EMAIL`, `SEED_ADMIN_NAME`, and `SEED_ADMIN_PASSWORD` values with `pnpm db:seed`, or an existing authorized ADMIN. There are no default credentials. Use only synthetic licensed test cover/background/page media in this isolated environment.
- P03/P04 admin work/category/chapter and P02 media flows functional in this checkout. If they fail, record a dependency failure rather than substituting fixtures.

## Start the real stack

From the repository root in PowerShell:

```powershell
pnpm install --frozen-lockfile
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
if (-not (Test-Path apps/web/.env.local)) { Copy-Item apps/web/.env.example apps/web/.env.local }
```

Now set the prerequisite database, secret, media and P05 origin values in those files. Preserve existing local settings. Then run:

```powershell
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate:deploy
pnpm db:seed
pnpm dev
```

Use the README setup instructions for valid secrets and media root. `pnpm db:seed` creates an ADMIN only when its full optional seed group is configured. For a populated database, perform the P04 upgrade procedure before `pnpm db:migrate:deploy`. The expected local URLs are web `http://localhost:3000` and API `http://localhost:4000/api/v1`.

## One browser journey

1. Sign in as the active verified ADMIN. In `/admin/categories`, save three enabled categories with a known order and one disabled category. In `/admin/works`, create one illustrated work with the first enabled category and one text work with the second and third enabled categories, each with a distinct immutable slug, saved synopsis/author, a valid available cover and optional background. Feature the illustrated work. In their chapter admin routes, publish an eligible illustrated chapter and an eligible text chapter. Record the two slugs and chapter numbers; do not use fixture IDs.
2. In an anonymous browser session open `/`. The featured work, category shortcuts, latest chapter releases and category suggestions reflect saved state. Suggestion tabs select the first three enabled categories in saved order that contain eligible works, and each tab shows distinct eligible works belonging to that category. Disabled category, fake trending/rating/community counts and a live reader action are absent. If `COMMUNITY_URL` is unset, no join action appears. Structural ad slots make no provider claim.
3. Use navbar search and `/discover` to find both works; filter by category, type and story status, select each sort, then move to another page if representative records exist. Copy the full URL, reload and use browser back/forward. Controls, total and ordered results agree with the URL. A syntactically valid unknown or disabled category slug stays selected and shows a filtered-empty result. Open `/stories`; only novel/text-story work appears even with direct query changes. Use an invalid/repeated query and confirm the web reflects a safe normalized URL while direct API validation returns `400 VALIDATION_ERROR`; malformed percent encoding returns `400 BAD_REQUEST` without a raw URL or invented field path.
4. Open `/categories`; only enabled categories appear in saved order, with name search and matching discovery links. Open both `/story/{slug}` pages. Saved public details, image, eligible chapters and first/latest numbers match the ADMIN records. The numbers are informational until P07; they do not open the fixture reader. Bookmark, rating-input and comment actions are absent or clearly deferred. Check an unknown slug yields the same public not-found view as a withdrawn work.
5. Inspect page title/description, canonical, robots and Open Graph image for each work and for a filtered catalog URL. Inspect `/sitemap.xml` and `/robots.txt`: only the four indexable root routes and eligible work URLs are present; query variants are noindex with base-route canonical, and reader/admin/account URLs are excluded.
6. As ADMIN unpublish the illustrated work. Disable the text work's second category while its third category remains enabled: that category disappears from public choices, but fresh home, discovery, detail, cover and sitemap reads still include the text work. Attempt to disable its last enabled category; the existing management API refuses with `409 CONTENT_CATEGORY_IN_USE`, leaves the category enabled and changes no public result. Unpublish the text work, then disable its remaining category; fresh public reads now hide both unpublished works, with safe detail/cover 404 and no old sitemap entries. Re-enable the category and republish through existing ADMIN transitions, then confirm fresh public reads recover. In an isolated media test, keep a saved cover asset `AVAILABLE` while deliberately making its bytes unavailable: image returns safe 503, the work remains eligible in fresh detail/catalog reads, and the UI shows image unavailable/retry without a private storage path. Separately commit the asset `UNAVAILABLE` through existing reconciliation: fresh detail/image/catalog/sitemap reads hide that work. Verify restored bytes and saved `AVAILABLE` status through the existing authority, then confirm a later public read recovers.
7. Repeat the visitor path at a narrow viewport and with keyboard only. Check Arabic RTL reading order, visible focus, filter/pagination/carousel operation, error/retry focus, live status copy, and a mixed Arabic/Latin title. Use a social crawler user agent and inspect returned HTML after unpublication; no private title, description or image remains.

## Focused automated checks

Run after implementation, from the repository root:

```powershell
pnpm --filter @fury/contracts test
pnpm --filter @fury/api test
pnpm --filter @fury/api test:integration
pnpm --filter @fury/web test
pnpm test:web-routes
pnpm --filter @fury/contracts check-types
pnpm --filter @fury/api check-types
pnpm --filter @fury/web check-types
pnpm --filter @fury/api lint
pnpm --filter @fury/web lint
pnpm verify
```

The integration suite needs Testcontainers. `pnpm verify` is the final local implementation gate after contract, API and web changes settle; record actual results, warnings and any unverified physical-device/CDN behavior. Inspect existing and new public content JSON/image responses through Express: success, validation/404/503 and limiter 429 must retain `Cache-Control: no-store`; list JSON includes matching top-level `paginationMeta`. Check a deployed proxy/CDN separately at release if one is not present locally. Use sentinel public search text, malformed URL and unknown P05 path values to confirm request logs and safe errors retain none of them. Repeat public GETs and confirm persisted publication history/business-event counts do not change. Failure checks are: hidden work in any public/SEO response, cookie/bearer on a public read, 401 login redirect for anonymous browsing, image path or asset ID leak, stale fixture data, false empty on server failure, URL state lost on refresh, or any regression in existing ADMIN/auth/reader protection. Do not mark local implementation complete while any of these occurs; do not mark P05 released while formal dependency and deployment gates remain open.

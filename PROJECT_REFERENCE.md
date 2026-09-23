# Project reference

This is the implemented architecture and operations reference for the
authentication foundation and P01 content-domain boundary.

## Boundaries

```text
Next.js UI
  -> @fury/contracts
  -> Axios API client
  -> Express routes / middleware / controllers / services
  -> Prisma
  -> PostgreSQL
```

- `@fury/contracts` owns account/content request and output schemas, canonical
  content enums, structured text, field errors, pagination, and envelopes.
- `@fury/database` owns Prisma schema, migrations, generated types, seed
  behavior, and the client factory.
- `@fury/api` owns HTTP security, account rules, delivery adapters, and
  persistence orchestration.
- `@fury/web` imports contracts but no API/database implementation.

All packages use ESM and emitted `.js` relative imports. TypeScript strictness
and exact optional property checking stay enabled.

## Web

`src/services/api/api-client.ts` is the only transport. It uses Axios with a
validated, trailing-slash-normalized base URL and `withCredentials: true`.
Access-token and refresh-promise state are discriminated module-memory values;
no token is written to local/session storage.

Request interception adds:

- `Authorization: Bearer ...` when memory contains a token
- `x-csrf-token` from the readable cookie for POST/PUT/PATCH/DELETE only

Response interception classifies exact public auth paths, coalesces concurrent
refresh, marks replayed requests with `_furyRetried`, and replays once.
Only exact refresh `400/BAD_REQUEST` and `401/UNAUTHORIZED` failures clear
memory and perform a safe full navigation without credential-bearing return
parameters. Network, CSRF, rate-limit, and server refresh failures remain
visible, and replay failures are reported separately from refresh failures.

`src/app/providers.tsx` contains only `QueryClientProvider`.
`AUTH_SESSION_QUERY_KEY` is the sole session cache. A missing access token
attempts refresh; only `400/BAD_REQUEST` and `401/UNAUTHORIZED` refresh
responses mean anonymous. Only those exact code/status pairs from the
current-user request are also normalized to anonymous after clearing the
in-memory token; unexpected `400`/`401` codes remain errors. Other failures are
rendered with retry and request ID. Logout and logout-all clear local session
state only after confirmed server success; failures stay visible and retryable,
and logout-all does not claim other-device revocation after a failure.

Pure guest/protected route-state functions cover pending, error, redirecting,
and authorized states. Protected accounts must be active, email-verified, and
match any requested generic `USER`/`ADMIN` role.

## API

`createApp` is the composition boundary. It constructs the selected
`EmailDelivery`, then `EmailService`; the router constructs
`AuthService(database, emailService)`, controllers, and authentication
middleware. Authentication modules do not import provider clients or
singletons.

Security infrastructure is in `src/infrastructure/security`:

- `password-hasher.ts`: Argon2id hash/verify
- `token-hasher.ts`: SHA-256 token fingerprint
- `jwt.service.ts`: issue/verify purpose-bound access, refresh, verification,
  and reset JWTs

Auth DTOs use file-per-DTO modules. Auth rate-limit configuration is separate
from CSRF configuration. All API password DTOs use the fixed 15-to-128-character
schemas from `@fury/contracts`; there is no API environment override. Role
authorization is a generic allowlist middleware.

Email verification consumes the normalized email, pending status, null
verification timestamp, token hash, and unexpired credential in one conditional
transaction. Exactly one concurrent request succeeds; reused tokens and tokens
replaced by resend fail, and the final response uses the safe-user projection.

Request validation uses `safeParseAsync`, aggregates body/query/params failures
with target-prefixed field paths, and stores parsed data on `req.validated`.
Only that boundary converts schema failures into operational 400 responses;
Zod errors raised by internal response or application schemas remain 500-class
server bugs.

The response helper uses `@fury/contracts` types directly. Success always
has `data`; valid nested pagination is promoted to `paginationMeta`. Error
envelopes never contain `data: null`.

The Prisma mapper exposes stable generic account errors and allowlisted content
conflicts for named uniqueness, immutability, representation, and publication
constraints. Raw messages, SQL, constraint metadata, database URLs, and provider
secrets are never returned.

Request logging sanitizes credential values in `req.url`,
`req.originalUrl`, and query objects while retaining non-sensitive query
parameters. Header/body redaction continues to cover authorization, cookies,
the `x-csrf-token` header, passwords, tokens, SMTP/Resend credentials, database
URLs, and API keys. Email provider failure logs omit raw provider messages.
Tests exercise serialized Pino output and assert that credential fields contain
the redaction marker rather than their original values.

The development-only console email provider writes complete HTML previews to
the workspace-root, Git-ignored `.local-emails` directory, requesting owner-only
filesystem modes where supported, and logs only each preview path. Open the
newest `.html` file and click its verification or reset button. A failed
registration delivery triggers a guarded compensating delete of the newly
created pending user so the address can retry.

## Content module

`src/modules/content` owns feature-local rules, bounded queries, explicit
administrative/public mappers, a management service, a public read service,
thin controllers, and route wiring. `src/router.ts` constructs those owners with
the injected Prisma client. No browser/API implementation import or generic
repository crosses package boundaries.

The 19 operations documented in OpenAPI are:

- public `GET`: `/content/works`, `/content/works/{workSlug}`,
  `/content/works/{workSlug}/chapters`, and
  `/content/works/{workSlug}/chapters/{chapterNumber}`;
- ADMIN Category: list/create at `/content/admin/categories` and read/update at
  `/content/admin/categories/{categoryId}`;
- ADMIN Work: list/create at `/content/admin/works`, read/update at
  `/content/admin/works/{workId}`, category replacement at
  `/content/admin/works/{workId}/categories`, and publication at
  `/content/admin/works/{workId}/publication`;
- ADMIN Chapter: list/create at `/content/admin/works/{workId}/chapters`,
  read/update at `/content/admin/works/{workId}/chapters/{chapterId}`, and
  publication at
  `/content/admin/works/{workId}/chapters/{chapterId}/publication`.

Public operations use shared validation and no auth/CSRF middleware. ADMIN
operations authenticate an active verified account and authorize `ADMIN` before
lookup; unsafe operations then enforce CSRF before shared validation. All routes
remain behind global request IDs, safe logging/errors, and rate limiting.

Shared content schemas normalize bounded titles/display names/slugs; cap list
limits at 100 and chapter/page integers at PostgreSQL `INTEGER` maximum; and
define canonical `comics`/`text-story` values. Structured text is a strict
version-1 document with at most 500 blocks, 200 inline nodes or list items,
4,000 characters per leaf, 2,048 characters per root-relative link, and 512 KiB
of serialized UTF-8 JSON. Raw HTML, quote/image/embed/script nodes, external or
protocol-relative links, controls, unknown fields, and malformed nesting fail
validation.

Mutable content aggregates use integer expected-version compare-and-set writes.
Relationship/page replacements and publication transitions are transactional.
Every real transition to published appends one immutable publication event and
links it as the aggregate's current event; unpublish/archive clears only current
publication fields. Same-state retries reuse authoritative state, stale losers
cannot overwrite the winner, and failed dependent writes roll back fully.

`20260922010000_content_domain_foundation` is a forward-only additive migration
after `20260818000000_init_authentication`. Existing web content fixtures are
not migrated or seeded. Application rollback may ignore the additive tables;
schema correction requires a later forward migration or verified backup restore,
not editing applied history.

## Generic utilities

- `core/pagination`: decimal-digit-only query parsing, defaults, maximum
  limit, safe integer checks, skip/take, and contract pagination metadata
- `core/date-only.ts`: real `YYYY-MM-DD` calendar validation and UTC-safe
  parsing/serialization
- `core/serialization/decimal.ts`: canonical Decimal strings without
  two-decimal money rounding; deep handling for arrays/plain objects while
  preserving Date, nullish, primitives, and unrelated class instances

## Local and production HTTP topology

Local values use only `localhost`:

```dotenv
CORS_ORIGINS=http://localhost:3000
WEB_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
AUTH_COOKIE_SAME_SITE=lax
```

HTTP integration tests prove the exact allowed CORS origin, credentials,
preflight including requested authorization/content-type/CSRF headers, rejected
origins, refresh/CSRF cookies, missing/mismatched CSRF, missing refresh cookie,
request IDs, and real auth/profile/recovery flows.

Production uses the same origin with `/api/v1` routed to Express. Cookie
domain remains omitted. Unrelated registrable domains require a different
architecture and are intentionally unsupported.

The root Compose file provisions PostgreSQL only. The Caddyfile is a routing
template for separately deployed `api` and `web` services, not a complete or
verified one-command production stack.

## Tests

Unit suites cover contracts, transport/error parsing, single-flight refresh,
query retry policy (network and 500-504, at most twice), session restoration,
route guards, safe return paths/forms, security services, authorization, CSRF,
cookie options, delivery injection/failure propagation, logger sanitization,
Prisma mapping, seed behavior, and generic utilities.

Contracts production builds exclude test/spec TypeScript and TSX sources. The
root build-output assertion verifies required entry artifacts and rejects any
emitted test/spec JavaScript, declaration, or source-map artifact.

Database integration starts PostgreSQL 18, deploys the real migration chain,
tests account and content constraints with direct SQL, validates upgrade/schema
inventory and reconnect persistence, and deploys a second time.

API integration starts another disposable PostgreSQL 18 instance, deploys the
real migration, builds the actual Express app with fake email delivery, and
uses Supertest agents for cookies. Independent tests cover CORS, validation,
register/verify/login, safe JSON, refresh rotation/replay, CSRF failures,
users/me/profile, current-session logout, logout-all, password change, neutral
forgot-password, reset single-use, session revocation, and new-password login.
Verification coverage also proves that concurrent service and HTTP requests
produce exactly one success, reused/replaced tokens fail, and suspended users
remain suspended.

Content integration additionally uses the real Express middleware stack and
PostgreSQL for ADMIN authority/CSRF, strict contracts, duplicate and stale
outcomes, transaction rollback, concurrent publication, hidden-state privacy,
allowlisted public metadata, and the registration-to-public text-story journey.
The web contribution is type-only: admin Work and lowercase role types derive
from `@fury/contracts`; rendered fixtures, Arabic labels, controls, routes, and
mock actions remain unchanged and non-authoritative.

Logout, logout-all, password change, and password reset revoke refresh records,
not already-issued stateless access JWTs. An access JWT can therefore remain
usable until its short configured expiry (15 minutes by default); no blacklist
or other immediate-revocation store is included.

## Extension rules

1. Add cross-package contracts only when API and web both consume them.
2. Add each new migration after the latest released migration; do not rewrite
   applied production history.
3. Keep route/controller/service responsibilities within one API module.
4. Inject external services from the composition boundary.
5. Authorize close to protected data; browser guards are not security.
6. Add OpenAPI and tests with each endpoint.
7. Never store refresh tokens in JavaScript storage, expose Prisma users, log
   credentials or production links, or add domain-specific defaults to the
   template. Local console action links belong only in ignored preview files.

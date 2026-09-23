# P01 Content HTTP Contract

**Base prefix**: existing configured `/api/v1`  
**Module prefix**: `/content`  
**Envelope**: existing strict `SuccessEnvelope<T>` / `ErrorEnvelope` from
`@fury/contracts`  
**Normative schema owner**: `packages/contracts/src/content/content.schema.ts`

This artifact fixes method, path, authority, input, projection, success status, and
stable error families. Runtime validation, OpenAPI, API DTO aliases, web imports, and
tests must use the same exported Zod schemas rather than transcribe these shapes.

## Middleware and Transport

Global `createApp` middleware remains:

```text
requestId -> requestLogger -> Helmet -> CORS -> cookieParser -> compression
-> bounded JSON/urlencoded parsing -> global API rate limit -> module routes
-> notFound -> errorHandler
```

Within P01 routes:

```text
public GET:
  shared params/query validation -> controller

admin GET:
  authentication(active + verified) -> authorize ADMIN
  -> shared params/query validation -> controller

admin POST/PATCH/PUT:
  authentication(active + verified) -> authorize ADMIN -> CSRF
  -> shared body/params/query validation -> controller
```

Public routes require no credential, ignore ambient bearer/cookies for authority, do
not require CSRF, and return the same result to visitors and signed-in users. Every
route remains covered by the existing global API rate limit.

## Operation Inventory

### Credential-free public metadata (4)

| Method/path                                            | Input                               | 200 data                     | Other stable outcomes                                         |
| ------------------------------------------------------ | ----------------------------------- | ---------------------------- | ------------------------------------------------------------- |
| `GET /content/works`                                   | Pagination query                    | `PublicWorkListData`         | 400 validation, 429, 500/503                                  |
| `GET /content/works/:workSlug`                         | Work slug params                    | `{ work: PublicWork }`       | 400, 404 for missing/draft/archived, 429, 500/503             |
| `GET /content/works/:workSlug/chapters`                | Work slug params + pagination       | `PublicChapterListData`      | 400, 404 when parent missing/ineligible, 429, 500/503         |
| `GET /content/works/:workSlug/chapters/:chapterNumber` | Work slug + positive integer number | `{ chapter: PublicChapter }` | 400, 404 for missing/ineligible parent or child, 429, 500/503 |

### Active, verified ADMIN management (15)

| Method/path                                                        | Input                              | Success                     | Other stable outcomes                                                     |
| ------------------------------------------------------------------ | ---------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| `GET /content/admin/categories`                                    | Pagination                         | 200 `AdminCategoryListData` | 400/401/403/429/500/503                                                   |
| `POST /content/admin/categories`                                   | `CreateCategoryBody`               | 201 `{ category }`          | 400/401/403/409 CONTENT_CONFLICT/429/500/503                              |
| `GET /content/admin/categories/:categoryId`                        | UUID params                        | 200 `{ category }`          | 400/401/403/404/429/500/503                                               |
| `PATCH /content/admin/categories/:categoryId`                      | UUID + `UpdateCategoryBody`        | 200 `{ category }`          | 400/401/403/404/409 CONTENT_IMMUTABLE or CONTENT_STALE_WRITE/429/500/503  |
| `GET /content/admin/works`                                         | Pagination                         | 200 `AdminWorkListData`     | 400/401/403/429/500/503                                                   |
| `POST /content/admin/works`                                        | `CreateWorkBody`                   | 201 `{ work }`              | 400/401/403/409 CONTENT_CONFLICT/429/500/503                              |
| `GET /content/admin/works/:workId`                                 | UUID params                        | 200 `{ work }`              | 400/401/403/404/429/500/503                                               |
| `PATCH /content/admin/works/:workId`                               | UUID + `UpdateWorkBody`            | 200 `{ work }`              | 400/401/403/404/409 CONTENT_IMMUTABLE or CONTENT_STALE_WRITE/429/500/503  |
| `PUT /content/admin/works/:workId/categories`                      | UUID + `ReplaceWorkCategoriesBody` | 200 `{ work }`              | 400/401/403/404/409 CONTENT_STALE_WRITE/429/500/503                       |
| `GET /content/admin/works/:workId/chapters`                        | UUID + pagination                  | 200 `AdminChapterListData`  | 400/401/403/404/429/500/503                                               |
| `POST /content/admin/works/:workId/chapters`                       | UUID + `CreateChapterBody`         | 201 `{ chapter }`           | 400/401/403/404/409 CONTENT_CONFLICT or CONTENT_TYPE_CONFLICT/429/500/503 |
| `GET /content/admin/works/:workId/chapters/:chapterId`             | two UUID params                    | 200 `{ chapter }`           | 400/401/403/404/429/500/503                                               |
| `PATCH /content/admin/works/:workId/chapters/:chapterId`           | UUIDs + `UpdateChapterBody`        | 200 `{ chapter }`           | 400/401/403/404/409 conflict/type/stale/429/500/503                       |
| `PUT /content/admin/works/:workId/publication`                     | UUID + `PublicationCommandBody`    | 200 `{ transition }`        | 400/401/403/404/409 transition/stale/429/500/503                          |
| `PUT /content/admin/works/:workId/chapters/:chapterId/publication` | UUIDs + `PublicationCommandBody`   | 200 `{ transition }`        | 400/401/403/404/409 transition/stale/429/500/503                          |

Unsafe operations require a valid bearer token and the established readable-cookie/
header double-submit CSRF token. Authentication and role denial happen before resource
lookup. A valid ADMIN gets 404 for a missing management target.

## Shared Primitive Schemas

### IDs, timestamps, and pagination

- IDs are UUID strings.
- Timestamps are ISO date-time strings with offsets.
- `version`/`expectedVersion` are non-negative integers.
- `page` and `limit` use the existing decimal-only defaults 1 and 25, maximum limit
  100, and safe-integer skip rule.
- List data is:

```ts
type ListData<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
```

The success envelope repeats valid nested `data.pagination` as its established
top-level `paginationMeta`. An overrun page returns `items: []` and truthful metadata.

### Canonical enums

```ts
type WorkType =
  "manga" | "manhwa" | "manhua" | "comics" | "novel" | "text-story";

type StoryStatus = "ongoing" | "completed" | "hiatus" | "cancelled";
type PublicationStatus = "draft" | "published" | "archived";
type ChapterContentType = "illustrated" | "text";
```

### Structured text

```ts
type StructuredTextInline = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  href?: string; // safe, root-relative application path only
};

type StructuredTextBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; content: StructuredTextInline[] }
  | { type: "list"; ordered: boolean; items: string[] };

type StructuredTextDocument = {
  version: 1;
  blocks: StructuredTextBlock[];
};
```

All objects are strict. Bounds and safe-link rules are normative in
[../plan.md](../plan.md#structured-text-representation) and the shared Zod schema.

## Request Schemas

All body objects are strict; unsupported fields fail `VALIDATION_ERROR` with
`body.<field>` paths.

```ts
type CreateCategoryBody = {
  displayName: string; // normalized, nonblank, <= 100 chars
  slug: string; // normalized ASCII slug, <= 120 chars
};

type UpdateCategoryBody = {
  expectedVersion: number;
  displayName?: string;
  slug?: string; // accepted only to return CONTENT_IMMUTABLE if changed
}; // requires displayName or slug

type CreateWorkBody = {
  title: string; // normalized, nonblank, <= 200 chars
  slug: string;
  type: WorkType;
  storyStatus: StoryStatus;
}; // server assigns draft/version 0

type UpdateWorkBody = {
  expectedVersion: number;
  title?: string;
  storyStatus?: StoryStatus;
  slug?: string; // accepted only to return CONTENT_IMMUTABLE if changed
  type?: WorkType; // accepted only to return CONTENT_IMMUTABLE if changed
}; // requires title, storyStatus, slug, or type

type ReplaceWorkCategoriesBody = {
  expectedVersion: number;
  categoryIds: string[]; // UUIDs, unique, maximum 100; empty clears relations
};

type CreateChapterBody = {
  number: number;
  textContent?: StructuredTextDocument;
  pages?: Array<{ position: number }>; // unique, 1..500 entries
};

type UpdateChapterBody = {
  expectedVersion: number;
  number?: number;
  textContent?: StructuredTextDocument;
  pages?: Array<{ position: number }>;
}; // requires one mutable field

type PublicationCommandBody = {
  expectedVersion: number;
  targetState: PublicationStatus;
};
```

For a text Work, `textContent` is required on Chapter create and `pages` is rejected.
For an illustrated Work, omitting `pages` creates an empty draft; when `pages` is
present it must contain 1â€“500 unique positive positions, so an empty array is invalid.
`textContent` is rejected. Chapter update accepts only the representation matching
the already-derived type, and any submitted illustrated replacement is non-empty. An
illustrated Chapter with zero pages cannot transition to published and receives
`409 CONTENT_TRANSITION_CONFLICT` without an event or state change. `contentType` is
never a request field.

## Response Projections

### Public allowlists

```ts
type PublicCategory = {
  id: string;
  displayName: string;
  slug: string;
};

type PublicWork = {
  id: string;
  title: string;
  slug: string;
  type: WorkType;
  storyStatus: StoryStatus;
  publishedAt: string;
  categories: PublicCategory[]; // displayName ASC, id ASC
};

type PublicChapter = {
  id: string;
  workId: string;
  number: number;
  contentType: ChapterContentType;
  publishedAt: string;
};
```

Public Work lists use `publishedAt DESC, id ASC`. Public Chapter lists use
`number ASC, id ASC`. They never include publication state/version/history, text
content, page metadata, timestamps other than current publication, raw records, account
data, media/storage/provider values, or internal metadata.

### Administrative allowlists

```ts
type AdminCategory = {
  id: string;
  displayName: string;
  slug: string;
  version: number;
  createdAt: string;
  updatedAt: string;
};

type AdminWork = {
  id: string;
  title: string;
  slug: string;
  type: WorkType;
  storyStatus: StoryStatus;
  publicationStatus: PublicationStatus;
  publishedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  categories: AdminCategory[];
};

type AdminChapterPage = {
  id: string;
  position: number;
};

type AdminChapter = {
  id: string;
  workId: string;
  number: number;
  contentType: ChapterContentType;
  publicationStatus: PublicationStatus;
  publishedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  textContent: StructuredTextDocument | null;
  pages: AdminChapterPage[]; // position ASC, id ASC
};

type PublicationTransition = {
  resourceType: "work" | "chapter";
  resourceId: string;
  publicationStatus: PublicationStatus;
  publishedAt: string | null;
  publicationEventId: string | null;
  version: number;
  transitioned: boolean;
};
```

For text Chapters, `pages` is an empty array and `textContent` is non-null. For
illustrated Chapters, `pages` contains metadata and `textContent` is null. Admin
outputs still omit raw foreign-key bookkeeping, full history rows, account fields,
database metadata, and anything related to media/provider storage.

## Error Contract and Privacy

All failures use the existing strict `ErrorEnvelope` with request ID and no `data`.
Responses contain no stack or raw server diagnostics in any environment.

| Code                        | Status | Observable rule                                                                  |
| --------------------------- | -----: | -------------------------------------------------------------------------------- |
| VALIDATION_ERROR            |    400 | Field errors use `body.*`, `params.*`, or `query.*` paths                        |
| BAD_REQUEST                 |    400 | Parsed pagination would require unsafe database arithmetic                       |
| UNAUTHORIZED                |    401 | Missing/invalid/stale/suspended/unverified auth; occurs before management lookup |
| FORBIDDEN                   |    403 | Active verified non-admin or CSRF; target existence is not disclosed             |
| NOT_FOUND                   |    404 | ADMIN missing target; public missing/draft/archived share this exact code/status |
| CONTENT_CONFLICT            |    409 | Duplicate slug/number or incompatible unique relation                            |
| CONTENT_IMMUTABLE           |    409 | Work/Category slug or Work type differs from the persisted immutable value       |
| CONTENT_TYPE_CONFLICT       |    409 | Chapter representation conflicts with parent-derived type                        |
| CONTENT_TRANSITION_CONFLICT |    409 | Target is disallowed by lifecycle state or illustrated-publication readiness     |
| CONTENT_STALE_WRITE         |    409 | Expected version lost and requested target is not authoritative                  |
| RATE_LIMIT_EXCEEDED         |    429 | Existing global limit                                                            |
| INTERNAL_SERVER_ERROR       |    500 | Safe unknown failure; committed state remains authoritative                      |
| SERVICE_UNAVAILABLE         |    503 | Safe database/connectivity failure                                               |

A duplicate target-state command is 200 with `transitioned: false`, not a conflict.
An identical category-set replacement is also 200 with the unchanged associations and
without a version change. Duplicate Category IDs within one replacement body fail
`400 VALIDATION_ERROR` before lookup or mutation. No rejected, rolled-back, or
race-losing operation returns success unless the requested state is already the
committed authoritative state.

## OpenAPI Agreement

`buildOpenApiDocument` must:

- register shared content component schemas without Prisma/generated types;
- document all 19 method/path pairs above;
- omit security for public reads;
- use `BearerAuth` for admin GET and combined `BearerAuth` + `CsrfHeader` for unsafe
  admin operations;
- list each success status and applicable 400/401/403/404/409/429/500/503 response;
- describe public metadata as body/page-free and hidden-state 404-equivalent;
- describe target-state idempotency, illustrated-publication readiness, immutable Work
  type, and expected-version conflicts.

Tests compare the exact operation set, security arrays, schemas, statuses, stable codes,
and representative runtime envelopes. A hand-written OpenAPI-only DTO is not accepted.

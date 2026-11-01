# Retained verification transcripts

Original captured outputs consolidated during the 2026-11-01 final review. Successful, failed and interrupted runs remain distinct; a capture alone does not establish a pass. The [capture index](verification-transcripts.index.json) retains each former path, byte count and SHA-256. Historical JSON paths are execution identifiers resolved through that index. Displays may normalize carriage returns, trailing spaces or terminal blank lines; the index preserves the exact original bytes as base64 wherever the rendered capture differs. No result is replaced by a new execution.

## final-routes

Original capture: `final-routes.txt`. Bytes: 1006. SHA-256: `e10676e7f85d9650b6b5fc48c4b10e63c60ca08aae72970988d111f7e0b3819b`.

```text
$ node scripts/check-web-routes.mjs http://127.0.0.1:4316
PASS /dashboard
PASS /library
PASS /settings
PASS /admin/ads
PASS /admin/categories
PASS /admin/comments
PASS /admin/contact/msg-1
PASS /admin/contact
PASS /admin/dashboard
PASS /admin/gifts/grants
PASS /admin/gifts
PASS /admin
PASS /admin/reports
PASS /admin/users/user-1
PASS /admin/users
PASS /admin/works/trait-hoarder/chapters/th-43/edit
PASS /admin/works/trait-hoarder/chapters/new
PASS /admin/works/trait-hoarder/chapters
PASS /admin/works/trait-hoarder/edit
PASS /admin/works/new
PASS /admin/works
PASS /auth/forgot-password
PASS /auth/login
PASS /auth/register
PASS /auth/reset-password
PASS /auth/verify-email
PASS /categories
PASS /contact
PASS /copyright
PASS /discover
PASS /
PASS /privacy
PASS /report-issue
PASS /stories
PASS /story/1/chapter/1
PASS /story/1
PASS /terms
PASS /story/trait-hoarder
PASS /story/trait-hoarder/chapter/43
PASS /story/1/chapter/2
Verified 40 existing routes and the 404 fallback at http://127.0.0.1:4316.
```

## final-verification

Original capture: `final-verification.txt`. Bytes: 27875. SHA-256: `4d9fe11d2bd8e43ec03cc8bfe99b4aaa4c92c6172111e8c28522cbad41ee2ea7`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 25ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 96ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache hit, replaying logs 742a27afe205c618
@fury/contracts:lint: $ eslint .
@fury/web:lint: cache miss, executing cd5398854867ebdb
@fury/database:lint: cache hit, replaying logs 254208cb6806329f
@fury/database:lint: $ eslint .
@fury/api:lint: cache hit, replaying logs 0eca30afc76b9f46
@fury/api:lint: $ eslint .
@fury/web:lint: $ eslint .

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    21.36s

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache hit, replaying logs 23bcd6edf7bb7dce
@fury/contracts:check-types: $ tsc --noEmit
@fury/web:check-types: cache miss, executing ead36d80dce41f0c
@fury/database:check-types: cache hit, replaying logs fd057a7cd81b1a70
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 88ms
@fury/database:check-types:
@fury/api:check-types: cache hit, replaying logs 06fc3f8c3f9e5d49
@fury/api:check-types: $ tsc --noEmit
@fury/web:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    2.668s

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:test: cache hit, replaying logs a9a5d239578e4928
@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 [repository]/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 3ms
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 4ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 5ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 6ms
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 22ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  17:33:49
@fury/contracts:test:    Duration  196ms (transform 164ms, setup 0ms, import 383ms, tests 40ms, environment 0ms)
@fury/contracts:test:
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:test: cache miss, executing b66a5044eaef5ca8
@fury/database:test: cache hit, replaying logs 432118bba498c41d
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/database:test:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 3ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 116ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  18:41:20
@fury/database:test:    Duration  418ms (transform 105ms, setup 0ms, import 210ms, tests 119ms, environment 0ms)
@fury/database:test:
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test: cache hit, replaying logs 63faa30a9455629d
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 58ms
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 75ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 9ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 7ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 12ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 28ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 10ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 28ms
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 14ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 21ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 8ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 311ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 13ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (15 tests) 5ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 11ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 7ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 5ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 5ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 6ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 4ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 3ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 3ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 5ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (15 tests) 739ms
@fury/api:test:
@fury/api:test:  Test Files  26 passed (26)
@fury/api:test:       Tests  149 passed (149)
@fury/api:test:    Start at  18:48:48
@fury/api:test:    Duration  1.17s (transform 1.36s, setup 374ms, import 3.07s, tests 1.40s, environment 2ms)
@fury/api:test:
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/web:test:
@fury/web:test:  RUN  v4.1.10 [repository]/apps/web
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 504ms
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 754ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 525ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 831ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 872ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (14 tests) 1272ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 1255ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 1530ms
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 694ms
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 830ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  354ms
@fury/web:test:  ✓ src/features/story/routing.test.tsx (6 tests) 930ms
@fury/web:test:      ✓ keeps chapter links under the current story 1  549ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 550ms
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 630ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 475ms
@fury/web:test:      ✓ renders the FURY brand and navigation groups with correct active state  342ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 416ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 581ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests) 3845ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 233ms
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 399ms
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 377ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (10 tests) 406ms
@fury/web:test:      ✓ renders real previous and next links for a paginated result  401ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 374ms
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 338ms
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 320ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 373ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (6 tests) 368ms
@fury/web:test:      ✓ uses the illustrated-work template with text-specific routes and labels  325ms
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 365ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 310ms
@fury/web:test:      ✓ renders a complete heading structure, approval boundary, and internal section links  309ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 386ms
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 296ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 467ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 300ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 311ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 324ms
@fury/web:test:      ✓ renders heading structure, approval notice, takedown checklist, and submission link  321ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 147ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 181ms
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 299ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 240ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 329ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 328ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 148ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 160ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (4 tests) 194ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 169ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 164ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 175ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 157ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 183ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 155ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 91ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 46ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 45ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 19ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 40ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 47ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 52ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 76ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 11ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 77ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 27ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 21ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 11ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 7ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (4 tests) 11ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (3 tests) 5ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 11ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (8 tests) 9ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 4ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 3ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 2ms
@fury/web:test:
@fury/web:test:  Test Files  72 passed (72)
@fury/web:test:       Tests  474 passed (474)
@fury/web:test:    Start at  18:58:57
@fury/web:test:    Duration  13.16s (transform 4.56s, setup 13.29s, import 13.74s, tests 26.09s, environment 50.84s)
@fury/web:test:

 Tasks:    6 successful, 6 total
Cached:    5 cached, 6 total
  Time:    13.997s

$ turbo run test:integration
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test:integration in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test:integration: cache bypass, force executing 776c35b4682d8f0c
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test:integration: cache bypass, force executing 111610c0f61bd442
@fury/database:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration:
@fury/api:test:integration:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:integration:
@fury/database:test:integration:
@fury/database:test:integration:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:integration:
@fury/api:test:integration: (node:6190) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
@fury/api:test:integration: (Use `node --trace-deprecation ...` to show where the warning was created)
@fury/api:test:integration:  ✓ src/modules/content/public-content.integration.test.ts (24 tests) 5386ms
@fury/api:test:integration:      ✓ enforces every parent and Chapter visibility-state combination  337ms
@fury/api:test:integration:      ✓ keeps deterministic publication/title ties, distinct bounded pages and truthful overruns  334ms
@fury/api:test:integration:      ✓ builds bounded saved-order home sections and the first three populated suggestion tabs  354ms
@fury/api:test:integration:      ✓ projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works  467ms
@fury/api:test:integration:      ✓ exports all eligible canonical slugs across bounded batches without private IDs or writes  2031ms
@fury/api:test:integration:  ✓ src/content.integration.test.ts (35 tests) 4834ms
@fury/api:test:integration:      ✓ serves strict detail and optional background bytes without private data or stale visibility  330ms
@fury/api:test:integration:      ✓ keeps every management family server-authoritative before lookup  552ms
@fury/api:test:integration:      ✓ returns the central rate-limit envelope with request identity  440ms
@fury/api:test:integration:  ✓ src/modules/content/work-management.integration.test.ts (16 tests) 1209ms
@fury/database:test:integration:  ✓ tests/integration/migration.integration.test.ts (6 tests) 13033ms
@fury/database:test:integration:      ✓ cascades refresh records and deploys idempotently  974ms
@fury/database:test:integration:      ✓ retires legacy phone after a populated P01 upgrade without losing account or session data  11923ms
@fury/api:test:integration:  ✓ src/modules/media/media.service.integration.test.ts (12 tests) 1530ms
@fury/api:test:integration:      ✓ keeps private authority and public eligibility independent of byte failure until saved status changes  376ms
@fury/api:test:integration:  ✓ src/modules/content/content-management.integration.test.ts (18 tests) 1063ms
@fury/api:test:integration:  ✓ src/media.integration.test.ts (14 tests) 1070ms
@fury/api:test:integration:  ✓ src/modules/content/category-management.integration.test.ts (9 tests) 500ms
@fury/api:test:integration:  ✓ src/modules/media/media.reconcile.integration.test.ts (4 tests) 356ms
@fury/api:test:integration:  ✓ src/app.integration.test.ts (14 tests) 277ms
@fury/api:test:integration:  ✓ src/modules/content/publication-management.integration.test.ts (4 tests) 233ms
@fury/api:test:integration:  ✓ src/modules/auth/auth.service.integration.test.ts (6 tests) 134ms
@fury/api:test:integration:
@fury/api:test:integration:  Test Files  11 passed (11)
@fury/api:test:integration:       Tests  156 passed (156)
@fury/api:test:integration:    Start at  18:59:11
@fury/api:test:integration:    Duration  23.94s (transform 545ms, setup 25ms, import 1.02s, tests 16.59s, environment 0ms)
@fury/api:test:integration:
@fury/database:test:integration:  ✓ tests/integration/chapter-upgrade.integration.test.ts (2 tests) 11430ms
@fury/database:test:integration:      ✓ preserves populated P01–P03 rows through failed, recovered, and repeated expand deploys  11415ms
@fury/database:test:integration:  ✓ tests/integration/content-domain.integration.test.ts (22 tests) 776ms
@fury/database:test:integration:  ✓ tests/integration/media-domain.integration.test.ts (5 tests) 180ms
@fury/database:test:integration:  ✓ tests/integration/media-recovery.integration.test.ts (1 test) 12ms
@fury/database:test:integration:
@fury/database:test:integration:  Test Files  5 passed (5)
@fury/database:test:integration:       Tests  36 passed (36)
@fury/database:test:integration:    Start at  18:59:11
@fury/database:test:integration:    Duration  31.85s (transform 87ms, setup 0ms, import 134ms, tests 25.43s, environment 0ms)
@fury/database:test:integration:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    32.733s

$ turbo run build
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running build in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:build: cache miss, executing 4961bab26ca0851a
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:build: cache hit, replaying logs 858477bb6806f9af
@fury/api:build: $ pnpm clean && tsc -p tsconfig.build.json
@fury/api:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo
@fury/web:build: $ next build --webpack
@fury/web:build: ▲ Next.js 16.2.12 (webpack)
@fury/web:build:
@fury/web:build:   Creating an optimized production build ...
@fury/web:build: ✓ Compiled successfully in 5.4s
@fury/web:build:   Running TypeScript ...
@fury/web:build:   Finished TypeScript in 6.3s ...
@fury/web:build:   Collecting page data using 9 workers ...
@fury/web:build:   Generating static pages using 9 workers (0/32) ...
@fury/web:build:   Generating static pages using 9 workers (8/32)
@fury/web:build:   Generating static pages using 9 workers (16/32)
@fury/web:build:   Generating static pages using 9 workers (24/32)
@fury/web:build: ✓ Generating static pages using 9 workers (32/32) in 395ms
@fury/web:build:   Finalizing page optimization ...
@fury/web:build:   Collecting build traces ...
@fury/web:build:
@fury/web:build: Route (app)
@fury/web:build: ┌ ○ /
@fury/web:build: ├ ○ /_not-found
@fury/web:build: ├ ○ /admin
@fury/web:build: ├ ○ /admin/ads
@fury/web:build: ├ ○ /admin/categories
@fury/web:build: ├ ○ /admin/comments
@fury/web:build: ├ ○ /admin/contact
@fury/web:build: ├ ƒ /admin/contact/[messageId]
@fury/web:build: ├ ○ /admin/dashboard
@fury/web:build: ├ ○ /admin/gifts
@fury/web:build: ├ ○ /admin/gifts/grants
@fury/web:build: ├ ○ /admin/reports
@fury/web:build: ├ ○ /admin/users
@fury/web:build: ├ ƒ /admin/users/[userId]
@fury/web:build: ├ ○ /admin/works
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/new
@fury/web:build: ├ ƒ /admin/works/[workId]/edit
@fury/web:build: ├ ○ /admin/works/new
@fury/web:build: ├ ○ /auth/forgot-password
@fury/web:build: ├ ○ /auth/login
@fury/web:build: ├ ○ /auth/register
@fury/web:build: ├ ○ /auth/reset-password
@fury/web:build: ├ ○ /auth/verify-email
@fury/web:build: ├ ○ /categories
@fury/web:build: ├ ○ /contact
@fury/web:build: ├ ○ /copyright
@fury/web:build: ├ ○ /dashboard
@fury/web:build: ├ ƒ /discover
@fury/web:build: ├ ○ /library
@fury/web:build: ├ ○ /privacy
@fury/web:build: ├ ƒ /report-issue
@fury/web:build: ├ ○ /settings
@fury/web:build: ├ ƒ /stories
@fury/web:build: ├ ƒ /story/[id]
@fury/web:build: ├ ƒ /story/[id]/chapter/[chapterId]
@fury/web:build: └ ○ /terms
@fury/web:build:
@fury/web:build:
@fury/web:build: ○  (Static)   prerendered as static content
@fury/web:build: ƒ  (Dynamic)  server-rendered on demand
@fury/web:build:

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    21.865s

$ node scripts/assert-build-output.mjs
Build output verified: 6 required entry artifacts present; 384 emitted files contain no test artifacts.
```

## integration-backend-baseline

Original capture: `integration-backend-baseline.txt`. Bytes: 628. SHA-256: `5f3da043711e7396ab846f587a7aec6cf8a920ab9d8b1f86bc560da2b7aa552e`.

```text
$ vitest run --config vitest.integration.config.ts

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/api

(node:14991) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

 Test Files  11 passed (11)
      Tests  158 passed (158)
   Start at  11:02:44
   Duration  48.30s (transform 1.07s, setup 69ms, import 1.91s, tests 26.22s, environment 0ms)

```

## integration-browser-admin-categories

Original capture: `integration-browser-admin-categories.txt`. Bytes: 171. SHA-256: `698683ea5ba55b38cde0a4ae355660d83e0c463906ccdbf18dd2afc0c85d3ed9`.

```text
### Error
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('searchbox', { name: 'البحث في التصنيفات' })[22m

```

## integration-browser-admin-illustrated-chapter

Original capture: `integration-browser-admin-illustrated-chapter.txt`. Bytes: 1915. SHA-256: `694f2d3b8416c6dda1df7549da95451eee4a5a7e26f684ee5813fd6330d697d9`.

````text
### Result
{"kind":"actual administrator Chapter save and publication","work":"browser-illustrated","path":"/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/chapters/d18c6be3-c893-488d-86bd-6e3f9f945d5a/edit","published":true}
### Ran Playwright code
```js
await (async (page) => {
  await page.goto("http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/chapters/new");
  await page.locator("#chapter-number").fill("1");
  await page.locator("#chapter-title").fill("Browser chapter عنوان");
  await page.getByRole("region",{name:"الوسائط المحفوظة: ارفع صورة صفحة أو اختر صورة مقبولة",exact:true}).getByRole("button",{name:"اختيار هذا الوسيط",exact:true}).first().click();
  await page.getByRole("button",{name:"حفظ المسودة",exact:true}).click();
  await page.waitForURL(url=>url.pathname.endsWith("/edit"));
  await page.getByRole("button",{name:"نشر الفصل",exact:true}).click();
  const dialog=page.getByRole("dialog",{name:"تأكيد تغيير حالة الفصل",exact:true});
  await dialog.getByRole("button",{name:"تأكيد",exact:true}).click();
  await dialog.waitFor({state:"hidden"});
  await page.getByRole("button",{name:"إلغاء النشر",exact:true}).waitFor();
  return {kind:"actual administrator Chapter save and publication",work:"browser-illustrated",path:new URL(page.url()).pathname,published:true};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/chapters/d18c6be3-c893-488d-86bd-6e3f9f945d5a/edit
- Page Title: تعديل الفصل (d18c6be3-c893-488d-86bd-6e3f9f945d5a) - fe1afaa5-d050-495c-8690-29b9f925599a | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L19-L24
````

## integration-browser-admin-illustrated

Original capture: `integration-browser-admin-illustrated.txt`. Bytes: 2303. SHA-256: `8fd60eecf978d967d52d8fc0013016fd14371f727d45fd484bbdc3110b6df185`.

````text
### Result
{"kind":"actual administrator UI Work creation and publication","slug":"browser-illustrated","path":"/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit","headings":["الرئيسية","إدارة المحتوى","المجتمع والإشراف","التواصل والإعلانات","بيانات الإدارة للمعاينة","تعديل مسودة: Browser illustrated عمل","بيانات المسودة","الوسائط الخاصة بالمسودة","وسائط محفوظة لهذا النوع","وسائط محفوظة لهذا النوع","معاينة البيانات المحفوظة","Browser illustrated عمل"]}
### Ran Playwright code
```js
await (async (page) => {
  await page.goto("http://127.0.0.1:4316/admin/works/new");
  await page.locator("#work-title").waitFor();
  await page.locator("#work-title").fill("Browser illustrated عمل");
  await page.locator("#work-slug").fill("browser-illustrated");
  await page.locator("#work-type").selectOption("manga");
  await page.locator("#work-author").fill("Synthetic Browser Author");
  await page.locator("#work-synopsis").fill("Saved by the actual administrator browser flow for public catalog verification.");
  await page.getByRole("checkbox",{name:"Browser Category A",exact:true}).check();
  await page.getByRole("checkbox",{name:"Browser Category B",exact:true}).check();
  await page.getByRole("region",{name:"الوسائط المحفوظة: رفع غلاف جديد",exact:true}).getByRole("button",{name:"اختيار هذا الوسيط",exact:true}).first().click();
  await page.getByRole("button",{name:"حفظ ونشر",exact:true}).click();
  await page.waitForURL(url=>url.pathname!=="/admin/works/new");
  return {kind:"actual administrator UI Work creation and publication",slug:"browser-illustrated",path:new URL(page.url()).pathname,headings:await page.getByRole("heading").allTextContents()};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit
- Page Title: تعديل العمل (fe1afaa5-d050-495c-8690-29b9f925599a) | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L7-L12
````

## integration-browser-admin-publication-controls

Original capture: `integration-browser-admin-publication-controls.txt`. Bytes: 1415. SHA-256: `580f866d7031615571d6a5c4854ffbfdc5cd63113c40f06b289e3ad0c5093ae8`.

````text
### Result
{"buttons":["","","","إزالة المعاينة المحلية","معاينة الوسيط","اختيار هذا الوسيط","إزالة الغلاف عند الحفظ","","معاينة الوسيط","اختيار هذا الوسيط","إلغاء والعودة","حفظ التعديلات","إلغاء النشر","أرشفة العمل"],"headings":["الرئيسية","إدارة المحتوى","المجتمع والإشراف","التواصل والإعلانات","تعديل مسودة: Browser illustrated عمل","بيانات المسودة","الوسائط الخاصة بالمسودة","معاينة البيانات المحفوظة"]}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit');await page.getByRole('button',{name:'إلغاء النشر',exact:true}).waitFor();return {buttons:await page.getByRole('button').allTextContents(),headings:await page.locator('h1,h2').allTextContents()};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit
- Page Title: تعديل العمل (fe1afaa5-d050-495c-8690-29b9f925599a) | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L57-L62
````

## integration-browser-admin-text-chapter

Original capture: `integration-browser-admin-text-chapter.txt`. Bytes: 1843. SHA-256: `528c0c12bf5e31a9a721cd7c11eeec7357556d1c93489c0d2c53eb3daf56c2c9`.

````text
### Result
{"kind":"actual administrator Chapter save and publication","work":"browser-text","path":"/admin/works/b6b1e172-5a47-4e8f-9ddc-9e2728726e98/chapters/58b2d58c-91ee-434f-aed2-007b84730ffc/edit","published":true}
### Ran Playwright code
```js
await (async (page) => {
  await page.goto("http://127.0.0.1:4316/admin/works/b6b1e172-5a47-4e8f-9ddc-9e2728726e98/chapters/new");
  await page.locator("#chapter-number").fill("1");
  await page.locator("#chapter-title").fill("Browser chapter عنوان");
  await page.getByRole("button",{name:"فقرة",exact:true}).click(); await page.locator("#text-inline-0-0").fill("Synthetic private text authored in the administrator browser.");
  await page.getByRole("button",{name:"حفظ المسودة",exact:true}).click();
  await page.waitForURL(url=>url.pathname.endsWith("/edit"));
  await page.getByRole("button",{name:"نشر الفصل",exact:true}).click();
  const dialog=page.getByRole("dialog",{name:"تأكيد تغيير حالة الفصل",exact:true});
  await dialog.getByRole("button",{name:"تأكيد",exact:true}).click();
  await dialog.waitFor({state:"hidden"});
  await page.getByRole("button",{name:"إلغاء النشر",exact:true}).waitFor();
  return {kind:"actual administrator Chapter save and publication",work:"browser-text",path:new URL(page.url()).pathname,published:true};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/b6b1e172-5a47-4e8f-9ddc-9e2728726e98/chapters/58b2d58c-91ee-434f-aed2-007b84730ffc/edit
- Page Title: تعديل الفصل (58b2d58c-91ee-434f-aed2-007b84730ffc) - b6b1e172-5a47-4e8f-9ddc-9e2728726e98 | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L25-L30
````

## integration-browser-admin-text

Original capture: `integration-browser-admin-text.txt`. Bytes: 2272. SHA-256: `e39011f01d264fc5e35cbb560c1f712bc45fa3da09c21181255544aa8ce8f0db`.

````text
### Result
{"kind":"actual administrator UI text Work creation and publication","slug":"browser-text","path":"/admin/works/b6b1e172-5a47-4e8f-9ddc-9e2728726e98/edit","headings":["الرئيسية","إدارة المحتوى","المجتمع والإشراف","التواصل والإعلانات","بيانات الإدارة للمعاينة","تعديل مسودة: Browser text عمل","بيانات المسودة","الوسائط الخاصة بالمسودة","وسائط محفوظة لهذا النوع","وسائط محفوظة لهذا النوع","معاينة البيانات المحفوظة","Browser text عمل"]}
### Ran Playwright code
```js
await (async (page) => {
  await page.goto("http://127.0.0.1:4316/admin/works/new");
  await page.locator("#work-title").waitFor();
  await page.locator("#work-title").fill("Browser text عمل");
  await page.locator("#work-slug").fill("browser-text");
  await page.locator("#work-type").selectOption("novel");
  await page.locator("#work-author").fill("Synthetic Browser Author");
  await page.locator("#work-synopsis").fill("Saved by the actual administrator browser flow for public catalog verification.");
  await page.getByRole("checkbox",{name:"Browser Category C",exact:true}).check();
  await page.getByRole("checkbox",{name:"Browser Category B",exact:true}).check();
  await page.getByRole("region",{name:"الوسائط المحفوظة: رفع غلاف جديد",exact:true}).getByRole("button",{name:"اختيار هذا الوسيط",exact:true}).first().click();
  await page.getByRole("button",{name:"حفظ ونشر",exact:true}).click();
  await page.waitForURL(url=>url.pathname!=="/admin/works/new");
  return {kind:"actual administrator UI text Work creation and publication",slug:"browser-text",path:new URL(page.url()).pathname,headings:await page.getByRole("heading").allTextContents()};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/b6b1e172-5a47-4e8f-9ddc-9e2728726e98/edit
- Page Title: تعديل العمل (b6b1e172-5a47-4e8f-9ddc-9e2728726e98) | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L13-L18
````

## integration-browser-administrator-relogin

Original capture: `integration-browser-administrator-relogin.txt`. Bytes: 288. SHA-256: `d314c59783c46c969cdba42e6a710146bd5ea68f244ec8a548e2a28823dfbdf7`.

```text
### Error
TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/admin" until "load"
  navigated to "http://127.0.0.1:4316/dashboard"
============================================================
```

## integration-browser-all-route-recovery

Original capture: `integration-browser-all-route-recovery.txt`. Bytes: 4744. SHA-256: `e31342d3d2df00e46a18d6c5a98f9e0012b4a69f6da72c0efda1db6e358df543`.

````text
### Result
{"kind":"controlled browser network503/held retry with actual backend recovery on all six P05 layouts","results":[{"path":"/","failedReadWasNotEmpty":true,"explicitKeyboardRetry":true,"pendingAriaBusy":"true","recovered":true,"focus":{"tag":"MAIN","text":"أحدث الإصداراتعرض الكلروايةتفاصيل العملBrowser text عملفصل 1 — Browser chapter ع","outline":"solid","outlineWidth":"3px"}},{"path":"/discover","failedReadWasNotEmpty":true,"explicitKeyboardRetry":true,"pendingAriaBusy":"true","recovered":true,"focus":{"tag":"P","text":"44 نتيجة","outline":"solid","outlineWidth":"3px"}},{"path":"/stories","failedReadWasNotEmpty":true,"explicitKeyboardRetry":true,"pendingAriaBusy":"true","recovered":true,"focus":{"tag":"P","text":"15 نتيجة","outline":"solid","outlineWidth":"3px"}},{"path":"/categories","failedReadWasNotEmpty":true,"explicitKeyboardRetry":true,"pendingAriaBusy":"true","recovered":true,"focus":{"tag":"MAIN","text":"دليل Furyالتصنيفاتابدأ من النوع الذي تحبه، ثم استكشف الأعمال المطابقة له.ابحث في","outline":"solid","outlineWidth":"3px"}},{"path":"/story/saved-manga-0","failedReadWasNotEmpty":true,"explicitKeyboardRetry":true,"pendingAriaBusy":"true","recovered":true,"focus":{"tag":"DIV","text":"مانجاالحفظ لاحقًاالحفظ والتقييم والتعليقات غير متاحة بعد.الحالةمستمرةالنوعمانجات","outline":"solid","outlineWidth":"3px"}},{"path":"/story/saved-novel-4","failedReadWasNotEmpty":true,"explicitKeyboardRetry":true,"pendingAriaBusy":"true","recovered":true,"focus":{"tag":"DIV","text":"تعذّر تحميل الصورة إعادة تحميل الصورةروايةالحفظ لاحقًاالحفظ والتقييم والتعليقات ","outline":"solid","outlineWidth":"3px"}}]}
### Ran Playwright code
```js
await (async(page)=>{
  const cases=[
    {path:"/",pattern:"**/api/v1/content/catalog/home",ready:()=>page.getByRole("heading",{name:"أحدث الإصدارات",exact:true})},
    {path:"/discover",pattern:"**/api/v1/content/catalog/works?**",ready:()=>page.getByRole("region",{name:"نتائج اكتشاف الأعمال"})},
    {path:"/stories",pattern:"**/api/v1/content/catalog/works?**",ready:()=>page.getByRole("region",{name:"نتائج اكتشاف الأعمال"})},
    {path:"/categories",pattern:"**/api/v1/content/catalog/categories?**",ready:()=>page.getByRole("region",{name:"قائمة التصنيفات"})},
    {path:"/story/saved-manga-0",pattern:"**/api/v1/content/catalog/works/saved-manga-0",ready:()=>page.getByRole("heading",{name:"عمل Mixed 00 manga",exact:true})},
    {path:"/story/saved-novel-4",pattern:"**/api/v1/content/catalog/works/saved-novel-4",ready:()=>page.getByRole("heading",{name:"عمل Mixed 04 novel",exact:true})},
  ];
  const results=[];
  for(const entry of cases){
    let mode="fail";let release;
    const gate=new Promise(resolve=>{release=resolve;});
    await page.route(entry.pattern,async route=>{
      if(mode==="fail")return route.fulfill({status:503,contentType:"application/json",body:"{}"});
      if(mode==="hold")await gate;
      return route.continue();
    });
    try{
      await page.goto("http://127.0.0.1:4316"+entry.path);
      const retry=page.getByRole("button",{name:"إعادة المحاولة",exact:true});
      await retry.waitFor();await retry.focus();mode="hold";await retry.press("Enter");
      await page.getByRole("heading",{name:"جارٍ تحميل المحتوى",exact:true}).waitFor();
      const pending=await page.getByRole("status").filter({hasText:"جارٍ تحميل المحتوى"}).getAttribute("aria-busy");
      mode="pass";release();await entry.ready().waitFor();
      await page.waitForFunction(()=>document.activeElement?.hasAttribute("data-public-catalog-focus"));
      const focus=await page.evaluate(()=>({tag:document.activeElement?.tagName,text:document.activeElement?.textContent?.slice(0,80),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth}));
      results.push({path:entry.path,failedReadWasNotEmpty:true,explicitKeyboardRetry:true,pendingAriaBusy:pending,recovered:true,focus});
    }finally{release();await page.unroute(entry.pattern);}
  }
  return {kind:"controlled browser network503/held retry with actual backend recovery on all six P05 layouts",results};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-novel-4
- Page Title: عمل Mixed 04 novel | Fury
- Console: 3 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L67-L80
````

## integration-browser-all-sorts-directory-corrected

Original capture: `integration-browser-all-sorts-directory-corrected.txt`. Bytes: 54. SHA-256: `96d44a954504b5b9fc9d916ec3a36dbcbfd039488091c0f4edd19930ce4c6e2e`.

```text
### Error
Error: Directory saved-name search mismatch
```

## integration-browser-all-sorts-directory

Original capture: `integration-browser-all-sorts-directory.txt`. Bytes: 183. SHA-256: `84ce490890d33cf90b3cb7f204dd5ba4c46340fc096dc1b659445a2841ebbb95`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: 'Browser Category A', exact: true }) to be visible[22m

```

## integration-browser-all-statuses

Original capture: `integration-browser-all-statuses.txt`. Bytes: 1699. SHA-256: `8327f4104f44d253c116195a90ff1d840a687be71d05b1c001e59806ad4acf94`.

````text
### Result
{"passed":true,"statuses":[{"status":"ongoing","items":["Browser illustrated عمل","عمل Mixed 36 manga","عمل Mixed 30 manga","عمل Mixed 24 manga","عمل Mixed 18 manga","عمل Mixed 12 manga","عمل Mixed 06 manga","عمل Mixed 00 manga"]},{"status":"completed","items":["عمل Mixed 39 comics","عمل Mixed 33 comics","عمل Mixed 27 comics","عمل Mixed 21 comics","عمل Mixed 15 comics","عمل Mixed 09 comics","عمل Mixed 03 comics"]},{"status":"hiatus","items":[]},{"status":"cancelled","items":[]}]}
### Ran Playwright code
```js
await (async(page)=>{const rows=[];for(const status of ['ongoing','completed','hiatus','cancelled']){await page.goto('http://127.0.0.1:4316/discover?status='+status+'&type='+(status==='completed'?'comics':'manga'));await page.locator('#discover-status').waitFor();if(await page.locator('#discover-status').inputValue()!==status)throw Error('Status URL state lost');if(status==='hiatus'||status==='cancelled')await page.getByRole('heading',{name:'لا توجد نتائج مطابقة',exact:true}).waitFor();else await page.getByRole('region',{name:'نتائج اكتشاف الأعمال'}).waitFor();rows.push({status,items:await page.locator('section[aria-label="نتائج اكتشاف الأعمال"] h3').allTextContents()});}return {passed:true,statuses:rows};})(page);
```
### Page
- Page URL: http://127.0.0.1:4316/discover?type=manga&status=cancelled
- Page Title: اكتشف الأعمال | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L175-L177
````

## integration-browser-all-types

Original capture: `integration-browser-all-types.txt`. Bytes: 1346. SHA-256: `15634e37bc92818b1bc50d536aa213a5594de3c97730188c36595f56f4854d4d`.

````text
### Result
{"passed":true,"results":[{"type":"manga","count":7,"matchingSavedTitles":true},{"type":"manhwa","count":7,"matchingSavedTitles":true},{"type":"manhua","count":7,"matchingSavedTitles":true},{"type":"comics","count":7,"matchingSavedTitles":true},{"type":"novel","count":7,"matchingSavedTitles":true},{"type":"text-story","count":7,"matchingSavedTitles":true}]}
### Ran Playwright code
```js
await (async(page)=>{const results=[];for(const type of ['manga','manhwa','manhua','comics','novel','text-story']){await page.goto('http://127.0.0.1:4316/discover?type='+type);await page.getByRole('region',{name:'نتائج اكتشاف الأعمال'}).waitFor();if(await page.locator('#discover-type').inputValue()!==type)throw Error('Type URL selection lost');const titles=await page.locator('section[aria-label="نتائج اكتشاف الأعمال"] h3').allTextContents();if(titles.length!==7||titles.some(t=>!t.endsWith(type)))throw Error('Server type restriction failed '+type);results.push({type,count:titles.length,matchingSavedTitles:true});}return {passed:true,results};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/discover?type=text-story
- Page Title: اكتشف الأعمال | Fury
- Console: 13 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L116-L193
````

## integration-browser-background-bytes-failure

Original capture: `integration-browser-background-bytes-failure.txt`. Bytes: 881. SHA-256: `2197486763f49156c0c6872e7a146765c5c1ad5bd55619ee7b40305b997c7732`.

````text
### Result
{"passed":true,"workRemainsVisible":true,"imageFailureCount":1,"workTitle":"عمل Mixed 00 manga","path":"/story/saved-manga-0"}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/saved-manga-0');await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).waitFor();await page.getByRole('button',{name:'إعادة تحميل الصورة',exact:true}).first().waitFor();return {passed:true,workRemainsVisible:true,imageFailureCount:await page.getByText('تعذّر تحميل الصورة',{exact:true}).count(),workTitle:await page.getByRole('heading',{level:1}).textContent(),path:new URL(page.url()).pathname};}
)(page);
```
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L153
````

## integration-browser-background-bytes-recovery

Original capture: `integration-browser-background-bytes-recovery.txt`. Bytes: 992. SHA-256: `136975b563df46afe86e0f29909d6b9432ecb5ae4d5971b41ba7cca62d467199`.

````text
### Result
{"passed":true,"actualByteRepairKeyboardRetry":true,"workRemainsVisible":true,"focus":{"tag":"IMG","outline":"solid","outlineWidth":"3px"}}
### Ran Playwright code
```js
await (async(page)=>{const button=page.getByRole('button',{name:'إعادة تحميل الصورة',exact:true}).first();await button.focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement instanceof HTMLImageElement&&document.activeElement.src.startsWith('blob:')&&document.activeElement.complete&&document.activeElement.naturalWidth>0);const focus=await page.evaluate(()=>({tag:document.activeElement.tagName,outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth}));if(!await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).count())throw Error('Image failure hid Work');return {passed:true,actualByteRepairKeyboardRetry:true,workRemainsVisible:true,focus};}
)(page);
```
````

## integration-browser-category-last-enabled

Original capture: `integration-browser-category-last-enabled.txt`. Bytes: 2590. SHA-256: `c1ea9de6d3f1a55cfa001c37519686da4f3031fa6d76d3d406ff33c12cec02bd`.

````text
### Result
{"passed":true,"partialDisableCategories":["browser-category-b"],"refusedStatus":409,"refusedCode":"CONTENT_CATEGORY_IN_USE","publicProjectionUnchanged":true,"categoryARestored":true}
### Ran Playwright code
```js
await (async(page)=>{
 const base='http://127.0.0.1:4315/api/v1/content/catalog/works/browser-illustrated';
 const before=await page.evaluate(async url=>{const r=await fetch(url,{credentials:'omit'});return {status:r.status,body:await r.json()};},base);
 if(before.status!==200||before.body.data.work.categories.map(c=>c.slug).join(',')!=='browser-category-b')throw Error('Partial disable did not leave actual category B');
 await page.getByRole('textbox',{name:'البحث في التصنيفات'}).fill('Browser Category B');
 const row=page.getByRole('row').filter({hasText:'Browser Category B'});
 await row.getByRole('button',{name:'تعطيل',exact:true}).click();
 const response=page.waitForResponse(r=>r.request().method()==='PATCH'&&r.url().includes('/categories/'));
 await page.getByRole('dialog',{name:'تعطيل التصنيف',exact:true}).getByRole('button',{name:'تعطيل التصنيف',exact:true}).click();
 const r=await response;const body=await r.json();if(r.status()!==409)throw Error('Expected actual last-category refusal');
 await page.getByText('لا يمكن تعطيل التصنيف لأنه التصنيف المفعّل الأخير لعمل منشور.',{exact:true}).waitFor();
 const after=await page.evaluate(async url=>{const r=await fetch(url,{credentials:'omit'});return {status:r.status,body:await r.json()};},base);
 if(JSON.stringify(before.body.data)!==JSON.stringify(after.body.data))throw Error('Refused disable changed public projection');
 await page.getByRole('textbox',{name:'البحث في التصنيفات'}).fill('Browser Category A');
 const a=page.getByRole('row').filter({hasText:'Browser Category A'});await a.getByRole('button',{name:'تفعيل',exact:true}).click();await a.getByRole('button',{name:'تعطيل',exact:true}).waitFor();
 return {passed:true,partialDisableCategories:before.body.data.work.categories.map(c=>c.slug),refusedStatus:r.status(),refusedCode:body.code,publicProjectionUnchanged:true,categoryARestored:true};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/categories
- Page Title: إدارة التصنيفات | لوحة إدارة Fury
- Console: 1 errors, 6 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L50-L56
````

## integration-browser-category-partial-disable

Original capture: `integration-browser-category-partial-disable.txt`. Bytes: 169. SHA-256: `27e6bd9bcca3f0c85eed5f68e274cb0e8577ec15c839bd1f9ae97c7b6df5a129`.

```text
### Error
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('textbox', { name: 'البحث في التصنيفات' })[22m

```

## integration-browser-category-state-corrected

Original capture: `integration-browser-category-state-corrected.txt`. Bytes: 1598. SHA-256: `817d26e794539b7317544d6066b4437a28868b608954bb806111f2c364006b61`.

````text
### Result
{"kind":"actual saved category verification after failed harness wait","initialDisabledConfirmed":"Disabled Categorydisabled-categoryمعطّل٣١٠ تعديلتفعيل","createdCategoryRows":["الاسمالرابطالحالةالترتيب العامالأعمال المرتبطةالإجراءات","Browser Category Abrowser-category-aمفعّل٣٢١ تعديلتعطيل","Browser Category Bbrowser-category-bمفعّل٣٣٢ تعديلتعطيل","Browser Category Cbrowser-category-cمفعّل٣٤١ تعديلتعطيل"]}
### Ran Playwright code
```js
await (async (page) => {
  await page.goto("http://127.0.0.1:4316/admin/categories");
  const search=page.getByRole("textbox",{name:"البحث في التصنيفات"});
  await search.fill("Disabled Category");
  const row=page.getByRole("row").filter({hasText:"Disabled Category"});
  await row.getByText("معطّل",{exact:true}).waitFor();
  const disabled=await row.textContent();
  await search.fill("Browser Category");
  await page.getByRole("row").filter({hasText:"Browser Category A"}).waitFor();
  return {kind:"actual saved category verification after failed harness wait",initialDisabledConfirmed:disabled,createdCategoryRows:await page.getByRole("row").allTextContents()};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/categories
- Page Title: إدارة التصنيفات | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L31-L42
````

## integration-browser-category-state

Original capture: `integration-browser-category-state.txt`. Bytes: 245. SHA-256: `5a620928a16a824d29f7ad3944197e9775c82407e4e2e411a12d352666e71a44`.

```text
### Error
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('dialog', { name: 'تعطيل التصنيف', exact: true }).getByRole('button', { name: 'تعطيل التصنيف', exact: true })[22m

```

## integration-browser-chapter-transitions

Original capture: `integration-browser-chapter-transitions.txt`. Bytes: 3180. SHA-256: `888fe1b19963b4b8bbeb77ee6a4f05bf270671ef41f71f13622f4d68b67aee17`.

````text
### Result
{"passed":true,"actualChapterAdministratorTransitions":true,"result":[{"slug":"browser-illustrated","hidden":{"status":200,"count":0,"first":null,"latest":null},"recovered":{"status":200,"count":1,"first":{"number":1,"title":"Browser chapter عنوان","contentType":"illustrated","publishedAt":"2026-11-01T10:52:03.826Z"},"latest":{"number":1,"title":"Browser chapter عنوان","contentType":"illustrated","publishedAt":"2026-11-01T10:52:03.826Z"}}},{"slug":"browser-text","hidden":{"status":200,"count":0,"first":null,"latest":null},"recovered":{"status":200,"count":1,"first":{"number":1,"title":"Browser chapter عنوان","contentType":"text","publishedAt":"2026-11-01T10:52:04.297Z"},"latest":{"number":1,"title":"Browser chapter عنوان","contentType":"text","publishedAt":"2026-11-01T10:52:04.297Z"}}}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id,chapter]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a','d18c6be3-c893-488d-86bd-6e3f9f945d5a'],['browser-text','b6b1e172-5a47-4e8f-9ddc-9e2728726e98','58b2d58c-91ee-434f-aed2-007b84730ffc']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/chapters/'+chapter+'/edit');await page.getByRole('button',{name:'إلغاء النشر',exact:true}).waitFor();await page.getByRole('button',{name:'إلغاء النشر',exact:true}).click();await page.getByRole('dialog',{name:'تأكيد تغيير حالة الفصل',exact:true}).getByRole('button',{name:'تأكيد',exact:true}).click();await page.getByRole('button',{name:'نشر الفصل',exact:true}).waitFor();const projection=async()=>page.evaluate(async slug=>{const r=await fetch('http://127.0.0.1:4315/api/v1/content/catalog/works/'+slug,{credentials:'omit'});const b=await r.json();return {status:r.status,count:b.data?.chapters.pagination.total,first:b.data?.firstChapter,latest:b.data?.latestChapter};},slug);const hidden=await projection();if(hidden.status!==200||hidden.count!==0||hidden.first!==null||hidden.latest!==null)throw Error('Chapter withdrawal did not preserve zero-chapter Work');await page.getByRole('button',{name:'نشر الفصل',exact:true}).click();await page.getByRole('dialog',{name:'تأكيد تغيير حالة الفصل',exact:true}).getByRole('button',{name:'تأكيد',exact:true}).click();await page.getByRole('button',{name:'إلغاء النشر',exact:true}).waitFor();const recovered=await projection();if(recovered.status!==200||recovered.count!==1||recovered.first?.number!==1||recovered.latest?.number!==1)throw Error('Chapter recovery failed');result.push({slug,hidden,recovered});}return {passed:true,actualChapterAdministratorTransitions:true,result};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/b6b1e172-5a47-4e8f-9ddc-9e2728726e98/chapters/58b2d58c-91ee-434f-aed2-007b84730ffc/edit
- Page Title: تعديل الفصل (58b2d58c-91ee-434f-aed2-007b84730ffc) - b6b1e172-5a47-4e8f-9ddc-9e2728726e98 | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L108
````

## integration-browser-cover-bytes-failure

Original capture: `integration-browser-cover-bytes-failure.txt`. Bytes: 1024. SHA-256: `2941530bfcc698bbdc2f5693b44ba37404938c2b90f15aa1563607142c83f274`.

````text
### Result
{"passed":true,"workRemainsVisible":true,"imageFailureCount":1,"workTitle":"عمل Mixed 00 manga","path":"/story/saved-manga-0"}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/saved-manga-0');await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).waitFor();await page.getByRole('button',{name:'إعادة تحميل الصورة',exact:true}).first().waitFor();return {passed:true,workRemainsVisible:true,imageFailureCount:await page.getByText('تعذّر تحميل الصورة',{exact:true}).count(),workTitle:await page.getByRole('heading',{level:1}).textContent(),path:new URL(page.url()).pathname};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-manga-0
- Page Title: عمل Mixed 00 manga | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L146-L152
````

## integration-browser-cover-bytes-recovery

Original capture: `integration-browser-cover-bytes-recovery.txt`. Bytes: 992. SHA-256: `136975b563df46afe86e0f29909d6b9432ecb5ae4d5971b41ba7cca62d467199`.

````text
### Result
{"passed":true,"actualByteRepairKeyboardRetry":true,"workRemainsVisible":true,"focus":{"tag":"IMG","outline":"solid","outlineWidth":"3px"}}
### Ran Playwright code
```js
await (async(page)=>{const button=page.getByRole('button',{name:'إعادة تحميل الصورة',exact:true}).first();await button.focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement instanceof HTMLImageElement&&document.activeElement.src.startsWith('blob:')&&document.activeElement.complete&&document.activeElement.naturalWidth>0);const focus=await page.evaluate(()=>({tag:document.activeElement.tagName,outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth}));if(!await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).count())throw Error('Image failure hid Work');return {passed:true,actualByteRepairKeyboardRetry:true,workRemainsVisible:true,focus};}
)(page);
```
````

## integration-browser-design-1280

Original capture: `integration-browser-design-1280.txt`. Bytes: 2862. SHA-256: `f0e4eb99815d9541fb44eaecdeaa7154294b4a9c995397d632b1269ffe1c4236`.

````text
### Result
{"kind":"actual production Next/Express/owned PostgreSQL design comparison","results":[{"name":"home","path":"/","width":1280,"title":"Fury — اكتشف الأعمال المنشورة","geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":24,"headings":["عمل Mixed 00 mangaعنوان بديل محفوظ"]},{"name":"discover","path":"/discover","width":1280,"title":"اكتشف الأعمال | Fury","geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":12,"headings":["قائمة المانجا"]},{"name":"stories","path":"/stories","width":1280,"title":"الروايات والقصص النصية | Fury","geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":12,"headings":["الروايات والقصص النصية"]},{"name":"categories","path":"/categories","width":1280,"title":"التصنيفات | Fury","geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":0,"headings":["التصنيفات"]},{"name":"illustrated","path":"/story/saved-manga-0","width":1280,"title":"عمل Mixed 00 manga | Fury","geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":6,"headings":["عمل Mixed 00 manga"]},{"name":"text","path":"/story/saved-novel-4","width":1280,"title":"عمل Mixed 04 novel | Fury","geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":5,"headings":["عمل Mixed 04 novel"]}]}
### Ran Playwright code
```js
await (async (page) => {
  const results=[];
  await page.setViewportSize({width:1280,height:900});
  for(const [name,path] of [["home","/"],["discover","/discover"],["stories","/stories"],["categories","/categories"],["illustrated","/story/saved-manga-0"],["text","/story/saved-novel-4"]]){
    await page.goto("http://127.0.0.1:4316"+path);
    await page.locator("h1").first().waitFor();
    await page.waitForFunction(()=>![...document.images].some(image=>image.getAttribute("aria-busy")==="true"));
    if(await page.getByText("تعذّر تحميل المحتوى",{exact:true}).count()) throw new Error("An unavailable response must not be accepted as design proof");
    await page.screenshot({path:"/tmp/fury-p05-after-"+name+"-1280.png",fullPage:true});
    results.push({name,path,width:1280,title:await page.title(),geometry:await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,dir:document.documentElement.dir})),loadedImages:await page.locator("img[src^=blob]").count(),headings:await page.locator("h1").allTextContents()});
  }
  return {kind:"actual production Next/Express/owned PostgreSQL design comparison",results};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-novel-4
- Page Title: عمل Mixed 04 novel | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L22-L27
````

## integration-browser-design-load-diagnostic

Original capture: `integration-browser-design-load-diagnostic.txt`. Bytes: 3667. SHA-256: `f6488f0cc0d791a46778188bd88d6c1bfc2828b2cc95c1ebabb251c5080483a2`.

````text
### Result
{"path":"/","scroll":{"y":2600,"height":4204,"width":320},"images":[{"alt":"","loaded":true,"busy":null,"srcKind":"blob","x":0,"y":-2536,"width":320,"height":530},{"alt":"","loaded":true,"busy":null,"srcKind":"blob","x":0,"y":-2536,"width":320,"height":530},{"alt":"","loaded":true,"busy":null,"srcKind":"blob","x":0,"y":-2536,"width":320,"height":530},{"alt":"","loaded":true,"busy":null,"srcKind":"blob","x":0,"y":0,"width":0,"height":0},{"alt":"","loaded":true,"busy":null,"srcKind":"blob","x":0,"y":0,"width":0,"height":0},{"alt":"","loaded":true,"busy":null,"srcKind":"blob","x":0,"y":0,"width":0,"height":0},{"alt":"Browser text عمل","loaded":true,"busy":null,"srcKind":"blob","x":173,"y":-1728.609375,"width":130,"height":174},{"alt":"Browser illustrated عمل","loaded":true,"busy":null,"srcKind":"blob","x":17,"y":-1728.609375,"width":130,"height":174},{"alt":"عمل Mixed 05 text-story","loaded":true,"busy":null,"srcKind":"blob","x":173,"y":-1441.40625,"width":130,"height":174},{"alt":"عمل Mixed 04 novel","loaded":true,"busy":null,"srcKind":"blob","x":17,"y":-1441.40625,"width":130,"height":174},{"alt":"عمل Mixed 04 novel","loaded":true,"busy":null,"srcKind":"blob","x":173,"y":-1154.203125,"width":130,"height":174},{"alt":"عمل Mixed 04 novel","loaded":true,"busy":null,"srcKind":"blob","x":17,"y":-1154.203125,"width":130,"height":174},{"alt":"عمل Mixed 04 novel","loaded":true,"busy":null,"srcKind":"blob","x":173,"y":-867,"width":130,"height":174},{"alt":"عمل Mixed 04 novel","loaded":true,"busy":null,"srcKind":"blob","x":17,"y":-867,"width":130,"height":174},{"alt":"عمل Mixed 04 novel","loaded":true,"busy":null,"srcKind":"blob","x":173,"y":-579.796875,"width":130,"height":174},{"alt":"عمل Mixed 04 novel","loaded":true,"busy":null,"srcKind":"blob","x":17,"y":-579.796875,"width":130,"height":174},{"alt":"عمل Mixed 04 novel","loaded":true,"busy":null,"srcKind":"blob","x":173,"y":-292.59375,"width":130,"height":174},{"alt":"عمل Mixed 04 novel","loaded":true,"busy":null,"srcKind":"blob","x":17,"y":-292.59375,"width":130,"height":174},{"alt":"عمل Mixed 39 comics","loaded":true,"busy":null,"srcKind":"blob","x":169,"y":332.21875,"width":130,"height":174},{"alt":"عمل Mixed 36 manga","loaded":true,"busy":null,"srcKind":"blob","x":21,"y":332.21875,"width":130,"height":174},{"alt":"عمل Mixed 33 comics","loaded":false,"busy":null,"srcKind":"","x":-127,"y":332.21875,"width":130,"height":174},{"alt":"عمل Mixed 30 manga","loaded":false,"busy":null,"srcKind":"","x":-275,"y":332.21875,"width":130,"height":174},{"alt":"عمل Mixed 27 comics","loaded":false,"busy":null,"srcKind":"","x":-423,"y":332.21875,"width":130,"height":174},{"alt":"عمل Mixed 24 manga","loaded":false,"busy":null,"srcKind":"","x":-571,"y":332.21875,"width":130,"height":174}],"errors":0}
### Ran Playwright code
```js
await (async(page)=>({path:new URL(page.url()).pathname,scroll:await page.evaluate(()=>({y:scrollY,height:document.documentElement.scrollHeight,width:innerWidth})),images:await page.locator('img[data-public-catalog-focus]').evaluateAll(nodes=>nodes.map(i=>{const r=i.getBoundingClientRect();return {alt:i.alt,loaded:i.complete&&i.naturalWidth>0,busy:i.getAttribute('aria-busy'),srcKind:i.src.split(':')[0],x:r.x,y:r.y,width:r.width,height:r.height};})),errors:await page.getByText('تعذّر تحميل الصورة',{exact:true}).count()})
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/
- Page Title: Fury — اكتشف الأعمال المنشورة
- Console: 23 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L231-L253
````

## integration-browser-directory-diagnostic

Original capture: `integration-browser-directory-diagnostic.txt`. Bytes: 1085. SHA-256: `87817f8f02ff19dc22f7571ea786ce765dd274e9598db1cf8133b1f5bb8cdbd2`.

````text
### Result
{"url":"/categories?q=Browser","headings":["التصنيفات","روابط سريعة","الدعم","المجتمع"],"links":["Browser Category Aاستكشف الأعمال المنشورة في هذا التصنيف","Browser Category Bاستكشف الأعمال المنشورة في هذا التصنيف","Browser Category Cاستكشف الأعمال المنشورة في هذا التصنيف","#Browser Category A","#Browser Category B","#Browser Category C"]}
### Ran Playwright code
```js
await (async(page)=>({url:new URL(page.url()).pathname+new URL(page.url()).search,headings:await page.locator('h1,h2,h3').allTextContents(),links:await page.locator('a[href^="/discover?category=browser-category-"]').allTextContents()})
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/categories?q=Browser
- Page Title: التصنيفات | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L178-L182
````

## integration-browser-directory-name-search-final

Original capture: `integration-browser-directory-name-search-final.txt`. Bytes: 1668. SHA-256: `68625cc820d49b6289b92aaebbc6a9e52673dedd081c4d6ca91a3677bf60a9e4`.

````text
### Result
{"passed":true,"links":[{"href":"/discover?category=browser-category-a","text":"Browser Category A"},{"href":"/discover?category=browser-category-b","text":"Browser Category B"},{"href":"/discover?category=browser-category-c","text":"Browser Category C"}],"nativeEnterNameSearch":true,"filteredEmpty":true,"path":"/categories?q=No+matching+saved+category"}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/categories?q=Browser');const region=page.getByRole('region',{name:'قائمة التصنيفات',exact:true});await region.waitFor();const links=await region.getByRole('link').evaluateAll(nodes=>nodes.map(n=>({href:n.getAttribute('href'),text:n.querySelector('strong')?.textContent})));if(links.length!==3||links.map(r=>r.text).join(',')!=='Browser Category A,Browser Category B,Browser Category C')throw Error('Saved directory names/order mismatch');await page.getByRole('searchbox',{name:'ابحث في أسماء التصنيفات',exact:true}).fill('No matching saved category');await page.keyboard.press('Enter');await page.getByRole('heading',{name:'لا توجد نتائج مطابقة',exact:true}).waitFor();return {passed:true,links,nativeEnterNameSearch:true,filteredEmpty:true,path:new URL(page.url()).pathname+new URL(page.url()).search};})(page);
```
### Page
- Page URL: http://127.0.0.1:4316/categories?q=No+matching+saved+category
- Page Title: التصنيفات | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L198-L199
````

## integration-browser-empty-home-corrected

Original capture: `integration-browser-empty-home-corrected.txt`. Bytes: 2045. SHA-256: `13e2ec460ff6d9d2662da5cd32bf28651b4a585dad788137d5ef09988d34f3a9`.

````text
### Result
{"passed":true,"actualCommittedUnavailableCover":true,"enabledCategoriesVisible":true,"geometry":{"viewport":320,"scroll":320,"main":{"x":16,"y":346,"width":288,"height":318,"top":346,"right":304,"bottom":664,"left":16},"footer":{"x":0,"y":728,"width":320,"height":1000.375,"top":728,"right":320,"bottom":1728.375,"left":0},"shortcut":{"x":179.1875,"y":64,"width":140.8125,"height":52,"top":64,"right":320,"bottom":116,"left":179.1875},"workLinks":0}}
### Ran Playwright code
```js
await (async(page)=>{await page.setViewportSize({width:320,height:900});await page.goto('http://127.0.0.1:4316/');await page.locator('#latest-releases').waitFor();await page.getByRole('link',{name:'تصنيف محفوظ 00',exact:true}).first().waitFor();const geometry=await page.evaluate(()=>{const main=document.querySelector('#latest-releases');const footer=[...document.querySelectorAll('footer')].find(n=>n.getBoundingClientRect().height>0);const shortcuts=[...document.querySelectorAll('a[href="/discover?category=saved-category-0"]')].find(n=>n.getBoundingClientRect().height>0);return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,main:main.getBoundingClientRect().toJSON(),footer:footer.getBoundingClientRect().toJSON(),shortcut:shortcuts.getBoundingClientRect().toJSON(),workLinks:[...document.links].filter(a=>/^\/story\/[^/]+$/.test(a.pathname)).length};});if(geometry.workLinks||geometry.scroll!==320||geometry.shortcut.top<0||geometry.shortcut.bottom>geometry.footer.top)throw Error('Empty-home shortcut/layout regression');await page.screenshot({path:'/tmp/fury-p05-final-empty-home-320.png',fullPage:true});return {passed:true,actualCommittedUnavailableCover:true,enabledCategoriesVisible:true,geometry};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/
- Page Title: Fury — اكتشف الأعمال المنشورة
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L154-L155
````

## integration-browser-empty-home

Original capture: `integration-browser-empty-home.txt`. Bytes: 501. SHA-256: `8afdd3b071bc699b54a1e375f4e5d4b94136af9aa6779b14f2751c0fa8d08c77`.

```text
### Error
Error: locator.waitFor: Error: strict mode violation: locator('main') resolved to 2 elements:
    1) <main class="state-page">…</main> aka getByRole('main')
    2) <main tabindex="-1" id="latest-releases" class="page_mainCol__oqpFw" data-public-catalog-focus="">…</main> aka getByText('جارٍ تحديث المحتوى…لا يوجد محتوى منشور الآنسيظهر المحتوى هنا عند توفره')

Call log:
[2m  - waiting for locator('main') to be visible[22m

```

## integration-browser-final-design-1280

Original capture: `integration-browser-final-design-1280.txt`. Bytes: 3172. SHA-256: `c8b6dc5f4250a65a3714766597f77c0de0ca30016b499e63dfc4b4b446ee0f64`.

````text
### Result
{"passed":true,"kind":"final actual production Next/Express design captures","rows":[{"name":"home","path":"/","width":1280,"geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":23,"headings":["عمل Mixed 00 mangaعنوان بديل محفوظ"]},{"name":"discover","path":"/discover","width":1280,"geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":12,"headings":["قائمة المانجا"]},{"name":"stories","path":"/stories","width":1280,"geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":12,"headings":["الروايات والقصص النصية"]},{"name":"categories","path":"/categories","width":1280,"geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":0,"headings":["التصنيفات"]},{"name":"illustrated","path":"/story/saved-manga-0","width":1280,"geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":6,"headings":["عمل Mixed 00 manga"]},{"name":"text","path":"/story/saved-novel-4","width":1280,"geometry":{"viewport":1280,"scroll":1280,"dir":"rtl"},"loadedImages":6,"headings":["عمل Mixed 04 novel"]}]}
### Ran Playwright code
```js
await (async(page)=>{const width=1280;const rows=[];await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});for(const[name,path]of[['home','/'],['discover','/discover'],['stories','/stories'],['categories','/categories'],['illustrated','/story/saved-manga-0'],['text','/story/saved-novel-4']]){await page.goto('http://127.0.0.1:4316'+path);await page.locator('h1').first().waitFor();if(await page.getByText('تعذّر تحميل المحتوى',{exact:true}).count())throw Error('Unavailable cannot establish design');const height=await page.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<height;y+=650){await page.evaluate(async y=>{scrollTo(0,y);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},y);await page.waitForFunction(()=>![...document.querySelectorAll('img[aria-busy="true"]')].length);await page.waitForFunction(()=>[...document.querySelectorAll('img[data-public-catalog-focus]')].every(i=>{const r=i.getBoundingClientRect();return r.width===0||r.height===0||r.bottom<0||r.top>innerHeight||r.right<32||r.left>innerWidth-32||(i.complete&&i.naturalWidth>0);}));}await page.evaluate(()=>scrollTo(0,0));if(await page.getByText('تعذّر تحميل الصورة',{exact:true}).count())throw Error('Failed image cannot establish design');const geometry=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,dir:document.documentElement.dir}));if(geometry.viewport!==geometry.scroll)throw Error('Horizontal overflow '+name+' '+width);await page.screenshot({path:'/tmp/fury-p05-final-'+name+'-'+width+'.png',fullPage:true});rows.push({name,path,width,geometry,loadedImages:await page.locator('img[src^=blob]').count(),headings:await page.locator('h1').allTextContents()});}return {passed:true,kind:'final actual production Next/Express design captures',rows};}
)(page);
```
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L558-L719
````

## integration-browser-final-design-320-corrected

Original capture: `integration-browser-final-design-320-corrected.txt`. Bytes: 72. SHA-256: `cc06f20f025de33687465fd913baeaabc70a9dcc654fa2011e480ca3bd05d953`.

```text
### Error
TimeoutError: page.waitForFunction: Timeout 30000ms exceeded.
```

## integration-browser-final-design-320-final

Original capture: `integration-browser-final-design-320-final.txt`. Bytes: 3292. SHA-256: `5a8dec8c19361bed159943aaa8d1ba0c988847ade56f2d5f97ee6ccc0dd1fa5b`.

````text
### Result
{"passed":true,"kind":"final actual production Next/Express design captures","rows":[{"name":"home","path":"/","width":320,"geometry":{"viewport":320,"scroll":320,"dir":"rtl"},"loadedImages":20,"headings":["عمل Mixed 00 mangaعنوان بديل محفوظ"]},{"name":"discover","path":"/discover","width":320,"geometry":{"viewport":320,"scroll":320,"dir":"rtl"},"loadedImages":12,"headings":["قائمة المانجا"]},{"name":"stories","path":"/stories","width":320,"geometry":{"viewport":320,"scroll":320,"dir":"rtl"},"loadedImages":12,"headings":["الروايات والقصص النصية"]},{"name":"categories","path":"/categories","width":320,"geometry":{"viewport":320,"scroll":320,"dir":"rtl"},"loadedImages":0,"headings":["التصنيفات"]},{"name":"illustrated","path":"/story/saved-manga-0","width":320,"geometry":{"viewport":320,"scroll":320,"dir":"rtl"},"loadedImages":6,"headings":["عمل Mixed 00 manga"]},{"name":"text","path":"/story/saved-novel-4","width":320,"geometry":{"viewport":320,"scroll":320,"dir":"rtl"},"loadedImages":6,"headings":["عمل Mixed 04 novel"]}]}
### Ran Playwright code
```js
await (async(page)=>{const width=320;const rows=[];await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});for(const[name,path]of[['home','/'],['discover','/discover'],['stories','/stories'],['categories','/categories'],['illustrated','/story/saved-manga-0'],['text','/story/saved-novel-4']]){await page.goto('http://127.0.0.1:4316'+path);await page.locator('h1').first().waitFor();if(await page.getByText('تعذّر تحميل المحتوى',{exact:true}).count())throw Error('Unavailable cannot establish design');const height=await page.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<height;y+=650){await page.evaluate(async y=>{scrollTo(0,y);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},y);await page.waitForFunction(()=>![...document.querySelectorAll('img[aria-busy="true"]')].length);await page.waitForFunction(()=>[...document.querySelectorAll('img[data-public-catalog-focus]')].every(i=>{const r=i.getBoundingClientRect();return r.width===0||r.height===0||r.bottom<0||r.top>innerHeight||r.right<32||r.left>innerWidth-32||(i.complete&&i.naturalWidth>0);}));}await page.evaluate(()=>scrollTo(0,0));if(await page.getByText('تعذّر تحميل الصورة',{exact:true}).count())throw Error('Failed image cannot establish design');const geometry=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,dir:document.documentElement.dir}));if(geometry.viewport!==geometry.scroll)throw Error('Horizontal overflow '+name+' '+width);await page.screenshot({path:'/tmp/fury-p05-final-'+name+'-'+width+'.png',fullPage:true});rows.push({name,path,width,geometry,loadedImages:await page.locator('img[src^=blob]').count(),headings:await page.locator('h1').allTextContents()});}return {passed:true,kind:'final actual production Next/Express design captures',rows};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-novel-4
- Page Title: عمل Mixed 04 novel | Fury
- Console: 16 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L254-L404
````

## integration-browser-final-design-320

Original capture: `integration-browser-final-design-320.txt`. Bytes: 664. SHA-256: `fa43cda54b374315b83ece104fc1fb871c2d290d42b9918821126f98c0bef2c4`.

```text
### Error
TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 29998.05999999959ms exceeded.
Call log:
[2m  - attempting scroll into view action[22m
[2m    2 × waiting for element to be stable[22m
[2m      - element is not visible[22m
[2m    - retrying scroll into view action[22m
[2m    - waiting 20ms[22m
[2m    2 × waiting for element to be stable[22m
[2m      - element is not visible[22m
[2m    - retrying scroll into view action[22m
[2m      - waiting 100ms[22m
[2m    58 × waiting for element to be stable[22m
[2m       - element is not visible[22m
[2m     - retrying scroll into view action[22m
[2m       - waiting 500ms[22m

```

## integration-browser-final-design-768

Original capture: `integration-browser-final-design-768.txt`. Bytes: 3153. SHA-256: `a03d0ba457cdb594f82ce477d47b22c59dbfcb04bd6db0b9a4eaed247a2da312`.

````text
### Result
{"passed":true,"kind":"final actual production Next/Express design captures","rows":[{"name":"home","path":"/","width":768,"geometry":{"viewport":768,"scroll":768,"dir":"rtl"},"loadedImages":22,"headings":["عمل Mixed 00 mangaعنوان بديل محفوظ"]},{"name":"discover","path":"/discover","width":768,"geometry":{"viewport":768,"scroll":768,"dir":"rtl"},"loadedImages":12,"headings":["قائمة المانجا"]},{"name":"stories","path":"/stories","width":768,"geometry":{"viewport":768,"scroll":768,"dir":"rtl"},"loadedImages":12,"headings":["الروايات والقصص النصية"]},{"name":"categories","path":"/categories","width":768,"geometry":{"viewport":768,"scroll":768,"dir":"rtl"},"loadedImages":0,"headings":["التصنيفات"]},{"name":"illustrated","path":"/story/saved-manga-0","width":768,"geometry":{"viewport":768,"scroll":768,"dir":"rtl"},"loadedImages":6,"headings":["عمل Mixed 00 manga"]},{"name":"text","path":"/story/saved-novel-4","width":768,"geometry":{"viewport":768,"scroll":768,"dir":"rtl"},"loadedImages":6,"headings":["عمل Mixed 04 novel"]}]}
### Ran Playwright code
```js
await (async(page)=>{const width=768;const rows=[];await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});for(const[name,path]of[['home','/'],['discover','/discover'],['stories','/stories'],['categories','/categories'],['illustrated','/story/saved-manga-0'],['text','/story/saved-novel-4']]){await page.goto('http://127.0.0.1:4316'+path);await page.locator('h1').first().waitFor();if(await page.getByText('تعذّر تحميل المحتوى',{exact:true}).count())throw Error('Unavailable cannot establish design');const height=await page.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<height;y+=650){await page.evaluate(async y=>{scrollTo(0,y);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},y);await page.waitForFunction(()=>![...document.querySelectorAll('img[aria-busy="true"]')].length);await page.waitForFunction(()=>[...document.querySelectorAll('img[data-public-catalog-focus]')].every(i=>{const r=i.getBoundingClientRect();return r.width===0||r.height===0||r.bottom<0||r.top>innerHeight||r.right<32||r.left>innerWidth-32||(i.complete&&i.naturalWidth>0);}));}await page.evaluate(()=>scrollTo(0,0));if(await page.getByText('تعذّر تحميل الصورة',{exact:true}).count())throw Error('Failed image cannot establish design');const geometry=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,dir:document.documentElement.dir}));if(geometry.viewport!==geometry.scroll)throw Error('Horizontal overflow '+name+' '+width);await page.screenshot({path:'/tmp/fury-p05-final-'+name+'-'+width+'.png',fullPage:true});rows.push({name,path,width,geometry,loadedImages:await page.locator('img[src^=blob]').count(),headings:await page.locator('h1').allTextContents()});}return {passed:true,kind:'final actual production Next/Express design captures',rows};}
)(page);
```
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L405-L557
````

## integration-browser-final-login

Original capture: `integration-browser-final-login.txt`. Bytes: 997. SHA-256: `f7cc4caea68e1563cbaa9032a80f59b98b3dcd974a8a00582e422f29431ff296`.

````text
### Result
{"passed":true,"actualAdministratorRelogin":true,"path":"/dashboard"}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('closeout-browser-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill('<redacted disposable password>');await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/admin','/dashboard'].includes(url.pathname));return {passed:true,actualAdministratorRelogin:true,path:new URL(page.url()).pathname};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/dashboard
- Page Title: لوحة الحساب | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L202
````

## integration-browser-final-reader-diagnostic

Original capture: `integration-browser-final-reader-diagnostic.txt`. Bytes: 915. SHA-256: `100c553312b1ae2832f1b0b4d5e3ff90b39ae729e85ca528d11b6ad83b8b2896`.

````text
### Result
{"path":"/auth/login","title":"تسجيل الدخول | Fury","headings":["مرحبًا بعودتك","روابط سريعة","الدعم","المجتمع"],"alerts":["تسجيل الدخول | Fury"],"images":[]}
### Ran Playwright code
```js
await (async(page)=>({path:new URL(page.url()).pathname,title:await page.title(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),images:await page.locator('img').evaluateAll(nodes=>nodes.map(i=>({loaded:i.complete&&i.naturalWidth>0,srcKind:i.src.split(':')[0]})))})
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/auth/login
- Page Title: تسجيل الدخول | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L200-L201
````

## integration-browser-framework-robots-diagnostic

Original capture: `integration-browser-framework-robots-diagnostic.txt`. Bytes: 1143. SHA-256: `5db4fb0e5be275bfbf9cd37858f5d9f928650e92831a4de15660eccb81d47f8d`.

````text
### Result
{"head":[{"html":"<meta name=\"robots\" content=\"index, follow\">","parent":"HEAD","previous":"<meta name=\"description\" content=\"Saved by the actual administrator browser flow for public catalog verification.\">","next":"<link rel=\"canonical\" href=\"https://fury.example.test/story/browser-illustrated\">"},{"html":"<meta name=\"robots\" content=\"noindex\">","parent":"BODY","previous":"<script>self.__next_f.push([1,\"18:I[62520,[],\\\"IconMark\\\"]\\ne:null\\n13:[[\\\"$\\\",\\\"title\\\",\\\"0\\\",{\\\"children\\\":\\\"العمل غير موجود | Fury\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"description\\\",\\\"content\\\":\\\"","next":"<script>document.querySelectorAll('body link[rel=\"icon\"], body link[rel=\"apple-touch-icon\"]').forEach(el => document.head.appendChild(el))</script>"}]}
### Ran Playwright code
```js
await (async(page)=>({head:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>({html:n.outerHTML,parent:n.parentElement.tagName,previous:n.previousElementSibling?.outerHTML.slice(0,200),next:n.nextElementSibling?.outerHTML.slice(0,200)})))})
)(page);
```
````

## integration-browser-keyboard-motion

Original capture: `integration-browser-keyboard-motion.txt`. Bytes: 1926. SHA-256: `24a0db2a4b61858d3c5c515bdbbaec415a39130b8517180a0ece11a16970d5f4`.

````text
### Result
{"passed":true,"chapterKeyboardScroll":{"before":{"top":0,"height":400,"total":616,"tabIndex":0},"after":{"top":59,"outline":"solid","outlineWidth":"3px"}},"publicSemantics":{"reducedMotion":true,"dir":"rtl","communityLink":false,"trending":false,"fixtureReaderLinks":0}}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/saved-manga-0');const list=page.getByRole('region',{name:'قائمة الفصول',exact:true});await list.waitFor();await list.focus();const before=await list.evaluate(n=>({top:n.scrollTop,height:n.clientHeight,total:n.scrollHeight,tabIndex:n.tabIndex}));await page.keyboard.press('PageDown');await page.waitForFunction(()=>document.querySelector('[aria-label="قائمة الفصول"]')?.scrollTop>0);const after=await list.evaluate(n=>({top:n.scrollTop,outline:getComputedStyle(n).outlineStyle,outlineWidth:getComputedStyle(n).outlineWidth}));await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4316/');const result=await page.evaluate(()=>({reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,dir:document.documentElement.dir,communityLink:[...document.links].some(a=>a.href.includes('discord')),trending:!!document.getElementById('trending'),fixtureReaderLinks:[...document.links].filter(a=>/\/story\/[^/]+\/chapter\//.test(a.pathname)).length}));if(!result.reducedMotion||result.dir!=='rtl'||result.communityLink||result.trending||result.fixtureReaderLinks)throw Error('Public semantics mismatch');return {passed:true,chapterKeyboardScroll:{before,after},publicSemantics:result};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/
- Page Title: Fury — اكتشف الأعمال المنشورة
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L133-L138
````

## integration-browser-p03-t106-no-reload

Original capture: `integration-browser-p03-t106-no-reload.txt`. Bytes: 7796. SHA-256: `eee983ee2cbbaba8939c6ee7446d27f7e2b5cff06bc91ac2e48e649225658d24`.

````text
### Result
{"passed":true,"administratorReloaded":false,"editorWithoutReload":{"url":"http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit","draftControlsVisible":true,"savedState":"الحالة المحفوظة: مسودة"},"negativeRetryAfterFailedAutomaticWithdrawal":false,"realAdministratorInSeparateContext":true,"anonymousPublicContextPreserved":true,"initialTitle":"Browser illustrated عمل | Fury","withdrawn":{"title":"العمل غير موجود | Fury","robots":["noindex, nofollow","noindex"],"socialImages":0,"focus":{"tag":"BODY","outline":"none","outlineWidth":"3px"}},"recovered":{"title":"Browser illustrated عمل | Fury","robots":["index, follow"],"focus":{"tag":"DIV","label":"تفاصيل العمل","outline":"solid","outlineWidth":"3px"}},"reads":[{"path":"/story/browser-illustrated","status":200,"rsc":false},{"path":"/api/v1/content/works/browser-illustrated/cover","status":200,"rsc":false},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":404,"rsc":false},{"path":"/story/browser-illustrated","status":200,"rsc":true},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":404,"rsc":false},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":200,"rsc":false},{"path":"/story/browser-illustrated","status":200,"rsc":true},{"path":"/api/v1/content/works/browser-illustrated/cover","status":200,"rsc":false},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":200,"rsc":false}]}
### Ran Playwright code
```js
await (async(page)=>{
 const negative=false;
 const browser=page.context().browser();if(!browser)throw Error('Owned browser cannot create an isolated administrator context');
 const context=await browser.newContext({viewport:{width:1280,height:900}});const admin=await context.newPage();
 const pattern='**/api/v1/content/catalog/works/browser-illustrated';let release;const gate=new Promise(done=>{release=done;});let intercepted;const held=new Promise(done=>{intercepted=done;});let first=true;const reads=[];
 let phase="login";const adminReads=[];admin.on("response",r=>{if(r.url().includes("/api/v1/")&&r.request().method()!=="GET")adminReads.push({path:new URL(r.url()).pathname,method:r.request().method(),status:r.status()});});const listener=r=>{const u=new URL(r.url());if(u.pathname.includes('browser-illustrated'))reads.push({path:u.pathname,status:r.status(),rsc:u.searchParams.has('_rsc')});};
 try{
  await admin.goto('http://127.0.0.1:4316/auth/login');await admin.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('closeout-browser-admin@example.test');await admin.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill('<redacted disposable password>');await admin.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await admin.waitForURL(u=>['/dashboard','/admin'].includes(u.pathname));
  await admin.goto('http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit');
  const publish=admin.getByRole('button',{name:'حفظ ونشر',exact:true});const unpublish=admin.getByRole('button',{name:'إلغاء النشر',exact:true});await publish.or(unpublish).first().waitFor();if(await publish.isVisible())await publish.click();await unpublish.waitFor();
  const prime=admin.waitForResponse(r=>r.request().method()==='PUT'&&r.url().endsWith('/publication'));await unpublish.click();await prime;await publish.waitFor();await publish.click();await unpublish.waitFor();
  await page.unroute(pattern);await page.route(pattern,async route=>{if(first){first=false;intercepted();await gate;}await route.continue();});
  page.on('response',listener);await page.goto('http://127.0.0.1:4316/story/browser-illustrated');await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).waitFor();await held;const initialTitle=await page.title();
  phase='unpublish';const mutation=admin.waitForResponse(r=>r.request().method()==='PUT'&&r.url().endsWith('/publication'));await unpublish.click();const committed=await mutation;const transition=await committed.json();if(committed.status()!==200||transition.data?.transition.publicationStatus!=='draft')throw Error('Unpublication not committed');phase='withdraw';release();
  await page.getByRole('heading',{name:'العمل غير موجود',exact:true}).waitFor();
  let boundedFailure;
  if(negative){await page.waitForFunction(()=>document.title.includes('المحتوى غير متاح مؤقتًا'));boundedFailure={title:await page.title(),visibleRetry:await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).count()};await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).focus();await page.keyboard.press('Enter');}
  await page.waitForFunction(()=>document.title.includes('العمل غير موجود')&&[...document.querySelectorAll('meta[name="robots"]')].some(n=>n.content.includes('noindex'))&&!document.querySelector('meta[property="og:image"]'));
  if(negative)await page.waitForFunction(()=>document.activeElement?.hasAttribute('data-public-catalog-focus'));
  const withdrawn={title:await page.title(),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content)),socialImages:await page.locator('meta[property="og:image"]').count(),focus:await page.evaluate(()=>({tag:document.activeElement.tagName,outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth}))};
  phase='republish';await publish.waitFor();const editorWithoutReload={url:admin.url(),draftControlsVisible:await publish.isVisible(),savedState:await admin.getByText('الحالة المحفوظة: مسودة',{exact:true}).textContent()};await publish.click();await unpublish.waitFor();phase='recover';await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).waitFor();await page.waitForFunction(()=>document.title.startsWith('Browser illustrated عمل')&&document.activeElement?.getAttribute('aria-label')==='تفاصيل العمل'&&[...document.querySelectorAll('meta[name="robots"]')].every(n=>!n.content.includes('noindex')));
  const recovered={title:await page.title(),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content)),focus:await page.evaluate(()=>({tag:document.activeElement.tagName,label:document.activeElement.getAttribute('aria-label'),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth}))};
  if(!reads.some(r=>r.path.includes('/content/catalog/works/')&&r.status===404)||!reads.some(r=>r.rsc))throw Error('Actual denial/server synchronization missing');
  return {passed:true,administratorReloaded:false,editorWithoutReload,negativeRetryAfterFailedAutomaticWithdrawal:negative,realAdministratorInSeparateContext:true,anonymousPublicContextPreserved:true,initialTitle,boundedFailure,withdrawn,recovered,reads};
 }catch(error){throw Error(JSON.stringify({phase,error:String(error),adminReads,publicReads:reads,adminAlerts:await admin.getByRole('alert').allTextContents(),adminText:(await admin.locator('main').first().textContent()).slice(-1000),publicTitle:await page.title(),publicHeadings:await page.locator('h1,h2').allTextContents()}));}finally{release();page.off('response',listener);await page.unroute(pattern);await context.close();}
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: Browser illustrated عمل | Fury
- Console: 8 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L849-L856
````

## integration-browser-partial-category-disable

Original capture: `integration-browser-partial-category-disable.txt`. Bytes: 1114. SHA-256: `6e094bc79588f61abd0d56521330f368d87013d25a3b766227dffbc8f64b483b`.

````text
### Result
{"kind":"actual administrator permitted partial category disable","category":"browser-category-a","savedRow":"Browser Category Abrowser-category-aمعطّل٣٢١ تعديلتفعيل"}
### Ran Playwright code
```js
await (async(page)=>{
 await page.goto("http://127.0.0.1:4316/admin/categories");
 await page.getByRole("textbox",{name:"البحث في التصنيفات"}).fill("Browser Category A");
 const row=page.getByRole("row").filter({hasText:"Browser Category A"});
 await row.getByRole("button",{name:"تعطيل",exact:true}).click();
 const dialog=page.getByRole("dialog",{name:"تعطيل التصنيف",exact:true});
 await dialog.getByRole("button",{name:"تعطيل التصنيف",exact:true}).click();
 await dialog.waitFor({state:"hidden"});await row.getByText("معطّل",{exact:true}).waitFor();
 return {kind:"actual administrator permitted partial category disable",category:"browser-category-a",savedRow:await row.textContent()};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/categories
- Page Title: إدارة التصنيفات | لوحة إدارة Fury
````

## integration-browser-public-journey

Original capture: `integration-browser-public-journey.txt`. Bytes: 202. SHA-256: `f1411bd26628537bbb8fbe92dff8641ff2ca82836998def251162440fc241222`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: 'لا توجد نتائج مطابقة', exact: true }) to be visible[22m

```

## integration-browser-public-part1

Original capture: `integration-browser-public-part1.txt`. Bytes: 3963. SHA-256: `3bfd73ac9acaca5b51bb2cc485bc258bc455c4d670d47fbd1b9cc4453db96aea`.

````text
### Result
{"kind":"real persisted discovery and URL history journey","passed":true,"results":[{"case":"pagination, copied URL, reload, back and forward","first":["browser-illustrated","browser-text","saved-manga-0","saved-manhwa-1","saved-manhua-2","saved-comics-3","saved-novel-4","saved-text-story-5","saved-manga-6","saved-manhwa-7","saved-manhua-8","saved-comics-9"],"second":["saved-novel-10","saved-text-story-11","saved-manga-12","saved-manhwa-13","saved-manhua-14","saved-comics-15","saved-novel-16","saved-text-story-17","saved-manga-18","saved-manhwa-19","saved-manhua-20","saved-comics-21"],"copiedPath":"/discover?sort=title-asc&page=2"},{"case":"search/type with filter page reset","types":["manga","manhwa","manhua","comics","novel","text-story"],"selection":"?q=Mixed&type=novel&sort=title-asc","works":["saved-novel-4","saved-novel-10","saved-novel-16","saved-novel-22","saved-novel-28","saved-novel-34","saved-novel-40"]}]}
### Ran Playwright code
```js
await (async (page) => {
  const ensure=(ok,message)=>{if(!ok)throw new Error(message);};
  const results=[];
  const base="http://127.0.0.1:4316";
  const slugs=()=>page.locator('section[aria-label="نتائج اكتشاف الأعمال"] h3').evaluateAll(nodes=>nodes.map(node=>node.closest("a").getAttribute("href").split("/").at(-1)));
  await page.setViewportSize({width:1280,height:900});
  await page.goto(base+"/discover?sort=title-asc");
  await page.getByRole("region",{name:"نتائج اكتشاف الأعمال"}).waitFor();
  const first=await slugs();ensure(first.length===12,"Discovery first page must be bounded at 12");
  await page.getByRole("link",{name:"التالي",exact:true}).click();
  await page.waitForURL(url=>url.searchParams.get("page")==="2");
  await page.getByText("الصفحة 2 من 4",{exact:true}).waitFor();
  const second=await slugs();ensure(!second.some(slug=>first.includes(slug)),"Pagination repeated a Work");
  const copied=page.url();await page.reload();await page.getByText("الصفحة 2 من 4",{exact:true}).waitFor();
  ensure(JSON.stringify(await slugs())===JSON.stringify(second),"Reload changed stable page order");
  await page.goBack();await page.getByRole("region",{name:"نتائج اكتشاف الأعمال"}).waitFor();
  ensure(!new URL(page.url()).searchParams.has("page"),"Back lost first-page URL");
  await page.goForward();await page.getByText("الصفحة 2 من 4",{exact:true}).waitFor();
  ensure(JSON.stringify(await slugs())===JSON.stringify(second),"Forward changed stable page");
  results.push({case:"pagination, copied URL, reload, back and forward",first,second,copiedPath:new URL(copied).pathname+new URL(copied).search});
  const typeOptions=await page.locator('#discover-type option').evaluateAll(nodes=>nodes.map(node=>node.value).filter(Boolean));
  ensure(typeOptions.length===6,"Discovery must expose all six types");
  await page.locator('#discover-query').fill("Mixed");await page.locator('#discover-type').selectOption("novel");
  await page.getByRole("button",{name:"البحث",exact:true}).click();
  await page.waitForURL(url=>url.searchParams.get("type")==="novel"&&!url.searchParams.has("page"));
  await page.getByRole("region",{name:"نتائج اكتشاف الأعمال"}).waitFor();
  ensure((await slugs()).every(slug=>slug.startsWith("saved-novel")),"Type filter leaked another type");
  ensure(await page.locator('#discover-query').inputValue()==="Mixed","Search selection lost");
  results.push({case:"search/type with filter page reset",types:typeOptions,selection:new URL(page.url()).search,works:await slugs()});
  return {kind:"real persisted discovery and URL history journey",passed:true,results};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/discover?q=Mixed&type=novel&sort=title-asc
- Page Title: اكتشف الأعمال | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L54-L60
````

## integration-browser-public-part2

Original capture: `integration-browser-public-part2.txt`. Bytes: 2478. SHA-256: `b8b6a89257e08519f50da6b8099a77a83fef29f45b58259510adf547a4b32071`.

````text
### Result
{"kind":"real anonymous Next/Express persisted catalog journey","results":[{"case":"text-only restriction and real pagination","works":["browser-text","saved-text-story-41","saved-novel-40","saved-text-story-35","saved-novel-34","saved-text-story-29","saved-novel-28","saved-text-story-23","saved-novel-22","saved-text-story-17","saved-novel-16","saved-text-story-11"]},{"case":"unknown category retained","state":"filtered-empty"},{"case":"repeated and invalid query","normalizedPath":"/discover"}]}
### Ran Playwright code
```js
await (async (page) => {
  const ensure=(ok,message)=>{if(!ok)throw new Error(message);};
  const results=[];
  const base="http://127.0.0.1:4316";
  const slugs=()=>page.locator('section[aria-label="نتائج اكتشاف الأعمال"] h3').evaluateAll(nodes=>nodes.map(node=>node.closest("a").getAttribute("href").split("/").at(-1)));
  await page.goto(base+"/stories?type=manga");
  await page.getByRole("region",{name:"نتائج اكتشاف الأعمال"}).waitFor();
  ensure(new URL(page.url()).search==="","Stories did not normalize excluded type");
  ensure((await slugs()).every(slug=>slug.includes("novel")||slug.includes("text-story")||slug==="browser-text"),"Stories leaked illustration");
  ensure(await page.getByRole("link",{name:"التالي",exact:true}).count()===1,"Stories must have a second page");
  results.push({case:"text-only restriction and real pagination",works:await slugs()});
  await page.goto(base+"/discover?category=unknown-category");
  await page.getByRole("heading",{name:"لا توجد نتائج مطابقة",exact:true}).waitFor();
  ensure(await page.locator('#discover-category').inputValue()==="unknown-category","Unknown category selection was lost");
  results.push({case:"unknown category retained",state:"filtered-empty"});
  await page.goto(base+"/discover?q=first&q=second&page=bad");
  await page.getByRole("region",{name:"نتائج اكتشاف الأعمال"}).waitFor();
  ensure(new URL(page.url()).search==="","Ambiguous query was not normalized");
  results.push({case:"repeated and invalid query",normalizedPath:new URL(page.url()).pathname});
  return {kind:"real anonymous Next/Express persisted catalog journey",results};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/discover
- Page Title: اكتشف الأعمال | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L61-L64
````

## integration-browser-publication-inspect

Original capture: `integration-browser-publication-inspect.txt`. Bytes: 1345. SHA-256: `f2c7fbd03cd4d70f9afc380828336318cad48fef0046225cfa4e961ac53f4171`.

````text
### Result
{"path":"/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit","buttons":["","","","إزالة المعاينة المحلية","معاينة الوسيط","اختيار هذا الوسيط","إزالة الغلاف عند الحفظ","","معاينة الوسيط","اختيار هذا الوسيط","إلغاء والعودة","حفظ التعديلات","إلغاء النشر","أرشفة العمل"],"alerts":[""],"invalid":0}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit');await page.getByRole('button',{name:'حفظ ونشر',exact:true}).or(page.getByRole('button',{name:'إلغاء النشر',exact:true})).first().waitFor();return {path:new URL(page.url()).pathname,buttons:await page.getByRole('button').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),invalid:await page.locator(':invalid').count()};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit
- Page Title: تعديل العمل (fe1afaa5-d050-495c-8690-29b9f925599a) | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L89
````

## integration-browser-reader-anonymous-post-t082

Original capture: `integration-browser-reader-anonymous-post-t082.txt`. Bytes: 593. SHA-256: `22671c83b77794646cbefa6fe27cca977f0e7dcf45d90510ea3f8569747f721d`.

````text
### Result
{"passed":true,"anonymousReaderRedirect":"/auth/login","readerSourcePreserved":true}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/1/chapter/1');await page.waitForURL(url=>url.pathname==='/auth/login');return {passed:true,anonymousReaderRedirect:'/auth/login',readerSourcePreserved:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/auth/login
- Page Title: تسجيل الدخول | Fury
- Console: 17 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L720-L736
````

## integration-browser-reader-anonymous

Original capture: `integration-browser-reader-anonymous.txt`. Bytes: 592. SHA-256: `fa0f1760ca359c113c075f24480a3a4d5db8d82547216662ec3deb561fbdba4d`.

````text
### Result
{"passed":true,"anonymousReaderRedirect":"/auth/login","readerSourcePreserved":true}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/1/chapter/1');await page.waitForURL(url=>url.pathname==='/auth/login');return {passed:true,anonymousReaderRedirect:'/auth/login',readerSourcePreserved:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/auth/login
- Page Title: تسجيل الدخول | Fury
- Console: 17 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L99-L115
````

## integration-browser-reader-final-accepted

Original capture: `integration-browser-reader-final-accepted.txt`. Bytes: 283. SHA-256: `026c3e6348ec050aec34b87d4b5674010a0c7b7d4cfa17931b0ffde31634763c`.

```text
### Error
TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://127.0.0.1:4316/story/1/chapter/02"
============================================================
```

## integration-browser-reader-post-t082-confirmed

Original capture: `integration-browser-reader-post-t082-confirmed.txt`. Bytes: 1058. SHA-256: `006c783d1dbcf656daf4e2475b0dca96cd9a190878c5231eb87078202e22a453`.

````text
### Result
{"passed":true,"kind":"final post-T082 real authenticated fixture reader navigation","path":"/story/1/chapter/02","title":"Trait Hoarder - الفصل 02"}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/1/chapter/1');await page.getByRole('heading',{name:'Trait Hoarder - الفصل 01',exact:true}).waitFor();await page.getByTitle('الفصل التالي',{exact:true}).click();await page.waitForURL(url=>/\/chapter\/0?2$/.test(url.pathname));await page.getByRole('heading',{name:'Trait Hoarder - الفصل 02',exact:true}).waitFor();return {passed:true,kind:'final post-T082 real authenticated fixture reader navigation',path:new URL(page.url()).pathname,title:await page.getByRole('heading',{level:1}).textContent()};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/1/chapter/02
- Page Title: Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L203
````

## integration-browser-reader-post-t082

Original capture: `integration-browser-reader-post-t082.txt`. Bytes: 194. SHA-256: `9369893e9b99b8fcbab116edcbebd243061b1e9e15576b40ca4784f937d4e0e9`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: 'Trait Hoarder - الفصل 01', exact: true }) to be visible[22m

```

## integration-browser-real-rate-recovery

Original capture: `integration-browser-real-rate-recovery.txt`. Bytes: 942. SHA-256: `dd7cce558d9476cac681770e200ee8850c374923f7a7039c43005b09888e9ae4`.

````text
### Result
{"kind":"actual real429 unavailable state recovered after existing rate window","state":"filtered-empty","focus":{"tag":"P","text":"0 نتيجة"},"query":"?category=unknown-category","limitWasNotChanged":true}
### Ran Playwright code
```js
await (async(page)=>{
  const retry=page.getByRole("button",{name:"إعادة المحاولة",exact:true});
  await retry.focus();await retry.press("Enter");
  await page.getByRole("heading",{name:"لا توجد نتائج مطابقة",exact:true}).waitFor();
  const focus=await page.evaluate(()=>({tag:document.activeElement?.tagName,text:document.activeElement?.textContent}));
  if(focus.tag!=="P"||!focus.text.includes("0"))throw Error("Keyboard retry focus was not restored to the result");
  return {kind:"actual real429 unavailable state recovered after existing rate window",state:"filtered-empty",focus,query:new URL(page.url()).search,limitWasNotChanged:true};
}
)(page);
```
````

## integration-browser-recovery-diagnostic

Original capture: `integration-browser-recovery-diagnostic.txt`. Bytes: 817. SHA-256: `f39bac4ae406630d40c44f0297432213feb8a685d5ee4c24007fcdf8cd7ff754`.

````text
### Result
{"path":"/story/browser-illustrated","title":"المحتوى غير متاح مؤقتًا | Fury","headings":["تعذّر تحميل المحتوى"],"alerts":[""],"images":[]}
### Ran Playwright code
```js
await (async(page)=>({path:new URL(page.url()).pathname,title:await page.title(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),images:await page.locator('img').evaluateAll(nodes=>nodes.map(i=>({loaded:i.complete&&i.naturalWidth>0,srcKind:i.src.split(':')[0]})))})
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: المحتوى غير متاح مؤقتًا | Fury
- Console: 2 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L195
````

## integration-browser-republication-confirmed

Original capture: `integration-browser-republication-confirmed.txt`. Bytes: 1875. SHA-256: `06287e06c85f00258e6330442819ded012f7f5f55d0e0912357b9985dd766127`.

````text
### Result
{"passed":true,"actualAdministratorRepublication":true,"result":[{"slug":"browser-illustrated","alreadyPublishedByPriorHarness":true,"publicResult":{"status":200,"slug":"browser-illustrated","chapters":1}},{"slug":"browser-text","alreadyPublishedByPriorHarness":false,"publicResult":{"status":200,"slug":"browser-text","chapters":1}}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a'],['browser-text','b6b1e172-5a47-4e8f-9ddc-9e2728726e98']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/edit');const publish=page.getByRole('button',{name:'حفظ ونشر',exact:true});const unpublish=page.getByRole('button',{name:'إلغاء النشر',exact:true});await publish.or(unpublish).first().waitFor();const already=await unpublish.count()>0;if(!already)await publish.click();await unpublish.waitFor();const publicResult=await page.evaluate(async slug=>{const response=await fetch('http://127.0.0.1:4315/api/v1/content/catalog/works/'+slug,{credentials:'omit'});const body=await response.json();return {status:response.status,slug:body.data?.work.slug,chapters:body.data?.chapters.pagination.total};},slug);if(publicResult.status!==200||publicResult.slug!==slug)throw Error('Actual public republication missing');result.push({slug,alreadyPublishedByPriorHarness:already,publicResult});}return {passed:true,actualAdministratorRepublication:true,result};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/b6b1e172-5a47-4e8f-9ddc-9e2728726e98/edit
- Page Title: تعديل العمل (b6b1e172-5a47-4e8f-9ddc-9e2728726e98) | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L90-L95
````

## integration-browser-republication

Original capture: `integration-browser-republication.txt`. Bytes: 106. SHA-256: `f075ba6a9d5b8c0110d4c7d227ec6be85b985338992fba4a24ea6ad0a7883249`.

```text
### Error
TimeoutError: page.waitForResponse: Timeout 30000ms exceeded while waiting for event "response"
```

## integration-browser-retry-focus-before

Original capture: `integration-browser-retry-focus-before.txt`. Bytes: 1628. SHA-256: `cb578b30be47c8eae2cb5ec274b6a80c8a7f690c8578aed70e644856dbb94b72`.

````text
### Result
{"kind":"actual keyboard retry focus probe before correction","controlledFailures":1,"retryHadFocus":true,"focusAfterSuccess":{"tag":"BODY","text":"FURYالرئيسيةالتصنيفاتقائمة المانجاالروايات والقصص النصيةالبحث في جميع الأعمالدخولقائمة الم"}}
### Ran Playwright code
```js
await (async (page) => {
  const pattern="**/api/v1/content/catalog/works?**";
  let blocked=true;let failures=0;
  await page.route(pattern,route=>{if(blocked){failures++;return route.fulfill({status:503,contentType:"application/json",body:"{}"});}return route.continue();});
  try {
    await page.goto("http://127.0.0.1:4316/discover?sort=title-asc");
    const retry=page.getByRole("button",{name:"إعادة المحاولة",exact:true});
    await retry.waitFor();await retry.focus();
    const before=await retry.evaluate(node=>document.activeElement===node);
    blocked=false;await retry.press("Enter");
    await page.getByRole("region",{name:"نتائج اكتشاف الأعمال"}).waitFor();
    return {kind:"actual keyboard retry focus probe before correction",controlledFailures:failures,retryHadFocus:before,focusAfterSuccess:await page.evaluate(()=>({tag:document.activeElement?.tagName,text:document.activeElement?.textContent?.slice(0,90)}))};
  } finally {await page.unroute(pattern);}
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/discover?sort=title-asc
- Page Title: اكتشف الأعمال | Fury
- Console: 2 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L28-L30
````

## integration-browser-retry-inspection

Original capture: `integration-browser-retry-inspection.txt`. Bytes: 1587. SHA-256: `1e65c7f2c5eb1a41f490c9e10f9250b614dc1592a55386280437779035a880aa`.

````text
### Result
{"reads":[{"path":"/api/v1/content/catalog/works/browser-illustrated","status":200,"slug":"browser-illustrated"}],"title":"Browser illustrated عمل | Fury","headings":["العمل غير موجود"],"body":"العمل غير موجودهذا العمل غير متاح للعرض.إعادة المحاولة","focused":{"tag":"DIV","label":null}}
### Ran Playwright code
```js
await (async(page)=>{const reads=[];const listener=async r=>{if(r.url().includes('/content/')||r.url().includes('_rsc')){const item={path:new URL(r.url()).pathname,status:r.status()};try{const b=await r.json();item.code=b.code;item.slug=b.data?.work?.slug;}catch{}reads.push(item);}};page.on('response',listener);const response=page.waitForResponse(r=>r.url().includes('/content/catalog/works/browser-illustrated'));await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).click();await response;await page.waitForFunction(()=>!document.querySelector('[aria-busy="true"]'));page.off('response',listener);return {reads,title:await page.title(),headings:await page.locator('h1,h2').allTextContents(),body:(await page.locator('main').first().textContent()).slice(0,400),focused:await page.evaluate(()=>({tag:document.activeElement.tagName,label:document.activeElement.getAttribute('aria-label')}))};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: المحتوى غير متاح مؤقتًا | Fury
- Console: 4 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L196-L197
````

## integration-browser-retry-recovery-confirmed

Original capture: `integration-browser-retry-recovery-confirmed.txt`. Bytes: 191. SHA-256: `d8b66e71342ade4a795fee8397d8b6b1f7c1c13de80d401c8a94821d78c3c283`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: 'Browser illustrated عمل', exact: true }) to be visible[22m

```

## integration-browser-signed-diagnostic

Original capture: `integration-browser-signed-diagnostic.txt`. Bytes: 1254. SHA-256: `d04b3049a96f3adc1f6ef77f676c737bc1478d64da30d1062b8743c3c924f6d5`.

````text
### Result
{"path":"/story/1/chapter/1","title":"Fury","headings":["Trait Hoarder - الفصل 01","تعليقات الفصل","روابط سريعة","الدعم","المجتمع"],"alerts":[""],"images":[{"loaded":true,"srcKind":"https"},{"loaded":true,"srcKind":"https"},{"loaded":true,"srcKind":"https"},{"loaded":true,"srcKind":"https"},{"loaded":false,"srcKind":"https"},{"loaded":false,"srcKind":"https"},{"loaded":false,"srcKind":"https"},{"loaded":false,"srcKind":"https"},{"loaded":true,"srcKind":"https"},{"loaded":true,"srcKind":"https"},{"loaded":true,"srcKind":"https"}]}
### Ran Playwright code
```js
await (async(page)=>({path:new URL(page.url()).pathname,title:await page.title(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),images:await page.locator('img').evaluateAll(nodes=>nodes.map(i=>({loaded:i.complete&&i.naturalWidth>0,srcKind:i.src.split(':')[0]})))})
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/1/chapter/1
- Page Title: Fury
- Console: 0 errors, 1 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L80-L88
````

## integration-browser-signed-public-accepted

Original capture: `integration-browser-signed-public-accepted.txt`. Bytes: 189. SHA-256: `be80710d4be6de16998bce72125bc2a0f39e24eaffb48debeff123635ee39304`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('region', { name: 'نتائج اكتشاف الأعمال' }) to be visible[22m

```

## integration-browser-signed-public-complete

Original capture: `integration-browser-signed-public-complete.txt`. Bytes: 3670. SHA-256: `52e0a15e2c2400fc93f4368490042a05acfaac57a0a701baef337148cf28fe28`.

````text
### Result
{"passed":true,"actualSignedInCookieNames":["refreshToken","csrfToken"],"signedInPublicJsonAndBlobAuthorityOmitted":true,"reads":[{"path":"/api/v1/content/catalog/categories","credentialHeaderNames":[]},{"path":"/api/v1/content/catalog/works","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-comics-39/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-manhua-38/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-text-story-41/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/works/browser-text/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/works/browser-illustrated/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-novel-40/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-manga-36/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/catalog/categories","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-manhwa-37/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-text-story-35/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-novel-34/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-manga-0/cover","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-manga-0/background","credentialHeaderNames":[]},{"path":"/api/v1/content/catalog/works/saved-manga-0","credentialHeaderNames":[]}],"fixtureReaderPath":"/story/1/chapter/1","fixtureHeading":"Trait Hoarder - الفصل 01","protectedReaderAvailable":true}
### Ran Playwright code
```js
await (async(page)=>{const reads=[];const listener=async request=>{if(request.url().includes('/api/v1/content/')&&request.method()==='GET'){const h=await request.allHeaders();reads.push({path:new URL(request.url()).pathname,credentialHeaderNames:Object.keys(h).filter(k=>['cookie','authorization','x-csrf-token'].includes(k))});}};page.on('request',listener);const cookieNames=(await page.context().cookies()).map(c=>c.name);if(!cookieNames.includes('refreshToken')||!cookieNames.includes('csrfToken'))throw Error('Signed-in fixture authority not present');await page.goto('http://127.0.0.1:4316/discover');await page.getByRole('region',{name:'نتائج اكتشاف الأعمال'}).waitFor();const json=page.waitForResponse(r=>r.url().includes('/content/catalog/categories?page=2')&&r.status()===200);await page.locator('#discover-category').selectOption('__next');await json;await page.goto('http://127.0.0.1:4316/story/saved-manga-0');await page.waitForFunction(()=>[...document.images].some(i=>i.src.startsWith('blob:')&&i.complete&&i.naturalWidth>0));page.off('request',listener);if(!reads.some(r=>r.path.endsWith('/cover'))||!reads.some(r=>r.path.endsWith('/catalog/categories')))throw Error('Actual JSON/Blob reads missing '+JSON.stringify(reads));if(reads.some(r=>r.credentialHeaderNames.length))throw Error('Public credentials leaked');await page.goto('http://127.0.0.1:4316/story/1/chapter/1');await page.getByRole('heading',{name:'Trait Hoarder - الفصل 01',exact:true}).waitFor();await page.getByTitle('الفصل التالي',{exact:true}).waitFor();return {passed:true,actualSignedInCookieNames:cookieNames,signedInPublicJsonAndBlobAuthorityOmitted:true,reads,fixtureReaderPath:new URL(page.url()).pathname,fixtureHeading:'Trait Hoarder - الفصل 01',protectedReaderAvailable:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/1/chapter/1
- Page Title: Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L96-L107
````

## integration-browser-signed-public-reader-confirmed

Original capture: `integration-browser-signed-public-reader-confirmed.txt`. Bytes: 212. SHA-256: `17c75525e3d801294f8f5b0388b25bbe310d4dd54eaf2ae47fb92d4dad0dd067`.

```text
### Error
Error: Missing actual public reads [{"path":"/api/v1/content/works/saved-manga-0/background","credentialHeaderNames":[]},{"path":"/api/v1/content/works/saved-manga-0/cover","credentialHeaderNames":[]}]
```

## integration-browser-signed-public-reader-diagnostic

Original capture: `integration-browser-signed-public-reader-diagnostic.txt`. Bytes: 187. SHA-256: `f54f1fad0b14dacfbc721f8ab96fe7734b5685086c2ffb8e0e6fe29c6156cc2d`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: 'الفصل التالي', exact: true }) to be visible[22m

```

## integration-browser-signed-public-reader-final

Original capture: `integration-browser-signed-public-reader-final.txt`. Bytes: 45. SHA-256: `3d3779f433cf221a86eb9ced3e97462e3c11fa28cbb135eff563b16e806ec762`.

```text
### Error
Error: Missing actual public reads
```

## integration-browser-signed-public-reader

Original capture: `integration-browser-signed-public-reader.txt`. Bytes: 45. SHA-256: `3d3779f433cf221a86eb9ced3e97462e3c11fa28cbb135eff563b16e806ec762`.

```text
### Error
Error: Missing actual public reads
```

## integration-browser-sort-choices-final

Original capture: `integration-browser-sort-choices-final.txt`. Bytes: 2076. SHA-256: `c8f1d6035685787e246242bba0bb834173b019edb245d7b1d50eb9c994e1e72b`.

````text
### Result
{"passed":true,"sorts":[{"sort":"newest","titles":["Browser illustrated عمل","عمل Mixed 36 manga","عمل Mixed 30 manga","عمل Mixed 24 manga","عمل Mixed 18 manga","عمل Mixed 12 manga","عمل Mixed 06 manga","عمل Mixed 00 manga"]},{"sort":"chapter-latest","titles":["Browser illustrated عمل","عمل Mixed 00 manga","عمل Mixed 24 manga","عمل Mixed 18 manga","عمل Mixed 06 manga","عمل Mixed 30 manga","عمل Mixed 36 manga","عمل Mixed 12 manga"]},{"sort":"title-asc","titles":["Browser illustrated عمل","عمل Mixed 00 manga","عمل Mixed 06 manga","عمل Mixed 12 manga","عمل Mixed 18 manga","عمل Mixed 24 manga","عمل Mixed 30 manga","عمل Mixed 36 manga"]},{"sort":"title-desc","titles":["عمل Mixed 36 manga","عمل Mixed 30 manga","عمل Mixed 24 manga","عمل Mixed 18 manga","عمل Mixed 12 manga","عمل Mixed 06 manga","عمل Mixed 00 manga","Browser illustrated عمل"]}]}
### Ran Playwright code
```js
await (async(page)=>{const sorts=[];for(const sort of ['newest','chapter-latest','title-asc','title-desc']){await page.goto('http://127.0.0.1:4316/discover?type=manga&sort='+sort);await page.getByRole('region',{name:'نتائج اكتشاف الأعمال'}).waitFor();if(await page.locator('#discover-sort').inputValue()!==sort)throw Error('Sort URL lost');sorts.push({sort,titles:await page.locator('section[aria-label="نتائج اكتشاف الأعمال"] h3').allTextContents()});}const asc=sorts.find(r=>r.sort==='title-asc').titles;const desc=sorts.find(r=>r.sort==='title-desc').titles;if(JSON.stringify([...asc].reverse())!==JSON.stringify(desc))throw Error('Actual title sort not reversed');return {passed:true,sorts};})(page);
```
### Page
- Page URL: http://127.0.0.1:4316/discover?type=manga&sort=title-desc
- Page Title: اكتشف الأعمال | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L183-L197
````

## integration-browser-sort-choices

Original capture: `integration-browser-sort-choices.txt`. Bytes: 189. SHA-256: `be80710d4be6de16998bce72125bc2a0f39e24eaffb48debeff123635ee39304`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('region', { name: 'نتائج اكتشاف الأعمال' }) to be visible[22m

```

## integration-browser-ssr-denial-cards

Original capture: `integration-browser-ssr-denial-cards.txt`. Bytes: 1152. SHA-256: `5e8b87941d5d5984f2de640e5b2009d72b9f5fa9bb6c971d62efb446e26b2854`.

````text
### Result
{"passed":true,"cachedPublicCards":["Browser text عمل","Browser illustrated عمل","عمل Mixed 41 text-story","عمل Mixed 40 novel","عمل Mixed 39 comics","عمل Mixed 38 manhua","عمل Mixed 37 manhwa","عمل Mixed 36 manga","عمل Mixed 35 text-story","عمل Mixed 34 novel","عمل Mixed 33 comics","عمل Mixed 32 manhua"],"prefetchAbortedOnly":true}
### Ran Playwright code
```js
await (async(page)=>{await page.route('**/*_rsc*',async route=>{if(route.request().headers()['next-router-prefetch']==='1')await route.abort();else await route.continue();});await page.getByRole('link',{name:'قائمة المانجا',exact:true}).first().click();await page.waitForURL('**/discover');await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).waitFor();return {passed:true,cachedPublicCards:await page.locator('h3').allTextContents(),prefetchAbortedOnly:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/discover
- Page Title: اكتشف الأعمال | Fury
- Console: 12 errors, 2 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L83-L95
````

## integration-browser-ssr-denial-navigation

Original capture: `integration-browser-ssr-denial-navigation.txt`. Bytes: 1279. SHA-256: `8e4c81a8c8b93ca9f8faac90390365c76d6407d20198280b2daca0cc906728e8`.

````text
### Result
{"passed":true,"action":"same SPA navigation after real administrator unpublication","reads":[{"path":"/story/browser-illustrated","rsc":true,"status":200},{"path":"/api/v1/content/catalog/works/browser-illustrated","rsc":false,"status":404}],"oldWorkAbsent":true}
### Ran Playwright code
```js
await (async(page)=>{const reads=[];page.on('response',r=>{if(r.url().includes('/story/browser-illustrated')||r.url().includes('/catalog/works/browser-illustrated'))reads.push({path:new URL(r.url()).pathname,rsc:new URL(r.url()).searchParams.has('_rsc'),status:r.status()});});await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).locator('..').click();await page.waitForURL('**/story/browser-illustrated');await page.getByRole('heading',{name:'العمل غير موجود',exact:true}).waitFor();if(await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).count())throw Error('Cached Work leaked');return {passed:true,action:'same SPA navigation after real administrator unpublication',reads,oldWorkAbsent:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Console: 14 errors, 3 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L96-L98
````

## integration-browser-ssr-denial-seed

Original capture: `integration-browser-ssr-denial-seed.txt`. Bytes: 798. SHA-256: `c6737add899d36e70166bb3671a93a6b59da2a5e9cdca086179c53a5f2c06a8d`.

````text
### Result
{"passed":true,"action":"same SPA QueryClient retained published detail before administrator unpublication"}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/browser-illustrated');await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).waitFor();await page.getByRole('link',{name:'التصنيفات',exact:true}).first().click();await page.waitForURL('**/categories');return {passed:true,action:'same SPA QueryClient retained published detail before administrator unpublication'};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/categories
- Page Title: التصنيفات | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L81-L82
````

## integration-browser-ssr-loading

Original capture: `integration-browser-ssr-loading.txt`. Bytes: 952. SHA-256: `5fea2fa01d453d088024771447d839760014422a17835b6c5cf77db861d22c27`.

````text
### Result
{"kind":"actual Next SSR initial streaming loading while upstream is held","pending":true,"loadingText":["جارٍ تحميل المحتوىننتظر البيانات المنشورة، يرجى الانتظار."],"privateOriginExposed":false}
### Ran Playwright code
```js
await (async(page)=>{
  await page.goto("http://127.0.0.1:4316/discover",{waitUntil:"commit"});
  await page.getByRole("heading",{name:"جارٍ تحميل المحتوى",exact:true}).waitFor();
  return {kind:"actual Next SSR initial streaming loading while upstream is held",pending:true,loadingText:await page.getByRole("status").allTextContents(),privateOriginExposed:await page.locator("body").textContent().then(text=>text.includes("localhost:4317"))};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/discover
- Page Title: اكتشف الأعمال | Fury
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L65
````

## integration-browser-ssr-recovery-focus

Original capture: `integration-browser-ssr-recovery-focus.txt`. Bytes: 191. SHA-256: `d8b66e71342ade4a795fee8397d8b6b1f7c1c13de80d401c8a94821d78c3c283`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: 'Browser illustrated عمل', exact: true }) to be visible[22m

```

## integration-browser-ssr-recovery-start

Original capture: `integration-browser-ssr-recovery-start.txt`. Bytes: 708. SHA-256: `827deda309a4fdf0c8595cb03c7fe3ad95a6d59ed5118a6c63e9b88cfb2650fc`.

````text
### Result
{"passed":true,"hiddenWorkBoundary":true,"loadedFromActualNext":true}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/browser-illustrated');await page.getByRole('heading',{name:'العمل غير موجود',exact:true}).waitFor();await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).waitFor();return {passed:true,hiddenWorkBoundary:true,loadedFromActualNext:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: العمل غير موجود | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L194
````

## integration-browser-ssr-released

Original capture: `integration-browser-ssr-released.txt`. Bytes: 992. SHA-256: `db44eaffad02b6e8f482f8ce4c9fc1c90281b5f2c75c7e54add116329770293a`.

````text
### Result
{"kind":"actual held SSR read released to the real persisted API","recovered":true,"works":["Browser text عمل","Browser illustrated عمل","عمل Mixed 41 text-story","عمل Mixed 40 novel","عمل Mixed 39 comics","عمل Mixed 38 manhua","عمل Mixed 37 manhwa","عمل Mixed 36 manga","عمل Mixed 35 text-story","عمل Mixed 34 novel","عمل Mixed 33 comics","عمل Mixed 32 manhua"]}
### Ran Playwright code
```js
await (async(page)=>{
  await page.getByRole("region",{name:"نتائج اكتشاف الأعمال"}).waitFor();
  return {kind:"actual held SSR read released to the real persisted API",recovered:true,works:await page.locator('section[aria-label="نتائج اكتشاف الأعمال"] h3').allTextContents()};
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/discover
- Page Title: اكتشف الأعمال | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L66
````

## integration-browser-status-sort-diagnostic

Original capture: `integration-browser-status-sort-diagnostic.txt`. Bytes: 1221. SHA-256: `d176d0a4ab38c11336d9c06a635ac291e1bbd612876a3c3aa1fa50a579182f56`.

````text
### Result
{"path":"/discover?type=manga&sort=title-desc","headings":["قائمة المانجا","تعذّر تحميل المحتوى","روابط سريعة","الدعم","المجتمع"],"paragraphs":["المحتوى غير متاح مؤقتًا. يمكنك إعادة المحاولة."],"selects":[{"id":"discover-category","name":"category","value":""},{"id":"discover-status","name":"status","value":""},{"id":"discover-type","name":"type","value":"manga"},{"id":"discover-sort","name":"sort","value":"title-desc"}]}
### Ran Playwright code
```js
await (async(page)=>({path:new URL(page.url()).pathname+new URL(page.url()).search,headings:await page.locator('h1,h2').allTextContents(),paragraphs:await page.locator('main p').allTextContents(),selects:await page.locator('select').evaluateAll(nodes=>nodes.map(n=>({id:n.id,name:n.name,value:n.value})))})
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/discover?type=manga&sort=title-desc
- Page Title: اكتشف الأعمال | Fury
- Console: 3 errors, 1 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L156-L174
````

## integration-browser-status-sort-directory

Original capture: `integration-browser-status-sort-directory.txt`. Bytes: 189. SHA-256: `be80710d4be6de16998bce72125bc2a0f39e24eaffb48debeff123635ee39304`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('region', { name: 'نتائج اكتشاف الأعمال' }) to be visible[22m

```

## integration-browser-t082-final-acceptance

Original capture: `integration-browser-t082-final-acceptance.txt`. Bytes: 1666. SHA-256: `2812125071c2185500222a02c29e19844a20ba24c1f546b3ba2e9cf11b992d82`.

````text
### Result
{"passed":true,"action":"same-SPA keyboard retry after real administrator republication with refreshed framework boundary","path":"/story/browser-illustrated","focused":{"tag":"DIV","label":"تفاصيل العمل","outline":"solid","outlineWidth":"3px"},"metadataTitle":"Browser illustrated عمل | Fury","robots":["index, follow"]}
### Ran Playwright code
```js
await (async(page)=>{const button=page.getByRole('button',{name:'إعادة المحاولة',exact:true});await button.focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).waitFor();await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='تفاصيل العمل');const focused=await page.evaluate(()=>({tag:document.activeElement.tagName,label:document.activeElement.getAttribute('aria-label'),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth}));const robots=await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content));if(robots.some(v=>v.includes('noindex')))throw Error('Recovered page retained latched noindex');return {passed:true,action:'same-SPA keyboard retry after real administrator republication with refreshed framework boundary',path:new URL(page.url()).pathname,focused,metadataTitle:await page.title(),robots};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: Browser illustrated عمل | Fury
- Console: 7 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L225-L230
````

## integration-browser-t082-final-hidden

Original capture: `integration-browser-t082-final-hidden.txt`. Bytes: 708. SHA-256: `1704f0c32cdd365c8898fb3423633ba2b219580cb90c74c02ca886062b1b3825`.

````text
### Result
{"passed":true,"hiddenWorkBoundary":true,"loadedFromActualNext":true}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/browser-illustrated');await page.getByRole('heading',{name:'العمل غير موجود',exact:true}).waitFor();await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).waitFor();return {passed:true,hiddenWorkBoundary:true,loadedFromActualNext:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: العمل غير موجود | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L216
````

## integration-browser-t082-final-republish

Original capture: `integration-browser-t082-final-republish.txt`. Bytes: 1495. SHA-256: `6f6dad9eeba72059d9a182cc6474610509cd563976c22474ad4917a8c7002f58`.

````text
### Result
{"passed":true,"actualAdministratorRepublication":true,"result":[{"slug":"browser-illustrated","alreadyPublishedByPriorHarness":false,"publicResult":{"status":200,"slug":"browser-illustrated","chapters":1}}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/edit');const publish=page.getByRole('button',{name:'حفظ ونشر',exact:true});const unpublish=page.getByRole('button',{name:'إلغاء النشر',exact:true});await publish.or(unpublish).first().waitFor();const already=await unpublish.count()>0;if(!already)await publish.click();await unpublish.waitFor();const publicResult=await page.evaluate(async slug=>{const response=await fetch('http://127.0.0.1:4315/api/v1/content/catalog/works/'+slug,{credentials:'omit'});const body=await response.json();return {status:response.status,slug:body.data?.work.slug,chapters:body.data?.chapters.pagination.total};},slug);if(publicResult.status!==200||publicResult.slug!==slug)throw Error('Actual public republication missing');result.push({slug,alreadyPublishedByPriorHarness:already,publicResult});}return {passed:true,actualAdministratorRepublication:true,result};}
)(page);
```
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L127-L132
````

## integration-browser-t082-final-unpublish

Original capture: `integration-browser-t082-final-unpublish.txt`. Bytes: 1352. SHA-256: `3dbe102bbebc190b34f003d3ffbb60d7de12baccee7c9c652a421a61f4e9f280`.

````text
### Result
{"passed":true,"action":"actual administrator unpublish","result":[{"slug":"browser-illustrated","status":200,"savedDraft":true}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/edit');await page.getByRole('button',{name:'إلغاء النشر',exact:true}).or(page.getByRole('button',{name:'حفظ ونشر',exact:true})).first().waitFor();if(await page.getByRole('button',{name:'إلغاء النشر',exact:true}).count()){const pending=page.waitForResponse(r=>r.request().method()==='PUT'&&r.url().endsWith('/publication'));await page.getByRole('button',{name:'إلغاء النشر',exact:true}).click();const actual=await pending;if(!actual.ok())throw Error('Unpublish failed');}else { result.push({slug,savedDraft:true,actionAlreadyPersistedByPriorHarness:true});continue; }await page.getByRole('button',{name:'حفظ ونشر',exact:true}).waitFor();result.push({slug,status:200,savedDraft:true});}return {passed:true,action:'actual administrator unpublish',result};}
)(page);
```
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L121-L126
````

## integration-browser-t082-focus-inspection

Original capture: `integration-browser-t082-focus-inspection.txt`. Bytes: 964. SHA-256: `ba91edeacbfb6c6c0472392352019fd7cb610becb2a4490d1e7f5349445fccec`.

````text
### Result
{"title":"Browser illustrated عمل | Fury","headings":["Browser illustrated عمل"],"robots":["index, follow","noindex"],"focused":{"tag":"BODY","label":null,"id":"","tabIndex":-1},"regions":1}
### Ran Playwright code
```js
await (async(page)=>({title:await page.title(),headings:await page.locator('h1').allTextContents(),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content)),focused:await page.evaluate(()=>({tag:document.activeElement.tagName,label:document.activeElement.getAttribute('aria-label'),id:document.activeElement.id,tabIndex:document.activeElement.tabIndex})),regions:await page.locator('[aria-label="تفاصيل العمل"]').count()})
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: Browser illustrated عمل | Fury
- Console: 7 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L210-L215
````

## integration-browser-t082-focus2-hidden

Original capture: `integration-browser-t082-focus2-hidden.txt`. Bytes: 708. SHA-256: `e89dcfe76206bec96976ee4347a9f9bc470eaa633b45f77f38457b81df7b2ee5`.

````text
### Result
{"passed":true,"hiddenWorkBoundary":true,"loadedFromActualNext":true}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/browser-illustrated');await page.getByRole('heading',{name:'العمل غير موجود',exact:true}).waitFor();await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).waitFor();return {passed:true,hiddenWorkBoundary:true,loadedFromActualNext:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: العمل غير موجود | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L224
````

## integration-browser-t082-focus2-republish

Original capture: `integration-browser-t082-focus2-republish.txt`. Bytes: 1495. SHA-256: `dbce910603b50e3a1754fcba478ed55c7c9bcebaf3240c818a617b7657c42dad`.

````text
### Result
{"passed":true,"actualAdministratorRepublication":true,"result":[{"slug":"browser-illustrated","alreadyPublishedByPriorHarness":false,"publicResult":{"status":200,"slug":"browser-illustrated","chapters":1}}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/edit');const publish=page.getByRole('button',{name:'حفظ ونشر',exact:true});const unpublish=page.getByRole('button',{name:'إلغاء النشر',exact:true});await publish.or(unpublish).first().waitFor();const already=await unpublish.count()>0;if(!already)await publish.click();await unpublish.waitFor();const publicResult=await page.evaluate(async slug=>{const response=await fetch('http://127.0.0.1:4315/api/v1/content/catalog/works/'+slug,{credentials:'omit'});const body=await response.json();return {status:response.status,slug:body.data?.work.slug,chapters:body.data?.chapters.pagination.total};},slug);if(publicResult.status!==200||publicResult.slug!==slug)throw Error('Actual public republication missing');result.push({slug,alreadyPublishedByPriorHarness:already,publicResult});}return {passed:true,actualAdministratorRepublication:true,result};}
)(page);
```
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L140-L145
````

## integration-browser-t082-focus2-unpublish

Original capture: `integration-browser-t082-focus2-unpublish.txt`. Bytes: 1546. SHA-256: `928553c1ec7849aafb6a3a0fcbd5c9e5dfe4f4814501f3bb85096259773f61d8`.

````text
### Result
{"passed":true,"action":"actual administrator unpublish","result":[{"slug":"browser-illustrated","status":200,"savedDraft":true}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/edit');await page.getByRole('button',{name:'إلغاء النشر',exact:true}).or(page.getByRole('button',{name:'حفظ ونشر',exact:true})).first().waitFor();if(await page.getByRole('button',{name:'إلغاء النشر',exact:true}).count()){const pending=page.waitForResponse(r=>r.request().method()==='PUT'&&r.url().endsWith('/publication'));await page.getByRole('button',{name:'إلغاء النشر',exact:true}).click();const actual=await pending;if(!actual.ok())throw Error('Unpublish failed');}else { result.push({slug,savedDraft:true,actionAlreadyPersistedByPriorHarness:true});continue; }await page.getByRole('button',{name:'حفظ ونشر',exact:true}).waitFor();result.push({slug,status:200,savedDraft:true});}return {passed:true,action:'actual administrator unpublish',result};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit
- Page Title: تعديل العمل (fe1afaa5-d050-495c-8690-29b9f925599a) | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L139
````

## integration-browser-t082-hidden

Original capture: `integration-browser-t082-hidden.txt`. Bytes: 713. SHA-256: `1a2aa3edf0735688d7ab6f9f53dba4ad86826c5bdb191fcf95aa691529d506f6`.

````text
### Result
{"passed":true,"hiddenWorkBoundary":true,"loadedFromActualNext":true}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/browser-illustrated');await page.getByRole('heading',{name:'العمل غير موجود',exact:true}).waitFor();await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).waitFor();return {passed:true,hiddenWorkBoundary:true,loadedFromActualNext:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: العمل غير موجود | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L198-L209
````

## integration-browser-t082-post-focus-diagnostic

Original capture: `integration-browser-t082-post-focus-diagnostic.txt`. Bytes: 954. SHA-256: `50c2437a2d23ee9ae2143e14b8d69af92a0b65687fcac6eeb601d0c7ec3ed6d7`.

````text
### Result
{"title":"Browser illustrated عمل | Fury","headings":["Browser illustrated عمل"],"robots":["index, follow"],"focused":{"tag":"BODY","label":null,"id":"","tabIndex":-1},"regions":1}
### Ran Playwright code
```js
await (async(page)=>({title:await page.title(),headings:await page.locator('h1').allTextContents(),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content)),focused:await page.evaluate(()=>({tag:document.activeElement.tagName,label:document.activeElement.getAttribute('aria-label'),id:document.activeElement.id,tabIndex:document.activeElement.tabIndex})),regions:await page.locator('[aria-label="تفاصيل العمل"]').count()})
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: Browser illustrated عمل | Fury
- Console: 8 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L217-L223
````

## integration-browser-t082-recovery-final

Original capture: `integration-browser-t082-recovery-final.txt`. Bytes: 72. SHA-256: `cc06f20f025de33687465fd913baeaabc70a9dcc654fa2011e480ca3bd05d953`.

```text
### Error
TimeoutError: page.waitForFunction: Timeout 30000ms exceeded.
```

## integration-browser-t082-recovery-focus

Original capture: `integration-browser-t082-recovery-focus.txt`. Bytes: 72. SHA-256: `cc06f20f025de33687465fd913baeaabc70a9dcc654fa2011e480ca3bd05d953`.

```text
### Error
TimeoutError: page.waitForFunction: Timeout 30000ms exceeded.
```

## integration-browser-t082-republish

Original capture: `integration-browser-t082-republish.txt`. Bytes: 1495. SHA-256: `491a56fabba7dfb5eaa9a089f8a1d72162b643f8d832cd4cff7b16fdbd0fef1f`.

````text
### Result
{"passed":true,"actualAdministratorRepublication":true,"result":[{"slug":"browser-illustrated","alreadyPublishedByPriorHarness":false,"publicResult":{"status":200,"slug":"browser-illustrated","chapters":1}}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/edit');const publish=page.getByRole('button',{name:'حفظ ونشر',exact:true});const unpublish=page.getByRole('button',{name:'إلغاء النشر',exact:true});await publish.or(unpublish).first().waitFor();const already=await unpublish.count()>0;if(!already)await publish.click();await unpublish.waitFor();const publicResult=await page.evaluate(async slug=>{const response=await fetch('http://127.0.0.1:4315/api/v1/content/catalog/works/'+slug,{credentials:'omit'});const body=await response.json();return {status:response.status,slug:body.data?.work.slug,chapters:body.data?.chapters.pagination.total};},slug);if(publicResult.status!==200||publicResult.slug!==slug)throw Error('Actual public republication missing');result.push({slug,alreadyPublishedByPriorHarness:already,publicResult});}return {passed:true,actualAdministratorRepublication:true,result};}
)(page);
```
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L115-L120
````

## integration-browser-t082-unpublish

Original capture: `integration-browser-t082-unpublish.txt`. Bytes: 1551. SHA-256: `b898400543a3e80f1f05ec2157539bec35aaa1fd267f7944522c55a40c4e6617`.

````text
### Result
{"passed":true,"action":"actual administrator unpublish","result":[{"slug":"browser-illustrated","status":200,"savedDraft":true}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/edit');await page.getByRole('button',{name:'إلغاء النشر',exact:true}).or(page.getByRole('button',{name:'حفظ ونشر',exact:true})).first().waitFor();if(await page.getByRole('button',{name:'إلغاء النشر',exact:true}).count()){const pending=page.waitForResponse(r=>r.request().method()==='PUT'&&r.url().endsWith('/publication'));await page.getByRole('button',{name:'إلغاء النشر',exact:true}).click();const actual=await pending;if(!actual.ok())throw Error('Unpublish failed');}else { result.push({slug,savedDraft:true,actionAlreadyPersistedByPriorHarness:true});continue; }await page.getByRole('button',{name:'حفظ ونشر',exact:true}).waitFor();result.push({slug,status:200,savedDraft:true});}return {passed:true,action:'actual administrator unpublish',result};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit
- Page Title: تعديل العمل (fe1afaa5-d050-495c-8690-29b9f925599a) | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L109-L114
````

## integration-browser-t083-access-diagnostic

Original capture: `integration-browser-t083-access-diagnostic.txt`. Bytes: 1374. SHA-256: `f67ee6e807dc7eecf72d3c6cf9d0f110a1e76f3784cc6e4bc2680d7bc829fe23`.

````text
### Result
{"found":true,"denied":true,"browserDenied":true,"revision":1,"queries":[{"sameClientQuery":true,"errorClassMatches":true,"isNotFound":true,"errorCode":"NOT_FOUND"}]}
### Ran Playwright code
```js
await (async(page)=>{return page.getByRole('main').first().evaluate(node=>{let runtime;window.webpackChunk_N_E.push([['fury-owned-read-diagnostic'],{},r=>{runtime=r;}]);const access=runtime(55344);const errors=runtime(39040);const key=Object.keys(node).find(k=>k.startsWith('__reactFiber$'));let f=node[key];let feature;let client;while(f){if(f.memoizedProps?.slug==='browser-illustrated')feature=f;if(f.memoizedProps?.client&&typeof f.memoizedProps.client.getQueryCache==='function')client=f.memoizedProps.client;f=f.return;}if(!feature||!client)return {found:false};let hook=feature.memoizedState;const queries=[];while(hook){const observer=hook.memoizedState;if(observer&&typeof observer.getCurrentQuery==='function'){const q=observer.getCurrentQuery();const error=q.state.error;queries.push({sameClientQuery:client.getQueryCache().get(q.queryHash)===q,errorClassMatches:error instanceof errors.et,isNotFound:errors.$I(error),errorCode:error?.code});}hook=hook.next;}return {found:true,denied:access.ki(client,'browser-illustrated'),browserDenied:access.r1(client,'browser-illustrated'),revision:access.x$(client,'browser-illustrated'),queries};});}
)(page);
```
````

## integration-browser-t083-administrator-ready

Original capture: `integration-browser-t083-administrator-ready.txt`. Bytes: 1411. SHA-256: `070a6018b929b277b8a1240c802ce5a08430f6a7ded84841a0ee740c5e8c7a25`.

````text
### Result
{"passed":true,"actualAdministratorReady":true,"reloginNeeded":false,"workPublished":true}
### Ran Playwright code
```js
await (async(page)=>{const url='http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit';await page.goto(url);const email=page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true});const unpublish=page.getByRole('button',{name:'إلغاء النشر',exact:true});await email.or(unpublish).first().waitFor();let loggedIn=false;if(await email.isVisible()){await email.fill('closeout-browser-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill('<redacted disposable password>');await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));loggedIn=true;await page.goto(url);}await unpublish.waitFor();return {passed:true,actualAdministratorReady:true,reloginNeeded:loggedIn,workPublished:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit
- Page Title: تعديل العمل (fe1afaa5-d050-495c-8690-29b9f925599a) | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L204-L205
````

## integration-browser-t083-administrator-unpublish

Original capture: `integration-browser-t083-administrator-unpublish.txt`. Bytes: 1352. SHA-256: `6a65b00d8684f3d4e3bc6308c572770057f0af15df7e541dbedbdd33eb709d18`.

````text
### Result
{"passed":true,"action":"actual administrator unpublish","result":[{"slug":"browser-illustrated","status":200,"savedDraft":true}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/edit');await page.getByRole('button',{name:'إلغاء النشر',exact:true}).or(page.getByRole('button',{name:'حفظ ونشر',exact:true})).first().waitFor();if(await page.getByRole('button',{name:'إلغاء النشر',exact:true}).count()){const pending=page.waitForResponse(r=>r.request().method()==='PUT'&&r.url().endsWith('/publication'));await page.getByRole('button',{name:'إلغاء النشر',exact:true}).click();const actual=await pending;if(!actual.ok())throw Error('Unpublish failed');}else { result.push({slug,savedDraft:true,actionAlreadyPersistedByPriorHarness:true});continue; }await page.getByRole('button',{name:'حفظ ونشر',exact:true}).waitFor();result.push({slug,status:200,savedDraft:true});}return {passed:true,action:'actual administrator unpublish',result};}
)(page);
```
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L206-L211
````

## integration-browser-t083-auto-recovery

Original capture: `integration-browser-t083-auto-recovery.txt`. Bytes: 1535. SHA-256: `e7c1ee717e3c49fb29e1891ee95c1d54e2f679c741be16f129c8ee62c82d2355`.

````text
### Result
{"passed":true,"actualInitialSsrUnavailable":true,"actualBrowserWorkSuccess":true,"automaticRefreshes":1,"title":"عمل Mixed 00 manga | Fury","robots":["index, follow"]}
### Ran Playwright code
```js
await (async(page)=>{const refreshes=[];const listener=r=>{const url=new URL(r.url());if(url.pathname==='/story/saved-manga-0'&&url.searchParams.has('_rsc'))refreshes.push(r.status());};page.on('response',listener);const response=await page.goto('http://127.0.0.1:4316/story/saved-manga-0');const html=await response.text();if(!html.includes('المحتوى غير متاح مؤقتًا'))throw Error('Initial SSR outage not exercised');await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).waitFor();await page.waitForFunction(()=>document.title.startsWith('عمل Mixed 00 manga')&&[...document.querySelectorAll('meta[name="robots"]')].every(n=>!n.content.includes('noindex')));page.off('response',listener);if(refreshes.length!==1)throw Error('Expected one automatic metadata synchronization '+refreshes.length);return {passed:true,actualInitialSsrUnavailable:true,actualBrowserWorkSuccess:true,automaticRefreshes:refreshes.length,title:await page.title(),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content))};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-manga-0
- Page Title: عمل Mixed 00 manga | Fury
- Console: 10 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L748-L757
````

## integration-browser-t083-auto-withdrawal

Original capture: `integration-browser-t083-auto-withdrawal.txt`. Bytes: 193. SHA-256: `24932105139c0f4cc97468564b72ff1d0f51751d9ed63ff469e13fcfdfe0fa82`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: 'العمل غير موجود', exact: true }) to be visible[22m

```

## integration-browser-t083-bounded-failure

Original capture: `integration-browser-t083-bounded-failure.txt`. Bytes: 1627. SHA-256: `0e1fc9d76b6530c91d7e7c26c7f7f3b4f949b29cff7e7be4e65b22043c650e74`.

````text
### Result
{"passed":true,"constantServer503":true,"browserSuccesses":2,"automaticServerRefreshes":1,"boundedAcrossTemplateRemount":true,"title":"المحتوى غير متاح مؤقتًا | Fury","robots":["noindex, nofollow"]}
### Ran Playwright code
```js
await (async(page)=>{let successful=0;let release;const second=new Promise(done=>{release=done;});const refreshes=[];const listener=r=>{const url=new URL(r.url());if(url.pathname==='/api/v1/content/catalog/works/saved-manga-0'&&r.status()===200){successful++;if(successful===2)release();}if(url.pathname==='/story/saved-manga-0'&&url.searchParams.has('_rsc'))refreshes.push(r.status());};page.on('response',listener);await page.goto('http://127.0.0.1:4316/story/saved-manga-0');await second;await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).waitFor();page.off('response',listener);if(refreshes.length!==1)throw Error('Repeated unavailable server refresh loop '+refreshes.length);const title=await page.title();if(!title.includes('المحتوى غير متاح مؤقتًا'))throw Error('Failed server read misrepresented');return {passed:true,constantServer503:true,browserSuccesses:successful,automaticServerRefreshes:refreshes.length,boundedAcrossTemplateRemount:true,title,robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content))};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-manga-0
- Page Title: المحتوى غير متاح مؤقتًا | Fury
- Console: 10 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L758-L767
````

## integration-browser-t083-explicit-prepare

Original capture: `integration-browser-t083-explicit-prepare.txt`. Bytes: 1244. SHA-256: `b7ebaeb1616d96b453208a77356f9e11660f0ff5251d25d72d71dd2130412b00`.

````text
### Result
{"passed":true,"existingRetrySurfaceExposedByControlledBrowserFailure":true}
### Ran Playwright code
```js
await (async(page)=>{let failed=false;await page.route('**/api/v1/content/catalog/works/saved-manga-0',async route=>{if(!failed){failed=true;await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({success:false,statusCode:503,code:'SERVICE_UNAVAILABLE',message:'Controlled browser read failure.',requestId:'owned-browser-fault',timestamp:new Date().toISOString(),path:'/content/catalog/works/:workSlug'})});}else await route.continue();});const response=page.waitForResponse(r=>r.url().includes('/content/catalog/works/saved-manga-0')&&r.status()===503);await page.evaluate(()=>window.dispatchEvent(new Event('visibilitychange')));await response;await page.getByRole('heading',{name:'تعذّر تحميل المحتوى',exact:true}).waitFor();return {passed:true,existingRetrySurfaceExposedByControlledBrowserFailure:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-manga-0
- Page Title: المحتوى غير متاح مؤقتًا | Fury
- Console: 15 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L768-L772
````

## integration-browser-t083-explicit-retry

Original capture: `integration-browser-t083-explicit-retry.txt`. Bytes: 1515. SHA-256: `528af690d0cc51423294c4196ec2765100a2915ff140790fe1ff22c6e7fad19e`.

````text
### Result
{"passed":true,"explicitRetryAfterExhaustedAutomaticAttempt":true,"title":"عمل Mixed 00 manga | Fury","focus":{"tag":"DIV","label":"تفاصيل العمل","outline":"solid","outlineWidth":"3px"},"robots":["index, follow"]}
### Ran Playwright code
```js
await (async(page)=>{await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).waitFor();await page.waitForFunction(()=>document.title.startsWith('عمل Mixed 00 manga')&&document.activeElement?.getAttribute('aria-label')==='تفاصيل العمل'&&[...document.querySelectorAll('meta[name="robots"]')].every(n=>!n.content.includes('noindex')));await page.unroute('**/api/v1/content/catalog/works/saved-manga-0');return {passed:true,explicitRetryAfterExhaustedAutomaticAttempt:true,title:await page.title(),focus:await page.evaluate(()=>({tag:document.activeElement.tagName,label:document.activeElement.getAttribute('aria-label'),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth})),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content))};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-manga-0
- Page Title: عمل Mixed 00 manga | Fury
- Console: 20 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L773-L777
````

## integration-browser-t083-final-admin-withdrawal

Original capture: `integration-browser-t083-final-admin-withdrawal.txt`. Bytes: 193. SHA-256: `24932105139c0f4cc97468564b72ff1d0f51751d9ed63ff469e13fcfdfe0fa82`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: 'العمل غير موجود', exact: true }) to be visible[22m

```

## integration-browser-t083-final-auto

Original capture: `integration-browser-t083-final-auto.txt`. Bytes: 1535. SHA-256: `c6c5e3c15bfb56c3d6f2758bc5bb26656253d178a4a58c2086bfb3a4691ab4a5`.

````text
### Result
{"passed":true,"actualInitialSsrUnavailable":true,"actualBrowserWorkSuccess":true,"automaticRefreshes":1,"title":"عمل Mixed 00 manga | Fury","robots":["index, follow"]}
### Ran Playwright code
```js
await (async(page)=>{const refreshes=[];const listener=r=>{const url=new URL(r.url());if(url.pathname==='/story/saved-manga-0'&&url.searchParams.has('_rsc'))refreshes.push(r.status());};page.on('response',listener);const response=await page.goto('http://127.0.0.1:4316/story/saved-manga-0');const html=await response.text();if(!html.includes('المحتوى غير متاح مؤقتًا'))throw Error('Initial SSR outage not exercised');await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).waitFor();await page.waitForFunction(()=>document.title.startsWith('عمل Mixed 00 manga')&&[...document.querySelectorAll('meta[name="robots"]')].every(n=>!n.content.includes('noindex')));page.off('response',listener);if(refreshes.length!==1)throw Error('Expected one automatic metadata synchronization '+refreshes.length);return {passed:true,actualInitialSsrUnavailable:true,actualBrowserWorkSuccess:true,automaticRefreshes:refreshes.length,title:await page.title(),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content))};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-manga-0
- Page Title: عمل Mixed 00 manga | Fury
- Console: 10 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L778-L787
````

## integration-browser-t083-final-bounded

Original capture: `integration-browser-t083-final-bounded.txt`. Bytes: 2451. SHA-256: `2a6062b522e6fdfb1c802ec11ad98dc855f8b09de02f1d9ec13a0ccd572196b9`.

````text
### Result
{"passed":true,"constantServer503":true,"browserSuccesses":2,"automaticServerRefreshes":1,"boundedAcrossTemplateRemount":true,"visiblePartialPageRetry":true,"geometry":{"viewport":320,"scroll":320,"dir":"rtl"},"title":"المحتوى غير متاح مؤقتًا | Fury","robots":["noindex, nofollow"]}
### Ran Playwright code
```js
await (async(page)=>{await page.setViewportSize({width:1280,height:900});let successful=0;let release;const second=new Promise(done=>{release=done;});const refreshes=[];const listener=r=>{const url=new URL(r.url());if(url.pathname==='/api/v1/content/catalog/works/saved-manga-0'&&r.status()===200){successful++;if(successful===2)release();}if(url.pathname==='/story/saved-manga-0'&&url.searchParams.has('_rsc'))refreshes.push(r.status());};page.on('response',listener);await page.goto('http://127.0.0.1:4316/story/saved-manga-0');await second;await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).waitFor();await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).waitFor();await page.getByRole('heading',{name:'تعذّر استكمال تحميل الصفحة',exact:true}).waitFor();await page.screenshot({path:'/tmp/fury-p05-t083-partial-page-1280.png',fullPage:true});await page.setViewportSize({width:320,height:900});await page.screenshot({path:'/tmp/fury-p05-t083-partial-page-320.png',fullPage:true});const geometry=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,dir:document.documentElement.dir}));if(geometry.scroll!==geometry.viewport)throw Error('Partial state narrow overflow');page.off('response',listener);if(refreshes.length!==1)throw Error('Repeated unavailable server refresh loop '+refreshes.length);const title=await page.title();if(!title.includes('المحتوى غير متاح مؤقتًا'))throw Error('Failed server read misrepresented');return {passed:true,constantServer503:true,browserSuccesses:successful,automaticServerRefreshes:refreshes.length,boundedAcrossTemplateRemount:true,visiblePartialPageRetry:true,geometry,title,robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content))};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-manga-0
- Page Title: المحتوى غير متاح مؤقتًا | Fury
- Console: 10 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L788-L797
````

## integration-browser-t083-final-reachable-retry

Original capture: `integration-browser-t083-final-reachable-retry.txt`. Bytes: 1418. SHA-256: `c770506fbb68ff404e2b3863c408ee38820b2cc59eea34fb04bfd91e4185980d`.

````text
### Result
{"passed":true,"explicitRetryAfterExhaustedAutomaticAttempt":true,"title":"عمل Mixed 00 manga | Fury","focus":{"tag":"DIV","label":"تفاصيل العمل","outline":"solid","outlineWidth":"3px"},"robots":["index, follow"]}
### Ran Playwright code
```js
await (async(page)=>{await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).waitFor();await page.waitForFunction(()=>document.title.startsWith('عمل Mixed 00 manga')&&document.activeElement?.getAttribute('aria-label')==='تفاصيل العمل'&&[...document.querySelectorAll('meta[name="robots"]')].every(n=>!n.content.includes('noindex')));await page.unroute('**/api/v1/content/catalog/works/saved-manga-0');return {passed:true,explicitRetryAfterExhaustedAutomaticAttempt:true,title:await page.title(),focus:await page.evaluate(()=>({tag:document.activeElement.tagName,label:document.activeElement.getAttribute('aria-label'),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth})),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content))};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-manga-0
- Page Title: عمل Mixed 00 manga | Fury
- Console: 10 errors, 0 warnings
````

## integration-browser-t083-final-state-diagnostic

Original capture: `integration-browser-t083-final-state-diagnostic.txt`. Bytes: 1113. SHA-256: `96a6aee1026fc8a817814e40a2f1422d9bb8fc080b35df44d808e09b284813a2`.

````text
### Result
{"path":"/story/browser-illustrated","title":"Browser illustrated عمل | Fury","headings":["تعذّر تحميل المحتوى","روابط سريعة","الدعم","المجتمع"],"resources":[{"path":"/api/v1/content/works/browser-illustrated/cover","rsc":false,"duration":11.5,"responseStatus":200},{"path":"/api/v1/content/catalog/works/browser-illustrated","rsc":false,"duration":114.39999997615814,"responseStatus":404}],"errors":[""]}
### Ran Playwright code
```js
await (async(page)=>({path:new URL(page.url()).pathname,title:await page.title(),headings:await page.locator('h1,h2').allTextContents(),resources:await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('browser-illustrated')).map(r=>({path:new URL(r.name).pathname,rsc:new URL(r.name).searchParams.has('_rsc'),duration:r.duration,responseStatus:r.responseStatus}))),release:await page.evaluate(()=>window.furyReleaseWork),errors:await page.getByRole('alert').allTextContents()})
)(page);
```
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L805-L811
````

## integration-browser-t083-published-seed

Original capture: `integration-browser-t083-published-seed.txt`. Bytes: 979. SHA-256: `20b9ad93182cbdd1fed067206daafd685c20259caa361cf3e801699aa2bd65d8`.

````text
### Result
{"passed":true,"publishedSsrSeed":true,"title":"Browser illustrated عمل | Fury","browserAuthoritativeReadHeld":true}
### Ran Playwright code
```js
await (async(page)=>{await page.route('**/api/v1/content/catalog/works/browser-illustrated',async route=>{await page.waitForFunction(()=>window.furyReleaseWork===true);await route.continue();});await page.goto('http://127.0.0.1:4316/story/browser-illustrated');await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).waitFor();const title=await page.title();if(!title.startsWith('Browser illustrated عمل'))throw Error('Published SSR seed missing');return {passed:true,publishedSsrSeed:true,title,browserAuthoritativeReadHeld:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: Browser illustrated عمل | Fury
- Console: 6 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L798-L803
````

## integration-browser-t083-query-diagnostic

Original capture: `integration-browser-t083-query-diagnostic.txt`. Bytes: 1060. SHA-256: `e5591350e93d7b84a4d6120b440ea66051cd246395e23858b4a8b180cd6ae1cd`.

````text
### Result
{"found":true,"slug":"browser-illustrated","queries":[{"key":["public-catalog","work","browser-illustrated","detail"],"status":"error","fetchStatus":"idle","error":{"name":"SafePublicCatalogError","code":"NOT_FOUND","statusCode":404,"message":"Public content is unavailable. Try again."}}]}
### Ran Playwright code
```js
await (async(page)=>{return page.locator('main').first().evaluate(node=>{const key=Object.keys(node).find(k=>k.startsWith('__reactFiber$'));let fiber=node[key];while(fiber&&fiber.memoizedProps?.slug!=='browser-illustrated')fiber=fiber.return;if(!fiber)return {found:false};const queries=[];let hook=fiber.memoizedState;while(hook){const value=hook.memoizedState;if(value&&typeof value.getCurrentQuery==='function'){const q=value.getCurrentQuery();const e=q.state.error;queries.push({key:q.queryKey,status:q.state.status,fetchStatus:q.state.fetchStatus,error:e?{name:e.name,code:e.code,statusCode:e.statusCode,message:e.message}:null});}hook=hook.next;}return {found:true,slug:fiber.memoizedProps.slug,queries};});}
)(page);
```
````

## integration-browser-t083-reproduced

Original capture: `integration-browser-t083-reproduced.txt`. Bytes: 1101. SHA-256: `b2ef13b899246b44eaa84a43a87ec04f68cf89e6c997fc202e4e87b78227442b`.

````text
### Result
{"kind":"actual pre-T083 source defect reproduction","reproduced":true,"visibleWorkHeading":true,"title":"المحتوى غير متاح مؤقتًا | Fury","robots":["noindex, nofollow"],"serverRead503BrowserRead200":true}
### Ran Playwright code
```js
await (async(page)=>{await page.goto('http://127.0.0.1:4316/story/saved-manga-0');await page.getByRole('heading',{name:'عمل Mixed 00 manga',exact:true}).waitFor();const title=await page.title();if(!title.includes('المحتوى غير متاح مؤقتًا'))throw Error('Expected pre-T083 metadata mismatch was not reproduced');return {kind:'actual pre-T083 source defect reproduction',reproduced:true,visibleWorkHeading:true,title,robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content)),serverRead503BrowserRead200:true};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/saved-manga-0
- Page Title: المحتوى غير متاح مؤقتًا | Fury
- Console: 10 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L737-L747
````

## integration-browser-t083-snapshot-normal-diagnostic

Original capture: `integration-browser-t083-snapshot-normal-diagnostic.txt`. Bytes: 2672. SHA-256: `a4d99dccd257c8fef75ce76150fa3c855cc08e0955119baf59e94244f56a78aa`.

```text
### Error
Error: {"phase":"unpublish","error":"TimeoutError: locator.waitFor: Timeout 30000ms exceeded.\nCall log:\n\u001b[2m  - waiting for getByRole('button', { name: 'حفظ ونشر', exact: true }) to be visible\u001b[22m\n","adminReads":[{"path":"/api/v1/auth/refresh","method":"POST","status":400},{"path":"/api/v1/auth/login","method":"POST","status":200},{"path":"/api/v1/auth/refresh","method":"POST","status":200},{"path":"/api/v1/content/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a","method":"PATCH","status":200},{"path":"/api/v1/content/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/publication","method":"PUT","status":200}],"publicReads":[{"path":"/story/browser-illustrated","status":200,"rsc":false},{"path":"/api/v1/content/works/browser-illustrated/cover","status":200,"rsc":false}],"adminAlerts":[""],"adminText":"حفوظ 10تصنيف محفوظ 11تصنيف محفوظ 12تصنيف محفوظ 13تصنيف محفوظ 14تصنيف محفوظ 15تصنيف محفوظ 16تصنيف محفوظ 17تصنيف محفوظ 18تصنيف محفوظ 19تصنيف محفوظ 20تصنيف محفوظ 21تصنيف محفوظ 22تصنيف محفوظ 23تصنيف محفوظ 24تصنيف محفوظ 25تصنيف محفوظ 26تصنيف محفوظ 27تصنيف محفوظ 28تصنيف محفوظ 29Browser Category ABrowser Category BBrowser Category Cالوسوم (افصل بينها بفاصلة)تفضيل العرض المميزإضافة إلى العرض المميز (تفضيل غير منشور)الوسائط الخاصة بالمسودةغلاف العمل (3:4)رفع غلاف جديدهذه معاينة خاصة للوسيط المرتبط بالعمل المحفوظ؛ لم يتغير الربط.إزالة المعاينة المحليةوسائط محفوظة لهذا النوع600 × 800 معاينة الوسيطاختيار هذا الوسيطالغلاف مرتبط بالعمل المحفوظ؛ لم يتغير الربط بعد.إزالة الغلاف عند الحفظخلفية العمل (16:9)رفع خلفية جديدةوسائط محفوظة لهذا النوع1200 × 800 معاينة الوسيطاختيار هذا الوسيطلا توجد خلفية مرتبطة بالمسودة.معاينة البيانات المحفوظةbrowser-illustratedBrowser illustrated عملSaved by the actual administrator browser flow for public catalog verification.إلغاء والعودةحفظ التعديلاتإلغاء النشرأرشفة العمل","publicTitle":"Browser illustrated عمل | Fury","publicHeadings":["Browser illustrated عمل","أعمال مشابهة","روابط سريعة","الدعم","المجتمع"]}
```

## integration-browser-t083-snapshot-verified-negative

Original capture: `integration-browser-t083-snapshot-verified-negative.txt`. Bytes: 7381. SHA-256: `f249fad1ecf986af632b0de9a5ff446d07f932fe9445b76c8f7c98f9fe8042d9`.

````text
### Result
{"passed":true,"negativeRetryAfterFailedAutomaticWithdrawal":true,"realAdministratorInSeparateContext":true,"anonymousPublicContextPreserved":true,"initialTitle":"Browser illustrated عمل | Fury","boundedFailure":{"title":"المحتوى غير متاح مؤقتًا | Fury","visibleRetry":1},"withdrawn":{"title":"العمل غير موجود | Fury","robots":["noindex, nofollow","noindex"],"socialImages":0,"focus":{"tag":"DIV","outline":"solid","outlineWidth":"3px"}},"recovered":{"title":"Browser illustrated عمل | Fury","robots":["index, follow"],"focus":{"tag":"DIV","label":"تفاصيل العمل","outline":"solid","outlineWidth":"3px"}},"reads":[{"path":"/story/browser-illustrated","status":200,"rsc":false},{"path":"/api/v1/content/works/browser-illustrated/cover","status":200,"rsc":false},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":404,"rsc":false},{"path":"/story/browser-illustrated","status":200,"rsc":true},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":404,"rsc":false},{"path":"/story/browser-illustrated","status":200,"rsc":true},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":404,"rsc":false},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":200,"rsc":false},{"path":"/story/browser-illustrated","status":200,"rsc":true},{"path":"/api/v1/content/works/browser-illustrated/cover","status":200,"rsc":false},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":200,"rsc":false}]}
### Ran Playwright code
```js
await (async(page)=>{
 const negative=true;
 const browser=page.context().browser();if(!browser)throw Error('Owned browser cannot create an isolated administrator context');
 const context=await browser.newContext({viewport:{width:1280,height:900}});const admin=await context.newPage();
 const pattern='**/api/v1/content/catalog/works/browser-illustrated';let release;const gate=new Promise(done=>{release=done;});let intercepted;const held=new Promise(done=>{intercepted=done;});let first=true;const reads=[];
 let phase="login";const adminReads=[];admin.on("response",r=>{if(r.url().includes("/api/v1/")&&r.request().method()!=="GET")adminReads.push({path:new URL(r.url()).pathname,method:r.request().method(),status:r.status()});});const listener=r=>{const u=new URL(r.url());if(u.pathname.includes('browser-illustrated'))reads.push({path:u.pathname,status:r.status(),rsc:u.searchParams.has('_rsc')});};
 try{
  await admin.goto('http://127.0.0.1:4316/auth/login');await admin.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('closeout-browser-admin@example.test');await admin.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill('<redacted disposable password>');await admin.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await admin.waitForURL(u=>['/dashboard','/admin'].includes(u.pathname));
  await admin.goto('http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit');
  const publish=admin.getByRole('button',{name:'حفظ ونشر',exact:true});const unpublish=admin.getByRole('button',{name:'إلغاء النشر',exact:true});await publish.or(unpublish).first().waitFor();if(await publish.isVisible())await publish.click();await unpublish.waitFor();
  await page.unroute(pattern);await page.route(pattern,async route=>{if(first){first=false;intercepted();await gate;}await route.continue();});
  page.on('response',listener);await page.goto('http://127.0.0.1:4316/story/browser-illustrated');await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).waitFor();await held;const initialTitle=await page.title();
  phase='unpublish';const mutation=admin.waitForResponse(r=>r.request().method()==='PUT'&&r.url().endsWith('/publication'));await unpublish.click();const committed=await mutation;const transition=await committed.json();if(committed.status()!==200||transition.data?.transition.publicationStatus!=='draft')throw Error('Unpublication not committed');phase='withdraw';release();
  await page.getByRole('heading',{name:'العمل غير موجود',exact:true}).waitFor();
  let boundedFailure;
  if(negative){await page.waitForFunction(()=>document.title.includes('المحتوى غير متاح مؤقتًا'));boundedFailure={title:await page.title(),visibleRetry:await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).count()};await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).focus();await page.keyboard.press('Enter');}
  await page.waitForFunction(()=>document.title.includes('العمل غير موجود')&&[...document.querySelectorAll('meta[name="robots"]')].some(n=>n.content.includes('noindex'))&&!document.querySelector('meta[property="og:image"]'));
  if(negative)await page.waitForFunction(()=>document.activeElement?.hasAttribute('data-public-catalog-focus'));
  const withdrawn={title:await page.title(),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content)),socialImages:await page.locator('meta[property="og:image"]').count(),focus:await page.evaluate(()=>({tag:document.activeElement.tagName,outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth}))};
  phase='republish';await admin.reload();await publish.waitFor();await publish.click();await unpublish.waitFor();phase='recover';await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).waitFor();await page.waitForFunction(()=>document.title.startsWith('Browser illustrated عمل')&&document.activeElement?.getAttribute('aria-label')==='تفاصيل العمل'&&[...document.querySelectorAll('meta[name="robots"]')].every(n=>!n.content.includes('noindex')));
  const recovered={title:await page.title(),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content)),focus:await page.evaluate(()=>({tag:document.activeElement.tagName,label:document.activeElement.getAttribute('aria-label'),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth}))};
  if(!reads.some(r=>r.path.includes('/content/catalog/works/')&&r.status===404)||!reads.some(r=>r.rsc))throw Error('Actual denial/server synchronization missing');
  return {passed:true,negativeRetryAfterFailedAutomaticWithdrawal:negative,realAdministratorInSeparateContext:true,anonymousPublicContextPreserved:true,initialTitle,boundedFailure,withdrawn,recovered,reads};
 }catch(error){throw Error(JSON.stringify({phase,error:String(error),adminReads,publicReads:reads,adminAlerts:await admin.getByRole('alert').allTextContents(),adminText:(await admin.locator('main').first().textContent()).slice(-1000),publicTitle:await page.title(),publicHeadings:await page.locator('h1,h2').allTextContents()}));}finally{release();page.off('response',listener);await page.unroute(pattern);await context.close();}
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: Browser illustrated عمل | Fury
- Console: 9 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L840-L848
````

## integration-browser-t083-snapshot-verified-withdrawal

Original capture: `integration-browser-t083-snapshot-verified-withdrawal.txt`. Bytes: 7222. SHA-256: `8245dacdd7b00eb21bea613999e1cbc47aacca3e12b7e7b7a7eb8b54d8167f9a`.

````text
### Result
{"passed":true,"negativeRetryAfterFailedAutomaticWithdrawal":false,"realAdministratorInSeparateContext":true,"anonymousPublicContextPreserved":true,"initialTitle":"Browser illustrated عمل | Fury","withdrawn":{"title":"العمل غير موجود | Fury","robots":["noindex, nofollow","noindex"],"socialImages":0,"focus":{"tag":"BODY","outline":"none","outlineWidth":"3px"}},"recovered":{"title":"Browser illustrated عمل | Fury","robots":["index, follow"],"focus":{"tag":"DIV","label":"تفاصيل العمل","outline":"solid","outlineWidth":"3px"}},"reads":[{"path":"/story/browser-illustrated","status":200,"rsc":false},{"path":"/api/v1/content/works/browser-illustrated/cover","status":200,"rsc":false},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":404,"rsc":false},{"path":"/story/browser-illustrated","status":200,"rsc":true},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":404,"rsc":false},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":200,"rsc":false},{"path":"/story/browser-illustrated","status":200,"rsc":true},{"path":"/api/v1/content/works/browser-illustrated/cover","status":200,"rsc":false},{"path":"/api/v1/content/catalog/works/browser-illustrated","status":200,"rsc":false},{"path":"/api/v1/content/works/browser-illustrated/cover","status":200,"rsc":false}]}
### Ran Playwright code
```js
await (async(page)=>{
 const negative=false;
 const browser=page.context().browser();if(!browser)throw Error('Owned browser cannot create an isolated administrator context');
 const context=await browser.newContext({viewport:{width:1280,height:900}});const admin=await context.newPage();
 const pattern='**/api/v1/content/catalog/works/browser-illustrated';let release;const gate=new Promise(done=>{release=done;});let intercepted;const held=new Promise(done=>{intercepted=done;});let first=true;const reads=[];
 let phase="login";const adminReads=[];admin.on("response",r=>{if(r.url().includes("/api/v1/")&&r.request().method()!=="GET")adminReads.push({path:new URL(r.url()).pathname,method:r.request().method(),status:r.status()});});const listener=r=>{const u=new URL(r.url());if(u.pathname.includes('browser-illustrated'))reads.push({path:u.pathname,status:r.status(),rsc:u.searchParams.has('_rsc')});};
 try{
  await admin.goto('http://127.0.0.1:4316/auth/login');await admin.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('closeout-browser-admin@example.test');await admin.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill('<redacted disposable password>');await admin.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await admin.waitForURL(u=>['/dashboard','/admin'].includes(u.pathname));
  await admin.goto('http://127.0.0.1:4316/admin/works/fe1afaa5-d050-495c-8690-29b9f925599a/edit');
  const publish=admin.getByRole('button',{name:'حفظ ونشر',exact:true});const unpublish=admin.getByRole('button',{name:'إلغاء النشر',exact:true});await publish.or(unpublish).first().waitFor();if(await publish.isVisible())await publish.click();await unpublish.waitFor();
  await page.unroute(pattern);await page.route(pattern,async route=>{if(first){first=false;intercepted();await gate;}await route.continue();});
  page.on('response',listener);await page.goto('http://127.0.0.1:4316/story/browser-illustrated');await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).waitFor();await held;const initialTitle=await page.title();
  phase='unpublish';const mutation=admin.waitForResponse(r=>r.request().method()==='PUT'&&r.url().endsWith('/publication'));await unpublish.click();const committed=await mutation;const transition=await committed.json();if(committed.status()!==200||transition.data?.transition.publicationStatus!=='draft')throw Error('Unpublication not committed');phase='withdraw';release();
  await page.getByRole('heading',{name:'العمل غير موجود',exact:true}).waitFor();
  let boundedFailure;
  if(negative){await page.waitForFunction(()=>document.title.includes('المحتوى غير متاح مؤقتًا'));boundedFailure={title:await page.title(),visibleRetry:await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).count()};await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).focus();await page.keyboard.press('Enter');}
  await page.waitForFunction(()=>document.title.includes('العمل غير موجود')&&[...document.querySelectorAll('meta[name="robots"]')].some(n=>n.content.includes('noindex'))&&!document.querySelector('meta[property="og:image"]'));
  if(negative)await page.waitForFunction(()=>document.activeElement?.hasAttribute('data-public-catalog-focus'));
  const withdrawn={title:await page.title(),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content)),socialImages:await page.locator('meta[property="og:image"]').count(),focus:await page.evaluate(()=>({tag:document.activeElement.tagName,outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth}))};
  phase='republish';await admin.reload();await publish.waitFor();await publish.click();await unpublish.waitFor();phase='recover';await page.getByRole('button',{name:'إعادة المحاولة',exact:true}).focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Browser illustrated عمل',exact:true}).waitFor();await page.waitForFunction(()=>document.title.startsWith('Browser illustrated عمل')&&document.activeElement?.getAttribute('aria-label')==='تفاصيل العمل'&&[...document.querySelectorAll('meta[name="robots"]')].every(n=>!n.content.includes('noindex')));
  const recovered={title:await page.title(),robots:await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.content)),focus:await page.evaluate(()=>({tag:document.activeElement.tagName,label:document.activeElement.getAttribute('aria-label'),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth}))};
  if(!reads.some(r=>r.path.includes('/content/catalog/works/')&&r.status===404)||!reads.some(r=>r.rsc))throw Error('Actual denial/server synchronization missing');
  return {passed:true,negativeRetryAfterFailedAutomaticWithdrawal:negative,realAdministratorInSeparateContext:true,anonymousPublicContextPreserved:true,initialTitle,boundedFailure,withdrawn,recovered,reads};
 }catch(error){throw Error(JSON.stringify({phase,error:String(error),adminReads,publicReads:reads,adminAlerts:await admin.getByRole('alert').allTextContents(),adminText:(await admin.locator('main').first().textContent()).slice(-1000),publicTitle:await page.title(),publicHeadings:await page.locator('h1,h2').allTextContents()}));}finally{release();page.off('response',listener);await page.unroute(pattern);await context.close();}
}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: Browser illustrated عمل | Fury
- Console: 8 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L812-L839
````

## integration-browser-t083-snapshot-withdrawal

Original capture: `integration-browser-t083-snapshot-withdrawal.txt`. Bytes: 179. SHA-256: `3fe5625a4c9b2267abdcbd17c9dcff9a192bcf84b9f5d8b9987097e68ffd5fcd`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: 'حفظ ونشر', exact: true }) to be visible[22m

```

## integration-browser-t083-withdrawal-diagnostic

Original capture: `integration-browser-t083-withdrawal-diagnostic.txt`. Bytes: 837. SHA-256: `825cbb1adeb04277e017186257bc8b28a2c0057af235d41a63c4794663e10161`.

````text
### Result
{"path":"/story/browser-illustrated","title":"Browser illustrated عمل | Fury","headings":["تعذّر تحميل المحتوى","روابط سريعة","الدعم","المجتمع"],"alerts":[""],"images":[]}
### Ran Playwright code
```js
await (async(page)=>({path:new URL(page.url()).pathname,title:await page.title(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),images:await page.locator('img').evaluateAll(nodes=>nodes.map(i=>({loaded:i.complete&&i.naturalWidth>0,srcKind:i.src.split(':')[0]})))})
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/story/browser-illustrated
- Page Title: Browser illustrated عمل | Fury
- Console: 7 errors, 0 warnings
### Events
- New console entries: .playwright-cli/console-2026-11-01T09-23-54-687Z.log#L804
````

## integration-browser-t083-withdrawal-state

Original capture: `integration-browser-t083-withdrawal-state.txt`. Bytes: 1045. SHA-256: `e693248ad42d4f27274d432cebd953c138d4cdda159782340375d4356f83e297`.

````text
### Result
{"path":"/story/browser-illustrated","title":"Browser illustrated عمل | Fury","headings":["تعذّر تحميل المحتوى","روابط سريعة","الدعم","المجتمع"],"resources":[{"path":"/api/v1/content/works/browser-illustrated/cover","rsc":false,"duration":24.600000023841858,"responseStatus":200},{"path":"/api/v1/content/catalog/works/browser-illustrated","rsc":false,"duration":3895.7000000476837,"responseStatus":404}],"release":true,"errors":[""]}
### Ran Playwright code
```js
await (async(page)=>({path:new URL(page.url()).pathname,title:await page.title(),headings:await page.locator('h1,h2').allTextContents(),resources:await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('browser-illustrated')).map(r=>({path:new URL(r.name).pathname,rsc:new URL(r.name).searchParams.has('_rsc'),duration:r.duration,responseStatus:r.responseStatus}))),release:await page.evaluate(()=>window.furyReleaseWork),errors:await page.getByRole('alert').allTextContents()})
)(page);
```
````

## integration-browser-unpublication-corrected

Original capture: `integration-browser-unpublication-corrected.txt`. Bytes: 1522. SHA-256: `d2cd9ac1c04af7b43d57ccc59aac7de346a30a088857434d7302a37e70008f5c`.

````text
### Result
{"passed":true,"action":"actual administrator unpublish","result":[{"slug":"browser-illustrated","savedDraft":true,"actionAlreadyPersistedByPriorHarness":true},{"slug":"browser-text","savedDraft":true,"actionAlreadyPersistedByPriorHarness":true}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a'],['browser-text','b6b1e172-5a47-4e8f-9ddc-9e2728726e98']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/edit');const r=page.waitForResponse(r=>r.request().method()==='POST'&&r.url().endsWith('/publication'));if(await page.getByRole('button',{name:'إلغاء النشر',exact:true}).count())await page.getByRole('button',{name:'إلغاء النشر',exact:true}).click();else { result.push({slug,savedDraft:true,actionAlreadyPersistedByPriorHarness:true});continue; }const response=await r;if(!response.ok())throw Error('Unpublish failed '+response.status());await page.getByRole('button',{name:'حفظ ونشر',exact:true}).waitFor();result.push({slug,status:response.status(),savedDraft:true});}return {passed:true,action:'actual administrator unpublish',result};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/auth/login
- Page Title: تسجيل الدخول | Fury
- Console: 1 errors, 0 warnings
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L63-L75
````

## integration-browser-unpublication-final

Original capture: `integration-browser-unpublication-final.txt`. Bytes: 827. SHA-256: `0135f5ab90515ad7adaa524519b73b528eec5e51dfa8725e85905cc29e4d375e`.

```text
### Error
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: 'إلغاء النشر', exact: true }).or(getByRole('button', { name: 'حفظ ونشر', exact: true })).first() to be visible[22m


page.waitForResponse: Timeout 30000ms exceeded while waiting for event "response"
    at evalmachine.<anonymous>:1:253
    at async evalmachine.<anonymous>:3:20
    at async /Users/mohamedabdelkareem/.npm/_npx/31e32ef8478fbf80/node_modules/playwright-core/lib/coreBundle.js:70028:13

page.waitForResponse: Timeout 30000ms exceeded while waiting for event "response"
    at evalmachine.<anonymous>:1:253
    at async evalmachine.<anonymous>:3:20
    at async /Users/mohamedabdelkareem/.npm/_npx/31e32ef8478fbf80/node_modules/playwright-core/lib/coreBundle.js:70028:13
```

## integration-browser-unpublication-verified

Original capture: `integration-browser-unpublication-verified.txt`. Bytes: 1691. SHA-256: `f8220d22057b548410dafdedfce374290831951aac324d2833996b557cdd74d5`.

````text
### Result
{"passed":true,"action":"actual administrator unpublish","result":[{"slug":"browser-illustrated","savedDraft":true,"actionAlreadyPersistedByPriorHarness":true},{"slug":"browser-text","status":200,"savedDraft":true}]}
### Ran Playwright code
```js
await (async(page)=>{const result=[];for(const [slug,id]of[['browser-illustrated','fe1afaa5-d050-495c-8690-29b9f925599a'],['browser-text','b6b1e172-5a47-4e8f-9ddc-9e2728726e98']]){await page.goto('http://127.0.0.1:4316/admin/works/'+id+'/edit');await page.getByRole('button',{name:'إلغاء النشر',exact:true}).or(page.getByRole('button',{name:'حفظ ونشر',exact:true})).first().waitFor();if(await page.getByRole('button',{name:'إلغاء النشر',exact:true}).count()){const pending=page.waitForResponse(r=>r.request().method()==='PUT'&&r.url().endsWith('/publication'));await page.getByRole('button',{name:'إلغاء النشر',exact:true}).click();const actual=await pending;if(!actual.ok())throw Error('Unpublish failed');}else { result.push({slug,savedDraft:true,actionAlreadyPersistedByPriorHarness:true});continue; }await page.getByRole('button',{name:'حفظ ونشر',exact:true}).waitFor();result.push({slug,status:200,savedDraft:true});}return {passed:true,action:'actual administrator unpublish',result};}
)(page);
```
### Page
- Page URL: http://127.0.0.1:4316/admin/works/b6b1e172-5a47-4e8f-9ddc-9e2728726e98/edit
- Page Title: تعديل العمل (b6b1e172-5a47-4e8f-9ddc-9e2728726e98) | لوحة إدارة Fury
### Events
- New console entries: ../../Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/.playwright-cli/console-2026-11-01T09-31-49-455Z.log#L77-L79
````

## integration-browser-unpublication

Original capture: `integration-browser-unpublication.txt`. Bytes: 106. SHA-256: `f075ba6a9d5b8c0110d4c7d227ec6be85b985338992fba4a24ea6ad0a7883249`.

```text
### Error
TimeoutError: page.waitForResponse: Timeout 30000ms exceeded while waiting for event "response"
```

## integration-final-documentation-format

Original capture: `integration-final-documentation-format.txt`. Bytes: 141. SHA-256: `b12fad163df36b1720b304ce00dadb2311baeb554d904e29d56f2c70ed18bc6e`.

```text
$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
```

## integration-final-focused-lint

Original capture: `integration-final-focused-lint.txt`. Bytes: 455. SHA-256: `e550be86e21743410fad287f79ebaf0b99896e5ba6ce54f0fde7a93d4f5fd914`.

```text
$ eslint .

<repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
  95:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

✖ 1 problem (0 errors, 1 warning)

```

## integration-final-focused-tests

Original capture: `integration-final-focused-tests.txt`. Bytes: 438. SHA-256: `06da8123f2bb488c11e7c9da5f5c40e8a12d5052fee377848777a65d11046910`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/story/routing.test.tsx src/app/seo.test.ts

 RUN  v4.1.10 <repository>/apps/web


 Test Files  4 passed (4)
      Tests  30 passed (30)
   Start at  13:03:43
   Duration  2.84s (transform 471ms, setup 623ms, import 1.17s, tests 1.90s, environment 2.30s)

```

## integration-final-format-failed

Original capture: `integration-final-format-failed.txt`. Bytes: 1179. SHA-256: `ffc26c36c64b2a78f04e06825702c655972b607a07d4ffc27031f9b63cc8f142`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 78ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 251ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
[warn] apps/web/src/features/public-catalog/api/public-catalog.seo.ts
[warn] Code style issues found in the above file. Run Prettier with --write to fix.
[ELIFECYCLE] Command failed with exit code 1.
[ELIFECYCLE] Command failed with exit code 1.
```

## integration-final-routes

Original capture: `integration-final-routes.txt`. Bytes: 1042. SHA-256: `78c675ad4c53b07188a0949b669d42782d8b53973e0bb355ec3f140ba3154635`.

```text
$ node scripts/check-web-routes.mjs http://127.0.0.1:4316 saved-manga-0
PASS /dashboard
PASS /library
PASS /settings
PASS /admin/ads
PASS /admin/categories
PASS /admin/comments
PASS /admin/contact/msg-1
PASS /admin/contact
PASS /admin/dashboard
PASS /admin/gifts/grants
PASS /admin/gifts
PASS /admin
PASS /admin/reports
PASS /admin/users/user-1
PASS /admin/users
PASS /admin/works/trait-hoarder/chapters/th-43/edit
PASS /admin/works/trait-hoarder/chapters/new
PASS /admin/works/trait-hoarder/chapters
PASS /admin/works/trait-hoarder/edit
PASS /admin/works/new
PASS /admin/works
PASS /auth/forgot-password
PASS /auth/login
PASS /auth/register
PASS /auth/reset-password
PASS /auth/verify-email
PASS /categories
PASS /contact
PASS /copyright
PASS /discover
PASS /
PASS /privacy
PASS /report-issue
PASS /stories
PASS /story/saved-manga-0/chapter/1
PASS /story/saved-manga-0
PASS /terms
PASS /story/trait-hoarder/chapter/43
PASS /story/1/chapter/1
PASS /story/1/chapter/2
Verified 40 existing routes and the 404 fallback at http://127.0.0.1:4316.
```

## integration-final-verification

Original capture: `integration-final-verification.txt`. Bytes: 30802. SHA-256: `449cb7dab91c2acd2009f4d5245b7abea23b7a49c03d2d3ad733ecd4bcfa9b7d`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 27ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 254ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache hit, replaying logs 36f54ee3d5c49be4
@fury/contracts:lint: $ eslint .
@fury/web:lint: cache miss, executing 92fd429ab40b147b
@fury/database:lint: cache hit, replaying logs 6e7cacdb6171e51b
@fury/database:lint: $ eslint .
@fury/api:lint: cache hit, replaying logs 381be4e74d0d4470
@fury/api:lint: $ eslint .
@fury/web:lint: $ eslint .
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
@fury/web:lint:   95:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
@fury/web:lint:
@fury/web:lint: ✖ 1 problem (0 errors, 1 warning)
@fury/web:lint:

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    23.889s

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache hit, replaying logs 90a343f8bbc72426
@fury/contracts:check-types: $ tsc --noEmit
@fury/web:check-types: cache miss, executing 3d089aed45178fbd
@fury/database:check-types: cache hit, replaying logs 6f4d6f61db15b1f7
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 93ms
@fury/database:check-types:
@fury/api:check-types: cache hit, replaying logs 023696dea2e4ec62
@fury/api:check-types: $ tsc --noEmit
@fury/web:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    2.652s

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:test: cache hit, replaying logs 36bc416e062052e2
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 <repository>/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 5ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 8ms
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 6ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 13ms
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 42ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  12:46:45
@fury/contracts:test:    Duration  311ms (transform 275ms, setup 0ms, import 608ms, tests 73ms, environment 0ms)
@fury/contracts:test:
@fury/contracts:build: cache hit, replaying logs e4f4ed9387203e98
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:test: cache miss, executing cece2a6c6514b06f
@fury/database:test: cache hit, replaying logs 6348e8d0dd17fcb7
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/database:test:  RUN  v4.1.10 <repository>/packages/database
@fury/database:test:
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 4ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 188ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  12:46:47
@fury/database:test:    Duration  648ms (transform 217ms, setup 0ms, import 376ms, tests 192ms, environment 0ms)
@fury/database:test:
@fury/database:build: cache hit, replaying logs 51fbe2c37013493b
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 177ms
@fury/database:build:
@fury/api:test: cache hit, replaying logs 6d1b957fccf660d4
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 <repository>/apps/api
@fury/api:test:
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 67ms
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 84ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 12ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 13ms
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 14ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 31ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 12ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 341ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 21ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 42ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (19 tests) 7ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 33ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 9ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 10ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 15ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 7ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 6ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 3ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 8ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 5ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 6ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (16 tests) 1476ms
@fury/api:test:
@fury/api:test:  Test Files  26 passed (26)
@fury/api:test:       Tests  154 passed (154)
@fury/api:test:    Start at  12:46:52
@fury/api:test:    Duration  2.27s (transform 3.09s, setup 428ms, import 7.43s, tests 2.24s, environment 2ms)
@fury/api:test:
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/web:test:
@fury/web:test:  RUN  v4.1.10 <repository>/apps/web
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 378ms
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 786ms
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 778ms
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 970ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  435ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 1206ms
@fury/web:test:      ✓ opens create gift dialog and creates a new gift design  447ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (17 tests) 1615ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 1726ms
@fury/web:test:      ✓ loads persisted categories, searches on the server, and shows filtered empty state  348ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 2002ms
@fury/web:test:      ✓ adopts a newer confirmed Chapter when the editor is pristine  314ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 440ms
@fury/web:test:      ✓ renders the FURY brand and navigation groups with correct active state  307ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 941ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 556ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 662ms
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 805ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 616ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 321ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests) 4216ms
@fury/web:test:      ✓ checks an unknown edit acknowledgement before allowing another save  449ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicCatalogListing.test.tsx (5 tests) 801ms
@fury/web:test:      ✓ distinguishes pending, failure and retry from an empty catalog  474ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 486ms
@fury/web:test:  ✓ src/features/home/components/public-home.test.tsx (6 tests) 733ms
@fury/web:test:      ✓ uses saved featured order and category shortcuts without an active reader or scores  431ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (5 tests) 757ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (2 tests) 458ms
@fury/web:test:      ✓ restricts type choices to text and preserves saved/unknown category and search  376ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 568ms
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 397ms
@fury/web:test:      ✓ renders the real session identity with fixture product summaries and valid links  335ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 460ms
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 511ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 413ms
@fury/web:test:      ✓ renders heading structure, approval notice, takedown checklist, and submission link  409ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 444ms
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 391ms
@fury/web:test:      ✓ renders message details, sender info, and action panels  314ms
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 276ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 395ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 416ms
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 525ms
@fury/web:test:      ✓ selects one avatar frame or no frame and keeps revoked gifts unavailable  416ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 428ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 403ms
@fury/web:test:      ✓ renders heading structure, legal draft approval note, and sections  402ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 352ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 377ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 307ms
@fury/web:test:      ✓ renders a complete heading structure, approval boundary, and internal section links  306ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicWorkImage.test.tsx (5 tests) 251ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 249ms
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 327ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 451ms
@fury/web:test:      ✓ shows field-level contact validation then states the request was not delivered  372ms
@fury/web:test:  ✓ src/components/ui/MangaCard/MangaCard.test.tsx (1 test) 213ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicCatalogState.test.tsx (6 tests) 217ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 210ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 174ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 206ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 234ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 241ms
@fury/web:test:  ✓ src/features/story/routing.test.tsx (5 tests) 462ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 212ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 194ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 162ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 232ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (4 tests) 260ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 93ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 41ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 20ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicWorkNotFound.test.tsx (4 tests) 173ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 58ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 15ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 34ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 108ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 55ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 22ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 57ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 48ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 52ms
@fury/web:test:  ✓ src/app/seo.test.ts (4 tests) 15ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (10 tests) 11ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 18ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (8 tests) 9ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 8ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 5ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (2 tests) 7ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 4ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 2ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 3ms
@fury/web:test:
@fury/web:test:  Test Files  79 passed (79)
@fury/web:test:       Tests  503 passed (503)
@fury/web:test:    Start at  13:18:34
@fury/web:test:    Duration  16.50s (transform 6.64s, setup 16.33s, import 20.76s, tests 33.08s, environment 61.11s)
@fury/web:test:

 Tasks:    6 successful, 6 total
Cached:    5 cached, 6 total
  Time:    17.297s

$ turbo run test:integration
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test:integration in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs e4f4ed9387203e98
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test:integration: cache bypass, force executing 3aacbcc49b2c3bee
@fury/database:build: cache hit, replaying logs 51fbe2c37013493b
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 177ms
@fury/database:build:
@fury/api:test:integration: cache bypass, force executing a4cefe43084ff7ec
@fury/api:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/database:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration:
@fury/api:test:integration:  RUN  v4.1.10 <repository>/apps/api
@fury/api:test:integration:
@fury/database:test:integration:
@fury/database:test:integration:  RUN  v4.1.10 <repository>/packages/database
@fury/database:test:integration:
@fury/api:test:integration: (node:64684) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
@fury/api:test:integration: (Use `node --trace-deprecation ...` to show where the warning was created)
@fury/api:test:integration:  ✓ src/modules/content/public-content.integration.test.ts (24 tests) 5779ms
@fury/api:test:integration:      ✓ enforces every parent and Chapter visibility-state combination  376ms
@fury/api:test:integration:      ✓ keeps deterministic publication/title ties, distinct bounded pages and truthful overruns  386ms
@fury/api:test:integration:      ✓ builds bounded saved-order home sections and the first three populated suggestion tabs  303ms
@fury/api:test:integration:      ✓ projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works  484ms
@fury/api:test:integration:      ✓ exports all eligible canonical slugs across bounded batches without private IDs or writes  2082ms
@fury/api:test:integration:  ✓ src/content.integration.test.ts (37 tests) 6246ms
@fury/api:test:integration:      ✓ serves strict detail and optional background bytes without private data or stale visibility  342ms
@fury/api:test:integration:      ✓ keeps every management family server-authoritative before lookup  529ms
@fury/api:test:integration:      ✓ returns the central rate-limit envelope with request identity  421ms
@fury/api:test:integration:      ✓ publishes allowlisted metadata credential-free and hides it identically  328ms
@fury/api:test:integration:      ✓ recovers archived Works only through draft and records real republishes  358ms
@fury/api:test:integration:      ✓ rejects invalid rich writes and rolls back wrong-class media or stale edits  570ms
@fury/database:test:integration:  ✓ tests/integration/migration.integration.test.ts (6 tests) 13928ms
@fury/database:test:integration:      ✓ cascades refresh records and deploys idempotently  1052ms
@fury/database:test:integration:      ✓ retires legacy phone after a populated P01 upgrade without losing account or session data  12735ms
@fury/api:test:integration:  ✓ src/modules/media/media.service.integration.test.ts (12 tests) 1505ms
@fury/api:test:integration:  ✓ src/modules/content/work-management.integration.test.ts (16 tests) 1461ms
@fury/api:test:integration:  ✓ src/modules/content/content-management.integration.test.ts (18 tests) 1265ms
@fury/api:test:integration:  ✓ src/media.integration.test.ts (14 tests) 800ms
@fury/api:test:integration:  ✓ src/modules/content/category-management.integration.test.ts (9 tests) 527ms
@fury/api:test:integration:  ✓ src/modules/media/media.reconcile.integration.test.ts (4 tests) 405ms
@fury/api:test:integration:  ✓ src/modules/content/publication-management.integration.test.ts (4 tests) 265ms
@fury/api:test:integration:  ✓ src/app.integration.test.ts (14 tests) 248ms
@fury/api:test:integration:  ✓ src/modules/auth/auth.service.integration.test.ts (6 tests) 111ms
@fury/api:test:integration:
@fury/api:test:integration:  Test Files  11 passed (11)
@fury/api:test:integration:       Tests  158 passed (158)
@fury/api:test:integration:    Start at  13:18:52
@fury/api:test:integration:    Duration  27.64s (transform 623ms, setup 25ms, import 1.16s, tests 18.61s, environment 0ms)
@fury/api:test:integration:
@fury/database:test:integration:  ✓ tests/integration/chapter-upgrade.integration.test.ts (2 tests) 20051ms
@fury/database:test:integration:      ✓ preserves populated P01–P03 rows through failed, recovered, and repeated expand deploys  20038ms
@fury/database:test:integration:  ✓ tests/integration/content-domain.integration.test.ts (22 tests) 4055ms
@fury/database:test:integration:      ✓ allows a retired page position to be reused while retaining its identity  763ms
@fury/database:test:integration:      ✓ retains retired page references and events when a later page-set write rolls back  645ms
@fury/database:test:integration:      ✓ retains true zero chapter counts and stable ID ties for saved Works  364ms
@fury/database:test:integration:      ✓ uniquely places published featured works while retaining inactive preferences  300ms
@fury/database:test:integration:  ✓ tests/integration/media-domain.integration.test.ts (5 tests) 185ms
@fury/database:test:integration:  ✓ tests/integration/media-recovery.integration.test.ts (1 test) 15ms
@fury/database:test:integration:
@fury/database:test:integration:  Test Files  5 passed (5)
@fury/database:test:integration:       Tests  36 passed (36)
@fury/database:test:integration:    Start at  13:18:52
@fury/database:test:integration:    Duration  46.31s (transform 156ms, setup 0ms, import 235ms, tests 38.23s, environment 0ms)
@fury/database:test:integration:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    48.069s

$ turbo run build
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running build in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs e4f4ed9387203e98
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:build: cache miss, executing 6eedb1e386e1983a
@fury/database:build: cache hit, replaying logs 51fbe2c37013493b
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 177ms
@fury/database:build:
@fury/api:build: cache hit, replaying logs d698bdf5eed17798
@fury/api:build: $ pnpm clean && tsc -p tsconfig.build.json
@fury/api:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo
@fury/web:build: $ next build --webpack
@fury/web:build: ▲ Next.js 16.2.12 (webpack)
@fury/web:build:
@fury/web:build:   Creating an optimized production build ...
@fury/web:build: ✓ Compiled successfully in 5.3s
@fury/web:build:   Running TypeScript ...
@fury/web:build:   Finished TypeScript in 8.1s ...
@fury/web:build:   Collecting page data using 9 workers ...
@fury/web:build:   Generating static pages using 9 workers (0/28) ...
@fury/web:build:   Generating static pages using 9 workers (7/28)
@fury/web:build:   Generating static pages using 9 workers (14/28)
@fury/web:build:   Generating static pages using 9 workers (21/28)
@fury/web:build: ✓ Generating static pages using 9 workers (28/28) in 272ms
@fury/web:build:   Finalizing page optimization ...
@fury/web:build:   Collecting build traces ...
@fury/web:build:
@fury/web:build: Route (app)
@fury/web:build: ┌ ƒ /
@fury/web:build: ├ ○ /_not-found
@fury/web:build: ├ ○ /admin
@fury/web:build: ├ ○ /admin/ads
@fury/web:build: ├ ○ /admin/categories
@fury/web:build: ├ ○ /admin/comments
@fury/web:build: ├ ○ /admin/contact
@fury/web:build: ├ ƒ /admin/contact/[messageId]
@fury/web:build: ├ ○ /admin/dashboard
@fury/web:build: ├ ○ /admin/gifts
@fury/web:build: ├ ○ /admin/gifts/grants
@fury/web:build: ├ ○ /admin/reports
@fury/web:build: ├ ○ /admin/users
@fury/web:build: ├ ƒ /admin/users/[userId]
@fury/web:build: ├ ○ /admin/works
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/new
@fury/web:build: ├ ƒ /admin/works/[workId]/edit
@fury/web:build: ├ ○ /admin/works/new
@fury/web:build: ├ ○ /auth/forgot-password
@fury/web:build: ├ ○ /auth/login
@fury/web:build: ├ ○ /auth/register
@fury/web:build: ├ ○ /auth/reset-password
@fury/web:build: ├ ○ /auth/verify-email
@fury/web:build: ├ ƒ /categories
@fury/web:build: ├ ○ /contact
@fury/web:build: ├ ○ /copyright
@fury/web:build: ├ ○ /dashboard
@fury/web:build: ├ ƒ /discover
@fury/web:build: ├ ○ /library
@fury/web:build: ├ ○ /privacy
@fury/web:build: ├ ƒ /report-issue
@fury/web:build: ├ ƒ /robots.txt
@fury/web:build: ├ ○ /settings
@fury/web:build: ├ ƒ /sitemap.xml
@fury/web:build: ├ ƒ /stories
@fury/web:build: ├ ƒ /story/[id]
@fury/web:build: ├ ƒ /story/[id]/chapter/[chapterId]
@fury/web:build: └ ○ /terms
@fury/web:build:
@fury/web:build:
@fury/web:build: ○  (Static)   prerendered as static content
@fury/web:build: ƒ  (Dynamic)  server-rendered on demand
@fury/web:build:

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    24.908s

$ node scripts/assert-build-output.mjs
Build output verified: 6 required entry artifacts present; 386 emitted files contain no test artifacts.
```

## integration-first-tests-corrected

Original capture: `integration-first-tests-corrected.txt`. Bytes: 557. SHA-256: `43fc85ee49f2776dbfde112e0ebac412732b5022da6fa9cd165bb3b094fc023b`.

```text
$ vitest run --config vitest.config.ts src/components/ui/MangaCard/MangaCard.test.tsx src/features/discover/model/catalog.test.ts src/features/text-stories/model/catalog.test.tsx src/features/public-catalog/components src/features/home/components/navigation-links.test.tsx

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web


 Test Files  6 passed (6)
      Tests  17 passed (17)
   Start at  11:09:10
   Duration  1.90s (transform 690ms, setup 1.43s, import 1.52s, tests 822ms, environment 5.04s)

```

## integration-first-tests

Original capture: `integration-first-tests.txt`. Bytes: 27269. SHA-256: `ea57b5b503c186e12aa04514508ea7b61121114917d51d0102fbed614674dafb`.

```text
$ vitest run --config vitest.config.ts src/components/ui/MangaCard/MangaCard.test.tsx src/features/discover/model/catalog.test.ts src/features/text-stories/model/catalog.test.tsx src/features/public-catalog/components src/features/home/components/navigation-links.test.tsx

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web

 ❯ src/features/public-catalog/components/PublicCatalogListing.test.tsx (4 tests | 1 failed) 1216ms
     × distinguishes page=9 1010ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/public-catalog/components/PublicCatalogListing.test.tsx > server authoritative catalog presentation > distinguishes page=9
TestingLibraryElementError: Unable to find role="heading" and name "لا توجد نتائج في هذه الصفحة"

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div[39m
      [33mclass[39m=[32m"_filterContainer_4cf5a1"[39m
      [33mdir[39m=[32m"rtl"[39m
    [36m>[39m
      [36m<form[39m
        [33maction[39m=[32m"/discover"[39m
        [33mclass[39m=[32m"_filterForm_4cf5a1"[39m
        [33mmethod[39m=[32m"get"[39m
      [36m>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_queryControl_4cf5a1"[39m
        [36m>[39m
          [36m<label[39m
            [33mfor[39m=[32m"discover-query"[39m
          [36m>[39m
            [0mالبحث في [0m
            [0mكل الأعمال[0m
          [36m</label>[39m
          [36m<input[39m
            [33mid[39m=[32m"discover-query"[39m
            [33mmaxlength[39m=[32m"100"[39m
            [33mname[39m=[32m"q"[39m
            [33mplaceholder[39m=[32m"ابحث بالعنوان…"[39m
            [33mtype[39m=[32m"search"[39m
            [33mvalue[39m=[32m""[39m
          [36m/>[39m
        [36m</div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_selectControl_4cf5a1"[39m
        [36m>[39m
          [36m<label[39m
            [33mfor[39m=[32m"discover-category"[39m
          [36m>[39m
            [0mالتصنيف[0m
          [36m</label>[39m
          [36m<select[39m
            [33mid[39m=[32m"discover-category"[39m
            [33mname[39m=[32m"category"[39m
          [36m>[39m
            [36m<option[39m
              [33mselected[39m=[32m""[39m
              [33mvalue[39m=[32m""[39m
            [36m>[39m
              [0mالكل[0m
            [36m</option>[39m
          [36m</select>[39m
          [36m<svg[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"lucide lucide-chevron-down"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"m6 9 6 6 6-6"[39m
            [36m/>[39m
          [36m</svg>[39m
        [36m</div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_selectControl_4cf5a1"[39m
        [36m>[39m
          [36m<label[39m
            [33mfor[39m=[32m"discover-status"[39m
          [36m>[39m
            [0mالحالة[0m
          [36m</label>[39m
          [36m<select[39m
            [33mid[39m=[32m"discover-status"[39m
            [33mname[39m=[32m"status"[39m
          [36m>[39m
            [36m<option[39m
              [33mselected[39m=[32m""[39m
              [33mvalue[39m=[32m""[39m
            [36m>[39m
              [0mالكل[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"ongoing"[39m
            [36m>[39m
              [0mمستمرة[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"completed"[39m
            [36m>[39m
              [0mمكتملة[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"hiatus"[39m
            [36m>[39m
              [0mمتوقفة مؤقتًا[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"cancelled"[39m
            [36m>[39m
              [0mملغاة[0m
            [36m</option>[39m
          [36m</select>[39m
          [36m<svg[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"lucide lucide-chevron-down"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"m6 9 6 6 6-6"[39m
            [36m/>[39m
          [36m</svg>[39m
        [36m</div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_selectControl_4cf5a1"[39m
        [36m>[39m
          [36m<label[39m
            [33mfor[39m=[32m"discover-type"[39m
          [36m>[39m
            [0mالنوع[0m
          [36m</label>[39m
          [36m<select[39m
            [33mid[39m=[32m"discover-type"[39m
            [33mname[39m=[32m"type"[39m
          [36m>[39m
            [36m<option[39m
              [33mselected[39m=[32m""[39m
              [33mvalue[39m=[32m""[39m
            [36m>[39m
              [0mالكل[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"manga"[39m
            [36m>[39m
              [0mمانجا[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"manhwa"[39m
            [36m>[39m
              [0mمانهوا[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"manhua"[39m
            [36m>[39m
              [0mمانها[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"comics"[39m
            [36m>[39m
              [0mكوميكس[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"novel"[39m
            [36m>[39m
              [0mرواية[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"text-story"[39m
            [36m>[39m
              [0mقصة نصية[0m
            [36m</option>[39m
          [36m</select>[39m
          [36m<svg[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"lucide lucide-chevron-down"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"m6 9 6 6 6-6"[39m
            [36m/>[39m
          [36m</svg>[39m
        [36m</div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_selectControl_4cf5a1"[39m
        [36m>[39m
          [36m<label[39m
            [33mfor[39m=[32m"discover-sort"[39m
          [36m>[39m
            [0mالترتيب[0m
          [36m</label>[39m
          [36m<select[39m
            [33mid[39m=[32m"discover-sort"[39m
            [33mname[39m=[32m"sort"[39m
          [36m>[39m
            [36m<option[39m
              [33mselected[39m=[32m""[39m
              [33mvalue[39m=[32m"newest"[39m
            [36m>[39m
              [0mالأحدث إضافة[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"chapter-latest"[39m
            [36m>[39m
              [0mآخر فصل منشور[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"title-asc"[39m
            [36m>[39m
              [0mأ - ي[0m
            [36m</option>[39m
            [36m<option[39m
              [33mvalue[39m=[32m"title-desc"[39m
            [36m>[39m
              [0mي - أ[0m
            [36m</option>[39m
          [36m</select>[39m
          [36m<svg[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"lucide lucide-chevron-down"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"m6 9 6 6 6-6"[39m
            [36m/>[39m
          [36m</svg>[39m
        [36m</div>[39m
        [36m<button[39m
          [33mclass[39m=[32m"_searchBtn_4cf5a1"[39m
          [33mtype[39m=[32m"submit"[39m
        [36m>[39m
          [36m<svg[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"lucide lucide-search"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"m21 21-4.34-4.34"[39m
            [36m/>[39m
            [36m<circle[39m
              [33mcx[39m=[32m"11"[39m
              [33mcy[39m=[32m"11"[39m
              [33mr[39m=[32m"8"[39m
            [36m/>[39m
          [36m</svg>[39m
          [0mالبحث[0m
        [36m</button>[39m
      [36m</form>[39m
    [36m</div>[39m
    [36m<div[39m
      [33mdir[39m=[32m"rtl"[39m
    [36m>[39m
      [36m<section[39m
        [33mclass[39m=[32m"_state_2cac4d"[39m
        [33mrole[39m=[32m"status"[39m
      [36m>[39m
        [36m<svg[39m
          [33maria-hidden[39m=[32m"true"[39m
          [33mclass[39m=[32m"lucide lucide-circle-alert _icon_2cac4d"[39m
          [33mfill[39m=[32m"none"[39m
          [33mheight[39m=[32m"24"[39m
          [33mstroke[39m=[32m"currentColor"[39m
          [33mstroke-linecap[39m=[32m"round"[39m
          [33mstroke-linejoin[39m=[32m"round"[39m
          [33mstroke-width[39m=[32m"2"[39m
          [33mviewBox[39m=[32m"0 0 24 24"[39m
          [33mwidth[39m=[32m"24"[39m
          [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
        [36m>[39m
          [36m<circle[39m
            [33mcx[39m=[32m"12"[39m
            [33mcy[39m=[32m"12"[39m
            [33mr[39m=[32m"10"[39m
          [36m/>[39m
          [36m<line[39m
            [33mx1[39m=[32m"12"[39m
            [33mx2[39m=[32m"12"[39m
            [33my1[39m=[32m"8"[39m
            [33my2[39m=[32m"12"[39m
          [36m/>[39m
          [36m<line[39m
            [33mx1[39m=[32m"12"[39m
            [33mx2[39m=[32m"12.01"[39m
            [33my1[39m=[32m"16"[39m
            [33my2[39m=[32m"16"[39m
          [36m/>[39m
        [36m</svg>[39m
        [36m<h2>[39m
          [0mتعذّر تحميل المحتوى[0m
        [36m</h2>[39m
        [36m<p>[39m
          [0mالمحتوى غير متاح مؤقتًا. يمكنك إعادة المحاولة.[0m
        [36m</p>[39m
        [36m<button[39m
          [33mclass[39m=[32m"button button--small"[39m
          [33mtype[39m=[32m"button"[39m
        [36m>[39m
          [0mإعادة المحاولة[0m
        [36m</button>[39m
      [36m</section>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m

Ignored nodes: comments, script, style
[36m<html>[39m
  [36m<head />[39m
  [36m<body>[39m
    [36m<div>[39m
      [36m<div[39m
        [33mclass[39m=[32m"_filterContainer_4cf5a1"[39m
        [33mdir[39m=[32m"rtl"[39m
      [36m>[39m
        [36m<form[39m
          [33maction[39m=[32m"/discover"[39m
          [33mclass[39m=[32m"_filterForm_4cf5a1"[39m
          [33mmethod[39m=[32m"get"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_queryControl_4cf5a1"[39m
          [36m>[39m
            [36m<label[39m
              [33mfor[39m=[32m"discover-query"[39m
            [36m>[39m
              [0mالبحث في [0m
              [0mكل الأعمال[0m
            [36m</label>[39m
            [36m<input[39m
              [33mid[39m=[32m"discover-query"[39m
              [33mmaxlength[39m=[32m"100"[39m
              [33mname[39m=[32m"q"[39m
              [33mplaceholder[39m=[32m"ابحث بالعنوان…"[39m
              [33mtype[39m=[32m"search"[39m
              [33mvalue[39m=[32m""[39m
            [36m/>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_selectControl_4cf5a1"[39m
          [36m>[39m
            [36m<label[39m
              [33mfor[39m=[32m"discover-category"[39m
            [36m>[39m
              [0mالتصنيف[0m
            [36m</label>[39m
            [36m<select[39m
              [33mid[39m=[32m"discover-category"[39m
              [33mname[39m=[32m"category"[39m
            [36m>[39m
              [36m<option[39m
                [33mselected[39m=[32m""[39m
                [33mvalue[39m=[32m""[39m
              [36m>[39m
                [0mالكل[0m
              [36m</option>[39m
            [36m</select>[39m
            [36m<svg[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"lucide lucide-chevron-down"[39m
              [33mfill[39m=[32m"none"[39m
              [33mheight[39m=[32m"24"[39m
              [33mstroke[39m=[32m"currentColor"[39m
              [33mstroke-linecap[39m=[32m"round"[39m
              [33mstroke-linejoin[39m=[32m"round"[39m
              [33mstroke-width[39m=[32m"2"[39m
              [33mviewBox[39m=[32m"0 0 24 24"[39m
              [33mwidth[39m=[32m"24"[39m
              [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
            [36m>[39m
              [36m<path[39m
                [33md[39m=[32m"m6 9 6 6 6-6"[39m
              [36m/>[39m
            [36m</svg>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_selectControl_4cf5a1"[39m
          [36m>[39m
            [36m<label[39m
              [33mfor[39m=[32m"discover-status"[39m
            [36m>[39m
              [0mالحالة[0m
            [36m</label>[39m
            [36m<select[39m
              [33mid[39m=[32m"discover-status"[39m
              [33mname[39m=[32m"status"[39m
            [36m>[39m
              [36m<option[39m
                [33mselected[39m=[32m""[39m
                [33mvalue[39m=[32m""[39m
              [36m>[39m
                [0mالكل[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"ongoing"[39m
              [36m>[39m
                [0mمستمرة[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"completed"[39m
              [36m>[39m
                [0mمكتملة[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"hiatus"[39m
              [36m>[39m
                [0mمتوقفة مؤقتًا[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"cancelled"[39m
              [36m>[39m
                [0mملغاة[0m
              [36m</option>[39m
            [36m</select>[39m
            [36m<svg[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"lucide lucide-chevron-down"[39m
              [33mfill[39m=[32m"none"[39m
              [33mheight[39m=[32m"24"[39m
              [33mstroke[39m=[32m"currentColor"[39m
              [33mstroke-linecap[39m=[32m"round"[39m
              [33mstroke-linejoin[39m=[32m"round"[39m
              [33mstroke-width[39m=[32m"2"[39m
              [33mviewBox[39m=[32m"0 0 24 24"[39m
              [33mwidth[39m=[32m"24"[39m
              [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
            [36m>[39m
              [36m<path[39m
                [33md[39m=[32m"m6 9 6 6 6-6"[39m
              [36m/>[39m
            [36m</svg>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_selectControl_4cf5a1"[39m
          [36m>[39m
            [36m<label[39m
              [33mfor[39m=[32m"discover-type"[39m
            [36m>[39m
              [0mالنوع[0m
            [36m</label>[39m
            [36m<select[39m
              [33mid[39m=[32m"discover-type"[39m
              [33mname[39m=[32m"type"[39m
            [36m>[39m
              [36m<option[39m
                [33mselected[39m=[32m""[39m
                [33mvalue[39m=[32m""[39m
              [36m>[39m
                [0mالكل[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"manga"[39m
              [36m>[39m
                [0mمانجا[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"manhwa"[39m
              [36m>[39m
                [0mمانهوا[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"manhua"[39m
              [36m>[39m
                [0mمانها[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"comics"[39m
              [36m>[39m
                [0mكوميكس[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"novel"[39m
              [36m>[39m
                [0mرواية[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"text-story"[39m
              [36m>[39m
                [0mقصة نصية[0m
              [36m</option>[39m
            [36m</select>[39m
            [36m<svg[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"lucide lucide-chevron-down"[39m
              [33mfill[39m=[32m"none"[39m
              [33mheight[39m=[32m"24"[39m
              [33mstroke[39m=[32m"currentColor"[39m
              [33mstroke-linecap[39m=[32m"round"[39m
              [33mstroke-linejoin[39m=[32m"round"[39m
              [33mstroke-width[39m=[32m"2"[39m
              [33mviewBox[39m=[32m"0 0 24 24"[39m
              [33mwidth[39m=[32m"24"[39m
              [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
            [36m>[39m
              [36m<path[39m
                [33md[39m=[32m"m6 9 6 6 6-6"[39m
              [36m/>[39m
            [36m</svg>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_selectControl_4cf5a1"[39m
          [36m>[39m
            [36m<label[39m
              [33mfor[39m=[32m"discover-sort"[39m
            [36m>[39m
              [0mالترتيب[0m
            [36m</label>[39m
            [36m<select[39m
              [33mid[39m=[32m"discover-sort"[39m
              [33mname[39m=[32m"sort"[39m
            [36m>[39m
              [36m<option[39m
                [33mselected[39m=[32m""[39m
                [33mvalue[39m=[32m"newest"[39m
              [36m>[39m
                [0mالأحدث إضافة[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"chapter-latest"[39m
              [36m>[39m
                [0mآخر فصل منشور[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"title-asc"[39m
              [36m>[39m
                [0mأ - ي[0m
              [36m</option>[39m
              [36m<option[39m
                [33mvalue[39m=[32m"title-desc"[39m
              [36m>[39m
                [0mي - أ[0m
              [36m</option>[39m
            [36m</select>[39m
            [36m<svg[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"lucide lucide-chevron-down"[39m
              [33mfill[39m=[32m"none"[39m
              [33mheight[39m=[32m"24"[39m
              [33mstroke[39m=[32m"currentColor"[39m
              [33mstroke-linecap[39m=[32m"round"[39m
              [33mstroke-linejoin[39m=[32m"round"[39m
              [33mstroke-width[39m=[32m"2"[39m
              [33mviewBox[39m=[32m"0 0 24 24"[39m
              [33mwidth[39m=[32m"24"[39m
              [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
            [36m>[39m
              [36m<path[39m
                [33md[39m=[32m"m6 9 6 6 6-6"[39m
              [36m/>[39m
            [36m</svg>[39m
          [36m</div>[39m
          [36m<button[39m
            [33mclass[39m=[32m"_searchBtn_4cf5a1"[39m
            [33mtype[39m=[32m"submit"[39m
          [36m>[39m
            [36m<svg[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"lucide lucide-search"[39m
              [33mfill[39m=[32m"none"[39m
              [33mheight[39m=[32m"24"[39m
              [33mstroke[39m=[32m"currentColor"[39m
              [33mstroke-linecap[39m=[32m"round"[39m
              [33mstroke-linejoin[39m=[32m"round"[39m
              [33mstroke-width[39m=[32m"2"[39m
              [33mviewBox[39m=[32m"0 0 24 24"[39m
              [33mwidth[39m=[32m"24"[39m
              [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
            [36m>[39m
              [36m<path[39m
                [33md[39m=[32m"m21 21-4.34-4.34"[39m
              [36m/>[39m
              [36m<circle[39m
                [33mcx[39m=[32m"11"[39m
                [33mcy[39m=[32m"11"[39m
                [33mr[39m=[32m"8"[39m
              [36m/>[39m
            [36m</svg>[39m
            [0mالبحث[0m
          [36m</button>[39m
        [36m</form>[39m
      [36m</div>[39m
      [36m<div[39m
        [33mdir[39m=[32m"rtl"[39m
      [36m>[39m
        [36m<section[39m
          [33mclass[39m=[32m"_state_2cac4d"[39m
          [33mrole[39m=[32m"status"[39m
        [36m>[39m
          [36m<svg[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"lucide lucide-circle-alert _icon_2cac4d"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<circle[39m
              [33mcx[39m=[32m"12"[39m
              [33mcy[39m=[32m"12"[39m
              [33mr[39m=[32m"10"[39m
            [36m/>[39m
            [36m<line[39m
              [33mx1[39m=[32m"12"[39m
              [33mx2[39m=[32m"12"[39m
              [33my1[39m=[32m"8"[39m
              [33my2[39m=[32m"12"[39m
            [36m/>[39m
            [36m<line[39m
              [33mx1[39m=[32m"12"[39m
              [33mx2[39m=[32m"12.01"[39m
              [33my1[39m=[32m"16"[39m
              [33my2[39m=[32m"16"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<h2>[39m
            [0mتعذّر تحميل المحتوى[0m
          [36m</h2>[39m
          [36m<p>[39m
            [0mالمحتوى غير متاح مؤقتًا. يمكنك إعادة المحاولة.[0m
          [36m</p>[39m
          [36m<button[39m
            [33mclass[39m=[32m"button button--small"[39m
            [33mtype[39m=[32m"button"[39m
          [36m>[39m
            [0mإعادة المحاولة[0m
          [36m</button>[39m
        [36m</section>[39m
      [36m</div>[39m
    [36m</div>[39m
  [36m</body>[39m
[36m</html>[39m
 ❯ waitForWrapper ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/wait-for.js:163:27
 ❯ src/features/public-catalog/components/PublicCatalogListing.test.tsx:34:11
     32|     vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response(JSON.…
     33|     renderListing(search);
     34|     await waitFor(()=>expect(screen.getByRole("heading",{name:title}))…
       |           ^
     35|   });
     36| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 5 passed (6)
      Tests  1 failed | 16 passed (17)
   Start at  11:08:07
   Duration  2.94s (transform 726ms, setup 1.48s, import 1.47s, tests 1.81s, environment 5.51s)

/Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 test: `vitest run --config vitest.config.ts src/components/ui/MangaCard/MangaCard.test.tsx src/features/discover/model/catalog.test.ts src/features/text-stories/model/catalog.test.tsx src/features/public-catalog/components src/features/home/components/navigation-links.test.tsx`
Exit status 1
```

## integration-home-detail-corrected

Original capture: `integration-home-detail-corrected.txt`. Bytes: 571. SHA-256: `5d6a2e76889ebacc731e31774584cf9450c4c8292418ec7909274ab0281e115b`.

```text
$ vitest run --config vitest.config.ts src/features/home/components/public-home.test.tsx src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx src/features/story/routing.test.tsx src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web


 Test Files  4 passed (4)
      Tests  15 passed (15)
   Start at  11:16:11
   Duration  1.71s (transform 513ms, setup 804ms, import 1.32s, tests 854ms, environment 3.14s)

```

## integration-home-detail-tests

Original capture: `integration-home-detail-tests.txt`. Bytes: 31748. SHA-256: `5a937682fd65ddc373d02db610db92a7a6fe5b6a65eb8a39198cd9002d006337`.

```text
$ vitest run --config vitest.config.ts src/features/home/components/public-home.test.tsx src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx src/features/story/routing.test.tsx src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx 'src/app/story/[id]/chapter/[chapterId]/page.test.tsx'

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web

 ❯ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (4 tests | 1 failed) 1230ms
     × uses full-set latest beyond the first bounded page and recovers image failure 1038ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx > persisted work detail > uses full-set latest beyond the first bounded page and recovers image failure
TestingLibraryElementError: Unable to find an element with the text: Chapter 27. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div[39m
      [33mclass[39m=[32m"_sidebarCol_69060d"[39m
    [36m>[39m
      [36m<aside[39m
        [33mclass[39m=[32m"_sidebar_2e9c2e"[39m
      [36m>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_coverWrapper_2e9c2e"[39m
        [36m>[39m
          [36m<img[39m
            [33malt[39m=[32m"Saved Work"[39m
            [33mclass[39m=[32m"_coverImg_2e9c2e"[39m
            [33mloading[39m=[32m"lazy"[39m
            [33msrc[39m=[32m"http://localhost:4000/api/v1/content/works/saved-work/cover"[39m
          [36m/>[39m
          [36m<span[39m
            [33mclass[39m=[32m"_coloredBadge_2e9c2e"[39m
          [36m>[39m
            [36m<svg[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"lucide lucide-book-open-text"[39m
              [33mfill[39m=[32m"none"[39m
              [33mheight[39m=[32m"24"[39m
              [33mstroke[39m=[32m"currentColor"[39m
              [33mstroke-linecap[39m=[32m"round"[39m
              [33mstroke-linejoin[39m=[32m"round"[39m
              [33mstroke-width[39m=[32m"2"[39m
              [33mstyle[39m=[32m"width: 13px; height: 13px;"[39m
              [33mviewBox[39m=[32m"0 0 24 24"[39m
              [33mwidth[39m=[32m"24"[39m
              [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
            [36m>[39m
              [36m<path[39m
                [33md[39m=[32m"M12 7v14"[39m
              [36m/>[39m
              [36m<path[39m
                [33md[39m=[32m"M16 12h2"[39m
              [36m/>[39m
              [36m<path[39m
                [33md[39m=[32m"M16 8h2"[39m
              [36m/>[39m
              [36m<path[39m
                [33md[39m=[32m"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"[39m
              [36m/>[39m
              [36m<path[39m
                [33md[39m=[32m"M6 12h2"[39m
              [36m/>[39m
              [36m<path[39m
                [33md[39m=[32m"M6 8h2"[39m
              [36m/>[39m
            [36m</svg>[39m
            [0mرواية[0m
          [36m</span>[39m
        [36m</div>[39m
        [36m<button[39m
          [33maria-describedby[39m=[32m"bookmark-deferred"[39m
          [33mclass[39m=[32m"_bookmarkBtn_2e9c2e"[39m
          [33mdisabled[39m=[32m""[39m
          [33mtype[39m=[32m"button"[39m
        [36m>[39m
          [36m<svg[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"lucide lucide-bookmark"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mstyle[39m=[32m"width: 16px; height: 16px;"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<span>[39m
            [0mالحفظ لاحقًا[0m
          [36m</span>[39m
        [36m</button>[39m
        [36m<p[39m
          [33mclass[39m=[32m"_followers_2e9c2e"[39m
          [33mid[39m=[32m"bookmark-deferred"[39m
        [36m>[39m
          [0mالحفظ والتقييم والتعليقات غير متاحة بعد.[0m
        [36m</p>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_infoList_2e9c2e"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_infoItem_2e9c2e"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_label_2e9c2e"[39m
            [36m>[39m
              [0mالحالة[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_value_2e9c2e"[39m
              [33mdir[39m=[32m"auto"[39m
            [36m>[39m
              [0mمستمرة[0m
            [36m</span>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_infoItem_2e9c2e"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_label_2e9c2e"[39m
            [36m>[39m
              [0mالنوع[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_value_2e9c2e"[39m
              [33mdir[39m=[32m"auto"[39m
            [36m>[39m
              [0mرواية[0m
            [36m</span>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_infoItem_2e9c2e"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_label_2e9c2e"[39m
            [36m>[39m
              [0mتاريخ النشر[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_value_2e9c2e"[39m
              [33mdir[39m=[32m"auto"[39m
            [36m>[39m
              [0m31‏/10‏/2026[0m
            [36m</span>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_infoItem_2e9c2e"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_label_2e9c2e"[39m
            [36m>[39m
              [0mالمؤلف[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_value_2e9c2e"[39m
              [33mdir[39m=[32m"auto"[39m
            [36m>[39m
              [0mSaved Author[0m
            [36m</span>[39m
          [36m</div>[39m
        [36m</div>[39m
      [36m</aside>[39m
    [36m</div>[39m
    [36m<main[39m
      [33mclass[39m=[32m"_mainCol_69060d"[39m
      [33mid[39m=[32m"main-content"[39m
    [36m>[39m
      [36m<div[39m
        [33mclass[39m=[32m"_container_cad4b1"[39m
      [36m>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_titleBlock_cad4b1"[39m
        [36m>[39m
          [36m<h1[39m
            [33mclass[39m=[32m"_mainTitle_cad4b1"[39m
            [33mdir[39m=[32m"auto"[39m
          [36m>[39m
            [0mSaved Work[0m
          [36m</h1>[39m
        [36m</div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_genresWrapper_cad4b1"[39m
        [36m>[39m
          [36m<a[39m
            [33mclass[39m=[32m"_genreBadge_cad4b1"[39m
            [33mhref[39m=[32m"/discover?category=action"[39m
          [36m>[39m
            [0mAction[0m
          [36m</a>[39m
        [36m</div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_descriptionSection_cad4b1"[39m
        [36m>[39m
          [36m<h3[39m
            [33mclass[39m=[32m"_sectionHeader_cad4b1"[39m
          [36m>[39m
            [0mقصة العمل [0m
            [0mSaved Work[0m
          [36m</h3>[39m
          [36m<p[39m
            [33mclass[39m=[32m"_descriptionText_cad4b1"[39m
            [33mdir[39m=[32m"auto"[39m
          [36m>[39m
            [0mA complete saved public synopsis.[0m
          [36m</p>[39m
        [36m</div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_quickLinks_cad4b1"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_quickLinkItem_cad4b1"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_quickLinkLabel_cad4b1"[39m
            [36m>[39m
              [0mالفصل الأول[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_quickLinkVal_cad4b1"[39m
            [36m>[39m
              [0mفصل [0m
              [0m1[0m
            [36m</span>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_quickLinkItem_cad4b1"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_quickLinkLabel_cad4b1"[39m
            [36m>[39m
              [0mالفصل الجديد[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_quickLinkVal_cad4b1"[39m
            [36m>[39m
              [0mفصل [0m
              [0m27[0m
            [36m</span>[39m
          [36m</div>[39m
        [36m</div>[39m
        [36m<p[39m
          [33mrole[39m=[32m"note"[39m
        [36m>[39m
          [0mالقراءة غير متاحة بعد؛ هذه معلومات الفصول المنشورة.[0m
        [36m</p>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_chaptersSection_cad4b1"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_chaptersHeader_cad4b1"[39m
          [36m>[39m
            [36m<h3>[39m
              [0mالفصول [0m
              [0mSaved Work[0m
            [36m</h3>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_searchWrapper_cad4b1"[39m
          [36m>[39m
            [36m<svg[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"lucide lucide-search _searchIcon_cad4b1"[39m
              [33mfill[39m=[32m"none"[39m
              [33mheight[39m=[32m"24"[39m
              [33mstroke[39m=[32m"currentColor"[39m
              [33mstroke-linecap[39m=[32m"round"[39m
              [33mstroke-linejoin[39m=[32m"round"[39m
              [33mstroke-width[39m=[32m"2"[39m
              [33mviewBox[39m=[32m"0 0 24 24"[39m
              [33mwidth[39m=[32m"24"[39m
              [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
            [36m>[39m
              [36m<path[39m
                [33md[39m=[32m"m21 21-4.34-4.34"[39m
              [36m/>[39m
              [36m<circle[39m
                [33mcx[39m=[32m"11"[39m
                [33mcy[39m=[32m"11"[39m
                [33mr[39m=[32m"8"[39m
              [36m/>[39m
            [36m</svg>[39m
            [36m<input[39m
              [33maria-label[39m=[32m"بحث عن فصل برقمه"[39m
              [33mclass[39m=[32m"_searchInput_cad4b1"[39m
              [33minputmode[39m=[32m"numeric"[39m
              [33mmaxlength[39m=[32m"9"[39m
              [33mplaceholder[39m=[32m"بحث عن فصل برقمه"[39m
              [33mtype[39m=[32m"search"[39m
              [33mvalue[39m=[32m""[39m
            [36m/>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_chaptersListWrapper_cad4b1"[39m
          [36m>[39m
            [36m<div[39m
              [33mdir[39m=[32m"rtl"[39m
            [36m>[39m
              [36m<section[39m
                [33mclass[39m=[32m"_state_2cac4d"[39m
                [33mrole[39m=[32m"status"[39m
              [36m>[39m
                [36m<svg[39m
                  [33maria-hidden[39m=[32m"true"[39m
                  [33mclass[39m=[32m"lucide lucide-circle-alert _icon_2cac4d"[39m
                  [33mfill[39m=[32m"none"[39m
                  [33mheight[39m=[32m"24"[39m
                  [33mstroke[39m=[32m"currentColor"[39m
                  [33mstroke-linecap[39m=[32m"round"[39m
                  [33mstroke-linejoin[39m=[32m"round"[39m
                  [33mstroke-width[39m=[32m"2"[39m
                  [33mviewBox[39m=[32m"0 0 24 24"[39m
                  [33mwidth[39m=[32m"24"[39m
                  [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                [36m>[39m
                  [36m<circle[39m
                    [33mcx[39m=[32m"12"[39m
                    [33mcy[39m=[32m"12"[39m
                    [33mr[39m=[32m"10"[39m
                  [36m/>[39m
                  [36m<line[39m
                    [33mx1[39m=[32m"12"[39m
                    [33mx2[39m=[32m"12"[39m
                    [33my1[39m=[32m"8"[39m
                    [33my2[39m=[32m"12"[39m
                  [36m/>[39m
                  [36m<line[39m
                    [33mx1[39m=[32m"12"[39m
                    [33mx2[39m=[32m"12.01"[39m
                    [33my1[39m=[32m"16"[39m
                    [33my2[39m=[32m"16"[39m
                  [36m/>[39m
                [36m</svg>[39m
                [36m<h2>[39m
                  [0mتعذّر تحميل المحتوى[0m
                [36m</h2>[39m
                [36m<p>[39m
                  [0mالمحتوى غير متاح مؤقتًا. يمكنك إعادة المحاولة.[0m
                [36m</p>[39m
                [36m<button[39m
                  [33mclass[39m=[32m"button button--small"[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [0mإعادة المحاولة[0m
                [36m</button>[39m
              [36m</section>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<nav[39m
            [33maria-label[39m=[32m"صفحات الفصول"[39m
          [36m>[39m
            [36m<button[39m
              [33mclass[39m=[32m"button button--small"[39m
              [33mtype[39m=[32m"button"[39m
            [36m>[39m
              [0mالفصول السابقة[0m
            [36m</button>[39m
            [36m<span[39m
              [33mrole[39m=[32m"status"[39m
            [36m>[39m
              [0mالصفحة [0m
              [0m2[0m
              [0m من [0m
              [0m2[0m
            [36m</span>[39m
            [36m<button[39m
              [33mclass[39m=[32m"button button--small"[39m
              [33mdisabled[39m=[32m""[39m
              [33mtype[39m=[32m"button"[39m
            [36m>[39m
              [0mالفصول التالية[0m
            [36m</button>[39m
          [36m</nav>[39m
        [36m</div>[39m
      [36m</div>[39m
    [36m</main>[39m
  [36m</div>[39m
[36m</body>[39m

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div[39m
      [33mclass[39m=[32m"_sidebarCol_69060d"[39m
    [36m>[39m
      [36m<aside[39m
        [33mclass[39m=[32m"_sidebar_2e9c2e"[39m
      [36m>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_coverWrapper_2e9c2e"[39m
        [36m>[39m
          [36m<img[39m
            [33malt[39m=[32m"Saved Work"[39m
            [33mclass[39m=[32m"_coverImg_2e9c2e"[39m
            [33mloading[39m=[32m"lazy"[39m
            [33msrc[39m=[32m"http://localhost:4000/api/v1/content/works/saved-work/cover"[39m
          [36m/>[39m
          [36m<span[39m
            [33mclass[39m=[32m"_coloredBadge_2e9c2e"[39m
          [36m>[39m
            [36m<svg[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"lucide lucide-book-open-text"[39m
              [33mfill[39m=[32m"none"[39m
              [33mheight[39m=[32m"24"[39m
              [33mstroke[39m=[32m"currentColor"[39m
              [33mstroke-linecap[39m=[32m"round"[39m
              [33mstroke-linejoin[39m=[32m"round"[39m
              [33mstroke-width[39m=[32m"2"[39m
              [33mstyle[39m=[32m"width: 13px; height: 13px;"[39m
              [33mviewBox[39m=[32m"0 0 24 24"[39m
              [33mwidth[39m=[32m"24"[39m
              [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
            [36m>[39m
              [36m<path[39m
                [33md[39m=[32m"M12 7v14"[39m
              [36m/>[39m
              [36m<path[39m
                [33md[39m=[32m"M16 12h2"[39m
              [36m/>[39m
              [36m<path[39m
                [33md[39m=[32m"M16 8h2"[39m
              [36m/>[39m
              [36m<path[39m
                [33md[39m=[32m"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"[39m
              [36m/>[39m
              [36m<path[39m
                [33md[39m=[32m"M6 12h2"[39m
              [36m/>[39m
              [36m<path[39m
                [33md[39m=[32m"M6 8h2"[39m
              [36m/>[39m
            [36m</svg>[39m
            [0mرواية[0m
          [36m</span>[39m
        [36m</div>[39m
        [36m<button[39m
          [33maria-describedby[39m=[32m"bookmark-deferred"[39m
          [33mclass[39m=[32m"_bookmarkBtn_2e9c2e"[39m
          [33mdisabled[39m=[32m""[39m
          [33mtype[39m=[32m"button"[39m
        [36m>[39m
          [36m<svg[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"lucide lucide-bookmark"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mstyle[39m=[32m"width: 16px; height: 16px;"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<span>[39m
            [0mالحفظ لاحقًا[0m
          [36m</span>[39m
        [36m</button>[39m
        [36m<p[39m
          [33mclass[39m=[32m"_followers_2e9c2e"[39m
          [33mid[39m=[32m"bookmark-deferred"[39m
        [36m>[39m
          [0mالحفظ والتقييم والتعليقات غير متاحة بعد.[0m
        [36m</p>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_infoList_2e9c2e"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_infoItem_2e9c2e"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_label_2e9c2e"[39m
            [36m>[39m
              [0mالحالة[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_value_2e9c2e"[39m
              [33mdir[39m=[32m"auto"[39m
            [36m>[39m
              [0mمستمرة[0m
            [36m</span>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_infoItem_2e9c2e"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_label_2e9c2e"[39m
            [36m>[39m
              [0mالنوع[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_value_2e9c2e"[39m
              [33mdir[39m=[32m"auto"[39m
            [36m>[39m
              [0mرواية[0m
            [36m</span>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_infoItem_2e9c2e"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_label_2e9c2e"[39m
            [36m>[39m
              [0mتاريخ النشر[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_value_2e9c2e"[39m
              [33mdir[39m=[32m"auto"[39m
            [36m>[39m
              [0m31‏/10‏/2026[0m
            [36m</span>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_infoItem_2e9c2e"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_label_2e9c2e"[39m
            [36m>[39m
              [0mالمؤلف[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_value_2e9c2e"[39m
              [33mdir[39m=[32m"auto"[39m
            [36m>[39m
              [0mSaved Author[0m
            [36m</span>[39m
          [36m</div>[39m
        [36m</div>[39m
      [36m</aside>[39m
    [36m</div>[39m
    [36m<main[39m
      [33mclass[39m=[32m"_mainCol_69060d"[39m
      [33mid[39m=[32m"main-content"[39m
    [36m>[39m
      [36m<div[39m
        [33mclass[39m=[32m"_container_cad4b1"[39m
      [36m>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_titleBlock_cad4b1"[39m
        [36m>[39m
          [36m<h1[39m
            [33mclass[39m=[32m"_mainTitle_cad4b1"[39m
            [33mdir[39m=[32m"auto"[39m
          [36m>[39m
            [0mSaved Work[0m
          [36m</h1>[39m
        [36m</div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_genresWrapper_cad4b1"[39m
        [36m>[39m
          [36m<a[39m
            [33mclass[39m=[32m"_genreBadge_cad4b1"[39m
            [33mhref[39m=[32m"/discover?category=action"[39m
          [36m>[39m
            [0mAction[0m
          [36m</a>[39m
        [36m</div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_descriptionSection_cad4b1"[39m
        [36m>[39m
          [36m<h3[39m
            [33mclass[39m=[32m"_sectionHeader_cad4b1"[39m
          [36m>[39m
            [0mقصة العمل [0m
            [0mSaved Work[0m
          [36m</h3>[39m
          [36m<p[39m
            [33mclass[39m=[32m"_descriptionText_cad4b1"[39m
            [33mdir[39m=[32m"auto"[39m
          [36m>[39m
            [0mA complete saved public synopsis.[0m
          [36m</p>[39m
        [36m</div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_quickLinks_cad4b1"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_quickLinkItem_cad4b1"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_quickLinkLabel_cad4b1"[39m
            [36m>[39m
              [0mالفصل الأول[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_quickLinkVal_cad4b1"[39m
            [36m>[39m
              [0mفصل [0m
              [0m1[0m
            [36m</span>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_quickLinkItem_cad4b1"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_quickLinkLabel_cad4b1"[39m
            [36m>[39m
              [0mالفصل الجديد[0m
            [36m</span>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_quickLinkVal_cad4b1"[39m
            [36m>[39m
              [0mفصل [0m
              [0m27[0m
            [36m</span>[39m
          [36m</div>[39m
        [36m</div>[39m
        [36m<p[39m
          [33mrole[39m=[32m"note"[39m
        [36m>[39m
          [0mالقراءة غير متاحة بعد؛ هذه معلومات الفصول المنشورة.[0m
        [36m</p>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_chaptersSection_cad4b1"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_chaptersHeader_cad4b1"[39m
          [36m>[39m
            [36m<h3>[39m
              [0mالفصول [0m
              [0mSaved Work[0m
            [36m</h3>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_searchWrapper_cad4b1"[39m
          [36m>[39m
            [36m<svg[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"lucide lucide-search _searchIcon_cad4b1"[39m
              [33mfill[39m=[32m"none"[39m
              [33mheight[39m=[32m"24"[39m
              [33mstroke[39m=[32m"currentColor"[39m
              [33mstroke-linecap[39m=[32m"round"[39m
              [33mstroke-linejoin[39m=[32m"round"[39m
              [33mstroke-width[39m=[32m"2"[39m
              [33mviewBox[39m=[32m"0 0 24 24"[39m
              [33mwidth[39m=[32m"24"[39m
              [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
            [36m>[39m
              [36m<path[39m
                [33md[39m=[32m"m21 21-4.34-4.34"[39m
              [36m/>[39m
              [36m<circle[39m
                [33mcx[39m=[32m"11"[39m
                [33mcy[39m=[32m"11"[39m
                [33mr[39m=[32m"8"[39m
              [36m/>[39m
            [36m</svg>[39m
            [36m<input[39m
              [33maria-label[39m=[32m"بحث عن فصل برقمه"[39m
              [33mclass[39m=[32m"_searchInput_cad4b1"[39m
              [33minputmode[39m=[32m"numeric"[39m
              [33mmaxlength[39m=[32m"9"[39m
              [33mplaceholder[39m=[32m"بحث عن فصل برقمه"[39m
              [33mtype[39m=[32m"search"[39m
              [33mvalue[39m=[32m""[39m
            [36m/>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_chaptersListWrapper_cad4b1"[39m
          [36m>[39m
            [36m<div[39m
              [33mdir[39m=[32m"rtl"[39m
            [36m>[39m
              [36m<section[39m
                [33mclass[39m=[32m"_state_2cac4d"[39m
                [33mrole[39m=[32m"status"[39m
              [36m>[39m
                [36m<svg[39m
                  [33maria-hidden[39m=[32m"true"[39m
                  [33mclass[39m=[32m"lucide lucide-circle-alert _icon_2cac4d"[39m
                  [33mfill[39m=[32m"none"[39m
                  [33mheight[39m=[32m"24"[39m
                  [33mstroke[39m=[32m"currentColor"[39m
                  [33mstroke-linecap[39m=[32m"round"[39m
                  [33mstroke-linejoin[39m=[32m"round"[39m
                  [33mstroke-width[39m=[32m"2"[39m
                  [33mviewBox[39m=[32m"0 0 24 24"[39m
                  [33mwidth[39m=[32m"24"[39m
                  [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                [36m>[39m
                  [36m<circle[39m
                    [33mcx[39m=[32m"12"[39m
                    [33mcy[39m=[32m"12"[39m
                    [33mr[39m=[32m"10"[39m
                  [36m/>[39m
                  [36m<line[39m
                    [33mx1[39m=[32m"12"[39m
                    [33mx2[39m=[32m"12"[39m
                    [33my1[39m=[32m"8"[39m
                    [33my2[39m=[32m"12"[39m
                  [36m/>[39m
                  [36m<line[39m
                    [33mx1[39m=[32m"12"[39m
                    [33mx2[39m=[32m"12.01"[39m
                    [33my1[39m=[32m"16"[39m
                    [33my2[39m=[32m"16"[39m
                  [36m/>[39m
                [36m</svg>[39m
                [36m<h2>[39m
                  [0mتعذّر تحميل المحتوى[0m
                [36m</h2>[39m
                [36m<p>[39m
                  [0mالمحتوى غير متاح مؤقتًا. يمكنك إعادة المحاولة.[0m
                [36m</p>[39m
                [36m<button[39m
                  [33mclass[39m=[32m"button button--small"[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [0mإعادة المحاولة[0m
                [36m</button>[39m
              [36m</section>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<nav[39m
            [33maria-label[39m=[32m"صفحات الفصول"[39m
          [36m>[39m
            [36m<button[39m
              [33mclass[39m=[32m"button button--small"[39m
              [33mtype[39m=[32m"button"[39m
            [36m>[39m
              [0mالفصول السابقة[0m
            [36m</button>[39m
            [36m<span[39m
              [33mrole[39m=[32m"status"[39m
            [36m>[39m
              [0mالصفحة [0m
              [0m2[0m
              [0m من [0m
              [0m2[0m
            [36m</span>[39m
            [36m<button[39m
              [33mclass[39m=[32m"button button--small"[39m
              [33mdisabled[39m=[32m""[39m
              [33mtype[39m=[32m"button"[39m
            [36m>[39m
              [0mالفصول التالية[0m
            [36m</button>[39m
          [36m</nav>[39m
        [36m</div>[39m
      [36m</div>[39m
    [36m</main>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ waitForWrapper ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/wait-for.js:163:27
 ❯ ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:86:33
 ❯ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx:44:18
     42|     expect(screen.getByText("الفصل الجديد").parentElement).toHaveTextC…
     43|     fireEvent.click(screen.getByRole("button",{name:"الفصول التالية"})…
     44|     await screen.findByText("Chapter 27");
       |                  ^
     45|     expect(within(screen.getByRole("list")).getAllByRole("listitem")).…
     46|     fireEvent.error(screen.getByRole("img",{name:"Saved Work"}));

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 4 passed (5)
      Tests  1 failed | 19 passed (20)
   Start at  11:14:49
   Duration  2.85s (transform 746ms, setup 1.14s, import 1.78s, tests 1.96s, environment 4.33s)

/Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 test: `vitest run --config vitest.config.ts src/features/home/components/public-home.test.tsx src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx src/features/story/routing.test.tsx src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx 'src/app/story/[id]/chapter/[chapterId]/page.test.tsx'`
Exit status 1
```

## integration-home-tests

Original capture: `integration-home-tests.txt`. Bytes: 2841. SHA-256: `ba8bfbea9a7902503c3c8a315209ffaf9747ba7eba79ee83a031646540ffa974`.

```text
$ vitest run --config vitest.config.ts src/features/home/components/public-home.test.tsx src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web

 ❯ src/features/home/components/public-home.test.tsx (4 tests | 1 failed) 257ms
     × hides empty and unsupported trend sections and optional community actions/counts 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/home/components/public-home.test.tsx > authoritative public home sections > hides empty and unsupported trend sections and optional community actions/counts
TypeError: window.matchMedia is not a function
 ❯ src/features/public-catalog/hooks/use-reduced-motion.ts:9:14
      7| };
      8| export const useReducedMotion = () => useSyncExternalStore(subscribe,
      9|   ()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches, (…
       |              ^
     10|
 ❯ mountSyncExternalStore ../../node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/cjs/react-dom-client.development.js:8125:24
 ❯ Object.useSyncExternalStore ../../node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/cjs/react-dom-client.development.js:26269:16
 ❯ process.env.NODE_ENV.exports.useSyncExternalStore ../../node_modules/.pnpm/react@19.2.8/node_modules/react/cjs/react.development.js:1270:34
 ❯ useReducedMotion src/features/public-catalog/hooks/use-reduced-motion.ts:8:39
 ❯ HeroSection src/features/home/components/HeroSection/HeroSection.tsx:351:25
 ❯ Object.react_stack_bottom_frame ../../node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/cjs/react-dom-client.development.js:25904:20
 ❯ renderWithHooks ../../node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/cjs/react-dom-client.development.js:7662:22
 ❯ updateFunctionComponent ../../node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/cjs/react-dom-client.development.js:10166:19
 ❯ beginWork ../../node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/cjs/react-dom-client.development.js:11778:18

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 5 passed (6)
   Start at  11:12:38
   Duration  1.61s (transform 262ms, setup 356ms, import 616ms, tests 407ms, environment 1.48s)

/Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 test: `vitest run --config vitest.config.ts src/features/home/components/public-home.test.tsx src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx`
Exit status 1
```

## integration-hooks-current-6311

Original capture: `integration-hooks-current-6311.txt`. Bytes: 464. SHA-256: `893e4e777ef1e2a0a1384b901e00dad85ecce9b27ef653702d8ef5a83255fffc`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6311"


 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  12:45:50
   Duration  6.57s (transform 625ms, setup 1.02s, import 1.19s, tests 1.82s, environment 1.97s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed=6311
```

## integration-hooks-current-6312

Original capture: `integration-hooks-current-6312.txt`. Bytes: 464. SHA-256: `49440d9cfd005eed6e48c0a83f677492da47abb806924c01647b4b685e7d0d4d`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6312"


 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  12:45:59
   Duration  5.04s (transform 769ms, setup 547ms, import 1.54s, tests 1.81s, environment 751ms)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed=6312
```

## integration-hooks-current-6313

Original capture: `integration-hooks-current-6313.txt`. Bytes: 464. SHA-256: `caa25e03b159689a5e32294a5935bded7dc9823c5a8843b38fa7553cbb20d241`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6313"


 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  12:46:05
   Duration  2.75s (transform 103ms, setup 162ms, import 205ms, tests 1.61s, environment 625ms)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed=6313
```

## integration-hooks-current-6314

Original capture: `integration-hooks-current-6314.txt`. Bytes: 464. SHA-256: `c093dee326b17d0eec2874dab8e3e9f19e4bd6b45158d3194dbcce4286f6ee1d`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6314"


 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  12:46:09
   Duration  2.45s (transform 106ms, setup 114ms, import 212ms, tests 1.54s, environment 457ms)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed=6314
```

## integration-hooks-current-6315

Original capture: `integration-hooks-current-6315.txt`. Bytes: 463. SHA-256: `b9f7ace1ca20b2f5372f62781d5dd5d1b6f6b14c10cdf19ba96ef00610b3c81f`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6315"


 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  12:46:12
   Duration  2.41s (transform 98ms, setup 106ms, import 205ms, tests 1.55s, environment 435ms)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed=6315
```

## integration-hooks-current-6316

Original capture: `integration-hooks-current-6316.txt`. Bytes: 531. SHA-256: `4e5007be1ae5f686e1201e75de1e1108344e61fc36581dd9e2ef90bf9c9cdef0`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6316"


 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  12:48:08
   Duration  2.85s (transform 274ms, setup 387ms, import 657ms, tests 1.72s, environment 1.32s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx --sequence.shuffle --sequence.seed=6316
```

## integration-hooks-current-6317

Original capture: `integration-hooks-current-6317.txt`. Bytes: 531. SHA-256: `e9be5842cece94df4d046ba8d57cf3c2182214d784f93d863d8cd893bead8ead`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6317"


 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  12:48:11
   Duration  2.48s (transform 243ms, setup 261ms, import 539ms, tests 1.69s, environment 894ms)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx --sequence.shuffle --sequence.seed=6317
```

## integration-hooks-current-6318

Original capture: `integration-hooks-current-6318.txt`. Bytes: 531. SHA-256: `12d5c43c967a35f9bf8a85e520f092392728a90ca41180704b772b262fce5f19`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6318"


 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  12:48:15
   Duration  2.49s (transform 246ms, setup 249ms, import 530ms, tests 1.70s, environment 919ms)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx --sequence.shuffle --sequence.seed=6318
```

## integration-hooks-current-6319

Original capture: `integration-hooks-current-6319.txt`. Bytes: 531. SHA-256: `b495a05321e5d57fc3c5038cd8e4cdd2f62ff4efa9b5726556d21e5da50c6f5f`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6319"


 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  12:48:18
   Duration  2.52s (transform 239ms, setup 259ms, import 526ms, tests 1.69s, environment 887ms)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx --sequence.shuffle --sequence.seed=6319
```

## integration-hooks-current-6320

Original capture: `integration-hooks-current-6320.txt`. Bytes: 531. SHA-256: `d28703dee875f7b69fa798eba65637a20571012094d087930e67fcfb4fe7197e`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6320"


 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  12:48:21
   Duration  2.54s (transform 261ms, setup 257ms, import 542ms, tests 1.69s, environment 922ms)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx --sequence.shuffle --sequence.seed=6320
```

## integration-hooks-current-6321

Original capture: `integration-hooks-current-6321.txt`. Bytes: 599. SHA-256: `952f732e39154de35b807bb6fd404652b1ea6dfaf0a514ed4d57166af554feb0`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6321"


 Test Files  3 passed (3)
      Tests  29 passed (29)
   Start at  13:45:27
   Duration  3.57s (transform 721ms, setup 729ms, import 1.68s, tests 2.82s, environment 3.17s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6321
```

## integration-hooks-current-6322

Original capture: `integration-hooks-current-6322.txt`. Bytes: 599. SHA-256: `453f5b15e436c701482d83da2532928699d3024afaa94c094bf0200949848864`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6322"


 Test Files  3 passed (3)
      Tests  29 passed (29)
   Start at  13:45:32
   Duration  4.87s (transform 698ms, setup 1.49s, import 1.25s, tests 2.77s, environment 4.24s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6322
```

## integration-hooks-current-6323

Original capture: `integration-hooks-current-6323.txt`. Bytes: 599. SHA-256: `29224343190c9a38deba0f7a5db09920964ec7c2b1c862b74f15e1021c588947`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6323"


 Test Files  3 passed (3)
      Tests  29 passed (29)
   Start at  13:45:38
   Duration  4.82s (transform 1.21s, setup 1.32s, import 2.38s, tests 2.40s, environment 5.11s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6323
```

## integration-hooks-current-6324

Original capture: `integration-hooks-current-6324.txt`. Bytes: 599. SHA-256: `2acbf45c05c958ed103eed4b4b9422e1669a97ba5626912c7c5da346ce9a25a7`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6324"


 Test Files  3 passed (3)
      Tests  29 passed (29)
   Start at  13:45:45
   Duration  3.83s (transform 824ms, setup 939ms, import 2.32s, tests 2.57s, environment 2.58s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6324
```

## integration-hooks-current-6325

Original capture: `integration-hooks-current-6325.txt`. Bytes: 599. SHA-256: `23f5effaf5569650d7ae0f923c394a78de066aa7961f656ba772720fb7f662b7`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6325"


 Test Files  3 passed (3)
      Tests  29 passed (29)
   Start at  13:45:51
   Duration  2.59s (transform 378ms, setup 436ms, import 816ms, tests 2.23s, environment 1.45s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6325
```

## integration-hooks-current-6326

Original capture: `integration-hooks-current-6326.txt`. Bytes: 601. SHA-256: `05039106b1b09c1629a6aff8d3bcc2437ce2c47bbfe30eff3f47b1671eaad5ba`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6326"


 Test Files  3 passed (3)
      Tests  31 passed (31)
   Start at  13:55:28
   Duration  18.86s (transform 3.31s, setup 8.62s, import 3.44s, tests 2.79s, environment 32.87s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6326
```

## integration-hooks-current-6327

Original capture: `integration-hooks-current-6327.txt`. Bytes: 601. SHA-256: `ec1f4e3f3aa998e489f263b9e40e498797253944cd11e6152dacbc87fdb8d395`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6327"


 Test Files  3 passed (3)
      Tests  31 passed (31)
   Start at  13:55:51
   Duration  10.23s (transform 2.96s, setup 3.13s, import 5.79s, tests 4.33s, environment 13.58s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6327
```

## integration-hooks-current-6328

Original capture: `integration-hooks-current-6328.txt`. Bytes: 602. SHA-256: `d14b657031e47a09acf40f94189d35082a81c3eec44d0129b5e15eb7a56d2768`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6328"


 Test Files  3 passed (3)
      Tests  31 passed (31)
   Start at  13:56:05
   Duration  15.48s (transform 7.22s, setup 13.05s, import 4.57s, tests 3.82s, environment 18.85s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6328
```

## integration-hooks-current-6329

Original capture: `integration-hooks-current-6329.txt`. Bytes: 601. SHA-256: `8a010fc3b1ca6f73a091ecf486216cbaf72c1a6ea4ae70c392b1493f324336e0`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6329"


 Test Files  3 passed (3)
      Tests  31 passed (31)
   Start at  13:56:21
   Duration  11.07s (transform 3.11s, setup 9.37s, import 5.34s, tests 3.23s, environment 10.69s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6329
```

## integration-hooks-current-6330

Original capture: `integration-hooks-current-6330.txt`. Bytes: 600. SHA-256: `9123d716ca3429737f6a2aa3782955eec16c02fcf9ba6aa1622eab52b29694f6`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6330"


 Test Files  3 passed (3)
      Tests  31 passed (31)
   Start at  13:56:36
   Duration  10.78s (transform 3.96s, setup 2.45s, import 7.32s, tests 8.60s, environment 8.82s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6330
```

## integration-hooks-current-6331

Original capture: `integration-hooks-current-6331.txt`. Bytes: 599. SHA-256: `bb3065889abefccf5a6ed771e4edcf16fc5af162bb73d17174aac9bc3eb503a1`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6331"


 Test Files  3 passed (3)
      Tests  31 passed (31)
   Start at  14:33:14
   Duration  3.40s (transform 819ms, setup 1.55s, import 1.14s, tests 2.34s, environment 2.41s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6331
```

## integration-hooks-current-6332

Original capture: `integration-hooks-current-6332.txt`. Bytes: 599. SHA-256: `ba6e57bcaa6ce2f5d63d07357d4b0ed409ad666ccc5cade4153b1ab990aad992`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6332"


 Test Files  3 passed (3)
      Tests  31 passed (31)
   Start at  14:33:18
   Duration  2.70s (transform 429ms, setup 504ms, import 893ms, tests 2.39s, environment 1.61s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6332
```

## integration-hooks-current-6333

Original capture: `integration-hooks-current-6333.txt`. Bytes: 599. SHA-256: `32bccbc7593d4ca77d7321b80ee9eabff4dd6de83e23ffc1f000f11039557132`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6333"


 Test Files  3 passed (3)
      Tests  31 passed (31)
   Start at  14:33:21
   Duration  3.15s (transform 631ms, setup 561ms, import 1.34s, tests 2.42s, environment 2.28s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6333
```

## integration-hooks-current-6334

Original capture: `integration-hooks-current-6334.txt`. Bytes: 599. SHA-256: `3b0a294eba4ce5cfca9d153a9a37ff20c81b11bc085d9163d093c3171bf4e291`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6334"


 Test Files  3 passed (3)
      Tests  31 passed (31)
   Start at  14:33:25
   Duration  2.73s (transform 477ms, setup 451ms, import 951ms, tests 2.41s, environment 1.75s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6334
```

## integration-hooks-current-6335

Original capture: `integration-hooks-current-6335.txt`. Bytes: 599. SHA-256: `927fd3a0b75769187ae03c922a47dea83ce9fc3d62c873e737d9d37c799c11ce`.

```text

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6335"


 Test Files  3 passed (3)
      Tests  31 passed (31)
   Start at  14:33:29
   Duration  2.70s (transform 512ms, setup 545ms, import 923ms, tests 2.40s, environment 1.56s)

$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/use-public-work-metadata.test.tsx --sequence.shuffle --sequence.seed=6335
```

## integration-hooks-shuffle-6301

Original capture: `integration-hooks-shuffle-6301.txt`. Bytes: 464. SHA-256: `62bd52f2ff08eca9233f654b66c06071fadf8ea20076f5619f1a0f17b6d161da`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed 6301

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6301"


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  11:54:25
   Duration  3.17s (transform 152ms, setup 174ms, import 344ms, tests 1.55s, environment 864ms)

```

## integration-hooks-shuffle-6302

Original capture: `integration-hooks-shuffle-6302.txt`. Bytes: 464. SHA-256: `b5bb2e82d3b04f618cfb1ba10fc14351776f16210bcd15b25b0fc12a062693b6`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed 6302

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6302"


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  11:54:29
   Duration  4.15s (transform 152ms, setup 152ms, import 292ms, tests 1.55s, environment 1.83s)

```

## integration-hooks-shuffle-6303

Original capture: `integration-hooks-shuffle-6303.txt`. Bytes: 464. SHA-256: `ee6a43c9e23d2fd278e3ed1eec0cab108d5e90f06b8af22bf2747be5991e2a5d`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed 6303

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6303"


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  11:54:34
   Duration  2.73s (transform 145ms, setup 166ms, import 280ms, tests 1.54s, environment 518ms)

```

## integration-hooks-shuffle-6304

Original capture: `integration-hooks-shuffle-6304.txt`. Bytes: 464. SHA-256: `b12c14bc1994b912ad660ee6ef77e0deeeddf688221885ed6fc84eb26cf63c64`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed 6304

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6304"


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  11:54:37
   Duration  2.61s (transform 112ms, setup 131ms, import 220ms, tests 1.54s, environment 520ms)

```

## integration-hooks-shuffle-6305

Original capture: `integration-hooks-shuffle-6305.txt`. Bytes: 464. SHA-256: `6752debb67498ed857ff4939855b87c577685f007b21636390fe813ab5435ac9`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed 6305

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6305"


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  11:54:41
   Duration  2.62s (transform 131ms, setup 165ms, import 252ms, tests 1.54s, environment 532ms)

```

## integration-hooks-shuffle-6306

Original capture: `integration-hooks-shuffle-6306.txt`. Bytes: 464. SHA-256: `1df373e8dcf0f852497a8a4c6e5dd0668b0ac0d9817d99955aae8e6f4aede3c6`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed 6306

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6306"


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  12:21:35
   Duration  4.97s (transform 289ms, setup 356ms, import 606ms, tests 1.65s, environment 2.02s)

```

## integration-hooks-shuffle-6307

Original capture: `integration-hooks-shuffle-6307.txt`. Bytes: 464. SHA-256: `c1986f4d57fd7e5d91f11ad2033f037fcab2764e52d87289c0c7a44393df4ad7`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed 6307

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6307"


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  12:21:41
   Duration  4.49s (transform 588ms, setup 337ms, import 957ms, tests 1.85s, environment 1.19s)

```

## integration-hooks-shuffle-6308

Original capture: `integration-hooks-shuffle-6308.txt`. Bytes: 464. SHA-256: `b4c8600e43116ab79c382d1a37a4dfa26691080fa70ccf5e2f1b35efd28687a9`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed 6308

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6308"


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  12:21:48
   Duration  5.88s (transform 407ms, setup 334ms, import 842ms, tests 2.22s, environment 2.11s)

```

## integration-hooks-shuffle-6309

Original capture: `integration-hooks-shuffle-6309.txt`. Bytes: 464. SHA-256: `337f3096f7600ae663aa44c2433ef82c792e42210c02385f0b4a8d3a47a814e6`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed 6309

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6309"


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  12:21:56
   Duration  3.98s (transform 258ms, setup 272ms, import 493ms, tests 1.58s, environment 1.28s)

```

## integration-hooks-shuffle-6310

Original capture: `integration-hooks-shuffle-6310.txt`. Bytes: 464. SHA-256: `7604c1e51378f9f6cb2c064e06db33f739bb5593d0316cfaa8957750b4a57a49`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed 6310

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web
      Running tests with seed "6310"


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  12:22:03
   Duration  5.29s (transform 597ms, setup 513ms, import 1.11s, tests 1.75s, environment 1.69s)

```

## integration-p03-t106-build

Original capture: `integration-p03-t106-build.txt`. Bytes: 1622. SHA-256: `9526fbf1396d0eb144a54e03d09511dd13e09f4a5cff9b97e73ce488af4aa405`. Display line endings normalized; exact bytes are in the index.

```text
$ next build --webpack
▲ Next.js 16.2.12 (webpack)

  Creating an optimized production build ...
✓ Compiled successfully in 43s
  Running TypeScript ...
  Finished TypeScript in 62s ...
  Collecting page data using 9 workers ...
  Generating static pages using 9 workers (0/28) ...
  Generating static pages using 9 workers (7/28)
  Generating static pages using 9 workers (14/28)
  Generating static pages using 9 workers (21/28)
✓ Generating static pages using 9 workers (28/28) in 2.6s
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ○ /admin
├ ○ /admin/ads
├ ○ /admin/categories
├ ○ /admin/comments
├ ○ /admin/contact
├ ƒ /admin/contact/[messageId]
├ ○ /admin/dashboard
├ ○ /admin/gifts
├ ○ /admin/gifts/grants
├ ○ /admin/reports
├ ○ /admin/users
├ ƒ /admin/users/[userId]
├ ○ /admin/works
├ ƒ /admin/works/[workId]/chapters
├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
├ ƒ /admin/works/[workId]/chapters/new
├ ƒ /admin/works/[workId]/edit
├ ○ /admin/works/new
├ ○ /auth/forgot-password
├ ○ /auth/login
├ ○ /auth/register
├ ○ /auth/reset-password
├ ○ /auth/verify-email
├ ƒ /categories
├ ○ /contact
├ ○ /copyright
├ ○ /dashboard
├ ƒ /discover
├ ○ /library
├ ○ /privacy
├ ƒ /report-issue
├ ƒ /robots.txt
├ ○ /settings
├ ƒ /sitemap.xml
├ ƒ /stories
├ ƒ /story/[id]
├ ƒ /story/[id]/chapter/[chapterId]
└ ○ /terms


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

```

## integration-p03-t106-first-focused

Original capture: `integration-p03-t106-first-focused.txt`. Bytes: 26491. SHA-256: `c1ace390cbc992bffa1354acea2fd684cc3721100a22baf97a50fff5cc4087c5`.

```text
$ vitest run --config vitest.config.ts src/features/admin/model/admin-work-editor.test.ts src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx src/features/admin/hooks/admin-content.hooks.test.tsx

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web

 ❯ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests | 1 failed) 8202ms
     × reports same-state publication without claiming another event 210ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx > publication controls > reports same-state publication without claiming another event
TestingLibraryElementError: Unable to find an element with the text: الحالة المحفوظة: مسودة. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div[39m
      [33mclass[39m=[32m"_formLayout_35e0af"[39m
      [33mdir[39m=[32m"rtl"[39m
    [36m>[39m
      [36m<div[39m
        [33mclass[39m=[32m"_identityBanner_35e0af"[39m
      [36m>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_identityMeta_35e0af"[39m
        [36m>[39m
          [36m<span[39m
            [33mclass[39m=[32m"_identityId_35e0af"[39m
          [36m>[39m
            [0mالمعرّف: [0m
            [0m33333333-3333-4333-8333-333333333333[0m
          [36m</span>[39m
          [36m<span[39m
            [33mclass[39m=[32m"_identityId_35e0af"[39m
            [33mdir[39m=[32m"ltr"[39m
          [36m>[39m
            [0mالرابط الثابت: [0m
            [0msaved-work[0m
          [36m</span>[39m
          [36m<span[39m
            [33mclass[39m=[32m"_identityId_35e0af"[39m
          [36m>[39m
            [0mالنسخة: [0m
            [0m4[0m
          [36m</span>[39m
        [36m</div>[39m
        [36m<a[39m
          [33mclass[39m=[32m"_quickNavLink_35e0af"[39m
          [33mhref[39m=[32m"/admin/works/33333333-3333-4333-8333-333333333333/chapters"[39m
        [36m>[39m
          [0mإدارة الفصول[0m
        [36m</a>[39m
      [36m</div>[39m
      [36m<p[39m
        [33maria-live[39m=[32m"polite"[39m
        [33mclass[39m=[32m"_errorMessage_35e0af"[39m
        [33mrole[39m=[32m"alert"[39m
      [36m>[39m
        [0mالعمل في هذه الحالة بالفعل؛ لم يُنشأ حدث نشر جديد.[0m
      [36m</p>[39m
      [36m<p[39m
        [33maria-live[39m=[32m"polite"[39m
        [33mrole[39m=[32m"status"[39m
      [36m>[39m
        [0mالحالة المحفوظة:[0m
        [0m [0m
        [0mمؤرشف[0m
      [36m</p>[39m
      [36m<form[39m
        [33mnovalidate[39m=[32m""[39m
      [36m>[39m
        [36m<section[39m
          [33mclass[39m=[32m"_formCard_35e0af"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_sectionHeader_35e0af"[39m
          [36m>[39m
            [36m<h2[39m
              [33mclass[39m=[32m"_sectionTitle_35e0af"[39m
            [36m>[39m
              [0mبيانات المسودة[0m
            [36m</h2>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_fieldsGrid2_35e0af"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_field_35e0af"[39m
            [36m>[39m
              [36m<label[39m
                [33mclass[39m=[32m"_label_35e0af"[39m
                [33mfor[39m=[32m"work-title"[39m
              [36m>[39m
                [0mعنوان العمل[0m
                [36m<span[39m
                  [33mclass[39m=[32m"_requiredMark_35e0af"[39m
                [36m>[39m
                  [0m*[0m
                [36m</span>[39m
              [36m</label>[39m
              [36m<input[39m
                [33mautocomplete[39m=[32m"off"[39m
                [33mclass[39m=[32m"_input_35e0af"[39m
                [33mid[39m=[32m"work-title"[39m
                [33mname[39m=[32m"title"[39m
              [36m/>[39m
            [36m</div>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_field_35e0af"[39m
            [36m>[39m
              [36m<label[39m
                [33mclass[39m=[32m"_label_35e0af"[39m
                [33mfor[39m=[32m"work-alt-title"[39m
              [36m>[39m
                [0mالعنوان البديل[0m
              [36m</label>[39m
              [36m<input[39m
                [33mclass[39m=[32m"_input_35e0af"[39m
                [33mid[39m=[32m"work-alt-title"[39m
                [33mname[39m=[32m"alternativeTitle"[39m
              [36m/>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_fieldsGrid3_35e0af"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_field_35e0af"[39m
            [36m>[39m
              [36m<label[39m
                [33mclass[39m=[32m"_label_35e0af"[39m
                [33mfor[39m=[32m"work-slug"[39m
              [36m>[39m
                [0mالرابط المختصر[0m
              [36m</label>[39m
              [36m<input[39m
                [33mname[39m=[32m"slug"[39m
                [33mtype[39m=[32m"hidden"[39m
                [33mvalue[39m=[32m"saved-work"[39m
              [36m/>[39m
              [36m<input[39m
                [33mautocomplete[39m=[32m"off"[39m
                [33mclass[39m=[32m"_input_35e0af"[39m
                [33mdir[39m=[32m"ltr"[39m
                [33mdisabled[39m=[32m""[39m
                [33mid[39m=[32m"work-slug"[39m
                [33mvalue[39m=[32m"saved-work"[39m
              [36m/>[39m
            [36m</div>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_field_35e0af"[39m
            [36m>[39m
              [36m<label[39m
                [33mclass[39m=[32m"_label_35e0af"[39m
                [33mfor[39m=[32m"work-type"[39m
              [36m>[39m
                [0mنوع العمل[0m
              [36m</label>[39m
              [36m<input[39m
                [33mname[39m=[32m"type"[39m
                [33mtype[39m=[32m"hidden"[39m
                [33mvalue[39m=[32m"manga"[39m
              [36m/>[39m
              [36m<select[39m
                [33mclass[39m=[32m"_select_35e0af"[39m
                [33mdisabled[39m=[32m""[39m
                [33mid[39m=[32m"work-type"[39m
              [36m>[39m
                [36m<option[39m
                  [33mvalue[39m=[32m"manga"[39m
                [36m>[39m
                  [0mمانغا[0m
                [36m</option>[39m
                [36m<option[39m
                  [33mvalue[39m=[32m"manhwa"[39m
                [36m>[39m
                  [0mمانهوا[0m
                [36m</option>[39m
                [36m<option[39m
                  [33mvalue[39m=[32m"manhua"[39m
                [36m>[39m
                  [0mمانهوا صينية[0m
                [36m</option>[39m
                [36m<option[39m
                  [33mvalue[39m=[32m"comics"[39m
                [36m>[39m
                  [0mكوميكس[0m
                [36m</option>[39m
                [36m<option[39m
                  [33mvalue[39m=[32m"novel"[39m
                [36m>[39m
                  [0mرواية[0m
                [36m</option>[39m
                [36m<option[39m
                  [33mvalue[39m=[32m"text-story"[39m
                [36m>[39m
                  [0mقصة نصية[0m
                [36m</option>[39m
              [36m</select>[39m
            [36m</div>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_field_35e0af"[39m
            [36m>[39m
              [36m<label[39m
                [33mclass[39m=[32m"_label_35e0af"[39m
                [33mfor[39m=[32m"work-story-status"[39m
              [36m>[39m
                [0mحالة القصة[0m
              [36m</label>[39m
              [36m<select[39m
                [33mclass[39m=[32m"_select_35e0af"[39m
                [33mid[39m=[32m"work-story-status"[39m
                [33mname[39m=[32m"storyStatus"[39m
              [36m>[39m
                [36m<option[39m
                  [33mvalue[39m=[32m"ongoing"[39m
                [36m>[39m
                  [0mمستمرة[0m
                [36m</option>[39m
                [36m<option[39m
                  [33mvalue[39m=[32m"completed"[39m
                [36m>[39m
                  [0mمكتملة[0m
                [36m</option>[39m
                [36m<option[39m
                  [33mvalue[39m=[32m"hiatus"[39m
                [36m>[39m
                  [0mمتوقفة مؤقتًا[0m
                [36m</option>[39m
                [36m<option[39m
                  [33mvalue[39m=[32m"cancelled"[39m
                [36m>[39m
                  [0mملغاة[0m
                [36m</option>[39m
              [36m</select>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_fieldsGrid2_35e0af"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_field_35e0af"[39m
            [36m>[39m
              [36m<label[39m
                [33mclass[39m=[32m"_label_35e0af"[39m
                [33mfor[39m=[32m"work-author"[39m
              [36m>[39m
                [0mالمؤلف[0m
              [36m</label>[39m
              [36m<input[39m
                [33mclass[39m=[32m"_input_35e0af"[39m
                [33mid[39m=[32m"work-author"[39m
                [33mname[39m=[32m"author"[39m
              [36m/>[39m
            [36m</div>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_field_35e0af"[39m
            [36m>[39m
              [36m<label[39m
                [33mclass[39m=[32m"_label_35e0af"[39m
                [33mfor[39m=[32m"work-artist"[39m
              [36m>[39m
                [0mالرسام[0m
              [36m</label>[39m
              [36m<input[39m
                [33mclass[39m=[32m"_input_35e0af"[39m
                [33mid[39m=[32m"work-artist"[39m
                [33mname[39m=[32m"artist"[39m
              [36m/>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_field_35e0af"[39m
          [36m>[39m
            [36m<label[39m
              [33mclass[39m=[32m"_label_35e0af"[39m
              [33mfor[39m=[32m"work-synopsis"[39m
            [36m>[39m
              [0mنبذة العمل[0m
            [36m</label>[39m
            [36m<textarea[39m
              [33mclass[39m=[32m"_textarea_35e0af"[39m
              [33mid[39m=[32m"work-synopsis"[39m
              [33mname[39m=[32m"synopsis"[39m
            [36m/>[39m
            [36m<p[39m
              [33mclass[39m=[32m"_hint_35e0af"[39m
            [36m>[39m
              [0mيمكن حفظ المسودة دون نبذة مكتملة.[0m
            [36m</p>[39m
          [36m</div>[39m
          [36m<fieldset[39m
            [33mclass[39m=[32m"_field_35e0af"[39m
          [36m>[39m
            [36m<legend[39m
              [33mclass[39m=[32m"_label_35e0af"[39m
            [36m>[39m
              [0mالتصنيفات المحفوظة[0m
            [36m</legend>[39m
            [36m<label[39m
              [33mclass[39m=[32m"_label_35e0af"[39m
              [33mfor[39m=[32m"work-category-search"[39m
            [36m>[39m
              [0mابحث عن تصنيف مفعّل[0m
            [36m</label>[39m
            [36m<input[39m
              [33mclass[39m=[32m"_input_35e0af"[39m
              [33mid[39m=[32m"work-category-search"[39m
              [33mmaxlength[39m=[32m"100"[39m
              [33mvalue[39m=[32m""[39m
            [36m/>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_genresWrapper_35e0af"[39m
            [36m>[39m
              [36m<label[39m
                [33mclass[39m=[32m"_genreChip_35e0af"[39m
              [36m>[39m
                [36m<input[39m
                  [33maria-label[39m=[32m"أكشن"[39m
                  [33mchecked[39m=[32m""[39m
                  [33mtype[39m=[32m"checkbox"[39m
                [36m/>[39m
                [36m<span>[39m
                  [0mأكشن[0m
                [36m</span>[39m
              [36m</label>[39m
              [36m<label[39m
                [33mclass[39m=[32m"_genreChip_35e0af"[39m
              [36m>[39m
                [36m<input[39m
                  [33maria-label[39m=[32m"تصنيف قديم (معطل)"[39m
                  [33mchecked[39m=[32m""[39m
                  [33mtype[39m=[32m"checkbox"[39m
                [36m/>[39m
                [36m<span>[39m
                  [0mتصنيف قديم (معطل)[0m
                [36m</span>[39m
              [36m</label>[39m
            [36m</div>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_actionButtonsGroup_35e0af"[39m
            [36m>[39m
              [36m<button[39m
                [33mdisabled[39m=[32m""[39m
                [33mtype[39m=[32m"button"[39m
              [36m>[39m
                [0mالتصنيفات السابقة[0m
              [36m</button>[39m
              [36m<span[39m
                [33mrole[39m=[32m"status"[39m
              [36m>[39m
                [0mصفحة [0m
                [0m1[0m
                [0m من [0m
                [0m2[0m
              [36m</span>[39m
              [36m<button[39m
                [33mtype[39m=[32m"button"[39m
              [36m>[39m
                [0mالتصنيفات التالية[0m
              [36m</button>[39m
            [36m</div>[39m
            [36m<p[39m
              [33mclass[39m=[32m"_hint_35e0af"[39m
            [36m>[39m
              [0mالتصنيفات المعطلة المرتبطة مسبقًا محفوظة؛ يمكن إزالتها ولا يمكن إسنادها من جديد.[0m
            [36m</p>[39m
          [36m</fieldset>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_field_35e0af"[39m
          [36m>[39m
            [36m<label[39m
              [33mclass[39m=[32m"_label_35e0af"[39m
              [33mfor[39m=[32m"work-tags"[39m
            [36m>[39m
              [0mالوسوم (افصل بينها بفاصلة)[0m
            [36m</label>[39m
            [36m<input[39m
              [33mclass[39m=[32m"_input_35e0af"[39m
              [33mid[39m=[32m"work-tags"[39m
              [33mname[39m=[32m"tagsText"[39m
            [36m/>[39m
          [36m</div>[39m
          [36m<fieldset[39m
            [33mclass[39m=[32m"_field_35e0af"[39m
          [36m>[39m
            [36m<legend[39m
              [33mclass[39m=[32m"_label_35e0af"[39m
            [36m>[39m
              [0mتفضيل العرض المميز[0m
            [36m</legend>[39m
            [36m<label>[39m
              [36m<input[39m
                [33mname[39m=[32m"featuredHome"[39m
                [33mtype[39m=[32m"checkbox"[39m
              [36m/>[39m
              [0mإضافة إلى العرض المميز (تفضيل غير منشور)[0m
            [36m</label>[39m
          [36m</fieldset>[39m
        [36m</section>[39m
        [36m<section[39m
          [33mclass[39m=[32m"_formCard_35e0af"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_sectionHeader_35e0af"[39m
          [36m>[39m
            [36m<h2[39m
              [33mclass[39m=[32m"_sectionTitle_35e0af"[39m
            [36m>[39m
              [36m<svg[39m
                [33maria-hidden[39m=[32m"true"[39m
                [33mclass[39m=[32m"lucide lucide-image _sectionIcon_35e0af"[39m
                [33mfill[39m=[32m"none"[39m
                [33mheight[39m=[32m"24"[39m
                [33mstroke[39m=[32m"currentColor"[39m
                [33mstroke-linecap[39m=[32m"round"[39m
                [33mstroke-linejoin[39m=[32m"round"[39m
                [33mstroke-width[39m=[32m"2"[39m
                [33mviewBox[39m=[32m"0 0 24 24"[39m
                [33mwidth[39m=[32m"24"[39m
                [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
              [36m>[39m
                [36m<rect[39m
                  [33mheight[39m=[32m"18"[39m
                  [33mrx[39m=[32m"2"[39m
                  [33mry[39m=[32m"2"[39m
                  [33mwidth[39m=[32m"18"[39m
                  [33mx[39m=[32m"3"[39m
                  [33my[39m=[32m"3"[39m
                [36m/>[39m
                [36m<circle[39m
                  [33mcx[39m=[32m"9"[39m
                  [33mcy[39m=[32m"9"[39m
                  [33mr[39m=[32m"2"[39m
                [36m/>[39m
                [36m<path[39m
                  [33md[39m=[32m"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"[39m
                [36m/>[39m
              [36m</svg>[39m
              [0mالوسائط الخاصة بالمسودة[0m
            [36m</h2>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_mediaRow_35e0af"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_mediaCard_35e0af"[39m
            [36m>[39m
              [36m<span[39m
                [33mclass[39m=[32m"_label_35e0af"[39m
              [36m>[39m
                [0mغلاف العمل (3:4)[0m
              [36m</span>[39m
              [36m<div>[39m
                [36m<span>[39m
                  [0mرفع غلاف جديد[0m
                [36m</span>[39m
                [36m<output[39m
                  [33maria-label[39m=[32m"رفع غلاف جديد المرفق"[39m
                [36m>[39m
                  [0m44444444-4444-4444-8444-444444444444[0m
                [36m</output>[39m
                [36m<button[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [0mاختيار وسيط تجريبي لـ [0m
                  [0mرفع غلاف جديد[0m
                [36m</button>[39m
                [36m<button[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [0mإزالة الوسيط المرشح لـ [0m
                  [0mرفع غلاف جديد[0m
                [36m</button>[39m
              [36m</div>[39m
              [36m<p[39m
                [33mclass[39m=[32m"_hint_35e0af"[39m
              [36m>[39m
                [0mالغلاف مرتبط بالعمل المحفوظ؛ لم يتغير الربط بعد.[0m
              [36m</p>[39m
              [36m<button[39m
                [33mclass[39m=[32m"_mediaBtn_35e0af"[39m
                [33mtype[39m=[32m"button"[39m
              [36m>[39m
                [0mإزالة الغلاف عند الحفظ[0m
              [36m</button>[39m
            [36m</div>[39m
            [36m<div[39m
              [33mclass[39m=[32m"_mediaCard_35e0af"[39m
            [36m>[39m
              [36m<span[39m
                [33mclass[39m=[32m"_label_35e0af"[39m
              [36m>[39m
                [0mخلفية العمل (16:9)[0m
              [36m</span>[39m
              [36m<div>[39m
                [36m<span>[39m
                  [0mرفع خلفية جديدة[0m
                [36m</span>[39m
                [36m<output[39m
                  [33maria-label[39m=[32m"رفع خلفية جديدة المرفق"[39m
                [36m>[39m
                  [0mلا يوجد وسيط مرتبط[0m
                [36m</output>[39m
                [36m<button[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [0mاختيار وسيط تجريبي لـ [0m
                  [0mرفع خلفية جديدة[0m
                [36m</button>[39m
                [36m<button[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [0mإزالة الوسيط المرشح لـ [0m
                  [0mرفع خلفية جديدة[0m
                [36m</button>[39m
              [36m</div>[39m
              [36m<p[39m
                [33mclass[39m=[32m"_hint_35e0af"[39m
              [36m>[39m
                [0mلا توجد خلفية مرتبطة بالمسودة.[0m
              [36m</p>[39m
            [36m</div>[39m
          [36m</div>[39m
        [36m</section>[39m
        [36m<section[39m
          [33maria-label[39m=[32m"معاينة البيانات المحفوظة"[39m
          [33mclass[39m=[32m"_formCard_35e0af"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_sectionHeader_35e0af"[39m
          [36m>[39m
            [36m<h2[39m
              [33mclass[39m=[32m"_sectionTitle_35e0af"[39m
            [36m>[39m
              [36m<svg[39m
                [33maria-hidden[39m=[32m"true"[39m
                [33mclass[39m=[32m"lucide lucide-globe _sectionIcon_35e0af"[39m
                [33mfill[39m=[32m"none"[39m
                [33mheight[39m=[32m"24"[39m
                [33mstroke[39m=[32m"currentColor"[39m
                [33mstroke-linecap[39m=[32m"round"[39m
                [33mstroke-linejoin[39m=[32m"round"[39m
                [33mstroke-width[39m=[32m"2"[39m
                [33mviewBox[39m=[32m"0 0 24 24"[39m
                [33mwidth[39m=[32m"24"[39m
                [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
              [36m>[39m
                [36m<circle[39m
                  [33mcx[39m=[32m"12"[39m
                  [33mcy[39m=[32m"12"[39m
                  [33mr[39m=[32m"10"[39m
                [36m/>[39m
                [36m<path[39m
                  [33md[39m=[32m"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"[39m
                [36m/>[39m
                [36m<path[39m
                  [33md[39m=[32m"M2 12h20"[39m
                [36m/>[39m
              [36m</svg>[39m
              [0mمعاينة البيانات المحفوظة[0m
            [36m</h2>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_seoPreviewCard_35e0af"[39m
          [36m>[39m
            [36m<span[39m
              [33mclass[39m=[32m"_seoUrl_35e0af"[39m
              [33mdir[39m=[32m"ltr"[39m
            [36m>[39m
              [0msaved-work[0m
            [36m</span>[39m
            [36m<h3[39m
              [33mclass[39m=[32m"_seoTitle_35e0af"[39m
            [36m>[39m
              [0mعمل محفوظ[0m
            [36m</h3>[39m
            [36m<p[39m
              [33mclass[39m=[32m"_seoDescription_35e0af"[39m
            [36m>[39m
              [0mهذه نبذة محفوظة تتجاوز الحد الأدنى للطول المطلوب.[0m
            [36m</p>[39m
          [36m</div>[39m
        [36m</section>[39m
        [36m<div[39m
          [33mclass[39m=[32m"_actionsBar_35e0af"[39m
        [36m>[39m
          [36m<button[39m
            [33mclass[39m=[32m"_cancelBtn_35e0af"[39m
            [33mtype[39m=[32m"button"[39m
          [36m>[39m
            [0mإلغاء والعودة[0m
          [36m</button>[39m
          [36m<div[39m
            [33mclass[39m=[32m"_actionButtonsGroup_35e0af"[39m
          [36m>[39m
            [36m<button[39m
              [33mclass[39m=[32m"_saveDraftBtn_35e0af"[39m
              [33mtype[39m=[32m"submit"[39m
            [36m>[39m
              [0mحفظ التعديلات[0m
            [36m</button>[39m
            [36m<button[39m
              [33mtype[39m=[32m"button"[39m
            [36m>[39m
              [0mاستعادة كمسودة[0m
            [36m</button>[39m
          [36m</div>[39m
        [36m</div>[39m
      [36m</form>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx:412:19
    410|       ),
    411|     ).toBeInTheDocument();
    412|     expect(screen.getByText("الحالة المحفوظة: مسودة")).toBeInTheDocume…
       |                   ^
    413|   });
    414|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 2 passed (3)
      Tests  1 failed | 72 passed (73)
   Start at  14:48:33
   Duration  14.50s (transform 1.92s, setup 2.35s, import 2.94s, tests 9.55s, environment 6.92s)

/Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 test: `vitest run --config vitest.config.ts src/features/admin/model/admin-work-editor.test.ts src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx src/features/admin/hooks/admin-content.hooks.test.tsx`
Exit status 1
```

## integration-p03-t106-focused

Original capture: `integration-p03-t106-focused.txt`. Bytes: 496. SHA-256: `dc583a5968b71305e47a7bc9cd6d7b2bdda6eab1b5c3fd208e3862d35f604b69`.

```text
$ vitest run --config vitest.config.ts src/features/admin/model/admin-work-editor.test.ts src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx src/features/admin/hooks/admin-content.hooks.test.tsx

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web


 Test Files  3 passed (3)
      Tests  73 passed (73)
   Start at  14:55:06
   Duration  14.39s (transform 3.52s, setup 3.38s, import 5.52s, tests 8.42s, environment 9.20s)

```

## integration-p03-t106-lint

Original capture: `integration-p03-t106-lint.txt`. Bytes: 0. SHA-256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

```text

```

## integration-p03-unknown-edit-diagnostic

Original capture: `integration-p03-unknown-edit-diagnostic.txt`. Bytes: 403. SHA-256: `e272476a99a281d31db2429bd146800fc236720d41645e93d24bc05c0a40e607`.

```text
$ vitest run --config vitest.config.ts src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx -t 'checks an unknown edit acknowledgement before allowing another save'

 RUN  v4.1.10 <repository>/apps/web


 Test Files  1 passed (1)
      Tests  1 passed | 32 skipped (33)
   Start at  15:01:42
   Duration  1.97s (transform 312ms, setup 165ms, import 567ms, tests 238ms, environment 845ms)

```

## integration-post-t083-build

Original capture: `integration-post-t083-build.txt`. Bytes: 1623. SHA-256: `25b5b50b19fd5164da2128a8a4e9b01990004f854db4e86e88a4cd27ba8e5743`.

```text
$ next build --webpack
▲ Next.js 16.2.12 (webpack)

  Creating an optimized production build ...
✓ Compiled successfully in 5.6s
  Running TypeScript ...
  Finished TypeScript in 10.0s ...
  Collecting page data using 9 workers ...
  Generating static pages using 9 workers (0/28) ...
  Generating static pages using 9 workers (7/28)
  Generating static pages using 9 workers (14/28)
  Generating static pages using 9 workers (21/28)
✓ Generating static pages using 9 workers (28/28) in 871ms
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ○ /admin
├ ○ /admin/ads
├ ○ /admin/categories
├ ○ /admin/comments
├ ○ /admin/contact
├ ƒ /admin/contact/[messageId]
├ ○ /admin/dashboard
├ ○ /admin/gifts
├ ○ /admin/gifts/grants
├ ○ /admin/reports
├ ○ /admin/users
├ ƒ /admin/users/[userId]
├ ○ /admin/works
├ ƒ /admin/works/[workId]/chapters
├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
├ ƒ /admin/works/[workId]/chapters/new
├ ƒ /admin/works/[workId]/edit
├ ○ /admin/works/new
├ ○ /auth/forgot-password
├ ○ /auth/login
├ ○ /auth/register
├ ○ /auth/reset-password
├ ○ /auth/verify-email
├ ƒ /categories
├ ○ /contact
├ ○ /copyright
├ ○ /dashboard
├ ƒ /discover
├ ○ /library
├ ○ /privacy
├ ƒ /report-issue
├ ƒ /robots.txt
├ ○ /settings
├ ƒ /sitemap.xml
├ ƒ /stories
├ ƒ /story/[id]
├ ƒ /story/[id]/chapter/[chapterId]
└ ○ /terms


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

```

## integration-post-t083-initial-format-failure

Original capture: `integration-post-t083-initial-format-failure.txt`. Bytes: 1755. SHA-256: `3d2abc2fdb5776697f0125fc70a9add63af433aed2670b4c244de83803632b91`.

```text
$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-p03-t106-no-reload.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-auto-recovery.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-bounded-failure.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-explicit-retry.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-final-auto.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-final-bounded.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-final-reachable-retry.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-final-state-diagnostic.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-query-diagnostic.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-reproduced.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-snapshot-verified-negative.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-snapshot-verified-withdrawal.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-withdrawal-diagnostic.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-t083-withdrawal-state.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-production-imports.json
[warn] Code style issues found in 15 files. Run Prettier with --write to fix.
[ELIFECYCLE] Command failed with exit code 1.
```

## integration-post-t083-lint

Original capture: `integration-post-t083-lint.txt`. Bytes: 0. SHA-256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

```text

```

## integration-post-t083-shuffled-hooks

Original capture: `integration-post-t083-shuffled-hooks.txt`. Bytes: 1389. SHA-256: `5482d6bc7b80c2d2af7c8942defb511b3a6a08ad444efe6ac6fec721121aa350`.

```text
{"runs": [{"seed": 6331, "exitCode": 0, "testCount": 31, "freshProcess": true}, {"seed": 6332, "exitCode": 0, "testCount": 31, "freshProcess": true}, {"seed": 6333, "exitCode": 0, "testCount": 31, "freshProcess": true}, {"seed": 6334, "exitCode": 0, "testCount": 31, "freshProcess": true}, {"seed": 6335, "exitCode": 0, "testCount": 31, "freshProcess": true}], "sha256": {"apps/web/src/features/public-catalog/hooks/public-catalog.access.ts": "0ecbc56ac642c7103c6b3f461fa6747bf8b41a26996bc369558ca226c71e5246", "apps/web/src/features/public-catalog/hooks/public-catalog.hooks.ts": "6d05f6eecd62a02ed6a3fb30b15a4cd1a903065618458b027554f929a2cae74b", "apps/web/src/features/public-catalog/hooks/public-catalog.hooks.test.tsx": "9d4c498f625d3ece02ed6be1df8b438512140988f274963481881f8fa678846e", "apps/web/src/features/public-catalog/hooks/use-public-work-metadata.ts": "1d7c6f5b02ebf40c99862fd82c2c07316edbbdaba5a77b0d2bec8c29e7fe0273", "apps/web/src/features/public-catalog/hooks/use-public-work-metadata.test.tsx": "9b6e732dd1160c9c7555d94c023ab5e6eff6cc02c7d9927f09a762d98b91d7ca", "apps/web/src/features/public-catalog/components/PublicWorkNotFound.tsx": "879958e6b02740e632ca3762fd0672aeb1dad64c548678910a5b1d6a8ac5aac6", "apps/web/src/features/public-catalog/components/PublicWorkNotFound.test.tsx": "8ab6a17146692ac142952e0b26066b47d3b07d9ae73ecf0614842858b02b8083"}, "passed": true}
```

## integration-post-t083-t106-first-timeout

Original capture: `integration-post-t083-t106-first-timeout.txt`. Bytes: 32415. SHA-256: `d1da04f20bf90dd53cc01f9b40c9ff3a77a907de18c119c24fe351b6fe57501a`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 30ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 96ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache hit, replaying logs 36f54ee3d5c49be4
@fury/contracts:lint: $ eslint .
@fury/web:lint: cache miss, executing baa681e5e0c9ced6
@fury/database:lint: cache hit, replaying logs 6e7cacdb6171e51b
@fury/database:lint: $ eslint .
@fury/api:lint: cache hit, replaying logs 381be4e74d0d4470
@fury/api:lint: $ eslint .
@fury/web:lint: $ eslint .
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
@fury/web:lint:   95:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
@fury/web:lint:
@fury/web:lint: ✖ 1 problem (0 errors, 1 warning)
@fury/web:lint:

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    1m44.999s

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache hit, replaying logs 90a343f8bbc72426
@fury/contracts:check-types: $ tsc --noEmit
@fury/web:check-types: cache miss, executing 1a233fab61f00015
@fury/database:check-types: cache hit, replaying logs 6f4d6f61db15b1f7
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 93ms
@fury/database:check-types:
@fury/api:check-types: cache hit, replaying logs 023696dea2e4ec62
@fury/api:check-types: $ tsc --noEmit
@fury/web:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    17.007s

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs e4f4ed9387203e98
@fury/contracts:test: cache hit, replaying logs 36bc416e062052e2
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 <repository>/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 5ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 8ms
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 6ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 13ms
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 42ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  12:46:45
@fury/contracts:test:    Duration  311ms (transform 275ms, setup 0ms, import 608ms, tests 73ms, environment 0ms)
@fury/contracts:test:
@fury/web:test: cache miss, executing 06bd5d1ed18f3dbc
@fury/database:test: cache hit, replaying logs 6348e8d0dd17fcb7
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/database:test:  RUN  v4.1.10 <repository>/packages/database
@fury/database:test:
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 4ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 188ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  12:46:47
@fury/database:test:    Duration  648ms (transform 217ms, setup 0ms, import 376ms, tests 192ms, environment 0ms)
@fury/database:test:
@fury/database:build: cache hit, replaying logs 51fbe2c37013493b
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 177ms
@fury/database:build:
@fury/api:test: cache hit, replaying logs 6d1b957fccf660d4
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 <repository>/apps/api
@fury/api:test:
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 67ms
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 84ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 12ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 13ms
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 14ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 31ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 12ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 341ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 21ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 42ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (19 tests) 7ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 33ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 9ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 10ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 15ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 7ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 6ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 3ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 8ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 5ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 6ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (16 tests) 1476ms
@fury/api:test:
@fury/api:test:  Test Files  26 passed (26)
@fury/api:test:       Tests  154 passed (154)
@fury/api:test:    Start at  12:46:52
@fury/api:test:    Duration  2.27s (transform 3.09s, setup 428ms, import 7.43s, tests 2.24s, environment 2ms)
@fury/api:test:
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/web:test:
@fury/web:test:  RUN  v4.1.10 <repository>/apps/web
@fury/web:test:
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 2096ms
@fury/web:test:      ✓ distinguishes completed transfer from server processing  434ms
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 2618ms
@fury/web:test:      ✓ makes denial terminal and prevents late reads from restoring cached data  342ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (17 tests) 3978ms
@fury/web:test:      ✓ cancels an old URL read and cannot present its late response as the new selection  593ms
@fury/web:test:      ✓ keeps 503 failure distinct from confirmed empty and permits explicit retry  386ms
@fury/web:test:      ✓ aborts a stale directory search while preserving the current URL selection  323ms
@fury/web:test:      ✓ does not treat an unvalidated HTML 404 as confirmed Work absence  337ms
@fury/web:test:      ✓ requires a later matching Work GET and recovers a list without manual detail navigation  443ms
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 7826ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  2317ms
@fury/web:test:      ✓ filters users by text search  953ms
@fury/web:test:      ✓ filters users by status  431ms
@fury/web:test:      ✓ filters users by role  808ms
@fury/web:test:      ✓ prevents suspending admin accounts  1140ms
@fury/web:test:      ✓ opens suspend dialog for regular user, confirms suspension and updates status  1409ms
@fury/web:test:      ✓ reactivates a suspended user directly  762ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicCatalogListing.test.tsx (5 tests) 6373ms
@fury/web:test:      ✓ distinguishes pending, failure and retry from an empty catalog  3291ms
@fury/web:test:      ✓ returns keyboard focus to the error feedback when an explicit retry also fails  813ms
@fury/web:test:      ✓ uses server totals/page boundaries without local slicing or fabricated chapters  1424ms
@fury/web:test:      ✓ distinguishes page=9&category=saved  559ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 11242ms
@fury/web:test:      ✓ renders gifts catalog header, stat cards, and gift cards  1833ms
@fury/web:test:      ✓ filters gifts by search query  1107ms
@fury/web:test:      ✓ filters gifts by type  980ms
@fury/web:test:      ✓ opens create gift dialog and creates a new gift design  4469ms
@fury/web:test:      ✓ toggles active status of a gift  1367ms
@fury/web:test:      ✓ opens gift preview modal  1456ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 13340ms
@fury/web:test:      ✓ loads persisted categories, searches on the server, and shows filtered empty state  3227ms
@fury/web:test:      ✓ reloads categories from a fresh QueryClient and the current server state  619ms
@fury/web:test:      ✓ distinguishes an empty collection and retries a failed create without losing its draft  1535ms
@fury/web:test:      ✓ drops an old ADMIN draft on an account switch within the mounted route  1356ms
@fury/web:test:      ✓ keeps the next ADMIN dialog open after the previous actor's late save  1079ms
@fury/web:test:      ✓ blocks a third Category POST after an uncertain 404, retry 409, and second 404  1800ms
@fury/web:test:      ✓ locks rapid Category submits before the pending indicator renders  739ms
@fury/web:test:      ✓ keeps slug immutable, focuses invalid fields, and retains draft on validation failure  449ms
@fury/web:test:      ✓ refreshes stale detail before retry while preserving the edited draft  506ms
@fury/web:test:      ✓ changes pages through the server query and supports Escape focus return  1734ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 16132ms
@fury/web:test:      ✓ adopts a newer confirmed Chapter when the editor is pristine  2054ms
@fury/web:test:      ✓ holds a dirty draft for comparison when a newer server revision arrives  1790ms
@fury/web:test:      ✓ replaces transient draft state when the actor or Chapter changes  1039ms
@fury/web:test:      ✓ maps safe page validation without displaying private server text  555ms
@fury/web:test:      ✓ retains the edited draft and asks for readback after service uncertainty  1052ms
@fury/web:test:      ✓ returns focus to the private-preview trigger after Escape  672ms
@fury/web:test:      ✓ confirms publication of the saved revision and blocks an unsaved draft  701ms
@fury/web:test:      ✓ retains the publication dialog and draft state while confirmation is unresolved  1776ms
@fury/web:test:      ✓ reports a failed publication without claiming the Chapter changed  838ms
@fury/web:test:      ✓ starts empty and saves two accepted candidate assets in order  376ms
@fury/web:test:      ✓ shows current unsaved order in private preview and preserves edits after failure  637ms
@fury/web:test:      ✓ reloads a stale saved revision for comparison without discarding the draft  353ms
@fury/web:test:      ✓ builds the complete supported document through the text controls  1820ms
@fury/web:test:      ✓ keeps an edited structured draft beside the saved preview after failed save  1475ms
@fury/web:test:      ✓ keeps an unsafe link in the draft for correction without sending it  650ms
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 4570ms
@fury/web:test:      ✓ renders comments metrics, filter controls, and comment rows  813ms
@fury/web:test:      ✓ filters comments by search query matching content or author  865ms
@fury/web:test:      ✓ filters comments by reported status  552ms
@fury/web:test:      ✓ opens quick hide modal, provides reason, and confirms hiding  1233ms
@fury/web:test:      ✓ opens comment details modal and allows viewing and closing  945ms
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 5554ms
@fury/web:test:      ✓ filters saved works by type and title without losing the library  2260ms
@fury/web:test:      ✓ marks archived work unavailable and disables its reading action  1024ms
@fury/web:test:      ✓ removes a bookmark locally and restores it through undo  1003ms
@fury/web:test:      ✓ filters by status and clears search input via clear button  666ms
@fury/web:test:      ✓ toggles view mode between grid and list  542ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (5 tests) 2971ms
@fury/web:test:      ✓ shows saved manga fields without invented optional values, engagement or reader links  1247ms
@fury/web:test:      ✓ uses full-set latest beyond the first bounded page and recovers image failure  728ms
@fury/web:test:      ✓ normalizes chapter whitespace and never reuses chapter one for invalid search  533ms
@fury/web:test:  ✓ src/features/home/components/public-home.test.tsx (6 tests) 2435ms
@fury/web:test:      ✓ uses saved featured order and category shortcuts without an active reader or scores  2068ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 1679ms
@fury/web:test:      ✓ renders reports metrics, controls, and report rows  658ms
@fury/web:test:      ✓ opens details modal, allows starting review, and closing  449ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 2051ms
@fury/web:test:      ✓ shows the collection empty message before any filters  607ms
@fury/web:test:      ✓ shows saved IDs and an honest filtered empty state  963ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/use-public-work-metadata.test.tsx (9 tests) 698ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 609ms
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 833ms
@fury/web:test:      ✓ announces an accepted RTL candidate without claiming parent persistence  500ms
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 754ms
@fury/web:test:      ✓ selects one avatar frame or no frame and keeps revoked gifts unavailable  565ms
@fury/web:test:  ❯ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests | 1 failed) 20467ms
@fury/web:test:      × checks an unknown edit acknowledgement before allowing another save 5359ms
@fury/web:test:      ✓ keeps a failed combined create-and-publish draft and reports readiness  813ms
@fury/web:test:      ✓ archives a clean published work with its current version  1102ms
@fury/web:test:      ✓ reports the server state after an ambiguous unpublish instead of claiming success  2487ms
@fury/web:test:      ✓ reports same-state publication without claiming another event  450ms
@fury/web:test:      ✓ archives a clean draft after unpublishing 233ms
@fury/web:test:      ✓ remounts the protected create page for another ADMIN and ignores the first actor's late save  640ms
@fury/web:test:      ✓ does not offer another actor an unknown create readback or retain its UUID 262ms
@fury/web:test:      ✓ ignores an in-flight create readback after the actor changes  495ms
@fury/web:test:      ✓ remounts the same Work edit route for another ADMIN and ignores the old acknowledgement  1167ms
@fury/web:test:      ✓ creates either canonical type with saved categories and no title-derived slug  883ms
@fury/web:test:      ✓ creates a manga draft without silently changing its canonical type  306ms
@fury/web:test:      ✓ loads saved fields, retains disabled categories and shows attached private asset identity  523ms
@fury/web:test:      ✓ pages and searches enabled categories beyond 100 while keeping an attached disabled choice  646ms
@fury/web:test:      ✓ keeps the private saved preview authoritative while editing and labels unsaved input  337ms
@fury/web:test:      ✓ keeps a local title dirty through a same-version detail refresh  355ms
@fury/web:test:      ✓ shows Arabic title feedback and retains input without sending an invalid edit  355ms
@fury/web:test:      ✓ preserves dirty fields on refresh and requires an explicit adopt or continue choice  457ms
@fury/web:test:      ✓ continues a dirty draft against the refreshed expected version  575ms
@fury/web:test:      ✓ submits a staged candidate without confusing it with the attached reference 195ms
@fury/web:test:      ✓ omits an unchanged attached reference from PATCH 141ms
@fury/web:test:      ✓ sends an explicit null only when removing an attached cover 165ms
@fury/web:test:      ✓ does not navigate on an ambiguous create whose UUID readback has only the same slug 192ms
@fury/web:test:      ✓ keeps local input after a 404 then explicit same-ID POST 409 without claiming success 250ms
@fury/web:test:      ✓ keeps the original UUID and blocks a third POST after 404, 409, and another 404  385ms
@fury/web:test:      ✓ preserves a post-submit edit until server adoption, then accepts a later refresh  328ms
@fury/web:test:      ✓ does not erase newer draft input when an ambiguous create readback matches the submitted version 294ms
@fury/web:test:      ✓ retains an edited draft and attached cover after a rejected save 204ms
@fury/web:test:      ✓ keeps newer typing and media after a delayed edit acknowledgement 247ms
@fury/web:test:      ✓ does not navigate when a create acknowledgement arrives after additional typing 176ms
@fury/web:test:      ✓ ignores a delayed edit acknowledgement after route identity or access changes 151ms
@fury/web:test:      ✓ guards rapid duplicate submissions and validation races in the actual handler 70ms
@fury/web:test:      ✓ preserves dirty input after a create failure and focuses the first invalid field 145ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 1476ms
@fury/web:test:      ✓ shows loading without fixture rows or a false empty state  544ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 713ms
@fury/web:test:      ✓ navigates to the previous and next fixture chapters in reading order  326ms
@fury/web:test:  ✓ src/features/story/routing.test.tsx (5 tests) 616ms
@fury/web:test:      ✓ keeps persisted work chapters informational and category links canonical  357ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 792ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (2 tests) 937ms
@fury/web:test:      ✓ restricts type choices to text and preserves saved/unknown category and search  722ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 567ms
@fury/web:test:      ✓ shows field-level contact validation then states the request was not delivered  426ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 795ms
@fury/web:test:      ✓ uploads a supported image and labels the result as a private candidate  386ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 1202ms
@fury/web:test:      ✓ renders the FURY brand and navigation groups with correct active state  797ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 939ms
@fury/web:test:      ✓ confirms the global advertisement toggle  344ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 1058ms
@fury/web:test:      ✓ renders contact inbox metrics, filter controls, and messages table  471ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 820ms
@fury/web:test:      ✓ renders heading structure, approval notice, takedown checklist, and submission link  818ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 789ms
@fury/web:test:      ✓ renders heading structure, legal draft approval note, and sections  786ms
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 881ms
@fury/web:test:      ✓ renders the real session identity with fixture product summaries and valid links  714ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 934ms
@fury/web:test:      ✓ offers flat comment actions without reply controls  411ms
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 862ms
@fury/web:test:      ✓ renders message details, sender info, and action panels  722ms
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 701ms
@fury/web:test:      ✓ renders owned gifts and allows revoking an owned gift  324ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 551ms
@fury/web:test:      ✓ opens notification dropdown, displays notifications, and allows marking all read  384ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 707ms
@fury/web:test:      ✓ searches all works through discover and hides notifications from visitors  339ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 294ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 366ms
@fury/web:test:      ✓ renders a complete heading structure, approval boundary, and internal section links  364ms
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 368ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (4 tests) 205ms
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 487ms
@fury/web:test:      ✓ labels the four remaining summary cards as demo data  420ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 219ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicWorkImage.test.tsx (5 tests) 323ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 205ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 191ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 279ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicCatalogState.test.tsx (6 tests) 243ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicWorkNotFound.test.tsx (5 tests) 365ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 24ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 353ms
@fury/web:test:      ✓ updates the display name through the existing account mutation without exposing phone editing  352ms
@fury/web:test:  ✓ src/components/ui/MangaCard/MangaCard.test.tsx (1 test) 414ms
@fury/web:test:      ✓ uses the immutable slug, actual title/cover/type and no engagement or fixture reader  413ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 281ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 349ms
@fury/web:test:      ✓ traps focus, closes on Escape, and restores the opener  348ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 364ms
@fury/web:test:      ✓ exposes keyboard-native deep links and keeps account security controls mounted  344ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 255ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 341ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 178ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 77ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 36ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 121ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 97ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 123ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 172ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 33ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 140ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (11 tests) 14ms
@fury/web:test:  ✓ src/app/seo.test.ts (4 tests) 32ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 18ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 113ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (10 tests) 17ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 13ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 51ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 5ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (2 tests) 10ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 5ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 5ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 8ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 44ms
@fury/web:test:
@fury/web:test: ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
@fury/web:test:
@fury/web:test:  FAIL  src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx > publication controls > checks an unknown edit acknowledgement before allowing another save
@fury/web:test: Error: Test timed out in 5000ms.
@fury/web:test: If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
@fury/web:test:  ❯ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx:277:3
@fury/web:test:     275|
@fury/web:test:     276| describe("publication controls", () => {
@fury/web:test:     277|   it("checks an unknown edit acknowledgement before allowing another s…
@fury/web:test:        |   ^
@fury/web:test:     278|     mocks.update.mockRejectedValueOnce(
@fury/web:test:     279|       new SafeAdminContentError("NETWORK_ERROR", 0, ""),
@fury/web:test:
@fury/web:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
@fury/web:test:
@fury/web:test:
@fury/web:test:  Test Files  1 failed | 79 passed (80)
@fury/web:test:       Tests  1 failed | 515 passed (516)
@fury/web:test:    Start at  15:00:14
@fury/web:test:    Duration  51.05s (transform 29.83s, setup 41.68s, import 78.23s, tests 128.81s, environment 164.57s)
@fury/web:test:
@fury/web:test: [ELIFECYCLE] Test failed. See above for more details.
@fury/web#test:  ERROR  command (<repository>/apps/web) <user-home>/.local/bin/pnpm run test exited (1)

 Tasks:    5 successful, 6 total
Cached:    5 cached, 6 total
  Time:    54.553s
Failed:    @fury/web#test

 ERROR  run failed: command  exited (1)
[ELIFECYCLE] Test failed. See above for more details.
[ELIFECYCLE] Command failed with exit code 1.
```

## integration-post-t083-t106-routes

Original capture: `integration-post-t083-t106-routes.txt`. Bytes: 1042. SHA-256: `78c675ad4c53b07188a0949b669d42782d8b53973e0bb355ec3f140ba3154635`.

```text
$ node scripts/check-web-routes.mjs http://127.0.0.1:4316 saved-manga-0
PASS /dashboard
PASS /library
PASS /settings
PASS /admin/ads
PASS /admin/categories
PASS /admin/comments
PASS /admin/contact/msg-1
PASS /admin/contact
PASS /admin/dashboard
PASS /admin/gifts/grants
PASS /admin/gifts
PASS /admin
PASS /admin/reports
PASS /admin/users/user-1
PASS /admin/users
PASS /admin/works/trait-hoarder/chapters/th-43/edit
PASS /admin/works/trait-hoarder/chapters/new
PASS /admin/works/trait-hoarder/chapters
PASS /admin/works/trait-hoarder/edit
PASS /admin/works/new
PASS /admin/works
PASS /auth/forgot-password
PASS /auth/login
PASS /auth/register
PASS /auth/reset-password
PASS /auth/verify-email
PASS /categories
PASS /contact
PASS /copyright
PASS /discover
PASS /
PASS /privacy
PASS /report-issue
PASS /stories
PASS /story/saved-manga-0/chapter/1
PASS /story/saved-manga-0
PASS /terms
PASS /story/trait-hoarder/chapter/43
PASS /story/1/chapter/1
PASS /story/1/chapter/2
Verified 40 existing routes and the 404 fallback at http://127.0.0.1:4316.
```

## integration-post-t083-t106-verification

Original capture: `integration-post-t083-t106-verification.txt`. Bytes: 30411. SHA-256: `3540031b83e64ce206a3f1f86e6f9310146c51af9f254942a8a6f19cc61a45a5`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 31ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 95ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache hit, replaying logs 36f54ee3d5c49be4
@fury/contracts:lint: $ eslint .
@fury/database:lint: cache hit, replaying logs 6e7cacdb6171e51b
@fury/web:lint: cache hit, replaying logs baa681e5e0c9ced6
@fury/database:lint: $ eslint .
@fury/web:lint: $ eslint .
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
@fury/web:lint:   95:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
@fury/web:lint:
@fury/web:lint: ✖ 1 problem (0 errors, 1 warning)
@fury/web:lint:
@fury/api:lint: cache hit, replaying logs 381be4e74d0d4470
@fury/api:lint: $ eslint .

 Tasks:    4 successful, 4 total
Cached:    4 cached, 4 total
  Time:    32ms >>> FULL TURBO

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache hit, replaying logs 90a343f8bbc72426
@fury/contracts:check-types: $ tsc --noEmit
@fury/database:check-types: cache hit, replaying logs 6f4d6f61db15b1f7
@fury/web:check-types: cache hit, replaying logs 1a233fab61f00015
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 93ms
@fury/database:check-types:
@fury/web:check-types: $ tsc --noEmit
@fury/api:check-types: cache hit, replaying logs 023696dea2e4ec62
@fury/api:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    4 cached, 4 total
  Time:    33ms >>> FULL TURBO

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:test: cache hit, replaying logs 36bc416e062052e2
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 <repository>/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 5ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 8ms
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 6ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 13ms
@fury/contracts:build: cache hit, replaying logs e4f4ed9387203e98
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 42ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  12:46:45
@fury/contracts:test:    Duration  311ms (transform 275ms, setup 0ms, import 608ms, tests 73ms, environment 0ms)
@fury/contracts:test:
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:test: cache miss, executing 06bd5d1ed18f3dbc
@fury/database:test: cache hit, replaying logs 6348e8d0dd17fcb7
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/database:test:  RUN  v4.1.10 <repository>/packages/database
@fury/database:test:
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 4ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 188ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  12:46:47
@fury/database:test:    Duration  648ms (transform 217ms, setup 0ms, import 376ms, tests 192ms, environment 0ms)
@fury/database:test:
@fury/database:build: cache hit, replaying logs 51fbe2c37013493b
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 177ms
@fury/database:build:
@fury/api:test: cache hit, replaying logs 6d1b957fccf660d4
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 <repository>/apps/api
@fury/api:test:
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 67ms
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 84ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 12ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 13ms
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 14ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 31ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 12ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 341ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 21ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 42ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (19 tests) 7ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 33ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 9ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 10ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 15ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 7ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 6ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 3ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 8ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 5ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 6ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (16 tests) 1476ms
@fury/api:test:
@fury/api:test:  Test Files  26 passed (26)
@fury/api:test:       Tests  154 passed (154)
@fury/api:test:    Start at  12:46:52
@fury/api:test:    Duration  2.27s (transform 3.09s, setup 428ms, import 7.43s, tests 2.24s, environment 2ms)
@fury/api:test:
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/web:test:
@fury/web:test:  RUN  v4.1.10 <repository>/apps/web
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 1032ms
@fury/web:test:      ✓ opens quick hide modal, provides reason, and confirms hiding  329ms
@fury/web:test:      ✓ opens comment details modal and allows viewing and closing  337ms
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 1127ms
@fury/web:test:      ✓ filters by status and clears search input via clear button  397ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (5 tests) 833ms
@fury/web:test:      ✓ shows saved manga fields without invented optional values, engagement or reader links  360ms
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 1153ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  309ms
@fury/web:test:      ✓ opens suspend dialog for regular user, confirms suspension and updates status  313ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicCatalogListing.test.tsx (5 tests) 978ms
@fury/web:test:      ✓ distinguishes pending, failure and retry from an empty catalog  417ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 1491ms
@fury/web:test:      ✓ opens create gift dialog and creates a new gift design  730ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (17 tests) 1629ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 2205ms
@fury/web:test:      ✓ changes pages through the server query and supports Escape focus return  323ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 2466ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 469ms
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 765ms
@fury/web:test:  ✓ src/features/home/components/public-home.test.tsx (6 tests) 568ms
@fury/web:test:      ✓ uses saved featured order and category shortcuts without an active reader or scores  360ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 872ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 453ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 693ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 814ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 454ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 363ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 446ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (2 tests) 415ms
@fury/web:test:      ✓ restricts type choices to text and preserves saved/unknown category and search  336ms
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 453ms
@fury/web:test:      ✓ renders the real session identity with fixture product summaries and valid links  369ms
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 399ms
@fury/web:test:      ✓ renders message details, sender info, and action panels  323ms
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 525ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 517ms
@fury/web:test:      ✓ renders heading structure, approval notice, takedown checklist, and submission link  515ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 459ms
@fury/web:test:      ✓ uploads a supported image and labels the result as a private candidate  308ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 472ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 366ms
@fury/web:test:      ✓ renders heading structure, legal draft approval note, and sections  364ms
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 402ms
@fury/web:test:      ✓ selects one avatar frame or no frame and keeps revoked gifts unavailable  303ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 417ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 369ms
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 421ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/use-public-work-metadata.test.tsx (9 tests) 619ms
@fury/web:test:  ✓ src/features/story/routing.test.tsx (5 tests) 368ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 271ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 307ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 529ms
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 298ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 336ms
@fury/web:test:      ✓ renders a complete heading structure, approval boundary, and internal section links  334ms
@fury/web:test:  ✓ src/components/ui/MangaCard/MangaCard.test.tsx (1 test) 265ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 229ms
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 336ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 192ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicWorkNotFound.test.tsx (5 tests) 328ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 193ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 187ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 167ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicWorkImage.test.tsx (5 tests) 261ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 237ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 195ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicCatalogState.test.tsx (6 tests) 265ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 276ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 128ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (4 tests) 192ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 12ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 161ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 95ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 189ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 112ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 59ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 50ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 20ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 66ms
@fury/web:test:  ✓ src/app/seo.test.ts (4 tests) 17ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 27ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 49ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 16ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 4ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 81ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 50ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 18ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (11 tests) 8ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (10 tests) 19ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 10ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (2 tests) 7ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 3ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 3ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 4ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 4ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests) 3808ms
@fury/web:test:      ✓ checks an unknown edit acknowledgement before allowing another save  379ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:
@fury/web:test:  Test Files  80 passed (80)
@fury/web:test:       Tests  516 passed (516)
@fury/web:test:    Start at  15:02:37
@fury/web:test:    Duration  16.97s (transform 6.32s, setup 16.86s, import 19.76s, tests 35.10s, environment 64.09s)
@fury/web:test:

 Tasks:    6 successful, 6 total
Cached:    5 cached, 6 total
  Time:    17.806s

$ turbo run test:integration
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test:integration in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs e4f4ed9387203e98
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test:integration: cache bypass, force executing 3aacbcc49b2c3bee
@fury/database:build: cache hit, replaying logs 51fbe2c37013493b
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 177ms
@fury/database:build:
@fury/api:test:integration: cache bypass, force executing a4cefe43084ff7ec
@fury/database:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration:
@fury/api:test:integration:  RUN  v4.1.10 <repository>/apps/api
@fury/api:test:integration:
@fury/database:test:integration:
@fury/database:test:integration:  RUN  v4.1.10 <repository>/packages/database
@fury/database:test:integration:
@fury/api:test:integration: (node:96792) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
@fury/api:test:integration: (Use `node --trace-deprecation ...` to show where the warning was created)
@fury/api:test:integration:  ✓ src/content.integration.test.ts (37 tests) 5413ms
@fury/api:test:integration:      ✓ serves anonymous catalog and work cover reads with public authority, safe failures and no writes  481ms
@fury/api:test:integration:      ✓ serves strict detail and optional background bytes without private data or stale visibility  341ms
@fury/api:test:integration:      ✓ keeps every management family server-authoritative before lookup  534ms
@fury/api:test:integration:      ✓ returns the central rate-limit envelope with request identity  466ms
@fury/database:test:integration:  ✓ tests/integration/chapter-upgrade.integration.test.ts (2 tests) 11530ms
@fury/database:test:integration:      ✓ preserves populated P01–P03 rows through failed, recovered, and repeated expand deploys  11504ms
@fury/api:test:integration:  ✓ src/modules/content/public-content.integration.test.ts (24 tests) 5224ms
@fury/api:test:integration:      ✓ keeps deterministic publication/title ties, distinct bounded pages and truthful overruns  332ms
@fury/api:test:integration:      ✓ builds bounded saved-order home sections and the first three populated suggestion tabs  330ms
@fury/api:test:integration:      ✓ projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works  398ms
@fury/api:test:integration:      ✓ exports all eligible canonical slugs across bounded batches without private IDs or writes  2105ms
@fury/api:test:integration:  ✓ src/modules/media/media.service.integration.test.ts (12 tests) 1204ms
@fury/api:test:integration:  ✓ src/modules/content/work-management.integration.test.ts (16 tests) 1175ms
@fury/api:test:integration:  ✓ src/modules/content/content-management.integration.test.ts (18 tests) 1079ms
@fury/api:test:integration:  ✓ src/media.integration.test.ts (14 tests) 853ms
@fury/api:test:integration:  ✓ src/modules/content/category-management.integration.test.ts (9 tests) 501ms
@fury/api:test:integration:  ✓ src/modules/media/media.reconcile.integration.test.ts (4 tests) 348ms
@fury/api:test:integration:  ✓ src/modules/content/publication-management.integration.test.ts (4 tests) 253ms
@fury/api:test:integration:  ✓ src/app.integration.test.ts (14 tests) 264ms
@fury/api:test:integration:  ✓ src/modules/auth/auth.service.integration.test.ts (6 tests) 127ms
@fury/api:test:integration:
@fury/api:test:integration:  Test Files  11 passed (11)
@fury/api:test:integration:       Tests  158 passed (158)
@fury/api:test:integration:    Start at  15:02:55
@fury/api:test:integration:    Duration  24.66s (transform 589ms, setup 20ms, import 1.19s, tests 16.44s, environment 0ms)
@fury/api:test:integration:
@fury/database:test:integration:  ✓ tests/integration/migration.integration.test.ts (6 tests) 12387ms
@fury/database:test:integration:      ✓ cascades refresh records and deploys idempotently  983ms
@fury/database:test:integration:      ✓ retires legacy phone after a populated P01 upgrade without losing account or session data  11277ms
@fury/database:test:integration:  ✓ tests/integration/content-domain.integration.test.ts (22 tests) 993ms
@fury/database:test:integration:  ✓ tests/integration/media-domain.integration.test.ts (5 tests) 205ms
@fury/database:test:integration:  ✓ tests/integration/media-recovery.integration.test.ts (1 test) 14ms
@fury/database:test:integration:
@fury/database:test:integration:  Test Files  5 passed (5)
@fury/database:test:integration:       Tests  36 passed (36)
@fury/database:test:integration:    Start at  15:02:55
@fury/database:test:integration:    Duration  32.36s (transform 90ms, setup 0ms, import 139ms, tests 25.13s, environment 0ms)
@fury/database:test:integration:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    33.37s

$ turbo run build
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running build in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs e4f4ed9387203e98
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:build: cache miss, executing 8cc7fc45f88203da
@fury/database:build: cache hit, replaying logs 51fbe2c37013493b
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 177ms
@fury/database:build:
@fury/api:build: cache hit, replaying logs d698bdf5eed17798
@fury/api:build: $ pnpm clean && tsc -p tsconfig.build.json
@fury/api:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo
@fury/web:build: $ next build --webpack
@fury/web:build: ▲ Next.js 16.2.12 (webpack)
@fury/web:build:
@fury/web:build:   Creating an optimized production build ...
@fury/web:build: ✓ Compiled successfully in 4.6s
@fury/web:build:   Running TypeScript ...
@fury/web:build:   Finished TypeScript in 6.1s ...
@fury/web:build:   Collecting page data using 9 workers ...
@fury/web:build:   Generating static pages using 9 workers (0/28) ...
@fury/web:build:   Generating static pages using 9 workers (7/28)
@fury/web:build:   Generating static pages using 9 workers (14/28)
@fury/web:build:   Generating static pages using 9 workers (21/28)
@fury/web:build: ✓ Generating static pages using 9 workers (28/28) in 253ms
@fury/web:build:   Finalizing page optimization ...
@fury/web:build:   Collecting build traces ...
@fury/web:build:
@fury/web:build: Route (app)
@fury/web:build: ┌ ƒ /
@fury/web:build: ├ ○ /_not-found
@fury/web:build: ├ ○ /admin
@fury/web:build: ├ ○ /admin/ads
@fury/web:build: ├ ○ /admin/categories
@fury/web:build: ├ ○ /admin/comments
@fury/web:build: ├ ○ /admin/contact
@fury/web:build: ├ ƒ /admin/contact/[messageId]
@fury/web:build: ├ ○ /admin/dashboard
@fury/web:build: ├ ○ /admin/gifts
@fury/web:build: ├ ○ /admin/gifts/grants
@fury/web:build: ├ ○ /admin/reports
@fury/web:build: ├ ○ /admin/users
@fury/web:build: ├ ƒ /admin/users/[userId]
@fury/web:build: ├ ○ /admin/works
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/new
@fury/web:build: ├ ƒ /admin/works/[workId]/edit
@fury/web:build: ├ ○ /admin/works/new
@fury/web:build: ├ ○ /auth/forgot-password
@fury/web:build: ├ ○ /auth/login
@fury/web:build: ├ ○ /auth/register
@fury/web:build: ├ ○ /auth/reset-password
@fury/web:build: ├ ○ /auth/verify-email
@fury/web:build: ├ ƒ /categories
@fury/web:build: ├ ○ /contact
@fury/web:build: ├ ○ /copyright
@fury/web:build: ├ ○ /dashboard
@fury/web:build: ├ ƒ /discover
@fury/web:build: ├ ○ /library
@fury/web:build: ├ ○ /privacy
@fury/web:build: ├ ƒ /report-issue
@fury/web:build: ├ ƒ /robots.txt
@fury/web:build: ├ ○ /settings
@fury/web:build: ├ ƒ /sitemap.xml
@fury/web:build: ├ ƒ /stories
@fury/web:build: ├ ƒ /story/[id]
@fury/web:build: ├ ƒ /story/[id]/chapter/[chapterId]
@fury/web:build: └ ○ /terms
@fury/web:build:
@fury/web:build:
@fury/web:build: ○  (Static)   prerendered as static content
@fury/web:build: ƒ  (Dynamic)  server-rendered on demand
@fury/web:build:

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    20.728s

$ node scripts/assert-build-output.mjs
Build output verified: 6 required entry artifacts present; 386 emitted files contain no test artifacts.
```

## integration-post-t083-types

Original capture: `integration-post-t083-types.txt`. Bytes: 15. SHA-256: `8366207267355d3e3d5bf3bf6e8c94c5f93f6078c34f08973fa2b38cdda6cc92`.

```text
$ tsc --noEmit
```

## integration-root-format-failed

Original capture: `integration-root-format-failed.txt`. Bytes: 2022. SHA-256: `1ec9cfacc754ad276dcae4d20df0433c55e647edebb3f8b8dd080ae3860d8634`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 29ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 98ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
[warn] apps/web/src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-category-last-enabled.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-design-1280.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-public-part1.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-browser-ssr-loading.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-latest-explain.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-production-imports.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-rendered-seo.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-ssr-unavailable.json
[warn] specs/006-public-catalog-discovery-seo/evidence/integration-turbo-environment.json
[warn] Code style issues found in 10 files. Run Prettier with --write to fix.
[ELIFECYCLE] Command failed with exit code 1.
[ELIFECYCLE] Command failed with exit code 1.
```

## integration-root-pre-t082

Original capture: `integration-root-pre-t082.txt`. Bytes: 30749. SHA-256: `d4f41a27a8868b99e302cbfa935838e397ac04b831c109d5c2563dc078c7e469`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 75ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 201ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache miss, executing 36f54ee3d5c49be4
@fury/contracts:lint: $ eslint .
@fury/database:lint: cache miss, executing 6e7cacdb6171e51b
@fury/web:lint: cache miss, executing 4219efd820cb6f5b
@fury/web:lint: $ eslint .
@fury/database:lint: $ eslint .
@fury/api:lint: cache miss, executing 381be4e74d0d4470
@fury/api:lint: $ eslint .
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
@fury/web:lint:   95:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
@fury/web:lint:
@fury/web:lint: ✖ 1 problem (0 errors, 1 warning)
@fury/web:lint:

 Tasks:    4 successful, 4 total
Cached:    0 cached, 4 total
  Time:    26.88s

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache miss, executing 90a343f8bbc72426
@fury/contracts:check-types: $ tsc --noEmit
@fury/web:check-types: cache miss, executing 16fdbb73d82e730c
@fury/database:check-types: cache miss, executing 6f4d6f61db15b1f7
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/web:check-types: $ tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 93ms
@fury/database:check-types:
@fury/api:check-types: cache miss, executing 023696dea2e4ec62
@fury/api:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    0 cached, 4 total
  Time:    4.379s

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache miss, executing e4f4ed9387203e98
@fury/contracts:test: cache miss, executing 36bc416e062052e2
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 <repository>/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 5ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 8ms
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 6ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 13ms
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 42ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  12:46:45
@fury/contracts:test:    Duration  311ms (transform 275ms, setup 0ms, import 608ms, tests 73ms, environment 0ms)
@fury/contracts:test:
@fury/web:test: cache miss, executing baf54c72cd532510
@fury/database:test: cache miss, executing 6348e8d0dd17fcb7
@fury/database:build: cache miss, executing 51fbe2c37013493b
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/database:test:  RUN  v4.1.10 <repository>/packages/database
@fury/database:test:
@fury/web:test:
@fury/web:test:  RUN  v4.1.10 <repository>/apps/web
@fury/web:test:
@fury/database:build: $ prisma generate
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 4ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 188ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  12:46:47
@fury/database:test:    Duration  648ms (transform 217ms, setup 0ms, import 376ms, tests 192ms, environment 0ms)
@fury/database:test:
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 177ms
@fury/database:build:
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 946ms
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 930ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 872ms
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 1086ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  467ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 1293ms
@fury/web:test:      ✓ opens create gift dialog and creates a new gift design  491ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (17 tests) 1609ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 1850ms
@fury/web:test:      ✓ loads persisted categories, searches on the server, and shows filtered empty state  360ms
@fury/web:test:      ✓ changes pages through the server query and supports Escape focus return  323ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 2249ms
@fury/web:test:      ✓ builds the complete supported document through the text controls  311ms
@fury/api:test: cache miss, executing 6d1b957fccf660d4
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 312ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (2 tests) 477ms
@fury/web:test:      ✓ restricts type choices to text and preserves saved/unknown category and search  382ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 648ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 803ms
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 452ms
@fury/web:test:      ✓ renders the real session identity with fixture product summaries and valid links  383ms
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 <repository>/apps/api
@fury/api:test:
@fury/web:test:  ✓ src/features/story/routing.test.tsx (5 tests) 641ms
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 67ms
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 84ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 832ms
@fury/web:test:      ✓ renders the FURY brand and navigation groups with correct active state  481ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 12ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 13ms
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 14ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 31ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 12ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 341ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 21ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 42ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (19 tests) 7ms
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 924ms
@fury/web:test:      ✓ renders owned gifts and allows revoking an owned gift  456ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 33ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 9ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 10ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 15ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 7ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 6ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 640ms
@fury/web:test:      ✓ replaces the page with login only after server logout succeeds  453ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 3ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 8ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 5ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 6ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 5ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 533ms
@fury/web:test:      ✓ navigates to the previous and next fixture chapters in reading order  339ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 280ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 446ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests) 5557ms
@fury/web:test:      ✓ checks an unknown edit acknowledgement before allowing another save  486ms
@fury/web:test:      ✓ keeps local input after a 404 then explicit same-ID POST 409 without claiming success  331ms
@fury/web:test:      ✓ keeps the original UUID and blocks a third POST after 404, 409, and another 404  455ms
@fury/web:test:      ✓ preserves a post-submit edit until server adoption, then accepts a later refresh  560ms
@fury/web:test:      ✓ does not erase newer draft input when an ambiguous create readback matches the submitted version  318ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (16 tests) 1476ms
@fury/api:test:
@fury/api:test:  Test Files  26 passed (26)
@fury/api:test:       Tests  154 passed (154)
@fury/api:test:    Start at  12:46:52
@fury/api:test:    Duration  2.27s (transform 3.09s, setup 428ms, import 7.43s, tests 2.24s, environment 2ms)
@fury/api:test:
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 891ms
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 299ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 297ms
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 791ms
@fury/web:test:  ✓ src/components/ui/MangaCard/MangaCard.test.tsx (1 test) 239ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 186ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 294ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 249ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 353ms
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 339ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 170ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 188ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 344ms
@fury/web:test:      ✓ renders heading structure, approval notice, takedown checklist, and submission link  343ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 209ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 134ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 247ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 330ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (4 tests) 145ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 296ms
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 440ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 180ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 146ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 164ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 292ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 338ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 99ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 159ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 59ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 18ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 491ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 62ms
@fury/web:test:  ✓ src/features/home/components/public-home.test.tsx (6 tests) 570ms
@fury/web:test:      ✓ uses saved featured order and category shortcuts without an active reader or scores  341ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (5 tests) 545ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 8ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicCatalogListing.test.tsx (5 tests) 583ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 36ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 49ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 13ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicWorkNotFound.test.tsx (4 tests) 241ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 40ms
@fury/web:test:  ✓ src/app/seo.test.ts (4 tests) 16ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicCatalogState.test.tsx (6 tests) 213ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicWorkImage.test.tsx (5 tests) 251ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 36ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 39ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 45ms
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 285ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (10 tests) 12ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 10ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 59ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (8 tests) 10ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (2 tests) 8ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 4ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 5ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 6ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 5ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 3ms
@fury/web:test:
@fury/web:test:  Test Files  79 passed (79)
@fury/web:test:       Tests  503 passed (503)
@fury/web:test:    Start at  12:46:47
@fury/web:test:    Duration  17.17s (transform 5.26s, setup 19.05s, import 18.86s, tests 34.92s, environment 64.86s)
@fury/web:test:

 Tasks:    6 successful, 6 total
Cached:    0 cached, 6 total
  Time:    19.58s

$ turbo run test:integration
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test:integration in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs e4f4ed9387203e98
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test:integration: cache bypass, force executing 3aacbcc49b2c3bee
@fury/database:build: cache hit, replaying logs 51fbe2c37013493b
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 177ms
@fury/database:build:
@fury/api:test:integration: cache bypass, force executing a4cefe43084ff7ec
@fury/api:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/database:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration:
@fury/api:test:integration:  RUN  v4.1.10 <repository>/apps/api
@fury/api:test:integration:
@fury/database:test:integration:
@fury/database:test:integration:  RUN  v4.1.10 <repository>/packages/database
@fury/database:test:integration:
@fury/api:test:integration: (node:49481) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
@fury/api:test:integration: (Use `node --trace-deprecation ...` to show where the warning was created)
@fury/api:test:integration:  ✓ src/modules/content/public-content.integration.test.ts (24 tests) 8972ms
@fury/api:test:integration:      ✓ returns only jointly eligible allowlisted metadata and hides it again  706ms
@fury/api:test:integration:      ✓ hides an illustrated Chapter while a saved image is unavailable and restores it after repair  617ms
@fury/api:test:integration:      ✓ rejects an empty published text document without changing public metadata  464ms
@fury/api:test:integration:      ✓ hides malformed legacy text without changing its publication event  332ms
@fury/api:test:integration:      ✓ enforces every parent and Chapter visibility-state combination  954ms
@fury/api:test:integration:      ✓ projects all six types and restricts stories without private identifiers  607ms
@fury/api:test:integration:      ✓ keeps deterministic publication/title ties, distinct bounded pages and truthful overruns  399ms
@fury/api:test:integration:      ✓ builds bounded saved-order home sections and the first three populated suggestion tabs  355ms
@fury/api:test:integration:      ✓ projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works  470ms
@fury/api:test:integration:      ✓ exports all eligible canonical slugs across bounded batches without private IDs or writes  2198ms
@fury/api:test:integration:  ✓ src/content.integration.test.ts (37 tests) 4995ms
@fury/api:test:integration:      ✓ serves strict detail and optional background bytes without private data or stale visibility  339ms
@fury/api:test:integration:      ✓ keeps every management family server-authoritative before lookup  556ms
@fury/api:test:integration:      ✓ returns the central rate-limit envelope with request identity  414ms
@fury/database:test:integration:  ✓ tests/integration/migration.integration.test.ts (6 tests) 16880ms
@fury/database:test:integration:      ✓ cascades refresh records and deploys idempotently  3498ms
@fury/database:test:integration:      ✓ retires legacy phone after a populated P01 upgrade without losing account or session data  13013ms
@fury/api:test:integration:  ✓ src/modules/media/media.service.integration.test.ts (12 tests) 1348ms
@fury/api:test:integration:  ✓ src/modules/content/work-management.integration.test.ts (16 tests) 1237ms
@fury/api:test:integration:  ✓ src/media.integration.test.ts (14 tests) 1009ms
@fury/api:test:integration:  ✓ src/modules/content/content-management.integration.test.ts (18 tests) 1141ms
@fury/api:test:integration:  ✓ src/modules/content/category-management.integration.test.ts (9 tests) 517ms
@fury/api:test:integration:  ✓ src/modules/media/media.reconcile.integration.test.ts (4 tests) 387ms
@fury/api:test:integration:  ✓ src/app.integration.test.ts (14 tests) 261ms
@fury/api:test:integration:  ✓ src/modules/content/publication-management.integration.test.ts (4 tests) 263ms
@fury/api:test:integration:  ✓ src/modules/auth/auth.service.integration.test.ts (6 tests) 109ms
@fury/api:test:integration:
@fury/api:test:integration:  Test Files  11 passed (11)
@fury/api:test:integration:       Tests  158 passed (158)
@fury/api:test:integration:    Start at  12:47:06
@fury/api:test:integration:    Duration  39.13s (transform 1.32s, setup 39ms, import 2.21s, tests 20.24s, environment 0ms)
@fury/api:test:integration:
@fury/database:test:integration:  ✓ tests/integration/chapter-upgrade.integration.test.ts (2 tests) 11363ms
@fury/database:test:integration:      ✓ preserves populated P01–P03 rows through failed, recovered, and repeated expand deploys  11349ms
@fury/database:test:integration:  ✓ tests/integration/content-domain.integration.test.ts (22 tests) 984ms
@fury/database:test:integration:  ✓ tests/integration/media-domain.integration.test.ts (5 tests) 204ms
@fury/database:test:integration:  ✓ tests/integration/media-recovery.integration.test.ts (1 test) 13ms
@fury/database:test:integration:
@fury/database:test:integration:  Test Files  5 passed (5)
@fury/database:test:integration:       Tests  36 passed (36)
@fury/database:test:integration:    Start at  12:47:06
@fury/database:test:integration:    Duration  46.35s (transform 134ms, setup 0ms, import 249ms, tests 29.44s, environment 0ms)
@fury/database:test:integration:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    48.513s

$ turbo run build
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running build in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs e4f4ed9387203e98
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:build: cache miss, executing f180199ce1b220eb
@fury/database:build: cache hit, replaying logs 51fbe2c37013493b
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 177ms
@fury/database:build:
@fury/api:build: cache miss, executing d698bdf5eed17798
@fury/api:build: $ pnpm clean && tsc -p tsconfig.build.json
@fury/web:build: $ next build --webpack
@fury/api:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo
@fury/web:build: ▲ Next.js 16.2.12 (webpack)
@fury/web:build:
@fury/web:build:   Creating an optimized production build ...
@fury/web:build: ✓ Compiled successfully in 5.6s
@fury/web:build:   Running TypeScript ...
@fury/web:build:   Finished TypeScript in 6.8s ...
@fury/web:build:   Collecting page data using 9 workers ...
@fury/web:build:   Generating static pages using 9 workers (0/28) ...
@fury/web:build:   Generating static pages using 9 workers (7/28)
@fury/web:build:   Generating static pages using 9 workers (14/28)
@fury/web:build:   Generating static pages using 9 workers (21/28)
@fury/web:build: ✓ Generating static pages using 9 workers (28/28) in 299ms
@fury/web:build:   Finalizing page optimization ...
@fury/web:build:   Collecting build traces ...
@fury/web:build:
@fury/web:build: Route (app)
@fury/web:build: ┌ ƒ /
@fury/web:build: ├ ○ /_not-found
@fury/web:build: ├ ○ /admin
@fury/web:build: ├ ○ /admin/ads
@fury/web:build: ├ ○ /admin/categories
@fury/web:build: ├ ○ /admin/comments
@fury/web:build: ├ ○ /admin/contact
@fury/web:build: ├ ƒ /admin/contact/[messageId]
@fury/web:build: ├ ○ /admin/dashboard
@fury/web:build: ├ ○ /admin/gifts
@fury/web:build: ├ ○ /admin/gifts/grants
@fury/web:build: ├ ○ /admin/reports
@fury/web:build: ├ ○ /admin/users
@fury/web:build: ├ ƒ /admin/users/[userId]
@fury/web:build: ├ ○ /admin/works
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/new
@fury/web:build: ├ ƒ /admin/works/[workId]/edit
@fury/web:build: ├ ○ /admin/works/new
@fury/web:build: ├ ○ /auth/forgot-password
@fury/web:build: ├ ○ /auth/login
@fury/web:build: ├ ○ /auth/register
@fury/web:build: ├ ○ /auth/reset-password
@fury/web:build: ├ ○ /auth/verify-email
@fury/web:build: ├ ƒ /categories
@fury/web:build: ├ ○ /contact
@fury/web:build: ├ ○ /copyright
@fury/web:build: ├ ○ /dashboard
@fury/web:build: ├ ƒ /discover
@fury/web:build: ├ ○ /library
@fury/web:build: ├ ○ /privacy
@fury/web:build: ├ ƒ /report-issue
@fury/web:build: ├ ƒ /robots.txt
@fury/web:build: ├ ○ /settings
@fury/web:build: ├ ƒ /sitemap.xml
@fury/web:build: ├ ƒ /stories
@fury/web:build: ├ ƒ /story/[id]
@fury/web:build: ├ ƒ /story/[id]/chapter/[chapterId]
@fury/web:build: └ ○ /terms
@fury/web:build:
@fury/web:build:
@fury/web:build: ○  (Static)   prerendered as static content
@fury/web:build: ƒ  (Dynamic)  server-rendered on demand
@fury/web:build:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    22.787s

$ node scripts/assert-build-output.mjs
Build output verified: 6 required entry artifacts present; 386 emitted files contain no test artifacts.
```

## integration-routes

Original capture: `integration-routes.txt`. Bytes: 1042. SHA-256: `78c675ad4c53b07188a0949b669d42782d8b53973e0bb355ec3f140ba3154635`.

```text
$ node scripts/check-web-routes.mjs http://127.0.0.1:4316 saved-manga-0
PASS /dashboard
PASS /library
PASS /settings
PASS /admin/ads
PASS /admin/categories
PASS /admin/comments
PASS /admin/contact/msg-1
PASS /admin/contact
PASS /admin/dashboard
PASS /admin/gifts/grants
PASS /admin/gifts
PASS /admin
PASS /admin/reports
PASS /admin/users/user-1
PASS /admin/users
PASS /admin/works/trait-hoarder/chapters/th-43/edit
PASS /admin/works/trait-hoarder/chapters/new
PASS /admin/works/trait-hoarder/chapters
PASS /admin/works/trait-hoarder/edit
PASS /admin/works/new
PASS /admin/works
PASS /auth/forgot-password
PASS /auth/login
PASS /auth/register
PASS /auth/reset-password
PASS /auth/verify-email
PASS /categories
PASS /contact
PASS /copyright
PASS /discover
PASS /
PASS /privacy
PASS /report-issue
PASS /stories
PASS /story/saved-manga-0/chapter/1
PASS /story/saved-manga-0
PASS /terms
PASS /story/trait-hoarder/chapter/43
PASS /story/1/chapter/1
PASS /story/1/chapter/2
Verified 40 existing routes and the 404 fallback at http://127.0.0.1:4316.
```

## integration-seo-tests

Original capture: `integration-seo-tests.txt`. Bytes: 337. SHA-256: `5043dc7bacc5f007468e89d2440fa6ffcf0f080d257d0ef373ed6ca8664a8ea4`.

```text
$ vitest run --config vitest.config.ts src/app/seo.test.ts

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  11:16:39
   Duration  496ms (transform 95ms, setup 145ms, import 227ms, tests 11ms, environment 0ms)

```

## integration-state-test

Original capture: `integration-state-test.txt`. Bytes: 388. SHA-256: `4bc4a1e32482a71a1604b4c0bc138c81a304ed7538cbd011fb320a8252917f70`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/components/PublicCatalogState.test.tsx

 RUN  v4.1.10 /Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  11:04:55
   Duration  1.51s (transform 100ms, setup 252ms, import 179ms, tests 141ms, environment 745ms)

```

## integration-t081-intermediate-failure

Original capture: `integration-t081-intermediate-failure.txt`. Bytes: 4432. SHA-256: `a8238225853c7e5543c8d3a3a40dc807b08709f43e35762027de02eead836721`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/components/PublicWorkNotFound.test.tsx

 RUN  v4.1.10 <repository>/apps/web

 ❯ src/features/public-catalog/components/PublicWorkNotFound.test.tsx (4 tests | 1 failed) 1129ms
   × does not let an abandoned delayed boundary effect cancel StrictMode's newer recovery 1067ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/public-catalog/components/PublicWorkNotFound.test.tsx > does not let an abandoned delayed boundary effect cancel StrictMode's newer recovery
AssertionError: expected "vi.fn()" to be called 1 times, but got 0 times

Ignored nodes: comments, script, style
[36m<html>[39m
  [36m<head />[39m
  [36m<body>[39m
    [36m<div />[39m
    [36m<div>[39m
      [36m<main[39m
        [33mclass[39m=[32m"state-page"[39m
        [33mdir[39m=[32m"rtl"[39m
      [36m>[39m
        [36m<div[39m
          [33mdata-public-catalog-focus[39m=[32m""[39m
          [33mdir[39m=[32m"rtl"[39m
          [33mtabindex[39m=[32m"-1"[39m
        [36m>[39m
          [36m<section[39m
            [33mclass[39m=[32m"_state_2cac4d"[39m
            [33mrole[39m=[32m"status"[39m
          [36m>[39m
            [36m<svg[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"lucide lucide-circle-alert _icon_2cac4d"[39m
              [33mfill[39m=[32m"none"[39m
              [33mheight[39m=[32m"24"[39m
              [33mstroke[39m=[32m"currentColor"[39m
              [33mstroke-linecap[39m=[32m"round"[39m
              [33mstroke-linejoin[39m=[32m"round"[39m
              [33mstroke-width[39m=[32m"2"[39m
              [33mviewBox[39m=[32m"0 0 24 24"[39m
              [33mwidth[39m=[32m"24"[39m
              [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
            [36m>[39m
              [36m<circle[39m
                [33mcx[39m=[32m"12"[39m
                [33mcy[39m=[32m"12"[39m
                [33mr[39m=[32m"10"[39m
              [36m/>[39m
              [36m<line[39m
                [33mx1[39m=[32m"12"[39m
                [33mx2[39m=[32m"12"[39m
                [33my1[39m=[32m"8"[39m
                [33my2[39m=[32m"12"[39m
              [36m/>[39m
              [36m<line[39m
                [33mx1[39m=[32m"12"[39m
                [33mx2[39m=[32m"12.01"[39m
                [33my1[39m=[32m"16"[39m
                [33my2[39m=[32m"16"[39m
              [36m/>[39m
            [36m</svg>[39m
            [36m<h2>[39m
              [0mالعمل غير موجود[0m
            [36m</h2>[39m
            [36m<p>[39m
              [0mهذا العمل غير متاح للعرض.[0m
            [36m</p>[39m
            [36m<button[39m
              [33mclass[39m=[32m"button button--small"[39m
              [33mtype[39m=[32m"button"[39m
            [36m>[39m
              [0mإعادة المحاولة[0m
            [36m</button>[39m
          [36m</section>[39m
        [36m</div>[39m
      [36m</main>[39m
    [36m</div>[39m
  [36m</body>[39m
[36m</html>[39m
 ❯ src/features/public-catalog/components/PublicWorkNotFound.test.tsx:165:45
    163|     { wrapper },
    164|   );
    165|   await waitFor(() => expect(route.refresh).toHaveBeenCalledTimes(1));
       |                                             ^
    166|   expect(listReads).toBe(2);
    167|   await act(async () => {
 ❯ runWithExpensiveErrorDiagnosticsDisabled ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:47:12
 ❯ checkCallback ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/wait-for.js:124:77
 ❯ Timeout.checkRealTimersCallback ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/wait-for.js:118:16

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
   Start at  12:42:24
   Duration  2.53s (transform 168ms, setup 169ms, import 396ms, tests 1.13s, environment 707ms)

<repository>/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 test: `vitest run --config vitest.config.ts src/features/public-catalog/components/PublicWorkNotFound.test.tsx`
Exit status 1
```

## integration-t081-tests

Original capture: `integration-t081-tests.txt`. Bytes: 382. SHA-256: `183562e5ce44c45fb9e4a225592f78f9e5e3572f9da34f2508fe4462643d5c6b`.

```text
$ vitest run --config vitest.config.ts src/features/public-catalog/components/PublicWorkNotFound.test.tsx src/features/public-catalog/hooks/public-catalog.hooks.test.tsx

 RUN  v4.1.10 <repository>/apps/web


 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  12:43:24
   Duration  2.84s (transform 273ms, setup 341ms, import 639ms, tests 1.71s, environment 1.38s)

```

## integration-types-first

Original capture: `integration-types-first.txt`. Bytes: 1343. SHA-256: `bd679af4372ca88e4b9d7324f6d394847519bcc58ab39cd2edc2373b787f3e55`.

```text
$ tsc --noEmit
src/components/ui/MangaCard/CardImage.tsx(83,25): error TS2375: Type '{ src: string; alt: string; className: string | undefined; retryable: false; }' is not assignable to type 'Readonly<{ src: string; alt: string; className?: string; style?: CSSProperties; loading?: "lazy" | "eager"; retryable?: boolean; }>' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
  Types of property 'className' are incompatible.
    Type 'string | undefined' is not assignable to type 'string'.
      Type 'undefined' is not assignable to type 'string'.
src/features/text-stories/model/catalog.test.tsx(69,32): error TS2741: Property 'view' is missing in type '{ page: number; q: string; category: string; status: "" | TextWorkStatus; type: "" | TextContentType; sort: TextCatalogSort; }' but required in type '{ q?: string; view: "all" | "stories"; sort: "newest" | "chapter-latest" | "title-asc" | "title-desc"; page: number; category?: string | undefined; type?: "manga" | "manhwa" | "manhua" | "comics" | "novel" | "text-story" | undefined; status?: "ongoing" | ... 3 more ... | undefined; }'.
/Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 check-types: `tsc --noEmit`
Exit status 2
```

## integration-types-fourth

Original capture: `integration-types-fourth.txt`. Bytes: 15. SHA-256: `8366207267355d3e3d5bf3bf6e8c94c5f93f6078c34f08973fa2b38cdda6cc92`.

```text
$ tsc --noEmit
```

## integration-types-third

Original capture: `integration-types-third.txt`. Bytes: 416. SHA-256: `d005a488a6e39cd603ae5a49d441b80f3672ef8681b67edf35cf67aedabb8973`.

```text
$ tsc --noEmit
src/features/public-catalog/components/PublicCatalogListing.test.tsx(24,588): error TS1005: ')' expected.
src/features/public-catalog/components/PublicCatalogListing.test.tsx(32,392): error TS1005: ')' expected.
/Users/mohamedabdelkareem/Mine/Software Engineering/Work/Mostaql Projects/fury-manga/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 check-types: `tsc --noEmit`
Exit status 2
```

## remediation-after-media-verify

Original capture: `remediation-after-media-verify.txt`. Bytes: 28848. SHA-256: `ff214bbf0f0ddfa43cf9e522358d5e3007c4a1ffbffa60db357d1856b8cb2fe5`. Display line endings normalized; exact bytes are in the index.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 29ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 88ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache hit, replaying logs 742a27afe205c618
@fury/contracts:lint: $ eslint .
@fury/database:lint: cache hit, replaying logs 254208cb6806329f
@fury/web:lint: cache hit, replaying logs 9ee8a05380650d80
@fury/database:lint: $ eslint .
@fury/api:lint: cache miss, executing ca187263d325004e
@fury/web:lint: $ eslint .
@fury/api:lint: $ eslint .

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    8.811s

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache hit, replaying logs 23bcd6edf7bb7dce
@fury/contracts:check-types: $ tsc --noEmit
@fury/web:check-types: cache hit, replaying logs d0b450f290b7a7bd
@fury/database:check-types: cache hit, replaying logs fd057a7cd81b1a70
@fury/web:check-types: $ tsc --noEmit
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 88ms
@fury/database:check-types:
@fury/api:check-types: cache miss, executing 353d09054b75be71
@fury/api:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    1.118s

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:test: cache hit, replaying logs a9a5d239578e4928
@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 [repository]/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 3ms
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 4ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 5ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 6ms
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 22ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  17:33:49
@fury/contracts:test:    Duration  196ms (transform 164ms, setup 0ms, import 383ms, tests 40ms, environment 0ms)
@fury/contracts:test:
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:test: cache hit, replaying logs dc336b5a4416649d
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/web:test:
@fury/web:test:  RUN  v4.1.10 [repository]/apps/web
@fury/web:test:
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 434ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 416ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 434ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 507ms
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 732ms
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 735ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 790ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 1776ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 352ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 548ms
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 376ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (6 tests) 427ms
@fury/web:test:      ✓ uses the illustrated-work template with text-specific routes and labels  401ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (10 tests) 456ms
@fury/database:test: cache hit, replaying logs 432118bba498c41d
@fury/web:test:      ✓ renders real previous and next links for a paginated result  449ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 716ms
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 423ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 1628ms
@fury/web:test:      ✓ loads persisted categories, searches on the server, and shows filtered empty state  300ms
@fury/web:test:      ✓ changes pages through the server query and supports Escape focus return  372ms
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/database:test:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 3ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 116ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  18:41:20
@fury/database:test:    Duration  418ms (transform 105ms, setup 0ms, import 210ms, tests 119ms, environment 0ms)
@fury/database:test:
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 392ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 514ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests) 3908ms
@fury/web:test:      ✓ checks an unknown edit acknowledgement before allowing another save  404ms
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 446ms
@fury/web:test:      ✓ renders the real session identity with fixture product summaries and valid links  400ms
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 953ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  414ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 1194ms
@fury/web:test:      ✓ opens create gift dialog and creates a new gift design  447ms
@fury/web:test:  ✓ src/features/story/routing.test.tsx (6 tests) 961ms
@fury/web:test:      ✓ keeps chapter links under the current story 1  586ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 277ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 336ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 307ms
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 358ms
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 273ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 314ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 277ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 501ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 169ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 296ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 175ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 308ms
@fury/web:test:      ✓ renders heading structure, legal draft approval note, and sections  306ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 224ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 153ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 217ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 158ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 117ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (14 tests) 1271ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 109ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 876ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 138ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 143ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 197ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (4 tests) 177ms
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 824ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 37ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 82ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 160ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 53ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 54ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 17ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 44ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 42ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 25ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 26ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 23ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 52ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 16ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 9ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 6ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (8 tests) 56ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (4 tests) 10ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 4ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (3 tests) 4ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 2ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 3ms
@fury/web:test:
@fury/web:test:  Test Files  72 passed (72)
@fury/web:test:       Tests  474 passed (474)
@fury/web:test:    Start at  09:30:17
@fury/web:test:    Duration  13.79s (transform 4.52s, setup 12.11s, import 13.79s, tests 28.05s, environment 55.28s)
@fury/web:test:
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test: cache miss, executing 9a41a4f840050b38
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 64ms
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 80ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 13ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 11ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 59ms
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 24ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 22ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 19ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 405ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 141ms
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (19 tests) 7ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 14ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 7ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 7ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 5ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 13ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 9ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 15ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 4ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 6ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 4ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 3ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 4ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (16 tests) 1078ms
@fury/api:test:
@fury/api:test:  Test Files  26 passed (26)
@fury/api:test:       Tests  154 passed (154)
@fury/api:test:    Start at  09:34:24
@fury/api:test:    Duration  1.59s (transform 1.51s, setup 307ms, import 4.10s, tests 2.03s, environment 2ms)
@fury/api:test:

 Tasks:    6 successful, 6 total
Cached:    5 cached, 6 total
  Time:    2.351s

$ turbo run test:integration
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test:integration in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test:integration: cache bypass, force executing 776c35b4682d8f0c
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test:integration: cache bypass, force executing a158bddb04214295
@fury/database:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration:
@fury/api:test:integration:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:integration:
@fury/database:test:integration:
@fury/database:test:integration:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:integration:
@fury/api:test:integration: (node:96185) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
@fury/api:test:integration: (Use `node --trace-deprecation ...` to show where the warning was created)
@fury/api:test:integration:  ✓ src/modules/content/public-content.integration.test.ts (24 tests) 6727ms
@fury/api:test:integration:      ✓ enforces every parent and Chapter visibility-state combination  421ms
@fury/api:test:integration:      ✓ keeps deterministic publication/title ties, distinct bounded pages and truthful overruns  434ms
@fury/api:test:integration:      ✓ builds bounded saved-order home sections and the first three populated suggestion tabs  304ms
@fury/api:test:integration:      ✓ projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works  434ms
@fury/api:test:integration:      ✓ exports all eligible canonical slugs across bounded batches without private IDs or writes  3208ms
@fury/api:test:integration:  ✓ src/content.integration.test.ts (37 tests) 7066ms
@fury/api:test:integration:      ✓ serves anonymous catalog and work cover reads with public authority, safe failures and no writes  341ms
@fury/api:test:integration:      ✓ serves strict detail and optional background bytes without private data or stale visibility  391ms
@fury/api:test:integration:      ✓ keeps every management family server-authoritative before lookup  492ms
@fury/api:test:integration:      ✓ returns the central rate-limit envelope with request identity  425ms
@fury/api:test:integration:      ✓ keeps Chapter-page reference writes inside Chapter save after authority  446ms
@fury/api:test:integration:      ✓ persists the complete illustrated page set only after Chapter save  531ms
@fury/api:test:integration:      ✓ returns stable immutable, validation, and authorized not-found outcomes  473ms
@fury/api:test:integration:      ✓ manages saved category filters, state, usage, and adjacent order over HTTP  416ms
@fury/api:test:integration:      ✓ publishes allowlisted metadata credential-free and hides it identically  371ms
@fury/api:test:integration:      ✓ completes the real ADMIN to public text-story acceptance journey  322ms
@fury/database:test:integration:  ✓ tests/integration/migration.integration.test.ts (6 tests) 16253ms
@fury/database:test:integration:      ✓ cascades refresh records and deploys idempotently  1024ms
@fury/database:test:integration:      ✓ retires legacy phone after a populated P01 upgrade without losing account or session data  15083ms
@fury/api:test:integration:  ✓ src/modules/media/media.service.integration.test.ts (12 tests) 1646ms
@fury/api:test:integration:  ✓ src/modules/content/work-management.integration.test.ts (16 tests) 1392ms
@fury/api:test:integration:  ✓ src/modules/content/content-management.integration.test.ts (18 tests) 1308ms
@fury/api:test:integration:  ✓ src/media.integration.test.ts (14 tests) 882ms
@fury/api:test:integration:  ✓ src/modules/content/category-management.integration.test.ts (9 tests) 464ms
@fury/api:test:integration:  ✓ src/modules/media/media.reconcile.integration.test.ts (4 tests) 372ms
@fury/api:test:integration:  ✓ src/app.integration.test.ts (14 tests) 240ms
@fury/api:test:integration:  ✓ src/modules/content/publication-management.integration.test.ts (4 tests) 214ms
@fury/api:test:integration:  ✓ src/modules/auth/auth.service.integration.test.ts (6 tests) 109ms
@fury/api:test:integration:
@fury/api:test:integration:  Test Files  11 passed (11)
@fury/api:test:integration:       Tests  158 passed (158)
@fury/api:test:integration:    Start at  09:34:26
@fury/api:test:integration:    Duration  28.34s (transform 615ms, setup 24ms, import 1.09s, tests 20.42s, environment 0ms)
@fury/api:test:integration:
@fury/database:test:integration:  ✓ tests/integration/chapter-upgrade.integration.test.ts (2 tests) 12680ms
@fury/database:test:integration:      ✓ preserves populated P01–P03 rows through failed, recovered, and repeated expand deploys  12666ms
@fury/database:test:integration:  ✓ tests/integration/content-domain.integration.test.ts (22 tests) 1124ms
@fury/database:test:integration:  ✓ tests/integration/media-domain.integration.test.ts (5 tests) 194ms
@fury/database:test:integration:  ✓ tests/integration/media-recovery.integration.test.ts (1 test) 18ms
@fury/database:test:integration:
@fury/database:test:integration:  Test Files  5 passed (5)
@fury/database:test:integration:       Tests  36 passed (36)
@fury/database:test:integration:    Start at  09:34:26
@fury/database:test:integration:    Duration  37.22s (transform 104ms, setup 0ms, import 148ms, tests 30.27s, environment 0ms)
@fury/database:test:integration:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    38.339s

$ turbo run build
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running build in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:build: cache miss, executing 1a84001329549332
@fury/web:build: cache hit, replaying logs eb613465a1351aec
@fury/web:build: $ next build --webpack
@fury/web:build: ▲ Next.js 16.2.12 (webpack)
@fury/web:build:
@fury/web:build:   Creating an optimized production build ...
@fury/web:build: ✓ Compiled successfully in 5.9s
@fury/web:build:   Running TypeScript ...
@fury/web:build:   Finished TypeScript in 8.3s ...
@fury/web:build:   Collecting page data using 9 workers ...
@fury/web:build:   Generating static pages using 9 workers (0/32) ...
@fury/web:build:   Generating static pages using 9 workers (8/32)
@fury/web:build:   Generating static pages using 9 workers (16/32)
@fury/web:build:   Generating static pages using 9 workers (24/32)
@fury/web:build: ✓ Generating static pages using 9 workers (32/32) in 325ms
@fury/web:build:   Finalizing page optimization ...
@fury/web:build:   Collecting build traces ...
@fury/web:build:
@fury/web:build: Route (app)
@fury/web:build: ┌ ○ /
@fury/web:build: ├ ○ /_not-found
@fury/web:build: ├ ○ /admin
@fury/web:build: ├ ○ /admin/ads
@fury/web:build: ├ ○ /admin/categories
@fury/web:build: ├ ○ /admin/comments
@fury/web:build: ├ ○ /admin/contact
@fury/web:build: ├ ƒ /admin/contact/[messageId]
@fury/web:build: ├ ○ /admin/dashboard
@fury/web:build: ├ ○ /admin/gifts
@fury/web:build: ├ ○ /admin/gifts/grants
@fury/web:build: ├ ○ /admin/reports
@fury/web:build: ├ ○ /admin/users
@fury/web:build: ├ ƒ /admin/users/[userId]
@fury/web:build: ├ ○ /admin/works
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/new
@fury/web:build: ├ ƒ /admin/works/[workId]/edit
@fury/web:build: ├ ○ /admin/works/new
@fury/web:build: ├ ○ /auth/forgot-password
@fury/web:build: ├ ○ /auth/login
@fury/web:build: ├ ○ /auth/register
@fury/web:build: ├ ○ /auth/reset-password
@fury/web:build: ├ ○ /auth/verify-email
@fury/web:build: ├ ○ /categories
@fury/web:build: ├ ○ /contact
@fury/web:build: ├ ○ /copyright
@fury/web:build: ├ ○ /dashboard
@fury/web:build: ├ ƒ /discover
@fury/web:build: ├ ○ /library
@fury/web:build: ├ ○ /privacy
@fury/web:build: ├ ƒ /report-issue
@fury/web:build: ├ ○ /settings
@fury/web:build: ├ ƒ /stories
@fury/web:build: ├ ƒ /story/[id]
@fury/web:build: ├ ƒ /story/[id]/chapter/[chapterId]
@fury/web:build: └ ○ /terms
@fury/web:build:
@fury/web:build:
@fury/web:build: ○  (Static)   prerendered as static content
@fury/web:build: ƒ  (Dynamic)  server-rendered on demand
@fury/web:build:
@fury/api:build: $ pnpm clean && tsc -p tsconfig.build.json
@fury/api:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    3.859s

$ node scripts/assert-build-output.mjs
Build output verified: 6 required entry artifacts present; 384 emitted files contain no test artifacts.
```

## remediation-api-unit-fixture-failure

Original capture: `remediation-api-unit-fixture-failure.txt`. Bytes: 2251. SHA-256: `fac070620c4e821981eb4565154fade6381cdfdb2719c257ac37dca3c971763b`.

```text
$ vitest run --config vitest.config.ts

 RUN  v4.1.10 [repository]/apps/api

 ❯ src/middlewares/error-handler.middleware.test.ts (2 tests | 2 failed) 16ms
     × classifies Zod errors outside request validation as internal bugs 14ms
     × logs only allowlisted diagnostics for unknown errors 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/middlewares/error-handler.middleware.test.ts > errorHandlerMiddleware > classifies Zod errors outside request validation as internal bugs
TypeError: Cannot read properties of undefined (reading 'split')
 ❯ publicContentRouteIdentity src/infrastructure/logger/request-sanitizer.ts:24:22
     22|   value: string,
     23| ): string | undefined => {
     24|   const path = value.split(/[?#]/u, 1)[0] ?? "";
       |                      ^
     25|   const prefix = `${appConfig.apiPrefix}/content`;
     26|   const normalizedPath = path.toLowerCase();
 ❯ errorHandlerMiddleware src/middlewares/error-handler.middleware.ts:44:22
 ❯ src/middlewares/error-handler.middleware.test.ts:25:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/middlewares/error-handler.middleware.test.ts > errorHandlerMiddleware > logs only allowlisted diagnostics for unknown errors
TypeError: Cannot read properties of undefined (reading 'split')
 ❯ publicContentRouteIdentity src/infrastructure/logger/request-sanitizer.ts:24:22
     22|   value: string,
     23| ): string | undefined => {
     24|   const path = value.split(/[?#]/u, 1)[0] ?? "";
       |                      ^
     25|   const prefix = `${appConfig.apiPrefix}/content`;
     26|   const normalizedPath = path.toLowerCase();
 ❯ errorHandlerMiddleware src/middlewares/error-handler.middleware.ts:44:22
 ❯ src/middlewares/error-handler.middleware.test.ts:60:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed | 25 passed (26)
      Tests  2 failed | 152 passed (154)
   Start at  09:23:44
   Duration  2.93s (transform 2.09s, setup 593ms, import 6.83s, tests 3.79s, environment 7ms)

[repository]/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 test: `vitest run --config vitest.config.ts`
Exit status 1
```

## remediation-before-error-ownership-verify

Original capture: `remediation-before-error-ownership-verify.txt`. Bytes: 27878. SHA-256: `9ed8fe1eaebf5aac212acd5c125f53a4ec0019573a4b0d5bab219e525897c383`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 26ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 109ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache hit, replaying logs 742a27afe205c618
@fury/contracts:lint: $ eslint .
@fury/database:lint: cache hit, replaying logs 254208cb6806329f
@fury/web:lint: cache hit, replaying logs 9ee8a05380650d80
@fury/database:lint: $ eslint .
@fury/api:lint: cache miss, executing 895e1c08bcf2c177
@fury/web:lint: $ eslint .
@fury/api:lint: $ eslint .

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    7.719s

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache hit, replaying logs 23bcd6edf7bb7dce
@fury/contracts:check-types: $ tsc --noEmit
@fury/web:check-types: cache hit, replaying logs d0b450f290b7a7bd
@fury/database:check-types: cache hit, replaying logs fd057a7cd81b1a70
@fury/web:check-types: $ tsc --noEmit
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 88ms
@fury/database:check-types:
@fury/api:check-types: cache miss, executing cb692e3ebcadf962
@fury/api:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    1.909s

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:test: cache hit, replaying logs a9a5d239578e4928
@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 [repository]/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 3ms
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 4ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 5ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 6ms
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 22ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  17:33:49
@fury/contracts:test:    Duration  196ms (transform 164ms, setup 0ms, import 383ms, tests 40ms, environment 0ms)
@fury/contracts:test:
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:test: cache hit, replaying logs dc336b5a4416649d
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/web:test:
@fury/web:test:  RUN  v4.1.10 [repository]/apps/web
@fury/web:test:
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 434ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 416ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 434ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 507ms
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 732ms
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 735ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 790ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 1776ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 352ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 548ms
@fury/database:test: cache hit, replaying logs 432118bba498c41d
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 376ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (6 tests) 427ms
@fury/web:test:      ✓ uses the illustrated-work template with text-specific routes and labels  401ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (10 tests) 456ms
@fury/web:test:      ✓ renders real previous and next links for a paginated result  449ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 716ms
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/database:test:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 3ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 116ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  18:41:20
@fury/database:test:    Duration  418ms (transform 105ms, setup 0ms, import 210ms, tests 119ms, environment 0ms)
@fury/database:test:
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 423ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 1628ms
@fury/web:test:      ✓ loads persisted categories, searches on the server, and shows filtered empty state  300ms
@fury/web:test:      ✓ changes pages through the server query and supports Escape focus return  372ms
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 392ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 514ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests) 3908ms
@fury/web:test:      ✓ checks an unknown edit acknowledgement before allowing another save  404ms
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 446ms
@fury/web:test:      ✓ renders the real session identity with fixture product summaries and valid links  400ms
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 953ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  414ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 1194ms
@fury/web:test:      ✓ opens create gift dialog and creates a new gift design  447ms
@fury/web:test:  ✓ src/features/story/routing.test.tsx (6 tests) 961ms
@fury/web:test:      ✓ keeps chapter links under the current story 1  586ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 277ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 336ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 307ms
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 358ms
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 273ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 314ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 277ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 501ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 169ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 296ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 175ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 308ms
@fury/web:test:      ✓ renders heading structure, legal draft approval note, and sections  306ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 224ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 153ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 217ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 158ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 117ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (14 tests) 1271ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 109ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 876ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 138ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 143ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 197ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (4 tests) 177ms
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 824ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 37ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 82ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 160ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 53ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 54ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 17ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 44ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 42ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 25ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 26ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 23ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 52ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 16ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 9ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 6ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (8 tests) 56ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (4 tests) 10ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 4ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (3 tests) 4ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 2ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 3ms
@fury/web:test:
@fury/web:test:  Test Files  72 passed (72)
@fury/web:test:       Tests  474 passed (474)
@fury/web:test:    Start at  09:30:17
@fury/web:test:    Duration  13.79s (transform 4.52s, setup 12.11s, import 13.79s, tests 28.05s, environment 55.28s)
@fury/web:test:
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test: cache miss, executing 4d8ff3f1dbe45227
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 66ms
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 92ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 8ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 11ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 27ms
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 14ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 18ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 13ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 62ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 13ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 371ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 4ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 19ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (19 tests) 7ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 8ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 7ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 5ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 5ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 2ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 4ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 3ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (16 tests) 783ms
@fury/api:test:
@fury/api:test:  Test Files  26 passed (26)
@fury/api:test:       Tests  154 passed (154)
@fury/api:test:    Start at  09:42:36
@fury/api:test:    Duration  1.19s (transform 1.33s, setup 240ms, import 3.34s, tests 1.57s, environment 2ms)
@fury/api:test:

 Tasks:    6 successful, 6 total
Cached:    5 cached, 6 total
  Time:    1.852s

$ turbo run test:integration
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test:integration in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test:integration: cache bypass, force executing 776c35b4682d8f0c
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test:integration: cache bypass, force executing 2870f5cca71d518f
@fury/api:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/database:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration:
@fury/api:test:integration:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:integration:
@fury/database:test:integration:
@fury/database:test:integration:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:integration:
@fury/api:test:integration: (node:351) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
@fury/api:test:integration: (Use `node --trace-deprecation ...` to show where the warning was created)
@fury/api:test:integration:  ✓ src/modules/content/public-content.integration.test.ts (24 tests) 5341ms
@fury/api:test:integration:      ✓ enforces every parent and Chapter visibility-state combination  325ms
@fury/api:test:integration:      ✓ keeps deterministic publication/title ties, distinct bounded pages and truthful overruns  347ms
@fury/api:test:integration:      ✓ projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works  539ms
@fury/api:test:integration:      ✓ exports all eligible canonical slugs across bounded batches without private IDs or writes  1945ms
@fury/api:test:integration:  ✓ src/content.integration.test.ts (37 tests) 4520ms
@fury/api:test:integration:      ✓ serves strict detail and optional background bytes without private data or stale visibility  302ms
@fury/api:test:integration:      ✓ keeps every management family server-authoritative before lookup  483ms
@fury/api:test:integration:      ✓ returns the central rate-limit envelope with request identity  365ms
@fury/api:test:integration:  ✓ src/modules/media/media.service.integration.test.ts (12 tests) 1189ms
@fury/database:test:integration:  ✓ tests/integration/migration.integration.test.ts (6 tests) 12627ms
@fury/database:test:integration:      ✓ cascades refresh records and deploys idempotently  958ms
@fury/database:test:integration:      ✓ retires legacy phone after a populated P01 upgrade without losing account or session data  11536ms
@fury/api:test:integration:  ✓ src/modules/content/work-management.integration.test.ts (16 tests) 1092ms
@fury/api:test:integration:  ✓ src/modules/content/content-management.integration.test.ts (18 tests) 1049ms
@fury/api:test:integration:  ✓ src/media.integration.test.ts (14 tests) 838ms
@fury/api:test:integration:  ✓ src/app.integration.test.ts (14 tests) 229ms
@fury/api:test:integration:  ✓ src/modules/content/category-management.integration.test.ts (9 tests) 456ms
@fury/api:test:integration:  ✓ src/modules/content/publication-management.integration.test.ts (4 tests) 203ms
@fury/api:test:integration:  ✓ src/modules/media/media.reconcile.integration.test.ts (4 tests) 320ms
@fury/api:test:integration:  ✓ src/modules/auth/auth.service.integration.test.ts (6 tests) 107ms
@fury/api:test:integration:
@fury/api:test:integration:  Test Files  11 passed (11)
@fury/api:test:integration:       Tests  158 passed (158)
@fury/api:test:integration:    Start at  09:42:38
@fury/api:test:integration:    Duration  21.99s (transform 525ms, setup 20ms, import 980ms, tests 15.34s, environment 0ms)
@fury/api:test:integration:
@fury/database:test:integration:  ✓ tests/integration/chapter-upgrade.integration.test.ts (2 tests) 10983ms
@fury/database:test:integration:      ✓ preserves populated P01–P03 rows through failed, recovered, and repeated expand deploys  10972ms
@fury/database:test:integration:  ✓ tests/integration/content-domain.integration.test.ts (22 tests) 819ms
@fury/database:test:integration:  ✓ tests/integration/media-domain.integration.test.ts (5 tests) 185ms
@fury/database:test:integration:  ✓ tests/integration/media-recovery.integration.test.ts (1 test) 12ms
@fury/database:test:integration:
@fury/database:test:integration:  Test Files  5 passed (5)
@fury/database:test:integration:       Tests  36 passed (36)
@fury/database:test:integration:    Start at  09:42:38
@fury/database:test:integration:    Duration  30.39s (transform 84ms, setup 0ms, import 123ms, tests 24.63s, environment 0ms)
@fury/database:test:integration:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    31.245s

$ turbo run build
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running build in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:build: cache miss, executing f7d6dbe044ab63b1
@fury/web:build: cache hit, replaying logs eb613465a1351aec
@fury/web:build: $ next build --webpack
@fury/web:build: ▲ Next.js 16.2.12 (webpack)
@fury/web:build:
@fury/web:build:   Creating an optimized production build ...
@fury/web:build: ✓ Compiled successfully in 5.9s
@fury/web:build:   Running TypeScript ...
@fury/web:build:   Finished TypeScript in 8.3s ...
@fury/web:build:   Collecting page data using 9 workers ...
@fury/web:build:   Generating static pages using 9 workers (0/32) ...
@fury/web:build:   Generating static pages using 9 workers (8/32)
@fury/web:build:   Generating static pages using 9 workers (16/32)
@fury/web:build:   Generating static pages using 9 workers (24/32)
@fury/web:build: ✓ Generating static pages using 9 workers (32/32) in 325ms
@fury/web:build:   Finalizing page optimization ...
@fury/web:build:   Collecting build traces ...
@fury/web:build:
@fury/web:build: Route (app)
@fury/web:build: ┌ ○ /
@fury/web:build: ├ ○ /_not-found
@fury/web:build: ├ ○ /admin
@fury/web:build: ├ ○ /admin/ads
@fury/web:build: ├ ○ /admin/categories
@fury/web:build: ├ ○ /admin/comments
@fury/web:build: ├ ○ /admin/contact
@fury/web:build: ├ ƒ /admin/contact/[messageId]
@fury/web:build: ├ ○ /admin/dashboard
@fury/web:build: ├ ○ /admin/gifts
@fury/web:build: ├ ○ /admin/gifts/grants
@fury/web:build: ├ ○ /admin/reports
@fury/web:build: ├ ○ /admin/users
@fury/web:build: ├ ƒ /admin/users/[userId]
@fury/web:build: ├ ○ /admin/works
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/new
@fury/web:build: ├ ƒ /admin/works/[workId]/edit
@fury/web:build: ├ ○ /admin/works/new
@fury/web:build: ├ ○ /auth/forgot-password
@fury/web:build: ├ ○ /auth/login
@fury/web:build: ├ ○ /auth/register
@fury/web:build: ├ ○ /auth/reset-password
@fury/web:build: ├ ○ /auth/verify-email
@fury/web:build: ├ ○ /categories
@fury/web:build: ├ ○ /contact
@fury/web:build: ├ ○ /copyright
@fury/web:build: ├ ○ /dashboard
@fury/web:build: ├ ƒ /discover
@fury/web:build: ├ ○ /library
@fury/web:build: ├ ○ /privacy
@fury/web:build: ├ ƒ /report-issue
@fury/web:build: ├ ○ /settings
@fury/web:build: ├ ƒ /stories
@fury/web:build: ├ ƒ /story/[id]
@fury/web:build: ├ ƒ /story/[id]/chapter/[chapterId]
@fury/web:build: └ ○ /terms
@fury/web:build:
@fury/web:build:
@fury/web:build: ○  (Static)   prerendered as static content
@fury/web:build: ƒ  (Dynamic)  server-rendered on demand
@fury/web:build:
@fury/api:build: $ pnpm clean && tsc -p tsconfig.build.json
@fury/api:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    3.354s

$ node scripts/assert-build-output.mjs
Build output verified: 6 required entry artifacts present; 384 emitted files contain no test artifacts.
```

## remediation-contracts-fresh

Original capture: `remediation-contracts-fresh.txt`. Bytes: 258. SHA-256: `837d9cfd92e05fd5fa422c606ff413b1efc80662d5d312778b1179bbf673210b`.

```text
$ vitest run --config vitest.config.ts

 RUN  v4.1.10 [repository]/packages/contracts


 Test Files  5 passed (5)
      Tests  117 passed (117)
   Start at  09:33:57
   Duration  308ms (transform 277ms, setup 0ms, import 593ms, tests 70ms, environment 0ms)

```

## remediation-database-unit-fresh

Original capture: `remediation-database-unit-fresh.txt`. Bytes: 256. SHA-256: `8cb0316cd13cad02d3eb8237d9543fcc9d3b961516cccaf9c54532cb86d3aff8`.

```text
$ vitest run --config vitest.config.ts

 RUN  v4.1.10 [repository]/packages/database


 Test Files  2 passed (2)
      Tests  10 passed (10)
   Start at  09:33:58
   Duration  606ms (transform 185ms, setup 0ms, import 371ms, tests 148ms, environment 0ms)

```

## remediation-error-integration

Original capture: `remediation-error-integration.txt`. Bytes: 556. SHA-256: `bce767baea0b33a9fb268013da4d1e973f231f02b70f4205e4955dfa9d4ddf8c`.

```text
$ vitest run --config vitest.integration.config.ts

 RUN  v4.1.10 [repository]/apps/api

(node:3749) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

 Test Files  11 passed (11)
      Tests  158 passed (158)
   Start at  09:52:35
   Duration  21.88s (transform 532ms, setup 23ms, import 1000ms, tests 16.16s, environment 0ms)

```

## remediation-error-types-failure

Original capture: `remediation-error-types-failure.txt`. Bytes: 308. SHA-256: `922c3dcba6b191f677211d4825a5a48029ec8f2bfc19adf0bf92b9dc9d3a1656`.

```text
$ tsc --noEmit
src/modules/media/media.service.ts(236,28): error TS2304: Cannot find name 'AppError'.
src/modules/media/media.service.ts(241,11): error TS18046: 'error' is of type 'unknown'.
[repository]/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 check-types: `tsc --noEmit`
Exit status 2
```

## remediation-error-units

Original capture: `remediation-error-units.txt`. Bytes: 253. SHA-256: `f908b869ded9c6138021f5f43824ce4a842ac17086224baf289cca8cec9fc2a3`.

```text
$ vitest run --config vitest.config.ts

 RUN  v4.1.10 [repository]/apps/api


 Test Files  26 passed (26)
      Tests  154 passed (154)
   Start at  09:52:25
   Duration  1.27s (transform 1.27s, setup 282ms, import 3.45s, tests 1.62s, environment 2ms)

```

## remediation-final-verify

Original capture: `remediation-final-verify.txt`. Bytes: 28389. SHA-256: `4fa1ec95c4693d92810fef0fe7abc943e827376ebe6d78c5f22167d563d8daa5`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 24ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 127ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache hit, replaying logs 742a27afe205c618
@fury/contracts:lint: $ eslint .
@fury/web:lint: cache hit, replaying logs 9ee8a05380650d80
@fury/database:lint: cache hit, replaying logs 254208cb6806329f
@fury/database:lint: $ eslint .
@fury/web:lint: $ eslint .
@fury/api:lint: cache miss, executing 60c0bf312b60b446
@fury/api:lint: $ eslint .

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    8.824s

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache hit, replaying logs 23bcd6edf7bb7dce
@fury/contracts:check-types: $ tsc --noEmit
@fury/database:check-types: cache hit, replaying logs fd057a7cd81b1a70
@fury/web:check-types: cache hit, replaying logs d0b450f290b7a7bd
@fury/web:check-types: $ tsc --noEmit
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 88ms
@fury/database:check-types:
@fury/api:check-types: cache miss, executing 907850ebae949b45
@fury/api:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    1.521s

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:test: cache hit, replaying logs a9a5d239578e4928
@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 [repository]/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 3ms
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 4ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 5ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 6ms
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 22ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  17:33:49
@fury/contracts:test:    Duration  196ms (transform 164ms, setup 0ms, import 383ms, tests 40ms, environment 0ms)
@fury/contracts:test:
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:test: cache hit, replaying logs dc336b5a4416649d
@fury/database:test: cache hit, replaying logs 432118bba498c41d
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/database:test:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 3ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 116ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  18:41:20
@fury/database:test:    Duration  418ms (transform 105ms, setup 0ms, import 210ms, tests 119ms, environment 0ms)
@fury/database:test:
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/web:test:
@fury/web:test:  RUN  v4.1.10 [repository]/apps/web
@fury/web:test:
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 434ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 416ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 434ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 507ms
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 732ms
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 735ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 790ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 1776ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 352ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 548ms
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 376ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (6 tests) 427ms
@fury/web:test:      ✓ uses the illustrated-work template with text-specific routes and labels  401ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (10 tests) 456ms
@fury/web:test:      ✓ renders real previous and next links for a paginated result  449ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 716ms
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 423ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 1628ms
@fury/web:test:      ✓ loads persisted categories, searches on the server, and shows filtered empty state  300ms
@fury/web:test:      ✓ changes pages through the server query and supports Escape focus return  372ms
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 392ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 514ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests) 3908ms
@fury/web:test:      ✓ checks an unknown edit acknowledgement before allowing another save  404ms
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 446ms
@fury/web:test:      ✓ renders the real session identity with fixture product summaries and valid links  400ms
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 953ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  414ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 1194ms
@fury/web:test:      ✓ opens create gift dialog and creates a new gift design  447ms
@fury/web:test:  ✓ src/features/story/routing.test.tsx (6 tests) 961ms
@fury/web:test:      ✓ keeps chapter links under the current story 1  586ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 277ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 336ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 307ms
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 358ms
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 273ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 314ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 277ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 501ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 169ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 296ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 175ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 308ms
@fury/web:test:      ✓ renders heading structure, legal draft approval note, and sections  306ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 224ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 153ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 217ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 158ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 117ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (14 tests) 1271ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 109ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 876ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 138ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 143ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 197ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (4 tests) 177ms
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 824ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 37ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 82ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 160ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 53ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 54ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 17ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 44ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 42ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 25ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 26ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 23ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 52ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 16ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 9ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 6ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (8 tests) 56ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (4 tests) 10ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 4ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (3 tests) 4ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 2ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 3ms
@fury/web:test:
@fury/web:test:  Test Files  72 passed (72)
@fury/web:test:       Tests  474 passed (474)
@fury/web:test:    Start at  09:30:17
@fury/web:test:    Duration  13.79s (transform 4.52s, setup 12.11s, import 13.79s, tests 28.05s, environment 55.28s)
@fury/web:test:
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test: cache miss, executing d88ff5c362efdf65
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (19 tests) 11ms
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 58ms
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 121ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 9ms
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 20ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 40ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 24ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 31ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 42ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 57ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 525ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 8ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 12ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 17ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 5ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 14ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 12ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 6ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 6ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 4ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 6ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 3ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 6ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (16 tests) 1021ms
@fury/api:test:
@fury/api:test:  Test Files  26 passed (26)
@fury/api:test:       Tests  154 passed (154)
@fury/api:test:    Start at  09:54:10
@fury/api:test:    Duration  1.93s (transform 2.76s, setup 341ms, import 6.33s, tests 2.07s, environment 2ms)
@fury/api:test:

 Tasks:    6 successful, 6 total
Cached:    5 cached, 6 total
  Time:    2.754s

$ turbo run test:integration
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test:integration in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test:integration: cache bypass, force executing 776c35b4682d8f0c
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test:integration: cache bypass, force executing 049596327f6943fe
@fury/api:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/database:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration:
@fury/api:test:integration:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:integration:
@fury/database:test:integration:
@fury/database:test:integration:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:integration:
@fury/api:test:integration: (node:4456) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
@fury/api:test:integration: (Use `node --trace-deprecation ...` to show where the warning was created)
@fury/api:test:integration:  ✓ src/modules/content/public-content.integration.test.ts (24 tests) 7221ms
@fury/api:test:integration:      ✓ enforces every parent and Chapter visibility-state combination  322ms
@fury/api:test:integration:      ✓ keeps deterministic publication/title ties, distinct bounded pages and truthful overruns  520ms
@fury/api:test:integration:      ✓ builds bounded saved-order home sections and the first three populated suggestion tabs  459ms
@fury/api:test:integration:      ✓ bounds and orders latest releases across the full eligible Chapter set  345ms
@fury/api:test:integration:      ✓ projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works  621ms
@fury/api:test:integration:      ✓ exports all eligible canonical slugs across bounded batches without private IDs or writes  2895ms
@fury/api:test:integration:  ✓ src/content.integration.test.ts (37 tests) 5679ms
@fury/api:test:integration:      ✓ serves anonymous catalog and work cover reads with public authority, safe failures and no writes  308ms
@fury/api:test:integration:      ✓ serves strict detail and optional background bytes without private data or stale visibility  398ms
@fury/api:test:integration:      ✓ keeps every management family server-authoritative before lookup  612ms
@fury/api:test:integration:      ✓ returns the central rate-limit envelope with request identity  524ms
@fury/api:test:integration:      ✓ publishes allowlisted metadata credential-free and hides it identically  474ms
@fury/api:test:integration:  ✓ src/modules/media/media.service.integration.test.ts (12 tests) 1156ms
@fury/database:test:integration:  ✓ tests/integration/migration.integration.test.ts (6 tests) 14886ms
@fury/database:test:integration:      ✓ cascades refresh records and deploys idempotently  1211ms
@fury/database:test:integration:      ✓ retires legacy phone after a populated P01 upgrade without losing account or session data  13526ms
@fury/api:test:integration:  ✓ src/modules/content/work-management.integration.test.ts (16 tests) 1119ms
@fury/api:test:integration:  ✓ src/modules/content/content-management.integration.test.ts (18 tests) 1147ms
@fury/api:test:integration:  ✓ src/media.integration.test.ts (14 tests) 1085ms
@fury/api:test:integration:  ✓ src/modules/content/category-management.integration.test.ts (9 tests) 729ms
@fury/api:test:integration:  ✓ src/modules/media/media.reconcile.integration.test.ts (4 tests) 437ms
@fury/api:test:integration:  ✓ src/app.integration.test.ts (14 tests) 247ms
@fury/api:test:integration:  ✓ src/modules/content/publication-management.integration.test.ts (4 tests) 201ms
@fury/api:test:integration:  ✓ src/modules/auth/auth.service.integration.test.ts (6 tests) 109ms
@fury/api:test:integration:
@fury/api:test:integration:  Test Files  11 passed (11)
@fury/api:test:integration:       Tests  158 passed (158)
@fury/api:test:integration:    Start at  09:54:13
@fury/api:test:integration:    Duration  25.52s (transform 661ms, setup 24ms, import 1.25s, tests 19.13s, environment 0ms)
@fury/api:test:integration:
@fury/database:test:integration:  ✓ tests/integration/chapter-upgrade.integration.test.ts (2 tests) 12158ms
@fury/database:test:integration:      ✓ preserves populated P01–P03 rows through failed, recovered, and repeated expand deploys  12147ms
@fury/database:test:integration:  ✓ tests/integration/content-domain.integration.test.ts (22 tests) 825ms
@fury/database:test:integration:  ✓ tests/integration/media-domain.integration.test.ts (5 tests) 176ms
@fury/database:test:integration:  ✓ tests/integration/media-recovery.integration.test.ts (1 test) 15ms
@fury/database:test:integration:
@fury/database:test:integration:  Test Files  5 passed (5)
@fury/database:test:integration:       Tests  36 passed (36)
@fury/database:test:integration:    Start at  09:54:13
@fury/database:test:integration:    Duration  34.36s (transform 94ms, setup 0ms, import 135ms, tests 28.06s, environment 0ms)
@fury/database:test:integration:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    35.226s

$ turbo run build
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running build in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:build: cache miss, executing ef841b8af76ea26b
@fury/web:build: cache hit, replaying logs eb613465a1351aec
@fury/web:build: $ next build --webpack
@fury/web:build: ▲ Next.js 16.2.12 (webpack)
@fury/web:build:
@fury/web:build:   Creating an optimized production build ...
@fury/web:build: ✓ Compiled successfully in 5.9s
@fury/web:build:   Running TypeScript ...
@fury/web:build:   Finished TypeScript in 8.3s ...
@fury/web:build:   Collecting page data using 9 workers ...
@fury/web:build:   Generating static pages using 9 workers (0/32) ...
@fury/web:build:   Generating static pages using 9 workers (8/32)
@fury/web:build:   Generating static pages using 9 workers (16/32)
@fury/web:build:   Generating static pages using 9 workers (24/32)
@fury/web:build: ✓ Generating static pages using 9 workers (32/32) in 325ms
@fury/web:build:   Finalizing page optimization ...
@fury/web:build:   Collecting build traces ...
@fury/web:build:
@fury/web:build: Route (app)
@fury/web:build: ┌ ○ /
@fury/web:build: ├ ○ /_not-found
@fury/web:build: ├ ○ /admin
@fury/web:build: ├ ○ /admin/ads
@fury/web:build: ├ ○ /admin/categories
@fury/web:build: ├ ○ /admin/comments
@fury/web:build: ├ ○ /admin/contact
@fury/web:build: ├ ƒ /admin/contact/[messageId]
@fury/web:build: ├ ○ /admin/dashboard
@fury/web:build: ├ ○ /admin/gifts
@fury/web:build: ├ ○ /admin/gifts/grants
@fury/web:build: ├ ○ /admin/reports
@fury/web:build: ├ ○ /admin/users
@fury/web:build: ├ ƒ /admin/users/[userId]
@fury/web:build: ├ ○ /admin/works
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/new
@fury/web:build: ├ ƒ /admin/works/[workId]/edit
@fury/web:build: ├ ○ /admin/works/new
@fury/web:build: ├ ○ /auth/forgot-password
@fury/web:build: ├ ○ /auth/login
@fury/web:build: ├ ○ /auth/register
@fury/web:build: ├ ○ /auth/reset-password
@fury/web:build: ├ ○ /auth/verify-email
@fury/web:build: ├ ○ /categories
@fury/web:build: ├ ○ /contact
@fury/web:build: ├ ○ /copyright
@fury/web:build: ├ ○ /dashboard
@fury/web:build: ├ ƒ /discover
@fury/web:build: ├ ○ /library
@fury/web:build: ├ ○ /privacy
@fury/web:build: ├ ƒ /report-issue
@fury/web:build: ├ ○ /settings
@fury/web:build: ├ ƒ /stories
@fury/web:build: ├ ƒ /story/[id]
@fury/web:build: ├ ƒ /story/[id]/chapter/[chapterId]
@fury/web:build: └ ○ /terms
@fury/web:build:
@fury/web:build:
@fury/web:build: ○  (Static)   prerendered as static content
@fury/web:build: ƒ  (Dynamic)  server-rendered on demand
@fury/web:build:
@fury/api:build: $ pnpm clean && tsc -p tsconfig.build.json
@fury/api:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    3.277s

$ node scripts/assert-build-output.mjs
Build output verified: 6 required entry artifacts present; 386 emitted files contain no test artifacts.
```

## remediation-first-verify

Original capture: `remediation-first-verify.txt`. Bytes: 28238. SHA-256: `34ae35685f2d55c6779509b5bcbdc6984b835e5467075e9c27017ef269c65b30`. Display line endings normalized; exact bytes are in the index.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 25ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 99ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache hit, replaying logs 742a27afe205c618
@fury/contracts:lint: $ eslint .
@fury/web:lint: cache miss, executing 9ee8a05380650d80
@fury/database:lint: cache hit, replaying logs 254208cb6806329f
@fury/database:lint: $ eslint .
@fury/api:lint: cache miss, executing 9b82a5b4e4e9c901
@fury/api:lint: $ eslint .
@fury/web:lint: $ eslint .

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    21.322s

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache hit, replaying logs 23bcd6edf7bb7dce
@fury/contracts:check-types: $ tsc --noEmit
@fury/web:check-types: cache miss, executing d0b450f290b7a7bd
@fury/database:check-types: cache hit, replaying logs fd057a7cd81b1a70
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 88ms
@fury/database:check-types:
@fury/api:check-types: cache miss, executing 68ee53363d2e6351
@fury/api:check-types: $ tsc --noEmit
@fury/web:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    2.511s

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:test: cache hit, replaying logs a9a5d239578e4928
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 [repository]/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 3ms
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 4ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 5ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 6ms
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 22ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  17:33:49
@fury/contracts:test:    Duration  196ms (transform 164ms, setup 0ms, import 383ms, tests 40ms, environment 0ms)
@fury/contracts:test:
@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:test: cache miss, executing dc336b5a4416649d
@fury/database:test: cache hit, replaying logs 432118bba498c41d
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/database:test:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 3ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 116ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  18:41:20
@fury/database:test:    Duration  418ms (transform 105ms, setup 0ms, import 210ms, tests 119ms, environment 0ms)
@fury/database:test:
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test: cache miss, executing 7c446207483ef8b3
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:
@fury/web:test:
@fury/web:test:  RUN  v4.1.10 [repository]/apps/web
@fury/web:test:
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 13ms
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 58ms
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 94ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 62ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 31ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 32ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 471ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 13ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 8ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 11ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 45ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 15ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 9ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (19 tests) 8ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 6ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 9ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 6ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 6ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 7ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 5ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 4ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 4ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 11ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (16 tests) 1662ms
@fury/api:test:
@fury/api:test:  Test Files  26 passed (26)
@fury/api:test:       Tests  154 passed (154)
@fury/api:test:    Start at  09:30:17
@fury/api:test:    Duration  2.41s (transform 2.72s, setup 326ms, import 7.55s, tests 2.60s, environment 6ms)
@fury/api:test:
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 434ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 416ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 434ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 507ms
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 732ms
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 735ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 790ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 1776ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 352ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 548ms
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 376ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (6 tests) 427ms
@fury/web:test:      ✓ uses the illustrated-work template with text-specific routes and labels  401ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (10 tests) 456ms
@fury/web:test:      ✓ renders real previous and next links for a paginated result  449ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 716ms
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 423ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 1628ms
@fury/web:test:      ✓ loads persisted categories, searches on the server, and shows filtered empty state  300ms
@fury/web:test:      ✓ changes pages through the server query and supports Escape focus return  372ms
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 392ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 514ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests) 3908ms
@fury/web:test:      ✓ checks an unknown edit acknowledgement before allowing another save  404ms
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 446ms
@fury/web:test:      ✓ renders the real session identity with fixture product summaries and valid links  400ms
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 953ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  414ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 1194ms
@fury/web:test:      ✓ opens create gift dialog and creates a new gift design  447ms
@fury/web:test:  ✓ src/features/story/routing.test.tsx (6 tests) 961ms
@fury/web:test:      ✓ keeps chapter links under the current story 1  586ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 277ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 336ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 307ms
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 358ms
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 273ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 314ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 277ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 501ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 169ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 296ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 175ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 308ms
@fury/web:test:      ✓ renders heading structure, legal draft approval note, and sections  306ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 224ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 153ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 217ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 158ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 117ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (14 tests) 1271ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 109ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 876ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 138ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 143ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 197ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (4 tests) 177ms
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 824ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 37ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 82ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 160ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 53ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 54ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 17ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 44ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 42ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 25ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 26ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 23ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 52ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 16ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 9ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 6ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (8 tests) 56ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (4 tests) 10ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 4ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (3 tests) 4ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 2ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 3ms
@fury/web:test:
@fury/web:test:  Test Files  72 passed (72)
@fury/web:test:       Tests  474 passed (474)
@fury/web:test:    Start at  09:30:17
@fury/web:test:    Duration  13.79s (transform 4.52s, setup 12.11s, import 13.79s, tests 28.05s, environment 55.28s)
@fury/web:test:

 Tasks:    6 successful, 6 total
Cached:    4 cached, 6 total
  Time:    14.569s

$ turbo run test:integration
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test:integration in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test:integration: cache bypass, force executing 776c35b4682d8f0c
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test:integration: cache bypass, force executing fc56e0a7739a8feb
@fury/api:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/database:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration:
@fury/api:test:integration:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:integration:
@fury/database:test:integration:
@fury/database:test:integration:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:integration:
@fury/api:test:integration: (node:94032) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
@fury/api:test:integration: (Use `node --trace-deprecation ...` to show where the warning was created)
@fury/api:test:integration:  ✓ src/modules/content/public-content.integration.test.ts (24 tests) 6433ms
@fury/api:test:integration:      ✓ enforces every parent and Chapter visibility-state combination  364ms
@fury/api:test:integration:      ✓ keeps deterministic publication/title ties, distinct bounded pages and truthful overruns  348ms
@fury/api:test:integration:      ✓ builds bounded saved-order home sections and the first three populated suggestion tabs  313ms
@fury/api:test:integration:      ✓ projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works  541ms
@fury/api:test:integration:      ✓ exports all eligible canonical slugs across bounded batches without private IDs or writes  2590ms
@fury/api:test:integration:  ✓ src/modules/content/work-management.integration.test.ts (16 tests) 1505ms
@fury/api:test:integration:  ✓ src/modules/media/media.service.integration.test.ts (12 tests) 1384ms
@fury/api:test:integration:  ✓ src/modules/content/content-management.integration.test.ts (18 tests) 1233ms
@fury/api:test:integration:  ✓ src/media.integration.test.ts (14 tests) 1112ms
@fury/api:test:integration:  ✓ src/modules/content/category-management.integration.test.ts (9 tests) 592ms
@fury/database:test:integration:  ✓ tests/integration/migration.integration.test.ts (6 tests) 14670ms
@fury/database:test:integration:      ✓ cascades refresh records and deploys idempotently  1172ms
@fury/database:test:integration:      ✓ retires legacy phone after a populated P01 upgrade without losing account or session data  13318ms
@fury/api:test:integration:  ✓ src/content.integration.test.ts (37 tests) 6411ms
@fury/api:test:integration:      ✓ serves strict detail and optional background bytes without private data or stale visibility  551ms
@fury/api:test:integration:      ✓ keeps every management family server-authoritative before lookup  853ms
@fury/api:test:integration:      ✓ returns the central rate-limit envelope with request identity  711ms
@fury/api:test:integration:      ✓ serves scoped Chapter summaries with validated filters and bounded pages  313ms
@fury/api:test:integration:      ✓ publishes allowlisted metadata credential-free and hides it identically  321ms
@fury/api:test:integration:  ✓ src/modules/media/media.reconcile.integration.test.ts (4 tests) 465ms
@fury/api:test:integration:  ✓ src/app.integration.test.ts (14 tests) 339ms
@fury/api:test:integration:  ✓ src/modules/content/publication-management.integration.test.ts (4 tests) 255ms
@fury/api:test:integration:  ✓ src/modules/auth/auth.service.integration.test.ts (6 tests) 126ms
@fury/api:test:integration:
@fury/api:test:integration:  Test Files  11 passed (11)
@fury/api:test:integration:       Tests  158 passed (158)
@fury/api:test:integration:    Start at  09:30:32
@fury/api:test:integration:    Duration  27.73s (transform 676ms, setup 24ms, import 1.24s, tests 19.86s, environment 0ms)
@fury/api:test:integration:
@fury/database:test:integration:  ✓ tests/integration/chapter-upgrade.integration.test.ts (2 tests) 13020ms
@fury/database:test:integration:      ✓ preserves populated P01–P03 rows through failed, recovered, and repeated expand deploys  13008ms
@fury/database:test:integration:  ✓ tests/integration/content-domain.integration.test.ts (22 tests) 939ms
@fury/database:test:integration:  ✓ tests/integration/media-domain.integration.test.ts (5 tests) 572ms
@fury/database:test:integration:  ✓ tests/integration/media-recovery.integration.test.ts (1 test) 33ms
@fury/database:test:integration:
@fury/database:test:integration:  Test Files  5 passed (5)
@fury/database:test:integration:       Tests  36 passed (36)
@fury/database:test:integration:    Start at  09:30:32
@fury/database:test:integration:    Duration  35.91s (transform 117ms, setup 0ms, import 171ms, tests 29.23s, environment 0ms)
@fury/database:test:integration:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    36.991s

$ turbo run build
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running build in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:build: cache miss, executing eb613465a1351aec
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:build: cache miss, executing 787a2eff7978a5c5
@fury/api:build: $ pnpm clean && tsc -p tsconfig.build.json
@fury/web:build: $ next build --webpack
@fury/api:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo
@fury/web:build: ▲ Next.js 16.2.12 (webpack)
@fury/web:build:
@fury/web:build:   Creating an optimized production build ...
@fury/web:build: ✓ Compiled successfully in 5.9s
@fury/web:build:   Running TypeScript ...
@fury/web:build:   Finished TypeScript in 8.3s ...
@fury/web:build:   Collecting page data using 9 workers ...
@fury/web:build:   Generating static pages using 9 workers (0/32) ...
@fury/web:build:   Generating static pages using 9 workers (8/32)
@fury/web:build:   Generating static pages using 9 workers (16/32)
@fury/web:build:   Generating static pages using 9 workers (24/32)
@fury/web:build: ✓ Generating static pages using 9 workers (32/32) in 325ms
@fury/web:build:   Finalizing page optimization ...
@fury/web:build:   Collecting build traces ...
@fury/web:build:
@fury/web:build: Route (app)
@fury/web:build: ┌ ○ /
@fury/web:build: ├ ○ /_not-found
@fury/web:build: ├ ○ /admin
@fury/web:build: ├ ○ /admin/ads
@fury/web:build: ├ ○ /admin/categories
@fury/web:build: ├ ○ /admin/comments
@fury/web:build: ├ ○ /admin/contact
@fury/web:build: ├ ƒ /admin/contact/[messageId]
@fury/web:build: ├ ○ /admin/dashboard
@fury/web:build: ├ ○ /admin/gifts
@fury/web:build: ├ ○ /admin/gifts/grants
@fury/web:build: ├ ○ /admin/reports
@fury/web:build: ├ ○ /admin/users
@fury/web:build: ├ ƒ /admin/users/[userId]
@fury/web:build: ├ ○ /admin/works
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/new
@fury/web:build: ├ ƒ /admin/works/[workId]/edit
@fury/web:build: ├ ○ /admin/works/new
@fury/web:build: ├ ○ /auth/forgot-password
@fury/web:build: ├ ○ /auth/login
@fury/web:build: ├ ○ /auth/register
@fury/web:build: ├ ○ /auth/reset-password
@fury/web:build: ├ ○ /auth/verify-email
@fury/web:build: ├ ○ /categories
@fury/web:build: ├ ○ /contact
@fury/web:build: ├ ○ /copyright
@fury/web:build: ├ ○ /dashboard
@fury/web:build: ├ ƒ /discover
@fury/web:build: ├ ○ /library
@fury/web:build: ├ ○ /privacy
@fury/web:build: ├ ƒ /report-issue
@fury/web:build: ├ ○ /settings
@fury/web:build: ├ ƒ /stories
@fury/web:build: ├ ƒ /story/[id]
@fury/web:build: ├ ƒ /story/[id]/chapter/[chapterId]
@fury/web:build: └ ○ /terms
@fury/web:build:
@fury/web:build:
@fury/web:build: ○  (Static)   prerendered as static content
@fury/web:build: ƒ  (Dynamic)  server-rendered on demand
@fury/web:build:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    26.672s

$ node scripts/assert-build-output.mjs
Build output verified: 6 required entry artifacts present; 384 emitted files contain no test artifacts.
```

## remediation-fixture-order-6201

Original capture: `remediation-fixture-order-6201.txt`. Bytes: 694. SHA-256: `685ef38254d37bf1e030e3a5d8f0bfd5f606b9f435ebf4dcd1e0274ac69e443b`.

```text
$ vitest run --config vitest.integration.config.ts src/content.integration.test.ts src/app.integration.test.ts --sequence.shuffle.files --sequence.seed=6201

 RUN  v4.1.10 [repository]/apps/api
      Running tests with seed "6201"

(node:99342) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

 Test Files  2 passed (2)
      Tests  51 passed (51)
   Start at  09:41:06
   Duration  11.25s (transform 432ms, setup 20ms, import 942ms, tests 5.23s, environment 0ms)

```

## remediation-fixture-order-6202

Original capture: `remediation-fixture-order-6202.txt`. Bytes: 8113. SHA-256: `e4e40baed6907ae48d173a8e7dbd7db965140e6305eeba1a3bc59b40c81eb028`.

```text
$ vitest run --config vitest.integration.config.ts src/content.integration.test.ts src/app.integration.test.ts --sequence.shuffle.files --sequence.seed=6202 --reporter=verbose

 RUN  v4.1.10 [repository]/apps/api
      Running tests with seed "6202"

(node:99529) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
 ✓ src/content.integration.test.ts > real HTTP content boundary > serves anonymous catalog and work cover reads with public authority, safe failures and no writes 425ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > serves the complete anonymous sitemap projection and fails without partial success 231ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > serves strict detail and optional background bytes without private data or stale visibility 338ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > serves a strict anonymous home aggregate with current saved publication and safe failure 215ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > validates public queries, sanitizes final request logs and sets no-store before router failures 42ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > protects public HEAD and unsupported methods across routing, early failures and final logs 38ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > keeps legacy Work and Chapter query validation private for GET and HEAD 28ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > lists saved Work summaries with combined filters and safe authority 61ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > maps a real disabled Category assignment guard to a safe content conflict 21ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > applies authentication and ADMIN denial before target lookup 19ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > requires matching CSRF for unsafe ADMIN requests 21ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > requires matching CSRF before validating category position commands 23ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > keeps every management family server-authoritative before lookup 519ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > returns the central rate-limit envelope with request identity 418ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > redacts credential sentinels from serialized logs and safe errors 20ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > creates and reconnects the foundational aggregate through ADMIN routes 188ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > serves scoped Chapter summaries with validated filters and bounded pages 189ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > keeps a private Chapter and its page asset behind ADMIN, parent, and CSRF authority 167ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > keeps Chapter-page reference writes inside Chapter save after authority 161ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > persists the complete illustrated page set only after Chapter save 225ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > returns stable immutable, validation, and authorized not-found outcomes 167ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > manages saved category filters, state, usage, and adjacent order over HTTP 96ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > returns the same success for simultaneous identical category replacements 59ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > publishes allowlisted metadata credential-free and hides it identically 240ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > rejects publishing an empty illustrated draft without an event 35ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > recovers archived Works only through draft and records real republishes 190ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > enforces text Chapter structure and preserves content after stale or invalid updates 48ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > creates and reloads a complete text document, then clears it to a private draft 59ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > distinguishes omitted illustrated pages from invalid submitted representations 43ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > completes the real ADMIN to public text-story acceptance journey 160ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > creates and reloads a rich Work draft through the ADMIN HTTP contract 100ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > rejects a published PATCH that would invalidate its cover or metadata without committing edits 98ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > publishes a complete HTTP create atomically and hides failed featured competitors 119ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > returns a safe 503 for a public read when database connectivity fails 11ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > distinguishes CSRF-rejected Work PATCH from revoked reader authority 31ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > preserves P01 minimal work writes and rejects denied or CSRF-free management 32ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > rejects invalid rich writes and rolls back wrong-class media or stale edits 151ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > fails startup for an unsafe media root 9ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > keeps liveness while readiness degrades after media storage loss 5ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > allows credentialed CORS preflight headers and rejects unknown origins 2ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > returns target-prefixed request validation errors 2ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > registers, captures verification delivery, and activates the account 17ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > allows exactly one concurrent HTTP verification request to consume a token 16ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > returns a safe 503 and rolls back registration when email delivery is unavailable 10ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > protects current-user reads and profile writes with bearer and CSRF 24ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > rotates refresh tokens once and rejects replay or a missing cookie 23ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > logs out only the current refresh session 31ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > logs out every refresh session 33ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > changes a password and revokes every refresh session 36ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > keeps recovery neutral, consumes reset once, and revokes sessions 43ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > keeps every media route behind the existing authentication boundary 7ms

 Test Files  2 passed (2)
      Tests  51 passed (51)
   Start at  09:41:39
   Duration  10.41s (transform 401ms, setup 12ms, import 823ms, tests 5.26s, environment 0ms)

```

## remediation-fixture-order-6204

Original capture: `remediation-fixture-order-6204.txt`. Bytes: 8118. SHA-256: `46798f492bcc1ae76cafb4ded16da4f520ea2540dac3557bc81e8ad5c5d94856`.

```text
$ vitest run --config vitest.integration.config.ts src/content.integration.test.ts src/app.integration.test.ts --sequence.shuffle.files --sequence.seed=6204 --reporter=verbose

 RUN  v4.1.10 [repository]/apps/api
      Running tests with seed "6204"

 ✓ src/app.integration.test.ts > real HTTP authentication boundary > fails startup for an unsafe media root 88ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > keeps liveness while readiness degrades after media storage loss 22ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > allows credentialed CORS preflight headers and rejects unknown origins 6ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > returns target-prefixed request validation errors 16ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > registers, captures verification delivery, and activates the account 63ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > allows exactly one concurrent HTTP verification request to consume a token 26ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > returns a safe 503 and rolls back registration when email delivery is unavailable 12ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > protects current-user reads and profile writes with bearer and CSRF 38ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > rotates refresh tokens once and rejects replay or a missing cookie 35ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > logs out only the current refresh session 49ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > logs out every refresh session 36ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > changes a password and revokes every refresh session 42ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > keeps recovery neutral, consumes reset once, and revokes sessions 51ms
 ✓ src/app.integration.test.ts > real HTTP authentication boundary > keeps every media route behind the existing authentication boundary 7ms
(node:99636) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
 ✓ src/content.integration.test.ts > real HTTP content boundary > serves anonymous catalog and work cover reads with public authority, safe failures and no writes 289ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > serves the complete anonymous sitemap projection and fails without partial success 211ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > serves strict detail and optional background bytes without private data or stale visibility 412ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > serves a strict anonymous home aggregate with current saved publication and safe failure 223ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > validates public queries, sanitizes final request logs and sets no-store before router failures 29ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > protects public HEAD and unsupported methods across routing, early failures and final logs 52ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > keeps legacy Work and Chapter query validation private for GET and HEAD 28ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > lists saved Work summaries with combined filters and safe authority 64ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > maps a real disabled Category assignment guard to a safe content conflict 26ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > applies authentication and ADMIN denial before target lookup 28ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > requires matching CSRF for unsafe ADMIN requests 30ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > requires matching CSRF before validating category position commands 32ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > keeps every management family server-authoritative before lookup 588ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > returns the central rate-limit envelope with request identity 428ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > redacts credential sentinels from serialized logs and safe errors 19ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > creates and reconnects the foundational aggregate through ADMIN routes 215ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > serves scoped Chapter summaries with validated filters and bounded pages 220ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > keeps a private Chapter and its page asset behind ADMIN, parent, and CSRF authority 182ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > keeps Chapter-page reference writes inside Chapter save after authority 206ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > persists the complete illustrated page set only after Chapter save 263ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > returns stable immutable, validation, and authorized not-found outcomes 212ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > manages saved category filters, state, usage, and adjacent order over HTTP 117ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > returns the same success for simultaneous identical category replacements 63ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > publishes allowlisted metadata credential-free and hides it identically 298ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > rejects publishing an empty illustrated draft without an event 40ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > recovers archived Works only through draft and records real republishes 194ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > enforces text Chapter structure and preserves content after stale or invalid updates 61ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > creates and reloads a complete text document, then clears it to a private draft 66ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > distinguishes omitted illustrated pages from invalid submitted representations 46ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > completes the real ADMIN to public text-story acceptance journey 203ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > creates and reloads a rich Work draft through the ADMIN HTTP contract 127ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > rejects a published PATCH that would invalidate its cover or metadata without committing edits 136ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > publishes a complete HTTP create atomically and hides failed featured competitors 142ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > returns a safe 503 for a public read when database connectivity fails 14ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > distinguishes CSRF-rejected Work PATCH from revoked reader authority 40ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > preserves P01 minimal work writes and rejects denied or CSRF-free management 35ms
 ✓ src/content.integration.test.ts > real HTTP content boundary > rejects invalid rich writes and rolls back wrong-class media or stale edits 157ms

 Test Files  2 passed (2)
      Tests  51 passed (51)
   Start at  09:42:01
   Duration  13.49s (transform 555ms, setup 16ms, import 1.05s, tests 6.01s, environment 0ms)

```

## remediation-head-green

Original capture: `remediation-head-green.txt`. Bytes: 664. SHA-256: `14b95cba7a08dc216dcf1cf9a2a9df51f3dd248b58f89ff72c4b24998aac19cc`.

```text
$ vitest run --config vitest.integration.config.ts src/content.integration.test.ts -t 'protects public HEAD|central rate-limit|serves anonymous catalog'

 RUN  v4.1.10 [repository]/apps/api

(node:89166) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

 Test Files  1 passed (1)
      Tests  3 passed | 33 skipped (36)
   Start at  09:19:59
   Duration  9.11s (transform 726ms, setup 14ms, import 1.32s, tests 1.73s, environment 0ms)

```

## remediation-head-invocation-failure

Original capture: `remediation-head-invocation-failure.txt`. Bytes: 3586. SHA-256: `78e4ae44295a1501dcade38d62f1553601a1b4101d94b8b273b302c7d36f79b5`.

```text

 RUN  v4.1.10 [repository]/apps/api

No test files found, exiting with code 1

filter: src/content.integration.test.ts
include: src/**/*.integration.test.ts
exclude:  **/node_modules/**, **/.git/**


⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯
Error: Command failed: [user-home]/.local/share/oscar-toolchain/node-v24.18.1-darwin-arm64/bin/node [user-home]/.local/share/oscar-toolchain/node-v24.18.1-darwin-arm64/bin/node_modules/corepack/dist/pnpm.js exec prisma migrate deploy
node:internal/modules/cjs/loader:1520
  throw err;
  ^

Error: Cannot find module '[user-home]/.local/share/oscar-toolchain/node-v24.18.1-darwin-arm64/bin/node_modules/corepack/dist/pnpm.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1517:15)
    at wrapResolveFilename (node:internal/modules/cjs/loader:1071:27)
    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1095:10)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1122:12)
    at Module._load (node:internal/modules/cjs/loader:1294:5)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v24.18.1

 ❯ Module._resolveFilename node:internal/modules/cjs/loader:1517:15
 ❯ wrapResolveFilename node:internal/modules/cjs/loader:1071:27
 ❯ defaultResolveImplForCJSLoading node:internal/modules/cjs/loader:1095:10
 ❯ resolveForCJSWithHooks node:internal/modules/cjs/loader:1122:12
 ❯ Module._load node:internal/modules/cjs/loader:1294:5
 ❯ wrapModuleLoad node:internal/modules/cjs/loader:255:19
 ❯ Module.executeUserEntryPoint [as runMain] node:internal/modules/run_main:154:5
 ❯ genericNodeError node:internal/errors:985:15
 ❯ wrappedFn node:internal/errors:539:14
 ❯ ChildProcess.exithandler node:child_process:417:12
 ❯ ChildProcess.emit node:events:509:28
 ❯ maybeClose node:internal/child_process:1124:16
 ❯ Process.ChildProcess._handle.onexit node:internal/child_process:306:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 1, killed: false, signal: null, cmd: '[user-home]/.local/share/oscar-toolchain/node-v24.18.1-darwin-arm64/bin/node [user-home]/.local/share/oscar-toolchain/node-v24.18.1-darwin-arm64/bin/node_modules/corepack/dist/pnpm.js exec prisma migrate deploy', stdout: '', stderr: 'node:internal/modules/cjs/loader:1520\n  throw err;\n  ^\n\nError: Cannot find module \'[user-home]/.local/share/oscar-toolchain/node-v24.18.1-darwin-arm64/bin/node_modules/corepack/dist/pnpm.js\'\n    at Module._resolveFilename (node:internal/modules/cjs/loader:1517:15)\n    at wrapResolveFilename (node:internal/modules/cjs/loader:1071:27)\n    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1095:10)\n    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1122:12)\n    at Module._load (node:internal/modules/cjs/loader:1294:5)\n    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)\n    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)\n    at node:internal/main/run_main_module:33:47 {\n  code: \'MODULE_NOT_FOUND\',\n  requireStack: []\n}\n\nNode.js v24.18.1\n' }



undefined
[repository]/apps/api:
[ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL] Command failed with exit code 1: vitest run --config vitest.integration.config.ts src/content.integration.test.ts -t 'protects public HEAD|central rate-limit'
```

## remediation-head-red

Original capture: `remediation-head-red.txt`. Bytes: 2570. SHA-256: `43a0f1e5ee822a40f30cd7f1fd4fa26daaffa3ab0bb6c90769eb240546393f42`.

```text
$ vitest run --config vitest.integration.config.ts src/content.integration.test.ts -t 'protects public HEAD|central rate-limit'

 RUN  v4.1.10 [repository]/apps/api

 ❯ src/content.integration.test.ts (36 tests | 2 failed | 34 skipped) 629ms
     × protects public HEAD and unsupported methods across routing, early failures and final logs 180ms
     × returns the central rate-limit envelope with request identity 446ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/content.integration.test.ts > real HTTP content boundary > protects public HEAD and unsupported methods across routing, early failures and final logs
AssertionError: expected undefined to be 'no-store' // Object.is equality

- Expected:
"no-store"

+ Received:
undefined

 ❯ assertHead src/content.integration.test.ts:779:49
    777|     const assertHead = (response: SupertestResponse, status: number) =…
    778|       expect(response.status).toBe(status);
    779|       expect(response.headers["cache-control"]).toBe("no-store");
       |                                                 ^
    780|       expect(response.headers["x-request-id"]).toEqual(expect.any(Stri…
    781|       expect(response.text).toBeUndefined();
 ❯ src/content.integration.test.ts:783:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/content.integration.test.ts > real HTTP content boundary > returns the central rate-limit envelope with request identity
AssertionError: expected undefined to be 'no-store' // Object.is equality

- Expected:
"no-store"

+ Received:
undefined

 ❯ src/content.integration.test.ts:1315:50
    1313|     const headLimited = await request(isolatedApp).head("/api/v1/conte…
    1314|     expect(headLimited.status).toBe(429);
    1315|     expect(headLimited.headers["cache-control"]).toBe("no-store");
       |                                                  ^
    1316|     expect(headLimited.headers["x-request-id"]).toEqual(expect.any(Str…
    1317|     expect(headLimited.text).toBeUndefined();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 34 skipped (36)
   Start at  09:19:33
   Duration  6.42s (transform 435ms, setup 11ms, import 973ms, tests 629ms, environment 0ms)

[repository]/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 test:integration: `vitest run --config vitest.integration.config.ts src/content.integration.test.ts -t 'protects public HEAD|central rate-limit'`
Exit status 1
```

## remediation-hook-stress

Original capture: `remediation-hook-stress.txt`. Bytes: 2055. SHA-256: `7b086d229fab5ca3ec6a321ae90d7a97d813a747afa9d8a1a9a85c45fe6df392`.

```text
Process seed 5201
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed=5201

 RUN  v4.1.10 [repository]/apps/web
      Running tests with seed "5201"


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  09:23:44
   Duration  4.58s (transform 261ms, setup 521ms, import 460ms, tests 1.36s, environment 2.01s)


Process seed 5202
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed=5202

 RUN  v4.1.10 [repository]/apps/web
      Running tests with seed "5202"


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  09:23:52
   Duration  3.85s (transform 315ms, setup 591ms, import 487ms, tests 1.37s, environment 1.14s)


Process seed 5203
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed=5203

 RUN  v4.1.10 [repository]/apps/web
      Running tests with seed "5203"


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  09:24:02
   Duration  17.18s (transform 1.37s, setup 2.60s, import 2.56s, tests 1.87s, environment 8.37s)


Process seed 5204
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed=5204

 RUN  v4.1.10 [repository]/apps/web
      Running tests with seed "5204"


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  09:24:23
   Duration  8.00s (transform 697ms, setup 890ms, import 1.47s, tests 1.96s, environment 2.94s)


Process seed 5205
$ vitest run --config vitest.config.ts src/features/public-catalog/hooks/public-catalog.hooks.test.tsx --sequence.shuffle --sequence.seed=5205

 RUN  v4.1.10 [repository]/apps/web
      Running tests with seed "5205"


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  09:24:35
   Duration  9.51s (transform 1.12s, setup 1.24s, import 1.34s, tests 1.94s, environment 3.80s)

```

## remediation-media-green

Original capture: `remediation-media-green.txt`. Bytes: 632. SHA-256: `342fd8e975f983eab44eaf52407ab365e3419fda4655b98266adf0f32774fb18`.

```text
$ vitest run --config vitest.integration.config.ts src/modules/media/media.service.integration.test.ts src/media.integration.test.ts

 RUN  v4.1.10 [repository]/apps/api

(node:95388) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

 Test Files  2 passed (2)
      Tests  26 passed (26)
   Start at  09:33:05
   Duration  8.52s (transform 411ms, setup 14ms, import 945ms, tests 2.93s, environment 0ms)

```

## remediation-media-import-failure

Original capture: `remediation-media-import-failure.txt`. Bytes: 4972. SHA-256: `4b03e026c235caf6adcbb842af10c7440a3537d31172cc08c84f2a11752dac5f`.

```text
$ vitest run --config vitest.integration.config.ts src/modules/media/media.service.integration.test.ts src/media.integration.test.ts

 RUN  v4.1.10 [repository]/apps/api

(node:95192) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
 ❯ src/modules/media/media.service.integration.test.ts (12 tests | 3 failed) 1477ms
     × binds, replaces, retires, and removes references with retry and stale-write safety 161ms
     × allows one concurrent replacement and reports the stale loser safely 120ms
     × keeps a published cover on retire/removal failure and advances the Work on replacement 107ms
 ❯ src/media.integration.test.ts (14 tests | 1 failed) 984ms
     × binds, replaces, protects, and retires an administrator reference through HTTP 126ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/media.integration.test.ts > private media HTTP boundary > binds, replaces, protects, and retires an administrator reference through HTTP
AssertionError: expected 500 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 500

 ❯ src/media.integration.test.ts:742:29
    740|         expectedVersion: 0,
    741|       });
    742|     expect(replaced.status).toBe(200);
       |                             ^
    743|     expect(replaced.body).toMatchObject({
    744|       data: { assetId: second.id, version: 1 },

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/modules/media/media.service.integration.test.ts > administrator media service > binds, replaces, retires, and removes references with retry and stale-write safety
ReferenceError: MediaClass is not defined
 ❯ replacement.database.$transaction.isolationLevel src/modules/media/media.service.ts:804:17
    802|           const expectedClass =
    803|             reference.slot === MediaReferenceSlot.WORK_COVER
    804|               ? MediaClass.WORK_COVER
       |                 ^
    805|               : reference.slot === MediaReferenceSlot.WORK_BACKGROUND
    806|                 ? MediaClass.WORK_BACKGROUND
 ❯ Proxy._transactionWithCallback ../../node_modules/.pnpm/@prisma+client@7.9.1_prisma@7.9.1_@types+react-dom@19.2.4_@types+react@19.2.18__@types+_7b98b6f88391e1939201dcf2048e6b10/node_modules/@prisma/client/src/runtime/getPrismaClient.ts:861:17
 ❯ MediaService.replaceReference src/modules/media/media.service.ts:754:27
 ❯ src/modules/media/media.service.integration.test.ts:582:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/modules/media/media.service.integration.test.ts > administrator media service > allows one concurrent replacement and reports the stale loser safely
AssertionError: expected [] to have a length of 1 but got +0

- Expected
+ Received

- 1
+ 0

 ❯ src/modules/media/media.service.integration.test.ts:676:7
    674|     expect(
    675|       outcomes.filter((outcome) => outcome.status === "fulfilled"),
    676|     ).toHaveLength(1);
       |       ^
    677|     const rejected = outcomes.find((outcome) => outcome.status === "re…
    678|     expect(rejected).toMatchObject({

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/modules/media/media.service.integration.test.ts > administrator media service > keeps a published cover on retire/removal failure and advances the Work on replacement
ReferenceError: MediaClass is not defined
 ❯ replacement.database.$transaction.isolationLevel src/modules/media/media.service.ts:804:17
    802|           const expectedClass =
    803|             reference.slot === MediaReferenceSlot.WORK_COVER
    804|               ? MediaClass.WORK_COVER
       |                 ^
    805|               : reference.slot === MediaReferenceSlot.WORK_BACKGROUND
    806|                 ? MediaClass.WORK_BACKGROUND
 ❯ Proxy._transactionWithCallback ../../node_modules/.pnpm/@prisma+client@7.9.1_prisma@7.9.1_@types+react-dom@19.2.4_@types+react@19.2.18__@types+_7b98b6f88391e1939201dcf2048e6b10/node_modules/@prisma/client/src/runtime/getPrismaClient.ts:861:17
 ❯ MediaService.replaceReference src/modules/media/media.service.ts:754:27
 ❯ src/modules/media/media.service.integration.test.ts:955:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  2 failed (2)
      Tests  4 failed | 22 passed (26)
   Start at  09:32:29
   Duration  9.10s (transform 413ms, setup 18ms, import 937ms, tests 2.46s, environment 0ms)

[repository]/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 test:integration: `vitest run --config vitest.integration.config.ts src/modules/media/media.service.integration.test.ts src/media.integration.test.ts`
Exit status 1
```

## remediation-routes

Original capture: `remediation-routes.txt`. Bytes: 1006. SHA-256: `e10676e7f85d9650b6b5fc48c4b10e63c60ca08aae72970988d111f7e0b3819b`.

```text
$ node scripts/check-web-routes.mjs http://127.0.0.1:4316
PASS /dashboard
PASS /library
PASS /settings
PASS /admin/ads
PASS /admin/categories
PASS /admin/comments
PASS /admin/contact/msg-1
PASS /admin/contact
PASS /admin/dashboard
PASS /admin/gifts/grants
PASS /admin/gifts
PASS /admin
PASS /admin/reports
PASS /admin/users/user-1
PASS /admin/users
PASS /admin/works/trait-hoarder/chapters/th-43/edit
PASS /admin/works/trait-hoarder/chapters/new
PASS /admin/works/trait-hoarder/chapters
PASS /admin/works/trait-hoarder/edit
PASS /admin/works/new
PASS /admin/works
PASS /auth/forgot-password
PASS /auth/login
PASS /auth/register
PASS /auth/reset-password
PASS /auth/verify-email
PASS /categories
PASS /contact
PASS /copyright
PASS /discover
PASS /
PASS /privacy
PASS /report-issue
PASS /stories
PASS /story/1/chapter/1
PASS /story/1
PASS /terms
PASS /story/trait-hoarder
PASS /story/trait-hoarder/chapter/43
PASS /story/1/chapter/2
Verified 40 existing routes and the 404 fallback at http://127.0.0.1:4316.
```

## remediation-shared-fixture-failure

Original capture: `remediation-shared-fixture-failure.txt`. Bytes: 30174. SHA-256: `cfa58b3109d0d09ab8818ce811421a8072022206267895ba2cf03992a13ba1c5`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 27ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 94ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache hit, replaying logs 742a27afe205c618
@fury/contracts:lint: $ eslint .
@fury/database:lint: cache hit, replaying logs 254208cb6806329f
@fury/web:lint: cache hit, replaying logs 9ee8a05380650d80
@fury/database:lint: $ eslint .
@fury/api:lint: cache miss, executing 8e83b53bb1a151c3
@fury/web:lint: $ eslint .
@fury/api:lint: $ eslint .

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    8.249s

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache hit, replaying logs 23bcd6edf7bb7dce
@fury/contracts:check-types: $ tsc --noEmit
@fury/web:check-types: cache hit, replaying logs d0b450f290b7a7bd
@fury/database:check-types: cache hit, replaying logs fd057a7cd81b1a70
@fury/web:check-types: $ tsc --noEmit
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 88ms
@fury/database:check-types:
@fury/api:check-types: cache miss, executing 824a40e9423f72ea
@fury/api:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    2.461s

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:test: cache hit, replaying logs a9a5d239578e4928
@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 [repository]/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 3ms
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 4ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 5ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 6ms
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 22ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  17:33:49
@fury/contracts:test:    Duration  196ms (transform 164ms, setup 0ms, import 383ms, tests 40ms, environment 0ms)
@fury/contracts:test:
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:test: cache hit, replaying logs dc336b5a4416649d
@fury/database:test: cache hit, replaying logs 432118bba498c41d
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/web:test:
@fury/database:test:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 3ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 116ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  18:41:20
@fury/database:test:    Duration  418ms (transform 105ms, setup 0ms, import 210ms, tests 119ms, environment 0ms)
@fury/database:test:
@fury/web:test:  RUN  v4.1.10 [repository]/apps/web
@fury/web:test:
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 434ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 416ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 434ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 507ms
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 732ms
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 735ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 790ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 1776ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 352ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 548ms
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 376ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (6 tests) 427ms
@fury/web:test:      ✓ uses the illustrated-work template with text-specific routes and labels  401ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (10 tests) 456ms
@fury/web:test:      ✓ renders real previous and next links for a paginated result  449ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 716ms
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 423ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 1628ms
@fury/web:test:      ✓ loads persisted categories, searches on the server, and shows filtered empty state  300ms
@fury/web:test:      ✓ changes pages through the server query and supports Escape focus return  372ms
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 392ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 514ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests) 3908ms
@fury/web:test:      ✓ checks an unknown edit acknowledgement before allowing another save  404ms
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 446ms
@fury/web:test:      ✓ renders the real session identity with fixture product summaries and valid links  400ms
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 953ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  414ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 1194ms
@fury/web:test:      ✓ opens create gift dialog and creates a new gift design  447ms
@fury/web:test:  ✓ src/features/story/routing.test.tsx (6 tests) 961ms
@fury/web:test:      ✓ keeps chapter links under the current story 1  586ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 277ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 336ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 307ms
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 358ms
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 273ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 314ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 277ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 501ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 169ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 296ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 175ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 308ms
@fury/web:test:      ✓ renders heading structure, legal draft approval note, and sections  306ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 224ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 153ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 217ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 158ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 117ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (14 tests) 1271ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 109ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 876ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 138ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 143ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 197ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (4 tests) 177ms
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 824ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 37ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 82ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 160ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 53ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 54ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 17ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 44ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 42ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 25ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 26ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 23ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 52ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 16ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 9ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 6ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (8 tests) 56ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (4 tests) 10ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 4ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (3 tests) 4ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 2ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 3ms
@fury/web:test:
@fury/web:test:  Test Files  72 passed (72)
@fury/web:test:       Tests  474 passed (474)
@fury/web:test:    Start at  09:30:17
@fury/web:test:    Duration  13.79s (transform 4.52s, setup 12.11s, import 13.79s, tests 28.05s, environment 55.28s)
@fury/web:test:
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test: cache miss, executing 1451521f243e8769
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 16ms
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 69ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 15ms
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 93ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 13ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 66ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 37ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 17ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 17ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 57ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 17ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 9ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 532ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 10ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 14ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 13ms
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (19 tests) 9ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 7ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 11ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 8ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 3ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 4ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 3ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (16 tests) 1071ms
@fury/api:test:
@fury/api:test:  Test Files  26 passed (26)
@fury/api:test:       Tests  154 passed (154)
@fury/api:test:    Start at  09:38:47
@fury/api:test:    Duration  1.64s (transform 1.89s, setup 332ms, import 4.97s, tests 2.12s, environment 2ms)
@fury/api:test:

 Tasks:    6 successful, 6 total
Cached:    5 cached, 6 total
  Time:    2.354s

$ turbo run test:integration
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test:integration in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 314cc37f49f74bce
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test:integration: cache bypass, force executing 776c35b4682d8f0c
@fury/database:build: cache hit, replaying logs 0b594fcb48ab84b7
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 85ms
@fury/database:build:
@fury/api:test:integration: cache bypass, force executing 0a625250600d89fb
@fury/api:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/database:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration:
@fury/api:test:integration:  RUN  v4.1.10 [repository]/apps/api
@fury/api:test:integration:
@fury/database:test:integration:
@fury/database:test:integration:  RUN  v4.1.10 [repository]/packages/database
@fury/database:test:integration:
@fury/api:test:integration: (node:98382) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
@fury/api:test:integration: (Use `node --trace-deprecation ...` to show where the warning was created)
@fury/api:test:integration:  ✓ src/modules/content/public-content.integration.test.ts (24 tests) 7478ms
@fury/api:test:integration:      ✓ enforces every parent and Chapter visibility-state combination  306ms
@fury/api:test:integration:      ✓ keeps deterministic publication/title ties, distinct bounded pages and truthful overruns  588ms
@fury/api:test:integration:      ✓ orders chapter-latest by eligible publication, placing chapterless works last  343ms
@fury/api:test:integration:      ✓ builds bounded saved-order home sections and the first three populated suggestion tabs  472ms
@fury/api:test:integration:      ✓ bounds and orders latest releases across the full eligible Chapter set  736ms
@fury/api:test:integration:      ✓ projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works  511ms
@fury/api:test:integration:      ✓ exports all eligible canonical slugs across bounded batches without private IDs or writes  2438ms
@fury/api:test:integration:  ✓ src/modules/media/media.service.integration.test.ts (12 tests) 1198ms
@fury/api:test:integration:  ✓ src/modules/content/work-management.integration.test.ts (16 tests) 1113ms
@fury/api:test:integration:  ✓ src/modules/content/content-management.integration.test.ts (18 tests) 1023ms
@fury/api:test:integration:  ✓ src/media.integration.test.ts (14 tests) 895ms
@fury/api:test:integration:  ✓ src/modules/content/category-management.integration.test.ts (9 tests) 448ms
@fury/api:test:integration:  ✓ src/modules/media/media.reconcile.integration.test.ts (4 tests) 324ms
@fury/database:test:integration:  ✓ tests/integration/migration.integration.test.ts (6 tests) 14216ms
@fury/database:test:integration:      ✓ cascades refresh records and deploys idempotently  1030ms
@fury/database:test:integration:      ✓ retires legacy phone after a populated P01 upgrade without losing account or session data  13033ms
@fury/api:test:integration:  ✓ src/content.integration.test.ts (37 tests) 5648ms
@fury/api:test:integration:      ✓ serves strict detail and optional background bytes without private data or stale visibility  440ms
@fury/api:test:integration:      ✓ serves a strict anonymous home aggregate with current saved publication and safe failure  319ms
@fury/api:test:integration:      ✓ keeps every management family server-authoritative before lookup  591ms
@fury/api:test:integration:      ✓ returns the central rate-limit envelope with request identity  425ms
@fury/api:test:integration:      ✓ publishes allowlisted metadata credential-free and hides it identically  330ms
@fury/api:test:integration:  ❯ src/app.integration.test.ts (14 tests | 14 failed) 132ms
@fury/api:test:integration:      × fails startup for an unsafe media root 17ms
@fury/api:test:integration:      × keeps liveness while readiness degrades after media storage loss 9ms
@fury/api:test:integration:      × allows credentialed CORS preflight headers and rejects unknown origins 10ms
@fury/api:test:integration:      × returns target-prefixed request validation errors 8ms
@fury/api:test:integration:      × registers, captures verification delivery, and activates the account 8ms
@fury/api:test:integration:      × allows exactly one concurrent HTTP verification request to consume a token 7ms
@fury/api:test:integration:      × returns a safe 503 and rolls back registration when email delivery is unavailable 7ms
@fury/api:test:integration:      × protects current-user reads and profile writes with bearer and CSRF 8ms
@fury/api:test:integration:      × rotates refresh tokens once and rejects replay or a missing cookie 8ms
@fury/api:test:integration:      × logs out only the current refresh session 8ms
@fury/api:test:integration:      × logs out every refresh session 12ms
@fury/api:test:integration:      × changes a password and revokes every refresh session 9ms
@fury/api:test:integration:      × keeps recovery neutral, consumes reset once, and revokes sessions 9ms
@fury/api:test:integration:      × keeps every media route behind the existing authentication boundary 10ms
@fury/api:test:integration:  ✓ src/modules/content/publication-management.integration.test.ts (4 tests) 345ms
@fury/api:test:integration:  ✓ src/modules/auth/auth.service.integration.test.ts (6 tests) 170ms
@fury/api:test:integration:
@fury/api:test:integration: ⎯⎯⎯⎯⎯⎯ Failed Tests 14 ⎯⎯⎯⎯⎯⎯⎯
@fury/api:test:integration:
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > fails startup for an unsafe media root
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > keeps liveness while readiness degrades after media storage loss
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > allows credentialed CORS preflight headers and rejects unknown origins
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > returns target-prefixed request validation errors
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > registers, captures verification delivery, and activates the account
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > allows exactly one concurrent HTTP verification request to consume a token
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > returns a safe 503 and rolls back registration when email delivery is unavailable
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > protects current-user reads and profile writes with bearer and CSRF
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > rotates refresh tokens once and rejects replay or a missing cookie
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > logs out only the current refresh session
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > logs out every refresh session
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > changes a password and revokes every refresh session
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > keeps recovery neutral, consumes reset once, and revokes sessions
@fury/api:test:integration:  FAIL  src/app.integration.test.ts > real HTTP authentication boundary > keeps every media route behind the existing authentication boundary
@fury/api:test:integration: PrismaClientKnownRequestError:
@fury/api:test:integration: Invalid `database.user.deleteMany()` invocation in
@fury/api:test:integration: [repository]/apps/api/src/app.integration.test.ts:136:25
@fury/api:test:integration:
@fury/api:test:integration:   133 delivered.length = 0;
@fury/api:test:integration:   134 deliveryFailure = undefined;
@fury/api:test:integration:   135 await database.refreshToken.deleteMany();
@fury/api:test:integration: → 136 await database.user.deleteMany(
@fury/api:test:integration: Database error. Code: `23001`. Message: `update or delete on table "users" violates RESTRICT setting of foreign key constraint "media_assets_uploaded_by_user_id_fkey" on table "media_assets"`
@fury/api:test:integration:  ❯ Jr.handleRequestError ../../node_modules/.pnpm/@prisma+client@7.9.1_prisma@7.9.1_@types+react-dom@19.2.4_@types+react@19.2.18__@types+_7b98b6f88391e1939201dcf2048e6b10/node_modules/@prisma/client/src/runtime/RequestHandler.ts:237:12
@fury/api:test:integration:  ❯ Jr.handleAndLogRequestError ../../node_modules/.pnpm/@prisma+client@7.9.1_prisma@7.9.1_@types+react-dom@19.2.4_@types+react@19.2.18__@types+_7b98b6f88391e1939201dcf2048e6b10/node_modules/@prisma/client/src/runtime/RequestHandler.ts:183:11
@fury/api:test:integration:  ❯ Jr.request ../../node_modules/.pnpm/@prisma+client@7.9.1_prisma@7.9.1_@types+react-dom@19.2.4_@types+react@19.2.18__@types+_7b98b6f88391e1939201dcf2048e6b10/node_modules/@prisma/client/src/runtime/RequestHandler.ts:152:11
@fury/api:test:integration:  ❯ a ../../node_modules/.pnpm/@prisma+client@7.9.1_prisma@7.9.1_@types+react-dom@19.2.4_@types+react@19.2.18__@types+_7b98b6f88391e1939201dcf2048e6b10/node_modules/@prisma/client/src/runtime/getPrismaClient.ts:1014:23
@fury/api:test:integration:  ❯ src/app.integration.test.ts:136:5
@fury/api:test:integration:     134|     deliveryFailure = undefined;
@fury/api:test:integration:     135|     await database.refreshToken.deleteMany();
@fury/api:test:integration:     136|     await database.user.deleteMany();
@fury/api:test:integration:        |     ^
@fury/api:test:integration:     137|   });
@fury/api:test:integration:     138|
@fury/api:test:integration:
@fury/api:test:integration: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/14]⎯
@fury/api:test:integration:
@fury/api:test:integration:
@fury/api:test:integration:  Test Files  1 failed | 10 passed (11)
@fury/api:test:integration:       Tests  14 failed | 144 passed (158)
@fury/api:test:integration:    Start at  09:38:51
@fury/api:test:integration:    Duration  27.75s (transform 624ms, setup 29ms, import 1.13s, tests 18.77s, environment 0ms)
@fury/api:test:integration:
@fury/api:test:integration: [ELIFECYCLE] Command failed with exit code 1.
@fury/database:test:integration: [ELIFECYCLE] Command failed with exit code 130.
@fury/api#test:integration:  ERROR  command ([repository]/apps/api) [user-home]/.local/bin/pnpm run test:integration exited (1)

 Tasks:    2 successful, 4 total
Cached:    2 cached, 4 total
  Time:    29.687s
Failed:    @fury/api#test:integration

 ERROR  run failed: command  exited (1)
[ELIFECYCLE] Command failed with exit code 1.
[ELIFECYCLE] Command failed with exit code 1.
```

## remediation-t075-green

Original capture: `remediation-t075-green.txt`. Bytes: 675. SHA-256: `69c6af84bbf9d985661e9b17e4068d12c79db7705e0f6ca2ba479ffa2dcbb98d`.

```text
$ vitest run --config vitest.integration.config.ts src/content.integration.test.ts -t 'legacy Work and Chapter query|protects public HEAD|serves anonymous catalog'

 RUN  v4.1.10 [repository]/apps/api

(node:92973) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

 Test Files  1 passed (1)
      Tests  3 passed | 34 skipped (37)
   Start at  09:28:40
   Duration  6.36s (transform 400ms, setup 16ms, import 838ms, tests 473ms, environment 0ms)

```

## remediation-t075-red

Original capture: `remediation-t075-red.txt`. Bytes: 1956. SHA-256: `8f276c7bd6fa3e77d42f17fb86fc2aff4aa39da1f3b6118c6fee703544f05ad3`.

```text
$ vitest run --config vitest.integration.config.ts src/content.integration.test.ts -t 'legacy Work and Chapter query'

 RUN  v4.1.10 [repository]/apps/api

 ❯ src/content.integration.test.ts (37 tests | 1 failed | 36 skipped) 172ms
     × keeps legacy Work and Chapter query validation private for GET and HEAD 168ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/content.integration.test.ts > real HTTP content boundary > keeps legacy Work and Chapter query validation private for GET and HEAD
AssertionError: expected '{"success":false,"statusCode":400,"co…' not to contain 'LEGACY-QUERY-PRIVATE-SENTINEL'

Expected: "LEGACY-QUERY-PRIVATE-SENTINEL"
Received: "{"success":false,"statusCode":400,"code":"VALIDATION_ERROR","message":"Request validation failed.","errors":[{"field":"query","message":"Unrecognized key: \"LEGACY-QUERY-PRIVATE-SENTINEL\""}],"requestId":"e5b661c4-cd8c-437b-b040-9ab2defb6ed8","timestamp":"2026-11-01T07:27:46.305Z","path":"/api/v1/content/works/:workSlug/chapters"}"

 ❯ src/content.integration.test.ts:893:44
    891|         const parsed = parseErrorBody(response);
    892|         expect(parsed.code).toBe(code);
    893|         expect(JSON.stringify(parsed)).not.toContain(sentinel);
       |                                            ^
    894|         expect(response.headers["cache-control"]).toBe("no-store");
    895|         if (code === "VALIDATION_ERROR") expect(parsed.errors).toEqual…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 36 skipped (37)
   Start at  09:27:40
   Duration  6.13s (transform 439ms, setup 11ms, import 879ms, tests 172ms, environment 0ms)

[repository]/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 test:integration: `vitest run --config vitest.integration.config.ts src/content.integration.test.ts -t 'legacy Work and Chapter query'`
Exit status 1
```

## remediation-t076-green

Original capture: `remediation-t076-green.txt`. Bytes: 385. SHA-256: `31b858da75f73d4c0500e28d78d28873598c0800317d3c03a7301ade0e9005f8`.

```text
$ vitest run --config vitest.integration.config.ts src/content.integration.test.ts -t 'validates public queries|protects public HEAD|legacy Work and Chapter query'

 RUN  v4.1.10 [repository]/apps/api


 Test Files  1 passed (1)
      Tests  3 passed | 34 skipped (37)
   Start at  09:37:07
   Duration  6.26s (transform 417ms, setup 11ms, import 880ms, tests 263ms, environment 0ms)

```

## remediation-t076-red

Original capture: `remediation-t076-red.txt`. Bytes: 49476. SHA-256: `0f986d43fe35b7a885e3a6a35402039e385c8459e961344276874cdff9214248`.

```text
$ vitest run --config vitest.integration.config.ts src/content.integration.test.ts -t 'validates public queries|protects public HEAD'

 RUN  v4.1.10 [repository]/apps/api

 ❯ src/content.integration.test.ts (37 tests | 2 failed | 35 skipped) 246ms
     × validates public queries, sanitizes final request logs and sets no-store before router failures 192ms
     × protects public HEAD and unsupported methods across routing, early failures and final logs 52ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/content.integration.test.ts > real HTTP content boundary > validates public queries, sanitizes final request logs and sets no-store before router failures
AssertionError: expected '{"level":40,"time":1793518592918,"pid…' not to contain 'P05-SEARCH-SENTINEL'

- Expected
+ Received

- P05-SEARCH-SENTINEL
+ {"level":40,"time":1793518592918,"pid":97215,"hostname":"[local-host]","req":{"id":"f694c051-333e-4eb6-b3c2-63a940362c50","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56480,"path":"/api/v1/content/catalog/works"},"requestId":"f694c051-333e-4eb6-b3c2-63a940362c50","code":"VALIDATION_ERROR","requestId":"f694c051-333e-4eb6-b3c2-63a940362c50","statusCode":400,"msg":"Request validation failed."}
+ {"level":30,"time":1793518592920,"pid":97215,"hostname":"[local-host]","req":{"id":"f694c051-333e-4eb6-b3c2-63a940362c50","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56480,"path":"/api/v1/content/catalog/works"},"requestId":"f694c051-333e-4eb6-b3c2-63a940362c50","res":{"statusCode":400,"headers":{"x-request-id":"f694c051-333e-4eb6-b3c2-63a940362c50","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=99; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"365","etag":"W/\"16d-XXYPMklrmF1Dqh7eusOnNzxPBFY\""}},"responseTime":6,"msg":"request completed"}
+ {"level":40,"time":1793518592926,"pid":97215,"hostname":"[local-host]","req":{"id":"17da2c3d-bca6-4b33-bb0a-2a3474882cc4","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56481,"path":"/api/v1/content/catalog/works"},"requestId":"17da2c3d-bca6-4b33-bb0a-2a3474882cc4","code":"VALIDATION_ERROR","requestId":"17da2c3d-bca6-4b33-bb0a-2a3474882cc4","statusCode":400,"msg":"Request validation failed."}
+ {"level":30,"time":1793518592926,"pid":97215,"hostname":"[local-host]","req":{"id":"17da2c3d-bca6-4b33-bb0a-2a3474882cc4","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56481,"path":"/api/v1/content/catalog/works"},"requestId":"17da2c3d-bca6-4b33-bb0a-2a3474882cc4","res":{"statusCode":400,"headers":{"x-request-id":"17da2c3d-bca6-4b33-bb0a-2a3474882cc4","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=98; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"321","etag":"W/\"141-NQWtKXFPfCwJ1UJK5SHPNxeBz2w\""}},"responseTime":1,"msg":"request completed"}
+ {"level":40,"time":1793518592928,"pid":97215,"hostname":"[local-host]","req":{"id":"454ea713-503b-410e-a137-c11a2910554f","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56482,"path":"/api/v1/content/catalog/works"},"requestId":"454ea713-503b-410e-a137-c11a2910554f","code":"VALIDATION_ERROR","requestId":"454ea713-503b-410e-a137-c11a2910554f","statusCode":400,"msg":"Request validation failed."}
+ {"level":30,"time":1793518592929,"pid":97215,"hostname":"[local-host]","req":{"id":"454ea713-503b-410e-a137-c11a2910554f","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56482,"path":"/api/v1/content/catalog/works"},"requestId":"454ea713-503b-410e-a137-c11a2910554f","res":{"statusCode":400,"headers":{"x-request-id":"454ea713-503b-410e-a137-c11a2910554f","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=97; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"312","etag":"W/\"138-KqBjalRH3/x4Msljb4ioJOF1GQQ\""}},"responseTime":1,"msg":"request completed"}
+ {"level":40,"time":1793518592930,"pid":97215,"hostname":"[local-host]","req":{"id":"e0910090-f27c-427e-bb0a-6f2d0d3d6f64","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56483,"path":"/api/v1/content/catalog/works"},"requestId":"e0910090-f27c-427e-bb0a-6f2d0d3d6f64","code":"BAD_REQUEST","requestId":"e0910090-f27c-427e-bb0a-6f2d0d3d6f64","statusCode":400,"msg":"Malformed request URL."}
+ {"level":30,"time":1793518592930,"pid":97215,"hostname":"[local-host]","req":{"id":"e0910090-f27c-427e-bb0a-6f2d0d3d6f64","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56483,"path":"/api/v1/content/catalog/works"},"requestId":"e0910090-f27c-427e-bb0a-6f2d0d3d6f64","res":{"statusCode":400,"headers":{"x-request-id":"e0910090-f27c-427e-bb0a-6f2d0d3d6f64","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=96; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"219","etag":"W/\"db-+7uvpvEzQ1Ommpp93q6R2FtXLMI\""}},"responseTime":0,"msg":"request completed"}
+ {"level":40,"time":1793518592932,"pid":97215,"hostname":"[local-host]","req":{"id":"e99378f9-3c22-42d4-bdf6-9a2f8b08914f","method":"GET","url":"/api/v1/content/works/:workSlug/cover","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56484,"path":"/api/v1/content/works/:workSlug/cover"},"requestId":"e99378f9-3c22-42d4-bdf6-9a2f8b08914f","code":"BAD_REQUEST","requestId":"e99378f9-3c22-42d4-bdf6-9a2f8b08914f","statusCode":400,"msg":"Malformed request URL."}
+ {"level":30,"time":1793518592932,"pid":97215,"hostname":"[local-host]","req":{"id":"e99378f9-3c22-42d4-bdf6-9a2f8b08914f","method":"GET","url":"/api/v1/content/works/:workSlug/cover","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56484,"path":"/api/v1/content/works/:workSlug/cover"},"requestId":"e99378f9-3c22-42d4-bdf6-9a2f8b08914f","res":{"statusCode":400,"headers":{"x-request-id":"e99378f9-3c22-42d4-bdf6-9a2f8b08914f","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=95; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"227","etag":"W/\"e3-irQbwqRdgYfgeZn/0vHOSfOSojQ\""}},"responseTime":1,"msg":"request completed"}
+ {"level":30,"time":1793518592980,"pid":97215,"hostname":"[local-host]","req":{"id":"97b5ffd8-d934-4783-9562-385da7fa807e","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","referer":"http://localhost:3000/discover?q=P05-SEARCH-SENTINEL","x-original-url":"/discover?q=P05-SEARCH-SENTINEL","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56485,"path":"/api/v1/content/catalog/works"},"requestId":"97b5ffd8-d934-4783-9562-385da7fa807e","res":{"statusCode":200,"headers":{"x-request-id":"97b5ffd8-d934-4783-9562-385da7fa807e","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=94; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"414","etag":"W/\"19e-+cZ7aLi203ibFkK2ixXxb64cu5U\""}},"responseTime":47,"msg":"request completed"}
+ {"level":40,"time":1793518592981,"pid":97215,"hostname":"[local-host]","req":{"id":"731621ac-7ecb-4335-abcb-8dc6e586a59b","method":"GET","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56486,"path":"/api/v1/content/[unknown]"},"requestId":"731621ac-7ecb-4335-abcb-8dc6e586a59b","code":"NOT_FOUND","requestId":"731621ac-7ecb-4335-abcb-8dc6e586a59b","statusCode":404,"msg":"Resource not found."}
+ {"level":30,"time":1793518592981,"pid":97215,"hostname":"[local-host]","req":{"id":"731621ac-7ecb-4335-abcb-8dc6e586a59b","method":"GET","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56486,"path":"/api/v1/content/[unknown]"},"requestId":"731621ac-7ecb-4335-abcb-8dc6e586a59b","res":{"statusCode":404,"headers":{"x-request-id":"731621ac-7ecb-4335-abcb-8dc6e586a59b","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=93; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"210","etag":"W/\"d2-RooxOcdebypYOLOniZSBeUTtQ30\""}},"responseTime":0,"msg":"request completed"}
+ {"level":40,"time":1793518592982,"pid":97215,"hostname":"[local-host]","req":{"id":"1301590b-d6c5-42e5-a118-011c17ed2154","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","origin":"https://disallowed.example.test","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56487,"path":"/api/v1/content/catalog/works"},"requestId":"1301590b-d6c5-42e5-a118-011c17ed2154","code":"FORBIDDEN","requestId":"1301590b-d6c5-42e5-a118-011c17ed2154","statusCode":403,"msg":"Origin is not allowed by CORS."}
+ {"level":30,"time":1793518592983,"pid":97215,"hostname":"[local-host]","req":{"id":"1301590b-d6c5-42e5-a118-011c17ed2154","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","origin":"https://disallowed.example.test","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56487,"path":"/api/v1/content/catalog/works"},"requestId":"1301590b-d6c5-42e5-a118-011c17ed2154","res":{"statusCode":403,"headers":{"x-request-id":"1301590b-d6c5-42e5-a118-011c17ed2154","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","content-type":"application/json; charset=utf-8","content-length":"225","etag":"W/\"e1-r1pUmaaOOQuFn/oHHGOPF/Y23BA\""}},"responseTime":1,"msg":"request completed"}
+ {"level":40,"time":1793518592984,"pid":97215,"hostname":"[local-host]","req":{"id":"9f374caa-bf7b-4b57-9626-205a1dfe897a","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56488,"path":"/api/v1/content/catalog/works"},"requestId":"9f374caa-bf7b-4b57-9626-205a1dfe897a","code":"VALIDATION_ERROR","requestId":"9f374caa-bf7b-4b57-9626-205a1dfe897a","statusCode":400,"msg":"Request validation failed."}
+ {"level":30,"time":1793518592984,"pid":97215,"hostname":"[local-host]","req":{"id":"9f374caa-bf7b-4b57-9626-205a1dfe897a","method":"GET","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56479","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56488,"path":"/api/v1/content/catalog/works"},"requestId":"9f374caa-bf7b-4b57-9626-205a1dfe897a","res":{"statusCode":400,"headers":{"x-request-id":"9f374caa-bf7b-4b57-9626-205a1dfe897a","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=92; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"284","etag":"W/\"11c-5W7yinVLJ2MKI1k6tnSlTqEfkos\""}},"responseTime":1,"msg":"request completed"}
+

 ❯ src/content.integration.test.ts:774:35
    772|     expect(unknownQueryKey.status).toBe(400);
    773|     expect(JSON.stringify(unknownQueryKey.body)).not.toContain(sentine…
    774|     expect(messages.join("")).not.toContain(sentinel);
       |                                   ^
    775|     expect(messages.join("")).toContain(valid.headers["x-request-id"]);
    776|     expect(messages.join("")).toContain("/content/catalog/works");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/content.integration.test.ts > real HTTP content boundary > protects public HEAD and unsupported methods across routing, early failures and final logs
AssertionError: expected '{"level":30,"time":1793518593019,"pid…' not to contain 'PUBLIC-METHOD-PRIVATE-SENTINEL'

- Expected
+ Received

- PUBLIC-METHOD-PRIVATE-SENTINEL
+ {"level":30,"time":1793518593019,"pid":97215,"hostname":"[local-host]","req":{"id":"212b1669-4ec2-4097-90d3-12058a76f635","method":"HEAD","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56490","referer":"http://localhost:3000/discover?q=PUBLIC-METHOD-PRIVATE-SENTINEL","x-original-url":"/discover?q=PUBLIC-METHOD-PRIVATE-SENTINEL","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56491,"path":"/api/v1/content/catalog/works"},"requestId":"212b1669-4ec2-4097-90d3-12058a76f635","res":{"statusCode":200,"headers":{"x-request-id":"212b1669-4ec2-4097-90d3-12058a76f635","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=99; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"414","etag":"W/\"19e-NiYc4LUo7WjJ2a4SNtsKL0i+yHA\""}},"responseTime":7,"msg":"request completed"}
+ {"level":30,"time":1793518593026,"pid":97215,"hostname":"[local-host]","req":{"id":"af71954c-9cfd-4fa3-b768-5e91f11c6b7b","method":"HEAD","url":"/api/v1/content/works","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56492,"path":"/api/v1/content/works"},"requestId":"af71954c-9cfd-4fa3-b768-5e91f11c6b7b","res":{"statusCode":200,"headers":{"x-request-id":"af71954c-9cfd-4fa3-b768-5e91f11c6b7b","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=98; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"407","etag":"W/\"197-QMM+GunmZMdMaLML6gs230jIjDw\""}},"responseTime":6,"msg":"request completed"}
+ {"level":40,"time":1793518593027,"pid":97215,"hostname":"[local-host]","req":{"id":"68371e02-ee49-4347-9556-24620475e1d4","method":"HEAD","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56493,"path":"/api/v1/content/catalog/works"},"requestId":"68371e02-ee49-4347-9556-24620475e1d4","code":"VALIDATION_ERROR","requestId":"68371e02-ee49-4347-9556-24620475e1d4","statusCode":400,"msg":"Request validation failed."}
+ {"level":30,"time":1793518593027,"pid":97215,"hostname":"[local-host]","req":{"id":"68371e02-ee49-4347-9556-24620475e1d4","method":"HEAD","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56493,"path":"/api/v1/content/catalog/works"},"requestId":"68371e02-ee49-4347-9556-24620475e1d4","res":{"statusCode":400,"headers":{"x-request-id":"68371e02-ee49-4347-9556-24620475e1d4","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=97; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"316","etag":"W/\"13c-r06D+KrtOFfufwuNzbQgA2WaBWQ\""}},"responseTime":1,"msg":"request completed"}
+ {"level":40,"time":1793518593028,"pid":97215,"hostname":"[local-host]","req":{"id":"8ad7ba81-fd40-40e1-91bd-bd136bbad8a2","method":"HEAD","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56494,"path":"/api/v1/content/catalog/works"},"requestId":"8ad7ba81-fd40-40e1-91bd-bd136bbad8a2","code":"BAD_REQUEST","requestId":"8ad7ba81-fd40-40e1-91bd-bd136bbad8a2","statusCode":400,"msg":"Malformed request URL."}
+ {"level":30,"time":1793518593028,"pid":97215,"hostname":"[local-host]","req":{"id":"8ad7ba81-fd40-40e1-91bd-bd136bbad8a2","method":"HEAD","url":"/api/v1/content/catalog/works","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56494,"path":"/api/v1/content/catalog/works"},"requestId":"8ad7ba81-fd40-40e1-91bd-bd136bbad8a2","res":{"statusCode":400,"headers":{"x-request-id":"8ad7ba81-fd40-40e1-91bd-bd136bbad8a2","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=96; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"219","etag":"W/\"db-rqqiA2KEkDaWBbhvfm8/D8d+mC0\""}},"responseTime":0,"msg":"request completed"}
+ {"level":40,"time":1793518593029,"pid":97215,"hostname":"[local-host]","req":{"id":"bbfb7b58-11f6-4439-80a2-bc2f004fa2ef","method":"HEAD","url":"/api/v1/content/works/:workSlug/cover","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56495,"path":"/api/v1/content/works/:workSlug/cover"},"requestId":"bbfb7b58-11f6-4439-80a2-bc2f004fa2ef","code":"BAD_REQUEST","requestId":"bbfb7b58-11f6-4439-80a2-bc2f004fa2ef","statusCode":400,"msg":"Malformed request URL."}
+ {"level":30,"time":1793518593029,"pid":97215,"hostname":"[local-host]","req":{"id":"bbfb7b58-11f6-4439-80a2-bc2f004fa2ef","method":"HEAD","url":"/api/v1/content/works/:workSlug/cover","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56495,"path":"/api/v1/content/works/:workSlug/cover"},"requestId":"bbfb7b58-11f6-4439-80a2-bc2f004fa2ef","res":{"statusCode":400,"headers":{"x-request-id":"bbfb7b58-11f6-4439-80a2-bc2f004fa2ef","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=95; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"227","etag":"W/\"e3-nNTIiITuMhc7cQihvQ+VKuF2Qao\""}},"responseTime":0,"msg":"request completed"}
+ {"level":40,"time":1793518593030,"pid":97215,"hostname":"[local-host]","req":{"id":"c7a88e4d-2f1a-4a93-94db-075ba29286e7","method":"HEAD","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56496,"path":"/api/v1/content/[unknown]"},"requestId":"c7a88e4d-2f1a-4a93-94db-075ba29286e7","code":"NOT_FOUND","requestId":"c7a88e4d-2f1a-4a93-94db-075ba29286e7","statusCode":404,"msg":"Resource not found."}
+ {"level":30,"time":1793518593030,"pid":97215,"hostname":"[local-host]","req":{"id":"c7a88e4d-2f1a-4a93-94db-075ba29286e7","method":"HEAD","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56496,"path":"/api/v1/content/[unknown]"},"requestId":"c7a88e4d-2f1a-4a93-94db-075ba29286e7","res":{"statusCode":404,"headers":{"x-request-id":"c7a88e4d-2f1a-4a93-94db-075ba29286e7","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=94; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"210","etag":"W/\"d2-fh2GfK0/ntOmFoy+CPvVfGqJND8\""}},"responseTime":1,"msg":"request completed"}
+ {"level":40,"time":1793518593033,"pid":97215,"hostname":"[local-host]","req":{"id":"5ab4d692-6a52-405b-86f8-a2986576b0ad","method":"HEAD","url":"/api/v1/content/works/:workSlug/cover","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56497,"path":"/api/v1/content/works/:workSlug/cover"},"requestId":"5ab4d692-6a52-405b-86f8-a2986576b0ad","code":"NOT_FOUND","requestId":"5ab4d692-6a52-405b-86f8-a2986576b0ad","statusCode":404,"msg":"The requested resource was not found."}
+ {"level":30,"time":1793518593033,"pid":97215,"hostname":"[local-host]","req":{"id":"5ab4d692-6a52-405b-86f8-a2986576b0ad","method":"HEAD","url":"/api/v1/content/works/:workSlug/cover","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56497,"path":"/api/v1/content/works/:workSlug/cover"},"requestId":"5ab4d692-6a52-405b-86f8-a2986576b0ad","res":{"statusCode":404,"headers":{"x-request-id":"5ab4d692-6a52-405b-86f8-a2986576b0ad","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=93; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"240","etag":"W/\"f0-CnXQnGsju0XVam+i0rTIwXNkv4g\""}},"responseTime":3,"msg":"request completed"}
+ {"level":40,"time":1793518593034,"pid":97215,"hostname":"[local-host]","req":{"id":"90845dcb-900d-4dce-b3fe-106b42380ff1","method":"HEAD","url":"/api/v1/content/catalog/home","headers":{"host":"127.0.0.1:56490","origin":"https://disallowed.example.test","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56498,"path":"/api/v1/content/catalog/home"},"requestId":"90845dcb-900d-4dce-b3fe-106b42380ff1","code":"FORBIDDEN","requestId":"90845dcb-900d-4dce-b3fe-106b42380ff1","statusCode":403,"msg":"Origin is not allowed by CORS."}
+ {"level":30,"time":1793518593034,"pid":97215,"hostname":"[local-host]","req":{"id":"90845dcb-900d-4dce-b3fe-106b42380ff1","method":"HEAD","url":"/api/v1/content/catalog/home","headers":{"host":"127.0.0.1:56490","origin":"https://disallowed.example.test","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56498,"path":"/api/v1/content/catalog/home"},"requestId":"90845dcb-900d-4dce-b3fe-106b42380ff1","res":{"statusCode":403,"headers":{"x-request-id":"90845dcb-900d-4dce-b3fe-106b42380ff1","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","content-type":"application/json; charset=utf-8","content-length":"224","etag":"W/\"e0-rgx02es21Uve1eLGXTxvzOnY5g4\""}},"responseTime":0,"msg":"request completed"}
+ {"level":50,"time":1793518593036,"pid":97215,"hostname":"[local-host]","req":{"id":"14c64180-78d4-48d7-8ec6-7eaf218bf608","method":"HEAD","url":"/api/v1/content/catalog/home","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56499,"path":"/api/v1/content/catalog/home"},"requestId":"14c64180-78d4-48d7-8ec6-7eaf218bf608","code":"INTERNAL_SERVER_ERROR","requestId":"14c64180-78d4-48d7-8ec6-7eaf218bf608","statusCode":500,"error":{"kind":"Error","name":"Error"},"msg":"An unexpected error occurred."}
+ {"level":30,"time":1793518593036,"pid":97215,"hostname":"[local-host]","req":{"id":"14c64180-78d4-48d7-8ec6-7eaf218bf608","method":"HEAD","url":"/api/v1/content/catalog/home","headers":{"host":"127.0.0.1:56490","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56499,"path":"/api/v1/content/catalog/home"},"requestId":"14c64180-78d4-48d7-8ec6-7eaf218bf608","res":{"statusCode":500,"headers":{"x-request-id":"14c64180-78d4-48d7-8ec6-7eaf218bf608","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=92; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"235","etag":"W/\"eb-Xqoo4yYejspXX+gDOc0xsz46b4U\""}},"err":{"type":"Error","message":"failed with status code 500","stack":"Error: failed with status code 500\n    at onResFinished ([repository]/node_modules/.pnpm/pino-http@11.0.0/node_modules/pino-http/logger.js:115:39)\n    at ServerResponse.onResponseComplete ([repository]/node_modules/.pnpm/pino-http@11.0.0/node_modules/pino-http/logger.js:178:14)\n    at ServerResponse.emit (node:events:521:24)\n    at onFinish (node:_http_outgoing:1031:10)\n    at afterWrite (node:internal/streams/writable:708:5)\n    at afterWriteTick (node:internal/streams/writable:694:10)\n    at processTicksAndRejections (node:internal/process/task_queues:89:21)"},"responseTime":0,"msg":"request errored"}
+ {"level":40,"time":1793518593038,"pid":97215,"hostname":"[local-host]","req":{"id":"c4f1367d-0814-4af4-b068-18d43ceb727f","method":"POST","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","accept-encoding":"gzip, deflate","connection":"close","content-length":"0"},"remoteAddress":"127.0.0.1","remotePort":56500,"path":"/api/v1/content/[unknown]"},"requestId":"c4f1367d-0814-4af4-b068-18d43ceb727f","code":"NOT_FOUND","requestId":"c4f1367d-0814-4af4-b068-18d43ceb727f","statusCode":404,"msg":"Resource not found."}
+ {"level":30,"time":1793518593038,"pid":97215,"hostname":"[local-host]","req":{"id":"c4f1367d-0814-4af4-b068-18d43ceb727f","method":"POST","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","accept-encoding":"gzip, deflate","connection":"close","content-length":"0"},"remoteAddress":"127.0.0.1","remotePort":56500,"path":"/api/v1/content/[unknown]"},"requestId":"c4f1367d-0814-4af4-b068-18d43ceb727f","res":{"statusCode":404,"headers":{"x-request-id":"c4f1367d-0814-4af4-b068-18d43ceb727f","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=91; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"210","etag":"W/\"d2-A4Yo39PDsqr0hRVupMhtO0xTup4\""}},"responseTime":0,"msg":"request completed"}
+ {"level":40,"time":1793518593039,"pid":97215,"hostname":"[local-host]","req":{"id":"efb46104-3640-4cfe-ae8c-cf28e180330c","method":"PUT","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","accept-encoding":"gzip, deflate","connection":"close","content-length":"0"},"remoteAddress":"127.0.0.1","remotePort":56501,"path":"/api/v1/content/[unknown]"},"requestId":"efb46104-3640-4cfe-ae8c-cf28e180330c","code":"NOT_FOUND","requestId":"efb46104-3640-4cfe-ae8c-cf28e180330c","statusCode":404,"msg":"Resource not found."}
+ {"level":30,"time":1793518593039,"pid":97215,"hostname":"[local-host]","req":{"id":"efb46104-3640-4cfe-ae8c-cf28e180330c","method":"PUT","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","accept-encoding":"gzip, deflate","connection":"close","content-length":"0"},"remoteAddress":"127.0.0.1","remotePort":56501,"path":"/api/v1/content/[unknown]"},"requestId":"efb46104-3640-4cfe-ae8c-cf28e180330c","res":{"statusCode":404,"headers":{"x-request-id":"efb46104-3640-4cfe-ae8c-cf28e180330c","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=90; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"210","etag":"W/\"d2-EP1cqnoVp2hCEUnj93Is46KFr60\""}},"responseTime":0,"msg":"request completed"}
+ {"level":40,"time":1793518593040,"pid":97215,"hostname":"[local-host]","req":{"id":"8c727b4b-9f3a-4712-a742-cd3c1c153909","method":"DELETE","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56502,"path":"/api/v1/content/[unknown]"},"requestId":"8c727b4b-9f3a-4712-a742-cd3c1c153909","code":"NOT_FOUND","requestId":"8c727b4b-9f3a-4712-a742-cd3c1c153909","statusCode":404,"msg":"Resource not found."}
+ {"level":30,"time":1793518593040,"pid":97215,"hostname":"[local-host]","req":{"id":"8c727b4b-9f3a-4712-a742-cd3c1c153909","method":"DELETE","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","accept-encoding":"gzip, deflate","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56502,"path":"/api/v1/content/[unknown]"},"requestId":"8c727b4b-9f3a-4712-a742-cd3c1c153909","res":{"statusCode":404,"headers":{"x-request-id":"8c727b4b-9f3a-4712-a742-cd3c1c153909","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=89; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"210","etag":"W/\"d2-O+LwmptI+wg1BzYFk34lde3HEOw\""}},"responseTime":1,"msg":"request completed"}
+ {"level":40,"time":1793518593040,"pid":97215,"hostname":"[local-host]","req":{"id":"6487aec0-5689-45df-9b16-f5d1214532ac","method":"POST","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","accept-encoding":"gzip, deflate","connection":"close","content-length":"0"},"remoteAddress":"127.0.0.1","remotePort":56503,"path":"/api/v1/content/[unknown]"},"requestId":"6487aec0-5689-45df-9b16-f5d1214532ac","code":"BAD_REQUEST","requestId":"6487aec0-5689-45df-9b16-f5d1214532ac","statusCode":400,"msg":"Malformed request URL."}
+ {"level":30,"time":1793518593040,"pid":97215,"hostname":"[local-host]","req":{"id":"6487aec0-5689-45df-9b16-f5d1214532ac","method":"POST","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","accept-encoding":"gzip, deflate","connection":"close","content-length":"0"},"remoteAddress":"127.0.0.1","remotePort":56503,"path":"/api/v1/content/[unknown]"},"requestId":"6487aec0-5689-45df-9b16-f5d1214532ac","res":{"statusCode":400,"headers":{"x-request-id":"6487aec0-5689-45df-9b16-f5d1214532ac","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","vary":"Origin, Accept-Encoding","access-control-allow-credentials":"true","ratelimit":"\"100-in-1min\"; r=88; t=60","ratelimit-policy":"\"100-in-1min\"; q=100; w=60; pk=:MTJjYTE3YjQ5YWYy:","content-type":"application/json; charset=utf-8","content-length":"215","etag":"W/\"d7-SxWgJD2/eeGpyix7vxalS5qg4Tg\""}},"responseTime":0,"msg":"request completed"}
+ {"level":40,"time":1793518593041,"pid":97215,"hostname":"[local-host]","req":{"id":"47769a2d-d4d6-44f4-b3eb-eac97f32e1e1","method":"OPTIONS","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","accept-encoding":"gzip, deflate","origin":"https://disallowed.example.test","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56504,"path":"/api/v1/content/[unknown]"},"requestId":"47769a2d-d4d6-44f4-b3eb-eac97f32e1e1","code":"FORBIDDEN","requestId":"47769a2d-d4d6-44f4-b3eb-eac97f32e1e1","statusCode":403,"msg":"Origin is not allowed by CORS."}
+ {"level":30,"time":1793518593041,"pid":97215,"hostname":"[local-host]","req":{"id":"47769a2d-d4d6-44f4-b3eb-eac97f32e1e1","method":"OPTIONS","url":"/api/v1/content/[unknown]","headers":{"host":"127.0.0.1:56490","accept-encoding":"gzip, deflate","origin":"https://disallowed.example.test","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":56504,"path":"/api/v1/content/[unknown]"},"requestId":"47769a2d-d4d6-44f4-b3eb-eac97f32e1e1","res":{"statusCode":403,"headers":{"x-request-id":"47769a2d-d4d6-44f4-b3eb-eac97f32e1e1","cache-control":"no-store","content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","content-type":"application/json; charset=utf-8","content-length":"221","etag":"W/\"dd-4MsdO74gTD7Eu+eQIWQo5cMLXz4\""}},"responseTime":0,"msg":"request completed"}
+

 ❯ src/content.integration.test.ts:874:35
    872|     const emitted = messages.map((message): unknown => JSON.parse(mess…
    873|     expect(emitted.length).toBeGreaterThan(0);
    874|     expect(messages.join("")).not.toContain(sentinel);
       |                                   ^
    875|     expect(messages.join("")).toContain("Resource not found.");
    876|     expect(messages.join("")).toContain("/api/v1/content/[unknown]");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 35 skipped (37)
   Start at  09:36:26
   Duration  6.36s (transform 419ms, setup 11ms, import 900ms, tests 246ms, environment 0ms)

[repository]/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 test:integration: `vitest run --config vitest.integration.config.ts src/content.integration.test.ts -t 'validates public queries|protects public HEAD'`
Exit status 1
```

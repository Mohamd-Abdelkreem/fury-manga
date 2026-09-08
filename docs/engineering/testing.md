# Testing and verification

Tests prove agreed behavior at the claimed boundary. They do not merely reproduce
the implementation. The selected workflow assigns application test authoring to
Codex Medium and independent acceptance review to Codex High. Kimi may run/read
tests and report suspected defects, but must not weaken them to pass.

## Choose evidence by behavior

| Claim/change             | Required kind of evidence                                                |
| ------------------------ | ------------------------------------------------------------------------ |
| Normalization/contract   | Accepted/rejected fields, bounds, omitted/null semantics and safe output |
| Pure ordering/state rule | Deterministic inputs, boundaries and meaningful invariants               |
| Service rule             | Real outcome and effects; focused doubles only for the intended boundary |
| Transaction/constraint   | Real isolated PostgreSQL, real migrations and final-state assertions     |
| HTTP authority           | Real application/middleware/auth/CSRF and correct response/state         |
| Form/cache               | Rendered interaction or real QueryClient; not a mocked hook under test   |
| Async denial/scope       | Late replies, reset/cancel/remount, wrong scope and independent clients  |
| Browser/device           | Actual navigation/cookies/history/focus/device behavior                  |
| Documentation/examples   | Format/links/portable scope and appropriate snippet checks               |

For bugs: reproduce, create a meaningful failing regression, make the smallest
adequate fix, then verify adjacent behavior. A missing import or broken harness
is not a reproduced behavior failure. Legitimately wrong tests are corrected
against requirements by their owner and reviewed independently.

## Contract and mapper example

Assumes exports from the fictional Item example; this is a test pattern to adapt,
not a claim that the current application has this feature.

```ts
import { describe, expect, it } from "vitest";
import { itemSchema, updateItemBodySchema } from "@workspace/contracts";
import { mapItem } from "./items.mapper.js";

describe("item boundary", () => {
  it("rejects unsupported privileged input", () => {
    const result = updateItemBodySchema.safeParse({
      title: "A title",
      version: 0,
      ownerId: "another-account",
    });
    expect(result.success).toBe(false);
  });

  it("maps only public fields even if the input object has extra fields", () => {
    const record = {
      id: "b9dd09e7-2c8e-478c-9f3a-2b87a2e67cb8",
      title: "A title",
      version: 1,
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      ownerId: "private-owner",
      internalNote: "private-sentinel",
    };
    const output = mapItem(record);
    expect(itemSchema.parse(output)).toEqual({
      id: record.id,
      title: record.title,
      version: 1,
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(output).not.toHaveProperty("ownerId");
    expect(output).not.toHaveProperty("internalNote");
  });
});
```

Structural typing allows a wider existing object into the mapper, making the
absence assertions meaningful. A TypeScript output type alone would not remove
fields at runtime.

## Real concurrent HTTP example

The host test harness must start the actual app with an isolated migrated PostgreSQL
database, create a real active account/login/CSRF session and owned Item fixture.
Only external delivery/provider boundaries are faked. These variables below come
from that harness; they are not mocks of Prisma, transactions or the endpoint.

```ts
const titles = ["First candidate", "Second candidate"];
const responses = await Promise.all(
  titles.map((title) =>
    request(app)
      .patch("/api/items/" + item.id)
      .set("Authorization", "Bearer " + session.accessToken)
      .set("Cookie", session.cookieHeader)
      .set("x-csrf-token", session.csrfToken)
      .send({ title, version: item.version }),
  ),
);

expect(responses.map((response) => response.status).sort()).toEqual([200, 409]);
const saved = await database.item.findUniqueOrThrow({ where: { id: item.id } });
expect(saved.version).toBe(item.version + 1);
expect(titles).toContain(saved.title);
expect(await database.item.count({ where: { id: item.id } })).toBe(1);
```

This is actual competing dispatch, unlike sequential replay. Assert the winning
response matches final state too in the real test; exercise wrong owner, stale
version, no bearer and missing CSRF separately. Use unique per-test fixtures or
transaction/database isolation rather than deleting unrelated developer data.

For genuinely dependent multi-write operations, cause a real failure after an
earlier write and assert all required state/audit rolled back. A mocked transaction
callback or a standalone test of Prisma itself does not prove service atomicity.

## Frontend state and cache evidence

For the editor model: first load, pristine sync, dirty unrelated update, dirty
editable conflict, accept-server, continue-draft and old/wrong-resource response.
Continuing the draft uses the latest accepted version; a further server race still
returns conflict.

For access state: confirmed denial, transient error afterwards, pre-denial in-flight
success, cache writes, reset/remount/cancellation, newly dispatched matching GET
with identical data, wrong parent/resource/session and independent QueryClients.
Test the query lifecycle owner and actual layout/handler, not only a pure reducer.

For sensitive commands inspect MutationCache/QueryCache keys, variables, meta,
data and errors using sentinel values. Assert duplicate calls cannot start a second
request, reset cannot unlock pending work, and settlement permits the next allowed
operation. Adapter tests verify final headers after all interceptors/defaults.

## Scope and execution discipline

Use the actual repository scripts/configuration. Discover unit/integration/build
and any aggregate gate; do not assume a route smoke check is browser E2E or part
of the aggregate. Relevant gates must pass or be reported blocked. Never copy old
test counts or cached results as fresh execution.

Changed critical async/race suites use shuffled order with a recorded seed and
five separate process runs where the frontend standard requires it. This stress
check is not repeated for documentation or unrelated trivial changes. Broaden
checks only for new changes, failures or unresolved concerns.

No .only/.skip/.todo, forced exits, arbitrary sleeps, timeout inflation, retries
hiding flakiness or mocks that remove the layer being tested. Cleanup servers,
database clients, containers, timers, listeners and owned pending work on both
success and failure. Report warnings and their actual impact; do not suppress
them or randomly upgrade dependencies.

## Browser and release evidence

jsdom/HTTP checks do not establish hydration, Referer, cookie isolation, browser
history, clipboard/share or physical camera behavior. Verify relevant narrow/RTL/
keyboard/focus/device cases for the requested feature and record unperformed checks.

Deployment readiness also depends on the actual staged build, HTTPS/proxies,
migration/key continuity, relevant backup/rollback plan and user authorization.
A green local suite is not release approval or a guarantee of no defects.

Relevant rules: B45–B54 and F30/F31; task acceptance uses
[operating policy](../workflow/operating-policy.md).

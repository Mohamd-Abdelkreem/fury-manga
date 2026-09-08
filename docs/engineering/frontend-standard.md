# Frontend coding standard

F01–F31 define reusable frontend engineering behavior. Apply relevant sections to
new/touched code; optional credential/device/publication capabilities do not create
product requirements. Use the current project's package names, form/error/UI
primitives, language and approved design. Arabic-first RTL is the user's default,
subject to an explicit different project requirement.

Read [the ownership map](README.md), [contracts](api-contracts.md),
[security](security.md), [design](../design/design-system.md) and [testing](testing.md)
as applicable. Existing implementation is not automatic proof of compliance.

## F01 — Architecture, ownership and types

Organize feature responsibilities as features/<domain>/{api,hooks,model,components}.
Create the folders needed by real responsibilities; preserve established paths
during unrelated changes. model owns pure feature types/state/rules, not a second
server-state store.

The live flow is Component -> React Query hook -> feature API -> central apiClient
-> backend. Components must not call the HTTP client directly. No ad hoc fetch,
extra Axios instance or global store to duplicate server state. React Query owns
server data; useState/React Hook Form own transient UI, input and drafts.

Shared contracts define public DTOs. Reuse existing safe-error presentation,
query-key factories, form helpers and UI components. Keep App Router page files
thin and client boundaries deliberate. Broad queryClient.clear is reserved for
actual logout/session teardown; ordinary writes update/invalidate only affected
resource scopes.

Preserve strict typing: no any, ts-ignore, ts-nocheck, fake double casts or broad
ESLint disables. Refactor only for a concrete local problem. Maintain approved
Arabic RTL and the design system.

## F02 — Truthful state presentation

For each important view decide applicable initial loading, background refresh,
empty, filtered-empty, error/retry, mutation pending, success, conflict,
unavailable/forbidden, disabled and stale-but-known states.

Never treat failed requests as empty results, invent counts during loading or
present fixture/fallback/placeholder data as authoritative. Pending requests must
not imply confirmed writes. Do not use optimistic success for unconfirmed business
actions; a justified optimistic interaction must be clearly pending and reversible.
Retained stale data must be visibly identified when its freshness affects decisions.

## F03 — Draft continuity, redirects and remote freshness

If the product lets a draft survive login/claim, preserve its identity/content.
Autosave reflects actual acknowledgement, handles offline/retry/version conflict
and cannot overwrite newer state. A route change invalidates stale completions;
media changes must not erase unrelated local input.

Only requests using the user-session protocol enter its refresh flow. Sanitize
return paths against external origins, protocol-relative paths, backslashes,
fragments, credentials in path/query and open redirects. Maintain the credential
query-key allowlist/denylist for the actual protocol, including token, access_token,
refresh_token, id_token, code, secret and password as relevant.

When state changes remotely, the server remains authoritative. Opening a handoff
does not confirm delivery or business completion. Use bounded/pending-state polling,
focus refetch, manual refresh or a justified subscription; stop unnecessary polling
at terminal state. Reconcile affected domains from server results. Cache invalidation
in one browser does not update another browser's independent QueryClient.

## F04 — Publication, public authority and renderer reuse

Publication/readiness UI uses server-authoritative eligibility. Client validation
is feedback only. Surface version conflict without silently retrying. Preserve
stable public identity when the contract requires it, and invalidate only the
affected public/private resource views.

Genuinely public endpoints explicitly opt into credential-free transport: no
session cookies, bearer, CSRF or alternate credential headers, and no owner-session
refresh on public 401. This is not a label for every unauthenticated route:
anonymous draft cookies and mixed-authority media follow their own contract.
Do not broadly relabel authentication entrypoints as credential-free public APIs.

Reuse the established renderer for preview/editor/public presentation when these
show the same content. Keep intentional template variation; do not force unrelated
templates through a universal form. Production code must not import reference
prototype/Figma project implementations. Adopt reviewed components into the real
feature structure.

## F05 — Sensitive and non-idempotent mutations

Follow the accepted duplicate/submission semantics; do not infer them from matching
names or visible values. Public output exposes only the contracted projection.
Do not hide unnecessary credentials in fields or form state.

For sensitive command hooks expose an explicit interface such as data/error/
isPending/isError/isSuccess/mutateAsync/reset, not raw mutate. Keep private request
bodies in short-lived refs/closures while needed; they must not be retained in
mutation variables. Use retry: false when replay could duplicate the action,
and gcTime: 0 for short-lived sensitive query/mutation state.

Convert raw transport errors to an allowlisted safe error before cache storage.
Omit sensitive field errors when unnecessary. Hold the in-flight guard until actual
settlement; reset cannot unlock an active request. A late response for one scope
cannot update another form. A new intentional command after settlement follows
the product's explicit business rules.

## F06 — Lists and route isolation

Live lists use server pagination/filtering/sorting. Search/filter changes reset
page to one. After a deletion, clamp an out-of-range page only from an authoritative
settled result for the current scope, never placeholder/pending/old results.
Provide a way back from an out-of-range page.

Distinguish fully empty, filtered-empty and failed results. Key resource lifecycle
by its identity so selections, debounced search and late requests from resource A
cannot affect resource B. Use deterministic server ordering with tie-breakers;
do not download an unbounded dataset and sort/page it in the browser.

## F07 — Detail forms and dirty-draft preservation

Before the first successful detail GET, a list row is not authoritative detail:
do not enable protected Save/Delete or guess server constraints. Show loading or
retry. After a prior success, a transient refresh failure may retain known detail,
visibly stale, with the draft and retry intact, subject to access rules.

Initialize the form on first success. Sync later editable server fields only when
pristine. If dirty and editable server data genuinely changed, preserve the draft
and show a conflict choice: adopt server values or keep editing the draft. Continuing
a draft does not bypass server versions/validation. Unrelated status/history updates
must not reset editable fields.

If a server bound changes, preserve the now-invalid selection visibly and show
validation; do not silently clamp away the user's choice. Inputs and payloads expose
only editable fields allowed by the actor's contract, not every detail response field.

## F08 — Parent failure and independent access state

A transient parent refresh failure must not unmount an already-open child editor
and destroy its draft. Where the write needs fresh parent eligibility, block Save,
Delete and keyboard submission in actual handlers as well as buttons; expose retry
inside the dialog.

Terminal access denials for sensitive resources are persistent scoped facts, not
just the latest isError. Parent and child denials are independent; success for one
does not authorize the other. Denial of item A does not deny item B, and separate
sessions/QueryClients do not inherit each other's denial. Apply the detailed
recovery/order requirements in F27, including management layouts.

## F09 — Distinct commands and current-state eligibility

Keep actions with different semantics separate in names, endpoints and UI. A create,
replace and revoke are not one interchangeable generic toggle. Preserve exact input
contracts: bodyless versus empty object, expected version/current ID and reason.

Derive eligibility from actual server state and the accepted transition model.
Absent, active, archived or replaced data can mean different actions. If repeating
an action is allowed, test the relevant lifecycle and retention rules. Never invent
an eligibility rule or new state from an unrelated project's example.

## F10 — Current child state versus historical facts

A replaced child's empty event/history field does not erase history belonging to
the parent entity. Cache patches must preserve independent truths: update the
current child without discarding parent-level history or copying old history into
the new child. Follow with scoped reconciliation when needed. Specify projections
before writing patches.

## F11 — Ordering and traversal

Special sorts involving nullable related events must define populated versus
missing placement and deterministic tie-breakers. Stable traversal of a fixed
dataset must not duplicate or omit IDs across pages. Database ordering owns live
pagination; local display sorting must not pretend to sort the full dataset.

## F12 — Credential-bearing reads and URL privacy

For sensitive credential-link queries, credentials must not appear in query keys.
Use opaque per-view identities; a random ID is cache isolation, not authorization.
Use staleTime: 0, gcTime: 0, retry: false, pass AbortSignal and clean up the exact
query on error/unmount/credential or route-identity change.

Before non-cancellation errors reach QueryCache, convert them to safe allowlisted
errors without raw Axios config, URL, headers, body, details, backend message,
stack or sensitive field errors. Handle cancellation separately so it does not
become a fabricated network/denial event.

Do not serialize credentials from server components into client props/build output.
If the product uses credential URLs, specify bootstrap/hydration, reload, history
and sharing deliberately. Temporary credentials must be consumed and cleared according to the approved
protocol; do not invent an extra bootstrap or persist credentials for convenience.

For sensitive documents and bootstrap routes require no-store, no-referrer and
noindex/nofollow policies as applicable to the credential flow, across both entry
and final routes. Verify actual deployed headers, redirects, Referer and proxy/log
behavior; client cleanup cannot erase credentials already logged upstream.

## F13 — Read, render and share are not commands

Opening/refreshing a credential view, rendering QR, copying or sharing must not
perform its protected business command. Only the explicit command endpoint does.
Generate canonical share/QR links from the approved origin and resource identity,
without unrelated query strings or fragments. Test that viewing/sharing leaves
business state unchanged.

## F14 — One-time credential presentation, when applicable

Use contract-defined bounds/defaults for credential-session creation. Show the
secret only in the authorized one-time result; list responses must not expose it.
Clear the presented URL/secret on close, reset, unmount and resource change.
Require the intended revoke confirmation and represent active/expired/revoked
states accurately. Do not store a secret just to redisplay it later.

## F15 — Replacement credential lifecycle, when applicable

Honor the approved transport; an example using fragment tokens does not authorize
query credentials. Handle initial consumption and same-resource hash/credential
changes, then clear temporary URL material promptly.

On valid replacement, stop the old device work/detector, clear prior result/manual
input/error, reset presentation and use the new authority. Invalid replacement fails
closed; never fall back to a broader logged-in user's authority. Credential priority
is explicit and stable under React Strict Mode.

## F16 — Device lifecycle versus server-operation lifecycle

For camera or analogous device features, separate capture lifecycle from a pending
server command. Hiding the page stops tracks, RAF/timers and video.srcObject without
discarding a still-relevant pending server result.

Ignore stale detector resolve/reject after manual submission, hide, credential
replacement, route change or unmount. It cannot change UI, counters, errors, retries
or overwrite pending/result state. Use operation/resource generations or equivalent
ownership checks; cancellation alone does not prove a late completion is harmless.

## F17 — Capability and device errors

Distinguish missing browser API, permission denial, unavailable device, detector
constructor/runtime failure and network failure. A runtime detector error does not
mean the browser lacks the API.

Retry only the appropriate recoverable device errors with bounded delay; no tight
loop. Reset failure counts after success and keep a manual fallback usable where
the product offers one. Test late failures as well as successful capture.

## F18 — Sensitive manual-input retention

Clear submitted secrets after successful/idempotent completion, terminal domain
outcomes and permanent/non-retryable errors. Retain only what is needed for a
deliberate retry after recoverable network/temporary infrastructure failure.
Name the exact terminal codes in the feature contract rather than treating every
error alike. Clear on route/session teardown regardless of retryability.

## F19 — Error classification order

Classify terminal credential/session domain codes first. Then classify known
recoverable network/service/rate-limit conditions and non-terminal HTTP 500–599.
Validation/unauthorized/forbidden and other permanent 4xx remain permanent according
to the contract; 499 and 600 are not generic 5xx.

Do not rename every error NETWORK_ERROR. Rate-limited retries are deliberate and
respect server guidance; retryability does not enable automatic mutation retry.

## F20 — Hook-owned duplicate prevention

Sensitive command hooks own an in-flight guard, not just a disabled component.
Keep secrets temporarily outside mutation variables. Hold the guard until network
settlement; finally releases it. reset clears presentation but cannot unlock pending
work. Expose only the intended API, not raw mutate.

A duplicate local call has a distinct already-in-progress outcome, not NETWORK_ERROR.
A fresh operation is allowed after settlement if permitted by business rules.
UI guards supplement, and never replace, server concurrency protection.

## F21 — Safe mutation cache contents

Sanitize before React Query stores failures. Omit credential-bearing fieldErrors
where not needed. Audit mutationKey, meta, variables, data and cached error, not
only logs: none may retain credentials, request body/headers, raw URL, Axios config,
private details, raw backend messages or stack.

A one-time secret response needs a deliberate transient owner outside retained
mutation data. gcTime: 0 and reset are cleanup aids, not permission to leak secrets
until garbage collection.

## F22 — Immutable business events, when applicable

Define the first/repeated command outcomes and required uniqueness in the backend
contract. Frontend displays authoritative event snapshots; later entity edits or
credential replacement must not reinterpret history. Keep event state independent
of the current credential's status. No frontend cache patch can establish database
uniqueness or immutability.

## F23 — Honest metrics and terminology units

Use server-owned metrics. Distinguish entities/groups from people/items and totals
from filtered counts. Never fabricate pending/not-replied categories from a model
that does not contain them, or show fallback zero as an authoritative count.
The accepted project's model determines metric names and empty/loading presentation.

## F24 — Scoped cache ownership

Each mutation declares the domains actually changed: relevant lists/details,
metrics, history and overview. Scope keys/patches/invalidation to the actual
resource and account. Do not invalidate resource B because A changed.

Independent browser/session QueryClients are independent. A standalone credential
client must not pretend to mutate another user's browser cache. Coordinate freshness
through actual server-backed refetch/poll/subscription behavior when required.

## F25 — Explicit transport authority and adapter verification

When a product has session/public/special-purpose credentials, their headers and
refresh behavior are explicit and mutually isolated:

| Authority                  | Transport behavior                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| User session               | Intended bearer/cookies and unsafe-request CSRF; remove stale special-purpose headers                |
| Truly public               | withCredentials false; no user bearer, CSRF or special-purpose credential; no user refresh           |
| Special-purpose credential | Only its designated credential header; no user bearer/CSRF/user refresh; no implicit session cookies |

Anonymous cookie drafts or mixed-authority media need separate explicit contracts.
Do not introduce a new authority without a product need or grant wider authority
when a narrower credential fails.

Final adapter tests assert the actual outgoing request after interceptors/defaults.
An option on a feature API call does not establish credential isolation.

## F26 — Sensitive data throughout the frontend

Credentials must not enter query/mutation keys, meta, retained variables/errors,
browser storage, persisted QueryClient, unnecessary hidden inputs, login returnTo,
logs, telemetry or generated artifacts. Public errors must not retain raw transport
errors.

Password forms and one-time credential display necessarily handle sensitive input
transiently; minimize lifetime and clear it according to the operation. Do not copy
that transient data into shared caches. The existing memory-only access-token owner
is not permission to create a second credential store.

## F27 — Persistent scoped access denial

Cache stores data; it does not authorize access. For sensitive resource management,
confirmed terminal denial survives transient later failures, cache writes, reset,
invalidation, remount/reopen, cancelled retries and old GET/PATCH completions.
Guard the actual management layout and recheck access at write submission/after
async validation, not just when rendering a disabled button.

Recovery requires a newer successful authoritative GET matching the same resource,
parent context, authority and session/client scope. It must be eligible to supersede
the denial, not an old in-flight response arriving late. A newer successful matching
GET may recover even when its data is structurally identical; data change is not
the authorization signal.

Track query outcome/order and access scope explicitly through an appropriate
existing model; do not use global denial flags. Parent success cannot clear child
denial or vice versa. Resource A cannot affect B; independent QueryClients/sessions
are isolated. No old mutation success reopens protected UI.

Test denial -> transient error, cache write/reset/remount/cancellation, old result,
wrong scope, identical successful recovery, delayed form validation, duplicate
submit and independent clients. Server authorization still enforces every request;
this UI mechanism prevents stale disclosure/actions rather than granting permission.

## F28 — Accessibility and truthful feedback

Provide keyboard access, real labels, dialog semantics/focus handling, appropriate
Escape behavior and focus restoration using the project's dialog primitive.
Use alert for errors and status for informational/success feedback as context
requires; errors must not look successful or rely on color alone.

Prevent duplicate click and keyboard submission in handlers as well as controls.
Verify usable 320px layouts and portrait/landscape on sensitive flows. Preserve
RTL, long labels and mixed-direction content. Test interactive focus behavior,
not only presence of ARIA attributes.

## F29 — Product-consistent copy

Copy describes the accepted current model and actual capabilities. Do not inherit
another project's roster/submission/payment terminology. Independent submissions,
current objects, history, pending confirmation and completed actions must remain
distinct in language as well as types. Never promise external delivery or a state
transition merely because a link opened.

## F30 — Verification and test integrity

For a bug: reproduce, write a meaningful failing regression, apply the smallest
adequate fix, make the focused test pass, then check adjacent behavior. Do not claim
a failure reproduced when only the test harness failed.

For race-sensitive critical suites, use shuffled ordering with a recorded seed
(for example 4204) and five separate process runs to expose module/session
leakage. Use this for changed critical async behavior, not as repetitive testing of
documentation or unrelated trivial edits. Further reruns need new evidence.

Run applicable lint/type/tests/build and root phase verification; add cross-layer
integration when affected. Never mock the hook under test, weaken assertions,
commit .only/.skip/.todo, force exit, use arbitrary sleeps or increase timeouts to
hide races. Cleanup must let the process exit normally.

Report fresh execution versus cached/replayed output. Historical test counts and bundle sizes are not current execution evidence. Test authoring
follows the selected Codex Medium role and independent review policy.

## F31 — Browser, device and deployment evidence

HTTP/jsdom tests do not certify hydration, real Referer/cookies, history, native
share/clipboard or physical camera behavior. Credential flows require real browser
checks for entry/bootstrap/final route, reload/back-forward, credential replacement,
invalid/revoked cases, anonymous/signed-in isolation and read-without-write semantics.

Device features need actual relevant Android/iOS browser checks, rear camera/QR,
permissions, unavailable/runtime failure, hide/show during pending work, same-tab
replacement, manual fallback, 320px and orientation. Mark unperformed checks unverified.

Deployment claims require applicable staging/HTTPS/proxy/log/headers, migration,
key continuity and backup/rollback evidence. No local source fix or old test count
grants release approval. Assess this checkout's own current evidence.

## Worked feature: Item editor through the existing stack

The fictional Item contract is in [API contracts](api-contracts.md), with its
conditional PATCH in [backend standard](backend-standard.md). The GET in this
example is a separately implemented, authenticated, owned detail read returning
the same envelope; its route must exist before integration.

A thin route composes the feature. A feature screen owns useItem and displays
pending/retry/missing/denied states. Only after an authoritative GET succeeds does
it render ItemEditor with a key containing non-secret session scope and item ID.
Transient refresh failure retains the editor but blocks writes if parent eligibility
cannot be confirmed; terminal denial hides protected content at the controlling
layout. The snippets do not implement an entire authorization/query driver.

### Query keys: stable, scoped, non-secret

```ts
// features/items/model/item.keys.ts
export const itemKeys = {
  scope: (scopeId: string) => ["items", scopeId] as const,
  lists: (scopeId: string) => [...itemKeys.scope(scopeId), "list"] as const,
  list: (scopeId: string, page: number, search: string) =>
    [...itemKeys.lists(scopeId), { page, search }] as const,
  detail: (scopeId: string, itemId: string) =>
    [...itemKeys.scope(scopeId), "detail", itemId] as const,
};
```

scopeId is a non-secret cache/session identity, never a bearer or credential.
Feature list/detail keys include every input affecting their result. Normalize
search/filter values before creating both the key and request.

### Safe transport errors before QueryCache/MutationCache

```ts
// services/api/safe-api-error.ts
import axios from "axios";
import { z } from "zod";

const envelope = z.object({
  success: z.literal(false),
  statusCode: z.number().int(),
  code: z.string(),
  requestId: z.string().max(128),
});
const codes = new Set([
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "VERSION_CONFLICT",
  "VALIDATION_ERROR",
  "RATE_LIMIT_EXCEEDED",
  "SERVICE_UNAVAILABLE",
]);

export class SafeApiError extends Error {
  readonly kind = "api-error" as const;
  constructor(
    readonly status: number,
    readonly code: string,
    readonly requestId: string,
  ) {
    super(code); // Approved code only; no raw message, cause or request.
    this.name = "SafeApiError";
    delete this.stack; // Sensitive cache error has no stack payload.
  }
}

export const toSafeApiError = (error: unknown): SafeApiError => {
  if (axios.isCancel(error)) {
    return new SafeApiError(0, "CANCELLED", "");
  }
  const response = axios.isAxiosError(error) ? error.response : undefined;
  const parsed = envelope.safeParse(response?.data);
  const status = response?.status ?? 0;
  const code =
    parsed.success && codes.has(parsed.data.code)
      ? parsed.data.code
      : response === undefined && axios.isAxiosError(error)
        ? "NETWORK_ERROR"
        : "UNEXPECTED_RESPONSE";
  return new SafeApiError(
    status,
    code,
    parsed.success ? parsed.data.requestId : "",
  );
};
```

This conservative example omits raw messages/field errors. Map approved codes to
localized presentation copy. If a form needs field errors, allowlist only its
known paths and safe messages; never spread the raw response. Sanitize server
request IDs at their source too. Cancellation is intentionally not recast into
NETWORK_ERROR. Reuse/enhance an existing safe-error owner rather than duplicate it.

### Feature API: requests and parsed wire output

```ts
// features/items/api/items.api.ts
import { itemResponseSchema, type UpdateItemBody } from "@workspace/contracts";
import { apiClient } from "@/services/api/api-client";
import { toSafeApiError } from "@/services/api/safe-api-error";

export const itemsApi = {
  async get(itemId: string, signal: AbortSignal) {
    try {
      const response = await apiClient.get<unknown>(
        "/items/" + encodeURIComponent(itemId),
        { signal },
      );
      return itemResponseSchema.parse(response.data).data;
    } catch (error: unknown) {
      throw toSafeApiError(error);
    }
  },
  async update(itemId: string, body: UpdateItemBody) {
    try {
      const response = await apiClient.patch<unknown>(
        "/items/" + encodeURIComponent(itemId),
        body,
      );
      return itemResponseSchema.parse(response.data).data;
    } catch (error: unknown) {
      throw toSafeApiError(error);
    }
  },
};
```

No component reads Axios response.data chains. Unknown response bodies are parsed
at this transport boundary. Do not re-parse already trusted DTOs in every component.

### Hooks: server state and scoped reconciliation

```ts
// features/items/hooks/items.hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ItemDto, UpdateItemBody } from "@workspace/contracts";
import { itemsApi } from "../api/items.api";
import { itemKeys } from "../model/item.keys";
import type { SafeApiError } from "@/services/api/safe-api-error";

export const useItem = (scopeId: string, itemId: string) =>
  useQuery({
    queryKey: itemKeys.detail(scopeId, itemId),
    queryFn: ({ signal }) => itemsApi.get(itemId, signal),
    retry: false,
    // Do not carry previous-resource placeholder detail into this resource.
  });

export const useUpdateItem = (scopeId: string, itemId: string) => {
  const client = useQueryClient();
  return useMutation<ItemDto, SafeApiError, UpdateItemBody>({
    mutationFn: (body: UpdateItemBody) => itemsApi.update(itemId, body),
    retry: false,
    onError: async (error) => {
      if (error.code === "VERSION_CONFLICT") {
        await client.invalidateQueries({
          queryKey: itemKeys.detail(scopeId, itemId),
          exact: true,
        });
      }
    },
    onSuccess: async (saved) => {
      client.setQueryData<ItemDto>(
        itemKeys.detail(scopeId, itemId),
        (current) =>
          current !== undefined && current.version > saved.version
            ? current
            : saved,
      );
      await client.invalidateQueries({ queryKey: itemKeys.lists(scopeId) });
    },
  });
};
```

This ordinary editor uses a nonsensitive title/version body. Use the sensitive
wrapper below instead for private credentials/bodies. A cache patch is data and
must not grant access; an access driver tracks real matching GET outcomes separately.
A lower-version late mutation must not overwrite a newer cached result. If a mutation
response is incomplete, invalidate/refetch instead of inventing missing fields.

### Editor model: preserve dirty input and explicit conflict choices

```ts
// features/items/model/editor.ts
import type { ItemDto } from "@workspace/contracts";

export type EditorState = Readonly<{
  base: ItemDto;
  draftTitle: string;
  conflict: ItemDto | null;
}>;

export const receiveItem = (
  state: EditorState,
  incoming: ItemDto,
): EditorState => {
  if (incoming.id !== state.base.id || incoming.version < state.base.version) {
    return state;
  }
  if (state.conflict !== null && incoming.version < state.conflict.version) {
    return state;
  }
  const dirty = state.draftTitle !== state.base.title;
  if (!dirty) {
    return { base: incoming, draftTitle: incoming.title, conflict: null };
  }
  if (incoming.title !== state.base.title) {
    return { ...state, conflict: incoming };
  }
  // Only unrelated fields/version changed. Preserve editable input.
  return { ...state, base: incoming, conflict: null };
};

export const acceptServer = (state: EditorState): EditorState =>
  state.conflict === null
    ? state
    : {
        base: state.conflict,
        draftTitle: state.conflict.title,
        conflict: null,
      };

export const continueDraft = (state: EditorState): EditorState =>
  state.conflict === null
    ? state
    : {
        base: state.conflict,
        draftTitle: state.draftTitle,
        conflict: null,
      };
```

First GET initializes the editor; a new resource gets a new keyed lifecycle.
Unrelated changes can advance the base version without discarding draft text.
Continuing a draft adopts the latest known version deliberately; it does not
authorize a forced write or bypass a conflict that happens afterwards.

### Component: local interaction with handler-level guards

```tsx
// features/items/components/item-editor.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { updateItemBodySchema, type ItemDto } from "@workspace/contracts";
import { FormField } from "@/components/forms/form-field";
import { useUpdateItem } from "../hooks/items.hooks";
import {
  acceptServer,
  continueDraft,
  receiveItem,
  type EditorState,
} from "../model/editor";

type Props = Readonly<{
  scopeId: string;
  item: ItemDto; // First authoritative detail GET has succeeded.
  canWrite: boolean;
  recheckCanWrite: () => boolean;
}>;

export function ItemEditor({
  scopeId,
  item,
  canWrite,
  recheckCanWrite,
}: Props) {
  const mutation = useUpdateItem(scopeId, item.id);
  const [editor, setEditor] = useState<EditorState>({
    base: item,
    draftTitle: item.title,
    conflict: null,
  });
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    setEditor((current) => receiveItem(current, item));
  }, [item]);

  const submit = async (): Promise<void> => {
    if (
      pending.current ||
      !canWrite ||
      !recheckCanWrite() ||
      editor.conflict !== null
    )
      return;
    const parsed = updateItemBodySchema.safeParse({
      title: editor.draftTitle,
      version: editor.base.version,
    });
    if (!parsed.success) {
      setError("راجع العنوان قبل الحفظ.");
      return;
    }
    if (!recheckCanWrite()) return;
    pending.current = true;
    setError(null);
    try {
      const saved = await mutation.mutateAsync(parsed.data);
      // A late mutation result is data, never authorization.
      if (mounted.current && recheckCanWrite()) {
        setEditor((current) =>
          saved.version <
          Math.max(current.base.version, current.conflict?.version ?? -1)
            ? current
            : { base: saved, draftTitle: saved.title, conflict: null },
        );
      }
    } catch {
      if (mounted.current)
        setError("لم يتم تأكيد الحفظ. راجع الحالة وحاول مرة أخرى.");
    } finally {
      pending.current = false;
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      noValidate
    >
      <FormField
        id={"item-title-" + item.id}
        label="العنوان"
        value={editor.draftTitle}
        disabled={mutation.isPending}
        onChange={(event) =>
          setEditor((current) => ({
            ...current,
            draftTitle: event.target.value,
          }))
        }
      />
      {editor.conflict === null ? null : (
        <div role="status">
          <p>تغيّرت البيانات على الخادم. اختر طريقة المتابعة.</p>
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => setEditor(acceptServer)}
          >
            اعتماد بيانات الخادم
          </button>
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => setEditor(continueDraft)}
          >
            متابعة المسودة
          </button>
        </div>
      )}
      {error === null ? null : <p role="alert">{error}</p>}
      <button
        type="submit"
        disabled={!canWrite || mutation.isPending || editor.conflict !== null}
      >
        {mutation.isPending ? "جارٍ الحفظ…" : "حفظ"}
      </button>
    </form>
  );
}
```

This one-field controlled form illustrates the pure editor model. Complex forms
use the existing React Hook Form/Zod helper with distinct schema input/output types,
the same dirty/conflict policy and safe field errors. Do not introduce a universal
form renderer. The existing FormField must preserve native props, labels and
description/error associations.

The parent supplies recheckCanWrite from the current scoped access owner, not a
captured initial boolean. Key the component by scope/resource to isolate route
changes. Suppress post-success UI from stale versions and lost authorization.
Display code-specific conflict/access/error copy in a complete feature; generic
fallback copy must not turn unknown outcomes into confirmed success.

### Access model: denial survives cache writes and older work

```ts
// features/<domain>/model/access.ts
export type AccessState = Readonly<{
  scope: string;
  status: "unknown" | "allowed" | "denied";
  deniedThrough: number;
  latestAuthority: number;
}>;

type Outcome = Readonly<{
  scope: string;
  request: number; // Monotonic ID assigned when a scoped request starts.
  issuedThrough: number; // Highest issued ID when this outcome is observed.
  kind: "get-success" | "denied" | "transient" | "cancelled";
}>;

export const receiveAccessOutcome = (
  state: AccessState,
  event: Outcome,
): AccessState => {
  if (event.scope !== state.scope) return state;
  if (event.kind === "transient" || event.kind === "cancelled") return state;
  if (event.request < state.latestAuthority) return state;
  if (event.kind === "denied") {
    return {
      ...state,
      status: "denied",
      latestAuthority: event.request,
      // Requests already in flight at denial cannot recover access.
      deniedThrough: Math.max(state.deniedThrough, event.issuedThrough),
    };
  }
  if (event.request <= state.deniedThrough) return state;
  return { ...state, status: "allowed", latestAuthority: event.request };
};
```

This is the pure rule, not a global store or a complete hook. Its owner must:

- Live per QueryClient/session/authority/parent/resource; parent and child states
  are distinct. Preserve denial across remount; do not reset it to unknown on reopen.
- Assign monotonic IDs on actual scoped request dispatch and record the highest issued ID
  when denial is observed, creating a barrier for already-running requests.
- Only real matching authoritative GETs emit get-success; real scoped requests
  may confirm denial. Cache updates, reset, mutation success and invalidation
  never emit get-success.
- Classify terminal outcomes using the resource contract; transient errors and
  cancellation cannot recover access.
- Ignore obsolete session/resource generations, and recheck access after any
  asynchronous form validation before writing.
- Clear the owner only on genuine scope/session teardown, not to evade denial.

Tests must cover these integrations in addition to the pure reducer. An identical
but newly fetched authorized resource may recover; object equality is irrelevant.

### Sensitive hook: private inputs outside mutation variables

```tsx
// features/<domain>/hooks/use-sensitive-command.ts
"use client";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { SafeApiError } from "@/services/api/safe-api-error";

type PrivateInput = Readonly<{ credential: string; privateText: string }>;
type SafeResult = Readonly<{ accepted: true }>;

export function useSensitiveCommand(
  execute: (input: PrivateInput) => Promise<SafeResult>,
) {
  const active = useRef<PrivateInput | null>(null);
  const locked = useRef(false);
  const mounted = useRef(false);
  const mutation = useMutation({
    mutationFn: async () => {
      const input = active.current;
      if (input === null) throw new SafeApiError(0, "MISSING_INPUT", "");
      // execute must sanitize transport errors before returning/rejecting.
      return execute(input);
    },
    retry: false,
    gcTime: 0,
  });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const mutateAsync = async (input: PrivateInput): Promise<SafeResult> => {
    if (locked.current) throw new SafeApiError(0, "ALREADY_IN_PROGRESS", "");
    locked.current = true;
    active.current = input;
    try {
      return await mutation.mutateAsync(); // No sensitive mutation variables.
    } finally {
      active.current = null;
      locked.current = false; // Only real settlement releases the lock.
    }
  };
  const reset = (): void => {
    if (!locked.current && mounted.current) mutation.reset();
  };
  return {
    data: mutation.data,
    error: mutation.error,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    mutateAsync,
    reset,
  };
}
```

execute is a feature API adapter that rejects with a safe error and returns a
non-sensitive result. Raw results/credentials must not be stored in mutation data.
The wrapper does not expose raw mutate; reset cannot release a pending request.
A ref retaining input until an active request settles is bounded request lifetime,
not persistent cache storage. Minimize/cancel according to the command's server
semantics; cancellation of local observation does not prove a write was cancelled.

Key the feature/hook owner by scope and ignore obsolete caller completions.
For device workflows add the explicit F15–F19 lifecycle; do not reuse a single
mounted boolean as proof against every request or credential generation race.

## Completion review

Check the actual response/cache, current route identity, dirty input, access owner
and rendered interaction; a disabled button alone is insufficient. Use F IDs to
select meaningful tests and browser evidence. Do not load optional device/privacy
sections into a simple presentation-only task unless that boundary is affected.

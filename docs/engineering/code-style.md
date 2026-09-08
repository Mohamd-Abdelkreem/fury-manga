# Code style and shared-code decisions

## Mechanical source of truth

Use the repository's formatter, TypeScript and ESLint configuration. This baseline
expects strict TypeScript, type-only imports, unknown catch values, exact optional
semantics and deliberate handling of unchecked indexes. Preserve checks rather
than weakening them to fit a generated solution.

Follow existing formatting; when bootstrapping compatible TypeScript work, the
baseline is two spaces, double quotes, semicolons and LF. A project config is the
executable owner; avoid a second competing config. Match each package's actual
runtime/bundler import-extension convention.

## Names and responsibility

- Names describe domain and operation; avoid handleData/processEverything/utils
  as containers for unrelated behavior.
- Files follow local conventions. Backend examples use domain.role.ts; web features
  use api/hooks/model/components. Do not mass-rename established UI folders.
- Controllers/services use the existing class/constructor-injection style.
  Routes, pure mappers, query helpers and rules may be functions.
- Split at a real responsibility, independent change or test boundary. No arbitrary
  line-count caps, empty interfaces or five-line file matrix.
- A module index exports its intended public surface, not every internal helper.
  Avoid cycles and service initialization during imports.
- Constants have meaningful owners; use canonical enum/action/reason members
  instead of repeated raw backend strings. No global constants dump.

## Types and values

Use inferred locals and explicit public boundaries. Public HTTP types come from
shared schemas; database records remain server-owned. Use readonly values when
mutation is not part of the API. Narrow unknown input before reading it.

No any, fake double casts, non-null assertions that conceal missing data, ts-ignore,
ts-nocheck or broad lint disables. A necessary narrow framework integration assertion
must identify the already-validated boundary and have coverage. It must not fabricate
runtime validation or cast a DTO into a database model.

Preserve missing versus null versus empty values. Do not introduce default IDs or
zero counts to hide unavailable state. Use discriminated unions when alternatives
have different behavior; do not impose a universal ban on booleans/null/undefined.

## Functions, async work and comments

Prefer named steps and early returns over nested expressions. Controllers store
awaited service results in const before response helpers. Catch only to recover,
translate, compensate or deliberately report; never catch to return false success.

Await work whose completion/failure matters. Detached work needs an explicit failure
and lifecycle policy; a caught promise is not a durable background job. Inject
time/ID/provider seams when meaningful business behavior depends on them.

Comments explain why, security invariants, compatibility and concurrency conditions,
not obvious syntax. Keep them synchronized with the code.

## When a helper belongs in shared

Keep it feature-local unless at least two actual independent consumers share the
same stable responsibility. Shared code must not import a feature to make itself
work. Choose a name that exposes the contract and test its independent behavior.
A small amount of clear duplication can be preferable to coupling unrelated domains.

A shared helper is not a hiding place for business policy. This example is a pure
bounded conversion; the public schema still decides which field uses it.

```ts
export const toOptionalTrimmedText = (
  value: string | null | undefined,
): string | null | undefined => {
  if (value === undefined) return undefined; // Omitted: do not update.
  if (value === null) return null; // Explicit clear.
  const normalized = value.trim();
  return normalized.length === 0 ? null : normalized;
};
```

Do not silently apply this to passwords, whitespace-significant content or fields
whose contract rejects blank input. Reuse a schema transform instead where it
already owns normalization.

## Review questions

Can the next maintainer see the operation and failure boundary? Is each abstraction
justified by an actual responsibility? Did the change preserve configuration and
avoid unrelated refactors? Are optional/unknown values handled truthfully?

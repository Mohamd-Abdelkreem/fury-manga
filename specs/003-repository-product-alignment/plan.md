# P00 Implementation Plan

**PLAN.md phase**: P00 — Repository and Product Alignment. The feature number is retrospective because P01/P02 records already existed; roadmap order remains P00 → P01 → P02.

## Constitution Check

| Gate                     | Disposition and evidence target                                                                                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I/VIII scope and phase   | PASS for design: only P00 corrections and evidence; preserve P01/P02 code and user edits. Exit acceptance waits for fresh checks.                                                                                                                |
| II authority and privacy | PASS for design: retire phone from account ingress/output/storage; reuse current protected-route behavior for the fixture reader, leaving P07 API authority untouched.                                                                           |
| III contracts            | PASS for design: remove phone from shared strict inputs and safe user output, API mapper/service, web form values, and HTTP tests together. Existing envelope/auth/CSRF remains.                                                                 |
| IV ownership             | PASS for design: keep account changes in current owners and client route guard in the existing web auth component. No new framework, client, or dependency.                                                                                      |
| V data                   | PASS for design: new forward migration after P01 removes legacy phone; existing account/session rows remain. Test fresh and populated upgrades in disposable PostgreSQL. Production execution requires separate authorization and backup review. |
| VI frontend truth        | PASS for design: preserve current RTL visuals, correct positive-integer control, hide reader content before session approval, label local feedback, disable fake ad delivery.                                                                    |
| VII evidence             | PASS for design: focused contract, PostgreSQL migration, real HTTP, web interaction/route, and repository gates are listed below. Browser claims need real-browser evidence.                                                                     |
| Change safety            | PASS for design: preserve `.specify/feature.json` pointing to P02 and all current user edits; do not edit applied migrations, generated Prisma code, or `PLAN.md`.                                                                               |

## Current state and ownership

- The constitution is ratified and root `AGENTS.md` references resolve. P00 still lacks an independently accepted implementation record.
- `packages/database/prisma/schema.prisma` and the account/auth contracts retain `phone`; API user mapping and registration still use it. Existing initial/P01 migrations are historical and stay unchanged. Add one forward removal migration and update the migration-chain tests.
- The chapter form currently accepts zero/fractions. Its save is fixture/context state, not P04 persistence. Change validation and user copy without connecting content APIs.
- The sample chapter route is outside the protected workspace layout. Compose it with the current `ProtectedRoute`, rendering the chapter component only after the active/verified decision. P07 owns future server-authoritative reader data/access.
- Text-reader completion is local. Public ad slots/detection are enabled by constants, but no provider is connected. Correct local wording and disable slots/detection until P13, preserving their design code.
- Admin context, public comments, support forms, gifts, notifications, library and reader content still include fixture or local actions. Add a checked-in inventory and correct visible false persistence/delivery claims in the P00-owned presentation boundary; later phases own real behavior.
- Recheck `DESIGN-SYSTEM-INCONSISTENCIES.md` against current source and record each finding as fixed, open, or superseded; do not redesign unrelated UI.

## Contract, data, and rollout decisions

- Registration accepts full name, email, password; profile update accepts nonempty full name. Phone input is unknown and rejected. Safe account output omits phone. Existing clients sending phone will receive validation failure, so this is a coordinated incompatible request/output change; account consumers and tests move together.
- The new migration drops the nullable legacy phone column after existing P01 migration. It does not alter account identity, credentials, verification, refresh sessions, or content data. Legacy phone values are intentionally retired under PLAN.md P00. Backup before any production execution; rollback is application rollback to a version that no longer expects phone, not migration reversal. No production deploy in this task.
- Keep the current API error/status/request-ID/CSRF transport. No new endpoint. Read-only fixture reader protection is a client presentation gate, not API data authority.
- Local-only actions must not announce durable success. Use explicit Arabic session/preview wording while preserving form drafts and navigation. Public contact/issue forms cannot claim receipt until P11.
- Existing ad placement design remains present in source, but public rendering and detection are disabled until P13 config/provider integration.

## Verification and exit

1. Contract tests reject phone input and output; real HTTP account tests preserve register/verify/login/profile/CSRF and omit phone.
2. Disposable PostgreSQL tests deploy initial → P01 → new P00 migration with populated account/session data, assert data preservation and phone absence, then redeploy. Do not run against developer or production databases.
3. Web tests cover zero/fraction/negative/empty/positive chapter numbers, protected fixture reader states, session-local completion copy, no ad/detection, and truthful local-only messages.
4. Review inventory/design audit/obsolete concepts against current source, then run relevant package tests, lint, type checks, build, browser route check, formatting, and `git diff --check`. Record failures; do not weaken checks or claim unrun browser/device evidence.

No new dependencies or later-phase persistence are planned. Completion requires every applicable P00 exit item in `PLAN.md` and its evidence record to pass.

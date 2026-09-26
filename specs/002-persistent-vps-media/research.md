# P02 Technical Research

All choices below resolve technical planning questions; no product `NEEDS CLARIFICATION` remains. Current checkout evidence was read on 2026-09-23.

## Multipart ingress and decoded image validation

**Decision:** Add direct API dependencies on `busboy` and `sharp` (and the matching Busboy TypeScript declarations). Use Busboy only on the authenticated media POST route with one file, one bounded class field, and explicit total/part/field/file/header limits. Check its `truncated` flag and every limit event before success. Use Sharp in an injected image-validation adapter to inspect and fully decode the claimed JPEG, PNG, or WebP, reject multi-frame/animated input, enforce class bounds and real alpha pixels for frame/decoration, auto-orient, and re-encode to a known safe format without source metadata. The extension, declared part MIME, detected format, and decoded result must agree. The resulting bytes, not untrusted input bytes, are delivered.

**Evidence:** The API manifest has no multipart or image-decoder dependency; `express.json` and `urlencoded` do not parse multipart. The browser avatar picker checks only `File.type` and length. [Busboy's official README](https://github.com/mscdex/busboy#api) provides streaming and finite limits and explicitly requires checking file truncation. [Sharp's input documentation](https://sharp.pixelplumbing.com/api-input/) distinguishes metadata from decoded pixels and documents input pixel bounds; [output documentation](https://sharp.pixelplumbing.com/api-output/) documents metadata-stripping output. The installed Next.js 16 [Image reference](../../apps/web/node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md) notes authenticated images should use `unoptimized`.

**Rejected:** Browser MIME checks as authority; `express.json` base64 uploads (inflates request and lacks streaming); hand-written multipart parsing; trusting Sharp metadata alone; adding a second image optimization server or generic upload framework. These do not establish the exact validation and resource boundaries P02 requires.

## Private delivery and web ownership

**Decision:** All P02 asset metadata and bytes require the established bearer session. The media feature API obtains private bytes through the central `apiClient` and produces an ephemeral object URL for its active preview; it revokes that URL on scope change/unmount. React Query owns metadata/list/attempt server state and scoped invalidation, while file input, progress, abort, and blob URL stay transient in the media hook/component. Keep `next/image` unoptimized for temporary blob previews. Do not add a Next route handler, remote pattern, public static path, service worker, or separate HTTP client.

**Evidence:** `apiClient` already injects the memory-held bearer, refreshes 401 once, and adds double-submit CSRF on unsafe methods. `next.config.ts` has no remote image allowlist. Next.js [Server and Client Components](../../apps/web/node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md) directs browser APIs and event handlers to client components; its [Image reference](../../apps/web/node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md) calls out authenticated sources. Browser `<img>` requests cannot attach the in-memory bearer through this API client. Protected bytes must not enter a public optimizer cache.

**Rejected:** A public guessable URL for unbound media, credential query strings, Next optimizer fetch of protected content, or persisting blob bytes in React Query. Each would weaken privacy or split authority.

## Filesystem and PostgreSQL consistency

**Decision:** Keep image files under a configured absolute VPS directory outside the release tree. Give each asset an immutable UUID and server-derived relative key. Stage and validate a file in a private directory on the same filesystem, flush it, record its canonical hash on the reserved pending asset, then atomically rename to its immutable final key before marking the database asset `AVAILABLE`. A row remains `PENDING` and non-deliverable until that final update succeeds. Crash leftovers are reconciled by an operator-run bounded recovery command: complete validated final bytes and the reserved identity can settle the actor's attempt to accepted; incomplete or unprovable bytes settle it to rejected with `UPLOAD_INCOMPLETE` and require a new upload key. A rejected reserved asset is retired without exposure. Removal first atomically blocks new references in PostgreSQL, then unlinks, then marks `REMOVED`; interrupted removal is resumable. Backup/restore uses a coordinated snapshot, verifies hashes and references, and keeps serving disabled until reconciliation succeeds.

**Evidence:** Existing P01 rows and migrations contain no file identity. PostgreSQL cannot atomically commit a filesystem rename. The constitution requires forward migrations, explicit external side-effect recovery, and no false success. The P02 spec forbids automatic expiration of unbound accepted assets.

**Rejected:** Saving beneath `apps/web/public` or an API release folder; storing files in PostgreSQL; claiming a transaction covers file writes; detached cleanup promises; automatic expiry of unbound assets. These conflict with persistent VPS storage, scale of binary I/O, or accepted lifecycle.

## Reference and concurrency boundary

**Decision:** Add P02-owned reference operations only for existing P01 Work cover/background and illustrated ChapterPage identities. A live reference points to an available class-matched asset. Lock the asset row for both new binding and removal, and use a version plus expected current asset for replacement/retirement. Retain retired reference rows, enforce one live reference per target slot with PostgreSQL partial unique indexes, and reject physical removal while any live reference exists. Upload attempt identity is scoped to its authenticated actor, so two actors may independently use the same UUID without revealing each other's attempt state. Future P03/P04/P10 integrations must call this service or extend the reference model, not write file pointers independently.

**Evidence:** P01 has Work and ordered ChapterPage identities but no media FK. P02 FR-013–FR-018 and the accepted clarification require traceable uses, conflict on referenced removal, stable repeat outcomes, and no broken references. P03/P04 own parent editing; a narrow reference operation is explicitly allowed by FR-024.

**Rejected:** Adding work editing/publishing to P02; deleting referenced bytes after a delayed timer; an application-only count check; generic polymorphic `targetType/targetId` without real FKs.

## Bounds and variants

**Decision:** Publish finite per-class byte/dimension bounds in the contract, with the existing avatar 4 MiB limit unchanged. Shared decoded pixel ceiling: 24,000,000 pixels, one frame, and finite input bytes. Use cover ratio 0.65–0.85 around the UI's 3:4 intent and background ratio 1.5–2.0 around its 16:9 intent; no speculative ratio for pages, avatars, frames, or decorations. Specific bounds appear in `contracts/media-http.md` and drive server/browser hints and tests. Do not generate catalog thumbnails in P02.

**Evidence:** The current work control labels cover 3:4 and background 16:9, the avatar picker publishes 4 MiB, and P02 has no public catalog media consumer. P05 owns catalog rendering. The remaining ceilings are conservative validation defaults to control upload/decode work, not traffic, latency, or business KPIs; they must be acceptance-reviewed against representative approved artwork before implementation.

**Rejected:** Unbounded pages or image dimensions; pretending the current 140×190/280×140 previews are hard server size limits; generating public catalog variants before a catalog asset contract exists.

## Release prerequisite

P00/P01 exit-gate acceptance and reviewer disposition of the P02 Draft spec/checklist are not established by this research. Confirm them before implementation. No production VPS path, process topology, backup destination, or real-device behavior is inferred from local files.

# P04 Research Decisions

The active feature is `specs/005-admin-chapter-publishing` and traces to PLAN.md P04. These decisions resolve implementation choices in the draft [specification](spec.md); they do not extend the phase or imply reviewer acceptance.

## R1 — One Chapter revision owns illustrated pages

**Decision:** Treat an illustrated Chapter edit as one complete ordered page-set replacement with an expected Chapter version. Each retained page carries its stable page ID; each new page carries an accepted private `chapter_page` asset ID. The Chapter service coordinates page identity, active association, immutable media-reference events, and one Chapter version advance in a single transaction. A page omitted from the submitted set becomes retired, retaining its row and reference history. Reordering does not create new page IDs or reference events when the associated asset is unchanged.

**Rationale:** `chapter-management.service.ts` currently deletes and recreates page rows on replacement, whereas P02 media references use restrictive foreign keys and retained events. The generic media-reference write endpoints do not lock or version the parent Chapter, allowing edits around Chapter publication. P03 already demonstrates caller-owned reference operations inside a content transaction in `media.service.ts`. The Chapter lock precedes sorted media asset locks, then page/reference locks; serialization failures use the established bounded retry policy and become safe conflict responses when exhausted.

**Alternatives considered:** Keep page-position-only writes (cannot bind an actual image); independently call P02 bind/replace/retire from the browser (partial revisions and version bypass); delete/recreate rows (breaks retained reference identity); keep generic Chapter-page writes alongside aggregate save (two writers for one invariant).

**Compatibility choice:** P04 transfers `chapter_page` reference _writes_ to Chapter create/update. Generic POST can reject `targetKind: 'chapter_page'` after ADMIN/CSRF/validation and before target lookup. Generic PUT/DELETE receive only a reference ID, so after ADMIN/CSRF/validation they must classify that ID through an authorized lookup before deciding whether it belongs to a Chapter page. A found Chapter-page reference returns a safe conflict without looking up or exposing its parent or asset; an unknown ID retains the non-disclosing 404; Work-reference writes retain their P02 behavior. Generic reference reads, uploads, and asset lifecycle remain. Update the P02-facing shared media contract, OpenAPI, adapters/tests, and operational guidance together. This deliberately changes the P02 write contract.

## R2 — Draft completeness and existing data

**Decision:** Store an empty text draft with `textContent: null` and an empty illustrated draft with zero active pages. Require title and positive whole number even for drafts. Complete text is the existing version-1 structured document; complete illustrated content means at least one consecutively ordered active page with an available, accepted, correct-class admin image. Publish and edits to an already published Chapter check complete readiness. Existing rows receive no fabricated title or media association.

**Rationale:** The current structured document schema requires at least one block, and the original database text-content check requires a non-null object for every text Chapter. An additive forward migration must relax _draft/archived_ text storage while retaining strong published readiness. Existing published rows may lack titles or bound images. A preflight inventory and explicit administrator remediation must precede enforcing the final constraints and connecting the UI. Preserve their IDs and publication events; do not silently promote, delete, or invent content.

**Alternatives considered:** Dummy empty paragraph/title (false editorial data); hard delete or automated unpublish of legacy records (unapproved visibility change); publish with unbound positions (false readiness); rewrite applied P01/P02 migrations (unsafe).

## R3 — Availability and public visibility

**Decision:** Use one server-side public eligibility predicate for list rows, filtered total, and detail: published eligible Work, published Chapter, and, for illustrated content, at least one active page with exactly one active reference to an available accepted image and no active page violating that condition. Read parent, rows, and count from a consistent snapshot. A later unavailable asset hides Chapter public metadata while keeping admin publication state and event history; verified repair restores metadata without publishing again.

**Rationale:** P02 reconciliation can mark assets unavailable after publication. The current public Chapter query filters only publication state, and current publication checks only count pages. Availability is dynamic, so a permanent database check that all published images stay AVAILABLE is not viable. Physical damage may precede reconciliation; private media delivery must independently fail closed and reconciliation must run before asserting public integrity.

**Alternatives considered:** Auto-unpublish on media damage (creates unauthorized lifecycle events); return partially readable metadata (contradicts accepted clarification); rely on UI filtering (leaks via API); return list/count from separate inconsistent snapshots.

## R4 — Canonical text editing and rendering

**Decision:** Keep the existing strict version-1 structured text wire format and bounds. Replace the Markdown-like textarea/preview split with a direct structured-document editor model. Extract one feature-local, inert renderer for paragraphs, H2/H3, emphasis, lists, and root-relative same-site links, used in admin preview and reusable by P07; do not connect the fixture reader. Rendering uses text nodes and validated link attributes, never raw HTML.

**Rationale:** `content.schema.ts` already defines the accepted document and excludes quote/image/markup. The current text editor writes Markdown-like text and the preview approximates it. A single canonical representation and renderer give save/reload/preview parity without bringing P07 forward.

**Alternatives considered:** Extend Markdown parsing (second representation and sanitization path); import a rich-editor dependency (no demonstrated need); create public reader routes now (P07 scope).

## R5 — Contract, list, and browser state ownership

**Decision:** Extend the shared Chapter schemas and existing route family. Admin list returns bounded summary DTOs, while admin detail returns full body/pages; public output adds title only to the existing metadata projection. Use feature `api` for runtime envelope parsing through central `apiClient`, `hooks` for actor/Work-scoped React Query cache and mutation reconciliation, `model` for form/command transforms, and components for transient drafts. Query filter/sort/page state must be explicit and stable; list rows and total come from the same filtered database snapshot.

**Rationale:** Current admin list returns up to 100 full structured documents; P04 adds media association details and search/sort. P03 already has the owner split and safe error mapping. The current Chapter components use fixture context and local actions. Existing Next.js App Router pages are thin wrappers; the installed Next 16 docs confirm the current client boundary and data ownership pattern.

**Alternatives considered:** Keep full bodies in the list (unbounded payload growth within the existing 100-row limit); introduce a global Chapter store or new transport (parallel server-state/auth model); use fixture fallback on errors (false success).

No product-level clarification remains in the accepted specification. Operational title/media remediation, deployment sequencing, browser/device evidence, and rollback rehearsal remain implementation and release gates, not assumed results.

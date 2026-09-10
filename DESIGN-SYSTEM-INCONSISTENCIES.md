# Fury Design-System Inconsistencies

Material departures found during the complete Fury frontend audit on 2026-09-11.
This report describes the current checkout; it does not redesign or refactor the
application. The approved baseline is [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).

## 1. How to read this report

Every item is evidence-backed and classified separately from the canonical system.
An implementation is not canonical merely because it exists.

| Priority          | Meaning                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **P1 — blocking** | Prevents reliable access, comprehension, operation, or truthful use of a core flow. Resolve before treating the affected pattern as reusable. |
| **P2 — material** | Creates a visible, structural, responsive, performance, or maintainability conflict. Resolve in the next relevant implementation pass.        |
| **P3 — cleanup**  | Low-risk drift or dead material that obscures the system but does not currently block a core flow.                                            |

Decision labels follow the companion design system:

- **Observed** — directly present in source or a rendered route.
- **Consolidated** — the canonical resolution derived from repeated, shared, or
  core-screen evidence.
- **Semantic exception** — an intentional difference that should remain local.
- **Unverified** — could not be asserted under the available environment.

## 2. Priority summary

| ID     | Priority | Area                       | Material conflict                                                                    |
| ------ | -------- | -------------------------- | ------------------------------------------------------------------------------------ |
| FUR-01 | P1       | Custom selects and filters | Mouse-only options, missing disclosure semantics, and hidden native checkboxes       |
| FUR-02 | P1       | Global navigation          | Unnamed icon controls and incomplete menu/dialog behavior                            |
| FUR-03 | P1       | Hero carousel              | Unnamed controls, hover-dependent navigation, and unpausable automatic motion        |
| FUR-04 | P1       | Motion                     | No reduced-motion accommodation anywhere in the frontend                             |
| FUR-05 | P1       | Focus                      | Global focus coverage is incomplete and comments explicitly suppress focus           |
| FUR-06 | P1       | Touch targets              | Several primary interactive targets render below the 24 CSS px minimum               |
| FUR-07 | P1       | Contrast                   | White text on the primary red fails WCAG AA for normal-size text                     |
| FUR-08 | P1       | Product truthfulness       | Multiple visible controls and links advertise actions that do nothing or go nowhere  |
| FUR-09 | P1       | Session loading            | Loader markup and CSS target different elements, producing a broken state            |
| FUR-10 | P1       | Route states               | Authentication failures tear down the surrounding shell and mix languages            |
| FUR-11 | P1       | Story responsiveness       | Similar-story cards collapse to unusably narrow proportions at tablet widths         |
| FUR-12 | P2       | Reader responsiveness      | Inclusive `768px` media rules apply mobile and desktop behaviors simultaneously      |
| FUR-13 | P2       | Language and direction     | English-heavy workspace and story fragments conflict with global Arabic RTL context  |
| FUR-14 | P2       | Global error states        | The root error document switches language and renders an unstyled reset button       |
| FUR-15 | P2       | Tokens                     | Aliases and raw values give the same concepts conflicting names and behaviors        |
| FUR-16 | P2       | Component ownership        | Parallel select patterns and dead component CSS obscure the reusable source of truth |
| FUR-17 | P2       | Images and fonts           | Raw images and CSS font imports bypass the application's framework-level pipeline    |
| FUR-18 | P2       | Home media rail            | The same short video is duplicated and dominates the mobile page                     |
| FUR-19 | P2       | Dynamic story data         | Every story identifier resolves to one fixed story record                            |
| FUR-20 | P2       | Reader semantics           | The reading surface lacks a `main` landmark and uses pointer-only hotspot elements   |
| FUR-21 | P2       | Generic carousel           | Previous/next methods and disabled states are cross-wired                            |
| FUR-22 | P2       | Small text                 | Repeated 9–14px interface copy is below the canonical mobile reading baseline        |
| FUR-23 | P3       | Asset hygiene              | Zero-byte and starter assets remain in `public` without live consumers               |

## 3. Detailed findings

### FUR-01 — Custom selects and filters are not keyboard-complete

**Priority:** P1 — blocking  
**Routes:** `/discover`, `/story/[id]/chapter/[chapterId]`  
**Decision:** **Consolidated**

**Evidence**

- Discover filter triggers are buttons, but expose no `aria-expanded`,
  `aria-controls`, or `aria-haspopup` state
  (`apps/web/src/features/discover/components/DiscoverFilters/DiscoverFilters.tsx:110-243`).
- The genre checkboxes are visually removed with `display: none`, which also removes
  them from keyboard navigation
  (`apps/web/src/features/discover/components/DiscoverFilters/DiscoverFilters.module.css:200-205`).
- Reader options are clickable `li` elements without option roles or keyboard entry
  (`apps/web/src/app/story/[id]/chapter/[chapterId]/page.tsx:55-84`).
- Runtime keyboard inspection confirmed that Escape did not close either open menu,
  and reader options reported `tabIndex=-1` and no role.

**Conflict**

The controls visually promise native select/menu behavior but do not supply its name,
state, focus movement, selection announcement, Escape behavior, or keyboard operation.

**Canonical resolution**

Use a native `select` where styling permits. Otherwise, one shared custom-select
primitive must own trigger state, listbox/menu semantics, focus management, arrow-key
behavior, Enter/Space selection, and Escape dismissal. Keep native checkboxes
focusable and visually hide them with a screen-reader-safe technique.

### FUR-02 — Global navigation controls are unnamed and menus are incomplete

**Priority:** P1 — blocking  
**Routes:** all routes using the public navbar  
**Decision:** **Consolidated**

**Evidence**

- The notification and mobile-menu icon buttons have no accessible names, expanded
  state, or controlled-element relationship
  (`apps/web/src/features/home/components/Navbar/Navbar.tsx:184-226`,
  `apps/web/src/features/home/components/Navbar/Navbar.tsx:310-375`).
- Notification rows are clickable `div` elements rather than links or buttons
  (`apps/web/src/features/home/components/Navbar/Navbar.tsx:243-260`).
- Runtime inspection found that the mobile menu remained open after Escape.
- The search field displays `Ctrl K`, but the component registers no matching keyboard
  shortcut (`apps/web/src/features/home/components/Navbar/Navbar.tsx:160-178`).

**Conflict**

The persistent navigation is a core control surface, yet assistive technology cannot
identify or operate all of its controls predictably. The visible shortcut also claims
behavior that is not implemented.

**Canonical resolution**

All icon buttons need localized names. Disclosure controls need `aria-expanded` and
`aria-controls`; menus need Escape dismissal and deliberate focus return. Interactive
notification rows must use semantic links/buttons. Hide the shortcut hint until the
shortcut exists.

### FUR-03 — Hero carousel control and timing semantics are incomplete

**Priority:** P1 — blocking  
**Route:** `/`  
**Decision:** **Consolidated**

**Evidence**

- Previous/next buttons and slide dots have no accessible names; the active dot has
  no programmatic selected/current state
  (`apps/web/src/features/home/components/HeroSection/HeroSection.tsx:301-330`).
- The hero advances every seven seconds
  (`apps/web/src/features/home/components/HeroSection/HeroSection.tsx:460-464`).
- Arrow opacity is introduced by section hover, making the affordance pointer-led
  (`apps/web/src/features/home/components/HeroSection/HeroSection.module.css:16-19`).
- Runtime inspection at 390px found eight unnamed visible buttons; hero dots rendered
  as 8×8px or 24×8px.

**Conflict**

The carousel changes content automatically without a pause mechanism and its controls
cannot be reliably named or selected by keyboard and assistive technology.

**Canonical resolution**

Name previous/next controls in Arabic, expose the active slide on the dot control,
keep controls visible on keyboard focus and touch layouts, pause on interaction or
focus, and offer a persistent pause control when automatic rotation is retained.

### FUR-04 — Motion has no reduced-motion path

**Priority:** P1 — blocking  
**Routes:** global  
**Decision:** **Consolidated**

**Evidence**

- Global animation utilities define fade, scale, shimmer, pulse, spin, and continuous
  effects (`apps/web/src/styles/globals.css:158-198`).
- Hero rotation is timed automatically
  (`apps/web/src/features/home/components/HeroSection/HeroSection.tsx:460-464`).
- The home route autoplays two videos (`apps/web/src/app/page.tsx:38-54`).
- A complete source search found no `prefers-reduced-motion` rule in `apps/web/src`.

**Conflict**

Continuous and automatic motion cannot be disabled through the user's operating-system
preference.

**Canonical resolution**

Add one global reduced-motion policy that removes nonessential transitions and looping
animation, prevents automatic carousel advancement, and avoids autoplaying decorative
video. Preserve only motion required to communicate state.

### FUR-05 — Focus visibility is incomplete

**Priority:** P1 — blocking  
**Routes:** global; especially story comments and custom controls  
**Decision:** **Consolidated**

**Evidence**

- The shared focus rule covers only `button`, `a`, and `input`
  (`apps/web/src/styles/integration.css:19-24`).
- The comments textarea removes its outline without a replacement
  (`apps/web/src/features/story/components/CommentsSection/CommentsSection.module.css:44-59`).
- Clickable `div` and `li` controls elsewhere have no focusable semantic element to
  receive the shared ring (FUR-01, FUR-02, FUR-20).

**Conflict**

Keyboard users can lose location on textareas and cannot focus some pointer-only
controls at all.

**Canonical resolution**

The global focus contract must include every native control, including `textarea` and
`select`, plus explicit focus styling for any justified custom widget. Do not remove a
native outline until an equal or stronger visible replacement is applied.

### FUR-06 — Several interactive targets are too small

**Priority:** P1 — blocking  
**Routes:** `/`, `/story/[id]`, shared navbar  
**Decision:** **Consolidated**

**Evidence**

- Hero dots are explicitly 8px high and usually 8px wide
  (`apps/web/src/features/home/components/HeroSection/HeroSection.tsx:318-329`).
- Comment actions render as approximately 22px-high controls in the browser; their
  typography is `0.72rem`
  (`apps/web/src/features/story/components/CommentsSection/CommentsSection.module.css:156-172`).
- Navbar icon controls are 36×36px
  (`apps/web/src/features/home/components/Navbar/Navbar.module.css:163-175`).

**Conflict**

Primary pointer targets fall below the canonical 44px comfortable target and, in the
smallest cases, below the 24 CSS px WCAG minimum used by the audit.

**Canonical resolution**

Retain compact visible glyphs when desired, but enlarge their invisible button boxes
to at least 24×24px and normally 44×44px on touch surfaces. Preserve adequate spacing
between adjacent targets.

### FUR-07 — Primary red cannot carry normal-size white text accessibly

**Priority:** P1 — blocking  
**Routes:** global  
**Decision:** **Consolidated**

**Evidence**

- Primary red is `#ff4747`; its foreground is white
  (`apps/web/src/styles/globals.css:21-23`).
- Shared filled buttons apply that pairing
  (`apps/web/src/styles/integration.css:124-147`).
- The computed contrast of `#ffffff` on `#ff4747` is **3.36:1**, below WCAG AA's
  4.5:1 threshold for normal text. White on the observed darker red `#e02828` is
  **4.66:1**.

**Conflict**

The branded primary action style is reused for normal-size labels that do not meet the
canonical text contrast requirement.

**Canonical resolution**

Preserve `#ff4747` as the brand accent, not as an unrestricted text-bearing surface.
For normal-size white labels, use a sufficiently dark red surface (the observed
`#e02828` passes) or choose a foreground/surface pairing that reaches 4.5:1.

### FUR-08 — Visible controls advertise unavailable behavior

**Priority:** P1 — blocking  
**Routes:** `/`, `/discover`, `/story/[id]`  
**Decision:** **Consolidated**

**Evidence**

- Discover's form only prevents submission; it does not apply the selected filters
  (`apps/web/src/features/discover/components/DiscoverFilters/DiscoverFilters.tsx:102-106`).
- The discover next-page button has no action
  (`apps/web/src/features/discover/components/DiscoverGrid/DiscoverGrid.tsx:19-25`).
- The Discord join button has no action
  (`apps/web/src/features/home/components/DiscordBanner/DiscordBanner.tsx:108-140`).
- Footer tags are pointer-styled `span` elements
  (`apps/web/src/features/home/components/Footer/Footer.tsx:108-134`,
  `apps/web/src/features/home/components/Footer/Footer.module.css:61-66`).
- Footer and hero navigation data include `#` destinations
  (`apps/web/src/features/home/components/Footer/Footer.tsx:153-174`,
  `apps/web/src/features/home/components/Footer/Footer.tsx:199-220`,
  `apps/web/src/features/home/data/heroData.ts:3-8`), and the navbar exposes an
  unimplemented `Ctrl K` hint.
- Comment likes and replies are rendered as buttons but have no handlers
  (`apps/web/src/features/story/components/CommentsSection/CommentsSection.tsx:116-127`).

**Conflict**

The UI violates Fury's truthful-state rule: controls appear available while their
outcome is absent, local-only, or a placeholder.

**Canonical resolution**

Implement the represented outcome, or render the element as noninteractive content
with honest copy. Placeholder destinations and shortcut hints must not ship as active
affordances. Local-only demo behavior should be identified as such.

### FUR-09 — Session loader markup and styles do not match

**Priority:** P1 — blocking  
**Routes:** authentication and workspace guards  
**Decision:** **Consolidated**

**Evidence**

- Loader markup puts `session-loader` on `main` and a child named
  `session-loader__pulse` inside it
  (`apps/web/src/components/auth/session-loader.tsx:1-8`).
- CSS sizes and rotates `.session-loader` itself as a 48px circle; no rule styles the
  child (`apps/web/src/styles/integration.css:405-413`).

**Conflict**

The state landmark becomes the spinner glyph instead of containing a visible spinner.
The class contract is structurally inconsistent and easy to break further.

**Canonical resolution**

Keep `main.session-loader` as the full state container and apply the animated circle to
its child. The container owns centering and live/busy semantics; the decorative pulse
owns size, border, and animation.

### FUR-10 — Authentication errors replace the route shell

**Priority:** P1 — blocking  
**Routes:** `/auth/*`, `/dashboard`, `/settings`  
**Decision:** **Consolidated**

**Evidence**

- Guest-route session failure returns a bare `.route-state`
  (`apps/web/src/components/auth/guest-only-route.tsx:54-64`).
- Protected-route session failure does the same and displays the raw API message in
  English (`apps/web/src/components/auth/protected-route.tsx:79-90`).
- With the configured API unavailable, runtime rendering confirmed that auth and
  workspace pages showed no normal navigation, page shell, or main content around the
  error.

**Conflict**

A recoverable session check changes the entire page grammar, removes orientation and
navigation context, and exposes inconsistent language.

**Canonical resolution**

Route guards should provide state content to their owning shell. Preserve the auth or
workspace structure, localize safe user-facing messages, keep the request ID secondary,
and expose a meaningful retry or navigation path where recovery is possible.

### FUR-11 — Similar-story cards collapse at tablet widths

**Priority:** P1 — blocking  
**Route:** `/story/[id]`  
**Decision:** **Consolidated**

**Evidence**

- Story content changes to a `260px 1fr` two-column layout at 768px
  (`apps/web/src/app/story/[id]/page.module.css:43-48`).
- The nested similar-story grid also changes to four columns at 768px
  (`apps/web/src/features/story/components/SimilarStories/SimilarStories.module.css:34-52`).
- Browser measurements for the first cover were 178×237px at 640px, then only
  85×113px at 768px and 137×182px at 1024px before recovering to 201×267px at 1280px.

**Conflict**

Two individually plausible breakpoints combine to create a severe nested-layout
regression: the main column becomes narrower at the same moment its card count grows.

**Canonical resolution**

Base nested-grid decisions on the component's available width, not only viewport
width. Until container queries are adopted, keep fewer columns through tablet widths
and increase only when the story main column can preserve canonical cover/card sizing.

### FUR-12 — Reader media rules collide at exactly 768px

**Priority:** P2 — material  
**Route:** `/story/[id]/chapter/[chapterId]`  
**Decision:** **Consolidated**

**Evidence**

- Desktop control and navigation rules start at `min-width: 768px`
  (`apps/web/src/app/story/[id]/chapter/[chapterId]/page.module.css:108-115`,
  `apps/web/src/app/story/[id]/chapter/[chapterId]/page.module.css:319-326`).
- Edge-to-edge mobile reader rules end at `max-width: 768px`
  (`apps/web/src/app/story/[id]/chapter/[chapterId]/page.module.css:518-536`).
- At a 768px browser viewport, the reader rendered full-bleed while desktop controls
  were active.

**Conflict**

The same viewport belongs to both responsive modes, producing a hybrid not specified
by either layout.

**Canonical resolution**

Use non-overlapping boundaries (`max-width: 767px` and `min-width: 768px`) or one
mobile-first base with only `min-width` overrides.

### FUR-13 — Language and direction are inconsistent

**Priority:** P2 — material  
**Routes:** global, `/story/[id]`, `/dashboard`, `/settings`  
**Decision:** **Consolidated**

**Evidence**

- The root document declares Arabic and RTL
  (`apps/web/src/app/layout.tsx:18-23`).
- Story controls mix Arabic with `Bookmark`, `Followed by`, `Ongoing`, `Manhwa`, and
  English titles (`apps/web/src/features/story/components/StorySidebar/StorySidebar.tsx:51-69`,
  `apps/web/src/features/story/data/storyData.ts:41-70`).
- Workspace navigation and page content are English
  (`apps/web/src/components/workspace/workspace-shell.tsx:13-77`,
  `apps/web/src/features/workspace/components/dashboard-overview.tsx:1-41`,
  `apps/web/src/features/account/components/account-settings.tsx:1-26`).
- The rendered settings page showed English copy inheriting RTL flow, with an
  oversized wrapped heading and reversed information order.

**Conflict**

Language is not merely mixed content; English interface chrome inherits Arabic
direction and destabilizes reading order and alignment.

**Canonical resolution**

Arabic RTL is canonical. Localize interface chrome and reserve English for proper
titles or metadata whose source language is English. Wrap genuine LTR fragments with
appropriate `dir`/`lang` metadata. If a future workspace is intentionally English,
declare its direction at the workspace boundary rather than inheriting RTL silently.

### FUR-14 — Root error states leave the visual system

**Priority:** P2 — material  
**Routes:** root loading, 404, and global error  
**Decision:** **Consolidated**

**Evidence**

- Root loading and not-found copy are English
  (`apps/web/src/app/loading.tsx:1-6`, `apps/web/src/app/not-found.tsx:3-10`).
- Global error creates an English document and a bare reset button
  (`apps/web/src/app/global-error.tsx:5-12`).
- Global CSS resets button appearance
  (`apps/web/src/styles/globals.css:96-101`), so the reset control has no dependable
  branded affordance.

**Conflict**

The most consequential failure state changes language and loses Fury's shared action,
spacing, and state-page patterns.

**Canonical resolution**

Use the canonical localized state-page grammar and shared button style, while keeping
the global error implementation self-contained enough to survive root failures.

### FUR-15 — Token aliases and raw values disagree

**Priority:** P2 — material  
**Routes:** global  
**Decision:** **Consolidated**

**Evidence**

- `--primary` and `--primary-hover` both resolve to `#ff4747`, so the semantic hover
  token has no state change (`apps/web/src/styles/globals.css:21-22`).
- `--input`, `--input-background`, and `--input-bg` duplicate the same value
  (`apps/web/src/styles/globals.css:33-35`).
- Legacy aliases label red values as `--green` and `--coral`, and `--mono` starts with
  Poppins rather than a monospaced family
  (`apps/web/src/styles/integration.css:1-17`).
- Source-wide inventory found 85 hard-coded white values and 24 hard-coded
  `#ff4747` values in addition to many raw rgba variants.

**Conflict**

Names do not reliably describe visual meaning, and raw values bypass the state and
surface decisions recorded by the global system.

**Canonical resolution**

Use the semantic token table in `DESIGN-SYSTEM.md`. Retain compatibility aliases only
at integration boundaries, deprecate misleading names, and give hover/pressed/focus
states intentional values rather than duplicate aliases.

### FUR-16 — Component ownership is obscured by parallel and dead styles

**Priority:** P2 — material  
**Routes:** auth, discover, reader, story  
**Decision:** **Consolidated**

**Evidence**

- Discover and reader implement separate custom dropdown grammars
  (`apps/web/src/features/discover/components/DiscoverFilters/DiscoverFilters.tsx:110-266`,
  `apps/web/src/app/story/[id]/chapter/[chapterId]/page.tsx:31-87`).
- The auth form stylesheet contains unused social-login, divider, icon-input, and
  password-toggle families
  (`apps/web/src/features/auth/components/auth-form.module.css:59-207`).
- Chapter-list breadcrumb rules have no corresponding rendered component
  (`apps/web/src/features/story/components/ChapterList/ChapterList.module.css:292-322`).

**Conflict**

Parallel behavior creates accessibility drift; dead variants look like supported
design-system options even though no live component exercises them.

**Canonical resolution**

One shared primitive should own each behaviorally complex control. A style becomes
canonical only when a live reusable component owns and verifies it; otherwise classify
it as dead or exploratory rather than a supported variant.

### FUR-17 — Images and fonts bypass framework-level optimization

**Priority:** P2 — material  
**Routes:** public catalog, story, reader  
**Decision:** **Consolidated**

**Evidence**

- Local and remote artwork is rendered through raw `img` elements across cards, hero,
  story, and reader components.
- A fallback component exists but the primary card/story/reader paths do not use it
  (`apps/web/src/components/shared/ImageWithFallback.tsx:1-40`).
- Poppins is loaded through a CSS `@import`
  (`apps/web/src/styles/globals.css:1-2`).
- Live routes reference both local files and third-party Unsplash/FlagCDN resources;
  all decoded during the audit, but third-party availability remains external.

**Conflict**

Intrinsic sizing, format selection, loading priority, fallback behavior, and font
loading are fragmented across components and external hosts.

**Canonical resolution**

Centralize media behavior in the canonical image primitive with stable aspect ratios,
meaningful alt text, fallbacks, and deliberate eager/lazy priority. Use the installed
Next.js image/font pipeline where it preserves the current visuals. External hosts need
an explicit availability and privacy decision.

### FUR-18 — The home media rail duplicates content and overwhelms mobile

**Priority:** P2 — material  
**Route:** `/`  
**Decision:** **Consolidated**

**Evidence**

- The route renders the same `vertical-video.mp4` twice, both with autoplay, mute, and
  loop attributes (`apps/web/src/app/page.tsx:38-54`).
- The source video is a valid 382×850, 5.04-second asset.
- At 390px the media rail remained present at approximately 340px wide and 1233px tall,
  stacking two instances of the same content.

**Conflict**

Duplicate motion adds substantial vertical cost without adding information, competes
with catalog content, and has no reduced-motion alternative.

**Canonical resolution**

Treat the rail as optional editorial media: use distinct content with labels and a
purpose, reserve substantial rail height for larger layouts, and honor the motion
contract in FUR-04. Duplication is not a canonical layout technique.

### FUR-19 — Dynamic story routes render fixed content

**Priority:** P2 — material  
**Routes:** `/story/[id]`, `/story/[id]/chapter/[chapterId]`  
**Decision:** **Consolidated**

**Evidence**

- The shared story record is hard-coded with ID `trait-hoarder`
  (`apps/web/src/features/story/data/storyData.ts:41-43`).
- Chapter links are also hard-coded under that identifier
  (`apps/web/src/features/story/data/storyData.ts:81-296`).
- The story route imports the fixed record rather than resolving content from the
  supplied route ID (`apps/web/src/app/story/[id]/page.tsx:1-41`).

**Conflict**

The URL promises dynamic identity while the rendered content does not change, which
can mislabel content, metadata, navigation, and saved actions.

**Canonical resolution**

Resolve the story model from the route identifier and render an explicit not-found or
error state for unknown IDs. Until data loading exists, expose only the one truthful
demo route.

### FUR-20 — Reader landmarks and hotspot controls are incomplete

**Priority:** P2 — material  
**Route:** `/story/[id]/chapter/[chapterId]`  
**Decision:** **Consolidated**

**Evidence**

- The reader route renders its surface in nested `div` containers and has no `main`
  landmark (`apps/web/src/app/story/[id]/chapter/[chapterId]/page.tsx:148-409`).
- Single-page navigation hotspots are clickable `div` elements
  (`apps/web/src/app/story/[id]/chapter/[chapterId]/page.tsx:286-306`).
- Runtime inspection confirmed zero `main` landmarks on the reader route.

**Conflict**

Assistive-technology users cannot jump to the primary reading region, and keyboard
users cannot activate the large pointer hotspots.

**Canonical resolution**

Make the reading surface the route's `main`. Use real buttons for page hotspots, give
them localized names, and ensure they do not obscure image alternatives or the visible
bottom navigation.

### FUR-21 — Generic carousel direction methods are cross-wired

**Priority:** P2 — material  
**Routes:** shared carousel consumers  
**Decision:** **Unverified** for intended RTL direction; source mismatch is **Observed**

**Evidence**

- `CarouselPrevious` takes `scrollNext`, disables itself from `canScrollPrev`, and
  labels itself “Previous slide”
  (`apps/web/src/components/ui/Carousel/Carousel.tsx:174-193`).
- `CarouselNext` takes `scrollPrev`, disables itself from `canScrollNext`, and labels
  itself “Next slide”
  (`apps/web/src/components/ui/Carousel/Carousel.tsx:196-215`).

**Conflict**

Action and availability come from opposite directions. Even if the visual arrow swap
was intended for RTL, the method, disabled state, and accessible name do not form one
coherent semantic direction.

**Canonical resolution**

Define previous/next semantically for document direction, then bind label, icon,
Embla action, keyboard key, and disabled state to that same decision. Verify the result
with real RTL browser interaction before treating the generic component as canonical.

### FUR-22 — Small interface text is overused

**Priority:** P2 — material  
**Routes:** global, cards, comments, badges, metadata  
**Decision:** **Consolidated**

**Evidence**

- The root correctly establishes a 16px rem baseline
  (`apps/web/src/styles/globals.css:13-13`,
  `apps/web/src/styles/globals.css:64-66`), but repeated control and metadata sizes fall
  well below it.
- The stylesheet inventory found repeated values from `0.9rem` down to `0.72rem`, with
  some fixed `9px` labels. Comment actions use `0.72rem`
  (`apps/web/src/features/story/components/CommentsSection/CommentsSection.module.css:156-172`).
- UI/UX validation recommends a 16px mobile body baseline and reserves smaller sizes
  for truly secondary labels.

**Conflict**

Repeated 9–14px copy makes metadata dense and can reduce readability, particularly in
Arabic and on mobile displays.

**Canonical resolution**

Use the type roles in `DESIGN-SYSTEM.md`: 16px for reading/body copy, 14px for secondary
UI text, and 12px only for compact metadata with strong contrast and optional meaning.
Do not encode important actions or explanations at 9–11px.

### FUR-23 — Public asset inventory contains dead and invalid files

**Priority:** P3 — cleanup  
**Routes:** none currently  
**Decision:** **Observed**

**Evidence**

- `apps/web/public/images/trait-hoarder-banner.webp` and
  `apps/web/public/images/trait-hoarder-cover.jpg` are zero-byte files.
- Five starter SVGs remain under `apps/web/public`.
- A complete reference search found no live consumer for those seven files. The live
  story instead uses remote Unsplash URLs.

**Conflict**

Invalid and unreferenced assets obscure which image source is canonical and can be
mistaken for supported fallbacks.

**Canonical resolution**

Remove dead assets only in an authorized cleanup change, or replace them with valid
local artwork and wire them through the canonical image primitive. Do not document
zero-byte placeholders as part of the media system.

## 4. Intentional variations that are not inconsistencies

These differences are supported by context and should not be flattened mechanically:

- **Discord blue is a semantic exception.** The community banner may retain Discord's
  blue identity while Fury red remains the product action color.
- **Gold reader/story accents are semantic metadata.** Gold can distinguish rating or
  premium/reader emphasis; it is not a second global primary action color.
- **Edge-to-edge mobile reader imagery is intentional.** The issue is the overlapping
  768px boundary, not the full-bleed reading surface itself.
- **Cover art may vary dramatically in tone.** Fifteen local covers were decoded and
  visually sampled; overlays and text treatments, not color grading the source art,
  must preserve legibility.
- **Different maximum widths are purposeful.** Auth, marketing/catalog, story, and
  reader pages solve different reading-density problems. They should use named layout
  tiers rather than one universal width.
- **English story titles are content, not interface chrome.** Preserve original titles
  where appropriate while localizing surrounding controls and metadata labels.

## 5. Recommended remediation order

This is sequencing guidance, not authorization to modify application code.

1. Establish one keyboard, focus, target-size, contrast, and reduced-motion contract
   (FUR-01 through FUR-07).
2. Remove or implement false affordances, then repair loading/error state containment
   (FUR-08 through FUR-10).
3. Correct story and reader responsive boundaries and re-test 320, 390, 640, 768,
   1024, and 1280px widths (FUR-11, FUR-12).
4. Localize interface chrome and fix global error-state presentation (FUR-13, FUR-14).
5. Consolidate tokens, custom controls, and media primitives (FUR-15 through FUR-17).
6. Resolve route truthfulness, reader/carousel semantics, typography, and asset cleanup
   (FUR-18 through FUR-23).

## 6. Audit coverage and boundaries

### Source coverage

- Classified all 127 frontend source/configuration/documentation files in `apps/web`;
  visual source
  included 25 CSS modules/stylesheets, 62 TSX files, route layouts, fixtures, hooks,
  API-state components, tests, and configuration.
- Classified all 23 files under `apps/web/public`: 15 local JPEG covers, one MP4,
  one zero-byte WebP, one zero-byte JPEG, and five SVGs; the app favicon was inspected
  separately.
- Traced local, Unsplash, and FlagCDN references and inspected image fallback ownership.
- Searched the whole frontend for token literals, typography, spacing, radii,
  breakpoints, animation, focus, reduced-motion, landmark, and icon patterns.

### Rendered coverage

The audit rendered every reachable route family at 1440×1000:

- `/`, `/discover`, `/story/trait-hoarder`, and
  `/story/trait-hoarder/chapter/43`.
- Login, registration, forgot-password, reset-password, and verify-email routes.
- Dashboard and account-settings routes.
- The not-found route.

Auth and workspace success states were rendered with browser-local API responses so
their real components could be inspected without mutating application code. Missing
and valid reset/verify token branches, verification success, active session, and route
guard error states were included. Public routes were also inspected at 390, 640, 768,
1024, and 1280px. All rendered public widths had no horizontal page overflow, and all
live referenced images decoded successfully during the run.

### Validation applied

- UI UX Pro Max was used as a secondary validator for RTL typography, custom
  dropdown/carousel semantics, keyboard focus, target size, reduced motion, and
  Next.js image/font handling. Existing Fury patterns remained the primary source.
- `pnpm --filter @fury/web check-types` passed.
- `pnpm --filter @fury/web test` passed: 12 files and 95 tests.

### Boundaries

- The configured backend was unavailable, so real credential submission, persisted
  session behavior, browser history after authentication, and server-derived recovery
  remain **unverified**. Mocking was limited to browser-local rendering of existing UI
  states; it did not prove the external contract.
- Automated desktop/mobile viewports were inspected, but no physical 320px device,
  orientation change, screen reader, or production deployment was available. Those
  remain **unverified** under project rule F31
  (`docs/engineering/frontend-standard.md:398-411`).
- The checkout's referenced design, testing, security, workflow, and engineering-index
  documents are staged as deleted. They were not restored or treated as authority.
- No application source, test, configuration, or asset file was modified by this audit.

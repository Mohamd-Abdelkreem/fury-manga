# Fury Design System

Canonical frontend reference generated from the Fury checkout on 2026-09-11.
This document records the product that exists; it does not propose a new theme.
Known departures are not precedents. They are listed in
[`DESIGN-SYSTEM-INCONSISTENCIES.md`](DESIGN-SYSTEM-INCONSISTENCIES.md).

## 1. Decision model

The audit uses these labels:

- **Observed** — directly repeated in live Fury UI.
- **Consolidated** — selects one existing Fury pattern when implementations conflict.
- **Semantic exception** — intentionally differs because the content or task differs.
- **Proposed extension** — required behavior with no complete Fury implementation yet;
  it must reuse the existing visual language.
- **Unverified** — could not be exercised against a real backend or device.

The precedence used for conflicts is: shared implementation, frequency, core public
screens, Fury identity, accessibility and truthful interaction, then the project-local
UI UX Pro Max guidance. The application is the primary source of truth. UI UX Pro Max
was used only to validate focus, keyboard, target-size, responsive, typography, image,
and reduced-motion decisions.

## 2. Product character

Fury is an Arabic-first, RTL, dark entertainment reader. Its stable visual character is:

- near-black layered surfaces rather than pure black;
- white primary copy and warm gray secondary copy;
- a vivid coral-red brand/action accent;
- portrait cover art as the dominant visual material;
- compact controls and metadata around large cinematic story imagery;
- restrained glass blur, deep black elevation, and soft red glow;
- square-rounded geometry: mostly 8–16px radii, with pills only for compact labels;
- Cairo for reading and controls, Cairo Play for display/brand moments, and Poppins
  only for compact Latin/numeric metadata.

Evidence: `apps/web/src/styles/globals.css:13-46`,
`apps/web/src/styles/globals.css:69-75`,
`apps/web/src/features/home/components/HeroSection/HeroSection.module.css:7-14`, and
`apps/web/src/components/ui/MangaCard/MangaCard.module.css:22-33`.

## 3. Foundations

### 3.1 Direction and language

**Observed:** the document root is Arabic and RTL (`lang="ar"`, `dir="rtl"`).
Page shells reinforce RTL, and email/phone fields opt into LTR. Evidence:
`apps/web/src/app/layout.tsx:18-23`, `apps/web/src/app/page.tsx:10-12`,
`apps/web/src/features/auth/components/login-form.tsx:57-72`.

Canonical rules:

- UI chrome, navigation, actions, helper text, empty/error copy, and dates are Arabic.
- Preserve original-language story titles and creator/publisher names.
- Put unknown or user/content-provided direction in `dir="auto"`; use `bdi` for an
  inline email, identifier, count, or foreign-language token inside Arabic copy.
- Use `dir="ltr"` on email, phone, URL, token, and code inputs; do not switch the
  containing page away from RTL.
- Mirror directional icons by meaning, not mechanically. “Next” and “previous” must
  be tested in the actual RTL flow.

The English workspace, English global states, and mixed labels on the story page are
departures, not a second locale.

### 3.2 Color

The canonical semantic palette comes from the root variables, not from repeated raw
hex values or the legacy aliases in `integration.css`.

| Token                    | Value                   | Canonical use                                              | Status       |
| ------------------------ | ----------------------- | ---------------------------------------------------------- | ------------ |
| `--background`           | `#1f1f1f`               | App canvas and full-page state background                  | Observed     |
| `--foreground`           | `#ffffff`               | Primary text and icons                                     | Observed     |
| `--card`                 | `#121212`               | Solid cards, image placeholders, form surfaces             | Observed     |
| `--card-hover`           | `#222222`               | Elevated/hovered neutral surface                           | Observed     |
| `--popover`              | `#1a1a1a`               | Menus and transient surfaces                               | Observed     |
| `--secondary`, `--muted` | `#242424`               | Quiet fills and secondary controls                         | Observed     |
| `--muted-foreground`     | `#b9b9b9`               | Secondary text; 8.40:1 on canvas                           | Observed     |
| `--primary`              | `#ff4747`               | Fury identity, selected state, focus, borders, links, glow | Observed     |
| action-dark              | `#e02828`               | Existing dark endpoint for filled-action gradients         | Consolidated |
| `--accent`               | `#ffb300`               | Ratings and rare warm emphasis                             | Observed     |
| `--accent-foreground`    | `#0e0e0e`               | Text/icons on gold; 10.76:1                                | Observed     |
| success                  | `#2ed573` / `#8be8b2`   | Success mark/status fill and readable success copy         | Observed     |
| error                    | `#ff6868` / `#ff7777`   | Field and notice error copy                                | Observed     |
| `--footer-bg`            | `#0c0c0c`               | Footer depth layer                                         | Observed     |
| `--border`               | `rgba(255,255,255,.08)` | Default quiet outline/divider                              | Observed     |
| `--ring`                 | `#ff4747`               | Focus identity                                             | Observed     |

Source: `apps/web/src/styles/globals.css:13-41` and
`apps/web/src/styles/integration.css:124-185`.

Opacity grammar:

- white at `.01–.04`: barely raised surface;
- white at `.05–.10`: border, divider, or quiet hover;
- white at `.35–.55`: tertiary/disabled copy only;
- white at `.70–.85`: secondary readable copy;
- red at `.08–.12`: selected or emphasized neutral surface;
- red at `.15–.22`: focus ring or state border;
- red at `.25–.42`: action glow/elevation.

Do not introduce another neutral black, red, or gray when one of these semantic roles
fits. Discord blue (`#5865f2` with its darker companion values) is a
**semantic exception** restricted to the Discord promotion; it is not a Fury token.
Evidence: `apps/web/src/features/home/components/DiscordBanner/DiscordBanner.tsx:9-39`.

Accessibility constraint: white on `#ff4747` measures 3.36:1 and does not meet 4.5:1
for normal text. The current red-to-`#e02828` action gradient is observed, but its
lightest area must not be treated as contrast-safe for small white labels. See the
inconsistency register before reusing a filled action.

### 3.3 Typography

**Observed families:**

- `Cairo`, sans-serif — body, UI, Arabic headings, labels, descriptions.
- `Cairo Play`, then `Cairo` — wordmark, cinematic display titles, reader headings,
  promotional headings.
- `Poppins`, sans-serif — compact Latin/numeric ratings only. It is not a code font.

Fonts and weights are loaded in `apps/web/src/styles/globals.css:8-9`; the family
roles are repeated in `apps/web/src/styles/integration.css:14-16`.

Canonical type roles:

| Role              | Size / line height                           | Weight         | Family              | Use                          |
| ----------------- | -------------------------------------------- | -------------- | ------------------- | ---------------------------- |
| Display hero      | `clamp(1.9rem, …, 3.2rem)` / about `1.1–1.2` | 900            | Cairo Play          | One featured story title     |
| Workspace display | `clamp(2rem, 5vw, 4.4rem)` / `1.1`           | inherited bold | Cairo               | Authenticated overview only  |
| Page title        | `1.75rem` / `1.25–1.5`                       | 800–900        | Cairo or Cairo Play | Auth, story, reader          |
| Section title     | `1.1–1.15rem` / `1–1.5`                      | 800            | Cairo               | Shelf and panel headings     |
| Body              | `0.875rem` / `1.6–1.7`                       | 400–500        | Cairo               | Current descriptive copy     |
| Control           | `0.82–0.95rem` / control height              | 600–700        | Cairo               | Buttons, filters, navigation |
| Metadata          | `0.72–0.82rem` / `1.3–1.6`                   | 500–700        | Cairo/Poppins       | Dates, ratings, badges       |
| Eyebrow           | `0.72rem`, `0.09em` tracking                 | 800            | Cairo               | Short context label only     |

Evidence: `apps/web/src/styles/globals.css:109-132`,
`apps/web/src/styles/integration.css:26-34`,
`apps/web/src/features/story/components/ChapterList/ChapterList.module.css:12-27`, and
`apps/web/src/components/ui/MangaCard/MangaCard.module.css:210-265`.

The size table describes current Fury. It does not certify all 11–14px copy as mobile
readable; the inconsistency register identifies the compact-text risk. Long-form copy
uses relaxed line height and bounded measure. Headings may be short and dramatic;
labels stay literal and concise.

### 3.4 Spacing

Fury follows a 4px base rhythm, with 2px used only for optical icon/star separation.

| Name        | Value | Common use                         |
| ----------- | ----- | ---------------------------------- |
| `space-0.5` | 2px   | Star/icon micro-gap                |
| `space-1`   | 4px   | Badge internals, compact metadata  |
| `space-1.5` | 6px   | Tight nav/tag gaps                 |
| `space-2`   | 8px   | Default control/icon gap           |
| `space-2.5` | 10px  | Compact vertical padding           |
| `space-3`   | 12px  | Standard control padding/gap       |
| `space-4`   | 16px  | Default page gutter and card gap   |
| `space-5`   | 20px  | Panel padding and shelf gap        |
| `space-6`   | 24px  | Wide gutter, section/panel spacing |
| `space-8`   | 32px  | Page section separation            |
| `space-10`  | 40px  | Major section separation           |
| `space-12`  | 48px  | Desktop composition gap            |

Intermediate 14px and 28px values are observed optical adjustments, not new scale
anchors. Frequency evidence across all styles is led by 8, 16, 12, 4, 24, and 32px;
the home layout demonstrates 16/24px gutters and 32/40/48px composition gaps at
`apps/web/src/app/page.module.css:8-35`.

### 3.5 Radius and shape

Use shape by component responsibility:

| Radius             | Use                                        | Status                     |
| ------------------ | ------------------------------------------ | -------------------------- |
| 4px                | Tiny tag/shortcut                          | Observed                   |
| 6px                | Badge, compact chapter/action              | Observed                   |
| 8px                | Dense filter, list cell, metadata panel    | Observed                   |
| 10px               | Reader selector/navigation control         | Consolidated               |
| 12px               | Default card, field, button, dropdown      | Observed canonical default |
| 16px               | Banner, workspace panel/account bar        | Observed                   |
| 20px               | Auth card, reader frame, premium media     | Observed                   |
| full pill / circle | Status, hero tag, icon button, avatar only | Observed                   |

Root radius variables currently encode 4/6/8/12px
(`apps/web/src/styles/globals.css:42-46`). Shared form fields and actions establish 12px
as the general control radius (`apps/web/src/styles/integration.css:50-55` and
`apps/web/src/styles/integration.css:124-134`).

### 3.6 Borders and elevation

- Default border: 1px white at 8%.
- Quiet media border: 1px white at 4–6%.
- Active border: red at 20–40% or solid `--primary` for decisive selection.
- Standard card shadow: `0 6px 18px rgba(0,0,0,.45)`.
- Dropdown shadow: `0 15px 30px rgba(0,0,0,.6)`.
- Premium panel/auth shadow: `0 20px 40px rgba(0,0,0,.45)` plus a very soft red halo.
- Reader depth: `0 30px 60px rgba(0,0,0,.6)`.
- Action elevation: `0 4px 14–16px rgba(255,71,71,.2–.3)`, increasing on hover.

Evidence: `apps/web/src/components/ui/MangaCard/MangaCard.module.css:22-56`,
`apps/web/src/features/home/components/Navbar/Navbar.module.css:282-300`,
`apps/web/src/features/auth/components/auth-form.module.css:9-24`, and
`apps/web/src/app/story/[id]/chapter/[chapterId]/page.module.css:343-353`.

Blur is reserved for sticky chrome, popovers, glass auth/workspace panels, and reader
controls. It is not a default card effect.

### 3.7 Motion

Current motion vocabulary:

- state/color transitions: 150–250ms ease;
- movement/elevation: 180–300ms ease or `cubic-bezier(.4,0,.2,1)`;
- premium cover transforms: 400–600ms with `cubic-bezier(.16,1,.3,1)`;
- entry/dropdown fades: 200–400ms;
- skeleton spinners: 800–1000ms linear infinite;
- hero crossfade: 1s; automatic slide interval: 7s.

Evidence: `apps/web/src/styles/globals.css:158-198`,
`apps/web/src/components/ui/MangaCard/MangaCard.module.css:14-15`, and
`apps/web/src/features/home/components/HeroSection/HeroSection.module.css:27-34`.

Canonical behavior:

- animate opacity, transform, border color, and shadow; never layout dimensions except
  the existing desktop search expansion;
- hover lift is 1–2px; large cover hover may rise 6px only in the story sidebar;
- loading motion communicates pending work and must have adjacent text/status;
- **Proposed extension:** every nonessential transition, autoplay rotation, pulse,
  spinner, and decorative video needs a `prefers-reduced-motion` treatment. No such
  query exists today, so reduced-motion behavior is not yet canonicalized in code.

## 4. Responsive architecture

### 4.1 Breakpoints

The shared breakpoint set is 640, 768, 1024, and 1280px
(`apps/web/src/styles/globals.css:48-52`). Two narrow component thresholds also exist:
480px for story-card/auth details and 520px for workspace identity. Workspace uses a
separate 800px collapse threshold.

Canonical interpretation:

| Range         | Behavior                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| `<640px`      | 16px gutters; hamburger navigation; no header search; two-column cover grids; horizontally scrollable genres |
| `640–767px`   | 24px gutters; header search appears; three-column discovery/latest grids                                     |
| `768–1023px`  | Desktop navigation; four-column discovery/latest; story becomes two columns; footer becomes five columns     |
| `1024–1279px` | Five-column discovery; home main/media split; hero character pane appears; wider chapter grid                |
| `≥1280px`     | Full marketing composition; 1440px shells retain 24px gutters; media rail reaches 340px                      |

Runtime checks at 390, 640, 768, 1024, and 1280px found no document-level horizontal
overflow on home, discovery, story detail, or reader. The 768px story-card and reader
boundary defects remain exceptions listed separately.

### 4.2 Container hierarchy

| Container                             | Maximum | Gutter / purpose                   |
| ------------------------------------- | ------- | ---------------------------------- |
| Marketing shell, navbar, footer, hero | 1440px  | 16px, then 24px at 640px           |
| Discovery, story detail, workspace    | 1280px  | Dense content and account surfaces |
| Reader controls/page shell            | 1100px  | Centers controls and comments      |
| Reader image column                   | 800px   | Optimal webtoon strip width        |
| Hero copy                             | 620px   | Protects art and line length       |
| Auth card                             | 460px   | Focused single-column task         |

Evidence: `apps/web/src/app/page.module.css:8-20`,
`apps/web/src/app/discover/page.module.css:8-17`,
`apps/web/src/app/story/[id]/chapter/[chapterId]/page.module.css:13-22`,
`apps/web/src/app/story/[id]/chapter/[chapterId]/page.module.css:343-353`, and
`apps/web/src/features/auth/components/auth-form.module.css:9-17`.

## 5. Component canon

### 5.1 Wordmark

The wordmark is typographic “FURY”: Cairo Play 900, 24–26px, red “F” and white “URY”,
with a restrained red glow. It appears in navbar and footer. Do not substitute the
unused stock SVGs. Evidence: `apps/web/src/features/home/components/Navbar/Navbar.tsx:18-45`
and `apps/web/src/features/home/components/Footer/Footer.tsx:71-94`.

### 5.2 Navbar

**Observed:** sticky 64px header, 1440px inner container, translucent near-black
surface, centered desktop links at 768px+, search at 640px+, 36px action controls, and
a stacked mobile menu below 768px. Active route uses red border/tint and
`aria-current="page"`. Evidence: `apps/web/src/features/home/components/Navbar/Navbar.module.css:7-31`,
`apps/web/src/features/home/components/Navbar/Navbar.module.css:53-75`, and
`apps/web/src/features/home/components/Navbar/Navbar.module.css:85-111`.

The `minimal` auth variant keeps only the wordmark and Arabic “back to home” link.
Notifications are a 320px glass popover. Search, notification, and menu semantics need
the corrections in the inconsistency register before their markup is copied.

### 5.3 Hero and genre rail

**Observed:** 530–640px cinematic feature area; full-cover background with dark lateral
and bottom gradients; a second character pane only at 1024px+; 620px maximum copy;
pill metadata; gold rating; red primary CTA; dark secondary CTA; four progress dots;
and a 52px bottom genre rail. Evidence:
`apps/web/src/features/home/components/HeroSection/HeroSection.module.css:7-14`,
`apps/web/src/features/home/components/HeroSection/HeroSection.module.css:57-105`, and
`apps/web/src/features/home/components/HeroSection/HeroSection.module.css:228-316`.

The hero is the only place where a cover may become both a full-bleed background and a
desktop character pane. Always protect copy with a dark gradient. Autoplay and dot
semantics are currently noncanonical behavior.

### 5.4 Section heading

The reusable visual grammar is a short vertical marker, optional 16–22px Lucide icon,
800-weight 17.6–22.4px title, and optional compact badge or trailing “view all” link.
Home shelves use a white marker; page/panel titles use the brand-red marker. Preserve
this contextual distinction rather than inventing a third marker color. Evidence:
`apps/web/src/features/discover/components/DiscoverHero/DiscoverHero.module.css:5-31`
and `apps/web/src/features/story/components/SimilarStories/SimilarStories.module.css:10-29`.

### 5.5 Buttons and links

The cross-route canonical action primitive is `.button`:

- minimum height 48px;
- 12px radius;
- 12px vertical / about 18px horizontal padding;
- 700–750 weight;
- red-to-dark-red primary gradient with red shadow;
- hover lift 1px plus stronger shadow;
- disabled opacity 60%, no movement, pending label text;
- variants: full width, small 41.6px, ghost, danger.

Evidence: `apps/web/src/styles/integration.css:124-168`.

Compact page controls may use 40–42px heights and 8–10px radii in dense filters or
reader toolbars. Text links use red plus 700 weight; content navigation links may use
white/muted text with red hover. Never style inert text like a button or tag.

### 5.6 Form field and feedback

The canonical field is `FormField` plus the global `.form-field` styles:

- explicit visible label;
- 48px minimum input height;
- 12px radius, 1px quiet border, 16px inline padding;
- white text on a 2% white surface;
- hover border at 18% white;
- red border and glow on focus;
- muted hint; red field error linked by `aria-describedby` and `aria-invalid`;
- disabled state at 45% copy on a 3% surface.

Evidence: `apps/web/src/components/forms/form-field.tsx:3-38` and
`apps/web/src/styles/integration.css:42-94`.

Feedback patterns:

- informational/success notice: green border/tint and `role="status"` when updated;
- error notice: red border/tint and `role="alert"`;
- success panel: centered 64px circular check, heading, explanatory copy, next action;
- pending mutation: disable the submitting action and replace its label with a clear
  Arabic progressive phrase.

Evidence: `apps/web/src/styles/integration.css:170-220` and
`apps/web/src/features/auth/components/register-form.tsx:47-65`.

### 5.7 Auth shell

**Observed:** minimal navbar, centered 460px glass card, subtle red radial atmosphere,
20px card radius, 32–40px inner padding, centered eyebrow/title/summary, and the shared
footer. At 480px the card padding reduces to 24px; at 768px outer padding tightens.
Evidence: `apps/web/src/components/auth/auth-shell.tsx:20-39`,
`apps/web/src/components/auth/auth-shell.module.css:1-63`, and
`apps/web/src/features/auth/components/auth-form.module.css:1-56`.

All login, registration, forgot-password, reset-password, and verification pages use
this shell. Token-valid, token-invalid, pending, field-error, form-error, and success
panels are variants inside it, not separate page designs.

### 5.8 Manga card

The MangaCard is Fury’s primary reusable content unit:

- RTL root; fixed 150px small or 185px medium width, or fluid `stretch` width;
- 3:4 image frame, 12px radius, near-black placeholder, quiet border and deep shadow;
- cover uses `object-fit: cover`, slight darkening, 6% hover zoom;
- origin flag at top-left; optional status/accent badge at bottom-left; hot circle at
  bottom-right;
- dark hover overlay with centered red “read now” treatment;
- single-line title below; up to two compact chapter links; gold star plus numeric score;
- title and each chapter remain direct links.

Evidence: `apps/web/src/components/ui/MangaCard/MangaCard.tsx:17-65`,
`apps/web/src/components/ui/MangaCard/MangaCard.module.css:7-75`, and
`apps/web/src/components/ui/MangaCard/MangaCard.module.css:200-278`.

Do not create a new cover-card shape for discovery, shelves, similar works, or the
workspace. Adjust only `size` and `stretch`.

### 5.9 Carousel

The shared Embla carousel is a region containing grouped slides, horizontal or
vertical track, and previous/next circular controls. Home shelves show 2 items on the
narrowest view, then 3 at 640px, 4 at 768px, and 5 at 1024px. Shelf arrows are hidden
on narrow screens and revealed around the carousel at 640px+. Evidence:
`apps/web/src/components/ui/Carousel/Carousel.tsx:42-166`,
`apps/web/src/features/home/components/TrendingSection/TrendingSection.module.css:112-149`.

Its RTL arrow mapping and accessible labelling are not approved for reuse until the
registered defect is resolved.

### 5.10 Filter/select control

**Consolidated visual rule:** 40–42px dark trigger, 8–10px radius, quiet border,
secondary label plus bold value, trailing chevron, red active border/glow, and a
12px-radius elevated menu. Options use 10–16px vertical padding, red selected tint,
and a check icon. Multi-select genres use a two-column mobile grid, three at 640px,
and four at 1024px. Evidence:
`apps/web/src/features/discover/components/DiscoverFilters/DiscoverFilters.module.css:38-104`
and `apps/web/src/app/story/[id]/chapter/[chapterId]/page.module.css:151-229`.

**Proposed extension:** behavior must be implemented with native select/checkbox
controls or a complete accessible listbox/menu pattern. The two current custom
implementations do not establish canonical semantics.

### 5.11 Story detail

The story page uses:

- 200px mobile / 320px desktop darkened banner;
- content overlap of 80px mobile / 150px desktop;
- one column below 768px, then 260px sidebar + flexible content, expanding to 300px at
  1024px;
- sidebar cover, bookmark action, rating, and key/value metadata;
- main title and alternate titles, wrap-safe genre tags, description panel, two quick
  chapter links, searchable chapter grid, similar-work MangaCards, and comments.

Evidence: `apps/web/src/app/story/[id]/page.module.css:8-63`,
`apps/web/src/features/story/components/StoryBanner/StoryBanner.module.css:1-33`, and
`apps/web/src/features/story/components/ChapterList/ChapterList.tsx:39-132`.

### 5.12 Reader

The reader shell is 1100px wide. It places breadcrumb and centered title above a glass
control bar, an 800px dark reading frame, a repeated bottom control bar, then comments.
Full-chapter mode stacks pages vertically. Single-page mode adds page controls and
side hotspots. Image loading uses a dark skeleton with red spinner and explicit page
number. At mobile widths the reading frame becomes edge-to-edge.

Evidence: `apps/web/src/app/story/[id]/chapter/[chapterId]/page.tsx:148-402` and
`apps/web/src/app/story/[id]/chapter/[chapterId]/page.module.css:13-22`,
`apps/web/src/app/story/[id]/chapter/[chapterId]/page.module.css:343-421`, and
`apps/web/src/app/story/[id]/chapter/[chapterId]/page.module.css:518-536`.

The reader is a content-priority pattern: images may reach the viewport edge, but
controls and discussion retain normal page gutters. It currently lacks a `main`
landmark and complete keyboard semantics.

### 5.13 Comments

Comments live in a 12px-radius, 2% raised panel. The composer is a nested 8px panel
with borderless textarea and a compact red send action. Comment rows use 40px circular
avatars, name/date metadata, relaxed Arabic copy, and compact like/reply actions.
Evidence: `apps/web/src/features/story/components/CommentsSection/CommentsSection.tsx:76-133`
and `apps/web/src/features/story/components/CommentsSection/CommentsSection.module.css:1-172`.

The local demo add-comment behavior is not proof of persistence; like and reply
actions are presently inert.

### 5.14 Workspace

The authenticated shell reuses the public navbar, then adds a 1440px glass account
bar. Main content is 1280px wide. It uses a large display title, status badge, fluid
MangaCard shelf, 16px-radius settings panels, three-column field groups, and shared
buttons/fields/notices. At 800px settings headings and fields become one column; at
520px identity copy hides and account actions share available width.

Evidence: `apps/web/src/styles/integration.css:222-391` and
`apps/web/src/styles/integration.css:415-449`.

The layout primitives are canonical. Its English copy and inherited RTL treatment are
not.

### 5.15 Footer

The footer is a `#0c0c0c` depth layer with a 1440px shell and 16/24px gutters. The
upper area is two columns on mobile and five from 768px; the brand spans two columns.
Tags are compact 4px-radius labels. The lower legal bar stacks, then becomes a row at
768px. Evidence: `apps/web/src/features/home/components/Footer/Footer.module.css:9-47`
and `apps/web/src/features/home/components/Footer/Footer.module.css:95-146`.

Only real destinations are canonical links. Placeholder `#` destinations and inert
tags are content defects.

## 6. State contract

Every important view must decide initial loading, background refresh, empty,
filtered-empty, error/retry, mutation pending, success, unavailable, disabled, and
stale-known behavior, following `docs/engineering/frontend-standard.md:35-45`.

| State                   | Canonical presentation                                            | Current examples                      |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------- |
| Initial session loading | Centered, labelled, `aria-live="polite"`, `aria-busy="true"`      | `SessionLoader`                       |
| Image loading           | Dark fixed-size skeleton, red spinner, page-specific Arabic label | Reader pages                          |
| Empty                   | Quiet centered copy inside the owning surface                     | Notifications, filtered chapters      |
| Filtered empty          | Explain no match without erasing filters                          | Chapter search                        |
| Error                   | Red notice, `role="alert"`, optional request id, explicit retry   | Route guards, forms                   |
| Pending mutation        | Disabled action and verb-specific progressive label               | Auth/account forms                    |
| Success                 | Green notice or success panel, `role="status"`/polite live region | Registration, verification, profile   |
| Disabled                | Dimmed without hover movement; preserve readable label            | Fields, navigation                    |
| Selected/current        | Red tint/border plus text/icon and programmatic state             | Nav, filter, bookmark, account status |
| 404                     | Full-page state with recovery link                                | Root not-found boundary               |
| Fatal error             | Full-page state with retry                                        | Root error boundary                   |

Do not present mock counts, local comments, filter toggles, bookmarks, or links as
server-confirmed state. The current static content is fixture/demo material and must
be labelled as such if surfaced beyond development.

## 7. Accessibility and interaction contract

Canonical requirements, combining Fury’s working patterns with project rule F28:

- every operation is keyboard reachable and has a visible focus indicator;
- every input has a visible label; placeholder is supplemental only;
- every icon-only button has an accessible name;
- disclosure triggers expose expanded state and their controlled element;
- menus, listboxes, tabs, carousels, and dialogs provide their complete native/ARIA
  semantics, arrow-key behavior where applicable, Escape behavior, and focus return;
- a sticky header must not fully obscure focused content;
- error uses `alert`; informational/success feedback uses `status` as appropriate;
- selection is not conveyed by color alone;
- touch/click targets meet WCAG 2.2’s 24×24 CSS px minimum or a documented spacing/
  inline exception; mobile primary controls should target about 44px or larger;
- animations and autoplay honor reduced motion;
- navigation-heavy pages provide a skip-to-main mechanism (**proposed extension**);
- validate at 320px as required by `docs/engineering/frontend-standard.md:360-370`.

Fury’s current global focus ring is 3px red at 35% with 3px offset, applied to buttons,
links, and inputs (`apps/web/src/styles/integration.css:19-24`). Extend that same ring to
textarea, select, summary, and any custom focusable control rather than inventing a
different focus color.

## 8. Iconography and imagery

### Icons

- Lucide React is the canonical UI icon family; use the existing stroke style.
- Typical size is 14–18px; page/section icons may reach 22px.
- Icon-only controls still need text alternatives.
- The Discord mark is the one observed inline brand SVG exception.
- Reader pointer cursors may use embedded 24px directional SVGs.

Evidence: Lucide imports are distributed across 17 live TSX modules, including
`apps/web/src/features/home/components/Navbar/Navbar.tsx:6`,
`apps/web/src/features/story/components/CommentsSection/CommentsSection.tsx:4`, and
`apps/web/src/app/story/[id]/chapter/[chapterId]/page.tsx:6-12`.

### Images and media

- Canonical covers are portrait 2:3 source files (all 15 local JPEGs are 352×528) and
  render in 3:4 cover frames. Use `object-fit: cover`; preserve a meaningful title alt.
- The hero may crop that cover into wide background/character layers, always under a
  dark gradient. Decorative duplicate layers should have empty alt.
- Story banner uses a wide crop and bottom fade into the app canvas.
- Comment avatars are 40px circles.
- Reader pages render at natural aspect ratio inside the 800px column.
- The local video is 382×850, 5.04s, and intended for a 9:16 frame. Two identical
  instances currently render; this is not a canonical requirement.
- Use an explicit branded fallback for decode/network failure. The existing
  `ImageWithFallback` provides a neutral image-error mark but is not wired into cards.

Source: `apps/web/src/components/ui/MangaCard/MangaCard.module.css:22-30`,
`apps/web/src/features/story/components/StoryBanner/StoryBanner.module.css:16-33`,
`apps/web/src/app/page.tsx:38-54`, and
`apps/web/src/components/shared/ImageWithFallback.tsx:5-55`.

The five stock Next.js SVGs and two zero-byte `trait-hoarder` files are not canonical
assets. The favicon is a valid 256×256, 32-bit icon.

## 9. Page patterns and route map

| Surface                           | Composition                                                                                       | Responsive/state notes                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `/`                               | Navbar → hero/genres → trending → Discord → latest + media rail → suggestions → footer            | Media stacks below content before 1024; hero character appears at 1024 |
| `/discover`                       | Navbar → 1280px main → page title → filters → 2/3/4/5-column MangaCard grid → pagination → footer | Filters are two-column grid until 1024, then horizontal flex           |
| `/story/[id]`                     | Navbar → banner → overlapping sidebar/main → similar → comments → footer                          | One column until 768; 260/300px sidebar after                          |
| `/story/[id]/chapter/[chapterId]` | Navbar → breadcrumb/title → controls → reader → controls → comments → footer                      | Reader edge-to-edge at mobile; 800px cap after                         |
| `/auth/login`                     | Minimal auth shell + login form + footer                                                          | Default, pending, field/form error                                     |
| `/auth/register`                  | Minimal auth shell + registration form/success panel + footer                                     | Default, pending, field/form error, submitted success                  |
| `/auth/forgot-password`           | Minimal auth shell + single-field form + footer                                                   | Neutral privacy-preserving response                                    |
| `/auth/reset-password`            | Minimal auth shell + invalid/pending/valid form + footer                                          | Token-dependent states                                                 |
| `/auth/verify-email`              | Minimal auth shell + working/verified/invalid-resend panel + footer                               | Token-dependent states                                                 |
| `/dashboard`                      | Navbar → account bar → workspace title/status → MangaCard shelf                                   | Protected pending/error/redirect/authorized states                     |
| `/settings`                       | Navbar → account bar → profile/password/session panels                                            | Protected; fields collapse below 800                                   |
| loading / 404 / fatal error       | Full-page state surface                                                                           | Must remain Arabic and preserve usable recovery action                 |

Route composition evidence:
`apps/web/src/app/page.tsx:10-68`, `apps/web/src/app/discover/page.tsx:14-40`,
`apps/web/src/app/story/[id]/page.tsx:31-90`,
`apps/web/src/app/story/[id]/chapter/[chapterId]/page.tsx:148-409`, and
`apps/web/src/components/auth/auth-shell.tsx:20-39`.

## 10. Do / do not

### Do

- Reuse the semantic root tokens, shared MangaCard, shared FormField, shared `.button`,
  Navbar, Footer, AuthShell, and established page containers.
- Keep Arabic-first RTL chrome and isolate Latin/user content directionally.
- Let cover art carry visual variety while surfaces remain dark and restrained.
- Use red for identity, focus, active state, and rare primary action emphasis.
- Preserve 16px mobile and 24px wider page gutters.
- Use a visible label and truthful pending/error/success state for every task.
- Test keyboard, 320px, 390px, 768px boundaries, desktop, long Arabic labels, and
  mixed-direction content.
- Treat fixture data and local-only actions as nonauthoritative.

### Do not

- Do not copy an implementation listed as an inconsistency.
- Do not add a light theme, new accent palette, generic gradient decoration, or a new
  card language.
- Do not use the legacy `--green`/`--coral` aliases or invent raw near-duplicate reds.
- Do not put normal-size white text on flat `#ff4747` without a contrast-safe treatment.
- Do not use clickable `div`/`li` elements, hover-only actions, placeholder links, or
  unlabeled icon buttons.
- Do not remove focus outlines without a Fury red replacement.
- Do not auto-rotate or animate continuously without reduced-motion and pause behavior.
- Do not use stock Next/Vercel SVGs as product imagery.
- Do not infer that English workspace copy defines a second design system.

## 11. New-page checklist

- [ ] Compose the page from an existing route shell and shared components.
- [ ] Use `lang="ar"`/RTL inherited from the root; isolate LTR content with `dir`/`bdi`.
- [ ] Select the correct 1440/1280/1100/800/460px container tier.
- [ ] Use 16px mobile and 24px `sm` gutters.
- [ ] Reference semantic colors; check foreground/background contrast.
- [ ] Use Cairo/Cairo Play/Poppins only in their documented roles.
- [ ] Use the 4px spacing rhythm and documented radius tier.
- [ ] Provide hover, focus-visible, active/selected, disabled, pending, error, empty,
      and success behavior where applicable.
- [ ] Give every field and icon action an accessible name.
- [ ] Implement disclosures/listboxes/tabs/carousels with keyboard and Escape behavior.
- [ ] Honor reduced motion and avoid unpausable autoplay.
- [ ] Give images correct aspect ratio, crop, dimensions, alt/fallback, and loading state.
- [ ] Verify no horizontal overflow at 320, 390, 640, 768, 1024, and 1280px.
- [ ] Verify navigation destinations and server-backed claims are truthful.
- [ ] Check the inconsistency register so existing debt is not propagated.

## 12. Audit coverage and verification

### Static coverage

- Reviewed all 127 text/config/source files in `apps/web` (13,490 lines at audit
  baseline), including all 18 route/state entry files, 62 TSX files, 25 CSS files, 33
  TS files, manifests, Next/PostCSS/TypeScript/Vitest configuration, route guards,
  hooks/APIs that determine visible state, mock data, and state-related tests.
- Traced all local and remote image, video, font, inline SVG, and Lucide references.
- Classified all CSS-module selectors. The auth module contains a large unused
  alternate form vocabulary, and ChapterList contains unused breadcrumb selectors;
  neither was promoted into this canon.
- Inspected the shared account/session contract needed to render protected states.

### Rendered coverage

- Rendered all reachable route families at 1440×1000.
- Rendered home, discovery, story detail, and reader at 390, 640, 768, 1024, and
  1280px; verified document width, layout transitions, control geometry, image decode,
  and landmarks.
- Exercised mobile menu, discovery disclosure, checkbox, reader custom-select, hero
  dot, category control, and Escape/keyboard semantics.
- Exercised anonymous auth, missing and valid reset token, missing and valid verify
  token, verified success, authenticated dashboard, and authenticated settings through
  Playwright network mocks only. No backend or user data was changed.
- With the real backend absent, auth/workspace routes were also rendered in their true
  connection-error state. That boundary is documented as a defect rather than hidden.
- Pixel-inspected representative desktop home, discovery, story, reader/loading, auth,
  settings, and 390px mobile home renders.

### Asset coverage

- All 15 local anime JPEGs decoded at 352×528 and were sampled for dimensions and tonal
  range; the set spans bright to very dark art while the UI provides a stable dark frame.
- The MP4 decoded as 382×850, 5.04 seconds, muted/looping/controls-off markup.
- Five stock SVGs, two zero-byte story files, and the 256×256 favicon were inspected.
- Remote Unsplash and FlagCDN dependencies were traced from source and checked in the
  rendered public routes; no rendered image had zero natural width during the desktop
  route pass.

### Checks

- `pnpm --filter @fury/web check-types` — passed.
- `pnpm --filter @fury/web test` — 12 files passed, 95 tests passed.
- UI UX Pro Max targeted searches validated focus, keyboard semantics, touch sizing,
  reduced motion, RTL typography, and Next.js image/font concerns.

### Boundaries

- The backend at `localhost:4000` was not running. Server-confirmed mutation outcomes,
  browser history after real credentials, reload/session persistence, and authenticated
  error recovery remain **unverified**; project rule F31 requires real-browser/backend
  evidence for those claims (`docs/engineering/frontend-standard.md:398-411`).
- Physical 320px/device and orientation testing remains **unverified**. Static rules
  and automated browser widths were inspected, but no physical mobile device was used.
- The checkout’s referenced `docs/design/design-system.md`, testing, security, workflow,
  and engineering index documents are deleted in the current worktree. They were not
  restored or used as authority; this audit preserved the user’s existing changes.

# Complete Frontend Discovery and Evidence Method

Read this file before making any design-system decision.

## 1. Establish the real scope

1. Resolve the repository root from the current checkout; do not rely on the shell's
   starting directory.
2. Read workspace and frontend manifests, framework/style configuration, root agent
   instructions, and applicable nested agent instructions.
3. Start with the current web package (`apps/web`) and follow its local imports into
   shared packages. Include a shared file only when it affects rendered UI, visual
   state, content formatting, or interaction behavior.
4. Record the starting working-tree status and existing modified, deleted, and
   untracked paths. These belong to the user.
5. Find existing design-system files before choosing output paths. A deleted tracked
   file remains a user change and must not be restored implicitly.

Exclude dependencies, generated framework/build output, caches, coverage, temporary
files, AI histories, and unrelated backend/data code. Tests, stories, and fixtures
are secondary evidence for intended variants and states; they do not replace the
rendered implementation.

## 2. Build the inventory before interpretation

Use recursive file discovery (prefer `rg --files`) and maintain a review ledger. Give
every relevant file exactly one primary category and any useful secondary tags.

Inventory at least:

- route entries, route groups, dynamic routes, layouts, templates, metadata, loading,
  error, not-found, and access-denied surfaces;
- shared shells, navigation, headers, sidebars, footers, mobile navigation, and reader
  or viewer chrome;
- shared UI primitives and their variant/state definitions;
- feature components, authentication, dashboard, settings, profile/account, search,
  filter, reader/viewer, administrative, and other product routes actually present;
- forms and controls, tables, lists, cards, dialogs, drawers, menus, overlays,
  notifications, pagination, tabs, accordions, and feedback states;
- global CSS, CSS modules, SCSS, utility usage, Tailwind/PostCSS configuration, CSS
  variables, theme providers, design tokens, class composition helpers, and inline
  presentation values;
- font loading and locale/direction handling, especially Arabic/English and RTL/LTR;
- icons, logos, illustrations, cover/media treatment, placeholders, aspect ratios,
  gradients, shadows, and other identity-bearing assets;
- transition declarations, keyframes, animation libraries, loaders, skeletons, hover,
  press, focus, expanded, selected, disabled, pending, success, warning, and error
  behavior; and
- presentation code imported from shared workspace packages.

Do not infer coverage from directory names. Open and read each relevant file. When a
file is primarily logic, inspect enough to confirm whether it emits visible state or
presentation data before excluding it.

## 3. Map routes, states, and responsive evidence

Create a route/state matrix with:

| Route or surface | Entry/layout | Access needs | Major components | Required states | Responsive modes | Render status |
| ---------------- | ------------ | ------------ | ---------------- | --------------- | ---------------- | ------------- |

Include every source-defined page, not only top-level or public pages. For dynamic or
authenticated routes, identify available fixtures, mocks, seed data, or source states.
Do not invent credentials or mutate production data to obtain a screenshot.

When safe runtime/browser access exists:

- render every reachable route rather than only representative routes;
- inspect default plus materially different loading, empty, populated, validation,
  error, open-overlay, selected, disabled, and destructive-confirmation states;
- test widths immediately below and above the breakpoints found in source, plus a
  small mobile width such as 375 CSS px when applicable;
- inspect RTL and LTR when both are supported, long labels/content, keyboard focus,
  hover/press, zoom or enlarged text, and reduced motion where relevant; and
- compare the rendered result back to the implementation so browser defaults,
  inherited CSS, and composition effects are not missed.

If rendering is blocked, continue the complete source audit and list the exact routes
and states that remain visually unverified. Do not claim visual verification from
static code alone.

## 4. Maintain an evidence ledger

For each meaningful pattern record:

| Field                    | Meaning                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| Evidence ID              | Stable local identifier used while analyzing                      |
| Category                 | Color, type, spacing, component, layout, motion, and so on        |
| Semantic role            | What the pattern communicates or enables                          |
| Exact implementation     | Variable, class, selector, property/value, component/variant      |
| Sources                  | Repository-relative `path:line` references                        |
| Occurrences              | Count and distribution, not a vague “common” label                |
| Product weight           | Shared, core route, supporting route, isolated, or legacy-looking |
| State/viewport/direction | Conditions under which it appears                                 |
| Visual verification      | Rendered, source-only, or blocked with reason                     |
| Interpretation           | Observed, consolidated, proposed extension, or exception          |

Keep this ledger as working evidence. The final documents may summarize it, but their
claims must remain traceable to source.

## 5. Extract the existing visual language

### Colors

Collect variables, Tailwind utilities, raw literals, alpha variants, gradients,
overlays, shadows, and browser-inherited colors. Normalize only for comparison; retain
the exact authored value and theme/context. Group by semantic role: primary and its
states, secondary, accent, page/background/surface/elevated/card, borders, text tiers,
disabled, success, warning, danger, information, scrim, and elevation.

Identify exact duplicates, near-duplicates, one-off literals, and values that look
different because opacity is composited over different surfaces. Measure relevant
foreground/background contrast; do not estimate it visually.

### Typography

Trace loaded font files or providers and actual fallback stacks. Record language and
direction use, weights, sizes, line heights, letter spacing, wrapping/truncation, and
responsive changes for display, headings, body, navigation, controls, labels,
captions, and metadata. Derive the hierarchy from actual use frequency and role.

### Spacing, layout, and responsive behavior

Collect recurring padding, margin, gap, section rhythm, gutters, container widths,
header/sidebar sizes, grid columns, alignment, aspect ratios, sticky/fixed offsets,
z-index, and source-defined breakpoints. Consolidate a practical scale without hiding
meaningful exceptions. Document mobile, tablet, desktop, and RTL behavior from code
and rendering.

### Shape, borders, and elevation

Record radius, border width/style/color, dividers, focus/selected rings, shadows,
blur, and hover/floating elevation by semantic role. Consolidate into a small scale
only where the evidence supports it.

### Icons and imagery

Identify each icon source/library, custom SVG set, size and stroke/fill conventions,
active/inactive treatment, baseline alignment, icon-button hit area, accessible
semantics, logo rules, media aspect ratios, cropping, placeholders, overlays, and
decorative treatments. Treat the same glyph according to its context rather than
assigning one global accessibility meaning.

### Motion

Collect transition and animation properties, durations, easings, delays, keyframes,
entrances/exits, modal/dropdown movement, hover/press effects, loaders, skeletons, and
reduced-motion handling. Distinguish purposeful feedback from decoration and identify
layout-shifting or non-interruptible behavior.

## 6. Inventory components by semantics

Check every category below and mark it as present, absent, or implemented only as a
page-local pattern:

- Button, Icon Button, Input, Textarea, Select, Checkbox, Radio, Switch, Search Input,
  and Form Field;
- Card, content/media card, stat card, Badge, Chip, Tag, Avatar, and Image/media;
- Modal, Dialog, Drawer, Dropdown, Menu, Popover, Tooltip, Tabs, and Accordion;
- Pagination, Breadcrumbs, Navbar, Sidebar, Header, Footer, Table, and List;
- Empty, Error, Loading, Skeleton, Alert, Toast, and Confirmation UI; and
- Fury-specific patterns discovered in the actual code, especially manga discovery,
  metadata, progress, library, ranking, and reader/viewer patterns when present.

For every important existing or canonicalized component record:

- purpose and when not to use it;
- anatomy and owned sub-elements;
- size, visual variants, and semantic variants;
- color, type, spacing, radius, borders, shadow, and icon behavior;
- default, hover, focus-visible, active/pressed, selected/expanded, disabled, loading,
  success, warning, and error states as applicable;
- responsive, RTL/LTR, keyboard, screen-reader, touch/pointer, long-content, and
  reduced-motion behavior; and
- reusable implementation source versus duplicated page-local implementations.

Absence is evidence: do not invent a component API just to fill the inventory. If a
missing primitive is necessary to describe a recurring pattern, document it as a
proposed canonical extraction without changing code.

## 7. Detect material inconsistencies

Compare patterns only after assigning semantic role. A difference is material when it
causes ambiguous hierarchy, brand drift, inconsistent interaction, responsive
breakage, repeated ad-hoc implementation, or an accessibility failure. Ignore trivial
one-offs that do not affect the visual system.

For each candidate conflict:

1. State exactly what differs and where.
2. Confirm whether the contexts share the same semantic purpose.
3. Count usage and weight shared components and core screens more heavily.
4. Compare behavior across state, viewport, direction, and theme.
5. Apply the canonicalization priority in `SKILL.md`.
6. Use a focused UI UX Pro Max query only when it can inform the disputed UX or
   accessibility criterion.
7. Select one canonical pattern or document a legitimate semantic exception.
8. Record confidence and any proposed migration guidance without implementing it.

## 8. Reconcile discovery

Before canonicalization, reconcile:

- all discovered relevant files against the review ledger;
- all source-defined routes against the route/state matrix;
- all component categories against present/absent/local status;
- all CSS variables/theme values and raw presentation literals against token groups;
- all actual breakpoints and theme/direction modes against responsive coverage; and
- all blocked runtime states against the limitations list.

Zero unclassified relevant files is the source-completeness gate. A large frontend may
be processed in batches, but no batch may be silently sampled or skipped.

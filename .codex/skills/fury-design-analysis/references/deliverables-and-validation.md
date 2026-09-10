# Canonical Deliverables and Validation Contract

Read this file after discovery is complete and before making canonical decisions.

## 1. Choose output paths safely

Search the current working tree for an established design-system document and follow
the repository's live convention. Do not restore a tracked deletion or overwrite a
user-edited document silently.

When no current canonical location exists, create:

- `DESIGN-SYSTEM.md` for the canonical system; and
- `DESIGN-SYSTEM-INCONSISTENCIES.md` for the material inconsistency report.

Keep the two files adjacent when another established location is selected. Use a
separate inconsistency document whenever there is more than a small handful of
material conflicts; otherwise a clearly named section in the Design System is
acceptable. Do not generate a parallel UI UX Pro Max `design-system/` tree.

## 2. Decision labels

Label each canonical decision so readers can distinguish its basis:

- **Observed canonical:** already embodied by the reusable or dominant Fury pattern.
- **Consolidated canonical:** selected from conflicting existing Fury patterns using
  the evidence priority.
- **Semantic exception:** intentionally different because its role differs.
- **Proposed canonical extension:** missing behavior or token needed for a coherent,
  accessible system and derived conservatively from Fury's identity.
- **Unverified:** blocked by inaccessible runtime, state, asset, or evidence.

UI UX Pro Max may validate or influence a choice, but it is never the primary evidence
label for an existing product value.

## 3. Fury Design System document

Write for both implementers and AI coding agents. Use exact values, current
implementation names, semantic meaning, state behavior, and repository-relative
`path:line` evidence. Avoid generic design advice.

Use this structure unless an existing approved document has an equivalent structure:

1. **Title and analysis scope**
   - analyzed frontend roots, imported presentation roots, working-tree/commit context
     when available, visual verification coverage, and known limitations;
   - source-of-truth and decision-label explanation.
2. **Design philosophy**
   - a short, concrete description of Fury's observed identity, audience, content
     hierarchy, density, directionality, and interaction character.
3. **Core principles**
   - product-specific rules inferred from recurring evidence, not slogans.
4. **Design tokens**
   - colors and state pairs;
   - typography, including Arabic/English and RTL/LTR behavior where present;
   - spacing, radius, borders, shadows/elevation, opacity, icon sizing, motion,
     z-index, container widths, and breakpoints;
   - semantic token name, exact value, existing code representation, role, decision
     label, and source evidence for each token;
   - light/dark mappings only when the application actually supports them or as a
     clearly proposed extension.
5. **Components**
   - inventory summary showing present, absent, and local-only categories;
   - detailed canonical contract for every important component and Fury-specific
     pattern using the component template below.
6. **Page layout patterns**
   - shells, headers, navigation, content sections, containers, grids, cards, detail
     layouts, forms, dashboards, reader/viewer layouts, feedback states, and mobile
     composition that actually recur.
7. **Responsive and direction rules**
   - source-defined breakpoints, behavior around each boundary, fluid behavior,
     mobile/tablet/desktop priorities, long-content resilience, and RTL/LTR.
8. **Interaction patterns**
   - navigation, hover/press, focus, disclosure, overlay dismissal, async feedback,
     destructive confirmation, loading, empty, success, and error behavior.
9. **Accessibility rules**
   - measured color pairs, focus visibility, keyboard order and escape routes, labels
     and names, error association/recovery, reduced motion, target sizing, zoom/text
     growth, non-color meaning, image alternatives, and inaccessible gaps.
10. **Iconography and imagery**
    - actual libraries/assets, semantic rules, sizes, stroke/fill, alignment, media
      ratios/crops/placeholders, overlays, and content-image treatment.
11. **Do / Don't rules**
    - concrete paired examples anchored in observed Fury patterns. Include primary vs
      destructive actions, token reuse, containers, component reuse, icon consistency,
      and responsive behavior.
12. **New Page Checklist**
    - the mandatory checklist below.
13. **Coverage and evidence appendix**
    - reviewed roots and category counts, route/state coverage, visual verification,
      UI UX Pro Max references/searches used, exclusions with reasons, and unverified
      boundaries; link the inconsistency report.

### Token table contract

At minimum document these roles when present or explicitly mark a gap:

- primary, primary hover, primary active, secondary, and accent;
- background, surface, elevated surface/card, border, and subtle border;
- primary, secondary, muted, inverse, and disabled text;
- success, warning, danger/error, and information with on-color pairs;
- overlay/scrim and shadow/elevation colors;
- font families, role-based sizes, weights, line heights, and letter spacing;
- practical spacing scale, radii, border widths, elevation levels, opacity, durations,
  easing, z-index, containers, gutters, and breakpoints.

Do not create dozens of aliases for one-off values. Preserve meaningful special cases
and identify them as exceptions.

### Component section template

For each important component include:

- **Purpose / avoid when**
- **Canonical source and decision label**
- **Anatomy**
- **Sizes and variants**
- **Tokens and typography**
- **States**: only applicable states, but never omit focus, disabled, loading, or error
  when the component can have them
- **Responsive and RTL/LTR behavior**
- **Accessibility and interaction**
- **Usage examples and source evidence**

Document the visual/behavioral contract. Do not invent a TypeScript component API that
does not exist.

### Mandatory new-page checklist

The document's checklist must require a future implementer to verify:

- the correct existing shell, route layout, container, and navigation pattern;
- one clear primary action and semantic separation of destructive actions;
- canonical tokens and reusable components instead of new raw visual values;
- all applicable default, hover, focus-visible, active/pressed, disabled, loading,
  empty, success, and error states;
- source-defined responsive breakpoints, small-screen overflow, long text, zoom/text
  growth, and RTL/LTR behavior;
- keyboard operation, logical focus order, visible unobscured focus, accessible names,
  labels, descriptions, errors, and escape routes;
- contrast for actual foreground/background/state pairs and no color-only meaning;
- correct icon library, size, stroke/fill, alignment, and decorative/meaningful/control
  semantics;
- image dimensions/aspect ratio, alt behavior, loading, and placeholder treatment;
- purposeful, interruptible motion with reduced-motion behavior and no layout shift;
- async feedback, error recovery, empty-state action, and destructive confirmation;
- visual comparison with existing core Fury pages at relevant viewports; and
- no undocumented token, component variant, or page-level styling exception.

## 4. Material inconsistency report

Start with an executive summary and severity counts. Include only system-relevant
conflicts, grouped by color, typography, spacing/layout, shape/border/elevation,
components, icons/imagery, motion/interaction, responsive behavior, and accessibility.

Use one record per conflict:

| Field               | Required content                                                              |
| ------------------- | ----------------------------------------------------------------------------- |
| ID and severity     | Stable ID; high, medium, or low impact                                        |
| Same semantic role? | Yes, no, or partially, with reasoning                                         |
| What differs        | Exact competing values/implementations/states                                 |
| Where               | Repository-relative `path:line`, affected routes/components, occurrence count |
| Canonical choice    | Exact selected pattern and decision label                                     |
| Why                 | Evidence hierarchy applied in order, including applicable UI UX validation    |
| Exceptions          | Legitimate semantic/contextual differences that remain                        |
| Guidance            | What future work should use or avoid; migration note only, no refactor        |
| Confidence/limits   | High/medium/low and any unrendered or inaccessible evidence                   |

Severity reflects user/system impact, not how easy a migration would be:

- **High:** ambiguous primary hierarchy, inaccessible interaction/contrast, navigation
  inconsistency, responsive breakage, or major brand split.
- **Medium:** repeated component/token drift that visibly weakens consistency.
- **Low:** limited but recurring visual drift worth preventing in future work.

Do not report a destructive button merely for being red, a selected navigation item
for differing from inactive items, or contextually different density as inconsistent
without first proving that the semantic roles should match.

## 5. UI UX and accessibility validation

Validate the extracted system against the project-local UI UX Pro Max guidance after
canonical candidates are known. At minimum review applicable guidance for:

- readable contrast and non-text state contrast;
- focus visibility, keyboard access, modal escape, and focus not being obscured;
- target size and spacing appropriate to web pointer/touch use;
- form labels, field errors, error summaries, authentication/autofill, and recovery;
- primary/destructive hierarchy and state clarity;
- breakpoint consistency, zoom, horizontal overflow, fixed-element offsets, readable
  measure, compact labels, and long tokens;
- semantic colors, type hierarchy, whitespace, icon consistency and semantics;
- meaningful, performant, cancellable motion and reduced-motion handling;
- loading, empty, failure, confirmation, and notification feedback; and
- image dimensions, layout stability, and media accessibility.

Apply a recommendation only when it fits the actual web surface and Fury's identity.
If accessibility requires a change absent from the project, record a proposed
canonical extension and the current inconsistency/gap. Do not silently rewrite the
observed system.

## 6. Final validation

### Coverage

- Reconcile all relevant source files to the review ledger with zero unclassified
  files.
- Reconcile every route to the route/state matrix and disclose blocked renders.
- Account for every required component category as present, absent, or local-only.
- Account for raw colors, theme variables, type declarations, breakpoints, motion,
  icons, and identity-bearing assets.
- Confirm core, authenticated, reader/viewer, settings/account, loading, empty, error,
  and mobile surfaces when they exist.

### Documentation accuracy

- Verify every path, component, token, variable, class, breakpoint, library, script,
  and command named in the documents against the current repository.
- Verify internal links and headings and remove placeholders, unsupported claims, and
  vague frequency words that lack counts.
- Make observed/consolidated/proposed/unverified status explicit.
- Ensure the canonical document and inconsistency report do not contradict each other.

### No-refactor gate

- Compare the ending working tree with the captured baseline.
- Confirm this run introduced only the intended design-system documentation changes.
- Do not erase, restore, format, or include pre-existing user changes.

### Delivery report

Report the exact output paths, frontend roots and route coverage, rendered versus
source-only coverage, major canonical decisions, high-impact inconsistencies, UI UX
Pro Max references/searches used, verification performed, and remaining limitations.
Never state that the audit is complete if the inventory reconciliation or evidence
gates failed.

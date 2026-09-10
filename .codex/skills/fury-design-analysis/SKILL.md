---
name: fury-design-analysis
description: "Analyze Fury's complete existing frontend to extract, reconcile, and document its canonical design system and material UI inconsistencies. Use for full-project visual-language audits or design-system regeneration; do not use to invent a new theme or refactor application UI."
---

# Fury Design Analysis

## Outcome

Derive a canonical Fury Design System from the entire current frontend, then write
practical guidance that lets humans and AI agents extend the product without making
new pages look imported from another application.

The existing UI is the primary evidence. UI UX Pro Max supplies design, UX,
accessibility, and consistency expertise when validating the evidence or resolving a
real conflict. It is not a replacement theme generator.

## Project-only boundary

- Run only from the Fury repository that contains this skill under
  `.codex/skills/fury-design-analysis/`.
- Treat `apps/web` as the current frontend entry package, but verify that fact from
  the current workspace manifests and include presentation code or assets it imports
  from elsewhere in the repository.
- Read the root `AGENTS.md`, every applicable nested `AGENTS.md`, current manifests,
  and existing design guidance before analysis. If a referenced guide is absent in
  the working tree, record the limitation; do not restore or reconstruct it.
- Capture the working-tree baseline before writing. Preserve all existing edits.
- Do not modify application source, components, styles, assets, dependencies,
  configuration, or tests. The default write scope is design-system documentation
  only. Implementation requires a separate, explicit user request.
- Do not install anything globally, copy UI UX Pro Max, or duplicate its knowledge.

## Required reading

Before inventorying the frontend, read
[frontend-discovery.md](references/frontend-discovery.md) completely. Before making
canonical decisions or writing output, read
[deliverables-and-validation.md](references/deliverables-and-validation.md)
completely.

Locate the project-local UI UX Pro Max skill, normally at
`.codex/skills/ui-ux-pro-max/`, and read its `SKILL.md` completely. For this web audit,
also read its `references/quick-reference.md`. Read other references it routes to
only when their stated scope applies; for example, do not impose native-only rules on
the web application.

Use the discovered UI UX Pro Max `scripts/search.py` by its resolved absolute path
for focused questions that arise from the code, such as contrast, keyboard focus,
form errors, responsive overflow, icon semantics, typography, or motion. Follow its
query contract: one outcome per query, explicit domain or detected stack, one narrower
retry for empty/off-topic results, and label fallbacks. Do not use `--persist`. Do not
use `--design-system` to replace the extracted Fury identity; a generated theme may
only be a clearly secondary comparison when the user explicitly requests one.

## Required workflow

1. Establish the repository/frontend scope and record the clean-or-dirty baseline.
2. Build a recursive inventory of every relevant route, layout, component, style,
   visual configuration, state, and asset before deciding what is canonical.
3. Read every inventoried implementation and reconcile the inventory to zero
   unclassified relevant files. Filenames and representative sampling are not
   sufficient.
4. When runtime access is safe and available, render every reachable route plus
   materially distinct states and inspect them at the project's real responsive
   boundaries. Keep code evidence for routes or states that cannot be rendered and
   report the limitation.
5. Extract the visual language and reusable component inventory with file-and-line
   evidence, occurrence counts, semantic role, route importance, viewport, and state.
6. Separate legitimate semantic variants from accidental visual drift. Identify only
   material inconsistencies.
7. Use UI UX Pro Max to validate and arbitrate after project evidence exists.
8. Select canonical patterns with the priority rules below and turn them into exact,
   implementation-aware tokens and component/page guidance.
9. Generate the canonical Design System and a material inconsistency report using the
   output contract.
10. Run the completeness, accuracy, accessibility, and no-refactor gates before
    delivery.

## Canonicalization priority

Resolve each genuine conflict in this order:

1. Existing shared or reusable component implementation.
2. Pattern used consistently across the largest part of the application.
3. Pattern used on core or product-critical screens.
4. Pattern that best preserves the established Fury identity.
5. Pattern with stronger accessibility and UX.
6. Applicable UI UX Pro Max guidance.
7. Design judgment, only when the earlier evidence is insufficient.

Never decide by taste alone. Do not flatten semantic differences: a destructive
action, error, warning, contextual badge, or selected state can legitimately differ
from the primary action. Record the purpose before classifying a difference as drift.

When the product lacks a necessary accessible state or semantic token, derive the
smallest compatible extension from nearby Fury patterns and label it as a proposed
canonical extension rather than pretending it already exists.

## Evidence rules

- Prefer implementation and rendered behavior over names, comments, or assumptions.
- Cite repository-relative `path:line` evidence for every canonical token, component,
  layout pattern, and inconsistency decision. Use representative citations plus an
  occurrence count when a pattern is widespread.
- Preserve exact source values, including opacity, alpha composition, gradients,
  theme mapping, responsive modifiers, and state selectors. Do not convert values by
  eye.
- Distinguish observed fact, reasoned consolidation, UI UX Pro Max validation, and a
  proposed gap-filling rule.
- If evidence is inaccessible or a visual state cannot be verified, say so in the
  output and lower the decision confidence. Never fill the gap with “probably.”

## Completion gate

Do not finish until the output proves that the run:

- read the whole frontend and all pages, shared components, styles, tokens, and
  imported presentation code;
- analyzed actual implementations and responsive behavior rather than filenames or
  assumptions;
- covered repeated patterns, visual states, interaction states, assets, and
  Fury-specific components;
- detected material conflicts and separated semantic variants from accidental
  inconsistencies;
- selected canonical patterns using the stated evidence hierarchy;
- used project-local UI UX Pro Max for applicable expert validation while preserving
  Fury's identity;
- documented exact tokens, components, page patterns, responsive rules, interaction
  rules, accessibility rules, iconography, and imagery;
- included concrete do/don't guidance, a new-page checklist, and an inconsistency
  report;
- reconciled the discovery inventory and disclosed every unverified boundary; and
- introduced no application-code changes.

End with a concise summary of output paths, coverage, major canonical decisions,
important inconsistencies, UI UX Pro Max checks used, limitations, and verification
performed.

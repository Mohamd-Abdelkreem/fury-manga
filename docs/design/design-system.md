# Fury frontend preservation and integration

This guide applies the frozen current Fury frontend under
[constitution VI](../../.specify/memory/constitution.md). Root
[DESIGN-SYSTEM.md](../../DESIGN-SYSTEM.md) is the visual reference. Preserve the
actual existing presentation; historical inconsistencies, proposed extensions and
old roadmap recommendations are not permission to normalize or redesign it.

## Preserve the current frontend

Do not add/delete/move/rename/redesign pages, routes, layouts, navigation,
dialogs/popups, controls or static copy. Preserve typography, Arabic/RTL, colors,
spacing, breakpoints, sizes, icons, imagery treatment, motion and interaction
presentation. No new theme, component library or design-system regeneration is
part of ordinary integration. The freeze covers public, reader, account, workspace
and admin surfaces.

Inspect source and relevant rendered views to identify the actual current baseline;
a selector alone does not prove a component exists. A historical missing-surface
claim must be checked against current code. Record actual conflicts rather than
silently choosing a preferred pattern.

## Connect real behavior to existing surfaces

Complete and test the required backend group first. Then replace fixture/local
sources through existing API/hooks and validated DTOs. Wire existing controls,
validation, current access and query/mutation/feedback states without altering
presentation. Invisible logic extraction is bounded by the selected task scope.

Reuse current primitives and existing feedback/error/loading/confirmation surfaces.
A required absent surface or incompatible static copy is an owner-decision gate;
do not invent UI, hide failure/success or drop a requirement. A separate explicit
owner decision and constitutional amendment are required to change the freeze.
Accessibility and responsive findings must be reported and verified, but a correction
that changes frozen presentation cannot be adopted without that decision.

## What each reusable component defines

| Concern         | Decision                                                             |
| --------------- | -------------------------------------------------------------------- |
| Purpose         | When to use it, feature-specific versus shared ownership             |
| Visual variants | Primary/secondary/destructive and compact/regular as actually needed |
| Tokens          | Semantic color, typography, spacing, radius, border, elevation       |
| Interaction     | Hover, focus, pressed, loading, disabled, error and success          |
| Accessibility   | Labels, keyboard, dialog focus/Escape/restoration and announcements  |
| Layout          | Content length, RTL/LTR, narrow screen, portrait/landscape           |
| Motion          | Purpose, interruption and reduced-motion behavior                    |
| Data boundary   | Display props and events; no generic component-owned business API    |

Keep business labels/status mapping in the feature. Reuse current semantic tokens
without changing their values or presentation. Preserve the current Arabic-first
RTL behavior, static copy and approved mixed-direction content.

## Example: token-driven control

This snippet illustrates responsibility, not a control to add or a CSS change to
apply under the freeze. Resolve any real implementation from the existing owner
and preserve its values and presentation. Resolve token values
from the approved project theme. A React component may expose variants matching
the existing library rather than creating this class again.

```css
.action {
  min-block-size: var(--control-height);
  padding-inline: var(--control-padding-inline);
  border: var(--control-border-width) solid var(--action-border);
  border-radius: var(--control-radius);
  background: var(--action-background);
  color: var(--action-foreground);
}
.action:focus-visible {
  outline: var(--focus-width) solid var(--focus-color);
  outline-offset: var(--focus-offset);
}
.action:disabled {
  opacity: var(--disabled-opacity);
  cursor: not-allowed;
}
@media (prefers-reduced-motion: reduce) {
  .action {
    transition: none;
    animation: none;
  }
}
```

Logical properties support direction changes; they do not remove the need to inspect
icon direction and mixed-language content. Test 320px and meaningful larger sizes,
long real text and keyboard operation. Do not globally remove focus indicators or
list semantics needed by rich content.

## State truth and adoption

Loading is not zero/empty; background error is not confirmed absence. Errors use
appropriate alert presentation, status uses status presentation, and color alone
does not carry meaning. Relevant dirty drafts survive refetch/conflict as defined
in the frontend standard. Buttons and actual handlers both enforce pending/access.

When a mock feature goes live, reuse approved presentation and replace the data
adapter deliberately. Verify authoritative success/failure/access/cache behavior,
not just a screenshot match. Keep mock role/provider controls out of production.

Relevant rules: F02/F04/F07/F28/F29/F31.

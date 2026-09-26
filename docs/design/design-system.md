# Project design-system practice

This file defines how to establish and preserve a design system. It deliberately
does not supply a client's palette, font, logo, dimensions or screen inventory.
Those values come from the actual project's approved design and code.

## Starting from existing pages

Inspect rendered pages as well as source: actual CSS imports/cascade, token values,
component variants, layout, typography and interactions. A CSS selector does not
prove a component exists; repeated styling does not automatically mean approved
design. Extract consistent patterns and surface disagreements before normalizing them.

Reuse existing primitives and sensible feature components. Do not introduce another
UI framework, packages/ui tree or universal renderer just to match an example.
Move prototype code into reviewed production structure; production must not depend
on an external reference/mock project.

## Starting without pages

Derive a page/state inventory from the requested scope. Establish a visual direction
and representative components, then build navigable mock views with coherent fixture
data and important states. A complete-site design request needs review of the relevant
complete site; a small feature needs its affected views; a backend-only task needs
no unrelated screens.

A browser preview can be the design artifact without a design SaaS tool. Keep it
reconstructable and separate mock data/authority from production behavior. Rejection
means revise the reviewed design, not delete unrelated work. Record the accepted
revision/scope; elapsed time and green tests do not grant visual approval.

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

Keep business labels/status mapping in the feature. Prefer semantic tokens over
brand-color names in behavior. Preserve significant language/reading direction;
Arabic-first RTL is the default unless the client explicitly requires otherwise.

## Example: token-driven control

These token names illustrate roles, not a palette to copy. Resolve their values
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

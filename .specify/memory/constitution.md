# Engineering Constitution

## Core principles

### I. Preserve scope and established ownership

Implement the accepted feature against the actual checkout. Preserve working
behavior and unrelated edits. Use `AGENTS.md` and `docs/engineering/README.md` to
locate the authoritative rules and actual layer owners. Shared example names are
illustrations, not mandatory packages or features. Add abstractions when they solve
demonstrated needs; do not reconstruct the whole application for a bounded change.

### II. Consistent application boundaries

Apply the relevant `docs/engineering/code-style.md`, backend B01-B54 and frontend
F01-F31 rules. Keep transport, validation, business logic, persistence, presentation
and server-state responsibilities in their defined owners. Reuse current components,
contracts and helpers. Record specific justified exceptions instead of silently
weakening the baseline or copying accidental patterns from reference projects.

### III. Contracts, data and security are acceptance requirements

Use the shared contract, data and security guides for affected behavior. Validate
untrusted input, enforce authority server-side, map public output explicitly, and
cover applicable transaction/concurrency/error semantics. Discover real schema and
migrations; preserve data unless the user authorizes a destructive operation.
Provider outcomes must be real, and mocks must remain visibly scoped simulations.

### IV. Design follows the approved scope

Use `docs/design/design-system.md` to extract existing visual rules or establish
new scoped previews. Obtain approval for new design before adopting it into live
behavior. Cover relevant responsive, accessibility, loading, empty, error and access
states. Backend-only changes do not require unrelated pages or a full-site redesign.

### V. Independent verification and explicit ownership

Use meaningful requirements-based tests and the actual repository checks described
in `docs/engineering/testing.md`. Codex High plans, diagnoses and reviews. Under the
current Codex trial, separate Medium agents own application code and test code.
The lead verifies real diffs/results and accepts tasks. Failed tests require diagnosis,
not weaker assertions. Required checks that cannot run remain explicit blockers or
unverified gates; historical results do not prove current completion.

### VI. Bounded, resumable delivery

Follow `docs/workflow/operating-policy.md`. Each selected phase/feature has one
Spec Kit cycle, clear tasks, evidence and a checkpoint. Stop after every phase unless
the user explicitly authorizes continuation. Preserve progress and stop on quota
exhaustion; do not silently change provider or effort. Ask only for consequential
missing decisions. Use English for questions, specs, briefs and reports; product
language belongs to the accepted client requirements.

## Governance

Version 1.0.0 adopts the user's existing portable engineering baseline and current
Codex-only trial. Detailed rules stay in their existing guides; client requirements
stay in the project plan/spec/design. Amendments record their reason and impact in
Git and update affected templates/instructions. User instructions and platform
permissions remain authoritative. A constitution or skill is guidance, not proof
that delegation, testing or acceptance ran successfully.

**Version**: 1.0.0 | **Ratified**: 2026-09-08 | **Last Amended**: 2026-09-08

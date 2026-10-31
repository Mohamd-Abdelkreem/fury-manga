# [CHECKLIST TYPE] Checklist: [FEATURE NAME]

**Purpose**: [Written requirements/design quality for the selected phase]
**Created**: [DATE]
**Feature**: [matching spec/plan link and exact PHASE_ID]
**Review Status**: Generated; new custom items are unreviewed

Apply the constitution and CHECKLIST section of `docs/workflow/speckit-prompts.txt`.
Replace these sample items with concrete evidence-linked questions. Preserve existing
IDs/content on append. Generation is not approval; leave new custom items unchecked.

## Scope, Frontend Freeze and Backend Gate

- [ ] CHK001 Are deliverables, exclusions, matching feature and predecessor gates explicit? [requirement/plan reference]
- [ ] CHK002 Are existing frozen surfaces and missing-surface/static-copy decisions specified without implied presentation approval? [reference]
- [ ] CHK003 Is complete backend acceptance required before dependent existing-UI integration? [reference]

## Applicable Behavior and Evidence Requirements

- [ ] CHK004 Are relevant actors, authority/publication/privacy, contracts and state/failure outcomes clear and consistent? [reference]
- [ ] CHK005 Are applicable data/media/concurrency/recovery requirements and boundaries measurable? [reference]
- [ ] CHK006 Are real test/review/boundary criteria, services, ownership and remaining decisions specified? [reference]

## Review Evidence

Record concise evidence only during explicitly authorized requirements review.
A checked requirements-quality item means written requirements are complete, clear,
consistent and testable; it does not mean code exists or tests passed. Other checklist
kinds retain their own evidence criteria. Future implementation acceptance belongs
in tasks and must not be falsely pre-approved to unblock the implementation skill.
Approval markers remain read-only during implementation. Unresolved items remain
visible gates; no automatic proceed-anyway or fabricated approval.

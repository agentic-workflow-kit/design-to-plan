# Eval Cases

This directory holds design-to-plan-owned deterministic semantic cases. Each case owns its source
fixtures, candidate plan or review output, expected fixture data, rubric, bad-candidate examples,
provenance, and manifest.

## Portfolio

- `case-projection-graph-evidence-v1` checks the happy path: projection-only story decomposition,
  `Product AC -> handoff fact -> Jig property` trace rows, whole-graph producer/consumer closure,
  source-backed dependency edges, concrete evidence binding, and no Jig schema/runtime invention.
- `case-missing-product-source-stop-v1` checks that missing Product AC source material produces a
  stop result with source and owner attribution instead of an invented plan.
- `case-missing-design-source-stop-v1` checks that a missing or TBD Planner Handoff Summary
  produces a Technical Design-owned stop result instead of invented handoff facts.
- `case-review-plan-blockers-v1` checks that `review-plan` catches a bad emitted plan with phantom
  consumers, unsupported dependency edges, prose-only evidence, unsourced operands, and Jig schema
  invention.

These cases are local deterministic development fixtures under D-011. They are not Promptfoo model
runs, not public runtime behavior, and not a field-level Jig schema.

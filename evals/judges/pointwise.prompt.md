# Design-to-Plan Pointwise Judge

Prompt version: `design-to-plan-pointwise-v1`.

Grade one candidate item-by-item against only the visible source material, case rubric, expected
items, and candidate text. This is an advisory model-assisted review for `design-to-plan` planning
quality. It is not a deterministic gate, not CI evidence, and cannot override deterministic
blockers.

Inputs:

- Case id: `{{case_id}}`
- Model: `{{model}}`
- Provider: `{{provider}}`
- Prompt version: `{{prompt_version}}`
- Rubric version: `{{rubric_version}}`
- Source material: `{{source_material}}`
- Case rubric: `{{case_rubric}}`
- Expected items: `{{expected_items}}`
- Candidate path: `{{candidate_path}}`
- Candidate: `{{candidate}}`

## Rubric

Rubric version: `design-to-plan-pointwise-rubric-v1`.

For each expected item:

- Use `covered` only when the candidate clearly satisfies the item with direct candidate evidence.
- Use `partial` when the candidate addresses part of the item but omits required planning meaning.
- Use `missing` when the candidate does not provide enough support for the item.
- Use `contradicted` when the candidate conflicts with the expected planning meaning.
- Use `unknown` only when the candidate is too ambiguous to judge from the visible inputs.

## Design-to-Plan Boundaries

- Judge planning/projection and review-plan quality only.
- Projection means preserving approved Product AC IDs and Technical Design handoff facts into
  Jig-ready execution-plan properties without adding new source facts.
- Reward source closure, story traceability, authorized dependency edges, falsifiable evidence,
  stop attribution, and disposition-ready review findings.
- Do not reward Product authorship, Technical Design authorship, architecture invention, package
  layout invention, model routing, runtime behavior, or field-level Jig schema detail.
- Treat Jig schema/runtime invention as a scope defect even when it looks precise.

## Bias Controls

- Judge only against the provided source material, expected items, case rubric, and candidate.
- Do not use hidden answer keys, reference candidates, or outside project knowledge.
- Do not reward length, confident tone, or familiar implementation vocabulary without source
  support.
- `covered`, `partial`, and `contradicted` must include direct candidate evidence excerpts.
- Preserve each item's `item_id`, `kind`, `severity`, and `source_refs` exactly as provided.

Return JSON matching `schemas/pointwise-judge-result.schema.json`.

# Design-to-Plan Model Judges

This directory documents the repo-local, manual model-judge lane for `design-to-plan`.

Model judges are advisory review aids. They do not replace deterministic fixture checks, do not run
in `pnpm check`, and cannot upgrade a deterministic red or yellow result. Use them only for local
calibration or reviewer-assisted inspection after deterministic evidence exists.

## Current Lane

- Method: pointwise coverage judge through `eval-kit judge-coverage`.
- Config: `evals/eval-kit.model-judge.config.json`.
- Prompt: `evals/judges/pointwise.prompt.md`.
- Expected items: `evals/cases/<case-id>/pointwise-items.json`.
- Output schema: eval-kit `pointwise-judge-result.schema.json`.

The first P0 lane covers:

- `case-projection-graph-evidence-v1` for projection-only plan quality.
- `case-review-plan-blockers-v1` for review-plan blocker quality.

## Policy

- Deterministic `eval-kit` checks remain authoritative blockers.
- The judge sees only case source artifacts, the case rubric, expected pointwise items, and the
  candidate under review.
- Do not include raw model outputs in committed artifacts unless a human has reviewed and curated
  them.
- Do not run provider-backed commands from CI or from `pnpm check`.
- Do not use this lane to invent Product authorship, Technical Design authorship, Jig schema detail,
  package layout, runtime behavior, model routing, or field-level Jig contracts.

## Manual Use

Run deterministic checks first:

```sh
pnpm eval:doctor
pnpm eval:list
pnpm eval:validate-fixtures
pnpm check
```

Then, only when a provider-backed local judge is intentionally configured, run:

```sh
pnpm eval:judge:coverage -- --case case-projection-graph-evidence-v1 --candidate evals/cases/case-projection-graph-evidence-v1/candidate-good.md --model <model> --provider <provider> --effort medium
```

Record human calibration separately from raw Promptfoo output. Calibration notes should identify
false passes, false fails, ambiguity, verbosity bias, wording overfit, and `unknown` rate.

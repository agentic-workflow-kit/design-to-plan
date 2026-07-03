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

This repo follows the eval-kit two-config standard:

- `evals/eval-kit.config.json` stays deterministic, default, and CI-safe.
- `evals/eval-kit.model-judge.config.json` enables the manual pointwise judge lane.
- Pairwise judging remains deferred unless a future calibrated comparison workflow adds a separate
  config.

Run deterministic checks first:

```sh
pnpm eval:doctor
pnpm eval:list
pnpm eval:validate-fixtures
pnpm check
```

Validate the manual judge config before running provider-backed judging:

```sh
pnpm eval:judge:doctor
pnpm eval:judge:list
pnpm eval:judge:validate-fixtures
```

Then, only when a provider-backed local judge is intentionally configured, run:

```sh
pnpm eval:judge:coverage -- --case case-projection-graph-evidence-v1 --candidate evals/cases/case-projection-graph-evidence-v1/candidate-good.md --model gpt-5.5 --provider openai --effort medium
```

`gpt-5.5` is an account-supported example for local calibration, not a permanent model policy; use
any approved model supported by the current account.

Record human calibration separately from raw Promptfoo output. Calibration notes should identify
false passes, false fails, ambiguity, verbosity bias, wording overfit, and `unknown` rate.

Use `evals/judges/calibration-notes.template.md` for human-reviewed calibration notes. Keep raw
Promptfoo outputs local under `evals/results/`; commit only curated summaries.

## Manual Reports

Manual reports combine existing local run bundles. They are for reviewer handoff and calibration,
not CI.

```sh
pnpm eval:report -- --run-id manual-report-projection-good --deterministic local-det-projection-good --judge-coverage manual-pointwise-projection-good
```

Report policy:

- include deterministic evidence first;
- include pointwise evidence only after deterministic evidence for the same review context exists;
- state that model-judge results cannot upgrade deterministic red or yellow verdicts;
- keep generated report bundles under ignored `evals/results/` unless a human curates a summary.

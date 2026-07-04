# Model-Judge Calibration Notes

This file is the curated, human-readable calibration summary for the design-to-plan manual pointwise model-judge lane. Raw provider result bundles under `evals/results/**` remain local/ignored and are not committed.

Deterministic eval verdicts remain authoritative. Pointwise model-judge evidence is manual, advisory, and cannot upgrade deterministic blockers.

## Run Set

These notes summarize the existing local provider-backed runs from July 4, 2026. No fresh provider calls were made for this curated summary.

| Field             | Value                                                             |
| ----------------- | ----------------------------------------------------------------- |
| Config            | `evals/eval-kit.model-judge.config.json`                          |
| Model             | `gpt-5.4`                                                         |
| Provider          | `openai:codex-app-server`                                         |
| Reasoning effort  | `medium`                                                          |
| Prompt version    | `design-to-plan-pointwise-v1`                                     |
| Rubric version    | `design-to-plan-pointwise-rubric-v1`                              |
| Candidate profile | P0 expected-good and expected-bad projection/review-plan fixtures |

## Calibration Summary

| Case                                | Candidate     | Run id                                                           | Covered | Partial | Missing | Contradicted | Unknown | Human disposition                                                                                         |
| ----------------------------------- | ------------- | ---------------------------------------------------------------- | ------: | ------: | ------: | -----------: | ------: | --------------------------------------------------------------------------------------------------------- |
| `case-projection-graph-evidence-v1` | expected-good | `provider-20260704-v015b-case-projection-graph-evidence-v1-good` |       6 |       0 |       0 |            0 |       0 | Expected pass-like coverage on projection traceability, source closure, evidence, and scope discipline.   |
| `case-projection-graph-evidence-v1` | expected-bad  | `provider-20260704-v015b-case-projection-graph-evidence-v1-bad`  |       0 |       1 |       0 |            5 |       0 | Expected adverse evidence; the one `partial` is non-covered calibration evidence, not pass-like coverage. |
| `case-review-plan-blockers-v1`      | expected-good | `provider-20260704-v015b-case-review-plan-blockers-v1-good`      |       7 |       0 |       0 |            0 |       0 | Expected pass-like coverage on review finding completeness and disposition readiness.                     |
| `case-review-plan-blockers-v1`      | expected-bad  | `provider-20260704-v015b-case-review-plan-blockers-v1-bad`       |       0 |       0 |       0 |            7 |       0 | Expected adverse evidence; no pass-like coverage on intended defects.                                     |

## Human Calibration Notes

- False pass risk: no covered verdicts appeared on expected-bad target defects in the P0 runs.
- False fail risk: no false-fail evidence observed in the P0 expected-good runs.
- Ambiguity: one expected-bad projection item was judged `partial`; by policy this is treated as non-covered/adverse evidence unless explicitly accepted for a non-critical item.
- Verbosity bias: no evidence that longer planning prose was required for coverage.
- Reference wording bias: current evidence should be read as semantic projection/review-plan calibration, not as acceptance of reference-text matching.
- Unknown rate: zero unknown verdicts in the summarized run set.

## Decision

Keep the design-to-plan pointwise lane manual and advisory. The P0 calibration behavior is acceptable: good fixtures covered the intended items, and bad fixtures remained adverse. The expected-bad projection `partial` should continue to be tracked as non-covered evidence rather than a pass.

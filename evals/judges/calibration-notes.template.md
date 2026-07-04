# Model-Judge Calibration Notes

Case: `<case-id>`
Candidate: `<candidate path>`
Deterministic run: `<run-id>`
Pointwise judge run: `<run-id>`
Manual report run: `<run-id>`
Reviewer: `<name or handle>`
Date: `<YYYY-MM-DD>`

## Deterministic Baseline

- Verdict: `<green|yellow|red>`
- Blocking findings: `<none or finding ids>`
- Deterministic result remains authoritative: `<yes>`

## Expected Human Label

- Good candidate expectation: `<critical items covered>`
- Bad candidate expectation: `<intended critical misses, partials, contradictions, or ambiguity>`

## Item Review

| Item ID | Expected human label             | Judge verdict | Disposition            | Notes          |
| ------- | -------------------------------- | ------------- | ---------------------- | -------------- |
| `<id>`  | `<covered/adverse/non-critical>` | `<verdict>`   | `<ok/fp/fn/ambiguous>` | `<short note>` |

## Bias And Failure Modes

- False pass:
- False fail:
- Ambiguity:
- Verbosity bias:
- Reference-wording bias:
- Unknown rate:
- Critical partials:
- Expected-bad pass-like coverage:

## Decision

- Prompt change needed: `<yes/no>`
- Expected item wording change needed: `<yes/no>`
- Keep lane advisory: `yes`
- Raw output reviewed and safe to summarize: `<yes/no>`

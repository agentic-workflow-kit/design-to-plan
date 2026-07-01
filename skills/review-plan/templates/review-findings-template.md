---
title: Review findings — <plan title>
status: draft
plan_reviewed: <plan ID>
---

# Review Findings — <Plan Title>

Reviewed against `docs/design/design-to-plan-contract.md` and the source technical-design handoff
and Product PRD. Findings are proposals for the plan's author to disposition — this document does
not edit the plan.

## Findings

| #   | Checklist item          | Plan section                    | Requirement violated              | Source evidence                            | Finding                       | Suggested correction                      |
| --- | ----------------------- | ------------------------------- | --------------------------------- | ------------------------------------------ | ----------------------------- | ----------------------------------------- |
| 1   | `<checklist item name>` | `<section heading in the plan>` | `<contract requirement or AC ID>` | `<missing / conflicting AC, fact, or row>` | `<what is wrong, concretely>` | `<what would resolve it, if unambiguous>` |

If no findings survive review, state that explicitly instead of leaving an empty table:

> No findings. All Required Output Properties are present and populated, traceability holds for
> every story, and no reconciliation, evidence-binding, predicate-sourcing, sizing,
> scope-discipline, or stop-drift issue was found.

## Disposition Log

Append-only, in the same shape as `docs/design/decisions.md`'s `Suggestion:` convention. The
plan's author records disposition here rather than rewriting a finding above.

- Finding 1 — `<accepted / rejected: reason / deferred: reason>`

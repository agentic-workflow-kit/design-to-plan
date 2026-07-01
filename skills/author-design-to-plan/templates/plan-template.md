---
title: <plan title>
status: draft
---

# <Plan Title>

This plan preserves Jig's `execution-plan-shape-v0` properties. It is not a frozen schema —
field names, nesting, and encoding may be adapted per the design contract's D-002, as long as
every property below is present and populated.

## Plan Identity and Provenance

| Property                          | Value                                                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Plan ID                           | `<stable-plan-id>`                                                                                                          |
| Plan version posture              | `execution-plan-shape-v0`                                                                                                   |
| Producer                          | `<who/what authored this plan>`                                                                                             |
| Track                             | `<track-id>`                                                                                                                |
| Product refs                      | `<Product PRD acceptance-criteria IDs this plan covers>`                                                                    |
| Design refs                       | `<Technical Design handoff fact IDs this plan covers>`                                                                      |
| Product artifact and contract     | `<Product PRD path>`, status `<product-status>`                                                                             |
| Technical Design handoff contract | `<technical-design artifact path>`, `handoff_contract: technical-design-handoff-v0`, `design_status: approved`, round `<N>` |
| Jig execution-plan shape contract | `execution-plan-shape-v0` — `jig/docs/design/contracts/execution-plan-contract-v0.md` or a caller-supplied equivalent       |
| Source artifact refs              | `<repo/path@commit or version for each source artifact above, when available>`                                              |

Jig rejects a plan whose input version or compatibility marker it does not recognize rather than
guessing — this row set is what lets it do that instead of silently accepting a stale or
incompatible plan.

## Track Binding

| Ref type         | Value                                                |
| ---------------- | ---------------------------------------------------- |
| Policy ref       | `<policy identity and version posture>`              |
| Work profile ref | `<work profile identity and version posture>`        |
| Repo floor ref   | `<repo-level policy floor this track cannot weaken>` |

## Story Set

| Story ID    | Title     | Product refs | Design refs  | Scope                              | Produces / preserves                         | Depends on            |
| ----------- | --------- | ------------ | ------------ | ---------------------------------- | -------------------------------------------- | --------------------- |
| `STORY-001` | `<title>` | `<AC-...>`   | `<fact IDs>` | `<files/components/behavior area>` | `<source-backed output, seam, or proof row>` | `<None or story IDs>` |

## Dependency and Eligibility Model

```text
<STORY-A -> STORY-B, or "no dependency" for independent stories>
```

State, for every non-trivial edge, which `SEQ-*` fact or other source-backed upstream reason
requires it. A story is not eligible until its declared prerequisites have landed.

### Whole-Graph Reconciliation

| Consumer story | Consumed item                                     | Source fact                 | Closed by                                        |
| -------------- | ------------------------------------------------- | --------------------------- | ------------------------------------------------ |
| `STORY-002`    | `<shared surface / token / producer-owned input>` | `<SEQ-* / FILE-* / FAIL-*>` | `<producer story id or already-approved source>` |

Every consumed item in the plan resolves to exactly one producer story or already-approved upstream
artifact. Do not leave consumer/source closure implied by prose.

## Done and Evidence Requirements

| Story ID    | Evidence                                                           | Binding                                       | Proves                                                      |
| ----------- | ------------------------------------------------------------------ | --------------------------------------------- | ----------------------------------------------------------- |
| `STORY-001` | `<named command, gate lane, or reviewer check — never prose only>` | `<command / gate / artifact / reviewer step>` | `<Product AC IDs and design fact IDs this evidence proves>` |

### Predicate and Operand Source Closure

| Story ID    | Predicate or condition                                        | Operand sources                                                                   | Design refs                 |
| ----------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------- |
| `STORY-001` | `<condition this plan asks a reviewer or runner to evaluate>` | `<each operand's concrete source; use "n/a" only for genuinely unary predicates>` | `<facts that authorize it>` |

Decompose compound or relational conditions until each evaluated operand is sourced concretely. Do
not cite only an input category such as "the handoff" or "the policy".

## Authority and Approval Needs

| Story ID    | Worker may request     | Runner-owned             | Doorbell / re-approval                                                |
| ----------- | ---------------------- | ------------------------ | --------------------------------------------------------------------- |
| `STORY-001` | `<reversible actions>` | `<push, open PR, merge>` | `<policy, verification, credential, or other rule-governing changes>` |

## Policy and Work-Profile References

Reference policy and work-profile identity and version posture only — never embed a mutable
override that would let this plan weaken its own guardrails.

## Stack-Seam Requirements

| Seam           | Required capability or source    |
| -------------- | -------------------------------- |
| Agent          | `<capability this plan assumes>` |
| Execution Host | `<capability this plan assumes>` |
| Forge          | `<capability this plan assumes>` |
| Work Source    | `<capability this plan assumes>` |

## Constraints and Limits

- `<concurrency/sequencing constraints stricter than the dependency graph>`
- `<retry/budget posture, when supplied by policy>`
- `<isolation requirements>`
- `<branch/merge-queue/review-flow constraints>`
- `<known non-goals and out-of-scope surfaces>`

## Traceability Check

| Jig plan property                  | Product refs | Design refs |
| ---------------------------------- | ------------ | ----------- |
| Plan identity and provenance       |              |             |
| Track binding                      |              |             |
| Story set                          |              |             |
| Dependency and eligibility model   |              |             |
| Done and evidence requirements     |              |             |
| Authority and approval needs       |              |             |
| Policy and work-profile references |              |             |
| Stack-seam requirements            |              |             |
| Constraints and limits             |              |             |

Every row must be populated. A blank row means a Jig property has no traceable source — that is a
stop condition (contract §Refusal and Stop Behavior), not an acceptable gap to leave in an emitted
plan.

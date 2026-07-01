---
title: Minimal design-to-plan fixture
status: illustrative
---

# Minimal Design-to-plan Fixture

This fixture is illustrative. It demonstrates traceability and shape preservation at design altitude;
it is not a frozen JSON Schema, validator fixture, runtime command, or implementation package plan. It
walks the [`flows.md`](../flows.md) stages once against the [contract](../design-to-plan-contract.md).

The plan below predates the `author-design-to-plan`/`review-plan` skills (D-009) and describes a docs-only
authoring story; its Constraints section reflects that specific story's own scope, not a claim that
this repo ships no skill.

## Input Summary

### Product PRD References

| ID           | Product requirement                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| AC-PLAN-001  | Planning output preserves Jig's `execution-plan-shape-v0` properties.                                 |
| AC-TRACE-001 | Every story traces from Product PRD AC IDs through Technical Design fact IDs to Jig plan properties.  |
| AC-DAG-001   | Story dependencies are explicit, including independent and producer-before-consumer work.             |
| AC-EVID-001  | Every story has falsifiable done/evidence requirements tied to the upstream facts they prove.         |
| AC-SCOPE-001 | Planning refuses to invent scope or implementation structure absent from its inputs.                  |
| AC-STOP-001  | Planning stops and names the missing or conflicting source and owner instead of inventing a decision. |

### Technical Design Handoff Facts

| ID       | Category          | Planner-facing fact                                                                                                                                                        |
| -------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SRC-001  | source            | Source Product PRD is `docs/product/design-to-plan.md`; required AC IDs are `AC-PLAN-001`, `AC-TRACE-001`, `AC-DAG-001`, `AC-EVID-001`, `AC-SCOPE-001`, and `AC-STOP-001`. |
| CTX-001  | boundary          | Planning consumes Product and Technical Design contracts and produces to Jig's plan shape; it owns no upstream decisions.                                                  |
| DEL-001  | delivery planning | Create a contract story that maps accepted inputs to Jig plan properties.                                                                                                  |
| DEL-002  | delivery planning | Create an example-fixture story that proves traceability from AC IDs to design facts to Jig properties.                                                                    |
| SEQ-001  | sequencing        | The contract story must land before the fixture story because the fixture cites the contract's required mappings.                                                          |
| FILE-001 | shared surface    | The fixture consumes the contract doc as a reviewed upstream source; it must name that dependency explicitly rather than implying it in prose.                             |
| VAL-001  | validation        | Evidence is the repo gate `pnpm check` and reviewer inspection of the traceability, reconciliation, and operand-source tables.                                             |
| STOP-001 | stop condition    | Stop if any Product AC ID or required handoff fact is missing, blank, TBD, or only implied by prose.                                                                       |
| STOP-002 | stop condition    | Stop if the fixture names a dependency, consumed source, or review predicate with no cited producer/source row.                                                            |

## Illustrative Plan Shape

### Plan Identity and Provenance

| Property             | Value                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Plan ID              | `plan-design-to-plan-m4-docs`                                                             |
| Plan version posture | `execution-plan-shape-v0`                                                                 |
| Producer             | `design-to-plan` planning contract fixture                                                |
| Track                | `m4-planning-layer-seed`                                                                  |
| Product refs         | `AC-PLAN-001`, `AC-TRACE-001`, `AC-DAG-001`, `AC-EVID-001`, `AC-SCOPE-001`, `AC-STOP-001` |
| Design refs          | `CTX-001`, `DEL-001`, `DEL-002`, `SEQ-001`, `FILE-001`, `VAL-001`, `STOP-001`, `STOP-002` |

### Track Binding

| Ref type         | Value                                   |
| ---------------- | --------------------------------------- |
| Policy ref       | `policy:docs-only-m4-review`            |
| Work profile ref | `work-profile:docs-contract-author`     |
| Repo floor ref   | `repo-policy:design-to-plan-main-floor` |

### Story Set

| Story ID  | Title                          | Product refs                                                 | Design refs                                             | Scope                                            | Produces / preserves                                      | Depends on  |
| --------- | ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------- | ----------- |
| STORY-001 | Define design-to-plan contract | `AC-PLAN-001`, `AC-TRACE-001`, `AC-SCOPE-001`, `AC-STOP-001` | `CTX-001`, `DEL-001`, `STOP-001`                        | `docs/design/design-to-plan-contract.md`         | Required plan-property mappings and stop rules            | None        |
| STORY-002 | Add traceability fixture       | `AC-DAG-001`, `AC-EVID-001`, `AC-TRACE-001`, `AC-STOP-001`   | `DEL-002`, `SEQ-001`, `FILE-001`, `VAL-001`, `STOP-002` | `docs/design/examples/minimal-design-to-plan.md` | An emitted-plan example with explicit source-closure rows | `STORY-001` |

### Dependency and Eligibility Model

```text
STORY-001 -> STORY-002
```

`STORY-002` is not eligible until `STORY-001` lands because the fixture cites the contract's mapping
rules. No hidden independent story is present in this minimal fixture.

### Whole-Graph Reconciliation

| Consumer story | Consumed item                                               | Source fact | Closed by   |
| -------------- | ----------------------------------------------------------- | ----------- | ----------- |
| `STORY-002`    | Contract property mappings used by the fixture              | `SEQ-001`   | `STORY-001` |
| `STORY-002`    | `docs/design/design-to-plan-contract.md` as reviewed source | `FILE-001`  | `STORY-001` |

### Done and Evidence Requirements

| Story ID  | Evidence                                                                                                                        | Binding                  | Proves                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| STORY-001 | Reviewer confirms accepted inputs, required outputs, and refusal behavior are named.                                            | Contract review          | `AC-SCOPE-001`, `AC-STOP-001`; `CTX-001`; `STOP-001`; Jig plan identity, story set, authority, policy, stack-seam, and constraint properties.  |
| STORY-002 | Reviewer confirms the tables map Product AC IDs to Technical Design fact IDs to Jig properties and close every consumed source. | Fixture review checklist | `AC-TRACE-001`, `AC-DAG-001`, `AC-STOP-001`; `DEL-002`; `SEQ-001`; `FILE-001`; Jig provenance, story set, dependency graph, and stop behavior. |
| STORY-002 | The repo gate `pnpm check` passes.                                                                                              | `pnpm check`             | `AC-EVID-001`; `VAL-001`; expected automated-check evidence category.                                                                          |

### Predicate and Operand Source Closure

| Story ID  | Predicate or condition                                                        | Operand sources                                                                                                   | Design refs            |
| --------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------- |
| STORY-002 | Fixture Product refs stay within the approved AC set                          | left: fixture `Product refs`; right: `SRC-001` required AC-ID set                                                 | `SRC-001`, `DEL-002`   |
| STORY-002 | Fixture may emit only if every consumed source row names a source closure row | left: fixture Whole-Graph Reconciliation table; right: each row's cited producer plus `STOP-002` stop requirement | `FILE-001`, `STOP-002` |

### Authority and Approval Needs

| Story ID  | Worker may request                   | Runner-owned         | Doorbell / re-approval                                                                   |
| --------- | ------------------------------------ | -------------------- | ---------------------------------------------------------------------------------------- |
| STORY-001 | read docs, edit Markdown, run checks | push, open PR, merge | policy changes, schema claims, runtime additions                                         |
| STORY-002 | read docs, edit Markdown, run checks | push, open PR, merge | missing Product AC IDs, missing design facts, unsourced operands, or unprovable evidence |

### Stack-Seam Requirements

| Seam           | Required capability or source                                   |
| -------------- | --------------------------------------------------------------- |
| Agent          | Can preserve citations and stop on missing source facts.        |
| Execution Host | Can run the repo gate `pnpm check`.                             |
| Forge          | Can expose PR review and check status.                          |
| Work Source    | Product PRD and approved Technical Design handoff are readable. |

### Constraints and Limits

- Docs-only changes for this story (it authors the contract and fixture, not a skill — skills
  landed in a later story; see the predates-D-009 note above).
- No schema, validator, CLI, runtime package, `src/`, eval harness, or implementation package
  decomposition.
- Stop rather than invent Product AC IDs, design fact IDs, producer/source closure, policy
  semantics, or Jig runtime behavior.

## Traceability Check Against Jig v0 Shape

| Jig plan property                  | Product refs                  | Design refs            |
| ---------------------------------- | ----------------------------- | ---------------------- |
| Plan identity and provenance       | `AC-PLAN-001`, `AC-TRACE-001` | `SRC-001`, `CTX-001`   |
| Track binding                      | `AC-SCOPE-001`                | `CTX-001`              |
| Story set                          | `AC-TRACE-001`                | `DEL-001`, `DEL-002`   |
| Dependency and eligibility model   | `AC-DAG-001`                  | `SEQ-001`, `FILE-001`  |
| Done and evidence requirements     | `AC-EVID-001`                 | `VAL-001`              |
| Authority and approval needs       | `AC-SCOPE-001`, `AC-STOP-001` | `STOP-001`             |
| Policy and work-profile references | `AC-SCOPE-001`                | `CTX-001`              |
| Stack-seam requirements            | `AC-SCOPE-001`                | `CTX-001`, `STOP-001`  |
| Constraints and limits             | `AC-SCOPE-001`, `AC-STOP-001` | `STOP-001`, `STOP-002` |

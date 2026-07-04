# Execution Plan: Projection Graph Evidence

## Plan Identity and Provenance

| Property        | Value                                                                                                                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Plan ID         | plan-projection-graph-evidence-v1                                                                                                                                                                                        |
| Version posture | execution-plan-shape-v0                                                                                                                                                                                                  |
| Sources         | source-product.md AC-PLAN-001 AC-DAG-001 AC-EVID-001 AC-TRACE-001 AC-SCOPE-001 AC-STOP-001; source-handoff.md SRC-001 CTX-001 DEL-001 DEL-002 DEL-003 SEQ-001 SEQ-002 FILE-001 FAIL-001 VAL-001 VAL-002 VAL-003 STOP-001 |
| Track binding   | track: semantic-eval-suite; policy: deterministic-local; work-profile: planning-fixture-author                                                                                                                           |

## Story Set

| Story ID     | Intent                                                                  | Product refs                        | Design refs                               | Jig properties                                                              |
| ------------ | ----------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------- |
| STORY-INTAKE | Preserve accepted inputs and provenance without adding scope.           | AC-PLAN-001 AC-TRACE-001            | CTX-001 DEL-001 VAL-001                   | Plan identity and provenance; Track binding                                 |
| STORY-GRAPH  | Build ordered graph and evidence rows from approved facts.              | AC-DAG-001 AC-EVID-001 AC-TRACE-001 | DEL-002 SEQ-001 FILE-001 VAL-002          | Story set; Dependency and eligibility model; Done and evidence requirements |
| STORY-STOP   | Preserve refusal behavior for unsourced graph, evidence, or scope gaps. | AC-SCOPE-001 AC-STOP-001            | DEL-003 SEQ-002 FAIL-001 VAL-003 STOP-001 | Authority and approval needs; Constraints and limits                        |

## Dependency and Eligibility Model

| From         | To          | Source refs | Eligibility                                       |
| ------------ | ----------- | ----------- | ------------------------------------------------- |
| STORY-INTAKE | STORY-GRAPH | SEQ-001     | STORY-GRAPH waits for accepted input provenance.  |
| STORY-GRAPH  | STORY-STOP  | SEQ-002     | STORY-STOP waits for graph-defect handling facts. |

## Whole-Graph Reconciliation

| Consumer    | Consumed                      | Source refs | Closed by    |
| ----------- | ----------------------------- | ----------- | ------------ |
| STORY-GRAPH | planner handoff summary table | FILE-001    | STORY-INTAKE |
| STORY-STOP  | graph-defect token            | FAIL-001    | STORY-GRAPH  |

## Done and Evidence Requirements

| Story ID     | Concrete evidence                                                       | Proves product refs                 | Proves design refs |
| ------------ | ----------------------------------------------------------------------- | ----------------------------------- | ------------------ |
| STORY-INTAKE | pnpm eval:validate-fixtures and reviewer inspection of provenance rows  | AC-PLAN-001 AC-TRACE-001            | VAL-001            |
| STORY-GRAPH  | pnpm eval:case with preserved evals/results/<run-id>/report.md artifact | AC-DAG-001 AC-EVID-001 AC-TRACE-001 | VAL-002            |
| STORY-STOP   | review-plan checklist against stop-condition drift                      | AC-SCOPE-001 AC-STOP-001            | VAL-003 STOP-001   |

## Projection Boundary

This plan projects only the Product PRD and approved handoff facts listed above. It does not define
worker permissions, runner approval rules, package layout, model routing, runtime behavior, policy
changes, publication behavior, or Jig field-level schema.

## Authority and Approval Needs

Not specified by the Product PRD or approved handoff beyond the source policy refs below. Authority,
approval, push, merge, publication, model-call, and policy-change rules remain out of scope for this
projection.

## Source Policy References

Policy ref is deterministic-local. Work profile is planning-fixture-author. The plan preserves those
refs without embedding mutable policy semantics.

## Stack-Seam Requirements

Not specified by the Product PRD or approved handoff. Agent, Execution Host, Forge, Work Source,
runtime responsibilities, and Jig schema responsibilities remain out of scope for this projection.

## Constraints and Limits

Projection-only: do not invent Product AC IDs, handoff facts, package layout, model routing,
execution-host behavior, or Jig field-level detail. Stop if Product AC IDs, handoff fact IDs, graph
closure, or concrete evidence cannot be sourced from STOP-001.

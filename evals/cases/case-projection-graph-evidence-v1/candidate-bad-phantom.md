# Execution Plan: Bad Projection Graph

## Plan Identity and Provenance

Plan ID: plan-bad-projection-graph-v1. It claims execution-plan-shape-v0.

## Story Set

| Story ID     | Intent                                           | Product refs | Design refs | Jig properties               |
| ------------ | ------------------------------------------------ | ------------ | ----------- | ---------------------------- |
| STORY-INTAKE | Read the inputs.                                 | AC-PLAN-001  | DEL-001     | Plan identity and provenance |
| STORY-GRAPH  | Implement graph code and runtime package layout. | AC-DAG-001   | DEL-002     | Story set                    |
| STORY-STOP   | Handle errors later.                             | AC-STOP-001  | STOP-001    | Constraints and limits       |

## Dependency and Eligibility Model

STORY-GRAPH waits on STORY-UNKNOWN because that seems safest.

## Whole-Graph Reconciliation

STORY-GRAPH consumes the planner handoff summary table, but the plan does not name a producer.
STORY-STOP consumes a graph-defect token with no closed-by story.

## Done and Evidence Requirements

Tests exist. The planner works correctly.

## Implementation Package

Add a runtime package and JSON Schema under packages/plan-schema so Jig can validate this plan.

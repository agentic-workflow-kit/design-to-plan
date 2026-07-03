# Defective Emitted Plan Fixture

This is the bad plan that `review-plan` should reject.

## Story Set

| Story ID       | Intent                                          | Product refs | Design refs |
| -------------- | ----------------------------------------------- | ------------ | ----------- |
| STORY-CONSUME  | Consume FILE-SEARCH-API and wire the result.    | AC-DAG-001   | FILE-001    |
| STORY-ORDER    | Run after STORY-CONSUME because it feels safer. | AC-DAG-001   | DEL-002     |
| STORY-EVIDENCE | Prove it works.                                 | AC-EVID-001  | VAL-001     |
| STORY-SCHEMA   | Publish a field-level Jig validator.            | AC-SCOPE-001 | DEL-002     |

## Dependency and Eligibility Model

STORY-ORDER depends on STORY-CONSUME, but no `SEQ-*` fact authorizes that edge.

## Whole-Graph Reconciliation

STORY-CONSUME consumes FILE-SEARCH-API. No story or upstream artifact produces FILE-SEARCH-API.

## Done and Evidence Requirements

Evidence: tests exist and it works correctly.

Done condition: runtime cost is within budget.

## Implementation Details

Add `packages/plan-schema/src/index.ts` with a JSON Schema and TypeScript interface for Jig plans.

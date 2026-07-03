---
design_id: fixture-projection-graph-evidence
handoff_contract: technical-design-handoff-v0
design_status: approved
round: 1
---

# Planner Handoff Summary

| ID       | Category       | Planner-facing fact                                                                                    |
| -------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| SRC-001  | source         | Product ACs are AC-PLAN-001, AC-DAG-001, AC-EVID-001, AC-TRACE-001, AC-SCOPE-001, and AC-STOP-001.     |
| CTX-001  | boundary       | Planning projects approved sources into Jig plan properties and owns no runtime, schema, or policy.    |
| DEL-001  | delivery       | Create an intake/provenance story that preserves accepted-input and plan-identity facts.               |
| DEL-002  | delivery       | Create a graph/evidence story that preserves dependencies, source closure, and validation facts.       |
| DEL-003  | delivery       | Create a stop-policy story that preserves source-attributed refusal behavior and constraints.          |
| SEQ-001  | sequencing     | The intake/provenance story must land before graph/evidence because graph checks cite accepted inputs. |
| SEQ-002  | sequencing     | The graph/evidence story must land before stop-policy because stop-policy consumes graph defects.      |
| FILE-001 | shared surface | The graph/evidence story consumes the planner handoff summary table produced by intake/provenance.     |
| FAIL-001 | failure token  | The stop-policy story consumes the graph-defect token emitted by graph/evidence reconciliation.        |
| VAL-001  | validation     | Intake evidence is `pnpm eval:validate-fixtures` plus reviewer inspection of provenance rows.          |
| VAL-002  | validation     | Graph evidence is `pnpm eval:case` plus the preserved `evals/results/<run-id>/report.md` artifact.     |
| VAL-003  | validation     | Stop-policy evidence is the `review-plan` checklist against stop-condition drift.                      |
| STOP-001 | stop condition | Stop if Product AC IDs, handoff fact IDs, graph closure, or concrete evidence cannot be sourced.       |

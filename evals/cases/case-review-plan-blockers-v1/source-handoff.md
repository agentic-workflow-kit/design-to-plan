---
design_id: fixture-review-plan-blockers
handoff_contract: technical-design-handoff-v0
design_status: approved
round: 1
---

# Planner Handoff Summary

| ID       | Category       | Planner-facing fact                                                                     |
| -------- | -------------- | --------------------------------------------------------------------------------------- |
| SRC-001  | source         | Product ACs are AC-DAG-001, AC-EVID-001, AC-SCOPE-001, AC-STOP-001, and AC-TRACE-001.   |
| DEL-001  | delivery       | Create a source story that produces the approved API docs artifact.                     |
| DEL-002  | delivery       | Create a consumer story only after the source story produces that artifact.             |
| SEQ-001  | sequencing     | Source story must precede consumer story.                                               |
| FILE-001 | shared surface | Consumer story consumes approved API docs artifact from source story.                   |
| VAL-001  | validation     | Evidence is the named gate `pnpm check`.                                                |
| STOP-001 | stop condition | Stop on phantom consumers, unsupported edges, prose-only evidence, or unsourced values. |

---
design_id: fixture-missing-product-source
handoff_contract: technical-design-handoff-v0
design_status: approved
round: 1
---

# Planner Handoff Summary

| ID       | Category       | Planner-facing fact                                                                              |
| -------- | -------------- | ------------------------------------------------------------------------------------------------ |
| SRC-001  | source         | Required Product AC is `AC-BILLING-777`, but that AC is absent from the supplied Product source. |
| DEL-001  | delivery       | Create a billing reconciliation story only if `AC-BILLING-777` resolves.                         |
| STOP-001 | stop condition | Stop if a Product AC referenced by SRC-001 is missing or unstable.                               |

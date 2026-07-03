# Stop Result: Missing Technical Design Source

Planning stops with no plan emitted.

| Field               | Value                                                                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Failing check class | input validity                                                                                                                                        |
| Missing source IDs  | Planner Handoff Summary; `DEL-*`; `VAL-*`; `STOP-*`                                                                                                   |
| Owner               | Technical Design owner                                                                                                                                |
| Reason              | The Planner Handoff Summary is TBD, so there are no stable `DEL-*`, `VAL-*`, or `STOP-*` fact rows to project into stories, evidence, or constraints. |
| Repair              | Technical Design owner must supply a complete approved `technical-design-handoff-v0` Planner Handoff Summary before Planning can emit a plan.         |

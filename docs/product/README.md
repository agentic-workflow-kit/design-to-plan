---
title: design-to-plan — product
status: draft
---

# design-to-plan — product

Product owns **what & why**: audience, problem, promise, boundaries, and when to use / when not to.
It is the contract the design layer reconciles to and is readable without code. For _how_ the
transformation works, see [`docs/design/`](../design/).

## Pages

| Page                                     | What it covers                                                                                                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [design-to-plan.md](./design-to-plan.md) | **Canonical hub and PRD** — audience, job, where it sits, what it does, when to use / when not to, the ID-bearing acceptance criteria, and open questions. Start here. |

## Where design-to-plan sits in the suite

`agentic-workflow-kit` is a family of standalone, composable products across an agentic
software-development lifecycle:

```text
PRODUCT ---------> DESIGN ----------> PLANNING --------> DELIVERY --------> LEARNING
define / PRD       technical-design   design-to-plan     jig (run)          feedback loop
```

design-to-plan is the **Planning layer**: it turns an approved technical-design handoff into a
Jig-ready execution plan. It **owns no new cross-repo seam** — it consumes the Product PRD /
acceptance-criteria IDs and the `technical-design-handoff-v0` handoff, and produces to Jig's
`execution-plan-shape-v0`. Suite-level framing lives at the
[organization profile](https://github.com/agentic-workflow-kit), not here; this repo stays scoped to
its own concern.

---
title: design-to-plan — product
status: draft
---

# design-to-plan — product

design-to-plan turns an approved technical design into a reviewable, execution-ready plan. It works
**on its own** — you supply the design and acceptance criteria and consume the plan — and as the
**Planning layer of the [agentic-workflow-kit](https://github.com/agentic-workflow-kit) suite**,
where the other tools produce and consume its contracts for you.

Product owns **what & why**: audience, problem, promise, boundaries, and when to use / when not to.
It is the contract the design layer reconciles to and is readable without code. For _how_ the
transformation works, see [`docs/design/`](../design/).

## Pages

| Page                                     | What it covers                                                                                                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [design-to-plan.md](./design-to-plan.md) | **Canonical hub and PRD** — audience, job, where it sits, what it does, when to use / when not to, the ID-bearing acceptance criteria, and open questions. Start here. |

## Where design-to-plan fits — standalone and in the suite

design-to-plan is a **standalone planning step** that also composes with `agentic-workflow-kit`, a
family of standalone, composable products across an agentic software-development lifecycle:

```text
PRODUCT ---------> DESIGN ----------> PLANNING --------> DELIVERY --------> LEARNING
define / PRD       technical-design   design-to-plan     jig (run)          feedback loop
```

As the **Planning layer**, it turns an approved technical-design handoff into an execution-ready
plan. It **owns no new cross-repo seam** — it consumes the Product PRD / acceptance-criteria IDs and
the `technical-design-handoff-v0` handoff, and produces a plan in the `execution-plan-shape-v0` shape.
In the suite those contracts are produced and consumed by `define-product`, `technical-design`, and
`jig`; on its own you supply and consume them yourself. Suite-level framing lives at the
[organization profile](https://github.com/agentic-workflow-kit), not here; this repo stays scoped to
its own concern.

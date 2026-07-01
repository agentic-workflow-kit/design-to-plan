---
title: design-to-plan — product
status: v0
---

# design-to-plan — product

design-to-plan turns an **approved technical design** into a **reviewable, execution-ready plan** —
a set of stories where every unit of work traces back to why it exists, what makes it eligible to
start, and what evidence proves it done, settled and reviewable _before_ any execution begins.

It is built to work **two ways**, and neither depends on the other:

- **On its own** — point it at your own approved design and acceptance criteria and get a plan you
  can review and hand to any executor. You supply the inputs; you consume the plan.
- **As the Planning layer of the [agentic-workflow-kit](https://github.com/agentic-workflow-kit)
  suite** — composing with `define-product` and `technical-design` upstream and `jig` downstream,
  which produce and consume its contracts for you. In the suite those layers are strong defaults,
  not prerequisites.

This page is the product layer — _who it serves, what job it does, what it promises, and where its
boundaries are_ — and is also the **Design-to-plan PRD**: the overview above and the ID-bearing
[Acceptance Criteria](#acceptance-criteria) below are one document. Product owns _what and why_;
[`docs/design/`](../design/) owns _how_ those promises are met. Where they conflict, name it rather
than silently resolving.

## Product Spine

| Question            | Product answer                                                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User                | A repo owner or planning reviewer who has an approved technical design and needs a reviewable, execution-ready plan — standalone, or for Jig in the suite.                        |
| Job                 | Turn an approved design into a reviewable, execution-ready plan — usable on its own or by Jig — without re-deciding product, design, or implementation scope.                     |
| Current alternative | Hand-decomposing the design into stories by eye — hidden dependencies, plans that do not map to the execution-plan shape, and no line back to why each story exists.              |
| Before              | The reviewer cannot tell which upstream fact justifies a story, what makes it eligible, what evidence proves it done, or where the planner guessed.                               |
| After               | The reviewer sees a plan whose every story traces from a Product acceptance criterion through a design fact to an execution-plan property — reviewable before any execution runs. |
| Non-fit             | design-to-plan is not a runtime, CLI, validator, schema, or skill; it does not own Jig policy or re-decide product and design scope.                                              |

## Product Outcome

Design-to-plan enables an approved technical design to become a reviewable, execution-ready plan
without re-deciding product scope, technical design scope, or implementation package structure. The
plan is reviewable before execution begins — used on its own or by Jig in the suite: stories,
dependencies, evidence, constraints, and stop conditions are traceable to Product acceptance-criteria
IDs and Technical Design handoff fact IDs.

## User Job

A repo owner or planning reviewer has an approved design and needs a high-quality, execution-ready
plan — usable on its own or by Jig in the suite. They need to see what work will happen, why each
story exists, which upstream facts justify it, what dependencies make it eligible, and what evidence
will prove completion. They also need the planner to stop when the inputs are incomplete rather than
inventing missing product or design decisions.

## Where It Fits — On Its Own And In The Suite

design-to-plan is a standalone planning step. It also slots into `agentic-workflow-kit`, a family of
standalone, composable products across an agentic software-development lifecycle, where Planning is
the layer between an approved design and execution:

```text
PRODUCT ---------> DESIGN ----------> PLANNING --------> DELIVERY --------> LEARNING
define / PRD       technical-design   design-to-plan     jig (run)          feedback loop
```

Planning **owns no new cross-repo seam**. It consumes two input contracts and produces one output
contract. In the suite these are produced and consumed for you; on its own you supply the inputs in
these shapes and consume the plan yourself:

| Direction | Contract                                      | Owner              |
| --------- | --------------------------------------------- | ------------------ |
| Input     | Product PRD and acceptance-criteria IDs       | `define-product`   |
| Input     | `technical-design-handoff-v0` planner handoff | `technical-design` |
| Output    | `execution-plan-shape-v0` plan properties     | `jig`              |

The suite tools that own these contracts are **strong defaults, not prerequisites** — they automate
the ends design-to-plan does not own. Either way, Planning's hard input boundary is an approved
design handoff with stable fact IDs, and its output is a plan in the execution-plan shape, which
Planning must preserve but must not freeze into a field-level schema.

## What It Does

At product altitude, design-to-plan takes a **planning-ready input set** — a Product PRD with stable
acceptance-criteria IDs, an approved technical design carrying a complete Planner Handoff Summary with
stable fact IDs, Jig's current plan shape, and the track's policy and work-profile references — and
produces a **reviewable execution plan**: plan identity and provenance, track binding, a story set,
the dependency graph, done/evidence requirements, authority expectations, policy references,
stack-seam requirements, and constraints.

Every story earns its place through one traceability chain, so a reviewer never has to infer hidden
scope:

```text
Product PRD AC ID -> Technical Design handoff fact ID -> Jig plan property
```

When the inputs cannot support that chain — missing acceptance-criteria IDs, a blank handoff summary,
hidden or contradictory dependencies, unprovable evidence — Planning **stops and names the missing or
conflicting source and its owner**, rather than inventing the decision. The design layer specifies the
accepted inputs, required output properties, and stop behavior in the
[design-to-plan contract](../design/design-to-plan-contract.md).

## Acceptance Criteria

| ID           | Criterion                                                                                                                                                                                                                                                         | Status |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| AC-PLAN-001  | The planner output preserves Jig's `execution-plan-shape-v0` properties: plan identity/provenance, track binding, story set, dependency graph, evidence needs, authority expectations, policy/work-profile refs, stack-seam requirements, and constraints/limits. | Active |
| AC-DAG-001   | The planner output represents story dependencies explicitly, including independent stories and producer-before-consumer constraints, so hidden dependencies are review-blocking.                                                                                  | Active |
| AC-EVID-001  | Every story has falsifiable done/evidence requirements that cite the product and technical-design facts they prove.                                                                                                                                               | Active |
| AC-TRACE-001 | Every story traces from one or more Product PRD acceptance-criteria IDs through one or more Technical Design handoff fact IDs to one or more Jig plan properties.                                                                                                 | Active |
| AC-SCOPE-001 | The planner refuses to invent product acceptance criteria, technical-design facts, implementation package layout, policy semantics, or execution-host behavior not present in its inputs.                                                                         | Active |
| AC-STOP-001  | When required inputs are missing, unstable, contradictory, or would force invented scope, the planner stops instead of producing or revising a plan and names the missing or conflicting source ID and the owner responsible for resolving it.                    | Active |

## When To Use It

- You have an **approved technical design** with a complete Planner Handoff Summary and stable fact
  IDs, and you need the execution-ready plan that turns it into runnable work.
- You want story dependencies, evidence requirements, and stop conditions made **explicit and
  reviewable** before any execution starts.
- You want every story to **trace back** to the product outcome and design fact that justify it.
- You want the planner to **refuse and name what is missing** rather than guess when inputs are
  incomplete.

## When Not To Use It

- You do not yet have an approved design and acceptance criteria to plan from — produce those first.
  The suite's `define-product` and `technical-design` are the default path, but any equivalent
  artifacts in the expected shapes work; Planning has nothing valid to consume without them.
- You want a runtime, CLI, validator, schema package, or skill — this seed is a docs-level contract
  and ships none of those.
- You want to change Jig policy semantics, work-profile realization, or execution-host behavior, or to
  re-decide product or design scope — those are owned upstream and downstream, not here.

## Constraints

- Planning consumes, but does not own, the Product PRD/acceptance-criteria contract from
  `define-product/docs/product/prd-contract.md`.
- Planning consumes, but does not own, the Technical Design handoff contract identified as
  `technical-design-handoff-v0`.
- Planning produces to Jig's `execution-plan-shape-v0` contract shape from
  `jig/docs/design/execution-plan-contract-v0.md`.
- Jig's v0 plan contract is not a frozen JSON Schema. This repo must not publish a schema,
  validator, runtime package, CLI, or TypeScript interface for it in this seed.
- The legacy `workflow-kit` design-to-plan material is prior art only. It is not an authority and
  must not be ported wholesale.

## Assumptions

- Approved technical designs will include a valid `Planner Handoff Summary` with stable fact IDs.
- Product artifacts will expose stable PRD acceptance-criteria IDs when Planning needs product
  traceability.
- Jig will continue to refine exact field names and validation details behind its v0 plan shape.
- A docs-only contract seed is enough to unblock M5 Jig local MVP planning without freezing
  implementation behavior.

## Non-Goals

- Designing or implementing a Planning runtime, CLI, skill, eval harness, validator, schema package,
  or prompt system.
- Deciding Jig policy semantics, work-profile realization, model routing, execution-host behavior, or
  merge mechanics.
- Inventing Product acceptance criteria or Technical Design handoff facts when upstream artifacts are
  missing or blank.
- Choosing implementation package layout, story decomposition internals, or code ownership for a
  future runtime.

## Success And Counter-Signals

**Success looks like:**

- A reviewer can explain, from the plan alone, why each story exists, what makes it eligible, and what
  evidence will prove it done.
- Plans map cleanly onto the execution-plan shape, so execution starts without re-litigating scope.
- The planner stops on incomplete inputs and names the owner who must resolve the gap.

**Counter-signals look like:**

- Stories appear with no traceable product or design justification.
- Hidden or contradictory dependencies surface only once Jig is running.
- The planner invents missing product scope, design facts, or implementation structure to fill a gap.
- This seed grows a schema, validator, or runtime that freezes Jig's field-level plan shape.

## Open Questions

- How much of Planning eventually becomes a skill or runtime, and how much stays a docs-level contract
  the owner applies by hand.
- How Planning tracks Jig's `execution-plan-shape-v0` as it evolves, without freezing field-level
  detail from this seed.
- Whether the traceability format (`AC ID -> fact ID -> Jig property`) should harden into a checkable
  artifact later, and which layer would own that check.

## Downstream Citation Map

Technical Design and Jig may cite:

- this PRD title and path;
- the Product Outcome and User Job summaries;
- acceptance-criteria IDs `AC-PLAN-001`, `AC-DAG-001`, `AC-EVID-001`, `AC-TRACE-001`,
  `AC-SCOPE-001`, and `AC-STOP-001`;
- the constraints, assumptions, and non-goals above.

Downstream artifacts must not treat this PRD as a runtime contract, field-level plan schema, or
authority to bypass Product, Technical Design, or Jig-owned seams.

---
title: Design-to-plan PRD
status: v0
---

# Design-to-plan PRD

## Product Outcome

Design-to-plan enables an approved technical design to become a Jig-ready execution plan without
re-deciding product scope, technical design scope, or implementation package structure. The output is
reviewable before Jig runs: stories, dependencies, evidence, constraints, and stop conditions are
traceable to Product acceptance-criteria IDs and Technical Design handoff fact IDs.

## User Job

A repo owner or planning reviewer has an approved design and needs a high-quality execution plan for
Jig. They need to see what work will happen, why each story exists, which upstream facts justify it,
what dependencies make it eligible, and what evidence will prove completion. They also need the
planner to stop when the inputs are incomplete rather than inventing missing product or design
decisions.

## Acceptance Criteria

| ID           | Criterion                                                                                                                                                                                                                                                         | Status |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| AC-PLAN-001  | The planner output preserves Jig's `execution-plan-shape-v0` properties: plan identity/provenance, track binding, story set, dependency graph, evidence needs, authority expectations, policy/work-profile refs, stack-seam requirements, and constraints/limits. | Active |
| AC-DAG-001   | The planner output represents story dependencies explicitly, including independent stories and producer-before-consumer constraints, so hidden dependencies are review-blocking.                                                                                  | Active |
| AC-EVID-001  | Every story has falsifiable done/evidence requirements that cite the product and technical-design facts they prove.                                                                                                                                               | Active |
| AC-TRACE-001 | Every story traces from one or more Product PRD acceptance-criteria IDs through one or more Technical Design handoff fact IDs to one or more Jig plan properties.                                                                                                 | Active |
| AC-SCOPE-001 | The planner refuses to invent product acceptance criteria, technical-design facts, implementation package layout, policy semantics, or execution-host behavior not present in its inputs.                                                                         | Active |

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

## Downstream Citation Map

Technical Design and Jig may cite:

- this PRD title and path;
- the Product Outcome and User Job summaries;
- acceptance-criteria IDs `AC-PLAN-001`, `AC-DAG-001`, `AC-EVID-001`, `AC-TRACE-001`, and
  `AC-SCOPE-001`;
- the constraints, assumptions, and non-goals above.

Downstream artifacts must not treat this PRD as a runtime contract, field-level plan schema, or
authority to bypass Product, Technical Design, or Jig-owned seams.

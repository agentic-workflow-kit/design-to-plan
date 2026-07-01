---
title: design-to-plan — design
status: v0
---

# design-to-plan — design

Design owns **how**: the transformation contract, its lifecycle, the decisions that shaped it, and an
illustrative fixture. It implements and verifies the product promises in
[`../product/`](../product/) and reconciles to them — where design and product intent conflict, name
the conflict and resolve it deliberately, not by silent churn.

Altitude and boundary: this design layer is a contract, its lifecycle, and its decisions — not a
frozen schema. The transformation it specifies is implemented as the
[`skills/author-design-to-plan/`](../../skills/author-design-to-plan/) and
[`skills/review-plan/`](../../skills/review-plan/) skills ([`decisions.md`](./decisions.md), D-009,
superseding D-001's "no skill" clause). There is still intentionally no schema, validator, CLI,
runtime package, or eval harness here (D-002, D-006).

## Contract

- [`design-to-plan-contract.md`](./design-to-plan-contract.md) — the Planning-layer transformation
  contract: accepted inputs, required output properties (Jig's `execution-plan-shape-v0`), the
  traceability rule, refusal and stop behavior, the review checklist, and verified Product
  reconciliation. **Start here.**

## Lifecycle

- [`flows.md`](./flows.md) — the staged transformation (ingest -> validate handoff -> decompose ->
  dependency graph -> done/evidence -> traceability check -> stop-or-emit), with an inline diagram and
  the standalone-vs-suite seam split.

## Decisions

- [`decisions.md`](./decisions.md) — append-only design decisions, each with rationale and the Product
  source that drives it.

## Example

- [`examples/minimal-design-to-plan.md`](./examples/minimal-design-to-plan.md) — an illustrative
  fixture that proves traceability and shape preservation end to end. Not a schema, validator, or
  runtime plan.

## Skills

- [`../../skills/author-design-to-plan/`](../../skills/author-design-to-plan/) — implements the contract's seven
  stages end to end: ingest, validate the handoff, decompose, build the dependency graph, attach
  evidence, run the traceability check, stop or emit.
- [`../../skills/review-plan/`](../../skills/review-plan/) — independently reviews a plan already
  produced by `author-design-to-plan` (or an equivalent artifact) against this contract's Review Checklist.

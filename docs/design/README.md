---
title: design-to-plan — design
status: v0
---

# design-to-plan — design

Design owns **how**: the transformation contract, its lifecycle, the decisions that shaped it, and an
illustrative fixture. It implements and verifies the product promises in
[`../product/`](../product/) and reconciles to them — where design and product intent conflict, name
the conflict and resolve it deliberately, not by silent churn.

Altitude and boundary: this is a **docs-only contract seed**. There is intentionally no runtime,
schema, validator, CLI, or skill here ([`decisions.md`](./decisions.md), D-001).

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

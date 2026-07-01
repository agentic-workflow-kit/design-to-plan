---
title: Design-to-plan contract
status: v0
---

# Design-to-plan Contract

This contract defines the Planning-layer transformation from an approved technical-design handoff to
an execution-ready plan. It is a docs-level contract, not a runtime implementation, schema
validator, CLI, prompt, package layout, or TypeScript interface.

The lifecycle view of this transformation is [`flows.md`](flows.md); the design decisions behind it,
each with its Product source, are in [`decisions.md`](decisions.md).

## Contract Posture

Planning owns no new cross-repo seam. It consumes existing contracts and produces to Jig's current
v0 execution-plan shape:

| Direction | Contract                                      | Owner              |
| --------- | --------------------------------------------- | ------------------ |
| Input     | Product PRD and acceptance-criteria IDs       | `define-product`   |
| Input     | `technical-design-handoff-v0` planner handoff | `technical-design` |
| Output    | `execution-plan-shape-v0` plan properties     | `jig`              |

Jig's execution-plan contract is a v0 shape, not a frozen JSON Schema. Planning must preserve the
required properties Jig names, but must not freeze exact field names, nesting, enums, validation
language, or storage encoding from this seed.

These contracts resolve to the Product PRD at [`../product/design-to-plan.md`](../product/design-to-plan.md),
the Technical Design handoff at `technical-design/docs/design/technical-design-handoff-contract.md`,
and Jig's plan shape at `jig/docs/design/contracts/execution-plan-contract-v0.md`. In the suite those
sibling repos are present; on its own you supply artifacts in the same shapes.

## Accepted Inputs

A planning-ready input set includes:

- a Product PRD or equivalent product artifact with stable acceptance-criteria IDs;
- an approved technical-design artifact whose frontmatter identifies
  `handoff_contract: technical-design-handoff-v0`;
- a complete `Planner Handoff Summary` with stable planner-facing fact IDs, including the `DEL-*`,
  `SEQ-*`, `FILE-*`, `FAIL-*`, `VAL-*`, and `STOP-*` rows the plan needs to preserve;
- the current Jig `execution-plan-shape-v0` contract shape;
- track identity plus policy and work-profile references that Jig can interpret later.

Planning may read methodology-specific design detail for context, but the required planning facts
must be present in the planner-facing handoff summary.

## Projection Invariant

Planning is **projection-only**: it projects Product acceptance-criteria IDs and approved
technical-design handoff facts into Jig plan properties. It may add planning organization that
makes those projections reviewable — such as story IDs, explicit out-of-scope notes, reconciliation
tables, or operand-source rows — but those additions must be lossless reorganizations of cited
sources, not new scope.

If a required plan statement cannot be projected from a cited Product artifact, technical-design
fact, or already-approved upstream artifact, Planning stops. It does not fill the gap by inventing
product scope, design facts, package layout, model routing, execution-host behavior, or
implementation detail.

## Required Output Properties

At design altitude, a Planning output preserves these Jig plan properties:

| Jig property                       | Planning obligation                                                                                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plan identity and provenance       | Name a stable plan ID, title, producer/source references, input contract versions, Product PRD IDs, and Technical Design fact IDs.                              |
| Track binding                      | Bind the plan to one track and cite the policy, work profile, and repo floor references without weakening them.                                                 |
| Story set                          | Produce reviewable stories with stable IDs, intent, scope boundary, source references, dependencies, and done/evidence requirements.                            |
| Dependency and eligibility model   | Represent producer-before-consumer dependencies and independent stories as a graph Jig can use for eligibility.                                                 |
| Done and evidence requirements     | State falsifiable evidence categories, commands or review gates when supplied, and the upstream facts each evidence item proves.                                |
| Authority and approval needs       | Declare expected worker requests, runner-owned actions, privileged actions, and owner re-approval triggers.                                                     |
| Policy and work-profile references | Reference policy/work-profile identities and version posture without embedding mutable overrides.                                                               |
| Stack-seam requirements            | Name required Agent, Execution Host, Forge, and Work Source capabilities or source references when the design requires them.                                    |
| Constraints and limits             | Carry concurrency, sequencing, retry/budget, isolation, branch/review, non-goal, and out-of-scope constraints supplied by Product, Technical Design, or policy. |

## Whole-Graph Reconciliation

Before Planning may emit a plan, it reconciles the whole graph it declares:

- every dependency edge in the plan cites a `SEQ-*` fact or another source-backed upstream reason
  the technical design already approved;
- every consumed shared surface (`FILE-*`), failure/degraded token (`FAIL-*`), or other
  producer-owned input named by a story resolves to exactly one producer story in the emitted plan
  or one already-approved upstream artifact;
- a **phantom consumer** is a story that claims to wait on, consume, or prove a producer-owned item
  without a matching dependency/source row naming what it consumes;
- an **unsupported dependency edge** is an ordering edge the plan introduces without a cited source
  fact requiring it.

Phantom consumers, unsupported dependency edges, and missing producer/source closure are stop
conditions. They are review-blocking gaps, not cleanup for a later reviewer.

## Evidence Binding and Predicate Sourcing

Planning binds evidence and done conditions to concrete sources:

- every evidence item names a concrete command, named gate lane, specific reviewer check, or
  preserved artifact, not prose-only intent such as "tests exist" or "works correctly";
- every relational or compound condition is decomposed enough that each predicate names the
  concrete source for every operand it evaluates;
- naming only an input category, citation, or ref (for example "the handoff", "the policy", or
  "the projections") is not enough when the plan is asserting a condition about specific values or
  boundaries.

An unsourced operand, prose-only evidence item, or produced/consumed value with no cited source is a
stop condition. Planning must name the gap and its owner instead of emitting a partial plan.

## Traceability Rule

Every story must be traceable through this chain:

```text
Product PRD AC ID -> Technical Design handoff fact ID -> Jig plan property
```

The story may cite more than one Product ID or design fact. The key requirement is that a reviewer can
answer all of these questions without inferring hidden scope:

- which product outcome or acceptance criterion requires this story;
- which design facts authorize the story boundary, sequencing, evidence, and stop conditions;
- which Jig plan properties carry those facts forward.

## Refusal and Stop Behavior

Planning stops instead of producing or revising a plan when any of these conditions is true:

- Product acceptance-criteria IDs are missing, unstable, superseded without replacement, or
  locally reinterpreted.
- The technical design omits required frontmatter, lacks `technical-design-handoff-v0`, is not
  approved for planning, or has a blank/TBD `Planner Handoff Summary`.
- Required handoff fact categories are only implied by prose or methodology-specific detail.
- A `DEL-*` story area lacks source, boundary, validation, or stop-condition references.
- Dependencies are hidden, contradictory, cyclic without an explicit design rationale, or impossible
  to prove from `SEQ-*` facts.
- The plan introduces a phantom consumer, unsupported dependency edge, or any consumed shared
  surface / failure token / producer-owned input with no single authoritative producer or upstream
  source.
- Evidence is unprovable, vacuous, or detached from Product AC IDs and design facts.
- Evidence names only prose categories, unnamed checks, or artifacts with no concrete inspection
  path.
- A relational or compound condition leaves any operand unsourced, or cites an input category rather
  than the specific value source the condition evaluates.
- The requested plan would invent product scope, technical-design facts, package layout, policy
  semantics, model routing, execution-host behavior, or implementation details not present in the
  inputs.

The stop result must name the missing or conflicting source ID and the owner that must resolve it,
as `AC-STOP-001` requires.

## Review Checklist

A design-to-plan output is acceptable when:

- each story cites at least one Product acceptance-criteria ID and one Technical Design handoff fact;
- every Product acceptance criterion in scope is either covered by stories or explicitly out of
  scope with a source-backed reason;
- every cited `DEL-*`, `SEQ-*`, `VAL-*`, and `STOP-*` fact is reflected in the story set,
  dependency graph, done/evidence requirements, or stop behavior;
- every consumed `FILE-*`, `FAIL-*`, or producer-owned value resolves to exactly one source story or
  already-approved upstream artifact, with no phantom consumers or unsupported dependency edges;
- evidence is bound to a concrete command, named gate lane, reviewer check, or preserved artifact;
- every relational or compound condition names the concrete source for each operand it evaluates;
- authority expectations and policy/work-profile references are declared without granting authority;
- stack-seam assumptions are stated as required capabilities or source refs, not implementations;
- the emitted plan remains a projection of source facts into Jig plan properties rather than a new
  design, package layout, or runtime policy layer;
- the fixture or plan is checked against Jig's v0 shape properties, not against an invented schema.

## Product Reconciliation

Each Product acceptance criterion maps to the design surface that satisfies it:

| Product AC     | Satisfied by                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| `AC-PLAN-001`  | [Required Output Properties](#required-output-properties) preserve every Jig plan property.             |
| `AC-DAG-001`   | The dependency and eligibility row of Required Output Properties; [`flows.md`](flows.md) step 4.        |
| `AC-EVID-001`  | The done and evidence row of Required Output Properties; [`flows.md`](flows.md) step 5.                 |
| `AC-TRACE-001` | [Traceability Rule](#traceability-rule); the fixture [`examples/`](examples/minimal-design-to-plan.md). |
| `AC-SCOPE-001` | [Refusal and Stop Behavior](#refusal-and-stop-behavior) (refuses to invent scope).                      |
| `AC-STOP-001`  | [Refusal and Stop Behavior](#refusal-and-stop-behavior); [`flows.md`](flows.md) stop-or-emit.           |

Suite seam references were **verified externally** against the current org repos on 2026-07-01. In a
standalone checkout these are **external contract citations, not local files** — consumers supply
artifacts in equivalent shapes. What was checked:

- Jig's output seam — `jig/docs/design/contracts/execution-plan-contract-v0.md` is the shape the
  Required Output Properties preserve.
- The Technical Design input seam — the id `technical-design-handoff-v0` and the handoff fact-ID
  prefixes this contract and its fixture rely on (including `SRC-`, `CTX-`, `DEL-`, `SEQ-`, `FILE-`,
  `FAIL-`, `VAL-`, and `STOP-`) are defined in
  `technical-design/docs/design/technical-design-handoff-contract.md`.
- The Product AC IDs cited here match the six in [`../product/design-to-plan.md`](../product/design-to-plan.md).

No conflict was found between this design contract and the current Product, Technical Design, or Jig
contract docs. If a future change to any of those contracts breaks one of the checks above, name the
conflict and its owner here rather than silently reconciling.

---
title: Design-to-plan contract
status: v0
---

# Design-to-plan Contract

This contract defines the Planning-layer transformation from an approved technical-design handoff to
a Jig-ready execution plan. It is a docs-level contract, not a runtime implementation, schema
validator, CLI, prompt, package layout, or TypeScript interface.

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

## Accepted Inputs

A planning-ready input set includes:

- a Product PRD or equivalent product artifact with stable acceptance-criteria IDs;
- an approved technical-design artifact whose frontmatter identifies
  `handoff_contract: technical-design-handoff-v0`;
- a complete `Planner Handoff Summary` with stable planner-facing fact IDs;
- the current Jig `execution-plan-shape-v0` contract shape;
- track identity plus policy and work-profile references that Jig can interpret later.

Planning may read methodology-specific design detail for context, but the required planning facts
must be present in the planner-facing handoff summary.

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
- Evidence is unprovable, vacuous, or detached from Product AC IDs and design facts.
- The requested plan would invent product scope, technical-design facts, package layout, policy
  semantics, model routing, execution-host behavior, or implementation details not present in the
  inputs.

The stop result should name the missing or conflicting source ID and the owner that must resolve it.

## Review Checklist

A design-to-plan output is acceptable when:

- each story cites at least one Product acceptance-criteria ID and one Technical Design handoff fact;
- every Product acceptance criterion in scope is either covered by stories or explicitly out of
  scope with a source-backed reason;
- every cited `DEL-*`, `SEQ-*`, `VAL-*`, and `STOP-*` fact is reflected in the story set,
  dependency graph, done/evidence requirements, or stop behavior;
- authority expectations and policy/work-profile references are declared without granting authority;
- stack-seam assumptions are stated as required capabilities or source refs, not implementations;
- the fixture or plan is checked against Jig's v0 shape properties, not against an invented schema.

## Product Reconciliation

This design contract satisfies the Design-to-plan PRD by preserving the Jig shape
(`AC-PLAN-001`), dependency graph (`AC-DAG-001`), evidence requirements (`AC-EVID-001`),
traceability (`AC-TRACE-001`), refusal boundaries (`AC-SCOPE-001`), and stop-and-attribute
behavior (`AC-STOP-001`) via the Refusal and Stop Behavior section above.

No conflict was found between this design contract and the current Product, Technical Design, or Jig
contract docs.

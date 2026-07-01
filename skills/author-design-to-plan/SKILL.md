---
name: author-design-to-plan
description: Use to turn an approved technical-design handoff and Product PRD acceptance criteria into a reviewable, execution-ready plan in Jig's execution-plan-shape-v0. The transformation is projection-only: it projects Product AC IDs and approved handoff facts into Jig plan properties without adding scope, package layout, model routing, or runtime behavior. Accepts a technical-design artifact carrying handoff_contract:technical-design-handoff-v0, design_status:approved, and a complete Planner Handoff Summary, plus Product PRD acceptance-criteria IDs and track/policy/work-profile references. Stops and names the missing or conflicting source, failing check, and owner when required inputs are missing, unstable, contradictory, or would force invented scope. Produces a plan document preserving Jig's required v0 properties (identity/provenance, track binding, story set, dependency graph, done/evidence requirements, authority/approval needs, policy/work-profile references, stack-seam requirements, constraints). Does not review or refine an existing plan after the fact — use review-plan for that.
---

# author-design-to-plan

Turn one approved technical-design handoff plus its Product PRD acceptance criteria into a plan
Jig can schedule, run, and land. This skill runs the transformation in a single pass — ingest,
validate, projection-only decomposition, graph reconciliation, evidence/predicate binding,
traceability check, stop-or-emit — and never invents a product, design, or implementation decision
that is not present in its inputs. Use `review-plan` afterward for an independent post-hoc check of
the emitted plan's correctness, quality, decomposition, scoping, and coverage.

## Where this sits

```text
PRODUCT ---------> DESIGN ----------> PLANNING --------> DELIVERY --------> LEARNING
define-product     technical-design   author-design-to-plan        jig (run)          feedback loop
                                      (this skill)
```

design-to-plan owns no new cross-repo seam: it consumes the Product PRD and the Technical Design
handoff, and produces to Jig's plan shape. In the suite those sibling repos are present; used
standalone, the caller supplies equivalent artifacts in the same shapes.

## References (load before authoring)

| Reference                                                                                                 | Use for                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `../../docs/design/design-to-plan-contract.md`                                                            | Accepted Inputs, Required Output Properties, Traceability Rule, Refusal and Stop Behavior, Review Checklist — the normative source for every step below                          |
| `../../docs/design/flows.md`                                                                              | The staged lifecycle this skill implements                                                                                                                                       |
| `../../docs/design/examples/minimal-design-to-plan.md`                                                    | Illustrative fixture proving traceability and shape preservation end to end                                                                                                      |
| `templates/plan-template.md`                                                                              | Output skeleton — preserves Jig's named properties without freezing field-level shape                                                                                            |
| Jig's `execution-plan-contract-v0.md` (sibling repo, or a caller-supplied equivalent)                     | Full definition of the properties this plan must preserve                                                                                                                        |
| Technical Design's `technical-design-handoff-contract.md` (sibling repo, or a caller-supplied equivalent) | Fact-ID prefixes (`SRC-`, `CTX-`, `INV-`, `SURF-`, `FAIL-`, `OBS-`, `ENF-`, `DEL-`, `SEQ-`, `FILE-`, `VAL-`, `STOP-`) and the Planner Handoff Summary structure this skill reads |

## Preconditions

- A technical-design artifact is available whose frontmatter includes
  `handoff_contract: technical-design-handoff-v0` and `design_status: approved` — or an explicitly
  documented planning-approved equivalent the caller names up front. `draft`, `reviewed`, and
  `superseded` are not planning-ready; "reviewed" means review happened, not that planning is
  authorized.
- A Product PRD or equivalent artifact with stable acceptance-criteria IDs is available.
- Track identity plus policy and work-profile references are available (contract §Accepted
  Inputs) — Planning does not invent a track binding when these are absent.
- The caller has not already asked for a runtime, CLI, schema, or validator — this skill produces
  a plan document only.

If any precondition is unmet, do not guess at a substitute source — go to Step 2 and stop.

## Steps

### Step 1 — Ingest the planning-ready input set

Assemble the Accepted Inputs (contract §Accepted Inputs): the Product PRD with acceptance-criteria
IDs, the technical-design artifact's `Planner Handoff Summary` with stable fact IDs, Jig's current
`execution-plan-shape-v0` properties, and the track's policy and work-profile references. Read
enough of the handoff to capture the delivery (`DEL-*`), sequencing (`SEQ-*`), shared-surface
(`FILE-*`), failure/degraded (`FAIL-*`), validation (`VAL-*`), and stop (`STOP-*`) facts the plan
must preserve. Read methodology-specific sections (context maps, invariant matrices,
ports/adapters tables) for context only — they are never the contract surface. Operand/value sources
used later in the plan may come from any cited handoff fact category when the cited row actually
authorizes that value.

### Step 2 — Validate the handoff (stop gate)

Check, in order:

- required frontmatter (`design_id`, `handoff_contract: technical-design-handoff-v0`,
  `design_status`, `round`) is present and consistent with the Handoff Identity section;
- `design_status` is exactly `approved` — or an equivalent the caller documented as
  planning-approved in Step 1. The handoff contract's statuses are ordered (`draft`, `reviewed`,
  `approved`, `superseded`); `reviewed` alone does not authorize planning, and `draft` or
  `superseded` never do;
- the `Planner Handoff Summary` is present and non-blank — no section may read "TBD", be a blank
  table, or merely restate methodology prose without a fact ID;
- Product acceptance-criteria IDs referenced by the handoff's `SRC-*` facts are themselves stable
  and resolvable;
- track identity, a policy reference, and a work-profile reference are all present — a plan cannot
  bind to a track it was not given, and the template must never placeholder these into existence.

If any check fails, stop now — go to Step 7's stop path. Do not continue to Step 3 hoping a later
step will compensate.

### Step 3 — Decompose into a projection-only story set

Build stories from `DEL-*` facts and the Product ACs they preserve. Each story gets a stable ID,
a concise title and intent, its source references (Product AC IDs and handoff fact IDs), and an
expected scope boundary (files, components, capabilities, or behavior areas — not an invented
package layout; `AC-SCOPE-001`). The story set is a projection of supplied sources into plan
organization. It may make scope reviewable, but it may not add scope, invent a runtime policy, or
smuggle in implementation details the sources did not authorize.

### Step 4 — Build the dependency and eligibility graph, then reconcile it

Represent `SEQ-*` facts as an explicit graph: producer-before-consumer edges where a design fact
states an ordering constraint, and independent stories where none exists. A story is not eligible
until its declared prerequisites land — never merely started or self-reported complete.

Then run whole-graph producer/source closure across the plan you are about to emit:

- every dependency edge cites the `SEQ-*` fact that requires it;
- every consumed shared surface from `FILE-*`, failure/degraded token from `FAIL-*`, or other
  producer-owned input resolves to exactly one source story in the emitted plan or one
  already-approved upstream artifact;
- every consumer row names what it consumes, not just who it depends on.

If a consumer has no matching producer/source row, the plan has a phantom consumer. If an edge has
no cited source fact, it is an unsupported dependency edge. Either is a stop condition (Step 7),
not something to reconcile silently.

### Step 5 — Attach done and evidence requirements, and source every predicate

For each story, state falsifiable evidence from `VAL-*` facts: automated checks (name the actual
command or gate lane, e.g. `pnpm check`, a named test file, or a static rule), review requirements,
capability-proof requirements, and evidence artifacts to preserve. Every evidence item must cite
the Product AC and handoff fact it proves. An evidence item that only says "tests exist" or "works
correctly" without naming a command or gate lane is not falsifiable — treat it as a design gap and
route to Step 7, not as accepted evidence.

When a done-condition is relational or compound, decompose it until each predicate names the
concrete source for every operand it evaluates. A citation to "the handoff", "policy", or
"projection" is not enough if the plan is asserting a value-level relationship. An unsourced
operand is a source gap and routes to Step 7.

### Step 6 — Run the traceability check

Confirm every story traces `Product PRD AC ID -> Technical Design handoff fact ID -> Jig plan
property` (contract §Traceability Rule). Confirm every in-scope Product AC is either covered by a
story or explicitly marked out of scope with a source-backed reason. A reviewer must be able to
answer, from the plan alone and without inferring hidden scope: which outcome requires this story,
which facts authorize its boundary/sequencing/evidence/stop conditions, which producer or upstream
artifact closes every consumed source, and which Jig properties carry those facts forward.

### Step 7 — Stop or emit

Stop and produce **no plan** — instead name the missing or conflicting source ID and the owner
responsible for resolving it — when any condition in the contract's §Refusal and Stop Behavior
holds, including any failure surfaced in Steps 2, 4, 5, or 6. A stop result is a complete, valid
output of this skill; it is not a failure to work around. Name the failing check class as well
(`input validity`, `whole-graph reconciliation`, `evidence binding`, `predicate sourcing`, or
`traceability coverage`) so the caller can route the repair deliberately.

Otherwise, emit a plan using `templates/plan-template.md`, preserving every property the contract's
§Required Output Properties lists: plan identity and provenance, track binding, story set,
dependency and eligibility model, done and evidence requirements, authority and approval needs,
policy and work-profile references, stack-seam requirements, and constraints and limits. Plan
identity and provenance must name the Product PRD's contract/status, the Technical Design handoff's
`handoff_contract` and `design_status`, the Jig `execution-plan-shape-v0` reference, and source
artifact paths/versions when available — so Jig can reject an incompatible or stale plan by
inspection rather than guessing. Include the per-story and per-property traceability tables so the
check in Step 6 is visible in the output, not just performed silently.

## Anti-patterns

- Inventing Product acceptance criteria, design facts, dependencies, evidence, or implementation
  package layout that are not present in the inputs (`AC-SCOPE-001`).
- Treating projection-only planning as permission to invent extra scope because "it is just
  organization" — organization is allowed only when it is a lossless reshaping of cited sources.
- Treating methodology-specific prose (DDD context maps, invariant matrices, ports/adapters tables)
  as if it were the `Planner Handoff Summary` — only the summary's fact-ID tables are the contract
  surface; methodology detail is context only.
- Emitting a plan when the handoff is blank, `TBD`, or only implied by prose instead of stopping.
- Listing a consumer of a producer-owned surface or token without naming the consumed item and its
  authoritative producer/source.
- Accepting evidence that names no concrete gate, command, reviewer check, or artifact.
- Letting a relational/compound done-condition pass with only one operand sourced.
- Silently resolving a conflict between Product and Technical Design facts instead of naming it.
- Freezing Jig's field names, nesting, or enums into a schema, validator, or TypeScript interface —
  this skill preserves named properties, not a frozen shape (see the design layer's D-002).
- Continuing past Step 2's stop gate on the assumption a later step will fill the gap.

## Handoff

After emitting a plan, or after stopping, tell the caller to run `review-plan` against the result
before treating it as final. This skill does not review its own output.

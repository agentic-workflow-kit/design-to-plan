---
name: review-plan
description: Use to independently verify a plan produced by author-design-to-plan (or any plan claiming execution-plan-shape-v0 conformance) after it exists. Checks correctness against the design-to-plan contract's Required Output Properties and Review Checklist, plus decomposition, scoping, and coverage — sharpened by defect classes seen in prior plan-authoring generations (phantom-consumer dependencies, prose-only evidence, oversized stories, one-sided predicate sourcing). Produces a review-findings document with disposition-ready suggestions; never edits the plan directly.
---

# Review a Jig-ready execution plan

Independently verify a plan that already exists — either `author-design-to-plan`'s output or any document
claiming `execution-plan-shape-v0` conformance. This is a post-hoc check: it runs after the plan is
drafted, not as a pre-freeze gate. It never rewrites the plan; it appends findings for the plan's
author (or the calling user) to disposition.

## Where this sits

Runs after `author-design-to-plan` in the same Planning layer. It replaces having a separate pre-freeze
"frame" characterization stage — the same reconciliation checks a frame gate would run are
performed here, against the plan as emitted, so a single skill covers both authoring and
verification without a blocking two-gate split.

## References (load before reviewing)

| Reference                                       | Use for                                                                                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `../../docs/design/design-to-plan-contract.md`  | Required Output Properties, Traceability Rule, Refusal and Stop Behavior, Review Checklist — the normative source for every check below |
| The technical-design handoff being planned from | Ground truth for `DEL-*`, `SEQ-*`, `VAL-*`, `STOP-*` facts the plan claims to preserve                                                  |
| The Product PRD being planned from              | Ground truth for the acceptance-criteria IDs the plan claims to cover                                                                   |
| `templates/review-findings-template.md`         | Output skeleton                                                                                                                         |

## Preconditions

- A plan document exists (from `author-design-to-plan` or elsewhere) that claims to preserve
  `execution-plan-shape-v0` properties.
- The technical-design handoff and Product PRD the plan claims to derive from are available for
  cross-checking — reviewing a plan against facts you cannot see produces unverifiable findings.

If the source handoff or PRD is unavailable, say so and review only what can be checked
structurally (internal consistency of the plan), flagging external traceability as unverifiable
rather than passing it silently.

## Checklist

Run every check below against the plan. Each finding cites the plan section, the contract
requirement it violates, and — where applicable — the source fact or AC ID it's missing.

### 1. Required Output Properties present and populated

Every property in the contract's §Required Output Properties appears in the plan and is
populated — not a heading with an empty or placeholder body. A present-but-empty section is a
gap, not a satisfied requirement.

### 2. Traceability coverage (`AC-TRACE-001`)

Every story cites at least one Product AC ID and one handoff fact ID. Every in-scope Product AC is
either covered by a story or explicitly marked out of scope with a source-backed reason. Flag any
story with a citation that does not resolve to a real ID in the supplied PRD or handoff.

### 3. Whole-graph reconciliation

For every fact or dependency a story consumes (a `SEQ-*` edge, a shared file from `FILE-*`, a
failure token from `FAIL-*`), confirm exactly one story or an already-approved upstream artifact
produces it. Flag phantom-consumer edges — a dependency claimed by a consumer story with no
producer anywhere in the plan or its declared upstream inputs.

### 4. Evidence-gate binding (`AC-EVID-001`)

Every done/evidence item names a concrete command, gate lane, or specific reviewer check. Flag
prose-only evidence ("tests exist", "works correctly", "verified manually" with no named
artifact) — evidence that cannot be pointed at is not falsifiable.

### 5. Predicate and operand sourcing

For any relational or compound done-condition (e.g., "X is inside Y", "A happens before B"),
confirm both operands trace to a declared input, consumed event, or producer-owned field in the
plan or its source facts. Flag conditions where only one operand is sourced and the other is
assumed or invented.

### 6. Story sizing

Flag stories that bundle materially unrelated ACs, facts, or scope areas into one unit — a sign
that internal seams are hidden from per-story review. Note the specific facts/ACs that look
separable and why.

### 7. Dependency graph validity (`AC-DAG-001`)

Confirm dependency edges are acyclic unless the plan states an explicit design rationale for a
cycle, and that independent stories are represented as such rather than serialized without cause.

### 8. Scope discipline (`AC-SCOPE-001`)

Confirm the plan does not invent product scope, design facts, implementation package layout,
policy semantics, or execution-host behavior beyond what the source handoff and PRD state.

### 9. Stop-condition fidelity (`AC-STOP-001`)

If the plan itself documents a stop (rather than an emitted plan), confirm the stop names a
specific missing or conflicting source ID and an owner responsible for resolving it — a stop that
just says "inputs incomplete" without naming the source and owner does not satisfy the contract.

## Output

Write findings using `templates/review-findings-template.md`: one entry per checklist violation,
each naming the plan section, the violated requirement, and — where the fix is unambiguous — a
suggested correction. Do not renumber or rewrite the plan's own IDs. Findings are proposals for the
plan's author to disposition (accept, reject with reason, or defer), the same way `decisions.md`
records a `Suggestion:` line without rewriting history.

If every check passes, say so explicitly and do not manufacture a finding to have something to
report.

## Anti-patterns

- Treating an empty or placeholder section as satisfying a Required Output Property.
- Passing evidence that names no concrete command, gate, or check.
- Silently fixing the plan instead of writing a finding — this skill reviews, it does not author.
- Flagging a genuinely independent story as a missing dependency, or vice versa, without checking
  the source `SEQ-*` facts first.
- Manufacturing findings when the plan is sound, to appear thorough.

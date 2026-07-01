---
title: Design-to-plan design decisions
status: v0
---

# Design Decisions — design-to-plan

Append-only decision log for the design layer. The entries below are **author-seeded**: the design
decisions that shaped `docs/design/`, each tied to the Product source that drives it. Review-loop
dispositions append in the same shape (adding a `Suggestion:` line); history is never rewritten.

Status legend: `applied`, `open-deferred`, `rejected`.

---

## D-001 - Docs-only contract seed; no runtime, schema, CLI, or skill

- **Date:** 2026-07-01
- **Driver:** PRD Non-Goals and Constraints ("this seed is a docs-level contract and ships none of
  those"; "must not publish a schema, validator, runtime package, CLI, or TypeScript interface").
- **Decision:** accepted
- **Rationale:** Planning owns no new cross-repo seam and unblocks Jig's local MVP with a docs-level
  contract; freezing behavior in code now would over-commit before Jig's shape settles.
- **Consequence:** The design layer stays Markdown: a contract, a flows lifecycle, this log, and an
  illustrative fixture. The gate is `pnpm check` (Prettier); there is no `src/`.
- **Status:** applied

## D-002 - Preserve Jig's execution-plan shape as required properties, not a frozen schema

- **Date:** 2026-07-01
- **Driver:** `AC-PLAN-001`; PRD Constraint ("Jig's v0 plan contract is not a frozen JSON Schema");
  Jig's `jig/docs/design/contracts/execution-plan-contract-v0.md`.
- **Decision:** accepted
- **Rationale:** Downstream layers depend on the _shape_ (the named properties), not the field-level
  encoding; freezing field names/enums here would couple Planning to Jig internals Jig still refines.
- **Consequence:** The contract's Required Output Properties preserve Jig's named properties without
  fixing field names, nesting, enums, or storage. Tracking the shape as it evolves is a deferred
  question (see D-006).
- **Status:** applied

## D-003 - Traceability expressed as a per-story `AC ID -> fact ID -> Jig property` chain

- **Date:** 2026-07-01
- **Driver:** `AC-TRACE-001`; PRD "What It Does" and the contract Traceability Rule.
- **Decision:** accepted
- **Rationale:** A single, uniform chain lets a reviewer answer "why does this story exist, what
  authorizes its boundary and evidence, and where does that carry forward" without inferring hidden
  scope.
- **Consequence:** Every story cites at least one Product AC ID and one Technical Design handoff fact;
  the fixture demonstrates the full chain and a per-property traceability check.
- **Status:** applied

## D-004 - Stop-and-attribute over invented scope

- **Date:** 2026-07-01
- **Driver:** `AC-STOP-001`, `AC-SCOPE-001`; the contract Refusal and Stop Behavior section.
- **Decision:** accepted
- **Rationale:** When inputs cannot support the traceability chain, guessing the missing decision is
  worse than stopping; the owner responsible for the gap must resolve it, not the planner.
- **Consequence:** The enumerated stop conditions live in the contract (single normative source); the
  flows lifecycle routes both the validation gate and the traceability check to the same stop outcome,
  which names the missing or conflicting source ID and its owner.
- **Status:** applied

## D-005 - Consume the Planner Handoff Summary as the contract surface; methodology prose is context

- **Date:** 2026-07-01
- **Driver:** PRD Constraints (consumes the `technical-design-handoff-v0` contract);
  `technical-design/docs/design/technical-design-handoff-contract.md` (the handoff summary is the
  contract surface).
- **Decision:** accepted
- **Rationale:** Planning must extract the same facts regardless of authoring methodology (DDD or
  otherwise); binding to methodology-specific prose would break that neutrality (anti-corruption).
- **Consequence:** Accepted Inputs require the facts in the planner-facing handoff summary with stable
  IDs; methodology detail may be read for context only. A blank or prose-only handoff is a stop
  condition (D-004).
- **Status:** applied

## D-006 - Defer hardening Planning into a skill/runtime or a checkable traceability artifact

- **Date:** 2026-07-01
- **Driver:** PRD Open Questions (how much becomes a skill/runtime; whether the traceability format
  hardens into a checkable artifact and which layer owns that check).
- **Decision:** deferred
- **Rationale:** The docs-level contract is enough to unblock Jig's local MVP; committing to a
  runtime or a validator now would freeze behavior and Jig's shape prematurely (see D-001, D-002).
- **Consequence:** Tracked as a Product open question; the design layer stays docs-level until the
  shape settles. `enforce-architecture` (seeded-violation code rules) is therefore out of scope; the
  design-layer gate is the contract's Review Checklist plus `pnpm check`, i.e. manual review, not a
  code enforcement rule.
- **Status:** open-deferred
- **Suggestion:** The "skill" half of this question is resolved by D-009 — skill: yes, now
  (`author-design-to-plan` + `review-plan`). The runtime/validator/eval-harness half stays deferred.

## D-007 - Mirror the product single-hub house pattern; design owns "how" and reconciles to product

- **Date:** 2026-07-01
- **Driver:** Repo `AGENTS.md` altitude rule (`docs/product/` owns what & why, `docs/design/` owns
  how); the landed product layer's single-hub shape.
- **Decision:** accepted
- **Rationale:** A reader should find the same altitude split the product layer already establishes;
  where design and product intent conflict, the conflict is named rather than silently resolved.
- **Consequence:** `docs/design/` is a README hub over focused docs (contract, flows, decisions,
  example); the contract carries a Product Reconciliation section that verifies, rather than asserts,
  consistency with the Product, Technical Design, and Jig contracts.
- **Status:** applied

## D-008 - Design-to-plan's own design layer is not a technical-design handoff artifact

- **Date:** 2026-07-01
- **Driver:** This layer was authored via the local `technical-design` frame -> author -> review flow;
  its DDD profile's "required artifacts" list assumes producing a `technical-design-handoff-v0`
  document. design-to-plan is the _planner_, not a design being planned.
- **Decision:** accepted (resolves the one `requires approval` InputResolution item at the frame gate)
- **Rationale:** Emitting handoff frontmatter and a Planner Handoff Summary here would misrepresent
  design-to-plan's own design docs as a downstream-consumable handoff. The flow's intake, structure,
  and review discipline apply; the handoff-artifact output and tactical-DDD ceremony do not.
- **Consequence:** `architecture_mode: contract/seam design`, `ddd_depth: strategic-only`; no
  `handoff_contract` frontmatter, Planner Handoff Summary, context/aggregate maps, or invariant/state
  matrices. The durable output is this design layer (contract, flows, decisions, fixture).
- **Status:** applied

## D-009 - Supersede D-001's "no skill" clause; build author-design-to-plan and review-plan skills

- **Date:** 2026-07-01
- **Driver:** Owner direction: `jig` is confirmed runtime-only and owns no planning logic
  (`jig/AGENTS.md`: it "takes an approved execution plan plus a policy and turns it into reviewed,
  landed work"). design-to-plan is therefore the only layer that can own the input-to-plan
  transformation this contract specifies. This resolves D-006's deferred open question ("how much
  of Planning eventually becomes a skill or runtime") in favor of a skill, now.
- **Decision:** accepted
- **Rationale:** A docs-level contract with no executable transformation cannot itself turn an
  approved design into a plan; someone still has to perform the seven `flows.md` stages by hand
  with no repeatable guardrails. A skill that implements the contract's own stages, refusal
  behavior, and traceability rule verbatim keeps the transformation auditable against the same
  contract, rather than moving it to an unreviewed ad hoc process.
- **Consequence:** Adds `skills/author-design-to-plan/` (single-pass: ingest, validate, decompose, graph,
  evidence, traceability check, stop-or-emit) and `skills/review-plan/` (independent, post-hoc
  verification of an emitted plan's correctness, decomposition, scoping, and coverage). This
  supersedes only the "skill" clause of D-001 — D-002 (preserve Jig's plan shape as properties, not
  a frozen schema) stays binding and unaffected. D-006's deferral continues to apply to a schema,
  validator, CLI, runtime package, and eval/fixture harness: all remain out of scope. `AGENTS.md`,
  `README.md`, `docs/design/README.md`, and `docs/product/design-to-plan.md`'s Non-Goals and
  When-Not-To-Use sections are updated to carve "skill" out of their "no skill" language
  accordingly, rather than leaving those pages self-contradictory.
- **Status:** applied

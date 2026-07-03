# Review Findings: Defective Emitted Plan

- DEF-001 phantom-consumer violates whole-graph reconciliation: STORY-CONSUME consumes FILE-SEARCH-API under FILE-001, but no story or approved upstream artifact produces FILE-SEARCH-API; the plan should have stopped.
- DEF-002 unsupported-dependency-edge violates Dependency graph validity: STORY-ORDER depends on STORY-CONSUME without the SEQ-001 source edge; the plan should have stopped.
- DEF-003 prose-only-evidence violates Evidence-gate binding: STORY-EVIDENCE says tests exist instead of binding VAL-001 to the concrete gate pnpm check.
- DEF-004 unsourced-operand violates Predicate and operand sourcing: the runtime cost within budget condition names runtime cost and budget with no operand source; STOP-001 says this should have stopped.
- DEF-005 jig-schema-invention violates Scope discipline: STORY-SCHEMA adds packages/plan-schema/src/index.ts, JSON Schema, and TypeScript interface despite AC-SCOPE-001 forbidding Jig field-level schema invention.
- DEF-006 stop-condition-drift violates Stop-condition fidelity and drift: this emitted plan contains phantom consumers, unsupported edges, prose-only evidence, and unsourced operands, so STOP-001 means it should have stopped.

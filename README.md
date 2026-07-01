# design-to-plan

> Turn an approved technical design into a reviewable, execution-ready plan — usable on its own, and
> as the Planning layer of the agentic-workflow-kit suite.

## Status

Defines product and design contracts for the Planning layer, and implements the transformation as
two skills: [`skills/author-design-to-plan/`](skills/author-design-to-plan/) (technical-design handoff + Product PRD ->
Jig-ready plan) and [`skills/review-plan/`](skills/review-plan/) (independent post-hoc plan review).
It does not ship a runtime, CLI, validator, schema package, or eval harness — see
[`docs/design/decisions.md`](docs/design/decisions.md), D-009.

## Development

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` is the single required local and CI gate.

## Documentation

- [`docs/product/`](docs/product/) — what & why (audience-facing).
- [`docs/design/`](docs/design/) — how (mechanics, decisions, contracts).
- [`skills/`](skills/) — the planning transformation itself.

## Relationship to the suite

`design-to-plan` sits between
[`technical-design`](https://github.com/agentic-workflow-kit/technical-design) and
[`jig`](https://github.com/agentic-workflow-kit/jig):

```text
PRODUCT ---------> DESIGN ----------> PLANNING --------> DELIVERY --------> LEARNING
define / PRD       technical-design   design-to-plan     jig (run)          feedback loop
```

Planning owns no upstream product or design decision. It consumes Product PRD/acceptance-criteria
IDs and the Technical Design handoff contract, then produces to Jig's execution-plan contract
shape. Those upstream and downstream tools are strong defaults, not prerequisites — design-to-plan
is usable on its own, supplying the inputs and consuming the plan yourself.

## License

MIT License. See [LICENSE](LICENSE).

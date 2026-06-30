# design-to-plan

> Planning-layer seed for turning approved technical designs into Jig-ready execution plans.

## Status

Seeded docs-only repo. It defines product and design contracts for the Planning layer; it does not
ship a runtime, CLI, validator, schema package, skill pack, or implementation planner.

## Development

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` is the single required local and CI gate.

## Documentation

- [`docs/product/`](docs/product/) — what & why (audience-facing).
- [`docs/design/`](docs/design/) — how (mechanics, decisions, contracts).

## Relationship to the suite

`design-to-plan` sits between
[`technical-design`](https://github.com/agentic-workflow-kit/technical-design) and
[`jig`](https://github.com/agentic-workflow-kit/jig):

```text
PRODUCT ---------> DESIGN ----------> PLANNING --------> DELIVERY
define / PRD       technical-design   design-to-plan     jig (run)
```

Planning owns no upstream product or design decision. It consumes Product PRD/acceptance-criteria
IDs and the Technical Design handoff contract, then produces to Jig's execution-plan contract
shape.

## License

MIT License. See [LICENSE](LICENSE).

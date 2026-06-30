# AGENTS.md — design-to-plan

The contract for working in this repo. **Self-contained:** act on it with only this repo checked
out (including Claude or Codex cloud runs). Don't work from memory — read the doc here that owns
your subject, then plan before non-trivial work.

`design-to-plan` is the Planning-layer seed in the agentic-workflow-kit suite. It turns approved
technical-design handoffs into Jig-ready execution plans. It owns no new cross-repo seam: it
consumes Product PRD/acceptance-criteria IDs and the Technical Design handoff contract, then
produces to Jig's execution-plan contract shape.

## Ground truth — read what your task touches

Altitude: `docs/product/` owns _what & why_; `docs/design/` owns _how_. Product is the contract
design reconciles to; where they conflict, name it rather than silently resolving.

| Task                                           | Read            |
| ---------------------------------------------- | --------------- |
| What this is, who it serves, when to use it    | `docs/product/` |
| How it works (mechanics, decisions, contracts) | `docs/design/`  |

There is intentionally no `src/`, skill pack, schema package, CLI, or runtime in this seed.

## Gate and conventions

- **`pnpm check`** before claiming any change done; show its output as evidence, don't assert
  success. This docs-only repo's gate is lightweight today: Markdown/YAML/JSON formatting through
  Prettier. If this repo adds code later, work is test-driven with at least 90% coverage, aiming for
  95%, and `pnpm check` must include the relevant lint, typecheck, and test gates.
- **`main`-based:** branch from `main`, PR into it, green `check` required, review conversations
  resolved, squash-merge. Conventional commit subjects (`feat:`/`fix:`/`docs:`/…); no attribution
  footers.
- **Setup & worktrees:** `pnpm dev:setup` prepares a checkout (Node check, Corepack, frozen
  install); `pnpm worktree:new <branch>` creates a grouped external worktree at
  `worktrees/design-to-plan/<branch>` and runs setup in it; `pnpm worktree:clean <branch>` removes the
  completed worktree and local branch after merge. Worktrees are **external siblings** of this
  checkout — never nested under the repo root (a nested worktree gets walked by broad globs and its
  duplicate `AGENTS.md` misleads agents). If a repo needs no setup beyond `pnpm install`, drop
  `dev:setup`; keep `worktree:new`, `worktree:clean`, and the external-sibling rule regardless.
- **No emojis** anywhere. **Immutability** — return new values, don't mutate inputs. Handle errors
  explicitly and validate external input at boundaries. Diagrams in Mermaid, inline. No hardcoded
  secrets — credentials via environment only; redact secrets, tokens, and PII in logs; if you find
  an exposed secret, stop and rotate it.

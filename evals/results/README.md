# Eval Results

Eval-kit result bundles are written under this directory. Commit this README and curated summaries
only; transient run directories stay ignored by default.

Manual report bundles may include deterministic grades and pointwise model-judge results copied from
local runs. Treat them as local evidence unless a human reviews and curates a summary. Raw Promptfoo
outputs, provider metadata, candidate text, and generated HTML reports should stay uncommitted.

Read manual pointwise verdicts with the eval-kit `v0.1.5` calibration policy: `partial`, `missing`,
`contradicted`, and `unknown` are non-covered evidence unless a curated design-to-plan note accepts a
non-critical partial. Bad planning/review fixtures are expected to remain adverse on their targeted
defect; pass-like `covered` verdicts there are false-pass risks.

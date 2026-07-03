import fs from "node:fs";
import path from "node:path";

const EXPECTED_ITEMS_SCHEMA_VERSION = "design-to-plan.expected-items.v1";
const POINTWISE_ITEMS_SCHEMA_VERSION = "design-to-plan.pointwise-items.v1";
const POINTWISE_KINDS = new Set([
  "traceability",
  "graph",
  "evidence",
  "scope",
  "review",
  "review-quality",
]);
const POINTWISE_ITEM_FIELDS = new Set([
  "item_id",
  "kind",
  "severity",
  "source_refs",
  "claim",
  "judge_guidance",
]);
const SEVERITIES = new Set(["critical", "high", "medium", "low"]);

const policy = {
  blockingSeverities: new Set(["critical", "high"]),
  blockingVerdicts: new Set(["missing", "contradicted", "invalid"]),
};

const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[‘’‛′']/g, "")
    .replace(/[“”«»"]/g, "")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesNormalized = (text, expected) => {
  const normalizedExpected = normalize(expected);
  return (
    normalizedExpected.length > 0 &&
    ` ${normalize(text)} `.includes(` ${normalizedExpected} `)
  );
};

const firstMissing = (text, snippets = []) =>
  snippets.find((snippet) => !includesNormalized(text, snippet));

const firstPresent = (text, snippets = []) =>
  snippets.find((snippet) => includesNormalized(text, snippet));

const lineSegments = (text) =>
  String(text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const segmentWith = (text, requiredSnippets) =>
  lineSegments(text).find((line) =>
    requiredSnippets.every((snippet) => includesNormalized(line, snippet)),
  );

const asArray = (value, label) => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} must be a non-empty array`);
  }
  return value;
};

const assertString = (value, label) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const expectedItemsFor = (expectedItems, label) => {
  if (expectedItems?.schema_version !== EXPECTED_ITEMS_SCHEMA_VERSION) {
    throw new Error(
      `${label} must use schema_version ${EXPECTED_ITEMS_SCHEMA_VERSION}`,
    );
  }
  const checks = asArray(expectedItems.checks, `${label}.checks`);
  const ids = checks.map((check, index) =>
    assertString(check.id, `${label}.checks[${index}].id`),
  );
  for (const [index, check] of checks.entries()) {
    assertString(check.kind, `${label}.checks[${index}].kind`);
    assertString(check.severity, `${label}.checks[${index}].severity`);
  }
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${label}.checks ids must be unique`);
  }
  return checks;
};

const sanitizePointwiseItem = (item, label) => {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    throw new Error(`${label} must be an object`);
  }
  for (const field of Object.keys(item)) {
    if (!POINTWISE_ITEM_FIELDS.has(field)) {
      throw new Error(`${label}.${field} is not supported`);
    }
  }

  const itemId = assertString(item.item_id, `${label}.item_id`);
  const kind = assertString(item.kind, `${label}.kind`);
  if (!POINTWISE_KINDS.has(kind)) {
    throw new Error(`${label}.kind is unsupported: ${kind}`);
  }
  const severity = assertString(item.severity, `${label}.severity`);
  if (!SEVERITIES.has(severity)) {
    throw new Error(`${label}.severity is unsupported: ${severity}`);
  }
  const sourceRefs = asArray(item.source_refs, `${label}.source_refs`);
  for (const [index, ref] of sourceRefs.entries()) {
    assertString(ref, `${label}.source_refs[${index}]`);
  }

  return {
    item_id: itemId,
    kind,
    severity,
    source_refs: sourceRefs,
    claim: assertString(item.claim, `${label}.claim`),
    judge_guidance: assertString(item.judge_guidance, `${label}.judge_guidance`),
  };
};

const validatePointwiseItems = (pointwiseItems, label) => {
  if (pointwiseItems?.schema_version !== POINTWISE_ITEMS_SCHEMA_VERSION) {
    throw new Error(
      `${label} must use schema_version ${POINTWISE_ITEMS_SCHEMA_VERSION}`,
    );
  }
  const items = asArray(pointwiseItems.items, `${label}.items`).map(
    (item, index) => sanitizePointwiseItem(item, `${label}.items[${index}]`),
  );
  const ids = items.map((item) => item.item_id);
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${label}.items item_id values must be unique`);
  }
  return items;
};

const finding = (check, verdict, evidence) => ({
  id: check.id,
  kind: check.kind ?? "semantic",
  severity: check.severity ?? "medium",
  verdict,
  evidence,
});

const gradeRequiredIds = (candidateText, check) => {
  const missing = firstMissing(candidateText, asArray(check.ids, "ids"));
  return missing
    ? finding(check, "missing", `missing id ${missing}`)
    : finding(check, "covered", `all ids present: ${check.ids.join(", ")}`);
};

const gradeForbiddenSnippets = (candidateText, check) => {
  const forbidden = firstPresent(
    candidateText,
    asArray(check.snippets, "snippets"),
  );
  return forbidden
    ? finding(check, "contradicted", `forbidden snippet present: ${forbidden}`)
    : finding(check, "covered", "no forbidden snippets found");
};

const gradeSegmentCheck = (candidateText, check, snippets, label) => {
  const segment = segmentWith(candidateText, snippets);
  return segment
    ? finding(check, "covered", `${label}: ${segment}`)
    : finding(check, "missing", `no co-located ${label}`);
};

const gradeStoryTrace = (candidateText, check) =>
  gradeSegmentCheck(
    candidateText,
    check,
    [
      assertString(check.story_id, "story_id"),
      ...asArray(check.product_refs, "product_refs"),
      ...asArray(check.design_refs, "design_refs"),
      ...asArray(check.jig_properties, "jig_properties"),
    ],
    `story trace for ${check.story_id}`,
  );

const gradeDependencyEdge = (candidateText, check) =>
  gradeSegmentCheck(
    candidateText,
    check,
    [
      assertString(check.from, "from"),
      assertString(check.to, "to"),
      ...asArray(check.source_refs, "source_refs"),
    ],
    `dependency edge ${check.from} -> ${check.to}`,
  );

const gradeSourceClosure = (candidateText, check) =>
  gradeSegmentCheck(
    candidateText,
    check,
    [
      assertString(check.consumer, "consumer"),
      assertString(check.consumed, "consumed"),
      ...asArray(check.source_refs, "source_refs"),
      assertString(check.closed_by, "closed_by"),
    ],
    `source closure for ${check.consumer}`,
  );

const gradeEvidenceBinding = (candidateText, check) => {
  const concrete = firstPresent(
    candidateText,
    asArray(check.concrete_refs, "concrete_refs"),
  );
  if (!concrete) {
    return finding(
      check,
      "missing",
      `missing concrete evidence ref from ${check.concrete_refs.join(", ")}`,
    );
  }

  return gradeSegmentCheck(
    candidateText,
    check,
    [
      assertString(check.story_id, "story_id"),
      concrete,
      ...asArray(check.proves_product_refs, "proves_product_refs"),
      ...asArray(check.proves_design_refs, "proves_design_refs"),
    ],
    `evidence binding for ${check.story_id}`,
  );
};

const gradeStopAttribution = (candidateText, check) => {
  const required = [
    "stop",
    assertString(check.owner, "owner"),
    assertString(check.failure_class, "failure_class"),
    ...asArray(check.source_ids, "source_ids"),
    ...(check.must_include_all ?? []),
  ];
  const missing = firstMissing(candidateText, required);
  if (missing) {
    return finding(check, "missing", `stop result missing ${missing}`);
  }

  const emittedPlanSnippet = firstPresent(candidateText, [
    "Plan ID",
    "Story Set",
    "Dependency and Eligibility Model",
  ]);
  if (check.must_not_emit_plan === true && emittedPlanSnippet) {
    return finding(
      check,
      "contradicted",
      `stop result emitted plan section: ${emittedPlanSnippet}`,
    );
  }

  return finding(
    check,
    "covered",
    `stop names ${check.source_ids.join(", ")} and ${check.owner}`,
  );
};

const gradeReviewFindings = (candidateText, check) => {
  const missingFinding = asArray(check.findings, "findings").find(
    (expected, index) => {
      const snippets = [
        assertString(expected.defect_id, `findings[${index}].defect_id`),
        assertString(expected.requirement, `findings[${index}].requirement`),
        ...(expected.source_refs ?? []),
        ...(expected.must_include_all ?? []),
      ];
      return !segmentWith(candidateText, snippets);
    },
  );

  if (missingFinding) {
    return finding(
      check,
      "missing",
      `missing review finding ${missingFinding.defect_id}`,
    );
  }

  return finding(check, "covered", "all expected review findings present");
};

const gradeCheck = (candidateText, check) => {
  switch (assertString(check.mode, `${check.id}.mode`)) {
    case "required_ids":
      return gradeRequiredIds(candidateText, check);
    case "forbidden_snippets":
      return gradeForbiddenSnippets(candidateText, check);
    case "story_trace":
      return gradeStoryTrace(candidateText, check);
    case "dependency_edge":
      return gradeDependencyEdge(candidateText, check);
    case "source_closure":
      return gradeSourceClosure(candidateText, check);
    case "evidence_binding":
      return gradeEvidenceBinding(candidateText, check);
    case "stop_attribution":
      return gradeStopAttribution(candidateText, check);
    case "review_findings":
      return gradeReviewFindings(candidateText, check);
    default:
      throw new Error(`Unsupported check mode: ${check.mode}`);
  }
};

const aggregateVerdict = (findings) => {
  const hasBlocker = findings.some(
    (item) =>
      policy.blockingSeverities.has(item.severity) &&
      policy.blockingVerdicts.has(item.verdict),
  );
  if (hasBlocker) return "red";
  return findings.every((item) => item.verdict === "covered")
    ? "green"
    : "yellow";
};

export const gradeCandidate = ({ candidateText, expectedItems }) => {
  const checks = expectedItemsFor(expectedItems, "expectedItems");
  const findings = checks.map((check) => gradeCheck(candidateText, check));

  return {
    findings,
    verdict: aggregateVerdict(findings),
  };
};

export const renderDeterministicReport = ({ caseId, grades, findings }) =>
  [
    `# Eval Report: ${caseId}`,
    "",
    `Verdict: ${grades.verdict}`,
    "",
    ...findings.map(
      (item) =>
        `- ${item.id} (${item.kind}, ${item.severity}): ${item.verdict} - ${item.evidence}`,
    ),
  ].join("\n");

const validateNoBlankStrings = (value, label, failures) => {
  if (typeof value === "string") {
    if (value.trim().length === 0) {
      failures.push(`${label} must not be blank`);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      validateNoBlankStrings(item, `${label}[${index}]`, failures);
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      validateNoBlankStrings(item, `${label}.${key}`, failures);
    }
  }
};

const validateCheckShape = (check, label, failures) => {
  try {
    assertString(check.id, `${label}.id`);
    assertString(check.mode, `${label}.mode`);
    assertString(check.kind, `${label}.kind`);
    assertString(check.severity, `${label}.severity`);
  } catch (error) {
    failures.push(error.message);
    return;
  }

  const requiredByMode = {
    required_ids: ["ids"],
    forbidden_snippets: ["snippets"],
    story_trace: ["story_id", "product_refs", "design_refs", "jig_properties"],
    dependency_edge: ["from", "to", "source_refs"],
    source_closure: ["consumer", "consumed", "source_refs", "closed_by"],
    evidence_binding: [
      "story_id",
      "concrete_refs",
      "proves_product_refs",
      "proves_design_refs",
    ],
    stop_attribution: ["source_ids", "owner", "failure_class"],
    review_findings: ["findings"],
  };
  const required = requiredByMode[check.mode];
  if (!required) {
    failures.push(`${label}.mode is unsupported: ${check.mode}`);
    return;
  }

  for (const field of required) {
    if (!(field in check)) {
      failures.push(`${label}.${field} is required for mode ${check.mode}`);
    }
  }
};

const artifactFor = (artifacts, role, label) => {
  const matches = artifacts.filter((artifact) => artifact.role === role);
  if (matches.length !== 1) {
    throw new Error(`${label} must define exactly one ${role} artifact`);
  }
  return matches[0];
};

const readArtifactText = ({ resolver, caseDir, artifact }) => {
  const caseRelative = resolver.relativeToRepo(caseDir);
  return fs.readFileSync(
    path.resolve(resolver.repoRoot, caseRelative, artifact.path),
    "utf8",
  );
};

export const resolvePointwiseVars = async ({
  caseId,
  caseDir,
  artifacts,
  candidateContent,
  candidatePath,
  promptVersion,
  rubricVersion,
  model,
  provider,
  resolver,
}) => {
  const caseRelative = resolver.relativeToRepo(caseDir);
  const sourceArtifacts = artifacts.filter(
    (artifact) => artifact.role === "generation_visible",
  );
  const sourceMaterial = sourceArtifacts
    .map((artifact) =>
      [
        `# ${artifact.path}`,
        "",
        readArtifactText({ resolver, caseDir, artifact }),
      ].join("\n"),
    )
    .join("\n\n");
  const rubric = readArtifactText({
    resolver,
    caseDir,
    artifact: artifactFor(artifacts, "rubric", caseRelative),
  });
  const pointwiseItemsPath = path.resolve(
    resolver.repoRoot,
    caseRelative,
    artifactFor(artifacts, "pointwise_expected_items", caseRelative).path,
  );
  const expectedItems = validatePointwiseItems(
    readJson(pointwiseItemsPath),
    pointwiseItemsPath,
  );

  return {
    case_id: caseId,
    model,
    provider,
    prompt_version: promptVersion,
    rubric_version: rubricVersion,
    source_material: sourceMaterial,
    case_rubric: rubric,
    expected_items: JSON.stringify(expectedItems, null, 2),
    candidate_path: resolver.relativeToRepo(candidatePath),
    candidate: candidateContent,
    _expectedItemsForCanonicalization: expectedItems,
  };
};

export const canonicalizeExpectedItemMetadata = (
  actualItems,
  expectedItems,
) => {
  const actualById = new Map(actualItems.map((item) => [item.item_id, item]));
  const actualIds = actualItems.map((item) => item.item_id).sort();
  const expectedIds = expectedItems.map((item) => item.item_id).sort();
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    throw new Error(
      `pointwise result item_ids mismatch: expected ${JSON.stringify(expectedIds)}, received ${JSON.stringify(actualIds)}`,
    );
  }

  return expectedItems.map((expected) => ({
    ...actualById.get(expected.item_id),
    kind: expected.kind,
    severity: expected.severity,
    source_refs: expected.source_refs,
  }));
};

const readReportJson = (filePath, label) => {
  try {
    return readJson(filePath);
  } catch (error) {
    throw new Error(`failed to read ${label}: ${error.message}`);
  }
};

const readReportText = (filePath, label) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    throw new Error(`failed to read ${label}: ${error.message}`);
  }
};

const writeReportJson = (filePath, value) => {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

export const compileReport = async ({ runs, resultDir, resolver }) => {
  if (runs["judge-coverage"] && !runs.deterministic) {
    throw new Error(
      "manual reports with pointwise judge evidence must include a deterministic run",
    );
  }

  const reportParts = [
    "# Manual Eval Report",
    "",
    "Deterministic evals remain authoritative. Model-judge results are manual, advisory evidence and cannot upgrade deterministic red or yellow results.",
    "",
  ];
  const caseIds = new Set();
  const artifacts = [];
  const outputFiles = [];

  if (runs.deterministic) {
    const deterministicDir = resolver.resolveRunDir(runs.deterministic);
    const grades = readReportJson(
      path.join(deterministicDir, "grades.json"),
      "deterministic grades",
    );
    const report = readReportText(
      path.join(deterministicDir, "report.md"),
      "deterministic report",
    );
    if (grades.case_id) caseIds.add(grades.case_id);

    reportParts.push(
      "## Deterministic Verdict",
      "",
      `- Run: ${runs.deterministic}`,
      `- Case: ${grades.case_id ?? "unknown"}`,
      `- Verdict: ${grades.verdict ?? "unknown"}`,
      "",
      report.trim(),
      "",
    );

    writeReportJson(path.join(resultDir, "deterministic-grades.json"), grades);
    artifacts.push({
      role: "deterministic_grades",
      path: "deterministic-grades.json",
      mediaType: "application/json",
    });
    outputFiles.push("deterministic-grades.json");
  } else {
    reportParts.push(
      "## Deterministic Verdict",
      "",
      "No deterministic run was included. Do not use this report to interpret model-judge evidence.",
      "",
    );
  }

  if (runs["judge-coverage"]) {
    const pointwiseDir = resolver.resolveRunDir(runs["judge-coverage"]);
    const pointwiseResult = readReportJson(
      path.join(pointwiseDir, "pointwise-result.json"),
      "pointwise result",
    );
    const pointwiseReport = readReportText(
      path.join(pointwiseDir, "report.md"),
      "pointwise report",
    );
    if (pointwiseResult.case_id) caseIds.add(pointwiseResult.case_id);
    const verdictCounts = Object.entries(
      (pointwiseResult.items ?? []).reduce(
        (counts, item) => ({
          ...counts,
          [item.verdict]: (counts[item.verdict] ?? 0) + 1,
        }),
        {},
      ),
    )
      .map(([verdict, count]) => `${verdict}: ${count}`)
      .join(", ");

    reportParts.push(
      "## Advisory Pointwise Judge",
      "",
      `- Run: ${runs["judge-coverage"]}`,
      `- Case: ${pointwiseResult.case_id ?? "unknown"}`,
      `- Item verdicts: ${verdictCounts || "none"}`,
      "",
      "This section is calibration evidence only. It cannot override deterministic blockers.",
      "",
      pointwiseReport.trim(),
      "",
    );

    writeReportJson(
      path.join(resultDir, "pointwise-result.json"),
      pointwiseResult,
    );
    artifacts.push({
      role: "pointwise_judge_result",
      path: "pointwise-result.json",
      mediaType: "application/json",
    });
    outputFiles.push("pointwise-result.json");
  }

  return {
    reportContent: reportParts.join("\n"),
    caseIds: [...caseIds],
    artifacts,
    outputFiles,
  };
};

export const validateFixtures = async ({ manifests }) => {
  const failures = [];
  const expectedManifestSchema = "eval-kit.case.v1";
  const requiredRoles = new Set([
    "generation_visible",
    "grader_input",
    "candidate_good",
    "candidate_bad",
    "rubric",
    "provenance",
  ]);

  for (const item of manifests) {
    const manifest = item.manifest;
    const caseDir = path.dirname(item.fullPath);
    const label = item.relativePath;

    if (manifest.schema_version !== expectedManifestSchema) {
      failures.push(
        `${label} must use schema_version ${expectedManifestSchema}`,
      );
    }

    const roles = new Set(manifest.artifacts.map((artifact) => artifact.role));
    for (const role of requiredRoles) {
      if (!roles.has(role)) {
        failures.push(`${label} is missing ${role} artifact`);
      }
    }

    const graderInputs = manifest.artifacts.filter(
      (artifact) => artifact.role === "grader_input",
    );
    const pointwiseInputs = manifest.artifacts.filter(
      (artifact) => artifact.role === "pointwise_expected_items",
    );
    if (graderInputs.length !== 1) {
      failures.push(`${label} must define exactly one grader_input artifact`);
    }
    if (pointwiseInputs.length > 1) {
      failures.push(
        `${label} must define at most one pointwise_expected_items artifact`,
      );
    }

    for (const artifact of manifest.artifacts) {
      const artifactPath = path.resolve(caseDir, artifact.path);
      if (
        artifactPath !== caseDir &&
        !artifactPath.startsWith(`${caseDir}${path.sep}`)
      ) {
        failures.push(`${label} artifact escapes case dir: ${artifact.path}`);
        continue;
      }
      if (!fs.existsSync(artifactPath)) {
        failures.push(`${label} missing artifact file: ${artifact.path}`);
      }
    }

    for (const artifact of graderInputs) {
      const artifactPath = path.resolve(caseDir, artifact.path);
      if (!fs.existsSync(artifactPath)) continue;

      try {
        const expectedItems = readJson(artifactPath);
        const checks = expectedItemsFor(expectedItems, artifactPath);
        validateNoBlankStrings(expectedItems, artifactPath, failures);
        for (const [index, check] of checks.entries()) {
          validateCheckShape(
            check,
            `${artifactPath}.checks[${index}]`,
            failures,
          );
        }
      } catch (error) {
        failures.push(`${artifactPath}: ${error.message}`);
      }
    }

    for (const artifact of pointwiseInputs) {
      const artifactPath = path.resolve(caseDir, artifact.path);
      if (!fs.existsSync(artifactPath)) continue;

      try {
        const pointwiseItems = readJson(artifactPath);
        validatePointwiseItems(pointwiseItems, artifactPath);
        validateNoBlankStrings(pointwiseItems, artifactPath, failures);
      } catch (error) {
        failures.push(`${artifactPath}: ${error.message}`);
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(`Fixture validation failed:\n- ${failures.join("\n- ")}`);
  }
};

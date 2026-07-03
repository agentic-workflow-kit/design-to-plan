import fs from "node:fs";
import path from "node:path";

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

const expectedItemsFor = (expectedItems, label) => {
  if (expectedItems?.schema_version !== "design-to-plan.expected-items.v1") {
    throw new Error(
      `${label} must use schema_version design-to-plan.expected-items.v1`,
    );
  }
  const checks = asArray(expectedItems.checks, `${label}.checks`);
  const ids = checks.map((check, index) =>
    assertString(check.id, `${label}.checks[${index}].id`),
  );
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${label}.checks ids must be unique`);
  }
  return checks;
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

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

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
    if (graderInputs.length !== 1) {
      failures.push(`${label} must define exactly one grader_input artifact`);
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
  }

  if (failures.length > 0) {
    throw new Error(`Fixture validation failed:\n- ${failures.join("\n- ")}`);
  }
};

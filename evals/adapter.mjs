import fs from "node:fs";
import path from "node:path";

const expectedItemsFor = (expectedItems, label) => {
  if (
    !Array.isArray(expectedItems?.items) ||
    expectedItems.items.length === 0
  ) {
    throw new Error(`${label} must define a non-empty items array`);
  }
  return expectedItems.items;
};

export const gradeCandidate = ({ candidateText, expectedItems }) => {
  const items = expectedItemsFor(expectedItems, "expectedItems");
  const findings = items.map((item) => {
    const requiredText = item.required_text ?? "";
    const covered =
      requiredText.length > 0 && candidateText.includes(requiredText);
    return {
      id: item.id,
      kind: item.kind ?? "generic",
      severity: item.severity ?? "medium",
      verdict: covered ? "covered" : "missing",
      evidence: covered
        ? `found ${requiredText}`
        : `missing ${requiredText || item.id}`,
    };
  });

  return {
    findings,
    verdict: findings.every((finding) => finding.verdict === "covered")
      ? "green"
      : "red",
  };
};

export const renderDeterministicReport = ({ caseId, grades, findings }) =>
  [
    `# Eval Report: ${caseId}`,
    "",
    `Verdict: ${grades.verdict}`,
    "",
    ...findings.map(
      (finding) =>
        `- ${finding.id} (${finding.kind}, ${finding.severity}): ${finding.verdict} - ${finding.evidence}`,
    ),
  ].join("\n");

export const validateFixtures = async ({ manifests }) => {
  for (const item of manifests) {
    const graderInputs = item.manifest.artifacts.filter(
      (artifact) => artifact.role === "grader_input",
    );
    if (graderInputs.length === 0) {
      throw new Error(
        `${item.relativePath} is missing a grader_input artifact`,
      );
    }

    for (const artifact of graderInputs) {
      const artifactPath = path.resolve(
        path.dirname(item.fullPath),
        artifact.path,
      );
      const expectedItems = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      expectedItemsFor(expectedItems, artifactPath);
    }
  }
};

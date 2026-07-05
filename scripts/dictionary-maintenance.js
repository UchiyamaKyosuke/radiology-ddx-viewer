const { execFileSync } = require("child_process");
const path = require("path");
const {
  ROOT,
  DATA,
  readJson,
  writeJson,
  loadDictionaries
} = require("./lib");

function run(script, args = []) {
  execFileSync(process.execPath, [path.join(ROOT, "scripts", script), ...args], {
    cwd: ROOT,
    stdio: "inherit"
  });
}

run("extract-concept-candidates.js");

const candidatesPath = path.join(DATA, "dictionaries", "new-concept-candidates.json");
const candidates = readJson(candidatesPath).candidates || [];
const dictionaries = loadDictionaries();
const pending = candidates.filter((item) => item.status === "pending");

const report = {
  generated_at: new Date().toISOString(),
  total_concepts: Object.keys(dictionaries.findingConcepts).length,
  pending_candidates: pending.length,
  candidates: pending.map((candidate) => ({
    candidate_id: candidate.candidate_id,
    proposed_concept_id: candidate.proposed_concept_id,
    canonical_label: candidate.canonical_label,
    feature: candidate.feature,
    allowed_modalities: candidate.allowed_modalities,
    allowed_acquisitions: candidate.allowed_acquisitions,
    example_count: candidate.examples?.length || 0,
    examples: (candidate.examples || []).slice(0, 5),
    existing_concept_suggestions: candidate.existing_concept_suggestions || []
  }))
};

const reportPath = path.join(DATA, "dictionaries", "dictionary-maintenance-report.json");
writeJson(reportPath, report);

console.log(`Dictionary maintenance report: ${path.relative(ROOT, reportPath)}`);
console.log(`Pending candidates: ${pending.length}`);

run("validate.js");
run("build-index.js");

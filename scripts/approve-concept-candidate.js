const path = require("path");
const {
  DATA,
  readJson,
  writeJson
} = require("./lib");

const candidateId = String(process.argv[2] || "").trim();
function fail(message, details = []) {
  console.error(`ERROR: ${message}`);
  for (const detail of details) console.error(`- ${detail}`);
  process.exit(1);
}

if (!candidateId) {
  fail("Missing candidate_id.", ["Usage: node scripts/approve-concept-candidate.js <candidate_id>"]);
}

const conceptsPath = path.join(DATA, "dictionaries", "finding-concepts.json");
const candidatesPath = path.join(DATA, "dictionaries", "new-concept-candidates.json");
const concepts = readJson(conceptsPath);
const candidateData = readJson(candidatesPath);
const candidate = (candidateData.candidates || []).find((item) => item.candidate_id === candidateId);

if (!candidate) {
  fail(`Candidate not found: ${candidateId}`, [`File: ${candidatesPath}`]);
}
if (candidate.status === "rejected") {
  fail(`Candidate is rejected: ${candidateId}`, ["Unreject or create a new candidate before approving."]);
}

const required = [];
if (!candidate.proposed_concept_id) required.push("proposed_concept_id");
if (!candidate.canonical_label?.ja && !candidate.canonical_label?.en) required.push("canonical_label.ja or canonical_label.en");
if (!candidate.feature) required.push("feature");
if (!Array.isArray(candidate.allowed_modalities)) required.push("allowed_modalities[]");
if (!Array.isArray(candidate.allowed_acquisitions)) required.push("allowed_acquisitions[]");
if (!candidate.default_polarity) required.push("default_polarity");
if (!candidate.synonyms) required.push("synonyms");
if (!Array.isArray(candidate.tokens)) required.push("tokens[]");
if (required.length) {
  fail(`Candidate is incomplete: ${candidateId}`, required.map((field) => `Missing or invalid: ${field}`));
}

if (concepts[candidate.proposed_concept_id]) {
  if (candidate.status === "approved") {
    console.log(`Already approved ${candidateId} -> ${candidate.proposed_concept_id}`);
    process.exit(0);
  }
  fail(`Concept already exists: ${candidate.proposed_concept_id}`, [
    "Use an existing concept instead, or edit proposed_concept_id before approving."
  ]);
}

concepts[candidate.proposed_concept_id] = {
  canonical_label: candidate.canonical_label,
  feature: candidate.feature,
  allowed_modalities: candidate.allowed_modalities,
  allowed_acquisitions: candidate.allowed_acquisitions,
  default_polarity: candidate.default_polarity,
  default_modifiers: candidate.default_modifiers,
  synonyms: candidate.synonyms,
  tokens: candidate.tokens
};

candidate.status = "approved";
candidate.approved_at = new Date().toISOString();
candidate.approved_concept_id = candidate.proposed_concept_id;

writeJson(conceptsPath, concepts);
writeJson(candidatesPath, candidateData);
console.log(`Approved ${candidateId} -> ${candidate.proposed_concept_id}`);

const path = require("path");
const { DATA, readJson, writeJson } = require("./lib");

const candidateId = String(process.argv[2] || "").trim();
const note = process.argv.slice(3).join(" ");
function fail(message, details = []) {
  console.error(`ERROR: ${message}`);
  for (const detail of details) console.error(`- ${detail}`);
  process.exit(1);
}

if (!candidateId) {
  fail("Missing candidate_id.", ["Usage: node scripts/reject-concept-candidate.js <candidate_id> [note]"]);
}

const candidatesPath = path.join(DATA, "dictionaries", "new-concept-candidates.json");
const candidateData = readJson(candidatesPath);
const candidate = (candidateData.candidates || []).find((item) => item.candidate_id === candidateId);

if (!candidate) {
  fail(`Candidate not found: ${candidateId}`, [`File: ${candidatesPath}`]);
}

if (candidate.status === "approved") {
  fail(`Candidate is already approved: ${candidateId}`, ["Do not reject an approved concept candidate automatically."]);
}

candidate.status = "rejected";
candidate.rejected_at = new Date().toISOString();
candidate.reject_note = note || "";

writeJson(candidatesPath, candidateData);
console.log(`Rejected ${candidateId}`);

const fs = require("fs");
const path = require("path");
const { DATA, readJson, writeJson, hashObject, iterFindings } = require("./lib");

const diseaseId = String(process.argv[2] || "").trim();
function fail(message, details = []) {
  console.error(`ERROR: ${message}`);
  for (const detail of details) console.error(`- ${detail}`);
  process.exit(1);
}

if (!diseaseId) {
  fail("Missing disease_id.", ["Usage: node scripts/approve-draft.js <disease_id>"]);
}

if (!/^[a-zA-Z0-9_.:-]+$/.test(diseaseId)) {
  fail(`Invalid disease_id: ${diseaseId}`, ["Allowed characters: a-z A-Z 0-9 _ . : -"]);
}

const draftPath = path.join(DATA, "drafts", `${diseaseId}.json`);
const approvedPath = path.join(DATA, "diseases", `${diseaseId}.json`);

if (!fs.existsSync(draftPath)) {
  if (fs.existsSync(approvedPath)) {
    console.log(`Already approved: ${diseaseId}`);
    process.exit(0);
  }
  fail(`Draft not found: ${diseaseId}`, [`Expected: ${draftPath}`]);
}
if (fs.existsSync(approvedPath)) {
  fail(`Approved card already exists: ${diseaseId}`, [
    `Draft path: ${draftPath}`,
    `Approved path: ${approvedPath}`,
    "Resolve manually before approving to avoid overwriting reviewed data."
  ]);
}

const card = readJson(draftPath);
if (card.disease_id !== diseaseId) {
  fail("Card disease_id does not match file name.", [
    `File name: ${diseaseId}`,
    `Card disease_id: ${card.disease_id || "(missing)"}`
  ]);
}
card.review = {
  ...(card.review || {}),
  status: "approved",
  reviewed_at: new Date().toISOString()
};
for (const { finding } of iterFindings(card)) {
  finding.review_status = "approved";
}
card.updated_at = new Date().toISOString();
card.content_hash = hashObject({ ...card, content_hash: "" });

writeJson(approvedPath, card);
fs.unlinkSync(draftPath);
console.log(`Approved draft: ${diseaseId}`);

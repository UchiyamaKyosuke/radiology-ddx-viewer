const { loadDiseaseCards, iterFindings, writeJson, hashObject } = require("./lib");

let changedCards = 0;
let changedFindings = 0;

for (const { filePath, card } of loadDiseaseCards()) {
  if (card.review?.status !== "approved") continue;

  let changed = false;
  for (const { finding } of iterFindings(card)) {
    if (finding.review_status !== "approved") {
      finding.review_status = "approved";
      changed = true;
      changedFindings += 1;
    }
  }

  if (!changed) continue;
  card.updated_at = new Date().toISOString();
  card.content_hash = hashObject({ ...card, content_hash: "" });
  writeJson(filePath, card);
  changedCards += 1;
  console.log(`Updated approved finding statuses: ${card.disease_id}`);
}

console.log(`Fixed ${changedFindings} findings in ${changedCards} approved cards.`);

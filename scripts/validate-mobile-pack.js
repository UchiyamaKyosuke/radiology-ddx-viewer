const fs = require("fs");
const path = require("path");
const { hashObject } = require("./lib");

const packPath = process.argv[2];
if (!packPath) {
  console.error("Usage: node scripts/validate-mobile-pack.js <pack.json>");
  process.exit(1);
}

const resolved = path.resolve(packPath);
let pack;
try {
  if (!fs.existsSync(resolved)) {
    throw new Error(`File does not exist: ${resolved}`);
  }
  pack = JSON.parse(fs.readFileSync(resolved, "utf8"));
} catch (error) {
  console.error("Could not read mobile pack.");
  console.error(error && error.stack ? error.stack : error.message);
  process.exit(1);
}
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(pack.manifest?.pack_type === "radiology-ddx-mobile-pack", "Invalid pack_type");
assert(pack.manifest?.pack_schema_version, "Missing pack_schema_version");
assert(pack.manifest?.min_viewer_version, "Missing min_viewer_version");
assert(pack.manifest?.content_hash, "Missing content_hash");
assert(pack.payload, "Missing payload");
assert(pack.payload?.dictionaries?.findingConcepts, "Missing finding concepts");
assert(Array.isArray(pack.payload?.searchIndex), "Missing searchIndex array");
assert(Array.isArray(pack.payload?.summaryIndex), "Missing summaryIndex array");
assert(Array.isArray(pack.payload?.diseaseChunks), "Missing diseaseChunks array");
assert(pack.payload?.differentialGraph?.edges, "Missing differentialGraph.edges");
assert(pack.payload?.imageManifest?.assets, "Missing imageManifest.assets");

if (pack.payload) {
  const actualHash = hashObject(pack.payload);
  assert(actualHash === pack.manifest.content_hash, `Content hash mismatch: ${actualHash} != ${pack.manifest.content_hash}`);

  const diseaseIds = new Set();
  for (const chunk of pack.payload.diseaseChunks || []) {
    assert(chunk.chunk_id, "Disease chunk without chunk_id");
    assert(Array.isArray(chunk.items), `Disease chunk ${chunk.chunk_id} has no items`);
    for (const card of chunk.items || []) {
      assert(card.disease_id, `Card without disease_id in ${chunk.chunk_id}`);
      if (diseaseIds.has(card.disease_id)) errors.push(`Duplicate disease_id: ${card.disease_id}`);
      diseaseIds.add(card.disease_id);
    }
  }

  for (const item of pack.payload.searchIndex || []) {
    assert(diseaseIds.has(item.disease_id), `Search index references missing disease: ${item.disease_id}`);
    assert(pack.payload.dictionaries.findingConcepts[item.finding_code], `Search index references missing concept: ${item.finding_code}`);
  }
}

if (errors.length) {
  console.error("Mobile pack validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  console.error(`Pack path: ${resolved}`);
  process.exit(1);
}

console.log(`Mobile pack validation passed: ${resolved}`);
console.log(`Diseases: ${pack.manifest.counts?.diseases ?? "unknown"}`);
console.log(`Searchable findings: ${pack.manifest.counts?.searchable_findings ?? "unknown"}`);

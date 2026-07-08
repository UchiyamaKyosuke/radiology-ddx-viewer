const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { hashObject } = require("./lib");

const packPath = process.argv[2];
if (!packPath) {
  console.error("Usage: node scripts/validate-mobile-pack.js <pack.zip>");
  process.exit(1);
}

const resolved = path.resolve(packPath);
let pack;
function readZipEntries(filePath) {
  const buffer = fs.readFileSync(filePath);
  const entries = new Map();
  let endOffset = -1;
  for (let i = buffer.length - 22; i >= 0 && i >= buffer.length - 65558; i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      endOffset = i;
      break;
    }
  }
  if (endOffset < 0) throw new Error("ZIP end of central directory not found");
  const total = buffer.readUInt16LE(endOffset + 10);
  let offset = buffer.readUInt32LE(endOffset + 16);
  for (let i = 0; i < total; i += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error("Invalid ZIP central directory");
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");

    if (buffer.readUInt32LE(localOffset) !== 0x04034b50) throw new Error(`Invalid ZIP local header: ${name}`);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    let data;
    if (method === 0) data = compressed;
    else if (method === 8) data = zlib.inflateRawSync(compressed);
    else throw new Error(`Unsupported ZIP compression method ${method}: ${name}`);
    entries.set(name, data.toString("utf8"));
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function jsonEntry(entries, name) {
  if (!entries.has(name)) throw new Error(`Missing ZIP entry: ${name}`);
  return JSON.parse(entries.get(name));
}

try {
  if (!fs.existsSync(resolved)) {
    throw new Error(`File does not exist: ${resolved}`);
  }
  if (resolved.toLowerCase().endsWith(".zip")) {
    const entries = readZipEntries(resolved);
    const manifest = jsonEntry(entries, "manifest.json");
    const diseaseChunks = [...entries.keys()]
      .filter((name) => name.startsWith("diseases/") && name.endsWith(".json"))
      .sort()
      .map((name) => jsonEntry(entries, name));
    pack = {
      manifest,
      payload: {
        dictionaries: jsonEntry(entries, "dictionaries.json"),
        searchIndex: jsonEntry(entries, "search-index.json"),
        summaryIndex: jsonEntry(entries, "summary-index.json"),
        differentialGraph: jsonEntry(entries, "differential-graph.json"),
        diseaseChunks,
        imageManifest: jsonEntry(entries, "image-manifest.json")
      }
    };
  } else {
    pack = JSON.parse(fs.readFileSync(resolved, "utf8"));
  }
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

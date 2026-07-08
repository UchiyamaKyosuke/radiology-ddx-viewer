const fs = require("fs");
const path = require("path");
const {
  ROOT,
  DATA,
  readJson,
  writeJson,
  loadDictionaries,
  loadDiseaseCards,
  loadDraftCards,
  hashObject
} = require("./lib");

const EXPORT_DIR = path.join(ROOT, "exports", "mobile");
const VIEWER_DIR = path.join(EXPORT_DIR, "viewer");
const PACK_PATH = path.join(EXPORT_DIR, "radiology-ddx-pack.zip");
const PACK_SCHEMA_VERSION = "1.0";
const MIN_VIEWER_VERSION = "1.0.0";
const CHUNK_SIZE = 100;
const MOBILE_RELATED_EDGES_PER_DISEASE = 8;
const MOBILE_SHARED_FINDINGS_PER_EDGE = 5;

function rel(filePath) {
  return path.relative(ROOT, filePath);
}

function step(label, fn) {
  const started = Date.now();
  console.log(`[export] ${label}`);
  try {
    const value = fn();
    console.log(`[export:ok] ${label} (${Date.now() - started} ms)`);
    return value;
  } catch (error) {
    error.message = `${label}: ${error.message}`;
    throw error;
  }
}

function ensureBuiltFile(name) {
  const filePath = path.join(DATA, "generated", name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing generated file: ${rel(filePath)}. Run scripts/build-index.js first.`);
  }
  try {
    return readJson(filePath);
  } catch (error) {
    throw new Error(`Could not read generated JSON ${rel(filePath)}: ${error.message}`);
  }
}

function copyViewerFile(name) {
  const src = path.join(ROOT, "web", name);
  const dest = path.join(VIEWER_DIR, name);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing viewer source file: ${rel(src)}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  const sourceSize = fs.statSync(src).size;
  const destSize = fs.statSync(dest).size;
  if (sourceSize !== destSize) {
    throw new Error(`Viewer file copy size mismatch for ${name}: source ${sourceSize}, destination ${destSize}`);
  }
}

function chunkCards(cards) {
  const chunks = [];
  for (let i = 0; i < cards.length; i += CHUNK_SIZE) {
    const items = cards.slice(i, i + CHUNK_SIZE);
    chunks.push({
      chunk_id: `diseases-${String(chunks.length + 1).padStart(4, "0")}`,
      disease_ids: items.map((card) => card.disease_id),
      items
    });
  }
  return chunks;
}

function packSizeBytes(value) {
  return Buffer.byteLength(JSON.stringify(value), "utf8");
}

function buildMobileDifferentialGraph(graph) {
  const selected = new Map();
  const ranked = [...(graph.edges || [])]
    .sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0));

  const counts = new Map();
  for (const edge of ranked) {
    const source = edge.source_disease_id;
    const target = edge.target_disease_id;
    const sourceCount = counts.get(source) || 0;
    const targetCount = counts.get(target) || 0;
    if (sourceCount >= MOBILE_RELATED_EDGES_PER_DISEASE || targetCount >= MOBILE_RELATED_EDGES_PER_DISEASE) continue;

    const compactEdge = {
      source_disease_id: source,
      target_disease_id: target,
      relationship: edge.relationship,
      similarity_score: edge.similarity_score,
      shared_findings: (edge.shared_findings || [])
        .slice(0, MOBILE_SHARED_FINDINGS_PER_EDGE)
        .map((item) => ({
          finding_code: item.finding_code,
          canonical_label: item.canonical_label,
          weight: item.weight
        }))
    };
    selected.set(`${source}::${target}`, compactEdge);
    counts.set(source, sourceCount + 1);
    counts.set(target, targetCount + 1);
  }

  return {
    graph_version: graph.graph_version,
    generated_at: graph.generated_at,
    mobile_pruned: true,
    mobile_prune_policy: {
      related_edges_per_disease: MOBILE_RELATED_EDGES_PER_DISEASE,
      shared_findings_per_edge: MOBILE_SHARED_FINDINGS_PER_EDGE,
      original_edges: (graph.edges || []).length
    },
    nodes: graph.nodes || [],
    edges: Array.from(selected.values()).sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0))
  };
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

function writeZipStore(filePath, entries) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const chunks = [];
  const central = [];
  let offset = 0;
  const stamp = dosDateTime();

  for (const entry of entries) {
    const name = Buffer.from(entry.name.replace(/\\/g, "/"), "utf8");
    const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(String(entry.data), "utf8");
    const checksum = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(stamp.time, 10);
    local.writeUInt16LE(stamp.day, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, name, data);

    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(20, 6);
    header.writeUInt16LE(0x0800, 8);
    header.writeUInt16LE(0, 10);
    header.writeUInt16LE(stamp.time, 12);
    header.writeUInt16LE(stamp.day, 14);
    header.writeUInt32LE(checksum, 16);
    header.writeUInt32LE(data.length, 20);
    header.writeUInt32LE(data.length, 24);
    header.writeUInt16LE(name.length, 28);
    header.writeUInt16LE(0, 30);
    header.writeUInt16LE(0, 32);
    header.writeUInt16LE(0, 34);
    header.writeUInt16LE(0, 36);
    header.writeUInt32LE(0, 38);
    header.writeUInt32LE(offset, 42);
    central.push(header, name);
    offset += local.length + name.length + data.length;
  }

  const centralOffset = offset;
  const centralSize = central.reduce((sum, chunk) => sum + chunk.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(centralOffset, 16);
  end.writeUInt16LE(0, 20);

  fs.writeFileSync(filePath, Buffer.concat([...chunks, ...central, end]));
}

function jsonEntry(name, value) {
  return { name, data: JSON.stringify(value) };
}

try {
  const dictionaries = step("Load dictionaries", () => loadDictionaries());
  const searchIndex = step("Load generated search-index.json", () => ensureBuiltFile("search-index.json"));
  const summaryIndex = step("Load generated disease-summary-index.json", () => ensureBuiltFile("disease-summary-index.json"));
  const differentialGraph = step("Load generated differential-graph.json", () => ensureBuiltFile("differential-graph.json"));
  const mobileDifferentialGraph = step("Prune mobile differential graph", () => buildMobileDifferentialGraph(differentialGraph));
  const diseaseCards = step("Load disease and draft cards", () => [...loadDiseaseCards(), ...loadDraftCards()]
    .map(({ card, sourceType }) => ({
      ...card,
      source_type: sourceType === "disease" ? "approved" : "draft"
    }))
    .sort((a, b) => a.disease_id.localeCompare(b.disease_id)));

  const diseaseChunks = step("Chunk disease cards", () => chunkCards(diseaseCards));
  const payload = step("Build mobile payload", () => ({
    dictionaries: {
      findingConcepts: dictionaries.findingConcepts,
      synonymMap: dictionaries.synonymMap,
      sequenceMap: dictionaries.sequenceMap,
      phaseMap: dictionaries.phaseMap,
      anatomyMap: dictionaries.anatomyMap,
      targetMap: dictionaries.targetMap,
      modifierMap: dictionaries.modifierMap,
      frequencyScale: dictionaries.frequencyScale
    },
    searchIndex: searchIndex.items || [],
    summaryIndex: summaryIndex.diseases || [],
    differentialGraph: mobileDifferentialGraph,
    diseaseChunks,
    imageManifest: {
      version: "0.1",
      policy: "No embedded images in this pack. Future image packs should be referenced by asset_id.",
      assets: []
    }
  }));

  const manifest = step("Build pack manifest", () => ({
    pack_type: "radiology-ddx-mobile-pack",
    pack_schema_version: PACK_SCHEMA_VERSION,
    min_viewer_version: MIN_VIEWER_VERSION,
    generated_at: new Date().toISOString(),
    source: {
      app: "radiology-ddx-starter",
      source_root_name: path.basename(ROOT)
    },
    counts: {
      diseases: diseaseCards.length,
      searchable_findings: payload.searchIndex.length,
      finding_concepts: Object.keys(dictionaries.findingConcepts).length,
      disease_chunks: diseaseChunks.length,
      differential_edges: mobileDifferentialGraph.edges.length,
      images: 0
    },
    size_hint_bytes: packSizeBytes(payload),
    content_hash: hashObject(payload),
    transfer: {
      recommended: "OneDrive",
      filename: path.basename(PACK_PATH)
    }
  }));

  const pack = { manifest, payload };

  step("Write .zip pack", () => {
    const entries = [
      jsonEntry("manifest.json", manifest),
      jsonEntry("dictionaries.json", payload.dictionaries),
      jsonEntry("search-index.json", payload.searchIndex),
      jsonEntry("summary-index.json", payload.summaryIndex),
      jsonEntry("differential-graph.json", payload.differentialGraph),
      jsonEntry("image-manifest.json", payload.imageManifest),
      ...diseaseChunks.map((chunk) => jsonEntry(`diseases/${chunk.chunk_id}.json`, chunk))
    ];
    writeZipStore(PACK_PATH, entries);
    if (!fs.existsSync(PACK_PATH)) throw new Error(`Pack was not written: ${rel(PACK_PATH)}`);
  });

  step("Copy viewer files", () => {
    for (const name of ["index.html", "app.js", "styles.css", "manifest.webmanifest", "sw.js"]) {
      copyViewerFile(name);
    }
  });

  step("Write export README metadata", () => writeJson(path.join(EXPORT_DIR, "README.mobile-export.json"), {
    generated_at: manifest.generated_at,
    pack_file: rel(PACK_PATH),
    viewer_dir: rel(VIEWER_DIR),
    one_drive_note: "Upload the .zip file to OneDrive, open the viewer on iPhone, then choose the file from Files.",
    no_images: true
  }));

  console.log(`Mobile ZIP pack: ${rel(PACK_PATH)}`);
  console.log(`Viewer files: ${rel(VIEWER_DIR)}`);
  console.log(`Diseases: ${manifest.counts.diseases}`);
  console.log(`Searchable findings: ${manifest.counts.searchable_findings}`);
  console.log(`Mobile differential edges: ${manifest.counts.differential_edges}`);
  console.log(`Approx payload bytes: ${manifest.size_hint_bytes}`);
} catch (error) {
  console.error("Mobile pack export failed.");
  console.error(error && error.stack ? error.stack : error.message);
  process.exit(1);
}

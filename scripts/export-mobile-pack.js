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
const PACK_PATH = path.join(EXPORT_DIR, "radiology-ddx-pack.json");
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

function writeCompactJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value), "utf8");
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

  step("Write .json pack", () => {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
    writeCompactJson(PACK_PATH, pack);
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
    one_drive_note: "Upload the .json file to OneDrive, open the viewer on iPhone, then choose the file from Files.",
    no_images: true
  }));

  console.log(`Mobile JSON pack: ${rel(PACK_PATH)}`);
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

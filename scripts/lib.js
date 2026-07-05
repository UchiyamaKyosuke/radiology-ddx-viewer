const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "data");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => path.join(dir, name));
}

function loadDictionaries() {
  const dir = path.join(DATA, "dictionaries");
  return {
    findingConcepts: readJson(path.join(dir, "finding-concepts.json")),
    synonymMap: readJson(path.join(dir, "synonym-map.json")),
    sequenceMap: readJson(path.join(dir, "sequence-map.json")),
    phaseMap: readJson(path.join(dir, "phase-map.json")),
    anatomyMap: readJson(path.join(dir, "anatomy-map.json")),
    targetMap: readJson(path.join(dir, "target-map.json")),
    modifierMap: readJson(path.join(dir, "modifier-map.json")),
    frequencyScale: readJson(path.join(dir, "frequency-scale.json"))
  };
}

function loadDiseaseCards() {
  return listJsonFiles(path.join(DATA, "diseases")).map((filePath) => ({
    filePath,
    card: readJson(filePath),
    sourceType: "disease"
  }));
}

function loadDraftCards() {
  return listJsonFiles(path.join(DATA, "drafts")).map((filePath) => ({
    filePath,
    card: readJson(filePath),
    sourceType: "draft"
  }));
}

function iterFindings(card) {
  const out = [];
  for (const group of card.imaging?.mri?.findings_by_sequence || []) {
    for (const finding of group.findings || []) {
      out.push({ finding, parent: group, modality: "MRI", acquisitionCode: group.sequence?.code });
    }
  }
  for (const group of card.imaging?.ct?.findings_by_phase || []) {
    for (const finding of group.findings || []) {
      out.push({ finding, parent: group, modality: "CT", acquisitionCode: group.phase?.code });
    }
  }
  return out;
}

function iterRawFindings(card) {
  return (card.raw_findings || []).map((rawFinding) => ({ rawFinding }));
}

function normalizeText(text) {
  return String(text || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function slugify(text) {
  return String(text || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80) || "unknown";
}

function hashObject(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function conceptTokens(concept) {
  const tokens = new Set(concept.tokens || []);
  for (const lang of Object.keys(concept.synonyms || {})) {
    for (const synonym of concept.synonyms[lang] || []) tokens.add(synonym);
  }
  if (concept.canonical_label?.ja) tokens.add(concept.canonical_label.ja);
  if (concept.canonical_label?.en) tokens.add(concept.canonical_label.en);
  return Array.from(tokens).filter(Boolean);
}

const MOJIBAKE_RE = /(?:�|縺|繧|荳|蜿|鬮|螟|譁|譛|諤|螂|隱|莠|髮|邵|郢|闕|陷|鬯|陞|譚|蛹|蟆|繝|譌)/;

function hasLikelyMojibake(text) {
  if (typeof text !== "string" || !text) return false;
  return MOJIBAKE_RE.test(text);
}

function collectTextIntegrityIssues(value, rootPath = "$", issues = []) {
  if (typeof value === "string") {
    if (hasLikelyMojibake(value)) issues.push(`${rootPath}: likely mojibake text "${value.slice(0, 80)}"`);
    return issues;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectTextIntegrityIssues(item, `${rootPath}[${index}]`, issues));
    return issues;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      collectTextIntegrityIssues(child, `${rootPath}.${key}`, issues);
    }
  }
  return issues;
}

module.exports = {
  ROOT,
  DATA,
  readJson,
  writeJson,
  listJsonFiles,
  loadDictionaries,
  loadDiseaseCards,
  loadDraftCards,
  iterFindings,
  iterRawFindings,
  normalizeText,
  slugify,
  hashObject,
  conceptTokens,
  hasLikelyMojibake,
  collectTextIntegrityIssues
};

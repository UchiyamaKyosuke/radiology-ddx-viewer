const path = require("path");
const {
  readJson,
  writeJson,
  listJsonFiles,
  iterFindings,
  hashObject
} = require("../lib");

const ROOT = path.resolve(__dirname, "..", "..");
const DATA = path.join(ROOT, "data");
const referenceKeys = new Set(["source_id", "type", "title", "authors", "journal", "year", "pmid", "doi", "url", "license"]);

function normalizePeakDecade(value) {
  const text = String(value || "").trim();
  if (!text || text === "Not extracted.") return "未確認";
  const range = text.match(/^(\d{2})s\s*[-–]\s*(\d{2})s$/i);
  if (range) return `${range[1]}-${range[2]}歳代`;
  const single = text.match(/^(\d{2})s$/i);
  if (single) return `${single[1]}歳代`;
  return text.replace(/代代/g, "代");
}

function normalizeAge(age = {}) {
  age.peak_decade = normalizePeakDecade(age.peak_decade);
  if (!age.summary || age.summary === "Not extracted.") age.summary = "好発年齢は未確認。";
  return age;
}

function keywordCandidatesFromText(text) {
  const source = String(text || "");
  const out = [];
  for (const match of source.matchAll(/\b[A-Za-z][A-Za-z0-9 -]{1,40}\s+sign\b/g)) {
    out.push(match[0].trim());
  }
  if (/T2\s*shading/i.test(source)) out.push("T2 shading");
  if (/dural tail/i.test(source)) out.push("dural tail sign");
  if (/bridging vessel/i.test(source)) out.push("bridging vessel sign");
  return out;
}

function uniqueKeywords(values) {
  return Array.from(new Set((values || [])
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .map((value) => String(value || "").trim())
    .filter(Boolean)));
}

function normalizeFindingKeywords(finding) {
  finding.keywords = uniqueKeywords([
    finding.keywords || [],
    keywordCandidatesFromText(finding.finding_text),
    finding.modifiers?.morphology || ""
  ]);
}

function sanitizeReferences(card) {
  const sourceNotes = [];
  const clinicalNotes = [];
  card.references = (card.references || []).map((reference) => {
    if (reference.note) {
      if (/source|sample|draft|PubMed|metadata/i.test(reference.note)) sourceNotes.push(reference.note);
      else clinicalNotes.push(reference.note);
    }
    const clean = {};
    for (const key of referenceKeys) {
      if (Object.prototype.hasOwnProperty.call(reference, key)) clean[key] = reference[key];
    }
    return clean;
  });

  if (sourceNotes.length) {
    card.evidence = card.evidence || { summary: "", claim_map: [] };
    const addendum = `補足: ${Array.from(new Set(sourceNotes)).join(" ")}`;
    if (!String(card.evidence.summary || "").includes(addendum)) {
      card.evidence.summary = [card.evidence.summary, addendum].filter(Boolean).join(" ");
    }
  }

  if (clinicalNotes.length) {
    const addendum = `補足: ${Array.from(new Set(clinicalNotes)).join(" ")}`;
    card.clinical = card.clinical || { overview: "", treatment: "", epidemiology: "" };
    if (!String(card.clinical.overview || "").includes(addendum)) {
      card.clinical.overview = `${card.clinical.overview || ""}${card.clinical.overview ? " " : ""}${addendum}`;
    }
  }
}

function isNonSourceEvidenceSummary(summary) {
  return (
    /^根拠文献:/.test(summary) ||
    /ref_\d+/i.test(summary) ||
    /スターター用/.test(summary) ||
    /実運用前/.test(summary) ||
    /医師レビュー/.test(summary) ||
    /Codex review/i.test(summary) ||
    /Review before use/i.test(summary) ||
    /作成した/.test(summary) ||
    /鑑別/.test(summary) ||
    /注意/.test(summary)
  );
}

function sourceEvidenceSummary(references = []) {
  const refs = references || [];
  if (!refs.length) return "";

  if (refs.every((reference) => reference.type === "placeholder" || /replace with reviewed source/i.test(reference.title || ""))) {
    return "出典未登録（サンプル用の仮出典）。";
  }

  const pubmedIds = refs.map((reference) => reference.pmid).filter(Boolean);
  if (pubmedIds.length === refs.length) {
    return `PubMedから取得しました（PMID: ${pubmedIds.join(", ")}）。`;
  }

  const sites = Array.from(new Set(refs.map((reference) => {
    try {
      return reference.url ? new URL(reference.url).hostname.replace(/^www\./, "") : "";
    } catch {
      return "";
    }
  }).filter(Boolean)));
  if (sites.length) return `${sites.join(", ")}から取得しました。`;

  const titles = refs.map((reference) => reference.title).filter(Boolean);
  if (titles.length) return `文献情報から作成しました（${titles.slice(0, 3).join(" / ")}）。`;
  return "出典情報から作成しました。";
}

function sanitizeEvidenceSummary(card) {
  if (!card.evidence) return;
  const summary = String(card.evidence.summary || "");
  if (!summary || isNonSourceEvidenceSummary(summary)) {
    card.evidence.summary = sourceEvidenceSummary(card.references || []);
  }
}

function normalizeCard(card, approved) {
  if (card.demographics?.age) normalizeAge(card.demographics.age);
  for (const { finding } of iterFindings(card)) normalizeFindingKeywords(finding);

  const findingKeywords = iterFindings(card).flatMap(({ finding }) => finding.keywords || []);
  card.keywords = uniqueKeywords([card.keywords || [], findingKeywords]);
  sanitizeReferences(card);
  sanitizeEvidenceSummary(card);
  card.updated_at = new Date().toISOString();
  if (approved) card.content_hash = hashObject({ ...card, content_hash: "" });
}

function runDirectory(relativeDir, approved) {
  let count = 0;
  for (const filePath of listJsonFiles(path.join(DATA, relativeDir))) {
    const card = readJson(filePath);
    normalizeCard(card, approved);
    writeJson(filePath, card);
    count += 1;
  }
  return count;
}

const diseases = runDirectory("diseases", true);
const drafts = runDirectory("drafts", false);

console.log(`Normalized metadata for ${diseases} disease cards and ${drafts} drafts`);

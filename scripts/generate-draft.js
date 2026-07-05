const path = require("path");
const { execFileSync } = require("child_process");
const {
  ROOT,
  DATA,
  readJson,
  writeJson,
  loadDictionaries,
  normalizeText,
  slugify
} = require("./lib");

const argv = process.argv.slice(2);
const noPostprocess = argv.includes("--no-postprocess");
const sourceArg = argv.find((arg) => !arg.startsWith("--"));
if (!sourceArg) {
  console.error("Usage: node scripts/generate-draft.js <source-json> [--no-postprocess]");
  process.exit(1);
}

const dictionaries = loadDictionaries();
const sourcePath = path.resolve(ROOT, sourceArg);
const source = readJson(sourcePath);

function frequencyRank(label) {
  return dictionaries.frequencyScale[label]?.prevalence_rank ?? 0;
}

function defaultDemographics() {
  return {
    sex: {
      applicable: ["unknown"],
      predominance: "unknown",
      predilection: "unknown",
      summary: "好発性別は未確認。"
    },
    age: {
      typical_min: null,
      typical_max: null,
      peak_decade: "未確認",
      summary: "好発年齢は未確認。"
    }
  };
}

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
  const summary = !age.summary || age.summary === "Not extracted." ? "好発年齢は未確認。" : age.summary;
  return {
    typical_min: age.typical_min ?? null,
    typical_max: age.typical_max ?? null,
    peak_decade: normalizePeakDecade(age.peak_decade),
    summary
  };
}

function normalizeDemographics(demographics) {
  const base = demographics || defaultDemographics();
  return {
    ...base,
    age: normalizeAge(base.age)
  };
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

function findingKeywords(finding) {
  return uniqueKeywords([
    finding.keywords || [],
    keywordCandidatesFromText(finding.finding_text),
    finding.modifiers?.morphology || ""
  ]);
}

const referenceKeys = new Set(["source_id", "type", "title", "authors", "journal", "year", "pmid", "doi", "url", "license"]);

function sanitizeReferences(references = []) {
  return references.map((reference) => {
    const clean = {};
    for (const key of referenceKeys) {
      if (Object.prototype.hasOwnProperty.call(reference, key)) clean[key] = reference[key];
    }
    return clean;
  });
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

function conceptTokens(conceptId, concept) {
  const tokens = new Set([conceptId, concept.canonical_label?.ja, concept.canonical_label?.en, ...(concept.tokens || [])]);
  for (const values of Object.values(concept.synonyms || {})) {
    for (const value of values) tokens.add(value);
  }
  return Array.from(tokens).map(normalizeText).filter(Boolean);
}

const conceptTokenIndex = Object.entries(dictionaries.findingConcepts).map(([conceptId, concept]) => ({
  conceptId,
  tokens: conceptTokens(conceptId, concept)
}));

function mapFindingToConcept(findingText) {
  const text = normalizeText(findingText);
  const scored = [];
  for (const entry of conceptTokenIndex) {
    let score = 0;
    for (const token of entry.tokens) {
      if (!token || token.length < 2) continue;
      if (text.includes(token)) score += Math.min(8, token.length);
    }
    if (score) scored.push({ ...entry, score });
  }
  scored.sort((a, b) => b.score - a.score);
  if (!scored.length) {
    return {
      status: "new_concept_needed",
      confidence: 0,
      conceptId: `finding:pending_${slugify(findingText)}`,
      alternatives: []
    };
  }
  const best = scored[0];
  return {
    status: best.score >= 4 ? "matched" : "candidate",
    confidence: Math.min(0.98, Number((best.score / 16).toFixed(2))),
    conceptId: best.conceptId,
    alternatives: scored.slice(1, 4).map((item) => item.conceptId)
  };
}

function findingId(diseaseId, finding, index) {
  return `${diseaseId}_${finding.modality.toLowerCase()}_${slugify(finding.acquisition_code)}_${String(index + 1).padStart(3, "0")}`;
}

function toCard(source) {
  const now = new Date().toISOString();
  const diseaseId = source.disease_id || slugify(source.disease_name?.en || source.disease_name?.ja);
  const mriGroups = new Map();
  const ctGroups = new Map();
  const findingIds = [];

  for (const [index, finding] of (source.findings || []).entries()) {
    const mapped = mapFindingToConcept(finding.finding_text || "");
    const needsMapping = mapped.status !== "matched";
    const item = {
      finding_id: findingId(diseaseId, finding, index),
      finding_code: mapped.conceptId,
      modality: finding.modality,
      acquisition: {
        type: finding.acquisition_type,
        code: finding.acquisition_code
      },
      anatomy: finding.anatomy,
      target: finding.target,
      modifiers: finding.modifiers || {},
      keywords: findingKeywords(finding),
      finding_text: finding.finding_text,
      typicality: finding.typicality || "variable",
      diagnostic_weight: finding.diagnostic_weight ?? 1,
      review_status: needsMapping ? "needs_mapping" : "draft",
      mapping: {
        status: mapped.status,
        confidence: mapped.confidence,
        matched_concept_id: mapped.status === "new_concept_needed" ? "" : mapped.conceptId,
        alternatives: mapped.alternatives
      }
    };
    findingIds.push(item.finding_id);
    const groups = finding.modality === "CT" ? ctGroups : mriGroups;
    const key = finding.acquisition_code;
    if (!groups.has(key)) {
      groups.set(key, {
        [finding.modality === "CT" ? "phase" : "sequence"]: { code: key },
        findings: []
      });
    }
    groups.get(key).findings.push(item);
  }

  return {
    schema_version: "0.8",
    disease_id: diseaseId,
    disease_name: source.disease_name,
    disease_aliases: source.disease_aliases || { ja: [], en: [] },
    clinical: source.clinical,
    demographics: normalizeDemographics(source.demographics),
    keywords: uniqueKeywords([
      source.keywords || [],
      Array.from(mriGroups.values()).flatMap((group) => group.findings.flatMap((finding) => finding.keywords || [])),
      Array.from(ctGroups.values()).flatMap((group) => group.findings.flatMap((finding) => finding.keywords || []))
    ]),
    frequency: {
      label: source.frequency?.label || "unknown",
      prevalence_rank: frequencyRank(source.frequency?.label || "unknown"),
      basis: source.frequency?.basis || "draft_estimate",
      evidence_level: source.frequency?.evidence_level || "unknown",
      context: source.frequency?.context || {
        population: "unknown",
        body_region: "unknown",
        clinical_setting: "unknown"
      },
      summary: source.frequency?.summary || ""
    },
    imaging: {
      ct: {
        summary: source.imaging?.ct?.summary || "",
        findings_by_phase: Array.from(ctGroups.values())
      },
      mri: {
        summary: source.imaging?.mri?.summary || "",
        findings_by_sequence: Array.from(mriGroups.values())
      }
    },
    evidence: {
      summary: sourceEvidenceSummary(source.references || []),
      claim_map: [
        {
          claim_type: "imaging_findings",
          finding_ids: findingIds,
          claim_scope: ["finding_text", "typicality", "diagnostic_weight"],
          source_ids: (source.references || []).map((item) => item.source_id),
          confidence: "low"
        }
      ]
    },
    image_examples: [],
    references: sanitizeReferences(source.references || []),
    review: {
      status: "draft",
      reviewed_by: "",
      reviewed_at: "",
      confidence: "low",
      notes: "Generated draft; requires mapping and physician review."
    },
    curation: {
      auto_update_allowed: true,
      locked_fields: [],
      notes: ""
    },
    provenance: {
      created_by: "draft_generator",
      model: "",
      created_at: now,
      prompt_version: "card_extraction_v0.1",
      source_query: source.source_query || ""
    },
    updated_at: now,
    content_hash: ""
  };
}

const card = toCard(source);
const outPath = path.join(DATA, "drafts", `${card.disease_id}.json`);
writeJson(outPath, card);
console.log(`Draft written: ${path.relative(ROOT, outPath)}`);

if (!noPostprocess) {
  console.log("Running draft postprocess: dictionary candidates, maintenance report, search index, differential graph...");
  execFileSync(process.execPath, [path.join(ROOT, "scripts", "dictionary-maintenance.js")], {
    cwd: ROOT,
    stdio: "inherit"
  });
}

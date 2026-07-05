const path = require("path");
const {
  ROOT,
  DATA,
  writeJson,
  loadDictionaries,
  loadDiseaseCards,
  loadDraftCards,
  iterFindings,
  conceptTokens,
  hashObject
} = require("./lib");

const dictionaries = loadDictionaries();
const diseaseCards = [...loadDiseaseCards(), ...loadDraftCards()].map(({ card, sourceType }) => ({
  ...card,
  __source_type: sourceType
}));
const generatedDir = path.join(DATA, "generated");

function labelForAcquisition(modality, code) {
  const source = modality === "MRI" ? dictionaries.sequenceMap : dictionaries.phaseMap;
  return source[code]?.label || { ja: code, en: code };
}

function anatomyTokens(anatomy) {
  const tokens = [];
  const body = dictionaries.anatomyMap.body_regions[anatomy.body_region];
  const organ = dictionaries.anatomyMap.organs[anatomy.organ];
  const subregion = dictionaries.anatomyMap.subregions[anatomy.subregion];
  for (const entry of [body, organ, subregion]) {
    if (!entry) continue;
    tokens.push(entry.label?.ja, entry.label?.en, ...(entry.synonyms || []));
  }
  return tokens.filter(Boolean);
}

function modifierTokens(modifiers) {
  return Object.values(modifiers || {}).filter(Boolean);
}

function targetTokens(target) {
  const entry = dictionaries.targetMap[target];
  if (!entry) return [target];
  return [entry.label?.ja, entry.label?.en, ...(entry.synonyms || [])].filter(Boolean);
}

function demographicsTokens(demographics) {
  const tokens = [];
  if (!demographics) return tokens;
  tokens.push(
    demographics.sex?.predominance,
    ...(demographics.sex?.applicable || []),
    demographics.sex?.summary,
    demographics.age?.peak_decade,
    demographics.age?.summary
  );
  if (demographics.age?.typical_min != null) tokens.push(String(demographics.age.typical_min));
  if (demographics.age?.typical_max != null) tokens.push(String(demographics.age.typical_max));
  return tokens.filter(Boolean);
}

function keywordTokens(keywords) {
  return (keywords || []).map((keyword) => String(keyword || "").trim()).filter(Boolean);
}

const searchIndex = [];
const summaryIndex = [];
const conceptUsage = {};

for (const card of diseaseCards) {
  const cardSearchable = ["draft", "reviewed", "approved"].includes(card.review?.status);
  summaryIndex.push({
    disease_id: card.disease_id,
    disease_name: card.disease_name,
    source_type: card.__source_type || "disease",
    aliases: card.disease_aliases || {},
    keywords: card.keywords || [],
    review_status: card.review?.status || "draft",
    demographics: card.demographics || null,
    frequency_label: card.frequency?.label || "unknown",
    prevalence_rank: card.frequency?.prevalence_rank || 0,
    overview: card.clinical?.overview || "",
    updated_at: card.updated_at || "",
    content_hash: hashObject({ ...card, content_hash: "" })
  });

  if (!cardSearchable) continue;

  const frequencyScore = dictionaries.frequencyScale[card.frequency?.label]?.score ?? 0;
  for (const { finding } of iterFindings(card)) {
    if (!["draft", "needs_mapping", "reviewed", "approved"].includes(finding.review_status)) continue;
    if (!dictionaries.findingConcepts[finding.finding_code]) continue;
    const concept = dictionaries.findingConcepts[finding.finding_code];
    const acquisitionLabel = labelForAcquisition(finding.modality, finding.acquisition.code);
    const tokens = Array.from(new Set([
      card.disease_name?.ja,
      card.disease_name?.en,
      ...(card.disease_aliases?.ja || []),
      ...(card.disease_aliases?.en || []),
      ...keywordTokens(card.keywords),
      ...keywordTokens(finding.keywords),
      ...demographicsTokens(card.demographics),
      finding.modality,
      finding.acquisition.code,
      acquisitionLabel.ja,
      acquisitionLabel.en,
      ...(concept ? conceptTokens(concept) : []),
      ...anatomyTokens(finding.anatomy || {}),
      ...targetTokens(finding.target),
      ...modifierTokens(finding.modifiers || {}),
      finding.finding_text
    ].filter(Boolean)));

    const item = {
      disease_id: card.disease_id,
      disease_name: card.disease_name,
      source_type: card.__source_type || "disease",
      review_status: card.review?.status || "draft",
      finding_id: finding.finding_id,
      finding_code: finding.finding_code,
      canonical_label: concept?.canonical_label || { ja: finding.finding_code, en: finding.finding_code },
      feature: concept?.feature || "",
      modality: finding.modality,
      acquisition_type: finding.acquisition.type,
      acquisition_code: finding.acquisition.code,
      acquisition_label: acquisitionLabel,
      anatomy: finding.anatomy,
      target: finding.target,
      modifiers: finding.modifiers || {},
      keywords: finding.keywords || [],
      finding_text: finding.finding_text,
      typicality: finding.typicality,
      diagnostic_weight: finding.diagnostic_weight,
      contextual_importance_rank: finding.contextual_importance?.ddx_priority_rank || 0,
      prevalence_rank: card.frequency?.prevalence_rank || 0,
      demographics: card.demographics || null,
      frequency_score: frequencyScore,
      clinical_significance: finding.clinical_significance || null,
      tokens
    };
    searchIndex.push(item);

    if (!conceptUsage[finding.finding_code]) conceptUsage[finding.finding_code] = [];
    conceptUsage[finding.finding_code].push({
      disease_id: card.disease_id,
      disease_name: card.disease_name,
      source_type: card.__source_type || "disease",
      review_status: card.review?.status || "draft",
      finding_id: finding.finding_id,
      modality: finding.modality,
      acquisition_code: finding.acquisition.code,
      anatomy: finding.anatomy,
      target: finding.target,
      modifiers: finding.modifiers || {},
      diagnostic_weight: finding.diagnostic_weight
    });
  }
}

function contextMatchScore(a, b) {
  let score = 0;
  if (a.finding_code === b.finding_code) score += 5;
  if (a.modality === b.modality) score += 1;
  if (a.acquisition_code === b.acquisition_code) score += 1;
  if (a.anatomy?.body_region === b.anatomy?.body_region) score += 1;
  if (a.anatomy?.organ === b.anatomy?.organ) score += 1;
  if (a.target === b.target) score += 1;
  if (a.modifiers?.morphology && a.modifiers.morphology === b.modifiers?.morphology) score += 1;
  return score;
}

const byDisease = new Map();
for (const item of searchIndex) {
  if (!byDisease.has(item.disease_id)) byDisease.set(item.disease_id, []);
  byDisease.get(item.disease_id).push(item);
}

const diseaseIds = Array.from(byDisease.keys()).sort();
const edges = [];
for (let i = 0; i < diseaseIds.length; i += 1) {
  for (let j = i + 1; j < diseaseIds.length; j += 1) {
    const aId = diseaseIds[i];
    const bId = diseaseIds[j];
    const aItems = byDisease.get(aId);
    const bItems = byDisease.get(bId);
    const shared = [];
    for (const a of aItems) {
      for (const b of bItems) {
        if (a.finding_code !== b.finding_code) continue;
        const score = contextMatchScore(a, b);
        if (score >= 6) {
          shared.push({
            finding_code: a.finding_code,
            canonical_label: a.canonical_label,
            weight: Math.max(a.diagnostic_weight, b.diagnostic_weight),
            matched_context: {
              modality: a.modality === b.modality ? a.modality : "mixed",
              acquisition_code: a.acquisition_code === b.acquisition_code ? a.acquisition_code : "",
              anatomy: {
                body_region: a.anatomy?.body_region === b.anatomy?.body_region ? a.anatomy.body_region : "",
                organ: a.anatomy?.organ === b.anatomy?.organ ? a.anatomy.organ : ""
              },
              target: a.target === b.target ? a.target : "",
              modifiers: {
                morphology: a.modifiers?.morphology === b.modifiers?.morphology ? a.modifiers?.morphology : ""
              }
            }
          });
        }
      }
    }
    if (!shared.length) continue;

    const sharedScore = shared.reduce((sum, item) => sum + item.weight, 0);
    const maxPossible = Math.max(
      aItems.reduce((sum, item) => sum + Math.max(0, item.diagnostic_weight), 0),
      bItems.reduce((sum, item) => sum + Math.max(0, item.diagnostic_weight), 0),
      1
    );
    const similarity = Math.min(1, sharedScore / maxPossible);

    const onlyA = aItems.filter((item) => !bItems.some((other) => other.finding_code === item.finding_code));
    const onlyB = bItems.filter((item) => !aItems.some((other) => other.finding_code === item.finding_code));
    const distinguishing = [
      ...onlyA.slice(0, 3).map((item) => ({
        finding_code: item.finding_code,
        canonical_label: item.canonical_label,
        favors: aId,
        reason: "source disease has this finding; target disease does not"
      })),
      ...onlyB.slice(0, 3).map((item) => ({
        finding_code: item.finding_code,
        canonical_label: item.canonical_label,
        favors: bId,
        reason: "target disease has this finding; source disease does not"
      }))
    ];

    edges.push({
      source_disease_id: aId,
      target_disease_id: bId,
      relationship: "imaging_mimic",
      similarity_score: Number(similarity.toFixed(3)),
      shared_findings: shared,
      distinguishing_candidates: distinguishing
    });
  }
}

const graph = {
  graph_version: "0.1",
  generated_at: new Date().toISOString(),
  nodes: summaryIndex.map((item) => ({
    disease_id: item.disease_id,
    disease_name: item.disease_name,
    review_status: item.review_status,
    source_type: item.source_type
  })),
  edges: edges.sort((a, b) => b.similarity_score - a.similarity_score)
};

writeJson(path.join(generatedDir, "search-index.json"), {
  index_version: "0.1",
  generated_at: new Date().toISOString(),
  items: searchIndex
});
writeJson(path.join(generatedDir, "disease-summary-index.json"), {
  index_version: "0.1",
  generated_at: new Date().toISOString(),
  diseases: summaryIndex
});
writeJson(path.join(generatedDir, "concept-usage-index.json"), {
  index_version: "0.1",
  generated_at: new Date().toISOString(),
  concepts: conceptUsage
});
writeJson(path.join(generatedDir, "differential-graph.json"), graph);

console.log(`Built ${searchIndex.length} searchable findings`);
console.log(`Built ${edges.length} differential graph edges`);
console.log(`Wrote generated indexes to ${generatedDir}`);

const path = require("path");
const {
  DATA,
  readJson,
  writeJson,
  listJsonFiles,
  loadDictionaries,
  iterFindings,
  iterRawFindings,
  normalizeText,
  conceptTokens,
  slugify
} = require("./lib");

const dictionaries = loadDictionaries();
const draftFiles = listJsonFiles(path.join(DATA, "drafts"));
const existingCandidatesPath = path.join(DATA, "dictionaries", "new-concept-candidates.json");
const existingCandidates = (() => {
  try {
    return readJson(existingCandidatesPath);
  } catch {
    return { candidates: [] };
  }
})();

const byId = new Map(
  (existingCandidates.candidates || [])
    .filter((item) => !String(item.candidate_id || "").startsWith("candidate:raw:"))
    .map((item) => [item.candidate_id, item])
);

function candidateId(finding) {
  return `candidate:${slugify(finding.finding_text || finding.finding_code)}`;
}

function rawCandidateId(rawFinding) {
  return `candidate:raw:${slugify(rawFinding.finding_text || rawFinding.raw_finding_id)}`;
}

function makeCandidate(card, finding) {
  const id = candidateId(finding);
  const suggestions = suggestExistingConcepts(finding);
  return {
    candidate_id: id,
    proposed_concept_id: finding.finding_code.startsWith("finding:pending_")
      ? finding.finding_code.replace("finding:pending_", "finding:")
      : `finding:${slugify(finding.finding_text)}`,
    status: "pending",
    canonical_label: {
      ja: finding.finding_text,
      en: ""
    },
    feature: "unknown",
    allowed_modalities: [finding.modality],
    allowed_acquisitions: [finding.acquisition?.code].filter(Boolean),
    default_polarity: "present",
    default_modifiers: {},
    synonyms: {
      ja: [finding.finding_text],
      en: []
    },
    tokens: [finding.finding_text].filter(Boolean),
    examples: [
      {
        disease_id: card.disease_id,
        finding_id: finding.finding_id,
        finding_text: finding.finding_text,
        mapping: finding.mapping || null
      }
    ],
    existing_concept_suggestions: suggestions,
    notes: "Review and approve before adding to finding-concepts.json."
  };
}

function makeRawCandidate(card, rawFinding) {
  const id = rawCandidateId(rawFinding);
  const candidateCode = rawFinding.mapping?.candidate_finding_code || `finding:${slugify(rawFinding.finding_text)}`;
  const modalityText = String(rawFinding.modality_text || "").toUpperCase();
  const allowedModalities = ["CT", "MRI"].includes(modalityText) ? [modalityText] : [];
  const allowedAcquisitions = [rawFinding.mapping?.candidate_acquisition_code || rawFinding.acquisition_text].filter(Boolean);
  return {
    candidate_id: id,
    proposed_concept_id: candidateCode,
    status: "pending",
    canonical_label: {
      ja: rawFinding.finding_text,
      en: ""
    },
    feature: "unknown",
    allowed_modalities: allowedModalities,
    allowed_acquisitions: allowedAcquisitions,
    default_polarity: "present",
    default_modifiers: {},
    synonyms: {
      ja: [rawFinding.finding_text].filter(Boolean),
      en: []
    },
    tokens: [
      rawFinding.finding_text,
      rawFinding.modality_text,
      rawFinding.acquisition_text,
      rawFinding.anatomy_text,
      rawFinding.target_text,
      rawFinding.interpretation
    ].filter(Boolean),
    examples: [
      {
        disease_id: card.disease_id,
        raw_finding_id: rawFinding.raw_finding_id,
        finding_text: rawFinding.finding_text,
        modality_text: rawFinding.modality_text || "",
        acquisition_text: rawFinding.acquisition_text || "",
        anatomy_text: rawFinding.anatomy_text || "",
        target_text: rawFinding.target_text || "",
        interpretation: rawFinding.interpretation || "",
        mapping: rawFinding.mapping || null
      }
    ],
    existing_concept_suggestions: suggestExistingConceptsForRaw(rawFinding),
    notes: "Generated from raw_findings. Review whether this should become a dictionary concept or map to an existing concept."
  };
}

function suggestExistingConcepts(finding) {
  const haystack = normalizeText([
    finding.finding_text,
    finding.modality,
    finding.acquisition?.code,
    finding.target,
    ...Object.values(finding.modifiers || {})
  ].filter(Boolean).join(" "));
  const suggestions = [];
  for (const [conceptId, concept] of Object.entries(dictionaries.findingConcepts)) {
    const tokens = conceptTokens(concept).map(normalizeText).filter((token) => token.length >= 3);
    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) score += Math.min(10, token.length);
    }
    if (concept.allowed_modalities?.includes(finding.modality)) score += 2;
    if (concept.allowed_acquisitions?.includes(finding.acquisition?.code)) score += 2;
    if (score > 0) {
      suggestions.push({
        concept_id: conceptId,
        label_ja: concept.canonical_label?.ja || "",
        label_en: concept.canonical_label?.en || "",
        score
      });
    }
  }
  return suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
}

function suggestExistingConceptsForRaw(rawFinding) {
  const haystack = normalizeText([
    rawFinding.finding_text,
    rawFinding.modality_text,
    rawFinding.acquisition_text,
    rawFinding.anatomy_text,
    rawFinding.target_text,
    rawFinding.interpretation
  ].filter(Boolean).join(" "));
  const suggestions = [];
  for (const [conceptId, concept] of Object.entries(dictionaries.findingConcepts)) {
    const tokens = conceptTokens(concept).map(normalizeText).filter((token) => token.length >= 3);
    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) score += Math.min(10, token.length);
    }
    if (score > 0) {
      suggestions.push({
        concept_id: conceptId,
        label_ja: concept.canonical_label?.ja || "",
        label_en: concept.canonical_label?.en || "",
        score
      });
    }
  }
  return suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
}

for (const filePath of draftFiles) {
  const card = readJson(filePath);
  for (const { finding } of iterFindings(card)) {
    const conceptExists = Object.prototype.hasOwnProperty.call(dictionaries.findingConcepts, finding.finding_code);
    const needsMapping = finding.review_status === "needs_mapping" || !conceptExists;
    if (!needsMapping) continue;
    const id = candidateId(finding);
    if (!byId.has(id)) {
      byId.set(id, makeCandidate(card, finding));
    } else {
      const existing = byId.get(id);
      existing.examples = existing.examples || [];
      if (!existing.examples.some((item) => item.finding_id === finding.finding_id)) {
        existing.examples.push({
          disease_id: card.disease_id,
          finding_id: finding.finding_id,
          finding_text: finding.finding_text,
          mapping: finding.mapping || null
        });
      }
    }
  }

  for (const { rawFinding } of iterRawFindings(card)) {
    const status = rawFinding.mapping?.status || rawFinding.review_status || "unmapped";
    if (!["unmapped", "candidate", "needs_mapping", "draft"].includes(status)) continue;
    const id = rawCandidateId(rawFinding);
    if (!byId.has(id)) {
      byId.set(id, makeRawCandidate(card, rawFinding));
    } else {
      const existing = byId.get(id);
      existing.examples = existing.examples || [];
      if (!existing.examples.some((item) => item.raw_finding_id === rawFinding.raw_finding_id && item.disease_id === card.disease_id)) {
        existing.examples.push({
          disease_id: card.disease_id,
          raw_finding_id: rawFinding.raw_finding_id,
          finding_text: rawFinding.finding_text,
          modality_text: rawFinding.modality_text || "",
          acquisition_text: rawFinding.acquisition_text || "",
          anatomy_text: rawFinding.anatomy_text || "",
          target_text: rawFinding.target_text || "",
          interpretation: rawFinding.interpretation || "",
          mapping: rawFinding.mapping || null
        });
      }
    }
  }
}

const candidates = Array.from(byId.values()).sort((a, b) => a.candidate_id.localeCompare(b.candidate_id));
const pendingCount = candidates.filter((item) => item.status === "pending").length;
writeJson(existingCandidatesPath, {
  generated_at: new Date().toISOString(),
  candidates
});
console.log(`Concept candidates: ${pendingCount} pending / ${candidates.length} total`);
console.log(path.relative(process.cwd(), existingCandidatesPath));

const path = require("path");
const {
  loadDictionaries,
  loadDiseaseCards,
  loadDraftCards,
  iterFindings,
  iterRawFindings,
  hashObject,
  collectTextIntegrityIssues
} = require("./lib");

const dictionaries = loadDictionaries();
const diseaseCards = loadDiseaseCards();
const draftCards = loadDraftCards();
const errors = [];
const warnings = [];
const referenceKeys = new Set(["source_id", "type", "title", "authors", "journal", "year", "pmid", "doi", "url", "license"]);

function fail(scope, message) {
  errors.push(`${scope}: ${message}`);
}

function warn(scope, message) {
  warnings.push(`${scope}: ${message}`);
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function validateReferences(scope, references, report) {
  for (const [index, reference] of (references || []).entries()) {
    for (const key of Object.keys(reference || {})) {
      if (!referenceKeys.has(key)) report(scope, `references[${index}] has non-source field ${key}`);
    }
  }
}

function validateEvidenceSummary(scope, evidence, report) {
  const summary = String(evidence?.summary || "");
  if (
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
  ) {
    report(scope, "evidence.summary contains non-source notes; keep it limited to source/evidence summary");
  }
}

function validateAge(scope, age, report) {
  const peak = String(age?.peak_decade || "");
  if (!peak) report(scope, "demographics.age.peak_decade should be 未確認 or compact Japanese such as 50-70歳代");
  if (/\d{2}s/i.test(peak)) report(scope, `demographics.age.peak_decade uses English decade notation: ${peak}`);
  if (age?.summary === "Not extracted.") report(scope, "demographics.age.summary should be compact Japanese, not Not extracted.");
}

function validateKeywords(scope, card, report) {
  if (!Array.isArray(card.keywords)) report(scope, "missing top-level keywords array");
  for (const { finding } of iterFindings(card)) {
    if (!Array.isArray(finding.keywords)) report(`${scope} ${finding.finding_id || "(missing finding_id)"}`, "missing finding keywords array");
  }
}

function validateRawFindings(scope, card, report) {
  const ids = new Set();
  const allowedMappingStatuses = new Set(["unmapped", "candidate", "mapped", "deferred", "rejected"]);
  const allowedReviewStatuses = new Set(["draft", "needs_mapping", "reviewed", "approved", "rejected"]);
  for (const { rawFinding } of iterRawFindings(card)) {
    const rawScope = `${scope} raw_findings ${rawFinding.raw_finding_id || "(missing raw_finding_id)"}`;
    if (!rawFinding.raw_finding_id) report(rawScope, "missing raw_finding_id");
    if (rawFinding.raw_finding_id && ids.has(rawFinding.raw_finding_id)) report(rawScope, "duplicate raw_finding_id");
    if (rawFinding.raw_finding_id) ids.add(rawFinding.raw_finding_id);
    if (!rawFinding.finding_text) report(rawScope, "missing finding_text");
    if (rawFinding.mapping?.status && !allowedMappingStatuses.has(rawFinding.mapping.status)) {
      report(rawScope, `unknown mapping.status ${rawFinding.mapping.status}`);
    }
    if (rawFinding.review_status && !allowedReviewStatuses.has(rawFinding.review_status)) {
      report(rawScope, `unknown review_status ${rawFinding.review_status}`);
    }
  }
}

for (const { filePath, card } of diseaseCards) {
  const scope = path.basename(filePath);
  for (const issue of collectTextIntegrityIssues(card)) {
    fail(scope, issue);
  }

  validateKeywords(scope, card, fail);
  validateRawFindings(scope, card, fail);
  validateReferences(scope, card.references, fail);
  validateEvidenceSummary(scope, card.evidence, fail);
  if (card.schema_version !== "0.8") fail(scope, "schema_version must be 0.8");
  if (!card.disease_id) fail(scope, "missing disease_id");
  if (!card.disease_name?.ja || !card.disease_name?.en) fail(scope, "missing disease_name ja/en");
  if (!card.demographics?.sex || !card.demographics?.age) fail(scope, "missing demographics.sex/age");
  const sexPredilections = new Set(["female_only", "female_predominant", "no_sex_predilection", "male_predominant", "male_only", "unknown"]);
  if (card.demographics?.sex && !sexPredilections.has(card.demographics.sex.predilection)) {
    fail(scope, `unknown demographics.sex.predilection ${card.demographics.sex.predilection}`);
  }
  if (card.demographics?.age) {
    const min = card.demographics.age.typical_min;
    const max = card.demographics.age.typical_max;
    if (min != null && max != null && min > max) fail(scope, "demographics.age typical_min exceeds typical_max");
    validateAge(scope, card.demographics.age, fail);
  }
  if (!card.review?.status) fail(scope, "missing review.status");
  if (!card.frequency?.label) fail(scope, "missing frequency.label");
  if (!hasOwn(dictionaries.frequencyScale, card.frequency?.label)) {
    fail(scope, `unknown frequency label ${card.frequency?.label}`);
  }

  const findingIds = new Set();
  for (const { finding, modality, acquisitionCode } of iterFindings(card)) {
    const fscope = `${scope} ${finding.finding_id || "(missing finding_id)"}`;
    if (!finding.finding_id) fail(fscope, "missing finding_id");
    if (findingIds.has(finding.finding_id)) fail(fscope, "duplicate finding_id");
    findingIds.add(finding.finding_id);

    if (!hasOwn(dictionaries.findingConcepts, finding.finding_code)) {
      fail(fscope, `unknown finding_code ${finding.finding_code}`);
    }
    if (finding.modality !== modality) {
      fail(fscope, `finding.modality ${finding.modality} does not match parent ${modality}`);
    }
    if (finding.acquisition?.code !== acquisitionCode) {
      fail(fscope, `acquisition.code ${finding.acquisition?.code} does not match parent ${acquisitionCode}`);
    }
    if (modality === "MRI" && !hasOwn(dictionaries.sequenceMap, finding.acquisition?.code)) {
      fail(fscope, `unknown MRI sequence ${finding.acquisition?.code}`);
    }
    if (modality === "CT" && !hasOwn(dictionaries.phaseMap, finding.acquisition?.code)) {
      fail(fscope, `unknown CT phase ${finding.acquisition?.code}`);
    }
    if (!hasOwn(dictionaries.anatomyMap.body_regions, finding.anatomy?.body_region)) {
      fail(fscope, `unknown body_region ${finding.anatomy?.body_region}`);
    }
    if (!hasOwn(dictionaries.anatomyMap.organs, finding.anatomy?.organ)) {
      fail(fscope, `unknown organ ${finding.anatomy?.organ}`);
    }
    if (!hasOwn(dictionaries.anatomyMap.subregions, finding.anatomy?.subregion)) {
      fail(fscope, `unknown subregion ${finding.anatomy?.subregion}`);
    }
    if (!hasOwn(dictionaries.targetMap, finding.target)) {
      fail(fscope, `unknown target ${finding.target}`);
    }
    for (const [key, value] of Object.entries(finding.modifiers || {})) {
      const allowed = dictionaries.modifierMap[key];
      if (!allowed) fail(fscope, `unknown modifier key ${key}`);
      else if (!allowed.includes(value)) fail(fscope, `modifier ${key} has unknown value ${value}`);
    }
    if (finding.review_status !== "approved" && card.review?.status === "approved") {
      warn(fscope, "card is approved but finding is not approved");
    }
  }

  for (const claim of card.evidence?.claim_map || []) {
    for (const findingId of claim.finding_ids || []) {
      if (!findingIds.has(findingId)) warn(scope, `evidence references unknown finding_id ${findingId}`);
    }
  }

  const cardHash = hashObject({ ...card, content_hash: "" });
  if (card.content_hash && card.content_hash !== cardHash) {
    warn(scope, "content_hash is present but does not match current content");
  }
}

for (const { filePath, card } of draftCards) {
  const scope = path.basename(filePath);
  for (const issue of collectTextIntegrityIssues(card)) {
    warn(scope, issue);
  }
  validateKeywords(scope, card, warn);
  validateRawFindings(scope, card, warn);
  validateReferences(scope, card.references, warn);
  validateEvidenceSummary(scope, card.evidence, warn);
  validateAge(scope, card.demographics?.age, warn);
}

for (const [name, dictionary] of Object.entries(dictionaries)) {
  for (const issue of collectTextIntegrityIssues(dictionary)) {
    fail(`${name}.json`, issue);
  }
}

for (const [term, conceptIds] of Object.entries(dictionaries.synonymMap)) {
  for (const conceptId of conceptIds) {
    if (!hasOwn(dictionaries.findingConcepts, conceptId)) {
      fail("synonym-map.json", `${term} references unknown concept ${conceptId}`);
    }
  }
}

if (warnings.length) {
  console.log("Warnings:");
  for (const message of warnings) console.log(`- ${message}`);
}

if (errors.length) {
  console.error("Validation failed:");
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Validation passed: ${diseaseCards.length} disease cards`);
if (draftCards.length) console.log(`Draft cards present: ${draftCards.length}`);

const fs = require("fs");
const path = require("path");
const { DATA, writeJson } = require("../lib");

const conceptsPath = path.join(DATA, "dictionaries", "finding-concepts.json");
const synonymPath = path.join(DATA, "dictionaries", "synonym-map.json");

const concepts = JSON.parse(fs.readFileSync(conceptsPath, "utf8"));
const synonyms = JSON.parse(fs.readFileSync(synonymPath, "utf8"));

const restricted = [
  "finding:diffusion_restriction_present",
  "finding:dwi_hyperintensity",
  "finding:adc_low",
  "finding:central_diffusion_restriction",
  "finding:vascular_territory_restricted_diffusion"
];

const unrestricted = [
  "finding:diffusion_restriction_absent",
  "finding:adc_high",
  "finding:adc_iso",
  "finding:dwi_isointensity"
];

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function ensureConcept(id, state, equivalents, conflicts) {
  const concept = concepts[id];
  if (!concept) return;
  concept.feature = "diffusion_restriction";
  concept.relation_group = "diffusion_restriction";
  concept.relation_state = state;
  concept.related_equivalents = unique([...(concept.related_equivalents || []), ...equivalents.filter((other) => other !== id)]);
  concept.opposites = unique([...(concept.opposites || []), ...conflicts]);
  concept.allowed_modalities = unique([...(concept.allowed_modalities || []), "MRI"]);
}

for (const id of restricted) ensureConcept(id, "restricted", restricted, unrestricted);
for (const id of unrestricted) ensureConcept(id, "not_restricted", unrestricted, restricted);

function addSynonym(term, ids) {
  synonyms[term] = unique([...(synonyms[term] || []), ...ids]);
}

addSynonym("拡散制限あり", ["finding:diffusion_restriction_present", "finding:dwi_hyperintensity", "finding:adc_low"]);
addSynonym("拡散制限を認める", ["finding:diffusion_restriction_present", "finding:dwi_hyperintensity", "finding:adc_low"]);
addSynonym("restricted diffusion", ["finding:diffusion_restriction_present", "finding:dwi_hyperintensity", "finding:adc_low"]);
addSynonym("diffusion restriction", ["finding:diffusion_restriction_present", "finding:dwi_hyperintensity", "finding:adc_low"]);
addSynonym("DWI高信号", ["finding:dwi_hyperintensity", "finding:diffusion_restriction_present", "finding:adc_low"]);
addSynonym("dwi高信号", ["finding:dwi_hyperintensity", "finding:diffusion_restriction_present", "finding:adc_low"]);
addSynonym("DWI high", ["finding:dwi_hyperintensity", "finding:diffusion_restriction_present"]);
addSynonym("ADC低下", ["finding:adc_low", "finding:diffusion_restriction_present", "finding:dwi_hyperintensity"]);
addSynonym("ADC低値", ["finding:adc_low", "finding:diffusion_restriction_present", "finding:dwi_hyperintensity"]);
addSynonym("low ADC", ["finding:adc_low", "finding:diffusion_restriction_present"]);

addSynonym("拡散制限なし", ["finding:diffusion_restriction_absent", "finding:adc_high", "finding:dwi_isointensity"]);
addSynonym("拡散制限を認めない", ["finding:diffusion_restriction_absent", "finding:adc_high", "finding:dwi_isointensity"]);
addSynonym("no diffusion restriction", ["finding:diffusion_restriction_absent", "finding:adc_high", "finding:dwi_isointensity"]);
addSynonym("restricted diffusion absent", ["finding:diffusion_restriction_absent", "finding:adc_high", "finding:dwi_isointensity"]);
addSynonym("DWI等信号", ["finding:dwi_isointensity", "finding:diffusion_restriction_absent"]);
addSynonym("dwi等信号", ["finding:dwi_isointensity", "finding:diffusion_restriction_absent"]);
addSynonym("ADC高値", ["finding:adc_high", "finding:diffusion_restriction_absent"]);
addSynonym("ADC上昇", ["finding:adc_high", "finding:diffusion_restriction_absent"]);
addSynonym("high ADC", ["finding:adc_high", "finding:diffusion_restriction_absent"]);
addSynonym("ADC等信号", ["finding:adc_iso", "finding:diffusion_restriction_absent"]);
addSynonym("ADC同程度", ["finding:adc_iso", "finding:diffusion_restriction_absent"]);

writeJson(conceptsPath, concepts);
writeJson(synonymPath, synonyms);

console.log("Normalized DWI/ADC/diffusion restriction concept relationships.");

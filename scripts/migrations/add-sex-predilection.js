const fs = require("fs");
const path = require("path");
const {
  DATA,
  readJson,
  writeJson,
  listJsonFiles
} = require("../lib");

function inferPredilection(card) {
  const organValues = [];
  for (const group of card.imaging?.mri?.findings_by_sequence || []) {
    for (const finding of group.findings || []) organValues.push(finding.anatomy?.organ);
  }
  for (const group of card.imaging?.ct?.findings_by_phase || []) {
    for (const finding of group.findings || []) organValues.push(finding.anatomy?.organ);
  }
  const organs = new Set(organValues.filter(Boolean));
  if (organs.has("ovary") || organs.has("uterus")) return "female_only";
  return "unknown";
}

function applySexSummary(sex, predilection) {
  const labels = {
    female_only: {
      applicable: ["female"],
      predominance: "female",
      summary: "女性にのみ発生する疾患。"
    },
    female_predominant: {
      applicable: ["any"],
      predominance: "female",
      summary: "女性に多い疾患。"
    },
    no_sex_predilection: {
      applicable: ["any"],
      predominance: "none",
      summary: "明らかな性差はない。"
    },
    male_predominant: {
      applicable: ["any"],
      predominance: "male",
      summary: "男性に多い疾患。"
    },
    male_only: {
      applicable: ["male"],
      predominance: "male",
      summary: "男性にのみ発生する疾患。"
    },
    unknown: {
      applicable: ["unknown"],
      predominance: "unknown",
      summary: sex?.summary || "好発性別は未確認。"
    }
  };
  const defaults = labels[predilection] || labels.unknown;
  return {
    applicable: sex?.applicable || defaults.applicable,
    predominance: sex?.predominance || defaults.predominance,
    predilection,
    summary: sex?.summary && !sex.summary.includes("未確認") ? sex.summary : defaults.summary
  };
}

function migrateDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  let changed = 0;
  for (const filePath of listJsonFiles(dir)) {
    const card = readJson(filePath);
    if (!card.demographics) continue;
    if (!card.demographics.sex?.predilection) {
      const predilection = inferPredilection(card);
      card.demographics.sex = applySexSummary(card.demographics.sex, predilection);
      card.updated_at = new Date().toISOString();
      writeJson(filePath, card);
      changed += 1;
    }
  }
  return changed;
}

const diseasesChanged = migrateDir(path.join(DATA, "diseases"));
const draftsChanged = migrateDir(path.join(DATA, "drafts"));
console.log(`Added sex predilection to ${diseasesChanged} disease cards and ${draftsChanged} drafts`);

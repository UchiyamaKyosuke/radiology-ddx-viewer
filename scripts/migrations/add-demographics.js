const fs = require("fs");
const path = require("path");
const {
  DATA,
  readJson,
  writeJson,
  listJsonFiles
} = require("../lib");

const diseaseDefaults = {
  brenner_tumor: age(40, 80, "50s-70s", "中高年女性に多いとされる。"),
  endometrioma: age(20, 50, "20s-40s", "生殖年齢女性に多い。"),
  epithelial_ovarian_carcinoma: age(40, 80, "50s-70s", "中高年女性で重要な悪性腫瘍。"),
  hemorrhagic_ovarian_cyst: age(15, 50, "20s-40s", "生殖年齢女性に多い。"),
  mature_cystic_teratoma: age(10, 40, "10s-30s", "若年女性に比較的多い。"),
  mucinous_cystadenoma: age(20, 70, "30s-50s", "成人女性でみられる。"),
  ovarian_fibroma: age(30, 70, "40s-60s", "中年以降の女性でみられることが多い。"),
  ovarian_fibrothecoma: age(30, 70, "40s-60s", "中年以降の女性でみられることが多い。"),
  ovarian_metastasis: age(30, 80, "40s-60s", "原発悪性腫瘍を有する成人女性で重要。"),
  pedunculated_uterine_leiomyoma: age(30, 60, "30s-50s", "性成熟期から閉経前後の女性に多い。"),
  tubo_ovarian_abscess: age(15, 50, "20s-40s", "生殖年齢女性で重要。")
};

function age(typicalMin, typicalMax, peakDecade, summary) {
  return {
    sex: {
      applicable: ["female"],
      predominance: "female",
      summary: "女性に発生する疾患。"
    },
    age: {
      typical_min: typicalMin,
      typical_max: typicalMax,
      peak_decade: peakDecade,
      summary
    }
  };
}

function fallbackDemographics() {
  return {
    sex: {
      applicable: ["unknown"],
      predominance: "unknown",
      summary: "好発性別は未確認。"
    },
    age: {
      typical_min: null,
      typical_max: null,
      peak_decade: "",
      summary: "好発年齢は未確認。"
    }
  };
}

function migrateDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  let changed = 0;
  for (const filePath of listJsonFiles(dir)) {
    const card = readJson(filePath);
    if (!card.demographics) {
      card.demographics = diseaseDefaults[card.disease_id] || fallbackDemographics();
      card.updated_at = new Date().toISOString();
      writeJson(filePath, card);
      changed += 1;
    }
  }
  return changed;
}

const diseasesChanged = migrateDir(path.join(DATA, "diseases"));
const draftsChanged = migrateDir(path.join(DATA, "drafts"));
console.log(`Added demographics to ${diseasesChanged} disease cards and ${draftsChanged} drafts`);

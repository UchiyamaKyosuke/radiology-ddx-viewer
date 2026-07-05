const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const DATA = path.join(ROOT, "data");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(dir, name));
}

function normalizeNonContrastCodes() {
  const roots = [
    path.join(DATA, "drafts"),
    path.join(DATA, "diseases"),
    path.join(DATA, "sources")
  ];
  let changedFiles = 0;
  let replacements = 0;
  for (const root of roots) {
    const stack = [root];
    while (stack.length) {
      const current = stack.pop();
      if (!fs.existsSync(current)) continue;
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) stack.push(full);
        if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
        const before = fs.readFileSync(full, "utf8");
        const after = before.replace(/"noncontrast"/g, "\"non_contrast\"");
        if (after !== before) {
          replacements += (before.match(/"noncontrast"/g) || []).length;
          fs.writeFileSync(full, after, "utf8");
          changedFiles += 1;
        }
      }
    }
  }
  return { changedFiles, replacements };
}

function ensureSynonyms() {
  const synonymPath = path.join(DATA, "dictionaries", "synonym-map.json");
  const synonyms = readJson(synonymPath);
  const add = (term, ids) => {
    const current = new Set(synonyms[term] || []);
    for (const id of ids) current.add(id);
    synonyms[term] = Array.from(current).sort();
  };

  add("SWI低信号", ["finding:susceptibility_blooming"]);
  add("磁化率低信号", ["finding:susceptibility_blooming"]);
  add("blooming", ["finding:susceptibility_blooming"]);
  add("微小出血", ["finding:susceptibility_blooming"]);
  add("microbleeds", ["finding:susceptibility_blooming"]);
  add("flow void", ["finding:flow_void"]);
  add("フローボイド", ["finding:flow_void"]);
  add("血管狭窄", ["finding:arterial_stenosis_or_occlusion"]);
  add("動脈狭窄", ["finding:arterial_stenosis_or_occlusion"]);
  add("血管閉塞", ["finding:arterial_stenosis_or_occlusion"]);
  add("動脈閉塞", ["finding:arterial_stenosis_or_occlusion"]);
  add("nidus", ["finding:vascular_nidus"]);
  add("血管nidus", ["finding:vascular_nidus"]);
  add("静脈洞血栓", ["finding:venous_sinus_thrombosis"]);
  add("venous sinus thrombosis", ["finding:venous_sinus_thrombosis"]);
  add("empty delta sign", ["finding:empty_delta_sign"]);
  add("過灌流", ["finding:hyperperfusion"]);
  add("低灌流", ["finding:hypoperfusion"]);
  add("CBV上昇", ["finding:elevated_cbv"]);
  add("rCBV上昇", ["finding:elevated_cbv"]);
  add("CBV低下", ["finding:reduced_cbv"]);
  add("rCBV低下", ["finding:reduced_cbv"]);
  add("コリンピーク上昇", ["finding:elevated_choline_peak"]);
  add("choline peak", ["finding:elevated_choline_peak"]);
  add("乳酸ピーク", ["finding:lactate_peak"]);
  add("lactate peak", ["finding:lactate_peak"]);
  add("脂質ピーク", ["finding:lipid_peak"]);
  add("lipid peak", ["finding:lipid_peak"]);

  writeJson(synonymPath, synonyms);
  return Object.keys(synonyms).length;
}

function ensureAnatomy() {
  const anatomyPath = path.join(DATA, "dictionaries", "anatomy-map.json");
  const anatomy = readJson(anatomyPath);
  anatomy.organs ||= {};
  anatomy.subregions ||= {};

  const addOrgan = (id, ja, en, synonyms = []) => {
    const current = anatomy.organs[id] || {};
    anatomy.organs[id] = {
      parent_body_region: current.parent_body_region || "brain",
      label: { ja: current.label?.ja || ja, en: current.label?.en || en },
      synonyms: Array.from(new Set([...(current.synonyms || []), ja, en, ...synonyms])).filter(Boolean)
    };
  };

  const addSubregion = (id, ja, en, synonyms = []) => {
    const current = anatomy.subregions[id] || {};
    anatomy.subregions[id] = {
      label: { ja: current.label?.ja || ja, en: current.label?.en || en },
      synonyms: Array.from(new Set([...(current.synonyms || []), ja, en, ...synonyms])).filter(Boolean)
    };
  };

  addOrgan("brainstem", "脳幹", "brainstem", ["midbrain", "pons", "medulla"]);
  addOrgan("cerebellum", "小脳", "cerebellum", ["cerebellar"]);
  addOrgan("hippocampus", "海馬", "hippocampus", ["hippocampal"]);
  addOrgan("orbit", "眼窩", "orbit", ["orbital"]);
  addOrgan("inner_ear", "内耳", "inner ear", ["labyrinth"]);

  addSubregion("pons", "橋", "pons", ["pontine"]);
  addSubregion("midbrain", "中脳", "midbrain", ["mesencephalon"]);
  addSubregion("medulla", "延髄", "medulla", ["medulla oblongata"]);
  addSubregion("cerebellum", "小脳", "cerebellum", ["cerebellar hemisphere"]);
  addSubregion("cerebellar_dentate_nucleus", "小脳歯状核", "dentate nucleus", ["dentate nuclei"]);
  addSubregion("hippocampus", "海馬", "hippocampus", ["hippocampal formation"]);
  addSubregion("mesial_temporal_lobe", "側頭葉内側", "mesial temporal lobe", ["medial temporal lobe"]);
  addSubregion("amygdala", "扁桃体", "amygdala", []);
  addSubregion("insula", "島皮質", "insula", ["insular cortex"]);
  addSubregion("thalami", "視床", "thalami", ["thalamus", "bilateral thalami"]);
  addSubregion("globus_pallidus", "淡蒼球", "globus pallidus", ["pallidum"]);
  addSubregion("basal_cistern", "脳底槽", "basal cistern", ["basilar cistern"]);
  addSubregion("subarachnoid_space", "くも膜下腔", "subarachnoid space", ["sulci", "cisterns"]);
  addSubregion("gray_white_junction", "灰白質白質境界", "gray-white junction", ["grey-white junction"]);
  addSubregion("anterior_temporal_pole", "前側頭極", "anterior temporal pole", ["temporal pole"]);
  addSubregion("external_capsule", "外包", "external capsule", []);
  addSubregion("internal_capsule", "内包", "internal capsule", []);
  addSubregion("optic_chiasm", "視交叉", "optic chiasm", []);
  addSubregion("suprasellar_region", "鞍上部", "suprasellar region", ["suprasellar"]);
  addSubregion("sellar_region", "鞍内", "sellar region", ["sella", "pituitary fossa"]);
  addSubregion("cavernous_sinus", "海綿静脈洞", "cavernous sinus", []);
  addSubregion("cerebellopontine_angle", "小脳橋角部", "cerebellopontine angle", ["CPA"]);
  addSubregion("internal_auditory_canal", "内耳道", "internal auditory canal", ["IAC"]);
  addSubregion("pineal_region", "松果体部", "pineal region", []);
  addSubregion("choroid_plexus", "脈絡叢", "choroid plexus", []);
  addSubregion("foramen_of_monro", "Monro孔", "foramen of Monro", ["Monro foramen"]);
  addSubregion("dural_venous_sinus", "硬膜静脈洞", "dural venous sinus", ["venous sinus"]);
  addSubregion("convexity", "円蓋部", "convexity", ["cerebral convexity"]);
  addSubregion("posterior_fossa", "後頭蓋窩", "posterior fossa", []);

  writeJson(anatomyPath, anatomy);
  return {
    organs: Object.keys(anatomy.organs).length,
    subregions: Object.keys(anatomy.subregions).length
  };
}

function main() {
  const normalized = normalizeNonContrastCodes();
  const synonymCount = ensureSynonyms();
  const anatomyCounts = ensureAnatomy();
  console.log(`Normalized acquisition codes: ${normalized.replacements} replacements in ${normalized.changedFiles} files.`);
  console.log(`Synonym map entries: ${synonymCount}`);
  console.log(`Anatomy dictionary: ${anatomyCounts.organs} organs, ${anatomyCounts.subregions} subregions.`);
}

main();

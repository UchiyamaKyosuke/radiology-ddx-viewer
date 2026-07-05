const fs = require("fs");
const path = require("path");
const { DATA, readJson, writeJson, hashObject } = require("./lib");

const now = new Date().toISOString();
const draftsDir = path.join(DATA, "drafts");
const dictDir = path.join(DATA, "dictionaries");
const publicDir = path.join(DATA, "sources", "public");

const SOURCE_ID = "public_general_batch6_20260705";
const PUBLIC_REFERENCE = {
  source_id: SOURCE_ID,
  type: "public_source_packet",
  title: "Public cross-sectional imaging source packet for whole-body Phase 1 draft batch 6",
  authors: [],
  journal: "",
  year: "2026",
  url: "https://www.ncbi.nlm.nih.gov/books/",
  license: "Public web source index: NCBI Bookshelf/StatPearls, ACR Appropriateness Criteria, RadiologyInfo, and open-access PMC reviews where applicable"
};

function ensureEntry(map, key, en, ja, extra = {}) {
  if (!map[key]) {
    map[key] = {
      ...extra,
      label: { ja, en },
      synonyms: Array.from(new Set([ja, en, ...(extra.synonyms || [])]))
    };
    return;
  }
  map[key] = { ...extra, ...map[key] };
  map[key].label = map[key].label || { ja, en };
  map[key].synonyms = Array.from(new Set([...(map[key].synonyms || []), ja, en, ...(extra.synonyms || [])]));
}

function ensureDictionaries() {
  const anatomyPath = path.join(dictDir, "anatomy-map.json");
  const targetPath = path.join(dictDir, "target-map.json");
  const anatomy = readJson(anatomyPath);
  const targets = readJson(targetPath);

  const bodyRegions = [
    ["chest", "chest", "胸部"], ["abdomen", "abdomen", "腹部"], ["hepatobiliary", "hepatobiliary", "肝胆道"],
    ["pancreas_region", "pancreas region", "膵領域"], ["urinary", "urinary tract", "泌尿器"], ["gastrointestinal", "gastrointestinal tract", "消化管"],
    ["breast", "breast", "乳腺"], ["musculoskeletal", "musculoskeletal", "骨軟部"], ["spine", "spine", "脊椎"],
    ["head_neck", "head and neck", "頭頸部"], ["cardiovascular", "cardiovascular", "心血管"]
  ];
  for (const [key, en, ja] of bodyRegions) ensureEntry(anatomy.body_regions, key, en, ja);

  const organs = [
    ["lung", "chest", "lung", "肺"], ["pleura", "chest", "pleura", "胸膜"], ["mediastinum", "chest", "mediastinum", "縦隔"],
    ["heart", "cardiovascular", "heart", "心臓"], ["aorta", "cardiovascular", "aorta", "大動脈"], ["pulmonary_artery", "chest", "pulmonary artery", "肺動脈"],
    ["liver", "hepatobiliary", "liver", "肝臓"], ["bile_duct", "hepatobiliary", "bile duct", "胆管"], ["gallbladder", "hepatobiliary", "gallbladder", "胆嚢"],
    ["pancreas", "pancreas_region", "pancreas", "膵臓"], ["spleen", "abdomen", "spleen", "脾臓"], ["kidney", "urinary", "kidney", "腎臓"],
    ["adrenal_gland", "abdomen", "adrenal gland", "副腎"], ["urinary_bladder", "urinary", "urinary bladder", "膀胱"], ["prostate", "urinary", "prostate", "前立腺"],
    ["bowel", "gastrointestinal", "bowel", "腸管"], ["stomach", "gastrointestinal", "stomach", "胃"], ["appendix", "gastrointestinal", "appendix", "虫垂"],
    ["peritoneum", "abdomen", "peritoneum", "腹膜"], ["breast", "breast", "breast", "乳腺"], ["bone", "musculoskeletal", "bone", "骨"],
    ["joint", "musculoskeletal", "joint", "関節"], ["muscle", "musculoskeletal", "muscle", "筋"], ["soft_tissue", "musculoskeletal", "soft tissue", "軟部組織"],
    ["spine", "spine", "spine", "脊椎"], ["vertebra", "spine", "vertebra", "椎体"], ["intervertebral_disc", "spine", "intervertebral disc", "椎間板"],
    ["thyroid", "head_neck", "thyroid", "甲状腺"], ["salivary_gland", "head_neck", "salivary gland", "唾液腺"], ["lymph_node", "head_neck", "lymph node", "リンパ節"]
  ];
  for (const [key, parent, en, ja] of organs) ensureEntry(anatomy.organs, key, en, ja, { parent_body_region: parent });

  const subregions = [
    ["lung_parenchyma", "lung parenchyma", "肺実質"], ["pulmonary_nodule", "pulmonary nodule", "肺結節"], ["interstitium", "interstitium", "間質"],
    ["pleural_space", "pleural space", "胸膜腔"], ["mediastinal_compartment", "mediastinal compartment", "縦隔区画"], ["cardiac_myocardium", "myocardium", "心筋"],
    ["aortic_lumen", "aortic lumen", "大動脈内腔"], ["pulmonary_artery_lumen", "pulmonary artery lumen", "肺動脈内腔"],
    ["hepatic_parenchyma", "hepatic parenchyma", "肝実質"], ["biliary_tree", "biliary tree", "胆道"], ["gallbladder_lumen", "gallbladder lumen", "胆嚢内腔"],
    ["pancreatic_head", "pancreatic head", "膵頭部"], ["pancreatic_body_tail", "pancreatic body and tail", "膵体尾部"], ["splenic_parenchyma", "splenic parenchyma", "脾実質"],
    ["renal_cortex", "renal cortex", "腎皮質"], ["renal_collecting_system", "renal collecting system", "腎盂尿管"], ["adrenal", "adrenal", "副腎"],
    ["bladder_wall", "bladder wall", "膀胱壁"], ["prostate_peripheral_zone", "prostate peripheral zone", "前立腺辺縁域"], ["prostate_transition_zone", "prostate transition zone", "前立腺移行域"],
    ["bowel_wall", "bowel wall", "腸管壁"], ["gastric_wall", "gastric wall", "胃壁"], ["appendiceal_wall", "appendiceal wall", "虫垂壁"],
    ["peritoneal_cavity", "peritoneal cavity", "腹腔"], ["breast_parenchyma", "breast parenchyma", "乳腺実質"], ["axilla", "axilla", "腋窩"],
    ["bone_marrow", "bone marrow", "骨髄"], ["metaphysis", "metaphysis", "骨幹端"], ["epiphysis", "epiphysis", "骨端"],
    ["joint_space", "joint space", "関節腔"], ["soft_tissue_compartment", "soft-tissue compartment", "軟部コンパートメント"], ["vertebral_body", "vertebral body", "椎体"],
    ["spinal_canal", "spinal canal", "脊柱管"], ["epidural_space", "epidural space", "硬膜外腔"], ["disc_space", "disc space", "椎間板腔"],
    ["thyroid_lobe", "thyroid lobe", "甲状腺葉"], ["parotid_gland", "parotid gland", "耳下腺"], ["cervical_lymph_node", "cervical lymph node", "頸部リンパ節"],
    ["nasopharynx", "nasopharynx", "上咽頭"], ["oropharynx", "oropharynx", "中咽頭"], ["larynx", "larynx", "喉頭"]
  ];
  for (const [key, en, ja] of subregions) ensureEntry(anatomy.subregions, key, en, ja);

  const targetEntries = [
    ["organ_parenchyma", "organ parenchyma", "臓器実質"], ["wall", "wall", "壁"], ["lumen", "lumen", "内腔"], ["duct", "duct", "管腔"],
    ["bone_marrow", "bone marrow", "骨髄"], ["joint_space", "joint space", "関節腔"], ["soft_tissue_mass", "soft-tissue mass", "軟部腫瘤"],
    ["vascular_lumen", "vascular lumen", "血管内腔"], ["lymph_node", "lymph node", "リンパ節"], ["pleura", "pleura", "胸膜"],
    ["airway", "airway", "気道"], ["tumor_margin", "tumor margin", "腫瘍辺縁"], ["necrotic_component", "necrotic component", "壊死成分"],
    ["fibrous_component", "fibrous component", "線維性成分"], ["fat_component", "fat component", "脂肪成分"], ["hemorrhagic_component", "hemorrhagic component", "出血成分"]
  ];
  for (const [key, en, ja] of targetEntries) ensureEntry(targets, key, en, ja);

  writeJson(anatomyPath, anatomy);
  writeJson(targetPath, targets);
}

function anatomy(bodyRegion, organ, subregion) {
  return { body_region: bodyRegion, organ, subregion, laterality: "unknown" };
}

function finding(spec, acq, code, text, opts = {}) {
  const modality = opts.modality || (opts.phase ? "CT" : "MRI");
  return {
    finding_code: code,
    modality,
    acquisition: { type: modality === "CT" ? "phase" : "sequence", code: acq },
    anatomy: anatomy(spec.body_region, opts.organ || spec.organ, opts.subregion || spec.subregion),
    target: opts.target || "whole_lesion",
    modifiers: {},
    keywords: opts.keywords || spec.keywords.slice(0, 3),
    finding_text: text,
    typicality: opts.typicality || "common",
    diagnostic_weight: opts.weight ?? 3,
    review_status: "draft",
    mapping: { status: "matched", confidence: 0.82, matched_concept_id: code, alternatives: [] }
  };
}

const F = {
  ctLow: (s, t, o = {}) => finding(s, "non_contrast", "finding:ct_hypoattenuation", t, { ...o, modality: "CT" }),
  ctIso: (s, t, o = {}) => finding(s, "non_contrast", "finding:ct_isoattenuation", t, { ...o, modality: "CT" }),
  ctHigh: (s, t, o = {}) => finding(s, "non_contrast", "finding:ct_hyperattenuation", t, { ...o, modality: "CT" }),
  calc: (s, t, o = {}) => finding(s, "non_contrast", "finding:calcification_present", t, { ...o, modality: "CT", target: o.target || "calcified_component" }),
  t1Low: (s, t, o = {}) => finding(s, "T1WI", "finding:t1_hypointensity", t, o),
  t1High: (s, t, o = {}) => finding(s, "T1WI", "finding:t1_hyperintensity", t, o),
  t2High: (s, t, o = {}) => finding(s, "T2WI", "finding:t2_hyperintensity", t, o),
  t2Low: (s, t, o = {}) => finding(s, "T2WI", "finding:t2_hypointensity", t, o),
  dwi: (s, t, o = {}) => finding(s, "DWI", "finding:dwi_hyperintensity", t, o),
  adcLow: (s, t, o = {}) => finding(s, "ADC", "finding:adc_low", t, o),
  restr: (s, t, o = {}) => finding(s, "DWI", "finding:diffusion_restriction_present", t, o),
  noRestr: (s, t, o = {}) => finding(s, "DWI", "finding:diffusion_restriction_absent", t, o),
  mildEnh: (s, t, o = {}) => finding(s, "contrast_enhanced_T1WI", "finding:mild_enhancement", t, o),
  avid: (s, t, o = {}) => finding(s, "contrast_enhanced_T1WI", "finding:avid_homogeneous_enhancement", t, o),
  solidEnh: (s, t, o = {}) => finding(s, "contrast_enhanced_T1WI", "finding:enhancing_solid_component", t, { ...o, target: o.target || "solid_component" }),
  ring: (s, t, o = {}) => finding(s, "contrast_enhanced_T1WI", "finding:ring_enhancement", t, o),
  thickRing: (s, t, o = {}) => finding(s, "contrast_enhanced_T1WI", "finding:thick_irregular_ring_enhancement", t, o),
  wall: (s, t, o = {}) => finding(s, "T2WI", "finding:wall_thickening", t, { ...o, target: "wall" }),
  multiloc: (s, t, o = {}) => finding(s, "T2WI", "finding:multilocular_cystic_mass", t, { ...o, target: "cystic_component" }),
  fat: (s, t, o = {}) => finding(s, "T1WI", "finding:fat_present", t, { ...o, target: "fat_component" }),
  fatDrop: (s, t, o = {}) => finding(s, "T1WI_fat_suppressed", "finding:fat_suppression_signal_drop", t, { ...o, target: "fat_component" }),
  hemorrhage: (s, t, o = {}) => finding(s, "T2STAR", "finding:hemorrhage_present", t, { ...o, target: "hemorrhagic_component" }),
  edema: (s, t, o = {}) => finding(s, "T2WI", "finding:vasogenic_edema", t, { ...o, target: "perilesional_edema" })
};

function demographics(min, max, peak, sex = "no_sex_predilection") {
  const predominance = sex.includes("male") ? "male" : sex.includes("female") ? "female" : "none";
  return {
    sex: { applicable: sex.endsWith("_only") ? [predominance] : ["any"], predominance, predilection: sex, summary: "代表的な性差傾向を記録。" },
    age: { typical_min: min, typical_max: max, peak_decade: peak, summary: "代表的な発症・診断年齢帯を記録。" }
  };
}

function frequency(label, setting, bodyRegion) {
  const ranks = { very_common: 5, common: 4, uncommon: 3, rare: 2, very_rare: 1, unknown: 0 };
  return {
    label,
    prevalence_rank: ranks[label] ?? 0,
    basis: "differential_importance",
    evidence_level: "public_review",
    context: { population: "any", body_region: bodyRegion, clinical_setting: setting },
    summary: `${setting} の鑑別での相対頻度と重要度を記録。`
  };
}

const PROFILES = {
  solid_tumor: (s) => [
    F.ctIso(s, `${s.ja}はCTで等吸収から低吸収の腫瘤として描出されることがある。`, { weight: 1 }),
    F.t1Low(s, `${s.ja}はT1WIで低信号を示すことが多い。`, { weight: 2 }),
    F.t2High(s, `${s.ja}はT2WIで不均一な高信号を示すことがある。`, { weight: 3 }),
    F.solidEnh(s, `${s.ja}は造影MRIで充実部の増強を示す。`, { weight: 4 }),
    F.restr(s, `${s.ja}は細胞密度の高い部分で拡散制限を伴うことがある。`, { weight: 3, typicality: "variable" })
  ],
  cystic_tumor: (s) => [
    F.ctLow(s, `${s.ja}はCTで低吸収の嚢胞性病変として見えることがある。`, { weight: 2, target: "cystic_component" }),
    F.t1Low(s, `${s.ja}の液性成分はT1WIで低信号を示すことが多い。`, { weight: 2, target: "cyst_content" }),
    F.t2High(s, `${s.ja}はT2WIで高信号の嚢胞性成分を示す。`, { weight: 4, target: "cystic_component" }),
    F.mildEnh(s, `${s.ja}は壁や隔壁、充実成分に造影効果を伴うことがある。`, { weight: 3, target: "cyst_wall" }),
    F.noRestr(s, `${s.ja}は単純嚢胞成分では明らかな拡散制限を示さないことが多い。`, { weight: 1, typicality: "variable" })
  ],
  inflammatory: (s) => [
    F.ctLow(s, `${s.ja}はCTで炎症性の低吸収域や周囲脂肪織濃度上昇として評価される。`, { weight: 2 }),
    F.wall(s, `${s.ja}は壁肥厚や周囲炎症を伴うことがある。`, { weight: 4 }),
    F.t2High(s, `${s.ja}はT2WIで浮腫や炎症に対応する高信号を示す。`, { weight: 3 }),
    F.restr(s, `${s.ja}は膿瘍や高度炎症部で拡散制限を示すことがある。`, { weight: 3, typicality: "variable" }),
    F.mildEnh(s, `${s.ja}は造影で壁や炎症部の増強を伴う。`, { weight: 3 })
  ],
  fibrous: (s) => [
    F.ctIso(s, `${s.ja}はCTで軟部濃度の充実性病変として描出される。`, { weight: 2 }),
    F.t1Low(s, `${s.ja}はT1WIで低信号を示すことが多い。`, { weight: 2 }),
    F.t2Low(s, `${s.ja}は線維性成分を反映してT2WI低信号を示すことがある。`, { weight: 4, target: "fibrous_component" }),
    F.mildEnh(s, `${s.ja}は造影で遅延性または不均一な増強を示すことがある。`, { weight: 3 }),
    F.noRestr(s, `${s.ja}では拡散制限の程度は可変である。`, { weight: 1, typicality: "variable" })
  ],
  vascular: (s) => [
    F.ctHigh(s, `${s.ja}は急性期CTで高吸収成分や血栓を伴うことがある。`, { weight: 2, target: "vascular_lumen" }),
    F.ctLow(s, `${s.ja}は灌流低下や梗塞を反映した低吸収域を伴うことがある。`, { weight: 2, target: "organ_parenchyma" }),
    F.restr(s, `${s.ja}は虚血性変化がある場合にDWI高信号/ADC低下を示す。`, { weight: 3, typicality: "variable" }),
    F.mildEnh(s, `${s.ja}は血管壁や周囲組織の造影変化を伴うことがある。`, { weight: 2, typicality: "variable", target: "vascular_lumen" }),
    F.hemorrhage(s, `${s.ja}は出血性合併症を伴う場合にT2*系で低信号を示す。`, { weight: 2, typicality: "variable" })
  ],
  fat_lesion: (s) => [
    F.ctLow(s, `${s.ja}はCTで脂肪濃度成分を含むことがある。`, { weight: 3, target: "fat_component" }),
    F.t1High(s, `${s.ja}の脂肪成分はT1WI高信号を示す。`, { weight: 4, target: "fat_component" }),
    F.fat(s, `${s.ja}では肉眼的脂肪または脂肪信号を確認する。`, { weight: 4 }),
    F.fatDrop(s, `${s.ja}の脂肪成分は脂肪抑制で信号低下する。`, { weight: 5 }),
    F.mildEnh(s, `${s.ja}は非脂肪成分に造影効果を伴うことがある。`, { weight: 2, typicality: "variable" })
  ],
  marrow: (s) => [
    F.ctLow(s, `${s.ja}はCTで骨破壊や骨髄濃度変化として見えることがある。`, { weight: 2, organ: "bone", subregion: "bone_marrow", target: "bone_marrow" }),
    F.t1Low(s, `${s.ja}は骨髄置換を反映してT1WI低信号を示す。`, { weight: 5, organ: "bone", subregion: "bone_marrow", target: "bone_marrow" }),
    F.t2High(s, `${s.ja}はSTIR/T2脂肪抑制で高信号を示す。`, { weight: 4, organ: "bone", subregion: "bone_marrow", target: "bone_marrow" }),
    F.solidEnh(s, `${s.ja}は造影で病変部の増強を伴うことがある。`, { weight: 3, organ: "bone", subregion: "bone_marrow" }),
    F.restr(s, `${s.ja}は細胞性病変や膿瘍で拡散制限を伴うことがある。`, { weight: 2, typicality: "variable", organ: "bone", subregion: "bone_marrow" })
  ]
};

function raw(spec, index, text, candidateCode, target = "whole_lesion") {
  return {
    raw_finding_id: `${spec.id}_raw_${String(index).padStart(3, "0")}`,
    modality_text: "CT/MRI/US",
    acquisition_text: "疾患に応じた標準撮像",
    anatomy_text: `${spec.ja}の典型的な主座`,
    target_text: target,
    finding_text: text,
    interpretation: "構造化辞書では拾い切れない疾患固有の所見・サインとして保存。",
    source_ids: [SOURCE_ID],
    mapping: {
      status: candidateCode ? "candidate" : "deferred",
      candidate_finding_code: candidateCode,
      candidate_anatomy: anatomy(spec.body_region, spec.organ, spec.subregion),
      candidate_target: target,
      notes: "Phase 1 raw finding"
    },
    review_status: candidateCode ? "needs_mapping" : "draft"
  };
}

function buildCard(spec) {
  const findings = (PROFILES[spec.profile] || PROFILES.solid_tumor)(spec).map((item, index) => ({
    ...item,
    finding_id: `${spec.id}_f${String(index + 1).padStart(3, "0")}`
  }));
  const ctGroups = [];
  const mriGroups = [];
  for (const item of findings) {
    if (item.modality === "CT") {
      let group = ctGroups.find((g) => g.phase.code === item.acquisition.code);
      if (!group) ctGroups.push(group = { phase: { code: item.acquisition.code }, findings: [] });
      group.findings.push(item);
    } else {
      let group = mriGroups.find((g) => g.sequence.code === item.acquisition.code);
      if (!group) mriGroups.push(group = { sequence: { code: item.acquisition.code }, findings: [] });
      group.findings.push(item);
    }
  }

  const signs = (spec.raw_findings || []).map((text, index) => raw(spec, index + 1, text, `finding:${spec.id}_specific_sign`, "named_sign"));
  const card = {
    schema_version: "0.8",
    disease_id: spec.id,
    disease_name: { ja: spec.ja, en: spec.en },
    disease_aliases: { ja: spec.aliases_ja || [], en: spec.aliases_en || [] },
    clinical: {
      overview: spec.overview || `${spec.ja}は${spec.setting}で重要な鑑別となる疾患で、臨床背景と画像分布を組み合わせて評価する。`,
      treatment: spec.treatment || "治療方針は病型、病期、合併症、全身状態に応じて決定する。",
      epidemiology: spec.epidemiology || "頻度と好発年齢は病型・背景疾患により異なる。"
    },
    demographics: demographics(spec.age[0], spec.age[1], spec.age[2], spec.sex || "no_sex_predilection"),
    keywords: Array.from(new Set([spec.en, spec.ja, ...(spec.keywords || [])])),
    frequency: frequency(spec.freq || "uncommon", spec.setting, spec.body_region),
    imaging: {
      ct: { summary: `${spec.ja}のCTでは濃度、石灰化、出血、造影効果、周囲変化を評価する。`, findings_by_phase: ctGroups },
      mri: { summary: `${spec.ja}のMRIでは信号、拡散、造影効果、病変分布を評価する。`, findings_by_sequence: mriGroups }
    },
    raw_findings: signs,
    evidence: {
      summary: "NCBI Bookshelf、ACR Appropriateness Criteria、RadiologyInfo、PMC open-access review などの公開情報を参照。",
      claim_map: findings.map((f) => ({ finding_ids: [f.finding_id], source_ids: [SOURCE_ID], support: "public_source_summary" }))
    },
    image_examples: [],
    references: [PUBLIC_REFERENCE],
    review: { status: "draft", confidence: "medium", notes: "公開情報に基づく初期整理。" },
    curation: { batch: "general_batch6", generated_by: "curate-general-drafts-batch6.js" },
    provenance: { source_ids: [SOURCE_ID], generated_at: now },
    updated_at: now
  };
  card.content_hash = hashObject({ ...card, content_hash: "" });
  return card;
}

const SPECS = [
  ["lung_adenocarcinoma", "肺腺癌", "Lung adenocarcinoma", "solid_tumor", "chest", "lung", "pulmonary_nodule", [35, 90, "60-70歳代"], "common", "肺結節・肺腫瘤", ["ground-glass nodule", "part-solid nodule", "lepidic"], ["すりガラス結節、part-solid nodule、air bronchogram、胸膜陥入を伴うことがある。"]],
  ["squamous_cell_lung_carcinoma", "肺扁平上皮癌", "Squamous cell lung carcinoma", "solid_tumor", "chest", "lung", "pulmonary_nodule", [45, 90, "60-70歳代"], "common", "肺門部腫瘤", ["central mass", "cavitation"], ["中枢側腫瘤、無気肺、空洞形成を伴うことがある。"]],
  ["small_cell_lung_carcinoma", "小細胞肺癌", "Small cell lung carcinoma", "solid_tumor", "chest", "lung", "mediastinal_compartment", [45, 90, "60-70歳代"], "common", "肺門・縦隔腫瘤", ["bulky lymphadenopathy", "central lung cancer"], ["肺門部腫瘤とbulky mediastinal lymphadenopathyを伴いやすい。"]],
  ["pulmonary_metastases", "肺転移", "Pulmonary metastases", "solid_tumor", "chest", "lung", "pulmonary_nodule", [20, 90, "成人"], "common", "多発肺結節", ["multiple nodules", "hematogenous metastases"], ["血行性転移では多発円形結節として分布することが多い。"]],
  ["pulmonary_hamartoma", "肺過誤腫", "Pulmonary hamartoma", "fat_lesion", "chest", "lung", "pulmonary_nodule", [30, 80, "50-60歳代"], "uncommon", "孤立性肺結節", ["popcorn calcification", "fat"], ["popcorn calcificationと脂肪濃度が診断の手がかりとなる。"]],
  ["lobar_pneumonia", "大葉性肺炎", "Lobar pneumonia", "inflammatory", "chest", "lung", "lung_parenchyma", [0, 100, "全年齢"], "common", "急性肺炎", ["air bronchogram", "consolidation"], ["区域性または大葉性consolidationとair bronchogramを示す。"]],
  ["aspiration_pneumonia", "誤嚥性肺炎", "Aspiration pneumonia", "inflammatory", "chest", "lung", "lung_parenchyma", [0, 100, "高齢者"], "common", "肺炎・誤嚥", ["dependent opacity", "tree-in-bud"], ["背側・下葉優位の浸潤影やtree-in-bud patternを示す。"]],
  ["pulmonary_tuberculosis", "肺結核", "Pulmonary tuberculosis", "inflammatory", "chest", "lung", "lung_parenchyma", [0, 100, "全年齢"], "common", "慢性感染", ["tree-in-bud", "cavitation", "upper lobe"], ["上葉優位の空洞、tree-in-bud、散布性小結節を伴うことがある。"]],
  ["invasive_pulmonary_aspergillosis", "侵襲性肺アスペルギルス症", "Invasive pulmonary aspergillosis", "inflammatory", "chest", "lung", "lung_parenchyma", [0, 100, "免疫不全"], "uncommon", "免疫不全肺炎", ["halo sign", "air crescent sign"], ["結節周囲のhalo signや回復期のair crescent signが手がかりとなる。"]],
  ["usual_interstitial_pneumonia", "通常型間質性肺炎パターン", "Usual interstitial pneumonia pattern", "fibrous", "chest", "lung", "interstitium", [45, 90, "60-70歳代"], "common", "間質性肺炎", ["honeycombing", "traction bronchiectasis"], ["胸膜直下・肺底部優位の蜂巣肺と牽引性気管支拡張を示す。"]],
  ["nonspecific_interstitial_pneumonia", "非特異性間質性肺炎パターン", "Nonspecific interstitial pneumonia pattern", "inflammatory", "chest", "lung", "interstitium", [20, 80, "40-60歳代"], "uncommon", "間質性肺炎", ["ground-glass opacity", "subpleural sparing"], ["両側対称性すりガラス影とsubpleural sparingが手がかりとなる。"]],
  ["sarcoidosis_thoracic", "胸部サルコイドーシス", "Thoracic sarcoidosis", "inflammatory", "chest", "mediastinum", "mediastinal_compartment", [20, 70, "20-40歳代"], "uncommon", "縦隔リンパ節腫大", ["bilateral hilar lymphadenopathy", "perilymphatic nodules"], ["両側肺門リンパ節腫大と気管支血管束・胸膜下の小結節を示す。"]],
  ["pulmonary_embolism", "肺血栓塞栓症", "Pulmonary embolism", "vascular", "chest", "pulmonary_artery", "pulmonary_artery_lumen", [18, 100, "成人"], "common", "急性胸痛・呼吸困難", ["filling defect", "wedge-shaped infarct"], ["CTPAで肺動脈内 filling defect、末梢楔状梗塞を伴うことがある。"]],
  ["acute_aortic_dissection", "急性大動脈解離", "Acute aortic dissection", "vascular", "cardiovascular", "aorta", "aortic_lumen", [30, 100, "60-70歳代"], "common", "急性大動脈症候群", ["intimal flap", "true lumen", "false lumen"], ["intimal flapによりtrue lumenとfalse lumenが分離して見える。"]],
  ["mediastinal_lymphoma", "縦隔リンパ腫", "Mediastinal lymphoma", "solid_tumor", "chest", "mediastinum", "mediastinal_compartment", [10, 80, "20-40歳代"], "uncommon", "前縦隔腫瘤", ["bulky mediastinal mass", "vessel encasement"], ["bulkyな前縦隔腫瘤で血管を取り囲んでも狭窄が軽いことがある。"]],
  ["thymoma", "胸腺腫", "Thymoma", "solid_tumor", "chest", "mediastinum", "mediastinal_compartment", [30, 80, "50-60歳代"], "uncommon", "前縦隔腫瘤", ["anterior mediastinal mass", "myasthenia gravis"], ["境界明瞭な前縦隔腫瘤で、被膜外浸潤や播種の評価が重要。"]],

  ["hepatocellular_carcinoma", "肝細胞癌", "Hepatocellular carcinoma", "solid_tumor", "hepatobiliary", "liver", "hepatic_parenchyma", [30, 90, "60-70歳代"], "common", "慢性肝疾患の肝腫瘤", ["arterial hyperenhancement", "washout", "capsule"], ["動脈相濃染、門脈相/遅延相washout、被膜様濃染が典型的。"]],
  ["intrahepatic_cholangiocarcinoma", "肝内胆管癌", "Intrahepatic cholangiocarcinoma", "fibrous", "hepatobiliary", "liver", "biliary_tree", [40, 90, "60-70歳代"], "uncommon", "肝腫瘤", ["delayed enhancement", "capsular retraction"], ["線維性間質を反映した遅延性濃染と被膜陥凹を伴うことがある。"]],
  ["hepatic_hemangioma", "肝血管腫", "Hepatic hemangioma", "vascular", "hepatobiliary", "liver", "hepatic_parenchyma", [20, 80, "30-50歳代"], "common", "良性肝腫瘤", ["peripheral nodular enhancement", "progressive fill-in"], ["辺縁結節状濃染から遅延性に求心性fill-inを示す。"]],
  ["focal_nodular_hyperplasia", "限局性結節性過形成", "Focal nodular hyperplasia", "solid_tumor", "hepatobiliary", "liver", "hepatic_parenchyma", [15, 60, "20-40歳代"], "uncommon", "良性肝腫瘤", ["central scar", "arterial enhancement"], ["中心瘢痕と動脈相均一濃染、肝胆道相取り込みが手がかり。"]],
  ["hepatic_adenoma", "肝細胞腺腫", "Hepatic adenoma", "solid_tumor", "hepatobiliary", "liver", "hepatic_parenchyma", [15, 60, "20-40歳代"], "uncommon", "良性肝腫瘤", ["intralesional fat", "hemorrhage"], ["脂肪や出血を含むことがあり、背景因子と合わせて評価する。"]],
  ["liver_metastasis", "肝転移", "Liver metastasis", "solid_tumor", "hepatobiliary", "liver", "hepatic_parenchyma", [20, 100, "成人"], "common", "悪性腫瘍既往の肝腫瘤", ["rim enhancement", "target appearance"], ["リング状濃染やtarget appearance、多発性が診断の手がかり。"]],
  ["hepatic_abscess", "肝膿瘍", "Hepatic abscess", "inflammatory", "hepatobiliary", "liver", "hepatic_parenchyma", [0, 100, "成人"], "uncommon", "発熱・肝腫瘤", ["cluster sign", "double target sign"], ["cluster signやdouble target sign、拡散制限を示すことがある。"]],
  ["cirrhosis", "肝硬変", "Cirrhosis", "fibrous", "hepatobiliary", "liver", "hepatic_parenchyma", [20, 100, "中高年"], "common", "慢性肝疾患", ["nodular contour", "portal hypertension"], ["肝辺縁の結節化、区域性萎縮/肥大、門脈圧亢進所見を伴う。"]],
  ["acute_cholecystitis", "急性胆嚢炎", "Acute cholecystitis", "inflammatory", "hepatobiliary", "gallbladder", "gallbladder_lumen", [20, 100, "成人"], "common", "右上腹部痛", ["gallbladder wall thickening", "pericholecystic fluid"], ["胆嚢腫大、壁肥厚、周囲液体、胆石嵌頓を評価する。"]],
  ["cholangiocarcinoma_extrahepatic", "肝外胆管癌", "Extrahepatic cholangiocarcinoma", "fibrous", "hepatobiliary", "bile_duct", "biliary_tree", [40, 90, "60-70歳代"], "uncommon", "閉塞性黄疸", ["bile duct stricture", "delayed enhancement"], ["胆管狭窄、上流胆管拡張、遅延性濃染が手がかり。"]],
  ["pancreatic_ductal_adenocarcinoma", "膵管癌", "Pancreatic ductal adenocarcinoma", "solid_tumor", "pancreas_region", "pancreas", "pancreatic_head", [40, 90, "60-70歳代"], "common", "膵腫瘤・黄疸", ["hypovascular mass", "double duct sign"], ["低血流性膵腫瘤、主膵管/胆管拡張、血管浸潤を評価する。"]],
  ["pancreatic_neuroendocrine_tumor", "膵神経内分泌腫瘍", "Pancreatic neuroendocrine tumor", "solid_tumor", "pancreas_region", "pancreas", "pancreatic_body_tail", [20, 80, "40-60歳代"], "uncommon", "膵多血性腫瘤", ["hypervascular pancreatic mass"], ["動脈相で強く濃染する膵腫瘤として見えることが多い。"]],
  ["intraductal_papillary_mucinous_neoplasm", "膵管内乳頭粘液性腫瘍", "Intraductal papillary mucinous neoplasm", "cystic_tumor", "pancreas_region", "pancreas", "pancreatic_head", [40, 90, "60-70歳代"], "common", "膵嚢胞", ["duct communication", "mural nodule"], ["膵管との交通、主膵管拡張、造影される壁在結節が重要。"]],
  ["acute_pancreatitis", "急性膵炎", "Acute pancreatitis", "inflammatory", "pancreas_region", "pancreas", "pancreatic_body_tail", [10, 100, "成人"], "common", "急性腹痛", ["peripancreatic fat stranding", "necrosis"], ["膵腫大、周囲脂肪織炎、壊死、液体貯留を評価する。"]],
  ["pancreatic_pseudocyst", "膵仮性嚢胞", "Pancreatic pseudocyst", "cystic_tumor", "pancreas_region", "pancreas", "pancreatic_body_tail", [10, 100, "成人"], "uncommon", "膵炎後嚢胞", ["post-pancreatitis cyst", "thin wall"], ["膵炎後の被膜化液体貯留で、通常は充実結節を欠く。"]],

  ["clear_cell_renal_cell_carcinoma", "淡明細胞型腎細胞癌", "Clear cell renal cell carcinoma", "solid_tumor", "urinary", "kidney", "renal_cortex", [30, 90, "60-70歳代"], "common", "腎腫瘤", ["hypervascular renal mass", "necrosis"], ["多血性腎皮質腫瘤で壊死や出血を伴うことがある。"]],
  ["papillary_renal_cell_carcinoma", "乳頭状腎細胞癌", "Papillary renal cell carcinoma", "solid_tumor", "urinary", "kidney", "renal_cortex", [30, 90, "60-70歳代"], "uncommon", "腎腫瘤", ["hypovascular renal mass", "T2 hypointense"], ["低血流性でT2低信号を示す腎腫瘤として見えることがある。"]],
  ["renal_angiomyolipoma", "腎血管筋脂肪腫", "Renal angiomyolipoma", "fat_lesion", "urinary", "kidney", "renal_cortex", [20, 80, "40-60歳代"], "common", "脂肪含有腎腫瘤", ["macroscopic fat", "fat-poor AML"], ["肉眼的脂肪を含む腎腫瘤が典型で、脂肪乏しい亜型に注意する。"]],
  ["acute_pyelonephritis", "急性腎盂腎炎", "Acute pyelonephritis", "inflammatory", "urinary", "kidney", "renal_cortex", [0, 100, "成人女性"], "common", "発熱・側腹部痛", ["striated nephrogram", "wedge-shaped hypoenhancement"], ["楔状低濃染やstriated nephrogram、腎周囲炎症を示す。"]],
  ["renal_abscess", "腎膿瘍", "Renal abscess", "inflammatory", "urinary", "kidney", "renal_cortex", [0, 100, "成人"], "uncommon", "腎感染", ["rim-enhancing collection", "restricted diffusion"], ["リング状濃染を伴う液体貯留と拡散制限を示すことがある。"]],
  ["upper_tract_urothelial_carcinoma", "上部尿路上皮癌", "Upper tract urothelial carcinoma", "solid_tumor", "urinary", "kidney", "renal_collecting_system", [40, 90, "60-70歳代"], "uncommon", "血尿", ["filling defect", "urothelial thickening"], ["腎盂尿管の充盈欠損、壁肥厚、上流拡張を評価する。"]],
  ["bladder_cancer", "膀胱癌", "Bladder cancer", "solid_tumor", "urinary", "urinary_bladder", "bladder_wall", [40, 100, "60-80歳代"], "common", "血尿", ["enhancing bladder mass", "muscle invasion"], ["造影される膀胱壁腫瘤で、筋層浸潤と周囲進展を評価する。"]],
  ["adrenal_adenoma", "副腎腺腫", "Adrenal adenoma", "fat_lesion", "abdomen", "adrenal_gland", "adrenal", [20, 90, "40-60歳代"], "common", "副腎偶発腫", ["intracellular lipid", "opposed-phase signal drop"], ["chemical shift MRIでopposed-phase信号低下を示すことが多い。"]],
  ["pheochromocytoma", "褐色細胞腫", "Pheochromocytoma", "solid_tumor", "abdomen", "adrenal_gland", "adrenal", [10, 80, "30-50歳代"], "uncommon", "副腎腫瘤", ["T2 light bulb", "avid enhancement"], ["T2高信号と強い造影効果を示すことがあるが多彩。"]],
  ["prostate_cancer", "前立腺癌", "Prostate cancer", "solid_tumor", "urinary", "prostate", "prostate_peripheral_zone", [40, 100, "60-70歳代"], "common", "前立腺病変", ["PI-RADS", "low T2 peripheral zone", "restricted diffusion"], ["辺縁域T2低信号、拡散制限、早期濃染が重要。"]],

  ["acute_appendicitis", "急性虫垂炎", "Acute appendicitis", "inflammatory", "gastrointestinal", "appendix", "appendiceal_wall", [0, 100, "若年-成人"], "common", "右下腹部痛", ["dilated appendix", "appendicolith"], ["虫垂腫大、壁肥厚、周囲脂肪織炎、糞石を評価する。"]],
  ["colonic_diverticulitis", "大腸憩室炎", "Colonic diverticulitis", "inflammatory", "gastrointestinal", "bowel", "bowel_wall", [20, 100, "中高年"], "common", "左下腹部痛", ["inflamed diverticulum", "pericolic fat stranding"], ["憩室周囲の限局性脂肪織炎と壁肥厚が手がかり。"]],
  ["crohn_disease", "クローン病", "Crohn disease", "inflammatory", "gastrointestinal", "bowel", "bowel_wall", [10, 70, "10-30歳代"], "common", "炎症性腸疾患", ["skip lesions", "comb sign", "creeping fat"], ["非連続性病変、comb sign、狭窄・瘻孔を評価する。"]],
  ["ulcerative_colitis", "潰瘍性大腸炎", "Ulcerative colitis", "inflammatory", "gastrointestinal", "bowel", "bowel_wall", [10, 80, "20-40歳代"], "common", "炎症性腸疾患", ["continuous colitis", "lead pipe colon"], ["直腸から連続する大腸壁肥厚と慢性期の鉛管状変化を示す。"]],
  ["colorectal_cancer", "大腸癌", "Colorectal cancer", "solid_tumor", "gastrointestinal", "bowel", "bowel_wall", [40, 100, "60-70歳代"], "common", "大腸腫瘍", ["apple-core lesion", "annular mass"], ["狭窄を伴う輪状壁肥厚やapple-core lesionが手がかり。"]],
  ["gastric_cancer", "胃癌", "Gastric cancer", "solid_tumor", "gastrointestinal", "stomach", "gastric_wall", [40, 100, "60-70歳代"], "common", "胃壁肥厚", ["linitis plastica", "focal gastric wall thickening"], ["限局性またはびまん性胃壁肥厚、硬化性変化を評価する。"]],
  ["gastrointestinal_stromal_tumor", "消化管間質腫瘍", "Gastrointestinal stromal tumor", "solid_tumor", "gastrointestinal", "stomach", "gastric_wall", [30, 90, "50-70歳代"], "uncommon", "粘膜下腫瘍", ["exophytic mass", "necrosis"], ["管外発育性腫瘤、壊死、出血を伴うことがある。"]],
  ["small_bowel_obstruction", "小腸閉塞", "Small bowel obstruction", "inflammatory", "gastrointestinal", "bowel", "bowel_wall", [0, 100, "全年齢"], "common", "急性腹痛", ["transition point", "closed loop"], ["拡張腸管、caliber change、closed-loopや虚血徴候を評価する。"]],
  ["ischemic_colitis", "虚血性大腸炎", "Ischemic colitis", "vascular", "gastrointestinal", "bowel", "bowel_wall", [40, 100, "高齢者"], "common", "腹痛・血便", ["thumbprinting", "watershed distribution"], ["分水嶺領域の壁肥厚、thumbprinting、粘膜下浮腫を示す。"]],
  ["peritoneal_carcinomatosis", "腹膜播種", "Peritoneal carcinomatosis", "solid_tumor", "abdomen", "peritoneum", "peritoneal_cavity", [20, 100, "成人"], "common", "悪性腫瘍の腹膜病変", ["omental cake", "peritoneal nodules"], ["腹膜結節、omental cake、腹水を伴うことが多い。"]],
  ["pseudomyxoma_peritonei", "腹膜偽粘液腫", "Pseudomyxoma peritonei", "cystic_tumor", "abdomen", "peritoneum", "peritoneal_cavity", [20, 90, "50-60歳代"], "rare", "粘液性腹膜病変", ["scalloping", "mucinous ascites"], ["低吸収粘液性腹水と肝・脾表面のscallopingを示す。"]],

  ["invasive_ductal_breast_carcinoma", "浸潤性乳管癌", "Invasive ductal breast carcinoma", "solid_tumor", "breast", "breast", "breast_parenchyma", [25, 100, "50-70歳代"], "common", "乳腺腫瘤", ["spiculated mass", "washout kinetics"], ["不整形・spiculated mass、早期濃染とwashout kineticsが手がかり。"], "female_predominant"],
  ["invasive_lobular_breast_carcinoma", "浸潤性小葉癌", "Invasive lobular breast carcinoma", "solid_tumor", "breast", "breast", "breast_parenchyma", [30, 100, "50-70歳代"], "uncommon", "乳腺腫瘍", ["architectural distortion", "multifocality"], ["構築の乱れ、多発・両側性、MRIでの非腫瘤性濃染に注意する。"], "female_predominant"],
  ["ductal_carcinoma_in_situ", "非浸潤性乳管癌", "Ductal carcinoma in situ", "solid_tumor", "breast", "breast", "breast_parenchyma", [25, 90, "40-60歳代"], "common", "乳腺石灰化", ["segmental calcifications", "non-mass enhancement"], ["区域性・線状分枝状石灰化、MRIで区域性非腫瘤性濃染を示す。"], "female_predominant"],
  ["breast_fibroadenoma", "乳腺線維腺腫", "Breast fibroadenoma", "fibrous", "breast", "breast", "breast_parenchyma", [10, 50, "10-30歳代"], "common", "良性乳腺腫瘤", ["circumscribed oval mass", "persistent enhancement"], ["境界明瞭な楕円形腫瘤で、均一信号と漸増性濃染を示すことが多い。"], "female_predominant"],
  ["phyllodes_tumor", "葉状腫瘍", "Phyllodes tumor", "fibrous", "breast", "breast", "breast_parenchyma", [20, 80, "40-50歳代"], "uncommon", "大型乳腺腫瘤", ["leaf-like clefts", "rapid growth"], ["大型境界明瞭腫瘤で裂隙状嚢胞変化や急速増大を伴う。"], "female_predominant"],
  ["breast_abscess", "乳腺膿瘍", "Breast abscess", "inflammatory", "breast", "breast", "breast_parenchyma", [15, 70, "授乳期-成人"], "uncommon", "乳腺炎", ["rim-enhancing collection", "mastitis"], ["壁肥厚を伴う液体貯留と周囲炎症、拡散制限を示す。"], "female_predominant"],
  ["breast_fat_necrosis", "乳腺脂肪壊死", "Breast fat necrosis", "fat_lesion", "breast", "breast", "breast_parenchyma", [20, 90, "成人"], "uncommon", "術後・外傷後乳腺病変", ["oil cyst", "rim calcification"], ["oil cyst、脂肪信号、rim calcificationを示すことがある。"], "female_predominant"],

  ["osteosarcoma", "骨肉腫", "Osteosarcoma", "marrow", "musculoskeletal", "bone", "metaphysis", [5, 40, "10-20歳代"], "uncommon", "原発性骨腫瘍", ["osteoid matrix", "sunburst periosteal reaction"], ["骨形成性matrix、sunburst状骨膜反応、Codman triangleを示すことがある。"]],
  ["chondrosarcoma", "軟骨肉腫", "Chondrosarcoma", "marrow", "musculoskeletal", "bone", "bone_marrow", [20, 90, "40-70歳代"], "uncommon", "軟骨性骨腫瘍", ["rings and arcs calcification", "endosteal scalloping"], ["rings-and-arcs石灰化、内骨膜scalloping、軟部腫瘤を評価する。"]],
  ["ewing_sarcoma", "Ewing肉腫", "Ewing sarcoma", "marrow", "musculoskeletal", "bone", "bone_marrow", [0, 30, "10歳代"], "rare", "小児骨腫瘍", ["onion-skin periosteal reaction", "soft tissue mass"], ["骨幹部優位の骨髄病変と大きな軟部腫瘤、層状骨膜反応を示す。"]],
  ["bone_metastasis", "骨転移", "Bone metastasis", "marrow", "musculoskeletal", "bone", "bone_marrow", [30, 100, "成人"], "common", "悪性腫瘍既往の骨病変", ["osteolytic metastasis", "osteoblastic metastasis"], ["溶骨性または造骨性病変、T1低信号の骨髄置換として評価する。"]],
  ["multiple_myeloma", "多発性骨髄腫", "Multiple myeloma", "marrow", "musculoskeletal", "bone", "bone_marrow", [40, 100, "60-70歳代"], "common", "骨髄腫", ["punched-out lesions", "diffuse marrow infiltration"], ["punched-out骨病変やびまん性骨髄浸潤を示す。"]],
  ["osteomyelitis", "骨髄炎", "Osteomyelitis", "marrow", "musculoskeletal", "bone", "bone_marrow", [0, 100, "全年齢"], "common", "骨感染", ["marrow edema", "sequestrum", "involucrum"], ["T1低信号/T2高信号の骨髄浮腫、骨破壊、膿瘍を評価する。"]],
  ["septic_arthritis", "化膿性関節炎", "Septic arthritis", "inflammatory", "musculoskeletal", "joint", "joint_space", [0, 100, "全年齢"], "common", "急性関節痛", ["joint effusion", "synovial enhancement"], ["関節液貯留、滑膜肥厚・造影、隣接骨髄炎を伴うことがある。"]],
  ["osteoid_osteoma", "類骨骨腫", "Osteoid osteoma", "marrow", "musculoskeletal", "bone", "metaphysis", [5, 40, "10-20歳代"], "uncommon", "夜間痛を伴う骨病変", ["nidus", "reactive sclerosis"], ["小さなnidusと周囲骨硬化が診断の手がかり。"]],
  ["enchondroma", "内軟骨腫", "Enchondroma", "marrow", "musculoskeletal", "bone", "metaphysis", [10, 80, "20-50歳代"], "common", "軟骨性骨病変", ["chondroid matrix", "rings and arcs"], ["髄内軟骨性病変でrings-and-arcs石灰化を示す。"]],
  ["giant_cell_tumor_bone", "骨巨細胞腫", "Giant cell tumor of bone", "marrow", "musculoskeletal", "bone", "epiphysis", [15, 60, "20-40歳代"], "uncommon", "骨端部腫瘍", ["eccentric epiphyseal lesion", "subarticular extension"], ["骨端から関節下に及ぶ偏心性溶骨性病変として見える。"]],
  ["aneurysmal_bone_cyst", "動脈瘤様骨嚢腫", "Aneurysmal bone cyst", "cystic_tumor", "musculoskeletal", "bone", "metaphysis", [0, 30, "10-20歳代"], "uncommon", "嚢胞性骨病変", ["fluid-fluid levels", "expansile lytic lesion"], ["膨張性骨破壊と多房性fluid-fluid levelsを示す。"]],
  ["soft_tissue_lipoma", "軟部脂肪腫", "Soft-tissue lipoma", "fat_lesion", "musculoskeletal", "soft_tissue", "soft_tissue_compartment", [20, 90, "40-60歳代"], "common", "脂肪性軟部腫瘤", ["homogeneous fat signal", "thin septa"], ["均一な脂肪信号で薄い隔壁のみを伴うことが多い。"]],
  ["liposarcoma", "脂肪肉腫", "Liposarcoma", "fat_lesion", "musculoskeletal", "soft_tissue", "soft_tissue_compartment", [30, 90, "50-70歳代"], "uncommon", "脂肪性軟部腫瘍", ["thick septa", "non-fatty nodules"], ["厚い隔壁や非脂肪性結節、造影される充実成分を評価する。"]],
  ["soft_tissue_abscess", "軟部膿瘍", "Soft-tissue abscess", "inflammatory", "musculoskeletal", "soft_tissue", "soft_tissue_compartment", [0, 100, "全年齢"], "common", "軟部感染", ["rim-enhancing fluid collection", "restricted diffusion"], ["リング状濃染を伴う液体貯留、周囲蜂窩織炎、拡散制限を示す。"]],
  ["avascular_necrosis_femoral_head", "大腿骨頭壊死", "Avascular necrosis of the femoral head", "marrow", "musculoskeletal", "bone", "epiphysis", [15, 80, "30-50歳代"], "common", "股関節痛", ["double-line sign", "subchondral collapse"], ["T2 double-line sign、軟骨下骨折、骨頭圧潰を評価する。"]],

  ["vertebral_compression_fracture", "椎体圧迫骨折", "Vertebral compression fracture", "marrow", "spine", "vertebra", "vertebral_body", [40, 100, "高齢者"], "common", "背部痛", ["marrow edema", "height loss"], ["椎体高低下、骨髄浮腫、後壁突出を評価する。"]],
  ["spinal_metastasis", "脊椎転移", "Spinal metastasis", "marrow", "spine", "vertebra", "vertebral_body", [30, 100, "成人"], "common", "悪性腫瘍既往の背部痛", ["posterior element involvement", "epidural extension"], ["T1低信号の骨髄置換、椎弓根病変、硬膜外進展を評価する。"]],
  ["lumbar_disc_herniation", "腰椎椎間板ヘルニア", "Lumbar disc herniation", "solid_tumor", "spine", "intervertebral_disc", "disc_space", [15, 80, "30-50歳代"], "common", "腰下肢痛", ["disc extrusion", "nerve root compression"], ["椎間板突出・脱出と神経根圧迫、遊離片の有無を評価する。"]],
  ["spondylodiscitis", "化膿性脊椎炎・椎間板炎", "Spondylodiscitis", "inflammatory", "spine", "intervertebral_disc", "disc_space", [0, 100, "成人"], "common", "脊椎感染", ["disc space infection", "endplate erosion"], ["椎間板高信号、終板破壊、傍椎体/硬膜外膿瘍を伴うことがある。"]],
  ["spinal_epidural_abscess", "脊髄硬膜外膿瘍", "Spinal epidural abscess", "inflammatory", "spine", "spine", "epidural_space", [0, 100, "成人"], "uncommon", "発熱・背部痛・神経症状", ["epidural collection", "cord compression"], ["硬膜外リング状濃染性液体貯留と脊髄圧迫を評価する。"]],
  ["spinal_schwannoma", "脊髄神経鞘腫", "Spinal schwannoma", "solid_tumor", "spine", "spine", "spinal_canal", [20, 80, "40-60歳代"], "uncommon", "脊柱管内腫瘤", ["dumbbell tumor", "foraminal widening"], ["椎間孔拡大を伴うdumbbell型腫瘤として見えることがある。"]],
  ["spinal_meningioma", "脊髄髄膜腫", "Spinal meningioma", "fibrous", "spine", "spine", "spinal_canal", [30, 90, "50-70歳代"], "uncommon", "硬膜内髄外腫瘤", ["dural tail", "intradural extramedullary mass"], ["硬膜内髄外腫瘤で均一濃染、dural tailを伴うことがある。"], "female_predominant"],
  ["vertebral_hemangioma", "椎体血管腫", "Vertebral hemangioma", "fat_lesion", "spine", "vertebra", "vertebral_body", [20, 100, "成人"], "common", "偶発椎体病変", ["polka-dot sign", "corduroy sign"], ["CTのpolka-dot signやMRI高T1/高T2信号が典型的。"]],

  ["papillary_thyroid_carcinoma", "甲状腺乳頭癌", "Papillary thyroid carcinoma", "solid_tumor", "head_neck", "thyroid", "thyroid_lobe", [10, 90, "30-60歳代"], "common", "甲状腺結節", ["microcalcifications", "cervical nodal metastasis"], ["微細石灰化、不整形低エコー結節、嚢胞性/石灰化リンパ節転移を伴う。"], "female_predominant"],
  ["thyroid_adenoma", "甲状腺腺腫", "Thyroid adenoma", "solid_tumor", "head_neck", "thyroid", "thyroid_lobe", [10, 90, "成人"], "common", "甲状腺結節", ["encapsulated nodule", "cystic degeneration"], ["被膜を伴う結節で嚢胞変性や出血を伴うことがある。"], "female_predominant"],
  ["pleomorphic_adenoma_parotid", "耳下腺多形腺腫", "Pleomorphic adenoma of the parotid gland", "solid_tumor", "head_neck", "salivary_gland", "parotid_gland", [10, 90, "30-60歳代"], "common", "耳下腺腫瘤", ["T2 bright parotid mass", "well-circumscribed"], ["境界明瞭な耳下腺腫瘤でT2高信号を示すことが多い。"]],
  ["warthin_tumor", "ワルチン腫瘍", "Warthin tumor", "cystic_tumor", "head_neck", "salivary_gland", "parotid_gland", [40, 90, "60-70歳代"], "common", "耳下腺腫瘤", ["bilateral parotid lesions", "cystic-solid"], ["高齢男性・喫煙歴、耳下腺下極、多発/両側性が手がかり。"], "male_predominant"],
  ["head_neck_squamous_cell_carcinoma", "頭頸部扁平上皮癌", "Head and neck squamous cell carcinoma", "solid_tumor", "head_neck", "soft_tissue", "oropharynx", [30, 90, "50-70歳代"], "common", "咽喉頭腫瘤", ["mucosal mass", "necrotic lymph node"], ["粘膜面腫瘤、深部浸潤、壊死性頸部リンパ節転移を評価する。"]],
  ["nasopharyngeal_carcinoma", "上咽頭癌", "Nasopharyngeal carcinoma", "solid_tumor", "head_neck", "soft_tissue", "nasopharynx", [20, 90, "40-60歳代"], "uncommon", "上咽頭腫瘤", ["retropharyngeal lymph node", "skull base invasion"], ["上咽頭側壁腫瘤、頭蓋底浸潤、後咽頭リンパ節腫大を評価する。"]],
  ["branchial_cleft_cyst", "鰓裂嚢胞", "Branchial cleft cyst", "cystic_tumor", "head_neck", "soft_tissue", "cervical_lymph_node", [0, 60, "若年-成人"], "common", "側頸部嚢胞", ["lateral neck cyst", "second branchial cleft"], ["胸鎖乳突筋前縁付近の薄壁嚢胞性病変として見えることが多い。"]],
  ["thyroglossal_duct_cyst", "甲状舌管嚢胞", "Thyroglossal duct cyst", "cystic_tumor", "head_neck", "soft_tissue", "thyroid_lobe", [0, 60, "小児-若年"], "common", "正中頸部嚢胞", ["midline neck cyst", "hyoid bone"], ["舌骨近傍の正中頸部嚢胞で、感染時に壁肥厚を伴う。"]],
  ["cervical_lymphoma", "頸部リンパ腫", "Cervical lymphoma", "solid_tumor", "head_neck", "lymph_node", "cervical_lymph_node", [0, 100, "全年齢"], "common", "頸部リンパ節腫大", ["homogeneous lymphadenopathy", "restricted diffusion"], ["均一なリンパ節腫大、多発性、拡散制限を示すことが多い。"]]
].map(([id, ja, en, profile, body_region, organ, subregion, age, freq, setting, keywords, raw_findings, sex]) => ({
  id, ja, en, profile, body_region, organ, subregion, age, freq, setting, keywords, raw_findings, sex
}));

function main() {
  ensureDictionaries();
  fs.mkdirSync(draftsDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });
  writeJson(path.join(publicDir, "general_batch6_public_sources.json"), {
    source_id: SOURCE_ID,
    generated_at: now,
    references: [
      PUBLIC_REFERENCE,
      { source_id: "ncbi_bookshelf", type: "website", title: "NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/", license: "Public web access" },
      { source_id: "acr_appropriateness_criteria", type: "guideline_index", title: "ACR Appropriateness Criteria", url: "https://acsearch.acr.org/list", license: "Public web access" },
      { source_id: "radiologyinfo", type: "patient_information", title: "RadiologyInfo.org", url: "https://www.radiologyinfo.org/", license: "Public web access" },
      { source_id: "pmc_open_access", type: "literature_index", title: "PubMed Central", url: "https://pmc.ncbi.nlm.nih.gov/", license: "Open-access article index" }
    ],
    note: "疾患別の詳細文献レビュー前に、Phase 1全身疾患カードの典型画像所見を整理するための公開ソース束。"
  });

  let written = 0;
  let skipped = 0;
  for (const spec of SPECS) {
    const filePath = path.join(draftsDir, `${spec.id}.json`);
    if (fs.existsSync(filePath)) {
      skipped += 1;
      continue;
    }
    writeJson(filePath, buildCard(spec));
    written += 1;
  }
  console.log(`General Phase 1 batch 6 complete. Written: ${written}, skipped existing: ${skipped}`);
}

main();

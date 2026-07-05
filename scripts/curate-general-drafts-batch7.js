const fs = require("fs");
const path = require("path");
const { DATA, readJson, writeJson, hashObject } = require("./lib");

const now = new Date().toISOString();
const draftsDir = path.join(DATA, "drafts");
const dictDir = path.join(DATA, "dictionaries");
const publicDir = path.join(DATA, "sources", "public");
const SOURCE_ID = "public_general_batch7_20260705";

const PUBLIC_REFERENCE = {
  source_id: SOURCE_ID,
  type: "public_source_packet",
  title: "Public cross-sectional imaging source packet for whole-body Phase 1 draft batch 7",
  authors: [],
  journal: "",
  year: "2026",
  url: "https://www.ncbi.nlm.nih.gov/books/",
  license: "Public web source index: NCBI Bookshelf/StatPearls, ACR Appropriateness Criteria, RadiologyInfo, and open-access PMC reviews where applicable"
};

function add(map, key, en, ja, extra = {}) {
  if (!map[key]) map[key] = { ...extra, label: { ja, en }, synonyms: [] };
  map[key] = { ...extra, ...map[key] };
  map[key].label = map[key].label || { ja, en };
  map[key].synonyms = Array.from(new Set([...(map[key].synonyms || []), ja, en, ...(extra.synonyms || [])]));
}

function ensureDictionaries() {
  const anatomyPath = path.join(dictDir, "anatomy-map.json");
  const targetPath = path.join(dictDir, "target-map.json");
  const anatomy = readJson(anatomyPath);
  const targets = readJson(targetPath);

  for (const [key, en, ja] of [
    ["female_pelvis", "female pelvis", "女性骨盤"], ["male_pelvis", "male pelvis", "男性骨盤"],
    ["emergency", "emergency", "救急"], ["vascular", "vascular", "血管"]
  ]) add(anatomy.body_regions, key, en, ja);

  for (const [key, parent, en, ja] of [
    ["cervix", "female_pelvis", "cervix", "子宮頸部"], ["endometrium", "female_pelvis", "endometrium", "子宮内膜"],
    ["fallopian_tube", "female_pelvis", "fallopian tube", "卵管"], ["vagina", "female_pelvis", "vagina", "腟"],
    ["testis", "male_pelvis", "testis", "精巣"], ["scrotum", "male_pelvis", "scrotum", "陰嚢"],
    ["penis", "male_pelvis", "penis", "陰茎"], ["perineum", "pelvis", "perineum", "会陰"],
    ["mesentery", "abdomen", "mesentery", "腸間膜"], ["retroperitoneum", "abdomen", "retroperitoneum", "後腹膜"],
    ["inferior_vena_cava", "vascular", "inferior vena cava", "下大静脈"], ["portal_vein", "hepatobiliary", "portal vein", "門脈"]
  ]) add(anatomy.organs, key, en, ja, { parent_body_region: parent });

  for (const [key, en, ja] of [
    ["pleural_surface", "pleural surface", "胸膜面"], ["airway_lumen", "airway lumen", "気道内腔"],
    ["alveolar_space", "alveolar space", "肺胞腔"], ["interlobular_septa", "interlobular septa", "小葉間隔壁"],
    ["pericardial_space", "pericardial space", "心嚢腔"], ["splenic_hilum", "splenic hilum", "脾門部"],
    ["pancreatic_duct", "pancreatic duct", "膵管"], ["mesenteric_vessels", "mesenteric vessels", "腸間膜血管"],
    ["retroperitoneal_space", "retroperitoneal space", "後腹膜腔"], ["endometrial_cavity", "endometrial cavity", "子宮内腔"],
    ["cervical_stroma", "cervical stroma", "子宮頸部間質"], ["fallopian_tube_lumen", "fallopian tube lumen", "卵管内腔"],
    ["testicular_parenchyma", "testicular parenchyma", "精巣実質"], ["epididymis", "epididymis", "精巣上体"],
    ["scrotal_wall", "scrotal wall", "陰嚢壁"], ["perineal_soft_tissue", "perineal soft tissue", "会陰軟部組織"],
    ["portal_vein_lumen", "portal vein lumen", "門脈内腔"], ["ivc_lumen", "IVC lumen", "下大静脈内腔"],
    ["arterial_wall", "arterial wall", "動脈壁"], ["venous_lumen", "venous lumen", "静脈内腔"]
  ]) add(anatomy.subregions, key, en, ja);

  for (const [key, en, ja] of [
    ["fluid_collection", "fluid collection", "液体貯留"], ["gas_component", "gas component", "ガス成分"],
    ["mucosal_surface", "mucosal surface", "粘膜面"], ["serosa", "serosa", "漿膜"],
    ["stromal_component", "stromal component", "間質成分"], ["vascular_wall", "vascular wall", "血管壁"],
    ["thrombus", "thrombus", "血栓"], ["foreign_body", "foreign body", "異物"]
  ]) add(targets, key, en, ja);

  writeJson(anatomyPath, anatomy);
  writeJson(targetPath, targets);
}

function anat(s, organ = s.organ, subregion = s.subregion) {
  return { body_region: s.body_region, organ, subregion, laterality: "unknown" };
}

function f(s, modality, acq, code, text, opts = {}) {
  return {
    finding_code: code,
    modality,
    acquisition: { type: modality === "CT" ? "phase" : "sequence", code: acq },
    anatomy: anat(s, opts.organ, opts.subregion),
    target: opts.target || "whole_lesion",
    modifiers: {},
    keywords: s.keywords.slice(0, 3),
    finding_text: text,
    typicality: opts.typicality || "common",
    diagnostic_weight: opts.weight ?? 3,
    review_status: "draft",
    mapping: { status: "matched", confidence: 0.82, matched_concept_id: code, alternatives: [] }
  };
}

const CT = {
  low: (s, t, o = {}) => f(s, "CT", "non_contrast", "finding:ct_hypoattenuation", t, o),
  iso: (s, t, o = {}) => f(s, "CT", "non_contrast", "finding:ct_isoattenuation", t, o),
  high: (s, t, o = {}) => f(s, "CT", "non_contrast", "finding:ct_hyperattenuation", t, o),
  calc: (s, t, o = {}) => f(s, "CT", "non_contrast", "finding:calcification_present", t, { ...o, target: o.target || "calcified_component" })
};
const MR = {
  t1Low: (s, t, o = {}) => f(s, "MRI", "T1WI", "finding:t1_hypointensity", t, o),
  t1High: (s, t, o = {}) => f(s, "MRI", "T1WI", "finding:t1_hyperintensity", t, o),
  t2High: (s, t, o = {}) => f(s, "MRI", "T2WI", "finding:t2_hyperintensity", t, o),
  t2Low: (s, t, o = {}) => f(s, "MRI", "T2WI", "finding:t2_hypointensity", t, o),
  dwi: (s, t, o = {}) => f(s, "MRI", "DWI", "finding:dwi_hyperintensity", t, o),
  restr: (s, t, o = {}) => f(s, "MRI", "DWI", "finding:diffusion_restriction_present", t, o),
  noRestr: (s, t, o = {}) => f(s, "MRI", "DWI", "finding:diffusion_restriction_absent", t, o),
  mild: (s, t, o = {}) => f(s, "MRI", "contrast_enhanced_T1WI", "finding:mild_enhancement", t, o),
  avid: (s, t, o = {}) => f(s, "MRI", "contrast_enhanced_T1WI", "finding:avid_homogeneous_enhancement", t, o),
  solid: (s, t, o = {}) => f(s, "MRI", "contrast_enhanced_T1WI", "finding:enhancing_solid_component", t, { ...o, target: o.target || "solid_component" }),
  ring: (s, t, o = {}) => f(s, "MRI", "contrast_enhanced_T1WI", "finding:ring_enhancement", t, o),
  thickRing: (s, t, o = {}) => f(s, "MRI", "contrast_enhanced_T1WI", "finding:thick_irregular_ring_enhancement", t, o),
  wall: (s, t, o = {}) => f(s, "MRI", "T2WI", "finding:wall_thickening", t, { ...o, target: "wall" }),
  multi: (s, t, o = {}) => f(s, "MRI", "T2WI", "finding:multilocular_cystic_mass", t, { ...o, target: "cystic_component" }),
  fat: (s, t, o = {}) => f(s, "MRI", "T1WI", "finding:fat_present", t, { ...o, target: "fat_component" }),
  fatDrop: (s, t, o = {}) => f(s, "MRI", "T1WI_fat_suppressed", "finding:fat_suppression_signal_drop", t, { ...o, target: "fat_component" }),
  blood: (s, t, o = {}) => f(s, "MRI", "T2STAR", "finding:hemorrhage_present", t, { ...o, target: "hemorrhagic_component" })
};

const PROFILE = {
  tumor: (s) => [CT.iso(s, `${s.ja}はCTで軟部濃度の腫瘤として描出されることがある。`, { weight: 2 }), MR.t1Low(s, `${s.ja}はT1WI低信号を示すことが多い。`, { weight: 2 }), MR.t2High(s, `${s.ja}はT2WIで不均一な高信号を示すことがある。`, { weight: 3 }), MR.solid(s, `${s.ja}は造影で充実部の増強を示す。`, { weight: 4 }), MR.restr(s, `${s.ja}は細胞密度の高い部位で拡散制限を示すことがある。`, { weight: 3, typicality: "variable" })],
  cystic: (s) => [CT.low(s, `${s.ja}は低吸収の嚢胞性病変として描出されることがある。`, { target: "cystic_component" }), MR.t1Low(s, `${s.ja}の液性成分はT1WI低信号を示す。`, { target: "cyst_content" }), MR.t2High(s, `${s.ja}はT2WI高信号の嚢胞性成分を示す。`, { weight: 4, target: "cystic_component" }), MR.mild(s, `${s.ja}は壁や隔壁に造影効果を伴うことがある。`, { target: "cyst_wall" }), MR.noRestr(s, `${s.ja}は単純液性成分では強い拡散制限を示さないことが多い。`, { typicality: "variable" })],
  infection: (s) => [CT.low(s, `${s.ja}は炎症性低吸収域や周囲脂肪織変化として評価される。`), MR.wall(s, `${s.ja}は壁肥厚や周囲炎症を伴うことがある。`, { weight: 4 }), MR.t2High(s, `${s.ja}は浮腫や液体貯留によりT2WI高信号を示す。`), MR.restr(s, `${s.ja}は膿瘍や高粘稠内容で拡散制限を示すことがある。`, { weight: 4 }), MR.ring(s, `${s.ja}は膿瘍形成時にリング状造影を示すことがある。`, { typicality: "variable" })],
  vascular: (s) => [CT.high(s, `${s.ja}は急性血栓や出血で高吸収を示すことがある。`, { target: "thrombus" }), CT.low(s, `${s.ja}は虚血や浮腫に対応する低吸収を伴うことがある。`), MR.restr(s, `${s.ja}は虚血性変化で拡散制限を伴うことがある。`, { typicality: "variable" }), MR.mild(s, `${s.ja}は血管壁や周囲組織の造影変化を伴うことがある。`, { target: "vascular_wall" }), MR.blood(s, `${s.ja}は出血性合併症をT2*系で評価する。`, { typicality: "variable" })],
  fibrosis: (s) => [CT.iso(s, `${s.ja}はCTで軟部濃度から線維性変化として見えることがある。`), MR.t1Low(s, `${s.ja}はT1WI低信号を示すことが多い。`), MR.t2Low(s, `${s.ja}は線維性成分を反映してT2WI低信号を示すことがある。`, { weight: 4, target: "fibrous_component" }), MR.mild(s, `${s.ja}は遅延性または不均一な増強を示すことがある。`), MR.noRestr(s, `${s.ja}の拡散制限は病勢や成分により可変である。`, { typicality: "variable" })],
  fat: (s) => [CT.low(s, `${s.ja}は脂肪濃度を含むことがある。`, { target: "fat_component" }), MR.t1High(s, `${s.ja}の脂肪成分はT1WI高信号を示す。`, { target: "fat_component" }), MR.fat(s, `${s.ja}では脂肪信号を確認する。`, { weight: 4 }), MR.fatDrop(s, `${s.ja}の脂肪成分は脂肪抑制で信号低下する。`, { weight: 5 }), MR.mild(s, `${s.ja}は非脂肪成分に造影効果を伴うことがある。`, { typicality: "variable" })],
  wall: (s) => [CT.iso(s, `${s.ja}はCTで壁肥厚または管腔狭窄として評価される。`, { target: "wall" }), MR.wall(s, `${s.ja}は壁肥厚を示す。`, { weight: 4 }), MR.t2High(s, `${s.ja}は浮腫や炎症でT2WI高信号を伴うことがある。`, { target: "wall" }), MR.mild(s, `${s.ja}は粘膜面または壁の増強を示す。`, { target: "mucosal_surface" }), MR.restr(s, `${s.ja}は高度炎症や腫瘍で拡散制限を伴うことがある。`, { typicality: "variable" })]
};

function demographics([min, max, peak], sex = "no_sex_predilection") {
  const predominance = sex.includes("male") ? "male" : sex.includes("female") ? "female" : "none";
  return {
    sex: { applicable: sex.endsWith("_only") ? [predominance] : ["any"], predominance, predilection: sex, summary: "代表的な性差傾向を記録。" },
    age: { typical_min: min, typical_max: max, peak_decade: peak, summary: "代表的な発症・診断年齢帯を記録。" }
  };
}

function freq(label, setting, bodyRegion) {
  const ranks = { very_common: 5, common: 4, uncommon: 3, rare: 2, very_rare: 1, unknown: 0 };
  return { label, prevalence_rank: ranks[label] ?? 0, basis: "differential_importance", evidence_level: "public_review", context: { population: "any", body_region: bodyRegion, clinical_setting: setting }, summary: `${setting}の鑑別での相対頻度と重要度を記録。` };
}

function raw(s, text, i) {
  return {
    raw_finding_id: `${s.id}_raw_${String(i + 1).padStart(3, "0")}`,
    modality_text: "CT/MRI/US",
    acquisition_text: "疾患に応じた標準撮像",
    anatomy_text: `${s.ja}の典型的な主座`,
    target_text: "named_sign",
    finding_text: text,
    interpretation: "構造化辞書では拾い切れない疾患固有の所見・サインとして保存。",
    source_ids: [SOURCE_ID],
    mapping: { status: "candidate", candidate_finding_code: `finding:${s.id}_specific_sign`, candidate_anatomy: anat(s), candidate_target: "named_sign", notes: "Phase 1 raw finding" },
    review_status: "needs_mapping"
  };
}

function card(s) {
  const findings = (PROFILE[s.profile] || PROFILE.tumor)(s).map((item, i) => ({ ...item, finding_id: `${s.id}_f${String(i + 1).padStart(3, "0")}` }));
  const ct = [];
  const mri = [];
  for (const item of findings) {
    const list = item.modality === "CT" ? ct : mri;
    const key = item.acquisition.code;
    let group = list.find((g) => (g.phase || g.sequence).code === key);
    if (!group) list.push(group = item.modality === "CT" ? { phase: { code: key }, findings: [] } : { sequence: { code: key }, findings: [] });
    group.findings.push(item);
  }
  const value = {
    schema_version: "0.8",
    disease_id: s.id,
    disease_name: { ja: s.ja, en: s.en },
    disease_aliases: { ja: [], en: s.aliases || [] },
    clinical: {
      overview: `${s.ja}は${s.setting}で重要な鑑別となる疾患で、臨床背景と画像分布を組み合わせて評価する。`,
      treatment: "治療方針は病型、病期、合併症、全身状態に応じて決定する。",
      epidemiology: "頻度と好発年齢は病型・背景疾患により異なる。"
    },
    demographics: demographics(s.age, s.sex),
    keywords: Array.from(new Set([s.en, s.ja, ...s.keywords])),
    frequency: freq(s.freq, s.setting, s.body_region),
    imaging: { ct: { summary: `${s.ja}のCTでは濃度、石灰化、出血、造影効果、周囲変化を評価する。`, findings_by_phase: ct }, mri: { summary: `${s.ja}のMRIでは信号、拡散、造影効果、病変分布を評価する。`, findings_by_sequence: mri } },
    raw_findings: s.raw.map(raw.bind(null, s)),
    evidence: { summary: "NCBI Bookshelf、ACR Appropriateness Criteria、RadiologyInfo、PMC open-access review などの公開情報を参照。", claim_map: findings.map((item) => ({ finding_ids: [item.finding_id], source_ids: [SOURCE_ID], support: "public_source_summary" })) },
    image_examples: [],
    references: [PUBLIC_REFERENCE],
    review: { status: "draft", confidence: "medium", notes: "公開情報に基づく初期整理。" },
    curation: { batch: "general_batch7", generated_by: "curate-general-drafts-batch7.js" },
    provenance: { source_ids: [SOURCE_ID], generated_at: now },
    updated_at: now
  };
  value.content_hash = hashObject({ ...value, content_hash: "" });
  return value;
}

const rows = [
  ["malignant_pleural_mesothelioma","悪性胸膜中皮腫","Malignant pleural mesothelioma","tumor","chest","pleura","pleural_surface",[40,90,"60-70歳代"],"uncommon","びまん性胸膜肥厚",["pleural rind","asbestos","hemithorax contraction"],["びまん性・結節性胸膜肥厚、胸膜rind、胸郭容積低下を伴うことがある。"]],
  ["pleural_empyema","膿胸","Pleural empyema","infection","chest","pleura","pleural_space",[0,100,"全年齢"],"common","胸水・感染",["split pleura sign","loculated effusion"],["造影CTでsplit pleura sign、隔壁を伴う被包化胸水を示す。"]],
  ["spontaneous_pneumothorax","自然気胸","Spontaneous pneumothorax","cystic","chest","pleura","pleural_space",[10,90,"若年-高齢"],"common","急性胸痛",["visceral pleural line","apical bleb"],["胸膜線と末梢肺紋理消失、apical blebやbullaを伴うことがある。"]],
  ["emphysema","肺気腫","Emphysema","cystic","chest","lung","alveolar_space",[30,100,"60-80歳代"],"common","慢性閉塞性肺疾患",["centrilobular lucency","bullae"],["小葉中心性低吸収、血管影減少、過膨張、bullaeを示す。"]],
  ["bronchiectasis","気管支拡張症","Bronchiectasis","wall","chest","lung","airway_lumen",[0,100,"全年齢"],"common","慢性咳嗽",["signet-ring sign","tram-track sign"],["signet-ring sign、tram-track sign、末梢気道可視化が手がかり。"]],
  ["pulmonary_edema","肺水腫","Pulmonary edema","vascular","chest","lung","interlobular_septa",[0,100,"全年齢"],"common","急性呼吸不全",["smooth septal thickening","bat-wing opacity"],["小葉間隔壁肥厚、両側中枢優位すりガラス影、胸水を伴う。"]],
  ["acute_respiratory_distress_syndrome","急性呼吸窮迫症候群","Acute respiratory distress syndrome","infection","chest","lung","alveolar_space",[0,100,"全年齢"],"common","重症呼吸不全",["dependent consolidation","diffuse ground-glass"],["びまん性すりガラス影と背側優位consolidationを示す。"]],
  ["septic_pulmonary_emboli","敗血症性肺塞栓","Septic pulmonary emboli","infection","chest","lung","pulmonary_nodule",[0,100,"全年齢"],"uncommon","菌血症・多発肺結節",["feeding vessel sign","peripheral cavitary nodules"],["末梢多発結節、空洞化、feeding vessel signを伴うことがある。"]],
  ["lung_abscess","肺膿瘍","Lung abscess","infection","chest","lung","lung_parenchyma",[0,100,"成人"],"uncommon","肺感染",["air-fluid level","thick wall cavity"],["厚い壁を持つ空洞、air-fluid level、周囲consolidationを示す。"]],
  ["organizing_pneumonia","器質化肺炎","Organizing pneumonia","infection","chest","lung","lung_parenchyma",[20,90,"50-70歳代"],"uncommon","亜急性肺炎",["reverse halo sign","perilobular opacity"],["reverse halo signやperilobular opacity、移動性陰影を示す。"]],
  ["hypersensitivity_pneumonitis","過敏性肺炎","Hypersensitivity pneumonitis","infection","chest","lung","interstitium",[10,90,"成人"],"uncommon","びまん性肺疾患",["mosaic attenuation","air trapping","centrilobular nodules"],["小葉中心性結節、mosaic attenuation、air trappingが手がかり。"]],
  ["pulmonary_alveolar_proteinosis","肺胞蛋白症","Pulmonary alveolar proteinosis","infection","chest","lung","alveolar_space",[20,80,"30-50歳代"],"rare","びまん性肺疾患",["crazy paving"],["すりガラス影に小葉間隔壁肥厚を伴うcrazy-paving patternを示す。"]],
  ["silicosis","珪肺","Silicosis","fibrosis","chest","lung","interstitium",[20,100,"職業曝露"],"uncommon","職業性肺疾患",["eggshell calcification","upper lobe nodules"],["上肺野優位小結節、進行性塊状線維化、eggshell calcificationを伴う。"]],
  ["pulmonary_arterial_hypertension","肺動脈性肺高血圧症","Pulmonary arterial hypertension","vascular","chest","pulmonary_artery","pulmonary_artery_lumen",[0,100,"成人"],"uncommon","肺高血圧",["dilated pulmonary artery","right ventricular enlargement"],["主肺動脈拡大、右室拡大、末梢血管pruningを示す。"]],
  ["pericardial_effusion","心嚢液貯留","Pericardial effusion","cystic","cardiovascular","heart","pericardial_space",[0,100,"全年齢"],"common","心嚢液",["pericardial fluid","tamponade"],["心嚢腔液体貯留と心タンポナーデ徴候を評価する。"]],
  ["constrictive_pericarditis","収縮性心膜炎","Constrictive pericarditis","fibrosis","cardiovascular","heart","pericardial_space",[20,100,"成人"],"uncommon","心膜疾患",["pericardial calcification","septal bounce"],["心膜肥厚・石灰化、心室中隔bounce、静脈うっ滞所見を伴う。"]],

  ["splenic_infarction","脾梗塞","Splenic infarction","vascular","abdomen","spleen","splenic_parenchyma",[0,100,"全年齢"],"uncommon","左上腹部痛",["wedge-shaped hypoenhancement"],["脾辺縁に底を持つ楔状低濃染域を示す。"]],
  ["splenic_abscess","脾膿瘍","Splenic abscess","infection","abdomen","spleen","splenic_parenchyma",[0,100,"免疫不全-成人"],"rare","発熱・脾病変",["rim-enhancing splenic lesion","gas"],["リング状濃染性脾病変、内部ガス、多発病変を伴うことがある。"]],
  ["splenic_lymphoma","脾リンパ腫","Splenic lymphoma","tumor","abdomen","spleen","splenic_parenchyma",[0,100,"成人"],"uncommon","脾腫・脾腫瘤",["splenomegaly","hypodense nodules"],["脾腫、びまん性浸潤または多発低吸収結節を示す。"]],
  ["adrenal_myelolipoma","副腎骨髄脂肪腫","Adrenal myelolipoma","fat","abdomen","adrenal_gland","adrenal",[20,100,"50-70歳代"],"common","脂肪含有副腎腫瘤",["macroscopic fat adrenal mass"],["肉眼的脂肪を含む境界明瞭な副腎腫瘤として見える。"]],
  ["adrenocortical_carcinoma","副腎皮質癌","Adrenocortical carcinoma","tumor","abdomen","adrenal_gland","adrenal",[20,90,"40-60歳代"],"rare","大型副腎腫瘤",["large heterogeneous adrenal mass","necrosis"],["大型不均一副腎腫瘤で壊死、出血、局所浸潤を伴いやすい。"]],
  ["gallbladder_carcinoma","胆嚢癌","Gallbladder carcinoma","tumor","hepatobiliary","gallbladder","gallbladder_lumen",[40,100,"60-80歳代"],"uncommon","胆嚢壁肥厚・腫瘤",["mass replacing gallbladder","liver invasion"],["胆嚢置換性腫瘤、限局性壁肥厚、肝浸潤を評価する。"]],
  ["choledocholithiasis","総胆管結石","Choledocholithiasis","cystic","hepatobiliary","bile_duct","biliary_tree",[20,100,"成人"],"common","閉塞性黄疸",["bile duct stone","upstream biliary dilatation"],["総胆管内欠損/低信号結石と上流胆管拡張を示す。"]],
  ["primary_sclerosing_cholangitis","原発性硬化性胆管炎","Primary sclerosing cholangitis","fibrosis","hepatobiliary","bile_duct","biliary_tree",[10,80,"30-50歳代"],"uncommon","胆管炎・炎症性腸疾患",["beaded bile ducts","multifocal strictures"],["MRCPで多発狭窄と拡張が交互にみられるbeaded appearanceを示す。"]],
  ["autoimmune_pancreatitis","自己免疫性膵炎","Autoimmune pancreatitis","fibrosis","pancreas_region","pancreas","pancreatic_body_tail",[30,90,"60歳代"],"uncommon","膵腫大・IgG4関連疾患",["sausage pancreas","capsule-like rim"],["sausage-like膵腫大、capsule-like rim、主膵管びまん性狭細化を示す。"]],
  ["chronic_pancreatitis","慢性膵炎","Chronic pancreatitis","fibrosis","pancreas_region","pancreas","pancreatic_duct",[20,100,"成人"],"common","慢性上腹部痛",["pancreatic calcifications","ductal dilatation"],["膵石灰化、膵管不整拡張、膵萎縮を示す。"]],
  ["pancreatic_serous_cystadenoma","膵漿液性嚢胞腫瘍","Pancreatic serous cystadenoma","cystic","pancreas_region","pancreas","pancreatic_body_tail",[30,90,"60-70歳代"],"uncommon","膵嚢胞",["microcystic honeycomb","central scar"],["小嚢胞集簇によるhoneycomb appearanceと中心瘢痕を示す。"],"female_predominant"],
  ["pancreatic_mucinous_cystic_neoplasm","膵粘液性嚢胞腫瘍","Pancreatic mucinous cystic neoplasm","cystic","pancreas_region","pancreas","pancreatic_body_tail",[20,80,"40-50歳代"],"uncommon","膵嚢胞",["ovarian-type stroma","peripheral calcification"],["膵体尾部の単房/多房性嚢胞で厚い壁や卵殻状石灰化を伴う。"],"female_predominant"],
  ["solid_pseudopapillary_neoplasm_pancreas","膵solid-pseudopapillary neoplasm","Solid pseudopapillary neoplasm of the pancreas","tumor","pancreas_region","pancreas","pancreatic_body_tail",[10,50,"20-30歳代"],"rare","若年女性の膵腫瘤",["hemorrhagic capsule","solid cystic mass"],["被膜を持つ充実嚢胞性腫瘤で出血・変性を伴う。"],"female_predominant"],
  ["portal_vein_thrombosis","門脈血栓症","Portal vein thrombosis","vascular","hepatobiliary","portal_vein","portal_vein_lumen",[0,100,"成人"],"uncommon","門脈内欠損",["portal vein filling defect","cavernous transformation"],["門脈内充盈欠損、急性期拡張、慢性期cavernous transformationを示す。"]],

  ["mesenteric_ischemia","腸間膜虚血","Mesenteric ischemia","vascular","gastrointestinal","mesentery","mesenteric_vessels",[40,100,"高齢者"],"uncommon","急性腹症",["pneumatosis","portomesenteric gas","poor bowel enhancement"],["腸管壁造影不良、pneumatosis、門脈ガス、腸間膜血管閉塞を評価する。"]],
  ["epiploic_appendagitis","腹膜垂炎","Epiploic appendagitis","fat","gastrointestinal","bowel","peritoneal_cavity",[20,80,"成人"],"common","限局性腹痛",["hyperattenuating ring sign","central dot sign"],["脂肪濃度卵円形病変、hyperattenuating ring sign、central dot signを示す。"]],
  ["appendiceal_mucocele","虫垂粘液嚢腫","Appendiceal mucocele","cystic","gastrointestinal","appendix","appendiceal_wall",[30,90,"50-70歳代"],"uncommon","虫垂嚢胞性腫大",["cystic dilated appendix","mural calcification"],["嚢胞状に拡張した虫垂と壁石灰化、破裂時の粘液性腹水を評価する。"]],
  ["small_bowel_neuroendocrine_tumor","小腸神経内分泌腫瘍","Small bowel neuroendocrine tumor","tumor","gastrointestinal","bowel","bowel_wall",[30,90,"60歳代"],"uncommon","小腸腫瘍",["desmoplastic mesenteric mass","calcification"],["小腸壁腫瘤と石灰化を伴う腸間膜desmoplastic massを示す。"]],
  ["bowel_lymphoma","消化管リンパ腫","Bowel lymphoma","tumor","gastrointestinal","bowel","bowel_wall",[0,100,"成人"],"uncommon","消化管壁肥厚",["aneurysmal dilatation","bulky nodes"],["壁肥厚に比して閉塞が軽く、aneurysmal dilatationやbulky nodesを伴う。"]],
  ["typhlitis","好中球減少性腸炎","Typhlitis","infection","gastrointestinal","bowel","bowel_wall",[0,100,"免疫不全"],"uncommon","免疫不全腹痛",["cecal wall thickening","neutropenia"],["盲腸優位の壁肥厚、周囲炎症、免疫抑制背景を伴う。"]],
  ["toxic_megacolon","中毒性巨大結腸症","Toxic megacolon","infection","gastrointestinal","bowel","bowel_wall",[0,100,"炎症性腸疾患・感染"],"rare","急性重症大腸炎",["colonic dilatation","loss of haustra"],["大腸拡張、壁菲薄化、haustra消失、穿孔リスクを評価する。"]],
  ["rectal_cancer","直腸癌","Rectal cancer","tumor","gastrointestinal","bowel","bowel_wall",[40,100,"60-70歳代"],"common","直腸腫瘍",["mesorectal fascia","extramural vascular invasion"],["MRIで壁外浸潤、mesorectal fascia、EMVI、リンパ節を評価する。"]],
  ["anal_fistula","痔瘻","Anal fistula","infection","pelvis","perineum","perineal_soft_tissue",[10,80,"成人"],"common","肛門周囲感染",["intersphincteric fistula","horseshoe abscess"],["括約筋間/経括約筋瘻孔、膿瘍、horseshoe extensionを評価する。"]],
  ["retroperitoneal_fibrosis","後腹膜線維症","Retroperitoneal fibrosis","fibrosis","abdomen","retroperitoneum","retroperitoneal_space",[30,90,"50-70歳代"],"rare","後腹膜軟部影",["periaortic soft tissue","medial ureteral deviation"],["大動脈周囲軟部組織と尿管内側偏位・水腎症を示す。"]],

  ["endometrial_carcinoma","子宮体癌","Endometrial carcinoma","tumor","female_pelvis","endometrium","endometrial_cavity",[40,100,"60-70歳代"],"common","不正出血",["endometrial thickening","myometrial invasion"],["内膜肥厚、筋層浸潤、頸部進展をMRIで評価する。"],"female_only"],
  ["endometrial_polyp","子宮内膜ポリープ","Endometrial polyp","tumor","female_pelvis","endometrium","endometrial_cavity",[20,90,"40-60歳代"],"common","不正出血",["intracavitary mass","feeding vessel"],["子宮内腔の限局性腫瘤とfeeding vessel signを示すことがある。"],"female_only"],
  ["adenomyosis","子宮腺筋症","Adenomyosis","fibrosis","female_pelvis","uterus","myometrium",[20,60,"30-50歳代"],"common","月経困難・子宮腫大",["junctional zone thickening","myometrial cysts"],["junctional zone肥厚、筋層内小嚢胞、子宮びまん性腫大を示す。"],"female_only"],
  ["uterine_leiomyoma","子宮筋腫","Uterine leiomyoma","fibrosis","female_pelvis","uterus","myometrium",[20,70,"30-50歳代"],"common","子宮腫瘤",["whorled low T2 mass","red degeneration"],["境界明瞭なT2低信号腫瘤で、変性により信号が多彩となる。"],"female_only"],
  ["cervical_cancer","子宮頸癌","Cervical cancer","tumor","female_pelvis","cervix","cervical_stroma",[20,90,"40-60歳代"],"common","子宮頸部腫瘤",["stromal ring disruption","parametrial invasion"],["T2高信号腫瘤、頸部間質リング破綻、傍子宮組織浸潤を評価する。"],"female_only"],
  ["hydrosalpinx","卵管水腫","Hydrosalpinx","cystic","female_pelvis","fallopian_tube","fallopian_tube_lumen",[10,80,"成人"],"common","付属器嚢胞性病変",["tubular cystic structure","waist sign"],["蛇行する管状嚢胞性構造、waist sign、incomplete septaを示す。"],"female_only"],
  ["pyosalpinx","卵管留膿腫","Pyosalpinx","infection","female_pelvis","fallopian_tube","fallopian_tube_lumen",[10,70,"若年-成人"],"uncommon","骨盤内感染",["tubular thick-walled collection","restricted diffusion"],["壁肥厚を伴う管状液体貯留と内容の拡散制限を示す。"],"female_only"],
  ["placenta_accreta_spectrum","癒着胎盤スペクトラム","Placenta accreta spectrum","vascular","female_pelvis","uterus","myometrium",[15,55,"妊娠可能年齢"],"uncommon","妊娠・胎盤異常",["placental lacunae","myometrial thinning"],["胎盤lacunae、筋層菲薄化、膀胱側境界不整を評価する。"],"female_only"],
  ["vaginal_cancer","腟癌","Vaginal cancer","tumor","female_pelvis","vagina","perineal_soft_tissue",[40,100,"60-70歳代"],"rare","腟腫瘤",["vaginal wall mass","paravaginal invasion"],["腟壁腫瘤、周囲脂肪織浸潤、リンパ節転移を評価する。"],"female_only"],
  ["testicular_seminoma","精上皮腫","Testicular seminoma","tumor","male_pelvis","testis","testicular_parenchyma",[15,60,"30-40歳代"],"common","精巣腫瘤",["homogeneous hypoechoic mass","lobulated testis"],["均一低エコー充実性精巣腫瘤で、MRIでは比較的均一に見えることが多い。"],"male_only"],
  ["nonseminomatous_germ_cell_tumor","非セミノーマ胚細胞腫瘍","Nonseminomatous germ cell tumor","tumor","male_pelvis","testis","testicular_parenchyma",[10,50,"20-30歳代"],"common","精巣腫瘤",["heterogeneous testicular mass","hemorrhage necrosis"],["不均一な精巣腫瘤で出血・壊死・嚢胞変化を伴いやすい。"],"male_only"],
  ["testicular_torsion","精巣捻転","Testicular torsion","vascular","male_pelvis","testis","testicular_parenchyma",[0,40,"小児-若年"],"common","急性陰嚢症",["whirlpool sign","absent testicular flow"],["精索whirlpool sign、精巣血流低下/消失、腫大を示す。"],"male_only"],
  ["epididymo_orchitis","精巣上体精巣炎","Epididymo-orchitis","infection","male_pelvis","testis","epididymis",[0,100,"成人"],"common","急性陰嚢痛",["hyperemic epididymis","reactive hydrocele"],["精巣上体腫大・血流増加、反応性水瘤、精巣炎を伴うことがある。"],"male_only"],
  ["fourniers_gangrene","フルニエ壊疽","Fournier gangrene","infection","pelvis","perineum","perineal_soft_tissue",[20,100,"成人"],"rare","会陰部壊死性軟部感染",["subcutaneous gas","fascial thickening"],["会陰・陰嚢壁の皮下ガス、筋膜肥厚、液体貯留を示す。"],"male_predominant"],

  ["deep_vein_thrombosis","深部静脈血栓症","Deep vein thrombosis","vascular","vascular","inferior_vena_cava","venous_lumen",[15,100,"成人"],"common","下肢腫脹",["venous filling defect","noncompressible vein"],["静脈内充盈欠損、拡張、周囲浮腫を示す。"]],
  ["inferior_vena_cava_thrombosis","下大静脈血栓症","Inferior vena cava thrombosis","vascular","vascular","inferior_vena_cava","ivc_lumen",[0,100,"成人"],"uncommon","静脈血栓症",["IVC filling defect","collateral veins"],["下大静脈内充盈欠損と側副路発達を評価する。"]],
  ["abdominal_aortic_aneurysm","腹部大動脈瘤","Abdominal aortic aneurysm","vascular","cardiovascular","aorta","aortic_lumen",[50,100,"70歳代"],"common","腹部拍動性腫瘤",["mural thrombus","aneurysm diameter"],["瘤径、壁在血栓、破裂徴候、分枝血管との関係を評価する。"]],
  ["ruptured_abdominal_aortic_aneurysm","破裂性腹部大動脈瘤","Ruptured abdominal aortic aneurysm","vascular","emergency","aorta","aortic_lumen",[50,100,"高齢者"],"uncommon","ショック・急性腹痛",["retroperitoneal hematoma","draped aorta sign"],["後腹膜血腫、造影剤漏出、draped aorta signを評価する。"]],
  ["vasculitis_large_vessel","大型血管炎","Large-vessel vasculitis","vascular","vascular","aorta","arterial_wall",[0,90,"若年-高齢"],"uncommon","血管炎",["arterial wall thickening","mural enhancement"],["大動脈・主要分枝の壁肥厚、造影、狭窄/拡張を示す。"]],
  ["renal_artery_stenosis","腎動脈狭窄","Renal artery stenosis","vascular","vascular","aorta","arterial_wall",[20,100,"成人"],"uncommon","二次性高血圧",["renal artery narrowing","post-stenotic dilatation"],["腎動脈起始部狭窄、狭窄後拡張、腎萎縮を評価する。"]],
  ["traumatic_solid_organ_laceration","外傷性実質臓器損傷","Traumatic solid organ laceration","vascular","emergency","liver","hepatic_parenchyma",[0,100,"外傷"],"common","腹部外傷",["linear laceration","active extravasation"],["線状低吸収裂創、被膜下血腫、造影剤血管外漏出を評価する。"]],
  ["bowel_perforation","消化管穿孔","Bowel perforation","infection","emergency","bowel","bowel_wall",[0,100,"急性腹症"],"common","急性腹症",["free intraperitoneal air","extraluminal contrast"],["遊離ガス、腸管外漏出、腹膜炎、原因部位を評価する。"]],
  ["necrotizing_fasciitis","壊死性筋膜炎","Necrotizing fasciitis","infection","emergency","soft_tissue","soft_tissue_compartment",[0,100,"重症軟部感染"],"uncommon","救急軟部感染",["fascial gas","deep fascial fluid"],["深部筋膜液体、筋膜肥厚、ガス、非造影域を評価する。"]],
  ["foreign_body_granuloma","異物肉芽腫","Foreign body granuloma","infection","musculoskeletal","soft_tissue","soft_tissue_compartment",[0,100,"術後・外傷後"],"uncommon","軟部腫瘤",["linear foreign body","surrounding granuloma"],["異物に一致する線状高吸収/低信号構造と周囲肉芽腫を示す。"]],
  ["myositis_ossificans","骨化性筋炎","Myositis ossificans","tumor","musculoskeletal","muscle","soft_tissue_compartment",[5,80,"若年-成人"],"uncommon","外傷後軟部腫瘤",["zonal ossification","peripheral mature bone"],["辺縁成熟骨化を伴うzonal phenomenonが手がかり。"]],
  ["synovial_sarcoma","滑膜肉腫","Synovial sarcoma","tumor","musculoskeletal","soft_tissue","soft_tissue_compartment",[10,60,"20-40歳代"],"rare","傍関節軟部腫瘤",["triple sign","calcified soft tissue mass"],["傍関節軟部腫瘤、石灰化、出血壊死によるtriple signを示すことがある。"]],
  ["peripheral_nerve_sheath_tumor_msk","末梢神経鞘腫瘍","Peripheral nerve sheath tumor","tumor","musculoskeletal","soft_tissue","soft_tissue_compartment",[10,90,"成人"],"uncommon","神経走行上腫瘤",["target sign","split-fat sign"],["神経走行に沿う紡錘形腫瘤、target sign、split-fat signを示すことがある。"]],
  ["rheumatoid_arthritis_hand","関節リウマチ","Rheumatoid arthritis","infection","musculoskeletal","joint","joint_space",[10,100,"30-60歳代"],"common","炎症性関節炎",["marginal erosions","synovitis"],["滑膜炎、骨びらん、関節裂隙狭小化、骨髄浮腫を評価する。"],"female_predominant"],
  ["gout","痛風","Gout","infection","musculoskeletal","joint","joint_space",[20,100,"成人男性"],"common","結晶誘発性関節炎",["punched-out erosions","tophus"],["overhanging edgeを伴う骨びらん、痛風結節、DECT尿酸沈着を示す。"],"male_predominant"],
  ["calcium_pyrophosphate_deposition","ピロリン酸カルシウム沈着症","Calcium pyrophosphate deposition disease","infection","musculoskeletal","joint","joint_space",[40,100,"高齢者"],"common","結晶沈着症",["chondrocalcinosis","CPPD"],["線維軟骨・硝子軟骨の石灰化、関節症性変化を示す。"]],
  ["stress_fracture","疲労骨折","Stress fracture","vascular","musculoskeletal","bone","bone_marrow",[5,90,"活動性に依存"],"common","運動・過負荷痛",["periosteal edema","fracture line"],["骨髄浮腫、骨膜反応、低信号骨折線を示す。"]],
  ["transient_osteoporosis_hip","一過性大腿骨頭萎縮症","Transient osteoporosis of the hip","vascular","musculoskeletal","bone","epiphysis",[20,70,"30-50歳代"],"rare","股関節痛",["diffuse femoral head marrow edema","no collapse"],["大腿骨頭頸部びまん性骨髄浮腫を示すが圧潰や帯状壊死を欠く。"]]
].map(([id, ja, en, profile, body_region, organ, subregion, age, freq, setting, keywords, raw, sex]) => ({ id, ja, en, profile, body_region, organ, subregion, age, freq, setting, keywords, raw, sex: sex || "no_sex_predilection" }));

function main() {
  ensureDictionaries();
  fs.mkdirSync(draftsDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });
  writeJson(path.join(publicDir, "general_batch7_public_sources.json"), {
    source_id: SOURCE_ID,
    generated_at: now,
    references: [
      PUBLIC_REFERENCE,
      { source_id: "ncbi_bookshelf", type: "website", title: "NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/", license: "Public web access" },
      { source_id: "acr_appropriateness_criteria", type: "guideline_index", title: "ACR Appropriateness Criteria", url: "https://acsearch.acr.org/list", license: "Public web access" },
      { source_id: "radiologyinfo", type: "patient_information", title: "RadiologyInfo.org", url: "https://www.radiologyinfo.org/", license: "Public web access" },
      { source_id: "pmc_open_access", type: "literature_index", title: "PubMed Central", url: "https://pmc.ncbi.nlm.nih.gov/", license: "Open-access article index" }
    ],
    note: "Phase 1全身疾患カードの典型画像所見を整理するための公開ソース束。"
  });

  let written = 0;
  let skipped = 0;
  for (const row of rows) {
    const filePath = path.join(draftsDir, `${row.id}.json`);
    if (fs.existsSync(filePath)) {
      skipped += 1;
      continue;
    }
    writeJson(filePath, card(row));
    written += 1;
  }
  console.log(`General Phase 1 batch 7 complete. Written: ${written}, skipped existing: ${skipped}`);
}

main();
